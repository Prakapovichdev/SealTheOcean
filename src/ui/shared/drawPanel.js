import { roundRect } from '../../utils/math.js';
export function drawPanel(
  ctx,
  {
    x,
    y,
    w,
    h,
    radius = 18,
    fill = 'rgba(0,14,30,.96)',
    stroke = null,
    glow = 0,
    lineWidth = 1.5,
    shine = false,
    shineInset = 22,
  },
) {
  ctx.fillStyle = fill;
  roundRect(ctx, x, y, w, h, radius);

  if (stroke) {
    ctx.save();
    ctx.shadowColor = stroke;
    ctx.shadowBlur = glow;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    roundRect(ctx, x, y, w, h, radius, true);
    ctx.restore();
  }

  if (shine) {
    const gradient = ctx.createLinearGradient(x, y, x + w, y);
    gradient.addColorStop(0, 'rgba(34,240,168,0)');
    gradient.addColorStop(0.5, 'rgba(34,240,168,.6)');
    gradient.addColorStop(1, 'rgba(34,240,168,0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(x + shineInset, y, w - shineInset * 2, 1.5);
  }
}
