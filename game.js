const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")
ctx.imageSmoothingEnabled = false

const levelValueEl = document.getElementById("levelValue")
const crystalCountEl = document.getElementById("crystalCount")
const dashValueEl = document.getElementById("dashValue")
const timeValueEl = document.getElementById("timeValue")
const healthFillEl = document.getElementById("healthFill")
const healthTextEl = document.getElementById("healthText")
const spiritFillEl = document.getElementById("spiritFill")
const spiritTextEl = document.getElementById("spiritText")
const statusTextEl = document.getElementById("statusText")
const bottomHudEl = document.getElementById("bottomHud")
const hudToggleButtonEl = document.getElementById("hudToggleButton")
const stageChipEl = document.getElementById("stageChip")
const bossBarEl = document.getElementById("bossBar")
const bossNameEl = document.getElementById("bossName")
const bossTextEl = document.getElementById("bossText")
const bossFillEl = document.getElementById("bossFill")
const overlayEl = document.getElementById("overlay")
const overlayKickerEl = document.getElementById("overlayKicker")
const overlayTitleEl = document.getElementById("overlayTitle")
const overlayTextEl = document.getElementById("overlayText")
const overlayButtonEl = document.getElementById("overlayButton")
const gamePanelEl = document.querySelector(".game-panel")
const fullscreenButtonEl = document.getElementById("fullscreenButton")
const rotateHintEl = document.getElementById("rotateHint")
const rotateFullscreenButtonEl = document.getElementById("rotateFullscreenButton")
const touchButtons = document.querySelectorAll(".touch-btn")

const HUD_COLLAPSED_STORAGE_KEY = "pixel-relic-saga-bottom-hud-collapsed"

const TILE = 16
const GRAVITY = 0.42
const FRICTION = 0.78
const PLAYER_ACCEL = 0.56
const PLAYER_MAX_SPEED = 2.5
const JUMP_FORCE = -6.3
const DOUBLE_JUMP_FORCE = -5.6
const JUMP_BUFFER_FRAMES = 8
const COYOTE_FRAMES = 7
const DASH_SPEED = 5.1
const DASH_DURATION = 10
const DASH_COOLDOWN = 82
const JUMP_PAD_FORCE = -8.7
const MAX_FALL_SPEED = 8.8
const SLASH_DAMAGE = 18
const BLAST_DAMAGE = 15
const BLAST_COST = 20
const GUARD_HEAL_RATE = 0.18
const GUARD_SPIRIT_RATE = 0.45
const AREA_TRANSITION_DURATION = 26
const ENEMY_PATROL_SPEED = 0.52
const ENEMY_CHASE_SPEED = 0.92
const ENEMY_SIGHT_RANGE = 124
const ENEMY_ATTACK_RANGE = 22
const ENEMY_RANGED_RANGE = 136
const ENEMY_ATTACK_COOLDOWN = 54
const ENEMY_PROJECTILE_SPEED = 2.35
const ENEMY_GRAVITY = 0.32

const LEVELS = [
  {
    name: "Màn 1 - Làng Tre",
    objective: "Nói chuyện với dân làng rồi chọn cổng lam để tập luyện hoặc cổng vàng để nhận nhiệm vụ",
    palette: {
      skyTop: "#99d8ff",
      skyBottom: "#ffe0a6",
      hillBack: "#81b18f",
      hillFront: "#426451",
      tileTop: "#b18a63",
      tileSide: "#6c4b33"
    },
    exits: {
      X: 1,
      Y: 2
    },
    npcTypes: {
      N: {
        name: "Trưởng làng Hạc",
        dialogue:
          "Làng Tre là nơi nghỉ chân của ninja trẻ. Cổng lam dẫn tới sân tập quái, còn cổng vàng đưa con vào tuyến nhiệm vụ chính."
      },
      M: {
        name: "Cô bán đồ Mộc",
        dialogue:
          "Ta chưa mở cửa hàng thật đâu, nhưng tinh thể trên đường đi sẽ giúp con hồi nội lực. Nhặt chúng khi tiện, đừng vì chúng mà bỏ lỡ nhịp chiến đấu."
      },
      H: {
        name: "Sư phụ Aoi",
        dialogue:
          "Nếu muốn vào form chiến đấu nhanh hơn, hãy rẽ qua sân tập trước. Quái ở đó đủ hung để con tập chém, lướt và gồng hồi máu."
      }
    },
    map: [
      "..............................................................",
      "..............................................................",
      ".............####......................####...................",
      "..............................................................",
      "....####..................####....................####........",
      "..............................................................",
      ".........................####.................................",
      "..............................................................",
      "..............................................................",
      "..............................................................",
      "..P....N........M.................H..................Y....X...",
      "##############################################################",
      "..............................................................",
      ".............................................................."
    ]
  },
  {
    name: "Màn 2 - Sân Tập Bóng Ảnh",
    objective: "Quét quái trong sân tập rồi đi qua cổng vàng để vào nhiệm vụ, hoặc cổng lam để quay về làng",
    palette: {
      skyTop: "#86c7ff",
      skyBottom: "#ffd996",
      hillBack: "#6f9187",
      hillFront: "#324d48",
      tileTop: "#a98562",
      tileSide: "#654835"
    },
    exits: {
      X: 0,
      Y: 2
    },
    npcTypes: {
      H: {
        name: "Huấn luyện viên Ren",
        dialogue:
          "Đây là nơi farm kỹ năng. Cứ dọn quái cho quen tay, khi ổn rồi đi qua cổng vàng để vào tuyến nhiệm vụ thật."
      }
    },
    map: [
      "..............................................................",
      "..............................................................",
      "......................C.......................................",
      ".............###....................R...............####......",
      "..............................................................",
      ".....C.........................####................C..........",
      "..............J...............................................",
      "............................................R.................",
      ".........####.............E...........####....................",
      "..............................................................",
      "..X..P........E..........H.............E..............Y.......",
      "##############################################################",
      "..............................................................",
      ".............B.................####...........................",
      ".............................................................."
    ]
  },
  {
    name: "Màn 3 - Cổng Chìm",
    objective: "Băng qua khu cổng và đi qua cổng sáng để áp sát chiến tuyến",
    palette: {
      skyTop: "#abdfff",
      skyBottom: "#ffe4a8",
      hillBack: "#6f9a82",
      hillFront: "#375b49",
      tileTop: "#a98761",
      tileSide: "#654833"
    },
    exits: {
      X: 3
    },
    map: [
      "..............................................................",
      "..............................................................",
      "..............................................................",
      "..............................................................",
      ".............C..............R................................",
      ".....###............###.............C........................",
      "..P........B..............................J..................",
      "######............S...........####....................###....",
      ".............C...........E.................#####.............",
      "....####.......................C.........................X...",
      "....................####.................####...............#",
      "..C........................................................#",
      "#########..............J.............B.....................#",
      "...............R..................#####....................#",
      "...........................................................#",
      "#########################....###############################"
    ]
  },
  {
    name: "Màn 4 - Ải Than Hồng",
    objective: "Tiếp tục vượt ải và đi thẳng qua cổng sáng để tiến sâu hơn",
    palette: {
      skyTop: "#7d8fff",
      skyBottom: "#ffd6a1",
      hillBack: "#67739b",
      hillFront: "#334268",
      tileTop: "#a98460",
      tileSide: "#624430"
    },
    exits: {
      X: 4
    },
    map: [
      "..............................................................",
      "..............................................................",
      "...................................C.........................",
      "...............###............................R..............",
      "...P.....C...................J.....................####......",
      "#####...............S..............####......................",
      "..........B...............R....................C............",
      "................####.................S...............J.......",
      "....####....................###................#####........",
      ".....................C..................E................X..",
      "..J...........#####..............C.................####.....",
      "......................S.....................B...............",
      "...C..........E...................####......................",
      "########..............####.................................#",
      ".................J.............C....................######.#",
      "########################....###############################."
    ]
  },
  {
    name: "Màn 5 - Pháo Đài Lõi",
    objective: "Đánh bại Lõi Hộ Vệ ở khu cuối cùng",
    palette: {
      skyTop: "#4b5683",
      skyBottom: "#d47964",
      hillBack: "#665d7c",
      hillFront: "#2a2c42",
      tileTop: "#8f7f86",
      tileSide: "#4d424a"
    },
    boss: {
      name: "Lõi Hộ Vệ",
      maxHealth: 260,
      x: 35,
      y: 6
    },
    map: [
      "...............................................",
      "...............................................",
      "...............................................",
      "......####......................####...........",
      "...............................................",
      "..P.....B......................................",
      "#####.................####.....................",
      "#.............................................#",
      "#..................#####......................#",
      "#.............................................#",
      "#.......####......................####........#",
      "#.............................................#",
      "#.............................................#",
      "###############################################"
    ]
  }
]

const input = {
  left: false,
  right: false,
  guard: false
}

const state = {
  currentLevelIndex: 0,
  currentLevel: null,
  totalCrystals: 0,
  boss: null,
  nextEntityId: 1,
  overlayMode: "start",
  dialogueNpcId: null,
  nextLevelIndex: null,
  gameRunning: false,
  lastTime: 0,
  screenShake: 0,
  status: {
    text: "Sẵn sàng vào tàn tích",
    hold: 0
  },
  transition: {
    active: false,
    timer: 0,
    targetLevelIndex: null,
    loaded: false
  }
}

const camera = {
  x: 0,
  y: 0
}

const player = {
  x: 0,
  y: 0,
  width: 12,
  height: 14,
  velocityX: 0,
  velocityY: 0,
  facing: 1,
  grounded: false,
  maxHealth: 100,
  health: 100,
  maxSpirit: 100,
  spirit: 60,
  crystals: 0,
  spawnX: 0,
  spawnY: 0,
  hurtTimer: 0,
  coyoteTimer: 0,
  jumpBuffer: 0,
  airJumps: 1,
  canDash: true,
  dashTimer: 0,
  dashCooldown: 0,
  attackCooldown: 0,
  attackPoseTimer: 0,
  blastCooldown: 0,
  guardSoundTimer: 0,
  isGuarding: false,
  runTime: 0,
  finishedTime: 0
}

const particles = []
const projectiles = []
const meleeBursts = []

const audioState = {
  ctx: null,
  master: null,
  unlocked: false
}

