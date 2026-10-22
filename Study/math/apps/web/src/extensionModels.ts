import {
  addR,
  mulR,
  divR,
  negR,
  rational,
  sameR,
  textR,
  type Rational,
} from './algebraModels';
import { readRational } from './rationalModels';

const bounded = (n: number, lo: number, hi: number) => {
  if (!Number.isSafeInteger(n) || n < lo || n > hi)
    throw new RangeError(`Integer in [${lo},${hi}] required`);
};
export type InductionCase = 'odd' | 'missing-base' | 'broken-step' | 'finite';
export function inductionAudit(kind: InductionCase, n: number) {
  bounded(n, 1, 12);
  const values = Array.from({ length: n }, (_, i) => 2 * i + 1);
  const sum = values.reduce((a, b) => a + b, 0);
  return {
    n,
    values,
    sum,
    square: n * n,
    next: 2 * n + 1,
    nextSquare: (n + 1) ** 2,
    base: kind !== 'missing-base',
    step: kind === 'odd' || kind === 'missing-base',
    provesAll: kind === 'odd',
    // n²+1 has an algebraically valid propagation but a false base.
    claimed:
      kind === 'missing-base' ? n * n + 1 : kind === 'broken-step' ? n : n * n,
    firstFailure:
      kind === 'missing-base' ? 1 : kind === 'broken-step' ? 2 : null,
  };
}
export type RecurrenceCase = 'affine' | 'fibonacci' | 'missing-seed';
export function recurrenceAudit(
  kind: RecurrenceCase,
  n: number,
  seed = 1,
  multiplier = 2,
  addition = 1,
) {
  bounded(n, 0, 12);
  bounded(seed, -10, 10);
  bounded(multiplier, -3, 3);
  bounded(addition, -5, 5);
  if (kind === 'missing-seed')
    return {
      value: n === 0 ? '0' : null,
      rows: [
        ['0', '0'],
        ['1', '?'],
      ],
      rule: 'u(n+2)=u(n+1)+u(n); u(0)=0; u(1)=?',
    };
  const values: bigint[] = [BigInt(kind === 'fibonacci' ? 0 : seed)];
  if (kind === 'fibonacci') values.push(1n);
  for (let i = values.length; i <= n; i++)
    values.push(
      kind === 'fibonacci'
        ? values[i - 1]! + values[i - 2]!
        : BigInt(multiplier) * values[i - 1]! + BigInt(addition),
    );
  return {
    value: String(values[n]!),
    rows: values.slice(0, n + 1).map((v, i) => [String(i), String(v)]),
    rule:
      kind === 'fibonacci'
        ? 'u(n+2)=u(n+1)+u(n); u(0)=0; u(1)=1'
        : `u(n+1)=${multiplier}u(n)+(${addition}); u(0)=${seed}`,
  };
}
export type GraphSpec = {
  nodes: string[];
  edges: [string, string, number][];
  directed: boolean;
  start: string;
  goal: string;
};
export function validateGraph(g: GraphSpec) {
  if (
    g.nodes.length < 1 ||
    g.nodes.length > 6 ||
    new Set(g.nodes).size !== g.nodes.length ||
    g.nodes.some((n) => !/^[A-F]$/.test(n)) ||
    !g.nodes.includes(g.start) ||
    !g.nodes.includes(g.goal) ||
    g.edges.length > 30
  )
    throw new RangeError('A–F graph with one to six distinct nodes');
  const seen = new Set<string>();
  for (const [a, b, w] of g.edges) {
    bounded(w, 0, 100);
    const key = g.directed ? `${a}${b}` : [a, b].sort().join('');
    if (
      a === b ||
      !g.nodes.includes(a) ||
      !g.nodes.includes(b) ||
      seen.has(key)
    )
      throw new RangeError('Distinct valid non-loop edges');
    seen.add(key);
  }
}
export const neighbours = (g: GraphSpec, n: string): [string, number][] =>
  g.edges.flatMap(([a, b, w]) =>
    a === n
      ? [[b, w] as [string, number]]
      : !g.directed && b === n
        ? [[a, w] as [string, number]]
        : [],
  );
