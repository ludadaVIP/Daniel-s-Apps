import {
  fractionValue,
  commonDenominator,
  simplifyFraction,
  type FractionValue,
} from './fractionModels';
export type FractionOperation = '+' | '−';
// Keep the rendered workshop bounded; this unit does not introduce negative fractions.
export function fractionOperation(
  left: FractionValue,
  right: FractionValue,
  operation: FractionOperation,
  denominator?: number,
) {
  for (const value of [left, right]) {
    fractionValue(value.n, value.d);
    if (value.d > 12 || value.n > 2 * value.d)
      throw new RangeError(
        'Workshop operands use denominators 1–12 and values 0–2',
      );
  }
  if (operation !== '+' && operation !== '−')
    throw new RangeError('Choose addition or subtraction');
  const least = commonDenominator(left, right).d;
  const d = denominator ?? least;
  if (!Number.isInteger(d) || d < 1 || d > 288 || d % left.d || d % right.d)
    throw new RangeError(
      'The new denominator must be a bounded common multiple',
    );
  const a = left.n * (d / left.d),
    b = right.n * (d / right.d);
  const n = operation === '+' ? a + b : a - b;
  if (n < 0)
    throw new RangeError('This unit explores non-negative differences');
  const raw = { n, d };
  return {
    least,
    left: { n: a, d },
    right: { n: b, d },
    raw,
    simplest: simplifyFraction(raw),
    wholes: Math.max(1, Math.ceil(Math.max(a, b, n) / d)),
  };
}
export function commonDenominatorChoices(
  left: FractionValue,
  right: FractionValue,
) {
  const least = commonDenominator(left, right).d;
  return [
    ...new Set([left.d, right.d, least, least * 2, left.d * right.d]),
  ].sort((a, b) => a - b);
}
export const fractionStories = [
  {
    id: 'water',
    title: { zh: '两壶水合在一起', en: 'Combine water from two jugs' },
    stem: {
      zh: '两壶各有 3/4 L 和 2/3 L 水，全部倒入一个足够大的容器。合计多少升？每条完整分数条代表 1 L，不代表一壶的容量。',
      en: 'Two jugs hold 3/4 L and 2/3 L. Pour both into a sufficiently large container. How many litres altogether? Each full strip is 1 L, not one jug’s capacity.',
    },
    left: { n: 3, d: 4 },
    right: { n: 2, d: 3 },
    operation: '+' as const,
    unit: 'L' as const,
  },
  {
    id: 'ribbon',
    title: { zh: '剪去一段彩带', en: 'Cut a piece from a ribbon' },
    stem: {
      zh: '有 5/6 m 彩带，剪去 1/4 m。还剩多少米？分数都以 1 m 为共同标尺。',
      en: 'A ribbon is 5/6 m long. Cut off 1/4 m. How many metres remain? Both fractions use a 1 m reference.',
    },
    left: { n: 5, d: 6 },
    right: { n: 1, d: 4 },
    operation: '−' as const,
    unit: 'm' as const,
  },
  {
    id: 'money',
    title: { zh: '合并两笔零用钱', en: 'Combine two amounts of money' },
    stem: {
      zh: '纸上假想有 NZ$1/2 和 NZ$1/4，合计多少新西兰元？每条完整条是 NZ$1，钱数不与硬币枚数相加。',
      en: 'On paper, imagine NZ$1/2 and NZ$1/4. How many New Zealand dollars altogether? Each full strip is NZ$1; add money amounts, not coin counts.',
    },
    left: { n: 1, d: 2 },
    right: { n: 1, d: 4 },
    operation: '+' as const,
    unit: 'NZD' as const,
  },
  {
    id: 'empty',
    title: { zh: '用完同样多的水', en: 'Use exactly the water available' },
    stem: {
      zh: '有 2/3 L 水，用去 4/6 L。剩多少升？先比较这两个量，不能只比较分子。',
      en: 'There is 2/3 L of water; use 4/6 L. How many litres remain? Compare the amounts rather than only the numerators.',
    },
    left: { n: 2, d: 3 },
    right: { n: 4, d: 6 },
    operation: '−' as const,
    unit: 'L' as const,
  },
];
