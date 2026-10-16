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
import { integerRoot } from './pythagoreanModels';
export type RadicalValue = Map<bigint, Rational>;
type Node =
  | { kind: 'number'; raw: string }
  | { kind: 'root'; arg: Node }
  | { kind: 'negative'; arg: Node }
  | { kind: 'binary'; op: '+' | '-' | '*' | '/'; left: Node; right: Node };
const zero = () => new Map<bigint, Rational>(),
  one = (r: Rational): RadicalValue => (r[0] ? new Map([[1n, r]]) : zero());
const gcd = (a: bigint, b: bigint): bigint => (b ? gcd(b, a % b) : a);
function put(m: RadicalValue, key: bigint, r: Rational) {
  const next = addR(m.get(key) ?? [0n, 1n], r);
  if (
    key > 10n ** 12n ||
    next[0].toString().length > 100 ||
    next[1].toString().length > 100 ||
    m.size > 16
  )
    throw new RangeError('Bounded radical expression');
  if (next[0]) m.set(key, next);
  else m.delete(key);
}
export function addRadicals(
  a: RadicalValue,
  b: RadicalValue,
  subtract = false,
) {
  const out = new Map(a);
  for (const [k, v] of b) put(out, k, subtract ? negR(v) : v);
  return out;
}
export function multiplyRadicals(a: RadicalValue, b: RadicalValue) {
  const out = zero();
  for (const [ka, va] of a)
    for (const [kb, vb] of b) {
      const g = gcd(ka, kb);
      put(out, (ka / g) * (kb / g), mulR(mulR(va, vb), [g, 1n]));
    }
  return out;
}
export function invertRadical(a: RadicalValue): RadicalValue {
  const entries = [...a];
  if (!entries.length) throw new RangeError('Nonzero denominator');
  if (entries.length === 1) {
    const [k, c] = entries[0]!;
    return new Map([[k, divR([1n, 1n], mulR(c, [k, 1n]))]]);
  }
  if (entries.length !== 2)
    throw new RangeError('At most two terms in a denominator');
  const [[ka, va], [kb, vb]] = entries as [
      [bigint, Rational],
      [bigint, Rational],
    ],
    norm = addR(
      mulR(mulR(va, va), [ka, 1n]),
      negR(mulR(mulR(vb, vb), [kb, 1n])),
    );
  if (!norm[0]) throw new RangeError('Nonzero conjugate norm');
  return new Map([
    [ka, divR(va, norm)],
    [kb, divR(negR(vb), norm)],
  ]);
}
export function squareFactor(n: bigint) {
  if (n < 0n || n > 1000000n)
    throw new RangeError('Nonnegative bounded radicand');
  let outside = 1n,
    inside = 1n,
    rest = n;
  if (!n) return { outside: 0n, inside: 1n };
  for (let p = 2n; p * p <= rest; p++) {
    let count = 0;
    while (rest % p === 0n) {
      rest /= p;
      count++;
    }
    outside *= p ** BigInt(Math.floor(count / 2));
    if (count % 2) inside *= p;
  }
  if (rest > 1n) inside *= rest;
  return { outside, inside };
}
export function principalRadical(r: Rational): RadicalValue {
  r = rational(r[0], r[1]);
  if (r[0] < 0n)
    throw new RangeError('Real roots require a nonnegative radicand');
  if (!r[0]) return zero();
  const p = squareFactor(r[0]),
    q = squareFactor(r[1]);
  return new Map([
    [p.inside * q.inside, rational(p.outside, q.outside * q.inside)],
  ]);
}
function parseTree(raw: string): Node {
  if (raw.length > 240) throw new RangeError('Bounded expression');
  const s = raw
    .trim()
    .replace(/[−－]/g, '-')
    .replace(/[×·]/g, '*')
    .replace(/[÷／]/g, '/')
    .replace(/（/g, '(')
    .replace(/）/g, ')');
  const tokens: string[] = [];
  let at = 0;
  while (at < s.length) {
    if (/\s/.test(s[at]!)) {
      at++;
      continue;
    }
    const m = s.slice(at).match(/^(?:sqrt|√|\d+(?:\.\d*)?|\.\d+|[()+\-*/])/i);
    if (!m) throw new RangeError('Use numerical radical arithmetic');
    tokens.push(m[0].toLowerCase());
    at += m[0].length;
  }
  if (!tokens.length || tokens.length > 100)
    throw new RangeError('Bounded tokens');
  let index = 0,
    depth = 0;
  const peek = () => tokens[index];
  function atom(): Node {
    if (++depth > 16) throw new RangeError('Bounded nesting');
    let out: Node;
    const t = tokens[index++];
    if (t === '+' || t === '-') {
      const arg = atom();
      out = t === '-' ? { kind: 'negative', arg } : arg;
    } else if (t === '(') {
      out = sum();
      if (tokens[index++] !== ')') throw new RangeError('Close parentheses');
    } else if (t === 'sqrt' || t === '√') {
      if (t === 'sqrt' && peek() !== '(')
        throw new RangeError('sqrt requires parentheses');
      out = { kind: 'root', arg: atom() };
    } else if (t && /^(?:\d|\.)/.test(t)) out = { kind: 'number', raw: t };
    else throw new RangeError('Expected a number');
    depth--;
    return out;
  }
  function product(): Node {
    let a = atom();
    while (true) {
      const t = peek(),
        implicit = t === '(' || t === '√' || t === 'sqrt';
      if (t !== '*' && t !== '/' && !implicit) break;
      const op = t === '/' ? '/' : '*';
      if (!implicit) index++;
      a = { kind: 'binary', op, left: a, right: atom() };
    }
    return a;
  }
  function sum(): Node {
    let a = product();
    while (peek() === '+' || peek() === '-') {
      const op = tokens[index++] as '+' | '-';
      a = { kind: 'binary', op, left: a, right: product() };
    }
    return a;
  }
  const tree = sum();
  if (index !== tokens.length) throw new RangeError('Complete expression only');
  return tree;
}
function evaluate(n: Node): RadicalValue {
  if (n.kind === 'number') return one(readRational(n.raw));
  if (n.kind === 'negative')
    return new Map([...evaluate(n.arg)].map(([k, v]) => [k, negR(v)]));
  if (n.kind === 'root') {
    const r = evaluate(n.arg);
    if (r.size > 1 || (r.size === 1 && !r.has(1n)))
      throw new RangeError('No nested irrational roots');
    return principalRadical(r.get(1n) ?? [0n, 1n]);
  }
  const a = evaluate(n.left),
    b = evaluate(n.right);
  return n.op === '+'
    ? addRadicals(a, b)
    : n.op === '-'
      ? addRadicals(a, b, true)
      : n.op === '*'
        ? multiplyRadicals(a, b)
        : multiplyRadicals(a, invertRadical(b));
}
export function readRadical(raw: string): RadicalValue | null {
  try {
    return evaluate(parseTree(raw));
  } catch {
    return null;
  }
}
export const sameRadical = (a: RadicalValue, b: RadicalValue) =>
  a.size === b.size &&
  [...a].every(([k, v]) => !!b.get(k) && sameR(v, b.get(k)!));
