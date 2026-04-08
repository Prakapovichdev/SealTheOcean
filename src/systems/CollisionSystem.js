import { BLOCK_DEFS } from '../config/constants.js';

import { handleBallBlockCollision } from './collision/handleBallBlockCollision.js';
import { handleBallWhaleCollision } from './collision/handleBallWhaleCollision.js';

export class CollisionSystem {
  constructor(gameState, events, particles) {
    this._gs = gameState;
    this._events = events;
    this._particles = particles;
  }

  update(levelData) {
    const ball = this._gs.ball;
    if (!ball || ball.stuck) return;

    handleBallBlockCollision({
      gameState: this._gs,
      events: this._events,
      particles: this._particles,
    });

    handleBallWhaleCollision({
      gameState: this._gs,
      events: this._events,
      particles: this._particles,
    });

    this._checkLevelComplete(levelData);
  }

  _checkLevelComplete(levelData) {
    if (levelData.isWhaleLvl) return;

    const hasBreakableBlocks = this._gs.blocks.some(
      (block) => BLOCK_DEFS[block.type].special !== 'silver',
    );

    if (!hasBreakableBlocks) {
      this._events.emit('level:complete');
    }
  }
}
