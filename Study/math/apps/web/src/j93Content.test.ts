import { describe, it, expect } from 'vitest';
import {
  j93Lessons,
  j93CheckQuestions,
  j93ReviewQuestion,
} from './content/J93';
import { curriculum, lessons, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
import { rational, textR } from './algebraModels';
import { numericQ, quadraticCandidateAudit } from './quadraticModels';
import { radicalText } from './radicalModels';
import {
  parabolaModel,
  parabolaAt,
  parabolaForms,
  checkQuadraticForm,
  checkParabolaOpening,
  horizontalIntersections,
  intervalExtrema,
  maximumCases,
  intersectionCases,
} from './parabolaModels';
import { parabolaCurve } from './ParabolaVisuals';
const bodies = import.meta.glob('../../../content/lessons/J93-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...j93Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...j93CheckQuestions,
];
describe('J93 quadratic functions, exact forms and constrained optima', () => {
  it('registers five planned bilingual lessons and two worked examples per language', () => {
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
        .filter((l) => l.id.startsWith('J93-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(j93Lessons.map((l) => ({ id: l.id, title: l.title })));
    expect(unitChecks.J93.questions).toHaveLength(8);
    for (const l of j93Lessons) {
      expect(l.questions).toHaveLength(6);
      expect(l.minutes).toBeLessThanOrEqual(20);
      expect(l.keywords).toHaveLength(3);
      expect(l.stage).toBe('J09');
      expect(l.contentStatus).toBe('ready');
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const p = lessons.findIndex((v) => v.id === id);
        expect(p, id).toBeGreaterThanOrEqual(0);
        expect(p, id).toBeLessThan(lessons.indexOf(l));
      }
      const [zh, en] =
        bodies[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(j93ReviewQuestion(l.id, 0));
    }
  });
  it('checks all 48 authored items and leaves ten explanations human-reviewed', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(10);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      expect(q.stem.zh.length).toBeGreaterThan(5);
      expect(q.solution.en.length).toBeGreaterThan(15);
      if (q.answer.kind === 'explain') {
        expect(checkAnswer('vertex domain proof', q.answer)).toBeNull();
        continue;
      }
      for (const s of q.answerChecks!.accepted)
        expect(checkAnswer(s, q.answer), `${q.id}: ${s}`).toBe(true);
      for (const s of q.answerChecks!.rejected)
        expect(checkAnswer(s, q.answer), `${q.id} rejects ${s}`).toBe(false);
    }
  });
  it('independently anchors every constructed answer and every choice', () => {
    const anchors: (string | null)[][] = [
      ['up', 'down', '18', 'not-quadratic', null, 'down'],
      ['(2,-1)', '-3', '(2,-5)', '3', '(-1,4)', '(3,5/2)'],
      [
        '(x-2)^2-1',
        '2x²-4x-1',
        '(x-3)(x-1)',
        null,
        '9-2(x+2)^2',
        '(2x+2)(x-3)',
      ],
      ['3,1', '2', '∅', '±√2', '10,8', '3,-1'],
      ['25', '9', '24', '7', '3,2', null],
    ];
    for (const [i, l] of j93Lessons.entries()) {
      const qs = [l.guided, ...l.questions.slice(1, 5), l.exit];
      for (const [j, s] of anchors[i]!.entries())
        expect(
          checkAnswer(s ?? 'Parent reads reasoning', qs[j]!.answer),
          qs[j]!.id,
        ).toBe(s === null ? null : true);
      expect(
        checkAnswer(String([0, 1, 1, 1, 1][i]), l.questions[0]!.answer),
      ).toBe(true);
    }
    for (const [i, s] of [
      'down',
      '(2,-5)',
      '(x+1)^2-4',
      '±√3',
      '24',
      null,
      '1',
      null,
    ].entries())
      expect(
        checkAnswer(
          s ?? 'Parent reads reasoning',
          j93CheckQuestions[i]!.answer,
        ),
      ).toBe(s === null ? null : true);
  });
  it('uses coefficients after collection and keeps degeneration separate from opening', () => {
    for (const [s, wanted] of [
      ['-2(x+1)²+4', 'down'],
      ['(1/2)x²+3', 'up'],
      ['x²-x²+2x', 'not-quadratic'],
      ['0x²+3', 'not-quadratic'],
    ])
      expect(parabolaModel(s!).opening).toBe(wanted);
    expect(checkParabolaOpening('向上', 'up')).toBe(true);
    expect(checkParabolaOpening('up', 'down')).toBe(false);
    expect(checkParabolaOpening('left', 'up')).toBe(false);
    for (const s of ['x³+1', 'x²=0', '1/x', 'y²', 'x²+1001', 'x'.repeat(301)])
      expect(() => parabolaModel(s)).toThrow();
  });
  it('checks 196 signed-coefficient shifted squares against independent vertex and symmetry formulas', () => {
    let n = 0;
    for (const a of [-2, -1, 1, 2])
      for (let h = -3; h <= 3; h++)
        for (let k = -3; k <= 3; k++) {
          const source = `(${a})(x-(${h}))²+(${k})`,
            m = parabolaModel(source);
          n++;
          expect([textR(m.a), textR(m.b), textR(m.c)]).toEqual([
            String(a),
            String(-2 * a * h),
            String(a * h * h + k),
          ]);
          expect(m.vertex).toEqual({
            x: rational(BigInt(h)),
            y: rational(BigInt(k)),
          });
          for (const d of [0, 1, 2]) {
            const left = parabolaAt(source, [BigInt(h - d), 1n]),
              right = parabolaAt(source, [BigInt(h + d), 1n]);
            expect(textR(left)).toBe(String(a * d * d + k));
            expect(left).toEqual(right);
          }
        }
    expect(n).toBe(196);
  });
  it('retains fractional vertices and distinguishes c from vertex height', () => {
    expect(parabolaModel('-(1/2)x²+3x-2').vertex).toEqual({
      x: [3n, 1n],
      y: [5n, 2n],
    });
    expect(parabolaModel('2x²-8x+3').vertex).toEqual({
      x: [2n, 1n],
      y: [-5n, 1n],
    });
    for (const h of [-5, -1, 1, 3, 5])
      for (const a of [-2, -1, 1, 2]) {
        const source = `(${a})(x-(${h}/2))²+1/3`,
          m = parabolaModel(source);
        expect(m.vertex!.x).toEqual(rational(BigInt(h), 2n));
        expect(m.vertex!.y).toEqual([1n, 3n]);
        for (const form of ['standard', 'vertex', 'factored'] as const) {
          const text = parabolaForms(source)[form];
          if (text)
            expect(checkQuadraticForm(text, source, form), text).toBe(true);
        }
      }
  });
  it('checks expression structure separately from identity, allowing reordered and rational factors', () => {
    for (const raw of [
      '(x-2)^2-1',
      '-1+(2-x)²',
      '((x-2)²-1)*1',
      '(2(x-2)²-2)/2',
    ])
      expect(checkQuadraticForm(raw, 'x²-4x+3', 'vertex'), raw).toBe(true);
    for (const raw of [
      '(x-1)(x-3)',
      '(x-3)*(x-1)',
      '(1-x)(3-x)',
      '(2x-2)(x-3)/2',
    ])
      expect(checkQuadraticForm(raw, 'x²-4x+3', 'factored'), raw).toBe(true);
    for (const [raw, form] of [
      ['x²-4x+3', 'vertex'],
      ['(x-1)(x-3)', 'vertex'],
      ['x²-4x+3', 'factored'],
      ['(x-2)²-1', 'standard'],
      ['2(x-1)²-2x+1', 'vertex'],
    ] as const) {
      expect(checkQuadraticForm(raw, 'x²-4x+3', form)).toBe(false);
      if (raw !== '2(x-1)²-2x+1')
        expect(checkQuadraticForm(raw, 'x²-4x+3')).toBe(true);
    }
    expect(checkQuadraticForm('(2x-2)²', '4x²-8x+4', 'vertex')).toBe(false);
    expect(checkQuadraticForm('2(x-1)(x-3)', 'x²-4x+3')).toBe(false);
    expect(checkQuadraticForm('y=(x-2)²-1', 'x²-4x+3', 'vertex')).toBe(false);
    expect(checkQuadraticForm('-(x-2)²', '-x²+4x-4', 'factored')).toBe(true);
    expect(parabolaForms('x²+1').factored).toBeNull();
    expect(parabolaForms('x²-2').factored).toBeNull();
    expect(parabolaForms('x²-2').roots).toEqual(['-√2', '√2']);
  });
  it('distinguishes original horizontal intersections from difference-function zeros and approximate inputs', () => {
    const expected = [['1', '3'], ['2'], [], ['-√2', '√2'], ['8', '10']];
    for (const [i, c] of intersectionCases.entries()) {
      const s = horizontalIntersections(c.source, c.level);
      expect(s.roots!.map(radicalText)).toEqual(expected[i]);
      for (const r of s.roots!)
        expect(
          quadraticCandidateAudit(`${c.source}=${c.level}`, radicalText(r))!
            .equationPass,
        ).toBe(true);
    }
    expect(quadraticCandidateAudit('x²=2', '1.41')).toMatchObject({
      left: '19881/10000',
      right: '2',
      equationPass: false,
    });
    expect(quadraticCandidateAudit('x²=2', '√2')).toMatchObject({
      left: '2',
      right: '2',
      equationPass: true,
    });
    expect(horizontalIntersections('0x²+2', '2').roots).toBeNull();
  });
  it('evaluates the actual plotted curve at independent parameter positions and clips the domain, not y-values', () => {
    for (const source of ['x²', '-2(x-1)²+3', 'x²-4x+3', '2x+1'])
      for (const wide of [false, true])
        for (const domain of [undefined, { lower: '1', upper: '4' }]) {
          const g = parabolaCurve(source, wide, domain),
            [p0, p1, p2] = g.control,
            m = parabolaModel(source);
          for (let i = 0; i <= 20; i++) {
            const t = i / 20,
              B = (key: 'x' | 'y') =>
                (1 - t) ** 2 * p0![key] +
                2 * t * (1 - t) * p1![key] +
                t * t * p2![key],
              x = B('x');
            expect(B('y')).toBeCloseTo(
              numericQ(m.a) * x * x + numericQ(m.b) * x + numericQ(m.c),
              10,
            );
          }
          if (domain) expect([p0!.x, p2!.x]).toEqual([1, 4]);
        }
    expect(parabolaCurve('10x²').control[0]!.y).toBeGreaterThan(10);
  });
  it('independently checks continuous maxima and minima on 320 closed intervals by a complete quarter-grid', () => {
    let count = 0;
    for (const a of [-2, -1, 1, 2])
      for (let h = -3; h <= 4; h++)
        for (let lower = -2; lower <= 2; lower++)
          for (const width of [1, 3]) {
            const upper = lower + width,
              source = `(${a})(x-(${h}/2))²+3`,
              e = intervalExtrema(source, String(lower), String(upper)),
              points = Array.from({ length: width * 4 + 1 }, (_, i) => {
                const x = lower + i / 4;
                return { x, y: a * (x - h / 2) ** 2 + 3 };
              }),
              min = Math.min(...points.map((p) => p.y)),
              max = Math.max(...points.map((p) => p.y));
            count++;
            expect(numericQ(e.minimum.value)).toBe(min);
            expect(numericQ(e.maximum.value)).toBe(max);
            expect(
              e.minimum.inputs.map(numericQ).sort((x, y) => x - y),
            ).toEqual(points.filter((p) => p.y === min).map((p) => p.x));
            expect(
              e.maximum.inputs.map(numericQ).sort((x, y) => x - y),
            ).toEqual(points.filter((p) => p.y === max).map((p) => p.x));
          }
    expect(count).toBe(320);
  });
  it('checks discrete optima by independent exhaustive integer enumeration including negative fractional bounds', () => {
    for (const a of [-2, -1, 1, 2])
      for (let b = -5; b <= 5; b++)
        for (const [lo, hi] of [
          [-3, 3],
          [0, 5],
          [-2.5, 1.5],
          [-0.5, 0.5],
        ]) {
          const source = `(${a})x²+(${b})x+1`,
            e = intervalExtrema(source, String(lo), String(hi), true),
            points = Array.from(
              { length: Math.floor(hi!) - Math.ceil(lo!) + 1 },
              (_, i) => Math.ceil(lo!) + i,
            ),
            ys = points.map((x) => a * x * x + b * x + 1),
            min = Math.min(...ys),
            max = Math.max(...ys);
          expect(numericQ(e.minimum.value)).toBe(min);
          expect(numericQ(e.maximum.value)).toBe(max);
          expect(e.maximum.inputs.map(numericQ)).toEqual(
            points.filter((_, i) => ys[i] === max),
          );
        }
    const tie = intervalExtrema('-x²+5x+1', '0', '5', true);
    expect(textR(tie.maximum.value)).toBe('7');
    expect(tie.maximum.inputs.map(textR)).toEqual(['2', '3']);
    expect(intervalExtrema('x²', '2', '2').minimum).toEqual({
      value: [4n, 1n],
      inputs: [[2n, 1n]],
    });
    for (const args of [
      ['x²', '2', '1', false],
      ['x²', '1/4', '3/4', true],
      ['x²', '0', '100', true],
      ['2x+1', '0', '2', false],
    ] as const)
      expect(() =>
        intervalExtrema(args[0], args[1], args[2], args[3]),
      ).toThrow();
  });
  it('separates maximum outputs from every attaining input in all fictional contexts', () => {
    expect(checkAnswer('25 cm²', j93Lessons[4]!.guided.answer)).toBe(true);
    expect(checkAnswer('25 cm', j93Lessons[4]!.guided.answer)).toBe(false);
    expect(
      maximumCases.map((c) => {
        const e = intervalExtrema(c.source, c.lower, c.upper, c.whole);
        return {
          value: textR(e.maximum.value),
          inputs: e.maximum.inputs.map(textR),
        };
      }),
    ).toEqual([
      { value: '25', inputs: ['5'] },
      { value: '24', inputs: ['4'] },
      { value: '7', inputs: ['2', '3'] },
      { value: '9', inputs: ['2'] },
    ]);
  });
  it('validates 400 retrieval rounds with independently derived coefficients, roots and bounded optima', () => {
    for (const [i, l] of j93Lessons.entries())
      for (let k = 0; k < 80; k++) {
        const q = j93ReviewQuestion(l.id, k),
          h = (k % 9) - 4,
          c = (Math.floor(k / 9) % 9) - 4,
          a = [-2, -1, 1, 2][k % 4]!,
          n = k % 5;
        let answer: string;
        if (i === 0) {
          const a = [-3, -2, -1, 0, 0.5, 1, 2, 3][k % 8]!;
          answer = a === 0 ? 'not-quadratic' : a > 0 ? 'up' : 'down';
        } else if (i === 1) answer = k % 4 === 0 ? String(h) : `(${h},${c})`;
        else if (i === 2) {
          const u = (k % 7) - 3,
            w = (Math.floor(k / 7) % 7) - 3;
          answer =
            k % 3 === 0
              ? `(${a})x²${u + w ? `+(${-a * (u + w)})x` : ''}${u * w ? `+(${a * u * w})` : ''}`
              : k % 3 === 1
                ? `(${a})(x-((${u + w})/2))²+(${-a * (u - w) ** 2}/4)`
                : `(${a})(x-(${u}))(x-(${w}))`;
        } else if (i === 3)
          answer = k % 5 === 4 ? '∅' : n === 0 ? String(h) : `${h}±√${n}`;
        else if (k % 4 === 0) {
          const p = (k % 5) + 1;
          answer = String(p * p + p + c);
        } else {
          const upper = (k % 5) + 1,
            vertex = (k % 9) - 2,
            x = Math.max(0, Math.min(upper, vertex));
          answer =
            k % 2 === 0
              ? String(
                  Math.min(
                    -vertex * vertex + c,
                    -(upper - vertex) * (upper - vertex) + c,
                  ),
                )
              : String(x);
        }
        expect(checkAnswer(answer, q.answer), q.id).toBe(true);
        for (const bad of q.answerChecks!.rejected)
          expect(checkAnswer(bad, q.answer), q.id).toBe(false);
      }
    for (const [id, k] of [
      ['J93-L06', 0],
      ['J93-L01', -1],
      ['J93-L01', 1.1],
      ['J93-L01', 100001],
    ] as const)
      expect(() => j93ReviewQuestion(id, k)).toThrow();
  });
});
