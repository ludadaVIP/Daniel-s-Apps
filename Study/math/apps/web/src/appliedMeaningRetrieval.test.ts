import { describe, it, expect } from 'vitest';
import { appliedMeaningRetrieval } from './content/appliedMeaningRetrieval';
import { primaryCapstoneRecurrence } from './content/primaryCapstoneRecurrence';
import { maintenanceSets } from './content/maintenance';
import { lessonById, unitChecks, curriculum, lessons } from './content';
import { checkAnswer } from './model';
import {
  journey,
  workModel,
  budgetModel,
  chartCost,
  tripModel,
  clock,
} from './appliedModels';
import { percentRetrieval } from './content/percentRetrieval';
const sets = Object.values(appliedMeaningRetrieval);
const raw = (s: number, q: number) =>
  sets[s]!.questions[q - 1]!.contextTable!.rows;
describe('P68 quantities regenerated from original conditions', () => {
  it('retains ten references and reuses two existing percent tasks alongside eight shared new cards', () => {
    const entries = primaryCapstoneRecurrence.filter((e) =>
      e.sourceLesson.startsWith('P68-'),
    );
    expect(entries.flatMap((e) => e.targets)).toHaveLength(22);
    expect(new Set(entries.flatMap((e) => e.targets)).size).toBe(18);
    expect(
      entries.flatMap((e) =>
        e.targets.filter((t) => t.includes('MAINT-PRIMARY')),
      ),
    ).toHaveLength(10);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const [i, e] of entries.entries())
      for (const s of sets) {
        const q = s.questions[[0, 1, 3, 2, 3][i]!]!;
        expect(e.targets).toContain(q.id);
        expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('P68'));
        expect(Object.values(maintenanceSets).find((m) => m.id === s.id)).toBe(
          s,
        );
        expect(q.answer.kind).toBe('explain');
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
      }
    for (const s of sets)
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual([
        'P68-L01',
        'P68-L02',
        'P68-L04',
        'P68-L05',
      ]);
    for (const s of Object.values(percentRetrieval))
      expect(entries[2]!.targets).toContain(s.questions[5]!.id);
    expect(lessons).toHaveLength(358);
  });
  it('recovers stops and distance, recomputes round trips and separates the equal-time exception', () => {
    for (const [i, d, moving, stop, target, total, returnMoving, average] of [
      [0, 5, 40, 20, 4, 75, 20, '15/2'],
      [1, 7, 60, 45, 3.5, 120, 30, '56/9'],
    ] as const) {
      expect(raw(i, 1).map((r) => parseFloat(r[2]!.en))).toEqual([
        d,
        moving,
        stop,
      ]);
      expect(journey(d, moving, stop).averageSpeed).toBe(i === 0 ? '5' : '4');
      expect((d * 60) / target).toBe(total);
      expect(journey(d, moving, total - moving).averageSpeed).toBe(
        i === 0 ? '4' : '7/2',
      );
      expect(journey(2 * d, moving + returnMoving, stop).averageSpeed).toBe(
        average,
      );
      expect(journey(d, moving, 0).averageSpeed).toBe(
        journey(d, moving, stop).movingSpeed,
      );
      expect(journey(0, moving, stop).averageSpeed).toBe('0');
      expect(() => journey(d, 0, 0)).toThrow(RangeError);
      expect(sets[i]!.questions[0]!.solution.en).toContain(average);
    }
    expect((3 * 90) / 60).toBe(4.5);
    const distance = 6 * (30 / 60) + 12 * (30 / 60);
    expect(distance / (60 / 60)).toBe((6 + 12) / 2);
    expect((7.5 + 15) / 2).not.toBe(7.5);
    expect((7 + 14) / 2).not.toBeCloseTo(56 / 9);
  });
  it('distinguishes completed, remaining, additional and total work with explicit automatic shutoff', () => {
    for (const [i, amount, a, b, t, remaining, extra, finish, observe] of [
      [0, 60, 3, 2, 7, 25, '5', '12', 14],
      [1, 72, 4, 3, 5, 37, '37/7', '72/7', 12],
    ] as const) {
      expect(raw(i, 2).map((r) => parseFloat(r[2]!.en))).toEqual([
        amount,
        a,
        b,
        t,
      ]);
      expect(workModel(amount, [a, b], t)).toEqual({
        rate: a + b,
        done: 35,
        remaining,
        finish,
      });
      expect(workModel(remaining, [a, b], 0).finish).toBe(extra);
      expect(workModel(amount, [a, 0], 0).finish).toBe(i === 0 ? '20' : '18');
      expect(workModel(amount, [0, 0], t)).toEqual({
        rate: 0,
        done: 0,
        remaining: amount,
        finish: null,
      });
      expect(workModel(amount, [a, b], observe).done).toBe(amount);
      expect(workModel(amount, [a, b], observe).remaining).toBe(0);
      expect((a + b) * observe).toBeGreaterThan(amount);
      expect(workModel(amount, [a, b], 0).done).toBe(0);
      expect(sets[i]!.questions[1]!.solution.en).toContain(extra);
    }
  });
  it('preserves missing and zero, reverses the fixed fee and checks original-base and whole-pack boundaries', () => {
    for (const [
      i,
      counts,
      fare,
      fee,
      costs,
      total,
      low,
      high,
      axis,
      pack,
      price,
    ] of [
      [
        0,
        [8, null, 12, 0],
        300,
        900,
        [3300, null, 4500, 900],
        8700,
        8,
        12,
        6,
        4,
        5,
      ],
      [
        1,
        [10, 15, null, 0],
        200,
        800,
        [2800, 3800, null, 800],
        7400,
        10,
        15,
        5,
        5,
        4,
      ],
    ] as const) {
      const records = raw(i, 3)
        .slice(0, 4)
        .map((r) => (r[2]!.en === 'Missing' ? null : Number(r[2]!.en)));
      expect(records).toEqual(counts);
      const actual = records.map((n) => chartCost(n, fare, fee));
      expect(actual).toEqual(costs);
      expect(actual.reduce<number>((s, n) => s + (n ?? 0), 0)).toBe(total);
      expect(chartCost(null, fare, fee)).toBeNull();
      expect(chartCost(0, fare, fee)).toBe(fee);
      expect((high * fare + fee - fee) / fare).toBe(high);
      expect((high * fare + fee) / fare).not.toBe(high);
      expect((high - low) / low).toBe(0.5);
      expect((high - axis) / (low - axis)).not.toBe(high / low);
      expect(Math.ceil(high / pack)).toBe(3);
      expect(Math.ceil((high + 1) / pack)).toBe(4);
      expect(Math.ceil((high + 1) / pack) * price).toBe(i === 0 ? 20 : 16);
      expect(sets[i]!.questions[2]!.solution.en).toContain(String(total / 100));
    }
  });
  it('checks both constraints, clock endpoints and independent price/reserve/person changes from whole cents', () => {
    for (const [i, people, budget, reserve, spend, balance, headroom] of [
      [0, 4, 8000, 10, 7200, 800, 0],
      [1, 3, 9000, 20, 6000, 3000, 1200],
    ] as const) {
      expect(raw(i, 4).map((r) => r[0]!.en)).toEqual([
        'R1',
        'R2',
        'A1',
        'A2',
        'A3',
        'L',
        'B',
      ]);
      const m = tripModel(people, budget, reserve, 25, 'scenic', 'garden', 240);
      expect(m).toMatchObject({
        spend,
        usable: 7200,
        headroom,
        elapsed: 240,
        feasible: true,
        transport: 2400,
        lunch: people * 600,
      });
      expect(budget - m.spend).toBe(balance);
      expect(budget - m.spend).not.toBe(m.headroom);
      expect(m.timeline.map((s) => [clock(s.from), clock(s.to)])).toEqual([
        ['09:00', '10:00'],
        ['10:00', '11:00'],
        ['11:00', '11:30'],
        ['11:30', '12:30'],
        ['12:30', '13:00'],
      ]);
      expect(
        tripModel(people, budget, reserve, 25, 'scenic', 'garden', 210),
      ).toMatchObject({ headroom, timeHeadroom: -30, feasible: false });
      expect(
        tripModel(people + 1, budget, reserve, 25, 'scenic', 'garden', 240),
      ).toMatchObject({
        spend: i === 0 ? 8400 : 7200,
        transport: 2400,
        elapsed: 240,
        feasible: i === 1,
      });
      const alt = tripModel(
        people,
        budget,
        reserve,
        25,
        'direct',
        'trail',
        240,
      );
      expect(alt).toMatchObject({
        spend: i === 0 ? 6400 : 5800,
        elapsed: 230,
        feasible: true,
      });
      expect(clock(alt.elapsed)).toBe('12:50');
      expect(
        tripModel(people, budget, reserve, 0, 'scenic', 'garden', 240),
      ).toMatchObject({ spend: i === 0 ? 8000 : 6600, feasible: i === 1 });
      expect(
        tripModel(people, budget, reserve, 100, 'scenic', 'garden', 240).spend,
      ).toBe(i === 0 ? 4800 : 4200);
      expect(
        tripModel(people, budget, 0, 25, 'scenic', 'garden', 240),
      ).toMatchObject({ spend, usable: budget, headroom: balance });
      expect(sets[i]!.questions[3]!.solution.en).toContain('12:50');
    }
    expect(() => budgetModel(100, 1, 50, 0, 0)).toThrow('rounding');
    expect(120 * 0.75 * 1.25).toBe(112.5);
    expect(200 * 1.1 * 0.9).toBeCloseTo(198);
  });
  it('supplies raw conditions in direct practice/check entries and matches the fraction prompt to its exact answer', () => {
    const chart = lessonById('P68-L04')!;
    expect(chart.questions[4]!.stem.zh).toContain('几分之几');
    expect(checkAnswer('1/3', chart.questions[4]!.answer)).toBe(true);
    expect(checkAnswer('33.33%', chart.questions[4]!.answer)).toBe(false);
    for (const q of [
      chart.questions[0]!,
      chart.questions[5]!,
      unitChecks.P68!.questions[5]!,
    ])
      for (const language of ['zh', 'en'] as const)
        for (const n of ['12', '18', '24'])
          expect(q.stem[language]).toContain(n);
    const q4 = lessonById('P68-L05')!.questions[3]!;
    expect(q4.stem.en).toContain('NZ$6 each');
    expect(q4.stem.en).toContain('25% off');
    expect(checkAnswer('72', q4.answer)).toBe(true);
    for (const q of [
      lessonById('P68-L05')!.questions[5]!,
      unitChecks.P68!.questions[7]!,
    ]) {
      expect(q.contextTable!.rows).toHaveLength(7);
      expect(q.contextTable!.caption.en).toContain('RETURN');
      expect(q.contextTable!.rows.map((r) => r[0]!.en)).toEqual([
        'Direct',
        'Scenic',
        'Museum',
        'Garden',
        'Trail',
        'Lunch',
        'Buffer',
      ]);
      expect(q.contextTable!.rows[0]![2]!.en).toBe('40 group return');
      expect(q.contextTable!.rows[3]![2]!.en).toBe(
        '8 original ticket per person',
      );
      expect(q.contextTable!.rows[5]![2]!.en).toBe('6 per person');
      expect(q.contextTable!.rows[6]![1]!.en).toBe('30');
    }
  });
});
