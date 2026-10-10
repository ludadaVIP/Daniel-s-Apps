import { describe, it, expect } from 'vitest';
import {
  vectorKinds,
  vectorCase,
  vectorDefault,
  magnitude,
  vectorHeading,
  polar,
  sumVectors,
  inBasis,
  routeReading,
  directionReading,
  arrowReading,
  boatReading,
  ropeReading,
  componentAngle,
} from './vectorModels';
import { vectorLessons } from '../content/vectors';
import { lessons } from '../content/lessons';
import { lessonCatalog } from '../content/catalog';
import { experiments } from '../content/experiments';
import { decodeProgress, freshLesson, isMastered } from '../progress';
describe('vectors retain physical directions', () => {
  it('separates path distance and endpoint displacement including an out-and-back zero vector', () => {
    expect(routeReading(0)).toMatchObject({
      totalDistance: 7,
      position: { x: 4, y: 3 },
      displacement: 5,
      elapsed: 7,
    });
    expect(routeReading(1)).toMatchObject({
      totalDistance: 8,
      position: { x: 0, y: 0 },
      displacement: 0,
      direction: null,
    });
    expect(routeReading(2)).toMatchObject({
      totalDistance: 5,
      position: { x: 4, y: 3 },
      displacement: 5,
    });
  });
  it('links route position to elapsed time at 1 m/s away from ideal turns', () => {
    const h = 1e-5;
    for (let i = 0; i < 3; i++)
      for (const p of [0.1, 0.3, 0.8]) {
        const a = routeReading(i, 1, p),
          b = routeReading(i, 1, p + h);
        expect(
          Math.hypot(b.position.x - a.position.x, b.position.y - a.position.y) /
            (b.elapsed - a.elapsed),
        ).toBeCloseTo(1, 8);
        expect(a.distance).toBe(a.elapsed);
        expect(a.displacement).toBeLessThanOrEqual(a.distance + 1e-9);
      }
  });
  it('scales routes consistently and handles a zero route without division by zero', () => {
    for (const s of [0, 0.25, 0.5, 1, 1.5])
      for (let i = 0; i < 3; i++) {
        const a = routeReading(i),
          b = routeReading(i, s);
        expect(b.distance).toBeCloseTo(a.distance * s);
        expect(b.displacement).toBeCloseTo(a.displacement * s);
      }
    expect(routeReading(0, 0)).toMatchObject({
      speed: 0,
      elapsed: 0,
      direction: null,
    });
  });
  it('converts polar magnitude and direction without inventing a zero direction', () => {
    expect(polar(3, 0)).toEqual({ x: 3, y: 0 });
    expect(polar(3, 90)).toEqual({ x: 0, y: 3 });
    expect(polar(3, 180)).toEqual({ x: -3, y: 0 });
    for (const a of [-180, -90, 0, 30, 90, 180, 270, 360])
      expect(magnitude(polar(7, a))).toBeCloseTo(7, 10);
    expect(vectorHeading({ x: 0, y: 0 })).toBeNull();
    expect(vectorHeading({ x: 0, y: -1 })).toBe(270);
  });
  it('changes coordinate components while preserving actual heading, speed and norm', () => {
    expect(directionReading(0, 90)).toMatchObject({
      heading: 0,
      components: { x: 0, y: -3 },
      speed: 3,
    });
    for (let i = 0; i < 3; i++)
      for (const a of [-90, -45, 0, 30, 90]) {
        const m = directionReading(i, a);
        expect(magnitude(m.components)).toBeCloseTo(m.speed, 10);
        expect(m.velocity).toEqual(directionReading(i).velocity);
        const restored = inBasis(m.components, -a);
        expect(restored.x).toBeCloseTo(m.velocity.x, 10);
        expect(restored.y).toBeCloseTo(m.velocity.y, 10);
      }
  });
  it('keeps arrow drawing scale and location separate from physical wind velocity', () => {
    expect(arrowReading(0)).toMatchObject({ speed: 3, pixels: 45 });
    expect(arrowReading(1)).toMatchObject({ speed: 6, pixels: 90 });
    for (const scale of [5, 15, 30]) {
      const a = arrowReading(1, scale),
        b = arrowReading(2, scale);
      expect(b.velocity).toEqual(a.velocity);
      expect(b.tail).not.toEqual(a.tail);
      expect(b.pixels).toBe(a.pixels);
      expect(a.head.x - a.tail.x).toBe(a.speed * scale);
    }
    expect(arrowReading(0, 30).pixels).toBe(arrowReading(1, 15).pixels);
  });
  it('adds compatible velocity components and distinguishes zero ground velocity from through-water motion', () => {
    expect(boatReading(0)).toMatchObject({
      ground: { x: 3, y: 4 },
      speed: 5,
      position: { x: 12, y: 16 },
    });
    expect(boatReading(1)).toMatchObject({
      ground: { x: -1, y: 0 },
      speed: 1,
      heading: 180,
      position: { x: -4, y: 0 },
    });
    expect(boatReading(2)).toMatchObject({
      ground: { x: 0, y: 0 },
      speed: 0,
      heading: null,
      boat: { x: 3, y: 0 },
      position: { x: 0, y: 0 },
    });
  });
  it('uses the same ground velocity for the entire simultaneous trajectory', () => {
    const h = 1e-5;
    for (let i = 0; i < 3; i++)
      for (const a of [0, 45, 90, 180, 270, 360])
        for (const t of [0, 0.5, 2]) {
          const m = boatReading(i, a, t),
            n = boatReading(i, a, t + h);
          expect((n.position.x - m.position.x) / h).toBeCloseTo(m.ground.x, 8);
          expect((n.position.y - m.position.y) / h).toBeCloseTo(m.ground.y, 8);
          const composed = sumVectors(m.waterPosition, m.currentShift);
          expect(composed.x).toBeCloseTo(m.position.x, 10);
          expect(composed.y).toBeCloseTo(m.position.y, 10);
        }
  });
  it('adds commutatively without mutating input representations and obeys the magnitude bounds', () => {
    const a = { x: 3, y: 0 },
      b = { x: 0, y: 4 },
      c = { x: -2, y: 1 };
    expect(sumVectors(a, b)).toEqual(sumVectors(b, a));
    expect(sumVectors(sumVectors(a, b), c)).toEqual(
      sumVectors(a, sumVectors(b, c)),
    );
    expect(a).toEqual({ x: 3, y: 0 });
    for (const angle of [0, 30, 90, 180, 270]) {
      const v = polar(4, angle),
        r = magnitude(sumVectors(a, v));
      expect(r).toBeLessThanOrEqual(7 + 1e-9);
      expect(r).toBeGreaterThanOrEqual(1 - 1e-9);
    }
  });
  it('resolves one 10 N rope using the specified horizontal angle and reconstructs its magnitude', () => {
    expect(ropeReading(0)).toMatchObject({
      force: { x: 10, y: 0 },
      normal: 20,
    });
    expect(ropeReading(90)).toMatchObject({
      force: { x: 0, y: 10 },
      normal: 10,
    });
    const m = ropeReading(componentAngle);
    expect(m.force.x).toBeCloseTo(8, 10);
    expect(m.force.y).toBeCloseTo(6, 10);
    expect(m.cosine).toBeCloseTo(0.8);
    expect(m.sine).toBeCloseTo(0.6);
    for (const a of [0, 10, 30, 45, 60, 90]) {
      const r = ropeReading(a);
      expect(r.magnitude).toBeCloseTo(10, 10);
      expect(r.cosine ** 2 + r.sine ** 2).toBeCloseTo(1, 10);
    }
  });
  it('retains upward rope force in the vertical balance while normal force adjusts and contact persists', () => {
    for (let a = 0; a <= 90; a += 5) {
      const m = ropeReading(a);
      expect(m.normal).toBeGreaterThan(0);
      expect(m.force.y + m.normal - m.weight).toBeCloseTo(0, 10);
      expect(m.verticalNet).toBe(0);
      expect(m.horizontalNet).toBe(m.force.x);
    }
  });
  it('rejects invalid cases, nonfinite vectors and model inputs outside supported bounds', () => {
    for (const fn of [
      () => vectorCase(0.5),
      () => vectorCase(3),
      () => magnitude({ x: NaN, y: 0 }),
      () => vectorHeading({ x: 0, y: Infinity }),
      () => polar(-1, 0),
      () => polar(1, NaN),
      () => sumVectors({ x: 0, y: 0 }, { x: 0, y: Infinity }),
      () => inBasis({ x: 0, y: 0 }, 361),
      () => routeReading(0, 2),
      () => routeReading(0, 1, 1.1),
      () => directionReading(0, 100),
      () => arrowReading(0, 0),
      () => boatReading(0, 90, 5),
      () => ropeReading(-1),
    ])
      expect(fn).toThrow(RangeError);
  });
  it('keeps each prescribed comparison inside its model domain', () => {
    for (let i = 0; i < 3; i++) {
      expect(() =>
        routeReading(i, vectorDefault('quantities', i)),
      ).not.toThrow();
      expect(() =>
        directionReading(i, vectorDefault('direction', i)),
      ).not.toThrow();
      expect(() => arrowReading(i, vectorDefault('arrows', i))).not.toThrow();
      expect(() => boatReading(i, vectorDefault('addition', i))).not.toThrow();
      expect(() => ropeReading(vectorDefault('components', i))).not.toThrow();
    }
  });
  it('registers all seven plan topics through five complete bilingual courses in sequence', () => {
    expect(lessons.slice(138, 143)).toEqual(vectorLessons);
    expect(vectorLessons.map((l) => l.kind)).toEqual(
      vectorKinds.map((k) => `vectors-${k}`),
    );
    for (const l of vectorLessons) {
      expect(l.stage).toBe(4);
      expect(l.unit).toBe('vectors');
      expect(lessonCatalog.find((c) => c.id === l.id)?.pack).toBe('vectors');
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
        expect(l[key].zh.length).toBeGreaterThan(10);
        expect(l[key].en.length).toBeGreaterThan(20);
      }
      expect(l.vocabulary).toHaveLength(4);
      expect(l.predictions).toHaveLength(3);
      expect(l.questions).toHaveLength(3);
      for (const q of [...l.questions, l.exit]) {
        expect(q.options[q.correct]).toBeDefined();
        expect(q.explanation.zh.length).toBeGreaterThan(5);
        expect(q.explanation.en.length).toBeGreaterThan(10);
      }
    }
  });
  it('preserves graph completion and requires observations and transfer mastery for vectors', () => {
    const l = lessons[137]!,
      saved = {
        ...freshLesson(),
        prediction: 0,
        explored: true,
        answers: Object.fromEntries(
          [...l.questions, l.exit].map((q, i) => [i, q.correct]),
        ),
        completedAt: 123456,
      };
    expect(
      decodeProgress(JSON.stringify({ lessons: { [l.id]: saved } })).lessons[
        l.id
      ]?.completedAt,
    ).toBe(123456);
    const a = vectorLessons[0]!,
      correct = {
        ...saved,
        answers: Object.fromEntries(
          [...a.questions, a.exit].map((q, i) => [i, q.correct]),
        ),
      };
    expect(isMastered(a.id, correct)).toBe(true);
    expect(isMastered(a.id, { ...correct, explored: false })).toBe(false);
    expect(
      isMastered(a.id, { ...correct, answers: { ...correct.answers, 3: 1 } }),
    ).toBe(false);
  });
});
