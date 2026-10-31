/* Headless smoke test: builds the world, characters, NPC AI and inventory logic
   with a stubbed canvas so runtime errors surface without a browser. */
import * as THREE from 'three';
import { buildWorld } from '../src/world.js';
import { Character, buildWeapon, WEAPONS, buildCar, buildTree, buildLamp, buildCrate, buildMoneyPile } from '../src/models.js';
import { Colliders } from '../src/util.js';
import * as INV from '../src/inventory.js';

const scene = new THREE.Scene();
const colliders = new Colliders();
const t0 = Date.now();
const world = buildWorld(scene, colliders);
console.log('world built in', Date.now() - t0, 'ms · meshes:', (() => { let n = 0; scene.traverse((o) => { if (o.isMesh) n++; }); return n; })());
console.log('colliders:', colliders.list.length, '| bedSpots:', world.bedSpots.length, '| lockers:', world.lockers.length, '| bankMoney:', world.bankMoney.length);

for (const k of ['gentleman', 'gopnik', 'elderly', 'normal', 'thug', 'cashier', 'guard', 'cop', 'seller']) {
  const c = new Character(k);
  scene.add(c.root);
  for (const w of ['fists', 'pistol', 'shotgun', 'rifle', 'knife', 'baton', 'bag']) c.setWeapon(w);
  for (let i = 0; i < 40; i++) c.update(0.016, i < 20 ? 3 : 0, { aiming: i > 30 });
  c.lieDown(); for (let i = 0; i < 30; i++) c.update(0.016, 0);
  c.wakeUp(); for (let i = 0; i < 30; i++) c.update(0.016, 0);
  c.isDead = true; for (let i = 0; i < 20; i++) c.update(0.016, 0);
}
console.log('characters ok');

const props = [buildCar(0x883333), buildTree(6), buildLamp(), buildCrate(0.6), buildMoneyPile(1000)];
props.forEach((p) => { p.updateMatrixWorld(true); new THREE.Box3().setFromObject(p); });
console.log('props ok');

// collider resolution sanity
const pos = { x: -9, z: 13 };
colliders.resolve(pos, 0.36);
console.log('collider resolve ->', pos);

// LOS checks
console.log('LOS through bank wall blocked?', colliders.blocked(11, -8, 11, -20));
console.log('LOS in street clear?', colliders.blocked(-20, -7, 20, -7));

// inventory logic
const hot = INV.newHotbar();
console.log('add pistol', INV.addToHotbar(hot, INV.makeWeapon('pistol')));
console.log('add bag', INV.addToHotbar(hot, INV.makeItem('bag')));
console.log('add money5', INV.addToHotbar(hot, INV.makeItem('money', { qty: 5 })));
console.log('add money again stacks', INV.addToHotbar(hot, INV.makeItem('money', { qty: 2 })), hot.filter(Boolean).length);
console.log('names', hot.filter(Boolean).map(INV.itemName));
const s = INV.defaultSave();
INV.writeSave(s);
const s2 = INV.loadSave();
console.log('save roundtrip ok:', !!s2.lockers.lockerA, s2.money);
let total = 0; for (let i = 0; i < 5; i++) total += INV.packValue();
console.log('pack value sample:', total, 'bag:', INV.bagFill());

// world update loop
for (let i = 0; i < 120; i++) world.update(0.016, new THREE.Vector3(-9, 0, 13));
console.log('world.update ok; door open:', world.houseDoor.open);

console.log('ALL SMOKE TESTS PASSED');
