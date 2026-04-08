import { BW, FIELD_BOTTOM, BUBBLE_COUNT } from '../config/constants.js';

export function createBubbles(count = BUBBLE_COUNT) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * BW,
    y: Math.random() * FIELD_BOTTOM,
    r: 1.5 + Math.random() * 4.5,
    vy: -(0.22 + Math.random() * 0.45),
    alpha: 0.06 + Math.random() * 0.14,
    phase: Math.random() * Math.PI * 2,
  }));
}
