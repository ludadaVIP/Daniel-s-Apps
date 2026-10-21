import { describe, it, expect } from 'vitest';
import {
  compositionAudit,
  logEquationAudit,
  identityAudit,
  parameterAudit,
  solutionAudit,
} from './advancedEquationModels';
import { checkAnswer } from './model';
import { readRational } from './rationalModels';

describe('H35 exact domains, branches and candidate audits', () => {
  it('checks all square branches and preimages by independent substitution', () => {
    for (let s = -3; s <= 3; s++)
      for (const branch of ['right', 'left', 'whole'] as const)
        for (let x = -5; x <= 5; x++) {
          const m = compositionAudit(s, branch, x),
            u = x + s;
          const allowed = (v: number) =>
            branch === 'whole' || (branch === 'right' ? v >= 0 : v <= 0);
          expect(m.output).toBe(allowed(u) ? u * u : null);
          expect(m.reverse).toBe(allowed(x) ? x * x + s : null);
          for (let root = 0; root <= 8; root++) {
            const expected = [];
            for (let z = -11; z <= 11; z++)
              if (allowed(z + s) && (z + s) ** 2 === root * root)
                expected.push(z);
            expect(m.inverseCandidates(root * root)).toEqual(expected);
          }
          expect(m.invertible).toBe(branch !== 'whole');
        }
  });
  it('checks rational exponential and logarithmic roots against original functions and individual arguments', () => {
    for (let b = 2; b <= 4; b++)
      for (let h = -3; h <= 3; h++)
        for (let k = -3; k <= 4; k++)
          for (const kind of ['exponential', 'logarithm'] as const) {
            const m = logEquationAudit(kind, b, h, k),
              r = readRational(m.solutions[0]!),
              x = Number(r[0]) / Number(r[1]);
            expect(m.lhs(x)).toBeCloseTo(m.rhs, 8);
            expect(x).toBeCloseTo(
              kind === 'exponential' ? h + k : h + b ** k,
              12,
            );
            if (kind === 'logarithm') {
              expect(x).toBeGreaterThan(h);
              expect(m.lhs(h)).toBeNull();
            }
          }
    for (const [h, k, r] of [
      [1, 3, 3],
      [3, 4, 5],
    ]) {
      const m = logEquationAudit('product', 2, h!, k!);
      expect(m.candidates).toEqual([String(-r!), String(r)]);
      expect(m.solutions).toEqual([String(r)]);
      expect(m.lhs(-r!)).toBeNull();
      expect(Math.log2(r! - h!) + Math.log2(r! + h!)).toBe(k);
    }
  });
  it('keeps holes at exact special angles and enforces the requested symbolic representation', () => {
    expect(identityAudit('quotient', '0').hole).toBe(true);
    expect(identityAudit('quotient', '2').hole).toBe(true);
    expect(identityAudit('quotient', '1/6').hole).toBe(false);
    expect(identityAudit('tangent', '1/2').hole).toBe(true);
    expect(identityAudit('tangent', '3/2').hole).toBe(true);
    expect(identityAudit('sine-division', '1').hole).toBe(true);
    const spec = {
      kind: 'trig-identity' as const,
      value: '1+c',
      only: 'c' as const,
    };
    expect(checkAnswer('c+1', spec)).toBe(true);
    expect(checkAnswer('1+c+(s^2+c^2-1)', spec)).toBe(false);
    expect(checkAnswer('1-c', spec)).toBe(false);
    expect(
      checkAnswer('0,2pi', {
        kind: 'radian-set',
        values: ['0', '2'],
        value: '0,2pi',
      }),
    ).toBe(true);
    expect(
      checkAnswer('0', {
        kind: 'radian-set',
        values: ['0', '2'],
        value: '0,2pi',
      }),
    ).toBe(false);
  });
  it('checks point mappings and expanded polynomials against the unexpanded source, including zero parameters', () => {
    for (let a = -2; a <= 2; a++)
      for (let b = -2; b <= 2; b++)
        for (let h = -2; h <= 2; h++)
          for (let k = -2; k <= 2; k++)
            for (let u = -2; u <= 2; u++) {
              const m = parameterAudit(a, b, h, k, u);
              for (const x of [-2, 0, 1, 2]) {
                const input = b * (x - h),
                  original = a * (input * input + input) + k;
                expect(m.exactValue(x)).toBe(String(original));
                expect(m.value(x)).toBe(original);
              }
              if (b) {
                const r = readRational(m.x!),
                  x = Number(r[0]) / Number(r[1]);
                expect(b * (x - h) === u).toBe(true);
                expect(m.value(x) === Number(m.y)).toBe(true);
              } else {
                expect(m.x).toBeNull();
                expect(m.preimageCode).toBe(
                  u === 0 ? 'undetermined' : 'outside-domain',
                );
              }
              expect(m.constant).toBe(a === 0 || b === 0);
            }
    expect(
      checkAnswer('8x^2-12x+3', {
        kind: 'polynomial',
        value: parameterAudit(2, 2, 1, -1, 1).expression,
        variables: ['x'],
        collected: true,
      }),
    ).toBe(true);
    expect(
      checkAnswer('2*(4*(x-1)^2+2*(x-1))-1', {
        kind: 'polynomial',
        value: '8x^2-12x+3',
        variables: ['x'],
        collected: true,
      }),
    ).toBe(false);
  });
  it('separates an in-domain sign failure from an excluded hole and verifies every candidate in the original equation', () => {
    for (const h of [2, 6]) {
      const m = solutionAudit('radical', h, 0);
      expect(m.rows[0]!.domain).toBe(true);
      expect(m.rows[0]!.sign).toBe(false);
      expect(m.rows[0]!.valid).toBe(false);
      expect(m.solutions).toEqual([h === 2 ? 2 : 3]);
    }
    for (let r = 1; r <= 3; r++)
      for (let y = 0; y <= 8; y++) {
        const m = solutionAudit('rational', r, y);
        expect(m.solutions).toEqual(y === 2 * r ? [] : [y - r]);
        if (y === 2 * r) expect(m.rows[0]!.left).toBeNull();
      }
    for (let h = -3; h <= 3; h++)
      for (let k = -2; k <= 3; k++) {
        const m = solutionAudit('absolute', h, k),
          brute = [];
        for (let x = -10; x <= 10; x++)
          if (Math.abs(x - h) === k) brute.push(x);
        expect(m.solutions).toEqual(brute);
      }
    for (let a = 1; a <= 4; a++)
      expect(solutionAudit('product', a, 0).solutions).toEqual([0, a]);
  });
  it('rejects missing or extra roots and distinguishes zero from an empty solution set', () => {
    const s = { kind: 'finite-set' as const, value: '{0,3}' };
    expect(checkAnswer('{3,0}', s)).toBe(true);
    expect(checkAnswer('{3}', s)).toBe(false);
    expect(checkAnswer('{0,3,4}', s)).toBe(false);
    expect(checkAnswer('∅', { kind: 'finite-set', value: '{}' })).toBe(true);
    expect(checkAnswer('{0}', { kind: 'finite-set', value: '{}' })).toBe(false);
    expect(checkAnswer('x>=-1', { kind: 'real-union', value: '[-1,∞)' })).toBe(
      true,
    );
    expect(checkAnswer('(-1,∞)', { kind: 'real-union', value: '[-1,∞)' })).toBe(
      false,
    );
  });
  it('rejects unsupported models and invalid parameter bounds', () => {
    for (const action of [
      () => compositionAudit(4, 'right', 1),
      () => compositionAudit(0, 'bad' as never, 0),
      () => compositionAudit(0, 'whole', 0).inverseCandidates(2),
      () => logEquationAudit('exponential', 1, 0, 1),
      () => logEquationAudit('product', 2, 2, 4),
      () => identityAudit('bad' as never, '0'),
      () => parameterAudit(1, 0, 0, 4, 1),
      () => parameterAudit(1, 1, 0, 0, 1).exactValue(1.5),
      () => solutionAudit('radical', 3, 0),
      () => solutionAudit('product', 2, 1),
    ])
      expect(action).toThrow();
  });
});
