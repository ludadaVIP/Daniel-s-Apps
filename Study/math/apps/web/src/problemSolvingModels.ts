import {
  rational,
  addR,
  mulR,
  negR,
  sameR,
  textR,
  type Rational,
} from './algebraModels';
import { readRational } from './rationalModels';
import { readCoordinate } from './cartesianModels';
export type WorkshopPlan = 'A' | 'B';
export const workshopPlans = {
  A: { fee: 7, packetPrice: 6 },
  B: { fee: 19, packetPrice: 4 },
} as const;
export type WorkshopParams = {
  n: number;
  stock: number;
  perPerson: number;
  reserve: number;
  budget: number;
  capacity: number;
  plan: WorkshopPlan;
};
export const defaultWorkshop: WorkshopParams = {
  n: 18,
  stock: 4,
  perPerson: 3,
  reserve: 5,
  budget: 50,
  capacity: 20,
  plan: 'A',
};
const whole = (n: number, lo: number, hi: number) => {
  if (!Number.isSafeInteger(n) || n < lo || n > hi)
    throw new RangeError('Bounded whole workshop quantity');
  return n;
};
function parameters(p: WorkshopParams) {
  whole(p.n, 0, 60);
  whole(p.stock, 0, 200);
  whole(p.perPerson, 1, 10);
  whole(p.reserve, 0, 20);
  whole(p.budget, 0, 1000);
  whole(p.capacity, 0, 60);
  if (!['A', 'B'].includes(p.plan))
    throw new RangeError('Known fictional plan');
  return p;
}
export function workshopModel(change: Partial<WorkshopParams> = {}) {
  const p = parameters({ ...defaultWorkshop, ...change }),
    cancelled = p.n === 0,
    demand = cancelled ? 0 : p.n * p.perPerson + p.reserve,
    net = Math.max(0, demand - p.stock),
    packets = Math.ceil(net / 8),
    bought = 8 * packets,
    supply = p.stock + bought,
    cost = cancelled
      ? 0
      : workshopPlans[p.plan].fee + workshopPlans[p.plan].packetPrice * packets;
  return {
    ...p,
    cancelled,
    demand,
    net,
    packets,
    bought,
    supply,
    surplus: supply - demand,
    cost,
    withinBudget: cost <= p.budget,
    withinCapacity: p.n <= p.capacity,
    feasible: cost <= p.budget && p.n <= p.capacity,
  };
}
export function workshopMaximum(
  change: Partial<Omit<WorkshopParams, 'n'>> = {},
) {
  const p = workshopModel({ ...change, n: 0 }),
    rule = workshopPlans[p.plan];
  if (p.budget < rule.fee) return 0;
  const k = Math.floor((p.budget - rule.fee) / rule.packetPrice),
    bound = Math.floor((p.stock + 8 * k - p.reserve) / p.perPerson);
  return Math.max(0, Math.min(p.capacity, bound));
}
export function workshopComparison(budget = 50) {
  whole(budget, 0, 1000);
  const rows = Array.from({ length: 21 }, (_, n) => {
    const a = workshopModel({ n, plan: 'A', budget }),
      b = workshopModel({ n, plan: 'B', budget });
    return {
      n,
      packets: a.packets,
      a: a.cost,
      b: b.cost,
      gap: b.cost - a.cost,
      cheaper: a.cost === b.cost ? 'tie' : a.cost < b.cost ? 'A' : 'B',
      aFeasible: a.feasible,
      bFeasible: b.feasible,
    };
  });
  return {
    rows,
    ties: rows.filter((r) => r.a === r.b).map((r) => r.n),
    aMaximum: workshopMaximum({ plan: 'A', budget }),
    bMaximum: workshopMaximum({ plan: 'B', budget }),
  };
}
export const workshopDependencies = {
  demand: [],
  net: ['demand'],
  packets: ['net'],
  cost: ['packets'],
  capacity: [],
  decision: ['cost', 'capacity'],
} as const;
export type WorkshopStep = keyof typeof workshopDependencies;
export function workshopStep(done: WorkshopStep[], step: WorkshopStep) {
  const seen = new Set<WorkshopStep>();
  for (const s of done) {
    if (
      !(s in workshopDependencies) ||
      seen.has(s) ||
      workshopDependencies[s].some((x) => !seen.has(x))
    )
      throw new RangeError('Valid dependency prefix');
    seen.add(s);
  }
  if (!(step in workshopDependencies)) throw new RangeError('Known task');
  const missing = workshopDependencies[step].filter((s) => !seen.has(s));
  return {
    accepted: !seen.has(step) && missing.length === 0,
    missing,
    duplicate: seen.has(step),
  };
}
export type BoundaryRule =
  'floor-packets' | 'keep-fee' | 'ignore-capacity' | 'derived-rule';
