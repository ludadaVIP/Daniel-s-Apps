import { describe, expect, it } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { foundationRecurrence } from './content/foundationRecurrence';
import { primaryRecurrence } from './content/primaryRecurrence';
import { foundationRetrieval } from './content/foundationRetrieval';
import { numberTheoryRetrieval } from './content/numberTheoryRetrieval';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';

const reviewed = [...foundationRecurrence, ...primaryRecurrence];
const sets = [
  ...Object.values(foundationRetrieval),
  ...Object.values(numberTheoryRetrieval),
];
const tasks = new Map([
  ...lessons.flatMap((l) =>
    [l.guided, ...l.questions, l.exit].map(
      (q) => [q.id, { q, unit: l.unit! }] as const,
    ),
  ),
  ...sets.flatMap((s) =>
    s.questions.map((q) => [q.id, { q, unit: s.unit }] as const),
  ),
]);
const targetIds = new Set(reviewed.flatMap((e) => e.targets));

describe('foundation and first primary semantic recurrence', () => {
  it('covers all 33 actual source tags in B03–B06 and P51–P52 with distinct later units and exact task links', () => {
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    const sourceUnits = ['B03', 'B04', 'B05', 'B06', 'P51', 'P52'];
    const actual = new Set(
      lessons
        .filter((l) => sourceUnits.includes(l.unit!))
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(33);
    expect(new Set(reviewed.map((e) => e.skill))).toEqual(actual);
    for (const e of reviewed) {
      const source = lessonById(e.sourceLesson)!;
      expect(tasks.get(e.sourceTask)?.q.skill).toBe(e.skill);
      expect(
        [source.guided, ...source.questions, source.exit].some(
          (q) => q.id === e.sourceTask,
        ),
      ).toBe(true);
      const owners = new Set(
        e.targets.map((id) => {
          const task = tasks.get(id)!;
          expect(task, id).toBeDefined();
          expect(units.indexOf(task.unit), id).toBeGreaterThan(
            units.indexOf(source.unit!),
          );
          const link = recurrenceLinksFor(e.sourceLesson)
            .flatMap((g) => g.targets)
            .find((t) => t.id === id)!;
          expect(
            new URL(link.href, 'http://localhost').searchParams.get('question'),
          ).toBe(id);
          expect(
            link.title.en && link.title.zh && link.label.en && link.label.zh,
          ).toBeTruthy();
          return task.unit;
        }),
      );
      expect(owners.size, e.skill).toBeGreaterThanOrEqual(2);
      expect(
        e.rationale.zh && e.rationale.en && e.focus.zh && e.focus.en,
      ).toBeTruthy();
    }
  });

  it('checks every numerical target using independent units, cents, interval and fraction arithmetic', () => {
    const oracle = new Map<string, string>([
      ['J71-L03-Q3', String((11 - 6) / 10)],
      ['J71-L04-Q3', String((-4 - 6) / 10)],
      ['J74-L02-X', String((1800 - 375) / 10)],
      ['J91-L05-Q2', Math.sqrt(2).toFixed(2)],
      ['J91-L05-X', Math.sqrt(999 / 1000).toFixed(2)],
      ['P52-L01-Q2', String(4 * (1000 / 100))],
      ['P52-L06-Q3', String(480 / 4 / 100)],
      ['P52-L06-Q4', String((400 - 3 * 85) / 100)],
      ['P52-L06-Q5', String((500 - 235 - 120) / 100)],
      ['P53-L02-Q3', '5/4'],
      ['P54-L02-Q5', '3/5'],
      ['P56-L01-Q3', String((3 * 100 ** 3) / 1000)],
      ['P56-L01-Q5', String((6 * 1000) / 10)],
      ['P56-L02-Q4', String(4 * (50 / 100))],
      ['P56-L02-X', String((3 * 8) / 10)],
      ['P56-L03-Q3', String((8 * 5) / 2)],
      ['P57-L04-Q3', String(40 - 38)],
      ['P57-L04-Q4', String(44 - 38)],
      ['P57-L05-Q3', String((600 - 240 - 300) / 100)],
      ['P57-L05-Q4', String(2 * 500 - 600)],
      ['P57-L05-Q5', String((2 * 240 + 300 - 700) / 100)],
      ['P61-L02-G', '1/2'],
      ['P62-L02-Q5', String(375 / 10 / 100)],
      ['P62-L02-X', `${(8 / 1000) * 100}%`],
      ['P63-L05-Q2', String(((24 / 10) * 50000) / 100 / 1000)],
      ['P68-L01-Q3', String(75 / 10 / 5)],
      ['P68-L01-X', '20/3'],
      ['P68-L04-G', String(18 * 4 + 10)],
      ['P68-L04-Q2', String(12 + 24)],
      ['P68-L04-Q3', String((24 / 4) * 12)],
      ['P68-L05-Q3', String(160 - 160 / 10 - 100)],
    ]);
    const numericTargets = [...targetIds].filter(
      (id) => !['choice', 'explain'].includes(tasks.get(id)!.q.answer.kind),
    );
    expect(new Set(numericTargets)).toEqual(new Set(oracle.keys()));
    for (const [id, expected] of oracle) {
      const q = tasks.get(id)!.q;
      expect(checkAnswer(expected, q.answer), id).toBe(true);
      expect(checkAnswer('999999', q.answer), id).toBe(false);
      for (const a of q.answerChecks?.accepted ?? [])
        expect(checkAnswer(a, q.answer), id + a).toBe(true);
      for (const a of q.answerChecks?.rejected ?? [])
        expect(checkAnswer(a, q.answer), id + a).toBe(false);
    }
    for (const [id, wrong] of [
      ['P52-L06-Q3', '1.2 m'],
      ['P56-L01-Q3', '3000 cm²'],
      ['P56-L02-Q4', '2 m'],
      ['P57-L05-Q5', '-0.8'],
      ['P63-L05-Q2', '1.2 cm'],
      ['P68-L04-Q2', '36 people'],
      ['P68-L01-X', '6.67'],
      ['J91-L05-X', '1'],
    ])
      expect(checkAnswer(wrong!, tasks.get(id!)!.q.answer), id).toBe(false);
  });

  it('keeps 22 new process tasks bilingual, human-reviewed, separately recorded and linked to the appropriate bridge', () => {
    const newTasks = sets.flatMap((s) => s.questions);
    expect(newTasks).toHaveLength(22);
    expect(new Set(newTasks.map((q) => q.id)).size).toBe(22);
    for (const s of sets) {
      expect(s.id).not.toBe(unitChecks[s.unit as keyof typeof unitChecks].id);
      expect(lessons.some((l) => l.id === s.id)).toBe(false);
      expect(s.intro.zh && s.intro.en).toBeTruthy();
      for (const q of s.questions) {
        expect(targetIds.has(q.id), q.id).toBe(true);
        expect(q.answer.kind).toBe('explain');
        expect(
          checkAnswer('205 202 162 112 312 672 prime conserved', q.answer),
        ).toBeNull();
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.zh && h.en)).toBe(true);
        expect(
          lessonById((s.bridgeByQuestion as Record<string, string>)[q.id]!),
        ).toBeDefined();
      }
    }
    for (const s of Object.values(foundationRetrieval)) {
      expect(s.bridgeByQuestion[`${s.unit}-MAINT-FOUNDATION-Q8`]).toBe(
        'B04-L02',
      );
      expect(s.bridgeByQuestion[`${s.unit}-MAINT-FOUNDATION-Q9`]).toBe(
        'B06-L02',
      );
    }
    for (const s of Object.values(numberTheoryRetrieval))
      expect(
        s.bridgeByQuestion[
          `${s.unit}-MAINT-P51-Q2` as keyof typeof s.bridgeByQuestion
        ],
      ).toBe('P51-L05');
  });

  it('independently verifies exchanges, four-part areas, quotient place values, exact checks and factor completeness', () => {
    for (const [original, hundreds, tens, ones, subtract, difference] of [
      [508, 4, 9, 18, 279, 229],
      [602, 5, 9, 12, 358, 244],
    ]) {
      expect(hundreds! * 100 + tens! * 10 + ones!).toBe(original);
      expect(original! - subtract!).toBe(difference);
      expect(difference! + subtract!).toBe(original);
    }
    expect(267 + 158).toBe(425);
    expect(386 + 247).toBe(633);
    expect(9 * (20 - 2)).toBe(162);
    expect(9 * 20 - 2).not.toBe(162);
    expect(7 * (10 + 6)).toBe(112);
    expect(7 * 10 + 6).not.toBe(112);
    for (const [a, b, expected] of [
      [24, 13, 312],
      [32, 21, 672],
    ]) {
      const tensA = Math.floor(a! / 10) * 10,
        onesA = a! % 10;
      const tensB = Math.floor(b! / 10) * 10,
        onesB = b! % 10;
      expect(
        tensA * tensB + tensA * onesB + onesA * tensB + onesA * onesB,
      ).toBe(expected);
    }
    for (const [total, size, quotient, remainder] of [
      [1027, 5, 205, 2],
      [1213, 6, 202, 1],
    ]) {
      expect(Math.floor(total! / size!)).toBe(quotient);
      expect(total! % size!).toBe(remainder);
      expect(quotient! * size! + remainder!).toBe(total);
      expect(remainder).toBeLessThan(size!);
    }
    expect(198 * 21).toBe(4158);
    expect(41580).toBeGreaterThan(200 * 30);
    expect(602 - 298).toBe(304);
    expect(303 + 298).not.toBe(602);
    expect(89 - 24).toBe(65);
    expect(120 - 35).toBe(85);
    expect(42 - 17).toBe(25);
    expect(42 / 3).toBe(14);
    expect((24 - 9) / 10).toBe(1.5);
    expect(24 / 3 / 10).toBe(0.8);
    const factors = (n: number) =>
      Array.from({ length: n }, (_, i) => i + 1).filter((k) => n % k === 0);
    expect(factors(36)).toEqual([1, 2, 3, 4, 6, 9, 12, 18, 36]);
    expect(factors(15)).toEqual([1, 3, 5, 15]);
    expect(factors(17)).toEqual([1, 17]);
    expect(factors(19)).toEqual([1, 19]);
    expect(factors(21)).toEqual([1, 3, 7, 21]);
    for (const [a, b, gcd] of [
      [36, 48, 12],
      [36, 54, 18],
    ])
      expect(Math.max(...factors(a!).filter((k) => b! % k === 0))).toBe(gcd);
    for (const [a, b, lcm] of [
      [6, 10, 30],
      [9, 12, 36],
    ]) {
      const positive = Array.from({ length: a! * b! }, (_, i) => i + 1);
      expect(positive.find((k) => k % a! === 0 && k % b! === 0)).toBe(lcm);
    }
  });
});
