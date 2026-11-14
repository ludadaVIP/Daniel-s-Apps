import { q, t } from './schema';

export const concentrations = [0, 0.2, 0.4, 0.6, 0.8] as const;
export type PotatoRecord = {
  id: string;
  block: string;
  concentration: number;
  before: number;
  after: number;
};
// Original, fictional teaching data. Values are balance readings to 0.01 g.
const masses = [3, 3.1, 2.9, 3];
const changes = [
  [11, 3, -5, -11, -17],
  [12, 4, -4, -12, -18],
  [13, 5, -3, -13, -19],
  [12, 4, -4, -12, -18],
];
export const potatoRecords: PotatoRecord[] = masses.flatMap((before, block) =>
  concentrations.map((concentration, i) => ({
    id: `${'ABCD'[block]}-${i + 1}`,
    block: 'ABCD'[block]!,
    concentration,
    before,
    after: Math.round(before * (1 + changes[block]![i]! / 100) * 100) / 100,
  })),
);
export function percentChange(before: number, after: number) {
  if (
    !Number.isFinite(before) ||
    before <= 0 ||
    !Number.isFinite(after) ||
    after < 0
  )
    throw new Error('Invalid paired mass');
  return ((after - before) / before) * 100;
}
export const evidenceSummary = concentrations.map((concentration) => {
  const rows = potatoRecords.filter((r) => r.concentration === concentration);
  const values = rows.map((r) => percentChange(r.before, r.after));
  return {
    id: `mean-${concentration}`,
    concentration,
    mean: values.reduce((a, b) => a + b, 0) / values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    n: rows.length,
  };
});
export const zeroEstimate = (() => {
  const a = evidenceSummary[1]!,
    b = evidenceSummary[2]!;
  return (
    a.concentration +
    ((0 - a.mean) / (b.mean - a.mean)) * (b.concentration - a.concentration)
  );
})();
export const evidenceProtocol = t(
  '原创虚构数据，不需切割或进行真实实验。四个独立块茎A–D各取五条，块内随机分配到五种外液；每条独立杯，共20条/20处理单位，每浓度n=4，只有4个生物块。每条初终质量配对；不是20个块茎或40个独立样本。22°C、60 min、每杯50 mL、名义尺寸30×10×10 mm、同批材料和一致擦干，天平分辨率0.01 g。尺寸相近仍可能质量不同，故先求每条百分比再求均值。',
  'Original fictional data; no cutting or real experiment is required. Four independent tubers A–D each supply five strips, randomly assigned within each block to the five external solutions. Each strip has its own cup: 20 strips / 20 treatment units, n=4 per concentration, only four biological blocks. Before/after masses are paired, not 20 tubers or 40 independent samples. Conditions: 22°C, 60 min, 50 mL per cup, nominal dimensions 30×10×10 mm, same batch and consistent blotting; balance resolution 0.01 g. Similar dimensions can give different masses: calculate each percentage before averaging.',
);
export const evidenceAssumptions = t(
  '解释假设：60 min内蔗糖近似不透膜，其他净质量变化可忽略，水势差可驱动水的净移动。质量数据不能单独证明渗透机制；擦干差异、组织损伤、溶质移动也可能影响质量。外液60 min零质量变化估计不是精确胞内蔗糖浓度，也不证明已达平衡。min–max是本组观测范围，不是置信区间；不计算p值或宣称显著。',
  'Interpretive assumptions: sucrose is approximately membrane-impermeant during 60 min, other net mass changes are negligible, and water-potential differences can drive net water movement. Mass alone cannot establish osmosis; blotting differences, tissue damage and solute movement are alternatives. The external concentration estimated to give zero mass change after 60 min is neither an exact intracellular sucrose concentration nor proof of equilibrium. Min–max is the observed range, not a confidence interval; no p-values or significance claims are made.',
);
export const graphTitle =
  'External sucrose concentration and potato mass change after 60 min';
