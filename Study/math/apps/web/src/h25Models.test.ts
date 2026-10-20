import { describe, it, expect } from 'vitest';
import { rational, sameR, addR, mulR, textR } from './algebraModels';
import {
  calculusPolynomial,
  calculusScalar,
  valueAt,
  differentiate,
  rateModel,
  secantModel,
  tangentModel,
  derivativeText,
  derivativeRules,
  limitModel,
  limitValue,
  cornerModel,
  checkCalculusCode,
  asNumber,
} from './calculusModels';
import { checkAnswer } from './model';
describe('H25 exact differences, limits, derivative rules and tangent conditions', () => {
  it('independently checks 243 small polynomials at five points and 6075 endpoint pairs', () => {
    for (let code = 0; code < 243; code++) {
      let k = code;
      const c = Array.from({ length: 5 }, () => {
          const n = (k % 3) - 1;
          k = Math.floor(k / 3);
          return n;
        }),
        raw = c
          .map((v, n) =>
            n === 0 ? String(v) : `${v}x${n === 1 ? '' : `^${n}`}`,
          )
          .join('+'),
        p = calculusPolynomial(raw),
        d = differentiate(p),
        f = (x: number) => c.reduce((s, v, n) => s + v * x ** n, 0),
        df = (x: number) =>
          c.slice(1).reduce((s, v, i) => s + (i + 1) * v * x ** i, 0);
      for (let a = -2; a <= 2; a++) {
        expect(asNumber(valueAt(p, rational(BigInt(a))))).toBe(f(a));
        expect(asNumber(valueAt(d, rational(BigInt(a))))).toBe(df(a));
        for (let b = -2; b <= 2; b++) {
          const m = rateModel(raw, String(a), String(b));
          expect(m.average ? asNumber(m.average) : null).toBe(
            a === b ? null : (f(b) - f(a)) / (b - a) || 0,
          );
        }
      }
    }
  });
  it('checks exact square and cubic quotient identities on both sides, including negative and zero rates', () => {
    for (let a = -3; a <= 3; a++)
      for (const h of ['-1', '-1/2', '-1/10', '0', '1/10', '1/2', '1']) {
        const m = secantModel('x^2', String(a), h),
          c = secantModel('x^3', String(a), h),
          hr = calculusScalar(h);
        if (h === '0') {
          expect(m.average).toBeNull();
          expect(c.average).toBeNull();
          continue;
        }
        expect(sameR(m.average!, addR(rational(BigInt(2 * a)), hr))).toBe(true);
        expect(
          sameR(
            c.average!,
            addR(
              addR(
                rational(BigInt(3 * a * a)),
                mulR(rational(BigInt(3 * a)), hr),
              ),
              mulR(hr, hr),
            ),
          ),
        ).toBe(true);
      }
    expect(textR(rateModel('x^2', '-1', '1').average!)).toBe('0');
    expect(textR(rateModel('x^2', '3', '1').average!)).toBe('4');
    expect(rateModel('x^2', '1', '1')).toMatchObject({
      average: null,
      derivative: rational(2n),
    });
  });
  it('keeps derivative and difference invariants under constant translation, with a separate derivative function', () => {
    for (const r of derivativeRules)
      expect(
        checkAnswer(derivativeText(r.source), {
          kind: 'polynomial',
          value: r.derivative,
          variables: ['x'],
        }),
      ).toBe(true);
    for (let a = -3; a <= 3; a++)
      for (let b = -3; b <= 3; b++) {
        const m = rateModel('x^3-2x', String(a), String(b)),
          n = rateModel('x^3-2x+4', String(a), String(b));
        expect(m.average).toEqual(n.average);
        expect(m.derivative).toEqual(n.derivative);
        expect(m.dy).toEqual(n.dy);
        expect(n.fa).toEqual(addR(m.fa, rational(4n)));
      }
    expect(derivativeText('0')).toBe('0');
    expect(derivativeText('7')).toBe('0');
    expect(derivativeText('(1/2)x^2-3x')).toBe('x - 3');
  });
  it('keeps point values distinct from agreeing or disagreeing one-sided limits', () => {
    expect(limitModel('hole')).toMatchObject({
      at: null,
      left: rational(2n),
      right: rational(2n),
      limit: rational(2n),
    });
    expect(limitModel('patched')).toMatchObject({
      at: rational(5n),
      limit: rational(2n),
    });
    expect(limitModel('jump')).toMatchObject({
      at: rational(2n),
      left: rational(0n),
      right: rational(2n),
      limit: null,
    });
    expect(limitModel('absolute')).toMatchObject({
      at: rational(0n),
      limit: rational(0n),
    });
    for (const d of [2, 10, 100, 1000])
      for (const side of [-1, 1]) {
        const x = rational(BigInt(d + side), BigInt(d)),
          hole = limitValue('hole', x),
          patch = limitValue('patched', x);
        expect(hole).toEqual(rational(BigInt(2 * d + side), BigInt(d)));
        expect(patch).toEqual(hole);
        expect(limitValue('jump', x)).toEqual(rational(side < 0 ? 0n : 2n));
      }
  });
  it('distinguishes continuous absolute-value corners from differentiable cubic crossings', () => {
    for (const h of ['-1', '-1/10', '1/10', '1']) {
      const m = cornerModel('0', h);
      expect(m.derivative).toBeNull();
      expect(textR(m.average!)).toBe(h.startsWith('-') ? '-1' : '1');
    }
    expect(cornerModel('1', '0').average).toBeNull();
    expect(cornerModel('1', '0').derivative).toEqual(rational(1n));
    expect(tangentModel('x^3', '0')).toMatchObject({
      y: rational(0n),
      slope: rational(0n),
    });
    expect(
      asNumber(valueAt(calculusPolynomial('x^3'), rational(-1n))),
    ).toBeLessThan(0);
    expect(
      asNumber(valueAt(calculusPolynomial('x^3'), rational(1n))),
    ).toBeGreaterThan(0);
  });
  it('checks contact incidence, exact slope and whole-line equivalence rather than one passing point', () => {
    for (const raw of ['x^2', 'x^3', 'x^3-3x', '5', '(1/2)x^2-3x'])
      for (const a of ['-2', '-1/2', '0', '1', '2']) {
        const m = tangentModel(raw, a);
        expect(sameR(addR(mulR(m.slope, m.a), m.intercept), m.y)).toBe(true);
        const x = a === '-1/2' ? -0.5 : Number(a),
          expected =
            raw === 'x^2'
              ? 2 * x
              : raw === 'x^3'
                ? 3 * x * x
                : raw === 'x^3-3x'
                  ? 3 * x * x - 3
                  : raw === '5'
                    ? 0
                    : x - 3;
        expect(asNumber(m.slope)).toBe(expected);
      }
    const spec = {
      kind: 'plane-equation' as const,
      value: tangentModel('x^2', '2').equation,
    };
    for (const raw of ['y=4x-4', 'y-4=4(x-2)', '2y-8x=-8'])
      expect(checkAnswer(raw, spec)).toBe(true);
    for (const raw of ['y=4x', 'y=2x', 'y=x^2', '4'])
      expect(checkAnswer(raw, spec)).toBe(false);
    const m = tangentModel('x^3-3x', '1');
    expect(m.slope).toEqual(rational(0n));
    expect(m.y).toEqual(valueAt(m.p, rational(-2n)));
  });
  it('uses explicit bounded input protocols and separates undefined quantities from absent two-sided limits', () => {
    for (const raw of [
      'x^5',
      'sin(x)',
      '1/x',
      'x+y',
      'x=2',
      '101x',
      'x/0',
      'alert(1)',
    ])
      expect(() => calculusPolynomial(raw)).toThrow();
    for (const raw of ['101', '1/10001', 'NaN', '1/0', 'x'])
      expect(() => calculusScalar(raw)).toThrow();
    for (const raw of ['undefined', '未定义', '无定义'])
      expect(checkCalculusCode(raw, 'undefined')).toBe(true);
    for (const raw of ['DNE', 'does-not-exist', '不存在'])
      expect(checkCalculusCode(raw, 'does-not-exist')).toBe(true);
    expect(checkCalculusCode('undefined', 'does-not-exist')).toBe(false);
    expect(checkCalculusCode('0', 'undefined')).toBe(false);
    expect(() => limitModel('unknown' as 'hole')).toThrow();
  });
});
