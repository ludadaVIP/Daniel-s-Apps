export type PlanePoint = { x: number; y: number };
export type GeometryClass =
  | 'point'
  | 'line'
  | 'ray'
  | 'segment'
  | 'acute'
  | 'right'
  | 'obtuse'
  | 'equilateral'
  | 'isosceles'
  | 'scalene'
  | 'impossible'
  | 'undetermined'
  | 'parallel';
const aliases: Record<GeometryClass, string[]> = {
  point: ['point', '点'],
  line: ['line', '直线'],
  ray: ['ray', '射线'],
  segment: ['segment', 'line segment', '线段'],
  acute: ['acute', 'acute triangle', '锐角三角形'],
  right: ['right', 'right triangle', 'right-angled triangle', '直角三角形'],
  obtuse: ['obtuse', 'obtuse triangle', 'obtuse-angled triangle', '钝角三角形'],
  equilateral: ['equilateral', 'equilateral triangle', '等边三角形'],
  isosceles: ['isosceles', 'isosceles triangle', '等腰三角形'],
  scalene: ['scalene', 'scalene triangle', '不等边三角形'],
  impossible: ['impossible', 'no triangle', '不能构成三角形', '不能成三角形'],
  undetermined: [
    'undetermined',
    'cannot determine',
    'not enough information',
    '无法确定',
    '不能确定',
    '条件不足',
  ],
  parallel: ['parallel', '平行'],
};
export function checkGeometryClass(raw: string, expected: GeometryClass) {
  return aliases[expected].includes(
    raw.trim().toLowerCase().replace(/\s+/g, ' '),
  );
}
const finite = (n: number) => {
  if (!Number.isFinite(n)) throw new RangeError('Use finite geometry data');
  return n;
};
export function properAngle(n: number) {
  finite(n);
  if (n <= 0 || n >= 180)
    throw new RangeError('Use an angle strictly between zero and 180');
  return n;
}
export function turnPoint(
  origin: PlanePoint,
  degrees: number,
  length: number,
): PlanePoint {
  finite(degrees);
  finite(length);
  if (length < 0) throw new RangeError('Nonnegative length');
  const r = (degrees * Math.PI) / 180;
  return {
    x: origin.x + length * Math.cos(r),
    y: origin.y - length * Math.sin(r),
  };
}
export const pointDistance = (a: PlanePoint, b: PlanePoint) =>
  Math.hypot(a.x - b.x, a.y - b.y);
export function intersectionAngles(a: number) {
  properAngle(a);
  return [a, 180 - a, a, 180 - a] as const;
}
export function transversalAngles(
  top: number,
  bottom: number,
  parallel: boolean,
) {
  properAngle(top);
  properAngle(bottom);
  if (parallel && top !== bottom)
    throw new RangeError(
      'Given parallel lines require matching corresponding angles',
    );
  return {
    angles: [...intersectionAngles(top), ...intersectionAngles(bottom)],
    tilt: top - bottom,
    parallel,
  };
}
export function triangleAngles(a: number, b: number) {
  properAngle(a);
  properAngle(b);
  const c = 180 - a - b;
  properAngle(c);
  return {
    angles: [a, b, c] as const,
    kind: (Math.max(a, b, c) === 90
      ? 'right'
      : Math.max(a, b, c) > 90
        ? 'obtuse'
        : 'acute') as 'right' | 'obtuse' | 'acute',
  };
}
export function triangleFromAngles(a: number, b: number) {
  const m = triangleAngles(a, b),
    c = m.angles[2],
    base = 200,
    side =
      (base * Math.sin((b * Math.PI) / 180)) / Math.sin((c * Math.PI) / 180);
  return {
    ...m,
    points: [
      { x: 0, y: 0 },
      { x: base, y: 0 },
      {
        x: side * Math.cos((a * Math.PI) / 180),
        y: side * Math.sin((a * Math.PI) / 180),
      },
    ] as const,
  };
}
export function triangleSides(a: number, b: number, c: number) {
  [a, b, c].forEach(finite);
  if ([a, b, c].some((n) => n <= 0 || n > 100000))
    throw new RangeError('Use positive bounded lengths');
  const sorted = [a, b, c].sort((x, y) => x - y),
    valid = sorted[0]! + sorted[1]! > sorted[2]!;
  if (!valid)
    return {
      valid: false as const,
      kind: 'impossible' as const,
      isosceles: false,
      angles: null,
      points: null,
    };
  const kind: 'equilateral' | 'isosceles' | 'scalene' =
      a === b && b === c
        ? 'equilateral'
        : a === b || a === c || b === c
          ? 'isosceles'
          : 'scalene',
    alpha =
      (Math.acos(
        Math.max(-1, Math.min(1, (b * b + c * c - a * a) / (2 * b * c))),
      ) *
        180) /
      Math.PI,
    beta =
      (Math.acos(
        Math.max(-1, Math.min(1, (a * a + c * c - b * b) / (2 * a * c))),
      ) *
        180) /
      Math.PI;
  return {
    valid: true as const,
    kind,
    isosceles: kind !== 'scalene',
    angles: [alpha, beta, 180 - alpha - beta] as const,
    points: [
      { x: 0, y: 0 },
      { x: c, y: 0 },
      {
        x: (b * b + c * c - a * a) / (2 * c),
        y: Math.sqrt(
          Math.max(0, b * b - ((b * b + c * c - a * a) / (2 * c)) ** 2),
        ),
      },
    ] as const,
  };
}
export function thirdSideInterval(a: number, b: number) {
  [a, b].forEach(finite);
  if (a <= 0 || b <= 0 || a > 100000 || b > 100000)
    throw new RangeError('Positive bounded sides');
  return {
    lower: Math.abs(a - b),
    upper: a + b,
    minInteger: Math.floor(Math.abs(a - b)) + 1,
    maxInteger: Math.ceil(a + b) - 1,
  };
}
export const proofCases = [
  {
    id: 'vertical',
    given:
      'Two straight lines intersect; A and B are adjacent, B and C are adjacent.',
    claim: 'A=C',
    valid: ['straight', 'subtract'],
  },
  {
    id: 'parallel',
    given:
      'Lines l and m are given parallel; A and E are corresponding angles.',
    claim: 'A=E',
    valid: ['parallel'],
  },
  {
    id: 'missing',
    given: 'Only the picture suggests l and m may be parallel.',
    claim: 'A=E',
    valid: ['insufficient'],
  },
  {
    id: 'triangle',
    given:
      'A, B and C are the three interior angles of a nondegenerate Euclidean triangle.',
    claim: 'A+B+C=180°',
    valid: ['triangle'],
  },
] as const;
export type ProofReason =
  | 'straight'
  | 'subtract'
  | 'parallel'
  | 'insufficient'
  | 'triangle'
  | 'appearance'
  | 'vertical';
export function proofSelection(index: number, selected: ProofReason[]) {
  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= proofCases.length ||
    new Set(selected).size !== selected.length
  )
    throw new RangeError('Choose a proof case and distinct reasons');
  const needed: readonly string[] = proofCases[index]!.valid;
  return (
    selected.length === needed.length &&
    selected.every((x) => needed.includes(x))
  );
}
