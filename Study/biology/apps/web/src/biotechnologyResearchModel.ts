/** All numerical material is an original, fictional teaching model, not a lab protocol. */
export function pcrCopies(initial: number, cycles: number, efficiency = 1) {
  if (
    !Number.isInteger(initial) ||
    initial < 0 ||
    !Number.isInteger(cycles) ||
    cycles < 0 ||
    cycles > 20 ||
    !Number.isFinite(efficiency) ||
    efficiency < 0 ||
    efficiency > 1
  )
    throw new RangeError('Invalid conceptual PCR input');
  return initial * (1 + efficiency) ** cycles;
}
export type PcrCase = 'clean' | 'contaminated' | 'inhibited';
export function pcrEvidence(
  initial: number,
  cycles: number,
  efficiency: number,
  scenario: PcrCase,
) {
  // Validate the requested inputs even when inhibition overrides efficiency.
  pcrCopies(initial, cycles, efficiency);
  const effectiveEfficiency = scenario === 'inhibited' ? 0 : efficiency;
  const blank =
    scenario === 'contaminated' ? pcrCopies(1, cycles, effectiveEfficiency) : 0;
  const positive = pcrCopies(2, cycles, effectiveEfficiency);
  const sample = pcrCopies(initial, cycles, effectiveEfficiency);
  const positiveAdded = positive - 2;
  const positiveAmplified = cycles > 0 && positiveAdded > 0;
  // Copies are conserved when copying is inhibited. Control validity is separate
  // from existing copies and is not a modeled detector or detection probability.
  const controlsValid = blank === 0 && positiveAmplified;
  return {
    blank,
    positive,
    sample,
    positiveAdded,
    positiveAmplified,
    controlsValid,
    interpretable: controlsValid,
  };
}
/** Schematic migration coordinate; NOT a calibrated physical distance. */
export function gelPosition(bp: number) {
  if (!Number.isFinite(bp) || bp < 100 || bp > 1600)
    throw new RangeError('Marker range is 100–1600 bp');
  return 90 + (170 * Math.log2(1600 / bp)) / 4;
}
export const editingOutcomes = {
  intended: 12,
  otherRepair: 5,
  unchanged: 3,
  assessed: 20,
  unassessed: 80,
};
export function editingEvidence() {
  return {
    sampleFraction: editingOutcomes.intended / editingOutcomes.assessed,
    checkedFraction:
      editingOutcomes.assessed /
      (editingOutcomes.assessed + editingOutcomes.unassessed),
  };
}
export type Observation = {
  site: string;
  day: number;
  count: number | null;
  minutes: number;
};
export const researchObservations: Observation[] = [
  { site: 'A', day: 1, count: 2, minutes: 5 },
  { site: 'A', day: 3, count: 4, minutes: 5 },
  { site: 'A', day: 7, count: null, minutes: 0 },
  { site: 'A', day: 10, count: 0, minutes: 5 },
  { site: 'B', day: 1, count: 4, minutes: 5 },
  { site: 'B', day: 3, count: 6, minutes: 5 },
  { site: 'B', day: 7, count: 8, minutes: 10 },
  { site: 'B', day: 10, count: 2, minutes: 5 },
];
export function summarise(values: (number | null)[]) {
  const observed = values.filter(
    (v): v is number => v !== null && Number.isFinite(v),
  );
  if (!observed.length)
    return {
      n: 0,
      missing: values.length,
      mean: null,
      min: null,
      max: null,
      range: null,
    };
  const min = Math.min(...observed),
    max = Math.max(...observed);
  return {
    n: observed.length,
    missing: values.length - observed.length,
    mean: observed.reduce((a, b) => a + b, 0) / observed.length,
    min,
    max,
    range: max - min,
  };
}
export function eligibleObservations(site: string, equalEffort: boolean) {
  return researchObservations.filter(
    (r) => r.site === site && (!equalEffort || r.minutes === 5),
  );
}
export function pairedDifferences() {
  return researchObservations
    .filter((a) => a.site === 'A' && a.count !== null && a.minutes === 5)
    .flatMap((a) => {
      const b = researchObservations.find(
        (b) =>
          b.site === 'B' &&
          b.day === a.day &&
          b.minutes === 5 &&
          b.count !== null,
      );
      return b && b.count !== null && a.count !== null
        ? [{ day: a.day, difference: b.count - a.count }]
        : [];
    });
}
export function talkMinutes(words: number, wordsPerMinute: number) {
  if (
    !Number.isFinite(words) ||
    words < 0 ||
    !Number.isFinite(wordsPerMinute) ||
    wordsPerMinute <= 0
  )
    return null;
  return words / wordsPerMinute;
}
