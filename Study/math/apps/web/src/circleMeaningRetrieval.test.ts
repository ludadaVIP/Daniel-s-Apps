import { describe, it, expect } from 'vitest';
import { circleMeaningRetrieval } from './content/circleMeaningRetrieval';
import { primaryCapstoneRecurrence } from './content/primaryCapstoneRecurrence';
import { maintenanceSets } from './content/maintenance';
import { curriculum, lessons } from './content';
import { checkAnswer } from './model';
import {
  circleMeasures,
  circleParts,
  measuredPiRatio,
  sectorRearrangement,
  cylinderMeasures,
  checkPiMultiple,
  piCoefficient,
} from './circleModels';
const sets = Object.values(circleMeaningRetrieval);
const raw = (i: number, q: number, k: string) =>
  sets[i]!.questions[q - 1]!.contextTable!.rows.find((r) => r[0]!.en === k)![2]!
    .en;
const n = (i: number, q: number, k: string) => Number(raw(i, q, k));
describe('P66 quantity, inverse and dimension-reference retrieval', () => {
  it('retains all ten original targets and appends ten exact human-reviewed tasks with no extra formal lessons', () => {
    const evidence = primaryCapstoneRecurrence.filter((e) =>
      e.sourceLesson.startsWith('P66-'),
    );
    expect(evidence.flatMap((e) => e.targets)).toHaveLength(20);
    expect(new Set(evidence.flatMap((e) => e.targets)).size).toBe(20);
    expect(
      evidence.flatMap((e) =>
        e.targets.filter((t) => !t.includes('CIRCLE-MEANING')),
      ),
    ).toHaveLength(10);
    const order = curriculum.flatMap((s) => s.units.map((u) => u.id));
    for (const [i, e] of evidence.entries())
      for (const s of sets) {
        const q = s.questions[i]!;
        expect(e.targets).toContain(q.id);
        expect(s.bridgeByQuestion[q.id]).toBe(e.sourceLesson);
        expect(Object.values(maintenanceSets).find((m) => m.id === s.id)).toBe(
          s,
        );
        expect(order.indexOf(s.unit)).toBeGreaterThan(order.indexOf('P66'));
        expect(q.skill).toBe(e.skill);
        expect(checkAnswer(q.solution.en, q.answer)).toBeNull();
        expect(q.hints).toHaveLength(2);
        expect(
          q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
        ).toBeTruthy();
      }
    for (const e of primaryCapstoneRecurrence.filter(
      (e) => !e.sourceLesson.startsWith('P66-'),
    ))
      expect(e.targets.every((t) => !t.includes('CIRCLE-MEANING'))).toBe(true);
    expect(maintenanceSets.J91.questions).toHaveLength(10);
    expect(maintenanceSets.J92.questions).toHaveLength(10);
    expect(lessons).toHaveLength(358);
  });
  it('uses fractional same-circle radii and an actual cross-circle counterexample, with rotation-invariant endpoints', () => {
    for (const [i, d, r, other] of [
      [0, 5, 2.5, 1],
      [1, 7, 3.5, 1.5],
    ] as const) {
      expect([n(i, 1, 'D'), n(i, 1, 'S')]).toEqual([d, other]);
      expect(d / 2).toBe(r);
      expect(circleMeasures(r).d).toBe(d);
      expect(2 * other).toBeLessThan(r);
      for (const angle of [0, 30, 90]) {
        const m = circleParts(r, angle, 0.5),
          through = circleParts(r, angle, 0);
        for (const [x, y] of [...m.diameter, ...m.chord])
          expect(Math.hypot(x!, y!)).toBeCloseTo(r, 12);
        expect(m.isDiameter).toBe(false);
        expect(m.chordLength / 2).toBeLessThan(r);
        expect(through.isDiameter).toBe(true);
        expect(through.chordLength).toBe(d);
        for (const [j, point] of through.chord.entries())
          for (const [axis, value] of point.entries())
            expect(Math.abs(value - through.diameter[j]![axis]!)).toBe(0);
      }
    }
    expect(() => circleMeasures(0)).toThrow();
    expect(() => measuredPiRatio(0, 1)).toThrow();
  });
  it('matches mixed units in both directions without changing finite readings or doubling the wrong denominator', () => {
    for (const [i, cTenths, dMM, quotient, radiusQuotient] of [
      [0, 189, 60, 3.15, 6.3],
      [1, 251, 80, 3.1375, 6.275],
    ] as const) {
      const c = n(i, 2, 'C'),
        d = n(i, 2, 'D');
      expect(c).toBe(cTenths / 10);
      expect(d).toBe(dMM);
      expect(measuredPiRatio(d / 10, c)).toBe(quotient);
      expect(measuredPiRatio(d, cTenths)).toBe(quotient);
      expect(measuredPiRatio(d / 20, c)).toBe(radiusQuotient);
      expect(cTenths * 10).toBe(quotient * dMM * 10); // Integer-sized cross-product at the stated precision.
      expect((c / d) * 10).toBeCloseTo(quotient, 12);
    }
    expect(() => measuredPiRatio(-1, 10)).toThrow();
  });
  it('inverts a specified finite convention, checks no-slip full turns and keeps a semicircle diameter in the whole border', () => {
    for (const [i, cents, diameter, radius, w, turns, h, total] of [
      [0, 2198, 7, 3.5, 3, 3, 2, 9],
      [1, 2826, 9, 4.5, 5, 4, 3, 20],
    ] as const) {
      expect([n(i, 3, 'C'), n(i, 3, 'W'), n(i, 3, 'N'), n(i, 3, 'H')]).toEqual([
        cents / 100,
        w,
        turns,
        h,
      ]);
      expect(314 * diameter).toBe(cents);
      expect(diameter / 2).toBe(radius);
      expect(circleMeasures(radius).cCoefficient).toBe(diameter);
      expect(circleMeasures(w / 2).cCoefficient * turns).toBe(total);
      expect(checkPiMultiple(`${total}π cm`, String(total), 'cm')).toBe(true);
      const arcCoefficient = circleMeasures(h).cCoefficient / 2;
      expect(arcCoefficient).toBe(h);
      expect(piCoefficient(`${h}π+${2 * h}`, 'cm')).toBeNull(); // Valid mixed paper border, deliberately outside single-pi input.
      expect(checkPiMultiple(`${h}π+${2 * h}`, String(h), 'cm')).toBe(false);
      expect(2 * h).toBeGreaterThan(0); // Straight diameter is the positive arc-to-border difference.
    }
  });
  it('halves diameters before squaring, retains all sectors and separates actual scaling from repartition', () => {
    for (const [i, d, r, area, approxHundredths] of [
      [0, 6, 3, 9, 2826],
      [1, 10, 5, 25, 7850],
    ] as const) {
      expect(n(i, 4, 'D')).toBe(d);
      const m = circleMeasures(d / 2);
      expect(m.r).toBe(r);
      expect(m.aCoefficient).toBe(area);
      expect(m.cCoefficient).toBe(d);
      expect(d * d).toBe(4 * area);
      expect(314 * area).toBe(approxHundredths);
      const eight = sectorRearrangement(r, 8),
        fine = sectorRearrangement(r, 64);
      expect(eight.totalArea).toBe(fine.totalArea);
      expect(new Set(eight.pieces.map((p) => p.id)).size).toBe(8);
      expect(new Set(fine.pieces.map((p) => p.id)).size).toBe(64);
      expect(eight.guideArea).toBeLessThan(eight.totalArea);
      expect(eight.base).toBeLessThan(Math.PI * r);
      expect(eight.height).toBeLessThan(r);
      expect(fine.guideArea).toBeGreaterThan(eight.guideArea);
      expect(circleMeasures(2 * r).aCoefficient).toBe(4 * area);
      expect(circleMeasures(2 * r).cCoefficient).toBe(2 * d);
    }
  });
  it('uses inner volume and independent thin-wall faces, then checks height-only scaling and cubic-unit conversion', () => {
    for (const [
      i,
      r,
      h,
      outerR,
      outerH,
      side,
      base,
      volume,
      outVolume,
      excess,
      doubleClosed,
    ] of [
      [0, 2, 4, 3, 6, 16, 4, 16, 54, 38, 40],
      [1, 3, 5, 4, 7, 30, 9, 45, 112, 67, 78],
    ] as const) {
      expect([n(i, 5, 'R'), n(i, 5, 'H'), n(i, 5, 'S'), n(i, 5, 'T')]).toEqual([
        r,
        h,
        outerR,
        outerH,
      ]);
      const forms = ([0, 1, 2] as const).map((k) => cylinderMeasures(r, h, k));
      expect(forms.map((m) => m.surfaceCoefficient)).toEqual([
        side,
        side + base,
        side + 2 * base,
      ]);
      expect(forms.map((m) => m.volumeCoefficient)).toEqual([
        volume,
        volume,
        volume,
      ]);
      expect(forms[0]!.netWidth).toBe(2 * Math.PI * r);
      expect(forms[0]!.netHeight).toBe(h);
      expect(cylinderMeasures(outerR, outerH, 2).volumeCoefficient).toBe(
        outVolume,
      );
      expect(outVolume - volume).toBe(excess);
      const doubled = cylinderMeasures(r, 2 * h, 2);
      expect(doubled.baseCoefficient).toBe(base);
      expect(doubled.lateralCoefficient).toBe(2 * side);
      expect(doubled.volumeCoefficient).toBe(2 * volume);
      expect(doubled.surfaceCoefficient).toBe(doubleClosed);
      expect(doubled.surfaceCoefficient).not.toBe(
        2 * forms[2]!.surfaceCoefficient,
      );
      expect(checkPiMultiple(`${volume}π cm³`, String(volume), 'cm³')).toBe(
        true,
      );
      expect(checkPiMultiple(`${volume}π cm²`, String(volume), 'cm³')).toBe(
        false,
      );
    }
  });
});