function makeId() {
  const id = state.nextEntityId
  state.nextEntityId += 1
  return id
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function readStoredHudCollapsed() {
  try {
    return window.localStorage.getItem(HUD_COLLAPSED_STORAGE_KEY) === "true"
  } catch (error) {
    return false
  }
}

function storeHudCollapsed(collapsed) {
  try {
    window.localStorage.setItem(HUD_COLLAPSED_STORAGE_KEY, String(collapsed))
  } catch (error) {
    // Ignore storage failures in private browsing or restricted environments.
  }
}

function applyBottomHudState(collapsed) {
  bottomHudEl.classList.toggle("is-collapsed", collapsed)
  hudToggleButtonEl.classList.toggle("is-collapsed", collapsed)
  hudToggleButtonEl.setAttribute("aria-expanded", String(!collapsed))
  hudToggleButtonEl.setAttribute(
    "aria-label",
    collapsed ? "Mở thông tin trận đấu" : "Thu gọn thông tin trận đấu"
  )
}

function toggleBottomHud() {
  const nextCollapsed = !bottomHudEl.classList.contains("is-collapsed")
  applyBottomHudState(nextCollapsed)
  storeHudCollapsed(nextCollapsed)
}

function normalizeMap(rows) {
  const maxWidth = Math.max(...rows.map((row) => row.length))
  return rows.map((row) => row.padEnd(maxWidth, "."))
}

function intersects(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}

function buildLevel(config) {
  const map = normalizeMap(config.map)
  const solids = []
  const crystals = []
  const spikes = []
  const enemies = []
  const beacons = []
  const jumpPads = []
  const exits = []
  const npcs = []
  let playerSpawn = { x: TILE * 2, y: TILE * 2 }

  map.forEach((row, rowIndex) => {
    ;[...row].forEach((cell, columnIndex) => {
      const x = columnIndex * TILE
      const y = rowIndex * TILE

      if (cell === "#") {
        solids.push({ x, y, width: TILE, height: TILE })
      }

      if (cell === "C") {
        crystals.push({
          id: makeId(),
          x: x + 4,
          y: y + 4,
          width: 8,
          height: 8,
          collected: false,
          bob: Math.random() * Math.PI * 2
        })
      }

      if (cell === "S") {
        spikes.push({ x, y: y + 8, width: TILE, height: 8 })
      }

      if (cell === "E" || cell === "R") {
        const initialVelocityX = columnIndex % 2 === 0 ? 0.65 : -0.65
        const variant = cell === "R" ? "ranged" : "melee"
        enemies.push({
          id: makeId(),
          x: x + 1,
          y,
          width: 14,
          height: 14,
          health: 32,
          maxHealth: 32,
          velocityX: initialVelocityX,
          velocityY: 0,
          grounded: false,
          hitWall: false,
          initialVelocityX,
          patrolDirection: initialVelocityX >= 0 ? 1 : -1,
          facing: initialVelocityX >= 0 ? 1 : -1,
          leftBound: x - TILE * 3,
          rightBound: x + TILE * 4,
          variant,
          patrolSpeed: ENEMY_PATROL_SPEED + (columnIndex % 2) * 0.08,
          chaseSpeed: ENEMY_CHASE_SPEED + (rowIndex % 2) * 0.06,
          noticeRange: variant === "ranged" ? ENEMY_RANGED_RANGE : ENEMY_SIGHT_RANGE,
          aggroTimer: 0,
          attackCooldown: 18 + (columnIndex % 4) * 6,
          attackWindup: 0,
          attackMode: "idle",
          dead: false
        })
      }

      if (cell === "B") {
        beacons.push({
          id: makeId(),
          x: x + 1,
          y: y - 8,
          width: 14,
          height: 24,
          active: false,
          glow: Math.random() * Math.PI * 2
        })
      }

      if (cell === "J") {
        jumpPads.push({
          id: makeId(),
          x,
          y: y + 10,
          width: TILE,
          height: 6,
          bounce: 0
        })
      }

      if (config.exits && config.exits[cell] != null) {
        exits.push({
          id: makeId(),
          key: cell,
          x,
          y: y - TILE,
          width: TILE,
          height: TILE * 2,
          pulse: Math.random() * Math.PI * 2,
          targetLevelIndex: config.exits[cell]
        })
      }

      if (config.npcTypes && config.npcTypes[cell]) {
        const npcConfig = config.npcTypes[cell]
        npcs.push({
          id: makeId(),
          key: cell,
          x: x + 1,
          y,
          width: 14,
          height: 16,
          name: npcConfig.name,
          dialogue: npcConfig.dialogue
        })
      }

      if (cell === "P") {
        playerSpawn = { x: x + 2, y: y - 6 }
      }
    })
  })

  return {
    width: map[0].length * TILE,
    height: map.length * TILE,
    solids,
    crystals,
    spikes,
    enemies,
    beacons,
    jumpPads,
    exits,
    npcs,
    playerSpawn
  }
}

function createBoss(config) {
  return {
    id: "boss",
    name: config.name,
    x: config.x * TILE,
    y: config.y * TILE,
    width: 30,
    height: 28,
    velocityX: 0,
    velocityY: 0,
    health: config.maxHealth,
    maxHealth: config.maxHealth,
    facing: -1,
    grounded: false,
    phase: 1,
    attackMode: "idle",
    attackCooldown: 70,
    attackIndex: -1,
    modeTimer: 0,
    shotTimer: 0,
    shotsRemaining: 0,
    flashTimer: 0,
    hitWall: false,
    hasLaunched: false
  }
}

function getCurrentPalette() {
  return state.currentLevel.config.palette
}

function getLevelSpawn(parsed, options = {}) {
  if (options.spawnOverride) {
    return options.spawnOverride
  }

  return parsed.playerSpawn
}

function loadLevel(index, options = {}) {
  if (typeof options === "boolean") {
    options = { resetRun: options }
  }

  const { resetRun = false, preserveVitals = false, spawnOverride = null } = options
  const config = LEVELS[index]
  const parsed = buildLevel(config)
  const spawnPoint = getLevelSpawn(parsed, { spawnOverride })
  const preservedHealth = player.health
  const preservedSpirit = player.spirit

  state.currentLevelIndex = index
  state.currentLevel = { ...parsed, config }
  state.totalCrystals = parsed.crystals.length
  state.boss = config.boss ? createBoss(config.boss) : null

  projectiles.length = 0
  particles.length = 0
  meleeBursts.length = 0
  state.screenShake = 0

  if (resetRun) {
    player.runTime = 0
    player.finishedTime = 0
  }

  player.health = preserveVitals ? clamp(preservedHealth, 1, player.maxHealth) : player.maxHealth
  player.spirit = preserveVitals ? clamp(preservedSpirit, 12, player.maxSpirit) : 70
  player.crystals = 0
  player.x = spawnPoint.x
  player.y = spawnPoint.y
  player.spawnX = spawnPoint.x
  player.spawnY = spawnPoint.y
  player.velocityX = 0
  player.velocityY = 0
  player.facing = 1
  player.grounded = false
  player.hurtTimer = 0
  player.coyoteTimer = 0
  player.jumpBuffer = 0
  player.airJumps = 1
  player.canDash = true
  player.dashTimer = 0
  player.dashCooldown = 0
  player.attackCooldown = 0
  player.attackPoseTimer = 0
  player.blastCooldown = 0
  player.guardSoundTimer = 0
  player.isGuarding = false

  input.left = false
  input.right = false
  input.guard = false

  camera.x = clamp(player.spawnX - canvas.width / 2, 0, Math.max(0, parsed.width - canvas.width))
  camera.y = clamp(player.spawnY - canvas.height / 2, 0, Math.max(0, parsed.height - canvas.height))

  setStatus(config.objective, 40)
  refreshHud()
  render()
}

function setOverlay(kicker, title, text, buttonText, visible) {
  overlayKickerEl.textContent = kicker
  overlayKickerEl.style.display = kicker ? "" : "none"
  overlayTitleEl.textContent = title
  overlayTextEl.textContent = text
  overlayButtonEl.textContent = buttonText
  overlayEl.classList.toggle("hidden", !visible)
}

function setStatus(text, hold = 0) {
  state.status.text = text
  state.status.hold = hold
}

function getNearbyNpc() {
  if (!state.currentLevel || !state.currentLevel.npcs) {
    return null
  }

  let nearestNpc = null
  let nearestDistance = Number.POSITIVE_INFINITY

  state.currentLevel.npcs.forEach((npc) => {
    const dx = player.x + player.width / 2 - (npc.x + npc.width / 2)
    const dy = player.y + player.height / 2 - (npc.y + npc.height / 2)
    const distance = Math.abs(dx) + Math.abs(dy)

    if (Math.abs(dx) <= 28 && Math.abs(dy) <= 26 && distance < nearestDistance) {
      nearestNpc = npc
      nearestDistance = distance
    }
  })

  return nearestNpc
}

function startAreaTransition(targetLevelIndex) {
  if (
    state.transition.active ||
    targetLevelIndex == null ||
    targetLevelIndex < 0 ||
    targetLevelIndex >= LEVELS.length
  ) {
    return
  }

  state.transition.active = true
  state.transition.timer = AREA_TRANSITION_DURATION
  state.transition.targetLevelIndex = targetLevelIndex
  state.transition.loaded = false
  setStatus(`Đang sang ${LEVELS[targetLevelIndex].name}`, AREA_TRANSITION_DURATION + 18)
}

function updateAreaTransition(delta) {
  if (!state.transition.active) {
    return
  }

  state.transition.timer = Math.max(0, state.transition.timer - delta)

  if (!state.transition.loaded && state.transition.timer <= AREA_TRANSITION_DURATION / 2) {
    state.transition.loaded = true
    loadLevel(state.transition.targetLevelIndex, { resetRun: false, preserveVitals: true })
    setStatus(`Đã tới ${LEVELS[state.currentLevelIndex].name}`, 40)
  }

  if (state.transition.timer === 0) {
    state.transition.active = false
    state.transition.targetLevelIndex = null
    state.transition.loaded = false
  }
}

function getTransitionAlpha() {
  if (!state.transition.active) {
    return 0
  }

  const half = AREA_TRANSITION_DURATION / 2
  const elapsed = AREA_TRANSITION_DURATION - state.transition.timer
  const fade = elapsed < half ? elapsed / half : state.transition.timer / half
  return clamp(fade, 0, 1) * 0.82
}

function getDefaultStatus() {
  if (state.boss && state.boss.health > 0) {
    return state.boss.phase === 2 ? "Trùm giai đoạn 2 - né đạn và phản đòn" : "Đánh bại Lõi Hộ Vệ"
  }

  const nearbyNpc = getNearbyNpc()
  if (nearbyNpc) {
    return `Nhấn E để nói chuyện với ${nearbyNpc.name}`
  }

  if (!state.currentLevel.exits.length && state.totalCrystals > 0 && player.crystals < state.totalCrystals) {
    return `Còn ${state.totalCrystals - player.crystals} tinh thể trong khu vực`
  }

  return state.currentLevel.config.objective
}

function tickStatus(delta) {
  if (state.status.hold > 0) {
    state.status.hold = Math.max(0, state.status.hold - delta)
  }

  if (state.status.hold === 0) {
    state.status.text = getDefaultStatus()
  }
}

function refreshHud() {
  levelValueEl.textContent = `${state.currentLevelIndex + 1} / ${LEVELS.length}`
  crystalCountEl.textContent = state.boss
    ? "Trùm"
    : state.totalCrystals > 0
      ? `${player.crystals} / ${state.totalCrystals}`
      : "Không có"

  healthFillEl.style.width = `${(player.health / player.maxHealth) * 100}%`
  spiritFillEl.style.width = `${(player.spirit / player.maxSpirit) * 100}%`
  healthTextEl.textContent = `${Math.ceil(player.health)} / ${player.maxHealth}`
  spiritTextEl.textContent = `${Math.floor(player.spirit)} / ${player.maxSpirit}`

  if (player.dashTimer > 0) {
    dashValueEl.textContent = "Đang lướt"
  } else if (!player.canDash && player.dashCooldown <= 0) {
    dashValueEl.textContent = "Chạm đất"
  } else if (player.dashCooldown > 0) {
    dashValueEl.textContent = `Hồi ${Math.max(1, Math.ceil(player.dashCooldown / 12))}`
  } else {
    dashValueEl.textContent = "Sẵn sàng"
  }

  const shownTime = state.gameRunning ? player.runTime : player.finishedTime || player.runTime
  timeValueEl.textContent = formatTime(shownTime)
  statusTextEl.textContent = state.status.text
  stageChipEl.textContent = state.currentLevel.config.name

  if (state.boss && state.boss.health > 0) {
    bossBarEl.classList.remove("hidden")
    bossNameEl.textContent = state.boss.name
    bossTextEl.textContent = `${Math.ceil(state.boss.health)} / ${state.boss.maxHealth}`
    bossFillEl.style.width = `${(state.boss.health / state.boss.maxHealth) * 100}%`
  } else {
    bossBarEl.classList.add("hidden")
  }
}

function ensureAudio() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass) {
    return
  }

  if (!audioState.unlocked) {
    audioState.ctx = new AudioContextClass()
    audioState.master = audioState.ctx.createGain()
    audioState.master.gain.value = 0.07
    audioState.master.connect(audioState.ctx.destination)
    audioState.unlocked = true
  }

  if (audioState.ctx.state === "suspended") {
    audioState.ctx.resume()
  }
}

function playTone(frequency, duration, options = {}) {
  if (!audioState.unlocked) {
    return
  }

  const ctxAudio = audioState.ctx
  const now = ctxAudio.currentTime + (options.delay || 0)
  const oscillator = ctxAudio.createOscillator()
  const gainNode = ctxAudio.createGain()
  const startFrequency = Math.max(40, frequency)
  const endFrequency = Math.max(40, options.slideTo || frequency)

  oscillator.type = options.type || "square"
  oscillator.frequency.setValueAtTime(startFrequency, now)
  oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration)

  gainNode.gain.setValueAtTime(0.0001, now)
  gainNode.gain.exponentialRampToValueAtTime(options.volume || 0.04, now + 0.01)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration)

  oscillator.connect(gainNode)
  gainNode.connect(audioState.master)
  oscillator.start(now)
  oscillator.stop(now + duration + 0.02)
}

function playJumpSound() {
  playTone(260, 0.08, { slideTo: 420, volume: 0.04, type: "square" })
}

