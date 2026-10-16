import {
  addR,
  negR,
  mulR,
  divR,
  sameR,
  textR,
  type Rational,
} from './algebraModels';
import { readRational } from './rationalModels';
import {
  parsePolynomial,
  equalPolynomial,
  isCollectedPolynomial,
  polynomialText,
} from './polynomialModels';
import { factorTree } from './factorModels';
import {
  parseQuadraticEquation,
  solveQuadratic,
  numericQ,
} from './quadraticModels';
import { radicalText } from './radicalModels';
const Z: Rational = [0n, 1n],
  ONE: Rational = [1n, 1n];
export const compareR = (a: Rational, b: Rational) => {
  const n = a[0] * b[1] - b[0] * a[1];
  return n > 0n ? 1 : n < 0n ? -1 : 0;
};
export type ParabolaOpening = 'up' | 'down' | 'not-quadratic';
export type QuadraticForm = 'standard' | 'vertex' | 'factored';
export function parabolaModel(source: string) {
  const m = parseQuadraticEquation(`${source}=0`);
  if (!m || m.kind === 'higher')
    throw new RangeError('Use a bounded polynomial in x of degree at most two');
  const vertex = m.a[0]
    ? {
        x: divR(negR(m.b), mulR([2n, 1n], m.a)),
        y: addR(m.c, negR(divR(mulR(m.b, m.b), mulR([4n, 1n], m.a)))),
      }
    : null;
  return {
    ...m,
    source,
    vertex,
    opening: (!m.a[0]
      ? 'not-quadratic'
      : m.a[0] > 0n
        ? 'up'
        : 'down') as ParabolaOpening,
  };
}
export function parabolaAt(source: string, x: Rational) {
  const m = parabolaModel(source);
  return addR(addR(mulR(m.a, mulR(x, x)), mulR(m.b, x)), m.c);
}
export function checkParabolaOpening(raw: string, wanted: ParabolaOpening) {
  const names: Record<ParabolaOpening, string[]> = {
    up: ['up', 'upward', 'opens up', '开口向上', '向上'],
    down: ['down', 'downward', 'opens down', '开口向下', '向下'],
    'not-quadratic': [
      'not-quadratic',
      'not quadratic',
      '不是二次函数',
      '非二次函数',
    ],
  };
  return names[wanted].includes(raw.trim().toLowerCase());
}
type Node = NonNullable<ReturnType<typeof factorTree>>;
const polynomial = (n: Node) => parsePolynomial(n.raw, ['x'])!;
const constant = (n: Node) => {
  const p = polynomial(n);
  return [...p.keys()].every((k) => k === '');
};
// Inspect the actual expression tree; equality at sample points cannot establish
// either identity or the requested form.
function vertexPart(n: Node): boolean {
  if (constant(n)) return false;
  if (n.kind === 'power' && n.power === 2) {
    const p = polynomial(n.children[0]!);
    return (
      [...p.keys()].every((k) => k.length <= 1) &&
      !!p.get('x') &&
      sameR(mulR(p.get('x')!, p.get('x')!), ONE)
    );
  }
  if (n.kind === 'negative') return vertexPart(n.children[0]!);
  const [a, b] = n.children;
  if (!a || !b) return false;
  if (n.kind === 'sum')
    return constant(a) ? vertexPart(b) : constant(b) && vertexPart(a);
  if (n.kind === 'product')
    return constant(a) ? vertexPart(b) : constant(b) && vertexPart(a);
  if (n.kind === 'division') return constant(b) && vertexPart(a);
  return false;
}
function factorDegrees(n: Node): number[] | null {
  const p = polynomial(n),
    degree = Math.max(0, ...[...p.keys()].map((k) => k.length));
  if (degree === 0) return p.size ? [] : null;
  if (degree === 1) return [1];
  if (n.kind === 'negative') return factorDegrees(n.children[0]!);
  if (n.kind === 'power' && n.power === 2) {
    const base = factorDegrees(n.children[0]!);
    return base?.length === 1 && base[0] === 1 ? [1, 1] : null;
  }
  const [a, b] = n.children;
  if (!a || !b) return null;
  if (n.kind === 'division') return constant(b) ? factorDegrees(a) : null;
  if (n.kind === 'product') {
    const l = factorDegrees(a),
      r = factorDegrees(b);
    return l && r ? [...l, ...r] : null;
  }
  return null;
}
export function checkQuadraticForm(
  raw: string,
  expected: string,
  form?: QuadraticForm,
) {
  if (!equalPolynomial(raw, expected, ['x'])) return false;
  if (!form) return true;
  try {
    const m = parabolaModel(raw);
    if (!m.a[0]) return false;
    const tree = factorTree(raw, ['x']);
    if (!tree) return false;
    return form === 'standard'
      ? isCollectedPolynomial(raw, ['x'])
      : form === 'vertex'
        ? vertexPart(tree)
        : factorDegrees(tree)?.join(',') === '1,1';
  } catch {
    return false;
  }
}
const coefficient = (a: Rational) =>
  sameR(a, ONE)
    ? ''
    : sameR(a, [-1n, 1n])
      ? '-'
      : `${a[1] === 1n ? textR(a) : `(${textR(a)})`}*`;
const shifted = (h: Rational) =>
  h[0] === 0n
    ? 'x'
    : `(x${h[0] > 0n ? '-' : '+'}${textR(h[0] > 0n ? h : negR(h))})`;
const signedConstant = (k: Rational) =>
  k[0] === 0n
    ? ''
    : `${k[0] > 0n ? '+' : '-'}${textR(k[0] > 0n ? k : negR(k))}`;
