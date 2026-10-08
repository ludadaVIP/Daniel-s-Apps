import { describe, expect, it } from 'vitest';
import {
  blockVolume,
  displacedVolume,
  calibrationReadings,
  trialSummary,
  repeatTimes,
  paperReading,
} from './measurementSkills';
import { measurementSkillsLessons } from '../content/measurementSkills';
import { lessons } from '../content/lessons';
describe('junior measurement evidence', () => {
  it('cross-checks block geometry and displacement, excluding impossible readings', () => {
    expect(displacedVolume(40, 58)).toBe(18);
    expect(blockVolume(2, 3, 4)).toBe(displacedVolume(40, 64));
    expect(() => displacedVolume(58, 40)).toThrow();
    expect(() => displacedVolume(-1, 40)).toThrow();
    expect(() => blockVolume(0, 3, 4)).toThrow();
  });
  it('reveals a shared bias in fine and coarse rulers and does not equate equal displays with absence of variation', () => {
    expect(calibrationReadings(1, 0.1)).toEqual([10.9, 11, 11.1]);
    expect(calibrationReadings(0, 0.1)).toEqual([9.9, 10, 10.1]);
    expect(calibrationReadings(0, 1)).toEqual([10, 10, 10]);
    expect(calibrationReadings(1, 1)).toEqual([11, 11, 11]);
    const biased = trialSummary(
      calibrationReadings(1, 0.1).map((value) => ({ value, invalid: false })),
    );
    expect(biased.mean).toBeCloseTo(11);
    expect(biased.range).toBeCloseTo(0.2);
  });
  it('retains raw evidence while calculating a separately justified valid estimate', () => {
    const trials = [
      ...repeatTimes.map((value) => ({ value, invalid: false })),
      { value: 1, invalid: true },
    ];
    const summary = trialSummary(trials);
    expect(summary.rawMean).toBeCloseTo(7.75);
    expect(summary.mean).toBeCloseTo(10);
    expect(summary.range).toBeCloseTo(0.4);
    expect(summary.count).toBe(3);
    expect(trials).toHaveLength(4);
    expect(trials[3]!.value).toBe(1);
    expect(
      trialSummary(trials.map((t) => ({ ...t, invalid: false }))).mean,
    ).toBeCloseTo(7.75);
  });
  it('does not fabricate a mean from no valid measurements', () => {
    expect(trialSummary([])).toEqual({
      rawMean: null,
      mean: null,
      count: 0,
      range: null,
    });
    expect(trialSummary([{ value: 1, invalid: true }])).toEqual({
      rawMean: 1,
      mean: null,
      count: 0,
      range: null,
    });
    expect(() => trialSummary([{ value: NaN, invalid: false }])).toThrow();
  });
  it('distinguishes an unresolved single sheet from zero and divides fixed stack error by sheet count', () => {
    expect(paperReading(1).resolved).toBe(false);
    expect(paperReading(1).trueThickness).toBeGreaterThan(0);
    expect(paperReading(100).stackReading).toBe(10);
    expect(paperReading(100).estimate).toBeCloseTo(0.1);
    expect(paperReading(100, 1).estimate).toBeCloseTo(0.11);
    expect(paperReading(20, 1).estimate).toBeCloseTo(0.15);
    expect(paperReading(100, 1).endpointContribution).toBeCloseTo(0.01);
    expect(paperReading(20, 1).endpointContribution).toBeCloseTo(0.05);
    expect(() => paperReading(200)).toThrow();
  });
  it('places measurement reasoning before the motion preview and supplies bilingual transfer checks', () => {
    const ids = measurementSkillsLessons.map((l) => l.id),
      positions = ids.map((id) => lessons.findIndex((l) => l.id === id));
    expect(new Set(lessons.map((l) => l.id)).size).toBe(lessons.length);
    expect(
      positions.every(
        (p) => p >= 0 && p < lessons.findIndex((l) => l.id === 'what-is-speed'),
      ),
    ).toBe(true);
    for (const l of measurementSkillsLessons) {
      expect(l.stage).toBe(1);
      expect(l.questions).toHaveLength(3);
      for (const q of [...l.questions, l.exit]) {
        expect(q.options[q.correct]).toBeDefined();
        expect(q.prompt.zh.length).toBeGreaterThan(5);
        expect(q.prompt.en.length).toBeGreaterThan(10);
        expect(q.explanation.zh.length).toBeGreaterThan(5);
        expect(q.explanation.en.length).toBeGreaterThan(10);
      }
    }
  });
});
