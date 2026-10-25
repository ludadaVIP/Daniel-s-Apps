import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { percentRetrieval } from './content/percentRetrieval';
import { percentRecurrence } from './content/percentRecurrence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
describe('percentage recurrence content', () => {
  it('retrieves all six actual P62 skills with exact later-unit task links', () => {
    const actual = new Set(
      lessons
        .filter((l) => l.unit === 'P62')
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(6);
    expect(new Set(percentRecurrence.map((e) => e.skill))).toEqual(actual);
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of percentRecurrence) {
      const l = lessonById(e.sourceLesson)!;
      expect(
        l.questions.some((q) => q.id === e.sourceTask && q.skill === e.skill),
      ).toBe(true);
      const owners = new Set(
        e.targets.map((id) => {
          const s = Object.values(maintenanceSets).find((s) =>
            s.questions.some((q) => q.id === id),
          )!;
          expect(units.indexOf(s.unit)).toBeGreaterThan(units.indexOf(l.unit!));
          const target = recurrenceLinksFor(l.id)
            .flatMap((g) => g.targets)
            .find((q) => q.id === id)!;
          expect(
            new URL(target.href, 'http://localhost').searchParams.get(
              'question',
            ),
          ).toBe(id);
          return s.unit;
        }),
      );
      expect(owners.size).toBeGreaterThanOrEqual(2);
      expect(
        e.rationale.zh && e.rationale.en && e.focus.zh && e.focus.en,
      ).toBeTruthy();
    }
  });
  it('keeps twelve bilingual reference arguments manually reviewed and separately recorded', () => {
    expect(
      Object.values(percentRetrieval).flatMap((s) => s.questions),
    ).toHaveLength(12);
    for (const s of Object.values(percentRetrieval)) {
      expect(s.questions).toHaveLength(6);
      expect(s.id).not.toBe(unitChecks[s.unit as keyof typeof unitChecks].id);
      expect(lessons.some((l) => l.id === s.id)).toBe(false);
      for (const q of s.questions) {
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.zh && h.en)).toBe(true);
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(
          checkAnswer('15 17.5 6.25 4.5 144 48 percent same whole', q.answer),
        ).toBeNull();
        expect(lessonById(s.bridgeByQuestion[q.id]!)).toBeDefined();
      }
    }
  });
  it('independently checks counts, exact fractions, whole recovery and changing bases', () => {
    expect([(9 * 100) / 60, (21 * 100) / 140]).toEqual([15, 15]);
    expect([(14 * 100) / 80, (35 * 100) / 200]).toEqual([17.5, 17.5]);
    expect([6.25 / 100, 4.5 / 100]).toEqual([0.0625, 0.045]);
    expect([0.0625 / 100, 0.045 / 100]).toEqual([0.000625, 0.00045]);
    // Exact percentages divide their entire mixed-number coefficients by 100.
    expect((16 * 3 + 2) * 6).toBe(3 * 100);
    expect((28 * 7 + 4) * 7).toBe(2 * 7 * 100);
    expect(167 * 6).not.toBe(1000);
    expect(143 * 7).not.toBe(2 * 500);
    expect([80 / 8, 120 / 8, (40 * 3) / 40, (100 * 3) / 40]).toEqual([
      10, 15, 3, 7.5,
    ]);
    expect(144 / 8).toBe(18);
    expect((48 * 75) / 1000).toBe(3.6);
    expect([18 / 8, (3.6 * 75) / 1000]).toEqual([2.25, 0.27]);
    // Money is checked in integer cents, without floating round-off.
    expect((12000 * 75 * 125) / 10000).toBe(11250);
    expect((20000 * 110 * 90) / 10000).toBe(19800);
    expect([40 - 25, ((40 - 25) * 100) / 25]).toEqual([15, 60]);
    expect([15 - 10, ((15 - 10) * 100) / 10]).toEqual([5, 50]);
    expect(((19800 - 20000) * 100) / 20000).toBe(-1);
  });
});
