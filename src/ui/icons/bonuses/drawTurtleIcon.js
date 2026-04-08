export function drawTurtleIcon(ctx, cx, cy, size) {
  const r = size / 2;

  ctx.save();
  ctx.translate(cx, cy);

  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(0, r * 0.85, r * 0.75, r * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#7ab85c';
  ctx.strokeStyle = '#2d5a1a';
  ctx.lineWidth = Math.max(1, size * 0.035);

  const legs = [
    { x: -r * 0.55, y: -r * 0.35, rx: r * 0.22, ry: r * 0.15, rot: -0.5 },
    { x: r * 0.55, y: -r * 0.35, rx: r * 0.22, ry: r * 0.15, rot: 0.5 },
    { x: -r * 0.55, y: r * 0.45, rx: r * 0.22, ry: r * 0.15, rot: 0.5 },
    { x: r * 0.55, y: r * 0.45, rx: r * 0.22, ry: r * 0.15, rot: -0.5 },
  ];

  legs.forEach(({ x, y, rx, ry, rot }) => {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  ctx.fillStyle = '#7ab85c';
  ctx.beginPath();
  ctx.ellipse(0, -r * 0.7, r * 0.22, r * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#0a1a05';
  ctx.beginPath();
  ctx.arc(-r * 0.08, -r * 0.73, r * 0.035, 0, Math.PI * 2);
  ctx.arc(r * 0.08, -r * 0.73, r * 0.035, 0, Math.PI * 2);
  ctx.fill();

  const gradient = ctx.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.1, 0, 0, r * 0.7);
  gradient.addColorStop(0, '#a87d3a');
  gradient.addColorStop(0.6, '#704818');
  gradient.addColorStop(1, '#3a2308');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, r * 0.05, r * 0.65, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#2a1805';
  ctx.lineWidth = Math.max(1, size * 0.045);
  ctx.stroke();

  ctx.strokeStyle = '#2a1805';
  ctx.lineWidth = Math.max(0.8, size * 0.03);

  ctx.beginPath();
  ctx.arc(0, r * 0.05, r * 0.18, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * r * 0.18, r * 0.05 + Math.sin(a) * r * 0.18);
    ctx.lineTo(Math.cos(a) * r * 0.62, r * 0.05 + Math.sin(a) * r * 0.62);
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(255, 240, 200, 0.4)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.25, -r * 0.2, r * 0.15, r * 0.22, -0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