function playDoubleJumpSound() {
  playTone(380, 0.1, { slideTo: 660, volume: 0.05, type: "triangle" })
}

function playDashSound() {
  playTone(220, 0.12, { slideTo: 90, volume: 0.05, type: "sawtooth" })
}

function playSlashSound() {
  playTone(760, 0.06, { slideTo: 180, volume: 0.045, type: "triangle" })
}

function playBlastSound() {
  playTone(480, 0.12, { slideTo: 820, volume: 0.05, type: "square" })
  playTone(260, 0.08, { slideTo: 430, volume: 0.03, type: "triangle", delay: 0.02 })
}

function playCollectSound() {
  playTone(900, 0.08, { slideTo: 1220, volume: 0.04, type: "triangle" })
}

function playHealSound() {
  playTone(360, 0.1, { slideTo: 520, volume: 0.035, type: "sine" })
}

function playHitSound() {
  playTone(180, 0.12, { slideTo: 70, volume: 0.05, type: "square" })
}

function playEnemyDownSound() {
  playTone(160, 0.16, { slideTo: 60, volume: 0.05, type: "sawtooth" })
}

function playBossSound() {
  playTone(120, 0.18, { slideTo: 70, volume: 0.06, type: "sawtooth" })
}

function playWinSound() {
  playTone(523, 0.12, { volume: 0.04, type: "triangle" })
  playTone(659, 0.12, { volume: 0.04, type: "triangle", delay: 0.12 })
  playTone(784, 0.18, { volume: 0.05, type: "triangle", delay: 0.24 })
}

function playLoseSound() {
  playTone(260, 0.14, { slideTo: 180, volume: 0.05, type: "square" })
  playTone(180, 0.18, { slideTo: 90, volume: 0.05, type: "square", delay: 0.12 })
}

function isProbablyMobile() {
  return (
    window.matchMedia("(max-width: 900px)").matches &&
    (window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0)
  )
}

function isPortraitOrientation() {
  return window.matchMedia("(orientation: portrait)").matches
}

function updateFullscreenButtonLabel() {
  const isActive =
    document.fullscreenElement === gamePanelEl ||
    (gamePanelEl.classList.contains("is-fullscreen") && !document.fullscreenElement)
  const label = isActive ? "Thoát toàn màn hình" : "Toàn màn hình"

  fullscreenButtonEl.textContent = label
  rotateFullscreenButtonEl.textContent = isActive ? "Thoát toàn màn hình" : "Vào toàn màn hình"
}

function updateMobileLayoutState() {
  const isMobile = isProbablyMobile()
  const shouldRotate = isMobile && isPortraitOrientation()

  document.body.classList.toggle("mobile-device", isMobile)
  document.body.classList.toggle("mobile-portrait", shouldRotate)
  rotateHintEl.classList.toggle("hidden", !shouldRotate)
}

async function lockLandscapeIfPossible() {
  if (!isProbablyMobile()) {
    return
  }

  try {
    if (screen.orientation && screen.orientation.lock) {
      await screen.orientation.lock("landscape")
    }
  } catch (error) {
    // Some browsers require fullscreen first or do not support orientation lock.
  }
}

function unlockLandscapeIfPossible() {
  try {
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock()
    }
  } catch (error) {
    // Ignore unlock failures; many mobile browsers simply do not expose this API.
  }
}

async function toggleFullscreenMode() {
  ensureAudio()

  const pseudoFullscreen =
    gamePanelEl.classList.contains("is-fullscreen") && document.fullscreenElement !== gamePanelEl

  if (document.fullscreenElement === gamePanelEl || pseudoFullscreen) {
    if (document.fullscreenElement === gamePanelEl && document.exitFullscreen) {
      try {
        await document.exitFullscreen()
      } catch (error) {
        // Fall back to CSS-only fullscreen state below.
      }
    }

    gamePanelEl.classList.remove("is-fullscreen")
    unlockLandscapeIfPossible()
    updateFullscreenButtonLabel()
    updateMobileLayoutState()
    return
  }

  if (gamePanelEl.requestFullscreen) {
    try {
      await gamePanelEl.requestFullscreen({ navigationUI: "hide" })
    } catch (error) {
      gamePanelEl.classList.add("is-fullscreen")
    }
  } else {
    gamePanelEl.classList.add("is-fullscreen")
  }

  await lockLandscapeIfPossible()
  updateFullscreenButtonLabel()
  updateMobileLayoutState()
}

function startCampaign() {
  const wasRunning = state.gameRunning
  state.transition.active = false
  state.transition.timer = 0
  state.transition.targetLevelIndex = null
  state.transition.loaded = false
  state.dialogueNpcId = null
  loadLevel(0, true)
  state.overlayMode = "playing"
  state.nextLevelIndex = null
  setOverlay("", "", "", "", false)
  setStatus("Bắt đầu hành trình", 55)
  state.gameRunning = true
  state.lastTime = performance.now()
  if (!wasRunning) {
    requestAnimationFrame(loop)
  }
}

function startNextLevel() {
  const wasRunning = state.gameRunning
  loadLevel(state.nextLevelIndex, false)
  state.overlayMode = "playing"
  state.nextLevelIndex = null
  state.dialogueNpcId = null
  setOverlay("", "", "", "", false)
  setStatus("Tiến vào màn mới", 55)
  state.gameRunning = true
  state.lastTime = performance.now()
  if (!wasRunning) {
    requestAnimationFrame(loop)
  }
}

function finishRun(won) {
  state.gameRunning = false
  state.transition.active = false
  state.transition.timer = 0
  state.transition.targetLevelIndex = null
  state.transition.loaded = false
  state.dialogueNpcId = null
  player.finishedTime = player.runTime
  state.overlayMode = "restart"

  if (won) {
    playWinSound()
    setStatus("Lõi Hộ Vệ đã sụp đổ")
    setOverlay(
      "Hoàn thành",
      "Bạn đã hoàn thành Hành Trình Di Tích Pixel",
      `Năm khu đã được vượt qua trong ${formatTime(player.finishedTime)}. Nhấn để bắt đầu một chuyến đi mới.`,
      "Chơi lại từ đầu",
      true
    )
  } else {
    playLoseSound()
    setStatus("Nội lực đã cạn")
    setOverlay(
      "Thất bại",
      "Bạn đã thất bại",
      `Bạn dừng lại ở ${LEVELS[state.currentLevelIndex].name} sau ${formatTime(player.finishedTime)}. Nhấn để thử lại.`,
      "Thử lại",
      true
    )
  }

  refreshHud()
  render()
}

function completeLevel() {
  const nextExit = state.currentLevel.exits[0]
  if (nextExit) {
    startAreaTransition(nextExit.targetLevelIndex)
    return
  }

  travelToNextLevel()
}

function travelToNextLevel() {
  if (state.currentLevelIndex >= LEVELS.length - 1) {
    finishRun(true)
    return
  }

  startAreaTransition(state.currentLevelIndex + 1)
}

function resumeFromDialogue() {
  const wasRunning = state.gameRunning
  state.overlayMode = "playing"
  state.dialogueNpcId = null
  setOverlay("", "", "", "", false)
  state.gameRunning = true
  state.lastTime = performance.now()

  if (!wasRunning) {
    requestAnimationFrame(loop)
  }
}

function openNpcDialogue(npc) {
  input.left = false
  input.right = false
  input.guard = false
  player.isGuarding = false
  state.gameRunning = false
  state.overlayMode = "dialogue"
  state.dialogueNpcId = npc.id
  setOverlay("Hội thoại", npc.name, npc.dialogue, "Tiếp tục", true)
  render()
}

function tryInteract() {
  if (!state.gameRunning || state.transition.active) {
    return
  }

  const nearbyNpc = getNearbyNpc()
  if (!nearbyNpc) {
    setStatus("Không có ai ở gần để trò chuyện", 24)
    return
  }

  openNpcDialogue(nearbyNpc)
}

function handleOverlayAction() {
  ensureAudio()

  if (state.overlayMode === "dialogue") {
    resumeFromDialogue()
  } else if (state.overlayMode === "next") {
    startNextLevel()
  } else {
    startCampaign()
  }
}

function loop(timestamp) {
  if (!state.gameRunning) {
    render()
    return
  }

  const delta = Math.min((timestamp - state.lastTime) / 16.6667, 1.8)
  state.lastTime = timestamp

  update(delta)
  render()

  if (state.gameRunning) {
    requestAnimationFrame(loop)
  }
}

function update(delta) {
  player.runTime += delta / 60

  updateTimers(delta)

  if (state.transition.active) {
    updateAreaTransition(delta)
    updateParticles(delta)
    tickStatus(delta)
    refreshHud()
    return
  }

  updateGuarding(delta)
  handleMovement(delta)
  processJump()
  applyPlayerPhysics(delta)
  updateEnemies(delta)
  updateBoss(delta)
  updateMeleeBursts(delta)

  if (!state.gameRunning) {
    refreshHud()
    return
  }

  updateProjectiles(delta)

  if (!state.gameRunning) {
    refreshHud()
    return
  }

  animateLevel(delta)
  handleBeacons()
  handleJumpPads()
  collectCrystals()

  if (!state.gameRunning) {
    refreshHud()
    return
  }

  handleHazards()

  if (!state.gameRunning) {
    refreshHud()
    return
  }

  if (player.y > state.currentLevel.height + TILE * 3 && player.hurtTimer <= 0) {
    damagePlayer(22, player.facing * -1 || -1, true)
  }

  if (!state.gameRunning) {
    refreshHud()
    return
  }

  checkObjective()

  if (!state.gameRunning) {
    refreshHud()
    return
  }

  updateCamera(delta)
  updateParticles(delta)
  tickStatus(delta)
  refreshHud()
}

function updateTimers(delta) {
  if (player.hurtTimer > 0) {
    player.hurtTimer = Math.max(0, player.hurtTimer - delta)
  }

  if (player.jumpBuffer > 0) {
    player.jumpBuffer = Math.max(0, player.jumpBuffer - delta)
  }

  if (player.dashCooldown > 0) {
    player.dashCooldown = Math.max(0, player.dashCooldown - delta)
  }

  if (player.dashTimer > 0) {
    player.dashTimer = Math.max(0, player.dashTimer - delta)
    player.velocityX = DASH_SPEED * player.facing
    player.velocityY = 0
    spawnTrailParticle()
  }

  if (player.attackCooldown > 0) {
    player.attackCooldown = Math.max(0, player.attackCooldown - delta)
  }

  if (player.attackPoseTimer > 0) {
    player.attackPoseTimer = Math.max(0, player.attackPoseTimer - delta)
  }

  if (player.blastCooldown > 0) {
    player.blastCooldown = Math.max(0, player.blastCooldown - delta)
  }

  player.spirit = clamp(player.spirit + 0.025 * delta, 0, player.maxSpirit)
  state.screenShake = Math.max(0, state.screenShake - 0.3 * delta)

  state.currentLevel.exits.forEach((exit) => {
    exit.pulse += 0.08 * delta
  })

  if (state.boss) {
    state.boss.flashTimer = Math.max(0, state.boss.flashTimer - delta)
  }
}

function updateGuarding(delta) {
  player.isGuarding =
    input.guard &&
    player.grounded &&
    player.dashTimer <= 0 &&
    player.hurtTimer <= 0

  if (!player.isGuarding) {
    player.guardSoundTimer = 0
    return
  }

  player.velocityX *= Math.pow(0.55, delta)
  setStatus("Đang gồng để hồi máu", 2)

  if (player.health >= player.maxHealth || player.spirit <= 0) {
    return
  }

  player.health = clamp(player.health + GUARD_HEAL_RATE * delta, 0, player.maxHealth)
  player.spirit = clamp(player.spirit - GUARD_SPIRIT_RATE * delta, 0, player.maxSpirit)
  player.guardSoundTimer = Math.max(0, player.guardSoundTimer - delta)

  if (player.guardSoundTimer === 0) {
    playHealSound()
    player.guardSoundTimer = 20
  }
}

function handleMovement(delta) {
  if (player.dashTimer > 0 || player.isGuarding) {
    return
  }

  if (input.left) {
    player.velocityX -= PLAYER_ACCEL * delta
    player.facing = -1
  }

  if (input.right) {
    player.velocityX += PLAYER_ACCEL * delta
    player.facing = 1
  }

  if (!input.left && !input.right) {
    player.velocityX *= Math.pow(FRICTION, delta)
  }

  player.velocityX = clamp(player.velocityX, -PLAYER_MAX_SPEED, PLAYER_MAX_SPEED)
}

