import { Game } from './game.js';
import { UI } from './ui.js';
import { Net } from './net.js';
import { rawClear } from './inventory.js';

const canvas = document.getElementById('c');
const ui = new UI();
const net = new Net();
const game = new Game(canvas, ui, net);

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function webglProblem() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    return gl ? null : 'WebGL не поддерживается';
  } catch (e) { return String(e); }
}

async function boot() {
  try {
    const glIssue = webglProblem();
    if (glIssue) {
      document.getElementById('bootTxt').innerHTML = 'Не удалось запустить 3D.<br>Обнови «Android System WebView» (или Chrome) в Play Маркете и открой игру снова.';
      return;
    }
    ui.setLoading(8, 'Инициализация движка…');
    await delay(60);
    await game.init();
    ui.setLoading(55, 'Строим город: банк, магазин, улицы…');
    await delay(120);
    ui.setLoading(82, 'Расставляем жителей…');
    await delay(160);
    ui.setLoading(100, 'Готово');
    await delay(260);
    ui.showMenu();
    wireMenu();
  } catch (e) {
    console.error(e);
    const t = document.getElementById('bootTxt');
    if (t) t.innerHTML = 'Ошибка запуска: ' + (e?.message || e) + '<br>Попробуй обновить Android System WebView.';
  }
}

/* ---------------- menu ---------------- */
function wireMenu() {
  document.querySelectorAll('#menu [data-act]').forEach((b) => {
    b.onclick = () => {
      const a = b.dataset.act;
      game.sound.init(); game.sound.resume();
      if (a === 'play') playGame();
      else if (a === 'controls') ui.showModal({ title: 'УПРАВЛЕНИЕ', sub: 'ПК и телефон', body: ui.controlsHTML(), foot: closeBtn('ПОНЯТНО') });
      else if (a === 'about') ui.showModal({ title: 'ОБ ИГРЕ', sub: 'DENI ISLAM · криминальная песочница на двоих', body: ui.aboutHTML(), foot: closeBtn('ЗАКРЫТЬ') });
      else if (a === 'reset') {
        if (confirm('Сбросить сохранение? Деньги, вещи в шкафах и прогресс пропадут.')) {
          rawClear();
          ui.toast('Сохранение сброшено', '');
        }
      }
    };
  });
}

function closeBtn(label) {
  const b = document.createElement('button');
  b.className = 'btn';
  b.textContent = label;
  b.onclick = () => ui.hideModal();
  return b;
}

let playing = false;
async function playGame() {
  if (playing) return;
  playing = true;
  const playBtn = document.querySelector('#menu [data-act="play"]');
  if (playBtn) { playBtn.disabled = true; playBtn.classList.add('loading'); }
  ui.toast('Запрос доступа к микрофону…', '');
  await net.enableVoice();       // asks permission every match, as requested
  ui.toast('Подключение к серверу DENI-ISLAM #1…', '');
  const role = await net.connect();
  const isHost = role !== 'client';
  ui.hideMenu();
  game.startMatch({
    isHost,
    skin: isHost ? 'gentleman' : 'gopnik',
    name: isHost ? 'ДЖЕНТЕЛЬМЕН' : 'ГОПНИК',
  });
  ui.toast(isHost ? 'Ты — Джентельмен. Ждём второго игрока.' : 'Ты — Гопник. Напарник уже тут.', 'good');
}

/* ---------------- global actions ---------------- */
ui.onAction = (a) => {
  if (a === 'pause:toggle') {
    if (game.state !== 'play' && game.state !== 'dead') return;
    if (game.pauseOpen) { game.pauseOpen = false; ui.hidePause(); }
    else game.openPause();
    return;
  }
  if (a.startsWith('slot:')) {
    game.selectSlot(parseInt(a.slice(5), 10));
    return;
  }
  if (a.startsWith('slotwheel:')) {
    const dir = parseInt(a.slice(10), 10);
    let s = game.player.selected;
    for (let i = 0; i < 6; i++) {
      s = (s + dir + 6) % 6;
      if (s === 0 || game.player.hotbar[s]) break;
    }
    game.selectSlot(s);
    return;
  }
  if (a.startsWith('pause:')) {
    const cmd = a.slice(6);
    if (cmd === 'resume') { game.pauseOpen = false; ui.hidePause(); }
    if (cmd === 'controls') ui.showModal({ title: 'УПРАВЛЕНИЕ', sub: 'ПК и телефон', body: ui.controlsHTML(), foot: closeBtn('ПОНЯТНО') });
    if (cmd === 'save') { game.saveGame(); ui.toast('Сохранено', 'good'); }
    if (cmd === 'exit') { game.exitToMenu(); }
  }
};

/* ---------------- wiring ---------------- */
document.getElementById('btnPause').onclick = () => { game.openPause(); };
document.getElementById('modalClose').onclick = () => { ui.hideModal(); };
document.getElementById('btnInv').onclick = () => { game.openInventory(); };
document.getElementById('modal').addEventListener('click', (e) => { if (e.target.id === 'modal') ui.hideModal(); });

ui.bindDesktop(canvas, () => {});
canvas.addEventListener('click', () => { game.sound.init(); game.sound.resume(); });

window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyE' && ui.modalOpen) return;
  if (e.code === 'Escape' && ui.modalOpen) { ui.hideModal(); }
});
addEventListener('contextmenu', (e) => e.preventDefault());
addEventListener('beforeunload', () => { try { game.saveGame(); } catch (e) {} });

boot();
