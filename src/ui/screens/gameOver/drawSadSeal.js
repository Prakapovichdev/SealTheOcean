export function drawSadSeal(ctx, cx, cy, size, time) {
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(cx + 3, cy + size * 0.55 + 4, size * 0.48, size * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = '#2e6882';

  ctx.save();
  ctx.translate(cx - size * 0.38, cy + size * 0.1);
  ctx.rotate(0.55);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-size * 0.44, size * 0.24, -size * 0.24, size * 0.52);
  ctx.quadraticCurveTo(-size * 0.02, size * 0.36, size * 0.12, size * 0.04);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(cx + size * 0.38, cy + size * 0.1);
  ctx.rotate(-0.55);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(size * 0.44, size * 0.24, size * 0.24, size * 0.52);
  ctx.quadraticCurveTo(size * 0.02, size * 0.36, -size * 0.12, size * 0.04);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  const bodyGradient = ctx.createRadialGradient(
    cx - size * 0.15,
    cy - size * 0.2,
    size * 0.08,
    cx,
    cy + size * 0.05,
    size * 0.54,
  );
  bodyGradient.addColorStop(0, '#caeef8');
  bodyGradient.addColorStop(0.5, '#72b4d4');
  bodyGradient.addColorStop(1, '#2e6882');

  ctx.fillStyle = bodyGradient;
  ctx.beginPath();
  ctx.ellipse(cx, cy + size * 0.05, size * 0.44, size * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(215,245,255,.4)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + size * 0.1, size * 0.22, size * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#2e6882';
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.28, cy + size * 0.48);
  ctx.quadraticCurveTo(cx - size * 0.6, cy + size * 0.78, cx - size * 0.38, cy + size * 0.68);
  ctx.lineTo(cx - size * 0.16, cy + size * 0.54);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx + size * 0.28, cy + size * 0.48);
  ctx.quadraticCurveTo(cx + size * 0.6, cy + size * 0.78, cx + size * 0.38, cy + size * 0.68);
  ctx.lineTo(cx + size * 0.16, cy + size * 0.54);
  ctx.closePath();
  ctx.fill();

  const headRadius = size * 0.42;
  const headY = cy - size * 0.46;
  const headGradient = ctx.createRadialGradient(
    cx - headRadius * 0.2,
    headY - headRadius * 0.2,
    headRadius * 0.08,
    cx,
    headY,
    headRadius,
  );
  headGradient.addColorStop(0, '#d8f0fc');
  headGradient.addColorStop(0.55, '#72b4d4');
  headGradient.addColorStop(1, '#2e6882');

  ctx.fillStyle = headGradient;
  ctx.beginPath();
  ctx.arc(cx, headY, headRadius, 0, Math.PI * 2);
  ctx.fill();

  const eyeY = headY + headRadius * 0.04;
  const eyeOffsetX = headRadius * 0.35;

  ctx.strokeStyle = '#1e4e68';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(cx - eyeOffsetX - 7, eyeY - 9);
  ctx.lineTo(cx - eyeOffsetX + 4, eyeY - 6);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + eyeOffsetX + 7, eyeY - 9);
  ctx.lineTo(cx + eyeOffsetX - 4, eyeY - 6);
  ctx.stroke();

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(cx - eyeOffsetX, eyeY, 5, 5.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + eyeOffsetX, eyeY, 5, 5.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#001828';
  ctx.beginPath();
  ctx.ellipse(cx - eyeOffsetX + 0.4, eyeY + 1.8, 3, 3.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + eyeOffsetX - 0.4, eyeY + 1.8, 3, 3.6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,.9)';
  ctx.beginPath();
  ctx.arc(cx - eyeOffsetX - 0.8, eyeY - 0.6, 1.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + eyeOffsetX - 0.8, eyeY - 0.6, 1.2, 0, Math.PI * 2);
  ctx.fill();

  const tearPhase1 = ((time * 0.9) % 1.6) / 1.6;
  const tearPhase2 = ((time * 0.9 + 0.8) % 1.6) / 1.6;
  const tearBaseY = eyeY + 6;
  const tearMaxDrop = headRadius * 1.1;

  [
    [cx - eyeOffsetX + 0.4, tearPhase1],
    [cx + eyeOffsetX - 0.4, tearPhase2],
  ].forEach(([tearX, phase]) => {
    const tearY = tearBaseY + phase * tearMaxDrop;
    const tearSize = 3.5 - phase * 1.5;

    ctx.save();
    ctx.fillStyle = `rgba(120,210,255,${0.8 - phase * 0.5})`;
    ctx.beginPath();
    ctx.arc(tearX, tearY, tearSize, Math.PI, 0);
    ctx.lineTo(tearX, tearY - tearSize * 2.2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });

  ctx.fillStyle = '#1e4e68';
  ctx.beginPath();
  ctx.ellipse(cx, headY + headRadius * 0.32, 5.5, 3.8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#1e4e68';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 9, headY + headRadius * 0.44);
  ctx.quadraticCurveTo(cx, headY + headRadius * 0.35, cx + 9, headY + headRadius * 0.44);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(200,235,248,.65)';
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(cx - 7, headY + headRadius * 0.3);
  ctx.lineTo(cx - 21, headY + headRadius * 0.22);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx - 7, headY + headRadius * 0.4);
  ctx.lineTo(cx - 21, headY + headRadius * 0.4);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + 7, headY + headRadius * 0.3);
  ctx.lineTo(cx + 21, headY + headRadius * 0.22);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + 7, headY + headRadius * 0.4);
  ctx.lineTo(cx + 21, headY + headRadius * 0.4);
  ctx.stroke();
}
