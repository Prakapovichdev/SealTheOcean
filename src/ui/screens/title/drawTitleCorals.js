import { BW, BH } from '../../../config/constants.js';

export function drawTitleCorals(ctx) {
  const baseY = BH * 0.88;
  const corals = [
    [60, 1],
    [130, 0.8],
    [200, 1.1],
    [260, 0.75],
    [320, 1],
    [BW - 60, 1],
    [BW - 130, 0.85],
  ];

  for (const [x, scale] of corals) {
    ctx.save();
    ctx.globalAlpha = 0.18 * scale;
    ctx.fillStyle = '#ff7a50';
    ctx.translate(x, baseY);
    ctx.scale(scale, scale);

    ctx.fillRect(-3, 0, 6, -40);

    const branches = [
      [-14, -28, -4, -14],
      [4, -14, 14, -28],
      [-10, -18, -2, -8],
      [2, -8, 10, -18],
    ];

    ctx.strokeStyle = '#ff7a50';
    ctx.lineWidth = 3;

    for (const [x1, y1, x2, y2] of branches) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    const tips = [
      [-14, -28],
      [14, -28],
      [-4, -14],
      [4, -14],
      [-3, -40],
      [3, -40],
    ];

    for (const [tipX, tipY] of tips) {
      ctx.beginPath();
      ctx.arc(tipX, tipY, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
