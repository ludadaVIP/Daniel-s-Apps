/** Fictional, deliberately small teaching models. No physiological predictions. */
function finite(x: number) {
  if (!Number.isFinite(x)) throw new RangeError('A finite value is required');
}
function fraction(x: number) {
  finite(x);
  if (x < 0 || x > 1) throw new RangeError('Frequency must be in [0,1]');
}
function count(x: number) {
  if (!Number.isSafeInteger(x) || x < 0)
    throw new RangeError('Nonnegative integer required');
}
export function signalFrames(receptor: boolean, downstream: boolean) {
  return [
    { bound: false, relay: false, response: false },
    { bound: receptor, relay: false, response: false },
    { bound: receptor, relay: receptor && downstream, response: false },
    {
      bound: receptor,
      relay: receptor && downstream,
      response: receptor && downstream,
    },
  ];
}
/** Millivolts, milliseconds; stylised spikes, identical amplitude at both strengths. */
export function spikeTrain(strong: boolean) {
  const times = strong ? [10, 30, 50, 70, 90] : [20, 70];
  return Array.from({ length: 101 }, (_, ms) => {
    const phase = times.map((t) => ms - t).find((d) => d >= 0 && d <= 5);
    const mv =
      phase === undefined ? -70 : [-70, -30, 30, -20, -80, -70][phase]!;
    return { ms, mv };
  });
}
/** Signed deviation in arbitrary units; no physical time conversion.
 * Pre-start history is held at x=10, so a delayed controller starts with old data. */
export function feedbackFrames(gain: number, delay: number, steps = 10) {
  finite(gain);
  count(delay);
  count(steps);
  if (gain < 0 || gain > 0.6 || delay > 2 || steps > 100)
    throw new RangeError('Model bounds');
  const x = [10];
  for (let i = 0; i < steps; i++)
    x.push(x[i]! - gain * x[Math.max(0, i - delay)]!);
  return x;
}
/** Logical dependencies of a selected T-dependent response, not efficacy scores. */
export function immuneFrames(helper: boolean, cd8: boolean) {
  return Array.from({ length: 5 }, (_, step) => ({
    presented: step >= 1,
    helper: step >= 2 && helper,
    plasma: step >= 3 && helper,
    antibody: step >= 4 && helper,
    killing: step >= 4 && cd8,
  }));
}
export function alleleCounts(AA: number, Aa: number, aa: number) {
  [AA, Aa, aa].forEach(count);
  const N = AA + Aa + aa;
  if (!Number.isSafeInteger(2 * N))
    throw new RangeError('Population too large');
  const A = 2 * AA + Aa,
    a = 2 * aa + Aa;
  return {
    N,
    A,
    a,
    copies: 2 * N,
    p: N ? A / (2 * N) : null,
    q: N ? a / (2 * N) : null,
  };
}
export function hardyWeinberg(p: number) {
  fraction(p);
  return [p * p, 2 * p * (1 - p), (1 - p) ** 2];
}
/** Additive diploid fitness: AA=1+s, Aa=1+s/2, aa=1. */
export function selectedFrequency(p: number, s: number) {
  fraction(p);
  finite(s);
  if (s <= -1 || s > 1) throw new RangeError('Fitness bounds');
  const q = 1 - p;
  const AA = p * p * (1 + s),
    Aa = 2 * p * q * (1 + s / 2),
    aa = q * q;
  return (AA + Aa / 2) / (AA + Aa + aa);
}
export function migrate(p: number, N: number, source: number, M: number) {
  fraction(p);
  fraction(source);
  count(N);
  count(M);
  if (!N || !Number.isSafeInteger(N + M))
    throw new RangeError('Resident population required');
  return (N * p + M * source) / (N + M);
}
export function seededRandom(seed: number) {
  if (!Number.isSafeInteger(seed))
    throw new RangeError('Integer seed required');
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}
export type EvolutionOptions = {
  p: number;
  N: number;
  seed: number;
  generations?: number;
  selection?: number;
  drift?: boolean;
  migrants?: number;
  source?: number;
};
/** Per generation: selection -> pooled immigration -> optional 2N-copy sampling.
 * Fixed-size random-mating diploid offspring cohort. No mutation is modelled. */
export function evolutionFrames(o: EvolutionOptions) {
  fraction(o.p);
  fraction(o.source ?? 0.8);
  selectedFrequency(o.p, o.selection ?? 0);
  count(o.N);
  count(o.generations ?? 10);
  count(o.migrants ?? 0);
  if (!o.N || o.N > 10000 || (o.generations ?? 10) > 100)
    throw new RangeError('Model bounds');
  const random = seededRandom(o.seed),
    result = [o.p];
  for (let g = 0; g < (o.generations ?? 10); g++) {
    let p = selectedFrequency(result[g]!, o.selection ?? 0);
    p = migrate(p, o.N, o.source ?? 0.8, o.migrants ?? 0);
    if (o.drift) {
      let copies = 0;
      for (let j = 0; j < 2 * o.N; j++) if (random() < p) copies++;
      p = copies / (2 * o.N);
    }
    result.push(p);
  }
  return result;
}
export type Tree = string | readonly [Tree, Tree];
export const teachingTree: Tree = [
  ['A', 'B'],
  ['C', 'D'],
];
export function tips(tree: Tree): string[] {
  return typeof tree === 'string'
    ? [tree]
    : [...tips(tree[0]), ...tips(tree[1])];
}
export function rotateTree(tree: Tree): Tree {
  return typeof tree === 'string' ? tree : [tree[1], tree[0]];
}
export function clades(tree: Tree): string[] {
  if (typeof tree === 'string') return [];
  return [
    tips(tree).sort().join(''),
    ...clades(tree[0]),
    ...clades(tree[1]),
  ].sort();
}
export const traitData = {
  parallel: {
    A: [
      [9, 10, 11],
      [15, 16, 17],
    ],
    B: [
      [13, 14, 15],
      [19, 20, 21],
    ],
  },
  interaction: {
    A: [
      [9, 10, 11],
      [19, 20, 21],
    ],
    B: [
      [13, 14, 15],
      [15, 16, 17],
    ],
  },
} as const;
export function mean(values: readonly number[]) {
  if (!values.length) throw new RangeError('At least one observation required');
  values.forEach(finite);
  return values.reduce((a, b) => a + b, 0) / values.length;
}
