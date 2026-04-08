export function drawPlayIcon(ctx, cx, cy, size) {
  const r = size * 0.42;
  const offsetX = size * 0.06;

  ctx.beginPath();
  ctx.moveTo(cx + offsetX + r, cy);
  ctx.lineTo(cx + offsetX - r * 0.6, cy - r * 0.85);
  ctx.lineTo(cx + offsetX - r * 0.6, cy + r * 0.85);
  ctx.closePath();
  ctx.fill();
}
