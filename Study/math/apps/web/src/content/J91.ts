import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import {
  squareRoots,
  rootBracket,
  realCases,
  radicalClass,
  type RealClass,
} from '../radicalModels';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = {
  stem: Pair;
  value: string;
  steps: Pair[];
  wrong: string[];
  mode:
    | 'radical'
    | 'root-set'
    | 'real-class'
    | 'root-rounded'
    | 'number'
    | 'explain';
  radicand?: string;
  places?: number;
  simplified?: boolean;
  accepted?: string[];
  diagram?: Question['diagram'];
};
const R = (
  stem: Pair,
  value: string,
  steps: Pair[],
  wrong: string[],
  simplified = true,
  diagram?: Question['diagram'],
): Item => ({
  stem,
  value,
  steps,
  wrong,
  mode: 'radical',
  simplified,
  diagram,
});
const S = (
  stem: Pair,
  radicand: string,
  steps: Pair[],
  wrong: string[],
): Item => ({
  ...R(stem, squareRoots(radicand).join(',') || 'no real roots', steps, wrong),
  mode: 'root-set',
  radicand,
});
const C = (
  stem: Pair,
  value: RealClass,
  steps: Pair[],
  wrong: string[],
): Item => ({ ...R(stem, value, steps, wrong), mode: 'real-class' });
const D = (
  stem: Pair,
  radicand: string,
  places: number,
  steps: Pair[],
  wrong: string[],
): Item => ({
  ...R(stem, rootBracket(radicand, places).rounded, steps, wrong),
  mode: 'root-rounded',
  radicand,
  places,
});
const M = (stem: Pair, rubric: Pair): Item => ({
  ...R(stem, '', [rubric], []),
  mode: 'explain',
});
const skills = [
  'square-root-versus-principal',
  'irrational-and-real-line',
  'square-factor-simplification',
  'radical-operation-domain',
  'root-bounds-and-rounding',
];
const hints: Pair[][] = [
  [
    [
      '先分清问 √a，还是 x²=a 的全部实数解。',
      'Distinguish the single value √a from every real solution of x²=a.',
    ],
    [
      '正数平方根一正一负；零只有零；负数没有实数根。√(a²)=|a|，不能丢负输入的绝对值。',
      'A positive has opposite roots, zero only zero, a negative none in the reals. √(a²)=|a|, including for negative a.',
    ],
  ],
  [
    [
      '按定义判断是否能写成整数比；有限或循环小数有理。',
      'Use whether the number is an integer ratio; terminating and repeating decimals are rational.',
    ],
    [
      '先化简根式。屏幕的有限前缀不能证明无理；√2 的无理性另需理由，负根号内数在本课实数域无值。',
      'Simplify first. A finite displayed prefix cannot prove irrationality; √2 needs a separate argument. Negative radicands have no value in this real domain.',
    ],
  ],
  [
    [
      '找完全平方因子，分清根号内外和长度/面积。',
      'Find a perfect-square factor, distinguishing inside/outside and area/length.',
    ],
    [
      '√(a²b)=|a|√b；分数先分解分子分母并去根式分母。最后检查被开方整数无平方因子、同类合并及符号。',
      '√(a²b)=|a|√b. Factor numerator/denominator and rationalise; finish with square-free integer radicands, collected like terms and correct signs.',
    ],
  ],
  [
    [
      '先查实数域和非零分母；加减不能直接合并被开方数。',
      'Check real-domain and nonzero-denominator conditions; addition does not add radicands.',
    ],
    [
      '化简后同类合系数。乘法需a,b≥0，除法需a≥0,b>0；有根式分母可乘非零因子比或共轭并展开回查。',
      'Collect coefficients after simplification. Products need a,b≥0; quotients a≥0,b>0. Rationalise using a nonzero ratio or conjugate, then expand to check.',
    ],
  ],
  [
    [
      '在非负区间用相邻平方夹住根，注意精确与近似符号。',
      'Use adjacent squares on nonnegative numbers, distinguishing exact and approximate statements.',
    ],
    [
      '四舍五入还要比较中点的平方；不是只取已显示前几位。严格按要求保留尾零，界限与近似不冒充等式。',
      'For rounding compare the squared midpoint, not just a truncated display. Retain required trailing zeros; bounds and approximations are not exact equalities.',
    ],
  ],
];
function q(id: string, i: number, v: Item): Question {
  if (v.mode === 'explain')
    return reasoning(
      id,
      T(v.stem),
      skills[i]!,
      T(v.steps[0]!),
      hints[i]!.map(T),
    );
  const answer: AnswerSpec =
    v.mode === 'root-set'
      ? { kind: 'root-set', value: v.value, radicand: v.radicand! }
      : v.mode === 'real-class'
        ? { kind: 'real-class', value: v.value as RealClass }
        : v.mode === 'root-rounded'
          ? {
              kind: 'root-rounded',
              value: v.value,
              radicand: v.radicand!,
              places: v.places!,
            }
          : v.mode === 'number'
            ? { kind: 'number', value: v.value }
            : { kind: 'radical', value: v.value, simplified: v.simplified };
  return {
    ...numeric(
      id,
      T(v.stem),
      v.value,
      skills[i]!,
      hints[i]!.map(T),
      v.steps.map(T),
      { accepted: v.accepted ?? [v.value], rejected: v.wrong },
      v.diagram,
    ),
    answer,
  };
}
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
const specs: Spec[] = [
  {
    title: ['平方根与算术平方根', 'Square roots and principal roots'],
    objective: [
      '区分 x²=a 的实数根集合与非负主根 √a，并说明零和负被开方数边界。',
      'Distinguish all real roots of x²=a from the nonnegative principal root √a, including zero and negative radicands.',
    ],
    prerequisites: ['J87-L04', 'J71-L05'],
    keywords: [
      ['平方根', 'square root'],
      ['算术平方根', 'principal square root'],
      ['非负', 'nonnegative'],
    ],
    lab: 'radical-meaning',
    hook: [
      '九的平方根是 ±3，√9 为什么仍只有一个值？',
      'Nine has roots ±3; why does √9 still have only one value?',
    ],
    items: [
      S(
        [
          '写 x²=9 的全部实数根，逗号分隔或用 ±。',
          'Give every real root of x²=9, using commas or ±.',
        ],
        '9',
        [
          [
            '3²=9且(−3)²=9，两个都要写；集合顺序可交换。',
            'Both 3²=9 and (-3)²=9, so include both; order does not matter.',
          ],
        ],
        ['3', '-3', '9', '3,3'],
      ),
      R(
        [
          '求 √9 的值；这里只问非负算术平方根。',
          'Find √9, asking only for the nonnegative principal root.',
        ],
        '3',
        [
          [
            '√9=3；±3是方程x²=9的两解，不是根号符号的单值。',
            '√9=3; ±3 are the two equation roots, not the single radical value.',
          ],
        ],
        ['-3', '±3', '9'],
        false,
      ),
      S(
        ['写 x²=0 的全部实数根。', 'Give every real root of x²=0.'],
        '0',
        [
          [
            '只有零；正负零是同一个数，不写两个重复项。',
            'Only zero; positive and negative zero are one number, not two distinct entries.',
          ],
        ],
        ['1', '-1', '0,0'],
      ),
      S(
        [
          '在实数范围，写 x²=−4 的全部根；没有则写无实数根。',
          'In the reals, give every root of x²=-4, or write no real roots.',
        ],
        '-4',
        [
          [
            '任何实数平方都非负，不能等于负四。',
            'Every real square is nonnegative and cannot equal minus four.',
          ],
        ],
        ['2', '-2,2', '0'],
      ),
      R(
        [
          '求 √((−3)²)，这里括号内先平方；只写主根。',
          'Find √((-3)²), squaring inside first and giving the principal root.',
        ],
        '3',
        [
          [
            '(−3)²=9，再取非负根三。一般√(a²)=|a|。',
            '(-3)²=9, whose nonnegative root is three. In general √(a²)=|a|.',
          ],
        ],
        ['-3', '±3', '9'],
        false,
      ),
      S(
        ['写 x²=1/4 的全部实数根。', 'Give every real root of x²=1/4.'],
        '1/4',
        [
          [
            '(1/2)²=(−1/2)²=1/4，正负根都写。',
            'Both (1/2)² and (-1/2)² equal 1/4; include both roots.',
          ],
        ],
        ['1/2', '-1/2', '-1/4,1/4'],
      ),
    ],
    pick: {
      stem: ['哪个等式正确？', 'Which equality is correct?'],
      options: [
        ['√9=±3', '√9=±3'],
        ['√9=3，x²=9 的解为 ±3', '√9=3, while x²=9 has solutions ±3'],
        ['√((−3)²)=−3', '√((-3)²)=-3'],
      ],
      feedback: [
        [
          '根号给一个非负主根，不是两值。',
          'The radical denotes one nonnegative root.',
        ],
        [
          '正确，先分清符号与方程的任务。',
          'Correct: distinguish the radical value and equation task.',
        ],
        [
          '先平方得九，再取非负根三。',
          'Squaring gives nine; its principal root is three.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '解释正数、零、负数的实数平方根数目，并用负输入说明 √(a²)=|a|。',
      'Explain real-root counts for positive, zero and negative radicands, and use a negative input to explain √(a²)=|a|.',
    ],
    rubric: [
      '正a有一正一负两根、零一根、负a无实数根；√a只表示a≥0时的非负主根。用a=−3说明√(a²)=3=|a|而非a，并区分外部负号−√9=−3。不能把“无实数根”说成零，或在实数讨论中悄悄引入复数。',
      'Positive a has opposite roots, zero one, negative a none in the reals; √a denotes the nonnegative root for a≥0. With a=-3, √(a²)=3=|a| rather than a, while an outside -√9=-3 remains negative. No real roots is not zero; do not silently change the number domain.',
    ],
    misconception: [
      '把两平方根写成 √a 的两个值，或忽略绝对值。',
      'Giving √a two values or dropping the absolute value.',
    ],
    prompts: [
      [
        '这个符号问一个值还是全部解？',
        'Is the task a single value or every solution?',
      ],
      [
        '负三先平方后开方会回到负三吗？',
        'Does squaring minus three then taking the principal root return minus three?',
      ],
    ],
  },
  {
    title: ['无理数与实数轴', 'Irrational numbers and the real line'],
    objective: [
      '按整数比与小数展开定义区分有理/无理实数，理解精确数与轴上近似位置。',
      'Classify rational and irrational real numbers using integer ratios and decimal definitions, distinguishing exact values from approximate placement.',
    ],
    prerequisites: ['J91-L01', 'J75-L01'],
    keywords: [
      ['有理数', 'rational number'],
      ['无理数', 'irrational number'],
      ['实数轴', 'real line'],
    ],
    lab: 'radical-real',
    hook: [
      '1.414213562 是有限小数；它和 √2 是同一个精确数吗？',
      'The decimal 1.414213562 terminates; is it exactly √2?',
    ],
    items: [
      C(
        [
          '分类精确数 √2：有理数、无理数还是非实数？',
          'Classify the exact number √2: rational, irrational or not-real.',
        ],
        'irrational',
        [
          [
            '√2是非负实数，但不能写成整数比；有限小数显示只是近似。',
            '√2 is a nonnegative real but not an integer ratio; a finite decimal display is only approximate.',
          ],
        ],
        ['rational', 'not-real'],
      ),
      C(
        [
          '0.(3) 明确表示三无限循环，等于1/3。分类这个数。',
          '0.(3) explicitly repeats threes forever and equals 1/3. Classify it.',
        ],
        'rational',
        [
          [
            '已写成整数比1/3，循环而不终止仍可有理。',
            'The integer ratio 1/3 is rational despite its nonterminating repeating expansion.',
          ],
        ],
        ['irrational', 'not-real'],
      ),
      C(
        [
          '分类按字面写出的有限小数 1.414213562，不把它当 √2 的别名。',
          'Classify the literal terminating decimal 1.414213562, not an alias for √2.',
        ],
        'rational',
        [
          [
            '它等于整数1414213562/1000000000，可约分；有限前缀不等于无理原数。',
            'It equals the integer ratio 1414213562/1000000000; a finite prefix is not the original irrational number.',
          ],
        ],
        ['irrational', 'not-real'],
      ),
      C(
        [
          '在本课实数域中，分类 √(−2)。',
          'In this real-number domain classify √(-2).',
        ],
        'not-real',
        [
          [
            '实数平方不能等于负二，因此没有对应实数值或实数轴点。',
            'No real square equals minus two, so there is no real value or real-line point.',
          ],
        ],
        ['rational', 'irrational'],
      ),
      M(
        [
          '假设 √2=p/q 且 p/q 已约到最简，说明平方后为何矛盾。',
          'Assume √2=p/q in lowest integer terms and explain the contradiction after squaring.',
        ],
        [
          '设p、q互质正整数，p²=2q²使p²偶，因此p偶；写p=2k代入得q²=2k²，故q也偶，与互质矛盾。需解释整数平方奇偶性，不以屏幕小数不整齐或几次试分数当证明。',
          'For coprime positive integers p,q, p²=2q² makes p² even and hence p even. Write p=2k to obtain q²=2k², making q even too, contradicting coprimality. Explain integer-square parity rather than citing an untidy display or a few failed fractions.',
        ],
      ),
      C(
        [
          '分类 −√2；前面的负号会使无理数变成有理数吗？',
          'Classify -√2. Does the outside minus turn it rational?',
        ],
        'irrational',
        [
          [
            '若−√2为有理数，其相反数√2也有理，矛盾；负数也可无理。',
            'If -√2 were rational, its opposite √2 would be rational, a contradiction.',
          ],
        ],
        ['rational', 'not-real'],
      ),
    ],
    pick: {
      stem: ['哪个判断正确？', 'Which statement is correct?'],
      options: [
        ['无限小数全是无理数', 'Every nonterminating decimal is irrational'],
        ['所有根号写法都是无理数', 'Every radical expression is irrational'],
        [
          '有限小数和循环小数有理；无限不循环的实数是无理数',
          'Terminating/repeating decimals are rational; nonterminating nonrepeating reals are irrational',
        ],
      ],
      feedback: [
        ['1/3无限循环却有理。', '1/3 repeats forever but is rational.'],
        ['√9=3，是有理数。', '√9=3 is rational.'],
        [
          '正确，但有限屏幕前缀不能确定后续是否循环。',
          'Correct, but a finite prefix cannot determine the full expansion.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '解释“有根号就无理”和“屏幕显示很多小数就无理”为什么不成立，并说明数轴点与证明的区别。',
      'Explain why “a radical means irrational” and “many displayed decimals mean irrational” fail, distinguishing plotted points from proof.',
    ],
    rubric: [
      '举√9=3、√(1/4)=1/2为反例；有限小数是整数比，0.(3)=1/3循环仍有理。无理数要求实数且非整数比，其展开无限不循环，不能凭有限前缀断定。√2的证明用最简分数与奇偶矛盾，负√2仍无理；图上像素近似定位不改变精确值或代替证明，√(−2)在实数域无点。',
      'Use √9=3 and √(1/4)=1/2 as counterexamples. Finite decimals are ratios and repeating 0.(3)=1/3 is rational. An irrational is real and not an integer ratio, with a nonterminating nonrepeating expansion; a finite prefix cannot establish this. Prove √2 via lowest terms/parity; -√2 remains irrational. Pixel placement is approximate, and √(-2) has no real point.',
    ],
    misconception: [
      '凭根号外观或有限小数位数判无理。',
      'Classifying from a radical symbol or the length of a finite display.',
    ],
    prompts: [
      [
        '这个数能否先化简成整数比？',
        'Can the number first simplify to an integer ratio?',
      ],
      [
        '你知道整个展开，还是只看到有限前缀？',
        'Do you know the full expansion or only a finite prefix?',
      ],
    ],
  },
  {
    title: ['根式的化简', 'Simplifying radicals'],
    objective: [
      '提出平方因子并处理分数根式，保留符号与最简根式结构。',
      'Extract square factors and simplify fractional radicals while retaining signs and finished radical structure.',
    ],
    prerequisites: ['J91-L01', 'J81-L01'],
    keywords: [
      ['平方因子', 'square factor'],
      ['最简二次根式', 'simplest radical form'],
      ['绝对值', 'absolute value'],
    ],
    lab: 'radical-simplify',
    hook: [
      '四块面积三组成面积十二，边长为什么是2√3而不是四乘三？',
      'Four area-three squares make area twelve; why is the side 2√3 rather than four times three?',
    ],
    items: [
      R(
        ['把 √12 化成最简二次根式。', 'Write √12 in simplest radical form.'],
        '2√3',
        [
          [
            '十二=四乘三，√12=√4√3=2√3，三没有大于一的平方因子。',
            'Twelve is 4×3, so √12=2√3; three has no nontrivial square factor.',
          ],
        ],
        ['√12', '12', '6', '-2√3'],
        true,
        { kind: 'radical-tiles', radicand: '12' },
      ),
      R(
        ['把 √72 化成最简二次根式。', 'Simplify √72 completely.'],
        '6√2',
        [
          [
            '七十二=三十六乘二，取六在根号外；3√8虽等值仍未完成。',
            '72=36×2 gives 6√2; 3√8 is equivalent but unfinished.',
          ],
        ],
        ['√72', '3√8', '36√2', '-6√2'],
        true,
        { kind: 'radical-tiles', radicand: '72' },
      ),
      R(
        [
          '把 √(8/9) 化简，分母无根式且根号内无分数。',
          'Simplify √(8/9), with no radical denominator or fractional radicand.',
        ],
        '2√2/3',
        [['√8/√9=(2√2)/3，九的主根三。', '√8/√9=(2√2)/3, using √9=3.']],
        ['√(8/9)', '√8/3', '2√2/9', '-2√2/3'],
      ),
      R(
        [
          '把 −√45 化成最简式，负号在根号外。',
          'Simplify -√45, with the minus outside the root.',
        ],
        '-3√5',
        [
          [
            '四十五=九乘五，主根3√5；外部负号保留。',
            '45=9×5 gives principal root 3√5; retain the outside minus.',
          ],
        ],
        ['3√5', '-√45', '-9√5'],
      ),
      R(
        [
          '把 √(3/8) 化成最简二次根式，分母无根式。',
          'Simplify √(3/8) with a rational denominator.',
        ],
        '√6/4',
        [
          [
            '√3/(2√2)，上下同乘√2，得√6/4；六无平方因子。',
            'Write √3/(2√2), then multiply numerator/denominator by √2 to get √6/4.',
          ],
        ],
        ['√(3/8)', '√3/(2√2)', '√6/2', '3/8'],
      ),
      R(
        ['把 √98 化成最简二次根式。', 'Simplify √98 completely.'],
        '7√2',
        [['九十八=四十九乘二，因此√98=7√2。', '98=49×2, so √98=7√2.']],
        ['√98', '49√2', '-7√2'],
      ),
    ],
    pick: {
      stem: [
        'a为实数、b≥0时，哪个式子正确？',
        'For real a and b≥0, which identity is correct?',
      ],
      options: [
        ['√(a²b)=|a|√b', '√(a²b)=|a|√b'],
        ['√(a²b)=a√b总成立', '√(a²b)=a√b always'],
        ['√(a²b)=a²√b', '√(a²b)=a²√b'],
      ],
      feedback: [
        [
          '正确，主根非负，需要绝对值。',
          'Correct: the principal root is nonnegative.',
        ],
        [
          'a负时会给负主根；须用|a|。',
          'A negative a would give a negative principal root; use |a|.',
        ],
        [
          '平方因子开方后不是原平方。',
          'Taking the root of a square factor does not retain the square.',
        ],
      ],
      correct: 0,
    },
    reason: [
      '用数值或面积解释提出平方因子，说明外部负号与 √(a²) 的绝对值为何不能混淆。',
      'Use numerical or area reasoning to explain square-factor extraction, distinguishing an outside minus from the absolute value in √(a²).',
    ],
    rubric: [
      '以12=4×3说明四块面积三的小正方形排成2×2，每块边√3，所以外边2√3；面积不是边长。规则√(a²b)=|a|√b需b≥0，a=−3时主根不负；外部−√45则保持−3√5。分数提因子并去根号分母，不能只写原根式或未提出平方因子的等值式。',
      'For 12=4×3, four area-three squares form a 2×2 array; each side √3 makes outer side 2√3. Distinguish area from length. With b≥0, √(a²b)=|a|√b, including negative a; an outside -√45 remains -3√5. Finish fractional radicands and denominator rationalisation rather than leaving an equivalent unsimplified radical.',
    ],
    misconception: [
      '把平方因子原样提出，或以数值等价替代完成化简。',
      'Extracting the squared factor unchanged or equating equivalence with finished simplification.',
    ],
    prompts: [
      [
        '根号内还能提出什么平方因子？',
        'Which square factor still remains inside?',
      ],
      ['负号原本在哪一层？', 'Where was the original minus sign?'],
    ],
  },
  {
    title: ['根式加减乘除', 'Operations with radicals'],
    objective: [
      '在明确实数与非零条件下运算，先化简同类根式并用共轭处理分母。',
      'Operate under real/nonzero conditions, collecting simplified like radicals and using conjugates for denominators.',
    ],
    prerequisites: ['J91-L03', 'J81-L04', 'J81-L05'],
    keywords: [
      ['同类根式', 'like radicals'],
      ['有理化', 'rationalisation'],
      ['共轭', 'conjugate'],
    ],
    lab: 'radical-operations',
    hook: [
      '两块面积一的边长相加，为什么不是面积二的边长？',
      'Why does adding sides of two area-one squares differ from the side of an area-two square?',
    ],
    items: [
      R(
        ['计算并完成化简 √8+√18。', 'Evaluate and simplify √8+√18.'],
        '5√2',
        [
          [
            '先化简成2√2+3√2，再加同类系数得到5√2。',
            'First simplify to 2√2+3√2, then collect coefficients to get 5√2.',
          ],
        ],
        ['√26', '√8+√18', '2√2+3√2', '5√4'],
      ),
      R(
        ['计算并完成化简 √12−√27。', 'Evaluate and simplify √12−√27.'],
        '-√3',
        [
          [
            '2√3−3√3=(2−3)√3=−√3，差可以为负。',
            '2√3-3√3=-√3; a difference of principal roots may be negative.',
          ],
        ],
        ['√3', '√15', '√12-√27'],
      ),
      R(
        ['计算并完成化简 √3×√12。', 'Evaluate and simplify √3×√12.'],
        '6',
        [
          [
            '两被开方数非负，乘成√36=6，主根取非负。',
            'Both radicands are nonnegative, so the product is √36=6.',
          ],
        ],
        ['√36', '36', '-6', '±6'],
      ),
      R(
        ['计算并完成化简 √18÷√2。', 'Evaluate and simplify √18÷√2.'],
        '3',
        [
          [
            '18≥0且2>0，商为√9=3；分母不能零。',
            '18≥0 and 2>0, so the quotient is √9=3; the denominator cannot vanish.',
          ],
        ],
        ['√9', '9', '-3'],
      ),
      R(
        [
          '化简 1/(√3+√2)，分母无根式。',
          'Simplify 1/(√3+√2) with no radical denominator.',
        ],
        '√3-√2',
        [
          [
            '乘共轭比(√3−√2)/(√3−√2)，分母3−2=1，得√3−√2。',
            'Multiply by the conjugate ratio; the denominator is 3-2=1, giving √3-√2.',
          ],
        ],
        ['1/(√3+√2)', '√3+√2', '1/√5'],
      ),
      R(
        [
          '化简 1/√2，分母无根式。',
          'Simplify 1/√2 with a rational denominator.',
        ],
        '√2/2',
        [
          [
            '上下同乘非零√2，分母变二。',
            'Multiply numerator and denominator by nonzero √2, making denominator two.',
          ],
        ],
        ['1/√2', '√2', '1/2'],
      ),
    ],
    pick: {
      stem: [
        '哪条规则的实数条件正确？',
        'Which rule states its real-number conditions correctly?',
      ],
      options: [
        ['√a/√b=√(a/b)，只需 a≥0,b≥0', '√a/√b=√(a/b) needs only a≥0,b≥0'],
        [
          '√a√b=√(ab)需a,b≥0；商还需b>0',
          'Products need a,b≥0; quotients additionally need b>0',
        ],
        [
          '√a+√b=√(a+b)对非负数恒成立',
          '√a+√b=√(a+b) for every nonnegative a,b',
        ],
      ],
      feedback: [
        [
          'b=0会除零，必须严格正。',
          'b=0 divides by zero, so strict positivity is required.',
        ],
        [
          '正确，先条件后套公式。',
          'Correct: check conditions before applying a formula.',
        ],
        [
          'a=b=1时左二右√2，是反例。',
          'a=b=1 gives two versus √2, a counterexample.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '说明根式乘除的条件，并用反例检查“根式加法也能合到一个根号”与“负被开方数也能强套乘法”。',
      'Explain radical product/quotient conditions and counterexamples to combining addition or applying the rule to negative radicands in the reals.',
    ],
    rubric: [
      '乘法需每个被开方数非负；商的分母被开方数严格正。√1+√1=2≠√2，先化简同类再合系数；√2+√3可保留不同类项。√(−1)在实数域无值，不能先相乘合成√1来绕过条件。共轭或同乘因子必须非零、上下同做并回查；不能把未定义说成零。',
      'Products require each radicand nonnegative; quotient denominators require a positive radicand. √1+√1=2≠√2; collect like radicals after simplification, leaving unlike terms such as √2+√3. √(-1) has no real value, so combining first into √1 evades the domain. Use nonzero conjugate/factor ratios on numerator and denominator and verify; undefined is not zero.',
    ],
    misconception: [
      '把根式加法套乘法规则，或先合并后检查数域。',
      'Using the product rule for addition or checking domains only after combining.',
    ],
    prompts: [
      ['这两个根式化简后同类吗？', 'Are the simplified radicals like terms?'],
      [
        '你乘的那个比为什么等于一？',
        'Why is the factor ratio you multiplied by equal to one?',
      ],
    ],
  },
  {
    title: ['估算根式的值', 'Estimating radical values'],
    objective: [
      '用精确平方建立根的界限，并比较舍入中点得到指定小数位的近似。',
      'Establish root bounds using exact squares and compare rounding midpoints for specified decimal approximations.',
    ],
    prerequisites: ['J91-L01', 'P52-L05', 'J75-L01'],
    keywords: [
      ['上下界', 'bounds'],
      ['近似值', 'approximation'],
      ['舍入中点', 'rounding midpoint'],
    ],
    lab: 'radical-estimate',
    hook: [
      '夹在1.41和1.42之间，就已经知道保留两位该取谁了吗？',
      'If a root lies between 1.41 and 1.42, do those bounds alone settle two-place rounding?',
    ],
    items: [
      D(
        [
          '把 √2 四舍五入为恰好一位小数。',
          'Round √2 to exactly one decimal place.',
        ],
        '2',
        1,
        [
          [
            '1.4²=1.96<2；中点1.45²=2.1025>2，因此取1.4。',
            '1.4²=1.96<2 and midpoint 1.45²=2.1025>2, so round to 1.4.',
          ],
        ],
        ['1.5', '1.41', '√2', '7/5'],
      ),
      D(
        [
          '把 √2 四舍五入为恰好两位小数。',
          'Round √2 to exactly two decimal places.',
        ],
        '2',
        2,
        [
          [
            '1.41²=1.9881<2，1.42²=2.0164>2；中点1.415²=2.002225>2，取1.41。',
            'Adjacent squares bound the root; midpoint 1.415²=2.002225 exceeds two, so use 1.41.',
          ],
        ],
        ['1.42', '1.4', '1.410', '√2'],
      ),
      D(
        [
          '把 √50 四舍五入为恰好一位小数。',
          'Round √50 to exactly one decimal place.',
        ],
        '50',
        1,
        [
          [
            '7.0²=49<50<50.41=7.1²；中点7.05²=49.7025<50，所以取7.1而非截断7.0。',
            '49<50<50.41 bounds the root; midpoint 7.05²=49.7025 is below fifty, so round to 7.1 rather than truncate to 7.0.',
          ],
        ],
        ['7.0', '7.07', '5√2'],
      ),
      {
        ...R(
          [
            '已知2.23²=4.9729<5<5.0176=2.24²，求 √5 的这对百分位界限中的下界，只写数。',
            'Given 2.23²=4.9729<5<5.0176=2.24², give the lower of these hundredth-grid bounds for √5, number only.',
          ],
          '2.23',
          [
            [
              '平方在非负数上保序，因此2.23<√5<2.24，下界2.23不是精确值。',
              'Squaring preserves order for nonnegative numbers, so 2.23<√5<2.24; the lower bound is not the exact root.',
            ],
          ],
          ['2.24', '5', '√5'],
        ),
        mode: 'number',
      },
      M(
        [
          '只知1.41<√2<1.42，为什么还需比较1.415才能严格决定两位舍入？',
          'Why do bounds 1.41<√2<1.42 still require comparing with 1.415 to establish two-place rounding?',
        ],
        [
          '区间横跨舍入中点1.415，仅有端点界限不能判断根落中点哪边。精确算1.415²=2.002225>2，在非负域推出√2<1.415，故取1.41。不是先把显示截成1.41再据其舍入，不能写√2=1.41；中点平方若更小应向上。',
          'The interval straddles midpoint 1.415, so bounds alone do not select its side. Exactly 1.415²=2.002225>2 implies √2<1.415 on the nonnegative domain, giving 1.41. Do not truncate a display first or write √2=1.41; a midpoint square below the radicand would require rounding up.',
        ],
      ),
      D(
        [
          '把 √(999/1000) 四舍五入为恰好两位小数，保留尾零。',
          'Round √(999/1000) to exactly two decimal places, keeping trailing zeros.',
        ],
        '999/1000',
        2,
        [
          [
            '0.99²=0.9801<0.999<1²，中点0.995²=0.990025<0.999，舍入到1.00。',
            '0.9801<0.999<1 and midpoint 0.995²=0.990025<0.999, so round up to 1.00.',
          ],
        ],
        ['0.99', '1', '1.0', '0.999'],
      ),
    ],
    pick: {
      stem: ['哪个表述最准确？', 'Which statement is accurate?'],
      options: [
        [
          '√2=1.41，因为屏幕只显示两位',
          '√2=1.41 because the display shows two places',
        ],
        [
          '1.41<√2<1.42，且两位舍入为1.41需要中点比较',
          '1.41<√2<1.42, with midpoint comparison establishing rounding to 1.41',
        ],
        [
          '所有根式都不能有精确有限小数值',
          'No radical can have an exact terminating decimal',
        ],
      ],
      feedback: [
        [
          '1.41²不等于二，不能写精确等号。',
          '1.41² is not two, so exact equality is false.',
        ],
        [
          '正确，界限、精确值和舍入分别说。',
          'Correct: separate bounds, exact values and rounding.',
        ],
        [
          '√(25/16)=5/4=1.25就是精确有限小数。',
          '√(25/16)=5/4=1.25 is an exact terminating decimal.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '比较平方夹界、截断、四舍五入和精确等号，并说明为什么非负前提与尾零重要。',
      'Compare squared bounds, truncation, rounding and exact equality, explaining nonnegativity and trailing zeros.',
    ],
    rubric: [
      '非负区间平方保序，l²<a<u²给l<√a<u。舍入看中点m=(l+u)/2并比较m²与a；√50一位取7.1不是截断7.0。√2精确保根式，近似用≈，√(25/16)=1.25则可精确等号。按指定位数保留1.00尾零，不能先截断显示再推舍入；说明误差由区间或半个格长约束。',
      'On nonnegative numbers l²<a<u² yields l<√a<u. Compare midpoint m² with a for rounding; √50 to one place is 7.1, not truncated 7.0. Keep √2 exact and use ≈ for its decimal, while √(25/16)=1.25 is exact. Retain 1.00 at the requested precision, avoid rounding a prior truncation, and explain error through the interval or half-grid width.',
    ],
    misconception: [
      '把下界、显示截断与最近舍入混同，或丢掉指定尾零。',
      'Confusing a lower bound, display truncation and nearest rounding, or losing required trailing zeros.',
    ],
    prompts: [
      [
        '平方比较时为什么先限定非负？',
        'Why restrict to nonnegative numbers before comparing squares?',
      ],
      [
        '根在这个舍入中点的哪一边？',
        'On which side of the rounding midpoint does the root lie?',
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
export const j91Lessons: Lesson[] = specs.map((s, i) => {
  const id = `J91-L0${i + 1}`;
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
    unit: 'J91',
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
            '纸上设计虚构正方形标牌：选面积12、18或50，说明精确边长、对应平方根集合和非负长度的区别。画平方因子拼块，检查一个加法错误；用相邻平方和舍入中点给两位近似，标明误差范围。家长核符号、数域、来源数值和等号/约号，不需要购买、真实测量或上传。',
            'On paper design a fictional square sign of area 12,18 or 50. Distinguish its exact side, square-root set and nonnegative length. Draw square-factor tiles, check an addition error, and use adjacent squares plus a rounding midpoint for two decimal places with an error bound. A parent checks signs, domains and equality/approximation; no purchases, real measurements or uploads are needed.',
          ),
        }
      : {}),
  };
});
export function j91ReviewQuestion(id: string, round: number): Question {
  if (
    !/^J91-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid J91 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 80,
    a = (k % 5) + 1,
    b = [2, 3, 5, 6, 7][k % 5]!,
    c = (k % 4) + 1;
  let item: Item;
  if (i === 0) {
    const n = (k % 7) - 3,
      negative = k % 4 === 3,
      radicand = String(negative ? -(n * n + 1) : n * n);
    item = S(
      [
        `写 x²=${radicand} 的全部实数根。`,
        `Give every real root of x²=${radicand}.`,
      ],
      radicand,
      [
        [
          '先核数域，正数两根、零一根、负数无实数根；代回平方检查。',
          'Check the domain, include opposite roots for positives and only zero for zero; negative radicands have no real roots.',
        ],
      ],
      ['100'],
    );
  } else if (i === 1) {
    const v = realCases[k % realCases.length]!,
      kind = radicalClass(v.expression);
    item = C(
      [
        `分类精确数 ${v.display}：有理/无理/非实数。`,
        `Classify the exact number ${v.display}: rational, irrational or not-real.`,
      ],
      kind,
      [
        [
          '化简或依据整数比定义；有限显示不证明无理，循环与有限小数有理。',
          'Simplify or use the integer-ratio definition; finite displays do not prove irrationality, while repeating/terminating decimals are rational.',
        ],
      ],
      [kind === 'rational' ? 'irrational' : 'rational'],
    );
  } else if (i === 2) {
    const negative = k % 2 === 1,
      n = a * a * b,
      value = `${negative ? '-' : ''}${a === 1 ? '' : a}√${b}`;
    item = R(
      [
        `化简 ${negative ? '−' : ''}√${n}，完成提出平方因子。`,
        `Simplify ${negative ? '-' : ''}√${n} completely.`,
      ],
      value,
      [
        [
          `${n}=${a}²×${b}，取${a}在外并保留外负号。`,
          `${n}=${a}²×${b}; extract ${a} and retain an outside minus if present.`,
        ],
      ],
      ['999'],
    );
  } else if (i === 3) {
    const op = k % 4,
      source =
        op === 0
          ? `${a}√${b}*√${b}`
          : op === 1
            ? `${a}√${b}/√${b}`
            : `${a}√${b}${op === 2 ? '+' : '-'}${c}√${b}`,
      coefficient = op === 2 ? a + c : a - c,
      value =
        op === 0
          ? String(a * b)
          : op === 1
            ? String(a)
            : coefficient === 0
              ? '0'
              : `${coefficient}√${b}`;
    item = R(
      [`计算并化简 ${source}。`, `Evaluate and simplify ${source}.`],
      value,
      [
        [
          '被开方数正且分母非零；同类项合系数，乘除回到精确值，零项省去。',
          'Radicands are positive and denominators nonzero; collect like coefficients, compute products/quotients and omit zero terms.',
        ],
      ],
      ['999'],
    );
  } else if (k % 4 === 0)
    item = M(
      [
        '说明为何1.41<√2<1.42还需比较舍入中点，并区分精确值与近似。',
        'Explain why 1.41<√2<1.42 still needs midpoint comparison, distinguishing exact and approximate values.',
      ],
      specs[4]!.items[4]!.steps[0]!,
    );
  else {
    const n = String((k % 49) + 2),
      p = (k % 3) + 1;
    item = D(
      [
        `把 √${n} 四舍五入到恰好${p}位小数。`,
        `Round √${n} to exactly ${p} decimal places.`,
      ],
      n,
      p,
      [
        [
          '用相邻平方与中点平方比较，保留所需尾零；不先截断。',
          'Compare adjacent and midpoint squares, retain trailing zeros and do not truncate first.',
        ],
      ],
      ['999'],
    );
  }
  return q(`${id}-R${round}`, i, item);
}
export const j91CheckQuestions: Question[] = [
  q(
    'J91-CHECK-Q1',
    0,
    S(
      ['写 x²=16 的全部实数根。', 'Give every real root of x²=16.'],
      '16',
      [
        [
          '四与负四平方均为十六。',
          'Both four and minus four square to sixteen.',
        ],
      ],
      ['4', '-4', '16'],
    ),
  ),
  q(
    'J91-CHECK-Q2',
    1,
    C(
      ['分类精确数 √49。', 'Classify the exact number √49.'],
      'rational',
      [['√49=7，是整数比7/1。', '√49=7 is the integer ratio 7/1.']],
      ['irrational', 'not-real'],
    ),
  ),
  q(
    'J91-CHECK-Q3',
    2,
    R(
      ['把 √50 化成最简二次根式。', 'Simplify √50 completely.'],
      '5√2',
      [['五十=二十五乘二，主根5√2。', '50=25×2 gives principal root 5√2.']],
      ['√50', '25√2', '-5√2'],
    ),
  ),
  q(
    'J91-CHECK-Q4',
    3,
    R(
      ['计算并化简 √8+√2。', 'Evaluate and simplify √8+√2.'],
      '3√2',
      [['先2√2+√2，再合成3√2。', 'First 2√2+√2, then collect to 3√2.']],
      ['√10', '2√2+√2', '√8+√2'],
    ),
  ),
  q(
    'J91-CHECK-Q5',
    4,
    D(
      [
        '把 √3 四舍五入到恰好两位小数。',
        'Round √3 to exactly two decimal places.',
      ],
      '3',
      2,
      [
        [
          '1.73²<3<1.74²，中点1.735²=3.010225>3，取1.73。',
          '1.73²<3<1.74², and 1.735²=3.010225>3 selects 1.73.',
        ],
      ],
      ['1.74', '1.7', '√3'],
    ),
  ),
  q(
    'J91-CHECK-Q6',
    3,
    M(
      [
        '审查 √(−1)×√(−1)=√1 与 √2/√0 的实数运算条件，并给一个加法反例。',
        'Audit real-domain conditions for √(-1)×√(-1)=√1 and √2/√0, and give an addition counterexample.',
      ],
      specs[3]!.rubric,
    ),
  ),
  pick('J91-CHECK-Q7', 0, specs[0]!.pick),
  reasoning(
    'J91-CHECK-Q8',
    t(
      '用例子连接主根/两根、无理数、根式化简与运算、平方夹界和舍入，并指出一条必要条件。',
      'Connect principal/both roots, irrational numbers, simplification/operations, squared bounds and rounding with examples and a necessary condition.',
    ),
    skills[4]!,
    t(
      '如x²=9有±3而√9=3；√2无理但有限近似有理，不能把前缀当证明；√12=2√3，√8+√18=5√2，乘除需非负及非零条件；1/√2=√2/2。用1.41²<2<1.42²及中点1.415²>2说明两位舍入1.41，用≈而非精确等号。家长核每一步数值、符号、数域和完成形式，不按术语多少评分。',
      'For example x²=9 has ±3 while √9=3; √2 is irrational but a finite decimal approximation is rational, and a prefix is not proof. √12=2√3 and √8+√18=5√2; products/quotients need nonnegative/nonzero conditions, and 1/√2=√2/2. Use adjacent squares and midpoint 1.415²>2 for rounding √2 to 1.41 with ≈ rather than exact equality. Review values, signs, domain and finished form, not vocabulary count.',
    ),
    hints[4]!.map(T),
  ),
];
