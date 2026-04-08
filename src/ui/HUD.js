import { TopBar } from './hud/TopBar.js';
import { BottomBar } from './hud/BottomBar.js';
import { ComboBadge } from './hud/ComboBadge.js';
import { WhaleHintBanner } from './hud/WhaleHintBanner.js';

export class HUD {
  constructor(gameState) {
    this._topBar = new TopBar(gameState);
    this._bottomBar = new BottomBar(gameState);
    this._comboBadge = new ComboBadge(gameState);
    this._whaleHintBanner = new WhaleHintBanner();
  }

  draw(ctx, options = {}) {
    const { showWhaleHint = false } = options;

    this._topBar.draw(ctx);
    this._bottomBar.draw(ctx);
    this._comboBadge.draw(ctx);

    if (showWhaleHint) {
      this._whaleHintBanner.draw(ctx);
    }
  }
}
