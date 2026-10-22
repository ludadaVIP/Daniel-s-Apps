import { describe, it, expect } from 'vitest';
import {
  checkPointSet,
  readPointSet,
  lineConicAudit,
  midpointLocus,
  rationalCircle,
  diameterAudit,
  ellipseRoof,
  type IntersectionConic,
  type LineDirection,
  type ExactPoint,
} from './analyticGeometryModels';
import {
  readRadical,
  addRadicals,
  multiplyRadicals,
  sameRadical,
} from './radicalModels';
import { readRational } from './rationalModels';
import { checkAnswer } from './model';
const rv = (s: string) => readRadical(s)!;
const scalar = (s: string) => {
  const r = readRational(s);
  return Number(r[0]) / Number(r[1]);
};
describe('H36 exact analytic geometry models and point-set answers', () => {
  it('checks complete unordered point sets with exact radical equivalence and strict pair syntax', () => {
    expect(
      checkPointSet(
        '{(sqrt(8)/2,3);(-sqrt(2),3)}',
        '{(-sqrt(2),3);(sqrt(2),3)}',
      ),
    ).toBe(true);
    expect(checkPointSet('（1/2，3）；(0.5,3)', '{(1/2,3)}')).toBe(true);
    expect(checkPointSet('{((1+1)/2,0),(0,1)}', '{(0,1);(1,0)}')).toBe(true);
    expect(checkPointSet('∅', '{}')).toBe(true);
    for (const raw of [
      '{(0,0)}',
      '{}',
      '(4,3)',
      '{(-4,3);(4,3);(0,5)}',
      '{(-4,-3);(4,3)}',
    ])
      expect(checkPointSet(raw, '{(-4,3);(4,3)}')).toBe(false);
    for (const raw of [
      '',
      '1,2',
      '{(1,2);}',
      '{(1,2)}extra',
      '{(1,2,3)}',
      '(NaN,0)',
      '(Infinity,0)',
      '(1/0,0)',
      '(sqrt(-1),0)',
      '{(1,2)',
      '{(1,2)}{}',
      '{(1,2)(3,4)}',
      'a'.repeat(1801),
    ])
      expect(readPointSet(raw), raw).toBeNull();
    expect(checkPointSet('(1.41421356,0)', '(sqrt(2),0)')).toBe(false);
    expect(
      checkAnswer('{(4,3);(-4,3)}', {
        kind: 'plane-point-set',
        value: '{(-4,3);(4,3)}',
      }),
    ).toBe(true);
  });
  it('independently counts all line cases and substitutes every exact point into both original equations', () => {
    for (const kind of [
      'circle',
      'ellipse',
      'parabola',
      'hyperbola',
    ] as IntersectionConic[])
      for (const dir of [
        'horizontal',
        'vertical',
        'diagonal',
      ] as LineDirection[])
        for (
          let c = kind === 'circle' ? -6 : -4;
          c <= (kind === 'circle' ? 6 : 4);
          c++
        ) {
          const m = lineConicAudit(kind, dir, c);
          let count: number;
          if (kind === 'circle')
            count =
              dir === 'diagonal'
                ? 2
                : Math.abs(c) > 5
                  ? 0
                  : Math.abs(c) === 5
                    ? 1
                    : 2;
          else if (kind === 'ellipse')
            count =
              dir !== 'horizontal'
                ? 2
                : Math.abs(c) > 3
                  ? 0
                  : Math.abs(c) === 3
                    ? 1
                    : 2;
          else if (kind === 'parabola')
            count =
              dir === 'vertical'
                ? 1
                : dir === 'horizontal'
                  ? c < 0
                    ? 0
                    : c === 0
                      ? 1
                      : 2
                  : c < 0
                    ? 0
                    : 2;
          else
            count =
              dir === 'horizontal'
                ? 2
                : dir === 'vertical'
                  ? Math.abs(c) < 1
                    ? 0
                    : Math.abs(c) === 1
                      ? 1
                      : 2
                  : c === 0
                    ? 0
                    : 1;
          expect(m.points, m.line + ';' + kind).toHaveLength(count);
          for (const [xs, ys] of m.points) {
            const x = rv(xs),
              y = rv(ys),
              xx = multiplyRadicals(x, x),
              yy = multiplyRadicals(y, y);
            const lhs =
              kind === 'circle'
                ? addRadicals(addRadicals(xx, yy), rv('-25'))
                : kind === 'ellipse'
                  ? addRadicals(
                      addRadicals(
                        multiplyRadicals(rv('9'), xx),
                        multiplyRadicals(rv('25'), yy),
                      ),
                      rv('-225'),
                    )
                  : kind === 'parabola'
                    ? addRadicals(xx, y, true)
                    : addRadicals(addRadicals(xx, yy, true), rv('-1'));
            expect(lhs.size).toBe(0);
            const line =
              dir === 'vertical'
                ? addRadicals(x, rv(String(c)), true)
                : dir === 'horizontal'
                  ? addRadicals(y, rv(String(c)), true)
                  : addRadicals(addRadicals(y, x, true), rv(String(c)), true);
            expect(line.size).toBe(0);
          }
        }
  });
  it('distinguishes a quadratic tangent, a linear single intersection and a constant contradiction', () => {
    const tangent = lineConicAudit('circle', 'horizontal', 5),
      vertical = lineConicAudit('parabola', 'vertical', 2),
      asymptote = lineConicAudit('hyperbola', 'diagonal', 0),
      cross = lineConicAudit('hyperbola', 'diagonal', 1);
    expect([
      tangent.degree,
      tangent.discriminant,
      tangent.tangent,
      tangent.points.length,
    ]).toEqual([2, '0', true, 1]);
    expect([
      vertical.degree,
      vertical.discriminant,
      vertical.tangent,
      vertical.points,
    ]).toEqual([1, null, false, [['2', '4']]]);
    expect([
      asymptote.degree,
      asymptote.discriminant,
      asymptote.points,
    ]).toEqual([0, null, []]);
    expect([cross.degree, cross.tangent, cross.points]).toEqual([
      1,
      false,
      [['-1', '0']],
    ]);
  });
  it('reconstructs midpoint sources and retains semicircle and endpoint restrictions separately from the equation', () => {
    for (const a of [-2, 0, 2])
      for (const r of [2, 4, 6])
        for (const motion of ['all', 'upper', 'upper-excluded'] as const)
          for (let card = 0; card < 4; card++) {
            const m = midpointLocus(a, r, motion, card),
              [sx, sy] = m.source.map(scalar),
              [x, y] = m.midpoint.map(scalar);
            expect(x).toBe((a + sx!) / 2);
            expect(y).toBe(sy! / 2);
            expect(m.reconstruct(m.midpoint)).toEqual(m.source);
            const expected =
              (motion === 'all' || sy! >= 0) &&
              !(motion === 'upper-excluded' && sx === r && sy === 0);
            expect(m.admitted).toBe(expected);
            expect((2 * x! - a) ** 2 + (2 * y!) ** 2).toBe(r * r);
            expect(m.contains(m.centre)).toBe(false);
          }
    expect(midpointLocus(2, 4, 'upper', 0).contains(['1', '-2'])).toBe(false);
    expect(midpointLocus(2, 4, 'upper-excluded', 0).contains(['3', '0'])).toBe(
      false,
    );
    expect(midpointLocus(2, 4, 'upper-excluded', 0).contains(['-1', '0'])).toBe(
      true,
    );
  });
  it('verifies exact rational parameter membership, inverse recovery, restricted arcs and the omitted circle point', () => {
    for (const r of [3, 5])
      for (let den = 1; den <= 8; den++)
        for (let numerator = -8; numerator <= 8; numerator++) {
          if (Math.abs(numerator / den) > 4) continue;
          const raw = `${numerator}/${den}`,
            m = rationalCircle(r, raw),
            [x, y] = m.point.map(rv);
          expect(
            sameRadical(
              addRadicals(multiplyRadicals(x!, x!), multiplyRadicals(y!, y!)),
              rv(String(r * r)),
            ),
          ).toBe(true);
          expect(scalar(m.inverse(m.point)!)).toBe(numerator / den);
          expect(m.inverse(m.omitted)).toBeNull();
          const arc = rationalCircle(r, raw, true),
            allowed = numerator >= 0 && numerator <= den;
          expect(arc.admitted).toBe(allowed);
          expect(arc.inverse(arc.point) !== null).toBe(allowed);
        }
    expect(rationalCircle(5, '1/2').point).toEqual(['3', '4']);
    expect(rationalCircle(5, '2').point).toEqual(['-3', '4']);
    const p0 = rationalCircle(5, '0').point.map(scalar),
      p1 = rationalCircle(5, '1').point.map(scalar),
      p2 = rationalCircle(5, '2').point.map(scalar);
    expect((p1[0]! - p0[0]!) ** 2 + (p1[1]! - p0[1]!) ** 2).toBe(50);
    expect((p2[0]! - p1[0]!) ** 2 + (p2[1]! - p1[1]!) ** 2).toBe(10);
  });
  it('cross-checks direct vector components, collinearity and original angle eligibility against the circle equation', () => {
    for (let a = 1; a <= 4; a++)
      for (let x = -5; x <= 5; x++)
        for (let y = -5; y <= 5; y++) {
          const m = diameterAudit(a, [String(x), String(y)]),
            u = [-a - x, -y],
            v = [a - x, -y];
          const dot = u[0]! * v[0]! + u[1]! * v[1]!,
            cross = u[0]! * v[1]! - u[1]! * v[0]!;
          expect(scalar(m.dot) === dot).toBe(true);
          expect(scalar(m.cross) === cross).toBe(true);
          const zero = u.every((n) => n === 0) || v.every((n) => n === 0);
          const expected = zero
            ? 'undefined'
            : cross === 0
              ? dot < 0
                ? 'straight'
                : 'zero-angle'
              : dot === 0
                ? 'right'
                : dot < 0
                  ? 'obtuse'
                  : 'acute';
          expect(m.angle).toBe(expected);
          expect(m.admitted).toBe(!zero && dot === 0);
        }
    expect(diameterAudit(3, ['-3', '0']).onEquation).toBe(true);
    expect(diameterAudit(3, ['-3', '0']).admitted).toBe(false);
  });
  it('checks roof widths, exact intersections and feasible boundaries in metres, keeping lower-half points excluded', () => {
    for (const scale of [1, 2])
      for (const kind of ['floor', 'low', 'high', 'apex', 'above'] as const) {
        const m = ellipseRoof(scale, kind),
          h = scalar(m.height),
          expectedSquare =
            25 * scale * scale * (1 - (h * h) / (9 * scale * scale));
        if (expectedSquare < 0) {
          expect(m.width).toBeNull();
          expect(m.points).toHaveLength(0);
          expect(m.admissibleX).toBe('∅');
        } else {
          expect(scalar(m.half!) ** 2).toBeCloseTo(expectedSquare, 10);
          expect(scalar(m.width!)).toBe(2 * scalar(m.half!));
        }
        for (const p of m.points) {
          expect(m.contains(p)).toBe(true);
          expect(scalar(p[1])).toBe(h);
        }
        expect(m.contains(['0', String(-m.b)])).toBe(false);
      }
    expect(ellipseRoof(1, 'low').points).toEqual([
      ['-4', '9/5'],
      ['4', '9/5'],
    ]);
    expect(ellipseRoof(1, 'high').width).toBe('6');
    expect(ellipseRoof(1, 'apex').points).toEqual([['0', '3']]);
    expect(ellipseRoof(1, 'apex').positiveOpening).toBe(false);
  });
  it('guards unsupported geometry and bounded parameter domains', () => {
    const actions = [
      () => lineConicAudit('bad' as IntersectionConic, 'horizontal', 0),
      () => lineConicAudit('circle', 'bad' as LineDirection, 0),
      () => lineConicAudit('ellipse', 'diagonal', 6),
      () => midpointLocus(0, 3, 'all', 0),
      () => midpointLocus(0, 4, 'all', 4),
      () => rationalCircle(5, '1/0'),
      () => rationalCircle(5, '5'),
      () => diameterAudit(0, ['0', '0']),
      () => ellipseRoof(3, 'low'),
      () => ellipseRoof(1, 'bad' as never),
    ];
    for (const action of actions) expect(action).toThrow();
    const bad: ExactPoint = ['12', '0'];
    expect(() => diameterAudit(3, bad)).toThrow();
  });
});
