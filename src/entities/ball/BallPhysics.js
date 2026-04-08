import {
  BW,
  HUD_TOP,
  FIELD_BOTTOM,
  BALL_RADIUS,
  BALL_BASE_SPEED,
  BALL_TRAIL_LENGTH,
  BALL_SPEED_RAMP_INTERVAL,
  BALL_SPEED_RAMP_STEP,
  BALL_SPEED_RAMP_MAX,
  BALL_SLOW_MULTIPLIER,
  BALL_MAX_DEFLECTION,
  BALL_MIN_VY_RATIO,
  BALL_PADDLE_INFLUENCE,
} from '../../config/constants.js';

const STICK_OFFSET_Y = 2;
const LOST_BALL_OFFSET_Y = 20;
const WALL_X_PADDING_FACTOR = 0.5;
const MAX_HORIZONTAL_SPEED_RATIO = 0.92;

export class BallPhysics {
  constructor(gameState, events, particles) {
    this._gs = gameState;
    this._events = events;
    this._particles = particles;
  }

  reset(speedMult) {
    const paddle = this._gs.paddle;
    if (!paddle) return;

    this._gs.ball = {
      x: paddle.x + paddle.w / 2,
      y: paddle.y - BALL_RADIUS - STICK_OFFSET_Y,
      vx: 0,
      vy: 0,
      r: BALL_RADIUS,
      speed: BALL_BASE_SPEED * speedMult,
      trail: [],
      stuck: true,
      slowEnd: 0,
    };
  }

  launch() {
    const ball = this._gs.ball;
    if (!ball || !ball.stuck) return;

    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.75;
    ball.vx = Math.cos(angle) * ball.speed;
    ball.vy = Math.sin(angle) * ball.speed;
    ball.stuck = false;
  }

  update(dt, speedMult) {
    const ball = this._gs.ball;
    if (!ball) return;

    if (ball.stuck) {
      this._stickToPaddle(ball);
      return;
    }

    this._updateSpeed(ball, dt, speedMult);
    this._pushTrailPoint(ball);

    const prevX = ball.x;
    const prevY = ball.y;

    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    this._resolveWallHits(ball);
    this._checkPaddleHit(ball, prevY);

    if (ball.y > FIELD_BOTTOM + LOST_BALL_OFFSET_Y) {
      this._gs.resetCombo();
      this._events.emit('ball:lost');
      return;
    }

    ball._prevX = prevX;
    ball._prevY = prevY;
  }

  _stickToPaddle(ball) {
    const paddle = this._gs.paddle;
    if (!paddle) return;

    ball.x = paddle.x + paddle.w / 2;
    ball.y = paddle.y - ball.r - STICK_OFFSET_Y;
    ball.trail.length = 0;
  }

  _updateSpeed(ball, dt, speedMult) {
    this._gs.levelTimer += (dt * 16.67) / 1000;

    const rampMultiplier =
      1 +
      Math.min(
        BALL_SPEED_RAMP_MAX,
        Math.floor(this._gs.levelTimer / BALL_SPEED_RAMP_INTERVAL) * BALL_SPEED_RAMP_STEP,
      );

    const slowMultiplier = ball.slowEnd > Date.now() ? BALL_SLOW_MULTIPLIER : 1;
    const nextSpeed = BALL_BASE_SPEED * speedMult * rampMultiplier * slowMultiplier;

    if (Math.abs(nextSpeed - ball.speed) > 0.01) {
      ball.speed = nextSpeed;
      normalizeBallVelocity(ball);
      return;
    }

    ball.speed = nextSpeed;
  }

  _pushTrailPoint(ball) {
    ball.trail.push({ x: ball.x, y: ball.y });

    if (ball.trail.length > BALL_TRAIL_LENGTH) {
      ball.trail.shift();
    }
  }

  _resolveWallHits(ball) {
    if (ball.x - ball.r < 0) {
      ball.x = ball.r;
      ball.vx = Math.abs(ball.vx);
      this._particles.impact(ball.x, ball.y);
    }

    if (ball.x + ball.r > BW) {
      ball.x = BW - ball.r;
      ball.vx = -Math.abs(ball.vx);
      this._particles.impact(ball.x, ball.y);
    }

    if (ball.y - ball.r < HUD_TOP) {
      ball.y = HUD_TOP + ball.r;
      ball.vy = Math.abs(ball.vy);
      this._particles.impact(ball.x, ball.y);
    }
  }

  _checkPaddleHit(ball, prevY) {
    const paddle = this._gs.paddle;
    if (!paddle) return;

    const hitFromAbove =
      ball.vy > 0 &&
      ball.x > paddle.x - ball.r * WALL_X_PADDING_FACTOR &&
      ball.x < paddle.x + paddle.w + ball.r * WALL_X_PADDING_FACTOR &&
      ball.y + ball.r > paddle.y &&
      ball.y - ball.r < paddle.y + paddle.h &&
      prevY + ball.r <= paddle.y + paddle.h;

    if (!hitFromAbove) {
      return;
    }

    ball.y = paddle.y - ball.r;

    const relativeHit = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
    const angle = relativeHit * BALL_MAX_DEFLECTION - Math.PI / 2;

    ball.vx = Math.cos(angle) * ball.speed;
    ball.vy = Math.sin(angle) * ball.speed;

    const paddleVelocity = paddle.x - (paddle.prevX ?? paddle.x);
    ball.vx = clamp(
      ball.vx + paddleVelocity * BALL_PADDLE_INFLUENCE,
      -ball.speed * MAX_HORIZONTAL_SPEED_RATIO,
      ball.speed * MAX_HORIZONTAL_SPEED_RATIO,
    );

    const minUpwardVy = ball.speed * BALL_MIN_VY_RATIO;
    if (ball.vy > -minUpwardVy) {
      ball.vy = -minUpwardVy;
    }

    normalizeBallVelocity(ball);

    this._particles.impact(ball.x, ball.y, '#a8f8e0', 9);
    this._gs.resetCombo();
    this._gs.sealHit = 14;
    this._events.emit('ball:hit-paddle');
  }
}

function normalizeBallVelocity(ball) {
  const speed = Math.hypot(ball.vx, ball.vy);
  if (speed <= 0) return;

  ball.vx = (ball.vx / speed) * ball.speed;
  ball.vy = (ball.vy / speed) * ball.speed;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
