import { describe, it, expect } from 'vitest';
import {
  axisReading,
  walkingReading,
  secant,
  straightGradient,
  velocityArea,
  heatingLine,
  acceleratingReading,
  curveInterval,
  linearFit,
  graphExperiment,
  springReadings,
  graphCase,
  graphKinds,
  graphDefault,
} from './graphModels';
import { graphLessons } from '../content/graphs';
import { lessons } from '../content/lessons';
import { lessonCatalog } from '../content/catalog';
import { experiments } from '../content/experiments';
import { decodeProgress, freshLesson, isMastered } from '../progress';
describe('graphs describe physical quantities', () => {
  it('preserves the physical event while converting both coordinate units', () => {
    for (const t of [0, 0.5, 4, 6]) {
      const a = axisReading(0, t),
        b = axisReading(1, t),
        c = axisReading(2, t);
      expect(b.vertical).toBe(a.vertical * 100);
      expect(c.horizontal * 60).toBeCloseTo(a.horizontal);
      expect(c.position).toBe(a.position);
      expect(a.position - 2).toBe(t);
    }
  });
  it('distinguishes position, signed displacement and accumulated distance on a return', () => {
    expect(walkingReading(3)).toMatchObject({
      position: 5,
      displacement: 4,
      distance: 4,
      velocity: 0,
    });
    expect(walkingReading(5)).toMatchObject({
      position: 3,
      displacement: 2,
      distance: 6,
      velocity: -2,
    });
    expect(walkingReading(6)).toMatchObject({
      position: 1,
      displacement: 0,
      distance: 8,
    });
    for (let t = 0.1; t <= 6; t += 0.1)
      expect(walkingReading(t).distance).toBeGreaterThanOrEqual(
        walkingReading(t - 0.1).distance,
      );
  });
  it('links slopes to signed velocity away from instantaneous turns', () => {
    const h = 1e-5;
    for (const t of [0.5, 1.5, 2.5, 3.5, 4.5, 5.5])
      expect(
        (walkingReading(t + h).position - walkingReading(t).position) / h,
      ).toBeCloseTo(walkingReading(t).velocity, 7);
  });
  it('reads gradients from differences, independently of initial value or interval start', () => {
    for (let i = 0; i < 3; i++)
      for (const t of [0, 0.5, 1, 2]) {
        const m = straightGradient(i, t);
        expect(m.run).toBe(2);
        expect(m.gradient).toBe([1, 2, -1][i]);
        expect(m.rise).toBe(2 * m.velocity);
      }
    expect(secant((t) => 30 + 2 * t, 1, 4).gradient).toBe(2);
  });
  it('subtracts negative velocity area for displacement and adds magnitudes for distance', () => {
    expect(velocityArea(0, 6)).toMatchObject({
      displacement: 12,
      distance: 12,
    });
    expect(velocityArea(1, 6)).toMatchObject({
      positive: 6,
      negative: -6,
      displacement: 0,
      distance: 12,
    });
    for (const t of [0, 1, 3, 4, 6]) {
      const m = velocityArea(1, t);
      expect(m.displacement).toBe(m.positive + m.negative);
      expect(m.distance).toBe(m.positive - m.negative);
    }
  });
  it('integrates a velocity ramp as a triangle instead of a final-speed rectangle', () => {
    for (const t of [0, 0.5, 2, 6]) {
      const m = velocityArea(2, t);
      expect(m.displacement).toBeCloseTo(0.5 * t * m.velocity);
    }
    expect(velocityArea(2, 6).displacement).toBe(12);
    expect(velocityArea(2, 6).velocity * 6).toBe(24);
  });
  it('differentiates the area ledger back to velocity and speed', () => {
    const h = 1e-5;
    for (let i = 0; i < 3; i++)
      for (const t of [0.5, 2.5, 3.5, 5.5]) {
        const a = velocityArea(i, t),
          b = velocityArea(i, t + h);
        expect((b.displacement - a.displacement) / h).toBeCloseTo(
          a.velocity,
          4,
        );
        expect((b.distance - a.distance) / h).toBeCloseTo(
          Math.abs(a.velocity),
          4,
        );
      }
  });
  it('conserves supplied heat and separates initial temperature from heating gradient', () => {
    for (const power of [50, 100, 200])
      for (const t of [0, 0.5, 6]) {
        const a = heatingLine(0, power, t),
          b = heatingLine(1, power, t);
        expect(a.capacity * (a.temperature - a.initial)).toBeCloseTo(a.energy);
        expect(b.temperature - a.temperature).toBe(10);
        expect(b.gradient).toBe(a.gradient);
      }
    expect(heatingLine(2, 200, 6).temperature).toBe(32);
  });
  it('connects accelerated position and velocity by rate of change', () => {
    const h = 1e-5;
    for (const t of [0.5, 2, 5]) {
      const a = acceleratingReading(t),
        b = acceleratingReading(t + h);
      expect((b.position - a.position) / h).toBeCloseTo(a.velocity, 4);
      expect((b.velocity - a.velocity) / h).toBeCloseTo(a.acceleration, 8);
    }
  });
  it('distinguishes curved time slopes from the linearized squared-time slope', () => {
    expect(curveInterval(1).gradient).toBe(1.5);
    expect(curveInterval(4).gradient).toBe(4.5);
    for (const t of [0, 0.5, 1, 4, 5]) {
      expect(curveInterval(t, true).gradient).toBe(0.5);
      expect(curveInterval(t, true).unit).toBe('m/s²');
      expect(curveInterval(t).unit).toBe('m/s');
    }
  });
  it('fits the repeated means with residuals orthogonal to a free intercept and gradient', () => {
    const m = graphExperiment(0);
    expect(m.fit.intercept).toBeCloseTo(2.0333333333, 8);
    expect(m.fit.slope).toBeCloseTo(4.9966666667, 8);
    expect(m.fit.residuals.reduce((s, r) => s + r, 0)).toBeCloseTo(0, 10);
    expect(
      m.fit.residuals.reduce((s, r, i) => s + r * m.rows[i]!.force, 0),
    ).toBeCloseTo(0, 10);
  });
  it('corrects zero bias without modifying raw data or shrinking repeat spread', () => {
    const snapshot = JSON.stringify(springReadings),
      a = graphExperiment(0),
      b = graphExperiment(1);
    expect(b.fit.slope).toBeCloseTo(a.fit.slope);
    expect(a.fit.intercept - b.fit.intercept).toBeCloseTo(2);
    for (let i = 0; i < 5; i++) {
      expect(b.rows[i]!.raw).toEqual(a.rows[i]!.raw);
      expect(b.rows[i]!.max - b.rows[i]!.min).toBeCloseTo(
        a.rows[i]!.max - a.rows[i]!.min,
      );
    }
    expect(JSON.stringify(springReadings)).toBe(snapshot);
    expect(b.rows[2]!.mean).toBeCloseTo(10.0666666667);
  });
  it('shows that coarse resolution can hide scatter while zero bias remains and forcing zero distorts slope', () => {
    const a = graphExperiment(2);
    expect(a.rows.map((r) => r.mean)).toEqual([2, 7, 12, 17, 22]);
    expect(a.fit).toMatchObject({ slope: 5, intercept: 2 });
    const b = graphExperiment(0, 0, true);
    expect(b.fit.intercept).toBe(0);
    expect(b.fit.slope).toBeGreaterThan(graphExperiment(0).fit.slope);
    expect(
      linearFit([
        { x: 0, y: 2 },
        { x: 1, y: 7 },
        { x: 2, y: 12 },
      ]),
    ).toMatchObject({ slope: 5, intercept: 2 });
  });
  it('rejects undefined gradients, nonfinite input and values outside the model', () => {
    for (const fn of [
      () => graphCase(0.5),
      () => graphCase(3),
      () => axisReading(0, NaN),
      () => walkingReading(-1),
      () => secant((t) => t, 2, 2),
      () => secant(() => Infinity, 0, 1),
      () => straightGradient(0, 3),
      () => velocityArea(0, 7),
      () => heatingLine(0, 0, 1),
      () => acceleratingReading(7),
      () => curveInterval(6),
      () =>
        linearFit([
          { x: 1, y: 2 },
          { x: 1, y: 3 },
        ]),
      () => linearFit([{ x: 0, y: 0 }]),
      () => graphExperiment(0, 4),
    ])
      expect(fn).toThrow(RangeError);
    for (const k of graphKinds)
      for (let i = 0; i < 3; i++)
        expect(Number.isFinite(graphDefault(k, i))).toBe(true);
  });
  it('adds seven complete bilingual graph lessons and stations after algebra in plan order', () => {
    expect(lessons.slice(131, 138)).toEqual(graphLessons);
    expect(graphLessons.map((l) => l.kind)).toEqual(
      graphKinds.map((k) => `graphs-${k}`),
    );
    for (const l of graphLessons) {
      expect(l.stage).toBe(4);
      expect(l.unit).toBe('graphs');
      expect(lessonCatalog.find((c) => c.id === l.id)?.pack).toBe('graphs');
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
  it('retains algebra completion and requires graph observation and transfer answers', () => {
    const l = lessons[130]!,
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
    const a = graphLessons[0]!,
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
