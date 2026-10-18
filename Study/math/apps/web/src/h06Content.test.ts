import { describe, it, expect } from 'vitest';
import {
  h06Lessons,
  h06CheckQuestions,
  h06ReviewQuestion,
} from './content/H06';
import {
  lessons,
  curriculum,
  openUnits,
  unitChecks,
  reviewQuestionFor,
} from './content';
import { checkAnswer } from './model';
import { rational, sameR, addR, mulR } from './algebraModels';
import { radicalNumber } from './trigModels';
import {
  spaceLineRelation,
  linePlaneRelation,
  planeRelation,
  cuboidVertices,
  solidCounts,
  solidVolume,
  sphereMeasures,
  cubeSection,
  exact3Text,
  foldCubeNet,
  solidNets,
  spaceDistances,
  joinedBoxes,
  compoundCase,
  boxVertices,
  checkSolidCode,
  type NetCell,
  type SpacePoint,
  type Box3,
} from './solidModels';
const bodies = import.meta.glob('../../../content/lessons/H06-*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const all = [
  ...h06Lessons.flatMap((l) => [l.guided, ...l.questions, l.exit]),
  ...h06CheckQuestions,
];
describe('H06 solid geometry foundations', () => {
  it('opens five verified planned titles with full bilingual bodies and earlier prerequisites', () => {
    const registry = curriculum
      .flatMap((s) => s.units)
      .flatMap((u) => u.lessons);
    expect(registry).toHaveLength(358);
    expect(lessons.length).toBeGreaterThanOrEqual(261);
    expect(openUnits.length).toBeGreaterThanOrEqual(49);
    expect(
      registry
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
    expect(
      registry
        .filter((l) => l.id.startsWith('H06-'))
        .map((l) => ({ id: l.id, title: l.title })),
    ).toEqual(h06Lessons.map((l) => ({ id: l.id, title: l.title })));
    expect(unitChecks.H06.questions).toEqual(h06CheckQuestions);
    for (const l of h06Lessons) {
      expect(l.contentStatus).toBe('ready');
      expect(l.questions).toHaveLength(6);
      expect(l.keywords).toHaveLength(3);
      expect(l.minutes).toBeLessThanOrEqual(20);
      for (const p of [...l.prerequisites, l.parent.bridge]) {
        const n = lessons.findIndex((v) => v.id === p);
        expect(n, p).toBeGreaterThanOrEqual(0);
        expect(n).toBeLessThan(lessons.indexOf(l));
      }
      const [zh, en] =
        bodies[`../../../content/lessons/${l.id}.md`]!.split('<!-- EN -->');
      expect(zh!.length).toBeGreaterThan(700);
      expect(en!.length).toBeGreaterThan(1400);
      expect(zh!.match(/### 例/g)).toHaveLength(2);
      expect(en!.match(/### Example/g)).toHaveLength(2);
      expect(reviewQuestionFor(l.id, 0)).toEqual(h06ReviewQuestion(l.id, 0));
    }
  });
  it('checks forty-eight authored anchors and canonical answers while preserving twelve human arguments', () => {
    const answers = [
      ['skew', 'parallel', 'intersecting', 'contained', 'intersecting'],
      ['8', '18', '5', '24', '36pi'],
      ['16', '6', '2sqrt(3)', 'invalid-net', '96'],
      ['13', '12', '4sqrt(10)', '4', '5/13'],
      ['60', '108', '6', '64', '480'],
    ];
    h06Lessons.forEach((l, i) => {
      [l.guided, ...l.questions.slice(1, 5)].forEach((q, j) =>
        expect(checkAnswer(answers[i]![j]!, q.answer), q.id).toBe(true),
      );
      expect(
        checkAnswer(String([1, 1, 2, 0, 0][i]), l.questions[0]!.answer),
      ).toBe(true);
    });
    expect(all).toHaveLength(48);
    expect(new Set(all.map((q) => q.id)).size).toBe(48);
    expect(all.filter((q) => q.answer.kind === 'explain')).toHaveLength(12);
    expect(all.filter((q) => q.answer.kind === 'choice')).toHaveLength(6);
    for (const q of all) {
      expect(q.hints).toHaveLength(2);
      expect(
        q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
      ).toBeTruthy();
      if (q.answer.kind === 'explain') {
        expect(checkAnswer('parallel volume', q.answer)).toBeNull();
        continue;
      }
      expect(checkAnswer(q.answer.value, q.answer), q.id).toBe(true);
      for (const a of q.answerChecks!.accepted)
        expect(checkAnswer(a, q.answer)).toBe(true);
      for (const a of q.answerChecks!.rejected)
        expect(checkAnswer(a, q.answer), `${q.id} rejects ${a}`).toBe(false);
    }
    expect(checkAnswer('24 cm^3', h06Lessons[1]!.questions[3]!.answer)).toBe(
      true,
    );
    expect(checkAnswer('24 cm²', h06Lessons[1]!.questions[3]!.answer)).toBe(
      false,
    );
    expect(checkSolidCode(' 异面 ', 'skew')).toBe(true);
    expect(checkSolidCode('parallel', 'coincident')).toBe(false);
  });
  it('distinguishes full lines and planes through affine changes, including containment and coincidence', () => {
    for (let a = 1; a <= 5; a++)
      for (let b = 1; b <= 4; b++)
        for (let h = 1; h <= 3; h++) {
          const v = cuboidVertices(a, b, h),
            shift: SpacePoint = [-3, 2, -1],
            change = (p: SpacePoint): SpacePoint => [
              2 * p[2] + shift[0],
              p[0] + shift[1],
              -p[1] + shift[2],
            ],
            p = v.map(change);
          for (const w of [v, p]) {
            expect(spaceLineRelation(w[0]!, w[1]!, w[2]!, w[6]!)).toBe('skew');
            expect(spaceLineRelation(w[0]!, w[1]!, w[2]!, w[3]!)).toBe(
              'parallel',
            );
            expect(spaceLineRelation(w[0]!, w[1]!, w[0]!, w[4]!)).toBe(
              'intersecting',
            );
            expect(spaceLineRelation(w[0]!, w[1]!, w[1]!, w[0]!)).toBe(
              'coincident',
            );
          }
          expect(linePlaneRelation(v[0]!, v[1]!, [0, 0, 1], 0)).toBe(
            'contained',
          );
          expect(linePlaneRelation(v[4]!, v[5]!, [0, 0, 1], 0)).toBe(
            'parallel',
          );
          expect(linePlaneRelation(v[0]!, v[4]!, [0, 0, 1], 0)).toBe(
            'intersecting',
          );
        }
    expect(planeRelation([0, 0, 1], 2, [0, 0, -2], -4)).toBe('coincident');
    expect(planeRelation([0, 0, 1], 2, [0, 0, -2], 4)).toBe('parallel');
    expect(planeRelation([0, 0, 1], 0, [0, 1, 0], 0)).toBe('intersecting');
    expect(() =>
      spaceLineRelation([0, 0, 0], [0, 0, 0], [1, 0, 0], [2, 0, 0]),
    ).toThrow();
    expect(() =>
      linePlaneRelation([0, 0, 0], [1, 0, 0], [0, 0, 0], 0),
    ).toThrow();
    expect(() => planeRelation([0, 0, 0], 0, [0, 0, 1], 0)).toThrow();
  });
  it('counts complete polyhedra, excludes spherical guide circles, and uses perpendicular height', () => {
    for (let n = 3; n <= 8; n++) {
      const edges = new Set<string>();
      for (let j = 0; j < n; j++) {
        const k = (j + 1) % n;
        for (const [a, b] of [
          [j, k],
          [j + n, k + n],
          [j, j + n],
        ])
          edges.add([a, b].sort((a, b) => a! - b!).join(','));
      }
      const m = solidCounts('prism', n);
      expect(m.edges).toBe(edges.size);
      expect(m.vertices - m.edges + m.faces).toBe(2);
      const p = solidCounts('pyramid', n);
      expect(p).toEqual({
        vertices: n + 1,
        edges: 2 * n,
        faces: n + 1,
        euler: 2,
      });
      for (let B = 1; B <= 20; B++)
        for (let h = 1; h <= 12; h++) {
          expect(
            sameR(solidVolume('prism', B, h), rational(BigInt(B * h))),
          ).toBe(true);
          expect(
            sameR(solidVolume('pyramid', B, h), rational(BigInt(B * h), 3n)),
          ).toBe(true);
        }
    }
    expect(solidCounts('sphere')).toEqual({
      vertices: 0,
      edges: 0,
      faces: 0,
      euler: null,
    });
    for (let r = 1; r <= 6; r++) {
      const m = sphereMeasures(r);
      expect(sameR(m.volumeCoefficient, rational(BigInt(4 * r ** 3), 3n))).toBe(
        true,
      );
      expect(sameR(m.surfaceCoefficient, rational(BigInt(4 * r * r)))).toBe(
        true,
      );
    }
    for (const n of [0, -1, 1.5, 13])
      expect(() => solidVolume('prism', 12, n)).toThrow();
    expect(() => sphereMeasures(0)).toThrow();
  });
  it('clips exact sections and preserves tangent points, edges, coincident faces and polygon dimension', () => {
    let cases = 0;
    for (let side = 1; side <= 8; side++)
      for (let twice = -2; twice <= 6 * side + 2; twice++) {
        const t = twice / 2,
          m = cubeSection(side, [1, 1, 1], rational(BigInt(twice), 2n)),
          positive = (x: number) => Math.max(0, x) ** 2,
          density =
            t < 0 || t > 3 * side
              ? 0
              : positive(t) -
                3 * positive(t - side) +
                3 * positive(t - 2 * side) -
                positive(t - 3 * side),
          expectedAreaSquare = (3 * density * density) / 4;
        expect(Number(m.areaSquare[0]) / Number(m.areaSquare[1])).toBeCloseTo(
          expectedAreaSquare,
          10,
        );
        const count =
          t < 0 || t > 3 * side
            ? 0
            : t === 0 || t === 3 * side
              ? 1
              : t <= side || t >= 2 * side
                ? 3
                : 6;
        expect(m.points).toHaveLength(count);
        expect(new Set(m.points.map(exact3Text)).size).toBe(count);
        for (const p of m.points) {
          expect(
            sameR(addR(addR(p[0], p[1]), p[2]), rational(BigInt(twice), 2n)),
          ).toBe(true);
          for (const r of p)
            expect(Number(r[0]) / Number(r[1])).toBeGreaterThanOrEqual(0);
        }
        const flipped = cubeSection(
          side,
          [-1, -1, -1],
          rational(BigInt(-twice), 2n),
        );
        expect(sameR(m.areaSquare, flipped.areaSquare)).toBe(true);
        expect(flipped.points).toHaveLength(count);
        cases++;
      }
    expect(cases).toBe(256);
    const horizontal = cubeSection(4, [0, 0, 1], rational(0n));
    expect(horizontal.dimension).toBe(2);
    expect(horizontal.area).toBe('16');
    const edge = cubeSection(4, [1, 1, 0], rational(0n));
    expect(edge.points).toHaveLength(2);
    expect(edge.dimension).toBe(1);
    expect(edge.area).toBe('0');
    const point = cubeSection(4, [1, 1, 1], rational(0n));
    expect(point.dimension).toBe(0);
    const pentagon = cubeSection(4, [2, 1, 1], rational(5n));
    expect(pentagon.points).toHaveLength(5);
    expect(sameR(pentagon.areaSquare, rational(1587n, 8n))).toBe(true);
    expect(
      checkAnswer('23sqrt(6)/4', { kind: 'radical', value: pentagon.area }),
    ).toBe(true);
    expect(() => cubeSection(4, [0, 0, 0], rational(1n))).toThrow();
    expect(() => cubeSection(0, [1, 1, 1], rational(1n))).toThrow();
  });
  it('recognises exactly eleven cube nets among all thirty-five free hexominoes and preserves face opposites', () => {
    const key = (cells: readonly NetCell[]) => {
      const variants: string[] = [];
      for (let mirror = 0; mirror < 2; mirror++)
        for (let turn = 0; turn < 4; turn++) {
          const moved = cells.map(([x0, y0]) => {
              let x = mirror ? -x0 : x0,
                y = y0;
              for (let j = 0; j < turn; j++) [x, y] = [-y, x];
              return [x, y] as NetCell;
            }),
            loX = Math.min(...moved.map((p) => p[0])),
            loY = Math.min(...moved.map((p) => p[1]));
          variants.push(
            moved
              .map(([x, y]) => [x - loX, y - loY])
              .sort((a, b) => a[0]! - b[0]! || a[1]! - b[1]!)
              .map((p) => p.join(','))
              .join(';'),
          );
        }
      return variants.sort()[0]!;
    };
    let shapes = new Map<string, NetCell[]>([['0,0', [[0, 0]]]]);
    for (let size = 2; size <= 6; size++) {
      const next = new Map<string, NetCell[]>();
      for (const cells of shapes.values())
        for (const [x, y] of cells)
          for (const [dx, dy] of [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ]) {
            const p: NetCell = [x + dx!, y + dy!];
            if (cells.some((c) => c[0] === p[0] && c[1] === p[1])) continue;
            const candidate = [...cells, p];
            next.set(key(candidate), candidate);
          }
      shapes = next;
    }
    expect(shapes.size).toBe(35);
    expect(
      [...shapes.values()].filter((c) => foldCubeNet(c).valid),
    ).toHaveLength(11);
    for (const cells of shapes.values()) {
      const m = foldCubeNet(cells);
      if (!m.valid) {
        expect(m.opposite(0)).toBeNull();
        continue;
      }
      for (let i = 0; i < 6; i++) {
        const opposite = m.opposite(i)!;
        expect(opposite).not.toBe(i + 1);
        expect(m.opposite(opposite - 1)).toBe(i + 1);
      }
      const moved = cells.map(([x, y]): NetCell => [-y + 3, x - 2]);
      expect(foldCubeNet(moved).valid).toBe(true);
    }
    expect(foldCubeNet(solidNets.cross).opposite(0)).toBe(3);
    expect(foldCubeNet(solidNets.cross).opposite(4)).toBe(6);
    expect(foldCubeNet(solidNets.stair).valid).toBe(true);
    expect(foldCubeNet(solidNets.rectangle).valid).toBe(false);
    expect(foldCubeNet(solidNets.strip).valid).toBe(false);
    expect(() => foldCubeNet([[0, 0]])).toThrow();
    expect(() =>
      foldCubeNet([
        [0, 0],
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
      ]),
    ).toThrow();
  });
  it('audits 512 cuboid distances and angle cosines independently from the drawing', () => {
    for (let a = 1; a <= 8; a++)
      for (let b = 1; b <= 8; b++)
        for (let h = 1; h <= 8; h++) {
          const m = spaceDistances(a, b, h),
            body = Math.hypot(a, b, h),
            base = Math.hypot(a, b);
          expect(radicalNumber(m.base)).toBeCloseTo(base, 12);
          expect(radicalNumber(m.body)).toBeCloseTo(body, 12);
          expect(radicalNumber(m.pointLine)).toBeCloseTo(Math.hypot(b, h), 12);
          expect(m.pointPlane).toBe(String(h));
          expect(m.skewDistance).toBe(String(b));
          expect(radicalNumber(m.linePlaneCos)).toBeCloseTo(base / body, 12);
          expect(radicalNumber(m.lineLineCos)).toBeCloseTo(a / body, 12);
          for (let p = -1; p <= a + 1; p++)
            expect((p - a) ** 2 + b * b + h * h).toBeGreaterThanOrEqual(
              b * b + h * h,
            );
        }
    const m = spaceDistances(3, 4, 12);
    expect(m.body).toBe('13');
    expect(m.linePlaneCos).toBe('5/13');
    expect(m.lineLineCos).toBe('3/13');
    expect(() => spaceDistances(3, 4, 0)).toThrow();
  });
  it('checks joined boxes against independent unit-cube exterior faces, including partial contact and scale', () => {
    const voxel = (a: Box3, b: Box3) => {
      const cells = new Set<string>();
      for (const box of [a, b])
        for (let x = box.min[0]; x < box.min[0] + box.size[0]; x++)
          for (let y = box.min[1]; y < box.min[1] + box.size[1]; y++)
            for (let z = box.min[2]; z < box.min[2] + box.size[2]; z++)
              cells.add(`${x},${y},${z}`);
      let area = 0;
      for (const raw of cells) {
        const [x, y, z] = raw.split(',').map(Number);
        for (const [dx, dy, dz] of [
          [1, 0, 0],
          [-1, 0, 0],
          [0, 1, 0],
          [0, -1, 0],
          [0, 0, 1],
          [0, 0, -1],
        ])
          if (!cells.has(`${x! + dx!},${y! + dy!},${z! + dz!}`)) area++;
      }
      return { volume: cells.size, area };
    };
    let cases = 0;
    for (let width = 1; width <= 4; width++)
      for (let depth = 1; depth <= 3; depth++)
        for (let topWidth = 1; topWidth <= 4; topWidth++)
          for (let offset = -1; offset <= 2; offset++) {
            const a: Box3 = { min: [0, 0, 0], size: [width, depth, 2] },
              b: Box3 = { min: [offset, 0, 2], size: [topWidth, 2, 1] },
              m = joinedBoxes(a, b),
              expected = voxel(a, b);
            expect(m.volume).toBe(expected.volume);
            expect(m.surface).toBe(expected.area);
            cases++;
          }
    expect(cases).toBe(192);
    for (const kind of ['top', 'full-width', 'side', 'gap'] as const)
      for (let scale = 1; scale <= 3; scale++) {
        const m = compoundCase(kind, scale),
          expected = voxel(m.a, m.b),
          base = compoundCase(kind);
        expect(m.surface).toBe(expected.area);
        expect(m.volume).toBe(expected.volume);
        expect(m.surface).toBe(base.surface * scale ** 2);
        expect(m.volume).toBe(base.volume * scale ** 3);
        expect(boxVertices(m.a)).toHaveLength(8);
      }
    expect(compoundCase().surface).toBe(108);
    expect(compoundCase('side').surface).toBe(112);
    expect(compoundCase('gap').surface).toBe(120);
    expect(compoundCase('full-width').surface).toBe(116);
    expect(() =>
      joinedBoxes(
        { min: [0, 0, 0], size: [2, 2, 2] },
        { min: [1, 1, 1], size: [2, 2, 2] },
      ),
    ).toThrow();
  });
  it('retrieves 120 distinct bilingual stems with exact answers and bounded independent IDs', () => {
    for (let i = 0; i < 5; i++) {
      const id = `H06-L0${i + 1}`,
        stems = new Set<string>();
      for (let k = 0; k < 24; k++) {
        const q = h06ReviewQuestion(id, k);
        stems.add(q.stem.en);
        expect(q.answer.kind).not.toBe('explain');
        if ('value' in q.answer)
          expect(checkAnswer(q.answer.value, q.answer), q.id).toBe(true);
        expect(h06ReviewQuestion(id, k + 24).answer).toEqual(q.answer);
        expect(h06ReviewQuestion(id, k + 24).id).not.toBe(q.id);
      }
      expect(stems.size, id).toBe(24);
      expect(h06ReviewQuestion(id, 100000).id).toContain('100000');
    }
    expect(
      checkAnswer('sqrt(29)', h06ReviewQuestion('H06-L04', 0).answer),
    ).toBe(true);
    expect(checkAnswer('2', h06ReviewQuestion('H06-L04', 1).answer)).toBe(true);
    for (const n of [-1, 1.5, NaN, Infinity, 100001])
      expect(() => h06ReviewQuestion('H06-L01', n)).toThrow();
    expect(() => h06ReviewQuestion('H06-L06', 0)).toThrow();
    expect(60000 / 1000).toBe(60);
    expect((108 * 10 ** 2) / 10000).toBe(1.08);
    expect(Math.ceil(1.08 / 0.5)).toBe(3);
    expect(sameR(mulR(rational(60n), rational(1000n)), rational(60000n))).toBe(
      true,
    );
  });
});
