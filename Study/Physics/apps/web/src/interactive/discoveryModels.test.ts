import { describe, expect, it } from 'vitest';
import {
  mirrorRay,
  polarizedWall,
  brakingState,
  fairTestResult,
} from './discoveryModels';
import { causeLesson, discoveryLessons } from '../content/discoveries';
import { lessons } from '../content/lessons';
describe('discovery models', () => {
  it('constructs equal mirror distances and equal ray angles without reversing vertical position', () => {
    const eye = { x: 85, y: 95 };
    for (const d of [20, 40, 60, 80, 100]) {
      const object = { x: 350 - 2 * d, y: 220 },
        r = mirrorRay(object, eye, 350);
      expect(r.imageDistance).toBe(r.objectDistance);
      expect(r.image.y).toBe(object.y);
      const incoming = (r.reflection.y - object.y) / (350 - object.x),
        outgoing = (eye.y - r.reflection.y) / (350 - eye.x);
      expect(Math.abs(incoming)).toBeCloseTo(Math.abs(outgoing));
      expect(r.reflection.y).toBeGreaterThan(eye.y);
      expect(r.reflection.y).toBeLessThan(object.y);
    }
    expect(() => mirrorRay({ x: 400, y: 20 }, eye, 350)).toThrow();
  });
  it('opposes the near charge while keeping wall net charge zero for either balloon polarity', () => {
    for (const sign of [-1, 0, 1] as const) {
      const r = polarizedWall(sign);
      expect(r.near + r.far).toBe(0);
      expect(r.total).toBe(0);
      if (sign !== 0) expect(r.near * sign).toBeLessThan(0);
    }
  });
  it('slows the restrained passenger with the vehicle while an unrestrained passenger keeps ground-frame motion until contact', () => {
    const belt = brakingState(0.4, true),
      off = brakingState(0.4, false);
    expect(belt.vehicleDistance).toBeCloseTo(0.4);
    expect(belt.passengerDistance).toBeCloseTo(0.4);
    expect(belt.passengerSpeed).toBe(0);
    expect(belt.relativeDistance).toBe(0);
    expect(off.vehicleSpeed).toBe(0);
    expect(off.passengerSpeed).toBe(2);
    expect(off.relativeDistance).toBeCloseTo(0.4);
    const end = brakingState(1, false);
    expect(end.contactTime).toBeCloseTo(0.7);
    expect(end.relativeDistance).toBeCloseTo(1);
    expect(end.contact).toBe(true);
    expect(end.passengerSpeed).toBeNull();
    // A shorter gap can reach the front before the vehicle has stopped.
    const early = brakingState(1, false, 2, 5, 0.1);
    expect(early.contactTime).toBeCloseTo(0.2);
    expect(early.vehicleSpeed).toBeCloseTo(1);
    expect(early.relativeDistance).toBeCloseTo(0.1);
    // A belt prevents reaching that gap; the passenger still follows the full stop.
    const shortGapBelt = brakingState(1, true, 2, 5, 0.1);
    expect(shortGapBelt.vehicleSpeed).toBe(0);
    expect(shortGapBelt.passengerSpeed).toBe(0);
    expect(shortGapBelt.passengerDistance).toBeCloseTo(0.4);
    expect(shortGapBelt.contact).toBe(false);
  });
  it('separates surface and starting-speed comparisons in the fair-test table', () => {
    expect(fairTestResult(2, false).distance).toBe(4);
    expect(fairTestResult(3, true).distance).toBe(2.25);
    expect(fairTestResult(2, true).distance).toBe(1);
    expect(fairTestResult(3, false).distance).toBe(9);
    expect(() => fairTestResult(4, false)).toThrow();
  });
  it('places causal reasoning after data and before mysteries, then retains the motion preview', () => {
    const pos = (id: string) => lessons.findIndex((l) => l.id === id);
    expect(pos(causeLesson.id)).toBeGreaterThan(pos('simple-graphs'));
    expect(pos(causeLesson.id)).toBeLessThan(pos('why-ice-floats'));
    for (const l of discoveryLessons) {
      expect(pos(l.id)).toBeGreaterThan(pos(causeLesson.id));
      expect(pos(l.id)).toBeLessThan(pos('what-is-speed'));
      expect(l.questions).toHaveLength(3);
    }
  });
});
