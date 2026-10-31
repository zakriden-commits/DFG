import * as THREE from 'three';
import { buildCar, buildPoliceCar } from './models.js';
import { Npc } from './npc.js';
import { clamp, distXZ } from './util.js';

/*
  Дорожное движение + выезд полиции.

  Машины ездят по проезжей части (полосы z = ±2.6), тормозят перед игроком,
  пешеходами и друг другом. Патрульные машины постоянно катаются по городу.
  По тревоге наряд НЕ появляется из воздуха: со стороны города выезжает
  полицейская машина с мигалкой, едет несколько секунд к месту, паркуется и
  из неё по одному выходят копы. Когда розыск снят — они возвращаются в
  машину, и она уезжает.
*/
const LANE = 2.6;
const END = 96;
const CIV_COLORS = [0x8c2b2b, 0x2b4a6b, 0x3a3f4a, 0x6b6b3a, 0x8a7a2b, 0x24340f, 0xa8a29a, 0x4b2a5a];

class Car {
  constructor(traffic, opts = {}) {
    this.traffic = traffic;
    this.game = traffic.game;
    this.kind = opts.kind || 'civil';
    this.dir = opts.dir >= 0 ? 1 : -1;
    this.z = opts.z ?? (this.dir > 0 ? LANE : -LANE);
    this.x = opts.x ?? (this.dir > 0 ? -END - Math.random() * 14 : END + Math.random() * 14);
    this.maxSpeed = opts.maxSpeed ?? (this.kind === 'police' ? 13 : 8.5 + Math.random() * 3.5);
    this.speed = this.maxSpeed * 0.8;
    this.state = 'drive';        // drive | respond | parked | leave
    this.stopX = opts.stopX ?? 0;
    this.siren = false;
    this.sirenT = Math.random() * 2;
    this.cops = [];
    this.copsToSpawn = 0;
    this.copsSpawned = 0;
    this.unloadT = 0;
    this.readyT = 0;
    this.hitCd = 0;
    this.dead = false;
    this.color = opts.color ?? CIV_COLORS[Math.floor(Math.random() * CIV_COLORS.length)];
    this.group = this.kind === 'police' ? buildPoliceCar() : buildCar(this.color);
    this.game.scene.add(this.group);
    this.sync(0);
  }

  get pos() { return this.group.position; }
  get lights() { return this.group.userData.lights; }

  sync(dt) {
    this.group.position.set(this.x, 0, this.z);
    this.group.rotation.y = this.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
    if (dt && this.group.userData.spin) this.group.userData.spin((this.speed * dt) / 0.36);
  }

  updateSiren(dt) {
    const L = this.lights;
    if (!L) return;
    this.sirenT += dt;
    const beat = Math.floor(this.sirenT / 0.19) % 2;
    const on = this.siren;
    L.red.material.emissiveIntensity = on && beat === 0 ? 3.4 : 0.28;
    L.blue.material.emissiveIntensity = on && beat === 1 ? 3.4 : 0.28;
    L.light.color.setHex(beat ? 0x2a52ff : 0xff2222);
    L.light.intensity = on ? 11 : 0;
  }

  aheadBlocked() {
    const g = this.game;
    const lane = this.z, d = this.dir;
    const near = (x, z, extra = 0) => {
      if (Math.abs(z - lane) > 1.8) return false;
      const dx = (x - this.x) * d;
      return dx > 0.2 && dx < 3.0 + this.speed * 0.34 + extra;
    };
    if (near(g.player.pos.x, g.player.pos.z)) return true;
    if (g.remote && near(g.remote.pos.x, g.remote.pos.z)) return true;
    for (const c of this.traffic.cars) {
      if (c === this || c.z !== lane || c.dir !== d) continue;
      if (near(c.x, lane, 3.5)) return true;
    }
    for (const n of g.npcs) {
      if (n.dead || n.inactive) continue;
      if (near(n.pos.x, n.pos.z)) return true;
    }
    return false;
  }

