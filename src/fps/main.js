import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HumanoidRig } from '../anim/humanoidRig.js';
import { resolveConfig, analyzeFootPlant } from '../anim/walkClip.js';
import { makeAgent, updateChase } from './chase.js';
import { installDiagnostics, webglSupport } from '../diag.js';

const diag = installDiagnostics('MICHAEL');
const gl = webglSupport();
if (!gl.ok) {
  diag.fatal(
    'WebGL недоступен в этом окне',
    'Браузер не выдал 3D-контекст. Открой страницу в отдельной вкладке (кнопка ⤢ в превью) — в iframe 3D иногда блокируется.',
  );
  throw new Error('webgl-unavailable');
}

/**
 * Первое лицо: ты в ночном лесу, Michael Myers идёт за тобой.
 *
 * Поведение: пока ты двигаешься — он идёт. Подошёл на 3 метра — встаёт и
 * смотрит. Отойдёшь — снова идёт. Скорость его шага равна скорости клипа
 * walk, поэтому стопы не скользят ни на одном кадре.
 */

/* ------------------------------- настройки ------------------------------- */

const CFG = {
  eyeHeight: 1.7,
  walkSpeed: 1.75,
  runSpeed: 4.6,
  accel: 9,
  lookSpeed: 0.0022,
  playerRadius: 0.34,
  arenaRadius: 34,

  spawnDistance: 13,
};

/** правила погони (проверяются в test/fps-chase.mjs) */
const CHASE = {
  stopDistance: 3.2, // ближе — встаёт и смотрит
  resumeDistance: 4.8, // дальше — снова идёт
  turnRate: 2.4, // рад/с, как разворачивается
  approachRate: 5.5, // плавность разгона/торможения
  hurry: 1.12, // его шаг чуть быстрее клипа — догоняет идущего
};

const clamp = THREE.MathUtils.clamp;
const damp = THREE.MathUtils.damp;

/* --------------------------------- сцена --------------------------------- */

const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });

/** В iframe превью канвас может родиться с нулевым размером — подгоняем постоянно */
function fitRenderer() {
  const w = Math.max(1, canvas.clientWidth || innerWidth || 1);
  const h = Math.max(1, canvas.clientHeight || innerHeight || 1);
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const bw = Math.floor(w * dpr);
  const bh = Math.floor(h * dpr);
  if (canvas.width === bw && canvas.height === bh) return false;
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  return true;
}

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x060a12);
scene.fog = new THREE.Fog(0x060a12, 8, 46);

const camera = new THREE.PerspectiveCamera(72, (innerWidth || 1) / (innerHeight || 1), 0.05, 260);
camera.rotation.order = 'YXZ';
scene.add(camera);
fitRenderer();

canvas.addEventListener('webglcontextlost', (e) => {
  e.preventDefault();
  diag.fatal('Потерян 3D-контекст', 'GPU отвалился — перезагрузи страницу. Если повторяется, открой её в отдельной вкладке.');
});

/* свет: луна + очень слабая заливка + фонарик в руках */
const moon = new THREE.DirectionalLight(0xa9c2ff, 1.15);
moon.position.set(-14, 26, -10);
moon.castShadow = true;
moon.shadow.mapSize.set(2048, 2048);
moon.shadow.camera.near = 1;
moon.shadow.camera.far = 70;
moon.shadow.camera.left = -18;
moon.shadow.camera.right = 18;
moon.shadow.camera.top = 18;
moon.shadow.camera.bottom = -18;
moon.shadow.bias = -0.0012;
scene.add(moon);
scene.add(moon.target);

scene.add(new THREE.HemisphereLight(0x3a5480, 0x0a0f18, 1.0));

const flashlight = new THREE.SpotLight(0xfff2d8, 140, 55, 0.6, 0.55, 1.1);
flashlight.position.set(0, -0.12, 0.1);
flashlight.target.position.set(0, -0.1, -1);
camera.add(flashlight);
camera.add(flashlight.target);

// слабый «фонарь под ногами»: пол виден даже если луч смотрит в небо
const glow = new THREE.PointLight(0x9dc4ff, 6, 9, 1.6);
glow.position.set(0, 1.2, 0);
camera.add(glow);

