import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import { exactRootText } from '../pythagoreanModels';
import { readRational } from '../rationalModels';
import type { GeometryClass } from '../planeModels';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Mode =
  'coordinate' | 'number' | 'root' | 'class' | 'insufficient' | 'explain';
type Item = {
  stem: Pair;
  value: string;
  steps: Pair[];
  wrong: string[];
  mode: Mode;
  square?: string;
  accepted?: string[];
  unit?: 'cm' | 'cm²' | '°';
  diagram?: Question['diagram'];
};
const I = (
  stem: Pair,
  value: string,
  steps: Pair[],
  wrong: string[],
  mode: Mode = 'coordinate',
): Item => ({ stem, value, steps, wrong, mode });
const R = (
  stem: Pair,
  square: string,
  steps: Pair[],
  wrong: string[],
  accepted: string[] = [],
): Item => ({
  ...I(stem, exactRootText(readRational(square)), steps, wrong, 'root'),
  square,
  accepted,
});
const N = (
  stem: Pair,
  value: string,
  steps: Pair[],
  wrong: string[],
  unit?: Item['unit'],
): Item => ({ ...I(stem, value, steps, wrong, 'number'), unit });
const M = (stem: Pair, rubric: Pair): Item =>
  I(stem, '', [rubric], [], 'explain');
type Pick = { stem: Pair; options: Pair[]; feedback: Pair[]; correct: number };
type Spec = {
  title: Pair;
  objective: Pair;
  prerequisites: string[];
  keywords: Pair[];
  lab: Lesson['lab'];
  hook: Pair;
  items: Item[];
  pick: Pick;
  reason: Pair;
  rubric: Pair;
  misconception: Pair;
  prompts: Pair[];
};
const skills = [
  'translation-reflection-reference',
  'rotation-centre-and-direction',
  'pythagorean-area-dissection',
  'right-triangle-exact-length',
  'pythagorean-converse-validity',
];
const hints: Pair[][] = [
  [
    [
      '先说平移向量或反射轴，再处理两个坐标；不只看图朝哪边。',
      'State the vector or mirror line before changing coordinates, rather than guessing from appearance.',
    ],
    [
      '平移同加对应分量；对轴反射只改变垂直于轴的有向距离。x=1 不等于 y 轴，y=x 则交换坐标。',
      'Translation adds matching components; reflection reverses signed perpendicular distance. x=1 differs from the y axis; y=x swaps coordinates.',
    ],
  ],
  [
    [
      '写中心、方向与角度；先求点相对中心的位移。',
      'State centre, direction and angle; first find displacement from the centre.',
    ],
    [
      '绕原点逆时针九十度 (x,y)→(−y,x)；非原点先减中心再转、最后加回。半转的中心是点与像的中点。',
      'At the origin, 90° anticlockwise gives (-y,x). For another centre, subtract, rotate, then add back. A half-turn centre is the midpoint of point and image.',
    ],
  ],
  [
    [
      '直角前提先明确；两直角边 a/b、斜边 c 不混用。',
      'Establish the right-angle premise and identify legs a/b and hypotenuse c.',
    ],
    [
      '同一个外正方形减同样四块，比较 c² 与 a²+b²；需说明空白是正方形，不只说像。',
      'Subtract the same four pieces from the same outer square, comparing c² and a²+b². Justify square gaps rather than relying on appearance.',
    ],
  ],
  [
    [
      '先认最长斜边及直角。求斜边平方相加，求另一直角边用斜边平方减已知腿平方。',
      'Identify the hypotenuse and right angle. Add leg squares for the hypotenuse; subtract a known leg square from the hypotenuse square for a missing leg.',
    ],
    [
      '长度取非负平方根；面积单位不能当长度，精确根式不以截断小数替代，情境单位先统一。',
      'Take the nonnegative square root for length. Keep area/length units distinct, retain exact roots and unify units.',
    ],
  ],
  [
    [
      '先核三正边及两短边和大于长边，再排序取最长边 c。',
      'Check positive sides and the strict triangle inequality before taking the longest as c.',
    ],
    [
      '逆定理用 a²+b²=c² 推直角；不相等只先排除直角。若再分锐/钝，要使用夹角与对边的比较性质。',
      'The converse uses a²+b²=c² to establish a right angle. Inequality first excludes rightness; acute/obtuse classification additionally uses the hinge/side comparison property.',
    ],
  ],
];
function q(id: string, i: number, item: Item): Question {
  if (item.mode === 'explain')
    return {
      ...reasoning(
        id,
        T(item.stem),
        skills[i]!,
        T(item.steps[0]!),
        hints[i]!.map(T),
      ),
      diagram: item.diagram,
    };
  const answer: AnswerSpec =
    item.mode === 'coordinate'
      ? { kind: 'coordinate', value: item.value }
      : item.mode === 'root'
        ? { kind: 'root-length', value: item.value, square: item.square! }
        : item.mode === 'class'
          ? { kind: 'geometry-class', value: item.value as GeometryClass }
          : item.mode === 'insufficient'
            ? { kind: 'proof-verdict', value: 'insufficient' }
            : {
                kind: 'number',
                value: item.value,
                unit: item.unit,
                formats: ['decimal', 'fraction'],
              };
  const r = numeric(
    id,
    T(item.stem),
    item.value,
    skills[i]!,
    hints[i]!.map(T),
    [...item.steps.map(T), T(hints[i]![1]!)],
    { accepted: [item.value, ...(item.accepted ?? [])], rejected: item.wrong },
    item.diagram,
  );
  r.answer = answer;
  r.misconceptionTags = [
    skills[i]!,
    'reference-and-premises',
    'exact-length-not-area',
  ];
  return r;
}
const pick = (id: string, i: number, p: Pick) =>
  choice(
    id,
    T(p.stem),
    p.correct,
    skills[i]!,
    p.options.map((o, j) => ({ text: T(o), feedback: T(p.feedback[j]!) })),
    hints[i]!.map(T),
    [T(p.feedback[p.correct]!)],
  );
