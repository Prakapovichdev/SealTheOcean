import { BW, HUD_TOP } from '../../config/constants.js';
import { LEVELS } from '../../levels/data/index.js';

import { HUD_THEME } from './hudTheme.js';
import { drawCrystalGlyph } from './shared/drawCrystalGlyph.js';
import { drawHeartGlyph } from './shared/drawHeartGlyph.js';
import { drawLevelDots } from './shared/drawLevelDots.js';
import { drawStatBadge } from './shared/drawStatBadge.js';

export class TopBar {
  constructor(gameState) {
    this._gs = gameState;
  }

  draw(ctx) {
    const centerY = HUD_TOP / 2;
    const scoreText = `${this._gs.score}`;
    const livesText = `${Math.max(0, this._gs.lives)}`;
    const currentLevel = LEVELS[this._gs.level] ?? LEVELS[0] ?? { name: '' };

    this._drawBackground(ctx);
    this._drawScoreBadge(ctx, scoreText, centerY);
    this._drawLevelInfo(ctx, currentLevel.name, centerY);
    this._drawLivesBadge(ctx, livesText, centerY);
  }

  _drawBackground(ctx) {
    ctx.fillStyle = HUD_THEME.colors.panelBg;
    ctx.fillRect(0, 0, BW, HUD_TOP);

    ctx.strokeStyle = 'rgba(34,240,168,.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, HUD_TOP);
    ctx.lineTo(BW, HUD_TOP);
    ctx.stroke();
  }

  _getBadgeIconCenter(badgeX, badgeY, badgeH, yOffset = 0) {
    const iconBoxX = badgeX + 8;
    const iconBoxW = 20;

    return {
      cx: iconBoxX + iconBoxW / 2,
      cy: badgeY + badgeH / 2 + yOffset,
    };
  }

  _drawScoreBadge(ctx, text, centerY) {
    ctx.font = HUD_THEME.fonts.stat;
    const textWidth = ctx.measureText(text).width;
    const w = textWidth + 46;
    const h = HUD_THEME.metrics.badgeHeight;
    const x = HUD_THEME.metrics.topPaddingX;
    const y = centerY - h / 2;

    drawStatBadge(ctx, {
      x,
      y,
      w,
      h,
      text,
      fill: HUD_THEME.colors.accentFill,
      stroke: HUD_THEME.colors.accentSoft,
      iconDrawer: (localCtx, badgeX, badgeY, _w, badgeH) => {
        const { cx, cy } = this._getBadgeIconCenter(badgeX, badgeY, badgeH, 0);
        drawCrystalGlyph(localCtx, cx, cy, 8);
      },
      iconTextOffset: 34,
    });
  }

  _drawLevelInfo(ctx, levelName, centerY) {
    ctx.fillStyle = HUD_THEME.colors.textSoft;
    ctx.font = HUD_THEME.fonts.level;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(levelName, BW / 2, centerY - 9);

    drawLevelDots(ctx, this._gs.level, LEVELS.length, centerY + 11);
  }

  _drawLivesBadge(ctx, text, centerY) {
    ctx.font = HUD_THEME.fonts.stat;
    const textWidth = ctx.measureText(text).width;
    const w = textWidth + 52;
    const h = HUD_THEME.metrics.badgeHeight;
    const x = BW - HUD_THEME.metrics.topPaddingX - w;
    const y = centerY - h / 2;

    drawStatBadge(ctx, {
      x,
      y,
      w,
      h,
      text,
      fill: HUD_THEME.colors.livesFill,
      stroke: HUD_THEME.colors.livesSoft,
      iconDrawer: (localCtx, badgeX, badgeY, _w, badgeH) => {
        const { cx, cy } = this._getBadgeIconCenter(badgeX, badgeY, badgeH, -1.5);
        drawHeartGlyph(localCtx, cx, cy, 8);
      },
      iconTextOffset: 34,
    });
  }
}
