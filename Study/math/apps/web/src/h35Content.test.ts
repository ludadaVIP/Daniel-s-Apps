import { describe, it, expect } from 'vitest';
import {
  h35Lessons,
  h35CheckQuestions,
  h35ReviewQuestion,
} from './content/H35';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
const bodies = import.meta.glob('../../../content/lessons/H35-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const anchors = [
  ['[-1,∞)', '9', '5', '{2}', '-4'],
  ['{3}', '4', '-8/9', '(3,∞)', '{5}'],
  ['1+c', '0,2pi', '1', '1-2*c^2', 's'],
  ['3/2', '3', '8*x^2-12*x+3', '0', '-1'],
  ['{2}', '{}', '{-1,3}', '{0,3}', '{1}'],
];
const all = [
  ...h35Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...h35CheckQuestions,
];
describe('H35 authored advanced functions and equations curriculum', () => {
  it('matches five planned bilingual identities with earlier prerequisites and two full examples', () => {
    const registry = curriculum.flatMap((s) =>
      s.units.flatMap((u) => u.lessons),
    );
    expect(registry).toHaveLength(358);
    expect(h35Lessons).toHaveLength(5);
    expect(unitChecks.H35.questions).toEqual(h35CheckQuestions);
    expect(
      registry
        .filter((l) => l.id.startsWith('H35-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(h35Lessons.map((l) => ({ id: l.id, title: l.title })));
    for (const l of h35Lessons) {
      expect(l.stage).toBe('H12');
      expect(l.contentStatus).toBe('ready');
      expect(registry.find((r) => r.id === l.id)?.available).toBe(true);
      expect(l.minutes).toBe(20);
      expect(l.keywords).toHaveLength(3);
      expect(l.questions).toHaveLength(6);
      expect(new Set(l.parent.prompts.map((p) => p.en)).size).toBe(2);
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        expect(
          lessons.findIndex((p) => p.id === id),
          id,
        ).toBeGreaterThanOrEqual(0);
        expect(
          lessons.findIndex((p) => p.id === id),
          id,
        ).toBeLessThan(lessons.indexOf(l));
      }
      const [zh, en] =
        bodies[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1800);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(h35ReviewQuestion(l.id, 0));
    }
  });
  it('checks all 48 tasks with five choices and thirteen human arguments', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(5);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(13);
    h35Lessons.forEach((l, i) => {
      [l.guided, ...l.questions.slice(1, 5)].forEach((q, j) =>
        expect(checkAnswer(anchors[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(
        checkAnswer(String([1, 2, 0, 1, 2][i]), l.questions[0]!.answer),
      ).toBe(true);
      expect(checkAnswer(anchors[i]![0]!, h35CheckQuestions[i]!.answer)).toBe(
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
          checkAnswer(
            'domain branch inverse cancellation complete set',
            q.answer,
          ),
        ).toBeNull();
        expect(q.answer.rubric.zh.length).toBeGreaterThan(50);
      } else {
        q.answerChecks!.accepted.forEach((v) =>
          expect(checkAnswer(v, q.answer), `${q.id}:${v}`).toBe(true),
        );
        q.answerChecks!.rejected.forEach((v) =>
          expect(checkAnswer(v, q.answer), `${q.id}:${v}`).toBe(false),
        );
      }
    }
  });
  it('independently verifies 120 distinct bilingual retrievals by substitution and original restrictions', () => {
    for (let i = 0; i < 5; i++) {
      const zh = new Set<string>(),
        en = new Set<string>();
      for (let round = 0; round < 24; round++) {
        const a = 1 + (round % 6),
          b = 1 + Math.floor(round / 6),
          q = h35ReviewQuestion(`H35-L0${i + 1}`, round);
        let expected: string;
        if (i === 0) {
          const candidates = [];
          for (let x = -12; x <= 12; x++)
            if (x + a >= 0 && (x + a) ** 2 === b * b) candidates.push(x);
          expected = `{${candidates.join(',')}}`;
        } else if (i === 1) {
          const candidates = [];
          for (let x = -12; x <= 12; x++)
            if (
              x - a > 0 &&
              x + a > 0 &&
              (x - a) * (x + a) === (a + b) ** 2 - a * a
            )
              candidates.push(x);
          expected = `{${candidates.join(',')}}`;
        } else if (i === 2) {
          expected = `${a}*c+${a + b}`;
        } else if (i === 3) {
          expected = String(b + 0.5);
        } else {
          const candidates = [];
          for (let x = -12; x <= 24; x++)
            if (x - a >= 0 && (x - a) ** 2 === x - a + b * (b + 1))
              candidates.push(x);
          expected = `{${candidates.join(',')}}`;
        }
        expect(checkAnswer(expected, q.answer), q.id).toBe(true);
        expect(checkAnswer('999', q.answer)).toBe(false);
        zh.add(q.stem.zh);
        en.add(q.stem.en);
        expect(h35ReviewQuestion(`H35-L0${i + 1}`, round + 24).stem).toEqual(
          q.stem,
        );
        expect(h35ReviewQuestion(`H35-L0${i + 1}`, round + 24).id).not.toBe(
          q.id,
        );
      }
      expect(zh.size).toBe(24);
      expect(en.size).toBe(24);
    }
  });
  it('rejects invalid lesson identities or retrieval rounds', () => {
    for (const n of [-1, 0.5, NaN, Infinity, 100001])
      expect(() => h35ReviewQuestion('H35-L01', n)).toThrow();
    for (const id of ['H35-L00', 'H35-L06', 'H33-L01'])
      expect(() => h35ReviewQuestion(id, 0)).toThrow();
    expect(h35ReviewQuestion('H35-L05', 100000).id).toBe('H35-L05-R100000');
  });
});
