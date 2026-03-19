const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const crystalCountEl = document.getElementById("crystalCount");
const healthValueEl = document.getElementById("healthValue");
const dashValueEl = document.getElementById("dashValue");
const timeValueEl = document.getElementById("timeValue");
const statusTextEl = document.getElementById("statusText");
const overlayEl = document.getElementById("overlay");
const overlayTitleEl = document.getElementById("overlayTitle");
const overlayTextEl = document.getElementById("overlayText");
const overlayButtonEl = document.getElementById("overlayButton");
const touchButtons = document.querySelectorAll(".touch-btn");

const TILE = 16;
const GRAVITY = 0.42;
const FRICTION = 0.78;
const PLAYER_ACCEL = 0.55;
const PLAYER_MAX_SPEED = 2.45;
const JUMP_FORCE = -6.2;
const DOUBLE_JUMP_FORCE = -5.4;
const JUMP_BUFFER_FRAMES = 8;
const COYOTE_FRAMES = 7;
const DASH_SPEED = 4.9;
const DASH_DURATION = 10;
const DASH_COOLDOWN = 84;
const JUMP_PAD_FORCE = -8.8;
const KNOCKBACK_FORCE = 3.1;
const MAX_FALL_SPEED = 8.5;
const MAX_HEALTH = 3;

const RAW_LEVEL_MAP = [
  "....................................................................",
  "....................................................................",
  "....................................................................",
  "....................................................................",
  "..........C....................C.....................................",
  ".....###..........###....................###.........E...............",
  "....................................C...............................",
  "...P.............S........J....####.............C...................",
  "########..............#####..................######..................",
  "..............C................................................X.....",
  ".........####.................S...........E............#####........",
  "....................#######...........########......................",
  "...C...........E....................................................",
  "#########....................C.................######...............",
  "......B.......J.....###.............S.......B.......C..............",
  "###############################....###############################..."
];

const LEVEL_MAP = normalizeMap(RAW_LEVEL_MAP);

const keys = {
  left: false,
  right: false
};

let gameRunning = false;
let lastTime = 0;
let screenShake = 0;

const statusState = {
  text: "Khám phá tàn tích",
  hold: 0
};

const particles = [];
const levelState = buildLevel(LEVEL_MAP);
const totalCrystals = levelState.crystals.length;
const world = {
  width: levelState.width,
  height: levelState.height
};

const player = {
  x: levelState.playerSpawn.x,
  y: levelState.playerSpawn.y,
  width: 12,
  height: 14,
  velocityX: 0,
  velocityY: 0,
  facing: 1,
  grounded: false,
  health: MAX_HEALTH,
  crystals: 0,
  hurtTimer: 0,
  spawnX: levelState.playerSpawn.x,
  spawnY: levelState.playerSpawn.y,
  coyoteTimer: 0,
  jumpBuffer: 0,
  airJumps: 1,
  canDash: true,
  dashTimer: 0,
  dashCooldown: 0,
  runTime: 0,
  finishedTime: 0
};

const camera = {
  x: 0,
  y: 0
};

function normalizeMap(rows) {
  const maxWidth = Math.max(...rows.map((row) => row.length));
  return rows.map((row) => row.padEnd(maxWidth, "."));
}

