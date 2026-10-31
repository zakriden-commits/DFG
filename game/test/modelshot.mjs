import './game.stub.mjs';
import * as THREE from 'three';
import { Character } from '../src/models.js';
import fs from 'fs';

const W = 1200, H = 700;
const scene = new THREE.Scene();
scene.add(new THREE.AmbientLight(0xffffff, 1.5));
const kinds = ['gentleman', 'gopnik', 'elderly', 'normal', 'thug', 'cashier', 'guard', 'cop', 'seller'];
const chars = kinds.map((k, i) => {
  const c = new Character(k);
  c.root.position.set((i - 4) * 1.15, 0, 0);
  if (k === 'gentleman') c.setWeapon('pistol');
  if (k === 'gopnik') c.setWeapon('knife');
  if (k === 'guard') c.setWeapon('baton');
  c.aiming = true;
  for (let f = 0; f < 20; f++) c.update(0.033, 0, { aiming: true });
  scene.add(c.root);
  return c;
});

const camera = new THREE.PerspectiveCamera(35, W / H, 0.1, 100);
camera.position.set(0, 1.15, 7.2);
camera.lookAt(0, 1.0, 0);
camera.updateMatrixWorld(true); camera.updateProjectionMatrix();
scene.updateMatrixWorld(true);

const vp = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
const tris = [];
const lightDir = new THREE.Vector3(-0.35, 0.8, 0.5).normalize();
const v = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
scene.traverse((o) => {
  if (!o.isMesh) return;
  const geo = o.geometry, pos = geo.attributes.position;
  if (!pos) return;
  const idx = geo.index ? geo.index.array : null;
  const mw = o.matrixWorld;
  const mat = Array.isArray(o.material) ? o.material[0] : o.material;
  let col = mat?.color ? mat.color.clone() : new THREE.Color(0x888888);
  const count = idx ? idx.length : pos.count;
  for (let i = 0; i < count; i += 3) {
    const i0 = idx ? idx[i] : i, i1 = idx ? idx[i+1] : i+1, i2 = idx ? idx[i+2] : i+2;
    const a = new THREE.Vector3().fromBufferAttribute(pos, i0).applyMatrix4(mw);
    const b = new THREE.Vector3().fromBufferAttribute(pos, i1).applyMatrix4(mw);
    const c = new THREE.Vector3().fromBufferAttribute(pos, i2).applyMatrix4(mw);
    const n = b.clone().sub(a).cross(c.clone().sub(a)).normalize();
    const shade = 0.42 + Math.abs(n.dot(lightDir)) * 0.62;
    v[0].copy(a).applyMatrix4(vp); v[1].copy(b).applyMatrix4(vp); v[2].copy(c).applyMatrix4(vp);
    if (v[0].z < -1 || v[1].z < -1 || v[2].z < -1 || v[0].z > 1 || v[1].z > 1 || v[2].z > 1) continue;
    const pts = v.map((p) => [((p.x*0.5+0.5)*W).toFixed(1), ((1-(p.y*0.5+0.5))*H).toFixed(1)]);
    tris.push({ d: (v[0].z+v[1].z+v[2].z)/3, hex: '#'+col.clone().multiplyScalar(shade).getHexString(),
      p: `M${pts[0][0]},${pts[0][1]} L${pts[1][0]},${pts[1][1]} L${pts[2][0]},${pts[2][1]} Z` });
  }
});
tris.sort((a,b)=>b.d-a.d);
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" fill="#6a6f78"/>`;
let cur=null, path='';
for (const t of tris){ if(t.hex!==cur){ if(cur&&path) svg+=`<path d="${path}" fill="${cur}"/>`; cur=t.hex; path=''; } path+=t.p; }
if(cur&&path) svg+=`<path d="${path}" fill="${cur}"/>`;
svg += '</svg>';
fs.writeFileSync('/tmp/viz/models.svg', svg);
console.log('models tris', tris.length);
