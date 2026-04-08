export function drawBombIcon(ctx, cx, cy, size) {
  const r = size / 2;

  ctx.save();
  ctx.translate(cx, cy);

  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(0, r * 0.85, r * 0.65, r * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const gradient = ctx.createRadialGradient(-r * 0.25, -r * 0.25, r * 0.05, 0, 0, r * 0.85);
  gradient.addColorStop(0, '#5a5a6a');
  gradient.addColorStop(0.6, '#2a2a35');
  gradient.addColorStop(1, '#0a0a12');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, r * 0.15, r * 0.7, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#000';
  ctx.lineWidth = Math.max(1, size * 0.04);
  ctx.stroke();

  ctx.fillStyle = '#3a2818';
  ctx.beginPath();
  ctx.rect(-r * 0.15, -r * 0.6, r * 0.3, r * 0.18);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = '#8a6a3a';
  ctx.lineWidth = Math.max(1.5, size * 0.06);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.6);
  ctx.bezierCurveTo(r * 0.35, -r * 0.85, r * 0.55, -r * 0.6, r * 0.65, -r * 0.95);
  ctx.stroke();

  const sparkX = r * 0.65;
  const sparkY = -r * 0.95;

  const sparkGradient = ctx.createRadialGradient(sparkX, sparkY, 0, sparkX, sparkY, r * 0.3);
  sparkGradient.addColorStop(0, '#fff8b0');
  sparkGradient.addColorStop(0.4, '#ffaa20');
  sparkGradient.addColorStop(1, 'rgba(255, 60, 0, 0)');
  ctx.fillStyle = sparkGradient;
  ctx.beginPath();
  ctx.arc(sparkX, sparkY, r * 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#fff5a0';
  ctx.lineWidth = Math.max(1, size * 0.04);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(sparkX + Math.cos(a) * r * 0.08, sparkY + Math.sin(a) * r * 0.08);
    ctx.lineTo(sparkX + Math.cos(a) * r * 0.2, sparkY + Math.sin(a) * r * 0.2);
    ctx.stroke();
  }

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(sparkX, sparkY, r * 0.06, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.25, -r * 0.15, r * 0.18, r * 0.25, -0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
