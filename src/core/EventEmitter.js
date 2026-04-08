export class EventEmitter {
  constructor() {
    this._listeners = new Map();
  }

  on(event, fn) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event).add(fn);

    return () => this.off(event, fn);
  }

  once(event, fn) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      fn(...args);
    };
    return this.on(event, wrapper);
  }

  off(event, fn) {
    const set = this._listeners.get(event);
    if (set) {
      set.delete(fn);
      if (set.size === 0) {
        this._listeners.delete(event);
      }
    }
  }

  emit(event, data) {
    const set = this._listeners.get(event);
    if (set) {
      for (const fn of set) {
        fn(data);
      }
    }
  }

  clear() {
    this._listeners.clear();
  }
}
