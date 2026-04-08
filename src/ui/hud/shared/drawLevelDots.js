import { BW } from '../../../config/constants.js';
import { HUD_THEME } from '../hudTheme.js';

export function drawLevelDots(ctx, currentLevel, totalLevels, y) {
  const startX = BW / 2 - (totalLevels * 14) / 2 + 7;

  for (let i = 0; i < totalLevels; i++) {
    ctx.fillStyle = i === currentLevel ? HUD_THEME.colors.accent : 'rgba(255,255,255,.2)';
    ctx.beginPath();
    ctx.arc(startX + i * 14, y, i === currentLevel ? 4.5 : 3, 0, Math.PI * 2);
    ctx.fill();
  }
}
