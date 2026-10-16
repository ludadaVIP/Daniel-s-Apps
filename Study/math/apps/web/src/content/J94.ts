import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import { rational, textR } from '../algebraModels';
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
  'similarity-correspondence',
  'similarity-evidence',
  'similarity-side-proportion',
  'similarity-area-square',
  'similarity-model-premises',
];
const hints: Pair[][] = [
  [
    [
      '先按字母次序匹配顶点和整边。',
      'Match vertices and whole sides by letter order.',
    ],
    [
      '统一第二个/第一个；横纵同倍率，旋转反射不重命名。',
      'Keep second/first throughout; both directions share a factor and transformations do not rename vertices.',
    ],
  ],
  [
    [
      '只列已给及有依据推导的角和边比。',
      'List only supplied or justified angle equalities and side ratios.',
    ],
    [
      'AA两角、SAS夹角、SSS三个同向边比；一般SSA不足。',
      'AA needs two angles, SAS the included angle, and SSS three common directed ratios; general SSA is insufficient.',
    ],
  ],
  [
    [
      '先有相似依据，再匹配对应整边。',
      'Establish similarity, then match corresponding whole sides.',
    ],
    [
      '正向乘倍率，反向除；嵌套用小整边/大整边。',
      'Multiply forward, divide backward; use small whole side / large whole side in nested triangles.',
    ],
  ],
  [
    [
      '题目已保证相似了吗？长度与面积分别是哪种量？',
      'Is similarity established? Which quantities are lengths or areas?',
    ],
    [
      '长度乘k、面积乘k²；反求取正平方根，单位用平方单位。',
      'Lengths scale by k, areas by k²; invert with the positive square root and retain square units for areas.',
    ],
  ],
  [
    [
      '先分清原印图、显示和现实，并统一单位。',
      'Distinguish the original print, display and real world, then unify units.',
    ],
    [
      '地图同步比例尺；照片区分裁切拉伸；影长先核AA的平行光等前提。',
      'Zoom maps with their bars; distinguish cropping from stretching; check parallel-light and other AA premises before shadow calculations.',
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
    title: ['相似的意义与比例', 'Meaning of similarity and scaling'],
    lab: 'similarity-meaning',
    objective: [
      '识别相似对应，统一第二个/第一个的倍率方向，并区分等比缩放与单向拉伸。',
      'Identify corresponding elements, keep a second/first scale direction and distinguish uniform resizing from a directional stretch.',
    ],
    prerequisites: ['J86-L01', 'P63-L01'],
    keywords: [
      ['对应', 'correspondence'],
      ['相似比', 'scale factor'],
      ['等比缩放', 'uniform resizing'],
    ],
    hook: [
      '把三角形转过来、翻过来，再放大，哪些关系还在？',
      'Turn, reflect and enlarge a triangle: which relationships survive?',
    ],
    items: [
      {
        stem: [
          '已知△ABC∼△FDE，BC对应哪条边？只写边名。',
          'Given △ABC∼△FDE, which side corresponds to BC? Enter its letters.',
        ],
        answer: {
          kind: 'geometry-code',
          value: 'DE',
          reversible: true,
        },
        steps: [
          [
            'B↔D、C↔E，所以BC↔DE，不按左右位置认边。',
            'B↔D and C↔E, so BC corresponds to DE regardless of screen position.',
          ],
        ],
        wrong: ['FD', 'FE', 'BC'],
      },
      {
        stem: [
          '已知△ABC∼△DEF，AB=4、DE=6 cm。第二个/第一个的倍率？',
          'Given △ABC∼△DEF with AB=4 and DE=6 cm, find the second/first factor.',
        ],
        answer: {
          kind: 'number',
          value: '3/2',
        },
        steps: [
          [
            'DE/AB=6/4=3/2，为无单位正数。',
            'DE/AB=6/4=3/2, a positive dimensionless factor.',
          ],
        ],
        wrong: ['2/3', '2', '10'],
      },
      {
        stem: [
          '上题改问第一个/第二个的倍率。',
          'Reverse the preceding direction: what is the first/second factor?',
        ],
        answer: {
          kind: 'number',
          value: '2/3',
        },
        steps: [
          [
            'AB/DE=4/6=2/3，与3/2互为倒数。',
            'AB/DE=4/6=2/3, the reciprocal of 3/2.',
          ],
        ],
        wrong: ['3/2', '-3/2'],
      },
      {
        stem: [
          '完整矩形3×2变成6×3，宽对应宽、高对应高。相似吗？',
          'A complete 3×2 rectangle becomes 6×3, width to width and height to height. Are they similar?',
        ],
        answer: {
          kind: 'similarity-class',
          value: 'not-similar',
        },
        steps: [
          [
            '宽比2，高比3/2不一致；即使改配宽高，两个长宽比也不同。',
            'Width scales by two, height by 3/2; the aspect ratios also differ if orientation is exchanged.',
          ],
        ],
        wrong: ['similar', '相似'],
      },
      {
        stem: [
          '“旋转后的△DEF不能与△ABC相似。”反驳并说明标签如何保留。',
          'Refute “a rotated △DEF cannot be similar to △ABC” and explain how labels persist.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: '旋转反射保持距离和角，原相似正倍率仍成立；A对应D等身份随点移动而非按屏幕左中右重命名。例3、4、5与9/2、6、15/2统一3/2；须核三对或有效判定。',
            en: 'Rotation and reflection preserve lengths and angles, hence an existing similarity factor. Vertex identities move with the points rather than being renamed by screen position. For example sides 3,4,5 and 9/2,6,15/2 share factor 3/2; justify all pairs or a valid criterion.',
          },
        },
        steps: [
          [
            '旋转反射保持距离和角，原相似正倍率仍成立；A对应D等身份随点移动而非按屏幕左中右重命名。例3、4、5与9/2、6、15/2统一3/2；须核三对或有效判定。',
            'Rotation and reflection preserve lengths and angles, hence an existing similarity factor. Vertex identities move with the points rather than being renamed by screen position. For example sides 3,4,5 and 9/2,6,15/2 share factor 3/2; justify all pairs or a valid criterion.',
          ],
        ],
        wrong: [],
      },
      {
        stem: [
          '一个非退化三角形整体等比缩放k=1后再反射。与原图相似吗？',
          'A nondegenerate triangle is uniformly scaled by k=1 and reflected. Is it similar to the original?',
        ],
        answer: {
          kind: 'similarity-class',
          value: 'similar',
        },
        steps: [
          [
            '对应角不变、边比1，既相似也全等。',
            'Corresponding angles remain equal and every side ratio is one: it is both similar and congruent.',
          ],
        ],
        wrong: ['not similar'],
      },
    ],
    pick: {
      stem: [
        '哪个操作始终保持三角形相似？',
        'Which operation always preserves triangle similarity?',
      ],
      options: [
        ['横纵同乘3/2后旋转', 'Scale both directions by 3/2, then rotate'],
        ['仅横向乘2', 'Multiply horizontal coordinates only by two'],
        ['只保留一条边长相等', 'Keep only one equal side length'],
      ],
      feedback: [
        [
          '统一正倍率与刚体变换保持对应角和边比。',
          'A common positive factor and rigid transformations preserve angles and side ratios.',
        ],
        [
          '单向拉伸通常改变角及不同方向的边比。',
          'A directional stretch generally changes angles and side ratios.',
        ],
        [
          '一对边相等远不足以约束形状。',
          'One equal side pair does not constrain the full shape.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '解释为什么写“倍率3/2”前必须给对应和方向。',
      'Explain why correspondence and direction must precede “factor 3/2”.',
    ],
    rubric: [
      '列如ABC↔DEF，DE/AB=EF/BC=FD/CA=3/2；反向全部为2/3。旋转不改对应，不能混用DE/AB与BC/EF。相似比为正无单位数，k=1允许。',
      'For ABC↔DEF write DE/AB=EF/BC=FD/CA=3/2; reversing every ratio gives 2/3. Rotation does not change correspondence. Do not mix DE/AB with BC/EF. The factor is positive and dimensionless, with k=1 allowed.',
    ],
    misconception: [
      '相似不要求大小相同，也不要求方向相同；同一正倍率必须用于全部对应长度。',
      'Similarity allows different sizes and orientations; every corresponding length uses one positive factor.',
    ],
    prompts: [
      [
        '先指出对应，再说依据。',
        'Identify the correspondence before stating the evidence.',
      ],
      [
        '这个数是长度倍率、面积倍率，还是屏幕缩放？',
        'Is this number a length scale, area scale or screen zoom?',
      ],
    ],
  },
  {
    title: ['三角形相似判定', 'Triangle similarity tests'],
    lab: 'similarity-tests',
    objective: [
      '由明确已知使用AA、SAS、SSS，辨认夹角并用反例审查一般SSA条件。',
      'Use AA, SAS and SSS from explicit givens, identify the included angle and audit general SSA using a counterexample.',
    ],
    prerequisites: ['J94-L01', 'J86-L02'],
    keywords: [
      ['两角', 'AA'],
      ['夹角', 'included angle'],
      ['证据充分', 'sufficient evidence'],
    ],
    hook: [
      '两边比例相同，再有一个角就够了吗？',
      'Do two proportional sides plus any angle suffice?',
    ],
    items: [
      {
        stem: [
          '固定ABC↔DEF，已知∠A=∠D=50°、∠B=∠E=60°。用最简判定名称。',
          'Fix ABC↔DEF with ∠A=∠D=50° and ∠B=∠E=60°. Name the simplest similarity criterion.',
        ],
        answer: {
          kind: 'similarity-rule',
          value: 'AA',
        },
        steps: [
          [
            '两对角相等，第三对均70°；AA已足够。',
            'Two angle pairs agree; both third angles are 70°, so AA suffices.',
          ],
        ],
        wrong: ['SAS', 'SSS', 'insufficient'],
      },
      {
        stem: [
          'DE/AB=DF/AC=2，∠D=∠A。用哪条相似判定？',
          'DE/AB=DF/AC=2 and ∠D=∠A. Which similarity criterion applies?',
        ],
        answer: {
          kind: 'similarity-rule',
          value: 'SAS',
        },
        steps: [
          [
            'A夹在AB与AC之间，D夹在DE与DF之间，两边同向成比例且夹角相等。',
            'A is included between AB and AC, and D between DE and DF: proportional sides and their included angle establish SAS.',
          ],
        ],
        wrong: ['AA', 'SSS', 'insufficient'],
      },
      {
        stem: [
          'DE/AB=EF/BC=FD/CA=3/2，三角形均非退化。判定名称？',
          'DE/AB=EF/BC=FD/CA=3/2 for nondegenerate triangles. Name the criterion.',
        ],
        answer: {
          kind: 'similarity-rule',
          value: 'SSS',
        },
        steps: [
          [
            '三对对应边同一个正倍率，不要求边长相等。',
            'Three corresponding side pairs share one positive factor; equal lengths are unnecessary.',
          ],
        ],
        wrong: ['SAS', 'AA', 'insufficient'],
      },
      {
        stem: [
          '只知DE/AB=EF/BC=3/2、∠D=∠A=30°，角不夹在这两条边间。能由本课一般判定保证相似吗？',
          'Only DE/AB=EF/BC=3/2 and ∠D=∠A=30° are known; the angle is not included between those sides. Does a general criterion guarantee similarity?',
        ],
        answer: {
          kind: 'similarity-rule',
          value: 'insufficient',
        },
        steps: [
          [
            '这是一般SSA；AB6、BC4、A30°允许CA=3√3±√7，选不同分支后再缩放会使第三对边比不同。',
            'This is general SSA. AB=6, BC=4 and A=30° allow CA=3√3±√7; choosing opposite branches before scaling gives unequal third-side ratios.',
          ],
        ],
        wrong: ['SAS', 'AA', 'SSS'],
      },
      {
        stem: [
          '“AAA不能证明全等，所以也不能证明相似。”指出逻辑错误。',
          'Identify the error in “AAA cannot prove congruence, so it cannot prove similarity”.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: '全等还要求大小相同，相似允许任意正倍率。三角和使三角相等中的第三角冗余，两角相等已足够AA；4为底和6为底可同角不同大。',
            en: 'Congruence fixes size; similarity allows any positive scale. The triangle angle sum makes the third equality redundant, so AA already suffices. Bases four and six may belong to triangles with equal angles but different sizes.',
          },
        },
        steps: [
          [
            '全等还要求大小相同，相似允许任意正倍率。三角和使三角相等中的第三角冗余，两角相等已足够AA；4为底和6为底可同角不同大。',
            'Congruence fixes size; similarity allows any positive scale. The triangle angle sum makes the third equality redundant, so AA already suffices. Bases four and six may belong to triangles with equal angles but different sizes.',
          ],
        ],
        wrong: [],
      },
      {
        stem: [
          '只给三对边比3/2、3/2、2，无角条件。能套SSS相似吗？',
          'Given only three side ratios 3/2, 3/2 and 2, with no angle conditions, does SSS similarity apply?',
        ],
        answer: {
          kind: 'similarity-rule',
          value: 'insufficient',
        },
        steps: [
          [
            '第三个比不同，SSS的统一倍率前提未满足；不能挑两对就宣布成立。',
            'The third ratio differs, so the common-factor premise of SSS is missing; selecting only two pairs is insufficient.',
          ],
        ],
        wrong: ['SSS', 'SAS', 'AA'],
      },
    ],
    pick: {
      stem: ['SAS中的角是哪一个？', 'Which angle is required in SAS?'],
      options: [
        ['任意一个对应角', 'Any corresponding angle'],
        [
          '两条已比边之间的夹角',
          'The included angle between the compared sides',
        ],
        ['图上看起来最小的角', 'The angle that looks smallest'],
      ],
      feedback: [
        [
          '非夹角通常是SSA，不能直接套判定。',
          'A nonincluded angle generally gives SSA, not SAS.',
        ],
        [
          '夹角位置连同两边统一倍率构成SAS。',
          'Its included position plus one common side factor supplies SAS.',
        ],
        [
          '像素外观不提供等角条件。',
          'Appearance does not supply an angle equality.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '给一个充分的AA证明，并解释一个SSA反例排除了什么说法。',
      'Give a sufficient AA argument and state which universal claim an SSA counterexample disproves.',
    ],
    rubric: [
      '明确两对角来自已知或平行线，再用AA。SSA反例说明“任意两边比例和任意对应角都足够”是错的；不能推成所有SSA情形都不可能相似，或否定另给直角等额外条件的特殊情况。',
      'Cite two angle pairs from givens or justified parallel lines, then use AA. An SSA counterexample disproves the universal claim that any two proportional sides plus any corresponding angle suffice. It does not say every SSA configuration is nonsimilar or rule out special cases with additional premises such as right angles.',
    ],
    misconception: [
      '判定名称不是理由；先明确对应、夹角或三边统一倍率，不从示意图补条件。',
      'A criterion name is not a proof: cite the correspondence, included angle or three common side ratios without adding sketch-based premises.',
    ],
    prompts: [
      [
        '先指出对应，再说依据。',
        'Identify the correspondence before stating the evidence.',
      ],
      [
        '这个数是长度倍率、面积倍率，还是屏幕缩放？',
        'Is this number a length scale, area scale or screen zoom?',
      ],
    ],
  },
  {
    title: ['相似三角形的边长计算', 'Finding sides in similar triangles'],
    lab: 'similarity-sides',
    objective: [
      '先用相似依据匹配整边，再按正向、反向与嵌套方向精确求长度。',
      'Establish similarity, match whole sides and find exact lengths in forward, reverse and nested directions.',
    ],
    prerequisites: ['J94-L02', 'J73-L01'],
    keywords: [
      ['对应边', 'corresponding sides'],
      ['倍率方向', 'scale direction'],
      ['平行截线', 'parallel segment'],
    ],
    hook: [
      '小三角形的倍率，应该用AD/AB还是AD/DB？',
      'For a nested triangle, is the scale AD/AB or AD/DB?',
    ],
    items: [
      {
        stem: [
          '已知△ABC∼△DEF，AB=4、DE=6、BC=5 cm，求EF。',
          'Given △ABC∼△DEF with AB=4, DE=6 and BC=5 cm, find EF.',
        ],
        answer: {
          kind: 'number',
          value: '15/2',
          unit: 'cm',
        },
        steps: [
          [
            'EF/BC=DE/AB=3/2，所以EF=5×3/2=15/2 cm。',
            'EF/BC=DE/AB=3/2, so EF=5×3/2=15/2 cm.',
          ],
        ],
        wrong: ['10/3', '7', '9'],
      },
      {
        stem: [
          '同一对应中AB=4、DE=6、DF=9/2 cm，求原边CA。',
          'In the same correspondence AB=4, DE=6 and DF=9/2 cm. Find original CA.',
        ],
        answer: {
          kind: 'number',
          value: '3',
          unit: 'cm',
        },
        steps: [
          [
            'DF/CA=3/2，所以CA=(9/2)÷(3/2)=3 cm。',
            'DF/CA=3/2, so CA=(9/2)÷(3/2)=3 cm.',
          ],
        ],
        wrong: ['27/4', '9/2'],
      },
      {
        stem: [
          'D∈AB、E∈AC，DE∥BC。AB=6、AD=4、BC=12 cm。求DE。',
          'D lies on AB, E on AC and DE∥BC. AB=6, AD=4 and BC=12 cm. Find DE.',
        ],
        answer: {
          kind: 'number',
          value: '8',
          unit: 'cm',
        },
        steps: [
          [
            '平行线给对应角相等，AA得ADE∼ABC；小/大=AD/AB=2/3，DE=8 cm。',
            'Parallel lines supply equal corresponding angles, so ADE∼ABC by AA. Small/large=AD/AB=2/3 and DE=8 cm.',
          ],
        ],
        wrong: ['24', '18', '6'],
        diagram: {
          kind: 'similarity-nested',
        },
      },
      {
        stem: [
          '在同一嵌套图中AC=9 cm，AB=6、AD=4，DE∥BC。求AE。',
          'In that nested figure AC=9 cm, AB=6, AD=4 and DE∥BC. Find AE.',
        ],
        answer: {
          kind: 'number',
          value: '6',
          unit: 'cm',
        },
        steps: [
          [
            'AE/AC=AD/AB=2/3，AE=6；DB=2不是大三角形的对应整边。',
            'AE/AC=AD/AB=2/3, so AE=6. DB=2 is not the corresponding whole side of the large triangle.',
          ],
        ],
        wrong: ['18', '3', '13.5'],
      },
      {
        stem: [
          '只知AB=4、DE=6、BC=5，没有相似或角条件，能唯一求EF吗？',
          'Only AB=4, DE=6 and BC=5 are known, without similarity or angle conditions. Can EF be uniquely determined?',
        ],
        answer: {
          kind: 'proof-verdict',
          value: 'insufficient',
        },
        steps: [
          [
            '第二三角形可保持DE6而移动F，得到不同EF；一对边不保证所有边同倍率。',
            'Keep DE=6 and move F in the second triangle to obtain different EF values. One side pair does not establish a common factor.',
          ],
        ],
        wrong: ['sufficient', 'congruent'],
      },
      {
        stem: [
          '△ABC∼△DEF，AB=8、DE=6、AC=10 cm，求DF。',
          'Given △ABC∼△DEF with AB=8, DE=6 and AC=10 cm, find DF.',
        ],
        answer: {
          kind: 'number',
          value: '15/2',
          unit: 'cm',
        },
        steps: [
          [
            '第二/第一=6/8=3/4，DF=10×3/4=15/2 cm；缩小也可相似。',
            'Second/first=6/8=3/4, so DF=10×3/4=15/2 cm; reduction also preserves similarity.',
          ],
        ],
        wrong: ['40/3', '12'],
      },
    ],
    pick: {
      stem: [
        'D在AB上，AD=4、DB=2；小△ADE∼大△ABC。小/大倍率？',
        'D lies on AB with AD=4 and DB=2; small ADE∼large ABC. Find small/large scale.',
      ],
      options: [
        ['4/2=2', '4/2=2'],
        ['4/(4+2)=2/3', '4/(4+2)=2/3'],
        ['2/4=1/2', '2/4=1/2'],
      ],
      feedback: [
        [
          'DB是剩余段，不是对应整边。',
          'DB is the leftover segment, not the corresponding whole side.',
        ],
        [
          'AB=AD+DB=6，对应AD/AB=2/3。',
          'AB=AD+DB=6, giving corresponding ratio AD/AB=2/3.',
        ],
        [
          'DB不对应AD，不能拿任意两段相比。',
          'DB does not correspond to AD; arbitrary segments cannot be paired.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '写出嵌套图的角依据、相似次序和求DE的完整比例链。',
      'Write the angle evidence, similarity order and full proportion chain for DE in the nested figure.',
    ],
    rubric: [
      'D∈AB、E∈AC，A角共用；DE∥BC给ADE=ABC（对应角），AA得△ADE∼△ABC。AD/AB=AE/AC=DE/BC=4/6=2/3，DE=8 cm；核DE<BC且量纲为长度。',
      'D∈AB and E∈AC give the common A angle. DE∥BC gives ∠ADE=∠ABC by corresponding angles, hence △ADE∼△ABC by AA. AD/AB=AE/AC=DE/BC=4/6=2/3, so DE=8 cm. Check DE<BC and length units.',
    ],
    misconception: [
      '比例式先有相似依据；嵌套图比较小整边与大整边，反求原边要除倍率。',
      'Proportions need similarity evidence. Compare small whole sides with large whole sides; reverse scaling divides by the factor.',
    ],
    prompts: [
      [
        '先指出对应，再说依据。',
        'Identify the correspondence before stating the evidence.',
      ],
      [
        '这个数是长度倍率、面积倍率，还是屏幕缩放？',
        'Is this number a length scale, area scale or screen zoom?',
      ],
    ],
  },
  {
    title: ['面积比与长度比', 'Area ratio versus length ratio'],
    lab: 'similarity-area',
    objective: [
      '由相似长度倍率k推出面积倍率k²，反求正倍率并审查非相似面积推断。',
      'Derive area factor k² from a similarity factor k, recover its positive root and audit claims without similarity.',
    ],
    prerequisites: ['J94-L03', 'J91-L01'],
    keywords: [
      ['长度比', 'length ratio'],
      ['面积比', 'area ratio'],
      ['平方倍率', 'squared factor'],
    ],
    hook: [
      '边长翻三倍，铺满它需要几块原面积？',
      'When lengths triple, how many original-area blocks cover the new figure?',
    ],
    items: [
      {
        stem: [
          '相似图形第二个/第一个的长度比3，面积比多少？',
          'Similar figures have second/first length ratio three. What is the area ratio?',
        ],
        answer: {
          kind: 'number',
          value: '9',
        },
        steps: [
          [
            '两独立方向各乘3，面积乘3²=9。',
            'Both independent directions scale by three, so area scales by 3²=9.',
          ],
        ],
        wrong: ['3', '6'],
        diagram: {
          kind: 'similarity-area',
          sx: 3,
        },
      },
      {
        stem: [
          '相似图形长度比3/2，面积比多少？',
          'Similar figures have length ratio 3/2. Find the area ratio.',
        ],
        answer: {
          kind: 'number',
          value: '9/4',
        },
        steps: [
          [
            '面积比=(3/2)²=9/4，为无单位比。',
            'Area ratio=(3/2)²=9/4, a dimensionless ratio.',
          ],
        ],
        wrong: ['3/2', '3', '9/2'],
      },
      {
        stem: [
          '已知两图相似且面积第二/第一=9/4，正长度倍率多少？',
          'Two figures are known similar with second/first area ratio 9/4. Find the positive length factor.',
        ],
        answer: {
          kind: 'number',
          value: '3/2',
        },
        steps: [
          [
            'k>0，k²=9/4，所以k=3/2，不取负值。',
            'k>0 and k²=9/4, hence k=3/2, excluding the negative root.',
          ],
        ],
        wrong: ['9/4', '-3/2'],
      },
      {
        stem: [
          '两图相似，面积第二/第一=2，正长度倍率的精确值？',
          'Two figures are similar with second/first area ratio two. Give the exact positive length factor.',
        ],
        answer: {
          kind: 'radical',
          value: '√2',
          simplified: false,
        },
        steps: [
          [
            'k²=2，k=√2；1.41只是近似。',
            'k²=2 gives k=√2; 1.41 is only approximate.',
          ],
        ],
        wrong: ['2', '-√2', '1.41'],
      },
      {
        stem: [
          '原面积6 cm²，整体等比放大k=3。新面积多少？',
          'An original area is 6 cm² and uniform length factor is three. Find the new area.',
        ],
        answer: {
          kind: 'number',
          value: '54',
          unit: 'cm²',
        },
        steps: [
          [
            '新面积6×3²=54 cm²；周长只乘3，面积乘9。',
            'New area=6×3²=54 cm². Perimeter scales by three, area by nine.',
          ],
        ],
        wrong: ['18', '36', '9'],
      },
      {
        stem: [
          '两个矩形面积同为6 cm²，可以仅凭面积断言相似且k=1吗？',
          'Two rectangles each have area 6 cm². Does that alone prove similarity with k=1?',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: '不可以。3×2与6×1面积都6但长宽比3/2与6不同，不相似。只有已知相似时，面积比1才推出正长度倍率1并进而全等；先决条件不能省略。',
            en: 'No: rectangles 3×2 and 6×1 both have area six but different aspect ratios, 3/2 and six. Only after similarity is established does area ratio one imply positive length factor one and congruence. Do not omit the premise.',
          },
        },
        steps: [
          [
            '不可以。3×2与6×1面积都6但长宽比3/2与6不同，不相似。只有已知相似时，面积比1才推出正长度倍率1并进而全等；先决条件不能省略。',
            'No: rectangles 3×2 and 6×1 both have area six but different aspect ratios, 3/2 and six. Only after similarity is established does area ratio one imply positive length factor one and congruence. Do not omit the premise.',
          ],
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: [
        '相似长度比3，哪个结论正确？',
        'For similarity length ratio three, which statement is correct?',
      ],
      options: [
        ['周长比9，面积比3', 'Perimeter ratio nine, area ratio three'],
        ['周长比3，面积比9', 'Perimeter ratio three, area ratio nine'],
        ['任何同面积图形都相似', 'Any equal-area figures are similar'],
      ],
      feedback: [
        [
          '周长是长度和，乘3；面积乘3²。',
          'Perimeter sums lengths and scales by three; area scales by 3².',
        ],
        [
          '对应边各乘3，所以周长乘3，面积乘9。',
          'Every side scales by three, so perimeter scales by three and area by nine.',
        ],
        ['面积不能唯一确定形状。', 'Area alone does not determine shape.'],
      ],
      correct: 1,
    },
    reason: [
      '用矩形或三角形解释k²，而非只背公式，并说明适用前提。',
      'Explain k² using a rectangle or triangle, stating the similarity premise.',
    ],
    rubric: [
      '矩形宽w高h变kw、kh，面积k²wh；三角形对应底和高都乘k，(kb)(kh)/2=k²bh/2。一般多边形可同对应分割。相似和同方向倍率在前；横纵不同倍率a、b只保证本矩形面积乘ab，不自动给一个相似比。',
      'A rectangle w×h becomes kw×kh, giving k²wh. A triangle has corresponding base and altitude scaled by k, so (kb)(kh)/2=k²bh/2. Corresponding triangulations extend this to polygons. Establish similarity and direction first. Different width and height factors a,b give rectangle area factor ab without a single similarity factor.',
    ],
    misconception: [
      '面积比开平方反求长度只适用于已知相似；同面积本身不保证形状。',
      'Taking a square root of area ratio requires established similarity; equal areas alone do not establish shape.',
    ],
    prompts: [
      [
        '先指出对应，再说依据。',
        'Identify the correspondence before stating the evidence.',
      ],
      [
        '这个数是长度倍率、面积倍率，还是屏幕缩放？',
        'Is this number a length scale, area scale or screen zoom?',
      ],
    ],
  },
  {
    title: ['地图和摄影中的相似', 'Similarity in maps and images'],
    lab: 'similarity-applications',
    objective: [
      '在统一单位和明确模型前提下使用地图、图像与影长比例，识别裁切和透视限制。',
      'Use map, image and shadow proportions with unified units and explicit premises, recognising crop and perspective limits.',
    ],
    prerequisites: ['J94-L04', 'P63-L05'],
    keywords: [
      ['比例尺', 'map scale'],
      ['裁切与拉伸', 'crop and stretch'],
      ['建模前提', 'model premises'],
    ],
    hook: [
      '照片变窄，是等比缩小、裁切，还是把内容压扁了？',
      'A narrower photo: uniform reduction, cropping or compressed content?',
    ],
    items: [
      {
        stem: [
          '虚构原印图比例尺1:50000，AB图距3 cm。实际直线距离多少km？',
          'A fictional original printed map is 1:50000 and AB measures 3 cm. Find the real straight-line distance in km.',
        ],
        answer: {
          kind: 'number',
          value: '3/2',
          unit: 'km',
        },
        steps: [
          [
            '3×50000=150000 cm=1500 m=1.5 km；非道路里程。',
            '3×50000=150000 cm=1500 m=1.5 km; this is not road travel distance.',
          ],
        ],
        wrong: ['150000', '1500', '15'],
      },
      {
        stem: [
          '同一原印图1:50000，实际直线距离2 km，原图距离多少cm？',
          'On that original 1:50000 print, what map distance in cm represents a real straight-line distance of 2 km?',
        ],
        answer: {
          kind: 'number',
          value: '4',
          unit: 'cm',
        },
        steps: [
          [
            '2 km=200000 cm，图距200000/50000=4 cm。',
            'Convert 2 km to 200000 cm, then divide by 50000 to get 4 cm.',
          ],
        ],
        wrong: ['0.04', '40', '100000'],
      },
      {
        stem: [
          '虚构4×3 cm完整照片等比缩放到宽10 cm，新高多少？',
          'A fictional complete 4×3 cm photo is uniformly resized to width 10 cm. Find its new height.',
        ],
        answer: {
          kind: 'number',
          value: '15/2',
          unit: 'cm',
        },
        steps: [
          [
            'k=10/4=5/2，高3×5/2=15/2 cm。',
            'k=10/4=5/2, so height=3×5/2=15/2 cm.',
          ],
        ],
        wrong: ['6', '5', '30'],
      },
      {
        stem: [
          '一张透视拍摄的斜矩形照片只给一处长度标定，足够保证全图一个长度倍率吗？',
          'An oblique perspective photograph of a rectangle has just one local length calibration. Is that sufficient to guarantee one length factor over the whole image?',
        ],
        answer: {
          kind: 'proof-verdict',
          value: 'insufficient',
        },
        steps: [
          [
            '透视可随位置方向改变尺度；单一标定不能保证整幅图相似，须更多几何信息或校正。',
            'Perspective can vary scale with position and direction. One calibration does not establish whole-image similarity; more geometric information or rectification is needed.',
          ],
        ],
        wrong: ['sufficient', 'similar'],
      },
      {
        stem: [
          '虚构同时平行光、同水平地面、两物体直立：1.2 m杆影0.8 m，另一影3 m。求另一高度。',
          'Under fictional simultaneous parallel light, level ground and upright objects, a 1.2 m rod casts a 0.8 m shadow. Another shadow is 3 m. Find its object height.',
        ],
        answer: {
          kind: 'number',
          value: '9/2',
          unit: 'm',
        },
        steps: [
          [
            '两直角和光线角相等，AA后h/3=1.2/0.8，h=4.5 m。',
            'Right angles and equal light angles give AA, then h/3=1.2/0.8, so h=4.5 m.',
          ],
        ],
        wrong: ['2', '3', '3.6'],
      },
      {
        stem: [
          '从4×3照片下方裁去一条，使保留框为4×2，再等比放宽到10。解释保留内容和完整原框各是否保持相似。',
          'Crop a 4×3 photo to a retained 4×2 frame, then uniformly resize it to width 10. Explain similarity for the retained content and for the complete original frame.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: '保留内容等比乘5/2，没有被压扁，保留框变10×5且与4×2相似；但完整原框4×3的长宽比4/3不同于新框2，二者不相似。裁切删内容，拉伸改形状，不混同。',
            en: 'Retained content scales by 5/2 without squashing: the retained 4×2 frame becomes a similar 10×5 frame. The complete original 4×3 frame has aspect ratio 4/3, different from the new frame ratio two, so those complete frames are not similar. Cropping removes content; stretching distorts it.',
          },
        },
        steps: [
          [
            '保留内容等比乘5/2，没有被压扁，保留框变10×5且与4×2相似；但完整原框4×3的长宽比4/3不同于新框2，二者不相似。裁切删内容，拉伸改形状，不混同。',
            'Retained content scales by 5/2 without squashing: the retained 4×2 frame becomes a similar 10×5 frame. The complete original 4×3 frame has aspect ratio 4/3, different from the new frame ratio two, so those complete frames are not similar. Cropping removes content; stretching distorts it.',
          ],
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: [
        '把地图屏幕放大两倍时，如何保持1 km图示比例尺可信？',
        'When a map display doubles in size, how should its 1 km scale bar behave?',
      ],
      options: [
        ['地图和比例尺条一起放大两倍', 'Double both map and scale-bar lengths'],
        ['只放大地图，比例尺条不变', 'Enlarge only the map'],
        ['实际AB距离也翻倍', 'Double the actual AB distance'],
      ],
      feedback: [
        [
          '同一现实距离对应图距和标尺长度一起乘2；原印刷数值比例尺不能直接当屏幕厘米。',
          'Map and bar lengths scale together for the same real distance; the original print ratio cannot be read as screen centimetres.',
        ],
        [
          '固定条长会错误表示缩放后的距离。',
          'A fixed bar length would misrepresent the resized map.',
        ],
        [
          '屏幕缩放不改变现实距离。',
          'Display zoom does not change real distance.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '给一个地图或影长比例的完整建模链，并列一个条件不足的情形。',
      'Give a complete map or shadow model and one case where its premises are insufficient.',
    ],
    rubric: [
      '如原印图3 cm、1:50000，先统一cm得150000 cm，再转1.5 km；放大屏幕让路线与1 km条同步，不能用屏幕尺套原比。或影长先说明同地同时、光线平行、地面水平且物体直立，AA后4.5 m。若缺这些条件，不能把观察影长直接当唯一高度；单幅透视图一处标定也不足以给全局倍率。',
      'For example original-print 3 cm at 1:50000 gives 150000 cm, then 1.5 km. Screen zoom rescales route and 1 km bar together; screen centimetres cannot use the original ratio directly. Alternatively state simultaneous parallel light, level ground and upright objects, derive AA, then obtain 4.5 m. Without those premises the shadow does not establish a unique height. One local calibration in a perspective image also does not give a global scale.',
    ],
    misconception: [
      '原印图厘米、屏幕像素与实际距离要区分；等比缩放、拉伸、裁切、透视有不同几何效果。',
      'Distinguish original-print centimetres, screen pixels and real distance. Uniform resize, stretch, crop and perspective have different geometric effects.',
    ],
    prompts: [
      [
        '先指出对应，再说依据。',
        'Identify the correspondence before stating the evidence.',
      ],
      [
        '这个数是长度倍率、面积倍率，还是屏幕缩放？',
        'Is this number a length scale, area scale or screen zoom?',
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
export const j94Lessons: Lesson[] = specs.map((s, i) => {
  const id = `J94-L0${i + 1}`;
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
    unit: 'J94',
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
            '纸上创作一张虚构街区图，标原印图1:50000及一条1 km比例尺；写AB直线3 cm对应1.5 km，并比较屏幕放大后的路线与标尺。再画4×3照片的等比缩放、单向拉伸和裁切框，标尺寸、面积与保留内容。家长核对应、单位和前提，区分实际距离与屏幕尺寸；不需出门、购买或上传。',
            'Create a fictional neighbourhood map on paper with an original-print ratio 1:50000 and a 1 km bar. Show that straight-line AB=3 cm represents 1.5 km, and compare the route and bar after screen zoom. Draw uniform, stretched and cropped versions of a 4×3 photo, labelling dimensions, areas and retained content. A parent checks correspondence, units and premises, distinguishing real distance from display size. No outing, purchase or upload is needed.',
          ),
        }
      : {}),
  };
});
export function j94ReviewQuestion(id: string, round: number): Question {
  if (
    !/^J94-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid J94 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 80,
    a = (k % 8) + 1,
    b = Math.floor(k / 8) + 2,
    ratio = textR(rational(BigInt(b), BigInt(a)));
  let v: Item;
  if (i === 0) {
    const reverse = k % 2 === 1,
      value = reverse ? textR(rational(BigInt(a), BigInt(b))) : ratio;
    v = {
      stem: [
        `△ABC∼△DEF，AB=${a}、DE=${b}，求${reverse ? '第一/第二' : '第二/第一'}倍率。`,
        `Given △ABC∼△DEF, AB=${a}, DE=${b}, find the ${reverse ? 'first/second' : 'second/first'} factor.`,
      ],
      answer: { kind: 'number', value },
      steps: [
        [
          `${reverse ? 'AB/DE' : 'DE/AB'}=${value}；按对应和指定方向。`,
          `${reverse ? 'AB/DE' : 'DE/AB'}=${value}; retain correspondence and the stated direction.`,
        ],
      ],
      wrong: ['-1', '0'],
    };
  } else if (i === 1) {
    const which = k % 4,
      value = (['AA', 'SAS', 'SSS', 'insufficient'] as const)[which]!,
      facts = [
        `∠A=∠D=${a + 30}°,∠B=∠E=60°`,
        `DE/AB=DF/AC=${ratio},∠D=∠A=60°`,
        `DE/AB=EF/BC=FD/CA=${ratio}`,
        `∠A=∠D=${a + 30}°`,
      ][which]!;
    v = {
      stem: [
        `固定ABC↔DEF，只知${facts}。用AA/SAS/SSS或条件不足。`,
        `Fix ABC↔DEF with only ${facts}. Enter AA, SAS, SSS or insufficient.`,
      ],
      answer: { kind: 'similarity-rule', value },
      steps: [
        [
          `${value}：检查两角、夹角与三对统一倍率；一角不够。`,
          `${value}: check two angles, the included angle or three common ratios; one angle alone is insufficient.`,
        ],
      ],
      wrong: value === 'insufficient' ? ['AA', 'SAS', 'SSS'] : ['insufficient'],
    };
  } else if (i === 2) {
    const value = textR(rational(BigInt(b * (a + 2)), BigInt(a)));
    v = {
      stem: [
        `已知△ABC∼△DEF，AB=${a}、DE=${b}、BC=${a + 2} cm。求EF。`,
        `Given △ABC∼△DEF with AB=${a}, DE=${b}, BC=${a + 2} cm, find EF.`,
      ],
      answer: { kind: 'number', value, unit: 'cm' },
      steps: [
        [
          `EF=BC×DE/AB=${value} cm。`,
          `EF=BC×DE/AB=${value} cm, using whole corresponding sides.`,
        ],
      ],
      wrong: ['-1', '0'],
    };
  } else if (i === 3) {
    const inverse = k % 2 === 1,
      area = textR(rational(BigInt(b * b), BigInt(a * a))),
      value = inverse ? ratio : area;
    v = {
      stem: [
        `两图已知相似，${inverse ? `面积比${area}，求正长度倍率` : `长度倍率${ratio}，求面积比`}。`,
        `Two figures are known similar: ${inverse ? `area ratio ${area}; find the positive length factor` : `length factor ${ratio}; find the area ratio`}.`,
      ],
      answer: { kind: 'number', value },
      steps: [
        [
          inverse
            ? `取正平方根得${value}；相似是前提。`
            : `平方倍率得${value}，不是只乘一次。`,
          inverse
            ? `Take the positive square root to get ${value}, using the similarity premise.`
            : `Square the length factor to obtain ${value}, rather than using it only once.`,
        ],
      ],
      wrong: ['-1', '0'],
    };
  } else {
    const cm = a,
      den = (Math.floor(k / 8) + 1) * 10000,
      value = textR(rational(BigInt(cm * den), 100000n));
    v = {
      stem: [
        `虚构原印图1:${den}，图距${cm} cm。实际直线距离多少km？`,
        `A fictional original print is 1:${den}; map distance is ${cm} cm. Find the real straight-line distance in km.`,
      ],
      answer: { kind: 'number', value, unit: 'km' },
      steps: [
        [
          `先得${cm * den} cm，再除100000得${value} km；非屏幕厘米或道路里程。`,
          `First obtain ${cm * den} cm, then divide by 100000 to get ${value} km; these are not screen centimetres or road kilometres.`,
        ],
      ],
      wrong: ['-1', '0'],
    };
  }
  return q(`${id}-R${round}`, i, v);
}
export const j94CheckQuestions: Question[] = [
  q('J94-CHECK-Q1', 0, specs[0]!.items[0]!),
  q('J94-CHECK-Q2', 1, specs[1]!.items[3]!),
  q('J94-CHECK-Q3', 2, specs[2]!.items[2]!),
  q('J94-CHECK-Q4', 3, specs[3]!.items[3]!),
  q('J94-CHECK-Q5', 4, specs[4]!.items[4]!),
  reasoning(
    'J94-CHECK-Q6',
    t(
      '解释面积比开方的前提，并给同面积却不相似的反例。',
      'Explain the premise for taking an area-ratio square root and give an equal-area nonsimilar counterexample.',
    ),
    skills[3]!,
    specs[3]!.items[5]!.answer.kind === 'explain'
      ? specs[3]!.items[5]!.answer.rubric
      : t('', ''),
    hints[3]!.map(T),
  ),
  pick('J94-CHECK-Q7', 4, specs[4]!.pick),
  reasoning(
    'J94-CHECK-Q8',
    T(specs[4]!.reason),
    skills[4]!,
    T(specs[4]!.rubric),
    hints[4]!.map(T),
  ),
];
