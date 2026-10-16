import {
  rational,
  addR,
  mulR,
  divR,
  sameR,
  textR,
  type Rational,
} from './algebraModels';
import { readRational } from './rationalModels';
// A monomial key repeats its sorted letters: xxy represents x²y; '' is constant.
export type Polynomial = Map<string, Rational>;
const ONE: Rational = [1n, 1n];
const constant = (r: Rational): Polynomial =>
  r[0] === 0n ? new Map() : new Map([['', r]]);
function bounded(p: Polynomial) {
  if (
    p.size > 24 ||
    [...p].some(
      ([key, c]) => key.length > 4 || c.some((n) => n.toString().length > 160),
    )
  )
    throw new RangeError('Polynomial display bounds exceeded');
  return p;
}
export function plusP(a: Polynomial, b: Polynomial): Polynomial {
  const result = new Map(a);
  for (const [key, c] of b) {
    const sum = addR(result.get(key) ?? [0n, 1n], c);
    if (sum[0]) result.set(key, sum);
    else result.delete(key);
  }
  return bounded(result);
}
export const scaleP = (p: Polynomial, k: Rational): Polynomial =>
  bounded(
    new Map(
      [...p]
        .map(([key, c]) => [key, mulR(c, k)] as const)
        .filter(([, c]) => c[0] !== 0n),
    ),
  );
