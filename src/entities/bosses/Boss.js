export class Boss {
  constructor(gameState, events) {
    this._gs = gameState;
    this._events = events;
  }

  init() {
    throw new Error('Boss.init() must be overridden');
  }

  update(_dt) {
    throw new Error('Boss.update() must be overridden');
  }

  draw(_ctx) {
    throw new Error('Boss.draw() must be overridden');
  }
}
