import { t, type Lesson, type Question } from '../model';
import { numeric, choice, reasoning } from './builders';
type Pair = [string, string];
const T = (p: Pair) => t(...p);
type Item = {
  stem: Pair;
  value: string;
  steps: Pair;
  wrong: string[];
  expression?: boolean;
  diagram?: Question['diagram'];
};
type Pick = {
  stem: Pair;
  options: { text: Pair; feedback: Pair }[];
  correct: number;
  steps: Pair;
};
type Spec = {
  title: Pair;
  objective: Pair;
  prerequisites: string[];
  keywords: Pair[];
  hook: Pair;
  lab: Lesson['lab'];
  numbers: Item[];
  pick: Pick;
  reason: Pair;
  rubric: Pair;
  misconception: Pair;
  prompts: Pair[];
};
const skills = [
  'letter-substitution',
  'constructed-nth-term',
  'expression-structure',
  'equivalent-equation',
  'bracket-equation',
];
const hints: Pair[][] = [
  [
    [
      '先说字母代表的数，并在每个相同字母处代入同一个值。',
      'State the number represented and substitute the same value for every occurrence of that letter.',
    ],
    [
      '2n 表示 2×n；负数代入加括号，按先乘后加计算。',
      '2n means 2×n. Put substituted negative numbers in brackets and multiply before adding.',
    ],
  ],
  [
    [
      '区分图号 n、每次增加量与总数；按给定构造数三行和固定量。',
      'Distinguish stage n, growth per stage and total; count the three rows and fixed pieces in the given construction.',
    ],
    [
      '三行各 n 个加两个固定量是 3n+2；求图号则先减二再除三。',
      'Three rows of n plus two fixed pieces give 3n+2. To find the stage, subtract two and divide by three.',
    ],
  ],
  [
    [
      '先说每一组包含什么，再判断额外量出现一次还是每组一次。',
      'Describe what one group contains, then decide whether the extras occur once overall or in every group.',
    ],
    [
      '括号保护一整组；3(n+2)=3n+6，和 3n+2 的固定量不同。',
      'Brackets protect a whole group: 3(n+2)=3n+6, with a different fixed term from 3n+2.',
    ],
  ],
  [
    [
      '等号是相同值的关系；找使未知量单独留下的逆运算。',
      'Equality relates equal values; choose an inverse operation that isolates the unknown.',
    ],
    [
      '两边同加、同减或同乘除一个非零数，再把所得 x 代回原方程。',
      'Add or subtract the same amount, or multiply/divide by the same nonzero number, on both sides; substitute x in the original.',
    ],
  ],
  [
    [
      '先看括号整体经过了哪些运算，再倒过来撤销。',
      'Identify the operations applied to the bracketed whole, then undo them in reverse order.',
    ],
    [
      '3(x+2)=15 先同除三再同减二；(x−4)/2=3 先同乘二再同加四。',
      'For 3(x+2)=15, divide both sides by three then subtract two; for (x−4)/2=3, multiply by two then add four.',
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
    { accepted: [item.value], rejected: item.wrong },
    item.diagram,
  );
  result.answer = item.expression
    ? { kind: 'expression', value: item.value, variable: 'n' }
    : { kind: 'number', value: item.value, formats: ['decimal', 'fraction'] };
  result.misconceptionTags = [
    skills[index]!,
    'letter-role',
    'operation-order',
    'check-original',
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
    title: ['用字母代表数', 'Letters stand for numbers'],
    objective: [
      '区分字母、运算与数值，在同一式子中一致代入并保留负号。',
      'Distinguish a letter, operation and value, substituting consistently and retaining negative signs.',
    ],
    prerequisites: ['P55-L01', 'P64-L04'],
    keywords: [
      ['字母表示数', 'letter as a number'],
      ['代入', 'substitution'],
      ['系数', 'coefficient'],
    ],
    lab: 'algebra-letter',
    hook: [
      'n+n+3 中两个 n 能随意取不同的数吗？n 改为零或负二，2n+3 又是多少？',
      'Can the two n values in n+n+3 be chosen differently? What happens to 2n+3 at zero or negative two?',
    ],
    numbers: [
      {
        stem: ['当 n=4，2n+3 是多少？', 'When n=4, what is 2n+3?'],
        value: '11',
        steps: [
          '2×4+3=8+3=11；2n 不表示 2+n。',
          '2×4+3=8+3=11; 2n does not mean 2+n.',
        ],
        wrong: ['9', '23', '43'],
      },
      {
        stem: ['当 n=0，2n+3 是多少？', 'When n=0, what is 2n+3?'],
        value: '3',
        steps: [
          '2×0+3=3；字母为零不消去常数三。',
          '2×0+3=3; zero for the letter does not remove the constant three.',
        ],
        wrong: ['0', '5'],
      },
      {
        stem: ['当 n=−2，2n+3 是多少？', 'When n=−2, what is 2n+3?'],
        value: '-1',
        steps: ['2×(−2)+3=−4+3=−1。', '2×(−2)+3=−4+3=−1.'],
        wrong: ['7', '1', '-7'],
      },
      {
        stem: ['当 n=5，n+n+n 是多少？', 'When n=5, what is n+n+n?'],
        value: '15',
        steps: [
          '三个 n 都取五，5+5+5=15，也写 3n。',
          'All three occurrences are five: 5+5+5=15, also written 3n.',
        ],
        wrong: ['8', '555', '125'],
      },
      {
        stem: ['a=2、b=5，a+b 是多少？', 'If a=2 and b=5, what is a+b?'],
        value: '7',
        steps: [
          '不同字母按各自给定值代入：2+5=7。',
          'Substitute each assigned value: 2+5=7.',
        ],
        wrong: ['4', '10', '25'],
      },
      {
        stem: ['当 n=−3，4n+1 是多少？', 'When n=−3, what is 4n+1?'],
        value: '-11',
        steps: [
          '4×(−3)+1=−12+1=−11；把负号留在括号内。',
          '4×(−3)+1=−12+1=−11; retain the sign inside the brackets.',
        ],
        wrong: ['13', '-13', '2'],
      },
    ],
    pick: {
      stem: ['哪句话正确解释 2n？', 'Which statement correctly explains 2n?'],
      correct: 1,
      options: [
        {
          text: ['2+n', '2+n'],
          feedback: [
            '这把乘法改成加法；n=4 时得到六而不是八。',
            'That changes multiplication to addition: at n=4 it gives six instead of eight.',
          ],
        },
        {
          text: [
            '2×n，是两个相同 n 的和',
            '2×n, the sum of two equal n values',
          ],
          feedback: [
            '系数二表示两份相同的数。',
            'The coefficient two represents two equal copies.',
          ],
        },
        {
          text: [
            '把数字 2 和 n 的数码拼起来',
            'Join the digit 2 to the digits of n',
          ],
          feedback: [
            '代数相邻表示乘法，不是十进制拼接。',
            'Adjacency here denotes multiplication, not decimal concatenation.',
          ],
        },
      ],
      steps: [
        '2n=n+n=2×n，所有 n 都取同一给定数。',
        '2n=n+n=2×n; every n takes the same assigned value.',
      ],
    },
    reason: [
      '用 n=0 和 n=−2 说明为什么 n+n+3 可写 2n+3，却不能写 n+5。',
      'Use n=0 and n=−2 to explain why n+n+3 equals 2n+3 but not n+5.',
    ],
    rubric: [
      '两个相同 n 相加是两份 n，故可写 2n，三保持不变。n=0 时原式三而 n+5 为五；n=−2 时原式 −1 而 n+5 为三。反例排除错误式，一致代入与两份结构说明正确式；不是凭一次数值巧合宣布恒等。允许纸笔或口头说明，家长核对同值代入、乘法含义和负号。',
      'Two identical n terms make two copies, written 2n, with three unchanged. At n=0 the original is three while n+5 is five; at n=−2 the original is −1 while n+5 is three. Counterexamples reject the wrong expression, while consistent substitution and the two-copy structure justify the correct one. Accept drawings or spoken reasoning, checking consistent values, multiplication and signs.',
    ],
    misconception: [
      '把 2n 当 2+n、拼数，或把同一式子的 n 随意取成不同值。',
      'Treating 2n as 2+n, concatenation, or assigning different values to repeated n.',
    ],
    prompts: [
      ['每一个 n 分别代入什么？', 'What replaces every occurrence of n?'],
      [
        '字母为零时，常数还在吗？',
        'When the letter is zero, does the constant remain?',
      ],
    ],
  },
  {
    title: ['根据规则求第n项', 'Finding the nth term from a pattern'],
    objective: [
      '根据三行加固定量的明确构造写第 n 项，区分图号、增长与总数。',
      'Derive the nth term from a specified three-row construction, separating stage, growth and total.',
    ],
    prerequisites: ['P65-L01', 'P55-L03'],
    keywords: [
      ['图号 n', 'stage index n'],
      ['通用规则', 'general rule'],
      ['固定量', 'fixed term'],
    ],
    lab: 'algebra-nth',
    hook: [
      '第 1 幅五个、第 2 幅八个。知道每幅严格由三行各 n 个再加两个构成，能不画前面各幅直接求第 20 幅吗？',
      'Stages 1 and 2 have five and eight. Given exactly three rows of n plus two extras, can you find stage 20 without drawing all earlier stages?',
    ],
    numbers: [
      {
        stem: [
          '图 n 有三行各 n 个圆点及两个固定方块。第 20 幅总数多少？',
          'Stage n has three rows of n circles and two fixed squares. How many at stage 20?',
        ],
        value: '62',
        steps: [
          '3×20+2=62；图号二十不是总数，也不是只增加三。',
          '3×20+2=62; twenty is the stage index rather than the total.',
        ],
        wrong: ['60', '23', '66'],
      },
      {
        stem: [
          '同一构造第 10 幅有多少个？',
          'How many pieces at stage 10 of the same construction?',
        ],
        value: '32',
        steps: [
          '三行各十个加二：30+2=32。',
          'Three rows of ten plus two give 30+2=32.',
        ],
        wrong: ['30', '13', '36'],
      },
      {
        stem: [
          '同一构造第 1 幅有多少个？',
          'How many pieces at stage 1 of the same construction?',
        ],
        value: '5',
        steps: [
          '3×1+2=5；初始图不是只有增长量三。',
          '3×1+2=5; the first total is not merely the growth of three.',
        ],
        wrong: ['3', '2', '6'],
        diagram: { kind: 'algebra-groups', n: 1, inside: false },
      },
      {
        stem: [
          '同一构造一幅有 29 个。它是第几幅？',
          'A stage of the same construction has 29 pieces. What is its stage index?',
        ],
        value: '9',
        steps: [
          '先扣两个固定方块，27÷3=9，代回 3×9+2=29。',
          'Remove the two fixed pieces: 27÷3=9. Check 3×9+2=29.',
        ],
        wrong: ['29', '27', '10'],
      },
      {
        stem: [
          '三行各 n 个，另有两个固定方块。写总数的通用式。',
          'Three rows of n pieces plus two fixed squares: write the general total.',
        ],
        value: '3n+2',
        expression: true,
        steps: [
          'n+n+n+2=3n+2；两方块只加一次。',
          'n+n+n+2=3n+2; the fixed two are added once.',
        ],
        wrong: ['3n', 'n+3', '3(n+2)', '5'],
      },
      {
        stem: [
          '同一构造第 15 幅总数多少？',
          'What is the total at stage 15 of the same construction?',
        ],
        value: '47',
        steps: ['3×15+2=45+2=47。', '3×15+2=45+2=47.'],
        wrong: ['45', '17', '51'],
      },
    ],
    pick: {
      stem: [
        '为什么本构造总数是 3n+2？',
        'Why does this construction have total 3n+2?',
      ],
      correct: 2,
      options: [
        {
          text: [
            '因为看到两项差三，任何后续一定如此',
            'Two terms differ by three, so every possible continuation must do so',
          ],
          feedback: [
            '有限项可以有别的延续；这里依据明确构造。',
            'A finite list admits other continuations; use the specified construction.',
          ],
        },
        {
          text: [
            '因为图号就是三个圆点',
            'The stage index itself is three circles',
          ],
          feedback: [
            'n 是图号，每行有 n 个，不能固定为三。',
            'n is the stage index and count in each row, not always three.',
          ],
        },
        {
          text: [
            '三行各 n 个，再加两个固定方块',
            'Three rows of n, plus two fixed squares',
          ],
          feedback: [
            '各部分逐项对应式子，适用于所有允许图号。',
            'Each constructed part matches the expression for every allowed stage.',
          ],
        },
      ],
      steps: [
        '三行贡献 3n，额外两块贡献二；结构支持通用规则。',
        'The rows contribute 3n and the extras two; the construction supports the general rule.',
      ],
    },
    reason: [
      '比较 3n 与 3n+2。为什么“每次增加三”还不能单独给出总数？再说明只有五、八两项不能唯一确定后续。',
      'Compare 3n and 3n+2. Why is growth of three insufficient to specify the total? Explain why five and eight alone do not uniquely determine later terms.',
    ],
    rubric: [
      '每增加一幅三行各添一，增长三，但两个固定方块始终存在。第 1 幅为五，3n 只有三，故漏了固定量；3n+2 将三行和两块逐项对应。只给五、八可设计许多后续，不能推出唯一通式；本题由明确构造给出一般依据。家长核对图号、总数、固定项和构造证据，允许画图说明。',
      'Each new stage adds one to each of three rows, giving growth three, but two fixed squares remain. At stage 1 the total is five, while 3n gives only three. The expression 3n+2 accounts for every constructed part. Five and eight alone allow many continuations; the defined construction supplies the general justification. Check the index, total, fixed term and structural evidence rather than a recalled slogan.',
    ],
    misconception: [
      '把公差当总数，或用有限项猜测冒充一般证明。',
      'Confusing common growth with total, or treating a finite pattern guess as general proof.',
    ],
    prompts: [
      [
        '式子哪部分对应每一行？',
        'Which part of the expression matches each row?',
      ],
      [
        '两个额外块在每次增长后还在吗？',
        'Do the two extras remain after every growth step?',
      ],
    ],
  },
  {
    title: ['列简单代数式', 'Writing simple expressions'],
    objective: [
      '按情境的分组、顺序和固定量构造通用代数式，接受精确等值写法。',
      'Construct general expressions from grouping, order and fixed quantities, recognizing exact equivalent forms.',
    ],
    prerequisites: ['P65-L02', 'P55-L05'],
    keywords: [
      ['代数式', 'expression'],
      ['括号整体', 'bracketed whole'],
      ['等值式', 'equivalent expression'],
    ],
    lab: 'algebra-expression',
    hook: [
      '三袋每袋 n+2 个，和三袋各 n 个再在袋外放两个，为什么不能写成同一个式子？',
      'Why do three bags of n+2 differ from three bags of n with only two extras outside?',
    ],
    numbers: [
      {
        stem: [
          '三袋，每袋 n 个圆点和两个方块。用 n 写总数，不写等号。',
          'Three bags each contain n circles and two squares. Write the total in n, without an equal sign.',
        ],
        value: '3(n+2)',
        expression: true,
        steps: [
          '每袋 n+2，三袋为 3(n+2)=3n+6。',
          'Each bag contains n+2; three bags give 3(n+2)=3n+6.',
        ],
        wrong: ['3n+2', 'n+6', '15'],
        diagram: { kind: 'algebra-groups', n: 3, inside: true },
      },
      {
        stem: [
          '三袋各 n 个，袋外总共另加两个。写总数式子。',
          'Three bags of n pieces, with two extra pieces overall outside. Write the total.',
        ],
        value: '3n+2',
        expression: true,
        steps: [
          '三袋贡献 3n，额外二只加一次。',
          'The bags contribute 3n, and two is added once overall.',
        ],
        wrong: ['3(n+2)', 'n+2', '5n'],
      },
      {
        stem: [
          '两个相同数，每个都比 n 少四。写这两个数的和。',
          'Two equal numbers are each four less than n. Write their sum.',
        ],
        value: '2(n-4)',
        expression: true,
        steps: [
          '每个数为 n−4，两个数为 2(n−4)=2n−8。',
          'Each number is n−4; their sum is 2(n−4)=2n−8.',
        ],
        wrong: ['2n-4', '2(4-n)', 'n-8'],
      },
      {
        stem: [
          '从十减去 n，写所得数的式子。',
          'Write an expression for subtracting n from ten.',
        ],
        value: '10-n',
        expression: true,
        steps: [
          '原量十，减去 n，故 10−n；顺序不能交换。',
          'Start with ten and subtract n: 10−n. The order cannot be reversed.',
        ],
        wrong: ['n-10', '10+n', '10n'],
      },
      {
        stem: [
          '数 n 的一半再加三，写式子。',
          'Write an expression for half of n, then add three.',
        ],
        value: 'n/2+3',
        expression: true,
        steps: [
          '先 n÷2，再加三；不把三也除二。',
          'First n÷2, then add three; the three is not divided by two.',
        ],
        wrong: ['(n+3)/2', '2n+3', 'n/5'],
      },
      {
        stem: [
          '四袋，每袋 n 个圆点和一个方块。用 n 写总数式子。',
          'Four bags each contain n circles and one square. Write the total in n.',
        ],
        value: '4(n+1)',
        expression: true,
        steps: [
          '每袋 n+1，四袋为 4(n+1)=4n+4。',
          'Each bag has n+1, so four bags give 4(n+1)=4n+4.',
        ],
        wrong: ['4n+1', 'n+4', '4n'],
      },
    ],
    pick: {
      stem: [
        '哪一个式子总与 3(n+2) 等值？',
        'Which expression is equivalent to 3(n+2) for every n?',
      ],
      correct: 1,
      options: [
        {
          text: ['3n+2', '3n+2'],
          feedback: [
            '只把 n 乘三，漏了另两份二。',
            'Only n was multiplied by three; two more copies of two are missing.',
          ],
        },
        {
          text: ['3n+6', '3n+6'],
          feedback: [
            '三份 n 加三份二，固定量六。',
            'Three copies of n and three copies of two give fixed total six.',
          ],
        },
        {
          text: ['5n', '5n'],
          feedback: [
            'n+2 不是 3n；常数与变量项不能直接拼成 5n。',
            'n+2 is not 3n; the fixed and changing terms cannot be combined into 5n.',
          ],
        },
      ],
      steps: [
        '3(n+2)=(n+2)+(n+2)+(n+2)=3n+6。',
        '3(n+2)=(n+2)+(n+2)+(n+2)=3n+6.',
      ],
    },
    reason: [
      '用分组解释 3(n+2) 与 3n+2，并用 n=0 检查固定量。为什么只在一个 n 代入相同不能证明两式通用等值？',
      'Explain 3(n+2) and 3n+2 by grouping, then check the fixed terms at n=0. Why does agreement at one n not prove general equivalence?',
    ],
    rubric: [
      '前式有三组，每组 n+2，所以固定量六；后式三组 n 之外只有二。n=0 时分别为六和二，明确不同。两式通用等值需要对应所有允许输入的结构，如重复加法或合法分配；某一次的相同可能是巧合，例如 2n 与 n+1 在 n=1 相同但 n=2 不同。家长核对固定量出现次数、括号整体、反例与一般理由。',
      'The first has three groups each containing n+2, so six fixed pieces; the second has only two extras beyond three groups of n. At n=0 they give six and two. General equivalence needs a structural argument valid for every allowed input, such as repeated addition or distribution. A single match may be coincidence: 2n and n+1 agree at n=1 but differ at n=2. Check grouping, fixed-term multiplicity, counterexamples and the general reason.',
    ],
    misconception: [
      '只乘括号里的一项，或用当前数值代替通用式。',
      'Multiplying only one bracketed term, or entering the current value instead of a general expression.',
    ],
    prompts: [
      [
        '二出现几次，是每袋还是总共？',
        'How many times does two occur: per bag or overall?',
      ],
      [
        '换 n 后，式子还能对应情境吗？',
        'After n changes, does the expression still match the story?',
      ],
    ],
  },
  {
    title: ['方程与天平模型', 'Equations and balance models'],
    objective: [
      '用两边相同的可逆运算求一步方程的解，再代回原式核查。',
      'Solve one-step equations by equal reversible operations and verify in the original equation.',
    ],
    prerequisites: ['P65-L01', 'P55-L04', 'P64-L04'],
    keywords: [
      ['方程', 'equation'],
      ['解', 'solution'],
      ['等价变形', 'equivalent transformation'],
    ],
    lab: 'algebra-balance',
    hook: [
      '2x=10 两边同除二后得到 x=5。若只把左边除二，得到的 x=10 还是原来的解吗？',
      'Dividing both sides of 2x=10 by two gives x=5. If only the left is divided, does x=10 still solve the original?',
    ],
    numbers: [
      {
        stem: ['解方程 2x=10，只写 x。', 'Solve 2x=10; enter x only.'],
        value: '5',
        steps: [
          '两边同除二得 x=5；代回 2×5=10。',
          'Divide both sides by two: x=5. Check 2×5=10.',
        ],
        wrong: ['10', '20', '8'],
      },
      {
        stem: ['解方程 x+5=2，只写 x。', 'Solve x+5=2; enter x only.'],
        value: '-3',
        steps: [
          '两边同减五，x=2−5=−3；−3+5=2。',
          'Subtract five from both sides: x=2−5=−3. Check −3+5=2.',
        ],
        wrong: ['3', '7', '-7'],
      },
      {
        stem: ['解方程 4x=2，保留精确值。', 'Solve 4x=2 exactly.'],
        value: '1/2',
        steps: [
          '两边同除四，x=2/4=1/2；4×1/2=2。',
          'Divide by four: x=2/4=1/2. Check 4×1/2=2.',
        ],
        wrong: ['2', '8', '1/4'],
      },
      {
        stem: ['解方程 x−4=−4。', 'Solve x−4=−4.'],
        value: '0',
        steps: [
          '两边同加四得 x=0；0−4=−4。',
          'Add four to both sides: x=0. Check 0−4=−4.',
        ],
        wrong: ['-8', '4', '8'],
      },
      {
        stem: ['解方程 −3x=12。', 'Solve −3x=12.'],
        value: '-4',
        steps: [
          '两边同除 −3，x=−4；(−3)×(−4)=12。',
          'Divide both sides by −3: x=−4. Check (−3)×(−4)=12.',
        ],
        wrong: ['4', '-36', '9'],
      },
      {
        stem: ['解方程 7=2x，只写 x。', 'Solve 7=2x; enter x only.'],
        value: '7/2',
        steps: [
          '交换书写两边不改相等关系，两边同除二得 x=7/2。',
          'Reversing the written sides does not change equality. Divide both by two: x=7/2.',
        ],
        wrong: ['14', '5', '2/7'],
      },
    ],
    pick: {
      stem: [
        '从 2x=10 出发，哪一步保留完全相同的解？',
        'Starting from 2x=10, which step preserves exactly the same solution?',
      ],
      correct: 0,
      options: [
        {
          text: ['两边同除二，得 x=5', 'Divide both sides by two to get x=5'],
          feedback: [
            '除数非零，能用同乘二逆回原式。',
            'The divisor is nonzero, so multiplying by two recovers the original.',
          ],
        },
        {
          text: [
            '只把左边除二，得 x=10',
            'Divide only the left by two to get x=10',
          ],
          feedback: [
            '只改左边，原解五不再满足新式。',
            'Only one side changed; the original solution five no longer satisfies the new equation.',
          ],
        },
        {
          text: [
            '两边同乘零，得 0=0，所以任何数都是原解',
            'Multiply both by zero: 0=0, so every number solves the original',
          ],
          feedback: [
            '零乘法丢失原限制；0=0 的解集比原式更大。',
            'Multiplication by zero loses the original constraint; 0=0 has more solutions.',
          ],
        },
      ],
      steps: [
        '可逆同做保留解；乘零不能逆回，单边变形一般改变解。',
        'Equal reversible operations preserve solutions; multiplying by zero cannot be undone, and one-sided changes generally alter solutions.',
      ],
    },
    reason: [
      '从 2x=10 只改左边得 x=10，为什么不是合法求解？说明同乘零的另一种问题。',
      'Why is changing only the left of 2x=10 to get x=10 invalid for solving? Explain the different problem caused by multiplying both sides by zero.',
    ],
    rubric: [
      '原式的解五，代回 2×5=10；单边变形所得十代回是二十，不等于十，因此改变了原解。两边同乘零虽让原解仍满足新式，却使任意数都满足 0=0，失去原限制，不能把新式的任意解倒推为原解。两边同除非零二可逆，保留完全相同的解。家长核对原式代入、两边相同与可逆三个依据。',
      'The original solution five gives 2×5=10. The one-sided result ten gives twenty on substitution, so it changes the solution. Multiplying both sides by zero keeps original solutions but also admits every other number through 0=0, losing the original constraint. Dividing both sides by nonzero two is reversible and preserves exactly the solution set. Check original substitution, equal actions and reversibility.',
    ],
    misconception: [
      '把等号当答案箭头，只改一边；认为两边同乘零也能保持完全相同的解。',
      'Treating equality as an answer arrow, changing one side, or assuming multiplication by zero preserves exactly the solution set.',
    ],
    prompts: [
      [
        '新答案代回原式相等吗？',
        'Does the new answer satisfy the original equation?',
      ],
      ['这一步能合法倒回原式吗？', 'Can this step be legally reversed?'],
    ],
  },
  {
    title: ['有括号的一步至两步方程', 'One- and two-step equations'],
    objective: [
      '把括号看作整体，倒序撤销一步至两步运算，保留精确分数解并代回。',
      'Treat brackets as a whole, undo one or two operations in reverse order and verify exact fractional solutions.',
    ],
    prerequisites: ['P65-L03', 'P65-L04', 'P61-L05'],
    keywords: [
      ['括号整体', 'bracketed whole'],
      ['逆运算顺序', 'inverse-operation order'],
      ['原式核验', 'original substitution'],
    ],
    lab: 'algebra-brackets',
    hook: [
      '3(x+2)=15 是先添二再乘三。求 x 时该先撤销哪一步？若右边改为五，答案一定是整数吗？',
      'In 3(x+2)=15, add two before multiplying by three. Which action should be undone first? If the right side becomes five, must x be an integer?',
    ],
    numbers: [
      {
        stem: ['解 3(x+2)=15，只写 x。', 'Solve 3(x+2)=15; enter x only.'],
        value: '3',
        steps: [
          '先同除三：x+2=5；再同减二：x=3。代回 3(3+2)=15。',
          'Divide both sides by three: x+2=5. Subtract two: x=3. Check 3(3+2)=15.',
        ],
        wrong: ['13', '5', '7'],
      },
      {
        stem: ['解 (x−4)/2=3。', 'Solve (x−4)/2=3.'],
        value: '10',
        steps: [
          '同乘二得 x−4=6，再同加四得十；(10−4)/2=3。',
          'Multiply by two: x−4=6. Add four: x=10. Check (10−4)/2=3.',
        ],
        wrong: ['2', '5', '-2'],
      },
      {
        stem: [
          '解 3(x+2)=5，写精确分数。',
          'Solve 3(x+2)=5, using an exact fraction.',
        ],
        value: '-1/3',
        steps: [
          '同除三得 x+2=5/3，再减二得 −1/3。3(−1/3+2)=5。',
          'Divide by three: x+2=5/3. Subtract two: x=−1/3. Check 3(−1/3+2)=5.',
        ],
        wrong: ['1', '1/3', '-0.33'],
      },
      {
        stem: ['解 2(x−3)=−2。', 'Solve 2(x−3)=−2.'],
        value: '2',
        steps: [
          '同除二得 x−3=−1，再同加三得二；2(2−3)=−2。',
          'Divide by two: x−3=−1. Add three: x=2. Check 2(2−3)=−2.',
        ],
        wrong: ['-4', '-2', '-1'],
      },
      {
        stem: ['解 5(x+1)=5。', 'Solve 5(x+1)=5.'],
        value: '0',
        steps: [
          '同除五得 x+1=1，再减一得零；5(0+1)=5。',
          'Divide by five: x+1=1. Subtract one: x=0. Check 5(0+1)=5.',
        ],
        wrong: ['1', '4', '5'],
      },
      {
        stem: ['解 2(x+4)=3，写精确值。', 'Solve 2(x+4)=3 exactly.'],
        value: '-5/2',
        steps: [
          '同除二得 x+4=3/2，再减四得 −5/2；2(−5/2+4)=3。',
          'Divide by two: x+4=3/2. Subtract four: x=−5/2. Check 2(−5/2+4)=3.',
        ],
        wrong: ['-1/2', '5/2', '-5'],
      },
    ],
    pick: {
      stem: [
        '解 3(x+2)=15，下面哪条路径正确？',
        'Which path correctly solves 3(x+2)=15?',
      ],
      correct: 2,
      options: [
        {
          text: ['x+2=15，x=13', 'x+2=15, x=13'],
          feedback: [
            '漏了右边同除三。',
            'The right side was not divided by three.',
          ],
        },
        {
          text: ['3x+2=15，x=13/3', '3x+2=15, x=13/3'],
          feedback: [
            '展开时二也要乘三，原固定量应为六。',
            'Distribution must multiply two by three as well; the fixed term is six.',
          ],
        },
        {
          text: ['x+2=5，x=3', 'x+2=5, x=3'],
          feedback: [
            '同除三后同减二，均对两边做可逆运算。',
            'Divide both sides by three, then subtract two from both; each step is reversible.',
          ],
        },
      ],
      steps: [
        '也可正确展开为 3x+6=15，再同减六、同除三。两条合法路径都回到 x=3。',
        'Alternatively expand to 3x+6=15, subtract six, then divide by three. Both valid paths give x=3.',
      ],
    },
    reason: [
      '比较先同除三和先正确展开两条路径，解 3(x+2)=5，并代回。为什么不能把 −1/3 写成 −0.33 作为精确解？',
      'Solve 3(x+2)=5 by division-first and by correct expansion, then substitute. Why is −0.33 not an exact replacement for −1/3?',
    ],
    rubric: [
      '先同除三得 x+2=5/3，再减二得 −1/3；或展开为 3x+6=5，再减六得 3x=−1，同除三仍为 −1/3。代回 −1/3+2=5/3，乘三为五。−0.33 代回得到 5.01 而非五，只是近似不能替代精确解。家长核对括号整体、每一步两边相同、分数精确保留和原式验证，允许任一合法路径。',
      'Division-first gives x+2=5/3 and then x=−1/3. Correct expansion gives 3x+6=5, then 3x=−1 and again x=−1/3. Substitution gives −1/3+2=5/3, multiplied by three to make five. Substituting −0.33 instead gives 5.01, an approximation rather than an exact solution. Check the whole bracket, equal operations, exact fractions and verification in the original; either valid route is acceptable.',
    ],
    misconception: [
      '漏乘括号常数、逆运算次序错误，或把有限小数近似当精确解。',
      'Omitting the bracketed constant during distribution, undoing in the wrong order or replacing an exact solution by a rounded decimal.',
    ],
    prompts: [
      [
        '最后做的运算应怎样先撤销？',
        'How do you undo the last operation first?',
      ],
      [
        '把分数代回原式，两边各是多少？',
        'After substituting the fraction, what does each original side equal?',
      ],
    ],
  },
];
export const p65Lessons: Lesson[] = specs.map((s, i) => {
  const id = `P65-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: i === 4 ? 24 : 20,
    lab: s.lab,
    hook: T(s.hook),
    stage: 'P06',
    unit: 'P65',
    order: i + 1,
    nzYearHints: [6, 7],
    cnGradeHints: [6],
    contentStatus: 'ready',
    skillTags: [skills[i]!],
    guided: q(`${id}-G`, i, s.numbers[0]!),
    questions: [
      pick(`${id}-Q1`, i, s.pick),
      ...s.numbers.slice(1, 5).map((item, j) => q(`${id}-Q${j + 2}`, i, item)),
      reasoning(
        `${id}-Q6`,
        T(s.reason),
        skills[i]!,
        T(s.rubric),
        hints[i]!.map(T),
      ),
    ],
    exit: q(`${id}-X`, i, s.numbers[5]!),
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
            '用三行纸片各 n 个，另放两个固定块，构造第 1、2、5 幅并写规则。再把额外两个改成每袋两个，比较式子。家长写 3(x+2)=15 与 3(x+2)=5，让孩子记录两边同做的运算并代回；保留分数，不需要称重或购买材料。',
            'Arrange three rows of n paper pieces with two fixed extras for stages 1, 2 and 5, then write the rule. Move two extras into every bag and compare expressions. A parent writes 3(x+2)=15 and 3(x+2)=5; record equal operations and substitute the answers. Keep fractions exact; no weighing or purchases are needed.',
          ),
        }
      : {}),
  };
});
export function p65ReviewQuestion(id: string, round: number): Question {
  if (!Number.isSafeInteger(round) || round < 0 || round > 100000)
    throw new RangeError('Invalid retrieval round');
  const i = p65Lessons.findIndex((l) => l.id === id);
  if (i < 0) throw new RangeError('Unknown P65 lesson');
  const k = round % 80,
    a = 2 + (k % 4),
    b = 1 + (Math.floor(k / 4) % 5),
    n = -4 + (k % 13);
  let item: Item;
  if (i === 0)
    item = {
      stem: [
        `n=${n} 时，${a}n+${b} 是多少？`,
        `When n=${n}, what is ${a}n+${b}?`,
      ],
      value: String(a * n + b),
      steps: [
        `${a}×(${n})+${b}=${a * n + b}。`,
        `${a}×(${n})+${b}=${a * n + b}.`,
      ],
      wrong: [String(a * n + b + 1)],
    };
  else if (i === 1) {
    const stage = 1 + (k % 24);
    item = {
      stem: [
        `构造规定：第 n 幅有 ${a} 行各 n 个，另有 ${b} 个固定量。第 ${stage} 幅总数？`,
        `Construction: stage n has ${a} rows of n plus ${b} fixed pieces. Find the total at stage ${stage}.`,
      ],
      value: String(a * stage + b),
      steps: [
        `${a}n+${b}，代入 ${stage} 得 ${a * stage + b}。`,
        `${a}n+${b} at ${stage} gives ${a * stage + b}.`,
      ],
      wrong: [String(a * stage)],
    };
  } else if (i === 2)
    item = {
      stem: [
        `${a} 袋，每袋 n+${b} 个。写总数通用式。`,
        `${a} bags each contain n+${b} pieces. Write the general total.`,
      ],
      value: `${a}(n+${b})`,
      expression: true,
      steps: [
        `每袋括号整体乘 ${a}，等值于 ${a}n+${a * b}。`,
        `Multiply the whole bracket by ${a}, equivalent to ${a}n+${a * b}.`,
      ],
      wrong: [`${a}n+${b}`, String(a + b)],
    };
  else if (i === 3) {
    const total = n;
    item = {
      stem: [`解 ${a}x=${total}，写精确值。`, `Solve ${a}x=${total} exactly.`],
      value: `${total}/${a}`,
      steps: [
        `两边同除 ${a} 得 ${total}/${a}，再代回。`,
        `Divide both sides by ${a} to get ${total}/${a}, then substitute.`,
      ],
      wrong: [String(total * a + 1)],
    };
  } else
    item = {
      stem: [
        `解 ${a}(x+${b})=${n}，写精确值。`,
        `Solve ${a}(x+${b})=${n} exactly.`,
      ],
      value: `${n - a * b}/${a}`,
      steps: [
        `先同除 ${a} 再同减 ${b}，x=${n}/${a}−${b}=${n - a * b}/${a}。`,
        `Divide by ${a}, then subtract ${b}: x=${n}/${a}−${b}=${n - a * b}/${a}.`,
      ],
      wrong: [`${n - a * b + a}/${a}`],
    };
  return q(`${id}-R${round}`, i, item);
}
export const p65CheckQuestions: Question[] = [
  q('P65-CHECK-Q1', 0, {
    stem: ['n=−3，2n+5 是多少？', 'When n=−3, what is 2n+5?'],
    value: '-1',
    steps: ['2×(−3)+5=−1。', '2×(−3)+5=−1.'],
    wrong: ['11', '1'],
  }),
  q('P65-CHECK-Q2', 1, {
    stem: [
      '第 n 幅严格由三行各 n 个加两个固定量构成。第九幅总数多少？',
      'Stage n is defined as three rows of n plus two fixed pieces. What is the total at stage nine?',
    ],
    value: '29',
    steps: ['3×9+2=29。', '3×9+2=29.'],
    wrong: ['27', '11'],
  }),
  q('P65-CHECK-Q3', 2, {
    stem: [
      '三盒每盒 n+2 个，写总数式子。',
      'Three boxes each hold n+2 pieces. Write the general total.',
    ],
    value: '3(n+2)',
    expression: true,
    steps: ['3(n+2)=3n+6。', '3(n+2)=3n+6.'],
    wrong: ['3n+2', '15'],
  }),
  q('P65-CHECK-Q4', 3, {
    stem: ['解 2x=−7。', 'Solve 2x=−7.'],
    value: '-7/2',
    steps: [
      '同除二得 −7/2；两倍为 −7。',
      'Divide by two: −7/2. Its double is −7.',
    ],
    wrong: ['7/2', '-14'],
  }),
  q('P65-CHECK-Q5', 4, {
    stem: ['解 4(x+1)=6。', 'Solve 4(x+1)=6.'],
    value: '1/2',
    steps: ['x+1=3/2，减一得 1/2。', 'x+1=3/2; subtract one to get 1/2.'],
    wrong: ['5', '3/2', '-1/2'],
  }),
  pick('P65-CHECK-Q6', 3, specs[3]!.pick),
  q('P65-CHECK-Q7', 2, {
    stem: [
      '五组各 n 个，额外总共一个。写总数式子。',
      'Five groups of n with one extra overall: write the general total.',
    ],
    value: '5n+1',
    expression: true,
    steps: [
      '五份 n 加一次一，故 5n+1。',
      'Five copies of n plus one overall give 5n+1.',
    ],
    wrong: ['5(n+1)', 'n+5', '6n'],
  }),
  reasoning(
    'P65-CHECK-Q8',
    t(
      '比较三袋每袋 n+2 与三袋各 n 再另加二；写式子，并说明怎样解 3(x+2)=5，再代回核验。',
      'Compare three bags of n+2 with three bags of n plus two extras overall. Write expressions, solve 3(x+2)=5 and verify by substitution.',
    ),
    skills[4]!,
    t(
      '分别为 3(n+2)=3n+6 与 3n+2，差在固定量六或二；按分组解释，不只试一个输入。方程先同除三再同减二得 −1/3，代回括号为 5/3，乘三为五。也可正确展开后解。家长核对字母角色、固定量次数、两边同做、精确分数与原式核验，不能靠答案数字或关键词自动确认理解。',
      'The expressions are 3(n+2)=3n+6 and 3n+2, differing in fixed totals six and two; explain the grouping rather than trying only one input. Divide both equation sides by three, then subtract two to get −1/3. Substitution makes the bracket 5/3, multiplied by three to give five. Correct expansion is another valid route. Check letter roles, fixed-term multiplicity, equal operations, exact fractions and original substitution; keywords alone do not demonstrate understanding.',
    ),
    hints[4]!.map(T),
  ),
];
