import { describe, it, expect } from 'vitest';
import {
  robotTrip,
  lampEnergy,
  tripTime,
  mapScale,
  linearSpring,
  contactPressure,
  cartEnergy,
  scientific,
  notationReading,
  algebraCase,
  algebraDefault,
  algebraReading,
  algebraKinds,
} from './algebraModels';
import { algebraLessons } from '../content/algebra';
import { lessons } from '../content/lessons';
import { lessonCatalog } from '../content/catalog';
import { experiments } from '../content/experiments';
import { decodeProgress, freshLesson, isMastered } from '../progress';
describe('algebra as physical reasoning', () => {
  it('links one robot ruler to elapsed time and physical speed, including zero', () => {
    expect(robotTrip(1, 4).distance).toBe(4);
    expect(robotTrip(2, 4).distance).toBe(8);
    expect(robotTrip(1, 8).distance).toBe(8);
    const a = robotTrip(2.5, 8, 0.4);
    expect(a.position).toBeCloseTo(8);
    expect(a.elapsed).toBeCloseTo(3.2);
    const h = 1e-4;
    expect(
      (robotTrip(2.5, 8, 0.4 + h).position - a.position) / (8 * h),
    ).toBeCloseTo(a.speed, 8);
    expect(robotTrip(0, 8).position).toBe(0);
  });
  it('treats equivalent raw time units as the same energy, not equal bare numbers', () => {
    expect(lampEnergy(2, 30, 's').joules).toBe(60);
    expect(lampEnergy(2, 0.5, 'min').joules).toBe(60);
    expect(lampEnergy(5, 30, 's').joules).toBe(150);
    expect(lampEnergy(2, 30, 'min').joules).toBe(3600);
    expect(lampEnergy(0, 60, 'min').joules).toBe(0);
  });
  it('inverts steady travel by a nonzero divisor and checks the original equation', () => {
    for (const d of [0, 120, 240])
      for (const v of [0.5, 2, 4, 6]) {
        const t = tripTime(d, v).seconds!;
        expect(v * t).toBeCloseTo(d);
      }
    expect(tripTime(120, 2).seconds).toBe(60);
    expect(tripTime(120, 4).seconds).toBe(30);
    expect(tripTime(240, 4).seconds).toBe(60);
    expect(tripTime(120, 0).seconds).toBeNull();
    expect(tripTime(0, 0).seconds).toBeNull();
  });
  it('forms a dimensionless scale using common units and distinguishes rate from ratio', () => {
    expect(mapScale(3, 100)).toMatchObject({
      denominator: 10000,
      realMetres: 300,
    });
    expect(mapScale(6, 100).realMetres).toBe(600);
    expect(mapScale(3, 200)).toMatchObject({
      denominator: 20000,
      realMetres: 600,
    });
    for (const cm of [0.5, 1, 4, 8])
      for (const rate of [50, 100, 200])
        expect((mapScale(cm, rate).realMetres * 100) / cm).toBe(
          mapScale(cm, rate).denominator,
        );
  });
  it('distinguishes proportional extension from affine total length including the zero-force intercept', () => {
    expect(linearSpring(0)).toMatchObject({ extension: 0, length: 0.2 });
    for (const force of [0.5, 1, 2, 4, 6]) {
      const m = linearSpring(force);
      expect(m.extension / force).toBeCloseTo(0.05);
      expect(m.length - m.restMetres).toBeCloseTo(m.extension);
      expect(m.stiffness * m.extension).toBeCloseTo(force);
    }
    expect(linearSpring(4).extension / linearSpring(2).extension).toBe(2);
    expect(linearSpring(4).length / linearSpring(2).length).not.toBe(2);
  });
  it('preserves the inverse pressure product while doubling area halves pressure', () => {
    for (const a of [0.01, 0.02, 0.04, 0.08]) {
      const m = contactPressure(a);
      expect(m.pascals * a).toBeCloseTo(600);
      expect(m.kilopascals * 1000).toBeCloseTo(m.pascals);
    }
    expect(contactPressure(0.02).kilopascals).toBe(30);
    expect(contactPressure(0.04).kilopascals).toBe(15);
    expect(contactPressure(0.08).kilopascals).toBe(7.5);
  });
  it('squares speed factors but also keeps the independent mass factor', () => {
    expect([1, 2, 3].map((v) => cartEnergy(v).joules)).toEqual([1, 4, 9]);
    expect(cartEnergy(0).joules).toBe(0);
    expect(cartEnergy(1).joules / cartEnergy(2).joules).toBe(0.25);
    expect(cartEnergy(2, 4).joules / cartEnergy(1, 2).joules).toBe(8);
    for (const v of [0.25, 0.5, 1, 1.5, 2.5])
      expect(cartEnergy(v).joules / (v * v)).toBe(1);
  });
  it('normalizes decimal coefficients without losing powers near floating-point boundaries', () => {
    for (const value of [
      0.000004,
      0.003,
      0.1,
      1,
      10,
      100,
      4000,
      4000000,
      -0.003,
      40 * 10 ** 2,
    ]) {
      const m = scientific(value);
      expect(Math.abs(m.coefficient)).toBeGreaterThanOrEqual(1);
      expect(Math.abs(m.coefficient)).toBeLessThan(10);
      expect(Number.isInteger(m.exponent)).toBe(true);
      expect((m.coefficient * 10 ** m.exponent) / value).toBeCloseTo(1, 10);
    }
    expect(scientific(4000)).toEqual({ coefficient: 4, exponent: 3 });
    expect(scientific(0)).toEqual({ coefficient: 0, exponent: 0 });
  });
  it('changes notation and numeric value under metre/millimetre conversion while preserving length', () => {
    for (let e = -6; e <= 6; e++) {
      const m = notationReading(e, 'm'),
        mm = notationReading(e, 'mm');
      expect(mm.metres).toBe(m.metres);
      expect(mm.displayed / m.displayed).toBeCloseTo(1000);
      expect(mm.exponent).toBe(m.exponent + 3);
      expect(mm.coefficient).toBe(m.coefficient);
    }
    expect(notationReading(-6, 'mm')).toMatchObject({
      coefficient: 4,
      exponent: -3,
      displayed: 0.004,
    });
  });
  it('rejects invalid cases, nonfinite quantities, unsupported units and illegal model ranges', () => {
    for (const fn of [
      () => algebraCase(0.5),
      () => algebraCase(3),
      () => robotTrip(NaN, 4),
      () => robotTrip(1, 9),
      () => robotTrip(1, 4, 1.1),
      () => lampEnergy(6, 30, 's'),
      () => lampEnergy(2, Infinity, 'min'),
      () => lampEnergy(2, 30, 'h' as 's'),
      () => tripTime(120, -1),
      () => mapScale(-1, 100),
      () => linearSpring(7),
      () => contactPressure(0),
      () => cartEnergy(4),
      () => scientific(Infinity),
      () => notationReading(0.5),
      () => notationReading(7),
      () => notationReading(1, 'cm' as 'm'),
    ])
      expect(fn).toThrow(RangeError);
  });
  it('keeps every prescribed comparison within the model domain', () => {
    for (const kind of algebraKinds)
      for (let i = 0; i < 3; i++)
        expect(() =>
          algebraReading(kind, i, algebraDefault(kind, i), 1),
        ).not.toThrow();
  });
  it('adds all eight Stage 4 algebra topics in order with complete bilingual transfer tasks', () => {
    expect(lessons.slice(123, 131)).toEqual(algebraLessons);
    expect(algebraLessons.map((l) => l.kind)).toEqual(
      algebraKinds.map((k) => `algebra-${k}`),
    );
    for (const l of algebraLessons) {
      expect(l.stage).toBe(4);
      expect(l.unit).toBe('algebra');
      expect(lessonCatalog.find((c) => c.id === l.id)?.pack).toBe('algebra');
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
  it('retains earlier space completion while requiring new algebra observations and transfer answers', () => {
    const l = lessons[122]!,
      answers = Object.fromEntries(
        [...l.questions, l.exit].map((q, i) => [i, q.correct]),
      );
    const saved = {
      ...freshLesson(),
      prediction: 0,
      explored: true,
      answers,
      completedAt: 123456,
    };
    expect(
      decodeProgress(JSON.stringify({ lessons: { [l.id]: saved } })).lessons[
        l.id
      ]?.completedAt,
    ).toBe(123456);
    const a = algebraLessons[0]!,
      correct = {
        ...freshLesson(),
        prediction: 2,
        explored: true,
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
