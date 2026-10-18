import { describe, it, expect } from 'vitest';
import {
  j96Lessons,
  j96ReviewQuestion,
  j96CheckQuestions,
} from './content/J96';
import { curriculum, lessons, unitChecks, reviewQuestionFor } from './content';
import { checkAnswer } from './model';
import {
  trigTriangle,
  trigTriangles,
  trigValues,
  inverseTrig,
  roundTrig,
  radicalNumber,
  treeHeight,
  slopeModel,
  type TrigFunction,
} from './trigModels';
import { trigScreen } from './TrigVisuals';
const bodies = import.meta.glob('../../../content/lessons/J96-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...j96Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...j96CheckQuestions,
];
const legSquares = [
  [16, 9],
  [144, 25],
  [64, 225],
  [1, 1],
  [3, 1],
  [1, 3],
];
// Independent power series, avoiding the production Math.sin/cos/tan path.
function series(degrees: number) {
  const x = (degrees * Math.PI) / 180;
  let sin = x,
    cos = 1,
    s = x,
    c = 1;
  for (let n = 1; n < 15; n++) {
    s *= (-x * x) / (2 * n * (2 * n + 1));
    c *= (-x * x) / ((2 * n - 1) * (2 * n));
    sin += s;
    cos += c;
  }
  return { sin, cos, tan: sin / cos };
}
describe('J96 right-triangle ratios, degree inverses and explicit measurement models', () => {
  it('registers five exact planned courses with earlier bridges and two worked examples per language', () => {
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
        .filter((l) => l.id.startsWith('J96-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(j96Lessons.map((l) => ({ id: l.id, title: l.title })));
    expect(unitChecks.J96.questions).toHaveLength(8);
    for (const l of j96Lessons) {
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.minutes).toBeLessThanOrEqual(20);
      expect(l.stage).toBe('J09');
      expect(l.contentStatus).toBe('ready');
      for (const id of [...l.prerequisites, l.parent.bridge]) {
        const n = lessons.findIndex((p) => p.id === id);
        expect(n, id).toBeGreaterThanOrEqual(0);
        expect(n).toBeLessThan(lessons.indexOf(l));
      }
      const [zh, en] =
        bodies[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(j96ReviewQuestion(l.id, 0));
    }
  });
  it('validates all 48 items while leaving ten complete explanations human-reviewed', () => {
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(10);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      expect(q.solution.en.length).toBeGreaterThan(15);
      if (q.answer.kind === 'explain') {
        expect(checkAnswer('sin tan correct proof words', q.answer)).toBeNull();
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
      ['3/5', 'CA', 'BA', '6/10', '1/2', '1/√2'],
      ['4/5', '3/4', '正切', '8 cm', '8', '3/5'],
      ['1.0000', '0.5000', '.5000', '√3', 'cos', null],
      ['36.9°', '53.1°', '45.0', '30.0', 'insufficient', null],
      ['13.5 m', '7.3', '6.5', '75.0%', '36.9°', null],
    ];
    for (const [i, l] of j96Lessons.entries()) {
      const qs = [l.guided, ...l.questions.slice(1, 5), l.exit];
      for (const [j, a] of anchors[i]!.entries())
        expect(
          checkAnswer(a ?? 'Parent reasoning', qs[j]!.answer),
          qs[j]!.id,
        ).toBe(a === null ? null : true);
      expect(checkAnswer('1', l.questions[0]!.answer)).toBe(true);
    }
    for (const [i, a] of [
      '3/5',
      '3/4',
      '√3',
      '36.9',
      '13.5',
      null,
      '1',
      null,
    ].entries())
      expect(
        checkAnswer(a ?? 'Parent reasoning', j96CheckQuestions[i]!.answer),
      ).toBe(a === null ? null : true);
  });
  it('swaps opposite and adjacent legs with the reference while fixing the hypotenuse', () => {
    const a = trigTriangle('4', '3', 'A'),
      b = trigTriangle('4', '3', 'B');
    expect(a.roles).toEqual({
      opposite: 'BC',
      adjacent: 'AC',
      hypotenuse: 'AB',
    });
    expect(b.roles).toEqual({
      opposite: 'AC',
      adjacent: 'BC',
      hypotenuse: 'AB',
    });
    expect([a.ratio('sin'), a.ratio('cos'), a.ratio('tan')]).toEqual([
      '3/5',
      '4/5',
      '3/4',
    ]);
    expect([b.ratio('sin'), b.ratio('cos'), b.ratio('tan')]).toEqual([
      '4/5',
      '3/5',
      '4/3',
    ]);
  });
  it('checks 36 scaled right triangles and 108 exact ratios against independent squared legs', () => {
    let n = 0;
    for (const [i, c] of trigTriangles.entries())
      for (const ref of ['A', 'B'] as const)
        for (const k of [1, 2, 3]) {
          const m = trigTriangle(c.adjacent, c.opposite, ref, String(k)),
            [x, y] = legSquares[i]!,
            o = ref === 'A' ? y! : x!,
            a = ref === 'A' ? x! : y!,
            h = x! + y!;
          for (const f of ['sin', 'cos', 'tan'] as const) {
            const expected =
              f === 'sin'
                ? Math.sqrt(o / h)
                : f === 'cos'
                  ? Math.sqrt(a / h)
                  : Math.sqrt(o / a);
            expect(radicalNumber(m.ratio(f))).toBeCloseTo(expected, 12);
          }
          expect(Math.hypot(m.points.B.x, m.points.B.y)).toBeCloseTo(
            Math.sqrt(h) * k,
          );
          expect(m.points.C.x).toBeCloseTo(Math.sqrt(x!) * k);
          expect(m.points.B.y).toBeCloseTo(Math.sqrt(y!) * k);
          n++;
        }
    expect(n).toBe(36);
    expect(trigTriangle('1', '1').ratio('sin')).toBe('√2/2');
    expect(trigTriangle('√3', '1').ratio('sin')).toBe('1/2');
  });
  it('rejects zero, negative, unbounded or unsupported legs and scale factors', () => {
    for (const [a, b, k] of [
      ['0', '3', '1'],
      ['-1', '3', '1'],
      ['31', '1', '1'],
      ['hello', '1', '1'],
      ['4', '3', '0'],
      ['4', '3', '4'],
    ])
      expect(() => trigTriangle(a!, b!, 'A', k)).toThrow();
  });
  it('checks all 89 integer acute angles against independent convergent series and exact anchors', () => {
    for (let d = 1; d < 90; d++) {
      const m = trigValues(d),
        e = series(d);
      expect(m.sin).toBeCloseTo(e.sin, 12);
      expect(m.cos).toBeCloseTo(e.cos, 12);
      expect(m.tan).toBeCloseTo(e.tan, 10);
      expect(m.sin * m.sin + m.cos * m.cos).toBeCloseTo(1, 12);
      expect(m.acute).toBe(true);
    }
    expect(trigValues(30).sin).toBe(0.5);
    expect(trigValues(60).cos).toBe(0.5);
    expect(trigValues(45).tan).toBe(1);
    expect(trigValues(90).tan).toBeNull();
    expect(trigValues(0).acute).toBe(false);
    expect(trigValues(90).acute).toBe(false);
    for (const d of [-1, 91, NaN]) expect(() => trigValues(d)).toThrow();
  });
  it('maintains strict acute-domain bounds and monotonicity without bounding tangent by one', () => {
    for (let d = 1; d < 89; d++) {
      const a = trigValues(d),
        b = trigValues(d + 1);
      expect(b.sin).toBeGreaterThan(a.sin);
      expect(b.cos).toBeLessThan(a.cos);
      expect(b.tan!).toBeGreaterThan(a.tan!);
      expect(a.sin).toBeGreaterThan(0);
      expect(a.sin).toBeLessThan(1);
      expect(a.cos).toBeGreaterThan(0);
      expect(a.cos).toBeLessThan(1);
    }
    expect(trigValues(60).tan!).toBeGreaterThan(1);
    expect(trigValues(85).tan!).toBeGreaterThan(4);
  });
  it('checks 36 inverse-function cases against independent atan2 triangle angles and rejects invalid domains', () => {
    for (const [i, c] of trigTriangles.entries())
      for (const ref of ['A', 'B'] as const) {
        const m = trigTriangle(c.adjacent, c.opposite, ref),
          [x, y] = legSquares[i]!,
          expected =
            (Math.atan2(
              Math.sqrt(ref === 'A' ? y! : x!),
              Math.sqrt(ref === 'A' ? x! : y!),
            ) *
              180) /
            Math.PI;
        for (const f of ['sin', 'cos', 'tan'] as const) {
          const inverse = inverseTrig(f, m.ratio(f));
          expect(inverse.degrees).toBeCloseTo(expected, 10);
          expect((inverse.radians * 180) / Math.PI).toBeCloseTo(expected, 10);
        }
      }
    for (const [f, r] of [
      ['sin', '0'],
      ['sin', '1'],
      ['sin', '6/5'],
      ['cos', '-1/2'],
      ['cos', '1'],
      ['tan', '0'],
      ['tan', '-1'],
      ['tan', '101'],
      ['sin', '1/0'],
    ])
      expect(() => inverseTrig(f as TrigFunction, r!)).toThrow();
  });
  it('handles required precision, leading decimal points and units without accepting reciprocals or radians as degrees', () => {
    for (const [n, p, s] of [
      [36.86989765, 1, '36.9'],
      [53.13010235, 1, '53.1'],
      [45, 1, '45.0'],
      [0.5, 4, '0.5000'],
      [1.005, 2, '1.01'],
      [13.5, 0, '14'],
    ] as const)
      expect(roundTrig(n, p)).toBe(s);
    const a = {
      kind: 'trig-rounded' as const,
      value: '36.9',
      places: 1,
      unit: '°' as const,
    };
    expect(checkAnswer('36.9 degrees', a)).toBe(true);
    for (const s of ['36.90', '36.8699', '0.6°', '36.9 rad', '3/5', '1.7'])
      expect(checkAnswer(s, a)).toBe(false);
    expect(
      checkAnswer('.5000', {
        kind: 'trig-rounded',
        value: '0.5000',
        places: 4,
      }),
    ).toBe(true);
    expect(
      checkAnswer('0.5000°', {
        kind: 'trig-rounded',
        value: '0.5000',
        places: 4,
      }),
    ).toBe(false);
    expect(
      checkAnswer('75.0%', {
        kind: 'trig-rounded',
        value: '75.0',
        places: 1,
        unit: '%',
      }),
    ).toBe(true);
    expect(
      checkAnswer('0.75', {
        kind: 'trig-rounded',
        value: '75.0',
        places: 1,
        unit: '%',
      }),
    ).toBe(false);
    for (const [n, p] of [
      [NaN, 1],
      [-1, 1],
      [10001, 1],
      [1, 5],
    ])
      expect(() => roundTrig(n!, p!)).toThrow();
  });
  it('uses tangent for horizontal distance, sine for sight distance and adds instrument height', () => {
    expect(treeHeight(12, 45, 1.5).height).toBe(13.5);
    expect(treeHeight(10, 30, 1.5).height).toBeCloseTo(
      1.5 + 10 / Math.sqrt(3),
      12,
    );
    expect(treeHeight(10, 30, 1.5, 'sight').height).toBe(6.5);
    expect(treeHeight(10, 30, 1.5, 'sight').horizontal).toBeCloseTo(
      5 * Math.sqrt(3),
    );
    expect(treeHeight(12, 45, 0).height).toBe(12);
  });
  it('preserves observed treetop and angle with two possible bases but changes full height', () => {
    const a = treeHeight(12, 45, 1.5, 'horizontal', 0),
      b = treeHeight(12, 45, 1.5, 'horizontal', 2);
    expect(a.top).toBe(b.top);
    expect(a.horizontal).toBe(b.horizontal);
    expect([a.height, b.height]).toEqual([13.5, 11.5]);
    for (const [distance, degrees, eye] of [
      [0, 45, 1],
      [51, 45, 1],
      [10, 90, 1],
      [10, 0, 1],
      [10, 45, -1],
      [10, 45, 4],
    ])
      expect(() => treeHeight(distance!, degrees!, eye!)).toThrow();
    expect(() => treeHeight(1, 5, 0, 'horizontal', 3)).toThrow();
  });
  it('keeps percentage grade, angle and inclined length distinct, including grades above 100%', () => {
    const m = slopeModel('3', '4');
    expect(m.percent).toBe(75);
    expect(m.length).toBe(5);
    expect(m.degrees).toBeCloseTo(36.869897645844, 10);
    expect(m.text).toBe('3/4');
    expect(slopeModel('2', '1').percent).toBe(200);
    expect(slopeModel('3/2', '2').percent).toBe(75);
    expect(() => slopeModel('3', '0')).toThrow();
  });
  it('keeps equal-unit geometry under rotation reflection and zoom without relabelling', () => {
    const center = { x: 8 / 3, y: 1 };
    for (const rotation of [0, 90, 180, 270])
      for (const mirror of [false, true])
        for (const zoom of [0.8, 1]) {
          const a = trigScreen(
              { x: 0, y: 0 },
              center,
              20,
              rotation,
              mirror,
              zoom,
            ),
            c = trigScreen({ x: 4, y: 0 }, center, 20, rotation, mirror, zoom),
            b = trigScreen({ x: 4, y: 3 }, center, 20, rotation, mirror, zoom);
          expect(Math.hypot(a.x - c.x, a.y - c.y)).toBeCloseTo(80 * zoom);
          expect(Math.hypot(b.x - c.x, b.y - c.y)).toBeCloseTo(60 * zoom);
          expect(
            (a.x - c.x) * (b.x - c.x) + (a.y - c.y) * (b.y - c.y),
          ).toBeCloseTo(0);
        }
  });
  it('validates all 400 retrieval rounds using independent squared legs, power series and measurement formulas', () => {
    for (const [i, l] of j96Lessons.entries())
      for (let k = 0; k < 80; k++) {
        const q = j96ReviewQuestion(l.id, k);
        let expected: string;
        if (i === 0 || i === 1 || i === 3) {
          const [x, y] = legSquares[k % 6]!,
            refB = Math.floor(k / 6) % 2 === 1,
            o = refB ? x! : y!,
            a = refB ? y! : x!;
          if (i === 3)
            expected = (
              (Math.atan2(Math.sqrt(o), Math.sqrt(a)) * 180) /
              Math.PI
            ).toFixed(1);
          else {
            const tan = i === 1 && Math.floor(k / 12) % 2 === 1,
              num = i === 0 || tan ? o : a,
              den = tan ? a : x! + y!;
            expected = `√(${num}/${den})`;
          }
        } else if (i === 2) {
          const degrees = 5 + 5 * (k % 17),
            f = (['sin', 'cos', 'tan'] as const)[Math.floor(k / 17) % 3]!;
          expected = series(degrees)[f].toFixed(4);
        } else if (k % 3 === 0) {
          const rise = 1 + (k % 5),
            run = 2 + (Math.floor(k / 5) % 8),
            scaled = (BigInt(rise) * 2000n + BigInt(run)) / (2n * BigInt(run));
          expected = `${scaled / 10n}.${scaled % 10n}`;
        } else {
          const distance = 4 + (k % 12),
            degrees = k % 2 ? 30 : 45,
            eye = [1, 1.5, 2][Math.floor(k / 12) % 3]!,
            horizontal = k % 4 < 2,
            factor = horizontal
              ? degrees === 45
                ? 1
                : 1 / Math.sqrt(3)
              : degrees === 30
                ? 0.5
                : Math.sqrt(2) / 2;
          expected = (distance * factor + eye).toFixed(1);
        }
        expect(checkAnswer(expected, q.answer), q.id).toBe(true);
        for (const wrong of q.answerChecks!.rejected)
          expect(checkAnswer(wrong, q.answer), q.id).toBe(false);
        expect(q.id).toBe(`${l.id}-R${k}`);
      }
    for (const [id, k] of [
      ['J96-L00', 0],
      ['J96-L01', -1],
      ['J96-L01', 0.5],
      ['J96-L01', 100001],
    ] as const)
      expect(() => j96ReviewQuestion(id, k)).toThrow();
  });
});
