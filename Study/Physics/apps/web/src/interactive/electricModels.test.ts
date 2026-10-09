import { describe, expect, it } from 'vitest';
import {
  chargeTransfer,
  chargeInteraction,
  currentWindow,
  currentCases,
  dcCircuit,
  electricCircuitCase,
  lampTransfers,
  lampCases,
  circuitPoint,
} from './electricModels';
import { electricityLessons } from '../content/electricity';
import { lessons } from '../content/lessons';
import { lessonCatalog } from '../content/catalog';
import { experiments } from '../content/experiments';
import { decodeProgress, freshLesson } from '../progress';

describe('electrical charge, circuit continuity and energy accounting', () => {
  it('keeps sixteen electrons and zero total charge, including charge in flight', () => {
    for (let transfer = -4; transfer <= 4; transfer++)
      for (const progress of [0, 0.03, 0.125, 0.25, 0.49, 0.75, 0.99, 1]) {
        const m = chargeTransfer(transfer, progress);
        expect(m.totalElectrons).toBe(16);
        expect(m.totalCharge).toBe(0);
        expect(m.chargeA + m.chargeB + m.transitCharge).toBe(0);
        expect(m.protonsA).toBe(8);
        expect(m.protonsB).toBe(8);
        expect(m.electronsA).toBeGreaterThanOrEqual(4);
        expect(m.electronsB).toBeGreaterThanOrEqual(4);
      }
    expect(chargeTransfer(4, 0.125).transitCharge).toBe(-1);
  });
  it('reverses the donor and receiver without creating positive charges', () => {
    const forward = chargeTransfer(4),
      reverse = chargeTransfer(-4);
    expect([forward.chargeA, forward.chargeB]).toEqual([-4, 4]);
    expect([reverse.chargeA, reverse.chargeB]).toEqual([4, -4]);
    expect(forward.electronsA).toBe(reverse.electronsB);
    expect(chargeTransfer(0).electronsA).toBe(8);
    expect(forward.inFlight).toBe(0);
  });
  it('does not infer opposite net charge from attraction to a polarizable neutral body', () => {
    expect(chargeInteraction(-4).action).toBe('repel');
    expect(chargeInteraction(4).action).toBe('attract');
    expect(chargeInteraction(0)).toMatchObject({
      chargeB: 0,
      polarized: true,
      action: 'attract',
    });
  });
  it('counts charge per assigned physical time, independently of display playback', () => {
    currentCases.forEach((c, i) => {
      const m = currentWindow(c.charge, c.seconds);
      expect(m.current).toBe([0.5, 1, 0.5][i]);
      expect(m.countedCharge).toBe(c.charge);
      expect(m.elapsed).toBe(c.seconds);
      expect(m.passed).toBe(m.packets);
    });
    expect(currentWindow(2, 4, 0.375)).toMatchObject({
      countedCharge: 0.75,
      passed: 3,
      elapsed: 1.5,
      current: 0.5,
    });
    expect(currentWindow(1, 2, 0).countedCharge).toBe(0);
    expect(currentWindow(1, 2, 0.24).countedCharge).toBe(0);
  });
  it('requires both an outgoing and returning conducting path', () => {
    expect(
      dcCircuit(electricCircuitCase('circuit', 0)).sourceCurrent,
    ).toBeCloseTo(0.3);
    for (const index of [1, 2]) {
      const m = dcCircuit(electricCircuitCase('circuit', index));
      expect(m.complete).toBe(false);
      expect(m.sourceCurrent).toBe(0);
      expect(m.energy).toBe(0);
      // An open circuit does not imply a known zero voltage across every element.
      expect(m.voltages).toEqual([null]);
    }
  });
  it('stops the same loop at either switch location', () => {
    const supply = electricCircuitCase('switch', 1),
      returning = electricCircuitCase('switch', 2);
    expect(supply.switchPosition).toBe('supply');
    expect(returning.switchPosition).toBe('return');
    expect(dcCircuit(supply).sourceCurrent).toBe(0);
    expect(dcCircuit(returning).sourceCurrent).toBe(0);
  });
  it('requires material conductivity and contact together', () => {
    expect(dcCircuit(electricCircuitCase('materials', 0)).complete).toBe(true);
    expect(electricCircuitCase('materials', 1).material).toBe('plastic');
    expect(electricCircuitCase('materials', 2).material).toBe('gap');
    for (const i of [1, 2])
      expect(dcCircuit(electricCircuitCase('materials', i)).sourceCurrent).toBe(
        0,
      );
  });
  it('reverses current when a cell is reversed while its resistive load power stays positive', () => {
    const forward = dcCircuit(electricCircuitCase('battery', 0)),
      reverse = dcCircuit(electricCircuitCase('battery', 2));
    expect(reverse.sourceCurrent).toBeCloseTo(-forward.sourceCurrent);
    expect(reverse.sourcePower).toBeCloseTo(forward.sourcePower);
    expect(reverse.sourceCharge).toBeCloseTo(forward.sourceCharge);
    expect(reverse.sourcePower).toBeGreaterThan(0);
    expect(
      dcCircuit(electricCircuitCase('battery', 1)).sourcePower,
    ).toBeCloseTo(4 * forward.sourcePower);
  });
  it('shares voltage in series, carries the same charge and conserves power', () => {
    for (const voltage of [-4.5, 0, 1.5, 3, 4.5]) {
      const c = {
          ...electricCircuitCase('series', 1),
          voltage,
          resistance: [10, 20],
        },
        m = dcCircuit(c, 4);
      expect(m.equivalentResistance).toBe(30);
      expect(m.currents[0]).toBeCloseTo(m.currents[1]!);
      expect(m.voltages.reduce<number>((a, v) => a + (v ?? 0), 0)).toBeCloseTo(
        voltage,
      );
      expect(m.powers.reduce((a, v) => a + v, 0)).toBeCloseTo(m.sourcePower);
      expect(m.loadEnergies.reduce((a, v) => a + v, 0)).toBeCloseTo(m.energy);
      m.loadCharges.forEach((q) => expect(q).toBeCloseTo(m.sourceCharge));
    }
  });
  it('does not leave a lit lamp when a series filament opens', () => {
    const m = dcCircuit(electricCircuitCase('series', 2));
    expect(m.currents).toEqual([0, 0]);
    expect(m.powers).toEqual([0, 0]);
    expect(m.voltages).toEqual([null, null]);
  });
  it('sums currents and charge in parallel while keeping voltage across each closed branch', () => {
    for (const voltage of [-3, 0, 3])
      for (const resistance of [5, 10, 20, 30]) {
        const m = dcCircuit(
          {
            ...electricCircuitCase('parallel', 0),
            voltage,
            resistance: [10, resistance],
          },
          4,
        );
        expect(m.currents.reduce((a, i) => a + i, 0)).toBeCloseTo(
          m.sourceCurrent,
        );
        expect(m.loadCharges.reduce((a, q) => a + q, 0)).toBeCloseTo(
          m.sourceCharge,
        );
        expect(m.voltages).toEqual([voltage, voltage]);
        expect(m.powers.reduce((a, p) => a + p, 0)).toBeCloseTo(m.sourcePower);
        expect(m.loadEnergies.reduce((a, e) => a + e, 0)).toBeCloseTo(m.energy);
      }
  });
  it('changes branch B without changing branch A under an ideal fixed-voltage source', () => {
    const results = [0, 1, 2].map((i) =>
      dcCircuit(electricCircuitCase('parallel', i)),
    );
    results.forEach((m) => expect(m.currents[0]).toBeCloseTo(0.3));
    results.forEach((m, i) =>
      expect(m.currents[1]).toBeCloseTo([0.3, 0, 0.15][i]!),
    );
    expect(results[1]!.voltages).toEqual([3, null]);
    expect(
      dcCircuit({
        ...electricCircuitCase('parallel', 0),
        branchClosed: [false, false],
      }).complete,
    ).toBe(false);
  });
  it('accounts for light plus heat without consuming charge in a lamp', () => {
    const m = dcCircuit(electricCircuitCase('lamp', 0));
    expect(m.sourceCharge).toBeCloseTo(0.6);
    expect(m.loadCharges[0]).toBeCloseTo(m.sourceCharge);
    for (const share of lampCases)
      for (const p of [0, 0.2, 0.5, 1]) {
        const e = lampTransfers(m.energy * p, share);
        expect(e.light + e.thermal).toBeCloseTo(m.energy * p);
      }
    expect(lampTransfers(1.8, 0.3).light).toBeCloseTo(0.54);
  });
  it('wraps schematic direction markers in either direction, including zero-length segments', () => {
    const path = [
      [0, 0],
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
      [0, 0],
    ] as const;
    expect(circuitPoint(path, 0.125)).toEqual({ x: 5, y: 0 });
    expect(circuitPoint(path, -0.125)).toEqual({ x: 0, y: 5 });
    expect(circuitPoint(path, 1.125)).toEqual(circuitPoint(path, 0.125));
  });
  it('rejects impossible/nonfinite inputs and unrepresentable circuit outputs', () => {
    const c = electricCircuitCase('parallel', 0);
    for (const run of [
      () => chargeTransfer(4.1),
      () => chargeTransfer(5),
      () => chargeTransfer(1, NaN),
      () => chargeTransfer(1, -0.1),
      () => chargeInteraction(Infinity),
      () => currentWindow(0, 2),
      () => currentWindow(1, 0),
      () => currentWindow(11, 2),
      () => currentWindow(1, 2, 1.1),
      () => currentWindow(1, Infinity),
      () => currentWindow(1, Number.MIN_VALUE),
      () => dcCircuit({ ...c, resistance: [0, 10] }),
      () => dcCircuit({ ...c, branchClosed: [true] }),
      () => dcCircuit(c, 0),
      () => dcCircuit({ ...c, voltage: Infinity }),
      () => dcCircuit({ ...c, voltage: Number.MAX_VALUE }),
      () => dcCircuit({ ...c, resistance: [Number.MIN_VALUE, 10] }),
      () => lampTransfers(-1, 0.5),
      () => lampTransfers(1, 1.1),
      () => lampTransfers(NaN, 0.5),
      () => electricCircuitCase('charge', 0),
      () => electricCircuitCase('battery', 3),
      () =>
        circuitPoint(
          [
            [0, 0],
            [0, 0],
          ],
          0,
        ),
      () =>
        circuitPoint(
          [
            [0, 0],
            [Infinity, 0],
          ],
          0,
        ),
    ])
      expect(run).toThrow(RangeError);
  });
  it('appends ten complete bilingual lessons and registers every dedicated station and body pack', () => {
    expect(lessons.slice(90, 100)).toEqual(electricityLessons);
    expect(new Set(electricityLessons.map((l) => l.kind)).size).toBe(10);
    for (const l of electricityLessons) {
      expect(l.stage).toBe(3);
      expect(l.unit).toBe('electricity');
      expect(l.questions).toHaveLength(3);
      expect(experiments.filter((e) => e.id === l.kind)).toHaveLength(1);
      expect(lessonCatalog.find((c) => c.id === l.id)?.pack).toBe(
        'electricity',
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
  it('retains earlier completed machine courses when electricity is appended', () => {
    const l = lessons[89]!,
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
