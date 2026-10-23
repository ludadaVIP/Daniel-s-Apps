import { t } from '../model';
const e = (i: number, z: string, en: string, rz: string, re: string) => ({
  skill: `statistics-${i}`,
  sourceLesson: `H27-L0${i}`,
  sourceTask: `H27-L0${i}-Q6`,
  targets: ['H34', 'H38'].map((u) => `${u}-MAINT-STATISTICS-Q${i}`),
  focus: t(z, en),
  rationale: t(rz, re),
});
export const statisticsRecurrence = [
  e(
    1,
    '原配对、尺度与未定义相关',
    'Original pairs,scales and undefined correlation',
    '两张新原ID表给r=1/2或−1/2，整行倒序不变，单列排序造出r1并改变具体配对。中心化通式解释正比例/负反射和零尺度，相关不等同斜率，常数列未定义，不能认证因果或代表性。',
    'Two actual original-ID tables give r=1/2 or−1/2. Whole-row reversal preserves r;single-column sorting creates r1 by changing object pairs. General centred deviations explain positive scales,reflection and zero-scale boundaries. Correlation differs from slope;constant columns are undefined,and causation/representativeness remain unproved.',
  ),
  e(
    2,
    '全实参数平方分解与残差条件',
    'All-real-parameter square decomposition and residual conditions',
    '两组新三行数据独立求各候选竖直残差；均值常数线残差和0却SSE8/2高于最优值6或3/2。完整SSE非负平方恒等式给全参数唯一最优，Σe与Σxe分开；固定x仍有唯一原拟合值而斜率不识别。',
    'New three-row datasets require vertical residuals for each candidate. Mean-only lines have zero residual sum but SSE8/two above minima six/3/2. Full nonnegative-square identities prove all-parameter optima,distinguishing Σe from Σxe. Constant x retains one original fitted mean but not an identified slope.',
  ),
  e(
    3,
    '原x残差图、弯曲与诊断限度',
    'Residuals at original x,curvature and diagnostic limits',
    '两幅实际五ID散点及完整文字坐标要求亲生残差图，r=0、残差和0却SSE14/56及系统U形；原x不排序。另等可能抽ID给X=0/Y=0交集1/5非1/25，显式反驳r=0保证独立；小扇形只提示检查，不证明误差模型或外推。',
    'Actual five-ID scatter plots with complete textual coordinates require generating residual plots at original x. Zero r/residual sum coexist with SSE14/56 and U-shaped structure. An auxiliary uniform-ID draw has joint zero-events1/5 rather than1/25,explicitly refuting zero-correlation independence. A small fan is a diagnostic clue,not a certified error model or prediction guarantee.',
  ),
  e(
    4,
    '全样本枚举、样本量与重复数',
    'Complete enumeration,sample size and repetition count',
    '两完整四ID总体列全六无放回样本，均值期望2/4、理论方差分别2和11/3，原总体方差6/11；同值不同ID不删。固定AB方差0却偏差−2/−3。n变理论、R仅变模拟频率精度，固定种子仅可重现；普查不修测量/缺失。',
    'Two complete four-ID populations yield all six without-replacement samples,mean expectations two/four and theoretical variances two/11/3 versus population variances six/eleven. Equal-valued IDs remain distinct. Fixed AB has variance zero but bias−2/−3. Changing n changes theory;R changes frequency precision,and seeds only reproducibility. Census does not repair measurement/missingness.',
  ),
  e(
    5,
    '已知/未知逻辑界与两类随机',
    'Known/unknown logical bounds and two uses of randomness',
    '新60/80成员计数表保已是、已否、未知；回应3/4、5/8不同于总体逻辑界[3/20,19/20]/[1/8,37/40]。两端可达但中间仅1/N刻度，非置信区间。分别说明随机抽样与志愿者随机分配的推论范围和条件，漂亮拟合不修设计。',
    'New60/80-member tables distinguish yes,no and unknown. Response rates3/4,5/8 differ from logical population bounds[3/20,19/20]/[1/8,37/40]. Endpoints are attainable but intermediate proportions lie on a1/N grid;these are not confidence intervals. Random sampling and volunteer random assignment retain different inferential scopes/conditions;attractive fits do not repair design.',
  ),
];
