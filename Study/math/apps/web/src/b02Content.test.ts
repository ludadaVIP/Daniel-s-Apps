import { describe, expect, it } from 'vitest';
import {
  b02Lessons,
  b02CheckQuestions,
  b02ReviewQuestion,
} from './content/B02';
import { lessons, curriculum } from './content';
import { checkAnswer } from './model';
import {
  partWhole,
  equalGroups,
  divideObjects,
  inverseFacts,
  operationScenarios,
} from './operationModels';

const markdown = import.meta.glob('../../../content/lessons/B02-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const allQuestions = [
  ...b02Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...b02CheckQuestions,
];

describe('B02 teaching content and independently checked answers', () => {
  it('covers the five planned concepts with original bilingual examples and valid support paths', () => {
    const planned = curriculum
      .flatMap((s) => s.units)
      .find((u) => u.id === 'B02')!;
    expect(b02Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(new Set(b02Lessons.map((l) => l.lab)).size).toBe(5);
    const known = [...lessons, ...b02Lessons];
    for (const l of b02Lessons) {
      const [zh, en] =
        markdown[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length, l.id).toBeGreaterThan(700);
      expect(en!.length, l.id).toBeGreaterThan(1300);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(l.stage).toBe('B00');
      expect(l.unit).toBe('B02');
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.parent.prompts).toHaveLength(2);
      expect(
        l.questions.filter((q) => q.answer.kind === 'choice'),
      ).toHaveLength(1);
      expect(
        l.questions.filter((q) => q.answer.kind === 'explain'),
      ).toHaveLength(1);
      expect(
        new Set(l.questions.map((q) => q.difficulty)).size,
      ).toBeGreaterThan(1);
      for (const copy of [
        l.title,
        l.objective,
        l.hook,
        l.parent.goal,
        l.parent.misconception,
        ...l.parent.prompts,
      ]) {
        expect(copy.zh).toBeTruthy();
        expect(copy.en).toBeTruthy();
      }
      l.prerequisites.forEach((id) => {
        const prerequisite = known.find((p) => p.id === id);
        expect(prerequisite, `${l.id} prerequisite ${id}`).toBeTruthy();
        if (prerequisite!.unit === 'B02')
          expect(prerequisite!.order).toBeLessThan(l.order!);
      });
      expect(known.some((p) => p.id === l.parent.bridge)).toBe(true);
    }
    expect(b02Lessons[4]!.familyChallenge!.zh).toContain('假想');
    expect(b02Lessons[4]!.familyChallenge!.en).toContain('NZ$30');
  });

  it('checks every acceptance, rejection, misconception and manual explanation in all 48 items', () => {
    expect(allQuestions).toHaveLength(48);
    expect(new Set(allQuestions.map((q) => q.id)).size).toBe(48);
    expect(allQuestions.filter((q) => q.answer.kind === 'number')).toHaveLength(
      36,
    );
    expect(allQuestions.filter((q) => q.answer.kind === 'choice')).toHaveLength(
      6,
    );
    expect(
      allQuestions.filter((q) => q.answer.kind === 'explain'),
    ).toHaveLength(6);
    for (const q of allQuestions) {
      expect(q.lessonId).toBeTruthy();
      expect(q.hints).toHaveLength(2);
      expect(q.misconceptionTags!.length).toBeGreaterThan(0);
      expect(q.solutionSteps!.length).toBeGreaterThan(0);
      for (const copy of [
        q.stem,
        q.solution,
        ...q.hints,
        ...q.solutionSteps!,
      ]) {
        expect(copy.zh, q.id).toBeTruthy();
        expect(copy.en, q.id).toBeTruthy();
      }
      if (q.answer.kind === 'explain') {
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
      } else {
        expect(q.answerChecks!.accepted.length).toBeGreaterThan(0);
        expect(q.answerChecks!.rejected.length).toBeGreaterThan(0);
        q.answerChecks!.accepted.forEach((a) =>
          expect(checkAnswer(a, q.answer), `${q.id}: ${a}`).toBe(true),
        );
        q.answerChecks!.rejected.forEach((a) =>
          expect(checkAnswer(a, q.answer), `${q.id}: ${a}`).toBe(false),
        );
      }
      q.options?.forEach((o) => {
        expect(o.text.zh).toBeTruthy();
        expect(o.text.en).toBeTruthy();
        expect(o.feedback!.zh).toBeTruthy();
        expect(o.feedback!.en).toBeTruthy();
      });
    }
  });

  it('independently derives all 36 numeric answers, distinguishing full boxes from fractional quotients', () => {
    const oracle: Record<string, number> = {
      'B02-L01-G': 8 + 5,
      'B02-L01-Q2': 19 - 7,
      'B02-L01-Q3': 14 - 9,
      'B02-L01-Q4': 23 - 8,
      'B02-L01-Q5': 7 + 8,
      'B02-L01-X': 20 - 8,
      'B02-L02-G': 3 * 4,
      'B02-L02-Q2': 4 * 7,
      'B02-L02-Q3': 3 * 6,
      'B02-L02-Q4': 0 * 8,
      'B02-L02-Q5': 5 * 3,
      'B02-L02-X': 4 * 6,
      'B02-L03-G': 24 / 6,
      'B02-L03-Q2': 24 / 3,
      'B02-L03-Q3': 20 / 4,
      'B02-L03-Q4': Math.floor(23 / 5),
      'B02-L03-Q5': 0 / 4,
      'B02-L03-X': Math.floor(22 / 5),
      'B02-L04-G': 12 / 3,
      'B02-L04-Q2': 42 / 7,
      'B02-L04-Q3': 32 / 4,
      'B02-L04-Q4': 0 / 5,
      'B02-L04-Q5': 36 / 4,
      'B02-L04-X': 56 / 7,
      'B02-L05-G': 3 * 4,
      'B02-L05-Q2': 14 + 9,
      'B02-L05-Q3': 30 - 12,
      'B02-L05-Q4': 5 * 7,
      'B02-L05-Q5': 28 / 4,
      'B02-L05-X': 30 - 6 * 4,
      'B02-CHECK-Q1': 23 - 9,
      'B02-CHECK-Q3': 4 * 7,
      'B02-CHECK-Q4': 30 / 6,
      'B02-CHECK-Q5': Math.floor(27 / 4),
      'B02-CHECK-Q6': 63 / 9,
      'B02-CHECK-Q7': 28 - 3 * 6,
    };
    const numeric = allQuestions.filter((q) => q.answer.kind === 'number');
    expect(numeric.map((q) => q.id).sort()).toEqual(Object.keys(oracle).sort());
    numeric.forEach((q) =>
      expect(checkAnswer(String(oracle[q.id]), q.answer), q.id).toBe(true),
    );
    const fullBoxes = allQuestions.find((q) => q.id === 'B02-L03-Q4')!;
    expect(fullBoxes.stem.en).toContain('full');
    expect(checkAnswer('4.6', fullBoxes.answer)).toBe(false);
    expect(fullBoxes.solution.en).toContain('23=5×4+3');
    const wholeShares = allQuestions.find((q) => q.id === 'B02-L03-X')!;
    expect(wholeShares.stem.en).toContain('whole');
    expect(checkAnswer('4.4', wholeShares.answer)).toBe(false);
  });

  it('checks 400 review evaluations across relationships, remainders, zero groups and unit-bearing budgets', () => {
    for (let k = 0; k < 80; k++) {
      for (const l of b02Lessons) {
        const q = b02ReviewQuestion(l.id, k);
        const a = 7 + (k % 9),
          b = 4 + (Math.floor(k / 9) % 7);
        const count = k % 16 === 15 ? 0 : 1 + (k % 6),
          size = 2 + (Math.floor(k / 6) % 7);
        const inverseCount = 2 + (k % 5),
          inverseSize = 3 + (Math.floor(k / 5) % 6);
        const price = 2 + (k % 7),
          quantity = 2 + (Math.floor(k / 7) % 5);
        const oracle =
          l.order === 1
            ? k % 3 === 0
              ? a + b
              : k % 3 === 1
                ? b
                : Math.abs(a - b)
            : l.order === 2
              ? count * size
              : l.order === 3
                ? Math.floor(
                    ((2 + (k % 5)) * (1 + (k % 7)) + (k % (2 + (k % 5)))) /
                      (2 + (k % 5)),
                  )
                : l.order === 4
                  ? k % 2 === 0
                    ? inverseSize
                    : inverseCount
                  : k % 3 === 0
                    ? 60 - price * quantity
                    : k % 3 === 1
                      ? price + quantity
                      : quantity;
        expect(checkAnswer(String(oracle), q.answer), q.id).toBe(true);
        q.answerChecks!.accepted.forEach((a) =>
          expect(checkAnswer(a, q.answer), `${q.id}: ${a}`).toBe(true),
        );
        q.answerChecks!.rejected.forEach((a) =>
          expect(checkAnswer(a, q.answer), `${q.id}: ${a}`).toBe(false),
        );
        expect(q.hints).toHaveLength(2);
        expect(q.id).toBe(`${l.id}-R${k}`);
      }
    }
    expect(() => b02ReviewQuestion('B02-L03', -1)).toThrow();
    expect(() => b02ReviewQuestion('B02-L03', 0.5)).toThrow();
    expect(() => b02ReviewQuestion('missing', 0)).toThrow();
    expect(b02ReviewQuestion('B02-L01', 80).answer).toEqual(
      b02ReviewQuestion('B02-L01', 0).answer,
    );
  });
});