function processJump() {
  if (!state.gameRunning || player.jumpBuffer <= 0 || player.isGuarding) {
    return
  }

  const canGroundJump = player.grounded || player.coyoteTimer > 0

  if (canGroundJump) {
    player.velocityY = JUMP_FORCE
    player.grounded = false
    player.coyoteTimer = 0
    player.jumpBuffer = 0
    spawnParticles(player.x + player.width / 2, player.y + player.height, 6, ["#d9c8a0", "#ffffff"], 1.2, 0.06)
    playJumpSound()
    return
  }

  if (player.airJumps > 0) {
    player.airJumps -= 1
    player.velocityY = DOUBLE_JUMP_FORCE
    player.jumpBuffer = 0
    player.canDash = true
    state.screenShake = 1.1
    spawnParticles(player.x + player.width / 2, player.y + player.height / 2, 12, ["#85f7ff", "#ffffff"], 1.6, 0.02)
    setStatus("Nhảy đôi kích hoạt", 26)
    playDoubleJumpSound()
  }
}

function applyPlayerPhysics(delta) {
  if (player.dashTimer <= 0) {
    player.velocityY = Math.min(player.velocityY + GRAVITY * delta, MAX_FALL_SPEED)
  }

  movePlayerAxis("x", player.velocityX * delta)
  movePlayerAxis("y", player.velocityY * delta)

  if (!player.grounded) {
    player.coyoteTimer = Math.max(0, player.coyoteTimer - delta)
  }
}

function movePlayerAxis(axis, amount) {
  if (axis === "x") {
    player.x += amount
    const collisions = getSolidCollisions(player)

    collisions.forEach((tile) => {
      if (amount > 0) {
        player.x = tile.x - player.width
      } else if (amount < 0) {
        player.x = tile.x + tile.width
      }
      player.velocityX = 0
      player.dashTimer = 0
    })

    player.x = clamp(player.x, 0, Math.max(0, state.currentLevel.width - player.width))
    return
  }

  const wasGrounded = player.grounded
  player.y += amount
  player.grounded = false
  const collisions = getSolidCollisions(player)

  collisions.forEach((tile) => {
    if (amount > 0) {
      player.y = tile.y - player.height
      player.velocityY = 0
      player.grounded = true
      player.airJumps = 1
      player.canDash = true
      player.coyoteTimer = COYOTE_FRAMES
      player.dashTimer = 0
    } else if (amount < 0) {
      player.y = tile.y + tile.height
      player.velocityY = 0
    }
  })

  if (!wasGrounded && player.grounded) {
    spawnParticles(player.x + player.width / 2, player.y + player.height, 6, ["#d9c8a0", "#ffffff"], 1.1, 0.05)
  }
}

function getSolidCollisions(rect) {
  return state.currentLevel.solids.filter((tile) => intersects(rect, tile))
}

function moveEnemyAxis(enemy, axis, amount) {
  if (axis === "x") {
    enemy.hitWall = false
    enemy.x += amount
    const collisions = getSolidCollisions(enemy)

    collisions.forEach((tile) => {
      if (amount > 0) {
        enemy.x = tile.x - enemy.width
      } else if (amount < 0) {
        enemy.x = tile.x + tile.width
      }

      enemy.velocityX = 0
      enemy.hitWall = true
    })

    return
  }

  enemy.y += amount
  enemy.grounded = false
  const collisions = getSolidCollisions(enemy)

  collisions.forEach((tile) => {
    if (amount > 0) {
      enemy.y = tile.y - enemy.height
      enemy.velocityY = 0
      enemy.grounded = true
    } else if (amount < 0) {
      enemy.y = tile.y + tile.height
      enemy.velocityY = 0
    }
  })
}

function beginEnemyAttack(enemy, attackMode) {
  enemy.attackMode = attackMode
  enemy.attackWindup = attackMode === "melee" ? 10 : 14
  enemy.velocityX *= 0.35
}

function fireEnemyKunai(enemy) {
  const startX = enemy.facing > 0 ? enemy.x + enemy.width : enemy.x - 7
  const startY = enemy.y + 7
  const targetX = player.x + player.width / 2
  const targetY = player.y + player.height / 2
  const angle = Math.atan2(targetY - startY, targetX - startX)

  projectiles.push({
    id: makeId(),
    owner: "enemy",
    kind: "kunai",
    x: startX,
    y: startY,
    width: 7,
    height: 3,
    velocityX: Math.cos(angle) * ENEMY_PROJECTILE_SPEED,
    velocityY: Math.sin(angle) * (ENEMY_PROJECTILE_SPEED * 0.75),
    damage: 10,
    life: 96
  })
}

function performEnemyAttack(enemy) {
  if (enemy.attackMode === "melee") {
    meleeBursts.push({
      id: makeId(),
      owner: "enemy",
      x: enemy.facing > 0 ? enemy.x + enemy.width - 2 : enemy.x - 18,
      y: enemy.y + 1,
      width: 20,
      height: 12,
      damage: 10,
      direction: enemy.facing,
      life: 8,
      hitIds: new Set()
    })
    enemy.attackCooldown = ENEMY_ATTACK_COOLDOWN - 8
    playSlashSound()
  } else {
    fireEnemyKunai(enemy)
    enemy.attackCooldown = ENEMY_ATTACK_COOLDOWN + 12
    playHitSound()
  }

  enemy.attackWindup = 0
  enemy.attackMode = "idle"
}

function updateEnemies(delta) {
  state.currentLevel.enemies.forEach((enemy) => {
    if (enemy.dead) {
      return
    }

    enemy.attackCooldown = Math.max(0, enemy.attackCooldown - delta)
    enemy.aggroTimer = Math.max(0, enemy.aggroTimer - delta)

    const dx = player.x + player.width / 2 - (enemy.x + enemy.width / 2)
    const dy = player.y + player.height / 2 - (enemy.y + enemy.height / 2)
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)

    if (absDx <= enemy.noticeRange && absDy < 30) {
      enemy.aggroTimer = 84
    }

    if (absDx > 4) {
      enemy.facing = dx < 0 ? -1 : 1
    }

    let desiredDirection = enemy.patrolDirection
    let desiredSpeed = enemy.patrolSpeed

    if (enemy.attackWindup > 0) {
      enemy.attackWindup = Math.max(0, enemy.attackWindup - delta)
      enemy.velocityX *= Math.pow(0.45, delta)

      if (enemy.attackWindup === 0) {
        performEnemyAttack(enemy)
      }
    } else if (enemy.aggroTimer > 0) {
      desiredDirection = enemy.facing

      const wantsMelee = absDx <= ENEMY_ATTACK_RANGE && absDy < 18
      const wantsRanged =
        enemy.variant === "ranged" &&
        absDx > ENEMY_ATTACK_RANGE + 8 &&
        absDx < ENEMY_RANGED_RANGE &&
        absDy < 24

      if (enemy.attackCooldown === 0 && (wantsMelee || wantsRanged)) {
        beginEnemyAttack(enemy, wantsMelee ? "melee" : "ranged")
        desiredSpeed = 0
      } else {
        desiredSpeed = wantsMelee || wantsRanged ? 0 : enemy.chaseSpeed
      }
    } else {
      if (enemy.x <= enemy.leftBound + 1) {
        enemy.patrolDirection = 1
      } else if (enemy.x >= enemy.rightBound - 1) {
        enemy.patrolDirection = -1
      }

      desiredDirection = enemy.patrolDirection
    }

    if (enemy.attackWindup === 0) {
      const desiredVelocityX = desiredDirection * desiredSpeed
      enemy.velocityX += (desiredVelocityX - enemy.velocityX) * 0.26 * delta
    }

    enemy.velocityY = Math.min(enemy.velocityY + ENEMY_GRAVITY * delta, MAX_FALL_SPEED)
    moveEnemyAxis(enemy, "x", enemy.velocityX * delta)

    if (enemy.x <= enemy.leftBound) {
      enemy.x = enemy.leftBound
      enemy.velocityX = Math.max(0, enemy.velocityX)
      enemy.patrolDirection = 1
    } else if (enemy.x >= enemy.rightBound) {
      enemy.x = enemy.rightBound
      enemy.velocityX = Math.min(0, enemy.velocityX)
      enemy.patrolDirection = -1
    }

    if (enemy.hitWall) {
      enemy.patrolDirection *= -1
    }

    moveEnemyAxis(enemy, "y", enemy.velocityY * delta)

    const probeDirection = enemy.aggroTimer > 0 ? enemy.facing : enemy.patrolDirection
    const ledgeProbe = {
      x: probeDirection > 0 ? enemy.x + enemy.width + 1 : enemy.x - 1,
      y: enemy.y + enemy.height + 2,
      width: 1,
      height: 1
    }

    const hasGroundAhead = state.currentLevel.solids.some((tile) => intersects(ledgeProbe, tile))
    if (enemy.grounded && !hasGroundAhead) {
      enemy.velocityX = 0
      enemy.patrolDirection = probeDirection > 0 ? -1 : 1
    }
  })
}

function chooseBossAttack() {
  const boss = state.boss
  const cycle = boss.phase === 1 ? ["volley", "jump", "charge"] : ["charge", "volley", "jump", "volley"]
  boss.attackIndex = (boss.attackIndex + 1) % cycle.length
  const attack = cycle[boss.attackIndex]
  boss.facing = player.x + player.width / 2 < boss.x + boss.width / 2 ? -1 : 1

  if (attack === "volley") {
    boss.attackMode = "volley"
    boss.modeTimer = boss.phase === 1 ? 56 : 64
    boss.shotTimer = 4
    boss.shotsRemaining = boss.phase === 1 ? 3 : 4
    boss.velocityX = 0
  } else if (attack === "jump") {
    boss.attackMode = "jump"
    boss.hasLaunched = true
    boss.velocityY = boss.phase === 1 ? -6.2 : -7.1
    boss.velocityX = boss.facing * (boss.phase === 1 ? 1.35 : 1.8)
  } else {
    boss.attackMode = "windup"
    boss.modeTimer = boss.phase === 1 ? 18 : 14
    boss.velocityX = 0
  }

  playBossSound()
  setStatus("Trùm đang ra đòn", 24)
}

function updateBoss(delta) {
  const boss = state.boss
  if (!boss || boss.health <= 0) {
    return
  }

  boss.phase = boss.health <= boss.maxHealth * 0.5 ? 2 : 1
  boss.hitWall = false

  if (boss.attackMode === "idle") {
    boss.facing = player.x + player.width / 2 < boss.x + boss.width / 2 ? -1 : 1
    boss.velocityX = 0.45 * boss.facing * (boss.phase === 2 ? 1.2 : 1)
    boss.attackCooldown = Math.max(0, boss.attackCooldown - delta)

    if (boss.attackCooldown === 0 && boss.grounded) {
      chooseBossAttack()
    }
  } else if (boss.attackMode === "volley") {
    boss.modeTimer = Math.max(0, boss.modeTimer - delta)
    boss.shotTimer = Math.max(0, boss.shotTimer - delta)
    boss.velocityX *= Math.pow(0.84, delta)

    if (boss.shotsRemaining > 0 && boss.shotTimer === 0) {
      fireBossOrb()
      boss.shotsRemaining -= 1
      boss.shotTimer = boss.phase === 1 ? 14 : 10
    }

    if (boss.modeTimer === 0 && boss.shotsRemaining === 0) {
      boss.attackMode = "idle"
      boss.attackCooldown = boss.phase === 1 ? 60 : 42
    }
  } else if (boss.attackMode === "windup") {
    boss.modeTimer = Math.max(0, boss.modeTimer - delta)
    boss.velocityX *= Math.pow(0.6, delta)

    if (boss.modeTimer === 0) {
      boss.attackMode = "charge"
      boss.modeTimer = boss.phase === 1 ? 24 : 30
      boss.velocityX = boss.facing * (boss.phase === 1 ? 3.3 : 4.1)
    }
  } else if (boss.attackMode === "charge") {
    boss.modeTimer = Math.max(0, boss.modeTimer - delta)

    if (boss.modeTimer === 0) {
      boss.attackMode = "idle"
      boss.attackCooldown = boss.phase === 1 ? 58 : 40
      boss.velocityX = 0
    }
  }

  boss.velocityY = Math.min(boss.velocityY + GRAVITY * 0.86 * delta, MAX_FALL_SPEED)
  const wasGrounded = boss.grounded

  moveBossAxis("x", boss.velocityX * delta)
  moveBossAxis("y", boss.velocityY * delta)

  if (boss.attackMode === "jump" && !wasGrounded && boss.grounded && boss.hasLaunched) {
    boss.attackMode = "idle"
    boss.attackCooldown = boss.phase === 1 ? 60 : 42
    boss.hasLaunched = false
    fireShockwaves(boss.x + boss.width / 2, boss.y + boss.height - 6, boss.phase === 2)
    state.screenShake = 2.2
    spawnParticles(boss.x + boss.width / 2, boss.y + boss.height - 6, 22, ["#f2779d", "#ffffff", "#f8d26b"], 2.1, 0.05)
    playBossSound()
  }

  if (boss.attackMode === "charge" && boss.hitWall) {
    boss.attackMode = "idle"
    boss.attackCooldown = boss.phase === 1 ? 62 : 44
    boss.velocityX = 0
    fireShockwaves(boss.x + boss.width / 2, boss.y + boss.height - 6, false)
    spawnParticles(boss.x + boss.width / 2, boss.y + boss.height / 2, 18, ["#f2779d", "#ffffff"], 1.8, 0.03)
    state.screenShake = 1.7
  }
}

