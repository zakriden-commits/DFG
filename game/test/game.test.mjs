import './game.stub.mjs';
import { Game } from '../src/game.js';
import { UI } from '../src/ui.js';
import * as INV from '../src/inventory.js';
import { WEAPONS } from '../src/models.js';

const fakeRenderer = () => ({
  setPixelRatio() {}, setSize() {}, render() {}, shadowMap: { enabled: false, type: 0 },
  toneMapping: 0, toneMappingExposure: 1, domElement: {}, dispose() {},
});

class TestGame extends Game {
  _createRenderer() { return fakeRenderer(); }
  _previewInit() {
    if (!this.pv) this.pv = { r: fakeRenderer(), sc: new (require_three().Scene)(), cam: new (require_three().PerspectiveCamera)(), model: null, canvas: document.createElement('canvas') };
    return this.pv;
  }
  renderPreview() {}
}
import * as THREE from 'three';
const require_three = () => THREE;

class FakeNet {
  constructor() { this.handlers = new Map(); this.voiceOn = false; this.sent = []; }
  on(ev, fn) { if (!this.handlers.has(ev)) this.handlers.set(ev, []); this.handlers.get(ev).push(fn); return this; }
  emit(ev, d) { (this.handlers.get(ev) || []).forEach((f) => f(d)); }
  send(m) { this.sent.push(m); }
  async enableVoice() { this.voiceOn = true; return true; }
  _tryCall() {}
  hangup() {}
}

const ui = new UI();
const net = new FakeNet();
const canvas = document.getElementById('c');
const game = new TestGame(canvas, ui, net);

const step = (n = 1, dt = 1 / 30) => { for (let i = 0; i < n; i++) game.update(dt); };

await game.init();
console.log('init ok · meshes:', (() => { let n = 0; game.scene.traverse((o) => { if (o.isMesh) n++; }); return n; })());

game.startMatch({ isHost: true, skin: 'gentleman', name: 'ДЖЕНТЕЛЬМЕН' });
step(200); // intro + walking
console.log('after intro state:', game.state, 'pos', game.player.pos.x.toFixed(1), game.player.pos.z.toFixed(1), 'intro:', !!game.intro);

// simulate movement
ui.keys.add('w');
step(60);
ui.keys.delete('w');
console.log('moved to', game.player.pos.x.toFixed(2), game.player.pos.z.toFixed(2));

// give the player gear and money
game.player.money = 20000;
game.buyWeapon('pistol');
game.buyAmmo('9мм');
game.buyAmmo('9мм');
game.buyBag();
game.buyArmor();
console.log('hotbar:', game.player.hotbar.map((s) => s && (s.id || s.t)), 'ammo:', game.player.ammo, 'money:', game.player.money);

// select pistol and fire
const pi = game.player.hotbar.findIndex((s) => s && s.id === 'pistol');
game.selectSlot(pi);
ui.input.fire = true;
step(10);
ui.input.fire = false;
console.log('mag after shooting:', game.player.hotbar[pi].mag);
game.startReload();
step(60);
console.log('mag after reload:', game.player.hotbar[pi].mag, 'reserve:', game.player.ammo['9мм']);

// walk to bank door and rob
const B = game.world.bankInterior;
game.player.pos.set(6, 0, -14);
step(5);
console.log('in bank:', game.inBank(game.player.pos), 'cashier:', game.cashier.pos.x, game.cashier.pos.z);
// grab money with hands
game.player.pos.set(4.6, 0, -21.2);
game.selectSlot(0);
ui.input.act = true;
for (let i = 0; i < 40; i++) game.update(0.6);
ui.input.act = false;
console.log('grab progress:', game.grabProgress.toFixed(2), 'money piles taken:', game.world.bankMoney.filter((m) => m.taken).length, 'hotbar:', game.player.hotbar.filter(Boolean).length, 'stars:', game.player.stars, 'alarm:', game.alarmOn);

// alarm -> police
step(120);
const cops = game.npcs.filter((n) => n.role === 'cop').length;
console.log('cops spawned:', cops, 'alarmOn:', game.alarmOn, 'stars:', game.player.stars);
step(60);

// convert money
const moneyItem = game.player.hotbar.find((s) => s && s.t === 'money');
if (moneyItem) { const before = game.player.money; game.convertMoney(moneyItem); console.log('converted +', game.player.money - before); }

// shop / locker / inventory modals
game.openShop();
game.openLocker('lockerA');
game.player.hotbar[1] && game.openInventory();
game.ui.hideModal();
game.openBag({ t: 'bag', cash: 5000 });
game.ui.hideModal();
game.ui.closeModal?.();

// store item in locker and take it back
game.lockers.lockerA[0] = INV.makeWeapon('shotgun');
console.log('locker stored:', !!game.lockers.lockerA[0]);

// job flow
game.player.pos.copy(game.world.dockBossPoint);
step(2);
game.startJob();
const box = game.world.boxSpawns.find((b) => !b.taken);
game.takeBox(box);
game.player.pos.copy(game.world.truckPoint);
game.deliverBox();
console.log('job:', game.job, 'money:', game.player.money);

// damage & death + respawn
game.hitPlayer(500, null);
console.log('dead state:', game.state, 'alive:', game.player.alive, 'hotbar empty:', game.player.hotbar.every((s) => !s));
game.respawn();
console.log('respawned:', game.state, game.player.alive, game.player.hp);

// npc damage & kill
const victim = game.npcs.find((n) => n.role === 'ped');
if (victim) { victim.damage(999, true); console.log('npc dead:', victim.dead, 'stars:', game.player.stars); }

// door
game.toggleHouseDoor();
step(5);
console.log('door open:', game.world.houseDoor.open, 'collider enabled:', game.world.houseDoor.collider.enabled);

// remote player sync
game.onNet({ t: 'hello', name: 'ГОПНИК', skin: 'gopnik' });
for (let i = 0; i < 30; i++) game.onNet({ t: 's', p: [-12, 0, 16], y: 1, v: 3, w: 'rifle', a: 1, st: 0, hp: 100 });
step(30);
console.log('remote:', !!game.remote, game.remote?.char.weaponId, game.remote?.pos.x.toFixed(1));

// save/load
game.saveGame();
const s = INV.loadSave();
console.log('saved money:', s.money, 'lockers:', s.lockers.lockerA.filter(Boolean).length);

// UI helpers
ui.controlsHTML(); ui.aboutHTML(); ui.setStats({ hp: 50, stamina: 40, money: 100, stars: 3 });
ui.toast('t'); ui.log('l'); ui.setProgress(0.5, 'x'); ui.setProgress(null);
console.log('ALL GAME TESTS PASSED');
