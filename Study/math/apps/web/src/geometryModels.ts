import { exactRational } from './model';
import { boundedWhole } from './measurementModels';
export type Point = [number, number];
export type GeoUnit =
  | 'mm'
  | 'cm'
  | 'dm'
  | 'm'
  | 'km'
  | 'cm²'
  | 'dm²'
  | 'm²'
  | 'cm³'
  | 'dm³'
  | 'm³'
  | 'L'
  | 'mL';
const units: Record<GeoUnit, { dimension: 1 | 2 | 3; n: bigint; d: bigint }> = {
  mm: { dimension: 1, n: 1n, d: 10n },
  cm: { dimension: 1, n: 1n, d: 1n },
  dm: { dimension: 1, n: 10n, d: 1n },
  m: { dimension: 1, n: 100n, d: 1n },
  km: { dimension: 1, n: 100000n, d: 1n },
  'cm²': { dimension: 2, n: 1n, d: 1n },
  'dm²': { dimension: 2, n: 100n, d: 1n },
  'm²': { dimension: 2, n: 10000n, d: 1n },
  'cm³': { dimension: 3, n: 1n, d: 1n },
  'dm³': { dimension: 3, n: 1000n, d: 1n },
  'm³': { dimension: 3, n: 1000000n, d: 1n },
  L: { dimension: 3, n: 1000n, d: 1n },
  mL: { dimension: 3, n: 1n, d: 1n },
};
const gcd = (a: bigint, b: bigint): bigint =>
  b === 0n ? (a < 0n ? -a : a) : gcd(b, a % b);