  update(dt) {
    if (this.dead) return;
    const g = this.game;
    if (this.kind === 'police') this.updateSiren(dt);
    this.hitCd = Math.max(0, this.hitCd - dt);

    if (this.state === 'parked') {
      this.speed = Math.max(0, this.speed - 10 * dt);
      this.unload(dt);
      // все копы вернулись — уезжаем
      if (this.cops.length && this.cops.every((c) => c.inCar)) {
        this.readyT += dt;
        if (this.readyT > 1.2) { this.state = 'leave'; this.siren = false; this.readyT = 0; }
      }
      this.sync(dt);
      return;
    }

    if (this.state === 'respond') {
      const remaining = (this.stopX - this.x) * this.dir;
      if (remaining <= 0.4) {
        this.state = 'parked';
        this.speed = 0;
        this.unloadT = 0.9;
        this.siren = false;
        this.readyT = 0;
        g.ui.log('🚔 Наряд на месте');
        g.sound?.radio?.();
      } else {
        const v = Math.sqrt(2 * 7 * Math.max(0.3, remaining - 0.6));
        this.speed = Math.min(this.maxSpeed, Math.max(3.4, v));
      }
    } else if (this.state === 'leave') {
      this.speed = Math.min(this.maxSpeed + 3, this.speed + 8 * dt);
    } else if (this.aheadBlocked()) {
      this.speed = Math.max(0, this.speed - 20 * dt);
    } else {
      this.speed = Math.min(this.maxSpeed, this.speed + 7 * dt);
    }

    this.x += this.dir * this.speed * dt;
    this.sync(dt);

    // сбить игрока, если он выскочил под колёса
    if (this.speed > 4.5 && this.hitCd <= 0) {
      const dx = Math.abs(g.player.pos.x - this.x);
      const dz = Math.abs(g.player.pos.z - this.z);
      if (dx < 2.3 && dz < 1.35) {
        this.hitCd = 2.5;
        this.speed *= 0.5;
        g.hitPlayer(11, null);
        g.sound.hit();
        g.ui.toast('Тебя сбили!', 'bad');
      }
    }

    if (this.state === 'leave' && Math.abs(this.x) > END + 4) { this.dispose(); return; }
    // по кругу
    if (this.kind === 'civil' || (this.kind === 'police' && this.state === 'drive')) {
      if (this.dir > 0 && this.x > END) { this.x = -END - 1; this.sync(0); }
      else if (this.dir < 0 && this.x < -END) { this.x = END + 1; this.sync(0); }
    }
  }

  unload(dt) {
    if (this.copsToSpawn <= 0) return;
    const g = this.game;
    this.unloadT -= dt;
    if (this.unloadT > 0) return;
    this.unloadT = 0.85;
    const side = this.z > 0 ? 1 : -1;
    const off = (this.copsToSpawn > 1 ? (this.copsSpawned === 0 ? -1 : 1) : 0) * 1.05;
    const from = new THREE.Vector3(this.x + off, 0.15, this.z);
    const exitTo = new THREE.Vector3(this.x + off, 0, this.z + side * 2.3);
    const cop = new Npc(g, { role: 'cop', pos: from.clone(), yaw: side > 0 ? 0 : Math.PI });
    cop.car = this;
    cop.exitFrom = from;
    cop.exitTo = exitTo;
    cop.exitDur = 0.55;
    cop.exiting = 0.55;
    cop.pos.copy(from);
    cop.char.root.position.copy(from);
    g.npcs.push(cop);
    this.cops.push(cop);
    this.copsSpawned++;
    this.copsToSpawn--;
  }

  dispose() {
    this.dead = true;
    this.game.scene.remove(this.group);
    for (const c of this.cops) {
      this.game.scene.remove(c.char.root);
      const i = this.game.npcs.indexOf(c);
      if (i >= 0) this.game.npcs.splice(i, 1);
    }
    this.cops.length = 0;
  }
}

export class Traffic {
  constructor(game) {
    this.game = game;
    this.cars = [];
    this.backupCd = 4;
    this.patrolCd = 0;
    this.t = 0;
  }

  start() {
    // гражданский поток
    [[-72, 1], [-14, 1], [40, -1], [82, -1]].forEach(([x, dir]) => {
      this.cars.push(new Car(this, { kind: 'civil', dir, x }));
    });
    // патрульные экипажи катаются по городу
    this.patrol(1);
    this.patrol(-1);
  }

