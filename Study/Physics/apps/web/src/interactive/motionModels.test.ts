import { describe, expect, it } from 'vitest';
import {
  trainView,
  returnJourney,
  averageTrip,
  averageTripState,
} from './motionModels';
import { motionLessons } from '../content/motion';
import { lessons } from '../content/lessons';
describe('motion with explicit references and intervals', () => {
  it('describes the same standing passenger in ground and train frames', () => {
    const ground = trainView(4, 'ground', 0),
      train = trainView(4, 'train', 0);
    expect(ground.passengerPosition).toBe(13);
    expect(train.passengerPosition).toBe(5);
    expect(ground.groundPosition).toBe(train.groundPosition);
    expect(ground.passengerVelocity).toBe(2);
    expect(train.passengerVelocity).toBe(0);
    expect(train.trainPosition).toBe(0);
  });
  it('keeps backward walking direction distinct between frames and within the carriage', () => {
    const ground = trainView(4, 'ground', -1),
      train = trainView(4, 'train', -1);
    expect(ground.passengerPosition).toBe(9);
    expect(ground.passengerVelocity).toBe(1);
    expect(train.passengerPosition).toBe(1);
    expect(train.passengerVelocity).toBe(-1);
    for (const w of [-1, 0, 1] as const)
      for (const t of [0, 1, 2, 3, 4]) {
        const view = trainView(t, 'train', w);
        expect(view.passengerPosition).toBeGreaterThanOrEqual(0);
        expect(view.passengerPosition).toBeLessThanOrEqual(10);
      }
    expect(() => trainView(NaN, 'ground', 0)).toThrow();
  });
  it('accumulates both legs while net displacement returns to zero', () => {
    expect(returnJourney(3)).toMatchObject({
      position: 6,
      distance: 6,
      displacement: 6,
    });
    expect(returnJourney(5)).toMatchObject({
      position: 2,
      distance: 10,
      displacement: 2,
    });
    expect(returnJourney(6)).toMatchObject({
      position: 0,
      distance: 12,
      displacement: 0,
    });
    expect(returnJourney(100)).toEqual(returnJourney(6));
    expect(returnJourney(-1).distance).toBe(0);
  });
  it('makes horizontal graph segments a pause, with decreasing position and increasing distance on return', () => {
    expect(returnJourney(3, 2)).toMatchObject({ position: 6, distance: 6 });
    expect(returnJourney(4, 2)).toMatchObject({
      position: 6,
      distance: 6,
      phase: 'pause',
    });
    expect(returnJourney(5, 2)).toMatchObject({ position: 6, distance: 6 });
    expect(returnJourney(7, 2)).toMatchObject({
      position: 2,
      distance: 10,
      phase: 'return',
    });
    expect(returnJourney(8, 2)).toMatchObject({ position: 0, distance: 12 });
    let previous = 0;
    for (let t = 0; t <= 8; t += 0.25) {
      const r = returnJourney(t, 2);
      expect(r.distance).toBeGreaterThanOrEqual(previous);
      expect(r.distance).toBeGreaterThanOrEqual(Math.abs(r.displacement));
      previous = r.distance;
    }
  });
  it('uses elapsed time rather than an unweighted mean of segment speeds', () => {
    const trip = averageTrip(0),
      paused = averageTrip(3);
    expect(trip.totalDistance).toBe(12);
    expect(trip.totalTime).toBe(9);
    expect(trip.averageSpeed).toBeCloseTo(4 / 3);
    expect(trip.unweightedMean).toBe(1.5);
    expect(paused.totalTime).toBe(12);
    expect(paused.averageSpeed).toBe(1);
    expect(trip.averageVelocity).toBe(0);
    expect(paused.averageVelocity).toBe(0);
    expect(() => averageTrip(-1)).toThrow();
  });
  it('synchronizes the slower return and pause with the same totals shown by the table', () => {
    expect(averageTripState(3, 3)).toMatchObject({
      position: 6,
      distance: 6,
      phase: 'pause',
    });
    expect(averageTripState(5, 3)).toMatchObject({
      position: 6,
      distance: 6,
      phase: 'pause',
    });
    expect(averageTripState(9, 3)).toMatchObject({
      position: 3,
      distance: 9,
      phase: 'return',
    });
    expect(averageTripState(12, 3)).toMatchObject({
      position: 0,
      distance: 12,
      phase: 'finished',
    });
    expect(averageTripState(20, 0).distance).toBe(averageTrip(0).totalDistance);
  });
  it('places reference and distance before the original speed course, then average and graph interpretation', () => {
    const ids = [
        'position-and-reference',
        'distance-and-displacement',
        'what-is-speed',
        'average-speed',
        'reading-motion-graphs',
      ],
      positions = ids.map((id) => lessons.findIndex((l) => l.id === id));
    expect(positions.every((i) => i >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    for (const l of motionLessons) {
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
