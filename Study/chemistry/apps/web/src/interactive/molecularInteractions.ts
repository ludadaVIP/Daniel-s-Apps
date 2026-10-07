export type Point = readonly [number, number];
export function rotateVector([x, y]: Point, degrees: number): Point {
  if (![x, y, degrees].every(Number.isFinite)) throw new RangeError('Use finite vectors and angles.');
  const angle = degrees * Math.PI / 180;
  return [x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle)];
}
export function rotatePosition([x, y]: Point, degrees: number): Point {
  const [dx, dy] = rotateVector([x - 50, y - 50], degrees);
  return [50 + dx, 50 + dy];
}
export function dipoleSum(vectors: readonly Point[], degrees = 0) {
  const net = vectors.reduce<Point>(([x, y], vector) => {
    const [dx, dy] = rotateVector(vector, degrees);
    return [x + dx, y + dy];
  }, [0, 0]);
  const magnitude = Math.hypot(...net);
  return { net, magnitude, polar: magnitude > 1e-9 };
}

const halfWaterAngle = 104.5 / 2 * Math.PI / 180;
const s = Math.sin(halfWaterAngle), c = Math.cos(halfWaterAngle);
export const polarityCases: readonly {
  formula: string;
  atoms: readonly { symbol: string; partial: string; point: Point }[];
  bonds: readonly (readonly [number, number, number])[];
  arrows: readonly (readonly [number, number])[];
  dipoles: readonly Point[];
  correct: number;
}[] = [
  {
    formula: 'H₂O',
    atoms: [{symbol: 'O', partial: 'δ−', point: [50,35]}, {symbol: 'H', partial: 'δ+', point: [50-32*s,35+32*c]}, {symbol: 'H', partial: 'δ+', point: [50+32*s,35+32*c]}],
    bonds: [[0,1,1],[0,2,1]], arrows: [[1,0],[2,0]], dipoles: [[s,-c],[-s,-c]], correct: 0,
  },
  {
    formula: 'CO₂',
    atoms: [{symbol: 'C', partial: 'δ+', point: [50,50]}, {symbol: 'O', partial: 'δ−', point: [15,50]}, {symbol: 'O', partial: 'δ−', point: [85,50]}],
    bonds: [[0,1,2],[0,2,2]], arrows: [[0,1],[0,2]], dipoles: [[-1,0],[1,0]], correct: 1,
  },
  {
    formula: 'O₂', atoms: [{symbol: 'O', partial: '', point: [30,50]}, {symbol: 'O', partial: '', point: [70,50]}],
    bonds: [[0,1,2]], arrows: [], dipoles: [], correct: 2,
  },
];

export const boilingProfiles = [
  { id: 'propane', zh: '丙烷', en: 'Propane', structure: 'CH₃—CH₂—CH₃', formula: 'C₃H₈', molarMass: 44, boilingC: -42.1, permanentDipole: false, selfHydrogenBond: false },
  { id: 'ether', zh: '二甲醚', en: 'Dimethyl ether', structure: 'CH₃—O—CH₃', formula: 'C₂H₆O', molarMass: 46, boilingC: -24.8, permanentDipole: true, selfHydrogenBond: false },
  { id: 'ethanol', zh: '乙醇', en: 'Ethanol', structure: 'CH₃—CH₂—O—H', formula: 'C₂H₆O', molarMass: 46, boilingC: 78.4, permanentDipole: true, selfHydrogenBond: true },
] as const;
export type BoilingProfile = (typeof boilingProfiles)[number];
export function forceInventory(profile: BoilingProfile) {
  return { dispersion: true, permanentDipole: profile.permanentDipole, selfHydrogenBond: profile.selfHydrogenBond };
}
/** Read approximate normal-boiling data; this does not calculate a boiling point from force names. */
export function boilingState(profile: BoilingProfile, temperatureC: number) {
  if (!Number.isFinite(temperatureC) || temperatureC < -60 || temperatureC > 100) throw new RangeError('Use the supported −60 to 100 °C window at 1 atm.');
  const difference = temperatureC - profile.boilingC;
  return Math.abs(difference) < 1e-8 ? 'coexistence' : difference < 0 ? 'liquid' : 'gas';
}
