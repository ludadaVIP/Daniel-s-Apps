const finite = (...values: number[]) => {
  if (!values.every(Number.isFinite))
    throw new RangeError('Finite electrical values required');
};
const progressCheck = (p: number) => {
  finite(p);
  if (p < 0 || p > 1) throw new RangeError('Progress must be 0–1');
};
/** Schematic charge units, not the actual number of charges on macroscopic objects. */
export function chargeTransfer(transfer: number, progress = 1) {
  progressCheck(progress);
  if (!Number.isInteger(transfer) || Math.abs(transfer) > 4)
    throw new RangeError('Transfer must be an integer from −4 to 4');
  const n = Math.abs(transfer),
    completed = Math.min(n, Math.floor(n * progress + 1e-9)),
    fraction = Math.max(0, n * progress - completed),
    inFlight = fraction > 1e-9 && completed < n ? 1 : 0;
  const donor = 8 - completed - inFlight,
    receiver = 8 + completed,
    electronsA = transfer >= 0 ? receiver : donor,
    electronsB = transfer >= 0 ? donor : receiver;
  return {
    electronsA,
    electronsB,
    protonsA: 8,
    protonsB: 8,
    chargeA: 8 - electronsA,
    chargeB: 8 - electronsB,
    transitCharge: -inFlight,
    totalCharge: 16 - electronsA - electronsB - inFlight,
    totalElectrons: electronsA + electronsB + inFlight,
    inFlight,
    fraction,
    completed,
    transfer,
  };
}
export const chargeCases = [0, 4, -4] as const;
/** Held objects; qualitative interaction only, with an explicitly polarizable neutral partner. */
export function chargeInteraction(partner: number) {
  if (!Number.isInteger(partner) || Math.abs(partner) > 4)
    throw new RangeError('Invalid partner charge');
  return {
    chargeA: -4,
    chargeB: partner,
    polarized: partner === 0,
    action: partner < 0 ? ('repel' as const) : ('attract' as const),
  };
}
export const interactionCases = [-4, 4, 0] as const;
export const currentCases = [
  { charge: 1, seconds: 2 },
  { charge: 2, seconds: 2 },
  { charge: 2, seconds: 4 },
] as const;
/** Complete-window average; the on-screen packet counter is discrete and pedagogical. */
export function currentWindow(charge: number, seconds: number, progress = 1) {
  finite(charge, seconds);
  progressCheck(progress);
  if (charge <= 0 || seconds <= 0 || charge > 10 || seconds > 60)
    throw new RangeError('Invalid counting window');
  const packets = Math.max(1, Math.round(charge / 0.25)),
    passed = Math.min(packets, Math.floor(packets * progress + 1e-9));
  return {
    charge,
    seconds,
    current: charge / seconds,
    packets,
    passed,
    countedCharge: (passed * charge) / packets,
    elapsed: seconds * progress,
  };
}
export type CircuitConfig = {
  voltage: number;
  topology: 'series' | 'parallel';
  resistance: number[];
  branchClosed: boolean[];
  mainClosed?: boolean;
  returnConnected?: boolean;
};
/** Ideal fixed DC voltage, ideal wires, constant resistive loads; no transient/filament heating model. */
export function dcCircuit(c: CircuitConfig, seconds = 2) {
  finite(c.voltage, seconds, ...c.resistance);
  if (
    seconds <= 0 ||
    c.resistance.length < 1 ||
    c.resistance.length > 4 ||
    c.resistance.some((r) => r <= 0) ||
    c.branchClosed.length !== c.resistance.length ||
    c.branchClosed.some((b) => typeof b !== 'boolean') ||
    !['series', 'parallel'].includes(c.topology) ||
    (c.mainClosed !== undefined && typeof c.mainClosed !== 'boolean') ||
    (c.returnConnected !== undefined && typeof c.returnConnected !== 'boolean')
  )
    throw new RangeError('Invalid circuit');
  const supplied = c.mainClosed !== false && c.returnConnected !== false;
  const complete =
    supplied &&
    (c.topology === 'series'
      ? c.branchClosed.every(Boolean)
      : c.branchClosed.some(Boolean));
  const equivalentResistance =
    c.topology === 'series'
      ? complete
        ? c.resistance.reduce((a, b) => a + b, 0)
        : null
      : complete
        ? 1 /
          c.resistance.reduce(
            (a, r, i) => a + (c.branchClosed[i] ? 1 / r : 0),
            0,
          )
        : null;
  const sourceCurrent =
    equivalentResistance === null ? 0 : c.voltage / equivalentResistance;
  const currents = c.resistance.map((r, i) =>
    !complete || !c.branchClosed[i]
      ? 0
      : c.topology === 'series'
        ? sourceCurrent
        : c.voltage / r,
  );
  const voltages = c.resistance.map((r, i) =>
    complete && c.branchClosed[i]
      ? c.topology === 'series'
        ? currents[i]! * r
        : c.voltage
      : null,
  );
  const powers = currents.map((i, j) => i * i * c.resistance[j]!),
    sourcePower = c.voltage * sourceCurrent,
    energy = sourcePower * seconds,
    loadEnergies = powers.map((p) => p * seconds),
    sourceCharge = Math.abs(sourceCurrent) * seconds,
    loadCharges = currents.map((i) => Math.abs(i) * seconds);
  finite(
    sourceCurrent,
    ...currents,
    ...powers,
    sourcePower,
    energy,
    ...loadEnergies,
    sourceCharge,
    ...loadCharges,
  );
  if (equivalentResistance !== null) finite(equivalentResistance);
  return {
    complete,
    voltage: c.voltage,
    equivalentResistance,
    sourceCurrent,
    currents,
    voltages,
    powers,
    sourcePower,
    energy,
    loadEnergies,
    sourceCharge,
    loadCharges,
    seconds,
  };
}
export function lampTransfers(energy: number, lightFraction: number) {
  finite(energy, lightFraction);
  if (energy < 0 || lightFraction < 0 || lightFraction > 1)
    throw new RangeError('Invalid lamp energy share');
  return {
    light: energy * lightFraction,
    thermal: energy * (1 - lightFraction),
    total: energy,
  };
}
export const lampCases = [0.1, 0.3, 0.6] as const;
export type ElectricKind =
  | 'charge'
  | 'interaction'
  | 'current'
  | 'circuit'
  | 'battery'
  | 'lamp'
  | 'switch'
  | 'materials'
  | 'series'
  | 'parallel';
