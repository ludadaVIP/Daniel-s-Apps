import {
  rational,
  addR,
  negR,
  mulR,
  divR,
  sameR,
  textR,
  parseAffine,
  evaluateAffine,
  affineText,
  solveAlgebra,
  sameSolutions,
  type Rational,
  type AlgebraEquation,
  type Affine,
} from './algebraModels';
import { readRational } from './rationalModels';
export type LinearSource = { left: string; right: string };
export function parseLinearEquation(raw: string): AlgebraEquation | null {
  const sides = raw.trim().replace(/＝/g, '=').split('=');
  if (sides.length !== 2 || sides.some((s) => !s.trim())) return null;
  const left = parseAffine(sides[0]!.trim(), 'x'),
    right = parseAffine(sides[1]!.trim(), 'x');
  return left && right ? { left, right } : null;
}
export const sourceText = (s: LinearSource) => `${s.left} = ${s.right}`;
export function linearSource(s: LinearSource) {
  const e = parseLinearEquation(sourceText(s));
  if (!e) throw new RangeError('Use two valid affine sides');
  return e;
}
export const linearText = (e: AlgebraEquation) =>
  `${affineText(e.left)} = ${affineText(e.right)}`;
const sameAffine = (a: Affine, b: Affine) => sameR(a.a, b.a) && sameR(a.b, b.b);
export const sameSides = (a: AlgebraEquation, b: AlgebraEquation) =>
  (sameAffine(a.left, b.left) && sameAffine(a.right, b.right)) ||
  (sameAffine(a.left, b.right) && sameAffine(a.right, b.left));
export function checkLinearEquation(
  input: string,
  expected: string,
  model = true,
) {
  const a = parseLinearEquation(input),
    b = parseLinearEquation(expected);
  return !!a && !!b && (model ? sameSides(a, b) : sameSolutions(a, b));
}
export function checkSolutionClass(raw: string, kind: 'none' | 'all') {
  const s = raw.trim().toLowerCase().replace(/\s+/g, ' ');
  return (
    kind === 'none'
      ? [
          'none',
          'no solution',
          'no solutions',
          'no allowed solution',
          'no allowed solutions',
          '无解',
          '没有解',
          '无符合条件的解',
          '∅',
          '{}',
        ]
      : [
          'all',
          'all rational numbers',
          'any rational number',
          '任意有理数',
          '所有有理数',
          '全部有理数',
        ]
  ).includes(s);
}
export type ContextRule = 'rational' | 'nonnegative' | 'positive' | 'integer';
export const allowedInContext = (value: Rational, rule: ContextRule) =>
  rule === 'rational' ||
  (rule === 'nonnegative' && value[0] >= 0n) ||
  (rule === 'positive' && value[0] > 0n) ||
  (rule === 'integer' && value[0] >= 0n && value[1] === 1n);