function buildLevel(map) {
  const solids = [];
  const crystals = [];
  const spikes = [];
  const enemies = [];
  const beacons = [];
  const jumpPads = [];
  let exit = { x: 0, y: 0, width: TILE, height: TILE * 2, pulse: 0 };
  let playerSpawn = { x: TILE * 2, y: TILE * 2 };

  map.forEach((row, rowIndex) => {
    [...row].forEach((cell, columnIndex) => {
      const x = columnIndex * TILE;
      const y = rowIndex * TILE;

      if (cell === "#") {
        solids.push({ x, y, width: TILE, height: TILE });
      }

      if (cell === "C") {
        crystals.push({
          x: x + 4,
          y: y + 4,
          width: 8,
          height: 8,
          collected: false,
          bob: Math.random() * Math.PI * 2
        });
      }

      if (cell === "S") {
        spikes.push({ x, y: y + 8, width: TILE, height: 8 });
      }

      if (cell === "E") {
        const initialVelocityX = Math.random() > 0.5 ? 0.6 : -0.6;
        enemies.push({
          x: x + 1,
          y,
          width: 14,
          height: 14,
          velocityX: initialVelocityX,
          spawnX: x + 1,
          spawnY: y,
          initialVelocityX,
          leftBound: x - TILE * 2,
          rightBound: x + TILE * 4,
          defeated: false
        });
      }

      if (cell === "B") {
        beacons.push({
          x: x + 1,
          y: y - 8,
          width: 14,
          height: 24,
          active: false,
          glow: Math.random() * Math.PI * 2
        });
      }

      if (cell === "J") {
        jumpPads.push({
          x,
          y: y + 10,
          width: TILE,
          height: 6,
          bounce: 0
        });
      }

      if (cell === "X") {
        exit = { x, y: y - TILE, width: TILE, height: TILE * 2, pulse: 0 };
      }

      if (cell === "P") {
        playerSpawn = { x: x + 2, y: y - 6 };
      }
    });
  });

  return {
    width: map[0].length * TILE,
    height: map.length * TILE,
    solids,
    crystals,
    spikes,
    enemies,
    beacons,
    jumpPads,
    exit,
    playerSpawn
  };
}

function resetGame(showOverlay = true) {
  gameRunning = false;
  keys.left = false;
  keys.right = false;
  particles.length = 0;
  screenShake = 0;

  player.spawnX = levelState.playerSpawn.x;
  player.spawnY = levelState.playerSpawn.y;
  player.x = player.spawnX;
  player.y = player.spawnY;
  player.velocityX = 0;
  player.velocityY = 0;
  player.facing = 1;
  player.grounded = false;
  player.health = MAX_HEALTH;
  player.crystals = 0;
  player.hurtTimer = 0;
  player.coyoteTimer = 0;
  player.jumpBuffer = 0;
  player.airJumps = 1;
  player.canDash = true;
  player.dashTimer = 0;
  player.dashCooldown = 0;
  player.runTime = 0;
  player.finishedTime = 0;

  levelState.crystals.forEach((crystal) => {
    crystal.collected = false;
    crystal.bob = Math.random() * Math.PI * 2;
  });

  levelState.enemies.forEach((enemy) => {
    enemy.x = enemy.spawnX;
    enemy.y = enemy.spawnY;
    enemy.velocityX = enemy.initialVelocityX;
    enemy.defeated = false;
  });

  levelState.beacons.forEach((beacon) => {
    beacon.active = false;
    beacon.glow = Math.random() * Math.PI * 2;
  });

  levelState.jumpPads.forEach((pad) => {
    pad.bounce = 0;
  });

  levelState.exit.pulse = 0;

  camera.x = clamp(player.spawnX - canvas.width / 2 + player.width / 2, 0, world.width - canvas.width);
  camera.y = clamp(player.spawnY - canvas.height / 2 + player.height / 2, 0, world.height - canvas.height);

  setStatus("Khám phá tàn tích");

  if (showOverlay) {
    setOverlay(
      "Thu thập đủ tinh thể và mở cổng sáng",
      "Nhảy đôi để vượt vực, dash để băng ngang và chạm vào cột lửa để lưu checkpoint trước đoạn khó.",
      "Bắt đầu chơi",
      true
    );
  } else {
    setOverlay("", "", "", false);
  }

  render();
}

function refreshHud() {
  crystalCountEl.textContent = `${player.crystals} / ${totalCrystals}`;
  healthValueEl.textContent = `${player.health} / ${MAX_HEALTH}`;

  if (player.dashTimer > 0) {
    dashValueEl.textContent = "Đang lướt";
  } else if (!player.canDash && player.dashCooldown <= 0) {
    dashValueEl.textContent = "Chạm đất";
  } else if (player.dashCooldown > 0) {
    dashValueEl.textContent = `Hồi ${Math.max(1, Math.ceil(player.dashCooldown / 12))}`;
  } else {
    dashValueEl.textContent = "Sẵn sàng";
  }

  const displayedTime = gameRunning ? player.runTime : player.finishedTime || player.runTime;
  timeValueEl.textContent = formatTime(displayedTime);
  statusTextEl.textContent = statusState.text;
}

function setStatus(text, hold = 0) {
  statusState.text = text;
  statusState.hold = hold;
  refreshHud();
}

