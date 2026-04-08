const CONTACT_EPSILON = 0.5;
const X_JITTER = 0.25;

export function hitCircleRect(rect, circle) {
  const nearestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.w));
  const nearestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.h));
  const dx = circle.x - nearestX;
  const dy = circle.y - nearestY;

  return dx * dx + dy * dy < circle.r * circle.r;
}

export function resolveBallRectCollision(ball, rect, prevX, prevY) {
  const fromLeft = prevX + ball.r <= rect.x;
  const fromRight = prevX - ball.r >= rect.x + rect.w;
  const fromTop = prevY + ball.r <= rect.y;
  const fromBottom = prevY - ball.r >= rect.y + rect.h;

  if (fromLeft || fromRight) {
    ball.vx = -ball.vx;

    if (fromLeft) {
      ball.x = rect.x - ball.r - CONTACT_EPSILON;
    }

    if (fromRight) {
      ball.x = rect.x + rect.w + ball.r + CONTACT_EPSILON;
    }
  } else if (fromTop || fromBottom) {
    ball.vy = -ball.vy;

    if (fromTop) {
      ball.y = rect.y - ball.r - CONTACT_EPSILON;
    }

    if (fromBottom) {
      ball.y = rect.y + rect.h + ball.r + CONTACT_EPSILON;
    }
  } else {
    resolveCornerCollision(ball, rect);
  }

  ball.vx += (Math.random() - 0.5) * X_JITTER;
  normalizeBallSpeed(ball);
}

function resolveCornerCollision(ball, rect) {
  const overlapLeft = ball.x + ball.r - rect.x;
  const overlapRight = rect.x + rect.w - (ball.x - ball.r);
  const overlapTop = ball.y + ball.r - rect.y;
  const overlapBottom = rect.y + rect.h - (ball.y - ball.r);

  const minHorizontalOverlap = Math.min(overlapLeft, overlapRight);
  const minVerticalOverlap = Math.min(overlapTop, overlapBottom);

  if (minHorizontalOverlap < minVerticalOverlap) {
    ball.vx = -ball.vx;
    ball.x +=
      overlapLeft < overlapRight ? -overlapLeft - CONTACT_EPSILON : overlapRight + CONTACT_EPSILON;
    return;
  }

  ball.vy = -ball.vy;
  ball.y +=
    overlapTop < overlapBottom ? -overlapTop - CONTACT_EPSILON : overlapBottom + CONTACT_EPSILON;
}

function normalizeBallSpeed(ball) {
  const currentSpeed = Math.hypot(ball.vx, ball.vy);
  if (currentSpeed <= 0) return;

  const targetSpeed = ball.speed ?? currentSpeed;
  ball.vx = (ball.vx / currentSpeed) * targetSpeed;
  ball.vy = (ball.vy / currentSpeed) * targetSpeed;
}
