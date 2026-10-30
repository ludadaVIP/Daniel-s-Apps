import { describe, it, expect } from 'vitest';
import { exponentialMeaningRetrieval } from './content/exponentialMeaningRetrieval';
import { exponentialLogRecurrence } from './content/exponentialLogRecurrence';
import { exponentialLogRetrieval } from './content/exponentialLogRetrieval';
import { maintenanceSets } from './content/maintenance';
import { curriculum, lessons } from './content';
import { recurrenceLinksFor } from './recurrenceTargets';
import { checkAnswer } from './model';
import { readRational } from './rationalModels';
import { rational, textR, mulR, divR, type Rational } from './algebraModels';
const sets = Object.values(exponentialMeaningRetrieval);
const R = (s: string) => readRational(s.replaceAll('−', '-'))!;
const pow = (b: Rational, n: number): Rational =>
  n < 0
    ? pow(divR(rational(1n), b), -n)
    : rational(b[0] ** BigInt(n), b[1] ** BigInt(n));
const compare = (a: Rational, b: Rational) => a[0] * b[1] - b[0] * a[1];
const row = (s: number, n: number, key: string) =>
  sets[s]!.questions[n - 1]!.contextTable!.rows.find(
    (r) => r[0]!.en === key,
  )![2]!.en;
const scalar = (s: string, k: string) => R(s.split(k + '=')[1]!.split(';')[0]!);
const root = (n: bigint, degree: number) => {
  let v = 0n;
  while (v ** BigInt(degree) < n) v++;
  expect(v ** BigInt(degree)).toBe(n);
  return v;
};
const rootR = (n: Rational, degree: number) =>
  rational(root(n[0], degree), root(n[1], degree));