const specs: Spec[] = [
  {
    title: ['平移与反射', 'Translation and reflection'],
    objective: [
      '用明确向量或反射轴求像点，说明长度与角度保持。',
      'Find image points using a specified vector or mirror line and explain preserved lengths/angles.',
    ],
    prerequisites: ['J75-L02', 'J86-L01', 'J71-L01'],
    keywords: [
      ['平移向量', 'translation vector'],
      ['反射轴', 'mirror line'],
      ['像点', 'image point'],
    ],
    lab: 'pyth-translate',
    hook: [
      '向右三、向下二，与把所有坐标都改号，是同一种变换吗？',
      'Is moving right three and down two the same as negating every coordinate?',
    ],
    items: [
      I(
        [
          'P(−2,1) 平移向量 (3,−2)，求像点 (x,y)。',
          'Translate P(-2,1) by vector (3,-2). Give the image (x,y).',
        ],
        '(1,-1)',
        [
          [
            '横坐标 −2+3=1，纵坐标 1−2=−1。',
            'Add components: -2+3=1 and 1-2=-1.',
          ],
          [
            '每点都用同一向量，不是只移动一个顶点。',
            'Every point uses the same vector, not just one vertex.',
          ],
        ],
        ['(-5,3)', '(1,3)', '(-1,1)'],
      ),
      I(
        [
          'P(−3,2) 对 x 轴反射，求像点。',
          'Reflect P(-3,2) in the x axis. Give the image.',
        ],
        '(-3,-2)',
        [
          [
            '到 x 轴的有向距离反向，x 保持，y 改号。',
            'Reverse signed distance from the x axis: retain x and negate y.',
          ],
        ],
        ['(3,2)', '(3,-2)', '(-2,-3)'],
      ),
      I(
        [
          'P(2,−1) 对 y 轴反射，求像点。',
          'Reflect P(2,-1) in the y axis. Give the image.',
        ],
        '(-2,-1)',
        [
          [
            'y 轴反射改 x，不改 y。',
            'Reflection in the y axis negates x and retains y.',
          ],
        ],
        ['(2,1)', '(-2,1)', '(-1,2)'],
      ),
      I(
        [
          'P(4,−2) 对直线 x=1 反射，求像点。',
          'Reflect P(4,-2) in the line x=1. Give the image.',
        ],
        '(-2,-2)',
        [
          [
            '四在轴右三单位，像在轴左三单位，x′=1−3=−2。',
            'Four lies three units right of the mirror; its image is three left, x′=1-3=-2.',
          ],
          [
            'y 保持负二，不把该轴误当 x=0。',
            'Keep y=-2; this mirror is not x=0.',
          ],
        ],
        ['(-4,-2)', '(4,2)', '(2,-2)'],
      ),
      N(
        [
          '线段 AB=5 cm，整图平移后 A′B′ 长多少？',
          'AB=5 cm. After translating the whole figure, what is A′B′?',
        ],
        '5',
        [
          [
            '平移保距离，向量大小不加到边长上。',
            'Translation preserves distance; its magnitude is not added to a side length.',
          ],
        ],
        ['10', '0', '3'],
        'cm',
      ),
      I(
        [
          'P(1/2,−3) 对 y=x 反射，写精确像点。',
          'Reflect P(1/2,-3) in y=x. Give the exact image.',
        ],
        '(-3,1/2)',
        [
          [
            '对 y=x 反射交换横纵坐标，符号跟随原值。',
            'Reflection in y=x swaps coordinates, retaining each value’s sign.',
          ],
        ],
        ['(3,-1/2)', '(1/2,3)', '(-1/2,-3)'],
      ),
    ],
    pick: {
      stem: [
        '对 x 轴反射，哪条坐标规则正确？',
        'Which rule reflects in the x axis?',
      ],
      options: [
        ['(x,y)→(−x,y)', '(x,y)→(-x,y)'],
        ['(x,y)→(x,−y)', '(x,y)→(x,-y)'],
        ['(x,y)→(−x,−y)', '(x,y)→(-x,-y)'],
      ],
      feedback: [
        ['这是 y 轴反射。', 'This reflects in the y axis.'],
        [
          '横坐标保持，纵向有向距离反向。',
          'x remains fixed while vertical signed distance reverses.',
        ],
        [
          '这是绕原点半转，不是单轴反射。',
          'This is a half-turn about the origin, not an axis reflection.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '说明平移和反射都保长保角，但反射改变朝向；用 x=1 的例子解释为何不能套 x→−x。',
      'Explain preserved lengths/angles and reflected orientation, using x=1 to show why x→-x is not universal.',
    ],
    rubric: [
      '平移各点同加向量，差向量不变，距离与角保持；反射各点到轴的垂直距离相等、分居两侧，长度角度保持而朝向反转。x=1 时 x′=2−x，不是 −x；四映到负二，与一的中点一致。轴上点保持不动，不能把任意轴都当坐标原点。家长核参照轴与具体点。',
      'Translation adds one vector to every point, preserving differences and lengths/angles. Reflection gives equal perpendicular distances on opposite sides, preserving lengths/angles while reversing orientation. For x=1, x′=2-x: four maps to minus two with midpoint one, not to minus four. Points on the mirror stay fixed. Review the reference line and concrete mapping.',
    ],
    misconception: [
      '反射轴认反、平移向量加到长度、非原点轴仍直接改号。',
      'Swapping mirror axes, adding translation to lengths or negating about a non-origin mirror.',
    ],
    prompts: [
      ['这个轴上哪个坐标固定？', 'Which coordinate is fixed on this mirror?'],
      [
        '点与像的中点在哪条线上？',
        'On which line is the midpoint of point and image?',
      ],
    ],
  },
  {
    title: ['旋转与中心对称', 'Rotation and point symmetry'],
    objective: [
      '以中心、方向和角度求旋转像，并用中点解释半转中心对称。',
      'Find a rotation image from centre/direction/angle and explain half-turn symmetry through midpoints.',
    ],
    prerequisites: ['J87-L01', 'J86-L01', 'J75-L01'],
    keywords: [
      ['旋转中心', 'rotation centre'],
      ['旋转方向', 'rotation direction'],
      ['中心对称', 'point symmetry'],
    ],
    lab: 'pyth-rotate',
    hook: [
      '绕 (1,1) 旋转，应该先看点离原点还是离这个中心多远？',
      'For rotation about (1,1), should displacement be measured from the origin or that centre?',
    ],
    items: [
      I(
        [
          'P(2,1) 绕原点逆时针 90°，求像点。',
          'Rotate P(2,1) 90° anticlockwise about the origin. Give the image.',
        ],
        '(-1,2)',
        [
          [
            '(x,y)→(−y,x)，故 (2,1)→(−1,2)。',
            'Use (-y,x): (2,1) maps to (-1,2).',
          ],
        ],
        ['(1,-2)', '(-2,-1)', '(1,2)'],
      ),
      I(
        [
          'P(2,1) 绕原点顺时针 90°，求像点。',
          'Rotate P(2,1) 90° clockwise about the origin. Give the image.',
        ],
        '(1,-2)',
        [
          [
            '顺时针九十度为 (y,−x)，不同于逆时针。',
            'Clockwise ninety gives (y,-x), different from anticlockwise.',
          ],
        ],
        ['(-1,2)', '(-2,-1)', '(-1,-2)'],
      ),
      I(
        [
          'P(3,−1) 关于中心 O(1,1) 作中心对称（180°），求像点。',
          'Give the half-turn image of P(3,-1) about O(1,1).',
        ],
        '(-1,3)',
        [
          [
            '中心是点像中点，P′=(2×1−3,2×1−(−1))。',
            'The centre is the midpoint: P′=(2×1-3,2×1-(-1)).',
          ],
        ],
        ['(-3,1)', '(1,-3)', '(3,1)'],
      ),
      I(
        [
          '半转把 P(−2,4) 变成 P′(4,−2)，求旋转中心。',
          'A half-turn maps P(-2,4) to P′(4,-2). Find its centre.',
        ],
        '(1,1)',
        [
          [
            '取点像中点 ((−2+4)/2,(4−2)/2)=(1,1)。',
            'Take the midpoint: ((-2+4)/2,(4-2)/2)=(1,1).',
          ],
        ],
        ['(2,2)', '(0,0)', '(6,-6)'],
      ),
      N(
        [
          '一个角 120°，整个图形旋转 180° 后对应角多少？',
          'An angle is 120°. After rotating the whole figure by 180°, what is its corresponding angle?',
        ],
        '120',
        [
          [
            '旋转保角，旋转角度不加到原图内角。',
            'Rotation preserves angles; the rotation amount is not added to an interior angle.',
          ],
        ],
        ['300', '60', '180'],
        '°',
      ),
      I(
        [
          'P(2,1) 绕 O(1,1) 逆时针 90°，求像点。',
          'Rotate P(2,1) 90° anticlockwise about O(1,1). Give the image.',
        ],
        '(1,2)',
        [
          [
            '相对中心为 (1,0)，转为 (0,1)，加回中心得 (1,2)。',
            'Relative displacement (1,0) becomes (0,1); add the centre back to get (1,2).',
          ],
        ],
        ['(-1,2)', '(1,0)', '(2,1)'],
      ),
    ],
    pick: {
      stem: [
        '关于 O 的中心对称与什么变换相同？',
        'Point symmetry about O is the same as which transformation?',
      ],
      options: [
        ['绕 O 旋转 180°', 'A 180° rotation about O'],
        [
          '对任意一条过 O 的直线反射一次',
          'One reflection in any line through O',
        ],
        [
          '绕原点旋转 180°，不管 O 在哪',
          'A half-turn about the origin regardless of O',
        ],
      ],
      feedback: [
        [
          'O 是点与像的中点，半转距离保持。',
          'O is the midpoint and the half-turn preserves distance.',
        ],
        [
          '单轴反射通常不是半转，轴上所有点不动。',
          'One line reflection usually differs from a half-turn; every mirror-line point stays fixed.',
        ],
        [
          '中心必须用指定 O，不能换成原点。',
          'Use the specified O rather than replacing it with the origin.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '解释非原点旋转的减中心、转位移、加中心，并说明同中心两次半转为何回原位。',
      'Explain subtracting the centre, rotating displacement and adding back, and why two half-turns return a point.',
    ],
    rubric: [
      '先用 P−O 得相对位移，按明确方向角度旋转，再加 O。半转使位移变负，P′=2O−P，所以 O 为中点；再半转 P″=2O−(2O−P)=P。只有 O=原点时才直接改两个坐标号。旋转保持长度、角度和朝向，不能把转角加在图形内角上。',
      'Use P-O, rotate that displacement, then add O. A half-turn negates displacement: P′=2O-P, with midpoint O. Repeating gives P″=2O-(2O-P)=P. Direct coordinate negation works only for the origin. Rotation preserves lengths, angles and orientation; its angle is not added to a figure’s interior angles.',
    ],
    misconception: [
      '中心默认原点、顺逆混用、转角加到内角、半转误当单轴反射。',
      'Assuming the origin, mixing directions, adding rotation to an interior angle or confusing a half-turn with one mirror.',
    ],
    prompts: [
      [
        '你现在算的是相对哪个点的坐标？',
        'Relative to which point are you calculating?',
      ],
      ['中心是 P 与 P′ 的中点吗？', 'Is the centre the midpoint of P and P′?'],
    ],
  },
  {
    title: ['勾股定理的拼图证明', 'Visual proof of Pythagoras'],
    objective: [
      '用同一外正方形减同样四块的面积守恒，证明直角边平方和等于斜边平方。',
      'Prove the right-triangle square identity by subtracting the same four pieces from one outer square.',
    ],
    prerequisites: ['P56-L02', 'P56-L03', 'J86-L02'],
    keywords: [
      ['面积守恒', 'area conservation'],
      ['斜边', 'hypotenuse'],
      ['勾股定理', 'Pythagoras'],
    ],
    lab: 'pyth-proof',
    hook: [
      '四块三角形只移动不变大小，两种空白面积为什么必须相等？',
      'If four triangles move without resizing, why must two uncovered areas be equal?',
    ],
    items: [
      {
        ...N(
          [
            '给定直角三角形直角边 3 cm、4 cm，斜边上的正方形面积 c² 是多少 cm²？',
            'A right triangle has legs 3 cm,4 cm. Find the hypotenuse square’s area c² in cm².',
          ],
          '25',
          [
            [
              'c²=3²+4²=9+16=25；问面积，不是斜边长度五。',
              'c²=3²+4²=9+16=25; this asks for area rather than the length five.',
            ],
          ],
          ['5', '7', '49'],
          'cm²',
        ),
        diagram: {
          kind: 'pythagorean-dissection',
          a: 3,
          b: 4,
          rearranged: true,
        },
      },
      R(
        [
          '直角边 5 cm、12 cm，求精确斜边长度，不附单位。',
          'The legs are 5 cm,12 cm. Find the exact hypotenuse length without units.',
        ],
        '169',
        [
          [
            'c²=25+144=169，长度为非负根十三厘米。',
            'c²=25+144=169, so the nonnegative length is thirteen centimetres.',
          ],
        ],
        ['169', '17', '-13'],
      ),
      N(
        [
          '四块直角边 2 cm、3 cm 的三角形放进边长 5 cm 的外正方形，未覆盖面积多少 cm²？',
          'Four right triangles with legs 2 cm,3 cm occupy a square of side 5 cm. Find the uncovered area in cm².',
        ],
        '13',
        [
          [
            '外面积二十五，每块面积三，四块十二，剩十三。',
            'Outer area twenty-five minus four triangles of area three leaves thirteen.',
          ],
        ],
        ['12', '25', '5'],
        'cm²',
      ),
      M(
        [
          '拼图中间四边形的边都等于 c，为什么还需证明它的角是直角？说明依据。',
          'Why is equal side length c insufficient to call the central gap a square? Justify its right angles.',
        ],
        [
          '等边四边形还可能为非直角菱形。直角三角形两锐角 α+β=90°，中心每个内角与相邻 α/β 共平角，故为 180−90=90°；四边为斜边 c，才是正方形。另一排法两个空白也是由直角边构造的正方形。家长核角依据与无重叠，而非图像像方形。',
          'Equal sides could make a non-square rhombus. The right triangle’s acute angles satisfy α+β=90°. Each central interior angle supplements adjacent α/β, so is 90°. Together with four sides c this establishes a square. The other gaps use perpendicular legs to form squares. Check angle reasons and non-overlap rather than appearance.',
        ],
      ),
      I(
        [
          '仅知一个三角形两边 a、b，没有给直角，能否直接用 a²+b² 求第三边平方？写 sufficient/insufficient。',
          'Only two triangle sides a,b are supplied without a right angle. Is that sufficient to use a²+b² as the third side’s square?',
        ],
        'insufficient',
        [
          [
            '勾股定理须先有直角与正确斜边身份，不能给任意三角形套用。',
            'Pythagoras requires a right angle and the correct hypotenuse, not an arbitrary triangle.',
          ],
        ],
        ['sufficient', 'congruent'],
        'insufficient',
      ),
      R(
        [
          '直角边 6 cm、8 cm，求精确斜边长度，不附单位。',
          'The legs are 6 cm,8 cm. Find the exact hypotenuse length without units.',
        ],
        '100',
        [
          [
            'c²=36+64=100，取非负根得十厘米。',
            'c²=36+64=100, giving the nonnegative length ten centimetres.',
          ],
        ],
        ['100', '14', '-10'],
      ),
    ],
    pick: {
      stem: [
        '勾股定理正确的前提与角色是？',
        'Which premise and side roles correctly state Pythagoras?',
      ],
      options: [
        [
          '任何三角形两边平方和等于第三边平方',
          'Any two squared sides of any triangle sum to the third',
        ],
        [
          '最长边直接等于另外两边的和',
          'The longest side equals the sum of the other sides',
        ],
        [
          '已知直角，两直角边平方和等于斜边平方',
          'A given right angle: leg squares sum to the hypotenuse square',
        ],
      ],
      feedback: [
        [
          '一般三角形不能这样套用。',
          'This is not valid for an arbitrary triangle.',
        ],
        [
          '那会是退化边界，不能构成非退化三角形。',
          'That equality is degenerate, not a valid triangle.',
        ],
        [
          '直角前提、斜边身份与平方单位都正确。',
          'The premise, hypotenuse and squared units are correct.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '说明四块全等三角形重排为何证明 c²=a²+b²，并区分面积结论与长度开方。',
      'Explain why rearranging four congruent triangles proves c²=a²+b², distinguishing area from taking a length root.',
    ],
    rubric: [
      '两图外边均为 a+b，面积相同；同样四块全等直角三角形各 ab/2，保长角且无重叠/缺块。第一空白四边c且角90故为c²，第二空白为a²、b²，等剩余面积得定理。也可展开(a+b)²−2ab=a²+b²。长度c取非负平方根，不把c²当c，更不能写c=a+b。此证明是一般正a/b的几何与代数论证，不是只验几个样本。',
      'Both outer squares have side a+b and equal area. The same four congruent right triangles each have area ab/2 without overlap or loss. The first gap has sides c and right angles, giving c²; the other gaps give a²+b². Equivalently expand (a+b)²-2ab. Length c is the nonnegative square root, not c² or a+b. This is an argument for general positive a/b, not a finite sample check.',
    ],
    misconception: [
      '方形只看等边不证角、拼块改变大小、c²当c、任意三角形套用。',
      'Calling equal-sided gaps squares without angle proof, resizing pieces, confusing c² with c or applying to arbitrary triangles.',
    ],
    prompts: [
      ['减掉的确实是同样四块吗？', 'Are exactly the same four pieces removed?'],
      ['中间角为何是九十度？', 'Why is a central angle ninety degrees?'],
    ],
  },
  {
    title: ['勾股定理应用', 'Using Pythagoras'],
    objective: [
      '在给定直角与统一单位下求斜边或直角边，保留非负精确根式。',
      'Find a hypotenuse or leg under a justified right angle and common units, retaining nonnegative exact roots.',
    ],
    prerequisites: ['J87-L03', 'P56-L01', 'J75-L02'],
    keywords: [
      ['正平方根', 'nonnegative square root'],
      ['统一单位', 'common units'],
      ['精确值', 'exact value'],
    ],
    lab: 'pyth-apply',
    hook: [
      '边长二和三的矩形对角线不是整数，该怎样精确写长度？',
      'A two-by-three rectangle has a noninteger diagonal. How can its length be written exactly?',
    ],
    items: [
      {
        ...R(
          [
            '虚构矩形边长 3 m、4 m，求精确对角线，不附单位。',
            'A fictional rectangle has sides 3 m,4 m. Find its exact diagonal without units.',
          ],
          '25',
          [
            [
              '矩形提供直角，d²=9+16=25，d=5 m。',
              'A rectangle supplies the right angle: d²=9+16=25, so d=5 m.',
            ],
          ],
          ['7', '25', '-5'],
        ),
        diagram: {
          kind: 'pythagorean-triangle',
          a: '3',
          b: '4',
          rectangle: true,
        },
      },
      {
        ...R(
          [
            '给定直角三角形斜边 13 cm、一条直角边 5 cm，求另一直角边，不附单位。',
            'A right triangle has hypotenuse 13 cm and one leg 5 cm. Find the other leg without units.',
          ],
          '144',
          [
            ['b²=13²−5²=169−25=144，b=12 cm。', 'b²=13²-5²=144, so b=12 cm.'],
            [
              '已知斜边要减，不是加。',
              'With the hypotenuse given, subtract rather than add.',
            ],
          ],
          ['√194', '144', '18', '-12'],
        ),
        diagram: {
          kind: 'pythagorean-triangle',
          a: '5',
          b: '12',
          unknown: 'b',
        },
      },
      {
        ...R(
          [
            '虚构矩形边长 2 m、3 m，求精确对角线。√13 表示平方为十三的非负数，不附单位。',
            'A fictional rectangle has sides 2 m,3 m. Find the exact diagonal. √13 is the nonnegative number squaring to thirteen; omit units.',
          ],
          '13',
          [
            [
              'd²=4+9=13，d=√13 m；3.61 只是近似。',
              'd²=4+9=13, giving √13 m; 3.61 is only approximate.',
            ],
          ],
          ['13', '5', '3.61', '-√13'],
          ['sqrt(13)'],
        ),
        diagram: {
          kind: 'pythagorean-triangle',
          a: '2',
          b: '3',
          rectangle: true,
        },
      },
      R(
        [
          '直角边 3/4 cm、1 cm，求精确斜边，不附单位。',
          'The legs are 3/4 cm and 1 cm. Find the exact hypotenuse without units.',
        ],
        '25/16',
        [
          [
            '平方和 9/16+1=25/16，非负根为 5/4 cm。',
            'The squares sum to 25/16, whose nonnegative root is 5/4 cm.',
          ],
        ],
        ['25/16', '7/4', '-5/4'],
        ['1.25', 'sqrt(25/16)'],
      ),
      R(
        [
          '虚构墙与地面垂直，梯长 5 m、触墙高 4 m，求梯脚离墙距离。不作真实操作建议；只填精确数值。',
          'In a fictional model with vertical wall and perpendicular ground, a 5 m ladder reaches 4 m high. Find the foot’s distance from the wall as an exact value, without units.',
        ],
        '9',
        [
          [
            '梯为斜边，地距平方=25−16=9，距离三米。',
            'The ladder is the hypotenuse: horizontal distance squared is 25-16=9, so three metres.',
          ],
        ],
        ['√41', '9', '1', '-3'],
      ),
      R(
        [
          '平面两轴互相垂直且同长度单位，P(1,2)、Q(4,7)，求两点精确距离，不附单位。',
          'Perpendicular axes use equal length units. Find the exact distance from P(1,2) to Q(4,7), without units.',
        ],
        '34',
        [
          [
            '横差三、纵差五组成直角边，距离平方9+25=34。',
            'Changes three and five form perpendicular legs, giving squared distance 34.',
          ],
        ],
        ['8', '34', '5.83', '-√34'],
      ),
    ],
    pick: {
      stem: [
        '已知直角三角形斜边 c 与一条腿 a，另一腿 b 应怎样求？',
        'Given hypotenuse c and one leg a, how is the other leg b found?',
      ],
      options: [
        ['b²=c²−a²，b 取非负根', 'b²=c²-a², taking the nonnegative root'],
        ['b²=c²+a²', 'b²=c²+a²'],
        ['b=c−a', 'b=c-a'],
      ],
      feedback: [
        [
          '从 a²+b²=c² 移去 a²，边长取非负。',
          'Subtract a² from a²+b²=c² and take a nonnegative length.',
        ],
        [
          '这把已知斜边误作直角边。',
          'This mistakes the given hypotenuse for a leg.',
        ],
        [
          '平方差不同于长度直接相减。',
          'A difference of squares is not direct subtraction of lengths.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '解释为什么矩形二乘三的对角线写 √13，另说明求腿为何减平方及单位为何先统一。',
      'Explain √13 for a two-by-three rectangle, subtraction for a missing leg and prior unit conversion.',
    ],
    rubric: [
      '矩形给直角，斜边平方二平方加三平方等十三，取非负根√13；约3.6055但截断不精确。若斜边已知，求腿用c²−a²而非相加或c−a。长度单位须先统一再平方，平方结果为面积单位，开方才回长度；负根不是距离。给出具体代回平方核验与直角依据，不从图上补直角。',
      'A rectangle supplies a right angle and diagonal square 2²+3²=13, hence nonnegative √13. A truncated decimal is not exact. For a missing leg use c²-a², not addition or c-a. Unify length units before squaring; squares have area units and roots return length. Negative roots are not distances. Review an actual square substitution and the right-angle premise.',
    ],
    misconception: [
      '斜边与腿混用、长度直接相加减、负根当距离、不同单位直接平方、近似冒充精确。',
      'Confusing hypotenuse/legs, adding or subtracting lengths directly, accepting negative distance, mixing units or replacing exact roots with approximations.',
    ],
    prompts: [
      ['直角从哪个条件来？', 'Which premise provides the right angle?'],
      [
        '现在求的是长度还是长度平方？',
        'Are you finding a length or its square?',
      ],
    ],
  },
  {
    title: ['勾股逆定理', 'Converse of Pythagoras'],
    objective: [
      '先验三角形存在并取最长边，用精确平方关系判断直角及比较类型，说明逆命题依据。',
      'Check existence and the longest side before exact square tests for rightness and angle-type comparison, explaining the converse.',
    ],
    prerequisites: ['J87-L03', 'J86-L02', 'J74-L05'],
    keywords: [
      ['逆定理', 'converse'],
      ['最长边', 'longest side'],
      ['严格三角形不等式', 'strict triangle inequality'],
    ],
    lab: 'pyth-converse',
    hook: [
      '一加二等三时，能把它当作钝角三角形继续平方比较吗？',
      'If one plus two equals three, can those lengths be treated as an obtuse triangle?',
    ],
    items: [
      I(
        [
          '三边依次给 5、3、4，判断三角形类型：right/acute/obtuse/impossible。',
          'Sides are listed 5,3,4. Classify as right/acute/obtuse/impossible.',
        ],
        'right',
        [
          [
            '先排序3、4、5，三角形存在，9+16=25。',
            'Sort to 3,4,5 and check existence; 9+16=25.',
          ],
          [
            '由逆定理，最长边五所对角为直角。',
            'The converse gives a right angle opposite the longest side five.',
          ],
        ],
        ['acute', 'obtuse', 'impossible'],
        'class',
      ),
      I(
        [
          '三正边 2、3、4，判类型。除逆定理外可用同两边夹角与对边的比较性质。',
          'Classify sides 2,3,4, additionally using the hinge/side comparison property.',
        ],
        'obtuse',
        [
          [
            '2+3>4，存在；4²−2²−3²=3>0。',
            '2+3>4 ensures existence, and 4²-2²-3²=3>0.',
          ],
          [
            '固定两短边，比相应直角三角形对边更长，所以夹角大于90°。',
            'With shorter sides fixed, the opposite side exceeds the right-triangle comparison, so its angle exceeds 90°.',
          ],
        ],
        ['right', 'acute', 'impossible'],
        'class',
      ),
      I(
        [
          '三边 4、4、5，判类型，可用夹角与对边大小比较。',
          'Classify sides 4,4,5 using side/angle comparison.',
        ],
        'acute',
        [
          ['4+4>5；5²−4²−4²=−7<0。', '4+4>5, and 5²-4²-4²=-7<0.'],
          [
            '最长边所对最大角也小于90°，故全三角为锐角。',
            'Even the largest angle, opposite the longest side, is below 90°, so all are acute.',
          ],
        ],
        ['right', 'obtuse', 'impossible'],
        'class',
      ),
      I(
        [
          '三边 1、2、3，是否能形成非退化三角形？按类型作答。',
          'Can sides 1,2,3 form a nondegenerate triangle? Answer with the classification.',
        ],
        'impossible',
        [
          [
            '两短边和等于长边，不满足严格不等式，不能成三角形，到此停止。',
            'The short-side sum equals the longest, violating the strict inequality. No triangle exists; stop before angle classification.',
          ],
        ],
        ['right', 'acute', 'obtuse'],
        'class',
      ),
      M(
        [
          '已知三正边能成三角形，最长边 c，且 a²+b²=c²。用另构直角三角形和 SSS 解释逆定理，不能先假设原图直角。',
          'Given valid positive triangle sides with longest c and a²+b²=c², explain the converse using a separate constructed right triangle and SSS, without assuming the original is right.',
        ],
        [
          '另作直角三角形，两腿a、b，前向勾股得其斜边平方a²+b²=c²；斜边与c均正，故斜边=c。三组边对应相等，SSS使原三角形与新直角三角形全等，原c所对角才被证明90°。三角形存在和最长边先核，不先用待证直角。',
          'Construct a separate right triangle with legs a,b. Forward Pythagoras gives hypotenuse square a²+b²=c²; positive lengths give hypotenuse c. SSS makes it congruent to the original, proving the angle opposite c is right. Check existence and longest-side roles first, without assuming the target right angle.',
        ],
      ),
      I(
        ['三边依次 10、6、8，判断类型。', 'Classify sides listed 10,6,8.'],
        'right',
        [
          [
            '取十为最长边，六加八大于十，36+64=100。',
            'Take ten as longest; six plus eight exceeds ten and 36+64=100.',
          ],
        ],
        ['acute', 'obtuse', 'impossible'],
        'class',
      ),
    ],
    pick: {
      stem: [
        '使用三边平方检验前，第一步最完整的是？',
        'What is the complete first step before a side-square test?',
      ],
      options: [
        [
          '题目最后写的数必为斜边',
          'The last listed side must be the hypotenuse',
        ],
        [
          '先验正长与严格三角形不等式，再取最长边 c',
          'Check positive lengths and strict triangle inequalities, then take the longest c',
        ],
        ['只要平方不等就叫钝角三角形', 'Any unequal squares mean obtuse'],
      ],
      feedback: [
        [
          '列出顺序不决定大小或角的身份。',
          'Listing order does not determine the longest side or angle role.',
        ],
        [
          '先保证有非退化三角形，才能谈角类型。',
          'A nondegenerate triangle must exist before classifying angles.',
        ],
        [
          '还可能锐角，甚至根本不能成三角形。',
          'It may be acute or fail to form a triangle at all.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '比较正向勾股与逆定理，说明为什么要先验存在、取最长边，并区分不等时的锐钝比较需要额外性质。',
      'Compare forward Pythagoras and its converse, explaining existence, longest side and the additional property needed for acute/obtuse inequalities.',
    ],
    rubric: [
      '正向由已知直角推出平方等式，逆向由有效三角形及平方等式推出直角，可另构直角三角形用SSS证明。先验正长和两短边和严格大于长边，取最长c，列数顺序无关。不等只能直接说明非直角；再用固定两边夹角越大对边越长的比较性质，c²较大给钝角、较小给最大角锐。无三角形时不能谈锐钝。检验用精确值，不靠像素或近似凑等号。',
      'Forward Pythagoras starts with a right angle; the converse derives one from a valid triangle and square equality, justified by a constructed right triangle and SSS. Check positive lengths, the strict triangle inequality and the longest side irrespective of input order. Inequality alone excludes rightness; acute/obtuse conclusions additionally use the hinge/side comparison property. Do not classify nonexistent triangles or use rounded pixels to force equality.',
    ],
    misconception: [
      '列数顺序当大小、忽略存在、平方不等必钝角、正向与逆向互相循环。',
      'Assuming list order, ignoring existence, calling every unequal case obtuse or proving forward/converse circularly.',
    ],
    prompts: [
      [
        '这三条长度真的围得成三角形吗？',
        'Do these three lengths actually form a triangle?',
      ],
      [
        '这一步用了正向定理还是逆定理？',
        'Does this step use the forward theorem or its converse?',
      ],
    ],
  },
];
export const j87Lessons: Lesson[] = specs.map((s, i) => {
  const id = `J87-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: 20,
    lab: s.lab,
    hook: T(s.hook),
    stage: 'J08',
    unit: 'J87',
    order: i + 1,
    nzYearHints: [8, 9, 10],
    cnGradeHints: [8],
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
      prompts: s.prompts.map(T),
      bridge: s.prerequisites[0]!,
    },
    ...(i === 4
      ? {
          familyChallenge: t(
            '纸上画虚构社区标志，依次指定平移、反射与旋转的参照，记录三个点及像点，检验保长。用四块同样直角三角形画两种面积排法，解释空白为何是正方形。再设计一个矩形对角线的精确根式题，以及一个不能成三角形的反例，区分正向与逆向。只需纸笔，不要求购买、实际梯子操作、测量或个人资料。',
            'On paper, design a fictional community sign with explicit translation, mirror and rotation references. Record three points and images and check preserved lengths. Draw two arrangements of the same four right triangles and justify square gaps. Add an exact rectangle-diagonal problem and a non-triangle counterexample, distinguishing forward and converse arguments. No purchases, real ladder use, measurements or personal data are needed.',
          ),
        }
      : {}),
  };
});
export function j87ReviewQuestion(id: string, round: number): Question {
  if (
    !/^J87-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid J87 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 80,
    n = (k % 9) - 4,
    d = (k % 2) + 1,
    b = (k % 7) - 3;
  let item: Item;
  if (i === 0) {
    const mode = k % 3;
    item = I(
      [
        mode === 0
          ? `P(${n}/${d},${b}) 平移向量 (2,−1)，写像点。`
          : mode === 1
            ? `P(${n}/${d},${b}) 对 y 轴反射，写像点。`
            : `P(${n}/${d},${b}) 对 y=x 反射，写像点。`,
        mode === 0
          ? `Translate P(${n}/${d},${b}) by (2,-1), giving its image.`
          : mode === 1
            ? `Reflect P(${n}/${d},${b}) in the y axis.`
            : `Reflect P(${n}/${d},${b}) in y=x.`,
      ],
      mode === 0
        ? `(${n + 2 * d}/${d},${b - 1})`
        : mode === 1
          ? `(${-n}/${d},${b})`
          : `(${b},${n}/${d})`,
      [
        [
          '按给定参照求像，保留精确分数。',
          'Use the stated reference and exact fractions.',
        ],
      ],
      ['(100,100)'],
    );
  } else if (i === 1) {
    const half = k % 2 === 0;
    item = I(
      [
        half
          ? `P(${n},${b}) 绕 O(1,1) 半转，写像点。`
          : `P(${n},${b}) 绕原点逆时针九十度，写像点。`,
        half
          ? `Half-turn P(${n},${b}) about O(1,1), giving its image.`
          : `Rotate P(${n},${b}) 90° anticlockwise about the origin.`,
      ],
      half ? `(${2 - n},${2 - b})` : `(${-b},${n})`,
      [
        [
          '核中心与方向，相对位移转后再加中心。',
          'Check centre/direction, rotate relative displacement and add the centre back.',
        ],
      ],
      ['(100,100)'],
    );
  } else if (i === 2) {
    const a = (k % 6) + 1,
      c = (k % 5) + 1;
    item =
      k % 4 === 0
        ? M(
            [
              '说明四块全等直角三角形重排时，为什么中央空白是正方形及面积不变。',
              'Explain why the central gap is a square and the uncovered area stays fixed when four congruent right triangles are rearranged.',
            ],
            specs[2]!.rubric,
          )
        : N(
            [
              `已知直角边 ${a} cm、${c} cm，求斜边正方形面积 c²。`,
              `Given legs ${a} cm,${c} cm, find the hypotenuse square’s area c².`,
            ],
            String(a * a + c * c),
            [
              [
                '平方相加得到面积，题目未问开方后的长度。',
                'Add squares for area; this task does not ask for the root length.',
              ],
            ],
            [String(a * a + c * c + 1)],
            'cm²',
          );
  } else if (i === 3) {
    const a = (k % 6) + 1,
      c = (k % 7) + 1;
    item = R(
      [
        `矩形两边 ${a} m、${c} m，求精确对角线，不附单位。`,
        `A rectangle has sides ${a} m,${c} m. Find the exact diagonal without units.`,
      ],
      String(a * a + c * c),
      [
        [
          '矩形给直角，平方相加后取非负根。',
          'The rectangle supplies a right angle; add squares and take the nonnegative root.',
        ],
      ],
      [String(a + c)],
    );
  } else {
    const scale = (k % 5) + 1,
      mode = k % 4,
      sides =
        mode === 0
          ? [5, 3, 4]
          : mode === 1
            ? [4, 2, 3]
            : mode === 2
              ? [4, 5, 4]
              : [3, 1, 2],
      kind = ['right', 'obtuse', 'acute', 'impossible'][mode]!;
    item = I(
      [
        `三边依次 ${sides.map((v) => v * scale).join('、')}，先验存在再判断类型。`,
        `Sides listed ${sides.map((v) => v * scale).join(',')}: check existence, then classify.`,
      ],
      kind,
      [
        [
          '排序并核严格三角形不等式，再用精确平方；锐钝需配合边角比较性质。',
          'Sort and check strict triangle inequalities before exact squares; acute/obtuse classification also uses side/angle comparison.',
        ],
      ],
      [kind === 'right' ? 'obtuse' : 'right'],
      'class',
    );
  }
  return q(`${id}-R${round}`, i, item);
}
export const j87CheckQuestions: Question[] = [
  q(
    'J87-CHECK-Q1',
    0,
    I(
      [
        'P(3,2) 对 x=1 反射，求像点。',
        'Reflect P(3,2) in x=1. Give the image.',
      ],
      '(-1,2)',
      [['x′=2−3=−1，y 保持二。', 'x′=2-3=-1, while y stays two.']],
      ['(-3,2)', '(3,-2)'],
    ),
  ),
  q(
    'J87-CHECK-Q2',
    1,
    I(
      [
        'P(5,1) 绕 O(2,−1) 半转，求像点。',
        'Half-turn P(5,1) about O(2,-1). Give the image.',
      ],
      '(-1,-3)',
      [['P′=2O−P=(4−5,−2−1)。', 'P′=2O-P=(4-5,-2-1).']],
      ['(-5,-1)', '(1,3)'],
    ),
  ),
  q(
    'J87-CHECK-Q3',
    3,
    R(
      [
        '直角三角形斜边 10 cm、已知腿 6 cm，求另一腿精确长度，不附单位。',
        'A right triangle has hypotenuse 10 cm and one leg 6 cm. Find the other exact leg without units.',
      ],
      '64',
      [
        [
          '另一腿平方100−36=64，非负根八。',
          'The other leg square is 100-36=64, whose nonnegative root is eight.',
        ],
      ],
      ['√136', '64', '4', '-8'],
    ),
  ),
  q(
    'J87-CHECK-Q4',
    3,
    R(
      [
        '矩形边长 2 m、4 m，求精确对角线，不附单位。',
        'A rectangle has sides 2 m,4 m. Find its exact diagonal without units.',
      ],
      '20',
      [
        [
          '平方和20，长度√20=2√5 m，两种精确写法均可。',
          'The square is twenty, so length √20=2√5 m; both exact forms work.',
        ],
      ],
      ['20', '6', '4.47', '-2√5'],
      ['2√5', 'sqrt(20)'],
    ),
  ),
  q(
    'J87-CHECK-Q5',
    4,
    I(
      [
        '三边 5、5、9，先验存在再判断类型。',
        'For sides 5,5,9, check existence then classify.',
      ],
      'obtuse',
      [
        [
          '五加五大于九，存在；81>25+25，按比较性质为钝角。',
          'Five plus five exceeds nine; 81>25+25 gives obtuse by the side/angle comparison property.',
        ],
      ],
      ['right', 'acute', 'impossible'],
      'class',
    ),
  ),
  q(
    'J87-CHECK-Q6',
    4,
    M(
      [
        '说明勾股逆定理为何不是先假设原图直角，并解释为什么 1、2、3 必须先排除。',
        'Explain why the converse need not assume the original is right, and why sides 1,2,3 must be excluded first.',
      ],
      [
        '另构两短边为腿的直角三角形，前向定理算出斜边，平方等式与正长度说明它等于原最长边；SSS全等才推原图直角。1+2=3无法成非退化三角形，不能对它分类锐钝。须区分已有直角的正向与由边推角的逆向。',
        'Construct a separate right triangle on the shorter legs. Forward Pythagoras and positive lengths make its hypotenuse equal the original longest side; SSS then proves the original right. Since 1+2=3 is degenerate, do not classify its angles. Distinguish forward known-angle reasoning from the converse.',
      ],
    ),
  ),
  pick('J87-CHECK-Q7', 2, specs[2]!.pick),
  reasoning(
    'J87-CHECK-Q8',
    t(
      '用具体例子说明变换参照、面积重排、精确根式与逆定理存在条件；指出一个混淆。',
      'Use examples to explain transformation references, area rearrangement, exact roots and converse existence conditions, identifying a misconception.',
    ),
    skills[4]!,
    t(
      '可用x=1反射四到负二、非原点半转先减中心；刚性变换保长角。四块面积守恒要证空白直角且无重叠，得c²=a²+b²，长度再取非负根，√13不等于3.61。正向先给直角，逆向先验三边存在和最长边，再以平方等式及SSS推出直角；1、2、3根本不成三角形。锐钝不等号还用边角比较性质。家长核具体数、前提和方向，不按术语数评分。',
      'For example x=1 reflects four to minus two, while non-origin half-turns use the specified centre. Rigid motions preserve lengths/angles. The four-piece area argument needs right square gaps and no overlap, giving square equality; length then takes a nonnegative root, with √13 unequal to 3.61. Forward reasoning assumes rightness; the converse checks existence/longest side and derives rightness via square equality and SSS. Sides 1,2,3 form no triangle. Acute/obtuse inequalities also need side/angle comparison. Review concrete values and premises, not keywords.',
    ),
    hints[4]!.map(T),
  ),
];
