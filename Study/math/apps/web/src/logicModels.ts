import { readRational } from './rationalModels';
import { addR, negR, divR, textR, type Rational } from './algebraModels';
import {
  compareR,
  interval,
  intervalContains,
  parseRealSet,
  realSetText,
  relationHolds,
  type RealInterval,
  type InequalitySign,
} from './inequalityModels';

/** Finite sets of rational numbers, not multisets or nested sets. */
export function finiteSet(raw: string): string[] | null {
  if (raw.length > 400) return null;
  let s = raw.trim().replace(/，|、|；/g, ',');
  if (/^(?:∅|empty|空集|\{\s*\})$/i.test(s)) return [];
  if (s.startsWith('{') && s.endsWith('}')) s = s.slice(1, -1).trim();
  const parts = s.split(/[,;]/);
  if (!s || parts.length > 30 || parts.some((p) => !p.trim())) return null;
  try {
    return [...new Set(parts.map((p) => textR(readRational(p.trim()))))].sort(
      (a, b) => compareR(readRational(a), readRational(b)),
    );
  } catch {
    return null;
  }
}
export const setText = (a: string[]) => `{${a.join(',')}}`;
export function checkFiniteSet(input: string, expected: string) {
  const a = finiteSet(input),
    b = finiteSet(expected);
  return !!a && !!b && a.join('|') === b.join('|');
}
export const subset = (a: string[], b: string[]) =>
  a.every((x) => b.includes(x));
export type SetOperation =
  'intersection' | 'union' | 'complement' | 'difference';
export function operateSets(
  u: string[],
  a: string[],
  b: string[],
  op: SetOperation,
) {
  if (
    !subset(a, u) ||
    !subset(b, u) ||
    !['intersection', 'union', 'complement', 'difference'].includes(op)
  )
    throw new RangeError('Invalid finite universe or operation');
  return u.filter((x) =>
    op === 'intersection'
      ? a.includes(x) && b.includes(x)
      : op === 'union'
        ? a.includes(x) || b.includes(x)
        : op === 'complement'
          ? !a.includes(x)
          : a.includes(x) && !b.includes(x),
  );
}
export type LogicCode =
  | 'in'
  | 'out'
  | 'subset'
  | 'not-subset'
  | 'true'
  | 'false'
  | 'not-statement'
  | 'sufficient-only'
  | 'necessary-only'
  | 'both'
  | 'neither';
