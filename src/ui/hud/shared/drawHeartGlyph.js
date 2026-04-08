export function drawHeartGlyph(ctx, cx, cy, r = 8) {
  ctx.save();

  ctx.shadowColor = '#ff6b9d';
  ctx.shadowBlur = r * 1.2;

  const gradient = ctx.createLinearGradient(cx, cy - r, cx, cy + r * 1.2);
  gradient.addColorStop(0, '#ff9ec0');
  gradient.addColorStop(0.55, '#ff6b9d');
  gradient.addColorStop(1, '#c93d6e');

  ctx.fillStyle = gradient;
  drawHeartPath(ctx, cx, cy, r);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(120,20,50,.55)';
  ctx.lineWidth = Math.max(0.8, r * 0.12);
  drawHeartPath(ctx, cx, cy, r);
  ctx.stroke();

  ctx.restore();
}

function drawHeartPath(ctx, cx, cy, r) {
  const opticalShiftY = -r * 0.18;

  const yy = cy + opticalShiftY;
  const bottom = yy + r * 1.1;
  const dipY = yy - r * 0.15;

  ctx.beginPath();
  ctx.moveTo(cx, bottom);

  ctx.bezierCurveTo(cx - r * 1.3, yy + r * 0.4, cx - r * 1.1, yy - r * 0.7, cx, dipY);

  ctx.bezierCurveTo(cx + r * 1.1, yy - r * 0.7, cx + r * 1.3, yy + r * 0.4, cx, bottom);

  ctx.closePath();
}
