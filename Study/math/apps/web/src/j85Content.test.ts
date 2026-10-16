import { describe, it, expect } from 'vitest';
import {
  j85Lessons,
  j85CheckQuestions,
  j85ReviewQuestion,
} from './content/J85';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
import { readCoordinate } from './cartesianModels';
import { rational, textR } from './algebraModels';
import {
  classifyAffine,
  checkFunctionClass,
  functionModel,
  readFunctionModel,
  functionAt,
  functionText,
  slopeBetween,
  functionFromPoints,
  pointOnFunction,
  functionCurve,
  functionBounds,
  functionWideBounds,
  slopePointCases,
  twoPointCases,
  pointsFrom,
  functionComparisons,
  functionContext,
  auditFunctionContext,
  contextFunctionGraph,
} from './functionModels';
const markdown = import.meta.glob('../../../content/lessons/J85-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...j85Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...j85CheckQuestions,
];
const points = (a: string, b: string) => pointsFrom([a, b]);
describe('J85 exact function rates, intercepts and contextual domains', () => {
  it('registers six planned bilingual lessons, earlier prerequisites, two full examples per language and all 358 IDs', () => {
    const units = curriculum.flatMap((s) => s.units),
      registry = units.flatMap((u) => u.lessons),
      planned = units.find((u) => u.id === 'J85')!;
    expect(registry).toHaveLength(358);
    expect(
      registry
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(planned.lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      j85Lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(unitChecks.J85.questions).toHaveLength(8);
    for (const l of j85Lessons) {
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.minutes).toBeLessThanOrEqual(20);
      expect(l.contentStatus).toBe('ready');
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        expect(lessons.find((v) => v.id === id)).toBeTruthy();
        expect(lessons.findIndex((v) => v.id === id)).toBeLessThan(
          lessons.indexOf(l),
        );
      }
      const [zh, en] =
        markdown[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(j85ReviewQuestion(l.id, 0));
    }
  });
  it('checks all 56 bilingual items and their rejected forms while retaining human review for explanations', () => {
    expect(all).toHaveLength(56);
    expect(new Set(all.map((q) => q.id)).size).toBe(56);
    for (const [kind, count] of Object.entries({
      expression: 10,
      number: 15,
      coordinate: 6,
      'function-class': 11,
      choice: 7,
      explain: 7,
    }))
      expect(
        all.filter((q) => q.answer.kind === kind),
        kind,
      ).toHaveLength(count);
    for (const q of all) {
      expect(q.stem.zh.length).toBeGreaterThan(5);
      expect(q.stem.en.length).toBeGreaterThan(10);
      expect(q.hints).toHaveLength(2);
      expect(q.solution.zh.length).toBeGreaterThan(10);
      expect(q.solution.en.length).toBeGreaterThan(15);
      if (q.answer.kind === 'explain') {
        expect(checkAnswer('slope intercept domain', q.answer)).toBeNull();
        continue;
      }
      for (const raw of q.answerChecks!.accepted)
        expect(checkAnswer(raw, q.answer), `${q.id}: ${raw}`).toBe(true);
      for (const raw of q.answerChecks!.rejected)
        expect(checkAnswer(raw, q.answer), `${q.id} rejects ${raw}`).toBe(
          false,
        );
    }
  });
  it('independently records 42 constructed results and seven choices from the stated problems', () => {
    const values = [
      ['2x+3', '11', '-0.5', '-4', '常函数', '5-x'],
      ['2', '-2', '2/3', '-2', '0', '-1.5'],
      ['(0,3)', '-4', '(0,5)', '(0,-6)', '(0,3)', '(0,8)'],
      ['2x+1', '(x+1)/2', '3', '竖直线', '无法唯一确定', '4-x'],
      ['正比例', '一次但非正比例', '常函数', '非线性函数', '常函数', '正比例'],
      ['2x+5', '11', '8', '6', '14', '3x+4'],
    ];
    j85Lessons.forEach((l, i) => {
      [l.guided, ...l.questions.slice(1, 5), l.exit].forEach((q, j) =>
        expect(checkAnswer(values[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(
        checkAnswer(String([0, 1, 2, 0, 2, 1][i]), l.questions[0]!.answer),
      ).toBe(true);
    });
    ['3-2x', '3/2', '(0,-4)', '2x-3', 'vertical line', 'nonlinear'].forEach(
      (s, i) => expect(checkAnswer(s, j85CheckQuestions[i]!.answer)).toBe(true),
    );
    expect(checkAnswer('1', j85CheckQuestions[6]!.answer)).toBe(true);
  });
  it('recovers 6,804 known rational models from independently constructed points and preserves both point orders', () => {
    let count = 0;
    for (let n = -4; n <= 4; n++)
      for (let d = 1; d <= 3; d++)
        for (let b = -4; b <= 4; b++)
          for (let x = -3; x <= 3; x++)
            for (let dx = 1; dx <= 4; dx++) {
              const p = [
                  rational(BigInt(x)),
                  rational(BigInt(n * x + b * d), BigInt(d)),
                ] as const,
                q = [
                  rational(BigInt(x + dx)),
                  rational(BigInt(n * (x + dx) + b * d), BigInt(d)),
                ] as const,
                r = functionFromPoints(p, q),
                back = functionFromPoints(q, p);
              expect(r.kind).toBe('one');
              if (r.kind !== 'one' || back.kind !== 'one')
                throw Error('distinct x');
              expect(r.model.a[0] * BigInt(d)).toBe(BigInt(n) * r.model.a[1]);
              expect(r.model.b[0]).toBe(BigInt(b) * r.model.b[1]);
              expect(back.model).toEqual(r.model);
              expect(pointOnFunction(r.model, p)).toBe(true);
              expect(pointOnFunction(r.model, q)).toBe(true);
              count++;
            }
    expect(count).toBe(6804);
  });
  it('separates horizontal zero slope, vertical undefined slope and duplicate nonuniqueness', () => {
    expect(slopeBetween(...points('(-2,3)', '(3,3)')).slope).toEqual([0n, 1n]);
    expect(functionFromPoints(...points('(2,1)', '(2,4)')).kind).toBe(
      'vertical',
    );
    expect(functionFromPoints(...points('(2,1)', '(2,1)')).kind).toBe(
      'undetermined',
    );
    const p = readCoordinate('(2,1)')!;
    expect(pointOnFunction(functionModel('1', '-1'), p)).toBe(true);
    expect(pointOnFunction(functionModel('0', '1'), p)).toBe(true);
    expect(slopeBetween(...points('(1,3)', '(4,9)'))).toEqual({
      dx: [3n, 1n],
      dy: [6n, 1n],
      slope: [2n, 1n],
    });
    expect(slopeBetween(...points('(4,9)', '(1,3)'))).toEqual({
      dx: [-3n, 1n],
      dy: [-6n, 1n],
      slope: [2n, 1n],
    });
  });
  it('classifies nonzero direct, non-direct first-degree and constants under the explicit convention', () => {
    expect(classifyAffine(functionModel('2', '0'))).toBe('direct');
    expect(classifyAffine(functionModel('-1/2', '0'))).toBe('direct');
    expect(classifyAffine(functionModel('2', '3'))).toBe('affine');
    expect(classifyAffine(functionModel('0', '4'))).toBe('constant');
    expect(classifyAffine(functionModel('0', '0'))).toBe('constant');
    expect(checkFunctionClass('linear but not direct', 'affine')).toBe(true);
    expect(checkFunctionClass('一次但非正比例', 'affine')).toBe(true);
    expect(checkFunctionClass('direct', 'constant')).toBe(false);
    expect(checkFunctionClass('0', 'vertical')).toBe(false);
    expect(checkFunctionClass('no solution', 'undetermined')).toBe(false);
    expect(functionComparisons.map((c) => c.kind)).toEqual([
      'direct',
      'affine',
      'constant',
      'nonlinear',
      'constant',
      'direct',
    ]);
  });
  it('retains exact coefficients and distinguishes general expressions, one output and intercept coordinates', () => {
    const f = functionModel('-1/2', '4');
    expect(textR(functionAt(f, '2'))).toBe('3');
    expect(textR(functionAt(f, '0'))).toBe('4');
    expect(
      checkAnswer('3', { kind: 'expression', value: '-x/2+4', variable: 'x' }),
    ).toBe(false);
    expect(
      checkAnswer('(8-x)/2', {
        kind: 'expression',
        value: '-x/2+4',
        variable: 'x',
      }),
    ).toBe(true);
    expect(
      checkAnswer('y=-x/2+4', {
        kind: 'expression',
        value: '-x/2+4',
        variable: 'x',
      }),
    ).toBe(false);
    expect(pointOnFunction(f, readCoordinate('(0,4)')!)).toBe(true);
    expect(pointOnFunction(f, readCoordinate('(4,0)')!)).toBe(false);
  });
  it('clips 238 coefficient models to each display window without changing their source coordinates', () => {
    let count = 0;
    for (let m = -3; m <= 3; m++)
      for (let b = -8; b <= 8; b++)
        for (const bounds of [functionBounds, functionWideBounds]) {
          const f = functionModel(String(m), String(b)),
            curve = functionCurve(f, bounds);
          for (const p of curve) {
            expect(p.x).toBeGreaterThanOrEqual(bounds.xMin - 1e-10);
            expect(p.x).toBeLessThanOrEqual(bounds.xMax + 1e-10);
            expect(p.y).toBeGreaterThanOrEqual(bounds.yMin - 1e-10);
            expect(p.y).toBeLessThanOrEqual(bounds.yMax + 1e-10);
            expect(p.y).toBeCloseTo(m * p.x + b, 10);
          }
          count++;
        }
    expect(count).toBe(238);
    expect(functionCurve(functionModel('0', '8'), functionBounds)).toEqual([]);
    expect(
      functionCurve(functionModel('0', '8'), functionWideBounds),
    ).toHaveLength(2);
  });
  it('audits units, range and integer domains separately instead of accepting every evaluable output', () => {
    const travel = functionContext('travel'),
      drain = functionContext('drain'),
      cards = functionContext('cards'),
      temperature = functionContext('temperature');
    expect([
      travel.rateUnit,
      drain.rateUnit,
      cards.rateUnit,
      temperature.rateUnit,
    ]).toEqual(['NZD/km', 'L/min', 'cards/pack', '°C/h']);
    expect(auditFunctionContext(travel, '3', '11')!.accepted).toBe(true);
    expect(auditFunctionContext(travel, '10', '25')).toMatchObject({
      relationPass: true,
      inRange: false,
      accepted: false,
    });
    expect(auditFunctionContext(drain, '6', '0')!.accepted).toBe(true);
    expect(auditFunctionContext(drain, '7', '-2')).toMatchObject({
      relationPass: true,
      inRange: false,
      accepted: false,
    });
    expect(auditFunctionContext(cards, '1/2', '7/2')).toMatchObject({
      relationPass: true,
      inRange: true,
      integerPass: false,
      accepted: false,
    });
    expect(auditFunctionContext(cards, '4', '14')!.accepted).toBe(true);
    expect(auditFunctionContext(temperature, '1/2', '15/4')!.accepted).toBe(
      true,
    );
    expect(auditFunctionContext(travel, '-1', '3')!.inRange).toBe(false);
    expect(auditFunctionContext(travel, '3', '10')!.relationPass).toBe(false);
    expect(auditFunctionContext(travel, 'x', '11')).toBeNull();
  });
  it('draws only allowed continuous segments and unjoined integer points, including the exact emptying endpoint', () => {
    for (const bounds of [functionBounds, functionWideBounds])
      for (const kind of ['travel', 'drain', 'cards', 'temperature'] as const) {
        const c = functionContext(kind),
          g = contextFunctionGraph(c, bounds);
        if (kind === 'cards') {
          expect(g.curve).toEqual([]);
          for (const p of g.points) {
            expect(Number.isInteger(p.x)).toBe(true);
            expect(p.x).toBeGreaterThanOrEqual(0);
            expect(p.x).toBeLessThanOrEqual(4);
            expect(p.y).toBe(3 * p.x + 2);
          }
        } else {
          expect(g.points).toEqual([]);
          for (const p of g.curve) {
            expect(p.x).toBeGreaterThanOrEqual(0);
            expect(p.x).toBeLessThanOrEqual(
              Number(c.end[0]) / Number(c.end[1]),
            );
          }
        }
      }
    const g = contextFunctionGraph(
      functionContext('drain'),
      functionWideBounds,
    );
    expect(g.curve.at(-1)).toEqual({ x: 6, y: 0 });
    expect(
      contextFunctionGraph(functionContext('cards'), functionWideBounds).points,
    ).toHaveLength(5);
  });
  it('verifies 480 retrieval questions with independently calculated rates, intercepts, rules and contextual costs', () => {
    for (let i = 0; i < 6; i++)
      for (let k = 0; k < 80; k++) {
        const q = j85ReviewQuestion(`J85-L0${i + 1}`, k),
          n = (k % 9) - 4,
          d = [1, 2, 3][k % 3]!,
          b = (k % 7) - 3;
        let expected: string;
        if (i === 0 || i === 3) expected = `(${n}x+(${b * d}))/${d}`;
        else if (i === 1) expected = `${n}/${d}`;
        else if (i === 2) expected = `(0,${b})`;
        else if (i === 4)
          expected = [
            'direct proportion',
            'linear but not direct',
            'constant',
            'nonlinear',
          ][k % 4]!;
        else expected = String(((k % 5) + 1) * (k % 6) + (k % 7));
        expect(checkAnswer(expected, q.answer), q.id).toBe(true);
        for (const s of q.answerChecks!.accepted)
          expect(checkAnswer(s, q.answer)).toBe(true);
        for (const s of q.answerChecks!.rejected)
          expect(checkAnswer(s, q.answer)).toBe(false);
      }
  });
  it('keeps point catalogs exact and rejects invalid parsers, context IDs and review parameters', () => {
    for (const source of [...slopePointCases, ...twoPointCases]) {
      const p = pointsFrom(source);
      expect(p).toHaveLength(2);
    }
    for (const s of [
      'x^2',
      '1/x',
      'x/0',
      'y+2',
      'Math.random()',
      'x'.repeat(181),
    ])
      expect(readFunctionModel(s)).toBeNull();
    expect(() => pointsFrom(['bad', '(1,2)'])).toThrow();
    expect(() => functionContext('bad' as 'travel')).toThrow();
    for (const [id, k] of [
      ['J85-L00', 0],
      ['J84-L01', 0],
      ['J85-L01', -1],
      ['J85-L01', 0.2],
      ['J85-L01', 100001],
    ] as const)
      expect(() => j85ReviewQuestion(id, k)).toThrow();
    expect(functionText(functionModel('2', '-3'))).toContain('3');
  });
});