function getDefaultStatus() {
  if (player.crystals === totalCrystals) {
    return "Cổng sáng đã được kích hoạt";
  }

  if (intersects(player, levelState.exit)) {
    return "Cần đủ tinh thể để mở cổng";
  }

  return "Tìm beacon và gom tinh thể";
}

function tickStatus(delta) {
  if (statusState.hold > 0) {
    statusState.hold = Math.max(0, statusState.hold - delta);
  }

  if (statusState.hold === 0) {
    statusState.text = getDefaultStatus();
  }

  refreshHud();
}

function setOverlay(title, text, buttonText, visible) {
  overlayTitleEl.textContent = title;
  overlayTextEl.textContent = text;
  overlayButtonEl.textContent = buttonText;
  overlayEl.classList.toggle("hidden", !visible);
}

function startGame() {
  const wasRunning = gameRunning;
  resetGame(false);
  gameRunning = true;
  lastTime = performance.now();
  if (!wasRunning) {
    requestAnimationFrame(loop);
  }
}

function endGame(won) {
  gameRunning = false;
  player.finishedTime = player.runTime;

  if (won) {
    setStatus("Thoát thành công khỏi tàn tích");
    setOverlay(
      "Bạn đã vượt qua Pixel Relic Run",
      `Thời gian hoàn thành: ${formatTime(player.finishedTime)}. Nhấn để lao vào thêm một lượt nữa.`,
      "Chơi lại",
      true
    );
  } else {
    setStatus("Linh lực đã cạn");
    setOverlay(
      "Bạn đã gục ngã",
      `Bạn gom được ${player.crystals}/${totalCrystals} tinh thể trong ${formatTime(player.finishedTime)}. Nhấn để thử lại.`,
      "Thử lại",
      true
    );
  }

  refreshHud();
}

function loop(timestamp) {
  if (!gameRunning) {
    render();
    return;
  }

  const delta = Math.min((timestamp - lastTime) / 16.6667, 1.8);
  lastTime = timestamp;

  update(delta);
  render();

  if (gameRunning) {
    requestAnimationFrame(loop);
  }
}

function update(delta) {
  player.runTime += delta / 60;
  levelState.exit.pulse += 0.08 * delta;

  if (player.hurtTimer > 0) {
    player.hurtTimer = Math.max(0, player.hurtTimer - delta);
  }

  if (player.jumpBuffer > 0) {
    player.jumpBuffer = Math.max(0, player.jumpBuffer - delta);
  }

  if (player.dashCooldown > 0) {
    player.dashCooldown = Math.max(0, player.dashCooldown - delta);
  }

  if (player.dashTimer > 0) {
    player.dashTimer = Math.max(0, player.dashTimer - delta);
    player.velocityX = DASH_SPEED * player.facing;
    spawnTrailParticle();
  }

  if (screenShake > 0) {
    screenShake = Math.max(0, screenShake - 0.32 * delta);
  }

  handleInput(delta);
  processJump();
  applyPhysics(delta);
  updateEnemies(delta);
  updateParticles(delta);
  animateLevel(delta);
  handleBeacons();
  handleJumpPads();
  collectCrystals();
  handleHazards();

  if (!gameRunning) {
    return;
  }

  if (player.y > world.height + TILE * 2 && player.hurtTimer <= 0) {
    damagePlayer(player.x < levelState.exit.x ? -1 : 1, true);
  }

  if (!gameRunning) {
    return;
  }

  updateCamera(delta);

  if (player.crystals === totalCrystals && intersects(player, levelState.exit)) {
    endGame(true);
  }

  if (!gameRunning) {
    return;
  }

  tickStatus(delta);
}

function handleInput(delta) {
  if (player.dashTimer > 0) {
    return;
  }

  if (keys.left) {
    player.velocityX -= PLAYER_ACCEL * delta;
    player.facing = -1;
  }

  if (keys.right) {
    player.velocityX += PLAYER_ACCEL * delta;
    player.facing = 1;
  }

  if (!keys.left && !keys.right) {
    player.velocityX *= Math.pow(FRICTION, delta);
  }

  player.velocityX = clamp(player.velocityX, -PLAYER_MAX_SPEED, PLAYER_MAX_SPEED);
}

