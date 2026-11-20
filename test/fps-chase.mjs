import { makeAgent, updateChase } from '../src/fps/chase.js';

/** Проверка поведения погони: идёт → встал на 3 м → снова идёт, если отойти. */
const CFG = { stopDistance: 3.2, resumeDistance: 4.8, turnRate: 2.4, approachRate: 5.5, hurry: 1.12 };
const dt = 1 / 60;

function run({ seconds, playerAt }) {
  const agent = makeAgent({ x: 0, z: 16, facing: Math.PI, clipSpeed: 2.05 });
  const player = { get x() { return playerAt().x; }, get z() { return playerAt().z; } };
  let maxSpeedError = 0;
  let frames = 0;
  for (let t = 0; t < seconds; t += dt) {
    const before = { x: agent.x, z: agent.z };
    const { dist } = updateChase(agent, { x: player.x, z: player.z }, CFG, dt);
    const moved = Math.hypot(agent.x - before.x, agent.z - before.z) / dt;
    maxSpeedError = Math.max(maxSpeedError, Math.abs(moved - agent.clipSpeed * CFG.hurry * agent.walkWeight));
    frames++;
    if (dist <= CFG.stopDistance + 1e-6) {
      // он не должен продолжать идти сквозь игрока
    }
  }
  return { agent, dist: Math.hypot(player.x - agent.x, player.z - agent.z), maxSpeedError, frames };
}

const result = [];

// 1. игрок стоит: Майкл подходит и останавливается
const stand = run({ seconds: 20, playerAt: () => ({ x: 0, z: 0 }) });
result.push(['подошёл и встал', stand.dist > 2.9 && stand.dist < 3.6 && stand.agent.state === 'idle', `дистанция ${stand.dist.toFixed(2)} м`]);

// 2. после остановки он больше не двигается
const frozen = (() => {
  const agent = stand.agent;
  const start = { x: agent.x, z: agent.z };
  for (let i = 0; i < 600; i++) updateChase(agent, { x: 0, z: 0 }, CFG, dt);
  const moved = Math.hypot(agent.x - start.x, agent.z - start.z);
  return { moved, state: agent.state, weight: agent.walkWeight };
})();
result.push(['стоит на месте', frozen.moved < 0.01 && frozen.state === 'idle' && frozen.weight === 0, `сдвиг ${frozen.moved.toFixed(3)} м, вес ${frozen.weight}`]);

// 3. игрок отошёл на 6 м — Майкл снова пошёл
const resume = (() => {
  const agent = makeAgent({ x: 0, z: 3.2, facing: 0, clipSpeed: 2.05 });
  const start = { x: agent.x, z: agent.z };
  for (let i = 0; i < 60; i++) updateChase(agent, { x: 0, z: 9.2 }, CFG, dt); // игрок в 6 м
  return { moved: Math.hypot(agent.x - start.x, agent.z - start.z), state: agent.state };
})();
result.push(['снова пошёл', resume.moved > 0.6 && resume.state === 'walk', `прошёл ${resume.moved.toFixed(2)} м`]);

// 4. скорость движения всегда равна скорости клипа — стопы не скользят
result.push(['нет проскальзывания', stand.maxSpeedError < 0.02, `макс. расхождение ${stand.maxSpeedError.toFixed(4)} м/с`]);

// 5. бегущий игрок уходит, идущий — нет
function escapeSpeed(playerSpeed) {
  const agent = makeAgent({ x: 0, z: 12, facing: Math.PI, clipSpeed: 2.05 });
  let pz = 0;
  for (let t = 0; t < 12; t += dt) {
    pz -= playerSpeed * dt;
    updateChase(agent, { x: 0, z: pz }, CFG, dt);
  }
  return Math.hypot(pz - agent.z, agent.x);
}
const walkAway = escapeSpeed(1.75);
const runAway = escapeSpeed(4.6);
result.push(['шагом он догоняет', walkAway < 9, `дистанция ${walkAway.toFixed(1)} м (было 12)`]);
result.push(['бегом можно', runAway > 20, `дистанция ${runAway.toFixed(1)} м`]);

let ok = true;
for (const [name, pass, detail] of result) {
  if (!pass) ok = false;
  console.log(`${pass ? '✓' : '✗'} ${name.padEnd(20)} ${detail}`);
}
console.log(ok ? 'CHASE OK' : 'CHASE FAIL');
process.exitCode = ok ? 0 : 1;
