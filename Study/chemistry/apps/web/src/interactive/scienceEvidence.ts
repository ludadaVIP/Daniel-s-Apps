import type { LocalizedText } from '@study/shared';
const t = (zh: string, en: string): LocalizedText => ({ zh, en });

export const evidenceCards = [
  {
    id: 'bubbles-record',
    record: t(
      '虚构记录：混合后出现气泡，尚未做气体鉴定。',
      'Authored record: bubbles appeared after mixing; no gas-identification test was done.',
    ),
    statement: t('混合后看到了气泡。', 'Bubbles were seen after mixing.'),
    kind: 'observation',
    explanation: t(
      '这直接描述记录到的现象，还没有给气体命名。',
      'This directly describes a recorded observation without naming the gas.',
    ),
  },
  {
    id: 'bubbles-identity',
    record: t(
      '虚构记录：混合后出现气泡，尚未做气体鉴定。',
      'Authored record: bubbles appeared after mixing; no gas-identification test was done.',
    ),
    statement: t('气体一定是二氧化碳。', 'The gas must be carbon dioxide.'),
    kind: 'inference',
    explanation: t(
      '这是身份推断，现有气泡记录不足以唯一支持它；沸腾或释放原有气体也可能产生气泡。',
      'This infers identity, which bubbles alone do not uniquely support. Boiling or release of existing gas can also form bubbles.',
    ),
  },
  {
    id: 'sugar-record',
    record: t(
      '虚构记录：将已称量的糖与水混合并搅拌，后来肉眼看不到糖颗粒。',
      'Authored record: weighed sugar and water were mixed and stirred; sugar grains later could not be seen.',
    ),
    statement: t(
      '搅拌后肉眼看不到糖颗粒。',
      'No sugar grains were visible after stirring.',
    ),
    kind: 'observation',
    explanation: t(
      '这描述看见或没看见的现象，不能单凭它断言糖不存在。',
      'This reports what was or was not visible; it does not by itself show that sugar is absent.',
    ),
  },
  {
    id: 'sugar-vanished',
    record: t(
      '虚构记录：将已称量的糖与水混合并搅拌，后来肉眼看不到糖颗粒。',
      'Authored record: weighed sugar and water were mixed and stirred; sugar grains later could not be seen.',
    ),
    statement: t('糖已经不存在了。', 'The sugar no longer exists.'),
    kind: 'inference',
    explanation: t(
      '这是超过现有证据的推断。溶解可让颗粒不再可见，并不意味着物质消失。',
      'This goes beyond the evidence. Dissolution can make grains invisible without removing the substance.',
    ),
  },
  {
    id: 'temperature-record',
    record: t(
      '虚构记录：温度计从 20.0 °C 变到 23.0 °C；没有设置对照。',
      'Authored record: a thermometer changed from 20.0 °C to 23.0 °C; there was no control.',
    ),
    statement: t(
      '温度计读数升高了 3.0 °C。',
      'The thermometer reading rose by 3.0 °C.',
    ),
    kind: 'observation',
    explanation: t(
      '这是对两个仪器读数的记录与简单比较；原因仍未确定。',
      'This records and compares instrument readings; the cause remains undetermined.',
    ),
  },
  {
    id: 'temperature-cause',
    record: t(
      '虚构记录：温度计从 20.0 °C 变到 23.0 °C；没有设置对照。',
      'Authored record: a thermometer changed from 20.0 °C to 23.0 °C; there was no control.',
    ),
    statement: t(
      '温升一定全部由化学反应造成。',
      'All the warming must have come from a chemical reaction.',
    ),
    kind: 'inference',
    explanation: t(
      '这是因果推断，缺少对照。环境传热、仪器或其他过程尚未排除。',
      'This makes a causal inference without a control. Environmental heating, instrumentation and other processes have not been ruled out.',
    ),
  },
  {
    id: 'ice-record',
    record: t(
      '虚构记录：已知的冰块变成可流动的液体；材料与温度条件已记录。',
      'Authored record: a known ice sample became a flowing liquid; material and temperature conditions were recorded.',
    ),
    statement: t(
      '可以用冰融化的模型解释这些现象。',
      'An ice-melting model can explain these observations.',
    ),
    kind: 'inference',
    explanation: t(
      '这是有依据、可继续检验的解释。推断不等于错误；它应与现象分开，并接受证据检查。',
      'This is an evidence-based explanation that can be tested further. Inference does not mean incorrect; separate it from observation and check its support.',
    ),
  },
  {
    id: 'better-question',
    record: t(
      '虚构记录：两种未知液体外观都透明，没有成分鉴定数据。',
      'Authored record: two unknown liquids are both clear; no composition tests are available.',
    ),
    statement: t(
      '两杯液体必定是同一种物质。',
      'The two liquids must be the same substance.',
    ),
    kind: 'inference',
    explanation: t(
      '同样透明不够确定身份。更好的下一问是：哪些独立性质或对照能区分它们？不需要自行尝试未知液体。',
      'Shared clarity cannot establish identity. Ask which independent properties or controls could distinguish them; do not test unknown liquids yourself.',
    ),
  },
] satisfies Array<{
  id: string;
  record: LocalizedText;
  statement: LocalizedText;
  kind: 'observation' | 'inference';
  explanation: LocalizedText;
}>;