export function candidateAudit(
  source: LinearSource,
  raw: string,
  rule: ContextRule = 'rational',
) {
  const e = linearSource(source);
  let value: Rational;
  try {
    value = readRational(raw);
  } catch {
    return null;
  }
  const left = evaluateAffine(e.left, value),
    right = evaluateAffine(e.right, value);
  return {
    value: textR(value),
    left: textR(left),
    right: textR(right),
    equationPass: sameR(left, right),
    contextPass: allowedInContext(value, rule),
    accepted: sameR(left, right) && allowedInContext(value, rule),
  };
}
export function contextSolution(source: LinearSource, rule: ContextRule) {
  const result = solveAlgebra(linearSource(source));
  return result.kind === 'one' && !allowedInContext(result.value, rule)
    ? { kind: 'none' as const }
    : result;
}
const addAffine = (a: Affine, b: Affine): Affine => ({
  a: addR(a.a, b.a),
  b: addR(a.b, b.b),
});
const scaleAffine = (a: Affine, k: Rational): Affine => ({
  a: mulR(a.a, k),
  b: mulR(a.b, k),
});
export type LinearOperation = '+' | '−' | '×' | '÷';
export function linearTransform(
  e: AlgebraEquation,
  op: LinearOperation,
  raw: string,
  side: 'both' | 'left',
) {
  if (!['+', '−', '×', '÷'].includes(op) || !['both', 'left'].includes(side))
    throw new RangeError('Choose an operation and side');
  const amount = parseAffine(raw, 'x');
  if (!amount)
    return {
      next: null,
      preserves: false,
      safeRule: false,
      reason: 'invalid' as const,
    };
  if ((op === '×' || op === '÷') && amount.a[0] !== 0n)
    return {
      next: null,
      preserves: false,
      safeRule: false,
      reason: 'variable-factor' as const,
    };
  if (op === '÷' && amount.b[0] === 0n)
    return {
      next: null,
      preserves: false,
      safeRule: false,
      reason: 'zero-divisor' as const,
    };
  const change = (s: Affine) =>
    op === '+'
      ? addAffine(s, amount)
      : op === '−'
        ? addAffine(s, scaleAffine(amount, [-1n, 1n]))
        : scaleAffine(s, op === '×' ? amount.b : divR([1n, 1n], amount.b));
  const next = {
      left: change(e.left),
      right: side === 'both' ? change(e.right) : e.right,
    },
    zeroFactor = op === '×' && amount.b[0] === 0n;
  return {
    next,
    preserves: sameSolutions(e, next),
    safeRule: side === 'both' && !zeroFactor,
    reason: zeroFactor
      ? ('zero-factor' as const)
      : side === 'left'
        ? ('one-sided' as const)
        : ('reversible' as const),
  };
}
export type LinearStep = {
  text: string;
  equation: AlgebraEquation;
  reason:
    | 'collect'
    | 'gather-x'
    | 'gather-constants'
    | 'divide'
    | 'multiply-lcd'
    | 'distribute-lcd';
};
export function linearTrace(source: LinearSource) {
  const original = linearSource(source),
    steps: LinearStep[] = [];
  let current = original,
    previous = sourceText(source);
  const push = (equation: AlgebraEquation, reason: LinearStep['reason']) => {
    const text = linearText(equation);
    if (text !== previous) {
      steps.push({ text, equation, reason });
      previous = text;
    }
    current = equation;
  };
  push(current, 'collect');
  const moveX = scaleAffine({ a: current.right.a, b: [0n, 1n] }, [-1n, 1n]);
  push(
    {
      left: addAffine(current.left, moveX),
      right: addAffine(current.right, moveX),
    },
    'gather-x',
  );
  const moveConstant: Affine = { a: [0n, 1n], b: negR(current.left.b) };
  push(
    {
      left: addAffine(current.left, moveConstant),
      right: addAffine(current.right, moveConstant),
    },
    'gather-constants',
  );
  const solution = solveAlgebra(original);
  if (current.left.a[0] !== 0n) {
    const factor = divR([1n, 1n], current.left.a);
    push(
      {
        left: scaleAffine(current.left, factor),
        right: scaleAffine(current.right, factor),
      },
      'divide',
    );
  }
  return { original, steps, solution };
}
export const bracketCases = [
  { id: 'both', left: '2(x-3)', right: 'x+1' },
  { id: 'negative', left: '-3(x-2)', right: '2x+1' },
  { id: 'two-brackets', left: '3(x+2)', right: '2(x-1)+5' },
  { id: 'all', left: '2(x+1)', right: '2x+2' },
  { id: 'none', left: '2(x+1)', right: '2x+3' },
] as const;
export const fractionCases = [
  {
    id: 'two-fractions',
    left: '(x-1)/2-(x+2)/3',
    right: '1/6',
    denominators: [2, 3, 6],
    cleared: { left: '3(x-1)-2(x+2)', right: '1' },
  },
  {
    id: 'both-sides',
    left: '(x+1)/3',
    right: 'x/2-1',
    denominators: [3, 2, 1],
    cleared: { left: '2(x+1)', right: '3x-6' },
  },
  {
    id: 'quarters',
    left: '3x/4+1/2',
    right: 'x/2-1/4',
    denominators: [4, 2, 2, 4],
    cleared: { left: '3x+2', right: '2x-1' },
  },
  {
    id: 'fraction-solution',
    left: 'x/3',
    right: '1/6',
    denominators: [3, 6],
    cleared: { left: '2x', right: '1' },
  },
];
export function fractionTrace(index: number) {
  if (!Number.isInteger(index) || index < 0 || index >= fractionCases.length)
    throw new RangeError('Choose a fraction case');
  const s = fractionCases[index]!,
    gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a),
    lcd = s.denominators.reduce((a, b) => (a / gcd(a, b)) * b, 1),
    factor = rational(BigInt(lcd)),
    base = linearSource(s),
    multiplied = {
      left: scaleAffine(base.left, factor),
      right: scaleAffine(base.right, factor),
    },
    cleared = linearSource(s.cleared);
  if (
    !sameAffine(multiplied.left, cleared.left) ||
    !sameAffine(multiplied.right, cleared.right)
  )
    throw new RangeError(
      'Authored denominator-clearing step must match both original sides',
    );
  const trace = linearTrace(s.cleared),
    steps: LinearStep[] = [
      {
        text: `${lcd}(${s.left}) = ${lcd}(${s.right})`,
        equation: multiplied,
        reason: 'multiply-lcd',
      },
      {
        text: sourceText(s.cleared),
        equation: cleared,
        reason: 'distribute-lcd',
      },
      ...trace.steps,
    ];
  return { source: s, lcd, steps, solution: solveAlgebra(base) };
}
export type WordKind = 'ages' | 'groups';
export function wordEquation(kind: WordKind, a: number, total: number) {
  if (
    !['ages', 'groups'].includes(kind) ||
    !Number.isSafeInteger(a) ||
    a < 2 ||
    a > 12 ||
    !Number.isSafeInteger(total) ||
    total < 0 ||
    total > 40
  )
    throw new RangeError('Bounded fictional word model');
  const source =
      kind === 'ages'
        ? { left: `x+(x+${a})`, right: String(total) }
        : { left: `${a}x+2`, right: String(total) },
    rule: ContextRule = kind === 'ages' ? 'nonnegative' : 'integer',
    algebra = solveAlgebra(linearSource(source));
  return {
    source,
    rule,
    algebra,
    context: contextSolution(source, rule),
    older:
      kind === 'ages' && algebra.kind === 'one'
        ? textR(addR(algebra.value, rational(BigInt(a))))
        : null,
  };
}
export const contextCases = [
  { id: 'people', left: '3x', right: '8', rule: 'integer' as const },
  { id: 'price', left: '2x+5', right: '3', rule: 'nonnegative' as const },
  { id: 'length', left: '3x', right: '1', rule: 'positive' as const },
  { id: 'temperature', left: 'x+5', right: '2', rule: 'rational' as const },
  { id: 'zero-count', left: '4x', right: '0', rule: 'integer' as const },
];
