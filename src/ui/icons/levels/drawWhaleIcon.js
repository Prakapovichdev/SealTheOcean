export function drawWhaleIcon(ctx, cx, cy, size) {
  const r = size / 2;

  ctx.save();
  ctx.translate(cx, cy);

  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(0, r * 0.75, r * 0.7, r * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const gradient = ctx.createLinearGradient(0, -r * 0.6, 0, r * 0.6);
  gradient.addColorStop(0, '#6fa8d6');
  gradient.addColorStop(0.5, '#3d6fa3');
  gradient.addColorStop(1, '#1f4570');

  ctx.fillStyle = gradient;

  ctx.beginPath();
  ctx.moveTo(-r * 0.95, 0);

  ctx.lineTo(-r * 0.95, -r * 0.35);
  ctx.lineTo(-r * 0.7, -r * 0.05);

  ctx.bezierCurveTo(-r * 0.4, -r * 0.6, r * 0.4, -r * 0.6, r * 0.85, -r * 0.25);
  ctx.quadraticCurveTo(r * 1.0, 0, r * 0.85, r * 0.25);

  ctx.bezierCurveTo(r * 0.4, r * 0.55, -r * 0.4, r * 0.55, -r * 0.7, r * 0.05);
  ctx.lineTo(-r * 0.95, r * 0.35);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#0f2848';
  ctx.lineWidth = Math.max(1, size * 0.04);
  ctx.stroke();

  ctx.fillStyle = 'rgba(220, 235, 250, 0.6)';
  ctx.beginPath();
  ctx.moveTo(-r * 0.6, r * 0.15);
  ctx.bezierCurveTo(-r * 0.2, r * 0.55, r * 0.4, r * 0.5, r * 0.8, r * 0.2);
  ctx.quadraticCurveTo(r * 0.4, r * 0.35, -r * 0.6, r * 0.15);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#0f2848';
  ctx.beginPath();
  ctx.arc(r * 0.55, -r * 0.05, r * 0.07, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(r * 0.57, -r * 0.07, r * 0.025, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f2848';
  ctx.beginPath();
  ctx.ellipse(r * 0.4, -r * 0.52, r * 0.06, r * 0.025, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(180, 220, 255, 0.85)';

  ctx.beginPath();
  ctx.ellipse(r * 0.4, -r * 0.62, r * 0.12, r * 0.07, 0, 0, Math.PI * 2);
  ctx.fill();

  const drops = [
    { x: 0.18, y: -0.78, rx: 0.035, ry: 0.06, rot: -0.5 },
    { x: 0.28, y: -0.88, rx: 0.04, ry: 0.07, rot: -0.25 },
    { x: 0.4, y: -0.95, rx: 0.045, ry: 0.08, rot: 0 },
    { x: 0.52, y: -0.88, rx: 0.04, ry: 0.07, rot: 0.25 },
    { x: 0.62, y: -0.78, rx: 0.035, ry: 0.06, rot: 0.5 },
  ];

  for (const d of drops) {
    ctx.beginPath();
    ctx.ellipse(r * d.x, r * d.y, r * d.rx, r * d.ry, d.rot, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(200, 230, 255, 0.7)';
  const sparkles = [
    { x: 0.24, y: -0.72, r: 0.018 },
    { x: 0.46, y: -0.7, r: 0.02 },
    { x: 0.58, y: -0.72, r: 0.018 },
    { x: 0.34, y: -0.82, r: 0.015 },
    { x: 0.5, y: -0.83, r: 0.015 },
  ];
  for (const s of sparkles) {
    ctx.beginPath();
    ctx.arc(r * s.x, r * s.y, r * s.r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.beginPath();
  ctx.ellipse(r * 0.1, -r * 0.4, r * 0.3, r * 0.08, -0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
