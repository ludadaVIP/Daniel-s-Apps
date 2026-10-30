import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import {
  angleText,
  degreeToPi,
  circularAt,
  circularSolutions,
  solutionText,
  type CircularFamily,
} from '../circularModels';
import { rational, textR } from '../algebraModels';
import { readRational } from '../rationalModels';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = { stem: Pair; answer: AnswerSpec; step: Pair; wrong: string[] };
const I = (
  stem: Pair,
  answer: AnswerSpec,
  step: Pair,
  wrong: string[],
): Item => ({ stem, answer, step, wrong });
const N = (
  stem: Pair,
  value: string,
  step: Pair,
  wrong: string[],
  unit?: Extract<AnswerSpec, { kind: 'number' }>['unit'],
) => I(stem, { kind: 'number', value, unit }, step, wrong);
const A = (stem: Pair, value: string, step: Pair, wrong: string[]) =>
  I(
    stem,
    {
      kind: 'radian',
      coefficient: value,
      value: angleText(readRational(value)),
    },
    step,
    wrong,
  );
const V = (stem: Pair, value: string | null, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'circle-trig', value: value ?? 'undefined' }, step, wrong);
const S = (stem: Pair, values: string[], step: Pair, wrong: string[]) =>
  I(
    stem,
    {
      kind: 'radian-set',
      values,
      value: solutionText(
        values.map((v) => {
          const [n, d = '1'] = v.split('/');
          return rational(BigInt(n!), BigInt(d));
        }),
      ),
    },
    step,
    wrong,
  );
const P = (stem: Pair, value: string, step: Pair, wrong: string[]) =>
  I(
    stem,
    {
      kind: 'trig-identity',
      value,
      only: value === 's^2' ? 's' : value === 'c^2' ? 'c' : 'constant',
    },
    step,
    wrong,
  );
const E = (stem: Pair, rubric: Pair) =>
  I(stem, { kind: 'explain', rubric: T(rubric) }, rubric, []);
