export type ElementMass = { symbol: string; atomicMass: number; massG: number };
export type EmpiricalResult = {
  moles: number[];
  normalised: number[];
  multiplier: number;
  counts: number[];
  formula: string;
  formulaMass: number;
};

export function formulaText(
  symbols: readonly string[],
  counts: readonly number[],
) {
  const digits = '₀₁₂₃₄₅₆₇₈₉';
  return symbols
    .map(
      (symbol, i) =>
        symbol +
        (counts[i] === 1
          ? ''
          : String(counts[i])
              .split('')
              .map((digit) => digits[Number(digit)])
              .join('')),
    )
    .join('');
}

/** Introductory ratios only: never force unsupported data into an integer formula. */
export function empiricalFromMasses(
  elements: readonly ElementMass[],
): EmpiricalResult | null {
  if (
    elements.length < 2 ||
    new Set(elements.map((e) => e.symbol)).size !== elements.length ||
    elements.some(
      (e) =>
        !/^[A-Z][a-z]?$/.test(e.symbol) ||
        !Number.isFinite(e.atomicMass) ||
        e.atomicMass <= 0 ||
        !Number.isFinite(e.massG) ||
        e.massG <= 0,
    )
  )
    throw new RangeError(
      'Use distinct element symbols, positive masses and atomic masses.',
    );
  const moles = elements.map((e) => e.massG / e.atomicMass);
  const minimum = Math.min(...moles);
  const normalised = moles.map((n) => n / minimum);
  for (let multiplier = 1; multiplier <= 6; multiplier++) {
    const scaled = normalised.map((ratio) => ratio * multiplier);
    const counts = scaled.map(Math.round);
    if (
      scaled.every(
        (value, i) =>
          Math.abs(value - counts[i]!) <= 0.02 + Number.EPSILON * 10,
      )
    ) {
      return {
        moles,
        normalised,
        multiplier,
        counts,
        formula: formulaText(
          elements.map((e) => e.symbol),
          counts,
        ),
        formulaMass: counts.reduce(
          (total, count, i) => total + count * elements[i]!.atomicMass,
          0,
        ),
      };
    }
  }
  return null;
}

export function molecularFromEmpirical(
  elements: readonly ElementMass[],
  empirical: EmpiricalResult,
  molarMass: number,
) {
  if (!Number.isFinite(molarMass) || molarMass <= 0)
    throw new RangeError('Use a positive finite molecular molar mass.');
  const ratio = molarMass / empirical.formulaMass;
  const multiplier = Math.round(ratio);
  if (multiplier < 1 || Math.abs(ratio - multiplier) > 0.02) return null;
  const counts = empirical.counts.map((count) => count * multiplier);
  return {
    multiplier,
    counts,
    formula: formulaText(
      elements.map((e) => e.symbol),
      counts,
    ),
  };
}

/** Authored pure-sample records; atomic masses rounded for school arithmetic. */
export const compositionSamples = [
  {
    elements: [
      { symbol: 'C', atomicMass: 12, massG: 12 },
      { symbol: 'H', atomicMass: 1, massG: 2 },
      { symbol: 'O', atomicMass: 16, massG: 16 },
    ],
    molarMass: 180,
    choices: ['CH₂O', 'C₆H₁₂O₆', 'C₁₂H₂O₁₆'],
    correct: 0,
  },
  {
    elements: [
      { symbol: 'C', atomicMass: 12, massG: 6 },
      { symbol: 'H', atomicMass: 1, massG: 1 },
      { symbol: 'O', atomicMass: 16, massG: 8 },
    ],
    molarMass: 60,
    choices: ['C₆HO₈', 'CH₂O', 'C₂H₄O₂'],
    correct: 1,
  },
  {
    elements: [
      { symbol: 'Fe', atomicMass: 56, massG: 11.2 },
      { symbol: 'O', atomicMass: 16, massG: 4.8 },
    ],
    molarMass: null,
    choices: ['FeO', 'FeO₂', 'Fe₂O₃'],
    correct: 2,
  },
] as const;

export const copperSulfateMass = 159.5; // g/mol, Cu 63.5, S 32, O 16
export const waterMolarMass = 18; // g/mol, H 1, O 16
export type HydrateRecord = {
  salt: string;
  saltMolarMass: number;
  tareG: number;
  totalsG: readonly number[];
  knownSolidLossAt: number | null;
};
/** Repeated cooled readings, not a heating simulation or a home-lab procedure. */
export const hydrateRecords: readonly HydrateRecord[] = [
  {
    salt: 'CuSO₄',
    saltMolarMass: copperSulfateMass,
    tareG: 14,
    totalsG: [18.99, 17.55, 17.19, 17.19],
    knownSolidLossAt: null,
  },
  {
    salt: 'CuSO₄',
    saltMolarMass: copperSulfateMass,
    tareG: 14,
    totalsG: [18.99, 17.55, 16.87, 16.87],
    knownSolidLossAt: 2,
  },
  {
    salt: 'MgSO₄',
    saltMolarMass: 120,
    tareG: 14,
    totalsG: [18.92, 16.7, 16.4, 16.4],
    knownSolidLossAt: null,
  },
];

export function hydrateLedger(record: HydrateRecord, stage: number) {
  if (
    !Number.isInteger(stage) ||
    stage < 0 ||
    stage >= record.totalsG.length ||
    !Number.isFinite(record.tareG) ||
    record.tareG < 0 ||
    !Number.isFinite(record.saltMolarMass) ||
    record.saltMolarMass <= 0 ||
    record.totalsG.some(
      (total) => !Number.isFinite(total) || total <= record.tareG,
    )
  )
    throw new RangeError('Use a supported stage and positive sample readings.');
  const initialSampleG = record.totalsG[0]! - record.tareG;
  const remainingSampleG = record.totalsG[stage]! - record.tareG;
  const lostG = initialSampleG - remainingSampleG;
  const stable =
    stage >= 2 &&
    Math.abs(record.totalsG[stage]! - record.totalsG[stage - 1]!) < 0.005;
  const knownSolidLoss =
    record.knownSolidLossAt !== null && stage >= record.knownSolidLossAt;
  const ready = stable && !knownSolidLoss;
  // Intact records stipulate the named anhydrous salt, with no decomposition.
  const saltMol = ready ? remainingSampleG / record.saltMolarMass : null;
  const waterMol = ready ? lostG / waterMolarMass : null;
  return {
    initialSampleG,
    remainingSampleG,
    lostG,
    stable,
    knownSolidLoss,
    ready,
    saltMol,
    waterMol,
    ratio: ready ? waterMol! / saltMol! : null,
  };
}
