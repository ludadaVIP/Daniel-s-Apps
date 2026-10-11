import { describe, expect, it } from 'vitest';
import {
  mechanicalEnergyKinds,
  mechanicalEnergyDefault,
  mechanicalEnergyLimits,
  mechanicalEnergyReading,
  mechanicalEnergyRows,
  mechanicalEnergyRecord,
  type MechanicalEnergyKind,
} from './mechanicalEnergyModels';
import { mechanicalEnergyLessons } from '../content/mechanicalEnergy';
import { momentumLessons } from '../content/momentum';
import { lessons } from '../content/lessons';
import { lessonCatalog } from '../content/catalog';
import { experiments } from '../content/experiments';
import { decodeProgress, freshLesson, isMastered } from '../progress';
const read = (
  kind: MechanicalEnergyKind,
  i: number,
  p = 1,
  v = mechanicalEnergyDefault(kind, i),
) => mechanicalEnergyReading(kind, i, v, p);
const derivative = (f: (t: number) => number, t: number) => {
  const h = 1e-5;
  return (f(t + h) - f(t - h)) / (2 * h);
};
const integrate = (f: (x: number) => number, b: number) => {
  const n = 2000,
    h = b / n;
  let sum = 0;
  for (let i = 0; i < n; i++) sum += f((i + 0.5) * h) * h;
  return sum;
};
describe('work is coupled to displacement, kinetic energy and system boundaries', () => {
  it('distinguishes force angle from displacement and retains negative work', () => {
    const values = [0, 1, 2].map((i) => read('angle', i));
    expect(values.map((m) => m.s)).toEqual([3, 2.5, 2]);
    expect(values[0]!.work).toBe(12);
    expect(values[1]!.work).toBeCloseTo(5, 12);
    expect(values[2]!.work).toBe(0);
    const reverse = read('angle', 0, 1, 180);
    expect(reverse.v).toBe(0);
    expect(reverse.s).toBe(1);
    expect(reverse.work).toBe(-4);
  });
  it('keeps contact normal positive over the complete free-angle domain', () => {
    for (let theta = 0; theta <= 180; theta += 15)
      expect(20 - 4 * Math.sin((theta * Math.PI) / 180)).toBeGreaterThan(0);
  });
  it('recovers braking distance from energy independently of the time equations', () => {
    const m = [0, 1, 2].map((i) => read('braking', i));
    expect(m.map((r) => r.initialK)).toEqual([4, 16, 16]);
    expect(m.map((r) => r.s)).toEqual([1, 4, 2]);
    expect(m.map((r) => r.duration)).toEqual([1, 2, 1]);
    for (const r of m) {
      expect(r.v).toBe(0);
      expect(r.force).toBe(0);
      expect(r.work).toBe(-r.initialK);
      expect(r.thermal).toBe(r.initialK);
    }
  });
  it('does not replace partially completed braking with a final-stop ledger', () => {
    const m = read('braking', 1, 0.5);
    expect(m.v).toBe(2);
    expect(m.s).toBe(3);
    expect(m.kinetic).toBe(4);
    expect(m.work).toBe(-12);
    expect(m.force).toBe(-4);
  });
  it('changes absolute potential energy without changing gravity work or motion', () => {
    for (const p of [0, 0.25, 0.5, 1]) {
      const ground = read('height', 1, p),
        summit = read('height', 2, p);
      expect(summit.potential - ground.potential).toBe(-20);
      expect(summit.potential - summit.initialU).toBeCloseTo(
        ground.potential - ground.initialU,
        12,
      );
      expect(summit.gravityWork).toBe(ground.gravityWork);
      expect(summit.s).toBe(ground.s);
      expect(summit.v).toBe(ground.v);
    }
    expect(read('height', 2, 0).potential).toBe(-20);
    expect(read('height', 2).potential).toBe(0);
  });
  it('trades force for path length, keeping each prescribed lift at constant nonzero K', () => {
    const vertical = read('height', 0),
      ramp = read('height', 1);
    expect(vertical.force).toBe(20);
    expect(ramp.force).toBe(10);
    expect(vertical.work).toBe(20);
    expect(ramp.work).toBe(20);
    expect(vertical.kinetic).toBe(0.25);
    expect(ramp.kinetic).toBe(1);
    for (const m of [vertical, ramp]) {
      expect(m.netWork).toBe(0);
      expect(m.kinetic - m.initialK).toBe(0);
      expect(m.work + m.gravityWork).toBe(0);
    }
  });
  it('integrates the varying spring force instead of multiplying maximum force by length', () => {
    for (let i = 0; i < 3; i++)
      for (const p of [0.1, 0.5, 0.9, 1]) {
        const m = read('spring', i, p);
        const area = integrate((s) => m.stiffness * (m.compression - s), m.s);
        expect(area).toBeCloseTo(m.work, 10);
        expect(m.work).toBeCloseTo(m.kinetic, 10);
        expect(m.kinetic + m.potential).toBeCloseTo(m.initialU, 10);
      }
    expect([0, 1, 2].map((i) => read('spring', i, 0).potential)).toEqual([
      2.5, 10, 20,
    ]);
  });
  it('retains maximum speed at natural length rather than stopping an attached spring cart', () => {
    for (let i = 0; i < 3; i++) {
      const m = read('spring', i);
      expect(m.force).toBe(0);
      expect(m.potential).toBe(0);
      expect(m.v).toBeCloseTo(Math.sqrt(2 * m.initialU), 12);
      expect(m.v).toBeGreaterThan(0);
    }
  });
  it('separates mechanical-energy loss from total-energy conservation on a real time path', () => {
    for (let i = 0; i < 3; i++)
      for (const p of [0, 0.25, 0.5, 0.75, 1]) {
        const m = read('conservation', i, p);
        expect(m.total).toBeCloseTo(40, 10);
        expect(m.kinetic + m.potential).toBeCloseTo(40 - m.thermal, 10);
        expect(m.gravityWork).toBeCloseTo(m.initialU - m.potential, 10);
        expect(m.gravityWork + m.frictionWork).toBeCloseTo(m.kinetic, 10);
      }
    [40, 32, 24].forEach((value, i) =>
      expect(read('conservation', i).kinetic).toBeCloseTo(value, 10),
    );
    [0, 8, 16].forEach((value, i) =>
      expect(read('conservation', i).thermal).toBeCloseTo(value, 10),
    );
  });
  it('gets a longer transit time from larger resistance while keeping the same physical endpoint', () => {
    const a = read('conservation', 0),
      b = read('conservation', 2),
      c = read('conservation', 0, 1, 8);
    expect(b.duration).toBeGreaterThan(a.duration);
    expect(c.duration).toBeGreaterThan(b.duration);
    expect(c.s).toBeCloseTo(4, 12);
    expect(c.kinetic).toBeCloseTo(8, 12);
  });
  it('differentiates scene paths and kinetic energy on the shared physical clock', () => {
    for (const kind of mechanicalEnergyKinds)
      for (let i = 0; i < 3; i++)
        for (const p of [0.2, 0.5, 0.8]) {
          const m = read(kind, i, p),
            f = (t: number) => read(kind, i, t / m.duration);
          expect(derivative((t) => f(t).s, m.time)).toBeCloseTo(m.v, 6);
          const totalForce =
            kind === 'height' || kind === 'power' ? 0 : m.force;
          expect(m.mass * derivative((t) => f(t).v, m.time)).toBeCloseTo(
            totalForce,
            6,
          );
          expect(derivative((t) => f(t).kinetic, m.time)).toBeCloseTo(
            totalForce * m.v,
            6,
          );
        }
  });
  it('checks work by independent force–velocity integration', () => {
    for (const kind of ['angle', 'braking', 'spring', 'conservation'] as const)
      for (let i = 0; i < 3; i++) {
        const m = read(kind, i, 0.9),
          w = integrate((t) => {
            const q = read(kind, i, t / m.duration);
            return q.force * q.v;
          }, m.time);
        expect(w).toBeCloseTo(m.netWork, 5);
      }
  });
  it('distinguishes task energy, transfer rate and task efficiency', () => {
    const m = [0, 1, 2].map((i) => read('power', i));
    expect(m.map((r) => r.input)).toEqual([20, 20, 24]);
    expect(m.map((r) => r.power)).toEqual([5, 10, 12]);
    expect(m.map((r) => r.usefulPower)).toEqual([5, 10, 10]);
    expect(m.map((r) => r.useful)).toEqual([20, 20, 20]);
    expect(m[2]!.efficiency).toBeCloseTo(5 / 6, 12);
    for (const r of m) {
      expect(r.force * r.v).toBe(r.power);
      expect(r.input).toBe(r.useful + r.thermal);
      expect(r.work + r.gravityWork + r.frictionWork).toBe(0);
    }
  });
  it('holds full-task energy and efficiency constant when only duration changes', () => {
    for (let i = 0; i < 3; i++) {
      const slow = read('power', i, 1, 6),
        fast = read('power', i, 1, 1);
      expect(fast.input).toBe(slow.input);
      expect(fast.efficiency).toBe(slow.efficiency);
      expect(fast.power / slow.power).toBe(6);
      expect(fast.v / slow.v).toBe(6);
    }
  });
  it('bounds every finite readout and drawing domain across prescribed and free settings', () => {
    for (const kind of mechanicalEnergyKinds)
      for (let i = 0; i < 3; i++)
        for (const value of [
          mechanicalEnergyLimits[kind].min,
          mechanicalEnergyDefault(kind, i),
          mechanicalEnergyLimits[kind].max,
        ])
          for (let p = 0; p <= 1; p += 0.025) {
            const m = mechanicalEnergyReading(kind, i, value, p);
            for (const n of Object.values(m))
              expect(Number.isFinite(n)).toBe(true);
            expect(m.x).toBeGreaterThanOrEqual(-1e-10);
            expect(m.x).toBeLessThanOrEqual(6.5 + 1e-10);
            expect(m.height).toBeGreaterThanOrEqual(-1e-10);
            expect(m.height).toBeLessThanOrEqual(2 + 1e-10);
            expect(m.kinetic).toBeGreaterThanOrEqual(0);
            expect(m.netWork).toBeCloseTo(m.kinetic - m.initialK, 9);
            for (const [, n] of mechanicalEnergyRows(kind, m))
              expect(Math.abs(n)).toBeLessThanOrEqual(45 + 1e-8);
          }
  });
  it('rejects corrupt index, progress and controls before drawing', () => {
    for (const kind of mechanicalEnergyKinds) {
      for (const i of [-1, 3, 0.5, NaN])
        expect(() => read(kind, i)).toThrow(RangeError);
      for (const p of [-0.1, 1.1, Infinity, NaN])
        expect(() => read(kind, 0, p)).toThrow(RangeError);
      for (const v of [
        NaN,
        Infinity,
        mechanicalEnergyLimits[kind].min - 1,
        mechanicalEnergyLimits[kind].max + 1,
      ])
        expect(() => read(kind, 0, 0.5, v)).toThrow(RangeError);
    }
  });
});
describe('connected high-school work and energy lessons', () => {
  it('registers six unique bilingual bodies and stations after existing momentum content', () => {
    expect(mechanicalEnergyLessons).toHaveLength(6);
    const first = lessons.findIndex(
      (l) => l.id === mechanicalEnergyLessons[0]!.id,
    );
    expect(lessons.slice(first - 6, first).map((l) => l.id)).toEqual(
      momentumLessons.map((l) => l.id),
    );
    for (const l of mechanicalEnergyLessons) {
      expect(l.stage).toBe(5);
      expect(l.unit).toBe('mechanicalEnergy');
      expect(lessonCatalog.find((c) => c.id === l.id)?.pack).toBe(
        'mechanicalEnergy',
      );
      expect(experiments.some((e) => e.id === l.kind)).toBe(true);
      expect(l.questions).toHaveLength(3);
      expect(l.vocabulary).toHaveLength(4);
      for (const pair of [
        l.title,
        l.hook,
        l.concept,
        l.example,
        l.misconception,
        l.realWorld,
        l.homeExperiment,
        l.exit.explanation,
      ]) {
        expect(pair.zh.trim().length).toBeGreaterThan(0);
        expect(pair.en.trim().length).toBeGreaterThan(0);
      }
      for (const q of [...l.questions, l.exit]) {
        expect(q.correct).toBeGreaterThanOrEqual(0);
        expect(q.correct).toBeLessThan(q.options.length);
      }
    }
  });
  it('preserves prior mastery and requires all four correct assessments plus exploration', () => {
    const lesson = momentumLessons[0]!,
      state = {
        ...freshLesson(),
        prediction: 1,
        explored: true,
        answers: Object.fromEntries(
          [...lesson.questions, lesson.exit].map((q, i) => [i, q.correct]),
        ),
        completedAt: 12345,
      };
    const decoded = decodeProgress(
      JSON.stringify({ lessons: { [lesson.id]: state } }),
    );
    expect(decoded.lessons[lesson.id]?.completedAt).toBe(12345);
    expect(isMastered(lesson.id, state)).toBe(true);
    for (const l of mechanicalEnergyLessons) {
      const p = {
        ...state,
        answers: Object.fromEntries(
          [...l.questions, l.exit].map((q, i) => [i, q.correct]),
        ),
      };
      expect(isMastered(l.id, p)).toBe(true);
      expect(isMastered(l.id, { ...p, explored: false })).toBe(false);
      expect(isMastered(l.id, { ...p, answers: { ...p.answers, 3: 1 } })).toBe(
        false,
      );
    }
  });
  it('retains interpretable endpoint records for all eighteen observations', () => {
    for (const kind of mechanicalEnergyKinds)
      for (let i = 0; i < 3; i++) {
        const s = mechanicalEnergyRecord(kind, i);
        expect(s).toContain('s=');
        expect(s).toContain('Wnet=');
        expect(s).not.toMatch(/NaN|Infinity/);
      }
  });
});
