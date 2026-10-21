import { describe, it, expect } from 'vitest';
import {
  h33Lessons,
  h33CheckQuestions,
  h33ReviewQuestion,
} from './content/H33';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
const bodies = import.meta.glob('../../../content/lessons/H33-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const anchors = [
  ['0:1/4;1:1/2;2:1/4', '1/2', '3/4', '1/2', '1/2'],
  ['3/2', '4', '15', '1', '0'],
  ['1', '1', '9', '1', 'sqrt(2)/2'],
  ['3/8', '15/16', '2', '1', '4/9'],
  ['0.6827', '50', '4', '0', '1/2'],
  ['-3/2', '120', '0.9332', '0.8664', '0.0228'],
];
const all = [
  ...h33Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...h33CheckQuestions,
];
describe('H33 authored random variables and distributions curriculum', () => {
  it('matches six planned bilingual identities with earlier prerequisites and two full examples', () => {
    const registry = curriculum.flatMap((s) =>
      s.units.flatMap((u) => u.lessons),
    );
    expect(registry).toHaveLength(358);
    expect(h33Lessons).toHaveLength(6);
    expect(unitChecks.H33.questions).toEqual(h33CheckQuestions);
    expect(
      registry
        .filter((l) => l.id.startsWith('H33-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(h33Lessons.map((l) => ({ id: l.id, title: l.title })));
    for (const l of h33Lessons) {
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
      expect(reviewQuestionFor(l.id, 0)).toEqual(h33ReviewQuestion(l.id, 0));
    }
  });
  it('checks all 56 tasks with six choices and fourteen genuinely human arguments', () => {
    expect(all).toHaveLength(56);
    expect(new Set(all.map((q) => q.id)).size).toBe(56);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(14);
    h33Lessons.forEach((l, i) => {
      [l.guided, ...l.questions.slice(1, 5)].forEach((q, j) =>
        expect(checkAnswer(anchors[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(
        checkAnswer(String([2, 1, 0, 1, 2, 0][i]), l.questions[0]!.answer),
      ).toBe(true);
      expect(checkAnswer(anchors[i]![0]!, h33CheckQuestions[i]!.answer)).toBe(
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
          checkAnswer('probability weights mean variance normality', q.answer),
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
  it('independently recomputes 144 distinct bilingual retrievals using table merging, weighted moments, ordered trials and independent normal references', () => {
    for (let i = 0; i < 6; i++) {
      const zh = new Set<string>(),
        en = new Set<string>();
      for (let k = 0; k < 24; k++) {
        const a = 1 + (k % 6),
          b = 1 + Math.floor(k / 6),
          q = h33ReviewQuestion(`H33-L0${i + 1}`, k);
        let expected: string;
        if (i === 0)
          expected = `${a}:1/${b + 2};0:${b}/${b + 2};-${a}:1/${b + 2}`;
        else if (i === 1) expected = `${a}/${b + 1}`;
        else if (i === 2) expected = String(a * a * b * b);
        else if (i === 3) {
          const n = a + 1;
          let w = 0n;
          for (let mask = 0; mask < 2 ** n; mask++) {
            let ones = 0;
            for (let j = 0; j < n; j++)
              ones += Number(Boolean(mask & (1 << j)));
            if (ones === 1) w += BigInt(b) ** BigInt(n - 1);
          }
          expected = `${w}/${BigInt(b + 1) ** BigInt(n)}`;
        } else if (i === 4) {
          const phi: Record<string, number> = {
            '-1': 0.15865525393145707,
            '-1.5': 0.06680720126885809,
            '-2': 0.02275013194817921,
            '0.5': 0.6914624612740131,
            '1': 0.8413447460685429,
            '1.5': 0.9331927987311419,
            '2': 0.9772498680518208,
          };
          expected = (
            phi[String(b / 2)]! - phi[String(-(1 + (a % 3) / 2))]!
          ).toFixed(4);
        } else expected = `${a - 3}/2`;
        expect(checkAnswer(expected, q.answer), q.id).toBe(true);
        zh.add(q.stem.zh);
        en.add(q.stem.en);
        expect(h33ReviewQuestion(`H33-L0${i + 1}`, k + 24).stem).toEqual(
          q.stem,
        );
        expect(h33ReviewQuestion(`H33-L0${i + 1}`, k + 24).id).not.toBe(q.id);
      }
      expect(zh.size).toBe(24);
      expect(en.size).toBe(24);
    }
  });
  it('rejects invalid lesson identities or retrieval rounds', () => {
    for (const n of [-1, 0.5, NaN, Infinity, 100001])
      expect(() => h33ReviewQuestion('H33-L01', n)).toThrow();
    for (const id of ['H33-L00', 'H33-L07', 'H32-L01'])
      expect(() => h33ReviewQuestion(id, 0)).toThrow();
    expect(h33ReviewQuestion('H33-L06', 100000).id).toBe('H33-L06-R100000');
  });
});
