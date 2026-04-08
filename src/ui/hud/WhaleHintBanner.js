import { BW, HUD_TOP } from '../../config/constants.js';
import { roundRect } from '../../utils/math.js';

export class WhaleHintBanner {
  draw(ctx) {
    const w = 300;
    const h = 34;
    const x = BW / 2 - w / 2;
    const y = HUD_TOP + 12;

    ctx.save();
    ctx.globalAlpha = 0.9;

    ctx.fillStyle = 'rgba(0,20,50,0.88)';
    roundRect(ctx, x, y, w, h, 10);

    ctx.strokeStyle = '#4cc9f0';
    ctx.lineWidth = 1.2;
    ctx.shadowColor = '#4cc9f0';
    ctx.shadowBlur = 8;
    roundRect(ctx, x, y, w, h, 10, true);

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#90e8ff';
    ctx.font = '500 12px "Segoe UI",sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐋 Ударь кита 5 раз шариком — освободи его!', BW / 2, y + h / 2);

    ctx.restore();
  }
}
