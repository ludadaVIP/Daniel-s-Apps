import { t } from '../model';
const pair = (i: number) =>
  ['H01', 'H02'].map((u) => `${u}-MAINT-ORDER-RULE-Q${i}`);
const e = (
  skill: string,
  l: string,
  i: number,
  z: string,
  en: string,
  rz: string,
  re: string,
) => ({
  skill,
  focus: t(z, en),
  sourceLesson: l,
  sourceTask: `${l}-Q6`,
  targets: pair(i),
  rationale: t(rz, re),
});
export const inequalityFunctionRecurrence = [
  e(
    'real-inequality-solution-set',
    'J84-L01',
    1,
    '实数解集的方向与端点',
    'Real solution sets: direction and endpoints',
    'H01从错图重画x≤5/2的实心向左并核9/4、边界与3；H02重画x>−7/3的空心向右并通分核−9/4、边界与−5/2。均说明有限整数列表不能代表包括非整数的完整实数集合。',
    'H01 corrects a diagram to closed left shading for x≤5/2 and checks 9/4, the boundary and three. H02 corrects x>−7/3 to open right shading and checks −9/4, the boundary and −5/2 by common denominators. Both distinguish finite integer samples from full real sets including nonintegers.',
  ),
  e(
    'one-step-inequality-equivalence',
    'J84-L02',
    2,
    '正数缩放与完整集合',
    'Positive scaling and the full solution set',
    '两组分别同乘正倒数2/5与4/3得x≥−6/5及x<−8/3，必须说明正缩放保序、原式代数核一解一非解与边界包含性，再画完整集合，不能只写边界数或看右侧负号翻转。',
    'The tasks multiply by positive reciprocals 2/5 and 4/3 for x≥−6/5 and x<−8/3. They require positive order preservation, original checks of a member/nonmember and boundary inclusion, then the full set rather than a boundary number or reversal based on a negative right side.',
  ),
  e(
    'negative-order-reversal',
    'J84-L03',
    3,
    '负数反射与未知符号分支',
    'Negative reflection and unknown-sign cases',
    'H01算(−3/2)(−4)=6与2(−4)=−8，H02算(−2)(−3)=6与(5/2)(−3)=−15/2；均从数轴反射解释反序，分类未知k正/负/零且保留≤中的等号，零缩放丢信息不能作等价逆步。',
    'H01 compares products six and negative eight; H02 compares six and −15/2. Both explain reversal by number-line reflection, classify unknown k as positive/negative/zero, retain equality inclusion and identify zero scaling as information loss rather than a reversible equivalence.',
  ),
  e(
    'linear-inequality-solving',
    'J84-L04',
    4,
    '完整分子与带符号逆操作',
    'Whole numerators and signed inverse operations',
    'H01解(x−2)/3≥(x+1)/2得x≤−7；H02解(x+3)/4>(2x−1)/3得x<13/5。均标正公分母不翻转、全括号分配、负系数除法翻转，核原式解/非解/边界并画完整实数解集。',
    'H01 solves (x−2)/3≥(x+1)/2 for x≤−7; H02 solves (x+3)/4>(2x−1)/3 for x<13/5. Both label positive denominator clearing, full-bracket distribution and negative division reversal, then check members, nonmembers and boundaries in the originals and draw full real sets.',
  ),
  e(
    'intersection-of-inequalities',
    'J84-L05',
    5,
    '交集、单点、空集与数量域',
    'Intersection, singleton, empty set and quantity domain',
    '两组在3/2或−2处比较闭闭单点与严格/闭端空集；预算2n+1≤8或3n+2≤12与非负求交，再区别可分升数上界7/2或10/3与整袋{0,1,2,3}。进4袋分别花9或14超预算，必须核全部条件而非并集或舍入边界。',
    'Both compare a closed singleton at 3/2 or −2 with an empty strict/closed intersection. Budgets 2n+1≤8 and 3n+2≤12 intersect nonnegativity, then distinguish divisible-litre maxima 7/2 or 10/3 from whole bags {0,1,2,3}. Four bags cost nine or fourteen, exceeding budget; every condition is checked rather than unioning or rounding boundaries.',
  ),
  e(
    'affine-rule-parameters',
    'J85-L01',
    6,
    '规则参数、可变输入与单次输出',
    'Rule parameters, variable input and single output',
    'H01从给定仿射水量点求m=3L/min、b=1L与x4输出13L；H02温度点求m=−3°C/h、b=11°C与x2输出5°C。均区分固定参数/改输入/改规则，解释初值不是一次输出；m0常函数不归J85严格一次，题设给仿射性不是两观察证明。',
    'H01 derives m=3 L/min,b=1 L and thirteen litres at input four; H02 derives m=−3°C/h,b=11°C and five degrees at two. Both distinguish fixed parameters, changed input and changed rules, and initial value from one output. Zero slope is constant outside J85 strict first degree; affine behaviour is given, not proved by two observations.',
  ),
  e(
    'slope-as-unit-rate',
    'J85-L02',
    6,
    '同向差商及坐标单位',
    'Consistent directed differences and coordinate units',
    '两组分别计算9/3=3L/min与−6/2=−3°C/h，反向同时变两差符号率不变，只反分母错误变号。必须写输出/输入单位并区分坐标变化率与不等轴比例的屏幕倾角，不能只背差商式。',
    'The two tasks calculate 9/3=3 L/min and −6/2=−3°C/h. Reversing both differences leaves the rate unchanged, while reversing only the denominator wrongly changes its sign. They require output/input units and distinguish coordinate rate from screen angle under unequal axis scales.',
  ),
  e(
    'y-intercept-at-zero',
    'J85-L03',
    7,
    '参数值、轴交点与受限域',
    'Parameter value, axis crossings and restricted domain',
    'H01的2x−5域[1,4]与H02的−3x+8域[1,3]要求区分b数值−5或8、域外延长点(0,−5)/(0,8)与实际x轴交点(5/2,0)/(8/3,0)，亲画闭线段。零输入不在域，不能宣称有实际y轴交点或记录过初值。',
    'H01 restricts 2x−5 to [1,4] and H02 restricts −3x+8 to [1,3]. They distinguish numerical b values −5/eight, extension points (0,−5)/(0,8) and actual x-axis crossings (5/2,0)/(8/3,0), drawing closed segments. Zero is outside the domain, so no actual y-axis crossing or observed initial value may be claimed.',
  ),
  e(
    'two-point-function-model',
    'J85-L04',
    8,
    '两点独立性与仿射模型假设',
    'Independent point conditions and the affine assumption',
    'H01不同输入给常函数4，H02给2x+4；两组另有同输入不同输出的竖直线及重复一点的无限规则。学习者须给重复点两个不同规则并核回，不把Δx0一概判无解，也不把两观测拟合证明全域直线；候选类明含零斜率。',
    'Distinct inputs give constant four in H01 and 2x+4 in H02. Each also includes a vertical pair and a repeated point allowing infinitely many rules. Learners supply and check two distinct repeated-point rules, distinguish zero-input-difference cases and avoid claiming that fitting observations proves global linearity; the candidate class explicitly permits zero slope.',
  ),
  e(
    'direct-versus-first-degree',
    'J85-L05',
    9,
    '固定率、比值与过原点的区别',
    'Constant rate, ratio and origin crossing',
    'H01分类3x、3x+2、7、x²、0，H02分类−2x、−2x+5、−4、x²、0；按k/m非零约定说明常数与零例外，正输入1和2核非恒比，0/0不定义。负k仍可正比例；过原点或固定率各自不足，完整式才支持一般分类。',
    'H01 classifies 3x,3x+2,7,x²,0; H02 uses −2x,−2x+5,−4,x²,0. Both apply nonzero k/m conventions, calculate ratios at positive inputs one/two and reject 0/0. Negative k may still be direct proportion. Origin crossing and fixed rate alone are insufficient; complete formulas support general classification.',
  ),
  e(
    'bounded-linear-context',
    'J85-L06',
    10,
    '有界连续、排空分段与整包输入',
    'Bounded continuous, stopped-water and whole-pack domains',
    '两组各比较已启动接送的率/固定费、有界排水后另停为0、整包卡片仅离散输入，核所有端点和域外输出。半包分别给3或5整数张仍输入不许，是比原半张输出更强的输入域反例；明确单位、模型题设与外推范围，不从输出整数倒推输入合法。',
    'Each group compares activated-transport rates/fixed fees, bounded draining followed by a separate zero rule and whole-pack card inputs as discrete points. They check endpoints and outside outputs. Half packs give integer three or five cards but remain inadmissible inputs, a stronger domain example than fractional output alone. Units, given assumptions and extrapolation bounds are explicit; integer outputs cannot validate inputs.',
  ),
]
  .map((entry) => {
    const cards: Record<string, number> = {
      'J84-L01': 3,
      'J84-L02': 1,
      'J84-L03': 1,
      'J84-L04': 2,
      'J84-L05': 3,
    };
    const card = cards[entry.sourceLesson];
    if (!card) return entry;
    const details: Record<number, [string, string]> = {
      1: [
        '新Q1共享同步操作/负数顺序，实际给单边变形反例与加0巧合同解、负加数平移与负除数反射、一般差证明/原相等保等号，并由负温原文字解全部范围。旧正分数与未知符号强题不改。',
        'Shared new Q1 constructs a one-sided counterexample and zero-addition coincidence, contrasts negative addition with negative division, proves reversal by differences, retains equality for equal originals and translates a negative-temperature constraint. Original positive-fraction and unknown-sign tasks remain.',
      ],
      2: [
        '新Q2补减整个括号/精确三分数与小数原式反例，以及变量消失的恒真、矛盾、0<0与0≤0全实数/空集。完整分母与正公倍数继续用旧Q4，不以方程退化题代不等式。',
        'New Q2 adds complete subtracted brackets, exact thirds versus an original-relation decimal counterexample, and cancelled-variable true/false constants including 0<0 and 0≤0. Original Q4 retains full denominator work; equation degeneracy does not substitute for inequalities.',
      ],
      3: [
        '共享新Q3从文字列条件，同一候选逐条核AND/OR、同向强界/同界严格与窗外非空；自主造数量下界和预算上界，分连续/整数并造闭闭/一开相遇。旧端点图和原预算单点强题继续保留，自创不计家庭试用。',
        'Shared new Q3 translates words, checks the same candidates under AND/OR, stronger/equal-direction bounds and off-window nonempty sets. It independently designs lower-amount/upper-budget constraints, continuous/integer domains and closed/open touches. Original graph and budget tasks remain; authored designs are not household trials.',
      ],
    };
    return {
      ...entry,
      targets: [
        ...entry.targets,
        ...['H01', 'H02'].map((u) => `${u}-MAINT-INEQUALITY-MEANING-Q${card}`),
      ],
      rationale: t(
        `${entry.rationale.zh} ${details[card]![0]}`,
        `${entry.rationale.en} ${details[card]![1]}`,
      ),
    };
  })
  .map((entry) => {
    if (!entry.sourceLesson.startsWith('J85-')) return entry;
    const cards: Record<string, number> = {
      'J85-L01': 1,
      'J85-L03': 1,
      'J85-L02': 2,
      'J85-L06': 2,
    };
    const card = cards[entry.sourceLesson];
    const reuse = ['J85-L02', 'J85-L04'].includes(entry.sourceLesson)
      ? 2
      : entry.sourceLesson === 'J85-L06'
        ? 3
        : 0;
    const negativeProportion = entry.sourceLesson === 'J85-L05';
    const extra = [
      ...(card
        ? ['H01', 'H02'].map((u) => `${u}-MAINT-FUNCTION-MEANING-Q${card}`)
        : []),
      ...(reuse
        ? ['J93', 'J94'].map((u) => `${u}-MAINT-CARTESIAN-MEANING-Q${reuse}`)
        : []),
      ...(negativeProportion ? ['J94-MAINT-CARTESIAN-MEANING-Q3'] : []),
    ];
    if (!extra.length) return entry;
    const detail =
      card === 1
        ? t(
            '共享新Q1主动改变b/m并用一般差证明平移与零输入不变，另判零斜率、原两轴交点及窗外显示。保原点对求参/受限域任务，不重复创作。',
            'Shared new Q1 changes b/m and proves translation versus a retained zero-input point through general differences, with zero slope, both original intercepts and off-window display. Original point-derived parameters and restricted-domain tasks remain.',
          )
        : card === 2
          ? t(
              '共享新Q2自创连续服务和整包总张数模型，两非零输入回求参数并核第三行，亲画实际单位变化三角形；真换小时/分币推新率和域，给错保原率的数值反例，显示缩放另分。',
              'Shared new Q2 designs continuous-service and whole-pack card-count rules, recovers parameters from nonzero inputs, checks a third row and draws a unit-aware change triangle. Hour/cents conversion derives the new rate/domain and a numerical old-rate counterexample, separate from display scaling.',
            )
          : negativeProportion
            ? t(
                'H01原Q9只在参考提负系数，未要求主动负比例分类；直接复用J94旧Q3给定P=−3x的实际分类，联合H02原Q9满足两个不同后续单元，不新增重复题。',
                'Original H01 Q9 mentions a negative coefficient only in its reference. Reuse J94 Q3, which actively classifies supplied P=−3x, with original H02 Q9 for two distinct later units, without adding a duplicate task.',
              )
            : t(
                '直接复用旧双点分数任务，按两个非零输入求精确−1/2与截距、回代两点并反点序，不另造同类题。',
                'Reuse the existing two-nonzero-input task for exact slope −1/2 and intercept, checking both points and reversed order without duplicating it.',
              );
    const reuseDetail =
      reuse === 2
        ? t(
            '另给J93/J94现有Q2精确分数点对入口；原补桥J75-L04保留。',
            'Also link existing J93/J94 Q2 exact fractional pairs; retain their original J75-L04 bridge.',
          )
        : reuse === 3
          ? t(
              '自创排空终点/连续与离散图直接复用旧J93/J94-Q3，不再机械加一套排水创作；原补桥保留。',
              'Reuse existing J93/J94 Q3 for an independently designed emptying boundary and continuous/discrete plots, retaining original bridges instead of duplicating draining design.',
            )
          : t('', '');
    return {
      ...entry,
      targets: [...entry.targets, ...extra],
      rationale: t(
        `${entry.rationale.zh} ${detail.zh} ${reuseDetail.zh}`,
        `${entry.rationale.en} ${detail.en} ${reuseDetail.en}`,
      ),
    };
  });
