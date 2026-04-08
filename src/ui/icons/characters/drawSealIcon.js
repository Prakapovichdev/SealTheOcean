export function drawSealIcon(ctx, cx, cy, size) {
  const headRadius = size * 0.28;
  const headY = cy - size * 0.18;
  const bodyTopY = headY + headRadius * 0.72;
  const bodyWidth = size * 0.7;
  const bodyHeight = size * 0.5;

  drawShadow(ctx, cx, bodyTopY, bodyWidth, bodyHeight);
  drawTail(ctx, cx, bodyTopY, bodyWidth, bodyHeight);
  drawBody(ctx, cx, bodyTopY, bodyWidth, bodyHeight);
  drawFrontFlippers(ctx, cx, bodyTopY, bodyWidth, bodyHeight);
  drawNeck(ctx, cx, headY, headRadius);
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

function drawFrontFlippers(ctx, cx, bodyTopY, bodyWidth, bodyHeight) {
  ctx.save();
  ctx.fillStyle = '#2e6882';
  ctx.translate(cx - bodyWidth * 0.34, bodyTopY + bodyHeight * 0.38);
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
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(bodyWidth * 0.44, bodyHeight * 0.22, bodyWidth * 0.24, bodyHeight * 0.5);
  ctx.quadraticCurveTo(bodyWidth * 0.02, bodyHeight * 0.34, -bodyWidth * 0.12, bodyHeight * 0.04);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawNeck(ctx, cx, headY, headRadius) {
  ctx.fillStyle = '#5a9ec0';
  ctx.beginPath();
  ctx.ellipse(cx, headY + headRadius * 0.8, headRadius * 0.5, headRadius * 0.55, 0, 0, Math.PI * 2);
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

  const eyeRx = headRadius * 0.22;
  const eyeRy = headRadius * 0.24;

  const pupilRx = headRadius * 0.14;
  const pupilRy = headRadius * 0.17;

  const highlightR = headRadius * 0.057;

  const noseRx = headRadius * 0.24;
  const noseRy = headRadius * 0.17;

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(cx - eyeOffsetX, eyeY, eyeRx, eyeRy, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + eyeOffsetX, eyeY, eyeRx, eyeRy, 0.15, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#001828';
  ctx.beginPath();
  ctx.ellipse(
    cx - eyeOffsetX + headRadius * 0.022,
    eyeY + headRadius * 0.022,
    pupilRx,
    pupilRy,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(
    cx + eyeOffsetX - headRadius * 0.022,
    eyeY + headRadius * 0.022,
    pupilRx,
    pupilRy,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(
    cx - eyeOffsetX - headRadius * 0.044,
    eyeY - headRadius * 0.07,
    highlightR,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.beginPath();
  ctx.arc(
    cx + eyeOffsetX - headRadius * 0.044,
    eyeY - headRadius * 0.07,
    highlightR,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  ctx.fillStyle = '#1e4e68';
  ctx.beginPath();
  ctx.ellipse(cx, headY + headRadius * 0.3, noseRx, noseRy, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(200,235,248,.72)';
  ctx.lineWidth = Math.max(0.8, headRadius * 0.042);

  const whiskerStart = headRadius * 0.31;
  const whiskerFar = headRadius * 0.88;

  ctx.beginPath();
  ctx.moveTo(cx - whiskerStart, headY + headRadius * 0.28);
  ctx.lineTo(cx - whiskerFar, headY + headRadius * 0.2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx - whiskerStart, headY + headRadius * 0.38);
  ctx.lineTo(cx - whiskerFar, headY + headRadius * 0.38);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + whiskerStart, headY + headRadius * 0.28);
  ctx.lineTo(cx + whiskerFar, headY + headRadius * 0.2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + whiskerStart, headY + headRadius * 0.38);
  ctx.lineTo(cx + whiskerFar, headY + headRadius * 0.38);
  ctx.stroke();
}