describe('quantity conservation and division domains', () => {
  it('relates parts and differences without confusing comparison with removal', () => {
    expect(partWhole(14, 9)).toEqual({
      a: 14,
      b: 9,
      total: 23,
      difference: 5,
      larger: 14,
      smaller: 9,
    });
    expect(partWhole(9, 14).difference).toBe(5);
    expect(partWhole(0, 0).total).toBe(0);
    expect(partWhole(20, 20).total).toBe(40);
    expect(() => partWhole(-1, 5)).toThrow();
    expect(() => partWhole(1.5, 5)).toThrow();
  });
  it('preserves the object total under array rotation and omits every zero-divisor inverse', () => {
    for (let groups = 0; groups <= 8; groups++) {
      for (let size = 0; size <= 8; size++) {
        const product = equalGroups(groups, size).total;
        expect(equalGroups(size, groups).total).toBe(product);
        const facts = inverseFacts(groups, size);
        expect(facts.divisions.some((f) => f.includes(' ÷ 0 '))).toBe(false);
        expect(facts.divisions).toHaveLength(
          Number(groups > 0) + Number(size > 0),
        );
        if (groups > 0)
          expect(facts.divisions).toContain(`${product} ÷ ${groups} = ${size}`);
        if (size > 0)
          expect(facts.divisions).toContain(`${product} ÷ ${size} = ${groups}`);
      }
    }
    expect(inverseFacts(0, 5).divisions).toEqual(['0 ÷ 5 = 0']);
    expect(inverseFacts(0, 0).divisions).toEqual([]);
    expect(() => equalGroups(9, 3)).toThrow();
  });
  it('retains every indivisible counter for both division roles, including more recipients than objects', () => {
    for (let total = 0; total <= 30; total++) {
      for (let divisor = 1; divisor <= 6; divisor++) {
        for (const mode of ['share', 'group'] as const) {
          const m = divideObjects(total, divisor, mode);
          expect(m.groupCount * m.perGroup + m.remainder).toBe(total);
          expect(m.assigned + m.remainder).toBe(total);
          expect(m.remainder).toBeGreaterThanOrEqual(0);
          expect(m.remainder).toBeLessThan(divisor);
          expect(m.quotient).toBe(Math.floor(total / divisor));
        }
      }
    }
    expect(divideObjects(23, 5, 'share')).toMatchObject({
      groupCount: 5,
      perGroup: 4,
      remainder: 3,
    });
    expect(divideObjects(23, 5, 'group')).toMatchObject({
      groupCount: 4,
      perGroup: 5,
      remainder: 3,
    });
    expect(divideObjects(2, 5, 'share')).toMatchObject({
      groupCount: 5,
      perGroup: 0,
      remainder: 2,
    });
    expect(divideObjects(0, 4, 'group')).toMatchObject({
      groupCount: 0,
      remainder: 0,
    });
    expect(() => divideObjects(0, 0, 'share')).toThrow();
    expect(() => divideObjects(23, -5, 'group')).toThrow();
    expect(() => divideObjects(2.5, 5, 'share')).toThrow();
  });
  it('matches the five authored story roles and their independently calculated outcomes', () => {
    expect(
      operationScenarios.map((s) => [s.id, s.operation, s.answer]),
    ).toEqual([
      ['join', 'add', 14 + 9],
      ['left', 'subtract', 30 - 12],
      ['groups', 'multiply', 5 * 7],
      ['share', 'divide', 24 / 6],
      ['contain', 'divide', 28 / 4],
    ]);
  });
});
