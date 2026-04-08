import {
  BW,
  HUD_TOP,
  BLOCK_WIDTH,
  BLOCK_HEIGHT,
  BLOCK_GAP_X,
  BLOCK_GAP_Y,
  BLOCK_DEFS,
} from '../config/constants.js';
import { roundRect } from '../utils/math.js';
import { shade } from '../utils/color.js';
import { drawIcon } from '../ui/icons/index.js';

export class Block {
  static createBlocks(levelData) {
    const blocks = [];
    const { cols, layout, isWhaleLvl } = levelData;
    const rows = Math.ceil(layout.length / cols);

    const totalW = cols * BLOCK_WIDTH + (cols - 1) * BLOCK_GAP_X;
    const startX = (BW - totalW) / 2;
    const startY = isWhaleLvl ? HUD_TOP + 200 : HUD_TOP + 14;

    for (let i = 0; i < layout.length; i++) {
      const type = layout[i];
      if (!type) continue;

      const col = i % cols;
      const row = Math.floor(i / cols);
      const def = BLOCK_DEFS[type];

      blocks.push({
        x: startX + col * (BLOCK_WIDTH + BLOCK_GAP_X),
        y: startY + row * (BLOCK_HEIGHT + BLOCK_GAP_Y),
        w: BLOCK_WIDTH,
        h: BLOCK_HEIGHT,
        type,
        hp: def.hp,
        maxHp: def.hp,
        shake: 0,
      });
    }

    return blocks;
  }

  static draw(ctx, blocks) {
    for (let i = 0; i < blocks.length; i++) {
      Block._drawOne(ctx, blocks[i]);
    }
  }

  static _drawOne(ctx, b) {
    const d = BLOCK_DEFS[b.type];
    const dmg = 1 - b.hp / b.maxHp;
    const ci = Math.min(Math.floor(dmg * 3), 2);

    const ox = b.shake > 0 ? (Math.random() - 0.5) * b.shake * 0.55 : 0;
    const oy = b.shake > 0 ? (Math.random() - 0.5) * b.shake * 0.28 : 0;
    if (b.shake > 0) b.shake--;

    const x = b.x + ox;
    const y = b.y + oy;

    ctx.fillStyle = 'rgba(0,0,0,.28)';
    roundRect(ctx, x + 2, y + 3, b.w, b.h, 5);

    const bg = ctx.createLinearGradient(x, y, x, y + b.h);
    bg.addColorStop(0, d.c[ci]);
    bg.addColorStop(1, shade(d.c[ci], -28));
    ctx.fillStyle = bg;
    roundRect(ctx, x, y, b.w, b.h, 5);

    ctx.fillStyle = 'rgba(255,255,255,.22)';
    roundRect(ctx, x + 3, y + 3, b.w - 6, b.h * 0.4, 3);

    ctx.strokeStyle = 'rgba(255,255,255,.18)';
    ctx.lineWidth = 0.8;
    roundRect(ctx, x, y, b.w, b.h, 5, true);

    if (d.special === 'silver') {
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + b.w, y + b.h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + b.w, y);
      ctx.lineTo(x, y + b.h);
      ctx.stroke();
      ctx.restore();
    }

    if (d.special === 'bomb') {
      drawIcon(ctx, 'bomb', x + b.w / 2, y + b.h / 2, b.h * 0.95);
    }

    if (dmg > 0.28) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = 'rgba(0,0,0,.55)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x + b.w * 0.3, y + 2);
      ctx.lineTo(x + b.w * 0.52, y + b.h - 2);
      ctx.stroke();
      if (dmg > 0.62) {
        ctx.beginPath();
        ctx.moveTo(x + b.w * 0.65, y + 2);
        ctx.lineTo(x + b.w * 0.44, y + b.h * 0.65);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
}
