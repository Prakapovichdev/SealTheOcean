import { roundRect } from '../../../utils/math.js';

export function drawWideIcon(ctx, cx, cy, size) {
  const color = '#22f0a8';

  const arrowY = cy - size * 0.15;
  const arrowHalfW = size * 0.32;
  const arrowHeadSize = size * 0.14;

  ctx.save();
  ctx.strokeStyle = '#fff';
  ctx.fillStyle = '#fff';
  ctx.lineWidth = Math.max(1.5, size * 0.07);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(cx - arrowHalfW + arrowHeadSize * 0.4, arrowY);
  ctx.lineTo(cx + arrowHalfW - arrowHeadSize * 0.4, arrowY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx - arrowHalfW, arrowY);
  ctx.lineTo(cx - arrowHalfW + arrowHeadSize, arrowY - arrowHeadSize * 0.7);
  ctx.lineTo(cx - arrowHalfW + arrowHeadSize, arrowY + arrowHeadSize * 0.7);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx + arrowHalfW, arrowY);
  ctx.lineTo(cx + arrowHalfW - arrowHeadSize, arrowY - arrowHeadSize * 0.7);
  ctx.lineTo(cx + arrowHalfW - arrowHeadSize, arrowY + arrowHeadSize * 0.7);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  const platformW = size * 0.7;
  const platformH = size * 0.13;
  const platformY = cy + size * 0.2;

  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = size * 0.25;
  roundRect(
    ctx,
    cx - platformW / 2,
    platformY - platformH / 2,
    platformW,
    platformH,
    platformH / 2,
  );
  ctx.restore();
}
