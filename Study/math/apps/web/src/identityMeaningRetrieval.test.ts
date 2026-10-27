import { describe, expect, it } from 'vitest';
import { identityMeaningRetrieval } from './content/identityMeaningRetrieval';
import { polynomialSystemRetrieval } from './content/polynomialSystemRetrieval';
import { polynomialMeaningRetrieval } from './content/polynomialMeaningRetrieval';
import { polynomialSystemRecurrence } from './content/polynomialSystemRecurrence';
import { maintenanceSets } from './content/maintenance';
import { lessons } from './content';
import { checkAnswer } from './model';
import { productGrid } from './identityModels';
import { equalPolynomial } from './polynomialModels';

const sets = Object.values(identityMeaningRetrieval);
const raw = (s: number, q: number, id: string) =>
  sets[s]!.questions[q - 1]!.contextTable!.rows.find(
    (r) => r[0]!.en === id,
  )![2]!.en;
const math = (s: string) => s.replaceAll('−', '-').replaceAll('²', '^2');
const same = (left: string, right: string, variables = ['x', 'y']) =>
  expect(
    equalPolynomial(math(left), math(right), variables),
    `${left} = ${right}`,
  ).toBe(true);

describe('J81 complete products and whole identities', () => {
  it('preserves twelve old references/eight tasks and adds shared gaps plus four valid reused tasks', () => {
    const entries = polynomialSystemRecurrence.filter((e) =>
      e.sourceLesson.startsWith('J81-'),
    );
    const refs = entries.flatMap((e) => e.targets);
    expect(refs).toHaveLength(28);
    expect(new Set(refs).size).toBe(18);
    expect(
      refs.filter((id) => id.includes('-MAINT-POLY-SYSTEM-')),
    ).toHaveLength(12);
    expect(entries[1]!.targets).toContain('J83-MAINT-POLYNOMIAL-MEANING-Q3');
    expect(entries[1]!.targets).toContain('J84-MAINT-POLYNOMIAL-MEANING-Q3');
    expect(entries[2]!.targets).toContain('J83-MAINT-POLYNOMIAL-MEANING-Q4');
    expect(entries[2]!.targets).toContain('J84-MAINT-POLYNOMIAL-MEANING-Q4');
    for (const s of sets) {
      expect(Object.values(maintenanceSets).find((m) => m.id === s.id)).toBe(s);
      expect(polynomialSystemRetrieval[s.unit].questions).toHaveLength(10);
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual([
        'J81-L02',
        'J81-L03',
        'J81-L04',
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
  it('independently computes all three fractional monomial products from the given original rows', () => {
    const cases = [
      {
        i: 0,
        F: '−(3/4)x',
        I: '2x−4y+6',
        columns: ['2x', '-4y', '6'],
        cells: ['-(3/2)x^2', '3xy', '-(9/2)x'],
        sum: '−(3/2)x²+3xy−(9/2)x',
      },
      {
        i: 1,
        F: '−(2/3)y',
        I: '3x−2y+5',
        columns: ['3x', '-2y', '5'],
        cells: ['-2xy', '(4/3)y^2', '-(10/3)y'],
        sum: '−2xy+(4/3)y²−(10/3)y',
      },
    ];
    for (const c of cases) {
      expect(raw(c.i, 1, 'F')).toBe(c.F);
      expect(raw(c.i, 1, 'I')).toBe(c.I);
      const grid = productGrid([math(c.F)], c.columns, ['x', 'y']);
      expect(grid.cells).toHaveLength(3);
      grid.cells.forEach((cell, i) => same(cell.text, c.cells[i]!));
      same(`(${c.F})(${c.I})`, c.sum);
      expect(sets[c.i]!.questions[0]!.solution.en).toContain(c.sum);
      same(`-(${c.F})(${c.I})`, `-(${c.sum})`);
    }
  });
  it('distinguishes an entire zero factor from only a zero inside variable without variable division', () => {
    same('0(2x-4y+6)', '0');
    same('0(3x-2y+5)', '0');
    same('-(3/4)x(2x+6)', '-(3/2)x^2-(9/2)x');
    same('-(2/3)y(-2y+5)', '(4/3)y^2-(10/3)y');
    expect(-(3 / 4) * 2 * (2 * 2 + 6)).toBe(-15);
    expect(-(2 / 3) * 3 * (-2 * 3 + 5)).toBe(2);
    expect(equalPolynomial('2x+3x', '6x^2')).toBe(false);
    expect(equalPolynomial('2x+3x', '5x')).toBe(true);
  });
  it('retains every distinct source in each two-by-three signed table and then collects like terms', () => {
    for (const c of [
      {
        i: 0,
        rows: ['x', '2y'],
        cols: ['x', '-y', '3'],
        variables: ['x', 'y'],
        cells: ['x^2', '-xy', '3x', '2xy', '-2y^2', '6y'],
        sum: 'x²+xy−2y²+3x+6y',
      },
      {
        i: 1,
        rows: ['2a', 'b'],
        cols: ['a', '-3b', '2'],
        variables: ['a', 'b'],
        cells: ['2a^2', '-6ab', '4a', 'ab', '-3b^2', '2b'],
        sum: '2a²−5ab−3b²+4a+2b',
      },
    ]) {
      const grid = productGrid(c.rows, c.cols, c.variables);
      expect(grid.cells.map((cell) => cell.id)).toEqual([
        '0-0',
        '0-1',
        '0-2',
        '1-0',
        '1-1',
        '1-2',
      ]);
      grid.cells.forEach((cell, i) =>
        same(cell.text, c.cells[i]!, c.variables),
      );
      same(raw(c.i, 2, 'G'), c.sum, c.variables);
      expect(sets[c.i]!.questions[1]!.solution.en).toContain(c.sum);
      same(grid.result, c.sum, c.variables);
    }
  });
  it('accepts all nine permitted independent garden constructions with one scale and four nonoverlapping areas', () => {
    for (let p = 1; p <= 3; p++)
      for (let q = 1; q <= 3; q++) {
        same(`(n+${p})(n+${q})`, `n^2+${p + q}n+${p * q}`, ['n']);
        const pieces = [4, 2 * p, 2 * q, p * q];
        expect(pieces.every((area) => area > 0)).toBe(true);
        expect(pieces.reduce((a, b) => a + b, 0)).toBe((2 + p) * (2 + q));
      }
    for (const s of sets)
      expect(s.questions[1]!.solution.en).toContain('Accept ANY chosen p/q');
  });
  it('derives both squares and the conjugate using the entire fractional coefficient, denominator and base', () => {
    same('(a+b)^2', 'a^2+2ab+b^2', ['a', 'b']);
    same('(a-b)^2', 'a^2-2ab+b^2', ['a', 'b']);
    same('(a+b)(a-b)', 'a^2-b^2', ['a', 'b']);
    for (const c of [
      {
        i: 0,
        A: '(1/2)x',
        B: 3,
        variables: ['x'],
        plus: '(1/4)x²+3x+9',
        minus: '(1/4)x²−3x+9',
        conj: '(1/4)x²−9',
      },
      {
        i: 1,
        A: '(2/3)t',
        B: 2,
        variables: ['t'],
        plus: '(4/9)t²+(8/3)t+4',
        minus: '(4/9)t²−(8/3)t+4',
        conj: '(4/9)t²−4',
      },
    ]) {
      expect(raw(c.i, 3, 'A/B')).toBe(`A=${c.A}; B=${c.B}`);
      same(`(${c.A}+${c.B})^2`, c.plus, c.variables);
      same(`(${c.A}-${c.B})^2`, c.minus, c.variables);
      same(`(${c.A}+${c.B})(${c.A}-${c.B})`, c.conj, c.variables);
      for (const answer of [c.plus, c.minus, c.conj])
        expect(sets[c.i]!.questions[2]!.solution.en).toContain(answer);
      for (const a of [0, 1, 3]) {
        expect((a + c.B) ** 2).toBe(a * a + 2 * a * c.B + c.B * c.B);
        expect((a - c.B) ** 2).toBe(a * a - 2 * a * c.B + c.B * c.B);
      }
    }
  });
  it('checks the nonconjugate counterexample and exact centred integer products rather than finite-test certification', () => {
    same('(a+b)(2a-b)', '2a^2+ab-b^2', ['a', 'b']);
    expect(equalPolynomial('(a+b)(2a-b)', 'a^2-b^2', ['a', 'b'])).toBe(false);
    same('((1/2)x+3)(x-3)', '(1/2)x^2+(3/2)x-9', ['x']);
    same('((2/3)t+2)((4/3)t-2)', '(8/9)t^2+(4/3)t-4', ['t']);
    for (const B of [3, 2]) {
      expect((0 + B) * (0 - B)).toBe(-B * B);
      expect((1 + B) * (2 - B)).not.toBe((1 + B) * (1 - B));
    }
    for (const [i, centre, offset, result] of [
      [0, 50, 1, 2499],
      [1, 200, 2, 39996],
    ]) {
      expect(raw(i!, 3, 'K')).toBe(`${centre! - offset!}×${centre! + offset!}`);
      expect((centre! - offset!) * (centre! + offset!)).toBe(result);
      expect(centre! ** 2 - offset! ** 2).toBe(result);
      expect(sets[i!]!.questions[2]!.solution.en).toContain(`=${result}`);
    }
  });
  it('reuses actual fractional distribution and contextual perimeter tasks without changing their questions', () => {
    for (const [i, u] of ['J83', 'J84'].entries()) {
      const reused = Object.values(polynomialMeaningRetrieval).find(
        (s) => s.unit === u,
      )!;
      expect(reused.questions).toHaveLength(4);
      expect(
        reused.questions[2]!.contextTable!.rows.some((r) => r[0]!.en === 'I'),
      ).toBe(true);
      const offset = i === 0 ? 3 : 4,
        n = i === 0 ? 0.5 : 1.5;
      expect(2 * (n + n + offset)).toBe(i === 0 ? 8 : 14);
      expect(n * (n + offset)).toBe(i === 0 ? 7 / 4 : 33 / 4);
      expect(reused.questions[3]!.solution.en).toContain(
        `perimeter=4n+${offset * 2}`,
      );
    }
  });
});
