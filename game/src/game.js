import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { Character, WEAPONS, AMMO_PRICES, buildWeapon, buildMoneyPile } from './models.js';
import { Traffic } from './traffic.js';
import { buildWorld } from './world.js';
import { Npc } from './npc.js';
import * as INV from './inventory.js';
import { Sound } from './audio.js';
import { Colliders, clamp, angleDiff, distXZ } from './util.js';
import { isTouch, el } from './ui.js';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const MOBILE = () => window.matchMedia('(pointer: coarse)').matches || innerWidth < 820;

export class Game {
  constructor(canvas, ui, net) {
    this.canvas = canvas;
    this.ui = ui;
    this.net = net;
    this.state = 'boot';
    this.clock = new THREE.Clock();
    this.time = 0;
    this.colliders = null;
    this.npcs = [];
    this.sound = new Sound();
    this.server = 'solo';
    this.stats = { jobs: 0, kills: 0, robberies: 0 };
    this.lockers = null;
    this.uiPaused = false;
    this.playerSeen = false;
    this.remoteSeen = false;
    this.unseen = 0;
    this.grabbing = false;
    this.grabProgress = 0;
    this.moneyRespawnT = 0;
    this.job = null;
    this.carrying = null;
    this.offersT = 20;
    this.copSpawnT = 0;
    this.remoteStars = 0;
    this.tracers = [];
    this.flashes = [];
    this.lastNet = 0;
    this.fpsAcc = 0;
    this.fireCd = 0;
    this.reloading = null;
    this.recoil = 0;
    this.bob = 0;
    this.viewModel = null;
    this.viewWeaponId = null;
    this.intro = null;
    this.currentPrompt = null;
    this.hudTick = 0;
  }

  /* ============================================================ INIT */
  async init() {
    this.renderer = this._createRenderer();

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x8d8272, 80, 300);

