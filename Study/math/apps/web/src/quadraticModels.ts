import {
  rational,
  addR,
  negR,
  mulR,
  divR,
  sameR,
  type Rational,
} from './algebraModels';
import {
  parsePolynomial,
  plusP,
  scaleP,
  polynomialText,
  type Polynomial,
} from './polynomialModels';
import {
  readRadical,
  radicalText,
  principalRadical,
  addRadicals,
  multiplyRadicals,
  sameRadical,
  type RadicalValue,
} from './radicalModels';
export type QuadraticKind =
  'quadratic' | 'linear' | 'identity' | 'contradiction' | 'higher';
const Z: Rational = [0n, 1n];
const abs = (n: bigint) => (n < 0n ? -n : n),
  gcd = (a: bigint, b: bigint): bigint => (b ? gcd(b, a % b) : abs(a)),
  lcm = (a: bigint, b: bigint) => (a / gcd(a, b)) * b;
export const numericQ = (r: Rational) => Number(r[0]) / Number(r[1]);
export function parseQuadraticEquation(raw: string) {
  try {
    if (raw.length > 300) return null;
    const sides = raw.trim().replace(/＝/g, '=').split('=');
    if (sides.length !== 2 || sides.some((s) => !s.trim())) return null;
    const left = parsePolynomial(sides[0]!, ['x']),
      right = parsePolynomial(sides[1]!, ['x']);
    if (!left || !right) return null;
    const p = plusP(left, scaleP(right, [-1n, 1n])),
      degree = Math.max(0, ...[...p.keys()].map((k) => k.length)),
      a = p.get('xx') ?? Z,
      b = p.get('x') ?? Z,
      c = p.get('') ?? Z;
    if (
      [...p.values()].some(
        (v) => !Number.isFinite(numericQ(v)) || Math.abs(numericQ(v)) > 1000,
      )
    )
      return null;
    const kind: QuadraticKind =
      degree > 2
        ? 'higher'
        : a[0]
          ? 'quadratic'
          : b[0]
            ? 'linear'
            : c[0]
              ? 'contradiction'
              : 'identity';
    return { left, right, p, degree, a, b, c, kind };
  } catch {
    return null;
  }
}
const sameP = (a: Polynomial, b: Polynomial) =>
  a.size === b.size &&
  [...a].every(([k, v]) => !!b.get(k) && sameR(v, b.get(k)!));
export function checkQuadraticEquation(
  input: string,
  expected: string,
  model = true,
) {
  const a = parseQuadraticEquation(input),
    b = parseQuadraticEquation(expected);
  if (!a || !b) return false;
  if (model)
    return (
      (sameP(a.left, b.left) && sameP(a.right, b.right)) ||
      (sameP(a.left, b.right) && sameP(a.right, b.left))
    );
  return sameQuadraticSolutions(input, expected);
}
const asRadical = (r: Rational): RadicalValue =>
  r[0] ? new Map([[1n, r]]) : new Map();
