import './stub.mjs';
const ow = console.warn;
console.warn = (...a) => { ow(a[0]); ow(new Error('trace').stack.split('\n').slice(1,11).join('\n')); };
const { Character } = await import('/home/user/DFG/game/src/models.js');
const { buildWorld } = await import('/home/user/DFG/game/src/world.js');
const THREE = await import('three');
const s = new THREE.Scene(); const { Colliders } = await import('/home/user/DFG/game/src/util.js');
buildWorld(s, new Colliders());
for (const k of ['gentleman','gopnik','elderly','normal','thug','cashier','guard','cop','seller']) new Character(k);
