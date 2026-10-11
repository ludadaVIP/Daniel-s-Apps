import { describe, it, expect } from 'vitest';
import {
  trajectoryKinds,
  trajectoryDefault,
  trajectoryLimits,
  trajectoryReading,
  trajectoryMotion,
  trajectoryRecord,
  stagedMotion,
  uniformMotion,
  fallFlight,
  equationCase,
  checkEquation,
} from './trajectoryModels';
import { trajectoryLessons } from '../content/trajectories';
import { lessons } from '../content/lessons';
import { lessonCatalog } from '../content/catalog';
import { experiments } from '../content/experiments';
import { decodeProgress, freshLesson, isMastered } from '../progress';
import { kinematicsLessons } from '../content/kinematics';
const integrate = (f: (t: number) => number, start: number, end: number) => {
  const n = 20000,
    dt = (end - start) / n;
  let sum = 0;
  for (let j = 0; j < n; j++) sum += f(start + (j + 0.5) * dt) * dt;
  return sum;
};
describe('motion graphs, constant acceleration and two-direction flight', () => {
  it('distinguishes interval secants from instantaneous tangents', () => {
    const rows = [0, 1, 2].map((i) =>
      trajectoryReading('position', i, trajectoryDefault('position', i)),
    );
    expect(rows.map((m) => m.mean)).toEqual([2, 0, -2]);
    expect(rows.map((m) => m.velocity)).toEqual([0, -2, -4]);
    expect(rows.map((m) => m.position)).toEqual([11, 9, 3]);
    expect(trajectoryReading('position', 0, 4, 0).mean).toBeNull();
  });
  it('matches signed velocity area to displacement and absolute area to distance independently', () => {
    for (let i = 0; i < 3; i++) {
      const m = trajectoryReading(
        'velocity',
        i,
        trajectoryDefault('velocity', i),
      );
      expect(integrate((t) => 4 - t, m.config.start, m.config.end)).toBeCloseTo(
        m.displacement,
        7,
      );
      expect(
        integrate((t) => Math.abs(4 - t), m.config.start, m.config.end),
      ).toBeCloseTo(m.distance, 7);
    }
    const whole = trajectoryReading('velocity', 2, 8);
    expect(whole.displacement).toBe(0);
    expect(whole.distance).toBe(16);
  });
  it('integrates piecewise acceleration into velocity change rather than displacement', () => {
    for (let i = 0; i < 3; i++) {
      const m = trajectoryReading(
        'acceleration',
        i,
        trajectoryDefault('acceleration', i),
      );
      expect(
        integrate(
          (t) => stagedMotion(t).acceleration,
          m.config.start,
          m.config.end,
        ),
      ).toBeCloseTo(m.deltaV, 7);
      expect(
        integrate(
          (t) => stagedMotion(t).velocity,
          m.config.start,
          m.config.end,
        ),
      ).toBeCloseTo(m.displacement, 7);
    }
    expect(stagedMotion(6)).toEqual({
      position: 14,
      velocity: 1,
      acceleration: -1,
    });
  });
  it('preserves position and velocity through ideal acceleration switches', () => {
    for (const t of [2, 4]) {
      const before = stagedMotion(t - 1e-7),
        after = stagedMotion(t + 1e-7),
        at = stagedMotion(t);
      expect(before.position).toBeCloseTo(after.position, 5);
      expect(before.velocity).toBeCloseTo(after.velocity, 5);
      expect(before.acceleration).not.toBe(after.acceleration);
      expect(at.acceleration).toBe(after.acceleration);
    }
  });
  it('has constant gains only when acceleration is constant', () => {
    for (const i of [0, 1, 2]) {
      const gains = [0, 1, 2, 3].map(
        (t) => uniformMotion(i, t + 1).velocity - uniformMotion(i, t).velocity,
      );
      expect(gains).toEqual(
        i === 0
          ? [1, 1, 1, 1]
          : i === 1
            ? [0, 0, 0, 0]
            : [0.25, 0.75, 1.25, 1.75],
      );
    }
  });
  it('shows matching endpoint velocities do not fix displacement', () => {
    const constant = uniformMotion(0, 4),
      varying = uniformMotion(2, 4);
    expect(constant.velocity).toBe(varying.velocity);
    expect(constant.position).toBe(12);
    expect(varying.position).toBeCloseTo(28 / 3);
    expect(integrate((t) => uniformMotion(2, t).velocity, 0, 4)).toBeCloseTo(
      varying.position,
      7,
    );
  });
  it('links x derivatives to v and v derivatives to a including the varying case', () => {
    const h = 1e-5;
    for (const k of [
      'position',
      'velocity',
      'acceleration',
      'uniform',
      'equations',
    ] as const)
      for (let i = 0; i < 3; i++)
        for (const t of [0.5, 1.5, 2.5, 3.5]) {
          const m = trajectoryMotion(k, i, t),
            before = trajectoryMotion(k, i, t - h),
            after = trajectoryMotion(k, i, t + h);
          expect((after.position - before.position) / (2 * h)).toBeCloseTo(
            m.velocity,
            7,
          );
          expect((after.velocity - before.velocity) / (2 * h)).toBeCloseTo(
            m.acceleration,
            7,
          );
        }
  });
  it('checks direct equations, signed calculations and numeric entries without coercing blanks', () => {
    for (let i = 0; i < 3; i++) {
      const c = equationCase(i);
      expect(checkEquation(i, c.equation, String(c.answer))).toBe(true);
      for (const text of ['', ' ', 'NaN', 'Infinity', '16 m', '-16', '0'])
        expect(checkEquation(i, c.equation, text)).toBe(false);
      expect(checkEquation(i, (c.equation + 1) % 3, String(c.answer))).toBe(
        false,
      );
      expect(c.v).toBe(c.u + c.a * c.t);
      expect(c.s).toBe(c.u * c.t + 0.5 * c.a * c.t * c.t);
      expect(c.s).toBe(c.v * c.t - 0.5 * c.a * c.t * c.t);
      expect(c.s).toBe(((c.u + c.v) * c.t) / 2);
      expect(c.v * c.v).toBe(c.u * c.u + 2 * c.a * c.s);
    }
  });
  it('keeps worksheet playback on the prescribed four-second conditions', () => {
    expect(() => trajectoryReading('equations', 0, 3)).toThrow(RangeError);
    expect(trajectoryReading('equations', 1, 4)).toMatchObject({
      velocity: 2,
      displacement: 16,
    });
  });
  it('drops 5 then 15 metres over equal seconds, rather than equal distances', () => {
    const at1 = fallFlight(20, 10, 0, 1),
      at2 = fallFlight(20, 10, 0, 2);
    expect(at1.y).toBe(5);
    expect(at2.y - at1.y).toBe(15);
    expect(at2.vy).toBe(20);
  });
  it('matches mass cases and changes time with gravity, not mass', () => {
    const light = trajectoryReading('fall', 0, 20),
      heavy = trajectoryReading('fall', 1, 20),
      moon = trajectoryReading('fall', 2, 20);
    expect(light.config.mass).not.toBe(heavy.config.mass);
    expect(light.time).toBe(heavy.time);
    expect(light.vy).toBe(heavy.vy);
    expect([light.time, moon.time]).toEqual([2, 5]);
    expect(moon.vy).toBe(8);
  });
  it('scales contact time with square root of height and stops before collision', () => {
    expect(
      fallFlight(20, 10, 0, 2).duration / fallFlight(5, 10, 0, 1).duration,
    ).toBe(2);
    expect(() => fallFlight(20, 10, 0, 2.001)).toThrow(RangeError);
    expect(fallFlight(20, 10, 0, 2)).toMatchObject({ y: 20, vy: 20, g: 10 });
  });
  it('uses one clock for independent horizontal and vertical motion', () => {
    for (const t of [0, 0.5, 1, 1.5, 2])
      for (const vx of [0, 4, 8, 10]) {
        const m = fallFlight(20, 10, vx, t),
          dropped = fallFlight(20, 10, 0, t);
        expect(m.y).toBe(dropped.y);
        expect(m.vy).toBe(dropped.vy);
        expect(m.x).toBe(vx * t);
        expect(m.vx).toBe(vx);
      }
    expect(
      [0, 1, 2].map(
        (i) =>
          trajectoryReading('projectile', i, trajectoryDefault('projectile', i))
            .x,
      ),
    ).toEqual([0, 8, 16]);
  });
  it('keeps all prescribed and free values within fixed physical chart windows', () => {
    for (const k of trajectoryKinds)
      for (let i = 0; i < 3; i++) {
        const limits = trajectoryLimits(k, i);
        for (const value of [limits.min, trajectoryDefault(k, i), limits.max])
          for (let j = 0; j <= 20; j++) {
            const m = trajectoryReading(k, i, value, j / 20);
            expect(Number.isFinite(m.position)).toBe(true);
            expect(m.position).toBeGreaterThanOrEqual(0);
            expect(m.position).toBeLessThanOrEqual(20 + 1e-9);
            expect(m.time).toBeGreaterThanOrEqual(m.config.start);
            expect(m.time).toBeLessThanOrEqual(m.config.end + 1e-9);
            expect(m.distance).toBeGreaterThanOrEqual(
              Math.abs(m.displacement) - 1e-9,
            );
            if (k === 'projectile') expect(m.x).toBeLessThanOrEqual(20);
          }
      }
  });
  it('rejects invalid time, gravity, height, speed, progress and comparison values', () => {
    for (const fn of [
      () => stagedMotion(NaN),
      () => stagedMotion(7),
      () => uniformMotion(3, 1),
      () => uniformMotion(1, 5),
      () => fallFlight(0, 10, 0, 1),
      () => fallFlight(20, 0, 0, 1),
      () => fallFlight(20, 10, 11, 1),
      () => trajectoryReading('fall', 0.5, 20),
      () => trajectoryReading('position', 2, 4),
      () => trajectoryReading('fall', 0, Infinity),
      () => trajectoryReading('projectile', 0, 4, 1.1),
    ])
      expect(fn).toThrow(RangeError);
  });
  it('retains explicit units and interval conditions in both languages', () => {
    for (const k of trajectoryKinds)
      for (let i = 0; i < 3; i++) {
        const r = trajectoryRecord(k, i);
        expect(r.every((s) => s.length > 20 && s.includes('m'))).toBe(true);
      }
    expect(trajectoryRecord('acceleration', 1)[1]).toContain(
      'a-graph area=0 m/s',
    );
  });
  it('registers seven complete bilingual courses for all remaining Unit 5.1 topics', () => {
    expect(lessons.slice(153, 160)).toEqual(trajectoryLessons);
    expect(trajectoryLessons.map((l) => l.kind)).toEqual(
      trajectoryKinds.map((k) => `trajectory-${k}`),
    );
    for (const l of trajectoryLessons) {
      expect(l.stage).toBe(5);
      expect(l.unit).toBe('kinematics');
      expect(lessonCatalog.find((c) => c.id === l.id)?.pack).toBe(
        'trajectories',
      );
      expect(experiments.filter((e) => e.id === l.kind)).toHaveLength(1);
      for (const key of [
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
      expect(l.questions).toHaveLength(3);
      expect(l.vocabulary).toHaveLength(4);
      for (const q of [...l.questions, l.exit]) {
        expect(q.options[q.correct]).toBeDefined();
        expect(q.explanation.en.length).toBeGreaterThan(10);
      }
    }
  });
  it('preserves previous progress and requires new observation and transfer mastery', () => {
    const old = kinematicsLessons[0]!,
      previous = {
        ...freshLesson(),
        prediction: 1,
        explored: true,
        answers: Object.fromEntries(
          [...old.questions, old.exit].map((q, i) => [i, q.correct]),
        ),
        completedAt: 12345,
      };
    expect(
      decodeProgress(JSON.stringify({ lessons: { [old.id]: previous } }))
        .lessons[old.id]?.completedAt,
    ).toBe(12345);
    for (const l of trajectoryLessons) {
      const current = {
        ...previous,
        answers: Object.fromEntries(
          [...l.questions, l.exit].map((q, i) => [i, q.correct]),
        ),
      };
      expect(isMastered(l.id, current)).toBe(true);
      expect(isMastered(l.id, { ...current, explored: false })).toBe(false);
      expect(
        isMastered(l.id, { ...current, answers: { ...current.answers, 3: 1 } }),
      ).toBe(false);
    }
  });
});
