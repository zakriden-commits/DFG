import { itemName, itemIcon, itemDesc, SLOTS } from './inventory.js';
import { AMMO_PRICES } from './models.js';

export const el = (tag, cls = '', html = '') => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html) n.innerHTML = html;
  return n;
};
const $ = (id) => document.getElementById(id);

export const isTouch = () => window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

export class UI {
  constructor() {
    this.onAction = () => {};
    this.input = {
      moveX: 0, moveY: 0, lookX: 0, lookY: 0,
      fire: false, aim: false, run: false,
      jump: false, act: false, reload: false, inv: false,
    };
    this._actEdge = false;
    this._reloadEdge = false;
    this._jumpEdge = false;
    this._invEdge = false;
    this.keys = new Set();
    this.modalOpen = false;
    this.startTime = performance.now();
  }

  /* ---------------- boot / screens ---------------- */
  setLoading(pct, text) {
    const f = $('bootFill'); if (f) f.style.width = Math.min(100, pct) + '%';
    if (text) $('bootTxt').textContent = text;
  }
  showMenu() {
    $('boot').classList.add('hidden');
    $('menu').classList.remove('hidden');
    $('hud').classList.add('hidden');
    this.hideModal();
    $('pause').classList.add('hidden');
  }
  hideMenu() { $('menu').classList.add('hidden'); }
  showHUD() {
    $('hud').classList.remove('hidden');
    $('hintPC').style.display = isTouch() ? 'none' : 'block';
    $('touchLeft').style.display = isTouch() ? 'block' : 'none';
    $('touchRight').style.display = isTouch() ? 'block' : 'none';
    this.bindTouch();
  }
  hideHUD() { $('hud').classList.add('hidden'); }

  /* ---------------- hud ---------------- */
  setPlayer(name, avatarEmoji) {
    $('pName').textContent = name;
    $('avaIcon').textContent = avatarEmoji;
  }
  setStats({ hp, stamina, money, stars }) {
    if (hp !== undefined) {
      $('hpFill').style.width = Math.max(0, hp) + '%';
      $('hpTxt').textContent = Math.max(0, Math.round(hp));
    }
    if (stamina !== undefined) {
      $('stFill').style.width = Math.max(0, stamina) + '%';
      $('stTxt').textContent = Math.round(stamina);
    }
    if (money !== undefined) $('money').textContent = '$' + Math.floor(money).toLocaleString('ru-RU');
    if (stars !== undefined) {
      let s = '';
      for (let i = 0; i < 5; i++) s += i < stars ? '<b>★</b>' : '★';
      $('stars').innerHTML = s;
    }
  }
  setNet(text, ok = true) {
    const n = $('netStatus');
    n.innerHTML = `<i class="dot" style="background:${ok ? '#5ad25a' : '#c9a23a'};box-shadow:0 0 8px ${ok ? '#5ad25a' : '#c9a23a'}"></i> ${text}`;
  }
  setVoice(text, on = false) {
    const v = $('voiceStatus');
    v.textContent = (on ? '🎙 ' : '🔇 ') + text;
    v.style.color = on ? '#9adf9a' : '#8f8877';
  }
  setJob(text) {
    const j = $('jobLine');
    if (!text) j.classList.add('hidden');
    else { j.classList.remove('hidden'); j.innerHTML = text; }
  }
  setPrompt(html) {
    const p = $('prompt');
    if (!html) { p.classList.add('hidden'); return; }
    p.classList.remove('hidden');
    p.innerHTML = html;
  }
  setProgress(v, text) {
    const p = $('progress');
    if (v === null) { p.classList.add('hidden'); return; }
    p.classList.remove('hidden');
    $('progressFill').style.width = Math.max(0, Math.min(100, v * 100)) + '%';
    if (text) $('progressTxt').textContent = text;
  }
  setCrosshair(on) { $('crosshair').style.display = on ? 'block' : 'none'; }
  hitFlash() {
    const f = $('hitflash');
    f.style.opacity = '.85';
    clearTimeout(this._hf);
    this._hf = setTimeout(() => (f.style.opacity = '0'), 90);
  }
  log(msg) {
    const l = $('log');
    const d = el('div', '', msg);
    l.appendChild(d);
    while (l.children.length > 5) l.removeChild(l.firstChild);
    setTimeout(() => { d.style.opacity = '0'; d.style.transition = 'opacity .5s'; }, 3800);
    setTimeout(() => d.remove(), 4400);
  }
  toast(msg, kind = '') {
    const t = el('div', 'toast ' + kind, msg);
    $('toasts').appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .35s'; }, 2300);
    setTimeout(() => t.remove(), 2750);
  }

