import { roundRect } from '../../../utils/math.js';

export function drawButton(
  ctx,
  {
    x,
    y,
    w,
    h,
    radius = h / 2,
    label,
    stroke = '#22f0a8',
    textColor = '#22f0a8',
    fillTop = 'rgba(34,240,168,.22)',
    fillBottom = 'rgba(14,196,134,.12)',
    glow = 18,
    pulse = 0,
    font = '600 17px "Segoe UI",sans-serif',
    glossAlpha = 0.08,
    lineWidth = 2,
  },
) {
  const bg = ctx.createLinearGradient(x, y, x, y + h);
  bg.addColorStop(0, fillTop);
  bg.addColorStop(1, fillBottom);

  ctx.fillStyle = bg;
  roundRect(ctx, x, y, w, h, radius);

  ctx.fillStyle = `rgba(255,255,255,${glossAlpha})`;
  roundRect(ctx, x + 8, y + 4, w - 16, h * 0.38, h * 0.3);

  if (pulse > 0) {
    ctx.fillStyle = `rgba(34,240,168,${pulse})`;
    roundRect(ctx, x, y, w, h, radius);
  }

  ctx.save();
  ctx.shadowColor = stroke;
  ctx.shadowBlur = glow;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth;
  roundRect(ctx, x, y, w, h, radius, true);
  ctx.restore();

  ctx.save();
  ctx.shadowColor = stroke;
  ctx.shadowBlur = Math.max(8, glow * 0.4);
  ctx.fillStyle = textColor;
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + w / 2, y + h / 2 + 1);
  ctx.restore();
}