describe('H03 semantic operations with retained later tasks', () => {
  it('retains twelve old references, adds twelve new and reuses eight references to six existing tasks', () => {
    const refs = exponentialLogRecurrence.flatMap((e) => e.targets);
    expect(refs).toHaveLength(32);
    expect(new Set(refs).size).toBe(28);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const [i, e] of exponentialLogRecurrence.entries()) {
      for (const u of ['H31', 'H35']) {
        expect(e.targets).toContain(
          `${u}-MAINT-EXP-LOG-Q${[1, 2, 3, 4, 5, 3][i]}`,
        );
        expect(e.targets).toContain(`${u}-MAINT-EXPONENTIAL-MEANING-Q${i + 1}`);
      }
      for (const id of e.targets) {
        const set = Object.values(maintenanceSets).find((s) =>
          s.questions.some((q) => q.id === id),
        )!;
        expect(set, id).toBeDefined();
        expect(order.indexOf(set.unit)).toBeGreaterThan(order.indexOf('H03'));
        const link = recurrenceLinksFor(e.sourceLesson)
          .flatMap((g) => g.targets)
          .find((q) => q.id === id)!;
        expect(
          new URL(link.href, 'http://localhost').searchParams.get('question'),
        ).toBe(id);
      }
    }
    for (const s of Object.values(exponentialLogRetrieval))
      expect(s.questions.map((q) => s.bridgeByQuestion[q.id])).toEqual([
        'H03-L01',
        'H03-L02',
        'H03-L06',
        'H03-L04',
        'H03-L05',
      ]);
    for (const i of [3, 4])
      expect(exponentialLogRecurrence[i]!.targets).toEqual(
        expect.arrayContaining([
          'H36-MAINT-ADVANCED-EQUATION-Q2',
          'H38-MAINT-ADVANCED-EQUATION-Q2',
        ]),
      );
  });
  it('independently audits fractional negative bases, nested powers and product powers', () => {
    for (const [i, s] of sets.entries()) {
      const raw = row(i, 1, 'P'),
        b = scalar(raw, 'b'),
        c = scalar(raw, 'c');
      const square = pow(b, -2),
        sixth = pow(square, 3);
      expect(s.questions[0]!.solution.en).toContain(textR(square));
      expect(s.questions[0]!.solution.en).toContain(textR(sixth));
      expect(pow(mulR(b, c), -2)).toEqual(rational(1n));
      expect(pow(b, 1)[0] < 0n).toBe(true);
      for (let n = -5; n <= 5; n++) {
        expect(pow(mulR(b, c), n)).toEqual(mulR(pow(b, n), pow(c, n)));
        for (let m = -3; m <= 3; m++)
          expect(pow(pow(b, n), m)).toEqual(pow(b, n * m));
      }
      expect(s.questions[0]!.solution.en).toContain('0/0');
      expect(s.questions[0]!.stem.en).toContain('ANY nonzero real');
    }
  });
  it('recovers reduced rational roots and reciprocal cubes without floating powers', () => {
    for (const [i, s] of sets.entries()) {
      const a = R(row(i, 2, 'A').match(/^\(([^)]+)\)/)![1]!),
        b = R(row(i, 2, 'B').match(/^\(([^)]+)\)/)![1]!);
      const square = rootR(a, 2),
        fourth = rootR(b, 4),
        value = pow(fourth, -3);
      expect(pow(square, 2)).toEqual(a);
      expect(mulR(pow(fourth, 3), value)).toEqual(rational(1n));
      for (const x of [square, fourth, value])
        expect(s.questions[1]!.solution.en).toContain(textR(x));
      expect(s.questions[1]!.solution.en).toContain('2/4=1/2=0.5');
      expect(s.questions[1]!.solution.en).toContain('irrational REAL');
      expect(exponentialLogRecurrence[1]!.targets).toEqual(
        expect.arrayContaining([
          'H05-MAINT-PYTHAGOREAN-MEANING-Q3',
          'H06-MAINT-PYTHAGOREAN-MEANING-Q3',
          'H36-MAINT-ADVANCED-EQUATION-Q1',
          'H38-MAINT-ADVANCED-EQUATION-Q1',
        ]),
      );
    }
  });
  it('reconstructs full stipulated images, rate recovery, half-step squares and off-window values', () => {
    for (const [i, s] of sets.entries()) {
      const m = row(i, 3, 'G').match(/G\(x\)=(\d+)×\(([\d/]+)\)\^x/)!,
        C = R(m[1]!),
        a = R(m[2]!);
      const at = (x: number) => mulR(C, pow(a, x));
      const values = Array.from({ length: 5 }, (_, k) => at(k));
      expect(s.questions[2]!.solution.en).toContain(
        '{' + values.map(textR).join(',') + '}',
      );
      expect(rootR(divR(at(2), at(0)), 2)).toEqual(a);
      expect(mulR(pow(C, 2), a)).toEqual(rational(i === 0 ? 24n : 54n));
      const q = Number(row(i, 3, 'V').match(/G\((-?\d+)\)/)![1]);
      expect(at(q)).toEqual(R('81/4'));
      expect(compare(at(1), at(0)) > 0n).toBe(i === 0);
      expect(s.questions[2]!.solution.en).toContain('image is(0,∞)');
      expect(s.questions[2]!.solution.en).toContain('never a finite value');
      expect(s.questions[2]!.stem.en).toContain('GENERAL'.toLowerCase());
    }
  });
  it('audits inverse point identities and correctly rounded valid irrational logs', () => {
    for (const [i, s] of sets.entries()) {
      const base = scalar(row(i, 4, 'E/L'), 'b'),
        output = rootR(pow(base, -1), 2);
      expect(output).toEqual(rational(i === 0 ? 2n : 3n));
      expect(s.questions[3]!.solution.en).toContain(
        `Q=(${textR(output)},−1/2)`,
      );
      const [, a, b] = row(i, 4, 'C').match(/log_(\d+)\((\d+)\)/)!;
      const value = Math.log(Number(b)) / Math.log(Number(a));
      expect(value > 0 && value < 1).toBe(true);
      const rounded = Number(value.toFixed(3));
      expect(s.questions[3]!.solution.en).toContain('≈' + rounded);
      expect(Math.pow(Number(a), rounded - 0.0005)).toBeLessThan(Number(b));
      expect(Math.pow(Number(a), rounded + 0.0005)).toBeGreaterThan(Number(b));
      expect(s.questions[3]!.solution.en).toContain('distinct prime factors');
    }
  });
  it('checks below-one change of base and rejects mixed bases and lost negative-input domains', () => {
    for (const [i, s] of sets.entries()) {
      const raw = row(i, 5, 'A/B/C'),
        a = Number(textR(scalar(raw, 'a'))),
        b = Number(textR(scalar(raw, 'b'))),
        c = scalar(raw, 'c');
      const cNumber = Number(c[0]) / Number(c[1]),
        numerator = Math.log(b) / Math.log(cNumber),
        denominator = Math.log(a) / Math.log(cNumber);
      expect(numerator).toBeCloseTo(i === 0 ? -2 : -3, 12);
      expect(denominator).toBeCloseTo(i === 0 ? -3 : -2, 12);
      const value = numerator / denominator;
      expect(value).toBeCloseTo(i === 0 ? 2 / 3 : 3 / 2, 12);
      const wrong = Math.log(b) / Math.log10(a);
      expect(wrong).toBeCloseTo(value * Math.log(10), 12);
      expect(Math.abs(wrong - value)).toBeGreaterThan(0.8);
      expect(s.questions[4]!.stem.en).toContain('ALL nonzero real');
      expect(s.questions[4]!.solution.en).toContain('2logₐ|x|');
      expect(s.questions[4]!.solution.en).toContain('both≠1');
    }
  });
  it('independently separates threshold satisfaction, equality, finite scopes and own-model examples', () => {
    for (const [i, s] of sets.entries()) {
      const raw = row(i, 6, 'M'),
        m = raw.match(/M\(t\)=(\d+)×\(([\d/]+)\)\^t/)!,
        C = R(m[1]!),
        a = R(m[2]!),
        growth = a[0] > a[1];
      const at = (n: number) => mulR(C, pow(a, n));
      const targets = row(i, 6, 'B0/B1/B2/B3');
      for (let k = 0; k < 4; k++) {
        const b = scalar(targets, 'B' + k),
          pass = (n: number) =>
            growth ? compare(at(n), b) >= 0n : compare(at(n), b) <= 0n;
        const first = [0, 1, 2, 3, 4].find(pass)!;
        expect(first).toBe([0, 2, 2, 0][k]);
        const crossing =
          Math.log(Number(b[0] * C[1]) / Number(b[1] * C[0])) /
          Math.log(Number(a[0]) / Number(a[1]));
        if (k === 2) {
          expect(crossing).toBeCloseTo(1.709511291351455, 12);
          expect(crossing.toFixed(1)).toBe('1.7');
          expect([0, 1].filter(pass)).toEqual([]);
          expect([0, 1, 2].filter(pass)).toEqual([2]);
        }
        if (k === 3) {
          expect(crossing).toBeLessThan(0);
          expect(compare(at(0), b)).not.toBe(0n);
        }
      }
      const own = s.questions[5]!.solution.en;
      for (const kind of ['growth', 'decay']) {
        const re = new RegExp(
          kind + '(\\d+)\\((\\d+/\\d+)\\)\\^n to[≥≤](\\d+)',
        );
        const g = own.match(re)!,
          c0 = R(g[1]!),
          rate = R(g[2]!),
          b = R(g[3]!);
        const values = Array.from({ length: 5 }, (_, n) =>
          mulR(c0, pow(rate, n)),
        );
        expect(own).toContain(values.map(textR).join(','));
        expect(
          values
            .map((v, n) => ({
              n,
              yes:
                kind === 'growth' ? compare(v, b) >= 0n : compare(v, b) <= 0n,
            }))
            .filter((v) => v.yes)
            .map((v) => v.n),
        ).toEqual([3, 4]);
      }
      expect(own).toContain('no equality solution on t≥0');
      expect(own).toContain('a^(1/24)');
    }
  });
  it('keeps all twelve cards independently human-reviewed and the formal course denominator stable', () => {
    expect(lessons).toHaveLength(358);
    for (const s of sets) {
      expect(s.questions).toHaveLength(6);
      expect(s.id).not.toContain('-EXP-LOG');
      for (const [i, q] of s.questions.entries()) {
        expect(q.answer.kind).toBe('explain');
        expect(checkAnswer(q.solution.en, q.answer)).toBe(null);
        expect(s.bridgeByQuestion[q.id]).toBe(`H03-L0${i + 1}`);
        expect(q.contextTable!.rows).toHaveLength(3);
        expect(q.stem.zh.length).toBeGreaterThan(120);
        expect(q.stem.en.length).toBeGreaterThan(250);
        expect(q.hints).toHaveLength(2);
      }
    }
  });
});