export function convertGeometryUnit(raw: string, from: GeoUnit, to: GeoUnit) {
  if (
    !units[from] ||
    !units[to] ||
    units[from].dimension !== units[to].dimension
  )
    throw new RangeError('Convert quantities of the same dimension');
  if (raw.includes('%'))
    throw new RangeError('Use an actual measured quantity');
  const quantity = exactRational(raw);
  if (!quantity) throw new RangeError('Use an exact non-negative quantity');
  let [n, d] = quantity;
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const a = units[from],
    b = units[to];
  if (n < 0n || n * a.n > 1000000000000n * d * a.d)
    throw new RangeError(
      'Use a bounded physical quantity in centimetre-based units',
    );
  const numerator = n * a.n * b.d,
    denominator = d * a.d * b.n,
    factor = gcd(numerator, denominator);
  return {
    n: numerator / factor,
    d: denominator / factor,
    dimension: a.dimension,
  };
}
export function conversionText(value: { n: bigint; d: bigint }) {
  return value.d === 1n ? String(value.n) : `${value.n}/${value.d}`;
}
export function polygonArea(points: Point[]) {
  if (points.some((p) => p.some((n) => !Number.isFinite(n))))
    throw new RangeError('Use finite geometric coordinates');
  return (
    Math.abs(
      points.reduce((sum, [x, y], i) => {
        const next = points[(i + 1) % points.length]!;
        return sum + x * next[1] - y * next[0];
      }, 0),
    ) / 2
  );
}
export function rectangleArea(w: number, h: number) {
  boundedWhole(w, 12, 1);
  boundedWhole(h, 12, 1);
  return {
    area: w * h,
    perimeter: 2 * (w + h),
    cells: Array.from({ length: w * h }, (_, i) => ({
      x: i % w,
      y: Math.floor(i / w),
    })),
  };
}
export function parallelogramCut(b: number, h: number, shift: number) {
  boundedWhole(b, 24, 1);
  boundedWhole(h, 12, 1);
  if (!Number.isInteger(shift) || Math.abs(shift) > b)
    throw new RangeError('Use a shear within one base width');
  const original: Point[] = [
    [0, 0],
    [b, 0],
    [b + shift, h],
    [shift, h],
  ];
  const cut: Point[] =
    shift >= 0
      ? [
          [0, 0],
          [shift, 0],
          [shift, h],
        ]
      : [
          [shift, h],
          [0, h],
          [0, 0],
        ];
  const remaining: Point[] =
    shift >= 0
      ? [
          [shift, 0],
          [b, 0],
          [b + shift, h],
          [shift, h],
        ]
      : [
          [0, 0],
          [b, 0],
          [b + shift, h],
          [0, h],
        ];
  const moved = cut.map(([x, y]) => [x + b, y] as Point),
    start = shift >= 0 ? shift : 0;
  const rectangle: Point[] = [
    [start, 0],
    [start + b, 0],
    [start + b, h],
    [start, h],
  ];
  return {
    original,
    cut,
    remaining,
    moved,
    rectangle,
    area: b * h,
    cutArea: polygonArea(cut),
    base: b,
    height: h,
    shift,
  };
}
export function triangleRearrangement(b: number, h: number, apex: number) {
  boundedWhole(b, 12, 1);
  boundedWhole(h, 10, 1);
  if (!Number.isInteger(apex) || apex < -b || apex > 2 * b)
    throw new RangeError(
      'Use a bounded apex position, including obtuse triangles',
    );
  const original: Point[] = [
      [0, 0],
      [b, 0],
      [apex, h],
    ],
    mirror = apex > b,
    shift = mirror ? b - apex : apex;
  const first: Point[] = [
    [0, 0],
    [b, 0],
    [shift, h],
  ];
  const second = first.map(([x, y]) => [b + shift - x, h - y] as Point);
  return {
    original,
    first,
    second,
    mirror,
    shift,
    base: b,
    height: h,
    area: (b * h) / 2,
    pair: parallelogramCut(b, h, shift),
  };
}
export function trapezoidRearrangement(
  a: number,
  b: number,
  h: number,
  shift: number,
) {
  boundedWhole(a, 12, 1);
  boundedWhole(b, 12, 1);
  boundedWhole(h, 10, 1);
  if (!Number.isInteger(shift) || Math.abs(shift) > b)
    throw new RangeError('Use a bounded trapezoid offset');
  const first: Point[] = [
      [0, 0],
      [b, 0],
      [shift + a, h],
      [shift, h],
    ],
    second = first.map(([x, y]) => [a + b + shift - x, h - y] as Point);
  return {
    first,
    second,
    area: ((a + b) * h) / 2,
    pair: parallelogramCut(a + b, h, shift),
    isParallelogram: a === b,
    top: a,
    bottom: b,
    height: h,
    shift,
  };
}
export function cuboid(w: number, d: number, h: number) {
  boundedWhole(w, 6, 1);
  boundedWhole(d, 6, 1);
  boundedWhole(h, 6, 1);
  return {
    w,
    d,
    h,
    layerCount: w * d,
    volume: w * d * h,
    cubes: Array.from({ length: w * d * h }, (_, i) => ({
      x: i % w,
      y: Math.floor(i / w) % d,
      z: Math.floor(i / (w * d)),
    })).sort((a, b) => a.z - b.z || a.x + a.y - b.x - b.y),
  };
}
export function isoPoint(x: number, y: number, z: number): Point {
  return [((x - y) * 24 * Math.sqrt(3)) / 2, (x + y) * 12 - z * 24];
}
export type NetFaceId = 'left' | 'front' | 'right' | 'back' | 'top' | 'bottom';
export function cuboidNet(w: number, d: number, h: number, lid = true) {
  boundedWhole(w, 8, 1);
  boundedWhole(d, 8, 1);
  boundedWhole(h, 8, 1);
  const faces: { id: NetFaceId; x: number; y: number; w: number; h: number }[] =
    [
      { id: 'left', x: 0, y: d, w: d, h },
      { id: 'front', x: d, y: d, w, h },
      { id: 'right', x: d + w, y: d, w: d, h },
      { id: 'back', x: 2 * d + w, y: d, w, h },
      ...(lid ? [{ id: 'top' as const, x: d, y: 0, w, h: d }] : []),
      { id: 'bottom', x: d, y: d + h, w, h: d },
    ];
  return {
    faces,
    width: 2 * (w + d),
    height: h + 2 * d,
    bounds: {
      x: 0,
      y: lid ? 0 : d,
      width: 2 * (w + d),
      height: h + (lid ? 2 * d : d),
      area: 2 * (w + d) * (h + (lid ? 2 * d : d)),
    },
    surface: faces.reduce((sum, f) => sum + f.w * f.h, 0),
  };
}
export function unitTiling(dimension: 1 | 2 | 3) {
  if (![1, 2, 3].includes(dimension))
    throw new RangeError('Choose length, area or volume');
  return {
    factor: 10,
    count: 10 ** dimension,
    visible: dimension === 1 ? 10 : 100,
    layers: dimension === 3 ? 10 : 1,
  };
}
