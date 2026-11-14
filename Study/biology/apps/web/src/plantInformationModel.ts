/** Original qualitative teaching models, not measurements or predictions for real plants. */
export type TransportSeason = 'leaf-source' | 'store-source';
export function transportRoutes(season: TransportSeason) {
  return {
    xylem: ['root', 'leaf'],
    phloem:
      season === 'leaf-source'
        ? [
            ['leaf', 'root'],
            ['leaf', 'shoot'],
          ]
        : [
            ['store', 'shoot'],
            ['leaf', 'shoot'],
          ],
  };
}
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
export function transpiration(
  humidity: number,
  wind: number,
  temperature: number,
  light: number,
  closed: boolean,
) {
  const gradient =
    (1 - clamp(humidity, 0, 100) / 100) *
    (1 + (clamp(temperature, 10, 40) - 20) / 40);
  const aperture = closed ? 0.05 : 0.2 + (0.8 * clamp(light, 0, 100)) / 100;
  const rate =
    Math.round(100 * gradient * (1 + clamp(wind, 0, 3) / 3) * aperture) / 10;
  return {
    rate,
    uptake: Math.round((rate + 0.4) * 10) / 10,
    aperture,
    gradient,
  };
}
export function photosynthesis(light: number, carbon: number) {
  return Math.min(clamp(light, 0, 100), clamp(carbon, 0, 100), 80);
}
export type Base = 'A' | 'T' | 'G' | 'C';
export const complement = (sequence: string) => {
  if (!/^[ATGC]+$/.test(sequence))
    throw new Error('DNA fragment must contain only A, T, G, C.');
  return sequence
    .split('')
    .map((b) => ({ A: 'T', T: 'A', G: 'C', C: 'G' })[b])
    .join('');
};
export function dnaCounts(sequence: string) {
  if (!/^[ATGC]+$/.test(sequence))
    throw new Error('DNA fragment must contain only A, T, G, C.');
  const double = sequence + complement(sequence);
  return Object.fromEntries(
    ['A', 'T', 'G', 'C'].map((base) => [base, double.split(base).length - 1]),
  ) as Record<Base, number>;
}
export type DivisionKind = 'mitosis' | 'meiosis';
/** Counts are PER CELL at completed checkpoints, never during anaphase. C is haploid DNA amount. */
export function divisionCheckpoint(kind: DivisionKind, step: number) {
  const s = clamp(Math.trunc(step), 0, 3);
  if (s === 0)
    return { cells: 1, sets: 2, chromosomes: 4, chromatids: 4, dna: 2 };
  if (s === 1)
    return { cells: 1, sets: 2, chromosomes: 4, chromatids: 8, dna: 4 };
  if (kind === 'mitosis')
    return { cells: 2, sets: 2, chromosomes: 4, chromatids: 4, dna: 2 };
  if (s === 2)
    return { cells: 2, sets: 1, chromosomes: 2, chromatids: 4, dna: 2 };
  return { cells: 4, sets: 1, chromosomes: 2, chromatids: 2, dna: 1 };
}
/** Fictional plant size: baseline + allele contributions + environment + G×E. Not a human model. */
export function plantTrait(alleles: number, environment: number) {
  const g = clamp(Math.trunc(alleles), 0, 6),
    e = clamp(environment, 0, 2);
  return 10 + 2 * g + 3 * e + g * e;
}
export function traitDistribution(environment: number) {
  return [1, 6, 15, 20, 15, 6, 1].map((count, g) => ({
    size: plantTrait(g, environment),
    count,
    alleles: g,
  }));
}
