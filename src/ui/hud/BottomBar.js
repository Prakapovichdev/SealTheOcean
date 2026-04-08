import { BW, FIELD_BOTTOM, HUD_BOTTOM, BTN_PAUSE, BTN_SOUND } from '../../config/constants.js';

import { HUD_THEME } from './hudTheme.js';
import { drawIconButton } from './shared/drawIconButton.js';

export class BottomBar {
  constructor(gameState) {
    this._gs = gameState;
  }

  draw(ctx) {
    const topY = FIELD_BOTTOM;
    const centerY = topY + HUD_BOTTOM / 2;

    this._drawBackground(ctx, topY);
    this._drawPauseButton(ctx, centerY);
    this._drawSoundButton(ctx, centerY);
    this._drawHint(ctx, centerY);
  }

  _drawBackground(ctx, topY) {
    ctx.strokeStyle = HUD_THEME.colors.panelDivider;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, topY);
    ctx.lineTo(BW, topY);
    ctx.stroke();

    ctx.fillStyle = HUD_THEME.colors.panelBg;
    ctx.fillRect(0, topY, BW, HUD_BOTTOM);
  }

  _drawPauseButton(ctx, centerY) {
    drawIconButton(ctx, {
      x: BTN_PAUSE.x,
      y: centerY,
      radius: BTN_PAUSE.r,
      icon: this._gs.paused ? 'play' : 'pause',
      color: this._gs.paused ? HUD_THEME.colors.accent : 'rgba(180,248,228,.7)',
    });
  }

  _drawSoundButton(ctx, centerY) {
    drawIconButton(ctx, {
      x: BTN_SOUND.x,
      y: centerY,
      radius: BTN_SOUND.r,
      icon: this._gs.soundOn ? 'sound_on' : 'sound_off',
      color: this._gs.soundOn ? 'rgba(180,248,228,.7)' : HUD_THEME.colors.muted,
    });
  }

  _drawHint(ctx, centerY) {
    if (this._gs.paused) return;

    ctx.fillStyle = HUD_THEME.colors.textHint;
    ctx.font = HUD_THEME.fonts.hint;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Двигай пальцем', BW / 2, centerY);
  }
}
