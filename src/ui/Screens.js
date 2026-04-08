import { PauseOverlay } from './screens/pause/PauseOverlay.js';
import { TransitionModal } from './screens/transition/TransitionModal.js';
import { TitleScreen } from './screens/title/TitleScreen.js';
import { GameOverScreen } from './screens/gameOver/GameOverScreen.js';

export class Screens {
  constructor(gameState, renderer) {
    const drawBubbles = renderer.drawBubbles.bind(renderer);

    this._pauseOverlay = new PauseOverlay();
    this._transitionModal = new TransitionModal();
    this._titleScreen = new TitleScreen(drawBubbles);
    this._gameOverScreen = new GameOverScreen(gameState, drawBubbles);
  }

  drawPauseOverlay(ctx) {
    this._pauseOverlay.draw(ctx);
  }

  drawRipple(ctx, ripple, offsetY = 0) {
    this._transitionModal.drawRipple(ctx, ripple, offsetY);
  }

  drawAnimatedModal(ctx, transitionState) {
    this._transitionModal.draw(ctx, transitionState, performance.now() * 0.001);
  }

  drawTitle(ctx) {
    this._titleScreen.draw(ctx, performance.now() * 0.001);
  }

  drawGameOver(ctx) {
    this._gameOverScreen.draw(ctx, performance.now() * 0.001);
  }
}
