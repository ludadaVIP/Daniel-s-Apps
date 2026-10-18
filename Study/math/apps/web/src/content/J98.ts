import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import {
  rectangleLink,
  integrationGraph,
  auditCases,
  rampModel,
  type RampParams,
} from '../integrationModels';
import { rational, textR } from '../algebraModels';
type Pair = [string, string];
const T = (v: Pair) => t(...v);
type Item = {
  stem: Pair;
  answer: AnswerSpec;
  step: Pair;
  wrong: string[];
  diagram?: Question['diagram'];
};
const N = (
  stem: Pair,
  value: string,
  step: Pair,
  wrong: string[],
  unit?: Extract<AnswerSpec, { kind: 'number' }>['unit'],
  diagram?: Question['diagram'],
): Item => ({
  stem,
  answer: { kind: 'number', value, unit },
  step,
  wrong,
  diagram,
});
const P = (
  stem: Pair,
  value: string,
  step: Pair,
  wrong: string[],
  diagram?: Question['diagram'],
): Item => ({
  stem,
  answer: { kind: 'polynomial', value, variables: ['x'], collected: true },
  step,
  wrong,
  diagram,
});
const V = (
  stem: Pair,
  value: 'valid' | 'invalid' | 'insufficient' | 'outside-domain',
  step: Pair,
  wrong: string[],
  diagram?: Question['diagram'],
): Item => ({
  stem,
  answer: { kind: 'integration-verdict', value },
  step,
  wrong,
  diagram,
});
const E = (stem: Pair, rubric: Pair): Item => ({
  stem,
  answer: { kind: 'explain', rubric: T(rubric) },
  step: rubric,
  wrong: [],
});
type Pick = { stem: Pair; options: Pair[]; feedback: Pair[]; correct: number };
type Spec = {
  title: Pair;
  objective: Pair;
  lab: Lesson['lab'];
  prerequisites: string[];
  keywords: Pair[];
  hook: Pair;
  items: Item[];
  pick: Pick;
  reason: Pair;
  rubric: Pair;
  misconception: Pair;
};
const skills = [
  'integration-geometry-algebra',
  'integration-graph-assumptions',
  'integration-dependent-strategy',
  'integration-reasonableness-audit',
  'integration-ramp-constraints',
];
const hints: Pair[][] = [
  [
    [
      '先给每条边的含义、正值范围和单位，再分块或数边。',
      'Name each side, its positive domain and unit before splitting area or counting edges.',
    ],
    [
      '面积x(x+d)，周长2(x+x+d)。一般式与某次代入值不同，统一放大时面积按倍率平方。',
      'Area=x(x+d), perimeter=2(x+x+d). A general expression differs from one substitution; uniform scale squares the area factor.',
    ],
  ],
  [
    [
      '先读坐标轴、单位、刻度、定义域和题目是否给了完整规则。',
      'Read axes, units, scales, domain and whether a full rule is supplied.',
    ],
    [
      '给一次规则才由两点求斜率截距。分段按有效段，整数计数不连线；仅两点不能确定任意函数。',
      'Use two points for slope/intercept only with an affine premise. Follow valid segments, leave count points unjoined, and do not infer an arbitrary function from two samples.',
    ],
  ],
  [
    [
      '先写所求量，再找中间需要的量与依赖关系。',
      'State the target and required intermediate quantities and dependencies.',
    ],
    [
      '从原数量关系选方法，保留数学解再按情境筛；最后回到原题目标，不能只交中间根。',
      'Choose a method from original relationships, retain mathematical solutions then filter by context, and return to the original target rather than an intermediate root.',
    ],
  ],
  [
    [
      '先核对象、单位、符号和范围，再代回原式并检查完整性。',
      'Check target, units, signs and range, then substitute and inspect completeness.',
    ],
    [
      '一个反例可推翻全称结论；缺证据不等于必错；近似合理也不证明精确相等。',
      'One counterexample refutes a universal claim; missing evidence is not falsity, and a plausible approximation does not prove exact equality.',
    ],
  ],
  [
    [
      'cm先换m，分清竖升h、水平r、斜长s与宽w。',
      'Convert cm to m and separate rise h, run r, incline s and width w.',
    ],
    [
      's²=h²+r²，坡面A=sw而不是rw，费用60A；逐项核全部纸上约束，最后才舍入。',
      's²=h²+r², inclined area A=sw rather than rw, cost=60A. Check every worksheet constraint and round only at the end.',
    ],
  ],
];
const specs: Spec[] = [
  {
    title: ['代数与几何互相表达', 'Linking algebra and geometry'],
    objective: [
      '由几何结构建立一般代数关系，并分清一般式、实例数值与长度/面积变化。',
      'Build general algebraic relationships from geometric structure, separating expressions, instance values and length/area changes.',
    ],
    lab: 'integration-geometry',
    prerequisites: ['J81-L01', 'J92-L02', 'J94-L04'],
    keywords: [
      ['结构分块', 'structural partition'],
      ['一般关系', 'general relation'],
      ['量纲', 'dimensions'],
    ],
    hook: [
      '边长x与x+2的长方形，能同时用图、乘积和展开式表示面积吗？',
      'Can a rectangle with sides x and x+2 express the same area as a picture, product and expanded form?',
    ],
    items: [
      P(
        [
          '长方形相邻边x、x+2，同一长度单位且x>0。写展开合并后的面积一般式，用x。',
          'A rectangle has adjacent sides x and x+2 in one unit, x>0. Enter the expanded collected general area expression in x.',
        ],
        'x^2+2x',
        [
          '正方形x²加长条2x，共x²+2x；不是只代当前例图的x。',
          'A square x² plus strip 2x gives x²+2x, not just the current instance value.',
        ],
        ['x(x+2)', 'x^2+2', '15'],
        { kind: 'integration-rectangle', x: '3', offset: 2 },
      ),
      P(
        [
          '同一长方形写展开合并后的周长一般式，用x。',
          'For the same rectangle enter the collected general perimeter expression in x.',
        ],
        '4x+4',
        [
          '两条x和两条x+2相加，4x+4。',
          'Add two x sides and two x+2 sides to obtain 4x+4.',
        ],
        ['x^2+2x', '2x+2'],
      ),
      N(
        [
          '令x=3 m，边为3与5 m，求面积。',
          'Set x=3 m, so sides are three and five metres. Find area.',
        ],
        '15',
        [
          '面积3×5=15 m²，几何分块9+6也为15。',
          'Area 3×5=15 m², matching the partition 9+6.',
        ],
        ['16', '15 m'],
        'm²',
      ),
      N(
        [
          '若x(x+2)=48且x为正长度，求x。',
          'If x(x+2)=48 and x is a positive length, find x.',
        ],
        '6',
        [
          'x²+2x−48=(x−6)(x+8)=0，数学根6、−8；长度取6。',
          'Factor (x−6)(x+8)=0, giving six and minus eight; positive length retains six.',
        ],
        ['-8', '48'],
      ),
      N(
        [
          '同一形状的所有长度统一乘2，面积是原来的几倍？',
          'Uniformly multiply every length of the same shape by two. What is the area multiplier?',
        ],
        '4',
        [
          '面积的两个长度因素各乘2，故乘4，周长才乘2。',
          'Both length factors double, so area quadruples; perimeter doubles.',
        ],
        ['2', '8'],
      ),
      E(
        [
          '解释x(x+2)、x²+2x与x=3时的15怎样描述同一图形，又为何不能互相替代所有问题。',
          'Explain how x(x+2), x²+2x and fifteen at x=3 describe the same picture but cannot replace each other for every question.',
        ],
        [
          '乘积用整长方形长×宽；展开式用x²正方形与2x长条，恒等对所有正x成立。15只是x=3时的面积数值，单位m²，不能回答一般关系。周长另数外边得4x+4 m；统一倍率k时长度/周长乘k、面积乘k²。几何正长度限制与代数恒等的更广范围需分别说清。',
          'The product uses full length times width; the expansion uses square x² plus strip 2x, identical for every positive x. Fifteen is only the area at x=3, in m², and does not answer a general-expression question. Perimeter counts outer edges, giving 4x+4 in metres. Uniform scale k changes lengths/perimeter by k and area by k². Separate the geometric positive-length domain from the wider algebraic identity.',
        ],
      ),
    ],
    pick: {
      stem: [
        '哪项直接由这幅分块图说明面积？',
        'Which expression directly describes the partitioned area?',
      ],
      options: [
        ['把边相加x+x+2', 'Add sides x+x+2'],
        ['只取长条2x', 'Use only strip 2x'],
        ['正方形x²与长条2x相加', 'Add square x² and strip 2x'],
      ],
      feedback: [
        ['两边之和不是面积。', 'A side sum is not area.'],
        ['遗漏正方形。', 'The square is missing.'],
        [
          '两块不重叠且覆盖整长方形。',
          'The disjoint parts exhaust the rectangle.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '为什么在x=3时算对15，仍不足以证明猜测的面积一般式恒等正确？',
      'Why does getting fifteen at x=3 not prove a proposed general area identity?',
    ],
    rubric: [
      '一次代入相同只说明该实例。例如正确x²+2x与猜式5x在3处同为15，在1处为3与5，反例推翻一般恒等。分块或完整代数展开给所有允许x的依据。两式数值偶合不等于一般关系相同。',
      'Agreement at one input proves only that instance. Correct x²+2x and guessed 5x both give fifteen at three, but at one give three and five. A structural partition or full expansion supports every permitted x. One numerical match does not establish identity.',
    ],
    misconception: [
      '面积、周长、一般式和一次代入值不能混为同一量。',
      'Area, perimeter, a general expression and one substituted value are distinct.',
    ],
  },
  {
    title: ['根据图像建立模型', 'Building models from graphs'],
    objective: [
      '根据轴、定义域和给定规则建立模型，区分合法推断、规则不足与域外输入。',
      'Build models from axes, domain and supplied rules, distinguishing justified inference, insufficient rules and out-of-domain inputs.',
    ],
    lab: 'integration-graph',
    prerequisites: ['J85-L03', 'J93-L01'],
    keywords: [
      ['坐标证据', 'coordinate evidence'],
      ['分段规则', 'piecewise rule'],
      ['定义域', 'domain'],
    ],
    hook: [
      '两个点就一定能确定整条函数吗？给定一次函数和只看两次观测，有什么不同？',
      'Do two points always determine an entire function? How does an explicit affine premise differ from two observations?',
    ],
    items: [
      P(
        [
          '题目明确y是0≤x≤4上的一次函数，经过(0,3)、(4,11)。写y右侧一般式。',
          'An affine y function on 0≤x≤4 passes through (0,3),(4,11). Enter its general right side.',
        ],
        '2x+3',
        [
          '变化率(11−3)/(4−0)=2，截距3，得2x+3。',
          'Rate (11−3)/(4−0)=2 and intercept three give 2x+3.',
        ],
        ['2x', '3x+2', '11'],
        { kind: 'integration-graph', source: 'affine', query: '2' },
      ),
      N(
        [
          '同一明确一次函数，求y随x的变化率。',
          'For the same explicit affine function, find change in y per unit x.',
        ],
        '2',
        [
          '纵差8除横差4，斜率2；不以屏幕角度作答。',
          'Vertical change eight divided by horizontal four gives two, independent of screen inclination.',
        ],
        ['1/2', '8'],
      ),
      N(
        [
          '完整水量图给直线段(0,12)→(3,6)→(6,6)→(9,0)，横轴分钟、纵轴L。求t=4时水量。',
          'The complete piecewise-linear water trace is (0,12)→(3,6)→(6,6)→(9,0), time in min and volume L. Find volume at t=4.',
        ],
        '6',
        [
          '4在3–6分钟的水平段，水量6 L，并非全程按初始速度继续降。',
          'Four lies on the horizontal segment from three to six minutes, so volume is six litres.',
        ],
        ['4', '0'],
        'L',
        { kind: 'integration-graph', source: 'drain', query: '4' },
      ),
      V(
        [
          '只观测f(0)=0、f(1)=1，未给函数类型。足以确定f(2)唯一等于2吗？',
          'Only f(0)=0 and f(1)=1 are observed; no function family is supplied. Is f(2)=2 uniquely established?',
        ],
        'insufficient',
        [
          'f=x与f=x²均吻合已知点，在2处却给2与4；证据不足，不是说2必错。',
          'Both f=x and f=x² fit the known points but give two and four at two. Evidence is insufficient, not proof that two is false.',
        ],
        ['valid', 'invalid'],
        { kind: 'integration-graph', source: 'observations', query: '2' },
      ),
      V(
        [
          '卡片只卖整数0–5张，费用规则C=2n+3。n=1.5属于允许输入吗？写outside-domain或不在定义域。',
          'Cards are sold only in integer counts zero through five, with C=2n+3. Is n=1.5 permitted? Enter outside-domain.',
        ],
        'outside-domain',
        [
          '代数能代1.5，不代表可买半张卡；这是已知域外，不是规则不足。',
          'Algebraic substitution at 1.5 does not authorise half a card. This is known domain exclusion, not a missing rule.',
        ],
        ['insufficient', 'valid'],
      ),
      N(
        [
          '同一完整分段水量图，t=7时水量多少L？',
          'For the same complete piecewise-linear water trace, find volume at t=7 in litres.',
        ],
        '4',
        [
          '6–9分钟从6降0，每分钟减2；t7得6−2=4 L。',
          'From six to nine minutes volume decreases by two litres per minute; at seven it is four.',
        ],
        ['2', '6'],
        'L',
      ),
    ],
    pick: {
      stem: [
        '由两个点恢复唯一一次函数，需要哪个前提？',
        'What premise supports recovering a unique affine function from two points?',
      ],
      options: [
        [
          '题目给定一次函数且两点横坐标不同',
          'An affine function is stipulated and the x coordinates differ',
        ],
        ['图上看起来差不多直', 'The display looks nearly straight'],
        ['任意两次观测都足够', 'Any two observations suffice'],
      ],
      feedback: [
        [
          '函数族与非零横差共同确定斜率和截距。',
          'The family and nonzero horizontal change determine slope and intercept.',
        ],
        [
          '外观和轴缩放不能替代规则。',
          'Appearance and axis scaling do not supply a rule.',
        ],
        [
          '许多非一次函数也可经过两点。',
          'Many non-affine functions can pass through two points.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '解释完整分段直线图、整数散点规则与两个观测点为何有不同的合法延伸。',
      'Explain why a full piecewise-linear trace, integer-count rule and two observed points allow different inferences.',
    ],
    rubric: [
      '完整图连线是题目给定规则，可在有效段插值；暂停段变化率零，空后范围不自动延伸。整数计数只允许0–5，不连接成半张可买。两个观测点未给函数族，f=x与x²等可同时满足，不能唯一预测。视窗缩放不改变坐标率；需读轴名、单位与实际定义域。',
      'The full trace supplies segment interpolation, with zero rate during the pause and no automatic extension beyond its domain. Integer counts allow only zero through five, not purchasable half cards. Two observations without a family permit different fitting functions, so prediction is not unique. Display scaling preserves numerical coordinates and rates; read axes, units and actual domains.',
    ],
    misconception: [
      '能写表达式不等于输入合法；连线和线性都须有规则依据。',
      'An evaluable expression does not authorise every input; lines and linearity need a supplied rule.',
    ],
  },
  {
    title: ['混合题的策略选择', 'Choosing strategies for mixed problems'],
    objective: [
      '从所求量反查中间关系，用有依赖的步骤连接方法、情境筛选与最终目标。',
      'Work backward from the target and connect methods, context filters and final quantities through justified dependencies.',
    ],
    lab: 'integration-strategy',
    prerequisites: ['J98-L01', 'J98-L02', 'J92-L06', 'P68-L01'],
    keywords: [
      ['中间量', 'intermediate quantity'],
      ['依赖顺序', 'dependencies'],
      ['回到目标', 'return to target'],
    ],
    hook: [
      '解出x=6就完成了面积48的围栏题吗？平均速度能直接平均两个速度吗？',
      'Does finding x=6 finish a fencing problem? Can two speeds always be averaged directly?',
    ],
    items: [
      N(
        [
          '长方形边为x与x+2 m，面积48 m²。求周长。',
          'A rectangle has sides x and x+2 m and area 48 m². Find perimeter.',
        ],
        '28',
        [
          '由x(x+2)=48得6、−8，正长度取6，另一边8，周长28 m；不能只交6。',
          'Solve x(x+2)=48 for six and minus eight, retain positive six, then perimeter 2(6+8)=28 m.',
        ],
        ['6', '48', '-4'],
        'm',
      ),
      N(
        [
          '同一面积48模型，作为中间量的正x是多少？',
          'For the same area-48 model, what is the positive intermediate x?',
        ],
        '6',
        [
          '先保留二次方程全部数学根，再按长度正值筛选。',
          'Keep all mathematical roots first, then apply positive-length context.',
        ],
        ['-8', '28'],
      ),
      {
        stem: [
          '给定直角，两直角边3 m与4 m，求斜边精确米数，不附单位。',
          'Given a right angle and legs three and four metres, find the exact hypotenuse in metres without units.',
        ],
        answer: { kind: 'root-length', value: '5', square: '25' },
        step: [
          '先核直角，c²=9+16=25，长度取正根5。',
          'Check the right angle, then c²=25 and take positive length five.',
        ],
        wrong: ['7', '-5', '25'],
      },
      N(
        [
          '去返各3 km，速度4和6 km/h，无停留。求全程平均速度。',
          'Out and back are each three kilometres, at four and six km/h with no stops. Find overall average speed.',
        ],
        '24/5',
        [
          '时间3/4+1/2=5/4 h，总路程6 km，平均6÷(5/4)=24/5 km/h。',
          'Time is 3/4+1/2=5/4 h; total distance six gives 6÷(5/4)=24/5 km/h.',
        ],
        ['5', '10'],
        'km/h',
      ),
      N(
        [
          '同一去返行程的总时间是多少小时？',
          'What is total time in hours for the same journey?',
        ],
        '5/4',
        [
          '时间按各段路程/速度相加，不平均速度后倒推。',
          'Add segment distance/speed times rather than averaging speeds.',
        ],
        ['6/5', '1'],
        'h',
      ),
      N(
        [
          '另一长方形边x与x+2 m、面积80 m²。求周长。',
          'Another rectangle has sides x and x+2 m and area 80 m². Find perimeter.',
        ],
        '36',
        [
          '(x−8)(x+10)=0，正长度8，另一边10，周长36 m。',
          '(x−8)(x+10)=0 gives positive length eight and other side ten; perimeter 36 m.',
        ],
        ['8', '80'],
        'm',
      ),
    ],
    pick: {
      stem: [
        '面积条件给出x后，题目问周长，下一步应是什么？',
        'After an area relation gives x, what comes next if perimeter is asked?',
      ],
      options: [
        ['把x当最终答案', 'Submit x as the final answer'],
        [
          '核长度域、求另一边，再算周长',
          'Check length domain, find the other side, then perimeter',
        ],
        ['把面积数附长度单位', 'Attach a length unit to the area value'],
      ],
      feedback: [
        ['x是中间量。', 'x is intermediate.'],
        [
          '方法必须回到原题目标并保单位。',
          'Return to the original target with the correct units.',
        ],
        [
          '改变单位字样不改变所算的量。',
          'Changing a unit label does not change the calculated quantity.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '给长方形题和去返题各写一条策略链，指出能换序的准备步骤和不能提前用的结论。',
      'Write strategy chains for the rectangle and return journey, identifying preparatory steps that may exchange order and conclusions that cannot be used early.',
    ],
    rubric: [
      '长方形：面积关系→解二次→正长度筛选→另一边→周长。去返：分段时间→总时间，同时可独立求总路程，二者齐后才平均速度。合法依赖不是强制唯一算法，也不把卡片点击顺序当完整证明；说明每一步依据、原式代回、单位与所求对象。',
      'Rectangle: area relationship → quadratic solutions → positive-length filter → other side → perimeter. Journey: segment times → total time, while total distance can be obtained independently; both are needed before average speed. Dependencies do not impose one universal algorithm or make card clicks a full proof. Explain premises, original checks, units and the target.',
    ],
    misconception: [
      '中间根不是最终目标；方法由关系决定而不是题目里出现的数字。',
      'An intermediate root is not the target; choose methods from relationships rather than familiar numbers.',
    ],
  },
  {
    title: ['错误答案的合理性判断', 'Judging whether answers make sense'],
    objective: [
      '用单位、范围、完整性和原式核验区分错误、证据不足与已经成立的结论。',
      'Audit units, ranges, completeness and original relationships to distinguish refuted, insufficient and verified conclusions.',
    ],
    lab: 'integration-audit',
    prerequisites: ['J98-L03', 'J91-L05', 'J96-L05'],
    keywords: [
      ['反例', 'counterexample'],
      ['完整核验', 'complete check'],
      ['证据范围', 'scope of evidence'],
    ],
    hook: [
      'x²=9只交3能代回，为什么仍没完成？两个点预测出的2又一定错吗？',
      'Three satisfies x²=9, so why is it incomplete? Is a prediction of two from two points necessarily false?',
    ],
    items: [
      V(
        [
          '主张“x²=9的全部实根只有3”。分类valid、invalid或insufficient。',
          'Classify the claim “the complete real root set of x²=9 is just three” as valid, invalid or insufficient.',
        ],
        'invalid',
        [
          '−3也满足原式，是明确反例；问题不是3错误，而是全部根不完整。',
          'Minus three also satisfies the original equation: the claim of completeness is false, even though three is a root.',
        ],
        ['valid', 'insufficient'],
      ),
      {
        stem: [
          '修正上题，写x²=9的全部不同实根。',
          'Correct the preceding answer by listing all distinct real roots of x²=9.',
        ],
        answer: { kind: 'root-set', radicand: '9', value: '±3' },
        step: [
          '3与−3的平方都为9，完整集合−3,3。',
          'Both three and minus three square to nine; list −3,3.',
        ],
        wrong: ['3', '-3', '9'],
      },
      N(
        [
          '5 m×3 m长方形，原答15 m单位不对。求正确面积数值，单位m²。',
          'For a 5 m by 3 m rectangle, “15 m” has the wrong unit. Find the area value in m².',
        ],
        '15',
        [
          '长度相乘给平方长度，面积15 m²，不是15 m。',
          'Multiplying lengths gives square length, so area is 15 m².',
        ],
        ['15 m', '8 m²'],
        'm²',
      ),
      {
        stem: [
          '竖升3、水平4，不能把75%写75°。求正确坡角，恰好1位小数。',
          'For rise three and horizontal run four, 75% is not 75°. Find the correct angle to one decimal place.',
        ],
        answer: { kind: 'trig-rounded', value: '36.9', places: 1, unit: '°' },
        step: [
          'tanθ=3/4，DEG模式θ≈36.9°。',
          'tanθ=3/4 gives θ≈36.9° in degree mode.',
        ],
        wrong: ['75.0', '60.0'],
      },
      V(
        [
          '仅观测f(0)=0、f(1)=1，却宣称f(2)必为2。分类这份证据：已核验、错误或证据不足。',
          'Only f(0)=0 and f(1)=1 are observed, yet f(2) is declared necessarily two. Classify the evidence as valid, invalid or insufficient.',
        ],
        'insufficient',
        [
          '2可能但不唯一；f=x²也吻合观测且给4，缺的是唯一规则依据。',
          'Two is possible but not uniquely established; x² also fits and gives four. A unique-rule premise is missing.',
        ],
        ['valid', 'invalid'],
        { kind: 'integration-graph', source: 'observations', query: '2' },
      ),
      E(
        [
          '为什么1.41可作为√2到两位小数的近似，却不能作为要求精确值的答案？并说明“合理”与“已证明”的不同。',
          'Why can 1.41 approximate √2 to two decimal places but not replace an exact answer? Distinguish plausible from proved.',
        ],
        [
          '1.41²=1.9881≠2，因此不是精确√2；若题目要求到百分位，1.41是合法近似。说明任务要求后再核单位、符号、范围、全部解、代回与前提。合理性可排明显错，但落在合理区间仍可能错误。明确反例推翻结论，缺证据只能说尚未建立，不能当作必假。',
          '1.41²=1.9881, not two, so it is not exact √2; it is a legitimate nearest-hundredth approximation when requested. State the task and audit units, signs, ranges, completeness, substitution and premises. Plausibility rejects obvious errors but is not proof. A counterexample refutes a claim; missing evidence means it is not established, not necessarily false.',
        ],
      ),
    ],
    pick: {
      stem: [
        '一个候选值能代回原方程，就一定完成题目吗？',
        'Does one candidate satisfying the original equation necessarily complete the task?',
      ],
      options: [
        ['一定，别的检查都不需要', 'Yes; no other checks matter'],
        ['只要小数看着接近即可', 'An approximately close decimal is enough'],
        [
          '还要核是否要求全部解、情境域、单位和原题目标',
          'Also check completeness, context domain, units and the actual target',
        ],
      ],
      feedback: [
        [
          '可能漏根或答错对象。',
          'Other roots or the target may still be missing.',
        ],
        ['精确与近似要求不同。', 'Exact and approximate requirements differ.'],
        [
          '代回是必要核验之一，不是所有要求。',
          'Substitution is one check, not all requirements.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '把“确有反例”“条件不足”和“已按条件核验”各给一个例子，并说明为什么不能只靠答案像不像。',
      'Give examples of a refuted claim, insufficient premises and a verified result, explaining why appearance is not enough.',
    ],
    rubric: [
      '漏−3的完整根主张有反例所以错；两观测点未给函数族，预测不唯一，是证据不足；给定直角与3、4两直角边，正斜边5由25=9+16核验。屏幕外形或合理范围不能替代这些依据。一个答案可数值对而单位错，也可某值满足但集合不完整。',
      'The complete-roots claim omitting minus three is refuted. Two observations without a function family leave prediction underdetermined. A given right angle with legs three/four verifies positive hypotenuse five via 25=9+16. Appearance or a plausible range does not replace premises. A number can be right with wrong units, or be a valid member of an incomplete set.',
    ],
    misconception: [
      '证据不足不等于结论必假；一个检查通过不等于任务全部完成。',
      'Insufficient evidence is not falsity, and passing one check does not complete every requirement.',
    ],
  },
  {
    title: ['综合项目：设计一个滑板坡道', 'Capstone: design a ramp'],
    objective: [
      '把长度、根式、坡度、面积和费用组成可核验的纸上设计，并逐项检查约束与模型局限。',
      'Combine lengths, radicals, grade, area and cost into an auditable paper design, checking every constraint and model limitation.',
    ],
    lab: 'integration-ramp',
    prerequisites: ['J98-L04', 'J96-L05', 'J94-L04', 'J91-L03'],
    keywords: [
      ['精确比较', 'exact comparison'],
      ['联合约束', 'joint constraints'],
      ['论证报告', 'argument report'],
    ],
    hook: [
      '坡度合格是否就代表面积和预算也合格？增加宽度会改变哪些量？',
      'Does an acceptable grade guarantee area and budget? Which quantities change when width increases?',
    ],
    items: [
      {
        stem: [
          '纸上模型：给定直角，竖升60 cm、水平240 cm、宽100 cm。求精确斜长米数，不附单位。',
          'Paper model: a right angle is given, rise 60 cm, run 240 cm, width 100 cm. Find exact inclined length in metres without units.',
        ],
        answer: { kind: 'root-length', value: '3√17/5', square: '153/25' },
        step: [
          '换成h=3/5 m、r=12/5 m，s²=153/25，正斜长s=3√17/5 m。',
          'Convert h=3/5 m, r=12/5 m; s²=153/25 and positive s=3√17/5 m.',
        ],
        wrong: ['3', '12/5', '-3√17/5'],
        diagram: {
          kind: 'integration-ramp',
          riseCm: 60,
          runCm: 240,
          widthCm: 100,
          budget: 150,
        },
      },
      N(
        [
          '同一纸上模型，求坡度h/r的无单位比值，可写等值百分数。',
          'For the same paper model, find dimensionless grade h/r, optionally as an equivalent percentage.',
        ],
        '1/4',
        [
          '0.6/2.4=1/4=25%；角度约14.0°，不是25°。',
          '0.6/2.4=1/4=25%; angle≈14.0°, not 25°.',
        ],
        ['25', '14', '0.6'],
      ),
      {
        stem: [
          '同一模型只有一块长方形坡面，宽1 m。求精确坡面面积数值，单位m²，不附单位字样。',
          'The same model has one rectangular inclined surface of width one metre. Find its exact numerical area in m², without unit text.',
        ],
        answer: { kind: 'radical', value: '3√17/5', simplified: false },
        step: [
          '坡面长度用斜长s而非水平r，A=s×1=3√17/5 m²。',
          'Use inclined length s rather than run r; area=3√17/5 m².',
        ],
        wrong: ['12/5', '3'],
      },
      N(
        [
          '虚构单块坡面费率NZ$60/m²，面积3√17/5 m²。费用最后舍入到分。',
          'Fictional single-surface rate is NZ$60/m² and area 3√17/5 m². Round cost finally to the nearest cent.',
        ],
        '148.43',
        [
          'C=36√17≈148.4318，得NZ$148.43；不先把斜长粗取2.5。',
          'C=36√17≈148.4318, so NZ$148.43; do not first round inclined length to 2.5.',
        ],
        ['150', '144', '14843'],
        'NZD',
      ),
      V(
        [
          '纸上约束h≥0.6、r≤2.4、坡度≤25%、坡面≤3 m²、预算NZ$150。只把默认宽1 m改1.2 m，其余不变，全部约束仍满足吗？',
          'Worksheet limits: h≥0.6, r≤2.4, grade≤25%, surface≤3 m², budget NZ$150. Change only default width one to 1.2 m. Are all limits still met?',
        ],
        'invalid',
        [
          '斜长与坡度不变，坡面约2.9686 m²仍≤3，但费用约178.12超150；不能只查坡度。',
          'Incline and grade stay fixed; surface≈2.9686 m² remains≤3, but cost≈178.12 exceeds 150. Grade alone is insufficient.',
        ],
        ['valid', 'insufficient'],
      ),
      E(
        [
          '给默认方案的完整纸上论证，另比较宽1.2 m方案，并说明此数学模型没有决定哪些实际问题。',
          'Write a complete paper argument for the default design, compare width 1.2 m, and explain what this model does not establish in reality.',
        ],
        [
          '默认h=0.6、r=2.4、w=1，直角给定，s=3√17/5，坡度1/4，坡面A=s，C=36√17≈148.43。逐项核高度、水平范围、25%坡度、3 m²面积和150预算；正量平方比较可避免先舍入压线。宽1.2只改面积/费用，不改侧面或坡度，费用178.12超预算。费率与约束是虚构练习条件，只计单块坡面，未含支撑、厚度、浪费或真实场地/施工标准；报告草稿和导出不替代家长论证审核。',
          'Default h=0.6,r=2.4,w=1 with a given right angle gives s=3√17/5, grade 1/4, surface A=s and C=36√17≈148.43. Check height, horizontal range, 25% grade, 3 m² area and 150 budget separately; squared positive quantities allow exact comparisons before rounding. Width 1.2 changes area/cost but not the side or grade, and cost≈178.12 exceeds budget. Rate and limits are fictional worksheet conditions counting only one surface, excluding supports, thickness, waste and real facility/construction standards. Saving/exporting a draft does not replace parent review.',
        ],
      ),
    ],
    pick: {
      stem: [
        '核面积或费用是否压线满足时，哪种方法可靠？',
        'Which method reliably checks an area or cost boundary?',
      ],
      options: [
        [
          '先按正量的精确关系比较，最后显示近似',
          'Compare exact positive quantities first, then display approximations',
        ],
        ['先把斜长粗取一位再决定', 'First round the incline coarsely'],
        ['坡度过关就不用查预算', 'If grade passes, ignore budget'],
      ],
      feedback: [
        [
          '平方后比较有理数可保留边界精度。',
          'Squaring positive quantities permits exact rational boundary comparisons.',
        ],
        [
          '提前舍入可能改变是否满足。',
          'Early rounding can change the verdict.',
        ],
        ['各条约束需同时成立。', 'Every constraint must hold together.'],
      ],
      correct: 0,
    },
    reason: [
      '宽度改变与统一缩放不同；解释它们对斜长、坡度、面积和费用的影响。',
      'Explain how a width-only change differs from uniform scaling for incline, grade, area and cost.',
    ],
    rubric: [
      '只改宽w，侧面h/r/s与坡度h/r不变，坡面面积sw和按面积费用同倍改变。所有长度统一乘k，则s乘k、坡度不变、面积与该费率下费用乘k²，但高度和水平上限可能失效。数值不变不表示所有约束保留，逐项按原纸上条件检查。',
      'Changing width alone preserves h,r,s and grade h/r, while area sw and area-based cost scale with width. Uniform scale k multiplies s by k and area/cost by k², preserving grade but possibly breaking height or horizontal limits. An unchanged ratio does not preserve every constraint; audit the original worksheet requirements individually.',
    ],
    misconception: [
      '坡度、斜长、底面积、坡面面积和预算不是同一项约束。',
      'Grade, incline, base area, inclined area and budget are separate quantities and constraints.',
    ],
  },
];
function q(id: string, i: number, v: Item): Question {
  if (v.answer.kind === 'explain')
    return reasoning(
      id,
      T(v.stem),
      skills[i]!,
      v.answer.rubric,
      hints[i]!.map(T),
    );
  const value = 'value' in v.answer ? v.answer.value : '',
    r = numeric(
      id,
      T(v.stem),
      String(value),
      skills[i]!,
      hints[i]!.map(T),
      [T(v.step)],
      { accepted: [String(value)], rejected: v.wrong },
      v.diagram,
    );
  r.answer = v.answer;
  return r;
}
function pick(id: string, i: number, p: Pick) {
  return choice(
    id,
    T(p.stem),
    p.correct,
    skills[i]!,
    p.options.map((v, j) => ({ text: T(v), feedback: T(p.feedback[j]!) })),
    hints[i]!.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const j98Lessons: Lesson[] = specs.map((s, i) => {
  const id = `J98-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: 20,
    lab: s.lab,
    hook: T(s.hook),
    stage: 'J09',
    unit: 'J98',
    order: i + 1,
    nzYearHints: [9, 10, 11],
    cnGradeHints: [9],
    contentStatus: 'ready',
    skillTags: [skills[i]!],
    guided: q(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i, s.pick),
      ...s.items.slice(1, 5).map((v, j) => q(`${id}-Q${j + 2}`, i, v)),
      reasoning(
        `${id}-Q6`,
        T(s.reason),
        skills[i]!,
        T(s.rubric),
        hints[i]!.map(T),
      ),
    ],
    exit: q(`${id}-X`, i, s.items[5]!),
    exitReason: T(s.objective),
    parent: {
      goal: T(s.objective),
      misconception: T(s.misconception),
      prompts: [
        t(
          '题目真正求什么？需要什么前提、单位和范围？',
          'What is the actual target? Which premises, units and domains are needed?',
        ),
        t(
          '能用另一种表示核验吗？哪些条件改变后结论须重算？',
          'Can another representation audit it? Which changed conditions require a new conclusion?',
        ),
      ],
      bridge: s.prerequisites[0]!,
    },
    ...(i === 4
      ? {
          familyChallenge: t(
            '纸上设计一个虚构坡道方案与一个近似但不满足的方案。给定直角侧面、单块长方形坡面和NZ$60/m²练习费率，按h≥0.6 m、r≤2.4 m、坡度≤25%、坡面≤3 m²与自定纸上预算逐项核算。保存参数、精确值、最后近似、比较方案和模型局限，可下载Markdown论证报告，另在课程出口接受家长审核。仅为数学模型，不是实际施工图，无需建造、购买或上传。',
            'Create a fictional paper ramp and a near-miss alternative. With a given right-triangle side, one rectangular inclined surface and worksheet rate NZ$60/m², audit h≥0.6 m, r≤2.4 m, grade≤25%, surface≤3 m² and a stated paper budget. Preserve parameters, exact values, final approximations, comparison and model limits in a downloadable Markdown argument; a parent separately reviews the lesson exit. This is a mathematical model rather than a construction drawing, requiring no building, purchase or upload.',
          ),
        }
      : {}),
  };
});
export function j98ReviewQuestion(id: string, round: number): Question {
  if (
    !/^J98-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid J98 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 80;
  let v: Item;
  if (i === 0) {
    const d = 1 + (k % 4),
      area = k % 2 === 0,
      m = rectangleLink(String(1 + (k % 6)), d);
    v = P(
      [
        `正长方形边x与x+${d}，写${area ? '面积' : '周长'}展开合并一般式。`,
        `Positive rectangle sides x and x+${d}: enter the collected general ${area ? 'area' : 'perimeter'} expression.`,
      ],
      area ? m.areaExpression : m.perimeterExpression,
      [
        `按${area ? '两块面积相加' : '四条外边相加'}得到${area ? m.areaExpression : m.perimeterExpression}。`,
        `Use ${area ? 'the two area parts' : 'the four outer sides'} to obtain ${area ? m.areaExpression : m.perimeterExpression}.`,
      ],
      ['-1', '99'],
    );
  } else if (i === 1) {
    if (k % 3 === 0) {
      const query = String((k % 17) / 2),
        m = integrationGraph('drain', query);
      v = N(
        [
          `完整分段直线水量图(0,12)→(3,6)→(6,6)→(9,0)，时间min、水量L。求t=${query}时水量。`,
          `Full piecewise-linear water trace (0,12)→(3,6)→(6,6)→(9,0), time min and volume L. Find volume at t=${query}.`,
        ],
        textR(m.value!),
        [
          '在所属直线段用给定规则求值。',
          'Evaluate within the supplied straight segment.',
        ],
        ['-1', '99'],
        'L',
      );
    } else if (k % 3 === 1) {
      const a = 1 + (k % 4),
        b = 1 + (Math.floor(k / 4) % 5);
      v = P(
        [
          `已知一次函数过(0,${b})与(4,${4 * a + b})，写y右侧一般式。`,
          `A stipulated affine function passes through (0,${b}) and (4,${4 * a + b}). Enter its general right side.`,
        ],
        `${a}x+${b}`,
        [
          `变化率${a}，截距${b}，得${a}x+${b}。`,
          `Rate ${a}, intercept ${b}, giving ${a}x+${b}.`,
        ],
        ['0', '99'],
      );
    } else
      v = V(
        [
          '仅观测f(0)=0、f(1)=1，无函数族前提，能确定f(2)吗？分类证据。',
          'Only f(0)=0,f(1)=1 are observed without a function family. Classify the evidence for determining f(2).',
        ],
        'insufficient',
        [
          '不同函数可吻合观测而给不同后续值。',
          'Different functions fit the observations but give different later values.',
        ],
        ['valid', 'invalid'],
      );
  } else if (i === 2) {
    if (k % 2 === 0) {
      const x = 2 + (k % 7),
        d = 1 + (k % 3);
      v = N(
        [
          `长方形正边x与x+${d} m，面积${x * (x + d)} m²。求周长。`,
          `Positive rectangle sides x and x+${d} m have area ${x * (x + d)} m². Find perimeter.`,
        ],
        String(4 * x + 2 * d),
        [
          `解面积关系保留正x=${x}，再求外边和。`,
          `Solve the area relation for positive x=${x}, then add outer sides.`,
        ],
        ['-1', '99'],
        'm',
      );
    } else {
      const a = 2 + (k % 5),
        b = a + 2;
      v = N(
        [
          `去返各3 km，速度${a}与${b} km/h，无停留，求全程平均速度。`,
          `Out/back each three km, speeds ${a} and ${b} km/h with no stops. Find average speed.`,
        ],
        textR(rational(BigInt(a * b), BigInt(a + 1))),
        [
          `总路程6，时间3/${a}+3/${b} h，再相除。`,
          `Total distance six, time 3/${a}+3/${b} h, then divide.`,
        ],
        ['-1', '99'],
        'km/h',
      );
    }
  } else if (i === 3) {
    const c = auditCases[k % auditCases.length]!;
    v = V(
      [c.zh, c.en],
      c.verdict,
      [c.reasonZh, c.reasonEn],
      c.verdict === 'valid'
        ? ['invalid', 'insufficient']
        : c.verdict === 'invalid'
          ? ['valid', 'insufficient']
          : ['valid', 'invalid'],
    );
  } else {
    const p: RampParams = {
        riseCm: [30, 45, 60, 75, 90][k % 5]!,
        runCm: [180, 240, 300][Math.floor(k / 5) % 3]!,
        widthCm: [80, 100, 120][Math.floor(k / 15) % 3]!,
        budget: [120, 150, 180][Math.floor(k / 45) % 3]!,
      },
      m = rampModel(p);
    if (k % 4 === 0)
      v = N(
        [
          `纸上直角侧面h=${p.riseCm} cm、水平r=${p.runCm} cm、坡面宽${p.widthCm} cm。只计单块坡面，虚构NZ$60/m²，求最后到分的费用。`,
          `Paper right-triangle side: rise ${p.riseCm} cm, run ${p.runCm} cm, width ${p.widthCm} cm. One surface only at fictional NZ$60/m². Find cost rounded finally to cents.`,
        ],
        m.costRounded,
        [
          `s=${m.lengthExact} m，A=sw，C=${m.costExact}≈${m.costRounded}。`,
          `s=${m.lengthExact} m, A=sw and C=${m.costExact}≈${m.costRounded}.`,
        ],
        ['-1', '999'],
        'NZD',
      );
    else
      v = V(
        [
          `纸上方案h=${p.riseCm} cm、r=${p.runCm} cm、w=${p.widthCm} cm、预算NZ$${p.budget}，直角、单块坡面与NZ$60/m²给定。核h≥0.6m、r≤2.4m、坡度≤25%、面积≤3m²及预算，全部满足写valid，否则invalid。`,
          `Paper design h=${p.riseCm} cm,r=${p.runCm} cm,w=${p.widthCm} cm,budget NZ$${p.budget}, given right angle, one surface and rate NZ$60/m². Audit h≥0.6m,r≤2.4m,grade≤25%,area≤3m² and budget: valid only if all hold.`,
        ],
        m.feasible ? 'valid' : 'invalid',
        [
          '先换单位，逐项精确比较，不能只核坡度或先粗舍入。',
          'Convert units and compare every constraint exactly, not grade alone or rounded intermediate values.',
        ],
        [m.feasible ? 'invalid' : 'valid', 'insufficient'],
      );
  }
  return q(`${id}-R${round}`, i, v);
}
export const j98CheckQuestions: Question[] = [
  q('J98-CHECK-Q1', 0, specs[0]!.items[0]!),
  q('J98-CHECK-Q2', 1, specs[1]!.items[0]!),
  q('J98-CHECK-Q3', 2, specs[2]!.items[3]!),
  q('J98-CHECK-Q4', 3, specs[3]!.items[4]!),
  q('J98-CHECK-Q5', 4, specs[4]!.items[3]!),
  reasoning(
    'J98-CHECK-Q6',
    T(specs[2]!.reason),
    skills[2]!,
    T(specs[2]!.rubric),
    hints[2]!.map(T),
  ),
  pick('J98-CHECK-Q7', 4, specs[4]!.pick),
  q('J98-CHECK-Q8', 4, specs[4]!.items[5]!),
];
