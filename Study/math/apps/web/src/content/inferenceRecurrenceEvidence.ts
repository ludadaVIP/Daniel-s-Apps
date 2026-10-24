import { t } from '../model';
const e = (i: number, z: string, en: string, rz: string, re: string) => ({
  skill: `stat-inference-${i}`,
  sourceLesson: `H34-L0${i}`,
  sourceTask: `H34-L0${i}-Q6`,
  targets: ['H35', 'H38'].map((u) => `${u}-MAINT-INFERENCE-Q${i}`),
  focus: t(z, en),
  rationale: t(rz, re),
});
export const inferenceRecurrenceEvidence = [
  e(
    1,
    '单次误差与设计偏差',
    'Realised errors and design bias',
    '两张实际完整六ID表，完整框的无放回均值无偏；受限ABCD框均值偏差−2或2 cm，仍可能抽CD恰零误差。框内普查不修遗漏，完整普查不自动修测量/缺失，入样率证明期望而非挑样本认证。',
    'Actual six-ID tables distinguish zero realised error from unbiasedness. Full-frame pair means are unbiased;ABCD-frame bias is−2 or two cm,yet CD can give zero error. A frame census retains omissions;even a complete census does not repair measurement/missingness. Inclusion probabilities prove expectation instead of choosing one lucky sample.',
  ),
  e(
    2,
    '抽样分布与重复的边界',
    'Sampling laws and repetition limits',
    '两个新总体列全15对及同均值质量，原方差16、两人均值方差32/5、三人16/5、全体0，SE需取根。受限框方差4/3、相对全体MSE16/3，R不改偏差或理论离散分布，n和R作用分开。',
    'New populations require all fifteen ID pairs and merged mean masses. Original variance sixteen becomes32/5 for pair means,16/5 for triples,and zero for a full census;SE is its root. Restricted-frame variance4/3 and full-target MSE16/3 remain distinct. Repetitions alter neither bias nor the discrete theory;n and R play different roles.',
  ),
  e(
    3,
    '区间条件与重复覆盖',
    'Interval assumptions and repeated coverage',
    '两新已知σ的IID正态模型重算SE、z2/1.96区间、四倍n宽减半；实际四构造均值图不泄区间，端点含真值的三行给3/4，明确非模拟/用户数据，不能替代名义覆盖或给固定μ赋后验率。',
    'New known-σ IID normal models regenerate SE,z2/1.96 intervals and width halving at fourfold n. Actual four-mean plots do not reveal intervals;three boundary-inclusive covers give3/4 in teaching constructions,explicitly not simulation/user data. This does not calibrate nominal coverage or give fixed μ a posterior probability.',
  ),
  e(
    4,
    '预设极端、离散错误率与不拒绝',
    'Planned extremeness,discrete errors and nonrejection',
    '新5/6试验分别在α1/20或1/8核上侧和预设双侧，p1/32对1/16、7/64对7/32；实际错误率不机械等于α，双侧域可空。不拒绝不证无差异，等效须单独预设范围；换尾/窥看/多重选择保留条件。',
    'New five/six-trial null laws at α1/20 or1/8 compare planned upper/two-sided p values1/32 versus1/16,and7/64 versus7/32. Actual error need not equal α,and a discrete rejection set may be empty. Nonrejection does not prove no difference;equivalence needs a planned range. Tail switching,peeking and selection retain their limitations.',
  ),
  e(
    5,
    '实际目标、显著方向与设计',
    'Practical targets,significant direction and design',
    '两张四情境原效应/n表按σ8/6、阈值2/1分钟重算区间与p。同z5同p的A/C效应相差十倍且目标结论不同；B宽且不确定，D显著有害。抽样/分配的推论范围不互换，构造数据不认证真实研究或因果。',
    'Two actual four-case effect/n tables use σ8/six and target two/one minutes. Equal z5/p in A/C accompanies tenfold effects and different target conclusions. B remains uncertain;D is significantly harmful. Sampling and assignment support different inference scopes,and teaching constructions certify neither real research nor causation.',
  ),
];
