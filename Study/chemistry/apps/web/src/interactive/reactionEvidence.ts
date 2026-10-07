export const rateTimes = [0, 10, 20, 30, 40, 60, 90] as const;
// Authored teaching records, not measured experiments or a fitted rate law.
export const rateTrials = [
  {
    id: 'A',
    concentration: 0.5,
    temperature: 20,
    powdered: false,
    gas: [0, 8, 15, 21, 26, 34, 40],
  },
  {
    id: 'B',
    concentration: 1,
    temperature: 20,
    powdered: false,
    gas: [0, 14, 25, 33, 38, 40, 40],
  },
  {
    id: 'C',
    concentration: 0.5,
    temperature: 40,
    powdered: true,
    gas: [0, 25, 36, 40, 40, 40, 40],
  },
  {
    id: 'D',
    concentration: 0.5,
    temperature: 40,
    powdered: false,
    gas: [0, 16, 28, 35, 39, 40, 40],
  },
] as const;
export type RateTrial = (typeof rateTrials)[number];
export type RateVariable = 'concentration' | 'temperature' | 'surface';

export function changedRateVariables(
  a: RateTrial,
  b: RateTrial,
): RateVariable[] {
  const changed: RateVariable[] = [];
  if (a.concentration !== b.concentration) changed.push('concentration');
  if (a.temperature !== b.temperature) changed.push('temperature');
  if (a.powdered !== b.powdered) changed.push('surface');
  return changed;
}

export function averageGasRate(
  trial: RateTrial,
  start: number,
  end: number,
): number {
  const startIndex = rateTimes.findIndex((time) => time === start);
  const endIndex = rateTimes.findIndex((time) => time === end);
  const startVolume = trial.gas[startIndex];
  const endVolume = trial.gas[endIndex];
  if (end <= start || startVolume === undefined || endVolume === undefined) {
    throw new RangeError('Choose an increasing interval with recorded times');
  }
  return (endVolume - startVolume) / (end - start);
}

export type EquilibriumChange = 'compress' | 'warm' | 'catalyst' | 'add-a';
export type EquilibriumState = {
  dimer: number;
  monomer: number;
  volume: number;
  kForward: number;
  kReverse: number;
};
// Fictional A₂ ⇌ 2A: quantities/volume/time are relative teaching units.
export const initialEquilibrium: EquilibriumState = {
  dimer: 2,
  monomer: 2,
  volume: 1,
  kForward: 2,
  kReverse: 1,
};

export function disturbedEquilibrium(
  change: EquilibriumChange,
): EquilibriumState {
  const state = { ...initialEquilibrium };
  if (change === 'compress') state.volume = 0.5;
  if (change === 'warm') {
    state.kForward = 8;
    state.kReverse = 2;
  }
  if (change === 'catalyst') {
    state.kForward *= 3;
    state.kReverse *= 3;
  }
  if (change === 'add-a') state.monomer += 2;
  return state;
}

export function equilibriumFlows(state: EquilibriumState) {
  return {
    forward: state.kForward * state.dimer,
    reverse: (state.kReverse * state.monomer ** 2) / state.volume,
  };
}

export function equilibrate(state: EquilibriumState): EquilibriumState {
  const atoms = 2 * state.dimer + state.monomer;
  const q = (state.kForward / state.kReverse) * state.volume;
  // From y² / (V × (N − y)/2) = kForward/kReverse; positive root.
  const monomer = (2 * q * atoms) / (Math.sqrt(q ** 2 + 8 * q * atoms) + q);
  return { ...state, monomer, dimer: (atoms - monomer) / 2 };
}
