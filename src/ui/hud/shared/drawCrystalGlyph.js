export function drawCrystalGlyph(ctx, cx, cy, r = 8) {
  ctx.save();
  ctx.translate(cx, cy);

  ctx.fillStyle = '#22f0a8';
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.lineTo(r, 0);
  ctx.lineTo(0, r);
  ctx.lineTo(-r, 0);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,.3)';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  ctx.restore();
}
