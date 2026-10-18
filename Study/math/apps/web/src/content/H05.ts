import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import {
  readVector,
  vectorText,
  addV,
  subtractV,
  scaleV,
  betweenV,
  dotV,
  lengthV,
  midpointV,
  angleV,
  geometricCase,
  type VectorCode,
} from '../vectorModels';
import { rational, textR } from '../algebraModels';
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
const XY = (stem: Pair, value: string, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'coordinate', value }, step, wrong);
const V = (stem: Pair, value: VectorCode, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'vector-code', value }, step, wrong);
const R = (stem: Pair, value: string, step: Pair, wrong: string[]) =>
  I(stem, { kind: 'radical', value }, step, wrong);
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
    title: ['向量有大小和方向', 'Vectors have magnitude and direction'],
    objective: [
      '用大小和方向判断向量相等，并区分位置、路径与零向量。',
      'Judge vector equality by magnitude and direction, separating position, path and the zero vector.',
    ],
    hook: [
      '从两个不同起点各向东3格、向北4格，两支箭头一定不相等吗？',
      'Two arrows start at different places but each goes three squares east and four north. Must they be different vectors?',
    ],
    prerequisites: ['J75-L01', 'J87-L01', 'J87-L04'],
    keywords: [
      ['向量', 'vector'],
      ['模长', 'magnitude'],
      ['零向量', 'zero vector'],
    ],
    lab: 'vector-meaning',
    skill: 'vector-value-not-position',
    hints: [
      [
        '向量记录有向位移；平移箭头不改变大小与方向。模长是非负长度。',
        'A vector records directed displacement. Translating an arrow preserves its magnitude and direction; magnitude is a nonnegative length.',
      ],
      [
        '非零向量相等要大小与方向都相同；同长不够。零向量长度0，本课不赋予方向。',
        'Equal nonzero vectors need equal magnitude and direction; equal length alone is insufficient. The zero vector has length zero and no assigned direction in this unit.',
      ],
    ],
    items: [
      R(
        [
          '一个位移向东3格、向北4格，模长是多少格？',
          'A displacement goes three squares east and four north. Find its magnitude in grid units.',
        ],
        '5',
        [
          '用勾股：√(3²+4²)=5；路径先横后竖走了7格，不是模长。',
          'Pythagoras gives √(3²+4²)=5. A horizontal-then-vertical route travels seven units, which is not the displacement magnitude.',
        ],
        ['7', '25'],
      ),
      V(
        [
          '两支箭头起点不同，但都向东3、向北4。判断equal/different。',
          'Two arrows have different tails but each goes three east and four north. Classify equal/different.',
        ],
        'equal',
        [
          '自由向量与起点无关，两个有向位移的大小和方向都相同。',
          'Free vectors do not depend on their tails; both directed displacements have the same magnitude and direction.',
        ],
        ['different', 'same-direction'],
      ),
      V(
        [
          'u=(3,4)、v=(−3,−4)作为向量是否相等？写equal/different。',
          'Are u=(3,4) and v=(−3,−4) equal vectors? Use equal/different.',
        ],
        'different',
        [
          '模长相同但方向相反，不是相等向量。',
          'Their magnitudes agree but directions are reversed, so the vectors differ.',
        ],
        ['equal', 'undefined'],
      ),
      V(
        [
          'u=(2,1)、v=(4,2)的方向关系：same-direction/opposite-direction/not-parallel/undefined。',
          'Classify the directions of u=(2,1), v=(4,2): same-direction/opposite-direction/not-parallel/undefined.',
        ],
        'same-direction',
        [
          'v=2u，同向但模长是2倍；同向不等于相等。',
          'v=2u gives the same direction but twice the magnitude; same direction does not mean equal vectors.',
        ],
        ['equal', 'opposite-direction'],
      ),
      N(
        ['零向量的模长是多少？', 'What is the magnitude of the zero vector?'],
        '0',
        [
          '起点终点重合，有向位移为0；没有规定一个特殊方向。',
          'Coincident tail and head give zero displacement, without a specially assigned direction.',
        ],
        ['1', '-1'],
      ),
      E(
        [
          '纸上路线一先东3格再北4格，路线二直接走到同一终点。位移向量与所走路程分别相同吗？说明理由。',
          'On paper, route one goes three east then four north; route two goes straight to the same endpoint. Compare displacement vectors and travelled distances.',
        ],
        [
          '起终点相同，两位移向量均(3,4)，模长5；路线一走7，直线走5，路程不同。向量记录净位移，不记录完整路线；换共同起点位置不改变该自由向量。',
          'The common start and endpoint give displacement (3,4) of magnitude five for both. Route one travels seven while the straight route travels five. A vector records net displacement, not the full path; translating the common start preserves the free vector.',
        ],
      ),
    ],
    pick: {
      stem: [
        '关于两个相等的非零向量，哪项必须成立？',
        'What must hold for two equal nonzero vectors?',
      ],
      options: [
        ['起点相同', 'They have the same tail'],
        ['模长和方向都相同', 'They have equal magnitude and direction'],
        ['只要模长相同即可', 'Equal magnitude alone is enough'],
      ],
      feedback: [
        [
          '箭头可以平移到不同起点而表示同一自由向量。',
          'Translated arrows can represent the same free vector from different tails.',
        ],
        [
          '大小和方向共同确定自由向量。',
          'Magnitude and direction together determine a free vector.',
        ],
        [
          '向东1与向北1同长，却不相等。',
          'One east and one north have equal length but are different vectors.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '给出同长但不相等的两个向量，并说明零向量为什么不能被指定为“向北”。',
      'Give two equal-length but unequal vectors, then explain why the zero vector cannot be assigned “north”.',
    ],
    rubric: [
      '例如(1,0)与(0,1)长度均1但方向不同。零向量起终点重合，没有可识别的有向箭头；本课方向比较只对非零向量定义。',
      'For example (1,0) and (0,1) both have length one but different directions. The zero vector has coincident tail and head, with no identifiable arrow direction; this unit compares directions only for nonzero vectors.',
    ],
    misconception: [
      '把箭头位置、同长、走过的路程当作向量值，或给零向量硬定方向。',
      'Confusing location, equal length or route distance with vector value, or forcing a direction onto the zero vector.',
    ],
  },
  {
    title: ['向量的加减', 'Vector addition and subtraction'],
    objective: [
      '用首尾相接和反向量构造向量和与差。',
      'Construct vector sums and differences using head-to-tail placement and additive inverses.',
    ],
    hook: [
      '向东3步再向西5步，走了8步，为什么净位移只有向西2步？',
      'Three steps east then five west travels eight steps. Why is the net displacement only two west?',
    ],
    prerequisites: ['H05-L01', 'J71-L05'],
    keywords: [
      ['首尾相接', 'head to tail'],
      ['向量和', 'vector sum'],
      ['向量差', 'vector difference'],
    ],
    lab: 'vector-addition',
    skill: 'vector-head-tail-and-difference',
    hints: [
      [
        '把第二向量平移到第一向量的头部；从第一尾指向最后头是和。',
        'Translate the second vector so its tail meets the first head; the sum runs from the first tail to the final head.',
      ],
      [
        'u−v=u+(−v)；同起点的u、v，差u−v从v的头指向u的头。',
        'u−v=u+(−v). With common tails, u−v points from the head of v to the head of u.',
      ],
    ],
    items: [
      XY(
        ['u=(3,2)，v=(−1,4)，求u+v。', 'Given u=(3,2), v=(−1,4), find u+v.'],
        '(2,6)',
        [
          '横向3−1=2、纵向2+4=6，合位移(2,6)。',
          'Horizontal displacement is 3−1=2 and vertical 2+4=6, giving (2,6).',
        ],
        ['(4,-2)', '(2,2)'],
      ),
      XY(
        ['仍取u=(3,2)、v=(−1,4)，求u−v。', 'Keep u=(3,2), v=(−1,4). Find u−v.'],
        '(4,-2)',
        [
          '减v等于加(1,−4)，得到(4,−2)；差有顺序。',
          'Subtracting v adds (1,−4), giving (4,−2); subtraction has an order.',
        ],
        ['(-4,2)', '(2,6)'],
      ),
      XY(
        [
          '先东3格再西5格，写净位移(东,北)。',
          'Travel three squares east then five west. Enter the net displacement as (east,north).',
        ],
        '(-2,0)',
        [
          '东为正、西为负，3−5=−2，北向0。',
          'East is positive and west negative: 3−5=−2 with zero northward movement.',
        ],
        ['(8,0)', '(2,0)'],
      ),
      XY(
        ['u=(2,−3)，求u+(−u)。', 'For u=(2,−3), find u+(−u).'],
        '(0,0)',
        [
          '每个有向分量互相抵消，回到起点。',
          'Each directed component cancels and the route returns to its start.',
        ],
        ['(4,-6)', '(2,-3)'],
      ),
      XY(
        [
          '从A=(1,2)出发，先走u=(2,−1)再走v=(−3,4)，终点坐标是多少？',
          'Start at A=(1,2), follow u=(2,−1), then v=(−3,4). Find the endpoint.',
        ],
        '(0,5)',
        [
          '净位移u+v=(−1,3)，终点A+(u+v)=(0,5)。',
          'The net displacement is (−1,3); adding it to A gives endpoint (0,5).',
        ],
        ['(-1,3)', '(4,-1)'],
      ),
      E(
        [
          '用首尾相接或分量说明u+v=v+u；再解释为什么u−v一般不等于v−u。',
          'Explain u+v=v+u by head-to-tail placement or components, then why u−v generally differs from v−u.',
        ],
        [
          '和的两条路线都到同一平行四边形对角顶点，或各分量的实数加法可交换；共线和零向量也可按分量验证。u−v与v−u互为相反向量，只有u=v时同为0才相等。',
          'Both sum routes reach the same parallelogram vertex, or real-number addition commutes in each component. Components also handle collinear and zero cases. Differences u−v and v−u are negatives; they are equal only when u=v and both are zero.',
        ],
      ),
    ],
    pick: {
      stem: [
        '同尾向量u、v，哪支箭头表示u−v？',
        'For vectors u,v with common tails, which arrow represents u−v?',
      ],
      options: [
        ['从u的头到v的头', 'From the head of u to the head of v'],
        ['从v的头到u的头', 'From the head of v to the head of u'],
        ['从原点到两头的中点', 'From the origin to the midpoint of the heads'],
      ],
      feedback: [
        ['这是v−u，次序反了。', 'That is v−u, reversing the order.'],
        [
          '该箭头加在v后到达u，故是u−v。',
          'Appending this arrow to v reaches u, so it represents u−v.',
        ],
        [
          '中点与差不是同一个构造。',
          'The midpoint is a different construction from the difference.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '“把同尾的两支箭头连接起来，就得u+v。”指出应连接哪些点，并对照差向量。',
      'Repair “joining the heads of two common-tail arrows gives u+v”. State the correct endpoints for the sum and difference.',
    ],
    rubric: [
      '和应先将第二向量平移为首尾相接，再由最初尾到最终头；直接由v头到u头得到u−v，由u头到v头得到v−u。平移不改变向量，但不能乱换方向。',
      'For the sum translate the second vector head to tail, then join the original tail to the final head. Joining v’s head to u’s head gives u−v; reversing gives v−u. Translation preserves vectors, but direction cannot be changed arbitrarily.',
    ],
    misconception: [
      '把模长直接相加、把同尾两头连线当和，或把差的方向反过来。',
      'Adding magnitudes, treating the segment between common-tail heads as a sum or reversing subtraction.',
    ],
  },
  {
    title: ['数乘向量', 'Scalar multiplication'],
    objective: [
      '由标量的符号和绝对值解释向量缩放、反向与零。',
      'Explain vector scaling, reversal and zero through a scalar’s sign and absolute value.',
    ],
    hook: [
      '把向量乘−2，是“负长度”，还是反向后变为两倍长？',
      'Does multiplying a vector by −2 give a negative length, or reverse it and double its length?',
    ],
    prerequisites: ['H05-L02', 'J71-L05', 'P63-L02'],
    keywords: [
      ['标量', 'scalar'],
      ['数乘', 'scalar multiplication'],
      ['相反向量', 'additive inverse'],
    ],
    lab: 'vector-scaling',
    skill: 'vector-scalar-sign-and-size',
    hints: [
      [
        'ku把每个分量乘k；长度乘|k|，负k使非零向量反向。',
        'ku multiplies each component by k; magnitude scales by |k| and negative k reverses a nonzero vector.',
      ],
      [
        'k=0或u=0都产生零向量；没有方向。恢复k时要查非零分量，不能除以0。',
        'Either k=0 or u=0 gives the zero vector with no direction. Recover k using a nonzero component, never division by zero.',
      ],
    ],
    items: [
      XY(
        ['u=(3,−1)，求−2u。', 'For u=(3,−1), find −2u.'],
        '(-6,2)',
        [
          '两个分量都乘−2，(−6,2)；不能只改变其中一项符号。',
          'Multiply both components by −2 to get (−6,2), rather than changing only one sign.',
        ],
        ['(-6,-2)', '(6,-2)'],
      ),
      XY(
        ['u=(−4,6)，求(1/2)u。', 'For u=(−4,6), find (1/2)u.'],
        '(-2,3)',
        [
          '正半倍保持方向，把两个分量都减半。',
          'A positive half-scale keeps direction and halves both components.',
        ],
        ['(2,3)', '(-8,12)'],
      ),
      N(
        ['|u|=5，求|−2u|。', 'Given |u|=5, find |−2u|.'],
        '10',
        [
          '|−2u|=|−2|×5=10，长度不能因负标量变负。',
          '|−2u|=|−2|×5=10; negative scaling cannot make a length negative.',
        ],
        ['-10', '3'],
      ),
      V(
        [
          'u=(3,4)，0u与u的方向关系是什么？零向量写undefined。',
          'For u=(3,4), classify the direction of 0u relative to u. Use undefined for a zero vector.',
        ],
        'undefined',
        [
          '0u=(0,0)，没有可比较的非零方向。',
          '0u=(0,0), with no nonzero direction to compare.',
        ],
        ['same-direction', 'opposite-direction'],
      ),
      N(
        [
          'u=(0,2)、v=(0,−6)，若v=ku，求k。',
          'Let u=(0,2), v=(0,−6) and v=ku. Find k.',
        ],
        '-3',
        [
          '用非零纵分量−6/2=−3，再核横分量0=(−3)×0。',
          'Use the nonzero vertical component: −6/2=−3. Check the horizontal equation 0=(−3)×0 as well.',
        ],
        ['0', '3'],
      ),
      E(
        [
          '从ku=kv能否总推出u=v？给出成立条件和一个反例。',
          'Does ku=kv always imply u=v? State a sufficient condition and a counterexample.',
        ],
        [
          '当k≠0，可将标量1/k乘到两边得到u=v；k=0时任意u、v都映到0，例如u=(1,0)、v=(0,1)仍不相等。不能把向量当普通非零数随便相除。',
          'For k≠0, multiply both sides by scalar 1/k to obtain u=v. For k=0 every u,v maps to zero; for example (1,0) and (0,1) remain unequal. Vectors cannot simply be divided like nonzero numbers.',
        ],
      ),
    ],
    pick: {
      stem: [
        'k<0且u≠0时，ku相对u怎样改变？',
        'For k<0 and u≠0, how does ku relate to u?',
      ],
      options: [
        ['同向，长度乘k', 'Same direction, magnitude multiplied by k'],
        ['反向，长度乘|k|', 'Opposite direction, magnitude multiplied by |k|'],
        ['必为零向量', 'Always the zero vector'],
      ],
      feedback: [
        [
          '负标量会反向，模长仍非负。',
          'A negative scalar reverses direction and magnitude stays nonnegative.',
        ],
        [
          '符号决定反向，绝对值决定长度倍率。',
          'The sign reverses direction; absolute value determines the magnitude factor.',
        ],
        [
          'k和u都非零时乘积不为零向量。',
          'A nonzero scalar times a nonzero vector is nonzero.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '“ku=0，所以k=0。”何时成立，何时缺条件？',
      'When is “ku=0, so k=0” valid, and which condition is missing?',
    ],
    rubric: [
      '需要u≠0，取其一个非零分量即可推出k=0。若u=0，任意k都使ku=0；零源向量恢复倍数时可能全体标量或无标量，不能武断报唯一0。',
      'Require u≠0; one nonzero component forces k=0. If u=0, every scalar works. Recovering a multiplier from a zero source can allow all scalars or none, never an automatic unique zero.',
    ],
    misconception: [
      '把负标量当负模长、只乘一个分量，或忽略零因子条件。',
      'Using a negative magnitude, scaling only one component or ignoring zero-factor conditions.',
    ],
  },
  {
    title: ['坐标形式的向量', 'Coordinate vectors'],
    objective: [
      '用终点减起点计算向量，并区分向量分量与点坐标。',
      'Compute vector components as endpoint minus start, distinguishing displacement from position.',
    ],
    hook: [
      'B=(3,4)时，AB一定是(3,4)吗？如果A不在原点呢？',
      'If B=(3,4), must AB be (3,4)? What if A is not the origin?',
    ],
    prerequisites: ['H05-L03', 'J75-L01', 'J87-L01'],
    keywords: [
      ['分量', 'components'],
      ['位置', 'position'],
      ['中点', 'midpoint'],
    ],
    lab: 'vector-components',
    skill: 'vector-end-minus-start',
    hints: [
      [
        'AB=(xB−xA,yB−yA)，方向从A到B；BA反号。',
        'AB=(xB−xA,yB−yA), directed from A to B; BA reverses both signs.',
      ],
      [
        'B=A+AB；中点是(A+B)/2这个点。共同平移保持差向量，却会移动点和中点。',
        'B=A+AB, while (A+B)/2 is a midpoint position. Common translation preserves the difference vector but moves points and midpoints.',
      ],
    ],
    items: [
      XY(
        [
          'A=(−2,1)，B=(3,4)，求AB的分量。',
          'Given A=(−2,1), B=(3,4), find components of AB.',
        ],
        '(5,3)',
        [
          '终点减起点：(3−(−2),4−1)=(5,3)。',
          'Endpoint minus start gives (3−(−2),4−1)=(5,3).',
        ],
        ['(3,4)', '(-5,-3)'],
      ),
      XY(
        ['仍取A=(−2,1)、B=(3,4)，求BA。', 'Keep A=(−2,1), B=(3,4). Find BA.'],
        '(-5,-3)',
        [
          'BA=A−B=(−5,−3)，是AB的相反向量。',
          'BA=A−B=(−5,−3), the negative of AB.',
        ],
        ['(5,3)', '(1,5)'],
      ),
      XY(
        [
          'A=(1,−2)，AB=(3,4)，求终点B坐标。',
          'Given A=(1,−2) and AB=(3,4), find endpoint B.',
        ],
        '(4,2)',
        ['B=A+AB=(1+3,−2+4)=(4,2)。', 'B=A+AB=(1+3,−2+4)=(4,2).'],
        ['(3,4)', '(-2,-6)'],
      ),
      XY(
        [
          '求A=(−2,1)、B=(3,4)的中点M坐标。',
          'Find midpoint M of A=(−2,1), B=(3,4).',
        ],
        '(1/2,5/2)',
        [
          '对应位置坐标取平均：((−2+3)/2,(1+4)/2)。',
          'Average the corresponding position coordinates: ((−2+3)/2,(1+4)/2).',
        ],
        ['(5/2,3/2)', '(1,5)'],
      ),
      R(
        ['求向量(2,−3)的模长。', 'Find the magnitude of vector (2,−3).'],
        'sqrt(13)',
        [
          '√(2²+(−3)²)=√13，平方前保留负分量的括号。',
          '√(2²+(−3)²)=√13; square the whole negative component.',
        ],
        ['5', '13'],
      ),
      E(
        [
          'A=(−2,1)、B=(3,4)同时平移t=(2,−1)。AB与中点M分别怎样改变？用坐标解释。',
          'Translate A=(−2,1), B=(3,4) together by t=(2,−1). Explain what happens to AB and midpoint M using coordinates.',
        ],
        [
          'A′=(0,0)、B′=(5,3)，A′B′仍(5,3)，因(B+t)−(A+t)=B−A。中点由(1/2,5/2)移到(5/2,3/2)，即M+t；位置改变不代表自由向量改变。',
          'A′=(0,0), B′=(5,3) and A′B′ remains (5,3) because (B+t)−(A+t)=B−A. The midpoint moves from (1/2,5/2) to (5/2,3/2), namely M+t. A changed position does not change the free vector.',
        ],
      ),
    ],
    pick: {
      stem: [
        'A不是原点时，哪个恒成立？',
        'When A is not necessarily the origin, which always holds?',
      ],
      options: [
        ['AB等于B的坐标', 'AB equals B’s coordinates'],
        ['AB=B−A', 'AB=B−A'],
        ['AB=A+B', 'AB=A+B'],
      ],
      feedback: [
        [
          '只有A在原点时才可直接这样读位置。',
          'That direct reading works only when A is the origin.',
        ],
        [
          '差记录从A走到B所需的有向变化。',
          'The difference records the directed change needed to travel from A to B.',
        ],
        [
          '相加描述另一个位置关系，不是起终点差。',
          'Adding gives a different positional relationship, not endpoint displacement.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '指出“向量AB=(xB,yB)”遗漏的前提，给一个不满足前提的例子并纠正。',
      'Identify the missing premise in “AB=(xB,yB)”, then give and correct a counterexample.',
    ],
    rubric: [
      '需要A=(0,0)。例如A=(2,1)、B=(5,3)，AB=(3,2)，不是(5,3)。点坐标依赖坐标原点，向量分量是同一坐标系中的终点减起点。',
      'Require A=(0,0). For A=(2,1), B=(5,3), AB=(3,2), not (5,3). Point coordinates depend on the origin; components are endpoint minus start in one coordinate system.',
    ],
    misconception: [
      '把终点坐标当向量、减反顺序，或以为平移后中点也不动。',
      'Confusing endpoint position with vector components, reversing subtraction or assuming a midpoint also stays fixed under translation.',
    ],
  },
  {
    title: ['数量积与夹角', 'Dot products and angles'],
    objective: [
      '用数量积连接分量与非零向量夹角，保留零向量和角度端点条件。',
      'Connect components and the angle between nonzero vectors using the dot product, retaining zero-vector and endpoint cases.',
    ],
    hook: [
      '两向量的数量积为0，能直接说夹角90°吗？如果其中一支根本没有长度呢？',
      'If a dot product is zero, must the angle be 90°? What if one vector has no length?',
    ],
    prerequisites: ['H05-L04', 'H04-L02', 'H04-L05'],
    keywords: [
      ['数量积', 'dot product'],
      ['夹角', 'angle between vectors'],
      ['非零条件', 'nonzero condition'],
    ],
    lab: 'vector-dot',
    skill: 'vector-dot-angle-with-domain',
    hints: [
      [
        'u·v=uxvx+uyvy，是一个标量；非零时cosθ=(u·v)/(|u||v|)。',
        'u·v=uxvx+uyvy is a scalar. For nonzero vectors, cosθ=(u·v)/(|u||v|).',
      ],
      [
        '先查两个模长非零。θ取[0,π]；同向为0角、反向为平角，不能把端点叫锐角或钝角。',
        'First require both magnitudes nonzero. θ lies in [0,π]; same direction gives a zero angle and reversed direction a straight angle, not acute or obtuse endpoints.',
      ],
    ],
    items: [
      N(
        ['u=(1,2)、v=(3,−1)，求u·v。', 'For u=(1,2), v=(3,−1), find u·v.'],
        '1',
        [
          '1×3+2×(−1)=1；输出标量，不是数对。',
          '1×3+2×(−1)=1, a scalar rather than a component pair.',
        ],
        ['(3,-2)', '5'],
      ),
      N(
        [
          'u=(1,1)、v=(1,−1)，求夹角的度数。',
          'For u=(1,1), v=(1,−1), find the angle in degrees.',
        ],
        '90',
        [
          '两向量非零且点积1−1=0，所以cosθ=0、θ=90°。',
          'Both vectors are nonzero and the dot product is 1−1=0, so cosθ=0 and θ=90°.',
        ],
        ['0', '180'],
        '°',
      ),
      R(
        [
          'u=(1,0)、v=(1,1)，求夹角的cosθ确切值。',
          'For u=(1,0), v=(1,1), find exact cosθ.',
        ],
        'sqrt(2)/2',
        [
          '点积1、模长1和√2，因此cosθ=1/√2=√2/2。',
          'The dot product is one and magnitudes one and √2, giving cosθ=1/√2=√2/2.',
        ],
        ['1', 'sqrt(2)'],
      ),
      V(
        [
          'u=(1,0)、v=(−1,1)，夹角是acute/right/obtuse/zero-angle/straight/undefined中的哪种？',
          'For u=(1,0), v=(−1,1), classify the angle: acute/right/obtuse/zero-angle/straight/undefined.',
        ],
        'obtuse',
        [
          '点积−1且两向量不平行，夹角严格介于90°和180°之间。',
          'The dot product is −1 and the nonzero vectors are not parallel, so the angle is strictly between 90° and 180°.',
        ],
        ['acute', 'straight'],
      ),
      V(
        [
          'u=(0,0)、v=(2,1)，夹角怎样分类？',
          'Classify the angle between u=(0,0) and v=(2,1).',
        ],
        'undefined',
        [
          '虽然点积为0，但分母|u||v|=0，零向量没有方向，不能定义夹角。',
          'The dot product is zero, but |u||v|=0 and the zero vector has no direction, so the angle is undefined.',
        ],
        ['right', 'zero-angle'],
      ),
      E(
        [
          '纸上位移u=(3,0)、v=(−2,0)。计算点积、夹角并解释为什么不能把它叫钝角。',
          'For paper displacements u=(3,0), v=(−2,0), find the dot product and angle, then explain why it is not obtuse.',
        ],
        [
          'u·v=−6，两向量非零反向，所以夹角180°=π，是平角。钝角要求严格小于180°，点积为负仅能先推出θ>90°，还需区分反向端点。',
          'u·v=−6. Both vectors are nonzero and opposite, so the angle is 180°=π, a straight angle. An obtuse angle is strictly below 180°; a negative dot product gives θ>90° but still requires checking the reversed-direction endpoint.',
        ],
      ),
    ],
    pick: {
      stem: [
        '什么条件能由u·v=0推出夹角90°？',
        'What extra condition lets u·v=0 imply a 90° angle?',
      ],
      options: [
        ['不需要额外条件', 'No extra condition'],
        ['u、v都非零', 'Both u and v are nonzero'],
        ['只要u、v长度相等', 'Equal magnitudes are enough'],
      ],
      feedback: [
        [
          '零向量也能使数量积为0，却没有夹角。',
          'A zero vector also gives zero dot product but has no defined angle.',
        ],
        [
          '分母|u||v|非零后，cosθ=0才确定直角。',
          'A nonzero denominator |u||v| makes cosθ=0 determine a right angle.',
        ],
        [
          '两个零向量同长仍没有方向。',
          'Two zero vectors have equal magnitudes and still no directions.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '为什么u·v不是向量？怎样同时核验坐标式与|u||v|cosθ，并处理零向量？',
      'Why is u·v not a vector? Explain the component and magnitude-angle formulas, including the zero case.',
    ],
    rubric: [
      '对应分量乘积相加得到一个实数，不是新箭头。非零时定义夹角θ∈[0,π]，两式u·v=uxvx+uyvy=|u||v|cosθ一致；有零向量时坐标式仍给0，但不能用夹角公式反求一个未定义方向。',
      'Adding corresponding component products gives a real scalar, not an arrow. For nonzero vectors, θ∈[0,π] makes uxvx+uyvy=|u||v|cosθ. With a zero vector, the component formula still gives zero, but it cannot create a missing angle by division.',
    ],
    misconception: [
      '把点积写成数对、漏非零条件，或把0°/180°误叫锐角/钝角。',
      'Returning a component pair, omitting nonzero conditions or calling 0°/180° acute/obtuse.',
    ],
  },
  {
    title: ['向量解决几何问题', 'Vectors in geometry'],
    objective: [
      '把几何条件翻译为向量等式与数量积，并核对非退化前提。',
      'Translate geometric conditions into vector equations and dot products while checking nondegeneracy.',
    ],
    hook: [
      '四点画成斜着的正方形，怎样不用量角器确认？如果四点共线又会怎样？',
      'How can you certify a tilted square without a protractor, and what changes when four points are collinear?',
    ],
    prerequisites: ['H05-L05', 'J86-L05', 'J87-L04'],
    keywords: [
      ['平行四边形', 'parallelogram'],
      ['中点', 'midpoint'],
      ['非退化', 'nondegenerate'],
    ],
    lab: 'vector-geometry',
    skill: 'vector-geometry-with-premises',
    hints: [
      [
        '按A,B,C,D为相邻次序，平行四边形C=B+D−A；两对角线中点都为(B+D)/2。',
        'For consecutive vertices A,B,C,D of a parallelogram, C=B+D−A and both diagonal midpoints equal (B+D)/2.',
      ],
      [
        '先保证相邻边不共线且非零，再用点积0判直角、平方模相等判邻边等长；不能只看图。',
        'First require nonzero, non-collinear adjacent sides; then a zero dot product gives right angles and equal squared magnitudes give equal adjacent sides. Do not rely on appearance.',
      ],
    ],
    items: [
      XY(
        [
          '平行四边形A=(0,0)、B=(4,0)、D=(1,3)，按A,B,C,D顺序求C。',
          'A parallelogram has A=(0,0), B=(4,0), D=(1,3) in consecutive order A,B,C,D. Find C.',
        ],
        '(5,3)',
        [
          'C=B+D−A=(5,3)，不是简单取B、D中点。',
          'C=B+D−A=(5,3), rather than the midpoint of B and D.',
        ],
        ['(5/2,3/2)', '(3,-3)'],
      ),
      XY(
        [
          '上述A=(0,0)、B=(4,0)、C=(5,3)、D=(1,3)，求两对角线共同中点。',
          'For A=(0,0), B=(4,0), C=(5,3), D=(1,3), find the common diagonal midpoint.',
        ],
        '(5/2,3/2)',
        ['(A+C)/2=(B+D)/2=(5/2,3/2)。', '(A+C)/2=(B+D)/2=(5/2,3/2).'],
        ['(5,3)', '(2,0)'],
      ),
      V(
        [
          '相邻边u=(4,0)、v=(0,3)构成的非退化平行四边形，给最具体分类。',
          'Classify most specifically the nondegenerate parallelogram with adjacent sides u=(4,0), v=(0,3).',
        ],
        'rectangle',
        [
          '点积0，邻边长度4与3不等，是矩形而非正方形。',
          'The dot product is zero but adjacent lengths four and three differ: a rectangle, not a square.',
        ],
        ['square', 'rhombus'],
      ),
      V(
        [
          '相邻边u=(3,1)、v=(1,3)构成的非退化平行四边形，给最具体分类。',
          'Classify most specifically the nondegenerate parallelogram with adjacent sides u=(3,1), v=(1,3).',
        ],
        'rhombus',
        [
          '平方模都是10，点积6不为0，是菱形而非正方形。',
          'Both squared magnitudes are ten, but dot product six is nonzero: a rhombus, not a square.',
        ],
        ['square', 'rectangle'],
      ),
      V(
        [
          '相邻边u=(4,0)、v=(2,0)，即使C=B+D−A也成立，应怎样分类？',
          'Adjacent sides are u=(4,0), v=(2,0). Even if C=B+D−A holds, how should this figure be classified?',
        ],
        'degenerate',
        [
          '两边共线，面积0；不能称通常的非退化平行四边形。',
          'The sides are collinear with area zero, so this is not an ordinary nondegenerate parallelogram.',
        ],
        ['parallelogram', 'rectangle'],
      ),
      E(
        [
          'A=(0,0)、B=(3,1)、D=(−1,3)，令C=B+D−A。用向量证明ABCD是正方形，并核对对角线中点。',
          'Let A=(0,0), B=(3,1), D=(−1,3), C=B+D−A. Prove ABCD is a square using vectors and check the diagonal midpoint.',
        ],
        [
          'C=(2,4)，AB=(3,1)、AD=(−1,3)。两边不共线，AB·AD=−3+3=0，平方模均10；平行四边形有等长邻边和直角，故正方形。两对角线中点均(1,2)。结论依条件而非旋转后的外观。',
          'C=(2,4), AB=(3,1), AD=(−1,3). The sides are not collinear; their dot product is −3+3=0 and both squared magnitudes are ten. The parallelogram has equal adjacent sides and a right angle, hence is a square. Both diagonal midpoints are (1,2). Conditions, not the tilted appearance, justify the result.',
        ],
      ),
    ],
    pick: {
      stem: [
        '哪组条件能把非退化平行四边形判为正方形？',
        'Which conditions certify a nondegenerate parallelogram as a square?',
      ],
      options: [
        ['仅对角线互相平分', 'Its diagonals merely bisect each other'],
        [
          '邻边点积0且邻边平方模相等',
          'Adjacent sides have zero dot product and equal squared magnitudes',
        ],
        ['仅邻边等长', 'Its adjacent sides merely have equal lengths'],
      ],
      feedback: [
        [
          '这是所有平行四边形已有的性质，不能区分正方形。',
          'Every parallelogram already has that property; it does not identify a square.',
        ],
        [
          '直角加等长邻边，在既定平行四边形前提下足够。',
          'A right angle and equal adjacent sides suffice under the parallelogram premise.',
        ],
        [
          '只够得到菱形，还可能没有直角。',
          'That gives a rhombus, which need not have right angles.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '“四边形两条对角线等长，所以必为矩形。”缺少什么前提？可用等腰梯形作反例。',
      '“Equal diagonals make any quadrilateral a rectangle.” Which premise is missing? An isosceles trapezium can be a counterexample.',
    ],
    rubric: [
      '先有非退化平行四边形才可用等长对角线推出矩形。反例A=(−2,0)、B=(2,0)、C=(1,2)、D=(−1,2)：两对角线平方长均13，但上下底长4和2，不是平行四边形/矩形。向量证明必须写清已有条件。',
      'The nondegenerate parallelogram premise is needed. For A=(−2,0), B=(2,0), C=(1,2), D=(−1,2), both diagonal squared lengths are 13 but the bases have lengths four and two; it is not a parallelogram or rectangle. State the existing conditions in a vector proof.',
    ],
    misconception: [
      '只靠图形外观、把退化共线情况当普通四边形，或漏掉判定定理的前提。',
      'Relying on appearance, treating collinear degeneracy as an ordinary quadrilateral or omitting a theorem’s premise.',
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
    p = s.pick,
    order = [
      [0, 1, 2],
      [1, 0, 2],
      [0, 1, 2],
      [0, 2, 1],
      [0, 1, 2],
      [1, 0, 2],
    ][i]!;
  return choice(
    id,
    T(p.stem),
    order.indexOf(p.correct),
    s.skill,
    order.map((j) => ({ text: T(p.options[j]!), feedback: T(p.feedback[j]!) })),
    s.hints.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const h05Lessons: Lesson[] = specs.map((s, i) => {
  const id = `H05-L0${i + 1}`;
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
    unit: 'H05',
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
          '现在描述的是点、向量、长度还是标量？起点与方向是什么？',
          'Are you describing a point, vector, length or scalar? What are the start and direction?',
        ),
        t(
          '零向量、非零条件与非退化前提检查了吗？能用另一种表示核验吗？',
          'Have you checked zero vectors, nonzero conditions and nondegeneracy? Can another representation audit it?',
        ),
      ],
      bridge: s.prerequisites[0]!,
    },
    ...(i === 5
      ? {
          familyChallenge: t(
            '在纸上为虚构公园画A=(0,0)、B=(3,1)、D=(−1,3)的斜置场地，1格代表10 m。求C与对角线交点，证明是正方形，并比较沿两边走与直接走对角线的位移和路程。写明地图与实际场地是假设，由家长审核。',
            'On paper design a fictional park with A=(0,0), B=(3,1), D=(−1,3), using ten metres per square. Find C and the diagonal intersection, prove the site is square and compare displacement and distance for an edge route versus a diagonal. State the map assumptions for parent review.',
          ),
        }
      : {}),
  };
});
export function h05ReviewQuestion(id: string, round: number): Question {
  if (
    !/^H05-L0[1-6]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid H05 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 24,
    x = (k % 6) - 2,
    y = Math.floor(k / 6) - 1,
    u = readVector(`(${x},${y})`),
    v = readVector('(2,-1)');
  let item: Item;
  if (i === 0)
    item = R(
      [
        `求向量${vectorText(u)}的模长。`,
        `Find the magnitude of vector ${vectorText(u)}.`,
      ],
      lengthV(u),
      [
        '模长用分量平方和的主平方根。',
        'Magnitude is the principal square root of the sum of squared components.',
      ],
      ['999', '-999'],
    );
  else if (i === 1) {
    const sum = k % 2 === 0;
    item = XY(
      [
        `u=${vectorText(u)}，v=(2,−1)，求${sum ? 'u+v' : 'u−v'}。`,
        `For u=${vectorText(u)}, v=(2,−1), find ${sum ? 'u+v' : 'u−v'}.`,
      ],
      vectorText(sum ? addV(u, v) : subtractV(u, v)),
      [
        '按所给次序逐分量加减。',
        'Add or subtract components in the stated order.',
      ],
      ['(999,999)', '(-999,-999)'],
    );
  } else if (i === 2) {
    const scalar = rational(BigInt((k % 5) - 2), 2n);
    item = XY(
      [
        `u=${vectorText(u)}，k=${textR(scalar)}，求ku。`,
        `For u=${vectorText(u)} and k=${textR(scalar)}, find ku.`,
      ],
      vectorText(scaleV(scalar, u)),
      [
        '每个分量都乘同一标量，负号保留。',
        'Multiply every component by the same signed scalar.',
      ],
      ['(999,999)', '(-999,-999)'],
    );
  } else if (i === 3) {
    const a = u,
      b = addV(
        u,
        readVector(`(${(k % 4) - 1},${(Math.floor(k / 4) % 3) + 1})`),
      ),
      back = k % 2 === 1;
    item = XY(
      [
        `A=${vectorText(a)}、B=${vectorText(b)}，求${back ? '中点位置' : 'AB分量'}。`,
        `A=${vectorText(a)}, B=${vectorText(b)}. Find ${back ? 'the midpoint position' : 'components of AB'}.`,
      ],
      vectorText(back ? midpointV(a, b) : betweenV(a, b)),
      [
        '点位置取平均，差向量取终点减起点，不能混淆。',
        'Average positions for a midpoint; subtract start from end for a displacement.',
      ],
      ['(999,999)', '(-999,-999)'],
    );
  } else if (i === 4) {
    const angle = k % 3 === 0 || k === 4 || k === 8,
      m = angleV(u, v);
    item = angle
      ? V(
          [
            `u=${vectorText(u)}，v=(2,−1)，分类夹角（含zero-angle/straight/undefined）。`,
            `For u=${vectorText(u)}, v=(2,−1), classify the angle, including zero-angle/straight/undefined.`,
          ],
          m.kind,
          [
            '先核非零，再看是否同/反向和数量积符号。',
            'Check nonzero vectors, then same/opposite directions and dot-product sign.',
          ],
          ['square', 'equal'],
        )
      : N(
          [
            `u=${vectorText(u)}，v=(2,−1)，求u·v。`,
            `For u=${vectorText(u)}, v=(2,−1), find u·v.`,
          ],
          textR(dotV(u, v)),
          [
            '对应分量乘积相加，结果是标量。',
            'Add corresponding component products; the result is a scalar.',
          ],
          ['999', '-999'],
        );
  } else {
    const kind = (
        ['general', 'rectangle', 'rhombus', 'square', 'degenerate'] as const
      )[k % 5]!,
      m = geometricCase(kind, `(${x},${y})`);
    item =
      k % 3 === 0
        ? V(
            [
              `A=${vectorText(m.a)}、B=${vectorText(m.b)}、D=${vectorText(m.d)}，C=B+D−A，给最具体分类。`,
              `A=${vectorText(m.a)}, B=${vectorText(m.b)}, D=${vectorText(m.d)}, C=B+D−A. Give the most specific shape class.`,
            ],
            m.kind,
            [
              '先排共线退化，再查邻边点积与平方模。',
              'Exclude collinear degeneracy, then check adjacent dot product and squared magnitudes.',
            ],
            ['equal', 'undefined'],
          )
        : XY(
            [
              `A=${vectorText(m.a)}、B=${vectorText(m.b)}、D=${vectorText(m.d)}，按C=B+D−A求C（需另核是否非退化）。`,
              `A=${vectorText(m.a)}, B=${vectorText(m.b)}, D=${vectorText(m.d)}. Find C=B+D−A; nondegeneracy needs a separate check.`,
            ],
            vectorText(m.c),
            [
              '按位置关系算第四点，等式本身不保证非退化。',
              'Use the positional relation; the equation alone does not guarantee nondegeneracy.',
            ],
            ['(999,999)', '(-999,-999)'],
          );
  }
  return q(`${id}-R${round}`, i, item);
}
export const h05CheckQuestions: Question[] = [
  q('H05-CHECK-Q1', 0, specs[0]!.items[0]!),
  q('H05-CHECK-Q2', 1, specs[1]!.items[1]!),
  q('H05-CHECK-Q3', 2, specs[2]!.items[4]!),
  q('H05-CHECK-Q4', 3, specs[3]!.items[0]!),
  q('H05-CHECK-Q5', 4, specs[4]!.items[2]!),
  pick('H05-CHECK-Q6', 4),
  q('H05-CHECK-Q7', 3, specs[3]!.items[5]!),
  q('H05-CHECK-Q8', 5, specs[5]!.items[5]!),
];
