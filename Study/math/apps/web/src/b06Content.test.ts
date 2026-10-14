import { describe, it, expect } from 'vitest';
import {
  b06Lessons,
  b06CheckQuestions,
  b06ReviewQuestion,
} from './content/B06';
import { lessons, curriculum } from './content';
import { checkAnswer } from './model';
import {
  barRelation,
  cardJourney,
  relevantFacts,
  exactSelection,
} from './problemModels';
const markdown = import.meta.glob('../../../content/lessons/B06-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const questions = [
  ...b06Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...b06CheckQuestions,
];
describe('B06 authored problem-solving content', () => {
  it('matches all five planned bilingual lessons with examples, parent support and valid prerequisites', () => {
    const planned = curriculum
      .flatMap((s) => s.units)
      .find((u) => u.id === 'B06')!;
    expect(b06Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(new Set(b06Lessons.map((l) => l.lab)).size).toBe(5);
    for (const l of b06Lessons) {
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
      for (const copy of [
        l.objective,
        l.hook,
        l.exitReason,
        l.parent.goal,
        l.parent.misconception,
        ...l.parent.prompts,
      ]) {
        expect(copy.zh, l.id).toBeTruthy();
        expect(copy.en, l.id).toBeTruthy();
      }
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const p = [...lessons, ...b06Lessons].find((p) => p.id === id);
        expect(p, `${l.id}→${id}`).toBeTruthy();
        if (p!.unit === 'B06') expect(p!.order).toBeLessThan(l.order!);
      }
    }
    expect(b06Lessons[4]!.familyChallenge!.en).toContain('mass');
  });
  it('checks 48 distinct items, all equivalents and wrong answers, specific hints and manual reasoning', () => {
    expect(questions).toHaveLength(48);
    expect(new Set(questions.map((q) => q.id)).size).toBe(48);
    expect(questions.filter((q) => q.answer.kind === 'number')).toHaveLength(
      36,
    );
    expect(questions.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    expect(questions.filter((q) => q.answer.kind === 'explain')).toHaveLength(
      6,
    );
    for (const q of questions) {
      expect(q.hints).toHaveLength(2);
      expect(q.misconceptionTags!.length).toBeGreaterThan(0);
      for (const p of [q.stem, ...q.hints, q.solution, ...q.solutionSteps!]) {
        expect(p.zh, q.id).toBeTruthy();
        expect(p.en, q.id).toBeTruthy();
      }
      if (q.answer.kind === 'explain')
        expect(checkAnswer(q.solution.en, q.answer), q.id).toBeNull();
      else {
        q.answerChecks!.accepted.forEach((a) =>
          expect(checkAnswer(a, q.answer), `${q.id} accepts ${a}`).toBe(true),
        );
        q.answerChecks!.rejected.forEach((a) =>
          expect(checkAnswer(a, q.answer), `${q.id} rejects ${a}`).toBe(false),
        );
      }
      q.options?.forEach((o) => {
        expect(o.feedback.zh).toBeTruthy();
        expect(o.feedback.en).toBeTruthy();
      });
    }
  });
  it('independently derives every numeric target from its story, including reading-only and zero', () => {
    const oracle: Record<string, number> = {
      'B06-L01-G': 18 - 7,
      'B06-L01-Q2': 18,
      'B06-L01-Q3': 27 - 12,
      'B06-L01-Q4': 3 * 100 + 40,
      'B06-L01-Q5': 8 + 7,
      'B06-L01-X': 31 - 13,
      'B06-L02-G': 9 + 6,
      'B06-L02-Q2': 24 - 9,
      'B06-L02-Q3': 17 - 9,
      'B06-L02-Q4': 4 * 6,
      'B06-L02-Q5': 9 - 4,
      'B06-L02-X': 22 - 8,
      'B06-L03-G': 4 * 6 - 5,
      'B06-L03-Q2': (5 + 3) * 4,
      'B06-L03-Q3': (30 - 6) / 4,
      'B06-L03-Q4': 3 * 8 + 4,
      'B06-L03-Q5': 3 * 4 - 12,
      'B06-L03-X': 40 - 3 * 7,
      'B06-L04-G': 30 - 4 * 5,
      'B06-L04-Q2': 2 * 6,
      'B06-L04-Q3': 4 * 6,
      'B06-L04-Q4': 18 - 7,
      'B06-L04-Q5': 3 * 8,
      'B06-L04-X': 40 - 2 * 9,
      'B06-L05-G': 5 * 4 - 3,
      'B06-L05-Q2': 17 + 3,
      'B06-L05-Q3': 4 * 5 - 2,
      'B06-L05-Q4': 4 * 3,
      'B06-L05-Q5': 20 - 3 * 4,
      'B06-L05-X': 2 * 9 + 5,
      'B06-CHECK-Q1': 26 - 9,
      'B06-CHECK-Q2': 24 - 8,
      'B06-CHECK-Q3': 21 - 13,
      'B06-CHECK-Q4': 5 * 6 - 4,
      'B06-CHECK-Q6': 3 * 7,
      'B06-CHECK-Q7': 40 - 21,
    };
    const numeric = questions.filter((q) => q.answer.kind === 'number');
    expect(numeric.map((q) => q.id).sort()).toEqual(Object.keys(oracle).sort());
    numeric.forEach((q) =>
      expect(checkAnswer(String(oracle[q.id]), q.answer), q.id).toBe(true),
    );
    expect(checkAnswer('1100%', b06Lessons[0]!.guided.answer)).toBe(false);
    expect(checkAnswer('12 cm', b06Lessons[4]!.questions[3]!.answer)).toBe(
      false,
    );
    expect(checkAnswer('8 m', b06Lessons[4]!.questions[4]!.answer)).toBe(false);
  });
  it('accepts explicit object-count units and rejects counts of the wrong object', () => {
    const cards = b06Lessons[2]!.guided.answer,
      bags = b06Lessons[2]!.questions[2]!.answer,
      pencils = b06Lessons[3]!.questions[2]!.answer;
    for (const input of ['19 cards', '19张', '19张卡片', '38/2 cards'])
      expect(checkAnswer(input, cards), input).toBe(true);
    for (const input of ['6 bags', '6袋', '12/2 bags'])
      expect(checkAnswer(input, bags), input).toBe(true);
    for (const input of ['24 pencils', '24支铅笔', '24支'])
      expect(checkAnswer(input, pencils), input).toBe(true);
    expect(checkAnswer('19 bags', cards)).toBe(false);
    expect(checkAnswer('6 cards', bags)).toBe(false);
    expect(checkAnswer('24 NZD', pencils)).toBe(false);
  });
  it('keeps every numeric diagram consistent with the asked quantity and unit', () => {
    for (const q of questions) {
      if (q.diagram?.kind !== 'problem-bars') continue;
      const d = q.diagram,
        m = barRelation(d.relation, d.a, d.b, d.unknown);
      expect(checkAnswer(String(m.result), q.answer), q.id).toBe(true);
      expect(d.unit.zh, q.id).toBeTruthy();
      expect(d.unit.en, q.id).toBeTruthy();
    }
  });
  it('verifies 400 retrieval evaluations with changing unknowns, relationships and goals', () => {
    for (let k = 0; k < 80; k++)
      for (const l of b06Lessons) {
        const q = b06ReviewQuestion(l.id, k);
        let expected: number;
        if (l.order === 1) {
          const whole = 20 + (k % 20),
            part = 3 + (k % 12);
          expected = k % 3 === 0 ? whole : k % 3 === 1 ? whole - part : part;
        } else if (l.order === 2) {
          const b = 2 + (k % 8);
          expected = k % 3 === 2 ? (2 + (k % 5)) * b : b;
        } else if (l.order === 3) {
          const a = 2 + (k % 5),
            b = 3 + (Math.floor(k / 4) % 7),
            c = 1 + (k % 4);
          expected = k % 2 ? (a + c) * b : a * b - c;
        } else if (l.order === 4) {
          const cost = (2 + (k % 4)) * (3 + (Math.floor(k / 4) % 6));
          expected = k % 2 ? 5 + (k % 13) : cost;
        } else {
          const total = (2 + (k % 5)) * (3 + (Math.floor(k / 5) % 7));
          expected = k % 2 ? total : total - (1 + (k % 4));
        }
        expect(checkAnswer(String(expected), q.answer), q.id).toBe(true);
        q.answerChecks!.accepted.forEach((a) =>
          expect(checkAnswer(a, q.answer), `${q.id}: ${a}`).toBe(true),
        );
        q.answerChecks!.rejected.forEach((a) =>
          expect(checkAnswer(a, q.answer), `${q.id}: ${a}`).toBe(false),
        );
        if (q.diagram?.kind === 'problem-bars')
          expect(
            barRelation(
              q.diagram.relation,
              q.diagram.a,
              q.diagram.b,
              q.diagram.unknown,
            ).result,
            q.id,
          ).toBe(expected);
      }
    expect(() => b06ReviewQuestion('B06-L01', -1)).toThrow();
    expect(() => b06ReviewQuestion('B06-L01', 1.5)).toThrow();
    expect(() => b06ReviewQuestion('missing', 0)).toThrow();
  });
});
describe('problem models express quantities rather than keywords', () => {
  it('joins parts under one scale and preserves the relation when the unknown moves', () => {
    for (let a = 0; a <= 20; a++)
      for (let b = 0; b <= 20; b++) {
        const total = barRelation('parts', a, b, 'result'),
          part = barRelation('parts', a, b, 'component');
        expect(total.result).toBe(a + b);
        expect(part.result).toBe(b);
        expect(total.aWidth + total.bWidth).toBeCloseTo(
          a + b === 0 ? 0 : 420,
          10,
        );
        expect(total.aWidth).toBe(a * total.scale);
        expect(total.bWidth).toBe(b * total.scale);
        expect(part.scale).toBe(total.scale);
      }
  });
  it('aligns comparison bars and makes the excess exactly the difference, including equal and zero', () => {
    for (let a = 0; a <= 30; a++)
      for (let b = 0; b <= a; b++) {
        const gap = barRelation('comparison', a, b, 'result'),
          larger = barRelation('comparison', a, b, 'component');
        expect(gap.result).toBe(a - b);
        expect(larger.result).toBe(a);
        expect(gap.bWidth + gap.gapWidth).toBeCloseTo(a * gap.scale, 10);
        if (a === b) expect(gap.gapWidth).toBe(0);
      }
    expect(() => barRelation('comparison', 3, 5, 'result')).toThrow();
  });
  it('uses a fixed quantity per equal group and zero width for zero quantities', () => {
    for (let groups = 1; groups <= 8; groups++)
      for (let each = 0; each <= 20; each++) {
        const m = barRelation('groups', groups, each, 'result');
        expect(m.result).toBe(groups * each);
        expect(m.aWidth * groups).toBeCloseTo(m.whole * m.scale, 10);
        if (each === 0) expect(m.aWidth).toBe(0);
      }
    expect(() => barRelation('groups', 0, 4, 'result')).toThrow();
    expect(() => barRelation('groups', 3, 4, 'component')).toThrow();
    expect(() => barRelation('parts', -1, 5, 'result')).toThrow();
  });
  it('names the two-step intermediate and conserves original = remaining + given', () => {
    for (let boxes = 1; boxes <= 6; boxes++)
      for (let each = 1; each <= 10; each++)
        for (let given = 0; given <= boxes * each; given++) {
          const m = cardJourney(boxes, each, given);
          expect(m.total).toBe(boxes * each);
          expect(m.remaining + m.given).toBe(m.total);
          expect(m.remaining).toBeGreaterThanOrEqual(0);
        }
    expect(cardJourney(3, 4, 12).remaining).toBe(0);
    expect(() => cardJourney(3, 4, 13)).toThrow();
  });
  it('changes relevance with the goal and distinguishes insufficient data from an empty or duplicate selection', () => {
    expect(relevantFacts('change')).toEqual([0, 1, 2]);
    expect(relevantFacts('cost')).toEqual([1, 2]);
    expect(relevantFacts('mass')).toBeNull();
    expect(exactSelection([2, 0, 1], [0, 1, 2])).toBe(true);
    expect(exactSelection([0, 1, 2, 4], [0, 1, 2])).toBe(false);
    expect(exactSelection([1, 1, 2], [1, 2])).toBe(false);
    expect(exactSelection([], [1, 2])).toBe(false);
  });
});