export function boundaryAudit(rule: BoundaryRule, n: number, budget = 50) {
  if (
    !['floor-packets', 'keep-fee', 'ignore-capacity', 'derived-rule'].includes(
      rule,
    )
  )
    throw new RangeError('Known candidate rule');
  const correct = workshopModel({ n, budget }),
    floorPackets = Math.floor(correct.net / 8),
    shortage = Math.max(0, correct.demand - correct.stock - 8 * floorPackets);
  const candidate =
    rule === 'floor-packets'
      ? floorPackets
      : rule === 'keep-fee'
        ? 7 + 6 * correct.packets
        : rule === 'ignore-capacity'
          ? correct.withinBudget
          : correct.cost;
  const expected =
    rule === 'floor-packets'
      ? correct.packets
      : rule === 'keep-fee'
        ? correct.cost
        : rule === 'ignore-capacity'
          ? correct.feasible
          : correct.cost;
  return {
    rule,
    correct,
    candidate,
    expected,
    valid: candidate === expected,
    shortage: rule === 'floor-packets' ? shortage : 0,
  };
}
export type WitnessClaim =
  'square-sum' | 'cancel-factor' | 'finite-table' | 'equal-perimeter';
export const witnessClaims: WitnessClaim[] = [
  'square-sum',
  'cancel-factor',
  'finite-table',
  'equal-perimeter',
];
function boundedWitness(r: Rational) {
  if ((r[0] < 0n ? -r[0] : r[0]) > 20n * r[1] || r[1] > 100n)
    throw new RangeError(
      'Use rational components of magnitude at most twenty, denominator at most one hundred',
    );
  return r;
}
export function witnessModel(
  claim: WitnessClaim,
  raw: string,
  shift = 0,
  spacing = 1,
) {
  if (!witnessClaims.includes(claim))
    throw new RangeError('Known counterexample claim');
  const failed = {
    parsed: false,
    premise: false,
    conclusion: null,
    left: null,
    right: null,
    valid: false,
  } as const;
  try {
    if (claim === 'finite-table') {
      whole(shift, -10, 10);
      whole(spacing, 1, 5);
    }
    let premise = true,
      left: Rational,
      right: Rational;
    if (claim === 'square-sum' || claim === 'equal-perimeter') {
      const pair = readCoordinate(raw);
      if (!pair) return failed;
      const [a, b] = pair.map(boundedWitness) as [Rational, Rational];
      if (claim === 'square-sum') {
        left = mulR(addR(a, b), addR(a, b));
        right = addR(mulR(a, a), mulR(b, b));
      } else {
        premise =
          a[0] > 0n && a[0] < 6n * a[1] && b[0] > 0n && b[0] < 6n * b[1];
        left = mulR(a, addR(rational(6n), negR(a)));
        right = mulR(b, addR(rational(6n), negR(b)));
      }
    } else {
      const x = boundedWitness(readRational(raw));
      if (claim === 'cancel-factor') {
        premise = sameR(mulR(x, x), x);
        left = x;
        right = rational(1n);
      } else {
        left = addR(
          x,
          mulR(
            addR(x, rational(BigInt(-shift))),
            mulR(
              addR(x, rational(BigInt(-shift - spacing))),
              addR(x, rational(BigInt(-shift - 2 * spacing))),
            ),
          ),
        );
        right = x;
      }
    }
    const conclusion = sameR(left, right);
    return {
      parsed: true,
      premise,
      conclusion,
      left: textR(left),
      right: textR(right),
      valid: premise && !conclusion,
    };
  } catch {
    return failed;
  }
}
export const checkProblemWitness = (
  raw: string,
  claim: WitnessClaim,
  shift = 0,
  spacing = 1,
) => witnessModel(claim, raw, shift, spacing).valid;
export function workshopSensitivity(
  plan: WorkshopPlan,
  low: number,
  high: number,
  budget: number,
) {
  whole(low, 0, 30);
  whole(high, 0, 30);
  if (low > high) throw new RangeError('Ordered attendance assumptions');
  const scenarios = Array.from({ length: high - low + 1 }, (_, i) =>
      [3, 4].map((perPerson) =>
        workshopModel({ plan, n: low + i, perPerson, budget }),
      ),
    ).flat(),
    base = workshopModel({ plan, n: low, perPerson: 3, budget }),
    worst = Math.max(...scenarios.map((s) => s.cost)),
    robust = scenarios.every((s) => s.feasible);
  return {
    plan,
    low,
    high,
    budget,
    scenarios,
    base,
    worst,
    robust,
    overCapacity: scenarios.some((s) => !s.withinCapacity),
    failures: scenarios.filter((s) => !s.feasible),
  };
}
