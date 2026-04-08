import { drawPanel } from '../../shared/drawPanel.js';
import { HUD_THEME } from '../hudTheme.js';

export function drawStatBadge(
  ctx,
  {
    x,
    y,
    w,
    h,
    text,
    fill,
    stroke,
    textColor = HUD_THEME.colors.text,
    font = HUD_THEME.fonts.stat,
    radius = HUD_THEME.metrics.badgeRadius,
    lineWidth = 1.2,
    iconDrawer = null,
    iconTextOffset = 34,
  },
) {
  drawPanel(ctx, {
    x,
    y,
    w,
    h,
    radius,
    fill,
    stroke,
    glow: 0,
    lineWidth,
  });

  if (iconDrawer) {
    iconDrawer(ctx, x, y, w, h);
  }

  ctx.fillStyle = textColor;
  ctx.font = font;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + iconTextOffset, y + h / 2);
}