  patrol(dir) {
    const x = dir > 0 ? -END - 20 - Math.random() * 30 : END + 20 + Math.random() * 30;
    const car = new Car(this, { kind: 'police', dir, x, maxSpeed: 12, z: dir > 0 ? LANE : -LANE });
    this.cars.push(car);
    return car;
  }

  get wanted() {
    const g = this.game;
    return g.player.stars > 0 || (g.remoteStars || 0) > 0;
  }

  get responses() {
    return this.cars.filter((c) => c.state === 'respond' || c.state === 'parked');
  }

  /* выслать наряд: машина приедет с края города за несколько секунд */
  dispatch(n = 2, quiet = false) {
    const g = this.game;
    const p = g.player.pos;
    if (this.responses.length >= 2) return null;
    const lane = p.z > 0 ? LANE : -LANE;
    const dir = lane > 0 ? 1 : -1;
    const x = dir > 0 ? -END - 4 - Math.random() * 10 : END + 4 + Math.random() * 10;
    const stopX = clamp(p.x - dir * 3.6, -END + 8, END - 8);
    const car = new Car(this, { kind: 'police', dir, z: lane, x, stopX, maxSpeed: 18 });
    car.state = 'respond';
    car.siren = true;
    car.speed = 16;
    car.copsToSpawn = n;
    this.cars.push(car);
    if (!quiet) {
      const secs = Math.max(2, Math.round(Math.abs(stopX - x) / 15));
      g.ui.log(`🚔 Выехал наряд — будет через ~${secs} с`);
    }
    this.backupCd = 22;
    this._sirenOn = true;
    g.sound?.siren?.(true);
    return car;
  }

  update(dt) {
    const g = this.game;
    this.t += dt;

    // патруль всегда есть на дороге
    const patrols = this.cars.filter((c) => c.kind === 'police' && c.state === 'drive');
    if (patrols.length < 2) {
      this.patrolCd -= dt;
      if (this.patrolCd <= 0) { this.patrolCd = 9; this.patrol(patrols.length === 0 ? 1 : -1); }
    }

    // патрульная машина, проезжающая мимо разыскиваемого, включается в погоню
    if (this.wanted && this.responses.length < 2) {
      for (const c of this.cars) {
        if (c.kind !== 'police' || c.state !== 'drive') continue;
        if (Math.abs(c.x - g.player.pos.x) < 13 && Math.abs(c.z - g.player.pos.z) < 10) {
          c.state = 'respond';
          c.siren = true;
          c.maxSpeed = 11;
          c.stopX = c.x + c.dir * 3.6;
          c.copsToSpawn = 2;
          c.copsSpawned = 0;
          g.ui.log('🚔 Патруль заметил тебя и тормозит');
          break;
        }
      }
    }

    // розыск снят — наряды уезжают
    if (!this.wanted) {
      let any = false;
      for (const c of this.cars) {
        if (c.state === 'respond') { c.state = 'leave'; c.siren = false; c.copsToSpawn = 0; }
        if (c.state === 'parked' || c.state === 'leave') any = true;
      }
      if (!any && this._sirenOn) { this._sirenOn = false; g.sound?.siren?.(false); }
    } else {
      this.backupCd -= dt;
      const cops = g.npcs.filter((n) => n.role === 'cop' && !n.inactive && !n.dead).length;
      if (this.backupCd <= 0 && this.responses.length < 2 && cops < 5) this.dispatch(2);
    }

    for (const c of this.cars) c.update(dt);
    if (this.cars.some((c) => c.dead)) this.cars = this.cars.filter((c) => !c.dead);
  }

  /* ближайший наряд (для UI/звука) */
  nearestResponse(pos) {
    let best = null, bd = 1e9;
    for (const c of this.responses) {
      const d = distXZ(c.pos, pos);
      if (d < bd) { bd = d; best = c; }
    }
    return best;
  }

  dispose() {
    for (const c of this.cars) c.dispose();
    this.cars.length = 0;
  }
}
