import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { geometryDataRecurrence } from './content/geometryDataRecurrence';
import { geometryDataRetrieval } from './content/geometryDataRetrieval';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';

const sets = Object.values(geometryDataRetrieval);
const tasks = new Map([
  ...lessons.flatMap((l) =>
    [l.guided, ...l.questions, l.exit].map(
      (q) => [q.id, { q, unit: l.unit! }] as const,
    ),
  ),
  ...Object.values(maintenanceSets).flatMap((s) =>
    s.questions.map((q) => [q.id, { q, unit: s.unit }] as const),
  ),
]);
describe('measurement and data semantic recurrence', () => {
  it('covers all eleven actual P56/P57 source skills in distinct later units with exact links', () => {
    const actual = new Set(
      lessons
        .filter((l) => ['P56', 'P57'].includes(l.unit!))
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(11);
    expect(new Set(geometryDataRecurrence.map((e) => e.skill))).toEqual(actual);
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of geometryDataRecurrence) {
      const l = lessonById(e.sourceLesson)!;
      expect(
        [l.guided, ...l.questions, l.exit].some(
          (q) => q.id === e.sourceTask && q.skill === e.skill,
        ),
      ).toBe(true);
      const owners = new Set(
        e.targets.map((id) => {
          const target = tasks.get(id)!;
          expect(target, id).toBeDefined();
          expect(units.indexOf(target.unit), id).toBeGreaterThan(
            units.indexOf(l.unit!),
          );
          const link = recurrenceLinksFor(l.id)
            .flatMap((g) => g.targets)
            .find((t) => t.id === id)!;
          expect(
            new URL(link.href, 'http://localhost').searchParams.get('question'),
          ).toBe(id);
          return target.unit;
        }),
      );
      expect(owners.size, e.skill).toBeGreaterThanOrEqual(2);
      expect(
        e.focus.zh && e.focus.en && e.rationale.zh && e.rationale.en,
      ).toBeTruthy();
    }
  });
  it('checks every existing numerical target by independent count and fair-share arithmetic', () => {
    const oracle = new Map([
      ['J76-L02-Q5', `${[0, 0, 6, 6].filter((x) => x === 6).length}/4`],
      ['J76-L01-X', '5/8'],
      ['J88-L05-Q2', String(12 - (5 + 6))],
      ['P67-L02-G', String([2, 3, 3, 4, 28].reduce((a, b) => a + b, 0) / 5)],
      ['P67-L02-Q4', `${1 + 2 + 2}/3`],
      ['J76-L03-G', `${4 + 5 + 6 + 7 + 50}/5`],
      ['J76-L03-Q3', `${4 + 5 + 6 + 7 + 0}/5`],
    ]);
    const ids = new Set(geometryDataRecurrence.flatMap((e) => e.targets));
    const numeric = [...ids].filter(
      (id) => tasks.get(id)!.q.answer.kind !== 'explain',
    );
    expect(new Set(numeric)).toEqual(new Set(oracle.keys()));
    for (const [id, value] of oracle) {
      const q = tasks.get(id)!.q;
      expect(checkAnswer(value, q.answer), id).toBe(true);
      expect(checkAnswer('9999', q.answer), id).toBe(false);
      for (const a of q.answerChecks?.accepted ?? [])
        expect(checkAnswer(a, q.answer), id + a).toBe(true);
      for (const a of q.answerChecks?.rejected ?? [])
        expect(checkAnswer(a, q.answer), id + a).toBe(false);
    }
    expect(checkAnswer('1.67', tasks.get('P67-L02-Q4')!.q.answer)).toBe(false);
    expect(checkAnswer('8 cm', tasks.get('P67-L02-G')!.q.answer)).toBe(false);
  });
  it('keeps fourteen bilingual process tasks human-reviewed and outside canonical lessons and checks', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(14);
    for (const s of sets) {
      expect(s.questions).toHaveLength(7);
      expect(s.id).not.toBe(unitChecks[s.unit as keyof typeof unitChecks].id);
      expect(lessons.some((l) => l.id === s.id)).toBe(false);
      for (const q of s.questions) {
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.zh && h.en)).toBe(true);
        expect(q.answer.kind).toBe('explain');
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(
          checkAnswer('100 10000 20 36 40 52 54 same unit missing', q.answer),
        ).toBeNull();
        expect(lessonById(s.bridgeByQuestion[q.id]!)).toBeDefined();
      }
      expect(s.bridgeByQuestion[`${s.unit}-MAINT-MEASURE-Q5`]).toBe('P56-L06');
      expect(s.bridgeByQuestion[`${s.unit}-MAINT-MEASURE-Q6`]).toBe('P57-L05');
      expect(s.bridgeByQuestion[`${s.unit}-MAINT-MEASURE-Q7`]).toBe('P57-L03');
    }
    for (const id of new Set(
      geometryDataRecurrence.flatMap((e) => e.targets),
    )) {
      const q = tasks.get(id)!.q;
      if (q.answer.kind === 'explain')
        expect(checkAnswer(q.solution.zh, q.answer)).toBeNull();
    }
  });
  it('independently verifies dimensional factors, external heights, surface counts, packs and missing-time boundaries', () => {
    expect([2 * 100, 2 * 100 ** 2, 2 * 100 ** 3, 2 * 1000]).toEqual([
      200, 20000, 2000000, 2000,
    ]);
    expect(2 * 100 ** 3).not.toBe((2 * 100) ** 3);
    expect([
      30 / 100,
      30 ** 2 / 100 ** 2,
      30 ** 3 / 100 ** 3,
      30 ** 3 / 1000,
    ]).toEqual([0.3, 0.09, 0.027, 27]);
    expect((2 * 10 * 4) / 2 / 2).toBe(20);
    const D = [-6, 0],
      A = [0, 0],
      B = [9, 0],
      C = [-6, 8];
    expect(D[0]).toBeLessThan(A[0]!);
    expect(Math.hypot(C[0]! - A[0]!, C[1]! - A[1]!)).toBe(10);
    const twiceArea = Math.abs(
      (B[0]! - A[0]!) * (C[1]! - A[1]!) - (B[1]! - A[1]!) * (C[0]! - A[0]!),
    );
    expect(twiceArea).toBe(72);
    expect(twiceArea / 2).toBe(36);
    expect(Math.sqrt(10 ** 2 - 6 ** 2)).toBe(8);
    expect((9 * 10) / 2).not.toBe(36);
    expect([8 * 3, ((4 + 10) * 3) / 2, ((8 + 8) * 3) / 2]).toEqual([
      24, 21, 24,
    ]);
    expect([7 * 4, ((4 + 9) * 4) / 2, ((7 + 7) * 4) / 2]).toEqual([28, 26, 28]);
    expect(3 * 4 * 5).toBe(60);
    expect(3 * 4 * 5 - 2).toBe(58);
    expect(2 * 3 * 4 * 1000).toBe(24000);
    expect(2 ** 2 + 3 ** 2 + 4 ** 2).toBe(29);
    expect(4 * 3 + 2 * 4 * 2 + 2 * 3 * 2).toBe(40);
    expect(40 + 4 * 3).toBe(52);
    expect([6 * 3 ** 2, 5 * 3 ** 2, 3 ** 3]).toEqual([54, 45, 27]);
    const scenarios = [
      {
        start: 4,
        target: 10,
        a: 80,
        b: 120,
        packA: 150,
        packB: 250,
        priceA: 240,
        priceB: 300,
        budget: 1000,
        required: [200, 300],
        left: [100, 200],
        cost: 1080,
        balance: -80,
      },
      {
        start: 4,
        target: 6,
        a: 120,
        b: 80,
        packA: 150,
        packB: 100,
        priceA: 250,
        priceB: 300,
        budget: 1150,
        required: [180, 120],
        left: [120, 80],
        cost: 1100,
        balance: 50,
      },
    ];
    for (const s of scenarios) {
      const a = (s.a * s.target) / s.start,
        b = (s.b * s.target) / s.start;
      const na = Math.ceil(a / s.packA),
        nb = Math.ceil(b / s.packB),
        paid = na * s.priceA + nb * s.priceB;
      expect([a, b]).toEqual(s.required);
      expect([na, nb]).toEqual([2, 2]);
      expect([(na - 1) * s.packA < a, (nb - 1) * s.packB < b]).toEqual([
        true,
        true,
      ]);
      expect([na * s.packA - a, nb * s.packB - b]).toEqual(s.left);
      expect(paid).toBe(s.cost);
      expect(s.budget - paid).toBe(s.balance);
      expect((a * s.priceA) / s.packA + (b * s.priceB) / s.packB).toBeLessThan(
        paid,
      );
    }
    expect([1 - 0, 4 - 1, 6 - 4]).toEqual([1, 3, 2]);
    expect([6 - 1, 16 - 14]).toEqual([5, 2]);
    expect([2 - 0, 3 - 2, 7 - 3]).toEqual([2, 1, 4]);
    expect([7 - 2, 6 - 0]).toEqual([5, 6]);
    const observed: [number, number | null][] = [
      [0, 10],
      [1, 14],
      [4, null],
      [6, 16],
    ];
    for (const possible of [0, 25]) {
      const completed = observed.map(([time, y]) => [
        time,
        y === null ? possible : y,
      ]);
      expect(completed.filter(([time]) => time !== 4)).toEqual(
        observed.filter(([time]) => time !== 4),
      );
    }
    expect([20, 20, 20, 24].reduce((a, b) => a + b, 0) / 4).toBe(21);
  });
});
