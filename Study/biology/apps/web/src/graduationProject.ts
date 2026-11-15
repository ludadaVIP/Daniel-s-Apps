import { q, t } from './schema';
import official from '../../../curriculum/s06/yellowstone-2025.json';

export const graduationCases = ['official', 'observation'] as const;
export type GraduationCaseId = (typeof graduationCases)[number];
export type Scope = 'all' | 'Northern Range' | 'Interior';
export type GraphKind = 'counts' | 'shares';
export type PlantRecord = {
  id: string;
  plant: string;
  day: number;
  value: number | null;
};
export type ResearchText = {
  question: string;
  method: string;
  conditions: string;
  source: string;
  claim: string;
  reasoning: string;
  mechanism: string;
  limitation: string;
  alternative: string;
  nextQuestion: string;
  variable: string;
  measured: string;
  controls: string;
  sampling: string;
  challenge: string;
  references: string;
  revisionWhat: string;
  revisionWhy: string;
  secondLanguage: string;
};
export const researchFields = [
  'question',
  'method',
  'conditions',
  'source',
  'claim',
  'reasoning',
  'mechanism',
  'limitation',
  'alternative',
  'nextQuestion',
  'variable',
  'measured',
  'controls',
  'sampling',
  'challenge',
  'references',
  'revisionWhat',
  'revisionWhy',
  'secondLanguage',
] as const;
export const speechTitles = [
  t('问题与研究边界', 'Question and scope'),
  t('来源、方法与原始数据', 'Source, method and raw data'),
  t('分析、证据与机制假设', 'Analysis, evidence and mechanism hypothesis'),
  t('局限与替代解释', 'Limits and alternative explanations'),
  t('下一步研究与带走的结论', 'Next investigation and takeaway'),
];
export type SpeechSegment = {
  seconds: number;
  notes: string;
  otherLanguage: string;
};
export type ResearchCase = {
  text: ResearchText;
  citations: string[];
  scope: Scope;
  graph: GraphKind;
  records: PlantRecord[];
  activePlant: string;
  startDate: string;
  calculations: [string, string];
  speech: SpeechSegment[];
  rubric: boolean[];
  savedAt?: number;
};
export type GraduationDraft = {
  active: GraduationCaseId;
  cases: Record<GraduationCaseId, ResearchCase>;
  answers: Record<string, number>;
};
export const wolfSource = official.source;
export const wolfRecords = official.records;
export const wolfSourceTotals = official.sourceTotalsForCrosscheckOnly;
export type WolfRecord = (typeof wolfRecords)[number];
export const datasetLimits = t(
  '年末监测快照，不是密度、出生率或存活率；0只年末幼狼不等于全年没有出生。7个狼群、1个新群体、2条独居类别，共10个来源表行；它们不是10次独立实验。84只不是逐只实测记录。地区差异不证明因果，疾病与迁移未由本表测量。',
  'An end-of-year monitoring snapshot, not density, birth rate or survival. Zero year-end pups does not mean no births during the year. Seven packs, one new group and two loner categories give ten source-table rows, not ten independent experiments or 84 individual field records. Regional differences do not establish causes; disease and movement were not measured in this table.',
);
export const observationLimits = t(
  '仅观察熟悉的现有室内植物；不改变照料、不摘样、不测人体健康。自录数据为学生自述，未经外部核验。重复测同一株是纵向n=1，记录次数不是独立重复数；缺失不是0。',
  'Observe a familiar existing indoor plant only. Keep its normal care, do not collect samples or measure human health. Student-entered observations are self-reported and not externally verified. Repeated measurements of one plant are longitudinal n=1, not independent replicates. Missing is not zero.',
);
export const manualRubric = [
  t(
    '我核对了来源、纳入范围、单位和缺失值。',
    'I checked provenance, inclusion scope, units and missing values.',
  ),
  t(
    '我的主张与引用数值相符，并区分机制假设和实测。',
    'My claim matches the cited values and distinguishes hypotheses from measurements.',
  ),
  t(
    '我考虑了替代解释、独立重复和可挑战结论的新证据。',
    'I considered alternatives, independent replication and evidence that could challenge my claim.',
  ),
  t(
    '我已排练并按需要修改；计划时间不证明实际讲述时间。',
    'I rehearsed and revised as needed; planned time does not prove actual speaking time.',
  ),
];
export function emptyResearchCase(): ResearchCase {
  return {
    text: Object.fromEntries(
      researchFields.map((key) => [key, '']),
    ) as ResearchText,
    citations: [],
    scope: 'all',
    graph: 'counts',
    records: [],
    activePlant: '',
    startDate: '',
    calculations: ['', ''],
    speech: speechTitles.map(() => ({
      seconds: 45,
      notes: '',
      otherLanguage: '',
    })),
    rubric: manualRubric.map(() => false),
  };
}
export function emptyGraduationProject(): GraduationDraft {
  return {
    active: 'official',
    cases: { official: emptyResearchCase(), observation: emptyResearchCase() },
    answers: {},
  };
}
export function ratioPercent(
  numerator: number,
  denominator: number,
): number | null {
  return Number.isFinite(numerator) &&
    Number.isFinite(denominator) &&
    denominator !== 0
    ? (numerator / denominator) * 100
    : null;
}
export function scopedWolfRecords(scope: Scope) {
  return wolfRecords.filter((row) => scope === 'all' || row.region === scope);
}
export function wolfSummary(scope: Scope) {
  const rows = scopedWolfRecords(scope);
  const adults = rows.reduce((sum, row) => sum + row.adults, 0);
  const pups = rows.reduce((sum, row) => sum + row.pups, 0);
  const total = rows.reduce((sum, row) => sum + row.total, 0);
  return {
    adults,
    pups,
    total,
    share: ratioPercent(pups, total),
    rows: rows.length,
  };
}
export function plantAnalysis(c: ResearchCase) {
  const selected = c.records
    .filter((r) => r.plant === c.activePlant)
    .sort((a, b) => a.day - b.day);
  const valid = selected.filter(
    (r): r is PlantRecord & { value: number } => r.value !== null,
  );
  const first = valid[0],
    last = valid.at(-1);
  const difference = first && last ? last.value - first.value : null;
  return {
    selected,
    valid,
    difference,
    relative:
      first && difference !== null
        ? ratioPercent(difference, first.value)
        : null,
    excluded: c.records
      .filter((r) => r.plant !== c.activePlant || r.value === null)
      .map((r) => ({
        ...r,
        reason:
          r.plant !== c.activePlant
            ? 'Other plant / 其他植株'
            : 'Missing height / 高度缺失',
      })),
  };
}
export function validISODate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const stamp = Date.parse(`${value}T00:00:00Z`);
  return (
    Number.isFinite(stamp) &&
    new Date(stamp).toISOString().slice(0, 10) === value &&
    Number(value.slice(0, 4)) >= 1900
  );
}
export function observationDate(c: ResearchCase, day: number) {
  if (!validISODate(c.startDate)) return '—';
  return new Date(Date.parse(`${c.startDate}T00:00:00Z`) + day * 86400000)
    .toISOString()
    .slice(0, 10);
}
export function validPlantRecords(records: unknown): records is PlantRecord[] {
  if (!Array.isArray(records) || records.length > 100) return false;
  const ids = new Set<string>(),
    days = new Set<string>();
  return records.every((r) => {
    if (
      !r ||
      typeof r !== 'object' ||
      typeof r.id !== 'string' ||
      !/^P[0-9a-z-]{1,70}$/i.test(r.id) ||
      ids.has(r.id) ||
      typeof r.plant !== 'string' ||
      !r.plant.trim() ||
      r.plant.length > 80 ||
      !Number.isInteger(r.day) ||
      r.day < 0 ||
      r.day > 36500 ||
      (r.value !== null &&
        (typeof r.value !== 'number' ||
          !Number.isFinite(r.value) ||
          r.value < 0 ||
          r.value > 10000))
    )
      return false;
    const key = `${r.plant}\0${r.day}`;
    if (days.has(key)) return false;
    ids.add(r.id);
    days.add(key);
    return true;
  });
}
export function validCitationIds(
  id: GraduationCaseId,
  c: ResearchCase,
): string[] {
  return id === 'official'
    ? scopedWolfRecords(c.scope).map((r) => r.id)
    : plantAnalysis(c).valid.map((r) => r.id);
}
export function editGraduationCase(
  draft: GraduationDraft,
  id: GraduationCaseId,
  patch: Partial<ResearchCase>,
): GraduationDraft {
  const previous = draft.cases[id];
  const changed = { ...previous, ...patch, savedAt: undefined };
  if (
    id === 'observation' &&
    patch.records &&
    !changed.records.some((r) => r.plant === changed.activePlant)
  )
    changed.activePlant = changed.records[0]?.plant ?? '';
  const allowed = new Set(validCitationIds(id, changed));
  const scopeChanged =
    previous.scope !== changed.scope ||
    previous.activePlant !== changed.activePlant ||
    previous.startDate !== changed.startDate;
  changed.citations = scopeChanged
    ? []
    : changed.citations.filter((citation) => {
        if (!allowed.has(citation)) return false;
        if (id !== 'observation' || !patch.records) return true;
        const before = previous.records.find((r) => r.id === citation),
          after = changed.records.find((r) => r.id === citation);
        return (
          !!before &&
          !!after &&
          before.plant === after.plant &&
          before.day === after.day &&
          before.value === after.value
        );
      });
  return { ...draft, cases: { ...draft.cases, [id]: changed } };
}
export function calculationFeedback(
  id: GraduationCaseId,
  c: ResearchCase,
  index: number,
): { correct: boolean; text: string } {
  const raw = c.calculations[index];
  const answer =
    raw?.trim() && /^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw.trim())
      ? Number(raw)
      : NaN;
  let expected: number | null, explanation: string;
  if (id === 'official') {
    expected = index === 0 ? (17 / 53) * 100 : (17 / 84) * 100;
    explanation =
      index === 0
        ? '17 ÷ 53 × 100 = 32.08%. 分母是北部全部53只，不是36只成年狼。 / The denominator is all 53 northern wolves, not 36 adults.'
        : '17 ÷ 84 × 100 = 20.24%. 分母是全园84只；与32.08%相差11.84个百分点，不是11.84%的相对变化。 / Use all 84 wolves; the difference from 32.08% is 11.84 percentage points, not a relative change of 11.84%.';
  } else {
    const analysis = plantAnalysis(c);
    expected = index === 0 ? analysis.difference : analysis.relative;
    explanation =
      index === 0
        ? `末次有效高度−首次有效高度 / Last minus first valid height = ${formatNumber(expected)} cm`
        : `变化÷首次有效高度×100 / Change ÷ first valid height ×100 = ${formatNumber(expected)}%. 首值0时未定义，填NA。 / If first height is zero, enter NA.`;
  }
  return {
    correct:
      expected === null
        ? raw?.trim().toUpperCase() === 'NA'
        : Number.isFinite(answer) && Math.abs(answer - expected) <= 0.02,
    text: explanation,
  };
}
export function speechSeconds(c: ResearchCase) {
  return c.speech.reduce((sum, s) => sum + s.seconds, 0);
}
export function caseProblems(id: GraduationCaseId, c: ResearchCase): string[] {
  const problems: string[] = [];
  const required = researchFields.filter((key) => key !== 'secondLanguage');
  if (!required.every((key) => c.text[key].trim()))
    problems.push(
      '完成研究文字（任选语言） / Complete research fields in either language',
    );
  if (
    new Set(c.citations).size < 2 ||
    !c.citations.every((citation) => validCitationIds(id, c).includes(citation))
  )
    problems.push(
      '引用至少两条有效的不同记录 / Cite at least two distinct valid records',
    );
  if (
    id === 'observation' &&
    (!validISODate(c.startDate) ||
      !validPlantRecords(c.records) ||
      c.records.length < 3 ||
      plantAnalysis(c).valid.length < 3)
  )
    problems.push(
      '自录至少三个不同日有效高度并选择植株和有效起始日期 / Enter three valid heights on distinct days, choose a plant and a valid start date',
    );
  if (![0, 1].every((i) => calculationFeedback(id, c, i).correct))
    problems.push('完成两次数值核对 / Complete both quantitative checks');
  const total = speechSeconds(c);
  if (
    c.speech.length !== 5 ||
    c.speech.some(
      (s) =>
        !s.notes.trim() ||
        !Number.isInteger(s.seconds) ||
        s.seconds < 1 ||
        s.seconds > 300,
    ) ||
    total < 180 ||
    total > 300
  )
    problems.push(
      '五段讲稿均需自己的笔记，计划总计180–300秒 / Add your own notes to five segments and plan 180–300 seconds',
    );
  if (!c.rubric.every(Boolean))
    problems.push('完成手动自核与排练 / Complete manual review and rehearsal');
  return problems;
}
export function graduationCaseReady(id: GraduationCaseId, c: ResearchCase) {
  return caseProblems(id, c).length === 0;
}
export function validGraduationTimestamp(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isSafeInteger(value) &&
    value > 0 &&
    value <= 8640000000000000
  );
}
export function saveGraduationCase(
  draft: GraduationDraft,
  id: GraduationCaseId,
  now = Date.now(),
): GraduationDraft {
  if (
    !graduationCaseReady(id, draft.cases[id]) ||
    !validGraduationTimestamp(now)
  )
    return draft;
  return {
    ...draft,
    cases: { ...draft.cases, [id]: { ...draft.cases[id], savedAt: now } },
  };
}
export const graduationQuestionLessons = [
  'L123',
  'L127',
  'L131',
  'L134',
  'L138',
  'L143',
];
export const graduationQuestions = [
  q(
    'S06-Q1',
    'reasoning',
    t(
      '读取mRNA AUG–GCC–UAA（标准遗传密码，AUG为起始）得到什么？若GCC变GCU呢？',
      'Read mRNA AUG–GCC–UAA with the standard code and AUG as start. What is produced, and what if GCC changes to GCU?',
    ),
    [
      t(
        '2个氨基酸；UAA终止，GCC→GCU仍编码Ala',
        '2 amino acids; UAA stops translation, and GCC→GCU still encodes Ala',
      ),
      t('3个氨基酸；UAA也加入一项', '3 amino acids; UAA adds another residue'),
      t(
        '2个氨基酸；每个碱基替换一定改变氨基酸',
        '2 amino acids; every base substitution changes an amino acid',
      ),
    ],
    0,
    t(
      'AUG编码Met，GCC编码Ala，UAA为终止密码子，不编码氨基酸。GCU同样编码Ala，是此编码区的同义替换；不能据此保证所有生物学后果都不变。',
      'AUG encodes Met, GCC encodes Ala, and UAA is a stop codon, not an amino acid. GCU also encodes Ala: a synonymous coding substitution, which does not guarantee every biological effect is unchanged.',
    ),
    t(
      '回看L123的密码子、tRNA与终止步骤。',
      'Revisit codons, tRNAs and termination in L123.',
    ),
  ),
  q(
    'S06-Q2',
    'reasoning',
    t(
      '简化卡尔文循环每净产1 μmol G3P需3 μmol CO₂、9 μmol ATP和6 μmol NADPH。现有6、18、6 μmol，最多净产多少？只加ATP有帮助吗？',
      'A simplified Calvin-cycle budget needs 3 μmol CO₂, 9 μmol ATP and 6 μmol NADPH per 1 μmol net G3P. Supplies are 6, 18 and 6 μmol. What is the maximum net G3P, and would ATP alone help?',
    ),
    [
      t('2 μmol；只需按CO₂计算', '2 μmol; CO₂ alone sets the answer'),
      t(
        '1 μmol；NADPH限制，只加ATP不提高此预算上限',
        '1 μmol; NADPH limits the budget, so ATP alone does not raise the maximum',
      ),
      t(
        '1 μmol每秒；这是反应速率',
        '1 μmol per second; the budget gives a reaction rate',
      ),
    ],
    1,
    t(
      'min(6/3,18/9,6/6)=min(2,2,1)=1 μmol净G3P。NADPH是此预算的限制资源；没有时间、动力学信息，不能称μmol/s速率。',
      'min(6/3,18/9,6/6)=min(2,2,1)=1 μmol net G3P. NADPH is limiting in this budget; without timing or kinetics this is not a rate in μmol/s.',
    ),
    t(
      '回看L127的净G3P化学计量预算与限制资源。',
      'Revisit the net-G3P stoichiometric budget and limiting resources in L127.',
    ),
  ),
  q(
    'S06-Q3',
    'reasoning',
    t(
      '延迟反馈模型中，连续三个时点的“测量值−目标值”为10、4、−2。哪项解释合适？',
      'In a delayed-feedback model, measured value minus target is 10, 4 and −2 at successive times. Which interpretation is justified?',
    ),
    [
      t('−2表示激素浓度是负数', '−2 means a negative hormone concentration'),
      t(
        '偏差一次变号就足以诊断调节疾病',
        'One sign change diagnoses a regulatory disease',
      ),
      t(
        '响应已越过目标2单位；延迟可产生过冲，这些偏差不能诊断个体',
        'The response has overshot the target by 2 units; delay can cause overshoot, and these deviations do not diagnose an individual',
      ),
    ],
    2,
    t(
      '−2是相对目标的有符号偏差，不是物质浓度。延迟负反馈可过冲或振荡；三点模型输出不构成临床诊断，也不证明无限发散。',
      '−2 is a signed deviation from the target, not a substance concentration. Delayed negative feedback can overshoot or oscillate; three model points neither diagnose disease nor establish unbounded divergence.',
    ),
    t(
      '回看L131的延迟、目标与偏差曲线。',
      'Revisit delay, target and deviation curves in L131.',
    ),
  ),
  q(
    'S06-Q4',
    'reasoning',
    t(
      '同为二倍体，20个个体的等位基因频率p=0.4，迁入10个个体p=0.8，混合后（繁殖前）p是多少？',
      'Twenty diploid individuals have allele frequency p=0.4; ten immigrants have p=0.8. Before reproduction, what is p after mixing?',
    ),
    [
      t(
        '约0.533；按个体数加权，此变化不必由自然选择造成',
        'About 0.533; weight by individual counts, and this change need not be natural selection',
      ),
      t('0.6；两个频率直接平均', '0.6; average the two frequencies equally'),
      t(
        '0.8；迁入等位基因一定更适应',
        '0.8; immigrant alleles must be more adaptive',
      ),
    ],
    0,
    t(
      '(20×0.4+10×0.8)/(20+10)=16/30≈0.533；同倍性时按个体或等位基因拷贝数加权一致。这里是基因流的混合效应，不证明选择或适应。',
      '(20×0.4+10×0.8)/(20+10)=16/30≈0.533. Equal ploidy makes weighting by individuals equivalent to weighting by allele copies. This is gene-flow mixing and does not establish selection or adaptation.',
    ),
    t(
      '回看L134的加权迁移模型与机制区分。',
      'Revisit weighted migration and mechanism distinctions in L134.',
    ),
  ),
  q(
    'S06-Q5',
    'reasoning',
    t(
      '虚拟电泳有效阳性/阴性对照均符合预期，两个样本在同一检测位点都显示约400 bp条带。可支持哪项？',
      'Virtual gel positive/negative controls behave as expected. Two samples show approximately 400 bp bands at the same tested locus. What does this support?',
    ),
    [
      t(
        '两条DNA的每个碱基序列相同',
        'Every base in the two DNA sequences is identical',
      ),
      t(
        '该检测范围内片段大小相似；同长度可有不同序列，不能确认唯一身份',
        'Similar fragment size within this assay; equal lengths can contain different sequences and do not establish unique identity',
      ),
      t(
        '有效对照使全部基因组与身份都已确认',
        'Valid controls confirm the entire genome and identity',
      ),
    ],
    1,
    t(
      '约400 bp只约束片段长度。比如400个位置中一个A换成G，长度仍400 bp；有效对照帮助解释本次检测，却不会读取序列或扩展检测位点。',
      'Approximately 400 bp constrains fragment length. Replacing one A with G among 400 positions keeps 400 bp. Valid controls support interpretation of this assay; they do not read sequence or extend the tested loci.',
    ),
    t(
      '回看L138的片段大小、对照与身份推断边界。',
      'Revisit fragment size, controls and identity boundaries in L138.',
    ),
  ),
  q(
    'S06-Q6',
    'reasoning',
    t(
      '同株第1/3/7/10日高度为2/4/NA/0 cm。有效高度算术平均、有效记录数、独立植株数分别是？',
      'One plant has heights 2/4/NA/0 cm on days 1/3/7/10. What are the arithmetic mean of valid heights, valid reading count and independent plant count?',
    ),
    [
      t(
        '1.5 cm、4条、4株；把NA补0',
        '1.5 cm, 4 readings, 4 plants; replace NA with zero',
      ),
      t(
        '3 cm、2条、1株；把真实0删去',
        '3 cm, 2 readings, 1 plant; discard the real zero',
      ),
      t(
        '2 cm、3条、1株；NA缺失，真实0保留',
        '2 cm, 3 readings, 1 plant; NA is missing and the real zero remains',
      ),
    ],
    2,
    t(
      '(2+4+0)/3=2 cm。NA不是0，也不删除真实0；三个有效记录仍来自同株，独立植株n=1。该均值是记录的算术平均，并非不等间隔时间加权平均。',
      '(2+4+0)/3=2 cm. NA is not zero and real zero is retained. Three valid readings still come from one plant: independent plant n=1. This is the reading-wise arithmetic mean, not an unequal-interval time-weighted average.',
    ),
    t(
      '回看L143的缺失值、分母与取样单位。',
      'Revisit missing values, denominators and sampling units in L143.',
    ),
  ),
];
export function graduationUnderstanding(d: GraduationDraft) {
  return {
    answered: graduationQuestions.filter((q) => d.answers[q.id] !== undefined)
      .length,
    correct: graduationQuestions.filter((q) => d.answers[q.id] === q.correct)
      .length,
  };
}
export function formatNumber(value: number | null) {
  return value === null ? 'NA / 未定义' : Number(value.toFixed(2)).toString();
}
export function structuredAbstract(id: GraduationCaseId, c: ResearchCase) {
  if (id === 'official') {
    const s = wolfSummary(c.scope);
    return t(
      `问题：${c.scope}的年末年龄组成如何？方法：对NPS 2025-12-31监测表的${s.rows}行分组计数求和。结果：成年${s.adults}只，幼狼${s.pups}只，共${s.total}只；合并幼狼比例${formatNumber(s.share)}%。解释边界：描述快照，不能推断出生率、存活率或地区因果。`,
      `Question: What is the year-end age composition in ${c.scope}? Method: Sum ${s.rows} grouped rows from the NPS monitoring table dated 2025-12-31. Results: ${s.adults} adults and ${s.pups} pups, ${s.total} wolves in total; pooled pup share ${formatNumber(s.share)}%. Interpretation: This descriptive snapshot does not estimate birth rates, survival or regional causes.`,
    );
  }
  const a = plantAnalysis(c);
  return t(
    `问题：植株${c.activePlant || '（未选）'}的高度随记录日怎样变化？方法：学生自录、正常照料下观察；选中${a.valid.length}次有效记录，单位cm。结果：末次减首次${formatNumber(a.difference)} cm，相对变化${formatNumber(a.relative)}%。边界：单株纵向n=1，数据未经外部核验，不能推断照料因素的因果作用。`,
    `Question: How did recorded height change for plant ${c.activePlant || '(not selected)'}? Method: Self-reported observations during normal care; ${a.valid.length} valid measurements in cm. Results: Last minus first height ${formatNumber(a.difference)} cm; relative change ${formatNumber(a.relative)}%. Limits: One plant is longitudinal n=1; records are not externally verified and do not establish causal effects of care conditions.`,
  );
}
export function actualGraduationCaption(id: GraduationCaseId, c: ResearchCase) {
  return id === 'official'
    ? t(
        `图：${c.scope}；${c.graph === 'counts' ? '分类成年/幼狼计数（只）' : '地区合并幼狼比例（%）'}。2025-12-31快照；不连成时间趋势。0/0为NA。`,
        `Figure: ${c.scope}; ${c.graph === 'counts' ? 'categorical adult/pup counts (wolves)' : 'region-pooled pup share (%)'}. Snapshot on 2025-12-31, not a time trend; 0/0 is NA.`,
      )
    : t(
        `图：仅植株${c.activePlant || '（未选）'}，横轴实际经过日，纵轴高度cm；缺失不补0，断开连线。`,
        `Figure: plant ${c.activePlant || '(not selected)'} only; actual elapsed days on x, height in cm on y; missing values are not zero and break lines.`,
      );
}
function recordObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Invalid graduation object');
  return value as Record<string, unknown>;
}
function boundedText(value: unknown, max = 20000) {
  if (typeof value !== 'string' || value.length > max)
    throw new Error('Invalid graduation text');
  return value;
}
function decodeCase(value: unknown, id: GraduationCaseId): ResearchCase {
  const raw = recordObject(value),
    text = recordObject(raw.text),
    c = emptyResearchCase();
  for (const key of researchFields) c.text[key] = boundedText(text[key]);
  if (
    !['all', 'Northern Range', 'Interior'].includes(raw.scope as string) ||
    !['counts', 'shares'].includes(raw.graph as string)
  )
    throw new Error('Invalid analysis scope');
  c.scope = raw.scope as Scope;
  c.graph = raw.graph as GraphKind;
  if (!validPlantRecords(raw.records)) throw new Error('Invalid plant records');
  c.records = raw.records.map((r) => ({
    id: r.id,
    plant: r.plant,
    day: r.day,
    value: r.value,
  }));
  c.activePlant = boundedText(raw.activePlant, 80);
  c.startDate = boundedText(raw.startDate, 10);
  if (id === 'official' && (c.records.length || c.activePlant || c.startDate))
    throw new Error('Official case cannot contain observation records');
  if (id === 'observation' && (c.scope !== 'all' || c.graph !== 'counts'))
    throw new Error('Invalid observation analysis mode');
  if (c.startDate && !validISODate(c.startDate))
    throw new Error('Invalid start date');
  if (
    c.records.length &&
    (!c.activePlant || !c.records.some((r) => r.plant === c.activePlant))
  )
    throw new Error('Invalid active plant');
  if (
    !Array.isArray(raw.citations) ||
    raw.citations.length > 100 ||
    !raw.citations.every((x) => typeof x === 'string') ||
    new Set(raw.citations).size !== raw.citations.length
  )
    throw new Error('Invalid citations');
  c.citations = raw.citations as string[];
  if (!c.citations.every((x) => validCitationIds(id, c).includes(x)))
    throw new Error('Out-of-scope citation');
  if (!Array.isArray(raw.calculations) || raw.calculations.length !== 2)
    throw new Error('Invalid calculations');
  c.calculations = [
    boundedText(raw.calculations[0], 80),
    boundedText(raw.calculations[1], 80),
  ];
  if (!Array.isArray(raw.speech) || raw.speech.length !== 5)
    throw new Error('Invalid speech');
  c.speech = raw.speech.map((s) => {
    const segment = recordObject(s);
    if (
      !Number.isInteger(segment.seconds) ||
      (segment.seconds as number) < 1 ||
      (segment.seconds as number) > 300
    )
      throw new Error('Invalid speech time');
    return {
      seconds: segment.seconds as number,
      notes: boundedText(segment.notes),
      otherLanguage: boundedText(segment.otherLanguage),
    };
  });
  if (
    !Array.isArray(raw.rubric) ||
    raw.rubric.length !== manualRubric.length ||
    !raw.rubric.every((x) => typeof x === 'boolean')
  )
    throw new Error('Invalid rubric');
  c.rubric = raw.rubric as boolean[];
  if (raw.savedAt !== undefined) {
    if (!validGraduationTimestamp(raw.savedAt) || !graduationCaseReady(id, c))
      throw new Error('Invalid saved graduation case');
    c.savedAt = raw.savedAt;
  }
  return c;
}
export function decodeGraduationProject(value: unknown): GraduationDraft {
  const raw = recordObject(value),
    cases = recordObject(raw.cases),
    answers = recordObject(raw.answers);
  if (!graduationCases.includes(raw.active as GraduationCaseId))
    throw new Error('Invalid graduation case');
  const d = emptyGraduationProject();
  d.active = raw.active as GraduationCaseId;
  for (const id of graduationCases) d.cases[id] = decodeCase(cases[id], id);
  for (const [key, choice] of Object.entries(answers)) {
    const question = graduationQuestions.find((q) => q.id === key);
    if (
      !question ||
      !Number.isInteger(choice) ||
      (choice as number) < 0 ||
      (choice as number) >= question.options.length
    )
      throw new Error('Invalid graduation answer');
    d.answers[key] = choice as number;
  }
  return d;
}
