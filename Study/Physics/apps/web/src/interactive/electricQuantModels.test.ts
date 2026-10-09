import { describe, expect, it } from 'vitest';
import {
  meterScale,
  ammeterCase,
  voltageAccount,
  voltageCases,
  voltmeterCase,
  wireResistance,
  wireCases,
  ohmReading,
  ohmSweep,
  electricPower,
  powerCases,
  faultCircuit,
} from './electricQuantModels';
import { electricQuantLessons } from '../content/electricQuant';
import { lessons } from '../content/lessons';
import { lessonCatalog } from '../content/catalog';
import { experiments } from '../content/experiments';
import { decodeProgress, freshLesson } from '../progress';
describe('electrical measurement, model conditions and protected fault inspection', () => {
  it('changes division count and resolution without changing an ideal series current', () => {
    const broad = ammeterCase(0),
      fine = ammeterCase(1);
    expect(broad.reading).toBeCloseTo(0.3);
    expect(fine.reading).toBeCloseTo(0.3);
    expect(broad.scale?.divisions).toBeCloseTo(3);
    expect(fine.scale?.divisions).toBeCloseTo(15);
    expect(broad.scale?.step).toBeCloseTo(0.1);
    expect(fine.scale?.step).toBeCloseTo(0.02);
  });
  it('blocks an across-cell ammeter instead of assigning a safe-looking zero reading', () => {
    expect(ammeterCase(2)).toMatchObject({
      blocked: true,
      reading: null,
      scale: null,
    });
  });
  it('keeps lead-order signs distinct from magnitude and detects range overflow', () => {
    expect(meterScale(-2, 3)).toMatchObject({ sign: -1, overRange: false });
    expect(meterScale(-2, 3).divisions).toBeCloseTo(20);
    expect(meterScale(4, 3)).toMatchObject({ fraction: 1, overRange: true });
  });
  it('distinguishes total energy from energy per charge, including the empty initial account', () => {
    expect(
      voltageCases.map((c) => voltageAccount(c.energy, c.charge).voltage),
    ).toEqual([3, 3, 6]);
    for (const p of [0, 0.2, 0.5, 1]) {
      const m = voltageAccount(6, 2, p);
      expect(m.voltage).toBe(3);
      expect(m.transferredEnergy).toBeCloseTo(3 * m.transferredCharge);
      if (p === 0)
        expect([m.transferredEnergy, m.transferredCharge]).toEqual([0, 0]);
    }
  });
  it('measures two-point series voltage shares without perturbing ideal loop current', () => {
    const readings = [0, 1, 2].map((i) => voltmeterCase(i));
    expect(readings.map((m) => m.reading)).toEqual([1, 2, 3]);
    readings.forEach((m) => expect(m.circuit.sourceCurrent).toBeCloseTo(0.1));
    expect(readings[0]!.reading + readings[1]!.reading).toBe(
      readings[2]!.reading,
    );
  });
  it('reverses voltage sign but not the load state, and changing range changes only scale', () => {
    for (const i of [0, 1, 2]) {
      const m = voltmeterCase(i, true, 15),
        normal = voltmeterCase(i);
      expect(m.reading).toBe(-normal.reading);
      expect(m.circuit.currents).toEqual(normal.circuit.currents);
      expect(m.scale.divisions).toBeCloseTo(normal.scale.divisions / 5);
    }
  });
  it('compares wire geometry with fixed material, temperature and voltage', () => {
    const wires = wireCases.map((c) => wireResistance(c.length, c.area));
    expect(wires.map((m) => m.resistance)).toEqual([10, 20, 5]);
    wires.forEach((m, i) =>
      expect(m.current).toBeCloseTo([0.3, 0.15, 0.6][i]!),
    );
    expect(wireResistance(1.5, 2).resistance).toBeCloseTo(7.5);
  });
  it('requires an invariant ratio over the ohmic sweep rather than a single point', () => {
    expect(ohmSweep(0).map((m) => m.resistance)).toEqual([10, 10, 10]);
    expect(ohmSweep(1).map((m) => m.resistance)).toEqual([20, 20, 20]);
    expect(ohmSweep(2).map((m) => m.resistance)).toEqual([10, 12, 14]);
    expect(ohmReading(2, 2).current).toBeCloseTo(1 / 6);
    expect(ohmReading(0, 0).resistance).toBeNull();
    expect(ohmReading(2, 0).current).toBe(0);
  });
  it('keeps the assigned nonlinear curve monotonic and positive over its declared domain', () => {
    let last = 0;
    for (let u = 0.05; u <= 3; u += 0.05) {
      const m = ohmReading(2, u);
      expect(m.current).toBeGreaterThan(last);
      expect(m.power).toBeGreaterThan(0);
      last = m.current;
    }
    expect(ohmReading(2, 3).current).toBeLessThan(
      2 * ohmReading(2, 1.5).current,
    );
  });
  it('distinguishes constant power, elapsed physical time and accumulating energy', () => {
    const models = powerCases.map((c) => electricPower(c.voltage, c.seconds));
    expect(models.map((m) => Number(m.power.toFixed(2)))).toEqual([
      0.9, 3.6, 0.9,
    ]);
    models.forEach((m, i) => expect(m.fullEnergy).toBeCloseTo([9, 36, 18][i]!));
    for (const p of [0, 0.2, 0.5, 1]) {
      const m = electricPower(3, 20, p);
      expect(m.power).toBeCloseTo(0.9);
      expect(m.energy).toBeCloseTo(m.power * m.elapsed);
    }
    expect(electricPower(3, 20).wattHours * 3600).toBeCloseTo(18);
  });
  it('accounts for internal source loss rather than using an unlimited ideal source for a short', () => {
    for (const i of [0, 1, 2]) {
      const m = faultCircuit(i);
      expect(m.branchCurrents.reduce((a, b) => a + b, 0)).toBeCloseTo(
        m.prospectiveCurrent,
      );
      expect(
        m.loadPowers.reduce((a, b) => a + b, 0) + m.internalPower,
      ).toBeCloseTo(m.sourcePower);
      expect(
        m.terminalVoltage + m.prospectiveCurrent * m.sourceResistance,
      ).toBeCloseTo(3);
    }
  });
  it('distinguishes normal loading, overload and a finite bypass, keeping faults isolated', () => {
    const normal = faultCircuit(0),
      overload = faultCircuit(1),
      short = faultCircuit(2);
    expect(normal.prospectiveCurrent).toBeCloseTo(6 / 11);
    expect(normal.isolated).toBe(false);
    expect(overload.prospectiveCurrent).toBeCloseTo(1);
    expect(short.prospectiveCurrent).toBeCloseTo(13 / 3);
    expect(overload.protectedCurrent).toBe(0);
    expect(short.protectedCurrent).toBe(0);
    expect(short.resistances[2]).toBe(0.2);
    expect(short.branchCurrents[2]).toBeCloseTo(25 / 6);
    expect(normal.protectedCurrent).toBeCloseTo(normal.prospectiveCurrent);
  });
  it('rejects invalid geometry, ratios, ranges, sweeps and overflowing results', () => {
    for (const run of [
      () => meterScale(1, 0),
      () => meterScale(Infinity, 3),
      () => ammeterCase(3),
      () => ammeterCase(0.5),
      () => voltageAccount(1, 0),
      () => voltageAccount(-1, 1),
      () => voltageAccount(1, Number.MIN_VALUE),
      () => voltageAccount(1, 1, NaN),
      () => voltmeterCase(0, false, 0),
      () => wireResistance(0, 1),
      () => wireResistance(1, -1),
      () => wireResistance(Number.MAX_VALUE, Number.MIN_VALUE),
      () => ohmReading(0, 3.01),
      () => ohmReading(3, 1),
      () => ohmReading(0, NaN),
      () => electricPower(3, 0),
      () => electricPower(3, 10, 1.1),
      () => electricPower(Infinity, 10),
      () => faultCircuit(-1),
    ])
      expect(run).toThrow(RangeError);
  });
  it('registers all seven remaining Unit 3.4 topics with complete bilingual assessment and dedicated labs', () => {
    expect(lessons.slice(100, 107)).toEqual(electricQuantLessons);
    expect(electricQuantLessons.map((l) => l.kind)).toEqual([
      'electric-ammeter',
      'electric-voltage',
      'electric-voltmeter',
      'electric-resistance',
      'electric-ohm',
      'electric-power',
      'electric-safety',
    ]);
    for (const l of electricQuantLessons) {
      expect(l.stage).toBe(3);
      expect(l.unit).toBe('electricity');
      expect(l.questions).toHaveLength(3);
      expect(experiments.filter((e) => e.id === l.kind)).toHaveLength(1);
      expect(lessonCatalog.find((c) => c.id === l.id)?.pack).toBe(
        'electricQuant',
      );
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
  it('retains completed introductory electricity lessons after the new quantitative lessons are appended', () => {
    const l = lessons[99]!,
      saved = {
        ...freshLesson(),
        prediction: 0,
        explored: true,
        completedAt: 123,
        answers: Object.fromEntries(
          [...l.questions, l.exit].map((q, i) => [i, q.correct]),
        ),
      };
    expect(
      decodeProgress(JSON.stringify({ lessons: { [l.id]: saved }, notes: [] }))
        .lessons[l.id]?.completedAt,
    ).toBe(123);
  });
});
