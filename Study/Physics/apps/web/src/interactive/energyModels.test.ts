import { describe, expect, it } from 'vitest';
import {
  kineticEnergy,
  gravitationalEnergy,
  elasticEnergy,
  springRelease,
  lampLedger,
  trackLedger,
  trackRecovery,
} from './energyModels';
import { energyLessons } from '../content/energy';
import { lessons, units } from '../content/lessons';
import { experiments } from '../content/experiments';

describe('energy comparisons, complete ledgers and boundaries', () => {
  it('changes one kinetic variable at a time, with quadratic speed and no direction sign', () => {
    expect(kineticEnergy(0.5, 2)).toBe(1);
    expect(kineticEnergy(1, 2)).toBe(2);
    expect(kineticEnergy(0.5, 4)).toBe(4);
    expect(kineticEnergy(1, 4)).toBe(8);
    expect(kineticEnergy(0.5, 0)).toBe(0);
    expect(kineticEnergy(0.5, -2)).toBe(kineticEnergy(0.5, 2));
  });
  it('shifts both gravitational labels without changing the physical descent', () => {
    expect(gravitationalEnergy(0.5, 1)).toBe(5);
    expect(gravitationalEnergy(0.5, 1, 0.5)).toBe(2.5);
    expect(gravitationalEnergy(0.5, 0, 0.5)).toBe(-2.5);
    for (const zero of [-2, 0, 0.5, 2]) {
      const change =
        gravitationalEnergy(0.5, 1, zero) - gravitationalEnergy(0.5, 0, zero);
      expect(change).toBe(5);
    }
    expect(gravitationalEnergy(1, 1)).toBe(10);
    expect(gravitationalEnergy(0.5, 0.5)).toBe(2.5);
    expect(gravitationalEnergy(0.5, 1, 0, 1.6)).toBeCloseTo(0.8);
  });
  it('compares signed spring deformations, stiffness and squared extension', () => {
    expect(elasticEnergy(100, 0.1)).toBeCloseTo(0.5);
    expect(elasticEnergy(100, -0.1)).toBe(elasticEnergy(100, 0.1));
    expect(elasticEnergy(100, 0.2)).toBeCloseTo(2);
    expect(elasticEnergy(200, 0.1)).toBeCloseTo(1);
    expect(elasticEnergy(100, 0)).toBe(0);
  });
  it('uses compatible spring position and velocity while conserving both energy stores', () => {
    for (const k of [100, 200])
      for (const x of [-0.1, 0, 0.1, 0.2]) {
        const initial = springRelease(k, x, 0);
        for (let n = 0; n <= 20; n++) {
          const s = springRelease(k, x, (initial.duration * n) / 20);
          expect(s.total).toBeCloseTo(initial.initial, 12);
          expect(s.elastic).toBeGreaterThanOrEqual(0);
          expect(s.kinetic).toBeGreaterThanOrEqual(0);
          if (n > 0 && n < 20 && x !== 0) {
            const dt = initial.duration * 1e-5,
              before = springRelease(k, x, s.time - dt),
              after = springRelease(k, x, s.time + dt);
            expect((after.extension - before.extension) / (2 * dt)).toBeCloseTo(
              s.velocity,
              7,
            );
          }
        }
      }
  });
  it('ends at first natural length with nonzero speed and opposite release directions', () => {
    const duration = springRelease(100, 0.1, 0).duration;
    const end = springRelease(100, 0.1, duration),
      later = springRelease(100, 0.1, 100);
    expect(end.extension).toBe(0);
    expect(end.elastic).toBe(0);
    expect(end.kinetic).toBeCloseTo(0.5);
    expect(end.velocity).toBeCloseTo(-Math.SQRT2);
    expect(later).toEqual(end);
    expect(springRelease(100, -0.1, duration).velocity).toBeCloseTo(Math.SQRT2);
    expect(springRelease(200, 0.1, 100).velocity).toBeCloseTo(-2);
  });
  it('separates battery stores from cumulative transfers and retains a full boundary ledger', () => {
    expect(lampLedger(false, 1)).toMatchObject({
      remaining: 12,
      lightOut: 0,
      thermal: 0,
      transferred: 0,
    });
    expect(lampLedger(true, 0.5)).toMatchObject({
      remaining: 6,
      lightOut: 1.5,
      thermal: 4.5,
    });
    expect(lampLedger(true, 1)).toMatchObject({
      remaining: 0,
      lightOut: 3,
      thermal: 9,
    });
    for (let n = 0; n <= 100; n++) {
      const s = lampLedger(true, n / 100);
      expect(s.remaining + s.lightOut + s.thermal).toBeCloseTo(12, 12);
      expect(s.lightOut + s.thermal).toBeCloseTo(s.transferred, 12);
    }
  });
  it('exchanges height and kinetic energy on both sides without creating total energy', () => {
    expect(trackLedger(false, 0)).toMatchObject({
      height: 1,
      potential: 10,
      kinetic: 0,
      thermal: 0,
    });
    expect(trackLedger(false, 0.5)).toMatchObject({
      height: 0,
      potential: 0,
      kinetic: 10,
    });
    expect(trackLedger(false, 0.5).speed).toBeCloseTo(Math.sqrt(20));
    expect(trackLedger(false, 0.25).height).toBe(
      trackLedger(false, 0.75).height,
    );
    expect(trackLedger(false, 0.25).kinetic).toBeCloseTo(7.5);
    expect(trackLedger(false, 1)).toMatchObject({
      height: 1,
      potential: 10,
      kinetic: 0,
      atTurn: true,
    });
  });
  it('retains rough-path dissipation and stops at the accessible return instead of a phantom summit', () => {
    const bottom = trackLedger(true, 0.5),
      turn = trackLedger(true, 0.9),
      beyond = trackLedger(true, 1);
    expect(bottom).toMatchObject({
      potential: 0,
      kinetic: 8,
      thermal: 2,
      mechanical: 8,
    });
    expect(turn.height).toBeCloseTo(0.64);
    expect(turn.potential).toBeCloseTo(6.4);
    expect(turn.kinetic).toBe(0);
    expect(turn.thermal).toBeCloseTo(3.6);
    expect(beyond.position).toBe(turn.position);
    expect(beyond.height).toBe(turn.height);
    for (const rough of [false, true])
      for (let n = 0; n <= 100; n++) {
        const s = trackLedger(rough, n / 100);
        expect(s.total).toBeCloseTo(10, 12);
        expect(s.potential).toBeGreaterThanOrEqual(0);
        expect(s.kinetic).toBeGreaterThanOrEqual(0);
        expect(s.thermal).toBeGreaterThanOrEqual(0);
      }
  });
  it('defines useful output for the specified return-height task', () => {
    const ideal = trackRecovery(false),
      rough = trackRecovery(true);
    expect(ideal.efficiency).toBe(1);
    expect(rough.useful).toBeCloseTo(6.4);
    expect(rough.efficiency).toBeCloseTo(0.64);
    expect(rough.useful + rough.thermal).toBeCloseTo(rough.initial);
  });
  it('rejects nonphysical inputs, nonfinite calculations and out-of-domain inspection positions', () => {
    for (const value of [NaN, Infinity, -Infinity]) {
      expect(() => kineticEnergy(1, value)).toThrow();
      expect(() => gravitationalEnergy(1, value)).toThrow();
      expect(() => elasticEnergy(100, value)).toThrow();
      expect(() => springRelease(100, 0.1, value)).toThrow();
    }
    for (const mass of [0, -1]) expect(() => kineticEnergy(mass, 1)).toThrow();
    expect(() => gravitationalEnergy(1, 1, 0, 0)).toThrow();
    expect(() => elasticEnergy(0, 0.1)).toThrow();
    expect(() => springRelease(100, 0.1, -1)).toThrow();
    expect(() => springRelease(100, 0.1, 1, 0)).toThrow();
    expect(() => kineticEnergy(1e308, 1e308)).toThrow();
    for (const p of [-0.01, 1.01, NaN, Infinity]) {
      expect(() => lampLedger(true, p)).toThrow();
      expect(() => trackLedger(true, p)).toThrow();
    }
    expect(() => trackLedger('rough' as unknown as boolean, 0)).toThrow();
    expect(() => lampLedger(1 as unknown as boolean, 0)).toThrow();
  });
  it('opens six complete bilingual Stage 2 courses after density, with assessments and distinct stations', () => {
    const start =
      lessons.findIndex((l) => l.id === 'density-floating-comparison') + 1;
    expect(lessons.slice(start, start + 6)).toEqual(energyLessons);
    expect(lessons.filter((l) => l.stage < 2)).toHaveLength(39);
    expect(new Set(energyLessons.map((l) => l.kind)).size).toBe(6);
    expect(units.energy.zh).toBeTruthy();
    for (const lesson of energyLessons) {
      expect(lesson.stage).toBe(2);
      expect(lesson.unit).toBe('energy');
      expect(lesson.questions).toHaveLength(3);
      expect(experiments.some((e) => e.id === lesson.kind)).toBe(true);
      for (const value of [
        lesson.title,
        lesson.subtitle,
        lesson.hook,
        lesson.prediction,
        lesson.explore,
        lesson.concept,
        lesson.example,
        lesson.misconception,
        lesson.realWorld,
        lesson.summary,
        lesson.homeExperiment,
        ...lesson.predictions,
        ...lesson.vocabulary,
      ]) {
        expect(value.zh.trim()).toBeTruthy();
        expect(value.en.trim()).toBeTruthy();
      }
      for (const question of [...lesson.questions, lesson.exit]) {
        expect(question.options[question.correct]).toBeDefined();
        for (const value of [
          question.prompt,
          question.explanation,
          ...question.options,
        ]) {
          expect(value.zh.trim()).toBeTruthy();
          expect(value.en.trim()).toBeTruthy();
        }
      }
    }
  });
});
