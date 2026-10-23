import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { optimisationRecurrenceRetrieval } from './content/optimisationRecurrenceRetrieval';
import { optimisationRecurrenceEvidence } from './content/optimisationRecurrenceEvidence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import {
  checkAdvancedDerivative,
  implicitAudit,
  fenceAudit,
  motionAudit,
} from './optimisationModels';
import {
  derivativeText,
  tangentModel,
  valueAt,
  calculusPolynomial,
} from './calculusModels';
import { equalPolynomial } from './polynomialModels';
import { plotBounds } from './cartesianModels';
import { textR, rational, divR } from './algebraModels';
import { readRational as R } from './rationalModels';
const sets = Object.values(optimisationRecurrenceRetrieval);
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
describe('optimisation recurrence', () => {
  it('covers all six H31 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => l.unit === 'H31')
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(6);
    expect(new Set(optimisationRecurrenceEvidence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of optimisationRecurrenceEvidence) {
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
  it('keeps ten bilingual derivations human-reviewed and outside canonical checks', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(10);
    for (const s of sets) {
      expect(s.questions).toHaveLength(5);
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

  it('checks derivatives extracted from actual exponential solutions,negative inner factors and fixed-power/base distinctions', () => {
    for (const [key, rate, want, power, base] of [
      ['H35_OPTIMISATION', '-2', '8x^3-3-2exp(-2x)', 4, 4],
      ['H38_OPTIMISATION', '2', '-3x^2+8x+6exp(2x)', 3, 3],
    ] as const) {
      const q = optimisationRecurrenceRetrieval[key].questions[0]!,
        actual = q.solution.en.match(/f′=([^,]+)/)![1]!;
      expect(checkAdvancedDerivative(actual, want, 'natural', rate)).toBe(true);
      expect(
        equalPolynomial(derivativeText(`x^${power}`), `${power}x^${power - 1}`),
      ).toBe(true);
      expect(
        checkAdvancedDerivative(
          `ln(${base})${base}^x`,
          `ln(${base})*${base}^x`,
          'base',
          '1',
          base,
        ),
      ).toBe(true);
      expect(
        checkAdvancedDerivative(
          `${base}^x`,
          `ln(${base})${base}^x`,
          'base',
          '1',
          base,
        ),
      ).toBe(false);
    }
    expect(derivativeText('1')).toBe('0');
  });
  it('checks actual radian derivatives,cosine signs,all-branch exclusion formulas and exact degree conversion factors', () => {
    for (const [key, k, want, slope, conversion, excluded] of [
      ['H35_OPTIMISATION', '3', '6cos(3x)-3sin(3x)', '6', '1/30', 'π/6+jπ/3'],
      [
        'H38_OPTIMISATION',
        '2',
        '-6sin(2x)-2cos(2x)',
        '-2',
        '-1/90',
        'π/4+jπ/2',
      ],
    ] as const) {
      const q = optimisationRecurrenceRetrieval[key].questions[1]!,
        actual = q.solution.en.match(/g′=([^,]+)/)![1]!;
      expect(checkAdvancedDerivative(actual, want, 'trig', k)).toBe(true);
      expect(
        checkAdvancedDerivative(
          `${k}cos(${k}x)^2+${k}sin(${k}x)^2`,
          k,
          'trig',
          k,
        ),
      ).toBe(true);
      expect(textR(divR(R(slope), rational(180n)))).toBe(conversion);
      expect(q.solution.en).toContain(excluded);
    }
  });
  it('checks actual equal-unit given curves and classifies membership before finite,vertical or singular division', () => {
    for (const [key, p, slope, qx] of [
      ['H35_OPTIMISATION', ['6', '8'], '-3/4', '10'],
      ['H38_OPTIMISATION', ['-8', '6'], '4/3', '-10'],
    ] as const) {
      const diagram =
        optimisationRecurrenceRetrieval[key].questions[2]!.diagram!;
      if (diagram.kind !== 'cartesian')
        throw Error('Need actual curve comparison');
      expect(() => plotBounds(diagram.bounds)).not.toThrow();
      expect(400 / (diagram.bounds.xMax - diagram.bounds.xMin)).toBe(
        280 / (diagram.bounds.yMax - diagram.bounds.yMin),
      );
      expect(diagram.points).toEqual([
        { x: Number(p[0]), y: Number(p[1]), label: 'P' },
        { x: Number(qx), y: 0, label: 'Q' },
        { x: 0, y: 0, label: 'O' },
      ]);
      expect(diagram.curves).toHaveLength(3);
      expect(diagram.curves![0]!.points).toHaveLength(81);
      for (const pt of diagram.curves![0]!.points)
        expect(pt.x * pt.x + pt.y * pt.y).toBeCloseTo(100, 10);
      expect(textR(implicitAudit('circle', p[0], p[1], 10).slope!)).toBe(slope);
      expect(implicitAudit('circle', qx, '0', 10).status).toBe('vertical');
      expect(implicitAudit('circle', '0', '0', 10).status).toBe('off-curve');
      expect(implicitAudit('cross', '0', '0').status).toBe('singular');
      for (const pt of diagram.points!)
        expect(diagram.caption!.en).toContain(`${pt.label}(${pt.x},${pt.y})`);
    }
    expect(equalPolynomial('x^2-y^2', '(x-y)(x+y)', ['x', 'y'])).toBe(true);
  });
  it('checks both complete continuous/integer fence comparisons and the general identity supporting all candidates', () => {
    for (const [l, c, x, max, intL, intC, ints, intMax] of [
      [30, 6, '{6}', '108', 26, 10, '{6,7}', '84'],
      [28, 5, '{5}', '90', 30, 12, '{7,8}', '112'],
    ] as const) {
      const f = fenceAudit(l, c),
        g = fenceAudit(intL, intC, true);
      expect(f.bestText).toBe(x);
      expect(textR(f.max!)).toBe(max);
      expect(f.candidates.every((p) => textR(p.y) === '18')).toBe(true);
      expect(g.bestText).toBe(ints);
      expect(textR(g.max!)).toBe(intMax);
      expect(g.best).toHaveLength(2);
      expect(f.allowed(0)).toBe(false);
      expect(fenceAudit(l, 0).bestText).toBe('∅');
      expect(
        g.candidates.every(
          (p) => Number(p.area[0]) / Number(p.area[1]) <= Number(intMax),
        ),
      ).toBe(true);
    }
    expect(equalPolynomial('l*x-2x^2', 'l^2/8-2(x-l/4)^2', ['l', 'x'])).toBe(
      true,
    );
    const reused = optimisationRecurrenceEvidence.find(
      (e) => e.skill === 'optimisation-4',
    )!;
    expect(reused.targets).toEqual([
      'H35-MAINT-FUNCTION-ANALYSIS-Q2',
      'H38-MAINT-OPTIMISATION-Q4',
    ]);
  });
  it('checks full scaled/shifted motion ledgers,averages,zero acceleration and a zero-velocity nonreversal', () => {
    for (const [
      scale,
      offset,
      positions,
      displacement,
      distance,
      average,
      averageSpeed,
      v2,
      v15,
      a15,
    ] of [
      [-2, 5, ['5', '-3', '5', '-3'], '-8', '24', '-2', '6', '6', '9/2', '6'],
      [
        3,
        -4,
        ['-4', '8', '-4', '8'],
        '12',
        '36',
        '3',
        '9',
        '-9',
        '-27/4',
        '-9',
      ],
    ] as const) {
      const m = motionAudit(scale, offset, '2', 4);
      expect(
        [0, 1, 3, 4].map((t) => textR(m.position(rational(BigInt(t))))),
      ).toEqual(positions);
      expect(
        [
          m.displacement,
          m.distance,
          m.averageVelocity,
          m.averageSpeed,
          m.v,
          m.a,
        ].map(textR),
      ).toEqual([displacement, distance, average, averageSpeed, v2, '0']);
      expect(m.classification).toBe('neither');
      const changing = motionAudit(scale, offset, '3/2', 4);
      expect([textR(changing.v), textR(changing.a)]).toEqual([v15, a15]);
      expect(changing.classification).toBe('speeding-up');
      const shifted = motionAudit(scale, offset + 1, '2', 4);
      expect(shifted.distance).toEqual(m.distance);
      expect(shifted.displacement).toEqual(m.displacement);
      expect(shifted.v).toEqual(m.v);
    }
    const raw = '(x-2)^3',
      derivative = derivativeText(raw);
    expect(equalPolynomial(derivative, '3(x-2)^2')).toBe(true);
    expect(tangentModel(raw, '2').slope).toEqual(R('0'));
    expect(
      [1, 3].map((x) =>
        textR(valueAt(calculusPolynomial(derivative), R(String(x)))),
      ),
    ).toEqual(['3', '3']);
  });
});
