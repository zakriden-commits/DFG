import Peer from 'peerjs';

export const ROOM_ID = 'deniislam-city-room-1';
const PEER_OPTS = {
  debug: 0,
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:global.stun.twilio.com:3478' },
      { urls: 'turn:openrelay.metered.ca:80', username: 'openrelayproject', credential: 'openrelayproject' },
      { urls: 'turn:openrelay.metered.ca:443', username: 'openrelayproject', credential: 'openrelayproject' },
    ],
  },
};

export class Net {
  constructor() {
    this.peer = null;
    this.conn = null;
    this.role = 'solo';       // host | client | solo
    this.connected = false;
    this.handlers = new Map();
    this.micStream = null;
    this.voiceOn = false;
    this.remoteAudio = null;
    this.call = null;
    this.lastSent = 0;
    this.pending = [];
  }

  on(ev, fn) {
    if (!this.handlers.has(ev)) this.handlers.set(ev, []);
    this.handlers.get(ev).push(fn);
    return this;
  }
  emit(ev, data) {
    (this.handlers.get(ev) || []).forEach((f) => { try { f(data); } catch (e) { console.warn(e); } });
  }

  status(text, kind = 'info') { this.emit('status', { text, kind }); }

  /* Auto-matchmaking: 1 server room, 2 players. First client becomes host. */
  async connect() {
    this.status('Подключение к серверу…');
    const tryHost = () => new Promise((resolve) => {
      let done = false;
      const p = new Peer(ROOM_ID, PEER_OPTS);
      const t = setTimeout(() => { if (!done) { done = true; try { p.destroy(); } catch (e) {} resolve(null); } }, 9000);
      p.on('open', () => {
        if (done) return;
        done = true; clearTimeout(t);
        resolve(p);
      });
      p.on('error', (err) => {
        if (done) return;
        done = true; clearTimeout(t);
        try { p.destroy(); } catch (e) {}
        resolve({ error: err?.type || 'error' });
      });
    });

    let peer = await tryHost();
    if (peer && !peer.error) {
      this.peer = peer;
      this.role = 'host';
      this.status('Онлайн · вы ХОЗЯИН комнаты · ждём 2-го игрока', 'ok');
      peer.on('connection', (c) => this._attach(c));
      peer.on('error', (e) => this._onError(e));
      this.emit('role', this.role);
      return this.role;
    }

    // somebody already hosts -> join
    this.status('Комната занята · заходим как игрок 2…');
    peer = await new Promise((resolve) => {
      let done = false;
      const p = new Peer(undefined, PEER_OPTS);
      const t = setTimeout(() => { if (!done) { done = true; try { p.destroy(); } catch (e) {} resolve(null); } }, 10000);
      p.on('open', () => { if (!done) { done = true; clearTimeout(t); resolve(p); } });
      p.on('error', (e) => { if (!done) { done = true; clearTimeout(t); resolve(null); } });
    });

    if (!peer) {
      this.role = 'solo';
      this.status('Сервер недоступен · одиночный режим', 'warn');
      this.emit('role', 'solo');
      return 'solo';
    }
    this.peer = peer;
    this.role = 'client';
    peer.on('error', (e) => this._onError(e));
    this.emit('role', 'client');
    this.status('Подключение к комнате…');

    const c = peer.connect(ROOM_ID, { reliable: true, serialization: 'json' });
    this._attach(c);
    return this.role;
  }

  _attach(conn) {
    this.conn = conn;
    conn.on('open', () => {
      this.connected = true;
      this.status('В сети · 2 игрока · голосовой чат активен', 'ok');
      this.emit('open');
      this.pending.forEach((m) => this.send(m));
      this.pending = [];
    });
    conn.on('data', (d) => this.emit('msg', d));
    conn.on('close', () => {
      this.connected = false;
      this.status('Игрок 2 отключился · вы в одиночку', 'warn');
      this.emit('close');
    });
    conn.on('error', (e) => console.warn('conn error', e));
  }

  _onError(e) {
    const t = e?.type || 'error';
    if (t === 'peer-unavailable') { this.status('Игрок 2 не найден · одиночный режим', 'warn'); this.emit('close'); }
    else if (t === 'network' || t === 'server-error' || t === 'socket-error') { this.status('Нет связи с сервером · одиночный режим', 'warn'); }
  }

  get remoteId() { return this.conn?.peer || null; }

  send(obj) {
    if (this.conn && this.conn.open) {
      try { this.conn.send(obj); } catch (e) { /* ignore */ }
    } else if (obj?.t !== 's') {
      this.pending.push(obj);
      if (this.pending.length > 40) this.pending.shift();
    }
  }

  /* ---------- voice ---------- */
  async enableVoice() {
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('no getUserMedia');
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: false,
      });
      this.voiceOn = true;
      this.emit('mic', { ok: true });
      this._tryCall();
      return true;
    } catch (e) {
      this.voiceOn = false;
      this.emit('mic', { ok: false, error: e?.message || 'denied' });
      return false;
    }
  }

  _tryCall() {
    if (!this.peer || !this.voiceOn || !this.conn) return;
    const rid = this.remoteId;
    if (!rid) return;
    try {
      if (this.call && this.call.open) return;
      const call = this.peer.call(rid, this.micStream);
      call.on('stream', (stream) => this._playRemote(stream));
      call.on('error', () => {});
      call.on('close', () => {});
      this.call = call;
    } catch (e) { /* ignore */ }
    if (!this._incomingHooked) {
      this._incomingHooked = true;
      this.peer.on('call', (c) => {
        try {
          c.answer(this.micStream || undefined);
          c.on('stream', (stream) => this._playRemote(stream));
        } catch (e) {}
      });
    }
  }

  _playRemote(stream) {
    if (!this.remoteAudio) {
      this.remoteAudio = document.createElement('audio');
      this.remoteAudio.autoplay = true;
      this.remoteAudio.playsInline = true;
      this.remoteAudio.style.display = 'none';
      document.body.appendChild(this.remoteAudio);
    }
    this.remoteAudio.srcObject = stream;
    this.remoteAudio.play?.().catch(() => {});
    this.emit('voice-stream');
  }

  hangup() {
    try { this.call?.close(); } catch (e) {}
    try { this.micStream?.getTracks().forEach((t) => t.stop()); } catch (e) {}
    try { this.conn?.close(); } catch (e) {}
    try { this.peer?.destroy(); } catch (e) {}
  }
}
