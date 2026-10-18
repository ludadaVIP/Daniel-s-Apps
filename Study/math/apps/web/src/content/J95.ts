import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import { textR, rational } from '../algebraModels';
import { exactRootText } from '../pythagoreanModels';
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
  'circle-chord-contact',
  'circle-intercepted-arc',
  'circle-tangent-premises',
  'circle-sector-fraction',
  'circle-proof-dependency',
];
const hints: Pair[][] = [
  [
    [
      '先分清整条直线、两端点之间的弦和经过圆心的直径。',
      'Distinguish the infinite line, its chord segment and a diameter through the centre.',
    ],
    [
      '圆心距要垂直，与r比较；等半径给等腰，半弦可用勾股。',
      'Compare perpendicular centre distance with r; equal radii give isosceles structure and a half-chord can use Pythagoras.',
    ],
  ],
  [
    [
      '顶点在同一圆上吗？选AB之间不含顶点的那条弧。',
      'Is the vertex on the same circle? Select arc AB excluding that vertex.',
    ],
    [
      '圆周角是这条弧度数的一半；异侧换弧，直径给90°。',
      'The angle is half that arc measure; changing sides changes arcs, while a diameter gives 90°.',
    ],
  ],
  [
    [
      '切点的半径与切线垂直，OP是斜边。',
      'The contact radius is perpendicular to its tangent; OP is the hypotenuse.',
    ],
    [
      'PT²=OP²−r²，长度取正根；两切线相等须同外点同圆。',
      'PT²=OP²−r² and lengths use positive roots; equal tangents need one external point and one circle.',
    ],
  ],
  [
    [
      '先写选定角度占整圈θ/360，分清长度与面积。',
      'Write the selected fraction θ/360 and distinguish length from area.',
    ],
    [
      '弧用2πr，扇形用πr²；完整边界另数直线半径，保留单位与π。',
      'Use 2πr for arc and πr² for sector; count straight radii separately for a full boundary and retain units and π.',
    ],
  ],
  [
    [
      '先列同圆、直径、垂线等明确前提，不从外观补条件。',
      'List common-circle, diameter and perpendicular premises without adding appearance-based conditions.',
    ],
    [
      '先角→AA相似→对应边比例→正长度；指出每一步依赖。',
      'Angles first, then AA, corresponding proportions and positive length; identify every dependency.',
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
  const value =
    v.answer.kind === 'pi-multiple'
      ? `${v.answer.coefficient}π`
      : v.answer.value;
  return {
    ...numeric(
      id,
      T(v.stem),
      value,
      skills[i]!,
      hints[i]!.map(T),
      v.steps.map(T),
      { accepted: [value], rejected: v.wrong },
      v.diagram,
    ),
    answer: v.answer,
  };
}
const specs: Spec[] = [
  {
    title: ['弦、切线、圆心角', 'Chords, tangents and central angles'],
    lab: 'cyclic-elements',
    objective: [
      '由圆心垂距识别直线交点关系，并用同圆半径解释圆心角的等腰结构。',
      'Use perpendicular centre distance to classify line intersections and equal radii to explain central-angle isosceles structure.',
    ],
    prerequisites: ['P66-L01', 'J86-L04', 'J87-L04'],
    keywords: [
      ['弦', 'chord'],
      ['切线', 'tangent'],
      ['圆心角', 'central angle'],
    ],
    hook: [
      '直线靠近圆心时，交点会从零变成几个？',
      'As a line moves towards the centre, how does its number of intersections change?',
    ],
    items: [
      {
        stem: [
          '圆半径5 cm，整直线到圆心的垂距3 cm。分类为割线、切线或不相交。',
          'A circle has radius 5 cm and perpendicular line-to-centre distance 3 cm. Classify the infinite line as secant, tangent or disjoint.',
        ],
        answer: {
          kind: 'circle-line',
          value: 'secant',
        },
        steps: [
          [
            '3<5，整直线与圆有两个公共点，是割线；两交点之间是弦。',
            'Since 3<5, the infinite line has two intersections and is a secant; the segment between them is a chord.',
          ],
        ],
        wrong: ['tangent', 'disjoint'],
      },
      {
        stem: [
          '半径5 cm，经过圆心的弦长多少？',
          'For radius 5 cm, find the length of a chord through the centre.',
        ],
        answer: {
          kind: 'number',
          value: '10',
          unit: 'cm',
        },
        steps: [
          [
            '经过圆心的弦是直径，长2r=10 cm。',
            'A chord through the centre is a diameter, of length 2r=10 cm.',
          ],
        ],
        wrong: ['5', '25'],
      },
      {
        stem: [
          '同圆OA=OB，∠AOB=120°，求△OAB的一个底角。',
          'OA and OB are radii of one circle and AOB=120°. Find one base angle of triangle OAB.',
        ],
        answer: {
          kind: 'number',
          value: '30',
          unit: '°',
        },
        steps: [
          [
            '等半径给等底角，每个(180−120)/2=30°。',
            'Equal radii give equal base angles, each (180−120)/2=30°.',
          ],
        ],
        wrong: ['60', '120'],
      },
      {
        stem: [
          '圆半径5 cm，圆心垂距OM=3 cm，M在弦AB上且OM⊥AB。求AB的精确长度数值。',
          'Radius is 5 cm; perpendicular OM=3 cm meets chord AB at M. Find the exact length of AB without units.',
        ],
        answer: {
          kind: 'root-length',
          value: '8',
          square: '64',
        },
        steps: [
          [
            '圆心垂线平分弦，AM²=25−9=16，AM=4，AB=8 cm。',
            'The centre perpendicular bisects the chord. AM²=25−9=16 gives AM=4 and AB=8 cm.',
          ],
        ],
        wrong: ['4', '16', '√16'],
      },
      {
        stem: [
          '圆半径5 cm，整直线到圆心的垂距也为5 cm。是哪类直线？',
          'Both circle radius and perpendicular line-to-centre distance are 5 cm. Classify the line.',
        ],
        answer: {
          kind: 'circle-line',
          value: 'tangent',
        },
        steps: [
          [
            '垂距等于半径，唯一公共点在垂足，此线是切线。',
            'Distance equals radius, giving one common point at the perpendicular foot: the line is tangent.',
          ],
        ],
        wrong: ['secant', 'disjoint'],
      },
      {
        stem: [
          '圆半径5 cm，整直线到圆心的垂距6 cm。分类。',
          'A circle has radius 5 cm and perpendicular line-to-centre distance 6 cm. Classify the line.',
        ],
        answer: {
          kind: 'circle-line',
          value: 'disjoint',
        },
        steps: [
          [
            '6>5，无公共点；最近的点也不在圆上，不能叫切点。',
            'Since 6>5 there is no intersection; even the nearest point is off the circle and is not a contact.',
          ],
        ],
        wrong: ['tangent', 'secant'],
      },
    ],
    pick: {
      stem: ['哪个说法一定正确？', 'Which statement is always correct?'],
      options: [
        ['每条弦都是直径', 'Every chord is a diameter'],
        ['直径是经过圆心的弦', 'A diameter is a chord through the centre'],
        [
          '图上只看到一个交点的线段就是切线',
          'A segment showing one intersection must be tangent',
        ],
      ],
      feedback: [
        [
          '普通弦可以不经过圆心。',
          'An ordinary chord need not pass through the centre.',
        ],
        [
          '直径的两端在圆上且包含圆心。',
          'Its endpoints lie on the circle and the segment contains the centre.',
        ],
        [
          '切线定义针对整条直线，有限线段可能只显示割线的一个交点。',
          'Tangency concerns the infinite line; a finite segment may hide the other secant intersection.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '说明为什么圆心到弦的垂线平分弦，别只引用图像对称。',
      'Explain why the perpendicular from the centre bisects a chord, without relying only on appearance.',
    ],
    rubric: [
      '设M为垂足且弦不经过O，△OMA和△OMB都是直角三角形，共用OM，斜边OA=OB为半径，可用斜边直角边全等得AM=MB。若弦过O，O本身是直径中点，单独处理零垂距，不把OM=0画成非退化三角形。',
      'For nonzero distance, right triangles OMA and OMB share OM and have equal hypotenuses OA=OB, so hypotenuse-leg congruence gives AM=MB. A chord through O is a diameter with midpoint O; treat zero distance separately rather than drawing a nondegenerate triangle with OM=0.',
    ],
    misconception: [
      '切线说整条直线且只有一个公共点；圆心距必须是垂直距离，直径也是弦。',
      'Tangency concerns the infinite line and exactly one intersection; centre distance is perpendicular, and a diameter is also a chord.',
    ],
    prompts: [
      [
        '先指出哪些条件明确给出，再选择定理。',
        'Identify the supplied premises before choosing a theorem.',
      ],
      [
        '所求是角、长度还是面积？弧是否含圆周角顶点？',
        'Is the requested quantity an angle, length or area? Does the arc exclude the inscribed-angle vertex?',
      ],
    ],
  },
  {
    title: ['圆周角与圆心角关系', 'Inscribed angles and central angles'],
    lab: 'cyclic-inscribed',
    objective: [
      '以不含顶点的截弧求圆周角，区分同侧等角、异侧互补与直径角。',
      'Find inscribed angles from arcs excluding the vertex, distinguishing same-side equality, opposite-side supplementation and diameter angles.',
    ],
    prerequisites: ['J95-L01', 'J74-L04'],
    keywords: [
      ['圆周角', 'inscribed angle'],
      ['所对弧', 'intercepted arc'],
      ['同弦两侧', 'opposite sides of a chord'],
    ],
    hook: [
      '从弦的另一侧看过去，角还是原来的一半吗？',
      'Does moving to the other side of a chord leave the viewing angle unchanged?',
    ],
    items: [
      {
        stem: [
          'A、B、P同圆，不含P的弧AB为80°。求∠APB。',
          'A, B and P lie on one circle. Arc AB excluding P measures 80°. Find APB.',
        ],
        answer: {
          kind: 'number',
          value: '40',
          unit: '°',
        },
        steps: [
          [
            '圆周角等于不含其顶点的所截弧的一半，80/2=40°。',
            'An inscribed angle is half the arc excluding its vertex: 80/2=40°.',
          ],
        ],
        wrong: ['80', '160'],
        diagram: {
          kind: 'cyclic-inscribed',
          sweep: 80,
        },
      },
      {
        stem: [
          '选定小弧AB为80°，P位于这条小弧内部。求∠APB。',
          'Selected minor arc AB is 80° and P lies inside that minor arc. Find APB.',
        ],
        answer: {
          kind: 'number',
          value: '140',
          unit: '°',
        },
        steps: [
          [
            '应取不含P的大弧360−80=280°，角为140°。',
            'Use the major arc excluding P, 360−80=280°, giving 140°.',
          ],
        ],
        wrong: ['40', '80'],
        diagram: {
          kind: 'cyclic-inscribed',
          sweep: 80,
          side: 'selected',
        },
      },
      {
        stem: [
          'AB是直径，P在圆上且不同于A、B。求∠APB。',
          'AB is a diameter and P is on the circle, distinct from A and B. Find APB.',
        ],
        answer: {
          kind: 'number',
          value: '90',
          unit: '°',
        },
        steps: [
          [
            '不含P的半圆弧180°，圆周角90°。',
            'The semicircular intercepted arc is 180°, so its inscribed angle is 90°.',
          ],
        ],
        wrong: ['180', '45'],
      },
      {
        stem: [
          'A、B、C、D依次同圆，内角A=70°。求对角C。',
          'A, B, C and D lie in order on one circle, and interior angle A=70°. Find opposite angle C.',
        ],
        answer: {
          kind: 'number',
          value: '110',
          unit: '°',
        },
        steps: [
          [
            '两个对角所截弧合成360°，角和180°，C=180−70=110°。',
            'Opposite intercepted arcs partition 360°, giving angle sum 180° and C=110°.',
          ],
        ],
        wrong: ['70', '140'],
      },
      {
        stem: [
          '只给AB是圆直径，未给P在圆上，就足以保证∠APB=90°吗？',
          'Only AB being a circle diameter is given; P is not stated to lie on the circle. Is that sufficient to guarantee APB=90°?',
        ],
        answer: {
          kind: 'proof-verdict',
          value: 'insufficient',
        },
        steps: [
          [
            'P可在圆内或圆外，直径角定理还需要P在圆上且不是端点。',
            'P may be inside or outside; the diameter-angle theorem also requires P on the circle and distinct from endpoints.',
          ],
        ],
        wrong: ['sufficient', 'congruent'],
      },
      {
        stem: [
          '选A=0°、B=80°、P=220°的位置，连OP，用等腰三角形解释圆周角40°。',
          'At circle positions A=0°, B=80° and P=220°, join OP and use isosceles triangles to explain the 40° angle.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: '小圆心角AOP、BOP均140°，OA=OP=OB，△AOP和△BOP在P的底角各(180−140)/2=20°。此布局OP在∠APB内部，所以20+20=40°。其他布局可能需两角相减，始终选择不含P的弧；不是任意小圆心角都直接折半。',
            en: 'Minor central angles AOP and BOP are each 140°. Equal radii make the two base angles at P each (180−140)/2=20°. Here OP lies inside APB, so 20+20=40°. Other layouts may use a difference; always select the arc excluding P rather than indiscriminately halving the smaller central angle.',
          },
        },
        steps: [
          [
            '小圆心角AOP、BOP均140°，OA=OP=OB，△AOP和△BOP在P的底角各(180−140)/2=20°。此布局OP在∠APB内部，所以20+20=40°。其他布局可能需两角相减，始终选择不含P的弧；不是任意小圆心角都直接折半。',
            'Minor central angles AOP and BOP are each 140°. Equal radii make the two base angles at P each (180−140)/2=20°. Here OP lies inside APB, so 20+20=40°. Other layouts may use a difference; always select the arc excluding P rather than indiscriminately halving the smaller central angle.',
          ],
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: [
        '同一弦两侧的圆周角，一般是什么关系？',
        'What generally relates inscribed angles on opposite sides of the same chord?',
      ],
      options: [
        ['相等', 'Equal'],
        ['互补，和为180°', 'Supplementary, summing to 180°'],
        ['和为90°', 'Summing to 90°'],
      ],
      feedback: [
        [
          '只有直径等特殊情形两侧都90°；通常不是相等。',
          'Both are 90° for a diameter, but generally they are not equal.',
        ],
        [
          '两条不含各自顶点的弧合成整圆，各取一半。',
          'The intercepted arcs excluding the respective vertices partition a full circle; halve each.',
        ],
        [
          '半圆给单个直角，不给这对角总和90°。',
          'A semicircle gives a single right angle, not a pair summing to 90°.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '解释同弦同侧等角与同弦异侧互补，并给80°小弧的数值核验。',
      'Explain same-side equality and opposite-side supplementation for one chord, using an 80° minor arc.',
    ],
    rubric: [
      '同侧的不同圆上顶点截同一条不含顶点的弧，角均为该弧一半。同弦异侧分别截80°和280°，给40°与140°，和180°；图形旋转不改同侧或弧身份。顶点必须在圆上且不等于端点。',
      'Different on-circle vertices on the same side intercept the same arc and hence equal half-angles. On opposite sides they intercept 80° and 280°, giving 40° and 140°, summing to 180°. Rotation preserves side and arc identity. Vertices must lie on the circle and differ from the endpoints.',
    ],
    misconception: [
      '圆周角折半的是不含顶点的所截弧；小弧对应的角不一定是当前角。',
      'Halve the intercepted arc that excludes the vertex; the minor arc need not be the relevant one.',
    ],
    prompts: [
      [
        '先指出哪些条件明确给出，再选择定理。',
        'Identify the supplied premises before choosing a theorem.',
      ],
      [
        '所求是角、长度还是面积？弧是否含圆周角顶点？',
        'Is the requested quantity an angle, length or area? Does the arc exclude the inscribed-angle vertex?',
      ],
    ],
  },
  {
    title: ['切线性质', 'Tangent properties'],
    lab: 'cyclic-tangents',
    objective: [
      '从切点半径垂直推导切线段长度、两切线相等及夹角，并审查相切前提。',
      'Use the contact-radius perpendicular to derive tangent lengths, equality and angles, auditing the tangency premise.',
    ],
    prerequisites: ['J95-L02', 'J87-L04'],
    keywords: [
      ['切点', 'point of contact'],
      ['两切线段', 'two tangent segments'],
      ['半径垂直', 'perpendicular radius'],
    ],
    hook: [
      '从同一圆外点引出的两条切线段，为什么一样长？',
      'Why are two tangent segments from one external point equal?',
    ],
    items: [
      {
        stem: [
          'PT在T处与圆相切，半径OT=3、OP=5 cm。求PT精确长度数值。',
          'PT is tangent at T, with radius OT=3 and OP=5 cm. Find exact PT without units.',
        ],
        answer: {
          kind: 'root-length',
          value: '4',
          square: '16',
        },
        steps: [
          [
            'OT⊥PT，PT²=OP²−OT²=25−9=16，正长度4 cm。',
            'OT⊥PT, so PT²=OP²−OT²=25−9=16 and positive length PT=4 cm.',
          ],
        ],
        wrong: ['-4', '√34', '5'],
        diagram: {
          kind: 'cyclic-tangents',
          radius: 3,
          distance: 5,
        },
      },
      {
        stem: [
          '同样相切，OT=5、OP=13 cm。求PT。',
          'Under the same tangency, OT=5 and OP=13 cm. Find exact PT without units.',
        ],
        answer: {
          kind: 'root-length',
          value: '12',
          square: '144',
        },
        steps: [
          [
            'PT²=169−25=144，取正根12。',
            'PT²=169−25=144; take positive root twelve.',
          ],
        ],
        wrong: ['13', '√194', '-12'],
      },
      {
        stem: [
          '同样相切，OT=5、OP=7 cm。求PT精确长度。',
          'Under the same tangency, OT=5 and OP=7 cm. Find exact PT without units.',
        ],
        answer: {
          kind: 'root-length',
          value: '2√6',
          square: '24',
        },
        steps: [
          [
            'PT²=49−25=24，PT=√24=2√6 cm，不能以4.90代替精确值。',
            'PT²=49−25=24, so PT=√24=2√6 cm; 4.90 is only approximate.',
          ],
        ],
        wrong: ['24', '-2√6', '4.90'],
      },
      {
        stem: [
          '同一外点P向同一圆引PT、PS两切线，PT=8 cm。求PS。',
          'PT and PS are tangents from the same external P to the same circle. PT=8 cm. Find PS.',
        ],
        answer: {
          kind: 'number',
          value: '8',
          unit: 'cm',
        },
        steps: [
          [
            '两直角三角形共有斜边OP，且OT=OS为半径，全等得PT=PS=8。',
            'The right triangles share hypotenuse OP and equal radii OT=OS, so congruence gives PT=PS=8.',
          ],
        ],
        wrong: ['16', '4'],
      },
      {
        stem: [
          'PT、PS是两切线，小圆心角TOS=100°。求∠TPS。',
          'PT and PS are tangents and minor central angle TOS=100°. Find TPS.',
        ],
        answer: {
          kind: 'number',
          value: '80',
          unit: '°',
        },
        steps: [
          [
            'OTPS两切点各90°，内角和360°，P角=180−100=80°。',
            'Quadrilateral OTPS has two right contact angles; its sum 360° gives P=180−100=80°.',
          ],
        ],
        wrong: ['100', '50'],
      },
      {
        stem: [
          '“一条线垂直某条半径，所以它一定是切线。”补出缺失条件，并解释为什么需要。',
          'Complete the missing condition in “a line perpendicular to a radius must be tangent”, explaining why it matters.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: '必须在该半径的圆上端点T处垂直，并且整线经过T。否则过圆心的垂线可为割线，离端点更远可不相交。正确条件下圆心到线的垂距等于r，恰一个交点，故切线；不能只凭任意垂直。',
            en: 'The line must pass through the on-circle endpoint T of that radius and be perpendicular there. A perpendicular through the centre can instead be secant; one farther away can be disjoint. At the radius endpoint the centre-to-line perpendicular distance equals r, giving exactly one intersection and hence tangency.',
          },
        },
        steps: [
          [
            '必须在该半径的圆上端点T处垂直，并且整线经过T。否则过圆心的垂线可为割线，离端点更远可不相交。正确条件下圆心到线的垂距等于r，恰一个交点，故切线；不能只凭任意垂直。',
            'The line must pass through the on-circle endpoint T of that radius and be perpendicular there. A perpendicular through the centre can instead be secant; one farther away can be disjoint. At the radius endpoint the centre-to-line perpendicular distance equals r, giving exactly one intersection and hence tangency.',
          ],
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: [
        '求切线段PT，哪个直角三角形关系正确？',
        'Which right-triangle relationship finds tangent PT?',
      ],
      options: [
        ['PT²=OP²+OT²', 'PT²=OP²+OT²'],
        ['PT²=OP²−OT²', 'PT²=OP²−OT²'],
        ['PT=OP−OT', 'PT=OP−OT'],
      ],
      feedback: [
        ['OP是斜边，不是PT。', 'OP is the hypotenuse, not PT.'],
        [
          '切点给直角，OP²=OT²+PT²。',
          'Tangency gives a right angle, so OP²=OT²+PT².',
        ],
        [
          '边长不作普通减法，先比较平方。',
          'Subtract squared lengths, not ordinary lengths.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '证明同外点同圆两切线段相等，并指出不能删掉哪些条件。',
      'Prove equality of two tangent segments and identify indispensable premises.',
    ],
    rubric: [
      'P在圆外、T/S为同圆的切点，OT⊥PT、OS⊥PS；△OTP、△OSP直角且共有斜边OP，OT=OS，同斜边一直角边全等，PT=PS。若不同外点、不同圆或未给相切，不能直接套此结论；P在圆上也不是两条不同切线。',
      'P is external and T/S are contacts on the same circle. OT⊥PT and OS⊥PS; right triangles OTP and OSP share hypotenuse OP and equal radii, so hypotenuse-leg congruence gives PT=PS. Different external points, different circles or missing tangency do not supply this theorem; an on-circle P does not give two distinct tangents.',
    ],
    misconception: [
      '半径垂直发生在切点；OP是到圆心的外点距离，不是半径，长度取正根。',
      'The perpendicular is at the contact; OP is an external-point-to-centre distance, not a radius, and lengths use the positive root.',
    ],
    prompts: [
      [
        '先指出哪些条件明确给出，再选择定理。',
        'Identify the supplied premises before choosing a theorem.',
      ],
      [
        '所求是角、长度还是面积？弧是否含圆周角顶点？',
        'Is the requested quantity an angle, length or area? Does the arc exclude the inscribed-angle vertex?',
      ],
    ],
  },
  {
    title: ['弧长与扇形面积', 'Arc length and sector area'],
    lab: 'cyclic-sector',
    objective: [
      '按选定扫角占整圆的份额求精确弧长和扇形面积，区分曲边与完整边界。',
      'Use the selected fraction of a turn to find exact arc length and sector area, distinguishing the curved edge from the complete boundary.',
    ],
    prerequisites: ['J95-L01', 'P66-L03', 'P66-L04'],
    keywords: [
      ['弧长', 'arc length'],
      ['扇形面积', 'sector area'],
      ['扫角', 'selected sweep'],
    ],
    hook: [
      '同一对端点之间，小弧与大弧的长度和面积各怎样算？',
      'How do length and area differ between the minor and major sweeps with the same endpoints?',
    ],
    items: [
      {
        stem: [
          '扇形r=6 cm，选定圆心扫角60°。求弧长，保留π。',
          'A sector has r=6 cm and selected central sweep 60°. Find its arc length, retaining π.',
        ],
        answer: {
          kind: 'pi-multiple',
          coefficient: '2',
          value: '2π',
          unit: 'cm',
        },
        steps: [
          [
            '份额60/360=1/6，弧长=(1/6)×12π=2π cm。',
            'The fraction is 60/360=1/6, so arc length=(1/6)×12π=2π cm.',
          ],
        ],
        wrong: ['6π', '12π', '2'],
        diagram: {
          kind: 'cyclic-sector',
          radius: 6,
          sweep: 60,
        },
      },
      {
        stem: [
          '同一r=6、60°扇形，求面积，保留π。',
          'For the same r=6 and 60° sector, find its area, retaining π.',
        ],
        answer: {
          kind: 'pi-multiple',
          coefficient: '6',
          value: '6π',
          unit: 'cm²',
        },
        steps: [
          [
            '面积=(60/360)×36π=6π cm²，不是弧长的2π。',
            'Area=(60/360)×36π=6π cm², distinct from arc length 2π.',
          ],
        ],
        wrong: ['2π', '36π', '6π cm'],
      },
      {
        stem: [
          'r=6 cm，选定大弧扫角300°，求大弧长度。',
          'For r=6 cm and selected major sweep 300°, find the major arc length.',
        ],
        answer: {
          kind: 'pi-multiple',
          coefficient: '10',
          value: '10π',
          unit: 'cm',
        },
        steps: [
          [
            '用300/360=5/6，弧长=(5/6)×12π=10π cm。',
            'Use 300/360=5/6, giving arc length (5/6)×12π=10π cm.',
          ],
        ],
        wrong: ['2π', '60π'],
        diagram: {
          kind: 'cyclic-sector',
          radius: 6,
          sweep: 300,
        },
      },
      {
        stem: [
          'r=6 cm，选定300°大扇形，求面积。',
          'For r=6 cm and the selected 300° major sector, find its area.',
        ],
        answer: {
          kind: 'pi-multiple',
          coefficient: '30',
          value: '30π',
          unit: 'cm²',
        },
        steps: [
          [
            '面积=(5/6)×36π=30π cm²；不能自动改用较小60°。',
            'Area=(5/6)×36π=30π cm²; do not automatically replace the sweep by 60°.',
          ],
        ],
        wrong: ['6π', '10π'],
      },
      {
        stem: [
          '同角度扇形半径扩大2倍，面积倍率是多少？',
          'At a fixed sweep, a sector radius doubles. What is the area factor?',
        ],
        answer: {
          kind: 'number',
          value: '4',
        },
        steps: [
          [
            '角份额不变，半径平方使面积乘2²=4；弧长只乘2。',
            'The turn fraction stays fixed; radius squared makes area scale by 2²=4, while arc length only doubles.',
          ],
        ],
        wrong: ['2', '8'],
      },
      {
        stem: [
          '半径6 cm的选定弧长3π cm，求其扫角θ。',
          'For radius 6 cm, a selected arc has length 3π cm. Find its sweep θ.',
        ],
        answer: {
          kind: 'number',
          value: '90',
          unit: '°',
        },
        steps: [
          [
            '3π/(12π)=1/4圈，θ=360/4=90°。',
            'The fraction 3π/(12π)=1/4 of a turn gives θ=90°.',
          ],
        ],
        wrong: ['180', '45'],
      },
    ],
    pick: {
      stem: [
        'r=6、60°扇形的完整周长是哪一个？',
        'Which is the complete perimeter of the r=6, 60° sector?',
      ],
      options: [
        ['2π cm', '2π cm'],
        ['(12+2π) cm', '(12+2π) cm'],
        ['6π cm²', '6π cm²'],
      ],
      feedback: [
        [
          '2π只有弧，不含两条半径。',
          '2π counts only the arc, omitting the two radii.',
        ],
        [
          '弧2π加两半径12，量纲都是长度。',
          'Add arc 2π and two radii twelve, all lengths.',
        ],
        ['6π cm²是面积，不能当周长。', '6π cm² is area, not perimeter.'],
      ],
      correct: 1,
    },
    reason: [
      '用整圆份额解释两公式，并区分弧、弦、扇形和弓形。',
      'Explain both formulas by a full-turn fraction, distinguishing arc, chord, sector and circular segment.',
    ],
    rubric: [
      'θ/360乘整圆周长2πr得弧长，乘整圆面积πr²得扇形面积。弦是端点间直线，弓形由弦与弧围成，非由两半径与弧围成的扇形。0<θ<360时完整扇形周长=l+2r；整圆θ=360时半径是内部接缝，不再把2r加到外周界。',
      'Multiply full circumference 2πr by θ/360 for arc length, and full area πr² for sector area. A chord is the straight endpoint segment; a circular segment is bounded by chord and arc, unlike a sector bounded by two radii and arc. For 0<θ<360 the complete perimeter is l+2r; at θ=360 the radius is an internal seam and is not added to the exterior boundary.',
    ],
    misconception: [
      '先固定所取大弧或小弧；长度用cm，面积用cm²，精确π不换截断小数。',
      'Fix the selected major or minor sweep, use cm for lengths and cm² for area, and retain exact π rather than truncated decimals.',
    ],
    prompts: [
      [
        '先指出哪些条件明确给出，再选择定理。',
        'Identify the supplied premises before choosing a theorem.',
      ],
      [
        '所求是角、长度还是面积？弧是否含圆周角顶点？',
        'Is the requested quantity an angle, length or area? Does the arc exclude the inscribed-angle vertex?',
      ],
    ],
  },
  {
    title: ['圆中的综合推理', 'Combined circle reasoning'],
    lab: 'cyclic-proof',
    objective: [
      '把同圆、直径和垂线前提连接到角、相似与对应边，形成可核验的短证明链。',
      'Link common-circle, diameter and perpendicular premises to angles, similarity and corresponding sides in a checkable short proof.',
    ],
    prerequisites: ['J95-L02', 'J95-L03', 'J94-L03'],
    keywords: [
      ['前提', 'premise'],
      ['证明链', 'proof chain'],
      ['相似联结', 'similarity link'],
    ],
    hook: [
      '同一个15 cm答案，可以有充分证明，也可能只是猜对吗？',
      'Can the same 15 cm answer come from a proof or merely a correct guess?',
    ],
    items: [
      {
        stem: [
          'A、B、C、D依次同圆，内角A=70°，求C。',
          'A, B, C and D lie in order on one circle, with interior angle A=70°. Find C.',
        ],
        answer: {
          kind: 'number',
          value: '110',
          unit: '°',
        },
        steps: [
          [
            '先有四点共圆，才能用对角和180°；C=110°。',
            'Concyclicity first permits the opposite-angle sum 180°, giving C=110°.',
          ],
        ],
        wrong: ['70', '140'],
        diagram: {
          kind: 'cyclic-proof',
          index: 0,
        },
      },
      {
        stem: [
          'AC是直径，B在圆上，BD⊥AC且D在AC内部，AC=25、AD=9 cm。求AB精确长度数值。',
          'AC is a diameter, B is on the circle and BD⊥AC with D inside AC. AC=25, AD=9 cm. Find exact AB without units.',
        ],
        answer: {
          kind: 'root-length',
          value: '15',
          square: '225',
        },
        steps: [
          [
            'ABC与ADB均为直角且共用A，△ADB∼△ABC；AD/AB=AB/AC，AB²=9×25=225，正根15。',
            'ABC and ADB are right angles and A is shared, so ADB∼ABC. AD/AB=AB/AC gives AB²=9×25=225 and positive root fifteen.',
          ],
        ],
        wrong: ['9', '12', '-15'],
        diagram: {
          kind: 'cyclic-proof',
          index: 1,
        },
      },
      {
        stem: [
          '同一直径与垂高图中AC=25、AD=9，已知BD²=AD·DC。求BD。',
          'In that diameter-altitude figure AC=25, AD=9, and BD²=AD·DC is established. Find exact BD without units.',
        ],
        answer: {
          kind: 'root-length',
          value: '12',
          square: '144',
        },
        steps: [
          [
            'DC=25−9=16，BD²=9×16=144，正长度12。',
            'DC=25−9=16, hence BD²=9×16=144 and positive length BD=12.',
          ],
        ],
        wrong: ['16', '15', '-12'],
      },
      {
        stem: [
          '同图由AA得△ADB∼△什么？按A、D、B次序写对应大三角形。',
          'By AA in that figure, △ADB is similar to which large triangle? Match A,D,B in order.',
        ],
        answer: {
          kind: 'geometry-code',
          value: 'ABC',
        },
        steps: [
          [
            'A↔A，共用；D的直角对应B的直角，剩B对应C，故ABC。',
            'A↔A is shared; right angle D corresponds to right angle B, leaving B↔C. Thus enter ABC.',
          ],
        ],
        wrong: ['ACB', 'BAC', 'ADB'],
      },
      {
        stem: [
          '只给四边形A角70°，未给四点共圆，能保证C=110°吗？',
          'A quadrilateral has A=70° but is not stated to be cyclic. Is that sufficient to guarantee C=110°?',
        ],
        answer: {
          kind: 'proof-verdict',
          value: 'insufficient',
        },
        steps: [
          [
            '一般四边形只限制四角和360°，可移动C改变其角并保留A，不能套圆内接定理。',
            'A general quadrilateral only has total angle sum 360°. Moving C can retain A while changing C; the cyclic theorem is unavailable.',
          ],
        ],
        wrong: ['sufficient', 'congruent'],
      },
      {
        stem: [
          '从直径AC=25与AD=9的完整条件出发，证明AB=15，说明每个步骤用什么前提。',
          'Starting from the full diameter AC=25 and AD=9 conditions, prove AB=15 and cite each premise.',
        ],
        answer: {
          kind: 'explain',
          rubric: {
            zh: 'B在直径AC所对圆上给∠ABC=90°；BD⊥AC、D在AC内给∠ADB=90°且∠DAB=∠BAC。AA得△ADB∼△ABC，正确对应给AD/AB=AB/AC，故AB²=AD·AC=225；长度为正取15 cm。不能在相似未证前先引用比例，也不能把AD=9当AB。',
            en: 'B on the circle subtending diameter AC gives ABC=90°. BD⊥AC with D inside AC gives ADB=90° and DAB=BAC. AA gives ADB∼ABC, whose correspondence yields AD/AB=AB/AC, hence AB²=AD·AC=225. Positivity gives AB=15 cm. Do not invoke the proportion before similarity or identify AD=9 with AB.',
          },
        },
        steps: [
          [
            'B在直径AC所对圆上给∠ABC=90°；BD⊥AC、D在AC内给∠ADB=90°且∠DAB=∠BAC。AA得△ADB∼△ABC，正确对应给AD/AB=AB/AC，故AB²=AD·AC=225；长度为正取15 cm。不能在相似未证前先引用比例，也不能把AD=9当AB。',
            'B on the circle subtending diameter AC gives ABC=90°. BD⊥AC with D inside AC gives ADB=90° and DAB=BAC. AA gives ADB∼ABC, whose correspondence yields AD/AB=AB/AC, hence AB²=AD·AC=225. Positivity gives AB=15 cm. Do not invoke the proportion before similarity or identify AD=9 with AB.',
          ],
        ],
        wrong: [],
      },
    ],
    pick: {
      stem: ['下列证明顺序哪个合法？', 'Which proof order is valid?'],
      options: [
        [
          '先套对应边比例，再用答案证明相似',
          'Use a proportion first and use its answer to prove similarity',
        ],
        [
          '直径角→两角相等→AA相似→对应边比例',
          'Diameter angle → two equal angles → AA → corresponding-side proportion',
        ],
        ['图像看起来垂直→必为切线', 'Looks perpendicular → must be tangent'],
      ],
      feedback: [
        [
          '这是把待证关系当依据，形成循环。',
          'This uses an unproved relationship as evidence, forming a circle.',
        ],
        [
          '每一步以前面已建立事实和给定条件为依据。',
          'Each step uses supplied premises and previously established facts.',
        ],
        [
          '需明确切点处半径垂直，不能依赖外观。',
          'Perpendicularity at the radius endpoint must be supplied or proved, not inferred from appearance.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '解释卡片顺序全部合法是否已经等同于你写出了一份完整几何证明。',
      'Does a legal proof-card order mean you have written a complete geometric proof?',
    ],
    rubric: [
      '不等同。卡片依赖只检查是否先建立所需事实；仍须写出点、角与边的对应，说明直径角和垂线的来源，列正确比例，保留长度正值和单位。数值15也可能猜对。缺四点共圆的卡片应被拒绝，不能添加想要的前提；完整书面理由由家长核验。',
      'No. Dependency checks only establish the order of required facts. Still state point, angle and side correspondences, cite diameter and perpendicular premises, write the correct proportion and retain positive length and units. The number fifteen can be guessed. A card missing concyclicity must be rejected rather than adding a desired premise; a parent reviews the complete written argument.',
    ],
    misconception: [
      '先建立角与相似，后列比例；图形同圆、切点、垂线与长度正值都要有依据。',
      'Establish angles and similarity before proportions, with evidence for the common circle, contacts, perpendiculars and positive lengths.',
    ],
    prompts: [
      [
        '先指出哪些条件明确给出，再选择定理。',
        'Identify the supplied premises before choosing a theorem.',
      ],
      [
        '所求是角、长度还是面积？弧是否含圆周角顶点？',
        'Is the requested quantity an angle, length or area? Does the arc exclude the inscribed-angle vertex?',
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
export const j95Lessons: Lesson[] = specs.map((s, i) => {
  const id = `J95-L0${i + 1}`;
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
    unit: 'J95',
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
            '纸上设计虚构圆形滑板场图：标半径6 m、60°入口扇形和300°剩余区，求各弧长与区域面积，并区分扇形完整边界。画圆外点的两条已知切线路径，写垂直半径条件和长度计算；再用直径、垂线、相似写一份短证明。家长核所取弧、前提、单位与推理依赖；仅作数学设计，不是施工方案，无需出门、购买或上传。',
            'On paper design a fictional circular skate area of radius six metres, with a 60° entrance sector and 300° remaining region. Find their arc lengths and areas, distinguishing complete sector boundaries. Add two explicitly tangent paths from an external point, state the contact perpendiculars and calculate a length. Write a short diameter-altitude-similarity proof. A parent checks arcs, premises, units and dependencies. This is a maths design rather than construction guidance; no outing, purchase or upload is needed.',
          ),
        }
      : {}),
  };
});
export function j95ReviewQuestion(id: string, round: number): Question {
  if (
    !/^J95-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid J95 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 80;
  let v: Item;
  if (i === 0) {
    const r = 3 + (k % 6),
      d = r + (Math.floor(k / 6) % 3) - 1,
      value = (d < r ? 'secant' : d === r ? 'tangent' : 'disjoint') as
        'secant' | 'tangent' | 'disjoint';
    v = {
      stem: [
        `圆半径${r} cm，整直线到圆心的垂距${d} cm。分类割线/切线/不相交。`,
        `Circle radius is ${r} cm and perpendicular line-to-centre distance ${d} cm. Classify as secant, tangent or disjoint.`,
      ],
      answer: { kind: 'circle-line', value },
      steps: [
        [
          `比较${d}与${r}，整直线分别有两/一/零交点。`,
          `Compare ${d} with ${r}: the infinite line has two, one or zero intersections.`,
        ],
      ],
      wrong: value === 'secant' ? ['tangent'] : ['secant'],
    };
  } else if (i === 1) {
    const sweep = 20 + 10 * (k % 33),
      inside = Math.floor(k / 33) % 2 === 1,
      arc = inside ? 360 - sweep : sweep,
      value = String(arc / 2);
    v = {
      stem: [
        `A、B、P同圆，逆时针A→B弧${sweep}°，P在${inside ? '这条' : '另一条'}弧内部。求∠APB。`,
        `A, B and P lie on one circle. The counterclockwise A→B arc is ${sweep}° and P lies on the ${inside ? 'selected' : 'other'} open arc. Find APB.`,
      ],
      answer: { kind: 'number', value, unit: '°' },
      steps: [
        [
          `取不含P的弧${arc}°，角为${arc}/2=${value}°。`,
          `Use the arc excluding P, ${arc}°, giving angle ${arc}/2=${value}°.`,
        ],
      ],
      wrong: ['0', '180'],
    };
  } else if (i === 2) {
    const r = 3 + (k % 5),
      d = r + (Math.floor(k / 5) % 8) + 1,
      square = String(d * d - r * r),
      value = exactRootText(rational(BigInt(d * d - r * r)));
    v = {
      stem: [
        `PT在T处切圆，OT=${r}、OP=${d} cm，求PT精确长度数值，不附单位。`,
        `PT is tangent at T, with OT=${r}, OP=${d} cm. Find exact PT without units.`,
      ],
      answer: { kind: 'root-length', value, square },
      steps: [
        [
          `OT⊥PT，PT²=${d * d}−${r * r}=${square}，正根${value}。`,
          `OT⊥PT, so PT²=${d * d}−${r * r}=${square} with positive root ${value}.`,
        ],
      ],
      wrong: ['0', '-1'],
    };
  } else if (i === 3) {
    const r = 1 + (k % 10),
      sweep = 30 * ((Math.floor(k / 10) % 11) + 1),
      area = Math.floor(k / 5) % 2 === 1,
      coefficient = textR(
        rational(BigInt(sweep * (area ? r * r : 2 * r)), 360n),
      );
    v = {
      stem: [
        `半径${r} cm，选定扫角${sweep}°，求${area ? '扇形面积' : '弧长'}，保留π。`,
        `For radius ${r} cm and selected sweep ${sweep}°, find ${area ? 'sector area' : 'arc length'}, retaining π.`,
      ],
      answer: {
        kind: 'pi-multiple',
        value: `${coefficient}π`,
        coefficient,
        unit: area ? 'cm²' : 'cm',
      },
      steps: [
        [
          `份额${sweep}/360乘${area ? 'πr²' : '2πr'}得${coefficient}π ${area ? 'cm²' : 'cm'}。`,
          `Multiply fraction ${sweep}/360 by ${area ? 'πr²' : '2πr'} to obtain ${coefficient}π ${area ? 'cm²' : 'cm'}.`,
        ],
      ],
      wrong: ['0', '1'],
    };
  } else if (k % 2 === 0) {
    const a = 30 + (k % 111),
      value = String(180 - a);
    v = {
      stem: [
        `A、B、C、D依次同圆，内角A=${a}°，求C。`,
        `A, B, C and D lie in order on one circle, with interior A=${a}°. Find C.`,
      ],
      answer: { kind: 'number', value, unit: '°' },
      steps: [
        [
          `共圆前提给对角和180°，C=180−${a}=${value}°。`,
          `Concyclicity gives opposite-angle sum 180°, so C=180−${a}=${value}°.`,
        ],
      ],
      wrong: ['0', '180'],
    };
  } else {
    const u = 1 + (k % 4),
      w = 1 + (Math.floor(k / 4) % 4),
      ac = u * u + w * w,
      ad = u * u,
      square = String(ac * ad),
      value = exactRootText(rational(BigInt(ac * ad)));
    v = {
      stem: [
        `AC为直径，B在圆上，BD⊥AC且D在内部；AC=${ac}、AD=${ad} cm。求AB精确长度数值。`,
        `AC is a diameter, B is on the circle and BD⊥AC with interior foot D; AC=${ac}, AD=${ad} cm. Find exact AB without units.`,
      ],
      answer: { kind: 'root-length', value, square },
      steps: [
        [
          `先用直径角与垂高得AA，ADB∼ABC，AB²=AD·AC=${square}，正根${value}。`,
          `The diameter angle and altitude give AA, ADB∼ABC, hence AB²=AD·AC=${square} with positive root ${value}.`,
        ],
      ],
      wrong: ['0', '-1'],
    };
  }
  return q(`${id}-R${round}`, i, v);
}
export const j95CheckQuestions: Question[] = [
  q('J95-CHECK-Q1', 0, specs[0]!.items[4]!),
  q('J95-CHECK-Q2', 1, specs[1]!.items[1]!),
  q('J95-CHECK-Q3', 2, specs[2]!.items[2]!),
  q('J95-CHECK-Q4', 3, specs[3]!.items[1]!),
  q('J95-CHECK-Q5', 4, specs[4]!.items[1]!),
  reasoning(
    'J95-CHECK-Q6',
    T(specs[2]!.items[5]!.stem),
    skills[2]!,
    specs[2]!.items[5]!.answer.kind === 'explain'
      ? specs[2]!.items[5]!.answer.rubric
      : t('', ''),
    hints[2]!.map(T),
  ),
  pick('J95-CHECK-Q7', 3, specs[3]!.pick),
  reasoning(
    'J95-CHECK-Q8',
    T(specs[4]!.items[5]!.stem),
    skills[4]!,
    specs[4]!.items[5]!.answer.kind === 'explain'
      ? specs[4]!.items[5]!.answer.rubric
      : t('', ''),
    hints[4]!.map(T),
  ),
];
