export const BW = 390;
export const BH = 720;

export const HUD_TOP = 74;
export const HUD_BOTTOM = 60;
export const FIELD_BOTTOM = BH - HUD_BOTTOM;

export const BTN_PAUSE = { x: 52, y: BH - HUD_BOTTOM / 2, r: 22 };
export const BTN_SOUND = { x: BW - 52, y: BH - HUD_BOTTOM / 2, r: 22 };

export const DIVE_DURATION = 700;
export const POPUP_DURATION = 500;

export const PADDLE_WIDTH = 92;
export const PADDLE_HEIGHT = 14;
export const PADDLE_WIDE_WIDTH = 130;
export const PADDLE_LERP = 0.38;

export const BALL_RADIUS = 12;
export const BALL_BASE_SPEED = 6.8;
export const BALL_TRAIL_LENGTH = 18;
export const BALL_SPEED_RAMP_INTERVAL = 15;
export const BALL_SPEED_RAMP_STEP = 0.07;
export const BALL_SPEED_RAMP_MAX = 0.35;
export const BALL_SLOW_MULTIPLIER = 0.72;
export const BALL_SLOW_DURATION = 5000;
export const BALL_MAX_DEFLECTION = Math.PI * 0.3;
export const BALL_MIN_VY_RATIO = 0.3;
export const BALL_PADDLE_INFLUENCE = 0.32;

export const COMBO_X2_THRESHOLD = 3;
export const COMBO_X3_THRESHOLD = 6;
export const COMBO_X5_THRESHOLD = 10;
export const COMBO_DISPLAY_DURATION = 2200;
export const COMBO_FADE_START = 1800;

export const BONUS_DROP_CHANCE = 0.3;
export const BONUS_WIDE_DURATION = 300;
export const BONUS_FIRE_SCORE = 120;
export const BONUS_PICKUP_SCORE = 50;
export const BONUS_FALL_SPEED = 3;

export const MAX_LIVES = 7;
export const INITIAL_LIVES = 3;

export const BLOCK_DEFS = {
  1: { hp: 1, c: ['#22f0a8', '#0ec486', '#087a54'], special: null },
  2: { hp: 2, c: ['#ff9052', '#e06020', '#a03800'], special: null },
  3: { hp: 3, c: ['#70b8e0', '#3888b8', '#1a5880'], special: null },
  4: { hp: 99, c: ['#d0d8e8', '#a0aec0', '#6b7a90'], special: 'silver' },
  5: { hp: 1, c: ['#ffd166', '#f4a20a', '#c07800'], special: 'bomb' },
};

export const BLOCK_WIDTH = 44;
export const BLOCK_HEIGHT = 24;
export const BLOCK_GAP_X = 7;
export const BLOCK_GAP_Y = 8;

export const WHALE_HP = 5;
export const WHALE_WIDTH = 170;
export const WHALE_HEIGHT = 80;
export const WHALE_SPEED = 1.5;
export const WHALE_HIT_SCORE = 200;

export const BUBBLE_COUNT = 24;

export const FLASH_DECAY = 0.04;
export const DPR_CAP = 2;
export const MAX_CSS_HEIGHT = 900;