function moveBossAxis(axis, amount) {
  const boss = state.boss
  if (!boss) {
    return
  }

  if (axis === "x") {
    boss.x += amount
    const collisions = getSolidCollisions(boss)

    collisions.forEach((tile) => {
      if (amount > 0) {
        boss.x = tile.x - boss.width
      } else if (amount < 0) {
        boss.x = tile.x + tile.width
      }
      boss.velocityX = 0
      boss.hitWall = true
    })

    if (boss.x <= 0) {
      boss.x = 0
      boss.velocityX = 0
      boss.hitWall = true
    }

    const maxX = Math.max(0, state.currentLevel.width - boss.width)
    if (boss.x >= maxX) {
      boss.x = maxX
      boss.velocityX = 0
      boss.hitWall = true
    }

    return
  }

  boss.y += amount
  boss.grounded = false
  const collisions = getSolidCollisions(boss)

  collisions.forEach((tile) => {
    if (amount > 0) {
      boss.y = tile.y - boss.height
      boss.velocityY = 0
      boss.grounded = true
    } else if (amount < 0) {
      boss.y = tile.y + tile.height
      boss.velocityY = 0
    }
  })
}

function fireBossOrb() {
  const boss = state.boss
  const speed = boss.phase === 1 ? 2.3 : 2.8
  const spread = boss.phase === 1 ? [0] : [-0.22, 0, 0.22]
  const startX = boss.x + boss.width / 2
  const startY = boss.y + 10
  const targetX = player.x + player.width / 2
  const targetY = player.y + player.height / 2
  const baseAngle = Math.atan2(targetY - startY, targetX - startX)

  spread.forEach((offset) => {
    const angle = baseAngle + offset
    projectiles.push({
      id: makeId(),
      owner: "enemy",
      kind: "orb",
      x: startX,
      y: startY,
      width: 6,
      height: 6,
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,
      damage: boss.phase === 1 ? 12 : 14,
      life: 110
    })
  })

  playBossSound()
}

function fireShockwaves(x, y, empowered) {
  const speed = empowered ? 3.1 : 2.4
  const damage = empowered ? 18 : 15

  projectiles.push({
    id: makeId(),
    owner: "enemy",
    kind: "shockwave",
    x: x - 6,
    y,
    width: 12,
    height: 6,
    velocityX: -speed,
    velocityY: 0,
    damage,
    life: 95
  })

  projectiles.push({
    id: makeId(),
    owner: "enemy",
    kind: "shockwave",
    x: x - 6,
    y,
    width: 12,
    height: 6,
    velocityX: speed,
    velocityY: 0,
    damage,
    life: 95
  })
}

function updateMeleeBursts(delta) {
  for (let index = meleeBursts.length - 1; index >= 0; index -= 1) {
    const burst = meleeBursts[index]
    burst.life -= delta

    if (burst.life <= 0) {
      meleeBursts.splice(index, 1)
      continue
    }

    const rect = {
      x: burst.x,
      y: burst.y,
      width: burst.width,
      height: burst.height
    }

    if (burst.owner === "enemy") {
      if (!burst.hitIds.has("player") && player.hurtTimer <= 0 && intersects(rect, player)) {
        burst.hitIds.add("player")
        damagePlayer(burst.damage, burst.direction, false)
      }
      continue
    }

    state.currentLevel.enemies.forEach((enemy) => {
      if (enemy.dead || burst.hitIds.has(enemy.id)) {
        return
      }

      if (intersects(rect, enemy)) {
        burst.hitIds.add(enemy.id)
        damageEnemy(enemy, burst.damage, burst.direction)
      }
    })

    if (state.boss && state.boss.health > 0 && !burst.hitIds.has("boss") && intersects(rect, state.boss)) {
      burst.hitIds.add("boss")
      damageBoss(burst.damage, burst.direction)
    }

    for (let projectileIndex = projectiles.length - 1; projectileIndex >= 0; projectileIndex -= 1) {
      const projectile = projectiles[projectileIndex]
      if (
        projectile.owner === "enemy" &&
        projectile.kind !== "shockwave" &&
        intersects(rect, projectile)
      ) {
        projectiles.splice(projectileIndex, 1)
        gainSpirit(4)
        spawnParticles(projectile.x, projectile.y, 8, ["#ffffff", "#7af5ff"], 1.3, 0.01)
      }
    }
  }
}

function updateProjectiles(delta) {
  for (let index = projectiles.length - 1; index >= 0; index -= 1) {
    const projectile = projectiles[index]
    projectile.life -= delta

    if (projectile.life <= 0) {
      projectiles.splice(index, 1)
      continue
    }

    projectile.x += projectile.velocityX * delta
    projectile.y += projectile.velocityY * delta

    if (projectile.kind === "blast") {
      spawnParticles(
        projectile.x + projectile.width / 2,
        projectile.y + projectile.height / 2,
        1,
        ["#7af5ff", "#dfffff", "#8ab6ff"],
        0.36,
        0
      )
    } else if (projectile.kind === "orb") {
      spawnParticles(projectile.x + 3, projectile.y + 3, 1, ["#f2779d", "#ffd4e4"], 0.24, 0)
    } else if (projectile.kind === "shockwave" && Math.random() > 0.35) {
      spawnParticles(projectile.x + projectile.width / 2, projectile.y + 2, 1, ["#ffd4e4", "#f2779d"], 0.18, 0)
    }

    if (projectile.owner === "player") {
      if (projectileHitsSolid(projectile)) {
        spawnParticles(projectile.x, projectile.y, 8, ["#7af5ff", "#ffffff"], 1.1, 0.01)
        projectiles.splice(index, 1)
        continue
      }

      let hitTarget = false

      for (let enemyIndex = 0; enemyIndex < state.currentLevel.enemies.length; enemyIndex += 1) {
        const enemy = state.currentLevel.enemies[enemyIndex]
        if (!enemy.dead && intersects(projectile, enemy)) {
          damageEnemy(enemy, projectile.damage, Math.sign(projectile.velocityX) || player.facing)
          hitTarget = true
          break
        }
      }

      if (!hitTarget && state.boss && state.boss.health > 0 && intersects(projectile, state.boss)) {
        damageBoss(projectile.damage, Math.sign(projectile.velocityX) || player.facing)
        hitTarget = true
      }

      if (hitTarget) {
        spawnParticles(projectile.x, projectile.y, 10, ["#7af5ff", "#ffffff"], 1.4, 0.01)
        projectiles.splice(index, 1)
        continue
      }
    } else {
      if (projectile.kind !== "shockwave" && projectileHitsSolid(projectile)) {
        spawnParticles(projectile.x, projectile.y, 8, ["#f2779d", "#ffffff"], 1.2, 0.02)
        projectiles.splice(index, 1)
        continue
      }

      if (player.hurtTimer <= 0 && intersects(projectile, player)) {
        damagePlayer(projectile.damage, projectile.velocityX >= 0 ? 1 : -1, false)
        projectiles.splice(index, 1)
        continue
      }
    }

    if (
      projectile.x < -40 ||
      projectile.x > state.currentLevel.width + 40 ||
      projectile.y < -40 ||
      projectile.y > state.currentLevel.height + 40
    ) {
      projectiles.splice(index, 1)
    }
  }
}

function projectileHitsSolid(projectile) {
  if (projectile.kind === "shockwave") {
    return false
  }

  return state.currentLevel.solids.some((tile) => intersects(projectile, tile))
}

function animateLevel(delta) {
  state.currentLevel.beacons.forEach((beacon) => {
    beacon.glow += 0.08 * delta
  })

  state.currentLevel.jumpPads.forEach((pad) => {
    pad.bounce = Math.max(0, pad.bounce - 0.12 * delta)
  })
}

function handleBeacons() {
  state.currentLevel.beacons.forEach((beacon) => {
    if (beacon.active || !intersects(player, beacon)) {
      return
    }

    state.currentLevel.beacons.forEach((entry) => {
      entry.active = false
    })

    beacon.active = true
    player.spawnX = beacon.x + 1
    player.spawnY = beacon.y + beacon.height - player.height
    state.screenShake = 1.4
    spawnParticles(beacon.x + beacon.width / 2, beacon.y + 4, 16, ["#f8d26b", "#ffffff", "#e57c46"], 1.8, 0.01)
    setStatus("Điểm lưu đã được kích hoạt", 55)
    playCollectSound()
  })
}

function handleJumpPads() {
  state.currentLevel.jumpPads.forEach((pad) => {
    const touchesPad =
      player.velocityY > 0.35 &&
      player.x + player.width > pad.x &&
      player.x < pad.x + pad.width &&
      player.y + player.height >= pad.y &&
      player.y + player.height <= pad.y + pad.height + 8

    if (!touchesPad) {
      return
    }

    player.y = pad.y - player.height
    player.velocityY = JUMP_PAD_FORCE
    player.grounded = false
    player.coyoteTimer = 0
    player.airJumps = 1
    player.canDash = true
    pad.bounce = 1
    state.screenShake = 1.7
    spawnParticles(pad.x + pad.width / 2, pad.y + 2, 12, ["#ffe59a", "#f0b454", "#ffffff"], 1.9, 0.01)
    setStatus("Bệ nảy đẩy bạn vút lên", 26)
    playJumpSound()
  })
}

function collectCrystals() {
  let collectedAny = false

  state.currentLevel.crystals.forEach((crystal) => {
    crystal.bob += 0.08

    if (!crystal.collected && intersects(player, crystal)) {
      crystal.collected = true
      player.crystals += 1
      gainSpirit(14)
      collectedAny = true
      state.screenShake = 1.2
      spawnParticles(crystal.x + crystal.width / 2, crystal.y + crystal.height / 2, 14, ["#85f7ff", "#d9ffff", "#ffffff"], 1.7, 0.01)
      playCollectSound()
    }
  })

  if (collectedAny) {
    if (player.crystals === state.totalCrystals) {
      setStatus("Đã gom sạch tinh thể - có thể sang khu mới bất cứ lúc nào", 70)
    } else {
      setStatus("Tinh thể đã được thu thập - nội lực tăng thêm", 36)
    }
  }
}

function handleHazards() {
  if (player.hurtTimer > 0) {
    return
  }

  const touchedSpike = state.currentLevel.spikes.some((spike) => intersects(player, spike))
  if (touchedSpike) {
    damagePlayer(18, player.facing > 0 ? -1 : 1, false)
    return
  }

  const touchedEnemy = state.currentLevel.enemies.find((enemy) => !enemy.dead && intersects(player, enemy))
  if (touchedEnemy) {
    const stompedEnemy = player.velocityY > 0.7 && player.y + player.height <= touchedEnemy.y + 8

    if (stompedEnemy) {
      damageEnemy(touchedEnemy, 999, player.facing)
      player.velocityY = -4.8
      player.airJumps = 1
      player.canDash = true
      gainSpirit(8)
      setStatus("Đạp gục quái vật", 28)
      return
    }

    damagePlayer(14, player.x < touchedEnemy.x ? -1 : 1, false)
    return
  }

  if (state.boss && state.boss.health > 0 && intersects(player, state.boss)) {
    damagePlayer(20, player.x + player.width / 2 < state.boss.x + state.boss.width / 2 ? -1 : 1, false)
  }
}

