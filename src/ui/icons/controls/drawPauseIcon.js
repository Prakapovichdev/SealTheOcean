export function drawPauseIcon(ctx, cx, cy, size) {
  const barW = size * 0.18;
  const barH = size * 0.7;
  const gap = size * 0.14;

  ctx.fillRect(cx - gap / 2 - barW, cy - barH / 2, barW, barH);
  ctx.fillRect(cx + gap / 2, cy - barH / 2, barW, barH);
}
