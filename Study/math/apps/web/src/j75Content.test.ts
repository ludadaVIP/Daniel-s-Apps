import { describe, it, expect } from 'vitest';
import {
  j75Lessons,
  j75CheckQuestions,
  j75ReviewQuestion,
} from './content/J75';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
import {
  readCoordinate,
  checkCoordinate,
  coordinateRegion,
  coordinateText,
  basicBounds,
  plotBounds,
  plotPosition,
  plotNumber,
  ticks,
  lineValue,
  tableValues,
  lineSegment,
  contextGraph,
  type PlotBounds,
} from './cartesianModels';
const markdown = import.meta.glob('../../../content/lessons/J75-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...j75Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...j75CheckQuestions,
];
describe('J75 coordinates, exact relationships and valid domains', () => {
  it('registers all five planned bilingual titles, complete bodies, earlier prerequisites and the unchanged roadmap', () => {
    const registry = curriculum.flatMap((s) =>
        s.units.flatMap((u) => u.lessons),
      ),
      planned = curriculum.flatMap((s) => s.units).find((u) => u.id === 'J75')!;
    expect(registry).toHaveLength(358);
    expect(
      registry
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(j75Lessons.map((l) => ({ id: l.id, title: l.title }))).toEqual(
      planned.lessons.map((l) => ({ id: l.id, title: l.title })),
    );
    expect(unitChecks.J75.questions).toHaveLength(8);
    for (const l of j75Lessons) {
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.stage).toBe('J07');
      expect(l.minutes).toBeLessThanOrEqual(20);
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const p = lessons.find((l) => l.id === id)!;
        expect(p, `${l.id}->${id}`).toBeTruthy();
        expect(lessons.indexOf(p)).toBeLessThan(lessons.indexOf(l));
      }
      const [zh, en] =
        markdown[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(j75ReviewQuestion(l.id, 0));
    }
  });
  it('executes every accepted, equivalent and misconception case for 48 unique bilingual questions', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    for (const [kind, count] of Object.entries({
      coordinate: 14,
      number: 16,
      expression: 6,
      choice: 6,
      explain: 6,
    }))
      expect(all.filter((q) => q.answer.kind === kind)).toHaveLength(count);
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      for (const text of [
        q.stem,
        q.solution,
        ...q.hints,
        ...q.solutionSteps!,
      ]) {
        expect(text.zh, q.id).toBeTruthy();
        expect(text.en, q.id).toBeTruthy();
      }
      if (q.answer.kind === 'explain') {
        expect(checkAnswer('linear because points match', q.answer)).toBeNull();
        continue;
      }
      for (const s of q.answerChecks!.accepted)
        expect(checkAnswer(s, q.answer), `${q.id} accepts ${s}`).toBe(true);
      for (const s of q.answerChecks!.rejected)
        expect(checkAnswer(s, q.answer), `${q.id} rejects ${s}`).toBe(false);
    }
  });
  it('independently checks all 36 constructed results and six choices from the authored problems', () => {
    const expected = [
      ['(3,-2)', '-4', '0', '(0,-3)', '(-2,5)', '(-3,-2)'],
      ['(-2,3)', '(1.5,-0.5)', '-6', '(0,4)', '(-3,-2)', '(3,2)'],
      ['(2,5)', '-1', '7', '5/2', '(0,-2)', '(3,5)'],
      ['14', '2x-1', '-2', '-6', '3', '2-x/2'],
      ['7', '6', '17', '5+3x', '-1', '3'],
    ];
    j75Lessons.forEach((l, i) => {
      [l.guided, ...l.questions.slice(1, 5), l.exit].forEach((q, j) =>
        expect(checkAnswer(expected[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(l.questions[0]!.answer).toEqual({
        kind: 'choice',
        value: String([1, 2, 0, 1, 2][i]),
      });
    });
    ['(-4,2)', '(1/2,-3/2)', '-1', '4-2x', '7', '6'].forEach((v, i) =>
      expect(checkAnswer(v, j75CheckQuestions[i]!.answer)).toBe(true),
    );
    expect(j75CheckQuestions[6]!.answer).toEqual({
      kind: 'choice',
      value: '0',
    });
  });
  it('preserves exact ordered pairs with fractions, Unicode and zeros, rejecting ambiguous or unsafe syntax', () => {
    for (const s of ['(3/2,-1/2)', '1.5, -0.5', '（6/4，−2/4）'])
      expect(checkCoordinate(s, '(1.5,-0.5)')).toBe(true);
    expect(checkCoordinate('(-1/2,3/2)', '(3/2,-1/2)')).toBe(false);
    expect(coordinateText(readCoordinate('（0，-0）')!)).toBe('(0, 0)');
    for (const s of [
      '1',
      '(1 2)',
      '(1,2,3)',
      '((1,2))',
      '(1,2',
      '1,2)',
      'x=1,y=2',
      '(1cm,2cm)',
      '(1/0,2)',
      '(1%,2)',
      '(NaN,2)',
      '(Infinity,2)',
      '(alert(1),2)',
      '(1+1,2)',
      '('.repeat(161),
    ])
      expect(readCoordinate(s), s).toBeNull();
    expect(checkCoordinate('(1,2)', 'invalid')).toBe(false);
  });
  it('classifies all 121 integer pairs by coordinate signs with axes excluded from quadrants', () => {
    for (let x = -5; x <= 5; x++)
      for (let y = -5; y <= 5; y++) {
        const expected =
          x === 0 && y === 0
            ? 'origin'
            : y === 0
              ? 'x-axis'
              : x === 0
                ? 'y-axis'
                : x > 0
                  ? y > 0
                    ? 'I'
                    : 'IV'
                  : y > 0
                    ? 'II'
                    : 'III';
        expect(coordinateRegion(readCoordinate(`(${x},${y})`)!)).toBe(expected);
      }
  });
  it('uses labelled scale positions rather than square counts and preserves data under independent view changes', () => {
    const b = { xMin: -10, xMax: 10, yMin: -4, yMax: 8, xStep: 2, yStep: 2 };
    expect(plotPosition({ x: 0, y: 0 }, b)).toEqual({
      x: 264,
      y: 310 - (4 / 12) * 280,
    });
    expect(plotPosition({ x: -6, y: 2 }, b)).toEqual({ x: 144, y: 170 });
    expect(ticks(-2, 2, 0.5)).toEqual([-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2]);
    for (let x = -5; x <= 5; x++)
      for (let y = -5; y <= 5; y++) {
        const p = { x, y },
          a = plotPosition(p, basicBounds),
          wide = { ...basicBounds, xMin: -10, xMax: 10, xStep: 2 },
          w = plotPosition(p, wide);
        expect(((a.x - 64) / 400) * 10 - 5).toBeCloseTo(x, 10);
        expect(((w.x - 64) / 400) * 20 - 10).toBeCloseTo(x, 10);
        expect(a.y).toBe(w.y);
        expect(p).toEqual({ x, y });
      }
  });
  it('independently cross-multiplies 1,575 fractional affine outputs and same-row tables', () => {
    for (let k = -3; k <= 3; k++)
      for (let b = -2; b <= 2; b++)
        for (let n = -4; n <= 4; n++)
          for (const d of [1, 2, 3, 4, 5]) {
            const r = lineValue(`${k}/2`, String(b), `${n}/${d}`);
            expect(r[0] * BigInt(2 * d)).toBe(BigInt(k * n + 2 * b * d) * r[1]);
          }
    expect(tableValues('2', '1', ['-1', '0', '2', '3'])).toEqual([
      { x: '-1', y: '-1' },
      { x: '0', y: '1' },
      { x: '2', y: '5' },
      { x: '3', y: '7' },
    ]);
    expect(plotNumber('-3/2')).toBe(-1.5);
  });
  it('clips positive, negative and constant supplied lines to both domain and viewing rectangle', () => {
    const b: PlotBounds = {
      xMin: -4,
      xMax: 4,
      yMin: -6,
      yMax: 6,
      xStep: 1,
      yStep: 2,
    };
    for (let k = -4; k <= 4; k++)
      for (let c = -8; c <= 8; c++) {
        const line = lineSegment(k, c, b, [-2, 3]);
        if (k === 0 && Math.abs(c) > 6) {
          expect(line).toEqual([]);
          continue;
        }
        for (const p of line) {
          expect(p.x).toBeGreaterThanOrEqual(-2);
          expect(p.x).toBeLessThanOrEqual(3);
          expect(p.y).toBeGreaterThanOrEqual(-6);
          expect(p.y).toBeLessThanOrEqual(6);
          expect(p.y).toBeCloseTo(k * p.x + c, 10);
        }
      }
    expect(lineSegment(0, 3, b, [-2, 2])).toEqual([
      { x: -2, y: 3 },
      { x: 2, y: 3 },
    ]);
    expect(
      lineSegment(
        -2,
        12,
        { xMin: 0, xMax: 8, yMin: 0, yMax: 16, xStep: 2, yStep: 4 },
        [0, 6],
      ),
    ).toEqual([
      { x: 0, y: 12 },
      { x: 6, y: 0 },
    ]);
    expect(lineSegment(1, 0, b, [7, 8])).toEqual([]);
  });
  it('audits all half-step inputs without extending water, count or temperature domains', () => {
    for (let n = 0; n <= 16; n++) {
      const x = n / 2,
        w = contextGraph('water', String(x)),
        c = contextGraph('cards', String(x)),
        t = contextGraph('temperature', String(x));
      expect(w.allowed).toBe(x <= 6);
      expect(w.rawValue).toBe(String(12 - n));
      expect(w.value).toBe(x <= 6 ? String(12 - n) : null);
      expect(c.allowed).toBe(Number.isInteger(x) && x <= 6);
      expect(c.continuous).toBe(false);
      expect(t.allowed).toBe(x <= 4);
      const out = readCoordinate(`(0,${t.rawValue})`)![1];
      expect(out[0] * 4n).toBe(BigInt(-16 + 3 * n) * out[1]);
    }
    expect(contextGraph('water', '7')).toMatchObject({
      rawValue: '-2',
      value: null,
      allowed: false,
    });
    expect(contextGraph('cards', '5/2').value).toBeNull();
    expect(contextGraph('temperature', '2').value).toBe('-1');
    expect(contextGraph('water', '6').value).toBe('0');
    expect(contextGraph('cards', '0').value).toBe('5');
  });
  it('distinguishes general affine expressions from one assigned output, including constants and exact fractional rates', () => {
    expect(checkAnswer('3', j75Lessons[3]!.questions[4]!.answer)).toBe(true);
    expect(checkAnswer('3x', j75Lessons[3]!.questions[4]!.answer)).toBe(false);
    expect(checkAnswer('2(x-1/2)', j75Lessons[3]!.questions[1]!.answer)).toBe(
      true,
    );
    expect(checkAnswer('3', j75Lessons[3]!.questions[1]!.answer)).toBe(false);
    expect(checkAnswer('y=2x-1', j75Lessons[3]!.questions[1]!.answer)).toBe(
      false,
    );
    expect(checkAnswer('2-x/2', j75Lessons[3]!.exit.answer)).toBe(true);
  });
  it('independently computes all 400 retrieval results and checks accepted/rejected variants', () => {
    for (let i = 0; i < 5; i++)
      for (let k = 0; k < 80; k++) {
        const id = `J75-L0${i + 1}`,
          q = j75ReviewQuestion(id, k),
          a = (k % 9) - 4,
          b = (Math.floor(k / 9) % 9) - 4,
          d = k % 2 ? 2 : 1,
          m = (k % 5) - 2,
          c = 1 + (k % 6),
          expected =
            i === 0
              ? `(${a},${b})`
              : i === 1
                ? `(${a + 1}/${d},${b - 1}/${d})`
                : i === 2
                  ? `(${a},${m * a + b})`
                  : i === 3
                    ? `${b}+(${m}/${d})x`
                    : String(c + 6);
        expect(checkAnswer(expected, q.answer), `${id}/${k}`).toBe(true);
        for (const v of q.answerChecks!.accepted)
          expect(checkAnswer(v, q.answer)).toBe(true);
        for (const v of q.answerChecks!.rejected)
          expect(checkAnswer(v, q.answer)).toBe(false);
        expect(j75ReviewQuestion(id, k + 80).answer).toEqual(q.answer);
      }
  });
  it('rejects invalid scales, absent origins, outside points, empty tables and invalid retrievals', () => {
    for (const b of [
      { ...basicBounds, xStep: 0 },
      { ...basicBounds, xMin: 1 },
      { ...basicBounds, yMax: 0, yMin: 0 },
      { ...basicBounds, xStep: 0.01 },
      { ...basicBounds, yStep: NaN },
      { ...basicBounds, xMin: -4.5 },
    ])
      expect(() => plotBounds(b)).toThrow();
    expect(() => plotPosition({ x: 6, y: 0 }, basicBounds)).toThrow();
    expect(() => plotPosition({ x: NaN, y: 0 }, basicBounds)).toThrow();
    expect(() => lineSegment(1, 0, basicBounds, [2, 1])).toThrow();
    expect(() => tableValues('2', '1', [])).toThrow();
    expect(() => contextGraph('water', '1/0')).toThrow();
    expect(() => plotNumber('100001')).toThrow();
    for (const id of ['J75-L00', 'J75-L06', 'J74-L01'])
      expect(() => j75ReviewQuestion(id, 0)).toThrow();
    for (const n of [-1, 0.5, 100001, NaN])
      expect(() => j75ReviewQuestion('J75-L01', n)).toThrow();
  });
});
