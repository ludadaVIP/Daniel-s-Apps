import { describe, it, expect } from 'vitest';
import { functionMeaningRetrieval } from './content/functionMeaningRetrieval';
import { cartesianMeaningRetrieval } from './content/cartesianMeaningRetrieval';
import { inequalityFunctionRecurrence } from './content/inequalityFunctionRecurrence';
import { maintenanceSets } from './content/maintenance';
import { lessons } from './content';
import { checkAnswer } from './model';
import { readRational as R } from './rationalModels';
import {
  addR,
  negR,
  mulR,
  divR,
  textR,
  sameR,
  type Rational,
} from './algebraModels';
import { readCoordinate } from './cartesianModels';
import {
  functionModel,
  functionAt,
  functionFromPoints,
  slopeBetween,
  classifyAffine,
  pointOnFunction,
  auditFunctionContext,
} from './functionModels';
import {
  relationHolds,
  intervalContains,
  parseRealSet,
} from './inequalityModels';

const sets = Object.values(functionMeaningRetrieval);
const row = (i: number, n: number, id: string) =>
  sets[i]!.questions[n - 1]!.contextTable!.rows.find(
    (r) => r[0]!.en === id,
  )![2]!.en;
const sub = (a: Rational, b: Rational) => addR(a, negR(b));
const pair = (x: Rational, y: Rational) => [x, y] as const;
const params = (i: number) => {
  const m = row(i, 1, 'F').match(/^m=([^;]+); b=([^;]+);/)!;
  return functionModel(m[1]!, m[2]!);
};
const continuousCases = (i: number) =>
  [
    i === 0 ? ['1/3', '2/3'] : ['2/3', '4/3'],
    i === 0 ? ['1', '2'] : ['2', '3'],
  ] as const;