export const dissolvingTrials = [
  {
    id: 'A',
    temperature: 20,
    water: 100,
    sugar: 5,
    stirring: 60,
    grains: 'fine',
    seconds: [82, 80, 84],
  },
  {
    id: 'B',
    temperature: 40,
    water: 100,
    sugar: 5,
    stirring: 60,
    grains: 'fine',
    seconds: [47, 49, 48],
  },
  {
    id: 'C',
    temperature: 40,
    water: 200,
    sugar: 5,
    stirring: 60,
    grains: 'fine',
    seconds: [51, 50, 52],
  },
  {
    id: 'D',
    temperature: 20,
    water: 100,
    sugar: 5,
    stirring: 120,
    grains: 'fine',
    seconds: [48, 50, 49],
  },
  {
    id: 'E',
    temperature: 40,
    water: 100,
    sugar: 10,
    stirring: 120,
    grains: 'coarse',
    seconds: [80, 82, 78],
  },
] as const;
export type TrialVariable =
  'temperature' | 'water' | 'sugar' | 'stirring' | 'grains';
export function changedDissolvingVariables(
  a: (typeof dissolvingTrials)[number],
  b: (typeof dissolvingTrials)[number],
): TrialVariable[] {
  const keys: TrialVariable[] = [
    'temperature',
    'water',
    'sugar',
    'stirring',
    'grains',
  ];
  return keys.filter((key) => a[key] !== b[key]);
}
export function isolatesDissolvingVariable(
  a: (typeof dissolvingTrials)[number],
  b: (typeof dissolvingTrials)[number],
  target: TrialVariable,
) {
  const changed = changedDissolvingVariables(a, b);
  return changed.length === 1 && changed[0] === target;
}

export function readingStats(readings: readonly number[]) {
  if (
    readings.length === 0 ||
    readings.some((value) => !Number.isFinite(value))
  )
    throw new RangeError('Provide a nonempty list of finite readings.');
  const mean =
    readings.reduce((sum, value) => sum + value, 0) / readings.length;
  const minimum = Math.min(...readings);
  const maximum = Math.max(...readings);
  return { mean, minimum, maximum, spread: maximum - minimum };
}

