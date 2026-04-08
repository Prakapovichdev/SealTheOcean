import { BW } from '../config/constants.js';
import { roundRect } from '../utils/math.js';

import { drawIcon } from './icons/index.js';

const NOTIF_ICON_SIZE = 24;

export class BonusNotif {
  constructor(gameState) {
    this._gs = gameState;
  }

  draw(ctx) {
    const bn = this._gs.bonusNotif;
    if (!bn || bn.alpha <= 0) return;

    const cx = BW / 2;
    const nw = 220;
    const nh = 46;
    const nx = cx - nw / 2;
    const ny = bn.y;

    ctx.save();
    ctx.globalAlpha = Math.min(1, bn.alpha * 2.5);

    ctx.fillStyle = 'rgba(0,12,26,.9)';
    roundRect(ctx, nx, ny, nw, nh, 12);

    ctx.fillStyle = bn.color;
    roundRect(ctx, nx, ny, 4, nh, 2);

    ctx.save();
    ctx.shadowColor = bn.color;
    ctx.shadowBlur = 14;
    ctx.strokeStyle = bn.color;
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = bn.alpha * 0.7;
    roundRect(ctx, nx, ny, nw, nh, 12, true);
    ctx.restore();

    ctx.globalAlpha = bn.alpha;
    drawIcon(ctx, bn.icon, nx + 28, ny + nh / 2, NOTIF_ICON_SIZE);

    ctx.fillStyle = '#fff';
    ctx.font = '600 13px "Segoe UI",sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(bn.label, nx + 50, ny + nh * 0.38);

    ctx.fillStyle = bn.color;
    ctx.font = '400 11px "Segoe UI",sans-serif';
    ctx.fillText(bn.desc, nx + 50, ny + nh * 0.68);

    ctx.restore();
  }
}
