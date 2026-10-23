import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { functionAnalysisRetrieval } from './content/functionAnalysisRetrieval';
import { functionAnalysisRecurrence } from './content/functionAnalysisRecurrence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import {
  calculusPolynomial,
  differentiate,
  valueAt,
  derivativeText,
  tangentModel,
  cornerModel,
} from './calculusModels';
import { equalPolynomial } from './polynomialModels';
import { textR } from './algebraModels';
import { readRational as R } from './rationalModels';
const sets = Object.values(functionAnalysisRetrieval);
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
describe('function analysis recurrence', () => {
  it('covers all five H26 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => l.unit === 'H26')
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(5);
    expect(new Set(functionAnalysisRecurrence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of functionAnalysisRecurrence) {
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
  it('keeps eight bilingual derivations human-reviewed and outside canonical checks', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(8);
    for (const s of sets) {
      expect(s.questions).toHaveLength(4);
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

  it('checks both actual separated branch figures,domain exclusions and global-order counterexamples', () => {
    for (const [key, c] of [
      ['H32_ANALYSIS', 2],
      ['H35_ANALYSIS', -1],
    ] as const) {
      const d = functionAnalysisRetrieval[key].questions[0]!.diagram!;
      if (d.kind !== 'cartesian') throw Error('Need given branch plot');
      expect(d.curves).toHaveLength(3);
      const branches = d.curves!.slice(0, 2);
      for (const [i, branch] of branches.entries()) {
        expect(branch.points).toHaveLength(61);
        for (const p of branch.points) {
          expect(i === 0 ? p.x < c : p.x > c).toBe(true);
          expect(p.y).toBeCloseTo(-1 / (p.x - c), 12);
        }
        expect(
          branch.points.every((p, i, all) => i === 0 || p.y > all[i - 1]!.y),
        ).toBe(true);
      }
      expect(d.curves![2]!.dash).toBeTruthy();
      expect(d.curves![2]!.points.every((p) => p.x === c)).toBe(true);
      const f = (x: number) => -1 / (x - c);
      expect(c - 1).toBeLessThan(c + 1);
      expect(f(c - 1)).toBeGreaterThan(f(c + 1));
      expect(f(c + 1)).toBeLessThan(f(c + 2));
      expect(f(c + 2)).toBeLessThan(0);
    }
    expect(equalPolynomial('(-u)+(u+h)', 'h', ['u', 'h'])).toBe(true);
  });
  it('checks complete closed-interval candidate values,ties and factored derivative identities', () => {
    for (const [raw, candidates, values, factor] of [
      ['x^3-12x', [-4, -2, 2, 4], ['-16', '16', '-16', '16'], '3(x-2)(x+2)'],
      ['x^3-3x', [-3, -1, 1, 2], ['-18', '2', '-2', '2'], '3(x-1)(x+1)'],
    ] as const) {
      const p = calculusPolynomial(raw);
      expect(candidates.map((x) => textR(valueAt(p, R(String(x)))))).toEqual(
        values,
      );
      expect(equalPolynomial(derivativeText(raw), factor)).toBe(true);
      const d = differentiate(p);
      expect(valueAt(d, R(String(candidates[1])))).toEqual(R('0'));
      expect(valueAt(d, R(String(candidates[2])))).toEqual(R('0'));
    }
    expect(tangentModel('x^3', '0').slope).toEqual(R('0'));
    expect(cornerModel('0', '1/10').derivative).toBeNull();
  });
  it('checks both product-rule identities against independent expansion and separates all three point quantities', () => {
    for (const [u, v, expanded, derivative, product, rate, wrong] of [
      ['x^2-1', 'x+2', 'x^3+2x^2-x-2', '3x^2+4x-1', '0', '6', '2'],
      ['x^2+2', '2x-1', '2x^3-x^2+4x-2', '6x^2-2x+4', '3', '8', '4'],
    ] as const) {
      expect(equalPolynomial(`(${u})(${v})`, expanded)).toBe(true);
      expect(
        equalPolynomial(
          `(${derivativeText(u)})(${v})+(${u})(${derivativeText(v)})`,
          derivative,
        ),
      ).toBe(true);
      expect(equalPolynomial(derivativeText(expanded), derivative)).toBe(true);
      expect(textR(valueAt(calculusPolynomial(expanded), R('1')))).toBe(
        product,
      );
      expect(textR(valueAt(calculusPolynomial(derivative), R('1')))).toBe(rate);
      expect(
        textR(
          valueAt(
            calculusPolynomial(`(${derivativeText(u)})(${derivativeText(v)})`),
            R('1'),
          ),
        ),
      ).toBe(wrong);
    }
  });
  it('reuses actual human-reviewed composite-exponential and moving-upper-limit exits,and independently checks the inner factor in a polynomial accumulation', () => {
    const e = functionAnalysisRecurrence.find((e) => e.skill === 'analysis-4')!;
    expect(e.targets).toEqual(['H31-L01-X', 'H32-L05-X']);
    for (const id of e.targets) {
      const q = tasks.get(id)!.q;
      expect(q.answer.kind).toBe('explain');
      expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
    }
    expect(equalPolynomial(derivativeText('(2x)^3/3'), '2(2x)^2')).toBe(true);
    expect(equalPolynomial(derivativeText('(2x)^3/3'), '(2x)^2')).toBe(false);
  });
  it('checks all area/side/rate quantities,the negative rate and zero-velocity nonreversal within the model ranges', () => {
    for (const [side, area, rate, sideValue, areaValue, rateValue] of [
      ['2+3x', '(2+3x)^2', '6(2+3x)', '5', '25', '30'],
      ['4-x', '(4-x)^2', '-2(4-x)', '3', '9', '-6'],
    ] as const) {
      expect(equalPolynomial(derivativeText(area), rate)).toBe(true);
      expect(
        [side, area, rate].map((raw) =>
          textR(valueAt(calculusPolynomial(raw), R('1'))),
        ),
      ).toEqual([sideValue, areaValue, rateValue]);
    }
    const p = calculusPolynomial('(x-1)^3'),
      d = differentiate(p);
    expect([0, 1, 2].map((x) => textR(valueAt(p, R(String(x)))))).toEqual([
      '-1',
      '0',
      '1',
    ]);
    expect([0, 1, 2].map((x) => textR(valueAt(d, R(String(x)))))).toEqual([
      '3',
      '0',
      '3',
    ]);
  });
});
