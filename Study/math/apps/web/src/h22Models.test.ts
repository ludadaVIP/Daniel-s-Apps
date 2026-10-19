import { describe, it, expect } from 'vitest';
import { checkAnswer } from './model';
import { sameR, textR, mulR } from './algebraModels';
import {
  cp,
  cq,
  cn,
  planeLine,
  lineEquation,
  lineValue,
  projectionFoot,
  lineDistanceSquare,
  pointDistanceSquare,
  checkPlaneEquation,
  planeEquation,
  circleLocus,
  circlePosition,
  parabolaModel,
  focalModel,
  conicPoint,
  ellipseSizes,
  hyperbolaSizes,
  exactDistance,
} from './conicModels';
const npoint = (p: ReturnType<typeof cp>) => p.map(cn) as [number, number];
function equationAt(equation: string, x: number, y: number) {
  const p = planeEquation(equation)!;
  return [...p].reduce(
    (s, [k, c]) =>
      s + cn(c) * [...k].reduce((v, char) => v * (char === 'x' ? x : y), 1),
    0,
  );
}
describe('H22 analytic geometry with independent coordinate and distance oracles', () => {
  it('accepts proportional rearranged plane equations while rejecting identities, extra factors and undefined divisions', () => {
    for (const [a, b] of [
      ['y-3=2(x-1)', '2x-y+1=0'],
      ['x=2', '-3x+6=0'],
      ['(x-1)^2+(y+2)^2=25', 'x²+y²-2x+4y-20=0'],
      ['y²=4x', '2y²-8x=0'],
      ['x²/25+y²/16=1', '16x²+25y²=400'],
      ['x²/9-y²/16=1', '16x²-9y²=144'],
    ] as const) {
      expect(checkPlaneEquation(a, b)).toBe(true);
      expect(checkAnswer(a, { kind: 'plane-equation', value: b })).toBe(true);
    }
    for (const wrong of [
      '0=0',
      '0=1',
      'x^2=4',
      '(x-2)y=0',
      'x/y=2/y',
      'x=2; y=0',
      'x=2=2',
      'sqrt(x)=2',
      'x^3=8',
      'x/(1-1)=2',
      'x^2+y^2=4',
      '',
    ])
      expect(checkPlaneEquation(wrong, 'x=2')).toBe(false);
    expect(checkPlaneEquation('x+y=2', 'x-y=2')).toBe(false);
    expect(checkPlaneEquation('x²/16-y²/9=1', 'x²/9-y²/16=1')).toBe(false);
  });
  it('independently verifies 6000 line projections, squared distances and nonzero coefficient scaling', () => {
    let count = 0;
    for (let a = -3; a <= 3; a++)
      for (let b = -3; b <= 3; b++) {
        if (!a && !b) continue;
        for (let c = -2; c <= 2; c++)
          for (let x = -2; x <= 2; x++)
            for (let y = -2; y <= 2; y++) {
              const l = planeLine(a, b, c),
                p = cp(x, y),
                foot = projectionFoot(l, p),
                [hx, hy] = npoint(foot),
                v = a * x + b * y + c,
                d2 = (v * v) / (a * a + b * b);
              expect(hx).toBeCloseTo(x - (a * v) / (a * a + b * b), 11);
              expect(hy).toBeCloseTo(y - (b * v) / (a * a + b * b), 11);
              expect(lineValue(l, foot)[0]).toBe(0n);
              expect((x - hx) * b - (y - hy) * a).toBeCloseTo(0, 10);
              expect(cn(lineDistanceSquare(l, p))).toBeCloseTo(d2, 11);
              expect(cn(pointDistanceSquare(p, foot))).toBeCloseTo(d2, 11);
              const scaled = planeLine(-2 * a, -2 * b, -2 * c);
              expect(
                checkPlaneEquation(lineEquation(l), lineEquation(scaled)),
              ).toBe(true);
              expect(
                sameR(lineDistanceSquare(l, p), lineDistanceSquare(scaled, p)),
              ).toBe(true);
              count++;
            }
      }
    expect(count).toBe(6000);
    expect(
      exactDistance(lineDistanceSquare(planeLine(3, 4, -5), cp(1, 3))),
    ).toBe('2');
    expect(() => planeLine(0, 0, 1)).toThrow();
  });
  it('keeps circle radius, squared radius, centre signs and degenerate loci distinct', () => {
    const m = circleLocus(1, -2, 25);
    expect(checkPlaneEquation(m.equation, 'x²+y²-2x+4y-20=0')).toBe(true);
    for (let x = -5; x <= 5; x++)
      for (let y = -5; y <= 5; y++) {
        const d = (x - 1) ** 2 + (y + 2) ** 2;
        expect(circlePosition(cp(x, y), m.centre, m.radiusSquare)).toBe(
          d === 25 ? 'on' : d < 25 ? 'inside' : 'outside',
        );
      }
    expect(circleLocus(0, 0, 0).kind).toBe('point');
    expect(circleLocus(0, 0, -1).kind).toBe('empty');
    expect(circlePosition(cp(0, 0), cp(0, 0), cq(-1))).toBe('empty');
    expect(checkAnswer('circle', { kind: 'conic-code', value: 'circle' })).toBe(
      true,
    );
    expect(checkAnswer('0', { kind: 'conic-code', value: 'undefined' })).toBe(
      false,
    );
  });
  it('checks signed half-parameters and both axes of translated parabolas directly from distances', () => {
    for (const axis of ['horizontal', 'vertical'] as const)
      for (const h of [-1, 0, 1])
        for (const k of [-1, 0, 1])
          for (const pr of ['-2', '-1', '-1/2', '1/2', '1', '2'])
            for (const tr of ['-2', '-1', '-1/2', '0', '1/2', '1', '2']) {
              const m = parabolaModel(h, k, pr, axis),
                s = conicPoint(m, tr),
                [x, y] = npoint(s.point),
                [fx, fy] = npoint(m.focusMinus),
                [dx, dy] = npoint(s.directrixFoot!);
              const pf = Math.hypot(x - fx, y - fy),
                pd = Math.hypot(x - dx, y - dy);
              expect(pf).toBeCloseTo(pd, 11);
              expect(cn(s.dMinus)).toBeCloseTo(pf, 11);
              expect(cn(s.dPlus)).toBeCloseTo(pd, 11);
              expect(equationAt(m.equation, x, y)).toBeCloseTo(0, 10);
              expect(axis === 'horizontal' ? y - dy : x - dx).toBeCloseTo(
                0,
                11,
              );
            }
    const m = parabolaModel(1, -2, '-1/2', 'vertical');
    expect(npoint(m.focusMinus)).toEqual([1, -2.5]);
    expect(cn(m.directrix!.value)).toBe(-1.5);
    expect(checkPlaneEquation(m.equation, '(x-1)^2=-2(y+2)')).toBe(true);
  });
  it('checks ellipse sums and hyperbola absolute and signed differences independently on both branches', () => {
    let count = 0;
    for (const kind of ['ellipse', 'hyperbola'] as const)
      for (const axis of ['horizontal', 'vertical'] as const)
        for (const h of [-1, 0, 1])
          for (const k of [-1, 0, 1])
            for (const index of [0, 1, 2])
              for (const branch of [-1, 1] as const)
                for (const tr of ['-1/2', '0', '1/2']) {
                  const m = focalModel(kind, h, k, index, axis),
                    s = conicPoint(m, tr, branch),
                    [x, y] = npoint(s.point),
                    [f1x, f1y] = npoint(m.focusMinus),
                    [f2x, f2y] = npoint(m.focusPlus),
                    d1 = Math.hypot(x - f1x, y - f1y),
                    d2 = Math.hypot(x - f2x, y - f2y),
                    a = cn(m.a);
                  expect(cn(s.dMinus)).toBeCloseTo(d1, 10);
                  expect(cn(s.dPlus)).toBeCloseTo(d2, 10);
                  expect(
                    kind === 'ellipse' ? d1 + d2 : Math.abs(d1 - d2),
                  ).toBeCloseTo(2 * a, 10);
                  expect(cn(s.signedDifference)).toBeCloseTo(d1 - d2, 10);
                  expect(equationAt(m.equation, x, y)).toBeCloseTo(0, 9);
                  if (kind === 'hyperbola')
                    expect(d1 - d2).toBeCloseTo(branch * 2 * a, 10);
                  count++;
                }
    expect(count).toBe(648);
    ellipseSizes.forEach(([a, c, b]) => expect(a * a - c * c).toBe(b * b));
    hyperbolaSizes.forEach(([a, c, b]) => expect(c * c - a * a).toBe(b * b));
  });
  it('retains fixed distance constants across translations and refuses degenerate or excessive trace parameters', () => {
    const e = focalModel('ellipse', 0, 0, 0, 'horizontal'),
      h = focalModel('hyperbola', 0, 0, 0, 'horizontal');
    expect(textR(conicPoint(e, '0').constant)).toBe('10');
    expect(textR(conicPoint(h, '0', -1).signedDifference)).toBe('-6');
    for (const raw of ['1', '-1', '2', '-2'])
      expect(() => conicPoint(h, raw)).toThrow();
    expect(() => parabolaModel(0, 0, '0', 'horizontal')).toThrow();
    expect(() => focalModel('ellipse', 0, 0, 3, 'horizontal')).toThrow();
    expect(() => conicPoint(e, '3')).toThrow();
    expect(() => circleLocus(4, 0, 1)).toThrow();
    expect(sameR(mulR(cq(3), cq(3)), cq(9))).toBe(true);
  });
});
