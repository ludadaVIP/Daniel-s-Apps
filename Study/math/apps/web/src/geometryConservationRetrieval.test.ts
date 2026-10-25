import { describe, it, expect } from 'vitest';
import { geometryConservationRetrieval } from './content/geometryConservationRetrieval';
import { geometryDataRecurrence } from './content/geometryDataRecurrence';
import { maintenanceForUnit, maintenanceHref } from './content/maintenance';
import { curriculum, lessons, unitChecks } from './content';
import { recurrenceLinksFor } from './recurrenceTargets';
import { checkAnswer } from './model';
import {
  convertGeometryUnit,
  conversionText,
  rectangleArea,
  triangleRearrangement,
  parallelogramCut,
  trapezoidRearrangement,
  cuboid,
  cuboidNet,
  type Point,
} from './geometryModels';
type R = [number, number];
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const norm = ([n, d]: R): R => {
  const g = gcd(n, d);
  return [n / g, d / g];
};
const r = (s: string): R =>
  s.includes('/')
    ? norm(s.split('/').map(Number) as R)
    : norm([
        Number(s) * 10 ** (s.split('.')[1]?.length ?? 0),
        10 ** (s.split('.')[1]?.length ?? 0),
      ]);
const text = (x: R) => (x[1] === 1 ? String(x[0]) : x.join('/'));
const times = (a: R, b: R): R => norm([a[0] * b[0], a[1] * b[1]]);
const sets = Object.values(geometryConservationRetrieval);
const data = (s: (typeof sets)[number], i: number) =>
  Object.fromEntries(
    s.questions[i]!.contextTable!.rows.map((row) => [row[0]!.en, row[2]!.en]),
  );
