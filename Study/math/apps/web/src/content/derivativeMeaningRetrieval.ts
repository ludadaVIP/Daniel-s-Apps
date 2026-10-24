import { t } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'H31' | 'H32') => {
  const first = unit === 'H31',
    id = (i: number) => `${unit}-MAINT-DERIVATIVE-MEANING-Q${i}`;
  const q = (
    i: number,
    z: string,
    en: string,
    sz: string,
    se: string,
    hz: string,
    he: string,
  ) =>
    reasoning(id(i), t(z, en), `derivative-${i}`, t(sz, se), [
      t(hz, he),
      t(
        '写清定义域、左右邻域与非零分母；先推一般式再核数值。有限图表帮助观察，不能替代完整函数规则或一般论证。',
        'State domains,left/right neighbourhoods and nonzero denominators. Derive a general expression before checking numbers. Finite graphs/tables aid observation but do not replace full function rules or general arguments.',
      ),
    ]);
  const a = first ? 2 : -1,
    centre = first ? 1 : 2,
    end = first ? 2 : 4;
  return {
    id: `${unit}-MAINT-DERIVATIVE-MEANING`,
    unit,
    bridge: 'H25-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5, 6].map((i) => [id(i), `H25-L0${i}`]),
    ),
    title: t(
      '优化与积分之后，重问导数的含义',
      'After optimisation and integration,revisit derivative meaning',
    ),
    intro: t(
      '六题分次，每次一题；可先画图或列点，再写一般理由，复杂推导可拆两次。全部人工核验、不计时。位移数据为虚构理想数学模型，保留米、秒与模型范围。',
      'Choose one of six tasks per sitting. Sketch or tabulate before writing general reasons;split longer derivations. All tasks are human-reviewed without a timer. Displacement data are fictional ideal mathematical models with metre/second units and explicit ranges.',
    ),
    questions: [
      q(
        1,
        `虚构s(t)=(t−${centre})²米，0≤t≤${end}秒。给端点位移增量、时间增量、平均速度与平均速率，指出为何平均速度0不等于静止。将位置统一加7米后哪些改变？从一般[f(b)−f(a)]/(b−a)解释平移不变，a=b时为何不能填0或直接认作导数？`,
        `Let fictional s(t)=(t−${centre})² metres for0≤t≤${end} seconds. Give displacement increment,time increment,average velocity and average speed. Why does zero average velocity not imply rest? What changes after adding seven metres to every position? Explain translation invariance from the general difference quotient. For a=b,why is the quotient neither zero nor automatically a derivative?`,
        `端点位置均${centre * centre}米，中途t=${centre}位置0；位移0米、时间${end}秒，平均速度0米/秒。先向负再向正，总路程${2 * centre * centre}米，平均速率${centre}米/秒，非整段静止。加7只改位置，端点差、路程和两平均不变；一般(f(b)+7)−(f(a)+7)=f(b)−f(a)，输入差仍b−a。a=b时原比值0/0未定义，不填0；导数须另查非零增量差商的双侧极限，不是直接除0。模型范围外不声称真实位移。`,
        `Endpoints both have position${centre * centre} metres,but the middle time${centre} has position zero. Displacement is zero,time${end} seconds,and average velocity zero m/s. Motion first decreases then increases,with distance${2 * centre * centre} metres and average speed${centre} m/s. Adding seven changes positions only;increments,distance and averages remain. Generally(f(b)+7)−(f(a)+7)=f(b)−f(a),with denominator b−a. At a=b,the original0/0 is undefined. A derivative requires a separate two-sided limit of nonzero-increment quotients,not division by zero. The model authorises no real-motion claim outside its range.`,
        '平均速度用有向位移，平均速率用分段路程；两种分子都要除时间。',
        'Average velocity uses signed displacement;average speed uses segmented distance. Both divide by elapsed time.',
      ),
      q(
        2,
        `对f(x)=x³，在a=${a}、h=${first ? '1/2' : '−1/2'}求当前差商、导数和二者差。对任意实a与h≠0完整展开差商，证明h从两侧趋0时极限3a²；可用|h|<1时的误差界说明任意精度。有限几个正h的表为何不够，原差商在h=0是否因此有定义？`,
        `For f(x)=x³ at a=${a},h=${first ? '1/2' : '−1/2'},find the current quotient,derivative and their difference. Expand the quotient for arbitrary real a and nonzero h,and justify the two-sided limit3a². Use an error bound for |h|<1 if useful. Why does a finite positive-h table not suffice,and does the original quotient become defined at zero?`,
        `[(a+h)³−a³]/h=(3a²h+3ah²+h³)/h=3a²+3ah+h²，仅h≠0可约。本例差商${first ? '61/4' : '19/4'}，导数${first ? 12 : 3}，差${first ? '13/4' : '7/4'}，当前割线率不是极限值。固定a，误差|3ah+h²|≤(3|a|+1)|h|在|h|<1成立，给任意ε>0取0<|h|<min(1,ε/(3|a|+1))，误差<ε，覆盖正负两侧。有限表仅观察有限点，不能证明全部足够小增量；延拓多项式在0有值3a²不改变原差商h=0被排除。`,
        `For h≠0,the quotient expands to3a²+3ah+h². Here its value is${first ? '61/4' : '19/4'},the derivative${first ? 12 : 3},and the difference${first ? '13/4' : '7/4'}. A current secant quotient differs from its limit. For fixed a and |h|<1,the error is at most(3|a|+1)|h|. Given ε>0,choose0<|h|<min(1,ε/(3|a|+1));then error<ε from either side. A finite positive-h table cannot cover all sufficiently small increments. The extended polynomial has value3a² at zero,but the original quotient still excludes h=0.`,
        '先展开立方并提出h，保h≠0；极限误差按|h|控制，两侧一并处理。',
        'Expand the cube and factor h while retaining h≠0. Control the error by |h| to cover both sides.',
      ),
      q(
        3,
        `f(x)=(x²−${a * a})/(x−(${a}))，原域x≠${a}。求左右与双侧极限，分别说明空洞和另补f(${a})=${first ? 9 : 7}的连续性；怎样补才连续？另有g在x<${a}恒${first ? 1 : -4}，x≥${a}恒${first ? 5 : 0}，求左右、点值与双侧极限，解释不能取两侧平均。有限表或屏幕连线能替代哪一步？`,
        `Let f(x)=(x²−${a * a})/(x−(${a})) with original domain x≠${a}. Find left,right and two-sided limits. Compare the hole with assigning f(${a})=${first ? 9 : 7};which assignment makes it continuous? Also let g equal${first ? 1 : -4} for x<${a} and${first ? 5 : 0} for x≥${a}. Give its one-sided limits,point value and two-sided limit status. Why not average the sides? What cannot finite tables or connecting screen lines prove?`,
        `在x≠${a}时f=x+(${a})，左右均趋${2 * a}，双侧极限${2 * a}。原点值未定义所以不连续；补${first ? 9 : 7}不改变邻域极限却不等极限，仍不连续，只有补${2 * a}才连续。g左极限${first ? 1 : -4}、右极限${first ? 5 : 0}且点值${first ? 5 : 0}，两侧不同，双侧极限不存在，平均${first ? 3 : -2}不能同时逼近两侧常数。完整规则说明所有邻近输入；图表显示有限采样，擅自跨洞/跳跃连线会改函数，点值不决定去心极限。`,
        `Away from x=${a},f=x+(${a}),so both one-sided limits equal${2 * a}. The hole is not continuous because its point value is undefined. Filling it with${first ? 9 : 7} leaves the limit unchanged but disagrees with it;only filling${2 * a} makes it continuous. For g,left limit${first ? 1 : -4} differs from right limit and point value${first ? 5 : 0}. No two-sided limit exists,and their average${first ? 3 : -2} cannot approximate both constant sides. Full rules describe all neighbouring inputs;finite samples and drawn connecting lines cannot replace them. A point value does not determine a punctured limit.`,
        '约分保原域，补点只改中心；跳跃两侧分别看，不能用平均掩盖差异。',
        'Retain the original domain after cancellation. Filling a point changes only the centre;check jump sides separately rather than averaging.',
      ),
      q(
        4,
        `在x=${a}比较u(x)=|x−(${a})|与v(x)=(x−(${a}))³。分别给点值、左右函数极限、差商与导数是否存在。说明连续、可导、导数0、恒定和局部极值为何不是同一句话；若输入秒、输出米，点值与导数各什么单位？不把0/0作为任何一个差商值。`,
        `At x=${a},compare u(x)=|x−(${a})| and v(x)=(x−(${a}))³. Give point values,function limits,difference quotients and derivative status. Distinguish continuity,differentiability,zero derivative,constancy and local extrema. If input is seconds and output metres,what units belong to values and derivatives? Do not assign a value to0/0.`,
        '两函数中心值0且左右函数极限0，均连续。对h≠0，u差商|h|/h左右−1、1，故无有限双侧导数，中心却为严格局部最小。v差商h²两侧趋0，导数0；v左右严格递增并跨水平切线，所以中心非局部极值，也非邻域恒定。可导推出连续，连续不保证可导；单点导数0不推出恒定或极值。值单位米，导数米/秒，两对象不同；原差商在h=0仍未定义。',
        'Both point values and one-sided function limits are zero,so both are continuous. For h≠0,u has quotient |h|/h with sides−1 and1:no finite two-sided derivative,despite a strict local minimum. For v,the quotient h² tends to zero;the derivative is zero,but the cubic increases through a horizontal tangent and has no local extremum or constant neighbourhood. Differentiability implies continuity;the converse fails. A zero derivative at one point implies neither constancy nor an extremum. Values use metres,derivatives m/s;the original quotient remains undefined at h=0.',
        '函数值趋近与差商趋近是两项不同检查；零斜率之后还要看邻域符号。',
        'Function-value limits and quotient limits are different checks. After finding zero slope,inspect neighbourhood behaviour.',
      ),
      q(
        5,
        `逐项求f(x)=${first ? '2x⁴−3x²+7' : '−x⁴+4x³−2'}的导函数，再分别求f(1)、f′(1)。从常数与立方的差商说明规则依据。有人把${first ? '[x²(x²+1)]′写成(2x)(2x)' : '[x²(x−2)]′写成(2x)·1'}；先展开原乘积再用幂规则修正，给一个反驳输入。为什么几个输入相等不够证明导函数恒等？`,
        `Differentiate f(x)=${first ? '2x⁴−3x²+7' : '−x⁴+4x³−2'} term by term,then separately find f(1),f′(1). Explain rule support using constant/cubic quotients. Audit${first ? '[x²(x²+1)]′=(2x)(2x)' : '[x²(x−2)]′=(2x)·1'} by expanding the original product before applying power rules,and give a counter-input. Why do a few matching values not prove derivative-function equality?`,
        `${first ? 'f′=8x³−6x，f(1)=6、f′(1)=2。乘积先化x⁴+x²，导数4x³+2x，在1为6，错误4x²给4。' : 'f′=−4x³+12x²，f(1)=1、f′(1)=8。乘积化x³−2x²，导数3x²−4x，在1为−1，错误2x给2。'}常数差商(c−c)/h=0，立方差商3x²+3xh+h²趋3x²。整数幂规则、常数倍与和差支持逐项求导，不能直接推广为导数相乘。一般代数恒等核所有输入；有限吻合只说明所核点，原函数值也不替导数函数。`,
        `${first ? 'f′=8x³−6x,f(1)=6,f′(1)=2. Expanding the product gives x⁴+x²,whose derivative4x³+2x is six at one;the incorrect4x² gives four.' : 'f′=−4x³+12x²,f(1)=1,f′(1)=8. The product expands to x³−2x²,whose derivative3x²−4x is−1 at one;incorrect2x gives two.'} Constant quotients are zero,and cubic quotients3x²+3xh+h² tend to3x². Integer power,constant-multiple and sum rules justify termwise differentiation,not multiplying derivatives. An algebraic identity covers all inputs;finite coincidences and function values cannot replace a derivative function.`,
        '先区分函数、点值和导函数；纠错可先把乘积展开，不需偷用错误乘法规则。',
        'Separate the function,point value and derivative function. Expand the product before correcting it.',
      ),
      q(
        6,
        `求${first ? 'f(x)=x³−3x在a=−1' : 'f(x)=x³−6x在a=1'}的接触点、斜率与完整切线。用因式分解求切线与曲线全部交点；再核${first ? 'y=x+3' : 'y=x−6'}虽过接触点为何不是该切线。另用x³在0说明切线可穿曲线。一般有限可导处切线由哪两条件确定，图像“只碰一下”能代替吗？`,
        `For${first ? 'f(x)=x³−3x at a=−1' : 'f(x)=x³−6x at a=1'},find contact point,slope and complete tangent equation. Factor to find ALL curve/tangent intersections. Audit${first ? 'y=x+3' : 'y=x−6'}:it passes through the point,but why is it not this tangent? Use x³ at zero to show a tangent may cross. Which two conditions determine a tangent at a finite differentiable point,and can “touching once” replace them?`,
        `${first ? '点(−1,2)，f′=3x²−3，斜率0，切线y=2。曲线减线x³−3x−2=(x+1)²(x−2)，全部交点(−1,2)、(2,2)。y=x+3在−1给2但斜率1≠0。' : '点(1,−5)，f′=3x²−6，斜率−3，切线y+5=−3(x−1)，即y=−3x−2。曲线减线x³−3x+2=(x−1)²(x+2)，全部交点(1,−5)、(−2,4)。y=x−6在1给−5但斜率1≠−3。'}x³在0点值0、导数0，切线y=0，左右立方异号故穿过。一般有限导数处y−f(a)=f′(a)(x−a)，须过原函数点P=(a,f(a))并同局部斜率；仅过点不足、交点数量也非定义。若该有限导数不存在，不能照套此式宣布唯一有限斜率切线。`,
        `${first ? 'Point(−1,2),derivative3x²−3,slope zero give tangent y=2. Difference x³−3x−2=(x+1)²(x−2) gives complete intersections(−1,2),(2,2). Line y=x+3 passes through the contact point but has slope one,not zero.' : 'Point(1,−5),derivative3x²−6,slope−3 give y=−3x−2. Difference x³−3x+2=(x−1)²(x+2) gives complete intersections(1,−5),(−2,4). Line y=x−6 passes through the contact point but has slope one,not−3.'} Cubic x³ at zero has tangent y=0 and changes sign across it,so crosses. At a finite differentiable point,the tangent y−f(a)=f′(a)(x−a) requires the original point and local slope. Passing through alone or counting contacts is insufficient. If the finite derivative does not exist,this formula cannot assert a unique finite-slope tangent.`,
        '先点后斜率，再写完整直线；求再次相交须解完整差式，不能只看接触点。',
        'Find point and slope before the whole line. Solve the full difference polynomial to find further intersections.',
      ),
    ],
  };
};
export const derivativeMeaningRetrieval = {
  H31_DERIVATIVE: makeSet('H31'),
  H32_DERIVATIVE: makeSet('H32'),
};
