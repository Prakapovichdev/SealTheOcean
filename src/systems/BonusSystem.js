import { BonusController } from './bonus/BonusController.js';
import { BonusRenderer } from './bonus/BonusRenderer.js';

export class BonusSystem {
  constructor(gameState, events, particles) {
    this._controller = new BonusController(gameState, events, particles);
    this._renderer = new BonusRenderer(gameState);
  }

  update(dt) {
    this._controller.update(dt);
  }

  draw(ctx) {
    this._renderer.draw(ctx);
  }
}
