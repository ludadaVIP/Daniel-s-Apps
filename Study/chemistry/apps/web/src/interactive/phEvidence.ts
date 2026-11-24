import type { LocalizedText } from '@study/shared';
import { protonSpecies } from './protonReactions';
const t = (zh: string, en: string): LocalizedText => ({ zh, en });
export type PhClass = 'acidic' | 'neutral' | 'basic';
export type RangeClass = PhClass | 'undetermined' | 'incompatible';
export type PhInterval = {
  low: number;
  high: number;
  lowClosed: boolean;
  highClosed: boolean;
};
export const indicatorCharts = [
  {
    name: t('甲基橙', 'Methyl orange'),
    low: 3.1,
    high: 4.4,
    colours: [
      t('低端：红色', 'Low: red'),
      t('过渡区：橙色系', 'Transition: orange shades'),
      t('高端：黄色', 'High: yellow'),
    ],
    swatches: ['#dc7972', '#edb86d', '#efd76b'],
  },
  {
    name: t('溴百里酚蓝（BTB）', 'Bromothymol blue (BTB)'),
    low: 6,
    high: 7.6,
    colours: [
      t('低端：黄色', 'Low: yellow'),
      t('过渡区：绿色系', 'Transition: green shades'),
      t('高端：蓝色', 'High: blue'),
    ],
    swatches: ['#efd76b', '#92bea0', '#8cafd4'],
  },
] as const;
export function indicatorRange(indicator: number, reading: number): PhInterval {
  if (
    !Number.isInteger(indicator) ||
    !indicatorCharts[indicator] ||
    !Number.isInteger(reading) ||
    reading < 0 ||
    reading > 2
  )
    throw new Error('Invalid indicator record');
  const c = indicatorCharts[indicator]!;
  return reading === 0
    ? { low: 0, high: c.low, lowClosed: true, highClosed: false }
    : reading === 1
      ? { low: c.low, high: c.high, lowClosed: true, highClosed: true }
      : { low: c.high, high: 14, lowClosed: false, highClosed: true };
}
export function intersectPhIntervals(
  a: PhInterval,
  b: PhInterval,
): PhInterval | null {
  for (const r of [a, b])
    if (![r.low, r.high].every(Number.isFinite) || r.low > r.high)
      throw new Error('Invalid pH interval');
  const low = Math.max(a.low, b.low),
    high = Math.min(a.high, b.high);
  const lowClosed =
    (a.low < low || a.lowClosed) && (b.low < low || b.lowClosed);
  const highClosed =
    (a.high > high || a.highClosed) && (b.high > high || b.highClosed);
  return low > high || (low === high && !(lowClosed && highClosed))
    ? null
    : { low, high, lowClosed, highClosed };
}
export function intervalClass(range: PhInterval | null): RangeClass {
  if (!range) return 'incompatible';
  if (range.high < 7 || (range.high === 7 && !range.highClosed))
    return 'acidic';
  if (range.low > 7 || (range.low === 7 && !range.lowClosed)) return 'basic';
  if (range.low === 7 && range.high === 7) return 'neutral';
  return 'undetermined';
}
export function indicatorEvidence(first: number, second: number) {
  const a = indicatorRange(0, first),
    b = indicatorRange(1, second);
  const range = intersectPhIntervals(a, b);
  return {
    a,
    b,
    range,
    compatible: range !== null,
    classification: intervalClass(range),
  };
}
export const phInventorySpecies = {
  hydronium: protonSpecies.hydronium,
  hydroxide: protonSpecies.hydroxide,
  sodium: protonSpecies.sodium,
  chloride: protonSpecies.chloride,
};
export type PhInventoryIon = keyof typeof phInventorySpecies;
// Relative mean-count units, not a literal number of ions in a cup or a snapshot.
// One shared scale per volume portion; water molecules are omitted, not absent.
export const aqueousInventoryCards: Record<PhInventoryIon, number>[] = [
  { hydronium: 9, hydroxide: 1, sodium: 0, chloride: 8 },
  { hydronium: 1, hydroxide: 9, sodium: 8, chloride: 0 },
  { hydronium: 3, hydroxide: 3, sodium: 0, chloride: 0 },
  { hydronium: 3, hydroxide: 3, sodium: 4, chloride: 4 },
  { hydronium: 9, hydroxide: 1, sodium: 4, chloride: 12 },
  { hydronium: 1, hydroxide: 9, sodium: 12, chloride: 4 },
];
export function aqueousPhInventory(index: number, portions: number) {
  if (
    !Number.isInteger(index) ||
    !aqueousInventoryCards[index] ||
    !Number.isInteger(portions) ||
    portions < 1 ||
    portions > 3
  )
    throw new Error('Invalid aqueous inventory');
  const base = aqueousInventoryCards[index]!;
  const counts = Object.fromEntries(
    Object.entries(base).map(([k, n]) => [k, n * portions]),
  ) as Record<PhInventoryIon, number>;
  let positive = 0,
    negative = 0;
  for (const id of Object.keys(counts) as PhInventoryIon[]) {
    const contribution = counts[id] * phInventorySpecies[id].charge;
    if (contribution > 0) positive += contribution;
    else negative -= contribution;
  }
  const classification: PhClass =
    base.hydronium === base.hydroxide
      ? 'neutral'
      : base.hydronium > base.hydroxide
        ? 'acidic'
        : 'basic';
  return {
    base,
    counts,
    positive,
    negative,
    net: positive - negative,
    classification,
    portions,
    hydroniumDensity: counts.hydronium / portions,
    hydroxideDensity: counts.hydroxide / portions,
  };
}
