export function getComboMultiplier(gameState) {
  if (typeof gameState.getComboMultiplier === 'function') {
    return gameState.getComboMultiplier();
  }

  if (typeof gameState.comboMult === 'function') {
    return gameState.comboMult();
  }

  return 1;
}

export function applyScreenShake(gameState, duration, amount) {
  gameState.screenShake = duration;
  gameState.screenShakeAmt = amount;
}

export function applyFlash(gameState, alpha, color) {
  gameState.flashAlpha = alpha;
  gameState.flashColor = color;
}
