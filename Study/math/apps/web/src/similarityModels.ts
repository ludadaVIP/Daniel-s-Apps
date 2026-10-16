import {
  rational,
  addR,
  negR,
  mulR,
  divR,
  sameR,
  textR,
  type Rational,
} from './algebraModels';
import { readRational } from './rationalModels';
import type { Coordinate } from './cartesianModels';
import {
  rigidImage,
  squaredDistance,
  exactRootText,
} from './pythagoreanModels';
import {
  sssTriangle,
  sasTriangle,
  angleTriangle,
  ssaAlternatives,
  type Vertex,
  type TriangleSide,
  type GeoPoint,
} from './congruenceModels';
const Z: Rational = [0n, 1n],
  ONE: Rational = [1n, 1n];
export const numberS = (r: Rational) => Number(r[0]) / Number(r[1]);
export function positiveS(raw: string, max = 1000) {
  const r = readRational(raw);
  if (r[0] <= 0n || !Number.isFinite(numberS(r)) || numberS(r) > max)
    throw new RangeError('Positive bounded quantity');
  return r;
}
export const baseSimilarTriangle: Coordinate[] = [
  [
    [0n, 1n],
    [0n, 1n],
  ],
  [
    [4n, 1n],
    [0n, 1n],
  ],
  [
    [0n, 1n],
    [3n, 1n],
  ],
];
export function dilationImage(
  p: Coordinate,
  center: Coordinate,
  k: Rational,
): Coordinate {
  if (k[0] <= 0n || numberS(k) > 10) throw new RangeError('Use 0<k≤10');
  return [
    addR(center[0], mulR(k, addR(p[0], negR(center[0])))),
    addR(center[1], mulR(k, addR(p[1], negR(center[1])))),
  ];
}
export function similarityImage(
  points: Coordinate[],
  factor: string,
  turns: 0 | 1 | 2 | 3 = 0,
  mirror = false,
) {
  const k = positiveS(factor, 3);
  return points.map((p) => {
    let q = dilationImage(p, [Z, Z], k);
    if (mirror) q = rigidImage(q, { kind: 'reflect', line: 'y-axis' });
    return turns ? rigidImage(q, { kind: 'rotate', center: [Z, Z], turns }) : q;
  });
}
export function twiceTriangleArea(points: Coordinate[]) {
  if (points.length !== 3) throw new RangeError('Three vertices');
  let sum = Z;
  for (let i = 0; i < 3; i++) {
    const a = points[i]!,
      b = points[(i + 1) % 3]!;
    sum = addR(sum, addR(mulR(a[0], b[1]), negR(mulR(a[1], b[0]))));
  }
  return sum[0] < 0n ? negR(sum) : sum;
}
export function similaritySummary(
  source: Coordinate[],
  target: Coordinate[],
  order = 'DEF',
) {
  if (!/^(?:DEF|DFE|EDF|EFD|FDE|FED)$/.test(order))
    throw new RangeError('A permutation of DEF');
  if (
    source.length !== 3 ||
    target.length !== 3 ||
    [...source, ...target].some((p) =>
      p.some(
        (r) => !Number.isFinite(numberS(r)) || Math.abs(numberS(r)) > 1000,
      ),
    )
  )
    throw new RangeError('Three bounded points in each triangle');
  const sourceArea = divR(twiceTriangleArea(source), [2n, 1n]),
    targetArea = divR(twiceTriangleArea(target), [2n, 1n]);
  if (!sourceArea[0] || !targetArea[0])
    throw new RangeError('Nondegenerate triangles required');
  const matched = [...order].map((v) => target['DEF'.indexOf(v)]!),
    ratios = source.map((p, i) =>
      divR(
        squaredDistance(matched[i]!, matched[(i + 1) % 3]!),
        squaredDistance(p, source[(i + 1) % 3]!),
      ),
    ),
    similar = ratios.every((r) => sameR(r, ratios[0]!));
  return {
    sourceArea,
    targetArea,
    areaRatio: divR(targetArea, sourceArea),
    squaredRatios: ratios,
    similar,
    congruent: similar && sameR(ratios[0]!, ONE),
    factor: similar ? exactRootText(ratios[0]!) : null,
  };
}
export type SimilarityClass = 'similar' | 'not-similar';
export type SimilarityRule = 'AA' | 'SAS' | 'SSS' | 'insufficient';
export function checkSimilarityClass(raw: string, wanted: SimilarityClass) {
  const names: Record<SimilarityClass, string[]> = {
    similar: ['similar', '相似'],
    'not-similar': ['not-similar', 'not similar', '不相似'],
  };
  return names[wanted].includes(raw.trim().toLowerCase().replace(/\s+/g, ' '));
}
export function checkSimilarityRule(
  raw: string,
  wanted: SimilarityRule,
  alternatives: SimilarityRule[] = [],
) {
  let s = raw.trim().toUpperCase().replace(/\s+/g, ' ');
  if (['条件不足', 'INSUFFICIENT', 'NOT ENOUGH INFORMATION'].includes(s))
    s = 'insufficient';
  if (['AAA', '角角', '两角'].includes(s)) s = 'AA';
  return [wanted, ...alternatives].includes(s as SimilarityRule);
}
export type SimilarityFacts = {
  angles: Vertex[];
  ratios: Partial<Record<TriangleSide, string>>;
};
/** General criteria for a fixed correspondence of nondegenerate triangles.
 * Angle entries mean equality, not an additional right-angle premise. */
