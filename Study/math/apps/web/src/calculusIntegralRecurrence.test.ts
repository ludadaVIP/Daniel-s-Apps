import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { calculusIntegralRetrieval } from './content/calculusIntegralRetrieval';
import { calculusIntegralRecurrence } from './content/calculusIntegralRecurrence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import {
  integralPolynomial,
  polynomialIntegral,
  riemannAudit,
  uniformPartition,
  checkIntegralPrimitive,
} from './integralModels';
import { valueAt, calculusPolynomial, derivativeText } from './calculusModels';
import { equalPolynomial } from './polynomialModels';
import { readComplex } from './complexModels';
import { plotBounds } from './cartesianModels';
import { compareR } from './inequalityModels';
import {
  textR,
  rational,
  addR,
  mulR,
  divR,
  negR,
  type Rational,
} from './algebraModels';
import { readRational as R } from './rationalModels';
const subtract = (a: Rational, b: Rational) => addR(a, negR(b));
const integrate = (raw: string, a: string, b: string) =>
  polynomialIntegral(integralPolynomial(raw), R(a), R(b));
const geometric = (raw: string, cuts: string[]) =>
  cuts.slice(1).map((b, i) => {
    const v = integrate(raw, cuts[i]!, b);
    return v[0] < 0n ? negR(v) : v;
  });
