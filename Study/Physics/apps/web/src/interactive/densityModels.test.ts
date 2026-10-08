import { describe, expect, it } from 'vitest';
import {
  densitySample,
  densityReading,
  regularDensity,
  irregularDensity,
  densityFloat,
  type DensitySample,
  type ImmersionCase,
} from './densityModels';
import { densityLessons } from '../content/density';
import { lessons, units } from '../content/lessons';
import { experiments } from '../content/experiments';

describe('density evidence and controlled comparisons', () => {
  it('compares different materials at equal volume and preserves density when size changes', () => {
    expect(densitySample('wood', 20).mass).toBe(12);
    expect(densitySample('aluminium', 20).mass).toBe(54);
    expect(densitySample('steel', 20).mass).toBe(156);
    for (const material of ['wood', 'aluminium', 'steel'] as const) {
      const small = densitySample(material, 20),
        large = densitySample(material, 40);
      expect(large.mass).toBe(small.mass * 2);
      expect(large.volume).toBe(small.volume * 2);
      expect(large.density).toBe(small.density);
      expect(small.mass / small.volume).toBeCloseTo(small.density);
    }
  });
  it('converts both measured quantities and density consistently into SI units', () => {
    const base = densityReading(54, 20),
      si = densityReading(54, 20, true);
    expect(base).toMatchObject({
      mass: 54,
      volume: 20,
      density: 2.7,
      densityUnit: 'g/cm³',
    });
    expect(si).toMatchObject({
      mass: 0.054,
      volume: 0.00002,
      density: 2700,
      massUnit: 'kg',
      volumeUnit: 'm³',
      densityUnit: 'kg/m³',
    });
    expect(si.mass / si.volume).toBeCloseTo(si.density);
    expect(si.density / base.density).toBeCloseTo(1000);
  });
  it('derives regular volumes from all three edges while retaining original instrument units', () => {
    expect(regularDensity(false)).toMatchObject({
      sides: [5, 2, 2],
      volume: 20,
      mass: 54,
      density: 2.7,
    });
    expect(regularDensity(true, true)).toMatchObject({
      sides: [10, 2, 2],
      volume: 0.00004,
      mass: 0.108,
      density: 2700,
      volumeCm3: 40,
      massG: 108,
    });
  });
  it('uses the change in cylinder readings rather than the final water volume', () => {
    expect(irregularDensity('full')).toMatchObject({
      before: 40,
      after: 60,
      mass: 54,
      apparentVolume: 20,
      apparentDensity: 2.7,
      valid: true,
    });
  });
  it('retains procedure errors and their opposite density biases', () => {
    const partial = irregularDensity('partial'),
      full = irregularDensity('full'),
      bubble = irregularDensity('bubble');
    expect(partial.valid).toBe(false);
    expect(bubble.valid).toBe(false);
    expect(partial.apparentVolume).toBe(12);
    expect(partial.apparentDensity).toBe(4.5);
    expect(bubble.apparentVolume).toBe(full.trueVolume + bubble.bubbleVolume);
    expect(bubble.apparentDensity).toBe(2.25);
    expect(partial.apparentDensity).toBeGreaterThan(full.apparentDensity);
    expect(bubble.apparentDensity).toBeLessThan(full.apparentDensity);
    expect([partial.mass, full.mass, bubble.mass]).toEqual([54, 54, 54]);
  });
  it('distinguishes partial floating, neutral immersion and insufficient displacement', () => {
    expect(densityFloat(0.6, false)).toMatchObject({
      mass: 12,
      floats: true,
      neutral: false,
      submergedFraction: 0.6,
      displacedVolume: 12,
      displacedWaterMass: 12,
    });
    expect(densityFloat(1, false)).toMatchObject({
      mass: 20,
      floats: false,
      neutral: true,
      submergedFraction: 1,
      displacedVolume: 20,
      displacedWaterMass: 20,
    });
    expect(densityFloat(1.02, false)).toMatchObject({
      mass: 20.4,
      floats: false,
      neutral: false,
      submergedFraction: 1,
      displacedWaterMass: 20,
    });
  });
  it('changes the liquid while preserving the solid and balances a new floating state', () => {
    const fresh = densityFloat(1.02, false),
      salt = densityFloat(1.02, true);
    expect(salt.mass).toBe(fresh.mass);
    expect(salt.volume).toBe(fresh.volume);
    expect(salt.density).toBe(fresh.density);
    expect(salt.floats).toBe(true);
    expect(salt.submergedFraction).toBeCloseTo(1.02 / 1.05);
    expect(salt.displacedVolume).toBeCloseTo(20.4 / 1.05);
    expect(salt.displacedWaterMass).toBe(salt.mass);
  });
  it('rejects invalid readings, inherited sample names and unknown procedure conditions', () => {
    for (const invalid of ['constructor', '__proto__', 'unknown'])
      expect(() => densitySample(invalid as DensitySample, 20)).toThrow();
    for (const invalid of [0, -1, Infinity, NaN, 10001]) {
      expect(() => densityReading(invalid, 20)).toThrow();
      expect(() => densityReading(54, invalid)).toThrow();
      expect(() => densitySample('wood', invalid)).toThrow();
    }
    expect(() => irregularDensity('unknown' as ImmersionCase)).toThrow();
    expect(() => densityFloat(NaN, false)).toThrow();
    expect(() => densityFloat(-1, false)).toThrow();
  });
  it('integrates four bilingual courses after gravity with complete assessment and lab links', () => {
    const start =
      lessons.findIndex((l) => l.id === 'heavy-light-free-fall') + 1;
    expect(lessons.slice(start, start + 4)).toEqual(densityLessons);
    expect(new Set(lessons.map((l) => l.id)).size).toBe(lessons.length);
    const pathOrder = Object.keys(units).flatMap((unit) =>
      lessons.filter((lesson) => lesson.stage === 1 && lesson.unit === unit),
    );
    expect(pathOrder.map((lesson) => lesson.id)).toEqual(
      lessons.filter((lesson) => lesson.stage === 1).map((lesson) => lesson.id),
    );
    for (const lesson of densityLessons) {
      expect(lesson.stage).toBe(1);
      expect(lesson.unit).toBe('density');
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
        for (const text of [
          question.prompt,
          question.explanation,
          ...question.options,
        ]) {
          expect(text.zh.trim()).not.toBe('');
          expect(text.en.trim()).not.toBe('');
        }
      }
    }
  });
});
