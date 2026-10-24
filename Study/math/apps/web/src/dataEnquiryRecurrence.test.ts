import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { dataEnquiryRetrieval } from './content/dataEnquiryRetrieval';
import { dataEnquiryRecurrence } from './content/dataEnquiryRecurrence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import { fiveNumber } from './researchModels';
import { textR } from './algebraModels';
const summary = (a: number[], include = false) => {
  const s = fiveNumber(a.map(String), include ? 'include' : 'exclude');
  return [s.min, s.q1, s.median, s.q3, s.max, s.range, s.iqr].map(textR);
};
const sets = Object.values(dataEnquiryRetrieval);
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
describe('data-enquiry recurrence', () => {
  it('covers all five J88 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => ['J88'].includes(l.unit!))
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(5);
    expect(new Set(dataEnquiryRecurrence.map((e) => e.skill))).toEqual(actual);
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of dataEnquiryRecurrence) {
      const source = lessonById(e.sourceLesson)!;
      expect(
        source.questions.some(
          (q) => q.id === e.sourceTask && q.skill === e.skill,
        ),
      ).toBe(true);
      const owners = new Set(
        e.targets.map((id) => {
          const target = tasks.get(id)!;
          expect(target, id).toBeDefined();
          expect(units.indexOf(target.unit), id).toBeGreaterThan(
            units.indexOf(source.unit!),
          );
          const link = recurrenceLinksFor(source.id)
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
        e.focus.zh && e.focus.en && e.rationale.zh && e.rationale.en,
      ).toBeTruthy();
    }
  });
  it('keeps eight bilingual derivations human-reviewed and outside canonical checks', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(8);
    for (const s of sets) {
      expect(s.questions).toHaveLength(4);
      expect(s.id).not.toBe(unitChecks[s.unit as keyof typeof unitChecks].id);
      expect(lessons.some((l) => l.id === s.id)).toBe(false);
      for (const q of s.questions) {
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.zh && h.en)).toBe(true);
        expect(
          checkAnswer('factor same zero product all real (7,2)', q.answer),
        ).toBeNull();
        expect(lessonById(s.bridgeByQuestion[q.id]!)).toBeDefined();
      }
    }
  });

  it('checks both quartile conventions, signed repeated values, exact fences and observed whiskers', () => {
    for (const [u, shift] of [
      ['H08', 0],
      ['H27', 1],
    ] as const) {
      const five = [1, 2, 3, 4, 5].map((n) => n + shift);
      expect(summary(five).slice(1, 4)).toEqual(
        shift ? ['5/2', '4', '11/2'] : ['3/2', '3', '9/2'],
      );
      expect(summary(five, true).slice(1, 4)).toEqual(
        shift ? ['3', '4', '5'] : ['2', '3', '4'],
      );
      const nine = [-2, -2, 0, 1, 1, 2, 3, 4, 30].map((n) => n + shift);
      expect(summary(nine)).toEqual(
        shift
          ? ['-1', '0', '2', '9/2', '31', '32', '9/2']
          : ['-2', '-1', '1', '7/2', '30', '32', '9/2'],
      );
      // Integer quarters avoid decimal round-off in the 1.5×IQR fence test.
      const lowFence4 = 4 * (-1 + shift) - 27,
        highFence4 = 4 * (3.5 + shift) + 27;
      const inside = nine.filter(
        (n) => 4 * n >= lowFence4 && 4 * n <= highFence4,
      );
      expect([inside[0], inside.at(-1)]).toEqual([-2 + shift, 4 + shift]);
      expect(nine.filter((n) => 4 * n > highFence4)).toEqual([30 + shift]);
      expect(nine.filter((n) => n === -2 + shift)).toHaveLength(2);
      expect(solutionZh(u, 0)).toContain('IQR=9/2');
    }
  });
  it('checks original, high-tail and independently reset zero-tail spread rather than deleting values', () => {
    for (const [u, shift, tail] of [
      ['H08', 0, 30],
      ['H27', 1, 41],
    ] as const) {
      const a = [1, 4, 4, 5, 5, 5, 6, 6, 7].map((n) => n + shift),
        b = [0, 1, 1, 2, 5, 8, 9, 9, 10].map((n) => n + shift);
      expect(summary(a).slice(5)).toEqual(['6', '2']);
      expect(summary(b).slice(5)).toEqual(['10', '8']);
      const high = [...a.slice(0, -1), tail],
        zero = [...a.slice(0, -1), 0];
      expect(summary(high).slice(5)).toEqual([`${tail - (1 + shift)}`, '2']);
      expect(summary(zero).slice(1, 4)).toEqual(
        shift ? ['7/2', '6', '13/2'] : ['5/2', '5', '11/2'],
      );
      expect(summary(zero).at(-1)).toBe('3');
      for (const data of [a, b, high, zero]) {
        expect(data).toHaveLength(9);
        expect(summary(data)[2]).toBe(`${5 + shift}`);
      }
      expect(solutionZh(u, 1)).toContain('IQR3');
    }
  });
  it('reconstructs both cleaned PPDAC datasets from the actual raw bilingual tables, retaining distinct equal IDs', () => {
    for (const [u, shift] of [
      ['H08', 0],
      ['H27', 1],
    ] as const) {
      const q = dataEnquiryRetrieval[u].questions[2]!,
        table = q.contextTable!;
      expect(table.rows).toHaveLength(13);
      expect(table.columns).toHaveLength(3);
      const original = new Map<string, number>();
      let missing = 0,
        duplicates = 0;
      for (const row of table.rows) {
        expect(row.every((c) => c.zh && c.en)).toBe(true);
        const id = row[0]!.en.match(/^[AB]\d/)![0];
        if (row[1]!.en === 'Missing') {
          missing++;
          expect(id).toBe('A6');
          continue;
        }
        const match = row[1]!.en.match(/^(\d+) (cm|mm)$/)!;
        const value = Number(match[1]) / (match[2] === 'mm' ? 10 : 1);
        if (row[2]!.en.includes('Confirmed same ID and measurement occasion')) {
          duplicates++;
          expect(original.get(id)).toBe(value);
          continue;
        }
        expect(original.has(id)).toBe(false);
        original.set(id, value);
      }
      expect([missing, duplicates, original.size]).toEqual([1, 1, 11]);
      expect(original.get('B3')).toBe(original.get('B4'));
      const a = [...original]
          .filter(([id]) => id.startsWith('A'))
          .map(([, n]) => n),
        b = [...original]
          .filter(([id]) => id.startsWith('B'))
          .map(([, n]) => n);
      expect(a).toHaveLength(5);
      expect(b).toHaveLength(6);
      expect(summary(a).slice(1, 4)).toEqual([
        `${3 + shift}`,
        `${4 + shift}`,
        `${7 + shift}`,
      ]);
      expect(summary(b).slice(1, 4)).toEqual([
        `${4 + shift}`,
        `${5 + shift}`,
        `${6 + shift}`,
      ]);
      expect(summary(a).at(-1)).toBe('4');
      expect(summary(b).at(-1)).toBe('2');
      expect(q.stem.en).toContain('without random allocation');
      expect(q.solution.en).toContain('Random sampling');
      expect(q.solution.en).toContain('possible confounder');
    }
  });
  it('checks both U-shaped complete-pair datasets and demonstrates corruption by independent sorting', () => {
    for (const [u, xs, ys, wrong] of [
      ['H08', [0, 1, 2, 3, 4], [4, 1, 0, 1, 4], [0, 0]],
      ['H27', [-2, -1, 0, 1, 2], [5, 2, 1, 2, 5], [-2, 1]],
    ] as const) {
      const mx = xs.reduce<number>((a, b) => a + b, 0) / 5,
        my = ys.reduce<number>((a, b) => a + b, 0) / 5;
      expect(
        xs.reduce<number>((s, x, i) => s + (x - mx) * (ys[i]! - my), 0),
      ).toBe(0);
      const sorted = [...ys].sort((a, b) => a - b);
      expect([xs[0], sorted[0]]).toEqual(wrong);
      expect(ys[0]).not.toBe(wrong[1]);
      expect(ys[0]).toBeGreaterThan(ys[2]);
      expect(ys[4]).toBeGreaterThan(ys[2]);
      expect(solutionZh(u, 3)).toContain('U形');
      expect(dataEnquiryRetrieval[u].questions[3]!.stem.en).toContain(
        'missing',
      );
    }
  });
});
function solutionZh(u: 'H08' | 'H27', i: number) {
  return dataEnquiryRetrieval[u].questions[i]!.solution.zh;
}
