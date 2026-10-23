import { t } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'H33' | 'H34') => {
  const first = unit === 'H33',
    id = (i: number) => `${unit}-MAINT-COUNTING-STRUCTURE-Q${i}`;
  const q = (
    i: number,
    skill: number,
    z: string,
    en: string,
    sz: string,
    se: string,
    hz: string,
    he: string,
  ) =>
    reasoning(id(i), t(z, en), `counting-${skill}`, t(sz, se), [
      t(hz, he),
      t(
        '先定义一个完整结果、身份、顺序、重复与概率模型；互斥求和，条件概率先圈分母，普通条件比要求条件概率为正。',
        'Define complete outcomes,identity,order,repetition and the probability model first. Sum disjoint events,identify the conditioning denominator,and require positive conditioning probability for an ordinary conditional ratio.',
      ),
    ]);
  const cells = first ? [4, 2, 3, 3] : [6, 3, 2, 9],
    [ab, ao, bo, neither] = cells as [number, number, number, number];
  const table = {
    caption: t(
      '给定虚构等可能编号的四格计数；每编号只入一格',
      'Given fictional equally likely ID counts;each ID occupies one cell',
    ),
    columns: [
      t('事件', 'Event'),
      t('B内', 'In B'),
      t('B外', 'Outside B'),
      t('行合计', 'Row total'),
    ],
    rows: [
      [
        t('A内', 'In A'),
        t(String(ab), String(ab)),
        t(String(ao), String(ao)),
        t(String(ab + ao), String(ab + ao)),
      ],
      [
        t('A外', 'Outside A'),
        t(String(bo), String(bo)),
        t(String(neither), String(neither)),
        t(String(bo + neither), String(bo + neither)),
      ],
      [
        t('列合计', 'Column total'),
        t(String(ab + bo), String(ab + bo)),
        t(String(ao + neither), String(ao + neither)),
        t(
          String(cells.reduce((a, b) => a + b, 0)),
          String(cells.reduce((a, b) => a + b, 0)),
        ),
      ],
    ],
  };
  return {
    id: `${unit}-MAINT-COUNTING-STRUCTURE`,
    unit,
    bridge: 'H24-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 4, 5, 6].map((l, i) => [id(i + 1), `H24-L0${l}`]),
    ),
    title: t(
      '分布与推断之后，再核计数和条件空间',
      'After distributions and inference,recheck counting and conditional spaces',
    ),
    intro: t(
      '五题分次；第二题同时回看排列与组合，必要时拆两次并回H24-L03。允许纸笔列表，全部人工核验、不计时。包装和编号均为给定虚构模型，不是真实观测。',
      'Choose one of five tasks per sitting. Task two revisits permutations and combinations;split it and revisit H24-L03 if useful. Use paper lists. Every task is human-reviewed without a timer. Packages and IDs are fictional model givens,not observations.',
    ),
    questions: [
      q(
        1,
        1,
        `类别${first ? '{A,B,C,D}与{C,D,E}' : '{Q,R,S,T}与{S,T,U}'}中任选一个不同编号，列完整并集并修复“4+3种”。再做两步选择，首步${first ? '1,2,3' : '1,2,3,4'}、次步${first ? '1,2,3,4' : '1,2,3'}，只许次步数大于首步数，逐支列全部合法有序对。为何不能机械相乘？一般分支数n_i如何求总数，什么时候可用乘法？计数规则是否自动保证等可能？`,
        `Choose one distinct ID from${first ? '{A,B,C,D} or {C,D,E}' : '{Q,R,S,T} or {S,T,U}'}. List the full union and repair “4+3 outcomes”. Then choose first from${first ? '1,2,3' : '1,2,3,4'} and second from${first ? '1,2,3,4' : '1,2,3'},requiring second>first. List all legal ordered pairs by branch. Why does direct multiplication fail? Give the general branch-count sum and the condition for a constant product. Do counting rules themselves guarantee equal probabilities?`,
        `${first ? '并集A,B,C,D,E，C,D重计，所以4+3−2=5。合法对(1,2),(1,3),(1,4),(2,3),(2,4),(3,4)，分支3+2+1=6，不是12。' : '并集Q,R,S,T,U，S,T重计，4+3−2=5。合法对(1,2),(1,3),(2,3)，分支2+1+0+0=3，不是12。'}每个完整结果只计一次。一般互斥首步的后续合法数为n_i，总数∑n_i；若每支都恰m种才可写首步数×m。阶段概率可以依赖，乘法计数本身不要求概率独立，也不使结果等可能；要用“有利数/总数”必须另给等可能模型。`,
        `${first ? 'The union is A,B,C,D,E. C,D were counted twice,so4+3−2=5. Legal pairs are(1,2),(1,3),(1,4),(2,3),(2,4),(3,4):branch counts3+2+1=6,not12.' : 'The union is Q,R,S,T,U. S,T were counted twice,so4+3−2=5. Legal pairs are(1,2),(1,3),(2,3):branch counts2+1+0+0=3,not12.'} Each complete outcome is counted once. Disjoint first-step branches with n_i legal continuations give total∑n_i;only constant m per branch gives number-of-first-choices times m. Counting does not require probability independence or create equiprobability. Favourable/total counts need a separately justified equally likely model.`,
        '先写一个完整有序对，再逐首步列合法次步；类别重复与受限分支是两种问题。',
        'Write a complete ordered pair,then list legal continuations per first step. Overlapping identities and restricted branches are different issues.',
      ),
      q(
        2,
        2,
        `${first ? '4名A,B,C,D' : '5名A,B,C,D,E'}不同成员选3位，分别任三个不同职位与同权成组，各多少结果？对其中一组列全6种有序表示，证明每组同倍数再除3!。允许职位重复用人后还能除3!得到同权结果吗，以AAA、AAB、ABC的表示次数反驳。再用实体卡A1,A2,B1选2张对比“按实体身份”与“只看字母”两种结果；保留选0位与选多于人数的边界。`,
        `Select three from${first ? 'four distinct members A,B,C,D' : 'five distinct members A,B,C,D,E'},first for three distinct roles and then as an equal-status group. Count each. List all six orders for one group and prove every group has that same multiplicity before dividing by3!. If roles may repeat a person,may the ordered count still be divided by3!? Compare multiplicities of AAA,AAB,ABC. Also select two physical cards A1,A2,B1,distinguishing physical identities from displayed letters. Handle zero selections and selecting more distinct members than available.`,
        `${first ? '有序4×3×2=24，同权24/6=4组。' : '有序5×4×3=60，同权60/6=10组。'}ABC组有ABC,ACB,BAC,BCA,CAB,CBA六序；任意三个不同人都与这六序一一对应，故P(n,3)=C(n,3)3!。若可重复，AAA只1序、AAB3序、ABC6序，不同组倍数不恒定，不能将n³一概除6。三实体卡无放回选2，实体有序6、同权3组；若只看字母，有序字符串AA,AB,BA共3，同权字母多重集AA,AB共2，AA只有1个显示次序而AB有2个，除2失效。实体A1与A2仍不同，须先声明按哪个身份计。选0位恰一个空列表/空组，P(n,0)=C(n,0)=0!=1；不重复选r>n为0，不是给无效阶乘。`,
        `${first ? 'Role assignments number4×3×2=24;equal-status groups24/6=4.' : 'Role assignments number5×4×3=60;equal-status groups60/6=10.'} Group ABC has orders ABC,ACB,BAC,BCA,CAB,CBA. Every three-distinct-member group has the same six-order bijection,so P(n,3)=C(n,3)3!. With repetition,AAA has one order,AAB three and ABC six;dividing n³ uniformly by six fails. The three physical cards yield six ordered selections and three unordered physical pairs. If only letters matter,the ordered strings are AA,AB,BA and unordered multisets AA,AB. AA has one displayed order while AB has two,so division by two fails. State which identity counts. Zero selections give one empty list/group,P(n,0)=C(n,0)=0!=1. Without repetition,r>n gives zero,not an invalid factorial expression.`,
        '只有每个目标结果恰有同样多个有序表示，统一除法才有效；允许重复会改变倍数。',
        'Uniform division needs the same number of ordered representations for every target outcome. Repetition changes multiplicities.',
      ),
      q(
        3,
        4,
        `${first ? '5' : '6'}次独立公平硬币按正面数归组，给完整理论分布及恰${first ? 2 : 3}正的概率，解释为何不是${first ? '1/6' : '1/7'}。通过是否选最后位置证明${first ? 'C(5,2)=C(4,1)+C(4,2)' : 'C(6,3)=C(5,2)+C(5,3)'}；再由因子位置选择求${first ? '(x−2y)^5中x³y²' : '(x−y)^6中x³y³'}系数，保系数符号。若硬币有偏或试次相依，计数与等概率哪一部分仍成立？有限模拟频率必须等理论吗？`,
        `Group${first ? 5 : 6} independent fair coin flips by head count. Give the complete theoretical distribution and probability of exactly${first ? 2 : 3} heads;why not${first ? '1/6' : '1/7'}? Prove${first ? 'C(5,2)=C(4,1)+C(4,2)' : 'C(6,3)=C(5,2)+C(5,3)'} by including/excluding the last position. Find the coefficient of${first ? 'x³y² in(x−2y)^5' : 'x³y³ in(x−y)^6'} by choosing factor positions,including signs. Which counting/equiprobability claims survive bias or dependence? Must finite simulation frequencies equal theory?`,
        `${first ? '32个等可能有序串，正面数0..5的串数1,5,10,10,5,1，概率各除32；恰2正10/32=5/16，非1/6。末位置选入有C(4,1)=4、不选C(4,2)=6，互斥且穷尽得10。系数C(5,2)(−2)²=40。' : '64个等可能有序串，正面数0..6的串数1,6,15,20,15,6,1，概率各除64；恰3正20/64=5/16，非1/7。末位置选入C(5,2)=10，不选C(5,3)=10，共20。系数C(6,3)(−1)³=−20。'}一般C(n,k)=C(n−1,k−1)+C(n−1,k)，适用1≤k≤n−1；位置子集数是计数结论，不须概率前提。若独立同p，恰k正每条概率p^k(1−p)^(n−k)，乘C(n,k)；只有公平独立才可每串1/2^n。相依时不能用乘积概率，相应串甚至可能零概率；代数展开仍由因子选择成立。有限模拟是频率，会波动，不证明独立或必须恰等理论。`,
        `${first ? 'There are32 equally likely ordered strings;head counts0..5 have multiplicities1,5,10,10,5,1,each divided by32. Exactly two has10/32=5/16,not1/6. Including the final position gives C(4,1)=4;excluding gives C(4,2)=6,total ten. The expansion coefficient is C(5,2)(−2)²=40.' : 'There are64 equally likely strings;head counts0..6 have multiplicities1,6,15,20,15,6,1,each divided by64. Exactly three has20/64=5/16,not1/7. Including/excluding the final position gives C(5,2)+C(5,3)=10+10=20. The coefficient is C(6,3)(−1)³=−20.'} Generally Pascal’s identity applies for1≤k≤n−1 and is a counting statement. Independent constant-p trials give each k-head string probability p^k(1−p)^(n−k);only fair independent trials give1/2^n per string. Dependence invalidates product probabilities and may make strings impossible. The algebraic expansion still follows factor-position choices. Finite frequencies fluctuate and neither certify independence nor have to equal theory.`,
        '先保每个有序串，再按计数合并；展开式选位置还要乘被选项的系数幂。',
        'Keep ordered strings before grouping counts. In an expansion,multiply position counts by the selected coefficient’s power.',
      ),
      {
        ...q(
          4,
          5,
          '表中每个编号等可能，四格互斥且穷尽。求P(A)、P(A∩B)、P(A|B)、P(B|A)，圈出各分母；用乘积判据审查独立。交集相同为何两方向未必相同？另给四格(0,2,0,4)，已知B时为何不能填0？若编号本不等可能，仅这些计数够吗？',
          'Every ID in the table is equally likely and the four cells are disjoint/exhaustive. Find P(A),P(A∩B),P(A|B),P(B|A),identifying each denominator. Test independence by products. Why can conditioning directions differ despite the same intersection? For cells(0,2,0,4),why is conditioning on B not a zero probability answer? If IDs are not equally likely,do counts suffice?',
          `${first ? '总数12，A6、B7、交集4；P(A)=1/2，P(A∩B)=1/3，P(A|B)=4/7，P(B|A)=2/3。乘积P(A)P(B)=7/24≠1/3，非独立。' : '总数20，A9、B8、交集6；P(A)=9/20，交集3/10，P(A|B)=3/4，P(B|A)=2/3。乘积9/50≠3/10，非独立。'}条件更换分母A或B，交集分子相同不足以令比值相同。四格(0,2,0,4)中B的计数为0、交集0，普通P(A|B)=0/0未定义，不是0；若条件有正概率但交集空，比值才0。不等可能ID须加相应概率质量，不能直接用人数占比替代概率。`,
          `${first ? 'Total12,A6,B7,intersection four give P(A)=1/2,P(A∩B)=1/3,P(A|B)=4/7,P(B|A)=2/3. Product P(A)P(B)=7/24 differs from1/3,so events are not independent.' : 'Total20,A9,B8,intersection six give P(A)=9/20,P(A∩B)=3/10,P(A|B)=3/4,P(B|A)=2/3. Product9/50 differs from3/10,so events are not independent.'} Reversing the condition changes its denominator;the same numerator does not force equal ratios. Cells(0,2,0,4) give empty B and0/0,undefined rather than zero. A positive conditioning mass with empty intersection would give zero. Unequal ID probabilities require summing probability masses;counts alone do not suffice.`,
          '先圈已知条件的行或列，再在其中找交集；概率乘积判据不等于条件倒读。',
          'Circle the conditioned row/column before its intersection. Independence by products does not reverse conditional probabilities.',
        ),
        contextTable: table,
      },
      q(
        5,
        6,
        `给1000份虚构包装的模型质量，来源A占${first ? 10 : 20}%，标记F在A/非A的条件率${first ? '60%/20%' : '75%/25%'}。给两来源的标记质量及P(A|F)，比较A占比改${first ? 50 : 60}%而条件率不变的结果。再把两来源标记率都改30%，用乘积判据说明独立并核反向概率；如果A概率0或两标记率都0，独立与普通条件比哪些仍可说？不要把模型质量写实际观测或把F判为来源证明。`,
        `In a fictional 1000-package probability-mass model,A has prior${first ? 10 : 20}% and F rates${first ? '60%/20%' : '75%/25%'} in A/non-A. Give marked masses and P(A|F). Change A’s prior to${first ? 50 : 60}% while retaining rates and compare. Then set both marking rates to30%;use the product definition to establish independence and recover the posterior. What remains valid if P(A)=0 or both marking rates vanish? These are model masses,not observations,and F does not prove a source.`,
        `${first ? '先验10%时A100中60标记，其余900中180标记，反向60/240=1/4；改50%时300与100标记，反向300/400=3/4。' : '先验20%时A200中150标记，其余800中200标记，反向150/350=3/7；改60%时450与100标记，反向450/550=9/11。'}同似然不同先验改变标记群的构成，不能倒读P(F|A)。两来源率均0.3且0<P(A)<1时P(F)=0.3、P(A∩F)=0.3P(A)=P(A)P(F)，故独立，P(A|F)=P(A)。一般P(A)=0时乘积定义仍独立，但P(F|A)普通比未定义；若两标记率0则P(F)=0、仍按乘积独立，而P(A|F)未定义。条件式独立的等价说法须条件概率正，零分母不能填0。`,
        `${first ? 'With prior10%,A has100 units and60 marked;non-A has900 and180 marked. Posterior60/240=1/4. At50%,marked masses300 and100 give300/400=3/4.' : 'At20%,marked masses150 and200 give150/350=3/7. At60%,masses450 and100 give450/550=9/11.'} Equal likelihoods across the two prior scenarios do not give equal posteriors. If both source rates are0.3 and0<P(A)<1,then P(F)=0.3 and P(A∩F)=0.3P(A)=P(A)P(F),so independence gives P(A|F)=P(A). At P(A)=0,product independence still holds but ordinary P(F|A) is undefined. If both marking rates vanish,F has zero mass:product independence still holds while P(A|F) is undefined. Conditional formulations require positive denominators;undefined is not zero.`,
        '来源先分支，再将各支标记质量相加作新分母；基础占比也参与反向概率。',
        'Branch by source,then sum marked masses for the new denominator. Prior source proportions participate in the posterior.',
      ),
    ],
  };
};
export const countingStructureRetrieval = {
  H33_COUNTING: makeSet('H33'),
  H34_COUNTING: makeSet('H34'),
};