/* луна: большой диск в небе — сразу видно, что 3D рисуется */
const moonDisc = new THREE.Mesh(
  new THREE.CircleGeometry(6, 48),
  new THREE.MeshBasicMaterial({ color: 0xdfe8ff, fog: false }),
);
moonDisc.position.set(-40, 46, -70);
moonDisc.lookAt(0, 2, 0);
scene.add(moonDisc);
const moonHalo = new THREE.Mesh(
  new THREE.CircleGeometry(13, 48),
  new THREE.MeshBasicMaterial({ color: 0x5f79b8, transparent: true, opacity: 0.35, fog: false, depthWrite: false }),
);
moonHalo.position.copy(moonDisc.position).multiplyScalar(1.02);
moonHalo.lookAt(0, 2, 0);
scene.add(moonHalo);

/* ------------------------------- окружение ------------------------------- */

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const rng = makeRng(20261120);

/** земля: тёмная почва с редкими пятнами, чтобы движение читалось */
function groundTexture() {
  const size = 512;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  g.fillStyle = '#191d25';
  g.fillRect(0, 0, size, size);
  for (let i = 0; i < 5200; i++) {
    const v = 22 + Math.random() * 34;
    g.fillStyle = `rgba(${v},${v + 3},${v + 7},${0.25 + Math.random() * 0.35})`;
    const r = 1 + Math.random() * 4;
    g.beginPath();
    g.arc(Math.random() * size, Math.random() * size, r, 0, Math.PI * 2);
    g.fill();
  }
  for (let i = 0; i < 2600; i++) {
    g.fillStyle = `rgba(4,6,9,${0.2 + Math.random() * 0.4})`;
    g.fillRect(Math.random() * size, Math.random() * size, 1 + Math.random() * 3, 1 + Math.random() * 3);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(26, 26);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

const ground = new THREE.Mesh(
  new THREE.CircleGeometry(120, 64),
  new THREE.MeshStandardMaterial({ map: groundTexture(), roughness: 1, metalness: 0 }),
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

/* мёртвые деревья — и препятствия, и ориентиры */
const obstacles = [];
const trunkMat = new THREE.MeshStandardMaterial({ color: 0x1b1d21, roughness: 0.95 });
const branchMat = new THREE.MeshStandardMaterial({ color: 0x232529, roughness: 0.9 });

function addTree(x, z) {
  const h = 4.6 + rng() * 5.4;
  const r = 0.16 + rng() * 0.16;
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.55, r, h, 7), trunkMat);
  trunk.position.y = h / 2;
  trunk.castShadow = true;
  trunk.rotation.z = (rng() - 0.5) * 0.08;
  group.add(trunk);

  const branches = 3 + Math.floor(rng() * 4);
  for (let i = 0; i < branches; i++) {
    const len = 0.9 + rng() * 1.9;
    const b = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.14, r * 0.3, len, 5), branchMat);
    const y = h * (0.42 + rng() * 0.55);
    const a = rng() * Math.PI * 2;
    b.position.set(Math.cos(a) * len * 0.3, y, Math.sin(a) * len * 0.3);
    b.rotation.set((rng() - 0.5) * 0.5, a, Math.PI / 2.4 + rng() * 0.35);
    group.add(b);
  }

  group.position.set(x, 0, z);
  group.rotation.y = rng() * Math.PI * 2;
  scene.add(group);
  obstacles.push({ x, z, r: r + 0.25 });
}

/** кольцо леса: сначала прореженное (видно, куда идти), дальше — плотное */
for (let i = 0; i < 95; i++) {
  const a = rng() * Math.PI * 2;
  const d = 7 + Math.pow(rng(), 0.72) * 38;
  if (d < CFG.arenaRadius && rng() < 0.35) continue;
  addTree(Math.cos(a) * d, Math.sin(a) * d);
}

/* редкие пни и камни — чтобы пол не был пустым */
const stoneMat = new THREE.MeshStandardMaterial({ color: 0x2a2d33, roughness: 0.85, metalness: 0.05 });
for (let i = 0; i < 26; i++) {
  const a = rng() * Math.PI * 2;
  const d = 5 + rng() * 28;
  const s = 0.3 + rng() * 0.7;
  const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), stoneMat);
  rock.position.set(Math.cos(a) * d, s * 0.42, Math.sin(a) * d);
  rock.rotation.set(rng() * 3, rng() * 3, rng() * 3);
  rock.castShadow = true;
  rock.receiveShadow = true;
  scene.add(rock);
  obstacles.push({ x: rock.position.x, z: rock.position.z, r: s * 0.9 });
}