export function parabolaForms(source: string) {
  const m = parabolaModel(source);
  if (!m.vertex) throw new RangeError('Nonzero quadratic coefficient required');
  const roots = solveQuadratic(`${source}=0`).roots!,
    rationalRoots =
      roots.length > 0 &&
      roots.every((r) => !r.size || (r.size === 1 && r.has(1n)));
  return {
    standard: polynomialText(m.p),
    vertex: `${coefficient(m.a)}${shifted(m.vertex.x)}²${signedConstant(m.vertex.y)}`,
    factored: rationalRoots
      ? `${coefficient(m.a)}${roots.length === 1 ? `${shifted(roots[0]!.get(1n) ?? Z)}²` : roots.map((r) => shifted(r.get(1n) ?? Z)).join('*')}`
      : null,
    roots: roots.map(radicalText),
  };
}
export function horizontalIntersections(source: string, level: string) {
  const target = readRational(level);
  if (Math.abs(numericQ(target)) > 100)
    throw new RangeError('Bounded horizontal target');
  return solveQuadratic(`(${source})=(${textR(target)})`);
}
export function intervalExtrema(
  source: string,
  lower: string,
  upper: string,
  whole = false,
) {
  const m = parabolaModel(source),
    lo = readRational(lower),
    hi = readRational(upper);
  if (
    !m.vertex ||
    compareR(lo, hi) > 0 ||
    [lo, hi].some((r) => Math.abs(numericQ(r)) > 100)
  )
    throw new RangeError(
      'A quadratic on a bounded nonempty closed interval is required',
    );
  let xs: Rational[];
  if (whole) {
    const ceil = (r: Rational) =>
        r[0] / r[1] + (r[0] > 0n && r[0] % r[1] !== 0n ? 1n : 0n),
      floor = (r: Rational) =>
        r[0] / r[1] - (r[0] < 0n && r[0] % r[1] !== 0n ? 1n : 0n),
      first = ceil(lo),
      last = floor(hi);
    if (last < first || last - first > 50n)
      throw new RangeError('Use one to 51 integer inputs');
    xs = Array.from(
      { length: Number(last - first + 1n) },
      (_, i) => [first + BigInt(i), 1n] as Rational,
    );
  } else {
    xs = [lo, hi];
    if (compareR(m.vertex.x, lo) >= 0 && compareR(m.vertex.x, hi) <= 0)
      xs.push(m.vertex.x);
    xs = xs.filter((x, i) => !xs.slice(0, i).some((y) => sameR(x, y)));
  }
  const candidates = xs.map((x) => ({ x, y: parabolaAt(source, x) })),
    ordered = [...candidates].sort((a, b) => compareR(a.y, b.y)),
    minimum = ordered[0]!.y,
    maximum = ordered.at(-1)!.y;
  return {
    source,
    lo,
    hi,
    whole,
    vertex: m.vertex,
    candidates,
    minimum: {
      value: minimum,
      inputs: candidates.filter((p) => sameR(p.y, minimum)).map((p) => p.x),
    },
    maximum: {
      value: maximum,
      inputs: candidates.filter((p) => sameR(p.y, maximum)).map((p) => p.x),
    },
  };
}
export const formCases = ['x²-4x+3', '2x²-4x-6', '-x²+4x-4', 'x²+1', 'x²-2'];
export const intersectionCases = [
  { source: 'x²-4x+3', level: '0' },
  { source: 'x²-4x+3', level: '-1' },
  { source: 'x²-4x+3', level: '-2' },
  { source: 'x²', level: '2' },
  { source: '(x-8)(x-10)', level: '0' },
];
export const maximumCases = [
  {
    id: 'sign',
    source: 'x(10-x)',
    lower: '1',
    upper: '5',
    whole: false,
    xUnit: 'cm',
    yUnit: 'cm²',
    story: {
      zh: '虚构矩形标牌周长20 cm，宽x cm、长10−x cm，规定1≤x≤5。比较最大/最小面积及各自全部对应宽度。',
      en: 'A fictional rectangular sign has perimeter 20 cm, width x cm and length 10−x cm, with 1≤x≤5. Find its maximum and minimum areas and every corresponding width.',
    },
  },
  {
    id: 'limited',
    source: 'x(10-x)',
    lower: '1',
    upper: '4',
    whole: false,
    xUnit: 'cm',
    yUnit: 'cm²',
    story: {
      zh: '同一虚构标牌另限1≤x≤4 cm。全实数顶点宽5不可用，比较规定范围的最大/最小面积及对应宽度。',
      en: 'The same fictional sign now requires 1≤x≤4 cm. Its unrestricted vertex at five is unavailable. Find the constrained maximum and minimum areas and corresponding widths.',
    },
  },
  {
    id: 'cards',
    source: '-x²+5x+1',
    lower: '0',
    upper: '5',
    whole: true,
    xUnit: 'cards',
    yUnit: 'points',
    story: {
      zh: '虚构纸卡游戏选完整卡数x∈{0,1,2,3,4,5}，得分为−x²+5x+1。比较最高/最低分及所有对应卡数。',
      en: 'A fictional paper-card game allows whole-card counts x∈{0,1,2,3,4,5}, with score −x²+5x+1. Find the highest and lowest scores and every count attaining each.',
    },
  },
  {
    id: 'time',
    source: '-x²+6x+1',
    lower: '0',
    upper: '2',
    whole: false,
    xUnit: 'min',
    yUnit: 'units',
    story: {
      zh: '虚构信号−x²+6x+1只考察0≤x≤2 min。比较此期间最大/最小读数及达到时刻，不延伸到区间外。',
      en: 'A fictional signal −x²+6x+1 is examined only for 0≤x≤2 min. Find the maximum and minimum readings and their times within this interval.',
    },
  },
];
