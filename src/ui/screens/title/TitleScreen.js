import { BW, BH } from '../../../config/constants.js';
import { LEVELS } from '../../../levels/data/index.js';
import { SCREEN_THEME } from '../screenTheme.js';
import { drawButton } from '../shared/drawButton.js';
import { drawOceanBackdrop } from '../shared/drawOceanBackdrop.js';
import { drawPanel } from '../../shared/drawPanel.js';
import { drawIcon } from '../../icons/index.js';

import { TitleFishLayer } from './TitleFishLayer.js';
import { drawTitleCorals } from './drawTitleCorals.js';

const LEVEL_CARD_W = 84;
const LEVEL_CARD_H = 64;
const LEVEL_CARD_GAP = 14;
const LEVEL_CARD_RADIUS = 10;

export class TitleScreen {
  constructor(drawBubbles) {
    this._drawBubbles = drawBubbles;
    this._fishLayer = new TitleFishLayer();
  }

  draw(ctx, time) {
    const cx = BW / 2;
    const logoY = BH * 0.2;
    const previewY = BH * 0.49;
    const buttonW = 200;
    const buttonH = 56;
    const buttonX = cx - buttonW / 2;
    const buttonY = BH * 0.67;
    const glow = 0.6 + 0.4 * Math.sin(time * 2.2);
    const pulse = 0.92 + 0.08 * Math.sin(time * 1.6);
    const hintAlpha = 0.45 + 0.2 * Math.sin(time * 1.4);

    drawOceanBackdrop(ctx, {
      topColor: '#003a5c',
      midColor: '#001e30',
      bottomColor: '#000b18',
      rayAlpha: 0.04,
      rayCount: 6,
      rayStartX: 0.15,
      rayStep: 0.14,
      rayTopWidth: 28,
      rayWidthStep: 8,
      rayBottomFactor: 0.4,
      rayHeight: BH * 0.65,
      bubbleDrawer: this._drawBubbles,
    });

    this._fishLayer.draw(ctx, time);

    ctx.save();
    ctx.shadowColor = SCREEN_THEME.colors.accent;
    ctx.shadowBlur = SCREEN_THEME.glow.emoji * pulse;
    drawIcon(ctx, 'seal', cx, logoY, 90 * pulse);
    ctx.restore();

    ctx.save();
    ctx.shadowColor = SCREEN_THEME.colors.accent;
    ctx.shadowBlur = SCREEN_THEME.glow.title;
    ctx.fillStyle = SCREEN_THEME.colors.text;
    ctx.font = SCREEN_THEME.fonts.titleLg;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Seal the Ocean', cx, logoY + 66);
    ctx.restore();

    ctx.fillStyle = 'rgba(126,248,232,.65)';
    ctx.font = SCREEN_THEME.fonts.bodySm;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Разбей сети — спаси друзей!', cx, logoY + 96);

    this._drawLevelCards(ctx, previewY);

    drawButton(ctx, {
      x: buttonX,
      y: buttonY,
      w: buttonW,
      h: buttonH,
      radius: buttonH / 2,
      label: 'ИГРАТЬ',
      stroke: `rgba(34,240,168,${0.55 + 0.35 * glow})`,
      textColor: SCREEN_THEME.colors.accent,
      fillTop: `rgba(34,240,168,${0.22 + 0.1 * glow})`,
      fillBottom: `rgba(14,196,134,${0.12 + 0.06 * glow})`,
      glow: SCREEN_THEME.glow.buttonStrong * glow,
      font: SCREEN_THEME.fonts.buttonLg,
      glossAlpha: 0.1,
      lineWidth: 2,
    });

    ctx.fillStyle = `rgba(180,248,228,${hintAlpha})`;
    ctx.font = '600 16px "Segoe UI",sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('4 уровня · бонусы · босс-кит', cx, BH * 0.815);

    ctx.save();
    ctx.translate(0, 28);
    drawTitleCorals(ctx);
    ctx.restore();
  }

  _drawLevelCards(ctx, y) {
    const totalWidth = LEVELS.length * LEVEL_CARD_W + (LEVELS.length - 1) * LEVEL_CARD_GAP;
    const startX = BW / 2 - totalWidth / 2;

    LEVELS.forEach((level, index) => {
      const x = startX + index * (LEVEL_CARD_W + LEVEL_CARD_GAP);
      const isActive = index === 0;
      const alpha = isActive ? 0.95 : 0.52;

      ctx.save();
      ctx.globalAlpha = alpha;

      drawPanel(ctx, {
        x,
        y: y - LEVEL_CARD_H / 2,
        w: LEVEL_CARD_W,
        h: LEVEL_CARD_H,
        radius: LEVEL_CARD_RADIUS,
        fill: 'rgba(0,20,40,.72)',
        stroke: isActive ? SCREEN_THEME.colors.accent : 'rgba(126,248,232,.3)',
        glow: isActive ? 8 : 0,
        lineWidth: 1.2,
      });

      drawIcon(ctx, level.icon, x + LEVEL_CARD_W / 2, y - 12, 32);

      ctx.fillStyle = isActive ? SCREEN_THEME.colors.accent : 'rgba(180,248,228,.68)';

      this._drawLevelName(ctx, level.name, x + LEVEL_CARD_W / 2, y + 12, isActive);

      ctx.restore();
    });
  }

  _drawLevelName(ctx, name, x, y, isActive) {
    const words = name.split(' ');
    const lines =
      words.length > 1 ? [words.slice(0, -1).join(' '), words[words.length - 1]] : [name];

    ctx.font = isActive ? '600 11px "Segoe UI",sans-serif' : '500 10px "Segoe UI",sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (lines.length === 1) {
      ctx.fillText(lines[0], x, y);
      return;
    }

    ctx.fillText(lines[0], x, y - 6);
    ctx.fillText(lines[1], x, y + 7);
  }
}
