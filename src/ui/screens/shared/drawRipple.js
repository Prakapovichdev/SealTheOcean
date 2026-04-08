import { BW, BH } from '../../../config/constants.js';
import { SCREEN_THEME } from '../screenTheme.js';

export function drawRipple(ctx, progress, offsetY = 0) {
  if (progress <= 0) return;

  const cx = BW / 2;
  const cy = BH / 2 + offsetY;

  ctx.save();

  for (let i = 0; i < 3; i++) {
    const startOffset = i * 0.28;
    const localProgress = Math.max(0, (progress - startOffset) / (1 - startOffset));
    if (localProgress <= 0) continue;

    ctx.globalAlpha = (1 - localProgress) * 0.35;
    ctx.strokeStyle = SCREEN_THEME.colors.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, localProgress * 180, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}
