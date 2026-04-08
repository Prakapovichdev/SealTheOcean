import { AudioSystem } from '../systems/AudioSystem.js';
import { ParticleSystem } from '../systems/ParticleSystem.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { BonusSystem } from '../systems/BonusSystem.js';
import { Ball } from '../entities/Ball.js';
import { Paddle } from '../entities/Paddle.js';
import { WhaleBoss } from '../entities/bosses/WhaleBoss.js';
import { LevelManager } from '../levels/LevelManager.js';
import { HUD } from '../ui/HUD.js';
import { Screens } from '../ui/Screens.js';
import { BonusNotif } from '../ui/BonusNotif.js';
import { createBubbles } from '../utils/createBubbles.js';

import { GameLoop } from './GameLoop.js';
import { Renderer } from './Renderer.js';
import { InputManager } from './InputManager.js';
import { ScaleManager } from './ScaleManager.js';
import { GameState } from './GameState.js';
import { StateMachine } from './StateMachine.js';
import { EventEmitter } from './EventEmitter.js';
import { createTransitionState } from './game/createTransitionState.js';
import { TransitionController } from './game/TransitionController.js';
import { GameFlow } from './game/GameFlow.js';
import { GameView } from './game/GameView.js';

export class Game {
  constructor(canvas) {
    this.events = new EventEmitter();
    this.state = new StateMachine(this.events);
    this.gs = new GameState(this.events);

    this.scaleManager = new ScaleManager(canvas);
    this.renderer = new Renderer(canvas, this.scaleManager, this.gs);
    this.input = new InputManager(canvas, this.scaleManager, this.gs, this.events);

    this.audio = new AudioSystem(this.events, this.gs);
    this.particles = new ParticleSystem(this.gs);
    this.collision = new CollisionSystem(this.gs, this.events, this.particles);
    this.bonusSystem = new BonusSystem(this.gs, this.events, this.particles);

    this.ball = new Ball(this.gs, this.events, this.particles);
    this.paddle = new Paddle(this.gs);
    this.whaleBoss = new WhaleBoss(this.gs, this.events);

    this.transition = new TransitionController(createTransitionState());

    this.levelManager = new LevelManager(
      this.gs,
      this.events,
      this.paddle,
      this.ball,
      this.whaleBoss,
      ({ title, sub, btn, icon, onConfirm }) => {
        this.transition.start({ title, sub, btn, icon, onConfirm });
      },
    );

    this.hud = new HUD(this.gs);
    this.screens = new Screens(this.gs, this.renderer);
    this.bonusNotif = new BonusNotif(this.gs);

    this.flow = new GameFlow({
      events: this.events,
      state: this.state,
      gameState: this.gs,
      levelManager: this.levelManager,
      transition: this.transition,
    });

    this.view = new GameView({
      renderer: this.renderer,
      state: this.state,
      gameState: this.gs,
      transition: this.transition,
      screens: this.screens,
      hud: this.hud,
      bonusNotif: this.bonusNotif,
      ball: this.ball,
      paddle: this.paddle,
      whaleBoss: this.whaleBoss,
      bonusSystem: this.bonusSystem,
      particles: this.particles,
      levelManager: this.levelManager,
    });

    this.debug = null;
    this._loadDebugPanel();

    this.loop = new GameLoop(this.events, {
      onUpdate: (dt, elapsed) => this._update(dt, elapsed),
      onDraw: () => {
        this.view.draw();

        if (__DEV__) {
          this.debug?.draw(this.renderer.ctx);
        }
      },
    });
  }

  start() {
    this.gs.bubbles = createBubbles();
    this.loop.start();
  }

  _loadDebugPanel() {
    if (!__DEV__) {
      return;
    }

    import('../debug/DebugPanel.js').then(({ DebugPanel }) => {
      this.debug = new DebugPanel(this.gs, this.events);
    });
  }

  _update(dt, elapsed) {
    if (__DEV__) {
      this.debug?.update(dt, elapsed);
    }

    this.renderer.updateBubbles(dt);
    this.renderer.updateEffects(dt);

    if (this.transition.isActive) {
      this.transition.update(elapsed);
      return;
    }

    if (this.gs.paused || !this.state.is('play')) {
      return;
    }

    const currentLevel = this.levelManager.current;
    if (!currentLevel) {
      return;
    }

    this.input.update(dt);

    this.paddle.update(dt);
    this.ball.update(dt, currentLevel.speedMult);
    this.collision.update(currentLevel);
    this.bonusSystem.update(dt);
    this.particles.update(dt);

    if (this.gs.whale) {
      this.whaleBoss.update(dt);
    }
  }

  destroy() {
    this.loop.destroy();
    this.input.destroy();
    this.scaleManager.destroy();
    this.audio.destroy();

    if (__DEV__) {
      this.debug?.destroy();
    }

    this.events.clear();
  }
}
