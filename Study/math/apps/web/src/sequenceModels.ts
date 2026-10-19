import {
  rational,
  addR,
  mulR,
  divR,
  negR,
  sameR,
  textR,
  type Rational,
} from './algebraModels';
import { readRational } from './rationalModels';
export type SequenceCode =
  | 'outside-domain'
  | 'insufficient'
  | 'inconsistent'
  | 'arithmetic'
  | 'geometric'
  | 'both'
  | 'neither'
  | 'not-geometric'
  | 'undefined'
  | 'not-reached';
const names: Record<SequenceCode, string[]> = {
  'outside-domain': ['outside-domain', '域外', '不在定义域'],
  insufficient: ['insufficient', '条件不足', '信息不足'],
  inconsistent: ['inconsistent', '矛盾', '条件矛盾'],
  arithmetic: ['arithmetic', '等差'],
  geometric: ['geometric', '等比'],
  both: ['both', '两者都是', '既等差又等比'],
  neither: ['neither', '两者都不是', '既非等差也非等比'],
  'not-geometric': ['not-geometric', '不是等比', '非等比'],
  undefined: ['undefined', '无定义'],
  'not-reached': ['not-reached', '窗内未达到', '范围内未达到'],
};
export const checkSequenceCode = (raw: string, value: SequenceCode) =>
  names[value].includes(raw.trim().toLowerCase());
export const sequenceNumber = (r: Rational) => Number(r[0]) / Number(r[1]);
export function sequenceIndex(n: number, allowZero = false) {
  if (!Number.isSafeInteger(n) || n < (allowZero ? 0 : 1) || n > 24)
    throw new RangeError(
      'Integer sequence index from one (sum/time may start at zero) to twenty-four',
    );
  return n;
}
function scalar(r: Rational) {
  if (r[1] <= 0n || r[1] > 1000n || r[0] < -1000n * r[1] || r[0] > 1000n * r[1])
    throw new RangeError('Bounded rational classroom parameters');
  return r;
}
export const differenceR = (a: Rational, b: Rational) => addR(a, negR(b));
/** Nonnegative integer powers as repeated products; the first sequence term is handled separately for q=0. */
function productPower(q: Rational, n: number) {
  let out = rational(1n);
  for (let k = 0; k < n; k++) out = mulR(out, q);
  return out;
}
export function arithmeticTerm(first: Rational, step: Rational, n: number) {
  scalar(first);
  scalar(step);
  sequenceIndex(n);
  return addR(first, mulR(rational(BigInt(n - 1)), step));
}
export function arithmeticSum(first: Rational, step: Rational, n: number) {
  scalar(first);
  scalar(step);
  sequenceIndex(n, true);
  if (n === 0) return rational(0n);
  return mulR(
    rational(BigInt(n), 2n),
    addR(first, arithmeticTerm(first, step, n)),
  );
}
export function geometricTerm(first: Rational, ratio: Rational, n: number) {
  scalar(first);
  scalar(ratio);
  sequenceIndex(n);
  return n === 1 ? first : mulR(first, productPower(ratio, n - 1));
}
export function geometricTail(first: Rational, ratio: Rational, n: number) {
  scalar(first);
  scalar(ratio);
  sequenceIndex(n, true);
  return n === 0 ? first : mulR(first, productPower(ratio, n));
}
/** Also computes a zero multiplier recurrence, while geometricDefinition separately checks the nonzero-ratio convention. */
export function geometricSum(first: Rational, ratio: Rational, n: number) {
  scalar(first);
  scalar(ratio);
  sequenceIndex(n, true);
  if (n === 0) return rational(0n);
  if (sameR(ratio, rational(1n))) return mulR(rational(BigInt(n)), first);
  return mulR(
    first,
    divR(
      differenceR(rational(1n), productPower(ratio, n)),
      differenceR(rational(1n), ratio),
    ),
  );
}
export const geometricDefinition = (first: Rational, ratio: Rational) =>
  first[0] !== 0n && ratio[0] !== 0n;