const area = (ps: Point[]) => {
  const p = ps[0]!;
  return (
    Math.abs(
      ps.slice(1, -1).reduce((sum, a, i) => {
        const b = ps[i + 2]!;
        return (
          sum + (a[0] - p[0]) * (b[1] - p[1]) - (a[1] - p[1]) * (b[0] - p[0])
        );
      }, 0),
    ) / 2
  );
};
const inside = (ps: Point[], [x, y]: Point) => {
  if (area(ps) === 0) return false;
  const cs = ps.map(([a, b], i) => {
    const [c, d] = ps[(i + 1) % ps.length]!;
    return (c - a) * (y - b) - (d - b) * (x - a);
  });
  return cs.every((c) => c > 1e-9) || cs.every((c) => c < -1e-9);
};
function checkPieces(original: Point[], a: Point[], b: Point[]) {
  const all = [...original, ...a, ...b],
    xs = all.map((p) => p[0]),
    ys = all.map((p) => p[1]);
  for (
    let x = Math.floor(Math.min(...xs));
    x < Math.ceil(Math.max(...xs));
    x += 0.5
  )
    for (
      let y = Math.floor(Math.min(...ys));
      y < Math.ceil(Math.max(...ys));
      y += 0.5
    ) {
      const p: Point = [x + 0.137, y + 0.293];
      expect(
        Number(inside(a, p)) + Number(inside(b, p)),
        JSON.stringify(p),
      ).toBe(Number(inside(original, p)));
    }
}
describe('P56 detailed conserved geometry and layout reasoning', () => {
  it('registers twelve bilingual human tasks with exact later bridges, preserving old default groups and formal identities', () => {
    expect(lessons).toHaveLength(358);
    expect(curriculum.flatMap((s) => s.units)).toHaveLength(67);
    expect(Object.keys(unitChecks)).toHaveLength(67);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    const ids = new Set<string>();
    for (const s of sets) {
      expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('P56'));
      expect(s.questions).toHaveLength(6);
      expect(maintenanceForUnit(s.unit)[0]!.id).not.toBe(s.id);
      for (const [i, q] of s.questions.entries()) {
        ids.add(q.id);
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.zh && h.en)).toBe(true);
        expect(q.answer.kind).toBe('explain');
        if (q.answer.kind === 'explain')
          expect(q.answer.rubric).toEqual(q.solution);
        expect(q.solutionSteps).toEqual([q.solution]);
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(checkAnswer('same units conserved volume', q.answer)).toBeNull();
        expect(s.bridgeByQuestion[q.id]).toBe('P56-L0' + (i + 1));
        expect(
          q.contextTable!.rows.every(
            (row) => row[0]!.zh === row[0]!.en && row[2]!.zh === row[2]!.en,
          ),
        ).toBe(true);
      }
    }
    expect(ids.size).toBe(12);
  });
  it('independently reconstructs all two-stage conversions, exact fractions, inverse chains and the selected subunit count', () => {
    for (const s of sets) {
      const q = s.questions[0]!,
        d = data(s, 0);
      const units = [
        ['L', 'cm', 'dm', 'm', 10],
        ['A', 'cm²', 'dm²', 'm²', 100],
        ['V', 'cm³', 'dm³', 'm³', 1000],
      ] as const;
      for (const [key, from, mid, to, factor] of units) {
        const original = r(d[key]!),
          middle = times(original, [1, factor]),
          last = times(middle, [1, factor]);
        expect(conversionText(convertGeometryUnit(d[key]!, from, to))).toBe(
          text(last),
        );
        expect(conversionText(convertGeometryUnit(text(middle), mid, to))).toBe(
          text(last),
        );
        expect(conversionText(convertGeometryUnit(text(last), to, from))).toBe(
          text(original),
        );
        expect(q.solution.en).toContain(`${key}=${text(last)}${to}`);
        expect(q.solution.en).toContain(
          `${text(original)}${from}=${text(middle)}${mid}=${text(last)}${to}`,
        );
      }
      const cc = times(r(d.C!), [1000, 1]);
      expect(q.solution.en).toContain(`C=${text(cc)}cm³=${text(cc)}mL`);
      expect(conversionText(convertGeometryUnit(d.C!, 'L', 'cm³'))).toBe(
        text(cc),
      );
      const subunits = 10 * 10 * 10,
        cubesPerSubunit = 10 * 10 * 10;
      expect(subunits * cubesPerSubunit).toBe(1000000);
      expect(q.solution.en).toContain(
        '100 cm³ cubes per layer, 10 layers and 1000 cubes',
      );
      expect(q.solution.en).toContain('1/1000 of the m³');
      expect(convertGeometryUnit(d.Z!, 'm²', 'cm²').n).toBe(0n);
      expect(() => convertGeometryUnit('0', 'cm²', 'cm')).toThrow(
        /same dimension/,
      );
      expect(q.solution.en).toContain(
        'common numerical zero does not convert area into length',
      );
    }
  });
  it('derives mixed-unit coverage from actual grid edges, rotation, inverse lengths and equal-perimeter counterexamples', () => {
    for (const s of sets) {
      const q = s.questions[1]!,
        d = data(s, 1),
        n = (k: string) => Number(d[k]);
      const l = n('R_L') * 100,
        w = n('R_W'),
        g = n('G'),
        cols = l / g,
        rows = w / g,
        A = l * w,
        P = 2 * (l + w);
      expect(Number.isInteger(cols) && Number.isInteger(rows)).toBe(true);
      expect(cols * rows * g * g).toBe(A);
      expect(q.solution.en).toContain(`${g}×${g}=${g * g}cm²`);
      expect(q.solution.en).toContain(`${cols} columns and ${rows} rows`);
      expect(q.solution.en).toContain(
        `area=${A}cm²=${text(norm([A, 10000]))}m²`,
      );
      expect(q.solution.en).toContain(
        `perimeter=${P}cm=${text(norm([P, 100]))}m`,
      );
      const original = new Set(
        Array.from(
          { length: cols * rows },
          (_, i) => `${i % cols},${Math.floor(i / cols)}`,
        ),
      );
      const rotated = new Set(
        Array.from(
          { length: rows * cols },
          (_, i) => `${Math.floor(i / rows)},${rows - 1 - (i % rows)}`,
        ),
      );
      expect(rotated).toEqual(original);
      const unknown = n('I_A') / n('I_W');
      expect(unknown * n('I_W')).toBe(n('I_A'));
      expect(q.solution.en).toContain(
        `other edge=${d.I_A}÷${d.I_W}=${unknown}cm`,
      );
      const p = rectangleArea(n('P_L'), n('P_W')),
        sq = rectangleArea(n('S'), n('S'));
      expect(p.perimeter).toBe(sq.perimeter);
      expect(p.area).not.toBe(sq.area);
      expect(q.solution.en).toContain(
        `P:area=${p.area}cm², perimeter=${p.perimeter}cm`,
      );
      expect(q.solution.en).toContain(
        `S:area=${sq.area}cm², perimeter=${sq.perimeter}cm`,
      );
      if (s.unit === 'P66') expect(sq.area).toBe(sq.perimeter);
    }
  });
  it('checks actual reflected triangle coordinates, one/two-copy coverage, partial area and a newly chosen base', () => {
    for (const s of sets) {
      const q = s.questions[2]!,
        d = data(s, 2),
        n = (k: string) => Number(d[k]),
        b = n('T_B'),
        h = n('T_H'),
        x = n('T_X');
      const points: Point[] = [
          [0, 0],
          [b, 0],
          [x, h],
        ],
        reflected = points.map(([px, py]) => [b - px, py] as Point),
        A = area(points);
      expect(n('T_R')).toBe(b - x);
      expect(area(reflected)).toBe(A);
      expect(A % 1).toBe(0.5);
      expect(Math.hypot(x, h)).toBe(n('T_AC'));
      const m = triangleRearrangement(b, h, n('T_R'));
      expect(m.mirror).toBe(true);
      expect(area(m.original)).toBe(A);
      expect(area(m.first)).toBe(A);
      expect(area(m.second)).toBe(A);
      checkPieces(m.pair.original, m.first, m.second);
      checkPieces(m.pair.rectangle, m.pair.remaining, m.pair.moved);
      expect(q.solution.en).toContain(`preserving ONE area=${A}cm²`);
      expect(q.solution.en).toContain(`pair area=${2 * A}cm²`);
      const newHeight = norm([2 * A, n('T_AC')]);
      expect(q.solution.en).toContain(
        `corresponding height=${text(newHeight)}cm`,
      );
      expect(newHeight[0] * n('T_AC')).toBe(2 * A * newHeight[1]);
      const inverseH = (2 * n('I_A')) / n('I_B');
      expect((inverseH * n('I_B')) / 2).toBe(n('I_A'));
      expect(q.solution.en).toContain(
        `height=${d.I_A}×2÷${d.I_B}=${inverseH}cm`,
      );
      const mixedBase = Number(d.M_B) * 100,
        mixedArea = (mixedBase * n('M_H')) / 2;
      expect(mixedArea / A).toBe(100);
      expect(q.solution.en).toContain(
        `area=${mixedArea}cm²=${text(norm([mixedArea, 10000]))}m²`,
      );
    }
  });
  it('rebuilds left/zero/right cuts without overlap or loss and verifies half-square trapezoids and inverse bases', () => {
    for (const s of sets) {
      const q = s.questions[3]!,
        d = data(s, 3),
        n = (k: string) => Number(d[k]),
        b = n('P_B'),
        h = n('P_H'),
        mag = n('P_S');
      for (const shift of [-mag, 0, mag]) {
        const m = parallelogramCut(b, h, shift);
        expect(area(m.original)).toBe(b * h);
        expect(area(m.cut)).toBe((Math.abs(shift) * h) / 2);
        expect(area(m.remaining) + area(m.cut)).toBe(b * h);
        expect(m.moved).toEqual(m.cut.map(([x, y]) => [x + b, y]));
        checkPieces(m.original, m.cut, m.remaining);
        checkPieces(m.rectangle, m.moved, m.remaining);
      }
      expect(q.solution.en).toContain(
        `nonzero cut=${mag}×${h}÷2=${(mag * h) / 2}cm²; remaining=${b * h - (mag * h) / 2}cm²`,
      );
      const a = n('T_A'),
        tb = n('T_B'),
        th = n('T_H'),
        A = ((a + tb) * th) / 2;
      for (const [top, bottom] of [
        [a, tb],
        [tb, a],
        [tb, tb],
      ]) {
        const m = trapezoidRearrangement(top!, bottom!, th, 0);
        expect(area(m.first)).toBe(((top! + bottom!) * th) / 2);
        checkPieces(m.pair.original, m.first, m.second);
        expect(m.isParallelogram).toBe(top === bottom);
      }
      expect(A % 1).toBe(0.5);
      expect(q.solution.en).toContain(`one=${text(norm([2 * A, 2]))}cm²`);
      const base = n('I_A') / n('I_H');
      expect(q.solution.en).toContain(`base=${d.I_A}÷${d.I_H}=${base}cm`);
    }
  });
  it('counts actual cube positions, distinguishes internal capacity and derives eightfold scaling and inverse height', () => {
    for (const s of sets) {
      const q = s.questions[4]!,
        d = data(s, 4),
        n = (k: string) => Number(d[k]),
        l = n('I_L'),
        w = n('I_D'),
        h = n('I_H'),
        V = l * w * h;
      const m = cuboid(l, w, h),
        positions = new Set(m.cubes.map((c) => `${c.x},${c.y},${c.z}`));
      expect(positions.size).toBe(V);
      for (let z = 0; z < h; z++)
        for (let y = 0; y < w; y++)
          for (let x = 0; x < l; x++)
            expect(positions.has(`${x},${y},${z}`)).toBe(true);
      expect(q.solution.en).toContain(
        `total=${V}cm³=${V}mL=${text(norm([V, 1000]))}L`,
      );
      expect(q.solution.en).toContain(
        'capacity needs internal dimensions, walls and shape',
      );
      const e = n('C'),
        before = cuboid(e, e, e),
        after = cuboid(2 * e, 2 * e, 2 * e);
      expect(after.layerCount / before.layerCount).toBe(4);
      expect(after.h / before.h).toBe(2);
      expect(after.volume / before.volume).toBe(8);
      expect(q.solution.en).toContain(`volume=${after.volume}cm³`);
      const base = n('V_L') * n('V_D'),
        height = n('V_V') / base;
      expect(base * height).toBe(n('V_V'));
      expect(q.solution.en).toContain(`Height=${d.V_V}÷${base}=${height}cm`);
    }
  });
  it('independently constructs every specified face, bounds and blank regions and rejects area-only narrow-sheet fitting', () => {
    for (const s of sets) {
      const q = s.questions[5]!,
        d = data(s, 5),
        n = (k: string) => Number(d[k]),
        l = n('L'),
        depth = n('D'),
        h = n('H');
      const expected = [
        ['left', 0, depth, depth, h],
        ['front', depth, depth, l, h],
        ['right', depth + l, depth, depth, h],
        ['back', 2 * depth + l, depth, l, h],
        ['top', depth, 0, l, depth],
        ['bottom', depth, depth + h, l, depth],
      ] as const;
      const closed = 2 * (l * depth + l * h + depth * h),
        open = closed - l * depth;
      for (const lid of [true, false]) {
        const m = cuboidNet(l, depth, h, lid),
          es = expected.filter((f) => lid || f[0] !== 'top');
        expect(m.faces.map((f) => [f.id, f.x, f.y, f.w, f.h])).toEqual(es);
        const cellSet = new Set<string>();
        for (const [, x, y, w, hh] of es)
          for (let a = 0; a < w; a++)
            for (let b = 0; b < hh; b++) {
              const key = `${x + a},${y + b}`;
              expect(cellSet.has(key)).toBe(false);
              cellSet.add(key);
            }
        const width = 2 * (l + depth),
          height = h + (lid ? 2 * depth : depth),
          S = lid ? closed : open;
        expect(cellSet.size).toBe(S);
        expect(m.surface).toBe(S);
        expect(m.bounds).toEqual({
          x: 0,
          y: lid ? 0 : depth,
          width,
          height,
          area: width * height,
        });
        expect(q.solution.en).toContain(
          `${lid ? 'Closed' : 'Open'} bounds=${width}×${height}=${width * height}cm², blank=${width * height - S}cm²`,
        );
      }
      expect(q.solution.en).toContain(`S=${closed}cm²`);
      expect(q.solution.en).toContain(`gives ${open}cm²`);
      expect(q.solution.en).toContain(`volume=${l * depth * h}cm³`);
      expect(d.B_L).toBe('S');
      const paper = [n('B_W'), closed],
        bounds = [2 * (l + depth), h + 2 * depth];
      const fits = ([w, hh]: number[]) => w! <= paper[0]! && hh! <= paper[1]!;
      expect(fits(bounds) || fits([...bounds].reverse())).toBe(false);
      expect(paper[0]! * paper[1]!).toBe(closed);
      expect(q.solution.en).toContain(
        `Seam budget=${closed}+${d.J}=${closed + n('J')}cm²`,
      );
      expect(q.stem.en).toContain('IN ONE PIECE');
      expect(q.stem.en).toContain('90-degree rotation');
    }
  });
  it('retains thirteen original references and adds twelve exact tasks without altering P57 evidence', () => {
    const es = geometryDataRecurrence.filter((e) =>
      e.sourceLesson.startsWith('P56-'),
    );
    const original = [
      ['P66-MAINT-MEASURE-Q1', 'J87-MAINT-MEASURE-Q1'],
      ['P66-MAINT-MEASURE-Q5', 'J87-MAINT-MEASURE-Q5', 'J72-L05-Q6'],
      ['P66-MAINT-MEASURE-Q2', 'J87-MAINT-MEASURE-Q2'],
      ['P66-MAINT-MEASURE-Q3', 'J87-MAINT-MEASURE-Q3'],
      ['P66-MAINT-MEASURE-Q4', 'J87-MAINT-MEASURE-Q4'],
      ['P66-MAINT-MEASURE-Q5', 'J87-MAINT-MEASURE-Q5'],
    ];
    expect(es).toHaveLength(6);
    expect(es.reduce((n, e) => n + e.targets.length, 0)).toBe(25);
    expect(new Set(es.flatMap((e) => e.targets)).size).toBe(23);
    for (const [i, e] of es.entries()) {
      expect(
        e.targets.filter((t) => !t.includes('GEOMETRY-CONSERVATION')),
      ).toEqual(original[i]);
      for (const s of sets) {
        const q = s.questions[i]!;
        expect(e.targets).toContain(q.id);
        expect(q.skill).toBe(e.skill);
        expect(
          recurrenceLinksFor(e.sourceLesson)
            .flatMap((g) => g.targets)
            .find((t) => t.id === q.id)!.href,
        ).toBe(maintenanceHref(s, q.id));
      }
    }
    expect(
      geometryDataRecurrence
        .filter((e) => e.sourceLesson.startsWith('P57-'))
        .flatMap((e) => e.targets)
        .some((id) => id.includes('GEOMETRY-CONSERVATION')),
    ).toBe(false);
  });
});
