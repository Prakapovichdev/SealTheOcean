export function drawFireIcon(ctx, cx, cy, size) {
  const r = size / 2;

  ctx.save();
  ctx.translate(cx, cy);

  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(0, r * 0.85, r * 0.6, r * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const gradient = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r);
  gradient.addColorStop(0, '#fff8a0');
  gradient.addColorStop(0.35, '#ffd23a');
  gradient.addColorStop(0.7, '#ff7020');
  gradient.addColorStop(1, '#c01a05');

  ctx.fillStyle = gradient;

  const points = 8;
  const outerR = r * 0.95;
  const innerR = r * 0.4;

  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const radius = i % 2 === 0 ? outerR : innerR;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#7a0a02';
  ctx.lineWidth = Math.max(1, size * 0.04);
  ctx.lineJoin = 'round';
  ctx.stroke();

  const innerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.5);
  innerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  innerGradient.addColorStop(1, 'rgba(255, 220, 100, 0)');

  ctx.fillStyle = innerGradient;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2 + 0.2;
    const radius = i % 2 === 0 ? r * 0.5 : r * 0.2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-r * 0.05, -r * 0.05, r * 0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