/* -------------------------------- игрок --------------------------------- */

const player = {
  pos: new THREE.Vector3(0, 0, 0),
  vel: new THREE.Vector3(),
  speed: 0,
  yaw: 0,
  pitch: 0,
  bob: 0,
  stepPhase: 0,
  lastStep: 0,
};

const keys = new Set();
let started = false;
let locked = false;

/* ------------------------------- Майкл ---------------------------------- */

const loader = new GLTFLoader();
const michael = {
  root: null,
  holder: new THREE.Group(),
  inner: new THREE.Group(), // разворот модели: её «вперёд» не совпадает с +Z
  mixer: null,
  idle: null,
  walk: null,
  walkWeight: 0,
  clipSpeed: 2,
  state: 'idle',
  ready: false,
  pos: new THREE.Vector3(0, 0, -12),
  facing: Math.PI,
  footstepTimer: 0,
  agent: makeAgent({ x: 0, z: -12, facing: Math.PI, clipSpeed: 2.05 }),
};
michael.holder.add(michael.inner);
scene.add(michael.holder);
michael.holder.position.copy(michael.pos);

async function loadMichael() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  let res;
  try {
    res = await fetch('assets/models/character.glb', { cache: 'no-store', signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = await res.arrayBuffer();
  const gltf = await new Promise((resolve, reject) => loader.parse(buf, '', resolve, reject));
  const root = gltf.scene;

  // рост ~1.85 м, ступни на земле
  root.updateWorldMatrix(true, true);
  let box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const scale = size.y > 2.6 || size.y < 1.15 ? 1.85 / size.y : 1;
  root.scale.multiplyScalar(scale);
  root.updateWorldMatrix(true, true);
  box = new THREE.Box3().setFromObject(root);
  root.position.y -= box.min.y;

  root.traverse((o) => {
    if (o.isMesh || o.isSkinnedMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
      o.frustumCulled = false;
    }
  });

  michael.root = root;
  michael.inner.add(root);

  // риг нужен только чтобы узнать скорость шага из клипа
  const rig = new HumanoidRig(root);
  const cfg = resolveConfig(rig, { preset: 'stalker' });
  const diag = analyzeFootPlant(rig, cfg);
  michael.clipSpeed = diag.matchedSpeed || 1.95;

  // модель смотрит не строго в +Z — доворачиваем, иначе он ходит боком
  if (rig.axes.forwardVerified) {
    michael.inner.rotation.y = -Math.atan2(rig.axes.forward.x, rig.axes.forward.z);
  }

  michael.mixer = new THREE.AnimationMixer(root);
  const idleClip = THREE.AnimationClip.findByName(gltf.animations, 'Idle') || gltf.animations[0];
  const walkClip = THREE.AnimationClip.findByName(gltf.animations, 'walk') ||
    gltf.animations.find((a) => /walk/i.test(a.name));

  if (idleClip) {
    michael.idle = michael.mixer.clipAction(idleClip);
    michael.idle.play();
  }
  if (walkClip) {
    michael.walk = michael.mixer.clipAction(walkClip);
    michael.walk.play();
    michael.walk.setEffectiveWeight(0);
  }
  michael.ready = true;
  console.info('[michael]', { clipSpeed: michael.clipSpeed, idle: idleClip?.name, walk: walkClip?.name });
}

/* -------------------------------- звук ----------------------------------- */

const audio = {
  ctx: null,
  master: null,
  noise: null,
};

function initAudio() {
  if (audio.ctx) return;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  const ctx = new Ctx();
  const master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);

  // низкий гул
  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.055;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 260;
  droneGain.connect(lp).connect(master);
  for (const f of [41.5, 55.3, 82.6]) {
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = f;
    osc.detune.value = (Math.random() - 0.5) * 12;
    osc.connect(droneGain);
    osc.start();
  }
  // медленная пульсация фильтра — «дыхание» леса
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.06;
  lfoGain.gain.value = 90;
  lfo.connect(lfoGain).connect(lp.frequency);
  lfo.start();

  // ветер: шум через полосовой фильтр
  const len = ctx.sampleRate * 2;
  const noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

  const wind = ctx.createBufferSource();
  wind.buffer = noiseBuf;
  wind.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 420;
  bp.Q.value = 0.7;
  const windGain = ctx.createGain();
  windGain.gain.value = 0.035;
  wind.connect(bp).connect(windGain).connect(master);
  wind.start();

  audio.ctx = ctx;
  audio.master = master;
  audio.noise = noiseBuf;
}

function burst({ freq = 120, gain = 0.2, duration = 0.18, type = 'lowpass', q = 1 }) {
  const ctx = audio.ctx;
  if (!ctx) return;
  const src = ctx.createBufferSource();
  src.buffer = audio.noise;
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  filter.Q.value = q;
  const g = ctx.createGain();
  const t = ctx.currentTime;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  src.connect(filter).connect(g).connect(audio.master);
  src.start(t);
  src.stop(t + duration + 0.02);
}

function thump({ freq = 180, gain = 0.3 }) {
  burst({ freq, gain, duration: 0.16 });
}

function heartbeat(strength) {
  thump({ freq: 92, gain: 0.13 + strength * 0.2 });
  setTimeout(() => thump({ freq: 76, gain: 0.09 + strength * 0.14 }), 165);
}

/* ------------------------------- управление ------------------------------- */

const ui = {
  hud: document.getElementById('hud'),
  start: document.getElementById('start'),
  startBtn: document.getElementById('startBtn'),
  glState: document.getElementById('glState'),
  state: document.getElementById('imState'),
  dist: document.getElementById('imDist'),
  me: document.getElementById('imMe'),
  arrow: document.getElementById('compassArrow'),
  compassDist: document.getElementById('compassDist'),
  threat: document.getElementById('threat'),
  hint: document.getElementById('hint'),
  toast: document.getElementById('toast'),
};

let toastTimer = 0;
function toast(text, ms = 2400) {
  if (!started) return;
  ui.toast.textContent = text;
  ui.toast.classList.remove('hidden');
  requestAnimationFrame(() => ui.toast.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    ui.toast.classList.remove('show');
    setTimeout(() => ui.toast.classList.add('hidden'), 250);
  }, ms);
}

addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  if (['w', 'a', 's', 'd', 'shift', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) e.preventDefault();
  keys.add(k);
});
addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
addEventListener('blur', () => keys.clear());

let dragLook = false; // fallback, если iframe не даёт захватить курсор
let dragging = false;

canvas.addEventListener('mousedown', () => {
  dragging = true;
});
addEventListener('mouseup', () => {
  dragging = false;
});

addEventListener('mousemove', (e) => {
  if (!locked && !(dragLook && dragging)) return;
  player.yaw -= e.movementX * CFG.lookSpeed;
  player.pitch = clamp(player.pitch - e.movementY * CFG.lookSpeed, -1.25, 1.05);
});

addEventListener('mousedown', () => {
  if (!started || locked) return;
  try {
    canvas.requestPointerLock?.();
  } catch {}
});

document.addEventListener('pointerlockchange', () => {
  locked = document.pointerLockElement === canvas;
  if (!started) return;
  if (locked) ui.hint?.classList.add('hidden');
  else ui.hint?.classList.remove('hidden');
});

{
  const note = document.getElementById('glNote');
  if (note) {
    note.textContent = gl.ok ? `3D: ${gl.version} ✓ · ${gl.name}` : '3D: WebGL недоступен в этом окне — открой в новой вкладке';
    note.className = gl.ok ? 'gl-note' : 'gl-note bad';
  }
}
{
  const el = ui.glState;
  if (el) {
    el.textContent = gl.ok ? `${gl.version} ✓` : 'НЕДОСТУПЕН';
    el.className = gl.ok ? 'good' : 'bad';
    el.title = gl.name;
  }
}

ui.startBtn.addEventListener('click', async () => {
  ui.start.classList.add('hidden');
  ui.hud.classList.remove('hidden');
  started = true;
  initAudio();
  try {
    await audio.ctx?.resume();
  } catch {}
  if (!michael.ready) toast('Модель ещё грузится…', 1800);
  try {
    canvas.requestPointerLock?.();
  } catch {}
  // не получилось захватить курсор (iframe без allow="pointer-lock") — даём обзор мышью
  setTimeout(() => {
    if (locked || dragLook) return;
    dragLook = true;
    toast('Обзор: зажми левую кнопку мыши и веди', 3600);
    ui.hint.textContent = 'WASD — идти · Shift — бежать · зажми ЛКМ и веди — обзор';
    ui.hint.classList.remove('hidden');
  }, 600);
});

