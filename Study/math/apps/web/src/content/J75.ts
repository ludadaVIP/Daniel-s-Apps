import {
  t,
  type Lesson,
  type Question,
  type AnswerSpec,
  type NumberDiagram,
} from '../model';
import { numeric, choice, reasoning } from './builders';
import {
  readCoordinate,
  coordinateText,
  basicBounds,
  type PlotBounds,
} from '../cartesianModels';
type Pair = [string, string];
const T = (s: Pair) => t(...s);
type Item = {
  stem: Pair;
  value: string;
  step: Pair;
  wrong: string[];
  accepted?: string[];
  kind?: 'coordinate' | 'expression';
  unit?: Extract<AnswerSpec, { kind: 'number' }>['unit'];
  diagram?: NumberDiagram;
};
type Pick = {
  stem: Pair;
  options: Pair[];
  feedback: Pair[];
  correct: number;
  step: Pair;
};
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
const diagram = (
  x: number,
  y: number,
  label = 'A',
  bounds: PlotBounds = basicBounds,
): NumberDiagram => ({ kind: 'cartesian', bounds, points: [{ x, y, label }] });
const P = (
  stem: Pair,
  value: string,
  step: Pair,
  wrong: string[],
  graph?: NumberDiagram,
): Item => ({ stem, value, step, wrong, kind: 'coordinate', diagram: graph });
const N = (
  stem: Pair,
  value: string,
  step: Pair,
  wrong: string[],
  unit?: Item['unit'],
  graph?: NumberDiagram,
): Item => ({ stem, value, step, wrong, unit, diagram: graph });
const E = (
  stem: Pair,
  value: string,
  step: Pair,
  wrong: string[],
  accepted?: string[],
): Item => ({ stem, value, step, wrong, kind: 'expression', accepted });
const skills = [
  'ordered-cartesian-position',
  'coordinate-plot-and-scale',
  'same-row-table-points',
  'affine-rate-and-intercept',
  'contextual-graph-domain',
];
const hints: Pair[][] = [
  [
    [
      '先找原点与两轴正方向，横轴对应 x，纵轴对应 y。',
      'Locate the origin and positive axis directions: horizontal x, vertical y.',
    ],
    [
      '按 (x,y) 的顺序，左/下用负号；轴上有一个坐标零，原点两个都零，不属于象限。',
      'Use (x,y), with negatives left/down. An axis point has a zero coordinate and the origin has two; axis points belong to no quadrant.',
    ],
  ],
  [
    [
      '先读每格刻度，不把每一格都默认成一；先横后纵。',
      'Read each tick interval instead of assuming every square is one; horizontal before vertical.',
    ],
    [
      '坐标线与轴平行，两条位置线的交点才是目标。单位或视窗改变不改变原数对，分数可以位于整数之间。',
      'Coordinate projections run parallel to the axes; their intersection is the point. Units or view changes do not alter the data pair, and fractions can lie between integers.',
    ],
  ],
  [
    [
      '同一行的 x、y 组成一个点，不把不同两行交叉配对。',
      'Pair x and y from the same row, not from different rows.',
    ],
    [
      '描点前标轴、单位和刻度；连续连线要由题设模型支持，整数份数只画离散点。',
      'Label axes, units and scale before plotting. A continuous connection needs a supplied model; integer counts remain discrete points.',
    ],
  ],
  [
    [
      '在已知 y=kx+b 模型中，k 是每单位 x 的变化，b 是 x=0 的输出。',
      'Under a supplied y=kx+b model, k is change per unit x and b is the output at zero.',
    ],
    [
      '已知线性时可由两点求变化率及初始量；没有模型假设，几个吻合点不决定一般规律。常数情形 k=0 也要读清。',
      'Two points determine rate and intercept under the linear premise. Without it, a few matches do not determine a general rule. Include the constant case k=0.',
    ],
  ],
  [
    [
      '把两轴的数量、单位、初始量与每单位变化写清。',
      'Identify both quantities, units, initial value and change per unit.',
    ],
    [
      '先核输入范围：整数件数与连续时间不同，空箱后不延长负水量；图上倾斜外观随刻度改变，不代替数值变化率。',
      'Check the domain: integer counts differ from continuous time, and draining stops at empty. Visual steepness varies with scale and does not replace a numerical rate.',
    ],
  ],
];
function q(id: string, i: number, item: Item): Question {
  const answer: AnswerSpec =
    item.kind === 'coordinate'
      ? { kind: 'coordinate', value: item.value }
      : item.kind === 'expression'
        ? { kind: 'expression', value: item.value, variable: 'x' }
        : {
            kind: 'number',
            value: item.value,
            formats: ['decimal', 'fraction'],
            ...(item.unit ? { unit: item.unit } : {}),
          };
  const accepted = [
    item.value,
    ...(item.accepted ?? []),
    ...(item.unit ? [`${item.value} ${item.unit}`] : []),
  ];
  if (item.kind === 'coordinate') {
    const r = readCoordinate(item.value)!;
    accepted.push(
      coordinateText(r),
      `（${r[0][0] * 2n}/${r[0][1] * 2n}，${r[1][0] * 2n}/${r[1][1] * 2n}）`,
    );
  }
  const result = numeric(
    id,
    T(item.stem),
    item.value,
    skills[i]!,
    hints[i]!.map(T),
    [T(item.step), T(hints[i]![1]!)],
    { accepted: [...new Set(accepted)], rejected: item.wrong },
    item.diagram,
  );
  result.answer = answer;
  result.type =
    i === 4 ? 'word_problem' : item.diagram ? 'visual_select' : 'numeric';
  result.misconceptionTags = [
    skills[i]!,
    'scale-versus-data',
    'sample-versus-rule',
  ];
  return result;
}
const pick = (id: string, i: number, p: Pick) =>
  choice(
    id,
    T(p.stem),
    p.correct,
    skills[i]!,
    p.options.map((s, j) => ({ text: T(s), feedback: T(p.feedback[j]!) })),
    hints[i]!.map(T),
    [T(p.step)],
  );
