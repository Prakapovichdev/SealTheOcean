const BLOCK_HIT_MIN_INTERVAL_MS = 25;
const MASTER_VOLUME = 0.9;

const SOUND_PRESETS = {
  hitBlock: [
    {
      type: 'square',
      freq: 520,
      endFreq: 1200,
      duration: 0.1,
      gain: 0.15,
      freqRamp: 'exp',
      gainRamp: 'exp',
    },
  ],

  hitPaddle: [
    {
      type: 'sine',
      freq: 280,
      endFreq: 180,
      duration: 0.12,
      gain: 0.12,
      freqRamp: 'exp',
      gainRamp: 'exp',
    },
  ],

  ballLost: [
    {
      type: 'sine',
      freq: 440,
      endFreq: 110,
      duration: 0.4,
      gain: 0.15,
      freqRamp: 'exp',
      gainRamp: 'linear',
      gainEnd: 0,
    },
  ],

  bonusPickup: [
    { type: 'sine', freq: 660, duration: 0.1, gain: 0.1, start: 0.0, gainRamp: 'exp' },
    { type: 'sine', freq: 880, duration: 0.1, gain: 0.1, start: 0.06, gainRamp: 'exp' },
    { type: 'sine', freq: 1100, duration: 0.1, gain: 0.1, start: 0.12, gainRamp: 'exp' },
  ],

  levelWin: [
    {
      type: 'triangle',
      freq: 523,
      duration: 0.5,
      gain: 0.12,
      start: 0.0,
      gainRamp: 'linear',
      gainEnd: 0,
    },
    {
      type: 'triangle',
      freq: 659,
      duration: 0.5,
      gain: 0.12,
      start: 0.12,
      gainRamp: 'linear',
      gainEnd: 0,
    },
    {
      type: 'triangle',
      freq: 784,
      duration: 0.5,
      gain: 0.12,
      start: 0.24,
      gainRamp: 'linear',
      gainEnd: 0,
    },
  ],

  finalWin: [
    {
      type: 'triangle',
      freq: 523,
      duration: 0.7,
      gain: 0.14,
      start: 0.0,
      gainRamp: 'linear',
      gainEnd: 0,
    },
    {
      type: 'triangle',
      freq: 659,
      duration: 0.7,
      gain: 0.14,
      start: 0.15,
      gainRamp: 'linear',
      gainEnd: 0,
    },
    {
      type: 'triangle',
      freq: 784,
      duration: 0.7,
      gain: 0.14,
      start: 0.3,
      gainRamp: 'linear',
      gainEnd: 0,
    },
    {
      type: 'triangle',
      freq: 1047,
      duration: 0.7,
      gain: 0.14,
      start: 0.45,
      gainRamp: 'linear',
      gainEnd: 0,
    },
  ],

  whaleHit: [
    {
      type: 'sine',
      freq: 180,
      endFreq: 80,
      duration: 0.35,
      gain: 0.18,
      freqRamp: 'exp',
      gainRamp: 'linear',
      gainEnd: 0,
    },
  ],

  whaleFreed: [
    { type: 'sine', freq: 440, duration: 0.4, gain: 0.1, start: 0.0, gainRamp: 'exp' },
    { type: 'sine', freq: 554, duration: 0.4, gain: 0.1, start: 0.1, gainRamp: 'exp' },
    { type: 'sine', freq: 659, duration: 0.4, gain: 0.1, start: 0.2, gainRamp: 'exp' },
    { type: 'sine', freq: 880, duration: 0.4, gain: 0.1, start: 0.3, gainRamp: 'exp' },
    { type: 'sine', freq: 1047, duration: 0.4, gain: 0.1, start: 0.4, gainRamp: 'exp' },
    { type: 'sine', freq: 1319, duration: 0.4, gain: 0.1, start: 0.5, gainRamp: 'exp' },
  ],
};

export class AudioSystem {
  constructor(events, gameState) {
    this._events = events;
    this._gs = gameState;

    this._ctx = null;
    this._masterGain = null;
    this._lastBlockHitAt = 0;

    this._subscribe();
  }

  _subscribe() {
    this._events.on('input:tap', () => this._unlock());
    this._events.on('input:pause', () => this._unlock());
    this._events.on('input:sound', () => this._unlock());

    this._events.on('ball:hit-block', () => this._playHitBlock());
    this._events.on('ball:hit-paddle', () => this._playPreset('hitPaddle'));
    this._events.on('ball:lost', () => this._playPreset('ballLost'));
    this._events.on('bonus:pickup', () => this._playPreset('bonusPickup'));
    this._events.on('level:complete', () => this._playPreset('levelWin'));
    this._events.on('game:win', () => this._playPreset('finalWin'));
    this._events.on('whale:hit', () => this._playPreset('whaleHit'));
    this._events.on('whale:freed', () => this._playPreset('whaleFreed'));
  }

  _ensureCtx() {
    if (this._ctx) {
      return this._ctx;
    }

    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const masterGain = ctx.createGain();

      masterGain.gain.value = MASTER_VOLUME;
      masterGain.connect(ctx.destination);

      this._ctx = ctx;
      this._masterGain = masterGain;

      return ctx;
    } catch (_error) {
      return null;
    }
  }

  _unlock() {
    const ctx = this._ensureCtx();
    if (!ctx || ctx.state !== 'suspended') {
      return;
    }

    ctx.resume().catch(() => {});
  }

  _getPlayableCtx() {
    if (!this._gs.soundOn) {
      return null;
    }

    const ctx = this._ensureCtx();
    if (!ctx || !this._masterGain) {
      return null;
    }

    if (ctx.state !== 'running') {
      return null;
    }

    return ctx;
  }

  _playHitBlock() {
    const now = performance.now();
    if (now - this._lastBlockHitAt < BLOCK_HIT_MIN_INTERVAL_MS) {
      return;
    }

    this._lastBlockHitAt = now;
    this._playPreset('hitBlock');
  }

  _playPreset(name) {
    const notes = SOUND_PRESETS[name];
    if (!notes || notes.length === 0) {
      return;
    }

    const ctx = this._getPlayableCtx();
    if (!ctx) {
      return;
    }

    const startTime = ctx.currentTime;

    for (const note of notes) {
      this._scheduleNote(ctx, startTime, note);
    }
  }

  _scheduleNote(ctx, baseTime, note) {
    const start = baseTime + (note.start ?? 0);
    const end = start + note.duration;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = note.type ?? 'sine';
    osc.frequency.setValueAtTime(note.freq, start);

    if (note.endFreq) {
      if (note.freqRamp === 'linear') {
        osc.frequency.linearRampToValueAtTime(note.endFreq, end);
      } else {
        osc.frequency.exponentialRampToValueAtTime(Math.max(1, note.endFreq), end);
      }
    }

    gain.gain.setValueAtTime(note.gain ?? 0.1, start);

    if (note.gainRamp === 'linear') {
      gain.gain.linearRampToValueAtTime(note.gainEnd ?? 0, end);
    } else {
      gain.gain.exponentialRampToValueAtTime(Math.max(0.001, note.gainEnd ?? 0.001), end);
    }

    osc.connect(gain);
    gain.connect(this._masterGain);

    osc.start(start);
    osc.stop(end);
  }

  destroy() {
    if (!this._ctx) {
      return;
    }

    const ctx = this._ctx;
    this._ctx = null;
    this._masterGain = null;

    ctx.close().catch(() => {});
  }
}
