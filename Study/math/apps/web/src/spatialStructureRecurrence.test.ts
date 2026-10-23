import { describe, it, expect } from 'vitest';
import { curriculum, lessons, lessonById, unitChecks } from './content';
import { spatialStructureRetrieval } from './content/spatialStructureRetrieval';
import { spatialStructureRecurrence } from './content/spatialStructureRecurrence';
import { maintenanceSets } from './content/maintenance';
import { checkAnswer } from './model';
import { recurrenceLinksFor } from './recurrenceTargets';
import {
  spaceLineRelation,
  solidCounts,
  solidVolume,
  cubeSection,
  foldCubeNet,
  solidNets,
  spaceDistances,
  joinedBoxes,
} from './solidModels';
import { textR } from './algebraModels';
import { readRational as R } from './rationalModels';
import { checkRadical } from './radicalModels';
import { plotPosition } from './cartesianModels';
const sets = Object.values(spatialStructureRetrieval);
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
describe('spatial structure recurrence', () => {
  it('covers all five H06 skills through exact tasks in distinct later units', () => {
    const actual = new Set(
      lessons
        .filter((l) => l.unit === 'H06')
        .flatMap((l) => [l.guided, ...l.questions, l.exit].map((q) => q.skill)),
    );
    expect(actual.size).toBe(5);
    expect(new Set(spatialStructureRecurrence.map((e) => e.skill))).toEqual(
      actual,
    );
    const units = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const e of spatialStructureRecurrence) {
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
  it('keeps twelve bilingual derivations human-reviewed and outside canonical checks', () => {
    expect(sets.flatMap((s) => s.questions)).toHaveLength(12);
    for (const s of sets) {
      expect(s.questions).toHaveLength(6);
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

  it('requires distinct endpoints and verifies nonparallel disjoint lines in both coordinate configurations', () => {
    for (const [a, b, c, d] of [
      [
        [0, 0, 0],
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      [
        [1, 1, 1],
        [3, 1, 1],
        [1, 3, 1],
        [1, 1, 3],
      ],
    ] as const) {
      expect(spaceLineRelation(a, b, c, d)).toBe('skew');
      expect(() => spaceLineRelation(a, a, c, d)).toThrow('Two distinct');
      expect(a[2]).toBe(b[2]);
      expect(a[2]).toBe(c[2]);
      expect(d[2]).not.toBe(a[2]);
    }
  });
  it('checks face identities, Euler counts and perpendicular-height volumes without counting a curved sphere as a polygon face', () => {
    for (const [n, area, height, prism, pyramid, counts] of [
      [
        5,
        15,
        4,
        '60',
        '20',
        [
          [10, 15, 7],
          [6, 10, 6],
        ],
      ],
      [
        6,
        18,
        5,
        '90',
        '30',
        [
          [12, 18, 8],
          [7, 12, 7],
        ],
      ],
    ] as const) {
      for (const [j, kind] of (['prism', 'pyramid'] as const).entries()) {
        const c = solidCounts(kind, n);
        expect([c.vertices, c.edges, c.faces]).toEqual(counts[j]);
        expect(c.vertices - c.edges + c.faces).toBe(2);
        expect(textR(solidVolume(kind, area, height))).toBe(
          j === 0 ? prism : pyramid,
        );
      }
    }
    expect(solidCounts('sphere').euler).toBeNull();
  });
  it('checks complete section vertices, exact areas and point/edge/empty degeneracies', () => {
    const triangle = cubeSection(2, [1, 1, 1], R('2'));
    expect(new Set(triangle.points.map((p) => p.map(textR).join(',')))).toEqual(
      new Set(['2,0,0', '0,2,0', '0,0,2']),
    );
    expect(checkRadical(triangle.area, '2√3')).toBe(true);
    const point = cubeSection(2, [1, 1, 1], R('6'));
    expect(point.dimension).toBe(0);
    expect(point.points.map((p) => p.map(textR))).toEqual([['2', '2', '2']]);
    expect(cubeSection(2, [1, 1, 1], R('7')).points).toEqual([]);
    const rectangle = cubeSection(3, [1, 1, 0], R('3'));
    expect(
      new Set(rectangle.points.map((p) => p.map(textR).join(','))),
    ).toEqual(new Set(['0,3,0', '3,0,0', '3,0,3', '0,3,3']));
    expect(checkRadical(rectangle.area, '9√2')).toBe(true);
    const edge = cubeSection(3, [1, 1, 0], R('0'));
    expect(edge.dimension).toBe(1);
    expect(new Set(edge.points.map((p) => p.map(textR).join(',')))).toEqual(
      new Set(['0,0,0', '0,0,3']),
    );
    expect(cubeSection(3, [1, 1, 0], R('-1')).points).toEqual([]);
  });
  it('folds the actual numbered square diagrams with equal display scales and checks every opposite pair and invalid competitor', () => {
    for (const [key, opposites] of [
      ['H23_SOLID', [3, 4, 1, 2, 6, 5]],
      ['H36_SOLID', [4, 5, 6, 1, 2, 3]],
    ] as const) {
      const q = spatialStructureRetrieval[key].questions[3]!,
        diagram = q.diagram!;
      expect(diagram.kind).toBe('cartesian');
      if (diagram.kind !== 'cartesian')
        throw Error('net must have a visible labelled diagram');
      const cells = diagram.curves!.map(
        (c) => [c.points[0]!.x, c.points[0]!.y] as const,
      );
      expect(cells).toHaveLength(6);
      const folded = foldCubeNet(cells);
      expect(folded.valid).toBe(true);
      expect(folded.uniqueNormals).toBe(6);
      expect([0, 1, 2, 3, 4, 5].map((i) => folded.opposite(i))).toEqual(
        opposites,
      );
      for (const [i, curve] of diagram.curves!.entries()) {
        const [x, y] = cells[i]!;
        expect(curve.points.map((p) => [p.x, p.y])).toEqual([
          [x, y],
          [x + 1, y],
          [x + 1, y + 1],
          [x, y + 1],
          [x, y],
        ]);
        expect(diagram.points[i]).toEqual({
          x: x + 0.5,
          y: y + 0.5,
          label: `${i + 1}`,
        });
        expect(diagram.caption!.en).toContain(`${i + 1}:(${x},${y})`);
      }
      const o = plotPosition({ x: 0, y: 0 }, diagram.bounds),
        right = plotPosition({ x: 1, y: 0 }, diagram.bounds),
        up = plotPosition({ x: 0, y: 1 }, diagram.bounds);
      expect(right.x - o.x).toBe(o.y - up.y);
    }
    expect(foldCubeNet(solidNets.rectangle).consistent).toBe(false);
    const strip = foldCubeNet(solidNets.strip);
    expect(strip.valid).toBe(false);
    expect(strip.frames[4]!.n).toEqual(strip.frames[0]!.n);
    expect(strip.frames[5]!.n).toEqual(strip.frames[1]!.n);
  });
  it('checks true body/base diagonals, perpendicular heights and complementary angle ratios', () => {
    for (const [a, b, h, base, body, cos] of [
      [2, 3, 6, '√13', '7', '√13/7'],
      [4, 4, 7, '4√2', '9', '4√2/9'],
    ] as const) {
      const d = spaceDistances(a, b, h);
      expect(checkRadical(d.base, base)).toBe(true);
      expect(checkRadical(d.body, body)).toBe(true);
      expect(checkRadical(d.linePlaneCos, cos)).toBe(true);
      expect(d.pointPlane).toBe(`${h}`);
      expect(d.baseSquare + h * h).toBe(d.bodySquare);
    }
  });
  it('subtracts both hidden face patches, preserves separated volumes and checks square/cube scaling', () => {
    for (const [large, small, z, volume, sum, surface] of [
      [[5, 4, 3], [2, 3, 2], 3, 72, 126, 114],
      [[6, 3, 2], [3, 2, 2], 2, 48, 104, 92],
    ] as const) {
      const a = { min: [0, 0, 0] as const, size: large },
        b = { min: [1, 0, z] as const, size: small };
      const r = joinedBoxes(a, b);
      expect(r).toMatchObject({ volume, sumSurface: sum, surface, contact: 6 });
      const gap = joinedBoxes(a, { ...b, min: [1, 0, z + 1] });
      expect(gap.volume).toBe(volume);
      expect(gap.surface).toBe(sum);
      expect(gap.contact).toBe(0);
      const scaled = joinedBoxes(
        { min: [0, 0, 0], size: [large[0] * 2, large[1] * 2, large[2] * 2] },
        {
          min: [2, 0, z * 2],
          size: [small[0] * 2, small[1] * 2, small[2] * 2],
        },
      );
      expect(scaled.volume).toBe(volume * 8);
      expect(scaled.surface).toBe(surface * 4);
      expect(scaled.contact).toBe(24);
    }
  });
});