describe('J85 parameter changes, real unit conversions and reused strong models', () => {
  it('keeps twelve original references/ten tasks, reuses four existing cards and adds just four new cards', () => {
    const entries = inequalityFunctionRecurrence.filter((e) =>
      e.sourceLesson.startsWith('J85-'),
    );
    const refs = entries.flatMap((e) => e.targets);
    expect(refs).toHaveLength(26);
    expect(new Set(refs).size).toBe(18);
    expect(refs.filter((id) => id.includes('-MAINT-ORDER-RULE-'))).toHaveLength(
      12,
    );
    expect(
      refs.filter((id) => id.includes('-MAINT-FUNCTION-MEANING-')),
    ).toHaveLength(8);
    expect(entries[4]!.targets).toEqual([
      'H01-MAINT-ORDER-RULE-Q9',
      'H02-MAINT-ORDER-RULE-Q9',
    ]);
    for (const s of sets) {
      expect(Object.values(maintenanceSets).find((m) => m.id === s.id)).toBe(s);
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual([
        'J85-L03',
        'J85-L06',
      ]);
      for (const q of s.questions) {
        expect(q.answer.kind === 'explain' && q.answer.rubric).toEqual(
          q.solution,
        );
        expect(q.solutionSteps).toEqual([q.solution]);
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
      }
    }
    expect(lessons).toHaveLength(358);
  });
  it('computes the supplied parameter rules and distinguishes complete rules from one output', () => {
    expect(
      [0, 3, 6].map((x) => textR(functionAt(params(0), String(x)))),
    ).toEqual(['6', '9/2', '3']);
    expect(
      [0, 3, 6].map((x) => textR(functionAt(params(1), String(x)))),
    ).toEqual(['-6', '-8', '-10']);
    for (const i of [0, 1]) {
      const f = params(i);
      expect(
        checkAnswer(textR(functionAt(f, '3')), {
          kind: 'expression',
          value: i === 0 ? '-x/2+6' : '-2x/3-6',
          variable: 'x',
        }),
      ).toBe(false);
      expect(
        checkAnswer(i === 0 ? '6-x/2' : '-6-(2/3)x', {
          kind: 'expression',
          value: i === 0 ? '-x/2+6' : '-2x/3-6',
          variable: 'x',
        }),
      ).toBe(true);
    }
  });
  it('proves the general parameter differences by exact coefficients, then checks displayed examples', () => {
    for (const [i, g3, h3] of [
      [0, '13/2', '15/2'],
      [1, '-6', '-5'],
    ] as const) {
      const f = params(i),
        g = { a: f.a, b: addR(f.b, R('2')) },
        h = { a: addR(f.a, R('1')), b: f.b },
        k = { a: R('0'), b: f.b };
      // Coefficient subtraction proves identities for ALL real inputs, not finite samples.
      expect([sub(g.a, f.a), sub(g.b, f.b)].map(textR)).toEqual(['0', '2']);
      expect([sub(h.a, f.a), sub(h.b, f.b)].map(textR)).toEqual(['1', '0']);
      expect(textR(functionAt(g, '3'))).toBe(g3);
      expect(textR(functionAt(h, '3'))).toBe(h3);
      expect(sameR(functionAt(h, '0'), functionAt(f, '0'))).toBe(true);
      expect(classifyAffine(k)).toBe('constant');
      expect(classifyAffine(f)).toBe('affine');
      expect(textR(functionAt(k, '100'))).toBe(textR(f.b));
    }
  });
  it('separates intercept values and points and checks both off-window coordinates against the original rule', () => {
    for (const [i, xIntercept, b] of [
      [0, '12', '6'],
      [1, '-9', '-6'],
    ] as const) {
      const f = params(i),
        x = divR(negR(f.b), f.a);
      expect(textR(x)).toBe(xIntercept);
      expect(textR(f.b)).toBe(b);
      expect(pointOnFunction(f, pair(R('0'), f.b))).toBe(true);
      expect(pointOnFunction(f, pair(x, R('0')))).toBe(true);
      for (const c of [x, f.b]) {
        expect(
          relationHolds(c, '<', R('-5')) || relationHolds(c, '>', R('5')),
        ).toBe(true);
        expect(
          relationHolds(c, '>=', R('-16')) && relationHolds(c, '<=', R('16')),
        ).toBe(true);
      }
      expect(row(i, 1, 'W')).toBe('[−5,5]² → [−16,16]²');
    }
  });
  it('reuses the actual J93/J94 fractional two-point task rather than rewriting an equivalent one', () => {
    for (const s of Object.values(cartesianMeaningRetrieval)) {
      const q = s.questions[1]!,
        source = q.contextTable!.rows.find((r) => r[0]!.en === 'A')![2]!.en;
      const points = [...source.matchAll(/\([^()]+,[^()]+\)/g)].map((m) =>
        readCoordinate(m[0])!,
      );
      const result = functionFromPoints(points[0]!, points[1]!);
      expect(result.kind).toBe('one');
      if (result.kind !== 'one') throw Error('Expected affine pair');
      expect(textR(result.model.a)).toBe('-1/2');
      expect(points.every((p) => pointOnFunction(result.model, p))).toBe(true);
      expect(textR(slopeBetween(points[1]!, points[0]!).slope!)).toBe('-1/2');
      for (const sourceLesson of ['J85-L02', 'J85-L04'])
        expect(
          inequalityFunctionRecurrence.find(
            (e) => e.sourceLesson === sourceLesson,
          )!.targets,
        ).toContain(q.id);
      expect(s.bridgeByQuestion[q.id]).toBe('J75-L04');
    }
  });
  it('recovers every permitted continuous design from two nonzero inputs and checks the independent zero row', () => {
    for (const i of [0, 1]) {
      const [prices, fees] = continuousCases(i);
      for (const p of prices)
        for (const f of fees)
          for (const T of [3, 6]) {
            const model = functionModel(p, f),
              mid = R(String(T / 2));
            const P = pair(mid, functionAt(model, textR(mid))),
              Q = pair(R(String(T)), functionAt(model, String(T)));
            const result = functionFromPoints(P, Q);
            expect(result.kind).toBe('one');
            if (result.kind !== 'one') throw Error('Expected design');
            expect([result.model.a, result.model.b].map(textR)).toEqual([p, f]);
            expect(textR(functionAt(result.model, '0'))).toBe(f);
            const triangle = slopeBetween(P, Q);
            expect(textR(triangle.dx)).toBe(textR(mid));
            expect(sameR(triangle.dy, mulR(R(p), mid))).toBe(true);
            expect(sameR(triangle.slope!, R(p))).toBe(true);
          }
      expect(row(i, 2, 'C')).toContain(`p∈{${prices.join(',')}}`);
    }
  });
  it('converts input hours and output NZ cents while preserving the same physical midpoint and domain', () => {
    for (const i of [0, 1]) {
      const [prices, fees] = continuousCases(i);
      for (const p of prices)
        for (const f of fees)
          for (const T of [3, 6]) {
            const minutes = functionModel(p, f),
              hours = { a: mulR(R('60'), minutes.a), b: minutes.b },
              cents = {
                a: mulR(R('6000'), minutes.a),
                b: mulR(R('100'), minutes.b),
              };
            const s = divR(R(String(T)), R('120')),
              mid = String(T / 2);
            expect(
              sameR(functionAt(minutes, mid), functionAt(hours, textR(s))),
            ).toBe(true);
            expect(
              sameR(
                mulR(R('100'), functionAt(minutes, mid)),
                functionAt(cents, textR(s)),
              ),
            ).toBe(true);
            const domain = parseRealSet(
              `0<=x<=${textR(divR(R(String(T)), R('60')))}`,
            )!;
            expect(intervalContains(domain, s)).toBe(true);
            expect(
              intervalContains(domain, divR(R(String(T + 1)), R('60'))),
            ).toBe(false);
            const wrong = functionAt(minutes, textR(s)),
              right = functionAt(minutes, mid);
            expect(sameR(wrong, right)).toBe(false);
            expect(
              sameR(
                sub(right, wrong),
                divR(mulR(R('59'), mulR(R(p), R(String(T)))), R('120')),
              ),
            ).toBe(true);
          }
    }
    expect(textR(functionAt(functionModel('1/3', '1'), '1/20'))).toBe('61/60');
    expect(textR(functionAt(functionModel('2/3', '2'), '1/40'))).toBe('121/60');
  });
  it('distinguishes a cell-count quotient from the rate in labelled original units', () => {
    for (const [i, xCell, yCell] of [
      [0, '2', '1/2'],
      [1, '1/2', '2'],
    ] as const) {
      const [prices] = continuousCases(i);
      for (const p of prices) {
        const dx = R('3'),
          dy = mulR(R(p), dx),
          gridQuotient = divR(divR(dy, R(yCell)), divR(dx, R(xCell)));
        expect(sameR(divR(dy, dx), R(p))).toBe(true);
        expect(sameR(gridQuotient, R(p))).toBe(false);
      }
      expect(row(i, 2, 'D')).toContain('cell');
    }
  });
  it('recovers all permitted whole-pack designs, preserving finite discrete inputs even when half-pack output is integral', () => {
    for (const i of [0, 1]) {
      const qs = i === 0 ? [2, 3] : [3, 4],
        cs = i === 0 ? [1, 2] : [2, 3];
      for (const q of qs)
        for (const c of cs)
          for (const N of [3, 4]) {
            const result = functionFromPoints(
              pair(R('1'), R(String(q + c))),
              pair(R(String(N)), R(String(q * N + c))),
            );
            expect(result.kind).toBe('one');
            if (result.kind !== 'one') throw Error('Expected count design');
            expect([result.model.a, result.model.b].map(textR)).toEqual([
              String(q),
              String(c),
            ]);
            const points = Array.from({ length: N + 1 }, (_, n) => [
              n,
              q * n + c,
            ]);
            expect(points).toHaveLength(N + 1);
            expect(textR(functionAt(result.model, '1/2'))).toBe(
              textR(addR(R(String(c)), divR(R(String(q)), R('2')))),
            );
            expect(R('1/2')[1]).not.toBe(1n);
            const context = {
              kind: 'cards' as const,
              model: result.model,
              end: R(String(N)),
              integer: true,
              inputUnit: 'packs',
              outputUnit: 'cards',
              rateUnit: 'cards/pack',
            };
            expect(
              auditFunctionContext(
                context,
                '1/2',
                textR(functionAt(result.model, '1/2')),
              ),
            ).toMatchObject({
              relationPass: true,
              inRange: true,
              integerPass: false,
              accepted: false,
            });
            expect(
              auditFunctionContext(
                context,
                String(N + 1),
                String(q * (N + 1) + c),
              ),
            ).toMatchObject({
              relationPass: true,
              inRange: false,
              integerPass: true,
              accepted: false,
            });
            for (const [n, A] of points)
              expect(
                auditFunctionContext(context, String(n), String(A))!.accepted,
              ).toBe(true);
          }
    }
    expect(textR(functionAt(functionModel('2', '1'), '1/2'))).toBe('2');
    expect(textR(functionAt(functionModel('4', '2'), '1/2'))).toBe('4');
  });
  it('reuses existing self-created emptying models with their original bridges and manual rubric', () => {
    for (const s of Object.values(cartesianMeaningRetrieval)) {
      const q = s.questions[2]!;
      expect(q.stem.en).toContain(
        'invent a finite-time constant-draining rule',
      );
      expect(q.solution.en).toContain('0≤t≤a/r');
      expect(
        inequalityFunctionRecurrence.find((e) => e.sourceLesson === 'J85-L06')!
          .targets,
      ).toContain(q.id);
      expect(q.answer.kind === 'explain' && q.answer.rubric).toEqual(
        q.solution,
      );
      expect(s.bridgeByQuestion[q.id]).toBe('J75-L03');
    }
  });
});
