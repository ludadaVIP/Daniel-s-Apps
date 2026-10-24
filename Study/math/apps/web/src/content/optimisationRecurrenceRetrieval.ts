import { t, type NumberDiagram } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'H35' | 'H38') => {
  const first = unit === 'H35',
    id = (i: number) => `${unit}-MAINT-OPTIMISATION-Q${i}`;
  const p = first ? { x: 6, y: 8, label: 'P' } : { x: -8, y: 6, label: 'P' },
    point = { x: first ? 10 : -10, y: 0, label: 'Q' },
    origin = { x: 0, y: 0, label: 'O' };
  const circle = Array.from({ length: 81 }, (_, i) => ({
    x: 10 * Math.cos((2 * Math.PI * i) / 80),
    y: 10 * Math.sin((2 * Math.PI * i) / 80),
  }));
  const picture: NumberDiagram = {
    kind: 'cartesian',
    bounds: { xMin: -20, xMax: 20, yMin: -14, yMax: 14, xStep: 5, yStep: 2 },
    points: [p, point, origin],
    curves: [
      { name: 'circle', color: '#5850a1', points: circle },
      {
        name: 'cross plus',
        color: '#a14532',
        dash: '4 4',
        points: [
          { x: -14, y: -14 },
          { x: 14, y: 14 },
        ],
      },
      {
        name: 'cross minus',
        color: '#a14532',
        dash: '4 4',
        points: [
          { x: -14, y: 14 },
          { x: 14, y: -14 },
        ],
      },
    ],
    caption: t(
      `蓝紫实线近似圆x²+y²=100，棕虚线是另一曲线x²−y²=0的两支。给定P(${p.x},${p.y})、Q(${point.x},0)、O(0,0)；坐标为实数，两轴每单位同尺度。未画所求切线，虚线也不是圆的切线；图窗不截断原曲线。`,
      `Blue-purple solid curve approximates x²+y²=100;brown dashed lines are the two branches of the DIFFERENT curve x²−y²=0. Given P(${p.x},${p.y}),Q(${point.x},0),O(0,0),with real coordinates and equal unit scales. Requested tangents are not supplied;dashed lines are not circle tangents. The window does not truncate the curves.`,
    ),
  };
  const task = (
    i: number,
    skill: number,
    z: string,
    en: string,
    sz: string,
    se: string,
    hz: string,
    he: string,
  ) =>
    reasoning(id(i), t(z, en), `optimisation-${skill}`, t(sz, se), [
      t(hz, he),
      t(
        '先核原定义域、单位与条件，再求导/分段/比较；一般恒等支持全体，数值回代核本例，图形和舍入不能替代证明。',
        'Check original domains,units and premises before differentiation,segmentation or comparison. General identities cover all cases;substitution checks the instance. Plots and rounding do not replace proof.',
      ),
    ]);
  return {
    id: `${unit}-MAINT-OPTIMISATION`,
    unit,
    bridge: 'H31-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 5, 6].map((l, i) => [id(i + 1), `H31-L0${l}`]),
    ),
    title: t(
      '方程与项目之后，再核导数优化',
      'After equations and projects,recheck derivatives and optimisation',
    ),
    intro: t(
      '五题分次，每次可只做计算或解释的一部分，较长题再拆。第四题也可回H31-L04核全局最值。全为人工核验，不计时，允许纸笔；围栏和运动均为虚构理想模型。',
      'Choose one of five tasks per sitting,or one calculation/proof portion. Split longer tasks. Task four can also revisit H31-L04 on global extrema. All are human-reviewed without a timer;use paper. Fence and motion settings are fictional ideal models.',
    ),
    questions: [
      task(
        1,
        1,
        `求f(x)=${first ? '2x⁴−3x+e^(−2x)' : '−x³+4x²+3e^(2x)'}的导函数及f(0)、f′(0)，逐项说明固定幂与指数的规则。再比较${first ? 'x⁴与4^x' : 'x³与3^x'}的导数。从一般a^x说明a=1为何仍合法，而a≤0为何不能无条件套实数全域规则；内层线性因子为何不能漏？保ln与指数精确形式。`,
        `Differentiate f(x)=${first ? '2x⁴−3x+e^(−2x)' : '−x³+4x²+3e^(2x)'},then give f(0),f′(0),explaining fixed-power versus exponential rules. Compare derivatives of${first ? 'x⁴ and4^x' : 'x³ and3^x'}. Explain why a=1 is valid in a^x,but a≤0 cannot use the same real-all-input rule without qualification. Why retain the inner linear factor and exact logarithms/exponentials?`,
        `${first ? 'f′=8x³−3−2e^(−2x)，f(0)=1、f′(0)=−5。x⁴导数4x³，4^x导数ln(4)4^x。' : 'f′=−3x²+8x+6e^(2x)，f(0)=3、f′(0)=6。x³导数3x²，3^x导数ln(3)3^x。'}幂的指数固定，指数函数的底数固定正且变量在指数；一般a>0时(a^x)′=ln(a)a^x，a=1恒1、ln1=0故导数0。a<0不对任意实指数给实值，a=0也不覆盖全实域，不能直接套上述全域结论。复合e^(kx)导数k e^(kx)，k来自内导；函数值不是导数值，精确符号不靠几个小数试值证明恒等。`,
        `${first ? 'f′=8x³−3−2e^(−2x),f(0)=1,f′(0)=−5. The derivative of x⁴ is4x³;of4^x it is ln(4)4^x.' : 'f′=−3x²+8x+6e^(2x),f(0)=3,f′(0)=6. Derivatives of x³ and3^x are3x² and ln(3)3^x.'} A power has fixed exponent,an exponential fixed positive base. For a>0,the derivative is ln(a)a^x,including a=1,where the function is constant and ln1=0. Negative bases do not define real values for every real exponent,and zero also fails a full real domain. Composite e^(kx) needs inner factor k. Function values differ from derivative values;exact symbols and identities are not replaced by a few decimal checks.`,
        '先找变量在底还是指数，再找内层输入；a=1不是被排除的对数底规则，此处a是指数底。',
        'Locate the variable and inner input. Here a is an exponential base;do not confuse a=1 with the invalid base of a logarithm.',
      ),
      task(
        2,
        2,
        `x以弧度计，g(x)=${first ? '2sin(3x)+cos(3x)' : '3cos(2x)−sin(2x)'}。求g′、g(0)、g′(0)，保余弦导数负号和内导。再求tan(${first ? 3 : 2}x)的导数及全部排除点，图线能跨渐近线连接吗？若另用度数变量d定义G(d)=g(πd/180)，写G′及G′(0)，为何与g′(0)数值不同不矛盾？`,
        `With x in radians,let g(x)=${first ? '2sin(3x)+cos(3x)' : '3cos(2x)−sin(2x)'}. Find g′,g(0),g′(0),retaining cosine’s minus sign and inner factors. Differentiate tan(${first ? 3 : 2}x),give ALL exclusions,and explain why graphs cannot connect through asymptotes. For degree variable d define G(d)=g(πd/180);give G′ and G′(0). Why does its numerical slope differ without contradiction?`,
        `${first ? 'g′=6cos(3x)−3sin(3x)，g(0)=1，g′(0)=6；tan(3x)导数3/cos²(3x)，排除x=π/6+jπ/3。' : 'g′=−6sin(2x)−2cos(2x)，g(0)=3、g′(0)=−2；tan(2x)导数2/cos²(2x)，排除x=π/4+jπ/2。'}j为任意整数，条件cos(${first ? 3 : 2}x)≠0保原定义域，导数不在排除点突然有值。由商法则分子cos²+sin²=1，内导仍${first ? 3 : 2}；不得跨无定义点连线。G′(d)=g′(πd/180)·π/180，G′(0)=${first ? 'π/30' : '−π/90'}，是每度而非每弧度的变化率，坐标变量单位换了不是原规则矛盾。`,
        `${first ? 'g′=6cos(3x)−3sin(3x),g(0)=1,g′(0)=6. The tangent derivative is3/cos²(3x),excluding x=π/6+jπ/3.' : 'g′=−6sin(2x)−2cos(2x),g(0)=3,g′(0)=−2. The tangent derivative is2/cos²(2x),excluding x=π/4+jπ/2.'} Integer j covers every exclusion;cos(${first ? 3 : 2}x)≠0 retains the original domain. Quotient differentiation uses cos²+sin²=1 and inner factor${first ? 3 : 2}. Neither function nor derivative is assigned a value across an asymptote. G′(d)=g′(πd/180)π/180,so G′(0)=${first ? 'π/30' : '−π/90'},a rate per degree rather than per radian. Changing the input unit changes numerical slope without contradicting the rule.`,
        '三角导数公式先核弧度，外导后乘内导；正切还须保cos不为0的每个分支。',
        'Check radians,then multiply outer and inner derivatives. Tangent additionally retains every cos≠0 branch.',
      ),
      {
        ...task(
          3,
          3,
          `图有圆x²+y²=100及另一曲线x²−y²=0。对圆先核P(${p.x},${p.y})、Q(${point.x},0)、O(0,0)的归属，再推隐导数，给P的有限斜率和Q的切线方程。对另一曲线只看O：Fx、Fy与实际分支各说明什么？为什么相同“分母y=0”不能统一填0或竖直，Fx=Fy=0也不自动给所有奇点同一种切线？`,
          `The plot shows circle x²+y²=100 and DIFFERENT curve x²−y²=0. Check P(${p.x},${p.y}),Q(${point.x},0),O(0,0) for circle membership before differentiating. Derive the implicit relation,give the finite slope at P and tangent equation at Q. At O on the other curve,what do Fx,Fy and actual branches show? Why cannot y=0 always mean slope zero or vertical,and why does a zero gradient alone not classify every singular tangent?`,
          `P平方和100、Q也100，O平方和0不在圆。沿可写y(x)的局部圆支，2x+2yy′=0，y非零才可除，P斜率${first ? '−3/4' : '4/3'}。Q的Fy=0但Fx=${first ? 20 : -20}非零，可改用x(y)局部支，切线x=${point.x}，不能给有限dy/dx。对圆，O的归属检查已失败，不称该圆奇点。另一曲线在O满足方程且Fx=Fy=0，分解(x−y)(x+y)=0给两支y=±x、斜率±1，非唯一竖直切线；0/0只说明当前除法不合法。零梯度须再查原局部曲线，本例两支不是所有奇点的通用模板。`,
          `P and Q have squared radius100;O has zero and is off the circle. On a local circle branch y(x),2x+2yy′=0 permits division only for y≠0,giving slope${first ? '−3/4' : '4/3'} at P. At Q,Fy=0 but Fx=${first ? 20 : -20}≠0;a local x(y) description gives vertical tangent x=${point.x},not a finite dy/dx. O failed circle membership and is not its singular point. On the other curve,O is on-curve with zero gradient,and factorisation gives branches y=±x with slopes±1. Thus0/0 diagnoses invalid division,not slope zero or universal verticality. A zero gradient requires further local analysis;two branches are this example,not every singularity.`,
          '先核曲线归属，有限斜率除Fy；若不能除，要回完整局部方程而非给分母0贴标签。',
          'Check membership before dividing by Fy. When division fails,return to the full local equation rather than labelling every zero denominator.',
        ),
        diagram: picture,
      },
      task(
        4,
        5,
        `虚构三边围栏连续总长L=${first ? 30 : 28}米，2x+y=L，x>0、y>0、x≤${first ? 6 : 5}。给完整可行域和面积函数，证明全部连续输入中的最大值及全部尺寸；驻点若越界怎样处理，有最小面积0吗？另案L=${first ? 26 : 30}、x为整米且x≤${first ? 10 : 12}，给所有并列最优与单位，不只舍入连续答案。对一般L写配方恒等式说明完整比较，c=0边界如何？最后用x³在0处和|x|在0处解释驻点非充分、不可导点不能漏。`,
        `A fictional three-sided fence has continuous total L=${first ? 30 : 28} metres,2x+y=L,x>0,y>0,x≤${first ? 6 : 5}. Give the full feasible domain,area rule and proof of the maximum over ALL continuous inputs,including every optimal dimension. Handle an infeasible stationary point and whether minimum area zero exists. In a separate integer-metre case L=${first ? 26 : 30},x≤${first ? 10 : 12},give ALL tied optima and units. Complete the square for general L rather than merely rounding,and handle cap c=0. Use x³/|x| at zero to explain insufficient stationarity and indispensable nondifferentiable candidates.`,
        `正长度先给0<x<L/2，再交x≤c；本例域0<x≤${first ? 6 : 5}，A=Lx−2x²，A′=L−4x于域内正，最大在x=${first ? 6 : 5}、y=18，A=${first ? 108 : 90}平方米；驻点${first ? '15/2' : '7'}在域外不能选。x趋0时A趋0但正长度下A>0，0仅下确界非最小。一般A=L²/8−2(x−L/4)²，比较所有可行x到中心距离即覆盖全体。整米另案中心${first ? '13/2' : '15/2'}，最近可行整数${first ? '6与7' : '7与8'}，尺寸${first ? '(6,14)、(7,12)' : '(7,16)、(8,14)'}，面积均${first ? 84 : 112}平方米，其余更远面积更小；必须同时保两组并核约束。c=0域空，不能报0面积可行最优。x³在0导数0却无局部极值，|x|在0处不可导却最小；全局候选还要核端点包含性、可导/连续条件，不只解导数0或从图猜。`,
        `Positive dimensions give0<x<L/2,intersected with x≤c. Here0<x≤${first ? 6 : 5};A=Lx−2x² has positive derivative throughout,so maximum is x=${first ? 6 : 5},y=18,area${first ? 108 : 90} m². Stationary x=${first ? '15/2' : '7'} is infeasible. As x→0,area tends to zero without attaining it. General A=L²/8−2(x−L/4)² compares every feasible point by distance to the centre. Integer-case centre${first ? '13/2' : '15/2'} has tied nearest feasible integers${first ? 'six/seven' : 'seven/eight'},dimensions${first ? '(6,14),(7,12)' : '(7,16),(8,14)'},each area${first ? 84 : 112} m²;all others are farther. Retain both and verify constraints. Cap zero gives an empty domain,not feasible area zero. Cubic x³ has a zero derivative at zero without an extremum,while |x| has a minimum without a derivative. Global reasoning also checks included endpoints and theorem premises,not just stationary equations or plots.`,
        '可行域先行；配方把全体连续点与全部整数比较统一为到中心的距离，再保并列与开放端点。',
        'Find feasibility first. Completing the square compares all real/integer candidates by centre distance while retaining ties and open endpoints.',
      ),
      task(
        5,
        6,
        `虚构s(t)=${first ? '−2(t³−6t²+9t)+5' : '3(t³−6t²+9t)−4'}米，0≤t≤4秒。求v、a及符号分段，列t=0,1,3,4的位置，给总路程、位移、平均速度与平均速率。t=2时a=0是否静止或整段匀速？t=3/2速度和加速度的符号怎样决定速率变化，何时不能直接套此判据？再用r(t)=(t−2)³说明v=0不一定转向；给s再加常数哪些量不变，超模型时间范围可作真实预测吗？`,
        `Let fictional s(t)=${first ? '−2(t³−6t²+9t)+5' : '3(t³−6t²+9t)−4'} metres on0≤t≤4 seconds. Find v,a and sign intervals;list positions at t=0,1,3,4,then distance,displacement,average velocity and average speed. At t=2,does a=0 imply rest or uniform motion throughout? At t=3/2,use signs of v,a to classify speed change,and state the criterion’s premise. Use r(t)=(t−2)³ to refute zero-velocity-implies-reversal. What does adding a position constant preserve,and may this model predict outside its time range?`,
        `${first ? 'v=−6(t−1)(t−3)，a=−12t+24；v符号−、+、−，位置5,−3,5,−3米，位移−8米、路程24米，平均速度−2米/秒、平均速率6米/秒。t=2时v=6、a=0；t=3/2时v=9/2、a=6，同正而速率增大。' : 'v=9(t−1)(t−3)，a=18t−36；v符号+、−、+，位置−4,8,−4,8米，位移12米、路程36米，平均速度3米/秒、平均速率9米/秒。t=2时v=−9、a=0；t=3/2时v=−27/4、a=−9，同负而速率增大。'}速率|v|非负，仅v非零时用其导数sign(v)a判快慢；t=2只是瞬时速率导数0，不推静止或整段恒速。本例t=1,3速度0且两侧变号所以转向；r′=3(t−2)²在2为0而两侧正，不转向。v单位米/秒，a米/秒²，位置正负与方向不等同。位置加常数不改v,a、速率、位移或路程。模型为给定时间内理想规则，范围外算式能求值不授权实际运动预测。`,
        `${first ? 'v=−6(t−1)(t−3),a=−12t+24. Velocity signs are−,+,−;positions5,−3,5,−3 metres give displacement−8,distance24,average velocity−2 m/s and speed six m/s. At two,v=6,a=0. At t=3/2,v=9/2,a=6,so speed increases.' : 'v=9(t−1)(t−3),a=18t−36. Velocity signs are+,-,+;positions−4,8,−4,8 give displacement twelve,distance36,average velocity three m/s and speed nine m/s. At two,v=−9,a=0. At t=3/2,v=−27/4,a=−9,so speed increases.'} For v≠0,speed derivative is sign(v)a. Zero acceleration at two makes only the instantaneous speed derivative zero,not rest or interval-wide constant speed. Here v changes sign at one/three,so reversal occurs;but r′=3(t−2)² stays positive around its zero at two,without reversal. Velocity uses m/s,acceleration m/s²,and position signs do not determine direction. Adding a position constant preserves v,a,speed,displacement and distance. Algebraic extensions outside the authorised time range do not establish real motion.`,
        '按速度变号分段累加绝对位移；a=0和v=0各只说瞬时条件，转向还需核两侧。',
        'Segment at velocity sign changes and add absolute displacements. Zero a or v states an instantaneous condition;reversal needs both sides.',
      ),
    ],
  };
};
export const optimisationRecurrenceRetrieval = {
  H35_OPTIMISATION: makeSet('H35'),
  H38_OPTIMISATION: makeSet('H38'),
};
