export function signedWhole(value: number, min = -40, max = 40) {
  if (!Number.isSafeInteger(value) || value < min || value > max)
    throw new RangeError(
      'Use an integer within the signed-number workshop range',
    );
  return value === 0 ? 0 : value;
}
export function signedLabel(value: number, positiveSign = false) {
  signedWhole(value);
  return value < 0
    ? `−${-value}`
    : value > 0 && positiveSign
      ? `+${value}`
      : String(value === 0 ? 0 : value);
}
export function temperatureReading(value: number) {
  signedWhole(value, -15, 15);
  return {
    value: value === 0 ? 0 : value,
    side: value < 0 ? 'below' : value > 0 ? 'above' : 'zero',
    steps: Math.abs(value),
    y: 40 + (15 - value) * 12,
    zeroY: 220,
    bottomY: 400,
  };
}
export function signedAxisPosition(value: number, min = -12, max = 12) {
  signedWhole(min);
  signedWhole(max);
  signedWhole(value, min, max);
  if (min >= max || min > 0 || max < 0)
    throw new RangeError(
      'The number-line window must increase and include zero',
    );
  return {
    value,
    min,
    max,
    x: 44 + (value - min) * 24,
    width: (max - min) * 24 + 88,
    zeroX: 44 - min * 24,
  };
}
export function compareSigned(a: number, b: number) {
  signedWhole(a);
  signedWhole(b);
  return {
    a,
    b,
    relation: a < b ? '<' : a > b ? '>' : '=',
    left: Math.min(a, b),
    right: Math.max(a, b),
    equal: a === b,
  };
}
export function axisWalk(current: number, direction: 'left' | 'right') {
  signedWhole(current, -12, 12);
  if (direction !== 'left' && direction !== 'right')
    throw new RangeError('Choose a direction');
  const next = current + (direction === 'left' ? -1 : 1);
  return next < -12 || next > 12 ? current : next;
}
export function signedMovement(
  start: number,
  operation: '+' | '−',
  term: number,
) {
  signedWhole(start, -10, 10);
  signedWhole(term, -8, 8);
  if (operation !== '+' && operation !== '−')
    throw new RangeError('Choose addition or subtraction');
  const delta = operation === '+' ? term : -term,
    end = start + delta,
    crossesZero = start * end < 0;
  const waypoints = crossesZero ? [start, 0, end] : [start, end];
  return {
    start,
    operation,
    term,
    delta: delta === 0 ? 0 : delta,
    end: end === 0 ? 0 : end,
    crossesZero,
    reachesZero: end === 0 && start !== 0,
    direction: delta < 0 ? 'left' : delta > 0 ? 'right' : 'stay',
    distance: Math.abs(delta),
    firstLeg: crossesZero ? Math.abs(start) : Math.abs(delta),
    remaining: crossesZero ? Math.abs(end) : 0,
    waypoints,
    min: Math.min(-12, start, end),
    max: Math.max(12, start, end),
  };
}
export function absoluteDistance(value: number) {
  signedWhole(value, -12, 12);
  return {
    value: value === 0 ? 0 : value,
    opposite: value === 0 ? 0 : -value,
    distance: Math.abs(value),
    nonnegative: Math.abs(value) >= 0,
  };
}
