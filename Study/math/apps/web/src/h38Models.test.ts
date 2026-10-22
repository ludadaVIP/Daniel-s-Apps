import { describe, it, expect } from 'vitest';
import {
  waterLedger,
  rainInflow,
  rainAudit,
  rainScenarios,
  captureAudit,
  capturePrediction,
  lowerBoundTrace,
  linearTrace,
  searchAudit,
  argumentAudit,
  projectAudit,
  tankCost,
  type Scenario,
} from './capstoneModels';
import { valueR } from './rationalModels';

// Independent oracle uses integer quarter-litres, not the rational ledger helpers.
function oracle(cap: number, inflows: number[], demand: number, initial = 0) {
  let storage = 4 * initial;
  const rows = inflows.map((inflow) => {
    const opening = storage,
      available = storage + 4 * inflow,
      spill = Math.max(0, available - 4 * cap),
      before = available - spill,
      supplied = Math.min(4 * demand, before);
    storage = before - supplied;
    return {
      opening: opening / 4,
      inflow,
      spill: spill / 4,
      supplied: supplied / 4,
      closing: storage / 4,
      deficit: demand - supplied / 4,
    };
  });
  return rows;
}
describe('H38 complete project mathematics and algorithm prerequisites', () => {
  it('derives collected litres from area, millimetres and exact capture fraction including zero', () => {
    expect(rainInflow(20, '3/4', 6)).toBe('90');
    expect(rainInflow(10, '3/4', 1)).toBe('15/2');
    expect(rainInflow(20, '0', 30)).toBe('0');
    expect(rainInflow(20, '1', 0)).toBe('0');
    for (const args of [
      [0, '3/4', 6],
      [101, '3/4', 6],
      [20, '-1/2', 6],
      [20, '5/4', 6],
      [20, '1/0', 6],
      [20, '3/4', -1],
      [20, '3/4', 1.5],
    ] as const)
      expect(() => rainInflow(args[0], args[1], args[2])).toThrow();
  });
  it('conserves water, enforces collection-before-use and checks all supported controls against a quarter-litre oracle', () => {
    for (const capacity of [0, 40, 60, 89, 90, 100, 120])
      for (const area of [10, 20, 30])
        for (const eta of ['0', '1/2', '3/4', '1'])
          for (const scenario of ['nominal', 'high-use', 'dry'] as Scenario[]) {
            const rain = rainScenarios[scenario].rain,
              demand = rainScenarios[scenario].demand,
              inflows = rain.map((r) => area * r * valueR(eta)),
              expected = oracle(capacity, inflows, demand),
              m = rainAudit(capacity, scenario, area, eta);
            m.rows.forEach((row, i) => {
              const q = expected[i]!;
              expect(valueR(row.opening)).toBe(q.opening);
              expect(valueR(row.inflow)).toBe(q.inflow);
              expect(valueR(row.overflow)).toBe(q.spill);
              expect(valueR(row.served)).toBe(q.supplied);
              expect(valueR(row.closing)).toBe(q.closing);
              expect(valueR(row.deficit)).toBe(q.deficit);
              expect(valueR(row.opening) + valueR(row.inflow)).toBe(
                valueR(row.overflow) + valueR(row.served) + valueR(row.closing),
              );
              expect(valueR(row.closing)).toBeGreaterThanOrEqual(0);
              expect(valueR(row.closing)).toBeLessThanOrEqual(capacity);
            });
            expect(m.meetsEveryDay).toBe(
              expected.every((r) => r.deficit === 0),
            );
          }
    expect(rainAudit(60).rows[0]).toMatchObject({
      inflow: '90',
      overflow: '30',
      closing: '30',
    });
    expect(rainAudit(60).deficit).toBe('30');
    expect(rainAudit(90).rows.map((r) => r.closing)).toEqual([
      '60',
      '30',
      '0',
      '60',
      '30',
    ]);
    expect(
      waterLedger(1, ['1/2', '3/4'], '1/4', '1/2').rows.map((r) => r.closing),
    ).toEqual(['3/4', '3/4']);
    expect(waterLedger(0, ['0'], '0').meetsEveryDay).toBe(true);
  });
  it('rejects impossible input states and bounded-domain violations rather than silently repairing them', () => {
    for (const c of [-1, 301, 1.5, NaN, Infinity])
      expect(() => waterLedger(c, ['0'], '30')).toThrow();
    for (const rows of [[], Array(11).fill('0'), ['-1'], ['1/0'], ['1001']])
      expect(() => waterLedger(90, rows, '30')).toThrow();
    expect(() => waterLedger(10, ['2'], '1', '11')).toThrow();
    expect(() => waterLedger(10, ['2'], '-1')).toThrow();
    expect(() => rainAudit(90, 'unknown' as Scenario)).toThrow();
  });
  it('preserves calibration and validation roles, signed residuals and the inclusive predeclared tolerance', () => {
    const line = captureAudit('proportional');
    expect(line.rows.slice(0, 4).map((r) => r.residual)).toEqual([0, 0, 0, 0]);
    expect(line.rows.slice(4).map((r) => r.residual)).toEqual([-15, -50]);
    expect(line.withinTolerance).toBe(false);
    expect(line.maxValidationError).toBe(50);
    const capped = captureAudit('capped');
    expect(capped.rows.slice(4).map((r) => r.residual)).toEqual([0, -5]);
    expect(capped.withinTolerance).toBe(true);
    expect(captureAudit('capped', 4).withinTolerance).toBe(false);
    expect(captureAudit('offset').zeroCompatible).toBe(false);
    expect(capturePrediction('offset', 0)).toBe(10);
    for (const r of [-1, 11, NaN, Infinity])
      expect(() => capturePrediction('proportional', r)).toThrow();
    expect(() => captureAudit('proportional', -1)).toThrow();
  });
  it('compares every monotone threshold independently, including all-true and no-solution cases, and measures actual calls', () => {
    for (let count = 1; count <= 64; count++) {
      let maximumCalls = 0;
      for (let first = 0; first <= count; first++) {
        let calls = 0;
        const binary = lowerBoundTrace(count, (i) => {
          calls++;
          return i >= first;
        });
        expect(binary.answer).toBe(first === count ? null : first);
        expect(calls).toBe(binary.evaluations);
        expect(binary.evaluations).toBeLessThanOrEqual(
          Math.ceil(Math.log2(count + 1)),
        );
        maximumCalls = Math.max(maximumCalls, calls);
        for (const row of binary.rows) {
          expect(row.mid).toBeGreaterThanOrEqual(row.lo);
          expect(row.mid).toBeLessThan(row.hi);
          expect(row.passes).toBe(row.mid >= first);
        }
        const linear = linearTrace(count, (i) => i >= first);
        expect(linear.answer).toBe(binary.answer);
        expect(linear.evaluations).toBe(Math.min(first + 1, count));
      }
      expect(maximumCalls).toBe(Math.ceil(Math.log2(count + 1)));
    }
    for (const n of [0, 302, 1.5, NaN])
      expect(() => lowerBoundTrace(n, () => true)).toThrow();
  });
  it('proves supply monotonicity over the actual capacity range and refuses budget-window binary search', () => {
    for (const maximum of [60, 100, 150, 200])
      for (const kind of ['water', 'impossible'] as const) {
        const m = searchAudit(kind, maximum),
          expected =
            Array.from({ length: maximum + 1 }, (_, c) => ({
              c,
              ok: oracle(
                c,
                kind === 'water' ? [90, 0, 0, 90, 0] : [90, 0, 0, 0, 90],
                30,
              ).every((r) => r.deficit === 0),
            })).find((r) => r.ok)?.c ?? null;
        expect(m.linear.answer).toBe(expected);
        expect(m.binary!.answer).toBe(expected);
      }
    const m = searchAudit('water');
    expect(m.binary!.rows.map((r) => r.mid)).toEqual([
      75, 113, 94, 85, 90, 88, 89,
    ]);
    expect(m.binary!.evaluations).toBe(7);
    expect(m.linear.evaluations).toBe(91);
    expect(m.worstBinary).toBe(8);
    const window = searchAudit('budget-window');
    expect(window.predicate(90)).toBe(true);
    expect(window.predicate(110)).toBe(false);
    expect(window.binary).toBeNull();
    for (const scenario of ['nominal', 'high-use', 'dry'] as Scenario[])
      for (let c = 0; c < 160; c++) {
        const a = rainAudit(c, scenario),
          b = rainAudit(c + 1, scenario);
        expect(valueR(b.deficit)).toBeLessThanOrEqual(valueR(a.deficit));
        a.rows.forEach((r, i) =>
          expect(valueR(b.rows[i]!.closing)).toBeGreaterThanOrEqual(
            valueR(r.closing),
          ),
        );
      }
  });
  it('requires necessity and sufficiency and distinguishes feasibility of 100 from minimality of 90', () => {
    expect(argumentAudit(89)).toMatchObject({
      necessary: 90,
      sufficient: false,
      minimal: false,
    });
    expect(argumentAudit(89).model.deficit).toBe('1');
    expect(argumentAudit(90)).toMatchObject({
      sufficient: true,
      minimal: true,
    });
    expect(argumentAudit(100)).toMatchObject({
      sufficient: true,
      minimal: false,
    });
    for (let c = 0; c < 90; c++)
      expect(oracle(c, [90, 0, 0, 90, 0], 30).some((r) => r.deficit > 0)).toBe(
        true,
      );
  });
  it('enumerates every catalog choice and all constraints independently, retaining empty sets and boundary budgets', () => {
    for (const scope of ['nominal', 'both', 'including-dry'] as const)
      for (const budget of [0, 200, 239, 240, 279, 280, 360, 1000]) {
        const scenarios =
            scope === 'nominal'
              ? [[90, 0, 0, 90, 0]]
              : scope === 'both'
                ? [
                    [90, 0, 0, 90, 0],
                    [120, 0, 0, 120, 0],
                  ]
                : [
                    [90, 0, 0, 90, 0],
                    [120, 0, 0, 120, 0],
                    [90, 0, 0, 0, 90],
                  ],
          demands = [30, 40, 30];
        const expected = Array.from({ length: 9 }, (_, i) => i * 20).filter(
            (c) =>
              40 + 2 * c <= budget &&
              scenarios.every((rows, j) =>
                oracle(c, rows, demands[j]!).every((r) => r.deficit === 0),
              ),
          ),
          m = projectAudit(scope, budget);
        expect(m.feasible).toEqual(expected);
        expect(m.best?.capacity ?? null).toBe(expected[0] ?? null);
      }
    expect(projectAudit('nominal', 240).feasible).toEqual([100]);
    expect(projectAudit('both', 240).feasible).toEqual([]);
    expect(projectAudit('both', 280).feasible).toEqual([120]);
    expect(projectAudit('including-dry', 1000).feasible).toEqual([]);
    expect(tankCost(0)).toBe(40);
    expect(() => projectAudit('nominal', -1)).toThrow();
    expect(() => projectAudit('nominal', 1001)).toThrow();
  });
});
