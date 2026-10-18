import { rational, mulR, textR, type Rational } from './algebraModels';
import { drawTree, treeEvent, type TreeEvent } from './inferenceModels';
import { nextUniform } from './chanceModels';
export type Independence = 'independent' | 'dependent';
export function checkIndependence(raw: string, value: Independence) {
  return (
    value === 'independent'
      ? ['independent', '独立', '相互独立']
      : ['dependent', 'not independent', '不独立', '相依']
  ).includes(raw.trim().toLowerCase());
}
const whole = (n: number, lo: number, hi: number) => {
  if (!Number.isSafeInteger(n) || n < lo || n > hi)
    throw new RangeError('Bounded integer experiment');
  return n;
};
/** Cells are equally likely numbered outcomes, not observed survey estimates. */
export function jointModel(cells: readonly number[]) {
  if (cells.length !== 4) throw new RangeError('Four disjoint cells');
  cells.forEach((n) => whole(n, 0, 24));
  const [ab, aOnly, bOnly, neither] = cells as [number, number, number, number],
    total = ab + aOnly + bOnly + neither;
  if (!total) throw new RangeError('Nonempty space');
  const a = ab + aOnly,
    b = ab + bOnly,
    independent = ab * total === a * b;
  return {
    cells: [...cells],
    total,
    a,
    b,
    ab,
    pA: rational(BigInt(a), BigInt(total)),
    pB: rational(BigInt(b), BigInt(total)),
    pAB: rational(BigInt(ab), BigInt(total)),
    product: mulR(
      rational(BigInt(a), BigInt(total)),
      rational(BigInt(b), BigInt(total)),
    ),
    givenA: a ? rational(BigInt(ab), BigInt(a)) : null,
    independent,
    disjoint: ab === 0,
  };
}
export const jointCases = [
  {
    zh: '独立公平硬币：A首枚正，B次枚正',
    en: 'Independent fair coins: A=first H, B=second H',
    cells: [1, 1, 1, 1],
  },
  {
    zh: '公平骰子：A偶数，B奇数',
    en: 'Fair die: A=even, B=odd',
    cells: [0, 3, 3, 0],
  },
  {
    zh: '八个等可能编号：重叠3，单独各1，皆非3',
    en: 'Eight equally likely IDs: overlap 3, each only 1, neither 3',
    cells: [3, 1, 1, 3],
  },
  {
    zh: '九个等可能编号：重叠2，A独有4，B独有1，皆非2',
    en: 'Nine equally likely IDs: overlap 2, A-only 4, B-only 1, neither 2',
    cells: [2, 4, 1, 2],
  },
  {
    zh: 'A不可能：重叠0，A独有0，B独有2，皆非2',
    en: 'Impossible A: overlap 0, A-only 0, B-only 2, neither 2',
    cells: [0, 0, 2, 2],
  },
];
export const eventHit = (code: string, event: TreeEvent) =>
  event === 'two-red'
    ? code === 'RR'
    : event === 'different'
      ? code[0] !== code[1]
      : code.includes('B');
export function numberedPairs(red: number, blue: number, replace: boolean) {
  const tree = drawTree(red, blue, replace),
    tokens = [
      ...Array.from({ length: red }, (_, i) => `R${i + 1}`),
      ...Array.from({ length: blue }, (_, i) => `B${i + 1}`),
    ];
  return { ...tree, tokens };
}
export const surveyPopulation = Array.from({ length: 24 }, (_, i) => ({
  id: `${'ABC'[Math.floor(i / 8)]}${(i % 8) + 1}`,
  group: 'ABC'[Math.floor(i / 8)]!,
  yes: i % 8 < [2, 4, 6][Math.floor(i / 8)]!,
}));
export type SurveyMethod = 'all' | 'nearby' | 'nonresponse';
export function surveySample(size: number, method: SurveyMethod, seed: number) {
  whole(size, 1, 24);
  whole(seed, 0, 0xffffffff);
  if (!['all', 'nearby', 'nonresponse'].includes(method))
    throw new RangeError('Known sampling method');
  const frame = surveyPopulation.filter(
    (p) => method !== 'nearby' || p.group === 'A',
  );
  if (size > frame.length) throw new RangeError('Sample exceeds its frame');
  const order = [...frame];
  let state = seed;
  for (let i = order.length - 1; i > 0; i--) {
    const n = nextUniform(state);
    state = n.state;
    const j = Math.floor(n.u * (i + 1));
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  const invited = order.slice(0, size).map((p) => ({
      ...p,
      response: method === 'nonresponse' && p.group === 'C' ? null : p.yes,
    })),
    respondents = invited.filter((p) => p.response !== null),
    yes = respondents.filter((p) => p.response).length;
  return {
    invited,
    respondents: respondents.length,
    yes,
    missing: size - respondents.length,
    frameSize: frame.length,
    populationSize: 24,
    populationYes: 12,
    populationProportion: rational(1n, 2n),
    frequency: respondents.length
      ? rational(BigInt(yes), BigInt(respondents.length))
      : null,
    census: method === 'all' && size === 24,
    state,
  };
}
export type PairTrial = {
  n: number;
  first: string;
  second: string;
  code: string;
  hit: boolean;
  hits: number;
  frequency: Rational;
};
/** Each trial starts from the original bag. Replacement refers to within a trial. */
export function simulatePairs(
  red: number,
  blue: number,
  replace: boolean,
  event: TreeEvent,
  seed: number,
  trials: number,
) {
  const model = numberedPairs(red, blue, replace);
  treeEvent(model, event);
  whole(seed, 0, 0xffffffff);
  whole(trials, 0, 1000);
  let state = seed,
    hits = 0;
  const records: PairTrial[] = [];
  for (let n = 1; n <= trials; n++) {
    const firstDraw = nextUniform(state);
    state = firstDraw.state;
    const firstIndex = Math.floor(firstDraw.u * model.tokens.length),
      first = model.tokens[firstIndex]!;
    const rest = replace
        ? model.tokens
        : model.tokens.filter((_, i) => i !== firstIndex),
      secondDraw = nextUniform(state);
    state = secondDraw.state;
    const second = rest[Math.floor(secondDraw.u * rest.length)]!,
      code = first[0]! + second[0]!,
      hit = eventHit(code, event);
    if (hit) hits++;
    records.push({
      n,
      first,
      second,
      code,
      hit,
      hits,
      frequency: rational(BigInt(hits), BigInt(n)),
    });
  }
  return {
    records,
    state,
    hits,
    trials,
    frequency: trials ? rational(BigInt(hits), BigInt(trials)) : null,
    theory: treeEvent(model, event).probability,
  };
}
export const probabilityString = (r: Rational | null) =>
  r === null ? '—' : textR(r);
