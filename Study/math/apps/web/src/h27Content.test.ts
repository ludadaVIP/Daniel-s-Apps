import { describe, it, expect } from 'vitest';
import {
  h27Lessons,
  h27CheckQuestions,
  h27ReviewQuestion,
} from './content/H27';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
const bodies = import.meta.glob('../../../content/lessons/H27-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const anchors = [
  ['1/2', '1/4', '-1/2', 'undefined', '0'],
  ['1/2', '1', '2', '3/2', 'not-identified'],
  ['-1/2', '0', '3/2', '-2', '14'],
  ['6', '2/3', '2', '4/3', '0'],
  ['3/4', '3/40', '39/40', '180', 'extrapolation'],
];
const all = [
  ...h27Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...h27CheckQuestions,
];
describe('H27 authored statistics curriculum and retrieval coverage', () => {
  it('matches the five planned bilingual identities, earlier prerequisites and two full examples in each language', () => {
    const registry = curriculum.flatMap((s) =>
      s.units.flatMap((u) => u.lessons),
    );
    expect(registry).toHaveLength(358);
    expect(h27Lessons).toHaveLength(5);
    expect(
      registry
        .filter((l) => l.id.startsWith('H27-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(h27Lessons.map((l) => ({ id: l.id, title: l.title })));
    expect(unitChecks.H27.questions).toEqual(h27CheckQuestions);
    for (const l of h27Lessons) {
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
      expect(reviewQuestionFor(l.id, 0)).toEqual(h27ReviewQuestion(l.id, 0));
    }
  });
  it('checks all 48 tasks with six choices and twelve human arguments, including equivalent expressions and exact classification codes', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(12);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    h27Lessons.forEach((l, i) => {
      [l.guided, ...l.questions.slice(1, 5)].forEach((q, j) =>
        expect(checkAnswer(anchors[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(
        checkAnswer(String([2, 1, 0, 1, 1][i]), l.questions[0]!.answer),
      ).toBe(true);
      expect(checkAnswer(anchors[i]![0]!, h27CheckQuestions[i]!.answer)).toBe(
        true,
      );
    });
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      expect(
        q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
      ).toBeTruthy();
      if (q.answer.kind === 'explain') {
        expect(
          checkAnswer('correlation residual random sample', q.answer),
        ).toBeNull();
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
    expect(checkAnswer('0.5', h27Lessons[0]!.guided.answer)).toBe(true);
    expect(checkAnswer('无定义', h27Lessons[0]!.questions[3]!.answer)).toBe(
      true,
    );
    expect(checkAnswer('75%', h27Lessons[4]!.guided.answer)).toBe(true);
  });
  it('independently recomputes 120 retrievals with 24 distinct bilingual prompts per lesson', () => {
    for (let i = 0; i < 5; i++) {
      const zh = new Set<string>(),
        en = new Set<string>();
      for (let k = 0; k < 24; k++) {
        const a = 1 + (k % 6),
          b = 1 + Math.floor(k / 6),
          q = h27ReviewQuestion(`H27-L0${i + 1}`, k);
        const expected =
          i === 0
            ? k % 2 === 0
              ? '1/2'
              : '-1/2'
            : i === 1
              ? `${b}/2`
              : i === 2
                ? String((k % 2 === 0 ? -1 : 1) * b)
                : i === 3
                  ? k % 2 === 0
                    ? String(b * b)
                    : `${b * b}/3`
                  : k % 2 === 0
                    ? `${2 * b}/${40 + 10 * a}`
                    : `${40 + 10 * a - (10 + b) + 2 * b}/${40 + 10 * a}`;
        expect(checkAnswer(expected, q.answer), q.id).toBe(true);
        zh.add(q.stem.zh);
        en.add(q.stem.en);
        expect(h27ReviewQuestion(`H27-L0${i + 1}`, k + 24).stem).toEqual(
          q.stem,
        );
        expect(h27ReviewQuestion(`H27-L0${i + 1}`, k + 24).id).not.toBe(q.id);
      }
      expect(zh.size).toBe(24);
      expect(en.size).toBe(24);
    }
  });
  it('rejects invalid lesson IDs and noninteger or out-of-range rounds', () => {
    for (const r of [-1, 0.5, NaN, Infinity, 100001])
      expect(() => h27ReviewQuestion('H27-L01', r)).toThrow();
    expect(() => h27ReviewQuestion('H27-L07', 0)).toThrow();
    expect(h27ReviewQuestion('H27-L05', 100000).id).toBe('H27-L05-R100000');
  });
});