export const graphCaption = {
  zh: '22°C、60 min：横轴为外液蔗糖浓度(mol/L)，纵轴为每条质量百分比变化。圆点为配对条的计算值（横向微移仅防遮挡），方块为四个块茎A–D各一条的均值，竖线为min–max范围，非置信区间。零线供估计。',
  en: 'At 22°C after 60 min: x = external sucrose concentration (mol/L); y = percentage mass change per strip. Circles are paired-strip values (horizontal jitter only prevents overlap); squares are means of one strip from each of four tubers A–D. Bars show min–max ranges, not confidence intervals. The zero line supports estimation.',
};
export type EvidenceDraft = {
  calculations: string[];
  xAxis: number;
  yAxis: number;
  display: number;
  title: string;
  captionZh: string;
  captionEn: string;
  citations: string[];
  claim: string;
  mechanism: string;
  limitation: string;
  alternative: string;
  variable: string;
  measured: string;
  timing: string;
  controls: string;
  repeats: string;
  challenge: string;
  languagePractice: string;
  reviewed: boolean;
  answers: Record<string, number>;
  savedAt?: number;
};
export function actualEvidenceCaption(d: EvidenceDraft) {
  if (d.xAxis === 0 && d.yAxis === 0 && d.display === 0)
    return { zh: d.captionZh, en: d.captionEn };
  return {
    zh: `待修复草稿。22°C、60 min；横轴：${d.xAxis === 0 ? '外液浓度(mol/L)' : '杯子类别1–5（隐藏连续浓度）'}；纵轴：${d.yAxis === 0 ? '每条质量百分比变化(%)' : '原始质量差(g)，未对初质量归一化'}。${d.display === 0 ? '圆点是条的计算值，方块是均值，线为min–max范围，非CI。' : '只显示方块均值，隐藏原始点及min–max范围。'}每组4条，来自4个块茎；有正负零线。`,
    en: `DRAFT TO REPAIR. At 22°C after 60 min; x: ${d.xAxis === 0 ? 'external concentration (mol/L)' : 'cup categories 1–5 (continuous concentration hidden)'}; y: ${d.yAxis === 0 ? 'percentage mass change per strip (%)' : 'raw mass difference (g), not normalized to starting mass'}. ${d.display === 0 ? 'Circles are strip values, squares are means, bars are min–max ranges, not CIs.' : 'Only square means are shown; raw points and min–max ranges are hidden.'} Four strips from four tubers per group; signed scale and zero line retained.`,
  };
}
export const evidenceTextFields = [
  'claim',
  'mechanism',
  'limitation',
  'alternative',
  'variable',
  'measured',
  'timing',
  'controls',
  'repeats',
  'challenge',
] as const;
export function emptyEvidenceProject(): EvidenceDraft {
  return {
    calculations: ['', ''],
    xAxis: 1,
    yAxis: 1,
    display: 1,
    title: graphTitle,
    captionZh: graphCaption.zh,
    captionEn: graphCaption.en,
    citations: ['', ''],
    claim: '',
    mechanism: '',
    limitation: '',
    alternative: '',
    variable: '',
    measured: '',
    timing: '',
    controls: '',
    repeats: '',
    challenge: '',
    languagePractice: '',
    reviewed: false,
    answers: {},
  };
}
export function calculationCorrect(value: string, index: number) {
  const r = [potatoRecords[1]!, potatoRecords[2]!][index];
  return (
    !!r &&
    value.trim() !== '' &&
    Number.isFinite(Number(value)) &&
    Math.abs(Number(value) - percentChange(r.before, r.after)) <= 0.05
  );
}
export function validCitation(id: string) {
  return (
    potatoRecords.some((r) => r.id === id) ||
    evidenceSummary.some((r) => r.id === id)
  );
}
export function evidenceReady(d: EvidenceDraft) {
  return (
    d.calculations.length === 2 &&
    d.calculations.every(calculationCorrect) &&
    d.xAxis === 0 &&
    d.yAxis === 0 &&
    d.display === 0 &&
    d.title === graphTitle &&
    d.captionZh === graphCaption.zh &&
    d.captionEn === graphCaption.en &&
    d.citations.length === 2 &&
    new Set(d.citations).size === 2 &&
    d.citations.every(validCitation) &&
    evidenceTextFields.every((k) => d[k].trim().length >= 8) &&
    d.reviewed
  );
}
export function editEvidence(
  d: EvidenceDraft,
  patch: Partial<EvidenceDraft>,
): EvidenceDraft {
  return { ...d, ...patch, savedAt: undefined };
}
export function saveEvidence(d: EvidenceDraft, at = Date.now()): EvidenceDraft {
  if (!evidenceReady(d) || !validEvidenceTimestamp(at))
    throw new Error(
      'Complete calculations, graph, citations and self-review first',
    );
  return { ...d, savedAt: at };
}
export function validEvidenceTimestamp(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    value > 0 &&
    value <= 8640000000000000
  );
}
export const evidenceQuestions = [
  q(
    'S05-Q1',
    'reasoning',
    t(
      '蔗糖外液使条失重，能直接证明什么？',
      'What does a mass loss in sucrose directly establish?',
    ),
    [
      t('水分子停止移动', 'Water molecules stop moving'),
      t(
        '60 min内净质量下降，机制需假设和额外证据',
        'Net mass decreased over 60 min; mechanism needs assumptions and extra evidence',
      ),
      t('胞内浓度等于外液', 'Internal concentration equals the solution'),
    ],
    1,
    t(
      '记录是净质量变化。渗透解释依赖膜、溶质和其他质量变化的假设。',
      'The observation is net mass change. An osmotic interpretation depends on assumptions about membranes, solutes and other mass changes.',
    ),
    t('回看L099', 'Revisit L099'),
  ),
  q(
    'S05-Q2',
    'reasoning',
    t(
      '同一人的运动前后心率如何比较？',
      'How should one person’s before/after exercise heart rate be compared?',
    ),
    [
      t(
        '保留个体配对与测量时间',
        'Preserve individual pairing and measurement times',
      ),
      t('算成两名独立的人', 'Count as two independent people'),
      t('心率就是呼吸速率', 'Heart rate is breathing rate'),
    ],
    0,
    t(
      '配对保留个体身份，不能把前后两次算成两个生物重复。',
      'Pairing preserves identity; before/after readings are not two biological replicates.',
    ),
    t('回看L101', 'Revisit L101'),
  ),
  q(
    'S05-Q3',
    'concept',
    t('蒸腾变化如何连到运输？', 'How can transpiration affect transport?'),
    [
      t('水由韧皮部主动泵上去', 'Phloem actively pumps water upward'),
      t('糖变成水', 'Sugar turns into water'),
      t(
        '叶片蒸发可维持木质部水势梯度',
        'Leaf evaporation can maintain a water-potential gradient in xylem',
      ),
    ],
    2,
    t(
      '木质部运输与水势及蒸腾有关；筛管运输糖等有机物。',
      'Xylem transport relates to water potential and transpiration; phloem carries sugars and other organic solutes.',
    ),
    t('回看L106', 'Revisit L106'),
  ),
  q(
    'S05-Q4',
    'concept',
    t(
      '真核细胞中的蛋白编码基因如何影响蛋白质？',
      'How can a protein-coding gene in a eukaryotic cell affect a protein?',
    ),
    [
      t(
        'DNA直接离开细胞核变成蛋白质',
        'DNA leaves the nucleus and turns into protein',
      ),
      t(
        '转录产生RNA，mRNA可在核糖体被翻译；并非所有基因都编码蛋白',
        'Transcription produces RNA; mRNA can be translated at ribosomes. Not all genes encode proteins',
      ),
      t(
        '一个基因必定唯一决定复杂性状',
        'One gene always determines a complex trait alone',
      ),
    ],
    1,
    t(
      '信息经转录与翻译影响蛋白质；功能RNA基因不经过蛋白产物这一步，复杂性状也受环境与多个基因影响。',
      'Information can pass through transcription and translation to affect proteins. Functional-RNA genes do not require a protein product, and complex traits involve multiple genes and environment.',
    ),
    t('回看L110', 'Revisit L110'),
  ),
  q(
    'S05-Q5',
    'reasoning',
    t(
      '疫苗组病例更少就能忽略什么？',
      'What may be ignored if a vaccinated group has fewer cases?',
    ),
    [
      t(
        '不能忽略分母、分组和混杂',
        'Denominators, group assignment and confounding still matter',
      ),
      t('可忽略每组人数', 'Group sizes'),
      t('可忽略随访时间', 'Follow-up time'),
    ],
    0,
    t(
      '应比较风险及设计；观察关联本身不足以排除混杂。',
      'Compare risks and study design; association alone does not rule out confounding.',
    ),
    t('回看L116', 'Revisit L116'),
  ),
  q(
    'S05-Q6',
    'reasoning',
    t(
      '四个块茎每浓度各一条，重复数怎样表述？',
      'Four tubers each provide one strip per concentration. What are the replicates?',
    ),
    [
      t('40个独立样本', '40 independent samples'),
      t('20个独立块茎', '20 independent tubers'),
      t(
        '每浓度4条，来自4个生物块，初终配对',
        'Four strips per concentration from four biological blocks, with paired before/after masses',
      ),
    ],
    2,
    t(
      '20处理单位来自4个块，保留块内随机和配对。范围不是显著性检验。',
      'Twenty treatment units come from four blocks. Preserve within-block randomization and pairing. A range is not a significance test.',
    ),
    t('回看L119', 'Revisit L119'),
  ),
];
export const evidenceQuestionLessons = [
  'L099',
  'L101',
  'L106',
  'L110',
  'L116',
  'L119',
];
export function evidenceUnderstanding(d: EvidenceDraft) {
  return {
    answered: evidenceQuestions.filter(
      (q) =>
        Number.isInteger(d.answers[q.id]) &&
        d.answers[q.id]! >= 0 &&
        d.answers[q.id]! < q.options.length,
    ).length,
    correct: evidenceQuestions.filter((q) => d.answers[q.id] === q.correct)
      .length,
  };
}
export function decodeEvidenceProject(value: unknown): EvidenceDraft {
  if (!value || typeof value !== 'object')
    throw new Error('Invalid evidence project');
  const v = value as Record<string, unknown>,
    d = emptyEvidenceProject();
  for (const k of [
    ...evidenceTextFields,
    'title',
    'captionZh',
    'captionEn',
    'languagePractice',
  ] as const) {
    if (typeof v[k] !== 'string') throw new Error('Invalid evidence text');
    d[k] = v[k] as string;
  }
  for (const k of ['calculations', 'citations'] as const) {
    if (
      !Array.isArray(v[k]) ||
      v[k].length !== 2 ||
      !v[k].every((x) => typeof x === 'string')
    )
      throw new Error('Invalid evidence pair');
    d[k] = [...v[k]];
  }
  for (const k of ['xAxis', 'yAxis', 'display'] as const) {
    if (!Number.isInteger(v[k]) || (v[k] as number) < 0 || (v[k] as number) > 1)
      throw new Error('Invalid graph choice');
    d[k] = v[k] as number;
  }
  if (
    typeof v.reviewed !== 'boolean' ||
    !v.answers ||
    typeof v.answers !== 'object' ||
    Array.isArray(v.answers)
  )
    throw new Error('Invalid evidence review');
  d.reviewed = v.reviewed;
  for (const question of evidenceQuestions) {
    const a = (v.answers as Record<string, unknown>)[question.id];
    if (a === undefined) continue;
    if (
      !Number.isInteger(a) ||
      (a as number) < 0 ||
      (a as number) >= question.options.length
    )
      throw new Error('Invalid evidence answer');
    d.answers[question.id] = a as number;
  }
  if (validEvidenceTimestamp(v.savedAt) && evidenceReady(d))
    d.savedAt = v.savedAt;
  return d;
}
