import {
  rational,
  addR,
  mulR,
  negR,
  divR,
  textR,
  sameR,
  type Rational,
} from './algebraModels';
export type RationalOp = '+' | '−' | '×' | '÷';
export function readRational(raw: string): Rational {
  const s = raw
    .trim()
    .replace(/[−－]/g, '-')
    .replace(/＋/g, '+')
    .replace(/／/g, '/');
  if (s.length > 60) throw new RangeError('Use a bounded rational scalar');
  const fraction = s.match(/^([+-]?\d{1,12})\s*\/\s*([+-]?\d{1,12})$/);
  if (fraction) return rational(BigInt(fraction[1]!), BigInt(fraction[2]!));
  if (!/^[+-]?(?:\d{1,12}(?:\.\d{0,12})?|\.\d{1,12})$/.test(s))
    throw new RangeError('Use an integer, decimal or fraction');
  const [whole, dec = ''] = s.split('.');
  const sign = s.startsWith('-') ? -1n : 1n;
  return rational(
    sign * BigInt(((whole ?? '').replace(/^[+-]/, '') || '0') + dec),
    10n ** BigInt(dec.length),
  );
}
export const valueR = (s: string) => {
  const r = readRational(s);
  return Number(r[0]) / Number(r[1]);
};
export const absoluteR = (r: Rational) =>
  rational(r[0] < 0n ? -r[0] : r[0], r[1]);
export function rationalPair(a: string, b: string) {
  const x = readRational(a),
    y = readRational(b),
    delta = addR(y, negR(x));
  return {
    a: textR(x),
    b: textR(y),
    opposite: textR(negR(x)),
    absolute: textR(absoluteR(x)),
    delta: textR(delta),
    distance: textR(absoluteR(delta)),
    relation: delta[0] > 0n ? '<' : delta[0] < 0n ? '>' : '=',
    coincident: sameR(x, y),
  };
}
export function rationalOperation(a: string, b: string, op: RationalOp) {
  const x = readRational(a),
    y = readRational(b);
  if (!['+', '−', '×', '÷'].includes(op))
    throw new RangeError('Unknown operation');
  const result =
    op === '+'
      ? addR(x, y)
      : op === '−'
        ? addR(x, negR(y))
        : op === '×'
          ? mulR(x, y)
          : y[0] === 0n
            ? null
            : divR(x, y);
  let n = x[1],
    d = y[1];
  while (d) [n, d] = [d, n % d];
  const common = (x[1] / n) * y[1];
  return {
    a: textR(x),
    b: textR(y),
    op,
    result: result === null ? null : textR(result),
    opposite: textR(negR(y)),
    common: String(common),
    aParts: String(x[0] * (common / x[1])),
    bParts: String(y[0] * (common / y[1])),
    scale:
      op === '×'
        ? textR(y)
        : op === '÷' && y[0] !== 0n
          ? textR(divR([1n, 1n], y))
          : null,
  };
}
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
export function rationalLine(points: { value: string; label: string }[]) {
  if (!points.length || points.length > 5)
    throw new RangeError('One to five points');
  const parsed = points.map((p) => ({ ...p, r: readRational(p.value) }));
  if (
    parsed.some(
      (p) => Math.abs(Number(p.r[0]) / Number(p.r[1])) > 20 || p.r[1] > 24n,
    )
  )
    throw new RangeError('Outside the rational line display range');
  const grid = parsed.reduce(
    (s, p) => (s / gcd(s, Number(p.r[1]))) * Number(p.r[1]),
    1,
  );
  if (grid > 24)
    throw new RangeError('Display at most twenty-four subdivisions');
  const values = parsed.map((p) => Number(p.r[0]) / Number(p.r[1])),
    min = Math.min(-2, Math.floor(Math.min(...values))),
    max = Math.max(2, Math.ceil(Math.max(...values))),
    unit = 96;
  const x = (v: number) => 40 + (v - min) * unit;
  const groups = new Map<
    string,
    { value: string; labels: string[]; x: number }
  >();
  parsed.forEach((p) => {
    const key = textR(p.r),
      old = groups.get(key);
    if (old) old.labels.push(p.label);
    else
      groups.set(key, {
        value: key,
        labels: [p.label],
        x: x(Number(p.r[0]) / Number(p.r[1])),
      });
  });
  return {
    min,
    max,
    grid,
    unit,
    width: (max - min) * unit + 80,
    zero: x(0),
    points: [...groups.values()],
    ticks: Array.from({ length: (max - min) * grid + 1 }, (_, i) => ({
      x: 40 + (i * unit) / grid,
      whole: i % grid === 0,
      label: textR(rational(BigInt(min * grid + i), BigInt(grid))),
    })),
    x,
  };
}
export type RationalExpr =
  | { kind: 'number'; value: string }
  | { kind: 'neg'; value: RationalExpr }
  | { kind: 'abs'; value: RationalExpr }
  | { kind: 'power'; base: RationalExpr; exponent: 2 | 3 }
  | { kind: 'binary'; op: RationalOp; left: RationalExpr; right: RationalExpr };
