import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Unit = Extract<AnswerSpec, { kind: 'number' }>['unit'];
type Item = {
  stem: Pair;
  value: string;
  steps: Pair;
  wrong: string[];
  unit?: Unit;
  pi?: string;
  diagram?: Question['diagram'];
};
type Pick = {
  stem: Pair;
  correct: number;
  options: { text: Pair; feedback: Pair }[];
  steps: Pair;
};
type Spec = {
  title: Pair;
  objective: Pair;
  prerequisites: string[];
  keywords: Pair[];
  hook: Pair;
  lab: Lesson['lab'];
  items: Item[];
  pick: Pick;
  reason: Pair;
  rubric: Pair;
  misconception: Pair;
  prompts: Pair[];
};
const skills = [
  'circle-centre-radius-diameter',
  'pi-measurement-ratio',
  'circle-circumference',
  'circle-area-rearrangement',
  'cylinder-faces-volume',
];
const hints: Pair[][] = [
  [
    [
      '先找圆心与圆周端点；直径必须经过圆心。',
      'Find the centre and boundary endpoints; a diameter must pass through the centre.',
    ],
    [
      '同一个圆里 d=2r；已知直径求半径时除以二，旋转不改变。',
      'Within one circle d=2r. Halve the diameter to find radius; rotation changes neither length.',
    ],
  ],
  [
    [
      '先统一长度单位，再用完整圆周长除以直径，不是半径。',
      'Match length units, then divide the full circumference by diameter, not radius.',
    ],
    [
      '测量商只是所给读数之比，误差和取近似会使它偏离 π；π 不等于有限小数 3.14。',
      'The measured quotient belongs to the stated readings. Error and rounding can move it away from π; π is not the finite decimal 3.14.',
    ],
  ],
  [
    [
      '确认给的是 r 还是 d：C=2πr 或 C=πd，周长量边界一周。',
      'Identify r or d: C=2πr or C=πd. Circumference measures one boundary turn.',
    ],
    [
      '要求精确时保留 π；明确要求按 3.14 计算时才代入近似值，长度用一次单位。',
      'Retain π for exact answers. Substitute 3.14 only when requested; use length units.',
    ],
  ],
  [
    [
      '重排保留相同扇形。份数增多时半周弧边趋作底 πr，高趋近 r。',
      'Rearrangement retains the same sectors. With finer pieces, half the circumference approaches base πr and height approaches r.',
    ],
    [
      'A=πr²，直径要先折半；有限图仍有弧边，面积单位要平方。',
      'A=πr²: halve a given diameter first. Finite arrangements still have curved edges; area uses square units.',
    ],
  ],
  [
    [
      '侧面长方形的长为 2πr、宽为 h；先确定需要几个圆形面。',
      'The unwrapped side has length 2πr and width h. Count the required circular end faces first.',
    ],
    [
      '侧面积 2πrh；每个圆面 πr²；体积 πr²h，用内部尺寸，面积与体积单位不同。',
      'Side area is 2πrh and each end area πr². Volume is πr²h using internal dimensions; area and volume have different units.',
    ],
  ],
];
function q(id: string, index: number, item: Item): Question {
  const result = numeric(
    id,
    T(item.stem),
    item.value,
    skills[index]!,
    hints[index]!.map(T),
    [T(item.steps), T(hints[index]![1]!)],
    {
      accepted: [
        item.value,
        ...(item.unit ? [`${item.value} ${item.unit}`] : []),
        ...(item.pi ? [`${item.pi}pi`] : []),
      ],
      rejected: item.wrong,
    },
    item.diagram,
  );
  if (item.pi) {
    if (!['cm', 'cm²', 'cm³'].includes(item.unit ?? ''))
      throw new Error('Exact pi quantities require a dimensional unit');
    result.answer = {
      kind: 'pi-multiple',
      coefficient: item.pi,
      value: item.value,
      unit: item.unit as 'cm' | 'cm²' | 'cm³',
    };
  } else
    result.answer = {
      kind: 'number',
      value: item.value,
      unit: item.unit,
      formats: ['decimal', 'fraction'],
    };
  result.type = item.unit
    ? 'word_problem'
    : item.diagram
      ? 'visual_select'
      : 'numeric';
  result.misconceptionTags = [
    skills[index]!,
    'quantity-and-unit',
    'exact-versus-approximate',
  ];
  return result;
}
const pick = (id: string, index: number, p: Pick) =>
  choice(
    id,
    T(p.stem),
    p.correct,
    skills[index]!,
    p.options.map((o) => ({ text: T(o.text), feedback: T(o.feedback) })),
    hints[index]!.map(T),
    [T(p.steps)],
  );