const aliases: Record<LogicCode, string[]> = {
  in: ['in', '∈', '属于'],
  out: ['out', '∉', '不属于'],
  subset: ['subset', '⊆', '包含于', '是子集'],
  'not-subset': ['not-subset', '⊈', '不是子集'],
  true: ['true', '真', '真命题'],
  false: ['false', '假', '假命题'],
  'not-statement': ['not-statement', '不是命题', '非命题'],
  'sufficient-only': ['sufficient-only', '充分不必要'],
  'necessary-only': ['necessary-only', '必要不充分'],
  both: ['both', '充要', '充分必要'],
  neither: ['neither', '既不充分也不必要'],
};
export function checkLogicCode(input: string, wanted: LogicCode) {
  return aliases[wanted].includes(input.trim().toLowerCase());
}
export function conditionClass(p: string[], q: string[]): LogicCode {
  const forward = subset(p, q),
    backward = subset(q, p);
  return forward
    ? backward
      ? 'both'
      : 'sufficient-only'
    : backward
      ? 'necessary-only'
      : 'neither';
}
export const conditionCases = [
  {
    p: ['2'],
    q: ['-2', '2'],
    zh: '实数x：P为x=2；Q为x²=4',
    en: 'Real x: P is x=2; Q is x²=4',
  },
  {
    p: ['-2', '2'],
    q: ['2'],
    zh: '实数x：P为x²=4；Q为x=2',
    en: 'Real x: P is x²=4; Q is x=2',
  },
  {
    p: ['-2', '2'],
    q: ['-2', '2'],
    zh: '实数x：P为|x|=2；Q为x²=4',
    en: 'Real x: P is |x|=2; Q is x²=4',
  },
  {
    p: ['1', '2'],
    q: ['2', '3'],
    zh: '实数x：P为x∈{1,2}；Q为x∈{2,3}',
    en: 'Real x: P is x∈{1,2}; Q is x∈{2,3}',
  },
  {
    p: [],
    q: ['0'],
    zh: '实数x：P为x²=−1；Q为x=0',
    en: 'Real x: P is x²=−1; Q is x=0',
  },
];
export function counterexample(raw: string, integers: boolean) {
  try {
    const x = readRational(raw);
    const square: Rational = [x[0] * x[0], x[1] * x[1]];
    const admissible = !integers || x[1] === 1n;
    return {
      admissible,
      refutes: admissible && compareR(square, x) < 0,
      x: textR(x),
      square: textR(square),
    };
  } catch {
    return null;
  }
}
export type RealUnion = RealInterval[];
/** Canonical disjoint intervals, merging overlap and included touching endpoints. */
export function normalUnion(parts: RealUnion): RealUnion {
  const sorted = parts
    .filter(
      (p): p is Extract<RealInterval, { kind: 'interval' }> =>
        p.kind === 'interval',
    )
    .sort((a, b) => {
      const low = !a.low
        ? !b.low
          ? 0
          : -1
        : !b.low
          ? 1
          : compareR(a.low, b.low);
      // Closed starts must precede open starts at the same value: a point
      // added last can otherwise bridge an earlier gap after it was emitted.
      return low || Number(b.lowClosed) - Number(a.lowClosed);
    });
  const out: Extract<RealInterval, { kind: 'interval' }>[] = [];
  for (const p of sorted) {
    const last = out.at(-1);
    if (!last) {
      out.push({ ...p });
      continue;
    }
    const c = last.high && p.low ? compareR(last.high, p.low) : 1;
    if (c < 0 || (c === 0 && !last.highClosed && !p.lowClosed)) {
      out.push({ ...p });
      continue;
    }
    if (last.low && p.low && compareR(last.low, p.low) === 0)
      last.lowClosed ||= p.lowClosed;
    if (!last.high || !p.high) {
      last.high = null;
      last.highClosed = false;
    } else {
      const h = compareR(p.high, last.high);
      if (h > 0) {
        last.high = p.high;
        last.highClosed = p.highClosed;
      } else if (h === 0) last.highClosed ||= p.highClosed;
    }
  }
  return out;
}
export function parseRealUnion(raw: string): RealUnion | null {
  if (raw.length > 1200) return null;
  const parts = raw.trim().split(/\s*(?:∪|\bunion\b|\bor\b|或)\s*/i);
  if (parts.length > 4 || parts.some((p) => !p)) return null;
  const intervals = parts.map(parseRealSet);
  return intervals.some((p) => !p) ? null : normalUnion(intervals as RealUnion);
}
export const unionText = (s: RealUnion) =>
  s.length ? s.map(realSetText).join(' ∪ ') : '∅';
export function checkRealUnion(input: string, expected: string) {
  const a = parseRealUnion(input),
    b = parseRealUnion(expected);
  return !!a && !!b && unionText(a) === unionText(b);
}
export const unionContains = (s: RealUnion, x: Rational) =>
  s.some((p) => intervalContains(p, x));
/** Exact preimage of |ax+b| op c; floats are never used to decide endpoints. */
export function absoluteSolution(
  aRaw: string,
  bRaw: string,
  cRaw: string,
  sign: Exclude<InequalitySign, '='>,
): RealUnion {
  if (!['<', '<=', '>', '>='].includes(sign))
    throw new RangeError('Invalid sign');
  const a = readRational(aRaw),
    b = readRational(bRaw),
    c = readRational(cRaw),
    zero: Rational = [0n, 1n];
  if (!a[0]) {
    const abs: Rational = [b[0] < 0n ? -b[0] : b[0], b[1]];
    return relationHolds(abs, sign, c) ? [interval(null, null)] : [];
  }
  const inner = sign === '<' || sign === '<=',
    closed = sign === '<=' || sign === '>=';
  if (compareR(c, zero) < 0) return inner ? [] : [interval(null, null)];
  const target = inner
    ? [interval(negR(c), c, closed, closed)]
    : [
        interval(null, negR(c), false, closed),
        interval(c, null, closed, false),
      ];
  const pre = (x: Rational | null) => (x ? divR(addR(x, negR(b)), a) : null);
  return normalUnion(
    target.map((p) =>
      p.kind === 'empty'
        ? p
        : a[0] > 0n
          ? interval(pre(p.low), pre(p.high), p.lowClosed, p.highClosed)
          : interval(pre(p.high), pre(p.low), p.highClosed, p.lowClosed),
    ),
  );
}
