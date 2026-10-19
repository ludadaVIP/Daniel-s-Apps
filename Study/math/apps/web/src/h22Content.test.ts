import { describe, it, expect } from 'vitest';
import {
  h22Lessons,
  h22CheckQuestions,
  h22ReviewQuestion,
} from './content/H22';
import {
  lessons,
  curriculum,
  openUnits,
  unitChecks,
  reviewQuestionFor,
} from './content';
import { checkAnswer } from './model';
import { planeEquation, cq } from './conicModels';
import { sameR } from './algebraModels';
const bodies = import.meta.glob('../../../content/lessons/H22-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...h22Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...h22CheckQuestions,
];
const anchors = [
  ['y=2x+1', 'x=2', 'y=-2', '4x-2y+2=0', '2'],
  ['2', '(-1/5,7/5)', '0', '2', '3'],
  ['x²+y²-2x+4y-20=0', '(2,-3)', '5', 'point', 'empty'],
  ['y²=8x', '(0,2)', 'y=-2', '2', '(-2,0)'],
  ['16x²+25y²=400', '16', '10', '(0,4)', '16(x-1)^2+25(y+2)^2=400'],
  ['16x²-9y²=144', '16', '-6', '6', '(0,5)'],
];
function coefficient(equation: string, key: string) {
  return planeEquation(equation)!.get(key) ?? cq(0);
}
describe('H22 authored bilingual content, prerequisites and independent answer anchors', () => {
  it('matches six planned lessons and both language bodies with two complete worked examples each', () => {
    const registry = curriculum
      .flatMap((s) => s.units)
      .flatMap((u) => u.lessons);
    expect(registry).toHaveLength(358);
    expect(h22Lessons).toHaveLength(6);
    expect(lessons.length).toBeGreaterThanOrEqual(283);
    expect(openUnits.length).toBeGreaterThanOrEqual(53);
    expect(
      registry
        .filter((l) => l.id.startsWith('H22-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(h22Lessons.map((l) => ({ id: l.id, title: l.title })));
    expect(unitChecks.H22.questions).toEqual(h22CheckQuestions);
    for (const l of h22Lessons) {
      expect(l.stage).toBe('H11');
      expect(l.contentStatus).toBe('ready');
      expect(registry.find((p) => p.id === l.id)?.available).toBe(true);
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.minutes).toBe(20);
      for (const id of [...l.prerequisites, l.parent.bridge])
        expect(
          lessons.findIndex((p) => p.id === id),
          id,
        ).toBeGreaterThanOrEqual(0);
      l.prerequisites.forEach((id) =>
        expect(lessons.findIndex((p) => p.id === id)).toBeLessThan(
          lessons.indexOf(l),
        ),
      );
      const [zh, en] =
        bodies[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(900);
      expect(en!.length).toBeGreaterThan(1800);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(new Set(l.parent.prompts.map((p) => p.en)).size).toBe(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(h22ReviewQuestion(l.id, 0));
    }
  });
  it('audits 56 unique question anchors, 36 constructed answers, six choices and fourteen human arguments', () => {
    expect(all).toHaveLength(56);
    expect(new Set(all.map((q) => q.id)).size).toBe(56);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(14);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    h22Lessons.forEach((l, i) => {
      [l.guided, ...l.questions.slice(1, 5)].forEach((q, j) =>
        expect(checkAnswer(anchors[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(
        checkAnswer(String([1, 2, 0, 1, 2, 0][i]), l.questions[0]!.answer),
      ).toBe(true);
    });
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      expect(
        q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
      ).toBeTruthy();
      if (q.answer.kind === 'explain') {
        expect(checkAnswer('focus distance parabola', q.answer)).toBeNull();
        expect(q.answer.rubric.zh.length).toBeGreaterThan(30);
        continue;
      }
      for (const raw of q.answerChecks!.accepted)
        expect(checkAnswer(raw, q.answer), `${q.id}: ${raw}`).toBe(true);
      for (const raw of q.answerChecks!.rejected)
        expect(checkAnswer(raw, q.answer), `${q.id}: ${raw}`).toBe(false);
    }
    h22CheckQuestions
      .slice(0, 6)
      .forEach((q, i) =>
        expect(checkAnswer(anchors[i]![0]!, q.answer)).toBe(true),
      );
  });
  it('independently reconstructs all 144 retrieval anchors and uses 24 different bilingual stems per lesson', () => {
    for (let i = 0; i < 6; i++) {
      const zh = new Set<string>(),
        en = new Set<string>();
      for (let k = 0; k < 24; k++) {
        const q = h22ReviewQuestion(`H22-L0${i + 1}`, k),
          h = -2 + (k % 4),
          v = -2 + (Math.floor(k / 4) % 3),
          vertical = k % 2 === 1;
        zh.add(q.stem.zh);
        en.add(q.stem.en);
        expect(
          checkAnswer(
            'value' in q.answer ? String(q.answer.value) : '',
            q.answer,
          ),
        ).toBe(true);
        if (i === 0) {
          const m = 1 + Math.floor(k / 4),
            b = -2 + (k % 4);
          expect(checkAnswer(`y=${m}x+(${b})`, q.answer)).toBe(true);
        } else if (i === 1) {
          const c = -5 - Math.floor(k / 12),
            s = 3 * h + 4 * v + c;
          expect(
            checkAnswer(
              k % 2 === 0 ? `sqrt(${s * s}/25)` : `(${h},${v})`,
              q.answer,
            ),
          ).toBe(k % 2 === 0 || s === 0);
          if (k % 2)
            expect(
              checkAnswer(
                `(${25 * h - 3 * s}/25,${25 * v - 4 * s}/25)`,
                q.answer,
              ),
            ).toBe(true);
        } else if (i === 2) {
          const r = 1 + Math.floor(k / 12);
          expect(
            checkAnswer(
              `x²+y²-(${2 * h})x-(${2 * v})y+(${h * h + v * v - r * r})=0`,
              q.answer,
            ),
          ).toBe(true);
        } else if (i === 3) {
          const p = k < 12 ? 1 : -1;
          expect(
            checkAnswer(
              vertical
                ? `(x-(${h}))²=${4 * p}(y-(${v}))`
                : `(y-(${v}))²=${4 * p}(x-(${h}))`,
              q.answer,
            ),
          ).toBe(true);
        } else {
          const sizes =
              i === 4
                ? [
                    [5, 3, 4],
                    [5, 4, 3],
                    [13, 5, 12],
                  ]
                : [
                    [3, 5, 4],
                    [4, 5, 3],
                    [5, 13, 12],
                  ],
            [a, , b] = sizes[Math.floor(k / 8) % 3]!;
          if (k % 3 === 0)
            expect(checkAnswer(String(2 * a!), q.answer)).toBe(true);
          else {
            const u = vertical ? `(y-(${v}))` : `(x-(${h}))`,
              w = vertical ? `(x-(${h}))` : `(y-(${v}))`;
            expect(
              checkAnswer(
                `${b! * b!}*${u}²${i === 4 ? '+' : '-'}${a! * a!}*${w}²=${a! * a! * b! * b!}`,
                q.answer,
              ),
            ).toBe(true);
          }
        }
        expect(h22ReviewQuestion(`H22-L0${i + 1}`, k + 24).id).not.toBe(q.id);
        expect(h22ReviewQuestion(`H22-L0${i + 1}`, k + 24).stem).toEqual(
          q.stem,
        );
      }
      expect(zh.size, `lesson ${i + 1}`).toBe(24);
      expect(en.size, `lesson ${i + 1}`).toBe(24);
    }
    expect(sameR(coefficient('y²=8x', 'yy'), cq(1))).toBe(true);
  });
  it('rejects invalid review identities and rounds instead of silently reusing a question', () => {
    for (const r of [-1, 0.5, NaN, Infinity, 100001])
      expect(() => h22ReviewQuestion('H22-L01', r)).toThrow();
    expect(() => h22ReviewQuestion('H22-L07', 0)).toThrow();
    expect(h22ReviewQuestion('H22-L06', 100000).id).toBe('H22-L06-R100000');
  });
});
