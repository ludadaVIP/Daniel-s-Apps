export function boundedWhole(n: number, max: number, min = 0) {
  if (!Number.isSafeInteger(n) || n < min || n > max)
    throw new RangeError('Use a bounded whole quantity');
  return n;
}
export function rulerLength(startMm: number, endMm: number) {
  boundedWhole(startMm, 300);
  boundedWhole(endMm, 300);
  if (endMm < startMm) throw new RangeError('The end must follow the start');
  const mm = endMm - startMm;
  return { startMm, endMm, mm, cm: mm / 10, metres: mm / 1000 };
}
export function rectangleBoundary(width: number, height: number) {
  boundedWhole(width, 12, 1);
  boundedWhole(height, 12, 1);
  const segments = [];
  for (let x = 0; x < width; x++)
    segments.push({ x1: x, y1: 0, x2: x + 1, y2: 0 });
  for (let y = 0; y < height; y++)
    segments.push({ x1: width, y1: y, x2: width, y2: y + 1 });
  for (let x = width; x > 0; x--)
    segments.push({ x1: x, y1: height, x2: x - 1, y2: height });
  for (let y = height; y > 0; y--)
    segments.push({ x1: 0, y1: y, x2: 0, y2: y - 1 });
  return {
    width,
    height,
    perimeter: segments.length,
    area: width * height,
    segments,
  };
}
export const fullTiles = (width: number, height: number) => {
  boundedWhole(width, 10, 1);
  boundedWhole(height, 10, 1);
  return Array.from({ length: width * height }, (_, i) => i);
};
export function tileCoverage(
  width: number,
  height: number,
  selected: number[],
) {
  fullTiles(width, height);
  selected.forEach((i) => boundedWhole(i, width * height - 1));
  if (new Set(selected).size !== selected.length)
    throw new RangeError('Count a covered cell once');
  return {
    width,
    height,
    area: selected.length,
    full: selected.length === width * height,
    rows: Array.from(
      { length: height },
      (_, y) => selected.filter((i) => Math.floor(i / width) === y).length,
    ),
  };
}
export function rotateCoverage(
  width: number,
  height: number,
  selected: number[],
) {
  tileCoverage(width, height, selected);
  return {
    width: height,
    height: width,
    selected: selected
      .map((i) => (i % width) * height + (height - 1 - Math.floor(i / width)))
      .sort((a, b) => a - b),
  };
}
export function angleKind(angle: number) {
  boundedWhole(angle, 180);
  return angle === 0
    ? 'zero'
    : angle < 90
      ? 'acute'
      : angle === 90
        ? 'right'
        : angle < 180
          ? 'obtuse'
          : 'straight';
}
export function angleGeometry(angle: number, length: number, rotation: number) {
  angleKind(angle);
  boundedWhole(length, 130, 40);
  boundedWhole(rotation, 359);
  const point = (degrees: number, radius: number) => ({
    x: 200 + radius * Math.cos((degrees * Math.PI) / 180),
    y: 170 - radius * Math.sin((degrees * Math.PI) / 180),
  });
  return {
    angle,
    length,
    rotation,
    vertex: { x: 200, y: 170 },
    first: point(rotation, length),
    second: point(rotation + angle, length),
    arcStart: point(rotation, 44),
    arcEnd: point(rotation + angle, 44),
    kind: angleKind(angle),
  };
}
export function barGeometry(values: number[], max: number, step: number) {
  boundedWhole(values.length, 6, 1);
  boundedWhole(max, 40, 1);
  boundedWhole(step, max, 1);
  if (max % step) throw new RangeError('Ticks must end at the axis maximum');
  values.forEach((v) => boundedWhole(v, max));
  return {
    max,
    step,
    total: values.reduce((a, b) => a + b, 0),
    ticks: Array.from({ length: max / step + 1 }, (_, i) => i * step),
    heights: values.map((v) => (v / max) * 250),
    baseline: 280,
  };
}
