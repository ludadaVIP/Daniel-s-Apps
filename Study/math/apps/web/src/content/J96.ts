import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import {
  trigTriangle,
  trigTriangles,
  trigValues,
  roundTrig,
  inverseTrig,
  treeHeight,
  slopeModel,
  type TrigFunction,
  type TrigReference,
} from '../trigModels';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = {
  stem: Pair;
  answer: AnswerSpec;
  steps: Pair[];
  wrong: string[];
  diagram?: Question['diagram'];
};
type Pick = { stem: Pair; options: Pair[]; feedback: Pair[]; correct: number };
type Spec = {
  title: Pair;
  lab: Lesson['lab'];
  objective: Pair;
  prerequisites: string[];
  keywords: Pair[];
  hook: Pair;
  items: Item[];
  pick: Pick;
  reason: Pair;
  rubric: Pair;
  misconception: Pair;
  prompts: Pair[];
};
const skills = [
  'trig-sine-correspondence',
  'trig-cosine-tangent-sides',
  'trig-acute-domain-variation',
  'trig-inverse-degree-precision',
  'trig-height-gradient-premises',
];
const hints: Pair[][] = [
  [
    [
      '先找直角，再固定参照锐角。',
      'Locate the right angle, then fix the reference acute angle.',
    ],
    [
      '对边在参照角对面，斜边在直角对面；sin=对/斜，同角相似比不变。',
      'Opposite lies across the reference, hypotenuse across the right angle; sin=O/H and same-angle similarity preserves it.',
    ],
  ],
  [
    [
      '只把邻直角边叫A，斜边另记H。',
      'Use A only for the adjacent leg, with H separate for the hypotenuse.',
    ],
    [
      'cos=A/H，tan=O/A；未知在分母时从原比例反求，别总乘。',
      'cos=A/H and tan=O/A; solve the original proportion if the unknown is in a denominator.',
    ],
  ],
  [
    [
      '本课普通三角形的参照角须0<θ<90°。',
      'The ordinary triangle reference here requires 0<θ<90°.',
    ],
    [
      'sin增、cos减、tan增且可超1；90°正切零分母。按题区分精确值与指定小数位。',
      'Sine rises, cosine falls, tangent rises beyond one; tan90 has a zero denominator. Distinguish exact values from required decimal places.',
    ],
  ],
  [
    [
      '按已知边选sin/cos/tan，再用对应反函数。',
      'Choose sin/cos/tan from the known sides, then use its inverse.',
    ],
    [
      '核锐角比值是否合法和DEG/RAD；反函数不是倒数，最后按指定精度。',
      'Check acute-ratio validity and DEG/RAD. The inverse is not a reciprocal; round only the final answer.',
    ],
  ],
  [
    [
      '距离是水平邻边还是视线斜边？仪器高与基面关系是什么？',
      'Is distance horizontal adjacent or sight hypotenuse? What are the instrument and base levels?',
    ],
    [
      '水平用tan、视线用sin先求高差；同基面再加仪器高。坡度百分数用rise/run×100。',
      'Use tan for horizontal or sin for sight distance to find rise; add instrument height only with the stated base relationship. Grade=rise/run×100.',
    ],
  ],
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
  return {
    ...numeric(
      id,
      T(v.stem),
      v.answer.value,
      skills[i]!,
      hints[i]!.map(T),
      v.steps.map(T),
      { accepted: [v.answer.value], rejected: v.wrong },
      v.diagram,
    ),
    answer: v.answer,
  };
}
const specs: Spec[] = [
  {
    title: ['正弦是对边比斜边', 'Sine as opposite over hypotenuse'],
    lab: 'trig-sine',
    objective: [
      '相对于参照锐角识别对边与斜边，并由相似说明正弦比不随大小改变。',
      'Identify opposite and hypotenuse relative to an acute angle and use similarity to explain scale-invariant sine.',
    ],
    prerequisites: ['J94-L02', 'J87-L04'],
    keywords: [
      ['参照锐角', 'reference acute angle'],
      ['对边', 'opposite side'],
      ['正弦', 'sine'],
    ],
    hook: [
      '同角的两座不同大小斜坡，为什么对边比斜边不变？',
      'Why do different-sized right-triangle slopes with the same angle have the same opposite/hypotenuse ratio?',
    ],
    items: [
      {
        stem: [
          '△ABC中∠C=90°，AC=4、BC=3、AB=5，求sinA的精确值。',
          'In right triangle ABC, C=90°, AC=4, BC=3, AB=5. Find exact sinA.',
        ],
        answer: {
          kind: 'radical',
          value: '3/5',
          simplified: false,
        },
        steps: [
          [
            '参照A，对边BC=3，斜边AB=5，sinA=3/5；比值无单位。',
            'For reference A, opposite BC=3 and hypotenuse AB=5, so sinA=3/5, dimensionless.',
          ],
        ],
        wrong: ['4/5', '3/4'],
        diagram: {
          kind: 'trig-triangle',
          adjacent: '4',
          opposite: '3',
        },
      },
      {
        stem: [
          '同一△ABC改以锐角B为参照，对边是哪条？只写边名。',
          'In the same triangle, use acute B as reference. Which side is opposite? Enter its letters.',
        ],
        answer: {
          kind: 'geometry-code',
          value: 'AC',
          reversible: true,
        },
        steps: [
          [
            'B对面是AC；换参照角会交换两直角边身份，不会换斜边。',
            'AC lies opposite B; changing reference swaps the leg roles without changing the hypotenuse.',
          ],
        ],
        wrong: ['BC', 'AB'],
      },
      {
        stem: [
          '∠C=90°，无论参照A或B，斜边是哪条？',
          'With C=90°, which side is the hypotenuse for either reference A or B?',
        ],
        answer: {
          kind: 'geometry-code',
          value: 'AB',
          reversible: true,
        },
        steps: [
          [
            '斜边在给定直角C对面，固定AB，不按斜放或朝向命名。',
            'The hypotenuse stays AB, opposite the given right angle C, regardless of its screen orientation.',
          ],
        ],
        wrong: ['BC', 'AC'],
      },
      {
        stem: [
          '把3–4–5直角三角形全部边乘2成6–8–10，同一参照A的sin是多少？',
          'Uniformly scale the 3–4–5 right triangle to 6–8–10. Find sin of the same reference A.',
        ],
        answer: {
          kind: 'radical',
          value: '3/5',
          simplified: false,
        },
        steps: [
          [
            '新比6/10=3/5；两对角相等给AA相似，分子分母同乘2。',
            'The new ratio 6/10=3/5; AA similarity preserves the angle while both lengths double.',
          ],
        ],
        wrong: ['6/5', '6/10+1'],
      },
      {
        stem: [
          '30°–60°–90°三角形中，30°的对边1、斜边2，求sin30°。',
          'A 30°–60°–90° triangle has opposite one and hypotenuse two for its 30° angle. Find exact sin30°.',
        ],
        answer: {
          kind: 'radical',
          value: '1/2',
          simplified: false,
        },
        steps: [
          [
            '按定义对边/斜边=1/2，不把另一条√3边拿来。',
            'By definition opposite/hypotenuse=1/2, not the other leg √3.',
          ],
        ],
        wrong: ['√3/2', '2'],
      },
      {
        stem: [
          '等腰直角三角形两直角边均1，斜边√2，求sin45°精确值。',
          'An isosceles right triangle has legs one and hypotenuse √2. Find exact sin45°.',
        ],
        answer: {
          kind: 'radical',
          value: '√2/2',
          simplified: false,
        },
        steps: [
          [
            'sin45°=1/√2=√2/2；可以有理化，不用0.71替代精确根式。',
            'sin45°=1/√2=√2/2; rationalisation is allowed, while 0.71 is only approximate.',
          ],
        ],
        wrong: ['1/2', '0.71'],
      },
    ],
    pick: {
      stem: [
        '旋转一个已知直角三角形，哪种判断可靠？',
        'After rotating a known right triangle, which identification is reliable?',
      ],
      options: [
        [
          '屏幕最斜的边总是斜边',
          'The most slanted screen side is the hypotenuse',
        ],
        [
          '给定直角对面的边是斜边',
          'The side opposite the given right angle is the hypotenuse',
        ],
        ['最下面的边总是邻边', 'The lowest screen side is always adjacent'],
      ],
      feedback: [
        [
          '朝向会变，直角和点身份不变。',
          'Orientation changes while the right angle and vertex identities persist.',
        ],
        [
          '定义由直角决定，与屏幕朝向无关。',
          'The definition uses the right angle, independently of screen orientation.',
        ],
        [
          '邻边依参照角而定，不依上下位置。',
          'Adjacent-leg identity depends on the reference, not vertical position.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '用AA相似解释sin只由锐角决定，并说明换参照角时哪些边的身份改变。',
      'Use AA similarity to explain why sine depends on the acute angle, and identify what changes with the reference.',
    ],
    rubric: [
      '两个非退化直角三角形同一锐角相等，再有直角相等，所以AA相似，对应对边与斜边统一乘正k，商不变。同一三角形从A换B，对边BC变AC、邻边AC变BC，斜边AB仍对直角C。缺直角时不能直接套本课公式。',
      'Two nondegenerate right triangles with the same acute angle have two equal angles, hence AA similarity. Corresponding opposite sides and hypotenuses share factor k, preserving their quotient. Switching A to B swaps opposite BC with AC and adjacent AC with BC; hypotenuse AB remains opposite C. Without a right angle these formulas do not apply directly.',
    ],
    misconception: [
      '对边与邻边相对于参照锐角；斜边相对于直角固定。相似放大不改变同角正弦。',
      'Opposite and adjacent depend on the acute reference; the hypotenuse is fixed by the right angle. Similar enlargement preserves same-angle sine.',
    ],
    prompts: [
      [
        '先指出给定直角和参照锐角，再匹配边。',
        'Locate the given right angle and reference acute angle before matching sides.',
      ],
      [
        '已知的是水平距离、视线距离、比值还是角？要求精确还是几位小数？',
        'Is the given quantity horizontal distance, sight distance, a ratio or an angle? Is the answer exact or rounded to stated places?',
      ],
    ],
  },
  {
    title: ['余弦与正切', 'Cosine and tangent'],
    lab: 'trig-cos-tan',
    objective: [
      '按参照角匹配cos、tan的边比，并由原比例正向或反向求边。',
      'Match cosine and tangent side ratios and recover sides by multiplying or dividing the original proportion.',
    ],
    prerequisites: ['J96-L01', 'J94-L03'],
    keywords: [
      ['邻直角边', 'adjacent leg'],
      ['余弦', 'cosine'],
      ['正切', 'tangent'],
    ],
    hook: [
      '邻边也接触角，为什么斜边不能算作这里的邻边？',
      'The hypotenuse also touches the angle; why is it not the adjacent leg?',
    ],
    items: [
      {
        stem: [
          '∠C=90°，AC=4、BC=3、AB=5，以A为参照，求cosA。',
          'For C=90°, AC=4, BC=3, AB=5 and reference A, find exact cosA.',
        ],
        answer: {
          kind: 'radical',
          value: '4/5',
          simplified: false,
        },
        steps: [
          [
            '邻直角边AC=4，斜边AB=5，cosA=4/5。',
            'Adjacent leg AC=4 and hypotenuse AB=5 give cosA=4/5.',
          ],
        ],
        wrong: ['3/5', '4/3'],
      },
      {
        stem: [
          '同一三角形以A为参照，求tanA。',
          'For reference A in the same triangle, find exact tanA.',
        ],
        answer: {
          kind: 'radical',
          value: '3/4',
          simplified: false,
        },
        steps: [
          [
            '正切为对边BC除以邻直角边AC，tanA=3/4。',
            'Tangent divides opposite BC by adjacent leg AC, giving 3/4.',
          ],
        ],
        wrong: ['4/3', '3/5'],
      },
      {
        stem: [
          '已知同一锐角的对边和邻直角边，直接对应哪种函数比？写sin/cos/tan。',
          'Which function directly compares opposite with adjacent legs of the same acute angle? Enter sin, cos or tan.',
        ],
        answer: {
          kind: 'trig-function',
          value: 'tan',
        },
        steps: [
          [
            'tanθ=对边/邻直角边；不涉及斜边。',
            'tanθ=opposite/adjacent leg, without the hypotenuse.',
          ],
        ],
        wrong: ['sin', 'cos'],
      },
      {
        stem: [
          '直角三角形中cosA=4/5，斜边AB=10 cm，求邻直角边AC。',
          'In a right triangle cosA=4/5 and hypotenuse AB=10 cm. Find adjacent AC.',
        ],
        answer: {
          kind: 'number',
          value: '8',
          unit: 'cm',
        },
        steps: [['AC/10=4/5，所以AC=8 cm。', 'AC/10=4/5, hence AC=8 cm.']],
        wrong: ['12.5', '6'],
      },
      {
        stem: [
          '直角三角形中tanA=3/4，对边BC=6 cm，求邻直角边AC。',
          'In a right triangle tanA=3/4 and opposite BC=6 cm. Find adjacent AC.',
        ],
        answer: {
          kind: 'number',
          value: '8',
          unit: 'cm',
        },
        steps: [
          [
            '6/AC=3/4，未知量在分母，AC=6÷(3/4)=8 cm。',
            '6/AC=3/4 has the unknown in the denominator; AC=6÷(3/4)=8 cm.',
          ],
        ],
        wrong: ['4.5', '10'],
      },
      {
        stem: [
          '原3–4–5三角形改以B为参照，求cosB。',
          'In the original 3–4–5 triangle, switch the reference to B and find exact cosB.',
        ],
        answer: {
          kind: 'radical',
          value: '3/5',
          simplified: false,
        },
        steps: [
          [
            '邻B的直角边BC=3，斜边仍AB=5，cosB=3/5=sinA。',
            'The adjacent leg at B is BC=3, with hypotenuse still AB=5; cosB=3/5=sinA.',
          ],
        ],
        wrong: ['4/5', '4/3'],
      },
    ],
    pick: {
      stem: [
        'tanA=3/4、对边6，反求邻边该怎样算？',
        'Given tanA=3/4 and opposite six, how do you recover the adjacent leg?',
      ],
      options: [
        ['6×3/4', '6×3/4'],
        ['6÷(3/4)', '6÷(3/4)'],
        ['6−3/4', '6−3/4'],
      ],
      feedback: [
        [
          '这把已知对边又当成邻边正向放大。',
          'This incorrectly treats the known opposite side as the adjacent input.',
        ],
        [
          '从6/邻边=3/4解未知分母，得8。',
          'Solve 6/adjacent=3/4 for the denominator to obtain eight.',
        ],
        [
          '边比不是长度差，不能作减法。',
          'A side ratio is not a difference of lengths.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '解释sin/cos/tan三个比为何要先说参照角，并用3–4–5检查换角后的变化。',
      'Explain why all three ratios need a reference, checking a 3–4–5 triangle after changing angles.',
    ],
    rubric: [
      '以A为参照，sin=3/5、cos=4/5、tan=3/4；换B变为4/5、3/5、4/3，斜边仍5。邻边必须是邻直角边，不能把斜边也当邻边。正向求边乘比，未知在分母时由原式反求，不能背固定乘法。',
      'For A the ratios are 3/5, 4/5 and 3/4. For B they become 4/5, 3/5 and 4/3, with the same hypotenuse five. Adjacent means the adjacent leg, excluding the hypotenuse. Multiply when appropriate, but solve the original equation when the unknown is in a denominator.',
    ],
    misconception: [
      'cos用邻直角边/斜边，tan用对边/邻直角边；换角会交换两个直角边身份。',
      'Cosine uses adjacent leg/hypotenuse and tangent opposite/adjacent leg; changing reference swaps the leg roles.',
    ],
    prompts: [
      [
        '先指出给定直角和参照锐角，再匹配边。',
        'Locate the given right angle and reference acute angle before matching sides.',
      ],
      [
        '已知的是水平距离、视线距离、比值还是角？要求精确还是几位小数？',
        'Is the given quantity horizontal distance, sight distance, a ratio or an angle? Is the answer exact or rounded to stated places?',
      ],
    ],
  },
  {
    title: ['角度与比值的变化', 'How trig ratios vary with angle'],
    lab: 'trig-variation',
    objective: [
      '在锐角范围比较sin、cos、tan的变化，并区分精确值、指定近似与无定义边界。',
      'Compare sine, cosine and tangent on the acute domain, distinguishing exact values, prescribed rounding and undefined boundaries.',
    ],
    prerequisites: ['J96-L02', 'J85-L01'],
    keywords: [
      ['锐角范围', 'acute domain'],
      ['比值变化', 'changing ratio'],
      ['无定义', 'undefined'],
    ],
    hook: [
      '角越大时，三个比都越大吗？它们都不能超过1吗？',
      'Do all three ratios grow with the angle, and must all stay below one?',
    ],
    items: [
      {
        stem: [
          '以度数制求tan45°，按要求写恰好4位小数。',
          'In degree mode find tan45°, writing exactly four decimal places.',
        ],
        answer: {
          kind: 'trig-rounded',
          value: '1.0000',
          places: 4,
        },
        steps: [
          [
            '等腰直角三角形两直角边相等，tan45°=1；四位小数写1.0000。',
            'Equal legs give tan45°=1; the required four-place representation is 1.0000.',
          ],
        ],
        wrong: ['1', '0.7071'],
        diagram: {
          kind: 'trig-angle',
          degrees: 45,
        },
      },
      {
        stem: [
          '求sin30°，写恰好4位小数。',
          'Find sin30°, writing exactly four decimal places.',
        ],
        answer: {
          kind: 'trig-rounded',
          value: '0.5000',
          places: 4,
        },
        steps: [
          [
            '精确值1/2，本题要求四位小数，写0.5000。',
            'The exact value is 1/2; this task asks for four decimal places, 0.5000.',
          ],
        ],
        wrong: ['1/2', '0.5', '0.8660'],
      },
      {
        stem: [
          '求cos60°，写恰好4位小数。',
          'Find cos60°, writing exactly four decimal places.',
        ],
        answer: {
          kind: 'trig-rounded',
          value: '0.5000',
          places: 4,
        },
        steps: [
          [
            '精确值1/2，指定形式为0.5000，不是sin60°的0.8660。',
            'Its exact value is 1/2, represented here as 0.5000, not sin60°≈0.8660.',
          ],
        ],
        wrong: ['0.5', '0.8660'],
      },
      {
        stem: [
          '求tan60°精确值，不写近似小数。',
          'Find exact tan60°, without a decimal approximation.',
        ],
        answer: {
          kind: 'radical',
          value: '√3',
          simplified: false,
        },
        steps: [
          [
            '对边√3、邻边1，所以tan60°=√3>1；只有锐角sin、cos严格小于1。',
            'Opposite √3 divided by adjacent one gives tan60°=√3>1; only acute sine and cosine are bounded below one.',
          ],
        ],
        wrong: ['1', '0.8660', '1.732'],
      },
      {
        stem: [
          '在0<θ<90°，θ增大时，哪个函数比值减小？写sin/cos/tan。',
          'On 0<θ<90°, which ratio decreases as θ increases? Enter sin, cos or tan.',
        ],
        answer: {
          kind: 'trig-function',
          value: 'cos',
        },
        steps: [
          [
            '固定斜边时邻边缩短，cos=邻边/斜边减小；sin和tan增大。',
            'At fixed hypotenuse the adjacent leg decreases, so cosine decreases while sine and tangent increase.',
          ],
        ],
        wrong: ['sin', 'tan'],
      },
      {
        stem: [
          '解释为什么tan90°不能用计算器浮点库显示的巨大有限值作答案。',
          'Explain why a huge finite floating-point tangent at 90° is not the correct mathematical answer.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: '本课普通三角形要求0<θ<90°；趋向90°时邻边趋向零，tan=对边/邻边越来越大。90°边界退化且分母为零，tan90°无定义。浮点π/2不是精确端点，给出的大数只是近似计算的现象，不能当有限数学值，也不能把角90°当普通锐角。',
            en: 'Ordinary triangles here require 0<θ<90°. As the angle approaches 90°, the adjacent leg approaches zero and opposite/adjacent grows. At 90° the boundary is degenerate and the denominator zero, so tangent is undefined. A floating-point approximation to π/2 is not the exact endpoint; its huge output is not a finite mathematical tangent value.',
          },
        },
        steps: [
          [
            '本课普通三角形要求0<θ<90°；趋向90°时邻边趋向零，tan=对边/邻边越来越大。90°边界退化且分母为零，tan90°无定义。浮点π/2不是精确端点，给出的大数只是近似计算的现象，不能当有限数学值，也不能把角90°当普通锐角。',
            'Ordinary triangles here require 0<θ<90°. As the angle approaches 90°, the adjacent leg approaches zero and opposite/adjacent grows. At 90° the boundary is degenerate and the denominator zero, so tangent is undefined. A floating-point approximation to π/2 is not the exact endpoint; its huge output is not a finite mathematical tangent value.',
          ],
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: [
        '哪个说法符合锐角范围？',
        'Which statement holds on the acute domain?',
      ],
      options: [
        ['sin、cos、tan都小于1', 'Sine, cosine and tangent are all below one'],
        [
          'sin增大、cos减小，tan可以大于1',
          'Sine increases, cosine decreases and tangent may exceed one',
        ],
        [
          'tan图窗外的值都不存在',
          'A tangent value outside the plot window does not exist',
        ],
      ],
      feedback: [
        ['tan60°=√3已给反例。', 'tan60°=√3 is a counterexample.'],
        [
          '固定斜边的边变化及对/邻比解释这些趋势。',
          'Fixed-hypotenuse side changes and opposite/adjacent explain these trends.',
        ],
        [
          '有限图窗会裁切曲线，不改变函数值。',
          'A finite window clips the curve without changing the value.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '用固定斜边解释sin、cos和tan的变化，并说明屏幕曲线能提供什么证据。',
      'Use a fixed hypotenuse to explain the ratio trends and state what a plotted curve establishes.',
    ],
    rubric: [
      '锐角增大，投影邻边缩短、对边增大，故sin增、cos减；正的对边增而邻边减，tan增且不受1限制。图像、表格支持观察，但有限采样不代替一般理由；tan窗外不可钳成平台，90°分母零不可填大数。精确根式与指定小数位是不同作答要求。',
      'As the acute angle increases, the adjacent projection decreases and the opposite leg increases: sine rises, cosine falls, and positive opposite/adjacent rises without an upper bound of one. Tables and curves support observation, but finite sampling is not a general argument. Do not flatten off-window tangent or assign a large finite number at 90°. Exact radicals and prescribed decimal places are distinct representations.',
    ],
    misconception: [
      '本课锐角范围不含0°和90°；sin/cos不超过1不代表tan也如此，图窗边界不是函数边界。',
      'The ordinary acute domain excludes 0° and 90°. Sine/cosine bounds do not extend to tangent, and a plot boundary is not the function boundary.',
    ],
    prompts: [
      [
        '先指出给定直角和参照锐角，再匹配边。',
        'Locate the given right angle and reference acute angle before matching sides.',
      ],
      [
        '已知的是水平距离、视线距离、比值还是角？要求精确还是几位小数？',
        'Is the given quantity horizontal distance, sight distance, a ratio or an angle? Is the answer exact or rounded to stated places?',
      ],
    ],
  },
  {
    title: ['已知边求角', 'Finding angles from sides'],
    lab: 'trig-inverse',
    objective: [
      '根据已知边比选择反三角函数，在锐角定义域与度数制下按指定精度求角。',
      'Choose the inverse function for the supplied ratio and recover an acute angle in degrees to the stated precision.',
    ],
    prerequisites: ['J96-L03'],
    keywords: [
      ['反函数', 'inverse function'],
      ['度数制', 'degree mode'],
      ['精度', 'precision'],
    ],
    hook: [
      'sin⁻¹(3/5)和1/(3/5)，哪一个才是角？',
      'Which gives an angle: sin⁻¹(3/5) or 1/(3/5)?',
    ],
    items: [
      {
        stem: [
          '已知锐角θ的sinθ=3/5。求θ的度数，恰好1位小数。',
          'For acute θ, sinθ=3/5. Find θ in degrees to exactly one decimal place.',
        ],
        answer: {
          kind: 'trig-rounded',
          value: '36.9',
          places: 1,
          unit: '°',
        },
        steps: [
          [
            '用DEG模式θ=sin⁻¹(3/5)≈36.8699°，按题意取36.9°。',
            'In DEG mode θ=sin⁻¹(3/5)≈36.8699°, rounded to 36.9°.',
          ],
        ],
        wrong: ['53.1', '0.6', '0.6°'],
      },
      {
        stem: [
          '已知锐角cosθ=3/5，求θ度数，恰好1位小数。',
          'For acute cosθ=3/5, find θ in degrees to exactly one decimal place.',
        ],
        answer: {
          kind: 'trig-rounded',
          value: '53.1',
          places: 1,
          unit: '°',
        },
        steps: [
          [
            'θ=cos⁻¹(3/5)≈53.1301°，cos的同一比对应另一角，不误用sin⁻¹。',
            'θ=cos⁻¹(3/5)≈53.1301°; the same numerical cosine ratio requires cosine inverse, not sine inverse.',
          ],
        ],
        wrong: ['36.9', '0.6'],
      },
      {
        stem: [
          '已知锐角tanθ=1，求θ，恰好1位小数，单位度。',
          'For acute tanθ=1, find θ in degrees to exactly one decimal place.',
        ],
        answer: {
          kind: 'trig-rounded',
          value: '45.0',
          places: 1,
          unit: '°',
        },
        steps: [
          [
            '对边等于邻边，等腰直角三角形给45°，指定一位小数写45.0°。',
            'Equal opposite and adjacent legs give 45°, represented as 45.0° to the required one decimal place.',
          ],
        ],
        wrong: ['45', '1.0', '0.8'],
      },
      {
        stem: [
          '已知锐角sinθ=1/2，求θ，恰好1位小数，单位度。',
          'For acute sinθ=1/2, find θ in degrees to exactly one decimal place.',
        ],
        answer: {
          kind: 'trig-rounded',
          value: '30.0',
          places: 1,
          unit: '°',
        },
        steps: [
          [
            'θ=sin⁻¹(1/2)=30°，本题表示为30.0°。',
            'θ=sin⁻¹(1/2)=30°, written as 30.0° for this task.',
          ],
        ],
        wrong: ['30', '60.0'],
      },
      {
        stem: [
          '已知普通锐角直角三角形的sinθ=6/5，能得到合法锐角吗？判断条件是否足以构成这种三角形。',
          'A supposed acute right triangle has sinθ=6/5. Is that sufficient for a valid acute triangle?',
        ],
        answer: {
          kind: 'proof-verdict',
          value: 'insufficient',
        },
        steps: [
          [
            '正弦是较短直角边除以最长斜边，锐角比严格在0与1之间，6/5不可能。',
            'Acute sine divides a shorter leg by the longest hypotenuse, so its ratio is strictly between zero and one; 6/5 is impossible.',
          ],
        ],
        wrong: ['sufficient', 'congruent'],
      },
      {
        stem: [
          '解释sin⁻¹不是倒数，并说明RAD显示约0.6435时为何不能直接交0.6°。',
          'Explain why sin⁻¹ is not a reciprocal and why a RAD display near 0.6435 cannot be submitted as 0.6°.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: 'sin⁻¹(3/5)是在锐角范围找正弦为3/5的角，度数约36.8699°。1/(3/5)=5/3是无单位倒数，不是角。RAD读数约0.643501 rad，要乘180/π才得度数；或改DEG后再按一位小数写36.9°。显示单位切换不改变真实角或题目要求。',
            en: 'sin⁻¹(3/5) finds the acute angle whose sine is 3/5, about 36.8699°. The reciprocal 1/(3/5)=5/3 is dimensionless, not an angle. A RAD value near 0.643501 must be multiplied by 180/π to obtain degrees, or switch to DEG and report 36.9°. Display units do not change the angle or the requested unit.',
          },
        },
        steps: [
          [
            'sin⁻¹(3/5)是在锐角范围找正弦为3/5的角，度数约36.8699°。1/(3/5)=5/3是无单位倒数，不是角。RAD读数约0.643501 rad，要乘180/π才得度数；或改DEG后再按一位小数写36.9°。显示单位切换不改变真实角或题目要求。',
            'sin⁻¹(3/5) finds the acute angle whose sine is 3/5, about 36.8699°. The reciprocal 1/(3/5)=5/3 is dimensionless, not an angle. A RAD value near 0.643501 must be multiplied by 180/π to obtain degrees, or switch to DEG and report 36.9°. Display units do not change the angle or the requested unit.',
          ],
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: [
        '已知对边3、斜边5，求锐角θ，应输入哪种计算？',
        'Given opposite three and hypotenuse five, which calculation finds acute θ?',
      ],
      options: [
        ['sin(3/5)', 'sin(3/5)'],
        ['sin⁻¹(3/5)，DEG模式', 'sin⁻¹(3/5), in DEG mode'],
        ['1/(3/5)', '1/(3/5)'],
      ],
      feedback: [
        [
          'sin键输入的是角，不是用比值反求角。',
          'Sine takes an angle; it does not recover one from a ratio.',
        ],
        [
          '已知sinθ=3/5，用反函数且核度数单位。',
          'With sinθ=3/5 use the inverse and check degree units.',
        ],
        [
          '倒数5/3不是所求角。',
          'The reciprocal 5/3 is not the requested angle.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '给出求角的完整流程，并说明sin/cos比值不合法时如何处理。',
      'State a complete angle-finding procedure and how to handle invalid sine/cosine ratios.',
    ],
    rubric: [
      '先核直角与参照锐角，匹配O/A/H；按已知边选sin、cos或tan，统一长度单位再求无单位比。sin/cos须0<比<1，tan须>0；不合法先查模型或数据，不强行按计算器。用反函数在DEG模式求角，中间保留更多位，最后按指定小数位；反函数不是倒数。',
      'Check the right angle and acute reference, match O/A/H and select sine, cosine or tangent from the known sides. Unify length units before forming a dimensionless ratio. Acute sine/cosine require 0<ratio<1 and tangent >0. Audit invalid data rather than forcing a calculator result. Use the inverse in DEG mode, retain extra digits and round only the final answer; the inverse is not a reciprocal.',
    ],
    misconception: [
      '反函数找角，不是取倒数；DEG与RAD显示必须区分，指定一位小数需要保留尾零。',
      'Inverse functions find angles rather than reciprocals; distinguish DEG/RAD and retain trailing zeros for the prescribed precision.',
    ],
    prompts: [
      [
        '先指出给定直角和参照锐角，再匹配边。',
        'Locate the given right angle and reference acute angle before matching sides.',
      ],
      [
        '已知的是水平距离、视线距离、比值还是角？要求精确还是几位小数？',
        'Is the given quantity horizontal distance, sight distance, a ratio or an angle? Is the answer exact or rounded to stated places?',
      ],
    ],
  },
  {
    title: ['测量树高与坡度', 'Measuring heights and gradients'],
    lab: 'trig-height',
    objective: [
      '按距离种类、仪器高度和基面前提建立测高模型，并区分坡度百分数与坡角。',
      'Model height using the distance type, instrument height and base-level premises, distinguishing percentage grade from slope angle.',
    ],
    prerequisites: ['J96-L04', 'J94-L05', 'P62-L02'],
    keywords: [
      ['仰角', 'angle of elevation'],
      ['水平距离', 'horizontal distance'],
      ['坡度百分数', 'percentage grade'],
    ],
    hook: [
      '都写“10 m”，为什么水平量距和沿视线量距的结果不同？',
      'Why do horizontal and sight measurements both labelled ten metres give different heights?',
    ],
    items: [
      {
        stem: [
          '虚构直立树与观测地面同高，水平距12 m，仰角45°，仪器高1.5 m。求树高，恰好1位小数。',
          'A fictional vertical tree shares observer ground level. Horizontal distance is 12 m, elevation 45°, instrument height 1.5 m. Find full tree height to one decimal place.',
        ],
        answer: {
          kind: 'trig-rounded',
          value: '13.5',
          places: 1,
          unit: 'm',
        },
        steps: [
          [
            '高于仪器部分12tan45°=12 m，再加1.5得13.5 m。',
            'Rise above the instrument=12tan45°=12 m; add 1.5 for full height 13.5 m.',
          ],
        ],
        wrong: ['12.0', '13.50'],
        diagram: {
          kind: 'trig-height',
          distance: 12,
          degrees: 45,
          eye: 1.5,
        },
      },
      {
        stem: [
          '同样同高基面，水平距10 m，仰角30°，仪器高1.5 m。求树高，恰好1位小数。',
          'With equal base levels, horizontal distance 10 m, elevation 30° and instrument height 1.5 m, find height to one decimal place.',
        ],
        answer: {
          kind: 'trig-rounded',
          value: '7.3',
          places: 1,
          unit: 'm',
        },
        steps: [
          [
            'h=10tan30°+1.5≈7.2735 m，最后取7.3 m；不提前把tan30截成0.6。',
            'h=10tan30°+1.5≈7.2735 m, rounded finally to 7.3 m; do not first round tan30 to 0.6.',
          ],
        ],
        wrong: ['6.5', '5.8', '7.5'],
      },
      {
        stem: [
          '改为视线距离10 m，仰角30°，同高基面、仪器高1.5 m。求树高，恰好1位小数。',
          'Now ten metres is sight distance, with elevation 30°, equal base levels and instrument height 1.5 m. Find full height to one decimal place.',
        ],
        answer: {
          kind: 'trig-rounded',
          value: '6.5',
          places: 1,
          unit: 'm',
        },
        steps: [
          [
            '视线是斜边，高差=10sin30°=5，h=5+1.5=6.5 m。',
            'Sight distance is the hypotenuse, so rise=10sin30°=5 and h=6.5 m.',
          ],
        ],
        wrong: ['7.3', '5.0'],
        diagram: {
          kind: 'trig-height',
          distance: 10,
          degrees: 30,
          eye: 1.5,
          distanceKind: 'sight',
        },
      },
      {
        stem: [
          '虚构坡面竖升3 m、水平前进4 m、斜长5 m。求坡度百分数，恰好1位小数。',
          'A fictional slope rises 3 m over horizontal run 4 m, with inclined length 5 m. Find percentage grade to one decimal place.',
        ],
        answer: {
          kind: 'trig-rounded',
          value: '75.0',
          places: 1,
          unit: '%',
        },
        steps: [
          [
            '坡度百分数=3/4×100%=75.0%，不能用3/5。',
            'Percentage grade=3/4×100%=75.0%, not 3/5.',
          ],
        ],
        wrong: ['60.0', '36.9', '0.8'],
        diagram: {
          kind: 'trig-slope',
          rise: 3,
          run: 4,
        },
      },
      {
        stem: [
          '同一3 m竖升、4 m水平距的坡面，求坡角，恰好1位小数，单位度。',
          'For the same rise three and horizontal run four, find the slope angle in degrees to one decimal place.',
        ],
        answer: {
          kind: 'trig-rounded',
          value: '36.9',
          places: 1,
          unit: '°',
        },
        steps: [
          [
            'tanθ=3/4，θ=tan⁻¹(3/4)≈36.9°；75%不是75°。',
            'tanθ=3/4 gives θ=tan⁻¹(3/4)≈36.9°; 75% does not mean 75°.',
          ],
        ],
        wrong: ['75.0', '60.0'],
      },
      {
        stem: [
          '水平距12、仰角45°、仪器高1.5 m，但树基与观测地面高差未知。说明为何树高不唯一。',
          'Horizontal distance is twelve, elevation 45° and instrument height 1.5 m, but tree-base level difference is unknown. Explain why tree height is not unique.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: '顶点高于观测地面12tan45°+1.5=13.5 m。树基若在同高地面，树高13.5；若树基高2 m，树高11.5，原仰角与距离仍相同。未知高差不能设零，需补基面关系；图上同一水平辅助线是仪器高度，不自动代表树基地面。',
            en: 'The top is 12tan45°+1.5=13.5 m above observer ground. A base at that same level gives height 13.5; a base two metres higher gives 11.5 with the same angle and distance. Do not set an unknown level difference to zero. The horizontal auxiliary line is at instrument level, not automatically at tree-base ground.',
          },
        },
        steps: [
          [
            '顶点高于观测地面12tan45°+1.5=13.5 m。树基若在同高地面，树高13.5；若树基高2 m，树高11.5，原仰角与距离仍相同。未知高差不能设零，需补基面关系；图上同一水平辅助线是仪器高度，不自动代表树基地面。',
            'The top is 12tan45°+1.5=13.5 m above observer ground. A base at that same level gives height 13.5; a base two metres higher gives 11.5 with the same angle and distance. Do not set an unknown level difference to zero. The horizontal auxiliary line is at instrument level, not automatically at tree-base ground.',
          ],
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: [
        '已知“沿视线10 m、仰角30°”，求高于仪器部分应如何算？',
        'Given sight distance ten metres and elevation 30°, how do you find rise above the instrument?',
      ],
      options: [
        ['10tan30°', '10tan30°'],
        ['10sin30°', '10sin30°'],
        ['10cos30°', '10cos30°'],
      ],
      feedback: [
        [
          'tan需要水平邻边，10是视线斜边。',
          'Tangent needs horizontal adjacent distance; ten is the sight hypotenuse.',
        ],
        [
          '对边=斜边×sin30°，高差5 m。',
          'Opposite=hypotenuse×sin30°, giving rise five metres.',
        ],
        [
          'cos给水平距离，不是竖直高差。',
          'Cosine gives horizontal distance rather than rise.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '比较坡度百分数、坡角与坡面长度，写清三者不能互换，并说明零水平距的边界。',
      'Compare percentage grade, slope angle and inclined length, including the zero-run boundary.',
    ],
    rubric: [
      '3–4–5坡面：坡度75%=3/4×100%，坡角tan⁻¹(3/4)≈36.9°，斜长5 m。百分数无长度单位，角度用°，斜长用m。超过100%的坡度仍可能对应锐角，如竖升2水平1得200%；水平距为零则比值分母零，不能报有限坡度百分数。测高还需垂直目标、距离种类、仪器高与基面关系。',
      'For a 3–4–5 slope, grade=75%, angle≈36.9° and inclined length five metres. Percentage is a dimensionless rate, degrees measure angle and metres length. Grades above 100% can still correspond to acute angles, such as rise two/run one giving 200%. Zero horizontal run makes a zero denominator and no finite percentage grade. Height models also need verticality, distance type, instrument height and base levels.',
    ],
    misconception: [
      '水平距与视线距、仪器高差与完整树高、坡度百分数与角度必须分别处理。',
      'Separate horizontal from sight distance, rise above the instrument from full height, and percentage grade from angle.',
    ],
    prompts: [
      [
        '先指出给定直角和参照锐角，再匹配边。',
        'Locate the given right angle and reference acute angle before matching sides.',
      ],
      [
        '已知的是水平距离、视线距离、比值还是角？要求精确还是几位小数？',
        'Is the given quantity horizontal distance, sight distance, a ratio or an angle? Is the answer exact or rounded to stated places?',
      ],
    ],
  },
];

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
export const j96Lessons: Lesson[] = specs.map((s, i) => {
  const id = `J96-L0${i + 1}`;
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
    unit: 'J96',
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
      prompts: s.prompts.map(T),
      bridge: s.prerequisites[0]!,
    },
    ...(i === 4
      ? {
          familyChallenge: t(
            '纸上设计虚构校园测量卡：分别给水平12 m/45°和视线10 m/30°，仪器高1.5 m、目标直立且同高基面，画直角辅助线并求树高。再画竖升3、水平4、斜长5 m坡面，分别报告坡度百分数、坡角和长度。增加树基高2 m的反例，解释哪些已知保持而树高改变。家长核参照角、边身份、度数制、单位和最后舍入；无需实际户外测量、购买或上传。',
            'Create fictional school measurement cards on paper: horizontal 12 m at 45° and sight 10 m at 30°, with instrument height 1.5 m, vertical targets and equal base levels. Draw the right-triangle auxiliaries and calculate heights. Add a rise-three/run-four/length-five slope, reporting grade, angle and length separately. Give a base-two-metres-higher counterexample and explain which observations stay fixed while tree height changes. A parent checks reference angles, side roles, degree mode, units and final rounding. No outdoor measurement, purchase or upload is required.',
          ),
        }
      : {}),
  };
});
export function j96ReviewQuestion(id: string, round: number): Question {
  if (
    !/^J96-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid J96 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 80;
  let v: Item;
  if (i === 0 || i === 1 || i === 3) {
    const index = k % 6,
      c = trigTriangles[index]!,
      reference = (Math.floor(k / 6) % 2 ? 'B' : 'A') as TrigReference,
      scale = String(1 + (Math.floor(k / 12) % 3)),
      m = trigTriangle(c.adjacent, c.opposite, reference, scale),
      f = (
        i === 0
          ? 'sin'
          : i === 1
            ? Math.floor(k / 12) % 2
              ? 'tan'
              : 'cos'
            : (['sin', 'cos', 'tan'] as const)[Math.floor(k / 12) % 3]!
      ) as TrigFunction,
      ratio = m.ratio(f);
    if (i === 3) {
      const value = roundTrig(inverseTrig(f, ratio).degrees, 1);
      v = {
        stem: [
          `∠C=90°，参照锐角${reference}，已知${f}${reference}=${ratio}。求该角度数，恰好1位小数。`,
          `C=90°, reference acute ${reference}, with ${f}${reference}=${ratio}. Find that angle in degrees to exactly one decimal place.`,
        ],
        answer: { kind: 'trig-rounded', value, places: 1, unit: '°' },
        steps: [
          [
            `用${f}⁻¹及DEG模式，最后得到${value}°；不是取倒数。`,
            `Use ${f}⁻¹ in DEG mode, finally obtaining ${value}° rather than a reciprocal.`,
          ],
        ],
        wrong: ['0.0', '90.0'],
      };
    } else
      v = {
        stem: [
          `∠C=90°，AC=${m.sizes.AC}、BC=${m.sizes.BC}、AB=${m.sizes.AB}，参照${reference}。求${f}${reference}精确值。`,
          `C=90°, AC=${m.sizes.AC}, BC=${m.sizes.BC}, AB=${m.sizes.AB}, reference ${reference}. Find exact ${f}${reference}.`,
        ],
        answer: { kind: 'radical', value: ratio, simplified: false },
        steps: [
          [
            `O=${m.roles.opposite}、A=${m.roles.adjacent}、H=AB，按${f}定义得${ratio}，统一倍率${scale}约去。`,
            `O=${m.roles.opposite}, A=${m.roles.adjacent}, H=AB; the ${f} definition gives ${ratio}, cancelling common scale ${scale}.`,
          ],
        ],
        wrong: ['0', '-1'],
      };
  } else if (i === 2) {
    const degrees = 5 + 5 * (k % 17),
      f = (['sin', 'cos', 'tan'] as const)[Math.floor(k / 17) % 3]!,
      value = roundTrig(trigValues(degrees)[f]!, 4);
    v = {
      stem: [
        `求${f}${degrees}°，DEG模式，恰好4位小数。`,
        `Find ${f}${degrees}° in DEG mode to exactly four decimal places.`,
      ],
      answer: { kind: 'trig-rounded', value, places: 4 },
      steps: [
        [
          `锐角在定义域内，使用度数，最后四舍五入为${value}。`,
          `The angle is acute; use degrees and round only the final result to ${value}.`,
        ],
      ],
      wrong: ['-1.0000', '99.0000'],
    };
  } else if (k % 3 === 0) {
    const rise = 1 + (k % 5),
      run = 2 + (Math.floor(k / 5) % 8),
      m = slopeModel(String(rise), String(run)),
      value = roundTrig(m.percent, 1);
    v = {
      stem: [
        `虚构坡面竖升${rise}、水平距${run} m，求坡度百分数，恰好1位小数。`,
        `A fictional slope rises ${rise} over horizontal run ${run} m. Find percentage grade to exactly one decimal place.`,
      ],
      answer: { kind: 'trig-rounded', value, places: 1, unit: '%' },
      steps: [
        [
          `用竖升/水平距×100，得${value}%；不除斜长、不当作度数。`,
          `Use rise/horizontal run×100 to obtain ${value}%; do not use inclined length or degrees.`,
        ],
      ],
      wrong: ['0.0', '-1.0'],
    };
  } else {
    const distance = 4 + (k % 12),
      degrees = k % 2 ? 30 : 45,
      eye = [1, 1.5, 2][Math.floor(k / 12) % 3]!,
      kind = k % 4 < 2 ? 'horizontal' : 'sight',
      m = treeHeight(distance, degrees, eye, kind),
      value = roundTrig(m.height, 1);
    v = {
      stem: [
        `虚构直立树、同高基面；${kind === 'horizontal' ? '水平' : '视线'}距离${distance} m，仰角${degrees}°，仪器高${eye} m。求树高，恰好1位小数。`,
        `A fictional vertical tree shares observer base level; ${kind} distance ${distance} m, elevation ${degrees}°, instrument height ${eye} m. Find full height to exactly one decimal place.`,
      ],
      answer: { kind: 'trig-rounded', value, places: 1, unit: 'm' },
      steps: [
        [
          `先用${kind === 'horizontal' ? 'tan' : 'sin'}求高于仪器部分，再加${eye}，最后约${value} m。`,
          `Use ${kind === 'horizontal' ? 'tan' : 'sin'} for rise, add ${eye} and round finally to ${value} m.`,
        ],
      ],
      wrong: ['0.0', '-1.0'],
    };
  }
  return q(`${id}-R${round}`, i, v);
}
export const j96CheckQuestions: Question[] = [
  q('J96-CHECK-Q1', 0, specs[0]!.items[0]!),
  q('J96-CHECK-Q2', 1, specs[1]!.items[1]!),
  q('J96-CHECK-Q3', 2, specs[2]!.items[3]!),
  q('J96-CHECK-Q4', 3, specs[3]!.items[0]!),
  q('J96-CHECK-Q5', 4, specs[4]!.items[0]!),
  reasoning(
    'J96-CHECK-Q6',
    T(specs[4]!.reason),
    skills[4]!,
    T(specs[4]!.rubric),
    hints[4]!.map(T),
  ),
  pick('J96-CHECK-Q7', 4, specs[4]!.pick),
  reasoning(
    'J96-CHECK-Q8',
    T(specs[4]!.items[5]!.stem),
    skills[4]!,
    specs[4]!.items[5]!.answer.kind === 'explain'
      ? specs[4]!.items[5]!.answer.rubric
      : t('', ''),
    hints[4]!.map(T),
  ),
];
