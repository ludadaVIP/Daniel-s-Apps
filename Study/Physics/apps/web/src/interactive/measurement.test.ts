import { describe, expect, it } from 'vitest';
import {
  lengthReading,
  timingEstimate,
  mean,
  rollingSamples,
  walkingDistance,
  walkingSamples,
} from './measurement';
import { lessons, units } from '../content/lessons';
import { experiments } from '../content/experiments';
import { decodeProgress } from '../progress';
describe('measurement evidence', () => {
  it('describes one unchanged length in three units', () => {
    expect(lengthReading(0.24, 'cm')).toBeCloseTo(24);
    expect(lengthReading(0.24, 'mm')).toBeCloseTo(240);
    expect(lengthReading(0.24, 'm')).toBeCloseTo(0.24);
    expect(lengthReading(0.24, 'cm') / 100).toBeCloseTo(
      lengthReading(0.24, 'mm') / 1000,
    );
  });
  it('reduces the same endpoint timing error by timing multiple full cycles', () => {
    const once = timingEstimate(1, 0.2),
      ten = timingEstimate(10, 0.2);
    expect(once.total).toBeCloseTo(2.2);
    expect(ten.total).toBeCloseTo(20.2);
    expect(ten.perCycle).toBeCloseTo(2.02);
    expect(ten.errorPerCycle).toBeCloseTo(once.errorPerCycle / 10);
    expect(timingEstimate(10, 0).perCycle).toBe(2);
    expect(() => timingEstimate(0, 0.2)).toThrow();
    expect(() => timingEstimate(1, -0.2)).toThrow();
  });
  it('retains variation and interprets a mean only with actual readings', () => {
    expect(mean([])).toBeNull();
    expect(mean(rollingSamples.smooth)).toBeCloseTo(9);
    expect(mean(rollingSamples.rough)).toBeCloseTo(3);
    expect(Math.min(...rollingSamples.smooth)).toBeGreaterThan(
      Math.max(...rollingSamples.rough),
    );
    expect(new Set(rollingSamples.smooth).size).toBe(3);
  });
  it('agrees across graph, table and track and represents a real two-second pause', () => {
    for (const walk of ['steady', 'pause'] as const)
      walkingSamples[walk].forEach((distance, time) =>
        expect(walkingDistance(walk, time)).toBe(distance),
      );
    expect(walkingDistance('pause', 1)).toBe(2);
    expect(walkingDistance('pause', 2.5)).toBe(2);
    expect(walkingDistance('pause', 3)).toBe(2);
    expect(walkingDistance('pause', 3.5)).toBe(3);
    expect(walkingDistance('steady', 2.5)).toBe(2.5);
    expect(walkingDistance('steady', 100)).toBe(4);
    expect(walkingDistance('steady', -1)).toBe(0);
  });
});
describe('curriculum expansion', () => {
  it('connects measuring quantities, units and length before time, mass, temperature and data', () => {
    const ordered = [
      'what-can-we-measure',
      'units-make-sense',
      'measure-length',
      'measure-time',
      'measure-mass',
      'measure-temperature',
      'tables-and-data',
      'simple-graphs',
      'what-is-speed',
    ];
    const indexes = ordered.map((id) => lessons.findIndex((l) => l.id === id));
    expect(indexes.every((i) => i >= 0)).toBe(true);
    expect(indexes).toEqual([...indexes].sort((a, b) => a - b));
    expect(lessons.filter((l) => l.stage === 0).length).toBeGreaterThanOrEqual(
      11,
    );
    expect(lessons.find((l) => l.id === 'what-is-speed')?.stage).toBe(1);
  });
  it('gives every lesson a named unit and a supported experiment', () => {
    for (const lesson of lessons) {
      expect(units[lesson.unit]).toBeDefined();
      expect(
        experiments.some(
          (e) =>
            e.id === (lesson.kind === 'variables' ? 'friction' : lesson.kind),
        ),
      ).toBe(true);
      expect(lesson.questions.length).toBeGreaterThanOrEqual(2);
    }
  });
  it('preserves completed V1 lessons after the new courses are inserted', () => {
    const ids = [
      'physics-everywhere',
      'ask-a-physicist',
      'observe-explain',
      'measure-length',
      'what-is-speed',
    ];
    const stored = Object.fromEntries(
      ids.map((id) => {
        const l = lessons.find((l) => l.id === id)!;
        return [
          id,
          {
            step: 4,
            unlockedStep: 4,
            prediction: 0,
            explored: true,
            answers: Object.fromEntries(
              [...l.questions, l.exit].map((q, i) => [i, q.correct]),
            ),
            mistakes: [],
            completedAt: 100000,
          },
        ];
      }),
    );
    const restored = decodeProgress(
      JSON.stringify({ lessons: stored, notes: [] }),
    );
    for (const id of ids)
      expect(restored.lessons[id]?.completedAt).toBe(100000);
    expect(restored.lessons['measure-time']).toBeUndefined();
  });
});
