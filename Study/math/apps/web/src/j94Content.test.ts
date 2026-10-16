import { describe, it, expect } from 'vitest';
import {
  j94Lessons,
  j94CheckQuestions,
  j94ReviewQuestion,
} from './content/J94';
import { curriculum, lessons, reviewQuestionFor, unitChecks } from './content';
import { checkAnswer } from './model';
import { textR, rational } from './algebraModels';
import {
  baseSimilarTriangle,
  dilationImage,
  similarityImage,
  similaritySummary,
  availableSimilarityRules,
  similarityCases,
  scaledSide,
  rectangleScale,
  mapDistance,
  shadowHeight,
  photoModel,
  projectivePhotoPoint,
} from './similarityModels';
import { similarityScreenPoints } from './SimilarityVisuals';
const bodies = import.meta.glob('../../../content/lessons/J94-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...j94Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...j94CheckQuestions,
];
describe('J94 exact similarity, criteria and application premises', () => {
  it('opens five exact planned titles with complete bilingual bodies and earlier bridges', () => {
    const registry = curriculum
      .flatMap((s) => s.units)
      .flatMap((u) => u.lessons);
    expect(registry).toHaveLength(358);
    expect(
      registry
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(
      registry
        .filter((l) => l.id.startsWith('J94-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(j94Lessons.map((l) => ({ id: l.id, title: l.title })));
    for (const l of j94Lessons) {
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.minutes).toBeLessThanOrEqual(20);
      expect(l.stage).toBe('J09');
      expect(l.contentStatus).toBe('ready');
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const ix = lessons.findIndex((p) => p.id === id);
        expect(ix, id).toBeGreaterThanOrEqual(0);
        expect(ix).toBeLessThan(lessons.indexOf(l));
      }
      const [zh, en] =
        bodies[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(j94ReviewQuestion(l.id, 0));
    }
    expect(unitChecks.J94.questions).toHaveLength(8);
  });
  it('validates all 48 items and keeps eleven proofs under human review', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(11);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      expect(q.solution.en.length).toBeGreaterThan(15);
      if (q.answer.kind === 'explain') {
        expect(checkAnswer('a plausible explanation', q.answer)).toBeNull();
        continue;
      }
      for (const a of q.answerChecks!.accepted)
        expect(checkAnswer(a, q.answer), `${q.id}: ${a}`).toBe(true);
      for (const a of q.answerChecks!.rejected)
        expect(checkAnswer(a, q.answer), `${q.id} rejects ${a}`).toBe(false);
    }
  });
  it('anchors every constructed answer and every choice independently', () => {
    const anchors: (string | null)[][] = [
      ['ED', '1.5', '2/3', 'not similar', null, '相似'],
      ['AA', 'SAS', 'SSS', '条件不足', null, 'insufficient'],
      ['7.5 cm', '3', '8', '6', 'insufficient', '15/2'],
      ['9', '2.25', '1.5', 'sqrt(2)', '54 cm²', null],
      ['1.5 km', '4 cm', '7.5', 'insufficient', '4.5 m', null],
    ];
    for (const [i, l] of j94Lessons.entries()) {
      const qs = [l.guided, ...l.questions.slice(1, 5), l.exit];
      for (const [j, a] of anchors[i]!.entries())
        expect(
          checkAnswer(a ?? 'Parent reasoning', qs[j]!.answer),
          qs[j]!.id,
        ).toBe(a === null ? null : true);
      expect(
        checkAnswer(String([0, 1, 1, 1, 0][i]), l.questions[0]!.answer),
      ).toBe(true);
    }
    for (const [i, a] of [
      'DE',
      'insufficient',
      '8',
      '√2',
      '4.5',
      null,
      '0',
      null,
    ].entries())
      expect(
        checkAnswer(a ?? 'Parent reasoning', j94CheckQuestions[i]!.answer),
      ).toBe(a === null ? null : true);
  });
  it('audits exact factors and areas under all quarter turns and reflections', () => {
    let n = 0;
    for (const k of ['1/2', '1', '3/2', '2', '3'])
      for (const turns of [0, 1, 2, 3] as const)
        for (const mirror of [false, true]) {
          const target = similarityImage(baseSimilarTriangle, k, turns, mirror),
            m = similaritySummary(baseSimilarTriangle, target);
          expect(m.similar).toBe(true);
          expect(m.factor).toBe(k);
          expect(m.congruent).toBe(k === '1');
          const [a, b] = k.split('/').map(Number);
          expect(Number(m.areaRatio[0]) / Number(m.areaRatio[1])).toBe(
            (a! / (b ?? 1)) ** 2,
          );
          expect(textR(m.sourceArea)).toBe('6');
          n++;
        }
    expect(n).toBe(40);
  });
  it('rejects a bad proposed order without losing the valid whole-figure correspondence', () => {
    const target = similarityImage(baseSimilarTriangle, '3/2');
    expect(similaritySummary(baseSimilarTriangle, target, 'DFE').similar).toBe(
      false,
    );
    expect(similaritySummary(baseSimilarTriangle, target, 'DEF').similar).toBe(
      true,
    );
    expect(() =>
      similaritySummary(baseSimilarTriangle, target, 'DDD'),
    ).toThrow();
    expect(() =>
      similaritySummary(
        [
          baseSimilarTriangle[0]!,
          baseSimilarTriangle[0]!,
          baseSimilarTriangle[1]!,
        ],
        target,
      ),
    ).toThrow();
  });
  it('dilates about a nonzero centre and keeps that centre fixed', () => {
    const center = [
      [2n, 1n],
      [-1n, 1n],
    ] as const;
    expect(dilationImage(center, center, [3n, 2n])).toEqual(center);
    expect(
      dilationImage(
        [
          [6n, 1n],
          [3n, 1n],
        ],
        center,
        [3n, 2n],
      ),
    ).toEqual([
      [8n, 1n],
      [5n, 1n],
    ]);
    for (const k of ['0', '-1', '4'])
      expect(() => similarityImage(baseSimilarTriangle, k)).toThrow();
  });
  it('uses included angles rather than arbitrary angle-plus-two-side evidence', () => {
    expect(
      similarityCases.map((c) => availableSimilarityRules(c.facts)),
    ).toEqual([
      ['AA'],
      ['SAS'],
      ['SSS'],
      ['insufficient'],
      ['insufficient'],
      ['insufficient'],
      ['AA'],
    ]);
    expect(
      availableSimilarityRules({
        angles: ['A', 'B'],
        ratios: { AB: '2', BC: '2', CA: '2' },
      }),
    ).toEqual(['AA', 'SAS', 'SSS']);
    expect(
      availableSimilarityRules({ angles: ['B'], ratios: { AB: '2', BC: '2' } }),
    ).toEqual(['SAS']);
    expect(
      availableSimilarityRules({ angles: ['A'], ratios: { AB: '2', BC: '2' } }),
    ).toEqual(['insufficient']);
    expect(
      availableSimilarityRules({ angles: ['A', 'A'], ratios: {} }),
    ).toEqual(['insufficient']);
  });
  it('constructs an actual SSA counterexample with equal given ratios and unequal third ratio', () => {
    const c = similarityCases[3]!,
      dist = (p: typeof c.source, i: number, j: number) =>
        Math.hypot(p[i]!.x - p[j]!.x, p[i]!.y - p[j]!.y),
      angle = (p: typeof c.source) => {
        const u = { x: p[1]!.x - p[0]!.x, y: p[1]!.y - p[0]!.y },
          v = { x: p[2]!.x - p[0]!.x, y: p[2]!.y - p[0]!.y };
        return (
          (Math.acos(
            (u.x * v.x + u.y * v.y) /
              (Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y)),
          ) *
            180) /
          Math.PI
        );
      };
    expect(dist(c.target, 0, 1) / dist(c.source, 0, 1)).toBeCloseTo(1.5);
    expect(dist(c.target, 1, 2) / dist(c.source, 1, 2)).toBeCloseTo(1.5);
    expect(angle(c.source)).toBeCloseTo(30);
    expect(angle(c.target)).toBeCloseTo(30);
    expect(dist(c.target, 2, 0) / dist(c.source, 2, 0)).not.toBeCloseTo(1.5);
    expect(dist(c.source, 2, 0)).toBeCloseTo(3 * Math.sqrt(3) - Math.sqrt(7));
    expect(dist(c.target, 2, 0)).toBeCloseTo(
      1.5 * (3 * Math.sqrt(3) + Math.sqrt(7)),
    );
  });
  it('separates AA similarity from equal size and rejects invalid numerical givens', () => {
    const c = similarityCases[6]!;
    expect(c.target[1]!.x - c.target[0]!.x).toBeCloseTo(6);
    expect(c.source[1]!.x - c.source[0]!.x).toBeCloseTo(4);
    for (const v of ['0', '-2', '21', 'bad'])
      expect(() =>
        availableSimilarityRules({ angles: [], ratios: { AB: v } }),
      ).toThrow();
    expect(checkAnswer('AAA', { kind: 'similarity-rule', value: 'AA' })).toBe(
      true,
    );
    expect(checkAnswer('SSA', { kind: 'similarity-rule', value: 'SAS' })).toBe(
      false,
    );
  });
  it('checks 72 rational forward-and-reverse side calculations against integer fractions', () => {
    for (let a = 1; a <= 8; a++)
      for (let b = 1; b <= 9; b++) {
        expect(textR(scaledSide('5', String(a), String(b)).target)).toBe(
          textR(rational(BigInt(5 * b), BigInt(a))),
        );
        expect(textR(scaledSide(String(b), String(b), String(a)).target)).toBe(
          String(a),
        );
      }
    expect(() => scaledSide('5', '0', '6')).toThrow();
  });
  it('distinguishes perimeter and area ratios, including nonuniform stretches', () => {
    const u = rectangleScale('3', '2', '3');
    expect([
      textR(u.targetWidth),
      textR(u.targetHeight),
      textR(u.targetArea),
      textR(u.areaRatio),
      textR(u.perimeterRatio),
    ]).toEqual(['9', '6', '54', '9', '3']);
    const a = rectangleScale('3', '2', '2', '3/2');
    expect(a.similar).toBe(false);
    expect(textR(a.targetArea)).toBe('18');
    expect(textR(a.areaRatio)).toBe('3');
    expect(textR(a.perimeterRatio)).toBe('9/5');
    expect(checkAnswer('1.41', { kind: 'radical', value: '√2' })).toBe(false);
    expect(checkAnswer('-√2', { kind: 'radical', value: '√2' })).toBe(false);
  });
  it('keeps display geometry on a common scale under reflection and quarter turns', () => {
    const p = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 0, y: 3 },
    ];
    for (const turns of [0, 1, 2, 3])
      for (const mirror of [false, true]) {
        const q = similarityScreenPoints(
          p,
          { x: 100, y: 150 },
          17,
          turns,
          mirror,
        );
        expect(Math.hypot(q[1]!.x - q[0]!.x, q[1]!.y - q[0]!.y)).toBeCloseTo(
          68,
        );
        expect(Math.hypot(q[2]!.x - q[0]!.x, q[2]!.y - q[0]!.y)).toBeCloseTo(
          51,
        );
      }
  });
  it('unifies map units and calculates a shadow only after premises are supplied elsewhere', () => {
    expect(textR(mapDistance('3', '50000'))).toBe('3/2');
    expect(textR(mapDistance('4', '50000'))).toBe('2');
    expect(textR(shadowHeight('1.2', '.8', '3'))).toBe('9/2');
    expect(() => mapDistance('3', '0')).toThrow();
    expect(() => shadowHeight('1', '0', '3')).toThrow();
  });
  it('represents crop, stretch and projective examples as different operations', () => {
    expect(photoModel('uniform').similar).toBe(true);
    expect(textR(photoModel('uniform').height!)).toBe('15/2');
    expect(textR(photoModel('uniform').area!)).toBe('75');
    expect(photoModel('crop').similar).toBe(false);
    expect(textR(photoModel('crop').height!)).toBe('5');
    expect(textR(photoModel('stretch').height!)).toBe('6');
    expect(photoModel('perspective').width).toBeNull();
    const top = [projectivePhotoPoint(0, 0), projectivePhotoPoint(1, 0)],
      bottom = [projectivePhotoPoint(0, 1), projectivePhotoPoint(1, 1)];
    expect(top[1]!.x - top[0]!.x).toBeCloseTo(10);
    expect(bottom[1]!.x - bottom[0]!.x).toBeCloseTo(7.5);
    expect(bottom[0]!.y).toBeCloseTo(6);
  });
  it('validates 400 retrieval rounds with independently calculated rational expectations', () => {
    for (const [i, l] of j94Lessons.entries())
      for (let k = 0; k < 80; k++) {
        const q = j94ReviewQuestion(l.id, k),
          a = (k % 8) + 1,
          b = Math.floor(k / 8) + 2;
        let expected: string;
        if (i === 0)
          expected = textR(
            rational(BigInt(k % 2 ? a : b), BigInt(k % 2 ? b : a)),
          );
        else if (i === 1)
          expected = ['AA', 'SAS', 'SSS', 'insufficient'][k % 4]!;
        else if (i === 2)
          expected = textR(rational(BigInt(b * (a + 2)), BigInt(a)));
        else if (i === 3)
          expected = textR(
            rational(BigInt(k % 2 ? b : b * b), BigInt(k % 2 ? a : a * a)),
          );
        else
          expected = textR(rational(BigInt(a * (Math.floor(k / 8) + 1)), 10n));
        expect(checkAnswer(expected, q.answer), q.id).toBe(true);
        for (const wrong of q.answerChecks!.rejected)
          expect(checkAnswer(wrong, q.answer)).toBe(false);
        expect(q.id).toBe(`${l.id}-R${k}`);
      }
    for (const [id, k] of [
      ['J94-L00', 0],
      ['J94-L01', -1],
      ['J94-L01', 0.5],
      ['J94-L01', 100001],
    ] as const)
      expect(() => j94ReviewQuestion(id, k)).toThrow();
  });
});
