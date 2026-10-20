import { describe, it, expect } from 'vitest';
import {
  checkAdvancedDerivative,
  derivativeAtoms,
  implicitAudit,
  extremaAudit,
  fenceAudit,
  motionAudit,
} from './optimisationModels';
import { rational, mulR, addR, textR, sameR } from './algebraModels';
import { asNumber } from './calculusModels';
describe('H31 exact derivative grammar and optimisation models', () => {
  it('proves supported exponential formulas by exact algebra rather than sampled matches', () => {
    expect(
      checkAdvancedDerivative('exp(x)+9*x*x-2', '9x^2-2+e^x', 'natural'),
    ).toBe(true);
    expect(
      checkAdvancedDerivative('2*(5e^(2*x))', '10e^(2x)', 'natural', '2'),
    ).toBe(true);
    expect(checkAdvancedDerivative('2^x*ln(2)', 'ln(2)*2^x', 'base')).toBe(
      true,
    );
    expect(
      checkAdvancedDerivative('−exp(−x)', '-e^(-x)', 'natural', '-1'),
    ).toBe(true);
    for (let a = -3; a <= 3; a++)
      for (let b = 1; b <= 4; b++)
        expect(
          checkAdvancedDerivative(
            `${a}*(x+1)*e^x+${b}x^2`,
            `${a}x*exp(x)+${a}exp(x)+${b}*x*x`,
            'natural',
          ),
        ).toBe(true);
    expect(
      checkAdvancedDerivative(
        '9x^2-2+e^x+x*(x-1)*(x+1)',
        '9x^2-2+e^x',
        'natural',
      ),
    ).toBe(false);
    for (const input of [
      '0.693147*2^x',
      '2^x',
      'ln(3)*2^x',
      'ln(2)*3^x',
      'l*z',
      'NaN',
      'eval(x)',
      '2^(x+1)',
    ])
      expect(checkAdvancedDerivative(input, 'ln(2)*2^x', 'base'), input).toBe(
        false,
      );
    for (const input of ['5e^(2x)', '10e^x', '10exp(x+1)', 'z', 'x/0'])
      expect(
        checkAdvancedDerivative(input, '10e^(2x)', 'natural', '2'),
        input,
      ).toBe(false);
    expect(derivativeAtoms('exp((2*x))', 'natural', '2')).toBe('z');
  });
  it('checks exact trig signs, inner frequencies and unit-circle equivalents without exposing formal variables', () => {
    expect(
      checkAdvancedDerivative('3*(cos(2*x)+cos(2x))', '6cos(2x)', 'trig', '2'),
    ).toBe(true);
    expect(
      checkAdvancedDerivative('12sin(-3x)', '-12sin(3x)', 'trig', '3'),
    ).toBe(true);
    expect(
      checkAdvancedDerivative('cos(x)+sin(x)^2+cos(x)^2-1', 'cos(x)', 'trig'),
    ).toBe(true);
    for (const input of [
      '6sin(2x)',
      '-6cos(2x)',
      '6cos(x)',
      '6c',
      'cos(2x+1)',
      'cos(x)/cos(x)',
      'sin(x)^0',
    ])
      expect(
        checkAdvancedDerivative(input, '6cos(2x)', 'trig', '2'),
        input,
      ).toBe(false);
    expect(checkAdvancedDerivative('sin(x)', '-sin(x)', 'trig')).toBe(false);
    expect(checkAdvancedDerivative('cos(x)', '1', 'trig')).toBe(false);
  });
  it('separates off-curve, regular, vertical and singular inputs with exact rational slopes', () => {
    expect(implicitAudit('circle', '3', '4')).toMatchObject({
      status: 'regular',
      slope: [-3n, 4n],
    });
    expect(implicitAudit('circle', '0', '5')).toMatchObject({
      status: 'regular',
      slope: [0n, 1n],
    });
    expect(implicitAudit('circle', '5', '0').status).toBe('vertical');
    expect(implicitAudit('cross', '0', '0').status).toBe('singular');
    expect(implicitAudit('circle', '3', '3').status).toBe('off-curve');
    for (let r = 1; r <= 12; r++)
      for (let a = 1; a <= 6; a++)
        for (let b = 7; b <= 10; b++) {
          const den = a * a + b * b,
            x = rational(BigInt(r * (b * b - a * a)), BigInt(den)),
            y = rational(BigInt(r * 2 * a * b), BigInt(den)),
            m = implicitAudit('circle', textR(x), textR(y), r);
          expect(m.status).toBe('regular');
          expect(sameR(addR(mulR(m.slope!, y), x), rational(0n))).toBe(true);
          expect(
            sameR(addR(mulR(x, x), mulR(y, y)), rational(BigInt(r * r))),
          ).toBe(true);
        }
    for (let n = -4; n <= 4; n++) {
      const m = implicitAudit('cross', String(n), String(n));
      expect(m.status).toBe(n === 0 ? 'singular' : 'regular');
      if (n) expect(textR(m.slope!)).toBe('1');
    }
  });
  it('distinguishes bounds from attainment, retains tied endpoints and includes a nondifferentiable minimum', () => {
    const closed = {
        left: '-2',
        right: '2',
        leftClosed: true,
        rightClosed: true,
      },
      m = extremaAudit('cubic-turn', closed);
    expect(m.maxAt).toEqual(['-1', '2']);
    expect(m.minAt).toEqual(['-2', '1']);
    expect(textR(m.max!)).toBe('2');
    const open = extremaAudit('square', {
      left: '0',
      right: '2',
      leftClosed: false,
      rightClosed: false,
    });
    expect(open.min).toBeNull();
    expect(open.max).toBeNull();
    expect([textR(open.inf), textR(open.sup)]).toEqual(['0', '4']);
    const half = extremaAudit('square', {
      left: '0',
      right: '2',
      leftClosed: true,
      rightClosed: false,
    });
    expect(half.minAt).toEqual(['0']);
    expect(half.maxAt).toEqual([]);
    const corner = extremaAudit('corner', {
      left: '-2',
      right: '1',
      leftClosed: true,
      rightClosed: true,
    });
    expect(corner.minAt).toEqual(['0']);
    expect(corner.maxAt).toEqual(['-2']);
    expect(corner.candidates.find((c) => textR(c.x) === '0')?.reason).toBe(
      'nondifferentiable',
    );
    for (const leftClosed of [false, true])
      for (const rightClosed of [false, true]) {
        const s = extremaAudit('cubic-turn', {
          left: '-2',
          right: '2',
          leftClosed,
          rightClosed,
        });
        expect(s.minAt).toEqual(leftClosed ? ['-2', '1'] : ['1']);
        expect(s.maxAt).toEqual(rightClosed ? ['-1', '2'] : ['-1']);
      }
  });
  it('checks all whole-metre candidates and proves continuous optima against the completed-square bound', () => {
    for (let length = 12; length <= 40; length++)
      for (let cap = 0; cap <= 20; cap++) {
        const ints = Array.from({ length }, (_, i) => i + 1).filter(
            (x) => x <= cap && 2 * x < length,
          ),
          areas = ints.map((x) => x * (length - 2 * x)),
          maximum = areas.length ? Math.max(...areas) : null,
          m = fenceAudit(length, cap, true);
        expect(m.max ? asNumber(m.max) : null).toBe(maximum);
        expect(m.best.map(asNumber)).toEqual(
          ints.filter((_, i) => areas[i] === maximum),
        );
        const cont = fenceAudit(length, cap),
          best = Math.min(cap, length / 4);
        expect(cont.best.map(asNumber)).toEqual(cap === 0 ? [] : [best]);
        if (cap) {
          expect(asNumber(cont.max!)).toBe(best * (length - 2 * best));
          for (let q = 1; q <= 4 * cap; q++) {
            const x = q / 4;
            if (2 * x >= length) continue;
            const area = x * (length - 2 * x);
            expect(area).toBe(
              (length * length) / 8 - 2 * (x - length / 4) ** 2,
            );
            expect(area).toBeLessThanOrEqual(asNumber(cont.max!));
          }
        }
      }
    expect(fenceAudit(24, 4).bestText).toBe('{4}');
    expect(textR(fenceAudit(24, 4).max!)).toBe('64');
    expect(fenceAudit(22, 9, true).bestText).toBe('{5,6}');
    expect(fenceAudit(24, 0).max).toBeNull();
  });
  it('keeps velocity, speed and acceleration units and signs distinct and sums distance at reversals', () => {
    const m = motionAudit();
    expect([textR(m.v), textR(m.a), textR(m.speed), m.classification]).toEqual([
      '-3',
      '0',
      '3',
      'neither',
    ]);
    expect([
      textR(m.displacement),
      textR(m.distance),
      textR(m.averageVelocity),
      textR(m.averageSpeed),
    ]).toEqual(['4', '12', '1', '3']);
    expect(m.segments.map((s) => textR(s.change))).toEqual(['4', '-4', '4']);
    for (const scale of [-2, -1, 1, 2, 3, 4, 5, 6])
      for (const end of [2, 3, 4, 5, 6])
        for (let time = 0; time <= end; time++) {
          const v = scale * (3 * time * time - 12 * time + 9),
            a = scale * (6 * time - 12),
            s = motionAudit(scale, 10, String(time), end);
          expect(asNumber(s.v)).toBe(v || 0);
          expect(asNumber(s.a)).toBe(a || 0);
          expect(asNumber(s.speed)).toBe(Math.abs(v));
          expect(s.classification).toBe(
            v === 0
              ? 'instant-rest'
              : a === 0
                ? 'neither'
                : v * a > 0
                  ? 'speeding-up'
                  : 'slowing-down',
          );
          let distance = 0,
            prev = 10;
          for (let i = 1; i <= end * 20; i++) {
            const t = i / 20,
              pos = scale * t * (t - 3) ** 2 + 10;
            distance += Math.abs(pos - prev);
            prev = pos;
          }
          expect(asNumber(s.distance)).toBeCloseTo(distance, 8);
          const shifted = motionAudit(scale, 0, String(time), end);
          expect(s.distance).toEqual(shifted.distance);
          expect(s.displacement).toEqual(shifted.displacement);
        }
    expect(motionAudit(-1, 0, '0').classification).toBe('slowing-down');
    expect(motionAudit(1, 0, '1').classification).toBe('instant-rest');
  });
  it('rejects invalid domains rather than silently generating feasible-looking models', () => {
    expect(() => implicitAudit('circle', '21', '0')).toThrow();
    expect(() => implicitAudit('circle', '0', '0', 0)).toThrow();
    expect(() =>
      extremaAudit('square', {
        left: '2',
        right: '1',
        leftClosed: true,
        rightClosed: true,
      }),
    ).toThrow();
    for (const n of [-1, 0.5, NaN, Infinity])
      expect(() => fenceAudit(24, n)).toThrow();
    expect(() => motionAudit(0)).toThrow();
    expect(() => motionAudit(1, 0, '5', 4)).toThrow();
  });
});
