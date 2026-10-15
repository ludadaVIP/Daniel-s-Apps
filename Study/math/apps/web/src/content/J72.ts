import { t, exactRational, type Lesson, type Question } from '../model';
import { numeric, choice, reasoning } from './builders';
import {
  parsePolynomial,
  polynomialText,
  isCollectedPolynomial,
} from '../polynomialModels';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = {
  stem: Pair;
  value: string;
  step: Pair;
  wrong: string[];
  accepted?: string[];
  variables?: string[];
};
type Pick = {
  stem: Pair;
  correct: number;
  options: { text: Pair; feedback: Pair }[];
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
  'polynomial-substitution',
  'like-monomial-coefficients',
  'distribution-every-term',
  'polynomial-sum-difference',
  'contextual-polynomial-model',
];
const hints: Pair[][] = [
  [
    [
      '先找每个字母的给定值，每次出现都替换同一个数；负数加括号。',
      'Identify each assigned value and replace every occurrence consistently; bracket negative values.',
    ],
    [
      '先乘方，再乘除、加减，保留精确分数。一个代入结果不是一般代数式，也不证明两个式子恒等。',
      'Apply powers before products and sums, keeping exact fractions. One substituted result is not a general expression or proof of identity.',
    ],
  ],
  [
    [
      '逐项比较字母和每个字母的指数，不能只看某次代入数值。',
      'Compare letters and each exponent term by term, rather than one substituted value.',
    ],
    [
      '只合并同一种字母部分的系数，xy 与 yx 可先整理为同一种；零系数项省去，每类保留一个项。',
      'Combine coefficients only for matching variable parts; xy and yx can be put in the same order. Omit zero terms and retain one term per type.',
    ],
  ],
  [
    [
      '圈出外部因子，并连接到括号内每一项；单独的负号就是负一。',
      'Identify the outside factor and connect it to every inside term; a lone minus is negative one.',
    ],
    [
      '先逐项分配，再合并同类项；原本等值的带括号式仍未完成本题要求。',
      'Distribute term by term, then collect. An equivalent form still containing pending distribution has not finished this task.',
    ],
  ],
  [
    [
      '把第二个整式当整体，先确定外面的加号或减号作用于哪些项。',
      'Treat the second polynomial as a whole and identify every term affected by its outside sign.',
    ],
    [
      '减 B 是给 B 的每项乘负一，A 不变；再配同类项，并用结果加 B 还原 A。',
      'Subtracting B negates every B term, leaving A unchanged. Collect matching types and add B back to recover A.',
    ],
  ],
  [
    [
      '先定义字母、单位和取值条件，再区分每人、每袋、整组与所求量。',
      'Define the letter, unit and domain, then distinguish per-person, per-bag and group quantities and the target.',
    ],
    [
      '把原关系写成含字母的式子，允许等值因式形式。当前代入数值不能替代一般式；周长与面积单位不同。',
      'Translate the relationship into an expression; equivalent factored forms are allowed. A current number cannot replace it, and perimeter and area have different units.',
    ],
  ],
];
function q(id: string, i: number, item: Item): Question {
  const r = i === 0 ? exactRational(item.value) : null;
  const variables = item.variables ?? (i === 4 ? ['n'] : ['x']),
    collected = i >= 1 && i <= 3,
    value =
      i === 0
        ? item.value
        : polynomialText(parsePolynomial(item.value, variables)!);
  const result = numeric(
    id,
    T(item.stem),
    value,
    skills[i]!,
    hints[i]!.map(T),
    [T(item.step), T(hints[i]![1]!)],
    {
      accepted: [
        value,
        ...(i === 0 ||
        !collected ||
        isCollectedPolynomial(item.value, variables)
          ? [item.value]
          : []),
        ...(item.accepted ?? []),
        ...(r ? [`${r[0] * 2n}/${r[1] * 2n}`] : []),
      ],
      rejected: item.wrong,
    },
  );
  result.answer =
    i === 0
      ? { kind: 'number', value, formats: ['decimal', 'fraction'] }
      : { kind: 'polynomial', value, variables, collected };
  result.type = i === 4 ? 'word_problem' : 'numeric';
  result.misconceptionTags = [
    skills[i]!,
    'identity-versus-one-value',
    'symbolic-structure',
  ];
  return result;
}
const pick = (id: string, i: number, p: Pick) =>
  choice(
    id,
    T(p.stem),
    p.correct,
    skills[i]!,
    p.options.map((o) => ({ text: T(o.text), feedback: T(o.feedback) })),
    hints[i]!.map(T),
    [T(p.step)],
  );