export const N = (value: string): RationalExpr => ({ kind: 'number', value });
export const B = (
  op: RationalOp,
  left: RationalExpr,
  right: RationalExpr,
): RationalExpr => ({ kind: 'binary', op, left, right });
const operand = (e: RationalExpr) =>
  e.kind === 'number' && readRational(e.value)[0] < 0n
    ? `(${textR(readRational(e.value))})`
    : expressionText(e);
export function expressionText(e: RationalExpr): string {
  if (e.kind === 'number') return textR(readRational(e.value));
  if (e.kind === 'binary')
    return `(${operand(e.left)} ${e.op} ${operand(e.right)})`;
  if (e.kind === 'neg')
    return e.value.kind === 'power'
      ? `−${expressionText(e.value)}`
      : `−(${expressionText(e.value)})`;
  if (e.kind === 'abs') return `|${expressionText(e.value)}|`;
  return `${operand(e.base)}${e.exponent === 2 ? '²' : '³'}`;
}
type Reduction = {
  next: RationalExpr;
  calculation: string;
  rule: '+' | '−' | '×' | '÷' | 'neg' | 'abs' | 'power';
  undefined?: true;
};
function reduceOne(e: RationalExpr): Reduction | null {
  if (e.kind === 'number') {
    readRational(e.value);
    return null;
  }
  if (e.kind === 'binary') {
    const l = reduceOne(e.left);
    if (l) return { ...l, next: { ...e, left: l.next } };
    const r = reduceOne(e.right);
    if (r) return { ...r, next: { ...e, right: r.next } };
    const result = rationalOperation(
      expressionText(e.left),
      expressionText(e.right),
      e.op,
    ).result;
    return {
      next: result === null ? e : N(result),
      calculation: expressionText(e),
      rule: e.op,
      ...(result === null ? { undefined: true as const } : {}),
    };
  }
  const child = e.kind === 'power' ? e.base : e.value,
    step = reduceOne(child);
  if (step)
    return {
      ...step,
      next:
        e.kind === 'power'
          ? { ...e, base: step.next }
          : { ...e, value: step.next },
    };
  const r = readRational(expressionText(child));
  if (e.kind === 'power' && ![2, 3].includes(e.exponent))
    throw new RangeError('Use powers two or three');
  const result =
    e.kind === 'neg'
      ? negR(r)
      : e.kind === 'abs'
        ? absoluteR(r)
        : rational(r[0] ** BigInt(e.exponent), r[1] ** BigInt(e.exponent));
  return {
    next: N(textR(result)),
    calculation: expressionText(e),
    rule: e.kind,
  };
}
export function expressionTrace(e: RationalExpr) {
  const count = (node: RationalExpr): number =>
    node.kind === 'number'
      ? 1
      : node.kind === 'binary'
        ? 1 + count(node.left) + count(node.right)
        : 1 + count(node.kind === 'power' ? node.base : node.value);
  if (count(e) > 60) throw new RangeError('At most sixty expression nodes');
  let current = e;
  const rows: {
    before: string;
    after: string;
    calculation: string;
    rule: Reduction['rule'];
    undefined: boolean;
  }[] = [];
  for (let i = 0; i < 60; i++) {
    const step = reduceOne(current);
    if (!step)
      return {
        initial: expressionText(e),
        result: expressionText(current),
        rows,
      };
    rows.push({
      before: expressionText(current),
      after: step.undefined ? 'undefined' : expressionText(step.next),
      calculation: step.calculation,
      rule: step.rule,
      undefined: !!step.undefined,
    });
    if (step.undefined)
      return { initial: expressionText(e), result: null, rows };
    current = step.next;
  }
  throw new RangeError('Expression did not terminate');
}
export type MixedFamily = 'fractions' | 'association' | 'powers' | 'zero';
export function mixedExpression(
  family: MixedFamily,
  a: number,
  brackets: boolean,
): RationalExpr {
  if (!Number.isSafeInteger(a) || a < 2 || a > 6)
    throw new RangeError('Parameter two to six');
  if (family === 'fractions')
    return B('×', B('+', N(`${-a - 1}/4`), N('1/2')), N('-2/3'));
  if (family === 'association')
    return brackets
      ? B('÷', N(String(-3 * a)), B('×', N('2'), N('-3')))
      : B('×', B('÷', N(String(-3 * a)), N('2')), N('-3'));
  if (family === 'powers')
    return brackets
      ? { kind: 'power', base: N(String(-a)), exponent: 2 }
      : {
          kind: 'neg',
          value: { kind: 'power', base: N(String(a)), exponent: 2 },
        };
  if (family === 'zero')
    return B('÷', N('1'), B('−', N(String(a)), N(String(a))));
  throw new RangeError('Unknown mixed-operation family');
}