function checkObjective() {
  if (state.transition.active) {
    return
  }

  if (state.boss) {
    return
  }

  if (!state.currentLevel.exits.length) {
    return
  }

  const touchedExit = state.currentLevel.exits.find((exit) => intersects(player, exit))
  if (touchedExit) {
    startAreaTransition(touchedExit.targetLevelIndex)
  }
}

function respawnPlayer() {
  player.x = player.spawnX
  player.y = player.spawnY
  player.velocityX = 0
  player.velocityY = 0
  player.grounded = false
  player.coyoteTimer = 0
  player.jumpBuffer = 0
  player.airJumps = 1
  player.canDash = true
  player.dashTimer = 0
  player.attackPoseTimer = 0
  player.isGuarding = false

  for (let index = projectiles.length - 1; index >= 0; index -= 1) {
    if (projectiles[index].owner === "enemy") {
      projectiles.splice(index, 1)
    }
  }

  camera.x = clamp(player.spawnX - canvas.width / 2, 0, Math.max(0, state.currentLevel.width - canvas.width))
  camera.y = clamp(player.spawnY - canvas.height / 2, 0, Math.max(0, state.currentLevel.height - canvas.height))
  spawnParticles(player.x + player.width / 2, player.y + player.height / 2, 14, ["#ffffff", "#f8d26b", "#e57c46"], 1.7, 0.03)
}

function gainSpirit(amount) {
  player.spirit = clamp(player.spirit + amount, 0, player.maxSpirit)
}

function damagePlayer(amount, direction, shouldRespawn) {
  let finalDamage = amount

  if (player.isGuarding) {
    finalDamage *= 0.45
    player.spirit = clamp(player.spirit - 8, 0, player.maxSpirit)
  }

  player.health = Math.max(0, player.health - finalDamage)
  player.hurtTimer = 52
  player.velocityX = 2.6 * direction
  player.velocityY = -4.2
  player.dashTimer = 0
  player.dashCooldown = Math.max(player.dashCooldown, 24)
  player.attackPoseTimer = 0
  player.isGuarding = false
  state.screenShake = 3
  spawnParticles(player.x + player.width / 2, player.y + player.height / 2, 16, ["#ef9f8f", "#ffffff", "#d26b3b"], 1.9, 0.04)
  playHitSound()

  if (player.health <= 0) {
    finishRun(false)
    return
  }

  if (shouldRespawn) {
    respawnPlayer()
  }

  setStatus("Trúng đòn - canh giữ khoảng cách", 46)
}

function damageEnemy(enemy, amount, direction) {
  if (enemy.dead) {
    return
  }

  enemy.health -= amount
  enemy.aggroTimer = Math.max(enemy.aggroTimer, 110)
  enemy.facing = direction >= 0 ? 1 : -1
  enemy.attackWindup = 0
  enemy.attackMode = "idle"
  enemy.attackCooldown = Math.max(enemy.attackCooldown, 14)
  enemy.velocityX = 1.1 * direction
  enemy.velocityY = -1.8
  enemy.grounded = false
  spawnParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 10, ["#ef9f8f", "#f8d26b", "#ffffff"], 1.6, 0.02)
  gainSpirit(8)

  if (enemy.health <= 0) {
    enemy.dead = true
    state.screenShake = 1.3
    gainSpirit(8)
    playEnemyDownSound()
  } else {
    playSlashSound()
  }
}

function damageBoss(amount, direction) {
  const boss = state.boss
  if (!boss || boss.health <= 0) {
    return
  }

  boss.health = Math.max(0, boss.health - amount)
  boss.flashTimer = 8
  boss.velocityX += direction * 0.35
  gainSpirit(10)
  state.screenShake = 1.4
  spawnParticles(boss.x + boss.width / 2, boss.y + boss.height / 2, 14, ["#f2779d", "#ffffff", "#f8d26b"], 1.8, 0.02)
  playSlashSound()

  if (boss.health === 0) {
    spawnParticles(boss.x + boss.width / 2, boss.y + boss.height / 2, 32, ["#f2779d", "#ffffff", "#f8d26b"], 2.4, 0.04)
    setStatus("Lõi Hộ Vệ đã bị đánh bại", 120)
    finishRun(true)
  }
}

function queueJump() {
  if (!state.gameRunning) {
    return
  }

  player.jumpBuffer = JUMP_BUFFER_FRAMES
}

function attemptDash() {
  if (!state.gameRunning || player.hurtTimer > 0 || player.isGuarding) {
    return
  }

  if (!player.canDash || player.dashCooldown > 0) {
    return
  }

  const direction = input.left ? -1 : input.right ? 1 : player.facing
  player.facing = direction
  player.canDash = false
  player.dashTimer = DASH_DURATION
  player.dashCooldown = DASH_COOLDOWN
  player.velocityX = DASH_SPEED * direction
  player.velocityY = 0
  player.grounded = false
  player.coyoteTimer = 0
  state.screenShake = 2.1
  spawnParticles(player.x + player.width / 2, player.y + player.height / 2, 18, ["#ffe59a", "#f0b454", "#ffffff"], 2, 0.01)
  spawnParticles(player.x + player.width / 2, player.y + player.height / 2, 10, ["#85f7ff", "#dfffff"], 1.6, 0.005)
  setStatus("Lướt kích hoạt", 20)
  playDashSound()
}

function performSlash() {
  if (!state.gameRunning || player.attackCooldown > 0 || player.isGuarding) {
    return
  }

  player.attackCooldown = 18
  player.attackPoseTimer = 10
  const width = 22
  const height = 14
  const x = player.facing > 0 ? player.x + player.width - 2 : player.x - width + 2

  meleeBursts.push({
    id: makeId(),
    owner: "player",
    x,
    y: player.y + 1,
    width,
    height,
    damage: SLASH_DAMAGE,
    direction: player.facing,
    life: 8,
    hitIds: new Set()
  })

  spawnParticles(player.x + (player.facing > 0 ? player.width : 0), player.y + 8, 8, ["#ffe59a", "#ffffff"], 1.3, 0.01)
  spawnParticles(player.x + (player.facing > 0 ? player.width : 0), player.y + 8, 6, ["#ffb36c", "#fff5c8"], 1.05, 0.005)
  setStatus("Chém mở đường", 18)
  playSlashSound()
}

function castBlast() {
  if (!state.gameRunning || player.blastCooldown > 0 || player.spirit < BLAST_COST || player.isGuarding) {
    return
  }

  player.spirit -= BLAST_COST
  player.blastCooldown = 28
  player.attackPoseTimer = 8

  projectiles.push({
    id: makeId(),
    owner: "player",
    kind: "blast",
    x: player.facing > 0 ? player.x + player.width : player.x - 6,
    y: player.y + 6,
    width: 6,
    height: 4,
    velocityX: player.facing * 4.9,
    velocityY: 0,
    damage: BLAST_DAMAGE,
    life: 90
  })

  spawnParticles(player.x + player.width / 2, player.y + 7, 10, ["#7af5ff", "#ffffff"], 1.4, 0.01)
  spawnParticles(player.x + player.width / 2, player.y + 7, 7, ["#7ab4ff", "#d5f2ff"], 1.1, 0.003)
  setStatus("Cầu năng lượng được phóng ra", 18)
  playBlastSound()
}

function updateCamera(delta) {
  const maxX = Math.max(0, state.currentLevel.width - canvas.width)
  const maxY = Math.max(0, state.currentLevel.height - canvas.height)
  const targetX = clamp(player.x - canvas.width / 2 + player.width / 2, 0, maxX)
  const targetY = clamp(player.y - canvas.height / 2 + player.height / 2, 0, maxY)

  camera.x += (targetX - camera.x) * 0.08 * delta
  camera.y += (targetY - camera.y) * 0.06 * delta
}

function spawnParticles(x, y, count, palette, speed, gravity) {
  for (let index = 0; index < count; index += 1) {
    const angle = Math.random() * Math.PI * 2
    const magnitude = Math.random() * speed

    particles.push({
      x,
      y,
      velocityX: Math.cos(angle) * magnitude,
      velocityY: Math.sin(angle) * magnitude - speed * 0.35,
      gravity,
      life: 12 + Math.random() * 14,
      size: 1 + Math.random() * 2,
      color: palette[Math.floor(Math.random() * palette.length)]
    })
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
    size: 2 + Math.random(),
    color: ["#ffe59a", "#ffffff", "#85f7ff", "#ff9b62"][Math.floor(Math.random() * 4)]
  })
}

function updateParticles(delta) {
  for (let index = particles.length - 1; index >= 0; index -= 1) {
    const particle = particles[index]
    particle.life -= delta
    particle.x += particle.velocityX * delta
    particle.y += particle.velocityY * delta
    particle.velocityY += particle.gravity * delta

    if (particle.life <= 0) {
      particles.splice(index, 1)
    }
  }
}

function drawGroundShadow(x, y, width, alpha = 0.2) {
  ctx.save()
  ctx.fillStyle = `rgba(5, 8, 14, ${alpha})`
  ctx.fillRect(x + 1, y, Math.max(2, width - 2), 2)
  ctx.restore()
}

function drawGlowRect(x, y, width, height, color, alpha = 0.18, padding = 2) {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.fillStyle = color
  ctx.fillRect(x - padding, y - padding, width + padding * 2, height + padding * 2)
  ctx.restore()
}

function render() {
  const shakeX = state.screenShake > 0 ? (Math.random() - 0.5) * state.screenShake : 0
  const shakeY = state.screenShake > 0 ? (Math.random() - 0.5) * state.screenShake : 0

  ctx.save()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.translate(-camera.x + shakeX, -camera.y + shakeY)

  drawSky()
  drawParallax()
  drawTiles()
  drawJumpPads()
  drawExits()
  drawBeacons()
  drawNpcs()
  drawCrystals()
  drawEnemies()
  drawBoss()
  drawProjectiles()
  drawMeleeBursts()
  drawParticles()
  drawPlayer()

  ctx.restore()

  const transitionAlpha = getTransitionAlpha()
  if (transitionAlpha > 0) {
    ctx.fillStyle = `rgba(6, 10, 18, ${transitionAlpha})`
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
}

function drawSky() {
  const palette = getCurrentPalette()
  const gradient = ctx.createLinearGradient(0, camera.y, 0, camera.y + canvas.height)
  gradient.addColorStop(0, palette.skyTop)
  gradient.addColorStop(1, palette.skyBottom)
  ctx.fillStyle = gradient
  ctx.fillRect(camera.x, camera.y, canvas.width, canvas.height)

  const sunX = camera.x + canvas.width * 0.76
  const sunY = camera.y + 36
  const sunGlow = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, 44)
  sunGlow.addColorStop(0, "rgba(255, 247, 210, 0.95)")
  sunGlow.addColorStop(0.35, "rgba(255, 224, 142, 0.38)")
  sunGlow.addColorStop(1, "rgba(255, 224, 142, 0)")
  ctx.fillStyle = sunGlow
  ctx.fillRect(sunX - 44, sunY - 44, 88, 88)

  for (let index = 0; index < 7; index += 1) {
    const sparkleX = camera.x + 18 + index * 52 + (index % 2) * 12
    const sparkleY = camera.y + 14 + (index % 3) * 11
    const sparkleAlpha = 0.12 + (Math.sin(player.runTime * 1.7 + index) + 1) * 0.06
    ctx.fillStyle = `rgba(255,255,255,${sparkleAlpha})`
    ctx.fillRect(sparkleX, sparkleY, 2, 2)
    ctx.fillRect(sparkleX + 1, sparkleY - 1, 1, 4)
    ctx.fillRect(sparkleX - 1, sparkleY + 1, 4, 1)
  }

  for (let index = 0; index < 5; index += 1) {
    const cloudX = camera.x * 0.25 + index * 88 + (index % 2) * 30
    const cloudY = camera.y * 0.08 + 18 + index * 9
    drawCloud(cloudX, cloudY)
  }
}

function drawParallax() {
  const palette = getCurrentPalette()
  const horizonY = state.currentLevel.height - 88

  ctx.fillStyle = "rgba(255, 231, 176, 0.12)"
  ctx.fillRect(camera.x, horizonY + 8, canvas.width, 20)

  ctx.fillStyle = palette.hillBack
  for (let index = 0; index < 9; index += 1) {
    const baseX = index * 70 - (camera.x * 0.25) % 70
    drawHill(baseX, horizonY + 16, 62, 28)
  }

  ctx.fillStyle = palette.hillFront
  for (let index = 0; index < 7; index += 1) {
    const baseX = index * 94 - (camera.x * 0.42) % 94
    drawHill(baseX, horizonY + 30, 80, 40)
  }
}

