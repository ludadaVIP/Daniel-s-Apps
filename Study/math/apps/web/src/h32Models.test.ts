import { describe, it, expect } from 'vitest';
import {
  stepAccumulation,
  riemannAudit,
  uniformPartition,
  integralAudit,
  checkIntegralPrimitive,
  ftcAudit,
  applicationAudit,
  integralPolynomial,
  antiderivativePolynomial,
  polynomialIntegral,
  integralCases,
  type IntegralFamily,
} from './integralModels';
import { rational, textR, sameR } from './algebraModels';
import { compareR } from './inequalityModels';
import { valueAt, differentiate } from './calculusModels';
const R = (n: number, d = 1) => rational(BigInt(n), BigInt(d));
describe('H32 exact accumulation, integration and theorem conditions', () => {
  it('weights actual elapsed durations and keeps zero-duration average undefined', () => {
    for (let q = 0; q <= 8; q++)
      for (let r = 0; r <= 8; r++)
        for (let half = 0; half <= 8; half++) {
          const t = half / 2,
            m = stepAccumulation(`${half}/2`, [q, r, 1]),
            amount =
              q * Math.min(t, 1) +
              r * Math.max(0, Math.min(t - 1, 2)) +
              Math.max(0, t - 3);
          expect(sameR(m.amount, R(amount * 2, 2))).toBe(true);
          expect(m.average === null).toBe(half === 0);
        }
    expect(textR(stepAccumulation('5/2').amount)).toBe('8');
    expect(textR(stepAccumulation('4').average!)).toBe('11/4');
    expect(stepAccumulation('1').leftRate).toEqual(R(2));
    expect(stepAccumulation('1').current).toEqual(R(4));
    for (const t of ['-1', '5', 'NaN'])
      expect(() => stepAccumulation(t)).toThrow();
  });
  it('independently checks equal-cell formulas, nonuniform products and Darboux bounds', () => {
    for (let n = 1; n <= 32; n++)
      for (const tag of ['left', 'middle', 'right'] as const) {
        const m = riemannAudit('square', uniformPartition('0', '2', n), tag),
          s =
            tag === 'middle'
              ? R(2 * (4 * n * n - 1), 3 * n * n)
              : tag === 'left'
                ? R(4 * (n - 1) * (2 * n - 1), 3 * n * n)
                : R(4 * (n + 1) * (2 * n + 1), 3 * n * n);
        expect(sameR(m.sum, s)).toBe(true);
        expect(sameR(m.mesh, R(2, n))).toBe(true);
        expect(compareR(m.lower, m.exact)).toBeLessThanOrEqual(0);
        expect(compareR(m.exact, m.upper)).toBeLessThanOrEqual(0);
      }
    const m = riemannAudit('square', ['0', '1/4', '1', '2'], 'middle');
    expect(m.cells.map((c) => textR(c.product))).toEqual([
      '1/256',
      '75/256',
      '9/4',
    ]);
    expect(textR(m.sum)).toBe('163/64');
    expect(textR(m.mesh)).toBe('1');
    expect(textR(riemannAudit('shiftSquare', ['0', '2'], 'left').lower)).toBe(
      '0',
    );
    expect(
      riemannAudit('arch', uniformPartition('0', '2', 4), 'middle').error[0],
    ).toBeGreaterThan(0n);
    expect(
      riemannAudit('line', uniformPartition('0', '2', 7), 'middle').error[0],
    ).toBe(0n);
    for (const edges of [['1', '0'], ['0', '0'], ['0'], ['0', '13']])
      expect(() => riemannAudit('square', edges, 'middle')).toThrow();
  });
  it('checks derivative identities globally, full affine-constant coverage and initial values separately', () => {
    for (const v of ['x^3-4x+C', 'x*(x*x-4)-C', 'x^3-4x+2C+5', 'x^3-4x+C/2'])
      expect(checkIntegralPrimitive(v, '3x^2-4', true), v).toBe(true);
    for (const v of [
      'x^3-4x',
      'x^3-4x+C^2',
      'x^3-4x+C*x',
      'x^3-4x+C^3',
      'x^3-4x+0C',
      'x^3-4x+C/0',
      'x^3-4x+C+x*(x-1)*(x+1)',
      'NaN',
    ])
      expect(checkIntegralPrimitive(v, '3x^2-4', true), v).toBe(false);
    for (const c of [-7, 0, 8])
      expect(checkIntegralPrimitive(`x^2+${c}`, '2x', false)).toBe(true);
    expect(checkIntegralPrimitive('x^2+C', '2x', false)).toBe(false);
    expect(
      checkIntegralPrimitive('x^2+5', '2x', false, { x: '0', value: '5' }),
    ).toBe(true);
    expect(
      checkIntegralPrimitive('x^2+7', '2x', false, { x: '0', value: '5' }),
    ).toBe(false);
    expect(checkIntegralPrimitive('C', '0', true)).toBe(true);
    expect(checkIntegralPrimitive('8', '0', false)).toBe(true);
    for (let a = -5; a <= 5; a++)
      for (let b = -5; b <= 5; b++) {
        const p = integralPolynomial(`${a}x^2+${b}x+1`),
          F = antiderivativePolynomial(p),
          d = differentiate(F);
        expect([...p].every(([k, c]) => d.has(k) && sameR(c, d.get(k)!))).toBe(
          true,
        );
        for (let x = -2; x <= 2; x++)
          expect(sameR(valueAt(d, R(x)), R(a * x * x + b * x + 1))).toBe(true);
      }
  });
  it('retains all sign pieces, zero-length intervals and reversed orientation', () => {
    expect(textR(integralAudit('crossLine', '0', '3').signed)).toBe('3/2');
    expect(textR(integralAudit('crossLine', '0', '3').magnitude)).toBe('5/2');
    for (const kind of Object.keys(integralCases) as IntegralFamily[])
      for (let a = -3; a <= 3; a++)
        for (let b = a; b <= 3; b++) {
          const m = integralAudit(kind, String(a), String(b)),
            rev = integralAudit(kind, String(b), String(a));
          expect(
            m.signed[0] * rev.signed[1] + rev.signed[0] * m.signed[1],
          ).toBe(0n);
          expect(m.magnitude).toEqual(rev.magnitude);
          expect(m.magnitude[0]).toBeGreaterThanOrEqual(0n);
          if (a === b) {
            expect(m.pieces).toEqual([]);
            expect(m.magnitude[0]).toBe(0n);
          }
        }
    const zero = integralAudit('descending', '0', '4');
    expect(zero.signed[0]).toBe(0n);
    expect(textR(zero.magnitude)).toBe('4');
    expect(polynomialIntegral(integralPolynomial('x^2'), R(2), R(1))).toEqual(
      R(-7, 3),
    );
  });
  it('distinguishes fixed lower bounds, chain factors, and actual one-sided slopes at jumps', () => {
    expect(ftcAudit('square', '1', '2').value).toEqual(R(7, 3));
    expect(ftcAudit('square', '1', '2').derivative).toEqual(R(4));
    for (const k of [1, 2])
      for (const x of ['1/2', '1', '3/2']) {
        const a = ftcAudit('square', '0', x, k),
          b = ftcAudit('square', '1', x, k);
        expect(a.derivative).toEqual(b.derivative);
        expect(
          a.value[0] * b.value[1] * 3n - b.value[0] * a.value[1] * 3n,
        ).toBe(a.value[1] * b.value[1]);
      }
    expect(ftcAudit('square', '1', '1', 2).derivative).toEqual(R(8));
    const jump = ftcAudit('step', '0', '1');
    expect(jump.value).toEqual(R(2));
    expect(jump.left).toEqual(R(2));
    expect(jump.right).toEqual(R(4));
    expect(jump.derivative).toBeNull();
    const chained = ftcAudit('step', '0', '3/2', 2);
    expect(chained.left).toEqual(R(8));
    expect(chained.right).toEqual(R(2));
    expect(chained.derivative).toBeNull();
    expect(ftcAudit('step', '1', '3/2').derivative).toEqual(R(4));
    expect(() => ftcAudit('step', '0', '2', 2)).toThrow();
  });
  it('separates travelled distance, inflow, initial states and changing curve order', () => {
    const m = applicationAudit('motion', false, 10);
    expect(m.signed).toEqual(R(5, 2));
    expect(m.magnitude).toEqual(R(13, 2));
    expect(m.final).toEqual(R(25, 2));
    expect(m.mean).toEqual(R(1, 2));
    expect(m.meanMagnitude).toEqual(R(13, 10));
    expect(applicationAudit('motion', true).signed).toEqual(R(0));
    expect(applicationAudit('motion', true).magnitude).toEqual(R(4));
    const f = applicationAudit('flow', false, 5);
    expect(f.signed).toEqual(R(9));
    expect(f.final).toEqual(R(14));
    for (const scenario of ['motion', 'flow', 'between'] as const)
      for (const wide of [false, true])
        for (let initial = 0; initial <= 20; initial++) {
          const a = applicationAudit(scenario, wide, initial),
            b = applicationAudit(scenario, wide, 0);
          expect(a.signed).toEqual(b.signed);
          expect(a.magnitude).toEqual(b.magnitude);
        }
    const area = applicationAudit('between', true);
    expect(area.pieces.map((p) => textR(p.signed))).toEqual([
      '-4/3',
      '4/3',
      '-4/3',
    ]);
    expect(area.magnitude).toEqual(R(4));
    expect(area.final).toBeNull();
  });
});
