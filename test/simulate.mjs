import * as THREE from 'three';
import { TrackPath, HALF_WIDTH } from '../src/trackMath.js';
import { Hovercraft } from '../src/hovercraft.js';

// --- Проверка геометрии трассы ---
const track = new TrackPath();
console.log('Длина трассы:', track.length.toFixed(1), 'м');
console.log('Ширина:', (HALF_WIDTH * 2).toFixed(1), 'м');

let minRadius = Infinity;
let minRadiusAt = 0;
let maxGrade = 0;
for (let i = 0; i < track.n; i++) {
  const a = track.tan[i];
  const b = track.tan[(i + 1) % track.n];
  const ds = track.length / track.n;
  const angle = Math.acos(THREE.MathUtils.clamp(a.dot(b), -1, 1));
  const radius = angle > 1e-6 ? ds / angle : Infinity;
  if (radius < minRadius) {
    minRadius = radius;
    minRadiusAt = i;
  }
  maxGrade = Math.max(maxGrade, Math.abs(a.y));
}
console.log('Мин. радиус поворота:', minRadius.toFixed(1), 'м (индекс', minRadiusAt + ')');
console.log('Макс. уклон (sin):', maxGrade.toFixed(3));

// Самопересечения: минимальная дистанция между далёкими по индексу точками
let minSelf = Infinity;
let selfPair = null;
const gap = 80;
for (let i = 0; i < track.n; i += 4) {
  for (let j = i + gap; j < track.n; j += 4) {
    if (track.n - (j - i) < gap) continue;
    const d = track.pos[i].distanceTo(track.pos[j]);
    if (d < minSelf) {
      minSelf = d;
      selfPair = [i, j];
    }
  }
}
console.log('Мин. дистанция между удалёнными участками:', minSelf.toFixed(2), 'м', selfPair);

const start = track.startTransform();
console.log('Старт:', start.position.toArray().map((v) => v.toFixed(2)).join(', '), 'yaw', start.yaw.toFixed(3));

// --- Бот: проверяем, что трассу реально можно проехать ---
const bot = new Hovercraft();
bot.reset(start.position, start.yaw, 0);

const input = { steer: 0, throttle: 1, brake: 0, boost: false };
const dt = 1 / 120;
let progress = 0;
let prevIndex = 0;
let laps = 0;
let time = 0;
let respawns = 0;
let maxSpeedSeen = 0;
const lapTimes = [];
let lapStart = 0;
let fell = 0;

const subSteps = Math.round((1 / 60) / dt);
for (let frame = 0; frame < 60 * 400 && laps < 3; frame++) {
  for (let s = 0; s < subSteps; s++) {
    const hit = track.nearest(bot.pos, bot.hint);
    // цель — точка трассы впереди
    const lookAhead = Math.round((32 + bot.speed * 0.8) / (track.length / track.n));
    const ti = (hit.index + lookAhead) % track.n;
    const target = track.pos[ti];
    const dx = target.x - bot.pos.x;
    const dz = target.z - bot.pos.z;
    const desiredYaw = Math.atan2(dx, dz);
    let diff = desiredYaw - bot.yaw;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    input.steer = THREE.MathUtils.clamp(diff * 2.2, -1, 1);
    input.throttle = 1;
    input.brake = 0;
    input.boost = bot.energy > 55 && Math.abs(diff) < 0.15;

    // страховка как в игре
    const onRoad = Math.abs(hit.lateral) <= HALF_WIDTH + 1.5;
    if (!onRoad) {
      const ri = (hit.index + 40) % track.n;
      const p = track.pos[ri];
      const t = track.tan[ri];
      bot.reset(p.clone().addScaledVector(track.up[ri], 2), Math.atan2(t.x, t.z), ri);
      respawns++;
      fell++;
      continue;
    }

    bot.update(dt, input, track);
    maxSpeedSeen = Math.max(maxSpeedSeen, bot.speed);
    time += dt;

    const d = track.deltaIndex(bot.sampleIndex, prevIndex);
    if (Math.abs(d) <= 14) progress += d;
    prevIndex = bot.sampleIndex;

    if (bot.fellOut) {
      bot.fellOut = false;
      respawns++;
    }

    if (progress >= track.n * (laps + 1)) {
      laps++;
      lapTimes.push((time - lapStart).toFixed(2));
      lapStart = time;
      if (laps >= 3) break;
    }
  }
}

console.log('--- Бот ---');
console.log('Круги:', laps, 'время:', time.toFixed(2), 'с');
console.log('Круги по отдельности:', lapTimes.join(' / '));
console.log('Макс. скорость:', (maxSpeedSeen * 3.6).toFixed(0), 'км/ч');
console.log('Респавны:', respawns);
console.log('progress', progress.toFixed(1), 'из', track.n * 3);
if (laps < 3) {
  console.log('ПРОВАЛ: бот не завершил 3 круга');
  process.exit(1);
}
