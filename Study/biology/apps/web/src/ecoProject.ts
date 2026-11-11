import { q, t } from './schema';
import { estimateMeadow, meadowGrid, randomQuadrats } from './populationModel';

export type EcoDraft = {
  method: 'random' | 'chosen';
  seed: number;
  sampleIds: string[];
  estimate: string;
  claim: string;
  evidenceOne: string;
  evidenceTwo: string;
  reasoning: string;
  missingData: string;
  zh: string;
  en: string;
  answers: Record<string, number>;
  savedAt?: number;
};
export const emptyEcoProject = (): EcoDraft => ({
  method: 'random',
  seed: 42,
  sampleIds: randomQuadrats(42),
  estimate: '',
  claim: '',
  evidenceOne: '',
  evidenceTwo: '',
  reasoning: '',
  missingData: '',
  zh: '',
  en: '',
  answers: {},
});
const revisit = t(
  '回看相关课程的条件、原始记录和模型边界，再修改解释。',
  'Revisit the conditions, original records and model limits, then revise the explanation.',
);
export const ecoStageQuestions = [
  q(
    'S03-q1',
    'reasoning',
    t(
      '一种已知酵母帮助面团膨起，能推出什么？',
      'Known yeast helps dough rise. What follows?',
    ),
    [
      t(
        '所有微生物在任何位置都有益',
        'All microbes are helpful in every location',
      ),
      t(
        '本情境有作用证据，未知样本的角色仍需证据',
        'This case has effect evidence; unknown samples still need evidence',
      ),
      t(
        '看见气泡就能确定微生物身份与食用安全',
        'Bubbles establish microbial identity and food safety',
      ),
    ],
    1,
    t(
      '作用与条件支持本例用途；气泡不独立证明身份或安全，也不能把一个用途推广给全部微生物。',
      'Effects and conditions support this use. Bubbles alone do not establish identity or safety, and one use cannot represent all microbes.',
    ),
    revisit,
  ),
  q(
    'S03-q2',
    'concept',
    t(
      '比较草莓匍匐茎子株与有性繁殖的受精卵，哪句合理？',
      'Compare a strawberry runner daughter plant with a sexually produced zygote. Which statement fits?',
    ),
    [
      t(
        '两者都必须由两种配子融合形成',
        'Both must form by fusion of two gametes',
      ),
      t(
        '匍匐茎子株没有DNA，因为未受精',
        'Runner offspring lack DNA because no fertilisation occurred',
      ),
      t(
        '匍匐茎支路不经配子融合；受精卵重新组合两个配子的遗传贡献',
        'The runner branch has no gamete fusion; a zygote combines two gametes’ genetic contributions',
      ),
    ],
    2,
    t(
      '无性繁殖仍有DNA复制与细胞分裂。此处的有性路线有配子融合；这不保证后代全部性状可用单基因格子解释。',
      'Asexual reproduction still involves DNA copying and cell division. This sexual route includes gamete fusion, without making every trait a single-gene prediction.',
    ),
    revisit,
  ),
  q(
    'S03-q3',
    'reasoning',
    t(
      '缩手反射与内分泌响应都需要什么原则？',
      'Which principle applies to both withdrawal reflexes and endocrine responses?',
    ),
    [
      t(
        '信息到达适当接收结构，再经细胞活动形成响应',
        'Information reaches suitable receivers, followed by cellular activity producing a response',
      ),
      t(
        '所有信号到达的细胞都产生相同响应',
        'Every cell reached produces the same response',
      ),
      t(
        '两种响应都必须先等大脑有意识决定',
        'Both responses must wait for a conscious decision by the brain',
      ),
    ],
    0,
    t(
      '缩手有脊髓回路且脑可接收信息；激素响应依赖受体等条件。两者都不能把“到达”直接当作“必然完成所有响应”。',
      'Withdrawal uses spinal circuits and can inform the brain; hormone responses depend on receptors and other conditions. Arrival does not guarantee every possible response.',
    ),
    revisit,
  ),
  q(
    'S03-q4',
    'reasoning',
    t(
      '虚构水分模型中ADH增加，肾重吸收更多水、尿量相对减少，这是怎样的反馈？',
      'In the water model, more ADH increases kidney water reabsorption and reduces relative urine output. How is this feedback?',
    ),
    [
      t(
        'ADH与重吸收同时增加，所以一定是正反馈',
        'ADH and reabsorption both increase, so it must be positive feedback',
      ),
      t(
        '当它抵消原来的浓缩偏离时，是负反馈；不是把内部条件永远锁死',
        'It is negative feedback when it opposes the initial concentration disturbance, without fixing conditions forever',
      ),
      t(
        '负反馈意味着任何被调节的数值都只能下降',
        'Negative feedback means every regulated value can only fall',
      ),
    ],
    1,
    t(
      '肾重吸收把已有水返回体内，不创造水。响应方向需联系最初偏离判断；模型没有个人健康结论。',
      'Reabsorption returns existing water, not new water. Feedback direction is judged against the original disturbance; the model provides no individual health conclusion.',
    ),
    revisit,
  ),
  q(
    'S03-q5',
    'reasoning',
    t(
      '6个1m²样方共数18株，全场36m²，最合理的报告是什么？',
      'Six 1 m² quadrats contain 18 plants in a 36 m² field. Which report is justified?',
    ),
    [
      t(
        '样本密度18÷36=0.5株/m²，估计全场18株',
        'Sample density is 18÷36=0.5 per m², estimating 18 plants in the field',
      ),
      t(
        '全场确定有108株；随机样本永远无误差',
        'Exactly 108 plants; random samples never have error',
      ),
      t(
        '样本密度3株/m²，估计108株；代表性和抽样误差仍需讨论',
        'Sample density is 3 per m², estimating 108 plants; representativeness and sampling variation still matter',
      ),
    ],
    2,
    t(
      '分母是6m²抽样面积，再乘36m²。计算正确不保证样本有代表性；一次空间样本也不能独立确认降雨因果。',
      'Divide by 6 m² of sampled area, then multiply by 36 m². Correct arithmetic does not guarantee representation, and one spatial sample cannot establish a rainfall cause.',
    ),
    revisit,
  ),
];
export const ecoQuestionLessons = ['L050', 'L054', 'L059', 'L064', 'L067'];
export const ecoWritingFields = [
  'claim',
  'evidenceOne',
  'evidenceTwo',
  'reasoning',
  'missingData',
  'zh',
  'en',
] as const;
export function ecoEstimateCheck(d: EcoDraft) {
  if (!d.sampleIds.length || !d.estimate.trim()) return false;
  const value = Number(d.estimate);
  return (
    Number.isFinite(value) &&
    Math.abs(value - estimateMeadow(d.sampleIds).estimate) <= 0.5
  );
}
export function ecoTextReady(d: EcoDraft) {
  return (
    d.sampleIds.length >= 6 &&
    d.sampleIds.length <= 12 &&
    ecoWritingFields.every((key) => !!d[key].trim())
  );
}
export function ecoUnderstanding(d: EcoDraft) {
  return {
    answered: ecoStageQuestions.filter((q) => d.answers[q.id] !== undefined)
      .length,
    correct: ecoStageQuestions.filter((q) => d.answers[q.id] === q.correct)
      .length,
  };
}
export function decodeEcoProject(data: EcoDraft): EcoDraft {
  if (
    !data ||
    !['random', 'chosen'].includes(data.method) ||
    !Number.isInteger(data.seed) ||
    data.seed < 0 ||
    data.seed > 9999 ||
    !Array.isArray(data.sampleIds) ||
    data.sampleIds.length > 12 ||
    new Set(data.sampleIds).size !== data.sampleIds.length ||
    data.sampleIds.some(
      (id) => typeof id !== 'string' || !meadowGrid.some((q) => q.id === id),
    ) ||
    typeof data.estimate !== 'string' ||
    !data.answers ||
    typeof data.answers !== 'object' ||
    Array.isArray(data.answers) ||
    ecoWritingFields.some((key) => typeof data[key] !== 'string')
  )
    throw new Error('Invalid ecological project');
  if (data.method === 'random' && ![6, 12].includes(data.sampleIds.length))
    throw new Error('Invalid random sample size');
  if (
    data.method === 'random' &&
    data.sampleIds.join(',') !==
      randomQuadrats(data.seed, data.sampleIds.length).join(',')
  )
    throw new Error('Sample does not match random plan');
  const draft = emptyEcoProject();
  draft.method = data.method;
  draft.seed = data.seed;
  draft.sampleIds = [...data.sampleIds];
  draft.estimate = data.estimate.slice(0, 30);
  for (const key of ecoWritingFields) draft[key] = data[key].slice(0, 1500);
  for (const question of ecoStageQuestions) {
    const value = data.answers[question.id];
    if (value === undefined) continue;
    if (
      !Number.isInteger(value) ||
      value < 0 ||
      value >= question.options.length
    )
      throw new Error('Invalid ecological answer');
    draft.answers[question.id] = value;
  }
  if (
    Number.isFinite(data.savedAt) &&
    data.savedAt! > 0 &&
    ecoTextReady(draft) &&
    ecoEstimateCheck(draft)
  )
    draft.savedAt = data.savedAt;
  return draft;
}
