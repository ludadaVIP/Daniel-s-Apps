import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { analyticGeometryRecurrenceRetrieval } from './content/analyticGeometryRecurrenceRetrieval';
import { analyticGeometryRecurrenceEvidence } from './content/analyticGeometryRecurrenceEvidence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import { plotBounds } from './cartesianModels';
import { textR, addR, mulR, divR, negR } from './algebraModels';
import { readRational as R } from './rationalModels';
import { compareR } from './inequalityModels';
import { solveQuadratic } from './quadraticModels';
import { readRadical, radicalText, sameRadical } from './radicalModels';
import { equalPolynomial, polynomialValue } from './polynomialModels';
import { rationalCircle, checkPointSet } from './analyticGeometryModels';
import {
  vectorFromStrings,
  addV,
  subtractV,
  scaleV,
  midpointV,
  dotV,
  crossV,
  angleV,
  lengthV,
} from './vectorModels';
const minus = (a: ReturnType<typeof R>, b: ReturnType<typeof R>) =>
  addR(a, negR(b));
const normal = (s: string) => s.replaceAll('−', '-');
const sets = Object.values(analyticGeometryRecurrenceRetrieval);
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
describe('analytic geometry recurrence', () => {
  it('covers all five H36 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => l.unit === 'H36')
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(5);
    expect(
      new Set(analyticGeometryRecurrenceEvidence.map((e) => e.skill)),
    ).toEqual(actual);
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of analyticGeometryRecurrenceEvidence) {
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
  it('keeps ten bilingual derivations human-reviewed and outside canonical checks', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(10);
    for (const s of sets) {
      expect(s.questions).toHaveLength(5);
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

  it('solves the actual complete line parameters before points and checks degree reductions separately from tangency', () => {
    for (const [key, r, cy, dir, disc, px] of [
      ['H37_ANALYTIC_GEOMETRY', 10, 6, 2, '1024', 3],
      ['H38_ANALYTIC_GEOMETRY', 5, 4, -1, '36', -2],
    ] as const) {
      const q = analyticGeometryRecurrenceRetrieval[key].questions[0]!,
        d = q.diagram!;
      if (d.kind !== 'cartesian') throw Error('Given circle needed');
      expect(() => plotBounds(d.bounds)).not.toThrow();
      expect(d.points).toHaveLength(0);
      expect(d.curves).toHaveLength(2);
      expect(400 / (d.bounds.xMax - d.bounds.xMin)).toBe(
        280 / (d.bounds.yMax - d.bounds.yMin),
      );
      for (const p of d.curves![0]!.points)
        expect(p.x * p.x + p.y * p.y).toBeCloseTo(r * r, 10);
      expect(d.curves![1]!.points.every((p) => p.y === cy)).toBe(true);
      const eq = normal(q.solution.en).match(/First:([^ ]+)=0 gives/)![1]!,
        model = solveQuadratic(eq.replaceAll('t', 'x') + '=0');
      expect(model.kind).toBe('quadratic');
      expect(textR(model.discriminant!)).toBe(disc);
      const roots = model.roots!.map(radicalText),
        origin = vectorFromStrings('0', String(cy)),
        direction = vectorFromStrings(String(dir), '0');
      const points = roots.map((t) => addV(origin, scaleV(R(t), direction)));
      for (const point of points) {
        expect(textR(dotV(point, point))).toBe(String(r * r));
        expect(textR(point[1])).toBe(String(cy));
      }
      const original = normal(q.solution.en).match(/points(\{[^}]+\})/)![1]!;
      expect(
        checkPointSet(
          original,
          '{' +
            points
              .map((p) => '(' + textR(p[0]) + ',' + textR(p[1]) + ')')
              .join(';') +
            '}',
        ),
      ).toBe(true);
      const tangent = solveQuadratic('4x²=0');
      expect(tangent.repeated).toBe(true);
      expect(tangent.roots!.map(radicalText)).toEqual(['0']);
      const vertical = solveQuadratic(String(px * px) + '-x=0');
      expect(vertical.kind).toBe('linear');
      expect(vertical.repeated).toBe(false);
      expect(vertical.roots!.map(radicalText)).toEqual([String(px * px)]);
      const none = solveQuadratic('0=1');
      expect(none.kind).toBe('contradiction');
      expect(none.discriminant).toBeNull();
      expect(none.roots).toEqual([]);
      expect(q.solution.en).toContain('zero direction encodes just a point');
      expect(q.solution.en).toContain('NO finite points');
    }
  });
  it('reconstructs the unique source of every translated midpoint candidate and retains half-plane and missing-point conditions', () => {
    for (const [key, ax, ay, r, candidates, omitted] of [
      [
        'H37_ANALYTIC_GEOMETRY',
        '4',
        '2',
        6,
        [
          ['5', '1'],
          ['-1', '1'],
          ['2', '4'],
          ['2', '-2'],
        ],
        ['6', '0'],
      ],
      [
        'H38_ANALYTIC_GEOMETRY',
        '-2',
        '4',
        4,
        [
          ['-3', '2'],
          ['1', '2'],
          ['-1', '0'],
          ['-1', '4'],
        ],
        ['-4', '0'],
      ],
    ] as const) {
      const q = analyticGeometryRecurrenceRetrieval[key].questions[1]!,
        A = vectorFromStrings(ax, ay),
        eq = normal(q.solution.en).match(/gives([^,]+),/)![1]!,
        parts = eq.split('=');
      expect(
        equalPolynomial(
          '(2x-(' + ax + '))²+(2y-(' + ay + '))²-' + r * r,
          '4((' + parts[0] + ')-(' + parts[1] + '))',
          ['x', 'y'],
        ),
      ).toBe(true);
      const admits = candidates.map((pair) => {
        const M = vectorFromStrings(pair[0], pair[1]),
          P = subtractV(scaleV(R('2'), M), A);
        expect(textR(dotV(P, P))).toBe(String(r * r));
        expect(midpointV(A, P).map(textR)).toEqual(M.map(textR));
        const half =
          key === 'H37_ANALYTIC_GEOMETRY' ? P[1][0] >= 0n : P[1][0] <= 0n;
        return (
          half && !(textR(P[0]) === omitted[0] && textR(P[1]) === omitted[1])
        );
      });
      expect(admits).toEqual([false, true, true, false]);
      expect(q.solution.en).toContain('inverse is unique');
      expect(q.solution.en).toContain('EVERY retained candidate');
      expect(q.solution.en).toContain('closed endpoints remain included');
    }
  });
  it('proves rational-circle image identities and inverse reconstruction,then checks new arcs,chords and derivative magnitude', () => {
    expect(equalPolynomial('(1-x²)²+4x²', '(1+x²)²', ['x'])).toBe(true);
    expect(equalPolynomial('-2x(1+x²)-2x(1-x²)', '-4x', ['x'])).toBe(true);
    expect(equalPolynomial('16x²+4(1-x²)²', '4(1+x²)²', ['x'])).toBe(true);
    for (const [key, r, expected] of [
      ['H37_ANALYTIC_GEOMETRY', 6, '{(6,0);(0,6);(-18/5,24/5)}'],
      ['H38_ANALYTIC_GEOMETRY', 4, '{(4,0);(0,4);(-12/5,16/5)}'],
    ] as const) {
      const q = analyticGeometryRecurrenceRetrieval[key].questions[2]!;
      expect(q.stem.en).toContain('r=' + r);
      const pointAt = (t: string) => {
        const base = rationalCircle(3, t);
        return scaleV(
          R(r + '/3'),
          vectorFromStrings(base.point[0], base.point[1]),
        );
      };
      const points = ['0', '1', '2'].map(pointAt),
        actual = normal(q.solution.en).match(
          /Points((?:\([^()]+\),?){3}) have/,
        )![1]!;
      expect(checkPointSet('{' + actual + '}', expected)).toBe(true);
      const written = q.solution.en
        .match(/(?:chord lengths|chords)\s*([^,]+),\s*unequal/)![1]!
        .trim()
        .split(/\s+and\s+/);
      expect(written).toHaveLength(2);
      for (let i = 0; i < 2; i++)
        expect(
          sameRadical(
            readRadical(written[i]!)!,
            readRadical(lengthV(subtractV(points[i + 1]!, points[i]!)))!,
          ),
        ).toBe(true);
      expect(
        compareR(
          dotV(
            subtractV(points[1]!, points[0]!),
            subtractV(points[1]!, points[0]!),
          ),
          dotV(
            subtractV(points[2]!, points[1]!),
            subtractV(points[2]!, points[1]!),
          ),
        ),
      ).toBeGreaterThan(0);
      for (const t of ['-2', '-1', '0', '1/2', '1', '2']) {
        const P = pointAt(t);
        expect(textR(dotV(P, P))).toBe(String(r * r));
        expect(textR(divR(P[1], addR(P[0], R(String(r)))))).toBe(t);
        const input = R(t),
          admitted =
            key === 'H37_ANALYTIC_GEOMETRY'
              ? compareR(input, R('-1')) >= 0 && compareR(input, R('1')) <= 0
              : compareR(input, R('1')) >= 0;
        const image =
          key === 'H37_ANALYTIC_GEOMETRY'
            ? P[0][0] >= 0n
            : P[0][0] <= 0n && P[1][0] > 0n;
        expect(image).toBe(admitted);
      }
      const circle = 'x²+y²-' + r * r,
        D = '(x+' + r + ')²+y²';
      expect(
        equalPolynomial(D + '-' + 2 * r + '(x+' + r + ')', circle, ['x', 'y']),
      ).toBe(true);
      expect(
        equalPolynomial(
          r + '((x+' + r + ')²-y²)-x(' + D + ')',
          '-(x+' + r + ')(' + circle + ')',
          ['x', 'y'],
        ),
      ).toBe(true);
      expect(
        equalPolynomial(
          2 * r + 'y(x+' + r + ')-y(' + D + ')',
          '-y(' + circle + ')',
          ['x', 'y'],
        ),
      ).toBe(true);
      expect(q.solution.en).toContain('magnitude 2r/(1+t²)');
      expect(q.solution.en).toContain('finite-parameter values');
      expect(normal(q.solution.en)).toContain(
        key === 'H37_ANALYTIC_GEOMETRY'
          ? 'including(0,-6),(0,6)'
          : 'excluding(-4,0)',
      );
    }
  });
  it('derives the actual translated dot polynomial and all boundary angle classes from given point identities', () => {
    for (const [key, qy, tx, expectedDots] of [
      ['H37_ANALYTIC_GEOMETRY', '4', '7', ['-21', '-25', '11', '11']],
      ['H38_ANALYTIC_GEOMETRY', '6', '3', ['-12', '-16', '9', '9']],
    ] as const) {
      const q = analyticGeometryRecurrenceRetrieval[key].questions[3]!,
        d = q.diagram!;
      if (d.kind !== 'cartesian') throw Error('Given diameter probes needed');
      expect(() => plotBounds(d.bounds)).not.toThrow();
      expect(d.curves).toHaveLength(1);
      expect(d.points).toHaveLength(4);
      expect(400 / (d.bounds.xMax - d.bounds.xMin)).toBe(
        280 / (d.bounds.yMax - d.bounds.yMin),
      );
      const byName = (name: string) => {
        const p = d.points.find((p) => p.label === name)!;
        return vectorFromStrings(String(p.x), String(p.y));
      };
      const A = byName('A'),
        B = byName('B'),
        C = byName('C'),
        P = byName('P'),
        Q = vectorFromStrings(textR(C[0]), qy),
        T = vectorFromStrings(tx, textR(C[1]));
      const actual = normal(q.solution.en).match(/dot=([^.]*)\./)![1]!,
        expanded =
          '(' +
          textR(A[0]) +
          '-x)(' +
          textR(B[0]) +
          '-x)+(' +
          textR(A[1]) +
          '-y)(' +
          textR(B[1]) +
          '-y)';
      expect(equalPolynomial(actual, expanded, ['x', 'y'])).toBe(true);
      for (const [i, M] of [P, C, Q, T].entries()) {
        const u = subtractV(A, M),
          v = subtractV(B, M),
          angle = angleV(u, v);
        expect(textR(angle.dot)).toBe(expectedDots[i]);
        expect(angle.kind).toBe(
          ['obtuse', 'straight', 'acute', 'zero-angle'][i],
        );
        expect(crossV(u, v)[0] === 0n).toBe(i === 1 || i === 3);
        expect(
          polynomialValue(actual, ['x', 'y'], {
            x: textR(M[0]),
            y: textR(M[1]),
          }),
        ).toBe(expectedDots[i]);
      }
      for (const M of [A, B]) {
        expect(angleV(subtractV(A, M), subtractV(B, M)).kind).toBe('undefined');
        expect(
          polynomialValue(actual, ['x', 'y'], {
            x: textR(M[0]),
            y: textR(M[1]),
          }),
        ).toBe('0');
      }
      const radius = divR(minus(B[0], A[0]), R('2')),
        top = addV(C, vectorFromStrings('0', textR(radius)));
      expect(angleV(subtractV(A, top), subtractV(B, top)).kind).toBe('right');
      expect(q.solution.en).toContain('SAME endpoint exclusions');
    }
  });
  it('checks complete roof intervals and displaced passages with exact coordinates,not central height or sampled pixels', () => {
    for (const [key, a, b, heights, halves, widths, farHeightSquare] of [
      [
        'H37_ANALYTIC_GEOMETRY',
        10,
        5,
        ['3', '4'],
        ['8', '6'],
        ['16', '12'],
        '51/4',
      ],
      [
        'H38_ANALYTIC_GEOMETRY',
        8,
        4,
        ['12/5', '16/5'],
        ['32/5', '24/5'],
        ['64/5', '48/5'],
        '759/100',
      ],
    ] as const) {
      const q = analyticGeometryRecurrenceRetrieval[key].questions[4]!,
        d = q.diagram!;
      if (d.kind !== 'cartesian') throw Error('Upper roof needed');
      expect(() => plotBounds(d.bounds)).not.toThrow();
      expect(400 / (d.bounds.xMax - d.bounds.xMin)).toBeCloseTo(
        280 / (d.bounds.yMax - d.bounds.yMin),
        12,
      );
      expect(d.xLabel).toBe('x (m)');
      expect(d.yLabel).toBe('height y (m)');
      expect(d.curves).toHaveLength(2);
      expect(d.points.map((p) => [p.x, p.y])).toEqual([[0, b]]);
      for (const p of d.curves![0]!.points) {
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect((p.x * p.x) / (a * a) + (p.y * p.y) / (b * b)).toBeCloseTo(
          1,
          12,
        );
      }
      expect(d.curves![1]!.points.every((p) => p.y === 0)).toBe(true);
      const halfSquare = (H: string) =>
        mulR(
          R(String(a * a)),
          minus(R('1'), divR(mulR(R(H), R(H)), R(String(b * b)))),
        );
      heights.forEach((H, i) => {
        expect(
          radicalText(readRadical('sqrt(' + textR(halfSquare(H)) + ')')!),
        ).toBe(halves[i]);
        expect(textR(mulR(R('2'), R(halves[i]!)))).toBe(widths[i]);
        for (const x of [R(halves[i]!), negR(R(halves[i]!))])
          expect(
            textR(
              addR(
                divR(mulR(x, x), R(String(a * a))),
                divR(mulR(R(H), R(H)), R(String(b * b))),
              ),
            ),
          ).toBe('1');
        expect(q.solution.en).toContain(widths[i] + ' m');
      });
      const passage = [minus(R('1'), R(halves[1])), addR(R('1'), R(halves[1]))];
      const contained = halves.map(
        (half) =>
          compareR(passage[0]!, negR(R(half))) >= 0 &&
          compareR(passage[1]!, R(half)) <= 0,
      );
      expect(contained).toEqual([true, false]);
      const heightSquare = mulR(
        R(String(b * b)),
        minus(R('1'), divR(mulR(passage[1]!, passage[1]!), R(String(a * a)))),
      );
      expect(textR(heightSquare)).toBe(farHeightSquare);
      expect(
        compareR(heightSquare, mulR(R(heights[0]), R(heights[0]))),
      ).toBeGreaterThan(0);
      expect(
        compareR(heightSquare, mulR(R(heights[1]), R(heights[1]))),
      ).toBeLessThan(0);
      const written = q.solution.en.match(
        /height (?:at its right end )?is([^<]+)</,
      )![1]!;
      expect(
        sameRadical(
          readRadical(written)!,
          readRadical('sqrt(' + farHeightSquare + ')')!,
        ),
      ).toBe(true);
      expect(textR(halfSquare('0'))).toBe(String(a * a));
      expect(textR(halfSquare(String(b)))).toBe('0');
      expect(halfSquare(String(b + 1))[0]).toBeLessThan(0n);
      expect(q.solution.en).toContain('ENTIRE interval');
      expect(q.solution.en).toContain('positive-width passage');
      expect(q.solution.en).toContain('verifies neither loads');
    }
  });
});
