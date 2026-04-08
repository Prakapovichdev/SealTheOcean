import { BW, BH } from '../../../config/constants.js';

export function drawOceanBackdrop(
  ctx,
  {
    topColor,
    midColor,
    bottomColor,
    rayAlpha,
    rayCount,
    rayStartX,
    rayStep,
    rayTopWidth,
    rayWidthStep,
    rayBottomFactor,
    rayHeight,
    bubbleDrawer,
  },
) {
  const background = ctx.createLinearGradient(0, 0, 0, BH);
  background.addColorStop(0, topColor);
  background.addColorStop(0.5, midColor);
  background.addColorStop(1, bottomColor);

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, BW, BH);

  ctx.save();
  ctx.globalAlpha = rayAlpha;

  for (let i = 0; i < rayCount; i++) {
    const x = BW * (rayStartX + i * rayStep);
    const width = rayTopWidth + i * rayWidthStep;
    const gradient = ctx.createLinearGradient(x, 0, x, rayHeight);
    gradient.addColorStop(0, '#7ef8e8');
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(x - width, 0);
    ctx.lineTo(x + width, 0);
    ctx.lineTo(x + width * rayBottomFactor, rayHeight);
    ctx.lineTo(x - width * rayBottomFactor, rayHeight);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();

  bubbleDrawer?.();
}
