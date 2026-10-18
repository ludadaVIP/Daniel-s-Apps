import {
  rational,
  addR,
  negR,
  mulR,
  divR,
  textR,
  type Rational,
} from './algebraModels';
import { principalRadical, radicalText, readRadical } from './radicalModels';
export type SpacePoint = readonly [number, number, number];
export type ExactPoint3 = readonly [Rational, Rational, Rational];
export type SolidCode =
  | 'intersecting'
  | 'parallel'
  | 'skew'
  | 'coincident'
  | 'contained'
  | 'prism'
  | 'pyramid'
  | 'sphere'
  | 'valid-net'
  | 'invalid-net'
  | 'undefined';
const names: Record<SolidCode, string[]> = {
  intersecting: ['intersecting', '相交'],
  parallel: ['parallel', '平行'],
  skew: ['skew', '异面'],
  coincident: ['coincident', '重合'],
  contained: ['contained', '在平面内', '包含'],
  prism: ['prism', '棱柱'],
  pyramid: ['pyramid', '棱锥'],
  sphere: ['sphere', '球'],
  'valid-net': ['valid-net', '有效', '有效展开图'],
  'invalid-net': ['invalid-net', '无效', '无效展开图'],
  undefined: ['undefined', '无定义'],
};
export const checkSolidCode = (raw: string, value: SolidCode) =>
  names[value].includes(raw.trim().toLowerCase());
export const add3 = (a: SpacePoint, b: SpacePoint): SpacePoint => [
  a[0] + b[0],
  a[1] + b[1],
  a[2] + b[2],
];
export const sub3 = (a: SpacePoint, b: SpacePoint): SpacePoint => [
  a[0] - b[0],
  a[1] - b[1],
  a[2] - b[2],
];
export const dot3 = (a: SpacePoint, b: SpacePoint) =>
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross3 = (a: SpacePoint, b: SpacePoint): SpacePoint => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const negative3 = (a: SpacePoint): SpacePoint => [-a[0], -a[1], -a[2]];
const zero3 = (a: SpacePoint) => a.every((n) => n === 0);
const same3 = (a: SpacePoint, b: SpacePoint) => a.every((n, i) => n === b[i]);
function integer(n: number, min = 1, max = 20) {
  if (!Number.isSafeInteger(n) || n < min || n > max)
    throw new RangeError('Bounded integer geometry');
  return n;
}
function integerPoint(p: SpacePoint) {
  p.forEach((n) => integer(n, -100, 100));
}
/** Infinite lines, not just the drawn segments. Integer coordinates keep all predicates exact. */
export function spaceLineRelation(
  a: SpacePoint,
  b: SpacePoint,
  c: SpacePoint,
  d: SpacePoint,
): SolidCode {
  [a, b, c, d].forEach(integerPoint);
  const u = sub3(b, a),
    v = sub3(d, c),
    w = sub3(c, a);
  if (zero3(u) || zero3(v))
    throw new RangeError('Two distinct points define a line');
  const cross = cross3(u, v);
  if (zero3(cross)) return zero3(cross3(w, u)) ? 'coincident' : 'parallel';
  return dot3(w, cross) === 0 ? 'intersecting' : 'skew';
}
export function linePlaneRelation(
  a: SpacePoint,
  b: SpacePoint,
  normal: SpacePoint,
  offset: number,
): SolidCode {
  [a, b, normal].forEach(integerPoint);
  integer(offset, -100, 100);
  if (zero3(normal) || same3(a, b))
    throw new RangeError('A plane and a nonzero line are required');
  return dot3(sub3(b, a), normal) !== 0
    ? 'intersecting'
    : dot3(a, normal) === offset
      ? 'contained'
      : 'parallel';
}
export function planeRelation(
  n: SpacePoint,
  d: number,
  m: SpacePoint,
  e: number,
): SolidCode {
  [n, m].forEach(integerPoint);
  integer(d, -100, 100);
  integer(e, -100, 100);
  if (zero3(n) || zero3(m)) throw new RangeError('Nonzero plane normals');
  if (!zero3(cross3(n, m))) return 'intersecting';
  const i = n.findIndex((x) => x !== 0);
  return d * m[i]! === e * n[i]! ? 'coincident' : 'parallel';
}
export const cubeEdges: readonly (readonly [number, number])[] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];
export const cubeNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
export function cuboidVertices(a = 3, b = 4, h = 12): SpacePoint[] {
  [a, b, h].forEach((n) => integer(n, 1, 36));
  return [
    [0, 0, 0],
    [a, 0, 0],
    [a, b, 0],
    [0, b, 0],
    [0, 0, h],
    [a, 0, h],
    [a, b, h],
    [0, b, h],
  ];
}
export const relationCases = {
  skew: { pair: [0, 1, 2, 6], label: ['直线AB与CG', 'Lines AB and CG'] },
  parallel: { pair: [0, 1, 2, 3], label: ['直线AB与CD', 'Lines AB and CD'] },
  intersecting: {
    pair: [0, 1, 0, 4],
    label: ['直线AB与AE', 'Lines AB and AE'],
  },
  coincident: { pair: [0, 1, 1, 0], label: ['直线AB与BA', 'Lines AB and BA'] },
} as const;
export function solidCounts(kind: 'prism' | 'pyramid' | 'sphere', n = 4) {
  integer(n, 3, 8);
  return kind === 'sphere'
    ? { vertices: 0, edges: 0, faces: 0, euler: null }
    : kind === 'prism'
      ? { vertices: 2 * n, edges: 3 * n, faces: n + 2, euler: 2 }
      : { vertices: n + 1, edges: 2 * n, faces: n + 1, euler: 2 };
}
export function solidVolume(
  kind: 'prism' | 'pyramid',
  baseArea: number,
  height: number,
) {
  integer(baseArea, 1, 100);
  integer(height, 1, 12);
  return rational(BigInt(baseArea * height), kind === 'pyramid' ? 3n : 1n);
}
export function sphereMeasures(radius: number) {
  integer(radius, 1, 6);
  return {
    volumeCoefficient: rational(BigInt(4 * radius ** 3), 3n),
    surfaceCoefficient: rational(BigInt(4 * radius ** 2)),
  };
}
const toExact = (p: SpacePoint): ExactPoint3 =>
  p.map((n) => rational(BigInt(n))) as unknown as ExactPoint3;
