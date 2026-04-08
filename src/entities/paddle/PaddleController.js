import {
  BW,
  FIELD_BOTTOM,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_LERP,
} from '../../config/constants.js';

const PADDLE_OFFSET_FROM_BOTTOM = 105;

export class PaddleController {
  constructor(gameState) {
    this._gs = gameState;
  }

  init() {
    const startX = (BW - PADDLE_WIDTH) / 2;

    this._gs.paddle = {
      x: startX,
      y: FIELD_BOTTOM - PADDLE_OFFSET_FROM_BOTTOM,
      w: PADDLE_WIDTH,
      h: PADDLE_HEIGHT,
      prevX: startX,
      _wide: 0,
    };
  }

  update(dt) {
    const paddle = this._gs.paddle;
    if (!paddle) return;

    const targetX = clamp(this._gs.ptrX - paddle.w / 2, 0, BW - paddle.w);

    paddle.prevX = paddle.x;
    paddle.x += (targetX - paddle.x) * Math.min(1, PADDLE_LERP * dt);

    this._updateWideBonus(paddle, dt);
  }

  _updateWideBonus(paddle, dt) {
    if (paddle._wide <= 0) return;

    paddle._wide -= dt;

    if (paddle._wide <= 0) {
      paddle.w = PADDLE_WIDTH;
    }
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
