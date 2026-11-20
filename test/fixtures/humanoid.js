import * as THREE from 'three';

/**
 * Синтетический humanoid-риг в стиле Mixamo (лицом в +Z).
 * Нужен для проверки анимации без реальной модели.
 */
export function buildHumanoidFixture(opts = {}) {
  const root = new THREE.Object3D();
  root.name = 'ArmatureRoot';

  const mk = (name, x, y, z, parent) => {
    const b = new THREE.Bone();
    b.name = 'mixamorig_' + name;
    b.position.set(x, y, z);
    if (parent) parent.add(b);
    return b;
  };

  const hips = mk('Hips', 0, 1.02, 0, root);
  const spine = mk('Spine', 0, 0.15, 0, hips);
  const spine1 = mk('Spine1', 0, 0.2, 0, spine);
  const neck = mk('Neck', 0, 0.2, 0, spine1);
  mk('Head', 0, 0.12, 0, neck);
  const head = neck.children[0];
  mk('HeadTop_End', 0, 0.24, 0, head);

  const shoulders = [];
  for (const [side, sign] of [['Left', 1], ['Right', -1]]) {
    const sh = mk(side + 'Shoulder', 0.04 * sign, 0.14, 0, spine1);
    const arm = mk(side + 'Arm', 0.14 * sign, 0.02, 0, sh);
    const fore = mk(side + 'ForeArm', 0, -0.28, 0, arm);
    mk(side + 'Hand', 0, -0.26, 0, fore);
    shoulders.push(sh);
  }

  for (const [side, sign] of [['Left', 1], ['Right', -1]]) {
    const up = mk(side + 'UpLeg', 0.1 * sign, -0.06, 0, hips);
    const low = mk(side + 'Leg', 0, -0.45, 0, up);
    const foot = mk(side + 'Foot', 0, -0.43, 0, low);
    mk(side + 'ToeBase', 0, -0.05, 0.14, foot);
  }

  root.updateWorldMatrix(true, true);
  return root;
}

export function boneList(root) {
  const out = [];
  root.traverse((o) => { if (o.isBone) out.push(o); });
  return out;
}
