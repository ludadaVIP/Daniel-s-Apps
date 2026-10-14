export function count(value: number, max = 9999) {
  if (!Number.isSafeInteger(value) || value < 0 || value > max)
    throw new RangeError('Use a bounded non-negative whole number');
  return value;
}
export function columnCalculation(
  a: number,
  b: number,
  operation: 'add' | 'subtract',
) {
  count(a);
  count(b);
  if (operation === 'subtract' && b > a)
    throw new RangeError('This subtraction model needs a non-negative result');
  const length = Math.max(String(a).length, String(b).length);
  const top = String(a).padStart(length, '0').split('').map(Number);
  const bottom = String(b).padStart(length, '0').split('').map(Number);
  const working = [...top];
  let carry = 0;
  const steps = [];
  for (let index = length - 1; index >= 0; index--) {
    const place = 10 ** (length - index - 1),
      before = [...working];
    let donor: number | undefined;
    const incoming = carry;
    if (operation === 'subtract' && working[index]! < bottom[index]!) {
      donor = index - 1;
      while (working[donor] === 0) donor--;
      working[donor]!--;
      for (let j = donor + 1; j < index; j++) working[j] = 9;
      working[index]! += 10;
    }
    const raw =
      operation === 'add'
        ? top[index]! + bottom[index]! + incoming
        : working[index]! - bottom[index]!;
    const digit = raw % 10;
    carry = operation === 'add' ? Math.floor(raw / 10) : 0;
    steps.push({
      index,
      place,
      before,
      after: [...working],
      donor,
      incoming,
      raw,
      digit,
      outgoing: carry,
      top: operation === 'add' ? top[index]! : working[index]!,
      bottom: bottom[index]!,
    });
  }
  const result =
    steps.reduce((sum, s) => sum + s.digit * s.place, 0) + carry * 10 ** length;
  return { a, b, operation, top, bottom, steps, result, finalCarry: carry };
}
export function splitProduct(groups: number, size: number, cut: number) {
  count(groups, 12);
  count(size, 12);
  count(cut, size);
  return {
    groups,
    size,
    cut,
    rest: size - cut,
    left: groups * cut,
    right: groups * (size - cut),
    total: groups * size,
  };
}
export function areaProduct(a: number, b: number) {
  count(a, 99);
  count(b, 99);
  const aTens = Math.floor(a / 10) * 10,
    aOnes = a % 10,
    bTens = Math.floor(b / 10) * 10,
    bOnes = b % 10;
  const parts = [
    { x: 0, y: 0, width: aTens, height: bTens },
    { x: aTens, y: 0, width: aOnes, height: bTens },
    { x: 0, y: bTens, width: aTens, height: bOnes },
    { x: aTens, y: bTens, width: aOnes, height: bOnes },
  ].map((p) => ({ ...p, area: p.width * p.height }));
  return {
    a,
    b,
    aTens,
    aOnes,
    bTens,
    bOnes,
    parts,
    total: parts.reduce((s, p) => s + p.area, 0),
  };
}
export function longDivision(total: number, divisor: number) {
  count(total);
  count(divisor, 12);
  if (!divisor) throw new RangeError('The divisor must be positive');
  const digits = String(total).split('').map(Number);
  let remainder = 0;
  const steps = digits.map((digit, i) => {
    const previous = remainder,
      available = previous * 10 + digit,
      quotientDigit = Math.floor(available / divisor),
      used = divisor * quotientDigit;
    remainder = available - used;
    return {
      digit,
      place: 10 ** (digits.length - i - 1),
      previous,
      available,
      quotientDigit,
      used,
      remainder,
    };
  });
  const quotient = steps.reduce(
    (s, row) => s + row.quotientDigit * row.place,
    0,
  );
  return { total, divisor, steps, quotient, remainder };
}
export type EstimateOperation = 'add' | 'subtract' | 'multiply';
export function estimateCalculation(
  a: number,
  b: number,
  operation: EstimateOperation,
  unit: 10 | 100,
) {
  count(a);
  count(b);
  if (![10, 100].includes(unit)) throw new RangeError('Use tens or hundreds');
  if (operation === 'subtract' && b > a)
    throw new RangeError('Use a non-negative exact difference');
  const aLow = Math.floor(a / unit) * unit,
    aHigh = Math.ceil(a / unit) * unit,
    bLow = Math.floor(b / unit) * unit,
    bHigh = Math.ceil(b / unit) * unit;
  const roundA = Math.round(a / unit) * unit,
    roundB = Math.round(b / unit) * unit;
  const apply = (x: number, y: number) =>
    operation === 'add' ? x + y : operation === 'subtract' ? x - y : x * y;
  const lower = operation === 'subtract' ? aLow - bHigh : apply(aLow, bLow),
    upper = operation === 'subtract' ? aHigh - bLow : apply(aHigh, bHigh);
  return {
    a,
    b,
    operation,
    unit,
    aLow,
    aHigh,
    bLow,
    bHigh,
    roundA,
    roundB,
    estimate: apply(roundA, roundB),
    lower,
    upper,
    exact: apply(a, b),
  };
}
export const estimateCases: {
  a: number;
  b: number;
  operation: EstimateOperation;
  unit: 10 | 100;
  candidates: number[];
}[] = [
  { a: 23, b: 19, operation: 'multiply', unit: 10, candidates: [43, 437, 438] },
  { a: 298, b: 403, operation: 'add', unit: 10, candidates: [701, 7010, 700] },
  {
    a: 802,
    b: 397,
    operation: 'subtract',
    unit: 100,
    candidates: [405, 45, 406],
  },
];
