import { describe, it, expect } from 'vitest';
import {
  p57Lessons,
  p57CheckQuestions,
  p57ReviewQuestion,
} from './content/P57';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
import {
  frequencyTable,
  meanSummary,
  shareOne,
  timeSeries,
  barScale,
  recipePlan,
} from './dataModels';
const markdown = import.meta.glob('../../../content/lessons/P57-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const items = [
  ...p57Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...p57CheckQuestions,
];
const value = (s: string) => {
  const [a, b = '1'] = s.split('/');
  return Number(a) / Number(b);
};
// Independent answers calculated from each original stem, not from the lesson or workshop helpers.
const expected = [
  [3, 9, 8, 2, 5, 6],
  [4, 4, 5 / 3, 24, 14, 4],
  [6, 8, 2, 2, 16, 6],
  [4, 3, 2, 6, 20, 7],
  [500, 450, 0.6, 400, 0.8, 100],
];
describe('P57 content and publication', () => {
  it('matches all five planned lessons with complete bilingual examples, parent support and earlier prerequisites', () => {
    const planned = curriculum
      .flatMap((s) => s.units)
      .find((u) => u.id === 'P57')!;
    expect(p57Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(lessons.filter((l) => l.unit === 'P57')).toHaveLength(5);
    expect(unitChecks.P57.questions).toHaveLength(8);
    expect(new Set(p57Lessons.map((l) => l.lab)).size).toBe(5);
    for (const l of p57Lessons) {
      expect(l.contentStatus).toBe('ready');
      expect(planned.lessons.find((p) => p.id === l.id)!.available).toBe(true);
      const [zh, en] =
        markdown[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length, l.id).toBeGreaterThan(700);
      expect(en!.length, l.id).toBeGreaterThan(1300);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(l.keywords).toHaveLength(3);
      expect(l.questions).toHaveLength(6);
      expect(
        l.questions.filter((q) => q.answer.kind === 'choice'),
      ).toHaveLength(1);
      expect(
        l.questions.filter((q) => q.answer.kind === 'explain'),
      ).toHaveLength(1);
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
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const prev = lessons.find((p) => p.id === id)!;
        expect(prev, `${l.id} → ${id}`).toBeTruthy();
        if (prev.unit === 'P57') expect(prev.order).toBeLessThan(l.order!);
      }
      expect(reviewQuestionFor(l.id, 0).id).toBe(`${l.id}-R0`);
    }
    const plannedAll = curriculum.flatMap((s) =>
      s.units.flatMap((u) => u.lessons),
    );
    expect(plannedAll).toHaveLength(358);
    expect(
      plannedAll
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(p57Lessons[4]!.familyChallenge!.en).toContain('no purchase');
  });
  it('checks every item’s feedback, bilingual steps, equivalence and manual reasoning', () => {
    expect(items).toHaveLength(48);
    expect(new Set(items.map((q) => q.id)).size).toBe(48);
    expect(items.filter((q) => q.answer.kind === 'number')).toHaveLength(36);
    expect(items.filter((q) => q.answer.kind === 'explain')).toHaveLength(6);
    for (const q of items) {
      expect(q.hints).toHaveLength(2);
      expect(q.misconceptionTags).toContain(q.skill);
      for (const text of [
        q.stem,
        ...q.hints,
        q.solution,
        ...q.solutionSteps!,
      ]) {
        expect(text.zh, q.id).toBeTruthy();
        expect(text.en, q.id).toBeTruthy();
      }
      if (q.answer.kind === 'explain') {
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(q.answer.rubric.en.length).toBeGreaterThan(100);
      } else {
        for (const a of q.answerChecks!.accepted)
          expect(checkAnswer(a, q.answer), `${q.id} accepts ${a}`).toBe(true);
        for (const a of q.answerChecks!.rejected)
          expect(checkAnswer(a, q.answer), `${q.id} rejects ${a}`).toBe(false);
      }
      q.options?.forEach((o) => {
        expect(o.feedback.zh).toBeTruthy();
        expect(o.feedback.en).toBeTruthy();
      });
    }
  });
  it('independently verifies all 36 authored numerical answers', () => {
    p57Lessons.forEach((l, i) => {
      const qs = [
        l.guided,
        ...l.questions.filter((q) => q.answer.kind === 'number'),
        l.exit,
      ];
      expect(qs).toHaveLength(6);
      qs.forEach((q, j) => {
        if (q.answer.kind !== 'number') throw new Error(q.id);
        expect(value(q.answer.value), q.id).toBeCloseTo(expected[i]![j]!, 12);
      });
    });
    const checkValues = [2, 4, 8, 6, 300, 7.8];
    p57CheckQuestions
      .filter((q) => q.answer.kind === 'number')
      .forEach((q, i) => {
        if (q.answer.kind === 'number')
          expect(value(q.answer.value), q.id).toBeCloseTo(checkValues[i]!, 12);
      });
  });
  it('accepts temperature and mass units without accepting a different quantity or rounded exact mean', () => {
    const temp = p57Lessons[2]!.guided.answer,
      mass = p57Lessons[4]!.guided.answer,
      mean = p57Lessons[1]!.questions[2]!.answer;
    for (const a of ['6 °C', '6℃', '6 摄氏度', '6 degrees Celsius', '12/2'])
      expect(checkAnswer(a, temp)).toBe(true);
    for (const a of ['6 °', '6 g', '6 min', '600%'])
      expect(checkAnswer(a, temp)).toBe(false);
    for (const a of ['500 g', '500 grams', '500 克', '1000/2'])
      expect(checkAnswer(a, mass)).toBe(true);
    for (const a of ['500 kg', '500 mL', '500 people'])
      expect(checkAnswer(a, mass)).toBe(false);
    expect(checkAnswer('10/6 张卡', mean)).toBe(true);
    expect(checkAnswer('1.67', mean)).toBe(false);
  });
  it('independently evaluates 400 retrieval rounds across missing data, exact means, changes and pack purchases', () => {
    for (let k = 0; k < 80; k++)
      for (let i = 0; i < 5; i++) {
        const l = p57Lessons[i]!,
          q = p57ReviewQuestion(l.id, k),
          n = 2 + (k % 8),
          b = Math.floor(k / 8),
          servings = 2 + (k % 11);
        const amount = [
          k % 2 ? n + 1 + (b % 4) + 2 : 1 + (b % 3),
          k % 2 ? (2 * n + 1) / 3 : n + 2,
          k % 2 ? b + 1 : 2 * n,
          2 + b,
          k % 2 ? servings * 50 : servings <= 10 ? 2.4 : 4.8,
        ][i]!;
        if (q.answer.kind !== 'number') throw new Error(q.id);
        expect(value(q.answer.value), q.id).toBeCloseTo(amount, 12);
        for (const a of q.answerChecks!.accepted)
          expect(checkAnswer(a, q.answer), q.id).toBe(true);
        for (const a of q.answerChecks!.rejected)
          expect(checkAnswer(a, q.answer), q.id).toBe(false);
        expect(q.id).toBe(`${l.id}-R${k}`);
      }
    for (const l of p57Lessons) {
      expect(p57ReviewQuestion(l.id, 0).stem).not.toEqual(
        p57ReviewQuestion(l.id, 1).stem,
      );
      for (const k of [-1, 0.5, Infinity, Number.MAX_SAFE_INTEGER + 1])
        expect(() => p57ReviewQuestion(l.id, k)).toThrow();
    }
    expect(() => p57ReviewQuestion('P57-L99', 0)).toThrow();
  });
});
describe('P57 independent data models', () => {
  it('keeps missing distinct from zero frequency and checks exact accounting for all short response sequences', () => {
    for (let code = 0; code < 256; code++) {
      let n = code;
      const seq: (string | null)[] = [];
      for (let j = 0; j < 4; j++) {
        seq.push(['a', 'b', 'c', null][n % 4]!);
        n = Math.floor(n / 4);
      }
      const m = frequencyTable(['a', 'b', 'c', 'unused'], seq);
      expect(m.rows.reduce((s, r) => s + r.count, 0) + m.missing).toBe(
        seq.length,
      );
      expect(m.recorded).toBe(seq.filter((x) => x !== null).length);
      expect(m.rows[3]!.count).toBe(0);
      m.rows.forEach((row) =>
        expect(row.count).toBe(seq.filter((x) => x === row.id).length),
      );
    }
    expect(frequencyTable(['a'], [null, null])).toMatchObject({
      recorded: 0,
      missing: 2,
      invited: 2,
    });
    expect(frequencyTable(['a'], [])).toMatchObject({
      recorded: 0,
      missing: 0,
      invited: 0,
    });
    for (const fn of [
      () => frequencyTable(['a', 'a'], []),
      () => frequencyTable(['a'], ['z']),
      () => frequencyTable([], []),
      () => frequencyTable([''], []),
    ])
      expect(fn).toThrow();
  });
  it('conserves totals and exact rational means under fair-share transfers, including zeros and fractional terminal piles', () => {
    for (let a = 0; a < 7; a++)
      for (let b = 0; b < 7; b++)
        for (let c = 0; c < 7; c++) {
          let piles = [a, b, c];
          const sum = a + b + c;
          const original = [...piles];
          const m = meanSummary(piles);
          expect(m.n * 3).toBe(sum * m.d);
          expect(m.count).toBe(3);
          for (let step = 0; step < 20; step++) piles = shareOne(piles);
          expect(piles.reduce((s, v) => s + v, 0)).toBe(sum);
          expect(Math.max(...piles) - Math.min(...piles)).toBeLessThanOrEqual(
            1,
          );
          expect(original).toEqual([a, b, c]);
          expect(meanSummary(piles)).toEqual(m);
        }
    expect(meanSummary([0, 0, 0])).toMatchObject({ n: 0, d: 1 });
    expect(meanSummary([1, 2, 2])).toMatchObject({ n: 5, d: 3 });
    expect(meanSummary([2, 2, 2, 18])).toMatchObject({ total: 24, mean: 6 });
    for (const data of [[], [-1, 2], [1.5, 2], [NaN, 2]])
      expect(() => meanSummary(data)).toThrow();
  });
  it('uses actual time distances, preserves values under scale change and never bridges missing observations', () => {
    const points = [
      { time: 0, value: 12 },
      { time: 1, value: 16 },
      { time: 3, value: 14 },
      { time: 6, value: 20 },
    ];
    const a = timeSeries(points, 24),
      b = timeSeries(points, 40);
    expect(a.points.map((p) => p.x)).toEqual([60, 130, 270, 480]);
    expect(a.segments).toHaveLength(3);
    expect(b.points.map((p) => p.value)).toEqual(a.points.map((p) => p.value));
    expect(a.points[1]!.y).toBe(120);
    expect(b.points[1]!.y).toBe(176);
    const missing = timeSeries(
      points.map((p, i) => ({ ...p, value: i === 2 ? null : p.value })),
      24,
    );
    expect(missing.segments).toHaveLength(1);
    expect(missing.points[2]!.y).toBeNull();
    expect(
      timeSeries(
        [
          { time: 0, value: 0 },
          { time: 1, value: 0 },
        ],
        10,
      ).segments,
    ).toHaveLength(1);
    for (const ps of [
      [
        { time: 0, value: 1 },
        { time: 0, value: 2 },
      ],
      [
        { time: 1, value: 1 },
        { time: 0, value: 2 },
      ],
      [
        { time: 0, value: 1 },
        { time: 1, value: 25 },
      ],
      [
        { time: 0, value: 1 },
        { time: NaN, value: 2 },
      ],
    ])
      expect(() => timeSeries(ps, 24)).toThrow();
  });
  it('draws a mathematically faithful truncated scale without changing the underlying counts', () => {
    const values = [40, 44],
      zero = barScale(values, 0, 50),
      cut = barScale(values, 38, 50);
    expect(cut[1]!.height / cut[0]!.height).toBe(3);
    expect(values[1]! / values[0]!).toBe(1.1);
    expect(cut.map((x) => x.value)).toEqual(zero.map((x) => x.value));
    expect(cut[1]!.height - cut[0]!.height).toBe(((44 - 40) / (50 - 38)) * 210);
    expect(barScale([0, 0], 0, 50).map((b) => b.height)).toEqual([0, 0]);
    for (const fn of [
      () => barScale([40], 40, 40),
      () => barScale([20], 38, 50),
      () => barScale([1], 0, Infinity),
    ])
      expect(fn).toThrow();
  });
  it('finds minimal sufficient whole packs by enumeration and performs money arithmetic in cents', () => {
    for (let servings = 1; servings <= 12; servings++)
      for (const budget of [0, 500, 600, 800]) {
        const m = recipePlan(servings, budget),
          flour = servings * 50,
          milk = servings * 75;
        const packs = [1, 2, 3].find((n) => n * 500 >= flour)!;
        const cartons = [1, 2].find((n) => n * 1000 >= milk)!;
        expect(m.flourG).toBe(flour);
        expect(m.milkMl).toBe(milk);
        expect(m.flourPacks).toBe(packs);
        expect(m.milkPacks).toBe(cartons);
        expect(m.costCents).toBe(packs * 240 + cartons * 300);
        expect(m.balanceCents + m.costCents).toBe(budget);
        expect(m.flourLeft + flour).toBe(packs * 500);
        expect(m.milkLeft + milk).toBe(cartons * 1000);
      }
    expect(recipePlan(10, 600)).toMatchObject({
      costCents: 540,
      balanceCents: 60,
      milkLeft: 250,
    });
    expect(recipePlan(12, 700)).toMatchObject({
      costCents: 780,
      balanceCents: -80,
      flourLeft: 400,
    });
    for (const n of [0, 13, 1.5, NaN])
      expect(() => recipePlan(n, 600)).toThrow();
  });
});