export function availableSimilarityRules(f: SimilarityFacts): SimilarityRule[] {
  if (
    f.angles.some((v) => !['A', 'B', 'C'].includes(v)) ||
    Object.keys(f.ratios).some((s) => !['AB', 'BC', 'CA'].includes(s))
  )
    throw new RangeError('Known corresponding elements');
  const angles = new Set(f.angles),
    ratios = new Map(
      Object.entries(f.ratios).map(([s, v]) => [s, positiveS(v!, 20)]),
    ),
    rules: SimilarityRule[] = [];
  if (angles.size >= 2) rules.push('AA');
  const edges: Record<Vertex, TriangleSide[]> = {
    A: ['AB', 'CA'],
    B: ['AB', 'BC'],
    C: ['BC', 'CA'],
  };
  if (
    [...angles].some((v) => {
      const [a, b] = edges[v];
      return (
        ratios.has(a!) &&
        ratios.has(b!) &&
        sameR(ratios.get(a!)!, ratios.get(b!)!)
      );
    })
  )
    rules.push('SAS');
  if (
    ratios.size === 3 &&
    [...ratios.values()].every((v) => sameR(v, [...ratios.values()][0]!))
  )
    rules.push('SSS');
  return rules.length ? rules : ['insufficient'];
}
export const similarityCases: {
  id: string;
  facts: SimilarityFacts;
  source: GeoPoint[];
  target: GeoPoint[];
  sourceLengths: Partial<Record<TriangleSide, string>>;
  targetLengths: Partial<Record<TriangleSide, string>>;
  angleValues: Partial<Record<Vertex, number>>;
}[] = [
  {
    id: 'AA',
    facts: { angles: ['A', 'B'], ratios: {} },
    source: angleTriangle(50, 60, 4),
    target: angleTriangle(50, 60, 6),
    sourceLengths: {},
    targetLengths: {},
    angleValues: { A: 50, B: 60 },
  },
  {
    id: 'SAS',
    facts: { angles: ['A'], ratios: { AB: '3/2', CA: '3/2' } },
    source: sasTriangle(4, 3, 60),
    target: sasTriangle(6, 4.5, 60),
    sourceLengths: { AB: '4', CA: '3' },
    targetLengths: { AB: '6', CA: '9/2' },
    angleValues: { A: 60 },
  },
  {
    id: 'SSS',
    facts: { angles: [], ratios: { AB: '3/2', BC: '3/2', CA: '3/2' } },
    source: sssTriangle(4, 5, 3)!,
    target: sssTriangle(6, 7.5, 4.5)!,
    sourceLengths: { AB: '4', BC: '5', CA: '3' },
    targetLengths: { AB: '6', BC: '15/2', CA: '9/2' },
    angleValues: {},
  },
  {
    id: 'SSA',
    facts: { angles: ['A'], ratios: { AB: '3/2', BC: '3/2' } },
    source: ssaAlternatives()[0]!,
    target: ssaAlternatives()[1]!.map((p) => ({ x: p.x * 1.5, y: p.y * 1.5 })),
    sourceLengths: { AB: '6', BC: '4' },
    targetLengths: { AB: '9', BC: '6' },
    angleValues: { A: 30 },
  },
  {
    id: 'one-angle',
    facts: { angles: ['A'], ratios: {} },
    source: sasTriangle(4, 3, 60),
    target: sasTriangle(6, 3, 60),
    sourceLengths: {},
    targetLengths: {},
    angleValues: { A: 60 },
  },
  {
    id: 'unequal-ratios',
    facts: { angles: [], ratios: { AB: '3/2', BC: '3/2', CA: '2' } },
    source: sssTriangle(4, 5, 3)!,
    target: sssTriangle(6, 7.5, 6)!,
    sourceLengths: { AB: '4', BC: '5', CA: '3' },
    targetLengths: { AB: '6', BC: '15/2', CA: '6' },
    angleValues: {},
  },
  {
    id: 'AAA',
    facts: { angles: ['A', 'B', 'C'], ratios: {} },
    source: angleTriangle(50, 60, 4),
    target: angleTriangle(50, 60, 6),
    sourceLengths: {},
    targetLengths: {},
    angleValues: { A: 50, B: 60, C: 70 },
  },
];
export function scaledSide(
  sourceSide: string,
  sourceReference: string,
  targetReference: string,
) {
  const k = divR(positiveS(targetReference), positiveS(sourceReference));
  return { factor: k, target: mulR(positiveS(sourceSide), k) };
}
export function rectangleScale(
  width: string,
  height: string,
  sx: string,
  sy = sx,
) {
  const w = positiveS(width),
    h = positiveS(height),
    a = positiveS(sx, 10),
    b = positiveS(sy, 10),
    targetWidth = mulR(w, a),
    targetHeight = mulR(h, b);
  return {
    width: w,
    height: h,
    sx: a,
    sy: b,
    targetWidth,
    targetHeight,
    sourceArea: mulR(w, h),
    targetArea: mulR(targetWidth, targetHeight),
    areaRatio: mulR(a, b),
    perimeterRatio: divR(addR(targetWidth, targetHeight), addR(w, h)),
    similar: sameR(a, b),
  };
}
export function mapDistance(referenceCm: string, denominator: string) {
  return divR(
    mulR(positiveS(referenceCm, 100), positiveS(denominator, 10000000)),
    [100000n, 1n],
  );
}
export function shadowHeight(
  stickHeight: string,
  stickShadow: string,
  targetShadow: string,
) {
  return mulR(
    divR(positiveS(stickHeight), positiveS(stickShadow)),
    positiveS(targetShadow),
  );
}
export type PhotoMode = 'uniform' | 'stretch' | 'crop' | 'perspective';
export function photoModel(mode: PhotoMode) {
  if (mode === 'perspective')
    return { mode, similar: false, width: null, height: null, area: null };
  if (!['uniform', 'stretch', 'crop'].includes(mode))
    throw new RangeError('Known photo operation');
  const height = mode === 'uniform' ? '15/2' : mode === 'stretch' ? '6' : '5';
  return {
    mode,
    similar: mode === 'uniform',
    width: positiveS('10'),
    height: positiveS(height),
    area: mulR([10n, 1n], positiveS(height)),
  };
}
/** A genuine planar projective example; u,v are positions in the original frame. */
export function projectivePhotoPoint(u: number, v: number): GeoPoint {
  const den = 1 + v / 3;
  return { x: (10 * u + (16 * v) / 15) / den, y: (8 * v) / den };
}
export const similaritySideCases = [
  {
    id: 'forward',
    factor: '3/2',
    value: '15/2',
    story: {
      zh: '已知△ABC∼△DEF，AB=4 cm、DE=6 cm、BC=5 cm。求EF，倍率定义为第二个/第一个。',
      en: 'Given △ABC∼△DEF, AB=4 cm, DE=6 cm and BC=5 cm. Find EF, using second/first as the scale direction.',
    },
  },
  {
    id: 'reverse',
    factor: '3/2',
    value: '3',
    story: {
      zh: '同一相似对应中AB=4 cm、DE=6 cm、DF=9/2 cm。求原三角形CA；从像边反求要除倍率。',
      en: 'Under the same similarity AB=4 cm, DE=6 cm and DF=9/2 cm. Find original CA; reverse scaling divides by the factor.',
    },
  },
  {
    id: 'nested',
    factor: '2/3',
    value: '8',
    story: {
      zh: 'D在AB上、E在AC上，已给DE∥BC；AB=6、AD=4、AC=9、BC=12（cm）。求DE，使用小△ADE/大△ABC。',
      en: 'D lies on AB and E on AC, with given DE∥BC. AB=6, AD=4, AC=9 and BC=12 cm. Find DE using small △ADE / large △ABC.',
    },
  },
  {
    id: 'insufficient',
    factor: null,
    value: null,
    story: {
      zh: '只知AB=4 cm、DE=6 cm、BC=5 cm，没有给两三角形相似。能唯一确定EF吗？判断条件是否充分。',
      en: 'Only AB=4 cm, DE=6 cm and BC=5 cm are known; similarity is not given. Can EF be uniquely determined? Judge whether the evidence is sufficient.',
    },
  },
];
export const sideNames = ['AB', 'BC', 'CA'] as const;
export const similarityNumericPoints = (p: Coordinate[]) =>
  p.map((p) => ({ x: numberS(p[0]), y: numberS(p[1]) }));
export const similarityTextRatio = (target: string, source: string) =>
  textR(divR(positiveS(target), positiveS(source)));
export const rationalS = (n: number) => rational(BigInt(n));
