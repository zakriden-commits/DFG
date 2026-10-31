/* Tiny procedural sound system — no audio assets, all synthesized */
export class Sound {
  constructor() {
    this.ctx = null;
    this.ok = false;
    this.sirenNodes = null;
    this.muted = false;
  }
  init() {
    if (this.ctx) { this.ctx.resume?.(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.55;
      this.master.connect(this.ctx.destination);
      const len = Math.floor(this.ctx.sampleRate * 1.2);
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      this.noiseBuf = buf;
      this.ok = true;
    } catch (e) { this.ok = false; }
  }
  resume() { this.ctx?.resume?.(); }
  _noise(dur = 0.15, freq = 1200, q = 1, gain = 0.5, type = 'lowpass') {
    if (!this.ok) return;
    const c = this.ctx, t = c.currentTime;
    const src = c.createBufferSource();
    src.buffer = this.noiseBuf;
    const f = c.createBiquadFilter();
    f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = c.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f); f.connect(g); g.connect(this.master);
    src.start(t); src.stop(t + dur + 0.02);
  }
  _tone(freq, dur = 0.12, type = 'sine', gain = 0.25, slideTo = null) {
    if (!this.ok) return;
    const c = this.ctx, t = c.currentTime;
    const o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(this.master);
    o.start(t); o.stop(t + dur + 0.02);
  }
  shot(kind = 'pistol') {
    if (!this.ok) return;
    if (kind === 'shotgun') { this._noise(0.24, 900, 0.8, 0.85); this._tone(90, 0.18, 'square', 0.3, 40); }
    else if (kind === 'rifle') { this._noise(0.11, 1800, 1.2, 0.6); this._tone(140, 0.09, 'square', 0.22, 60); }
    else { this._noise(0.13, 1500, 1.0, 0.55); this._tone(150, 0.1, 'square', 0.22, 70); }
  }
  punch() { this._noise(0.1, 420, 1.4, 0.35); }
  hit() { this._noise(0.09, 260, 1.6, 0.4); this._tone(70, 0.08, 'sine', 0.18); }
  cash() { this._tone(1250, 0.07, 'square', 0.12); setTimeout(() => this._tone(1680, 0.09, 'square', 0.1), 65); }
  ui() { this._tone(600, 0.05, 'triangle', 0.12); }
  error() { this._tone(180, 0.16, 'sawtooth', 0.16, 120); }
  door() { this._noise(0.22, 320, 0.9, 0.25); }
  reload() { this._noise(0.07, 900, 1.5, 0.25); setTimeout(() => this._noise(0.09, 700, 1.2, 0.3), 160); }
  pickup() { this._tone(880, 0.07, 'triangle', 0.16, 1320); }
  siren(on) {
    if (!this.ok) return;
    if (on && !this.sirenNodes) {
      const c = this.ctx;
      const o1 = c.createOscillator(); o1.type = 'sine'; o1.frequency.value = 620;
      const lfo = c.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.42;
      const lg = c.createGain(); lg.gain.value = 190;
      lfo.connect(lg); lg.connect(o1.frequency);
      const g = c.createGain(); g.gain.value = 0.10;
      o1.connect(g); g.connect(this.master);
      o1.start(); lfo.start();
      this.sirenNodes = { o1, lfo, g };
    } else if (!on && this.sirenNodes) {
      const { o1, lfo, g } = this.sirenNodes;
      try { g.gain.value = 0; o1.stop(); lfo.stop(); } catch (e) {}
      this.sirenNodes = null;
    }
  }
}