export function timesP(a: Polynomial, b: Polynomial): Polynomial {
  let result: Polynomial = new Map();
  for (const [ka, ca] of a)
    for (const [kb, cb] of b) {
      const key = [...ka, ...kb].sort().join('');
      if (key.length > 4) throw new RangeError('At most degree four');
      result = plusP(result, new Map([[key, mulR(ca, cb)]]));
    }
  return bounded(result);
}
type Surface = { p: Polynomial; parts: Polynomial[]; ready: boolean };
const surface = (p: Polynomial): Surface => ({ p, parts: [p], ready: true });
function inspectPolynomial(
  raw: string,
  variables: readonly string[] = ['x'],
): Surface | null {
  if (
    !variables.length ||
    variables.length > 2 ||
    new Set(variables).size !== variables.length ||
    variables.some((v) => !/^[a-z]$/.test(v)) ||
    raw.length > 240
  )
    return null;
  const source = raw
    .replace(/[−－]/g, '-')
    .replace(/＋/g, '+')
    .replace(/[×·]/g, '*')
    .replace(/[÷／]/g, '/')
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    .replace(/[²³⁴]/g, (s) => `^${s === '²' ? 2 : s === '³' ? 3 : 4}`);
  const tokens = source.match(/\d+(?:\.\d*)?|\.\d+|[a-z]|[()+*/^-]/g) ?? [];
  if (
    !tokens.length ||
    tokens.length > 160 ||
    tokens.join('') !== source.replace(/\s/g, '')
  )
    return null;
  let cursor = 0;
  const atom = (): Surface => {
    const token = tokens[cursor++];
    if (token === '(') {
      const p = sum();
      if (tokens[cursor++] !== ')') throw Error('Unclosed bracket');
      return p;
    }
    if (token && variables.includes(token))
      return surface(new Map([[token, ONE]]));
    if (token && /^(?:\d+(?:\.\d*)?|\.\d+)$/.test(token))
      return surface(constant(readRational(token)));
    throw Error('A number, an allowed letter or brackets is required');
  };
  const power = (): Surface => {
    let base = atom();
    if (tokens[cursor] === '^') {
      cursor++;
      const exponent = tokens[cursor++];
      if (!exponent || !/^[1-4]$/.test(exponent))
        throw Error('Use positive integer powers one to four');
      let result = constant(ONE);
      for (let k = 0; k < Number(exponent); k++)
        result = timesP(result, base.p);
      base = {
        ...surface(result),
        ready: base.ready && base.parts.length === 1 && result.size <= 1,
      };
    }
    return base;
  };
  const unary = (): Surface => {
    if (tokens[cursor] === '+' || tokens[cursor] === '-') {
      const minus = tokens[cursor++] === '-',
        child = unary(),
        factor: Rational = minus ? [-1n, 1n] : ONE;
      return {
        p: scaleP(child.p, factor),
        parts: child.parts.map((p) => scaleP(p, factor)),
        ready: child.ready && (!minus || child.parts.length === 1),
      };
    }
    return power();
  };
  const product = (): Surface => {
    let left = unary();
    while (cursor < tokens.length) {
      const next = tokens[cursor],
        implicit =
          next === '(' ||
          (!!next && variables.includes(next)) ||
          (tokens[cursor - 1] === ')' && !!next && /^[\d.]/.test(next));
      if (next !== '*' && next !== '/' && !implicit) break;
      const op = implicit ? '*' : tokens[cursor++],
        right = unary();
      let result: Polynomial;
      if (op === '/') {
        if (right.p.size > 1 || (right.p.size === 1 && !right.p.has('')))
          throw Error('Divide only by a constant');
        const denominator = right.p.get('') ?? [0n, 1n];
        if (!denominator[0]) throw Error('Zero divisor');
        result = scaleP(left.p, divR(ONE, denominator));
      } else result = timesP(left.p, right.p);
      left = {
        ...surface(result),
        ready:
          left.ready &&
          right.ready &&
          left.parts.length === 1 &&
          right.parts.length === 1 &&
          result.size <= 1,
      };
    }
    return left;
  };
  const sum = (): Surface => {
    let left = product();
    while (tokens[cursor] === '+' || tokens[cursor] === '-') {
      const minus = tokens[cursor++] === '-',
        right = product(),
        factor: Rational = minus ? [-1n, 1n] : ONE;
      left = {
        p: plusP(left.p, scaleP(right.p, factor)),
        parts: [...left.parts, ...right.parts.map((p) => scaleP(p, factor))],
        ready:
          left.ready && right.ready && (!minus || right.parts.length === 1),
      };
    }
    return left;
  };
  try {
    const parsed = sum();
    return cursor === tokens.length
      ? { ...parsed, p: bounded(parsed.p) }
      : null;
  } catch {
    return null;
  }
}
export const parsePolynomial = (
  raw: string,
  variables: readonly string[] = ['x'],
): Polynomial | null => inspectPolynomial(raw, variables)?.p ?? null;
export function isCollectedPolynomial(
  raw: string,
  variables: readonly string[] = ['x'],
) {
  const parsed = inspectPolynomial(raw, variables);
  if (!parsed || !parsed.ready) return false;
  const seen = new Set<string>();
  for (const p of parsed.parts) {
    if (p.size === 0) {
      if (parsed.parts.length !== 1 || /[a-z]/.test(raw)) return false;
      continue;
    }
    if (p.size !== 1) return false;
    const key = p.keys().next().value!;
    if (seen.has(key)) return false;
    seen.add(key);
  }
  return true;
}
export function equalPolynomial(
  a: string,
  b: string,
  variables: readonly string[] = ['x'],
) {
  const x = parsePolynomial(a, variables),
    y = parsePolynomial(b, variables);
  return (
    !!x &&
    !!y &&
    x.size === y.size &&
    [...x].every(([key, c]) => y.has(key) && sameR(c, y.get(key)!))
  );
}
// Optional final-product form for multiplication lessons. Existing collection tasks
// retain their original grammar; this only rejects pending products in the new tasks.
export function isFinishedPolynomialProduct(
  raw: string,
  variables: readonly string[] = ['x'],
) {
  if (!isCollectedPolynomial(raw, variables)) return false;
  let s = raw
    .replace(/\s/g, '')
    .replace(/[−－]/g, '-')
    .replace(/＋/g, '+')
    .replace(/[×·]/g, '*')
    .replace(/[÷／]/g, '/')
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    .replace(/[²³⁴]/g, (c) => `^${c === '²' ? 2 : c === '³' ? 3 : 4}`);
  const wraps = (source: string) => {
    if (!source.startsWith('(') || !source.endsWith(')')) return false;
    let depth = 0;
    for (let i = 0; i < source.length; i++) {
      if (source[i] === '(') depth++;
      if (source[i] === ')') depth--;
      if (depth === 0 && i < source.length - 1) return false;
    }
    return depth === 0;
  };
  while (wraps(s)) s = s.slice(1, -1);
  const parts: string[] = [];
  let start = 0,
    depth = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') depth++;
    if (s[i] === ')') depth--;
    if (i > start && depth === 0 && (s[i] === '+' || s[i] === '-')) {
      parts.push(s.slice(start, i));
      start = i;
    }
  }
  parts.push(s.slice(start));
  const number = '(?:\\d+(?:\\.\\d*)?|\\.\\d+)',
    coefficient = `(?:${number}(?:/${number})?|\\([+-]?${number}(?:/${number})?\\))`;
  const constant = new RegExp(`^${coefficient}$`),
    monomial = new RegExp(
      `^(?:${coefficient}\\*?)?([a-z](?:\\^[1-4])?(?:\\*?[a-z](?:\\^[1-4])?)*)(?:/${number})?$`,
    );
  return parts.every((part) => {
    const body = part.replace(/^[+-]/, '');
    if (constant.test(body)) return true;
    const match = monomial.exec(body);
    if (!match) return false;
    const letters = match[1]!.match(/[a-z]/g)!;
    return new Set(letters).size === letters.length;
  });
}
export function monomialText(key: string) {
  return [...new Set(key)]
    .map((v) => {
      const exponent = [...key].filter((c) => c === v).length;
      return exponent === 1 ? v : `${v}^${exponent}`;
    })
    .join('');
}
export function polynomialText(p: Polynomial) {
  const terms = [...p].sort(
    ([a], [b]) => b.length - a.length || a.localeCompare(b),
  );
  if (!terms.length) return '0';
  return terms
    .map(([key, c], i) => {
      const negative = c[0] < 0n,
        abs = rational(negative ? -c[0] : c[0], c[1]),
        coefficient = textR(abs),
        body = key
          ? `${sameR(abs, ONE) ? '' : coefficient.includes('/') ? `(${coefficient})` : coefficient}${monomialText(key)}`
          : coefficient;
      return `${i ? (negative ? ' - ' : ' + ') : negative ? '-' : ''}${body}`;
    })
    .join('');
}
export function polynomialValue(
  raw: string,
  variables: readonly string[],
  values: Record<string, string>,
): string | null {
  const p = parsePolynomial(raw, variables);
  if (!p) return null;
  try {
    let result: Rational = [0n, 1n];
    for (const [key, c] of p) {
      let term = c;
      for (const letter of key) {
        if (values[letter] === undefined) return null;
        term = mulR(term, readRational(values[letter]!));
      }
      result = addR(result, term);
    }
    return textR(result);
  } catch {
    return null;
  }
}
export function substitutionText(
  raw: string,
  variables: readonly string[],
  values: Record<string, string>,
) {
  if (!parsePolynomial(raw, variables))
    throw new RangeError('Invalid expression');
  return raw.replace(/[a-z]/g, (v) => {
    if (values[v] === undefined) throw new RangeError('Missing assignment');
    return `(${textR(readRational(values[v]!))})`;
  });
}
export type TermCard = { id: string; coefficient: number; key: string };
export function termBuckets(cards: TermCard[]) {
  if (
    cards.length > 16 ||
    new Set(cards.map((c) => c.id)).size !== cards.length ||
    cards.some(
      (c) =>
        !Number.isSafeInteger(c.coefficient) ||
        Math.abs(c.coefficient) > 12 ||
        !/^[xy]{0,4}$/.test(c.key),
    )
  )
    throw new RangeError('Invalid symbolic cards');
  const groups = new Map<
    string,
    { key: string; coefficient: number; cards: TermCard[] }
  >();
  for (const c of cards) {
    const key = [...c.key].sort().join(''),
      old = groups.get(key) ?? { key, coefficient: 0, cards: [] };
    old.coefficient += c.coefficient;
    old.cards.push(c);
    groups.set(key, old);
  }
  const result: Polynomial = new Map(
    [...groups.values()]
      .filter((g) => g.coefficient !== 0)
      .map((g) => [g.key, rational(BigInt(g.coefficient))]),
  );
  return { groups: [...groups.values()], result: polynomialText(result) };
}
export function distribution(k: number, a: number, b: number) {
  if ([k, a, b].some((n) => !Number.isSafeInteger(n) || Math.abs(n) > 6))
    throw new RangeError('Bounded integer coefficients');
  const original = `${k}(${a}x+(${b}))`,
    p = parsePolynomial(original)!;
  return {
    original,
    terms: [
      { original: `${a}x`, coefficient: k * a, key: 'x' },
      { original: String(b), coefficient: k * b, key: '' },
    ],
    result: polynomialText(p),
  };
}
export function expressionPair(a: string, b: string, subtract: boolean) {
  const first = parsePolynomial(a),
    second = parsePolynomial(b);
  if (!first || !second) throw new RangeError('Invalid polynomial pair');
  const signed = scaleP(second, subtract ? [-1n, 1n] : ONE);
  return {
    original: `(${a})${subtract ? '−' : '+'}(${b})`,
    first: polynomialText(first),
    second: polynomialText(second),
    signedSecond: polynomialText(signed),
    result: polynomialText(plusP(first, signed)),
  };
}
export type StoryKind = 'tickets' | 'perimeter' | 'area';
export function storyModel(kind: StoryKind, n: number, fare = 4, fixed = 6) {
  if (
    !Number.isSafeInteger(n) ||
    n < 1 ||
    n > 12 ||
    ![fare, fixed].every((v) => Number.isSafeInteger(v) && v >= 0 && v <= 12)
  )
    throw new RangeError('Invalid fictional story parameters');
  if (!['tickets', 'perimeter', 'area'].includes(kind))
    throw new RangeError('Unknown story');
  const expression =
    kind === 'tickets'
      ? `${fare}n+${fixed}`
      : kind === 'perimeter'
        ? '2((n+2)+n)'
        : 'n(n+2)';
  return {
    expression,
    simplified: polynomialText(parsePolynomial(expression, ['n'])!),
    value: polynomialValue(expression, ['n'], { n: String(n) })!,
    unit:
      kind === 'tickets'
        ? ('NZD' as const)
        : kind === 'perimeter'
          ? ('cm' as const)
          : ('cm²' as const),
  };
}
