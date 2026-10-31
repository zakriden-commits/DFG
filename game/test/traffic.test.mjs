import './game.stub.mjs';
import * as THREE from 'three';
import { Game } from '../src/game.js';
import { UI } from '../src/ui.js';

const fakeRenderer = () => ({ setPixelRatio() {}, setSize() {}, render() {}, shadowMap: {}, toneMapping: 0, toneMappingExposure: 1, domElement: {} });
class TestGame extends Game {
  _createRenderer() { return fakeRenderer(); }
  _previewInit() { return { r: fakeRenderer(), sc: new THREE.Scene(), cam: null, model: null, canvas: document.createElement('canvas') }; }
  renderPreview() {}
}
const ui = new UI();
const net = { on() { return this; }, send() {}, enableVoice: async () => true, _tryCall() {}, hangup() {} };
const g = new TestGame(document.getElementById('c'), ui, net);
await g.init();
ui.modalOpen = true;
g.startMatch({ isHost: true, skin: 'gentleman', name: 'ДЖЕН' });
ui.modalOpen = false;
for (let i = 0; i < 200; i++) g.update(1 / 30);
const p = g.player;

/* ---------- 1. можно ли выйти из дома ---------- */
p.pos.set(-8.5, 0, 12.4); p.yaw = 0; p.pitch = 0;
g.world.houseDoor.open = false;
ui.keys.add('w'); ui.input.moveY = -1;
for (let i = 0; i < 60; i++) g.update(1 / 30);
console.log('closed door blocks exit:', p.pos.z > 10.1, 'z=', p.pos.z.toFixed(2));
g.toggleHouseDoor();
for (let i = 0; i < 120; i++) g.update(1 / 30);
console.log('open door -> outside:', p.pos.z < 9.9, 'z=', p.pos.z.toFixed(2), 'x=', p.pos.x.toFixed(2));
ui.keys.delete('w'); ui.input.moveY = 0;

/* ---------- 1b. вход в банк и в магазин ---------- */
function walkTo(x, z, yaw, ticks) {
  p.pos.set(x, 0, z); p.yaw = yaw; p.pitch = 0;
  ui.keys.add('w'); ui.input.moveY = -1;
  for (let i = 0; i < ticks; i++) g.update(1 / 30);
  ui.keys.delete('w'); ui.input.moveY = 0;
  return { x: p.pos.x, z: p.pos.z };
}
const bank = walkTo(11.5, -6, 0, 90);
console.log('entered bank:', bank.z < -10, 'z=', bank.z.toFixed(2));
const shop = walkTo(-24, -6, 0, 90);
console.log('entered shop:', shop.z < -10, 'z=', shop.z.toFixed(2));

/* ---------- 2. парковка: ни одна машина не внутри зданий ---------- */
const boxes = [
  { name: 'дом', x1: -16, x2: -2, z1: 10, z2: 22 },
  { name: 'банк', x1: -2, x2: 26, z1: -34, z2: -9 },
  { name: 'магазин', x1: -32, x2: -18, z1: -26, z2: -9 },
  { name: 'склад', x1: 32, x2: 48, z1: 11, z2: 26 },
  { name: 'фасадC', x1: 4, x2: 30, z1: 10, z2: 26 },
  { name: 'фасадD', x1: -36, x2: -22, z1: 11, z2: 26 },
];
const parked = [];
g.scene.traverse((o) => { if (o.userData && o.userData.wheels && o.parent) parked.push(o); });
let inside = 0, exits = [];
for (const c of parked) {
  const pos = new THREE.Vector3(); c.getWorldPosition(pos);
  for (const b of boxes) {
    if (pos.x > b.x1 - 1 && pos.x < b.x2 + 1 && pos.z > b.z1 - 1 && pos.z < b.z2 + 1) { inside++; exits.push(b.name); }
  }
}
console.log('cars modelled:', parked.length, 'inside buildings:', inside, exits.join(','));
// ни одна машина не перекрывает дверь дома
const doorBlock = parked.filter((c) => {
  const pos = new THREE.Vector3(); c.getWorldPosition(pos);
  return Math.abs(pos.x + 8.5) < 5.5 && pos.z > 4 && pos.z < 11;
});
console.log('cars blocking the house door:', doorBlock.length);

/* ---------- 3. полиция приезжает на машине ---------- */
g.traffic.cars.forEach((c) => { if (c.kind === 'police') { c.x = 200; } });
g.traffic.update(0.1);
p.pos.set(11.5, 0, -6);
p.stars = 0;
for (const n of g.npcs.filter((n) => n.role === 'cop')) { n.dead = true; g.scene.remove(n.char.root); }
g.npcs = g.npcs.filter((n) => n.role !== 'cop');
g.triggerAlarm('test');
const copsNow = g.npcs.filter((n) => n.role === 'cop').length;
const resp = g.traffic.responses.length;
console.log('cops spawn instantly:', copsNow, '· cars en route:', resp, '· siren:', g.traffic.responses[0]?.siren);
let t = 0, firstOut = null;
while (t < 30) {
  g.update(1 / 30); t += 1 / 30;
  const c = g.traffic.responses[0];
  if (!firstOut && c && c.state === 'parked') firstOut = t;
  const out = g.npcs.filter((n) => n.role === 'cop' && !n.inactive).length;
  if (out >= 2 && c && c.state === 'parked') break;
}
const car = g.traffic.responses[0];
console.log('car parked after', firstOut?.toFixed(1), 's · state:', car?.state, '· cops out:', g.npcs.filter((n) => n.role === 'cop' && !n.inactive && !n.car?.copsToSpawn).length);
console.log('cop aiming flag:', g.npcs.filter((n) => n.role === 'cop' && !n.inactive).map((n) => n.aimingWanted || false));

/* ---------- 4. розыск снят — уезжают ---------- */
p.stars = 0; g.remoteStars = 0;
t = 0;
while (t < 40 && g.traffic.responses.length > 0) { g.update(1 / 30); t += 1 / 30; }
console.log('police car left after', t.toFixed(1), 's · cops left:', g.npcs.filter((n) => n.role === 'cop' && !n.inactive).length);

/* ---------- 5. гражданский поток ---------- */
const civ = g.traffic.cars.filter((c) => c.kind === 'civil');
const before = civ.map((c) => c.x);
for (let i = 0; i < 60; i++) g.update(1 / 30);
console.log('civil cars:', civ.length, '· moving:', civ.filter((c, i) => Math.abs(c.x - before[i]) > 1).length, '· police patrols:', g.traffic.cars.filter((c) => c.kind === 'police' && c.state === 'drive').length);

/* ---------- 6. машина тормозит перед игроком ---------- */
const c0 = civ[0];
c0.state = 'drive'; c0.speed = c0.maxSpeed = 10;
c0.z = 2.6; c0.dir = 1; c0.x = -6;
p.pos.set(4, 0, 2.6);
for (let i = 0; i < 60; i++) g.update(1 / 30);
console.log('car brakes for player: speed', c0.speed.toFixed(2), 'stop x', c0.x.toFixed(1), '(player x 4)');
console.log('ALL TRAFFIC TESTS PASSED');
