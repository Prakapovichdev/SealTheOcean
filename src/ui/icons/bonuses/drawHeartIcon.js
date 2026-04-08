export function drawHeartIcon(ctx, cx, cy, size) {
  const r = size / 2;

  ctx.save();
  ctx.translate(cx, cy);

  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(0, r * 0.88, r * 0.6, r * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const gradient = ctx.createLinearGradient(0, -r, 0, r);
  gradient.addColorStop(0, '#ff8fa8');
  gradient.addColorStop(0.5, '#e83358');
  gradient.addColorStop(1, '#8a0a25');

  ctx.fillStyle = gradient;

  ctx.beginPath();
  ctx.moveTo(0, r * 0.85);

  ctx.bezierCurveTo(-r * 1.1, r * 0.25, -r * 0.95, -r * 0.75, 0, -r * 0.3);

  ctx.bezierCurveTo(r * 0.95, -r * 0.75, r * 1.1, r * 0.25, 0, r * 0.85);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#5a0518';
  ctx.lineWidth = Math.max(1, size * 0.04);
  ctx.lineJoin = 'round';
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.4, -r * 0.05, r * 0.18, r * 0.28, -0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
