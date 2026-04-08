import { roundRect } from '../../utils/math.js';

import { drawSeal } from './drawSeal.js';

export class PaddleRenderer {
  constructor(gameState) {
    this._gs = gameState;
  }

  draw(ctx) {
    const paddle = this._gs.paddle;
    if (!paddle) return;

    const x = paddle.x;
    const y = paddle.y;
    const w = paddle.w;
    const h = paddle.h;
    const centerX = x + w / 2;

    drawSeal(ctx, centerX, y + h, w, this._gs.sealHit);

    this._drawGlow(ctx, x, y, w, h);
    this._drawBody(ctx, x, y, w, h);
    this._drawHighlight(ctx, x, y, w, h);
    this._drawStroke(ctx, x, y, w, h);
  }

  _drawGlow(ctx, x, y, w, h) {
    ctx.save();
    ctx.shadowColor = '#22f0a8';
    ctx.shadowBlur = 18;
    ctx.globalAlpha = 0.65;

    const gradient = ctx.createLinearGradient(x, y, x + w, y);
    gradient.addColorStop(0, '#0ec486');
    gradient.addColorStop(0.5, '#22f0a8');
    gradient.addColorStop(1, '#0ec486');

    ctx.fillStyle = gradient;
    roundRect(ctx, x, y, w, h, h / 2);
    ctx.restore();
  }

  _drawBody(ctx, x, y, w, h) {
    const gradient = ctx.createLinearGradient(x, y, x, y + h);
    gradient.addColorStop(0, '#44f8c0');
    gradient.addColorStop(1, '#0aaa70');

    ctx.fillStyle = gradient;
    roundRect(ctx, x, y, w, h, h / 2);
  }

  _drawHighlight(ctx, x, y, w, h) {
    ctx.fillStyle = 'rgba(255,255,255,.28)';
    roundRect(ctx, x + 5, y + 2, w - 10, h * 0.4, 3);
  }

  _drawStroke(ctx, x, y, w, h) {
    ctx.strokeStyle = 'rgba(255,255,255,.28)';
    ctx.lineWidth = 1;
    roundRect(ctx, x, y, w, h, h / 2, true);
  }
}