    this.camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.05, 700);
    this.camera.rotation.order = 'YXZ';
    this.scene.add(this.camera);

    /* sky */
    const sky = new Sky();
    sky.scale.setScalar(1200);
    this.scene.add(sky);
    const u = sky.material.uniforms;
    u.turbidity.value = 7.5;
    u.rayleigh.value = 1.7;
    u.mieCoefficient.value = 0.0065;
    u.mieDirectionalG.value = 0.86;
    const sunVec = new THREE.Vector3().setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - 16), THREE.MathUtils.degToRad(212));
    u.sunPosition.value.copy(sunVec);
    this.sky = sky;

    this.sun = new THREE.DirectionalLight(0xffd3a0, 2.5);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(MOBILE() ? 1024 : 2048, MOBILE() ? 1024 : 2048);
    const sc = this.sun.shadow.camera;
    sc.near = 1; sc.far = 220; sc.left = -55; sc.right = 55; sc.top = 55; sc.bottom = -55;
    this.sun.shadow.bias = -0.0009;
    this.sun.shadow.normalBias = 0.02;
    this.scene.add(this.sun);
    this.scene.add(this.sun.target);
    this.muzzleLight = new THREE.PointLight(0xffc070, 0, 10, 2);
    this.scene.add(this.muzzleLight);
    this.scene.add(new THREE.HemisphereLight(0xa8c4ff, 0x5b4a34, 0.65));
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.14));

    this.colliders = new Colliders();
    this.world = buildWorld(this.scene, this.colliders);
    this._spawnNpcs();
    this._spawnAmbientNpcPool();

    this.player = {
      pos: V(-14, 0, 13), yaw: Math.PI, pitch: 0, vy: 0,
      hp: 100, maxHp: 100, armor: 0, stamina: 100, maxStamina: 100,
      money: 500, stars: 0, hotbar: INV.newHotbar(), ammo: INV.newAmmo(),
      selected: 0, alive: true, skin: 'gentleman', name: 'ДЖЕНТЕЛЬМЕН', sprintT: 0,
    };

    this.traffic = new Traffic(this);
    this.traffic.start();

    addEventListener('resize', () => this._resize());
    this._resize();

    // cinematic orbit for menu
    this.menuCam = { t: 0 };
    this.loop();
    this.state = 'menu';
    return this;
  }

  _createRenderer() {
    const canvas = this.canvas;
    const r = new THREE.WebGLRenderer({ canvas, antialias: !MOBILE(), powerPreference: 'high-performance', stencil: false });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, MOBILE() ? 1.4 : 2));
    r.setSize(innerWidth, innerHeight, false);
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.06;
    return r;
  }

  _resize() {
    const w = innerWidth, h = innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer?.setSize(w, h, false);
    this.ui.setCrosshair(true);
  }

  _spawnNpcs() {
    const W = this.world;
    const kinds = ['normal', 'elderly', 'thug', 'normal', 'elderly', 'normal', 'thug', 'normal', 'elderly', 'normal'];
    W.npcPaths.forEach((path, pi) => {
      for (let i = 0; i < 1; i++) {
        const start = path[Math.floor(Math.random() * path.length)];
        const kind = kinds[(pi * 2 + i) % kinds.length];
        const n = new Npc(this, {
          role: kind === 'elderly' ? 'old' : kind === 'thug' ? 'thug' : 'ped',
          kind,
          pos: V(start[0] + (Math.random() - 0.5) * 3, 0, start[1] + (Math.random() - 0.5) * 1.5),
          path,
        });
        n.pathIdx = Math.floor(Math.random() * path.length);
        this.npcs.push(n);
      }
    });
    // bank staff
    this.cashier = new Npc(this, { role: 'cashier', pos: this.world.cashierPos, yaw: 0 });
    this.npcs.push(this.cashier);
    this.world.guardPaths.forEach((path) => {
      const g = new Npc(this, { role: 'guard', pos: path[0].clone(), path: path.map((p) => [p.x, p.z]) });
      g.speed = 1.5;
      this.npcs.push(g);
    });
    // gun shop seller
    this.seller = new Npc(this, { role: 'seller', pos: this.world.sellerPos, yaw: 0 });
    this.npcs.push(this.seller);
    // dock boss
    this.boss = new Npc(this, { role: 'boss', kind: 'normal', pos: this.world.dockBossPoint, yaw: -1 });
    this.npcs.push(this.boss);
  }

  _spawnAmbientNpcPool() {
    this.ambientPool = [];
    for (let i = 0; i < 4; i++) {
      const kind = ['normal', 'elderly', 'thug', 'normal'][i];
      const n = new Npc(this, {
        role: kind === 'elderly' ? 'old' : kind === 'thug' ? 'thug' : 'ped',
        kind,
        pos: V(-40 + i * 20, 0, i % 2 ? 7.2 : -7.2),
        path: this.world.npcPaths[i % this.world.npcPaths.length],
      });
      n.char.root.visible = false;
      n.char.root.position.set(0, -50, 0);
      n.pos.set(0, -50, 0);
      n.inactive = true;
      this.ambientPool.push(n);
    }
  }

  /* ============================================================ MATCH */
  startMatch(profile) {
    this.profile = profile;
    const save = INV.loadSave();
    const p = this.player;
    p.skin = profile.skin;
    p.name = profile.name;
    p.money = save.money ?? 500;
    p.hotbar = save.hotbar?.length ? save.hotbar : INV.newHotbar();
    p.ammo = save.ammo || INV.newAmmo();
    p.hp = clamp(save.hp || 100, 25, 100);
    p.stars = 0;
    p.selected = 0;
    p.alive = true;
    this.lockers = save.lockers || { lockerA: new Array(INV.LOCKER_SLOTS).fill(null), lockerB: new Array(INV.LOCKER_SLOTS).fill(null) };
    this.stats = save.stats || this.stats;

    const bedIdx = profile.isHost ? 0 : 1;
    this.bedIdx = bedIdx;
    const bed = this.world.bedSpots[bedIdx];
    p.pos.copy(bed.pos);
    p.yaw = bed.yaw + Math.PI; // look toward room
    p.pitch = 0;
    this.spawnPoint = bed.wakePos.clone();

    if (this.localChar) { this.scene.remove(this.localChar.root); }
    this.localChar = new Character(profile.skin);
    this.localChar.root.position.copy(bed.pos);
    this.localChar.root.position.y = 0.6;
    this.localChar.root.rotation.y = bed.yaw;
    this.localChar.lieDown();
    this.scene.add(this.localChar.root);

    this.ui.setPlayer(profile.name, profile.skin === 'gopnik' ? '🧢' : '🎩');
    this.ui.setStats({ hp: p.hp, stamina: 100, money: p.money, stars: 0 });
    this.ui.renderHotbar(p.hotbar, p.selected, (i) => this.selectSlot(i));
    this.ui.showHUD();
    this.ui.setNet(profile.isHost ? 'ОНЛАЙН · ждём игрока 2' : 'ОНЛАЙН · подключено', true);

    this.intro = { t: 0, dur: 4.6, active: true };
    this.camIntro = {
      pos: V(-8.2, 2.3, 20.2),
      look: V(-12.6, 1.0, 12.8),
    };
    this.state = 'play';
    this.clock.getDelta();
    this.sound.init(); this.sound.resume();

    // view model
    this.viewRoot = new THREE.Group();
    this.camera.add(this.viewRoot);
    this._updateViewModel();

    this.net.on('msg', (m) => this.onNet(m));
    this.net.on('open', () => this.onPeerOpen());
    this.net.on('close', () => {
      this.ui.setNet('СОЛО · игрок 2 отключился', false);
      if (this.remote) { this.scene.remove(this.remote.char.root); this.remote = null; }
    });
    this.net.on('mic', (d) => this.ui.setVoice(d.ok ? 'голос включён' : 'микрофон не разрешён', d.ok));
    this.net.on('status', (d) => this.ui.setNet(d.text, d.kind === 'ok'));

    setInterval(() => { if (this.state === 'play') this.saveGame(); }, 12000);
    addEventListener('beforeunload', () => this.saveGame());
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.saveGame(); });

    this.ui.toast('Ты проснулся в своей комнате', 'good');
    setTimeout(() => this.ui.toast('Голосовой чат активен — друг слышит тебя', ''), 3000);
  }

  /* ============================================================ LOOP */
  loop = () => {
    requestAnimationFrame(this.loop);
    const dt = Math.min(0.06, this.clock.getDelta());
    this.time += dt;

    if (this.state === 'menu') { this.updateMenuCam(dt); this.renderer.render(this.scene, this.camera); return; }
    if (this.state === 'play' || this.state === 'dead') {
      this.uiPaused = this.ui.modalOpen || this.pauseOpen;
      if (!this.uiPaused) this.update(dt);
      this.ui.consumeLook(); // drop accumulated look while paused
      this.renderer.render(this.scene, this.camera);
      if (this.pv && this.ui.modalOpen) this.renderPreview(dt);
      return;
    }
    this.renderer.render(this.scene, this.camera);
  };

  updateMenuCam(dt) {
    this.menuCam.t += dt;
    const t = this.menuCam.t * 0.06;
    const r = 62;
    this.camera.position.set(Math.cos(t) * r + 4, 26 + Math.sin(t * 0.7) * 5, Math.sin(t) * r - 4);
    this.camera.lookAt(4, 3, -2);
    this.traffic?.update(dt);
    this.sun.position.copy(this.camera.position).add(V(-30, 60, 30));
    this.sun.target.position.set(4, 0, 0);
  }

  /* ============================================================ UPDATE */
  update(dt) {
    const p = this.player;
    this.playerSeen = false;
    this.remoteSeen = false;

    if (this.intro?.active) { this.updateIntro(dt); }
    else { this.updatePlayer(dt); }

    this.updateWorld(dt);
    this.traffic?.update(dt);
    this.updateNpcs(dt);
    this.updateRemote(dt);
    this.updateCombat(dt);
    this.updateInteraction(dt);
    this.updateWanted(dt);
    this.updateJobs(dt);
    this.updateOffers(dt);
    this.updateTracers(dt);
    this.netTick(dt);
    this.syncCamera(dt);

    this.hudTick += dt;
    if (this.hudTick > 0.12) {
      this.hudTick = 0;
      this.ui.setStats({ hp: p.hp, stamina: p.stamina, money: p.money, stars: p.stars });
      this.ui.setCops(this.copHudText());
    }
    if (this.moneyRespawnT > 0) {
      this.moneyRespawnT -= dt;
      if (this.moneyRespawnT <= 0) {
        this.world.resetBankMoney();
        this.ui.log('В банке снова появились деньги');
      }
    }
  }

  copHudText() {
    const car = this.traffic?.nearestResponse(this.player.pos);
    if (!car) return null;
    if (car.state === 'respond') {
      const left = Math.abs(car.stopX - car.x);
      const secs = Math.max(1, Math.ceil(left / Math.max(4, car.speed)));
      return `🚔 НАРЯД В ПУТИ · ~${secs} с`;
    }
    if (car.state === 'parked') return '🚔 ПОЛИЦИЯ НА МЕСТЕ';
    return null;
  }

  updateIntro(dt) {
    const I = this.intro;
    I.t += dt;
    const k = clamp(I.t / I.dur, 0, 1);
    const look = this.camIntro.look;
    const pos = this.camIntro.pos.clone();
    pos.x += Math.sin(I.t * 0.5) * 0.25;
    pos.y += Math.sin(I.t * 0.7) * 0.08;
    this.camera.position.copy(pos);
    this.camera.lookAt(look.x, look.y + Math.sin(I.t) * 0.05, look.z);
    this.localChar.update(dt, 0);
    if (this.remote) {
      this.remote.char.update(dt, 0);
    }
    if (I.t > I.dur - 1.6 && !I.woke) {
      I.woke = true;
      this.localChar.wakeUp();
      this.remote?.char.wakeUp();
      this.ui.log('Подъём, дела ждут.');
    }
    if (I.t >= I.dur) {
      I.active = false;
      this.intro = null;
      const p = this.player;
      p.pos.copy(this.spawnPoint);
      p.yaw = Math.PI * 0.75;
      this.localChar.root.visible = false;
      this.ui.setJob(null);
      this.ui.setVoice(this.net.voiceOn ? 'голос включён' : 'микрофон выключен', this.net.voiceOn);
    }
  }

  updateWorld(dt) {
    this.world.update(dt, this.player.pos);
    if (this.player.hp < this.player.maxHp && this.state === 'play') {
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + dt * 0.55);
    }
  }

  /* ---------------- player ---------------- */
  updatePlayer(dt) {
    const p = this.player;
    if (p === null) return;
    if (!p.alive) { this.localChar?.update(dt, 0); return; }

    const look = this.ui.consumeLook();
    p.yaw -= look.x;
    p.pitch = clamp(p.pitch - look.y, -1.35, 1.25);

    let mx = 0, mz = 0, moving = false;
    if (isTouch()) {
      mx = this.ui.input.moveX;
      mz = this.ui.input.moveY;
      moving = Math.hypot(mx, mz) > 0.12;
    } else {
      const km = this.ui.keyboardMove();
      mx = km.x; mz = km.y; moving = km.active;
    }
    const wantRun = this.ui.input.run && p.stamina > 2 && moving;
    const speed = wantRun ? 6.3 : 3.4;
    if (wantRun) {
      p.stamina = Math.max(0, p.stamina - dt * 21);
      p.sprintT = 0;
    } else {
      p.sprintT += dt;
      if (p.sprintT > 0.7) p.stamina = Math.min(p.maxStamina, p.stamina + dt * 16);
    }

    const sin = Math.sin(p.yaw), cos = Math.cos(p.yaw);
    const fwd = -mz, side = mx;
    let vx = (-sin) * fwd + cos * side;
    let vz = (-cos) * fwd + (-sin) * side;
    const l = Math.hypot(vx, vz);
    if (l > 1) { vx /= l; vz /= l; }
    const spd = Math.hypot(vx, vz) * speed;
    p.pos.x += vx * speed * dt;
    p.pos.z += vz * speed * dt;
    this.colliders.resolve(p.pos, 0.36);

    // gravity / jump
    if (this.ui.consumeJump() && p.pos.y <= 0.01) p.vy = 4.4;
    p.vy -= 12 * dt;
    p.pos.y = Math.max(0, p.pos.y + p.vy * dt);
    if (p.pos.y <= 0) { p.vy = 0; }

    // head bob
    this.bob += dt * (moving ? spd * 1.9 : 2);
    const bobAmp = moving ? (wantRun ? 0.055 : 0.03) : 0.006;

    // local character (for shadows / intro)
    const ch = this.localChar;
    if (ch) {
      ch.root.position.set(p.pos.x, p.pos.y, p.pos.z);
      ch.root.rotation.y = p.yaw + Math.PI;
      ch.root.visible = false;
      ch.aiming = this.playerArmed() || false;
      ch.update(dt, moving ? spd : 0);
    }

    // recoil recovery
    this.recoil = Math.max(0, this.recoil - dt * 3.6);
    this.camBob = bobAmp;
  }

  syncCamera(dt) {
    const p = this.player;
    if (this.intro?.active) return;
    const eye = 1.63;
    const bobY = Math.sin(this.bob) * (this.camBob || 0.01);
    this.camera.position.set(p.pos.x, p.pos.y + eye + bobY, p.pos.z);
    this.camera.rotation.set(p.pitch + this.recoil * 0.055, p.yaw, Math.sin(this.bob * 0.5) * 0.006);
    if (this.viewRoot) {
      this.viewRoot.position.set(0.26, -0.24 + Math.sin(this.bob) * (this.camBob || 0.01) * 0.6, -0.5);
      this.viewRoot.rotation.set(-0.02, 0.05, 0);
      if (this.reloading) {
        const k = 1 - this.reloading.t / 1.3;
        this.viewRoot.rotation.z = Math.sin(k * Math.PI) * 0.9;
        this.viewRoot.position.y -= Math.sin(k * Math.PI) * 0.12;
      }
      if (this.grabbing) {
        const t = this.time * 6.5;
        this.viewRoot.position.y += Math.sin(t) * 0.055 - 0.05;
        this.viewRoot.position.z -= 0.06;
        this.viewRoot.rotation.x += Math.sin(t) * 0.28 - 0.15;
        this.viewRoot.rotation.z += Math.sin(t * 0.5) * 0.12;
      }
    }
    // sun follows player for crisp shadows
    this.sun.position.set(p.pos.x - 40, 70, p.pos.z + 45);
    this.sun.target.position.set(p.pos.x, 0, p.pos.z);
  }

  /* ---------------- npc ---------------- */
  updateNpcs(dt) {
    const pPos = this.player.pos;
    for (const n of this.npcs) {
      if (n.inactive) continue;
      const d = distXZ(n.pos, pPos);
      if (d > 95) { n.char.update(dt, 0); continue; }
      n.update(dt);
      // job-offer NPC reaches player
      if (n.jobOffer && !this.job && distXZ(n.pos, pPos) < 2.6) {
        this.pendingOffer = n;
      }
    }
    // копы без розыска садятся в машину, машина уезжает (безмашинный спавн — старый путь)
    for (let i = this.npcs.length - 1; i >= 0; i--) {
      const n = this.npcs[i];
      if (n.role !== 'cop' || n.inactive) continue;
      if (this.player.stars !== 0 || (this.remoteStars || 0) !== 0) { n.calmT = 0; continue; }
      if (n.car) continue;
      n.calmT = (n.calmT || 0) + dt;
      if (n.calmT > 6) {
        n.leaving = true;
        n.pos.x += (n.startPos.x - n.pos.x) * dt * 0.9;
        n.pos.z += (n.startPos.z - n.pos.z) * dt * 0.9;
        n.char.root.position.set(n.pos.x, 0, n.pos.z);
        if (distXZ(n.pos, n.startPos) < 3) {
          this.scene.remove(n.char.root);
          this.npcs.splice(i, 1);
        }
      }
    }
  }

  /* ---------------- remote player ---------------- */
  updateRemote(dt) {
    const r = this.remote;
    if (!r) return;
    r.pos.lerp(r.target, Math.min(1, dt * 12));
    r.char.root.position.copy(r.pos);
    r.char.root.rotation.y += angleDiff(r.char.root.rotation.y, r.yaw) * Math.min(1, dt * 10);
    r.char.aiming = !!r.aim;
    if (r.weapon !== r.char.weaponId) r.char.setWeapon(r.weapon);
    r.char.update(dt, r.speed || 0, { aiming: r.aim });
    r.stars = r.stars || 0;
    this.remoteStars = r.stars;
  }

  /* ---------------- combat ---------------- */
  currentItem() {
    const p = this.player;
    return p.selected === 0 ? null : p.hotbar[p.selected];
  }
  currentWeaponId() {
    const it = this.currentItem();
    if (!it) return 'fists';
    if (it.t === 'weapon' || it.t === 'melee') return it.id;
    if (it.t === 'bag') return 'bag';
    return 'fists';
  }
  playerArmed() {
    const it = this.currentItem();
    return !!(it && it.t === 'weapon');
  }

  updateCombat(dt) {
    const p = this.player;
    this.fireCd = Math.max(0, this.fireCd - dt);
    if (!p.alive) return;

    if (this.reloading) {
      this.reloading.t -= dt;
      if (this.reloading.t <= 0) {
        const it = this.reloading.item;
        const w = WEAPONS[it.id];
        const need = w.mag - it.mag;
        const have = p.ammo[w.ammo] || 0;
        const take = Math.min(need, have);
        it.mag += take;
        p.ammo[w.ammo] = have - take;
        this.reloading = null;
        this.sound.reload();
        this.ui.renderHotbar(p.hotbar, p.selected, (i) => this.selectSlot(i));
        this.ui.setProgress(null);
      } else {
        this.ui.setProgress(1 - this.reloading.t / 1.3, 'Перезарядка…');
      }
    }

    if (this.ui.consumeReload()) this.startReload();

    if (this.ui.input.fire && this.fireCd <= 0) this.tryFire();
  }

  startReload() {
    const p = this.player;
    const it = this.currentItem();
    if (!it || it.t !== 'weapon' || this.reloading) return;
    const w = WEAPONS[it.id];
    if (it.mag >= w.mag) { this.ui.toast('Магазин полон', ''); return; }
    const reserve = p.ammo[w.ammo] || 0;
    if (reserve <= 0) {
      this.ui.toast('Патронов нет — купи патроны в магазине оружия', 'bad');
      this.sound.error();
      return;
    }
    this.reloading = { t: 1.3, item: it };
    this.sound.reload();
  }

  tryFire() {
    const p = this.player;
    const it = this.currentItem();
    if (!p.alive) return;
    if (!it) return this.meleeAttack('fists');
    if (it.t === 'melee') return this.meleeAttack(it.id);
    if (it.t !== 'weapon') {
      if (it.t === 'money' || it.t === 'bag') this.ui.toast('Это не оружие', '');
      return;
    }
    const w = WEAPONS[it.id];
    if (it.mag <= 0) {
      this.fireCd = 0.35;
      this.ui.toast('Магазин пуст! Перезарядись (или купи патроны)', 'bad');
      this.sound.error();
      if ((p.ammo[w.ammo] || 0) > 0) this.startReload();
      return;
    }
    it.mag--;
    this.fireCd = w.rate;
    this.recoil = Math.min(1.6, this.recoil + (it.id === 'rifle' ? 0.22 : it.id === 'shotgun' ? 0.55 : 0.35));
    this.sound.shot(it.id === 'rifle' ? 'rifle' : it.id);
    this.muzzleFlash();

    const dir = this.camera.getWorldDirection(new THREE.Vector3());
    dir.x += (Math.random() - 0.5) * w.spread * 2;
    dir.y += (Math.random() - 0.5) * w.spread * 2;
    dir.z += (Math.random() - 0.5) * w.spread * 2;
    dir.normalize();
    const hits = this.hitscan(w.dmg, w.range, dir, false);
    this.net.send({ t: 'e', k: 'shot', v: it.id, p: [p.pos.x, p.pos.z] });
    this.ui.renderHotbar(p.hotbar, p.selected, (i) => this.selectSlot(i));

    // public panic
    if (hits || Math.random() < 0.6) this.panicNearby(14);
    if (!this.alarmOn && this.inBank(p.pos)) {
      const witness = this.npcs.some((n) => !n.dead && (n.role === 'guard' || n.role === 'cashier') && distXZ(n.pos, p.pos) < 16 && this.visionCheck(n.pos, n.yaw, p.pos, 2.2, 16));
      if (witness) setTimeout(() => this.triggerAlarm('shot'), 700);
    }
  }

  meleeAttack(id) {
    const p = this.player;
    const w = WEAPONS[id] || WEAPONS.fists;
    if (p.stamina < 6) { this.ui.toast('Нет сил — отдышись', 'bad'); return; }
    p.stamina -= 7;
    this.fireCd = w.rate;
    this.localChar?.punch();
    this.sound.punch();
    const dir = this.camera.getWorldDirection(new THREE.Vector3());
    this.hitscan(w.dmg, 2.1, dir, true);
  }

  hitscan(dmg, range, dir, melee) {
    const o = this.camera.position.clone();
    let best = null, bestD = range, bestPoint = null;
    const c = new THREE.Vector3();
    for (const n of this.npcs) {
      if (n.dead || n.inactive) continue;
      c.set(n.pos.x, 1.15, n.pos.z);
      const to = c.clone().sub(o);
      const t = to.dot(dir);
      if (t < 0.2 || t > range) continue;
      const perp = to.clone().sub(dir.clone().multiplyScalar(t)).length();
      const hitR = melee ? 0.85 : 0.6;
      if (perp < hitR && t < bestD) {
        if (this.colliders.blocked(o.x, o.z, c.x, c.z)) continue;
        best = n; bestD = t; bestPoint = o.clone().add(dir.clone().multiplyScalar(t));
      }
    }
    if (this.remote && !best) {
      c.set(this.remote.pos.x, 1.15, this.remote.pos.z);
      const to = c.clone().sub(o);
      const t = to.dot(dir);
      const perp = to.clone().sub(dir.clone().multiplyScalar(t)).length();
      if (t > 0.2 && t < range && perp < 0.7) {
        bestPoint = o.clone().add(dir.clone().multiplyScalar(t));
        // friendly fire disabled
        this.ui.log('Это твой напарник — по своим не стреляем');
        this.sound.hit();
      }
    }
    if (best) {
      best.damage(dmg, true);
      this.sound.hit();
      bestPoint = bestPoint || o.clone().add(dir.clone().multiplyScalar(bestD));
      this.spawnSpark(bestPoint, 0xc02020);
      this.ui.hitFlash();
      if (best.dead) {
        this.addStars(best.role === 'cop' ? 2 : 1);
        this.stats.kills++;
      } else if (best.role === 'guard' || best.role === 'cop') {
        this.addStars(1);
      }
      return best;
    }
    // environmental impact
    if (!melee) {
      const pt = o.clone().add(dir.clone().multiplyScalar(Math.min(range, 45)));
      this.spawnSpark(pt, 0xffd08a);
      this.tracer(o.clone().add(new THREE.Vector3(0.2, -0.12, 0)).add(dir.clone().multiplyScalar(0.5)), pt);
    }
    return null;
  }

  muzzleFlash() {
    const l = this.muzzleLight;
    if (!l) return;
    l.position.copy(this.camera.position).add(this.camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(0.8));
    l.intensity = 24;
    if (!this.flashes.some((f) => f.persistent)) this.flashes.push({ l, t: 0.06, persistent: true });
  }

  spawnSpark(pos, color, size = 0.07) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(size, 6, 5), new THREE.MeshBasicMaterial({ color }));
    m.position.copy(pos);
    this.scene.add(m);
    this.flashes.push({ l: m, t: 0.12, mesh: true });
  }

  tracer(a, b) {
    const geo = new THREE.BufferGeometry().setFromPoints([a, b]);
    const mat = new THREE.LineBasicMaterial({ color: 0xffe6a0, transparent: true, opacity: 0.85 });
    const line = new THREE.Line(geo, mat);
    this.scene.add(line);
    this.tracers.push({ line, t: 0.07 });
  }

  updateTracers(dt) {
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const tr = this.tracers[i];
      tr.t -= dt;
      tr.line.material.opacity = Math.max(0, tr.t / 0.07) * 0.85;
      if (tr.t <= 0) { this.scene.remove(tr.line); tr.line.geometry.dispose(); tr.line.material.dispose(); this.tracers.splice(i, 1); }
    }
    for (let i = this.flashes.length - 1; i >= 0; i--) {
      const f = this.flashes[i];
      f.t -= dt;
      if (f.mesh) f.l.scale.setScalar(Math.max(0.01, f.t / 0.12));
      else f.l.intensity = Math.max(0, f.l.intensity * 0.72);
      if (f.t <= 0) {
        if (f.persistent) { f.l.intensity = 0; this.flashes.splice(i, 1); continue; }
        this.scene.remove(f.l);
        if (f.mesh) { f.l.geometry.dispose(); f.l.material.dispose(); }
        this.flashes.splice(i, 1);
      }
    }
  }

  /* ---------------- interaction ---------------- */
  updateInteraction(dt) {
    const p = this.player;
    if (this.intro?.active || !p.alive) { this.ui.setPrompt(null); return; }

    const cands = [];
    const add = (id, pos, r, label, fn) => {
      const d = distXZ(p.pos, pos);
      if (d < r) cands.push({ id, d, label, fn });
    };
    const W = this.world;
    add('door', W.houseDoor.pos, 2.6, W.houseDoor.open ? 'Закрыть дверь' : 'Открыть дверь', () => this.toggleHouseDoor());
    W.lockers.forEach((l) => add('locker' + l.id, l.pos, 2.4, `Открыть ${l.label}`, () => this.openLocker(l.id)));
    W.bedSpots.forEach((b, i) => add('bed' + i, b.wakePos, 2.2, 'Лечь спать (восстановить силы)', () => this.sleepInBed()));
    add('shop', W.shopPoint, 3.4, 'Каталог оружия', () => this.openShop());
    add('seller', new THREE.Vector3(W.sellerPos.x, 0, W.sellerPos.z + 1.4), 2.6, 'Поговорить с продавцом', () => this.talkSeller());
    add('boss', W.dockBossPoint, 3.2, this.job ? 'Работа: взять ящик' : 'Устроиться на подработку', () => this.startJob());
    if (this.carrying) add('truck', W.truckPoint, 4.0, 'Погрузить ящик в грузовик', () => this.deliverBox());
    else if (this.job) {
      for (const b of W.boxSpawns) {
        if (b.taken) continue;
        add('box' + b.id, b.pos, 2.2, 'Взять ящик', () => this.takeBox(b));
      }
    }
    if (this.pendingOffer && distXZ(this.pendingOffer.pos, p.pos) < 3) {
      add('offernpc', this.pendingOffer.pos, 3.2, `Согласиться: подработка ($${this.offerPay || 0})`, () => this.acceptOffer(this.pendingOffer));
    }
    // cashier talk
    add('cashier', this.world.cashierPos, 3.4, 'Поговорить с кассиром', () => this.talkCashier());

    cands.sort((a, b) => a.d - b.d);
    const best = cands[0];
    if (best) {
      this.currentPrompt = best;
      this.ui.setPrompt(`<b>${isTouch() ? 'ДЕЙСТВИЕ' : 'E'}</b> ${best.label}`);
    } else {
      this.currentPrompt = null;
      this.ui.setPrompt(null);
    }
    if (this.ui.consumeInv()) { this.openInventory(); return; }
    if (this.ui.consumeAct() && best) { this.sound.ui(); best.fn(); }

    // hold-to-grab money
    this.updateMoneyGrab(dt);
  }

  updateMoneyGrab(dt) {
    const p = this.player;
    const piles = this.world.bankMoney.filter((m) => !m.taken);
    let near = null, nd = 99;
    for (const m of piles) {
      const d = distXZ(p.pos, m.pos);
      if (d < 2.6 && d < nd) { near = m; nd = d; }
    }
    const holdAct = this.ui.input.act || this.ui.keys.has('act');
    if (!near) {
      this.grabbing = false;
      this.grabProgress = 0;
      this.ui.setProgress(null);
      return;
    }
    const bag = this.currentItem()?.t === 'bag';
    const dur = bag ? 30 : 15;
    if (holdAct && p.alive) {
      this.grabbing = true;
      this.currentPrompt = { id: 'money' };
      this.grabProgress += dt / dur;
      this.ui.setPrompt(`<b>ДЕРЖИ</b> ${bag ? 'Складываешь деньги в сумку' : 'Хватаешь пачки руками'} · ${Math.round(this.grabProgress * 100)}%`);
      this.ui.setProgress(this.grabProgress, bag ? 'Сумка: наполнение 30 сек' : 'Голые руки: 5 пачек за 15 сек');
      if (this.grabProgress >= 1) {
        this.grabProgress = 0;
        this.completeRobbery(bag);
      }
    } else {
      this.grabbing = false;
      this.grabProgress = Math.max(0, this.grabProgress - dt * 0.5);
      this.ui.setProgress(null);
    }
  }

  completeRobbery(withBag) {
    const p = this.player;
    const W = this.world;
    W.bankMoney.forEach((m) => { m.taken = true; m.mesh.visible = false; });
    this.moneyRespawnT = 210;
    this.stats.robberies++;
    this.net.send({ t: 'e', k: 'money' });
    this.sound.cash();

    const bagItem = this.currentItem();
    if (withBag && bagItem && bagItem.t === 'bag') {
      const amount = INV.bagFill();
      bagItem.cash = (bagItem.cash || 0) + amount;
      this.ui.toast(`В сумке теперь $${bagItem.cash.toLocaleString('ru-RU')}`, 'good');
      this.ui.log('Сумка набита. Открой её в инвентаре и выведи деньги.');
    } else {
      const it = INV.makeItem('money', { qty: 5 });
      const ok = INV.addToHotbar(p.hotbar, it);
      if (!ok) {
        this.ui.toast('Нет места в руках! Пачки выпали', 'bad');
      } else {
        this.ui.toast('5 пачек денег у тебя в инвентаре', 'good');
        this.ui.log('Открой инвентарь → «Перевести в баланс»');
      }
    }
    this.ui.renderHotbar(p.hotbar, p.selected, (i) => this.selectSlot(i));
    this.addStars(2);
    this.triggerAlarm('robbery');
    this.ui.setProgress(null);
  }

  toggleHouseDoor() {
    const d = this.world.houseDoor;
    d.open = !d.open;
    this.sound.door();
    this.net.send({ t: 'e', k: 'door', v: d.open });
    if (d.open) this.ui.log('Дверь открыта');
    else this.ui.log('Дверь закрыта — можно спрятаться');
  }

  sleepInBed() {
    const p = this.player;
    p.hp = Math.min(p.maxHp, p.hp + 55);
    p.stamina = p.maxStamina;
    this.saveGame();
    this.ui.toast('Поспал · здоровье восстановлено · игра сохранена', 'good');
  }

  talkSeller() {
    this.ui.toast('«Бери ствол, патроны дешевле не будут»', '');
  }

  talkCashier() {
    if (this.playerArmed()) { this.ui.toast('Кассирша в ужасе!', 'bad'); this.triggerAlarm('cashier'); return; }
    this.ui.toast('«Извините, банк закрыт на учёт»', '');
  }

  inBank(pos) {
    const B = this.world.bankInterior;
    return pos.x > B.x1 && pos.x < B.x2 && pos.z > B.z1 && pos.z < B.z2;
  }

  /* ---------------- wanted / police ---------------- */
  addStars(n) {
    const p = this.player;
    p.stars = clamp(p.stars + n, 0, 5);
    this.ui.setStats({ stars: p.stars });
    this.net.send({ t: 'e', k: 'stars', v: p.stars });
  }

  triggerAlarm(reason) {
    if (this.alarmOn) return;
    this.alarmOn = true;
    this.world.alarmOn = true;
    this.sound.siren(true);
    this.ui.toast('⚠ ТРЕВОГА! Полиция выехала', 'bad');
    this.ui.log('Сматывайся с места преступления');
    this.player.stars = Math.max(this.player.stars, 2);
    this.ui.setStats({ stars: this.player.stars });
    this.net.send({ t: 'e', k: 'alarm' });
    this.spawnPolice(2);
  }

  calmDown() {
    this.alarmOn = false;
    this.world.alarmOn = false;
    this.sound.siren(false);
  }

  spawnPolice(n) {
    if (this.traffic) { this.traffic.dispatch(Math.min(2, Math.max(1, n))); return; }
    // fallback (без дорожного модуля) — старый мгновенный спавн
    for (let i = 0; i < n; i++) {
      if (this.npcs.filter((x) => x.role === 'cop').length >= 4)break;
      const sp = this.world.policeSpawns[i % this.world.policeSpawns.length].clone();
      const cop = new Npc(this, { role: 'cop', pos: sp, yaw: 0 });
      cop.path = null;
      this.npcs.push(cop);
    }
  }

  markSeen(target, cop) {
    if (target === this.player) this.playerSeen = true;
    else this.remoteSeen = true;
  }

  nearestWantedPlayer(from) {
    const p = this.player;
    if (p.stars > 0 && p.alive) return { pos: p.pos, stars: p.stars, isRemote: false };
    if (this.remote && (this.remoteStars || 0) > 0) return { pos: this.remote.pos, stars: this.remoteStars, isRemote: true };
    return null;
  }

  updateWanted(dt) {
    const p = this.player;
    if (p.stars <= 0) {
      if (this.alarmOn) this.calmDown();
      this.unseen = 0;
      return;
    }
    const anySeen = this.playerSeen;
    if (anySeen) this.unseen = 0;
    else this.unseen += dt;

    const inHouse = p.pos.x > -16 && p.pos.x < -2 && p.pos.z > 10 && p.pos.z < 22 && !this.world.houseDoor.open;
    const limit = inHouse ? 7 : 14;
    if (this.unseen > limit) {
      this.unseen = 0;
      p.stars = Math.max(0, p.stars - 1);
      this.ui.setStats({ stars: p.stars });
      this.ui.log(p.stars > 0 ? `Розыск снижен (${p.stars}★)` : 'Тебя потеряли из виду. Чист.');
      this.net.send({ t: 'e', k: 'stars', v: p.stars });
      if (p.stars === 0) this.calmDown();
    }
  }

  copShootAt(cop, targetPos, target) {
    this.sound.shot('pistol');
    const from = new THREE.Vector3(
      cop.pos.x + Math.sin(cop.yaw) * 0.6,
      1.44,
      cop.pos.z + Math.cos(cop.yaw) * 0.6,
    );
    const to = new THREE.Vector3(targetPos.x + (Math.random() - 0.5) * 0.6, 1.2, targetPos.z + (Math.random() - 0.5) * 0.6);
    this.spawnSpark(from, 0xffe0a0, 0.13);
    this.tracer(from, to);
    const hitChance = 0.72;
    if (Math.random() < hitChance) {
      if (target.isRemote) {
        this.net.send({ t: 'e', k: 'rhurt', v: 11 });
        this.spawnSpark(to, 0xc02020);
      } else {
        this.hitPlayer(10 + Math.random() * 5, cop);
      }
    } else this.spawnSpark(to, 0xffd08a);
  }

  hitPlayer(dmg, from, target = null) {
    const p = this.player;
    if (target && target.isRemote) { this.net.send({ t: 'e', k: 'rhurt', v: dmg }); return; }
    if (!p.alive) return;
    if (p.armor > 0) {
      const absorbed = Math.min(p.armor, dmg * 0.6);
      p.armor -= absorbed;
      dmg -= absorbed;
    }
    p.hp -= dmg;
    this.ui.hitFlash();
    this.sound.hit();
    if (p.hp <= 0) this.die();
  }

  die() {
    const p = this.player;
    if (!p.alive) return;
    p.alive = false;
    p.hp = 0;
    this.state = 'dead';
    this.sound.error();
    this.ui.hitFlash();
    // drop everything
    for (let i = 0; i < p.hotbar.length; i++) p.hotbar[i] = null;
    p.selected = 0;
    p.stars = 0;
    this.calmDown();
    this.ui.renderHotbar(p.hotbar, p.selected, (i) => this.selectSlot(i));
    this.net.send({ t: 'e', k: 'die' });
    this.localChar.isDead = true;
    this.localChar.root.visible = false;
    this.ui.setProgress(null);
    this.ui.setPrompt(null);

    const body = el('div', 'dead', `
      <div style="font-size:42px">☠️</div>
      <h2>ТЫ ПОГИБ</h2>
      <div style="font-size:12px;color:#b9b1a0;line-height:1.5">Инвентарь потерян. Деньги и ценности лучше хранить в шкафу дома.<br>Очнёшься на своей кровати через несколько секунд.</div>`);
    const btn = el('button', 'btn wide', 'ОЧНУТЬСЯ СЕЙЧАС');
    btn.onclick = () => { this.ui.hideModal(); this.respawn(); };
    this.ui.showModal({ title: 'СМЕРТЬ', sub: 'Город суровый. В следующий раз прячься лучше.', body, foot: btn });
    setTimeout(() => { if (this.state === 'dead') { this.ui.hideModal(); this.respawn(); } }, 6000);
  }

  respawn() {
    const p = this.player;
    p.alive = true;
    p.hp = 100;
    p.stamina = 100;
    p.stars = 0;
    p.pos.copy(this.spawnPoint);
    p.yaw = Math.PI * 0.7;
    p.pitch = 0;
    this.localChar.isDead = false;
    this.localChar.root.visible = false;
    this.ui.setStats({ hp: 100, stamina: 100, stars: 0, money: p.money });
    this.ui.renderHotbar(p.hotbar, p.selected, (i) => this.selectSlot(i));
    this.state = 'play';
    this.saveGame();
  }

  /* ---------------- jobs ---------------- */
  startJob() {
    const W = this.world;
    const boxes = W.boxSpawns.filter((b) => !b.taken);
    if (!boxes.length) { this.ui.toast('Ящиков нет — приходи позже', ''); return; }
    if (this.job) {
      this.ui.toast('Сначала отнеси ящик в грузовик', '');
      return;
    }
    this.job = { pay: Math.floor(180 + Math.random() * 260), left: boxes.length, total: boxes.length };
    this.ui.toast(`Работа: ${this.job.left} ящиков · $${this.job.pay} за ящик`, 'good');
    this.ui.setJob(`📦 ПОДРАБОТКА · ящиков: ${this.job.left} · $${this.job.pay} за ящик`);
  }

  takeBox(b) {
    if (!this.job || b.taken) return;
    b.taken = true;
    b.mesh.visible = false;
    this.carrying = b;
    this.ui.setJob(`📦 Неси ящик в грузовик · $${this.job.pay}`);
    this.ui.toast('Взял ящик — тащи в грузовик', '');
    this.sound.pickup();
    // view model box
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshStandardMaterial({ color: 0x8a6437, roughness: 0.9 }));
    box.position.set(0.1, -0.42, -0.62);
    box.rotation.set(0.2, 0.3, 0.1);
    this.viewRoot.add(box);
    this.carryMesh = box;
  }

  deliverBox() {
    if (!this.carrying || !this.job) return;
    const b = this.carrying;
    b.taken = true;
    b.mesh.visible = false;
    b.mesh.position.copy(this.world.truckPoint);
    this.clearCarry();
    this.job.left--;
    const pay = this.job.pay;
    this.player.money += pay;
    this.stats.jobs++;
    this.sound.cash();
    this.ui.setStats({ money: this.player.money });
    this.ui.toast(`+$${pay} за ящик`, 'good');
    this.net.send({ t: 'e', k: 'cash' });
    if (this.job.left <= 0) {
      const bonus = Math.floor(pay * 1.2);
      this.player.money += bonus;
      this.ui.toast(`Работа сделана! Бонус +$${bonus}`, 'good');
      this.ui.log('Подработка закрыта. Загляни в магазин оружия.');
      this.job = null;
      this.ui.setJob(null);
      this.ui.setStats({ money: this.player.money });
      this.world.boxSpawns.forEach((x) => { x.taken = false; x.mesh.visible = true; });
    } else {
      this.ui.setJob(`📦 ПОДРАБОТКА · осталось: ${this.job.left} · $${this.job.pay}`);
    }
    this.saveGame();
  }

  clearCarry() {
    if (this.carryMesh) { this.viewRoot.remove(this.carryMesh); this.carryMesh.geometry.dispose(); this.carryMesh.material.dispose(); this.carryMesh = null; }
    this.carrying = null;
  }

  updateJobs(dt) {
    // job offer NPC walking away timeout
    if (this.pendingOffer && distXZ(this.pendingOffer.pos, this.player.pos) > 14) this.pendingOffer = null;
  }

  updateOffers(dt) {
    if (this.intro?.active) return;
    this.offersT -= dt;
    if (this.offersT > 0) return;
    this.offersT = 55 + Math.random() * 55;
    if (this.job || this.pendingOffer) return;
    // spawn a pedestrian who walks up with a job
    const pool = this.ambientPool.filter((n) => !n.jobOffer && !n.used);
    if (!pool.length) { this.ambientPool.forEach((x) => { if (!x.jobOffer) x.used = false; }); }
    const n = pool[Math.floor(Math.random() * pool.length)] || this.ambientPool[0];
    if (!n) return;
    n.used = true;
    const p = this.player.pos;
    const ang = Math.random() * Math.PI * 2;
    n.pos.set(p.x + Math.cos(ang) * 26, 0, p.z + Math.sin(ang) * 26);
    this.colliders.resolve(n.pos, 0.4);
    if (Math.abs(n.pos.x) > 90) n.pos.x *= 0.5;
    n.char.root.position.set(n.pos.x, 0, n.pos.z);
    n.char.root.visible = true;
    n.inactive = false;
    n.jobOffer = true;
    n.offerT = 45;
    n.hostile = false;
    this.offerPay = 220 + Math.floor(Math.random() * 280);
    if (!this.npcs.includes(n)) this.npcs.push(n);
    this.pendingOffer = null;
    n.say('Эй! Работёнка есть…', 5);
    this.ui.toast('Прохожий хочет предложить подработку', '');
    if (!this.ambientPool.includes(n)) this.ambientPool.push(n);
  }

  acceptOffer(npc) {
    npc.jobOffer = false;
    npc.say('Тащи ящики к грузовику, брат.', 4);
    this.pendingOffer = null;
    this.startJob();
  }

  /* ---------------- vision ---------------- */
  visionCheck(from, yaw, targetPos, fov, maxDist) {
    const d = distXZ(from, targetPos);
    if (d > maxDist) return false;
    const ang = Math.atan2(targetPos.x - from.x, targetPos.z - from.z);
    if (Math.abs(angleDiff(yaw, ang)) > fov / 2) return false;
    if (this.colliders.blocked(from.x, from.z, targetPos.x, targetPos.z)) return false;
    return true;
  }

  panicNearby(radius) {
    let said = 0;
    for (const n of this.npcs) {
      if (n.dead || n.role === 'cop') continue;
      if (distXZ(n.pos, this.player.pos) < radius && said < 2) {
        n.state = 'flee'; n.fleeT = 4;
        if (Math.random() < 0.6) { n.say('Тикай! Ствол!', 2); said++; }
      }
    }
  }

  onNpcKilled(npc, byPlayer) {
    this.ui.log(npc.role === 'cop' ? 'Ты убил копа. Это 2 звезды.' : 'Труп. +1 звезда.');
  }

  /* ---------------- net ---------------- */
  netTick(dt) {
    this.lastNet += dt;
    if (this.lastNet < 0.07) return;
    this.lastNet = 0;
    const p = this.player;
    const moving = this.camBob > 0.012;
    this.net.send({
      t: 's',
      p: [Math.round(p.pos.x * 100) / 100, Math.round(p.pos.y * 100) / 100, Math.round(p.pos.z * 100) / 100],
      y: Math.round(p.yaw * 100) / 100,
      v: moving ? 3 : 0,
      w: this.currentWeaponId(),
      a: this.playerArmed() ? 1 : 0,
      st: p.stars,
      hp: Math.round(p.hp),
    });
  }

  onPeerOpen() {
    this.net.send({ t: 'hello', name: this.profile.name, skin: this.profile.skin, st: this.player.stars });
    this.ui.setNet('ОНЛАЙН · 2/2 игрока', true);
  }

  onNet(m) {
    if (!m || !m.t) return;
    if (m.t === 'hello') {
      this._createRemote(m.skin || 'gopnik', m.name || 'ИГРОК 2');
      this.net.send({ t: 'hello', name: this.profile.name, skin: this.profile.skin, st: this.player.stars });
      this.net.enableVoice?.();
      this.net._tryCall?.();
    } else if (m.t === 's') {
      if (!this.remote) this._createRemote('gopnik', 'ИГРОК 2');
      const r = this.remote;
      r.target.set(m.p[0], m.p[1], m.p[2]);
      r.yaw = m.y;
      r.speed = m.v;
      r.aim = !!m.a;
      r.stars = m.st || 0;
      r.hp = m.hp;
      if (r.weapon !== m.w) r.weapon = m.w;
    } else if (m.t === 'e') {
      this.onNetEvent(m);
    }
  }

  _createRemote(skin, name) {
    if (this.remote) this.scene.remove(this.remote.char.root);
    const bed = this.world.bedSpots[this.bedIdx === 0 ? 1 : 0];
    const ch = new Character(skin);
    ch.root.position.copy(bed.pos);
    ch.root.position.y = 0.6;
    ch.root.rotation.y = bed.yaw;
    if (this.intro?.active) ch.lieDown();
    this.scene.add(ch.root);
    this.remote = {
      char: ch, name, skin,
      pos: bed.pos.clone(), target: bed.wakePos.clone(),
      yaw: bed.yaw, speed: 0, weapon: 'fists', aim: false, stars: 0, hp: 100,
    };
    this.ui.toast(`${name} в комнате`, 'good');
    this.ui.setNet('ОНЛАЙН · 2/2 игрока', true);
  }

  onNetEvent(m) {
    switch (m.k) {
      case 'shot': {
        this.sound.shot(m.v === 'shotgun' ? 'shotgun' : m.v === 'rifle' ? 'rifle' : 'pistol');
        if (this.remote) {
          const from = new THREE.Vector3(this.remote.pos.x, 1.4, this.remote.pos.z);
          const dir = new THREE.Vector3(Math.sin(this.remote.yaw + Math.PI), 0, Math.cos(this.remote.yaw + Math.PI));
          this.tracer(from, from.clone().add(dir.multiplyScalar(18)));
        }
        break;
      }
      case 'door': this.world.houseDoor.open = !!m.v; this.sound.door(); break;
      case 'alarm': this.alarmOn = true; this.world.alarmOn = true; this.sound.siren(true); this.spawnPolice(2); this.ui.toast('Напарник поднял тревогу!', 'bad'); break;
      case 'stars': this.remoteStars = m.v; break;
      case 'money':
        this.world.bankMoney.forEach((x) => { x.taken = true; x.mesh.visible = false; });
        this.moneyRespawnT = 210;
        break;
      case 'rhurt': if (this.player.alive) this.hitPlayer(m.v, null); break;
      case 'die': if (this.remote) { this.remote.char.isDead = true; this.ui.log('Напарник погиб'); } break;
      case 'cash': this.sound.cash(); break;
      case 'respawn': if (this.remote) { this.remote.char.isDead = false; } break;
    }
  }

  /* ---------------- inventory / hud ---------------- */
  selectSlot(i) {
    const p = this.player;
    if (i < 0 || i >= INV.SLOTS) return;
    p.selected = i;
    this.ui.renderHotbar(p.hotbar, p.selected, (x) => this.selectSlot(x));
    this._updateViewModel();
    if (i > 0 && p.hotbar[i] && p.hotbar[i].t === 'weapon' && this.playerArmed()) {
      // showing a gun in public is dangerous
      if (this.inBank(p.pos)) this.ui.log('Не показывай ствол в банке!');
      this.panicNearby(9);
    }
  }

  _updateViewModel() {
    if (!this.viewRoot) return;
    const wid = this.currentWeaponId();
    if (wid === this.viewWeaponId) return;
    this.viewWeaponId = wid;
    while (this.viewRoot.children.length) {
      const c = this.viewRoot.children[0];
      if (c === this.carryMesh) { this.viewRoot.remove(c); continue; }
      this.viewRoot.remove(c);
    }
    if (wid === 'fists') {
      const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.1, 3, 7), new THREE.MeshStandardMaterial({ color: 0xe6b48c, roughness: 0.7 }));
      m.position.set(0.02, -0.05, 0.05); m.rotation.x = 1.2;
      this.viewRoot.add(m);
    } else {
      const m = buildWeapon(wid);
      m.scale.setScalar(1.15);
      m.rotation.set(0, Math.PI * 0.5, 0);
      m.position.set(0.06, -0.02, 0.16);
      this.viewRoot.add(m);
    }
    if (this.carryMesh) this.viewRoot.add(this.carryMesh);
  }

  /* ---------------- modals ---------------- */
  openShop(tab = 'weapons') {
    this.ui.showModal({
      title: 'ОРУЖЕЙНЫЙ МАГАЗИН',
      sub: '«Всё для серьёзных людей» · продавец смотрит на тебя как на старого клиента',
      body: this.buildShop(tab),
      foot: [this._closeBtn('ЗАКРЫТЬ')],
    });
  }

  buildShop(tab) {
    const wrap = el('div');
    const tabs = el('div', 'tabs');
    const mk = (id, label) => {
      const t = el('div', 'tab' + (tab === id ? ' on' : ''), label);
      t.onclick = () => { this.openShop(id); };
      tabs.appendChild(t);
    };
    mk('weapons', 'ОРУЖИЕ');
    mk('ammo', 'ПАТРОНЫ');
    mk('gear', 'СНАРЯЖЕНИЕ');
    wrap.appendChild(tabs);

    const pv = el('div', 'preview3d');
    const pvCanvas = this._previewCanvas();
    pv.appendChild(pvCanvas);
    wrap.appendChild(pv);
    const that = this;
    const setPreview = (id) => { that._previewShow(id); };

    const grid = el('div', 'shopgrid');
    const p = this.player;
    if (tab === 'weapons') {
      ['pistol', 'shotgun', 'rifle', 'knife', 'baton'].forEach((id) => {
        const w = WEAPONS[id];
        const card = el('div', 'itemcard');
        card.innerHTML = `<div class="nm">${w.icon} ${w.name}</div><div class="ds">${w.desc}</div>
          <div class="buyrow"><div class="pr">$${w.price}</div><button class="buysmall">КУПИТЬ</button></div>`;
        card.onmouseenter = () => setPreview(id);
        card.onclick = () => setPreview(id);
        card.querySelector('button').onclick = (e) => { e.stopPropagation(); this.buyWeapon(id); };
        grid.appendChild(card);
      });
    } else if (tab === 'ammo') {
      Object.keys(AMMO_PRICES).forEach((type) => {
        const price = AMMO_PRICES[type];
        const have = p.ammo[type] || 0;
        const card = el('div', 'itemcard');
        card.innerHTML = `<div class="nm">📦 Патроны ${type} ×30</div>
          <div class="ds">Запас: <b style="color:#ffd88a">${have}</b> шт. Дешёвые — не жалей.</div>
          <div class="buyrow"><div class="pr">$${price * 3}</div><button class="buysmall">КУПИТЬ 30</button></div>`;
        card.querySelector('button').onclick = () => this.buyAmmo(type);
        grid.appendChild(card);
      });
    } else {
      const bagIt = el('div', 'itemcard');
      bagIt.innerHTML = `<div class="nm">🎒 Сумка для денег</div>
        <div class="ds">Вмещает кучу налички. Надеваешь в руки — в банке собираешь 30 сек вместо 15, зато сумма в разы больше.</div>
        <div class="buyrow"><div class="pr">$450</div><button class="buysmall">КУПИТЬ</button></div>`;
      bagIt.onmouseenter = () => setPreview('bag');
      bagIt.querySelector('button').onclick = () => this.buyBag();
      grid.appendChild(bagIt);

      const arm = el('div', 'itemcard');
      arm.innerHTML = `<div class="nm">🦺 Бронежилет</div><div class="ds">Гасит 60% урона, пока не разобьют. Полиция оценит.</div>
        <div class="buyrow"><div class="pr">$600</div><button class="buysmall">КУПИТЬ</button></div>`;
      arm.querySelector('button').onclick = () => this.buyArmor();
      grid.appendChild(arm);
    }
    wrap.appendChild(grid);
    wrap.appendChild(el('div', 'hintrow', `Твой баланс: <b style="color:#8ee08a">$${this.player.money.toLocaleString('ru-RU')}</b> · Купленное падает в инвентарь (низ экрана)`));
    setPreview(tab === 'gear' ? 'bag' : 'pistol');
    return wrap;
  }

  buyWeapon(id) {
    const w = WEAPONS[id];
    const p = this.player;
    if (p.money < w.price) { this.ui.toast('Не хватает денег', 'bad'); this.sound.error(); return; }
    const item = INV.makeWeapon(id);
    if (!INV.addToHotbar(p.hotbar, item)) { this.ui.toast('Инвентарь полон — освободи ячейку', 'bad'); return; }
    p.money -= w.price;
    this.sound.cash();
    this.ui.toast(`Куплено: ${w.name}`, 'good');
    this.ui.setStats({ money: p.money });
    this.ui.renderHotbar(p.hotbar, p.selected, (i) => this.selectSlot(i));
    this.openShop('weapons');
    this.saveGame();
  }

  buyAmmo(type) {
    const p = this.player;
    const price = AMMO_PRICES[type] * 3;
    if (p.money < price) { this.ui.toast('Не хватает денег', 'bad'); this.sound.error(); return; }
    p.money -= price;
    p.ammo[type] = (p.ammo[type] || 0) + 30;
    this.sound.cash();
    this.ui.toast(`+30 патронов ${type} (всего ${p.ammo[type]})`, 'good');
    this.ui.setStats({ money: p.money });
    this.openShop('ammo');
    this.saveGame();
  }

  buyBag() {
    const p = this.player;
    if (p.money < 450) { this.ui.toast('Не хватает денег', 'bad'); this.sound.error(); return; }
    if (!INV.addToHotbar(p.hotbar, INV.makeItem('bag'))) { this.ui.toast('Инвентарь полон', 'bad'); return; }
    p.money -= 450;
    this.sound.cash();
    this.ui.toast('Сумка куплена · выбери её в слотах', 'good');
    this.ui.setStats({ money: p.money });
    this.ui.renderHotbar(p.hotbar, p.selected, (i) => this.selectSlot(i));
    this.openShop('gear');
    this.saveGame();
  }

  buyArmor() {
    const p = this.player;
    if (p.money < 600) { this.ui.toast('Не хватает денег', 'bad'); return; }
    p.money -= 600;
    p.armor = 100;
    this.sound.cash();
    this.ui.toast('Бронежилет надет', 'good');
    this.ui.setStats({ money: p.money });
    this.openShop('gear');
    this.saveGame();
  }

  _previewCanvas() {
    const pv = this._previewInit();
    return pv.canvas;
  }
  _previewInit() {
    if (this.pv) return this.pv;
    const canvas = document.createElement('canvas');
    canvas.width = 560; canvas.height = 240;
    const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    r.setPixelRatio(1);
    r.setSize(560, 240, false);
    const sc = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(36, 560 / 240, 0.05, 30);
    cam.position.set(0.85, 0.5, 0.95);
    cam.lookAt(0, 0.03, 0);
    sc.add(new THREE.HemisphereLight(0xffffff, 0x404050, 2.6));
    const d = new THREE.DirectionalLight(0xffe2b8, 2.6); d.position.set(2, 3, 2); sc.add(d);
    const d2 = new THREE.DirectionalLight(0x88aaff, 1.2); d2.position.set(-2, 1, -2); sc.add(d2);
    this.pv = { r, sc, cam, model: null, canvas };
    return this.pv;
  }
  _previewShow(id) {
    const pv = this._previewInit();
    if (pv.model) pv.sc.remove(pv.model);
    const m = buildWeapon(id);
    const box = new THREE.Box3().setFromObject(m);
    const size = box.getSize(new THREE.Vector3()).length();
    m.scale.setScalar(1.6 / Math.max(0.4, size));
    m.position.set(0, 0.05, 0);
    pv.sc.add(m);
    pv.model = m;
    pv.spin = 0;
  }
  renderPreview(dt) {
    const pv = this.pv;
    if (!pv || !pv.canvas.isConnected) return;
    pv.spin += dt * 0.6;
    if (pv.model) pv.model.rotation.y = pv.spin * 0.5 + 0.6;
    pv.r.setSize(pv.canvas.clientWidth || 560, pv.canvas.clientHeight || 240, false);
    pv.r.render(pv.sc, pv.cam);
  }

  openLocker(id) {
    const lockers = this.lockers[id];
    const tabBtn = (label, lid) => {
      const b = el('div', 'tab' + (id === lid ? ' on' : ''), label);
      b.onclick = () => this.openLocker(lid);
      return b;
    };
    const wrap = el('div');
    const tabs = el('div', 'tabs');
    tabs.appendChild(tabBtn('ШАФ 1', 'lockerA'));
    tabs.appendChild(tabBtn('ШАФ 2', 'lockerB'));
    wrap.appendChild(tabs);
    wrap.appendChild(el('div', 'hintrow', 'Нажми на вещь в шкафу — забрать. Нажми на вещь в инвентаре — положить. Всё сохраняется.'));
    const grid = el('div', 'grid15');
    for (let i = 0; i < INV.LOCKER_SLOTS; i++) {
      const it = lockers[i];
      const s = el('div', 'gslot', it ? INV.itemIcon(it) : '');
      if (it) {
        if (it.t === 'money') s.innerHTML += `<span class="qty">×${it.qty}</span>`;
        if (it.t === 'weapon') s.innerHTML += `<span class="qty">${it.mag}</span>`;
        s.title = INV.itemName(it);
        s.onclick = () => {
          if (INV.addToHotbar(this.player.hotbar, it)) {
            lockers[i] = null;
            this.ui.toast(`Взял: ${INV.itemName(it)}`, 'good');
            this.ui.renderHotbar(this.player.hotbar, this.player.selected, (x) => this.selectSlot(x));
            this.openLocker(id);
            this.saveGame();
          } else this.ui.toast('Руки заняты — освободи ячейку', 'bad');
        };
      }
      grid.appendChild(s);
    }
    wrap.appendChild(el('div', 'hintrow', 'Ячейки шкафа:'));
    wrap.appendChild(grid);

    wrap.appendChild(el('div', 'hintrow', '<b>Твой инвентарь:</b>'));
    const hb = el('div', 'grid15');
    for (let i = 0; i < INV.SLOTS; i++) {
      const it = i === 0 ? null : this.player.hotbar[i];
      const s = el('div', 'gslot', it ? INV.itemIcon(it) : (i === 0 ? '👊' : ''));
      if (it) {
        s.title = INV.itemName(it);
        s.onclick = () => {
          const empty = lockers.findIndex((x) => !x);
          if (empty < 0) { this.ui.toast('Шкаф полон', 'bad'); return; }
          lockers[empty] = it;
          this.player.hotbar[i] = null;
          this.ui.toast(`Положил: ${INV.itemName(it)}`, 'good');
          this.ui.renderHotbar(this.player.hotbar, this.player.selected, (x) => this.selectSlot(x));
          this.openLocker(id);
          this.saveGame();
        };
      }
      hb.appendChild(s);
    }
    wrap.appendChild(hb);
    this.ui.showModal({
      title: 'ШКАФ',
      sub: 'Здесь вещи переживут твою смерть. 15 ячеек.',
      body: wrap,
      foot: [this._closeBtn('ЗАКРЫТЬ')],
    });
  }

  openInventory() {
    const p = this.player;
    const wrap = el('div');
    const grid = el('div', 'grid15');
    for (let i = 0; i < INV.SLOTS; i++) {
      const it = i === 0 ? null : p.hotbar[i];
      const s = el('div', 'gslot' + (p.selected === i ? ' sel' : ''), i === 0 ? '👊' : (it ? INV.itemIcon(it) : ''));
      s.onclick = () => { p.selected = i; this.selectSlot(i); this.openInventory(); };
      if (it) {
        if (it.t === 'money') s.innerHTML += `<span class="qty">×${it.qty}</span>`;
        if (it.t === 'weapon') s.innerHTML += `<span class="qty">${it.mag}</span>`;
      }
      grid.appendChild(s);
    }
    wrap.appendChild(el('div', 'hintrow', 'Слоты в руках (низ экрана). Кулак всегда первый.'));
    wrap.appendChild(grid);

    const it = p.selected === 0 ? null : p.hotbar[p.selected];
    const info = el('div', 'itemcard');
    info.style.marginTop = '10px';
    info.innerHTML = `<div class="nm">${INV.itemIcon(it)} ${INV.itemName(it)}</div>
      <div class="ds">${INV.itemDesc(it)}</div>`;
    if (it && it.t === 'money') {
      const b = el('button', 'buysmall', 'ПЕРЕВЕСТИ В БАЛАНС');
      b.onclick = () => this.convertMoney(it);
      info.appendChild(b);
    }
    if (it && it.t === 'bag') {
      const b = el('button', 'buysmall', `ОТКРЫТЬ СУМКУ ($${it.cash || 0})`);
      b.onclick = () => this.openBag(it);
      info.appendChild(b);
    }
    if (it && it.t === 'weapon') {
      const w = WEAPONS[it.id];
      info.appendChild(el('div', 'hintrow', `В магазине: ${it.mag}/${w.mag} · запас: ${p.ammo[w.ammo] || 0} патронов ${w.ammo}`));
    }
    wrap.appendChild(info);
    wrap.appendChild(el('div', 'hintrow', `Баланс: <b style="color:#8ee08a">$${p.money.toLocaleString('ru-RU')}</b>`));
    this.ui.showModal({
      title: 'ИНВЕНТАРЬ',
      sub: 'Перезарядка, деньги и всё, что нажил',
      body: wrap,
      foot: [this._closeBtn('ЗАКРЫТЬ')],
    });
  }

  convertMoney(item) {
    const p = this.player;
    let total = 0;
    for (let i = 0; i < item.qty; i++) total += INV.packValue();
    p.money += total;
    item.qty = 0;
    const idx = p.hotbar.indexOf(item);
    if (idx > 0) p.hotbar[idx] = null;
    p.selected = 0;
    this.sound.cash();
    this.ui.toast(`Переведено +$${total.toLocaleString('ru-RU')}`, 'good');
    this.ui.setStats({ money: p.money });
    this.ui.renderHotbar(p.hotbar, p.selected, (i) => this.selectSlot(i));
    this._updateViewModel();
    this.saveGame();
    this.ui.hideModal();
  }

  openBag(item) {
    const p = this.player;
    const wrap = el('div');
    wrap.appendChild(el('div', 'moneybig', `$${(item.cash || 0).toLocaleString('ru-RU')}`));
    wrap.appendChild(el('div', 'hintrow', 'Сколько вывести на баланс? Остальное останется в сумке.'));
    const range = document.createElement('input');
    range.type = 'range';
    range.min = 0; range.max = Math.max(0, item.cash || 0); range.value = Math.floor((item.cash || 0) / 2);
    const val = el('div', 'kv', `<span>К выводу</span><b>$${Number(range.value).toLocaleString('ru-RU')}</b>`);
    range.oninput = () => { val.innerHTML = `<span>К выводу</span><b>$${Number(range.value).toLocaleString('ru-RU')}</b>`; };
    wrap.appendChild(range);
    wrap.appendChild(val);
    const all = el('button', 'btn', 'ВСЕ');
    all.onclick = () => { range.value = item.cash || 0; range.oninput(); };
    const take = el('button', 'btn', 'ПЕРЕВЕСТИ');
    take.onclick = () => {
      const amt = clamp(Number(range.value) || 0, 0, item.cash || 0);
      item.cash = (item.cash || 0) - amt;
      p.money += amt;
      this.sound.cash();
      this.ui.toast(`Выведено +$${amt.toLocaleString('ru-RU')}`, 'good');
      this.ui.setStats({ money: p.money });
      this.saveGame();
      this.openBag(item);
    };
    const row = el('div', 'btn-row');
    row.appendChild(all);
    row.appendChild(take);
    wrap.appendChild(row);
    this.ui.showModal({ title: 'СУМКА', sub: 'Наличка из банка', body: wrap, foot: [this._closeBtn('ЗАКРЫТЬ')] });
  }

  _closeBtn(label) {
    const b = el('button', 'btn', label);
    b.onclick = () => { this.ui.hideModal(); this.sound.ui(); };
    return b;
  }

  openPause() {
    this.pauseOpen = true;
    this.ui.showPause();
    document.exitPointerLock?.();
  }

  /* ---------------- save ---------------- */
  saveGame() {
    if (!this.player || this.state === 'menu' || this.state === 'boot') return;
    const p = this.player;
    const s = INV.loadSave();
    s.money = Math.round(p.money);
    s.hotbar = JSON.parse(JSON.stringify(p.hotbar));
    s.ammo = { ...p.ammo };
    s.lockers = JSON.parse(JSON.stringify(this.lockers || {}));
    s.hp = Math.round(p.hp);
    s.pos = [Math.round(p.pos.x * 10) / 10, Math.round(p.pos.z * 10) / 10];
    s.stars = p.stars;
    s.stats = this.stats;
    INV.writeSave(s);
  }

  exitToMenu() {
    this.saveGame();
    this.sound.siren(false);
    this.state = 'menu';
    this.ui.hideModal();
    this.ui.hidePause();
    this.pauseOpen = false;
    this.ui.showMenu();
    try { this.net.hangup(); } catch (e) {}
    location.reload();
  }
}
