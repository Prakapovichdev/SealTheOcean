export function drawShellIcon(ctx, cx, cy, size) {
  const r = size / 2;

  ctx.save();
  ctx.translate(cx, cy);

  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(0, r * 0.82, r * 0.72, r * 0.11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const hingeY = r * 0.72;
  const ribs = 9;

  const spread = Math.PI * 0.92;
  const outerR = r * 1.02;

  const edgePoints = [];
  const segments = ribs * 2;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = -Math.PI / 2 - spread / 2 + t * spread;

    const isRibTip = i % 2 === 1;
    const rr = isRibTip ? outerR : outerR * 0.93;
    edgePoints.push({
      x: Math.cos(angle) * rr,
      y: hingeY + Math.sin(angle) * (rr + hingeY * 0.15),
      angle,
    });
  }

  const gradient = ctx.createLinearGradient(0, -r, 0, r);
  gradient.addColorStop(0, '#ffe4c4');
  gradient.addColorStop(0.45, '#f3a368');
  gradient.addColorStop(1, '#a85a22');

  ctx.fillStyle = gradient;
  ctx.beginPath();

  ctx.moveTo(-r * 0.22, hingeY);
  ctx.quadraticCurveTo(-r * 0.45, hingeY - r * 0.02, edgePoints[0].x, edgePoints[0].y);

  for (let i = 1; i < edgePoints.length; i++) {
    const p0 = edgePoints[i - 1];
    const p1 = edgePoints[i];
    const mx = (p0.x + p1.x) / 2;
    const my = (p0.y + p1.y) / 2;
    ctx.quadraticCurveTo(p0.x, p0.y, mx, my);
  }
  const last = edgePoints[edgePoints.length - 1];
  ctx.quadraticCurveTo(last.x, last.y, r * 0.22, hingeY);

  ctx.quadraticCurveTo(0, hingeY + r * 0.08, -r * 0.22, hingeY);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#6b3410';
  ctx.lineWidth = Math.max(1, size * 0.045);
  ctx.lineJoin = 'round';
  ctx.stroke();

  ctx.strokeStyle = '#6b3410';
  ctx.lineWidth = Math.max(0.8, size * 0.03);
  ctx.lineCap = 'round';
  ctx.globalAlpha = 0.55;

  for (let i = 0; i < ribs; i++) {
    const tip = edgePoints[i * 2 + 1];

    const midX = tip.x * 0.5;
    const midY = (hingeY + tip.y) / 2;
    const bulge = 0.08;
    const cpX = midX + tip.x * bulge;
    const cpY = midY + r * 0.04;

    ctx.beginPath();
    ctx.moveTo(0, hingeY - r * 0.02);
    ctx.quadraticCurveTo(cpX, cpY, tip.x * 0.96, tip.y * 0.96);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(255, 240, 220, 0.5)';
  ctx.lineWidth = Math.max(0.5, size * 0.012);
  ctx.globalAlpha = 0.8;
  for (let i = 0; i < ribs - 1; i++) {
    const valley = edgePoints[i * 2 + 2];
    ctx.beginPath();
    ctx.moveTo(0, hingeY - r * 0.02);
    ctx.quadraticCurveTo(valley.x * 0.5, (hingeY + valley.y) / 2, valley.x * 0.94, valley.y * 0.94);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#6b3410';
  ctx.beginPath();
  ctx.ellipse(0, hingeY, r * 0.14, r * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.2, -r * 0.15, r * 0.22, r * 0.12, -0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.32, -r * 0.22, r * 0.08, r * 0.04, -0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
