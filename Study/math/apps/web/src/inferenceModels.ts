import { orderedSummary, nextUniform } from './chanceModels';
import { rational, addR, mulR, textR, type Rational } from './algebraModels';
const whole = (n: number, min: number, max: number) => {
  if (!Number.isSafeInteger(n) || n < min || n > max)
    throw new RangeError('Bounded integer model data');
  return n;
};
export function readOutcomeSet(raw: string): string[] | null {
  if (raw.length > 1200) return null;
  let s = raw
    .trim()
    .replace(/，/g, ',')
    .replace(/；/g, ';')
    .replace(/[−－]/g, '-')
    .toUpperCase();
  if (s.startsWith('{') && s.endsWith('}')) s = s.slice(1, -1).trim();
  else if (/[{}]/.test(s)) return null;
  if (!s) return [];
  if (/[,;]\s*[,;]|^[,;]|[,;]$/.test(s)) return null;
  const values = s.split(/[,;\s]+/);
  if (
    values.length > 64 ||
    values.some((v) => !/^[A-Z0-9]{1,6}(?:-[A-Z0-9]{1,6})?$/.test(v)) ||
    new Set(values).size !== values.length
  )
    return null;
  return values;
}
export function checkOutcomeSet(raw: string, expected: readonly string[]) {
  const values = readOutcomeSet(raw);
  return (
    !!values &&
    new Set(expected).size === expected.length &&
    values.length === expected.length &&
    values.every((v) => expected.includes(v))
  );
}
export const fictionalPopulation = Array.from({ length: 24 }, (_, i) => {
  const group = Math.floor(i / 8),
    values = [2, 6, 3, 5, 3, 5, 4, 4];
  return {
    id: `${'ABC'[group]}${(i % 8) + 1}`,
    group: 'ABC'[group]!,
    value: values[i % 8]! + group * 4,
  };
});
export function sampleRecords(
  size: number,
  method: 'random' | 'nearby',
  seed: number,
) {
  whole(size, 2, 8);
  whole(seed, 0, 0xffffffff);
  if (!['random', 'nearby'].includes(method))
    throw new RangeError('Choose a sampling frame');
  const order = [...fictionalPopulation];
  let state = seed;
  if (method === 'random')
    for (let i = order.length - 1; i > 0; i--) {
      const next = nextUniform(state);
      state = next.state;
      const j = Math.floor(next.u * (i + 1));
      [order[i], order[j]] = [order[j]!, order[i]!];
    }
  const sample = (
    method === 'nearby'
      ? fictionalPopulation.filter((p) => p.group === 'A')
      : order
  ).slice(0, size);
  return {
    sample,
    state,
    frameSize: method === 'random' ? 24 : 8,
    summary: orderedSummary(sample.map((p) => p.value)),
    population: orderedSummary(fictionalPopulation.map((p) => p.value)),
    groups: ['A', 'B', 'C'].map((group) => ({
      group,
      count: sample.filter((p) => p.group === group).length,
    })),
  };
}
export function distribution(values: number[]) {
  const m = orderedSummary(values);
  return {
    ...m,
    min: m.sorted[0]!.value,
    max: m.sorted.at(-1)!.value,
    range: m.sorted.at(-1)!.value - m.sorted[0]!.value,
  };
}
export const distributionPairs = [
  { id: 'same-centre', a: [3, 3, 3, 3, 3, 3], b: [0, 0, 0, 6, 6, 6] },
  { id: 'shift', a: [1, 2, 2, 3, 3, 4], b: [4, 5, 5, 6, 6, 7] },
];
export function intervalCount(values: number[], lo: number, hi: number) {
  distribution(values);
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo > hi)
    throw new RangeError('Ordered interval');
  return values.filter((v) => v >= lo && v <= hi).length;
}
export function changedRecord(last: number) {
  whole(last, 0, 60);
  const original = [4, 5, 6, 7, 8],
    changed = [4, 5, 6, 7, last];
  return {
    original,
    changed,
    before: distribution(original),
    after: distribution(changed),
    meanChange: rational(BigInt(last - 8), 5n),
  };
}
export type SpaceKind = 'coins' | 'coin-spinner' | 'dice';
export function sampleSpace(kind: SpaceKind) {
  if (!['coins', 'coin-spinner', 'dice'].includes(kind))
    throw new RangeError('Choose a supplied experiment');
  const first = kind === 'dice' ? ['1', '2', '3', '4', '5', '6'] : ['H', 'T'],
    second =
      kind === 'coins'
        ? ['H', 'T']
        : kind === 'coin-spinner'
          ? ['1', '2', '3']
          : ['1', '2', '3', '4', '5', '6'];
  const outcomes = first.flatMap((a) =>
    second.map((b) => ({
      id: a + b,
      a,
      b,
      hit:
        kind === 'coins'
          ? a !== b
          : kind === 'coin-spinner'
            ? a === 'T' && b === '2'
            : Number(a) + Number(b) === 7,
    })),
  );
  return {
    kind,
    outcomes,
    first,
    second,
    total: outcomes.length,
    hits: outcomes.filter((o) => o.hit).length,
    probability: rational(
      BigInt(outcomes.filter((o) => o.hit).length),
      BigInt(outcomes.length),
    ),
  };
}
export type TreeEvent = 'two-red' | 'different' | 'at-least-blue';
export type TreeLeaf = {
  code: string;
  first: 'R' | 'B';
  second: 'R' | 'B';
  firstCount: number;
  secondCount: number;
  firstTotal: number;
  secondTotal: number;
  firstProbability: Rational;
  conditionalProbability: Rational;
  probability: Rational;
  possible: boolean;
};
export function drawTree(red: number, blue: number, replace: boolean) {
  whole(red, 0, 5);
  whole(blue, 0, 5);
  if (typeof replace !== 'boolean' || red + blue < 2)
    throw new RangeError('At least two numbered tokens');
  const total = red + blue,
    counts = { R: red, B: blue },
    leaves: TreeLeaf[] = [];
  for (const first of ['R', 'B'] as const) {
    if (!counts[first]) continue;
    for (const second of ['R', 'B'] as const) {
      const secondCount =
          counts[second] - (replace ? 0 : first === second ? 1 : 0),
        secondTotal = replace ? total : total - 1,
        firstProbability = rational(BigInt(counts[first]), BigInt(total)),
        conditionalProbability = rational(
          BigInt(secondCount),
          BigInt(secondTotal),
        );
      leaves.push({
        code: first + second,
        first,
        second,
        firstCount: counts[first],
        secondCount,
        firstTotal: total,
        secondTotal,
        firstProbability,
        conditionalProbability,
        probability: mulR(firstProbability, conditionalProbability),
        possible: secondCount > 0,
      });
    }
  }
  const tokens = [
      ...Array.from({ length: red }, (_, i) => `R${i + 1}`),
      ...Array.from({ length: blue }, (_, i) => `B${i + 1}`),
    ],
    labelled = tokens.flatMap((a) =>
      tokens
        .filter((b) => replace || a !== b)
        .map((b) => ({ id: `${a}-${b}`, code: a[0]! + b[0]! })),
    );
  return {
    red,
    blue,
    replace,
    total,
    leaves,
    labelled,
    possible: leaves.filter((l) => l.possible).map((l) => l.code),
    totalProbability: leaves.reduce(
      (s, l) => addR(s, l.probability),
      rational(0n),
    ),
    labelledTotal: labelled.length,
  };
}
export function treeEvent(tree: ReturnType<typeof drawTree>, event: TreeEvent) {
  if (!['two-red', 'different', 'at-least-blue'].includes(event))
    throw new RangeError('Choose a defined event');
  const hits = (code: string) =>
      event === 'two-red'
        ? code === 'RR'
        : event === 'different'
          ? code[0] !== code[1]
          : code.includes('B'),
    leaves = tree.leaves.filter((l) => hits(l.code)),
    probability = leaves.reduce((s, l) => addR(s, l.probability), rational(0n));
  return {
    probability,
    paths: leaves.filter((l) => l.possible).map((l) => l.code),
    labelledHits: tree.labelled.filter((l) => hits(l.code)).length,
  };
}
export const probabilityText = (r: Rational) => textR(r);