type Spec = {
  title: Pair;
  objective: Pair;
  hook: Pair;
  prerequisites: string[];
  keywords: Pair[];
  lab: Lesson['lab'];
  skill: string;
  hints: Pair[];
  items: Item[];
  pick: { stem: Pair; options: Pair[]; feedback: Pair[]; correct: number };
  reason: Pair;
  rubric: Pair;
  misconception: Pair;
};
const specs: Spec[] = [
  {
    title: ['角度与弧度', 'Degrees and radians'],
    objective: [
      '用弧长与半径之比解释弧度，并准确转换有向角。',
      'Explain radians as arc length divided by radius and convert directed angles exactly.',
    ],
    hook: [
      '同一个转角在小圆和大圆上截出不同弧长，为什么弧长/半径不变？',
      'The same turn cuts different arc lengths on small and large circles. Why does arc length/radius stay the same?',
    ],
    prerequisites: ['J95-L04', 'J96-L04', 'H03-L02'],
    keywords: [
      ['弧度', 'radian'],
      ['有向角', 'directed angle'],
      ['弧长', 'arc length'],
    ],
    lab: 'circular-radians',
    skill: 'radian-arc-ratio',
    hints: [
      [
        '弧度数θ=s/r，长度单位先统一；半周π rad=180°。',
        'The radian measure θ=s/r requires matching length units; half a turn is π rad=180°.',
      ],
      [
        '度数乘π/180变弧度；弧度乘180/π变度。顺时针为负，整周不可随意删。',
        'Multiply degrees by π/180 for radians, or radians by 180/π for degrees. Clockwise is negative; do not discard full turns when converting.',
      ],
    ],
    items: [
      A(
        [
          '150°等于多少弧度？用π的确切倍数。',
          'Convert 150° to radians as an exact multiple of π.',
        ],
        '5/6',
        [
          '150×π/180=5π/6，角度没有改变。',
          '150×π/180=5π/6; the angle itself is unchanged.',
        ],
        ['150pi', 'pi/6'],
      ),
      N(
        ['−3π/4 rad等于多少度？', 'Convert −3π/4 rad to degrees.'],
        '-135',
        [
          '−3π/4×180/π=−135°，保留方向。',
          '−3π/4×180/π=−135°, retaining direction.',
        ],
        ['135', '-45'],
        '°',
      ),
      I(
        [
          '半径3 cm，正向角2π/3 rad，弧长是多少？用π。',
          'A radius is 3 cm and a positive angle is 2π/3 rad. Find the arc length using π.',
        ],
        { kind: 'pi-multiple', coefficient: '2', value: '2pi', unit: 'cm' },
        [
          's=rθ=3×2π/3=2π cm；不能把120直接乘半径。',
          's=rθ=3×2π/3=2π cm; do not multiply the radius directly by 120.',
        ],
        ['360pi', 'pi'],
      ),
      A(
        [
          '把−450°转为弧度，保留完整转动量。',
          'Convert −450° to radians, retaining the complete directed rotation.',
        ],
        '-5/2',
        [
          '−450π/180=−5π/2；与−π/2终边相同但转动量不同。',
          '−450π/180=−5π/2. Its terminal ray matches −π/2, but the directed rotations differ.',
        ],
        ['-pi/2', '5pi/2'],
      ),
      A(
        ['720°是多少弧度？', 'Convert 720° to radians.'],
        '4',
        [
          '两整周共4π rad，而不是0 rad。',
          'Two complete turns total 4π rad, not zero radians.',
        ],
        ['0', '2pi'],
      ),
      N(
        [
          '纸上车轮半径0.4 m，正向扫过弧长0.6 m。转角是多少弧度？',
          'A paper wheel has radius 0.4 m and sweeps a positive arc of 0.6 m. Find the angle in radians.',
        ],
        '3/2',
        [
          'θ=s/r=0.6/0.4=1.5 rad；这是弧度数，不再乘π。',
          'θ=s/r=0.6/0.4=1.5 rad. This is already a radian measure; do not multiply by π again.',
        ],
        ['1.5pi', '0.24'],
        'rad',
      ),
    ],
    pick: {
      stem: [
        'θ为非负弧度数时，哪条公式给非负弧长s？',
        'For a nonnegative radian measure θ, which formula gives nonnegative arc length s?',
      ],
      options: [
        ['s=rθ', 's=rθ'],
        ['s=180rθ', 's=180rθ'],
        ['s=r/θ', 's=r/θ'],
      ],
      feedback: [
        [
          '由θ=s/r直接得到，s与r使用同单位。',
          'It follows directly from θ=s/r, with matching units for s and r.',
        ],
        [
          '180是角度与弧度转换的一部分，不在此公式中。',
          '180 belongs to unit conversion, not this formula.',
        ],
        [
          '这样会使角越小弧越长，与圆上关系相反。',
          'That would make smaller angles give longer arcs, reversing the circle relationship.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '纠错：“1 rad=1°；−450°转弧度后写−π/2即可。”',
      'Repair: “1 rad=1°; converting −450° gives −π/2.”',
    ],
    rubric: [
      '1 rad约57.3°，但换算用π rad=180°的确切关系。−450°=−5π/2；−π/2只是同终边代表，不能替换所问完整有向转动。',
      'One radian is about 57.3°, while exact conversions use π rad=180°. −450°=−5π/2; −π/2 is only a coterminal representative, not the requested complete directed rotation.',
    ],
    misconception: [
      '把弧度当度数、给s/r再乘π，或把同终边当同一个转动量。',
      'Treating radians as degrees, multiplying s/r by π again, or confusing coterminal rays with equal directed rotations.',
    ],
  },
  {
    title: ['单位圆与三角函数', 'Unit circle trigonometry'],
    objective: [
      '从单位圆有向角的坐标确定正弦、余弦和正切及其符号。',
      'Determine sine, cosine and tangent, including signs, from directed-angle coordinates on the unit circle.',
    ],
    hook: [
      '转到第二象限，长度仍然为正，为什么余弦却会是负的？',
      'Lengths stay positive in the second quadrant. Why can cosine be negative?',
    ],
    prerequisites: ['H04-L01', 'J96-L01', 'J96-L02', 'J75-L01'],
    keywords: [
      ['单位圆', 'unit circle'],
      ['象限', 'quadrant'],
      ['坐标', 'coordinates'],
    ],
    lab: 'circular-unit',
    skill: 'unit-circle-signed-coordinates',
    hints: [
      [
        '单位圆P=(cosθ,sinθ)，横坐标是余弦，纵坐标是正弦。',
        'On the unit circle P=(cosθ,sinθ): horizontal coordinate is cosine and vertical coordinate is sine.',
      ],
      [
        '正切=sinθ/cosθ，先查cosθ≠0；参考角给大小，象限给符号。',
        'Tangent is sinθ/cosθ, requiring cosθ≠0. A reference angle gives magnitudes and the quadrant gives signs.',
      ],
    ],
    items: [
      V(
        ['求cos(2π/3)的确切值。', 'Find cos(2π/3) exactly.'],
        '-1/2',
        [
          '120°位于第二象限，参考角60°的横坐标大小1/2，故为−1/2。',
          '120° is in quadrant II. Its 60° reference angle has horizontal magnitude 1/2, so the value is −1/2.',
        ],
        ['1/2', '-sqrt(3)/2'],
      ),
      V(
        ['求sin(5π/4)。', 'Evaluate sin(5π/4).'],
        '-sqrt(2)/2',
        [
          '225°在第三象限，纵坐标为−√2/2。',
          '225° is in quadrant III, with vertical coordinate −√2/2.',
        ],
        ['sqrt(2)/2', '-1/2'],
      ),
      V(
        [
          '求tan(π/2)；没有定义时写undefined。',
          'Evaluate tan(π/2); write undefined if it has no value.',
        ],
        null,
        [
          '此处cos=0，sin=1；1/0无定义，不是0或一个很大的实数。',
          'Here cos=0 and sin=1; 1/0 is undefined, not zero or a very large real number.',
        ],
        ['0', '1'],
      ),
      V(
        ['求cos(−π/3)。', 'Evaluate cos(−π/3).'],
        '1/2',
        [
          '关于横轴反射后横坐标不变，所以cos是偶函数。',
          'Reflection across the horizontal axis preserves the horizontal coordinate, so cosine is even.',
        ],
        ['-1/2', 'sqrt(3)/2'],
      ),
      V(
        ['求sin(13π/6)。', 'Evaluate sin(13π/6).'],
        '1/2',
        [
          '13π/6=2π+π/6，终点纵坐标与π/6相同。',
          '13π/6=2π+π/6, so its terminal vertical coordinate matches π/6.',
        ],
        ['-1/2', '13/6'],
      ),
      A(
        [
          '单位圆P=(−√3/2,−1/2)，在[0,2π)内求对应角。',
          'The unit-circle point is P=(−√3/2,−1/2). Find its angle in [0,2π).',
        ],
        '7/6',
        [
          '两坐标都负，第三象限；参考角π/6，故θ=π+π/6=7π/6。',
          'Both coordinates are negative: quadrant III. The reference angle is π/6, giving θ=π+π/6=7π/6.',
        ],
        ['pi/6', '5pi/6'],
      ),
    ],
    pick: {
      stem: [
        '单位圆在θ=π处，哪个正确？',
        'At θ=π on the unit circle, which is correct?',
      ],
      options: [
        ['P=(0,1)', 'P=(0,1)'],
        ['P=(−1,0)', 'P=(−1,0)'],
        ['tanθ无定义', 'tanθ is undefined'],
      ],
      feedback: [
        [
          '(0,1)对应π/2，注意坐标次序。',
          '(0,1) belongs to π/2; check coordinate order.',
        ],
        [
          '转半周到左端，cosπ=−1、sinπ=0。',
          'Half a turn reaches the left end: cosπ=−1 and sinπ=0.',
        ],
        ['cosπ=−1非零，tanπ=0。', 'cosπ=−1 is nonzero, so tanπ=0.'],
      ],
      correct: 1,
    },
    reason: [
      '“三角函数都是边长比，所以一定非负。”怎样修正到任意角？',
      'How should “trig functions are ratios of lengths, so must be nonnegative” be extended to arbitrary angles?',
    ],
    rubric: [
      '锐角直角三角形用正边长比；扩展定义用带符号的单位圆坐标。举第二象限cos<0或第三象限sin<0；tan为坐标商，cos=0时排除。',
      'Acute right-triangle ratios use positive side lengths. The extension uses signed unit-circle coordinates. Give a quadrant-II negative cosine or quadrant-III negative sine; tangent is the coordinate quotient and excludes cos=0.',
    ],
    misconception: [
      '交换横纵坐标、忽略象限负号、把tan在竖轴处当无穷大的函数值。',
      'Swapping coordinates, omitting quadrant signs or treating tangent at a vertical-axis point as an infinite function value.',
    ],
  },
  {
    title: ['正弦和余弦图像', 'Graphs of sine and cosine'],
    objective: [
      '将旋转角与单位圆坐标展开为正弦和余弦图像。',
      'Unwrap a rotating angle and unit-circle coordinates into sine and cosine graphs.',
    ],
    hook: [
      '单位圆上的点走一圈，把它的高度随角度记录，会画出怎样的曲线？',
      'Record the height of a point as it circles once. What curve does height against angle trace?',
    ],
    prerequisites: ['H04-L02', 'H02-L02', 'H02-L03'],
    keywords: [
      ['周期', 'period'],
      ['图像', 'graph'],
      ['奇偶性', 'parity'],
    ],
    lab: 'circular-graphs',
    skill: 'circular-coordinate-to-wave',
    hints: [
      [
        '横轴是弧度角，纵轴是对应坐标；sin读高度，cos读横坐标。',
        'The horizontal graph axis is the radian angle and the vertical axis its coordinate: sine uses height, cosine horizontal position.',
      ],
      [
        '一整周2π后重复；正弦奇、余弦偶，范围都为[−1,1]。零点、最大点与周期不同。',
        'Both repeat after 2π. Sine is odd and cosine even; both range from −1 to one. Distinguish zeros, maxima and periods.',
      ],
    ],
    items: [
      V(
        ['在y=sinx上，x=−π/2时y是多少？', 'On y=sinx, find y at x=−π/2.'],
        '-1',
        [
          '顺时针四分之一周到圆底，纵坐标−1。',
          'A clockwise quarter-turn reaches the bottom, with vertical coordinate −1.',
        ],
        ['1', '0'],
      ),
      A(
        [
          'y=sinx的最小正周期是多少弧度？',
          'What is the least positive period of y=sinx?',
        ],
        '2',
        [
          '整周2π后全部输出重复；π会反号，不是周期。',
          'A full 2π repeats every output; π reverses signs and is not a period.',
        ],
        ['pi', '4pi'],
      ),
      N(
        ['y=cosx的最大值是多少？', 'What is the maximum value of y=cosx?'],
        '1',
        [
          '单位圆横坐标不超过1，x=0时达到1。',
          'The horizontal coordinate is at most one and attains it at x=0.',
        ],
        ['0', '2'],
      ),
      S(
        [
          '在闭区间[0,2π]列出sinx的全部零点，用π表示。',
          'List all zeros of sinx on the closed interval [0,2π], using π.',
        ],
        ['0', '1', '2'],
        [
          '纵坐标在0、π、2π为0，闭区间包含两端。',
          'The vertical coordinate is zero at 0, π and 2π; both endpoints belong to the closed interval.',
        ],
        ['{0,pi}', '{pi}'],
      ),
      I(
        [
          '在全实数域，y=cosx是even还是odd？',
          'On the real domain, is y=cosx even or odd?',
        ],
        { kind: 'function-code', value: 'even' },
        [
          '反向旋转保持横坐标，cos(−x)=cosx。',
          'Reversing rotation preserves horizontal position: cos(−x)=cosx.',
        ],
        ['odd', 'neither'],
      ),
      V(
        [
          '纸上振动的位移给定d(t)=sin t，t以弧度参数计。求d(5π/2)。',
          'A paper oscillation has stipulated displacement d(t)=sin t with t a radian parameter. Find d(5π/2).',
        ],
        '1',
        [
          '5π/2=2π+π/2，完整一圈后再到顶点，位移1。',
          '5π/2=2π+π/2: one complete turn then the top gives displacement one.',
        ],
        ['0', '-1'],
      ),
    ],
    pick: {
      stem: [
        '关于y=sinx与y=cosx，哪个正确？',
        'Which statement about sine and cosine graphs is correct?',
      ],
      options: [
        ['两图都从(0,0)开始', 'Both pass through (0,0)'],
        ['sin0=0，cos0=1', 'sin0=0 and cos0=1'],
        ['每个π都是周期', 'Every π is a period'],
      ],
      feedback: [
        [
          'cos0=1，应分别读取横、纵坐标。',
          'cos0=1; read the two coordinates separately.',
        ],
        [
          '单位圆起点(1,0)给这两个函数值。',
          'The starting point (1,0) supplies these two values.',
        ],
        [
          '平移π会反号；最小正周期为2π。',
          'Shifting by π reverses signs; the least positive period is 2π.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '为什么sinx的两个相邻零点距离π，却不能说最小正周期为π？',
      'Why does a distance π between adjacent sine zeros not make π its least positive period?',
    ],
    rubric: [
      '周期要求所有x都满足f(x+T)=f(x)，不只零点相同。反例sin(π/2)=1而sin(3π/2)=−1；整周2π才恢复全部坐标。',
      'A period requires f(x+T)=f(x) for every x, not merely repeated zeros. sin(π/2)=1 but sin(3π/2)=−1 refutes π; a full 2π restores every coordinate.',
    ],
    misconception: [
      '把相邻零点间距当周期、把余弦起点当0，或用角度刻度读弧度轴。',
      'Mistaking zero spacing for a period, setting cosine’s initial value to zero or reading a radian axis as degrees.',
    ],
  },
  {
    title: ['振幅、周期与相位', 'Amplitude, period and phase'],
    objective: [
      '用内部角与源点追踪解释正弦模型的振幅、周期、相位和中线。',
      'Track the inner angle and source points to interpret amplitude, period, phase and midline in a sine model.',
    ],
    hook: [
      'y=3sin(2x−π)+4向右移π，还是π/2？怎样追踪同一个源点？',
      'Does y=3sin(2x−π)+4 shift right by π or π/2? How can tracking one source point decide?',
    ],
    prerequisites: ['H04-L03', 'H02-L04'],
    keywords: [
      ['振幅', 'amplitude'],
      ['最小正周期', 'least positive period'],
      ['相位移动', 'phase shift'],
    ],
    lab: 'circular-transform',
    skill: 'circular-inner-angle-transform',
    hints: [
      [
        '先写A sin(B(x−h))+D；振幅|A|、中线D，内部角是B(x−h)。',
        'Write A sin(B(x−h))+D first. Amplitude is |A| and midline D; the inner angle is B(x−h).',
      ],
      [
        'A≠0、B≠0时最小正周期2π/|B|；源点u映到x=h+u/B。A=0是常数，无最小正周期。',
        'For A≠0 and B≠0, the least positive period is 2π/|B|; a source input u maps to x=h+u/B. A=0 is constant and has no least positive period.',
      ],
    ],
    items: [
      N(
        [
          'y=−2sin(2(x−π/4))+1的振幅是多少？',
          'Find the amplitude of y=−2sin(2(x−π/4))+1.',
        ],
        '2',
        [
          '振幅为|−2|=2，负号表示竖直反射而不是负振幅。',
          'Amplitude is |−2|=2; the minus sign reflects vertically rather than making a negative amplitude.',
        ],
        ['-2', '1'],
      ),
      A(
        [
          'y=−2sin(2(x−π/4))+1的最小正周期是多少？',
          'Find the least positive period of y=−2sin(2(x−π/4))+1.',
        ],
        '1',
        [
          '内部倍率2使周期为2π/2=π，与竖直倍率和中线无关。',
          'The inner multiplier two gives period 2π/2=π, independently of vertical scale and midline.',
        ],
        ['2pi', '4pi'],
      ),
      A(
        [
          '把y=3sin(2x−π)+4写成标准形式，给向右相位移动h。',
          'Write y=3sin(2x−π)+4 in standard form and give its rightward phase shift h.',
        ],
        '1/2',
        [
          '2x−π=2(x−π/2)，所以h=π/2，不是π。',
          '2x−π=2(x−π/2), so h=π/2, not π.',
        ],
        ['pi', '-pi/2'],
      ),
      N(
        [
          'y=−2sin(2(x−π/4))+1的中线y=D中，D是多少？',
          'For the midline y=D of y=−2sin(2(x−π/4))+1, find D.',
        ],
        '1',
        [
          '上下极值3和−1的中点为1。',
          'The midpoint of extrema three and −1 is one.',
        ],
        ['-2', '3'],
      ),
      N(
        [
          'y=−2sin(2(x−π/4))+1在x=π/4时的值是多少？',
          'Evaluate y=−2sin(2(x−π/4))+1 at x=π/4.',
        ],
        '1',
        [
          '内部角0，sin0=0，因此y=1；源输入0对应x=h。',
          'The inner angle is zero and sin0=0, so y=1; source input zero maps to x=h.',
        ],
        ['0', '-1'],
      ),
      E(
        [
          '纸上模型y=3sin(2x−π)+4，写振幅、最小正周期、中线、相位移动，并追踪源正弦最高点。',
          'For the paper model y=3sin(2x−π)+4, give amplitude, least positive period, midline and phase shift, then track a source sine maximum.',
        ],
        [
          '改写3sin(2(x−π/2))+4，振幅3、周期π、中线4、右移π/2。源最高点u=π/2、sin u=1映到x=π/2+π/4=3π/4，输出7。参数形式的相位不要求唯一，可有整周期等价表示。',
          'Rewrite as 3sin(2(x−π/2))+4: amplitude three, period π, midline four and shift right π/2. Source maximum u=π/2 maps to x=π/2+π/4=3π/4, with output seven. Phase representations may differ by whole periods; uniqueness is not claimed.',
        ],
      ),
    ],
    pick: {
      stem: [
        'y=0sin(2(x−π/4))+1的最小正周期是什么？',
        'What is the least positive period of y=0sin(2(x−π/4))+1?',
      ],
      options: [
        ['π', 'π'],
        ['0', '0'],
        ['不存在最小正周期', 'There is no least positive period'],
      ],
      feedback: [
        [
          'π是此常数函数的一个周期，但不是最小正周期。',
          'π is a period of this constant function, but not a least positive one.',
        ],
        [
          '0不是正数，不能充当最小正周期。',
          'Zero is not positive and cannot be a least positive period.',
        ],
        [
          '任意正T都是周期，总能再减半，因此不存在最小正周期。',
          'Every positive T is a period and can be halved, so no least positive period exists.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '为什么振幅不能是−2？为什么不能在A=0时直接套最小正周期2π/|B|？',
      'Why cannot an amplitude be −2, and why does 2π/|B| not supply a least positive period when A=0?',
    ],
    rubric: [
      '振幅是最大最小值差的一半，非负；A负体现反射。A=0时函数恒为D，每个正平移量都保持值，故没有最小正周期；参数B和h不能从常数图唯一识别。',
      'Amplitude is half the range width and is nonnegative; negative A gives reflection. With A=0 the function equals D, and every positive shift preserves it, so no least positive period exists. B and h cannot be identified uniquely from that constant graph.',
    ],
    misconception: [
      '把A的符号当振幅、把Bx−C的C当h、或给常数函数强行指定最小周期。',
      'Treating the sign of A as amplitude, C in Bx−C as h, or forcing a least positive period onto a constant function.',
    ],
  },
  {
    title: ['简单三角恒等式', 'Basic trigonometric identities'],
    objective: [
      '用单位圆方程推导恒等式，并在变形时保留分母和符号条件。',
      'Derive identities from the unit-circle equation while retaining denominator and sign conditions.',
    ],
    hook: [
      '已知sinθ=3/5，为什么cosθ不一定等于4/5？',
      'If sinθ=3/5, why need cosine not be 4/5?',
    ],
    prerequisites: ['H04-L02', 'J81-L04', 'H01-L03'],
    keywords: [
      ['恒等式', 'identity'],
      ['定义域', 'domain'],
      ['符号', 'sign'],
    ],
    lab: 'circular-identities',
    skill: 'circular-identity-with-domain',
    hints: [
      [
        's=sinθ、c=cosθ时s²+c²=1，来自单位圆x²+y²=1。',
        'For s=sinθ and c=cosθ, s²+c²=1 follows from the unit-circle equation.',
      ],
      [
        '除以s或c前排除零；由平方求原值须结合象限，√(c²)=|c|。',
        'Exclude zero before dividing by s or c. Recovering a signed value from its square needs a quadrant; √(c²)=|c|.',
      ],
    ],
    items: [
      P(
        [
          '设s=sinθ、c=cosθ，把1−c²改写为只含s的等值多项式。',
          'Let s=sinθ and c=cosθ. Rewrite 1−c² as an equivalent polynomial using only s.',
        ],
        's^2',
        [
          '由s²+c²=1，两边减c²得到s²；适用于全部实数θ。',
          'Subtract c² from s²+c²=1 to obtain s², for every real θ.',
        ],
        ['s', '1+c^2'],
      ),
      P(
        [
          '用s=sinθ、c=cosθ把1−s²改写为只含c的多项式。',
          'For s=sinθ and c=cosθ, rewrite 1−s² using only c.',
        ],
        'c^2',
        [
          '从单位圆恒等式减s²，剩c²。',
          'Subtract s² from the unit-circle identity to leave c².',
        ],
        ['c', '1+s^2'],
      ),
      P(
        [
          '用s=sinθ、c=cosθ化简(s+c)²−2sc。',
          'With s=sinθ and c=cosθ, simplify (s+c)²−2sc.',
        ],
        '1',
        ['展开得s²+2sc+c²−2sc=s²+c²=1。', 'Expand to s²+2sc+c²−2sc=s²+c²=1.'],
        ['s+c', '0'],
      ),
      V(
        [
          'sinθ=3/5，θ在第二象限，求cosθ。',
          'Given sinθ=3/5 and θ in quadrant II, find cosθ.',
        ],
        '-4/5',
        [
          'cos²θ=1−9/25=16/25；第二象限横坐标负，所以cosθ=−4/5。',
          'cos²θ=1−9/25=16/25. The horizontal coordinate is negative in quadrant II, so cosθ=−4/5.',
        ],
        ['4/5', '-16/25'],
      ),
      E(
        [
          '化简(1−cos²θ)/sin²θ并写原定义域条件，能否在θ=0使用？',
          'Simplify (1−cos²θ)/sin²θ, state its original domain and decide whether θ=0 is allowed.',
        ],
        [
          '分子等于sin²θ，原分母要求sinθ≠0，即θ≠kπ（k为整数）；在此域上商为1。θ=0时原式0/0无定义，不能因化简后1有意义而补入。',
          'The numerator is sin²θ. The original denominator requires sinθ≠0, equivalently θ≠kπ for integers k; the quotient equals one on that domain. At θ=0 the original is 0/0, so the simplified constant cannot add that input back.',
        ],
      ),
      E(
        [
          '“cosθ=√(1−sin²θ)对任意实角成立。”给出反例并修正，说明怎样确定符号。',
          '“cosθ=√(1−sin²θ) for every real angle.” Give a counterexample, repair it and explain the sign choice.',
        ],
        [
          '取θ=π，左边−1、右边1，反例成立。确切式√(1−sin²θ)=|cosθ|；cosθ的正负由象限/轴的位置确定，不能从平方独自恢复。',
          'At θ=π the left side is −1 but the right side is one. The correct identity is √(1−sin²θ)=|cosθ|. The sign of cosine depends on quadrant or axis position and cannot be recovered from its square alone.',
        ],
      ),
    ],
    pick: {
      stem: ['哪项对所有实数θ成立？', 'Which holds for every real θ?'],
      options: [
        ['sinθ+cosθ=1', 'sinθ+cosθ=1'],
        ['sin²θ+cos²θ=1', 'sin²θ+cos²θ=1'],
        ['tanθ=sinθ/cosθ且无须条件', 'tanθ=sinθ/cosθ without restrictions'],
      ],
      feedback: [
        [
          'θ=π时左边−1，反例足以否定全称式。',
          'At θ=π the left side is −1; one counterexample refutes the universal claim.',
        ],
        [
          '这是单位圆坐标平方和等于1。',
          'This is the sum of squared unit-circle coordinates.',
        ],
        [
          '需要cosθ≠0，竖轴位置被排除。',
          'Require cosθ≠0, excluding vertical-axis positions.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '为什么几个角代入都成立不能代替恒等式证明？怎样用单位圆证明sin²θ+cos²θ=1？',
      'Why do several successful substitutions not prove an identity? How does the unit circle prove sin²θ+cos²θ=1?',
    ],
    rubric: [
      '有限成功例没有覆盖全部实数θ。任意角的单位圆点为(cosθ,sinθ)，满足x²+y²=1，所以恒等式对所有角成立；若有除法还须保留原域。单个反例可以否定一个全称命题。',
      'Finite examples do not cover every real angle. The unit-circle point (cosθ,sinθ) satisfies x²+y²=1 for any angle, proving the identity universally. Division additionally needs the original domain. One counterexample can refute a universal claim.',
    ],
    misconception: [
      '把平方和错作和、漏掉分母为零，或将主根当带符号原函数值。',
      'Replacing a sum of squares by a sum, dropping denominator exclusions or treating a principal root as a signed original value.',
    ],
  },
  {
    title: ['解简单三角方程', 'Solving basic trig equations'],
    objective: [
      '从单位圆的全部分支与周期生成候选，再筛出给定区间内的完整解集。',
      'Generate every unit-circle branch and period, then filter a complete solution set by the stipulated interval.',
    ],
    hook: [
      '计算器给arcsin(1/2)=π/6，为什么[0,2π)里仍有另一解？',
      'A calculator gives arcsin(1/2)=π/6. Why is there still another solution in [0,2π)?',
    ],
    prerequisites: ['H04-L03', 'H04-L04', 'H04-L05', 'H01-L05'],
    keywords: [
      ['解集', 'solution set'],
      ['分支', 'branches'],
      ['区间筛选', 'interval filtering'],
    ],
    lab: 'circular-equations',
    skill: 'circular-complete-finite-roots',
    hints: [
      [
        '先在一周期找全部分支：sin对应同高度，cos对应同横坐标，tan周期π。',
        'Find every branch in one period: equal heights for sine, equal horizontal positions for cosine, and period π for tangent.',
      ],
      [
        '再加周期，反解内部角，按原区间开闭和无定义点筛选；最后代回。',
        'Add periods, invert the inner angle, then filter by the original open/closed bounds and undefined points. Substitute into the original equation.',
      ],
    ],
    items: [
      S(
        [
          '解sinx=1/2，x∈[0,2π)，列全部解。',
          'Solve sinx=1/2 on [0,2π); list every solution.',
        ],
        ['1/6', '5/6'],
        [
          '单位圆同一高度给第一、第二象限π/6与5π/6，不能只取计算器主值。',
          'The common height gives quadrant-I and quadrant-II roots π/6 and 5π/6; the calculator principal value is not the full set.',
        ],
        ['{pi/6}', '{pi/6,7pi/6}'],
      ),
      S(
        ['解cosx=−1/2，x∈[0,2π]。', 'Solve cosx=−1/2 on [0,2π].'],
        ['2/3', '4/3'],
        [
          '同一负横坐标给第二、第三象限，2π/3与4π/3。',
          'A common negative horizontal coordinate gives quadrant II and III: 2π/3 and 4π/3.',
        ],
        ['{2pi/3}', '{pi/3,5pi/3}'],
      ),
      S(
        ['解sin(2x)=1/2，x∈[0,2π)。', 'Solve sin(2x)=1/2 on [0,2π).'],
        ['1/12', '5/12', '13/12', '17/12'],
        [
          '内部u=2x∈[0,4π)，两周期有四个分支，再全部除2。',
          'The inner u=2x spans [0,4π), giving four branches over two periods; divide every candidate by two.',
        ],
        ['{pi/12,5pi/12}', '{pi/6,5pi/6}'],
      ),
      S(
        ['解tanx=1，x∈[−π,π)。', 'Solve tanx=1 on [−π,π).'],
        ['-3/4', '1/4'],
        [
          'tan周期π，π/4+kπ筛得−3π/4和π/4；它们的cos均非零。',
          'From π/4+kπ and period π, filter −3π/4 and π/4; both have nonzero cosine.',
        ],
        ['{pi/4}', '{pi/4,5pi/4}'],
      ),
      S(
        ['解sinx=0，x∈(0,2π]。', 'Solve sinx=0 on (0,2π].'],
        ['1', '2'],
        [
          '候选kπ中0被开端点排除，π和2π保留。',
          'Among candidates kπ, the open lower bound excludes zero while π and 2π remain.',
        ],
        ['{0,pi}', '{pi}'],
      ),
      E(
        [
          '解2sin(x−π/4)+1=2，x∈[0,2π)，说明分支、周期、端点筛选并代回。',
          'Solve 2sin(x−π/4)+1=2 on [0,2π), explaining branches, periods, bounds and substitution.',
        ],
        [
          '先得sin u=1/2，u=x−π/4∈[−π/4,7π/4)。分支u=π/6+2kπ或5π/6+2kπ；加π/4后x=5π/12或13π/12。仅这两点在原域，代回均得2，其他周期候选被排除。',
          'First sin u=1/2 with u=x−π/4 in [−π/4,7π/4). Branches are u=π/6+2kπ or 5π/6+2kπ. Adding π/4 yields x=5π/12 or 13π/12. Only these lie in the original interval and both substitute to two; other period candidates are excluded.',
        ],
      ),
    ],
    pick: {
      stem: [
        '求sin(2x)=1/2、x∈[0,2π)时，u=2x属于哪个区间？',
        'For sin(2x)=1/2 on x∈[0,2π), what is the domain of u=2x?',
      ],
      options: [
        ['[0,π)', '[0,π)'],
        ['[0,2π)', '[0,2π)'],
        ['[0,4π)', '[0,4π)'],
      ],
      feedback: [
        [
          '乘2使区间扩为两倍，不是缩半。',
          'Multiplication by two doubles the interval instead of halving it.',
        ],
        [
          '这是x的区间，内部u还需乘2。',
          'That is the x interval; the inner u is multiplied by two.',
        ],
        [
          '正确，两周期各有两个同高度分支。',
          'Correct: two periods each contain two branches at the given height.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '“arcsin(1/2)=π/6，所以sinx=1/2只有一个实根。”解释错误并给全体实根的表示。',
      '“arcsin(1/2)=π/6, so sinx=1/2 has only one real root.” Explain and give every real root.',
    ],
    rubric: [
      'arcsin按主值范围只返回一个角。另一分支为5π/6，再加任意整数整周：x=π/6+2kπ或5π/6+2kπ，k∈ℤ。有区间时须对两分支全部筛选，不能把无穷全体与有限区间解混同。',
      'Arcsin returns one angle in its principal range. The other branch is 5π/6; add whole turns: x=π/6+2kπ or 5π/6+2kπ for k∈ℤ. A bounded question requires filtering both branches, distinguishing all real roots from its finite interval set.',
    ],
    misconception: [
      '只取反三角主值、忘了内部区间扩展，或把开端点和正切无定义点算作解。',
      'Keeping only an inverse-trig principal value, forgetting the transformed interval or including excluded bounds and tangent poles.',
    ],
  },
];
function q(id: string, i: number, v: Item): Question {
  const s = specs[i]!;
  if (v.answer.kind === 'explain')
    return reasoning(id, T(v.stem), s.skill, v.answer.rubric, s.hints.map(T));
  const value = 'value' in v.answer ? String(v.answer.value) : '';
  const result = numeric(
    id,
    T(v.stem),
    value,
    s.skill,
    s.hints.map(T),
    [T(s.hints[0]!), T(v.step)],
    { accepted: [value], rejected: v.wrong },
  );
  result.answer = v.answer;
  return result;
}
function pick(id: string, i: number): Question {
  const s = specs[i]!,
    p = s.pick;
  return choice(
    id,
    T(p.stem),
    p.correct,
    s.skill,
    p.options.map((v, j) => ({ text: T(v), feedback: T(p.feedback[j]!) })),
    s.hints.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const h04Lessons: Lesson[] = specs.map((s, i) => {
  const id = `H04-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    hook: T(s.hook),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: 20,
    lab: s.lab,
    stage: 'H10',
    unit: 'H04',
    order: i + 1,
    nzYearHints: [10, 11, 12],
    cnGradeHints: [10],
    contentStatus: 'ready',
    skillTags: [s.skill],
    guided: q(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i),
      ...s.items.slice(1, 5).map((v, j) => q(`${id}-Q${j + 2}`, i, v)),
      reasoning(`${id}-Q6`, T(s.reason), s.skill, T(s.rubric), s.hints.map(T)),
    ],
    exit: q(`${id}-X`, i, s.items[5]!),
    exitReason: T(s.objective),
    parent: {
      goal: T(s.objective),
      misconception: T(s.misconception),
      prompts: [
        t(
          '角的单位是什么？你读取的是横坐标还是纵坐标？',
          'What is the angle unit, and are you reading a horizontal or vertical coordinate?',
        ),
        t(
          '能说明全部分支、原定义域或代数依据吗？图上几个点够吗？',
          'Can you explain all branches, the original domain or the algebraic justification? Are a few graph points enough?',
        ),
      ],
      bridge: s.prerequisites[0]!,
    },
    ...(i === 5
      ? {
          familyChallenge: t(
            '纸上设计一个虚构观景轮高度模型H(t)=8+6sin(πt/10−π/2)，t以分钟计，0≤t≤20。标出最低2 m、最高14 m与20分钟一周，求高度8 m的全部时间并说明分支与边界。忽略真实设施细节，由家长审核模型与理由。',
            'On paper use the fictional viewing-wheel model H(t)=8+6sin(πt/10−π/2), with t in minutes on [0,20]. Mark minimum two metres, maximum 14 metres and a 20-minute turn. Find every time at height eight metres and explain branches and bounds. This ideal model omits real facility details; a parent reviews its reasoning.',
          ),
        }
      : {}),
  };
});
export function h04ReviewQuestion(id: string, round: number): Question {
  if (
    !/^H04-L0[1-6]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid H04 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 24;
  let v: Item;
  if (i === 0) {
    const degrees = 15 * (k - 8),
      a = degreeToPi(String(degrees));
    v = A(
      [
        `将${degrees}°转为弧度，保留完整转动。`,
        `Convert ${degrees}° to radians, retaining the complete rotation.`,
      ],
      textR(a),
      [
        '度数乘π/180，不先约去整圈。',
        'Multiply degrees by π/180 without first removing full turns.',
      ],
      ['999pi', '-999pi'],
    );
  } else if (i === 1 || i === 2) {
    const angle = rational(BigInt(k - (i === 1 ? 6 : 0)), 12n),
      family = (
        i === 1 ? ['sin', 'cos', 'tan'][k % 3] : ['sin', 'cos'][k % 2]
      ) as CircularFamily,
      m = circularAt(textR(angle));
    v = V(
      [
        `求${family}(${angleText(angle)})；无定义写undefined。`,
        `Evaluate ${family}(${angleText(angle)}); write undefined if needed.`,
      ],
      m[family],
      [
        '参考角、象限与坐标商共同核验。',
        'Audit the reference angle, quadrant and coordinate quotient.',
      ],
      ['999', '-999'],
    );
  } else if (i === 3) {
    const a = ((Math.floor(k / 4) % 3) + 1) * (k < 12 ? 1 : -1),
      b = (k % 4) + 1,
      stem: Pair = [
        `y=${a}sin(${b}x)+${Math.floor(k / 4)}，求${k % 2 ? '最小正周期（弧度）' : '振幅'}。`,
        `For y=${a}sin(${b}x)+${Math.floor(k / 4)}, find ${k % 2 ? 'the least positive period in radians' : 'the amplitude'}.`,
      ];
    v =
      k % 2
        ? A(
            stem,
            textR(rational(2n, BigInt(b))),
            ['周期2π/|B|。', 'The period is 2π/|B|.'],
            ['999pi', '-999pi'],
          )
        : N(
            stem,
            String(Math.abs(a)),
            [
              '振幅取外部倍率的绝对值。',
              'Amplitude is the absolute external scale.',
            ],
            ['999', '-999'],
          );
  } else if (i === 4) {
    const n = k + 2;
    v = N(
      [
        `对任意实角θ，求${n}sin²θ+${n}cos²θ−1。`,
        `For every real θ, evaluate ${n}sin²θ+${n}cos²θ−1.`,
      ],
      String(n - 1),
      [
        '提出公因数，使用单位圆平方和为1。',
        'Factor out the common coefficient and use the unit-circle sum of squares.',
      ],
      ['999', '-999'],
    );
  } else {
    const family = ['sin', 'cos', 'tan'][
        Math.floor(k / 4) % 3
      ] as CircularFamily,
      high = String((k % 4) + 1),
      target = k < 12 ? '0' : '1',
      rs = circularSolutions({
        family,
        b: '1',
        h: '0',
        target,
        low: '0',
        high,
        lowClosed: true,
        highClosed: false,
      });
    v = S(
      [
        `解${family}x=${target}，x∈[0,${angleText(rational(BigInt(high)))} )，列全部解。`,
        `Solve ${family}x=${target} on [0,${angleText(rational(BigInt(high)))}), listing every solution.`,
      ],
      rs.map(textR),
      [
        '一周期全部分支，加周期后按原区间筛选。',
        'Generate every branch and period, then filter the original interval.',
      ],
      ['{999pi}', '{-999pi}'],
    );
  }
  return q(`${id}-R${round}`, i, v);
}
export const h04CheckQuestions: Question[] = [
  q('H04-CHECK-Q1', 0, specs[0]!.items[3]!),
  q('H04-CHECK-Q2', 1, specs[1]!.items[1]!),
  q('H04-CHECK-Q3', 2, specs[2]!.items[3]!),
  q('H04-CHECK-Q4', 3, specs[3]!.items[1]!),
  q('H04-CHECK-Q5', 4, specs[4]!.items[2]!),
  pick('H04-CHECK-Q6', 3),
  q('H04-CHECK-Q7', 4, specs[4]!.items[4]!),
  q('H04-CHECK-Q8', 5, specs[5]!.items[5]!),
];
