import { t, type Question } from '../model';
import { reasoning } from './builders';
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const frac = (n: number, d: number) => {
  const g = gcd(n, d);
  return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`;
};
const makeSet = (unit: 'P57' | 'P65') => {
  const first = unit === 'P57',
    id = (n: number) => `${unit}-MAINT-EQUATION-MEANING-Q${n}`;
  const task = (
    n: number,
    skill: string,
    z: string,
    e: string,
    rz: string,
    re: string,
    hz: string,
    he: string,
  ) =>
    reasoning(id(n), t(z, e), skill, t(rz, re), [
      t(hz, he),
      t(
        '一次只做一个编号小问或一行，先画、列关系与自己的理由，再核全部小问；正确数字或关键词不自动表示理解。',
        'Do ONE numbered subpart or row at a time. Generate diagrams, relationships and your own reasons before reviewing EVERY part; a correct number or keyword does not automatically establish understanding.',
      ),
    ]);
  const table = (
    q: Question,
    z: string,
    e: string,
    headers: [string, string][],
    rows: (string | ReturnType<typeof t>)[][],
  ) => {
    q.contextTable = {
      caption: t(z, e),
      columns: headers.map((h) => t(...h)),
      rows: rows.map((r) =>
        r.map((c) => (typeof c === 'string' ? t(c, c) : c)),
      ),
    };
  };
  const roles = [
    ['编号', 'ID'],
    ['含义', 'Meaning'],
    ['原始记录', 'Original record'],
  ] as [string, string][];
  const a = first ? 9 : 11,
    b = first ? 25 : 29,
    original = first ? 31 : 37,
    remainder = first ? 12 : 15,
    groups = first ? 5 : 6,
    total = first ? 35 : 42,
    divisor = first ? 4 : 5,
    each = first ? 7 : 8,
    zeroKnown = first ? 8 : 9,
    pairTotal = first ? 14 : 18;
  const q1 = task(
    1,
    'box-unknown',
    '① 各行是独立新题，相同一行方框表示同一个未知数；先按量名说明方框的对象，再自己求候选，画单位条或等组图并代回左右原值。未知量的位置有何不同，方框是否总是总量或零？② E由关系确定的零与起初“未知”有何区别？F两个方框能填两个不同却和正确的数吗？请给一个这种错误数对，再用相同候选代回。跨行的新题是否必须沿用上一行的方框值？单位张、支、每组量和组数为何不能混换？',
    '① Each row is a SEPARATE problem; repeated boxes WITHIN one row name the SAME unknown. Use the quantity label to define the object, independently find a candidate, DRAW unit strips or equal groups and compare both ORIGINAL side values. How does the unknown position change its role? Is a box always the total or zero? ② Distinguish E’s zero determined by a relationship from an initially unknown value. May F use two different numbers merely because their sum works? Generate one such invalid pair, then substitute one consistent value. Must separate rows reuse a previous value? Keep cards, pencils, per-group amounts and group counts distinct.',
    `A:□=${b - a}，${b - a}+${a}=${b}；B:□=${original - remainder}，${original}−${original - remainder}=${remainder}；C:□=${total / groups}，${groups}×${total / groups}=${total}；D:□=${divisor * each}，${divisor * each}÷${divisor}=${each}；E:□=0，0+${zeroKnown}=${zeroKnown}；F:□=${pairTotal / 2}，${pairTotal / 2}+${pairTotal / 2}=${pairTotal}。A未知加数、B去掉量、C每袋支数、D平均分前原张数，符号不是运算按钮或必为总数。E零由关系推出，不表示所有未知都为零。F反例${pairTotal / 2 - 2}+${pairTotal / 2 + 2}虽和正确，却违反同一符号同值；独立新题可有不同解。图和单位须与量名相符。`,
    `A:box=${b - a}; ${b - a}+${a}=${b}. B:box=${original - remainder}; ${original}−${original - remainder}=${remainder}. C:box=${total / groups}; ${groups}×${total / groups}=${total}. D:box=${divisor * each}; ${divisor * each}÷${divisor}=${each}. E:box=0; 0+${zeroKnown}=${zeroKnown}. F:box=${pairTotal / 2}; ${pairTotal / 2}+${pairTotal / 2}=${pairTotal}. A is an addend, B a removed amount, C pencils per bag and D the original card count before sharing, not a button or necessarily a total. E determines zero through its relationship, not by the meaning of an unknown. In F, ${pairTotal / 2 - 2}+${pairTotal / 2 + 2} has the correct sum but violates one-symbol/one-value. Independent new problems may have different solutions. Diagrams and units must retain the named objects.`,
    '先给每个方框起完整量名；找到数后核原式两边，不只看答案像不像。',
    'Name the quantity in each box before finding a number, then check both original sides rather than appearance.',
  );
  table(
    q1,
    '每行独立定义未知；F只在同一行要求重复方框同值。',
    'Each row defines its own unknown; only repeated boxes WITHIN F must match.',
    roles,
    [
      ['A', t('未知加数/张', 'Unknown addend/cards'), `□+${a}=${b}`],
      [
        'B',
        t('去掉量/张', 'Removed amount/cards'),
        `${original}−□=${remainder}`,
      ],
      ['C', t('每袋支数', 'Pencils per bag'), `${groups}×□=${total}`],
      [
        'D',
        t('平均分前原张数', 'Original cards before sharing'),
        `□÷${divisor}=${each}`,
      ],
      [
        'E',
        t('未知原张数', 'Unknown original cards'),
        `□+${zeroKnown}=${zeroKnown}`,
      ],
      [
        'F',
        t('同一个未知量重复两次', 'Same unknown repeated twice'),
        `□+□=${pairTotal}`,
      ],
    ],
  );

  const lb = first ? 2 : 3,
    lk = first ? 3 : 2,
    rb = 1,
    rk = first ? 9 : 10,
    solution = (rk - lk) / (lb - rb),
    trials = [0, first ? 2 : 1, solution],
    chainA = first ? 9 : 8,
    chainB = first ? 6 : 7,
    extra = first ? 2 : 3;
  const values = (
    leftBoxes: number,
    leftKnown: number,
    rightBoxes: number,
    rightKnown: number,
    english = true,
  ) =>
    trials
      .map((x) =>
        english
          ? `x=${x}:L=${leftBoxes * x + leftKnown},R=${rightBoxes * x + rightKnown},L−R=${(leftBoxes - rightBoxes) * x + leftKnown - rightKnown}`
          : `x=${x}：左${leftBoxes * x + leftKnown}、右${rightBoxes * x + rightKnown}、左减右${(leftBoxes - rightBoxes) * x + leftKnown - rightKnown}`,
      )
      .join(english ? '; ' : '；');
  const q2 = task(
    2,
    'equal-sign-relationship',
    '① O给两盘符号量，每框同值、每点为1。先画原图，用T三个候选逐一算左右值和左减右的差；水平画法本身能证明相等吗？等号反向会改变关系吗？② 每个操作均从原O重开：两边各加1点、各加1相同框、各去1框、各去1点，分别重算T三个候选的差，说明同量加减为何保差而不修正错误候选。③ 另从O只给左边加1点，在原正确候选下还成立吗？只给左边加1框，候选0时不改数值就能证明所有候选都保关系吗？连续两次两边去1框，第二次有足够对象吗，不足应如何处理？同除0是合法的吗？④ C连等式逐段值相同吗，修成两行或合法整式连等；区分计算顺序与等值关系。',
    '① O gives symbolic pans, one shared value per box and one per dot. DRAW the original and compute LEFT, RIGHT and LEFT−RIGHT for all THREE T candidates. Does a level drawing prove equality? Does reversing the sides change it? ② RESTART from O for EACH operation: add one dot to both, add one identical box to both, remove one box from both, remove one dot from both. Recompute the three differences and explain why matching addition/subtraction preserves a difference rather than repairing a wrong candidate. ③ From O add a dot to the LEFT ONLY: does the original correct candidate still work? If a LEFT-ONLY extra box changes nothing at candidate zero, does that prove preservation for all candidates? Remove one box from both twice: is the SECOND removal possible, and what should happen if not? Is dividing by zero valid? ④ Evaluate EVERY part of C’s chain and repair it as separate lines or an equal-valued whole-expression chain. Separate calculation sequence from equality.',
    `O:${values(lb, lk, rb, rk, false)}。正确候选${solution}；交换两边仅反向差的符号，不改相等条件。两边加点:${values(lb, lk + 1, rb, rk + 1, false)}。两边加框:${values(lb + 1, lk, rb + 1, rk, false)}。两边去框:${values(lb - 1, lk, rb - 1, rk, false)}。两边去点:${values(lb, lk - 1, rb, rk - 1, false)}。每种差都保原值。只给左加1点，原解下左${lb * solution + lk + 1}右${rb * solution + rk}，不等；只给左加框，x=0无变化但x=${solution}时左${(lb + 1) * solution + lk}右${rb * solution + rk}，反驳通用性。两边先去框后右盘0框，第二次不足，保原图不造负实物。同除0无定义。C各段值为15、${15 + extra}、${15 + extra}，不是连等；可写${chainA}+${chainB}=15，另写15+${extra}=${15 + extra}；或(${chainA}+${chainB})+${extra}=15+${extra}=${15 + extra}。`,
    `O:${values(lb, lk, rb, rk)}. Correct candidate ${solution}; side reversal negates the signed difference but preserves the equality condition. BOTH add dot:${values(lb, lk + 1, rb, rk + 1)}. BOTH add box:${values(lb + 1, lk, rb + 1, rk)}. BOTH remove box:${values(lb - 1, lk, rb - 1, rk)}. BOTH remove dot:${values(lb, lk - 1, rb, rk - 1)}. All preserve the original differences. LEFT-only dot: at the original solution, L=${lb * solution + lk + 1},R=${rb * solution + rk}, unequal. LEFT-only box leaves candidate zero unchanged but at x=${solution} gives L=${(lb + 1) * solution + lk},R=${rb * solution + rk}, disproving a general rule. After one common box removal the right has zero boxes; a second removal is impossible. Retain the state rather than negative objects. Division by zero is undefined. C has values 15, ${15 + extra}, ${15 + extra}, not an equality chain. Write ${chainA}+${chainB}=15 and separately 15+${extra}=${15 + extra}; or (${chainA}+${chainB})+${extra}=15+${extra}=${15 + extra}.`,
    '算差之前先说明每框同值；相同操作比较每个候选，不凭图水平或一次巧合。',
    'Use one value for every box, and compare differences for each candidate rather than a level beam or one coincidence.',
  );
  table(
    q2,
    'O为原左右两盘，T为候选列表，C为待检查连等式；每项操作从O重开。',
    'O gives original left/right pans, T lists candidates and C is a chain to audit; restart O for every operation.',
    [
      ['编号', 'ID'],
      ['左式/记录', 'Left / record'],
      ['右式/记录', 'Right / record'],
    ],
    [
      ['O', `${lb}□+${lk}`, `${rb}□+${rk}`],
      ['T', trials.join(', '), '—'],
      ['C', `${chainA}+${chainB}=15+${extra}=${15 + extra}`, '—'],
    ],
  );

  const ns = first ? [4, 7, 12] : [5, 8, 14],
    counts = (english: boolean) =>
      ns
        .map((n) =>
          english
            ? `n=${n}:sticks=${3 * n + 1},counters=${2 * n + 1}`
            : `n=${n}时小棒${3 * n + 1}根、计数点${2 * n + 1}个`,
        )
        .join(english ? '; ' : '；');
  const q3 = task(
    3,
    'pattern-expression',
    '① 明确构造：n个方形排一行、相邻恰共一边，每棒同长且只计一次。画N1图，分别按上/下/竖边计和“首4根以后每增1形添3根”写两个一般式，说明n不是棒数。不画全也求N2/N3，核长宽比例与共边去重。② 另画两行各n点加独立一点，写式并求三个n；不能漏额外点。用n=1、2反查4n和n+3用于方形、n+2用于点图的第一次巧合，增长量为何不是总量？③ 如果只给4、7、10且未规定构造，自造两个合理后续第四项；再说明明定每步共边后为何不能任意接别的构造。n=0空图能硬套3n+1吗？3n+1与3n+1=S的任务有何不同，S取N1实际棒数。',
    '① SPECIFIED construction: n squares in one row, neighbours sharing exactly one edge; sticks have equal length and each is counted once. DRAW N1 and derive two general expressions by counting top/bottom/vertical edges and by starting with FOUR and adding THREE per extra square. Explain why n is not the stick total. Calculate N2/N3 without drawing every piece, retaining square proportions and shared-edge uniqueness. ② Separately DRAW two rows of n counters PLUS ONE independent extra, form the expression and evaluate all three n values. Use n=1,2 to test 4n and n+3 for squares and n+2 for dots: why is one matching term insufficient, and why is growth not a total? ③ Given ONLY 4,7,10 without construction, GENERATE two possible fourth terms. Why can one not then change construction when the shared-edge rule IS specified? May n=0’s empty diagram blindly use 3n+1? Distinguish the expression 3n+1 from condition 3n+1=S, with S the N1 stick count.',
    `上n、下n、竖n+1，得n+n+(n+1)=3n+1；另4+3(n−1)=3n+1，正整数n成立。${counts(false)}。两行点为2n+1或1+2n，额外点只计一次。n=1方形4根，4n与n+3都偶合；n=2实际7根，分别为8根与5根，均错。点图n=1有3点，n+2也3；n=2应5点而n+2为4。3n遗漏固定1根。仅给4、7、10，可每步添3使第四13，或前三共边、从第四个起每次另放独立方形、都添4根，第四得14；它们是不同完整构造，不能拿后者替代已规定每步共边的题。n=0不在该首形存在的正整数定义中；真空图0棒，不能说3×0+1=1是空图答案。3n+1给n求棒数，3n+1=${3 * ns[0]! + 1}是约束，问满足条件的步数。`,
    `Count n top, n bottom and n+1 vertical: n+n+(n+1)=3n+1. Also 4+3(n−1)=3n+1 for POSITIVE integer n. ${counts(true)}. Two rows plus one give 2n+1 or 1+2n; count the extra once. At n=1 squares have four sticks, matching both 4n and n+3 accidentally; at n=2 actual seven contrasts with eight and five. For dots, n=1 gives three and fits n+2, but n=2 gives five rather than four. 3n misses the fixed one. For ONLY prefix 4,7,10, continuing by three gives fourth 13; joining the first three then placing EVERY later square separately adds four per step, giving fourth 14. These are different complete constructions, not interchangeable under a rule requiring EVERY neighbour to share. Zero is outside the positive-step definition; an empty diagram has zero sticks, not 3×0+1=1. The expression calculates a count for given n; 3n+1=${3 * ns[0]! + 1} imposes a condition on a step.`,
    '先用边集合或行和额外点证明一般式，再代入，不拿有限数字猜唯一未来。',
    'Justify the general expression using edges or rows and an extra before substituting; finite numbers alone do not determine a unique future.',
  );
  table(
    q3,
    '三个正整数构造步数；N1手画，N2/N3可据构造计算。',
    'Three positive construction steps; DRAW N1 and use the structure for N2/N3.',
    roles,
    ns.map((n, i) => [
      `N${i + 1}`,
      t('方形数/每行点数', 'Squares / counters per row'),
      String(n),
    ]),
  );

  const factor = first ? 3 : 6,
    approx = first ? '0.333' : '0.167',
    sub = first ? 7 : 9,
    right = first ? 15 : 17,
    div = first ? 5 : 6,
    quotient = first ? 7 : 8,
    add = first ? '2/5' : '3/8',
    uniqueFactor = first ? 5 : 7,
    contradiction = first ? 4 : 7;
  const q4 = task(
    4,
    'one-step-equation',
    '① 本卡允许非负有理数。对A/B/C/D/H逐行先写合法两边逆操作、保留精确解并代回原式；不凭移项口号，分数不截整数，允许的精确小数可与分数等量。A再试表中近似值，比原两边是否完全相等。② E/F/H分别属于全部允许值、没有值、唯一零中的哪类，给具体候选与通用乘法理由；不能把这些边界都叫x=0。G与有定义但无解的F一样吗，能否把两边除零来处理？解是未知数值，还是把两边再相加得到的总值？',
    '① This card permits NONNEGATIVE RATIONAL quantities. For A/B/C/D/H give a justified inverse on BOTH sides, keep the exact solution and substitute into the ORIGINAL. Do not rely on transposition slogans or truncate fractions; an exactly equivalent allowed decimal is valid. Also try A’s approximate candidate and compare both original sides exactly. ② Classify E/F/H as ALL allowed values, NONE or UNIQUE ZERO, supplying example trials AND a general multiplication reason. They cannot all be called x=0. Is G the same as the defined but unsatisfiable F? Can dividing both sides by zero fix it? Is a solution the unknown value or a sum of the two sides?',
    `A:${factor}x=1，同除非零${factor}得x=1/${factor}，代回1；候选${approx}得${first ? '999/1000' : '501/500'}≠1。B:x−${sub}=${right}，两边加${sub}得x=${right + sub}；C:x÷${div}=${quotient}，两边乘非零${div}得x=${div * quotient}；D:x+${add}=1，同减${add}得x=${first ? '3/5=0.6' : '5/8=0.625'}，代回1。E:0x=0，所有允许非负有理数均满足，如0、1/2、2；F:0x=${contradiction}无解，左恒0；H:${uniqueFactor}x=0只有x=0，因${uniqueFactor}非零。G:x÷0=3无定义，不是一个有定义但无解的等式；不能除0。B代回${right + sub}−${sub}=${right}，C代回${div * quotient}÷${div}=${quotient}。解是x，不是左右值相加。`,
    `A:${factor}x=1: divide BOTH sides by nonzero ${factor}, giving x=1/${factor}, which substitutes to one. Candidate ${approx} gives ${first ? '999/1000' : '501/500'}≠1. B:x−${sub}=${right}: add ${sub} to both sides, x=${right + sub}. C:x÷${div}=${quotient}: multiply both sides by nonzero ${div}, x=${div * quotient}. D:x+${add}=1: subtract ${add} on both sides, x=${first ? '3/5=0.6' : '5/8=0.625'}, restoring one. E:0x=0 admits EVERY allowed nonnegative rational, including 0,1/2,2. F:0x=${contradiction} has NO solution because the left is always zero. H:${uniqueFactor}x=0 has UNIQUE x=0 since ${uniqueFactor} is nonzero. G:x÷0=3 is UNDEFINED, not a defined equation with no solutions; division by zero is invalid. Check B:${right + sub}−${sub}=${right} and C:${div * quotient}÷${div}=${quotient}. A solution is x, not a sum of side values.`,
    '区分非零系数下唯一解为零、零系数全满足/无解与除零未定义；每个候选都检查原式。',
    'Separate a zero root with nonzero coefficient, zero-coefficient all/none and undefined division; check each candidate in the original.',
  );
  table(
    q4,
    'A附待检近似值，其余行给原方程；允许非负有理数。',
    'A includes an approximate candidate to test; other rows give original equations on nonnegative rationals.',
    [
      ['编号', 'ID'],
      ['原方程', 'Original equation'],
      ['附加候选', 'Additional candidate'],
    ],
    [
      ['A', `${factor}x=1`, approx],
      ['B', `x−${sub}=${right}`, '—'],
      ['C', `x÷${div}=${quotient}`, '—'],
      ['D', `x+${add}=1`, '—'],
      ['E', '0x=0', '—'],
      ['F', `0x=${contradiction}`, '—'],
      ['G', 'x÷0=3', '—'],
      ['H', `${uniqueFactor}x=0`, '—'],
    ],
  );

  const received = first ? 6 : 8,
    current = first ? 23 : 27,
    metres = first ? 7 : 11,
    pieces = 4,
    spent = first ? '1.35' : '2.75',
    remaining = first ? '2.65' : '3.25',
    money = first ? 4 : 6,
    bags = first ? 4 : 5,
    loose = first ? 3 : 2,
    candidate = first ? 7 : 8,
    bagTotal = bags * candidate + loose,
    red = first ? '5/6' : '7/8',
    more = first ? '1/3' : '1/4',
    blue = first ? '7/6' : '9/8';
  const q5 = task(
    5,
    'equation-story',
    '① A收到后总量、B平均剪彩带、C花后剩余，各先定义x的对象与单位、画关系图，列原数量关系，求解后代回情境；再给反向等号或有依据的交换加数写法。不能把求出x后的答案式冒充题目要求的原建模式。② D只列与解释“袋内总数+散卡”的两步关系，不要求学习两步求解；给定试代值后检查它与把散卡放每袋的错误关系，两者重复了多少散卡？③ E把与B同数值的总量改成不可拆的完整卡片，要求均分成4个等量完整袋，有允许整数解吗？分数长度可用为何不保证卡数也可，能取整来修复吗？④ F蓝带比红带多给定米数，先定义蓝长，列两种有依据的关系并核结果；件数、米数、钱数单位不能互换。全部为假想纸笔活动，不采购或真实剪分物品。',
    '① A receives cards, B divides ribbon equally and C spends money leaving a remainder. DEFINE x’s object/unit, DRAW relationships, form the ORIGINAL quantity equation, solve and substitute into the story. Give a justified reversed equality or exchanged-addend form. A solved statement x=value is not the requested original model. ② For D only FORM AND EXPLAIN “bag contents + loose cards”; two-step solving is NOT required. Use the supplied candidate to check both the correct relationship and the wrong one placing extras INSIDE every bag. How many extras does it repeat? ③ E changes B’s numerical total into INDIVISIBLE cards shared into four equal whole-card bags. Is there an allowed integer solution? Why may fractional ribbon lengths be valid when fractional card counts are not? Can rounding repair the story? ④ F’s blue ribbon exceeds the red by a stated metre amount. Define blue length, form two justified equations and check the result. Keep item counts, metres and money distinct. All stories are fictional paper activities, without purchase or actual cutting/sharing.',
    `A设原有x张，x+${received}=${current}或${received}+x=${current}或${current}=x+${received}；x=${current - received}张，${current - received}+${received}=${current}。B设每段xm，${pieces}x=${metres}或${metres}=${pieces}x，x=${frac(metres, pieces)}m=${first ? '1.75' : '2.75'}m，四段恢复${metres}m。C设原有x纽元，x−${spent}=${remaining}或${remaining}=x−${spent}；x=${money}，代回${money}−${spent}=${remaining}。D设每袋x张，${bags}x+${loose}=${bagTotal}；给定x=${candidate}时${bags}×${candidate}+${loose}=${bagTotal}，错误${bags}(x+${loose})把散卡计${bags * loose}张而非${loose}张，多计${(bags - 1) * loose}张，得${bags * (candidate + loose)}≠${bagTotal}。E同样4x=${metres}代数解${frac(metres, 4)}，完整卡数须非负整数，故无情境允许解，不否定原代数解；向下取${Math.floor(metres / 4)}每袋合${Math.floor(metres / 4) * 4}、向上取${Math.ceil(metres / 4)}合${Math.ceil(metres / 4) * 4}，均非${metres}。F设蓝长xm，x−${more}=${red}或${red}+${more}=x，得${blue}m；代回恢复红长。量名、单位、定义域、原关系与结果核查缺一不可，多种有依据的原关系均可。`,
    `A defines original x cards: x+${received}=${current}, ${received}+x=${current} or ${current}=x+${received}; x=${current - received} cards and ${current - received}+${received}=${current}. B defines x metres per piece: ${pieces}x=${metres} or ${metres}=${pieces}x; x=${frac(metres, pieces)} m=${first ? '1.75' : '2.75'} m and four pieces restore ${metres} m. C defines original x NZD: x−${spent}=${remaining} or ${remaining}=x−${spent}; x=${money}, checked by ${money}−${spent}=${remaining}. D defines x cards per bag: ${bags}x+${loose}=${bagTotal}. At x=${candidate}, ${bags}×${candidate}+${loose}=${bagTotal}; wrong ${bags}(x+${loose}) counts ${bags * loose} extras instead of ${loose}, an excess of ${(bags - 1) * loose}, giving ${bags * (candidate + loose)}≠${bagTotal}. E has the SAME algebraic 4x=${metres}, solution ${frac(metres, 4)}, but whole-card counts must be nonnegative integers: no contextually allowed solution, without denying the algebraic root. Rounding down to ${Math.floor(metres / 4)} totals ${Math.floor(metres / 4) * 4}; rounding up to ${Math.ceil(metres / 4)} totals ${Math.ceil(metres / 4) * 4}, neither ${metres}. F defines blue length x m: x−${more}=${red} or ${red}+${more}=x, giving ${blue} m; substitution recovers red length. Check object, unit, domain, original model and result; accept other sound original relationships.`,
    '先定义x所指量与单位；代回必须回应原情境，包括完整物品的整数限制。',
    'Define x and its unit first; substitution must address the original story, including integer constraints on whole items.',
  );
  table(
    q5,
    '各故事独立。D给试代值只核建模，不要求两步求解；E与B总数相同而对象改变。',
    'Independent stories. D supplies a trial for modelling, without requiring two-step solving; E retains B’s total but changes the object.',
    roles,
    [
      ['A_R', t('收到/张', 'Received/cards'), String(received)],
      ['A_T', t('现在总数/张', 'Current total/cards'), String(current)],
      ['B_T', t('彩带总长/m', 'Ribbon total/m'), String(metres)],
      ['B_N', t('相等段数', 'Equal pieces'), String(pieces)],
      ['C_S', t('花去/NZ$', 'Spent/NZ$'), spent],
      ['C_R', t('剩余/NZ$', 'Remaining/NZ$'), remaining],
      ['D_N', t('相同袋数', 'Equal bag count'), String(bags)],
      ['D_L', t('袋外散卡/张', 'Loose cards OUTSIDE bags'), String(loose)],
      ['D_T', t('全部张数', 'Total cards'), String(bagTotal)],
      [
        'D_C',
        t('给定每袋试代张数', 'Supplied per-bag trial'),
        String(candidate),
      ],
      [
        'E_T',
        t('不可拆完整卡总数', 'Indivisible whole-card total'),
        String(metres),
      ],
      ['E_N', t('相等完整袋数', 'Equal whole-card bags'), '4'],
      ['F_R', t('红带长/m', 'Red ribbon/m'), red],
      ['F_M', t('蓝带比红带多/m', 'Blue exceeds red/m'), more],
    ],
  );
  return {
    id: `${unit}-MAINT-EQUATION-MEANING`,
    unit,
    title: t(
      '未知量、等值操作与构造依据',
      'Unknown quantities, equivalent actions and construction',
    ),
    bridge: 'P55-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5].map((n) => [id(n), `P55-L0${n}`]),
    ),
    intro: t(
      '五张过程卡分多次，一次只做一个编号小问或一行，不计时。先画图、定义量与单位、写自己的理由，再核全部小问才确认。读题协助与数学提示分开，可口述或用熟悉语言。原始记录均假想，不是家庭实测，无需采购、真实装袋或剪彩带。',
      'Split FIVE process cards across sittings, ONE numbered subpart or row at a time without a timer. Draw, define quantities/units and give your own reasons before confirming EVERY part. Separate reading help from maths hints; oral or familiar-language explanations are welcome. All records are fictional, not family observations; no purchase, actual bagging or ribbon cutting is required.',
    ),
    questions: [q1, q2, q3, q4, q5],
  };
};
export const equationMeaningRetrieval = {
  P57_EQUATION_MEANING: makeSet('P57'),
  P65_EQUATION_MEANING: makeSet('P65'),
};
