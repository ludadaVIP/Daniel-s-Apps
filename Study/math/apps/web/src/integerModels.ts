import { boundedWhole } from './measurementModels';
export type ArithmeticOperator = '+' | '−' | '×' | '÷';
export type ArithmeticToken = number | ArithmeticOperator | '(' | ')';
type Node =
  | { kind: 'number'; value: number }
  | { kind: 'bracket'; inner: Node }
  | {
      kind: 'binary';
      op: ArithmeticOperator;
      index: number;
      left: Node;
      right: Node;
    };
const whole = (n: number) => boundedWhole(n, 1000000);
export function wholeOperation(op: ArithmeticOperator, a: number, b: number) {
  whole(a);
  whole(b);
  if (op === '÷' && (b === 0 || a % b !== 0))
    throw new RangeError(
      'This whole-number workshop needs nonzero, exact division',
    );
  return whole(
    op === '+' ? a + b : op === '−' ? a - b : op === '×' ? a * b : a / b,
  );
}
export function arithmeticTrace(tokens: ArithmeticToken[]) {
  if (!tokens.length || tokens.length > 31)
    throw new RangeError('Use a short whole-number expression');
  let cursor = 0;
  const factor = (): Node => {
    const token = tokens[cursor++];
    if (typeof token === 'number')
      return { kind: 'number', value: whole(token) };
    if (token === '(') {
      const inner = expression();
      if (tokens[cursor++] !== ')') throw new SyntaxError('Close each bracket');
      return { kind: 'bracket', inner };
    }
    throw new SyntaxError('Expected a number or bracket');
  };
  const term = (): Node => {
    let left = factor();
    while (tokens[cursor] === '×' || tokens[cursor] === '÷') {
      const index = cursor,
        op = tokens[cursor++] as ArithmeticOperator;
      left = { kind: 'binary', op, index, left, right: factor() };
    }
    return left;
  };
  const expression = (): Node => {
    let left = term();
    while (tokens[cursor] === '+' || tokens[cursor] === '−') {
      const index = cursor,
        op = tokens[cursor++] as ArithmeticOperator;
      left = { kind: 'binary', op, index, left, right: term() };
    }
    return left;
  };
  const root = expression();
  if (cursor !== tokens.length)
    throw new SyntaxError('Unexpected arithmetic token');
  const binary: {
    node: Extract<Node, { kind: 'binary' }>;
    path: string;
    depth: number;
  }[] = [];
  const collect = (n: Node, path: string, depth: number) => {
    if (n.kind === 'bracket') collect(n.inner, path + '.inner', depth + 1);
    else if (n.kind === 'binary') {
      collect(n.left, path + '.left', depth);
      binary.push({ node: n, path, depth });
      collect(n.right, path + '.right', depth);
    }
  };
  collect(root, 'root', 0);
  const solved = new Map<string, number>();
  const value = (n: Node, path: string): number | undefined =>
    solved.has(path)
      ? solved.get(path)
      : n.kind === 'number'
        ? n.value
        : n.kind === 'bracket'
          ? value(n.inner, path + '.inner')
          : undefined;
  const display = (n: Node, path: string): string => {
    const v = value(n, path);
    if (v !== undefined) return String(v);
    if (n.kind === 'bracket') return `(${display(n.inner, path + '.inner')})`;
    if (n.kind === 'binary')
      return `${display(n.left, path + '.left')} ${n.op} ${display(n.right, path + '.right')}`;
    return String(n.value);
  };
  const steps = [];
  while (solved.size < binary.length) {
    const ready = binary.filter(
      ({ node, path }) =>
        !solved.has(path) &&
        value(node.left, path + '.left') !== undefined &&
        value(node.right, path + '.right') !== undefined,
    );
    ready.sort(
      (a, b) =>
        b.depth - a.depth ||
        (['×', '÷'].includes(b.node.op) ? 2 : 1) -
          (['×', '÷'].includes(a.node.op) ? 2 : 1) ||
        a.node.index - b.node.index,
    );
    const next = ready[0];
    if (!next) throw new Error('No valid arithmetic step');
    const { node, path, depth } = next,
      left = value(node.left, path + '.left')!,
      right = value(node.right, path + '.right')!,
      before = display(root, 'root'),
      result = wholeOperation(node.op, left, right);
    solved.set(path, result);
    steps.push({
      op: node.op,
      left,
      right,
      result,
      depth,
      before,
      after: display(root, 'root'),
    });
  }
  return { original: tokens.join(' '), steps, result: value(root, 'root')! };
}
export function positiveFactors(n: number) {
  boundedWhole(n, 60, 1);
  return Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
}
export function factorPairs(n: number) {
  return positiveFactors(n)
    .filter((d) => d * d <= n)
    .map((d) => ({ a: d, b: n / d }));
}
export function positiveMultiples(n: number, count = 8) {
  boundedWhole(n, 60, 1);
  boundedWhole(count, 60, 1);
  return Array.from({ length: count }, (_, i) => n * (i + 1));
}
export function trialDivision(n: number, d: number) {
  boundedWhole(n, 60);
  boundedWhole(d, 60, 1);
  return {
    quotient: Math.floor(n / d),
    remainder: n % d,
    divides: n % d === 0,
  };
}
export function numberKind(n: number) {
  boundedWhole(n, 60);
  return n < 2
    ? 'neither'
    : positiveFactors(n).length === 2
      ? 'prime'
      : 'composite';
}
export function commonNumbers(a: number, b: number, count = 8) {
  const aFactors = positiveFactors(a),
    bFactors = positiveFactors(b),
    commonFactors = aFactors.filter((d) => bFactors.includes(d)),
    gcf = commonFactors.at(-1)!,
    lcm = (a / gcf) * b,
    aMultiples = positiveMultiples(a, count),
    bMultiples = positiveMultiples(b, count),
    visibleCommon = aMultiples.filter((v) => bMultiples.includes(v));
  return {
    aFactors,
    bFactors,
    commonFactors,
    gcf,
    lcm,
    aMultiples,
    bMultiples,
    visibleCommon,
  };
}
export const mixedCases: ArithmeticToken[][] = [
  [1200, '+', 36, '×', 25, '−', 480, '÷', 6],
  [3600, '÷', 9, '×', 4, '+', 275],
  [5000, '−', 18, '×', 125, '+', 840, '÷', 7],
  [0, '×', 875, '+', 2400, '÷', 6],
];
export const orderCases: {
  tokens: ArithmeticToken[];
  rule: 'brackets' | 'multiply-divide' | 'same-level';
}[] = [
  { tokens: [24, '+', 36, '÷', 6], rule: 'multiply-divide' },
  { tokens: ['(', 24, '+', 36, ')', '÷', 6], rule: 'brackets' },
  { tokens: [24, '÷', 6, '×', 2], rule: 'same-level' },
  { tokens: [20, '−', 6, '+', 4], rule: 'same-level' },
  { tokens: [60, '−', '(', 8, '+', 4, ')', '×', 3], rule: 'brackets' },
  { tokens: [2, '×', 3, '+', '(', 4, '+', 5, ')'], rule: 'brackets' },
];