export function shortestAudit(g: GraphSpec) {
  validateGraph(g);
  const distances: Record<string, number> = Object.fromEntries(
    g.nodes.map((n) => [n, Infinity]),
  );
  distances[g.start] = 0;
  const settled = new Set<string>();
  const rows: {
    node: string;
    distance: number;
    labels: Record<string, number>;
  }[] = [];
  while (settled.size < g.nodes.length) {
    const u = g.nodes
      .filter((n) => !settled.has(n))
      .sort((a, b) => distances[a]! - distances[b]! || a.localeCompare(b))[0]!;
    if (!Number.isFinite(distances[u])) break;
    settled.add(u);
    for (const [v, w] of neighbours(g, u))
      if (!settled.has(v))
        distances[v] = Math.min(distances[v]!, distances[u]! + w);
    rows.push({ node: u, distance: distances[u]!, labels: { ...distances } });
  }
  return {
    distance: Number.isFinite(distances[g.goal]) ? distances[g.goal]! : null,
    distances,
    rows,
  };
}
export function routeCost(g: GraphSpec, route: string[]) {
  validateGraph(g);
  if (
    !route.length ||
    route.length > 6 ||
    route[0] !== g.start ||
    route.at(-1) !== g.goal ||
    new Set(route).size !== route.length ||
    route.some((n) => !g.nodes.includes(n))
  )
    return null;
  let total = 0;
  for (let i = 1; i < route.length; i++) {
    const edge = neighbours(g, route[i - 1]!).find(([n]) => n === route[i]);
    if (!edge) return null;
    total += edge[1];
  }
  return total;
}
export function checkGraphRoute(raw: string, g: GraphSpec) {
  try {
    const distance = shortestAudit(g).distance;
    const clean = raw.trim().toUpperCase();
    if (distance === null)
      return ['UNREACHABLE', '不可达', '无路径'].includes(clean);
    if (clean.length > 40 || !/^[A-F](?:\s*(?:-|→|->|,)\s*[A-F])*$/.test(clean))
      return false;
    const route = clean.split(/\s*(?:->|-|→|,)\s*/);
    return routeCost(g, route) === distance;
  } catch {
    return false;
  }
}
export type GraphCase =
  'standard' | 'trap' | 'ties' | 'disconnected' | 'directed' | 'zero';
export function graphCase(kind: GraphCase): GraphSpec {
  const edges: Record<GraphCase, [string, string, number][]> = {
    standard: [
      ['A', 'B', 2],
      ['A', 'C', 5],
      ['B', 'C', 1],
      ['B', 'D', 5],
      ['C', 'D', 1],
      ['D', 'E', 2],
      ['C', 'E', 7],
    ],
    trap: [
      ['A', 'B', 1],
      ['A', 'C', 3],
      ['B', 'E', 9],
      ['C', 'D', 1],
      ['D', 'E', 1],
    ],
    ties: [
      ['A', 'B', 2],
      ['B', 'E', 3],
      ['A', 'C', 1],
      ['C', 'E', 4],
    ],
    disconnected: [
      ['A', 'B', 2],
      ['B', 'C', 1],
      ['C', 'D', 1],
    ],
    directed: [
      ['B', 'A', 1],
      ['A', 'C', 3],
      ['C', 'D', 1],
      ['D', 'E', 1],
      ['E', 'B', 1],
    ],
    zero: [
      ['A', 'B', 0],
      ['B', 'C', 0],
      ['C', 'E', 2],
      ['A', 'E', 2],
    ],
  };
  return {
    nodes: ['A', 'B', 'C', 'D', 'E'],
    edges: edges[kind].map((e) => [...e]),
    directed: kind === 'directed',
    start: 'A',
    goal: 'E',
  };
}
export type Matrix2 = readonly [string, string, string, string];
function readMatrix(raw: string): Rational[] | null {
  if (raw.length > 180) return null;
  const m = raw
    .trim()
    .match(
      /^\[\s*([^;,[\]]+)\s*,\s*([^;,[\]]+)\s*;\s*([^;,[\]]+)\s*,\s*([^;,[\]]+)\s*\]$/,
    );
  if (!m) return null;
  try {
    return m.slice(1).map((s) => readRational(s.trim()));
  } catch {
    return null;
  }
}
export const matrixText = (m: Matrix2) => `[${m[0]},${m[1]};${m[2]},${m[3]}]`;
export function checkMatrix2(raw: string, expected: string) {
  const a = readMatrix(raw),
    b = readMatrix(expected);
  return !!a && !!b && a.every((r, i) => sameR(r, b[i]!));
}
export function matrixApply(
  m: Matrix2,
  p: readonly [string, string],
): [string, string] {
  const a = m.map((s) => readRational(s)),
    v = p.map((s) => readRational(s));
  return [
    textR(addR(mulR(a[0]!, v[0]!), mulR(a[1]!, v[1]!))),
    textR(addR(mulR(a[2]!, v[0]!), mulR(a[3]!, v[1]!))),
  ];
}
export function matrixProduct(a: Matrix2, b: Matrix2): Matrix2 {
  const c1 = matrixApply(a, [b[0], b[2]]),
    c2 = matrixApply(a, [b[1], b[3]]);
  return [c1[0], c2[0], c1[1], c2[1]];
}
export const matrixDet = (m: Matrix2) =>
  textR(
    addR(
      mulR(readRational(m[0]), readRational(m[3])),
      negR(mulR(readRational(m[1]), readRational(m[2]))),
    ),
  );