const specs: Spec[] = [
  {
    title: ['代数式与代入', 'Expressions and substitution'],
    objective: [
      '一致代入正负有理数与两个字母，区分代数式、给定数值与恒等关系。',
      'Substitute signed rationals and two letters consistently, distinguishing expressions, assigned values and identities.',
    ],
    prerequisites: ['P65-L01', 'J71-L06'],
    keywords: [
      ['代数式', 'expression'],
      ['代入', 'substitution'],
      ['恒等', 'identity'],
    ],
    lab: 'poly-substitute',
    hook: [
      'x=−2 时，x²+2x−3 的每个 x 都该怎么替换？两式在 0 和 1 相等能证明恒等吗？',
      'At x=−2, how does each x in x²+2x−3 get replaced? Does agreement at zero and one prove identity?',
    ],
    items: [
      {
        stem: ['x=−2，求 x²+2x−3 的值。', 'At x=−2, evaluate x²+2x−3.'],
        value: '-3',
        step: [
          '(−2)²+2×(−2)−3=4−4−3=−3，平方底数包含代入的负号。',
          '(−2)²+2×(−2)−3=4−4−3=−3; the substituted minus belongs to the squared base.',
        ],
        wrong: ['-11', '5', '-7'],
      },
      {
        stem: ['x=−1/2，求 3x−1 的值。', 'At x=−1/2, evaluate 3x−1.'],
        value: '-5/2',
        step: ['3×(−1/2)−1=−3/2−2/2=−5/2。', '3×(−1/2)−1=−3/2−2/2=−5/2.'],
        wrong: ['1/2', '-3/2', '5/2'],
      },
      {
        stem: ['x=−3/2，求 x²−x 的值。', 'At x=−3/2, evaluate x²−x.'],
        value: '15/4',
        step: [
          '(−3/2)²−(−3/2)=9/4+6/4=15/4，两次 x 用同值。',
          '(−3/2)²−(−3/2)=9/4+6/4=15/4; both occurrences use the same value.',
        ],
        wrong: ['3/4', '-15/4', '-3/4'],
      },
      {
        stem: [
          'x=−1、y=3，求 2xy+x 的值。',
          'At x=−1 and y=3, evaluate 2xy+x.',
        ],
        value: '-7',
        step: [
          '2×(−1)×3+(−1)=−6−1=−7，xy 是乘法。',
          '2×(−1)×3+(−1)=−7; xy denotes multiplication.',
        ],
        wrong: ['-5', '5', '7'],
      },
      {
        stem: [
          'x=−1、y=2，求 x²+y² 的值。',
          'At x=−1 and y=2, evaluate x²+y².',
        ],
        value: '5',
        step: ['(−1)²+2²=1+4=5。', '(−1)²+2²=1+4=5.'],
        wrong: ['3', '1', '9'],
      },
      {
        stem: ['x=−2，求 (1/2)x²−2x 的值。', 'At x=−2, evaluate (1/2)x²−2x.'],
        value: '6',
        step: ['(1/2)×4−2×(−2)=2+4=6。', '(1/2)×4−2×(−2)=2+4=6.'],
        wrong: ['-2', '2', '-6'],
      },
    ],
    pick: {
      stem: [
        'x² 与 x 在 x=0、1 相等，能得出什么？',
        'x² and x agree at x=0 and x=1. What follows?',
      ],
      correct: 1,
      options: [
        {
          text: [
            '已经证明对所有 x 恒等',
            'They are proved identical for every x',
          ],
          feedback: [
            '有限次代入不能代替系数或代数关系证明。',
            'A finite set of substitutions is not a coefficient or algebraic proof.',
          ],
        },
        {
          text: [
            '只知道这两个值相等；x=2 时已不同',
            'Only those two cases agree; x=2 already differs',
          ],
          feedback: [
            '四与二提供明确反例。',
            'Four versus two is a specific counterexample.',
          ],
        },
        {
          text: [
            '所有含平方的式子都不能代入负数',
            'Any squared expression forbids negative substitutions',
          ],
          feedback: [
            '平方允许负底数，代入时用括号。',
            'Negative bases may be squared; use brackets.',
          ],
        },
      ],
      step: [
        '代入用于计算或反驳普遍断言，几次吻合不证明恒等。',
        'Substitution calculates or refutes a universal claim; a few agreements do not prove identity.',
      ],
    },
    reason: [
      '解释负数代入 x² 与 −x² 时的底数范围，并用反例说明“试两次相等”不证明恒等。',
      'Explain the power base after a negative substitution in x² and −x², and give a counterexample to proving identity by two trials.',
    ],
    rubric: [
      'x=−2 时 x²=(−2)²=4，−x²=−[(−2)²]=−4；同一个字母每次出现都替换同一个给定值，外部运算不随意改变。x² 与 x 在零和一吻合，但在二分别四和二，因此不是恒等式。代数式不带等号，代入值只是给定赋值下的一个数；一般关系不能用这个数替代。家长核对每个字母、括号、负号角色及具体反例，不把两次计算正确当作普遍证明。',
      'At x=−2, x²=(−2)²=4, whereas −x²=−[(−2)²]=−4. Replace every occurrence of a letter by the same assigned value while preserving outside operations. x² and x match at zero and one but differ at two, giving four and two, so they are not identical. An expression has no equal sign; its substituted value is only a number for one assignment. Check every letter, brackets, sign roles and a specific counterexample rather than treating two successful trials as proof.',
    ],
    misconception: [
      '只代一个 x；负值代入平方不加括号；把数值相等当恒等。',
      'Substituting one occurrence only, omitting brackets around a negative base, or confusing numerical agreement with identity.',
    ],
    prompts: [
      ['每一个 x 用的还是同一个值吗？', 'Does every x receive the same value?'],
      [
        '能找一个让两式不相等的值吗？',
        'Can you find an assignment where the expressions differ?',
      ],
    ],
  },
  {
    title: ['合并同类项', 'Combining like terms'],
    objective: [
      '按字母及对应指数归类，只合并系数，保留多变量项与零项抵消的准确关系。',
      'Classify terms by letters and matching exponents, combining coefficients while respecting multivariable types and cancellation.',
    ],
    prerequisites: ['J72-L01', 'J71-L03'],
    keywords: [
      ['同类项', 'like terms'],
      ['系数', 'coefficient'],
      ['字母部分', 'variable part'],
    ],
    lab: 'poly-like',
    hook: [
      '3x²+4x² 可合并成什么？若第二项改成 4x，为什么不能照搬？',
      'What does 3x²+4x² combine to? Why does replacing the second term with 4x change the reasoning?',
    ],
    items: [
      {
        stem: [
          '合并同类项，每种字母部分只写一个项：3x²−2x+4x²+5x。',
          'Collect like terms, retaining one term per variable part: 3x²−2x+4x²+5x.',
        ],
        value: '7x^2+3x',
        accepted: ['3x+7x²'],
        step: [
          '平方项系数 3+4=7，一次项 −2+5=3；字母指数不变。',
          'Square coefficients 3+4=7 and linear coefficients −2+5=3; variable exponents stay unchanged.',
        ],
        wrong: ['7x^3+3x', '10x^2', '3x^2+4x^2+3x'],
      },
      {
        stem: ['合并 5xy−2yx+3y。', 'Collect 5xy−2yx+3y.'],
        value: '3xy+3y',
        variables: ['x', 'y'],
        accepted: ['3y+3yx'],
        step: [
          'xy=yx，系数五减二得三；单独 y 的项不混入 xy。',
          'xy=yx, giving coefficient 5−2=3; a y term does not merge with xy.',
        ],
        wrong: ['6xy', '3x', '5xy-2yx+3y'],
      },
      {
        stem: ['合并 (1/2)x+(1/3)x−2。', 'Collect (1/2)x+(1/3)x−2.'],
        value: '(5/6)x-2',
        accepted: ['5x/6-2'],
        step: [
          '系数 1/2+1/3=5/6，常数负二保持。',
          'Coefficients sum to 5/6; retain constant negative two.',
        ],
        wrong: ['(2/5)x-2', '(5/6)x^2-2', '(1/2)x+(1/3)x-2'],
      },
      {
        stem: [
          '完成合并并省去零项：4x²−4x²+x−x。',
          'Finish collecting and omit zero terms: 4x²−4x²+x−x.',
        ],
        value: '0',
        step: [
          '同类项分别抵消，整个式子恒为零；零不是没有答案。',
          'Both types cancel, so the expression is identically zero, not unanswered.',
        ],
        wrong: ['x', 'x^2', 'x-x'],
      },
      {
        stem: ['合并 2x²+3x+1−x²+x−4。', 'Collect 2x²+3x+1−x²+x−4.'],
        value: 'x^2+4x-3',
        accepted: ['-3+4x+x²'],
        step: [
          '平方系数二减一，一次系数三加一，常数一减四。',
          'Square coefficient 2−1, linear coefficient 3+1, constant 1−4.',
        ],
        wrong: ['5x^2-3', 'x^2+2x+5', '2x^2-x^2+4x-3'],
      },
      {
        stem: ['合并 3x²+2xy−x²+5yx。', 'Collect 3x²+2xy−x²+5yx.'],
        value: '2x^2+7xy',
        variables: ['x', 'y'],
        accepted: ['7yx+2x²'],
        step: [
          'x² 系数二，xy 与 yx 同类系数七；两类不能再合。',
          'The x² coefficient is two; xy and yx combine to seven. The two types remain separate.',
        ],
        wrong: ['9x^2y', '2x^2+7x', '3x^2-x^2+7xy'],
      },
    ],
    pick: {
      stem: [
        '哪种同类项判断正确？',
        'Which classification of like terms is correct?',
      ],
      correct: 2,
      options: [
        {
          text: [
            'x² 与 x 同类，因为字母相同',
            'x² and x are like because both contain x',
          ],
          feedback: [
            '还需对应指数相同。',
            'Their corresponding exponents must also match.',
          ],
        },
        {
          text: [
            'xy 与 yx 永不相同，因为顺序不同',
            'xy and yx never match because order differs',
          ],
          feedback: [
            '乘法交换律允许先整理字母顺序。',
            'Commutativity permits rearranging the factors.',
          ],
        },
        {
          text: [
            'xy 与 yx 同类，x² 与 x 不同类',
            'xy and yx are like; x² and x are unlike',
          ],
          feedback: [
            '比较完整字母部分及指数，而非书写次序。',
            'Compare full variable parts and powers, not factor order.',
          ],
        },
      ],
      step: [
        '合并的是同一种字母部分有多少份，不改变类型。',
        'Combining counts copies of one variable part; it does not change the type.',
      ],
    },
    reason: [
      '为什么 x² 与 x 在 x=1 相等也不能归同类？合并后系数零怎样处理？',
      'Why are x² and x unlike even though both equal one at x=1? How are zero coefficients treated after collection?',
    ],
    rubric: [
      '同类项由字母与每个指数决定，不由一次代入决定。x² 和 x 的指数二与一不同，在 x=2 也已给四与二的反例。3x²+4x² 是同类型七份，不能变 x⁴；xy 与 yx 可由乘法交换律归同类。系数相反时同类项抵消，结果里省去零项；若所有类都抵消写零。合并前各原项可以分组登记，不能无理由丢项。家长检查类型、系数相加、字母部分保持、抵消边界与代入反例。',
      'Like terms are determined by letters and every exponent, not a single substitution. x² and x have different powers; x=2 already gives four versus two. 3x²+4x² gives seven copies of x², not x⁴. xy and yx match by commuting factors. Opposite coefficients cancel and zero terms are omitted; write zero if every type cancels. Grouping must retain original terms rather than silently discard them. Check types, coefficient sums, unchanged variable parts, cancellation and a numerical counterexample.',
    ],
    misconception: [
      '同字母就合并，指数相加；把 xy 当 x+y；把零当空答案。',
      'Combining whenever letters appear, adding exponents during addition, treating xy as x+y, or leaving zero blank.',
    ],
    prompts: [
      [
        '这一项的完整字母部分是什么？',
        'What is this term’s full variable part?',
      ],
      [
        '你合并的是系数，还是偷偷改了指数？',
        'Are you adding coefficients or silently changing powers?',
      ],
    ],
  },
  {
    title: ['乘法分配律与去括号', 'Distributive law and expanding brackets'],
    objective: [
      '把外部正负因子分配到每项，解释负一与零的边界并完成合并。',
      'Distribute an outside signed factor to every term, explaining negative-one and zero boundaries and completing collection.',
    ],
    prerequisites: ['J72-L02', 'P65-L03', 'J71-L05'],
    keywords: [
      ['分配律', 'distributive law'],
      ['去括号', 'expansion'],
      ['负一因子', 'factor negative one'],
    ],
    lab: 'poly-distribute',
    hook: [
      '−2(3x−4) 的负二会只乘 3x 吗？单独的负号又代表哪个因子？',
      'Does the negative two in −2(3x−4) multiply only 3x? Which factor does a lone minus represent?',
    ],
    items: [
      {
        stem: ['去括号并合并：−2(3x−4)。', 'Expand and collect: −2(3x−4).'],
        value: '-6x+8',
        accepted: ['8-6x'],
        step: [
          '负二乘三 x 得 −6x，负二乘负四得正八。',
          'Negative two times 3x gives −6x; times negative four gives positive eight.',
        ],
        wrong: ['-6x-4', '-6x-8', '-2(3x-4)'],
      },
      {
        stem: ['去括号并合并：−(x²−2x+3)。', 'Expand and collect: −(x²−2x+3).'],
        value: '-x^2+2x-3',
        step: [
          '外部因子负一依次乘三项，全部项都变相反数。',
          'Factor negative one multiplies all three terms, taking each opposite.',
        ],
        wrong: ['-x^2-2x+3', 'x^2+2x-3', '-(x^2-2x+3)'],
      },
      {
        stem: [
          '去括号并合并：3(x+2)−2(x−1)。',
          'Expand and collect: 3(x+2)−2(x−1).',
        ],
        value: 'x+8',
        accepted: ['8+x'],
        step: [
          '3x+6−2x+2=x+8，第二组外部因子为负二。',
          '3x+6−2x+2=x+8; the second outside factor is negative two.',
        ],
        wrong: ['x+4', '5x+4', '3x-2x+8'],
      },
      {
        stem: [
          '去括号并合并：(1/2)(4x²−6x)。',
          'Expand and collect: (1/2)(4x²−6x).',
        ],
        value: '2x^2-3x',
        step: [
          '半乘两项，分别二 x² 与负三 x。',
          'One half multiplies both terms, giving 2x² and −3x.',
        ],
        wrong: ['2x^2-6x', '2x^2+3x', '(1/2)(4x^2-6x)'],
      },
      {
        stem: [
          '去括号并省去零项：0(x²−2x+5)。',
          'Expand and omit zero terms: 0(x²−2x+5).',
        ],
        value: '0',
        step: [
          '零乘每项都为零，整体为零，不剩常数五。',
          'Zero times every term is zero; the constant five does not survive.',
        ],
        wrong: ['5', 'x^2-2x+5', '0x^2+0x'],
      },
      {
        stem: [
          '去括号并合并：−3(2x−1)+2(x²−x)。',
          'Expand and collect: −3(2x−1)+2(x²−x).',
        ],
        value: '2x^2-8x+3',
        step: ['−6x+3+2x²−2x=2x²−8x+3。', '−6x+3+2x²−2x=2x²−8x+3.'],
        wrong: ['2x^2-4x-3', '2x^2-8x-3', '-6x+3+2x^2-2x'],
      },
    ],
    pick: {
      stem: [
        '去括号 −(x−y)，哪一式恒等？',
        'Which expression is identical to −(x−y)?',
      ],
      correct: 1,
      options: [
        {
          text: ['−x−y', '−x−y'],
          feedback: [
            '负一乘负 y 应得正 y。',
            'Negative one times negative y gives positive y.',
          ],
        },
        {
          text: ['−x+y', '−x+y'],
          feedback: [
            '外部负一乘到每一项。',
            'Factor negative one reaches every term.',
          ],
        },
        {
          text: ['x−y', 'x−y'],
          feedback: [
            '这忽略了外部负一。',
            'This ignores the outside negative one.',
          ],
        },
      ],
      step: [
        '取整组相反数需每项分别取相反数。',
        'Taking the opposite of a whole sum takes the opposite of every term.',
      ],
    },
    reason: [
      '说明 −2(3x−4) 为什么是 −6x+8，并解释因子改零后所有项的变化。',
      'Explain why −2(3x−4)=−6x+8 and what happens to every term if the factor becomes zero.',
    ],
    rubric: [
      '按分配律外部因子乘每项：−2×3x=−6x，−2×(−4)=8，原常数也要乘。负号可视为负一，不只改变第一项；因子零时两项贡献都零，不能保留负四或正八。展开后若同类项仍重复，继续合并，不能把原带括号式当完成答案。具体代入可发现漏项，如 x=0 时原式八、漏乘常数的错式不同，但几次吻合不能证明恒等；证明来自逐项分配。家长检查每条乘法连接、符号、零与合并。',
      'Distribution applies the outside factor to every term: −2×3x=−6x and −2×(−4)=8. The constant also receives the factor. A lone minus is negative one, not an instruction to alter only the first term. A zero factor makes both contributions zero. Collect any remaining repeated types; the unchanged factored input is not a completed expansion. Substitution can expose a missing term, such as x=0, but a few matches do not prove identity; term-by-term distribution provides the general reason. Check each multiplication, signs, zero and collection.',
    ],
    misconception: [
      '只乘第一项；外部负号只改第一个符号；零乘括号留下常数。',
      'Multiplying only the first term, negating only the first sign, or retaining a constant after multiplying the bracket by zero.',
    ],
    prompts: [
      [
        '外部因子是否连接了每一项？',
        'Does the outside factor reach every term?',
      ],
      [
        '把 x 设零，漏乘的常数会暴露吗？',
        'Does x=0 expose an undistributed constant?',
      ],
    ],
  },
  {
    title: ['整式加减', 'Adding and subtracting expressions'],
    objective: [
      '把整式视为整体，正确处理第二式的外部符号，按类型合并并反查。',
      'Treat each polynomial as a whole, apply the outside sign to the second expression, collect by type and verify inversely.',
    ],
    prerequisites: ['J72-L03', 'J71-L04'],
    keywords: [
      ['整式', 'polynomial'],
      ['整体相反数', 'opposite of a whole expression'],
      ['系数匹配', 'coefficient matching'],
    ],
    lab: 'poly-sum',
    hook: [
      'A−B 中，B 含三项时只减第一项够吗？A 也要一起取相反数吗？',
      'When B has three terms in A−B, is subtracting its first term enough? Should A also be negated?',
    ],
    items: [
      {
        stem: [
          '完成整式减法并合并：(2x²−x+3)−(x²+2x−4)。',
          'Subtract and collect: (2x²−x+3)−(x²+2x−4).',
        ],
        value: 'x^2-3x+7',
        step: [
          'A 不变，B 各项取相反数得 −x²−2x+4，再合并。',
          'Keep A unchanged; negate B to −x²−2x+4, then collect.',
        ],
        wrong: ['x^2+x-1', '-x^2+3x-7', '2x^2-x+3-x^2-2x+4'],
      },
      {
        stem: [
          '完成整式加法并合并：(x²+3x−2)+(2x²−x+5)。',
          'Add and collect: (x²+3x−2)+(2x²−x+5).',
        ],
        value: '3x^2+2x+3',
        step: [
          '加号保留第二式符号，同类系数分别合并。',
          'Addition preserves the second expression’s signs; combine matching coefficients.',
        ],
        wrong: ['3x^2+4x-7', '3x^2+2x-7', 'x^2+2x^2+2x+3'],
      },
      {
        stem: [
          '完成减法并合并：(3xy−2y)−(xy+4y)。',
          'Subtract and collect: (3xy−2y)−(xy+4y).',
        ],
        value: '2xy-6y',
        variables: ['x', 'y'],
        step: ['3xy−2y−xy−4y=2xy−6y。', '3xy−2y−xy−4y=2xy−6y.'],
        wrong: ['2xy+2y', '-2xy+6y', '3xy-xy-6y'],
      },
      {
        stem: [
          '完成减法并合并：[(1/2)x²+x]−[(1/3)x²−2x]。',
          'Subtract and collect: [(1/2)x²+x]−[(1/3)x²−2x].',
        ],
        value: '(1/6)x^2+3x',
        accepted: ['x²/6+3x'],
        step: [
          '平方系数半减三分之一得六分之一；一次系数一减负二得三。',
          'The square coefficient is 1/2−1/3=1/6; the linear coefficient is 1−(−2)=3.',
        ],
        wrong: ['(1/6)x^2-x', '(5/6)x^2+3x', '(1/2)x^2-(1/3)x^2+3x'],
      },
      {
        stem: [
          '完成合并：(x²+2x+1)−(x²+2x+1)。',
          'Finish collecting: (x²+2x+1)−(x²+2x+1).',
        ],
        value: '0',
        step: [
          '相同整式相减，各类系数都为零。',
          'Subtracting identical polynomials cancels every coefficient.',
        ],
        wrong: ['2x^2+4x+2', '1', 'x^2-x^2'],
      },
      {
        stem: [
          '完成减法并合并：(4x²−3x+2)−(x²−x−5)。',
          'Subtract and collect: (4x²−3x+2)−(x²−x−5).',
        ],
        value: '3x^2-2x+7',
        step: [
          '第二式取反为 −x²+x+5，结果 3x²−2x+7。',
          'Negate the second expression to −x²+x+5, giving 3x²−2x+7.',
        ],
        wrong: ['3x^2-4x-3', '5x^2-4x-3', '4x^2-x^2-2x+7'],
      },
    ],
    pick: {
      stem: [
        '把 A、B、C 视为完整整式，哪条去括号关系正确？',
        'Treat A, B and C as whole polynomials. Which rewrite is correct?',
      ],
      correct: 2,
      options: [
        {
          text: ['A−(B−C)=A−B−C', 'A−(B−C)=A−B−C'],
          feedback: [
            '括号内负 C 乘外部负一成为正 C。',
            'Inside −C becomes +C under the outside minus.',
          ],
        },
        {
          text: ['A−(B−C)=−A+B−C', 'A−(B−C)=−A+B−C'],
          feedback: [
            '第一式 A 不该被额外取反。',
            'The first expression A should not be negated.',
          ],
        },
        {
          text: ['A−(B−C)=A−B+C', 'A−(B−C)=A−B+C'],
          feedback: [
            '外部负号作用于括号内两项。',
            'The outside minus affects both inside terms.',
          ],
        },
      ],
      step: [
        '先保持对象分组，再按分配律处理外部符号。',
        'Keep whole-object grouping before distributing an outside sign.',
      ],
    },
    reason: [
      '给出 (2x²−x+3)−(x²+2x−4) 的逐项理由，并用结果加回第二式核验。',
      'Explain each term in (2x²−x+3)−(x²+2x−4), then add the second expression back to check.',
    ],
    rubric: [
      '第一式保持 2x²−x+3；第二式整体相反数为 −x²−2x+4，三个符号都要处理。按平方、一次、常数分别合并得 x²−3x+7；常数三减负四是七。加回原第二式，x²−3x+7+x²+2x−4=2x²−x+3，还原 A。不能把 A 也取反，不能只改 B 第一项；原本等值但仍有重复同类项的式子需继续合并。家长核对每项身份、完整符号作用、类型和加回关系。',
      'Retain A=2x²−x+3. The opposite of B is −x²−2x+4, changing all three term signs. Collect square, linear and constant coefficients to obtain x²−3x+7; three minus negative four is seven. Adding original B back gives 2x²−x+3, recovering A. Do not negate A or alter only B’s first term. Equivalent intermediate forms with repeated types still need collection. Check each term’s identity, full sign scope, variable types and the add-back relationship.',
    ],
    misconception: [
      '整式减法只减第一项；外部负号作用到 A；把加号后的 B 也取反。',
      'Subtracting only the first term, applying the outside minus to A, or negating B even after addition.',
    ],
    prompts: [
      [
        '第二式究竟包含哪些完整项？',
        'Which complete terms belong to the second expression?',
      ],
      [
        '加回原第二式，能恢复第一式吗？',
        'Does adding back the original second expression recover the first?',
      ],
    ],
  },
  {
    title: ['从文字题建立代数式', 'Modelling word problems with expressions'],
    objective: [
      '定义变量、单位与条件，把每份、固定量、周长和面积译为一般代数式。',
      'Define variables, units and conditions and translate per-item, fixed, perimeter and area relationships into general expressions.',
    ],
    prerequisites: ['J72-L04', 'P65-L02', 'P68-L03'],
    keywords: [
      ['变量定义', 'variable definition'],
      ['数量关系', 'quantity relationship'],
      ['情境条件', 'context conditions'],
    ],
    lab: 'poly-story',
    hook: [
      'n 人每人四元加一次组费六元，是 4n+6 还是 n(4+6)？若改问面积，关系怎么变？',
      'For n people, four each plus one group fee six, is the cost 4n+6 or n(4+6)? How does a request for area change the relationship?',
    ],
    items: [
      {
        stem: [
          '虚构团体 n 人，n 为正整数；每人票 NZ$4，一次整组费用 NZ$6。用 n 写总费用的一般式，单位 NZD 不写入答案。',
          'A fictional group has positive integer n people, NZ$4 tickets each and one NZ$6 group fee. Write total cost in n; omit the NZD unit from the expression.',
        ],
        value: '4n+6',
        accepted: ['6+4*n', '2(2n+3)'],
        step: [
          '按人项四乘 n，再加一次固定六，不是每人多收六。',
          'Per-person cost is 4n; add fixed six once, not once per person.',
        ],
        wrong: ['10n', '18', '4n+6 NZD'],
      },
      {
        stem: [
          '三袋铅笔，每袋 n+2 支，n 为非负整数。用 n 写总支数，允许因式形式。',
          'Three bags each contain n+2 pencils, where n is a non-negative integer. Model total pencils in n; a factored form is allowed.',
        ],
        value: '3n+6',
        accepted: ['3(n+2)', '(n+2)3'],
        step: [
          '每袋内部两支也重复三次，总量 3(n+2)=3n+6。',
          'The extra two are inside every bag: 3(n+2)=3n+6.',
        ],
        wrong: ['3n+2', '3n+5', '15'],
      },
      {
        stem: [
          '长方形长 n+2 cm，宽 n cm，n>0。用 n 写周长，不写单位。',
          'A rectangle is n+2 cm long and n cm wide, with n>0. Model perimeter in n, omitting units.',
        ],
        value: '4n+4',
        accepted: ['2((n+2)+n)', '2(n+2)+2n'],
        step: [
          '两条长和两条宽，2(n+2)+2n=4n+4，求的是边界。',
          'Two lengths and two widths give 4n+4, measuring the boundary.',
        ],
        wrong: ['n^2+2n', '2n+2', '16'],
      },
      {
        stem: [
          '同一长方形长 n+2 cm、宽 n cm，n>0。用 n 写面积，不写单位。',
          'The same rectangle is n+2 cm by n cm, with n>0. Model area in n, omitting units.',
        ],
        value: 'n^2+2n',
        accepted: ['n(n+2)', '(n+2)*n'],
        step: [
          '覆盖面积长乘宽，n(n+2)=n²+2n；面积单位是 cm²。',
          'Coverage is length × width: n(n+2)=n²+2n, measured in cm².',
        ],
        wrong: ['4n+4', '2n+2', '15'],
      },
      {
        stem: [
          '虚构购买 n 本练习本，每本 NZ$5，一次整单优惠 NZ$2，n 为正整数。用 n 写付款金额。',
          'A fictional order has positive integer n notebooks at NZ$5 each and one NZ$2 order discount. Model the payment in n.',
        ],
        value: '5n-2',
        accepted: ['-2+5n'],
        step: [
          '先按本数付 5n，整单只减二，不是每本减二。',
          'Item cost is 5n; subtract two once for the order, not from every item.',
        ],
        wrong: ['3n', '5n+2', '13'],
      },
      {
        stem: [
          '长方形长 2n+1 cm、宽 n+3 cm，n>0。用 n 写周长，允许因式形式。',
          'A rectangle has length 2n+1 cm and width n+3 cm, n>0. Model perimeter in n; a factored form is allowed.',
        ],
        value: '6n+8',
        accepted: ['2((2n+1)+(n+3))', '2(3n+4)'],
        step: [
          '两种边各两条，2[(2n+1)+(n+3)]=6n+8。',
          'Each side type occurs twice: 2[(2n+1)+(n+3)]=6n+8.',
        ],
        wrong: ['(2n+1)(n+3)', '3n+4', '26'],
      },
    ],
    pick: {
      stem: [
        'n 人每人四元加一次整组六元，哪个说法正确？',
        'For n people at four each plus one group fee six, which statement is correct?',
      ],
      correct: 0,
      options: [
        {
          text: [
            '4n+6，n 为正整数；具体值随 n 变化',
            '4n+6, with positive integer n; its numerical value changes with n',
          ],
          feedback: [
            '固定费只计一次，一般式保留变量。',
            'Count the fixed fee once and retain the variable in the general expression.',
          ],
        },
        {
          text: [
            '10n，因为把所有钱先相加再乘人数',
            '10n, adding all prices before multiplying by people',
          ],
          feedback: [
            '把整组费用错误收了 n 次。',
            'That charges the group fee n times.',
          ],
        },
        {
          text: [
            '18，因为选 n=3 后便能代替一般式',
            '18, because selecting n=3 replaces the general expression',
          ],
          feedback: [
            '十八只回答三人那一次，不描述其他人数。',
            'Eighteen describes only the three-person case.',
          ],
        },
      ],
      step: [
        '变量定义与收费角色决定关系，不靠把所有数字随意组合。',
        'Variable definitions and charging roles determine the relationship, not arbitrary number combinations.',
      ],
    },
    reason: [
      '用长 n+2、宽 n 解释周长与面积的不同一般式、单位和条件；为什么试两个人数或长度不能代替推导？',
      'For length n+2 and width n, explain different perimeter and area expressions, units and conditions. Why do two test values not replace a derivation?',
    ],
    rubric: [
      '设 n 为宽的厘米数，要求 n>0；长 n+2 也为正。周长是两条长加两条宽，4n+4 cm；面积是覆盖量 n(n+2)=n²+2n cm²。n=3 时十六与十五是不同量的一次代入，不能把其中一个数当一般式。计费情境中 n 是正整数人数而非任意负数，固定费只计一次。测试值能发现错误，但通用依据来自边与面积或每份费用的组成。接受因式和展开形式，只要精确恒等且变量、目标、单位与条件匹配。家长核对关系来源与取值意义。',
      'Let n be the width in centimetres with n>0, so length n+2 is also positive. Perimeter adds two lengths and two widths, giving 4n+4 cm; area measures coverage, n(n+2)=n²+2n cm². At n=3, sixteen and fifteen are different quantities for one assignment, not general expressions. In a ticket story n instead counts positive integer people, with one fixed fee. Trial values can reveal mistakes, but general reasoning comes from side composition, area or per-person costs. Accept equivalent factored and expanded forms when variables, target, units and conditions match.',
    ],
    misconception: [
      '把固定量乘人数；用一次代入数替代一般式；周长和面积混用；忘记变量范围。',
      'Multiplying a fixed fee by people, replacing a general expression with one value, confusing perimeter and area, or omitting the variable domain.',
    ],
    prompts: [
      [
        '这个字母数的是什么，允许哪些值？',
        'What does the letter measure or count, and which values are allowed?',
      ],
      [
        '这笔钱或这条边为什么只算一次或算两次？',
        'Why is this fee counted once or this side counted twice?',
      ],
    ],
  },
];
export const j72Lessons: Lesson[] = specs.map((s, i) => {
  const id = `J72-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: i === 4 ? 26 : 22,
    lab: s.lab,
    hook: T(s.hook),
    stage: 'J07',
    unit: 'J72',
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
            '纸上自拟一个虚构按人数收费加一次固定费的问题，再画长为 n+2、宽为 n 的长方形。先定义变量和条件，分别写费用、周长和面积式，说明哪些固定量重复、哪些不重复。选两个允许值检错，再给出不依赖试数的关系推导；用负因子与平方项设计一条错误化简并纠正。只需纸笔，不要求购买或实测。',
            'On paper, invent a fictional per-person cost with one fixed fee and draw a rectangle n+2 by n. Define variables and domains, then model cost, perimeter and area, explaining which fixed amounts repeat. Use two allowed values to check for errors, followed by a relationship-based derivation rather than numerical proof. Create and correct a false simplification involving a negative factor and a square term. Paper is sufficient; no purchase or measurement is needed.',
          ),
        }
      : {}),
  };
});
export function j72ReviewQuestion(id: string, round: number): Question {
  if (
    !/^J72-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid J72 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 80,
    a = (k % 7) - 3,
    b = 1 + (Math.floor(k / 7) % 5),
    c = (k % 5) - 2;
  let item: Item;
  if (i === 0) {
    const d = [1, 2, 4][k % 3]!,
      n = a;
    item = {
      stem: [
        `x=${n}/${d}，求 x²+${b}x+(${c}) 的值。`,
        `At x=${n}/${d}, evaluate x²+${b}x+(${c}).`,
      ],
      value: `${n * n + b * n * d + c * d * d}/${d * d}`,
      step: [
        `每个 x 同代 ${n}/${d}，先平方，再乘加；保留精确分数。`,
        `Substitute ${n}/${d} consistently; square, multiply and add exactly.`,
      ],
      wrong: [String(a * a + b + 20)],
    };
  } else if (i === 1)
    item = {
      stem: [
        `合并 ${a}x²+${b}x+(${c})x²−x。`,
        `Collect ${a}x²+${b}x+(${c})x²−x.`,
      ],
      value: `${a + c}x^2+(${b - 1})x`,
      accepted: [],
      step: [
        `平方系数 ${a + c}，一次系数 ${b - 1}；系数零的项省去。`,
        `Square coefficient ${a + c}, linear coefficient ${b - 1}; omit zero terms.`,
      ],
      wrong: [`${a}x^2+${c}x^2+${b - 1}x`],
    };
  else if (i === 2)
    item = {
      stem: [
        `去括号并合并 ${a}(${b}x+(${c}))。`,
        `Expand and collect ${a}(${b}x+(${c})).`,
      ],
      value: `${a * b}x+(${a * c})`,
      step: [
        `外部 ${a} 分别乘两项，得 ${a * b}x 与 ${a * c}。`,
        `Outside ${a} multiplies both terms, giving ${a * b}x and ${a * c}.`,
      ],
      wrong: [`${a}(${b}x+(${c}))`],
    };
  else if (i === 3)
    item = {
      stem: [
        `完成整式减法并合并 (${b}x²+${a}x+2)−(x²+${c}x−3)。`,
        `Subtract and collect (${b}x²+${a}x+2)−(x²+${c}x−3).`,
      ],
      value: `${b - 1}x^2+(${a - c})x+5`,
      step: [
        `分别系数相减，常数二减负三为五。`,
        `Subtract matching coefficients; constant two minus negative three is five.`,
      ],
      wrong: [`${b}x^2-x^2+(${a - c})x+5`],
    };
  else
    item = {
      stem: [
        `虚构组票 n 人，每人 NZ$${b + 2}，另加一次组费 NZ$${a + 4}。n 为正整数，写一般付款式。`,
        `Fictional group tickets for positive integer n: NZ$${b + 2} each plus one NZ$${a + 4} group fee. Model total payment.`,
      ],
      value: `${b + 2}n+${a + 4}`,
      accepted: [`${a + 4}+${b + 2}n`],
      step: [
        `按人项为 ${b + 2}n，再加一次 ${a + 4}。`,
        `Per-person term ${b + 2}n plus fixed ${a + 4} once.`,
      ],
      wrong: [`${b + a + 6}n`, String(3 * (b + 2) + a + 4)],
    };
  return q(`${id}-R${round}`, i, item);
}
export const j72CheckQuestions: Question[] = [
  q('J72-CHECK-Q1', 0, {
    stem: ['x=−2，求 2x²−3x+1 的值。', 'At x=−2, evaluate 2x²−3x+1.'],
    value: '15',
    step: ['八加六加一等于十五。', 'Eight plus six plus one is fifteen.'],
    wrong: ['-1', '3'],
  }),
  q('J72-CHECK-Q2', 1, {
    stem: ['合并 2x²+3x²−x。', 'Collect 2x²+3x²−x.'],
    value: '5x^2-x',
    step: [
      '同类平方项系数五，保留负 x。',
      'The square coefficient becomes five; retain negative x.',
    ],
    wrong: ['5x^4-x', '2x^2+3x^2-x'],
  }),
  q('J72-CHECK-Q3', 2, {
    stem: ['去括号并合并 −3(x−2)。', 'Expand and collect −3(x−2).'],
    value: '-3x+6',
    step: [
      '负三分别乘 x 和负二。',
      'Negative three multiplies x and negative two.',
    ],
    wrong: ['-3x-2', '-3(x-2)'],
  }),
  q('J72-CHECK-Q4', 3, {
    stem: [
      '完成减法并合并 (2x²+x−1)−(x²−2x+4)。',
      'Subtract and collect (2x²+x−1)−(x²−2x+4).',
    ],
    value: 'x^2+3x-5',
    step: [
      '平方系数一、一次系数三、常数负五。',
      'Square coefficient one, linear coefficient three, constant negative five.',
    ],
    wrong: ['x^2-x+3', '2x^2-x^2+3x-5'],
  }),
  q('J72-CHECK-Q5', 1, {
    stem: ['合并 2xy+3yx−y。', 'Collect 2xy+3yx−y.'],
    value: '5xy-y',
    variables: ['x', 'y'],
    step: [
      'xy 与 yx 同类合成五份，单独负 y 保留。',
      'xy and yx combine to five copies; retain separate negative y.',
    ],
    wrong: ['4xy', '2xy+3yx-y'],
  }),
  q('J72-CHECK-Q6', 4, {
    stem: [
      '虚构 n 人票费每人三元，一次组费五元，n 为正整数。写总费一般式。',
      'Fictional positive integer n people pay three each plus one group fee five. Model total cost.',
    ],
    value: '3n+5',
    accepted: ['5+3n'],
    step: ['按人三 n 加一次五。', 'Per-person 3n plus five once.'],
    wrong: ['8n', '14'],
  }),
  pick('J72-CHECK-Q7', 0, specs[0]!.pick),
  reasoning(
    'J72-CHECK-Q8',
    t(
      '解释整式相减为何要改变第二式每项符号；再为长 n+2、宽 n 的长方形写周长和面积，说明单位、条件及试数的局限。',
      'Explain why subtracting a polynomial changes every second-expression sign. Then model perimeter and area of a rectangle n+2 by n, including units, domain and limits of trial values.',
    ),
    skills[4]!,
    t(
      'A−B 是加 B 的整体相反数，A 保留；如 B=x²+2x−4，就加 −x²−2x+4，再按类型合并，可用结果加原 B 反查。长方形 n>0，周长两长两宽为 4n+4 cm，面积长乘宽为 n²+2n cm²；一个代入数不替代一般式。有限试数能找到反例，却不能证明恒等，精确系数匹配与数量关系给一般依据。家长检查外部符号范围、平方与一次类型、所有项的保留、目标单位与变量条件。',
      'A−B adds the opposite of all of B while retaining A. If B=x²+2x−4, add −x²−2x+4, collect by type and verify by adding original B back. For n>0, the rectangle has perimeter 4n+4 cm and area n²+2n cm². One substituted number cannot replace a general expression. Finite trials can refute identity but do not prove it; exact coefficient matching and quantity relationships provide general reasons. Check sign scope, square versus linear types, retained terms, target units and the variable domain.',
    ),
    hints[4]!.map(T),
  ),
];