export function radicalText(a: RadicalValue) {
  if (!a.size) return '0';
  return [...a]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([k, r], i) => {
      const sign = r[0] < 0n ? '-' : i ? '+' : '',
        abs = rational(r[0] < 0n ? -r[0] : r[0], r[1]);
      if (k === 1n) return sign + textR(abs);
      return `${sign}${abs[0] === 1n ? '' : String(abs[0])}√${k}${abs[1] === 1n ? '' : `/${abs[1]}`}`;
    })
    .join('');
}
function literal(n: Node): Rational | null {
  try {
    if (n.kind === 'number') return readRational(n.raw);
    if (n.kind === 'negative') {
      const r = literal(n.arg);
      return r ? negR(r) : null;
    }
    if (
      n.kind === 'binary' &&
      n.op === '/' &&
      n.left.kind !== 'binary' &&
      n.right.kind !== 'binary'
    ) {
      const a = literal(n.left),
        b = literal(n.right);
      return a && b && b[0] ? divR(a, b) : null;
    }
  } catch {
    return null;
  }
  return null;
}
function monomial(n: Node): { base: bigint; coefficient: Rational } | null {
  const r = literal(n);
  if (r) return { base: 1n, coefficient: r };
  if (n.kind === 'negative') {
    const m = monomial(n.arg);
    return m ? { ...m, coefficient: negR(m.coefficient) } : null;
  }
  if (n.kind === 'root') {
    const r = literal(n.arg);
    if (!r || r[1] !== 1n || r[0] <= 1n) return null;
    const f = squareFactor(r[0]);
    return f.outside === 1n ? { base: r[0], coefficient: [1n, 1n] } : null;
  }
  if (n.kind === 'binary' && n.op === '*') {
    const l = literal(n.left),
      r = literal(n.right),
      a = monomial(n.left),
      b = monomial(n.right);
    if (l && b && b.base !== 1n && sameR(b.coefficient, [1n, 1n]))
      return { ...b, coefficient: l };
    if (r && a && a.base !== 1n && sameR(a.coefficient, [1n, 1n]))
      return { ...a, coefficient: r };
  }
  if (n.kind === 'binary' && n.op === '/') {
    const a = monomial(n.left),
      b = literal(n.right);
    if (a && b && b[0]) return { ...a, coefficient: divR(a.coefficient, b) };
  }
  return null;
}
export function isSimplifiedRadical(raw: string) {
  try {
    const tree = parseTree(raw),
      terms: Node[] = [];
    function collect(n: Node) {
      if (n.kind === 'binary' && (n.op === '+' || n.op === '-')) {
        collect(n.left);
        collect(n.right);
      } else terms.push(n);
    }
    collect(tree);
    const bases = new Set<bigint>();
    for (const t of terms) {
      const m = monomial(t);
      if (
        !m ||
        bases.has(m.base) ||
        (!m.coefficient[0] && (terms.length > 1 || m.base !== 1n))
      )
        return false;
      bases.add(m.base);
    }
    return true;
  } catch {
    return false;
  }
}
export function checkRadical(
  raw: string,
  expected: string,
  simplified = false,
) {
  const a = readRadical(raw),
    b = readRadical(expected);
  return (
    !!a && !!b && sameRadical(a, b) && (!simplified || isSimplifiedRadical(raw))
  );
}
export function squareRoots(raw: string): string[] {
  const r = readRational(raw);
  if (r[0] < 0n) return [];
  const p = principalRadical(r);
  if (!p.size) return ['0'];
  return [
    radicalText(new Map([...p].map(([k, v]) => [k, negR(v)]))),
    radicalText(p),
  ];
}
export function checkRootSet(raw: string, radicand: string) {
  if (raw.length > 240) return false;
  let s = raw.trim().replace(/[−－]/g, '-');
  const wanted = squareRoots(radicand);
  if (/^(?:无实数根|没有实数根|no real roots|none|∅|\{\})$/i.test(s))
    return wanted.length === 0;
  if (s.startsWith('{') && s.endsWith('}')) s = s.slice(1, -1).trim();
  else if (/[{}]/.test(s)) return false;
  const pm = s.match(/^(?:±|\+\/-)\s*(.+)$/);
  let entries = pm
    ? [pm[1]!, `-(${pm[1]})`]
    : s.split(/[,，、;；]/).map((v) => v.trim());
  if (pm && checkRadical(pm[1]!, '0')) entries = ['0'];
  const parsed = entries.map(readRadical);
  if (
    !entries.length ||
    parsed.some((v) => v === null) ||
    parsed.some((v, i) => parsed.slice(0, i).some((p) => sameRadical(v!, p!)))
  )
    return false;
  return (
    parsed.length === wanted.length &&
    parsed.every((v) => wanted.some((w) => sameRadical(v!, readRadical(w)!)))
  );
}
export type RealClass = 'rational' | 'irrational' | 'not-real';
const classAliases: Record<RealClass, string[]> = {
  rational: ['rational', '有理数'],
  irrational: ['irrational', '无理数'],
  'not-real': ['not-real', 'not real', '非实数', '不是实数', '无实数值'],
};
export function checkRealClass(raw: string, wanted: RealClass) {
  return classAliases[wanted].includes(raw.trim().toLowerCase());
}
export function radicalClass(raw: string): RealClass {
  try {
    const v = evaluate(parseTree(raw));
    return [...v.keys()].some((k) => k !== 1n) ? 'irrational' : 'rational';
  } catch (e) {
    if (
      e instanceof RangeError &&
      e.message === 'Real roots require a nonnegative radicand'
    )
      return 'not-real';
    throw e;
  }
}
export function rootBracket(raw: string, places: number) {
  const r = readRational(raw);
  if (
    r[0] < 0n ||
    r[0] > 1000000n * r[1] ||
    !Number.isInteger(places) ||
    places < 0 ||
    places > 4
  )
    throw new RangeError('Bounded nonnegative root and precision');
  const scale = 10n ** BigInt(places),
    k = integerRoot((r[0] * scale * scale) / r[1]),
    exact = k * k * r[1] === r[0] * scale * scale,
    lower = rational(k, scale),
    upper = rational(exact ? k : k + 1n, scale),
    midpoint = rational(2n * k + 1n, 2n * scale),
    roundUp = 4n * r[0] * scale * scale >= r[1] * (2n * k + 1n) ** 2n,
    rounded = exact ? k : roundUp ? k + 1n : k;
  return {
    radicand: r,
    places,
    scale,
    k,
    lower,
    upper,
    exact,
    midpoint,
    rounded: fixedDecimal(rounded, places),
  };
}
export function fixedDecimal(n: bigint, places: number) {
  const scale = 10n ** BigInt(places),
    whole = n / scale,
    part = (n % scale).toString().padStart(places, '0');
  return `${whole}${places ? '.' + part : ''}`;
}
export function checkRoundedRoot(
  raw: string,
  radicand: string,
  places: number,
) {
  const s = raw.trim(),
    pattern =
      places === 0 ? /^\+?\d+$/ : new RegExp(`^\\+?\\d+\\.\\d{${places}}$`);
  try {
    return (
      pattern.test(s) &&
      sameR(
        readRational(s),
        readRational(rootBracket(radicand, places).rounded),
      )
    );
  } catch {
    return false;
  }
}
export const rootCases = ['9', '0', '2', '1/4', '-4'];
export const realCases = [
  { display: '√2', expression: '√2' },
  { display: '√9', expression: '√9' },
  { display: '−√2', expression: '-√2' },
  { display: '1/3 = 0.(3)', expression: '1/3' },
  { display: '1.414213562', expression: '1.414213562' },
  { display: '√(−2)', expression: 'sqrt(-2)' },
];
export const simplifyCases = [
  '12',
  '18',
  '45',
  '72',
  '98',
  '8/9',
  '3/8',
  '0',
  '1',
];
export const operationCases = [
  { source: '√8+√18', steps: ['√8=2√2; √18=3√2', '2√2+3√2=5√2'] },
  { source: '√12-√27', steps: ['√12=2√3; √27=3√3', '2√3-3√3=-√3'] },
  { source: '√3*√12', steps: ['3≥0; 12≥0', '√(3×12)=√36=6'] },
  { source: '√18/√2', steps: ['18≥0; 2>0', '√(18/2)=√9=3'] },
  { source: '1/√2', steps: ['√2≠0', '1/√2=√2/2'] },
  { source: '1/(√3+√2)', steps: ['(√3+√2)(√3-√2)=3-2=1', '1/(√3+√2)=√3-√2'] },
  {
    source: '√2+√3',
    steps: [
      '2 and 3 are distinct square-free radicands',
      '√2+√3 does not combine to √5',
    ],
  },
  {
    source: 'sqrt(-1)*sqrt(-1)',
    steps: [
      'Negative radicands have no real square root',
      'Do not combine them using the nonnegative-radicand product rule',
    ],
  },
  { source: '√2/√0', steps: ['√0=0', 'Division by zero is undefined'] },
];
export const estimateCases = [
  '2',
  '3',
  '5',
  '10',
  '50',
  '999/1000',
  '25/16',
  '0',
];
