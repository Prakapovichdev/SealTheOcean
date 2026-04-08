import {
  BW,
  HUD_TOP,
  WHALE_HP,
  WHALE_WIDTH,
  WHALE_HEIGHT,
  WHALE_SPEED,
} from '../../config/constants.js';
import { roundRect } from '../../utils/math.js';

import { Boss } from './Boss.js';

const WHALE_SIDE_PADDING = 15;
const WHALE_START_Y_OFFSET = 90;
const WHALE_FREED_RISE_SPEED = 0.7;
const WHALE_WIN_DELAY = 80;

export class WhaleBoss extends Boss {
  constructor(gameState, events) {
    super(gameState, events);
  }

  init() {
    this._gs.whale = {
      x: BW / 2 - WHALE_WIDTH / 2,
      y: HUD_TOP + WHALE_START_Y_OFFSET,
      w: WHALE_WIDTH,
      h: WHALE_HEIGHT,
      hp: WHALE_HP,
      maxHp: WHALE_HP,
      vx: WHALE_SPEED,
      hitAnim: 0,
      freed: false,
      freedTimer: 0,
      winTriggered: false,
    };
  }

  update(dt) {
    const whale = this._gs.whale;
    if (!whale) return;

    if (whale.hitAnim > 0) {
      whale.hitAnim -= dt;
    }

    if (!whale.freed) {
      this._updatePatrol(whale, dt);
      return;
    }

    this._updateFreedState(whale, dt);
  }

  _updatePatrol(whale, dt) {
    whale.x += whale.vx * dt;

    if (whale.x <= WHALE_SIDE_PADDING) {
      whale.x = WHALE_SIDE_PADDING;
      whale.vx = Math.abs(whale.vx);
    }

    if (whale.x + whale.w >= BW - WHALE_SIDE_PADDING) {
      whale.x = BW - WHALE_SIDE_PADDING - whale.w;
      whale.vx = -Math.abs(whale.vx);
    }
  }

  _updateFreedState(whale, dt) {
    whale.y -= WHALE_FREED_RISE_SPEED * dt;
    whale.freedTimer += dt;

    if (whale.freedTimer >= WHALE_WIN_DELAY && !whale.winTriggered) {
      whale.winTriggered = true;
      this._events.emit('whale:win');
    }
  }

