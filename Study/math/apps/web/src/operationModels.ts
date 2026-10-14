export function wholeCount(value: number, max = 100) {
  if (!Number.isSafeInteger(value) || value < 0 || value > max)
    throw new RangeError('Use a bounded non-negative whole count');
  return value;
}
export function partWhole(a: number, b: number) {
  wholeCount(a, 20);
  wholeCount(b, 20);
  return {
    a,
    b,
    total: a + b,
    difference: Math.abs(a - b),
    larger: Math.max(a, b),
    smaller: Math.min(a, b),
  };
}
export function equalGroups(groups: number, perGroup: number) {
  wholeCount(groups, 8);
  wholeCount(perGroup, 8);
  return { groups, perGroup, total: groups * perGroup };
}
export function divideObjects(
  total: number,
  divisor: number,
  mode: 'share' | 'group',
) {
  wholeCount(total, 60);
  wholeCount(divisor, 10);
  if (divisor === 0) throw new RangeError('A divisor must be positive');
  const quotient = Math.floor(total / divisor),
    remainder = total % divisor;
  return {
    total,
    divisor,
    quotient,
    remainder,
    groupCount: mode === 'share' ? divisor : quotient,
    perGroup: mode === 'share' ? quotient : divisor,
    assigned: quotient * divisor,
  };
}
export function inverseFacts(groups: number, perGroup: number) {
  const model = equalGroups(groups, perGroup);
  return {
    ...model,
    products: [
      `${groups} × ${perGroup} = ${model.total}`,
      `${perGroup} × ${groups} = ${model.total}`,
    ],
    divisions: [
      ...(groups > 0 ? [`${model.total} ÷ ${groups} = ${perGroup}`] : []),
      ...(perGroup > 0 ? [`${model.total} ÷ ${perGroup} = ${groups}`] : []),
    ],
  };
}
export type OperationScenario = {
  id: string;
  total?: number;
  a?: number;
  b?: number;
  groups?: number;
  perGroup?: number;
  answer: number;
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
};
export const operationScenarios: OperationScenario[] = [
  { id: 'join', a: 14, b: 9, answer: 23, operation: 'add' },
  { id: 'left', total: 30, b: 12, answer: 18, operation: 'subtract' },
  { id: 'groups', groups: 5, perGroup: 7, answer: 35, operation: 'multiply' },
  { id: 'share', total: 24, groups: 6, answer: 4, operation: 'divide' },
  { id: 'contain', total: 28, perGroup: 4, answer: 7, operation: 'divide' },
];
