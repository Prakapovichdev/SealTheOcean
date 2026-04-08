import { BW, HUD_TOP, FIELD_BOTTOM } from '../../../config/constants.js';
import { drawPanel } from '../../shared/drawPanel.js';
import { SCREEN_THEME } from '../screenTheme.js';

export class PauseOverlay {
  draw(ctx) {
    ctx.fillStyle = 'rgba(0,8,20,.72)';
    ctx.fillRect(0, HUD_TOP, BW, FIELD_BOTTOM - HUD_TOP);

    const cx = BW / 2;
    const cy = (HUD_TOP + FIELD_BOTTOM) / 2;
    const w = 260;
    const h = 160;
    const x = cx - w / 2;
    const y = cy - h / 2;

    drawPanel(ctx, {
      x,
      y,
      w,
      h,
      radius: 18,
      fill: SCREEN_THEME.colors.panel,
      stroke: SCREEN_THEME.colors.accentSoft,
      glow: SCREEN_THEME.glow.panel,
    });

    ctx.fillStyle = SCREEN_THEME.colors.text;
    ctx.font = SCREEN_THEME.fonts.pauseTitle;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Пауза', cx, cy - 16);

    ctx.fillStyle = SCREEN_THEME.colors.textDim;
    ctx.font = SCREEN_THEME.fonts.caption;
    ctx.fillText('Нажми на экран', cx, cy + 16);
  }
}
