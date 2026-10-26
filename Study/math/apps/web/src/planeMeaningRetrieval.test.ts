import { describe, it, expect } from 'vitest';
import { planeMeaningRetrieval } from './content/planeMeaningRetrieval';
import { geometryGraphRetrieval } from './content/geometryGraphRetrieval';
import { geometryGraphRecurrence } from './content/geometryGraphRecurrence';
import { maintenanceSets } from './content/maintenance';
import { lessons, curriculum } from './content';
import { checkAnswer } from './model';
import { parseLinearEquation } from './linearModels';
import { solveAlgebra, textR } from './algebraModels';
import {
  intersectionAngles,
  triangleAngles,
  triangleSides,
  thirdSideInterval,
  transversalAngles,
  turnPoint,
} from './planeModels';
const sets = Object.values(planeMeaningRetrieval);
const raw = (i: number, q: number, r = 0) =>
  sets[i]!.questions[q - 1]!.contextTable!.rows[r]![2]!.en;
const nums = (s: string) => s.match(/\d+(?:\.\d+)?/g)!.map(Number);
describe('J74 specific angle objects and real/integer triangle domains', () => {
  it('preserves seventeen original references and shares one new angle card between two source lessons', () => {
    const e = geometryGraphRecurrence.filter((e) =>
      e.sourceLesson.startsWith('J74-'),
    );
    expect(e.flatMap((e) => e.targets)).toHaveLength(25);
    expect(new Set(e.flatMap((e) => e.targets)).size).toBe(17);
    expect(
      e.flatMap((e) => e.targets.filter((t) => !t.includes('PLANE-MEANING'))),
    ).toHaveLength(17);
    for (const [i, entry] of e.entries())
      for (const s of sets) {
        const n = [1, 2, 0, 2, 3, 0][i]!;
        if (n) expect(entry.targets).toContain(s.questions[n - 1]!.id);
        else
          expect(entry.targets.some((t) => t.includes('PLANE-MEANING'))).toBe(
            false,
          );
      }
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const s of sets) {
      expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('J74'));
      expect(Object.values(maintenanceSets).find((m) => m.id === s.id)).toBe(s);
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual([
        'J74-L01',
        'J74-L02',
        'J74-L05',
      ]);
      for (const q of s.questions)
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
    }
    expect(lessons).toHaveLength(358);
  });
  it('reconstructs interior partitions and an outside-ray counterexample from different raw conditions', () => {
    for (const [i, p, q, w, d] of [
      [0, 22.5, 37.5, 60, 90],
      [1, 32.5, 47.5, 80, 120],
    ] as const) {
      expect(nums(raw(i, 1))).toEqual([p, q]);
      expect(nums(raw(i, 1, 1))).toEqual([w, d]);
      expect(p + q).toBe(w);
      expect(d - w).toBe(i === 0 ? 30 : 40);
      expect(d + (d - w)).not.toBe(w);
      const a = turnPoint({ x: 0, y: 0 }, 0, 1),
        b = turnPoint({ x: 0, y: 0 }, w, 1),
        c = turnPoint({ x: 0, y: 0 }, d, 1);
      const angle = (u: typeof a, v: typeof a) =>
        (Math.acos(
          (u.x * v.x + u.y * v.y) /
            (Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y)),
        ) *
          180) /
        Math.PI;
      expect(angle(a, b)).toBeCloseTo(w, 10);
      expect(angle(b, c)).toBeCloseTo(d - w, 10);
      expect(sets[i]!.questions[0]!.solution.en).toContain(`${2 * d - w}°`);
    }
  });
  it('distinguishes a parameter from actual opposite angles and checks the perpendicular counterexample', () => {
    for (const [i, x, a] of [
      [0, '45/2', 97.5],
      [1, '55/2', 95],
    ] as const) {
      const pair = raw(i, 2).replaceAll('°', '').split('，');
      const solved = solveAlgebra(parseLinearEquation(pair.join('='))!);
      expect(solved.kind === 'one' && textR(solved.value)).toBe(x);
      const values = intersectionAngles(a);
      expect(values).toEqual([a, 180 - a, a, 180 - a]);
      expect(values.reduce((a, b) => a + b, 0)).toBe(360);
      expect(sets[i]!.questions[1]!.solution.en).toContain(`${a}°`);
    }
    expect(intersectionAngles(90)).toEqual([90, 90, 90, 90]);
    expect([80, 90, 100, 90].reduce((a, b) => a + b, 0)).toBe(360);
    expect(80).not.toBe(100);
  });
  it('keeps isosceles bases, right complements and the two exterior targets independent and exact', () => {
    for (const [i, v, r, e, a, base, complement, other, adjacent] of [
      [0, 37.5, 32.5, 120.5, 48.5, 71.25, 57.5, 72, 59.5],
      [1, 52.5, 47.5, 137.5, 68.25, 63.75, 42.5, 69.25, 42.5],
    ] as const) {
      expect(nums(raw(i, 2, 1))).toEqual([v]);
      expect(nums(raw(i, 2, 2))).toEqual([r]);
      expect(nums(raw(i, 2, 3))).toEqual([e, a]);
      expect((180 - v) / 2).toBe(base);
      expect(90 - r).toBe(complement);
      expect(e - a).toBe(other);
      expect(180 - e).toBe(adjacent);
      expect(triangleAngles(base, base).angles[2]).toBe(v);
      expect(triangleAngles(90, r).angles[2]).toBe(complement);
      expect(triangleAngles(a, other).angles[2]).toBe(adjacent);
      for (const n of [base, complement, other, adjacent])
        expect(sets[i]!.questions[1]!.solution.en).toContain(`${n}°`);
    }
  });
  it('enumerates all integer choices independently while admitting fractional real lengths and rejecting equal-leg nonexistence', () => {
    for (const [i, a, b, lo, hi, bad] of [
      [0, 4, 7, 3, 11, [2, 2, 5]],
      [1, 5, 9, 4, 14, [3, 3, 7]],
    ] as const) {
      expect(nums(raw(i, 3))).toEqual([a, b]);
      expect(nums(raw(i, 3, 1))).toEqual(bad);
      const allowed = Array.from({ length: hi + 2 }, (_, c) => c).filter(
        (c) => c > 0 && a + b > c && a + c > b && b + c > a,
      );
      expect(allowed).toEqual(
        Array.from({ length: hi - lo - 1 }, (_, j) => lo + j + 1),
      );
      expect(thirdSideInterval(a, b)).toEqual({
        lower: lo,
        upper: hi,
        minInteger: allowed[0],
        maxInteger: allowed.at(-1),
      });
      expect(triangleSides(a, b, lo + 0.5).valid).toBe(true);
      for (const c of [lo, hi])
        expect(triangleSides(a, b, c).valid).toBe(false);
      expect(triangleSides(...bad)).toMatchObject({
        valid: false,
        kind: 'impossible',
        points: null,
        angles: null,
      });
    }
  });
  it('constructs acute/right/obtuse isosceles triples with positive angles and keeps inclusive side classification', () => {
    for (const [i, triples] of [
      [
        0,
        [
          [70, 70, 40],
          [45, 45, 90],
          [25, 25, 130],
        ],
      ],
      [
        1,
        [
          [65, 65, 50],
          [45, 45, 90],
          [35, 35, 110],
        ],
      ],
    ] as const) {
      for (const [j, [a, b, c]] of triples.entries()) {
        expect(a + b + c).toBe(180);
        expect(Math.min(a, b, c)).toBeGreaterThan(0);
        expect(a).toBe(b);
        expect(triangleAngles(a, b)).toEqual({
          angles: [a, b, c],
          kind: ['acute', 'right', 'obtuse'][j],
        });
        expect(sets[i]!.questions[2]!.solution.en).toContain(
          `(${a}°,${b}°,${c}°)`,
        );
      }
    }
    expect(triangleSides(3, 3, 3)).toMatchObject({
      valid: true,
      kind: 'equilateral',
      isosceles: true,
    });
  });
  it('removes the implicit horizontal premise along with parallelism and provides two genuine lower-line possibilities', () => {
    for (const [u, theta, bottoms] of [
      ['J93', 52, [32, 72]],
      ['J94', 68, [48, 88]],
    ] as const) {
      const q = geometryGraphRetrieval[u].questions[2]!;
      expect(q.stem.en).toContain(
        'remove parallelism AND any horizontal/direction premise for m',
      );
      expect(q.stem.zh).toMatch(/撤.*m水平/);
      const possibilities = bottoms.map((b) =>
        transversalAngles(theta, b, false),
      );
      expect(possibilities.map((p) => p.angles[4])).toEqual(bottoms);
      expect(possibilities.map((p) => p.tilt)).toEqual([20, -20]);
      for (const p of possibilities)
        expect(p.angles.slice(0, 4)).toEqual(intersectionAngles(theta));
      expect(() => transversalAngles(theta, bottoms[0], true)).toThrow();
    }
  });
});
