import { t, type Question } from '../model';
import { reasoning } from './builders';

const makeSet = (unit: 'J95' | 'J96') => {
  const near = unit === 'J95',
    id = (n: number) => `${unit}-MAINT-SYSTEM-MEANING-Q${n}`;
  const card = (
    n: number,
    skill: string,
    z: string,
    e: string,
    rz: string,
    re: string,
  ) =>
    reasoning(id(n), t(z, e), skill, t(rz, re), [
      t(
        '每个数对都按x再y同时代回两条原式；代入保整个括号，消元保留另一式，模型先保原数量和单位。',
        'Use the same x-then-y pair in both originals. Substitute entire bracketed expressions, retain another equation during elimination, and preserve quantity origins and units when modelling.',
      ),
      t(
        '一次一个编号或独立案例，可分次、不计时。允许口述或熟悉语言；读题协助与数学提示分开，先写自己的步骤、图和理由再逐项人审。',
        'One numbered part or separate case per untimed sitting. Oral or familiar-language responses are welcome. Separate reading assistance from mathematical hints, and generate your own steps, diagrams and reasons before human review.',
      ),
    ]);
  const table = (
    q: Question,
    rows: [string, string, string, string, string?][],
  ) => {
    q.contextTable = {
      caption: t(
        '原条件：编号案例独立。无情境的代数变量取实数；情境另给单位和允许范围，不改原式来迎合候选。',
        'Original conditions: labelled cases are independent. Uncontextualised variables are real; contexts specify their own units and domains. Do not change an original to accommodate a candidate.',
      ),
      columns: [
        t('编号', 'ID'),
        t('对象', 'Object'),
        t('原条件', 'Original conditions'),
      ],
      rows: rows.map(([k, z, e, v, ve]) => [t(k, k), t(z, e), t(v, ve ?? v)]),
    };
  };
  const source = near ? '2x+y=0; x−y=1' : 'x+2y=1; x−y=−1',
    P = near ? '(1,−2)' : '(1,0)',
    Q = near ? '(2,1)' : '(0,1)',
    exact = near ? '(1/3,−2/3)' : '(−1/3,2/3)',
    swapped = near ? '(−2/3,1/3)' : '(2/3,−1/3)',
    decimalCandidate = near ? '(0.33,−0.67)' : '(−0.33,0.67)';
  const q1 = card(
    1,
    'same-pair-and-exact-substitution',
    '① 对原S分别将P、Q代入两式，列每条左值/右值；再取P的x与Q的y拼成M、写完整数对并同样核两式。为什么两条各有一个合格候选不能拼成系统解？② 自己从第一式分别孤立y和x，走两条完整代入/回代路径，保所有括号和精确分数，求同一共同数对并逐式核。另交换该解的两个坐标，实际计算是否仍通过。③ C是给定小数候选，分别代两原式并算残差“左减右”，它与精确解能用等号相连吗？第二式若碰巧通过，能免第一式吗？另外自己给一个非整数的第一式解、且不满足第二式，代回说明；只列十个整数样本是否覆盖第一式所有实数解？',
    '① Check P and Q in BOTH original S equations, recording each left/right value. Form M from P’s x and Q’s y, write the FULL pair and check both again. Why cannot separately qualified candidates be spliced into a system solution? ② From equation one isolate y and x SEPARATELY. Follow two complete substitution/back-substitution paths with all brackets and exact fractions, find the SAME shared pair and verify both originals. Reverse that solution’s coordinates and actually check it. ③ For decimal candidate C calculate BOTH original residuals (left minus right). May it be joined to the exact solution by an equality sign? Does coincidental success in equation two waive equation one? Independently create a noninteger solution of equation one that FAILS equation two and check it. Do ten listed integer samples cover all real solutions of equation one?',
    `P代两式左值${near ? '0、3' : '1、1'}，仅首式通过；Q左值${near ? '5、1' : '2、−1'}，仅次式通过；M=(1,1)左值${near ? '3、0' : '3、0'}，都非原两右值。第一式的两种孤立${near ? 'y=−2x、x=−y/2；代第二式分别3x=1、−3y/2=1' : 'y=(1−x)/2、x=1−2y；代第二式分别x−(1−x)/2=−1即3x=−1，以及1−2y−y=−1即−3y=−2'}，得精确${exact}，回代两原式都过。交换${swapped}后左值${near ? '−1、−1' : '0、1'}，不通过，坐标不能换槽。C首式左值${near ? '−0.01而右0，残差−1/100' : '1.01而右1，残差1/100'}；次式左值${near ? 1 : '−1'}、残差0。C不是精确解，有限小数与循环分数不相等，一条吻合不免另一条。非整数首式解可取${near ? '(1/2,−1)，次式左3/2≠1' : '(1/2,1/4)，次式左1/4≠−1'}；任何其他正确非整数反例可用。首式实数解${near ? '(t,−2t)' : '(t,(1−t)/2)'}中t可任意实数，有限整数表只是样本；两式要求同一数对交集，不能拼候选或只报一个坐标。`,
    `P gives left values ${near ? 'zero and three' : 'one and one'}, passing only row one. Q gives ${near ? 'five and one' : 'two and negative one'}, passing only row two. M=(1,1) gives three and zero and fails both original constants. The two isolations are ${near ? 'y=−2x and x=−y/2; substitution into row two gives 3x=1 or −3y/2=1' : 'y=(1−x)/2 and x=1−2y; row two becomes x−(1−x)/2=−1, hence 3x=−1, or 1−2y−y=−1, hence −3y=−2'}. Both paths give exact ${exact}, verified in both originals. Reversal ${swapped} gives left values ${near ? '−1 and −1' : 'zero and one'}, failing the system. C’s first left value is ${near ? '−0.01 versus zero, residual −1/100' : '1.01 versus one, residual 1/100'}; its second is ${near ? 'one' : 'negative one'}, residual zero. It is not the exact solution: a finite decimal does not equal the recurring fraction, and one match cannot waive another constraint. A separate noninteger first-row solution can be ${near ? '(1/2,−1), whose second left value 3/2≠1' : '(1/2,1/4), whose second left value 1/4≠−1'}. Accept any other valid noninteger counterexample. The first row permits ${near ? '(t,−2t)' : '(t,(1−t)/2)'} for ALL real t, so a finite integer list is only a sample. The system requires the intersection using one entire ordered pair, not spliced candidates or one coordinate.`,
  );
  table(q1, [
    ['S', '原实数方程组', 'Original real system', source],
    ['P', '首式候选', 'First-row candidate', P],
    ['Q', '次式候选', 'Second-row candidate', Q],
    ['C', '独立小数候选', 'Separate decimal candidate', decimalCandidate],
  ]);

  const elimination = near ? '3x+2y=1; 2x−3y=−8' : '2x+3y=−1; 3x−2y=−8',
    k1 = near ? 3 : 2,
    k2 = near ? 2 : 3,
    x = near ? -1 : -2,
    y = near ? 2 : 1,
    scaled1 = near ? '9x+6y=3' : '4x+6y=−2',
    scaled2 = near ? '4x−6y=−16' : '9x−6y=−24',
    combined = near ? '13x=−13' : '13x=−26',
    alternative = near ? '5x−y=−7' : '5x+y=−9';
  const q2 = card(
    2,
    'complete-scaling-and-retained-row',
    '① 按K给两条原式的所有项和右侧都倍乘，分别写两个完整新行，再相加得M。只用M替换原第一式、保留原第二式，解出两量并逐原式核。指出每个x/y系数、负号与右常数来自哪一行哪一倍，不能只改想消掉的项。② 仅保M是否同解？自己给一个过M但不过原组的额外数对并核，解释留下另一式的作用。对合法新组写出恢复原第一式的一般逆步骤，说明被替换行自身倍数为什么须非零。③ 另从原组独立取k1=k2=1，写替换后两式。这次是否保解、是否已消去y？用具体剩余y系数区分“等价但策略未完成”和“关系错误”，不能只因没消y就拒绝该等价变形。',
    '① Apply K to EVERY term and right-side constant in each original row. Write BOTH scaled rows before adding to M. Replace ONLY original row one with M and RETAIN row two, solve both quantities and verify both originals. Trace every coefficient, sign and right constant to its row/multiplier rather than scaling only the selected cancellation term. ② Is retaining ONLY M equivalent? Construct and check an extra pair passing M but failing the original system. Explain the retained row’s role. Write the GENERAL inverse steps recovering original row one from the valid new system and explain why its own multiplier must be nonzero. ③ Independently restart from the originals with k1=k2=1 and write both replacement-system rows. Are solutions preserved, and has y been eliminated? Use the remaining y coefficient to distinguish an equivalent unfinished strategy from a false relationship; failure to cancel y alone does not invalidate equivalence.',
    `两倍乘行${scaled1}、${scaled2}，相加M:${combined}。保原第二式得(${x},${y})，代原左值${near ? '1、−8' : '−1、−8'}全过。只留M会准许任意y，例(${x},0)仍过M却原左值${near ? '−3、−2' : '−4、−6'}均非原两常数，丢了约束。若M=k1R1+k2R2并保R2，先M−k2R2，再两边同除非零k1得R1；本题k1=${k1}、k2=${k2}，右常数也须同操作，不用除变量。独立1/1组合为${alternative}并保原R2，仍可减R2恢复R1，故同解；y系数${near ? '−1' : 1}非0，尚未消y但关系正确。一个字母消失不是抛弃另一条原关系，求得一量后仍回代另一量。`,
    `The scaled rows are ${scaled1} and ${scaled2}, giving M: ${combined}. Retain original row two to obtain (${x},${y}); original left values ${near ? 'one and negative eight' : 'negative one and negative eight'} both pass. M alone permits ANY y: (${x},0) passes it but original left values ${near ? '−3 and −2' : '−4 and −6'} fail the original constants. For M=k1R1+k2R2 with R2 retained, subtract k2R2 and divide BOTH sides by nonzero k1 to recover R1. Here k1=${k1},k2=${k2}; constants undergo the same operations, with no variable division. Independent 1/1 gives ${alternative} with original R2 retained. Subtract R2 to recover R1, so it preserves solutions; its y coefficient ${near ? '−1' : 'one'} is nonzero, so the elimination strategy remains unfinished. Losing a letter from one row does not discard the other original relationship; back-substitute for the second quantity.`,
  );
  table(q2, [
    ['E', '原实数方程组', 'Original real system', elimination],
    [
      'K',
      '计划行倍数',
      'Planned row multipliers',
      `k1=${k1}; k2=${k2}; M=k1R1+k2R2；保留R2`,
      `k1=${k1}; k2=${k2}; M=k1R1+k2R2; retain R2`,
    ],
    [
      'U',
      '独立未消元倍数',
      'Separate noncancelling multipliers',
      'k1=1; k2=1; M=R1+R2；保留R2',
      'k1=1; k2=1; M=R1+R2; retain R2',
    ],
  ]);

  const lowB = near ? 2 : 3;
  const q3 = card(
    3,
    'original-models-and-independent-context',
    '① 亲自选表内允许的b、X、Y，为虚构社区两种票编一个完整情境：两单价为a=b+2与b，原数量为X、Y。先定义变量x/y、单位和域，算总数N与总价M，写两条原数量关系；再用代入与保留一式的加减各求一次，同一数对逐原式核。将每条原关系分别同乘−2或1/2给等价原模型；与只写x=X、y=Y比较：同解集就展示了原数量来源吗？② 从原情境只把总价改M+1，数量N不变，求精确代数对；分别判整张票与连续升数的允许性。用仍凑N的两整数对(X,Y)、(X+1,Y−1)核金额，取整能修复吗？不改原价格。③ 画原两条实数直线、标两轴刻度并将允许票数另作非负整数格点；交点在[−5,5]²能否看见，拓到[−10,10]²会改原数对吗？④ 另独立让两类单价都为b、总价bN，亲写原模型，说明重合时全部实数解、非负连续解与整张票允许数对各是什么集合；能把0=0当作全平面或除零吗？一次一案例，全部虚构，纸笔即可。',
    '① CHOOSE permitted b,X,Y and DESIGN a complete fictional two-ticket context. Prices are a=b+2 and b, with original quantities X,Y. Define unknowns x/y, units and domains; calculate total N/cost M and WRITE both original quantity equations. Solve by substitution and by elimination retaining one row; check the SAME pair in both originals. Independently scale each original relationship by −2 or 1/2 to give equivalent original models. Compare submitting only x=X,y=Y: does an equal solution set show the original quantity origins? ② Restart from the original context, changing ONLY total cost to M+1, retaining N. Find the exact algebraic pair and audit whole tickets versus continuous litres. Check cost for integer pairs (X,Y),(X+1,Y−1), both still totalling N. Can rounding repair the conditions? Do not alter prices. ③ DRAW both original REAL lines with labelled axis scales and separately mark allowed nonnegative integer ticket points. Is the intersection visible in [−5,5]²? Does widening to [−10,10]² change the pair? ④ Independently make BOTH prices b and total cost bN. Write the original model and describe its coincident-line real solutions, nonnegative continuous solutions and whole-ticket pairs SEPARATELY. May 0=0 mean the whole plane or justify division by zero? One case per sitting; all data are fictional and paper is sufficient.',
    `接受任何给定范围内自主b/X/Y及完整数量来源。a=b+2，N=X+Y、M=(b+2)X+bY；原模型x+y=N、(b+2)x+by=M。代入y=N−x得2x=M−bN=2X，回代y=Y；消元金额行减b倍总量行亦同，保总量回代，精确(X,Y)两式过且非负整数。逐原式非零倍乘或换序保模型，例如−2x−2y=−2N、((b+2)/2)x+(b/2)y=M/2；只交最后x=X、y=Y虽同唯一解集，不展示两条原数量关系。本次要求保原模型，不能以同解集代该要求。新价M+1给x=X+1/2、y=Y−1/2，均非负但非整数：票数无允许解、连续L允许，原系统仍代数唯一。两整数对金额为M与M+2，不是M+1，取整不修复。原实数线交(X,Y)，X6…8使小窗外，扩大后可见，显示不改解；票数只取非负整数格点。相同单价独立模型x+y=N、bx+by=bN，两式同线，全实解(t,N−t)且t任意实数；连续非负再限0≤t≤N为线段，整票t=0,1,…,N共N+1对，不是全平面。0=0不新增约束但原总量仍在，不能除0。示例b3/X6/Y2得N8/M36、原(6,2)、新价37给(13/2,3/2)，整数(6,2)/(7,1)分别36/38；同价3时全实线x+y=8、连续线段、整票九对。可用任何合条件自主方案，不要求照示例。`,
    `Accept ANY permitted b/X/Y design with explicit quantity origins. Set a=b+2,N=X+Y,M=(b+2)X+bY. Original equations: x+y=N,(b+2)x+by=M. Substituting y=N−x gives 2x=M−bN=2X, then y=Y; subtracting b times the count row from cost gives the same, with count retained. Exact (X,Y) passes both and the nonnegative integer domain. Separate nonzero rescaling/reordering preserves the original model, for example −2x−2y=−2N and ((b+2)/2)x+(b/2)y=M/2. Final x=X,y=Y has the same unique solution set but omits both quantity relationships; THIS task explicitly asks to retain them. New cost M+1 gives x=X+1/2,y=Y−1/2, nonnegative but noninteger: whole tickets fail while continuous litres pass, despite the same unique algebraic solution. The two integer pairs cost M and M+2, not M+1, so rounding does not repair it. The original lines intersect at (X,Y); X=6…8 is outside the small window and visible in the wider one, without changing the solution. Ticket possibilities are nonnegative integer grid points. Equal-price model x+y=N,bx+by=bN has coincident lines with real solutions (t,N−t), ALL real t. Nonnegative continuous amounts restrict 0≤t≤N to a segment; tickets restrict t=0,1,…,N to N+1 pairs, not the plane. Identity 0=0 adds no condition but retains the original total and permits no division by zero. Example b=3,X=6,Y=2 gives N=8,M=36, original (6,2), new cost 37 giving (13/2,3/2); integer (6,2)/(7,1) cost 36/38. Equal price three leaves line x+y=8, its nonnegative segment and nine whole-ticket pairs. Other valid independent designs count; copying the example is unnecessary.`,
  );
  table(q3, [
    [
      'D',
      '自主参数条件',
      'Design constraints',
      `b∈{${lowB},${lowB + 1}}; a=b+2; X∈{6,7,8}; Y∈{1,2,3}；x,y为非负整数张数；单价NZ$/张`,
      `b∈{${lowB},${lowB + 1}}; a=b+2; X∈{6,7,8}; Y∈{1,2,3}; x,y nonnegative integer tickets; prices NZD/ticket`,
    ],
    ['W', '独立显示窗口', 'Separate display windows', '[−5,5]² → [−10,10]²'],
    [
      'L',
      '独立连续量解释',
      'Separate continuous-quantity interpretation',
      '同数字单价NZ$/L；x,y为非负实数升数；x+y=N',
      'Same numerical prices NZD/L; x,y nonnegative real litres; x+y=N',
    ],
  ]);
  return {
    id: `${unit}-MAINT-SYSTEM-MEANING`,
    unit,
    title: t(
      '同一数对、保留行与自主模型',
      'The same pair, retained rows and independent models',
    ),
    intro: t(
      '三张纸笔卡，一次一个编号或案例，可分次、不计时。第1卡共享共同数对/代入；先从原条件生成精确步骤、图和理由，再逐项人审。允许口述/熟悉语言，阅读帮助与数学提示分开。情境与价格全部虚构，不需实测或购买。',
      'Three paper cards, one numbered part or case per untimed sitting. Card one shares simultaneous pairs/substitution. Generate exact steps, drawings and reasons from the original conditions before human review. Oral/familiar-language responses are welcome; separate reading assistance from mathematical hints. All contexts/prices are fictional and need no measurement or purchase.',
    ),
    bridge: 'J83-L02',
    bridgeByQuestion: Object.fromEntries(
      [2, 3, 5].map((l, i) => [id(i + 1), `J83-L0${l}`]),
    ),
    questions: [q1, q2, q3],
  };
};
export const systemMeaningRetrieval = {
  J95_SYSTEM_MEANING: makeSet('J95'),
  J96_SYSTEM_MEANING: makeSet('J96'),
};