/* ------------------------------- движение -------------------------------- */

const tmpDir = new THREE.Vector3();

function movePlayer(dt) {
  const forward = (keys.has('w') || keys.has('arrowup') ? 1 : 0) - (keys.has('s') || keys.has('arrowdown') ? 1 : 0);
  const strafe = (keys.has('d') || keys.has('arrowright') ? 1 : 0) - (keys.has('a') || keys.has('arrowleft') ? 1 : 0);
  const running = keys.has('shift');

  // вперёд — туда, куда смотрит камера
  const sin = Math.sin(player.yaw);
  const cos = Math.cos(player.yaw);
  tmpDir.set(-sin * forward + cos * strafe, 0, -cos * forward - sin * strafe);
  const moving = tmpDir.lengthSq() > 0.0001;
  if (moving) tmpDir.normalize();

  const targetSpeed = moving ? (running ? CFG.runSpeed : CFG.walkSpeed) : 0;
  player.speed = damp(player.speed, targetSpeed, moving ? CFG.accel : CFG.accel * 1.6, dt);

  if (player.speed > 0.01 && moving) player.pos.addScaledVector(tmpDir, player.speed * dt);

  // столкновения: деревья/камни и границы леса
  for (const o of obstacles) {
    const dx = player.pos.x - o.x;
    const dz = player.pos.z - o.z;
    const min = o.r + CFG.playerRadius;
    const d2 = dx * dx + dz * dz;
    if (d2 < min * min && d2 > 1e-6) {
      const d = Math.sqrt(d2);
      player.pos.x = o.x + (dx / d) * min;
      player.pos.z = o.z + (dz / d) * min;
    }
  }
  const r = Math.hypot(player.pos.x, player.pos.z);
  if (r > CFG.arenaRadius) {
    player.pos.x *= CFG.arenaRadius / r;
    player.pos.z *= CFG.arenaRadius / r;
  }

  // шаги и покачивание головы
  player.stepPhase += player.speed * dt * 1.85;
  player.bob = Math.sin(player.stepPhase) * 0.032 * clamp(player.speed / CFG.walkSpeed, 0, 1.4);
  const stepIndex = Math.floor(player.stepPhase / Math.PI);
  if (stepIndex !== player.lastStep) {
    player.lastStep = stepIndex;
    if (player.speed > 0.5) burst({ freq: 230, gain: 0.05 + player.speed * 0.01, duration: 0.1 });
  }

  camera.position.set(player.pos.x, CFG.eyeHeight + player.bob, player.pos.z);
  camera.rotation.set(player.pitch, player.yaw, 0);
}

/* -------------------------------- Майкл AI -------------------------------- */

function updateMichael(dt) {
  if (!michael.ready) return;

  const agent = michael.agent;
  agent.clipSpeed = michael.clipSpeed; // скорость клипа walk на этой модели
  const { dist, nx, nz } = updateChase(agent, { x: player.pos.x, z: player.pos.z }, CHASE, dt);

  // упёрся в дерево — позиция агента корректируется, чтобы он не залезал в ствол
  for (const o of obstacles) {
    const dx = agent.x - o.x;
    const dz = agent.z - o.z;
    const min = o.r + 0.42;
    const d2 = dx * dx + dz * dz;
    if (d2 < min * min && d2 > 1e-6) {
      const d = Math.sqrt(d2);
      agent.x = o.x + (dx / d) * min;
      agent.z = o.z + (dz / d) * min;
    }
  }

  michael.pos.set(agent.x, 0, agent.z);
  michael.facing = agent.facing;
  michael.state = agent.state;
  michael.holder.position.copy(michael.pos);
  michael.holder.rotation.y = michael.facing;

  // вес = скорость: пока клип плавно набирает вес, он так же плавно ускоряется
  const weight = agent.walkWeight;
  if (michael.walk) {
    michael.walk.setEffectiveWeight(weight);
    michael.walk.setEffectiveTimeScale(Math.max(0.15, CHASE.hurry * weight));
  }
  if (michael.idle) michael.idle.setEffectiveWeight(1 - weight);
  michael.mixer.update(dt);

  // шаги: глухой стук по земле, тем громче, чем ближе
  const near = clamp(1 - dist / 22, 0, 1);
  if (weight > 0.25) {
    michael.footstepTimer += dt * weight;
    if (michael.footstepTimer > 0.36) {
      michael.footstepTimer -= 0.36;
      thump({ freq: 120 + near * 60, gain: 0.07 + near * 0.22 });
    }
  }

  return { dist, dir: new THREE.Vector3(nx, 0, nz) };
}

