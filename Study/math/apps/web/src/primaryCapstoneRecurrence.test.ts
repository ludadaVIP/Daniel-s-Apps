import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { primaryCapstoneRetrieval } from './content/primaryCapstoneRetrieval';
import { primaryCapstoneRecurrence } from './content/primaryCapstoneRecurrence';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import { maintenanceSets } from './content/maintenance';
const sets = Object.values(primaryCapstoneRetrieval);
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
describe('primary capstone recurrence', () => {
  it('locates all fifteen P66-P68 skills in at least two distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => ['P66', 'P67', 'P68'].includes(l.unit!))
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(15);
    expect(new Set(primaryCapstoneRecurrence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of primaryCapstoneRecurrence) {
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
          return target.unit;
        }),
      );
      expect(owners.size, e.skill).toBeGreaterThanOrEqual(2);
      expect(
        e.rationale.zh && e.rationale.en && e.focus.zh && e.focus.en,
      ).toBeTruthy();
    }
  });
  it('requires twenty bilingual process arguments, with all ten positions within persisted-session bounds', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(20);
    for (const s of sets) {
      expect(s.questions).toHaveLength(10);
      expect(s.id).not.toBe(unitChecks[s.unit as keyof typeof unitChecks].id);
      expect(lessons.some((l) => l.id === s.id)).toBe(false);
      for (const q of s.questions) {
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.zh && h.en)).toBe(true);
        expect(checkAnswer(q.solution.zh, q.answer)).toBeNull();
        expect(
          checkAnswer('9π 25π 108 102 240 same unit reserve median', q.answer),
        ).toBeNull();
        expect(lessonById(s.bridgeByQuestion[q.id]!)).toBeDefined();
      }
      expect(s.questions.filter((q) => q.contextTable)).toHaveLength(1);
      const table = s.questions[9]!.contextTable!;
      expect(table.columns).toHaveLength(3);
      expect(table.rows).toHaveLength(6);
      expect(
        table.rows.every(
          (row) => row.length === 3 && row.every((c) => c.zh && c.en),
        ),
      ).toBe(true);
    }
  });
  it('independently verifies finite readings, valid chords and dimensional coefficients', () => {
    for (const [circTenths, diameter, numerator, denominator] of [
      [314, 10, 314, 100],
      [629, 20, 3145, 1000],
      [189, 6, 315, 100],
      [251, 8, 31375, 10000],
    ]) {
      expect(circTenths! * denominator!).toBe(numerator! * 10 * diameter!);
    }
    for (const [r, x, y] of [
      [5, 3, 4],
      [13, 5, 12],
    ])
      expect(x! * x! + y! * y!).toBe(r! * r!);
    expect([2 * (3 / 2), 7 / 2 / 2]).toEqual([3, 7 / 4]);
    expect([3 * 314, (7 / 2) * 314]).toEqual([942, 1099]);
    expect([3 ** 2 * 314, 5 ** 2 * 314]).toEqual([2826, 7850]);
    // Integer coefficients of π; areas and volumes retain different dimensions.
    for (const [r, h, side, open, closed, volume] of [
      [3, 8, 48, 57, 66, 72],
      [2, 6, 24, 28, 32, 24],
    ]) {
      expect(2 * r! * h!).toBe(side!);
      expect(side! + r! ** 2).toBe(open!);
      expect(open! + r! ** 2).toBe(closed!);
      expect(r! ** 2 * h!).toBe(volume!);
    }
  });
  it('checks all observations, tied modes and the two active frequency targets', () => {
    for (const [values, total, median, modes, tail, newTotal] of [
      [[2, 2, 4, 6, 6, 10], 30, 5, [2, 6], 40, 60],
      [[0, 0, 3, 5, 5, 11], 24, 4, [0, 5], 41, 54],
    ] as const) {
      const a: number[] = [...values];
      expect(a.reduce((s, n) => s + n, 0)).toBe(total);
      expect((a[2]! + a[3]!) / 2).toBe(median);
      const zeroTail = [...values.slice(0, 5), 0].sort((a, b) => a - b);
      expect((zeroTail[2]! + zeroTail[3]!) / 2).toBe(total === 30 ? 3 : 3 / 2);
      const owner = total === 30 ? 'J91' : 'J92';
      expect(
        primaryCapstoneRetrieval[owner].questions[5]!.solution.zh,
      ).toContain(total === 30 ? '中位数3min' : '中位数3/2cm、唯一众数0');
      const f = new Map<number, number>();
      for (const x of a) f.set(x, (f.get(x) ?? 0) + 1);
      const peak = Math.max(...f.values());
      expect([...f].filter(([, n]) => n === peak).map(([x]) => x)).toEqual([
        ...modes,
      ]);
      a[5] = tail;
      expect(a.reduce((s, n) => s + n, 0)).toBe(newTotal);
      expect((a[2]! + a[3]!) / 2).toBe(median);
    }
    const oracle = new Map([
      ['J97-L05-Q4', '58/100'],
      ['J97-L05-Q5', `${58 + 3}/${100 + 10}`],
    ]);
    const ids = new Set(primaryCapstoneRecurrence.flatMap((e) => e.targets));
    expect(
      new Set(
        [...ids].filter((id) => tasks.get(id)!.q.answer.kind !== 'explain'),
      ),
    ).toEqual(new Set(oracle.keys()));
    for (const [id, value] of oracle) {
      const q = tasks.get(id)!.q;
      expect(checkAnswer(value, q.answer), id).toBe(true);
      expect(checkAnswer('3/5', q.answer)).toBe(false);
      for (const a of q.answerChecks?.accepted ?? [])
        expect(checkAnswer(a, q.answer)).toBe(true);
      for (const a of q.answerChecks?.rejected ?? [])
        expect(checkAnswer(a, q.answer)).toBe(false);
    }
  });
  it('recomputes rates, whole-pack costs and every alternative of both joint-constraint plans', () => {
    expect([
      4 / (40 / 60),
      4 / ((40 + 20) / 60),
      8 / ((40 + 20 + 20) / 60),
    ]).toEqual([6, 4, 6]);
    expect([
      6 / (45 / 60),
      6 / ((45 + 15) / 60),
      12 / ((45 + 15 + 30) / 60),
    ]).toEqual([8, 6, 8]);
    expect(60 / (60 / 20 + 60 / 30)).toBe(12);
    expect(72 / (72 / 24 + 72 / 18)).toBe(72 / 7);
    expect([3 * 72, 4 * 72].reduce((s, n) => s + n, 0)).toBe(72 * 7);
    expect([60 / 4, 72 / 5]).toEqual([15, 14.4]);
    const packCosts = (
      counts: number[],
      size: number,
      price: number,
      fixed: number,
    ) => counts.map((n) => Math.ceil(n / size) * price + fixed);
    expect(packCosts([12, 18, 0], 5, 3, 10)).toEqual([19, 22, 10]);
    expect(packCosts([7, 0, 13], 4, 2, 6)).toEqual([10, 6, 14]);
    for (const s of [
      {
        people: 4,
        budget: 12000,
        reserve: 10,
        travel: [3200, 2000],
        times: [80, 140],
        tickets: [1200, 800],
        activity: [60, 100],
        lunch: 1000,
        limit: 240,
        costs: [10800, 10400, 9600, 9200],
        durations: [200, 240, 260, 300],
        spendable: 10800,
      },
      {
        people: 3,
        budget: 15000,
        reserve: 20,
        travel: [3600, 1800],
        times: [60, 120],
        tickets: [1600, 1000],
        activity: [60, 90],
        lunch: 1200,
        limit: 210,
        costs: [10800, 10200, 9000, 8400],
        durations: [180, 210, 240, 270],
        spendable: 12000,
      },
    ]) {
      const rows = s.travel.flatMap((fare, r) =>
        s.tickets.map((ticket, a) => ({
          cost:
            fare +
            (s.people * ticket * (a === 0 ? 75 : 100)) / 100 +
            s.people * s.lunch,
          time: s.times[r]! + s.activity[a]! + 30 + 30,
        })),
      );
      expect((s.budget * (100 - s.reserve)) / 100).toBe(s.spendable);
      expect(rows.map((x) => x.cost)).toEqual(s.costs);
      expect(rows.map((x) => x.time)).toEqual(s.durations);
      expect(
        rows.map((x) => x.cost <= s.spendable && x.time <= s.limit),
      ).toEqual([true, true, false, false]);
    }
  });
});