function processJump() {
  if (!gameRunning || player.jumpBuffer <= 0) {
    return;
  }

  const canGroundJump = player.grounded || player.coyoteTimer > 0;
  if (canGroundJump) {
    player.velocityY = JUMP_FORCE;
    player.grounded = false;
    player.coyoteTimer = 0;
    player.jumpBuffer = 0;
    spawnParticles(player.x + player.width / 2, player.y + player.height, 5, ["#d9c8a0", "#ffffff"], 1.2, 0.06);
    return;
  }

  if (player.airJumps > 0) {
    player.airJumps -= 1;
    player.velocityY = DOUBLE_JUMP_FORCE;
    player.jumpBuffer = 0;
    player.canDash = true;
    screenShake = 1.2;
    spawnParticles(player.x + player.width / 2, player.y + player.height / 2, 10, ["#85f7ff", "#ffffff"], 1.6, 0.02);
    setStatus("Nhảy đôi kích hoạt", 28);
  }
}

function applyPhysics(delta) {
  if (player.dashTimer <= 0) {
    player.velocityY = Math.min(player.velocityY + GRAVITY * delta, MAX_FALL_SPEED);
  } else {
    player.velocityY = 0;
  }

  movePlayerAxis("x", player.velocityX * delta);
  movePlayerAxis("y", player.velocityY * delta);

  if (!player.grounded) {
    player.coyoteTimer = Math.max(0, player.coyoteTimer - delta);
  }
}

function movePlayerAxis(axis, amount) {
  if (axis === "x") {
    player.x += amount;
    const collisions = getSolidCollisions(player);
    collisions.forEach((tile) => {
      if (amount > 0) {
        player.x = tile.x - player.width;
      } else if (amount < 0) {
        player.x = tile.x + tile.width;
      }
      player.velocityX = 0;
      player.dashTimer = 0;
    });

    player.x = clamp(player.x, 0, world.width - player.width);
    return;
  }

  const wasGrounded = player.grounded;
  player.y += amount;
  player.grounded = false;

  const collisions = getSolidCollisions(player);
  collisions.forEach((tile) => {
    if (amount > 0) {
      player.y = tile.y - player.height;
      player.velocityY = 0;
      player.grounded = true;
      player.airJumps = 1;
      player.canDash = true;
      player.coyoteTimer = COYOTE_FRAMES;
      player.dashTimer = 0;
    } else if (amount < 0) {
      player.y = tile.y + tile.height;
      player.velocityY = 0;
    }
  });

  if (!wasGrounded && player.grounded) {
    spawnParticles(player.x + player.width / 2, player.y + player.height, 6, ["#d9c8a0", "#ffffff"], 1.1, 0.05);
  }
}

function updateEnemies(delta) {
  levelState.enemies.forEach((enemy) => {
    if (enemy.defeated) {
      return;
    }

    enemy.x += enemy.velocityX * delta;

    if (enemy.x <= enemy.leftBound || enemy.x >= enemy.rightBound) {
      enemy.velocityX *= -1;
    }

    const ledgeProbe = {
      x: enemy.velocityX > 0 ? enemy.x + enemy.width + 1 : enemy.x - 1,
      y: enemy.y + enemy.height + 2,
      width: 1,
      height: 1
    };

    const hasGroundAhead = levelState.solids.some((tile) => intersects(ledgeProbe, tile));
    if (!hasGroundAhead) {
      enemy.velocityX *= -1;
    }
  });
}

function animateLevel(delta) {
  levelState.beacons.forEach((beacon) => {
    beacon.glow += 0.08 * delta;
  });

  levelState.jumpPads.forEach((pad) => {
    pad.bounce = Math.max(0, pad.bounce - 0.12 * delta);
  });
}

function handleBeacons() {
  levelState.beacons.forEach((beacon) => {
    if (beacon.active || !intersects(player, beacon)) {
      return;
    }

    levelState.beacons.forEach((entry) => {
      entry.active = false;
    });

    beacon.active = true;
    player.spawnX = beacon.x + 1;
    player.spawnY = beacon.y + beacon.height - player.height;
    screenShake = 1.6;
    spawnParticles(beacon.x + beacon.width / 2, beacon.y + 4, 16, ["#f8d26b", "#ffffff", "#e57c46"], 1.8, 0.01);
    setStatus("Đã lưu checkpoint mới", 60);
  });
}

