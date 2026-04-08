export function drawSeal(ctx, cx, padBottom, paddleWidth, hitAnim = 0) {
  const bodyWidth = Math.min(paddleWidth * 0.62, 54);
  const bodyHeight = 38;
  const headRadius = bodyWidth * 0.42;
  const headY = padBottom + headRadius;
  const bodyTopY = headY + headRadius * 0.72;

  drawShadow(ctx, cx, bodyTopY, bodyWidth, bodyHeight);
  drawTail(ctx, cx, bodyTopY, bodyWidth, bodyHeight);
  drawBody(ctx, cx, bodyTopY, bodyWidth, bodyHeight);
  drawFrontFlippers(ctx, cx, bodyTopY, bodyWidth, bodyHeight, hitAnim);
  drawNeck(ctx, cx, padBottom, headRadius);
  drawHead(ctx, cx, headY, headRadius);
  drawFace(ctx, cx, headY, headRadius);
}

function drawShadow(ctx, cx, bodyTopY, bodyWidth, bodyHeight) {
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(
    cx + 2,
    bodyTopY + bodyHeight * 0.52 + 3,
    bodyWidth * 0.44,
    bodyHeight * 0.25,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.restore();
}

function drawTail(ctx, cx, bodyTopY, bodyWidth, bodyHeight) {
  ctx.fillStyle = '#2e6882';

  ctx.beginPath();
  ctx.moveTo(cx - bodyWidth * 0.28, bodyTopY + bodyHeight * 0.82);
  ctx.quadraticCurveTo(
    cx - bodyWidth * 0.62,
    bodyTopY + bodyHeight * 1.1,
    cx - bodyWidth * 0.4,
    bodyTopY + bodyHeight,
  );
  ctx.lineTo(cx - bodyWidth * 0.18, bodyTopY + bodyHeight * 0.88);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx + bodyWidth * 0.28, bodyTopY + bodyHeight * 0.82);
  ctx.quadraticCurveTo(
    cx + bodyWidth * 0.62,
    bodyTopY + bodyHeight * 1.1,
    cx + bodyWidth * 0.4,
    bodyTopY + bodyHeight,
  );
  ctx.lineTo(cx + bodyWidth * 0.18, bodyTopY + bodyHeight * 0.88);
  ctx.closePath();
  ctx.fill();
}

function drawBody(ctx, cx, bodyTopY, bodyWidth, bodyHeight) {
  const gradient = ctx.createRadialGradient(
    cx - bodyWidth * 0.15,
    bodyTopY + bodyHeight * 0.3,
    2,
    cx,
    bodyTopY + bodyHeight * 0.5,
    bodyWidth * 0.56,
  );
  gradient.addColorStop(0, '#caeef8');
  gradient.addColorStop(0.5, '#72b4d4');
  gradient.addColorStop(1, '#2e6882');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(
    cx,
    bodyTopY + bodyHeight * 0.52,
    bodyWidth * 0.46,
    bodyHeight * 0.48,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  ctx.fillStyle = 'rgba(215,245,255,.5)';
  ctx.beginPath();
  ctx.ellipse(
    cx,
    bodyTopY + bodyHeight * 0.58,
    bodyWidth * 0.24,
    bodyHeight * 0.3,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();
}

function drawFrontFlippers(ctx, cx, bodyTopY, bodyWidth, bodyHeight, hitAnim) {
  const flipAngle = hitAnim > 0 ? Math.sin((1 - hitAnim / 14) * Math.PI) * 0.4 : 0;

  ctx.save();
  ctx.fillStyle = '#2e6882';
  ctx.translate(cx - bodyWidth * 0.34, bodyTopY + bodyHeight * 0.38);
  ctx.rotate(-flipAngle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-bodyWidth * 0.44, bodyHeight * 0.22, -bodyWidth * 0.24, bodyHeight * 0.5);
  ctx.quadraticCurveTo(-bodyWidth * 0.02, bodyHeight * 0.34, bodyWidth * 0.12, bodyHeight * 0.04);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = '#2e6882';
  ctx.translate(cx + bodyWidth * 0.34, bodyTopY + bodyHeight * 0.38);
  ctx.rotate(flipAngle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(bodyWidth * 0.44, bodyHeight * 0.22, bodyWidth * 0.24, bodyHeight * 0.5);
  ctx.quadraticCurveTo(bodyWidth * 0.02, bodyHeight * 0.34, -bodyWidth * 0.12, bodyHeight * 0.04);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawNeck(ctx, cx, padBottom, headRadius) {
  ctx.fillStyle = '#5a9ec0';
  ctx.beginPath();
  ctx.ellipse(
    cx,
    padBottom + headRadius * 1.8,
    headRadius * 0.5,
    headRadius * 0.55,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();
}

function drawHead(ctx, cx, headY, headRadius) {
  const gradient = ctx.createRadialGradient(
    cx - headRadius * 0.2,
    headY - headRadius * 0.2,
    headRadius * 0.08,
    cx,
    headY,
    headRadius,
  );
  gradient.addColorStop(0, '#d8f0fc');
  gradient.addColorStop(0.55, '#72b4d4');
  gradient.addColorStop(1, '#2e6882');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(cx, headY, headRadius, 0, Math.PI * 2);
  ctx.fill();
}

function drawFace(ctx, cx, headY, headRadius) {
  const eyeY = headY - headRadius * 0.08;
  const eyeOffsetX = headRadius * 0.36;

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(cx - eyeOffsetX, eyeY, 5, 5.5, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + eyeOffsetX, eyeY, 5, 5.5, 0.15, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#001828';
  ctx.beginPath();
  ctx.ellipse(cx - eyeOffsetX + 0.5, eyeY + 0.5, 3.2, 3.8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + eyeOffsetX - 0.5, eyeY + 0.5, 3.2, 3.8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(cx - eyeOffsetX - 1, eyeY - 1.6, 1.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + eyeOffsetX - 1, eyeY - 1.6, 1.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1e4e68';
  ctx.beginPath();
  ctx.ellipse(cx, headY + headRadius * 0.3, 5.5, 3.8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(200,235,248,.72)';
  ctx.lineWidth = 0.95;

  ctx.beginPath();
  ctx.moveTo(cx - 7, headY + headRadius * 0.28);
  ctx.lineTo(cx - 20, headY + headRadius * 0.2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx - 7, headY + headRadius * 0.38);
  ctx.lineTo(cx - 20, headY + headRadius * 0.38);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + 7, headY + headRadius * 0.28);
  ctx.lineTo(cx + 20, headY + headRadius * 0.2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + 7, headY + headRadius * 0.38);
  ctx.lineTo(cx + 20, headY + headRadius * 0.38);
  ctx.stroke();
}
