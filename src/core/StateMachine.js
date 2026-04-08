const DEFAULT_STATE = 'title';

const TRANSITIONS = {
  title: ['play'],
  play: ['pause', 'gameover', 'win'],
  pause: ['play'],
  gameover: ['play', 'title'],
  win: ['play', 'title'],
};

export class StateMachine {
  constructor(events, initial = DEFAULT_STATE) {
    this._events = events;
    this._state = initial;
    this._transitions = TRANSITIONS;
  }

  get current() {
    return this._state;
  }

  is(state) {
    return this._state === state;
  }

  can(to) {
    const allowed = this._transitions[this._state];
    return Array.isArray(allowed) && allowed.includes(to);
  }

  go(to) {
    if (!this.can(to)) {
      this._warnInvalidTransition(this._state, to);
      return false;
    }

    return this._setState(to);
  }

  reset(state = DEFAULT_STATE) {
    if (!this._transitions[state]) {
      this._warnUnknownState(state);
      return false;
    }

    return this._setState(state);
  }

  _setState(nextState) {
    const prevState = this._state;
    this._state = nextState;

    this._events.emit('state:change', {
      from: prevState,
      to: nextState,
    });

    return true;
  }

  _warnInvalidTransition(from, to) {
    if (__DEV__) {
      console.warn(`[StateMachine] Invalid transition: ${from} → ${to}`);
    }
  }

  _warnUnknownState(state) {
    if (__DEV__) {
      console.warn(`[StateMachine] Unknown state: ${state}`);
    }
  }
}
