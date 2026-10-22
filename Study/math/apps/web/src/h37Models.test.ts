import { describe, it, expect } from 'vitest';
import {
  inductionAudit,
  recurrenceAudit,
  graphCase,
  shortestAudit,
  routeCost,
  checkGraphRoute,
  matrixApply,
  matrixProduct,
  matrixText,
  matrixDet,
  matrices,
  checkMatrix2,
  bisectionAudit,
  type GraphSpec,
  type GraphCase,
  type Matrix2,
} from './extensionModels';
import { valueR } from './rationalModels';
import { checkAnswer } from './model';

// Independent exhaustive simple-path oracle; no Dijkstra helpers or labels used.
function allPaths(g: GraphSpec) {
  const result: { path: string[]; cost: number }[] = [];
  const visit = (path: string[], cost: number) => {
    const u = path.at(-1)!;
    if (u === g.goal) {
      result.push({ path, cost });
      return;
    }
    for (const [a, b, w] of g.edges) {
      const v = a === u ? b : !g.directed && b === u ? a : null;
      if (v && !path.includes(v)) visit([...path, v], cost + w);
    }
  };
  visit([g.start], 0);
  return result;
}
describe('H37 mathematical contracts and exact graders', () => {
  it('separates a true base, arbitrary propagation and finitely checked examples', () => {
    for (let n = 1; n <= 12; n++) {
      const m = inductionAudit('odd', n);
      expect(m.sum).toBe(
        Array.from({ length: n }, (_, j) => 2 * j + 1).reduce(
          (a, b) => a + b,
          0,
        ),
      );
      expect(m.sum + m.next).toBe((n + 1) * (n + 1));
      expect(m.provesAll).toBe(true);
      expect(inductionAudit('missing-base', n)).toMatchObject({
        base: false,
        step: true,
        provesAll: false,
        claimed: n * n + 1,
        firstFailure: 1,
      });
      expect(inductionAudit('broken-step', n)).toMatchObject({
        base: true,
        step: false,
        provesAll: false,
        firstFailure: 2,
      });
      expect(inductionAudit('finite', n)).toMatchObject({
        base: true,
        step: false,
        provesAll: false,
      });
    }
    for (const n of [0, 13, 1.5, NaN, Infinity])
      expect(() => inductionAudit('odd', n)).toThrow();
  });
  it('checks affine recurrences against closed sums including p=0,1,-1 and sufficient second seeds', () => {
    for (const seed of [-2, 0, 1, 3])
      for (const p of [-1, 0, 1, 2])
        for (const q of [-1, 0, 1, 2])
          for (let n = 0; n <= 12; n++) {
            const expected =
              p ** n * seed +
              q *
                Array.from({ length: n }, (_, j) => p ** j).reduce(
                  (a, b) => a + b,
                  0,
                );
            expect(recurrenceAudit('affine', n, seed, p, q).value).toBe(
              String(expected),
            );
          }
    const fib = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
    fib.forEach((v, n) =>
      expect(recurrenceAudit('fibonacci', n).value).toBe(String(v)),
    );
    expect(recurrenceAudit('missing-seed', 4).value).toBeNull();
    expect(recurrenceAudit('missing-seed', 0).value).toBe('0');
    expect(recurrenceAudit('affine', 0).rows).toEqual([['0', '1']]);
    for (const n of [-1, 13, 0.5, Infinity])
      expect(() => recurrenceAudit('affine', n)).toThrow();
    expect(() => recurrenceAudit('affine', 4, 11)).toThrow();
    expect(() => recurrenceAudit('affine', 4, 1, 4)).toThrow();
  });
  it('verifies all graph cases, ties, zero edges and directed routes by exhaustive paths', () => {
    for (const kind of [
      'standard',
      'trap',
      'ties',
      'disconnected',
      'directed',
      'zero',
    ] as GraphCase[]) {
      const g = graphCase(kind),
        paths = allPaths(g),
        minimum = paths.length ? Math.min(...paths.map((p) => p.cost)) : null;
      expect(shortestAudit(g).distance).toBe(minimum);
      for (const p of paths) {
        expect(routeCost(g, p.path)).toBe(p.cost);
        expect(checkGraphRoute(p.path.join('-'), g)).toBe(p.cost === minimum);
      }
      expect(checkGraphRoute('unreachable', g)).toBe(minimum === null);
      for (const raw of [
        'A-E-F',
        'A-B-A-C-E',
        '∞',
        '6',
        'A--B-E',
        'ABCE',
        'A-B-E extra',
        'A-C-D-E;A-B-E',
      ])
        expect(checkGraphRoute(raw, g)).toBe(false);
    }
    expect(checkGraphRoute('a → b → e', graphCase('ties'))).toBe(true);
    expect(checkGraphRoute('A->C->E', graphCase('ties'))).toBe(true);
    expect(checkGraphRoute('A-B-E', graphCase('trap'))).toBe(false);
    expect(checkGraphRoute('A-B-E', graphCase('directed'))).toBe(false);
    expect(checkGraphRoute('A-B-C-E', graphCase('zero'))).toBe(true);
    const same = { ...graphCase('standard'), start: 'A', goal: 'A' };
    expect(checkGraphRoute('A', same)).toBe(true);
  });
  it('audits changing nonnegative weights independently and rejects invalid graph assumptions', () => {
    for (let a = 0; a <= 5; a++)
      for (let b = 0; b <= 3; b++) {
        const g: GraphSpec = {
          nodes: ['A', 'B', 'C', 'D', 'E'],
          edges: [
            ['A', 'B', a],
            ['B', 'E', b + 1],
            ['A', 'C', b],
            ['C', 'D', a],
            ['D', 'E', 2],
            ['B', 'C', 1],
          ],
          directed: (a + b) % 2 === 0,
          start: 'A',
          goal: 'E',
        };
        expect(shortestAudit(g).distance).toBe(
          Math.min(...allPaths(g).map((p) => p.cost)),
        );
        const distances = shortestAudit(g).rows.map((r) => r.distance);
        expect(distances).toEqual([...distances].sort((x, y) => x - y));
      }
    const g = graphCase('standard');
    for (const bad of [
      { ...g, edges: [['A', 'B', -1]] },
      { ...g, edges: [['A', 'B', 0.5]] },
      { ...g, edges: [['A', 'A', 1]] },
      { ...g, edges: [['A', 'F', 1]] },
      { ...g, nodes: ['A', 'A', 'E'] },
      {
        ...g,
        edges: [
          ['A', 'B', 1],
          ['B', 'A', 2],
        ],
      },
    ] as GraphSpec[]) {
      expect(() => shortestAudit(bad)).toThrow();
      expect(checkGraphRoute('A-B-E', bad)).toBe(false);
    }
  });
  it('derives matrix products from sequential actions and recognises collapse and noncommutation', () => {
    const values = Object.values(matrices) as Matrix2[];
    for (const a of values)
      for (const b of values)
        for (const p of [
          ['1', '2'],
          ['-2', '3'],
          ['0', '0'],
          ['1/2', '-3/4'],
        ] as const) {
          const nums = p.map(valueR),
            aa = a.map(valueR),
            bb = b.map(valueR),
            first = [
              bb[0]! * nums[0]! + bb[1]! * nums[1]!,
              bb[2]! * nums[0]! + bb[3]! * nums[1]!,
            ];
          const expected = [
            aa[0]! * first[0]! + aa[1]! * first[1]!,
            aa[2]! * first[0]! + aa[3]! * first[1]!,
          ];
          expect(matrixApply(matrixProduct(a, b), p).map(valueR)).toEqual(
            expected.map((x) => (x === 0 ? 0 : x)),
          );
        }
    expect(matrixText(matrixProduct(matrices.stretch, matrices.rotate))).toBe(
      '[0,-2;1,0]',
    );
    expect(matrixText(matrixProduct(matrices.rotate, matrices.stretch))).toBe(
      '[0,-1;2,0]',
    );
    expect(matrixApply(matrices.collapse, ['3', '5'])).toEqual(
      matrixApply(matrices.collapse, ['3', '-2']),
    );
    expect(matrixDet(matrices.collapse)).toBe('0');
    expect(matrixDet(matrices.rotate)).toBe('1');
  });
  it('grades rational matrix entries and all shortest alternatives without evaluating code', () => {
    for (const raw of ['[0,-2;1,0]', '[0/2,-4/2;2/2,0]', '[0,-2.00;1.0,0]'])
      expect(checkAnswer(raw, { kind: 'matrix2', value: '[0,-2;1,0]' })).toBe(
        true,
      );
    for (const raw of [
      '[0,1;-2,0]',
      '[0,-2;1]',
      '[0,-2;1,0,0]',
      '[0,-2;1,0];extra',
      '[0,-2;1,0/0]',
      '[0,-2;1,NaN]',
      '[0,-2;1,sqrt(0)]',
      '[0,-2;1,alert(0)]',
    ])
      expect(checkMatrix2(raw, '[0,-2;1,0]')).toBe(false);
    expect(checkMatrix2('[0,-2;1,0]', 'oops')).toBe(false);
    expect(
      checkAnswer('A-C-E', {
        kind: 'graph-route',
        value: 'A-B-E',
        graph: graphCase('ties'),
      }),
    ).toBe(true);
  });
  it('proves bisection enclosures and midpoint bounds independently with exact sign checks', () => {
    for (const kind of ['sqrt2', 'sqrt3'] as const)
      for (let n = 0; n <= 12; n++) {
        const m = bisectionAudit(kind, n),
          lo = valueR(m.lo),
          hi = valueR(m.hi),
          mid = valueR(m.mid),
          err = valueR(m.error),
          root = Math.sqrt(kind === 'sqrt2' ? 2 : 3);
        expect(m.status).toBe('bracket');
        expect(lo).toBeLessThan(root);
        expect(hi).toBeGreaterThan(root);
        expect(lo * lo).toBeLessThan(m.c);
        expect(hi * hi).toBeGreaterThan(m.c);
        expect(hi - lo).toBe(1 / 2 ** n);
        expect(mid).toBe((lo + hi) / 2);
        expect(err).toBe(1 / 2 ** (n + 1));
        expect(Math.abs(mid - root)).toBeLessThanOrEqual(err);
        m.rows.forEach((r) =>
          expect(Math.sign(valueR(r.mid) ** 2 - m.c)).toBe(r.sign),
        );
      }
    expect(bisectionAudit('sqrt2', 3)).toMatchObject({
      lo: '11/8',
      hi: '3/2',
      mid: '23/16',
      error: '1/16',
    });
    expect(bisectionAudit('sqrt2', 3).rows.at(-1)?.mid).toBe('11/8');
    expect(bisectionAudit('exact', 8)).toMatchObject({
      status: 'exact',
      mid: '2',
      error: '0',
      halvings: 1,
    });
    expect(bisectionAudit('endpoint', 8)).toMatchObject({
      status: 'exact',
      mid: '2',
      error: '0',
      halvings: 0,
    });
    expect(bisectionAudit('same-sign', 3).status).toBe('invalid-sign');
    expect(bisectionAudit('even-root', 3).status).toBe('invalid-sign');
    expect(bisectionAudit('discontinuous', 3)).toMatchObject({
      status: 'invalid-continuity',
      rows: [],
    });
    for (const n of [-1, 13, 0.5, NaN, Infinity])
      expect(() => bisectionAudit('sqrt2', n)).toThrow();
  });
});
