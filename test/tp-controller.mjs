import { makeAvatar, stepAvatar, inputDir, angleDelta, DEFAULTS } from '../src/game/controller.js';

/**
 * Проверка третьего лица: клавиши ведут туда, куда смотрит камера, скорость
 * выходит ровно на walkSpeed / runSpeed, клип масштабируется под скорость
 * (стопы не скользят), а корпус доворачивается плавно.
 */

const dt = 1 / 60;
const none = { forward: false, back: false, left: false, right: false, run: false };
const rows = [];

function hold(input, seconds, camYaw = 0, avatar = makeAvatar()) {
  let maxStepMiss = 0;
  let maxTurnStep = 0;
  const slowest = DEFAULTS.minTimeScale * DEFAULTS.clipSpeed; // ниже — timeScale упирается в предел
  for (let t = 0; t < seconds; t += dt) {
    const before = { ...avatar, x: avatar.x, z: avatar.z };
    stepAvatar(avatar, input, camYaw, dt);
    // клип должен идти ровно со скоростью шага (вне предела медленного шага)
    if (avatar.speed > slowest) {
      maxStepMiss = Math.max(maxStepMiss, Math.abs(avatar.speed - avatar.timeScale * DEFAULTS.clipSpeed));
    }
    maxTurnStep = Math.max(maxTurnStep, Math.abs(angleDelta(before.facing, avatar.facing)));
  }
  return { avatar, maxStepMiss, maxTurnStep };
}

// 1. W ведёт вперёд (при yaw 0 — в −Z), спиной к камере
{
  const { avatar } = hold({ ...none, forward: true }, 1.5);
  const ok = avatar.z < -1.5 && Math.abs(avatar.x) < 0.01 &&
    Math.abs(angleDelta(avatar.facing, Math.PI)) < 0.02 && avatar.state === 'walk';
  rows.push(['W → вперёд от камеры', ok, `z=${avatar.z.toFixed(2)} м, facing=${avatar.facing.toFixed(2)}, ${avatar.state}`]);
}

// 2. D ведёт вправо (при yaw 0 — в +X), корпус развернулся
{
  const { avatar } = hold({ ...none, right: true }, 1.5);
  const ok = avatar.x > 1.5 && Math.abs(avatar.z) < 0.05 && Math.abs(angleDelta(avatar.facing, Math.PI / 2)) < 0.02;
  rows.push(['D → вправо', ok, `x=${avatar.x.toFixed(2)} м, facing=${avatar.facing.toFixed(2)}`]);
}

// 3. камера повёрнута на 90° — W всё равно «от камеры»
{
  const { avatar } = hold({ ...none, forward: true }, 1.5, Math.PI / 2);
  const ok = avatar.x < -1.5 && Math.abs(avatar.z) < 0.05;
  rows.push(['W при повёрнутой камере', ok, `x=${avatar.x.toFixed(2)}, z=${avatar.z.toFixed(2)}`]);
}

// 4. скорость выходит ровно на скорость клипа, ноги не скользят
{
  const { avatar, maxStepMiss } = hold({ ...none, forward: true }, 3);
  const ok = Math.abs(avatar.speed - DEFAULTS.walkSpeed) < 0.01 && maxStepMiss < 0.02;
  rows.push(['скорость = клип', ok, `${avatar.speed.toFixed(3)} м/с, расхождение ≤ ${maxStepMiss.toFixed(4)}`]);
}

// 5. Shift быстрее, но в пределах timeScale клипа
{
  const { avatar } = hold({ ...none, forward: true, run: true }, 3);
  const ok = Math.abs(avatar.speed - DEFAULTS.runSpeed) < 0.01 &&
    avatar.timeScale <= DEFAULTS.maxTimeScale + 1e-9 && avatar.timeScale > 1.4;
  rows.push(['Shift → быстрее', ok, `${avatar.speed.toFixed(2)} м/с, timeScale ${avatar.timeScale.toFixed(2)}, ${avatar.state}`]);
}

// 6. диагональ не быстрее прямой
{
  const diag = hold({ ...none, forward: true, right: true }, 3).avatar.speed;
  const straight = hold({ ...none, forward: true }, 3).avatar.speed;
  const dir = inputDir({ forward: true, right: true }, 0);
  const ok = Math.abs(diag - straight) < 0.01 && Math.abs(Math.hypot(dir.x, dir.z) - 1) < 1e-9;
  rows.push(['диагональ не ускоряет', ok, `${diag.toFixed(3)} vs ${straight.toFixed(3)} м/с`]);
}

// 7. отпустил клавиши — встал, вес клипа ушёл в 0
{
  const avatar = hold({ ...none, forward: true }, 2).avatar;
  const movedFrom = { x: avatar.x, z: avatar.z };
  for (let t = 0; t < 3; t += dt) stepAvatar(avatar, none, 0, dt);
  const stopDist = Math.hypot(avatar.x - movedFrom.x, avatar.z - movedFrom.z);
  const ok = avatar.speed === 0 && avatar.state === 'idle' && avatar.walkWeight < 0.01 && stopDist < 0.3;
  rows.push(['отпустил → встал', ok, `выбег ${stopDist.toFixed(2)} м, вес ${avatar.walkWeight.toFixed(3)}, ${avatar.state}`]);
}

// 8. корпус не телепортируется: за кадр не больше turnRate·dt
{
  const { maxTurnStep } = hold({ ...none, back: true }, 2); // разворот на 180°
  const limit = DEFAULTS.turnRate * dt + 1e-9;
  rows.push(['поворот плавный', maxTurnStep <= limit, `${((maxTurnStep * 180) / Math.PI).toFixed(1)}° за кадр ≤ ${((limit * 180) / Math.PI).toFixed(1)}°`]);
}

// 9. большой лаг кадра не выстреливает персонажа вперёд
{
  const avatar = makeAvatar();
  stepAvatar(avatar, { ...none, forward: true }, 0, 5);
  const ok = Math.hypot(avatar.x, avatar.z) < 0.5;
  rows.push(['лаг кадра не ускоряет', ok, `за кадр 5 с сдвиг ${Math.hypot(avatar.x, avatar.z).toFixed(2)} м`]);
}

let bad = 0;
for (const [name, ok, extra] of rows) {
  if (!ok) bad++;
  console.log(`${ok ? '✓' : '✗'} ${name.padEnd(26)} ${extra}`);
}
console.log(bad === 0 ? 'CONTROLLER OK' : `CONTROLLER FAIL (${bad})`);
process.exit(bad === 0 ? 0 : 1);
