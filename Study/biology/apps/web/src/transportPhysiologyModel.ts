/** Original classroom models: outputs illustrate stated mechanisms, not patient predictions. */
export type Molecule = 'oxygen' | 'ion' | 'glucose';
export function membranePassage(molecule: Molecule, matchingProtein: boolean) {
  return {
    passes: molecule === 'oxygen' || matchingProtein,
    proteinRequired: molecule !== 'oxygen',
    route:
      molecule === 'oxygen' ? 'lipid' : matchingProtein ? 'protein' : 'blocked',
  };
}
export function diffusionStep(left: number, right: number, permeable = true) {
  if (![left, right].every((n) => Number.isFinite(n) && n >= 0))
    throw new RangeError('Non-negative finite amounts required');
  const forward = permeable ? left / 4 : 0;
  const reverse = permeable ? right / 4 : 0;
  return {
    left: left - forward + reverse,
    right: right + forward - reverse,
    forward,
    reverse,
    net: forward - reverse,
  };
}
export function diffusionSeries(
  left: number,
  right: number,
  permeable = true,
  steps = 4,
) {
  const rows = [{ left, right, forward: 0, reverse: 0, net: 0 }];
  for (let i = 0; i < steps; i++)
    rows.push(diffusionStep(rows[i]!.left, rows[i]!.right, permeable));
  return rows;
}
export type CellKind = 'plant' | 'animal';
export function osmosisResponse(
  outsideMPa: number,
  insideMPa: number,
  cell: CellKind,
) {
  if (![outsideMPa, insideMPa].every(Number.isFinite))
    throw new RangeError('Finite total water potentials required');
  const direction =
    outsideMPa > insideMPa ? 'in' : outsideMPa < insideMPa ? 'out' : 'balanced';
  const outcome =
    direction === 'balanced'
      ? 'balanced'
      : cell === 'plant'
        ? direction === 'in'
          ? 'turgor-rising'
          : 'water-loss'
        : direction === 'in'
          ? 'swelling'
          : 'shrinking';
  return { direction, outcome } as const;
}
/** Relative diffusive capacity A*gradient/d, fixed permeability; active uptake separate. */
export function exchangeCapacity(
  area: number,
  distance: number,
  gradient: number,
  energy: boolean,
  carriers = 2,
) {
  if (
    ![area, distance, gradient, carriers].every(Number.isFinite) ||
    area < 0 ||
    distance <= 0 ||
    carriers < 0
  )
    throw new RangeError('Valid geometry required');
  return {
    passive: (area * gradient) / distance,
    uphill: energy ? carriers : 0,
  };
}
export const circulationRoute = [
  ['体循环静脉', 'Systemic veins'],
  ['右心房', 'Right atrium'],
  ['右心室', 'Right ventricle'],
  ['肺动脉', 'Pulmonary artery'],
  ['肺毛细血管', 'Lung capillaries'],
  ['肺静脉', 'Pulmonary vein'],
  ['左心房', 'Left atrium'],
  ['左心室', 'Left ventricle'],
  ['主动脉', 'Aorta'],
  ['体毛细血管', 'Body capillaries'],
] as const;
export function valveOpen(upstreamKPa: number, downstreamKPa: number) {
  return upstreamKPa > downstreamKPa;
}
export type Food = 'starch' | 'protein' | 'fat';
export function absorptionRoute(food: Food): {
  destination: 'lacteal' | 'blood';
  stages: [string, string][];
  locations: ('lumen' | 'epithelium' | 'blood' | 'lacteal')[];
} {
  return {
    destination: food === 'fat' ? 'lacteal' : 'blood',
    locations:
      food === 'fat'
        ? ['lumen', 'lumen', 'epithelium', 'lacteal']
        : ['lumen', 'lumen', 'lumen', 'blood'],
    stages:
      food === 'starch'
        ? [
            ['淀粉', 'Starch'],
            ['淀粉酶→麦芽糖/短寡糖', 'Amylase → maltose / short chains'],
            ['小肠酶→葡萄糖', 'Intestinal enzymes → glucose'],
            ['上皮→血毛细血管', 'Epithelium → blood capillary'],
          ]
        : food === 'protein'
          ? [
              ['蛋白质', 'Protein'],
              ['蛋白酶→较短肽', 'Proteases → shorter peptides'],
              ['肽酶等→氨基酸', 'Peptidases etc. → amino acids'],
              ['上皮→血毛细血管', 'Epithelium → blood capillary'],
            ]
          : [
              [
                '脂肪；胆汁乳化增加界面',
                'Fat; bile emulsifies, increasing interface',
              ],
              [
                '脂肪酶→脂肪酸/单甘油酯',
                'Lipase → fatty acids / monoglycerides',
              ],
              ['进入上皮；重组并包装', 'Enter epithelium; rebuild and package'],
              ['长链脂肪→乳糜管→血', 'Long-chain fats → lacteal → blood'],
            ],
  };
}
export function kidneyBalance(adh: 'low' | 'high', filtrateMl = 100) {
  if (!Number.isFinite(filtrateMl) || filtrateMl < 0)
    throw new RangeError('Non-negative finite volume required');
  const recoveredMl = filtrateMl * (adh === 'high' ? 0.98 : 0.9);
  return {
    filtrateMl,
    recoveredMl,
    urineMl: filtrateMl - recoveredMl,
    recoveredFraction: adh === 'high' ? 0.98 : 0.9,
  };
}
export function signalResponse(
  pathway: 'nerve' | 'hormone',
  receptor: boolean,
) {
  return {
    responds: receptor,
    route: pathway === 'nerve' ? 'axon-synapse' : 'blood',
    onsetSeconds: pathway === 'nerve' ? 0.05 : 5,
    durationSeconds: pathway === 'nerve' ? 0.2 : 60,
  };
}
