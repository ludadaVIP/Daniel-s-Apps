import {
  fractionValue,
  simplifyFraction,
  commonDenominator,
  type FractionValue as F,
} from './fractionModels';
import { boundedWhole } from './measurementModels';

export function workshopFraction(value: F, maximum = 3) {
  fractionValue(value.n, value.d);
  if (value.d > 12 || value.n > maximum * value.d)
    throw new RangeError('Use a bounded non-negative workshop fraction');
  return value;
}
export function fractionText(value: F) {
  const v = simplifyFraction(value);
  return v.d === 1 ? String(v.n) : `${v.n}/${v.d}`;
}
export function fractionProduct(left: F, right: F) {
  workshopFraction(left);
  workshopFraction(right);
  const raw = { n: left.n * right.n, d: left.d * right.d };
  return { raw, result: simplifyFraction(raw) };
}
export function repeatFraction(count: number, part: F) {
  boundedWhole(count, 6, 0);
  workshopFraction(part, 2);
  return {
    count,
    part,
    raw: { n: count * part.n, d: part.d },
    result: simplifyFraction({ n: count * part.n, d: part.d }),
  };
}
export function areaProduct(left: F, right: F) {
  workshopFraction(left, 2);
  workshopFraction(right, 2);
  const across = Math.max(1, Math.ceil(left.n / left.d)),
    down = Math.max(1, Math.ceil(right.n / right.d));
  const columns = across * left.d,
    rows = down * right.d;
  return {
    ...fractionProduct(left, right),
    across,
    down,
    columns,
    rows,
    cells: Array.from({ length: columns * rows }, (_, i) => ({
      x: i % columns,
      y: Math.floor(i / columns),
      vertical: i % columns < left.n,
      horizontal: Math.floor(i / columns) < right.n,
      overlap: i % columns < left.n && Math.floor(i / columns) < right.n,
    })),
    cellsPerWhole: left.d * right.d,
  };
}
export function partOfAmount(amount: number, part: F) {
  boundedWhole(amount, 48, 0);
  workshopFraction(part, 1);
  return {
    amount,
    part,
    each: simplifyFraction({ n: amount, d: part.d }),
    result: simplifyFraction({ n: amount * part.n, d: part.d }),
  };
}
export function shareFraction(amount: F, people: number) {
  workshopFraction(amount, 2);
  boundedWhole(people, 6, 1);
  const denominator = amount.d * people;
  return {
    denominator,
    selected: amount.n * people,
    result: simplifyFraction({ n: amount.n, d: denominator }),
    pieces: Array.from({ length: amount.n * people }, (_, i) => ({
      index: i,
      owner: i % people,
    })),
    perPerson: amount.n,
  };
}
export function fractionQuotient(amount: F, group: F) {
  workshopFraction(amount);
  workshopFraction(group);
  if (group.n === 0)
    throw new RangeError(
      'A group size of zero cannot define division or a reciprocal',
    );
  const common = commonDenominator(amount, group),
    total = common.left.n,
    perGroup = common.right.n;
  const fullGroups = Math.floor(total / perGroup),
    remainder = total % perGroup;
  return {
    denominator: common.d,
    total,
    perGroup,
    fullGroups,
    remainderUnits: remainder,
    remainder: simplifyFraction({ n: remainder, d: common.d }),
    fractionOfGroup: simplifyFraction({ n: remainder, d: perGroup }),
    result: simplifyFraction({ n: total, d: perGroup }),
    reciprocal: { n: group.d, d: group.n },
    raw: { n: amount.n * group.d, d: amount.d * group.n },
  };
}
