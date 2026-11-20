import * as THREE from 'three';

/**
 * Манекен-заглушка: настоящий гуманоидный скелет + простые меши.
 * Нужен, чтобы демо работало ещё до загрузки GLB и чтобы видеть анимацию,
 * даже если модель не ригнута.
 */
export function buildMannequin() {
  const root = new THREE.Object3D();
  root.name = 'Mannequin';

  const matBody = new THREE.MeshStandardMaterial({
    color: 0x1b2436,
    roughness: 0.55,
    metalness: 0.35,
  });
  const matLimb = new THREE.MeshStandardMaterial({
    color: 0x27334d,
    roughness: 0.6,
    metalness: 0.3,
  });
  const matHead = new THREE.MeshStandardMaterial({
    color: 0xdfe9f5,
    roughness: 0.45,
    metalness: 0.1,
  });
  const matAccent = new THREE.MeshStandardMaterial({
    color: 0x0a1020,
    emissive: 0x00d5ff,
    emissiveIntensity: 1.6,
    roughness: 0.4,
    metalness: 0.6,
  });

  const bone = (name, x, y, z, parent) => {
    const b = new THREE.Bone();
    b.name = name;
    b.position.set(x, y, z);
    if (parent) parent.add(b);
    return b;
  };

  const limb = (parent, length, radius, material, yOffsetRatio = 0.5) => {
    const geo = new THREE.CapsuleGeometry(radius, Math.max(0.01, length - radius * 2), 6, 12);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.y = -length * yOffsetRatio;
    parent.add(mesh);
    return mesh;
  };

  const hips = bone('Hips', 0, 1.0, 0, root);
  const pelvisMesh = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, 0.2), matBody);
  pelvisMesh.position.y = -0.01;
  hips.add(pelvisMesh);

  const spine = bone('Spine', 0, 0.14, 0, hips);
  const spine1 = bone('Spine1', 0, 0.18, 0, spine);
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.26, 6, 14), matBody);
  torso.position.y = 0.13;
  torso.scale.z = 0.72;
  spine1.add(torso);

  const neck = bone('Neck', 0, 0.2, 0, spine1);
  limb(neck, 0.08, 0.045, matLimb);
  const head = bone('Head', 0, 0.09, 0, neck);
  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.105, 20, 16), matHead);
  headMesh.position.y = 0.1;
  headMesh.scale.set(0.92, 1.12, 1);
  head.add(headMesh);
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.035, 0.02), matAccent);
  visor.position.set(0, 0.1, 0.1);
  head.add(visor);

  const sides = [
    ['Left', 1],
    ['Right', -1],
  ];

  for (const [side, sign] of sides) {
    const sh = bone(side + 'Shoulder', 0.045 * sign, 0.16, 0, spine1);
    const arm = bone(side + 'Arm', 0.12 * sign, 0.0, 0, sh);
    const upper = limb(arm, 0.28, 0.055, matLimb);
    const fore = bone(side + 'ForeArm', 0, -0.28, 0, arm);
    limb(fore, 0.26, 0.045, matLimb);
    const hand = bone(side + 'Hand', 0, -0.26, 0, fore);
    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.1, 0.04), matLimb);
    palm.position.y = -0.05;
    hand.add(palm);
    upper.name = side + 'UpperArmMesh';
    void fore;

    const upLeg = bone(side + 'UpLeg', 0.095 * sign, -0.02, 0, hips);
    limb(upLeg, 0.45, 0.075, matLimb);
    const lowLeg = bone(side + 'Leg', 0, -0.45, 0, upLeg);
    limb(lowLeg, 0.43, 0.06, matLimb);
    const foot = bone(side + 'Foot', 0, -0.43, 0, lowLeg);
    const footMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.07, 0.24), matBody);
    footMesh.position.set(0, -0.03, 0.06);
    foot.add(footMesh);
    bone(side + 'ToeBase', 0, -0.02, 0.14, foot);
  }

  root.updateWorldMatrix(true, true);
  return root;
}
