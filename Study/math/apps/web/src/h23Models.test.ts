import { describe, it, expect } from 'vitest';
import { checkAnswer } from './model';
import { rational, textR, sameR } from './algebraModels';
import {
  vec3,
  readVec3,
  vec3Text,
  vec3Number,
  checkVec3,
  addVec3,
  subVec3,
  scaleVec3,
  dotVec3,
  squareVec3,
  midpointVec3,
  spatialAngle,
  vectorLine3,
  vectorPlane3,
  vectorLinePlaneRelation,
  vectorPlaneRelation,
  vectorLineRelation,
  pointPlaneProjection,
  pointLineProjection,
  planeResidual3,
  zeroVec3,
  sameVec3,
  type Vec3,
} from './spaceVectorModels';
const nums = (v: Vec3) => vec3Number(v);
const smallPoints = () => {
  const ps: Vec3[] = [];
  for (let x = -1; x <= 1; x++)
    for (let y = -1; y <= 1; y++)
      for (let z = -1; z <= 1; z++) ps.push(vec3(x, y, z));
  return ps;
};
describe('H23 exact spatial vectors and independent projection oracles', () => {
  it('parses ordered rational triples without dropping z, evaluating code or accepting missing components', () => {
    for (const raw of ['(1,-2,3/2)', '1,-2,1.5', '（1，-2，1.50）'])
      expect(
        checkAnswer(raw, { kind: 'coordinate3', value: '(1,-2,3/2)' }),
      ).toBe(true);
    for (const raw of [
      '(1,-2)',
      '(1,-2,3/2,0)',
      '(1,3/2,-2)',
      '(1,-2,sqrt(2))',
      '(1,-2,1/0)',
      '(1,-2,NaN)',
      'x=1,y=-2,z=1.5',
      '(1,-2,1001)',
      'alert(1)',
      '',
    ])
      expect(checkVec3(raw, '(1,-2,3/2)')).toBe(false);
    expect(readVec3('('.repeat(250))).toBeNull();
    expect(vec3Text(vec3('1/2', 0, -2))).toBe('(1/2, 0, -2)');
  });
  it('checks 729 vector pairs and midpoint/dot/length identities against independent numeric coordinates', () => {
    const ps = smallPoints();
    let count = 0;
    for (const a of ps)
      for (const b of ps) {
        const u = nums(a),
          v = nums(b),
          sum = addVec3(a, b),
          diff = subVec3(b, a),
          mid = midpointVec3(a, b);
        for (let i = 0; i < 3; i++) {
          expect(nums(sum)[i]).toBeCloseTo(u[i]! + v[i]!, 12);
          expect(nums(diff)[i]).toBeCloseTo(v[i]! - u[i]!, 12);
          expect(nums(mid)[i]).toBeCloseTo((u[i]! + v[i]!) / 2, 12);
        }
        const dot = u.reduce((s, x, i) => s + x * v[i]!, 0);
        expect(Number(dotVec3(a, b)[0])).toBe(dot);
        expect(sameR(dotVec3(a, b), dotVec3(b, a))).toBe(true);
        expect(sameVec3(subVec3(sum, b), a)).toBe(true);
        count++;
      }
    expect(count).toBe(729);
    expect(vec3Text(subVec3(vec3(4, 2, -1), vec3(1, -2, 3)))).toBe(
      '(3, 4, -4)',
    );
    expect(textR(squareVec3(vec3(3, 4, -4)))).toBe('41');
  });
  it('keeps zero-vector dot zero distinct from angle existence and independently classifies all nonzero small pairs', () => {
    const ps = smallPoints();
    for (const u of ps)
      for (const v of ps) {
        const a = nums(u),
          b = nums(v),
          aa = a.reduce((s, x) => s + x * x, 0),
          bb = b.reduce((s, x) => s + x * x, 0),
          dot = a.reduce((s, x, i) => s + x * b[i]!, 0),
          got = spatialAngle(u, v);
        if (!aa || !bb) {
          expect(got.kind).toBe('undefined');
          expect(got.cosine).toBeNull();
          continue;
        }
        const cos = dot / Math.sqrt(aa * bb),
          expected =
            Math.abs(cos - 1) < 1e-12
              ? 'zero-angle'
              : Math.abs(cos + 1) < 1e-12
                ? 'straight'
                : dot === 0
                  ? 'right'
                  : dot > 0
                    ? 'acute'
                    : 'obtuse';
        expect(got.kind).toBe(expected);
        expect(
          checkAnswer(got.cosine!, {
            kind: 'radical',
            value: `${dot}/sqrt(${aa * bb})`,
          }),
        ).toBe(true);
      }
    expect(spatialAngle(vec3(1, 2, -1), vec3(2, -1, 0)).cosine).toBe('0');
    expect(spatialAngle(vec3(1, 2, -1), vec3(1, 0, 0)).cosine).toBe('√6/6');
  });
  it('checks 9750 point-plane projections, incidence, normal displacements and negative normal scaling', () => {
    let count = 0;
    for (const n of smallPoints()) {
      const nn = nums(n),
        norm = nn.reduce((s, x) => s + x * x, 0);
      if (!norm) continue;
      for (const d of [-1, 0, 1])
        for (let x = -2; x <= 2; x++)
          for (let y = -2; y <= 2; y++)
            for (let z = -2; z <= 2; z++) {
              const p = vec3(x, y, z),
                plane = vectorPlane3(n, d),
                result = pointPlaneProjection(p, plane),
                s = nn[0] * x + nn[1] * y + nn[2] * z - d,
                expected = [x, y, z].map((q, i) => q - (s * nn[i]!) / norm),
                sq = (s * s) / norm;
              nums(result.foot).forEach((v, i) =>
                expect(v).toBeCloseTo(expected[i]!, 11),
              );
              expect(planeResidual3(plane, result.foot)[0]).toBe(0n);
              expect(
                Number(result.distanceSquare[0]) /
                  Number(result.distanceSquare[1]),
              ).toBeCloseTo(sq, 11);
              const scaled = pointPlaneProjection(
                p,
                vectorPlane3(scaleVec3(rational(-2n), n), -2 * d),
              );
              expect(sameVec3(scaled.foot, result.foot)).toBe(true);
              expect(sameR(scaled.distanceSquare, result.distanceSquare)).toBe(
                true,
              );
              count++;
            }
    }
    expect(count).toBe(9750);
  });
  it('checks 5616 point-line feet and perpendicular residuals with an independent projection formula', () => {
    const origins = [
      vec3(0, 0, 0),
      vec3(1, 0, 0),
      vec3(0, 1, 0),
      vec3(0, 0, 1),
      vec3(1, 1, 0),
      vec3(1, 0, 1),
      vec3(0, 1, 1),
      vec3(1, 1, 1),
    ];
    let count = 0;
    for (const origin of origins)
      for (const direction of smallPoints()) {
        const d = nums(direction),
          norm = d.reduce((s, x) => s + x * x, 0);
        if (!norm) continue;
        for (const p of smallPoints()) {
          const a = nums(origin),
            pp = nums(p),
            w = pp.map((v, i) => v - a[i]!),
            parameter = w.reduce((s, v, i) => s + v * d[i]!, 0) / norm,
            expected = a.map((v, i) => v + parameter * d[i]!),
            r = pointLineProjection(p, vectorLine3(origin, direction));
          nums(r.foot).forEach((v, i) =>
            expect(v).toBeCloseTo(expected[i]!, 11),
          );
          expect(dotVec3(r.displacement, direction)[0]).toBe(0n);
          const sq = pp.reduce((s, v, i) => s + (v - expected[i]!) ** 2, 0);
          expect(
            Number(r.distanceSquare[0]) / Number(r.distanceSquare[1]),
          ).toBeCloseTo(sq, 11);
          count++;
        }
      }
    expect(count).toBe(5616);
    const r = pointLineProjection(
      vec3(3, 4, 5),
      vectorLine3(vec3(1, 0, 1), vec3(1, 1, 0)),
    );
    expect(vec3Text(r.foot)).toBe('(4, 3, 1)');
    expect(r.distance).toBe('3√2');
  });
  it('distinguishes strict parallelism, containment, unique intersection and perpendicularity', () => {
    const plane = vectorPlane3(vec3(0, 0, 1), 0),
      cases = [
        vectorLine3(vec3(0, 0, 1), vec3(1, 0, 0)),
        vectorLine3(zeroVec3(), vec3(1, 0, 0)),
        vectorLine3(vec3(0, 0, 1), vec3(1, 0, -1)),
        vectorLine3(vec3(0, 0, 1), vec3(0, 0, -1)),
      ];
    cases.forEach((l, i) => {
      const r = vectorLinePlaneRelation(l, plane);
      expect(r.kind).toBe(
        ['parallel', 'contained', 'intersecting', 'intersecting'][i],
      );
      expect(r.perpendicular).toBe(i === 3);
      if (r.intersection)
        expect(planeResidual3(plane, r.intersection)[0]).toBe(0n);
    });
    const throughOrigin = vectorLinePlaneRelation(
      vectorLine3(zeroVec3(), vec3(0, 0, 1)),
      plane,
    );
    expect(textR(throughOrigin.parameter!)).toBe('0');
    expect(vec3Text(throughOrigin.intersection!)).toBe('(0, 0, 0)');
    const a = vectorLine3(zeroVec3(), vec3(1, 0, 0));
    expect(
      vectorLineRelation(a, vectorLine3(vec3(0, 1, 1), vec3(0, 1, 0))),
    ).toBe('skew');
    expect(
      vectorLineRelation(a, vectorLine3(vec3(0, 1, 0), vec3(0, 1, 0))),
    ).toBe('intersecting');
    expect(
      vectorLineRelation(a, vectorLine3(vec3(0, 1, 0), vec3(2, 0, 0))),
    ).toBe('parallel');
    expect(
      vectorLineRelation(a, vectorLine3(vec3(1, 0, 0), vec3(-2, 0, 0))),
    ).toBe('coincident');
    expect(vectorPlaneRelation(plane, vectorPlane3(vec3(0, 0, -2), 0))).toBe(
      'coincident',
    );
    expect(vectorPlaneRelation(plane, vectorPlane3(vec3(0, 0, -2), -4))).toBe(
      'parallel',
    );
    expect(vectorPlaneRelation(plane, vectorPlane3(vec3(1, 0, 0), 0))).toBe(
      'intersecting',
    );
  });
  it('refuses zero directions and normals while retaining zero distance on valid objects', () => {
    expect(() => vectorLine3(zeroVec3(), zeroVec3())).toThrow();
    expect(() => vectorPlane3(zeroVec3(), 0)).toThrow();
    expect(() =>
      pointPlaneProjection(zeroVec3(), {
        normal: zeroVec3(),
        offset: rational(0n),
      }),
    ).toThrow();
    expect(() =>
      pointLineProjection(zeroVec3(), {
        point: zeroVec3(),
        direction: zeroVec3(),
      }),
    ).toThrow();
    const plane = vectorPlane3(vec3(1, 2, 2), 3);
    expect(pointPlaneProjection(vec3(1, 0, 1), plane).distance).toBe('0');
    expect(pointPlaneProjection(vec3(3, 4, 5), plane).distance).toBe('6');
  });
});
