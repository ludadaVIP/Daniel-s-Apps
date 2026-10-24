import { t } from '../model';
// Evidence names exact later tasks; differing target tags do not replace a semantic review.
const e = (
  i: number,
  q: number,
  z: string,
  en: string,
  rz: string,
  re: string,
) => ({
  skill: `optimisation-${i}`,
  sourceLesson: `H31-L0${i}`,
  sourceTask: `H31-L0${i}-Q6`,
  targets: ['H35', 'H38'].map((u) => `${u}-MAINT-OPTIMISATION-Q${q}`),
  focus: t(z, en),
  rationale: t(rz, re),
});
export const optimisationRecurrenceEvidence = [
  e(
    1,
    1,
    '固定幂、指数内导与正底全域',
    'Fixed powers,exponential inner factors and positive-base domains',
    '两新多项式/复合指数式须生成完整导函数并分开f0/f′0，正负内导均保。x⁴/4^x与x³/3^x区分变量位置；一般正底指数包含a1恒定，非正底不能借全域公式越过原定义域。',
    'New polynomial/composite-exponential expressions require complete derivatives and separate values/slopes at zero,including positive/negative inner factors. Fixed powers differ from4^x/3^x. The positive-base rule includes constant a1;nonpositive bases cannot inherit the same all-real domain.',
  ),
  e(
    2,
    2,
    '弧度、度变量与正切各分支',
    'Radians,degree variables and tangent branches',
    '两组三角线性组合保余弦负号及内导，正切3x/2x逐项保全部排除点；度变量G=g(πd/180)多乘换算，G′0为π/30或−π/90而非照抄弧度斜率。图线不跨无定义点。',
    'Both trigonometric combinations retain cosine signs and inner factors. Tangent at3x/2x keeps all excluded branches. Degree-variable G=g(πd/180) adds the conversion factor,giving slopes π/30 or−π/90 rather than copying radian slopes. Graphs cannot bridge undefined points.',
  ),
  e(
    3,
    3,
    '归属、竖直点与零梯度交叉',
    'Membership,vertical points and zero-gradient crossings',
    '实际等尺度图同时给圆100及另一交叉曲线，须先核P/Q/O归属再求有限斜率/竖直切线。Q的Fy0而Fx非零与交叉O零梯度两分支不同；O不在圆。除法失效不意味着0或统一竖直，奇点需原局部几何。',
    'An actual equal-scale plot gives the radius-ten circle and a different crossing curve. P/Q/O membership precedes finite slopes or vertical tangents. Q has Fy0 with nonzero Fx,unlike zero-gradient crossing O with two branches;O is off the circle. Failed division establishes neither zero slope nor universal verticality.',
  ),
  {
    skill: 'optimisation-4',
    sourceLesson: 'H31-L04',
    sourceTask: 'H31-L04-Q6',
    targets: ['H35-MAINT-FUNCTION-ANALYSIS-Q2', 'H38-MAINT-OPTIMISATION-Q4'],
    focus: t(
      '复用全候选与新的半开可行域',
      'Reused complete candidates and a new half-open feasible domain',
    ),
    rationale: t(
      'H35原分析维护要求三次函数的全部驻点/端点值和并列绝对最值，含x³、尖点、开界反例；H38新围栏题给半开可行域上的全局最大和未取到的面积下界，再核整数并列与空域。两者都区分候选、局部、全局和取到性，不把零导当最大证明。',
      'The existing H35 analysis task requires all cubic stationary/endpoint candidates and tied extrema,including cubic,corner and open-bound counterexamples. The new H38 fence task proves a global maximum on a half-open domain while its zero infimum is unattained,then handles integer ties and empty domains. Both distinguish candidates,local/global status and attainment.',
    ),
  },
  e(
    5,
    4,
    '约束前置、配方全证与整数并列',
    'Prior feasibility,complete-square proof and integer ties',
    '两组三边围栏先消元并交正长度/上限，连续最优在约束端点6/5、面积108/90，驻点越界。另整米26/30总长分别两组并列最优84/112，以一般配方覆盖所有允许实/整数，c0空域不当零面积方案。',
    'Both fence models eliminate a dimension and intersect positivity/cap constraints. Continuous maxima occur at cap six/five,areas108/90,not infeasible stationary points. Separate integer26/30-length cases have two tied optima84/112. General square completion covers every allowed point;cap zero gives no feasible zero-area design.',
  ),
  e(
    6,
    5,
    '速度方向、速率分段与瞬时条件',
    'Velocity direction,segmented speed and instantaneous conditions',
    '负倍/正倍新位移式保三段速度号，路程24/36与位移−8/12、两平均和单位分开。a0且v非零仅瞬时速率导数0，快慢判据限v非零；平移立方v0不转向反驳，位置加常数保各变化量，模型范围外不作实际预测。',
    'Negative/positive scaled displacement models keep three velocity-sign intervals. Distances24/36 differ from displacements−8/12 and both averages. Zero a with nonzero v is only an instantaneous zero speed derivative;the sign criterion requires v≠0. A shifted-cubic zero velocity without reversal is an explicit counterexample. Position shifts preserve rates and changes;outside-range real predictions remain unauthorised.',
  ),
];
