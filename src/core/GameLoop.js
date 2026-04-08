const FRAME_MS = 1000 / 60;
const MAX_DT = 3;

export class GameLoop {
  constructor(events, { onUpdate, onDraw }) {
    this._events = events;
    this._onUpdate = onUpdate;
    this._onDraw = onDraw;

    this._lastTs = 0;
    this._rafId = null;
    this._running = false;

    this._tick = this._tick.bind(this);
    this._onVisibility = this._onVisibilityChange.bind(this);

    document.addEventListener('visibilitychange', this._onVisibility);
  }

  get running() {
    return this._running;
  }

  start() {
    if (this._running) return;

    this._running = true;
    this._lastTs = performance.now();
    this._scheduleNextFrame();
  }

  stop() {
    if (!this._running && this._rafId === null) return;

    this._running = false;

    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  _tick(timestamp) {
    if (!this._running) return;

    const elapsed = timestamp - this._lastTs;
    const dt = Math.min(elapsed / FRAME_MS, MAX_DT);

    this._lastTs = timestamp;

    this._onUpdate(dt, elapsed);
    this._onDraw();

    this._scheduleNextFrame();
  }

  _scheduleNextFrame() {
    this._rafId = requestAnimationFrame(this._tick);
  }

  _onVisibilityChange() {
    if (!document.hidden) {
      this._lastTs = performance.now();
      return;
    }

    this._events.emit('game:autopause');
  }

  destroy() {
    this.stop();
    document.removeEventListener('visibilitychange', this._onVisibility);
  }
}
