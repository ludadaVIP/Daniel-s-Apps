import { describe, it, expect } from 'vitest';
import {
  forceWork,
  workScenarios,
  pushLedger,
  averagePower,
  liftingTask,
  liftingSnapshot,
  rampTask,
} from './workModels';
import { workLessons } from '../content/work';
import { lessons, units } from '../content/lessons';
import { experiments } from '../content/experiments';

describe('work, task power and force–distance trade-offs', () => {
  it('distinguishes the named force, displacement and sign in five ground-frame cases', () => {
    expect(
      workScenarios.map((s) =>
        forceWork(s.force[0], s.force[1], s.displacement[0], s.displacement[1]),
      ),
    ).toEqual([12, 0, 0, 20, -20]);
    expect(forceWork(0, -20, 0, -1)).toBe(20); // Gravity during lowering.
    expect(forceWork(0, 20, 0, -1) + forceWork(0, -20, 0, -1)).toBe(0);
  });
  it('depends on force components along displacement, not path length or tiredness', () => {
    expect(forceWork(3, 4, 2, 0)).toBe(6);
    expect(forceWork(3, 4, 0, 2)).toBe(8);
    expect(forceWork(3, 4, 2, 2)).toBe(14);
    expect(forceWork(3, 4, 0, 0)).toBe(0);
    expect(forceWork(-3, -4, 2, 2)).toBe(-14);
  });
  it('retains positive input and negative friction with zero net work during steady motion', () => {
    for (const [f, d, w] of [
      [4, 2, 8],
      [8, 2, 16],
      [4, 3, 12],
    ]) {
      const s = pushLedger(f!, d!);
      expect(s.applied).toBe(w);
      expect(s.applied + s.friction).toBe(s.net);
      expect(s.net).toBe(s.kineticChange);
      expect(s.thermal).toBe(s.applied);
    }
    expect(pushLedger(4, 0).applied).toBe(0);
  });
  it('separates work, power and interval, allowing zero and signed work', () => {
    expect(averagePower(20, 8)).toBe(2.5);
    expect(averagePower(20, 4)).toBe(5);
    expect(averagePower(40, 4)).toBe(10);
    expect(averagePower(0, 4)).toBe(0);
    expect(averagePower(-20, 4)).toBe(-5);
  });
  it('uses the shared clock without giving the faster hoist the slower task duration', () => {
    const slow = liftingSnapshot(2, 1, 8, 4),
      fast = liftingSnapshot(2, 1, 4, 4),
      waiting = liftingSnapshot(2, 1, 4, 8);
    expect(slow).toMatchObject({
      raised: 0.5,
      doneWork: 10,
      finished: false,
      power: 2.5,
    });
    expect(fast).toMatchObject({
      raised: 1,
      doneWork: 20,
      finished: true,
      power: 5,
    });
    expect(waiting).toEqual(fast);
    expect(liftingSnapshot(4, 1, 4, 4)).toMatchObject({
      raised: 1,
      doneWork: 40,
      power: 10,
    });
  });
  it('keeps cumulative work, lift position and interval rates consistent throughout playback', () => {
    for (const m of [2, 4])
      for (const t of [4, 8])
        for (let n = 0; n <= 16; n++) {
          const s = liftingSnapshot(m, 1, t, n / 2);
          expect(s.doneWork).toBeCloseTo(m * 10 * s.raised);
          expect(s.doneWork).toBeCloseTo(s.power * s.time);
          expect(s.raised).toBeLessThanOrEqual(1);
          expect(s.time).toBeLessThanOrEqual(t);
        }
  });
  it('uses vertical rise and total mass for the stair estimate, with time affecting power alone', () => {
    const baseline = liftingTask(50, 3, 10),
      slower = liftingTask(50, 3, 20);
    expect(baseline).toMatchObject({ work: 1500, power: 150 });
    expect(slower).toMatchObject({ work: 1500, power: 75 });
    expect(liftingTask(60, 3, 10)).toMatchObject({ work: 1800, power: 180 });
    expect(liftingTask(50, 2, 10)).toMatchObject({ work: 1000, power: 100 });
    expect(liftingTask(50, 0, 10)).toMatchObject({ work: 0, power: 0 });
    expect(liftingTask(50, 3, 10, 1.6).power).toBe(24);
  });
  it('trades ideal ramp force for distance while preserving work at a fixed rise', () => {
    for (const [length, force] of [
      [1, 20],
      [2, 10],
      [4, 5],
    ]) {
      const s = rampTask(2, 1, length!);
      expect(s.force).toBe(force);
      expect(s.input).toBe(20);
      expect(s.useful).toBe(20);
      expect(s.thermal).toBe(0);
      expect(s.efficiency).toBe(1);
      expect(Math.hypot(s.horizontal, 1)).toBeCloseTo(length!);
    }
  });
  it('includes prescribed frictional work in the full ramp ledger and task efficiency', () => {
    const s = rampTask(2, 1, 4, 2);
    expect(s).toMatchObject({ force: 7, input: 28, useful: 20, thermal: 8 });
    expect(s.input).toBe(s.useful + s.thermal);
    expect(s.efficiency).toBeCloseTo(5 / 7);
    for (const l of [1, 2, 4, 8])
      for (const f of [0, 1, 2, 10]) {
        const v = rampTask(2, 1, l, f);
        expect(v.input).toBeCloseTo(v.useful + v.thermal);
        expect(v.efficiency).toBeGreaterThan(0);
        expect(v.efficiency).toBeLessThanOrEqual(1);
      }
  });
  it('rejects invalid domains and overflow rather than displaying plausible estimates', () => {
    for (const n of [NaN, Infinity, -Infinity]) {
      expect(() => forceWork(n, 0, 1, 0)).toThrow();
      expect(() => averagePower(20, n)).toThrow();
      expect(() => rampTask(2, 1, n)).toThrow();
    }
    for (const n of [0, -1]) {
      expect(() => averagePower(20, n)).toThrow();
      expect(() => liftingTask(n, 3, 10)).toThrow();
      expect(() => liftingTask(50, 3, n)).toThrow();
      expect(() => rampTask(2, n, 4)).toThrow();
    }
    expect(() => liftingSnapshot(2, 1, 4, -1)).toThrow();
    expect(() => liftingTask(50, -3, 10)).toThrow();
    expect(() => pushLedger(-4, 2)).toThrow();
    expect(() => pushLedger(4, -2)).toThrow();
    expect(() => rampTask(2, 3, 2)).toThrow();
    expect(() => rampTask(2, 1, 4, -2)).toThrow();
    expect(() => rampTask(2, 1, 4, 0, 0)).toThrow();
    expect(() => forceWork(1e308, 0, 1e308, 0)).toThrow();
    expect(() => averagePower(1e308, 1e-308)).toThrow();
    expect(() => liftingTask(1e308, 1e308, 1)).toThrow();
    expect(() => rampTask(2, 1, 1e308, 1e308)).toThrow();
  });
  it('adds five complete bilingual courses and stations after energy without replacing older lessons', () => {
    const start =
      lessons.findIndex((l) => l.id === 'energy-dissipation-efficiency') + 1;
    expect(lessons.slice(start, start + 5)).toEqual(workLessons);
    expect(lessons.slice(0, start)).toHaveLength(45);
    expect(units.work.zh).toBeTruthy();
    expect(new Set(workLessons.map((l) => l.kind)).size).toBe(5);
    for (const lesson of workLessons) {
      expect(lesson.stage).toBe(2);
      expect(lesson.unit).toBe('work');
      expect(lesson.minutes).toBeGreaterThanOrEqual(12);
      expect(lesson.minutes).toBeLessThanOrEqual(20);
      expect(lesson.questions).toHaveLength(3);
      expect(experiments.some((e) => e.id === lesson.kind)).toBe(true);
      for (const value of [
        lesson.title,
        lesson.subtitle,
        lesson.hook,
        lesson.prediction,
        lesson.explore,
        lesson.concept,
        lesson.formula!,
        lesson.example,
        lesson.misconception,
        lesson.realWorld,
        lesson.summary,
        lesson.homeExperiment,
        ...lesson.predictions,
        ...lesson.vocabulary,
      ]) {
        expect(value.zh.trim()).toBeTruthy();
        expect(value.en.trim()).toBeTruthy();
      }
      for (const question of [...lesson.questions, lesson.exit]) {
        expect(question.options[question.correct]).toBeDefined();
        for (const value of [
          question.prompt,
          question.explanation,
          ...question.options,
        ]) {
          expect(value.zh.trim()).toBeTruthy();
          expect(value.en.trim()).toBeTruthy();
        }
      }
    }
  });
});