  draw(ctx) {
    const whale = this._gs.whale;
    if (!whale) return;

    const time = performance.now() * 0.001;
    const wobbleY = whale.freed ? 0 : Math.sin(time * 1.2) * 5;
    const tailWag = Math.sin(time * 2.6) * 10;

    const x = whale.x;
    const y = whale.y + wobbleY;
    const w = whale.w;
    const h = whale.h;
    const cx = x + w / 2;
    const cy = y + h / 2;

    const hitShakeX = whale.hitAnim > 0 ? (Math.random() - 0.5) * 6 : 0;
    const hitShakeY = whale.hitAnim > 0 ? (Math.random() - 0.5) * 3 : 0;

    ctx.save();
    ctx.translate(hitShakeX, hitShakeY);

    if (!whale.freed) {
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.ellipse(cx + 4, y + h + 12, w * 0.38, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    this._drawTail(ctx, x, y, w, h, cx, cy, tailWag);
    this._drawBody(ctx, x, y, w, h);

    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = '#cceaf8';
    ctx.beginPath();
    ctx.ellipse(x + w * 0.35, y + h * 0.7, w * 0.22, h * 0.22, 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#1e68a0';
    ctx.beginPath();
    ctx.moveTo(x + w * 0.26, y + h * 0.64);
    ctx.quadraticCurveTo(x + w * 0.14, y + h + 14, x + w * 0.35, y + h * 0.95);
    ctx.quadraticCurveTo(x + w * 0.48, y + h * 0.86, x + w * 0.42, y + h * 0.65);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#1e5898';
    ctx.beginPath();
    ctx.moveTo(x + w * 0.5, y + h * 0.06);
    ctx.quadraticCurveTo(x + w * 0.44, y - h * 0.28, x + w * 0.38, y - h * 0.18);
    ctx.quadraticCurveTo(x + w * 0.34, y + h * 0.0, x + w * 0.42, y + h * 0.06);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#145080';
    ctx.beginPath();
    ctx.ellipse(x + w * 0.22, y + h * 0.04, 5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    this._drawSpray(ctx, x, y, w, h, time);
    this._drawEye(ctx, x, y, w, h);

    ctx.save();
    ctx.strokeStyle = '#1a5880';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();

    if (!whale.freed) {
      ctx.moveTo(x + w * 0.04, y + h * 0.56);
      ctx.quadraticCurveTo(x + w * 0.11, y + h * 0.66, x + w * 0.22, y + h * 0.58);
    } else {
      ctx.moveTo(x + w * 0.04, y + h * 0.6);
      ctx.quadraticCurveTo(x + w * 0.11, y + h * 0.5, x + w * 0.22, y + h * 0.58);
    }

    ctx.stroke();
    ctx.restore();

    ctx.restore();

    if (!whale.freed && whale.hp > 0) {
      this._drawNets(ctx, x, y, w, h);
    }

    if (whale.freed) {
      this._drawFreedEffects(ctx, cx, cy, y);
    }
  }

  _drawTail(ctx, wx0, wy0, ww, wh, cx, cy, tailWag) {
    ctx.fillStyle = '#1a5a80';

    ctx.beginPath();
    ctx.moveTo(wx0 + ww * 0.84, cy);
    ctx.quadraticCurveTo(wx0 + ww * 0.98, cy - 28 + tailWag * 0.4, wx0 + ww * 1.06, wy0 + wh * 0.1);
    ctx.quadraticCurveTo(wx0 + ww * 1.14, wy0 - wh * 0.04, wx0 + ww * 1.02, wy0 + wh * 0.28);
    ctx.lineTo(wx0 + ww * 0.84, cy);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(wx0 + ww * 0.84, cy);
    ctx.quadraticCurveTo(wx0 + ww * 0.98, cy + 28 - tailWag * 0.4, wx0 + ww * 1.06, wy0 + wh * 0.9);
    ctx.quadraticCurveTo(wx0 + ww * 1.14, wy0 + wh * 1.04, wx0 + ww * 1.02, wy0 + wh * 0.72);
    ctx.lineTo(wx0 + ww * 0.84, cy);
    ctx.fill();
  }

  _drawBody(ctx, wx0, wy0, ww, wh) {
    const bodyGradient = ctx.createLinearGradient(wx0, wy0, wx0, wy0 + wh);
    bodyGradient.addColorStop(0, '#62b8e8');
    bodyGradient.addColorStop(0.45, '#2878c0');
    bodyGradient.addColorStop(1, '#145880');

    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.moveTo(wx0 + ww * 0.1, wy0 + wh * 0.15);
    ctx.quadraticCurveTo(wx0, wy0 + wh * 0.06, wx0 + ww * 0.03, wy0 + wh * 0.4);
    ctx.quadraticCurveTo(wx0 - ww * 0.01, wy0 + wh * 0.6, wx0 + ww * 0.1, wy0 + wh * 0.82);
    ctx.quadraticCurveTo(wx0 + ww * 0.26, wy0 + wh * 0.98, wx0 + ww * 0.6, wy0 + wh * 0.94);
    ctx.quadraticCurveTo(wx0 + ww * 0.82, wy0 + wh * 0.9, wx0 + ww * 0.86, wy0 + wh * 0.65);
    ctx.lineTo(wx0 + ww * 0.86, wy0 + wh * 0.35);
    ctx.quadraticCurveTo(wx0 + ww * 0.82, wy0 + wh * 0.1, wx0 + ww * 0.55, wy0 + wh * 0.04);
    ctx.quadraticCurveTo(wx0 + ww * 0.3, wy0, wx0 + ww * 0.1, wy0 + wh * 0.15);
    ctx.closePath();
    ctx.fill();
  }

  _drawSpray(ctx, wx0, wy0, ww, wh, time) {
    const whale = this._gs.whale;
    const sprayPhase = (time * 0.6) % 1;

    if (sprayPhase >= 0.38 || whale.freed) {
      return;
    }

    const progress = sprayPhase / 0.38;

    ctx.save();
    for (let i = 0; i < 4; i++) {
      ctx.globalAlpha = (1 - progress) * 0.65;
      ctx.fillStyle = '#90e0f8';

      const x = wx0 + ww * 0.22 + Math.sin(i * 1.4) * 4;
      const y = wy0 + wh * 0.04 - progress * 42 - i * 8;

      ctx.beginPath();
      ctx.arc(x, y, 2.5 + i * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  _drawEye(ctx, wx0, wy0, ww, wh) {
    const eyeX = wx0 + ww * 0.11;
    const eyeY = wy0 + wh * 0.36;

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 7.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#001820';
    ctx.beginPath();
    ctx.arc(eyeX + 0.5, eyeY + 0.5, 4.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(eyeX - 1, eyeY - 2, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  _drawNets(ctx, wx, wy, ww, wh) {
    const whale = this._gs.whale;
    const time = performance.now() * 0.0004;
    const cx = wx + ww / 2;
    const cy = wy + wh / 2;
    const step = 14 + (whale.maxHp - whale.hp) * 6;

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, ww * 0.5, wh * 0.52, 0, 0, Math.PI * 2);
    ctx.clip();

    ctx.strokeStyle = '#b07028';
    ctx.lineWidth = 1.6;
    ctx.globalAlpha = 0.72;
    ctx.setLineDash([5, 3]);

    for (let y = wy - 5; y <= wy + wh + 5; y += step) {
      ctx.beginPath();
      ctx.moveTo(wx - 15, y);
      for (let x = wx - 15; x <= wx + ww + 15; x += 8) {
        ctx.lineTo(x, y + Math.sin(x * 0.14 + time) * 2.8);
      }
      ctx.stroke();
    }

    for (let x = wx - 5; x <= wx + ww + 5; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, wy - 15);
      for (let y = wy - 15; y <= wy + wh + 15; y += 8) {
        ctx.lineTo(x + Math.sin(y * 0.14 + time) * 2.8, y);
      }
      ctx.stroke();
    }

    ctx.setLineDash([]);
    ctx.fillStyle = '#8a5018';
    ctx.globalAlpha = 0.55;

    for (let y = wy; y <= wy + wh; y += step) {
      for (let x = wx; x <= wx + ww; x += step) {
        const ndx = (x - cx) / (ww * 0.5);
        const ndy = (y - cy) / (wh * 0.5);

        if (ndx * ndx + ndy * ndy < 1.0) {
          ctx.beginPath();
          ctx.arc(x, y, 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.restore();

    const badgeW = 110;
    const badgeH = 24;
    const badgeX = cx - 55;
    const badgeY = wy - 38;

    ctx.save();
    ctx.fillStyle = 'rgba(0,12,30,0.78)';
    roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 8);

    ctx.strokeStyle = '#c8843c';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.8;
    roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 8, true);

    ctx.fillStyle = '#ffd166';
    ctx.font = '500 11px "Segoe UI",sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = 1;
    ctx.fillText(`🕸 Сетей: ${whale.hp} из ${whale.maxHp}`, cx, badgeY + badgeH / 2);
    ctx.restore();
  }

  _drawFreedEffects(ctx, cx, cy, y) {
    const whale = this._gs.whale;
    const fadeIn = Math.min(1, whale.freedTimer / 25);

    ctx.save();
    ctx.globalAlpha = fadeIn;

    ctx.save();
    ctx.strokeStyle = '#22f0a8';
    ctx.lineWidth = 2;

    for (let i = 0; i < 3; i++) {
      const progress = (whale.freedTimer * 0.04 + i * 0.33) % 1;
      ctx.globalAlpha = (1 - progress) * fadeIn * 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, progress * 100, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    const emojis = ['🎉', '💙', '🫧', '✨', '🐟'];
    for (let i = 0; i < emojis.length; i++) {
      const angle = (i * Math.PI * 2) / 5 + whale.freedTimer * 0.04;
      const radius = 70 + Math.sin(whale.freedTimer * 0.08 + i) * 20;
      const emojiX = cx + Math.cos(angle) * radius;
      const emojiY = cy + Math.sin(angle) * radius - whale.freedTimer * 0.3;

      ctx.globalAlpha = Math.max(0, fadeIn - whale.freedTimer * 0.006);
      ctx.font = '22px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emojis[i], emojiX, emojiY);
    }

    ctx.globalAlpha = fadeIn * Math.min(1, whale.freedTimer / 10);
    ctx.font = '44px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💙', cx, y - 40 - whale.freedTimer * 0.4);

    ctx.restore();
  }
}
