import { t } from '../model';
const e = (i: number, z: string, en: string, rz: string, re: string) => ({
  skill: `derivative-${i}`,
  sourceLesson: `H25-L0${i}`,
  sourceTask: `H25-L0${i}-Q6`,
  targets: ['H31', 'H32'].map((u) => `${u}-MAINT-DERIVATIVE-MEANING-Q${i}`),
  focus: t(z, en),
  rationale: t(rz, re),
});
export const derivativeMeaningRecurrence = [
  e(
    1,
    '两个增量、平均速度与非恒定',
    'Two increments,average velocity and nonconstancy',
    '两个虚构平移平方位置模型端点差0而中途变动，路程2/8、平均速率1/2与平均速度0分开，单位米/秒。一般输出平移抵消且需不同输入端点，同点0/0不当导数。',
    'Two shifted-square displacement models have zero endpoint change but nonconstant interior motion. Distances two/eight and average speeds one/two differ from zero average velocity. General output-shift cancellation retains m/s units and distinct endpoints;0/0 is not a derivative.',
  ),
  e(
    2,
    '全部非零增量与双侧误差界',
    'All nonzero increments and a two-sided error bound',
    '新立方函数差商61/4与19/4区别导数12/3，通式3a²+3ah+h²只在h非零约分。固定a的绝对误差界给任意ε、正负两侧，有限正h表不代替极限，延拓不抹原域孔。',
    'Cubic quotients61/4 and19/4 differ from derivatives twelve/three. The full expression3a²+3ah+h² retains h≠0. An absolute error bound handles arbitrary ε and both sides,going beyond a finite positive-h table. Extension does not erase the original domain hole.',
  ),
  e(
    3,
    '去心邻域、补点与跳跃',
    'Punctured neighbourhoods,patched values and jumps',
    '中心2/−1的新有理空洞左右极限4/−2，补9/7仍不连续，正确补值才连续。另两侧常值跳跃分别核点值与左右，平均不是极限；完整规则支撑邻域而非屏幕连线。',
    'New rational holes centred at two/−1 have limits four/−2. Patching nine/seven leaves discontinuity;only the limit value repairs it. Separate constant-side jumps distinguish point values and both limits;averaging fails. Full rules,not connected screen samples,describe neighbourhood behaviour.',
  ),
  e(
    4,
    '连续、尖点、水平穿越与瞬时率',
    'Continuity,corners,horizontal crossing and instantaneous rates',
    '两组平移绝对值与立方均中心连续，前者差商−1/1不可导但严格极小，后者h²趋0可导但穿越、非恒定非极值。函数值米与导数米/秒、原比h非零均保留。',
    'Translated absolute-value and cubic functions are continuous at their centres. The corner has quotient sides−1/1 and a strict minimum without a derivative. Cubic h² tends to zero while crossing a horizontal tangent,without constancy or an extremum. Values/derivatives retain different units and h≠0.',
  ),
  e(
    5,
    '导函数、点值和非法乘法',
    'Derivative functions,point values and invalid product rules',
    '新四次多项式逐项求导并分开f(1)与f′(1)。常数/立方差商支撑规则，乘积先展开为多项式修复导数相乘错误，以具体输入反驳、一般恒等核回，不由少量吻合证明导函数。',
    'New quartics require termwise derivatives and separate f(1),f′(1). Constant/cubic quotients support rules. Expanding products first repairs multiplication-of-derivatives errors,with counter-inputs and general identities rather than finite coincidences as proof.',
  ),
  e(
    6,
    '点与局部斜率、再次相交及穿越',
    'Point/local slope,further intersections and crossing',
    '两新接触给完整切线y=2/y=−3x−2，差式分解找全两交点；过点但斜率错的直线不是切线。x³0处水平穿越反驳只碰一次，有限导数公式保原函数点和局部斜率条件。',
    'Both contacts give complete tangent lines y=2/−3x−2. Factoring differences finds all further intersections;passing through with a wrong slope is insufficient. Cubic crossing at zero refutes touching-once definitions. The finite-derivative formula retains the original point and local slope.',
  ),
];