const specs: Spec[] = [
  {
    title: ['圆心、半径与直径', 'Centre, radius and diameter'],
    objective: [
      '按端点和圆心识别半径、直径与弦，用 d=2r 求同圆长度。',
      'Identify radius, diameter and chord using endpoints and centre, and use d=2r within one circle.',
    ],
    prerequisites: ['B05-L01', 'P56-L02'],
    keywords: [
      ['圆心', 'centre'],
      ['半径', 'radius'],
      ['直径', 'diameter'],
    ],
    lab: 'circle-parts',
    hook: [
      '圆里一条很长的线段一定是直径吗？把圆旋转后，判断依据会变吗？',
      'Is a long segment inside a circle necessarily a diameter? Does rotating the drawing change the criterion?',
    ],
    items: [
      {
        stem: [
          '圆的半径 3 cm，直径多少厘米？',
          'A circle has radius 3 cm. What is its diameter?',
        ],
        value: '6',
        unit: 'cm',
        steps: [
          '直径由相反方向两条半径组成，2×3=6 cm。',
          'A diameter consists of two opposite radii: 2×3=6 cm.',
        ],
        wrong: ['3', '1.5', '9'],
        diagram: { kind: 'circle-parts', r: 3, angle: 30, offset: 0.5 },
      },
      {
        stem: [
          '直径 10 cm，半径多少厘米？',
          'The diameter is 10 cm. Find the radius.',
        ],
        value: '5',
        unit: 'cm',
        steps: [
          '半径是直径一半，10÷2=5 cm。',
          'Radius is half the diameter: 10÷2=5 cm.',
        ],
        wrong: ['20', '10'],
      },
      {
        stem: [
          '半径 4 cm 的圆旋转九十度，直径仍是多少厘米？',
          'A radius-4-cm circle is rotated ninety degrees. What is its diameter?',
        ],
        value: '8',
        unit: 'cm',
        steps: [
          '旋转不改长度，d=2×4=8 cm。',
          'Rotation preserves length: d=2×4=8 cm.',
        ],
        wrong: ['4', '90', '16'],
      },
      {
        stem: [
          '直径 3 cm，半径多少厘米？',
          'A circle has diameter 3 cm. Find its radius.',
        ],
        value: '1.5',
        unit: 'cm',
        steps: [
          '3÷2=1.5 cm，半径不必为整数。',
          '3÷2=1.5 cm; radius need not be an integer.',
        ],
        wrong: ['6', '1', '3'],
      },
      {
        stem: [
          '同圆所有半径为 2 cm，经过圆心且两端在圆周的弦长多少厘米？',
          'Every radius is 2 cm. Find the chord through the centre with both ends on the boundary.',
        ],
        value: '4',
        unit: 'cm',
        steps: [
          '经过圆心的弦就是直径，长 2×2=4 cm。',
          'A chord through the centre is a diameter: 2×2=4 cm.',
        ],
        wrong: ['2', '6'],
      },
      {
        stem: [
          '一个圆的直径 18 cm，半径多少厘米？',
          'A circle has diameter 18 cm. Find the radius.',
        ],
        value: '9',
        unit: 'cm',
        steps: [
          '18÷2=9 cm；两条九厘米半径组成直径。',
          '18÷2=9 cm; two opposite 9-cm radii make the diameter.',
        ],
        wrong: ['36', '18', '6'],
      },
    ],
    pick: {
      stem: [
        '关于直径，哪句话正确？',
        'Which statement about a diameter is correct?',
      ],
      correct: 1,
      options: [
        {
          text: [
            '圆内任意线段都是直径',
            'Every segment inside a circle is a diameter',
          ],
          feedback: [
            '端点还须在圆周且经过圆心。',
            'Both endpoints must lie on the boundary and the segment must pass through the centre.',
          ],
        },
        {
          text: [
            '经过圆心且两端在圆周的弦',
            'A chord through the centre with both endpoints on the boundary',
          ],
          feedback: [
            '同时满足端点和圆心两个条件。',
            'It meets both the endpoint and centre conditions.',
          ],
        },
        {
          text: [
            '只有水平线段才可能是直径',
            'Only horizontal segments can be diameters',
          ],
          feedback: [
            '方向不决定角色；斜着也能经过圆心。',
            'Orientation does not determine the role; a tilted diameter still passes through the centre.',
          ],
        },
      ],
      steps: [
        '半径连圆心与圆周，直径是过圆心的弦；同圆 d=2r。',
        'A radius joins centre to boundary; a diameter is a chord through the centre. In one circle d=2r.',
      ],
    },
    reason: [
      '解释为什么“不经过圆心的长弦”不是直径，并说明旋转图形后该怎样判断。',
      'Explain why a long chord missing the centre is not a diameter, including after rotation.',
    ],
    rubric: [
      '弦的两端在圆周，直径还必须经过圆心；长短或水平外观不能代替圆心条件。旋转保留端点关系、是否经过圆心和长度，所以判断不变。半径只有一端在圆心，不能把任意弦除二就称作半径。家长核对孩子指出圆心、端点和同圆条件，可用旋转图或口述举反例。',
      'A chord has boundary endpoints; a diameter additionally passes through the centre. Apparent length or horizontal orientation is insufficient. Rotation preserves endpoints, centre incidence and length, so classification stays the same. A radius starts at the centre; halving an arbitrary chord does not generally give a radius. Check references to centre, endpoints and the same circle, accepting a rotated drawing or spoken counterexample.',
    ],
    misconception: [
      '凭水平或很长认直径，或把直径当半径。',
      'Identifying diameters by horizontal appearance or length alone, or confusing diameter with radius.',
    ],
    prompts: [
      [
        '两端在哪里，经过圆心吗？',
        'Where are the endpoints, and does it pass through the centre?',
      ],
      [
        '换方向后，两个半径还组成同一直径吗？',
        'After rotation, do two opposite radii still make the same diameter?',
      ],
    ],
  },
  {
    title: ['圆周率的实验探索', 'Investigating pi'],
    objective: [
      '统一单位算读数 C÷d，区分测量商、模拟数据与精确圆周率。',
      'Match units to calculate C÷d, distinguishing measured quotients, simulated data and exact pi.',
    ],
    prerequisites: ['P66-L01', 'P52-L05', 'P63-L04'],
    keywords: [
      ['圆周率 π', 'pi'],
      ['周长与直径比', 'circumference-to-diameter ratio'],
      ['测量误差', 'measurement error'],
    ],
    lab: 'circle-pi',
    hook: [
      '两个大小不同的圆各滚一周，路程与直径的商会怎样？粗尺读数会精确等于 π 吗？',
      'Two differently sized circles each roll one turn. How do travel-to-diameter ratios compare, and can coarse ruler readings equal π exactly?',
    ],
    items: [
      {
        stem: [
          '假想读数 C=31.4 cm、d=10 cm。只算这组读数的 C÷d。',
          'Fictional readings: C=31.4 cm and d=10 cm. Calculate their quotient C÷d only.',
        ],
        value: '3.14',
        steps: [
          '31.4÷10=3.14 是这组读数的商，不证明 π 精确等于 3.14。',
          '31.4÷10=3.14 is this reading quotient, not proof that π equals 3.14 exactly.',
        ],
        wrong: ['6.28', '31.4', '0.314'],
      },
      {
        stem: [
          '假想读数 C=12.6 cm、d=4 cm，读数商多少？',
          'Fictional readings C=12.6 cm and d=4 cm: find their quotient.',
        ],
        value: '3.15',
        steps: [
          '12.6÷4=3.15，保留所给数据，不硬改成 3.14。',
          '12.6÷4=3.15; retain the entered data rather than forcing 3.14.',
        ],
        wrong: ['3.14', '6.3', '0.317'],
      },
      {
        stem: [
          '粗略假想读数 C=18 cm、d=6 cm，读数商多少？',
          'Coarse fictional readings C=18 cm and d=6 cm: find the quotient.',
        ],
        value: '3',
        steps: [
          '18÷6=3；粗读数商不等于精确圆周率。',
          '18÷6=3; the coarse reading quotient is not exact pi.',
        ],
        wrong: ['3.14', '6', '108'],
      },
      {
        stem: [
          '假想读数 C=62.8 cm、d=20 cm，C÷d 多少？',
          'Fictional readings C=62.8 cm and d=20 cm: calculate C÷d.',
        ],
        value: '3.14',
        steps: [
          '62.8÷20=3.14，统一单位后比没有厘米单位。',
          '62.8÷20=3.14; matching length units cancel in the ratio.',
        ],
        wrong: ['6.28', '314', '0.314'],
      },
      {
        stem: [
          'C=31.4 cm、d=100 mm。先统一单位，再算读数商 C÷d。',
          'C=31.4 cm and d=100 mm. Match units, then calculate the reading quotient.',
        ],
        value: '3.14',
        steps: [
          '100 mm=10 cm；31.4÷10=3.14，不能直接除一百。',
          '100 mm=10 cm, so 31.4÷10=3.14; do not divide the unmatched numbers.',
        ],
        wrong: ['0.314', '31.4', '314'],
      },
      {
        stem: [
          '假想读数 C=15.5 cm、d=5 cm。读数商多少？',
          'Fictional readings C=15.5 cm and d=5 cm: find the quotient.',
        ],
        value: '3.1',
        steps: [
          '15.5÷5=3.1，不能把本题数据商改成预设近似 π。',
          '15.5÷5=3.1; do not replace the requested data quotient with a preset pi approximation.',
        ],
        wrong: ['3.14', '6.2', '0.31'],
      },
    ],
    pick: {
      stem: [
        '关于模拟表和 π，哪句话正确？',
        'Which statement about the simulated table and π is correct?',
      ],
      correct: 2,
      options: [
        {
          text: [
            '模拟表就是实际测量证据',
            'A simulated table is an actual measurement record',
          ],
          feedback: [
            '表格按理想几何和精度计算，必须标明模拟。',
            'The table is computed from ideal geometry and precision and must be labelled simulated.',
          ],
        },
        {
          text: [
            '某次商是 3.14，就证明 π=3.14',
            'One quotient of 3.14 proves π=3.14',
          ],
          feedback: [
            '测量与有限小数不能给出这个精确结论。',
            'A finite measured quotient does not establish that exact identity.',
          ],
        },
        {
          text: [
            'π 是恒定比，测量商可能因精度偏离',
            'π is the constant ratio; reading quotients can differ with precision',
          ],
          feedback: [
            '区分数学量与有精度限制的数据。',
            'This separates the mathematical quantity from finite-precision data.',
          ],
        },
      ],
      steps: [
        '精确圆周率不是测量误差；测量商需要注明数据、单位与精度。',
        'Exact pi is distinct from measurement error; report the data, units and precision of a measured quotient.',
      ],
    },
    reason: [
      '为什么 12.6÷4=3.15 不表示这个圆的精确圆周率变了？说明模拟与实测的区别。',
      'Why does 12.6÷4=3.15 not mean exact pi changed for that circle? Distinguish simulated from observed measurements.',
    ],
    rubric: [
      '3.15 是这组有限精度读数的商，可能含周长读数取近似、尺误差或绕线不完整等影响；理想圆的周长与直径恒定比仍为 π。模拟表从理想几何再按精度显示，不能冒称实测，也不能用有限测量证明 π 的无理性。家长核对同单位、除直径、数据来源和近似说明，不要求孩子背出很多位小数。',
      '3.15 is the quotient of finite-precision readings, affected by rounding, ruler error or an incomplete wrap. The ideal circumference-to-diameter ratio remains π. The simulated table is generated from ideal geometry and then rounded; it is not observed data or a measurement proof of irrationality. Check matching units, division by diameter, data provenance and the approximation statement rather than memorized digits.',
    ],
    misconception: [
      '除半径得约 6.28，却称作 π；把模拟当实测或把 3.14 写成精确等号。',
      'Dividing by radius to get about 6.28 and calling it π, treating simulation as observation, or claiming π equals 3.14.',
    ],
    prompts: [
      ['两种长度用同一单位了吗？', 'Do both lengths use the same unit?'],
      [
        '这是所填读数的商，还是精确 π？',
        'Is this the reading quotient or exact π?',
      ],
    ],
  },
  {
    title: ['圆的周长', 'Circumference of a circle'],
    objective: [
      '辨明半径和直径，用 C=πd=2πr 求一周边界并区分精确与指定近似计算。',
      'Identify radius or diameter and use C=πd=2πr, separating exact answers from a specified approximation.',
    ],
    prerequisites: ['P66-L01', 'P66-L02'],
    keywords: [
      ['周长 C', 'circumference C'],
      ['精确值', 'exact value'],
      ['近似值', 'approximate value'],
    ],
    lab: 'circle-circumference',
    hook: [
      '半径五厘米与直径五厘米的圆，需要同样长的边框吗？何时保留 π，何时按 3.14 计算？',
      'Do radius-five and diameter-five circles need the same border length? When should π be retained or approximated by 3.14?',
    ],
    items: [
      {
        stem: [
          '半径 5 cm，求精确周长，保留 π。',
          'Radius 5 cm: find the exact circumference in terms of π.',
        ],
        value: '10π',
        pi: '10',
        unit: 'cm',
        steps: ['d=10 cm，C=πd=10π cm。', 'd=10 cm, so C=πd=10π cm.'],
        wrong: ['5π', '10', '31.4', '10π cm²'],
      },
      {
        stem: [
          '直径 8 cm，按 π≈3.14 计算周长。',
          'Diameter 8 cm: calculate circumference using π≈3.14.',
        ],
        value: '25.12',
        unit: 'cm',
        steps: [
          'C≈3.14×8=25.12 cm，不再乘二。',
          'C≈3.14×8=25.12 cm; do not double the diameter.',
        ],
        wrong: ['50.24', '8π', '25.12 cm²'],
      },
      {
        stem: [
          '直径 8 cm，求精确周长，保留 π。',
          'Diameter 8 cm: find the exact circumference in terms of π.',
        ],
        value: '8π',
        pi: '8',
        unit: 'cm',
        steps: [
          'C=πd=8π cm；精确值不以 25.12 替代。',
          'C=πd=8π cm; 25.12 is not the exact replacement.',
        ],
        wrong: ['16π', '25.12', '8'],
      },
      {
        stem: [
          '半径 3 cm，按 π≈3.14 计算一周边界长。',
          'Radius 3 cm: calculate one boundary turn using π≈3.14.',
        ],
        value: '18.84',
        unit: 'cm',
        steps: ['C≈2×3.14×3=18.84 cm。', 'C≈2×3.14×3=18.84 cm.'],
        wrong: ['9.42', '28.26', '18.84 cm²'],
      },
      {
        stem: [
          '直径 3 cm 的轮子无滑动滚四整周。求精确路程，保留 π。',
          'A diameter-3-cm wheel rolls four full turns without slipping. Find the exact distance in terms of π.',
        ],
        value: '12π',
        pi: '12',
        unit: 'cm',
        steps: [
          '每周 3π cm，四周共 4×3π=12π cm。',
          'Each turn covers 3π cm; four cover 12π cm.',
        ],
        wrong: ['3π', '24π', '12'],
      },
      {
        stem: [
          '按 π≈3.14，某圆周长计算值 31.4 cm。半径多少厘米？',
          'Using π≈3.14, a circle has calculated circumference 31.4 cm. Find the radius.',
        ],
        value: '5',
        unit: 'cm',
        steps: [
          'd=31.4÷3.14=10 cm，再折半得 r=5 cm。',
          'd=31.4÷3.14=10 cm, then r=5 cm.',
        ],
        wrong: ['10', '15.7', '6.28'],
      },
    ],
    pick: {
      stem: [
        '半径 r 已知时，周长是哪一个？',
        'Which expression gives circumference from radius r?',
      ],
      correct: 0,
      options: [
        {
          text: ['2πr，长度单位', '2πr, in length units'],
          feedback: [
            '一周是 π 个直径，而直径为 2r。',
            'One turn is π diameters, each of length 2r.',
          ],
        },
        {
          text: ['πr，平方单位', 'πr, in square units'],
          feedback: [
            '漏二，且周长不是面积。',
            'The factor two is missing and circumference is not area.',
          ],
        },
        {
          text: ['πr²，长度单位', 'πr², in length units'],
          feedback: [
            'πr² 算面积，须平方单位。',
            'πr² measures area in square units.',
          ],
        },
      ],
      steps: [
        '由 π=C/d 得 C=πd=2πr；先确认已知长度角色。',
        'From π=C/d, C=πd=2πr. Identify the given length first.',
      ],
    },
    reason: [
      '解释直径八厘米时精确周长 8π cm 与按 3.14 算的 25.12 cm 有何区别，为什么不用平方单位。',
      'Explain the distinction between exact 8π cm and 25.12 cm computed with 3.14 for diameter eight. Why are square units inappropriate?',
    ],
    rubric: [
      '圆周长量边界一周，所以是长度。π 是精确恒定比，直径八给出 C=8π cm；把 π 近似为 3.14 得 C≈25.12 cm，不宣称 π=3.14，也不能把 8π 漏写成八。平方厘米覆盖内部区域，是面积的单位。家长核对半径/直径、精确等号与近似号、边界对象和一次长度单位。',
      'Circumference measures one boundary turn and is therefore a length. The exact constant ratio gives C=8π cm for diameter eight. Replacing π by approximate 3.14 produces C≈25.12 cm, without claiming π=3.14 or dropping π to give eight. Square centimetres cover the interior and belong to area. Check the given length role, exact versus approximate equality, boundary quantity and linear unit.',
    ],
    misconception: [
      '给的是直径仍乘二；漏 π；周长写成平方厘米。',
      'Doubling a given diameter again, dropping π, or reporting circumference in square centimetres.',
    ],
    prompts: [
      ['已知那条线是 r 还是 d？', 'Is the given segment r or d?'],
      [
        '这题要求保留 π 还是指定近似？',
        'Does this question request π or a stated approximation?',
      ],
    ],
  },
  {
    title: ['圆的面积与重排', 'Area of a circle by rearranging'],
    objective: [
      '用同扇形重排解释 A=πr²，保留有限弧边并区分半径、面积与缩放。',
      'Explain A=πr² through sector rearrangement, retaining finite curved edges and distinguishing radius, area and scaling.',
    ],
    prerequisites: ['P66-L03', 'P56-L02', 'P56-L04'],
    keywords: [
      ['面积守恒', 'area conservation'],
      ['扇形重排', 'sector rearrangement'],
      ['平方单位', 'square units'],
    ],
    lab: 'circle-area',
    hook: [
      '把圆切成等扇形交错重排，有限份时真的变成精确长方形了吗？面积为何能保留？',
      'When equal sectors are rearranged alternately, is the finite result an exact rectangle? Why is area preserved?',
    ],
    items: [
      {
        stem: [
          '半径 3 cm，求精确圆面积，保留 π。',
          'Radius 3 cm: find exact circle area in terms of π.',
        ],
        value: '9π',
        pi: '9',
        unit: 'cm²',
        steps: [
          'A=π×3²=9π cm²；不把周长 6π 当面积。',
          'A=π×3²=9π cm², distinct from circumference 6π.',
        ],
        wrong: ['6π', '3π', '28.26', '9π cm'],
        diagram: { kind: 'circle-sectors', r: 3, count: 8, rearranged: true },
      },
      {
        stem: [
          '直径 8 cm，按 π≈3.14 计算面积。',
          'Diameter 8 cm: calculate area using π≈3.14.',
        ],
        value: '50.24',
        unit: 'cm²',
        steps: [
          'r=4 cm，A≈3.14×4×4=50.24 cm²。',
          'r=4 cm, so A≈3.14×4×4=50.24 cm².',
        ],
        wrong: ['200.96', '25.12', '50.24 cm'],
      },
      {
        stem: [
          '半径 4 cm，求精确面积，保留 π。',
          'Radius 4 cm: find exact area in terms of π.',
        ],
        value: '16π',
        pi: '16',
        unit: 'cm²',
        steps: ['A=πr²=16π cm²。', 'A=πr²=16π cm².'],
        wrong: ['8π', '4π', '50.24'],
      },
      {
        stem: [
          '半径从 2 cm 变为 4 cm，面积变为原来的几倍？',
          'Radius changes from 2 cm to 4 cm. By what factor does area change?',
        ],
        value: '4',
        steps: [
          '半径倍数二，面积倍数 2²=4；4π 变 16π。',
          'Radius doubles and area scales by 2²=4, from 4π to 16π.',
        ],
        wrong: ['2', '8', '16'],
      },
      {
        stem: [
          '半径 6 cm，求精确面积，保留 π。',
          'Radius 6 cm: find exact area in terms of π.',
        ],
        value: '36π',
        pi: '36',
        unit: 'cm²',
        steps: [
          'π×6×6=36π cm²；平方半径而非再乘二。',
          'π×6×6=36π cm²; square the radius rather than double it.',
        ],
        wrong: ['12π', '6π', '113.04'],
      },
      {
        stem: [
          '直径 4 cm，按 π≈3.14 计算面积。',
          'Diameter 4 cm: calculate area using π≈3.14.',
        ],
        value: '12.56',
        unit: 'cm²',
        steps: [
          '半径二，A≈3.14×2²=12.56 cm²。',
          'Radius is two, so A≈3.14×2²=12.56 cm².',
        ],
        wrong: ['50.24', '6.28', '12.56 cm³'],
      },
    ],
    pick: {
      stem: [
        '有限扇形重排后，哪句话正确？',
        'Which statement is correct after rearranging finitely many sectors?',
      ],
      correct: 1,
      options: [
        {
          text: [
            '已经是精确长方形，弧边可删掉',
            'It is already an exact rectangle; remove the curved edges',
          ],
          feedback: [
            '有限弧边仍存在，删掉会改变面积。',
            'Finite curved edges remain; discarding them changes area.',
          ],
        },
        {
          text: [
            '同扇形面积不变，细分后越来越像长方形',
            'The same sectors preserve area and approach a rectangle as they become finer',
          ],
          feedback: [
            '区分保面积的精确事实与有限图的近似外形。',
            'This separates exact conservation from the finite approximate shape.',
          ],
        },
        {
          text: [
            '底长是整周 2πr，所以面积 2πr²',
            'The base is the full circumference 2πr, so area is 2πr²',
          ],
          feedback: [
            '上下各承担半周，趋近的底长为 πr。',
            'The two long edges each account for half the circumference, giving limiting base πr.',
          ],
        },
      ],
      steps: [
        '每片保留原弧与两条半径，只移位置；半周作底，高趋近半径，得 πr²。',
        'Each piece retains its original arc and two radii. Half-circumference supplies the limiting base, and height approaches the radius, giving πr².',
      ],
    },
    reason: [
      '解释为什么有限图的虚线平行四边形面积小于整批扇形，却不表示重排丢了面积。',
      'Why can the dashed parallelogram in the finite model have less area than all the sectors without the rearrangement losing area?',
    ],
    rubric: [
      '原扇形只刚性移动，每份半径、圆心角和弧都保留，所有片面积总和仍为原圆。虚线沿弦连接，外侧弓形仍属于片，不能删掉。份数增加时弧更平，半周弧长 πr 对应极限底，高趋近 r，支持 A=πr²。家长核对保留每片、虚线与真实弧边区别、半周而非整周、面积平方单位，允许图示口述。',
      'Rigidly moving each original sector preserves its radius, angle, arc and area; the total remains the original circle. Dashed chords omit curved segments that still belong to the pieces. Finer sectors flatten the boundary, with half-circumference πr as limiting base and height approaching r, supporting A=πr². Check conservation of every piece, guide versus true curved boundary, half rather than full circumference and square units.',
    ],
    misconception: [
      '把有限弧边硬改直线；用整周当底；面积仍只乘一次半径。',
      'Replacing finite arcs by straight lines, using full circumference as the base, or failing to square the radius.',
    ],
    prompts: [
      [
        '每片有没有被拉伸、删去或重叠？',
        'Was any piece stretched, discarded or overlapped?',
      ],
      [
        '上下长边分别对应多少原圆周？',
        'How much original circumference belongs to each long edge?',
      ],
    ],
  },
  {
    title: ['圆柱的表面积和体积', 'Surface area and volume of cylinders'],
    objective: [
      '用同标尺展开图区分侧面、圆面与体积，按盖片数量和内部尺寸求量。',
      'Use a common-scale net to separate side area, circular ends and volume, accounting for end faces and internal dimensions.',
    ],
    prerequisites: ['P66-L03', 'P66-L04', 'P56-L05', 'P56-L06'],
    keywords: [
      ['侧面展开', 'unwrapped side'],
      ['表面积', 'surface area'],
      ['体积', 'volume'],
    ],
    lab: 'circle-cylinder',
    hook: [
      '同半径、同高的圆柱去掉盖片，面片面积和内部体积都变小吗？侧面长方形的长为什么不是直径？',
      'Removing a lid from a cylinder changes which face area is needed. Does the volume also change, and why is the side rectangle’s length not the diameter?',
    ],
    items: [
      {
        stem: [
          '理想封闭圆柱 r=2 cm、h=5 cm，求含两个圆面的精确表面积。',
          'An ideal closed cylinder has r=2 cm and h=5 cm. Find exact surface area including both ends.',
        ],
        value: '28π',
        pi: '28',
        unit: 'cm²',
        steps: [
          '侧面 2π×2×5=20π，两个底面 2×π×2²=8π，合 28π cm²。',
          'Side 20π plus two ends totaling 8π gives 28π cm².',
        ],
        wrong: ['20π', '24π', '28π cm³'],
        diagram: { kind: 'cylinder-net', r: 2, h: 5, lids: 2 },
      },
      {
        stem: [
          'r=2 cm、h=5 cm，只做圆柱侧面，精确面片面积多少？',
          'For r=2 cm and h=5 cm, find exact area of the cylindrical side only.',
        ],
        value: '20π',
        pi: '20',
        unit: 'cm²',
        steps: [
          '侧面展开长 4π、宽五，面积 20π cm²，不添圆面。',
          'The side rectangle is 4π by five, giving 20π cm² without ends.',
        ],
        wrong: ['10π', '28π', '20π cm³'],
      },
      {
        stem: [
          '理想圆柱内部 r=2 cm、h=5 cm，求精确体积。',
          'An ideal cylinder has internal r=2 cm and h=5 cm. Find exact volume.',
        ],
        value: '20π',
        pi: '20',
        unit: 'cm³',
        steps: [
          '底面积 4π cm² 乘高五，V=20π cm³。',
          'Base area 4π cm² times height five gives V=20π cm³.',
        ],
        wrong: ['28π', '20π cm²', '10π'],
      },
      {
        stem: [
          '薄壁无盖圆柱 r=2 cm、h=5 cm，需一圆面加侧面。求精确面片总面积，不含接缝。',
          'A thin-walled open-top cylinder has r=2 cm and h=5 cm. Find exact side-plus-one-end face area, excluding seams.',
        ],
        value: '24π',
        pi: '24',
        unit: 'cm²',
        steps: [
          '侧面 20π 加一个圆底 4π，合 24π cm²。',
          'Side 20π plus one circular base 4π gives 24π cm².',
        ],
        wrong: ['28π', '20π', '24π cm³'],
      },
      {
        stem: [
          '内部 r=2 cm、h=5 cm，按 π≈3.14 计算容积，单位 cm³。',
          'Internal r=2 cm and h=5 cm: calculate capacity in cm³ using π≈3.14.',
        ],
        value: '62.8',
        unit: 'cm³',
        steps: [
          'V≈3.14×2²×5=62.8 cm³；内部尺寸决定容积。',
          'V≈3.14×2²×5=62.8 cm³ using internal dimensions.',
        ],
        wrong: ['87.92', '31.4', '62.8 cm²'],
      },
      {
        stem: [
          '理想封闭圆柱 r=1 cm、h=7 cm，按 π≈3.14 计算表面积。',
          'An ideal closed cylinder has r=1 cm and h=7 cm. Calculate surface area using π≈3.14.',
        ],
        value: '50.24',
        unit: 'cm²',
        steps: [
          '侧面 14π 加两底 2π，共 16π；按 3.14 得约 50.24 cm²。',
          'Side 14π plus two ends 2π gives 16π, approximately 50.24 cm² using 3.14.',
        ],
        wrong: ['43.96', '21.98', '50.24 cm³'],
      },
    ],
    pick: {
      stem: [
        '同内部半径和高度，去掉上盖后，哪句话正确？',
        'With unchanged internal radius and height, which statement is correct after removing the top?',
      ],
      correct: 2,
      options: [
        {
          text: ['侧面长是直径 2r', 'The side length is diameter 2r'],
          feedback: [
            '展开要绕满一圈，长为 2πr。',
            'The side wraps one full turn, giving length 2πr.',
          ],
        },
        {
          text: [
            '内部体积少一个圆的面积',
            'Internal volume loses one circle’s area',
          ],
          feedback: [
            '面积与体积不能相减；内部空间尺寸没有改变。',
            'Area cannot be subtracted from volume; the internal dimensions are unchanged.',
          ],
        },
        {
          text: [
            '少一个圆面面积，完整内部空间体积不变',
            'Required face area loses one end; the full internal volume is unchanged',
          ],
          feedback: [
            '区分材料面的平方单位与内部空间的立方单位。',
            'This separates square-unit material area from cubic-unit internal space.',
          ],
        },
      ],
      steps: [
        'S=2πrh+kπr²，k 按圆面数；V=πr²h。',
        'S=2πrh+kπr² with k required ends; V=πr²h.',
      ],
    },
    reason: [
      '解释 r=2、h=5 时侧面积和体积都含 20π，却不能说它们是同一个量；去盖改变什么？',
      'For r=2 and h=5, explain why side area and volume both involve 20π but are not the same quantity. What changes when the lid is removed?',
    ],
    rubric: [
      '侧面积为圆周长 4π cm 乘高五，得到 20π cm²，测材料面；体积为底面积 4π cm² 乘高五，得到 20π cm³，测空间。系数碰巧相同不使不同维度相等。去盖少 4π cm²，内部半径和高不变，完整内部空间体积不变。实际容量看内部尺寸，面片面积不含接缝或材料浪费；只有侧面没有底时不可宣称它能盛液体。家长核对量名、面数、单位和维度。',
      'Side area is circumference 4π cm times height five, giving 20π cm² of material surface. Volume is base area 4π cm² times height five, giving 20π cm³ of space. Equal numerical coefficients do not equate dimensions. Removing a lid saves 4π cm² while unchanged internal radius and height preserve full internal volume. Actual capacity needs internal dimensions; face areas exclude seams and waste. A side without a bottom is not a liquid container. Check quantity, face count, units and dimension.',
    ],
    misconception: [
      '侧面用直径乘高；漏圆面；把面积与体积同系数当同量或用外部尺寸算容量。',
      'Using diameter times height for side area, omitting ends, confusing matching coefficients across dimensions or using outside dimensions for capacity.',
    ],
    prompts: [
      [
        '要哪些面，侧面长从哪里来？',
        'Which faces are needed, and where does the side length come from?',
      ],
      [
        '测面还是空间，单位为何不同？',
        'Are you measuring a surface or space, and why do units differ?',
      ],
    ],
  },
];
export const p66Lessons: Lesson[] = specs.map((s, i) => {
  const id = `P66-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: i >= 3 ? 24 : 20,
    lab: s.lab,
    hook: T(s.hook),
    stage: 'P06',
    unit: 'P66',
    order: i + 1,
    nzYearHints: [6, 7],
    cnGradeHints: [6],
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
            '在纸上画圆并标圆心、半径、直径；可用一条纸边比一周与直径，标明是粗测或模拟而不写 π=3.14。画同一批等扇形的两种排法，说明面积保留与有限弧边。最后画半径二、高五的理想圆柱展开图，比较封闭和无盖的面片面积及同尺寸内部体积；不要切割硬罐，也无需实际称量或购买。',
            'Draw a circle with centre, radius and diameter. Optionally compare one turn to the diameter with a paper edge, labelling coarse readings or simulation rather than writing π=3.14. Sketch two arrangements of the same sectors and discuss conserved area and finite arcs. Draw a radius-two, height-five ideal cylinder net and compare closed versus open-top face area and unchanged internal volume. No cutting rigid cans, actual weighing or purchases are needed.',
          ),
        }
      : {}),
  };
});
export function p66ReviewQuestion(id: string, round: number): Question {
  if (!Number.isSafeInteger(round) || round < 0 || round > 100000)
    throw new RangeError('Invalid retrieval round');
  const i = p66Lessons.findIndex((l) => l.id === id);
  if (i < 0) throw new RangeError('Unknown P66 lesson');
  const k = round % 80,
    r = 1 + (k % 8),
    h = 1 + (Math.floor(k / 8) % 10);
  let item: Item;
  if (i === 0) {
    const d = 1 + (k % 24);
    item = {
      stem: [
        `同圆直径 ${d} cm，半径多少厘米？`,
        `A circle has diameter ${d} cm. Find its radius.`,
      ],
      value: String(d / 2),
      unit: 'cm',
      steps: [`${d}÷2=${d / 2} cm。`, `${d}÷2=${d / 2} cm.`],
      wrong: [String(d * 2)],
    };
  } else if (i === 1) {
    const d = 2 * (1 + (k % 5)),
      tenths = Math.round(Math.PI * d * 10);
    item = {
      stem: [
        `模拟读数 C=${tenths / 10} cm、d=${d} cm。写这组读数商的精确分数或等值小数，不用预设 π。`,
        `Simulated readings C=${tenths / 10} cm and d=${d} cm. Give their exact quotient as a fraction or equivalent decimal, without substituting a preset π.`,
      ],
      value: `${tenths}/${10 * d}`,
      steps: [
        `${tenths / 10}÷${d}=${tenths}/${10 * d}，这是读数商。`,
        `${tenths / 10}÷${d}=${tenths}/${10 * d}, a reading quotient.`,
      ],
      wrong: [`${tenths + 1}/${10 * d}`],
    };
  } else if (i === 2)
    item = {
      stem: [
        `半径 ${r} cm，求精确周长，保留 π。`,
        `Radius ${r} cm: find exact circumference in terms of π.`,
      ],
      value: `${2 * r}π`,
      pi: String(2 * r),
      unit: 'cm',
      steps: [`C=2π×${r}=${2 * r}π cm。`, `C=2π×${r}=${2 * r}π cm.`],
      wrong: [`${2 * r + 1}π`, `${2 * r}π cm²`],
    };
  else if (i === 3)
    item = {
      stem: [
        `半径 ${r} cm，求精确面积，保留 π。`,
        `Radius ${r} cm: find exact area in terms of π.`,
      ],
      value: `${r * r}π`,
      pi: String(r * r),
      unit: 'cm²',
      steps: [`A=π×${r}²=${r * r}π cm²。`, `A=π×${r}²=${r * r}π cm².`],
      wrong: [`${r * r + 1}π`, `${r * r}π cm`],
    };
  else {
    const lids = k % 3,
      volume = k % 2 === 1,
      coef = volume ? r * r * h : 2 * r * h + lids * r * r;
    item = {
      stem: [
        `理想圆柱 r=${r} cm、h=${h} cm，${volume ? '用内部尺寸求精确体积' : `需侧面和 ${lids} 个圆面，求精确面片面积`}，保留 π。`,
        `An ideal cylinder has r=${r} cm and h=${h} cm. ${volume ? 'Use internal dimensions to find exact volume' : `Find exact face area for the side and ${lids} circular ends`}, in terms of π.`,
      ],
      value: `${coef}π`,
      pi: String(coef),
      unit: volume ? 'cm³' : 'cm²',
      steps: [
        `${volume ? 'πr²h' : '2πrh+kπr²'}=${coef}π ${volume ? 'cm³' : 'cm²'}。`,
        `${volume ? 'πr²h' : '2πrh+kπr²'}=${coef}π ${volume ? 'cm³' : 'cm²'}.`,
      ],
      wrong: [`${coef + 1}π`, `${coef}π cm`],
    };
  }
  return q(`${id}-R${round}`, i, item);
}
export const p66CheckQuestions: Question[] = [
  q('P66-CHECK-Q1', 0, {
    stem: ['半径 4 cm，直径多少厘米？', 'Radius 4 cm: find diameter.'],
    value: '8',
    unit: 'cm',
    steps: ['d=2×4=8 cm。', 'd=2×4=8 cm.'],
    wrong: ['4', '2'],
  }),
  q('P66-CHECK-Q2', 1, {
    stem: [
      '假想读数 C=31.5 cm、d=10 cm，求读数商。',
      'Fictional readings C=31.5 cm and d=10 cm: find the quotient.',
    ],
    value: '3.15',
    steps: [
      '31.5÷10=3.15，是读数商而非精确 π。',
      '31.5÷10=3.15 is the reading quotient, not exact π.',
    ],
    wrong: ['3.14', '6.3'],
  }),
  q('P66-CHECK-Q3', 2, {
    stem: [
      '直径 6 cm，求精确周长，保留 π。',
      'Diameter 6 cm: find exact circumference in terms of π.',
    ],
    value: '6π',
    pi: '6',
    unit: 'cm',
    steps: ['C=πd=6π cm。', 'C=πd=6π cm.'],
    wrong: ['12π', '6', '18.84'],
  }),
  q('P66-CHECK-Q4', 3, {
    stem: [
      '半径 5 cm，求精确面积，保留 π。',
      'Radius 5 cm: find exact area in terms of π.',
    ],
    value: '25π',
    pi: '25',
    unit: 'cm²',
    steps: ['A=π×5²=25π cm²。', 'A=π×5²=25π cm².'],
    wrong: ['10π', '25π cm'],
  }),
  q('P66-CHECK-Q5', 4, {
    stem: [
      '圆柱内部 r=3 cm、h=4 cm，求精确体积。',
      'Cylinder internal r=3 cm and h=4 cm: find exact volume.',
    ],
    value: '36π',
    pi: '36',
    unit: 'cm³',
    steps: ['π×3²×4=36π cm³。', 'π×3²×4=36π cm³.'],
    wrong: ['24π', '36π cm²'],
  }),
  pick('P66-CHECK-Q6', 3, specs[3]!.pick),
  q('P66-CHECK-Q7', 4, {
    stem: [
      '理想无盖圆柱 r=3 cm、h=4 cm，求侧面加一个底面的精确面积。',
      'An ideal open-top cylinder has r=3 cm and h=4 cm. Find exact side-plus-one-base area.',
    ],
    value: '33π',
    pi: '33',
    unit: 'cm²',
    steps: [
      '侧面 24π 加一底 9π 得 33π cm²。',
      'Side 24π plus one base 9π gives 33π cm².',
    ],
    wrong: ['42π', '24π', '33π cm³'],
  }),
  reasoning(
    'P66-CHECK-Q8',
    t(
      '解释有限扇形重排的面积为何不变；再比较 r=2、h=5 的封闭与无盖圆柱面片面积和内部体积，说明单位及精确/近似。',
      'Explain area conservation under finite sector rearrangement, then compare face area and internal volume of closed and open-top cylinders with r=2 and h=5. Distinguish units and exact versus approximate values.',
    ),
    skills[4]!,
    t(
      '同扇形只刚性移动，有限弧边仍在，不把虚线辅助形当整圆。圆柱侧面 20π cm²，封闭两底共 8π，表面积 28π cm²；无盖一底，总面积 24π cm²；内部体积均为 20π cm³。保留 π 为精确形式，按 3.14 所得才用近似说法。家长核对每片保留、半周/半径、面数、内部尺寸及平方/立方单位，不能把同系数当同量。',
      'The same sectors move rigidly and retain finite arcs; the dashed guide is not the whole circle. Cylinder side area is 20π cm². Two ends add 8π for closed area 28π cm², while one end gives open-top area 24π cm². Both full internal volumes are 20π cm³. π forms are exact; results computed using 3.14 are approximate. Check every retained piece, half-circumference and radius, end counts, internal dimensions and square versus cubic units; matching coefficients do not equate quantities.',
    ),
    hints[4]!.map(T),
  ),
];
