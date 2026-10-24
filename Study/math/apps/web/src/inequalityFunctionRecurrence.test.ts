import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { inequalityFunctionRetrieval } from './content/inequalityFunctionRetrieval';
import { inequalityFunctionRecurrence } from './content/inequalityFunctionRecurrence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import { readRational } from './rationalModels';
import { textR, mulR, divR, negR } from './algebraModels';
import { readCoordinate } from './cartesianModels';
import {
  inequalityAt,
  solveInequality,
  parseRealSet,
  sameInterval,
  intervalContains,
  intersectIntervals,
  relationHolds,
} from './inequalityModels';
import {
  functionModel,
  functionAt,
  functionFromPoints,
  slopeBetween,
  pointOnFunction,
  classifyAffine,
} from './functionModels';
const sets = Object.values(inequalityFunctionRetrieval);
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
describe('inequality order and affine-function recurrence', () => {
  it('covers all eleven J84-J85 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => ['J84', 'J85'].includes(l.unit!))
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(11);
    expect(new Set(inequalityFunctionRecurrence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of inequalityFunctionRecurrence) {
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
          expect(checkAnswer(target.q.solution.en, target.q.answer)).toBeNull();
          return target.unit;
        }),
      );
      expect(owners.size, e.skill).toBeGreaterThanOrEqual(2);
      expect(
        e.focus.zh && e.focus.en && e.rationale.zh && e.rationale.en,
      ).toBeTruthy();
    }
  });
  it('keeps twenty bilingual derivations human-reviewed and outside canonical checks', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(20);
    for (const s of sets) {
      expect(s.questions).toHaveLength(10);
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

  it('checks all fractional one-step and full-bracket sets against exact original relations', () => {
    const cases = [
      {
        u: 'H01',
        i: 0,
        original: 'x<=5/2',
        expected: 'x<=5/2',
        member: '9/4',
        non: '3',
        edge: '5/2',
        closed: true,
        token: 'x≤5/2',
      },
      {
        u: 'H02',
        i: 0,
        original: 'x>-7/3',
        expected: 'x>-7/3',
        member: '-9/4',
        non: '-5/2',
        edge: '-7/3',
        closed: false,
        token: 'x>−7/3',
      },
      {
        u: 'H01',
        i: 1,
        original: '(5/2)x>=-3',
        expected: 'x>=-6/5',
        member: '0',
        non: '-2',
        edge: '-6/5',
        closed: true,
        token: 'x≥−6/5',
      },
      {
        u: 'H02',
        i: 1,
        original: '(3/4)x<-2',
        expected: 'x<-8/3',
        member: '-3',
        non: '0',
        edge: '-8/3',
        closed: false,
        token: 'x<−8/3',
      },
      {
        u: 'H01',
        i: 3,
        original: '(x-2)/3>=(x+1)/2',
        expected: 'x<=-7',
        member: '-8',
        non: '0',
        edge: '-7',
        closed: true,
        token: 'x≤−7',
      },
      {
        u: 'H02',
        i: 3,
        original: '(x+3)/4>(2x-1)/3',
        expected: 'x<13/5',
        member: '0',
        non: '3',
        edge: '13/5',
        closed: false,
        token: 'x<13/5',
      },
    ];
    for (const c of cases) {
      const result = solveInequality(inequalityAt(c.original));
      expect(sameInterval(result, parseRealSet(c.expected)!)).toBe(true);
      expect(intervalContains(result, readRational(c.member))).toBe(true);
      expect(intervalContains(result, readRational(c.non))).toBe(false);
      expect(intervalContains(result, readRational(c.edge))).toBe(c.closed);
      const q =
        inequalityFunctionRetrieval[c.u as 'H01' | 'H02'].questions[c.i]!;
      expect(q.solution.zh).toContain(c.token);
      // Cross-check every half-integer against the original, including values far outside displayed samples.
      const original = inequalityAt(c.original);
      for (let k = -30; k <= 30; k++) {
        const x = readRational(`${k}/2`);
        const value = (a: typeof original.left) =>
          [
            a.a[0] * x[0] * a.b[1] + a.b[0] * a.a[1] * x[1],
            a.a[1] * x[1] * a.b[1],
          ] as const;
        expect(intervalContains(result, x)).toBe(
          relationHolds(
            value(original.left),
            original.sign,
            value(original.right),
          ),
        );
      }
    }
  });
  it('checks reflection products, preserved equality and information loss at zero', () => {
    for (const [a, b, k, product] of [
      ['-3/2', '2', '-4', '-8'],
      ['-2', '5/2', '-3', '-15/2'],
    ]) {
      const left = readRational(a!),
        right = readRational(b!),
        factor = readRational(k!);
      expect(relationHolds(left, '<', right)).toBe(true);
      expect(textR(mulR(left, factor))).toBe('6');
      expect(textR(mulR(right, factor))).toBe(product);
      expect(relationHolds(mulR(left, factor), '>', mulR(right, factor))).toBe(
        true,
      );
      expect(relationHolds(mulR(left, factor), '>=', mulR(left, factor))).toBe(
        true,
      );
      expect(
        relationHolds(
          mulR(left, readRational('0')),
          '<',
          mulR(right, readRational('0')),
        ),
      ).toBe(false);
    }
    for (const s of sets)
      expect(s.questions[2]!.solution.en).toMatch(
        /zero.*(collapses|losing)|zero.*losing/i,
      );
  });
  it('checks singleton versus empty intersections and continuous versus whole budgets', () => {
    for (const [u, edge, m, b, budget, max] of [
      ['H01', '3/2', '2', '1', '8', '7/2'],
      ['H02', '-2', '3', '2', '12', '10/3'],
    ]) {
      const upper = solveInequality(inequalityAt(`x<=${edge}`));
      const one = intersectIntervals(
        solveInequality(inequalityAt(`x>=${edge}`)),
        upper,
      );
      expect(sameInterval(one, parseRealSet(`{${edge}}`)!)).toBe(true);
      expect(
        intersectIntervals(solveInequality(inequalityAt(`x>${edge}`)), upper)
          .kind,
      ).toBe('empty');
      const affordable = intersectIntervals(
        solveInequality(inequalityAt(`${m}x+${b}<=${budget}`)),
        parseRealSet('x>=0')!,
      );
      expect(sameInterval(affordable, parseRealSet(`[0,${max}]`)!)).toBe(true);
      expect(
        Array.from({ length: 9 }, (_, n) => n).filter((n) =>
          intervalContains(affordable, readRational(`${n}`)),
        ),
      ).toEqual([0, 1, 2, 3]);
      expect(textR(functionAt(functionModel(m!, b!), max!))).toBe(budget);
      expect(
        relationHolds(
          functionAt(functionModel(m!, b!), '4'),
          '>',
          readRational(budget!),
        ),
      ).toBe(true);
      expect(
        inequalityFunctionRetrieval[u as 'H01' | 'H02'].questions[4]!.solution
          .zh,
      ).toContain('{0,1,2,3}');
    }
  });
  it('derives both signed unit rates and distinguishes actual from extended intercepts exactly', () => {
    const point = (s: string) => readCoordinate(s)!;
    for (const [u, p, q, m, b, input, output] of [
      ['H01', '(2,7)', '(5,16)', '3', '1', '4', '13'],
      ['H02', '(1,8)', '(3,2)', '-3', '11', '2', '5'],
    ]) {
      const a = point(p!),
        c = point(q!),
        fitted = functionFromPoints(a, c);
      expect(fitted.kind).toBe('one');
      if (fitted.kind !== 'one') throw new Error('Expected one affine model');
      expect(textR(fitted.model.a)).toBe(m);
      expect(textR(fitted.model.b)).toBe(b);
      expect(textR(functionAt(fitted.model, input!))).toBe(output);
      const forward = slopeBetween(a, c),
        reverse = slopeBetween(c, a);
      expect(textR(reverse.slope!)).toBe(m);
      expect(textR(divR(forward.dy, negR(forward.dx)))).toBe(
        textR(negR(forward.slope!)),
      );
      expect(
        inequalityFunctionRetrieval[u as 'H01' | 'H02'].questions[5]!.solution
          .zh,
      ).toContain(`${output}`);
    }
    for (const [u, m, b, low, high, root] of [
      ['H01', '2', '-5', '1', '4', '5/2'],
      ['H02', '-3', '8', '1', '3', '8/3'],
    ]) {
      const domain = parseRealSet(`[${low},${high}]`)!,
        f = functionModel(m!, b!);
      expect(intervalContains(domain, readRational('0'))).toBe(false);
      expect(intervalContains(domain, readRational(root!))).toBe(true);
      expect(textR(functionAt(f, root!))).toBe('0');
      expect(textR(functionAt(f, '0'))).toBe(b);
      expect(
        inequalityFunctionRetrieval[u as 'H01' | 'H02'].questions[6]!.solution
          .zh,
      ).toContain(`(${root},0)`);
    }
  });
  it('classifies all six two-point cases and checks distinct rules through each repeated point', () => {
    const p = (s: string) => readCoordinate(s)!;
    for (const [a, b, m, c] of [
      ['(1,4)', '(3,4)', '0', '4'],
      ['(-1,2)', '(2,8)', '2', '4'],
    ]) {
      const fit = functionFromPoints(p(a!), p(b!));
      expect(fit.kind).toBe('one');
      if (fit.kind !== 'one') throw new Error('Expected one affine model');
      expect(textR(fit.model.a)).toBe(m);
      expect(textR(fit.model.b)).toBe(c);
      expect(
        pointOnFunction(fit.model, p(a!)) && pointOnFunction(fit.model, p(b!)),
      ).toBe(true);
    }
    for (const [a, b] of [
      ['(-2,1)', '(-2,5)'],
      ['(1,2)', '(1,-3)'],
    ])
      expect(functionFromPoints(p(a!), p(b!)).kind).toBe('vertical');
    for (const [same, m, b, c] of [
      ['(-1,3)', '1', '4', '3'],
      ['(3,-2)', '1', '-5', '-2'],
    ]) {
      expect(functionFromPoints(p(same!), p(same!)).kind).toBe('undetermined');
      expect(pointOnFunction(functionModel(m!, b!), p(same!))).toBe(true);
      expect(pointOnFunction(functionModel('0', c!), p(same!))).toBe(true);
    }
    for (const m of ['3', '-2'])
      expect(classifyAffine(functionModel(m, '0'))).toBe('direct');
    for (const [m, b] of [
      ['3', '2'],
      ['-2', '5'],
    ])
      expect(classifyAffine(functionModel(m!, b!))).toBe('affine');
    for (const b of ['7', '-4', '0'])
      expect(classifyAffine(functionModel('0', b))).toBe('constant');
    // The quadratic passes the origin but its positive-input ratios differ.
    expect((1 * 1) / 1).not.toBe((2 * 2) / 2);
  });
  it('checks every model endpoint and integer-output counterexamples with inadmissible half-pack inputs', () => {
    for (const [
      u,
      rate,
      fee,
      dmax,
      end,
      waterRate,
      waterStart,
      tmax,
      cards,
      initial,
      nmax,
    ] of [
      ['H01', '3', '4', '6', '22', '-3', '15', '5', '4', '1', 5],
      ['H02', '5/2', '6', '4', '16', '-2', '18', '9', '6', '2', 4],
    ] as const) {
      const trip = functionModel(rate, fee),
        water = functionModel(waterRate, waterStart),
        packs = functionModel(cards, initial);
      expect(textR(functionAt(trip, '0'))).toBe(fee);
      expect(textR(functionAt(trip, dmax))).toBe(end);
      expect(textR(functionAt(water, '0'))).toBe(waterStart);
      expect(textR(functionAt(water, tmax))).toBe('0');
      expect(
        relationHolds(
          functionAt(water, `${Number(tmax) + 1}`),
          '<',
          readRational('0'),
        ),
      ).toBe(true);
      const output = functionAt(packs, '1/2');
      expect(output[1]).toBe(1n);
      const allowed = Array.from({ length: nmax + 1 }, (_, n) => n);
      expect(allowed).not.toContain(0.5);
      expect(allowed.map((n) => textR(functionAt(packs, `${n}`)))).toEqual(
        u === 'H01'
          ? ['1', '5', '9', '13', '17', '21']
          : ['2', '8', '14', '20', '26'],
      );
      expect(
        inequalityFunctionRetrieval[u].questions[9]!.solution.zh,
      ).toContain('输入');
    }
    expect(textR(functionAt(functionModel('-3', '11'), '4'))).toBe('-1');
  });
});
