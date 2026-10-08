import { describe, expect, it } from 'vitest';
import {
  leverLift,
  leverCases,
  turningEffect,
  turningCases,
  ropeHoist,
  pulleyCases,
  externalGears,
  gearCases,
  efficiencyCases,
} from './machineModels';
import { hoistDrawing } from './machineGeometry';
import { machineLessons } from '../content/machines';
import { units } from '../content/curriculum';
import { lessonCatalog } from '../content/catalog';
import { lessons } from '../content/lessons';
import { experiments } from '../content/experiments';
import { decodeProgress, freshLesson } from '../progress';
describe('simple machines: force geometry, constrained motion and complete energy ledgers', () => {
  it('trades lever effort against arm length without changing the task', () => {
    const rows = leverCases.map((v) => leverLift(v, 0.1));
    rows.forEach((m, i) => {
      expect(m.force).toBeCloseTo([30, 15, 7.5][i]!);
      expect(m.loadRise).toBeCloseTo(0.1 * Math.sin(Math.PI / 12));
      expect(m.effortTravel / m.loadRise).toBeCloseTo(m.ratio);
    });
  });
  it('preserves opposing moments and work throughout the controlled lever stroke', () => {
    for (const e of [0.1, 0.2, 0.4])
      for (const l of [0.05, 0.1, 0.2])
        for (const p of [0, 0.2, 0.5, 1]) {
          const m = leverLift(e, l, 30, p);
          expect(m.loadMoment).toBeCloseTo(m.effortMoment);
          expect(m.inputWork).toBeCloseTo(m.outputWork);
          expect(m.support).toBeCloseTo(m.weight + m.force);
          expect(m.loadRise / l).toBeCloseTo(Math.sin(m.angle));
        }
  });
  it('requires both arms when moving load contact as well as effort', () => {
    expect(leverLift(0.4, 0.2).force).toBeCloseTo(15);
    expect(leverLift(0.4, 0.1).force).toBeCloseTo(7.5);
    expect(leverLift(0.1, 0.2).force).toBeCloseTo(60);
  });
  it('uses perpendicular moment arm and force direction rather than handle length alone', () => {
    turningCases.forEach((c, i) =>
      expect(turningEffect(c.radius, 50, c.angle).signedMoment).toBeCloseTo(
        [10, 5, 0][i]!,
      ),
    );
    const m = turningEffect(0.2, 50, 30);
    expect(m.perpendicularArm).toBeCloseTo(0.1);
    expect(m.signedMoment).toBeCloseTo(5);
    expect(turningEffect(0.2, 50, -30).signedMoment).toBeCloseTo(-5);
  });
  it('constructs a perpendicular pivot-to-force-line segment at the actual line', () => {
    for (const a of [0, 15, 30, 60, 90, 135]) {
      const m = turningEffect(0.2, 50, a),
        u = [Math.cos(m.radians), Math.sin(m.radians)];
      expect(m.footX * u[0]! + m.footY * u[1]!).toBeCloseTo(0);
      expect((m.footX - 0.2) * u[1]! - m.footY * u[0]!).toBeCloseTo(0);
      expect(Math.hypot(m.footX, m.footY)).toBeCloseTo(m.perpendicularArm);
    }
  });
  it('counts 1, 2 and 4 supporting strands, conserving work at all positions', () => {
    pulleyCases.forEach((n, i) => {
      const m = ropeHoist(n);
      expect(m.force).toBeCloseTo([40, 20, 10][i]!);
      expect(m.pull).toBeCloseTo([0.25, 0.5, 1][i]!);
      expect(m.inputWork).toBeCloseTo(10);
    });
    for (const n of pulleyCases)
      for (const p of [0, 0.1, 0.5, 1]) {
        const m = ropeHoist(n, 40, 0.25, 1, p);
        expect(m.pull).toBeCloseTo(n * m.lift);
        expect(m.force * n).toBeCloseTo(m.weight);
        expect(m.inputWork).toBeCloseTo(m.outputWork);
        expect(m.loss).toBeCloseTo(0);
      }
  });
  it('changes task energy with actual lift height rather than force advantage', () => {
    const m = ropeHoist(4, 40, 0.5);
    expect(m.force).toBe(10);
    expect(m.pull).toBe(2);
    expect(m.outputWork).toBe(20);
    expect(m.inputWork).toBe(20);
  });
  it('keeps each illustrated continuous rope length fixed through a full stroke', () => {
    for (const n of pulleyCases) {
      const initial = hoistDrawing(n, 0.25, 0);
      for (const p of [0.1, 0.5, 1]) {
        const d = hoistDrawing(n, 0.25, p);
        expect(d.ropeLength).toBeCloseTo(initial.ropeLength);
        expect(d.descent).toBeCloseTo(n * d.rise);
        expect(initial.loadY - d.loadY).toBeCloseTo(d.rise);
        expect(d.rope.match(/M/g)).toHaveLength(1);
      }
    }
  });
  it('keeps diagrams within their vertical travel while actual target height changes', () => {
    for (const n of pulleyCases)
      for (const h of [0.1, 0.25, 0.5]) {
        const d = hoistDrawing(n, h, 1);
        expect(d.loadY).toBe(220);
        expect(d.endY).toBeLessThan(300);
        expect(d.positionScale * h).toBeCloseTo(40);
        expect(d.rise).toBeCloseTo(40);
      }
  });
  it('meshes equal tooth passage with opposite output rotation and reciprocal torque', () => {
    gearCases.forEach((t, i) => {
      const m = externalGears(12, t);
      expect(m.outputRpm).toBeCloseTo([-6, -3, -2][i]!);
      expect(m.outputTorque).toBeCloseTo([2, 4, 6][i]!);
      expect(m.inputTurns * m.inputTeeth).toBeCloseTo(
        -m.outputTurns * m.outputTeeth,
      );
      expect(m.powerIn).toBeCloseTo(m.powerOut);
    });
  });
  it('retains gear turn ratio when input speed changes without inventing extra power', () => {
    const m = externalGears(12, 36, 12, 2, 0.5);
    expect(m.outputRpm).toBeCloseTo(-4);
    expect(m.outputTurns).toBeCloseTo(-1 / 6);
    expect(m.outputTorque).toBe(6);
    expect(m.powerOut).toBeCloseTo(m.powerIn);
  });
  it('accounts for assigned friction losses at fixed geometric travel', () => {
    efficiencyCases.forEach((eta, i) => {
      const m = ropeHoist(2, 40, 0.25, eta);
      expect(m.force).toBeCloseTo([20, 25, 40][i]!);
      expect(m.pull).toBe(0.5);
      expect(m.inputWork).toBeCloseTo([10, 12.5, 20][i]!);
      expect(m.loss).toBeCloseTo([0, 2.5, 10][i]!);
      expect(m.advantage).toBeCloseTo(2 * eta);
      expect(m.outputWork / m.inputWork).toBeCloseTo(eta);
    });
  });
  it('keeps full-system energy accounting during partial real-machine motion', () => {
    for (const p of [0, 0.2, 0.5, 1]) {
      const m = ropeHoist(2, 40, 0.25, 0.8, p);
      expect(m.inputWork).toBeCloseTo(m.outputWork + m.loss);
      expect(m.outputWork).toBeCloseTo(10 * p);
      expect(m.loss).toBeCloseTo(2.5 * p);
    }
  });
  it('rejects impossible, nonfinite and overflowing conditions', () => {
    for (const run of [
      () => leverLift(0, 0.1),
      () => leverLift(0.1, -0.1),
      () => leverLift(0.1, 0.1, 30, 1.01),
      () => leverLift(Number.MIN_VALUE, Number.MAX_VALUE),
      () => turningEffect(0.1, 50, NaN),
      () => turningEffect(0.1, 0, 90),
      () => turningEffect(0.1, 50, 181),
      () => ropeHoist(3),
      () => ropeHoist(2, 40, 0.25, 0),
      () => ropeHoist(2, 40, 0.25, 1.01),
      () => ropeHoist(2, Infinity),
      () => externalGears(12, 12.5),
      () => externalGears(0, 24),
      () => externalGears(12, 24, 0),
      () => externalGears(12, 24, 6, 2, -1),
      () => externalGears(12, 24, Number.MAX_VALUE, Number.MAX_VALUE),
      () => hoistDrawing(4, 0.25, -0.1),
    ])
      expect(run).toThrow(RangeError);
  });
  it('adds all six bilingual planned machine topics in order with dedicated stations', () => {
    expect(lessons.slice(84, 90)).toEqual(machineLessons);
    const stageUnits = [
      ...new Set(lessons.filter((l) => l.stage === 3).map((l) => l.unit)),
    ];
    expect(
      Object.keys(units).filter((unit) =>
        stageUnits.some((item) => item === unit),
      ),
    ).toEqual(stageUnits);
    expect(machineLessons.map((l) => l.kind)).toEqual([
      'machine-lever',
      'machine-turning',
      'machine-pulley',
      'machine-gears',
      'machine-advantage',
      'machine-real',
    ]);
    for (const l of machineLessons) {
      expect(l.stage).toBe(3);
      expect(l.unit).toBe('machines');
      expect(l.questions).toHaveLength(3);
      expect(experiments.filter((e) => e.id === l.kind)).toHaveLength(1);
      expect(lessonCatalog.find((c) => c.id === l.id)?.pack).toBe('machines');
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
        expect(l[key].zh).toBeTruthy();
        expect(l[key].en).toBeTruthy();
      }
      for (const q of [...l.questions, l.exit]) {
        expect(q.options[q.correct]?.zh).toBeTruthy();
        expect(q.options[q.correct]?.en).toBeTruthy();
        expect(q.explanation.zh).toBeTruthy();
        expect(q.explanation.en).toBeTruthy();
      }
    }
  });
  it('retains completed buoyancy learning when new machine lessons are appended', () => {
    const l = lessons[83]!,
      saved = {
        ...freshLesson(),
        prediction: 0,
        explored: true,
        completedAt: 123,
        answers: Object.fromEntries(
          [...l.questions, l.exit].map((q, i) => [i, q.correct]),
        ),
      };
    const p = decodeProgress(
      JSON.stringify({ lessons: { [l.id]: saved }, notes: [] }),
    );
    expect(p.lessons[l.id]?.completedAt).toBe(123);
    expect(p.lessons[l.id]?.answers[3]).toBe(l.exit.correct);
  });
});
