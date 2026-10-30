import { t, type Question } from '../model';
import { reasoning } from './builders';

const makeSet = (unit: 'H31' | 'H35') => {
  const near = unit === 'H31',
    id = (n: number) => `${unit}-MAINT-EXPONENTIAL-MEANING-Q${n}`;
  const skills = [
    'exponent-laws-reciprocal',
    'exponent-rational-root',
    'exponential-equal-ratios',
    'log-inverse-domain',
    'log-laws-domain',
    'exponential-model-threshold',
  ];
  const card = (n: number, z: string, en: string, rz: string, re: string) =>
    reasoning(id(n), t(z, en), skills[n - 1]!, t(rz, re), [
      t(
        '先标完整底数、指数、输入域和所问对象；先写自己的表、图或式，再用逆运算或原模型核验。一个成功例不代一般证明，近似不代精确值。',
        'Identify each entire base, exponent, input domain and requested object. Generate your own table, graph or rule before auditing by an inverse or original model. One successful example is not a general proof; an approximation is not an exact value.',
      ),
      t(
        '每次一个编号或独立案例，可分次、不计时，允许纸笔、口述或熟悉语言。读题帮助与数学提示分开。自主模型接受不同合法方案，由家长读完整理由；作者数据不写入家庭便签。',
        'One numbered part or separate case per untimed sitting; paper, oral work or a familiar language is welcome. Separate reading help from maths hints. Accept different valid own models after review of the full reasoning; do not copy author data into household notes.',
      ),
    ]);
  type Row = [string, string, string, string, string];
  const table = (q: Question, rows: Row[]) => {
    q.contextTable = {
      caption: t(
        '独立纸上原条件；不是实际观测，图像由学习者自己生成',
        'Separate paper givens, not observations; generate the requested graphs yourself',
      ),
      columns: [
        t('编号', 'ID'),
        t('对象', 'Object'),
        t('原条件', 'Original conditions'),
      ],
      rows: rows.map(([k, z, en, v, ve]) => [t(k, k), t(z, en), t(v, ve)]),
    };
  };
  const b = near ? '−2/3' : '−3/4',
    c = near ? '3/2' : '4/3',
    square = near ? '9/4' : '16/9',
    sixth = near ? '729/64' : '4096/729';
  const q1 = card(
    1,
    '① Z从任意非零实底a及正整数r出发，用同数相除与指数差解释a⁰=1；指出a=0时哪一步已无定义。本课0的正整数次幂、0⁰、0负整数次幂分别怎样，不能用“都为0”替代条件。② P分别求b⁻²、−(−b)⁻²、(b⁻²)³、b^(−2+3)及(bc)⁻²。先圈底数/外负号，写精确分数并用逆运算核；哪两个结构分别乘指数、加指数，结果为何不同？③ 对整数n推(ab)ⁿ=aⁿbⁿ：先正n，再0和负n，写各步非零条件；也解释幂的乘方与同底相乘的区别。仅因某次两数相等能证明一般规则吗？原有倒数/乘除与加法反例继续用。',
    '① For Z use ANY nonzero real a and positive integer r to derive a⁰=1 from division by itself and exponent difference. Identify the already undefined step at a=0. Classify zero to positive integer, zero and negative integer powers under this course convention. ② For P evaluate b⁻², −(−b)⁻², (b⁻²)³, b^(−2+3) and (bc)⁻². Mark entire bases/external minus signs, retain exact fractions and audit inversely. Which structures multiply exponents and add them, and why do the results differ? ③ Derive (ab)ⁿ=aⁿbⁿ for integer n: positive, zero, then negative cases, retaining each nonzero premise. Distinguish a power of a power from a same-base product. Does accidental numerical agreement establish a rule? Retain existing reciprocal and addition-counterexample tasks.',
    `Z在a≠0时aʳ/aʳ=1=a^(r−r)=a⁰；a=0时原商0/0已无定义，不可用它证明0⁰。本课0正整数幂为0，0⁰不定义，负幂需除0而无定义。P依次${square}、−${square}、${sixth}、${b}、1；第三项乘指数得b⁻⁶，第四项为b¹，不是同一操作；bc=−1故负二次幂1。可将倒数乘回原非零平方/六次幂得1。正n的(ab)重复积可交换重排成aⁿbⁿ，允许某因子0；n=0要求a,b均非零，两侧都1；n=−m、m>0时两因子非零，用1/(ab)ᵐ=1/(aᵐbᵐ)。幂的乘方按重复乘法/倒数延伸使指数相乘，同底乘积才加指数。一般理由与一个算例职责不同。`,
    `For a≠0, aʳ/aʳ=1=a^(r−r)=a⁰. At zero the original quotient is 0/0, already undefined, so it proves nothing about 0⁰. This course permits zero to positive integer powers as zero, leaves 0⁰ undefined, and excludes negative powers of zero. P gives ${square}, −${square}, ${sixth}, ${b}, one respectively. The third multiplies exponents to give b⁻⁶; the fourth gives b¹, a different operation. Since bc=−1, its negative square is one. Multiply reciprocals by the corresponding nonzero square/sixth power to recover one. For positive n rearrange the repeated product (ab)ⁿ into aⁿbⁿ; zero factors are allowed. For n=0 require BOTH factors nonzero. For n=−m with m>0, require both nonzero and use 1/(ab)ᵐ=1/(aᵐbᵐ). Repeated multiplication and reciprocals justify multiplying exponents for powers of powers, versus adding for same-base products. A numerical example does not replace that general argument.`,
  );
  table(q1, [
    [
      'Z',
      '一般零指数',
      'General zero exponent',
      'a∈ℝ∖{0};r∈ℤ,r>0',
      'a∈ℝ∖{0};r∈ℤ,r>0',
    ],
    [
      'P',
      '独立精确底数',
      'Separate exact bases',
      `b=${b};c=${c}`,
      `b=${b};c=${c}`,
    ],
    [
      'N',
      '定律的范围',
      'Law scope',
      'n∈ℤ；逐步核a,b是否需非零',
      'n∈ℤ; check when a,b must be nonzero',
    ],
  ]);
  const root = near ? '9/4' : '25/9',
    reciprocal = near ? '27/8' : '125/27',
    prime = near ? 2 : 3;
  const q2 = card(
    2,
    '① A把指数先约分，写分母所定主根、分子次幂及完整精确值，并用对应整数幂回验；同一正底的2/4、1/2、0.5是否三种不同运算？② B按主根→正幂→倒数写三步并验证，不能把负指数变成负答案。③ I写确切有理指数/根式名，判它是否有实数值、是否有理及是否为0；沿用根的无理性证明解释。没有有理分数表示就能写成无定义吗？原有正负平方支复用任务继续要求√(x²)=|x|及支域筛选，原有精确几何卡继续实际核小数与根式的非零差，不重复那些任务。',
    '① Reduce A’s exponent first. Give its principal root, numerator power and complete exact result, checking with integer powers. Are exponents 2/4, 1/2 and 0.5 three different operations on the SAME positive base? ② For B show principal root → positive power → reciprocal and verify; a negative exponent does not make a negative answer. ③ Give I an EXACT rational-power/radical name. Is it real, rational or zero? Use the existing root irrationality argument. Does the absence of a rational fraction mean undefined? Retain the reused square-branch tasks requiring √(x²)=|x| with domain filtering, and existing exact-geometry tasks that actually compute nonzero decimal-versus-radical differences.',
    `A的2/4=1/2=0.5，主平方根${root}，一次幂仍${root}，平方回${near ? '81/16' : '625/81'}，正主值唯一。B四次主根${near ? '2/3' : '3/5'}，三次幂${near ? '8/27' : '27/125'}，倒数${reciprocal}；先核${near ? '(2/3)⁴=16/81' : '(3/5)⁴=81/625'}，再核${near ? '(8/27)×(27/8)=1' : '(27/125)×(125/27)=1'}。I=${prime}^(1/2)=√${prime}是正的确切无理实数，不是0或无定义；若为最简p/q，则p²=${prime}q²使该素因子指数左偶右奇，矛盾。正底的主根定义保证单值，并不保证答案有理。正负平方支题及精度题须各按题中原条件独立作答。`,
    `A has 2/4=1/2=0.5, hence principal square root ${root} and numerator power one, still ${root}; its square restores ${near ? '81/16' : '625/81'}. B has principal fourth root ${near ? '2/3' : '3/5'}, positive cube ${near ? '8/27' : '27/125'}, then reciprocal ${reciprocal}. Check the fourth root by fourth powers and that the positive cube times the final value is one. I=${prime}^(1/2)=√${prime} is an exact positive irrational REAL, neither zero nor undefined. A reduced p/q would give p²=${prime}q², impossible because that prime’s exponent is even on the left and odd on the right. Single-valued positive principal roots need not be rational. Work the square-branch and precision tasks independently under their own original premises.`,
  );
  table(q2, [
    [
      'A',
      '约分后的正有理幂',
      'Reduced positive rational power',
      `${near ? '81/16' : '625/81'}的2/4次幂`,
      `(${near ? '81/16' : '625/81'})^(2/4)`,
    ],
    [
      'B',
      '独立负有理指数',
      'Separate negative rational exponent',
      `(${near ? '16/81' : '81/625'})^(−3/4)`,
      `(${near ? '16/81' : '81/625'})^(−3/4)`,
    ],
    [
      'I',
      '独立确切正底幂',
      'Separate exact positive-base power',
      `${prime}^(1/2)`,
      `${prime}^(1/2)`,
    ],
  ]);
  const initial = near ? 4 : 9,
    rate = near ? '3/2' : '2/3';
  const q3 = card(
    3,
    '① G已完整给定，不是仅两点观测。先亲列x=−1,0,1,2的表、相邻差与比，给初量、每一步倍率和百分比变化率；两步倍率能冒充每步倍率吗？假设正值恒倍率模型，仅从G(0)和G(2)回求正a并回验中间行。② 在完整实域画图、给完整像集、两轴截点/不存在的理由、严格增减的一般理由及y=0是哪一方向的渐近线。趋近0能在某个有限输入达到吗？③ 同式另给整数域I和连续域D，分别给全部像集；求新查询x=1/2在两域的状态/确切值，画散点或曲线并解释不能悄连线。只改变图窗能改域、完整像或窗外精确输出吗？原两观测不能认定现实模型的任务继续用。',
    '① G is a COMPLETE stipulated rule, not just two observations. Generate its table at x=−1,0,1,2, successive differences/ratios, initial value, one-step multiplier and percentage change. Is a two-step multiplier a one-step multiplier? Under a POSITIVE constant-multiplier premise, recover positive a from G(0),G(2), then check the middle row. ② Sketch on ALL real inputs and give the COMPLETE image, both-axis intercepts or reasons for absence, a general strict-monotonicity argument and the direction of the y=0 asymptote. Is zero attained at a finite input? ③ With the SAME formula but separate integer domain I and continuous domain D, give EACH complete image. Classify/query x=1/2 exactly and draw unjoined points versus a curve. Does a window change alter the domain, whole image or exact off-window outputs? Retain existing non-identification tasks for two observations.',
    `G在−1,0,1,2的输出${near ? '8/3,4,6,9' : '27/2,9,6,4'}；相邻比${rate}，差${near ? '4/3,2,3' : '−9/2,−3,−2'}非恒。初量${initial}，每步${near ? '增长50%' : '减少1/3即33⅓%'}，两步倍率${near ? '9/4' : '4/9'}。G(2)/G(0)=a²，正a=${rate}，负候选不属正底模型。全域ℝ、像(0,∞)，纵截点(0,${initial})，无横截点因正底幂始终正；x₂>x₁时比=a^(x₂−x₁)${near ? '>1' : '<1'}，故严格${near ? '增' : '减'}。y=0在x→${near ? '−∞' : '+∞'}为渐近线，任意正y可由x=log_a(y/${initial})达到，没有有限零点。I像${near ? '{4,6,9,27/2,81/4}' : '{9,6,4,8/3,16/9}'}；D像${near ? '[4,81/4]' : '[16/9,9]'}。半步I域外；D给${near ? '4√(3/2)=2√6' : '9√(2/3)=3√6'}。V输出81/4，±10窗画不全也不改为10。图窗/显示不改函数，I不连线，D才完整曲线；端点须从给定域而非图窗判断。`,
    `At−1,0,1,2 the outputs are ${near ? '8/3,4,6,9' : '27/2,9,6,4'}. Ratios are ${rate}; differences ${near ? '4/3,2,3' : '−9/2,−3,−2'} are not constant. Initial value=${initial}, percentage ${near ? 'increase50%' : 'decrease1/3=33⅓%'}, two-step multiplier=${near ? '9/4' : '4/9'}. Since G(2)/G(0)=a² and a>0, a=${rate}; reject the negative algebraic candidate. On ℝ the image is(0,∞), y-intercept(0,${initial}), no x-intercept because positive-base powers stay positive. For x2>x1 the output ratio is a^(x2−x1)${near ? '>1' : '<1'}, proving strict ${near ? 'increase' : 'decrease'}. Zero is an asymptote as x→${near ? '−∞' : '+∞'}, never a finite value. Every positive y is attained at x=log_a(y/${initial}). I has image ${near ? '{4,6,9,27/2,81/4}' : '{9,6,4,8/3,16/9}'}, whereas D has image ${near ? '[4,81/4]' : '[16/9,9]'}. Half-step is outside I but gives ${near ? '4√(3/2)=2√6' : '9√(2/3)=3√6'} on D. V gives81/4,not ten even outside a ±10 window. Windows/displays do not redefine values/domains; unjoined integer points differ from the continuous curve.`,
  );
  table(q3, [
    [
      'G',
      '完整全实域函数',
      'Complete all-real function',
      `G(x)=${initial}×(${rate})^x;D_G=ℝ`,
      `G(x)=${initial}×(${rate})^x;D_G=ℝ`,
    ],
    [
      'I/D',
      '分别另定义输入域',
      'Separately stipulated domains',
      '同式，I={0,1,2,3,4}；D=[0,4]',
      'Same formula;I={0,1,2,3,4};D=[0,4]',
    ],
    [
      'V',
      '原函数的窗外查询',
      'Original off-window query',
      `精确求G(${near ? 4 : -2})；若图窗±10，其值等于图框上沿吗？`,
      `Evaluate G(${near ? 4 : -2}) exactly; does a ±10 window clamp it?`,
    ],
  ]);
  const logBase = near ? '1/4' : '1/9',
    out = near ? 2 : 3,
    irrBase = near ? 4 : 9,
    irrArg = near ? 3 : 2;
  const q4 = card(
    4,
    '① 从E在指定输入u的点P出发，亲算其完整坐标，再交换输入输出得到L的Q，画同单位两轴及y=x，指出哪个坐标是对数的输入、哪个是未知指数。L(x)=log_b(x)表示指数输出、除法、相乘还是图点编号？求L(1)、L(b)、L(1/b)，均回到原幂式核。给两函数完整域/值域和增减方向，换图窗或采样弧端会改这些结论吗？② C是另一个合法对数。先给精确名字、0与1之间的严格界，再证明它不可能是有理p/q；最后才用计算器取最近0.001并标≈。非有理是否等于无定义，显示小数是否变成精确对数？原存在/唯一及底数退化任务继续用。',
    '① Starting with E at the given input u, calculate P, then swap input/output to obtain Q on L. Draw equal axis units and y=x; identify the logarithm’s input and unknown-exponent output. Does L(x)=log_b(x) denote the exponent output, division, multiplication or graph-point numbering? Evaluate L(1),L(b),L(1/b),checking each original power statement. Give BOTH full domains/ranges and monotonic directions. Do windows or sampled arc ends change them? ② C is a SEPARATE valid logarithm. Give its exact name and strict bounds between zero and one, prove it cannot be rational p/q, then use a calculator to the nearest 0.001 with ≈. Does irrational mean undefined, or does a displayed decimal become the exact log? Retain original existence/uniqueness and degenerate-base tasks.',
    `b=${logBase}，E(−1/2)=${out}，P=(−1/2,${out})，Q=(${out},−1/2)在L；Q横坐标${out}为真数，纵坐标−1/2才是输出指数，不是把P仍叫指数图点。L(1)=0、L(b)=1、L(1/b)=−1，分别b⁰=1、b¹=b、b⁻¹=1/b。E域ℝ像(0,∞)，L域(0,∞)像ℝ，两者递减；合法性/唯一性用原任务证明，交换的是角色，图窗不改完整域。C精确log_${irrBase}(${irrArg})在(0,1)，若=p/q且p,q正整数，则${irrBase}^p=${irrArg}^q，两侧不同素因子分解不可能相等，故无理但有定义。计算器≈${near ? '0.792' : '0.315'}，不是精确等式；不把无理结果改成0或无定义。`,
    `With b=${logBase}, E(−1/2)=${out}, so P=(−1/2,${out}) and its swap Q=(${out},−1/2) lies on L. Q’s horizontal ${out} is the ARGUMENT and vertical−1/2 the exponent OUTPUT, not an unchanged point on E. L(1)=0,L(b)=1,L(1/b)=−1 because b⁰=1,b¹=b,b⁻¹=1/b. E has domainℝ,image(0,∞); L has domain(0,∞),imageℝ. Both decrease; retain existing validity/uniqueness proofs. Swapping roles or changing a window does not redefine these domains. Exact C=log_${irrBase}(${irrArg}) lies strictly between zero and one. Rational p/q with positive integers p,q would force ${irrBase}^p=${irrArg}^q,impossible by distinct prime factors. Thus it is defined and irrational. The calculator gives ≈${near ? '0.792' : '0.315'},not an exact equality, zero or undefined value.`,
  );
  table(q4, [
    [
      'E/L',
      '相互反向的完整函数',
      'Complete inverse functions',
      `b=${logBase};E(x)=b^x;L(x)=log_b(x)`,
      `b=${logBase};E(x)=b^x;L(x)=log_b(x)`,
    ],
    [
      'P',
      '给输入，待算源点',
      'Given input, source point to generate',
      'E的输入u=−1/2；P坐标待求',
      'Input u=−1/2 on E;calculate P',
    ],
    [
      'C',
      '独立合法无理对数',
      'Separate valid irrational logarithm',
      `log_${irrBase}(${irrArg})`,
      `log_${irrBase}(${irrArg})`,
    ],
  ]);
  const a = near ? 8 : 9,
    arg = near ? 4 : 27,
    cb = near ? '1/2' : '1/3',
    answer = near ? '2/3' : '3/2';
  const q5 = card(
    5,
    '① 在合法底a与u>0、实数r下，从u=aᵖ推logₐ(uʳ)=r logₐu，并写原条件。若u<0且r=2只使左式有意义，就能认定右式也有意义吗？给X的logₐ(x²)在整个非零实域的等价式，说明绝对值、负输入和x=0；不能借平方悄改成仅x>0的式子。② 从b=aʸ推换底一般式及全部底/真数条件，解释分母为何非0；按C给的小于1的合法底计算，负分母就是非法吗？③ 将分子用ln、分母用常用log会怎样？用同一A/B精确目标给实际不同值的理由，最后说明计算器上log/ln各指什么、正确换底为何同底。原乘积/商推导和原真数筛选继续用。',
    '① For valid base a,u>0 and real r, derive logₐ(uʳ)=r logₐu from u=aᵖ, retaining premises. If u<0,r=2 makes only the LEFT meaningful, does the right become defined? Give an equivalent expression for X’s logₐ(x²) on ALL nonzero real x; explain absolute value, negative inputs and zero. ② Derive change of base from b=aʸ with ALL base/argument conditions and a nonzero denominator. Compute A/B using the supplied valid base C below one: is a negative denominator illegal? ③ What if the numerator uses ln and denominator common log? For the SAME target show an actually different result. Explain calculator log versus ln and why correct change of base uses one common base. Retain existing product/quotient derivations and original-argument filtering.',
    `u=aᵖ得uʳ=a^(pr)，唯一逆给logₐ(uʳ)=pr；需a>0,a≠1,u>0，不能用负u平方后合法替代右式logₐu的域。X一般logₐ(x²)=2logₐ|x|，x≠0；本例x=${near ? '−3/2' : '−5/3'}时|x|=${near ? '3/2' : '5/3'}，两式均有意义，2logₐx无实数意义；x=0时原真数0仍无定义。换底由log_c b=y log_c a，得y=log_c b/log_c a，要求a,c>0且均非1、b>0；log_c a=0当且仅当a=1，故排1才可除。C底${cb}给分子${near ? '−2' : '−3'}、分母${near ? '−3' : '−2'}，比${answer}，负分母不是0。错误ln(${arg})/log10(${a})=${answer}×ln10，不等于${answer}；ln以e、常用log以10，须两边同底。`,
    `Writing u=aᵖ gives uʳ=a^(pr),then unique inversion gives pr. Require a>0,a≠1,u>0; a valid square of a negative u does not define logₐu on the right. Generally logₐ(x²)=2logₐ|x| on x≠0. At supplied x=${near ? '−3/2' : '−5/3'}, |x|=${near ? '3/2' : '5/3'} makes both defined,whereas 2logₐx is not real. At zero the original argument is zero and remains undefined. From log_c b=y log_c a obtain y=log_c b/log_c a with a,c>0,both≠1,b>0. Since log_c a=0 iff a=1,the denominator is nonzero. At c=${cb},numerator=${near ? '−2' : '−3'},denominator=${near ? '−3' : '−2'},ratio=${answer}; negative is not zero. Mixing ln(${arg})/log10(${a}) instead gives ${answer}×ln10,not ${answer}. Calculator ln uses e,common log ten; correct change of base uses the SAME valid base in numerator and denominator.`,
  );
  table(q5, [
    [
      'A/B/C',
      '独立换底查询',
      'Separate change-of-base query',
      `a=${a};b=${arg};c=${cb};求log_a b`,
      `a=${a};b=${arg};c=${cb};find log_a b`,
    ],
    [
      'X',
      '独立保留负输入',
      'Separate retained negative input',
      `a=${irrBase};x=${near ? '−3/2' : '−5/3'};log_a(x²)`,
      `a=${irrBase};x=${near ? '−3/2' : '−5/3'};log_a(x²)`,
    ],
    [
      'R',
      '幂法则一般范围',
      'General power-law scope',
      'a>0,a≠1,u>0,r∈ℝ',
      'a>0,a≠1,u>0,r∈ℝ',
    ],
  ]);
  const C = near ? 6 : 18,
    target = near ? 12 : 9,
    exactTarget = near ? '27/2' : '8',
    satisfied = near ? 5 : 20,
    timeUnit = near ? '天' : '小时';
  const q6 = card(
    6,
    '① 对M分别问“首次满足阈值不等式”和“恰好等于目标的连续时间”：B0初量、B1恰达、B2介于两整步、B3初始已满足，逐个给完整t≥0实数可行集、首次整步和等式解/不存在。B2先给确切对数，最近0.1时间单位最后才舍入；用前一步与本步原值及单调性证首次。B3可把负的等式交点直接改成0再声称“0时恰好等于”吗？② 若B2只允许I0或I1，全部可行整步各是什么？超过一个有限表的搜索范围就能断言全域无解吗？③ 在纸上自主设计另一个增长和另一个衰减模型，给正初量、正非1倍率、具体单位、连续/整数域及有限观察范围、正目标和方向。每个亲列至少五行、画自己图、给完整域内阈值集/首次或诚实未达到、相邻原式核验和假设局限。另将自己一个模型换时间单位并推新倍率。接受不同合法参数，不抄作者值作为家庭实测。原一般阈值/单位任务继续用。',
    '① For EACH M target B0(initial),B1(exact hit),B2(between steps),B3(initially satisfies), distinguish FIRST satisfying the inequality from continuous EQUALITY to the target. Give the COMPLETE feasible real set on t≥0,first whole step,and equality time or absence. For B2 give an exact log before rounding to the nearest 0.1 time unit; prove firstness with adjacent original values and monotonicity. May B3’s negative equality time be clamped to zero and called equality? ② For B2 what are ALL feasible whole steps in I0 versus I1? Does exceeding a finite table/search imply no solution on the whole domain? ③ DESIGN a DIFFERENT growth model AND decay model with positive initial quantities,positive nonunit multipliers,units,continuous/integer domains,finite observation scopes,positive targets and directions. Generate at least FIVE rows each,own graphs,complete within-domain threshold sets/first steps or honest non-attainment,adjacent checks and limits. Convert ONE own time unit,deriving its new multiplier. Accept different valid choices; author values are not household measurements. Retain existing general threshold/unit tasks.',
    `M${near ? '递增，求≥B' : '递减，求≤B'}。B0=${C}时可行[0,∞)、首次0且等式t=0；B1=${exactTarget}时可行[2,∞)、首次2且等式解t=2。B2=${target}时阈值τ=${near ? 'log_(3/2)2' : 'log_(2/3)(1/2)'}≈1.709511${timeUnit}，最后取1.7${timeUnit}，完整[τ,∞)、首次整数2；原t=1时${near ? '9<12' : '12>9'}、t=2时${near ? '27/2≥12' : '8≤9'}，单调性排更早。B3=${satisfied}时原t=0已严格满足，可行[0,∞)、首次0，但M(0)=${C}≠${satisfied}；等式解为负且不在域，故t≥0无等式解，不可把负交点当0的相等。I0={0,1}可行空，I1={0,1,2}可行{2}，有限未找到不证明全域无解。自主例${near ? '增长2(3/2)^n到≥5：0–4行2,3,9/2,27/4,81/8，首次3；衰减16(3/4)^n到≤7：16,12,9,27/4,81/16，首次3' : '增长3(4/3)^n到≥6：3,4,16/3,64/9,256/27，首次3；衰减27(2/3)^n到≤9：27,18,12,8,16/3，首次3'}。若自定整步范围0–4，集合均{3,4}；各用n=2失败/n=3满足及单调性证。可另定连续范围并给对数阈值取交。若每一天倍率a，改每小时为a^(1/24)，反向24次回a，初量不改。允许其他单位/参数/有限未达到方案，需完整原式/图表/域；恒倍率与可连续延伸是模型假设，不是现实保证。`,
    `M ${near ? 'increases and asks ≥B' : 'decreases and asks ≤B'}. B0=${C}: feasible[0,∞),first=0,equality0. B1=${exactTarget}: feasible[2,∞),first2,equality2. B2=${target}: τ=${near ? 'log_(3/2)2' : 'log_(2/3)(1/2)'}≈1.709511 ${near ? 'days' : 'hours'},finally rounded to1.7; feasible[τ,∞),first integer2. Original values at1 give ${near ? '9<12' : '12>9'},at2 give ${near ? '27/2≥12' : '8≤9'}; monotonicity excludes earlier times. B3=${satisfied}: t=0 already STRICTLY satisfies the inequality,so feasible[0,∞),first=0,but M(0)=${C}≠${satisfied}. The equality crossing is negative and excluded; no equality solution on t≥0. Clamping does not create equality. For B2,I0={0,1} has no feasible step;I1={0,1,2} has{2}. Finite non-discovery is not global nonexistence. Own examples: ${near ? 'growth2(3/2)^n to≥5 has rows2,3,9/2,27/4,81/8;decay16(3/4)^n to≤7 has16,12,9,27/4,81/16' : 'growth3(4/3)^n to≥6 has3,4,16/3,64/9,256/27;decay27(2/3)^n to≤9 has27,18,12,8,16/3'}. Both first reach at3;on whole-step domain0–4,the complete set is{3,4},using failure at2,success at3,and monotonicity. A separately chosen continuous domain needs its log threshold intersected with that domain. A daily multiplier a becomes a^(1/24) hourly;raising it to24 recovers a and preserves the initial quantity. Accept other units,parameters or honest finite non-attainment,with full rules,own graphs/tables and domains. Constant ratios and continuous extension are assumptions,not real guarantees.`,
  );
  table(q6, [
    [
      'M',
      '完整虚构阈值模型',
      'Complete fictional threshold model',
      `M(t)=${C}×(${rate})^t;t≥0,单位${timeUnit}；${near ? '至少' : '至多'}B`,
      `M(t)=${C}×(${rate})^t;t≥0 in ${near ? 'days' : 'hours'};${near ? 'at least' : 'at most'}B`,
    ],
    [
      'B0/B1/B2/B3',
      '四个独立目标',
      'Four separate targets',
      `B0=${C};B1=${exactTarget};B2=${target};B3=${satisfied}`,
      `B0=${C};B1=${exactTarget};B2=${target};B3=${satisfied}`,
    ],
    [
      'I0/I1',
      'B2的另给有限整数域',
      'Separate finite integer domains for B2',
      'I0={0,1}；I1={0,1,2}',
      'I0={0,1};I1={0,1,2}',
    ],
  ]);
  return {
    id: `${unit}-MAINT-EXPONENTIAL-MEANING`,
    unit,
    title: t(
      '求导与方程之后，再核幂、图像与目标含义',
      'After derivatives and equations, recheck powers, graphs and target meaning',
    ),
    intro: t(
      '六张独立纸笔卡，一次一个编号/案例，可分次、不计时；先生成自己的精确式、图表或模型，再逐项人工审核。',
      'Six independent paper cards,one numbered part/case per untimed sitting. Generate exact expressions,graphs,tables or models before human review of each part.',
    ),
    bridge: 'H03-L01',
    bridgeByQuestion: Object.fromEntries(
      skills.map((_, i) => [id(i + 1), `H03-L0${i + 1}`]),
    ),
    questions: [q1, q2, q3, q4, q5, q6],
  };
};
export const exponentialMeaningRetrieval = {
  H31_EXPONENTIAL_MEANING: makeSet('H31'),
  H35_EXPONENTIAL_MEANING: makeSet('H35'),
};
