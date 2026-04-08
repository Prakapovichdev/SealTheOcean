export class DebugPanel {
  constructor(gameState, events) {
    this._gs = gameState;
    this._events = events;

    this._gs.debug ??= {
      showHitboxes: false,
      godMode: false,
      forceBonus: false,
    };

    this._debug = this._gs.debug;
    this._visible = false;

    this._frames = 0;
    this._fpsTime = 0;
    this._fps = 0;
    this._lastDt = 0;
    this._collisionsThisFrame = 0;
    this._collisionsDisplay = 0;

    this._onKeyDown = this._handleKeyDown.bind(this);
    this._onBlockHit = () => {
      this._collisionsThisFrame += 1;
    };
    this._onPaddleHit = () => {
      this._collisionsThisFrame += 1;
    };
    this._onWhaleHit = () => {
      this._collisionsThisFrame += 1;
    };

    if (__DEV__) {
      this._createUi();
      this._bindEvents();
      this._render();
    }
  }

  update(dt, elapsed) {
    this._lastDt = dt;
    this._frames += 1;
    this._fpsTime += elapsed;

    if (this._fpsTime >= 1000) {
      this._fps = this._frames;
      this._frames = 0;
      this._fpsTime = 0;
    }

    if (this._visible) {
      this._renderStats();
      this._renderFlags();
    }
  }

  draw(ctx) {
    if (this._debug.showHitboxes) {
      this._drawHitboxes(ctx);
    }

    this._collisionsDisplay = this._collisionsThisFrame;
    this._collisionsThisFrame = 0;
  }

  _bindEvents() {
    window.addEventListener('keydown', this._onKeyDown);

    this._events.on('ball:hit-block', this._onBlockHit);
    this._events.on('ball:hit-paddle', this._onPaddleHit);
    this._events.on('whale:hit', this._onWhaleHit);
  }

  _createUi() {
    this._root = document.createElement('div');
    this._root.style.position = 'fixed';
    this._root.style.top = '12px';
    this._root.style.right = '12px';
    this._root.style.zIndex = '1100';
    this._root.style.display = 'flex';
    this._root.style.flexDirection = 'column';
    this._root.style.gap = '8px';
    this._root.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, monospace';

    this._toggleBtn = document.createElement('button');
    this._toggleBtn.type = 'button';
    this._toggleBtn.textContent = '🐞 Debug';
    this._styleButton(this._toggleBtn, 'primary');
    this._toggleBtn.addEventListener('click', () => {
      this._visible = !this._visible;
      this._syncVisibility();
    });

    this._panel = document.createElement('div');
    this._panel.style.width = '320px';
    this._panel.style.background = 'rgba(4, 12, 18, 0.92)';
    this._panel.style.border = '1px solid rgba(34,240,168,.35)';
    this._panel.style.borderRadius = '12px';
    this._panel.style.boxShadow = '0 10px 30px rgba(0,0,0,.35)';
    this._panel.style.backdropFilter = 'blur(6px)';
    this._panel.style.padding = '12px';
    this._panel.style.color = '#dffef4';
    this._panel.style.display = 'none';

    const title = document.createElement('div');
    title.textContent = 'Debug panel';
    title.style.fontSize = '13px';
    title.style.fontWeight = '700';
    title.style.letterSpacing = '.04em';
    title.style.textTransform = 'uppercase';
    title.style.marginBottom = '10px';
    title.style.color = '#22f0a8';

    this._statsEl = document.createElement('pre');
    this._statsEl.style.margin = '0';
    this._statsEl.style.padding = '10px';
    this._statsEl.style.borderRadius = '10px';
    this._statsEl.style.background = 'rgba(255,255,255,.04)';
    this._statsEl.style.fontSize = '12px';
    this._statsEl.style.lineHeight = '1.45';
    this._statsEl.style.whiteSpace = 'pre-wrap';
    this._statsEl.style.wordBreak = 'break-word';

    const togglesTitle = document.createElement('div');
    togglesTitle.textContent = 'Toggles';
    togglesTitle.style.margin = '10px 0 8px';
    togglesTitle.style.fontSize = '12px';
    togglesTitle.style.color = 'rgba(223,254,244,.75)';

    const toggles = document.createElement('div');
    toggles.style.display = 'grid';
    toggles.style.gridTemplateColumns = '1fr 1fr';
    toggles.style.gap = '8px';

    this._hitboxesBtn = this._createToggleButton('Hitboxes [H]', 'showHitboxes');
    this._godModeBtn = this._createToggleButton('God mode [G]', 'godMode');
    this._forceBonusBtn = this._createToggleButton('Force bonus [B]', 'forceBonus');

    toggles.append(this._hitboxesBtn, this._godModeBtn, this._forceBonusBtn);

    const actionsTitle = document.createElement('div');
    actionsTitle.textContent = 'Actions';
    actionsTitle.style.margin = '10px 0 8px';
    actionsTitle.style.fontSize = '12px';
    actionsTitle.style.color = 'rgba(223,254,244,.75)';

    const actions = document.createElement('div');
    actions.style.display = 'grid';
    actions.style.gridTemplateColumns = '1fr 1fr';
    actions.style.gap = '8px';

    this._launchBtn = document.createElement('button');
    this._launchBtn.type = 'button';
    this._launchBtn.textContent = 'Launch ball [L]';
    this._styleButton(this._launchBtn, 'secondary');
    this._launchBtn.addEventListener('click', () => {
      this._events.emit('ball:launch');
    });

    this._dropBonusBtn = document.createElement('button');
    this._dropBonusBtn.type = 'button';
    this._dropBonusBtn.textContent = 'Drop bonus [O]';
    this._styleButton(this._dropBonusBtn, 'secondary');
    this._dropBonusBtn.addEventListener('click', () => {
      this._spawnBonusNearPaddle();
    });

    actions.append(this._launchBtn, this._dropBonusBtn);

    const help = document.createElement('div');
    help.textContent = '` открыть · H/G/B toggles · O бонус · L запуск';
    help.style.marginTop = '10px';
    help.style.fontSize = '11px';
    help.style.color = 'rgba(223,254,244,.55)';

    this._panel.append(title, this._statsEl, togglesTitle, toggles, actionsTitle, actions, help);
    this._root.append(this._toggleBtn, this._panel);
    document.body.appendChild(this._root);
  }

  _createToggleButton(label, key) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.key = key;
    btn.textContent = label;
    this._styleButton(btn, 'secondary');

    btn.addEventListener('click', () => {
      this._toggleFlag(key);
    });

    return btn;
  }

  _styleButton(btn, variant) {
    btn.style.padding = '9px 10px';
    btn.style.borderRadius = '10px';
    btn.style.border = '1px solid rgba(34,240,168,.28)';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '12px';
    btn.style.fontFamily = 'inherit';
    btn.style.userSelect = 'none';
    btn.style.transition = 'transform .08s ease, background .12s ease, border-color .12s ease';
    btn.style.transform = 'translateZ(0)';

    if (variant === 'primary') {
      btn.style.background = 'rgba(4, 12, 18, 0.9)';
      btn.style.color = '#22f0a8';
      btn.style.boxShadow = '0 4px 14px rgba(0,0,0,.25)';
    } else {
      btn.style.background = 'rgba(255,255,255,.04)';
      btn.style.color = '#dffef4';
    }

    btn.addEventListener('pointerdown', () => {
      btn.style.transform = 'scale(0.98)';
    });

    btn.addEventListener('pointerup', () => {
      btn.style.transform = 'scale(1)';
    });

    btn.addEventListener('pointerleave', () => {
      btn.style.transform = 'scale(1)';
    });
  }

  _handleKeyDown(e) {
    if (e.repeat) return;

    switch (e.code) {
      case 'Backquote':
        e.preventDefault();
        this._visible = !this._visible;
        this._syncVisibility();
        break;
      case 'KeyH':
        this._toggleFlag('showHitboxes');
        break;
      case 'KeyG':
        this._toggleFlag('godMode');
        break;
      case 'KeyB':
        this._toggleFlag('forceBonus');
        break;
      case 'KeyO':
        this._spawnBonusNearPaddle();
        break;
      case 'KeyL':
        this._events.emit('ball:launch');
        break;
    }
  }

  _toggleFlag(key) {
    this._debug[key] = !this._debug[key];
    this._renderFlags();
  }

  _spawnBonusNearPaddle() {
    const paddle = this._gs.paddle;
    if (!paddle) return;

    this._events.emit('bonus:spawn', {
      x: paddle.x + paddle.w / 2,
      y: paddle.y - 32,
    });
  }

  _syncVisibility() {
    this._panel.style.display = this._visible ? 'block' : 'none';
    this._toggleBtn.textContent = this._visible ? '🐞 Hide' : '🐞 Debug';

    if (this._visible) {
      this._render();
    }
  }

  _render() {
    this._renderStats();
    this._renderFlags();
  }

  _renderStats() {
    if (!this._statsEl) return;

    const gs = this._gs;
    const ball = gs.ball;
    const paddle = gs.paddle;
    const whale = gs.whale;
    const mult =
      typeof gs.getComboMultiplier === 'function'
        ? gs.getComboMultiplier()
        : typeof gs.comboMult === 'function'
          ? gs.comboMult()
          : 1;

    const lines = [
      `FPS         ${this._fps}    dt ${this._lastDt.toFixed(2)}`,
      `Score       ${gs.score}    Lives ${gs.lives}    Level ${gs.level + 1}`,
      `Ball        ${ball ? `${ball.x.toFixed(0)}, ${ball.y.toFixed(0)}` : '-'}`,
      `Ball speed  ${ball ? ball.speed.toFixed(1) : '-'}    Stuck ${ball?.stuck ?? '-'}`,
      `Paddle      ${paddle ? `${paddle.x.toFixed(0)}, ${paddle.y.toFixed(0)} / w:${paddle.w}` : '-'}`,
      `Blocks      ${gs.blocks.length}    Bonus ${gs.bonus.length}`,
      `Particles   ${gs.parts.length}    Pool ${gs._pool.length}`,
      `Combo       ${gs.combo}  (x${mult})`,
      `Whale       ${whale ? `hp:${whale.hp} freed:${whale.freed}` : '-'}`,
      `Collisions  ${this._collisionsDisplay}`,
    ];

    this._statsEl.textContent = lines.join('\n');
  }

  _renderFlags() {
    if (!this._hitboxesBtn) return;

    this._paintToggle(this._hitboxesBtn, this._debug.showHitboxes);
    this._paintToggle(this._godModeBtn, this._debug.godMode);
    this._paintToggle(this._forceBonusBtn, this._debug.forceBonus);
  }

  _paintToggle(btn, active) {
    btn.style.background = active ? 'rgba(34,240,168,.16)' : 'rgba(255,255,255,.04)';
    btn.style.borderColor = active ? 'rgba(34,240,168,.7)' : 'rgba(34,240,168,.28)';
    btn.style.color = active ? '#22f0a8' : '#dffef4';
    btn.style.boxShadow = active ? '0 0 0 1px rgba(34,240,168,.1) inset' : 'none';
  }

  _drawHitboxes(ctx) {
    const gs = this._gs;

    ctx.save();
    ctx.lineWidth = 1;

    if (gs.ball) {
      ctx.strokeStyle = 'rgba(255,0,0,.55)';
      ctx.beginPath();
      ctx.arc(gs.ball.x, gs.ball.y, gs.ball.r, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (gs.paddle) {
      ctx.strokeStyle = 'rgba(255,0,0,.55)';
      ctx.strokeRect(gs.paddle.x, gs.paddle.y, gs.paddle.w, gs.paddle.h);
    }

    ctx.strokeStyle = 'rgba(255,255,0,.45)';
    gs.blocks.forEach((b) => {
      ctx.strokeRect(b.x, b.y, b.w, b.h);
    });

    if (gs.whale) {
      ctx.strokeStyle = 'rgba(0,200,255,.55)';
      ctx.strokeRect(gs.whale.x, gs.whale.y, gs.whale.w, gs.whale.h);
    }

    ctx.strokeStyle = 'rgba(0,255,0,.55)';
    gs.bonus.forEach((bn) => {
      ctx.strokeRect(bn.x - 20, bn.y - 20, 40, 40);
    });

    ctx.restore();
  }

  destroy() {
    window.removeEventListener('keydown', this._onKeyDown);

    if (this._root) {
      this._root.remove();
      this._root = null;
    }
  }
}
