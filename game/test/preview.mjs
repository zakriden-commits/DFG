/* headless "software" renderer: projects the three.js scene into an SVG and
   rasterises it to PNG so the layout can be inspected without a GPU. */
import './game.stub.mjs';
import * as THREE from 'three';
import { Game } from '../src/game.js';
import { UI } from '../src/ui.js';
import fs from 'fs';

const fakeRenderer = () => ({ setPixelRatio() {}, setSize() {}, render() {}, shadowMap: {}, toneMapping: 0, toneMappingExposure: 1, domElement: {} });
class TestGame extends Game {
  _createRenderer() { return fakeRenderer(); }
  _previewInit() { return { r: fakeRenderer(), sc: new THREE.Scene(), cam: null, model: null, canvas: document.createElement('canvas') }; }
  renderPreview() {}
}
const ui = new UI();
const net = { on() { return this; }, send() {}, enableVoice: async () => true, _tryCall() {}, hangup() {} };
const game = new TestGame(document.getElementById('c'), ui, net);
await game.init();
game.startMatch({ isHost: true, skin: 'gentleman', name: 'ДЖЕНТЕЛЬМЕН' });
for (let i = 0; i < 200; i++) game.update(1 / 30);

const W = 960, H = 540;

function render(camPos, lookAt, file) {
  const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 500);
  camera.position.set(...camPos);
  camera.lookAt(new THREE.Vector3(...lookAt));
  camera.updateMatrixWorld(true);
  camera.updateProjectionMatrix();
  game.scene.updateMatrixWorld(true);

  const vp = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
  const tris = [];
  const lightDir = new THREE.Vector3(-0.4, 0.85, 0.35).normalize();
  const v = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];

  game.scene.traverse((o) => {
    if (!o.isMesh || !o.visible) return;
    const geo = o.geometry;
    const pos = geo.attributes.position;
    if (!pos) return;
    const idx = geo.index ? geo.index.array : null;
    const mw = o.matrixWorld;
    const nrm = new THREE.Matrix3().getNormalMatrix(mw);
    const mat = Array.isArray(o.material) ? o.material[0] : o.material;
    let col = mat?.color ? mat.color.clone() : new THREE.Color(0x999999);
    if (mat?.map) col.multiplyScalar(0.75);
    if (mat?.emissive && mat.emissiveIntensity > 1) col.lerp(mat.emissive, 0.55);
    const count = idx ? idx.length : pos.count;
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    for (let i = 0; i < count; i += 3) {
      const i0 = idx ? idx[i] : i, i1 = idx ? idx[i + 1] : i + 1, i2 = idx ? idx[i + 2] : i + 2;
      a.fromBufferAttribute(pos, i0).applyMatrix4(mw);
      b.fromBufferAttribute(pos, i1).applyMatrix4(mw);
      c.fromBufferAttribute(pos, i2).applyMatrix4(mw);
      // face normal
      const ab = b.clone().sub(a), ac = c.clone().sub(a);
      const n = ab.cross(ac).normalize();
      const shade = Math.abs(n.dot(lightDir)) * 0.75 + 0.3;
      // project
      v[0].copy(a).applyMatrix4(vp);
      v[1].copy(b).applyMatrix4(vp);
      v[2].copy(c).applyMatrix4(vp);
      if (v[0].z < -1 || v[1].z < -1 || v[2].z < -1) continue;
      if (v[0].z > 1 || v[1].z > 1 || v[2].z > 1) continue;
      const pts = v.slice(0, 3).map((p) => [((p.x * 0.5 + 0.5) * W).toFixed(1), ((1 - (p.y * 0.5 + 0.5)) * H).toFixed(1)]);
      if (pts.every((p) => p[0] < -50 || p[0] > W + 50) || pts.every((p) => p[1] < -50 || p[1] > H + 50)) continue;
      const depth = (v[0].z + v[1].z + v[2].z) / 3;
      const cc = col.clone().multiplyScalar(shade);
      const hex = '#' + cc.getHexString();
      tris.push({ depth, hex, d: `M${pts[0][0]},${pts[0][1]} L${pts[1][0]},${pts[1][1]} L${pts[2][0]},${pts[2][1]} Z` });
    }
  });
  tris.sort((p, q) => q.depth - p.depth);
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" fill="#8ea4b8"/>`;
  let cur = null, path = '';
  const flush = () => { if (cur && path) svg += `<path d="${path}" fill="${cur}"/>`; path = ''; };
  for (const t of tris) {
    if (t.hex !== cur) { flush(); cur = t.hex; }
    path += t.d;
  }
  flush();
  svg += '</svg>';
  fs.writeFileSync(file.replace('.png', '.svg'), svg);
  console.log(file, 'tris', tris.length, 'svg', (svg.length / 1e6).toFixed(1) + 'MB');
}

const g = game;
render([-9, 2.1, 20.5], [-13.5, 1.1, 12.5], '/tmp/viz/house.png');        // bedroom
render([11.5, 2.0, -2], [11.5, 2.2, -20], '/tmp/viz/bank_out.png');        // bank from street
render([11.5, 2.0, -12], [10, 1.6, -23], '/tmp/viz/bank_in.png');          // inside bank
render([-24, 1.8, -10], [-24, 1.6, -22], '/tmp/viz/shop.png');             // gun shop
render([0, 24, 46], [0, 0, -6], '/tmp/viz/city.png');                      // city overview
render([-11, 1.7, 16], [-3, 1.6, 6], '/tmp/viz/street.png');               // from house door
render([40, 2.0, 24], [41, 1.4, 15], '/tmp/viz/dock.png');                 // loading dock
