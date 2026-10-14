import { exactRational } from './model';
import { boundedWhole } from './measurementModels';
export type Rational = [bigint, bigint];
export type EarlyEquation = {
  kind: 'add' | 'subtract' | 'subtract-from' | 'multiply' | 'divide';
  a: string;
  b: string;
  reversed?: boolean;
};
const gcd = (a: bigint, b: bigint): bigint =>
  b === 0n ? (a < 0n ? -a : a) : gcd(b, a % b);
function normal(n: bigint, d: bigint): Rational {
  if (d === 0n) throw new RangeError('A denominator cannot be zero');
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d);
  return [n / g, d / g];
}
export function equationQuantity(raw: string): Rational {
  if (raw.includes('%'))
    throw new RangeError('Use a number or fraction, not a percentage');
  const v = exactRational(raw);
  if (!v) throw new RangeError('Use an exact numeric quantity');
  const [n, d] = normal(...v);
  // Candidates must include every solution derived from the bounded constants:
  // products/quotients can reach 10^8 and reduced denominators can reach 10^12.
  if (d > 1000000000000n || n > 100000000n * d || n < -100000000n * d)
    throw new RangeError('Use bounded exact quantities');
  return [n, d];
}
export const rationalText = ([n, d]: Rational) =>
  d === 1n ? String(n) : `${n}/${d}`;
