import { dcCircuit } from './electricModels';
const finite = (...values: number[]) => {
  if (!values.every(Number.isFinite))
    throw new RangeError('Finite electrical values required');
};
const inspection = (p: number) => {
  finite(p);
  if (p < 0 || p > 1) throw new RangeError('Inspection must be 0–1');
};
export const quantKinds = [
  'ammeter',
  'voltage',
  'voltmeter',
  'resistance',
  'ohm',
  'power',
  'safety',
] as const;
export type QuantKind = (typeof quantKinds)[number];
export function checkCase(index: number) {
  if (!Number.isInteger(index) || index < 0 || index > 2)
    throw new RangeError('Invalid comparison');
}
/** Thirty teaching divisions, magnitude plus an independent signed lead-order readout. */
export function meterScale(value: number, range: number) {
  finite(value, range);
  if (range <= 0) throw new RangeError('Positive range required');
  const divisions = (Math.abs(value) / range) * 30;
  finite(divisions, range / 30);
  return {
    divisions,
    step: range / 30,
    fraction: Math.min(1, divisions / 30),
    overRange: Math.abs(value) > range,
    sign: Math.sign(value),
  };
}
/** Incorrect across-source current wiring is blocked; no fictional short-circuit reading. */
export function ammeterCase(index: number) {
  checkCase(index);
  const circuit = dcCircuit({
    voltage: 3,
    topology: 'series',
    resistance: [10],
    branchClosed: [true],
  });
  const blocked = index === 2,
    range = index === 0 ? 3 : 0.6;
  return {
    blocked,
    range,
    reading: blocked ? null : circuit.sourceCurrent,
    scale: blocked ? null : meterScale(circuit.sourceCurrent, range),
  };
}
export const voltageCases = [
  { charge: 1, energy: 3 },
  { charge: 2, energy: 6 },
  { charge: 1, energy: 6 },
] as const;
/** Specified full-window energy per charge, with proportional cumulative accounting. */
export function voltageAccount(energy: number, charge: number, progress = 1) {
  finite(energy, charge);
  inspection(progress);
  if (energy < 0 || charge <= 0)
    throw new RangeError('Invalid energy/charge account');
  const voltage = energy / charge;
  finite(voltage);
  return {
    energy,
    charge,
    voltage,
    transferredEnergy: energy * progress,
    transferredCharge: charge * progress,
  };
}
/** Ideal infinite-resistance voltmeter across selected nodes of a 10 Ω + 20 Ω series loop. */
export function voltmeterCase(index: number, reversed = false, range = 3) {
  checkCase(index);
  if (typeof reversed !== 'boolean') throw new RangeError('Invalid lead order');
  const circuit = dcCircuit({
    voltage: 3,
    topology: 'series',
    resistance: [10, 20],
    branchClosed: [true, true],
  });
  const magnitude = index === 2 ? circuit.voltage : circuit.voltages[index]!;
  const reading = magnitude * (reversed ? -1 : 1);
  return { reading, range, circuit, scale: meterScale(reading, range) };
}
export const wireCases = [
  { length: 1, area: 1 },
  { length: 2, area: 1 },
  { length: 1, area: 2 },
] as const;
/** Same material and temperature: reference wire 10 Ω, relative length/cross-section. */
export function wireResistance(length: number, area: number) {
  finite(length, area);
  if (length <= 0 || area <= 0)
    throw new RangeError('Positive wire dimensions required');
  const resistance = (10 * length) / area,
    current = 3 / resistance;
  finite(resistance, current);
  if (resistance <= 0) throw new RangeError('Unrepresentable resistance');
  return { length, area, resistance, current, voltage: 3 };
}
/** Two fixed-temperature ohmic loads and one assigned forward non-ohmic curve, not a heat solution. */
export function ohmReading(index: number, voltage: number) {
  checkCase(index);
  finite(voltage);
  if (voltage < 0 || voltage > 3)
    throw new RangeError('Sweep voltage must be 0–3 V');
  const effective = index === 0 ? 10 : index === 1 ? 20 : 8 + 2 * voltage;
  const current = voltage / effective;
  return {
    voltage,
    current,
    resistance: voltage === 0 ? null : effective,
    power: voltage * current,
  };
}
export function ohmSweep(index: number) {
  checkCase(index);
  return [1, 2, 3].map((voltage) => ohmReading(index, voltage));
}
export const powerCases = [
  { voltage: 3, seconds: 10 },
  { voltage: 6, seconds: 10 },
  { voltage: 3, seconds: 20 },
] as const;
export function electricPower(voltage: number, seconds: number, progress = 1) {
  finite(voltage, seconds);
  inspection(progress);
  if (voltage < 0 || seconds <= 0)
    throw new RangeError('Invalid power experiment');
  const m = dcCircuit(
    { voltage, topology: 'series', resistance: [10], branchClosed: [true] },
    seconds,
  );
  return {
    voltage,
    seconds,
    current: m.sourceCurrent,
    power: m.sourcePower,
    energy: m.energy * progress,
    fullEnergy: m.energy,
    elapsed: seconds * progress,
    wattHours: m.energy / 3600,
  };
}
/** Prospective DC fault calculation, then ideal threshold isolation; not a fuse time simulation. */
export function faultCircuit(index: number) {
  checkCase(index);
  const resistances =
    index === 0 ? [10, 10] : index === 1 ? [10, 10, 10, 10] : [10, 10, 0.2];
  const equivalent = 1 / resistances.reduce((g, r) => g + 1 / r, 0),
    sourceResistance = 0.5;
  const prospectiveCurrent = 3 / (sourceResistance + equivalent),
    terminalVoltage = 3 - prospectiveCurrent * sourceResistance;
  const branchCurrents = resistances.map((r) => terminalVoltage / r),
    loadPowers = resistances.map((r, i) => branchCurrents[i]! ** 2 * r);
  const threshold = 0.8,
    isolated = prospectiveCurrent > threshold;
  return {
    resistances,
    equivalent,
    sourceResistance,
    prospectiveCurrent,
    terminalVoltage,
    branchCurrents,
    loadPowers,
    sourcePower: 3 * prospectiveCurrent,
    internalPower: prospectiveCurrent ** 2 * sourceResistance,
    threshold,
    isolated,
    protectedCurrent: isolated ? 0 : prospectiveCurrent,
  };
}
