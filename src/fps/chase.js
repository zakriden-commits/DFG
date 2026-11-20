/**
 * Погоня Майкла — чистая логика без three.js, чтобы её можно было проверить в Node.
 *
 * Правила:
 *  - пока дистанция больше `resumeDistance` — идёт к цели;
 *  - подошёл на `stopDistance` — встаёт и смотрит;
 *  - скорость движения строго равна clipSpeed * walkWeight, где walkWeight —
 *    тот же вес, что у клипа walk. Поэтому стопы не скользят даже во время
 *    разгона/остановки.
 */

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const damp = (x, y, lambda, dt) => x + (y - x) * (1 - Math.exp(-lambda * dt));

export function makeAgent({ x = 0, z = 0, facing = 0, clipSpeed = 2 } = {}) {
  return {
    x,
    z,
    facing,
    clipSpeed,
    state: 'idle',
    walkWeight: 0,
    footstepTimer: 0,
    travelled: 0,
  };
}

export function updateChase(agent, target, cfg, dt) {
  const dx = target.x - agent.x;
  const dz = target.z - agent.z;
  const dist = Math.hypot(dx, dz) || 1e-6;
  const nx = dx / dist;
  const nz = dz / dist;

  const rate = cfg.approachRate ?? 5.5;
  const fullSpeed = agent.clipSpeed * (cfg.hurry ?? 1);
  // тормозной путь: вес ходьбы гаснет экспоненциально, за это время он ещё едет
  const braking = fullSpeed / rate;

  if (agent.state === 'idle' && dist > cfg.resumeDistance) agent.state = 'walk';
  else if (agent.state === 'walk' && dist <= cfg.stopDistance + braking) agent.state = 'idle';

  const wanted = agent.state === 'walk' ? 1 : 0;
  agent.walkWeight = damp(agent.walkWeight, wanted, rate, dt);
  if (agent.walkWeight < 0.001) agent.walkWeight = 0;

  // вес анимации = скорость: клип и перемещение синхронны
  const speed = fullSpeed * agent.walkWeight;
  const step = speed * dt;
  agent.x += nx * step;
  agent.z += nz * step;
  agent.travelled += step;

  // смотрит на цель всегда — и в движении, и когда стоит
  const targetFacing = Math.atan2(nx, nz);
  let diff = targetFacing - agent.facing;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  agent.facing += clamp(diff, -cfg.turnRate * dt, cfg.turnRate * dt);

  if (agent.walkWeight > 0.25) agent.footstepTimer += dt * agent.walkWeight;

  return { dist, speed, nx, nz };
}
