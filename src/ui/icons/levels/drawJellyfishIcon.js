export function drawJellyfishIcon(ctx, cx, cy, size) {
  const r = size / 2;

  ctx.save();
  ctx.translate(cx, cy);

  ctx.globalAlpha = 0.2;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(0, r * 0.9, r * 0.5, r * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const gradient = ctx.createRadialGradient(0, -r * 0.3, r * 0.1, 0, 0, r);
  gradient.addColorStop(0, 'rgba(220, 200, 255, 0.95)');
  gradient.addColorStop(0.6, 'rgba(170, 130, 230, 0.85)');
  gradient.addColorStop(1, 'rgba(110, 70, 180, 0.75)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(-r * 0.85, r * 0.05);
  ctx.quadraticCurveTo(-r * 1.0, -r * 0.85, 0, -r * 0.9);
  ctx.quadraticCurveTo(r * 1.0, -r * 0.85, r * 0.85, r * 0.05);

  ctx.quadraticCurveTo(r * 0.65, r * 0.25, r * 0.45, r * 0.05);
  ctx.quadraticCurveTo(r * 0.25, r * 0.25, 0, r * 0.05);
  ctx.quadraticCurveTo(-r * 0.25, r * 0.25, -r * 0.45, r * 0.05);
  ctx.quadraticCurveTo(-r * 0.65, r * 0.25, -r * 0.85, r * 0.05);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#5a2a90';
  ctx.lineWidth = Math.max(1, size * 0.04);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.25, -r * 0.25, r * 0.1, r * 0.18, 0, 0, Math.PI * 2);
  ctx.ellipse(r * 0.25, -r * 0.25, r * 0.1, r * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(170, 130, 230, 0.85)';
  ctx.lineWidth = Math.max(1.2, size * 0.05);
  ctx.lineCap = 'round';

  const tentacles = 5;
  for (let i = 0; i < tentacles; i++) {
    const startX = -r * 0.6 + (i / (tentacles - 1)) * r * 1.2;
    const startY = r * 0.15;
    const endY = r * 0.95;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(
      startX + r * 0.15,
      startY + r * 0.25,
      startX - r * 0.15,
      startY + r * 0.55,
      startX + (i % 2 === 0 ? r * 0.08 : -r * 0.08),
      endY,
    );
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.35, -r * 0.55, r * 0.18, r * 0.1, -0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
