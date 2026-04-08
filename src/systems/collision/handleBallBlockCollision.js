import { BLOCK_DEFS } from '../../config/constants.js';

import { applyFlash, applyScreenShake, getComboMultiplier } from './collisionHelpers.js';
import { hitCircleRect, resolveBallRectCollision } from './collisionMath.js';

const BOMB_X_RANGE = 60;
const BOMB_Y_RANGE = 40;

export function handleBallBlockCollision({ gameState, events, particles }) {
  const ball = gameState.ball;
  const blocks = gameState.blocks;

  if (!ball || blocks.length === 0) {
    return false;
  }

  const prevX = ball._prevX ?? ball.x;
  const prevY = ball._prevY ?? ball.y;

  for (const block of blocks) {
    if (!hitCircleRect(block, ball)) {
      continue;
    }

    resolveBallRectCollision(ball, block, prevX, prevY);

    const blockDef = BLOCK_DEFS[block.type];
    block.shake = 7;

    if (blockDef.special === 'silver') {
      handleSilverBlockHit({ gameState, events, particles, ball });
      return true;
    }

    block.hp -= 1;

    gameState.bumpCombo();
    const comboMultiplier = getComboMultiplier(gameState);

    if (block.hp > 0) {
      particles.impact(ball.x, ball.y, '#fff', 5);
      events.emit('ball:hit-block');
      return true;
    }

    destroyBlock({
      gameState,
      events,
      particles,
      block,
      comboMultiplier,
    });

    if (blockDef.special === 'bomb') {
      explodeBomb({
        gameState,
        particles,
        blocks,
        bomb: block,
        comboMultiplier,
      });
    }

    removeDestroyedBlocks(blocks);
    return true;
  }

  return false;
}

function handleSilverBlockHit({ gameState, events, particles, ball }) {
  applyScreenShake(gameState, 4, 2);
  particles.impact(ball.x, ball.y, '#d0d8e8', 8);
  events.emit('ball:hit-block');
}

function destroyBlock({ gameState, events, particles, block, comboMultiplier }) {
  const blockDef = BLOCK_DEFS[block.type];
  const points = getBlockPoints(block.type, comboMultiplier);
  const centerX = block.x + block.w / 2;
  const centerY = block.y + block.h / 2;

  particles.burst(centerX, centerY, blockDef.c[1]);
  particles.floatText(centerX, block.y, `+${points}`, blockDef.c[0]);

  gameState.addScore(points);
  applyScreenShake(gameState, 6 + block.maxHp * 2, 1.5 + block.maxHp * 0.8);

  events.emit('bonus:spawn', { x: centerX, y: centerY });
  events.emit('ball:hit-block');
}

function explodeBomb({ gameState, particles, blocks, bomb, comboMultiplier }) {
  applyFlash(gameState, 0.3, '#ffd166');

  for (const neighbor of blocks) {
    if (neighbor === bomb) continue;
    if (!isBombNeighbor(bomb, neighbor)) continue;

    const neighborDef = BLOCK_DEFS[neighbor.type];

    if (neighborDef.special === 'silver') {
      continue;
    }

    if (neighbor.hp <= 0) {
      continue;
    }

    neighbor.hp = 0;

    const centerX = neighbor.x + neighbor.w / 2;
    const centerY = neighbor.y + neighbor.h / 2;
    const points = getBlockPoints(neighbor.type, comboMultiplier);

    particles.burst(centerX, centerY, '#ffd166', 10);
    particles.floatText(centerX, neighbor.y, `+${points}`, '#ffd166');
    gameState.addScore(points);
  }
}

function removeDestroyedBlocks(blocks) {
  for (let i = blocks.length - 1; i >= 0; i--) {
    const block = blocks[i];
    const blockDef = BLOCK_DEFS[block.type];

    if (block.hp <= 0 && blockDef.special !== 'silver') {
      blocks.splice(i, 1);
    }
  }
}

function isBombNeighbor(bomb, block) {
  return Math.abs(block.x - bomb.x) < BOMB_X_RANGE && Math.abs(block.y - bomb.y) < BOMB_Y_RANGE;
}

function getBlockPoints(blockType, comboMultiplier) {
  return blockType * 12 * comboMultiplier;
}
