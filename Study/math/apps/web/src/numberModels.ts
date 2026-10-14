import { t } from './model';
export const placeNames = [
  t('百万位', 'Millions'),
  t('十万位', 'Hundred thousands'),
  t('万位', 'Ten thousands'),
  t('千位', 'Thousands'),
  t('百位', 'Hundreds'),
  t('十位', 'Tens'),
  t('个位', 'Ones'),
];
export function placeValues(value: number, places = 7) {
  if (
    !Number.isInteger(value) ||
    value < 0 ||
    value > 9999999 ||
    !Number.isInteger(places) ||
    places < 1 ||
    places > 7
  )
    throw new RangeError('Whole number or place count out of range');
  return Array.from({ length: places }, (_, i) => {
    const power = places - 1 - i,
      unit = 10 ** power;
    return {
      digit: Math.floor(value / unit) % 10,
      unit,
      contribution: (Math.floor(value / unit) % 10) * unit,
      name: placeNames[6 - power]!,
    };
  });
}
const smallEnglish = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
];
const tensEnglish = [
  '',
  '',
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety',
];
function underThousand(n: number): string {
  if (n < 20) return smallEnglish[n]!;
  if (n < 100)
    return (
      tensEnglish[Math.floor(n / 10)]! +
      (n % 10 ? '-' + smallEnglish[n % 10] : '')
    );
  return (
    smallEnglish[Math.floor(n / 100)] +
    ' hundred' +
    (n % 100 ? ' and ' + underThousand(n % 100) : '')
  );
}
const zhDigits = '零一二三四五六七八九';
function chineseGroup(n: number): string {
  let result = '',
    zero = false;
  for (let power = 3; power >= 0; power--) {
    const digit = Math.floor(n / 10 ** power) % 10;
    if (!digit) {
      if (result) zero = true;
      continue;
    }
    if (zero) {
      result += '零';
      zero = false;
    }
    result += zhDigits[digit] + (['', '十', '百', '千'][power] ?? '');
  }
  return result;
}
export function readWholeNumber(value: number) {
  placeValues(value);
  let en = '';
  if (value < 1000) en = underThousand(value);
  else {
    const groups = [
      { n: Math.floor(value / 1000000), suffix: ' million' },
      { n: Math.floor(value / 1000) % 1000, suffix: ' thousand' },
      { n: value % 1000, suffix: '' },
    ].filter((g) => g.n);
    en = groups
      .map(
        (g, i) =>
          `${i > 0 && g.suffix === '' && g.n < 100 ? 'and ' : ''}${underThousand(g.n)}${g.suffix}`,
      )
      .join(' ');
  }
  if (value === 0) return t('零', en);
  const high = Math.floor(value / 10000),
    low = value % 10000;
  let zh = high ? chineseGroup(high) + '万' : '';
  if (low) zh += (high && low < 1000 ? '零' : '') + chineseGroup(low);
  if (zh.startsWith('一十')) zh = zh.slice(1);
  return t(zh, en);
}
export function roundingModel(value: number, unit: number) {
  if (
    !Number.isSafeInteger(value) ||
    value < 0 ||
    ![10, 100, 1000].includes(unit)
  )
    throw new RangeError('Invalid rounding input');
  const lower = Math.floor(value / unit) * unit,
    upper = lower + unit,
    midpoint = lower + unit / 2;
  return {
    lower,
    upper,
    midpoint,
    rounded: value < midpoint ? lower : upper,
    distanceLower: value - lower,
    distanceUpper: upper - value,
  };
}
export function axisPosition(value: number, start: number, end: number) {
  if (
    ![value, start, end].every(Number.isFinite) ||
    end <= start ||
    value < start ||
    value > end
  )
    throw new RangeError('Point must lie in the axis window');
  return (value - start) / (end - start);
}
export type Blocks = { hundreds: number; tens: number; ones: number };
export const blockValue = (blocks: Blocks) =>
  100 * blocks.hundreds + 10 * blocks.tens + blocks.ones;
export function exchangeHundred(
  blocks: Blocks,
  direction: 'to-tens' | 'to-hundred',
): Blocks {
  if (!Object.values(blocks).every((v) => Number.isInteger(v) && v >= 0))
    throw new RangeError('Invalid blocks');
  if (direction === 'to-tens')
    return blocks.hundreds
      ? { ...blocks, hundreds: blocks.hundreds - 1, tens: blocks.tens + 10 }
      : blocks;
  return blocks.tens >= 10
    ? { ...blocks, hundreds: blocks.hundreds + 1, tens: blocks.tens - 10 }
    : blocks;
}
