import { BW, HUD_TOP } from '../../config/constants.js';

const TRAJECTORY_STEP = 7;
const TRAJECTORY_MAX_STEPS = 300;
const TRAJECTORY_MAX_BOUNCES = 2;

export class BallRenderer {
  constructor(gameState) {
    this._gs = gameState;
  }

  computeTrajectory() {
    const ball = this._gs.ball;
    const paddle = this._gs.paddle;

    if (!ball || !paddle) return [];

    const speed = ball.speed || Math.hypot(ball.vx, ball.vy);
    if (speed <= 0) return [];

    let x = ball.x;
    let y = ball.y;
    let vx = (ball.vx / speed) * TRAJECTORY_STEP;
    let vy = (ball.vy / speed) * TRAJECTORY_STEP;

    const points = [{ x, y }];
    let bounces = 0;

    for (let i = 0; i < TRAJECTORY_MAX_STEPS; i++) {
      x += vx;
      y += vy;

      if (x - ball.r < 0) {
        x = ball.r;
        vx = Math.abs(vx);
        bounces += 1;
      }

      if (x + ball.r > BW) {
        x = BW - ball.r;
        vx = -Math.abs(vx);
        bounces += 1;
      }

      if (y - ball.r < HUD_TOP) {
        y = HUD_TOP + ball.r;
        vy = Math.abs(vy);
        bounces += 1;
      }

      points.push({ x, y });

      if (y + ball.r > paddle.y - 4) break;
      if (bounces >= TRAJECTORY_MAX_BOUNCES) break;
    }

    return points;
  }

  draw(ctx) {
    const ball = this._gs.ball;
    if (!ball) return;

    this._drawTrail(ctx, ball);
    this._drawGlow(ctx, ball);
    this._drawBody(ctx, ball);
    this._drawHighlight(ctx, ball);
  }

  drawTrajectory(ctx) {
    const ball = this._gs.ball;
    if (!ball || this._gs.paused || ball.stuck) return;

    const points = this.computeTrajectory();
    if (points.length < 2) return;

    ctx.save();

    for (let i = 1; i < points.length; i++) {
      if (i % 4 !== 0) continue;

      const progress = i / points.length;
      ctx.globalAlpha = (1 - progress) * 0.25;
      ctx.fillStyle = '#00ffcc';
      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, 2.5 * (1 - progress * 0.6), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  drawLaunchHint(ctx) {
    const ball = this._gs.ball;
    if (!ball || !ball.stuck || this._gs.paused) return;

    const time = performance.now() * 0.001;
    const pulse = 0.55 + 0.45 * Math.sin(time * 4);
    const x = ball.x;
    const y = ball.y - ball.r - 28;

    ctx.save();
    ctx.globalAlpha = pulse;

    ctx.strokeStyle = '#22f0a8';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#22f0a8';
    ctx.shadowBlur = 8;

    ctx.beginPath();
    ctx.moveTo(x - 8, y - 6);
    ctx.lineTo(x, y + 2);
    ctx.lineTo(x + 8, y - 6);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x - 8, y - 13);
    ctx.lineTo(x, y - 5);
    ctx.lineTo(x + 8, y - 13);
    ctx.stroke();

    ctx.shadowBlur = 0;

    ctx.globalAlpha = pulse * 0.9;
    ctx.fillStyle = 'rgba(180,248,228,.9)';
    ctx.font = '500 12px "Segoe UI",sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('тап для запуска', x, y - 22);

    ctx.restore();
  }

  _drawTrail(ctx, ball) {
    for (let i = 0; i < ball.trail.length; i++) {
      const point = ball.trail[i];
      const progress = i / ball.trail.length;

      ctx.save();
      ctx.globalAlpha = progress * 0.38;
      ctx.fillStyle = '#00ffcc';
      ctx.beginPath();
      ctx.arc(point.x, point.y, ball.r * progress * 0.72, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  _drawGlow(ctx, ball) {
    ctx.save();
    ctx.shadowColor = '#00ffcc';
    ctx.shadowBlur = 26;
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = '#00ffcc';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r * 1.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  _drawBody(ctx, ball) {
    const gradient = ctx.createRadialGradient(
      ball.x - ball.r * 0.32,
      ball.y - ball.r * 0.32,
      ball.r * 0.05,
      ball.x,
      ball.y,
      ball.r,
    );

    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.28, 'rgba(200,255,245,.97)');
    gradient.addColorStop(0.65, 'rgba(0,240,190,.88)');
    gradient.addColorStop(1, 'rgba(0,150,110,.35)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,.85)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.stroke();
  }

  _drawHighlight(ctx, ball) {
    ctx.fillStyle = 'rgba(255,255,255,.92)';
    ctx.beginPath();
    ctx.arc(ball.x - ball.r * 0.3, ball.y - ball.r * 0.32, ball.r * 0.28, 0, Math.PI * 2);
    ctx.fill();
  }
}
