import { describe, it, expect } from 'vitest';
import {
  workshopModel,
  workshopMaximum,
  workshopComparison,
  workshopStep,
  workshopDependencies,
  boundaryAudit,
  witnessModel,
  checkProblemWitness,
  workshopSensitivity,
  type WorkshopStep,
  type WorkshopPlan,
} from './problemSolvingModels';
import { checkAnswer } from './model';
describe('H28 exact workshop and counterexample models', () => {
  it('derives minimal whole packets and keeps demand, stock, spares and cancellation distinct', () => {
    for (let n = 0; n <= 60; n++)
      for (const stock of [0, 4, 8, 60, 200])
        for (const q of [1, 3, 4, 10]) {
          const m = workshopModel({ n, stock, perPerson: q });
          const demand = n === 0 ? 0 : n * q + 5;
          expect(m.demand).toBe(demand);
          expect(m.supply).toBeGreaterThanOrEqual(demand);
          if (m.packets > 0)
            expect(stock + 8 * (m.packets - 1)).toBeLessThan(demand);
          expect(m.surplus).toBe(m.supply - demand);
          expect(m.cost).toBe(n === 0 ? 0 : 7 + 6 * m.packets);
        }
    expect(workshopModel()).toMatchObject({
      demand: 59,
      net: 55,
      packets: 7,
      supply: 60,
      surplus: 1,
      cost: 49,
      feasible: true,
    });
    expect(workshopModel({ stock: 60 })).toMatchObject({
      demand: 59,
      packets: 0,
      cost: 7,
    });
    expect(workshopModel({ n: 0 })).toMatchObject({
      demand: 0,
      packets: 0,
      cost: 0,
    });
  });
  it('matches the derived maximum against exhaustive whole attendance under thousands of independent constraints', () => {
    for (const plan of ['A', 'B'] as WorkshopPlan[])
      for (const stock of [0, 4, 8, 60])
        for (const perPerson of [1, 3, 4])
          for (const capacity of [0, 10, 20])
            for (let budget = 0; budget <= 80; budget++) {
              const allowed = Array.from(
                { length: capacity + 1 },
                (_, n) => n,
              ).filter((n) => {
                if (n === 0) return true;
                const packets = Math.ceil(
                  Math.max(0, n * perPerson + 5 - stock) / 8,
                );
                return (
                  (plan === 'A' ? 7 + 6 * packets : 19 + 4 * packets) <= budget
                );
              });
              expect(
                workshopMaximum({ plan, stock, perPerson, capacity, budget }),
              ).toBe(Math.max(...allowed));
            }
  });
  it('accepts all and only topological task sequences, including an independent capacity branch', () => {
    const keys = Object.keys(workshopDependencies) as WorkshopStep[];
    const permutations = (xs: WorkshopStep[]): WorkshopStep[][] =>
      xs.length
        ? xs.flatMap((x, i) =>
            permutations(xs.filter((_, j) => j !== i)).map((t) => [x, ...t]),
          )
        : [[]];
    let valid = 0;
    for (const seq of permutations(keys)) {
      const done: WorkshopStep[] = [];
      for (const step of seq) {
        if (!workshopStep(done, step).accepted) break;
        done.push(step);
      }
      if (done.length === 6) valid++;
    }
    expect(valid).toBe(5);
    expect(workshopStep([], 'decision').missing).toEqual(['cost', 'capacity']);
    expect(workshopStep(['capacity'], 'capacity').duplicate).toBe(true);
    expect(() => workshopStep(['cost'], 'decision')).toThrow();
  });
  it('translates the affine intersection back to every whole attendance including cancellation', () => {
    const m = workshopComparison(51);
    expect(m.ties).toEqual([0, 14, 15]);
    expect(m.aMaximum).toBe(18);
    expect(m.bMaximum).toBe(20);
    for (const r of m.rows) {
      if (r.n > 0) {
        expect(r.gap).toBe(12 - 2 * r.packets);
        expect(r.packets).toBe(Math.ceil((3 * r.n + 1) / 8));
      } else expect([r.a, r.b]).toEqual([0, 0]);
    }
  });
  it('exposes selected failures without turning selected passes into universal proofs', () => {
    expect(boundaryAudit('floor-packets', 4)).toMatchObject({
      candidate: 1,
      expected: 2,
      shortage: 5,
      valid: false,
    });
    expect(boundaryAudit('floor-packets', 5).valid).toBe(true);
    expect(boundaryAudit('keep-fee', 0)).toMatchObject({
      candidate: 7,
      expected: 0,
      valid: false,
    });
    expect(boundaryAudit('ignore-capacity', 21, 200)).toMatchObject({
      candidate: true,
      expected: false,
      valid: false,
    });
    for (let n = 0; n <= 60; n++)
      expect(boundaryAudit('derived-rule', n).valid).toBe(true);
  });
  it('checks arbitrary rational witnesses against independent algebraic defects and premise conditions', () => {
    for (let a = -12; a <= 12; a++)
      for (let b = -12; b <= 12; b++) {
        const pair = `(${a}/2,${b}/2)`;
        expect(checkProblemWitness(pair, 'square-sum')).toBe(a * b !== 0);
        expect(checkProblemWitness(pair, 'equal-perimeter')).toBe(
          a > 0 && a < 12 && b > 0 && b < 12 && (a - b) * (12 - a - b) !== 0,
        );
      }
    for (let x = -20; x <= 20; x++) {
      expect(checkProblemWitness(String(x), 'cancel-factor')).toBe(x === 0);
      expect(checkProblemWitness(String(x), 'finite-table')).toBe(
        x * (x - 1) * (x - 2) !== 0,
      );
    }
    for (let shift = 1; shift <= 6; shift++)
      for (let spacing = 1; spacing <= 4; spacing++)
        for (let x = -3; x <= 18; x++)
          expect(
            checkProblemWitness(String(x), 'finite-table', shift, spacing),
          ).toBe(
            (x - shift) * (x - shift - spacing) * (x - shift - 2 * spacing) !==
              0,
          );
    expect(witnessModel('square-sum', '（1/2，2）')).toMatchObject({
      left: '25/4',
      right: '17/4',
      valid: true,
    });
    expect(witnessModel('cancel-factor', '2')).toMatchObject({
      parsed: true,
      premise: false,
      valid: false,
    });
    expect(witnessModel('equal-perimeter', '(1,5)')).toMatchObject({
      premise: true,
      conclusion: true,
      valid: false,
    });
    for (const raw of ['NaN', 'Infinity', '1/0', '21', '1/101', 'x=3', ''])
      expect(checkProblemWitness(raw, 'finite-table')).toBe(false);
    expect(checkProblemWitness('-20', 'finite-table')).toBe(true);
    expect(
      checkAnswer('(2,3)', {
        kind: 'problem-witness',
        claim: 'square-sum',
        value: '(1,1)',
      }),
    ).toBe(true);
    expect(
      checkAnswer('7', {
        kind: 'problem-witness',
        claim: 'finite-table',
        value: '0',
        shift: 1,
        spacing: 3,
      }),
    ).toBe(false);
  });
  it('exhausts every declared stress scenario and keeps money independent of capacity', () => {
    const a = workshopSensitivity('A', 18, 20, 70),
      b = workshopSensitivity('B', 18, 20, 70);
    expect(a.scenarios).toHaveLength(6);
    expect([a.base.cost, a.worst, a.robust]).toEqual([49, 73, false]);
    expect([b.base.cost, b.worst, b.robust]).toEqual([47, 63, true]);
    for (const plan of ['A', 'B'] as WorkshopPlan[])
      for (const [lo, hi] of [
        [0, 0],
        [0, 20],
        [16, 20],
        [18, 22],
      ])
        for (const budget of [0, 49, 50, 63, 70, 200]) {
          const s = workshopSensitivity(plan, lo!, hi!, budget),
            costs: number[] = [];
          let all = true;
          for (let n = lo!; n <= hi!; n++)
            for (const q of [3, 4]) {
              const k = Math.ceil(Math.max(0, n * q + 1) / 8),
                c = n === 0 ? 0 : plan === 'A' ? 7 + 6 * k : 19 + 4 * k;
              costs.push(c);
              all = all && c <= budget && n <= 20;
            }
          expect(s.worst).toBe(Math.max(...costs));
          expect(s.robust).toBe(all);
        }
    expect(workshopSensitivity('B', 18, 22, 200).overCapacity).toBe(true);
    expect(
      workshopModel({ plan: 'B', n: 20, perPerson: 5, budget: 70 }).cost,
    ).toBe(71);
  });
  it('rejects malformed or unbounded model parameters explicitly', () => {
    for (const n of [-1, 0.5, 61, NaN, Infinity])
      expect(() => workshopModel({ n })).toThrow();
    expect(() => workshopModel({ stock: -1 })).toThrow();
    expect(() => workshopModel({ perPerson: 0 })).toThrow();
    expect(() => workshopComparison(-1)).toThrow();
    expect(() => workshopSensitivity('A', 20, 18, 50)).toThrow();
    expect(() => workshopSensitivity('A', 0, 31, 50)).toThrow();
  });
});