export function adjacentRatio(
  first: Rational,
  ratio: Rational,
  n: number,
): Rational | null {
  sequenceIndex(n);
  const value = geometricTerm(first, ratio, n);
  return value[0] === 0n ? null : ratio;
}
export function arithmeticPairs(first: Rational, step: Rational, n: number) {
  sequenceIndex(n);
  const forward = Array.from({ length: n }, (_, i) =>
      arithmeticTerm(first, step, i + 1),
    ),
    reverse = [...forward].reverse();
  return {
    forward,
    reverse,
    pairTotal: addR(first, forward[n - 1]!),
    doubleSum: mulR(rational(BigInt(n)), addR(first, forward[n - 1]!)),
    sum: arithmeticSum(first, step, n),
  };
}
export type ArithmeticRecovery =
  | { kind: 'unique'; first: Rational; step: Rational }
  | { kind: 'insufficient'; index: number; value: Rational }
  | { kind: 'inconsistent' };
export function recoverArithmetic(
  p: number,
  ap: Rational,
  r: number,
  ar: Rational,
): ArithmeticRecovery {
  sequenceIndex(p);
  sequenceIndex(r);
  scalar(ap);
  scalar(ar);
  if (p === r)
    return sameR(ap, ar)
      ? { kind: 'insufficient', index: p, value: ap }
      : { kind: 'inconsistent' };
  const step = divR(differenceR(ar, ap), rational(BigInt(r - p))),
    first = differenceR(ap, mulR(rational(BigInt(p - 1)), step));
  scalar(step);
  scalar(first);
  return { kind: 'unique', first, step };
}
export function recoveredTerm(
  m: ArithmeticRecovery,
  n: number,
): Rational | SequenceCode {
  sequenceIndex(n);
  return m.kind === 'unique'
    ? arithmeticTerm(m.first, m.step, n)
    : m.kind === 'insufficient' && n === m.index
      ? m.value
      : m.kind;
}
export const arithmeticCases = {
  standard: { p: 2, ap: '8', r: 5, ar: '17' },
  decreasing: { p: 2, ap: '4', r: 6, ar: '-4' },
  fraction: { p: 3, ap: '1', r: 7, ar: '3' },
  constant: { p: 2, ap: '-3', r: 5, ar: '-3' },
  repeated: { p: 3, ap: '7', r: 3, ar: '7' },
  conflict: { p: 3, ap: '7', r: 3, ar: '8' },
} as const;
export function arithmeticCase(kind: keyof typeof arithmeticCases) {
  const c = arithmeticCases[kind];
  return recoverArithmetic(c.p, readRational(c.ap), c.r, readRational(c.ar));
}
export type RuleCase = 'add' | 'square' | 'double' | 'observed';
export function sequenceAt(kind: RuleCase, n: number): Rational | SequenceCode {
  if (!Number.isSafeInteger(n) || n < 1) return 'outside-domain';
  sequenceIndex(n);
  if (kind === 'observed')
    return n <= 3 ? rational(BigInt(2 * n)) : 'insufficient';
  if (kind === 'add') return arithmeticTerm(rational(2n), rational(2n), n);
  if (kind === 'square') return rational(BigInt(n * n + 1));
  return geometricTerm(rational(2n), rational(2n), n);
}
export function prefixExtension(n: number, alternative = false) {
  sequenceIndex(n);
  return rational(
    BigInt(2 * n + (alternative ? (n - 1) * (n - 2) * (n - 3) : 0)),
  );
}
export type DepositTiming = 'end' | 'start';
export type PostingPolicy = 'ideal' | 'cents';
export type SavingsConfig = {
  initial: Rational;
  deposit: Rational;
  multiplier: Rational;
  timing: DepositTiming;
  policy: PostingPolicy;
};
function savingsConfig(c: SavingsConfig) {
  [c.initial, c.deposit, c.multiplier].forEach(scalar);
  if (
    c.initial[0] < 0n ||
    c.deposit[0] < 0n ||
    c.multiplier[0] <= 0n ||
    sequenceNumber(c.multiplier) > 2
  )
    throw new RangeError(
      'Nonnegative balances and deposits, multiplier in (0,2]',
    );
  if (
    c.policy === 'cents' &&
    [c.initial, c.deposit].some((r) => (100n * r[0]) % r[1] !== 0n)
  )
    throw new RangeError('Posted money starts with whole cents');
}
export function roundCents(value: Rational) {
  if (value[0] < 0n || value[1] <= 0n)
    throw new RangeError('Nonnegative posted balance');
  return rational((200n * value[0] + value[1]) / (2n * value[1]), 100n);
}
export function moneyText(value: Rational) {
  const absolute = value[0] < 0n ? negR(value) : value,
    rounded = roundCents(absolute),
    cents = (rounded[0] * 100n) / rounded[1],
    prefix = sameR(absolute, rounded) ? '' : '≈',
    sign = value[0] < 0n && cents !== 0n ? '−' : '';
  return `${prefix}${sign}NZ$${cents / 100n}.${String(cents % 100n).padStart(2, '0')}`;
}
export type SavingsRow = {
  period: number;
  opening: Rational;
  before: Rational;
  interestBase: Rational;
  exactGrowth: Rational;
  postedGrowth: Rational;
  interest: Rational;
  after: Rational;
  closing: Rational;
};
export function savingsLedger(c: SavingsConfig, n: number) {
  savingsConfig(c);
  sequenceIndex(n, true);
  let balance = c.initial;
  const rows: SavingsRow[] = [];
  for (let k = 1; k <= n; k++) {
    const before = c.timing === 'start' ? c.deposit : rational(0n),
      after = c.timing === 'end' ? c.deposit : rational(0n),
      base = addR(balance, before),
      exactGrowth = mulR(base, c.multiplier),
      postedGrowth =
        c.policy === 'cents' ? roundCents(exactGrowth) : exactGrowth,
      closing = addR(postedGrowth, after);
    rows.push({
      period: k,
      opening: balance,
      before,
      interestBase: base,
      exactGrowth,
      postedGrowth,
      interest: differenceR(postedGrowth, base),
      after,
      closing,
    });
    balance = closing;
  }
  const contributed = addR(c.initial, mulR(rational(BigInt(n)), c.deposit));
  return {
    rows,
    balance,
    contributed,
    gain: differenceR(balance, contributed),
  };
}
export function savingsFormula(c: SavingsConfig, n: number) {
  savingsConfig(c);
  sequenceIndex(n, true);
  if (c.policy !== 'ideal')
    throw new RangeError('The exact closed form is for the unrounded model');
  const initial = mulR(c.initial, productPower(c.multiplier, n)),
    deposits = geometricSum(c.deposit, c.multiplier, n);
  return addR(
    initial,
    c.timing === 'start' ? mulR(deposits, c.multiplier) : deposits,
  );
}
export function firstSavingsPeriod(
  c: SavingsConfig,
  target: Rational,
  limit = 12,
):
  | {
      kind: 'reached';
      period: number;
      previous: Rational | null;
      balance: Rational;
    }
  | { kind: 'not-reached'; limit: number; balance: Rational } {
  savingsConfig(c);
  scalar(target);
  sequenceIndex(limit, true);
  if (target[0] < 0n) throw new RangeError('Nonnegative target');
  const ledger = savingsLedger(c, limit);
  let previous: Rational | null = null,
    balance = c.initial;
  for (let k = 0; k <= limit; k++) {
    if (k > 0) balance = ledger.rows[k - 1]!.closing;
    if (balance[0] * target[1] >= target[0] * balance[1])
      return { kind: 'reached', period: k, previous, balance };
    previous = balance;
  }
  return { kind: 'not-reached', limit, balance };
}
export const savingsCases = {
  standard: {
    initial: '100',
    deposit: '10',
    multiplier: '11/10',
    target: '200',
  },
  tiny: { initial: '0.05', deposit: '0', multiplier: '11/10', target: '0.07' },
  zeroRate: { initial: '100', deposit: '10', multiplier: '1', target: '150' },
  beyond: { initial: '100', deposit: '0', multiplier: '11/10', target: '200' },
  already: {
    initial: '200',
    deposit: '10',
    multiplier: '11/10',
    target: '200',
  },
} as const;
export function savingsCase(
  kind: keyof typeof savingsCases,
  timing: DepositTiming = 'end',
  policy: PostingPolicy = 'ideal',
): SavingsConfig {
  const c = savingsCases[kind];
  return {
    initial: readRational(c.initial),
    deposit: readRational(c.deposit),
    multiplier: readRational(c.multiplier),
    timing,
    policy,
  };
}
export const sequenceText = textR;