  /* ---------------- hotbar ---------------- */
  renderHotbar(hot, selected, onSelect) {
    const hb = $('hotbar');
    hb.innerHTML = '';
    for (let i = 0; i < SLOTS; i++) {
      const s = el('div', 'slot' + (selected === i ? ' sel' : '') + (i > 0 && !hot[i] ? ' empty' : ''));
      const it = i === 0 ? null : hot[i];
      s.innerHTML = `<span class="num">${i + 1}</span><span class="ico">${i === 0 ? '👊' : itemIcon(it)}</span>`;
      if (it && it.t === 'money' && it.qty > 1) s.innerHTML += `<span class="qty">×${it.qty}</span>`;
      if (it && it.t === 'weapon') s.innerHTML += `<span class="ammo">${it.mag}</span>`;
      if (it && it.t === 'bag') s.innerHTML += `<span class="ammo">💰</span>`;
      s.addEventListener('click', () => onSelect(i));
      hb.appendChild(s);
    }
  }

  /* ---------------- modal ---------------- */
  showModal({ title, sub, body, foot }) {
    this.modalOpen = true;
    $('modalTitle').textContent = title || '';
    $('modalSub').innerHTML = sub || '';
    const b = $('modalBody');
    b.innerHTML = '';
    if (typeof body === 'string') b.innerHTML = body;
    else if (body) b.appendChild(body);
    const f = $('modalFoot');
    f.innerHTML = '';
    if (foot) { (Array.isArray(foot) ? foot : [foot]).forEach((x) => f.appendChild(x)); }
    $('modal').classList.remove('hidden');
    $('hud').style.pointerEvents = 'auto';
  }
  hideModal() {
    this.modalOpen = false;
    $('modal').classList.add('hidden');
    $('hud').style.pointerEvents = 'none';
  }
  showPause() {
    $('pause').classList.remove('hidden');
    $('pause').querySelectorAll('[data-pause]').forEach((btn) => {
      btn.onclick = () => this.onAction('pause:' + btn.dataset.pause);
    });
  }
  hidePause() { $('pause').classList.add('hidden'); }

