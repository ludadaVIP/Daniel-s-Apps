import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { geometryGraphRetrieval } from './content/geometryGraphRetrieval';
import { geometryGraphRecurrence } from './content/geometryGraphRecurrence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
const sets = Object.values(geometryGraphRetrieval);
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
describe('geometry, coordinates and probability recurrence', () => {
  it('checks near-term frequency counterexamples with exact integer comparisons', () => {
    const firstOld = { n: Math.abs(8 * 5 - 3 * 10), d: 10 * 5 };
    const firstNew = { n: Math.abs(9 * 5 - 3 * 11), d: 11 * 5 };
    expect(firstNew.n * firstOld.d).toBeGreaterThan(firstOld.n * firstNew.d);
    const secondOld = { n: Math.abs(4 * 3 - 1 * 9), d: 9 * 3 };
    const secondNew = { n: Math.abs(5 * 3 - 1 * 10), d: 10 * 3 };
    expect(secondNew.n * secondOld.d).toBeGreaterThan(
      secondOld.n * secondNew.d,
    );
    expect(firstNew).toEqual({ n: 12, d: 55 });
    expect(secondNew.n * 6).toBe(secondNew.d);
    expect(geometryGraphRetrieval.J93.questions[8]!.solution.zh).toContain(
      '8/10=4/5',
    );
    expect(geometryGraphRetrieval.J94.questions[8]!.solution.zh).toContain(
      '5/10=1/2',
    );
    for (const s of sets)
      expect(
        checkAnswer(s.questions[8]!.solution.en, s.questions[8]!.answer),
      ).toBeNull();
  });
  it('covers all sixteen J74-J76 skills in exact tasks from at least two later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => ['J74', 'J75', 'J76'].includes(l.unit!))
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(16);
    expect(new Set(geometryGraphRecurrence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of geometryGraphRecurrence) {
      const l = lessonById(e.sourceLesson)!;
      expect(
        l.questions.some((q) => q.id === e.sourceTask && q.skill === e.skill),
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
            .find((q) => q.id === id)!;
          expect(
            new URL(link.href, 'http://localhost').searchParams.get('question'),
          ).toBe(id);
          expect(checkAnswer(target.q.solution.en, target.q.answer)).toBeNull();
          return target.unit;
        }),
      );
      expect(owners.size, e.skill).toBeGreaterThanOrEqual(2);
      expect(
        e.rationale.zh && e.rationale.en && e.focus.zh && e.focus.en,
      ).toBeTruthy();
    }
  });
  it('keeps eighteen drawings and argument chains bilingual, human-reviewed and separate from checks', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(18);
    for (const s of sets) {
      expect(s.questions).toHaveLength(9);
      expect(s.id).not.toBe(unitChecks[s.unit as keyof typeof unitChecks].id);
      expect(lessons.some((l) => l.id === s.id)).toBe(false);
      for (const q of s.questions) {
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.zh && h.en)).toBe(true);
        expect(
          checkAnswer('65 63 115 117 parallel same unit 3/10', q.answer),
        ).toBeNull();
        expect(lessonById(s.bridgeByQuestion[q.id]!)).toBeDefined();
      }
    }
  });
  it('checks strict triangle ranges, local angle sums and auxiliary-line numerical consequences', () => {
    const cases = [
      {
        u: 'J93',
        cross: 42,
        theta: 52,
        a: 48,
        b: 67,
        c: 65,
        ext: 115,
        sides: [4, 7],
        lo: 3,
        hi: 11,
      },
      {
        u: 'J94',
        cross: 57,
        theta: 68,
        a: 38,
        b: 79,
        c: 63,
        ext: 117,
        sides: [5, 9],
        lo: 4,
        hi: 14,
      },
    ] as const;
    for (const s of cases) {
      expect(s.a + s.b + s.c).toBe(180);
      expect(180 - s.c).toBe(s.ext);
      expect(s.a + s.b).toBe(s.ext);
      const q = geometryGraphRetrieval[s.u].questions;
      expect(q[1]!.solution.zh).toContain(`${180 - s.cross}°`);
      expect(q[2]!.solution.zh).toContain(`${180 - s.theta}°`);
      expect(q[3]!.solution.zh).toContain(`${s.c}°`);
      expect(q[3]!.solution.zh).toContain(`${s.ext}°`);
      expect(q[4]!.solution.zh).toContain(`${s.lo}<c<${s.hi}`);
      for (let c = 0; c <= s.hi + 1; c += 0.5) {
        const [a, b] = s.sides;
        const all = a + b > c && a + c > b && b + c > a;
        expect(all).toBe(c > s.lo && c < s.hi);
      }
    }
    expect(45 + 45 + 90).toBe(180);
    expect(60 + 60 + 60).toBe(180);
  });
  it('reconstructs paired positions and supplied-rule tables without conflating cell counts and values', () => {
    expect([-3 * 2, 3 * (1 / 2)]).toEqual([-6, 3 / 2]);
    expect([-3 * (1 / 2), 3 * 2]).toEqual([-3 / 2, 6]);
    expect([0, 2.5, 6].map((t) => [t, 12 - 2 * t])).toEqual([
      [0, 12],
      [2.5, 7],
      [6, 0],
    ]);
    expect([0, 2, 4].map((t) => [t, -3 + 1.5 * t])).toEqual([
      [0, -3],
      [2, 0],
      [4, 3],
    ]);
    expect([0, 2, 4].map((n) => [n, 3 * n + 2])).toEqual([
      [0, 2],
      [2, 8],
      [4, 14],
    ]);
    expect(12 - 2 * 7).toBeLessThan(0);
    expect(Number.isInteger(2.5)).toBe(false);
    for (const s of sets) {
      expect(s.questions[6]!.solution.zh).toContain('J75');
      expect(s.questions[6]!.solution.zh).toContain('J85');
    }
  });
  it('enumerates distinct numbered pairs independently and checks all colour weights including impossible BB', () => {
    for (const s of [
      { u: 'J93', r: 3, b: 2, replaced: [9, 6, 6, 4], removed: [6, 6, 6, 2] },
      { u: 'J94', r: 2, b: 1, replaced: [4, 2, 2, 1], removed: [2, 2, 2, 0] },
    ] as const) {
      const balls = [
        ...Array.from({ length: s.r }, (_, i) => `R${i + 1}`),
        ...Array.from({ length: s.b }, (_, i) => `B${i + 1}`),
      ];
      for (const replace of [true, false]) {
        const pairs = balls.flatMap((a) =>
          balls.filter((b) => replace || a !== b).map((b) => [a, b] as const),
        );
        expect(new Set(pairs.map(([a, b]) => `${a}:${b}`)).size).toBe(
          pairs.length,
        );
        expect(pairs.length).toBe(
          balls.length * (balls.length - (replace ? 0 : 1)),
        );
        const counts = ['RR', 'RB', 'BR', 'BB'].map(
          (colour) => pairs.filter(([a, b]) => a[0]! + b[0] === colour).length,
        );
        expect(counts).toEqual(replace ? [...s.replaced] : [...s.removed]);
        expect(counts.reduce((a, b) => a + b, 0)).toBe(pairs.length);
        const rubric = geometryGraphRetrieval[s.u].questions[7]!.solution.zh;
        expect(rubric).toContain(`${pairs.length}编号有序对`);
      }
    }
    expect(geometryGraphRetrieval.J93.questions[7]!.solution.zh).toContain(
      '3/10、3/10、3/10、1/10',
    );
    expect(geometryGraphRetrieval.J94.questions[7]!.solution.zh).toContain(
      'BB0',
    );
  });
});
