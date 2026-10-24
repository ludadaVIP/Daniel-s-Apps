import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { probabilityProcessRetrieval } from './content/probabilityProcessRetrieval';
import { probabilityProcessRecurrence } from './content/probabilityProcessRecurrence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import { readRational } from './rationalModels';
import { rational, textR } from './algebraModels';
const sets = Object.values(probabilityProcessRetrieval);
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
describe('probability process recurrence', () => {
  it('covers all five J97 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => ['J97'].includes(l.unit!))
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(5);
    expect(new Set(probabilityProcessRecurrence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of probabilityProcessRecurrence) {
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
  it('keeps six bilingual derivations human-reviewed and outside canonical checks', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(6);
    for (const s of sets) {
      expect(s.questions).toHaveLength(3);
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
  it('enumerates both complete numbered grids and independently checks conditional branches and colour weights', () => {
    for (const [u, r, wantedReplace, wantedNo, different] of [
      ['H24', 3, [9, 6, 6, 4], [6, 6, 6, 2], '3/5'],
      ['H33', 2, [4, 4, 4, 4], [2, 4, 4, 2], '2/3'],
    ] as const) {
      const ids = [
        ...Array.from({ length: r }, (_, i) => `R${i + 1}`),
        'B1',
        'B2',
      ];
      const pairs = ids.flatMap((a) => ids.map((b) => [a, b] as const));
      const no = pairs.filter(([a, b]) => a !== b);
      const counts = (data: readonly (readonly [string, string])[]) =>
        ['RR', 'RB', 'BR', 'BB'].map(
          (c) => data.filter(([a, b]) => a[0]! + b[0] === c).length,
        );
      expect(pairs).toHaveLength(ids.length ** 2);
      expect(no).toHaveLength(ids.length * (ids.length - 1));
      expect(counts(pairs)).toEqual(wantedReplace);
      expect(counts(no)).toEqual(wantedNo);
      expect(no).toContainEqual(['R1', 'R2']);
      expect(no).toContainEqual(['R2', 'R1']);
      expect(no).not.toContainEqual(['R1', 'R1']);
      const [rr, rb, br, bb] = counts(no);
      expect(rr).toBe(r * (r - 1));
      expect(rb).toBe(r * 2);
      expect(br).toBe(2 * r);
      expect(bb).toBe(2);
      expect(textR(rational(BigInt(rb! + br!), BigInt(no.length)))).toBe(
        different,
      );
      // The conditional denominators change after the first draw.
      expect(
        textR(
          rational(BigInt(r * (r - 1)), BigInt(ids.length * (ids.length - 1))),
        ),
      ).toBe(u === 'H24' ? '3/10' : '1/6');
      expect(
        probabilityProcessRetrieval[u].questions[0]!.solution.zh,
      ).toContain(`余${no.length}格`);
    }
  });
  it('checks round-based frequencies moving farther from theory and undefined zero-round ratios', () => {
    for (const [u, success, rounds, theoryNumerator, theoryDenominator] of [
      ['H24', 4, 5, 3, 5],
      ['H33', 5, 6, 2, 3],
    ] as const) {
      const before = success * theoryDenominator - theoryNumerator * rounds;
      const after =
        (success + 1) * theoryDenominator - theoryNumerator * (rounds + 1);
      expect(before).toBeGreaterThan(0);
      expect(after).toBeGreaterThan(0);
      expect(after * rounds).toBeGreaterThan(before * (rounds + 1));
      const frequency = rational(BigInt(success), BigInt(rounds));
      const wrongDrawDenominator = rational(
        BigInt(success),
        BigInt(2 * rounds),
      );
      expect(textR(frequency)).not.toBe(textR(wrongDrawDenominator));
      expect(
        probabilityProcessRetrieval[u].questions[1]!.solution.en,
      ).toContain('Zero');
      expect(probabilityProcessRetrieval[u].questions[1]!.solution.en).toMatch(
        /restor/i,
      );
    }
    expect(() => readRational('0/0')).toThrow();
  });
  it('checks full-model independence while allowing a matching finite sample under a dependent mechanism', () => {
    const independent = (a: readonly number[]) =>
      a[0]! * a.reduce<number>((s, n) => s + n, 0) ===
      (a[0]! + a[1]!) * (a[0]! + a[2]!);
    for (const [u, model, sample] of [
      ['H24', [2, 2, 4, 4], [4, 4, 4, 4]],
      ['H33', [3, 2, 9, 6], [3, 2, 3, 2]],
    ] as const) {
      expect(independent(model)).toBe(true);
      expect(independent(sample)).toBe(true);
      expect(new Set(model).size).toBeGreaterThan(1); // Equiprobable IDs do not make the four categories equiprobable.
      const dependent = [4, 1, 1, 4];
      expect(independent(dependent)).toBe(false);
      // Every cell has positive mass, so a finite ordered record with these matching counts remains possible.
      expect(dependent.every((n) => n > 0)).toBe(true);
      expect(sample.every((n) => n > 0)).toBe(true);
      expect(probabilityProcessRetrieval[u].questions[2]!.stem.en).toContain(
        'observed sample',
      );
      expect(probabilityProcessRetrieval[u].questions[2]!.solution.en).toMatch(
        /not proof|does not prove/,
      );
    }
  });
  it('checks the reused nonresponse bounds and full-frame versus omitted-frame sampling expectations', () => {
    const survey = lessonById('H27-L05')!.exit;
    expect(survey.id).toBe('H27-L05-X');
    expect(survey.stem.zh).toContain('200');
    expect(survey.solution.zh).toContain('195/200');
    expect(15 + (200 - 20)).toBe(195);
    const population = [0, 0, 0, 6, 6, 6];
    const means = population.flatMap((a, i) =>
      population.slice(i + 1).map((b) => (a + b) / 2),
    );
    expect(means).toHaveLength(15);
    expect(means.reduce((a, b) => a + b, 0) / 15).toBe(3);
    const omitted = population.slice(0, 3),
      wrongMeans = omitted.flatMap((a, i) =>
        omitted.slice(i + 1).map((b) => (a + b) / 2),
      );
    expect(wrongMeans).toEqual([0, 0, 0]);
    expect(lessonById('H34-L01')!.questions[5]!.solution.zh).toContain(
      '概率加权期望',
    );
    expect(lessonById('H34-L01')!.exit.solution.zh).toContain(
      'B组三人完全遗漏',
    );
  });
});