function handleJumpPads() {
  levelState.jumpPads.forEach((pad) => {
    const touchesPad =
      player.velocityY > 0.35 &&
      player.x + player.width > pad.x &&
      player.x < pad.x + pad.width &&
      player.y + player.height >= pad.y &&
      player.y + player.height <= pad.y + pad.height + 8;

    if (!touchesPad) {
      return;
    }

    player.y = pad.y - player.height;
    player.velocityY = JUMP_PAD_FORCE;
    player.grounded = false;
    player.coyoteTimer = 0;
    player.airJumps = 1;
    player.canDash = true;
    pad.bounce = 1;
    screenShake = 1.8;
    spawnParticles(pad.x + pad.width / 2, pad.y + 2, 12, ["#ffe59a", "#f0b454", "#ffffff"], 1.9, 0.01);
    setStatus("Bệ nảy kích hoạt", 28);
  });
}

function collectCrystals() {
  let collectedAny = false;

  levelState.crystals.forEach((crystal) => {
    crystal.bob += 0.08;
    if (!crystal.collected && intersects(player, crystal)) {
      crystal.collected = true;
      player.crystals += 1;
      collectedAny = true;
      screenShake = 1.4;
      spawnParticles(crystal.x + crystal.width / 2, crystal.y + crystal.height / 2, 14, ["#85f7ff", "#d9ffff", "#ffffff"], 1.7, 0.01);
    }
  });

  if (collectedAny) {
    if (player.crystals === totalCrystals) {
      setStatus("Cổng sáng đã được kích hoạt", 72);
    } else {
      setStatus("Đã lấy được tinh thể", 40);
    }
  }
}

function handleHazards() {
  if (player.hurtTimer > 0) {
    return;
  }

  const touchedSpike = levelState.spikes.some((spike) => intersects(player, spike));
  if (touchedSpike) {
    damagePlayer(player.facing * -1 || -1);
    return;
  }

  const touchedEnemy = levelState.enemies.find((enemy) => !enemy.defeated && intersects(player, enemy));
  if (!touchedEnemy) {
    return;
  }

  const stompedEnemy =
    player.velocityY > 0.6 &&
    player.y + player.height <= touchedEnemy.y + 8;

  if (stompedEnemy) {
    touchedEnemy.defeated = true;
    player.velocityY = -4.8;
    player.airJumps = 1;
    player.canDash = true;
    screenShake = 1.8;
    spawnParticles(touchedEnemy.x + touchedEnemy.width / 2, touchedEnemy.y + touchedEnemy.height / 2, 12, ["#ef9f8f", "#f8d26b", "#ffffff"], 1.8, 0.02);
    setStatus("Dẫm trúng quái", 40);
    return;
  }

  damagePlayer(player.x < touchedEnemy.x ? -1 : 1);
}

function respawnPlayer() {
  player.x = player.spawnX;
  player.y = player.spawnY;
  player.velocityX = 0;
  player.velocityY = 0;
  player.grounded = false;
  player.coyoteTimer = 0;
  player.jumpBuffer = 0;
  player.airJumps = 1;
  player.canDash = true;
  player.dashTimer = 0;
  camera.x = clamp(player.spawnX - canvas.width / 2 + player.width / 2, 0, world.width - canvas.width);
  camera.y = clamp(player.spawnY - canvas.height / 2 + player.height / 2, 0, world.height - canvas.height);
  spawnParticles(player.x + player.width / 2, player.y + player.height / 2, 14, ["#ffffff", "#f8d26b", "#e57c46"], 1.7, 0.03);
}

function damagePlayer(direction, shouldRespawn = false) {
  player.health -= 1;
  player.hurtTimer = 56;
  player.velocityX = KNOCKBACK_FORCE * direction;
  player.velocityY = -4.4;
  player.dashTimer = 0;
  player.dashCooldown = Math.max(player.dashCooldown, 24);
  screenShake = 3.4;
  spawnParticles(player.x + player.width / 2, player.y + player.height / 2, 16, ["#ef9f8f", "#ffffff", "#d26b3b"], 1.9, 0.04);

  if (player.health <= 0) {
    endGame(false);
    return;
  }

  if (shouldRespawn) {
    respawnPlayer();
  }

  setStatus("Trúng đòn, cẩn thận", 55);
}

