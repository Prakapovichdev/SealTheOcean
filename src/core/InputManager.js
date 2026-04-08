import { BW, BH, BTN_PAUSE, BTN_SOUND } from '../config/constants.js';
import { dist } from '../utils/math.js';

const KEYBOARD_POINTER_SPEED = 8;
const HUD_BUTTON_HIT_PADDING = 8;

export class InputManager {
  constructor(canvas, scaleManager, gameState, events) {
    this._canvas = canvas;
    this._scale = scaleManager;
    this._gs = gameState;
    this._events = events;

    this._keys = {
      left: false,
      right: false,
    };

    this._onMouseMove = this._handleMouseMove.bind(this);
    this._onTouchMove = this._handleTouchMove.bind(this);
    this._onTouchStart = this._handleTouchStart.bind(this);
    this._onClick = this._handleClick.bind(this);
    this._onKeyDown = this._handleKeyDown.bind(this);
    this._onKeyUp = this._handleKeyUp.bind(this);

    this._bindEvents();
  }

  update(dt) {
    if (this._keys.left) {
      this._gs.ptrX = clamp(this._gs.ptrX - KEYBOARD_POINTER_SPEED * dt, 0, BW);
    }

    if (this._keys.right) {
      this._gs.ptrX = clamp(this._gs.ptrX + KEYBOARD_POINTER_SPEED * dt, 0, BW);
    }
  }

  _bindEvents() {
    window.addEventListener('mousemove', this._onMouseMove);

    this._canvas.addEventListener('touchmove', this._onTouchMove, { passive: false });
    this._canvas.addEventListener('touchstart', this._onTouchStart, { passive: false });
    this._canvas.addEventListener('click', this._onClick);

    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
  }

  _handleMouseMove(event) {
    this._setPointerFromClient(event.clientX, event.clientY);
  }

  _handleClick(event) {
    const point = this._getLogicalPoint(event.clientX, event.clientY);
    this._setPointer(point.x, point.y);
    this._handlePointerDown(point.x, point.y);
  }

  _handleTouchMove(event) {
    event.preventDefault();

    const touch = event.touches[0];
    if (!touch) return;

    this._setPointerFromClient(touch.clientX, touch.clientY);
  }

  _handleTouchStart(event) {
    event.preventDefault();

    const touch = event.touches[0];
    if (!touch) return;

    const point = this._getLogicalPoint(touch.clientX, touch.clientY);
    this._setPointer(point.x, point.y);
    this._handlePointerDown(point.x, point.y);
  }

  _handleKeyDown(event) {
    if (this._isLeftKey(event.code)) {
      this._keys.left = true;
      event.preventDefault();
      return;
    }

    if (this._isRightKey(event.code)) {
      this._keys.right = true;
      event.preventDefault();
      return;
    }

    if (event.code === 'Space') {
      event.preventDefault();
      this._emitTap();
      return;
    }

    if (event.code === 'Escape' || event.code === 'KeyP') {
      event.preventDefault();
      this._events.emit('input:pause');
    }
  }

  _handleKeyUp(event) {
    if (this._isLeftKey(event.code)) {
      this._keys.left = false;
      return;
    }

    if (this._isRightKey(event.code)) {
      this._keys.right = false;
    }
  }

  _handlePointerDown(x, y) {
    if (this._isHudButtonHit(x, y, BTN_PAUSE)) {
      this._events.emit('input:pause');
      return;
    }

    if (this._isHudButtonHit(x, y, BTN_SOUND)) {
      this._events.emit('input:sound');
      return;
    }

    this._emitTap();
  }

  _setPointerFromClient(clientX, clientY) {
    const point = this._getLogicalPoint(clientX, clientY);
    this._setPointer(point.x, point.y);
  }

  _setPointer(x, y) {
    this._gs.ptrX = clamp(x, 0, BW);
    this._gs.ptrY = clamp(y, 0, BH);
  }

  _getLogicalPoint(clientX, clientY) {
    const rect = this._scale.rect;
    const scaleX = rect.width / BW;
    const scaleY = rect.height / BH;

    return {
      x: (clientX - rect.left) / scaleX,
      y: (clientY - rect.top) / scaleY,
    };
  }

  _isHudButtonHit(x, y, button) {
    return dist(x, y, button.x, button.y) < button.r + HUD_BUTTON_HIT_PADDING;
  }

  _isLeftKey(code) {
    return code === 'ArrowLeft' || code === 'KeyA';
  }

  _isRightKey(code) {
    return code === 'ArrowRight' || code === 'KeyD';
  }

  _emitTap() {
    this._events.emit('input:tap');
  }

  destroy() {
    window.removeEventListener('mousemove', this._onMouseMove);

    this._canvas.removeEventListener('touchmove', this._onTouchMove);
    this._canvas.removeEventListener('touchstart', this._onTouchStart);
    this._canvas.removeEventListener('click', this._onClick);

    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
