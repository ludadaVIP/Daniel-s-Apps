import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import { rational, textR } from '../algebraModels';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = { stem: Pair; answer: AnswerSpec; step: Pair; wrong: string[] };
const I = (
  stem: Pair,
  answer: AnswerSpec,
  step: Pair,
  wrong: string[] = [],
): Item => ({ stem, answer, step, wrong });
const N = (stem: Pair, value: string, step: Pair, wrong: string[] = ['999']) =>
  I(stem, { kind: 'number', value }, step, wrong);
const P = (
  stem: Pair,
  integrand: string,
  value: string,
  family: boolean,
  step: Pair,
  wrong: string[],
  initial?: { x: string; value: string },
) =>
  I(
    stem,
    { kind: 'integral-primitive', integrand, value, family, initial },
    step,
    wrong,
  );
const E = (stem: Pair, step: Pair) =>
  I(stem, { kind: 'explain', rubric: T(step) }, step);
type Spec = {
  title: Pair;
  objective: Pair;
  hook: Pair;
  prerequisites: string[];
  keywords: Pair[];
  lab: Lesson['lab'];
  hints: Pair[];
  items: Item[];
  pick: { stem: Pair; correct: number; options: Pair[]; feedback: Pair[] };
  reason: Pair;
  rubric: Pair;
  prompts: Pair[];
  misconception: Pair;
};
const specs: Spec[] = [
  {
    title: ['面积累积的思想', 'Accumulation and area'],
    objective: [
      '由每段变化率乘实际时长累积数量，区分瞬时率、总增量与初始量。',
      'Accumulate rate times actual duration, distinguishing instantaneous rate, total change and initial amount.',
    ],
    hook: [
      '每分钟4升，与已经流入4升，是同一件事吗？',
      'Is four litres per minute the same as four litres already accumulated?',
    ],
    prerequisites: ['H25-L01', 'H31-L06'],
    keywords: [
      ['累积量', 'accumulation'],
      ['率乘时长', 'rate times duration'],
      ['单位', 'units'],
    ],
    lab: 'integral-accumulation',
    hints: [
      [
        '流入率q：0≤t<1为2，1≤t<3为4，3≤t≤4为1升/分钟。只算已经经历的时长，先分段。',
        'Inflow rate q is two on 0≤t<1, four on 1≤t<3, one on 3≤t≤4 L/min. Split time and include only elapsed widths.',
      ],
      [
        '每段升/分钟×分钟=升。A(t)只计从0起增加量，若初始有V₀，实际体积V=V₀+A。',
        'Each piece multiplies L/min by minutes to give litres. A(t) measures change from zero; actual volume is V₀+A(t).',
      ],
    ],
    items: [
      N(
        [
          'q(t)按上述三段2、4、1升/分钟，t单位分钟。到t=5/2共流入多少升？',
          'Using rates 2,4,1 L/min over the stated intervals, how many litres accumulate by t=5/2 minutes?',
        ],
        '8',
        [
          '第一分钟2升，再1.5分钟×4=6升，总8。',
          'Two litres in the first minute plus1.5×4=6 gives eight.',
        ],
        ['4', '10', '11'],
      ),
      N(
        [
          '同一流入过程到4分钟共增加多少升？',
          'How many litres are added by four minutes in the same process?',
        ],
        '11',
        ['2×1+4×2+1×1=11。', '2×1+4×2+1×1=11.'],
        ['7', '16'],
      ),
      N(
        [
          '同一过程从1到3分钟的增量多少升？',
          'What is the added volume from minute one through three?',
        ],
        '8',
        [
          '这一段率4，时长2，增量8。',
          'Rate four over two minutes gives eight litres.',
        ],
        ['4', '10'],
      ),
      N(
        [
          '同一过程0至4分钟的平均流入率多少升/分钟？',
          'Find average inflow over 0–4 minutes in L/min.',
        ],
        '11/4',
        [
          '总增量11除总时长4，不是简单平均三个不同长度的率。',
          'Divide total eleven by duration four; unequal segment lengths rule out an unweighted mean of rates.',
        ],
        ['7/3', '11', '4'],
      ),
      N(
        [
          '从0开始累计流入，A(0)是多少升？',
          'For accumulated inflow from zero, what is A(0) in litres?',
        ],
        '0',
        [
          '没有经历时间，增量0；这不要求当前流入率为0。',
          'No elapsed time gives zero change, without requiring zero current rate.',
        ],
        ['2', '4'],
      ),
      E(
        [
          '解释分段图中宽、高和面积的单位；若初始有5升，2.5分钟实际有多少？某个跳点的单点值是否改变累积量？',
          'Explain width, height and area units. With five litres initially, what is actual volume at 2.5 minutes? Does changing one jump-point value change accumulation?',
        ],
        [
          '宽是分钟，高为升/分钟，每段乘积与总面积为升。到2.5分钟A8，初始5则实际13升，不能把初始量算成流入。q(2.5)=4是瞬时率，与A8不同。跳点采用右侧值只是函数定义约定，改变有限个点的高度不改变这些矩形宽度或积分；单点没有时间宽度。平均率11/4还须除总时长，不能按三个率直接平均。',
          'Width is minutes, height L/min and each product and total area litres. At 2.5, accumulation eight plus initial five gives actual thirteen. Initial volume is not inflow. q(2.5)=4 is a rate, not accumulated eight. A right-sided jump value defines the function but changing finitely many point heights changes no time width or integral. Average rate 11/4 divides by total time, not by the number of pieces.',
        ],
      ),
    ],
    pick: {
      stem: [
        'q(2)=4升/分钟，能直接说什么？',
        'What follows directly from q(2)=4 L/min?',
      ],
      correct: 1,
      options: [
        ['2分钟前总流入4升', 'Four litres have accumulated by minute two'],
        ['该时刻流入率为4升/分钟', 'The inflow rate at that instant is4 L/min'],
        ['初始体积4升', 'Initial volume is four litres'],
      ],
      feedback: [
        ['累计还要乘各段时长相加。', 'Accumulation needs weighted durations.'],
        ['单位表达瞬时变化率。', 'The units describe a rate at an instant.'],
        ['率没有给初始体积。', 'The rate does not specify initial volume.'],
      ],
    },
    reason: [
      '为何平均率不能算(2+4+1)/3？给出正确权重并解释零时长。',
      'Why is(2+4+1)/3 not the average rate? Explain the correct weights and zero elapsed time.',
    ],
    rubric: [
      '三段时长1、2、1分钟不相同，应以时间加权：(2×1+4×2+1×1)/(1+2+1)=11/4升/分钟。除以段数错误地把三个率视作等时长。t0增量0、当前率仍2，增量与瞬时率不同；平均率增量/时长在零时长不能做0/0，需另谈瞬时率而不强填0。',
      'Durations1,2,1 are unequal, so use time weights to get(2×1+4×2+1×1)/4=11/4 L/min. Dividing by three falsely weights the rates equally. At zero, accumulation is zero but current rate two; average rate as change/duration is undefined at zero duration. Do not replace0/0 with zero or confuse it with instantaneous rate.',
    ],
    prompts: [
      [
        '图中面积的单位怎样从两轴得来？',
        'How do axis units produce the area unit?',
      ],
      [
        '初始量和这段时间增加量分别是什么？',
        'What are the initial amount and subsequent change?',
      ],
    ],
    misconception: [
      '率非累积量；不同宽度要加权，初始量另加。',
      'Rate differs from accumulation; unequal widths need weights and initial amount is separate.',
    ],
  },
  {
    title: ['黎曼和的直观表示', 'Visual Riemann sums'],
    objective: [
      '按每格真实宽度与采样高度构造黎曼和，并用上下和与网格宽度解释逼近。',
      'Build tagged sums using actual widths and use lower/upper sums and mesh to explain approximation.',
    ],
    hook: [
      '矩形更多就一定精确吗？格子不等宽还可以直接乘同一个宽度吗？',
      'Do more rectangles make a sum exact? Can unequal cells all use the same width?',
    ],
    prerequisites: ['H32-L01', 'H25-L03'],
    keywords: [
      ['采样点', 'tag'],
      ['网格宽度', 'mesh'],
      ['上下和', 'lower and upper sums'],
    ],
    lab: 'integral-riemann',
    hints: [
      [
        '每格贡献f(ξᵢ)Δxᵢ，采样点须在该格内。非等宽格要分别乘宽度。',
        'Each term is f(ξᵢ)Δxᵢ with its tag inside the cell. Unequal cells need separate widths.',
      ],
      [
        '本课函数连续，最宽一格趋0时上下和夹住同一极限；有限图不证明一般收敛，取样方式也不保证总低估。',
        'These functions are continuous. As the largest width tends to zero, lower and upper sums squeeze the integral. A finite display is not a general proof or a universal lower-estimate guarantee.',
      ],
    ],
    items: [
      N(
        [
          'f(x)=x²在[0,2]等分4格，取各格中点，求黎曼和。',
          'For x² on[0,2], use four equal cells and midpoint tags. Find the sum.',
        ],
        '21/8',
        [
          '宽1/2，中点1/4、3/4、5/4、7/4；平方和乘1/2得21/8。',
          'Width1/2 and tags1/4,3/4,5/4,7/4 give sum21/8.',
        ],
        ['8/3', '7/4', '15/4'],
      ),
      N(
        [
          '同一函数、区间、4格，取左端点的和是多少？',
          'For the same function, interval and four cells, find the left sum.',
        ],
        '7/4',
        [
          '(0²+(1/2)²+1²+(3/2)²)×1/2=7/4。',
          'Sum squared left endpoints and multiply by 1/2 to get7/4.',
        ],
        ['21/8', '8/3'],
      ),
      N(
        [
          '同一条件取右端点的和是多少？',
          'Find the right sum under the same conditions.',
        ],
        '15/4',
        [
          '((1/2)²+1²+(3/2)²+2²)×1/2=15/4。',
          'Squared right endpoints times1/2 give15/4.',
        ],
        ['21/8', '7/4'],
      ),
      N(
        [
          '同一等分4格的网格宽度（最大Δx）是多少？',
          'What is the mesh, the largest cell width, for this partition?',
        ],
        '1/2',
        ['总长2除4=1/2，各格相同。', 'Total length two divided by four is1/2.'],
        ['4', '2'],
      ),
      N(
        [
          '改用非等宽边界0、1/4、1、2，仍对x²用中点。求加权黎曼和。',
          'For x² use nonuniform edges0,1/4,1,2 and midpoint tags. Find the weighted sum.',
        ],
        '163/64',
        [
          '宽1/4、3/4、1，中点1/8、5/8、3/2；贡献1/256+75/256+9/4=163/64。',
          'Widths1/4,3/4,1 and tags1/8,5/8,3/2 give1/256+75/256+9/4=163/64.',
        ],
        ['21/8', '8/3', '67/64'],
      ),
      E(
        [
          '比较x²在[0,2]的左右中点和与精确积分8/3，说明非等宽权重、最大格宽及有限试验的限度。',
          'Compare left, right and midpoint sums for x² with exact integral 8/3. Explain nonuniform weights, mesh and limits of finite trials.',
        ],
        [
          '4格的左7/4、右15/4、中21/8，均不等于8/3。x²递增，左右分别为下上和；任意取样在逐格最小最大值构成的界之间。非等宽须逐格乘实际宽，不能统一乘1/2。连续函数的网格宽度趋0才支持一般黎曼逼近；只增加某处格数、留大格不变不够。中点对直线可精确，对曲线不普遍精确，有限表只核当前分割，不替代极限论证。',
          'Four-cell left 7/4,right 15/4,mid 21/8 all differ from 8/3. Increasing x² makes the left/right sums lower/upper bounds; arbitrary tags lie between cellwise minimum and maximum sums. Nonuniform cells require actual widths. For continuous functions, convergence concerns the largest width tending to zero, not just adding cells while a large gap remains. Midpoints are exact for affine functions but not arbitrary curves. Finite tables audit current partitions rather than prove a limit.',
        ],
      ),
    ],
    pick: {
      stem: [
        '对任意连续曲线，中点和一定怎样？',
        'For an arbitrary continuous curve, what must hold for a midpoint sum?',
      ],
      correct: 2,
      options: [
        ['一定精确', 'It is always exact'],
        ['一定低估', 'It always underestimates'],
        [
          '是按各格中点与宽度计算的和，误差需另查',
          'It uses midpoint heights and widths; error needs checking',
        ],
      ],
      feedback: [
        ['x²四格21/8并非8/3。', 'For x²,21/8 is not8/3.'],
        ['凹曲线可能高估。', 'A concave curve can be overestimated.'],
        [
          '取样规则不是精确性或误差方向保证。',
          'Tag choice alone gives no exactness or universal error sign.',
        ],
      ],
    },
    reason: [
      '只把第一格不断细分，却保留一格宽1，能说网格宽度趋0吗？为何格数不是充分证据？',
      'If only the first cell is refined while a width-one cell remains, does mesh tend to zero? Why is cell count insufficient?',
    ],
    rubric: [
      '网格宽度定义为全部格宽的最大值，不是格宽平均值。保留宽1的格时最大值至少1，无论另处新增多少小格都未趋0。连续函数黎曼和收敛的条件涉及全域分割变细和合法采样；本例可比较上下和之差暴露尚未控制的大格。有限次变小也不等于已完成无穷极限论证。',
      'Mesh is the maximum cell width, not an average. A retained width-one cell keeps mesh at least one regardless of added cells elsewhere. The continuous-function convergence statement concerns refinement across the domain and admissible tags. Lower/upper differences expose an uncontrolled large cell. Finitely many refinements are still not an infinite-limit proof.',
    ],
    prompts: [
      ['每个矩形实际宽多少？', 'What is each rectangle’s actual width?'],
      ['哪一格决定当前最大格宽？', 'Which cell determines the current mesh?'],
    ],
    misconception: [
      '格数增多不自动等于网格宽度趋0；中点不总精确或低估。',
      'More cells do not automatically force mesh to zero; midpoints need not be exact or underestimate.',
    ],
  },
  {
    title: ['不定积分与原函数', 'Antiderivatives and indefinite integrals'],
    objective: [
      '用求导回查原函数，区分一个例子、任意常数族与初值确定的函数。',
      'Check primitives by differentiation and distinguish one example, a constant family and an initial-value solution.',
    ],
    hook: [
      'x²和x²+5的导数相同，积分答案为什么需要+C？',
      'Why do both x² and x²+5 have the same derivative, and why does integration need+C?',
    ],
    prerequisites: ['H31-L01', 'H31-L02'],
    keywords: [
      ['原函数', 'antiderivative'],
      ['任意常数', 'arbitrary constant'],
      ['初值', 'initial value'],
    ],
    lab: 'integral-primitive',
    hints: [
      [
        '先对候选F求导，必须对所有输入得到被积函数f；不是只在几个点数值相等。',
        'Differentiate the candidate F and recover f for every input, not merely selected values.',
      ],
      [
        '本课多项式在整个实轴讨论：所有原函数相差常数。完整族须保留任意C；给初值后再定常数。',
        'For these polynomials on the real line, primitives differ by a constant. Keep arbitrary C for a full family; an initial value fixes it.',
      ],
    ],
    items: [
      P(
        [
          '求∫(3x²−4)dx的完整原函数族，用C表示任意实常数。',
          'Give the full family for ∫(3x²−4)dx, using arbitrary real constant C.',
        ],
        '3x^2-4',
        'x^3-4x+C',
        true,
        [
          '逐项逆幂规则，求导得3x²−4，任意常数导数0。',
          'Reverse the power rule and check the derivative; arbitrary constants differentiate to zero.',
        ],
        ['x^3-4x', 'x^3-4x+C^2', '3x^3-4x+C'],
      ),
      P(
        [
          '给出2x的一个原函数，任选一个数值常数，不写未定C。',
          'Give one antiderivative of 2x, choosing a numerical constant rather than an undetermined C.',
        ],
        '2x',
        'x^2',
        false,
        [
          'x²、x²+5、x²−1/2均可，须求导得2x。',
          'x²,x²+5,x²−1/2 all work; differentiate to verify.',
        ],
        ['2x^2', 'x^2+C', 'x'],
      ),
      P(
        ['F′(x)=2x且F(0)=5，求F(x)。', 'Find F(x) with F′(x)=2x and F(0)=5.'],
        '2x',
        'x^2+5',
        false,
        [
          'F=x²+C，代0得C5，最后为x²+5。',
          'F=x²+C; the initial condition fixes C=5.',
        ],
        ['x^2', 'x^2+4', '2x+5'],
        { x: '0', value: '5' },
      ),
      P(
        ['求∫4x³dx的完整原函数族。', 'Give the full family for ∫4x³dx.'],
        '4x^3',
        'x^4+C',
        true,
        [
          '逆幂规则增指数后除新指数，得到x⁴+C。',
          'Raise the exponent and divide by the new exponent, giving x⁴+C.',
        ],
        ['4x^4+C', 'x^4', 'x^3+C'],
      ),
      P(
        ['求零函数的完整原函数族∫0dx。', 'Give the full family for ∫0dx.'],
        '0',
        'C',
        true,
        [
          '所有常数导数都0；只写0是一个例子，不是完整族。',
          'Every constant differentiates to zero; zero alone is one example.',
        ],
        ['0', 'x+C', 'C^2'],
      ),
      E(
        [
          '解释一个原函数与完整+C族、给定初值的区别；为何+C²不能代表全部常数？再核eˣ与−cos x的导数。',
          'Distinguish one primitive, the full+C family and an initial-value solution. Why is+C² incomplete? Check eˣ and−cos x by differentiating.',
        ],
        [
          '在同一连通区间，若F′=f，F+C都为原函数。对2x，x²+5是一个，x²+C为全部，F0=5固定为x²+5。C²只给非负附加常数，漏负值；2C或−C仍覆盖所有实常数，所以标准任意参数的非零仿射变换可代表同一族。本课自动检查多项式与仿射C；指数三角例中(eˣ+C)′=eˣ、(−cos x+C)′=sin x，仍需同一域内求导回查。',
          'On one connected interval, if F′=f then F+C are primitives. For2x, x²+5 is one example, x²+C is the family and F(0)=5 fixes the constant. C² misses negative added constants;2C or−C still cover all real constants. Thus a nonzero affine reparameterisation describes the same family. Automatic checks here cover polynomials with affine C; separately(eˣ+C)′=eˣ and(−cos x+C)′=sin x. Verify by differentiation on the stated domain.',
        ],
      ),
    ],
    pick: {
      stem: [
        '题目要求全部原函数，只写x²+5（f=2x）怎样？',
        'If all primitives of 2x are requested, is x²+5 complete?',
      ],
      correct: 0,
      options: [
        [
          '是一个正确例子，但未给完整族',
          'It is one correct example, not the full family',
        ],
        ['完整且唯一', 'It is complete and unique'],
        ['导数不是2x', 'Its derivative is not2x'],
      ],
      feedback: [
        ['还要允许任意实常数。', 'Allow every real constant.'],
        [
          '常数可变，尚无初值。',
          'No initial condition fixes a unique constant.',
        ],
        [
          '导数确为2x；问题是族不完整。',
          'Its derivative is2x; completeness is the issue.',
        ],
      ],
    },
    reason: [
      '为什么求导回查既要查导函数，也要查题目要求的是一个函数还是完整族？',
      'Why must checking include both the derivative and whether one function or a full family was requested?',
    ],
    rubric: [
      '导数正确只说明候选是原函数。x²+5对2x导数正确，却漏掉x²−1等其他原函数，不能回答完整族。写x²+C时C须任意实数；若加初值F0=5又必须解C并报告唯一x²+5。只在几处代值不证明F′恒为f，不能把常数平方等受限参数错当全体实常数。',
      'A correct derivative establishes a primitive, not completeness. x²+5 misses x²−1 and others. Full-family notation needs arbitrary real C; an initial value instead fixes it and requires the unique function. Selected substitutions do not establish derivative identity, and a restricted parameter such as C² does not cover every real constant.',
    ],
    prompts: [
      [
        '你是在给一个例子，还是所有可能？',
        'Are you giving one example or every possibility?',
      ],
      [
        '把答案求导后，任意常数去了哪里？',
        'What happens to the arbitrary constant when differentiating?',
      ],
    ],
    misconception: [
      '导数正确不等于完整族已写出；初值和任意常数不能混同。',
      'A correct derivative alone does not provide a full family; an initial value fixes rather than leaves a constant arbitrary.',
    ],
  },
  {
    title: ['定积分的几何意义', 'Geometric meaning of definite integrals'],
    objective: [
      '按零点分区，区分有向积分、正负面积总和及上下限方向。',
      'Split at zeros to distinguish signed integral, total geometric area and limit orientation.',
    ],
    hook: [
      '曲线下方和上方的两块面积，会在“定积分”和“总面积”里同样相加吗？',
      'Do regions above and below the axis combine the same way in an integral and a total area?',
    ],
    prerequisites: ['H32-L02', 'H32-L03'],
    keywords: [
      ['有向积分', 'signed integral'],
      ['几何面积', 'geometric area'],
      ['上下限方向', 'limit orientation'],
    ],
    lab: 'integral-signed',
    hints: [
      [
        '上方贡献正，下方贡献负；总几何面积则把各段绝对量相加，先在零点分段。',
        'Above-axis contributions are positive and below-axis negative. Total geometric area adds magnitudes after splitting at zeros.',
      ],
      [
        '∫bᵃf=−∫aᵇf，∫aᵃf=0；交换方向不改变两端之间的无向几何区域。',
        'Reversing limits negates the integral and equal limits give zero; the unoriented region between the endpoints is unchanged.',
      ],
    ],
    items: [
      N(
        ['f(x)=x−1在[0,3]的定积分∫₀³f(x)dx是多少？', 'Find ∫₀³(x−1)dx.'],
        '3/2',
        [
          '负三角形1/2、正三角形2，净2−1/2=3/2。',
          'Subtract negative magnitude1/2 from positive area two.',
        ],
        ['5/2', '-3/2', '2'],
      ),
      N(
        [
          '同一曲线与x轴在0至3间围出的总几何面积是多少？',
          'Find total geometric area between that curve and the axis from zero to three.',
        ],
        '5/2',
        ['两块都取正，1/2+2=5/2。', 'Add both magnitudes:1/2+2=5/2.'],
        ['3/2', '2'],
      ),
      N(
        ['求反向积分∫₃⁰(x−1)dx。', 'Find the reversed integral ∫₃⁰(x−1)dx.'],
        '-3/2',
        [
          '交换上下限使有向值变号。',
          'Reversing the limits negates the signed result.',
        ],
        ['3/2', '5/2'],
      ),
      N(
        ['求∫₂²(x−1)dx。', 'Find ∫₂²(x−1)dx.'],
        '0',
        [
          '区间长度0，有向积分0，虽然f2=1。',
          'Zero interval length gives zero integral even though f(2)=1.',
        ],
        ['1', '2'],
      ),
      N(
        [
          'f(x)=2−x，在[0,4]与轴围出总面积多少？',
          'Find total area between2−x and the axis on[0,4].',
        ],
        '4',
        [
          '零点2，两块各面积2，总4；净积分却0。',
          'Split at two: each triangle has area two, total four, while the signed integral is zero.',
        ],
        ['0', '2'],
      ),
      E(
        [
          '用x−1在[0,3]解释积分与面积，再说明反向、等端点和“积分0”不表示函数恒0。',
          'Use x−1 on[0,3] to explain signed versus total area, reversed or equal limits, and why integral zero does not force a zero function.',
        ],
        [
          '零点1把区域分成负面积量1/2和正面积2；有向积分3/2，总几何面积5/2，即∫|f|。反向积分−3/2，但同一无向区域仍面积5/2。等端点积分0与该点函数值无关。2−x在[0,4]净积分0而两块各2、总面积4，所以抵消不等于处处为0；先讲清量的意义，再决定是否取绝对值并分段。',
          'The root one splits negative magnitude1/2 and positive area two. Signed integral is3/2 and total area5/2=∫|f|. Reversal gives−3/2 while the same unoriented region still has area5/2. Equal endpoints give zero regardless of the point value. For2−x on[0,4], cancellation gives integral zero but total area four, so cancellation does not imply an identically zero function. Choose the quantity before taking absolute values and splitting.',
        ],
      ),
    ],
    pick: {
      stem: [
        '一般情况下，∫|f|与|∫f|怎样？',
        'In general, how do ∫|f| and|∫f| compare?',
      ],
      correct: 1,
      options: [
        ['总相等', 'They are always equal'],
        ['有正负抵消时可能不同', 'They can differ when signs cancel'],
        ['都可以是负数', 'Both can be negative'],
      ],
      feedback: [
        ['2−x的例子给4与0。', 'The2−x example gives four versus zero.'],
        [
          '先绝对再积，和先抵消再绝对不同。',
          'Taking magnitudes before summing differs from after cancellation.',
        ],
        ['两者都非负。', 'Both are nonnegative.'],
      ],
    },
    reason: [
      '积分值为负是面积公式错了吗？给出解释，并说明几何面积的方向约定。',
      'Does a negative integral mean an area calculation is wrong? Explain orientation and geometric area.',
    ],
    rubric: [
      '定积分为有向累积，负函数或反向上下限都可能给负值，并非错误。几何面积非负，按左右有序区间对|f|积分；若原题反向给界，先明确是在问有向积分还是两端之间区域。分段零点可核正负贡献，不能把所有负号一律删除，或把积分绝对值误当总面积。',
      'An integral is signed accumulation; negative values or reversed limits can legitimately produce a negative result. Geometric area is nonnegative and integrates|f| over ordered endpoints. State whether the question asks for orientation or the region. Split at zeros to audit contributions rather than deleting every minus sign or replacing total area with the absolute net integral.',
    ],
    prompts: [
      [
        '这一块是正贡献、负贡献，还是无向面积？',
        'Is this a positive contribution, negative contribution or geometric magnitude?',
      ],
      [
        '你交换的是积分方向，还是实际区域？',
        'Are you reversing orientation or changing the region?',
      ],
    ],
    misconception: [
      '负积分可以正确；总面积不是净积分的绝对值。',
      'A negative integral can be correct; total area is not generally the absolute net integral.',
    ],
  },
  {
    title: ['微积分基本定理的直觉', 'Intuition of the Fundamental Theorem'],
    objective: [
      '把连续率的累积函数导数还原为率，并用原函数差计算有向积分。',
      'Recover a continuous rate by differentiating accumulation and evaluate signed integrals through primitive differences.',
    ],
    hook: [
      'A(x)=∫₁ˣt²dt的值与导数相同吗？上限改成2x会怎样？',
      'Are the value and derivative of A(x)=∫₁ˣt²dt the same? What if the upper limit is2x?',
    ],
    prerequisites: ['H32-L03', 'H32-L04', 'H26-L04'],
    keywords: [
      ['连续性条件', 'continuity condition'],
      ['累积的导数', 'derivative of accumulation'],
      ['端点求值差', 'endpoint evaluation difference'],
    ],
    lab: 'integral-ftc',
    hints: [
      [
        '连续f与区间内点时，A(x)=∫aˣf(t)dt有A′(x)=f(x)。A的数值还要实际积分。',
        'For continuous f at an interior point, A(x)=∫aˣf(t)dt has derivative f(x); A’s value still requires integration.',
      ],
      [
        '上限g(x)再乘g′；定积分用F(b)−F(a)，同一个原函数常数抵消。跳点检查左右平均率。',
        'For upper limit g(x), multiply by g′. Evaluate F(b)−F(a) with the same primitive constant. At jumps inspect left/right average rates.',
      ],
    ],
    items: [
      N(
        ['A(x)=∫₁ˣt²dt，求A′(2)。', 'For A(x)=∫₁ˣt²dt, find A′(2).'],
        '4',
        [
          't²连续，累积导数为x²，在2为4。',
          'Continuity gives A′=x² and A′(2)=4.',
        ],
        ['7/3', '8/3', '2'],
      ),
      N(
        ['同一A(x)，求A(2)。', 'For the same A, find A(2).'],
        '7/3',
        [
          'F=t³/3，(8−1)/3=7/3，不是导数4。',
          'Use F=t³/3: value7/3 differs from derivative four.',
        ],
        ['4', '8/3'],
      ),
      N(
        ['B(x)=∫₁^(2x)t²dt，求B′(1)。', 'For B(x)=∫₁^(2x)t²dt, find B′(1).'],
        '8',
        [
          '导数(2x)²×2，在1得8，不能漏内导。',
          'Derivative(2x)²×2 equals eight at one.',
        ],
        ['4', '7/3'],
      ),
      I(
        [
          'q在0≤t<1为2、1≤t<3为4、3≤t≤4为1。A(x)=∫₀ˣq(t)dt在x=1的两侧导数是否相同？不相同填does-not-exist。',
          'Let q equal2 on[0,1),4 on[1,3),1 on[3,4]. For A(x)=∫₀ˣq(t)dt at x=1, enter does-not-exist if left and right derivatives differ.',
        ],
        { kind: 'calculus-code', value: 'does-not-exist' },
        [
          '左导数2，右导数4；q1定义为4不使A在跳点可导。',
          'Left derivative two differs from right four; choosing q(1)=4 does not make A differentiable.',
        ],
        ['4', '2', '0'],
      ),
      N(
        [
          '用原函数F(x)=x³/3计算∫₂¹x²dx。',
          'Use F(x)=x³/3 to evaluate ∫₂¹x²dx.',
        ],
        '-7/3',
        [
          'F1−F2=(1−8)/3，保留方向。',
          'F(1)−F(2)=(1−8)/3, retaining orientation.',
        ],
        ['7/3', '1/3'],
      ),
      E(
        [
          '解释累积导数为何由附近平均率趋近f(x)，以及原函数差、变上限内导和跳点限制。',
          'Explain accumulation derivatives through nearby average rates, primitive differences, inner factors and jump-point limits.',
        ],
        [
          '差商[A(x+h)−A(x)]/h是附近一小段的平均高度，连续时从两侧趋f(x)，故A′=f；不是A本身等于f。上限2x还需链式乘2。若F′=f，则累积函数与F相差常数，定积分为F(b)−F(a)，同一C抵消，不能给两端各选不同C。步率跳点左右平均率2与4不同，A仍连续但导数不存在；单点q1的选择不改变累积，也不能保证A′1=q1。',
          'The difference quotient[A(x+h)−A(x)]/h is a nearby average height, tending from both sides to f(x) under continuity. Thus A′=f, not A=f. Upper limit2x adds chain factor two. If F′=f, accumulation and F differ by a constant, giving F(b)−F(a); the same C cancels and cannot be chosen independently at each endpoint. At a step jump the one-sided averages two and four differ, so accumulation is continuous but not differentiable. The point value chosen for q(1) neither changes accumulation nor repairs that failure.',
        ],
      ),
    ],
    pick: {
      stem: [
        'A(x)=∫aˣf(t)dt，改变固定下限a通常怎样？',
        'For A(x)=∫aˣf(t)dt, what does changing fixed a generally do?',
      ],
      correct: 2,
      options: [
        ['使A′恒为0', 'It makes A′ identically zero'],
        ['导数必整体平移', 'It necessarily shifts the derivative'],
        [
          '改变累积值的常数项；连续点的A′仍f(x)',
          'It changes a constant in A; at continuous points A′ remains f(x)',
        ],
      ],
      feedback: [
        ['上限仍随x变化。', 'The upper limit still varies.'],
        [
          '固定下限的改变量不随x变化。',
          'The lower-limit change is constant in x.',
        ],
        [
          '这连接原函数常数与累积起点。',
          'This connects primitive constants with accumulation starting points.',
        ],
      ],
    },
    reason: [
      '知道q(1)=4，为何仍不能在步率跳点直接写A′(1)=4？',
      'Why does q(1)=4 alone not justify A′(1)=4 at a step jump?',
    ],
    rubric: [
      '基本定理的点态结论要检查连续性等适用条件，不能只查该点有定义。此步率在1左侧恒2、右侧恒4，所以累积差商左右趋2、4，导数不相同；单点改值没有宽度，不改变积分。A可以连续却不可导。需明确只在连续的区间内点使用A′=q，变上限时还要链式因子。',
      'A pointwise value does not establish continuity or the theorem’s conditions. The step has left rate two and right rate four, so accumulation quotients tend to different values. Changing one point has zero width and leaves the integral unchanged. A can be continuous without differentiability. Use A′=q at continuous interior points, with an inner factor for variable upper limits.',
    ],
    prompts: [
      [
        '你算的是累积值，还是它的导数？',
        'Are you finding accumulation or its derivative?',
      ],
      [
        '这里连续吗？上限本身是否还在变化？',
        'Is the integrand continuous here, and does the upper limit have an inner rate?',
      ],
    ],
    misconception: [
      'A′=f有适用条件；A不等于f，变上限还须乘内导。',
      'A′=f has conditions; A differs from f and composite upper limits require inner derivatives.',
    ],
  },
  {
    title: ['曲线下方面积应用', 'Areas under curves'],
    objective: [
      '按所求量选择净累积、绝对累积或曲线差，并报告初始量与单位。',
      'Choose net accumulation, accumulated magnitude or curve differences for the requested quantity, reporting initial amounts and units.',
    ],
    hook: [
      '速度图下的积分给位移还是路程？两条曲线之间又该积什么？',
      'Does a velocity integral give displacement or distance? What is integrated between two curves?',
    ],
    prerequisites: ['H32-L04', 'H32-L05', 'H31-L06'],
    keywords: [
      ['净变化', 'net change'],
      ['总量', 'total magnitude'],
      ['曲线差', 'curve difference'],
    ],
    lab: 'integral-applications',
    hints: [
      [
        '先写所求量与单位：速度积分给位移，速率积分给路程，流入率积分给增加量。',
        'Name the quantity and units first: velocity integrates to displacement, speed to distance and inflow to added volume.',
      ],
      [
        '需要总量时按零点分段取绝对；两曲线间对高度差的绝对值积分，初始状态另加。',
        'For total magnitude split at zeros; between curves integrate the absolute height difference. Add an initial state separately.',
      ],
    ],
    items: [
      N(
        [
          'v(t)=t−2米/秒，0≤t≤5秒。求总路程米数。',
          'Velocity v(t)=t−2 m/s on 0≤t≤5 seconds. Find distance in metres.',
        ],
        '13/2',
        [
          '零点2，先走负向2米，再正向9/2米，总13/2。',
          'Split at two: negative-direction distance two plus positive9/2 gives13/2.',
        ],
        ['5/2', '-5/2', '9/2'],
      ),
      N(
        [
          '同一运动0至5秒的有向位移多少米？',
          'Find signed displacement for the same motion over 0–5 seconds.',
        ],
        '5/2',
        [
          '∫(t−2)dt=[t²/2−2t]₀⁵=5/2。',
          'Evaluate the signed primitive difference to get5/2.',
        ],
        ['13/2', '9/2'],
      ),
      N(
        [
          '同一运动初始位置10米，5秒时位置多少米？',
          'With initial position ten metres, where is the object at five seconds?',
        ],
        '25/2',
        [
          '初始10加净位移5/2=25/2，不加路程13/2。',
          'Add displacement5/2 to initial ten, not total distance.',
        ],
        ['33/2', '5/2'],
      ),
      N(
        [
          '流入率q(t)=2t升/分钟，0≤t≤3分钟，初始5升，无流出。最后多少升？',
          'Inflow q(t)=2t L/min on 0≤t≤3 minutes, initial volume five litres and no outflow. Find final volume.',
        ],
        '14',
        [
          '新增∫₀³2t dt=9升，最后5+9=14。',
          'Added volume is nine litres, so final volume fourteen.',
        ],
        ['9', '6', '11'],
      ),
      N(
        [
          '横纵坐标都以米计，求y=2x与y=x²在0≤x≤2之间的面积平方米数。',
          'With both coordinates in metres, find area between y=2x and y=x² on 0≤x≤2 in m².',
        ],
        '4/3',
        [
          '该段2x≥x²，积差∫₀²(2x−x²)dx=4/3。',
          'Here2x≥x², so integrate their difference to obtain4/3.',
        ],
        ['4', '8/3', '2'],
      ),
      E(
        [
          '写一份量与单位清楚的报告，比较运动、流入与两曲线面积；曲线交叉后为何须重新分段？',
          'Write a report distinguishing motion, inflow and between-curve area with units. Explain why crossings require new pieces.',
        ],
        [
          'v=t−2在0..5秒净位移5/2米、路程13/2米，初始10时末位置25/2。q=2t在0..3分钟新增9升，初始5且无流出末14升；率单位乘时长才得体积。两曲线高度差2x−x²在0..2非负，面积4/3平方米；若扩到−1..3，差在0、2变号，分三段绝对面积各4/3，总4，不能一直假设2x在上。按问题选积分、报告区间与假设，最终量与净变化分开。',
          'For v=t−2 over 0..5 seconds, displacement is5/2 m and distance13/2 m; initial ten gives final position25/2. Inflow2t over 0..3 minutes adds nine litres; initial five and no outflow give fourteen. Rate units times duration produce volume. Height difference2x−x² is nonnegative on 0..2, giving area4/3 m². On−1..3 it changes sign at zero and two; three absolute pieces each give4/3, total four. Do not assume one curve stays above. State interval, requested quantity and assumptions, separating final state from net change.',
        ],
      ),
    ],
    pick: {
      stem: [
        '速度有正负时，求路程应怎样？',
        'With signed velocity, how should distance be found?',
      ],
      correct: 0,
      options: [
        [
          '对速率|v|积分，并在变号处分段',
          'Integrate speed|v|, splitting at sign changes',
        ],
        ['对净位移取绝对值总够了', 'Absolute net displacement always suffices'],
        ['把初始位置加到路程里', 'Add initial position to distance'],
      ],
      feedback: [
        ['保留往返各段长度。', 'This retains travel in both directions.'],
        [
          '往返会抵消位移却增加路程。',
          'Returns cancel displacement but add distance.',
        ],
        [
          '初始位置不改变走过长度。',
          'Initial position does not alter travel length.',
        ],
      ],
    },
    reason: [
      '同一图形的像素面积能否直接称升数或米数？说明单位和模型假设怎样决定积分意义。',
      'Can a plotted pixel area directly be called litres or metres? Explain how units and model assumptions determine the integral’s meaning.',
    ],
    rubric: [
      '积分意义由坐标量及单位决定，不由颜色或像素决定。升/分钟乘分钟为升，米/秒乘秒为米，几何图中米乘米才为平方米；显示缩放不改变这些量。还须核是否净率、有没有流出、初始量、积分区间和符号变化。两曲线需用实际高度差，跨交点换上/下，图用于定位结构，精确模型与分段积分核结果。',
      'Units and model variables, not pixels or colour, determine meaning: L/min times minutes gives litres, m/s times seconds metres, and geometric metres times metres m². Display scaling changes none of them. Check net versus one-way rate, outflow, initial state, interval and sign changes. Between curves use actual height differences and switch order at crossings; the picture locates structure while exact piecewise integration verifies quantities.',
    ],
    prompts: [
      [
        '题目要净变化、总路程还是最后状态？',
        'Does the question ask net change, total travel or final state?',
      ],
      [
        '两轴单位相乘后是什么？哪里需要分段？',
        'What do the axis units multiply to, and where must you split?',
      ],
    ],
    misconception: [
      '速度积分非总路程；流入量非末状态；两曲线高度顺序可改变。',
      'Velocity integrates to net displacement, inflow differs from final state, and curve order can change.',
    ],
  },
];
function question(
  id: string,
  i: number,
  item: Item,
  hints: Pair[] = specs[i]!.hints,
): Question {
  const skill = `integration-${i + 1}`;
  if (item.answer.kind === 'explain')
    return reasoning(id, T(item.stem), skill, item.answer.rubric, hints.map(T));
  const value = 'value' in item.answer ? String(item.answer.value) : '';
  const q = numeric(
    id,
    T(item.stem),
    value,
    skill,
    hints.map(T),
    [T(hints[0]!), T(item.step)],
    { accepted: [value], rejected: item.wrong },
  );
  q.answer = item.answer;
  return q;
}
function pick(id: string, i: number) {
  const s = specs[i]!,
    p = s.pick;
  return choice(
    id,
    T(p.stem),
    p.correct,
    `integration-${i + 1}`,
    p.options.map((v, j) => ({ text: T(v), feedback: T(p.feedback[j]!) })),
    s.hints.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const h32Lessons: Lesson[] = specs.map((s, i) => {
  const id = `H32-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    hook: T(s.hook),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: 20,
    lab: s.lab,
    stage: 'H12',
    unit: 'H32',
    order: i + 1,
    nzYearHints: [12, 13],
    cnGradeHints: [12],
    contentStatus: 'ready',
    skillTags: [`integration-${i + 1}`],
    guided: question(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i),
      ...s.items.slice(1, 5).map((v, j) => question(`${id}-Q${j + 2}`, i, v)),
      reasoning(
        `${id}-Q6`,
        T(s.reason),
        `integration-${i + 1}`,
        T(s.rubric),
        s.hints.map(T),
      ),
    ],
    exit: question(`${id}-X`, i, s.items[5]!),
    exitReason: T(s.objective),
    parent: {
      goal: T(s.objective),
      misconception: T(s.misconception),
      prompts: s.prompts.map(T),
      bridge: s.prerequisites[0]!,
    },
    ...(i === 5 ? { familyChallenge: T(s.items[5]!.stem) } : {}),
  };
});
export function h32ReviewQuestion(id: string, round: number): Question {
  if (
    !/^H32-L0[1-6]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid H32 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 24,
    a = 1 + (k % 6),
    b = 1 + Math.floor(k / 6);
  let item: Item;
  if (i === 0)
    item = N(
      [
        `q在0≤t<1为${a}、1≤t≤3为${b}升/分钟。求0至5/2分钟的流入升数。`,
        `q is ${a} L/min on 0≤t<1 and ${b} on 1≤t≤3. Find inflow from zero to5/2 minutes.`,
      ],
      textR(rational(BigInt(2 * a + 3 * b), 2n)),
      ['按1分钟与3/2分钟分别加权。', 'Weight by one and 3/2 minutes.'],
    );
  else if (i === 1) {
    const n = a + 1;
    item = N(
      [
        `x²在[0,${b}]等分${n}格，取中点。求黎曼和。`,
        `For x² on[0,${b}], use ${n} equal cells and midpoint tags. Find the sum.`,
      ],
      textR(rational(BigInt(b ** 3 * (4 * n * n - 1)), BigInt(12 * n * n))),
      [
        '中点为(2i−1)b/(2n)，各平方乘宽b/n后相加。',
        'Square midpoint tags(2i−1)b/(2n), multiply each by b/n and sum.',
      ],
    );
  } else if (i === 2)
    item = P(
      [
        `求∫(${a}x²+${b}x)dx的完整原函数族。`,
        `Give the full family for ∫(${a}x²+${b}x)dx.`,
      ],
      `${a}x^2+${b}x`,
      `(${a}/3)x^3+(${b}/2)x^2+C`,
      true,
      [
        '每项增幂除新幂，保留任意实C并求导回查。',
        'Raise powers, divide by new exponents, retain arbitrary real C and differentiate back.',
      ],
      ['999'],
    );
  else if (i === 3) {
    const area = k % 2 === 0;
    item = N(
      [
        `f=x−${a}，区间[0,${a + b}]。求${area ? '与轴之间总几何面积' : '有向定积分'}。`,
        `For f=x−${a} on[0,${a + b}], find ${area ? 'total geometric area with the axis' : 'the signed integral'}.`,
      ],
      textR(rational(BigInt(b * b + (area ? a * a : -a * a)), 2n)),
      [
        '根在a，左右三角形面积分别a²/2和b²/2，按所求量加或减。',
        'The root is a; triangle magnitudes are a²/2 and b²/2. Add or subtract according to the quantity.',
      ],
    );
  } else if (i === 4)
    item = N(
      [
        `A(x)=∫₀^(${b}x)t²dt，求A′(${a}/2)。`,
        `For A(x)=∫₀^(${b}x)t²dt, find A′(${a}/2).`,
      ],
      textR(rational(BigInt(b ** 3 * a * a), 4n)),
      ['先得(bx)²·b，再代入a/2。', 'Use(bx)²·b, then substitute a/2.'],
    );
  else
    item = N(
      [
        `两曲线y=${a * b}x与y=${b}x²在[0,${a}]间的面积是多少？`,
        `Find the area between y=${a * b}x and y=${b}x² on[0,${a}].`,
      ],
      textR(rational(BigInt(b * a ** 3), 6n)),
      [
        '区间内直线在上，积分b(ax−x²)，用同一原函数求端点差。',
        'The line lies above; integrate b(ax−x²) and evaluate one primitive at both endpoints.',
      ],
    );
  return question(
    `${id}-R${round}`,
    i,
    item,
    i === 0
      ? [
          [
            '把时间按1分钟分开：第一段经历1分钟，第二段只经历3/2分钟；率使用本题参数。',
            'Split at minute one: elapsed widths are one minute and3/2 minutes. Use this question’s rates.',
          ],
          specs[0]!.hints[1]!,
        ]
      : specs[i]!.hints,
  );
}
export const h32CheckQuestions: Question[] = [
  ...specs.map((s, i) => question(`H32-CHECK-Q${i + 1}`, i, s.items[0]!)),
  question('H32-CHECK-Q7', 4, specs[4]!.items[5]!),
  question('H32-CHECK-Q8', 5, specs[5]!.items[5]!),
];
