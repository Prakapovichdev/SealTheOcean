import {
  INITIAL_LIVES,
  MAX_LIVES,
  BW,
  BH,
  COMBO_X2_THRESHOLD,
  COMBO_X3_THRESHOLD,
  COMBO_X5_THRESHOLD,
} from '../config/constants.js';

export class GameState {
  constructor(events) {
    this._events = events;
    this._pool = [];

    this.score = 0;
    this.lives = INITIAL_LIVES;
    this.level = 0;
    this.soundOn = true;
    this.paused = false;

    this.combo = 0;
    this.comboTs = 0;

    this.screenShake = 0;
    this.screenShakeAmt = 0;
    this.flashAlpha = 0;
    this.flashColor = '#fff';
    this.sealHit = 0;
    this.levelTimer = 0;

    this.bonusNotif = null;

    this.paddle = null;
    this.ball = null;
    this.whale = null;

    this.blocks = [];
    this.parts = [];
    this.bonus = [];
    this.bubbles = [];

    this.ptrX = BW / 2;
    this.ptrY = BH / 2;
  }

  addScore(points) {
    this.score += points;
    this._emitScoreChange();
    return this.score;
  }

  setScore(score) {
    this.score = Math.max(0, score);
    this._emitScoreChange();
    return this.score;
  }

  loseLife() {
    this.lives = Math.max(0, this.lives - 1);
    this._emitLivesChange();
    return this.lives;
  }

  gainLife(livesCap = MAX_LIVES) {
    this.lives = Math.min(livesCap, this.lives + 1);
    this._emitLivesChange();
    return this.lives;
  }

  setPaused(isPaused) {
    this.paused = Boolean(isPaused);
    return this.paused;
  }

  toggleSound() {
    this.soundOn = !this.soundOn;
    return this.soundOn;
  }

  bumpCombo(now = Date.now()) {
    this.combo += 1;
    this.comboTs = now;
    return this.combo;
  }

  resetCombo() {
    this.combo = 0;
    this.comboTs = 0;
  }

  getComboMultiplier() {
    if (this.combo >= COMBO_X5_THRESHOLD) return 5;
    if (this.combo >= COMBO_X3_THRESHOLD) return 3;
    if (this.combo >= COMBO_X2_THRESHOLD) return 2;
    return 1;
  }

  comboMult() {
    return this.getComboMultiplier();
  }

  acquireParticle() {
    return this._pool.pop() ?? {};
  }

  releaseParticle(particle) {
    this._pool.push(particle);
  }

  resetGame() {
    this.setScore(0);
    this.lives = INITIAL_LIVES;
    this._emitLivesChange();
    this.level = 0;
    this.setPaused(false);
    this.resetLevel();
  }

  resetLevel() {
    this.resetCombo();
    this._resetFeedbackState();

    this.bonusNotif = null;
    this.whale = null;

    this._recycleParticles();

    this.parts.length = 0;
    this.bonus.length = 0;
    this.blocks.length = 0;
    this.bubbles.length = 0;
  }

  _resetFeedbackState() {
    this.levelTimer = 0;
    this.screenShake = 0;
    this.screenShakeAmt = 0;
    this.flashAlpha = 0;
    this.flashColor = '#fff';
    this.sealHit = 0;
  }

  _recycleParticles() {
    for (let i = 0; i < this.parts.length; i++) {
      this._pool.push(this.parts[i]);
    }
  }

  _emitScoreChange() {
    this._events.emit('score:change', this.score);
  }

  _emitLivesChange() {
    this._events.emit('lives:change', this.lives);
  }
}
