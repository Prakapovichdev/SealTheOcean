export class ParticleSystem {
  constructor(gameState) {
    this._gs = gameState;
    this._gravity = 0.11;
  }

  impact(x, y, color = 'rgba(180,248,220,.9)', count = 5) {
    const { parts } = this._gs;
    for (let i = 0; i < count; i++) {
      const p = this._gs.acquireParticle();
      const a = Math.random() * Math.PI * 2;
      const sp = 1 + Math.random() * 3;
      p.x = x;
      p.y = y;
      p.vx = Math.cos(a) * sp;
      p.vy = Math.sin(a) * sp;
      p.life = 1;
      p.decay = 0.028;
      p.r = 2 + Math.random() * 2;
      p.color = color;
      p.text = null;
      parts.push(p);
    }
  }

  burst(x, y, color, count = 16) {
    const { parts } = this._gs;
    for (let i = 0; i < count; i++) {
      const p = this._gs.acquireParticle();
      const a = (i / count) * Math.PI * 2;
      const sp = 2 + Math.random() * 4;
      p.x = x;
      p.y = y;
      p.vx = Math.cos(a) * sp;
      p.vy = Math.sin(a) * sp - 1.5;
      p.life = 1;
      p.decay = 0.025;
      p.r = 2.5 + Math.random() * 3;
      p.color = color;
      p.text = null;
      parts.push(p);
    }
  }

  floatText(x, y, text, color, fontSize = 18) {
    const p = this._gs.acquireParticle();
    p.x = x;
    p.y = y;
    p.vx = 0;
    p.vy = -2;
    p.life = 1;
    p.decay = 0.018;
    p.r = 0;
    p.color = color;
    p.text = text;
    p.fontSize = fontSize;
    this._gs.parts.push(p);
  }

  update(dt) {
    const { parts } = this._gs;
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += this._gravity * dt;
      p.life -= p.decay * dt;

      if (p.life <= 0) {
        this._gs.releaseParticle(parts.splice(i, 1)[0]);
      }
    }
  }

  draw(ctx) {
    const { parts } = this._gs;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);

      if (p.text) {
        ctx.fillStyle = p.color;
        ctx.font = `700 ${p.fontSize}px "Segoe UI",sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fillText(p.text, p.x, p.y);
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }
}
