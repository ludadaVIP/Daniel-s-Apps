import { describe, it, expect } from 'vitest';
import {
  h31Lessons,
  h31CheckQuestions,
  h31ReviewQuestion,
} from './content/H31';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
const bodies = import.meta.glob('../../../content/lessons/H31-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const anchors = [
  ['9x^2-2+exp(x)', '10exp(2*x)', '2^x*ln(2)', '-exp(-x)', '1'],
  ['6cos(2*x)', '-12sin(3x)', 'cos(x)-sin(x)', '1', 'undefined'],
  ['-3/4', '0', 'vertical', 'singular', 'off-curve'],
  ['{-1,2}', '-2', 'not-attained', 'neither', '{0}'],
  ['4', '64', '6', '{6,5}', 'empty-domain'],
  ['12', '4', '-3', '3', 'slowing-down'],
];
const all = [
  ...h31Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...h31CheckQuestions,
];
describe('H31 authored derivatives and optimisation curriculum', () => {
  it('matches six planned bilingual identities with earlier prerequisites and two full examples', () => {
    const registry = curriculum.flatMap((s) =>
      s.units.flatMap((u) => u.lessons),
    );
    expect(registry).toHaveLength(358);
    expect(h31Lessons).toHaveLength(6);
    expect(unitChecks.H31.questions).toEqual(h31CheckQuestions);
    expect(
      registry
        .filter((l) => l.id.startsWith('H31-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(h31Lessons.map((l) => ({ id: l.id, title: l.title })));
    for (const l of h31Lessons) {
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
      expect(reviewQuestionFor(l.id, 0)).toEqual(h31ReviewQuestion(l.id, 0));
    }
  });
  it('checks all 56 tasks with six choices and fourteen genuinely human arguments', () => {
    expect(all).toHaveLength(56);
    expect(new Set(all.map((q) => q.id)).size).toBe(56);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(14);
    h31Lessons.forEach((l, i) => {
      [l.guided, ...l.questions.slice(1, 5)].forEach((q, j) =>
        expect(checkAnswer(anchors[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(
        checkAnswer(String([2, 0, 1, 2, 0, 1][i]), l.questions[0]!.answer),
      ).toBe(true);
      expect(checkAnswer(anchors[i]![0]!, h31CheckQuestions[i]!.answer)).toBe(
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
          checkAnswer('derivative boundary domain units', q.answer),
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
    expect(checkAnswer('exp(x)+9*x*x-2', h31Lessons[0]!.guided.answer)).toBe(
      true,
    );
    expect(
      checkAnswer('3*(cos(2x)+cos(2*x))', h31Lessons[1]!.guided.answer),
    ).toBe(true);
    expect(checkAnswer('-0.75', h31Lessons[2]!.guided.answer)).toBe(true);
  });
  it('independently recomputes 144 distinct bilingual retrievals including every integer tie and motion reversal', () => {
    for (let i = 0; i < 6; i++) {
      const zh = new Set<string>(),
        en = new Set<string>();
      for (let k = 0; k < 24; k++) {
        const a = 1 + (k % 6),
          b = 1 + Math.floor(k / 6),
          q = h31ReviewQuestion(`H31-L0${i + 1}`, k);
        let expected: string;
        if (i === 0) expected = `${3 * a}x^2+${2 * b}exp(2x)`;
        else if (i === 1) expected = `${a * b}cos(${b}x)`;
        else if (i === 2) {
          const d = b + 6;
          expected = `${-(d * d - a * a)}/${2 * a * d}`;
        } else if (i === 3)
          expected = k % 2 === 0 ? `{${a + b},${a - b}}` : `{${a - b}}`;
        else if (i === 4) {
          const L = 12 + 2 * a + b,
            cap = 2 + b,
            xs = Array.from({ length: cap }, (_, j) => j + 1).filter(
              (x) => 2 * x < L,
            ),
            area = xs.map((x) => x * (L - 2 * x)),
            max = Math.max(...area);
          expected = `{${xs.filter((_, j) => area[j] === max).join(',')}}`;
        } else {
          const end = b + 2,
            cuts = [0, 1, ...(end > 3 ? [3] : []), end],
            pos = (t: number) => a * t * (t - 3) ** 2;
          let total = 0;
          for (let j = 1; j < cuts.length; j++)
            total += Math.abs(pos(cuts[j]!) - pos(cuts[j - 1]!));
          expected = String(total);
        }
        expect(checkAnswer(expected, q.answer), q.id).toBe(true);
        zh.add(q.stem.zh);
        en.add(q.stem.en);
        expect(h31ReviewQuestion(`H31-L0${i + 1}`, k + 24).stem).toEqual(
          q.stem,
        );
        expect(h31ReviewQuestion(`H31-L0${i + 1}`, k + 24).id).not.toBe(q.id);
      }
      expect(zh.size).toBe(24);
      expect(en.size).toBe(24);
    }
  });
  it('rejects invalid lesson identities or retrieval rounds', () => {
    for (const n of [-1, 0.5, NaN, Infinity, 100001])
      expect(() => h31ReviewQuestion('H31-L01', n)).toThrow();
    for (const id of ['H31-L00', 'H31-L07', 'H28-L01'])
      expect(() => h31ReviewQuestion(id, 0)).toThrow();
    expect(h31ReviewQuestion('H31-L06', 100000).id).toBe('H31-L06-R100000');
  });
});
