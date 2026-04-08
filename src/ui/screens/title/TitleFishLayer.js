import { BW, BH } from '../../../config/constants.js';

const FISH_COLORS = ['#22f0a8', '#4cc9f0', '#ff9052', '#ffd166', '#ff6b9d'];

function wrap(value, min, max) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

function createFish(index) {
  return {
    baseX: Math.random() * BW,
    y: 120 + Math.random() * (BH - 300),
    speed: 24 + Math.random() * 26,
    dir: Math.random() < 0.5 ? 1 : -1,
    phase: Math.random() * Math.PI * 2,
    size: 10 + Math.random() * 14,
    color: FISH_COLORS[index % FISH_COLORS.length],
  };
}

export class TitleFishLayer {
  constructor(count = 7) {
    this._fish = Array.from({ length: count }, (_, index) => createFish(index));
  }

  draw(ctx, time) {
    for (const fish of this._fish) {
      const x = wrap(fish.baseX + fish.speed * time * fish.dir, -30, BW + 30);
      const y = fish.y + Math.sin(time * 1.8 + fish.phase) * 6;
      const flip = fish.dir < 0;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(flip ? -1 : 1, 1);
      ctx.globalAlpha = 0.55;

      ctx.fillStyle = fish.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, fish.size, fish.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-fish.size * 0.8, 0);
      ctx.lineTo(-fish.size * 1.5, -fish.size * 0.6);
      ctx.lineTo(-fish.size * 1.5, fish.size * 0.6);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(fish.size * 0.45, -fish.size * 0.1, fish.size * 0.18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#001828';
      ctx.beginPath();
      ctx.arc(fish.size * 0.48, -fish.size * 0.08, fish.size * 0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }
}
