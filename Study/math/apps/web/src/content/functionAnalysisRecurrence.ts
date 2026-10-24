import { t } from '../model';
const e = (
  i: number,
  q: number,
  z: string,
  en: string,
  rz: string,
  re: string,
) => ({
  skill: `analysis-${i}`,
  sourceLesson: `H26-L0${i}`,
  sourceTask: `H26-L0${i}-Q6`,
  targets: ['H32', 'H35'].map((u) => `${u}-MAINT-FUNCTION-ANALYSIS-Q${q}`),
  focus: t(z, en),
  rationale: t(rz, re),
});
export const functionAnalysisRecurrence = [
  e(
    1,
    1,
    '导数区间判据与跨缺口反例',
    'Interval derivative criteria and counterexamples across gaps',
    '两新平移倒数函数在两个连续区间导数正，但跨缺口两输入反序，不能说全域递增。实际近似图分两支并标灰色排除线，窗外不截断定义域；负函数值仍能递增，一般符号和平均值定理条件分别核。',
    'Two shifted negative reciprocals have positive derivatives on each interval,but crossing the gap reverses order and refutes whole-domain increasingness. Actual plots keep branches separate and label the excluded grey line;the window does not truncate the domain. Negative function values may increase. General signs and mean-value premises are checked separately.',
  ),
  e(
    2,
    2,
    '候选、双侧局部与全部绝对最值',
    'Candidates,two-sided local extrema and all absolute extrema',
    '新三次函数在闭区间列全部驻点/端点及并列最值，用因子符号论证整段。x³零导非极值、绝对值尖点非驻点、开区间x²界未取到，明确严格双侧局部约定，驻点非充分条件。',
    'New cubics require all stationary/endpoint candidates and tied absolute extrema,with factored signs covering intervals. Cubic zero slope without extrema,an absolute-value corner,and unattained bounds on an open interval preserve the strict two-sided local convention and the insufficiency of stationarity.',
  ),
  e(
    3,
    3,
    '乘积两项与差商连续前提',
    'Two product terms and quotient-limit continuity premises',
    '两组新乘积明确u′v和uv′，展开原式独立核导函数；x1正确率6/8，原积0/3、错率积2/4。一般加减混合时点积得到两个差商，可导保证连续后取极限，不把高度或两率相乘作变化率。',
    'Both new products identify u′v and uv′,then check via expansion. At one,the correct rates six/eight differ from original products zero/three and rate products two/four. Adding/subtracting a mixed-time product yields two quotients;differentiability supplies continuity before taking limits.',
  ),
  {
    skill: 'analysis-4',
    sourceLesson: 'H26-L04',
    sourceTask: 'H26-L04-Q6',
    targets: ['H31-L01-X', 'H32-L05-X'],
    focus: t(
      '已有任务中的复合指数与移动上限',
      'Existing composite-exponential and moving-limit tasks',
    ),
    rationale: t(
      '复用两题原出口。H31-L01-X须解释e^(2x)导数的内导2并与固定幂/指数区分；H32-L05-X须解释累积上限2x时乘2，保连续内点和累积导数不同于累积值。两题都要求理由，重新使用外导在内值处计算再乘内导，不因标签不同漏记有效复现。',
      'Reuse two actual exit tasks. H31-L01-X requires the inner factor two in e^(2x),distinguishing fixed powers from exponentials. H32-L05-X requires factor two for upper limit2x while retaining continuity/interior-point premises and distinguishing accumulated value from its derivative. Both require reasoning and reapply outer-at-inner times inner derivative despite different tags.',
    ),
  },
  e(
    5,
    4,
    '面积率单位、瞬时零速与授权范围',
    'Area-rate units,instantaneous zero speed and authorised ranges',
    '新正方形模型先算边长/面积，再求带内导的面积率30/−6，负率不是负面积。另平移立方运动瞬时速度0、两侧正且位置改变，不是全段静止/转向；米、平方米、秒与原时间域分开，代数延拓不替情境授权。',
    'New square models distinguish side/area from area rates30/−6 with inner factors;negative rate is not negative area. A separate shifted cubic motion has zero instantaneous velocity but positive sides and changed positions,so neither interval-wide rest nor reversal follows. Units,time domains and algebraic extensions remain distinct.',
  ),
];
