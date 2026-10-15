import { describe, it, expect } from 'vitest';
import {
  p61Lessons,
  p61CheckQuestions,
  p61ReviewQuestion,
} from './content/P61';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
import {
  repeatFraction,
  fractionProduct,
  areaProduct,
  partOfAmount,
  shareFraction,
  fractionQuotient,
  fractionText,
} from './fractionProductModels';
const markdown = import.meta.glob('../../../content/lessons/P61-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const items = [
  ...p61Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...p61CheckQuestions,
];
const number = (s: string) => {
  const [a, b = '1'] = s.split('/');
  return Number(a) / Number(b);
};
// Independently transcribed calculations from each authored stem: guided, Q2–Q5, exit.
const answers = [
  [9 / 4, 8 / 3, 5 / 2, 0, 5 / 6, 3 / 2],
  [1 / 2, 1 / 5, 3 / 5, 0, 5 / 6, 1 / 2],
  [8, 12, 15, 10 / 3, 12, 9],
  [3 / 8, 1 / 6, 1 / 4, 0, 1 / 8, 5 / 12],
  [8 / 3, 6, 2 / 3, 2, 1 / 2, 9 / 2],
  [9 / 8, 8 / 3, 1 / 2, 5 / 3, 0, 5 / 6],
];
describe('P61 authored learning content', () => {
  it('publishes six planned bilingual lessons with complete examples, explicit units and backwards prerequisites', () => {
    const planned = curriculum
      .flatMap((s) => s.units)
      .find((u) => u.id === 'P61')!;
    expect(p61Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(lessons.filter((l) => l.unit === 'P61')).toHaveLength(6);
    expect(unitChecks.P61.questions).toHaveLength(8);
    expect(new Set(p61Lessons.map((l) => l.lab)).size).toBe(6);
    for (const l of p61Lessons) {
      expect(l.stage).toBe('P06');
      expect(l.contentStatus).toBe('ready');
      expect(planned.lessons.find((p) => p.id === l.id)!.available).toBe(true);
      const [zh, en] =
        markdown[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length, l.id).toBeGreaterThan(700);
      expect(en!.length, l.id).toBeGreaterThan(1300);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.parent.prompts).toHaveLength(2);
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
        const previous = lessons.find((p) => p.id === id)!;
        expect(previous, `${l.id}→${id}`).toBeTruthy();
        if (previous.unit === 'P61')
          expect(previous.order).toBeLessThan(l.order!);
      }
      expect(reviewQuestionFor(l.id, 0).id).toBe(`${l.id}-R0`);
    }
    const all = curriculum.flatMap((s) => s.units.flatMap((u) => u.lessons));
    expect(all).toHaveLength(358);
    expect(
      all
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(p61Lessons[5]!.familyChallenge!.en).toContain(
      'No pouring, purchase',
    );
  });
  it('checks all 56 unique items, specific feedback and manual explanation rubrics', () => {
    expect(items).toHaveLength(56);
    expect(new Set(items.map((q) => q.id)).size).toBe(56);
    expect(items.filter((q) => q.answer.kind === 'number')).toHaveLength(42);
    expect(items.filter((q) => q.answer.kind === 'explain')).toHaveLength(7);
    for (const q of items) {
      expect(q.hints).toHaveLength(2);
      expect(q.misconceptionTags).toContain(q.skill);
      for (const text of [
        q.stem,
        q.solution,
        ...q.solutionSteps!,
        ...q.hints,
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
  it('independently verifies every authored numeric answer and distinguishes complete groups from exact quotients', () => {
    p61Lessons.forEach((l, i) => {
      const qs = [
        l.guided,
        ...l.questions.filter((q) => q.answer.kind === 'number'),
        l.exit,
      ];
      expect(qs).toHaveLength(6);
      qs.forEach((q, j) => {
        if (q.answer.kind !== 'number') throw new Error(q.id);
        expect(number(q.answer.value), q.id).toBeCloseTo(answers[i]![j]!, 12);
      });
    });
    const checks = [3 / 2, 1 / 2, 15, 1 / 6, 8 / 3, 5 / 6];
    p61CheckQuestions
      .filter((q) => q.answer.kind === 'number')
      .forEach((q, i) => {
        if (q.answer.kind === 'number')
          expect(number(q.answer.value), q.id).toBeCloseTo(checks[i]!, 12);
      });
    expect(checkAnswer('8/3', p61Lessons[4]!.questions[3]!.answer)).toBe(false);
    expect(checkAnswer('2', p61Lessons[4]!.guided.answer)).toBe(false);
    expect(checkAnswer('2/3 L', p61Lessons[4]!.questions[4]!.answer)).toBe(
      false,
    );
  });
  it('accepts equivalent fractions, exact decimals and correct bilingual units while rejecting wrong measurement objects', () => {
    const litre = p61Lessons[0]!.guided.answer,
      groups = p61Lessons[4]!.guided.answer;
    for (const s of ['9/4 L', '2.25 litres', '18/8 升'])
      expect(checkAnswer(s, litre)).toBe(true);
    for (const s of ['8/3 groups', '16/6 份', '8/3 组'])
      expect(checkAnswer(s, groups)).toBe(true);
    for (const s of ['8/3 L', '2', '2.67', '800/3%'])
      expect(checkAnswer(s, groups)).toBe(false);
    for (const s of ['9/4 groups', '2.25 m', '225%'])
      expect(checkAnswer(s, litre)).toBe(false);
    expect(checkAnswer('9 克', p61Lessons[2]!.exit.answer)).toBe(true);
    expect(checkAnswer('0 groups', p61Lessons[5]!.questions[4]!.answer)).toBe(
      true,
    );
  });
  it('verifies 480 retrieval evaluations independently and rejects invalid round identifiers', () => {
    for (let k = 0; k < 80; k++)
      for (let i = 0; i < 6; i++) {
        const l = p61Lessons[i]!,
          q = p61ReviewQuestion(l.id, k),
          n = 1 + (k % 5),
          d = 2 + (Math.floor(k / 5) % 7),
          a = 1 + (Math.floor(k / 35) % 2);
        const p = 1 + (k % 3),
          b = 3 + (Math.floor(k / 3) % 4),
          c = 1 + (Math.floor(k / 12) % 3),
          e = 4 + (Math.floor(k / 36) % 3);
        const total = 1 + (k % 3),
          gn = 1 + (Math.floor(k / 3) % 3),
          gd = 2 + (Math.floor(k / 9) % 5);
        const an = 1 + (k % 5),
          ad = 2 + (Math.floor(k / 5) % 5),
          bn = 1 + (Math.floor(k / 25) % 3),
          bd = 2 + (Math.floor(k / 3) % 5);
        const expected = [
          ((a + 1) * n) / d,
          ((p / b) * c) / e,
          (a + 2) * n,
          n / d / (a + 1),
          (total * gd) / gn,
          an / ad / (bn / bd),
        ][i]!;
        if (q.answer.kind !== 'number') throw new Error(q.id);
        expect(number(q.answer.value), q.id).toBeCloseTo(expected, 12);
        for (const v of q.answerChecks!.accepted)
          expect(checkAnswer(v, q.answer), `${q.id} ${v}`).toBe(true);
        for (const v of q.answerChecks!.rejected)
          expect(checkAnswer(v, q.answer), `${q.id} ${v}`).toBe(false);
        expect(q.id).toBe(`${l.id}-R${k}`);
      }
    for (const l of p61Lessons) {
      expect(p61ReviewQuestion(l.id, 0).stem).not.toEqual(
        p61ReviewQuestion(l.id, 1).stem,
      );
      for (const k of [-1, 0.5, Infinity, Number.MAX_SAFE_INTEGER + 1])
        expect(() => p61ReviewQuestion(l.id, k)).toThrow();
    }
    expect(() => p61ReviewQuestion('P61-L99', 0)).toThrow();
  });
});
describe('P61 exact representations and arithmetic', () => {
  it('counts repeated unit fractions, preserving the denominator and zero-group meaning', () => {
    for (let d = 1; d <= 8; d++)
      for (let n = 0; n <= 2 * d; n++)
        for (let count = 0; count <= 6; count++) {
          const m = repeatFraction(count, { n, d });
          expect(m.raw.d).toBe(d);
          expect(m.result.n * d).toBe(count * n * m.result.d);
        }
    expect(fractionText(repeatFraction(3, { n: 3, d: 4 }).result)).toBe('9/4');
    expect(() => repeatFraction(-1, { n: 1, d: 2 })).toThrow();
  });
  it('counts overlap against original unit frames, including zero, improper factors and four whole products', () => {
    for (let b = 1; b <= 6; b++)
      for (let d = 1; d <= 6; d++)
        for (let a = 0; a <= 2 * b; a++)
          for (let c = 0; c <= 2 * d; c++) {
            const m = areaProduct({ n: a, d: b }, { n: c, d });
            const overlap = m.cells.filter((cell) => cell.overlap);
            expect(overlap).toHaveLength(a * c);
            expect(m.cellsPerWhole).toBe(b * d);
            expect(
              new Set(m.cells.map((cell) => `${cell.x},${cell.y}`)).size,
            ).toBe(m.columns * m.rows);
            expect(m.result.n * b * d).toBe(a * c * m.result.d);
            expect(
              m.cells.filter((cell) => cell.vertical && cell.horizontal),
            ).toEqual(overlap);
          }
    expect(areaProduct({ n: 5, d: 4 }, { n: 2, d: 3 })).toMatchObject({
      cellsPerWhole: 12,
      across: 2,
      result: { n: 5, d: 6 },
    });
    expect(
      areaProduct({ n: 2, d: 1 }, { n: 2, d: 1 }).cells.filter(
        (c) => c.overlap,
      ),
    ).toHaveLength(4);
    expect(fractionProduct({ n: 3, d: 1 }, { n: 3, d: 1 }).result).toEqual({
      n: 9,
      d: 1,
    });
  });
  it('shares the original amount into equal labelled allocations and multiplies each share back', () => {
    for (let d = 1; d <= 8; d++)
      for (let n = 0; n <= 2 * d; n++)
        for (let people = 1; people <= 6; people++) {
          const m = shareFraction({ n, d }, people);
          expect(m.pieces).toHaveLength(n * people);
          for (let person = 0; person < people; person++)
            expect(m.pieces.filter((p) => p.owner === person)).toHaveLength(n);
          expect(m.result.n * people * d).toBe(n * m.result.d);
          expect(m.selected * d).toBe(n * m.denominator);
        }
    expect(shareFraction({ n: 3, d: 4 }, 2).result).toEqual({ n: 3, d: 8 });
    for (const people of [0, -1, 1.5])
      expect(() => shareFraction({ n: 1, d: 2 }, people)).toThrow();
  });
  it('finds part-of-amount values using an independent per-share calculation without forcing integer litres', () => {
    for (let amount = 0; amount <= 48; amount++)
      for (let d = 1; d <= 8; d++)
        for (let n = 0; n <= d; n++) {
          const m = partOfAmount(amount, { n, d });
          expect(m.result.n * d).toBe(amount * n * m.result.d);
          expect(m.each.n * d).toBe(amount * m.each.d);
        }
    expect(partOfAmount(5, { n: 2, d: 3 }).result).toEqual({ n: 10, d: 3 });
  });
  it('independently checks division, whole groups and the different remainder references by repeated subtraction', () => {
    for (let b = 1; b <= 6; b++)
      for (let d = 1; d <= 6; d++)
        for (let a = 0; a <= 2 * b; a++)
          for (let c = 1; c <= 2 * d; c++) {
            const m = fractionQuotient({ n: a, d: b }, { n: c, d });
            let remaining = a * d,
              count = 0;
            while (remaining >= b * c) {
              remaining -= b * c;
              count++;
            }
            expect(m.fullGroups).toBe(count);
            expect(m.result.n * b * c).toBe(a * d * m.result.d);
            expect(m.remainder.n * b * d).toBe(remaining * m.remainder.d);
            expect(m.fractionOfGroup.n * b * c).toBe(
              remaining * m.fractionOfGroup.d,
            );
            expect(m.reciprocal.n * c).toBe(d * m.reciprocal.d);
            expect(m.total).toBe(m.fullGroups * m.perGroup + m.remainderUnits);
            expect(m.remainderUnits).toBeLessThan(m.perGroup);
          }
    expect(fractionQuotient({ n: 2, d: 1 }, { n: 3, d: 4 })).toMatchObject({
      result: { n: 8, d: 3 },
      fullGroups: 2,
      remainder: { n: 1, d: 2 },
      fractionOfGroup: { n: 2, d: 3 },
    });
    expect(fractionQuotient({ n: 3, d: 4 }, { n: 2, d: 3 })).toMatchObject({
      result: { n: 9, d: 8 },
      remainder: { n: 1, d: 12 },
      fractionOfGroup: { n: 1, d: 8 },
    });
    expect(fractionQuotient({ n: 0, d: 1 }, { n: 2, d: 3 }).result).toEqual({
      n: 0,
      d: 1,
    });
  });
  it('rejects zero divisors and illegal visual inputs without producing a fabricated quotient', () => {
    for (const a of [
      { n: 0, d: 1 },
      { n: 1, d: 2 },
    ])
      expect(() => fractionQuotient(a, { n: 0, d: 3 })).toThrow();
    for (const fn of [
      () => fractionProduct({ n: 1, d: 0 }, { n: 1, d: 2 }),
      () => areaProduct({ n: 3, d: 1 }, { n: 1, d: 2 }),
      () => repeatFraction(7, { n: 1, d: 2 }),
      () => fractionQuotient({ n: -1, d: 2 }, { n: 1, d: 2 }),
      () => partOfAmount(3.5, { n: 1, d: 2 }),
    ])
      expect(fn).toThrow();
  });
});
