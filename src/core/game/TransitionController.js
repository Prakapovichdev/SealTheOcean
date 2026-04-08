import { easeInOutCubic } from '../../utils/math.js';

import { createTransitionState } from './createTransitionState.js';

const DIVE_DURATION = 420;
const POPUP_DURATION = 320;
const MAX_STEP_MS = 32;

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

export class TransitionController {
  constructor(initialState = createTransitionState()) {
    this._state = initialState;
  }

  get current() {
    return this._state;
  }

  get isActive() {
    return this._state.phase !== 'idle';
  }

  start({ title, sub, btn, icon, onConfirm }) {
    Object.assign(this._state, createTransitionState(), {
      phase: 'dive',
      title,
      sub,
      btn,
      icon,
      onConfirm,
    });
  }

  update(elapsed) {
    const step = Math.min(elapsed, MAX_STEP_MS);

    if (this._state.phase === 'idle' || this._state.phase === 'done') {
      return;
    }

    if (this._state.phase === 'dive') {
      this._state.t = Math.min(1, this._state.t + step / DIVE_DURATION);

      const eased = easeInOutCubic(this._state.t);
      this._state.diveY = eased * 24;
      this._state.overlay = eased * 0.66;

      if (this._state.t >= 1) {
        this._state.phase = 'popup';
        this._state.t = 0;
        this._state.popAlpha = 0;
        this._state.popY = 12;
        this._state.contentAlpha = 0;
        this._state.contentY = 8;
        this._state.buttonAlpha = 0;
        this._state.buttonY = 10;
      }

      return;
    }

    if (this._state.phase === 'popup') {
      this._state.t = Math.min(1, this._state.t + step / POPUP_DURATION);

      const base = easeOutCubic(this._state.t);

      this._state.popAlpha = base;
      this._state.popY = Math.round((1 - base) * 12);
      this._state.popScale = 1;
      this._state.ripple = 0;

      const contentProgress = easeOutCubic(clamp01((this._state.t - 0.08) / 0.42));
      this._state.contentAlpha = contentProgress;
      this._state.contentY = Math.round((1 - contentProgress) * 8);

      const buttonProgress = easeOutCubic(clamp01((this._state.t - 0.26) / 0.42));
      this._state.buttonAlpha = buttonProgress;
      this._state.buttonY = Math.round((1 - buttonProgress) * 10);

      if (this._state.t >= 1) {
        this._state.phase = 'done';
      }
    }
  }

  tryConfirm() {
    if (this._state.phase !== 'done') {
      return false;
    }

    const onConfirm = this._state.onConfirm;
    this.reset();
    onConfirm?.();

    return true;
  }

  reset() {
    Object.assign(this._state, createTransitionState());
  }
}
