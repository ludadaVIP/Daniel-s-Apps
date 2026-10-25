import { describe, it, expect } from 'vitest';
import { measurementMeaningRetrieval } from './content/measurementMeaningRetrieval';
import { geometryDataRetrieval } from './content/geometryDataRetrieval';
import { foundationRecurrence } from './content/foundationRecurrence';
import { maintenanceForUnit, maintenanceHref } from './content/maintenance';
import { lessons, curriculum, unitChecks } from './content';
import { checkAnswer } from './model';
import {
  rulerLength,
  rectangleBoundary,
  fullTiles,
  tileCoverage,
  rotateCoverage,
  angleKind,
  angleGeometry,
  barGeometry,
} from './measurementModels';
import { recurrenceLinksFor } from './recurrenceTargets';
import { readWholeNumber } from './numberModels';
const sets = Object.values(measurementMeaningRetrieval);
const rows = (s: (typeof sets)[number], i: number) =>
  s.questions[i]!.contextTable!.rows.map((r) => r.map((c) => c.en));

describe('B05 detailed measurement and chart retrieval', () => {
  it('adds ten bilingual human process tasks without changing formal identities or the original seven-task groups', () => {
    expect(lessons).toHaveLength(358);
    expect(curriculum.flatMap((s) => s.units)).toHaveLength(67);
    expect(Object.keys(unitChecks)).toHaveLength(67);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    expect(
      new Set(sets.flatMap((s) => s.questions.map((q) => q.id))).size,
    ).toBe(10);
    for (const s of sets) {
      expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('B05'));
      expect(maintenanceForUnit(s.unit).some((g) => g.id === s.id)).toBe(true);
      expect(maintenanceForUnit(s.unit)[0]!.id).toBe(
        geometryDataRetrieval[s.unit].id,
      );
      expect(geometryDataRetrieval[s.unit].questions).toHaveLength(7);
      expect(s.questions).toHaveLength(5);
      for (const [i, q] of s.questions.entries()) {
        expect(
          q.stem.en && q.stem.zh && q.solution.en && q.solution.zh,
        ).toBeTruthy();
        expect(q.hints).toHaveLength(2);
        expect(q.hints.every((h) => h.en && h.zh)).toBe(true);
        expect(q.answer.kind).toBe('explain');
        if (q.answer.kind === 'explain')
          expect(q.answer.rubric).toEqual(q.solution);
        expect(q.solutionSteps).toEqual([q.solution]);
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(checkAnswer('same unit conserved correct', q.answer)).toBeNull();
        expect(s.bridgeByQuestion[q.id]).toBe('B05-L0' + (i + 1));
        expect(
          q.contextTable!.rows.every((r) => r.every((c) => c.en && c.zh)),
        ).toBe(true);
      }
    }
  });
  it('recomputes actual millimetre endpoints, zero lengths, tick counts and independently specified mixed/track conversions', () => {
    for (const s of sets) {
      const q = s.questions[0]!;
      for (const [label, left, right] of rows(s, 0)) {
        const m = rulerLength(Number(left), Number(right));
        expect(q.solution.en).toContain(
          label +
            ': ' +
            m.endMm +
            '−' +
            m.startMm +
            '=' +
            m.mm +
            ' mm=' +
            m.cm +
            ' cm=' +
            m.metres +
            ' m',
        );
        expect(q.solution.zh).toContain(
          m.endMm +
            '−' +
            m.startMm +
            '=' +
            m.mm +
            'mm=' +
            m.cm +
            'cm=' +
            m.metres +
            'm',
        );
        if (label === 'A') {
          expect(q.solution.en).toContain(
            m.cm + ' intervals and ' + (m.cm + 1) + ' ticks',
          );
          expect(q.solution.en).toContain('0 and ' + m.mm + ' mm');
          expect(q.solution.en).toContain(
            m.cm + ' cm=' + m.mm + ' mm>' + m.cm + ' mm',
          );
        } else {
          expect(m.mm).toBe(0);
          expect(q.solution.en).toContain(
            '0 intervals and one coincident endpoint',
          );
        }
      }
      const mixed = q.stem.en.match(/convert (\d+) m (\d+) cm/)!;
      const metres = Number(mixed[1]),
        cm = Number(mixed[2]),
        total = metres * 100 + cm;
      expect(q.solution.en).toContain(
        metres +
          ' m ' +
          cm +
          ' cm=' +
          total +
          ' cm=' +
          total * 10 +
          ' mm=' +
          total / 100 +
          ' m',
      );
      expect(q.solution.en).toContain(total + '=' + metres + '×100+' + cm);
      expect(metres + cm).not.toBe(total);
      const track = Number(q.stem.en.match(/imaginary (\d+) m track/)![1]);
      expect(q.solution.en).toContain(
        'Track: ' + track + ' m=' + track / 1000 + ' km',
      );
      expect(q.solution.en).toContain('not an actual-size household ruler');
    }
  });
  it('traces all four sides and checks the actual square, triangle, missing side and same-perimeter/different-area examples', () => {
    for (const s of sets) {
      const q = s.questions[1]!,
        models = rows(s, 1).map(([label, w, h]) => ({
          label,
          m: rectangleBoundary(Number(w), Number(h)),
        }));
      for (const { label, m } of models) {
        expect(q.solution.en).toContain(
          label +
            ': ' +
            m.width +
            '+' +
            m.height +
            '+' +
            m.width +
            '+' +
            m.height +
            '=' +
            m.perimeter +
            ' cm',
        );
        expect(q.solution.en).toContain(
          m.width + '×' + m.height + '=' + m.area + ' cm²',
        );
        expect(m.segments).toHaveLength(2 * (m.width + m.height));
        expect(m.segments.at(-1)!.x2).toBe(m.segments[0]!.x1);
        expect(m.segments.at(-1)!.y2).toBe(m.segments[0]!.y1);
        for (let i = 1; i < m.segments.length; i++) {
          expect(m.segments[i]!.x1).toBe(m.segments[i - 1]!.x2);
          expect(m.segments[i]!.y1).toBe(m.segments[i - 1]!.y2);
        }
      }
      expect(models[0]!.m.perimeter).toBe(models[1]!.m.perimeter);
      expect(models[0]!.m.area).not.toBe(models[1]!.m.area);
      const given = q.stem.en.match(
        /square side (\d+) cm; triangle sides ([\d,]+) cm; missing-side rectangle perimeter (\d+) cm and width (\d+) cm/,
      )!;
      const side = Number(given[1]),
        tri = given[2]!.split(',').map(Number),
        p = Number(given[3]),
        w = Number(given[4]),
        h = p / 2 - w;
      expect(q.solution.en).toContain(
        'Square: 4×' + side + '=' + 4 * side + ' cm',
      );
      expect(q.solution.en).toContain(
        'Triangle: ' +
          tri.join('+') +
          '=' +
          tri.reduce((a, b) => a + b, 0) +
          ' cm',
      );
      const sorted = [...tri].sort((a, b) => a - b);
      expect(sorted[0]! + sorted[1]!).toBeGreaterThan(sorted[2]!);
      expect(q.solution.en).toContain(
        'Missing height: ' + p + '÷2−' + w + '=' + h + ' cm',
      );
      expect(rectangleBoundary(w, h).perimeter).toBe(p);
      expect(q.solution.en).toContain(
        'check ' + w + '+' + h + '+' + w + '+' + h + '=' + p + ' cm',
      );
      expect(q.solution.en).toContain('EVERY boundary segment ONCE');
    }
  });
  it('reconstructs actual covered cells, holes and every rotated hole, then checks rearrangement, resizing and clearing without widening model bounds', () => {
    for (const s of sets) {
      const q = s.questions[2]!,
        width = Number(q.stem.en.match(/frame has (\d+) columns/)![1]),
        height = 3;
      const rowData = rows(s, 2),
        selected = rowData.flatMap(([r, cs]) =>
          cs!.split(', ').map((c) => (Number(r) - 1) * width + Number(c) - 1),
        );
      const model = tileCoverage(width, height, selected),
        holes = fullTiles(width, height).filter((i) => !selected.includes(i));
      const holeText = (indices: number[], w: number) =>
        indices
          .map((i) => '(' + (Math.floor(i / w) + 1) + ',' + ((i % w) + 1) + ')')
          .join(',');
      expect(q.solution.en).toContain(
        'Original rows ' +
          model.rows.join(',') +
          ': ' +
          model.rows.join('+') +
          '=' +
          model.area +
          ' cm²',
      );
      expect(q.solution.en).toContain('holes ' + holeText(holes, width));
      expect(q.solution.en).toContain(
        width * height + '−' + holes.length + '=' + model.area + ' cm²',
      );
      const rotated = rotateCoverage(width, height, selected),
        newHoles = fullTiles(rotated.width, rotated.height).filter(
          (i) => !rotated.selected.includes(i),
        );
      expect(q.solution.en).toContain(
        'Clockwise: ' +
          rotated.width +
          ' columns, ' +
          rotated.height +
          ' rows; holes ' +
          holeText(newHoles, rotated.width),
      );
      expect(
        tileCoverage(rotated.width, rotated.height, rotated.selected).area,
      ).toBe(model.area);
      let back = rotated;
      for (let i = 0; i < 3; i++)
        back = rotateCoverage(back.width, back.height, back.selected);
      expect(back.width).toBe(width);
      expect(back.height).toBe(height);
      expect(back.selected).toEqual([...selected].sort((a, b) => a - b));
      const rearrange = q.stem.en.match(
        /rectangles (\d+)×(\d+) and (\d+)×(\d+)/,
      )!;
      const perimeters = [];
      for (const [a, b] of [
        [Number(rearrange[1]), Number(rearrange[2])],
        [Number(rearrange[3]), Number(rearrange[4])],
      ]) {
        const m = rectangleBoundary(a!, b!);
        expect(m.area).toBe(model.area);
        perimeters.push(m.perimeter);
        expect(q.solution.en).toContain(
          'Rearranged ' +
            a +
            '×' +
            b +
            ': area ' +
            m.area +
            ' cm², perimeter ' +
            m.perimeter +
            ' cm',
        );
      }
      expect(perimeters[0]).not.toBe(perimeters[1]);
      expect(q.stem.en).toContain('SIDE to two cm');
      expect(q.solution.en).toContain(
        '2×2=4 cm² EACH, so ' + model.area + '×4=' + model.area * 4 + ' cm²',
      );
      expect(tileCoverage(width, height, []).area).toBe(0);
      expect(q.solution.en).toContain('Clear: 0 cm²');
      expect(() =>
        tileCoverage(width, height, [selected[0]!, selected[0]!]),
      ).toThrow(RangeError);
    }
  });
  it('classifies actual boundary angles, checks length/rotation invariance and reads the authored one-arm/net-turn/counterexample cases', () => {
    for (const s of sets) {
      const q = s.questions[3]!,
        angles = rows(s, 3).map((r) => Number(r[1]));
      expect(q.solution.en).toContain(
        'Kinds in order: ' + angles.map(angleKind).join(', ') + '.',
      );
      for (const a of angles)
        for (const length of [40, 130])
          for (const rotation of [0, 359]) {
            const g = angleGeometry(a, length, rotation),
              u = { x: g.first.x - g.vertex.x, y: g.first.y - g.vertex.y },
              v = { x: g.second.x - g.vertex.x, y: g.second.y - g.vertex.y };
            const computed = Math.abs(
              (Math.atan2(u.x * v.y - u.y * v.x, u.x * v.x + u.y * v.y) * 180) /
                Math.PI,
            );
            expect(computed).toBeCloseTo(a, 8);
          }
      const opening = q.stem.en.match(
          /DRAW a (\d+)° angle.*?WHOLE drawing (\d+)° clockwise/,
        )!,
        a = Number(opening[1]),
        rotation = Number(opening[2]),
        arm = Number(q.stem.en.match(/ONLY ONE arm (\d+)° farther/)![1]);
      expect(q.solution.en).toContain(
        a +
          '° remains ' +
          a +
          '° after extending and rotating the WHOLE by ' +
          rotation +
          '°',
      );
      expect(q.solution.en).toContain(
        'One arm only: ' + a + '+' + arm + '=' + (a + arm) + '°',
      );
      const turns = q.stem.en.match(
          /\(1\) clockwise (\d+)° then clockwise (\d+)°; \(2\)/,
        )!,
        t1 = Number(turns[1]),
        t2 = Number(turns[2]);
      expect(q.solution.en).toContain(
        t1 + '+' + t2 + '=' + (t1 + t2) + '° clockwise',
      );
      expect(q.solution.en).toContain(
        t2 + '−' + t1 + '=' + (t2 - t1) + '° anticlockwise',
      );
      const rect = q.solution.en.match(
          /Counterexample rectangle: (\d+) cm×(\d+) cm with four right angles/,
        )!,
        w = Number(rect[1]),
        h = Number(rect[2]);
      expect(w).not.toBe(h);
      expect(rectangleBoundary(w, h).area).toBe(w * h);
      expect(q.solution.en).toContain(
        'zero=0°; acute 0°<a<90°; right=90°; obtuse 90°<a<180°; straight=180°',
      );
      expect(q.solution.en).toContain(
        '60°,60°,60° triangle has no right angle',
      );
      expect(60 + 60 + 60).toBe(180);
      expect(q.solution.en).toContain('Appearance alone does not prove');
    }
  });
  it('recovers original counts from actual intervals, redraws both scales, checks zero and validates complete card IDs plus all 66 count allocations', () => {
    for (const s of sets) {
      const q = s.questions[4]!,
        data = rows(s, 4),
        counts = data.map((r) => Number(r[1]) * 2),
        a = barGeometry(counts, 20, 2),
        b = barGeometry(counts, 40, 5);
      expect(data.map((r) => r[0])).toEqual(['Walk', 'Bike', 'Bus']);
      expect(q.solution.en).toContain(
        'Recovered: ' +
          data
            .map(([mode, n], i) => mode + ' ' + n + '×2=' + counts[i])
            .join(', ') +
          ' people',
      );
      expect(q.solution.en).toContain(
        'Total ' +
          counts.join('+') +
          '=' +
          a.total +
          '; Walk+Bike=' +
          (counts[0]! + counts[1]!) +
          '; Bus−Walk=' +
          counts[2] +
          '−' +
          counts[0] +
          '=' +
          (counts[2]! - counts[0]!),
      );
      expect(q.solution.en).toContain(
        'Chart A ticks: ' +
          a.ticks.join(',') +
          '. Chart B ticks: ' +
          b.ticks.join(',') +
          '.',
      );
      for (let i = 0; i < 3; i++) expect(b.heights[i]).toBe(a.heights[i]! / 2);
      expect(a.heights[1]).toBe(0);
      expect(b.heights[1]).toBe(0);
      expect(q.solution.en).toContain(
        counts[0] + '÷5=' + counts[0]! / 5 + ' intervals',
      );
      expect(q.solution.en).toContain(counts[2] + '÷5=' + counts[2]! / 5);
      const card = q.solution.en.slice(
        q.solution.en.indexOf('ONE card example:'),
      );
      const assigned: Record<string, number[]> = {
        Walk: [],
        Bike: [],
        Bus: [],
      };
      for (const m of card.matchAll(/C(\d+)–C(\d+) (Walk|Bike|Bus)/g))
        assigned[m[3]!]!.push(
          ...Array.from(
            { length: Number(m[2]) - Number(m[1]) + 1 },
            (_, i) => Number(m[1]) + i,
          ),
        );
      const all = Object.values(assigned).flat();
      expect(all).toHaveLength(10);
      expect([...all].sort((x, y) => x - y)).toEqual(
        Array.from({ length: 10 }, (_, i) => i + 1),
      );
      const declared = card
        .match(/counts (\d+),(\d+),(\d+) total ten/)!
        .slice(1)
        .map(Number);
      expect(declared).toEqual(
        ['Walk', 'Bike', 'Bus'].map((k) => assigned[k]!.length),
      );
      expect(card).toContain(
        'selected Walk+Bike ' +
          readWholeNumber(declared[0]! + declared[1]!).en.toLowerCase(),
      );
      const duplicate = [...all, 1];
      expect(duplicate.length).toBe(11);
      expect(new Set(duplicate).size).toBe(10);
      let alternatives = 0;
      for (let walk = 0; walk <= 10; walk++)
        for (let bike = 0; bike <= 10 - walk; bike++) {
          const cc = [walk, bike, 10 - walk - bike],
            m1 = barGeometry(cc, 20, 2),
            m2 = barGeometry(cc, 40, 5);
          expect(m1.total).toBe(10);
          expect(m2.total).toBe(10);
          expect(m2.heights).toEqual(m1.heights.map((x) => x / 2));
          alternatives++;
        }
      expect(alternatives).toBe(66);
      expect(q.solution.en).toContain('For ANY card allocation');
      expect(q.solution.en).toContain('all ten IDs exactly once');
      expect(q.solution.en).toContain('EXACTLY zero height');
    }
  });
  it('retains all sixteen original target references and links five source skills to both new later-unit tasks', () => {
    const evidence = foundationRecurrence.filter((e) =>
      e.sourceLesson.startsWith('B05-'),
    );
    expect(evidence).toHaveLength(5);
    expect(evidence.reduce((n, e) => n + e.targets.length, 0)).toBe(26);
    expect(new Set(evidence.flatMap((e) => e.targets)).size).toBe(25);
    for (const [i, e] of evidence.entries())
      for (const s of sets) {
        const q = s.questions[i]!;
        expect(e.targets).toContain(q.id);
        expect(q.skill).toBe(e.skill);
        const target = recurrenceLinksFor(e.sourceLesson)
          .flatMap((g) => g.targets)
          .find((t) => t.id === q.id)!;
        expect(target.href).toBe(maintenanceHref(s, q.id));
      }
  });
});
