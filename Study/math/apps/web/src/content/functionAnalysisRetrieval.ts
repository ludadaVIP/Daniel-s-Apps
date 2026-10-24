import { t, type NumberDiagram } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'H32' | 'H35') => {
  const first = unit === 'H32',
    c = first ? 2 : -1,
    id = (i: number) => `${unit}-MAINT-FUNCTION-ANALYSIS-Q${i}`;
  const q = (
    i: number,
    skill: number,
    z: string,
    en: string,
    sz: string,
    se: string,
    hz: string,
    he: string,
  ) =>
    reasoning(id(i), t(z, en), `analysis-${skill}`, t(sz, se), [
      t(hz, he),
      t(
        '先给定义域、区间和量，再核导数及推论条件；一般恒等或符号理由覆盖全体，有限试值只作检查。',
        'State domains,intervals and quantities before derivatives and inference conditions. General identities or sign arguments cover all cases;finite values only check them.',
      ),
    ]);
  const points = (side: 1 | -1) =>
    Array.from({ length: 61 }, (_, i) => {
      const d = side * (0.25 + (3.75 * i) / 60);
      return { x: c + d, y: -1 / d };
    }).sort((a, b) => a.x - b.x);
  const picture: NumberDiagram = {
    kind: 'cartesian',
    bounds: { xMin: c - 4, xMax: c + 4, yMin: -4, yMax: 4, xStep: 1, yStep: 1 },
    points: [],
    curves: [
      { name: 'left branch', points: points(-1) },
      { name: 'right branch', points: points(1) },
      {
        name: 'excluded x',
        points: [
          { x: c, y: -4 },
          { x: c, y: 4 },
        ],
        dash: '5 5',
        color: '#9b9b9b',
      },
    ],
    caption: t(
      `给定f(x)=−1/(x−(${c}))的有限窗近似图；两支分开，灰虚线x=${c}不属函数。原定义域为全部实数去掉${c}，图窗外仍有两支，不能跨虚线连函数。`,
      `Finite-window approximation of given f(x)=−1/(x−(${c})). Branches are separate;grey dashed x=${c} is excluded,not a function segment. The full domain is all reals except${c};both branches continue outside the window.`,
    ),
  };
  return {
    id: `${unit}-MAINT-FUNCTION-ANALYSIS`,
    unit,
    bridge: 'H26-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 5].map((l, i) => [id(i + 1), `H26-L0${l}`]),
    ),
    title: t(
      '积分与方程之后，再核函数分析的条件',
      'After integration and equations,recheck analysis premises',
    ),
    intro: t(
      '四题分次，每次一题，符号表和候选比较可在纸上完成；较长题可再拆。全部人工核验、不计时。图是有限窗近似，完整域与结论由原式和论证决定。',
      'Choose one of four tasks per sitting;write sign tables and candidate comparisons on paper,or split longer tasks. All are human-reviewed without a timer. Plots are finite-window approximations;original rules and arguments determine complete domains and conclusions.',
    ),
    questions: [
      {
        ...q(
          1,
          1,
          `图示f(x)=−1/(x−(${c}))，域R\\{${c}}。求导数并用一般符号说明每支的增减；能称整个不连通域严格递增吗？亲给跨缺口的两输入反例，并解释不能跨缺口套平均值定理。再在一个支内给函数值为负而仍递增的例子，区别f符号和f′符号。图窗外和灰虚线分别代表什么？`,
          `For plotted f(x)=−1/(x−(${c})),domain R\\{${c}},find f′ and prove monotonicity on each branch. Is it strictly increasing on the whole disconnected domain? Give two inputs straddling the gap as a counterexample,and explain why the mean value theorem cannot bridge it. Give negative function values on an increasing branch,distinguishing f from f′. What do off-window branches and the grey line mean?`,
          `f′=1/(x−(${c}))²>0于原域，故在(−∞,${c})、(${c},∞)各自严格递增。取x1=${c - 1}<x2=${c + 1}，f(x1)=1>−1=f(x2)，违反全域递增定义。跨缺口闭区间含无定义点，不满足连续/可导条件，不能用平均值定理连接两支。右支x=${c + 1},${c + 2}给−1<−1/2，函数负而递增，f与f′符号不同。灰线是被排除x，不是函数，窗外两支继续；有限图线不替原域或一般符号证明。`,
          `Derivative1/(x−(${c}))² is positive throughout the original domain,so each interval(−∞,${c}) and(${c},∞) is strictly increasing. Yet x1=${c - 1}<x2=${c + 1} gives f(x1)=1>−1=f(x2),violating global increasingness. A closed interval crossing the gap lacks continuity/differentiability,so the mean value theorem cannot connect branches. On the right,x=${c + 1},${c + 2} gives−1<−1/2:negative values can increase. The grey excluded line is not the function,and both branches continue outside the window.`,
          '增减定义比较任意两合法输入；导数判据先要求同一没有缺口的区间。',
          'Increasingness compares any two domain inputs. The derivative criterion first needs a single interval without a gap.',
        ),
        diagram: picture,
      },
      q(
        2,
        2,
        `对${first ? 'f(x)=x³−12x，x∈[−4,4]' : 'f(x)=x³−3x，x∈[−3,2]'}找全部驻点、用区间符号判断严格双侧局部极值，再比所有闭区间候选给全部绝对最值位置和值。为何端点不能漏，也不能只解f′=0？另以x³在0、|x|在0及x²在(0,3)分别说明零斜率、不可导、开端点的限制。明确本题“局部”约定。`,
        `For${first ? 'f(x)=x³−12x on[−4,4]' : 'f(x)=x³−3x on[−3,2]'},find all stationary points,classify strict two-sided local extrema by interval signs,and compare all closed-interval candidates for every absolute extremum. Why include endpoints and not just solve f′=0? Use x³ at zero,|x| at zero,and x² on(0,3) to explain zero-slope,nondifferentiable and open-endpoint limitations. State the local convention.`,
        `${first ? 'f′=3(x−2)(x+2)，符号+、−、+，−2处局部极大16、2处局部极小−16。候选−4,−2,2,4的值−16,16,−16,16；绝对最大16在{−2,4}，最小−16在{−4,2}。' : 'f′=3(x−1)(x+1)，符号+、−、+，−1局部极大2、1局部极小−2。候选−3,−1,1,2的值−18,2,−2,2；绝对最大2在{−1,2}，最小−18在{−3}。'}本题局部指严格双侧内点，不将端点按另一约定混入。多项式连续闭区间取到绝对最值，端点也是候选。x³在0处导数0却无局部极值；|x|在0处不可导却严格局部极小；x²在(0,3)的下确界0、上确界9均未取到，无绝对最小/最大。可导内点极值必驻点，但逆命题不成立，有限试点不能代全域比较。`,
        `${first ? 'f′=3(x−2)(x+2),with signs+,-,+. At−2 there is a local maximum16;at2 a local minimum−16. Candidates−4,−2,2,4 have values−16,16,−16,16. Absolute maximum16 occurs at{−2,4},minimum−16 at{−4,2}.' : 'f′=3(x−1)(x+1),with signs+,-,+. Local maximum two occurs at−1,local minimum−2 at one. Candidates−3,−1,1,2 have values−18,2,−2,2. Absolute maximum two occurs at{−1,2},minimum−18 at{−3}.'} Local means strict,two-sided,interior here. Continuity on the closed interval ensures attained absolute extrema;endpoints remain candidates. Cubic x³ has zero derivative at zero without an extremum;|x| has a strict minimum there without a derivative. On(0,3),x² has unattained infimum zero and supremum nine,so neither absolute extremum. The stationary condition is necessary only for differentiable interior extrema,not sufficient.`,
        '先标完整定义域与端点，再分驻点、不可导点和端点；保留并列位置。',
        'Mark domain and endpoint inclusion,then stationary,nondifferentiable and endpoint candidates. Retain ties.',
      ),
      q(
        3,
        3,
        `令u=${first ? 'x²−1' : 'x²+2'}，v=${first ? 'x+2' : '2x−1'}。求(uv)′，标u′v和uv′两项，再展开原乘积独立核恒等。在x=1分别给原乘积、正确变化率、错误u′v′。从增量乘积加减中间项推一般差商，为什么极限中需要可导保证连续，不能只把两率相乘？`,
        `Let u=${first ? 'x²−1' : 'x²+2'},v=${first ? 'x+2' : '2x−1'}. Find(uv)′,identifying u′v and uv′,then independently check by expanding the original product. At x=1,give uv,the correct derivative and incorrect u′v′. Derive the general quotient by adding/subtracting an intermediate product. Why does differentiability imply the continuity needed in the limit,rather than multiplying rates?`,
        `${first ? 'u′v=2x(x+2)、uv′=(x²−1)，合3x²+4x−1。展开uv=x³+2x²−x−2再求导同式；x=1处原积0、正确率6、错误两率积2。' : 'u′v=2x(2x−1)、uv′=2(x²+2)，合6x²−2x+4。展开2x³−x²+4x−2再求导同式；x=1原积3、正确率8、错误两率积4。'}一般加减u(x)v(x+h)，除h≠0得[Δu/h]v(x+h)+u(x)[Δv/h]。两函数在x可导，故v(x+h)→v(x)，两个差商趋导数，得到u′v+uv′；原高度uv、率乘率u′v′均非此变化量。每项只求一个因子的导数，不能省原另因子。`,
        `${first ? 'Terms2x(x+2) and(x²−1) give3x²+4x−1. Expansion x³+2x²−x−2 yields the same derivative. At one,uv=0,correct rate six,but u′v′=2.' : 'Terms2x(2x−1) and2(x²+2) give6x²−2x+4. Expansion2x³−x²+4x−2 yields the same derivative. At one,uv=3,correct rate eight,but u′v′=4.'} Add/subtract u(x)v(x+h) in the increment and divide by nonzero h to obtain[Δu/h]v(x+h)+u(x)[Δv/h]. Differentiability implies continuity,so v(x+h)→v(x),and quotient limits give u′v+uv′. Neither original height uv nor product of rates u′v′ is this change rate.`,
        '乘积增量需加减一个混合时点的积；极限后每项保另一个原因子。',
        'Add/subtract a mixed-time product in the increment. Each limiting term retains the other original factor.',
      ),
      q(
        4,
        5,
        `虚构正方形边长ℓ(t)=${first ? '2+3t' : '4−t'}米，模型只授权${first ? '0≤t≤2' : '0≤t≤3'}秒。求t=1的边长、面积、面积变化率和全部单位，说明负面积率是否意味着负面积。再看r(t)=(t−1)³米、0≤t≤2秒，t=1速度0是否全段静止或转向？给两时刻和速度符号。能把前一模型直接用于t=−1或10吗，代数延拓和情境授权怎样分开？`,
        `A fictional square has side ℓ(t)=${first ? '2+3t' : '4−t'} metres,authorised only for${first ? '0≤t≤2' : '0≤t≤3'} seconds. At t=1,find side,area and area rate with units. Does a negative area rate mean negative area? For separate r(t)=(t−1)³ metres on0≤t≤2 seconds,does zero velocity at one imply rest throughout or reversal? Give two times and velocity signs. May the first model be used at t=−1 or10? Separate algebraic extension from authorised context.`,
        `${first ? 't=1边长5米、面积25平方米；A′=2(2+3t)·3=6(2+3t)，t=1为30平方米/秒。' : 't=1边长3米、面积9平方米；A′=2(4−t)(−1)=−2(4−t)，t=1为−6平方米/秒，面积正但在减小。'}边长率单位米/秒，2ℓ单位米，相乘为平方米/秒，面积本身不是变化率。r(0)=−1米、r(2)=1米，v=3(t−1)²在1为0、两侧正，非整段静止且不转向；位置负不表示速度负。t=−1或10超授权范围，即使公式可算不自动说明真实边长或面积率；不因平方后面积非负就忽略不合法边长/时间。`,
        `${first ? 'At one,side five metres and area25 m²;A′=6(2+3t),so30 m²/s.' : 'At one,side three metres and area nine m²;A′=−2(4−t),so−6 m²/s. Positive area is decreasing.'} Side rate uses m/s,and2ℓ uses metres,so their product is m²/s rather than area. For the separate motion,r(0)=−1 metre,r(2)=1 metre,and v=3(t−1)² is zero at one but positive on both sides:no interval-wide rest or reversal. Negative position does not imply negative velocity. Times−1 and10 are outside the first model’s authorised range. Calculable extensions do not establish actual side/area rates,and nonnegative squared area does not repair an invalid side/time.`,
        '先列量与单位，面积率必须乘边长率；瞬时速度零还需核两侧符号。',
        'List quantities and units first. Area rate needs the side-rate factor;zero velocity requires a separate sign check.',
      ),
    ],
  };
};
export const functionAnalysisRetrieval = {
  H32_ANALYSIS: makeSet('H32'),
  H35_ANALYSIS: makeSet('H35'),
};