const specs: Spec[] = [
  {
    title: ['直角坐标系', 'The Cartesian plane'],
    objective: [
      '用有序数对表示平面位置，区分正负方向、象限与轴上点。',
      'Represent positions by ordered pairs, distinguishing signs, quadrants and axis points.',
    ],
    prerequisites: ['J71-L02', 'J74-L01'],
    keywords: [
      ['原点', 'origin'],
      ['有序数对', 'ordered pair'],
      ['象限', 'quadrant'],
    ],
    lab: 'cart-plane',
    hook: [
      '(3,−2) 与 (−2,3) 为什么不是同一个位置？点在轴上还属于哪个象限？',
      'Why do (3,−2) and (−2,3) locate different positions? Does an axis point belong to a quadrant?',
    ],
    items: [
      P(
        [
          '从原点向右三单位、再向下二单位，写 P 的坐标。',
          'From the origin move three units right and two down. Write P.',
        ],
        '(3,-2)',
        [
          '横坐标三，纵坐标负二，顺序为 (3,−2)，不是把移动先后任意交换坐标位置。',
          'Horizontal three, vertical negative two gives (3,−2); the coordinate slots have fixed meanings.',
        ],
        ['(-2,3)', '(3,2)', '3'],
        diagram(3, -2, 'P'),
      ),
      N(
        [
          '点 A=(−4,2)，它的横坐标是多少？',
          'A=(−4,2). What is its horizontal coordinate?',
        ],
        '-4',
        [
          '有序数对第一项是横坐标，负四表示原点左侧。',
          'The first entry is horizontal; negative four locates it left of the origin.',
        ],
        ['2', '4'],
      ),
      N(
        [
          '点 B=(5,0)，它的纵坐标是多少？',
          'B=(5,0). What is its vertical coordinate?',
        ],
        '0',
        [
          '第二项为零，点在 x 轴而非第一或第四象限。',
          'The second entry is zero, so B lies on the x-axis rather than in quadrant I or IV.',
        ],
        ['5', '无解'],
      ),
      P(
        [
          '在 y 轴上、原点下方三单位的点，坐标是什么？',
          'What are the coordinates of a point on the y-axis three units below the origin?',
        ],
        '(0,-3)',
        [
          'y 轴上 x=0，向下 y=−3。',
          'On the y-axis x=0; three down means y=−3.',
        ],
        ['(-3,0)', '(0,3)'],
        diagram(0, -3),
      ),
      P(
        [
          '横坐标负二、纵坐标五，写该点的有序数对。',
          'Write the ordered pair with horizontal coordinate negative two and vertical coordinate five.',
        ],
        '(-2,5)',
        [
          'x 在前 y 在后，负二、五对应第二象限。',
          'x precedes y: negative two then five, in quadrant II.',
        ],
        ['(5,-2)', '(2,5)'],
        diagram(-2, 5),
      ),
      P(
        [
          '从原点左三单位、下二单位，写坐标。',
          'From the origin move three left and two down. Write the coordinates.',
        ],
        '(-3,-2)',
        [
          '左与下均为负，得到 (−3,−2)，第三象限。',
          'Left and down are negative: (−3,−2), quadrant III.',
        ],
        ['(-2,-3)', '(3,2)'],
      ),
    ],
    pick: {
      stem: ['点 (0,−3) 属于哪里？', 'Where does (0,−3) lie?'],
      correct: 1,
      options: [
        ['第三象限', 'Quadrant III'],
        ['y 轴上，不属于象限', 'On the y-axis, in no quadrant'],
        ['x 轴上', 'On the x-axis'],
      ],
      feedback: [
        [
          '象限内部的 x、y 都非零。',
          'Both coordinates are nonzero inside a quadrant.',
        ],
        ['x=0 正是 y 轴条件。', 'x=0 is the condition for the y-axis.'],
        [
          'x 轴要求 y=0，这里纵坐标负三。',
          'The x-axis requires y=0, but y is negative three.',
        ],
      ],
      step: [
        '轴是象限的边界，原点与轴上点不分到象限内部。',
        'Axes bound the quadrants; neither axis points nor the origin belong inside one.',
      ],
    },
    reason: [
      '解释两轴、原点、数对顺序与四象限符号；改变横轴视窗为何不改变 P 的坐标？',
      'Explain axes, origin, coordinate order and quadrant signs. Why does changing the horizontal view not change P?',
    ],
    rubric: [
      '横 x 纵 y 共原点，(x,y) 位置有序；I(+,+)、II(−,+)、III(−,−)、IV(+,−)，任一坐标零则在轴上，两者零为原点，不在象限。改显示范围或每格数值只改屏幕位置和刻度，数据数对不改；两轴间距可以不对应相同数值，须分别读标签。家长核对方向、轴与显示/数据的区别。',
      'Horizontal x and vertical y share an origin and the slots in (x,y) are ordered. Signs are I(+,+), II(−,+), III(−,−), IV(+,−). Zero coordinates locate axes, with (0,0) the origin, outside quadrants. Changing bounds or tick intervals alters display positions, not the data pair. Read each axis independently. A parent checks directions and the distinction between data and display.',
    ],
    misconception: [
      '坐标交换；漏负号；轴上点塞进象限；以屏幕距离当坐标。',
      'Swapped entries, lost negatives, placing axis points in quadrants, or taking screen distance as a coordinate.',
    ],
    prompts: [
      ['第一个数沿哪条轴？', 'Which axis corresponds to the first entry?'],
      [
        '屏幕上的点变了位置，数据真的变了吗？',
        'Did the data change when the screen position moved?',
      ],
    ],
  },
  {
    title: ['坐标描点与读点', 'Plotting and reading coordinates'],
    objective: [
      '按两轴刻度描出整数或分数点，并用平行于轴的投影读数。',
      'Plot integer or fractional points using axis scales and read them through axis-parallel projections.',
    ],
    prerequisites: ['J75-L01', 'P63-L05'],
    keywords: [
      ['描点', 'plotting'],
      ['刻度', 'scale'],
      ['坐标投影', 'coordinate projection'],
    ],
    lab: 'cart-plot',
    hook: [
      '一格是 1/2 时，向右三格是三还是 3/2？你能在图上找到 (0,−3) 吗？',
      'If a tick is 1/2, do three steps right give three or 3/2? Can you plot (0,−3)?',
    ],
    items: [
      P(
        [
          '读图中 A 的有序坐标，注意两轴标注。',
          'Read the ordered coordinates of A from the labelled axes.',
        ],
        '(-2,3)',
        [
          '投影到横轴读负二，到纵轴读三，得到 (−2,3)。',
          'Project to the horizontal axis for −2 and the vertical for three: (−2,3).',
        ],
        ['(3,-2)', '(2,3)'],
        diagram(-2, 3),
      ),
      P(
        [
          '图中每相邻刻度为 1/2，读 P 的坐标。',
          'Adjacent ticks are 1/2 apart. Read P.',
        ],
        '(3/2,-1/2)',
        [
          '横向三半单位为 3/2，纵向下一半单位为 −1/2。',
          'Three half-steps right give 3/2 and one half-step down gives −1/2.',
        ],
        ['(3,-1)', '(-1/2,3/2)'],
        diagram(1.5, -0.5, 'P', {
          xMin: -2,
          xMax: 2,
          yMin: -2,
          yMax: 2,
          xStep: 0.5,
          yStep: 0.5,
        }),
      ),
      N(
        [
          '横轴每格二单位，A 在原点左三格。求 A 横坐标。',
          'The x-axis interval is two units. A is three ticks left of zero. Find its x-coordinate.',
        ],
        '-6',
        [
          '三格乘每格二，向左取负，x=−6，不是负三。',
          'Three ticks times two units, negative to the left: x=−6.',
        ],
        ['-3', '6'],
        undefined,
        diagram(-6, 2, 'A', {
          xMin: -8,
          xMax: 8,
          yMin: -4,
          yMax: 4,
          xStep: 2,
          yStep: 1,
        }),
      ),
      P(
        [
          '点在 y 轴且纵坐标四，写有序数对。',
          'A point lies on the y-axis with vertical coordinate four. Write its pair.',
        ],
        '(0,4)',
        [
          'y 轴要求横坐标零，不能写 (4,0)。',
          'The y-axis requires x=0, not (4,0).',
        ],
        ['(4,0)', '(0,-4)'],
        diagram(0, 4),
      ),
      P(
        [
          'P=(−3,2)，关于 x 轴对称后横位置不变、纵位置相反。写新点坐标。',
          'P=(−3,2) is reflected in the x-axis, keeping its horizontal position and reversing its vertical position. Write the image.',
        ],
        '(-3,-2)',
        [
          '保留 x=−3，y 从二改负二；只改变垂直方向。',
          'Keep x=−3 and change y from two to negative two.',
        ],
        ['(3,2)', '(2,-3)'],
      ),
      P(
        [
          '从 (−2,−1) 向右五单位、向上三单位，终点坐标？',
          'Start at (−2,−1), move five units right and three up. Find the endpoint.',
        ],
        '(3,2)',
        [
          'x=−2+5=3，y=−1+3=2；两个方向分别计算。',
          'x=−2+5=3 and y=−1+3=2, calculated separately.',
        ],
        ['(5,3)', '(2,3)'],
      ),
    ],
    pick: {
      stem: [
        '描点最可靠的步骤是哪项？',
        'Which is the reliable plotting procedure?',
      ],
      correct: 2,
      options: [
        ['总把一格当一单位', 'Always treat one square as one'],
        [
          '先读 y，再把它填进 x 的位置',
          'Read y first and place it in the x slot',
        ],
        [
          '核每轴刻度，先找 x，再找 y，两条位置线相交',
          'Check each scale, locate x then y and intersect their coordinate lines',
        ],
      ],
      feedback: [
        [
          '刻度可能是半、二或其他数值。',
          'Intervals may be halves, twos or other values.',
        ],
        [
          '数对第一位置固定对应横轴。',
          'The first slot belongs to the horizontal axis.',
        ],
        [
          '此过程保留顺序、符号和单位大小。',
          'This preserves order, signs and interval size.',
        ],
      ],
      step: [
        '图中的每一格是显示间距，数值大小来自标尺。',
        'A square is a display interval; its value comes from the scale.',
      ],
    },
    reason: [
      '说明怎样在半单位网格描 (3/2,−1/2)，如何用投影读回，并解释交换两个数或改变视窗会造成什么。',
      'Explain plotting (3/2,−1/2) on half-unit axes, reading it back by projection and the effects of swapping entries or rescaling.',
    ],
    rubric: [
      '先沿横轴向右三半单位到 x=3/2，再平行纵轴下移一半单位到 y=−1/2；投影回两轴读相同数值。交换后为不同点 (−1/2,3/2)，不只是换读法。改视窗可让同点在屏幕移动，但数对及相对原点的实际数值不变；零坐标应落轴上。家长看刻度、方向与交点，键盘/点击方式不改变几何任务。',
      'Move three half-unit ticks right to x=3/2, then half a unit down parallel to y. Projections return the same entries. Swapping produces a different point (−1/2,3/2). Rescaling moves the display position while preserving the pair and numerical relation to zero. A zero coordinate lies on an axis. A parent checks scale, direction and intersection rather than input method.',
    ],
    misconception: [
      '按格数直接报坐标；先纵后横且交换位置；零坐标没落轴；对称时两个符号全改。',
      'Reporting square counts as coordinates, swapping slots, missing axis points, or changing both signs under a one-axis reflection.',
    ],
    prompts: [
      ['这一格究竟代表多少？', 'What value does this interval represent?'],
      [
        '把点投影回轴上，读数是否和原数对一致？',
        'Do the axis projections reproduce the original pair?',
      ],
    ],
  },
  {
    title: ['从表格到图像', 'From tables to graphs'],
    objective: [
      '把同一行的输入输出组成点，并按模型是否连续决定连线。',
      'Turn each input/output row into a point and connect only when the supplied model supports continuity.',
    ],
    prerequisites: ['J75-L02', 'P57-L04'],
    keywords: [
      ['输入输出', 'input/output'],
      ['数据点', 'data point'],
      ['连续与离散', 'continuous/discrete'],
    ],
    lab: 'cart-table',
    hook: [
      '四行表就是四个点，还是一条必然的直线？如果 x 数的是整张卡片，半张的位置有意义吗？',
      'Do four table rows imply four points or a guaranteed line? If x counts whole cards, does a half-card position mean anything?',
    ],
    items: [
      P(
        [
          '已给 y=2x+1。表中 x=2 的一行应成为哪个坐标点？',
          'Given y=2x+1, which coordinate point comes from the row x=2?',
        ],
        '(2,5)',
        [
          '先用规则算 y=5，同一行配 (2,5)，不是把输出放前。',
          'The rule gives y=5; pair the same-row input/output as (2,5).',
        ],
        ['(5,2)', '(2,4)'],
      ),
      N(
        [
          '已给规则 y=2x+1，补表中 x=−1 对应的 y。',
          'Given y=2x+1, fill y for the row x=−1.',
        ],
        '-1',
        [
          '2×(−1)+1=−1，输入负数时保留负号。',
          '2×(−1)+1=−1; retain the input sign.',
        ],
        ['3', '1'],
      ),
      N(
        [
          '虚构整数份数 n=0、1、2、3，给定费用 C=2n+3。n=2 行的 C 是多少 NZD？',
          'For fictional integer counts n=0,1,2,3, a supplied cost rule is C=2n+3. Find C at n=2 in NZD.',
        ],
        '7',
        [
          '按给定规则，2×2+3=7；固定三只加一次。',
          'Use 2×2+3=7, adding the fixed three once.',
        ],
        ['10', '5'],
        'NZD',
      ),
      N(
        [
          '已给连续规则 y=4−x，0≤x≤3。求表中 x=3/2 的 y。',
          'A supplied continuous rule is y=4−x for 0≤x≤3. Find y at x=3/2.',
        ],
        '5/2',
        [
          '4−3/2=5/2，分数输入在给定连续范围内。',
          '4−3/2=5/2, with the fractional input inside the continuous domain.',
        ],
        ['11/2', '2'],
      ),
      P(
        [
          '表中同一行 x=0、y=−2，写应描的点。',
          'A table row has x=0 and y=−2. Write its plotted point.',
        ],
        '(0,-2)',
        [
          '同行组成 (0,−2)，在 y 轴下部。',
          'The same row forms (0,−2), below zero on the y-axis.',
        ],
        ['(-2,0)', '(0,2)'],
      ),
      P(
        [
          '表的三行分别是 x=−2、0、3，y=−5、−1、5。只问最后一行的坐标，不推断未知规律。',
          'Rows have x=−2,0,3 paired respectively with y=−5,−1,5. Give only the final row point, without inferring an unspecified rule.',
        ],
        '(3,5)',
        [
          '最后同行 x=3、y=5，所以 (3,5)；几个点本身不保证其他输入的输出。',
          'The final row is (3,5); samples alone do not guarantee outputs elsewhere.',
        ],
        ['(5,3)', '(3,-1)'],
      ),
    ],
    pick: {
      stem: [
        '什么时候可以把表的点用连续模型线连接？',
        'When is connecting table points with a continuous model justified?',
      ],
      correct: 0,
      options: [
        [
          '题设给连续关系并规定有效范围',
          'A continuous relationship and valid domain are supplied',
        ],
        [
          '只要有三个点就一定连成一条直线',
          'Any three points imply one straight line',
        ],
        [
          '整张卡片的费用也自动允许半张',
          'Whole-card costs automatically allow half cards',
        ],
      ],
      feedback: [
        [
          '连线来自模型条件而非美观。',
          'The model premise justifies the connection.',
        ],
        [
          '点数不决定关系形式，三点也可能不共线。',
          'Point count does not determine a rule; three points may not even be collinear.',
        ],
        [
          '这会悄悄扩大整数输入范围。',
          'This silently enlarges an integer domain.',
        ],
      ],
      step: [
        '先保存同行配对，再区分记录、离散规则和给定连续模型。',
        'Preserve row pairing, then distinguish observations, discrete rules and supplied continuous models.',
      ],
    },
    reason: [
      '解释同一表格的同行配对、轴标签与刻度，比较整数份数的离散点和给定均匀变化的连续图线；为何不能用几行记录保证整条规律？',
      'Explain row pairing, labels and scales. Compare discrete counts with a supplied uniform continuous model, and explain why a few recorded rows do not establish a general rule.',
    ],
    rubric: [
      '同行 x 与 y 构成有序点，轴名与单位来自数量，刻度要均匀且分别读。整数份数只取明确整数点，点间的分数输入不自动有效；给定连续规则才可在其范围连线。几个数据记录可以与多种模型相容，不证明其他点或线性；连线若仅作示意需明说，不能装成已知实际变化。家长核对点、范围和证据来源。',
      'Each row gives an ordered point, with axis quantities, units and uniform intervals explicitly labelled. Integer counts yield only permitted integer points; fractional inputs between them are not automatic. A supplied continuous rule permits a line within its domain. Several observations fit multiple models and do not prove linearity or unseen outputs. A merely illustrative connection must be identified as such. A parent checks points, domain and evidence.',
    ],
    misconception: [
      '跨行配对；把点数当直线证据；所有点都连；整数模型偷加分数输入。',
      'Cross-row pairing, inferring a line from sample count, connecting everything, or adding fractional count inputs.',
    ],
    prompts: [
      ['这个点用了表中哪一行？', 'Which table row supplied this point?'],
      [
        '这条连线是题设模型，还是你从少数点猜的？',
        'Is the connecting model supplied or guessed from a few points?',
      ],
    ],
  },
  {
    title: ['简单线性规律', 'Simple linear relationships'],
    objective: [
      '在已知线性模型下解释恒定变化率与初始量，并区分样本吻合与一般关系。',
      'Interpret constant rate and intercept under a linear premise, separating sample agreement from a general rule.',
    ],
    prerequisites: ['J75-L03', 'J72-L01', 'J73-L02'],
    keywords: [
      ['变化率', 'rate of change'],
      ['初始量', 'initial value'],
      ['线性模型', 'linear model'],
    ],
    lab: 'cart-linear',
    hook: [
      'y=2x+3 为什么是直线却不经过原点？y=x 与 y=x² 在零、一都相等，能说明它们相同吗？',
      'Why is y=2x+3 straight without passing through the origin? Does agreement of y=x and y=x² at zero and one establish identity?',
    ],
    items: [
      N(
        [
          '已给线性规则 y=3x+2，x=4 时 y 为多少？',
          'Given y=3x+2, find y at x=4.',
        ],
        '14',
        [
          '先乘三再加初始二，3×4+2=14；不是 (3+2)×4。',
          'Multiply four by three then add two: fourteen, not (3+2)×4.',
        ],
        ['20', '12'],
      ),
      E(
        [
          '已知关系为 y=kx+b，经过 (0,−1)、(2,3)。只写 y 右侧的一般式，不写等号。',
          'The relationship is known to be y=kx+b and passes through (0,−1) and (2,3). Write only the expression after y=.',
        ],
        '2x-1',
        [
          'x 从零到二，y 从负一到三，变化率 4/2=2；x=0 输出负一，所以 2x−1。',
          'The rate is (3−(−1))/(2−0)=2 and the zero input gives −1, so 2x−1.',
        ],
        ['2x+1', '3', 'x+1'],
        ['-1+2x', '2(x-1/2)'],
      ),
      E(
        [
          '给定每个 x 的输出恒为负二。只写 y 的一般表达式；允许常数答案。',
          'For every x, the output is negative two. Give the expression for y; a constant answer is allowed.',
        ],
        '-2',
        [
          'k=0、b=−2，是水平常数关系，不强加一个 x。',
          'k=0 and b=−2 give a horizontal constant relation; no x term is needed.',
        ],
        ['-2x', '0', '2'],
      ),
      N(
        [
          '已知线性变化率为 −2，x 增加三单位，y 的变化量是多少？',
          'A linear rate is −2 per unit x. If x increases by three, what is the change in y?',
        ],
        '-6',
        [
          'Δy=kΔx=−2×3=−6，是变化量而非最终 y。',
          'Δy=kΔx=−6 is a change, not the final y.',
        ],
        ['6', '-2', '1'],
      ),
      E(
        [
          '已知 y=kx+b，经过 (0,3)、(2,3)。给 y 的一般式，不写等号。',
          'A known y=kx+b relationship passes through (0,3) and (2,3). Give the expression for y, omitting the equal sign.',
        ],
        '3',
        [
          '变化率零、初始三，所以始终 y=3，不是 3x。',
          'The rate is zero and intercept three, so the constant expression is three, not 3x.',
        ],
        ['3x', '0', 'x+3'],
      ),
      E(
        [
          '已给 y=kx+b，k=−1/2、b=2。写 y 右侧的一般式。',
          'Given y=kx+b with k=−1/2 and b=2, write the expression after y=.',
        ],
        '-x/2+2',
        [
          '每增加一单位 x，y 减半，零输入输出二；−x/2+2。',
          'Each unit increase in x decreases y by a half; the zero-input output is two: −x/2+2.',
        ],
        ['x/2+2', '-2x+2', '3/2'],
        ['2-x/2', '(-1/2)x+2'],
      ),
    ],
    pick: {
      stem: [
        '只有两个点吻合，哪项说法正确？',
        'What is justified by two matching data points alone?',
      ],
      correct: 1,
      options: [
        ['足以证明对全部输入都线性', 'It proves linearity for every input'],
        [
          '在额外已知线性模型下，两点可确定参数；样本本身不证明模型',
          'With an additional linear premise they determine parameters; samples alone do not prove the model',
        ],
        [
          '只要过原点就是正比例直线',
          'Any relation through the origin is a direct-proportion line',
        ],
      ],
      feedback: [
        [
          '还可能有经过同样两点的曲线。',
          'Curves can pass through the same two points.',
        ],
        [
          '区分模型假设与模型内参数计算。',
          'Distinguish a model premise from determining its parameters.',
        ],
        [
          '平方关系也过原点却不是直线。',
          'A square relation passes through zero but is not straight.',
        ],
      ],
      step: [
        '反例可以推翻一般等式，少数吻合不能证明一般等式。',
        'A counterexample refutes a universal equality; a few matches do not prove one.',
      ],
    },
    reason: [
      '解释 y=kx+b 的 k、b，说明本课含零变化的广义用法与正比例条件；用 y=x、y=x² 说明两个试值不足以证明一般规律。',
      'Explain k and b, the broad constant-inclusive use of linear here and the origin condition for direct proportion. Use y=x and y=x² to explain why two matches are insufficient.',
    ],
    rubric: [
      'k=Δy/Δx（Δx 非零）是单位变化，b 是 x=0 输出。k 正增、负减、零恒定；本课广义线性包含常数，严格一次函数要求 k≠0，不能混称。b 非零的直线不是正比例；过原点还要直线形式，不能只靠原点。y=x 与 x² 在零、一相同，在二分别二、四，所以不是恒等；参数求解须在已给线性前提下。家长核对条件和反例，不按几个点的外观决定一般性质。',
      'k=Δy/Δx for nonzero Δx is the per-unit rate; b is output at zero. Positive, negative and zero k give increase, decrease and constancy. This lesson uses linear broadly to include constants; strict first-degree functions exclude k=0. Nonzero b rules out direct proportion; passing through zero alone is also insufficient without a straight proportional form. y=x and x² agree at zero and one but give two and four at x=2. Two-point parameter determination needs the supplied linear premise.',
    ],
    misconception: [
      '把初始量也随 x 重复；把 k 当视觉角度；任何直线都叫正比例；两次吻合就断定规律。',
      'Repeating the intercept per input, equating rate to visual angle, calling every straight relation proportional, or inferring a rule from two matches.',
    ],
    prompts: [
      [
        'x 增一时 y 变多少，x=0 时剩什么？',
        'What changes per unit x, and what remains at x=0?',
      ],
      [
        '线性是已知假设，还是你正要验证的猜想？',
        'Is linearity a given assumption or a conjecture to investigate?',
      ],
    ],
  },
  {
    title: ['变量变化的现实解释', 'Interpreting variables in context'],
    objective: [
      '把初始量、带单位变化率和输入范围对应到图像，避免不当连线或外推。',
      'Connect initial value, unit-bearing rate and domain to a graph, avoiding unjustified connections or extrapolation.',
    ],
    prerequisites: ['J75-L04', 'J73-L06', 'P68-L01'],
    keywords: [
      ['变量与单位', 'variables and units'],
      ['有效范围', 'valid domain'],
      ['模型假设', 'model assumption'],
    ],
    lab: 'cart-context',
    hook: [
      '排水线延长到空箱以后出现负升数，是计算错误还是模型越界？卡片费为何只有整数点？',
      'Does a negative tank volume after extending a draining line mean arithmetic failure or a domain violation? Why do card costs have integer points?',
    ],
    items: [
      N(
        [
          '虚构水箱 V=12−2t，t 分钟且 0≤t≤6，V 升。t=5/2 时有多少升？',
          'A fictional tank follows V=12−2t litres for time t minutes, 0≤t≤6. Find V at t=5/2.',
        ],
        '7',
        [
          '12−2×5/2=7 L，输入在给定时段；每分钟少二升，初始十二升。',
          '12−2×5/2=7 L, within the supplied interval; initial volume twelve, draining two litres per minute.',
        ],
        ['17', '5'],
        'L',
      ),
      N(
        [
          '同一给定模型 V=12−2t，0≤t≤6。何时恰好空箱（分钟）？',
          'For V=12−2t on 0≤t≤6, when is the tank exactly empty in minutes?',
        ],
        '6',
        [
          '令 V=0，2t=12，t=6 min，在模型边界；以后不预测负水量。',
          'Set V=0: t=6 min, the domain boundary; do not predict negative volume afterwards.',
        ],
        ['12', '0', '-6'],
        'min',
      ),
      N(
        [
          '虚构卡片费 C=3n+5 NZD，n 为 0–6 整数。四张收费多少？',
          'Fictional card cost C=3n+5 NZD allows integer n from 0 to 6. Find the cost for four cards.',
        ],
        '17',
        [
          '3×4+5=17 NZD，固定五元只加一次。',
          '3×4+5=17 NZD; add the fixed fee once.',
        ],
        ['32', '12'],
        'NZD',
      ),
      E(
        [
          '虚构卡片每张三元、一次固定费五元，x 为 0–6 整数张数。写总费的一般式，不写等号。',
          'Fictional cards cost three each plus one fixed five; x is an integer count from 0 to 6. Write total cost as an expression without an equal sign.',
        ],
        '3x+5',
        [
          '每张重复项 3x，再加一次五，范围保留整数。',
          'Repeat three x times and add five once, retaining the integer domain.',
        ],
        ['8x', '17', '3x-5'],
        ['5+3x'],
      ),
      N(
        [
          '假想摄氏读数 T=−4+(3/2)t，t 小时、0≤t≤4。两小时后的读数（°C）？',
          'A fictional Celsius model T=−4+(3/2)t uses hours with 0≤t≤4. Find the reading after two hours in °C.',
        ],
        '-1',
        [
          '初始负四，加三得负一；负读数符合摄氏情境。',
          'Start at negative four and add three: negative one, permitted for Celsius.',
        ],
        ['1', '7', '-7'],
        '°C',
      ),
      N(
        [
          '虚构排水模型 V=9−(3/2)t，t 分钟且 0≤t≤6。t=4 时有多少升？',
          'A fictional draining model V=9−(3/2)t litres uses minutes with 0≤t≤6. Find V at t=4.',
        ],
        '3',
        [
          '9−(3/2)×4=3 L，时间在范围内；每分钟减 1.5 L。',
          '9−(3/2)×4=3 L within the domain, draining 1.5 litres per minute.',
        ],
        ['15', '6'],
        'L',
      ),
    ],
    pick: {
      stem: [
        '对给定模型图线，哪项解释正确？',
        'Which interpretation of a supplied model graph is correct?',
      ],
      correct: 2,
      options: [
        [
          '排水线可以无限延伸成负水量',
          'A draining line can extend indefinitely to negative volume',
        ],
        ['整张卡片数可自动取 2.5', 'Whole-card counts automatically allow 2.5'],
        [
          '先查数量、单位与范围，再解释初始量和每单位变化',
          'Check quantities, units and domain before interpreting intercept and per-unit change',
        ],
      ],
      feedback: [
        ['空箱后模型条件已失效。', 'The model ends at empty.'],
        [
          '这不符合整数张数定义。',
          'This violates the integer count definition.',
        ],
        [
          '图线的数学形式与适用范围需要一起读。',
          'Read the mathematical form together with its domain.',
        ],
      ],
      step: [
        '代数延长仍能算出数，不代表情境允许这个预测；越出模型范围不等于方程本身无解。',
        'An algebraic extension can produce a number without a valid contextual prediction; leaving a model domain is not the same as an equation having no solution.',
      ],
    },
    reason: [
      '比较排水、卡片费与升温图的起点、变化方向、单位与范围；说明空箱后延长、半张卡片及只凭图线陡峭比较速率为什么不可靠。',
      'Compare initial values, direction, units and domains of draining, card cost and warming. Explain why extending past empty, half-card inputs and comparing visual steepness alone are unreliable.',
    ],
    rubric: [
      '水量从十二升开始每分钟减二，0–6 分钟可连续取值，空后不延长负量。费用整数张数 0–6，每张三元加一次五元，只画离散点；n=0 仍五元来自本虚构规则，不推广真实收费。温度从负四摄氏每小时升 1.5，0–4 小时连续且负值可有效。轴尺度改变视觉斜角但不改数值率；单位不同也不能直接比较数大小。所有线性关系均为给定局部模型，不保证范围外真实情况。家长看数量、假设和边界，不只核代入。',
      'Volume starts at twelve litres and falls two per minute over a continuous 0–6 minute domain, ending at empty. Cost permits integer counts 0–6, with three NZD per card plus one fixed five, so only discrete points; charging five at zero is this fictional rule, not a claim about actual pricing. Temperature starts at −4°C and rises 1.5°C per hour over 0–4 hours, allowing negative readings. Axis scales alter visual angles without changing numerical rates, and differing units forbid naive comparisons. Supplied local models do not guarantee behaviour outside their domains.',
    ],
    misconception: [
      '负水量当预测；整数件数随便连线；单位不写；拿视觉斜度当速率；把局部模型推广到所有时段。',
      'Predicting negative volumes, connecting count inputs, omitting units, treating steepness as rate, or extending a local model universally.',
    ],
    prompts: [
      [
        '横轴每一单位是什么，纵轴每一单位又是什么？',
        'What does a unit on each axis measure?',
      ],
      [
        '从哪个输入开始模型不再允许，理由是什么？',
        'At which input does the model cease to apply, and why?',
      ],
    ],
  },
];
export const j75Lessons: Lesson[] = specs.map((s, i) => {
  const id = `J75-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: 20,
    lab: s.lab,
    hook: T(s.hook),
    stage: 'J07',
    unit: 'J75',
    order: i + 1,
    nzYearHints: [7, 8],
    cnGradeHints: [7],
    contentStatus: 'ready',
    skillTags: [skills[i]!],
    guided: q(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i, s.pick),
      ...s.items.slice(1, 5).map((item, j) => q(`${id}-Q${j + 2}`, i, item)),
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
            '纸上画一张虚构的新西兰社区花园网格图，给三个地点有序坐标，换横轴显示范围后读回同样数对。再自拟一条限时均匀排水规则与一种整数份数费用规则，列三行表、标轴单位并决定连不连；写清假设、有效范围与一个不允许输入。让家人查交换坐标、漏固定量或越界外推的错误，无须外出购买。',
            'On paper, make a fictional New Zealand community-garden grid with three ordered locations. Change the horizontal viewing range and recover the same pairs. Create a time-limited uniform draining model and an integer-count cost rule, build three table rows and label quantities/units before deciding whether to connect. State assumptions, domains and one invalid input. Ask a family member to find a swapped coordinate, missed intercept or out-of-domain extension; no visit or purchase is needed.',
          ),
        }
      : {}),
  };
});
export function j75ReviewQuestion(id: string, round: number): Question {
  if (
    !/^J75-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid J75 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 80,
    a = (k % 9) - 4,
    b = (Math.floor(k / 9) % 9) - 4,
    d = k % 2 ? 2 : 1,
    m = (k % 5) - 2,
    c = 1 + (k % 6);
  let item: Item;
  if (i === 0)
    item = P(
      [
        `横坐标 ${a}、纵坐标 ${b}，写有序数对；若有零仍要写两个数。`,
        `Write the pair with horizontal coordinate ${a} and vertical coordinate ${b}; keep both entries even if zero.`,
      ],
      `(${a},${b})`,
      ['先 x 后 y，轴上点保留零。', 'x before y; retain zero for axis points.'],
      [`(${a + 1},${b})`],
      diagram(a, b),
    );
  else if (i === 1)
    item = P(
      [
        `点从 (${a}/${d},${b}/${d}) 向右 1/${d}、向下 1/${d}，写终点。`,
        `Move from (${a}/${d},${b}/${d}) right 1/${d} and down 1/${d}; give the endpoint.`,
      ],
      `(${a + 1}/${d},${b - 1}/${d})`,
      [
        '横加指定步长，纵减指定步长，保留精确分数。',
        'Add the horizontal step and subtract the vertical step, keeping exact fractions.',
      ],
      [`(${a - 1}/${d},${b + 1}/${d})`],
    );
  else if (i === 2)
    item = P(
      [
        `已给 y=${m}x+(${b})，表中 x=${a} 的一行对应哪个点？`,
        `Given y=${m}x+(${b}), which point comes from the row x=${a}?`,
      ],
      `(${a},${m * a + b})`,
      [
        '同一输入与输出配对，先代入再按顺序书写。',
        'Substitute, then pair that same input and output in order.',
      ],
      [`(${a},${m * a + b + 1})`],
    );
  else if (i === 3)
    item = E(
      [
        `已给 y=kx+b，k=${m}/${d}、b=${b}，写 y 右侧一般式，不写等号；常数也可。`,
        `Given y=kx+b with k=${m}/${d}, b=${b}, write only the general expression for y; constants are allowed.`,
      ],
      `(${m}/${d})x+(${b})`,
      [
        '每单位变化乘 x，再加一次零输入的输出；零系数不需要变量。',
        'Multiply the per-unit rate by x and add the intercept once; zero coefficients need no variable.',
      ],
      [`(${m}/${d})x+(${b + 1})`],
    );
  else
    item = N(
      [
        `虚构水量 V=${2 * c + 6}−2t L，t 分钟、0≤t≤${c + 3}。求 t=${c}/2 时的水量。`,
        `Fictional volume V=${2 * c + 6}−2t L uses minutes on 0≤t≤${c + 3}. Find V at t=${c}/2.`,
      ],
      String(c + 6),
      [
        '输入在给定范围，精确代入初始量减排水量，单位升。',
        'The input is within the domain; subtract the exact drained amount and retain litres.',
      ],
      [String(c + 7)],
      'L',
    );
  return q(`${id}-R${round}`, i, item);
}
export const j75CheckQuestions: Question[] = [
  q(
    'J75-CHECK-Q1',
    0,
    P(
      [
        '从原点左四、上二单位，写坐标。',
        'From zero move four left and two up. Write the pair.',
      ],
      '(-4,2)',
      [
        '横负四、纵二，先横后纵。',
        'Horizontal −4, vertical two; horizontal first.',
      ],
      ['(2,-4)', '(4,2)'],
      diagram(-4, 2),
    ),
  ),
  q(
    'J75-CHECK-Q2',
    1,
    P(
      [
        'P 横坐标 1/2、纵坐标 −3/2，写数对。',
        'P has x=1/2 and y=−3/2. Write its pair.',
      ],
      '(1/2,-3/2)',
      [
        '保留两个精确分数，横在前。',
        'Keep both exact fractions, horizontal first.',
      ],
      ['(-3/2,1/2)', '(1,-3)'],
      diagram(0.5, -1.5, 'P', {
        xMin: -2,
        xMax: 2,
        yMin: -2,
        yMax: 2,
        xStep: 0.5,
        yStep: 0.5,
      }),
    ),
  ),
  q(
    'J75-CHECK-Q3',
    2,
    N(
      [
        '已给 y=−2x+3，求表中 x=2 行的 y。',
        'Given y=−2x+3, find y in the row x=2.',
      ],
      '-1',
      ['−2×2+3=−1，同行配对不交换。', '−2×2+3=−1; preserve row pairing.'],
      ['7', '1'],
    ),
  ),
  q(
    'J75-CHECK-Q4',
    3,
    E(
      [
        '已知 y=kx+b 经过 (0,4)、(2,0)，写 y 右侧一般式。',
        'A known y=kx+b relationship passes (0,4) and (2,0). Write the expression for y.',
      ],
      '-2x+4',
      [
        '变化率 (0−4)/2=−2，零输入输出四。',
        'The rate is (0−4)/2=−2, with intercept four.',
      ],
      ['2x+4', '-2x-4', '0'],
      ['4-2x'],
    ),
  ),
  q(
    'J75-CHECK-Q5',
    4,
    N(
      [
        '虚构水箱 V=10−2t L，0≤t≤5 分钟。t=3/2 时水量？',
        'A fictional tank has V=10−2t L on 0≤t≤5 minutes. Find V at t=3/2.',
      ],
      '7',
      ['10−3=7 L，在范围内。', '10−3=7 L, within the domain.'],
      ['13', '8'],
      'L',
    ),
  ),
  q(
    'J75-CHECK-Q6',
    3,
    N(
      [
        '已知线性变化率为 3/2，x 增四，y 改变量？',
        'A linear rate is 3/2 per x unit. For an increase of four in x, find the change in y.',
      ],
      '6',
      [
        '变化量等于单位变化乘输入变化，3/2×4=6。',
        'Multiply rate by input change: 3/2×4=6.',
      ],
      ['3/8', '11/2'],
    ),
  ),
  pick('J75-CHECK-Q7', 2, specs[2]!.pick),
  reasoning(
    'J75-CHECK-Q8',
    t(
      '从一条表格行写一个坐标，再解释何时可连成线；给一个连续情境和一个整数情境，说明变化率、初始量和范围。最后用反例说明少数点吻合不能证明一般规律。',
      'Turn one table row into a coordinate and explain when connection is justified. Give a continuous and an integer context with rate, intercept and domain, then use a counterexample to show that a few matches do not prove a general rule.',
    ),
    skills[4]!,
    t(
      '同行有序配对、两轴标签刻度齐全；给定连续模型可在范围内连线，整数件数只画允许点。解释每单位输出变化、零输入值与单位，排水至零停止、整数范围不含半件。y=x 与 x² 在零一吻合、二不同，是有效反例；已知线性模型内求参数不能倒说成已证明模型真实。家长核对数对、连线依据、域和推理。',
      'Require same-row ordered pairing and labelled scales. Connect only a supplied continuous model within its domain; integer counts remain permitted points. Explain per-unit change, output at zero and units, stopping draining at empty and excluding half items. y=x and x² match at zero/one but differ at two, a valid counterexample. Determining parameters under a linear premise does not prove that premise describes reality. A parent checks coordinates, connection conditions, domain and reasoning.',
    ),
    hints[4]!.map(T),
  ),
];
