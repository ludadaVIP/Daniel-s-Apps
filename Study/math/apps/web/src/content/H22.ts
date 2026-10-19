import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import {
  cp,
  planeLine,
  lineDistanceSquare,
  projectionFoot,
  parabolaModel,
  focalModel,
  conicPoint,
  type ConicCode,
} from '../conicModels';
import { coordinateText } from '../cartesianModels';
import { textR } from '../algebraModels';
type Pair = [string, string];
const T = (v: Pair) => t(...v);
type Item = { stem: Pair; answer: AnswerSpec; step: Pair; wrong: string[] };
const I = (
  stem: Pair,
  answer: AnswerSpec,
  step: Pair,
  wrong: string[] = [],
): Item => ({ stem, answer, step, wrong });
const N = (stem: Pair, value: string, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'number', value }, step, wrong);
const Q = (stem: Pair, value: string, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'plane-equation', value }, step, wrong);
const P = (stem: Pair, value: string, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'coordinate', value }, step, wrong);
const R = (stem: Pair, value: string, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'radical', value }, step, wrong);
const C = (stem: Pair, value: ConicCode, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'conic-code', value }, step, wrong);
const E = (stem: Pair, rubric: Pair) =>
  I(stem, { kind: 'explain', rubric: T(rubric) }, rubric);
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
    title: ['直线方程的多种形式', 'Forms of a line equation'],
    objective: [
      '由一点与方向写出等价直线方程，并识别各形式的适用条件。',
      'Write equivalent line equations from a point and direction, identifying each form’s conditions.',
    ],
    hook: [
      '竖直线也有方程，为什么不能硬写成y=mx+b？',
      'A vertical line has an equation. Why can it not be forced into y=mx+b?',
    ],
    prerequisites: ['J75-L01', 'J85-L03', 'H05-L04'],
    keywords: [
      ['点斜式', 'point-slope form'],
      ['一般式', 'general form'],
      ['竖直线', 'vertical line'],
    ],
    lab: 'conic-line',
    hints: [
      [
        '先说明已知点和方向；非竖直线才能用有限斜率。',
        'Identify the given point and direction; finite slope requires a nonvertical line.',
      ],
      [
        '一般式Ax+By+C=0需(A,B)≠(0,0)；代点并核对方向，不只比较外观。',
        'General form requires (A,B)≠(0,0). Substitute a point and check direction, not appearance.',
      ],
    ],
    items: [
      Q(
        [
          '写出经过(1,3)、斜率2的直线方程，任意等价形式均可。',
          'Write an equation of the line through (1,3) with slope two, in any equivalent form.',
        ],
        'y-3=2(x-1)',
        [
          'y−3=2(x−1)，即y=2x+1或2x−y+1=0。',
          'y−3=2(x−1), equivalently y=2x+1 or 2x−y+1=0.',
        ],
        ['y=2x+3', 'y=2x-1', 'x=1'],
      ),
      Q(
        [
          '写出经过(2,−1)与(2,4)的直线方程。',
          'Write the line through (2,−1) and (2,4).',
        ],
        'x=2',
        [
          '两点横坐标相同，竖直线x=2；斜率无定义。',
          'Both x-coordinates equal two, giving vertical line x=2 with undefined slope.',
        ],
        ['y=2', 'y=0', '0=0'],
      ),
      Q(
        [
          '经过(−3,−2)的水平线方程是什么？',
          'What is the horizontal line through (−3,−2)?',
        ],
        'y=-2',
        [
          '水平线纵坐标恒为−2，斜率为0。',
          'Its y-coordinate stays −2; slope is zero.',
        ],
        ['x=-3', 'y=0', 'x=-2'],
      ),
      Q(
        [
          '写出经过(0,1)和(2,5)的直线方程。',
          'Write the line through (0,1) and (2,5).',
        ],
        '2x-y+1=0',
        [
          'm=(5−1)/(2−0)=2，纵截距1，所以y=2x+1。',
          'm=(5−1)/(2−0)=2 and the y-intercept is one, giving y=2x+1.',
        ],
        ['y=2x', 'y=x+1', 'y=2x+5'],
      ),
      N(
        ['2x−y+1=0的斜率是多少？', 'What is the slope of 2x−y+1=0?'],
        '2',
        [
          '移项得y=2x+1，或用m=−A/B=−2/(−1)=2。',
          'Rearrange to y=2x+1, or use m=−A/B=−2/(−1)=2.',
        ],
        ['-2', '1', '0'],
      ),
      E(
        [
          '分别写经过(1,3)、斜率2的直线与经过(2,−1)、(2,4)的直线。代点验证，并解释第二条为何不用点斜式。',
          'Write the line through (1,3) with slope two and the line through (2,−1),(2,4). Verify the points and explain why point-slope form fails for the second.',
        ],
        [
          '第一条y−3=2(x−1)，代(1,3)为0=0；y=2x+1同义。第二条x=2，两点均满足；Δx=0不能算Δy/Δx，斜率无定义而非0。一般式x−2=0仍有效。',
          'The first is y−3=2(x−1), verified at (1,3), equivalently y=2x+1. The second is x=2, satisfied by both points. Its Δx=0 makes Δy/Δx undefined, not zero; general form x−2=0 remains valid.',
        ],
      ),
    ],
    pick: {
      stem: [
        '哪一个表示竖直线x=2？',
        'Which represents the vertical line x=2?',
      ],
      correct: 1,
      options: [
        ['y=2，斜率0', 'y=2, slope zero'],
        ['x−2=0，斜率无定义', 'x−2=0, undefined slope'],
        ['y=2x，斜率2', 'y=2x, slope two'],
      ],
      feedback: [
        ['y=2是水平线，固定的是纵坐标。', 'y=2 is horizontal, fixing y.'],
        [
          '固定x=2，任意实数y都可，斜率无定义。',
          'x stays two while y is arbitrary; the slope is undefined.',
        ],
        [
          'y=2x是过原点的斜线，不能表示固定横坐标。',
          'y=2x is slanted through the origin; x is not fixed.',
        ],
      ],
    },
    reason: [
      '为什么0x+0y+0=0和0x+0y+1=0都不能叫一条直线？',
      'Why are neither 0x+0y+0=0 nor 0x+0y+1=0 equations of a line?',
    ],
    rubric: [
      '前者所有点都满足，后者没有点满足，都不是一条直线；一般式必须A,B不同时为0。',
      'The first contains every point and the second none. Neither is one line; A and B cannot both vanish.',
    ],
    prompts: [
      [
        '把一个点和一个方向分别在方程中指出。',
        'Identify a point and a direction in the equation.',
      ],
      [
        '截距式x/a+y/b=1为何需要两个非零有限截距？试过原点或竖直线。',
        'Why does intercept form need two finite nonzero intercepts? Try a line through the origin or a vertical line.',
      ],
    ],
    misconception: [
      '一般式可覆盖竖直线；点斜式、截距式各有条件。',
      'General form covers vertical lines; point-slope and intercept forms have conditions.',
    ],
  },
  {
    title: ['点到直线的距离', 'Distance from a point to a line'],
    objective: [
      '用垂足与法向量解释并计算点到直线的非负最短距离。',
      'Use the perpendicular foot and normal vector to explain and calculate nonnegative shortest distance to a line.',
    ],
    hook: [
      '点到斜线的竖直落差，为什么往往不是“距离”？',
      'Why is a vertical gap to a slanted line usually not its distance?',
    ],
    prerequisites: ['H22-L01', 'H05-L04', 'J87-L04', 'J91-L03'],
    keywords: [
      ['垂足', 'perpendicular foot'],
      ['法向量', 'normal vector'],
      ['最短距离', 'shortest distance'],
    ],
    lab: 'conic-distance',
    hints: [
      [
        '先用垂足H而非任意交点；(A,B)垂直Ax+By+C=0。',
        'Use the perpendicular foot H, not an arbitrary intersection; (A,B) is normal to the line.',
      ],
      [
        'd=|Ax₀+By₀+C|/sqrt(A²+B²)，分母不能为0，距离不能带负号。',
        'd=|Ax₀+By₀+C|/sqrt(A²+B²); the denominator is nonzero and distance cannot be negative.',
      ],
    ],
    items: [
      R(
        [
          '求P(1,3)到3x+4y−5=0的精确距离。',
          'Find the exact distance from P(1,3) to 3x+4y−5=0.',
        ],
        '2',
        ['|3+12−5|/sqrt(9+16)=10/5=2。', '|3+12−5|/sqrt(9+16)=10/5=2.'],
        ['10', '-2', '5'],
      ),
      P(
        [
          'P(1,3)到3x+4y−5=0的垂足H坐标是什么？',
          'Find the perpendicular foot from P(1,3) to 3x+4y−5=0.',
        ],
        '(-1/5,7/5)',
        [
          'λ=10/25=2/5；H=(1,3)−(2/5)(3,4)=(−1/5,7/5)。',
          'λ=10/25=2/5, so H=(1,3)−(2/5)(3,4)=(−1/5,7/5).',
        ],
        ['(1,1/2)', '(0,0)', '(1/5,-7/5)'],
      ),
      N(
        [
          'P(3,−1)到3x+4y−5=0的距离是多少？',
          'What is the distance from P(3,−1) to 3x+4y−5=0?',
        ],
        '0',
        [
          '3×3+4×(−1)−5=0，点已在直线上，垂足就是自身。',
          '3×3+4×(−1)−5=0, so P lies on the line and is its own foot.',
        ],
        ['1', '-1', '5'],
      ),
      R(
        [
          '求(1,3)到−6x−8y+10=0的精确距离。',
          'Find the exact distance from (1,3) to −6x−8y+10=0.',
        ],
        '2',
        [
          '分子绝对值20，分母10，所以2；这是原直线的−2倍方程。',
          'The numerator’s absolute value is 20 and the denominator 10, giving two; this equation is −2 times the original.',
        ],
        ['-2', '4', '20'],
      ),
      N(
        [
          '求(−1,4)到竖直线x=2的距离。',
          'Find the distance from (−1,4) to vertical line x=2.',
        ],
        '3',
        [
          '垂足为(2,4)，水平距离|−1−2|=3。',
          'The foot is (2,4), with horizontal distance |−1−2|=3.',
        ],
        ['-3', '4', '5'],
      ),
      E(
        [
          '对Ax+By+C=0且(A,B)≠(0,0)，说明距离公式中分母、绝对值及垂足各有什么作用。',
          'For Ax+By+C=0 with (A,B)≠(0,0), explain the denominator, absolute value and perpendicular foot in the distance formula.',
        ],
        [
          '(A,B)是非零法向量，长度sqrt(A²+B²)把法向投影换成长度；绝对值去掉点在线哪一侧的符号。H=P−[(Ax₀+By₀+C)/(A²+B²)](A,B)代回直线为0，PH沿法向，因而垂直。对任意线上Q，PQ²=PH²+HQ²≥PH²，故PH最短；P在线上时为0。',
          'The nonzero normal (A,B) has length sqrt(A²+B²), normalising the projection. Absolute value removes the side sign. H=P−[(Ax₀+By₀+C)/(A²+B²)](A,B) lies on the line, and PH is normal to it. For any point Q on the line, PQ²=PH²+HQ²≥PH², proving shortest distance, including zero when P is on the line.',
        ],
      ),
    ],
    pick: {
      stem: [
        '点到一般式直线的距离用哪一个？',
        'Which formula gives distance to a general-form line?',
      ],
      correct: 2,
      options: [
        ['Ax₀+By₀+C', 'Ax₀+By₀+C'],
        ['|Ax₀+By₀+C|', '|Ax₀+By₀+C|'],
        ['|Ax₀+By₀+C|/sqrt(A²+B²)', '|Ax₀+By₀+C|/sqrt(A²+B²)'],
      ],
      feedback: [
        [
          '这是带方向的代入值，可能为负，且随方程倍数变化。',
          'This signed substitution may be negative and changes with scaling.',
        ],
        [
          '绝对值仍没有除以法向量长度，换倍数会改变它。',
          'Without dividing by normal length, scaling changes this value.',
        ],
        [
          '归一化并取非负值，对等价方程不变。',
          'Normalisation and absolute value give an invariant nonnegative length.',
        ],
      ],
    },
    reason: [
      'P(0,0)到y=x+2的竖直间隔为2。用H(−1,1)证明最短距离不是2。',
      'The vertical gap from P(0,0) to y=x+2 is two. Use H(−1,1) to show why the shortest distance is not two.',
    ],
    rubric: [
      'H满足1=−1+2；PH方向(−1,1)与直线方向(1,1)点积0，所以垂直。PH=sqrt(1+1)=√2<2，竖直线段不是垂线。',
      'H satisfies the line. Direction (−1,1) has zero dot product with line direction (1,1), so PH is perpendicular. PH=√2<2; the vertical segment is not perpendicular.',
    ],
    prompts: [
      [
        '先找H，再验证H在线上、PH垂直。',
        'Locate H, then check incidence and perpendicularity.',
      ],
      [
        '把方程乘−2后，分子与分母怎样一起变化？',
        'How do numerator and denominator change when the equation is scaled by −2?',
      ],
    ],
    misconception: [
      '距离要最短、非负且不依赖方程的非零倍数。',
      'Distance is shortest, nonnegative and unchanged by nonzero equation scaling.',
    ],
  },
  {
    title: ['圆的标准方程', 'Standard equation of a circle'],
    objective: [
      '用到定点的固定距离建立圆方程，并区分半径、半径平方与退化情况。',
      'Build a circle equation from fixed distance to a centre, distinguishing radius, squared radius and degenerate cases.',
    ],
    hook: [
      '(x−1)²+(y+2)²=25的圆心在哪里？半径是25吗？',
      'Where is the centre of (x−1)²+(y+2)²=25? Is its radius 25?',
    ],
    prerequisites: ['H22-L02', 'J81-L04', 'J87-L04', 'J91-L03'],
    keywords: [
      ['圆心', 'centre'],
      ['半径平方', 'squared radius'],
      ['配方', 'completing the square'],
    ],
    lab: 'conic-circle',
    hints: [
      [
        '把(x−h)、(y−k)读成到中心的坐标差；右端为r²。',
        'Read (x−h),(y−k) as coordinate differences from the centre; the right side is r².',
      ],
      [
        '先配方，再按右端正、零、负区分圆、单点、无实点。',
        'Complete squares, then distinguish positive, zero and negative right sides.',
      ],
    ],
    items: [
      Q(
        [
          '写出圆心(1,−2)、半径5的圆的方程。',
          'Write the circle with centre (1,−2) and radius five.',
        ],
        '(x-1)^2+(y+2)^2=25',
        [
          '距离平方为(x−1)²+(y+2)²=5²=25。',
          'Squared distance gives (x−1)²+(y+2)²=5²=25.',
        ],
        ['(x+1)^2+(y-2)^2=25', '(x-1)^2+(y+2)^2=5', 'x^2+y^2=25'],
      ),
      P(
        [
          '圆x²+y²−4x+6y−12=0的圆心坐标是什么？',
          'Find the centre of x²+y²−4x+6y−12=0.',
        ],
        '(2,-3)',
        [
          '配方得(x−2)²+(y+3)²=25，圆心(2,−3)。',
          'Completing squares gives (x−2)²+(y+3)²=25, centred at (2,−3).',
        ],
        ['(-2,3)', '(4,-6)', '(2,3)'],
      ),
      N(
        [
          '圆x²+y²−4x+6y−12=0的半径是多少？',
          'Find the radius of x²+y²−4x+6y−12=0.',
        ],
        '5',
        [
          '配方右端12+4+9=25，半径取非负根5。',
          'The completed right side is 12+4+9=25; radius is its nonnegative root five.',
        ],
        ['25', '-5', '12'],
      ),
      C(
        [
          '(x−1)²+(y+2)²=0在实平面是circle、point还是empty？',
          'Is the real locus (x−1)²+(y+2)²=0 a circle, point or empty set?',
        ],
        'point',
        [
          '两个非负平方和为0须分别为0，只剩(1,−2)。',
          'Both nonnegative squares must vanish, leaving (1,−2) alone.',
        ],
        ['circle', 'empty', '0'],
      ),
      C(
        [
          '(x−1)²+(y+2)²=−1在实平面是circle、point还是empty？',
          'Is the real locus (x−1)²+(y+2)²=−1 a circle, point or empty set?',
        ],
        'empty',
        [
          '非负平方和不能等于−1，没有实点。',
          'A nonnegative sum cannot be −1; there are no real points.',
        ],
        ['circle', 'point', '1'],
      ),
      E(
        [
          '把x²+y²−4x+6y−12=0配方，给圆心、半径，并检验点(5,1)是否在圆上。',
          'Complete squares in x²+y²−4x+6y−12=0, give centre and radius, and test (5,1).',
        ],
        [
          '(x−2)²−4+(y+3)²−9=12，故(x−2)²+(y+3)²=25。中心(2,−3)，半径5而非25。点(5,1)到中心平方距离3²+4²=25，在圆上；也可代原式25+1−20+6−12=0。',
          'Completing squares gives (x−2)²−4+(y+3)²−9=12, hence (x−2)²+(y+3)²=25. Centre is (2,−3), radius five, not 25. Point (5,1) has squared distance 3²+4²=25 and lies on the circle; substitution in the original equation also gives zero.',
        ],
      ),
    ],
    pick: {
      stem: [
        '(x+2)²+(y−3)²=9的圆心和半径是什么？',
        'What are the centre and radius of (x+2)²+(y−3)²=9?',
      ],
      correct: 0,
      options: [
        ['(−2,3)，3', '(−2,3), three'],
        ['(2,−3)，9', '(2,−3), nine'],
        ['(−2,3)，9', '(−2,3), nine'],
      ],
      feedback: [
        [
          '坐标差是x−(−2)、y−3，r=√9=3。',
          'The differences are x−(−2), y−3, and r=√9=3.',
        ],
        [
          '圆心符号与半径平方都读错。',
          'Both centre signs and squared radius were misread.',
        ],
        [
          '圆心正确，但9是r²，不是r。',
          'The centre is correct but nine is r², not r.',
        ],
      ],
    },
    reason: [
      'P(1,3)到C(1,−2)距离为5。解释为何P在(x−1)²+(y+2)²=25上，C却不在这个圆上。',
      'P(1,3) is five units from C(1,−2). Explain why P lies on (x−1)²+(y+2)²=25 but C does not.',
    ],
    rubric: [
      'P的距离平方0²+5²=25，满足圆周条件。C到自身距离0≠5，是圆心及内部点，不是圆周点；不能把圆与整个圆盘混为一谈。',
      'For P, squared distance is 0²+5²=25. The centre has distance zero, not five; it is inside, not on the circumference. A circle is not the whole disc.',
    ],
    prompts: [
      [
        '把圆心代入方程，会得到什么？',
        'What happens when you substitute the centre?',
      ],
      [
        '配方时每增加一个平方常数，等式另一边如何补偿？',
        'How does the other side compensate for each added square constant?',
      ],
    ],
    misconception: [
      '标准圆方程描述圆周；右端是r²，实数域还需核对其符号。',
      'A circle equation describes the circumference; its right side is r² and its sign matters over the reals.',
    ],
  },
  {
    title: ['抛物线的焦点与准线', 'Parabola focus and directrix'],
    objective: [
      '由点到焦点与准线等距推导抛物线方程并读出开口方向。',
      'Derive a parabola equation from equal focus and directrix distances and identify its opening direction.',
    ],
    hook: [
      '抛物线上一点到一个点与一条线，哪两段距离相等？',
      'For a point on a parabola, which distances to a point and a line are equal?',
    ],
    prerequisites: ['H22-L02', 'H22-L03', 'J93-L01', 'J93-L03'],
    keywords: [
      ['焦点', 'focus'],
      ['准线', 'directrix'],
      ['等距轨迹', 'equidistant locus'],
    ],
    lab: 'conic-parabola',
    hints: [
      [
        '先标F和准线；到准线须量垂直距离，不是斜线。',
        'Mark the focus and directrix; distance to the line is perpendicular, not slanted.',
      ],
      [
        '水平轴(y−k)²=4p(x−h)，焦点(h+p,k)、准线x=h−p；竖直轴交换角色。',
        'For a horizontal axis use (y−k)²=4p(x−h), focus (h+p,k), directrix x=h−p; swap coordinate roles for a vertical axis.',
      ],
    ],
    items: [
      Q(
        [
          '焦点F(2,0)、准线x=−2的抛物线方程是什么？',
          'Find the parabola with focus F(2,0) and directrix x=−2.',
        ],
        'y^2=8x',
        [
          '顶点(0,0)，p=2；等距平方后y²=4px=8x。',
          'Vertex is (0,0), p=2; squaring equal distances gives y²=4px=8x.',
        ],
        ['y^2=4x', 'x^2=8y', 'y^2=-8x'],
      ),
      P(
        ['抛物线x²=8y的焦点坐标是什么？', 'Find the focus of x²=8y.'],
        '(0,2)',
        [
          '4p=8得p=2，沿正y轴，焦点(0,2)。',
          '4p=8 gives p=2 along positive y, so focus is (0,2).',
        ],
        ['(0,4)', '(2,0)', '(0,-2)'],
      ),
      Q(
        ['抛物线x²=8y的准线方程是什么？', 'Find the directrix of x²=8y.'],
        'y=-2',
        [
          '焦点在(0,2)，准线在顶点另一侧，y=−2。',
          'The focus is (0,2); the directrix lies on the opposite side of the vertex at y=−2.',
        ],
        ['x=-2', 'y=2', 'y=-4'],
      ),
      N(
        [
          'P(1,2)在y²=4x上，求它到F(1,0)的距离。',
          'P(1,2) lies on y²=4x. Find its distance to F(1,0).',
        ],
        '2',
        [
          'PF=2，到准线x=−1的距离也为|1+1|=2。',
          'PF=2, matching distance |1+1|=2 to directrix x=−1.',
        ],
        ['1', '3', '4'],
      ),
      P(
        ['抛物线y²=−8x的焦点坐标是什么？', 'Find the focus of y²=−8x.'],
        '(-2,0)',
        [
          '4p=−8得p=−2，向左开口，焦点(−2,0)。',
          '4p=−8 gives p=−2, opening left with focus (−2,0).',
        ],
        ['(2,0)', '(0,-2)', '(-4,0)'],
      ),
      E(
        [
          '由F(1,0)与准线x=−1推导y²=4x；解释平方为什么没有额外引入另一侧的点。',
          'Derive y²=4x from F(1,0) and directrix x=−1. Explain why squaring introduces no extra opposite-side points.',
        ],
        [
          'PF=sqrt((x−1)²+y²)，PD=|x+1|，两边非负。平方得(x−1)²+y²=(x+1)²，整理y²=4x。反过来此式给x=y²/4≥0，故原两非负距离平方相等就距离相等，轨迹条件恢复；不能只把x+1当始终为正而省说明。',
          'PF=sqrt((x−1)²+y²), PD=|x+1|; both are nonnegative. Squaring and subtracting gives y²=4x. Conversely this equation implies x=y²/4≥0, and equality of the squared nonnegative distances restores the distance equality. Do not silently assume x+1 is always positive before checking the locus.',
        ],
      ),
    ],
    pick: {
      stem: [
        '对y²=4px，p≠0，哪组焦点/准线正确？',
        'For y²=4px with p≠0, which focus/directrix pair is correct?',
      ],
      correct: 1,
      options: [
        ['F(2p,0)，x=−2p', 'F(2p,0), x=−2p'],
        ['F(p,0)，x=−p', 'F(p,0), x=−p'],
        ['F(0,p)，y=−p', 'F(0,p), y=−p'],
      ],
      feedback: [
        [
          '在本课4p约定下，p是顶点到焦点的有向位移，不是焦准距离2p。',
          'Under the 4p convention, p is vertex-to-focus displacement, not twice it.',
        ],
        [
          '焦点与准线关于顶点对称，分别位于x=p与x=−p。',
          'Focus and directrix are on opposite sides of the vertex, at x=p and x=−p.',
        ],
        [
          '这组对应x²=4py，轴向交换了。',
          'This pair belongs to x²=4py, with the axis swapped.',
        ],
      ],
    },
    reason: [
      '为什么不能把p=0代入y²=4px后还称为非退化抛物线？',
      'Why does substituting p=0 into y²=4px not give a nondegenerate parabola?',
    ],
    rubric: [
      '此时焦点(0,0)落在准线x=0上，y²=0仅是直线y=0。到焦点与准线等距要求sqrt(x²+y²)=|x|，也得y=0；因此须排除p=0。',
      'The focus lies on the directrix. Equation y²=0 is the line y=0. The distance equality sqrt(x²+y²)=|x| also yields y=0, so p=0 must be excluded.',
    ],
    prompts: [
      [
        '指出图中D，说明为何PD垂直准线。',
        'Identify D and explain why PD is perpendicular to the directrix.',
      ],
      [
        '把p改成负数或把轴转成竖直，焦点、准线与平方项怎样对应？',
        'How do the focus, directrix and squared term change for negative p or a vertical axis?',
      ],
    ],
    misconception: [
      '本课使用y²=4px；其他资料的2p约定需要换算，不能混用参数。',
      'This lesson uses y²=4px; a 2p convention in another source requires parameter conversion.',
    ],
  },
  {
    title: ['椭圆的几何定义', 'Geometric definition of ellipses'],
    objective: [
      '用到两焦点距离和不变解释椭圆及a、b、c的条件。',
      'Explain an ellipse through a constant sum of focal distances and the conditions on a,b,c.',
    ],
    hook: [
      '画椭圆时绳长固定，是到每个焦点的距离都固定吗？',
      'When a string draws an ellipse, is the distance to each focus fixed separately?',
    ],
    prerequisites: ['H22-L03', 'H22-L04', 'J87-L04'],
    keywords: [
      ['距离和', 'distance sum'],
      ['半长轴', 'semi-major axis'],
      ['焦点间距', 'focal separation'],
    ],
    lab: 'conic-ellipse',
    hints: [
      [
        'PF1+PF2=2a，而F1F2=2c；非退化非圆椭圆有0<c<a。',
        'PF1+PF2=2a while F1F2=2c; a nondegenerate noncircular ellipse has 0<c<a.',
      ],
      [
        '焦点轴对应a²分母，另一分母b²=a²−c²；移中心用坐标差。',
        'The focal-axis denominator is a²; the other is b²=a²−c². Translation uses coordinate differences.',
      ],
    ],
    items: [
      Q(
        [
          '椭圆焦点(−3,0)、(3,0)，到两焦点距离和10，写方程。',
          'An ellipse has foci (−3,0),(3,0) and focal distance sum ten. Write its equation.',
        ],
        'x^2/25+y^2/16=1',
        [
          '2a=10得a=5，c=3，b²=25−9=16。',
          '2a=10 gives a=5; c=3 and b²=25−9=16.',
        ],
        ['x^2/9+y^2/16=1', 'x^2/25-y^2/16=1', 'x^2/16+y^2/25=1'],
      ),
      N(
        ['椭圆a=5、c=3，求b²。', 'For an ellipse with a=5,c=3, find b².'],
        '16',
        ['b²=a²−c²=25−9=16。', 'b²=a²−c²=25−9=16.'],
        ['34', '4', '9'],
      ),
      N(
        [
          'P(0,4)到F1(−3,0)、F2(3,0)的距离和是多少？',
          'Find the sum of distances from P(0,4) to F1(−3,0),F2(3,0).',
        ],
        '10',
        [
          '每段sqrt(3²+4²)=5，距离和10而非焦距6。',
          'Each distance is sqrt(3²+4²)=5; the sum is ten, not focal separation six.',
        ],
        ['5', '6', '8'],
      ),
      P(
        [
          '椭圆x²/9+y²/25=1在正y轴方向的焦点坐标是什么？',
          'Find the positive-y focus of x²/9+y²/25=1.',
        ],
        '(0,4)',
        [
          '长轴沿y，a²=25,b²=9，c=4，正焦点(0,4)。',
          'The major axis is vertical; a²=25,b²=9,c=4, giving (0,4).',
        ],
        ['(4,0)', '(0,5)', '(0,3)'],
      ),
      Q(
        [
          '中心(1,−2)，水平长轴，a=5、c=3的椭圆方程是什么？',
          'Find the ellipse centred at (1,−2) with horizontal major axis, a=5,c=3.',
        ],
        '(x-1)^2/25+(y+2)^2/16=1',
        [
          '用中心位移，b²=25−9=16，正号相加。',
          'Use coordinate differences from the centre and b²=25−9=16, with a sum of squares.',
        ],
        [
          '(x+1)^2/25+(y-2)^2/16=1',
          '(x-1)^2/25-(y+2)^2/16=1',
          '(x-1)^2/16+(y+2)^2/25=1',
        ],
      ),
      E(
        [
          '焦点F1(−3,0)、F2(3,0)，距离和10。分别检查P(5,0)与Q(0,4)，说明究竟什么不变，并给长短半轴。',
          'With foci (−3,0),(3,0) and sum ten, check P(5,0) and Q(0,4). State the invariant and give both semi-axis lengths.',
        ],
        [
          'P的两距离为8和2；Q的两距离均5。单个距离改变，但和均10=2a，故a=5，c=3，b=√(25−9)=4。方程x²/25+y²/16=1；长轴全长10、短轴全长8，不能把半轴当全轴。',
          'At P the distances are eight and two; at Q both are five. Individual distances change but their sum stays ten=2a. Thus a=5,c=3,b=√(25−9)=4, giving x²/25+y²/16=1. Full axis lengths are ten and eight; a and b are half-lengths.',
        ],
      ),
    ],
    pick: {
      stem: [
        '两不同焦点间距2c，非退化椭圆的距离和2a需满足什么？',
        'With distinct foci separated by 2c, what condition must a nondegenerate ellipse’s sum 2a satisfy?',
      ],
      correct: 2,
      options: [
        ['2a<2c', '2a<2c'],
        ['2a=2c', '2a=2c'],
        ['2a>2c', '2a>2c'],
      ],
      feedback: [
        [
          '三角不等式禁止距离和小于焦距。',
          'The triangle inequality forbids a sum smaller than focal separation.',
        ],
        [
          '等号退化成两焦点间的线段，不能形成非退化椭圆。',
          'Equality produces the segment between the foci, not a nondegenerate ellipse.',
        ],
        ['严格大于焦距，b²=a²−c²>0。', 'Strict inequality gives b²=a²−c²>0.'],
      ],
    },
    reason: [
      '两焦点间距6时，距离和4、6、10各给什么轨迹？',
      'For foci six units apart, what loci have distance sums four, six and ten?',
    ],
    rubric: [
      '由三角不等式PF1+PF2≥6：和4无点；和6仅为连接两焦点的闭线段；和10>6为非退化椭圆。不能把三个条件都画成椭圆。',
      'The triangle inequality gives a sum at least six: sum four is empty, sum six is the closed segment joining the foci, and sum ten gives a nondegenerate ellipse. They cannot all be ellipses.',
    ],
    prompts: [
      [
        '沿轨迹换一个点，哪一段变了，哪个总量没变？',
        'Move to another point: which segment changes and which total stays fixed?',
      ],
      [
        '若两个焦点重合，固定距离和会变成什么熟悉图形？',
        'If the foci coincide, what familiar shape has the fixed sum?',
      ],
    ],
    misconception: [
      '椭圆固定的是距离和2a，不是每段距离或焦距2c。',
      'An ellipse fixes sum 2a, not each distance or focal separation 2c.',
    ],
  },
  {
    title: ['双曲线的几何定义', 'Geometric definition of hyperbolas'],
    objective: [
      '用到两焦点距离的绝对差解释双曲线两支及非退化条件。',
      'Explain both hyperbola branches and nondegeneracy using an absolute difference of focal distances.',
    ],
    hook: [
      '左右两支都满足同一个距离条件，为什么必须写绝对值？',
      'Why does one distance condition for both branches need an absolute value?',
    ],
    prerequisites: ['H22-L05', 'H22-L02', 'J71-L02'],
    keywords: [
      ['绝对距离差', 'absolute distance difference'],
      ['两支', 'two branches'],
      ['实轴', 'transverse axis'],
    ],
    lab: 'conic-hyperbola',
    hints: [
      [
        '|PF1−PF2|=2a，焦距2c；须0<a<c。标签顺序不变时，换支会反转有向差。',
        '|PF1−PF2|=2a with focal separation 2c and 0<a<c. Keeping focus labels fixed reverses the signed difference between branches.',
      ],
      [
        '沿实轴的平方项为正，分母a²；负项分母b²=c²−a²。',
        'The transverse-axis squared term is positive over a²; the negative term has denominator b²=c²−a².',
      ],
    ],
    items: [
      Q(
        [
          '焦点(−5,0)、(5,0)，绝对距离差6的双曲线方程是什么？',
          'Find the hyperbola with foci (−5,0),(5,0) and absolute distance difference six.',
        ],
        'x^2/9-y^2/16=1',
        [
          'a=3,c=5，b²=25−9=16；实轴水平，x²项为正。',
          'a=3,c=5,b²=25−9=16; the transverse axis is horizontal so x² is positive.',
        ],
        ['x^2/9+y^2/16=1', 'x^2/25-y^2/9=1', 'y^2/9-x^2/16=1'],
      ),
      N(
        ['双曲线a=3、c=5，求b²。', 'For a hyperbola with a=3,c=5, find b².'],
        '16',
        [
          'c²=a²+b²，故b²=25−9=16，不用椭圆的c²=a²−b²关系。',
          'c²=a²+b², so b²=25−9=16; do not reuse the ellipse’s c²=a²−b² relation.',
        ],
        ['34', '4', '-16'],
      ),
      N(
        [
          'F1(−5,0)、F2(5,0)，P(−3,0)的有向距离差PF1−PF2是多少？',
          'For F1(−5,0),F2(5,0), find signed difference PF1−PF2 at P(−3,0).',
        ],
        '-6',
        [
          'PF1=2，PF2=8，有向差2−8=−6。',
          'PF1=2 and PF2=8, giving signed difference −6.',
        ],
        ['6', '10', '2'],
      ),
      N(
        [
          'F1(−5,0)、F2(5,0)，P(3,0)的绝对距离差是多少？',
          'For F1(−5,0),F2(5,0), find the absolute distance difference at P(3,0).',
        ],
        '6',
        [
          'PF1=8，PF2=2，|8−2|=6；焦距10不是常数差。',
          'PF1=8,PF2=2, so |8−2|=6; focal separation ten is not this difference.',
        ],
        ['-6', '10', '8'],
      ),
      P(
        [
          '双曲线y²/9−x²/16=1在正y轴方向的焦点坐标是什么？',
          'Find the positive-y focus of y²/9−x²/16=1.',
        ],
        '(0,5)',
        [
          '实轴竖直，a²=9,b²=16，c²=25，焦点(0,5)。',
          'The transverse axis is vertical; a²=9,b²=16,c²=25, giving (0,5).',
        ],
        ['(5,0)', '(0,3)', '(0,4)'],
      ),
      E(
        [
          '焦点(−5,0)、(5,0)。解释绝对距离差为12、10、0、6时各是什么轨迹，指出哪一种是本课非退化双曲线。',
          'For foci (−5,0),(5,0), describe loci with absolute difference 12,10,0,6 and identify the nondegenerate hyperbola.',
        ],
        [
          '反三角不等式给|PF1−PF2|≤10。12为空；10等号仅在焦点连线上、闭线段外侧的两条射线（含焦点），不是整条直线；0是垂直平分线x=0。只有0<6<10给两支非退化双曲线，a=3,c=5，方程x²/9−y²/16=1。',
          'The reverse triangle inequality bounds the absolute difference by ten. Twelve is empty; equality ten gives the two outer rays along the focal line, including the foci, not the whole line. Zero gives perpendicular bisector x=0. Only 0<6<10 gives a nondegenerate two-branch hyperbola, with a=3,c=5 and x²/9−y²/16=1.',
        ],
      ),
    ],
    pick: {
      stem: [
        '两不同焦点间距2c，非退化双曲线的绝对差2a满足什么？',
        'For distinct foci separated by 2c, what condition holds for a nondegenerate hyperbola’s absolute difference 2a?',
      ],
      correct: 0,
      options: [
        ['0<2a<2c', '0<2a<2c'],
        ['2a>2c', '2a>2c'],
        ['2a=2c', '2a=2c'],
      ],
      feedback: [
        [
          '严格在0与焦距之间，b²=c²−a²>0。',
          'Strictly between zero and focal separation, giving b²=c²−a²>0.',
        ],
        [
          '绝对距离差不能超过两焦点间距。',
          'An absolute distance difference cannot exceed focal separation.',
        ],
        [
          '等号退化成外侧两射线，不是非退化双曲线。',
          'Equality gives two outer rays, a degenerate case.',
        ],
      ],
    },
    reason: [
      '用F1(−5,0)、F2(5,0)和两顶点(3,0)、(−3,0)，解释去掉绝对值为什么会丢掉一支。',
      'Use foci (−5,0),(5,0) and vertices (3,0),(−3,0) to explain why removing the absolute value loses one branch.',
    ],
    rubric: [
      '右顶点距离8、2，PF1−PF2=6；左顶点距离2、8，差−6。两者绝对差均6。只写PF1−PF2=6排除了左支，而交换焦点标签只交换哪一支被保留。',
      'At the right vertex distances are eight and two, giving +6; at the left they are two and eight, giving −6. Both absolute differences are six. Writing only PF1−PF2=6 excludes the left branch; swapping labels merely swaps the retained branch.',
    ],
    prompts: [
      [
        '先给F1、F2固定名字，再换支算差。',
        'Fix focus labels before switching branches and subtracting.',
      ],
      [
        '把椭圆距离和10与双曲线绝对差6放在同一焦距条件下比较。',
        'Compare an ellipse sum and a hyperbola absolute difference while keeping focal separation explicit.',
      ],
    ],
    misconception: [
      '双曲线固定绝对差，不能把焦距当常数差或套用椭圆的加号。',
      'A hyperbola fixes an absolute difference; focal separation is different, and the equation uses a difference rather than an ellipse’s sum.',
    ],
  },
];
function question(id: string, i: number, item: Item): Question {
  const s = specs[i]!,
    skill = `analytic-${i + 1}`;
  if (item.answer.kind === 'explain')
    return reasoning(
      id,
      T(item.stem),
      skill,
      item.answer.rubric,
      s.hints.map(T),
    );
  const value = 'value' in item.answer ? String(item.answer.value) : '',
    q = numeric(
      id,
      T(item.stem),
      value,
      skill,
      s.hints.map(T),
      [T(s.hints[0]!), T(item.step)],
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
    `analytic-${i + 1}`,
    p.options.map((text, j) => ({
      text: T(text),
      feedback: T(p.feedback[j]!),
    })),
    s.hints.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const h22Lessons: Lesson[] = specs.map((s, i) => {
  const id = `H22-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    hook: T(s.hook),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: 20,
    lab: s.lab,
    stage: 'H11',
    unit: 'H22',
    order: i + 1,
    nzYearHints: [11, 12],
    cnGradeHints: [11],
    contentStatus: 'ready',
    skillTags: [`analytic-${i + 1}`],
    guided: question(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i),
      ...s.items.slice(1, 5).map((v, j) => question(`${id}-Q${j + 2}`, i, v)),
      reasoning(
        `${id}-Q6`,
        T(s.reason),
        `analytic-${i + 1}`,
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
export function h22ReviewQuestion(id: string, round: number): Question {
  if (
    !/^H22-L0[1-6]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid H22 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 24,
    h = -2 + (k % 4),
    v = -2 + (Math.floor(k / 4) % 3),
    axis = k % 2 === 0 ? ('horizontal' as const) : ('vertical' as const);
  let item: Item;
  if (i === 0) {
    const m = 1 + Math.floor(k / 4),
      b = -2 + (k % 4);
    item = Q(
      [
        `写出经过(0,${b})、斜率${m}的直线方程。`,
        `Write the line through (0,${b}) with slope ${m}.`,
      ],
      `y=${m}x+(${b})`,
      [
        '点斜式后展开，代点核对。',
        'Use point-slope form and verify the point.',
      ],
      ['x=999', 'y=999'],
    );
  } else if (i === 1) {
    const c = -5 - Math.floor(k / 12),
      l = planeLine(3, 4, c),
      p = cp(h, v);
    item =
      k % 2 === 0
        ? R(
            [
              `求(${h},${v})到3x+4y+(${c})=0的精确距离。`,
              `Find exact distance from (${h},${v}) to 3x+4y+(${c})=0.`,
            ],
            `sqrt(${textR(lineDistanceSquare(l, p))})`,
            [
              '用非零法向量长度归一化并取绝对值。',
              'Normalise by normal length and take absolute value.',
            ],
            ['999', '-999'],
          )
        : P(
            [
              `求(${h},${v})到3x+4y+(${c})=0的垂足坐标。`,
              `Find the foot from (${h},${v}) to 3x+4y+(${c})=0.`,
            ],
            coordinateText(projectionFoot(l, p)),
            [
              '沿法向量扣去投影，再核对在线上。',
              'Subtract the normal projection and verify incidence.',
            ],
            ['(999,999)', '(-999,999)'],
          );
  } else if (i === 2) {
    const r = 1 + Math.floor(k / 12);
    item = Q(
      [
        `圆心(${h},${v})、半径${r}，写圆方程。`,
        `Write the circle centred at (${h},${v}) with radius ${r}.`,
      ],
      `(x-(${h}))^2+(y-(${v}))^2=${r * r}`,
      [
        '半径平方与两项坐标差平方相等。',
        'The sum of squared coordinate differences equals radius squared.',
      ],
      ['x=999', 'y=999'],
    );
  } else if (i === 3) {
    const p = k < 12 ? '1' : '-1',
      m = parabolaModel(h, v, p, axis);
    item = Q(
      [
        `顶点(${h},${v})，${axis === 'horizontal' ? '水平' : '竖直'}轴，按4p约定p=${p}，写抛物线方程。`,
        `Write the parabola with vertex (${h},${v}), ${axis} axis and p=${p} under the 4p convention.`,
      ],
      m.equation,
      [
        '沿轴项系数4p，另一位移平方。',
        'Use coefficient 4p on the axial displacement and square the other.',
      ],
      ['x=999', 'y=999'],
    );
  } else {
    const kind = i === 4 ? 'ellipse' : 'hyperbola',
      index = Math.floor(k / 8) % 3,
      m = focalModel(kind, h, v, index, axis),
      trace = k % 2 === 0 ? '0' : '1/2',
      s = conicPoint(m, trace, k < 12 ? 1 : -1);
    item =
      k % 3 === 0
        ? N(
            [
              `${kind === 'ellipse' ? '椭圆' : '双曲线'}a=${textR(m.a)},c=${textR(m.c)}；求${kind === 'ellipse' ? '距离和' : '绝对距离差'}。中心(${h},${v})、${axis === 'horizontal' ? '水平' : '竖直'}轴。`,
              `For an ${kind} with a=${textR(m.a)},c=${textR(m.c)}, centre (${h},${v}) and ${axis} axis, find its ${kind === 'ellipse' ? 'focal distance sum' : 'absolute focal distance difference'}.`,
            ],
            textR(s.constant),
            [
              '常数为2a，与中心、方向和描点位置无关。',
              'The constant is 2a, independent of centre, orientation and trace point.',
            ],
            ['999', '-999'],
          )
        : Q(
            [
              `${kind === 'ellipse' ? '椭圆' : '双曲线'}中心(${h},${v})，${axis === 'horizontal' ? '水平' : '竖直'}${kind === 'ellipse' ? '长轴' : '实轴'}，a=${textR(m.a)},c=${textR(m.c)}，写方程。`,
              `Write the ${kind} centred at (${h},${v}), with ${axis} ${kind === 'ellipse' ? 'major' : 'transverse'} axis, a=${textR(m.a)},c=${textR(m.c)}.`,
            ],
            m.equation,
            [
              '先求b²，按焦点轴放置a²，并核对加减号。',
              'Find b², place a² on the focal axis and check the plus or minus sign.',
            ],
            ['x=999', 'y=999'],
          );
  }
  return question(`${id}-R${round}`, i, item);
}
export const h22CheckQuestions: Question[] = [
  ...specs.map((s, i) => question(`H22-CHECK-Q${i + 1}`, i, s.items[0]!)),
  question('H22-CHECK-Q7', 3, specs[3]!.items[5]!),
  question('H22-CHECK-Q8', 5, specs[5]!.items[5]!),
];