function attemptDash() {
  if (!gameRunning || player.hurtTimer > 0) {
    return;
  }

  if (!player.canDash || player.dashCooldown > 0) {
    return;
  }

  const direction = keys.left ? -1 : keys.right ? 1 : player.facing;
  player.facing = direction;
  player.canDash = false;
  player.dashTimer = DASH_DURATION;
  player.dashCooldown = DASH_COOLDOWN;
  player.velocityX = DASH_SPEED * direction;
  player.velocityY = 0;
  player.grounded = false;
  player.coyoteTimer = 0;
  screenShake = 2.4;
  spawnParticles(player.x + player.width / 2, player.y + player.height / 2, 18, ["#ffe59a", "#f0b454", "#ffffff"], 2, 0.01);
  setStatus("Lướt bứt tốc", 26);
}

function updateCamera(delta) {
  const targetX = clamp(player.x - canvas.width / 2 + player.width / 2, 0, world.width - canvas.width);
  const targetY = clamp(player.y - canvas.height / 2 + player.height / 2, 0, world.height - canvas.height);
  camera.x += (targetX - camera.x) * 0.08 * delta;
  camera.y += (targetY - camera.y) * 0.06 * delta;
}

function updateParticles(delta) {
  for (let index = particles.length - 1; index >= 0; index -= 1) {
    const particle = particles[index];
    particle.life -= delta;
    particle.x += particle.velocityX * delta;
    particle.y += particle.velocityY * delta;
    particle.velocityY += particle.gravity * delta;

    if (particle.life <= 0) {
      particles.splice(index, 1);
    }
  }
}

function render() {
  const shakeX = screenShake > 0 ? (Math.random() - 0.5) * screenShake : 0;
  const shakeY = screenShake > 0 ? (Math.random() - 0.5) * screenShake : 0;

  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(-camera.x + shakeX, -camera.y + shakeY);

  drawSky();
  drawParallax();
  drawTiles();
  drawJumpPads();
  drawBeacons();
  drawCrystals();
  drawExit();
  drawEnemies();
  drawParticles();
  drawPlayer();

  ctx.restore();
}

function drawSky() {
  ctx.fillStyle = "#87c8ff";
  ctx.fillRect(camera.x, camera.y, canvas.width, canvas.height);

  for (let index = 0; index < 5; index += 1) {
    const cloudX = camera.x * 0.25 + index * 72 + (index % 2) * 30;
    const cloudY = camera.y * 0.08 + 18 + index * 8;
    drawCloud(cloudX, cloudY);
  }
}

function drawParallax() {
  const horizonY = world.height - 88;

  ctx.fillStyle = "#4f7b70";
  for (let index = 0; index < 9; index += 1) {
    const baseX = index * 70 - (camera.x * 0.25) % 70;
    drawHill(baseX, horizonY + 16, 62, 28);
  }

  ctx.fillStyle = "#355748";
  for (let index = 0; index < 7; index += 1) {
    const baseX = index * 94 - (camera.x * 0.42) % 94;
    drawHill(baseX, horizonY + 30, 80, 40);
  }
}

function drawTiles() {
  levelState.solids.forEach((tile) => {
    const topColor = tile.y > world.height - TILE * 3 ? "#557b53" : "#987654";
    const sideColor = tile.y > world.height - TILE * 3 ? "#355c37" : "#6d4a32";
    drawBlock(tile.x, tile.y, topColor, sideColor);
  });

  levelState.spikes.forEach((spike) => {
    ctx.fillStyle = "#d8ddd2";
    ctx.beginPath();
    ctx.moveTo(spike.x, spike.y + spike.height);
    ctx.lineTo(spike.x + TILE / 2, spike.y);
    ctx.lineTo(spike.x + TILE, spike.y + spike.height);
    ctx.fill();
    ctx.fillStyle = "#7f8b8c";
    ctx.fillRect(spike.x, spike.y + spike.height - 2, TILE, 2);
  });
}

function drawJumpPads() {
  levelState.jumpPads.forEach((pad) => {
    const bounce = Math.sin(pad.bounce * Math.PI) * 3;
    ctx.fillStyle = "#5d486b";
    ctx.fillRect(pad.x, pad.y + 2, TILE, 4);
    ctx.fillStyle = "#f8d26b";
    ctx.fillRect(pad.x + 2, pad.y - bounce, TILE - 4, 3);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(pad.x + 5, pad.y - 1 - bounce, 6, 1);
  });
}

