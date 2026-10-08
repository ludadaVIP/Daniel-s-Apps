import { describe, expect, it } from 'vitest';
import {
  fusion,
  fusionCases,
  fusionTransfer,
  boiling,
  boilingCases,
  condensation,
  condensationCases,
  warmingPlan,
  warmingSnapshot,
  warmingPoints,
  warmingCases,
  waterPhase,
} from './phaseModels';
import { phaseLessons } from '../content/phase';
import { thermalLessons } from '../content/thermal';
import { lessons } from '../content/lessons';
import { experiments } from '../content/experiments';
describe('phase-change evidence and heating curves', () => {
  it('absorbs energy at constant temperature while conserving original ice/liquid mass', () => {
    for (const mass of [50, 100])
      for (const q of [0, 334, 8350, 16700]) {
        const s = fusion(mass, q, 'melting');
        expect(s.temperature).toBe(0);
        expect(s.iceG + s.liquidG).toBeCloseTo(mass);
        expect(s.liquidG * waterPhase.fusionJPerG).toBeCloseTo(q);
        expect(s.transferToSample).toBe(q);
        expect(s.iceFraction).toBeGreaterThanOrEqual(0);
        expect(s.iceFraction).toBeLessThanOrEqual(1);
      }
    expect(fusion(50, fusionTransfer, 'melting')).toMatchObject({
      iceG: 0,
      liquidG: 50,
    });
    expect(fusion(100, fusionTransfer, 'melting')).toMatchObject({
      iceG: 50,
      liquidG: 50,
    });
  });
  it('reverses transfer direction for freezing and returns the same changed mass', () => {
    for (const q of [0, 8350, 16700]) {
      const melt = fusion(50, q, 'melting'),
        freeze = fusion(50, q, 'freezing');
      expect(freeze.iceG).toBeCloseTo(melt.liquidG);
      expect(freeze.transferToSample).toBeCloseTo(-melt.transferToSample);
      expect(freeze.iceG + freeze.liquidG).toBeCloseTo(50);
      expect(freeze.temperature).toBe(0);
    }
    expect(
      fusionCases.map((c) => fusion(c.mass, fusionTransfer, c.direction).iceG),
    ).toEqual([0, 50, 50, 50]);
  });
  it('limits fusion to the stated plateau rather than silently applying latent heat to later warming', () => {
    expect(fusion(50, 16700, 'melting').fullTransfer).toBe(16700);
    expect(() => fusion(50, 16700.01, 'melting')).toThrow(RangeError);
    expect(() => fusion(50, 16700.01, 'freezing')).toThrow(RangeError);
  });
  it('accounts for escaped vapour mass while liquid remains at the specified boiling temperature', () => {
    for (const c of boilingCases)
      for (const fraction of [0, 0.1, 0.5, 1]) {
        const s = boiling(c.mass, c.input * fraction);
        expect(s.temperature).toBe(100);
        expect(s.vapourG + s.liquidG).toBeCloseTo(c.mass);
        expect(s.vapourG * 2260).toBeCloseTo(c.input * fraction);
        expect(s.liquidG).toBeGreaterThan(0);
      }
    expect(boilingCases.map((c) => boiling(c.mass, c.input).vapourG)).toEqual([
      5, 10, 10,
    ]);
    expect(boilingCases.map((c) => boiling(c.mass, c.input).liquidG)).toEqual([
      15, 10, 30,
    ]);
  });
  it('supports the exact end of vaporisation but rejects subsequent vapour heating', () => {
    expect(boiling(20, 45200)).toMatchObject({
      liquidG: 0,
      vapourG: 20,
      temperature: 100,
      fractionVaporised: 1,
    });
    expect(() => boiling(20, 45201)).toThrow(RangeError);
  });
  it('uses dew point as well as surface temperature, controlling air temperature across comparisons', () => {
    expect(
      condensationCases.map(
        (c) => condensation(c.surface, c.dewPoint).condenses,
      ),
    ).toEqual([true, false, false]);
    expect(
      condensationCases.map((c) => condensation(c.surface, c.dewPoint).airC),
    ).toEqual([25, 25, 25]);
    expect(condensation(15, 15).condenses).toBe(false);
    expect(condensation(14.99, 15).condenses).toBe(true);
    expect(condensation(8, 5).condenses).toBe(false);
  });
  it('sums three different energy uses and keeps mass units consistent', () => {
    expect(warmingPlan(20, 50)).toMatchObject({
      iceJ: 420,
      fusionJ: 6680,
      liquidJ: 1680,
      totalJ: 8780,
      iceSeconds: 8.4,
      meltingSeconds: 133.6,
      endMeltingSeconds: 142,
      duration: 175.6,
    });
    expect(warmingPlan(40, 50).totalJ).toBe(17560);
    expect(warmingPlan(40, 50).duration).toBe(351.2);
  });
  it('halves every segment time at doubled absorbed power without changing energy requirements', () => {
    const a = warmingPlan(20, 50),
      b = warmingPlan(20, 100),
      c = warmingPlan(40, 50);
    for (const key of [
      'iceSeconds',
      'meltingSeconds',
      'endMeltingSeconds',
      'duration',
    ] as const) {
      expect(b[key]).toBeCloseTo(a[key] / 2);
      expect(c[key]).toBeCloseTo(a[key] * 2);
    }
    for (const key of ['iceJ', 'fusionJ', 'liquidJ', 'totalJ'] as const) {
      expect(b[key]).toBe(a[key]);
      expect(c[key]).toBe(a[key] * 2);
    }
  });
  it('holds temperature at zero during melting while absorbed energy continues increasing', () => {
    const start = warmingSnapshot(20, 50, 8.4),
      middle = warmingSnapshot(20, 50, 75.2),
      end = warmingSnapshot(20, 50, 142);
    expect(start).toMatchObject({
      temperature: 0,
      state: 'melting',
      iceFraction: 1,
      energyJ: 420,
    });
    expect(middle.temperature).toBe(0);
    expect(middle.iceFraction).toBeCloseTo(0.5);
    expect(middle.energyJ).toBe(3760);
    expect(middle.fusionUsed).toBe(3340);
    expect(end.temperature).toBe(0);
    expect(end.iceFraction).toBe(0);
    expect(end.state).toBe('water');
    expect(end.energyJ).toBe(7100);
  });
  it('has continuous transitions, bounded state fractions and one consistent full energy ledger', () => {
    for (const c of warmingCases) {
      const p = warmingPlan(c.mass, c.power);
      for (const t of [
        0,
        p.iceSeconds - 1e-7,
        p.iceSeconds,
        p.iceSeconds + 1e-7,
        p.endMeltingSeconds - 1e-7,
        p.endMeltingSeconds,
        p.endMeltingSeconds + 1e-7,
        p.duration,
        1e4,
      ]) {
        const s = warmingSnapshot(c.mass, c.power, t);
        expect(s.temperature).toBeGreaterThanOrEqual(-10);
        expect(s.temperature).toBeLessThanOrEqual(20);
        expect(s.iceFraction).toBeGreaterThanOrEqual(0);
        expect(s.iceFraction).toBeLessThanOrEqual(1);
        expect(s.iceUsed + s.fusionUsed + s.liquidUsed).toBeCloseTo(s.energyJ);
        expect(s.energyJ).toBeCloseTo(c.power * s.elapsed);
      }
      expect(warmingSnapshot(c.mass, c.power, 1e4)).toMatchObject({
        temperature: 20,
        elapsed: p.duration,
        energyJ: p.totalJ,
        iceFraction: 0,
      });
      expect(
        warmingSnapshot(c.mass, c.power, p.iceSeconds - 1e-7).temperature,
      ).toBeCloseTo(0, 5);
      expect(
        warmingSnapshot(c.mass, c.power, p.endMeltingSeconds + 1e-7)
          .temperature,
      ).toBeCloseTo(0, 5);
    }
  });
  it('draws exact elapsed vertices without exposing future stages or connecting separate trials', () => {
    expect(warmingPoints(20, 50, 0)).toEqual([{ time: 0, temperature: -10 }]);
    expect(warmingPoints(20, 50, 100)).toEqual([
      { time: 0, temperature: -10 },
      { time: 8.4, temperature: 0 },
      { time: 100, temperature: 0 },
    ]);
    expect(warmingPoints(20, 50, 175.6)).toEqual([
      { time: 0, temperature: -10 },
      { time: 8.4, temperature: 0 },
      { time: 142, temperature: 0 },
      { time: 175.6, temperature: 20 },
    ]);
    for (const t of [4.2, 8.4, 75, 142, 150, 175.6])
      for (const point of warmingPoints(20, 50, t)) {
        expect(point.time).toBeLessThanOrEqual(t);
        expect(point.temperature).toBe(
          warmingSnapshot(20, 50, point.time).temperature,
        );
      }
  });
  it('rejects invalid and overflowing quantities instead of showing impossible state readings', () => {
    for (const call of [
      () => fusion(0, 1, 'melting'),
      () => fusion(50, -1, 'melting'),
      () => fusion(50, NaN, 'melting'),
      () => fusion(50, 1, 'other' as 'melting'),
      () => fusion(1e308, 1, 'melting'),
      () => boiling(-1, 1),
      () => boiling(20, Infinity),
      () => boiling(1e308, 1),
      () => condensation(0, 15),
      () => condensation(30, 15),
      () => condensation(8, 26),
      () => condensation(8, -1),
      () => condensation(8, NaN),
      () => warmingPlan(0, 50),
      () => warmingPlan(20, 0),
      () => warmingPlan(1e308, 50),
      () => warmingPlan(20, 1e-308),
      () => warmingSnapshot(20, 50, -1),
      () => warmingSnapshot(20, 50, Infinity),
      () => warmingPoints(20, 50, NaN),
    ])
      expect(call).toThrow(RangeError);
  });
  it('adds four full bilingual investigations after the prior thermal batch with distinct labs and stable identifiers', () => {
    const start = lessons.findIndex((l) => l.id === phaseLessons[0]!.id);
    expect(start).toBe(55);
    expect(lessons.slice(start - 5, start).map((l) => l.id)).toEqual(
      thermalLessons.map((l) => l.id),
    );
    expect(lessons.slice(start, start + 4).map((l) => l.id)).toEqual(
      phaseLessons.map((l) => l.id),
    );
    expect(new Set(lessons.map((l) => l.id)).size).toBe(lessons.length);
    for (const l of phaseLessons) {
      expect(l.stage).toBe(2);
      expect(l.unit).toBe('thermal');
      expect(l.questions).toHaveLength(3);
      expect(l.minutes).toBeGreaterThanOrEqual(12);
      expect(l.minutes).toBeLessThanOrEqual(20);
      expect(experiments.filter((e) => e.id === l.kind)).toHaveLength(1);
      for (const key of [
        'title',
        'subtitle',
        'hook',
        'prediction',
        'explore',
        'concept',
        'example',
        'misconception',
        'realWorld',
        'summary',
        'homeExperiment',
      ] as const) {
        expect(l[key].zh).toBeTruthy();
        expect(l[key].en).toBeTruthy();
      }
      for (const q of [...l.questions, l.exit]) {
        expect(q.options[q.correct]?.zh).toBeTruthy();
        expect(q.explanation.zh).toBeTruthy();
        expect(q.explanation.en).toBeTruthy();
      }
    }
  });
});
