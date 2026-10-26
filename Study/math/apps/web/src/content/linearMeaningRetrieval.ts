import { t, type Question } from '../model';
import { reasoning } from './builders';

const makeSet = (unit: 'J83' | 'J92') => {
  const near = unit === 'J83',
    id = (n: number) => `${unit}-MAINT-LINEAR-MEANING-Q${n}`;
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
        '一次一个编号分问或一个独立情境，可分次、不计时。先写原式、范围和自己的理由，再逐项人审；允许口述或熟悉语言，读题协助与数学提示分开。',
        'One numbered part or independent context per untimed sitting. Write the original relation, domain and your own reasons before human review. Oral/familiar-language responses are welcome; separate reading help from mathematical hints.',
      ),
    ]);
  const table = (
    q: Question,
    rows: [string, string, string, string, string?][],
  ) => {
    q.contextTable = {
      caption: t(
        '各行是独立原条件，不把不同情境拼在一起；精确解和筛选结果由你生成。',
        'Rows give independent original conditions, not one combined context. Generate exact solutions and domain decisions yourself.',
      ),
      columns: [
        t('编号', 'ID'),
        t('原对象', 'Original object'),
        t('原式或条件', 'Original relation/condition'),
      ],
      rows: rows.map(([k, z, e, v, ve]) => [t(k, k), t(z, e), t(v, ve ?? v)]),
    };
  };
  const equation = near ? '4x+1=x' : '5x+1=2x−1',
    zero = near ? '3x+4=4' : '−4x+5=5',
    none = near ? '2x+1=2x+4' : '3x−2=3x+1',
    all = near ? '3(x−1)=3x−3' : '−2(x+3)=−2x−6';
  const q1 = card(
    1,
    'original-equation-check',
    `所有方程在有理数范围。① 对E作可逆的两边同做，给完整解集；把精确候选分别代回原左右两边，写每一侧的值。再检验近似候选${near ? '−0.33' : '−0.67'}，它精确满足吗？一个候选通过检验与已找全解有什么区别？② 对Z/N/I各展开、合并并给完整解集；系数相消后剩下什么原关系？给I两个不同的有理数见证，再以一般变形说明全部值均满足。③ 区分“唯一解是0”“无解”“所有有理数”；没有x项是否总是无解，能否除以消失的零系数？`,
    `All equations are over the rationals. ① Solve E by reversible both-side operations and give its COMPLETE solution set. Substitute the exact candidate into BOTH original sides and record each value. Check approximate candidate ${near ? '−0.33' : '−0.67'}: does it satisfy the equation exactly? Distinguish one passing candidate from finding all solutions. ② Expand/collect Z,N,I and classify their complete solution sets. What remains when coefficients cancel? Give two distinct rational witnesses for I, then justify ALL values generally. ③ Distinguish a unique zero solution, no solution and all rationals. Does losing the x term always mean no solution, and may one divide by its zero coefficient?`,
    `E给3x=${near ? '−1' : '−2'}，唯一x=${near ? '−1/3' : '−2/3'}；原两侧均${near ? '−1/3' : '−7/3'}。近似代入左右${near ? '−0.32与−0.33' : '−2.35与−2.34'}不等，舍入不作精确解。唯一性来自每一步可逆、非零3系数，不由一次代入证明找全。Z化${near ? '3x=0' : '−4x=0'}唯一0；N化${near ? '1=4' : '−2=1'}矛盾无解；I左右恒同，所有有理数均解，可取0和1/2见证但一般展开才说明全体。零根是一个值，空集无值，恒等全体有理数，均不除零。`,
    `E gives 3x=${near ? '−1' : '−2'}, uniquely x=${near ? '−1/3' : '−2/3'}; both original sides equal ${near ? '−1/3' : '−7/3'}. The rounded trial gives unequal sides ${near ? '−0.32 and −0.33' : '−2.35 and −2.34'}. Completeness follows from reversible steps and the nonzero coefficient three, not one passing substitution. Z reduces to ${near ? '3x=0' : '−4x=0'}, uniquely zero; N to contradiction ${near ? '1=4' : '−2=1'}, with no solution. I is an identity, satisfied by all rationals. Zero and one half are witnesses, while general expansion proves the full claim. A zero root, an empty set and all rationals are different; none permits division by zero.`,
    '逐行保原方程，分别记左右值；再用可逆变形说明完整解集，不能只凭试数分类。',
    'Retain each original equation and record both side values. Use reversible transformations for the complete solution set rather than classifying by trials alone.',
  );
  table(q1, [
    ['E', '精确解及近似检验', 'Exact and approximate check', equation],
    ['Z', '独立方程Z', 'Separate equation Z', zero],
    ['N', '独立方程N', 'Separate equation N', none],
    ['I', '独立方程I', 'Separate equation I', all],
  ]);

  const base = near ? '7x−2=3x+4' : '2−5x=2x+3';
  const q2 = card(
    2,
    'reversible-equation-steps',
    `① 解原B，每次“移项”写成两边同加/减什么完整项，最后同除哪个非零数，并写逆操作和原式检验。② 独立从原B把两边同乘−1/2，完整写新方程、解及恢复原式的逆操作。③ 另从原B分别试两边乘0和除0：哪些有定义、哪些可逆？以x=0比较乘零后和原式是否满足，不能只说术语。④ 独立将2x=0仅左边乘${near ? '2' : '3'}，实际完整解集是否改变？同一规则用于2x=4会怎样？用确切新旧解区分“本次碰巧同解”与“普遍安全”。⑤ 另对x=0提议两边除x：它与除已知非零常数相同吗，原零解在哪里？`,
    `① Solve original B. Express each transposition as adding/subtracting the SAME whole term on BOTH sides, state the final nonzero divisor and inverse operations, and check the original. ② Independently multiply both ORIGINAL B sides by −1/2: write the complete new equation, solve it and state how to recover B. ③ Independently try multiplying both B sides by zero and dividing by zero. Which is defined/reversible? Compare x=0 in the multiplied equation and original B. ④ Separately multiply ONLY the left side of 2x=0 by ${near ? 'two' : 'three'}. Does its actual complete solution set change? Apply the SAME rule to 2x=4 and compute old/new solutions: distinguish a coincidental match from a universally safe rule. ⑤ For the separate equation x=0, consider dividing both sides by x. Is this a known nonzero constant, and what happens to the original zero solution?`,
    `原B可${near ? '同减3x、同加2得4x=6，同除4得3/2' : '同加5x、同减3得−1=7x，同除7得−1/7'}；原两侧${near ? '17/2' : '19/7'}。每步可逆，可按逆序撤。乘−1/2给${near ? '−(7/2)x+1=−(3/2)x−2' : '(5/2)x−1=−x−3/2'}，原根保留，乘−2还原。乘0有定义但成0=0全体，x0在原式${near ? '−2≠4' : '2≠3'}，故增解且不可逆；除0无定义，不是得到另一个等价方程。单改左侧，2x=0变${near ? '4x=0' : '6x=0'}仍唯一0，但2x=4变${near ? '4x=4根1' : '6x=4根2/3'}而原根2，反例否证普遍规则。x=0中x可零，除x在原解处无定义、会丢零解；须另保零分支，不能套已知非零常数规则。`,
    `For B, ${near ? 'subtract 3x, add two to both sides: 4x=6; divide by four for 3/2' : 'add 5x and subtract three on both sides: −1=7x; divide by seven for −1/7'}. Both original sides give ${near ? '17/2' : '19/7'}. Every step has an inverse. Multiplying by −1/2 yields ${near ? '−(7/2)x+1=−(3/2)x−2' : '(5/2)x−1=−x−3/2'}, retaining the root; multiplication by −2 restores B. Multiplying by zero is defined but produces identity 0=0, admitting x=0 despite original ${near ? '−2≠4' : '2≠3'}, so it is irreversible. Division by zero is undefined. Changing only the left makes 2x=0 into ${near ? '4x=0' : '6x=0'}, still uniquely zero, but changes 2x=4 into ${near ? '4x=4 with root one' : '6x=4 with root 2/3'} rather than original root two. That counterexample refutes the general rule. In x=0, dividing by x is undefined at the original root and loses it; retain the zero branch instead of treating x as a known nonzero constant.`,
    '先分清是两边同做还是只动一边；把操作本身的定义、一般可逆规则和这个方程的实际解集分别核。',
    'Separate both-side actions from one-sided changes. Check whether the operation is defined, whether its rule is generally reversible and what this equation’s actual solution set is.',
  );
  table(q2, [['B', '原方程B', 'Original equation B', base]]);

  const bracket = near ? '(−1/2)(4x−6)=x+1' : '(−2/3)(3x+6)=2x−1',
    wrong = near ? '−2x−6=x+1' : '−2x+6=2x−1';
  const q3 = card(
    3,
    'bracket-linear-equations',
    '① 画外部因子到原K括号内每个完整带符号项的连线，写每一乘积与等值展开。单独负号相当于什么因子？分数或负数改变逐项规则吗？② 用可逆两边同做求精确解，分别代回原带括号两侧；解释等值展开与同时改变等号两边是怎样不同的步骤。③ 另有人从K写出W，先解W再把其候选代回原K左右，找具体不等值；指出漏乘的对象和错误原因，不因W自身算对便接受原题解。',
    '① DRAW connections from the outside factor to EVERY complete signed term in original K, recording each product and an equivalent expansion. What factor does a lone minus mean? Do negative/fractional factors change the term-by-term rule? ② Solve using reversible both-side operations and substitute into BOTH ORIGINAL bracketed sides. Distinguish an identity expansion within a side from performing the same action on both sides. ③ Someone replaces K by W. Solve W, then evaluate its candidate in both ORIGINAL K sides to give a concrete failure. Identify the term that missed its factor; solving W correctly does not solve K.',
    `外因子${near ? '−1/2' : '−2/3'}乘每项，展开${near ? '−2x+3=x+1' : '−2x−4=2x−1'}；单负为−1，常数也乘。可逆解x=${near ? '2/3' : '−3/4'}，原两侧均${near ? '5/3' : '−5/2'}，不舍入。展开在一侧用分配律保该量不变，两边同做则同改两量保解集。W自身解${near ? '−7/3' : '7/4'}；代原K左${near ? '23/3' : '−15/2'}、右${near ? '−4/3' : '5/2'}不等。W漏给常数${near ? '−6' : '+6'}乘完整外因子，不能把其解冒充原解。`,
    `The factor ${near ? '−1/2' : '−2/3'} multiplies EVERY term, giving ${near ? '−2x+3=x+1' : '−2x−4=2x−1'}. A lone minus is −1; constants receive the factor too. Reversible solving gives x=${near ? '2/3' : '−3/4'}, with both original sides ${near ? '5/3' : '−5/2'}, without rounding. Identity expansion preserves one side’s value; equal reversible actions change both sides while preserving the solution set. W has root ${near ? '−7/3' : '7/4'}, but its candidate gives original K sides ${near ? '23/3 and −4/3' : '−15/2 and 5/2'}, unequal. W failed to multiply the signed constant ${near ? '−6' : '+6'} by the full outside factor.`,
    '连线要包括常数和它的原符号；检验使用最初带括号的方程，不只查中间式。',
    'Include the constant and its original sign in the connections. Check the initial bracketed equation rather than only an intermediate one.',
  );
  table(q3, [
    ['K', '原带括号方程', 'Original bracket equation', bracket],
    ['W', '待检错误中间式', 'Proposed incorrect intermediate equation', wrong],
  ]);

  const gap = near ? 7 : 5,
    total = near ? 30 : 26,
    futureGap = near ? 8 : 11,
    years = near ? 3 : 4,
    perBag = near ? 4 : 6,
    lengthRate = near ? 3 : 6,
    lengthTotal = near ? 2 : 1;
  const q4 = card(
    4,
    'original-quantity-modelling',
    `各行互不相关，所有年龄是精确年龄而非“已满整岁”。① 对A定义较小年龄x、单位和域，写原较小/较大年龄及总量等式，再求两人的精确年龄，检差与和；若把较小年龄舍成${near ? '12' : '11'}，保原年龄差后还能满足总量吗？另对F写现在/未来两人年龄、原倍数关系并求解，为什么两人都加同样年数且倍数作用于完整未来年龄？② 对B定义完整包数，先交原数量等式再解，分别判等式与整包域；舍成${near ? '4' : '3'}包会有几张？明确把总量另改${near ? '18' : '20'}张才能给新的整数解，不能悄改原17张。③ 分别为L/T/Z/P建原式、求精确候选、代回原式再筛允许域。负数/分数/零是否一律不可用？长度写cm；近似${near ? '0.67' : '0.17'}是否精确合原总长？④ 自己另造一组不同的“精确分数年龄可行”与“整包不可行”条件，给原等式、精确解、两关和舍入反例；可纸笔口述，不用真实个人资料。`,
    `Rows are unrelated; ages are EXACT ages, not completed whole years. ① For A define younger age x, units and domain, write both original ages and the original total equation, then solve and check difference/total. Round the younger age to ${near ? '12' : '11'} while retaining the gap: does the original total still hold? Separately for F write both current/future ages and the ORIGINAL multiple relationship, solve, and explain why both ages advance equally and the multiple applies to a WHOLE future age. ② For B define whole-pack count and give the ORIGINAL quantity equation before solving. Check equality and domain separately. How many cards result after rounding to ${near ? 'four' : 'three'} packs? Explicitly change the total to ${near ? '18' : '20'} for a NEW integer-solution problem; do not silently repair the original 17. ③ Independently model L,T,Z,P, solve exactly, check each ORIGINAL relation, then its domain. Are negatives, fractions or zero always forbidden? Give length in cm and check rounded trial ${near ? '0.67' : '0.17'} against the ORIGINAL total. ④ Invent a DIFFERENT pair of conditions: feasible fractional exact ages and impossible whole packs. Supply original equations, exact roots, both checks and a rounding counterexample. Paper/oral work suffices; no real personal data.`,
    `A原x+(x+${gap})=${total}，x非负有理，较小${near ? '23/2' : '21/2'}岁、较大${near ? '37/2' : '31/2'}岁；差${gap}和${total}均对。舍较小为${near ? '12' : '11'}后另人为${near ? '19' : '16'}，总${near ? '31' : '27'}违原条件。F原x+${futureGap}+${years}=2(x+${years})，当前${near ? '5岁与13' : '7岁与18'}岁，未来${near ? '8岁与16' : '11岁与22'}岁，两人同过${years}年且整段未来年龄被倍乘。B为${perBag}x+2=17，x非负整数，代数根${near ? '15/4' : '5/2'}满足等式但非整包，情境无解；舍${near ? '4' : '3'}给${near ? '18' : '20'}张不等17，新总${near ? '18' : '20'}才根${near ? '4' : '3'}。L为${lengthRate}x=${lengthTotal}，x>0，${near ? '2/3' : '1/6'}cm可行；近似乘回${near ? '2.01' : '1.02'}cm不精确等原${lengthTotal}cm。T为x+${near ? '7=3' : '9=2'}得${near ? '−4' : '−7'}°C允许有理负温；Z为${near ? '4' : '5'}x=0，非负整件唯一0可行；P为${near ? '2x+7=5' : '3x+4=1'}代数根−1通过原式却违非负价格。自创可例如年龄差2总5得3/2与7/2岁可行，2x+2=5整包根3/2不可行，舍2包总6违5；接受其他正确且确有不同条件的构造。原式可展开或交换两侧但保量来源；求解另用可逆移项，不能只交解值代模型。`,
    `A: x+(x+${gap})=${total}, with nonnegative rational x. Exact ages ${near ? '23/2 and 37/2' : '21/2 and 31/2'} years satisfy gap ${gap} and total ${total}. Rounding younger to ${near ? '12' : '11'} gives older ${near ? '19' : '16'} and wrong total ${near ? '31' : '27'}. F: x+${futureGap}+${years}=2(x+${years}); current ages ${near ? '5 and 13' : '7 and 18'}, future ages ${near ? '8 and 16' : '11 and 22'}. Both advance ${years} years and the WHOLE younger future age is doubled. B: ${perBag}x+2=17, nonnegative integer x. Algebraic root ${near ? '15/4' : '5/2'} passes equality but fails whole packs; there is no contextual solution. Rounding to ${near ? 'four' : 'three'} gives ${near ? '18' : '20'} rather than 17 cards; explicitly changing the total creates a DIFFERENT problem. L: ${lengthRate}x=${lengthTotal}, x>0, gives valid ${near ? '2/3' : '1/6'} cm; rounded trial yields ${near ? '2.01' : '1.02'} cm, not original ${lengthTotal} cm. T: x+${near ? '7=3' : '9=2'} gives allowed ${near ? '−4' : '−7'}°C. Z: ${near ? '4' : '5'}x=0 with nonnegative integer x admits the unique zero. P: ${near ? '2x+7=5' : '3x+4=1'} has algebraic root −1 satisfying the original equality but failing nonnegative price. A different constructed pair could use age gap two and total five for valid ages 3/2 and 7/2, versus 2x+2=5 with impossible whole-pack root 3/2; rounding to two packs gives six, not five. Accept other correct constructions with different conditions. Original models may be expanded or reversed while retaining quantity sources; solving then permits reversible transposition. A root alone is not the requested model.`,
    '先逐情境定义x、单位和允许值，再写原两量等式；把模型、可逆求解、原式检验、情境筛选四步分别保留。',
    'Define x, units and allowed values separately for each context, then equate original quantities. Retain four distinct stages: model, reversible solving, original check and domain filtering.',
  );
  table(q4, [
    [
      'A',
      '精确年龄差与和',
      'Exact age difference and total',
      `差${gap}岁，总${total}岁；精确年龄可非负有理`,
      `Gap ${gap} years; total ${total} years; exact ages may be nonnegative rational`,
    ],
    [
      'F',
      '独立未来年龄',
      'Separate future ages',
      `现在相差${futureGap}岁；${years}年后较大者为较小者两倍`,
      `Current gap ${futureGap} years; in ${years} years older age is twice younger age`,
    ],
    [
      'B',
      '完整包与固定散卡',
      'Whole packs and fixed extra cards',
      `每包${perBag}张，另2张，共17张；包数非负整数`,
      `${perBag} cards per whole pack plus two extras, total 17; nonnegative integer packs`,
    ],
    [
      'L',
      '连续正长度',
      'Continuous positive length',
      `${lengthRate}段等长合${lengthTotal}cm；每段长度正有理`,
      `${lengthRate} equal pieces total ${lengthTotal} cm; positive rational length per piece`,
    ],
    [
      'T',
      '温度变化',
      'Temperature change',
      `升${near ? 7 : 9}°C后为${near ? 3 : 2}°C；原温度可有理负数`,
      `After rising ${near ? 7 : 9}°C the reading is ${near ? 3 : 2}°C; initial rational temperature may be negative`,
    ],
    [
      'Z',
      '零总量完整组',
      'Zero-total whole groups',
      `每组${near ? 4 : 5}张，共0张；组数非负整数`,
      `${near ? 4 : 5} cards per group, total zero; nonnegative integer groups`,
    ],
    [
      'P',
      '非负价格',
      'Nonnegative price',
      `每份价格x NZD；${near ? '2份加固定7共5' : '3份加固定4共1'} NZD；x≥0`,
      `Price x NZD per portion; ${near ? 'two portions plus fixed seven total five' : 'three portions plus fixed four total one'} NZD; x≥0`,
    ],
  ]);
  return {
    id: `${unit}-MAINT-LINEAR-MEANING`,
    unit,
    title: t(
      '方程原关系、可逆步骤与两道检验',
      'Original equations, reversible steps and two validity checks',
    ),
    bridge: 'J73-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 5].map((l, i) => [id(i + 1), `J73-L0${l}`]),
    ),
    intro: t(
      '四张纸笔卡，每次一个分问或一个情境，可分多次、不计时。第4卡同时复现原数量建模与情境筛选；常数分母原任务继续保留。先写过程和解释，再人审；允许口述/熟悉语言，读题协助与数学提示分开。条件虚构，不用购买、实测或真实年龄。',
      'Four paper cards: one part or context per untimed sitting, across as many sittings as needed. Card four checks both original modelling and contextual filtering; existing constant-denominator tasks remain. Construct working and explanations before human review. Oral/familiar-language responses are welcome; separate reading help from mathematical hints. Fictional conditions need no purchases, measurement or real ages.',
    ),
    questions: [q1, q2, q3, q4],
  };
};
export const linearMeaningRetrieval = {
  J83_LINEAR_MEANING: makeSet('J83'),
  J92_LINEAR_MEANING: makeSet('J92'),
};
