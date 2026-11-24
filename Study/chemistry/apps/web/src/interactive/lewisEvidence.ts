import { neutralElement, type ElementSymbol } from './periodicEvidence';
export type LewisSymbol = Extract<ElementSymbol, 'H' | 'C' | 'N' | 'O' | 'Cl'>;
export type LewisAtom = {
  id: string;
  symbol: LewisSymbol;
  x: number;
  y: number;
  loneAngles: number[];
};
export type LewisBond = { from: string; to: string; order: number };
export type LewisModel = {
  formula: string;
  atoms: LewisAtom[];
  bonds: LewisBond[];
};
const atom = (
  id: string,
  symbol: LewisSymbol,
  x: number,
  y: number,
  loneAngles: number[] = [],
): LewisAtom => ({ id, symbol, x, y, loneAngles });
const bond = (from: string, to: string, order = 1): LewisBond => ({
  from,
  to,
  order,
});
export const sharingMolecules: LewisModel[] = [
  {
    formula: 'H₂',
    atoms: [atom('a', 'H', 90, 130), atom('b', 'H', 230, 130)],
    bonds: [bond('a', 'b')],
  },
  {
    formula: 'HCl',
    atoms: [atom('a', 'H', 90, 130), atom('b', 'Cl', 230, 130, [-90, 0, 90])],
    bonds: [bond('a', 'b')],
  },
  {
    formula: 'H₂O',
    atoms: [
      atom('o', 'O', 160, 90, [-135, -45]),
      atom('h1', 'H', 80, 195),
      atom('h2', 'H', 240, 195),
    ],
    bonds: [bond('o', 'h1'), bond('o', 'h2')],
  },
  {
    formula: 'NH₃',
    atoms: [
      atom('n', 'N', 160, 95, [-90]),
      atom('h1', 'H', 65, 155),
      atom('h2', 'H', 255, 155),
      atom('h3', 'H', 160, 215),
    ],
    bonds: [bond('n', 'h1'), bond('n', 'h2'), bond('n', 'h3')],
  },
  {
    formula: 'CH₄',
    atoms: [
      atom('c', 'C', 160, 130),
      atom('h1', 'H', 160, 45),
      atom('h2', 'H', 55, 130),
      atom('h3', 'H', 265, 130),
      atom('h4', 'H', 160, 215),
    ],
    bonds: [bond('c', 'h1'), bond('c', 'h2'), bond('c', 'h3'), bond('c', 'h4')],
  },
];
export function valenceCount(symbol: LewisSymbol) {
  return neutralElement(symbol).shells.at(-1)!;
}
export function lewisInventory(model: LewisModel) {
  if (
    !model.atoms.length ||
    new Set(model.atoms.map((a) => a.id)).size !== model.atoms.length
  )
    throw new Error('Invalid Lewis atom inventory');
  const incident = new Map(model.atoms.map((a) => [a.id, 0]));
  const edges = new Set<string>();
  for (const b of model.bonds) {
    const edge = [b.from, b.to].sort().join(':');
    if (
      !incident.has(b.from) ||
      !incident.has(b.to) ||
      b.from === b.to ||
      !Number.isInteger(b.order) ||
      b.order < 1 ||
      b.order > 3 ||
      edges.has(edge)
    )
      throw new Error('Invalid Lewis bond');
    edges.add(edge);
    incident.set(b.from, incident.get(b.from)! + b.order);
    incident.set(b.to, incident.get(b.to)! + b.order);
  }
  const totalElectrons = model.atoms.reduce(
    (n, a) => n + neutralElement(a.symbol).z,
    0,
  );
  const valenceBudget = model.atoms.reduce(
    (n, a) => n + valenceCount(a.symbol),
    0,
  );
  const sharedElectrons = 2 * model.bonds.reduce((n, b) => n + b.order, 0);
  const loneElectrons =
    2 * model.atoms.reduce((n, a) => n + a.loneAngles.length, 0);
  const local = model.atoms.map((a) => ({
    id: a.id,
    symbol: a.symbol,
    count: 2 * a.loneAngles.length + 2 * incident.get(a.id)!,
    target: a.symbol === 'H' ? 2 : 8,
  }));
  const picturedValence = sharedElectrons + loneElectrons;
  const budgetMatches = picturedValence === valenceBudget,
    localTargetsMatch = local.every((a) => a.count === a.target);
  return {
    totalElectrons,
    valenceBudget,
    coreElectrons: totalElectrons - valenceBudget,
    sharedElectrons,
    loneElectrons,
    picturedValence,
    local,
    localSum: local.reduce((n, a) => n + a.count, 0),
    budgetMatches,
    localTargetsMatch,
    passesRules: budgetMatches && localTargetsMatch,
  };
}
export const diatomicCases = [
  { formula: 'H₂', symbol: 'H' },
  { formula: 'O₂', symbol: 'O' },
  { formula: 'N₂', symbol: 'N' },
] as const;
export function diatomicCandidate(
  index: number,
  order: number,
  leftPairs: number,
  rightPairs: number,
): LewisModel {
  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= diatomicCases.length ||
    !Number.isInteger(order) ||
    order < 1 ||
    order > 3 ||
    ![leftPairs, rightPairs].every(
      (n) => Number.isInteger(n) && n >= 0 && n <= 3,
    )
  )
    throw new Error('Invalid Lewis candidate settings');
  const d = diatomicCases[index]!;
  return {
    formula: d.formula,
    atoms: [
      atom('left', d.symbol, 90, 130, [180, -90, 90].slice(0, leftPairs)),
      atom('right', d.symbol, 230, 130, [0, -90, 90].slice(0, rightPairs)),
    ],
    bonds: [bond('left', 'right', order)],
  };
}
export function lonePairPoints(atom: LewisAtom, angle: number) {
  const r = (angle * Math.PI) / 180;
  const x = atom.x + 40 * Math.cos(r),
    y = atom.y + 40 * Math.sin(r);
  return [-1, 1].map((side) => ({
    x: x + side * 4.5 * -Math.sin(r),
    y: y + side * 4.5 * Math.cos(r),
  }));
}
