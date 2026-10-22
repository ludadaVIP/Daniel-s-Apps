import { describe, expect, it } from 'vitest';
import { curriculum, lessons, unitChecks } from './content';
import { maintenanceSets, recurrenceEvidence } from './content/maintenance';
import { checkAnswer } from './model';

describe('explicit later-unit retrieval evidence', () => {
  it('maps all five B01 lesson skills to actual tasks in two distinct later units', () => {
    const units = curriculum.flatMap((stage) =>
      stage.units.map((unit) => unit.id),
    );
    const all = Object.values(maintenanceSets).flatMap((set) =>
      set.questions.map((question) => ({ question, unit: set.unit })),
    );
    const b01Evidence = recurrenceEvidence.filter((e) =>
      e.sourceLesson.startsWith('B01-'),
    );
    expect(b01Evidence).toHaveLength(5);
    expect(new Set(b01Evidence.map((e) => e.skill)).size).toBe(5);
    expect(new Set(all.map((t) => t.question.id)).size).toBe(10);
    for (const evidence of b01Evidence) {
      const source = lessons.find((l) => l.id === evidence.sourceLesson)!;
      expect(source.unit).toBe('B01');
      expect(
        [source.guided, ...source.questions, source.exit].find(
          (q) => q.id === evidence.sourceTask,
        )?.skill,
      ).toBe(evidence.skill);
      const targets = evidence.targets.map((id) =>
        all.find((t) => t.question.id === id)!,
      );
      expect(new Set(targets.map((t) => t.unit))).toEqual(
        new Set(['B03', 'B05']),
      );
      targets.forEach((target) => {
        expect(units.indexOf(target.unit)).toBeGreaterThan(
          units.indexOf(source.unit!),
        );
        expect(target.question.skill).toBe(evidence.skill);
      });
      expect(evidence.rationale.zh && evidence.rationale.en).toBeTruthy();
    }
  });

  it('keeps later-unit sessions and canonical unit-check counts separate', () => {
    expect(unitChecks.B03.questions).toHaveLength(8);
    expect(unitChecks.B05.questions).toHaveLength(8);
    for (const set of Object.values(maintenanceSets)) {
      expect(set.questions).toHaveLength(5);
      expect(
        set.questions.filter((q) => q.answer.kind === 'explain'),
      ).toHaveLength(2);
      expect(
        set.questions.filter((q) => q.answer.kind === 'choice'),
      ).toHaveLength(0);
      expect(set.id).not.toBe(unitChecks[set.unit as 'B03' | 'B05'].id);
      expect(lessons.some((l) => l.id === set.id)).toBe(false);
      set.questions.forEach((q) => {
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.zh && h.en)).toBe(true);
      });
    }
  });

  it('checks independent place expansion, interval arithmetic and all declared mistakes', () => {
    // Fixed place-value cards and physical interval counts are independent of
    // the authored answer values and of the production question builders.
    const byId = new Map(
      Object.values(maintenanceSets)
        .flatMap((s) => s.questions)
        .map((q) => [q.id, q]),
    );
    const placeOracle = (digits: number[]) =>
      digits.reduce((n, digit) => 10 * n + digit, 0);
    const expected = new Map([
      ['B03-MAINT-B01-Q1', placeOracle([4, 0, 8, 0, 6])],
      ['B03-MAINT-B01-Q2', 7604 - 7000 - 4],
      [
        'B03-MAINT-B01-Q3',
        [460, 400 + 4 * ((600 - 400) / 10), 500].sort((a, b) => a - b)[1],
      ],
      ['B05-MAINT-B01-Q1', placeOracle([6, 0, 0, 7, 0])],
      ['B05-MAINT-B01-Q2', 31040 - 30000 - 40],
      [
        'B05-MAINT-B01-Q3',
        [400, 200 + 5 * ((500 - 200) / 6), 475].sort((a, b) => a - b)[1],
      ],
    ]);
    for (const [id, value] of expected) {
      const q = byId.get(id)!;
      expect(checkAnswer(String(value), q.answer), id).toBe(true);
      expect(checkAnswer(String(value! + 1), q.answer), id).toBe(false);
      q.answerChecks!.accepted.forEach((answer) =>
        expect(checkAnswer(answer, q.answer), id + answer).toBe(true),
      );
      q.answerChecks!.rejected.forEach((answer) =>
        expect(checkAnswer(answer, q.answer), id + answer).toBe(false),
      );
    }
    expect(checkAnswer('40,806', byId.get('B03-MAINT-B01-Q1')!.answer)).toBe(
      true,
    );
    expect(checkAnswer('60,070', byId.get('B05-MAINT-B01-Q1')!.answer)).toBe(
      true,
    );
    for (const set of Object.values(maintenanceSets)) {
      const axis = set.questions[2]!.diagram!;
      expect(axis.kind).toBe('axis');
      if (axis.kind === 'axis') {
        expect(axis.label).toBe('P');
        expect(checkAnswer(String(axis.point), set.questions[2]!.answer)).toBe(
          true,
        );
        expect(axis.point).toBeGreaterThan(axis.start);
        expect(axis.point).toBeLessThan(axis.end);
      }
    }
  });

  it('verifies the argument arithmetic without turning explanations into keyword grading', () => {
    const nearest = (value: number, step: number) => {
      const lower = Math.floor(value / step) * step;
      return value - lower < step / 2 ? lower : lower + step;
    };
    expect(nearest(4499, 1000)).toBe(4000);
    expect(nearest(nearest(4499, 100), 1000)).toBe(5000);
    expect(nearest(7849, 100)).toBe(7800);
    expect(7849 - nearest(7849, 100)).toBe(49);
    expect(300 + 90 + 13).toBe(403);
    expect(300 + 100 + 13).toBe(413);
    expect(403 - 178).toBe(225);
    expect(225 + 178).toBe(403);
    expect(4 * 100 + 12 * 10 + 6).toBe(5 * 100 + 2 * 10 + 6);
    expect(4 + 12 + 6).toBe(22);
    expect(5 + 2 + 6).toBe(13);
    for (const set of Object.values(maintenanceSets)) {
      for (const q of set.questions.slice(3)) {
        expect(
          checkAnswer('4000 7800 225 526 conserved value', q.answer),
        ).toBeNull();
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
      }
    }
  });
});
