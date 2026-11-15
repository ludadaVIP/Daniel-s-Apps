/** Original teaching models. Amounts are not measurements or physiological predictions. */
const nonnegative = (...values: number[]) => {
  if (values.some((value) => !Number.isFinite(value) || value < 0))
    throw new Error('Finite non-negative values required');
};
export const dnaComplement = (strand: string) => {
  if (!/^[ATGC]*$/.test(strand)) throw new Error('Use DNA bases A T G C');
  return [...strand]
    .map((base) => ({ A: 'T', T: 'A', G: 'C', C: 'G' })[base])
    .join('');
};
/** Input template is written 3′→5′, output RNA 5′→3′. */
export const transcribe = (template: string) =>
  dnaComplement(template).replaceAll('T', 'U');
export const codingDna = 'ATGGCTTTTGGATAA';
export const templateDna = dnaComplement(codingDna);
export const teachingRna = transcribe(templateDna);
const code: Record<string, string> = {
  AUG: 'Met',
  GCU: 'Ala',
  GCC: 'Ala',
  UUU: 'Phe',
  UUC: 'Phe',
  GGA: 'Gly',
  UAA: 'STOP',
  UAG: 'STOP',
  UGA: 'STOP',
};
/** Restricted verified codon set: assumes an already selected initiation site/frame, not a start-site finder. */
export function translate(rna: string) {
  if (!/^[AUCG]*$/.test(rna) || rna.length % 3)
    throw new Error('Complete RNA codons required');
  const codons = rna.match(/.{3}/g) ?? [];
  const aminoAcids: string[] = [];
  for (const codon of codons) {
    if (!(codon in code)) throw new Error('Codon outside teaching set');
    if (code[codon] === 'STOP') break;
    aminoAcids.push(code[codon]!);
  }
  return { codons, aminoAcids };
}
export const anticodon = (codon: string) => {
  if (!/^[AUCG]{3}$/.test(codon)) throw new Error('RNA triplet required');
  if (['UAA', 'UAG', 'UGA'].includes(codon)) return null;
  return [...codon]
    .map((base) => ({ A: 'U', U: 'A', G: 'C', C: 'G' })[base])
    .join('');
};
/** n is completed rounds; no degradation, mutation or incomplete replication. */
export function replication(rounds: number) {
  nonnegative(rounds);
  const n = Math.max(0, Math.min(8, Math.floor(rounds)));
  return {
    molecules: 2 ** n,
    oldStrands: 2,
    newStrands: 2 * 2 ** n - 2,
    hybridMolecules: n ? 2 : 0,
  };
}
/** Per invented 1-min step: RNA + transcription - 0.5 RNA; protein + k RNA - 0.25 protein. */
export function expression(
  transcription: number,
  translation: number,
  steps = 5,
) {
  nonnegative(transcription, translation, steps);
  if (
    transcription > 4 ||
    translation > 0.5 ||
    !Number.isInteger(steps) ||
    steps > 20
  )
    throw new Error('Outside teaching-model bounds');
  const rows = [{ minute: 0, rna: 0, protein: 0 }];
  for (let minute = 1; minute <= Math.min(20, Math.max(0, steps)); minute++) {
    const previous = rows[rows.length - 1]!;
    rows.push({
      minute,
      rna: previous.rna * 0.5 + transcription,
      protein: previous.protein * 0.75 + translation * previous.rna,
    });
  }
  return rows;
}
/** Given conditional ΔG values in kJ mol−1; negative total alone does not establish physical coupling. */
export function coupling(work: number, hydrolysis: number, shared: boolean) {
  if (
    ![work, hydrolysis, work + hydrolysis].every(Number.isFinite) ||
    work < 0 ||
    hydrolysis > 0
  )
    throw new Error('Finite conditional energies required');
  return {
    total: work + hydrolysis,
    canDrive: shared && work + hydrolysis < 0,
  };
}
/** Per glucose. Aerobic ledger idealises complete oxidation; oxygen-off switches to lactate fermentation. */
export function respiration(oxygen: boolean) {
  return oxygen
    ? {
        inputCarbon: 6,
        productCarbon: 6,
        co2: 6,
        lactate: 0,
        glycolysisAtp: 2,
        cycleAtp: 2,
        oxidativeAtp: 26,
        totalAtp: 30,
        electronPairs: 12,
        oxygen: 6,
      }
    : {
        inputCarbon: 6,
        productCarbon: 6,
        co2: 0,
        lactate: 2,
        glycolysisAtp: 2,
        cycleAtp: 0,
        oxidativeAtp: 0,
        totalAtp: 2,
        electronPairs: 0,
        oxygen: 0,
      };
}
/** Ideal Calvin budget: each net G3P requires 3 CO2, 9 ATP, 6 NADPH. Amounts in μmol; continuous equivalents. */
export function carbonBudget(co2: number, atp: number, nadph: number) {
  nonnegative(co2, atp, nadph);
  const g3p = Math.max(0, Math.min(co2 / 3, atp / 9, nadph / 6));
  return {
    g3p,
    fixedCarbon: 3 * g3p,
    remainingAtp: atp - 9 * g3p,
    remainingNadph: nadph - 6 * g3p,
  };
}
/** Fictional flux in μmol min−1; S,P in μmol L−1; response scales 2 and 4, maximum flux 12. */
export function feedbackFlux(
  substrate: number,
  product: number,
  sensitive: boolean,
) {
  nonnegative(substrate, product);
  const s = Math.max(0, substrate),
    p = Math.max(0, product);
  return (12 * (s / (2 + s))) / (sensitive ? 1 + p / 4 : 1);
}
