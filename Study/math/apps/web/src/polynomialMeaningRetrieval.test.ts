import { describe, it, expect } from 'vitest';
import { polynomialMeaningRetrieval } from './content/polynomialMeaningRetrieval';
import { coreAlgebraRecurrence } from './content/coreAlgebraRecurrence';
import { maintenanceSets } from './content/maintenance';
import { lessons, lessonById, curriculum } from './content';
import { checkAnswer } from './model';
import {
  parsePolynomial,
  polynomialValue,
  substitutionText,
  equalPolynomial,
  isCollectedPolynomial,
  plusP,
  scaleP,
} from './polynomialModels';
const sets = Object.values(polynomialMeaningRetrieval);
const rows = (i: number, q: number) =>
  sets[i]!.questions[q - 1]!.contextTable!.rows;
const raw = (i: number, q: number, r: number) => rows(i, q)[r]![2]!.en;
describe('J72 original terms, general expressions and contextual domains', () => {
  it('preserves fifteen original references and shares collection/difference cards without duplicate task counts', () => {
    const e = coreAlgebraRecurrence.filter((e) =>
      e.sourceLesson.startsWith('J72-'),
    );
    expect(e.flatMap((e) => e.targets)).toHaveLength(25);
    expect(new Set(e.flatMap((e) => e.targets)).size).toBe(18);
    expect(
      e.flatMap((e) =>
        e.targets.filter((t) => !t.includes('POLYNOMIAL-MEANING')),
      ),
    ).toHaveLength(15);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const [i, entry] of e.entries())
      for (const s of sets) {
        const q = s.questions[[0, 1, 2, 1, 3][i]!]!;
        expect(entry.targets).toContain(q.id);
        expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('J72'));
        expect(Object.values(maintenanceSets).find((m) => m.id === s.id)).toBe(
          s,
        );
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
      }
    for (const s of sets)
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual([
        'J72-L01',
        'J72-L02',
        'J72-L03',
        'J72-L05',
      ]);
    expect(
      coreAlgebraRecurrence
        .filter((e) => !e.sourceLesson.startsWith('J72-'))
        .every((e) =>
          e.targets.every((t) => !t.includes('POLYNOMIAL-MEANING')),
        ),
    ).toBe(true);
    expect(lessons).toHaveLength(358);
  });
  it('consistently substitutes two independent rational values and recomputes only changed assignments', () => {
    for (const [i, P, x, y, result, newY, newValue, square, minusSquare] of [
      [0, 'x²+2xy−y', '-3/2', '1/3', '11/12', '2/3', '-5/12', '9/4', '-9/4'],
      [1, '2x²−xy+y', '-2/3', '-3/4', '-13/36', '3/4', '77/36', '4/9', '-4/9'],
    ] as const) {
      expect([raw(i, 1, 0), raw(i, 1, 1), raw(i, 1, 2)]).toEqual([P, x, y]);
      expect(polynomialValue(P, ['x', 'y'], { x, y })).toBe(result);
      expect(polynomialValue(P, ['x', 'y'], { x, y: newY })).toBe(newValue);
      expect(
        substitutionText(P, ['x', 'y'], { x, y }).match(
          new RegExp('\\(' + x.replace('/', '\\/') + '\\)', 'g'),
        ),
      ).toHaveLength(2);
      expect(polynomialValue('x^2', ['x'], { x })).toBe(square);
      expect(polynomialValue('-x^2', ['x'], { x })).toBe(minusSquare);
      expect(polynomialValue(P, ['x', 'y'], { x })).toBeNull();
      expect(sets[i]!.questions[0]!.solution.en.replaceAll('−', '-')).toContain(
        result,
      );
      expect(sets[i]!.questions[0]!.solution.en.replaceAll('−', '-')).toContain(
        newValue,
      );
    }
    for (const [a, b] of [
      ['x^2+x', '2x'],
      ['x^2-x', '0'],
    ]) {
      for (const x of ['0', '1'])
        expect(polynomialValue(a!, ['x'], { x })).toBe(
          polynomialValue(b!, ['x'], { x }),
        );
      expect(polynomialValue(a!, ['x'], { x: '2' })).not.toBe(
        polynomialValue(b!, ['x'], { x: '2' }),
      );
      expect(equalPolynomial(a!, b!)).toBe(false);
    }
    expect(equalPolynomial('x(x+1)', 'x^2+x')).toBe(true);
  });
  it('collects all nine original IDs by every exponent, preserving fractional coefficients and cancellation', () => {
    for (const [i, expected, coefficients] of [
      [0, '3xy+(5/6)x-2', { xy: [3n, 1n], x: [5n, 6n], '': [-2n, 1n] }],
      [
        1,
        '3x^2+4xy-(1/4)x+3',
        { xx: [3n, 1n], xy: [4n, 1n], x: [-1n, 4n], '': [3n, 1n] },
      ],
    ] as const) {
      const original = rows(i, 2).slice(0, 9);
      expect(original.map((r) => r[0]!.en)).toEqual(
        Array.from({ length: 9 }, (_, i) => 'T' + (i + 1)),
      );
      const sum = original.map((r) => '(' + r[2]!.en + ')').join('+');
      expect(equalPolynomial(sum, expected, ['x', 'y'])).toBe(true);
      const p = parsePolynomial(sum, ['x', 'y'])!;
      expect(Object.fromEntries(p)).toEqual(coefficients);
      expect(p.has('yy')).toBe(false);
      expect(isCollectedPolynomial(sum, ['x', 'y'])).toBe(false);
      expect(isCollectedPolynomial(expected, ['x', 'y'])).toBe(true);
      expect(equalPolynomial('xy', 'yx', ['x', 'y'])).toBe(true);
      expect(equalPolynomial('x^2', 'y^2', ['x', 'y'])).toBe(false);
      expect(equalPolynomial('x^2y', 'xy^2', ['x', 'y'])).toBe(false);
      expect(parsePolynomial('(1/2)x', ['x'])).not.toBeNull();
      expect(parsePolynomial('1/x', ['x'])).toBeNull();
    }
    expect(isCollectedPolynomial('0x')).toBe(false);
    expect(isCollectedPolynomial('0')).toBe(true);
  });
  it('retains all terms and outer sign scopes for fractional multivariable sums, differences and nested objects', () => {
    for (const [i, sum, difference, nested] of [
      [0, '(5/6)x^2+xy+1', '(1/6)x^2+3xy-7', '-(5/6)x^2+3xy-4'],
      [1, '(5/4)x^2+xy-3', '(1/4)x^2-3xy+7', '(9/4)x^2-3xy+6'],
    ] as const) {
      const a = raw(i, 2, 9),
        b = raw(i, 2, 10),
        c = raw(i, 2, 11),
        variables = ['x', 'y'];
      expect(
        rows(i, 2)
          .slice(9)
          .map((r) => r[0]!.en),
      ).toEqual(['A', 'B', 'C']);
      expect(equalPolynomial(`(${a})+(${b})`, sum, variables)).toBe(true);
      expect(equalPolynomial(`(${a})-(${b})`, difference, variables)).toBe(
        true,
      );
      expect(equalPolynomial(`(${a})-((${b})-(${c}))`, nested, variables)).toBe(
        true,
      );
      expect(equalPolynomial(`(${a})-(${b})-(${c})`, nested, variables)).toBe(
        false,
      );
      expect(equalPolynomial(`(${difference})+(${b})`, a, variables)).toBe(
        true,
      );
      expect(
        plusP(
          parsePolynomial(difference, variables)!,
          parsePolynomial(b, variables)!,
        ),
      ).toEqual(parsePolynomial(a, variables));
      expect(
        plusP(
          parsePolynomial(a, variables)!,
          scaleP(parsePolynomial(a, variables)!, [-1n, 1n]),
        ).size,
      ).toBe(0);
      expect(isCollectedPolynomial(difference, variables)).toBe(true);
    }
  });
  it('distributes signed fractions to constants and every variable term, then checks zero/unit/opposite factors', () => {
    for (const [
      i,
      expanded,
      total,
      opposite,
      negativeOne,
      wrong,
      valueAtZero,
    ] of [
      [
        0,
        '-3x^2+2xy-1',
        '-x^2+1',
        '3x^2-2xy+1',
        '-6x^2+4xy-2',
        '-3x^2+2xy+2',
        '-1',
      ],
      [
        1,
        '-2x^2-4xy+6',
        'x^2-xy+3',
        '2x^2+4xy-6',
        '-3x^2-6xy+9',
        '-2x^2-4xy-9',
        '6',
      ],
    ] as const) {
      const k = raw(i, 3, 0),
        inside = raw(i, 3, 1),
        h = raw(i, 3, 2),
        vars = ['x', 'y'],
        G = `(${k})(${inside})`;
      expect(equalPolynomial(G, expanded, vars)).toBe(true);
      expect(equalPolynomial(`${G}+(${h})`, total, vars)).toBe(true);
      expect(equalPolynomial(`0(${inside})`, '0', vars)).toBe(true);
      expect(equalPolynomial(`1(${inside})`, inside, vars)).toBe(true);
      expect(equalPolynomial(`-1(${inside})`, negativeOne, vars)).toBe(true);
      expect(equalPolynomial(`-(${G})`, opposite, vars)).toBe(true);
      expect(polynomialValue(G, vars, { x: '0', y: '0' })).toBe(valueAtZero);
      expect(polynomialValue(wrong, vars, { x: '0', y: '0' })).not.toBe(
        valueAtZero,
      );
      expect(isCollectedPolynomial(G, vars)).toBe(false);
      expect(isCollectedPolynomial(expanded, vars)).toBe(true);
      expect(sets[i]!.questions[2]!.solution.en.replaceAll('−', '-')).toContain(
        total.replaceAll('^2', '²'),
      );
    }
  });
  it('separates fixed/per-item scopes and positive fractional lengths from integer counts', () => {
    for (const [
      i,
      fare,
      fee,
      price,
      coupon,
      bags,
      extra,
      offset,
      n,
      perimeter,
      area,
    ] of [
      [0, 3, 5, 6, 4, 4, 3, 3, '1/2', '8', '7/4'],
      [1, 4, 7, 7, 3, 5, 2, 4, '3/2', '14', '33/4'],
    ] as const) {
      expect(raw(i, 4, 0)).toContain(`NZ$${fare} per person`);
      expect(raw(i, 4, 1)).toContain(`ONE NZ$${coupon}`);
      expect(raw(i, 4, 2)).toContain(`${bags} bags`);
      expect(raw(i, 4, 3)).toContain(`length n+${offset}`);
      for (const language of ['zh', 'en'] as const) {
        const peoplePart = sets[i]!.questions[3]!.stem[language].split('②')[0]!;
        const checkValues = [
          ...peoplePart.matchAll(/n=([+-]?\d+(?:[./]\d+)?)/g),
        ].map((m) => m[1]);
        expect(checkValues).toEqual(['2', '3']);
        expect(
          checkValues.every(
            (n) => Number.isSafeInteger(Number(n)) && Number(n) > 0,
          ),
        ).toBe(true);
      }
      expect(sets[i]!.questions[3]!.solution.en).toContain(
        `perimeter=${perimeter} cm`,
      );
      const cost = `${fare}n+${fee}`;
      expect(polynomialValue(cost, ['n'], { n: '2' })).toBe(
        String(fare * 2 + fee),
      );
      expect(equalPolynomial(cost, String(fee), ['n'])).toBe(false);
      expect(equalPolynomial(`0n+${fee}`, String(fee), ['n'])).toBe(true);
      const order = `${price}n-${coupon}`,
        perItem = `${price - coupon}n`;
      expect(polynomialValue(order, ['n'], { n: '1' })).toBe(
        polynomialValue(perItem, ['n'], { n: '1' }),
      );
      expect(polynomialValue(order, ['n'], { n: '2' })).not.toBe(
        polynomialValue(perItem, ['n'], { n: '2' }),
      );
      expect(equalPolynomial(order, perItem, ['n'])).toBe(false);
      expect(polynomialValue(`${bags}(n+${extra})`, ['n'], { n: '0' })).toBe(
        String(bags * extra),
      );
      expect(
        equalPolynomial(`2(n+${offset})+2n`, `4n+${2 * offset}`, ['n']),
      ).toBe(true);
      expect(polynomialValue(`2(n+${offset})+2n`, ['n'], { n })).toBe(
        perimeter,
      );
      expect(polynomialValue(`n(n+${offset})`, ['n'], { n })).toBe(area);
      expect(sets[i]!.questions[3]!.solution.en).toContain(area);
    }
    expect(lessonById('J81-L04')!.questions[5]!.stem.en).toContain(
      '(x−b)²=x²+b²',
    );
    expect(lessonById('J82-L05')!.questions[5]!.stem.en).toContain(
      'source 2x²−18',
    );
  });
});
