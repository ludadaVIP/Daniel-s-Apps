import { t } from '../model';
const e = (i: number, z: string, en: string, rz: string, re: string) => ({
  skill: `distribution-${i}`,
  sourceLesson: `H33-L0${i}`,
  sourceTask: `H33-L0${i}-Q6`,
  targets: ['H35', 'H38'].map((u) => `${u}-MAINT-DISTRIBUTION-Q${i}`),
  focus: t(z, en),
  rationale: t(rz, re),
});
export const distributionRecurrenceEvidence = [
  e(
    1,
    '编号原像与合法质量',
    'ID preimages and legal mass',
    '完整原编号表先均匀抽ID再映射新X和绝对值Y；重复值对应的编号均保留，用原像概率相加，不按不同取值平分。反查负项/不全和、合法零行及支持，两个后续单元重新生成不同分布。',
    'Complete ID tables map uniform IDs to new X and absolute-value Y. Equal-valued IDs retain their masses;preimages merge instead of reweighting distinct values equally. Negative/incomplete masses,legal zero rows and support are checked in two later contexts.',
  ),
  e(
    2,
    '期望、非可取总和与无补偿',
    'Expectation,unattainable totals and no compensation',
    '两张新非等权偏移表求均值2/11⁄2、期望位置单点率0及仿射期望。十次期望20/55均不在该次总和支持；条件率2/3或3/4不因过去偏小改变，区分有限波动、线性与独立及种子复现。',
    'New unequal-weight offset laws give means two/11⁄2,zero mass at the expectation and affine expectations. Ten-draw expected totals twenty/fifty-five are unattainable in those runs. Conditional chances2/3,3/4 persist after small outcomes,distinguishing finite fluctuations,linearity,independence and seeded reproducibility.',
  ),
  e(
    3,
    '加权平方距离与负尺度',
    'Weighted squared distance and negative scales',
    '新方差8/27⁄4用两式核，负倍率使方差72/27、标准差6√2/3√3；中心化通式证a²与|a|，不是样本n−1。零倍率分布合法而z未定义，保cm²与cm。',
    'Variances eight/27⁄4 are checked by both formulas. Negative scales give variances seventy-two/twenty-seven and SDs6√2/3√3. The centred identity proves a² and |a|,without a sample n−1 divisor. Zero scaling leaves a valid constant law but undefined z;cm² and cm stay distinct.',
  ),
  e(
    4,
    '二项前提、序列因子与退化',
    'Binomial premises,ordered factors and degeneracy',
    '两新固定独立同p模型亲算恰k、补事件及两矩；有序互斥序列解释组合因子。另两袋不放回给1/15与1/10，反驳独立套式；异p、结果停、n0/p0/p1逐项核条件。',
    'New fixed independent common-p laws require exact-k,complements and moments,with disjoint ordered strings explaining the combination factor. Two without-replacement bags give1/15,1/10,refuting independent formulas. Unequal p,outcome-based stopping and n0/p0/p1 boundaries are audited.',
  ),
  e(
    5,
    '密度、全轴尾部与形状限制',
    'Density,whole-line tails and shape limits',
    '实际双正态图明确均值/方差参数，σ加倍峰减半而全实轴面积1；单点0、区间约0.6827及图外非零尾部。另四ID对称分布同均值和σ却闭一σ概率1、开区间0，不将对称/钟形外观或有限频率当正态证明。',
    'Actual two-normal plots state mean/variance parameters:double SD halves peaks while whole-line areas remain one. Point mass zero,approximate0.6827 intervals and nonzero off-window tails are distinguished. Symmetric four-ID laws have the same moments but closed one-SD probability one,open zero;appearance/frequency does not certify normality.',
  ),
  e(
    6,
    '左尾表、z参照与非正态反例',
    'Left-tail tables,z references and nonnormal counterexamples',
    '实际六位左尾表生成0.8664/0.9545区间及0.0228/0.0668右尾，保原界/z界和舍入顺序。另四ID上值z1而左尾1，不是Φ1；零σ不可除，不同测量目标不能仅以同z评优劣。',
    'Actual six-decimal left-tail tables yield intervals0.8664/0.9545 and right tails0.0228/0.0668,retaining original/z bounds and rounding order. Four-ID upper values have z1 but left-tail probability one,not Φ1. Zero SD precludes division;equal z alone cannot rank different measurement goals.',
  ),
];