function drawBeacons() {
  levelState.beacons.forEach((beacon) => {
    const flameLift = Math.sin(beacon.glow) * 2;
    ctx.fillStyle = "#76543a";
    ctx.fillRect(beacon.x + 5, beacon.y + 8, 4, 16);
    ctx.fillStyle = beacon.active ? "#ffe59a" : "#8b7052";
    ctx.fillRect(beacon.x + 2, beacon.y + 6, 10, 3);
    ctx.fillStyle = beacon.active ? "#fffbdd" : "#d3b48a";
    ctx.fillRect(beacon.x + 4, beacon.y + 1 - flameLift, 6, 7);
    ctx.fillStyle = beacon.active ? "rgba(248, 210, 107, 0.22)" : "rgba(139, 112, 82, 0.15)";
    ctx.fillRect(beacon.x - 3, beacon.y - 4, 20, 30);
  });
}

function drawCrystals() {
  levelState.crystals.forEach((crystal) => {
    if (crystal.collected) {
      return;
    }

    const bobOffset = Math.sin(crystal.bob) * 2;
    ctx.fillStyle = "#85f7ff";
    ctx.fillRect(crystal.x + 2, crystal.y - bobOffset, 4, 8);
    ctx.fillRect(crystal.x, crystal.y + 2 - bobOffset, 8, 4);
    ctx.fillStyle = "#d9ffff";
    ctx.fillRect(crystal.x + 3, crystal.y + 1 - bobOffset, 2, 2);
  });
}

function drawExit() {
  const exitActive = player.crystals === totalCrystals;
  const auraWidth = 22 + Math.sin(levelState.exit.pulse) * 4;
  ctx.fillStyle = exitActive ? "#f7eb8a" : "#8b7052";
  ctx.fillRect(levelState.exit.x + 4, levelState.exit.y, 8, 32);
  ctx.fillStyle = exitActive ? "#82f0ff" : "#473528";
  ctx.fillRect(levelState.exit.x, levelState.exit.y + 4, 16, 24);
  if (exitActive) {
    ctx.fillStyle = "rgba(130, 240, 255, 0.24)";
    ctx.fillRect(levelState.exit.x - (auraWidth - 16) / 2, levelState.exit.y, auraWidth, 32);
  }
}

function drawEnemies() {
  levelState.enemies.forEach((enemy) => {
    if (enemy.defeated) {
      return;
    }

    ctx.fillStyle = "#6b2f50";
    ctx.fillRect(enemy.x + 2, enemy.y + 2, 10, 10);
    ctx.fillStyle = "#ef9f8f";
    ctx.fillRect(enemy.x + 4, enemy.y + 4, 6, 4);
    ctx.fillStyle = "#181818";
    ctx.fillRect(enemy.x + 4, enemy.y + 10, 2, 2);
    ctx.fillRect(enemy.x + 8, enemy.y + 10, 2, 2);
    ctx.fillRect(enemy.x + (enemy.velocityX > 0 ? 10 : 2), enemy.y + 6, 2, 2);
  });
}

function drawParticles() {
  particles.forEach((particle) => {
    ctx.globalAlpha = Math.min(1, particle.life / 12);
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
  });
  ctx.globalAlpha = 1;
}

function drawPlayer() {
  const blink = player.hurtTimer > 0 && Math.floor(player.hurtTimer / 4) % 2 === 0;
  if (blink) {
    return;
  }

  if (player.dashTimer > 0) {
    ctx.fillStyle = "rgba(255, 229, 154, 0.35)";
    ctx.fillRect(player.x - player.facing * 4, player.y + 3, 8, 8);
  }

  ctx.fillStyle = "#294c60";
  ctx.fillRect(player.x + 3, player.y + 2, 6, 6);
  ctx.fillStyle = "#ffcf99";
  ctx.fillRect(player.x + 4, player.y + 4, 4, 4);
  ctx.fillStyle = "#d26b3b";
  ctx.fillRect(player.x + 2, player.y + 8, 8, 4);
  ctx.fillStyle = "#263f68";
  ctx.fillRect(player.x + 2, player.y + 12, 3, 2);
  ctx.fillRect(player.x + 7, player.y + 12, 3, 2);
  ctx.fillStyle = "#101010";
  ctx.fillRect(player.x + (player.facing > 0 ? 7 : 5), player.y + 5, 1, 1);

  if (player.canDash && player.dashCooldown <= 0) {
    ctx.fillStyle = "#ffe59a";
    ctx.fillRect(player.x + 1, player.y + 6, 1, 1);
    ctx.fillRect(player.x + 10, player.y + 3, 1, 1);
  }
}

