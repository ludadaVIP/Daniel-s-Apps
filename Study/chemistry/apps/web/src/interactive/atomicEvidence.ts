import type { LocalizedText } from '@study/shared';
const t = (zh: string, en: string): LocalizedText => ({ zh, en });
export type AtomicRecord = {
  symbol: 'Na' | 'Cl' | 'Ne' | 'Mg';
  z: number;
  a: number;
  charge: number;
};
const atomicNumbers = { Na: 11, Cl: 17, Ne: 10, Mg: 12 };
export function particleLedger(record: AtomicRecord) {
  const { z, a, charge } = record;
  if (
    atomicNumbers[record.symbol] !== z ||
    ![z, a, charge].every(Number.isSafeInteger) ||
    a < z ||
    z - charge < 0
  )
    throw new Error('Invalid atomic record');
  return {
    protons: z,
    neutrons: a - z,
    electrons: z - charge,
    massNumber: a,
    charge,
    isIon: charge !== 0,
  };
}
export function compareAtomicRecords(a: AtomicRecord, b: AtomicRecord) {
  const first = particleLedger(a),
    second = particleLedger(b);
  return {
    sameElement: a.z === b.z,
    differentIsotopes: a.z === b.z && a.a !== b.a,
    sameElectrons: first.electrons === second.electrons,
    secondIsIon: second.isIon,
  };
}
export const atomicPairs: Array<{
  id: string;
  first: AtomicRecord;
  second: AtomicRecord;
  explanation: LocalizedText;
}> = [
  {
    id: 'A',
    first: { symbol: 'Na', z: 11, a: 23, charge: 0 },
    second: { symbol: 'Na', z: 11, a: 23, charge: 1 },
    explanation: t(
      '同一种元素、同一个同位素核。B 比中性钠少一个电子，是离子；质量数仍是 23。电子有质量，但电子数不计入质量数。',
      'Same element and isotope nucleus. B has one fewer electron than neutral sodium and is an ion; its mass number stays 23. Electrons have mass but do not count towards mass number.',
    ),
  },
  {
    id: 'B',
    first: { symbol: 'Cl', z: 17, a: 35, charge: 0 },
    second: { symbol: 'Cl', z: 17, a: 37, charge: 0 },
    explanation: t(
      '质子数相同、中子数不同，是同元素的不同同位素。两份记录的电子数都等于质子数，所以都中性。',
      'Equal proton counts and different neutron counts make different isotopes of one element. Both electron counts equal proton counts, so both are neutral.',
    ),
  },
  {
    id: 'C',
    first: { symbol: 'Cl', z: 17, a: 35, charge: -1 },
    second: { symbol: 'Cl', z: 17, a: 37, charge: -1 },
    explanation: t(
      '两者有不同的氯同位素核，同时都带 −1 电荷。是否互为不同同位素，与是否带电，是可以同时判断的两个问题。',
      'They have different chlorine isotope nuclei and both carry −1 charge. Isotopic difference and ion status are two questions that can both apply.',
    ),
  },
  {
    id: 'D',
    first: { symbol: 'Ne', z: 10, a: 20, charge: 0 },
    second: { symbol: 'Na', z: 11, a: 23, charge: 1 },
    explanation: t(
      '两者都有 10 个电子，但质子数分别为 10 和 11，所以元素不同，不能互称同位素。相同电子数不等于相同元素。',
      'Both have 10 electrons, but their proton counts are 10 and 11. They are different elements, not isotopes of one element. Equal electron counts do not establish element identity.',
    ),
  },
  {
    id: 'E',
    first: { symbol: 'Cl', z: 17, a: 35, charge: 0 },
    second: { symbol: 'Cl', z: 17, a: 37, charge: -1 },
    explanation: t(
      'B 相对 A 的同位素核不同，电荷也不同：B 既是离子，也对应不同的氯同位素。这里比较两份记录，不是在演示把一个核改造成另一个核。',
      'B differs from A in isotope nucleus and charge: B is an ion and represents a different chlorine isotope. These are two records, not a demonstration of turning one nucleus into another.',
    ),
  },
];
export type MassMode = 'mass-number' | 'relative';
export const isotopeKits = [
  {
    id: 'Cl',
    name: t('题设氯样品', 'Given chlorine sample'),
    lightA: 35,
    heavyA: 37,
    lightRelative: 34.969,
    heavyRelative: 36.966,
  },
  {
    id: 'B',
    name: t('题设硼样品', 'Given boron sample'),
    lightA: 10,
    heavyA: 11,
    lightRelative: 10.013,
    heavyRelative: 11.009,
  },
] as const;
export function isotopeMean(
  kitIndex: number,
  lightCount: number,
  mode: MassMode,
) {
  if (
    !Number.isInteger(kitIndex) ||
    kitIndex < 0 ||
    kitIndex >= isotopeKits.length ||
    !Number.isInteger(lightCount) ||
    lightCount < 0 ||
    lightCount > 20 ||
    !['mass-number', 'relative'].includes(mode)
  )
    throw new Error('Invalid isotope mixture');
  const kit = isotopeKits[kitIndex]!;
  const lightMass = mode === 'mass-number' ? kit.lightA : kit.lightRelative;
  const heavyMass = mode === 'mass-number' ? kit.heavyA : kit.heavyRelative;
  const heavyCount = 20 - lightCount;
  const mean = (lightCount * lightMass + heavyCount * heavyMass) / 20;
  return {
    lightMass,
    heavyMass,
    lightCount,
    heavyCount,
    lightFraction: lightCount / 20,
    heavyFraction: heavyCount / 20,
    mean,
    roundedMean: Math.round((mean + Number.EPSILON) * 100) / 100,
    nearer: lightCount === 10 ? 'middle' : lightCount > 10 ? 'light' : 'heavy',
  } as const;
}
export function parseAtomicAnswer(
  value: string,
  decimal = false,
): number | null {
  const clean = value.trim();
  if (!(decimal ? /^\d+(\.\d+)?$/ : /^\d+$/).test(clean)) return null;
  const number = Number(clean);
  return Number.isFinite(number) && number <= Number.MAX_SAFE_INTEGER
    ? number
    : null;
}
