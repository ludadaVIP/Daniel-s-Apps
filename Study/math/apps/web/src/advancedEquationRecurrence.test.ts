import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { advancedEquationRecurrenceRetrieval } from './content/advancedEquationRecurrenceRetrieval';
import { advancedEquationRecurrenceEvidence } from './content/advancedEquationRecurrenceEvidence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import { plotBounds } from './cartesianModels';
import { textR, rational, addR, mulR, divR, negR } from './algebraModels';
import { compareR as compare } from './inequalityModels';
import { readRational as R } from './rationalModels';
import {
  parseRealSet,
  intervalContains,
  parseInequality,
  solveInequality,
  sameInterval,
} from './inequalityModels';
import { readRadical, radicalText } from './radicalModels';
import { circularAt, checkCircleIdentity } from './circularModels';
import { equalPolynomial } from './polynomialModels';
import { polynomialValue, parsePolynomial } from './polynomialModels';
const minus = (a: ReturnType<typeof R>, b: ReturnType<typeof R>) =>
  addR(a, negR(b));
const normal = (s: string) => s.replaceAll('−', '-');
const sets = Object.values(advancedEquationRecurrenceRetrieval);
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
describe('advanced equation recurrence', () => {
  it('covers all five H35 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => l.unit === 'H35')
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(5);
    expect(
      new Set(advancedEquationRecurrenceEvidence.map((e) => e.skill)),
    ).toEqual(actual);
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of advancedEquationRecurrenceEvidence) {
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

  it('checks original branch domains and actual written inverses in both directions without extending polynomial domains', () => {
    for (const [key, a, c, positive, negative, range, invalid] of [
      ['H36_ADVANCED_EQUATION', 2, 1, '[3,∞)', '(-∞,-1]', '[4,∞)', 2],
      ['H38_ADVANCED_EQUATION', 1, -2, '[-1,∞)', '(-∞,-3]', '[1,∞)', -2],
    ] as const) {
      const q = advancedEquationRecurrenceRetrieval[key].questions[0]!,
        sol = normal(q.solution.en),
        pd = parseRealSet(positive)!,
        nd = parseRealSet(negative)!;
      expect(sol).toContain(`H₊ domain${positive}`);
      expect(sol).toContain(`H₋ domain${negative}`);
      expect(sol).toContain(`ranges${range}`);
      expect(intervalContains(pd, R(String(invalid)))).toBe(false);
      expect((invalid - c) ** 2).toBeGreaterThanOrEqual(0);
      const pi = sol.match(/H₊⁻¹\(y\)=([^ ;,]+)/)![1]!,
        ni = sol.match(/H₋⁻¹\(y\)=([^ ;,]+)/)![1]!;
      for (const m of [a, a + 1, a + 3]) {
        const y = m * m,
          xp = c + m,
          xn = c - m;
        expect(intervalContains(pd, R(String(xp)))).toBe(true);
        expect(intervalContains(nd, R(String(xn)))).toBe(true);
        const yp = readRadical(pi.replace('y', String(y)))!,
          yn = readRadical(ni.replace('y', String(y)))!;
        expect(radicalText(yp)).toBe(String(xp));
        expect(radicalText(yn)).toBe(String(xn));
        expect((Number(radicalText(yp)) - c) ** 2).toBe(y);
        expect((Number(radicalText(yn)) - c) ** 2).toBe(y);
      }
      expect(intervalContains(pd, R(String(c + a - 1)))).toBe(false);
      expect(intervalContains(nd, R(String(c - a + 1)))).toBe(false);
      expect(sol).toContain('H⁻¹=g⁻¹∘f⁻¹');
      expect(sol).toContain('|x-c|');
      expect(sol).toContain('If a=0');
      expect(sol).toContain('reciprocates');
    }
  });
  it('audits actual decreasing-base log candidates,original arguments and equality versus reversed inequalities', () => {
    const power = (r: ReturnType<typeof R>, n: number) =>
      n >= 0
        ? rational(r[0] ** BigInt(n), r[1] ** BigInt(n))
        : rational(r[1] ** BigInt(-n), r[0] ** BigInt(-n));
    for (const [key, a, p, root, args, logs, linear, rel, set] of [
      [
        'H36_ADVANCED_EQUATION',
        2,
        -5,
        6,
        [4, 8],
        [-2, -3],
        '2x-1=x+2',
        '2x-1>=x+2',
        '[3,∞)',
      ],
      [
        'H38_ADVANCED_EQUATION',
        3,
        -4,
        5,
        [2, 8],
        [-1, -3],
        '3x+1=x-3',
        '3x+1<=x-3',
        '(-∞,-2]',
      ],
    ] as const) {
      const q = advancedEquationRecurrenceRetrieval[key].questions[1]!,
        target = power(R('1/2'), p);
      expect(root * root - a * a).toBe(Number(target[0]) / Number(target[1]));
      expect(
        equalPolynomial(
          `x²-${a * a}-${textR(target)}`,
          `(x-${root})(x+${root})`,
          ['x'],
        ),
      ).toBe(true);
      expect([-root, root].filter((x) => x - a > 0 && x + a > 0)).toEqual([
        root,
      ]);
      expect([root - a, root + a]).toEqual(args);
      expect(logs[0] + logs[1]).toBe(p);
      args.forEach((arg, i) =>
        expect(textR(power(R('1/2'), logs[i]!))).toBe(String(arg)),
      );
      const eq = solveInequality(parseInequality(linear)!),
        ineq = solveInequality(parseInequality(rel)!);
      expect(sameInterval(ineq, parseRealSet(set)!)).toBe(true);
      const boundary = key === 'H36_ADVANCED_EQUATION' ? 3 : -2;
      expect(intervalContains(eq, R(String(boundary)))).toBe(true);
      for (const x of [boundary - 1, boundary, boundary + 1]) {
        const left = key === 'H36_ADVANCED_EQUATION' ? 2 * x - 1 : 3 * x + 1,
          right = key === 'H36_ADVANCED_EQUATION' ? x + 2 : x - 3;
        const original =
          key === 'H36_ADVANCED_EQUATION'
            ? compare(power(R('1/2'), left), power(R('1/2'), right)) <= 0
            : compare(power(R('1/2'), left), power(R('1/2'), right)) >= 0;
        expect(intervalContains(ineq, R(String(x)))).toBe(original);
      }
      expect(normal(q.solution.en)).toContain(set);
      expect(q.solution.en).toContain('Log base one has no inverse');
      expect(q.solution.en).toContain('Nonpositive bases');
    }
  });
  it('proves the actual factor identities before cancellation and checks exact periodic holes separately from extension values', () => {
    expect(checkCircleIdentity('c²', '(1-s)(1+s)')).toBe(true);
    expect(equalPolynomial('1-(1-2s²)', '2s*s', ['s'])).toBe(true);
    // At θ=π/6 the original quotient is1/2,but subtracting one
    // from numerator and denominator gives−1/2.
    expect(textR(divR(R('3/4'), R('3/2')))).toBe('1/2');
    expect(textR(divR(minus(R('3/4'), R('1')), minus(R('3/2'), R('1'))))).toBe(
      '-1/2',
    );
    for (const key of [
      'H36_ADVANCED_EQUATION',
      'H38_ADVANCED_EQUATION',
    ] as const) {
      const first = key === 'H36_ADVANCED_EQUATION',
        q = advancedEquationRecurrenceRetrieval[key].questions[2]!;
      const angles = first ? ['-1/2', '3/2', '7/2'] : ['0', '1', '2'];
      for (const angle of angles) {
        const at = circularAt(angle);
        expect(first ? at.sin : '0').toBe(first ? '-1' : '0');
        if (!first) expect(at.sin).toBe('0');
      }
      expect(q.solution.en).toContain(first ? 'θ=−π/2+2kπ' : 'θ=kπ');
      expect(q.solution.en).toContain('k∈Z');
      expect(q.solution.en).toContain('undefined 0/0');
      const allowed = circularAt(first ? '0' : '1/2');
      if (first) {
        expect(allowed.sin).toBe('0');
        expect(allowed.cos).toBe('1');
        expect(1 / (1 + 0)).toBe(1 - 0);
      } else {
        expect(allowed.sin).toBe('1');
        expect(circularAt('1').cos).toBe('-1');
        expect((1 - -1) / 1).toBe(2);
      }
      expect(q.solution.en).toContain('NONZERO FACTOR');
      expect(q.solution.en).toContain('EVERY angle');
    }
  });
  it('derives exact point images and the actual written polynomial from a source-only plot,including zero-scale domain limits', () => {
    for (const [key, a, b, h, k, targets, horizontal, formula] of [
      [
        'H36_ADVANCED_EQUATION',
        '-2',
        '-2',
        '1',
        '3',
        [
          ['0', '-5'],
          ['2', '-5'],
        ],
        '1/2',
        '−2 f(−2(x−1))+3',
      ],
      [
        'H38_ADVANCED_EQUATION',
        '3',
        '-1/2',
        '-2',
        '-4',
        [
          ['-6', '8'],
          ['2', '8'],
        ],
        '2',
        '3 f((−1/2)(x+2))−4',
      ],
    ] as const) {
      const q = advancedEquationRecurrenceRetrieval[key].questions[3]!,
        d = q.diagram!;
      expect(q.stem.en).toContain(formula);
      if (d.kind !== 'cartesian') throw Error('Source parabola required');
      expect(() => plotBounds(d.bounds)).not.toThrow();
      expect(d.xLabel).toBe('source u');
      expect(d.yLabel).toBe('f(u)');
      expect(d.points.map((p) => [p.x, p.y, p.label])).toEqual([
        [2, 4, 'P'],
        [-2, 4, 'Q'],
      ]);
      expect(d.curves).toHaveLength(1);
      for (const point of d.curves![0]!.points)
        expect(point.y).toBeCloseTo(point.x * point.x, 13);
      expect(d.caption!.en).toContain('target answers are not drawn');
      const coefficient = mulR(R(a), mulR(R(b), R(b))),
        actual = normal(q.solution.en).match(/G\(x\)=([^.; ]+)/)![1]!;
      expect(
        equalPolynomial(actual, `${textR(coefficient)}(x-(${h}))²+(${k})`, [
          'x',
        ]),
      ).toBe(true);
      d.points.forEach((point, i) => {
        const x = addR(R(h), divR(R(String(point.x)), R(b))),
          y = addR(mulR(R(a), R(String(point.y))), R(k));
        expect([textR(x), textR(y)]).toEqual(targets[i]);
        expect(polynomialValue(actual, ['x'], { x: textR(x) })).toBe(textR(y));
        const reflected = addR(R(h), divR(R(String(point.x)), negR(R(b))));
        expect(textR(reflected)).toBe(targets[1 - i]![0]);
      });
      const absB = R(b)[0] < 0n ? negR(R(b)) : R(b);
      expect(textR(divR(R('1'), absB))).toBe(horizontal);
      expect(q.solution.en).toContain('D_G={x∈R:b(x−h)∈D_f}');
      expect(q.solution.en).toContain('empty even if a=0');
      expect(q.solution.en).toContain('punctured domain');
    }
  });
  it('extracts all four actual equations and verifies candidate inclusion,domain filtering,both absolute branches and preserved zero roots', () => {
    for (const [key, negative, radicalDomain] of [
      ['H36_ADVANCED_EQUATION', '-2', '[-6,∞)'],
      ['H38_ADVANCED_EQUATION', '-1', '[-3/2,∞)'],
    ] as const) {
      const q = advancedEquationRecurrenceRetrieval[key].questions[4]!,
        stem = normal(q.stem.en),
        sol = normal(q.solution.en);
      const radicand = stem.match(/\(1\)√\(([^)]+)\)=x/)![1]!,
        factor = sol.match(/roots of ([^,]+),/)![1]!,
        [left, right] = factor.split('=');
      expect(equalPolynomial(left!, right!, ['x'])).toBe(true);
      expect(equalPolynomial(left!, `x²-(${radicand})`, ['x'])).toBe(true);
      for (const x of [negative, '3']) {
        expect(intervalContains(parseRealSet(radicalDomain)!, R(x))).toBe(true);
        expect(polynomialValue(left!, ['x'], { x })).toBe('0');
        const raw = polynomialValue(radicand, ['x'], { x })!,
          value = radicalText(readRadical(`√(${raw})`)!);
        expect(value === x).toBe(x === '3');
      }
      const rationalMatch = stem.match(/\(2\)\(([^)]+)\)\/\(x-(\d+)\)=(\d+)/)!,
        numerator = rationalMatch[1]!,
        hole = rationalMatch[2]!,
        rhs = rationalMatch[3]!;
      expect(equalPolynomial(numerator, `(x-${hole})(x+${hole})`, ['x'])).toBe(
        true,
      );
      expect(textR(minus(R(rhs), R(hole)))).toBe(hole);
      expect(sol).toContain('solution set is∅'); // the only equivalent linear candidate is excluded
      const product = stem.match(/\(3\)([^;]+);/)![1]!.split('=')[0]!,
        poly = parsePolynomial(product, ['x'])!;
      expect(poly.get('')?.[0] ?? 0n).toBe(0n);
      const other = divR(negR(poly.get('x')!), poly.get('xx')!);
      expect(polynomialValue(product, ['x'], { x: '0' })).toBe('0');
      expect(polynomialValue(product, ['x'], { x: textR(other) })).toBe('0');
      const abs = stem.match(/\(4\)\|([^|]+)\|=(\d+)/)!,
        inner = abs[1]!,
        target = R(abs[2]!),
        ap = parsePolynomial(inner, ['x'])!;
      const roots = [target, negR(target)].map((v) =>
        divR(minus(v, ap.get('') ?? rational(0n)), ap.get('x')!),
      );
      const expected =
        key === 'H36_ADVANCED_EQUATION' ? ['-1', '5'] : ['-2', '1'];
      expect(roots.map(textR).sort()).toEqual(expected.sort());
      for (const x of roots) {
        const value = R(polynomialValue(inner, ['x'], { x: textR(x) })!);
        expect(textR(value[0] < 0n ? negR(value) : value)).toBe('3');
      }
      expect(sol).toContain('candidate INCLUSION');
      expect(sol).toContain('dividing by x loses zero');
      expect(sol).toContain('list exhaustive');
    }
  });
});
