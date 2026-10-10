import { describe, it, expect } from 'vitest';
import {
  constantMotion,
  motionInterval,
  coordinate,
  velocityChange,
  kinematicsKinds,
  kinematicsCase,
  kinematicsDefault,
  kinematicsConfig,
  kinematicsReading,
  kinematicsRecord,
} from './kinematicsModels';
import { kinematicsLessons } from '../content/kinematics';
import { solvingLessons } from '../content/solving';
import { lessons } from '../content/lessons';
import { lessonCatalog } from '../content/catalog';
import { experiments } from '../content/experiments';
import { decodeProgress, freshLesson, isMastered } from '../progress';
describe('kinematics shares one continuous motion model', () => {
  it('derives velocity and acceleration from the same position curve', () => {
    const h = 1e-4;
    for (const [x, u, a] of [
      [3, 4, -1],
      [3, 1, 0.5],
      [15, -1, -0.5],
    ])
      for (const t of [0.5, 2, 4, 6]) {
        const before = constantMotion(x!, u!, a!, t - h),
          at = constantMotion(x!, u!, a!, t),
          after = constantMotion(x!, u!, a!, t + h);
        expect((after.position - before.position) / (2 * h)).toBeCloseTo(
          at.velocity,
          8,
        );
        expect((after.velocity - before.velocity) / (2 * h)).toBeCloseTo(
          at.acceleration,
          8,
        );
      }
  });
  it('turns smoothly at 4 s without a position or velocity jump', () => {
    const h = 1e-6,
      b = constantMotion(3, 4, -1, 4 - h),
      at = constantMotion(3, 4, -1, 4),
      c = constantMotion(3, 4, -1, 4 + h);
    expect(at).toEqual({ position: 11, velocity: 0, acceleration: -1 });
    expect(b.velocity).toBeGreaterThan(0);
    expect(c.velocity).toBeLessThan(0);
    expect(b.position).toBeCloseTo(c.position, 12);
  });
  it('splits distance at a turn while retaining zero net displacement', () => {
    expect(motionInterval(3, 4, -1, 0, 8)).toMatchObject({
      distance: 16,
      displacement: 0,
      averageVelocity: 0,
      averageSpeed: 2,
    });
    expect(motionInterval(3, 4, -1, 0, 4)).toMatchObject({
      distance: 8,
      displacement: 8,
    });
    expect(motionInterval(3, 4, -1, 4, 8)).toMatchObject({
      distance: 8,
      displacement: -8,
    });
  });
  it('matches distance to numerical integration of speed across arbitrary intervals', () => {
    for (const [start, end] of [
      [0, 2],
      [2, 6],
      [3.5, 7],
      [4, 8],
    ]) {
      const n = 10000,
        dt = (end! - start!) / n;
      let integrated = 0;
      for (let j = 0; j < n; j++)
        integrated += Math.abs(4 - (start! + (j + 0.5) * dt)) * dt;
      expect(motionInterval(3, 4, -1, start!, end!).distance).toBeCloseTo(
        integrated,
        6,
      );
    }
  });
  it('accumulates nondecreasing distance while endpoint displacement shrinks on return', () => {
    let distance = 0;
    for (let t = 0; t <= 8; t += 0.125) {
      const m = motionInterval(3, 4, -1, 0, t);
      expect(m.distance).toBeGreaterThanOrEqual(distance - 1e-9);
      expect(m.distance).toBeGreaterThanOrEqual(
        Math.abs(m.displacement) - 1e-9,
      );
      distance = m.distance;
    }
    expect(motionInterval(3, 4, -1, 0, 6).displacement).toBeLessThan(
      motionInterval(3, 4, -1, 0, 4).displacement,
    );
  });
  it('handles monotonic and stationary intervals without inventing travel', () => {
    expect(motionInterval(3, -2, 0, 0, 4)).toMatchObject({
      displacement: -8,
      distance: 8,
      averageVelocity: -2,
      averageSpeed: 2,
    });
    expect(motionInterval(3, 0, 0, 0, 4)).toMatchObject({
      displacement: 0,
      distance: 0,
      averageVelocity: 0,
      averageSpeed: 0,
    });
  });
  it('leaves zero-duration averages undefined rather than dividing by zero', () => {
    expect(motionInterval(3, 4, -1, 4, 4)).toMatchObject({
      elapsed: 0,
      distance: 0,
      displacement: 0,
      averageVelocity: null,
      averageSpeed: null,
    });
    expect(kinematicsReading('average', 1, 8, 0).averageVelocity).toBeNull();
  });
  it('translates fixed origins without changing displacement and reverses coordinate signs consistently', () => {
    const rows = [0, 1, 2].map((i) =>
      kinematicsReading('position', i, kinematicsDefault('position', i)),
    );
    expect(rows.map((m) => m.position)).toEqual([15, 5, -5]);
    expect(rows.map((m) => m.initial)).toEqual([3, -7, 7]);
    expect(rows.map((m) => m.displacement)).toEqual([12, 12, -12]);
    expect(rows.map((m) => m.velocity)).toEqual([2, 2, -2]);
    expect(rows.map((m) => m.distance)).toEqual([12, 12, 12]);
    for (const o of [-4, 0, 7, 14])
      expect(coordinate(15, o, 1) - coordinate(3, o, 1)).toBe(12);
  });
  it('separates signed velocity, nonnegative speed and the zero-speed direction boundary', () => {
    const rows = [0, 1, 2].map((i) =>
      kinematicsReading('velocity', i, kinematicsDefault('velocity', i)),
    );
    expect(rows.map((m) => m.velocity)).toEqual([2, 0, -2]);
    expect(rows.map((m) => m.speed)).toEqual([2, 0, 2]);
    expect(rows.map((m) => m.direction)).toEqual([
      'positive',
      null,
      'negative',
    ]);
    expect(rows[1]!.acceleration).toBe(-1);
  });
  it('uses the selected interval for mean velocity and speed', () => {
    const rows = [0, 1, 2].map((i) =>
      kinematicsReading('average', i, kinematicsDefault('average', i)),
    );
    expect(rows.map((m) => m.averageVelocity)).toEqual([2, -2, 0]);
    expect(rows.map((m) => m.averageSpeed)).toEqual([2, 2, 2]);
    expect(rows[1]!.initial).toBe(11);
    expect(rows[1]!.elapsed).toBe(4);
  });
  it('combines interval averages by time, not by equal weighting', () => {
    const a = motionInterval(3, 4, -1, 0, 2),
      b = motionInterval(3, 4, -1, 2, 8),
      whole = motionInterval(3, 4, -1, 0, 8);
    expect(
      (a.averageVelocity! * a.elapsed + b.averageVelocity! * b.elapsed) /
        whole.elapsed,
    ).toBeCloseTo(whole.averageVelocity!);
    expect((a.averageVelocity! + b.averageVelocity!) / 2).not.toBe(
      whole.averageVelocity,
    );
  });
  it('shows that the same negative acceleration can slow rightward motion or speed leftward motion', () => {
    const right = kinematicsReading('acceleration', 1, -0.5),
      left = kinematicsReading('acceleration', 2, -0.5);
    expect(right.acceleration).toBe(left.acceleration);
    expect(right.speed).toBeLessThan(Math.abs(right.first.velocity));
    expect(left.speed).toBeGreaterThan(Math.abs(left.first.velocity));
    expect(right.velocity).toBe(1);
    expect(left.velocity).toBe(-4);
  });
  it('retains acceleration through a free-control turn where speed is zero', () => {
    const at = kinematicsReading('acceleration', 0, -0.5, 1 / 3);
    expect(at.time).toBe(2);
    expect(at.velocity).toBe(0);
    expect(at.acceleration).toBe(-0.5);
    expect(kinematicsReading('acceleration', 0, -0.5).speed).toBe(2);
  });
  it('keeps endpoint velocities fixed as duration changes, while acceleration and displacement change', () => {
    const a = kinematicsReading('rate', 0, 2),
      b = kinematicsReading('rate', 1, 4),
      c = kinematicsReading('rate', 2, 2);
    expect([a.acceleration, b.acceleration, c.acceleration]).toEqual([
      2, 1, -2,
    ]);
    expect(a.velocity).toBe(b.velocity);
    expect(a.displacement).toBe(8);
    expect(b.displacement).toBe(16);
    expect(c.velocity).toBe(2);
    expect(velocityChange(2, 6, 2).change).toBe(4);
    for (const m of [a, b, c])
      expect(m.first.velocity + m.acceleration * m.elapsed).toBe(m.velocity);
  });
  it('keeps all prescribed and free models within their shared plot and ground windows', () => {
    for (const k of kinematicsKinds)
      for (let i = 0; i < 3; i++) {
        const values =
          k === 'position'
            ? [-4, kinematicsDefault(k, i), 14]
            : k === 'acceleration'
              ? [-0.5, 0, 0.5]
              : k === 'rate'
                ? [1, kinematicsDefault(k, i), 6]
                : k === 'average'
                  ? [i === 1 ? 4.5 : 0.5, kinematicsDefault(k, i), 8]
                  : [0, kinematicsDefault(k, i), 8];
        for (const value of values)
          for (let j = 0; j <= 40; j++) {
            const m = kinematicsReading(k, i, value, j / 40),
              c = kinematicsConfig(k, i, value);
            expect(m.last.position).toBeGreaterThanOrEqual(-1e-9);
            expect(m.last.position).toBeLessThanOrEqual(c.trackMax + 1e-9);
            expect(Math.abs(m.velocity)).toBeLessThanOrEqual(8);
            expect(m.speed).toBe(Math.abs(m.velocity));
          }
      }
  });
  it('rejects nonfinite and invalid model inputs, intervals and comparison cases', () => {
    for (const fn of [
      () => constantMotion(3, NaN, 1, 2),
      () => constantMotion(3, 1, 1, -1),
      () => motionInterval(3, 4, -1, 4, 3),
      () => coordinate(3, Infinity, 1),
      () => coordinate(3, 0, 0 as 1),
      () => velocityChange(2, 6, 0),
      () => kinematicsCase(0.5),
      () => kinematicsCase(3),
      () => kinematicsReading('position', 0, 15),
      () => kinematicsReading('average', 1, 4),
      () => kinematicsReading('rate', 0, 0),
      () => kinematicsReading('journey', 0, 2, 1.1),
    ])
      expect(fn).toThrow(RangeError);
  });
  it('retains meaningful bilingual records with signed quantities and explicit units', () => {
    for (const k of kinematicsKinds)
      for (let i = 0; i < 3; i++) {
        const row = kinematicsRecord(k, i);
        expect(row.every((s) => s.length > 15)).toBe(true);
        expect(row.every((s) => s.includes('m'))).toBe(true);
      }
    expect(kinematicsRecord('average', 2)[1]).toContain('mean velocity 0 m/s');
    expect(kinematicsRecord('rate', 2)[1]).toContain('a=-2 m/s²');
  });
  it('registers six complete Stage 5 courses covering the first eight plan topics in sequence', () => {
    expect(lessons.slice(147, 153)).toEqual(kinematicsLessons);
    expect(kinematicsLessons.map((l) => l.kind)).toEqual(
      kinematicsKinds.map((k) => `kinematics-${k}`),
    );
    for (const l of kinematicsLessons) {
      expect(l.stage).toBe(5);
      expect(l.unit).toBe('kinematics');
      expect(lessonCatalog.find((c) => c.id === l.id)?.pack).toBe('kinematics');
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
      expect(l.questions).toHaveLength(3);
      for (const q of [...l.questions, l.exit]) {
        expect(q.options[q.correct]).toBeDefined();
        expect(q.explanation.en.length).toBeGreaterThan(10);
      }
    }
  });
  it('preserves eight-step completion and requires observations and transfer mastery for kinematics', () => {
    const old = solvingLessons[3]!,
      saved = {
        ...freshLesson(),
        prediction: 2,
        explored: true,
        answers: Object.fromEntries(
          [...old.questions, old.exit].map((q, i) => [i, q.correct]),
        ),
        completedAt: 123456,
      };
    expect(
      decodeProgress(JSON.stringify({ lessons: { [old.id]: saved } })).lessons[
        old.id
      ]?.completedAt,
    ).toBe(123456);
    const l = kinematicsLessons[0]!,
      p = {
        ...saved,
        answers: Object.fromEntries(
          [...l.questions, l.exit].map((q, i) => [i, q.correct]),
        ),
      };
    expect(isMastered(l.id, p)).toBe(true);
    expect(isMastered(l.id, { ...p, explored: false })).toBe(false);
    expect(isMastered(l.id, { ...p, answers: { ...p.answers, 3: 1 } })).toBe(
      false,
    );
  });
});
