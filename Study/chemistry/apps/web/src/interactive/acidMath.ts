// Introductory concentration-based models at 25 °C, not product predictions.
const WATER_ION_PRODUCT = 1e-14;
const ETHANOIC_ACID_KA = 1.8e-5;

export function strongAcidHydronium(concentration: number): number {
  if (!Number.isFinite(concentration) || concentration < 0) {
    throw new RangeError('Concentration must be finite and non-negative');
  }
  // H − OH = c and H × OH = Kw. Includes water near neutrality.
  return (
    (concentration + Math.sqrt(concentration ** 2 + 4 * WATER_ION_PRODUCT)) / 2
  );
}

export function ethanoicAcidHydronium(concentration: number): number {
  if (
    !Number.isFinite(concentration) ||
    concentration < 0.001 ||
    concentration > 0.1
  ) {
    throw new RangeError('Ethanoic-acid model supports 0.001–0.1 mol/L');
  }
  // Ka = x²/(c − x); water contribution is negligible in this supported range.
  // Rationalised positive root avoids subtracting similar numbers.
  const ka = ETHANOIC_ACID_KA;
  return (
    (2 * ka * concentration) /
    (Math.sqrt(ka ** 2 + 4 * ka * concentration) + ka)
  );
}

export function phFromHydronium(hydronium: number): number {
  if (!Number.isFinite(hydronium) || hydronium <= 0) {
    throw new RangeError('Hydronium concentration must be finite and positive');
  }
  return -Math.log10(hydronium);
}
