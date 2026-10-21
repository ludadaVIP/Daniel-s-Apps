import { describe, it, expect } from 'vitest';
import {
  h32Lessons,
  h32CheckQuestions,
  h32ReviewQuestion,
} from './content/H32';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
const bodies = import.meta.glob('../../../content/lessons/H32-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const anchors = [
  ['8', '11', '8', '11/4', '0'],
  ['21/8', '7/4', '15/4', '1/2', '163/64'],
  ['x^3-4x+C', 'x^2', 'x^2+5', 'x^4+C', 'C'],
  ['3/2', '5/2', '-3/2', '0', '4'],
  ['4', '7/3', '8', 'DNE', '-7/3'],
  ['13/2', '5/2', '25/2', '14', '4/3'],
];
const all = [
  ...h32Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...h32CheckQuestions,
];
describe('H32 authored integration curriculum', () => {
  it('matches six planned bilingual identities with earlier prerequisites and two full examples', () => {
    const registry = curriculum.flatMap((s) =>
      s.units.flatMap((u) => u.lessons),
    );
    expect(registry).toHaveLength(358);
    expect(h32Lessons).toHaveLength(6);
    expect(unitChecks.H32.questions).toEqual(h32CheckQuestions);
    expect(
      registry
        .filter((l) => l.id.startsWith('H32-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(h32Lessons.map((l) => ({ id: l.id, title: l.title })));
    for (const l of h32Lessons) {
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
      expect(reviewQuestionFor(l.id, 0)).toEqual(h32ReviewQuestion(l.id, 0));
    }
  });
  it('checks all 56 tasks with six choices and fourteen genuinely human arguments', () => {
    expect(all).toHaveLength(56);
    expect(new Set(all.map((q) => q.id)).size).toBe(56);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(14);
    h32Lessons.forEach((l, i) => {
      [l.guided, ...l.questions.slice(1, 5)].forEach((q, j) =>
        expect(checkAnswer(anchors[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(
        checkAnswer(String([1, 2, 0, 1, 2, 0][i]), l.questions[0]!.answer),
      ).toBe(true);
      expect(checkAnswer(anchors[i]![0]!, h32CheckQuestions[i]!.answer)).toBe(
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
  });
  it('independently recomputes 144 distinct bilingual retrievals using weighted durations, sum formulas, primitive identities and signed triangles', () => {
    for (let i = 0; i < 6; i++) {
      const zh = new Set<string>(),
        en = new Set<string>();
      for (let k = 0; k < 24; k++) {
        const a = 1 + (k % 6),
          b = 1 + Math.floor(k / 6),
          q = h32ReviewQuestion(`H32-L0${i + 1}`, k);
        let expected: string;
        if (i === 0) expected = `${2 * a + 3 * b}/2`;
        else if (i === 1) {
          const n = a + 1;
          let numerator = 0;
          for (let j = 1; j <= n; j++) numerator += (2 * j - 1) ** 2;
          expected = `${b ** 3 * numerator}/${4 * n ** 3}`;
        } else if (i === 2) expected = `${a}/3*x*x*x+${b}/2*x*x+C`;
        else if (i === 3)
          expected = `${b * b + (k % 2 === 0 ? a * a : -a * a)}/2`;
        else if (i === 4) expected = `${b ** 3 * a * a}/4`;
        else expected = `${b * a ** 3}/6`;
        expect(checkAnswer(expected, q.answer), q.id).toBe(true);
        if (i === 0) expect(q.hints[0]!.en).toContain('elapsed widths');
        zh.add(q.stem.zh);
        en.add(q.stem.en);
        expect(h32ReviewQuestion(`H32-L0${i + 1}`, k + 24).stem).toEqual(
          q.stem,
        );
        expect(h32ReviewQuestion(`H32-L0${i + 1}`, k + 24).id).not.toBe(q.id);
      }
      expect(zh.size).toBe(24);
      expect(en.size).toBe(24);
    }
  });
  it('rejects invalid lesson identities or retrieval rounds', () => {
    for (const n of [-1, 0.5, NaN, Infinity, 100001])
      expect(() => h32ReviewQuestion('H32-L01', n)).toThrow();
    for (const id of ['H32-L00', 'H32-L07', 'H31-L01'])
      expect(() => h32ReviewQuestion(id, 0)).toThrow();
    expect(h32ReviewQuestion('H32-L06', 100000).id).toBe('H32-L06-R100000');
  });
});