export const plus = (a: Rational, b: Rational): Rational =>
  normal(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
export const minus = (a: Rational, b: Rational): Rational =>
  plus(a, [-b[0], b[1]]);
export const times = (a: Rational, b: Rational): Rational =>
  normal(a[0] * b[0], a[1] * b[1]);
export const divide = (a: Rational, b: Rational): Rational =>
  normal(a[0] * b[1], a[1] * b[0]);
function parameters(eq: EarlyEquation) {
  if (
    !['add', 'subtract', 'subtract-from', 'multiply', 'divide'].includes(
      eq.kind,
    )
  )
    throw new RangeError('Choose a supported early equation');
  const a = equationQuantity(eq.a),
    b = equationQuantity(eq.b);
  if ([a, b].some(([n, d]) => d > 10000n || n > 10000n * d))
    throw new RangeError('Use bounded early-equation constants');
  if (a[0] < 0n || b[0] < 0n)
    throw new RangeError('Early-equation constants are non-negative');
  if (eq.kind === 'divide' && a[0] === 0n)
    throw new RangeError('The divisor cannot be zero');
  return { a, b };
}
export function equationSides(eq: EarlyEquation, candidate: string) {
  const { a, b } = parameters(eq),
    x = equationQuantity(candidate);
  const left =
    eq.kind === 'add'
      ? plus(x, a)
      : eq.kind === 'subtract'
        ? minus(x, a)
        : eq.kind === 'subtract-from'
          ? minus(a, x)
          : eq.kind === 'multiply'
            ? times(a, x)
            : divide(x, a);
  const relation = left[0] * b[1] - b[0] * left[1];
  return {
    left: eq.reversed ? b : left,
    right: eq.reversed ? left : b,
    equal: relation === 0n,
  };
}
export function solveEarlyEquation(
  eq: EarlyEquation,
): { status: 'one'; value: Rational } | { status: 'all' | 'none' } {
  const { a, b } = parameters(eq);
  if (eq.kind === 'multiply' && a[0] === 0n)
    return { status: b[0] === 0n ? 'all' : 'none' };
  const value =
    eq.kind === 'add'
      ? minus(b, a)
      : eq.kind === 'subtract'
        ? plus(b, a)
        : eq.kind === 'subtract-from'
          ? minus(a, b)
          : eq.kind === 'multiply'
            ? divide(b, a)
            : times(b, a);
  return { status: 'one', value };
}
export function equationText(eq: EarlyEquation, symbol = 'x') {
  parameters(eq);
  const left =
    eq.kind === 'add'
      ? `${symbol} + ${eq.a}`
      : eq.kind === 'subtract'
        ? `${symbol} − ${eq.a}`
        : eq.kind === 'subtract-from'
          ? `${eq.a} − ${symbol}`
          : eq.kind === 'multiply'
            ? `${eq.a} × ${symbol}`
            : `${symbol} ÷ ${eq.a.includes('/') ? `(${eq.a})` : eq.a}`;
  return eq.reversed ? `${eq.b} = ${left}` : `${left} = ${eq.b}`;
}
export const equationCases: EarlyEquation[] = [
  { kind: 'add', a: '7', b: '19' },
  { kind: 'subtract', a: '8', b: '14' },
  { kind: 'subtract-from', a: '24', b: '9' },
  { kind: 'multiply', a: '4', b: '28' },
  { kind: 'divide', a: '5', b: '6' },
  { kind: 'add', a: '1/4', b: '1' },
  { kind: 'multiply', a: '4', b: '5' },
  { kind: 'subtract', a: '1.25', b: '2.75' },
  { kind: 'multiply', a: '0', b: '0' },
  { kind: 'multiply', a: '0', b: '5' },
];
export type BalanceSide = { boxes: number; known: number };
export type BalanceState = { left: BalanceSide; right: BalanceSide };
function balanceValid(s: BalanceState) {
  for (const side of [s.left, s.right]) {
    boundedWhole(side.boxes, 8);
    boundedWhole(side.known, 60);
  }
  return s;
}
export function balanceValues(s: BalanceState, candidate: number) {
  balanceValid(s);
  boundedWhole(candidate, 20);
  const left = s.left.boxes * candidate + s.left.known,
    right = s.right.boxes * candidate + s.right.known;
  return {
    left,
    right,
    relation:
      left === right
        ? ('equal' as const)
        : left < right
          ? ('left-less' as const)
          : ('left-more' as const),
  };
}
export type BalanceAction =
  'add-unit' | 'remove-unit' | 'add-box' | 'remove-box';
export function changeBalance(
  s: BalanceState,
  action: BalanceAction,
  target: 'both' | 'left',
): BalanceState {
  balanceValid(s);
  if (
    !['add-unit', 'remove-unit', 'add-box', 'remove-box'].includes(action) ||
    !['both', 'left'].includes(target)
  )
    throw new RangeError('Choose a supported balance action and target');
  const change = (side: BalanceSide) => ({
    boxes:
      side.boxes +
      (action === 'add-box' ? 1 : action === 'remove-box' ? -1 : 0),
    known:
      side.known +
      (action === 'add-unit' ? 1 : action === 'remove-unit' ? -1 : 0),
  });
  return balanceValid({
    left: change(s.left),
    right: target === 'both' ? change(s.right) : { ...s.right },
  });
}
export type GrowingPattern = 'squares' | 'counters';
export function patternPieces(kind: GrowingPattern, n: number) {
  if (!['squares', 'counters'].includes(kind))
    throw new RangeError('Choose a drawn pattern');
  boundedWhole(n, 30, 1);
  if (kind === 'counters')
    return {
      count: 2 * n + 1,
      segments: [],
      counters: Array.from({ length: 2 * n + 1 }, (_, i) => ({
        column: i === 2 * n ? n : i % n,
        row: i === 2 * n ? 0 : Math.floor(i / n),
        extra: i === 2 * n,
      })),
    };
  const segments = [];
  for (let i = 0; i < n; i++)
    segments.push(
      { x1: i, y1: 0, x2: i + 1, y2: 0 },
      { x1: i, y1: 1, x2: i + 1, y2: 1 },
    );
  for (let i = 0; i <= n; i++) segments.push({ x1: i, y1: 0, x2: i, y2: 1 });
  return { count: 3 * n + 1, segments, counters: [] };
}
export function patternRule(kind: GrowingPattern, rule: string) {
  if (!['squares', 'counters'].includes(kind))
    throw new RangeError('Choose a drawn pattern');
  return kind === 'squares'
    ? ['3n+1', '1+3n'].includes(rule)
    : ['2n+1', '1+2n'].includes(rule);
}
export const equationStories = [
  {
    id: 'cards',
    title: { zh: '原有多少张卡？', en: 'How many cards originally?' },
    stem: {
      zh: '收到 7 张卡后共有 19 张。设原有 x 张，哪一种关系保留了题意？',
      en: 'Receive 7 cards and now have 19. Let x be the original card count. Which relationship fits?',
    },
    unknown: { zh: 'x 是原有张卡数', en: 'x is the original card count' },
    unit: 'cards' as const,
    eq: equationCases[0]!,
    options: [
      { id: 'a', text: 'x + 7 = 19', valid: true },
      { id: 'b', text: '7 + x = 19', valid: true },
      { id: 'c', text: 'x − 7 = 19', valid: false },
      { id: 'd', text: '7 − x = 19', valid: false },
    ],
  },
  {
    id: 'pencils',
    title: { zh: '每袋多少支？', en: 'How many pencils per bag?' },
    stem: {
      zh: '3 袋装同样多的铅笔，共 24 支。设每袋 x 支，怎样列等量关系？',
      en: 'Three bags contain equal numbers of pencils, 24 in total. Let x be the count per bag. Form a relationship.',
    },
    unknown: { zh: 'x 是每袋铅笔支数', en: 'x is the pencil count per bag' },
    unit: 'pencils' as const,
    eq: { kind: 'multiply' as const, a: '3', b: '24' },
    options: [
      { id: 'a', text: '3 × x = 24', valid: true },
      { id: 'b', text: '24 = 3 × x', valid: true },
      { id: 'c', text: 'x + 3 = 24', valid: false },
      { id: 'd', text: 'x ÷ 3 = 24', valid: false },
    ],
  },
  {
    id: 'money',
    title: { zh: '原有多少零用钱？', en: 'How much money originally?' },
    stem: {
      zh: '纸上假想花去 NZ$1.25，还剩 NZ$2.75。设原有 x 新西兰元，先列关系。',
      en: 'On paper, imagine spending NZ$1.25 with NZ$2.75 remaining. Let x be the original dollar amount; form a relationship first.',
    },
    unknown: {
      zh: 'x 是原有新西兰元数',
      en: 'x is the original amount in NZD',
    },
    unit: 'NZD' as const,
    eq: equationCases[7]!,
    options: [
      { id: 'a', text: 'x − 1.25 = 2.75', valid: true },
      { id: 'b', text: '2.75 = x − 1.25', valid: true },
      { id: 'c', text: '1.25 − x = 2.75', valid: false },
      { id: 'd', text: 'x + 1.25 = 2.75', valid: false },
    ],
  },
  {
    id: 'ribbon',
    title: { zh: '每段彩带多长？', en: 'How long is each piece?' },
    stem: {
      zh: '5 m 彩带平均分为 4 段。设每段 x m，段数与长度怎样组成总长？',
      en: 'Divide 5 m of ribbon into four equal pieces. Let x m be each length. How do piece count and length form the total?',
    },
    unknown: { zh: 'x 是每段的米数', en: 'x is each piece’s length in metres' },
    unit: 'm' as const,
    eq: equationCases[6]!,
    options: [
      { id: 'a', text: '4 × x = 5', valid: true },
      { id: 'b', text: '5 = 4 × x', valid: true },
      { id: 'c', text: 'x + 4 = 5', valid: false },
      { id: 'd', text: 'x ÷ 4 = 5', valid: false },
    ],
  },
];

export function equationWorking(eq: EarlyEquation, symbol = 'x'): string[] {
  const solved = solveEarlyEquation(eq);
  if (solved.status !== 'one') return [];
  const a = eq.a.includes('/') ? `(${eq.a})` : eq.a,
    b = eq.b.includes('/') ? `(${eq.b})` : eq.b;
  const step =
    eq.kind === 'add'
      ? `${symbol} + ${a} − ${a} = ${b} − ${a}`
      : eq.kind === 'subtract'
        ? `${symbol} − ${a} + ${a} = ${b} + ${a}`
        : eq.kind === 'subtract-from'
          ? `${symbol} = ${a} − ${b}`
          : eq.kind === 'multiply'
            ? `${a} × ${symbol} ÷ ${a} = ${b} ÷ ${a}`
            : `${symbol} ÷ ${a} × ${a} = ${b} × ${a}`;
  return [step, `${symbol} = ${rationalText(solved.value)}`];
}
