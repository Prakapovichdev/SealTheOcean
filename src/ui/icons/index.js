import { LEVEL_ICONS } from './levels/index.js';
import { BONUS_ICONS } from './bonuses/index.js';
import { BLOCK_ICONS } from './blocks/index.js';
import { CHARACTER_ICONS } from './characters/index.js';
import { CONTROL_ICONS } from './controls/index.js';

const ICONS = {
  ...LEVEL_ICONS,
  ...BONUS_ICONS,
  ...BLOCK_ICONS,
  ...CHARACTER_ICONS,
  ...CONTROL_ICONS,
};

export function drawIcon(ctx, id, cx, cy, size) {
  const draw = ICONS[id];
  if (!draw) {
    if (__DEV__) {
      console.warn(`[icons] Unknown icon id: "${id}"`);
    }
    return;
  }
  draw(ctx, cx, cy, size);
}
