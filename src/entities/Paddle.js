import { PaddleController } from './paddle/PaddleController.js';
import { PaddleRenderer } from './paddle/PaddleRenderer.js';

export class Paddle {
  constructor(gameState) {
    this._controller = new PaddleController(gameState);
    this._renderer = new PaddleRenderer(gameState);
  }

  init() {
    this._controller.init();
  }

  update(dt) {
    this._controller.update(dt);
  }

  draw(ctx) {
    this._renderer.draw(ctx);
  }
}
