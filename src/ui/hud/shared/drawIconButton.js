import { HUD_THEME } from '../hudTheme.js';
import { drawIcon } from '../../icons/index.js';

export function drawIconButton(ctx, { x, y, radius, icon, color }) {
  ctx.fillStyle = HUD_THEME.colors.iconButtonBg;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = color;
  drawIcon(ctx, icon, x, y, radius * 1.1);
}
