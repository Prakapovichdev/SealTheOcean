import {
  BW,
  FIELD_BOTTOM,
  MAX_LIVES,
  BONUS_DROP_CHANCE,
  BONUS_WIDE_DURATION,
  BONUS_FIRE_SCORE,
  BONUS_PICKUP_SCORE,
  BONUS_FALL_SPEED,
  PADDLE_WIDE_WIDTH,
  HUD_TOP,
  BALL_SLOW_MULTIPLIER,
  BALL_SLOW_DURATION,
} from '../../config/constants.js';

import { getRandomBonusDef } from './bonusDefinitions.js';

const BONUS_HALF_SIZE = 14;
const BONUS_REMOVE_OFFSET_Y = 20;
const BONUS_BOX_SIZE = 40;

export class BonusController {
  constructor(gameState, events, particles) {
    this._gs = gameState;
    this._events = events;
    this._particles = particles;

    events.on('bonus:spawn', ({ x, y }) => this._trySpawn(x, y));
  }

  update(dt) {
    const bonuses = this._gs.bonus;
    const paddle = this._gs.paddle;

    for (let i = bonuses.length - 1; i >= 0; i--) {
      const bonus = bonuses[i];
      this._advanceBonus(bonus, dt);

      if (paddle && this._isPickedByPaddle(bonus, paddle)) {
        this._pickupBonus(bonus, i, bonuses);
        continue;
      }

      if (this._isOutOfBounds(bonus)) {
        bonuses.splice(i, 1);
      }
    }
  }

  _trySpawn(x, y) {
    if (Math.random() > BONUS_DROP_CHANCE) {
      return;
    }

    const bonusDef = getRandomBonusDef();

    this._gs.bonus.push({
      x,
      y,
      wobble: Math.random() * Math.PI * 2,
      ...bonusDef,
    });
  }

  _advanceBonus(bonus, dt) {
    bonus.y += BONUS_FALL_SPEED * dt;
  }

  _isPickedByPaddle(bonus, paddle) {
    return (
      bonus.y + BONUS_HALF_SIZE > paddle.y &&
      bonus.y - BONUS_HALF_SIZE < paddle.y + paddle.h &&
      bonus.x > paddle.x &&
      bonus.x < paddle.x + paddle.w
    );
  }

  _isOutOfBounds(bonus) {
    return bonus.y > FIELD_BOTTOM + BONUS_REMOVE_OFFSET_Y;
  }

  _pickupBonus(bonus, index, bonuses) {
    this._applyBonus(bonus);
    this._particles.burst(bonus.x, bonus.y, bonus.color, 14);

    bonuses.splice(index, 1);
    this._events.emit('bonus:pickup');
  }

  _applyBonus(bonus) {
    this._gs.addScore(BONUS_PICKUP_SCORE);

    switch (bonus.kind) {
      case 'wide':
        this._applyWideBonus();
        break;
      case 'slow':
        this._applySlowBonus();
        break;
      case 'life':
        this._gs.gainLife(MAX_LIVES);
        break;
      case 'fire':
        this._applyFireBonus();
        break;
    }

    this._showBonusNotification(bonus);
  }

  _applyWideBonus() {
    const paddle = this._gs.paddle;
    if (!paddle) {
      return;
    }

    paddle.w = PADDLE_WIDE_WIDTH;
    paddle._wide = BONUS_WIDE_DURATION;
    paddle.x = clamp(paddle.x, 0, BW - paddle.w);
  }

  _applySlowBonus() {
    const ball = this._gs.ball;
    if (!ball) {
      return;
    }

    const now = Date.now();
    const currentSlowEnd = ball.slowEnd ?? 0;
    ball.slowEnd = Math.max(currentSlowEnd, now) + BALL_SLOW_DURATION;

    ball.vx *= BALL_SLOW_MULTIPLIER;
    ball.vy *= BALL_SLOW_MULTIPLIER;
  }

  _applyFireBonus() {
    const paddle = this._gs.paddle;
    const burstY = paddle ? paddle.y - BONUS_BOX_SIZE : FIELD_BOTTOM - BONUS_BOX_SIZE;

    this._particles.burst(BW / 2, burstY, '#ffe066', 28);
    this._gs.addScore(BONUS_FIRE_SCORE);
  }

  _showBonusNotification(bonus) {
    this._gs.bonusNotif = {
      label: bonus.label,
      desc: bonus.desc,
      color: bonus.color,
      icon: bonus.icon,
      alpha: 1,
      y: HUD_TOP + 54,
    };
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