function drawTiles() {
  const palette = getCurrentPalette()

  state.currentLevel.solids.forEach((tile) => {
    drawBlock(tile.x, tile.y, palette.tileTop, palette.tileSide)
  })

  state.currentLevel.spikes.forEach((spike) => {
    ctx.fillStyle = "#d8ddd2"
    ctx.beginPath()
    ctx.moveTo(spike.x, spike.y + spike.height)
    ctx.lineTo(spike.x + TILE / 2, spike.y)
    ctx.lineTo(spike.x + TILE, spike.y + spike.height)
    ctx.fill()
    ctx.fillStyle = "#7f8b8c"
    ctx.fillRect(spike.x, spike.y + spike.height - 2, TILE, 2)
  })
}

function drawJumpPads() {
  state.currentLevel.jumpPads.forEach((pad) => {
    const bounce = Math.sin(pad.bounce * Math.PI) * 3
    ctx.fillStyle = "#5d486b"
    ctx.fillRect(pad.x, pad.y + 2, TILE, 4)
    ctx.fillStyle = "#f8d26b"
    ctx.fillRect(pad.x + 2, pad.y - bounce, TILE - 4, 3)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(pad.x + 5, pad.y - 1 - bounce, 6, 1)
  })
}

function drawExits() {
  if (!state.currentLevel.exits.length) {
    return
  }

  const allCrystalsCollected = state.totalCrystals > 0 && player.crystals >= state.totalCrystals

  state.currentLevel.exits.forEach((exit) => {
    const isMissionGate = exit.key === "Y"
    const pillarColor = isMissionGate ? "#f7eb8a" : "#c7f6ff"
    const coreColor = isMissionGate
      ? allCrystalsCollected
        ? "#ffe59a"
        : "#f0b454"
      : allCrystalsCollected
        ? "#82f0ff"
        : "#4fd1ff"
    const auraColor = isMissionGate ? "rgba(248, 210, 107, 0.22)" : "rgba(79, 209, 255, 0.18)"
    const auraWidth = (allCrystalsCollected ? 28 : 22) + Math.sin(exit.pulse) * 4

    drawGlowRect(exit.x + 2, exit.y + 2, 12, 28, isMissionGate ? "#f8d26b" : "#85f7ff", 0.12, 4)
    ctx.fillStyle = pillarColor
    ctx.fillRect(exit.x + 4, exit.y, 8, 32)
    ctx.fillStyle = coreColor
    ctx.fillRect(exit.x, exit.y + 4, 16, 24)
    ctx.fillStyle = "rgba(255, 255, 255, 0.26)"
    ctx.fillRect(exit.x + 3, exit.y + 5, 2, 20)

    ctx.fillStyle = auraColor
    ctx.fillRect(exit.x - (auraWidth - 16) / 2, exit.y, auraWidth, 32)

    ctx.fillStyle = "rgba(255,255,255,0.8)"
    ctx.fillRect(exit.x + 6, exit.y + 8, 4, 2)
    ctx.fillRect(exit.x + 6, exit.y + 14, 4, 1)
  })
}

function drawNpcs() {
  const nearbyNpc = getNearbyNpc()

  state.currentLevel.npcs.forEach((npc) => {
    const palette =
      npc.key === "N"
        ? { outfit: "#476b56", accent: "#ffe59a" }
        : npc.key === "M"
          ? { outfit: "#91583f", accent: "#85f7ff" }
          : { outfit: "#355e88", accent: "#f8d26b" }

    drawGroundShadow(npc.x, npc.y + npc.height - 1, npc.width, 0.18)
    if (nearbyNpc && nearbyNpc.id === npc.id) {
      drawGlowRect(npc.x + 2, npc.y + 2, 10, 12, palette.accent, 0.14, 2)
    }

    ctx.fillStyle = "#131821"
    ctx.fillRect(npc.x + 1, npc.y + 2, 12, 13)
    ctx.fillStyle = palette.outfit
    ctx.fillRect(npc.x + 2, npc.y + 5, 10, 8)
    ctx.fillStyle = "#ffcf99"
    ctx.fillRect(npc.x + 4, npc.y + 2, 6, 5)
    ctx.fillStyle = palette.accent
    ctx.fillRect(npc.x + 3, npc.y + 1, 8, 2)
    ctx.fillStyle = "#1a1a1a"
    ctx.fillRect(npc.x + 5, npc.y + 4, 1, 1)
    ctx.fillRect(npc.x + 8, npc.y + 4, 1, 1)
    ctx.fillStyle = "#efe6ce"
    ctx.fillRect(npc.x + 5, npc.y + 6, 4, 1)
    ctx.fillStyle = palette.accent
    ctx.fillRect(npc.x + 3, npc.y + 13, 8, 2)

    if (nearbyNpc && nearbyNpc.id === npc.id) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.92)"
      ctx.fillRect(npc.x + 5, npc.y - 8, 4, 4)
      ctx.fillStyle = "#1b1b1b"
      ctx.fillRect(npc.x + 6, npc.y - 7, 2, 1)
    }
  })
}

function drawBeacons() {
  state.currentLevel.beacons.forEach((beacon) => {
    const flameLift = Math.sin(beacon.glow) * 2
    ctx.fillStyle = "#76543a"
    ctx.fillRect(beacon.x + 5, beacon.y + 8, 4, 16)
    ctx.fillStyle = beacon.active ? "#ffe59a" : "#8b7052"
    ctx.fillRect(beacon.x + 2, beacon.y + 6, 10, 3)
    ctx.fillStyle = beacon.active ? "#fffbdd" : "#d3b48a"
    ctx.fillRect(beacon.x + 4, beacon.y + 1 - flameLift, 6, 7)
    ctx.fillStyle = beacon.active ? "rgba(248, 210, 107, 0.22)" : "rgba(139, 112, 82, 0.15)"
    ctx.fillRect(beacon.x - 3, beacon.y - 4, 20, 30)
  })
}

function drawCrystals() {
  state.currentLevel.crystals.forEach((crystal) => {
    if (crystal.collected) {
      return
    }

    const bobOffset = Math.sin(crystal.bob) * 2
    drawGlowRect(crystal.x, crystal.y - bobOffset, 8, 8, "#85f7ff", 0.14, 2)
    ctx.fillStyle = "#85f7ff"
    ctx.fillRect(crystal.x + 2, crystal.y - bobOffset, 4, 8)
    ctx.fillRect(crystal.x, crystal.y + 2 - bobOffset, 8, 4)
    ctx.fillStyle = "#d9ffff"
    ctx.fillRect(crystal.x + 3, crystal.y + 1 - bobOffset, 2, 2)
    ctx.fillRect(crystal.x + 2, crystal.y + 6 - bobOffset, 1, 1)
  })
}

function drawEnemies() {
  state.currentLevel.enemies.forEach((enemy) => {
    if (enemy.dead) {
      return
    }

    drawGroundShadow(enemy.x, enemy.y + enemy.height - 1, enemy.width, 0.22)

    const outfitColor = enemy.variant === "ranged" ? "#4d3d7f" : "#6b2f50"
    const accentColor = enemy.variant === "ranged" ? "#8ce6ff" : "#f2779d"
    if (enemy.attackWindup > 0 || enemy.aggroTimer > 0) {
      drawGlowRect(enemy.x + 1, enemy.y + 2, 12, 11, accentColor, enemy.attackWindup > 0 ? 0.18 : 0.1, 2)
    }

    ctx.fillStyle = "#1a1620"
    ctx.fillRect(enemy.x + 1, enemy.y + 2, 12, 11)
    ctx.fillStyle = outfitColor
    ctx.fillRect(enemy.x + 2, enemy.y + 3, 10, 9)
    ctx.fillStyle = "#221626"
    ctx.fillRect(enemy.x + 3, enemy.y + 10, 8, 2)
    ctx.fillStyle = "#ef9f8f"
    ctx.fillRect(enemy.x + 4, enemy.y + 4, 6, 4)
    ctx.fillStyle = "#f4ead7"
    ctx.fillRect(enemy.x + 5, enemy.y + 7, 4, 1)
    ctx.fillStyle = enemy.attackWindup > 0 ? "#ffe59a" : accentColor
    ctx.fillRect(enemy.x + (enemy.facing > 0 ? 9 : 3), enemy.y + 6, 2, 2)
    ctx.fillStyle = accentColor
    ctx.fillRect(enemy.x + (enemy.facing > 0 ? 10 : 1), enemy.y + 8, 2, 1)
    ctx.fillStyle = "#181818"
    ctx.fillRect(enemy.x + 4, enemy.y + 10, 2, 2)
    ctx.fillRect(enemy.x + 8, enemy.y + 10, 2, 2)
    ctx.fillRect(enemy.x + (enemy.facing > 0 ? 10 : 2), enemy.y + 6, 2, 2)
  })
}

function drawBoss() {
  const boss = state.boss
  if (!boss || boss.health <= 0) {
    return
  }

  const flash = boss.flashTimer > 0
  drawGroundShadow(boss.x + 2, boss.y + boss.height - 1, boss.width - 4, 0.24)
  drawGlowRect(boss.x + 6, boss.y + 5, 18, 16, boss.phase === 2 ? "#ffdd7a" : "#7af5ff", 0.12, 4)

  ctx.fillStyle = flash ? "#fff7f2" : "#381926"
  ctx.fillRect(boss.x + 3, boss.y + 3, 24, 21)
  ctx.fillStyle = flash ? "#fff7f2" : "#742f53"
  ctx.fillRect(boss.x + 4, boss.y + 4, 22, 20)
  ctx.fillStyle = "#ef9f8f"
  ctx.fillRect(boss.x + 8, boss.y + 8, 14, 7)
  ctx.fillStyle = "#f5ebdc"
  ctx.fillRect(boss.x + 10, boss.y + 16, 10, 1)
  ctx.fillStyle = boss.phase === 2 ? "#ffdd7a" : "#7af5ff"
  ctx.fillRect(boss.x + 12, boss.y + 12, 6, 6)
  ctx.fillRect(boss.x + 11, boss.y + 11, 8, 1)
  ctx.fillRect(boss.x + 11, boss.y + 18, 8, 1)
  ctx.fillStyle = "#1b1b1b"
  ctx.fillRect(boss.x + (boss.facing > 0 ? 20 : 8), boss.y + 16, 3, 2)
  ctx.fillRect(boss.x + 6, boss.y + 6, 3, 2)
  ctx.fillRect(boss.x + 21, boss.y + 6, 3, 2)

  if (boss.attackMode === "windup") {
    ctx.fillStyle = "rgba(255, 221, 122, 0.25)"
    ctx.fillRect(boss.x - 4, boss.y - 4, boss.width + 8, boss.height + 8)
  }
}

function drawProjectiles() {
  projectiles.forEach((projectile) => {
    if (projectile.kind === "blast") {
      drawGlowRect(projectile.x, projectile.y, projectile.width, projectile.height, "#7af5ff", 0.2, 3)
      ctx.fillStyle = "rgba(122, 245, 255, 0.4)"
      ctx.fillRect(projectile.x - Math.sign(projectile.velocityX || 1) * 6, projectile.y + 1, 8, 2)
      ctx.fillStyle = "#7af5ff"
      ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height)
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(projectile.x + 1, projectile.y + 1, projectile.width - 2, projectile.height - 2)
      return
    }

    if (projectile.kind === "orb") {
      drawGlowRect(projectile.x, projectile.y, projectile.width, projectile.height, "#f2779d", 0.18, 3)
      ctx.fillStyle = "#f2779d"
      ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height)
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(projectile.x + 2, projectile.y + 2, 2, 2)
      ctx.fillRect(projectile.x + 1, projectile.y + 1, 1, 1)
      return
    }

    if (projectile.kind === "kunai") {
      ctx.fillStyle = "rgba(156, 200, 255, 0.25)"
      ctx.fillRect(projectile.x - Math.sign(projectile.velocityX || 1) * 4, projectile.y + 1, 6, 1)
      ctx.fillStyle = "#9cc8ff"
      ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height)
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(projectile.x + 1, projectile.y + 1, projectile.width - 2, 1)
      return
    }

    drawGlowRect(projectile.x, projectile.y, projectile.width, projectile.height, "#f2779d", 0.12, 2)
    ctx.fillStyle = "#f8d26b"
    ctx.fillRect(projectile.x, projectile.y + 1, projectile.width, 3)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(projectile.x + 2, projectile.y, projectile.width - 4, 1)
    ctx.fillRect(projectile.x + 3, projectile.y + 4, projectile.width - 6, 1)
  })
}

