import { BW, BH } from '../../../config/constants.js';
import { SCREEN_THEME } from '../screenTheme.js';
import { drawPanel } from '../../shared/drawPanel.js';
import { drawButton } from '../shared/drawButton.js';
import { drawRipple } from '../shared/drawRipple.js';
import { drawIcon } from '../../icons/index.js';

const ICON_SIZE = 56;

export class TransitionModal {
  drawRipple(ctx, progress, offsetY = 0) {
    drawRipple(ctx, progress, offsetY);
  }

  draw(ctx, transitionState, time) {
    const alpha = transitionState.popAlpha;
    if (alpha <= 0) return;

    const cx = BW / 2;
    const cy = BH / 2;

    const w = 300;
    const h = 260;
    const x = cx - w / 2;
    const y = cy - h / 2 + transitionState.popY;
    const buttonY = y + h - 64 + transitionState.buttonY;

    ctx.save();
    ctx.globalAlpha = alpha;

    drawPanel(ctx, {
      x,
      y,
      w,
      h,
      radius: 22,
      fill: SCREEN_THEME.colors.panel,
      stroke: SCREEN_THEME.colors.accentSoft,
      glow: SCREEN_THEME.glow.panelStrong,
      shine: true,
    });

    ctx.save();
    ctx.globalAlpha = alpha * transitionState.contentAlpha;

    if (transitionState.icon) {
      drawIcon(ctx, transitionState.icon, cx, y + 50 + transitionState.contentY, ICON_SIZE);
    }

    ctx.fillStyle = SCREEN_THEME.colors.text;
    ctx.font = SCREEN_THEME.fonts.modalTitle;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(transitionState.title, cx, y + 100 + transitionState.contentY);

    ctx.fillStyle = SCREEN_THEME.colors.textSoft;
    ctx.font = SCREEN_THEME.fonts.caption;
    ctx.fillText(transitionState.sub, cx, y + 132 + transitionState.contentY);

    ctx.restore();

    const pulse = transitionState.phase === 'done' ? (0.5 + 0.5 * Math.sin(time * 2.2)) * 0.04 : 0;

    ctx.save();
    ctx.globalAlpha = alpha * transitionState.buttonAlpha;

    drawButton(ctx, {
      x: cx - 110,
      y: buttonY,
      w: 220,
      h: 46,
      radius: 23,
      label: transitionState.btn,
      stroke: SCREEN_THEME.colors.accentStrong,
      textColor: SCREEN_THEME.colors.accent,
      fillTop: 'rgba(34,240,168,.16)',
      fillBottom: 'rgba(14,196,134,.08)',
      glow: SCREEN_THEME.glow.button,
      pulse,
      font: SCREEN_THEME.fonts.buttonSm,
      glossAlpha: 0.05,
      lineWidth: 1.5,
    });

    ctx.restore();
    ctx.restore();
  }
}
