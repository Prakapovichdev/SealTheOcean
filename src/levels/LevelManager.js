import { Block } from '../entities/Block.js';
import { createBubbles } from '../utils/createBubbles.js';

import { LEVELS } from './data/index.js';

export class LevelManager {
  constructor(gameState, events, paddle, ball, whaleBoss, startTransition) {
    this._gs = gameState;
    this._events = events;
    this._paddle = paddle;
    this._ball = ball;
    this._whaleBoss = whaleBoss;
    this._startTransition = startTransition;

    this._current = null;

    this._wireEvents();
  }

  get current() {
    return this._current;
  }

  get totalLevels() {
    return LEVELS.length;
  }

  initLevel() {
    const levelData = this._getLevelData();

    this._current = levelData;

    this._gs.resetLevel();
    this._makeBubbles();

    this._paddle.init();
    this._ball.reset(levelData.speedMult);

    this._gs.blocks = Block.createBlocks(levelData);

    if (levelData.isWhaleLvl) {
      this._whaleBoss.init();
    }
  }

  _wireEvents() {
    this._events.on('level:complete', () => this._onLevelComplete());
    this._events.on('whale:win', () => this._onWhaleWin());
    this._events.on('ball:lost', () => this._onBallLost());
  }

  _getLevelData() {
    const levelData = LEVELS[this._gs.level];

    if (!levelData) {
      throw new Error(`Unknown level index: ${this._gs.level}`);
    }

    return levelData;
  }

  _onLevelComplete() {
    // Обычные уровни завершаются через level:complete.
    // Финальный whale-level завершает игру через whale:win.
    if (!this._current || this._current.isWhaleLvl) {
      return;
    }

    this._showNextLevelTransition();
  }

  _onWhaleWin() {
    if (!this._current?.isWhaleLvl) {
      return;
    }

    this._showWhaleWinTransition();
    this._events.emit('game:win');
  }

  _onBallLost() {
    const remainingLives = this._gs.loseLife();

    if (remainingLives <= 0) {
      this._events.emit('state:force', 'gameover');
      return;
    }

    this._showLifeLostFeedback();
    this._ball.reset(this._current.speedMult);
  }

  _showNextLevelTransition() {
    const nextLevel = LEVELS[this._gs.level + 1];

    if (!nextLevel) {
      throw new Error(`Missing next level after index ${this._gs.level}`);
    }

    this._clearTransitionEffects();

    this._startTransition({
      title: nextLevel.name,
      sub: `Уровень ${this._gs.level + 2} из ${LEVELS.length}`,
      btn: 'Нырнуть глубже →',
      icon: nextLevel.icon,
      onConfirm: () => {
        this._gs.level += 1;
        this.initLevel();
        this._events.emit('state:force', 'play');
      },
    });
  }

  _showWhaleWinTransition() {
    this._clearTransitionEffects();

    this._startTransition({
      title: 'Кит спасён!',
      sub: `Финальный счёт: ${this._gs.score}`,
      btn: 'Сыграть снова',
      icon: 'whale',
      onConfirm: () => {
        this._restartGame();
      },
    });
  }

  _restartGame() {
    this._gs.resetGame();
    this.initLevel();
    this._events.emit('state:force', 'play');
  }

  _showLifeLostFeedback() {
    this._gs.flashAlpha = 0.45;
    this._gs.flashColor = '#ff3355';
  }

  _clearTransitionEffects() {
    this._gs.screenShake = 0;
    this._gs.screenShakeAmt = 0;
    this._gs.flashAlpha = 0;
  }

  _makeBubbles() {
    this._gs.bubbles = createBubbles();
  }
}