function drawMeleeBursts() {
  meleeBursts.forEach((burst) => {
    const baseAlpha = Math.min(1, burst.life / 7) * 0.78
    const mainColor = burst.owner === "enemy" ? "#f2779d" : "#ffe59a"
    const highlightColor = burst.owner === "enemy" ? "#fff2f6" : "#ffffff"
    const tipX = burst.direction > 0 ? burst.x + burst.width : burst.x
    const tailX = burst.direction > 0 ? burst.x + 2 : burst.x + burst.width - 2

    ctx.save()
    ctx.globalAlpha = baseAlpha * 0.45
    ctx.fillStyle = mainColor
    ctx.beginPath()
    ctx.moveTo(tailX, burst.y + burst.height - 1)
    ctx.lineTo(tipX, burst.y + 1)
    ctx.lineTo(tipX - burst.direction * 6, burst.y + burst.height + 1)
    ctx.lineTo(tailX - burst.direction * 4, burst.y + burst.height + 3)
    ctx.closePath()
    ctx.fill()

    ctx.globalAlpha = baseAlpha
    ctx.fillStyle = mainColor
    ctx.beginPath()
    ctx.moveTo(tailX, burst.y + burst.height - 2)
    ctx.lineTo(tipX - burst.direction * 1, burst.y + 2)
    ctx.lineTo(tipX - burst.direction * 5, burst.y + burst.height - 1)
    ctx.lineTo(tailX - burst.direction * 4, burst.y + burst.height)
    ctx.closePath()
    ctx.fill()

    ctx.globalAlpha = baseAlpha
    ctx.fillStyle = highlightColor
    ctx.beginPath()
    ctx.moveTo(tailX, burst.y + burst.height - 3)
    ctx.lineTo(tipX - burst.direction * 2, burst.y + 3)
    ctx.lineTo(tipX - burst.direction * 4, burst.y + burst.height - 3)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  })
}

function drawParticles() {
  particles.forEach((particle) => {
    ctx.globalAlpha = Math.min(1, particle.life / 12)
    ctx.fillStyle = particle.color
    ctx.fillRect(particle.x, particle.y, particle.size, particle.size)
    if (particle.size > 1.8) {
      ctx.fillStyle = "rgba(255,255,255,0.72)"
      ctx.fillRect(particle.x + 0.5, particle.y + 0.5, Math.max(1, particle.size - 1.2), Math.max(1, particle.size - 1.2))
    }
  })

  ctx.globalAlpha = 1
}

function drawPlayer() {
  const blink = player.hurtTimer > 0 && Math.floor(player.hurtTimer / 4) % 2 === 0
  if (blink) {
    return
  }

  const bob = player.grounded && Math.abs(player.velocityX) > 0.12 ? Math.sin(player.runTime * 18) * 0.5 : 0
  const bodyY = Math.round(player.y + bob)
  const scarfDrift = Math.round((Math.sin(player.runTime * 14) * 1.2 + Math.abs(player.velocityX) * 1.8 + player.dashTimer * 0.2) * player.facing)
  drawGroundShadow(player.x, player.y + player.height - 1, player.width, 0.22)

  if (player.dashTimer > 0) {
    for (let ghost = 3; ghost >= 1; ghost -= 1) {
      const offset = player.facing * ghost * 4
      const alpha = 0.1 + ghost * 0.05
      ctx.fillStyle = `rgba(255, 229, 154, ${alpha})`
      ctx.fillRect(player.x - offset + 2, bodyY + 3, 8, 9)
    }
    drawGlowRect(player.x + 2, bodyY + 2, 8, 10, "#ffe59a", 0.12, 3)
  }

  if (player.isGuarding) {
    drawGlowRect(player.x - 1, bodyY, player.width + 2, player.height, "#7af5ff", 0.18, 4)
    ctx.fillStyle = "rgba(122, 245, 255, 0.24)"
    ctx.fillRect(player.x - 3, bodyY - 2, player.width + 6, player.height + 4)
  }

  ctx.fillStyle = "#11161d"
  ctx.fillRect(player.x + 1, bodyY + 1, 10, 13)
  ctx.fillStyle = "#ff654f"
  if (player.facing > 0) {
    ctx.fillRect(player.x - 2 - scarfDrift, bodyY + 6, 5, 2)
    ctx.fillRect(player.x - 4 - scarfDrift, bodyY + 7, 4, 1)
  } else {
    ctx.fillRect(player.x + 9 - scarfDrift, bodyY + 6, 5, 2)
    ctx.fillRect(player.x + 12 - scarfDrift, bodyY + 7, 4, 1)
  }

  ctx.fillStyle = "#2e4f71"
  ctx.fillRect(player.x + 3, bodyY + 2, 6, 3)
  ctx.fillStyle = "#78c0ff"
  ctx.fillRect(player.x + 3, bodyY + 2, 6, 1)
  ctx.fillStyle = "#ffcf99"
  ctx.fillRect(player.x + 4, bodyY + 4, 4, 4)
  ctx.fillStyle = "#d26045"
  ctx.fillRect(player.x + 2, bodyY + 8, 8, 3)
  ctx.fillStyle = "#f7d98b"
  ctx.fillRect(player.x + 3, bodyY + 8, 6, 1)
  ctx.fillStyle = "#203a66"
  ctx.fillRect(player.x + 2, bodyY + 11, 3, 3)
  ctx.fillRect(player.x + 7, bodyY + 11, 3, 3)
  ctx.fillStyle = "#101010"
  ctx.fillRect(player.x + 2, bodyY + 14, 3, 1)
  ctx.fillRect(player.x + 7, bodyY + 14, 3, 1)
  ctx.fillStyle = "#101010"
  ctx.fillRect(player.x + (player.facing > 0 ? 7 : 5), bodyY + 5, 1, 1)
  ctx.fillStyle = "#ffe59a"
  ctx.fillRect(player.x + (player.facing > 0 ? 8 : 4), bodyY + 3, 1, 1)

  if (player.attackPoseTimer > 0) {
    drawGlowRect(
      player.facing > 0 ? player.x + 10 : player.x - 2,
      bodyY + 7,
      4,
      3,
      "#ffe59a",
      0.22,
      2
    )
    ctx.fillStyle = "#ffe59a"
    if (player.facing > 0) {
      ctx.fillRect(player.x + 10, bodyY + 8, 4, 2)
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(player.x + 11, bodyY + 7, 3, 1)
    } else {
      ctx.fillRect(player.x - 2, bodyY + 8, 4, 2)
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(player.x - 2, bodyY + 7, 3, 1)
    }
  }

  if (player.canDash && player.dashCooldown <= 0) {
    drawGlowRect(player.x + 1, bodyY + 2, 10, 11, "#85f7ff", 0.06, 2)
    ctx.fillStyle = "#ffe59a"
    ctx.fillRect(player.x + 1, bodyY + 6, 1, 1)
    ctx.fillRect(player.x + 10, bodyY + 3, 1, 1)
    ctx.fillRect(player.x + 9, bodyY + 12, 1, 1)
  }
}

function drawBlock(x, y, topColor, sideColor) {
  ctx.fillStyle = sideColor
  ctx.fillRect(x, y, TILE, TILE)
  ctx.fillStyle = topColor
  ctx.fillRect(x, y, TILE, 4)
  ctx.fillStyle = "rgba(255,255,255,0.08)"
  ctx.fillRect(x + 2, y + 6, 4, 2)
  ctx.fillRect(x + 10, y + 10, 3, 2)
}

function drawCloud(x, y) {
  ctx.fillStyle = "rgba(255, 255, 255, 0.72)"
  ctx.fillRect(x, y, 18, 6)
  ctx.fillRect(x + 5, y - 4, 14, 6)
  ctx.fillRect(x + 12, y + 2, 14, 5)
}

function drawHill(x, y, width, height) {
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.quadraticCurveTo(x + width / 2, y - height, x + width, y)
  ctx.lineTo(x + width, state.currentLevel.height)
  ctx.lineTo(x, state.currentLevel.height)
  ctx.closePath()
  ctx.fill()
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  const tenths = Math.floor((totalSeconds * 10) % 10)
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`
}

function setKeyState(event, pressed) {
  const { code } = event

  if (code === "ArrowLeft" || code === "KeyA") {
    input.left = pressed
  }

  if (code === "ArrowRight" || code === "KeyD") {
    input.right = pressed
  }

  if (code === "KeyF") {
    input.guard = pressed
  }

  if ((code === "ArrowUp" || code === "KeyW" || code === "Space") && pressed) {
    queueJump()
  }

  if ((code === "ShiftLeft" || code === "ShiftRight") && pressed) {
    attemptDash()
  }

  if (code === "KeyJ" && pressed) {
    performSlash()
  }

  if (code === "KeyL" && pressed) {
    castBlast()
  }

  if (code === "KeyE" && pressed) {
    tryInteract()
  }

  if (code === "KeyR" && pressed) {
    handleOverlayAction()
  }
}

window.addEventListener("keydown", (event) => {
  if (
    [
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "Space",
      "ShiftLeft",
      "ShiftRight",
      "KeyF",
      "KeyE"
    ].includes(event.code)
  ) {
    event.preventDefault()
  }

  ensureAudio()
  setKeyState(event, true)
})

window.addEventListener("keyup", (event) => {
  setKeyState(event, false)
})

window.addEventListener("blur", () => {
  input.left = false
  input.right = false
  input.guard = false
})

window.addEventListener("resize", () => {
  updateMobileLayoutState()
  updateFullscreenButtonLabel()
})

window.addEventListener("orientationchange", () => {
  updateMobileLayoutState()
  updateFullscreenButtonLabel()
})

document.addEventListener("fullscreenchange", () => {
  const isNativeFullscreen = document.fullscreenElement === gamePanelEl
  gamePanelEl.classList.toggle("is-fullscreen", isNativeFullscreen)

  if (isNativeFullscreen) {
    lockLandscapeIfPossible()
  } else {
    unlockLandscapeIfPossible()
  }

  updateFullscreenButtonLabel()
  updateMobileLayoutState()
})

overlayButtonEl.addEventListener("click", () => {
  handleOverlayAction()
})

fullscreenButtonEl.addEventListener("click", () => {
  toggleFullscreenMode()
})

rotateFullscreenButtonEl.addEventListener("click", () => {
  toggleFullscreenMode()
})

hudToggleButtonEl.addEventListener("click", () => {
  toggleBottomHud()
})

touchButtons.forEach((button) => {
  const action = button.dataset.action

  const start = (event) => {
    event.preventDefault()
    ensureAudio()
    button.classList.add("active")

    if (action === "left") {
      input.left = true
    } else if (action === "right") {
      input.right = true
    } else if (action === "jump") {
      queueJump()
    } else if (action === "dash") {
      attemptDash()
    } else if (action === "slash") {
      performSlash()
    } else if (action === "blast") {
      castBlast()
    } else if (action === "interact") {
      tryInteract()
    } else if (action === "guard") {
      input.guard = true
    }
  }

  const end = (event) => {
    event.preventDefault()
    button.classList.remove("active")

    if (action === "left") {
      input.left = false
    } else if (action === "right") {
      input.right = false
    } else if (action === "guard") {
      input.guard = false
    }
  }

  button.addEventListener("pointerdown", start)
  button.addEventListener("pointerup", end)
  button.addEventListener("pointerleave", end)
  button.addEventListener("pointercancel", end)
})

loadLevel(0, true)
state.overlayMode = "start"
applyBottomHudState(readStoredHudCollapsed())
setOverlay(
  "Làng ninja mới",
  "Đi qua làng, sân tập và tuyến nhiệm vụ chính",
  "Đi qua làng, ghé sân tập quái, nói chuyện với NPC rồi bắt đầu tuyến nhiệm vụ chính.",
  "Bắt đầu hành trình",
  true
)
updateMobileLayoutState()
updateFullscreenButtonLabel()
refreshHud()
render()
