import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import type { CongruenceRule, ProofVerdict } from '../congruenceModels';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Mode = 'number' | 'code' | 'rule' | 'verdict' | 'explain';
type Item = {
  stem: Pair;
  value: string;
  steps: Pair[];
  wrong: string[];
  mode: Mode;
  unit?: '°' | 'cm';
  diagram?: Question['diagram'];
  accepted?: string[];
};
const I = (
  stem: Pair,
  value: string,
  steps: Pair[],
  wrong: string[],
  mode: Mode = 'number',
  unit?: Item['unit'],
): Item => ({ stem, value, steps, wrong, mode, unit });
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
  'ordered-congruence-correspondence',
  'sss-sas-sufficient-conditions',
  'asa-aas-angle-side-conditions',
  'isosceles-properties-and-converse',
  'parallelogram-properties-and-tests',
  'short-proof-dependency-chain',
];
const hints: Pair[][] = [
  [
    [
      '先按全等式从左到右一一对应顶点，再确定边和角。',
      'Match vertices in the stated order before matching sides and angles.',
    ],
    [
      '平移、旋转和反射不改大小；放大只保持形状，不保证全等。',
      'Translation, rotation and reflection preserve size; enlargement preserves shape without guaranteeing congruence.',
    ],
  ],
  [
    [
      '列已知的对应边/角，不把未标关系从图上补入。',
      'List given corresponding sides/angles rather than adding unmarked relations from appearance.',
    ],
    [
      '三边用 SSS；两边和它们之间的夹角用 SAS。非夹角 SSA 不作一般判据。',
      'Three sides give SSS; two sides and their included angle give SAS. Non-included SSA is not a general criterion.',
    ],
  ],
  [
    [
      '找两个对应角及一条对应边，核该边是否夹在已给两角之间。',
      'Locate two corresponding angles and a side, checking whether the side joins those two angles.',
    ],
    [
      '夹边为 ASA、非夹边为 AAS；可先用内角和补第三角再换判据，但必须说明。只有 AAA 不限定大小。',
      'An included side gives ASA, otherwise AAS. The angle sum can supply a third angle to convert criteria, with justification. AAA alone leaves size free.',
    ],
  ],
  [
    [
      '先认等腰顶角与底角，等边所对的角相等。',
      'Identify the apex and base angles; equal sides face equal angles.',
    ],
    [
      '顶角加两个相等底角为 180°；若反推等边，需给角相等的依据。辅助线构造条件与待证结论分开。',
      'Apex plus two equal base angles is 180°. Converse equal sides need justified equal angles. Separate an auxiliary construction from the target.',
    ],
  ],
  [
    [
      '按顺序命名简单四边形，分清性质的已知与判定的条件。',
      'Use a simple quadrilateral in vertex order and distinguish given properties from converse tests.',
    ],
    [
      '两组条件需完整；一组对边同时平行且相等必须是同一组。对角线可引出全等，不能用待证性质证明自己。',
      'Keep complete premises. A pair parallel and equal must be the same pair. Diagonals support congruence; do not assume the property being proved.',
    ],
  ],
  [
    [
      '把每个结论的依赖写在前面，先列原始已知与待证。',
      'State givens and target, then establish each premise before using its conclusion.',
    ],
    [
      '列对应边角→全等判据→对应结论。公共边可自反，平行角要有平行前提；测量和循环引用都不是证明。',
      'List corresponding elements, a congruence criterion, then corresponding conclusions. Common sides are reflexive; parallel-angle facts need parallel premises. Measurement and circular reasoning are not proofs.',
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
    item.mode === 'code'
      ? {
          kind: 'geometry-code',
          value: item.value,
          reversible: item.value.length === 2,
        }
      : item.mode === 'rule'
        ? {
            kind: 'congruence-rule',
            value: item.value as CongruenceRule,
            alternatives:
              item.value === 'ASA'
                ? ['AAS']
                : item.value === 'AAS'
                  ? ['ASA']
                  : [],
          }
        : item.mode === 'verdict'
          ? { kind: 'proof-verdict', value: item.value as ProofVerdict }
          : { kind: 'number', value: item.value, unit: item.unit };
  const alternatives =
      item.mode === 'rule' && ['ASA', 'AAS'].includes(item.value)
        ? [item.value === 'ASA' ? 'AAS' : 'ASA']
        : [],
    codes =
      item.mode === 'code' && item.value.length === 2
        ? [[...item.value].reverse().join('')]
        : [];
  const r = numeric(
    id,
    T(item.stem),
    item.value,
    skills[i]!,
    hints[i]!.map(T),
    [...item.steps.map(T), T(hints[i]![1]!)],
    {
      accepted: [
        item.value,
        ...alternatives,
        ...codes,
        ...(item.accepted ?? []),
      ],
      rejected: item.wrong,
    },
    item.diagram,
  );
  r.answer = answer;
  r.misconceptionTags = [
    skills[i]!,
    'givens-not-appearance',
    'correspondence-before-conclusion',
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
    title: ['全等的含义', 'Meaning of congruence'],
    objective: [
      '按顺序对应顶点、边与角，并区分刚性重合和只相似的放大。',
      'Match vertices, sides and angles in order, distinguishing rigid congruence from enlargement.',
    ],
    prerequisites: ['J74-L01', 'J74-L05', 'J75-L02'],
    keywords: [
      ['全等', 'congruence'],
      ['对应', 'correspondence'],
      ['刚性移动', 'rigid motion'],
    ],
    lab: 'congruence-meaning',
    hook: [
      '同一三角形翻转后，顶点的左右位置变了，对应边真的换了吗？',
      'After reflecting a triangle, do changed left/right positions change corresponding sides?',
    ],
    items: [
      {
        ...I(
          [
            '已知 A↔D、B↔E、C↔F，按 △ABC 的顺序写右侧三角形字母。',
            'Given A↔D,B↔E,C↔F, enter the triangle letters matching the order ABC.',
          ],
          'DEF',
          [
            [
              '一一对应写 D、E、F，不按图中左右位置重排。',
              'Match in order as D,E,F rather than sorting by screen position.',
            ],
          ],
          ['DFE', 'EFD', 'FED'],
          'code',
        ),
        diagram: { kind: 'congruence-triangles', source: 'SSS' },
      },
      I(
        [
          '已知 △ABC≅△DFE，边 AB 对应哪条边？只写两个字母。',
          'Given △ABC≅△DFE, which side corresponds to AB? Enter two letters.',
        ],
        'DF',
        [
          [
            'A↔D、B↔F，所以 AB↔DF，边可反写 FD。',
            'A↔D,B↔F gives AB↔DF; a segment may also be named FD.',
          ],
        ],
        ['DE', 'EF', 'AB'],
        'code',
      ),
      I(
        [
          '已知 △ABC≅△DFE，顶点 C 对应哪个顶点？',
          'Given △ABC≅△DFE, which vertex corresponds to C?',
        ],
        'E',
        [
          [
            '第三位置 C 对应第三位置 E。',
            'The third position C matches the third position E.',
          ],
        ],
        ['D', 'F', 'C'],
        'code',
      ),
      I(
        [
          '已知 △ABC≅△DFE，AC=7 cm，求 DE 长。',
          'Given △ABC≅△DFE and AC=7 cm, find DE.',
        ],
        '7',
        [
          [
            'AC 对应 DE，全等对应边相等。',
            'AC corresponds to DE, so the congruent sides have equal length.',
          ],
        ],
        ['14', '3.5', '5'],
        'number',
        'cm',
      ),
      I(
        [
          '第二三角形由第一图按 1.5 倍放大，原边四变六，角不变。两实际三角形是否全等？',
          'The second triangle enlarges the first by 1.5, changing a side from four to six while retaining angles. Are the actual triangles congruent?',
        ],
        'not-congruent',
        [
          [
            '全等须同形同大小，四与六的边长不同，不全等。',
            'Congruence requires equal size as well as shape; sides four and six differ.',
          ],
        ],
        ['congruent', 'sufficient', 'insufficient'],
        'verdict',
      ),
      I(
        [
          '对应为 A↔E、B↔F、C↔D，按 ABC 顺序写另一三角形字母。',
          'With A↔E,B↔F,C↔D, write the other triangle in ABC order.',
        ],
        'EFD',
        [
          [
            '顺序逐个替换，得到 EFD；旋转不改这个身份对应。',
            'Replace each vertex in order to get EFD; rotation does not change these identities.',
          ],
        ],
        ['DEF', 'EDF', 'FDE'],
        'code',
      ),
    ],
    pick: {
      stem: [
        '哪种变化保证同一个三角形仍与原图全等？',
        'Which transformation preserves congruence of a triangle?',
      ],
      options: [
        ['旋转后平移，不缩放', 'Rotate then translate, without resizing'],
        ['把边长全部乘二', 'Double every side length'],
        ['只保留三个角', 'Retain only the three angles'],
      ],
      feedback: [
        [
          '刚性移动保持所有对应长度和角度。',
          'Rigid motions preserve corresponding lengths and angles.',
        ],
        ['大小改变，角相同也不够。', 'Size changes despite equal angles.'],
        [
          '三角只限定形状，不限定大小。',
          'Three angles determine shape without fixing size.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '解释 △ABC≅△DFE 的对应顺序，并说明反射为何可全等、放大为何通常不全等。',
      'Explain the correspondence in △ABC≅△DFE and why reflection preserves congruence while enlargement generally does not.',
    ],
    rubric: [
      '按顺序 A↔D、B↔F、C↔E，AB↔DF、BC↔FE、AC↔DE；相应角按同一顶点匹配。反射虽改变方向但保长度和角；非一倍缩放改变长度，只同形不保证同大小。不能按屏幕位置猜对应，也不能由一个相等边推出全等。家长核一个具体对应边角及大小理由。',
      'Match A↔D,B↔F,C↔E, hence AB↔DF,BC↔FE,AC↔DE and matching vertex angles. Reflection preserves distances and angles despite changing orientation. Non-unit scaling changes lengths, so shape alone is insufficient. Screen position and one equal side cannot prove congruence. Review concrete correspondence and size.',
    ],
    misconception: [
      '顶点顺序随意换、反射当不全等、同形当同大小。',
      'Reordering vertices, rejecting reflection or confusing equal shape with equal size.',
    ],
    prompts: [
      ['第二个字母对应谁？', 'Which vertex matches the second letter?'],
      ['对应长度也相同吗？', 'Are corresponding lengths equal too?'],
    ],
  },
  {
    title: ['SSS与SAS判定', 'SSS and SAS congruence'],
    objective: [
      '从对应三边或两边及夹角判全等，并用反例辨 SSA 条件不足。',
      'Apply SSS or included-angle SAS and use a counterexample to reject general SSA.',
    ],
    prerequisites: ['J86-L01', 'J74-L05', 'J74-L06'],
    keywords: [
      ['SSS', 'SSS'],
      ['夹角', 'included angle'],
      ['充分条件', 'sufficient condition'],
    ],
    lab: 'congruence-sides',
    hook: [
      '两边与它们之间的角，和两边与别处的角，是相同的约束吗？',
      'Do two sides with their included angle constrain the same thing as two sides with another angle?',
    ],
    items: [
      {
        ...I(
          [
            '两非退化三角形按 ABC↔DEF，对应 AB=DE、BC=EF、CA=FD。用哪个边条件判据？',
            'For nondegenerate triangles ABC↔DEF, AB=DE,BC=EF,CA=FD. Which side criterion applies?',
          ],
          'SSS',
          [
            [
              '三组对应边分别相等，用 SSS。',
              'Three corresponding side pairs are equal, giving SSS.',
            ],
          ],
          ['SAS', 'ASA', 'insufficient'],
          'rule',
        ),
        diagram: { kind: 'congruence-triangles', source: 'SSS' },
      },
      {
        ...I(
          [
            'AB=DE、AC=DF、∠A=∠D，其中该角在两给定边之间。用哪个判据？',
            'AB=DE,AC=DF and ∠A=∠D, with that angle between the two supplied sides. Which criterion?',
          ],
          'SAS',
          [
            [
              '两边 AB/AC 在 A 相交，给的就是夹角，用 SAS。',
              'AB and AC meet at A, so the given angle is included: SAS.',
            ],
          ],
          ['SSS', 'ASA', 'insufficient'],
          'rule',
        ),
        diagram: { kind: 'congruence-triangles', source: 'SAS' },
      },
      {
        ...I(
          [
            '仅给 AB=DE、BC=EF、∠A=∠D，无直角特殊条件。是否有一般全等判据？不足写 insufficient。',
            'Only AB=DE,BC=EF,∠A=∠D are given, without a right-angle special condition. Is there a general criterion? Enter insufficient if not.',
          ],
          'insufficient',
          [
            [
              '两边的夹角在 B/E，给的却是 A/D；SSA 不是一般判据。',
              'The included angle is B/E, not the given A/D; SSA is not a general criterion.',
            ],
            [
              'AB=6、BC=4、A=30° 可有两种 AC，构成反例。',
              'AB=6,BC=4,A=30° allows two AC values, providing a counterexample.',
            ],
          ],
          ['SAS', 'SSS', 'ASA'],
          'rule',
        ),
        diagram: { kind: 'congruence-triangles', source: 'SSA' },
      },
      I(
        [
          '已由 SSS 证 △ABC≅△DEF，BC=5 cm，求 EF。',
          'SSS has established △ABC≅△DEF. If BC=5 cm, find EF.',
        ],
        '5',
        [
          [
            '先已全等，再按 B↔E、C↔F 取对应边相等。',
            'After congruence, B↔E,C↔F gives equal corresponding sides.',
          ],
        ],
        ['10', '4', '3'],
        'number',
        'cm',
      ),
      I(
        [
          '仅给两组对应边相等，没有角或第三边，能否保证全等？用判据或 insufficient。',
          'Only two corresponding side pairs are equal, with no angle or third side. Give a criterion or insufficient.',
        ],
        'insufficient',
        [
          [
            '夹角还可以变化，缺少第三个足够约束。',
            'The included angle remains free, so a sufficient third constraint is missing.',
          ],
        ],
        ['SSS', 'SAS', 'ASA'],
        'rule',
      ),
      I(
        [
          'PQ=UV、PR=UW、∠QPR=∠VUW。顶点 P/U 是两给定边交点，用哪个判据？',
          'PQ=UV,PR=UW and ∠QPR=∠VUW. P/U joins each supplied side pair. Which criterion?',
        ],
        'SAS',
        [
          [
            '两个边和夹角的对应完整，字母改变不改 SAS 结构。',
            'Two sides and their included angle correspond; new letters do not change the SAS structure.',
          ],
        ],
        ['SSS', 'AAS', 'insufficient'],
        'rule',
      ),
    ],
    pick: {
      stem: [
        '为何不能把 SSA 当一般全等判据？',
        'Why is SSA not a general congruence criterion?',
      ],
      options: [
        ['任何三条条件都足够', 'Any three conditions suffice'],
        [
          '存在同两边同非夹角却大小不同的三角形',
          'The same two sides and non-included angle can allow different triangles',
        ],
        ['有负数边长时才失败', 'It fails only with negative side lengths'],
      ],
      feedback: [
        [
          '条件数目不代表独立且充分。',
          'The count of conditions does not guarantee sufficiency.',
        ],
        [
          '一个合法反例就否定“总能保证”；本课不附加直角特殊前提。',
          'One valid counterexample defeats a universal guarantee; no right-angle premise is added here.',
        ],
        [
          '反例可以所有边长正、三角形非退化。',
          'Counterexamples can have positive sides and nondegenerate triangles.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '说明 SSS 与 SAS 的对应要求，指出 AB、BC 的夹角在哪，并用 SSA 反例反驳“三条条件必够”。',
      'Explain SSS/SAS correspondence, locate the included angle of AB,BC, and use SSA to refute “three conditions always suffice”.',
    ],
    rubric: [
      'SSS 是三组对应边；SAS 的角在两给定边交点。AB/BC 的夹角为 B，A 为非夹角。AB六、BC四、A三十度可有两个 AC 长度，均为正且非退化，所以 SSA 不能一般保证全等。不能从图上测角或借待证边补足条件；先全等后才取对应结论。',
      'SSS requires three corresponding side pairs. SAS uses the angle at the given sides’ shared vertex; for AB/BC it is B rather than A. With AB=6,BC=4,A=30°, two positive nondegenerate AC choices exist, so general SSA fails. Do not measure or assume the desired side to fill a missing premise. Corresponding conclusions follow after congruence.',
    ],
    misconception: [
      '非夹角当夹角、三条件必充分、先取对应边再倒证全等。',
      'Using a non-included angle, counting any three conditions as sufficient or assuming corresponding equality before proving congruence.',
    ],
    prompts: [
      ['这两条边在哪个顶点相交？', 'At which vertex do the two sides meet?'],
      [
        '能构造同条件但不全等的另一个吗？',
        'Can another noncongruent triangle satisfy the same givens?',
      ],
    ],
  },
  {
    title: ['ASA与AAS判定', 'ASA and AAS congruence'],
    objective: [
      '用两个对应角与一条对应边判全等，区分夹边并说明第三角推导。',
      'Apply two corresponding angles and a side, identifying inclusion and justifying the third angle.',
    ],
    prerequisites: ['J86-L01', 'J86-L02', 'J74-L04'],
    keywords: [
      ['ASA', 'ASA'],
      ['AAS', 'AAS'],
      ['内角和', 'angle sum'],
    ],
    lab: 'congruence-angles',
    hook: [
      '角度能固定形状，哪一个长度条件才能把大小也固定？',
      'Angles fix shape; what length condition also fixes size?',
    ],
    items: [
      {
        ...I(
          [
            '∠A=∠D、∠B=∠E、AB=DE，边夹在已给两角间，直接用哪个判据？补角后换用另一有效判据也须说明。',
            '∠A=∠D,∠B=∠E,AB=DE; the side joins the given angles. Name the direct criterion, or justify a converted angle criterion.',
          ],
          'ASA',
          [
            [
              '两角与夹边直接为 ASA；用内角和补 C/F 后也可改用 AAS。',
              'Two angles and their included side directly give ASA; deriving C/F by the angle sum permits AAS.',
            ],
          ],
          ['SSS', 'SAS', 'insufficient'],
          'rule',
        ),
        diagram: { kind: 'congruence-triangles', source: 'ASA' },
      },
      {
        ...I(
          [
            '∠A=∠D、∠C=∠F、AB=DE，AB 不是两给定角的夹边。给有效角边判据并说明。',
            '∠A=∠D,∠C=∠F,AB=DE, with AB not joining the supplied angles. Give a valid angle-side criterion and explain.',
          ],
          'AAS',
          [
            [
              '直接 AAS；两角相等由内角和推 B/E 相等，也可转 ASA。',
              'Directly AAS; derive B/E equality by the angle sum to convert to ASA.',
            ],
          ],
          ['SSS', 'SAS', 'insufficient'],
          'rule',
        ),
        diagram: { kind: 'congruence-triangles', source: 'AAS' },
      },
      {
        ...I(
          [
            '只给三个对应角相等，没有对应长度，能保证全等吗？用判据或 insufficient。',
            'Only three corresponding angles are equal, with no matching length. Give a criterion or insufficient.',
          ],
          'insufficient',
          [
            [
              'AAA 允许按比例放大，形状相同但大小不固定。',
              'AAA permits enlargement: equal shape without fixed size.',
            ],
          ],
          ['ASA', 'AAS', 'SSS'],
          'rule',
        ),
        diagram: { kind: 'congruence-triangles', source: 'AAA' },
      },
      I(
        [
          '非退化三角形两角 50°、60°，第三角多少？',
          'Two angles of a nondegenerate triangle are 50°,60°. Find the third.',
        ],
        '70',
        [
          [
            '180−50−60=70，内角和可提供第三角的等量依据。',
            '180-50-60=70; the angle sum supplies a justified third-angle equality.',
          ],
        ],
        ['110', '130', '60'],
        'number',
        '°',
      ),
      I(
        [
          '两角为 30°、110°，第三角多少？',
          'Two angles are 30°,110°. Find the third.',
        ],
        '40',
        [
          [
            '180−30−110=40，不把第三角当额外独立已知。',
            '180-30-110=40; the third angle is derived rather than an independent extra premise.',
          ],
        ],
        ['140', '70', '30'],
        'number',
        '°',
      ),
      I(
        [
          '两非退化三角形 ∠P=∠U、∠R=∠W、PQ=UV，PQ 非夹边。给有效判据。',
          'For nondegenerate triangles ∠P=∠U,∠R=∠W,PQ=UV, with PQ non-included. Give a valid criterion.',
        ],
        'AAS',
        [
          [
            '两角与非夹边为 AAS；若补 Q/V 后用 ASA，写清内角和依据。',
            'Two angles and a non-included side give AAS; explain the angle sum if deriving Q/V and using ASA.',
          ],
        ],
        ['SSS', 'SAS', 'insufficient'],
        'rule',
      ),
    ],
    pick: {
      stem: [
        '只知道三个角相等，为什么还不能保证全等？',
        'Why do three matching angles fail to guarantee congruence?',
      ],
      options: [
        [
          '可以按比例放大，保角却改长度',
          'Enlargement preserves angles while changing lengths',
        ],
        ['三角形可以只有两个角', 'A triangle may have only two angles'],
        ['角永远不能用于全等判定', 'Angles never contribute to congruence'],
      ],
      feedback: [
        [
          '必须再有对应长度限制大小。',
          'A corresponding length is needed to fix size.',
        ],
        [
          '非退化三角形有三个内角，且和为 180°。',
          'A nondegenerate triangle has three interior angles summing to 180°.',
        ],
        [
          'ASA/AAS 正是角与边共同提供充分条件。',
          'ASA/AAS combine angle and side constraints.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '解释 ASA 与 AAS 如何利用内角和互换，为什么 AAA 仍不能保证大小。',
      'Explain conversion between ASA and AAS using the angle sum, and why AAA still fails to fix size.',
    ],
    rubric: [
      '两个对应角相等时第三角分别由一百八十减去前两角，故也相等。一条对应边夹在所列两角间直接叫 ASA，否则 AAS；补第三角后可选择另一有效角对改名，需说明推导而不扣掉有效策略。只有 AAA 无边长尺度，放大仍保角，不能全等。家长核边端点与角身份及非退化条件。',
      'Two equal corresponding angles yield an equal third by subtracting from 180. A side joining the listed angles gives direct ASA, otherwise AAS; a justified third angle permits conversion with another angle pair. AAA lacks a length scale and survives enlargement, so does not guarantee congruence. Review side endpoints, angle identities and nondegeneracy.',
    ],
    misconception: [
      '夹边按图位置猜、补第三角后换判据被误当错误、AAA 当全等。',
      'Guessing included sides by appearance, rejecting justified criterion conversion or treating AAA as congruence.',
    ],
    prompts: [
      ['这条边连接哪两个顶点？', 'Which two vertices are joined by this side?'],
      ['第三角是给定还是推出来的？', 'Was the third angle given or derived?'],
    ],
  },
  {
    title: ['等腰三角形性质', 'Properties of isosceles triangles'],
    objective: [
      '由等边推等底角并计算，区分逆命题与辅助线的新条件。',
      'Use equal sides to derive equal base angles and calculate, distinguishing the converse and auxiliary conditions.',
    ],
    prerequisites: ['J86-L02', 'J86-L03', 'J74-L04'],
    keywords: [
      ['等边对等角', 'equal sides face equal angles'],
      ['逆命题', 'converse'],
      ['辅助线', 'auxiliary line'],
    ],
    lab: 'congruence-isosceles',
    hook: [
      '顶角五十度后剩下一百三十度，为何不能把每个底角都写一百三十？',
      'After a fifty-degree apex, why is the remaining 130 not the value of each base angle?',
    ],
    items: [
      {
        ...I(
          [
            'AB=AC 的 △ABC，顶角 A=50°，求每个底角。',
            'In ABC, AB=AC and apex A=50°. Find each base angle.',
          ],
          '65',
          [
            [
              '等边对等角，B=C；两底角和 130°，各除二得 65°。',
              'Equal sides face equal angles, so B=C. The remaining 130° splits into 65° each.',
            ],
          ],
          ['130', '50', '25'],
          'number',
          '°',
        ),
        diagram: { kind: 'congruence-isosceles', apex: 50 },
      },
      I(
        [
          '等腰三角形两底角各 70°，顶角多少？',
          'An isosceles triangle has two base angles of 70°. Find the apex.',
        ],
        '40',
        [
          [
            '180−70−70=40，不能再把剩余分半。',
            '180-70-70=40; do not halve the remaining single apex.',
          ],
        ],
        ['20', '70', '110'],
        'number',
        '°',
      ),
      I(
        [
          '非退化 △ABC 已知 AB=AC、AB=9 cm，求 AC。',
          'A nondegenerate ABC has AB=AC and AB=9 cm. Find AC.',
        ],
        '9',
        [
          [
            '使用已知两腰相等，AC 为九厘米，不涉及底边长度。',
            'Use the given equal legs: AC is nine centimetres, without assigning the base a length.',
          ],
        ],
        ['18', '4.5', '0'],
        'number',
        'cm',
      ),
      I(
        [
          '△ABC 中 ∠B=∠C，边 AB 应与哪条边相等？',
          'In ABC, ∠B=∠C. Which side equals AB?',
        ],
        'AC',
        [
          [
            'AB 对着角 C，AC 对着角 B；等角对等边。',
            'AB faces C and AC faces B, so equal angles give equal opposite sides.',
          ],
        ],
        ['BC', 'AB', 'BA'],
        'code',
      ),
      M(
        [
          '说明如何由 ∠B=∠C 推 AB=AC，可作顶角平分线 AD。不要先假设腰相等。',
          'Explain ∠B=∠C ⇒ AB=AC using apex bisector AD, without assuming equal legs first.',
        ],
        [
          '作 A 的内角平分线 AD，D 在 BC 上；两小三角形角 BAD=CAD、角 B=C，AD 公共，按 AAS（补角后 ASA 也可）全等，再取 AB=AC。不能用待证腰相等当 SAS 的一边。家长核构造、两个角身份、公共边与全等后对应。',
          'Construct the internal bisector AD with D on BC. The small triangles have equal apex halves and given equal B/C angles, plus common AD. AAS, or ASA after a third-angle deduction, gives congruence and then AB=AC. Do not assume equal legs to invoke SAS. Review construction, angle identities, common side and correspondence.',
        ],
      ),
      {
        ...I(
          [
            '等腰三角形顶角 100°，每个底角多少？',
            'An isosceles triangle has apex 100°. Find each base angle.',
          ],
          '40',
          [
            [
              '两底角相等，各为 (180−100)/2=40°。',
              'The equal base angles are (180-100)/2=40° each.',
            ],
          ],
          ['80', '100', '50'],
          'number',
          '°',
        ),
        diagram: { kind: 'congruence-isosceles', apex: 100 },
      },
    ],
    pick: {
      stem: [
        '已知 AB=AC，作 AD 平分顶角。用 SAS 前的公共边依据是？',
        'Given AB=AC and apex bisector AD, what common-side fact supports SAS?',
      ],
      options: [
        ['BD=DC，因为我正要证明它', 'BD=DC because it is the target'],
        ['AD=AD，同一条线段', 'AD=AD, the same segment'],
        ['B=C，因为图看着对称', 'B=C because the picture looks symmetric'],
      ],
      feedback: [
        [
          '待证结论不能提前作已知。',
          'The target cannot be assumed as a premise.',
        ],
        [
          '自反性提供两小三角形的同一条边。',
          'Reflexivity supplies the shared side in the two triangles.',
        ],
        [
          '外观不是证明，底角相等需推导。',
          'Appearance is not a proof; base-angle equality must be derived.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '用 AB=AC 与顶角平分线说明底角相等，再解释角相等推边相等是另一个方向。',
      'Use AB=AC and an apex bisector to justify equal base angles, then distinguish the equal-angle converse.',
    ],
    rubric: [
      '构造 AD 平分 A，AB=AC 已知、两顶角半角相等、AD=AD，SAS 得 ABD≅ACD，再得底角 B=C。反向若已知 B=C，不能把 AB=AC 先当已知，应与顶角平分及公共 AD 用 AAS/ASA，再取对应腰相等。计算底角用内角和分二；解释不只靠对称外观。',
      'Construct AD bisecting A. Given AB=AC, equal apex halves and common AD yield SAS for ABD≅ACD, then B=C. Conversely, if B=C is given, do not assume AB=AC; use the bisector and common AD with AAS/ASA, then corresponding legs. Base-angle calculation divides the remaining angle sum by two. Appearance alone is insufficient.',
    ],
    misconception: [
      '一百八十减顶角后不分二、顶角底角混用、逆命题循环证明。',
      'Not halving the remaining sum, mixing apex/base roles or using circular reasoning for the converse.',
    ],
    prompts: [
      [
        '哪两条边是腰，底角对着谁？',
        'Which sides are the legs, and which angles face them?',
      ],
      ['这一步用了待证结论吗？', 'Did this step assume the target?'],
    ],
  },
  {
    title: ['平行四边形的性质与判定', 'Parallelogram properties and tests'],
    objective: [
      '从定义区分平行四边形性质与充分判定，检查同一对边及完整条件。',
      'Separate parallelogram properties from sufficient converse tests, checking the same pair and complete premises.',
    ],
    prerequisites: ['J86-L02', 'J86-L03', 'J74-L03'],
    keywords: [
      ['两组对边', 'two opposite pairs'],
      ['互相平分', 'mutual bisection'],
      ['性质与判定', 'properties and tests'],
    ],
    lab: 'congruence-parallelogram',
    hook: [
      'AB 平行 CD，同时 AD 等于 BC，就必是平行四边形吗？',
      'Does AB parallel CD together with AD=BC force a parallelogram?',
    ],
    items: [
      {
        ...I(
          [
            '平行四边形 ABCD 按周界顺序命名，∠A=70°，求相邻 ∠D。',
            'Parallelogram ABCD is named around its boundary. If ∠A=70°, find adjacent ∠D.',
          ],
          '110',
          [
            [
              '相邻内角互补，D=180−70=110°；对角 C 才等于 A。',
              'Adjacent interior angles are supplementary: D=180-70=110°. Opposite C equals A.',
            ],
          ],
          ['70', '35', '140'],
          'number',
          '°',
        ),
        diagram: {
          kind: 'congruence-quadrilateral',
          shear: 3 / Math.tan((70 * Math.PI) / 180),
          height: 3,
        },
      },
      I(
        [
          '平行四边形对角线内部交于 O，AO=3 cm，求 AC。',
          'Parallelogram diagonals meet internally at O. AO=3 cm; find AC.',
        ],
        '6',
        [
          [
            '对角线互相平分，OC=AO=3，整条 AC=6 cm。',
            'Mutual bisection gives OC=AO=3, so the whole AC is six centimetres.',
          ],
        ],
        ['3', '1.5', '9'],
        'number',
        'cm',
      ),
      I(
        [
          '简单四边形按 ABCD 顺序，已知 AB∥CD 且 AB=CD，能否保证平行四边形？写 sufficient/insufficient。',
          'For a simple quadrilateral ABCD, AB∥CD and AB=CD. Do these guarantee a parallelogram? Enter sufficient/insufficient.',
        ],
        'sufficient',
        [
          [
            '同一组对边同时平行且相等是充分条件，可连 AC 用 SAS。',
            'The same opposite pair parallel and equal is sufficient, proved using AC and SAS.',
          ],
        ],
        ['insufficient', 'congruent', 'not-congruent'],
        'verdict',
      ),
      I(
        [
          '仅给 AB∥CD 且 AD=BC（不是同一对），能否保证平行四边形？',
          'Given only AB∥CD and AD=BC, involving different opposite pairs, is a parallelogram guaranteed?',
        ],
        'insufficient',
        [
          [
            '等腰梯形能满足这两条件，却另一组不平行，是反例。',
            'An isosceles trapezoid satisfies these while its other pair is not parallel, a counterexample.',
          ],
        ],
        ['sufficient', 'congruent'],
        'verdict',
      ),
      M(
        [
          '说明“简单四边形两组对边分别相等”为什么足以判平行四边形，不直接借待证平行。',
          'Explain why both opposite side pairs equal guarantee a parallelogram in a simple quadrilateral, without assuming the target parallelism.',
        ],
        [
          '连 AC，AB=CD、BC=DA、AC=CA，SSS 得 ABC≅CDA；对应内错角相等，再由角相等的平行判定得 AB∥CD、BC∥AD。原四边形须简单且按周界命名，不能将交叉顺序图套入。家长核三边对应与从角到平行的方向。',
          'Draw AC. AB=CD,BC=DA and AC=CA give ABC≅CDA by SSS. Equal corresponding alternate angles then establish AB∥CD and BC∥AD. The quadrilateral must be simple and named around its boundary. Check side correspondence and the converse direction from angles to parallelism.',
        ],
      ),
      I(
        [
          '平行四边形 ABCD 中 AB=5 cm，求 CD。',
          'In parallelogram ABCD, AB=5 cm. Find CD.',
        ],
        '5',
        [
          [
            '已知平行四边形才能使用对边相等，CD=AB=5。',
            'Because the parallelogram is given, equal opposite sides give CD=5.',
          ],
        ],
        ['10', '2.5', '4'],
        'number',
        'cm',
      ),
    ],
    pick: {
      stem: [
        '“一组对边平行且相等”的条件，哪项完整？',
        'Which completes the “one opposite pair parallel and equal” test?',
      ],
      options: [
        ['AB∥CD 且 AD=BC', 'AB∥CD and AD=BC'],
        ['只有 AB∥CD', 'Only AB∥CD'],
        ['AB∥CD 且 AB=CD，是同一组', 'AB∥CD and AB=CD, the same pair'],
      ],
      feedback: [
        [
          '不同组可出现等腰梯形反例。',
          'Different pairs allow an isosceles trapezoid counterexample.',
        ],
        ['一组平行还不够。', 'One parallel pair alone is insufficient.'],
        [
          '两个性质落在同一组对边上，才是该充分判定。',
          'Both properties concern the same opposite pair, as required.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '比较平行四边形性质与判定；说明两组对边、同一组平行且相等、对角线互相平分的完整性，并给不足反例。',
      'Compare properties with converse tests, checking complete opposite-pair and diagonal-bisection conditions and giving an insufficient-case counterexample.',
    ],
    rubric: [
      '定义是简单四边形两组对边分别平行；可推出对边相等、对角相等、邻角互补、对角线互相平分。逆向判定可用两组对边相等、同一组对边平行且相等、两对角线互相平分（内部交点两条都平分）。只给一组平行或一组相等不够；AB∥CD 且 AD=BC 可为等腰梯形。证明性质时不能把该性质本身作理由，须走平行角、公共边、全等与对应结论。',
      'The definition is two parallel opposite pairs in a simple quadrilateral. Properties include equal opposite sides/angles, supplementary neighbours and mutually bisecting diagonals. Converse tests include both opposite pairs equal, the same pair parallel and equal, or both diagonals bisecting each other internally. One parallel/equal pair alone is insufficient; AB∥CD with AD=BC permits an isosceles trapezoid. Prove properties through parallel angles, a common side and congruence rather than invoking the target property itself.',
    ],
    misconception: [
      '性质倒用缺前提、不同组当同组、只平分一条当互相平分。',
      'Reversing a property without premises, mixing opposite pairs or replacing mutual bisection with only one bisected diagonal.',
    ],
    prompts: [
      [
        '平行和相等说的是同一组吗？',
        'Do parallelism and equality concern the same pair?',
      ],
      [
        '这是已知图形的性质，还是正在判定图形？',
        'Is the shape already given, or is it the target to establish?',
      ],
    ],
  },
  {
    title: ['组织两三步几何证明', 'Structuring short geometric proofs'],
    objective: [
      '按依赖顺序组织条件、全等与对应结论，识别缺条件和循环论证。',
      'Order premises, congruence and corresponding conclusions, identifying missing facts and circular reasoning.',
    ],
    prerequisites: ['J86-L04', 'J86-L05', 'J74-L06'],
    keywords: [
      ['已知与待证', 'givens and target'],
      ['理由链', 'reason chain'],
      ['循环论证', 'circular reasoning'],
    ],
    lab: 'congruence-proof',
    hook: [
      '要证 AB=CD，直接说“因为平行四边形对边相等”一定能算本题证明吗？',
      'When proving AB=CD from the definition, can citing that very opposite-side property count as the proof?',
    ],
    items: [
      M(
        [
          '仅从 AB∥CD、BC∥AD 出发，连 AC，证明 AB=CD；不要直接引用正在证明的对边相等性质。',
          'Starting only from AB∥CD,BC∥AD, draw AC and prove AB=CD without citing the property being established.',
        ],
        [
          '由 AB∥CD 得 BAC=DCA，由 BC∥AD 得 BCA=DAC；AC=CA 公共边，ASA 得 ABC≅CDA，再取 AB=CD。可补第三角改用 AAS但须写依据。每个角关系须先有对应平行前提。',
          'AB∥CD gives BAC=DCA and BC∥AD gives BCA=DAC. With common AC=CA, ASA yields ABC≅CDA and then AB=CD. AAS after a justified third-angle deduction also works. Establish parallel premises before angle facts.',
        ],
      ),
      M(
        [
          'AB=AC，AD 是顶角内角平分线且 D 在 BC 上。组织证明 BD=DC。',
          'Given AB=AC and internal apex bisector AD meeting BC, organise a proof of BD=DC.',
        ],
        [
          'AB=AC 已知，BAD=CAD 为构造，AD=AD 公共，SAS 得 ABD≅ACD，再对应 BD=DC。不能先以 BD=DC 用 SSS 倒证。',
          'Use given AB=AC, constructed BAD=CAD and common AD=AD for SAS: ABD≅ACD. Then BD=DC follows. Do not assume BD=DC first to invoke SSS.',
        ],
      ),
      M(
        [
          '有人量屏幕得到两角约相等，直接写 SAS。指出缺失并给可接受的证据类型。',
          'Someone measures two screen angles as approximately equal and writes SAS. Identify what is missing and what evidence is acceptable.',
        ],
        [
          '像素测量仅近似，不能证明精确角等；SAS 还需两组对应边及夹角身份。可用明确已知角相等、角平分线构造，或已有平行推出内错角相等，并核两边对应。若没有这些，承认条件不足，而不从外观补条件。',
          'Pixel measurements are approximate, not proof of exact angle equality. SAS also needs corresponding side pairs and an included angle. Use stated equality, a bisector construction or justified parallel-angle facts; otherwise report insufficient premises rather than adding facts from appearance.',
        ],
      ),
      I(
        [
          '用 AC 证明平行四边形性质时，若 A↔C、B↔D、C↔A，△ABC 对应哪一有序三角形？',
          'In a diagonal AC proof, A↔C,B↔D,C↔A. Which ordered triangle corresponds to ABC?',
        ],
        'CDA',
        [
          [
            '按三个位置依次写 C、D、A。',
            'Write C,D,A in the supplied correspondence order.',
          ],
        ],
        ['CAD', 'DCA', 'ACD'],
        'code',
      ),
      I(
        [
          '已建立 BAC=DCA、BCA=DAC，且 AC=CA，为两已给角的夹边，给有效全等判据。',
          'Established BAC=DCA,BCA=DAC and AC=CA give the side included between the two angles. Name a valid criterion.',
        ],
        'ASA',
        [
          [
            '直接 ASA；内角和补第三角后也能 AAS。',
            'Direct ASA, or AAS after deriving the third angle by the sum.',
          ],
        ],
        ['SSS', 'SAS', 'insufficient'],
        'rule',
      ),
      M(
        [
          '给定两三角形 A↔D、B↔E、C↔F，A=D、C=F、AB=DE，证明 BC=EF。写先后顺序与理由。',
          'Given A↔D,B↔E,C↔F, A=D,C=F and AB=DE, prove BC=EF with ordered reasons.',
        ],
        [
          '两个对应角与非夹边 AB/DE 先给 AAS 全等；或由内角和补 B/E 后用 ASA。按 ABC↔DEF 匹配后才能得 BC=EF。不能把目标 BC=EF 提前加入边条件，也不能只给“因为全等”而不说明全等依据。',
          'Two corresponding angles and non-included AB/DE first give AAS congruence, or ASA after deriving B/E. With ABC↔DEF established, corresponding BC=EF follows. Do not assume the target side as a premise, and state why congruence holds.',
        ],
      ),
    ],
    pick: {
      stem: [
        '要用“全等三角形对应边相等”，首先应有什么？',
        'What must precede “corresponding sides of congruent triangles are equal”?',
      ],
      options: [
        ['图看起来对称', 'The drawing looks symmetric'],
        [
          '已有充分条件证全等并写清对应',
          'Congruence established from sufficient facts, with correspondence',
        ],
        ['先假设目标边相等', 'Assume the target side equality'],
      ],
      feedback: [
        [
          '外观不提供精确等量前提。',
          'Appearance supplies no exact equality premise.',
        ],
        [
          '先有全等及对应，后有对应结论。',
          'Congruence and correspondence precede the corresponding conclusion.',
        ],
        ['这会循环使用待证结论。', 'That uses the target circularly.'],
      ],
      correct: 1,
    },
    reason: [
      '用一个平行四边形或等腰三角形案例，逐项说明原始已知、辅助构造、全等判据和对应结论，指出一个循环论证。',
      'Use a parallelogram or isosceles example to distinguish givens, construction, criterion and corresponding conclusion, identifying one circular step.',
    ],
    rubric: [
      '可用两组平行→两组内错角相等，加 AC公共→ASA得ABC≅CDA→AB=CD；或AB=AC与AD角平分、AD公共→SAS得ABD≅ACD→BD=DC。先写所有依赖，再加入结论；公共边自反不需测量，角关系要有平行或构造依据。若先假设AB=CD或BD=DC来证明同一目标，即循环。家长核对应顺序与每一条具体依据，卡片检查不代表自动理解自由证明。',
      'Use two parallel pairs to obtain alternate-angle pairs plus common AC, then ASA for ABC≅CDA and AB=CD; or equal legs, an apex bisector and common AD for SAS and BD=DC. Establish dependencies before conclusions. Reflexivity needs no measurement; angle equality needs its premise. Assuming AB=CD or BD=DC to prove itself is circular. Review concrete correspondence and reasons; finite-card checking does not understand arbitrary written proofs.',
    ],
    misconception: [
      '先结论后理由、漏公共边、角没有平行前提、待证当已知。',
      'Using conclusions before premises, missing common sides, unsupported angle equalities or assuming the target.',
    ],
    prompts: [
      [
        '这一句具体依赖上面哪几句？',
        'Which earlier facts does this statement need?',
      ],
      [
        '去掉最后一步，目标还已被证明吗？',
        'If the final step is removed, is the target still established?',
      ],
    ],
  },
];
export const j86Lessons: Lesson[] = specs.map((s, i) => {
  const id = `J86-L0${i + 1}`;
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
    unit: 'J86',
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
    ...(i === 5
      ? {
          familyChallenge: t(
            '纸上画虚构社区花坛的两个三角形与一个简单四边形。用字母、刻痕和角标明确已知；先写对应顺序，再给一条两三步证明。另画 AAA 放大反例、SSA 双形或一组平行的梯形反例，说明为什么条件不足。把一条循环论证改为有依据的推理链。图只作说明，测像素不当证明；无需外出测量、购买或个人信息。',
            'On paper, design fictional community-garden triangles and a simple quadrilateral. Mark actual givens, write correspondence and a short justified proof. Add an AAA enlargement, SSA alternative or one-parallel-pair trapezoid counterexample. Repair a circular argument into a dependency chain. Drawings illustrate rather than prove by pixel measurements; no purchases, field measurements or personal data are needed.',
          ),
        }
      : {}),
  };
});
export function j86ReviewQuestion(id: string, round: number): Question {
  if (
    !/^J86-L0[1-6]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid J86 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 80;
  let item: Item;
  if (i === 0) {
    const code = ['DEF', 'DFE', 'EFD', 'EDF', 'FDE', 'FED'][k % 6]!;
    item = I(
      [
        `已知 △ABC≅△${code}，AB 对应哪条边？`,
        `Given △ABC≅△${code}, which side corresponds to AB?`,
      ],
      code.slice(0, 2),
      [
        [
          '按前两个顶点匹配，边端点可反写。',
          'Match the first two vertices; a side may reverse endpoints.',
        ],
      ],
      ['AB'],
      'code',
    );
  } else if (i === 1) {
    const mode = k % 4,
      rule = mode === 0 ? 'SSS' : mode === 1 ? 'SAS' : 'insufficient',
      text =
        mode === 0
          ? 'AB=DE, BC=EF, CA=FD'
          : mode === 1
            ? 'AB=DE, AC=DF, ∠A=∠D'
            : mode === 2
              ? 'AB=DE, BC=EF, ∠A=∠D'
              : 'AB=DE, AC=DF';
    item = I(
      [
        `仅给对应 ${text}，无直角特殊条件。用全等判据或 insufficient。`,
        `Only ${text} are supplied with fixed correspondence and no right-angle exception. Enter a criterion or insufficient.`,
      ],
      rule,
      [
        [
          '核三边或夹角结构，不把非夹角 SSA 当通用判据。',
          'Check three sides or the included-angle structure; do not use general SSA.',
        ],
      ],
      [rule === 'SSS' ? 'SAS' : rule === 'SAS' ? 'SSS' : 'SAS'],
      'rule',
    );
  } else if (i === 2) {
    const mode = k % 3,
      rule = mode === 0 ? 'ASA' : mode === 1 ? 'AAS' : 'insufficient',
      text =
        mode === 0
          ? '∠A=∠D, ∠B=∠E, AB=DE'
          : mode === 1
            ? '∠A=∠D, ∠C=∠F, AB=DE'
            : '∠A=∠D, ∠B=∠E, ∠C=∠F';
    item = I(
      [
        `非退化三角形只给 ${text}，给有效判据或 insufficient。`,
        `For nondegenerate triangles, only ${text} are given. Enter a valid criterion or insufficient.`,
      ],
      rule,
      [
        [
          '两角一边限制大小，第三角可由内角和补；AAA 无边长仍不足。',
          'Two angles and a side fix size; the third angle may be derived. AAA alone lacks a length scale.',
        ],
      ],
      [rule === 'insufficient' ? 'ASA' : 'insufficient'],
      'rule',
    );
  } else if (i === 3) {
    const a = 20 + 2 * (k % 60);
    item = I(
      [
        `等腰三角形顶角 ${a}°，每个底角多少？`,
        `An isosceles triangle has apex ${a}°. Find each base angle.`,
      ],
      String((180 - a) / 2),
      [
        [
          '先剩余两底角的和，再平均分二。',
          'Find the remaining sum of the two equal base angles, then halve.',
        ],
      ],
      [String(180 - a)],
      'number',
      '°',
    );
  } else if (i === 4) {
    const a = (k % 7) + 1;
    item =
      k % 2 === 0
        ? I(
            [
              `已知平行四边形两对角线内部交于 O，AO=${a} cm，求 AC。`,
              `Given a parallelogram whose diagonals meet internally at O, AO=${a} cm. Find AC.`,
            ],
            String(2 * a),
            [
              [
                '互相平分给 OC=AO，整条长为两倍。',
                'Mutual bisection gives OC=AO, so the whole is twice as long.',
              ],
            ],
            [String(a)],
            'number',
            'cm',
          )
        : I(
            [
              '简单四边形仅 AB∥CD、AD=BC，是否足以保证平行四边形？',
              'For a simple quadrilateral, do only AB∥CD and AD=BC guarantee a parallelogram?',
            ],
            'insufficient',
            [
              [
                '不同对边的混合条件有等腰梯形反例。',
                'Mixed conditions on different pairs allow an isosceles trapezoid counterexample.',
              ],
            ],
            ['sufficient'],
            'verdict',
          );
  } else
    item =
      k % 2 === 0
        ? M(
            [
              '从 AB∥CD、BC∥AD 出发，用公共 AC 证明 AB=CD，标明全等对应。',
              'From AB∥CD,BC∥AD, use common AC to prove AB=CD with explicit correspondence.',
            ],
            specs[5]!.items[0]!.steps[0]!,
          )
        : M(
            [
              'AB=AC，AD 是顶角平分线，D 在 BC 上。证明 BD=DC，不预先使用它。',
              'Given AB=AC and apex bisector AD meeting BC, prove BD=DC without assuming it.',
            ],
            specs[5]!.items[1]!.steps[0]!,
          );
  return q(`${id}-R${round}`, i, item);
}
export const j86CheckQuestions: Question[] = [
  q(
    'J86-CHECK-Q1',
    0,
    I(
      [
        '对应 A↔D、B↔F、C↔E，按 ABC 写另一三角形。',
        'Given A↔D,B↔F,C↔E, write the other triangle in ABC order.',
      ],
      'DFE',
      [
        [
          '三位置依次匹配，不任意交换。',
          'Match all three positions without arbitrary swaps.',
        ],
      ],
      ['DEF', 'EFD'],
      'code',
    ),
  ),
  q(
    'J86-CHECK-Q2',
    1,
    I(
      [
        'AB=DE、AC=DF、A=D，给全等判据。',
        'AB=DE,AC=DF,A=D. Give the congruence criterion.',
      ],
      'SAS',
      [
        [
          'A/D 是给定两边的夹角。',
          'A/D is the included angle of the supplied sides.',
        ],
      ],
      ['SSS', 'ASA', 'insufficient'],
      'rule',
    ),
  ),
  q(
    'J86-CHECK-Q3',
    2,
    I(
      [
        'A=D、C=F、AB=DE，给有效角边判据并说明。',
        'A=D,C=F,AB=DE. Give a valid angle-side criterion and explain.',
      ],
      'AAS',
      [
        [
          '直接 AAS；内角和补第三角也可 ASA。',
          'Direct AAS, or ASA after the third-angle deduction.',
        ],
      ],
      ['SSS', 'SAS', 'insufficient'],
      'rule',
    ),
  ),
  q(
    'J86-CHECK-Q4',
    3,
    I(
      [
        '等腰三角形顶角 80°，每个底角多少？',
        'An isosceles triangle has apex 80°. Find each base angle.',
      ],
      '50',
      [['(180−80)/2=50。', '(180-80)/2=50.']],
      ['100', '80', '40'],
      'number',
      '°',
    ),
  ),
  q(
    'J86-CHECK-Q5',
    4,
    I(
      [
        '只有 AB∥CD 且 AD=BC 的简单四边形，是否保证平行四边形？',
        'Does a simple quadrilateral with only AB∥CD and AD=BC have to be a parallelogram?',
      ],
      'insufficient',
      [
        [
          '等腰梯形满足这些条件却不保证另一组平行。',
          'An isosceles trapezoid satisfies these without another parallel pair.',
        ],
      ],
      ['sufficient'],
      'verdict',
    ),
  ),
  q(
    'J86-CHECK-Q6',
    5,
    M(
      [
        'AB=AC，AD 内角平分且 D 在 BC 上。写一条非循环证明 BD=DC 的链。',
        'With AB=AC and internal apex bisector AD meeting BC, give a non-circular chain proving BD=DC.',
      ],
      specs[5]!.items[1]!.steps[0]!,
    ),
  ),
  pick('J86-CHECK-Q7', 1, specs[1]!.pick),
  reasoning(
    'J86-CHECK-Q8',
    t(
      '审查一个全等证明：说明对应、充分条件、辅助构造与目标的先后，并给出 AAA/SSA 或四边形不足反例。',
      'Audit a congruence proof for correspondence, sufficient conditions, constructions and target order, giving an AAA/SSA or quadrilateral counterexample.',
    ),
    skills[5]!,
    T(specs[5]!.rubric),
    hints[5]!.map(T),
  ),
];
