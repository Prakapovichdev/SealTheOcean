import { BW, BH, HUD_TOP, FIELD_BOTTOM, FLASH_DECAY } from '../config/constants.js';

const CAUSTIC_SPOTS_COUNT = 8;
const BUBBLE_RESPAWN_OFFSET = 10;

export class Renderer {
  constructor(canvas, scaleManager, gameState) {
    this._canvas = canvas;
    this._ctx = canvas.getContext('2d');
    this._scale = scaleManager;
    this._gs = gameState;

    this._scrollY = 0;
    this._cursor = '';
  }

  get ctx() {
    return this._ctx;
  }

  get scrollY() {
    return this._scrollY;
  }

  set scrollY(value) {
    this._scrollY = value;
  }

  beginFrame() {
    this._clearFrame();
    this._beginLogicalFrame();
    this._applyScreenShake();
    this._applyDiveScroll();
  }

  endFrame() {
    this._ctx.restore();
    this._drawFlashOverlay();
  }

  updateEffects(dt) {
    this._updateScreenShake(dt);
    this._updateFlash(dt);
    this._updateSealHit(dt);
    this._updateBonusNotification(dt);
  }

  drawBg(skyColors) {
    this._drawSkyGradient(skyColors);
    this._drawCausticSpots();
  }

  updateBubbles(dt) {
    const time = performance.now() * 0.001;
    const bubbles = this._gs.bubbles;

    for (const bubble of bubbles) {
      bubble.y += bubble.vy * dt;
      bubble.x += Math.sin(time + bubble.phase) * 0.2;

      if (bubble.y < -BUBBLE_RESPAWN_OFFSET) {
        bubble.y = FIELD_BOTTOM + BUBBLE_RESPAWN_OFFSET;
        bubble.x = Math.random() * BW;
      }
    }
  }

  drawBubbles() {
    const ctx = this._ctx;

    ctx.save();

    for (const bubble of this._gs.bubbles) {
      ctx.globalAlpha = bubble.alpha;
      ctx.strokeStyle = '#7ef8e8';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalAlpha = bubble.alpha * 0.5;
      ctx.fillStyle = '#aafaf0';
      ctx.beginPath();
      ctx.arc(bubble.x - bubble.r * 0.3, bubble.y - bubble.r * 0.3, bubble.r * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  removeScroll() {
    if (this._scrollY > 0) {
      this._ctx.translate(0, -this._scrollY);
    }
  }

  restoreScroll() {
    if (this._scrollY > 0) {
      this._ctx.translate(0, this._scrollY);
    }
  }

  drawOverlay(opacity) {
    if (opacity <= 0) return;

    this._ctx.fillStyle = `rgba(0,5,14,${opacity})`;
    this._ctx.fillRect(0, -this._scrollY - 10, BW, BH + 20);
  }

  updateCursor(stateName, paused, transitionPhase) {
    const nextCursor = this._resolveCursor(stateName, paused, transitionPhase);

    if (nextCursor === this._cursor) {
      return;
    }

    this._cursor = nextCursor;
    this._canvas.style.cursor = nextCursor;
  }

  _clearFrame() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }

  _beginLogicalFrame() {
    this._ctx.save();
    this._ctx.scale(this._scale.scale, this._scale.scale);
  }

  _applyScreenShake() {
    const gs = this._gs;

    if (gs.screenShake <= 0 || gs.paused) {
      return;
    }

    const shakeX = (Math.random() - 0.5) * gs.screenShakeAmt * 2;
    const shakeY = (Math.random() - 0.5) * gs.screenShakeAmt * 2;
    this._ctx.translate(shakeX, shakeY);
  }

  _applyDiveScroll() {
    if (this._scrollY > 0) {
      this._ctx.translate(0, this._scrollY);
    }
  }

  _drawFlashOverlay() {
    const gs = this._gs;
    if (gs.flashAlpha <= 0) {
      return;
    }

    const ctx = this._ctx;

    ctx.save();
    ctx.scale(this._scale.scale, this._scale.scale);
    ctx.fillStyle = gs.flashColor;
    ctx.globalAlpha = gs.flashAlpha;
    ctx.fillRect(0, 0, BW, BH);
    ctx.restore();
  }

  _updateScreenShake(dt) {
    if (this._gs.screenShake > 0) {
      this._gs.screenShake -= dt;
    }
  }

  _updateFlash(dt) {
    if (this._gs.flashAlpha > 0) {
      this._gs.flashAlpha = Math.max(0, this._gs.flashAlpha - FLASH_DECAY * dt);
    }
  }

  _updateSealHit(dt) {
    if (this._gs.sealHit > 0) {
      this._gs.sealHit -= dt;
    }
  }

  _updateBonusNotification(dt) {
    const bonusNotif = this._gs.bonusNotif;
    if (!bonusNotif) {
      return;
    }

    bonusNotif.alpha = Math.max(0, bonusNotif.alpha - 0.008 * dt);
    bonusNotif.y -= 0.18 * dt;

    if (bonusNotif.alpha <= 0) {
      this._gs.bonusNotif = null;
    }
  }

  _drawSkyGradient(skyColors) {
    const gradient = this._ctx.createLinearGradient(0, 0, 0, BH);
    gradient.addColorStop(0, skyColors[0]);
    gradient.addColorStop(1, skyColors[1]);

    this._ctx.fillStyle = gradient;
    this._ctx.fillRect(0, 0, BW, BH);
  }

  _drawCausticSpots() {
    const ctx = this._ctx;
    const time = performance.now() * 0.0006;
    const causticHeight = (FIELD_BOTTOM - HUD_TOP) * 0.4;

    ctx.save();
    ctx.globalAlpha = 0.05;

    for (let i = 0; i < CAUSTIC_SPOTS_COUNT; i++) {
      const x = (i * 157 + Math.sin(time + i) * 28) % BW;
      const y = HUD_TOP + 20 + ((i * 83) % causticHeight);

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 38);
      gradient.addColorStop(0, '#7ef8e8');
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.fillRect(x - 38, y - 18, 76, 36);
    }

    ctx.restore();
  }

  _resolveCursor(stateName, paused, transitionPhase) {
    if (stateName === 'title' || stateName === 'gameover') {
      return 'default';
    }

    if (paused || transitionPhase === 'popup' || transitionPhase === 'done') {
      return 'default';
    }

    if (stateName === 'play') {
      if (this._gs.ptrY < HUD_TOP || this._gs.ptrY > FIELD_BOTTOM) {
        return 'default';
      }
    }

    return 'none';
  }
}
