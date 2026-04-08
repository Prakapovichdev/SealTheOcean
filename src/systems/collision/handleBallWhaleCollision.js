import { WHALE_HIT_SCORE } from '../../config/constants.js';

import { applyFlash, applyScreenShake, getComboMultiplier } from './collisionHelpers.js';
import { hitCircleRect, resolveBallRectCollision } from './collisionMath.js';

export function handleBallWhaleCollision({ gameState, events, particles }) {
  const ball = gameState.ball;
  const whale = gameState.whale;

  if (!ball || !whale || whale.freed || whale.hp <= 0) {
    return false;
  }

  const prevX = ball._prevX ?? ball.x;
  const prevY = ball._prevY ?? ball.y;
  const wobbleY = Math.sin(performance.now() * 0.001 * 1.2) * 5;

  const whaleHitbox = {
    x: whale.x,
    y: whale.y + wobbleY,
    w: whale.w,
    h: whale.h,
  };

  if (!hitCircleRect(whaleHitbox, ball)) {
    return false;
  }

  resolveBallRectCollision(ball, whaleHitbox, prevX, prevY);

  whale.hp -= 1;
  whale.hitAnim = 16;

  gameState.bumpCombo();
  applyScreenShake(gameState, 10, 4);

  particles.burst(whale.x + whale.w / 2, whale.y + wobbleY + whale.h / 2, '#4cc9f0', 22);

  const points = WHALE_HIT_SCORE * getComboMultiplier(gameState);
  gameState.addScore(points);

  if (whale.hp > 0) {
    particles.floatText(whale.x + whale.w / 2, whale.y + wobbleY, '💙 Сеть порвана!', '#ffd166');

    applyFlash(gameState, 0.28, '#60d0ff');
    events.emit('whale:hit');
    return true;
  }

  whale.freed = true;

  particles.floatText(whale.x + whale.w / 2, whale.y + wobbleY, '🐋 Свободен!', '#ffd166');

  applyFlash(gameState, 0.65, '#22f0a8');

  for (let i = 0; i < 4; i++) {
    particles.burst(
      whale.x + Math.random() * whale.w,
      whale.y + Math.random() * whale.h,
      i % 2 === 0 ? '#22f0a8' : '#ffd166',
      28,
    );
  }

  events.emit('whale:freed');
  return true;
}
