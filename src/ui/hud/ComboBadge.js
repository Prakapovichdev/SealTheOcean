import { BW, HUD_TOP, COMBO_DISPLAY_DURATION, COMBO_FADE_START } from '../../config/constants.js';

import { HUD_THEME } from './hudTheme.js';

function getComboMultiplier(gameState) {
  if (typeof gameState.getComboMultiplier === 'function') {
    return gameState.getComboMultiplier();
  }

  if (typeof gameState.comboMult === 'function') {
    return gameState.comboMult();
  }

  return 1;
}

function getComboColor(multiplier) {
  if (multiplier >= 5) return HUD_THEME.colors.combo5;
  if (multiplier >= 3) return HUD_THEME.colors.combo3;
  return HUD_THEME.colors.combo2;
}

export class ComboBadge {
  constructor(gameState) {
    this._gs = gameState;
  }

  draw(ctx) {
    const combo = this._gs.combo;
    const multiplier = getComboMultiplier(this._gs);

    if (multiplier <= 1) {
      return;
    }

    const age = Date.now() - this._gs.comboTs;
    if (age > COMBO_DISPLAY_DURATION) {
      return;
    }

    const fadeOut =
      age > COMBO_FADE_START
        ? (COMBO_DISPLAY_DURATION - age) / (COMBO_DISPLAY_DURATION - COMBO_FADE_START)
        : 1;

    const appear = Math.min(1, age / 160);
    const lift = (1 - appear) * 10;
    const scale = 0.92 + appear * 0.08;

    const color = getComboColor(multiplier);
    const x = BW - 20;
    const y = HUD_TOP + 36 - lift;

    ctx.save();
    ctx.globalAlpha = fadeOut;
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    ctx.shadowColor = color;
    ctx.shadowBlur = 14;
    ctx.fillStyle = color;
    ctx.font = '700 28px "Segoe UI",sans-serif';
    ctx.fillText(`×${multiplier}`, 0, 0);

    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(232,255,248,.82)';
    ctx.font = '600 11px "Segoe UI",sans-serif';
    ctx.fillText(`${combo} подряд`, 0, 16);

    ctx.restore();
  }
}
