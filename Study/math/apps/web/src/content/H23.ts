import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import {
  vec3,
  vec3Text,
  subVec3,
  midpointVec3,
  squareVec3,
  addVec3,
  scaleVec3,
  spatialAngle,
  vectorLine3,
  vectorPlane3,
  vectorLinePlaneRelation,
  pointPlaneProjection,
  spatialPlane,
} from '../spaceVectorModels';
import { rational, textR } from '../algebraModels';
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
const V = (stem: Pair, value: string, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'coordinate3', value }, step, wrong);
const R = (stem: Pair, value: string, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'radical', value }, step, wrong);
const C = (
  stem: Pair,
  value: Extract<AnswerSpec, { kind: 'solid-code' }>['value'],
  step: Pair,
  wrong: string[],
) => I(stem, { kind: 'solid-code', value }, step, wrong);
const A = (
  stem: Pair,
  value: Extract<AnswerSpec, { kind: 'vector-code' }>['value'],
  step: Pair,
  wrong: string[],
) => I(stem, { kind: 'vector-code', value }, step, wrong);
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
    title: ['三维坐标与向量', '3D coordinates and vectors'],
    objective: [
      '用终点减起点描述三维位移，并以分量核对中点与长度。',
      'Describe 3D displacement as head minus tail and verify midpoint and length from components.',
    ],
    hook: [
      '同一支空间箭头换了起点，三个分量一定会变吗？',
      'Must a spatial arrow’s three components change when its tail moves?',
    ],
    prerequisites: ['H06-L01', 'H05-L04', 'J75-L01'],
    keywords: [
      ['有序三元组', 'ordered triple'],
      ['位移', 'displacement'],
      ['空间中点', 'spatial midpoint'],
    ],
    lab: 'spatial-coordinates',
    hints: [
      [
        '点坐标从原点量，AB则逐分量用B−A；不能漏z。',
        'Point coordinates refer to an origin; subtract A from B in all three components.',
      ],
      [
        '中点逐坐标取平均，长度是位移三个分量平方和的非负根。',
        'Average each coordinate for a midpoint; length is the nonnegative root of the sum of squared displacement components.',
      ],
    ],
    items: [
      V(
        [
          'A(1,−2,3)、B(4,2,−1)，求向量AB的三分量。',
          'For A(1,−2,3),B(4,2,−1), give the three components of AB.',
        ],
        '(3,4,-4)',
        ['AB=(4−1,2−(−2),−1−3)=(3,4,−4)。', 'AB=(4−1,2−(−2),−1−3)=(3,4,−4).'],
        ['(-3,-4,4)', '(4,2,-1)', '(3,4,0)'],
      ),
      V(
        [
          '求A(1,−2,3)、B(4,2,−1)的中点坐标。',
          'Find the midpoint of A(1,−2,3),B(4,2,−1).',
        ],
        '(5/2,0,1)',
        [
          '逐坐标平均为((1+4)/2,(−2+2)/2,(3−1)/2)。',
          'Average corresponding endpoint coordinates: ((1+4)/2,(−2+2)/2,(3−1)/2).',
        ],
        ['(3/2,2,-2)', '(2,1,-1/2)', '(5,0,2)'],
      ),
      R(
        [
          '位移(3,4,−4)的精确长度是多少？',
          'What is the exact length of displacement (3,4,−4)?',
        ],
        'sqrt(41)',
        [
          '长度平方9+16+16=41，长度√41。',
          'Squared length is 9+16+16=41, giving √41.',
        ],
        ['41', '5', '-sqrt(41)'],
      ),
      V(
        [
          'A(1,−2,3)、B(4,2,−1)，求反向位移BA。',
          'For A(1,−2,3),B(4,2,−1), find reverse displacement BA.',
        ],
        '(-3,-4,4)',
        [
          'BA=A−B=−AB，三个符号都反向。',
          'BA=A−B=−AB, reversing all three component signs.',
        ],
        ['(3,4,-4)', '(-3,-4,-4)', '(1,-2,3)'],
      ),
      V(
        [
          '点B(4,2,−1)在xy平面上的正投影坐标是什么？',
          'Find the orthogonal projection of B(4,2,−1) onto the xy-plane.',
        ],
        '(4,2,0)',
        [
          'xy平面z=0，沿z方向投影，保留x、y。',
          'The xy-plane has z=0; projection along z preserves x and y.',
        ],
        ['(0,2,-1)', '(4,0,-1)', '(4,2,-1)'],
      ),
      E(
        [
          '在同一固定坐标系把A(1,−2,3)、B(4,2,−1)同时平移(2,−1,1)。给新端点、位移和中点，解释哪些量改变。',
          'In a fixed coordinate system translate A(1,−2,3),B(4,2,−1) by (2,−1,1). Give new endpoints, displacement and midpoint and explain what changes.',
        ],
        [
          'A′=(3,−3,4)、B′=(6,1,0)，B′−A′=(3,4,−4)=AB，长度仍√41。中点从(5/2,0,1)变成(9/2,−1,2)。共同平移在两端相减时抵消，点位置及中点改变，位移与长度不变。',
          'A′=(3,−3,4),B′=(6,1,0); B′−A′=(3,4,−4)=AB with length √41. The midpoint changes from (5/2,0,1) to (9/2,−1,2). The common translation cancels in endpoint subtraction; positions and midpoint change while displacement and length remain.',
        ],
      ),
    ],
    pick: {
      stem: [
        '点P(2,−1,3)在三维坐标中是什么意思？',
        'What does P(2,−1,3) mean in 3D coordinates?',
      ],
      correct: 1,
      options: [
        ['离原点距离为2−1+3=4', 'Its distance from the origin is 2−1+3=4'],
        [
          '按x、y、z顺序，三个带符号坐标为2、−1、3',
          'Its signed x,y,z coordinates are 2,−1,3 in that order',
        ],
        [
          '第三坐标可忽略，二维图已经足够',
          'The third coordinate can be ignored because the display is 2D',
        ],
      ],
      feedback: [
        [
          '坐标和不是长度；距离应为√(4+1+9)=√14。',
          'A coordinate sum is not length; the distance is √14.',
        ],
        [
          '三元组有顺序，各坐标相对所选原点与坐标轴。',
          'The ordered triple refers to the chosen origin and axes.',
        ],
        [
          '屏幕虽二维，模型仍有z，忽略会改变空间点。',
          'A 2D screen still represents z; omitting it changes the spatial point.',
        ],
      ],
    },
    reason: [
      '屏幕上两段线一样长，能否断言两空间向量等长？说明应核对什么。',
      'Can equal screen lengths establish equal spatial vector lengths? Explain what to check.',
    ],
    rubric: [
      '不能，正投影会缩短甚至压成一点。应核对各三维位移分量的平方和；换相机后坐标和真实长度不变，屏幕长度可变。',
      'No: orthographic projection can shorten a segment or collapse it to a point. Compare squared 3D displacement lengths. Camera changes preserve coordinates and actual lengths while screen lengths may change.',
    ],
    prompts: [
      [
        '先把点与位移分别读出来，哪一个依赖起点？',
        'Read the points and displacement separately; which uses a tail?',
      ],
      [
        '给两点同加一个三元组，检查位移的每一项如何抵消。',
        'Add one triple to both points and check cancellation component by component.',
      ],
    ],
    misconception: [
      '点坐标、自由向量与长度是不同对象，投影不删除z。',
      'Point coordinates, free vectors and lengths are different objects; projection does not remove z.',
    ],
  },
  {
    title: ['空间向量的线性运算', 'Operations on 3D vectors'],
    objective: [
      '在三个分量上完成加减与数乘，并用首尾相接核对结果。',
      'Perform addition, subtraction and scaling in all three components and verify by head-to-tail construction.',
    ],
    hook: [
      '平面中的首尾相接到了空间，第三分量应该怎样处理？',
      'How does the third component enter a head-to-tail construction in space?',
    ],
    prerequisites: ['H23-L01', 'H05-L03', 'J71-L03'],
    keywords: [
      ['逐分量', 'componentwise'],
      ['线性组合', 'linear combination'],
      ['数乘', 'scalar multiplication'],
    ],
    lab: 'spatial-operations',
    hints: [
      [
        '三个位置一一对应；减向量等于加其反向量。',
        'Match all three coordinates; subtracting a vector adds its opposite.',
      ],
      [
        '倍数同时乘每一分量，组合先算数乘再合并；零倍数没有方向。',
        'Scale every component before combining; a zero multiple has no direction.',
      ],
    ],
    items: [
      V(
        [
          'u=(1,2,−1)、v=(2,−1,3)，求u+v。',
          'For u=(1,2,−1),v=(2,−1,3), find u+v.',
        ],
        '(3,1,2)',
        [
          '逐项相加：(1+2,2−1,−1+3)=(3,1,2)。',
          'Add corresponding entries: (1+2,2−1,−1+3)=(3,1,2).',
        ],
        ['(3,1,3)', '(-1,3,-4)', '(2,-2,-3)'],
      ),
      V(
        [
          'u=(1,2,−1)、v=(2,−1,3)，求u−v。',
          'For u=(1,2,−1),v=(2,−1,3), find u−v.',
        ],
        '(-1,3,-4)',
        [
          '先反向v，得(1−2,2−(−1),−1−3)。',
          'Reverse v first: (1−2,2−(−1),−1−3).',
        ],
        ['(-1,1,2)', '(3,1,2)', '(1,-3,4)'],
      ),
      V(
        [
          'u=(1,2,−1)、v=(2,−1,3)，求2u−v。',
          'For u=(1,2,−1),v=(2,−1,3), find 2u−v.',
        ],
        '(0,5,-5)',
        [
          '2u=(2,4,−2)，减v得到(0,5,−5)。',
          '2u=(2,4,−2); subtract v to get (0,5,−5).',
        ],
        ['(0,2,-4)', '(4,3,1)', '(-2,5,-5)'],
      ),
      V(
        ['u=(1,2,−1)，求(−1/2)u。', 'For u=(1,2,−1), find (−1/2)u.'],
        '(-1/2,-1,1/2)',
        [
          '每个分量乘−1/2，方向反转且长度变一半。',
          'Multiply each entry by −1/2, reversing direction and halving length.',
        ],
        ['(-1/2,2,-1)', '(1/2,1,-1/2)', '(-1,-2,1)'],
      ),
      V(
        [
          '对u=(1,2,−1)，求0u的三分量。',
          'For u=(1,2,−1), give the three components of 0u.',
        ],
        '(0,0,0)',
        [
          '0乘每项均为0；零向量没有确定方向。',
          'Every scaled entry is zero; the zero vector has no defined direction.',
        ],
        ['(1,2,-1)', '(0,0,-1)', 'undefined'],
      ),
      E(
        [
          'u=(1,2,−1)、v=(2,−1,3)。写出2u−v并用逆运算验证；再用一般分量说明为何数乘必须作用三项。',
          'For u=(1,2,−1),v=(2,−1,3), find 2u−v and verify inversely. Use general components to explain why scaling acts on all three entries.',
        ],
        [
          'w=(0,5,−5)，w+v=(2,4,−2)=2u。若u=(a,b,c)、v=(d,e,f)，则2u−v=(2a−d,2b−e,2c−f)。漏乘第三项会改变空间位移，不能因投影图不明显就忽略。',
          'w=(0,5,−5), and w+v=(2,4,−2)=2u. In general, 2(a,b,c)−(d,e,f)=(2a−d,2b−e,2c−f). Failing to scale z changes spatial displacement, even when the projection hides that change.',
        ],
      ),
    ],
    pick: {
      stem: [
        '减去v的首尾作图应怎样做？',
        'How should subtraction of v be drawn head to tail?',
      ],
      correct: 2,
      options: [
        ['把v保持原向直接接到u后', 'Attach v unchanged after u'],
        ['只反转v的第三分量', 'Reverse only v’s third component'],
        [
          '先把v三分量全部取反，再接到u的终点',
          'Reverse all components of v, then attach −v at u’s head',
        ],
      ],
      feedback: [
        ['这是u+v，不是u−v。', 'This constructs u+v.'],
        [
          '反向要求所有分量取反，不能只改z。',
          'The opposite vector reverses every component.',
        ],
        [
          'u−v=u+(−v)，平移箭头不改其分量。',
          'u−v=u+(−v); translating an arrow preserves its components.',
        ],
      ],
    },
    reason: [
      '用u=(1,0,0)、v=(0,1,0)检验|u+v|是否总等于|u|+|v|。',
      'Use u=(1,0,0),v=(0,1,0) to test whether |u+v| always equals |u|+|v|.',
    ],
    rubric: [
      'u+v=(1,1,0)，长度√2；两原向量长度都1，总和2。√2≠2，所以向量相加不等于长度直接相加；同向共线时才有这个等号。',
      'u+v=(1,1,0) has length √2, while the two lengths sum to two. Thus vector addition is not general addition of lengths; equality holds for same-direction collinear vectors.',
    ],
    prompts: [
      [
        '先说每支箭头的分量，再说接在哪里。',
        'State each arrow’s components before its position.',
      ],
      [
        '用w+v=2u验算2u−v，第三分量是否也恢复？',
        'Check 2u−v using w+v=2u; does z recover too?',
      ],
    ],
    misconception: [
      '线性运算作用全部三个分量，模不是线性函数。',
      'Linear operations act on all three entries; norm is not a linear function.',
    ],
  },
  {
    title: ['空间数量积与夹角', 'Dot products and spatial angles'],
    objective: [
      '用三维数量积及非零条件确定向量夹角，区分点积与余弦。',
      'Use the 3D dot product and nonzero conditions to determine vector angles, distinguishing dot product from cosine.',
    ],
    hook: [
      '两个向量数量积为0，就一定能说夹角90°吗？',
      'Does a zero dot product always mean a 90° angle?',
    ],
    prerequisites: ['H23-L02', 'H05-L05', 'J91-L03'],
    keywords: [
      ['数量积', 'dot product'],
      ['向量夹角', 'vector angle'],
      ['非零条件', 'nonzero condition'],
    ],
    lab: 'spatial-dot',
    hints: [
      [
        '数量积是三项对应乘积之和，结果为实数。',
        'The dot product is the sum of three matching products and is a scalar.',
      ],
      [
        '两向量非零才除以|u||v|；点积符号定锐钝，零向量无夹角。',
        'Divide by |u||v| only for nonzero vectors; the sign distinguishes acute/obtuse, while a zero vector has no angle.',
      ],
    ],
    items: [
      N(
        [
          'u=(1,2,−1)、v=(2,−1,0)，求u·v。',
          'For u=(1,2,−1),v=(2,−1,0), find u·v.',
        ],
        '0',
        [
          '1×2+2×(−1)+(−1)×0=0，两者非零所以垂直。',
          '1×2+2×(−1)+(−1)×0=0; both are nonzero, so they are perpendicular.',
        ],
        ['-1', '2', '(2,-2,0)'],
      ),
      R(
        [
          'u=(1,2,−1)、v=(1,0,0)，求向量夹角的精确余弦。',
          'For u=(1,2,−1),v=(1,0,0), find the exact cosine of their vector angle.',
        ],
        'sqrt(6)/6',
        [
          '数量积1，模之积√6，cosθ=1/√6=√6/6。',
          'The dot product is one and norm product √6, so cosθ=1/√6=√6/6.',
        ],
        ['1', 'sqrt(6)', '-sqrt(6)/6'],
      ),
      A(
        [
          'u=(1,2,−1)、v=(−1,−2,1)，夹角类型用zero-angle、straight、acute、right、obtuse或undefined表示。',
          'For u=(1,2,−1),v=(−1,−2,1), classify their angle as zero-angle, straight, acute, right, obtuse or undefined.',
        ],
        'straight',
        [
          'v=−u且非零，cosθ=−1，向量夹角180°。',
          'v=−u≠0, so cosθ=−1 and the vector angle is 180°.',
        ],
        ['zero-angle', 'right', 'undefined'],
      ),
      A(
        [
          'u=(0,0,0)、v=(1,2,3)，向量夹角类型是什么？',
          'For u=(0,0,0),v=(1,2,3), what is their vector angle type?',
        ],
        'undefined',
        [
          '数量积为0但分母|u||v|=0，夹角无定义。',
          'The dot product is zero but |u||v|=0, so the angle is undefined.',
        ],
        ['right', 'zero-angle', 'straight'],
      ),
      R(
        [
          'u=(1,0,0)、v=(−1,1,0)，求向量夹角的余弦。',
          'For u=(1,0,0),v=(−1,1,0), find their vector-angle cosine.',
        ],
        '-sqrt(2)/2',
        [
          '点积−1，模之积√2，余弦−√2/2，向量角135°。',
          'Dot product −1 and norm product √2 give cosine −√2/2 and vector angle 135°.',
        ],
        ['sqrt(2)/2', '-1', '1'],
      ),
      E(
        [
          '用零向量与一个非零向量给“u·v=0就一定有90°夹角”一个反例，再补全正确条件并给有效例子。',
          'Give a zero-vector counterexample to “u·v=0 always gives a 90° angle”, then state correct conditions and a valid example.',
        ],
        [
          'u=(0,0,0)、v=(1,2,3)点积0，但u无方向，夹角分母为0。需u、v均非零；此时点积0等价于cosθ=0，夹角90°。有效例u=(1,2,−1)、v=(2,−1,0)，点积2−2+0=0且两模非零。',
          'u=(0,0,0),v=(1,2,3) have dot product zero, but u has no direction and the angle denominator vanishes. Require both vectors nonzero; then dot zero is equivalent to cosine zero and a 90° angle. A valid example is (1,2,−1) and (2,−1,0), whose dot product is zero and norms are nonzero.',
        ],
      ),
    ],
    pick: {
      stem: [
        '数量积与夹角公式哪句话正确？',
        'Which statement about dot products and angle formulas is correct?',
      ],
      correct: 0,
      options: [
        [
          '点积是实数；夹角公式需要两向量均非零',
          'The dot product is a scalar; the angle formula requires both vectors nonzero',
        ],
        [
          '点积就是余弦，无须除模长',
          'The dot product is cosine without dividing by lengths',
        ],
        [
          '投影图里是直角，空间一定是直角',
          'A right angle in projection must be right in space',
        ],
      ],
      feedback: [
        [
          '三项乘积之和为标量，非零条件防止除0。',
          'The sum of three products is a scalar; nonzero norms prevent division by zero.',
        ],
        [
          '一般要归一化；只有特定单位向量情形才数值相同。',
          'Normalisation is generally needed; numerical equality requires special unit-vector conditions.',
        ],
        [
          '投影不保持一般空间角，必须核对点积。',
          'Projection does not preserve arbitrary spatial angles; check the dot product.',
        ],
      ],
    },
    reason: [
      'u=(1,0,0)、v=(−1,1,0)的向量夹角135°。它们作两条相交直线的方向时，为什么两直线的较小夹角为45°？',
      'Vectors (1,0,0),(−1,1,0) have angle 135°. Why is the smaller angle between lines with these directions 45°?',
    ],
    rubric: [
      '向量有指定方向，cosθ=−√2/2给135°。直线无指定朝向，v换成−v不改直线，可取补角180°−135°=45°；较小线角用绝对点积作余弦分子，不能混用两种角约定。',
      'Directed vectors give cosine −√2/2 and 135°. A line has no chosen orientation, so reversing v does not change it. The smaller line angle is the supplement, 45°, using the absolute dot product in its cosine numerator. Keep the angle conventions distinct.',
    ],
    prompts: [
      [
        '先检查模长是否0，再谈角。',
        'Check for zero norms before talking about an angle.',
      ],
      [
        '把v改成−v，向量角和直线角各怎样变化？',
        'Reverse v: how do the vector angle and the smaller line angle change?',
      ],
    ],
    misconception: [
      '零点积不自动创造夹角，方向角与较小线角有不同约定。',
      'Zero dot product does not create an angle; directed vector and smaller line angles follow different conventions.',
    ],
  },
  {
    title: ['直线与平面的关系', 'Relationships between lines and planes'],
    objective: [
      '用非零方向/法向及点的位置判断线面关系，不用投影外观代替条件。',
      'Use nonzero directions, normals and point positions to classify line-plane relations without relying on projected appearance.',
    ],
    hook: [
      'u·n=0之后，还要查什么才能区分“平行”与“在平面内”？',
      'After u·n=0, what else distinguishes parallel from contained?',
    ],
    prerequisites: ['H23-L03', 'H06-L01', 'H22-L01'],
    keywords: [
      ['方向向量', 'direction vector'],
      ['法向量', 'normal vector'],
      ['位置条件', 'position condition'],
    ],
    lab: 'spatial-relations',
    hints: [
      [
        '直线X=A+tu、平面n·X=d，u和n都必须非零。',
        'For line X=A+tu and plane n·X=d, both u and n must be nonzero.',
      ],
      [
        '代入得到n·A+t(n·u)=d；系数非零唯一交点，系数0再看常数。',
        'Substitution gives n·A+t(n·u)=d. Nonzero coefficient gives one intersection; a zero coefficient requires checking the constant.',
      ],
    ],
    items: [
      C(
        [
          '直线X=(0,0,1)+t(1,0,0)，平面z=0。判断parallel、contained或intersecting。',
          'Classify X=(0,0,1)+t(1,0,0) relative to plane z=0 as parallel, contained or intersecting.',
        ],
        'parallel',
        [
          'u·n=0，但直线所有点z=1，不在z=0上，所以严格平行。',
          'u·n=0 but every line point has z=1, so it is strictly parallel outside z=0.',
        ],
        ['contained', 'intersecting', 'skew'],
      ),
      C(
        [
          '直线X=(0,0,0)+t(1,0,0)与平面z=0是什么关系？',
          'Classify X=(0,0,0)+t(1,0,0) relative to z=0.',
        ],
        'contained',
        [
          '方向沿平面，基点在平面内；所有直线点满足z=0。',
          'Its direction lies along the plane and its base point is on it, so all points satisfy z=0.',
        ],
        ['parallel', 'intersecting', 'skew'],
      ),
      C(
        [
          '直线X=(0,0,1)+t(1,0,−1)与平面z=0是什么关系？',
          'Classify X=(0,0,1)+t(1,0,−1) relative to z=0.',
        ],
        'intersecting',
        [
          'n·u=−1≠0，1−t=0给唯一t=1。',
          'n·u=−1≠0; 1−t=0 gives unique parameter t=1.',
        ],
        ['parallel', 'contained', 'skew'],
      ),
      V(
        [
          '求X=(0,0,1)+t(1,0,−1)与z=0的交点坐标。',
          'Find the intersection of X=(0,0,1)+t(1,0,−1) and z=0.',
        ],
        '(1,0,0)',
        ['由1−t=0得t=1，代回X=(1,0,0)。', '1−t=0 gives t=1, then X=(1,0,0).'],
        ['(0,0,1)', '(1,0,-1)', '(0,0,0)'],
      ),
      C(
        [
          '平面α:z=0与β:−2z=−4是什么关系？',
          'Classify planes α:z=0 and β:−2z=−4.',
        ],
        'parallel',
        [
          '法向平行，但β是z=2，不与α重合。',
          'Normals are parallel, but β is z=2 and does not coincide with α.',
        ],
        ['coincident', 'intersecting', 'contained'],
      ),
      E(
        [
          '由X=A+tu、n·X=d推导平行、在平面内和唯一相交的判据，并说明线面垂直对应什么方向条件。',
          'Derive strict parallel, contained and unique-intersection tests from X=A+tu and n·X=d, and state the direction condition for line-plane perpendicularity.',
        ],
        [
          'u、n均非零。代入n·A+t(n·u)=d；n·u≠0时t=(d−n·A)/(n·u)唯一。n·u=0且n·A=d时全线在内，否则严格平行。线面垂直要求u与n平行，即u为n的非零倍数；不是u·n=0。投影图中的交叉或直角不能替代这些条件。',
          'Require u,n nonzero. Substitution gives n·A+t(n·u)=d. If n·u≠0, t=(d−n·A)/(n·u) is unique. If n·u=0, equality n·A=d means contained; otherwise strictly parallel. A perpendicular line has u a nonzero scalar multiple of n, rather than u·n=0. Screen crossings or right angles cannot replace these tests.',
        ],
      ),
    ],
    pick: {
      stem: [
        'u·n=0，关于直线X=A+tu和平面n·X=d，还能确定什么？',
        'If u·n=0, what can be concluded about X=A+tu and n·X=d?',
      ],
      correct: 2,
      options: [
        ['一定严格平行', 'They must be strictly parallel'],
        ['一定垂直', 'They must be perpendicular'],
        [
          '需代入A；可能全线在内，也可能严格平行',
          'Test A: the line may be contained or strictly parallel',
        ],
      ],
      feedback: [
        [
          '若A在平面上，整条线也在平面上。',
          'If A lies on the plane, the whole line does.',
        ],
        [
          'u·n=0表示方向沿平面，线面垂直反而需要u与n平行。',
          'u·n=0 means the direction runs along the plane; perpendicularity needs u parallel to n.',
        ],
        [
          '方向条件还需位置条件，这个分支不能省。',
          'The direction test must be combined with position.',
        ],
      ],
    },
    reason: [
      '直线l=(t,0,0)、m=(0,1+s,1)的方向点积为0。解释为何它们不是相交直线，而是skew。',
      'Lines l=(t,0,0),m=(0,1+s,1) have direction dot product zero. Explain why they are skew rather than intersecting.',
    ],
    rubric: [
      '方向分别(1,0,0)、(0,1,0)，点积0只说明方向垂直。l所有点z=0，m所有点z=1，永不相交；方向又不平行，所以为空间异面直线。投影可能看似相交，不能删除z位置条件。',
      'Directions (1,0,0),(0,1,0) have zero dot product, which concerns directions only. All points of l have z=0 and all points of m have z=1, so they never meet. With nonparallel directions they are skew. A projected crossing does not remove the z-position condition.',
    ],
    prompts: [
      [
        '把方向条件和基点代入条件分别写一行。',
        'Write the direction and base-point tests separately.',
      ],
      [
        '用两条z不同的直线检验“屏幕相交”的判断。',
        'Test a screen crossing with lines at different z values.',
      ],
    ],
    misconception: [
      '方向关系不能代替位置关系；线面垂直与方向向量垂直法向恰好不同。',
      'A direction relation is not a position relation; line-plane perpendicularity requires direction parallel to the normal.',
    ],
  },
  {
    title: ['空间距离的向量方法', 'Vector methods for spatial distance'],
    objective: [
      '用正交投影构造垂足并证明点到空间直线或平面的最短距离。',
      'Construct perpendicular feet using orthogonal projection and justify shortest distance to a spatial line or plane.',
    ],
    hook: [
      '空间中的最短线段PH，怎样只用向量和坐标求出来？',
      'How can vectors and coordinates locate the shortest spatial segment PH?',
    ],
    prerequisites: ['H23-L04', 'H22-L02', 'H06-L04'],
    keywords: [
      ['正交投影', 'orthogonal projection'],
      ['垂足', 'perpendicular foot'],
      ['最短距离', 'shortest distance'],
    ],
    lab: 'spatial-distance',
    hints: [
      [
        '平面用非零法向，直线用非零方向；垂足必须在指定对象上。',
        'Use a nonzero plane normal or line direction; the foot must lie on the stated object.',
      ],
      [
        '点到平面沿法向扣去分量；点到直线取沿方向的分量，再用P−H求非负长度。',
        'Subtract the normal component for a plane; retain the direction component for a line, then take the nonnegative length of P−H.',
      ],
    ],
    items: [
      R(
        [
          '求P(3,4,5)到平面x+2y+2z=3的精确距离。',
          'Find the exact distance from P(3,4,5) to plane x+2y+2z=3.',
        ],
        '6',
        [
          '代入差18，法向模√(1+4+4)=3，距离|18|/3=6。',
          'The substitution residual is 18 and normal length three, giving |18|/3=6.',
        ],
        ['18', '2', '-6'],
      ),
      V(
        [
          '求P(3,4,5)到平面x+2y+2z=3的垂足坐标。',
          'Find the perpendicular foot from P(3,4,5) to x+2y+2z=3.',
        ],
        '(1,0,1)',
        [
          'H=P−(18/9)(1,2,2)=(1,0,1)，代平面得3。',
          'H=P−(18/9)(1,2,2)=(1,0,1), which satisfies the plane.',
        ],
        ['(3,4,0)', '(2,4,4)', '(-1,0,-1)'],
      ),
      V(
        [
          '求P(3,4,5)到直线X=(1,0,1)+t(1,1,0)的垂足。',
          'Find the foot from P(3,4,5) to X=(1,0,1)+t(1,1,0).',
        ],
        '(4,3,1)',
        [
          'P−A=(2,4,4)，t=((2,4,4)·(1,1,0))/2=3，H=(4,3,1)。',
          'P−A=(2,4,4), so t=6/2=3 and H=(4,3,1).',
        ],
        ['(1,0,1)', '(3,4,1)', '(1,2,2)'],
      ),
      R(
        [
          '求P(3,4,5)到直线X=(1,0,1)+t(1,1,0)的精确距离。',
          'Find the exact distance from P(3,4,5) to X=(1,0,1)+t(1,1,0).',
        ],
        '3sqrt(2)',
        [
          'P−H=(−1,1,4)，距离平方1+1+16=18，距离3√2。',
          'P−H=(−1,1,4), with squared length 18 and length 3√2.',
        ],
        ['sqrt(6)', '6', '18'],
      ),
      N(
        [
          'P(1,0,1)到平面x+2y+2z=3的距离是多少？',
          'What is the distance from P(1,0,1) to x+2y+2z=3?',
        ],
        '0',
        [
          '点已在平面上，垂足等于自身，距离0有定义。',
          'The point lies on the plane, so its foot is itself and zero distance is defined.',
        ],
        ['undefined', '1', '3'],
      ),
      E(
        [
          '对P(3,4,5)，分别求到平面x+2y+2z=3与直线X=(1,0,1)+t(1,1,0)的垂足和距离。把平面方程或直线方向乘−2后，说明结果为何不变。',
          'For P(3,4,5), find feet and distances to x+2y+2z=3 and X=(1,0,1)+t(1,1,0). Explain invariance when scaling the plane equation or line direction by −2.',
        ],
        [
          '平面垂足(1,0,1)，位移(2,4,4)=2n，距离6；直线垂足(4,3,1)，残余(−1,1,4)与u点积0，距离3√2。平面法向与右端同乘−2，归一化投影不变；直线方向乘−2后参数从3变−3/2，但几何直线、H和距离不变。不能只乘平面法向而漏乘右端。',
          'The plane foot is (1,0,1), displacement (2,4,4)=2n, distance six. The line foot is (4,3,1), residual (−1,1,4) has dot zero with u, and distance is 3√2. Scaling both plane normal and right side by −2 preserves its normalised projection. Scaling line direction by −2 changes parameter three to −3/2 but preserves the line, foot and distance. Scaling the plane normal alone without its right side would change the plane.',
        ],
      ),
    ],
    pick: {
      stem: [
        '点到空间对象的距离应怎样核对？',
        'How should distance to a spatial object be checked?',
      ],
      correct: 1,
      options: [
        ['直接在投影图中量PH', 'Measure PH on the projection'],
        [
          'H在对象上，PH垂直对象，再算三维长度',
          'Verify H lies on the object and PH is perpendicular, then calculate its 3D length',
        ],
        ['任选对象上的点连起来就可以', 'Join P to any point on the object'],
      ],
      feedback: [
        [
          '投影改变长度，不能直接量读。',
          'Projection changes lengths and is not a measurement.',
        ],
        [
          '垂足与勾股共同保证最短，并保留非负长度。',
          'The foot and Pythagoras justify shortest nonnegative length.',
        ],
        [
          '任意连线通常更长；必须验证垂直。',
          'An arbitrary segment is generally longer; verify perpendicularity.',
        ],
      ],
    },
    reason: [
      '为什么正交垂足H给最短距离？对对象上任意点Q，用P−H与Q−H解释。',
      'Why does the orthogonal foot H give shortest distance? Use P−H and Q−H for an arbitrary point Q on the object.',
    ],
    rubric: [
      'H在直线或平面上，P−H垂直其所有相应切向位移Q−H，所以点积为0。PQ²=PH²+HQ²≥PH²，且Q=H取等号；P本来在对象上时距离0。非零方向/法向保证对象与投影公式有定义。',
      'H lies on the line or plane and P−H is perpendicular to tangent displacement Q−H. Their dot product is zero, so PQ²=PH²+HQ²≥PH², with equality at Q=H. A point already on the object has zero distance. Nonzero directions/normals ensure the object and projection formula are defined.',
    ],
    prompts: [
      [
        '先核H在线上或平面上，再核残余的方向。',
        'Verify foot incidence before checking residual direction.',
      ],
      [
        '把方程或方向换成非零倍数，哪些参数变、哪些几何量不变？',
        'Under nonzero rescaling, which parameters change and which geometric quantities stay fixed?',
      ],
    ],
    misconception: [
      '最短距离是垂直残余的长度，不是任意投影长度；零距离与零法向不同。',
      'Shortest distance is perpendicular residual length, not arbitrary projected length; zero distance differs from a zero normal.',
    ],
  },
];
function question(id: string, i: number, item: Item): Question {
  const s = specs[i]!,
    skill = `space-vector-${i + 1}`;
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
    `space-vector-${i + 1}`,
    p.options.map((v, j) => ({ text: T(v), feedback: T(p.feedback[j]!) })),
    s.hints.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const h23Lessons: Lesson[] = specs.map((s, i) => {
  const id = `H23-L0${i + 1}`;
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
    unit: 'H23',
    order: i + 1,
    nzYearHints: [11, 12],
    cnGradeHints: [11],
    contentStatus: 'ready',
    skillTags: [`space-vector-${i + 1}`],
    guided: question(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i),
      ...s.items.slice(1, 5).map((v, j) => question(`${id}-Q${j + 2}`, i, v)),
      reasoning(
        `${id}-Q6`,
        T(s.reason),
        `space-vector-${i + 1}`,
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
    ...(i === 4 ? { familyChallenge: T(s.items[5]!.stem) } : {}),
  };
});
export function h23ReviewQuestion(id: string, round: number): Question {
  if (
    !/^H23-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid H23 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 24,
    x = -2 + (k % 4),
    y = -1 + (Math.floor(k / 4) % 3),
    z = 1 + Math.floor(k / 12),
    u = vec3(x, y, z),
    v = vec3(1, -1, 2);
  let item: Item;
  if (i === 0) {
    const a = vec3(x, -1, 2),
      b = vec3(2, y, z),
      mode = k % 3;
    item =
      mode === 0
        ? V(
            [
              `A=${vec3Text(a)}、B=${vec3Text(b)}，求AB。`,
              `For A=${vec3Text(a)},B=${vec3Text(b)}, find AB.`,
            ],
            vec3Text(subVec3(b, a)),
            [
              '终点减起点，三个坐标都保留。',
              'Subtract tail from head in all three coordinates.',
            ],
            ['(999,999,999)'],
          )
        : mode === 1
          ? V(
              [
                `A=${vec3Text(a)}、B=${vec3Text(b)}，求中点。`,
                `Find the midpoint of A=${vec3Text(a)},B=${vec3Text(b)}.`,
              ],
              vec3Text(midpointVec3(a, b)),
              ['逐坐标平均。', 'Average each coordinate.'],
              ['(999,999,999)'],
            )
          : N(
              [
                `A=${vec3Text(a)}、B=${vec3Text(b)}，求|AB|²。`,
                `For A=${vec3Text(a)},B=${vec3Text(b)}, find |AB|².`,
              ],
              textR(squareVec3(subVec3(b, a))),
              [
                '三个位移分量平方求和。',
                'Sum the three squared displacement components.',
              ],
              ['999', '-999'],
            );
  } else if (i === 1) {
    const mode = k % 3,
      w =
        mode === 0
          ? addVec3(u, v)
          : mode === 1
            ? subVec3(u, v)
            : subVec3(scaleVec3(rational(2n), u), v);
    item = V(
      [
        `u=${vec3Text(u)}、v=${vec3Text(v)}，求${mode === 0 ? 'u+v' : mode === 1 ? 'u−v' : '2u−v'}。`,
        `For u=${vec3Text(u)},v=${vec3Text(v)}, find ${mode === 0 ? 'u+v' : mode === 1 ? 'u−v' : '2u−v'}.`,
      ],
      vec3Text(w),
      [
        '倍数和负号作用三个分量。',
        'Apply scalars and signs to all three components.',
      ],
      ['(999,999,999)'],
    );
  } else if (i === 2) {
    const b = vec3(1, 0, 0),
      a = spatialAngle(u, b);
    item =
      k % 2 === 0
        ? N(
            [
              `u=${vec3Text(u)}、v=(1,0,0)，求u·v。`,
              `For u=${vec3Text(u)},v=(1,0,0), find u·v.`,
            ],
            textR(a.dot),
            ['三个对应乘积相加。', 'Sum the three matching products.'],
            ['999', '-999'],
          )
        : R(
            [
              `u=${vec3Text(u)}、v=(1,0,0)，求精确cosθ（向量角）。`,
              `For u=${vec3Text(u)},v=(1,0,0), find exact vector-angle cosθ.`,
            ],
            a.cosine!,
            [
              '两向量非零，数量积除以模之积。',
              'Both vectors are nonzero; divide dot product by norm product.',
            ],
            ['999', '-999'],
          );
  } else if (i === 3) {
    const p = vec3(x, y, k < 12 ? 0 : 1),
      direction =
        k % 3 === 0
          ? vec3(1, 0, 0)
          : k % 3 === 1
            ? vec3(1, 0, -1)
            : vec3(0, 0, 1),
      l = vectorLine3(p, direction),
      plane = vectorPlane3(vec3(0, 0, 1), 0),
      result = vectorLinePlaneRelation(l, plane);
    item = C(
      [
        `直线X=${vec3Text(p)}+t${vec3Text(direction)}与平面z=0，判断位置关系。`,
        `Classify line X=${vec3Text(p)}+t${vec3Text(direction)} relative to z=0.`,
      ],
      result.kind,
      [
        '代入z方程，先核t系数，再核基点。',
        'Substitute into the z equation; check the parameter coefficient, then the base point.',
      ],
      ['skew', 'coincident'],
    );
  } else {
    const r = pointPlaneProjection(u, spatialPlane);
    item =
      k % 2 === 0
        ? R(
            [
              `求P=${vec3Text(u)}到x+2y+2z=3的精确距离。`,
              `Find exact distance from P=${vec3Text(u)} to x+2y+2z=3.`,
            ],
            `sqrt(${textR(r.distanceSquare)})`,
            [
              '代入差取绝对值，除以法向模3。',
              'Take the absolute residual and divide by normal length three.',
            ],
            ['999', '-999'],
          )
        : V(
            [
              `求P=${vec3Text(u)}到x+2y+2z=3的垂足。`,
              `Find the foot from P=${vec3Text(u)} to x+2y+2z=3.`,
            ],
            vec3Text(r.foot),
            [
              '沿法向扣去归一化投影。',
              'Subtract the normalised normal projection.',
            ],
            ['(999,999,999)'],
          );
  }
  return question(`${id}-R${round}`, i, item);
}
export const h23CheckQuestions: Question[] = [
  ...specs.map((s, i) => question(`H23-CHECK-Q${i + 1}`, i, s.items[0]!)),
  pick('H23-CHECK-Q6', 3),
  question('H23-CHECK-Q7', 2, specs[2]!.items[5]!),
  question('H23-CHECK-Q8', 4, specs[4]!.items[5]!),
];
