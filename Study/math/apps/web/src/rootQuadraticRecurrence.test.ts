import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { rootQuadraticRetrieval } from './content/rootQuadraticRetrieval';
import { rootQuadraticRecurrence } from './content/rootQuadraticRecurrence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import {
  checkRadical,
  squareRoots,
  radicalClass,
  checkRoundedRoot,
  radicalText,
} from './radicalModels';
import {
  solveQuadratic,
  checkRadicalSet,
  parseQuadraticEquation,
  quadraticCandidateAudit,
  feasibleQuadraticRoots,
} from './quadraticModels';
import { equalPolynomial } from './polynomialModels';
import {
  parabolaModel,
  parabolaAt,
  horizontalIntersections,
  intervalExtrema,
} from './parabolaModels';
import { readRational } from './rationalModels';
import { textR } from './algebraModels';
const sets = Object.values(rootQuadraticRetrieval);
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
describe('roots, equations and parabola recurrence', () => {
  it('covers all sixteen J91-J93 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => ['J91', 'J92', 'J93'].includes(l.unit!))
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(16);
    expect(new Set(rootQuadraticRecurrence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of rootQuadraticRecurrence) {
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

  it('checks root counts, principal signs, exact radical operations and every stated real-domain counterexample', () => {
    for (const [u, square, root, prime, expressions] of [
      [
        'H03',
        '16',
        '4',
        '2',
        [
          ['√72−√8', '4√2'],
          ['−√75', '−5√3'],
          ['1/(√3+√2)', '√3−√2'],
          ['√12', '2√3'],
        ],
      ],
      [
        'H04',
        '25',
        '5',
        '3',
        [
          ['√108−√12', '4√3'],
          ['−√50', '−5√2'],
          ['1/(√5−2)', '√5+2'],
          ['√18', '3√2'],
        ],
      ],
    ] as const) {
      expect(squareRoots(square)).toEqual([`-${root}`, root]);
      expect(squareRoots(`-${square}`)).toEqual([]);
      expect(checkRadical(`√(${square})`, root)).toBe(true);
      expect(checkRadical(`−√${square}`, `-${root}`)).toBe(true);
      expect(radicalClass(`√${prime}`)).toBe('irrational');
      expect(radicalClass(`sqrt(-${prime})`)).toBe('not-real');
      expect(rootQuadraticRetrieval[u].questions[0]!.solution.zh).toContain(
        '|a|',
      );
      for (const [from, to] of expressions)
        expect(checkRadical(from, to)).toBe(true);
    }
    expect(squareRoots('0')).toEqual(['0']);
    for (const s of ['√9', '√(1/4)', '1/3', '2/3', '1.7320508075'])
      expect(radicalClass(s)).toBe('rational');
    expect(checkRadical('√1+√1', '√2')).toBe(false);
    expect(checkRadical('sqrt(-1)*sqrt(-1)', '1')).toBe(false);
    expect(checkRadical('1/√0', '0')).toBe(false);
    // The nondivisible residue classes have no square divisible by the prime.
    for (const p of [2, 3])
      for (let r = 1; r < p; r++) expect((r * r) % p).not.toBe(0);
  });
  it('checks integer-square brackets, midpoint decisions, exact versus approximate values and required trailing zeros', () => {
    for (const [u, n, lo, hi, mid, rounded] of [
      ['H03', 2, 141, 142, 1415, '1.41'],
      ['H04', 3, 173, 174, 1735, '1.73'],
    ] as const) {
      expect(lo * lo).toBeLessThan(n * 10000);
      expect(hi * hi).toBeGreaterThan(n * 10000);
      expect(mid * mid).toBeGreaterThan(n * 1000000);
      expect(checkRoundedRoot(rounded, `${n}`, 2)).toBe(true);
      expect(checkRadical(rounded, `√${n}`)).toBe(false);
      expect(rootQuadraticRetrieval[u].questions[2]!.solution.zh).toContain(
        rounded,
      );
    }
    expect(705 ** 2).toBeLessThan(50 * 10000);
    expect(385 ** 2).toBeLessThan(15 * 10000);
    expect(checkRoundedRoot('7.1', '50', 1)).toBe(true);
    expect(checkRoundedRoot('7.0', '50', 1)).toBe(false);
    expect(checkRoundedRoot('3.9', '15', 1)).toBe(true);
    expect(checkRoundedRoot('3.8', '15', 1)).toBe(false);
    expect(checkRoundedRoot('1.00', '1', 2)).toBe(true);
    expect(checkRoundedRoot('1', '1', 2)).toBe(false);
    expect(checkRadical('√(25/16)', '1.25')).toBe(true);
  });
  it('checks cancellation kinds, complete zero-product branches, signed completing squares and negative-a formulas', () => {
    for (const source of ['x^2+3=x^2', 'x^2-4=x^2'])
      expect(parseQuadraticEquation(source)!.kind).toBe('contradiction');
    for (const source of ['x^2+3=x^2+3', 'x^2-4=x^2-4'])
      expect(solveQuadratic(source).kind).toBe('identity');
    for (const [source, roots] of [
      ['x(x-5)=0', ['0', '5']],
      ['x(x+4)=0', ['-4', '0']],
      ['x^2+8x=9', ['-9', '1']],
      ['x^2-6x=7', ['-1', '7']],
      ['-2x^2+4x+6=0', ['-1', '3']],
      ['-3x^2-6x+9=0', ['-3', '1']],
    ] as const) {
      const actual = solveQuadratic(source).roots!.map(radicalText);
      expect(new Set(actual)).toEqual(new Set(roots));
      for (const root of actual)
        expect(quadraticCandidateAudit(source, root)!.equationPass).toBe(true);
    }
    expect(equalPolynomial('x^2+8x+16', '(x+4)^2')).toBe(true);
    expect(equalPolynomial('x^2-6x+9', '(x-3)^2')).toBe(true);
    // Verify the denominator-free derivation identity for both signs of a,
    // including zero/positive/negative discriminants; no widening to a three-variable parser.
    for (const a of [-3, -2, 1, 2])
      for (const b of [-6, 0, 4])
        for (const c of [-3, 0, 5]) {
          const delta = b * b - 4 * a * c;
          expect(
            equalPolynomial(
              `4*(${a})*((${a})x^2+(${b})x+(${c}))`,
              `(2*(${a})x+(${b}))^2-(${delta})`,
            ),
          ).toBe(true);
          expect(Math.sqrt(4 * a * a)).toBe(2 * Math.abs(a));
        }
  });
  it('checks distinct discriminant counts, off-window roots, degree loss and actual card-domain infeasibility', () => {
    for (const [source, delta, roots] of [
      ['(x-9)(x-11)=0', '4', ['9', '11']],
      ['x^2-6x+9=0', '0', ['3']],
      ['x^2+4=0', '-16', []],
      ['(x+7)(x+10)=0', '9', ['-10', '-7']],
      ['x^2+8x+16=0', '0', ['-4']],
      ['x^2+9=0', '-36', []],
    ] as const) {
      const s = solveQuadratic(source);
      expect(textR(s.discriminant!)).toBe(delta);
      expect(new Set(s.roots!.map(radicalText))).toEqual(new Set(roots));
    }
    for (const source of ['2x-6=0', '-3x+6=0']) {
      const s = solveQuadratic(source);
      expect(s.kind).toBe('linear');
      expect(s.roots).toHaveLength(1);
    }
    expect(solveQuadratic('0=0').roots).toBeNull();
    expect(solveQuadratic('5=0').roots).toEqual([]);
    for (const [u, source, positive] of [
      ['H03', '2x^2=7', '√14/2'],
      ['H04', '3x^2=8', '2√6/3'],
    ] as const) {
      expect(solveQuadratic(source).roots).toHaveLength(2);
      expect(feasibleQuadraticRoots(source, 'whole')).toEqual([]);
      expect(quadraticCandidateAudit(source, positive, 'whole')).toMatchObject({
        equationPass: true,
        contextPass: false,
      });
      for (const x of ['1', '2'])
        expect(quadraticCandidateAudit(source, x, 'whole')).toMatchObject({
          equationPass: false,
          contextPass: true,
        });
      expect(rootQuadraticRetrieval[u].questions[5]!.solution.zh).toContain(
        '非负整数',
      );
    }
  });
  it('checks signed vertices, arbitrary symmetry identities, nonconstant rates, form equivalence and exact horizontal intersections', () => {
    for (const [
      u,
      source,
      h,
      k,
      opening,
      ys,
      forms,
      intercept,
      curve,
      level,
      positive,
      approx,
    ] of [
      [
        'H03',
        '2(x-3)^2-2',
        '3',
        '-2',
        'up',
        ['-2', '0', '6'],
        ['x^2-6x+8', '(x-3)^2-1', '(x-2)(x-4)'],
        '8',
        'x^2',
        '3',
        '√3',
        '1.73',
      ],
      [
        'H04',
        '-3(x+2)^2+5',
        '-2',
        '5',
        'down',
        ['5', '2', '-7'],
        ['2x^2+4x-6', '2(x+1)^2-8', '2(x+3)(x-1)'],
        '-6',
        '2x^2',
        '5',
        '√10/2',
        '1.58',
      ],
    ] as const) {
      const model = parabolaModel(source);
      expect(model.opening).toBe(opening);
      expect([textR(model.vertex!.x), textR(model.vertex!.y)]).toEqual([h, k]);
      expect(
        [0, 1, 2].map((d) =>
          textR(parabolaAt(source, readRational(`${Number(h) + d}`))),
        ),
      ).toEqual(ys);
      for (const form of forms)
        expect(equalPolynomial(form, forms[0])).toBe(true);
      expect(textR(parabolaAt(forms[0], readRational('0')))).toBe(intercept);
      expect(equalPolynomial(`2(${forms[0]})`, forms[0])).toBe(false);
      const intersections = horizontalIntersections(curve, level);
      expect(intersections.roots).toHaveLength(2);
      expect(
        checkRadicalSet(
          `{${positive},-(${positive})}`,
          intersections.roots!.map(radicalText),
        ),
      ).toBe(true);
      expect(
        quadraticCandidateAudit(`${curve}=${level}`, positive)!.equationPass,
      ).toBe(true);
      expect(
        quadraticCandidateAudit(`${curve}=${level}`, approx)!.equationPass,
      ).toBe(false);
      expect(rootQuadraticRetrieval[u].questions[8]!.solution.zh).toContain(
        ',0)',
      );
    }
    expect(equalPolynomial('(-d)^2', 'd^2', ['d'])).toBe(true);
    expect(parabolaModel('0x^2-2').vertex).toBeNull();
    expect(parabolaModel('0x^2+5').opening).toBe('not-quadratic');
  });
  it('checks perimeter-derived full and restricted maxima and the all-input square bound', () => {
    for (const [u, side, center, full, lo, hi, wanted, length] of [
      ['H03', 12, 6, 36, 1, 5, 35, 7],
      ['H04', 14, 7, 49, 2, 6, 48, 8],
    ] as const) {
      const source = `x(${side}-x)`;
      expect(equalPolynomial(source, `${full}-(x-${center})^2`)).toBe(true);
      expect(side * 2).toBe(u === 'H03' ? 24 : 28);
      expect(textR(parabolaModel(source).vertex!.y)).toBe(`${full}`);
      const result = intervalExtrema(source, `${lo}`, `${hi}`);
      expect(textR(result.maximum.value)).toBe(`${wanted}`);
      expect(result.maximum.inputs.map(textR)).toEqual([`${hi}`]);
      expect(side - hi).toBe(length);
      expect(hi * length).toBe(wanted);
      // For arbitrary feasible x<=hi=center−1, centre−x>=1,
      // so (centre−x)^2>=1 and A<=full−1; verify its symbolic area identity above.
      expect(center - hi).toBe(1);
      expect(full - 1).toBe(wanted);
      expect(rootQuadraticRetrieval[u].questions[9]!.solution.zh).toContain(
        `${wanted}cm²`,
      );
    }
  });
});
