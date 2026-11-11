import { q, t } from './schema';
import { defaultEnzymeConditions, enzymeRate } from './divisionEnzymeModel';
import { photosynthesisRate } from './energyGeneModel';
import { disturbanceComparison } from './evolutionCycleModel';

export const storyTopics = ['plant', 'enzyme', 'ecology'] as const;
export type StoryTopic = (typeof storyTopics)[number];
export const storyNames = {
  plant: t('植物生长', 'Plant growth'),
  enzyme: t('酶活性', 'Enzyme activity'),
  ecology: t('生态变化', 'Ecological change'),
};
export const frameNames = [
  t('① 现象', '① Phenomenon'),
  t('② 微观机制', '② Microscopic mechanism'),
  t('③ 条件对照', '③ Controlled comparison'),
  t('④ 可检验预测', '④ Testable prediction'),
];
export type StoryCase = {
  frames: { zh: string; en: string }[];
  citations: string[];
  observation: string;
  assumptions: string;
  chain: string;
  variable: string;
  measured: string;
  controls: string;
  repeats: number;
  challenge: string;
  zh: string;
  en: string;
  input: number;
  savedAt?: number;
};
export type StoryDraft = {
  topic: StoryTopic;
  cases: Record<StoryTopic, StoryCase>;
  answers: Record<string, number>;
};
export const emptyStoryCase = (topic: StoryTopic): StoryCase => ({
  frames: Array.from({ length: 4 }, () => ({ zh: '', en: '' })),
  citations: ['', ''],
  observation: '', assumptions: '', chain: '', variable: '', measured: '',
  controls: '', repeats: 3, challenge: '', zh: '', en: '',
  input: topic === 'plant' ? 20 : topic === 'enzyme' ? 5 : 0,
});
export const emptyStoryProject = (): StoryDraft => ({
  topic: 'plant',
  cases: { plant: emptyStoryCase('plant'), enzyme: emptyStoryCase('enzyme'), ecology: emptyStoryCase('ecology') },
  answers: {},
});
export const plantObservations = [
  { light: 20, baselineCohort: 'P20-D0', endpointCohort: 'P20-D7', initial: [0.2, 0.2, 0.2], final: [0.28, 0.3, 0.32] },
  { light: 60, baselineCohort: 'P60-D0', endpointCohort: 'P60-D7', initial: [0.2, 0.2, 0.2], final: [0.44, 0.46, 0.48] },
] as const;
export const mean = (values: readonly number[]) => values.reduce((a, b) => a + b, 0) / values.length;
export function storyEvidence(topic: StoryTopic, input: number) {
  if (topic === 'plant') return plantObservations.map((row, i) => ({
    id: `plant-${i}`, label: t(`光指数${row.light}：基线组第0天均值0.20 g；独立终点组第7天均值${mean(row.final).toFixed(2)} g；干质量组均值差${(mean(row.final) - mean(row.initial)).toFixed(2)} g`, `Light index ${row.light}: baseline-cohort day 0 mean 0.20 g; separate endpoint-cohort day 7 mean ${mean(row.final).toFixed(2)} g; dry-mass difference of cohort means ${(mean(row.final) - mean(row.initial)).toFixed(2)} g`),
    value: mean(row.final),
  }));
  if (topic === 'enzyme') return [
    { id: 'enzyme-cold', temp: 5, history: 'cooled' as const, name: t('冷却后在5°C测定', 'Cooled, assayed at 5°C') },
    { id: 'enzyme-rewarm', temp: 40, history: 'cooled' as const, name: t('同类酶复温至40°C', 'Same enzyme type rewarmed to 40°C') },
    { id: 'enzyme-intact', temp: 40, history: 'fresh' as const, name: t('未损伤对照，40°C测定', 'Intact control, assayed at 40°C') },
    { id: 'enzyme-damaged', temp: 40, history: 'heated' as const, name: t('先75°C处理10分钟，再40°C测定', '75°C for 10 min, then assayed at 40°C') },
  ].map((r) => { const value = enzymeRate({ ...defaultEnzymeConditions, temperatureC: r.temp, history: r.history }); return { id: r.id, label: t(`${r.name.zh}：${value.toFixed(1)}相对初速单位`, `${r.name.en}: ${value.toFixed(1)} relative initial-rate units`), value }; });
  const disturbance = input === 0 ? 'drought' : 'flood';
  return (['diverse', 'redundant', 'single'] as const).flatMap((community, i) => {
    const result = disturbanceComparison({ community, disturbance });
    const names = [t('A 四种不同耐湿性', 'A Four different moisture tolerances'), t('B 四种相近敏感性', 'B Four similar sensitivities'), t('C 一种耐旱分解者', 'C One drought-tolerant decomposer')];
    return result.records.map((r) => ({ id: `ecology-${disturbance}-${community}-${r.time}`, label: t(`${names[i]!.zh}：第${r.time}天分解功能指数${r.function}`, `${names[i]!.en}: day ${r.time} decomposition index ${r.function}`), value: r.function }));
  });
}
export function storyModelValue(topic: StoryTopic, input: number) {
  if (topic === 'plant') return photosynthesisRate({ light: input, co2: 60, temperature: 25 }).rate;
  if (topic === 'enzyme') return enzymeRate({ ...defaultEnzymeConditions, temperatureC: input, history: 'cooled' });
  return disturbanceComparison({ community: 'diverse', disturbance: input === 0 ? 'drought' : 'flood' }).resilience;
}
export function storyInputValid(topic: StoryTopic, n: number) {
  return Number.isFinite(n) && (topic === 'plant' ? [20, 60].includes(n) : topic === 'enzyme' ? [5, 40].includes(n) : [0, 1].includes(n));
}
export function storyCaseReady(topic: StoryTopic, d: StoryCase) {
  const ids = storyEvidence(topic, d.input).map((r) => r.id);
  return storyInputValid(topic, d.input) && d.frames.length === 4 && d.frames.every((f) => !!(f.zh.trim() || f.en.trim())) &&
    d.citations.length === 2 && d.citations[0] !== d.citations[1] && d.citations.every((id) => ids.includes(id)) &&
    ['observation', 'assumptions', 'chain', 'variable', 'measured', 'controls', 'challenge'].every((k) => !!d[k as 'observation'].trim()) &&
    Number.isInteger(d.repeats) && d.repeats >= 2 && d.repeats <= 30 && !!(d.zh.trim() || d.en.trim());
}
export function editStoryCase(d: StoryDraft, topic: StoryTopic, patch: Partial<StoryCase>): StoryDraft {
  return { ...d, cases: { ...d.cases, [topic]: { ...d.cases[topic], ...patch, savedAt: undefined } } };
}
const revisit = t('回看对应单元，找出证据、机制与适用条件。', 'Revisit the unit: separate evidence, mechanism and conditions.');
export const storyQuestionLessons = ['L075', 'L079', 'L082', 'L087', 'L090', 'L096'];
export const storyStageQuestions = [
  q('S04-q1', 'concept', t('正常有丝分裂前复制DNA，怎样保持遗传信息？', 'How does copying DNA before normal mitosis help preserve information?'), [t('先复制DNA，再将副本分给子细胞；染色体组数不变，复制错误仍可能发生', 'Copy DNA, then partition copies to daughters; ploidy stays the same and copying errors remain possible'), t('每个子细胞只分到原来一半种类的基因', 'Each daughter gets half the kinds of genes'), t('细胞变大就自动产生相同信息', 'Growth automatically creates identical information')], 0, t('复制与分配是两个环节；复制不等于绝对无误。', 'Copying and distribution are separate; copying is not infallible.'), revisit),
  q('S04-q2', 'reasoning', t('冷酶复温恢复活性，受损酶复温未恢复，支持什么？', 'Cold enzyme recovers on warming, damaged enzyme does not. What follows?'), [t('所有酶都在40°C最好', 'All enzymes work best at 40°C'), t('低温减慢与结构损伤可能不同，需相同测定条件对照', 'Slowing in cold differs from structural damage; compare at the same assay conditions'), t('冷却能修复所有变性酶', 'Cooling repairs every denatured enzyme')], 1, t('虚构酶E的温度与热史是两变量；这些结果不是所有酶的阈值。', 'Temperature and prior treatment differ; fictional enzyme E does not set universal thresholds.'), revisit),
  q('S04-q3', 'reasoning', t('增加光却不提高模型速率，最合理的下一步？', 'More light does not raise the model rate. What next?'), [t('断言植物不需要光', 'Conclude plants need no light'), t('把光合作用速率直接改写成干质量', 'Rename photosynthesis rate as dry mass'), t('检查CO₂等限制因素，并把速率与生长测量分开', 'Check other limits such as CO₂; measure growth separately from rate')], 2, t('瓶颈规则是简化模型；净生物量还涉及呼吸、资源和时间。', 'The bottleneck is a simplification; net biomass also involves respiration, resources and time.'), revisit),
  q('S04-q4', 'concept', t('同一基因型能否在不同条件下呈现不同表型？', 'Can the same genotype show different phenotypes in different conditions?'), [t('可以；基因表达及环境共同影响，不能任意推断比例', 'Yes; expression and environment contribute, without arbitrary ratio predictions'), t('不能，DNA逐字决定所有可见差别', 'No; DNA fixes every visible difference'), t('可以，因为环境总会改变DNA序列', 'Yes, because environment always changes DNA sequence')], 0, t('表达改变不必改变序列；单基因课堂模型有明确条件。', 'Expression can change without sequence change; classroom single-gene models have stated conditions.'), revisit),
  q('S04-q5', 'reasoning', t('抗性变异在用药前已存在，用药后比例升高，怎样解释？', 'Resistance existed before treatment and became more common afterward. Why?'), [t('药物按需要创造了抗性', 'Treatment created resistance on demand'), t('不同变体存活和繁殖不同，使群体比例改变', 'Variants differ in survival and reproduction, changing population frequencies'), t('每个个体都努力变成抗性型', 'Every individual tried to become resistant')], 1, t('选择作用于已有差异，群体跨代改变；不按需要定向产生变异。', 'Selection acts on variation and changes populations across generations; variation is not generated on demand.'), revisit),
  q('S04-q6', 'reasoning', t('两组都有四种分解者，干旱后恢复不同，能推出什么？', 'Two four-species decomposer communities recover differently after drought. What follows?'), [t('物种越多就必然对所有扰动稳定', 'More species guarantee stability against every disturbance'), t('仅凭总功能就能确定每个物种的贡献', 'Total function alone reveals the contribution of every species'), t('功能差异和扰动类型重要；需重复实验，不能只数物种', 'Functional differences and disturbance matter; replicate rather than only counting species')], 2, t('共同敏感性可能限制补偿；功能指数不同于物种数，30天恢复不代表普遍速率。', 'Shared sensitivity can limit compensation; function is not richness and 30-day recovery is not a universal rate.'), revisit),
];
export const storyUnderstanding = (d: StoryDraft) => ({ answered: storyStageQuestions.filter((q) => d.answers[q.id] !== undefined).length, correct: storyStageQuestions.filter((q) => d.answers[q.id] === q.correct).length });
export function decodeStoryProject(value: unknown): StoryDraft {
  if (!value || typeof value !== 'object') throw new Error('Invalid storyboard');
  const raw = value as StoryDraft;
  if (!storyTopics.includes(raw.topic) || !raw.cases || !raw.answers || Array.isArray(raw.answers) || typeof raw.answers !== 'object') throw new Error('Invalid storyboard shape');
  const d = emptyStoryProject(); d.topic = raw.topic;
  for (const topic of storyTopics) {
    const c = raw.cases[topic];
    if (!c || !Array.isArray(c.frames) || c.frames.length !== 4 || !Array.isArray(c.citations) || c.citations.length !== 2 || !storyInputValid(topic, c.input) || !Number.isInteger(c.repeats) || c.repeats < 2 || c.repeats > 30) throw new Error('Invalid storyboard case');
    const next = emptyStoryCase(topic);
    for (const key of ['observation','assumptions','chain','variable','measured','controls','challenge','zh','en'] as const) {
      if (typeof c[key] !== 'string' || c[key].length > 1600) throw new Error('Invalid storyboard writing');
      next[key] = c[key];
    }
    next.frames = c.frames.map((f) => {
      if (!f || typeof f.zh !== 'string' || typeof f.en !== 'string' || f.zh.length > 1200 || f.en.length > 1200) throw new Error('Invalid storyboard frame');
      return { zh: f.zh, en: f.en };
    });
    const validIds = storyEvidence(topic, c.input).map((r) => r.id);
    if (c.citations.some((id) => typeof id !== 'string' || (id !== '' && !validIds.includes(id)))) throw new Error('Invalid evidence citation');
    next.citations = [...c.citations]; next.input = c.input; next.repeats = c.repeats;
    if (Number.isFinite(c.savedAt) && c.savedAt! > 0 && storyCaseReady(topic, next)) next.savedAt = c.savedAt;
    d.cases[topic] = next;
  }
  for (const q of storyStageQuestions) { const a = raw.answers[q.id]; if (a === undefined) continue; if (!Number.isInteger(a) || a < 0 || a >= q.options.length) throw new Error('Invalid storyboard answer'); d.answers[q.id] = a; }
  return d;
}


