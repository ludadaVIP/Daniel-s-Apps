import { t, type Lesson, type Question } from '../model';
import { numeric, choice, reasoning } from './builders';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = {
  stem: Pair;
  value: string;
  steps: Pair[];
  wrong: string[];
  accepted: string[];
  number?: boolean;
  diagram?: Question['diagram'];
};
const I = (
  stem: Pair,
  value: string,
  steps: Pair[],
  wrong: string[],
  accepted: string[] = [],
): Item => ({ stem, value, steps, wrong, accepted });
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
  'real-inequality-solution-set',
  'one-step-inequality-equivalence',
  'negative-order-reversal',
  'linear-inequality-solving',
  'intersection-of-inequalities',
];
const hints: Pair[][] = [
  [
    [
      '先分清大于/小于与是否含等号；候选代入只证明一个数。',
      'Separate direction from equality inclusion; substituting a candidate proves one number only.',
    ],
    [
      '用 x 写完整范围；空心排除、实心包含，箭头表示所有继续的实数。',
      'Write the whole range in x. Open excludes, filled includes; arrows represent all continuing real values.',
    ],
  ],
  [
    [
      '找一个能撤销原操作的两边同步操作，不只改一边。',
      'Undo the operation on both sides, not just one.',
    ],
    [
      '加减同一个式子保持方向；乘除正数保持、负数反向，零不作可逆乘除。',
      'Common addition/subtraction keeps direction; positive scaling keeps it, negative scaling reverses it. Zero is not reversible scaling.',
    ],
  ],
  [
    [
      '先在数轴比较原两数与负数乘积的顺序。',
      'Compare the original numbers and their negative multiples on a number line.',
    ],
    [
      '同乘或同除已知负数反向；只是移项或看到负号并不自动反向。除数符号未知须分类。',
      'Reverse for multiplication or division by a known negative. Transposing or merely seeing a minus sign is insufficient. An unknown divisor sign needs cases.',
    ],
  ],
  [
    [
      '展开与合并后，两边同步移去含 x 项和常数，保留不等号。',
      'Expand and collect, then remove variable terms and constants from both sides, retaining the comparison.',
    ],
    [
      '最后同除系数：负反向、正保持。若 x 消失，判断常数关系是真还是假，不除零。',
      'Finally divide by the coefficient: reverse for negative, keep for positive. If x vanishes, test the constant relation instead of dividing by zero.',
    ],
  ],
  [
    [
      '每个条件先各自求解，找同一个 x 同时通过的部分。',
      'Solve each condition, then find values of the same x passing both.',
    ],
    [
      '两端都须通过；边界相遇仅当双方包含才留单点。实际数量另核整数、非负与单位。',
      'Both endpoint tests must pass; touching bounds leave a point only when both include it. Contexts additionally need integer, nonnegative and unit checks.',
    ],
  ],
];
function q(id: string, i: number, item: Item): Question {
  const r = numeric(
    id,
    T(item.stem),
    item.value,
    skills[i]!,
    hints[i]!.map(T),
    [...item.steps.map(T), T(hints[i]![1]!)],
    { accepted: [item.value, ...item.accepted], rejected: item.wrong },
    item.diagram,
  );
  r.answer = item.number
    ? { kind: 'number', value: item.value, formats: ['decimal', 'fraction'] }
    : { kind: 'real-set', value: item.value };
  r.misconceptionTags = [
    skills[i]!,
    'direction-and-inclusion',
    'whole-set-not-samples',
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
    title: ['不等号和解集', 'Inequality signs and solution sets'],
    objective: [
      '用不等号与数轴表示完整实数解集，分别判断方向与端点包含性。',
      'Represent a complete real solution set with inequalities and a number line, separating direction from endpoint inclusion.',
    ],
    prerequisites: ['J71-L01', 'J71-L02', 'J73-L01'],
    keywords: [
      ['解集', 'solution set'],
      ['端点', 'endpoint'],
      ['严格不等号', 'strict inequality'],
    ],
    lab: 'inequality-meaning',
    hook: [
      'x<3 与 x≤3 都有许多个解，为何在 3 处要画不同的点？',
      'Both x<3 and x≤3 have many solutions. Why do their marks at three differ?',
    ],
    items: [
      I(
        [
          '写出所有严格小于 3 的实数 x 的完整解集。',
          'Write the complete set of real x strictly less than three.',
        ],
        'x<3',
        [
          [
            '“严格小于”用 <，三本身不通过。',
            'Strictly less uses <; three itself fails.',
          ],
          [
            '数轴在三空心，涂向左，包含 2.9 等分数/小数，不止整数。',
            'An open point at three shades left, including values such as 2.9, not just integers.',
          ],
        ],
        ['3', 'x<=3', 'x>3', '{0,1,2}'],
        ['3>x', '(-inf,3)'],
      ),
      {
        ...I(
          [
            '读图写完整实数解集，留意端点是否包含。',
            'Read the graph and write the entire real set, checking endpoint inclusion.',
          ],
          'x>=-2',
          [
            [
              '负二实心，右侧全部涂色。',
              'The filled point at minus two shades to the right.',
            ],
            [
              '负二本身与每个更大的实数都通过。',
              'Minus two itself and every larger real value pass.',
            ],
          ],
          ['x>-2', 'x<=-2', '-2'],
          ['-2<=x', '[-2,inf)'],
        ),
        diagram: { kind: 'inequality-line', source: 'x>=-2' },
      },
      I(
        [
          '实数 x 至多为 4，写完整解集。',
          'A real x is at most four. Write its full set.',
        ],
        'x<=4',
        [
          ['“至多”含四，故用 ≤。', 'At most includes four, so use ≤.'],
          [
            '四实心并向左继续，不是只取四。',
            'Fill four and continue left rather than selecting four alone.',
          ],
        ],
        ['x<4', 'x>=4', '4'],
      ),
      I(
        [
          '实数 x 严格大于 −1，写完整解集。',
          'A real x is strictly greater than minus one. Write the full set.',
        ],
        'x>-1',
        [
          [
            '大于向右，严格表示不含负一。',
            'Greater shades right; strict excludes minus one.',
          ],
          [
            '−1/2 与 0 都是解，不能只列非负整数。',
            'Minus one half and zero both pass, so nonnegative integers alone are insufficient.',
          ],
        ],
        ['x>=-1', 'x<-1', 'x>=0'],
        ['-1<x'],
      ),
      I(
        [
          '实数 x 不小于 1/2，写完整解集。',
          'A real x is no less than one half. Write the full set.',
        ],
        'x>=1/2',
        [
          [
            '不小于就是大于或等于。',
            'No less than means greater than or equal to.',
          ],
          ['精确半实心，向右继续。', 'Fill the exact half and continue right.'],
        ],
        ['x>1/2', 'x<=1/2', '1/2'],
        ['x>=0.5'],
      ),
      I(
        [
          '虚构冷室温度 x（°C）必须严格高于 −4°C，无其他限制，写完整允许温度范围，不附单位。',
          'A fictional cold-room temperature x in °C must be strictly above -4°C, with no other restriction. Write the full allowed range without units.',
        ],
        'x>-4',
        [
          [
            '高于用 >，负四不包含，负三点五可以。',
            'Above uses >; minus four is excluded while minus three and a half passes.',
          ],
          [
            '温度在此为实数，向右包含连续值。',
            'Temperature is a real quantity here, including continuous values to the right.',
          ],
        ],
        ['x>=-4', 'x<-4', '-4'],
      ),
    ],
    pick: {
      stem: [
        '关于 x<3，哪句话完整准确？',
        'Which statement accurately describes x<3?',
      ],
      options: [
        ['只有 0、1、2', 'Only 0,1,2'],
        ['3 是唯一的解', 'Three is the only solution'],
        [
          '所有小于三的实数，三不包含',
          'Every real below three, excluding three',
        ],
      ],
      feedback: [
        [
          '还可取负数、分数与任意更小的实数。',
          'Negative and fractional values and all smaller reals can also pass.',
        ],
        ['三使严格关系不成立。', 'Three fails the strict comparison.'],
        [
          '范围与端点均准确；有限样本不能代替解集。',
          'Both range and endpoint are correct; samples do not replace the set.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '有人把 x≤3 画成三处空心、向右涂色。分别改正两个错误，并举一解一非解。',
      'Someone draws x≤3 open at three and shades right. Correct both errors and give a solution and a non-solution.',
    ],
    rubric: [
      '≤ 表示小于或等于：三本身成立，应实心；更小的数成立，应向左。可用三或二作为解、四作为非解；同时说明分数也可能成立，有限整数列表不是所有实数解。家长检查方向与包含性各有理由。',
      '≤ means less than or equal: three passes, so fill it, and smaller values lie left. Three or two is a solution, four a non-solution. Fractional values may pass too; an integer list is not the full real set. Check separate reasons for direction and inclusion.',
    ],
    misconception: [
      '把边界当唯一解、只列整数、方向与端点混淆。',
      'Treating a boundary as the unique solution, listing only integers or confusing direction with inclusion.',
    ],
    prompts: [
      [
        '边界代入原句会成立吗？',
        'Does the boundary satisfy the original statement?',
      ],
      ['图窗外还有解吗？', 'Are there solutions outside the viewing window?'],
    ],
  },
  {
    title: ['一步不等式', 'One-step inequalities'],
    objective: [
      '用两边同步的可逆操作求一步不等式的完整解集。',
      'Solve one-step inequalities using reversible operations on both sides.',
    ],
    prerequisites: ['J84-L01', 'J73-L02', 'J71-L05'],
    keywords: [
      ['等价变形', 'equivalent transformation'],
      ['同步操作', 'common operation'],
      ['可逆', 'reversible'],
    ],
    lab: 'inequality-step',
    hook: [
      'x+3≤7 的两边同减三，会改变哪一部分？不等号要转向吗？',
      'What changes when both sides of x+3≤7 decrease by three? Does the sign reverse?',
    ],
    items: [
      I(
        [
          '在实数中解 x+3≤7，写完整解集。',
          'Solve x+3≤7 over the reals, giving the full set.',
        ],
        'x<=4',
        [
          [
            '两边同减三，保持方向，得到 x≤4。',
            'Subtract three from both sides, retaining direction: x≤4.',
          ],
          [
            '边界四代回为七≤七，故包含。',
            'Four gives seven≤seven, so the boundary is included.',
          ],
        ],
        ['4', 'x<4', 'x>=4'],
        ['7>=x+3'],
      ),
      I(
        ['在实数中解 x−5>−2。', 'Solve x−5>-2 over the reals.'],
        'x>3',
        [
          [
            '两边同加五，−2+5=3，不反向。',
            'Add five to both sides: -2+5=3, with no reversal.',
          ],
          [
            '三代回为相等，严格 > 排除三。',
            'Three gives equality, so strict > excludes it.',
          ],
        ],
        ['x>=3', 'x<3', 'x>-7'],
      ),
      I(
        ['在实数中解 3x>−6。', 'Solve 3x>-6 over the reals.'],
        'x>-2',
        [
          [
            '同除正三，方向保持。',
            'Divide both sides by positive three, keeping direction.',
          ],
          [
            '取零代回成立，负二是排除的边界。',
            'Zero verifies the direction; minus two is the excluded boundary.',
          ],
        ],
        ['x<-2', 'x>=-2', '-2'],
      ),
      I(
        ['在实数中解 x/2≤3。', 'Solve x/2≤3 over the reals.'],
        'x<=6',
        [
          [
            '同乘正二，不反向，得到 x≤6。',
            'Multiply both sides by positive two without reversal: x≤6.',
          ],
          ['六本身通过，七不通过。', 'Six passes and seven fails.'],
        ],
        ['x<=3/2', 'x>=6', 'x<6'],
      ),
      I(
        [
          '在实数中解 −2x<6；负数规则将在下一课解释。',
          'Solve -2x<6 over the reals; the next lesson explains negative scaling.',
        ],
        'x>-3',
        [
          [
            '同除负二，必须把 < 改成 >。',
            'Divide by negative two, reversing < to >.',
          ],
          [
            '零代回为零小于六，通过；−4 代回为八小于六，不通过。',
            'Zero gives zero<6 and passes; -4 gives eight<6 and fails.',
          ],
        ],
        ['x<-3', 'x>=-3', 'x>3'],
      ),
      I(
        [
          '虚构温度计读数为 x+1.5°C，要求读数至多 6°C。x 为实数温度，不另限非负，求 x 范围，不附单位。',
          'A fictional thermometer reads x+1.5°C and must read at most 6°C. x is a real temperature with no nonnegative restriction. Find its range without units.',
        ],
        'x<=9/2',
        [
          [
            '两边同减 1.5 得 x≤4.5，即 x≤9/2。',
            'Subtract 1.5 from both sides: x≤4.5, equivalently x≤9/2.',
          ],
          [
            '温度可负，题目没有另加零下界。',
            'Temperature may be negative; no zero lower bound was given.',
          ],
        ],
        ['x<4.5', 'x>=4.5', '0<=x<=4.5'],
        ['x<=4.5'],
      ),
    ],
    pick: {
      stem: [
        '由 x+3≤7 得等价不等式，哪一步有通用依据？',
        'Which step gives an equivalent inequality from x+3≤7?',
      ],
      options: [
        ['只把左边减三，得 x≤7', 'Subtract three on the left only: x≤7'],
        ['两边同减三，得 x≤4', 'Subtract three from both sides: x≤4'],
        [
          '两边同乘零后作为求解结果',
          'Multiply both sides by zero and use that as the solution',
        ],
      ],
      feedback: [
        [
          '只改左边会改变范围，例如六会被错误允许。',
          'Changing only the left admits wrong values, such as six.',
        ],
        [
          '同减可逆且保持顺序，两边数量同步改变。',
          'Common subtraction is reversible and order preserving.',
        ],
        [
          '乘零后原来不同的数合并，丢失解集信息。',
          'Zero collapses distinct values and loses the original constraint.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '解释从 3x>−6 到 x>−2 为什么不反向，再用零和负三核方向。',
      'Explain why 3x>-6 becomes x>-2 without reversal, then check with zero and minus three.',
    ],
    rubric: [
      '除数是正三，正数缩放保持顺序。零使零>负六成立，属于解集；负三使负九>负六不成立，不属于。完整答案为 x>−2，负二严格排除；不是只给 −2。两边同步与除数符号都要说明。',
      'The divisor is positive three, so order is preserved. Zero gives 0>-6 and passes; minus three gives -9>-6 and fails. The full answer is x>-2 with the boundary excluded, not the number -2 alone. Explain both common operation and divisor sign.',
    ],
    misconception: [
      '只改一边、加减时乱反向、把负常数与负除数混为一谈。',
      'One-sided changes, reversing during addition or confusing a negative constant with a negative divisor.',
    ],
    prompts: [
      ['这一步的逆操作是什么？', 'What reverses this operation?'],
      [
        '除数是正还是负，而不是右边是正还是负？',
        'Is the divisor positive or negative, regardless of the right side?',
      ],
    ],
  },
  {
    title: ['负数相乘为何改变不等号', 'Why inequality signs reverse'],
    objective: [
      '用数轴顺序的反射解释同乘或同除非零负数为何反向。',
      'Explain negative scaling reversal through reflected number-line order.',
    ],
    prerequisites: ['J84-L02', 'J71-L05', 'J71-L02'],
    keywords: [
      ['顺序反射', 'order reflection'],
      ['负因子', 'negative factor'],
      ['非零', 'nonzero'],
    ],
    lab: 'inequality-reverse',
    hook: [
      '−2<3，但同乘 −2 后得到 4 与 −6，原来靠左的数现在在哪边？',
      '-2<3, but multiplying by -2 gives 4 and -6. Where does the formerly smaller number move?',
    ],
    items: [
      I(
        [
          '在实数中解 −2x<6，说明负数除法的方向。',
          'Solve -2x<6 over the reals, checking negative division direction.',
        ],
        'x>-3',
        [
          [
            '同除 −2 等于同乘 −1/2，顺序反转。',
            'Dividing by -2 is multiplying by -1/2, which reverses order.',
          ],
          [
            'x>−3；零通过，负四不通过，负三本身被严格排除。',
            'x>-3; zero passes, minus four fails, and minus three is strictly excluded.',
          ],
        ],
        ['x<-3', 'x>=-3', 'x>3'],
      ),
      I(
        ['在实数中解 −x≥2。', 'Solve -x≥2 over the reals.'],
        'x<=-2',
        [
          [
            '同乘负一，≥ 改为 ≤。',
            'Multiply both sides by minus one, reversing ≥ to ≤.',
          ],
          [
            '等号仍保留，负二本身成立。',
            'Equality inclusion remains, so minus two passes.',
          ],
        ],
        ['x>=-2', 'x<-2', 'x<=2'],
      ),
      I(
        ['在实数中解 x/(−3)>2。', 'Solve x/(-3)>2 over the reals.'],
        'x<-6',
        [
          [
            '同乘负三，> 改为 <。',
            'Multiply by negative three, reversing > to <.',
          ],
          [
            '例如负九除负三为三大于二；负六只等于二，不通过。',
            'For example -9/-3=3>2 passes; -6/-3 equals two and fails.',
          ],
        ],
        ['x>-6', 'x<=-6', 'x<6'],
      ),
      {
        ...I(
          [
            '−2<3 的两数同乘 −2。只填写原左数 −2 的乘积。',
            'Multiply both numbers in -2<3 by -2. Enter only the product of the original left number -2.',
          ],
          '4',
          [
            [
              '(−2)×(−2)=4；原右数变成 −6，所以四在其右侧。',
              '(-2)×(-2)=4; the original right number becomes -6, so four is now to its right.',
            ],
          ],
          ['-4', '-6', '-2'],
        ),
        number: true,
      },
      {
        ...I(
          [
            '−2<3 的两数同除 −2。只填写原右数 3 的精确商。',
            'Divide both numbers in -2<3 by -2. Enter only the exact quotient of the original right number three.',
          ],
          '-3/2',
          [
            [
              '3÷(−2)=−3/2；原左数商为一，故 1>−3/2。',
              '3/(-2)=-3/2; the original left quotient is one, so 1>-3/2.',
            ],
          ],
          ['3/2', '-2/3', '1'],
          ['-1.5'],
        ),
        number: true,
      },
      I(
        [
          '在实数中解 −4x≤5，保留精确分数。',
          'Solve -4x≤5 over the reals, keeping an exact fraction.',
        ],
        'x>=-5/4',
        [
          [
            '同除负四，≤ 改 ≥，右侧为 −5/4。',
            'Divide by negative four, reversing ≤ to ≥, with right side -5/4.',
          ],
          [
            '应为负四分之五，即 −5/4，不是 −4/5；原边界代回等于五。',
            'Do not invert the fraction: -5/4 substituted into -4x gives five.',
          ],
        ],
        ['x<=-5/4', 'x>-5/4', 'x>=-4/5'],
        ['x>=-1.25'],
      ),
    ],
    pick: {
      stem: ['哪一句能作为通用规则？', 'Which is a valid general rule?'],
      options: [
        [
          '两边同除已知负数，反向且保留是否含等号',
          'Dividing by a known negative reverses direction while retaining equality inclusion',
        ],
        [
          '只要式子里有负号，立刻反向',
          'Any minus sign in an expression requires reversal',
        ],
        [
          '两边同乘零仍能恢复原不等式',
          'Multiplication by zero lets us recover the original inequality',
        ],
      ],
      feedback: [
        [
          '负倒数反射顺序；严格/非严格不变。',
          'A negative reciprocal reflects order; strictness is unchanged.',
        ],
        [
          '加减负数不反向，要看本步的共同乘除因子。',
          'Adding a negative does not reverse order; inspect the factor or divisor for this step.',
        ],
        [
          '乘零抹去顺序，不可逆；除零没有定义。',
          'Zero multiplication loses order and is not invertible; division by zero is undefined.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '用 −2<3 的同乘 −2 说明反向，再解释为什么不能把“同乘 x”一律当作同乘负数。',
      'Use -2<3 multiplied by -2 to explain reversal, then explain why multiplying by x cannot always be treated as negative scaling.',
    ],
    rubric: [
      '乘积四与负六从左到右的顺序相反，因此四>负六；负数作用含关于零反射，所以负数除法（乘负倒数）也反向。x 的符号可能正、负或零；正保持、负反向、零丢信息，未限定时不能统一反向。等号包含性不因反向丢失。家长核具体乘积与分类原因。',
      'Products four and minus six reverse their order, giving 4>-6. Negative scaling includes reflection about zero; negative division is multiplication by a negative reciprocal. An unrestricted x may be positive, negative or zero, requiring keep, reverse or loss of information respectively. Equality inclusion remains. Check concrete products and the sign cases.',
    ],
    misconception: [
      '看到负号就反向、反向时丢等号、未知符号或零当已知负数。',
      'Reversing on any minus sign, dropping equality inclusion or treating zero/unknown sign as known negative.',
    ],
    prompts: [
      [
        '反射前后哪个数在右侧？',
        'Which number is on the right before and after reflection?',
      ],
      [
        '如果乘数改成零，还能还原顺序吗？',
        'If the factor is zero, can the order be recovered?',
      ],
    ],
  },
  {
    title: ['一元一次不等式', 'Linear inequalities'],
    objective: [
      '说明每步等价依据并求含括号、分数或两边未知数的一次不等式解集。',
      'Solve affine inequalities with brackets, fractions or variables on both sides, justifying each equivalent step.',
    ],
    prerequisites: ['J84-L03', 'J73-L04', 'J72-L02'],
    keywords: [
      ['合并', 'collecting'],
      ['负系数', 'negative coefficient'],
      ['常数关系', 'constant relation'],
    ],
    lab: 'inequality-linear',
    hook: [
      '若最后得到 0≤1，还能除以 x 系数吗？它是在限制哪个 x？',
      'If the final relation is 0≤1, can we divide by the x coefficient? Which x does it restrict?',
    ],
    items: [
      I(
        ['在实数中解 3(x−2)≤2x+1。', 'Solve 3(x-2)≤2x+1 over the reals.'],
        'x<=7',
        [
          [
            '展开得 3x−6≤2x+1，两边减 2x，再加六。',
            'Expand to 3x-6≤2x+1; subtract 2x from both sides, then add six.',
          ],
          [
            '得到 x≤7；七代回两边均十五。',
            'This gives x≤7; at seven both original sides equal fifteen.',
          ],
        ],
        ['x>=7', 'x<7', 'x<=-5'],
      ),
      I(
        [
          '在实数中解 (x−1)/3>(x+2)/2。',
          'Solve (x-1)/3>(x+2)/2 over the reals.',
        ],
        'x<-8',
        [
          [
            '同乘正六，2(x−1)>3(x+2)，得到 −x>8。',
            'Multiply by positive six: 2(x-1)>3(x+2), hence -x>8.',
          ],
          [
            '同除负一反向，x<−8；负九通过，负八为边界不含。',
            'Divide by minus one and reverse: x<-8. Minus nine passes, while minus eight is excluded.',
          ],
        ],
        ['x>-8', 'x<=-8', 'x<8'],
      ),
      I(
        ['在实数中解 2(x+1)≤2x+3。', 'Solve 2(x+1)≤2x+3 over the reals.'],
        'all reals',
        [
          [
            '展开后同减 2x，得 2≤3，恒真。',
            'Expand and subtract 2x: 2≤3, always true.',
          ],
          [
            '没有进一步限制 x，所有实数成立；不是只有零。',
            'There is no remaining restriction, so every real x passes, not just zero.',
          ],
        ],
        ['0', 'no solution', 'x<=1'],
        ['所有实数', 'ℝ'],
      ),
      I(
        ['在实数中解 2(x+1)<2x+1。', 'Solve 2(x+1)<2x+1 over the reals.'],
        'no solution',
        [
          [
            '展开同减 2x 后得 2<1，为假。',
            'Expand and subtract 2x to obtain the false relation 2<1.',
          ],
          [
            '任何实数都不能修复这条常数矛盾，解集为空。',
            'No real value can repair this constant contradiction, so the set is empty.',
          ],
        ],
        ['all reals', '0', 'x<0'],
        ['∅', '无解'],
      ),
      I(
        ['在实数中解 −3(x+2)≥1。', 'Solve -3(x+2)≥1 over the reals.'],
        'x<=-7/3',
        [
          ['展开 −3x−6≥1，得 −3x≥7。', 'Expand to -3x-6≥1, hence -3x≥7.'],
          [
            '同除负三反向得 x≤−7/3；截断 −2.33 会改变精确边界。',
            'Divide by negative three and reverse: x≤-7/3. Truncating to -2.33 changes the exact boundary.',
          ],
        ],
        ['x>=-7/3', 'x<=-2.33', 'x<-7/3'],
      ),
      I(
        ['在实数中解 2−(x−3)>2x+1。', 'Solve 2-(x-3)>2x+1 over the reals.'],
        'x<4/3',
        [
          [
            '去括号为 5−x>2x+1，移去 2x 与五得 −3x>−4。',
            'Expand to 5-x>2x+1; remove 2x and five to obtain -3x>-4.',
          ],
          [
            '同除负三反向，得 x<4/3；减括号须改变整个括号内各项。',
            'Divide by negative three and reverse: x<4/3. Subtracting brackets changes every enclosed term.',
          ],
        ],
        ['x>4/3', 'x<1.33', 'x<=4/3', 'x<-2/3'],
      ),
    ],
    pick: {
      stem: [
        '若整理后得到 0x≤1，应怎样判断？',
        'After collecting, what does 0x≤1 mean?',
      ],
      options: [
        ['除以零得 x≤1', 'Divide by zero to get x≤1'],
        ['只有 x=0', 'Only x=0'],
        [
          '常数关系恒真，所有实数',
          'The constant relation is true, so all reals',
        ],
      ],
      feedback: [
        ['除零没有定义。', 'Division by zero is undefined.'],
        [
          '零 x 对每个实数都是零，不只 x 为零时。',
          '0x is zero for every real x, not only when x=0.',
        ],
        [
          '零≤一恒成立，变量已无约束。',
          'Zero≤one always holds, leaving no variable restriction.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '纠正“(x−1)/3>(x+2)/2，所以 x>−8”，逐步说明错误在哪并用一个数核验。',
      'Correct “(x-1)/3>(x+2)/2, therefore x>-8”, explaining the exact faulty step and testing a value.',
    ],
    rubric: [
      '同乘正六不反向：2x−2>3x+6；同减三 x 并加二得 −x>8；同除负一必须反向为 x<−8。负九代回 −10/3>−7/2 成立，零代回 −1/3>1 不成立。边界负八使两边相等，被严格排除。家长核整个括号、每步共同操作及方向原因。',
      'Multiplication by positive six retains direction: 2x-2>3x+6, then -x>8. Dividing by negative one reverses to x<-8. At -9, -10/3>-7/2 is true; at zero, -1/3>1 is false. Minus eight gives equality and is excluded. Check whole brackets, common operations and sign reasoning.',
    ],
    misconception: [
      '分母只乘部分项、减括号漏改号、负系数不反向、变量消失后仍除零。',
      'Incomplete denominator clearing, subtracting brackets incorrectly, missing negative reversal or dividing by zero after cancellation.',
    ],
    prompts: [
      [
        '本步改变的是式子写法还是共同乘除？',
        'Does this step rewrite an expression or scale both sides?',
      ],
      [
        'x 消失后留下的关系是真是假？',
        'Is the relation left after x cancels true or false?',
      ],
    ],
  },
  {
    title: ['简单不等式组', 'Simple systems of inequalities'],
    objective: [
      '把多个条件的解集取交集，并区分区间、单点、空集与情境整数解。',
      'Intersect simultaneous conditions, distinguishing intervals, singletons, empty sets and contextual integers.',
    ],
    prerequisites: ['J84-L04', 'J83-L01', 'J83-L05'],
    keywords: [
      ['交集', 'intersection'],
      ['同时', 'simultaneous'],
      ['允许范围', 'allowed domain'],
    ],
    lab: 'inequality-intersection',
    hook: [
      'x≥2 与 x≤2 同时要求时，能留下一个数吗？若把第一条改为 x>2 呢？',
      'Can x≥2 and x≤2 leave exactly one number? What changes if the first condition is x>2?',
    ],
    items: [
      I(
        [
          '实数 x 同时满足 x≥−1、x<4，写共同解集。',
          'Real x satisfies x≥-1 and x<4 simultaneously. Write the common set.',
        ],
        '-1<=x<4',
        [
          [
            '取两条涂色共同部分，负一包含、四排除。',
            'Intersect the shaded parts: include minus one and exclude four.',
          ],
          [
            '只满足一条还不够；如五通过第一条却不通过第二条。',
            'Passing one condition is insufficient; five passes the first but fails the second.',
          ],
        ],
        ['-1<x<4', '-1<=x<=4', 'x>=-1', 'x<4'],
        ['[-1,4)', 'x<4;x>=-1'],
      ),
      I(
        [
          '实数 x 同时满足 x>3、x≤1，写共同解集。',
          'Real x must satisfy x>3 and x≤1 together. Write the common set.',
        ],
        'no solution',
        [
          [
            '没有同一个数既大于三又至多一。',
            'No number can exceed three while being at most one.',
          ],
          [
            '两条各自有解，但共同部分为空，不能取两边并起来。',
            'Each condition has solutions, but their intersection is empty; do not unite them.',
          ],
        ],
        ['all reals', '1<x<3', 'x>3'],
        ['无解'],
      ),
      I(
        [
          '实数 x 同时满足 x≥2、x≤2，写共同解集。',
          'Real x must satisfy x≥2 and x≤2. Write the common set.',
        ],
        'x=2',
        [
          [
            '上下界相遇，双方都包含二。',
            'The bounds meet and both include two.',
          ],
          [
            '仅留下二这个单点，不是无穷多个数。',
            'Only the singleton two remains, not infinitely many values.',
          ],
        ],
        ['no solution', 'x>=2', 'x<2'],
        ['{2}', '[2,2]'],
      ),
      I(
        [
          '实数 x 同时满足 x>2、x≤2，写共同解集。',
          'Real x must satisfy x>2 and x≤2. Write the common set.',
        ],
        'no solution',
        [
          [
            '二不满足第一条，其他数也无法同时通过。',
            'Two fails the first condition; no other value passes both.',
          ],
          [
            '接触但一侧开口，仍为空集。',
            'Touching with an open side still gives the empty set.',
          ],
        ],
        ['x=2', 'x>=2', 'all reals'],
        ['∅'],
      ),
      I(
        [
          '虚构液体 x 升为非负连续量，费用 2x+1 元至多八元，写完整允许 x 范围，不附单位。',
          'A fictional liquid amount x litres is continuous and nonnegative. Its cost 2x+1 dollars is at most eight. Write the full allowed x range without units.',
        ],
        '0<=x<=7/2',
        [
          [
            '费用给 x≤7/2，数量域另给 x≥0。',
            'The cost gives x≤7/2, and the amount domain gives x≥0.',
          ],
          [
            '取交集得 0≤x≤7/2，升数可取分数。',
            'Intersect to obtain 0≤x≤7/2; fractional litres are allowed.',
          ],
        ],
        ['x<=7/2', '0<=x<7/2', '0<=x<=3'],
        ['[0,3.5]'],
      ),
      {
        ...I(
          [
            '虚构每袋 NZ$3，另有固定费用 NZ$2，预算至多 NZ$18。袋数 x 是非负整数，最多可买几袋？只写整数。',
            'Fictional bags cost NZ$3 each plus a fixed NZ$2 fee, with a budget of at most NZ$18. x is a nonnegative integer. What is the greatest number of bags? Enter only the integer.',
          ],
          '5',
          [
            [
              '3x+2≤18 给 x≤16/3；还要 x≥0 且为整数。',
              '3x+2≤18 gives x≤16/3; x must also be nonnegative and integral.',
            ],
            [
              '最大允许整数五，费用十七；六袋费用二十，超预算。',
              'The largest integer is five, costing seventeen; six costs twenty and exceeds the budget.',
            ],
          ],
          ['16/3', '6', '4', '5.33'],
        ),
        number: true,
      },
    ],
    pick: {
      stem: [
        'x>−2 且 x≥1 的共同解集是？',
        'What is the intersection of x>-2 and x≥1?',
      ],
      options: [
        ['x>−2', 'x>-2'],
        ['x≥1', 'x≥1'],
        ['−2<x<1', '-2<x<1'],
      ],
      feedback: [
        [
          '这包含零，零不通过第二条。',
          'This includes zero, which fails the second condition.',
        ],
        [
          '同向取更严格下界，一本身通过两条。',
          'Use the stronger lower bound; one passes both.',
        ],
        [
          '区间内数反而不满足 x≥1，且漏掉一和更大数。',
          'Interior values fail x≥1, and one and larger values are missing.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '比较 x≥2 且 x≤2 与 x>2 且 x≤2，再比较分数升数与整袋数量。解释为何“且”不能只查一个条件。',
      'Compare x≥2 AND x≤2 with x>2 AND x≤2, then fractional litres with whole bags. Explain why checking only one condition is insufficient.',
    ],
    rubric: [
      '前组只含二，两侧都包含；后组为空，二被第一条排除。每个数须同时符合所有原条件，不能把并集当交集。同一代数上界在连续升数中可保留分数，在非负整袋数中须选允许整数；预算至多含等号，不能把 16/3 袋取整成六，因为费用二十超过十八。家长核单点/空集及域条件，不按关键词评分。',
      'The first system contains only two because both ends include it; the second is empty because the first excludes two. Every value must pass all originals; a union cannot replace an intersection. Continuous litres may retain fractions, whereas nonnegative bag counts require integers. At-most budgets include equality. Do not round 16/3 bags to six: the cost twenty exceeds eighteen. Review endpoints and domains using concrete checks.',
    ],
    misconception: [
      '且当或、同向取较宽界、相遇必空、遗漏非负或整数域、向上取整超预算。',
      'Replacing AND with OR, using weaker same-direction bounds, always calling touching empty, ignoring domains or rounding over budget.',
    ],
    prompts: [
      [
        '这个端点能分别通过几条？',
        'How many original conditions does this endpoint pass?',
      ],
      [
        '题目问所有实数还是最大的整袋数？',
        'Does the task ask for all real values or the largest whole count?',
      ],
    ],
  },
];
export const j84Lessons: Lesson[] = specs.map((s, i) => {
  const id = `J84-L0${i + 1}`;
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
    unit: 'J84',
    order: i + 1,
    nzYearHints: [8, 9],
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
    ...(i === 4
      ? {
          familyChallenge: t(
            '纸上为虚构社区活动设计两条限制：连续液体升数与整数材料袋数任选各一，注明单位、非负条件与预算。先写每条原不等式，画数轴并求共同范围，再测试边界、一个允许值和一个不允许值。制造相遇实心留一点与一侧空心无解的对照。说明每次负数乘除为何反向，比较分数上界与最大整数；无需购买、实测或提交个人资料。',
            'On paper, design two restrictions for fictional community supplies, comparing continuous litres and whole bags. State units, nonnegative domains and budgets. Write originals, graph and intersect, then test boundaries, an allowed value and a rejected value. Contrast touching closed bounds with an open touch. Explain negative scaling and fractional bounds versus maximal integers. No purchases, measurements or personal data are needed.',
          ),
        }
      : {}),
  };
});
export function j84ReviewQuestion(id: string, round: number): Question {
  if (
    !/^J84-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid J84 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 80,
    n = (k % 9) - 4,
    d = [1, 2, 3][k % 3]!,
    op = ['<', '<=', '>', '>='][k % 4]!,
    flip = op.startsWith('<') ? op.replace('<', '>') : op.replace('>', '<');
  let source: string, value: string, steps: Pair[];
  if (i === 0) {
    source = `x${op}${n}/${d}`;
    value = source;
    steps = [
      [
        '方向和包含性分别读取，保留所有实数。',
        'Read direction and inclusion separately, retaining every real solution.',
      ],
    ];
  } else if (i === 1 || i === 2) {
    const a = i === 2 ? -(2 + (k % 3)) : 2 + (k % 3);
    source = `${a}x${op}${a * n}/${d}`;
    value = `x${a < 0 ? flip : op}${n}/${d}`;
    steps = [
      [
        `两边同除 ${a}，${a < 0 ? '负数反向' : '正数保持'}，边界为 ${n}/${d}。`,
        `Divide both sides by ${a}: ${a < 0 ? 'negative reverses' : 'positive preserves'} direction, with exact boundary ${n}/${d}.`,
      ],
    ];
  } else if (i === 3) {
    const a = 2 + (k % 3),
      b = (k % 5) - 2;
    if (k % 6 === 0 || k % 6 === 1) {
      const truth = k % 6 === 0;
      source = `2(x+1)${truth ? '<=' : '<'}2x+${truth ? 3 : 1}`;
      value = truth ? 'all reals' : 'no solution';
      steps = [
        [
          '变量消失后直接判断常数关系，不除零。',
          'After cancellation, test the constant relation without dividing by zero.',
        ],
      ];
    } else {
      source = `${a}(x+(${b}))${op}${a + 1}x+(${a * b * d + n}/${d})`;
      value = `x${flip}${-n}/${d}`;
      steps = [
        [
          '展开合并得到 −x 与右侧分数，除负一反向，精确边界取负。',
          'Expansion leaves -x against the right fraction; divide by minus one, reversing direction and negating the exact boundary.',
        ],
      ];
    }
  } else {
    const lo = n,
      hi = k % 4 === 1 ? n - 1 : k % 4 === 2 ? n : n + 3,
      left = k % 4 === 3 ? '>' : '>=',
      right = '<=';
    source = `x${left}${lo}/${d};x${right}${hi}/${d}`;
    value =
      k % 4 === 1
        ? 'no solution'
        : k % 4 === 2
          ? `x=${n}/${d}`
          : `${lo}/${d}${left === '>' ? '<' : '<='}x<=${hi}/${d}`;
    steps = [
      [
        '取同时满足的部分，检查端点；相遇须双方包含才保留。',
        'Intersect the conditions and test endpoints; a touching point survives only if both include it.',
      ],
    ];
  }
  const item = I(
    [
      `在实数中求 ${source} 的完整解集。分号表示“且”。`,
      `Find the complete real solution set of ${source}. A semicolon means AND.`,
    ],
    value,
    steps,
    [
      i === 3 && value === 'all reals'
        ? 'no solution'
        : i === 3 && value === 'no solution'
          ? 'all reals'
          : i === 4 && value === 'no solution'
            ? 'all reals'
            : '0',
    ],
  );
  return q(`${id}-R${round}`, i, item);
}
export const j84CheckQuestions: Question[] = [
  q(
    'J84-CHECK-Q1',
    1,
    I(
      ['在实数中解 x+4≤3。', 'Solve x+4≤3 over the reals.'],
      'x<=-1',
      [
        [
          '同减四，方向与等号包含保留。',
          'Subtract four, keeping direction and equality inclusion.',
        ],
      ],
      ['x>=-1', 'x<-1', '-1'],
    ),
  ),
  q(
    'J84-CHECK-Q2',
    2,
    I(
      ['在实数中解 −3x≥2。', 'Solve -3x≥2 over the reals.'],
      'x<=-2/3',
      [
        [
          '同除负三反向，精确边界负三分之二。',
          'Divide by negative three and reverse, with boundary -2/3.',
        ],
      ],
      ['x>=-2/3', 'x<=-0.66', 'x<-2/3'],
    ),
  ),
  q(
    'J84-CHECK-Q3',
    3,
    I(
      [
        '在实数中解 (x+1)/2≥(2x−1)/3。',
        'Solve (x+1)/2≥(2x-1)/3 over the reals.',
      ],
      'x<=5',
      [
        [
          '同乘正六得 3x+3≥4x−2，故 −x≥−5，除负一反向。',
          'Multiply by positive six: 3x+3≥4x-2, hence -x≥-5; divide by minus one and reverse.',
        ],
      ],
      ['x>=5', 'x<5', '5'],
    ),
  ),
  q(
    'J84-CHECK-Q4',
    4,
    I(
      [
        '实数 x 同时满足 x>1、x≤3。',
        'Real x must satisfy x>1 and x≤3 together.',
      ],
      '1<x<=3',
      [
        [
          '一空心，三实心，取两者共同部分。',
          'Open at one, filled at three; take the intersection.',
        ],
      ],
      ['1<=x<=3', '1<x<3', 'x>1'],
      ['(1,3]'],
    ),
  ),
  q(
    'J84-CHECK-Q5',
    4,
    I(
      [
        '实数 x 同时满足 x<0、x≥0。',
        'Real x must satisfy x<0 and x≥0 together.',
      ],
      'no solution',
      [
        [
          '零被严格条件排除，没有共同数。',
          'Zero is excluded by the strict condition, so no value passes both.',
        ],
      ],
      ['x=0', 'all reals'],
    ),
  ),
  q(
    'J84-CHECK-Q6',
    4,
    I(
      [
        '实数 x 同时满足 x≤0、x≥0。',
        'Real x must satisfy x≤0 and x≥0 together.',
      ],
      'x=0',
      [
        [
          '两个闭端相遇，只留零。',
          'Both closed bounds meet, leaving zero only.',
        ],
      ],
      ['no solution', 'all reals', 'x>=0'],
      ['{0}'],
    ),
  ),
  pick('J84-CHECK-Q7', 4, specs[4]!.pick),
  reasoning(
    'J84-CHECK-Q8',
    t(
      '解释完整实数解集、负数乘除反向、端点相遇的两种结果，以及预算整袋数为何不能向上取整。',
      'Explain complete real sets, negative scaling reversal, two outcomes of touching bounds and why budget bag counts cannot be rounded up.',
    ),
    skills[4]!,
    T(specs[4]!.rubric),
    hints[4]!.map(T),
  ),
];
