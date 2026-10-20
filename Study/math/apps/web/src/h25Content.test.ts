import { describe, it, expect } from 'vitest';
import {
  h25Lessons,
  h25CheckQuestions,
  h25ReviewQuestion,
} from './content/H25';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
const bodies = import.meta.glob('../../../content/lessons/H25-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const anchors = [
  ['4', '8', '4', '0', 'undefined'],
  ['5/2', '19/10', '2', 'undefined', '331/100'],
  ['2', 'undefined', '5', '2', 'does-not-exist'],
  ['4', '-2', '2', '0', 'undefined'],
  ['9x^2-2', '34', '0', 'x-3', '4x^3'],
  ['y=4x-4', '4', 'y=0', 'y=-2', 'y=-2x-1'],
];
const all = [
  ...h25Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...h25CheckQuestions,
];
describe('H25 authored derivative curriculum and retrieval coverage', () => {
  it('matches the six planned bilingual identities, earlier prerequisites and two full examples in each language', () => {
    const registry = curriculum.flatMap((s) =>
      s.units.flatMap((u) => u.lessons),
    );
    expect(registry).toHaveLength(358);
    expect(h25Lessons).toHaveLength(6);
    expect(
      registry
        .filter((l) => l.id.startsWith('H25-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(h25Lessons.map((l) => ({ id: l.id, title: l.title })));
    expect(unitChecks.H25.questions).toEqual(h25CheckQuestions);
    for (const l of h25Lessons) {
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
      expect(reviewQuestionFor(l.id, 0)).toEqual(h25ReviewQuestion(l.id, 0));
    }
  });
  it('checks all 56 tasks with six choices and fourteen human arguments, including equivalent expressions and lines', () => {
    expect(all).toHaveLength(56);
    expect(new Set(all.map((q) => q.id)).size).toBe(56);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(14);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    h25Lessons.forEach((l, i) => {
      [l.guided, ...l.questions.slice(1, 5)].forEach((q, j) =>
        expect(checkAnswer(anchors[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(
        checkAnswer(String([1, 0, 2, 1, 0, 2][i]), l.questions[0]!.answer),
      ).toBe(true);
      expect(checkAnswer(anchors[i]![0]!, h25CheckQuestions[i]!.answer)).toBe(
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
    expect(checkAnswer('2.5', h25Lessons[1]!.guided.answer)).toBe(true);
    expect(checkAnswer('3(3x²)-2', h25Lessons[4]!.guided.answer)).toBe(true);
    expect(checkAnswer('y-4=4(x-2)', h25Lessons[5]!.guided.answer)).toBe(true);
    expect(checkAnswer('7', h25Lessons[4]!.guided.answer)).toBe(false);
  });
  it('independently recomputes 144 retrievals with 24 distinct bilingual prompts per lesson', () => {
    for (let i = 0; i < 6; i++) {
      const zh = new Set<string>(),
        en = new Set<string>();
      for (let k = 0; k < 24; k++) {
        const a = -2 + (k % 6),
          j = 1 + Math.floor(k / 6),
          q = h25ReviewQuestion(`H25-L0${i + 1}`, k);
        let expected: string;
        if (i === 0) expected = String(2 * a + j);
        else if (i === 1) {
          const hs = ['-1/2', '-1/10', '1/10', '1/2'],
            den = j === 1 || j === 4 ? 2 : 10,
            num = j < 3 ? -1 : 1;
          expected = `${2 * a * den + num}/${den}`;
          expect(q.stem.en).toContain(hs[j - 1]);
        } else if (i === 2) expected = String(j + a);
        else if (i === 3) expected = String(2 * j * a);
        else if (i === 4) {
          const n = j,
            c = 1 + (k % 6);
          expected =
            n === 1 ? String(c) : `${c * n}x${n === 2 ? '' : `^${n - 1}`}`;
        } else expected = `y=${2 * j * a}x+(${1 - j * a * a})`;
        expect(checkAnswer(expected, q.answer), `${q.id}: ${expected}`).toBe(
          true,
        );
        zh.add(q.stem.zh);
        en.add(q.stem.en);
        expect(h25ReviewQuestion(`H25-L0${i + 1}`, k + 24).stem).toEqual(
          q.stem,
        );
        expect(h25ReviewQuestion(`H25-L0${i + 1}`, k + 24).id).not.toBe(q.id);
      }
      expect(zh.size).toBe(24);
      expect(en.size).toBe(24);
    }
  });
  it('rejects invalid lesson IDs and noninteger or out-of-range rounds', () => {
    for (const r of [-1, 0.5, NaN, Infinity, 100001])
      expect(() => h25ReviewQuestion('H25-L01', r)).toThrow();
    expect(() => h25ReviewQuestion('H25-L07', 0)).toThrow();
    expect(h25ReviewQuestion('H25-L06', 100000).id).toBe('H25-L06-R100000');
  });
});
