import { describe, it, expect } from 'vitest';
import {
  h26Lessons,
  h26CheckQuestions,
  h26ReviewQuestion,
} from './content/H26';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
const bodies = import.meta.glob('../../../content/lessons/H26-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const anchors = [
  ['decreasing', '9', 'increasing', 'decreasing', 'constant'],
  ['local-max', '2', 'neither', '18', '-2'],
  ['3x^2-4x+1', '0', '4x+7', '10x', '4x^3'],
  ['6(2x+1)^2', '54', '4x(x^2+1)', '-3(1-x)^2', '0'],
  ['-2', '2', '-2', '12', '20'],
];
const all = [
  ...h26Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...h26CheckQuestions,
];
describe('H26 authored derivative curriculum and retrieval coverage', () => {
  it('matches the five planned bilingual identities, earlier prerequisites and two full examples in each language', () => {
    const registry = curriculum.flatMap((s) =>
      s.units.flatMap((u) => u.lessons),
    );
    expect(registry).toHaveLength(358);
    expect(h26Lessons).toHaveLength(5);
    expect(
      registry
        .filter((l) => l.id.startsWith('H26-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(h26Lessons.map((l) => ({ id: l.id, title: l.title })));
    expect(unitChecks.H26.questions).toEqual(h26CheckQuestions);
    for (const l of h26Lessons) {
      expect(l.contentStatus).toBe('ready');
      expect(registry.find((p) => p.id === l.id)?.available).toBe(true);
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.minutes).toBe(20);
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const index = lessons.findIndex((p) => p.id === id);
        expect(index, id).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(lessons.indexOf(l));
      }
      const [zh, en] =
        bodies[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1800);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(new Set(l.parent.prompts.map((p) => p.en)).size).toBe(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(h26ReviewQuestion(l.id, 0));
    }
  });
  it('checks all 48 tasks with six choices and twelve human arguments, including equivalent expressions and exact classification codes', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(12);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    h26Lessons.forEach((l, i) => {
      [l.guided, ...l.questions.slice(1, 5)].forEach((q, j) =>
        expect(checkAnswer(anchors[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(
        checkAnswer(String([1, 0, 1, 2, 1][i]), l.questions[0]!.answer),
      ).toBe(true);
      expect(checkAnswer(anchors[i]![0]!, h26CheckQuestions[i]!.answer)).toBe(
        true,
      );
    });
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      expect(
        q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
      ).toBeTruthy();
      if (q.answer.kind === 'explain') {
        expect(checkAnswer('limit derivative tangent', q.answer)).toBeNull();
        expect(q.answer.rubric.zh.length).toBeGreaterThan(50);
        continue;
      }
      q.answerChecks!.accepted.forEach((v) =>
        expect(checkAnswer(v, q.answer), `${q.id}: ${v}`).toBe(true),
      );
      q.answerChecks!.rejected.forEach((v) =>
        expect(checkAnswer(v, q.answer), `${q.id}: ${v}`).toBe(false),
      );
    }
    expect(checkAnswer('递减', h26Lessons[0]!.guided.answer)).toBe(true);
    expect(checkAnswer('2x(x-2)+x²+1', h26Lessons[2]!.guided.answer)).toBe(
      true,
    );
    expect(checkAnswer('24x²+24x+6', h26Lessons[3]!.guided.answer)).toBe(true);
    expect(checkAnswer('2', h26Lessons[4]!.guided.answer)).toBe(false);
  });
  it('independently recomputes 120 retrievals with 24 distinct bilingual prompts per lesson', () => {
    for (let i = 0; i < 5; i++) {
      const zh = new Set<string>(),
        en = new Set<string>();
      for (let k = 0; k < 24; k++) {
        const a = 1 + (k % 6),
          b = 1 + Math.floor(k / 6),
          q = h26ReviewQuestion(`H26-L0${i + 1}`, k);
        const expected =
          i === 0
            ? k % 2 === 0
              ? 'decreasing'
              : 'increasing'
            : i === 1
              ? String(b)
              : i === 2
                ? `${3 * b}x^2-2x+${a * b}`
                : i === 3
                  ? `${3 * b ** 3}x^2+${6 * a * b * b}x+${3 * a * a * b}`
                  : String(2 * (a + b) * b);
        expect(checkAnswer(expected, q.answer), q.id).toBe(true);
        zh.add(q.stem.zh);
        en.add(q.stem.en);
        expect(h26ReviewQuestion(`H26-L0${i + 1}`, k + 24).stem).toEqual(
          q.stem,
        );
        expect(h26ReviewQuestion(`H26-L0${i + 1}`, k + 24).id).not.toBe(q.id);
      }
      expect(zh.size).toBe(24);
      expect(en.size).toBe(24);
    }
  });
  it('rejects invalid lesson IDs and noninteger or out-of-range rounds', () => {
    for (const r of [-1, 0.5, NaN, Infinity, 100001])
      expect(() => h26ReviewQuestion('H26-L01', r)).toThrow();
    expect(() => h26ReviewQuestion('H26-L07', 0)).toThrow();
    expect(h26ReviewQuestion('H26-L05', 100000).id).toBe('H26-L05-R100000');
  });
});