  /* ---------------- touch ---------------- */
  bindTouch() {
    if (this._touchBound) return;
    this._touchBound = true;

    const stick = $('stick'), knob = $('knob');
    let stickId = null, cx = 0, cy = 0;
    const setKnob = (dx, dy) => { knob.style.transform = `translate(${dx}px,${dy}px)`; };
    const moveStick = (x, y) => {
      const r = stick.clientWidth / 2;
      let dx = x - cx, dy = y - cy;
      const len = Math.hypot(dx, dy);
      const max = r * 0.72;
      if (len > max) { dx = dx / len * max; dy = dy / len * max; }
      setKnob(dx, dy);
      this.input.moveX = dx / max;
      this.input.moveY = dy / max;
    };
    const down = (e) => {
      const t = e.changedTouches ? e.changedTouches[0] : e;
      stickId = t.identifier ?? 'm';
      const r = stick.getBoundingClientRect();
      cx = r.left + r.width / 2; cy = r.top + r.height / 2;
      moveStick(t.clientX, t.clientY);
      e.preventDefault();
    };
    const move = (e) => {
      if (stickId === null) return;
      const list = e.changedTouches ? Array.from(e.changedTouches) : [e];
      const t = list.find((x) => (x.identifier ?? 'm') === stickId);
      if (!t) return;
      moveStick(t.clientX, t.clientY);
      e.preventDefault();
    };
    const up = (e) => {
      const list = e.changedTouches ? Array.from(e.changedTouches) : [e];
      const t = list.find((x) => (x.identifier ?? 'm') === stickId);
      if (!t && e.changedTouches) return;
      stickId = null;
      this.input.moveX = 0; this.input.moveY = 0;
      setKnob(0, 0);
    };
    stick.addEventListener('touchstart', down, { passive: false });
    stick.addEventListener('touchmove', move, { passive: false });
    stick.addEventListener('touchend', up);
    stick.addEventListener('touchcancel', up);
    stick.addEventListener('mousedown', down);
    window.addEventListener('mousemove', (e) => { if (stickId === 'm') move(e); });
    window.addEventListener('mouseup', (e) => { if (stickId === 'm') up(e); });

    /* buttons */
    const hold = (id, on, off) => {
      const b = $(id); if (!b) return;
      const start = (e) => { e.preventDefault(); e.stopPropagation(); b.classList.add('active'); on && on(); };
      const end = (e) => { e && e.stopPropagation(); b.classList.remove('active'); off && off(); };
      b.addEventListener('touchstart', start, { passive: false });
      b.addEventListener('touchend', end);
      b.addEventListener('touchcancel', end);
      b.addEventListener('mousedown', start);
      b.addEventListener('mouseup', end);
      b.addEventListener('mouseleave', end);
    };
    hold('btnFire', () => (this.input.fire = true), () => (this.input.fire = false));
    hold('btnRun', () => (this.input.run = true), () => (this.input.run = false));
    hold('btnAct', () => { this._actEdge = true; this.input.act = true; }, () => (this.input.act = false));
    hold('btnReload', () => { this._reloadEdge = true; }, () => {});
    hold('btnJump', () => { this._jumpEdge = true; }, () => {});
    hold('btnInv', () => { this._invEdge = true; }, () => {});

    /* look area: right half of screen */
    const c = document.getElementById('c');
    let lookId = null, lx = 0, ly = 0;
    c.addEventListener('touchstart', (e) => {
      if (this.modalOpen) return;
      for (const t of e.changedTouches) {
        if (t.clientX < window.innerWidth * 0.42) continue;
        lookId = t.identifier; lx = t.clientX; ly = t.clientY;
        break;
      }
    }, { passive: true });
    c.addEventListener('touchmove', (e) => {
      if (lookId === null) return;
      for (const t of e.changedTouches) {
        if (t.identifier !== lookId) continue;
        this.input.lookX += (t.clientX - lx) * 0.0055;
        this.input.lookY += (t.clientY - ly) * 0.0045;
        lx = t.clientX; ly = t.clientY;
      }
    }, { passive: true });
    const endLook = (e) => {
      for (const t of e.changedTouches) if (t.identifier === lookId) lookId = null;
    };
    c.addEventListener('touchend', endLook);
    c.addEventListener('touchcancel', endLook);
  }

