/**
 * Ходьба от третьего лица — чистая логика: ни three, ни DOM.
 *
 * Всё, что здесь считается, потом просто накладывается на объекты сцены
 * (см. src/game/main.js), а проверить это можно в Node — test/tp-controller.mjs.
 *
 * Соглашение по осям такое же, как в остальном проекте:
 *   yaw = 0 → камера смотрит в −Z;  вперёд = (−sin yaw, −cos yaw).
 * Поворот модели: rotation.y = atan2(dirX, dirZ).
 */

export const DEFAULTS = Object.freeze({
  walkSpeed: 1.99, // ровно скорость, запечённая в клип walk
  runSpeed: 3.6, // Shift: шаг чаще, но всё ещё шаг, а не бег
  accel: 8.5, // разгон, 1/с
  brake: 12, // торможение, 1/с
  turnRate: 11, // рад/с — корпус доворачивается плавно, но быстро
  clipSpeed: 1.99, // сколько метров в секунду «внутри» клипа при timeScale = 1
  minTimeScale: 0.55,
  maxTimeScale: 1.95,
  idleBelow: 0.12, // ниже этой скорости — стоим
});

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
/** кадронезависимое сглаживание */
export const damp = (cur, target, lambda, dt) => cur + (target - cur) * (1 - Math.exp(-lambda * dt));

/** кратчайшая разница углов: результат в (−π, π] */
export function angleDelta(from, to) {
  let d = (to - from) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d <= -Math.PI) d += Math.PI * 2;
  return d;
}

export function makeAvatar(opts = {}) {
  return {
    x: 0,
    z: 0,
    facing: Math.PI, // лицом от камеры, спиной к нам
    dirX: 0,
    dirZ: -1,
    speed: 0,
    walkWeight: 0,
    timeScale: 1,
    state: 'idle',
    travelled: 0,
    ...opts,
  };
}

/**
 * Ввод → единичный вектор в мире, относительно камеры.
 * Диагональ нормализуется: по двум клавишам скорость не растёт.
 */
export function inputDir(input, camYaw) {
  const f = (input.forward ? 1 : 0) - (input.back ? 1 : 0);
  const s = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const sin = Math.sin(camYaw);
  const cos = Math.cos(camYaw);
  let x = -sin * f + cos * s;
  let z = -cos * f - sin * s;
  const len = Math.hypot(x, z);
  if (len > 1e-6) {
    x /= len;
    z /= len;
  }
  return { x, z, moving: len > 1e-6 };
}

/**
 * Один шаг симуляции. Мутирует avatar и возвращает его же.
 * input: { forward, back, left, right, run }
 */
export function stepAvatar(avatar, input, camYaw, dt, cfg = DEFAULTS) {
  dt = Math.min(Math.max(dt, 0), 0.1); // после лага не улетаем в стену
  const { x, z, moving } = inputDir(input, camYaw);
  const maxSpeed = input.run ? cfg.runSpeed : cfg.walkSpeed;

  if (moving) {
    avatar.dirX = x;
    avatar.dirZ = z;
    // корпус доворачивается к направлению движения, но не мгновенно
    const want = Math.atan2(x, z);
    const d = angleDelta(avatar.facing, want);
    const step = cfg.turnRate * dt;
    avatar.facing += clamp(d, -step, step);
  }

  const target = moving ? maxSpeed : 0;
  avatar.speed = damp(avatar.speed, target, moving ? cfg.accel : cfg.brake, dt);
  if (!moving && avatar.speed < 0.02) avatar.speed = 0;

  if (avatar.speed > 0.005) {
    const moved = avatar.speed * dt;
    avatar.x += avatar.dirX * moved;
    avatar.z += avatar.dirZ * moved;
    avatar.travelled += moved;
  }

  // клип проигрывается со скоростью, равной скорости шага → стопы не скользят
  avatar.timeScale = clamp(avatar.speed / cfg.clipSpeed, cfg.minTimeScale, cfg.maxTimeScale);
  // вес клипа = доля скорости: разгон и торможение видны в анимации
  avatar.walkWeight = damp(avatar.walkWeight, clamp(avatar.speed / cfg.walkSpeed, 0, 1), 12, dt);
  avatar.state = avatar.speed < cfg.idleBelow ? 'idle' : avatar.speed > cfg.walkSpeed * 1.02 ? 'run' : 'walk';

  return avatar;
}