/* --------------------------------- HUD ----------------------------------- */

let beatTimer = 0;

function updateHud(dt, info) {
  if (!info) return;
  const { dist } = info;

  ui.state.textContent = michael.state === 'walk' ? 'идёт за тобой' : 'стоит и смотрит';
  ui.state.className = michael.state === 'walk' ? 'bad' : 'good';
  ui.dist.textContent = `${dist.toFixed(1)} м`;
  const running = keys.has('shift') && player.speed > 2.6;
  ui.me.textContent = player.speed < 0.15 ? 'стоишь' : running ? 'бежишь' : 'идёшь';

  // стрелка компаса: 0° — прямо по курсу
  const bearing = Math.atan2(michael.pos.x - player.pos.x, michael.pos.z - player.pos.z);
  let rel = bearing - (player.yaw + Math.PI);
  while (rel > Math.PI) rel -= Math.PI * 2;
  while (rel < -Math.PI) rel += Math.PI * 2;
  ui.arrow.style.transform = `rotate(${(-rel * 180) / Math.PI}deg)`;
  ui.compassDist.textContent = `${dist.toFixed(0)} м`;

  const threat = clamp(1 - (dist - 2.2) / 8, 0, 1);
  ui.threat.style.opacity = (threat * 0.5).toFixed(3);

  // сердце: чаще, когда он близко
  if (threat > 0.15) {
    beatTimer -= dt;
    if (beatTimer <= 0) {
      heartbeat(threat);
      beatTimer = 1.15 - threat * 0.6;
    }
  } else {
    beatTimer = 0;
  }
}

/* --------------------------------- цикл ---------------------------------- */

const clock = new THREE.Clock();

let fpsAccum = 0;
let fpsFrames = 0;
let frameNo = 0;

function animate() {
  const dt = Math.min(clock.getDelta(), 0.05);

  if (frameNo++ % 20 === 0) fitRenderer();

  fpsAccum += dt;
  fpsFrames++;
  if (fpsAccum > 0.5) {
    const fps = Math.round(fpsFrames / fpsAccum);
    diag.status(
      `${gl.version} · ${fps} fps · Майкл: ${michael.ready ? 'в сцене' : 'загружается…'} · ${started ? `дистанция ${michael.pos.distanceTo(player.pos).toFixed(1)} м` : '"ВОЙТИ"'}`,
    );
    fpsAccum = 0;
    fpsFrames = 0;
  }

  if (started) {
    movePlayer(dt);
    const info = updateMichael(dt);
    updateHud(dt, info);
    moon.target.position.copy(player.pos);
    moon.position.set(player.pos.x - 14, 26, player.pos.z - 10);
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

addEventListener('resize', () => fitRenderer());
new ResizeObserver(() => fitRenderer()).observe(canvas);

/* --------------------------------- старт --------------------------------- */

// обратная ссылка должна нести токен превью, иначе получим 403
{
  const back = document.querySelector('a.back');
  if (back && location.search) back.href += location.search;
}

// он появляется за спиной, в тумане
{
  const sx = player.pos.x + Math.sin(player.yaw + Math.PI) * CFG.spawnDistance;
  const sz = player.pos.z + Math.cos(player.yaw + Math.PI) * CFG.spawnDistance;
  const facing = Math.atan2(player.pos.x - sx, player.pos.z - sz);
  michael.pos.set(sx, 0, sz);
  michael.agent.x = sx;
  michael.agent.z = sz;
  michael.agent.facing = facing;
  michael.facing = facing;
  michael.holder.position.copy(michael.pos);
  michael.holder.rotation.y = facing;
}

camera.position.set(player.pos.x, CFG.eyeHeight, player.pos.z);
camera.rotation.set(player.pitch, player.yaw, 0);

loadMichael()
  .then(() => toast('Он уже здесь. Не оборачивайся.', 2600))
  .catch((err) => {
    console.error(err);
    toast('Не удалось загрузить assets/models/character.glb', 5000);
  });

animate();
