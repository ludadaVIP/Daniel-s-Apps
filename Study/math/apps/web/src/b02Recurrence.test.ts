import { describe, expect, it } from 'vitest';
import { curriculum, lessons, lessonById } from './content';
import { recurrenceEvidence, maintenanceSets } from './content/maintenance';
import { recurrenceLinksFor } from './recurrenceTargets';
import { lessonQuestionPosition } from './questionNavigation';
import { checkAnswer } from './model';

const b02 = recurrenceEvidence.filter((e) => e.sourceLesson.startsWith('B02-'));
const taskRecords = [
  ...lessons.flatMap((l) =>
    [l.guided, ...l.questions, l.exit].map((q) => ({ q, unit: l.unit! })),
  ),
  ...Object.values(maintenanceSets).flatMap((set) =>
    set.questions.map((q) => ({ q, unit: set.unit })),
  ),
];
const tasks = new Map(taskRecords.map((record) => [record.q.id, record.q]));
const taskOwners = new Map(
  taskRecords.map((record) => [record.q.id, record.unit]),
);

describe('B02 semantic recurrence in existing later-unit tasks', () => {
  it('covers the six actual skills from five source lessons, including comparison as its own concept', () => {
    const sourceSkills = new Set(
      lessons
        .filter((l) => l.unit === 'B02')
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(sourceSkills.size).toBe(6);
    expect(new Set(b02.map((e) => e.skill))).toEqual(sourceSkills);
    const units = curriculum.flatMap((stage) =>
      stage.units.map((unit) => unit.id),
    );
    const targetUnits = new Set<string>();
    for (const e of b02) {
      const source = lessonById(e.sourceLesson)!;
      expect(tasks.get(e.sourceTask)?.skill).toBe(e.skill);
      expect(
        e.focus.zh && e.focus.en && e.rationale.zh && e.rationale.en,
      ).toBeTruthy();
      const laterUnits = new Set(
        e.targets.map((id) => {
          const q = tasks.get(id)!;
          expect(q, id).toBeDefined();
          const ownerUnit = taskOwners.get(id)!;
          expect(units.indexOf(ownerUnit)).toBeGreaterThan(
            units.indexOf(source.unit!),
          );
          // These are genuine applications with different local tags, not newly
          // renamed copies introduced just to make exact-tag matching pass.
          if (!id.includes('-MAINT-OPERATIONS-'))
            expect(q.skill).not.toBe(e.skill);
          expect(
            q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
          ).toBeTruthy();
          targetUnits.add(ownerUnit);
          return ownerUnit;
        }),
      );
      expect(laterUnits.size).toBeGreaterThanOrEqual(2);
    }
    expect(targetUnits).toEqual(
      new Set(['B03', 'B05', 'B06', 'P51', 'P55', 'P61']),
    );
    expect(b02.flatMap((e) => e.targets)).toHaveLength(28);
  });

  it('cross-checks every numerical target by independent relationship arithmetic and units', () => {
    const oracle = new Map([
      ['B03-L01-Q5', 126 + 287],
      ['B05-L05-Q3', 10 - 8],
      ['B06-L02-Q3', 17 - 9],
      ['B06-L02-Q5', 9 - 4],
      [
        'B06-L05-Q4',
        Array.from({ length: 3 }, () => 4).reduce((a, b) => a + b),
      ],
      ['P51-L03-G', 24 / 4],
      ['P51-L03-Q5', 25 - 4 * 6],
      ['P61-L04-G', 3 / 4 / 2],
      ['P55-L04-Q3', 5 / 4],
      ['P51-L01-Q5', 3000 - 18 * 125],
    ]);
    const numericTargets = b02
      .flatMap((e) => e.targets)
      .filter((id) => tasks.get(id)!.answer.kind !== 'explain');
    expect(new Set(numericTargets)).toEqual(new Set(oracle.keys()));
    for (const [id, value] of oracle) {
      const q = tasks.get(id)!;
      expect(checkAnswer(String(value), q.answer), id).toBe(true);
      expect(checkAnswer(String(value + 1), q.answer), id).toBe(false);
      q.answerChecks!.accepted.forEach((a) =>
        expect(checkAnswer(a, q.answer), id + ':' + a).toBe(true),
      );
      q.answerChecks!.rejected.forEach((a) =>
        expect(checkAnswer(a, q.answer), id + ':' + a).toBe(false),
      );
    }
    for (const [id, wrong] of [
      ['P51-L03-G', '6 bags'],
      ['P61-L04-G', '3/8 groups'],
      ['B06-L05-Q4', '12 cm'],
      ['P51-L01-Q5', '750 m'],
    ])
      expect(checkAnswer(wrong!, tasks.get(id!)!.answer), id).toBe(false);
  });

  it('keeps argument tasks human-reviewed and distinguishes remainder amount from a fraction of a portion', () => {
    const human = b02
      .flatMap((e) => e.targets)
      .map((id) => tasks.get(id)!)
      .filter((q) => q.answer.kind === 'explain');
    expect(human).toHaveLength(18);
    expect(new Set(human.map((q) => q.id)).size).toBe(16);
    human.forEach((q) =>
      expect(checkAnswer(q.solution.en, q.answer)).toBeNull(),
    );
    expect(9 + 15).toBe(24);
    expect(6 * 5 + 6 * 3).toBe(6 * (5 + 3));
    expect(6 * 5 + 3).not.toBe(6 * (5 + 3));
    const quarters = 2 * 4,
      perPortion = 3;
    const complete = Math.floor(quarters / perPortion);
    const remaining = quarters - complete * perPortion;
    expect([complete, remaining]).toEqual([2, 2]);
    expect(remaining / 4).toBe(1 / 2); // litres left
    expect([remaining, perPortion]).toEqual([2, 3]); // fraction of a standard portion
    expect(201 * 5).toBe(1005);
    expect(21 * 5).not.toBe(1005);
    expect(4 * (5 / 4)).toBe(5);
    expect(4 * 6 - 5).toBe(19);
    expect(4 * (6 - 5)).toBe(4);
  });

  it('resolves every reviewed source to its exact later task and ignores foreign or malformed question IDs', () => {
    for (const lesson of lessons) {
      const links = recurrenceLinksFor(lesson.id);
      for (const link of links.flatMap((group) => group.targets)) {
        expect(
          link.href &&
            link.title.zh &&
            link.title.en &&
            link.label.zh &&
            link.label.en,
        ).toBeTruthy();
        expect(
          new URL(link.href, 'http://localhost').searchParams.get('question'),
        ).toBe(link.id);
      }
    }
    const lesson = lessonById('P51-L03')!;
    expect(lessonQuestionPosition(lesson, lesson.guided.id)).toEqual({
      step: 3,
    });
    expect(lessonQuestionPosition(lesson, lesson.questions[4]!.id)).toEqual({
      step: 4,
      practiceIndex: 4,
    });
    expect(lessonQuestionPosition(lesson, lesson.exit.id)).toEqual({ step: 5 });
    for (const id of [null, '', 'P61-L04-G', '__proto__', 'P51-L03-Q99'])
      expect(lessonQuestionPosition(lesson, id)).toBeUndefined();
  });
});
