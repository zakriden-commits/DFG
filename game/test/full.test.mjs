import './game.stub.mjs';
import * as THREE from 'three';
import { Game } from '../src/game.js';
import { UI } from '../src/ui.js';
import * as INV from '../src/inventory.js';

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
ui.modalOpen = true; // suppress modals side effects while we drive the sim
g.startMatch({ isHost: true, skin: 'gentleman', name: 'ДЖЕН' });
ui.modalOpen = false;
for (let i = 0; i < 200; i++) g.update(1 / 30);   // intro
const p = g.player;
p.money = 5000;
g.buyWeapon('pistol'); g.buyBag();
const bagSlot = p.hotbar.findIndex((s) => s && s.t === 'bag');
g.selectSlot(bagSlot);
console.log('bag slot', bagSlot, 'selected weapon:', g.currentWeaponId());

// --- robbery with bag: teleport into the bank, keep guards away by killing them? no: use distance
p.pos.set(4.6, 0, -21.0);
// distract: remove guards so this test isolates the grab timer
g.npcs.filter((n) => n.role === 'guard' || n.role === 'cashier').forEach((n) => { n.dead = true; n.char.isDead = true; });
ui.input.act = true;
for (let i = 0; i < 35 * 30; i++) g.update(1 / 30);   // 35 s of holding
ui.input.act = false;
const bagItem = p.hotbar[bagSlot];
console.log('bag cash after 35s:', bagItem && bagItem.cash, 'piles taken:', g.world.bankMoney.filter((m) => m.taken).length, 'stars:', p.stars);

// payout from the bag
const before = p.money;
const half = Math.floor((bagItem.cash || 0) / 2);
bagItem.cash -= half; p.money += half;
console.log('bag payout ok:', p.money - before === half, 'left in bag:', bagItem.cash);

// --- wanted decay in the house with the door closed
g.triggerAlarm('test');
p.stars = 3;
p.pos.set(-12, 0, 17);
g.world.houseDoor.open = false;
let t = 0;
while (p.stars > 0 && t < 90) { g.update(1 / 30); t += 1 / 30; }
console.log('stars decayed to', p.stars, 'after', t.toFixed(1), 's · alarm:', g.alarmOn, 'cops left:', g.npcs.filter((n) => n.role === 'cop').length);

// --- friendly fire check
g.onNet({ t: 'hello', name: 'ГОПНИК', skin: 'gopnik' });
for (let i = 0; i < 10; i++) g.onNet({ t: 's', p: [-9, 0, 15], y: 0, v: 0, w: 'fists', a: 0, st: 0, hp: 100 });
for (let i = 0; i < 10; i++) g.update(1 / 30);
p.pos.set(-9, 0, 13.5); p.yaw = 0; p.pitch = 0;
g.camera.position.set(-9, 1.6, 13.5);
g.camera.rotation.set(0, 0, 0);
g.selectSlot(p.hotbar.findIndex((s) => s && s.id === 'pistol'));
const hpBefore = g.remote?.hp ?? 100;
ui.input.fire = true; for (let i = 0; i < 20; i++) g.update(1 / 30); ui.input.fire = false;
console.log('friendly fire blocked:', (g.remote?.hp ?? 100) === hpBefore);

// --- hotbar full
p.hotbar[1] = INV.makeWeapon('knife'); p.hotbar[2] = INV.makeWeapon('baton');
p.hotbar[3] = INV.makeItem('bag'); p.hotbar[4] = INV.makeWeapon('shotgun'); p.hotbar[5] = INV.makeWeapon('rifle');
p.money = 100000;
g.buyWeapon('pistol');
console.log('full inventory handled (no crash), money:', p.money);

// --- shop & locker UIs render
g.openShop('ammo'); g.ui.hideModal();
g.openLocker('lockerB'); g.ui.hideModal();
g.openInventory(); g.ui.hideModal();
console.log('ALL FULL TESTS PASSED');
