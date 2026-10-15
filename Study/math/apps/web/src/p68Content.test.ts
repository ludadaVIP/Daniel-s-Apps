import { describe, it, expect } from 'vitest';
import {
  p68Lessons,
  p68CheckQuestions,
  p68ReviewQuestion,
} from './content/P68';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer, exactRational } from './model';
import {
  journey,
  workModel,
  budgetModel,
  chartCost,
  tripModel,
  clock,
  fraction,
} from './appliedModels';
const markdown = import.meta.glob('../../../content/lessons/P68-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...p68Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...p68CheckQuestions,
];
const number = (s: string) => {
  const r = exactRational(s)!;
  return Number(r[0]) / Number(r[1]);
};
describe('P68 applied reasoning content and independent numerical oracles', () => {
  it('matches all five planned bilingual lessons and preserves the complete 358-lesson registry', () => {
    const planned = curriculum
      .flatMap((s) => s.units)
      .find((u) => u.id === 'P68')!;
    expect(p68Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    const registry = curriculum.flatMap((s) =>
      s.units.flatMap((u) => u.lessons),
    );
    expect(registry).toHaveLength(358);
    expect(
      registry
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(
      lessons.filter((l) => ['B00', 'P05', 'P06'].includes(l.stage ?? '')),
    ).toHaveLength(111);
    expect(unitChecks.P68.questions).toHaveLength(8);
    expect(new Set(p68Lessons.map((l) => l.lab)).size).toBe(5);
    for (const l of p68Lessons) {
      expect(l.stage).toBe('P06');
      expect(l.contentStatus).toBe('ready');
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const p = lessons.find((l) => l.id === id)!;
        expect(p, `${l.id} -> ${id}`).toBeTruthy();
        expect(lessons.indexOf(p)).toBeLessThan(lessons.indexOf(l));
      }
      const [zh, en] =
        markdown[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length, l.id).toBeGreaterThan(700);
      expect(en!.length, l.id).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      for (const text of [
        l.objective,
        l.hook,
        l.exitReason,
        l.parent.goal,
        l.parent.misconception,
        ...l.parent.prompts,
        ...l.keywords,
      ]) {
        expect(text.zh).toBeTruthy();
        expect(text.en).toBeTruthy();
      }
      expect(reviewQuestionFor(l.id, 0)).toEqual(p68ReviewQuestion(l.id, 0));
    }
  });
  it('checks all 48 unique items, bilingual hints, explicit distractors and manual rubrics', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    expect(all.filter((q) => q.answer.kind === 'number')).toHaveLength(36);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(6);
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      for (const text of [
        q.stem,
        q.solution,
        ...q.hints,
        ...q.solutionSteps!,
      ]) {
        expect(text.zh, q.id).toBeTruthy();
        expect(text.en, q.id).toBeTruthy();
      }
      if (q.answer.kind === 'explain') {
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(q.answer.rubric.en.length).toBeGreaterThan(300);
      } else {
        for (const s of q.answerChecks!.accepted)
          expect(checkAnswer(s, q.answer), `${q.id} accepts ${s}`).toBe(true);
        for (const s of q.answerChecks!.rejected)
          expect(checkAnswer(s, q.answer), `${q.id} rejects ${s}`).toBe(false);
      }
      for (const option of q.options ?? []) {
        expect(option.feedback.zh).toBeTruthy();
        expect(option.feedback.en).toBeTruthy();
      }
    }
  });
  it('independently transcribes every guided, practice, exit and quantitative check answer', () => {
    const answers = [
      ['4', '9', '1.5', '4', '60', '20/3'],
      ['12', '42', '40', '2.4', '30', '9'],
      ['80', '120', '120', '4', '76.80', '24'],
      ['82', '36', '72', '60', '1/3', '10'],
      ['100', '230', '44', '72', '30', '0'],
    ];
    p68Lessons.forEach((l, i) =>
      [l.guided, ...l.questions.slice(1, 5), l.exit].forEach((q, j) =>
        expect(checkAnswer(answers[i]![j]!, q.answer), q.id).toBe(true),
      ),
    );
    const checks = ['6', '6', '60', '9', '60', null, '200'];
    checks.forEach((a, i) => {
      if (a !== null)
        expect(checkAnswer(a!, p68CheckQuestions[i]!.answer)).toBe(true);
    });
    const choices = [1, 2, 0, 1, 2];
    p68Lessons.forEach((l, i) =>
      expect(l.questions[0]!.answer).toEqual({
        kind: 'choice',
        value: String(choices[i]),
      }),
    );
  });
  it('accepts exact time and speed units without accepting a different physical quantity', () => {
    const speed = p68Lessons[0]!.guided.answer,
      time = p68Lessons[0]!.questions[2]!.answer;
    expect(checkAnswer('36 人次', p68Lessons[3]!.questions[1]!.answer)).toBe(
      true,
    );
    expect(checkAnswer('36 people', p68Lessons[3]!.questions[1]!.answer)).toBe(
      false,
    );
    for (const s of [
      '4',
      '4 km/h',
      '4 kilometres per hour',
      '4 kilometers per hour',
      '4 千米/小时',
      '4 公里/小时',
    ])
      expect(checkAnswer(s, speed), s).toBe(true);
    for (const s of ['4 min', '4 km', '240', '4 h', '400%'])
      expect(checkAnswer(s, speed), s).toBe(false);
    for (const s of ['1.5 h', '3/2 小时', '1.5 hours'])
      expect(checkAnswer(s, time), s).toBe(true);
    for (const s of ['90 min', '1.5 km/h', '150%'])
      expect(checkAnswer(s, time), s).toBe(false);
    expect(checkAnswer('6.67 km/h', p68Lessons[0]!.exit.answer)).toBe(false);
    expect(checkAnswer('20/3 km/h', p68Lessons[0]!.exit.answer)).toBe(true);
    expect(checkAnswer('NZ$76.80', p68Lessons[2]!.questions[4]!.answer)).toBe(
      true,
    );
  });
  it('checks 180 journey cases against independently converted minutes and reconstructs distance', () => {
    for (let d = 1; d <= 12; d++)
      for (const moving of [15, 30, 45, 60, 120])
        for (const stop of [0, 15, 60]) {
          const m = journey(d, moving, stop);
          expect(number(m.averageSpeed)).toBeCloseTo(
            d / ((moving + stop) / 60),
            12,
          );
          expect(number(m.movingSpeed) * (moving / 60)).toBeCloseTo(d, 12);
          expect(m.elapsed).toBe(moving + stop);
          expect(number(m.averageSpeed)).toBeLessThanOrEqual(
            number(m.movingSpeed),
          );
        }
    expect(journey(0, 60, 30).averageSpeed).toBe('0');
  });
  it('checks 1519 pump states by minute-by-minute accumulation, capacity and zero-rate boundary', () => {
    for (let a = 0; a <= 6; a++)
      for (let b = 0; b <= 6; b++)
        for (let min = 0; min <= 30; min++) {
          let water = 0;
          for (let tick = 0; tick < min; tick++)
            water = Math.min(60, water + a + b);
          const m = workModel(60, [a, b], min);
          expect(m.done).toBe(water);
          expect(m.remaining).toBe(60 - water);
          if (a + b === 0) expect(m.finish).toBeNull();
          else expect(number(m.finish!) * (a + b)).toBeCloseTo(60, 12);
        }
    expect(workModel(12, [2, 3], 0).finish).toBe('12/5');
  });
  it('checks 1331 cent-exact budgets, discount scope and reserve equality', () => {
    for (let dollars = 60; dollars <= 160; dollars += 10)
      for (let discount = 0; discount <= 100; discount += 10)
        for (let reserve = 0; reserve <= 50; reserve += 5) {
          const m = budgetModel(dollars * 100, 8000, discount, 2000, reserve);
          const tickets = 80 * (100 - discount),
            protectedCents = dollars * reserve;
          expect(m.spend).toBe(tickets + 2000);
          expect(m.reserve).toBe(protectedCents);
          expect(m.headroom).toBe(
            dollars * 100 - protectedCents - tickets - 2000,
          );
          expect(m.feasible).toBe(
            tickets + 2000 + protectedCents <= dollars * 100,
          );
        }
    expect(budgetModel(8000, 3200, 25, 4800, 10)).toMatchObject({
      spend: 7200,
      reserve: 800,
      headroom: 0,
      feasible: true,
    });
  });
  it('keeps missing chart counts distinct from zero and fixed fees distinct from per-person costs', () => {
    expect(chartCost(null)).toBeNull();
    expect(chartCost(0)).toBe(1000);
    expect(chartCost(18)).toBe(8200);
    expect(chartCost(24)).toBe(10600);
  });
  it('checks 2736 trip combinations against independently transcribed six option costs and durations', () => {
    const alternatives = [
      ['direct', 'museum', 4000, 1200, 230],
      ['direct', 'garden', 4000, 800, 200],
      ['direct', 'trail', 4000, 0, 230],
      ['scenic', 'museum', 2400, 1200, 270],
      ['scenic', 'garden', 2400, 800, 240],
      ['scenic', 'trail', 2400, 0, 270],
    ] as const;
    for (let people = 1; people <= 8; people++)
      for (let dollars = 60; dollars <= 240; dollars += 10)
        for (const limit of [180, 240, 360])
          for (const [
            route,
            activity,
            fare,
            ticket,
            duration,
          ] of alternatives) {
            const spend = fare + (people * ticket * 3) / 4 + people * 600,
              reserve = dollars * 10,
              m = tripModel(
                people,
                dollars * 100,
                10,
                25,
                route,
                activity,
                limit,
              );
            expect(m.spend).toBe(spend);
            expect(m.elapsed).toBe(duration);
            expect(m.headroom).toBe(dollars * 100 - reserve - spend);
            expect(m.feasible).toBe(
              spend + reserve <= dollars * 100 && duration <= limit,
            );
            expect(m.timeline[0]!.from).toBe(0);
            expect(m.timeline.at(-1)!.to).toBe(duration);
            m.timeline.forEach((s, i) => {
              expect(s.to - s.from).toBe(s.minutes);
              if (i) expect(s.from).toBe(m.timeline[i - 1]!.to);
            });
          }
    const feasible = alternatives
      .filter(([r, a]) => tripModel(4, 8000, 10, 25, r, a, 240).feasible)
      .map(([r, a]) => `${r}-${a}`);
    expect(feasible).toEqual(['direct-trail', 'scenic-garden']);
    expect(clock(230)).toBe('12:50');
    expect(clock(240)).toBe('13:00');
  });
  it('independently evaluates all 400 retrieval variants, including minimum whole packs', () => {
    for (let i = 0; i < 5; i++)
      for (let round = 0; round < 80; round++) {
        const a = 1 + (round % 8),
          b = 1 + (Math.floor(round / 8) % 5);
        let expected: number;
        if (i === 0)
          expected = (2 * a) / ((30 + 15 * b + 15 * (round % 3)) / 60);
        else if (i === 1) {
          let minutes = 0,
            water = 0;
          while (water < (a + b) * (b + 2)) {
            water += a + b;
            minutes++;
          }
          expected = minutes;
        } else if (i === 2) expected = 20 * a - (20 * a * 5 * b) / 100 + 10 * b;
        else if (i === 3) {
          let packs = 0;
          while (packs * 4 < 4 * a + b) packs++;
          expected = packs * 4 * b;
        } else if (round % 2 === 1)
          expected =
            300 - (20 + 5 * a) - (30 + 10 * b) - 30 - (20 + 5 * a) - 30;
        else expected = 100 + 20 * a - (100 + 20 * a) / 10 - (40 + 10 * b);
        const q = p68ReviewQuestion(p68Lessons[i]!.id, round);
        if (q.answer.kind !== 'number') throw Error('Expected quantity');
        expect(number(q.answer.value), q.id).toBeCloseTo(expected, 12);
        expect(checkAnswer(q.answer.value, q.answer)).toBe(true);
        for (const s of q.answerChecks!.rejected)
          expect(checkAnswer(s, q.answer), `${q.id}: ${s}`).toBe(false);
      }
  });
  it('rejects inputs outside model and retrieval domains rather than creating false numeric answers', () => {
    for (const run of [
      () => journey(1, 0, 0),
      () => journey(-1, 60, 0),
      () => workModel(0, [1], 1),
      () => workModel(60, [], 1),
      () => workModel(60, [-1], 1),
      () => budgetModel(10001, 8000, 25, 2000, 10),
      () => budgetModel(10000, 1, 25, 0, 0),
      () => chartCost(-1),
      () => tripModel(0, 10000, 10, 25, 'direct', 'garden', 240),
      () => tripModel(4, 10000, 10, 25, 'unknown', 'garden', 240),
      () => fraction(1, 0),
      () => p68ReviewQuestion('P68-L06', 0),
      () => p68ReviewQuestion('P68-L01', -1),
      () => p68ReviewQuestion('P68-L01', 0.5),
      () => p68ReviewQuestion('P68-L01', 100001),
    ])
      expect(run).toThrow(RangeError);
  });
});