function drawBlock(x, y, topColor, sideColor) {
  ctx.fillStyle = sideColor;
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = topColor;
  ctx.fillRect(x, y, TILE, 4);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(x + 2, y + 6, 4, 2);
  ctx.fillRect(x + 10, y + 10, 3, 2);
}

function drawCloud(x, y) {
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.fillRect(x, y, 18, 6);
  ctx.fillRect(x + 5, y - 4, 14, 6);
  ctx.fillRect(x + 12, y + 2, 14, 5);
}

function drawHill(x, y, width, height) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + width / 2, y - height, x + width, y);
  ctx.lineTo(x + width, world.height);
  ctx.lineTo(x, world.height);
  ctx.closePath();
  ctx.fill();
}

function getSolidCollisions(rect) {
  return levelState.solids.filter((tile) => intersects(rect, tile));
}

function spawnParticles(x, y, count, palette, speed, gravity) {
  for (let index = 0; index < count; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const magnitude = Math.random() * speed;
    particles.push({
      x,
      y,
      velocityX: Math.cos(angle) * magnitude,
      velocityY: Math.sin(angle) * magnitude - speed * 0.35,
      gravity,
      life: 14 + Math.random() * 16,
      size: 1 + Math.random() * 2,
      color: palette[Math.floor(Math.random() * palette.length)]
    });
  }
}

function spawnTrailParticle() {
  particles.push({
    x: player.x + (player.facing > 0 ? 1 : player.width - 2),
    y: player.y + 5 + Math.random() * 3,
    velocityX: -player.facing * (0.8 + Math.random() * 0.6),
    velocityY: (Math.random() - 0.5) * 0.3,
    gravity: 0,
    life: 8 + Math.random() * 4,
    size: 2,
    color: Math.random() > 0.5 ? "#ffe59a" : "#ffffff"
  });
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const tenths = Math.floor((totalSeconds * 10) % 10);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
}

function queueJump() {
  if (!gameRunning) {
    return;
  }

  player.jumpBuffer = JUMP_BUFFER_FRAMES;
}

function intersects(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function setKeyState(event, pressed) {
  const { code } = event;

  if (code === "ArrowLeft" || code === "KeyA") {
    keys.left = pressed;
  }

  if (code === "ArrowRight" || code === "KeyD") {
    keys.right = pressed;
  }

  if (code === "ArrowUp" || code === "KeyW" || code === "Space") {
    if (pressed) {
      queueJump();
    }
  }

  if ((code === "ShiftLeft" || code === "ShiftRight" || code === "KeyK") && pressed) {
    attemptDash();
  }

  if (code === "KeyR" && pressed) {
    startGame();
  }
}

window.addEventListener("keydown", (event) => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "Space", "ShiftLeft", "ShiftRight"].includes(event.code)) {
    event.preventDefault();
  }
  setKeyState(event, true);
});

window.addEventListener("keyup", (event) => {
  setKeyState(event, false);
});

overlayButtonEl.addEventListener("click", () => {
  startGame();
});

touchButtons.forEach((button) => {
  const action = button.dataset.action;

  const start = (event) => {
    event.preventDefault();
    button.classList.add("active");

    if (action === "left") {
      keys.left = true;
    } else if (action === "right") {
      keys.right = true;
    } else if (action === "jump") {
      queueJump();
    } else if (action === "dash") {
      attemptDash();
    }
  };

  const end = (event) => {
    event.preventDefault();
    button.classList.remove("active");

    if (action === "left") {
      keys.left = false;
    } else if (action === "right") {
      keys.right = false;
    }
  };

  button.addEventListener("pointerdown", start);
  button.addEventListener("pointerup", end);
  button.addEventListener("pointerleave", end);
  button.addEventListener("pointercancel", end);
});

resetGame();
