import { roundRect } from '../../utils/math.js';
import { drawIcon } from '../../ui/icons/index.js';

const BONUS_BOX_SIZE = 40;
const BONUS_BOX_RADIUS = 9;
const BONUS_ICON_SIZE = 26;

export class BonusRenderer {
  constructor(gameState) {
    this._gs = gameState;
  }

  draw(ctx) {
    const bonuses = this._gs.bonus;
    if (bonuses.length === 0) {
      return;
    }

    const time = performance.now() * 0.001;

    for (const bonus of bonuses) {
      this._drawBonus(ctx, bonus, time);
    }
  }

  _drawBonus(ctx, bonus, time) {
    const size = BONUS_BOX_SIZE;

    ctx.save();
    ctx.translate(bonus.x, bonus.y);

    this._drawGlowCard(ctx, bonus, size, time);
    this._drawIcon(ctx, bonus);

    ctx.restore();
  }

  _drawGlowCard(ctx, bonus, size, time) {
    const glow = 0.7 + 0.3 * Math.sin(time * 6 + bonus.wobble);

    ctx.save();
    ctx.shadowColor = bonus.color;
    ctx.shadowBlur = 14 * glow;
    ctx.fillStyle = 'rgba(0,14,28,.55)';
    roundRect(ctx, -size / 2, -size / 2, size, size, BONUS_BOX_RADIUS);

    ctx.strokeStyle = bonus.color;
    ctx.lineWidth = 1.8;
    ctx.globalAlpha = 0.85 * glow;
    roundRect(ctx, -size / 2, -size / 2, size, size, BONUS_BOX_RADIUS, true);
    ctx.restore();
  }

  _drawIcon(ctx, bonus) {
    ctx.globalAlpha = 1;
    drawIcon(ctx, bonus.icon, 0, 0, BONUS_ICON_SIZE);
  }
}