  /* ---------------- desktop input ---------------- */
  bindDesktop(canvas, onLockChange) {
    const keyMap = { KeyW: 'w', KeyA: 'a', KeyS: 's', KeyD: 'd', KeyE: 'act', KeyR: 'reload', ShiftLeft: 'run', ShiftRight: 'run', KeyQ: 'inv', Tab: 'inv', Space: 'jump' };
    window.addEventListener('keydown', (e) => {
      if (this.modalOpen) return;
      if (e.repeat) { if (e.code === 'Tab') e.preventDefault(); return; }
      const k = keyMap[e.code];
      if (e.code === 'Tab') e.preventDefault();
      if (e.code.startsWith('Digit')) {
        const n = parseInt(e.code.slice(5), 10);
        if (n >= 1 && n <= 6) this.onAction('slot:' + (n - 1));
        return;
      }
      if (e.code === 'Escape') { this.onAction('pause:toggle'); return; }
      if (!k) return;
      if (k === 'act') this._actEdge = true;
      if (k === 'reload') this._reloadEdge = true;
      if (k === 'jump') this._jumpEdge = true;
      if (k === 'inv') this._invEdge = true;
      this.keys.add(k);
      if (k === 'run') this.input.run = true;
    });
    window.addEventListener('keyup', (e) => {
      const k = keyMap[e.code];
      if (!k) return;
      this.keys.delete(k);
      if (k === 'run') this.input.run = false;
    });
    canvas.addEventListener('mousedown', (e) => {
      if (this.modalOpen) return;
      if (document.pointerLockElement !== canvas) { canvas.requestPointerLock?.(); return; }
      if (e.button === 0) this.input.fire = true;
      if (e.button === 2) this.input.aim = true;
    });
    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.input.fire = false;
      if (e.button === 2) this.input.aim = false;
    });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement === canvas) {
        this.input.lookX += e.movementX * 0.0022;
        this.input.lookY += e.movementY * 0.0020;
      }
    });
    document.addEventListener('pointerlockchange', () => {
      onLockChange?.(document.pointerLockElement === canvas);
    });
    window.addEventListener('wheel', (e) => {
      if (this.modalOpen) return;
      this.onAction('slotwheel:' + Math.sign(e.deltaY));
    }, { passive: true });
  }

  keyboardMove() {
    const k = this.keys;
    let x = 0, y = 0;
    if (k.has('w')) y -= 1;
    if (k.has('s')) y += 1;
    if (k.has('a')) x -= 1;
    if (k.has('d')) x += 1;
    const l = Math.hypot(x, y) || 1;
    return { x: x / l, y: y / l, active: !!(x || y) };
  }

  consumeAct() { const v = this._actEdge; this._actEdge = false; return v; }
  consumeReload() { const v = this._reloadEdge; this._reloadEdge = false; return v; }
  consumeJump() { const v = this._jumpEdge; this._jumpEdge = false; return v; }
  consumeInv() { const v = this._invEdge; this._invEdge = false; return v; }
  consumeLook() {
    const l = { x: this.input.lookX, y: this.input.lookY };
    this.input.lookX = 0; this.input.lookY = 0;
    return l;
  }

  /* ---------------- static content ---------------- */
  controlsHTML() {
    return `
      <table class="ctrl-table">
        <tr><td>ПК · движение</td><td>W A S D</td></tr>
        <tr><td>ПК · обзор</td><td>Мышь (клик по экрану — захват)</td></tr>
        <tr><td>ПК · выстрел / удар</td><td>ЛКМ</td></tr>
        <tr><td>ПК · прицел</td><td>ПКМ</td></tr>
        <tr><td>ПК · действие</td><td>E (дверь, шкаф, взять деньги, купить, ящик)</td></tr>
        <tr><td>ПК · перезарядка</td><td>R</td></tr>
        <tr><td>ПК · бег</td><td>Shift (тратит стамину)</td></tr>
        <tr><td>ПК · инвентарь</td><td>Tab / Q</td></tr>
        <tr><td>ПК · слоты</td><td>1 … 6 или колесо мыши</td></tr>
        <tr><td>ПК · пауза</td><td>Esc</td></tr>
        <tr><td>Телефон · движение</td><td>Джойстик слева</td></tr>
        <tr><td>Телефон · обзор</td><td>Свайп по правой части экрана</td></tr>
        <tr><td>Телефон · кнопки</td><td>ОГОНЬ · ПЕРЕЗАРЯД · БЕГ · ДЕЙСТВИЕ</td></tr>
        <tr><td>Телефон · слоты</td><td>Нажми ячейку снизу</td></tr>
      </table>
      <div class="note">Стамина тратится на бег и удар. Перезарядка: кнопка/клавиша, если патронов нет — игра напомнит купить их в магазине оружия.</div>`;
  }

  aboutHTML() {
    return `
      <div class="note" style="font-size:12.5px;color:#d8d0bd;line-height:1.65">
      <b style="color:#ffd88a">DENI ISLAM</b> — суровый город, два героя и один банк.<br><br>
      Ты — <b>Джентельмен</b>: костюм, шляпа, стальные нервы. Напарник — <b>Гопник</b>: спортивки, кепка, сигарета,
      и он всегда готов на «дело». Вы просыпаетесь в одной комнате, на двух кроватях.<br><br>
      • <b>Улица</b> — подработки: подойди к грузовику на складе, тащи ящики, получай деньги. Разные прохожие иногда сами подходят с работой.<br>
      • <b>Магазин оружия</b> — пистолет, дробовик, автомат, нож, дубинка, патроны и сумка. Патроны дешёвые — не экономь.<br>
      • <b>Банк</b> — там много денег. Кассирша и охрана смотрят в оба: покажешь ствол — паника и тревога, приедет полиция.<br>
      • <b>Звёзды розыска</b> — от 1 до 5. Уйди с места преступления и спрячься (дом + закрытая дверь) — тебя постепенно забывают.<br>
      • <b>Смерть</b> — инвентарь пропадает. Деньги и ценные вещи храни в шкафах дома.<br>
      • <b>Онлайн</b> — одна комната на двоих, голосовой чат включается при входе в игру. Друг не получает урона от тебя.
      </div>`;
  }
}
