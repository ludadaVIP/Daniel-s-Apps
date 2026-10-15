import {
  t,
  type Lesson,
  type Question,
  type AnswerSpec,
  type NumberDiagram,
} from '../model';
import { numeric, choice, reasoning } from './builders';
import type { GeometryClass } from '../planeModels';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = {
  stem: Pair;
  value: string;
  step: Pair;
  wrong: string[];
  accepted?: string[];
  kind?: 'geometry-class' | 'explain';
  unit?: '°' | 'cm';
  diagram?: NumberDiagram;
};
const N = (
  stem: Pair,
  value: string,
  step: Pair,
  wrong: string[],
  diagram?: NumberDiagram,
  unit: '°' | 'cm' | null = '°',
): Item => ({ stem, value, step, wrong, diagram, ...(unit ? { unit } : {}) });
const C = (
  stem: Pair,
  value: GeometryClass,
  step: Pair,
  wrong: string[],
  diagram?: NumberDiagram,
): Item => ({ stem, value, step, wrong, kind: 'geometry-class', diagram });
const M = (stem: Pair, rubric: Pair, diagram?: NumberDiagram): Item => ({
  stem,
  value: '',
  step: rubric,
  wrong: [],
  kind: 'explain',
  diagram,
});
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
const skills = [
  'geometric-objects-and-angle',
  'vertical-and-adjacent-angles',
  'parallel-conditions-and-pairs',
  'triangle-sum-with-reasons',
  'triangle-class-and-existence',
  'linked-geometrical-reasons',
];
const hints: Pair[][] = [
  [
    [
      '看端点、无限延伸箭头和角的顶点，不把画出的长度当作角度。',
      'Inspect endpoints, extension arrows and the vertex, rather than treating drawn length as angle size.',
    ],
    [
      '角名中间字母是顶点；分割角要先确认射线在角内部，相邻部分才相加。',
      'The middle letter names the vertex. Add adjacent parts only after confirming the dividing ray lies inside the angle.',
    ],
  ],
  [
    [
      '先按两条直线与角的位置，找对顶或邻补，而不只是看数值。',
      'Use the straight lines and angle positions to identify opposite or adjacent supplementary pairs.',
    ],
    [
      '对顶角相等；共享一边且另两边反向的邻补角和 180°。用关系列式，再检查四角和 360°。',
      'Vertically opposite angles are equal. Adjacent pairs whose other arms are opposite sum to 180°. Set up the relation and check the four-angle total of 360°.',
    ],
  ],
  [
    [
      '先找题设有没有平行条件，再确认同位、内错或同旁内角的位置。',
      'First identify whether parallelism is given, then locate corresponding, alternate interior or co-interior positions.',
    ],
    [
      '平行性质要有条件；反向判平行要用指定位置的相等或互补关系。外观不能当条件，无足够条件写“无法确定”。',
      'Parallel-angle properties need their premise. A converse needs specified equal or supplementary pairs. Appearance is insufficient; write “undetermined” without enough givens.',
    ],
  ],
  [
    [
      '只取非退化平面三角形内部三个角，先写和为 180°。',
      'Use the three interior angles of a nondegenerate plane triangle and state their sum is 180°.',
    ],
    [
      '未知角用 180° 减另外两角；等腰的两个底角相等，外角等于两个不相邻内角之和。解释可用过顶点的平行线。',
      'Subtract the other two angles from 180°. Isosceles base angles are equal; an exterior angle equals the two non-adjacent interiors. A parallel through a vertex explains the sum.',
    ],
  ],
  [
    [
      '先用严格三角形不等式判断成形，再分清按边还是按角分类。',
      'Test the strict triangle inequality first, then distinguish classification by sides from classification by angles.',
    ],
    [
      '任意两边之和大于第三边；第三边介于差的绝对值与和之间。按角看最大角，按边写最具体名称；等边也属于广义等腰。',
      'Any two sides must exceed the third; a third side lies strictly between the difference magnitude and sum. Inspect the largest angle or give the most specific side name. Equilateral is also isosceles inclusively.',
    ],
  ],
  [
    [
      '分开写已知、要证明和每条关系的来源，不先假定待证结论。',
      'Separate givens, the target and the source of each relationship; do not assume the conclusion.',
    ],
    [
      '关系→理由→下一关系要连起来。量图与外观可帮助猜想，不能代替条件；文字推理需家长核对。',
      'Link each relationship to its reason and the next step. Measurement and appearance support conjectures, not missing givens. Written reasoning needs parent review.',
    ],
  ],
];
function q(id: string, i: number, item: Item): Question {
  if (item.kind === 'explain') {
    const r = reasoning(
      id,
      T(item.stem),
      skills[i]!,
      T(item.step),
      hints[i]!.map(T),
    );
    r.diagram = item.diagram;
    return r;
  }
  const answer: AnswerSpec =
    item.kind === 'geometry-class'
      ? { kind: 'geometry-class', value: item.value as GeometryClass }
      : {
          kind: 'number',
          value: item.value,
          formats: ['decimal', 'fraction'],
          ...(item.unit ? { unit: item.unit } : {}),
        };
  const result = numeric(
    id,
    T(item.stem),
    item.value,
    skills[i]!,
    hints[i]!.map(T),
    [T(item.step), T(hints[i]![1]!)],
    {
      accepted: [
        item.value,
        ...(item.accepted ?? []),
        ...(item.unit ? [`${item.value} ${item.unit}`] : []),
      ],
      rejected: item.wrong,
    },
    item.diagram,
  );
  result.answer = answer;
  result.misconceptionTags = [
    skills[i]!,
    'given-versus-appearance',
    'reason-before-conclusion',
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
    title: ['点、线、射线、角', 'Points, lines, rays and angles'],
    objective: [
      '用端点和延伸方向辨对象，用共同端点及射线方向理解角。',
      'Identify objects by endpoints and extension, and understand an angle through its common vertex and ray directions.',
    ],
    prerequisites: ['B05-L04'],
    keywords: [
      ['端点', 'endpoint'],
      ['射线', 'ray'],
      ['顶点', 'vertex'],
    ],
    lab: 'plane-objects',
    hook: [
      '把角的边画长或把整张图旋转，角会变大吗？射线画在屏幕内就有两个端点吗？',
      'Does lengthening arms or rotating a picture enlarge an angle? Does a ray gain two endpoints because it is drawn on a screen?',
    ],
    items: [
      N(
        [
          '一条射线有几个端点？屏幕裁切处不算端点。',
          'How many endpoints does a ray have? The screen edge is not an endpoint.',
        ],
        '1',
        [
          '射线从一个端点出发沿一个方向无限延伸，只有一个端点。',
          'A ray starts at one endpoint and extends indefinitely in one direction.',
        ],
        ['0', '2'],
        { kind: 'plane-object', object: 'ray' },
        null,
      ),
      C(
        [
          '从 A 出发、经过 B 并继续沿这个方向无限延伸，表示什么对象？',
          'What object starts at A, passes through B and continues indefinitely in that direction?',
        ],
        'ray',
        [
          '一个端点、一个无限延伸方向，是射线 AB；BA 则从 B 出发，方向不同。',
          'One endpoint and one indefinite direction define ray AB; ray BA starts at B and has a different direction.',
        ],
        ['line', 'segment'],
        { kind: 'plane-object', object: 'ray' },
      ),
      C(
        [
          '经过 A、B，在两个方向都无限延伸，是什么对象？',
          'What passes through A and B and extends indefinitely both ways?',
        ],
        'line',
        [
          '直线没有端点，A、B 可以是线上的标记点，并非两端。',
          'A line has no endpoints; A and B can be marked points rather than ends.',
        ],
        ['ray', 'segment'],
        { kind: 'plane-object', object: 'line' },
      ),
      N(
        [
          '射线 OC 在 ∠AOB 内部，∠AOC=35°、∠COB=25°，求 ∠AOB。',
          'Ray OC lies inside ∠AOB, with ∠AOC=35° and ∠COB=25°. Find ∠AOB.',
        ],
        '60',
        [
          '内部射线把原角分成不重叠的两个相邻部分，35°+25°=60°。',
          'The inside ray partitions the angle into adjacent non-overlapping parts: 35°+25°=60°.',
        ],
        ['10', '120', '180'],
      ),
      C(
        [
          '从 A 到 B，两个端点之间的有限部分，是什么对象？',
          'What is the finite part between the two endpoints A and B?',
        ],
        'segment',
        [
          '线段有两个端点和有限长度，线段 AB 与 BA 表示同一部分。',
          'A segment has two endpoints and finite length; AB and BA name the same segment.',
        ],
        ['ray', 'line'],
        { kind: 'plane-object', object: 'segment' },
      ),
      N(
        [
          'OC 在 ∠AOB 内部，∠AOC=17°、∠COB=28°。把整图旋转后，∠AOB 多少度？',
          'OC lies inside ∠AOB, with parts 17° and 28°. After rotating the whole figure, what is ∠AOB?',
        ],
        '45',
        [
          '17°+28°=45°，整体旋转保持两射线夹角。',
          '17°+28°=45°; whole-figure rotation preserves the angle.',
        ],
        ['11', '90', '180'],
      ),
    ],
    pick: {
      stem: ['∠AOB 的顶点是谁？', 'Which point is the vertex of ∠AOB?'],
      correct: 1,
      options: [
        ['A', 'A'],
        ['O', 'O'],
        ['B', 'B'],
      ],
      feedback: [
        [
          'A 在一条边上，角名中间才是顶点。',
          'A lies on an arm; the middle letter is the vertex.',
        ],
        [
          '两射线 OA、OB 的共同端点是 O。',
          'O is the common endpoint of rays OA and OB.',
        ],
        [
          'B 在另一条边上，不是共同端点。',
          'B lies on the other arm, not at the common endpoint.',
        ],
      ],
      step: [
        '用三个字母命名角时，顶点必须放中间，∠BOA 表示同一个这里指定的小于平角的角。',
        'With three-letter naming the vertex belongs in the middle; ∠BOA names the same specified angle here.',
      ],
    },
    reason: [
      '比较点、线段、射线和直线；解释为什么改边长和整体旋转不改变指定角，为什么 AB 与 BA 命名射线时不能随意互换。',
      'Compare a point, segment, ray and line. Explain why arm length and whole rotation do not change an angle, and why ray AB cannot freely be renamed BA.',
    ],
    rubric: [
      '点只有位置没有大小；线段有限且有两端点，射线一端点、一个方向无限，直线无端点、两方向无限。A、B 标点不必是端点，屏幕边缘不是几何边界。角的顶点是共同端点，∠AOB 中 O 居中；同向延长或整体旋转不改变两方向夹角。射线 AB 起点 A，BA 起点 B 且方向相反；线段 AB、BA 则相同。家长核对对象定义、方向及角的不变量，不只看名称。',
      'A point has position without size; a segment is finite with two ends, a ray has one end and one indefinite direction, and a line has no ends and extends both ways. Marked points need not be endpoints and screen edges are not geometric boundaries. The common endpoint O goes in the middle of ∠AOB. Extending arms or rotating together preserves their relative directions. Ray AB starts at A, while BA starts at B with the opposite direction; segments AB and BA are the same. A parent checks definitions and invariants.',
    ],
    misconception: [
      '把标记点或屏幕边缘当端点；角名顶点放错；用边的长短猜角。',
      'Treating marks or screen edges as endpoints, misplacing the vertex in a name, or judging angles by arm length.',
    ],
    prompts: [
      [
        '哪里是端点，哪个方向可以继续延伸？',
        'Where is an endpoint, and which direction continues?',
      ],
      [
        '变的是长度、方向还是两方向之间的转角？',
        'Did length, orientation or the relative turn change?',
      ],
    ],
  },
  {
    title: [
      '相交线与对顶角',
      'Intersecting lines and vertically opposite angles',
    ],
    objective: [
      '依据两条直线及角的位置，区分对顶与邻补并推理角度。',
      'Distinguish vertically opposite and adjacent supplementary pairs from line structure and infer angles.',
    ],
    prerequisites: ['J74-L01', 'J73-L02'],
    keywords: [
      ['对顶角', 'vertically opposite angles'],
      ['邻补角', 'adjacent supplementary angles'],
      ['平角', 'straight angle'],
    ],
    lab: 'plane-intersect',
    hook: [
      '四个角围着同一交点，哪些相等，哪些加起来是 180°？共有顶点就算对顶吗？',
      'Four angles surround an intersection. Which are equal and which sum to 180°? Is a shared vertex enough?',
    ],
    items: [
      N(
        [
          '两直线相交，图中 A=42°，求其对顶角 C。',
          'Two straight lines intersect. A=42°; find vertically opposite C.',
        ],
        '42',
        [
          'A+B=180°、B+C=180°，同减 B 得 A=C=42°。',
          'A+B=180° and B+C=180°; subtract B to get A=C=42°.',
        ],
        ['138', '84'],
        { kind: 'plane-intersection', angle: 42 },
      ),
      N(
        [
          '同一图 A=42°，求邻补角 B。',
          'In the diagram A=42°. Find adjacent supplementary B.',
        ],
        '138',
        [
          'A、B 的非公共边是反向射线，所以 B=180°−42°=138°。',
          'The non-shared arms are opposite rays: B=180°−42°=138°.',
        ],
        ['42', '48'],
        { kind: 'plane-intersection', angle: 42 },
      ),
      N(
        [
          '两直线相交，A=112°，A 与 C 对顶，B 与 A 邻补，求 B。',
          'Two lines intersect with A=112°. A/C are vertically opposite and A/B adjacent supplementary. Find B.',
        ],
        '68',
        [
          '邻补角和 180°，B=68°；C=112°，四角为 112、68、112、68，总和 360。',
          'B=180°−112°=68°. C=112°; the four angles 112,68,112,68 total 360°.',
        ],
        ['112', '248'],
        { kind: 'plane-intersection', angle: 112, rotation: 30 },
      ),
      N(
        [
          '一对对顶角分别为 (3x+10)° 与 (2x+40)°，求 x。',
          'Vertically opposite angles measure (3x+10)° and (2x+40)°. Find x.',
        ],
        '30',
        [
          '对顶相等：3x+10=2x+40，x=30，两角均 100°；不是把两角加到 180°。',
          'Set 3x+10=2x+40, giving x=30 and both angles 100°. Do not force the opposite pair to sum to 180°.',
        ],
        ['26', '100'],
      ),
      N(
        [
          '两直线垂直相交，已知其中一个角 90°，它的邻补角多少度？',
          'Two perpendicular lines intersect with one angle 90°. What is its adjacent supplementary angle?',
        ],
        '90',
        [
          '180°−90°=90°；垂直时四角均直角，邻补不一定大小不同。',
          '180°−90°=90°. Perpendicular lines give four right angles; adjacent supplementary angles need not differ.',
        ],
        ['0', '180'],
        { kind: 'plane-intersection', angle: 90 },
      ),
      N(
        [
          '两直线相交，一个角 37.5°，求与它邻补的角。',
          'Two lines intersect with one angle 37.5°. Find its adjacent supplementary angle.',
        ],
        '142.5',
        [
          '180°−37.5°=142.5°，小数角度不必舍入。',
          '180°−37.5°=142.5°; the decimal angle need not be rounded.',
        ],
        ['37.5', '52.5'],
        { kind: 'plane-intersection', angle: 37.5 },
      ),
    ],
    pick: {
      stem: [
        '哪项足以确认图中 A、C 是对顶角？',
        'What establishes that A and C are vertically opposite?',
      ],
      correct: 2,
      options: [
        ['两角度数相同', 'Their measures are equal'],
        ['只要共一个顶点', 'They merely share a vertex'],
        [
          '来自同两条相交直线，边分别为反向射线且无公共边',
          'They come from the same two intersecting lines, with opposite arms and no shared arm',
        ],
      ],
      feedback: [
        [
          '相等也可能来自其他位置。',
          'Equal angles can occur in other positions.',
        ],
        ['邻角也共享顶点。', 'Adjacent angles also share a vertex.'],
        [
          '这给出位置结构，不靠碰巧相等。',
          'This specifies the geometry rather than coincidental equality.',
        ],
      ],
      step: [
        '先由位置辨关系，再用定理求度数；不能倒过来以相等定义对顶。',
        'Identify the relation from positions, then use the theorem; equality alone does not define vertically opposite angles.',
      ],
    },
    reason: [
      '不用量角器，利用两个平角解释对顶角为何相等；说明补角与邻补角的区别，以及相等是否必定对顶。',
      'Use two straight angles to explain vertically opposite equality without measurement. Distinguish supplementary from adjacent supplementary angles, and explain whether equal angles must be opposite.',
    ],
    rubric: [
      '两直线相交，A+B=180°、B+C=180°，从相等总量中减同一 B，A=C。邻补角共享顶点和一边、另外两边反向，故互补；任意和 180° 的两角可称补角，却未必相邻。相等不必对顶，例如不同交点的两个直角。家长核对直线、反向射线、相减链和反例，不以“看起来一样”作理由。',
      'At an intersection A+B=180° and B+C=180°; subtracting the same B gives A=C. Adjacent supplementary angles share a vertex and arm, with the other arms opposite. Any pair summing to 180° is supplementary but need not be adjacent. Equal angles need not be vertically opposite, as two right angles at different vertices show. Check the straight-line givens and linked subtraction.',
    ],
    misconception: [
      '把对顶角加成 180°；相等就认对顶；共享顶点就认邻补。',
      'Making opposite angles sum to 180°, inferring opposition from equality, or inferring adjacent supplementary structure from a shared vertex alone.',
    ],
    prompts: [
      ['哪两条边是反向射线？', 'Which arms are opposite rays?'],
      [
        '你从哪个相等总量减去了什么？',
        'What was subtracted from which equal totals?',
      ],
    ],
  },
  {
    title: ['平行线与角度关系', 'Parallel lines and angle relationships'],
    objective: [
      '核对平行条件与角对位置，使用性质或反向判定并识别条件不足。',
      'Check parallel premises and angle positions, apply properties or converses and recognise insufficient information.',
    ],
    prerequisites: ['J74-L02'],
    keywords: [
      ['同位角', 'corresponding angles'],
      ['内错角', 'alternate interior angles'],
      ['同旁内角', 'co-interior angles'],
    ],
    lab: 'plane-parallel',
    hook: [
      '图上两条线差不多平行，就能写 A=E 吗？如果只知道一对指定同位角相等，又能推出什么？',
      'Can nearly parallel-looking lines justify A=E? What follows if a specified corresponding pair is known equal?',
    ],
    items: [
      N(
        [
          '图中已知 ℓ∥m，A=65°，A/E 是同位角，求 E。',
          'Given ℓ∥m, A=65° and A/E correspond. Find E.',
        ],
        '65',
        [
          '有平行前提，同位角相等，所以 E=65°。',
          'With the parallel premise, corresponding angles are equal: E=65°.',
        ],
        ['115', '25'],
        { kind: 'plane-parallel', top: 65, bottom: 65, parallel: true },
      ),
      N(
        [
          '图中 ℓ∥m，A=65°。D/E 是同旁内角，求 D。',
          'Given ℓ∥m and A=65°, D/E are co-interior. Find D.',
        ],
        '115',
        [
          '先由同位得 E=65°，再由同旁内角互补得 D=115°。',
          'First E=65° by corresponding angles; then D=115° because co-interior angles are supplementary.',
        ],
        ['65', '180'],
        { kind: 'plane-parallel', top: 65, bottom: 65, parallel: true },
      ),
      C(
        [
          '只知 A=65°，没有平行条件，也未给下线方向度数。仅凭题设能确定 E 吗？写“无法确定”或所能确定的关系类别。',
          'Only A=65° is given, with no parallel premise or lower-line direction. Is E determined by the givens? Write “undetermined” if not.',
        ],
        'undetermined',
        [
          '保持 A 不变时下线可换不同方向，E 改变；外观不是附加条件。',
          'The lower line can change direction while A stays fixed, changing E. Appearance supplies no extra premise.',
        ],
        ['parallel', '65', '115'],
        { kind: 'plane-parallel', top: 65, bottom: 45, parallel: false },
      ),
      C(
        [
          '两直线被同一截线截得一对指定同位角，已知两角都 66°。可判两直线有什么关系？',
          'Two lines cut by one transversal have a specified corresponding pair, both 66°. What relation between the lines follows?',
        ],
        'parallel',
        [
          '这是同位角相等判平行的反向判定，不是先假定平行再用性质。',
          'This uses the corresponding-angle converse, rather than assuming parallelism first.',
        ],
        ['undetermined', 'right'],
      ),
      N(
        [
          '已知两平行线的同旁内角为 (2x+10)°、(3x−5)°，求 x。',
          'Co-interior angles on given parallel lines measure (2x+10)° and (3x−5)°. Find x.',
        ],
        '35',
        [
          '互补：2x+10+3x−5=180，5x=175，x=35；两角 80°、100°。',
          'Supplementarity gives 5x+5=180, x=35; the angles are 80° and 100°.',
        ],
        ['15', '175', '65'],
      ),
      N(
        [
          '已知两平行线的一对同位角为 (3x+5)° 和 (2x+25)°，求 x。',
          'A corresponding pair on given parallel lines measures (3x+5)° and (2x+25)°. Find x.',
        ],
        '20',
        [
          '相等：3x+5=2x+25，x=20，两角均 65°。',
          'Equality gives 3x+5=2x+25, x=20 and both angles 65°.',
        ],
        ['30', '65', '150'],
      ),
    ],
    pick: {
      stem: [
        '哪条推理的条件与结论匹配？',
        'Which argument correctly matches its premise and conclusion?',
      ],
      correct: 0,
      options: [
        [
          '已知平行，指定内错角相等',
          'Given parallel lines, the specified alternate interior angles are equal',
        ],
        [
          '两角都锐角，所以两线平行',
          'Both angles are acute, so the lines are parallel',
        ],
        [
          '线看起来平行，所以所有角都相等',
          'The lines look parallel, so all angles are equal',
        ],
      ],
      feedback: [
        [
          '有平行前提与明确位置。',
          'The parallel premise and angle positions are specified.',
        ],
        [
          '锐角范围太宽，不提供相等或互补的指定关系。',
          'Being acute is too broad and supplies no required pair relationship.',
        ],
        [
          '外观不作已知；即使平行也并非所有角相等。',
          'Appearance is not a given, and even parallel lines do not make all angles equal.',
        ],
      ],
      step: [
        '性质从平行出发；判定从指定角关系反推平行，方向不能混用。',
        'Properties start with parallelism; converses start with a specified angle relationship. Keep the directions distinct.',
      ],
    },
    reason: [
      '说明图中 ℓ∥m 时 A/E、C/E、D/E 各有什么关系；去掉平行条件后哪些结论不能直接用？再给一个有效判平行的反向论证。',
      'Explain the A/E, C/E and D/E relations when ℓ∥m. What fails without the premise? Give a valid converse argument for parallelism.',
    ],
    rubric: [
      '已知平行，A/E 同位相等，C/E 内错相等，D/E 同旁内角互补；角对位置必须与图中字母对应。若没有平行前提，不能直接断言跨交点这些关系；同一交点的对顶与邻补仍由直线结构成立。反向可用一对指定同位角相等来判平行，而不是把相等任意两角都当同位。禁止先假设平行再证明平行。家长核对条件、角位置和推理方向。',
      'With parallel lines, A/E correspond and are equal, C/E alternate inside and are equal, while D/E are co-interior and sum to 180°. Without the premise those cross-intersection conclusions are unavailable; vertically opposite and adjacent straight-angle relations at each intersection remain. A specified equal corresponding pair can establish parallelism. Arbitrary equal angles do not suffice. Do not assume the desired parallel conclusion. Check positions and direction of reasoning.',
    ],
    misconception: [
      '不看角位置；同旁内角也说相等；把外观当平行已知；循环论证。',
      'Ignoring positions, claiming co-interior equality, taking appearance as parallel evidence, or circular reasoning.',
    ],
    prompts: [
      [
        '平行是已知，还是你正要证明的结论？',
        'Is parallelism given, or is it the target conclusion?',
      ],
      [
        '这对角在截线的哪一侧、两线内部还是外部？',
        'Which sides of the transversal and lines contain these angles?',
      ],
    ],
  },
  {
    title: ['三角形内角和', 'Triangle angle sum'],
    objective: [
      '用平行辅助线解释内角和，区分内角与外角并求未知角。',
      'Explain the triangle sum using a parallel auxiliary line, distinguish interior/exterior angles and find unknowns.',
    ],
    prerequisites: ['J74-L03', 'P56-L03'],
    keywords: [
      ['内角和', 'interior angle sum'],
      ['辅助线', 'auxiliary line'],
      ['外角', 'exterior angle'],
    ],
    lab: 'plane-sum',
    hook: [
      '剪下三个角拼成直线很有说服力，但怎样给出不依赖剪纸精度的理由？',
      'Three cut-out corners seem to form a straight line. What explains this without depending on cutting precision?',
    ],
    items: [
      N(
        [
          '平面三角形 A=48°、B=67°，求内角 C。',
          'A plane triangle has A=48° and B=67°. Find interior C.',
        ],
        '65',
        [
          '三个内角和 180°，C=180°−48°−67°=65°。',
          'The interior sum is 180°: C=180°−48°−67°=65°.',
        ],
        ['115', '75'],
        { kind: 'plane-triangle', a: 48, b: 67 },
      ),
      N(
        [
          '一个直角三角形还有一个角 32°，求第三角。',
          'A right triangle has another angle 32°. Find the third angle.',
        ],
        '58',
        ['90°+32°+C=180°，C=58°。', '90°+32°+C=180°, so C=58°.'],
        ['148', '32'],
        { kind: 'plane-triangle', a: 90, b: 32 },
      ),
      N(
        [
          '等腰三角形顶角 38°，求每一个底角。',
          'An isosceles triangle has vertex angle 38°. Find each base angle.',
        ],
        '71',
        [
          '两个底角相等，共 180°−38°=142°，每个 71°。',
          'The equal base angles total 142°, so each is 71°.',
        ],
        ['142', '38', '76'],
      ),
      N(
        [
          '三角形一个外角 124°，与它不相邻的一个内角 49°，求另一个不相邻内角。',
          'A triangle exterior angle is 124°. One non-adjacent interior is 49°. Find the other non-adjacent interior.',
        ],
        '75',
        [
          '外角等于两个不相邻内角之和，124°=49°+x，x=75°；邻接内角另为 56°。',
          'The exterior equals the two remote interiors: 124°=49°+x, x=75°. The adjacent interior is separately 56°.',
        ],
        ['56', '173', '7'],
      ),
      N(
        [
          '三角形三个内角为 x°、2x°、3x°，求 x。',
          'A triangle has interior angles x°, 2x° and 3x°. Find x.',
        ],
        '30',
        [
          '6x=180，x=30；角分别 30°、60°、90°，正且和 180°。',
          '6x=180 gives x=30; angles 30°,60°,90° are positive and total 180°.',
        ],
        ['60', '90', '180'],
      ),
      N(
        [
          '三角形两个内角是 52.5° 和 67°，求第三角。',
          'Two interior angles are 52.5° and 67°. Find the third.',
        ],
        '60.5',
        [
          '180°−52.5°−67°=60.5°，三个都为内角。',
          '180°−52.5°−67°=60.5°, using only interior angles.',
        ],
        ['119.5', '61.5'],
        { kind: 'plane-triangle', a: 52.5, b: 67 },
      ),
    ],
    pick: {
      stem: [
        '哪个理由能把内角和猜想变成平面几何论证？',
        'Which supports a geometrical justification of the triangle sum?',
      ],
      correct: 2,
      options: [
        [
          '量过两个三角形，读数接近 180°',
          'Two measured triangles were near 180°',
        ],
        ['图画得像正三角形', 'The drawing looks equilateral'],
        [
          '过顶点作底边平行线，用内错角及平角',
          'Draw a parallel through a vertex and use alternate interior angles and a straight angle',
        ],
      ],
      feedback: [
        [
          '测量是证据与探索，不足以说明所有三角形。',
          'Measurement supports exploration but does not establish the universal result.',
        ],
        [
          '外观不能提供一般理由。',
          'Appearance does not supply a general reason.',
        ],
        [
          '已知与辅助线条件连接成不依赖测量的推理。',
          'The auxiliary premise connects to a reason independent of measurement.',
        ],
      ],
      step: [
        '平行线把另外两个内角转到顶点两侧，三角共同组成 180°。',
        'The parallel transfers the other two interior angles to the vertex, where all three form 180°.',
      ],
    },
    reason: [
      '解释过 C 作 AB 的平行线如何得到三角形内角和；再由内角和及平角推出外角定理。',
      'Explain how a parallel through C to AB yields the triangle sum, then derive the exterior-angle relation using the sum and a straight angle.',
    ],
    rubric: [
      '过 C 作 ℓ∥AB。由两组内错角相等，C 两侧的角分别等于 A、B，连同内角 C 构成平角，所以 A+B+C=180°。外角 E 与邻接内角 C 和为 180°，再与 A+B+C=180° 比较同减 C，E=A+B。需明确 E 是某边延长形成的外角，A、B 为不相邻内角；剪拼与量角只作探索。家长核对辅助线条件、角位置与相减链。',
      'Construct ℓ through C parallel to AB. Two alternate-interior equalities copy A and B beside C; the three form a straight angle, so A+B+C=180°. An exterior E formed by extending a side is supplementary to C. Compare E+C=180° with A+B+C=180° and subtract C: E=A+B. A and B are the non-adjacent interiors. Cutting and measurement support exploration, while the parallel relationships justify the result.',
    ],
    misconception: [
      '三个角含了一个外角；量图当普遍证明；等腰两个底角不分配。',
      'Including an exterior among the three interiors, treating measurement as proof, or failing to share the remaining angle sum between equal bases.',
    ],
    prompts: [
      [
        '辅助线为什么与底边平行？',
        'What establishes the auxiliary line is parallel to the base?',
      ],
      [
        '这个外角与哪个内角邻补，另外两个在哪里？',
        'Which interior is adjacent supplementary to the exterior, and where are the other two?',
      ],
    ],
  },
  {
    title: [
      '三角形分类与边的关系',
      'Classifying triangles and side relationships',
    ],
    objective: [
      '先判断能否成三角形，再按边或按角分类并保留包含关系。',
      'Test triangle existence before classifying by sides or angles, keeping inclusive relationships clear.',
    ],
    prerequisites: ['J74-L04', 'P56-L03'],
    keywords: [
      ['三角形不等式', 'triangle inequality'],
      ['等腰', 'isosceles'],
      ['按角分类', 'angle classification'],
    ],
    lab: 'plane-classify',
    hook: [
      '两根短杆加起来恰好等于最长杆，能围住一个三角形吗？等边是否也算等腰？',
      'Can rods close a triangle if the two shorter lengths exactly equal the longest? Is equilateral also isosceles?',
    ],
    items: [
      C(
        [
          '三角形内角 35°、55°、90°，按角属于哪类？',
          'A triangle has interior angles 35°,55°,90°. Classify it by angles.',
        ],
        'right',
        [
          '含一个 90°，为直角三角形；不能因还有锐角就叫锐角三角形。',
          'It has one right angle, so is right-angled; having some acute angles does not make it an acute triangle.',
        ],
        ['acute', 'obtuse'],
        { kind: 'plane-triangle', a: 35, b: 55 },
      ),
      C(
        [
          '三边 5、5、5 cm，按边写最具体名称。等腰按至少两边相等定义。',
          'Sides are 5,5,5 cm. Give the most specific side classification; isosceles means at least two equal sides.',
        ],
        'equilateral',
        [
          '三边全相等，最具体是等边；它也属于广义等腰，不因此把两类说成互斥。',
          'All three sides are equal, so equilateral is most specific. It also belongs to the inclusive isosceles class.',
        ],
        ['isosceles', 'scalene', 'impossible'],
      ),
      C(
        [
          '三边 5、5、8 cm，判断能成形后按边给最具体名称。',
          'Sides are 5,5,8 cm. Check existence and give the most specific side name.',
        ],
        'isosceles',
        [
          '5+5>8 且另外两组也满足，恰两边相等，为非等边的等腰三角形。',
          '5+5>8 and the other inequalities hold. Exactly two equal sides make it isosceles and not equilateral.',
        ],
        ['equilateral', 'scalene', 'impossible'],
      ),
      C(
        [
          '三段长 2、3、5 cm，能围成非退化三角形吗？不能请写“不能构成三角形”。',
          'Can segments 2,3,5 cm close a nondegenerate triangle? Write “impossible” if not.',
        ],
        'impossible',
        [
          '2+3=5，只能拉成共线退化形，必须严格大于才能围成三角形。',
          '2+3=5 gives a collinear degenerate arrangement; a strict inequality is needed.',
        ],
        ['scalene', 'isosceles', 'right'],
      ),
      N(
        [
          '两边长 3、5 cm，第三边是正整数厘米。求第三边最大可能值。',
          'Two sides are 3 and 5 cm. The third is a positive integer number of centimetres. Find its largest possible value.',
        ],
        '7',
        [
          '|5−3|<c<5+3，即 2<c<8，最大整数七；八会退化，二也不取。',
          'The strict interval is 2<c<8, so the largest integer is seven; neither endpoint is allowed.',
        ],
        ['8', '2', '6'],
        undefined,
        'cm',
      ),
      C(
        [
          '三角形内角 30°、40°、110°，按角分类。',
          'A triangle has angles 30°,40°,110°. Classify it by angles.',
        ],
        'obtuse',
        [
          '有一个大于 90° 的内角，为钝角三角形；两个锐角不能抵消这个分类。',
          'One angle exceeds 90°, making it obtuse; the two acute angles do not change that category.',
        ],
        ['acute', 'right'],
        { kind: 'plane-triangle', a: 30, b: 40 },
      ),
    ],
    pick: {
      stem: [
        '哪条分类说法正确？',
        'Which classification statement is correct?',
      ],
      correct: 1,
      options: [
        [
          '等腰与直角不能同时成立',
          'A triangle cannot be both isosceles and right',
        ],
        [
          '等边属于至少两边相等的等腰特殊情形',
          'Equilateral is a special isosceles case under the at-least-two definition',
        ],
        [
          '只要任意两边之和等于第三边也能成形',
          'Equality of a pair sum to the third still makes a triangle',
        ],
      ],
      feedback: [
        [
          '按边与按角是两条分类轴，45°、45°、90° 就同时成立。',
          'Side and angle categories are separate; 45°,45°,90° gives both.',
        ],
        [
          '三边相等当然至少有两边相等。',
          'Three equal sides necessarily include at least two equal sides.',
        ],
        [
          '等号是退化边界，需要严格大于。',
          'Equality is a degenerate boundary; strict inequality is required.',
        ],
      ],
      step: [
        '先存在，再分别按边与角分类；使用最具体名称不否认包含关系。',
        'First establish existence, then classify by sides and angles. A most specific name does not deny inclusion.',
      ],
    },
    reason: [
      '解释三边 2、3、5 为什么失败，3、4、5 为什么可成形；给出同时等腰与直角的角组，说明等边与等腰的包含关系。',
      'Explain why 2,3,5 fails and 3,4,5 closes. Give angles for an isosceles right triangle and explain equilateral/isosceles inclusion.',
    ],
    rubric: [
      '2+3=5 不能围成非退化三角形；3+4>5，且 3+5>4、4+5>3，所以可成形。判成形后才谈边分类；3、4、5 为不等边。45°、45°、90° 是等腰直角，按角与按边不冲突。采用至少两边相等定义时，等边属于等腰；问最具体名称时三边全等写等边，并非等腰说法数学上错误。固定两边 a、b，第三边严格在 |a−b| 与 a+b 之间，两个端点都不取。',
      '2+3=5 cannot enclose a nondegenerate triangle. For 3,4,5 all three pair sums exceed the remaining side, so it exists and is scalene. Angles 45°,45°,90° give an isosceles right triangle: angle and side axes do not conflict. With at least two equal sides as the definition, every equilateral is isosceles. A most-specific-name task asks for equilateral when all three match, without denying inclusion. The third side lies strictly between |a−b| and a+b.',
    ],
    misconception: [
      '只看两边相等不检查成形；不等式端点也取；把边分类和角分类互斥；否认等边是广义等腰。',
      'Skipping existence, including strict interval endpoints, making side/angle classes exclusive, or denying inclusive isosceles membership.',
    ],
    prompts: [
      [
        '最短两边够不够跨过最长边？等号会怎样？',
        'Do the shorter sides exceed the longest, and what happens at equality?',
      ],
      [
        '你是按边分类，还是按最大角分类？',
        'Are you classifying by sides or by the largest angle?',
      ],
    ],
  },
  {
    title: ['写清楚为什么', 'Writing geometrical reasons'],
    objective: [
      '把已知、关系、理由和结论连成可核查的几何论证，并发现条件缺口。',
      'Link givens, relationships, reasons and conclusions into a checkable argument and identify missing premises.',
    ],
    prerequisites: ['J74-L05', 'J73-L02'],
    keywords: [
      ['已知', 'given'],
      ['理由', 'reason'],
      ['结论', 'conclusion'],
    ],
    lab: 'plane-reasons',
    hook: [
      '“看起来一样”与“由某条关系可推出”差在哪里？一条正确角度数值是否等于一份证明？',
      'How does “looks the same” differ from a justified inference? Does a correct angle value constitute a proof?',
    ],
    items: [
      M(
        [
          '两直线相交，A/B、B/C 分别是邻补角。不直接引用对顶角定理，用两个平角推导 A=C。',
          'Two lines intersect; A/B and B/C are adjacent supplementary pairs. Derive A=C from two straight angles without citing the theorem being explained.',
        ],
        [
          '由反向射线得 A+B=180°、B+C=180°；所以 A+B=B+C，同减 B 得 A=C。需指出直线与角的位置来自已知，不能以看起来相等或直接重复待解释定理作为本条推导。家长检查每步所用条件与相减依据。',
          'Opposite rays give A+B=180° and B+C=180°. Therefore A+B=B+C; subtract the same B to obtain A=C. Identify the line structure from the givens; appearance or repetition of the target theorem does not supply this derivation. A parent checks each link.',
        ],
        { kind: 'plane-intersection', angle: 58 },
      ),
      N(
        [
          '平面三角形 A=47°、B=68°，求 C；下一道解释中还需说明所用依据。',
          'A plane triangle has A=47° and B=68°. Find C; the reasoning tasks also require the supporting reason.',
        ],
        '65',
        [
          '三角形内角和 180°，C=180−47−68=65°，需要明确是三个内角。',
          'Use the interior sum: C=180−47−68=65°, with all three identified as interiors.',
        ],
        ['115', '75'],
        { kind: 'plane-triangle', a: 47, b: 68 },
      ),
      M(
        [
          '已知 ℓ∥m，A/E 是同位角，E/F 在下交点是邻补角。若 A=62°，写出 F 的度数及每步理由。',
          'Given ℓ∥m, A/E correspond and E/F are adjacent supplementary at the lower intersection. A=62°. State F and justify each step.',
        ],
        [
          '由已知平行及同位位置，E=A=62°；由反向射线邻补，E+F=180°，故 F=118°。不能省去平行前提，也不能用对顶理由跨不同交点；家长核对两条关系各自来源。',
          'Given parallelism and corresponding positions give E=A=62°. Opposite rays at the lower intersection give E+F=180°, so F=118°. Retain the parallel premise and do not use vertically opposite reasoning across distinct intersections.',
        ],
        { kind: 'plane-parallel', top: 62, bottom: 62, parallel: true },
      ),
      M(
        [
          '有人说“图上两线差不多平行，所以同位角相等；同位角相等，所以证明两线平行”。找出缺口并修正。',
          'Someone argues: “The lines look parallel, so corresponding angles are equal; therefore the lines are parallel.” Find and repair the gap.',
        ],
        [
          '第一步把外观当已知并假设待证平行，是循环论证。应有独立给定或证明的一对指定同位角相等，再用判定推出平行；若只有图形外观和一个角数值，则条件不足，应承认无法确定。不能捏造数值或平行标记。',
          'The first step treats appearance as a premise and assumes the target, making the argument circular. Obtain an independently given or proved equal corresponding pair, then use the converse. With only appearance and one angle, information is insufficient; do not invent measures or marks.',
        ],
      ),
      N(
        [
          '已知平行线的一对同位角为 (2x+10)° 与 (3x−30)°，求 x，并说明等式来自哪里。',
          'A corresponding pair on given parallel lines measures (2x+10)° and (3x−30)°. Find x and name the source of the equation.',
        ],
        '40',
        [
          '由平行同位相等列 2x+10=3x−30，x=40；两角都 90°，且在合法角度范围内。',
          'Parallel corresponding equality gives 2x+10=3x−30, hence x=40. Both angles are 90°, in the permitted range.',
        ],
        ['20', '90'],
      ),
      M(
        [
          '不用量角器，写一条三角形内角和论证，再说明一个外角等于哪两个内角之和。',
          'Without a protractor, give a triangle-sum argument, then state which two interiors sum to an exterior angle.',
        ],
        [
          '过 C 作 AB 平行线，利用两组内错角把 A、B 放在 C 两旁，与内角 C 构成平角，得到 A+B+C=180°。外角 E 与 C 邻补，E+C=180°，相减得 E=A+B；是两个不相邻内角。必须说明辅助线的平行条件与位置，不能以量过几个三角形代替。家长核对所有推理链接。',
          'Construct a parallel to AB through C. Two alternate-interior equalities place A and B beside C, forming a straight angle with C; hence A+B+C=180°. An exterior E adjacent to C gives E+C=180°, so subtract C to obtain E=A+B, the two non-adjacent interiors. Explain the auxiliary premise and positions; measuring examples is not a substitute.',
        ],
      ),
    ],
    pick: {
      stem: ['哪条书写最完整？', 'Which written argument is complete?'],
      correct: 0,
      options: [
        [
          '已知 ℓ∥m 且 A/E 同位，所以 E=A=62°',
          'Given ℓ∥m and corresponding A/E, E=A=62°',
        ],
        ['E=62°，因为看起来如此', 'E=62° because it looks so'],
        [
          '要证平行，所以先设两线平行',
          'Assume parallelism because it is what we want to prove',
        ],
      ],
      feedback: [
        [
          '条件、位置、规则和结论相连。',
          'Premise, position, rule and conclusion are linked.',
        ],
        [
          '没有提供能保证结论的条件。',
          'No condition guarantees the conclusion.',
        ],
        [
          '这是预设待证结论的循环论证。',
          'This assumes the target conclusion and is circular.',
        ],
      ],
      step: [
        '每条等式需有适用的关系，正确数值只是一部分证据。',
        'Each equality needs an applicable relationship; a correct value is only part of the evidence.',
      ],
    },
    reason: [
      '给三边 3、4、8 的图标了“三角形”，又画一条看似平行线后套用角度公式。你应先检查哪些条件，怎样报告无法完成的推理？',
      'A picture labels sides 3,4,8 as a triangle, then adds a seemingly parallel line and applies angle rules. What should be checked first, and how should the failed reasoning be reported?',
    ],
    rubric: [
      '先检查存在性，3+4<8，不能围成非退化三角形，因此不能在这些条件下套三角形内角和。平行也要由已知、作图定义或独立判定建立，不能由外观补出。应指出原条件冲突或缺少条件，分别解释，不能凭空改长度、画一个假三角形或假设平行让计算凑成功。家长核对先验条件、规则适用范围和诚实结论。',
      'Check existence first: 3+4<8, so no nondegenerate triangle can have these sides; the triangle-sum rule cannot be applied under these conditions. Parallelism also requires a given, construction premise or independent converse, not appearance. Report conflicting or insufficient conditions with reasons. Do not change lengths, draw a false triangle or assume parallelism merely to finish a calculation.',
    ],
    misconception: [
      '只报答案没有条件和理由；把测量当证明；使用结论证明自己；对不可能图形继续计算。',
      'Reporting values without reasons, treating measurement as proof, circularity, or calculating within an impossible figure.',
    ],
    prompts: [
      ['这一行关系用了哪条已知？', 'Which given supports this relationship?'],
      [
        '如果删除这个条件，结论还一定成立吗？',
        'Would the conclusion necessarily hold if this premise were removed?',
      ],
    ],
  },
];
export const j74Lessons: Lesson[] = specs.map((s, i) => {
  const id = `J74-L0${i + 1}`;
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
    unit: 'J74',
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
    ...(i === 5
      ? {
          familyChallenge: t(
            '在纸上设计虚构的新西兰社区花园直线小径图，明确标出平行、相交和一个三角形；先检查给定边长能成形。写三条“已知→关系及理由→结论”，其中一条故意删掉必要条件，交家人找缺口。量图只用于检错，不当作证明；无需外出或真实施工。',
            'On paper, design a fictional New Zealand community-garden path diagram with explicit parallel/intersecting lines and one triangle. Check that the proposed sides can close. Write three givens–reason–conclusion chains and deliberately remove a necessary premise from one for a family member to find. Measurement checks errors without replacing proof; no visit or real construction is needed.',
          ),
        }
      : {}),
  };
});
export function j74ReviewQuestion(id: string, round: number): Question {
  if (
    !/^J74-L0[1-6]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid J74 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 80,
    a = 20 + (k % 61),
    b = 25 + (Math.floor(k / 5) % 41);
  let item: Item;
  if (i === 0) {
    const part = 10 + (k % 31);
    item = N(
      [
        `OC 在 ∠AOB 内部，两个相邻部分是 ${a}° 与 ${part}°，旋转整图后求 ∠AOB。`,
        `OC lies inside ∠AOB with adjacent parts ${a}° and ${part}°. Find ∠AOB after rotating the whole figure.`,
      ],
      String(a + part),
      [
        '相邻内部角相加，旋转保持夹角。',
        'Add the adjacent interior parts; rotation preserves the angle.',
      ],
      [String(a - part)],
    );
  } else if (i === 1)
    item = N(
      [
        `两直线相交，A=${a}°，求邻补 B。`,
        `Two lines intersect with A=${a}°. Find adjacent supplementary B.`,
      ],
      String(180 - a),
      ['反向射线给平角，B=180°−A。', 'Opposite rays give B=180°−A.'],
      [String(a)],
      { kind: 'plane-intersection', angle: a },
    );
  else if (i === 2 && k % 3 === 0)
    item = C(
      [
        `只知上交点 A=${a}°，没有平行或下线方向条件，能否确定下交点同位 E？`,
        `Only upper A=${a}° is given, with no parallel premise or lower direction. Is corresponding E determined?`,
      ],
      'undetermined',
      [
        '不同下线方向可得到不同 E，题设不足。',
        'Different lower directions give different E; the givens are insufficient.',
      ],
      [String(a), 'parallel'],
      { kind: 'plane-parallel', top: a, bottom: a + 10, parallel: false },
    );
  else if (i === 2)
    item = N(
      [
        `已知 ℓ∥m，同位角 A=${a}°，求 E。`,
        `Given ℓ∥m and corresponding A=${a}°, find E.`,
      ],
      String(a),
      [
        '由平行的同位角相等求 E。',
        'Use corresponding-angle equality from given parallelism.',
      ],
      [String(180 - a)],
      { kind: 'plane-parallel', top: a, bottom: a, parallel: true },
    );
  else if (i === 3)
    item = N(
      [
        `平面三角形内角 A=${a}°、B=${b}°，求 C。`,
        `A plane triangle has interior A=${a}° and B=${b}°. Find C.`,
      ],
      String(180 - a - b),
      [
        '三个内角和 180°，逐项减去已知角。',
        'Subtract both known angles from the 180° interior sum.',
      ],
      [String(a + b === 180 - a - b ? a + b + 1 : a + b)],
      { kind: 'plane-triangle', a, b },
    );
  else if (i === 4) {
    const small = 2 + (k % 7),
      other = small + 1,
      third = k % 2 === 0 ? small + other : small + other - 1;
    item = C(
      [
        `三边 ${small}、${other}、${third} cm。先判成形，再按边给最具体名称；不成形写“不能构成三角形”。`,
        `Sides are ${small},${other},${third} cm. Test existence, then give the most specific side name, or “impossible”.`,
      ],
      k % 2 === 0 ? 'impossible' : 'scalene',
      [
        `比较最短两边的和 ${small + other} 与最长边 ${third}；等号不能成形，严格大于且三边不等时为不等边。`,
        `Compare shorter-side sum ${small + other} with longest ${third}; equality fails, while a strict excess with unequal sides gives scalene.`,
      ],
      k % 2 === 0 ? ['scalene', 'isosceles'] : ['impossible', 'isosceles'],
    );
  } else
    item = M(
      [
        `已知 ℓ∥m，A/E 同位，E/F 邻补，A=${a}°。用“关系—理由”链解释 F，不能只报数。`,
        `Given ℓ∥m, corresponding A/E and adjacent supplementary E/F, with A=${a}°. Explain F in a relationship–reason chain, not just a number.`,
      ],
      [
        `平行同位得 E=A=${a}°，下交点反向射线得 E+F=180°，相减 F=${180 - a}°。须核对两个交点和角位置，不用外观或跨交点对顶；家长逐步检查，文字不自动评分。`,
        `Parallel corresponding equality gives E=A=${a}°. Opposite rays at the lower intersection give E+F=180°, hence F=${180 - a}°. Identify the positions and avoid appearance or opposite-angle reasoning across intersections. A parent checks the chain; prose is not automatically graded.`,
      ],
      { kind: 'plane-parallel', top: a, bottom: a, parallel: true },
    );
  return q(`${id}-R${round}`, i, item);
}
export const j74CheckQuestions: Question[] = [
  q(
    'J74-CHECK-Q1',
    0,
    C(
      [
        '从 A 出发经过 B 并无限继续的对象是什么？',
        'What starts at A, passes B and continues indefinitely?',
      ],
      'ray',
      [
        '一端点、一方向无限，为射线 AB。',
        'One endpoint and one indefinite direction define ray AB.',
      ],
      ['line', 'segment'],
      { kind: 'plane-object', object: 'ray' },
    ),
  ),
  q(
    'J74-CHECK-Q2',
    1,
    N(
      [
        '两直线相交，A=58°，求对顶 C。',
        'Two lines intersect with A=58°. Find opposite C.',
      ],
      '58',
      [
        '同一交点对顶相等，C=58°。',
        'Vertically opposite angles at the same intersection are equal: C=58°.',
      ],
      ['122', '32'],
      { kind: 'plane-intersection', angle: 58 },
    ),
  ),
  q(
    'J74-CHECK-Q3',
    2,
    C(
      [
        '只给上交点 A=72°，无平行或其他跨交点条件。下交点同位角 E 可确定吗？',
        'Only upper A=72° is given, with no parallel or other cross-intersection premise. Is corresponding E determined?',
      ],
      'undetermined',
      [
        '可改变下线方向而保持 A，不能只从图形外观推角度。',
        'The lower direction can vary while A stays fixed; appearance cannot determine E.',
      ],
      ['72', 'parallel'],
      { kind: 'plane-parallel', top: 72, bottom: 52, parallel: false },
    ),
  ),
  q(
    'J74-CHECK-Q4',
    3,
    N(
      [
        '三角形内角 46°、59°，求第三角。',
        'A triangle has interior angles 46° and 59°. Find the third.',
      ],
      '75',
      ['180°−46°−59°=75°。', '180°−46°−59°=75°.'],
      ['105', '15'],
      { kind: 'plane-triangle', a: 46, b: 59 },
    ),
  ),
  q(
    'J74-CHECK-Q5',
    4,
    C(
      [
        '三角形内角 20°、50°、110°，按角分类。',
        'Classify a triangle with angles 20°,50°,110° by angles.',
      ],
      'obtuse',
      [
        '最大角 110°>90°，为钝角三角形。',
        'The largest angle is 110°>90°, so the triangle is obtuse.',
      ],
      ['acute', 'right'],
      { kind: 'plane-triangle', a: 20, b: 50 },
    ),
  ),
  q(
    'J74-CHECK-Q6',
    4,
    N(
      [
        '两边 4、9 cm，第三边为正整数厘米。求第三边最小可能值。',
        'Two sides are 4 and 9 cm. Find the smallest positive integer third side in centimetres.',
      ],
      '6',
      [
        '|9−4|<c<13，即 5<c<13，最小整数六，五不能取。',
        'The strict interval is 5<c<13, so the smallest integer is six; five is excluded.',
      ],
      ['5', '13'],
      undefined,
      'cm',
    ),
  ),
  pick('J74-CHECK-Q7', 5, specs[5]!.pick),
  reasoning(
    'J74-CHECK-Q8',
    t(
      '写两条有已知、关系、理由、结论的论证：一条有关相交或平行线，另一条有关三角形；再指出一个删掉后会使结论无依据的条件。',
      'Write two linked arguments, one about intersecting/parallel lines and one about a triangle. Give premises, relationships, reasons and conclusions, and identify a premise whose removal would invalidate an inference.',
    ),
    skills[5]!,
    t(
      '可用邻补两式同减证明对顶，或给定平行同位得角；三角形可过顶点作平行线论证内角和，或先引已学定理求第三角再说明来源。每步要有适用条件、具体角的位置及等式；若给边长先查严格不等式。删除平行时不能套跨交点等角，删除反向射线时不能随意补成 180°。数值恰对或外观吻合不替代理由，家长核对整条推理。',
      'Use two adjacent straight-angle equations and subtraction for opposite equality, or given parallelism for a corresponding pair. A triangle argument can construct a parallel through a vertex to justify the sum, or cite the established theorem while finding a third angle. Every inference needs its conditions, positions and equation. Check strict side inequalities if lengths are supplied. Without parallelism cross-intersection equality is unsupported; without opposite rays an arbitrary adjacent pair need not sum to 180°. A parent checks the full reasoning.',
    ),
    hints[5]!.map(T),
  ),
];
