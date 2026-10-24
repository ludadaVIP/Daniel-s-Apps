import { t, type NumberDiagram } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'H36' | 'H38') => {
  const first = unit === 'H36',
    id = (i: number) => `${unit}-MAINT-CALCULUS-INTEGRAL-Q${i}`;
  const edges = first ? [0, 0.5, 1.5, 2] : [0, 1, 2.5, 3],
    f = (x: number) => (first ? x * x : 2 * x);
  const sourceEdges = first ? ['0', '1/2', '3/2', '2'] : ['0', '1', '5/2', '3'];
  const rectangles = edges.slice(1).map((r, i) => {
    const l = edges[i]!,
      m = (l + r) / 2,
      h = f(m);
    return {
      name: `midpoint cell ${i + 1}`,
      color: '#99929f',
      points: [
        { x: l, y: 0 },
        { x: l, y: h },
        { x: r, y: h },
        { x: r, y: 0 },
        { x: l, y: 0 },
      ],
    };
  });
  const riemannPicture: NumberDiagram = {
    kind: 'cartesian',
    bounds: {
      xMin: 0,
      xMax: first ? 2.5 : 3.5,
      yMin: 0,
      yMax: first ? 5 : 7,
      xStep: 0.5,
      yStep: 1,
    },
    points: edges.slice(1).map((r, i) => {
      const m = (edges[i]! + r) / 2;
      return { x: m, y: f(m), label: `M${i + 1}` };
    }),
    curves: [
      {
        name: 'given function',
        color: '#5850a1',
        points: Array.from({ length: 61 }, (_, i) => {
          const x = (edges.at(-1)! * i) / 60;
          return { x, y: f(x) };
        }),
      },
      ...rectangles,
    ],
    caption: t(
      `给定f(t)=${first ? 't²' : '2t'}及分割${sourceEdges.join('，')}。灰矩形采用每格中点；各格宽不相同，未给面积答案。函数曲线为近似，矩形面积须用原坐标宽乘高，不能数像素或统一套一格宽。`,
      `Given f(t)=${first ? 't²' : '2t'} and partition${sourceEdges.join(', ')}. Grey rectangles use each cell’s midpoint;cell widths differ and area totals are not supplied. The curve is approximate;rectangle areas use coordinate widths times heights,not pixels or one assumed common width.`,
    ),
  };
  const lo = -1,
    hi = first ? 4 : 2,
    top = (x: number) => (first ? 3 * x : x * x),
    bottom = (x: number) => (first ? x * x : x);
  const areaPicture: NumberDiagram = {
    kind: 'cartesian',
    bounds: {
      xMin: lo,
      xMax: hi,
      yMin: first ? -4 : -2,
      yMax: first ? 16 : 4,
      xStep: 1,
      yStep: first ? 4 : 1,
    },
    points: [],
    curves: [
      {
        name: first ? '3x' : 'x squared',
        color: '#5850a1',
        points: Array.from({ length: 81 }, (_, i) => {
          const x = lo + ((hi - lo) * i) / 80;
          return { x, y: top(x) };
        }),
      },
      {
        name: first ? 'x squared' : 'x',
        color: '#a14532',
        points: Array.from({ length: 81 }, (_, i) => {
          const x = lo + ((hi - lo) * i) / 80;
          return { x, y: bottom(x) };
        }),
      },
    ],
    xLabel: 'x (m)',
    yLabel: 'y (m)',
    caption: t(
      `仅为第六题的几何模型：蓝紫y=${first ? '3x' : 'x²'}、棕色y=${first ? 'x²' : 'x'}，x∈[−1,${hi}]。公式用米坐标的数值，纵横轴均为米；近似曲线不替代精确交点和分段积分，也不是前两个运动/流量模型的图。`,
      `Only the geometry model in task six:blue-purple y=${first ? '3x' : 'x²'},brown y=${first ? 'x²' : 'x'},x∈[−1,${hi}]. Formulas use numerical metre coordinates;both axes are in metres. Approximate curves do not replace exact intersections and segmented integration,and do not depict the preceding motion/flow models.`,
    ),
  };
  const task = (
    i: number,
    z: string,
    en: string,
    sz: string,
    se: string,
    hz: string,
    he: string,
  ) =>
    reasoning(id(i), t(z, en), `integration-${i}`, t(sz, se), [
      t(hz, he),
      t(
        '保原区间、采样点、单位与条件；求导回查或精确分段支持数学，有限数表和图形只是检查，不能直接认作极限或现实保证。',
        'Retain intervals,tags,units and premises. Derivative checks or exact segmentation support the mathematics;finite tables and plots are checks,not limit proofs or real-world guarantees.',
      ),
    ]);
  const intervals = first
      ? ['[0,1)', '[1,3)', '[3,4]']
      : ['[0,2)', '[2,3)', '[3,5]'],
    rates = first ? [3, 1, 5] : [1, 5, 2];
  return {
    id: `${unit}-MAINT-CALCULUS-INTEGRAL`,
    unit,
    bridge: 'H32-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5, 6].map((i) => [id(i), `H32-L0${i}`]),
    ),
    title: t(
      '解析与项目之后，再核积分的量与条件',
      'After geometry and projects,recheck integral quantities and premises',
    ),
    intro: t(
      '六题分次，每次只做一题或一个小问，可在纸上画图。第六题的三模型可分三次；人工确认前应核齐该题所有部分。全为不计时人审，数据是虚构数学给定，未当真实测量或家庭试用。',
      'Choose one task or subpart per sitting and sketch on paper. Task six’s three models can occupy three sittings;review every part before confirming a whole task. All work is human-reviewed without a timer. Data are fictional mathematical givens,not actual measurements or a family trial.',
    ),
    questions: [
      {
        ...task(
          1,
          `表给虚构分段流入率p(t)，t分钟、率升/分钟，无流出和溢流。求每段时长、全段新增量与平均率，说明为何不能把三个率直接平均。若初始${first ? 8 : 3}升，在t=${first ? '3/2' : '5/2'}分钟时给新增量、实际量与瞬时率，三者为何不同？零时长增量、平均率、当前率分别怎样？若只改一个跳点的率值，哪些累积量会改变？`,
          `The table gives fictional piecewise inflow p(t),with t in minutes and rate in L/min,no outflow or overflow. Find each duration,total addition and average rate. Why not simply average the three rates? Starting with${first ? 8 : 3} litres,at t=${first ? '3/2' : '5/2'} give addition,actual amount and instantaneous rate. Distinguish zero-duration addition,average and current rate. What if only a jump point’s rate value changes?`,
          `${first ? '时长1,2,1分钟，新增3×1+1×2+5×1=10升，平均10/4=5/2升/分钟，不是(3+1+5)/3=3。t=3/2新增3+1/2=7/2升，实际8+7/2=23/2升，当前率1升/分钟。' : '时长2,1,2分钟，新增1×2+5×1+2×2=11升，平均11/5升/分钟，不是8/3。t=5/2新增2+5/2=9/2升，实际3+9/2=15/2升，当前率5升/分钟。'}每段宽乘高单位升，平均另除总时间，不按段数权重。t=0新增0，实际等初始量，当前率${first ? 3 : 1}仍非0；零时长平均是0/0未定义，不能填0或照抄当前率。改有限个点的率不改变这些积分或非零时长平均，因为单点无时间宽度；只改该时刻的函数值。模型条件和初始量须独立保留。`,
          `${first ? 'Durations1,2,1 minutes give additions3+2+5=10 L and average5/2 L/min,not the unweighted mean three. At=3/2,addition7/2 L,actual23/2 L and current rate1 L/min are distinct.' : 'Durations2,1,2 minutes give additions2+5+4=11 L and average11/5 L/min,not8/3. At=5/2,addition9/2 L,actual15/2 L and current rate5 L/min are distinct.'} Width times height has litre units;average rate divides by total duration. At zero elapsed time,addition is zero,actual amount is initial and current rate${first ? 3 : 1} is not zero. The zero-duration average is undefined0/0,not zero or the instantaneous rate. Changing finitely many point heights alters neither these integrals nor nonzero-duration averages because points have no time width. Retain initial state and model premises separately.`,
          '宽是时间、高是率；先逐段相乘，再区分新增、初始量与要不要除总时长。',
          'Widths are durations,heights rates. Multiply per segment before distinguishing addition,initial state and division by total duration.',
        ),
        contextTable: {
          caption: t(
            '给定分段常数流入模型；端点按表取值',
            'Given piecewise-constant inflow model;endpoints follow the table',
          ),
          columns: [
            t('时间段/分钟', 'Time interval/min'),
            t('流入率/升每分钟', 'Inflow/L per minute'),
          ],
          rows: intervals.map((v, i) => [
            t(v, v),
            t(String(rates[i]), String(rates[i])),
          ]),
        },
      },
      {
        ...task(
          2,
          `f(t)=${first ? 't²在[0,2]' : '2t在[0,3]'}，分割点${sourceEdges.join('、')}。亲算每格宽、合法左/中/右采样和对应三个黎曼和，与精确积分比较；为何非等宽不能统一乘一格宽，中点也不总精确？另保留第一格[0,1]且左采样0，其余[1,${first ? 2 : 3}]均分n格都左采样，求总和公式及极限，网格最大宽是否趋0？用${first ? '|u²−v²|≤4|u−v|' : '|2u−2v|≤2|u−v|'}给任意合法采样的误差界，说明何种细分才支持一般收敛。`,
          `For f(t)=${first ? 't² on[0,2]' : '2t on[0,3]'},partition at${sourceEdges.join(', ')}. Compute widths,left/mid/right tags and all three sums against the exact integral. Why not use a common width or assume midpoint exactness? Now keep[0,1] with left tag zero and split[1,${first ? 2 : 3}] into n equal left-tagged cells. Derive the total and limit;does maximum mesh shrink? Use${first ? '|u²−v²|≤4|u−v|' : '|2u−2v|≤2|u−v|'} to bound error for ANY legal tags and explain the required refinement condition.`,
          `${first ? '宽1/2,1,1/2，左采样0,1/2,3/2，中点1/4,1,7/4，右1/2,3/2,2；和分别11/8、41/16、35/8，精确8/3，三者均不等。首格贡献0，其余和为(1/n)Σ_{j=0}^{n−1}(1+j/n)²，用Σj=n(n−1)/2、Σj²=n(n−1)(2n−1)/6得L_n=7/3−3/(2n)+1/(6n²)，趋7/3而非8/3，最大格宽恒1。' : '宽1,3/2,1/2，左采样0,1,5/2，中点1/2,7/4,11/4，右1,5/2,3；和分别11/2、9、25/2，精确9。中点对这个仿射函数精确，不是所有函数都如此。首格贡献0，其余(2/n)Σ_{j=0}^{n−1}(2+4j/n)=L_n=8−4/n趋8而非9，最大宽max(1,2/n)≥1，n≥2才恒1。'}递增函数左/右给下/上和，合法样点须逐格在其闭区间中；相同边界点不产生额外宽度。每格误差≤${first ? 4 : 2}·mesh·格宽，累加≤${first ? 8 : 6}mesh，因此全域最大宽趋0时任意合法采样误差趋0。只增加别处格数不满足条件；有限表说明当前分割，不证明全部极限。矩形用坐标宽高而非像素。`,
          `${first ? 'Widths1/2,1,1/2 give left tags0,1/2,3/2;midpoints1/4,1,7/4;right tags1/2,3/2,2. Sums are11/8,41/16,35/8 versus exact8/3,none equal. The first cell contributes zero;the rest is(1/n)Σ(1+j/n)² for j=0..n−1. The standard sums of j and j² give L_n=7/3−3/(2n)+1/(6n²)→7/3,not8/3,with mesh one.' : 'Widths1,3/2,1/2 give left tags0,1,5/2;midpoints1/2,7/4,11/4;right tags1,5/2,3. Sums11/2,9,25/2 compare with exact nine. Midpoint exactness here follows affinity,not a universal rule. The first cell contributes zero;the rest is(2/n)Σ(2+4j/n),j=0..n−1,giving L_n=8−4/n→8,not nine,and mesh max(1,2/n),equal to one only for n≥2.'} Increasing f bounds legal tagged sums by left/right sums. Each tag lies in its cell;shared endpoints create no extra width. Per-cell error is at most${first ? 4 : 2}mesh times width,so total error≤${first ? 8 : 6}mesh. Thus maximum width shrinking to zero controls ANY legal tagged sum. Adding cells elsewhere is insufficient. Finite tables check partitions,not all limits,and pixels are not coordinate areas.`,
          '每格分别算宽和采样；网格宽是最大值。将每格误差按宽加总，才能覆盖任意合法采样。',
          'Compute each width/tag separately;mesh is the maximum. Sum width-weighted cell error bounds to cover arbitrary legal tags.',
        ),
        diagram: riemannPicture,
      },
      task(
        3,
        `另设平滑净率f(t)=${first ? '3t²−2t+2' : '−2t+6'}升/分钟，0≤t≤2。求完整原函数族，再由${first ? 'S(0)=4升' : 'S(1)=10升'}确定状态S，给S(0)、S(2)及0到2的净变化，求导回查。只给一个正确原函数为何不够？F+C²能代表全部吗，F+2C−7呢？说明“同一连通区间”前提，构造两支域上的反例；再对e^x+C、−cos x+C求导回查（此x为弧度实变量）。`,
        `In a SEPARATE smooth net-rate model,f(t)=${first ? '3t²−2t+2' : '−2t+6'} L/min on0≤t≤2. Find the full primitive family,then use${first ? 'S(0)=4 L' : 'S(1)=10 L'} to determine S,its values at zero/two and net change. Differentiate back. Why not give only one primitive? Compare F+C² with F+2C−7. Explain the connected-interval premise and give a two-branch-domain counterexample. Also differentiate e^x+C and−cos x+C,where x is a real radian variable.`,
        `${first ? '完整F(t)=t³−t²+2t+C；初值给C=4，S(0)=4、S(2)=12，净变化8升，导数回3t²−2t+2。' : '完整F(t)=−t²+6t+C；S(1)=10给C=5，S(0)=5、S(2)=13，净变化8升，而1到2仅3升。'}将输出按升写成数值函数时，C须遍历全体实数；实际附加量的单位为升。一个候选只证它属于族，F+C²漏负附加常数，F+2C−7因非零仿射参数覆盖全实数仍全族；初值后须固定常数而非仍报任意族。若两原函数在同一连通区间可导，差导数0，由平均值定理差为同一常数。域R去0时，G(x)=x，H(x)在负支为x、正支为x+1，两者导数均1却差分别0和1，须每支各一常数。另(e^x+C)′=e^x、(−cos x+C)′=sin x；回查恒等与族完整性是两项检查，不能靠少量代值。`,
        `${first ? 'Full family F(t)=t³−t²+2t+C;the initial value gives C=4,S(0)=4,S(2)=12 and change eight litres.' : 'Full family F(t)=−t²+6t+C;S(1)=10 gives C=5,S(0)=5,S(2)=13 and change eight;the change from one to two is only three.'} Differentiate to recover the given rate. C ranges over all real numerical constants for an amount reported in litres. One candidate does not describe the whole family. C² misses negative added constants;2C−7 covers every real constant. An initial value fixes C. On a connected interval,two primitives have difference derivative zero and the mean value theorem makes that difference constant. On R excluding zero,G=x and H=x on the negative branch but x+1 on the positive branch both have derivative one,yet their differences are zero/one. Use a separate constant per component. Also(e^x+C)′=e^x and(−cos x+C)′=sin x. Derivative identity and complete parameter range are separate checks.`,
        '先求任意实常数族，再用初值固定；常数的参数写法必须确实覆盖所有实数。',
        'Find the arbitrary-real-constant family before applying initial data. Its parameterisation must actually cover every real constant.',
      ),
      task(
        4,
        `纯数学坐标中f(t)=${first ? 't−1' : '2t−4'}。求0到3定积分及两端之间的总几何面积，给零点与每块贡献。反向3到0、等端点积分各怎样，同一几何区域的面积变负吗？若上界改${first ? 2 : 4}，净积分0能说明f恒0吗？解释同一原函数的C为何消去，不能两端各选一个不同常数。`,
        `In pure coordinate mathematics let f(t)=${first ? 't−1' : '2t−4'}. Find the integral0..3 and total geometric area,giving zeros and signed pieces. Compare reversed3..0 and equal-endpoint integrals:does the same region’s area become negative? With upper limit${first ? 2 : 4},does a zero integral imply f is identically zero? Explain cancellation of ONE primitive’s constant,not separately chosen endpoint constants.`,
        `${first ? '零点1，负块积分−1/2、正块2，合3/2；几何面积1/2+2=5/2。反向−3/2，同一区域面积仍5/2。上界2时两块各1/2，净0、总面积1，函数并非恒0。' : '零点2，0到2积分−4、2到3积分1，净−3；几何面积4+1=5。反向积分3，面积仍5。上界4时两块各4，净0、总面积8，函数不恒0。'}等端点积分0与该点函数值无关。原函数可取${first ? 't²/2−t' : 't²−4t'}，有向积分F(b)−F(a)，同一C同时加入后抵消。两端独立常数不是同一原函数，制造任意差值。几何面积先按左右有序区间对|f|积分，不能把|∫f|当总面积或一律删除负号；像素面积和物理单位须另说明。`,
        `${first ? 'Zero one splits signed pieces−1/2 and two,total3/2;geometric area5/2. Reversal gives−3/2 but the region still has area5/2. Changing the upper limit to two gives cancelling halves,total area one despite zero integral.' : 'Zero two splits signed pieces−4 and one,total−3;geometric area five. Reversal gives three but area stays five. Changing the upper limit to four gives cancelling areas four each,total area eight despite zero integral.'} Equal endpoints give zero regardless of point height. Primitive${first ? 't²/2−t' : 't²−4t'} yields F(b)−F(a);a shared C cancels. Independent endpoint constants do not describe one primitive and create arbitrary differences. Area uses |f| over the left-to-right interval,not |∫f| or indiscriminate deletion of minus signs. Coordinate area does not automatically carry an unspecified physical unit.`,
        '先分正负贡献与无向面积；反向改积分符号，不改同一区域本身。',
        'Separate signed contributions from unoriented area. Reversing bounds changes the integral sign,not the region.',
      ),
      task(
        5,
        `A(x)=${first ? '∫₁^(2x)t²dt' : '∫₀^(x²)(t+1)dt'}。分别求完整A、A′、A(1)、A′(1)${first ? '' : '与A′(0)'}，说明为何上限内导不能漏。用附近平均高度的双侧极限解释基本定理的连续内点条件。另q(t)在t<${first ? 1 : 2}时2、t≥${first ? 1 : 2}时5，B(x)=∫₀ˣq(t)dt：在跳点的左右导数、连续性、B′怎样？只改q的该点值会改变积分吗，能用点值或两侧平均冒充导数吗？`,
        `Let A(x)=${first ? '∫₁^(2x)t²dt' : '∫₀^(x²)(t+1)dt'}. Find A,A′,A(1),A′(1)${first ? '' : ' and A′(0)'},retaining the upper-limit inner factor. Use two-sided nearby average heights to explain the theorem’s continuity/interior-point premise. Separately,q(t)=2 below${first ? 1 : 2},five at/above it,and B(x)=∫₀ˣq(t)dt. Give B’s continuity,one-sided derivatives and derivative status at the jump. Does altering q’s point value change the integral,and may a point value or side average replace the derivative?`,
        `${first ? 'A=(8x³−1)/3，A′=8x²，A(1)=7/3、A′(1)=8。' : 'A=x⁴/2+x²，A′=2x(x²+1)，A(1)=3/2、A′(1)=4、A′(0)=0；只代积分上限会在0错给1。'}固定下限时累积差商是去心附近的平均高度，连续内点使正负h两侧都趋f(x)，所以累积导数为f，不是累积值等于f。上限g(x)还乘g′，本例${first ? '2' : '2x'}；可先积分再求导独立核恒等。跳点c=${first ? 1 : 2}时B=2x在左，右为2c+5(x−c)，两支在c同值2c所以连续；左右导数2、5不同，B′(c)不存在。单点无宽度，q(c)改值不改B，不能由q(c)有值或平均7/2宣布导数；须核邻域和原条件。`,
        `${first ? 'A=(8x³−1)/3,A′=8x²,A(1)=7/3,A′(1)=8.' : 'A=x⁴/2+x²,A′=2x(x²+1),A(1)=3/2,A′(1)=4,A′(0)=0;omitting the inner factor would incorrectly give one at zero.'} A fixed-limit accumulation quotient is a nearby average height. At a continuous interior point,both sides tend to f(x),so the derivative is f,not the accumulated value. A moving g(x) adds factor${first ? 'two' : '2x'};integrating first independently checks the identity. At jump c=${first ? 1 : 2},B is2x to the left and2c+5(x−c) to the right. Values meet at2c,so B is continuous,but slopes two/five differ and no derivative exists there. Changing q(c) affects no width and no B. Neither a defined point value nor average7/2 supplies the missing derivative.`,
        '把累积值、导数和移动上限三层分开；跳点先分别算左右小区间平均率。',
        'Separate accumulated value,derivative and moving upper limit. At a jump,compute left/right local average rates separately.',
      ),
      {
        ...task(
          6,
          `三独立虚构模型，可分次报告。①v(t)=${first ? 't−2，0≤t≤4秒，s(0)=3米' : '2t−2，0≤t≤3秒，s(0)=5米'}：给位移、末位置、路程及两平均，按符号分段。②总流入q(t)=${first ? '3t+1，0≤t≤2分钟，初始2升、恒流出2升/分钟' : '2t+2，0≤t≤3分钟，初始4升、恒流出1升/分钟'}，无容量上限、溢流或蒸发：给总流入、流出、净变化和末量，并核水量非负。③图中两曲线在指定x区间内包围面积是多少平方米，须先求交点、换上/下。为什么同样像素颜色不能决定积分单位或把新增当状态？`,
          `Report three INDEPENDENT fictional models over separate sittings if useful.(1)v(t)=${first ? 't−2 on0..4 seconds,s(0)=3 metres' : '2t−2 on0..3 seconds,s(0)=5 metres'}:give displacement,final position,distance and both averages.(2)Gross inflow q(t)=${first ? '3t+1 on0..2 minutes,initial2 L,constant outflow2 L/min' : '2t+2 on0..3 minutes,initial4 L,outflow1 L/min'},with no capacity limit,overflow or evaporation:give inflow,outflow,net change,final amount and nonnegative-state check.(3)Find the area in m² between the plotted curves over the stated x interval,solving intersections and switching top/bottom. Why do pixel colours determine neither integral units nor actual state?`,
          `${first ? '运动零点2，位移0米、末位置3米，路程2+2=4米，平均速度0、平均速率1米/秒。流入8升、流出4升、净4升、末6升；状态2+3t²/2−t在t=1/3最小11/6升，故未空，可维持给定流出。几何差3x−x²在0、3换号，三段面积11/6、9/2、11/6，合49/6平方米。' : '运动零点1，位移3米、末位置8米，路程1+4=5米，平均速度1、平均速率5/3米/秒。流入15升、流出3升、净12升、末16升；状态4+t²+t在[0,3]递增且至少4升。几何差x²−x在0、1换号，三段5/6、1/6、5/6，合11/6平方米。'}速度积分是有向位移，速率|v|积分为路程；流入不是净率，状态还加初始量。几何取|两高度差|，不可固定一条永远在上。米/秒×秒是米、升/分钟×分钟是升、米×米才是平方米；坐标缩放不改这些量。保每个模型各自范围、顺序与无溢流等假设，区间外不授权真实预测，也不因算式漂亮认证测量或机制。`,
          `${first ? 'Motion changes sign at two:displacement zero,final position3 m,distance2+2=4 m,average velocity zero and speed1 m/s. Gross inflow8 L,outflow4 L,net4 L,final6 L;state2+3t²/2−t has minimum11/6 L at1/3,so prescribed outflow never empties it. Geometry difference3x−x² changes sign at0,3;areas11/6,9/2,11/6 total49/6 m².' : 'Motion changes sign at one:displacement3 m,final8 m,distance1+4=5 m,average velocity1 m/s and speed5/3 m/s. Gross inflow15 L,outflow3 L,net12 L,final16 L;state4+t²+t increases and stays at least4 L. Geometry difference x²−x changes sign at0,1;areas5/6,1/6,5/6 total11/6 m².'} Velocity integrates to signed displacement;|v| gives distance. Gross inflow is not net rate,and state also includes initial amount. Geometry uses the absolute height difference,not one permanently upper curve. Units multiply:m/s by seconds gives metres,L/min by minutes litres,metres by metres m². Pixel scaling changes none of them. Retain each model’s own range and assumptions;algebra does not certify measurements,mechanisms or outside-range reality.`,
          '先写所求量与单位，再选积分和分段；三个模型不要共享时间、初始量或纵轴意义。',
          'Name the quantity and units before choosing integrals and segments. The three models do not share time scales,initial states or vertical-axis meanings.',
        ),
        diagram: areaPicture,
      },
    ],
  };
};
export const calculusIntegralRetrieval = {
  H36_INTEGRAL: makeSet('H36'),
  H38_INTEGRAL: makeSet('H38'),
};
