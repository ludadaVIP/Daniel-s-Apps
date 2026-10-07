/** Rounded school molar masses; ideal complete conversion, no side reactions. */
export function waterRecipe(hydrogen: number, oxygen: number) {
  if (![hydrogen, oxygen].every((n) => Number.isFinite(n) && n >= 0))
    throw new RangeError('Amounts must be finite and nonnegative');
  const batches = Math.min(hydrogen / 2, oxygen);
  const water = batches * 2;
  const remainingHydrogen = hydrogen - water;
  const remainingOxygen = oxygen - batches;
  return {
    batches,
    water,
    remainingHydrogen,
    remainingOxygen,
    limiting:
      hydrogen / 2 === oxygen
        ? 'both'
        : hydrogen / 2 < oxygen
          ? 'hydrogen'
          : 'oxygen',
    waterMass: water * 18,
    initialMass: hydrogen * 2 + oxygen * 32,
    remainingMass: remainingHydrogen * 2 + remainingOxygen * 32,
  };
}

export function limeYield(
  feedMass: number,
  pureProductMass: number,
  impurityMass = 0,
) {
  if (
    ![feedMass, pureProductMass, impurityMass].every(
      (n) => Number.isFinite(n) && n >= 0,
    ) ||
    feedMass === 0
  )
    throw new RangeError(
      'Positive feed and finite nonnegative masses required',
    );
  const theoreticalMass = (feedMass / 100) * 56;
  return {
    theoreticalMass,
    actualPercent: (pureProductMass / theoreticalMass) * 100,
    apparentPercent: ((pureProductMass + impurityMass) / theoreticalMass) * 100,
    sampleMass: pureProductMass + impurityMass,
  };
}
