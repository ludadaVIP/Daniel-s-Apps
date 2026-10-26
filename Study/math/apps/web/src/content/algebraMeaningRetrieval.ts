import { t, type Question } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'J71' | 'J73') => {
  const near = unit === 'J71',
    id = (n: number) => `${unit}-MAINT-ALGEBRA-MEANING-Q${n}`;
  const card = (
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
        '一次一个编号分问或一条独立分支，可分多次、不计时。先自己画、列式和解释，再逐项人审；读题协助与数学提示分开。',
        'Work on ONE numbered part or independent branch per sitting, without a timer. Draw, construct expressions and explain before human review of every requirement. Separate reading assistance from mathematical hints.',
      ),
    ]);
  const table = (q: Question, rows: [string, string, string, string][]) => {
    q.contextTable = {
      caption: t(
        '原条件表；独立分支见题干，所求式子与解须自行生成。',
        'Original conditions; the prompt identifies independent branches. Generate requested expressions and solutions yourself.',
      ),
      columns: [t('编号', 'ID'), t('含义', 'Meaning'), t('给定值', 'Given')],
      rows: rows.map(([k, z, e, v]) => [t(k, k), t(z, e), t(v, v)]),
    };
  };
  const k = near ? 3 : 4,
    c = near ? 4 : 1,
    v = near ? -3 : -2,
    ab = near ? -2 : -3;
  const repeated = [...Array.from({ length: k }, () => 'n'), String(c)].join(
    '+',
  );
  const q1 = card(
    1,
    'letter-substitution',
    `① 将${repeated}写成系数简写，先在每个n处画框，再分别代入V、0、1/2求精确值，保留负数括号和固定量。${k}n是加法、乘法还是拼数？给一个正整数输入分别算乘积与拼接数，不能省去两数字间的乘号。② 另给a=b=W，求a+b，检验“字母不同数值必不同”。若n改指每袋完整圆片数，V、0、1/2中哪些允许，哪些虽能纯数计算却不合情境？③ 区分${k}n+${c}、n=V和${k}n+${c}=Y的角色。再比较原式与n+${k + c - 1}在n=1和n=2；一次吻合能证明一般相同吗？用重复份数给正确简写的一般理由，不只试值。`,
    `① Abbreviate ${repeated} using a coefficient. BOX every n, then substitute V,0,1/2 SEPARATELY for exact values, retaining negative brackets and the fixed term. Does ${k}n mean addition, multiplication or digit concatenation? Generate a positive-integer input and compare the product with concatenation; keep a multiplication sign between numerical factors. ② SEPARATELY a=b=W: find a+b and test whether different letters must have different values. If n counts whole counters per bag, which of V,0,1/2 remain allowed despite all being evaluable as pure numbers? ③ Distinguish the roles of ${k}n+${c}, n=V and ${k}n+${c}=Y. Compare the original with n+${k + c - 1} at n=1 and n=2. Does one match prove identity? Justify the coefficient shorthand by repeated copies, not trials alone.`,
    `${repeated}=${k}n+${c}，V=${v}时${k * v + c}，0时${c}，1/2时${near ? '11/2' : '3'}。每处同值、系数${k}不随负输入变号；${k}n是${k}×n，例如n=2得${k * 2}，拼接则${k}2。a=b=${ab}得a+b=${2 * ab}，不同字母可同值。完整片数允许0，排除${v}及1/2；纯数计算有效不等于片数有效。第一是表达式，第二给定赋值，第三是给定Y后对n的相等条件；未给Y不能随意指定唯一n。n=1原/错式都${k + c}，n=2分别${2 * k + c}/${k + c + 1}，故一次吻合不充分；正确式由${k}份n和独立常数支持。`,
    `${repeated}=${k}n+${c}: at V=${v} the value is ${k * v + c}, at zero ${c}, and at 1/2 ${near ? '11/2' : '3'}. Every occurrence has the same value; the coefficient ${k} does not change sign. ${k}n means ${k}×n; for example n=2 gives ${k * 2}, while concatenation gives ${k}2. At a=b=${ab}, a+b=${2 * ab}, so different letters may agree. Whole-counter counts allow zero but exclude ${v} and 1/2. Evaluation and contextual permission differ. The first is an expression, the second an assignment, and the third an equality condition once Y is given; an unspecified Y does not select a unique n. At n=1 both proposed expressions give ${k + c}; at two they give ${2 * k + c} and ${k + c + 1}. Repeated copies and the separate constant justify the correct identity.`,
    '同字母逐处替换；另列“能计算”和“情境允许”，别把赋值自动改成求解。',
    'Replace every occurrence consistently. Separate evaluation from contextual permission, and an assignment from a problem to solve.',
  );
  table(q1, [
    ['K', '重复n的份数', 'Copies of n', String(k)],
    ['C', '固定加数', 'Fixed addend', String(c)],
    ['V', '第一个独立输入', 'First separate input', String(v)],
    ['W', '另题a与b共同值', 'Separate common value of a and b', String(ab)],
  ]);

  const rows = near ? 4 : 5,
    fixed = near ? 3 : 2,
    farStage = near ? 17 : 23,
    total = near ? 31 : 47,
    bad = total + 1,
    index = near ? 7 : 9;
  const q2 = card(
    2,
    'constructed-nth-term',
    '完整构造：第n幅有R行、每行n片，另有F片固定量，幅号只取正整数。① 自画前两幅，逐部分写一般总数、相邻增长与第S幅总数；三者各指什么，固定量出现几次？S超过屏幕前十幅会令规则失效吗？② 分别从总数T与U反找幅号、代回原条件，判断是否存在该幅；非整数结果能四舍五入吗？再区分代数式在n=0、负数、1/2有值与构造实际允许这些幅号。③ 只留下前两幅总数、撤去构造：自己给两种完整后续规则，可用分段文字，前两项吻合而第三项不同。然后说明本题为什么仍能根据已给完整构造证明一般式；不能仅凭有限试值证明唯一规律。',
    'Complete construction: figure n contains R rows of n counters plus F fixed pieces, with POSITIVE INTEGER indices. ① DRAW the first two, derive the general total, growth and total at S, matching every part. Which quantities differ, and how often are the extras counted? Does S beyond the first ten displayed figures invalidate the rule? ② Recover an index SEPARATELY from totals T and U, substitute back and decide existence without rounding. Distinguish evaluating the formula at zero, negatives or 1/2 from permitted figure indices. ③ REMOVE the construction and retain only two totals: GENERATE two complete continuation rules, using piecewise words if helpful, agreeing initially but differing at figure three. Why does the supplied complete construction nevertheless justify this problem’s general rule, unlike finitely many trials?',
    `总数${rows}n+${fixed}，增长${rows}；前两幅${rows + fixed}/${2 * rows + fixed}，第${farStage}幅${rows * farStage + fixed}，固定${fixed}只加一次。显示十幅不截断规则。T=${total}扣${fixed}再除${rows}得幅号${index}，代回${rows * index + fixed}；U=${bad}给${near ? '29/4' : '46/5'}，不为正整数，不能取整伪造该幅。0/负数/半整数可代入纯式但不属本幅号域。例规则一始终${rows}n+${fixed}；规则二前两幅同值，从第三幅起恒100，第三幅分别${3 * rows + fixed}/100，都是完整延续，说明原两数不唯一。已给逐幅R行与F片的构造才支持所有允许幅号的式子。`,
    `Total=${rows}n+${fixed}, growth=${rows}; the first totals are ${rows + fixed}/${2 * rows + fixed}, and stage ${farStage} has ${rows * farStage + fixed}. Count the ${fixed} extras once. A ten-figure display does not truncate the rule. T=${total} gives (${total}−${fixed})/${rows}=${index}, verified in the original. U=${bad} gives ${near ? '29/4' : '46/5'}, not an allowed index; rounding changes the condition. Zero, negatives and halves may be evaluated algebraically but are not indices here. One full continuation always uses ${rows}n+${fixed}; another agrees for the first two then stays 100 from stage three. Third totals ${3 * rows + fixed}/100 differ. The specified construction, rather than those two observations, establishes the formula for all allowed indices.`,
    '先找每一行和一次固定量；反求后同时核等式及正整数幅号条件。',
    'Identify every row and the single fixed contribution. After inversion, check both the equation and the positive-integer index condition.',
  );
  table(q2, [
    ['R', '行数', 'Rows', String(rows)],
    ['F', '另加固定片数', 'Fixed extras overall', String(fixed)],
    ['S', '独立所求幅号', 'Separate requested index', String(farStage)],
    ['T', '反求的第一总数', 'First inverse total', String(total)],
    ['U', '反求的第二总数', 'Second inverse total', String(bad)],
  ]);

  const g = near ? 3 : 4,
    e = near ? 2 : 3,
    b = near ? 4 : 5,
    c0 = near ? 10 : 12,
    h = near ? 3 : 4;
  const q3 = card(
    3,
    'expression-structure',
    '① 亲画G袋，分支I每袋n个圆片与E个固定方块，分支O则每袋只有n片、袋外总共E块。分别写通用式、重复加法和展开式；另画n=0仍保袋框和固定块。固定量各出现几次？能用当前总数代替含n通式吗？② 以下各自独立且n为纯数：两个相同数各比n少B；从C减去n；n的一半再加H；先n加H再折半。逐项列式、给另一等值写法并说明分组/顺序，不把其中一项漏乘或误折半。③ 用n=2比较两种折半次序，再自行给一对在某输入吻合、其他输入不等的式子，检验单次吻合的证明力。通用等值要有逐组重复或合法分配依据。',
    '① DRAW G bags. In branch I each holds n counters AND E fixed squares; in independent branch O each holds only n counters, with E extras OVERALL outside. Write general, repeated-sum and expanded expressions; redraw n=0 retaining boxes and extras. How often is each fixed term counted? Can one current total replace a rule? ② Independently let n be a PURE NUMBER: two equal numbers each B less than n; subtract n from C; half of n then add H; add H then halve. Translate each, give an equivalent form and explain grouping/order without missing a distributed term or halving the wrong part. ③ Compare the half-order expressions at n=2, then GENERATE two expressions matching at one input but differing elsewhere. Explain why a general identity needs grouping or legal distribution rather than a single match.',
    `I=${g}(n+${e})=${g}n+${g * e}，O=${g}n+${e}；n=0分别${g * e}/${e}，空袋不消固定块。当前一个数不能描述所有n，片数n为非负整数。另题依次2(n−${b})=2n−${2 * b}；${c0}−n=−n+${c0}；n/2+${h}=(n+${2 * h})/2；(n+${h})/2=n/2+${h}/2。n=2后两式分别${h + 1}与${near ? '5/2' : '3'}，次序不同；纯数题可用负数，不强加片数域。例2n与n+1在1同2、在2为4/3；一次符合不足。正确等值由重复整组/逐项分配证明，不靠当前图总数。`,
    `I=${g}(n+${e})=${g}n+${g * e}; O=${g}n+${e}. At zero the totals ${g * e}/${e} retain fixed squares and boxes. One numerical total is not a rule; counter-count n is a nonnegative integer. Separate pure-number expressions: 2(n−${b})=2n−${2 * b}; ${c0}−n=−n+${c0}; n/2+${h}=(n+${2 * h})/2; (n+${h})/2=n/2+${h}/2. At n=2 the last two give ${h + 1} and ${near ? '5/2' : '3'}, so order matters. Pure-number tasks permit negatives without imposing counter restrictions. For example 2n and n+1 agree at one but give four/three at two. Group repetition or term-by-term distribution establishes an identity; a current diagram total does not.`,
    '先说每一组，再数固定量重复几次；独立分支各自保原先后顺序。',
    'Describe one group, then count fixed contributions. Preserve each independent branch’s original operation order.',
  );
  table(q3, [
    ['G', '袋数', 'Bag count', String(g)],
    [
      'E',
      '每袋或袋外固定量，见分支',
      'Per-bag or overall extras by branch',
      String(e),
    ],
    [
      'B',
      '纯数分支每个少的量',
      'Amount less in each pure-number copy',
      String(b),
    ],
    ['C', '另题减法原量', 'Separate subtraction starting value', String(c0)],
    ['H', '另题加数', 'Separate addend', String(h)],
  ]);

  const coefficient = near ? -3 : -4,
    target = near ? 6 : 10,
    answer = near ? '-2' : '-5/2',
    a = near ? 3 : 4;
  const q4 = card(
    4,
    'equivalent-equation',
    '原式Kx=T，x为纯数。① 写每步两边操作求精确解，再交换原等号两边重解并代回。负系数核查时用“若干份x的相反数”解释，不画负质量。② 每条都从原式独立开始：两边同加A、同减A、同乘M、同除M，写新关系、逆操作和解集理由；再仅左边除K，求新式解并代回原式，不能把新式平衡当原式有效。③ 原式两边乘0后，亲给一个新增候选证明限制丢失；除0另有什么问题？独立比较0x=0、0x=1、7x=0的全部解，用原条件检查。x取0与执行乘0是同一回事吗？',
    'Original Kx=T with pure-number x. ① Record equal operations to solve EXACTLY, reverse the written sides and solve again, then check the original. Explain the negative coefficient as an opposite of repeated x, not negative mass. ② Start afresh from the ORIGINAL for EACH branch: add A, subtract A, multiply by M, divide by M on BOTH sides. Write the relation, inverse and solution-set reason. Then divide only the LEFT by K, solve that new relation and test it in the original. A new balance is not an original check. ③ After multiplying both original sides by zero, GENERATE an additional admitted candidate showing lost information. How is division by zero different? Independently classify ALL solutions of 0x=0,0x=1,7x=0. Is assigning x=0 the same as multiplying an equation by zero?',
    `原解${answer}，交换两边相同，代回${coefficient}×(${answer})=${target}。同加/减${a}可由同减/加${a}逆回；同乘/除−1/2可由同除/乘−1/2逆回，因M非零，解集完全相同，各枝保两边。只左除K得x=${target}，原左值${coefficient * target}不等${target}，解已改。两边乘0成0=0，例新增候选0通过但原式0≠${target}，不可逆；除0未定义。0x=0所有允许纯数，0x=1无解，7x=0仅0；零解是一个候选，乘零是丢信息操作，两者不同。`,
    `The solution is ${answer}, unchanged by swapping sides; original substitution gives ${coefficient}×(${answer})=${target}. Adding/subtracting ${a} is reversed by subtracting/adding it. Multiplying/dividing by −1/2 is reversed by dividing/multiplying by −1/2, which is nonzero. Each branch acts on BOTH sides and preserves the complete solution set. Dividing only the left by K yields x=${target}; its original left ${coefficient * target} differs from ${target}. Zero multiplication gives 0=0: additional candidate zero passes that relation but fails original 0=${target}, showing non-reversibility. Division by zero is undefined. 0x=0 admits all permitted pure numbers, 0x=1 none, and 7x=0 only zero. A zero candidate is different from a zero multiplication operation.`,
    '分开“候选通过当前式”与“全部原解均被保留且没有新增”；每条从原式重启。',
    'Separate one candidate satisfying a current relation from preservation of exactly all original solutions. Restart each branch from the original.',
  );
  table(q4, [
    ['K', '原系数', 'Original coefficient', String(coefficient)],
    ['T', '原右值', 'Original right side', String(target)],
    [
      'A',
      '独立加减分支的量',
      'Independent addition/subtraction amount',
      String(a),
    ],
    [
      'M',
      '独立乘除分支的量',
      'Independent multiplication/division amount',
      '-1/2',
    ],
  ]);

  const factor = near ? 3 : 6,
    inside = near ? 2 : 1,
    rhs = near ? 4 : 5,
    root = near ? '-2/3' : '-1/6',
    rounded = near ? '-0.67' : '-0.17',
    sub = near ? 3 : 5,
    divisor = near ? 2 : 3,
    out = near ? 4 : 2;
  const q5 = card(
    5,
    'bracket-equation',
    '① 原式A(x+B)=C，x为纯数。先列正向动作，再分别走“倒序撤销”和“逐项展开”两条完整求解路，写每个中间等式、同做操作及精确解，代回原式。展开只乘x、或只在左边删A，各错在哪里？② 把候选改D，精确算原式左边与C比较；它是近似还是精确解，能否改条件容纳它？再独立解(x−E)/F=G：必须撤销最后的除法，不是照原顺序处理右值。③ 另将第一式右边改为A×B，重新求解并代回；零解能否说明没有解、或允许把两边乘零来求解？说明为什么固定非零系数、无变量分母的范围让上述步骤可逆。',
    '① Original A(x+B)=C, with pure-number x. State the FORWARD operations, then solve by both REVERSE-order undoing and term-by-term DISTRIBUTION. Write every intermediate equation, equal action and exact answer; check the original. Diagnose multiplying only x during expansion and deleting A only on the left. ② Replace the candidate by D and evaluate the original left EXACTLY against C. Is D approximate or exact, and may the condition be changed to accept it? Independently solve (x−E)/F=G by undoing the final division first. ③ Separately change the first right side to A×B, solve again and verify. Does a zero solution mean no solution or justify multiplying both sides by zero? Explain why fixed nonzero coefficients and no variable denominators allow these reversible steps.',
    `${factor}(x+${inside})=${rhs}先同除${factor}得x+${inside}=${rhs}/${factor}，再同减${inside}得${root}；或展开${factor}x+${factor * inside}=${rhs}，同减${factor * inside}后同除${factor}仍${root}。代回恰${rhs}。漏乘固定量改条件，只左删因子也非等值。D=${rounded}代回左${near ? '399/100=3.99' : '249/50=4.98'}，不等${rhs}，不可用近似替精确或改原右值。独立(x−${sub})/${divisor}=${out}先两边乘${divisor}、再加${sub}，x=11，代回${out}。改右为${factor * inside}，先同除得x+${inside}=${inside}再减得0，原式成立，是唯一零解，不是无解或乘零操作。每步依非零常数可逆，最终必须核原式。`,
    `${factor}(x+${inside})=${rhs}: divide BOTH by ${factor} to get x+${inside}=${rhs}/${factor}, then subtract ${inside} to get ${root}. Alternatively expand to ${factor}x+${factor * inside}=${rhs}, subtract ${factor * inside} and divide by ${factor}, giving the same ${root}. Original substitution is exactly ${rhs}. Omitting the fixed term’s factor or deleting A on one side changes the condition. D=${rounded} gives original left ${near ? '399/100=3.99' : '249/50=4.98'}, not ${rhs}; approximation cannot replace the exact solution or change the original right side. Independently (x−${sub})/${divisor}=${out}: multiply BOTH by ${divisor}, then add ${sub}, giving x=11 and original value ${out}. With first right side ${factor * inside}, divide to get x+${inside}=${inside}, then subtract to get zero, a unique valid solution. It is neither no solution nor zero multiplication. Nonzero fixed constants make these steps reversible; finish with the original.`,
    '先把整个括号经历的动作排队，再从最后一个撤销；每一步同时处理等号两边。',
    'List operations on the whole bracket, undo the last first, and apply each action to both sides.',
  );
  table(q5, [
    ['A', '第一原式外因子', 'First original outside factor', String(factor)],
    ['B', '第一原式括号加数', 'First original bracket addend', String(inside)],
    ['C', '第一原式右值', 'First original right side', String(rhs)],
    ['D', '独立近似候选', 'Separate approximate candidate', rounded],
    ['E', '第二原式减数', 'Second original subtrahend', String(sub)],
    ['F', '第二原式固定除数', 'Second original fixed divisor', String(divisor)],
    ['G', '第二原式右值', 'Second original right side', String(out)],
  ]);
  return {
    id: `${unit}-MAINT-ALGEBRA-MEANING`,
    unit,
    title: t(
      '字母的取值、构造与可逆关系',
      'Letter values, constructions and reversible relationships',
    ),
    bridge: 'P65-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5].map((n) => [id(n), `P65-L0${n}`]),
    ),
    intro: t(
      '五张纸笔过程卡，一次一个编号小问或独立分支，可分多次、不计时。先自主画图、列式与解释，再逐项人审，允许口述和熟悉语言；读题协助与数学提示分开。只需假想圆片/袋和数值关系，不需购买、称重或实际装袋。',
      'Five paper cards, ONE numbered part or independent branch at a time across untimed sittings. Draw, construct expressions and explain independently before human review of every requirement. Oral or familiar-language responses are welcome; separate reading help from mathematical hints. Fictional counters, bags and numerical relationships need no purchase, weighing or actual packing.',
    ),
    questions: [q1, q2, q3, q4, q5],
  };
};
export const algebraMeaningRetrieval = {
  J71_ALGEBRA_MEANING: makeSet('J71'),
  J73_ALGEBRA_MEANING: makeSet('J73'),
};
