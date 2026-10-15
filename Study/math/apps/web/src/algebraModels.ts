// Exact rational coefficients, rather than testing expressions at a few values.
export type Rational = readonly [bigint, bigint];
export type Affine = { a: Rational; b: Rational };
export function rational(n: bigint, d = 1n): Rational {
  if (!d) throw new RangeError('A denominator cannot be zero');
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  let a = n < 0n ? -n : n,
    b = d;
  while (b) [a, b] = [b, a % b];
  return [n / a, d / a];
}
export const addR = (x: Rational, y: Rational) =>
  rational(x[0] * y[1] + y[0] * x[1], x[1] * y[1]);
export const mulR = (x: Rational, y: Rational) =>
  rational(x[0] * y[0], x[1] * y[1]);
export const negR = (x: Rational) => rational(-x[0], x[1]);
export const divR = (x: Rational, y: Rational) =>
  rational(x[0] * y[1], x[1] * y[0]);
export const sameR = (x: Rational, y: Rational) => x[0] * y[1] === y[0] * x[1];
export const textR = (x: Rational) =>
  x[1] === 1n ? String(x[0]) : `${x[0]}/${x[1]}`;
const zero: Rational = [0n, 1n],
  one: Rational = [1n, 1n];
const constant = (b: Rational): Affine => ({ a: zero, b });
const plus = (x: Affine, y: Affine): Affine => ({
  a: addR(x.a, y.a),
  b: addR(x.b, y.b),
});
const scale = (x: Affine, k: Rational): Affine => ({
  a: mulR(x.a, k),
  b: mulR(x.b, k),
});
/** One variable, sums, brackets, products by constants, division by nonzero constants.
 * Implicit multiplication: 3n, 3(n+2), (n+2)3; adjacent numbers are invalid.
 */
export function parseAffine(raw: string, variable = 'n'): Affine | null {
  if (!/^[a-z]$/.test(variable) || raw.length > 180) return null;
  const source = raw
    .replace(/[−－]/g, '-')
    .replace(/＋/g, '+')
    .replace(/[×·]/g, '*')
    .replace(/[÷／]/g, '/')
    .replace(/（/g, '(')
    .replace(/）/g, ')');
  const tokens = source.match(/\d+(?:\.\d*)?|\.\d+|[a-z]|[()+*/-]/g) ?? [];
  if (
    !tokens.length ||
    tokens.length > 100 ||
    tokens.join('') !== source.replace(/\s/g, '')
  )
    return null;
  let p = 0;
  const number = (s: string) => {
    const [whole, decimal = ''] = s.split('.');
    return rational(
      BigInt((whole || '0') + decimal),
      10n ** BigInt(decimal.length),
    );
  };
  const atom = (): Affine => {
    const token = tokens[p++];
    if (token === '+' || token === '-')
      return scale(atom(), token === '-' ? [-1n, 1n] : one);
    if (token === '(') {
      const result = sum();
      if (tokens[p++] !== ')') throw new Error('Unclosed bracket');
      return result;
    }
    if (token === variable) return { a: one, b: zero };
    if (token && /^(?:\d+(?:\.\d*)?|\.\d+)$/.test(token))
      return constant(number(token));
    throw new Error('Expected a number, the named letter or brackets');
  };
  const product = (): Affine => {
    let x = atom();
    while (p < tokens.length) {
      let op = tokens[p];
      const implicit =
        op === '(' ||
        op === variable ||
        (!!op &&
          /^[\d.]/.test(op) &&
          (tokens[p - 1] === ')' || tokens[p - 1] === variable));
      if (op !== '*' && op !== '/' && !implicit) break;
      if (!implicit) p++;
      else op = '*';
      const y = atom();
      if (op === '/') {
        if (y.a[0] !== 0n || !y.b[0])
          throw new Error('Divide only by a nonzero constant');
        x = scale(x, divR(one, y.b));
      } else {
        if (x.a[0] && y.a[0]) throw new Error('Use a linear expression');
        x = x.a[0] ? scale(x, y.b) : scale(y, x.b);
      }
    }
    return x;
  };
  const sum = (): Affine => {
    let x = product();
    while (tokens[p] === '+' || tokens[p] === '-') {
      const op = tokens[p++],
        y = product();
      x = plus(x, op === '-' ? scale(y, [-1n, 1n]) : y);
    }
    return x;
  };
  try {
    const result = sum();
    return p === tokens.length ? result : null;
  } catch {
    return null;
  }
}
export function equivalentExpression(
  input: string,
  expected: string,
  variable = 'n',
) {
  const a = parseAffine(input, variable),
    b = parseAffine(expected, variable);
  return !!a && !!b && sameR(a.a, b.a) && sameR(a.b, b.b);
}
export function evaluateAffine(expression: Affine, value: Rational) {
  return addR(mulR(expression.a, value), expression.b);
}
export function affineText(e: Affine, variable = 'x') {
  if (!e.a[0]) return textR(e.b);
  const term = sameR(e.a, one)
    ? variable
    : sameR(e.a, [-1n, 1n])
      ? `−${variable}`
      : `(${textR(e.a)})${variable}`;
  return !e.b[0]
    ? term
    : `${term} ${e.b[0] < 0n ? '−' : '+'} ${textR(e.b[0] < 0n ? negR(e.b) : e.b)}`;
}
export type AlgebraEquation = { left: Affine; right: Affine };
export function algebraEquation(left: string, right: string): AlgebraEquation {
  const l = parseAffine(left, 'x'),
    r = parseAffine(right, 'x');
  if (!l || !r) throw new RangeError('Use valid linear sides');
  return { left: l, right: r };
}
export function solveAlgebra(e: AlgebraEquation) {
  const a = addR(e.left.a, negR(e.right.a)),
    b = addR(e.right.b, negR(e.left.b));
  return !a[0]
    ? { kind: b[0] ? ('none' as const) : ('all' as const) }
    : { kind: 'one' as const, value: divR(b, a) };
}
export function transformEquation(
  e: AlgebraEquation,
  operation: '+' | '−' | '×' | '÷',
  amount: Rational,
  side: 'both' | 'left' = 'both',
): AlgebraEquation {
  if (
    !['+', '−', '×', '÷'].includes(operation) ||
    !['both', 'left'].includes(side)
  )
    throw new RangeError('Choose an operation and side');
  if ((operation === '×' || operation === '÷') && !amount[0])
    throw new RangeError('Zero is not an invertible factor');
  const change = (x: Affine) =>
    operation === '+'
      ? plus(x, constant(amount))
      : operation === '−'
        ? plus(x, constant(negR(amount)))
        : scale(x, operation === '×' ? amount : divR(one, amount));
  return {
    left: change(e.left),
    right: side === 'both' ? change(e.right) : e.right,
  };
}
export function sameSolutions(a: AlgebraEquation, b: AlgebraEquation) {
  const x = solveAlgebra(a),
    y = solveAlgebra(b);
  return (
    x.kind === y.kind &&
    (x.kind !== 'one' || (y.kind === 'one' && sameR(x.value, y.value)))
  );
}
export function growingRows(n: number) {
  if (!Number.isSafeInteger(n) || n < 1 || n > 10000)
    throw new RangeError('Use a positive whole-number stage');
  return { n, rows: 3, fixed: 2, total: 3 * n + 2 };
}