export type CircuitCase = CircuitConfig & {
  switchPosition: 'supply' | 'return';
  material?: 'metal' | 'plastic' | 'gap';
  cells?: number;
  lightFraction?: number;
};
const base: CircuitCase = {
  voltage: 3,
  topology: 'series',
  resistance: [10],
  branchClosed: [true],
  mainClosed: true,
  returnConnected: true,
  switchPosition: 'supply',
};
export function electricCircuitCase(
  kind: ElectricKind,
  index: number,
): CircuitCase {
  if (!Number.isInteger(index) || index < 0 || index > 2)
    throw new RangeError('Invalid comparison');
  const c = {
    ...base,
    resistance: [...base.resistance],
    branchClosed: [...base.branchClosed],
  };
  if (kind === 'circuit')
    return { ...c, mainClosed: index !== 1, returnConnected: index !== 2 };
  if (kind === 'battery')
    return {
      ...c,
      voltage: [1.5, 3, -1.5][index]!,
      cells: index === 1 ? 2 : 1,
    };
  if (kind === 'lamp') return { ...c, lightFraction: lampCases[index] };
  if (kind === 'switch')
    return {
      ...c,
      mainClosed: index === 0,
      switchPosition: index === 2 ? 'return' : 'supply',
    };
  if (kind === 'materials')
    return {
      ...c,
      mainClosed: index === 0,
      material: (['metal', 'plastic', 'gap'] as const)[index],
    };
  if (kind === 'series')
    return {
      ...c,
      resistance: index === 0 ? [10] : [10, 10],
      branchClosed:
        index === 2 ? [true, false] : index === 0 ? [true] : [true, true],
    };
  if (kind === 'parallel')
    return {
      ...c,
      topology: 'parallel',
      resistance: index === 2 ? [10, 20] : [10, 10],
      branchClosed: index === 1 ? [true, false] : [true, true],
    };
  throw new RangeError('This station has no circuit case');
}
/** A position marker along a schematic polyline; never interpreted as electron drift speed. */
export function circuitPoint(
  points: readonly (readonly [number, number])[],
  phase: number,
) {
  finite(phase);
  if (
    points.length < 2 ||
    points.some((p) => p.length !== 2 || !p.every(Number.isFinite))
  )
    throw new RangeError('Invalid flow path');
  const lengths = points
      .slice(1)
      .map((p, i) => Math.hypot(p[0] - points[i]![0], p[1] - points[i]![1])),
    total = lengths.reduce((a, b) => a + b, 0);
  if (!Number.isFinite(total) || total <= 0)
    throw new RangeError('Invalid path length');
  let distance = (((phase % 1) + 1) % 1) * total;
  for (let i = 0; i < lengths.length; i++) {
    const length = lengths[i]!;
    if (distance <= length && length > 0) {
      const p = points[i]!,
        next = points[i + 1]!;
      return {
        x: p[0] + ((next[0] - p[0]) * distance) / length,
        y: p[1] + ((next[1] - p[1]) * distance) / length,
      };
    }
    distance -= length;
  }
  return { x: points[0]![0], y: points[0]![1] };
}
