import { BW, BH } from '../../../config/constants.js';
import { SCREEN_THEME } from '../screenTheme.js';
import { drawButton } from '../shared/drawButton.js';
import { drawOceanBackdrop } from '../shared/drawOceanBackdrop.js';
import { drawPanel } from '../../shared/drawPanel.js';

import { drawSadSeal } from './drawSadSeal.js';

export class GameOverScreen {
  constructor(gameState, drawBubbles) {
    this._gs = gameState;
    this._drawBubbles = drawBubbles;
  }

  draw(ctx, time) {
    const cx = BW / 2;
    const glow = 0.6 + 0.4 * Math.sin(time * 2.2);
    const score = `${this._gs.score}`;

    drawOceanBackdrop(ctx, {
      topColor: '#001220',
      midColor: '#000c18',
      bottomColor: '#000408',
      rayAlpha: 0.025,
      rayCount: 4,
      rayStartX: 0.2,
      rayStep: 0.2,
      rayTopWidth: 18,
      rayWidthStep: 0,
      rayBottomFactor: 0.45,
      rayHeight: BH * 0.5,
      bubbleDrawer: this._drawBubbles,
    });

    drawSadSeal(ctx, cx, BH * 0.37, 74, time);

    ctx.save();
    ctx.shadowColor = SCREEN_THEME.colors.titleGlow;
    ctx.shadowBlur = 24;
    ctx.fillStyle = SCREEN_THEME.colors.lossTitle;
    ctx.font = SCREEN_THEME.fonts.titleMd;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Игра окончена', cx, BH * 0.62);
    ctx.restore();

    ctx.font = SCREEN_THEME.fonts.bodyMd;
    const scoreWidth = ctx.measureText(score).width;
    const badgeW = scoreWidth + 56;
    const badgeH = 40;
    const badgeX = cx - badgeW / 2;
    const badgeY = BH * 0.68 - 20;

    drawPanel(ctx, {
      x: badgeX,
      y: badgeY,
      w: badgeW,
      h: badgeH,
      radius: 12,
      fill: 'rgba(34,240,168,.12)',
      stroke: 'rgba(34,240,168,.4)',
      glow: 0,
      lineWidth: 1.2,
    });

    ctx.save();
    ctx.translate(badgeX + 22, badgeY + badgeH / 2);
    ctx.fillStyle = SCREEN_THEME.colors.accent;
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(7, 0);
    ctx.lineTo(0, 8);
    ctx.lineTo(-7, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.3)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = SCREEN_THEME.colors.scoreText;
    ctx.font = SCREEN_THEME.fonts.bodyMd;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(score, badgeX + 36, badgeY + badgeH / 2);

    const buttonW = 224;
    const buttonH = 52;
    const buttonX = cx - buttonW / 2;
    const buttonY = BH * 0.79;

    drawButton(ctx, {
      x: buttonX,
      y: buttonY,
      w: buttonW,
      h: buttonH,
      radius: buttonH / 2,
      label: 'Попробовать снова',
      stroke: `rgba(34,240,168,${0.55 + 0.35 * glow})`,
      textColor: SCREEN_THEME.colors.accent,
      fillTop: `rgba(34,240,168,${0.2 + 0.08 * glow})`,
      fillBottom: `rgba(14,196,134,${0.1 + 0.04 * glow})`,
      glow: 24 * glow,
      font: SCREEN_THEME.fonts.buttonMd,
      glossAlpha: 0.08,
      lineWidth: 2,
    });
  }
}
