export function drawSoundOnIcon(ctx, cx, cy, size) {
  const s = size * 0.5;

  ctx.fillRect(cx - s * 0.7, cy - s * 0.25, s * 0.3, s * 0.5);

  ctx.beginPath();
  ctx.moveTo(cx - s * 0.4, cy - s * 0.25);
  ctx.lineTo(cx - s * 0.05, cy - s * 0.55);
  ctx.lineTo(cx - s * 0.05, cy + s * 0.55);
  ctx.lineTo(cx - s * 0.4, cy + s * 0.25);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = ctx.fillStyle;
  ctx.lineWidth = Math.max(1.5, size * 0.07);
  ctx.lineCap = 'round';

  for (let i = 1; i <= 3; i++) {
    ctx.beginPath();
    ctx.arc(cx + s * 0.05, cy, s * 0.2 * i, -Math.PI / 4, Math.PI / 4);
    ctx.stroke();
  }
}
