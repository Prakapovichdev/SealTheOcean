import { BallPhysics } from './ball/BallPhysics.js';
import { BallRenderer } from './ball/BallRenderer.js';

export class Ball {
  constructor(gameState, events, particles) {
    this._physics = new BallPhysics(gameState, events, particles);
    this._renderer = new BallRenderer(gameState);

    events.on('ball:launch', () => this.launch());
  }

  reset(speedMult) {
    this._physics.reset(speedMult);
  }

  launch() {
    this._physics.launch();
  }

  update(dt, speedMult) {
    this._physics.update(dt, speedMult);
  }

  computeTrajectory() {
    return this._renderer.computeTrajectory();
  }

  draw(ctx) {
    this._renderer.draw(ctx);
  }

  drawTrajectory(ctx) {
    this._renderer.drawTrajectory(ctx);
  }

  drawLaunchHint(ctx) {
    this._renderer.drawLaunchHint(ctx);
  }
}