export const matrices = {
  stretch: ['2', '0', '0', '1'],
  rotate: ['0', '-1', '1', '0'],
  shear: ['1', '1', '0', '1'],
  collapse: ['1', '0', '0', '0'],
  zero: ['0', '0', '0', '0'],
  identity: ['1', '0', '0', '1'],
} as const satisfies Record<string, Matrix2>;
export type NumericalCase =
  | 'sqrt2'
  | 'sqrt3'
  | 'exact'
  | 'endpoint'
  | 'same-sign'
  | 'discontinuous'
  | 'even-root';
export function bisectionAudit(kind: NumericalCase, steps: number) {
  bounded(steps, 0, 12);
  const c =
    kind === 'sqrt3'
      ? 3
      : kind === 'exact' || kind === 'endpoint'
        ? 4
        : kind === 'even-root'
          ? 0
          : 2;
  let lo = rational(
      kind === 'discontinuous' || kind === 'even-root'
        ? -1n
        : kind === 'same-sign' || kind === 'endpoint'
          ? 2n
          : 1n,
    ),
    hi = rational(
      kind === 'exact' || kind === 'endpoint' || kind === 'same-sign'
        ? 3n
        : kind === 'discontinuous' || kind === 'even-root'
          ? 1n
          : 2n,
    );
  const f = (x: Rational) => addR(mulR(x, x), rational(BigInt(-c)));
  const rows: {
    step: number;
    lo: string;
    hi: string;
    mid: string;
    sign: number;
  }[] = [];
  const result = (
    status: 'bracket' | 'exact' | 'invalid-sign' | 'invalid-continuity',
    halvings: number,
  ) => {
    const mid = divR(addR(lo, hi), rational(2n)),
      error = divR(addR(hi, negR(lo)), rational(2n));
    return {
      status,
      lo: textR(lo),
      hi: textR(hi),
      mid: textR(mid),
      error: textR(error),
      halvings,
      rows,
      c,
    };
  };
  if (kind === 'discontinuous') return result('invalid-continuity', 0);
  if (f(lo)[0] === 0n) {
    hi = lo;
    return result('exact', 0);
  }
  if (f(hi)[0] === 0n) {
    lo = hi;
    return result('exact', 0);
  }
  if (f(lo)[0] > 0n === f(hi)[0] > 0n) return result('invalid-sign', 0);
  for (let i = 0; i < steps; i++) {
    const mid = divR(addR(lo, hi), rational(2n)),
      fm = f(mid),
      sign = fm[0] > 0n ? 1 : fm[0] < 0n ? -1 : 0;
    rows.push({
      step: i + 1,
      lo: textR(lo),
      hi: textR(hi),
      mid: textR(mid),
      sign,
    });
    if (!sign) {
      lo = mid;
      hi = mid;
      return result('exact', i + 1);
    }
    if (fm[0] > 0n === f(lo)[0] > 0n) lo = mid;
    else hi = mid;
  }
  return result('bracket', steps);
}
