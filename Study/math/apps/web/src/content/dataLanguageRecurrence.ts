import { t } from '../model';
const pair = (i: number) =>
  ['H27', 'H34'].map((u) => `${u}-MAINT-DATA-LANGUAGE-Q${i}`);
const e = (
  skill: string,
  i: number,
  q: number,
  z: string,
  en: string,
  rz: string,
  re: string,
) => ({
  skill,
  sourceLesson: `H08-L0${i}`,
  sourceTask: `H08-L0${i}-Q6`,
  targets: pair(q),
  focus: t(z, en),
  rationale: t(rz, re),
});
export const dataLanguageRecurrence = [
  e(
    'data-type-identity-source',
    1,
    1,
    '无序编码、原身份与缺失分母',
    'Nominal coding,original identities and missing denominators',
    '两组实际原表均六行五成员，已核同ID同次复制r5、未记录r6；保原资料另分析四个有效ID，同色不同ID不删。已记录目标色2/4，总体五人只可能2/5或3/5。两套类别编码不改颜色却改均值，明确不能称平均颜色，频数比例要保对象和分母。',
    'Each actual raw table has six rows for five members,with a confirmed duplicate and a missing value. Raw provenance remains while four valid IDs enter analysis. Equal colours at different IDs are retained. Observed2/4 differs from population possibilities2/5 or3/5. Relabelling nominal colour codes changes means without changing colours,so frequencies/proportions require explicit identities and denominators.',
  ),
  e(
    'data-shape-tail-evidence',
    2,
    2,
    '镜像、双峰、离散端点与正态前提',
    'Reflection,bimodality,discrete endpoints and normal premises',
    'H27图示0/0/4/4围绕2双峰，H34图示1/1/7/7围绕4双峰，都是完整四编号演示总体。各直接数μ±σ闭区间4/4、开区间0/4，保重复值身份与端点；对称不证正态，68%近似不能替代本数据计数或认证现实模型。',
    'Actual dot plots show symmetric bimodal complete four-ID populations centred at two/four. Direct counts inside the closed one-SD interval give4/4,but open endpoints give0/4. Repeated values retain IDs. Symmetry alone does not justify normality or replace exact discrete counting with a68% approximation.',
  ),
  e(
    'data-squared-spread-convention',
    3,
    3,
    '平方先于相加、明示分母与绝对缩放',
    'Square before summing,declared divisors and absolute scaling',
    'H27数据3/5/5/7的离差平方和8，总体方差2、样本8/3；H34数据2/5/5/8平方和18、总体9/2、样本6，均精确给标准差。一般离差c倍导致平方和c²倍、标准差|c|倍，负反射不使标准差负或让离差抵消替平方。',
    'Both compute every squared deviation before summing,then distinguish population versus sample divisors and exact SDs. Sums eight/eighteen give population variances two/9/2 versus sample8/3/six. The general deviation transformation proves SD scales by|c|,not signed c;zero signed-deviation sums do not imply zero spread.',
  ),
  e(
    'data-z-reference-boundary',
    4,
    3,
    '连参考量一起变换与零尺度边界',
    'Transforming reference quantities and zero-scale boundaries',
    '两组首观察z−√2，分别反向10−2x与20−3x后连均值/正标准差更新为z′√2。一般z′=(c/|c|)z，正向5+2x不变；常数或c0无标准分数，不由z正负自动判断优劣或概率，保σ>0与原参考分布。',
    'Both start with z=−√2 and obtain√2 after reflection,updating the mean and nonnegative SD. General z′=(c/|c|)z explains positive-affine invariance and negative-affine reversal. Constant data or c0 leaves z undefined;signs alone establish neither merit nor probability.',
  ),
  e(
    'data-paired-residual-model',
    5,
    4,
    '共同x的唯一原拟合与不唯一斜率',
    'Unique fitted value but nonunique slope with constant x',
    'H27共同x2、y1/4/7给SSE=18+3(a+2b−4)²，H34共同x3、y2/5/8给18+3(a+3b−5)²。分别全最优族a+2b4/a+3b5，原x拟合4/5唯一而斜率自由；给两最优线在新x预测不同，保不同ID权重、竖直残差与原输入，不把Sxx0写“无拟合值”。',
    'General squared identities give all optimal lines when x is constant. The original fitted value four/five is unique while slope remains free;explicit equally optimal lines predict differently at a new x. Different-ID records keep their weights. Vertical residuals retain original x,and zero Sxx means nonidentified slope rather than absence of an original fitted value.',
  ),
];
