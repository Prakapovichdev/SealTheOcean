export function drawCoralIcon(ctx, cx, cy, size) {
  const r = size / 2;

  ctx.save();
  ctx.translate(cx, cy);

  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(0, r * 0.85, r * 0.6, r * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const gradient = ctx.createLinearGradient(0, -r, 0, r);
  gradient.addColorStop(0, '#ff9ec4');
  gradient.addColorStop(0.5, '#e85a8c');
  gradient.addColorStop(1, '#a8325f');

  ctx.strokeStyle = gradient;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.lineWidth = size * 0.18;
  ctx.beginPath();
  ctx.moveTo(0, r * 0.8);
  ctx.lineTo(0, r * 0.3);
  ctx.stroke();

  const branches = [
    { angle: -Math.PI / 2, length: 0.95 },
    { angle: -Math.PI / 2 - 0.9, length: 0.85 },
    { angle: -Math.PI / 2 + 0.9, length: 0.85 },
  ];

  ctx.lineWidth = size * 0.14;
  branches.forEach(({ angle, length }) => {
    const x1 = 0;
    const y1 = r * 0.3;
    const x2 = Math.cos(angle) * r * length;
    const y2 = r * 0.3 + Math.sin(angle) * r * length;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(
      (x1 + x2) / 2 + Math.cos(angle + Math.PI / 2) * r * 0.1,
      (y1 + y2) / 2 + Math.sin(angle + Math.PI / 2) * r * 0.1,
      x2,
      y2,
    );
    ctx.stroke();

    ctx.fillStyle = '#ffc2d8';
    ctx.beginPath();
    ctx.arc(x2, y2, r * 0.13, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#a8325f';
    ctx.lineWidth = Math.max(1, size * 0.03);
    ctx.stroke();

    ctx.strokeStyle = gradient;
    ctx.lineWidth = size * 0.14;
  });

  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.05, -r * 0.2, r * 0.04, r * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