export const exact3Text = (p: ExactPoint3) => `(${p.map(textR).join(', ')})`;
export const exact3Number = (p: ExactPoint3): SpacePoint =>
  p.map((r) => Number(r[0]) / Number(r[1])) as unknown as SpacePoint;
const difference = (a: Rational, b: Rational) => addR(a, negR(b));
const cmp = (a: Rational, b: Rational) => {
  const n = a[0] * b[1] - b[0] * a[1];
  return n < 0n ? -1 : n > 0n ? 1 : 0;
};
/** Clip all twelve cube edges; order the convex polygon with exact planar orientation tests. */
export function cubeSection(
  side: number,
  normal: SpacePoint,
  offset: Rational,
) {
  integer(side, 1, 8);
  normal.forEach((n) => integer(n, -4, 4));
  if (
    zero3(normal) ||
    offset[1] <= 0n ||
    offset[1] > 1000n ||
    offset[0] < -10000n ||
    offset[0] > 10000n
  )
    throw new RangeError('Bounded nonzero cutting plane');
  const vertices = cuboidVertices(side, side, side).map(toExact),
    value = (p: ExactPoint3) =>
      difference(
        p.reduce(
          (s, r, i) => addR(s, mulR(r, rational(BigInt(normal[i]!)))),
          rational(0n),
        ),
        offset,
      ),
    points = new Map<string, ExactPoint3>();
  const put = (p: ExactPoint3) => points.set(exact3Text(p), p);
  for (const [i, j] of cubeEdges) {
    const a = vertices[i]!,
      b = vertices[j]!,
      fa = value(a),
      fb = value(b);
    if (!fa[0]) put(a);
    if (!fb[0]) put(b);
    if (fa[0] * fb[0] < 0n) {
      const t = divR(fa, difference(fa, fb));
      put(
        a.map((r, k) =>
          addR(r, mulR(t, difference(b[k]!, r))),
        ) as unknown as ExactPoint3,
      );
    }
  }
  const drop = normal.findIndex((n) => n !== 0),
    axes = [0, 1, 2].filter((i) => i !== drop),
    sorted = [...points.values()].sort(
      (a, b) =>
        cmp(a[axes[0]!]!, b[axes[0]!]!) || cmp(a[axes[1]!]!, b[axes[1]!]!),
    ),
    turn = (o: ExactPoint3, a: ExactPoint3, b: ExactPoint3) =>
      difference(
        mulR(
          difference(a[axes[0]!]!, o[axes[0]!]!),
          difference(b[axes[1]!]!, o[axes[1]!]!),
        ),
        mulR(
          difference(a[axes[1]!]!, o[axes[1]!]!),
          difference(b[axes[0]!]!, o[axes[0]!]!),
        ),
      );
  let polygon = sorted;
  if (sorted.length > 2) {
    const lower: ExactPoint3[] = [],
      upper: ExactPoint3[] = [];
    for (const p of sorted) {
      while (
        lower.length >= 2 &&
        turn(lower.at(-2)!, lower.at(-1)!, p)[0] <= 0n
      )
        lower.pop();
      lower.push(p);
    }
    for (const p of [...sorted].reverse()) {
      while (
        upper.length >= 2 &&
        turn(upper.at(-2)!, upper.at(-1)!, p)[0] <= 0n
      )
        upper.pop();
      upper.push(p);
    }
    polygon = [...lower.slice(0, -1), ...upper.slice(0, -1)];
  }
  const areaVector = [rational(0n), rational(0n), rational(0n)];
  if (polygon.length >= 3)
    polygon.forEach((p, i) => {
      const q = polygon[(i + 1) % polygon.length]!;
      for (let k = 0; k < 3; k++) {
        const j = (k + 1) % 3,
          l = (k + 2) % 3;
        areaVector[k] = addR(
          areaVector[k]!,
          difference(mulR(p[j]!, q[l]!), mulR(p[l]!, q[j]!)),
        );
      }
    });
  const areaSquare = divR(
    areaVector.reduce((s, r) => addR(s, mulR(r, r)), rational(0n)),
    rational(4n),
  );
  return {
    points: polygon,
    dimension:
      polygon.length === 0
        ? -1
        : polygon.length === 1
          ? 0
          : polygon.length === 2
            ? 1
            : 2,
    areaSquare,
    area: radicalText(principalRadical(areaSquare)),
  };
}
export type NetCell = readonly [number, number];
type Frame = { r: SpacePoint; u: SpacePoint; n: SpacePoint };
export const solidNets = {
  cross: [
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
    [1, 0],
    [1, 2],
  ],
  stair: [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
    [2, 2],
    [3, 2],
  ],
  rectangle: [
    [0, 0],
    [1, 0],
    [2, 0],
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  strip: [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
  ],
} as const;
/** Parallel transport of face frames by quarter turns, plus consistency and unique face normals. */
export function foldCubeNet(cells: readonly NetCell[]) {
  if (cells.length !== 6)
    throw new RangeError('Exactly six labelled unit squares');
  cells.forEach((p) => p.forEach((n) => integer(n, -12, 12)));
  if (new Set(cells.map((p) => p.join(','))).size !== 6)
    throw new RangeError('Distinct net squares');
  const frames: (Frame | undefined)[] = Array(6),
    queue = [0];
  frames[0] = { r: [1, 0, 0], u: [0, 1, 0], n: [0, 0, 1] };
  let consistent = true;
  for (let head = 0; head < queue.length; head++) {
    const i = queue[head]!,
      f = frames[i]!;
    for (let j = 0; j < 6; j++) {
      const dx = cells[j]![0] - cells[i]![0],
        dy = cells[j]![1] - cells[i]![1];
      let next: Frame | undefined;
      if (dx === 1 && dy === 0) next = { r: negative3(f.n), u: f.u, n: f.r };
      if (dx === -1 && dy === 0) next = { r: f.n, u: f.u, n: negative3(f.r) };
      if (dx === 0 && dy === 1) next = { r: f.r, u: negative3(f.n), n: f.u };
      if (dx === 0 && dy === -1) next = { r: f.r, u: f.n, n: negative3(f.u) };
      if (!next) continue;
      if (frames[j]) {
        const old = frames[j]!;
        if (
          !same3(old.n, next.n) ||
          !same3(old.r, next.r) ||
          !same3(old.u, next.u)
        )
          consistent = false;
      } else {
        frames[j] = next;
        queue.push(j);
      }
    }
  }
  const normals = new Set(frames.flatMap((f) => (f ? [f.n.join(',')] : []))),
    valid = queue.length === 6 && consistent && normals.size === 6;
  return {
    frames,
    connected: queue.length === 6,
    consistent,
    uniqueNormals: normals.size,
    valid,
    opposite: (i: number) => {
      integer(i, 0, 5);
      if (!valid) return null;
      return frames.findIndex((f) => f && dot3(f.n, frames[i]!.n) === -1) + 1;
    },
  };
}
export function spaceDistances(a: number, b: number, h: number) {
  [a, b, h].forEach((n) => integer(n, 1, 12));
  const root = (n: number) =>
      radicalText(principalRadical(rational(BigInt(n)))),
    baseSquare = a * a + b * b,
    bodySquare = baseSquare + h * h,
    cosine = (numerator: string) => {
      const r = readRadical(`(${numerator})/sqrt(${bodySquare})`);
      if (!r) throw new RangeError('Supported exact cosine');
      return radicalText(r);
    };
  return {
    base: root(baseSquare),
    body: root(bodySquare),
    pointPlane: String(h),
    pointLine: root(b * b + h * h),
    skewDistance: String(b),
    linePlaneCos: cosine(root(baseSquare)),
    lineLineCos: cosine(String(a)),
    baseSquare,
    bodySquare,
  };
}
export type Box3 = { min: SpacePoint; size: SpacePoint };
export const boxVertices = (box: Box3) =>
  cuboidVertices(...box.size).map((p) => add3(p, box.min));
export function joinedBoxes(a: Box3, b: Box3) {
  [a, b].forEach((box) => {
    integerPoint(box.min);
    box.size.forEach((n) => integer(n, 1, 12));
  });
  const overlap = [0, 1, 2].map(
    (i) =>
      Math.min(a.min[i]! + a.size[i]!, b.min[i]! + b.size[i]!) -
      Math.max(a.min[i]!, b.min[i]!),
  );
  if (overlap.every((n) => n > 0))
    throw new RangeError('This model requires disjoint interiors');
  let contact = 0;
  for (let i = 0; i < 3; i++)
    if (overlap[i] === 0) {
      const other = overlap.filter((_, k) => k !== i);
      if (other.every((n) => n > 0)) contact += other[0]! * other[1]!;
    }
  const volume = (s: SpacePoint) => s[0] * s[1] * s[2],
    surface = (s: SpacePoint) => 2 * (s[0] * s[1] + s[0] * s[2] + s[1] * s[2]),
    sumSurface = surface(a.size) + surface(b.size);
  return {
    volume: volume(a.size) + volume(b.size),
    contact,
    sumSurface,
    surface: sumSurface - 2 * contact,
    overlap,
  };
}
export function compoundCase(
  kind: 'top' | 'full-width' | 'side' | 'gap' = 'top',
  scale = 1,
) {
  integer(scale, 1, 3);
  const a: Box3 = { min: [0, 0, 0], size: [6, 4, 2] },
    b: Box3 = {
      min: kind === 'side' ? [6, 0, 0] : kind === 'gap' ? [0, 0, 3] : [0, 0, 2],
      size: kind === 'full-width' ? [3, 4, 2] : [3, 2, 2],
    };
  const scaled = (box: Box3): Box3 => ({
    min: box.min.map((n) => n * scale) as unknown as SpacePoint,
    size: box.size.map((n) => n * scale) as unknown as SpacePoint,
  });
  // Coordinates may reach 18 after dilation, while the primitive validator is bounded to twelve.
  const result = joinedBoxes(a, b);
  return {
    a: scaled(a),
    b: scaled(b),
    volume: result.volume * scale ** 3,
    contact: result.contact * scale ** 2,
    sumSurface: result.sumSurface * scale ** 2,
    surface: result.surface * scale ** 2,
  };
}
