import { describe, expect, it } from 'vitest';
import {
  gravityMeasurement,
  balanceTilt,
  gravityFall,
  type GravityLocation,
} from './gravityModels';
import { gravityLessons } from '../content/gravity';
import { lessons } from '../content/lessons';
import { experiments } from '../content/experiments';
describe('mass, weight and matched gravity comparisons', () => {
  it('keeps mass fixed when changing location and changes weight with g', () => {
    for (const mass of [0.1, 0.5, 1, 2]) {
      const earth = gravityMeasurement(mass, 'earth'),
        moon = gravityMeasurement(mass, 'moon');
      expect(earth.mass).toBe(moon.mass);
      expect(earth.weight).toBe(mass * 10);
      expect(moon.weight).toBe(mass * 1.6);
      expect(moon.weight / earth.weight).toBeCloseTo(0.16);
      expect(gravityMeasurement(mass * 2, 'moon').weight).toBeCloseTo(
        moon.weight * 2,
      );
    }
  });
  it('separates an Earth-calibrated force conversion from actual Moon mass', () => {
    expect(gravityMeasurement(1, 'earth').earthCalibratedReading).toBe(1);
    expect(gravityMeasurement(1, 'moon')).toMatchObject({
      mass: 1,
      weight: 1.6,
      earthCalibratedReading: 0.16,
    });
    expect(gravityMeasurement(2, 'moon').earthCalibratedReading).toBe(0.32);
  });
  it('balances equal reference masses and tips toward the heavier side', () => {
    expect(balanceTilt(1, 1)).toBe(0);
    expect(balanceTilt(2, 1)).toBeLessThan(0);
    expect(balanceTilt(1, 2)).toBeGreaterThan(0);
    expect(balanceTilt(2, 0.5)).toBe(-14);
  });
  it('gives different forces but identical trajectories for different masses in one location', () => {
    for (const location of ['earth', 'moon'] as const)
      for (const time of [0, 0.1, 0.25, 0.5, 0.75, 1, 2, 2.5, 3]) {
        const light = gravityFall(0.1, location, 5, time),
          heavy = gravityFall(1, location, 5, time);
        expect(light.weight * 10).toBeCloseTo(heavy.weight);
        expect(light.distance).toBe(heavy.distance);
        expect(light.speed).toBe(heavy.speed);
        expect(light.landingTime).toBe(heavy.landingTime);
        expect(light.heightRemaining).toBeGreaterThanOrEqual(0);
        expect(light.distance).toBeLessThanOrEqual(5);
        expect(light.distance + light.heightRemaining).toBeCloseTo(5);
      }
  });
  it('uses local gravity for landing time and distinguishes contact speed from a resting icon', () => {
    expect(gravityFall(0.1, 'earth', 5, 0.5)).toMatchObject({
      distance: 1.25,
      speed: 5,
      landingTime: 1,
      impactSpeed: 10,
      landed: false,
    });
    expect(gravityFall(1, 'moon', 5, 1)).toMatchObject({
      distance: 0.8,
      speed: 1.6,
      landingTime: 2.5,
      impactSpeed: 4,
      landed: false,
    });
    expect(gravityFall(1, 'earth', 5, 1)).toMatchObject({
      distance: 5,
      heightRemaining: 0,
      speed: 0,
      impactSpeed: 10,
      landed: true,
    });
    expect(gravityFall(1, 'moon', 5, 8)).toMatchObject({
      time: 2.5,
      distance: 5,
      speed: 0,
      landed: true,
    });
    expect(gravityFall(1, 'earth', 5, -1)).toMatchObject({
      time: 0,
      distance: 0,
      speed: 0,
      landed: false,
    });
  });
  it('covers larger later distances in equal time intervals', () => {
    const at = (time: number) => gravityFall(1, 'earth', 5, time).distance;
    const intervals = [0.25, 0.5, 0.75, 1].map((t, i) => at(t) - at(i * 0.25));
    expect(intervals).toEqual([0.3125, 0.9375, 1.5625, 2.1875]);
  });
  it('rejects invalid numbers and inherited-property locations', () => {
    for (const mass of [NaN, Infinity, 0, -1, 101])
      expect(() => gravityMeasurement(mass, 'earth')).toThrow();
    for (const invalid of ['mars', 'constructor', '__proto__'])
      expect(() => gravityMeasurement(1, invalid as GravityLocation)).toThrow();
    for (const height of [0, -1, 21, NaN])
      expect(() => gravityFall(1, 'earth', height, 1)).toThrow();
    expect(() => gravityFall(1, 'earth', 5, Infinity)).toThrow();
    expect(() => balanceTilt(1, NaN)).toThrow();
  });
  it('integrates three bilingual courses after air resistance with complete transfer checks', () => {
    const start = lessons.findIndex((l) => l.id === 'air-resistance-paper') + 1;
    expect(lessons.slice(start, start + 3)).toEqual(gravityLessons);
    expect(new Set(lessons.map((l) => l.id)).size).toBe(lessons.length);
    for (const lesson of gravityLessons) {
      expect(lesson.stage).toBe(1);
      expect(lesson.unit).toBe('gravity');
      expect(lesson.questions).toHaveLength(3);
      expect(experiments.some((e) => e.id === lesson.kind)).toBe(true);
      for (const text of [
        lesson.title,
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
        expect(text.zh.trim()).not.toBe('');
        expect(text.en.trim()).not.toBe('');
      }
      for (const question of [...lesson.questions, lesson.exit]) {
        expect(question.options[question.correct]).toBeDefined();
        expect(question.prompt.zh).toBeTruthy();
        expect(question.prompt.en).toBeTruthy();
        expect(question.explanation.zh).toBeTruthy();
        expect(question.explanation.en).toBeTruthy();
      }
    }
  });
});
