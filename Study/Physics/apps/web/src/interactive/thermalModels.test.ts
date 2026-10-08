import { describe, expect, it } from 'vitest';
import {
  absoluteTemperature,
  gasComparison,
  gasDots,
  waterHeating,
  coolingSample,
  cupCases,
  cupSnapshot,
  wetSurface,
  transferPaths,
} from './thermalModels';
import { thermalLessons } from '../content/thermal';
import { lessons } from '../content/lessons';
import { experiments } from '../content/experiments';
import { units } from '../content/curriculum';
describe('thermal comparisons and energy balances', () => {
  it('separates sample amount from temperature and uses absolute rather than Celsius ratios', () => {
    expect(absoluteTemperature(0)).toBe(273.15);
    expect(gasComparison(20, 1)).toMatchObject({
      kelvin: 293.15,
      speedScale: 1,
      relativeInternal: 1,
    });
    expect(gasComparison(20, 2).relativeInternal).toBe(2);
    expect(gasComparison(60, 1).relativeInternal).toBeCloseTo(333.15 / 293.15);
    expect(gasComparison(60, 1).relativeInternal).not.toBe(3);
  });
  it('keeps pictured particles bounded and gives doubled samples the same normalized velocity distribution', () => {
    for (const t of [20, 60])
      for (const amount of [1, 2] as const)
        for (const phase of [0, 0.1, 0.5, 0.99, 1]) {
          const dots = gasDots(t, amount, phase);
          expect(dots).toHaveLength(8 * amount);
          for (const p of dots) {
            expect(p.x).toBeGreaterThanOrEqual(95);
            expect(p.x).toBeLessThanOrEqual(505);
            expect(p.y).toBeGreaterThanOrEqual(65);
            expect(p.y).toBeLessThanOrEqual(210);
          }
        }
    const meanSquared = (dots: ReturnType<typeof gasDots>) =>
      dots.reduce((s, p) => s + p.vx ** 2 + p.vy ** 2, 0) / dots.length;
    expect(meanSquared(gasDots(20, 2, 0))).toBe(meanSquared(gasDots(20, 1, 0)));
    expect(
      meanSquared(gasDots(60, 1, 0)) / meanSquared(gasDots(20, 1, 0)),
    ).toBeCloseTo(333.15 / 293.15);
    const a = gasDots(20, 1, 0);
    expect(a.reduce((s, p) => s + p.vx, 0)).toBe(0);
    expect(a.reduce((s, p) => s + p.vy, 0)).toBe(0);
  });
  it('relates absorbed water energy, mass and temperature change with consistent kg units', () => {
    expect(waterHeating(0.1, 840)).toMatchObject({
      capacity: 420,
      rise: 2,
      temperature: 22,
      internalIncrease: 840,
    });
    expect(waterHeating(0.2, 840).rise).toBe(1);
    expect(waterHeating(0.1, 1680).rise).toBe(4);
    expect(waterHeating(0.1, 0).temperature).toBe(20);
    for (let q = 0; q <= 1680; q += 120) {
      const s = waterHeating(0.1, q);
      expect(0.1 * 4200 * (s.temperature - 20)).toBeCloseTo(q);
      expect(s.internalIncrease).toBe(q);
    }
  });
  it('cools and warms toward ambient without overshooting, and gives compensating room energy', () => {
    for (const [initial, ambient] of [
      [60, 20],
      [60, 40],
      [10, 20],
    ])
      for (const t of [0, 60, 300, 600, 6000]) {
        const s = coolingSample(initial!, ambient!, 0.7, t);
        expect(s.temperature).toBeGreaterThanOrEqual(
          Math.min(initial!, ambient!),
        );
        expect(s.temperature).toBeLessThanOrEqual(Math.max(initial!, ambient!));
        expect(s.internalChange + s.netOut).toBe(0);
        expect(s.internalChange).toBeCloseTo(420 * (s.temperature - initial!));
      }
    expect(coolingSample(20, 20, 0.7, 600)).toMatchObject({
      temperature: 20,
      internalChange: 0,
    });
  });
  it('makes insulation slow both hot-water cooling and cold-water warming', () => {
    const hot = cupSnapshot(0, 600),
      cold = cupSnapshot(2, 600);
    expect(hot.bare.temperature).toBeCloseTo(34.71518, 4);
    expect(hot.wrapped.temperature).toBeCloseTo(52.74923, 4);
    expect(hot.wrapped.temperature).toBeGreaterThan(hot.bare.temperature);
    expect(cold.bare.temperature).toBeCloseTo(16.32121, 4);
    expect(cold.wrapped.temperature).toBeCloseTo(11.81269, 4);
    expect(cold.wrapped.temperature).toBeLessThan(cold.bare.temperature);
    expect(cupSnapshot(0, 1e7).wrapped.temperature).toBeCloseTo(20);
    expect(cupSnapshot(2, 1e7).wrapped.temperature).toBeCloseTo(20);
  });
  it('keeps conductance fixed when comparing rooms, halving the heat loss when the initial difference halves', () => {
    const a = cupSnapshot(0, 600),
      b = cupSnapshot(1, 600);
    expect(b.bare.temperature).toBeCloseTo(47.35759, 4);
    expect(b.bare.netOut).toBeCloseTo(a.bare.netOut / 2);
    expect(b.wrapped.netOut).toBeCloseTo(a.wrapped.netOut / 2);
    expect(cupCases).toHaveLength(3);
  });
  it('separates elapsed-time probes from the full cooling curves and preserves continuous monotonic changes', () => {
    for (const id of [0, 1, 2]) {
      let prev = cupSnapshot(id, 0);
      for (let t = 10; t <= 600; t += 10) {
        const next = cupSnapshot(id, t);
        for (const key of ['bare', 'wrapped'] as const) {
          if (id === 2)
            expect(next[key].temperature).toBeGreaterThan(
              prev[key].temperature,
            );
          else
            expect(next[key].temperature).toBeLessThan(prev[key].temperature);
          expect(
            Math.abs(next[key].temperature - prev[key].temperature),
          ).toBeLessThan(1);
        }
        prev = next;
      }
    }
  });
  it('conserves water mass and balances evaporation energy with surface loss plus room input', () => {
    for (const rate of [0, 0.1, 0.2])
      for (const t of [0, 0.001, 1, 60, 150, 300]) {
        const s = wetSurface(rate, t);
        expect(s.waterRemaining + s.evaporated).toBeCloseTo(2);
        expect(s.waterRemaining).toBeGreaterThanOrEqual(1);
        expect(s.latent).toBeCloseTo(s.evaporated * 2400);
        expect(s.latent).toBeCloseTo(s.roomIn - s.internalChange);
        expect(s.roomIn).toBeGreaterThanOrEqual(0);
        expect(s.internalChange).toBeCloseTo(200 * (s.temperature - 20));
        expect(s.temperature).toBeLessThanOrEqual(20);
        expect(s.temperature).toBeGreaterThan(0);
      }
  });
  it('has a zero net-rate reference and matched-parameter evaporation comparisons without claiming a fan prediction', () => {
    expect(wetSurface(0, 300)).toMatchObject({
      temperature: 20,
      waterRemaining: 2,
      evaporated: 0,
      latent: 0,
      roomIn: 0,
    });
    const a = wetSurface(0.1, 300),
      b = wetSurface(0.2, 300);
    expect(a).toMatchObject({ waterRemaining: 1.5, latent: 1200 });
    expect(a.temperature).toBeCloseTo(15.77893, 4);
    expect(a.roomIn).toBeCloseTo(355.78648, 4);
    expect(b.temperature).toBeCloseTo(11.55786, 4);
    expect(b.latent).toBe(2400);
    expect(b.internalChange).toBeCloseTo(2 * a.internalChange);
    expect(b.roomIn).toBeCloseTo(2 * a.roomIn);
  });
  it('distinguishes bulk convection from conduction and the matter-free radiation route', () => {
    expect(transferPaths).toEqual([
      { id: 'conduction', movingMatter: false, requiresMatter: true },
      { id: 'convection', movingMatter: true, requiresMatter: true },
      { id: 'radiation', movingMatter: false, requiresMatter: false },
    ]);
  });
  it('rejects nonfinite, invalid-domain and overflow inputs rather than emitting misleading readings', () => {
    for (const call of [
      () => absoluteTemperature(-273.15),
      () => absoluteTemperature(NaN),
      () => gasComparison(20, 0),
      () => gasComparison(20, Infinity),
      () => gasComparison(1e308, 1e308),
      () => gasDots(20, 3 as 1, 0),
      () => gasDots(20, 1, -1),
      () => gasDots(20, 1, Infinity),
      () => waterHeating(0, 840),
      () => waterHeating(0.1, -1),
      () => waterHeating(0.1, Infinity),
      () => waterHeating(0.1, 840, -1),
      () => waterHeating(0.1, 33600),
      () => waterHeating(1e308, 1),
      () => coolingSample(20, 0, 0, 10),
      () => coolingSample(20, 0, 1, -1),
      () => coolingSample(20, 0, 1, Infinity),
      () => cupSnapshot(3, 600),
      () => wetSurface(0.3, 300),
      () => wetSurface(0.1, 301),
      () => wetSurface(-0.1, 10),
      () => wetSurface(0.1, Infinity),
    ])
      expect(call).toThrow(RangeError);
  });
  it('adds five complete bilingual investigations after the existing fifty without changing earlier identifiers', () => {
    expect(lessons.slice(0, 55)).toHaveLength(55);
    expect(lessons.slice(50, 55).map((l) => l.id)).toEqual(
      thermalLessons.map((l) => l.id),
    );
    expect(new Set(lessons.slice(0, 55).map((l) => l.id)).size).toBe(55);
    expect(Object.keys(units).at(-1)).toBe('thermal');
    for (const l of thermalLessons) {
      expect(l.stage).toBe(2);
      expect(l.unit).toBe('thermal');
      expect(l.minutes).toBeGreaterThanOrEqual(12);
      expect(l.minutes).toBeLessThanOrEqual(20);
      expect(l.questions).toHaveLength(3);
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
        expect(l[key]?.zh).toBeTruthy();
        expect(l[key]?.en).toBeTruthy();
      }
      if (l.formula) {
        expect(l.formula.zh).toBeTruthy();
        expect(l.formula.en).toBeTruthy();
      }
      for (const question of [...l.questions, l.exit]) {
        expect(question.options[question.correct]?.zh).toBeTruthy();
        expect(question.explanation.en).toBeTruthy();
      }
    }
  });
});
