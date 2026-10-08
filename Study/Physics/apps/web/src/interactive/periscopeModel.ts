export type RayPoint = { x: number; y: number };
export function reflectVector(d: RayPoint, tilt: number): RayPoint {
  if (![d.x, d.y, tilt].every(Number.isFinite))
    throw new RangeError('Finite direction and angle required');
  const a = (tilt * Math.PI) / 180,
    n = { x: -Math.sin(a), y: Math.cos(a) },
    dot = d.x * n.x + d.y * n.y;
  return { x: d.x - 2 * dot * n.x, y: d.y - 2 * dot * n.y };
}
export function periscopeRay(lowerTilt: number) {
  if (!Number.isFinite(lowerTilt) || lowerTilt < 30 || lowerTilt > 60)
    throw new RangeError('Model tilt must be 30–60 degrees');
  const target = { x: 70, y: 100 },
    upper = { x: 300, y: 100 },
    lower = { x: 300, y: 280 };
  const middleDirection = reflectVector({ x: 1, y: 0 }, 45),
    direction = reflectVector(middleDirection, lowerTilt);
  const end = { x: 550, y: lower.y + (250 * direction.y) / direction.x };
  const windowExitY = lower.y + (50 * direction.y) / direction.x;
  return {
    path: [target, upper, lower, end],
    middleDirection,
    direction,
    end,
    windowExitY,
    outgoingAngle: (Math.atan2(direction.y, direction.x) * 180) / Math.PI,
    hit: Math.abs(end.y - 280) <= 18 + 1e-9,
    blockedDirect: { x: 70 + ((140 - 100) * 480) / 180, y: 140 },
  };
}