const sets = Object.values(calculusIntegralRetrieval);
const tasks = new Map([
  ...lessons.flatMap((l) =>
    [l.guided, ...l.questions, l.exit].map(
      (q) => [q.id, { q, unit: l.unit! }] as const,
    ),
  ),
  ...Object.values(maintenanceSets).flatMap((s) =>
    s.questions.map((q) => [q.id, { q, unit: s.unit }] as const),
  ),
]);
describe('calculus integral recurrence', () => {
  it('covers all six H32 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => l.unit === 'H32')
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(6);
    expect(new Set(calculusIntegralRecurrence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of calculusIntegralRecurrence) {
      const source = lessonById(e.sourceLesson)!;
      expect(
        source.questions.some(
          (q) => q.id === e.sourceTask && q.skill === e.skill,
        ),
      ).toBe(true);
      const owners = new Set(
        e.targets.map((id) => {
          const target = tasks.get(id)!;
          expect(target, id).toBeDefined();
          expect(units.indexOf(target.unit), id).toBeGreaterThan(
            units.indexOf(source.unit!),
          );
          const link = recurrenceLinksFor(source.id)
            .flatMap((g) => g.targets)
            .find((q) => q.id === id)!;
          expect(
            new URL(link.href, 'http://localhost').searchParams.get('question'),
          ).toBe(id);
          return target.unit;
        }),
      );
      expect(owners.size, e.skill).toBeGreaterThanOrEqual(2);
      expect(
        e.focus.zh && e.focus.en && e.rationale.zh && e.rationale.en,
      ).toBeTruthy();
    }
  });
  it('keeps twelve bilingual derivations human-reviewed and outside canonical checks', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(12);
    for (const s of sets) {
      expect(s.questions).toHaveLength(6);
      expect(s.id).not.toBe(unitChecks[s.unit as keyof typeof unitChecks].id);
      expect(lessons.some((l) => l.id === s.id)).toBe(false);
      for (const q of s.questions) {
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.zh && h.en)).toBe(true);
        expect(
          checkAnswer('factor same zero product all real (7,2)', q.answer),
        ).toBeNull();
        expect(lessonById(s.bridgeByQuestion[q.id]!)).toBeDefined();
      }
    }
  });

  it('uses actual piecewise table durations for totals,partial states and weighted averages without changing fixed classroom models', () => {
    for (const [
      key,
      end,
      time,
      initial,
      total,
      average,
      addition,
      state,
      current,
    ] of [
      ['H36_INTEGRAL', '4', '3/2', '8', '10', '5/2', '7/2', '23/2', '1'],
      ['H38_INTEGRAL', '5', '5/2', '3', '11', '11/5', '9/2', '15/2', '5'],
    ] as const) {
      const q = calculusIntegralRetrieval[key].questions[0]!,
        rows = q.contextTable!.rows;
      const cells = rows.map((row) => {
        const [a, b] = row[0]!.en.match(/\d+/g)!;
        return { a: R(a!), b: R(b!), rate: R(row[1]!.en) };
      });
      const amount = (time: string) =>
        cells.reduce((sum, cell) => {
          const x = R(time),
            until =
              compareR(x, cell.a) <= 0
                ? cell.a
                : compareR(x, cell.b) >= 0
                  ? cell.b
                  : x;
          return addR(sum, mulR(subtract(until, cell.a), cell.rate));
        }, rational(0n));
      expect(textR(amount(end))).toBe(total);
      expect(textR(divR(amount(end), R(end)))).toBe(average);
      expect(textR(amount(time))).toBe(addition);
      expect(textR(addR(R(initial), amount(time)))).toBe(state);
      const active = cells.find(
        (c) => compareR(R(time), c.a) >= 0 && compareR(R(time), c.b) < 0,
      )!;
      expect(textR(active.rate)).toBe(current);
      expect(amount('0')).toEqual(R('0'));
      expect(() => divR(amount('0'), R('0'))).toThrow();
      expect(rows).toHaveLength(3);
      expect(q.solution.en).toContain(`average${average} L/min`);
    }
  });
  it('checks actual nonuniform midpoint rectangles and all exact tagged sums,then verifies the stated wide-cell formulas against independent partitions', () => {
    for (const [key, kind, expected, exact, limit] of [
      ['H36_INTEGRAL', 'square', ['11/8', '41/16', '35/8'], '8/3', '7/3'],
      ['H38_INTEGRAL', 'rising', ['11/2', '9', '25/2'], '9', '8'],
    ] as const) {
      const q = calculusIntegralRetrieval[key].questions[1]!,
        d = q.diagram!;
      if (d.kind !== 'cartesian') throw Error('Need actual Riemann rectangles');
      expect(() => plotBounds(d.bounds)).not.toThrow();
      expect(d.curves).toHaveLength(4);
      expect(d.points).toHaveLength(3);
      const rectangles = d.curves!.slice(1),
        edges = [
          String(rectangles[0]!.points[0]!.x),
          ...rectangles.map((r) => String(r.points[2]!.x)),
        ];
      const mids = riemannAudit(kind, edges, 'middle');
      for (const [i, rect] of rectangles.entries()) {
        const cell = mids.cells[i]!;
        expect(rect.points[1]!.y).toBe(
          Number(cell.height[0]) / Number(cell.height[1]),
        );
        expect(d.points![i]!.x).toBe(
          Number(cell.sample[0]) / Number(cell.sample[1]),
        );
      }
      expect(
        ['left', 'middle', 'right'].map((tag) =>
          textR(
            riemannAudit(kind, edges, tag as 'left' | 'middle' | 'right').sum,
          ),
        ),
      ).toEqual(expected);
      expect(textR(mids.exact)).toBe(exact);
      const expression = q.solution.en.match(/L_n=([^→]+)→/)![1]!;
      for (const n of [1, 2, 4, 8, 16]) {
        const partition = [
            '0',
            ...uniformPartition('1', key === 'H36_INTEGRAL' ? '2' : '3', n),
          ],
          m = riemannAudit(kind, partition, 'left');
        const number = readComplex(expression.replace(/n/g, `(${n})`));
        expect(number[1]).toEqual(R('0'));
        expect(number[0]).toEqual(m.sum);
        expect(compareR(m.mesh, R('1'))).toBeGreaterThanOrEqual(0);
        expect(compareR(m.sum, R(limit))).toBeLessThan(0);
      }
    }
  });
  it('differentiates actual full-family expressions,applies independent initial conditions and rejects restricted constant ranges', () => {
    for (const [key, integrand, x, value, c, s0, s2] of [
      ['H36_INTEGRAL', '3x^2-2x+2', '0', '4', '4', '4', '12'],
      ['H38_INTEGRAL', '-2x+6', '1', '10', '5', '5', '13'],
    ] as const) {
      const q = calculusIntegralRetrieval[key].questions[2]!,
        family = q.solution.en.match(/F\(t\)=([^;]+)/)![1]!.replace(/t/g, 'x');
      expect(checkIntegralPrimitive(family, integrand, true)).toBe(true);
      expect(
        checkIntegralPrimitive(family.replace('C', 'C²'), integrand, true),
      ).toBe(false);
      expect(
        checkIntegralPrimitive(family.replace('C', '2C-7'), integrand, true),
      ).toBe(true);
      const fixed = family.replace('C', c);
      expect(
        checkIntegralPrimitive(fixed, integrand, false, { x, value }),
      ).toBe(true);
      expect([
        textR(valueAt(calculusPolynomial(fixed), R('0'))),
        textR(valueAt(calculusPolynomial(fixed), R('2'))),
      ]).toEqual([s0, s2]);
      expect(textR(integrate(integrand, '0', '2'))).toBe('8');
    }
    expect(derivativeText('x')).toBe('1');
    expect(derivativeText('x+1')).toBe('1');
    expect(equalPolynomial('(x+1)-x', '1')).toBe(true);
  });
  it('checks signed,absolute,reversed,equal-endpoint and cancelling-nonzero areas for both linear models', () => {
    for (const [raw, zero, signed, area, cancelEnd, cancelArea] of [
      ['x-1', '1', '3/2', '5/2', '2', '1'],
      ['2x-4', '2', '-3', '5', '4', '8'],
    ] as const) {
      const value = integrate(raw, '0', '3'),
        pieces = geometric(raw, ['0', zero, '3']);
      expect(textR(value)).toBe(signed);
      expect(textR(pieces.reduce(addR, R('0')))).toBe(area);
      expect(integrate(raw, '3', '0')).toEqual(negR(value));
      expect(integrate(raw, zero, zero)).toEqual(R('0'));
      expect(integrate(raw, '0', cancelEnd)).toEqual(R('0'));
      expect(
        textR(geometric(raw, ['0', zero, cancelEnd]).reduce(addR, R('0'))),
      ).toBe(cancelArea);
    }
    expect(equalPolynomial('(3+c)-(1+c)', '2', ['c'])).toBe(true);
  });
  it('checks actual accumulated functions against their derivatives and distinguishes continuous jumps from differentiability', () => {
    for (const [key, value, slope, derivative] of [
      ['H36_INTEGRAL', '7/3', '8', '2(2x)^2'],
      ['H38_INTEGRAL', '3/2', '4', '2x(x^2+1)'],
    ] as const) {
      const q = calculusIntegralRetrieval[key].questions[4]!,
        A = q.solution.en.match(/A=([^,]+)/)![1]!,
        d = q.solution.en.match(/A′=([^,]+)/)![1]!;
      expect(equalPolynomial(derivativeText(A), d)).toBe(true);
      expect(equalPolynomial(d, derivative)).toBe(true);
      expect(textR(valueAt(calculusPolynomial(A), R('1')))).toBe(value);
      expect(textR(valueAt(calculusPolynomial(d), R('1')))).toBe(slope);
      if (key === 'H38_INTEGRAL')
        expect(valueAt(calculusPolynomial(d), R('0'))).toEqual(R('0'));
    }
    for (const c of [1, 2]) {
      const left = calculusPolynomial('2x'),
        right = calculusPolynomial(`2*${c}+5(x-${c})`);
      expect(valueAt(left, R(String(c)))).toEqual(valueAt(right, R(String(c))));
      expect(derivativeText('2x')).toBe('2');
      expect(derivativeText(`2*${c}+5(x-${c})`)).toBe('5');
    }
  });
  it('checks all three independent application ledgers,exact crossing areas and actual metre-coordinate plots', () => {
    for (const [
      key,
      v,
      end,
      initial,
      root,
      disp,
      distance,
      final,
      gross,
      flowEnd,
      out,
      start,
      flowFinal,
      gap,
      cuts,
      areas,
    ] of [
      [
        'H36_INTEGRAL',
        'x-2',
        '4',
        '3',
        '2',
        '0',
        '4',
        '3',
        '3x+1',
        '2',
        '2',
        '2',
        '6',
        '3x-x^2',
        ['-1', '0', '3', '4'],
        ['11/6', '9/2', '11/6'],
      ],
      [
        'H38_INTEGRAL',
        '2x-2',
        '3',
        '5',
        '1',
        '3',
        '5',
        '8',
        '2x+2',
        '3',
        '1',
        '4',
        '16',
        'x^2-x',
        ['-1', '0', '1', '2'],
        ['5/6', '1/6', '5/6'],
      ],
    ] as const) {
      const displacement = integrate(v, '0', end),
        path = geometric(v, ['0', root, end]).reduce(addR, R('0'));
      expect([
        textR(displacement),
        textR(path),
        textR(addR(R(initial), displacement)),
      ]).toEqual([disp, distance, final]);
      expect(
        textR(
          addR(
            R(start),
            subtract(
              integrate(gross, '0', flowEnd),
              integrate(out, '0', flowEnd),
            ),
          ),
        ),
      ).toBe(flowFinal);
      expect(geometric(gap, [...cuts]).map(textR)).toEqual(areas);
      const d = calculusIntegralRetrieval[key].questions[5]!.diagram!;
      if (d.kind !== 'cartesian') throw Error('Need actual crossing curves');
      expect(() => plotBounds(d.bounds)).not.toThrow();
      expect(d.xLabel).toBe('x (m)');
      expect(d.yLabel).toBe('y (m)');
      expect(d.curves).toHaveLength(2);
      for (const [i, curve] of d.curves!.entries())
        for (const p of curve.points) {
          const y =
            key === 'H36_INTEGRAL'
              ? i === 0
                ? 3 * p.x
                : p.x * p.x
              : i === 0
                ? p.x * p.x
                : p.x;
          expect(p.y).toBeCloseTo(y, 10);
        }
    }
    expect(equalPolynomial('2+3x^2/2-x', '11/6+3(x-1/3)^2/2')).toBe(true);
    expect(valueAt(calculusPolynomial('2+3x^2/2-x'), R('1/3'))).toEqual(
      R('11/6'),
    );
  });
});