export const balanceRecords = [
  {
    id: 'near-reference',
    title: t(
      '记录 A：小波动，接近参考值',
      'Record A: small spread, near reference',
    ),
    readings: [9.9, 10.0, 10.1, 10.0, 10.0],
    resolution: 0.1,
    reference: 10.0,
    claim: 'near',
    explanation: t(
      '平均值为 10.0 g，范围 9.9–10.1 g。在这份给定记录和参考值下，读数接近参考且波动较小；这不是零不确定度证明。',
      'The mean is 10.0 g and the range is 9.9–10.1 g. These supplied readings are close to the reference with small spread, not proof of zero uncertainty.',
    ),
  },
  {
    id: 'shifted',
    title: t('记录 B：整体偏高', 'Record B: consistently high'),
    readings: [10.5, 10.5, 10.4, 10.6, 10.5],
    resolution: 0.1,
    reference: 10.0,
    claim: 'shifted',
    explanation: t(
      '平均值 10.5 g，比给定参考高 0.5 g，读数却很集中。重复可以看出这种一致偏离，但不会自动消除系统偏差。',
      'The mean 10.5 g is 0.5 g above the supplied reference despite a tight cluster. Repetition reveals this consistent offset but does not automatically remove systematic bias.',
    ),
  },
  {
    id: 'spread',
    title: t('记录 C：波动较大', 'Record C: wider spread'),
    readings: [9.6, 10.4, 9.8, 10.2, 10.0],
    resolution: 0.1,
    reference: 10.0,
    claim: 'spread',
    explanation: t(
      '平均值仍为 10.0 g，但范围 9.6–10.4 g。只报告平均值会掩盖单次读数较大的波动。',
      'The mean is still 10.0 g but the range is 9.6–10.4 g. The mean alone hides the wider variation in individual readings.',
    ),
  },
  {
    id: 'coarse',
    title: t('记录 D：只显示到整数克', 'Record D: whole-gram display'),
    readings: [10, 10, 10, 10, 10],
    resolution: 1,
    reference: 10.0,
    claim: 'coarse',
    explanation: t(
      '显示都为 10 g，不代表真实量完全一样。1 g 的显示分辨率可能掩盖较小变化，不能凭“全一样”认定比 0.1 g 的仪器更精密。',
      'All displays read 10 g, but the underlying quantity need not be identical. A 1 g display can hide smaller changes; identical displays alone do not prove better precision than a 0.1 g instrument.',
    ),
  },
] as const;

export const massBoundaryCases = [
  {
    id: 'dissolving',
    title: t('糖在水中分散', 'Sugar dispersing in water'),
    gasG: [0, 0, 0, 0, 0],
    description: t(
      '起点已把 80 g 水和 10 g 糖全部放在称量范围内；混合后颗粒变得不可见，但不跨界。',
      'At the start, all 80 g water and 10 g sugar are already inside the weighing boundary. Mixing makes grains invisible without crossing the boundary.',
    ),
  },
  {
    id: 'evaporation',
    title: t('水转为气态', 'Water changing to gas'),
    gasG: [0, 5, 10, 15, 20],
    description: t(
      '起点是 90 g 水；给定记录中部分水转为气态，仍是同一种物质。每个位置只表示一条模型记录，不是真实时间。',
      'Start with 90 g water. In the supplied records some becomes gas but stays the same substance. Positions are model records, not real times.',
    ),
  },
  {
    id: 'gas-formation',
    title: t('反应产生气体', 'A gas-forming reaction'),
    gasG: [0, 0.5, 1, 1.5, 2],
    description: t(
      '起点是总质量 90 g 的全部反应材料；给定记录把其中一部分转入气相，不模拟具体试剂、速率或气体体积。',
      'All reaction materials initially total 90 g. The supplied records move some mass into the gas phase without simulating particular reagents, rate or gas volume.',
    ),
  },
] as const;

export function massBoundaryLedger(
  sample: (typeof massBoundaryCases)[number],
  record: number,
  closed: boolean,
) {
  if (!Number.isInteger(record) || record < 0 || record >= sample.gasG.length)
    throw new RangeError('Choose a recorded position from 0 to 4.');
  const containerG = 20;
  const matterG = 90;
  const gasG = sample.gasG[record]!;
  const insideMaterialG = matterG - gasG;
  const insideGasG = closed ? gasG : 0;
  const outsideGasG = closed ? 0 : gasG;
  const readingG = containerG + insideMaterialG + insideGasG;
  return {
    containerG,
    matterG,
    initialReadingG: containerG + matterG,
    gasG,
    insideMaterialG,
    insideGasG,
    outsideGasG,
    readingG,
    contentsG: readingG - containerG,
    totalAccountedG: readingG + outsideGasG,
  };
}
