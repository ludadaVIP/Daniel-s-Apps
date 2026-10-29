import { t, type Question } from '../model';
import { reasoning } from './builders';

const makeSet = (unit: 'H25' | 'H26') => {
  const near = unit === 'H25',
    id = (n: number) => `${unit}-MAINT-LOGIC-MEANING-Q${n}`;
  const card = (
    n: number,
    skill: string,
    z: string,
    en: string,
    rz: string,
    re: string,
  ) =>
    reasoning(id(n), t(z, en), skill, t(rz, re), [
      t(
        '先确定对象、全集/定义域及当前条件；列举要同时排除多余和遗漏，蕴含要各查一个方向。一个符合例与覆盖全部的理由作用不同。',
        'Identify objects, universe/domain and current premises first. A listing must exclude extras AND omissions; audit each implication separately. A confirming example differs from an exhaustive argument.',
      ),
      t(
        '一次一个编号/独立案例，可分次不计时，允许纸笔、口述或熟悉语言。读题帮助与数学提示分开；自主规则接受不同正确结果，理由全部人审。均为虚构纸上资料，不代填家庭记录。',
        'One numbered part/separate case per untimed sitting. Paper, oral work or a familiar language is welcome. Separate reading assistance from maths hints; accept different valid own rules after human review. All data are fictional paper givens, not household records.',
      ),
    ]);
  type Row = [string, string, string, string, string];
  const table = (q: Question, rows: Row[]) => {
    q.contextTable = {
      caption: t(
        '各行是明确给定的独立案例；不是学习者真实记录',
        'Rows are separate stipulated cases, not learner observations',
      ),
      columns: [
        t('编号', 'ID'),
        t('案例', 'Case'),
        t('原条件', 'Original conditions'),
      ],
      rows: rows.map(([k, z, en, v, ve]) => [t(k, k), t(z, en), t(v, ve)]),
    };
  };
  const limit = near ? 9 : 11,
    last = near ? 8 : 10,
    evens = Array.from({ length: last / 2 }, (_, i) => 2 * (i + 1)).join(','),
    raw = near ? '0,1/2,0.5,2/4,1' : '0,3/4,0.75,6/8,1',
    value = near ? '1/2' : '3/4';
  const q1 = card(
    1,
    'set-elements-boundaries',
    '① R先逐限定写完整集合，再分别审“删掉最后一个正偶数”和“加进0”两份答案：无错误成员就一定完整吗？只把“正”改“非负”重列。② D把各写法按数值去重、重排并报元素数；等值分数与小数是否新元素？另辨数0、∅、{0}，各自对象/元素数（数0不问集合基数），判断0∈∅、0∈{0}、∅⊆{0}、{0}⊆{0}，并解释空集/自身的包含。保留原有四ID清单频数论证。③ N明确另定义集合的集C，判{0}∈C与0∈C；为何数字工作台不接嵌套集合不能推出数学禁止集合作元素？④ 自创一个有限整数卡片规则，给域、精确上下界及可判定条件，亲列全体、逐个核正确及无遗漏。未给标准的“好看的数字”与明确规则但自己还没算完有何不同？不要求照抄作者规则。',
    '① For R, use EVERY restriction to list the whole set. Audit two proposed answers: omitting the LAST positive even number, and adding zero. Does having no invalid member guarantee completeness? Change ONLY positive to nonnegative and relist. ② For D, deduplicate by VALUE, reorder and count: do equal fractions/decimals create new elements? Distinguish number zero, ∅ and {0}, giving objects and set sizes (do not assign set cardinality to the number zero). Decide 0∈∅,0∈{0},∅⊆{0},{0}⊆{0}, explaining empty/self containment. Retain the existing four-ID frequency argument. ③ N separately defines a SET OF SETS C. Decide {0}∈C and 0∈C. Why does a numerical workbench rejecting nested sets not prohibit set-valued elements in mathematics? ④ INVENT a finite integer-card rule with a domain, exact bounds and decidable condition. List ALL members and audit validity AND omissions. Contrast an unstated criterion “beautiful numbers” with a definite rule whose calculation you have not finished. Different valid own rules are welcome.',
    `R正偶数为{${evens}}，删${last}不完整，加0不合正数；改非负后为{0,${evens}}。D={0,${value},1}，3个元素，各分数/小数同值，重排不变；原五项写法不是五个不同数。0为数，∅含0个元素，{0}含1个。四关系依次假、真、真、真；空集无违例元素，集合自身每元素当然属于自身。C={{0},∅}明确有两个集合元素，{0}∈C真、0∈C假，数字UI范围不是一般数学禁令。自主一例：整数1≤n≤${limit}且3整除n，得{3,6,9}；逐一符合并按该有限域穷尽。其他明确且完整的规则同样接受，不用作者数值作唯一答案。“好看”未给判据，计算未完成却不使已有明确判据消失。`,
    `R gives {${evens}}. Omitting ${last} is incomplete; adding zero violates positivity. Changing to nonnegative gives {0,${evens}}. D={0,${value},1}, three elements: the fractions/decimal denote one value, and reordering changes nothing. Five written entries are not five distinct numbers. Zero is a number; ∅ has zero elements and {0} has one. The four relations are false,true,true,true. Empty has no violating member; every member of a set is in itself. C={{0},∅} explicitly has TWO set-valued elements, so {0}∈C but 0∉C. Numerical UI restrictions are not a mathematical prohibition. An own example is integers 1≤n≤${limit} divisible by three, giving {3,6,9}; audit members and exhaust the finite domain. Accept other definite, complete rules, not only author values. Unspecified beauty lacks a criterion; unfinished calculation does not remove a definite criterion.`,
  );
  table(q1, [
    [
      'R',
      '规则及边界',
      'Rule and boundaries',
      `小于${limit}的正偶整数`,
      `Positive even integers below ${limit}`,
    ],
    ['D', '数值清单', 'Numerical list', raw, raw],
    [
      'N',
      '独立的嵌套对象',
      'Separate nested objects',
      'C={{0},∅}，不改D',
      'C={{0},∅}; D unchanged',
    ],
  ]);

  const u = near ? [1, 2, 3, 4, 5, 6, 7, 8] : [0, 1, 2, 3, 4, 5, 6, 7],
    a = near ? [1, 2, 6, 7] : [0, 2, 5, 7],
    b = near ? [2, 3, 6, 8] : [1, 2, 5, 6],
    onlyA = a.filter((x) => !b.includes(x)),
    onlyB = b.filter((x) => !a.includes(x)),
    both = a.filter((x) => b.includes(x)),
    outside = u.filter((x) => !a.includes(x) && !b.includes(x)),
    comp = u.filter((x) => !a.includes(x)),
    max = near ? 6 : 5,
    aa = a.filter((x) => x <= max),
    bb = b.filter((x) => x <= max),
    cc = u.filter((x) => x <= max && !aa.includes(x));
  const q2 = card(
    2,
    'set-boolean-operations',
    '① M用每个编号的A/B身份亲画四区，逐区列完整成员，解释四区为何互斥且覆盖U；把圆画大能改变成员数吗？由图生成A∖B、B∖A、U中A的补集，分别说从哪个集合出发，给一个实际反向差集不同的见证。交叠是“或”也保留的成员，不是必须删掉的重复。② S仅缩小U，同时更新A、B和补集；可把域外成员留在A却仍称A⊆U吗？与原有仅扩大U的任务比较。③ E/D/Z各从自己的条件重启，给交、并、两个方向差集和A的补集。空结果为何是∅而非{0}，相等集合的交并是否必须不同？④ 给纸上U的每个编号自定“戴帽/拿书”两标签，再画四区、列双向差集与补集，解释一个身份改变如何移动该编号；全部虚构，无需采集他人资料。',
    '① For M, DRAW four regions from each ID’s A/B membership and list ALL members. Explain why the regions are disjoint and exhaust U. Does a larger drawn circle change cardinality? Generate A∖B,B∖A and the complement of A in U, naming each starting collection and giving an actual witness that reversing difference matters. Retain overlap in inclusive OR. ② S shrinks ONLY U: update A,B and the complement together. May an out-of-domain member remain in A while claiming A⊆U? Compare the existing task that expands U only. ③ Restart E/D/Z from THEIR OWN conditions. Give intersection, union, BOTH directed differences and A’s complement. Why is an empty result ∅ rather than {0}? Must intersection and union of equal sets differ? ④ Assign fictional hat/book labels to each paper ID in U. Draw four regions and list directed differences/complement; explain how changing one identity moves its ID. No personal-data collection is needed.',
    `M仅A={${onlyA}}、交叠={${both}}、仅B={${onlyB}}、两者外={${outside}}；每编号恰一个真假组合，四区不叠不漏，图面积不编码基数。A∖B={${onlyA}}，B∖A={${onlyB}}，Aᶜ={${comp}}；差从左集合，补从U。例如${onlyA[0]}仅在正向差。并集保交叠一次。S得A={${aa}}、B={${bb}}、Aᶜ={${cc}}，编号${near ? '7和8' : '6和7'}不再在U，要从A/B一并移除；这是保持子集，不把它们算为新补元素。E交/并均{${u[0]},${u[1]}}、两差∅、补U去这两数。D交∅、并{${u[0]},${u[2]}}、A∖B={${u[0]}}、B∖A={${u[2]}}、补U去${u[0]}。Z交∅、并{${u[1]}}、正差∅、反差{${u[1]}}、A补U。∅是无成员，{0}有成员0，即使0不在某个U也不能拿它代空集。自主标签可不同，须每编号恰进入四区之一，差/补与所定身份一致；例如沿M的A作戴帽、B作拿书，去掉${both[0]}的帽子使其从交叠到仅B，不改变U或B。`,
    `M A-only={${onlyA}},overlap={${both}},B-only={${onlyB}},neither={${outside}}. Each ID has exactly one of four truth combinations, proving disjoint exhaustion; circle area does not encode cardinality. A∖B={${onlyA}},B∖A={${onlyB}},A-complement={${comp}}. Difference starts from its LEFT set; complement from U. For instance ${onlyA[0]} belongs only to the forward difference. Inclusive union retains overlap once. S gives A={${aa}},B={${bb}},A-complement={${cc}}. Removed IDs ${near ? '7 and 8' : '6 and 7'} leave A/B as well, preserving subset containment rather than entering the new complement. E has intersection=union={${u[0]},${u[1]}},both differences empty,and complement U excluding those two. D has empty intersection,union={${u[0]},${u[2]}},forward difference={${u[0]}},reverse={${u[2]}},complement U excluding ${u[0]}. Z has empty intersection,union={${u[1]}},empty forward difference,reverse={${u[1]}},and complement U. Empty has no members; {0} has member zero, even if zero lies outside a particular U. Accept different own labels if every ID appears in exactly one region and results match. An example uses M’s A as hats and B as books: removing ${both[0]}'s hat moves it from overlap to B-only without changing U or B.`,
  );
  table(q2, [
    [
      'M',
      '原编号模型',
      'Original ID model',
      `U={${u}};A={${a}};B={${b}}`,
      `U={${u}};A={${a}};B={${b}}`,
    ],
    [
      'S',
      '从M仅缩全集',
      'From M: shrink universe only',
      `U改为原U中≤${max}的成员`,
      `New U keeps original members ≤${max}`,
    ],
    [
      'E',
      '独立相等',
      'Separate equal sets',
      `U同M;A=B={${u[0]},${u[1]}}`,
      `U as M;A=B={${u[0]},${u[1]}}`,
    ],
    [
      'D',
      '独立不交',
      'Separate disjoint sets',
      `U同M;A={${u[0]}};B={${u[2]}}`,
      `U as M;A={${u[0]}};B={${u[2]}}`,
    ],
    [
      'Z',
      '独立空集',
      'Separate empty set',
      `U同M;A=∅;B={${u[1]}}`,
      `U as M;A=∅;B={${u[1]}}`,
    ],
  ]);

  const target = near ? 3 : 5,
    good = target - 1,
    shift = near ? 0 : 2,
    half = near ? '1/2' : '5/2',
    negative = near ? '-1' : '1';
  const q3 = card(
    3,
    'logic-domain-counterexample',
    '① K是纸上已固定但未揭晓的整数，给“K为偶数”“请打开纸卡”、自由x的式子O分类：确定真假与现在知道真假有何不同？不需猜K。给O指定x为G、再为G+1，分别判断真假；另加“存在实数x”或“所有实数x”量词，分别判且给见证/反例。为何原开语句不能直接标“假命题”？② V对同一平方命题，分别在整数域/实数域审每个候选：先合域，再是否违反结论。为域内但满足结论的候选精算两边；“输入接受”就等于反例有效吗？整数域外失败值不能推翻整数命题。原有一般整数证明/量词否定任务继续使用。③ 工作台有理候选输入是否把实数域改成有理数域？一个有理反例能反驳实数全称吗？若某次输入被工具拒绝，能推出该数不属于数学命题域吗？说明输入语法/计算能力与声明范围不同，不要求用工具输入无理数。',
    '① K is a FIXED but unrevealed paper integer. Classify “K is even”, “Please open the card” and free-x sentence O. Distinguish definite truth from knowing it now; do not guess K. Assign O first x=G, then G+1, and decide each. Quantify O with “there exists a real x” and “every real x”, supplying a witness/counterexample. Why is the unassigned open sentence not simply a false statement? ② For V, audit EACH proposed counterexample over integers and then reals: first admissibility, then violation. Calculate both sides for an admissible CONFIRMING candidate. Does accepted input mean valid counterexample? A failing value outside the integer domain cannot refute that integer claim. Retain the existing general integer proof and quantifier-negation task. ③ Does rational-only candidate input redefine the real domain as rational? Can one rational counterexample refute a real universal? If a tool rejects an input, does that establish exclusion from the statement’s mathematical domain? Distinguish syntax/computation limits from the declared domain, without requiring irrational input into the tool.',
    `“K为偶数”有确定真假但题设不足知哪种，仍是命题；请求非命题；O未指定/量化是开语句。x=${good}给${target}=${target}真，x=${target}给${target + 1}=${target}假。存在实数版本真（见证${good}），所有实数版本假（反例${target}）。V令m=x−${shift}：候选x=${half}给m=1/2、平方1/4<1/2，仅对实数命题有效，对整数域外；候选x=${negative}给m=−1、平方1≥−1，整数/实数域内但不违反；x=${shift}给m=0，两边0相等也非反例。合域和失败必须同时满足，一次成功不证明全部。工具精确接受有理候选只限制测试入口，声明域仍ℝ；有理数包含在实数中，域内一个失败就够。无理实数可能被该语法拒绝但仍属实数域，不能以拒收判数学不合法。`,
    `“K is even” has a definite truth value although the givens do not reveal which; it IS a statement. The request is not. Unassigned/unquantified O is open. At x=${good},${target}=${target} is true; at x=${target},${target + 1}=${target} is false. The real existential is true, witnessed by ${good}; the universal is false, refuted by ${target}. For V set m=x−${shift}. At x=${half},m=1/2 and square1/4<1/2: admissible failure over reals but OUTSIDE integers. At x=${negative},m=−1 and square1≥−1: admissible over both, but confirming rather than refuting. At x=${shift},both sides are zero, again no violation. Admissibility AND failure are required; one confirmation proves no universal. Rational-only exact input limits the test interface, not the declared ℝ. Rationals are reals, so one rational failure suffices. An irrational real can be syntactically rejected yet remain in the real domain; rejection alone does not establish mathematical inadmissibility.`,
  );
  table(q3, [
    [
      'K',
      '已固定未揭晓',
      'Fixed but unrevealed',
      'K为整数，题设不透露奇偶',
      'K is an integer; parity is not disclosed',
    ],
    [
      'O',
      '自由变量语句',
      'Free-variable sentence',
      `x+1=${target};G=${good}`,
      `x+1=${target};G=${good}`,
    ],
    [
      'V',
      '各候选分别核',
      'Audit candidates separately',
      `${near ? 'x²≥x' : '(x−2)²≥x−2'};x=${half},${negative},${shift}`,
      `${near ? 'x²≥x' : '(x−2)²≥x−2'};x=${half},${negative},${shift}`,
    ],
  ]);

  const f = near ? '1/2' : '-1/2',
    g = near ? '3/2' : '1/2',
    h = near ? '5/2' : '3/2',
    out = near ? '7/2' : '5/2';
  const q4 = card(
    4,
    'logic-two-directions',
    '① E/O/V的条件都在全体实数讨论，各行已给完整定义而非几个采样。先分别生成P、Q完整真值集合，再判P⇒Q、Q⇒P、P是Q的哪类条件；每个失败箭头给一域内真假行，成立则用全部真值集合包含说明。交叠有共同真例就够充要吗？② 对O代入两个条件都假的额外值W，逐箭头判断这一行：它能反驳哪个箭头？解释剩余实数为何已覆盖，不能以有限试值代完整域证明。③ 把每行P/Q互换，重新判“新的P对新的Q”；哪些类别不变、哪些交换？V的正向真是否证明P有可实现解，或表示P导致Q？保留原有正根/负根及逆否、限域重审任务。',
    '① E/O/V all use the REAL domain. Each row is a COMPLETE definition, not samples. Generate full P/Q truth sets, audit P⇒Q and Q⇒P, then classify P FOR Q. Supply an admissible truth-pattern witness for each failing arrow; justify a true arrow by full-set containment. Is one overlapping true case enough for equivalence? ② In O substitute W, where BOTH conditions are false. Audit each implication at this row: which does it refute? Explain why all remaining reals are covered, rather than replacing whole-domain proof by finitely many trials. ③ EXCHANGE P/Q in each row and reclassify the NEW P for NEW Q. Which categories remain and which exchange? Does V’s true forward implication prove an attainable P or a causal mechanism? Retain the existing positive/negative-root, contraposition and changed-domain task.',
    `E两真值集合均{${f},${g}}，双向真、充要，互换仍充要。O为{${f},${g}}与{${g},${h}}，${f}使P真Q假反驳正向，${h}使P假Q真反驳反向；${g}两真只证交叠，类别两者皆非，互换仍两者皆非。W=${out}不在两集，两条件都假，两箭头在该行都真，不能反驳任一箭头；其余未列实数亦两假，由完整成员定义穷尽，不是假装采样覆盖实域。V的P:x²=−1真值集∅（实数平方≥0），Q真值集{${f}}；空集包含于Q，无P真Q假，正向真，x=${f}反驳反向，充分不必要。互换为必要不充分；真蕴含不声称原P有实根、可实现或有因果。原有正负根任务提供非空真值集的单向/限域充要证据。`,
    `E has equal truth sets {${f},${g}}, so both arrows hold: both, unchanged after exchange. O has {${f},${g}} versus {${g},${h}}. Value ${f} makes P true/Q false, refuting forward; ${h} makes P false/Q true, refuting reverse. Shared ${g} establishes overlap only: neither, unchanged by exchange. W=${out} lies outside both, making both conditions false and both implications true at that row, refuting neither. Every unlisted real also makes both false by the COMPLETE definitions; this exhausts the domain rather than relying on samples. V’s P:x²=−1 has empty truth set since real squares are nonnegative. Q has {${f}}. Empty is contained in Q, so forward holds with no P-true/Q-false counterexample; ${f} refutes reverse. Thus sufficient-only, changing to necessary-only on exchange. A true implication establishes neither a real root of original P, feasibility nor causation. The existing root task supplies nonempty proper containment and the restricted-domain equivalence audit.`,
  );
  table(q4, [
    [
      'E',
      '同一完整集合',
      'Same full set',
      `P:|x−(${near ? '1' : '0'})|=1/2;Q:x∈{${f},${g}}`,
      `P:|x−(${near ? '1' : '0'})|=1/2;Q:x∈{${f},${g}}`,
    ],
    [
      'O',
      '交叠不包含',
      'Overlap without containment',
      `P:x∈{${f},${g}};Q:x∈{${g},${h}};W=${out}`,
      `P:x∈{${f},${g}};Q:x∈{${g},${h}};W=${out}`,
    ],
    ['V', '空前提', 'Empty premise', `P:x²=−1;Q:x=${f}`, `P:x²=−1;Q:x=${f}`],
  ]);

  const coeff = near ? '3/2' : '2/3',
    intercept = near ? '3/4' : '-1/3',
    radius = near ? '9/4' : '5/3',
    centre = near ? '-1/2' : '1/2',
    nCentre = near ? '1/2' : '-1/2',
    upper = near ? 1 : 3,
    nlo = near ? -1 : -3,
    nhi = 2,
    babs = near ? '3/4' : '1/3';
  const q5 = card(
    5,
    'absolute-complete-real-set',
    '① A先由−c≤ax+b≤c解完整≤集合，另解≥集合，给中心/两边界、含端点数轴和边界/中心/两侧代回。B只把a反号，分别重算≤/≥并写负数除法时两处反向及按大小重排，不能假定保同中心。纸上分数系数不受源整数滑块限制；改视窗不会把射线截断为有限区间，无穷远能作含等端点吗？② Z先化常数比较，依次给<、≤、>、≥四解集；再只把c改成|b|重判。Z0也是独立常数，四比较各怎样？为什么不能把a=0硬套“排除一个零点”，或除a？原有非零系数c=0/负c全部分支任务继续保留。③ T是虚构纸上非负读数的同一A校准条件：由完整实域结果分别取交x≥0，报≤/≥两集合；说明为何这次真有附加域，而改画窗没有。④ J/K只比较给定并集是否等于ℝ，精确查z点能否桥接；两射线都有开端点就能忽略一个缺点吗？用一实际成员/非成员解释，不把有限代回当完整证明。',
    '① For A, derive the complete ≤ set from −c≤ax+b≤c and separately solve ≥. Give centre, boundaries, number lines and substitutions at boundaries/centre/both outer sides. B changes ONLY the SIGN of a. Recalculate ≤/≥, explicitly reverse BOTH comparisons on division by a negative number and reorder bounds; do not assume the centre stays fixed. Paper fractions are not restricted by the source integer sliders. Does changing the display window truncate rays? May infinity be included as an endpoint? ② Reduce Z to a CONSTANT comparison. Give <,≤,>,≥ sets, then change ONLY c to |b| and repeat. Audit independent constant Z0 too. Why may a=0 neither use a one-excluded-root shortcut nor divide by a? Retain the existing task for ALL nonzero-coefficient zero/negative-threshold branches. ③ T adds a fictional nonnegative-reading domain to A’s calibration condition: intersect the full real sets with x≥0 for ≤/≥. Why is this a real domain premise whereas changing the window is not? ④ For J/K, decide whether the given union equals ℝ by checking the shared z point. Can a missing point be ignored because both rays approach it? Use membership and exhaustive inequalities, not finite substitutions as a completeness proof.',
    `A中心${centre}，半径c/|a|=${near ? '3/2' : '5/2'}，≤为[−2,${upper}]，≥为(−∞,−2]∪[${upper},∞)，两边界代回的绝对值均为c，中心代回的绝对值为0；左于−2或右于${upper}取≥，内侧取≤。B中心${nCentre}，≤为[${nlo},${nhi}]、≥为(−∞,${nlo}]∪[${nhi},∞)，除负a双向反转后重排，不能照抄A。a≠0时中心为−b/a、c≥0时半径为c/|a|；本题正半径内外翻译使用c>0，零阈值仍须单独核严格/非严格。无穷远不是可含的数，视窗不限制解域。Z恒|b|=${babs}<c=${radius}，四种依次ℝ、ℝ、∅、∅；c改|b|后依次∅、ℝ、∅、ℝ。Z0恒为0，c=0时也依次∅、ℝ、∅、ℝ，尤其>0无解而非去一个点，不能除0。T的≤为[0,${upper}]、≥为[${upper},∞)，左射线被非负域排除，边界${upper}同时满足两个非严格比较；这是假想域非真实仪器标准。J的z由右闭射线保留，全实数被小于z或不小于z覆盖；K两侧均开，z不在，得ℝ∖{z}，一个点也不可补造。`,
    `A centre=${centre},radius=c/|a|=${near ? '3/2' : '5/2'}. Its ≤ set is [−2,${upper}],and ≥ is (−∞,−2]∪[${upper},∞). Boundaries give absolute value c; the centre gives zero. Both outer sides satisfy ≥ and the inside satisfies ≤. B centre=${nCentre},≤ set [${nlo},${nhi}],≥ set (−∞,${nlo}]∪[${nhi},∞). Divide by NEGATIVE a,reverse both comparisons and reorder; copying A is wrong. For a≠0 the centre is −b/a and, when c≥0, the radius is c/|a|. These positive-radius inner/outer steps use c>0; audit strict/non-strict zero-threshold cases separately. Infinity is not an includable number,and a viewing window does not restrict the domain. Z has constant |b|=${babs}<c=${radius}; <,≤,>,≥ give ℝ,ℝ,∅,∅. With c=|b| they give ∅,ℝ,∅,ℝ. Z0 has constant zero and threshold zero: likewise ∅,ℝ,∅,ℝ; >0 is EMPTY, not all except one root. Never divide by zero. T gives ≤ set [0,${upper}] and ≥ set [${upper},∞),removing the negative-side ray; ${upper} belongs to both non-strict comparisons. This is a stipulated mathematical domain,not a real sensor standard. J includes z through its closed right ray: every real is below z or at least z,so ℝ. K excludes z on both rays: ℝ∖{z}. An omitted point cannot be invented.`,
  );
  table(q5, [
    [
      'A',
      '全实域原式',
      'Original over all reals',
      `|ax+b|与c比较;a=${coeff};b=${intercept};c=${radius}`,
      `Compare |ax+b| with c;a=${coeff};b=${intercept};c=${radius}`,
    ],
    [
      'B',
      '从A只反号a',
      'From A: negate a only',
      `a=−${coeff};b,c同A`,
      `a=−${coeff};b,c as A`,
    ],
    [
      'Z',
      '从A只改a=0',
      'From A: set a=0 only',
      'a=0;b,c同A；再单改c=|b|',
      'a=0;b,c as A; then change only c to |b|',
    ],
    ['Z0', '独立零常数', 'Separate zero constant', 'a=b=c=0', 'a=b=c=0'],
    [
      'T',
      '从A另加情境域',
      'A with an added context domain',
      '虚构校准量ax+b；x≥0；|ax+b|≤c或≥c分别审',
      'Fictional calibration ax+b;x≥0; audit ≤c and ≥c separately',
    ],
    [
      'J/K',
      '独立并集比较',
      'Separate union audit',
      `z=${f};J:(−∞,z)∪[z,∞);K:(−∞,z)∪(z,∞)`,
      `z=${f};J:(−∞,z)∪[z,∞);K:(−∞,z)∪(z,∞)`,
    ],
  ]);
  return {
    id: `${unit}-MAINT-LOGIC-MEANING`,
    unit,
    bridge: 'H01-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5].map((n) => [id(n), `H01-L0${n}`]),
    ),
    title: t(
      '求导与分析之后，再核集合对象和逻辑边界',
      'After calculus and analysis, recheck set objects and logical boundaries',
    ),
    intro: t(
      '五张独立卡，每次一个编号/案例，可分次不计时、口述。原逻辑证明/量词及零负阈值题保留，只补未覆盖操作。全部人审，不把作者验收当家庭学习证据。',
      'Five independent cards: one numbered part/case per untimed sitting; oral work is welcome. Retain existing proofs,quantifier and zero/negative-threshold tasks; supplement uncovered operations only. All reasoning is human-reviewed; author QA is not household learning evidence.',
    ),
    questions: [q1, q2, q3, q4, q5],
  };
};
export const logicMeaningRetrieval = {
  H25_LOGIC_MEANING: makeSet('H25'),
  H26_LOGIC_MEANING: makeSet('H26'),
};
