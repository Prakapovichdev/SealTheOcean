import { LEVELS } from '../../levels/data/index.js';
import { Block } from '../../entities/Block.js';

export class GameView {
  constructor({
    renderer,
    state,
    gameState,
    transition,
    screens,
    hud,
    bonusNotif,
    ball,
    paddle,
    whaleBoss,
    bonusSystem,
    particles,
    levelManager,
  }) {
    this._renderer = renderer;
    this._state = state;
    this._gs = gameState;
    this._transition = transition;
    this._screens = screens;
    this._hud = hud;
    this._bonusNotif = bonusNotif;
    this._ball = ball;
    this._paddle = paddle;
    this._whaleBoss = whaleBoss;
    this._bonusSystem = bonusSystem;
    this._particles = particles;
    this._levelManager = levelManager;
  }

  draw() {
    const ctx = this._renderer.ctx;
    const transitionState = this._transition.current;
    const stateName = this._state.current;
    const isGameplayVisible =
      stateName === 'play' || stateName === 'pause' || this._transition.isActive;

    this._renderer.updateCursor(stateName, this._gs.paused, transitionState.phase);
    this._renderer.scrollY = transitionState.diveY || 0;

    this._renderer.beginFrame();

    this._drawBackdrop(isGameplayVisible);
    if (isGameplayVisible) {
      this._drawGameplay(ctx, transitionState);
    }

    this._drawHudAndNotifications(ctx, stateName);
    this._drawTransitionEffects(ctx, transitionState);
    this._drawStateScreens(ctx, stateName);
    this._renderer.endFrame();
  }

  _drawBackdrop(useCurrentLevelSky) {
    const currentLevel = this._levelManager.current;
    const sky = useCurrentLevelSky ? (currentLevel?.sky ?? LEVELS[0].sky) : LEVELS[0].sky;

    this._renderer.drawBg(sky);
    this._renderer.drawBubbles();
  }

  _drawGameplay(ctx, transitionState) {
    const hidePaddle = transitionState.phase === 'popup' || transitionState.phase === 'done';

    this._ball.drawTrajectory(ctx);
    Block.draw(ctx, this._gs.blocks);

    if (this._gs.whale) {
      this._whaleBoss.draw(ctx);
    }

    this._bonusSystem.draw(ctx);
    this._particles.draw(ctx);
    this._ball.draw(ctx);
    this._ball.drawLaunchHint(ctx);

    if (!hidePaddle) {
      this._paddle.draw(ctx);
    }
  }

  _drawHudAndNotifications(ctx, stateName) {
    if (stateName === 'title') {
      return;
    }

    const currentLevel = this._levelManager.current;
    const showWhaleHint = stateName === 'play' && currentLevel?.isWhaleLvl && this._gs.ball?.stuck;

    this._drawWithoutScroll(() => {
      this._hud.draw(ctx, { showWhaleHint });
      this._bonusNotif.draw(ctx);
    });
  }

  _drawTransitionEffects(ctx, transitionState) {
    if (transitionState.overlay > 0) {
      this._renderer.drawOverlay(transitionState.overlay);
    }

    if (transitionState.ripple > 0) {
      this._screens.drawRipple(ctx, transitionState.ripple, -this._renderer.scrollY);
    }

    if (transitionState.phase === 'popup' || transitionState.phase === 'done') {
      this._drawWithoutScroll(() => {
        this._screens.drawAnimatedModal(ctx, transitionState);
      });
    }
  }

  _drawStateScreens(ctx, stateName) {
    if (stateName === 'pause') {
      this._drawWithoutScroll(() => {
        this._screens.drawPauseOverlay(ctx);
      });
    }

    if (stateName === 'title') {
      this._screens.drawTitle(ctx);
    }

    if (stateName === 'gameover') {
      this._screens.drawGameOver(ctx);
    }
  }

  _drawWithoutScroll(drawFn) {
    this._renderer.removeScroll();
    drawFn();
    this._renderer.restoreScroll();
  }
}
