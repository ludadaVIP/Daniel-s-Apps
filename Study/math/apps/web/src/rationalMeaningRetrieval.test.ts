import { describe, it, expect } from 'vitest';
import { rationalMeaningRetrieval } from './content/rationalMeaningRetrieval';
import { coreAlgebraRecurrence } from './content/coreAlgebraRecurrence';
import { maintenanceSets } from './content/maintenance';
import { lessons, curriculum } from './content';
import { checkAnswer } from './model';
import {
  rationalOperation as op,
  rationalPair,
  rationalLine,
  readRational,
  expressionTrace,
  B,
  N,
  type RationalExpr,
} from './rationalModels';
const sets = Object.values(rationalMeaningRetrieval);
const value = (i: number, q: number, r: number) =>
  sets[i]!.questions[q - 1]!.contextTable!.rows[r]![2]!.en;
describe('J71 rational units, boundary cases and full structures', () => {
  it('keeps all twelve old references, sharing four new tasks per unit across six lessons', () => {
    const e = coreAlgebraRecurrence.filter((e) =>
      e.sourceLesson.startsWith('J71-'),
    );
    expect(e.flatMap((e) => e.targets)).toHaveLength(24);
    expect(new Set(e.flatMap((e) => e.targets)).size).toBe(20);
    expect(
      e.flatMap((e) => e.targets.filter((t) => t.includes('CORE-ALGEBRA'))),
    ).toHaveLength(12);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const [i, entry] of e.entries())
      for (const s of sets) {
        const q = s.questions[[0, 0, 1, 1, 2, 3][i]!]!;
        expect(entry.targets).toContain(q.id);
        expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('J71'));
        expect(Object.values(maintenanceSets).find((m) => m.id === s.id)).toBe(
          s,
        );
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
      }
    for (const s of sets)
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual([
        'J71-L01',
        'J71-L03',
        'J71-L05',
        'J71-L06',
      ]);
    expect(
      coreAlgebraRecurrence
        .filter((e) => !e.sourceLesson.startsWith('J71-'))
        .every((e) => e.targets.every((t) => !t.includes('RATIONAL-MEANING'))),
    ).toBe(true);
    expect(lessons).toHaveLength(358);
  });
  it('normalises signed denominators and distinguishes finite truncations from explicitly repeating values', () => {
    expect(readRational('3/-2')).toEqual([-3n, 2n]);
    expect(readRational('-3/-2')).toEqual([3n, 2n]);
    expect(readRational('5/-4')).toEqual([-5n, 4n]);
    expect(readRational('-5/-4')).toEqual([5n, 4n]);
    expect(readRational('-0')).toEqual([0n, 1n]);
    expect(() => readRational('0/0')).toThrow(RangeError);
    for (const [i, finite, repeat, difference] of [
      [0, '-0.333', '-1/3', '1/3000'],
      [1, '-0.666', '-2/3', '1/1500'],
    ] as const) {
      expect(value(i, 1, 2)).toBe(finite);
      expect(value(i, 1, 3)).toBe(finite + '…');
      expect(op(finite, repeat, '−').result).toBe(difference);
      expect(sets[i]!.questions[0]!.solution.en).toContain(difference);
      expect(() => readRational(value(i, 1, 3))).toThrow(RangeError);
    }
    expect(rationalPair('-2.05', '-2.5').relation).toBe('>');
    expect(rationalPair('-3.04', '-3.4').relation).toBe('>');
  });
  it('reconstructs zero, coincident, reflected and reversed endpoints on one unit scale', () => {
    for (const [i, x, y, delta, absolute, cross, reciprocal] of [
      [0, '-5/4', '-1/2', '3/4', '5/4', '7/4', '-4/5'],
      [1, '-7/4', '-3/4', '1', '7/4', '5/2', '-4/7'],
    ] as const) {
      expect(value(i, 1, 0)).toBe(x);
      expect(value(i, 1, 1)).toBe(y);
      expect(rationalPair(x, y)).toMatchObject({
        delta,
        distance: delta,
        absolute,
      });
      expect(rationalPair(y, x).distance).toBe(delta);
      expect(
        op(rationalPair(x, y).delta, rationalPair(y, x).delta, '+').result,
      ).toBe('0');
      expect(rationalPair(x, x)).toMatchObject({
        delta: '0',
        distance: '0',
        coincident: true,
      });
      expect(rationalPair(x, '0').distance).toBe(absolute);
      expect(rationalPair(x, rationalPair(y, '0').opposite).distance).toBe(
        cross,
      );
      expect(op(x, reciprocal, '×').result).toBe('1');
      expect(op(x, absolute, '+').result).toBe('0');
      const line = rationalLine([
        { value: x, label: 'X' },
        { value: y, label: 'Y' },
        { value: '0', label: 'O' },
        { value: absolute, label: '-X' },
      ]);
      expect(line.unit).toBe(96);
      expect(line.grid).toBe(4);
      expect(line.x(1) - line.x(0)).toBe(96);
      expect(
        rationalLine([
          { value: x, label: 'X' },
          { value: x, label: 'Y' },
        ]).points[0]!.labels,
      ).toEqual(['X', 'Y']);
    }
  });
  it('checks all signed sum/difference branches, inverse checks and valid versus changed association', () => {
    for (const [i, a, b, sum, diff, double, cross, wrong] of [
      [0, '-5/6', '1/4', '-7/12', '-13/12', '-5/3', '7/6', '-23/12'],
      [1, '-7/8', '1/3', '-13/24', '-29/24', '-7/4', '9/8', '-25/12'],
    ] as const) {
      expect(value(i, 2, 0)).toBe(a);
      expect(value(i, 2, 1)).toBe(b);
      const negativeB = op('0', b, '−').result!,
        negativeA = op('0', a, '−').result!;
      expect(op(a, b, '+').result).toBe(sum);
      expect(op(a, negativeB, '−').result).toBe(sum);
      expect(op(a, b, '−').result).toBe(diff);
      expect(op(a, negativeB, '+').result).toBe(diff);
      expect(op(diff, b, '+').result).toBe(a);
      expect(op(sum, negativeB, '+').result).toBe(a);
      expect(op(a, a, '+').result).toBe(double);
      expect(op(a, negativeA, '+').result).toBe('0');
      expect(op(a, '0', '+').result).toBe(a);
      expect(op(a, '0', '−').result).toBe(a);
      expect(op(a, '-2', '−').result).toBe(cross);
      expect(op(op(a, b, '+').result!, negativeA, '+').result).toBe(b);
      expect(op(op(a, negativeA, '+').result!, b, '+').result).toBe(b);
      expect(op(diff, a, '−').result).toBe(negativeB);
      expect(op(a, op(b, a, '−').result!, '−').result).toBe(wrong);
      expect(sets[i]!.questions[1]!.solution.en.replaceAll('−', '-')).toContain(
        wrong,
      );
    }
    expect(op('-.7', '1.2', '+').result).toBe('1/2');
    expect(op('-.9', '1.4', '+').result).toBe('1/2');
  });
  it('regenerates seven factor maps, magnitude/order distinctions and three-negative products', () => {
    for (const [i, x, products, half, twice, cube] of [
      [
        0,
        '-5/4',
        ['-5/8', '5/8', '-5/2', '5/2', '0', '-5/4', '5/4'],
        '-5/8',
        '5/2',
        '-125/64',
      ],
      [
        1,
        '-7/6',
        ['-7/12', '7/12', '-7/3', '7/3', '0', '-7/6', '7/6'],
        '-7/12',
        '7/3',
        '-343/216',
      ],
    ] as const) {
      expect(value(i, 3, 0)).toBe(x);
      expect(
        ['1/2', '-1/2', '2', '-2', '0', '1', '-1'].map(
          (f) => op(x, f, '×').result,
        ),
      ).toEqual(products);
      expect(op(x, '2', '÷').result).toBe(half);
      expect(op(x, '-1/2', '÷').result).toBe(twice);
      expect(op(half, '2', '×').result).toBe(x);
      expect(op(twice, '-1/2', '×').result).toBe(x);
      expect(rationalPair(x, half).relation).toBe('<');
      expect(
        Number(readRational(half)[0]) / Number(readRational(half)[1]),
      ).toBeGreaterThan(
        Number(readRational(x)[0]) / Number(readRational(x)[1]),
      );
      expect(op(op(x, x, '×').result!, x, '×').result).toBe(cube);
      expect(
        op(op(x, '1', '×').result!, op(x, '-1', '×').result!, '+').result,
      ).toBe('0');
      expect(sets[i]!.questions[2]!.solution.en).toContain(
        cube.replace('-', '−'),
      );
    }
  });
  it('preserves complete fractional/nested traces, base scopes, subtraction order and zero-factor domains', () => {
    for (const [
      i,
      a,
      b,
      factor,
      result,
      outer,
      innerA,
      innerB,
      nested,
      base,
      square,
      cube,
      left,
      right,
    ] of [
      [
        0,
        '-5/6',
        '1/4',
        '-3/2',
        '7/8',
        '1/3',
        '-5/6',
        '-1/2',
        '2/3',
        '-3/2',
        '9/4',
        '-27/8',
        '-1/3',
        '0',
      ],
      [
        1,
        '-7/8',
        '1/3',
        '-6/5',
        '13/20',
        '1/4',
        '-7/8',
        '-3/8',
        '3/4',
        '-5/3',
        '25/9',
        '-125/27',
        '-3/8',
        '-1/8',
      ],
    ] as const) {
      const tree = B('×', B('+', N(a), N(b)), N(factor)),
        trace = expressionTrace(tree);
      expect(value(i, 4, 0).replaceAll('−', '-')).toBe(
        i === 0 ? '(-5/6+1/4)×(-3/2)' : '(-7/8+1/3)×(-6/5)',
      );
      expect(trace.result).toBe(result);
      expect(trace.rows[0]!.after).toContain(factor);
      expect(trace.rows[0]!.after).not.toBe(trace.result);
      expect(
        op(op(a, factor, '×').result!, op(b, factor, '×').result!, '+').result,
      ).toBe(result);
      expect(
        expressionTrace(B('−', N(outer), B('−', N(innerA), N(innerB)))).result,
      ).toBe(nested);
      const sq: RationalExpr = { kind: 'power', base: N(base), exponent: 2 };
      expect(expressionTrace(sq).result).toBe(square);
      expect(
        expressionTrace({
          kind: 'neg',
          value: { ...sq, base: N(base.slice(1)) },
        }).result,
      ).toBe('-' + square);
      expect(expressionTrace({ ...sq, exponent: 3 }).result).toBe(cube);
      const third = i === 0 ? '1/6' : '1/8';
      expect(
        expressionTrace(B('−', B('−', N(outer), N('1/2')), N(third))).result,
      ).toBe(left);
      expect(
        expressionTrace(B('−', N(outer), B('−', N('1/2'), N(third)))).result,
      ).toBe(right);
      const zeroDiv = B(
          '×',
          N('0'),
          B('÷', N('1'), B('−', N(String(i + 2)), N(String(i + 2)))),
        ),
        bad = expressionTrace(zeroDiv);
      expect(bad.result).toBeNull();
      expect(bad.rows.at(-1)!.undefined).toBe(true);
      expect(op('0', '-2/3', '÷').result).toBe('0');
    }
  });
});
