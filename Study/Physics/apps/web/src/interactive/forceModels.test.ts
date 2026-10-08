import { describe, expect, it } from 'vitest';
import {
  forceCart,
  springResponse,
  frictionBlock,
  paperDrop,
} from './forceModels';
import { forceLessons } from '../content/forces';
import { lessons } from '../content/lessons';
describe('forces on identified objects', () => {
  it('preserves either rest or moving velocity with zero net force', () => {
    expect(forceCart(0, 2, 0)).toMatchObject({ position: 2, velocity: 0 });
    expect(forceCart(0, 2, 1)).toMatchObject({ position: 4, velocity: 1 });
    expect(forceCart(2, 2, 1)).toMatchObject({ position: 6, velocity: 3 });
  });
  it('lets a leftward force slow rightward motion, stop it, then reverse it if the force continues', () => {
    expect(forceCart(-2, 0.5).velocity).toBe(0.5);
    expect(forceCart(-2, 1).velocity).toBe(0);
    expect(forceCart(-2, 2)).toMatchObject({ position: 2, velocity: -1 });
    expect(forceCart(4 - 2, 2, 0).velocity).toBe(2);
    expect(forceCart(2 - 4, 2, 1).velocity).toBe(-1);
  });
  it('separates spring deformation from a translating cart and limits the linear range', () => {
    expect(springResponse(0)).toMatchObject({ lengthCm: 20, changeCm: 0 });
    expect(springResponse(2)).toMatchObject({ lengthCm: 25, changeCm: 5 });
    expect(springResponse(-2)).toMatchObject({ lengthCm: 15, changeCm: -5 });
    expect(() => springResponse(3)).toThrow();
  });
  it('adjusts static friction to the applied force instead of always using the limit', () => {
    for (const force of [-3, -2, 0, 2, 3])
      expect(frictionBlock(force, 2, false, true)).toMatchObject({
        position: 2,
        velocity: 0,
        friction: force === 0 ? 0 : -force,
        netForce: 0,
        phase: 'sticking',
      });
    expect(frictionBlock(4, 2, false, true)).toMatchObject({
      position: 4,
      velocity: 2,
      friction: -2,
      netForce: 2,
    });
    expect(frictionBlock(-4, 2, false, true)).toMatchObject({
      position: 0,
      velocity: -2,
      friction: 2,
      netForce: -2,
    });
  });
  it('never makes unpushed sliding reverse after friction stops it', () => {
    expect(frictionBlock(0, 0.5, true, true)).toMatchObject({
      position: 2.375,
      velocity: 0.5,
      friction: -2,
    });
    for (const time of [1, 1.1, 1.5, 2])
      expect(frictionBlock(0, time, true, true)).toMatchObject({
        position: 2.5,
        velocity: 0,
        friction: 0,
        netForce: 0,
      });
    expect(frictionBlock(0, 2, true, false)).toMatchObject({
      position: 4,
      velocity: 1,
      friction: 0,
    });
    expect(frictionBlock(2, 2, true, true)).toMatchObject({
      position: 4,
      velocity: 1,
      friction: -2,
      netForce: 0,
    });
  });
  it('switches sliding-friction direction after externally driven reversal with continuous position', () => {
    const stop = 1 / 3,
      before = frictionBlock(-4, stop - 1e-8, true, true),
      after = frictionBlock(-4, stop + 1e-8, true, true);
    expect(before.friction).toBe(-2);
    expect(after.friction).toBe(2);
    expect(before.position).toBeCloseTo(after.position, 8);
    expect(frictionBlock(-4, 2, true, true).velocity).toBeLessThan(0);
    expect(frictionBlock(2, 2, false, true).velocity).toBe(0);
  });
  it('gives equal vacuum falls and faster crumpled-paper landing with the stated drag model', () => {
    for (const shape of ['flat', 'crumpled'] as const) {
      const fall = paperDrop(shape, false, 1);
      expect(fall.mass).toBe(0.005);
      expect(fall.gravity).toBe(0.05);
      expect(fall.distance).toBe(5);
      expect(fall.velocity).toBe(10);
      expect(fall.drag).toBe(0);
      expect(fall.landingTime).toBeCloseTo(2);
    }
    const flat = paperDrop('flat', true, 1),
      ball = paperDrop('crumpled', true, 1);
    expect(flat.landingTime).toBeCloseTo(4.5, 2);
    expect(ball.landingTime).toBeCloseTo(2.14, 2);
    expect(flat.distance).toBeLessThan(ball.distance);
    for (const shape of ['flat', 'crumpled'] as const)
      for (let t = 0; t < 5; t += 0.1) {
        const d = paperDrop(shape, true, t);
        expect(d.distance).toBeGreaterThanOrEqual(0);
        expect(d.distance).toBeLessThanOrEqual(20);
        expect(d.drag).toBeLessThanOrEqual(d.gravity);
        expect(d.velocity).toBeGreaterThanOrEqual(0);
      }
    expect(paperDrop('flat', true, 10)).toMatchObject({
      landed: true,
      distance: 20,
      velocity: 0,
      drag: 0,
    });
  });
  it('rejects invalid force-model inputs rather than producing nonfinite diagrams', () => {
    expect(() => forceCart(NaN, 1)).toThrow();
    expect(() => forceCart(0, Infinity)).toThrow();
    expect(() => forceCart(0, 1, 2)).toThrow();
    expect(() => frictionBlock(7, 1, false, true)).toThrow();
    expect(() => paperDrop('flat', true, NaN)).toThrow();
  });
  it('adds distinct bilingual force courses after motion while retaining earlier IDs', () => {
    expect(forceLessons).toHaveLength(4);
    const start = lessons.findIndex((l) => l.id === 'reading-motion-graphs');
    expect(
      lessons
        .slice(start + 1, start + 1 + forceLessons.length)
        .map((l) => l.id),
    ).toEqual(forceLessons.map((l) => l.id));
    expect(new Set(lessons.map((l) => l.id)).size).toBe(lessons.length);
    for (const lesson of forceLessons) {
      expect(lesson.unit).toBe('forces');
      expect(lesson.stage).toBe(1);
      expect(lesson.questions).toHaveLength(3);
      for (const check of [...lesson.questions, lesson.exit]) {
        expect(check.options[check.correct]).toBeDefined();
        expect(check.prompt.zh).toBeTruthy();
        expect(check.prompt.en).toBeTruthy();
        expect(check.explanation.zh).toBeTruthy();
        expect(check.explanation.en).toBeTruthy();
      }
    }
  });
});
