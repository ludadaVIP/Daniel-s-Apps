import { t, type Question } from '../model';
import { reasoning } from './builders';

const makeSet = (unit: 'H01' | 'H02') => {
  const near = unit === 'H01',
    id = (n: number) => `${unit}-MAINT-INEQUALITY-MEANING-Q${n}`;
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
        '逐个独立案例保原条件。先写完整集合与可逆依据，再用原式核边界、允许值和拒绝值；几个样本不证明一般结论。',
        'Retain the originals for each separate case. Give the complete set and reversible justification before testing boundaries, members and nonmembers in the originals. A few samples do not prove a general claim.',
      ),
      t(
        '一次一个编号或案例，可分次、不计时，可口述或熟悉语言。读题帮助与数学提示分开；先生成自己的式、图和理由再人审。',
        'One numbered part or case per untimed sitting. Oral or familiar-language work is welcome. Separate reading assistance from mathematical hints; generate your own algebra, diagrams and reasons before human review.',
      ),
    ]);
  const table = (
    q: Question,
    rows: [string, string, string, string, string?][],
  ) => {
    q.contextTable = {
      caption: t(
        '原条件：各编号案例独立，代数变量取完整实数；数量域另给。显示窗口和作者示例不替换原条件。',
        'Original conditions: labelled cases are independent, with real algebraic variables and separately specified quantity domains. Display windows and author examples do not replace the originals.',
      ),
      columns: [
        t('编号', 'ID'),
        t('对象', 'Object'),
        t('原条件', 'Original conditions'),
      ],
      rows: rows.map(([k, z, e, v, ve]) => [t(k, k), t(z, e), t(v, ve ?? v)]),
    };
  };
  const source = near ? 'x+3≤1' : 'x−4>−2',
    amount = near ? '−3' : '4',
    a = near ? '−3/2' : '−2',
    b = near ? '2' : '5/2',
    h = near ? '−4' : '−3',
    k = near ? '−2' : '−3/2',
    offset = near ? '−3/2' : '−5/2';
  const q1 = card(
    1,
    'operations-order-and-equivalence',
    '① 解S，将“移项”写成两边同加什么，并给逆操作和完整解集。独立只对原S左边加同一操作量，写新条件，用x=0逐原式比较；另只对原S左边加0，本例集合改变吗？“本次碰巧同解”和“任何单边加数均安全”相同吗？② 对A同加给定负数h，算两结果、画带a/b身份的数轴；再独立同除给定负数k，算精确商、按原身份画第二数轴并写顺序。哪一步是平移，哪一步含反射？对任意a<b、k<0用差(b−a)/k的符号解释除法反序；另取a=b为E，实际算同除k后是否还相等，等号会消失吗？③ 对温度T先从文字写原不等式，再可逆求全部允许x、画图，核边界、x=−2与一个不允许值。能额外加x≥0吗？一次一案例，不能因出现负号就一律翻转。',
    '① Solve S, expressing transposition as adding the SAME amount to BOTH sides. Give the inverse and full set. Independently add that amount ONLY to original S’s left side; write the trial and compare x=0 in both originals. Separately add zero ONLY on the left: does this particular set change? Is that coincidence a rule allowing ANY one-sided addition? ② For A add the given negative number h to both numbers, calculate and draw an axis retaining a/b identities. Independently divide both by negative k, calculate exact quotients and draw a second labelled axis in the original identities. Which is translation and which includes reflection? For arbitrary a<b,k<0 use the sign of (b−a)/k to justify division reversal. Separately put a=b=E and actually divide by k: does equality remain? ③ Translate thermometer T into its ORIGINAL inequality, solve reversibly for ALL real x, draw it and check the boundary, x=−2 and one rejected value. May x≥0 be added? One case per sitting; a minus sign alone never specifies the operation.',
    `S两边同加${amount}得${near ? 'x≤−2' : 'x>2'}，逆为同加${near ? '3' : '−4'}。只改左边得${near ? 'x≤1' : 'x>−2'}，x=0过错式却原${near ? '3≤1' : '−4>−2'}假。只加0本例原式不变，不能据此推广任意单边操作；前述反例已否证。A同加h后${near ? '−11/2<−2' : '−5<−1/2'}，负加数只平移、保原顺序。另同除k得${near ? '3/4>−1' : '4/3>−5/3'}；负倒数带反射，标签不能按大小重新分配。一般b−a>0，(b−a)/k=b/k−a/k<0，故a/k>b/k；可逆因k非零。E=${near ? '−1' : '−2'}时两商同为${near ? '1/2' : '4/3'}，相等仍相等，非严格符号的等号不丢。T原x+(${offset})≤−1/2，得x≤${near ? 1 : 2}，实心向左；边界代回−1/2，x=−2读数${near ? '−7/2' : '−9/2'}允许，x=${near ? 2 : 3}读数1/2不允许。x为实数摄氏温度，无非负限制，不附加x≥0。`,
    `Add ${amount} to BOTH S sides: ${near ? 'x≤−2' : 'x>2'}; undo by adding ${near ? 'three' : 'negative four'}. Left-only gives ${near ? 'x≤1' : 'x>−2'}, admitting zero despite original false ${near ? '3≤1' : '−4>−2'}. Adding zero only leaves this original unchanged, but cannot justify arbitrary one-sided additions; the counterexample refutes that rule. Adding h to A gives ${near ? '−11/2<−2' : '−5<−1/2'}, a translation preserving order. Independent division by k gives ${near ? '3/4>−1' : '4/3>−5/3'}. The negative reciprocal includes reflection; do not reassign identity labels after sorting. Generally b−a>0 and (b−a)/k=b/k−a/k<0, hence a/k>b/k. Nonzero k makes division reversible. For E=${near ? '−1' : '−2'} both quotients equal ${near ? '1/2' : '4/3'}; equality and inclusive comparisons retain equality. T originally requires x+(${offset})≤−1/2, giving x≤${near ? 1 : 2}, closed left shading. The endpoint reads −1/2; x=−2 reads ${near ? '−7/2' : '−9/2'} and passes; x=${near ? 2 : 3} reads 1/2 and fails. Real Celsius temperature has no added nonnegative restriction.`,
  );
  table(q1, [
    ['S', '独立一步条件', 'Separate one-step condition', source],
    [
      'A',
      '原数与操作量',
      'Original values and operation amounts',
      `a=${a}; b=${b}; h=${h}; k=${k}`,
    ],
    ['E', '独立相等数', 'Separate equal originals', near ? 'a=b=−1' : 'a=b=−2'],
    [
      'T',
      '温度原文字',
      'Original temperature words',
      `x为实数温度°C，读数x+(${offset})°C，要求至多−1/2°C；无其他限制`,
      `x is a real Celsius temperature; reading x+(${offset})°C must be at most −1/2°C; no other restriction`,
    ],
  ]);
  const bracket = near ? '1−2(x−3)≤x+2' : '3−2(x+1)≥x+6',
    all = near ? '3(x−2)≤3x−5' : '2(x+3)≤2x+7',
    none = near ? '3(x−2)<3x−7' : '2(x+3)<2x+5',
    strict = near ? '3(x−2)<3x−6' : '2(x+3)<2x+6',
    inclusive = near ? '3(x−2)≤3x−6' : '2(x+3)≤2x+6';
  const q2 = card(
    2,
    'brackets-and-constant-inequalities',
    '① 对E将外部负因子连到括号每个完整带符号项，写展开、两边同步集中项和最终除数。每一步说明值/解集保留及方向理由；给完整精确解集、图，并核边界、一解一非解。给定小数C能替代精确边界吗？把C本身代回最初E的两边，实际算差，不只看中间式。② 独立对F/N/Zs/Zi分别展开并消去x，写剩下的常数比较与完整实数解集，画全实数或空集。为何相同两常数但严格/非严格能给不同结果？③ 给F两个不同实数见证，再以一般展开说明全体，而非凭两个例子证明；N的常数矛盾能被换x修好么？“无解”“仅x=0”“所有实数”相同吗，能除消失的0系数吗？一次一行。',
    '① Connect E’s negative outside factor to EVERY complete signed bracket term. Expand, gather terms with common operations, and name the final divisor. Explain preserved values/sets and direction at each step. Give the EXACT full set and graph; check its boundary, a member and a nonmember. Can decimal C replace the exact boundary? Evaluate BOTH ORIGINAL E sides at C and calculate their difference, not only an intermediate relation. ② Independently expand F,N,Zs,Zi, cancel x, record each remaining constant comparison and its COMPLETE real set, drawing all reals or empty. Why can identical constants give different outcomes under strict versus inclusive comparisons? ③ Give two distinct real witnesses for F, then use general expansion to prove the whole set rather than relying on witnesses. Can changing x fix N’s constant contradiction? Distinguish empty, singleton zero and all reals; may the vanished zero coefficient be divided out? One row per sitting.',
    `E展开${near ? '7−2x≤x+2，得−3x≤−5' : '1−2x≥x+6，得−3x≥5'}，同除负3反向，${near ? 'x≥5/3' : 'x≤−5/3'}，实心${near ? '右' : '左'}。减号对整个括号的每项起作用，展开本身不翻。边界两侧${near ? '11/3' : '13/3'}；x=${near ? '2' : '−2'}给${near ? '3≤4' : '5≥4'}真，x=0给${near ? '7≤2' : '1≥6'}假。C=${near ? '1.66' : '−1.66'}原左${near ? '3.68' : '4.32'}、右${near ? '3.66' : '4.34'}，差${near ? '1/50' : '−1/50'}使原比较假；用此小数边界会错误允许C，不能以等号代精确三分数。F留下${near ? '−6≤−5' : '6≤7'}恒真，所有实数；N留${near ? '−6<−7' : '6<5'}假，空集；Zs留${near ? '−6<−6' : '6<6'}即0<0假，空集；Zi留同常数≤即0≤0真，所有实数。F可见证0和−3/2，但一般消x后的恒真才证明任意实数，N不含x的矛盾不能靠选x修复。0乘任何实数为0，非仅零满足；无解/唯一0/全实数不同，以上无一步允许除0。全实数两向箭头、空集无假涂色。`,
    `E expands to ${near ? '7−2x≤x+2, then −3x≤−5' : '1−2x≥x+6, then −3x≥5'}. Divide by negative three and reverse: ${near ? 'x≥5/3' : 'x≤−5/3'}, closed shading ${near ? 'right' : 'left'}. Distribute the negative to EVERY term; expansion itself does not reverse. At the exact boundary both sides equal ${near ? '11/3' : '13/3'}. At x=${near ? '2' : '−2'}, original ${near ? '3≤4' : '5≥4'} is true; zero gives false ${near ? '7≤2' : '1≥6'}. Decimal C=${near ? '1.66' : '−1.66'} gives original left ${near ? '3.68' : '4.32'}, right ${near ? '3.66' : '4.34'}, difference ${near ? '1/50' : '−1/50'}, failing the comparison. Its rounded boundary would wrongly admit C. F leaves true ${near ? '−6≤−5' : '6≤7'}:all reals. N leaves false ${near ? '−6<−7' : '6<5'}:empty. Zs leaves ${near ? '−6<−6' : '6<6'}, equivalent to false 0<0:empty. Zi leaves the same constants under ≤, hence true 0≤0:all reals. Zero and −3/2 witness F, but its general constant identity proves every real input. No choice of x repairs N’s constant contradiction. Zero times ANY real is zero, not only at x=0. Empty, unique zero and all reals differ; no case permits zero division. Draw continuation in both directions for all reals and no fictitious shading for empty.`,
  );
  table(q2, [
    ['E', '独立减括号条件', 'Separate subtracted-bracket condition', bracket],
    [
      'C',
      '独立小数候选边界',
      'Separate proposed decimal boundary',
      near ? '1.66' : '−1.66',
    ],
    ['F', '独立条件F', 'Separate condition F', all],
    ['N', '独立条件N', 'Separate condition N', none],
    ['Zs', '独立严格条件', 'Separate strict condition', strict],
    ['Zi', '独立含等条件', 'Separate inclusive condition', inclusive],
  ]);
  const lower = near ? 7 : 8,
    upper = near ? 9 : 11,
    r = near ? '−3/2' : '−5/4',
    price = near ? 2 : 3,
    fee = near ? 1 : 2;
  const q3 = card(
    3,
    'complete-intersection-and-designed-constraints',
    '① 把A原文字分别译成不等式，画两条同刻度数轴，求“且”的完整交集；逐条核两边界、一个内部数、P、Q，写每个数在哪条失败。可从P/Q各挑一个数冒充同一个共同解吗？若把“且”另改“或”，本例全体允许值是什么，为什么？小窗没有涂色等于空集吗，扩大窗口会改解集吗？② 对B同向两界取交，给一个只过较宽界的精确反例；再独立解C同界的严格/含等交集，为什么不能只看相同边界数字？③ 在D允许参数内亲自选L、U，为虚构已启动社区供应服务编两条限制：数量“至少L”、总费用“至多预算B=pU+f”。定义x/单位，先列两原不等式再解，分别给连续升数及整袋全部允许值/最大值，画图并核下界、连续上界、一允许数与一拒绝数。另把预算改pL+f制造闭闭相遇，再只改“严格大于L”制造一侧开口，写新原条件和各完整集合。可口述或纸笔，接受任何合条件自主方案，不照抄示例。',
    '① Translate each original A statement into an inequality, draw two axes on the SAME scale and find the COMPLETE AND intersection. Check both boundaries, an interior number, P and Q against EACH condition, identifying failures. Can separate P/Q values stand in for one shared value? Independently replace AND by OR: what is the full set HERE, and why? Does no shading in the small window mean empty, and does widening change the set? ② Intersect B’s same-direction bounds and provide an exact number passing only the weaker bound. Independently intersect C’s strict/inclusive SAME boundary: why is its number alone insufficient? ③ CHOOSE permitted L,U in D and DESIGN two restrictions for a fictional activated community supply service: amount at least L and total cost at most budget B=pU+f. Define x and units, WRITE both originals, then solve. Give ALL allowed amounts and maxima for continuous litres versus whole bags, draw them and check the lower boundary, continuous upper boundary, a member and a rejected value. Change budget to pL+f to create a closed touch, then change only the lower wording to strictly greater than L for an open touch. Write each new original and full set. Oral/paper work is welcome; accept ANY valid independent design rather than requiring the example.',
    `A为x≥${lower}且x<${upper}，交集[${lower},${upper})，下界过两条、上界败第二；内部${near ? 8 : 9}全过，P=${lower - 1}败第一过第二，Q=${upper + 1}过第一败第二，不能用不同数冒充同一共同数。若改或，任意实数或小于${upper}、或至少${lower}（两范围重叠），故全实数；非原AND。A在[−5,5]无部分但非空，拓[−12,12]可见，解不改。B交为${near ? 'x≥−3/2，反例−2只过x>−7/3' : 'x≤−5/4，反例−1只过x<−1/2'}。C同界严格更强，为${near ? 'x>−3/2' : 'x<−5/4'}；共同边界${r}本身被严格条排除，不可取宽含等界。自主D原x≥L、${price}x+${fee}≤B，B=${price}U+${fee}；连续量全[L,U]升，整袋整数L…floor(U)，最大floor(U)袋，允许域各保；floor(U)+1超预算。闭闭改预算${price}L+${fee}时交为{x=L}，只改下界x>L则空，不另加情境域时两条实数不等式各自仍有无限解。参考${near ? 'L1、U7/2、预算8，连续[1,7/2]、袋{1,2,3}，4袋9>8' : 'L2、U10/3、预算12，连续[2,10/3]、袋{2,3}，4袋14>12'}；下界、上界均过原两条，0败至少L，取L可作允许值。参数范围内其他完整方案同样可用，价格与数据全部虚构，不能只报“取交集”不算。`,
    `A is x≥${lower} AND x<${upper}, giving [${lower},${upper}). The lower endpoint passes both, the upper fails row two, and interior ${near ? 8 : 9} passes both. P=${lower - 1} fails row one only; Q=${upper + 1} fails row two only. Different numbers cannot constitute one shared solution. Under the SEPARATE OR question every real is below ${upper} or at least ${lower}, since the ranges overlap:all reals, unlike the original AND. A has no part in [−5,5] but is nonempty; [−12,12] shows it without changing it. B gives ${near ? 'x≥−3/2;−2 passes only weaker x>−7/3' : 'x≤−5/4;−1 passes only weaker x<−1/2'}. C’s equal-bound strict condition dominates: ${near ? 'x>−3/2' : 'x<−5/4'}, excluding the boundary ${r} itself. For ANY permitted D design, originals x≥L and ${price}x+${fee}≤B with B=${price}U+${fee} give continuous [L,U] litres and integer bags L…floor(U), maximum floor(U). The next integer exceeds budget. Budget ${price}L+${fee} leaves singleton x=L; changing only the lower to x>L makes it empty, although each real inequality alone, before applying a quantity domain, has infinitely many members. An example is ${near ? 'L=1,U=7/2,B=8:continuous [1,7/2],bags{1,2,3};four bags cost nine above eight' : 'L=2,U=10/3,B=12:continuous [2,10/3],bags{2,3};four bags cost fourteen above twelve'}. Both continuous boundaries pass both originals, zero fails the lower, and L is a member. Other permitted complete independent designs count. All prices/data are fictional; merely naming intersection is insufficient.`,
  );
  table(q3, [
    [
      'A',
      '独立实数原文字',
      'Separate original real statements',
      `x不小于${lower}，且严格小于${upper}；P=${lower - 1}；Q=${upper + 1}`,
      `x is at least ${lower} AND strictly below ${upper}; P=${lower - 1}; Q=${upper + 1}`,
    ],
    ['W', '独立显示窗口', 'Separate display windows', '[−5,5] → [−12,12]'],
    [
      'B',
      '独立同向条件',
      'Separate same-direction bounds',
      near ? 'x>−7/3; x≥−3/2' : 'x<−1/2; x≤−5/4',
    ],
    [
      'C',
      '独立同界条件',
      'Separate equal-bound conditions',
      near ? `x>${r}; x≥${r}` : `x<${r}; x≤${r}`,
    ],
    [
      'D',
      '自主情境参数',
      'Independent design parameters',
      `L∈{1,2}; U∈${near ? '{7/2,9/2}' : '{10/3,13/3}'}; p=${price}; f=${fee}; B=pU+f；已启动服务，连续升数或非负整袋，单位价格NZ$/L或NZ$/袋、固定费NZ$`,
      `L∈{1,2}; U∈${near ? '{7/2,9/2}' : '{10/3,13/3}'}; p=${price}; f=${fee}; B=pU+f; activated service; continuous litres or nonnegative whole bags; unit price NZD/L or NZD/bag, fixed fee NZD`,
    ],
  ]);
  return {
    id: `${unit}-MAINT-INEQUALITY-MEANING`,
    unit,
    title: t(
      '同步操作、常数真假与完整交集',
      'Common operations, constant truth and complete intersections',
    ),
    intro: t(
      '三张纸笔卡，一次一个编号/独立案例，可分次、不计时。先生成原式、完整集合、图和理由再逐项人审；可口述/熟悉语言，阅读帮助与数学提示分开。所有情境虚构，不需购买、实测或个人资料。',
      'Three paper cards, one numbered part/separate case per untimed sitting. Generate originals, full sets, diagrams and reasons before individual human review. Oral/familiar-language work is welcome; distinguish reading assistance from mathematical hints. All contexts are fictional and require no purchases, measurements or personal data.',
    ),
    bridge: 'J84-L03',
    bridgeByQuestion: Object.fromEntries(
      [3, 4, 5].map((l, i) => [id(i + 1), `J84-L0${l}`]),
    ),
    questions: [q1, q2, q3],
  };
};
export const inequalityMeaningRetrieval = {
  H01_INEQUALITY_MEANING: makeSet('H01'),
  H02_INEQUALITY_MEANING: makeSet('H02'),
};