export function solveQuadratic(raw: string) {
  const m = parseQuadraticEquation(raw);
  if (!m) throw new RangeError('Use a bounded univariate polynomial equation');
  if (m.kind === 'higher')
    return { ...m, discriminant: null, roots: null, repeated: false };
  if (m.kind === 'identity')
    return { ...m, discriminant: null, roots: null, repeated: false };
  if (m.kind === 'contradiction')
    return {
      ...m,
      discriminant: null,
      roots: [] as RadicalValue[],
      repeated: false,
    };
  if (m.kind === 'linear')
    return {
      ...m,
      discriminant: null,
      roots: [asRadical(divR(negR(m.c), m.b))],
      repeated: false,
    };
  const discriminant = addR(
    mulR(m.b, m.b),
    negR(mulR([4n, 1n], mulR(m.a, m.c))),
  );
  if (discriminant[0] < 0n)
    return { ...m, discriminant, roots: [] as RadicalValue[], repeated: false };
  // Clear denominators and their common factor before taking a root. This
  // preserves the equation and keeps the bounded radical engine's integers small.
  const den = [m.a, m.b, m.c].reduce((d, r) => lcm(d, r[1]), 1n),
    ints = [m.a, m.b, m.c].map((r) => r[0] * (den / r[1])),
    g = ints.reduce((v, n) => gcd(v, n), 0n),
    [a, b, c] = ints.map((n) => n / g) as [bigint, bigint, bigint];
  if ([a, b, c].some((n) => abs(n) > 300n))
    throw new RangeError('Bounded primitive quadratic coefficients');
  const d = b * b - 4n * a * c,
    centre = rational(-b, 2n * a),
    part = multiplyRadicals(
      principalRadical([d, 1n]),
      asRadical(rational(1n, 2n * a)),
    ),
    base = asRadical(centre),
    roots =
      d === 0n
        ? [base]
        : [addRadicals(base, part, true), addRadicals(base, part)];
  return { ...m, discriminant, roots, repeated: d === 0n };
}
export function sameQuadraticSolutions(a: string, b: string) {
  try {
    const x = solveQuadratic(a),
      y = solveQuadratic(b);
    if (x.kind === 'higher' || y.kind === 'higher') return false;
    if (x.kind === 'identity' || y.kind === 'identity')
      return x.kind === y.kind;
    return (
      x.roots!.length === y.roots!.length &&
      x.roots!.every((r) => y.roots!.some((s) => sameRadical(r, s)))
    );
  } catch {
    return false;
  }
}
export function readRadicalSet(raw: string): RadicalValue[] | null {
  if (raw.length > 400) return null;
  let s = raw.trim().replace(/[−－]/g, '-');
  if (
    /^(?:无实数解|无实数根|没有实数解|无可行解|没有可行解|no feasible solutions?|no real solutions?|no real roots|none|∅|\{\})$/i.test(
      s,
    )
  )
    return [];
  if (s.startsWith('{') && s.endsWith('}')) s = s.slice(1, -1).trim();
  else if (/[{}]/.test(s)) return null;
  const pm = s.match(/±|\+\/-/g);
  let pieces: string[];
  if (pm) {
    if (pm.length !== 1 || /[,，、;；]/.test(s)) return null;
    pieces = [s.replace(/±|\+\/-/, '+'), s.replace(/±|\+\/-/, '-')];
  } else pieces = s.split(/[,，、;；]/).map((p) => p.trim());
  if (!pieces.length || pieces.length > 2 || pieces.some((p) => !p))
    return null;
  const values = pieces.map((p) => readRadical(p.replace(/^x\s*=/i, '')));
  if (values.some((v) => v === null)) return null;
  const unique = (values as RadicalValue[]).filter(
    (v, i) => !values.slice(0, i).some((p) => sameRadical(v, p!)),
  );
  return !pm && unique.length !== values.length ? null : unique;
}
export function checkRadicalSet(raw: string, expected: string[]) {
  const actual = readRadicalSet(raw),
    wanted = expected.map(readRadical);
  return (
    !!actual &&
    !wanted.some((v) => v === null) &&
    wanted.every(
      (v, i) => !wanted.slice(0, i).some((p) => sameRadical(v!, p!)),
    ) &&
    actual.length === wanted.length &&
    actual.every((v) => wanted.some((w) => sameRadical(v, w!)))
  );
}
const aliases: Record<QuadraticKind, string[]> = {
  quadratic: ['quadratic', '一元二次方程', '二次方程'],
  linear: ['linear', '一元一次方程', '一次方程'],
  identity: ['identity', '恒等式', '恒等方程'],
  contradiction: ['contradiction', '矛盾', '矛盾方程'],
  higher: ['higher', '高次方程', '高于二次'],
};
export function checkQuadraticKind(raw: string, wanted: QuadraticKind) {
  return aliases[wanted].includes(raw.trim().toLowerCase());
}
export function evaluatePolynomialRadical(p: Polynomial, value: RadicalValue) {
  let sum: RadicalValue = new Map();
  for (const [key, coefficient] of p) {
    let term = asRadical(coefficient);
    for (let i = 0; i < key.length; i++) term = multiplyRadicals(term, value);
    sum = addRadicals(sum, term);
  }
  return sum;
}
/** Exact sign for the one/two-term radical values used by quadratic roots. */
export function radicalSign(v: RadicalValue): number {
  const terms = [...v];
  if (!terms.length) return 0;
  if (terms.length > 2)
    throw new RangeError('At most two canonical terms for domain checks');
  if (terms.length === 1) return terms[0]![1][0] > 0n ? 1 : -1;
  const positive = terms.filter(([, r]) => r[0] > 0n),
    negative = terms.filter(([, r]) => r[0] < 0n);
  if (!positive.length) return -1;
  if (!negative.length) return 1;
  const [pk, p] = positive[0]!,
    [nk, n] = negative[0]!,
    delta = addR(mulR(mulR(p, p), [pk, 1n]), negR(mulR(mulR(n, n), [nk, 1n])));
  return delta[0] > 0n ? 1 : delta[0] < 0n ? -1 : 0;
}
export type QuadraticDomain = 'real' | 'positive' | 'whole' | 'first-two';
export function inQuadraticDomain(v: RadicalValue, domain: QuadraticDomain) {
  if (domain === 'real') return true;
  const sign = radicalSign(v);
  if (domain === 'positive') return sign > 0;
  if (domain === 'whole')
    return (
      sign >= 0 &&
      (!v.size || (v.size === 1 && v.has(1n) && v.get(1n)![1] === 1n))
    );
  return (
    sign >= 0 && radicalSign(addRadicals(v, asRadical([2n, 1n]), true)) <= 0
  );
}
export function quadraticCandidateAudit(
  source: string,
  raw: string,
  domain: QuadraticDomain = 'real',
) {
  const m = parseQuadraticEquation(source),
    value = readRadical(raw);
  if (!m || !value) return null;
  try {
    const left = evaluatePolynomialRadical(m.left, value),
      right = evaluatePolynomialRadical(m.right, value),
      equationPass = sameRadical(left, right),
      contextPass = inQuadraticDomain(value, domain);
    return {
      value: radicalText(value),
      left: radicalText(left),
      right: radicalText(right),
      equationPass,
      contextPass,
      accepted: equationPass && contextPass,
    };
  } catch {
    return null;
  }
}
export function completingSquare(source: string) {
  const m = solveQuadratic(source);
  if (m.kind !== 'quadratic')
    throw new RangeError('A nonzero quadratic coefficient is required');
  const p = divR(m.b, mulR([2n, 1n], m.a)),
    added = mulR(p, p),
    rhs = divR(negR(m.c), m.a),
    completed = addR(rhs, added);
  return { ...m, p, added, rhs, completed };
}
export function zeroPolynomialText(source: string) {
  const m = parseQuadraticEquation(source);
  if (!m) throw new RangeError('Valid polynomial equation');
  return polynomialText(m.p);
}
export const meaningCases = [
  'x²-5x+6=0',
  'x²-4=0',
  '(x-2)²=0',
  'x²+1=0',
  'x²+x=x²+3',
  'x²=x²',
  'x²+1=x²',
];
export const factoringCases = [
  { source: 'x²-5x+6=0', factor: '(x-2)(x-3)' },
  { source: 'x²-3x=0', factor: 'x(x-3)' },
  { source: '(x-2)²=0', factor: '(x-2)²' },
  { source: '2x²+x-1=0', factor: '(2x-1)(x+1)' },
  { source: 'x(x-3)=4', factor: '(x-4)(x+1)' },
];
export const completingCases = ['x²+6x=7', 'x²+3x=1', 'x²-4x=1', 'x²+4x=-5'];
export const applicationCases = [
  {
    id: 'rectangle',
    source: 'x(x+3)=40',
    domain: 'positive' as const,
    story: {
      zh: '虚构矩形宽 x m、长 x+3 m，面积40 m²。用两种原数量写等式，宽须为正。',
      en: 'A fictional rectangle has width x m, length x+3 m and area 40 m². Model the original quantities; width must be positive.',
    },
  },
  {
    id: 'cards',
    source: '2x²=5',
    domain: 'whole' as const,
    story: {
      zh: '五张完整纸卡要排成两个相同的 x×x 正方阵；x 是每边卡数，须非负整数。能否按要求安排？',
      en: 'Five whole cards must form two identical x×x square arrays. x counts cards along an edge and must be a nonnegative integer. Is the arrangement possible?',
    },
  },
  {
    id: 'time',
    source: 'x²-6x+5=0',
    domain: 'first-two' as const,
    story: {
      zh: '虚构设备的信号为 x²−6x+5，只考察开始后0≤x≤2 min。求这段时间内信号为零的时刻。',
      en: 'A fictional device signal is x²−6x+5, examined only during 0≤x≤2 min. Find its zero times within this period.',
    },
  },
  {
    id: 'small',
    source: 'x(x+1)=2',
    domain: 'positive' as const,
    story: {
      zh: '虚构矩形宽 x cm、长 x+1 cm、面积2 cm²。先列原面积关系，再核正长度。',
      en: 'A fictional rectangle has width x cm, length x+1 cm and area 2 cm². Model its original area relation, then check positive lengths.',
    },
  },
];
export const feasibleQuadraticRoots = (
  source: string,
  domain: QuadraticDomain,
) => {
  const s = solveQuadratic(source);
  if (!s.roots) throw new RangeError('A finite root set is required');
  return s.roots.filter((r) => inQuadraticDomain(r, domain)).map(radicalText);
};
