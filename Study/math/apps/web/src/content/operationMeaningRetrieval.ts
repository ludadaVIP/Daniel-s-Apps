import { t } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'B06' | 'P51') => {
  const first = unit === 'B06',
    id = (n: number) => unit + '-MAINT-OPERATIONS-Q' + n;
  const a = first ? 14 : 18,
    b = first ? 6 : 7,
    whole = first ? 31 : 40,
    known = first ? 9 : 13;
  const g = first ? 4 : 5,
    size = first ? 6 : 7,
    unequal = first ? [2, 4, 7] : [3, 5, 9];
  const n = first ? 29 : 38,
    d = first ? 6 : 7,
    exact = first ? 30 : 35;
  const fg = first ? 3 : 4,
    fs = first ? 7 : 8,
    square = first ? 3 : 5;
  const mk = (
    i: number,
    skill: string,
    z: string,
    en: string,
    sz: string,
    se: string,
    hz: string,
    he: string,
  ) =>
    reasoning(id(i), t(z, en), skill, t(sz, se), [
      t(hz, he),
      t(
        '先在纸上画图，写出算式、数量角色与单位，再逐小问核验；一个得数或关键词不能替代完整解释。',
        'Draw diagrams and write equations, quantity roles and units on paper before checking EACH subpart; one result or keyword cannot replace the complete explanation.',
      ),
    ]);
  const q1 = mk(
    1,
    'part-whole-operation',
    '表中A–D是四个互相独立的纸卡故事，每张卡代表一个单位。逐行指出整体、部分或两个被比较的量，写出算式、答案及反查式。B与C即使减法相同，实际发生的事相同吗？请画“拿走”与“同起点比较”的两种图；D的整体已经包含已知部分，能再把已知部分加一次吗？另从原A开始，仅把新增量增加1，先预测再核总量怎样变。读题时的“多”能替代数量角色吗？',
    'Rows A–D are FOUR INDEPENDENT card stories, with one card per unit. For each, identify the whole/parts or the two compared amounts, then generate an equation, answer and inverse check. Even if B and C use the same subtraction, did the same physical event occur? Draw a removal model and an aligned comparison model. D’s whole already contains its known part: may that part be added again? Separately restart from original A and increase ONLY the added amount by one; predict then check the total change. Can the word “more” replace identifying quantity roles?',
    first
      ? 'A合并14+6=20卡，反查20−6=14。B拿走14−6=8卡，8+6=14；C差14−6=8卡，6+8=14，甲乙仍有14和6，没有移动卡，合计是20而非8。D缺31−9=22卡，9+22=31，31已含9，31+9重复计数。原A的新增从6变7，总量14+7=21，只比原合计多1。图须区分划去的部分与两组未配对的差。'
      : 'A合并18+7=25卡，25−7=18。B拿走18−7=11卡，11+7=18；C差18−7=11卡，7+11=18，两个原组仍18和7，合计25不是差11。D缺40−13=27卡，13+27=40，40已含13，不能重复加。原A新增7变8，总量18+8=26，比原25仅多1。拿走图需划去，比较图保留两组、对齐并标差。',
    first
      ? 'A: 14+6=20 cards, checked by 20−6=14. B: 14−6=8 cards remain, checked by 8+6=14. C: difference 14−6=8 cards, checked by 6+8=14; BOTH original groups remain 14 and six, with combined total twenty rather than eight. D: 31−9=22 missing cards, checked by 9+22=31; adding nine to thirty-one double-counts. Restarting A with added amount seven gives 14+7=21, exactly one above twenty. Draw crossing marks for removal but retain both groups and mark unmatched difference for comparison.'
      : 'A: 18+7=25 cards, checked by 25−7=18. B: 18−7=11 remain, checked by 11+7=18. C: difference 18−7=11, checked by 7+11=18; original groups remain eighteen and seven, with combined total twenty-five rather than eleven. D: 40−13=27 missing cards, checked by 13+27=40; thirteen is already included. Restarting A with added amount eight gives 18+8=26, one above twenty-five. A removal diagram crosses objects out; a comparison diagram retains and aligns both groups.',
    '先说题目求合计、剩下、差距还是缺少部分；相同减法可能回答不同故事。',
    'First name the unknown: combined total, remainder after removal, difference or missing part. The same subtraction may describe different stories.',
  );
  q1.contextTable = {
    caption: t(
      '四个独立虚构故事的原始给定；不要把上一行答案带入下一行。',
      'Original givens for FOUR separate fictional stories; do not import the preceding answer.',
    ),
    columns: [
      t('故事', 'Story'),
      t('已知关系', 'Given relationship'),
      t('未知量', 'Unknown'),
    ],
    rows: [
      [
        t('A', 'A'),
        t(
          '原有' + a + '张，再收到' + b + '张',
          'Start with ' + a + ' cards; receive ' + b + ' more',
        ),
        t('现在合计', 'Total now'),
      ],
      [
        t('B', 'B'),
        t(
          '原有' + a + '张，取走' + b + '张',
          'Start with ' + a + ' cards; remove ' + b,
        ),
        t('剩下', 'Remaining'),
      ],
      [
        t('C', 'C'),
        t(
          '甲有' + a + '张，乙有' + b + '张，两组不动',
          'Group X has ' + a + ', group Y has ' + b + '; neither is moved',
        ),
        t('甲比乙多几张', 'How many more in X?'),
      ],
      [
        t('D', 'D'),
        t(
          '合计' + whole + '张，其中' + known + '张红卡',
          'Whole ' + whole + ' cards includes ' + known + ' red cards',
        ),
        t('非红卡数', 'Non-red count'),
      ],
    ],
  };
  const q2 = mk(
    2,
    'equal-groups-array',
    '按表中E画等组和阵列，分别用重复加法、按行乘法、按列乘法算出同一总量；每个因数的数量角色和单位是什么？若只把组数与每组量相加，会漏掉什么，为什么不是两个物体部分相加？换行列后总量相同，能说装袋方式完全相同吗？U1–U3是另一个不等组故事：先检查能否说“三组每组都' +
      unequal[1] +
      '个”，再按实际量求总数并修正。分别画Z1零组但每组预定' +
      size +
      '个、Z2有' +
      g +
      '组但每组0个；都为0的理由与图形一样吗？总共0个是否能唯一反推组数和每组量？',
    'Use E to DRAW equal groups and an array. Generate its total by repeated addition, row multiplication and column multiplication, naming each factor’s role and unit. Why does merely adding group count and amount per group miss repeated copies, and why are they not TWO object parts? Does equal total after swapping rows/columns mean identical packing arrangements? U1–U3 form a SEPARATE unequal-group story: audit the claim “three groups EACH contain ' +
      unequal[1] +
      '”, then sum actual amounts and repair it. Draw Z1 with ZERO groups but planned size ' +
      size +
      ', and Z2 with ' +
      g +
      ' groups containing ZERO each. Explain equal zero totals but different pictures. Does a zero total uniquely identify group count and amount per group?',
    first
      ? 'E是4组各6个，6+6+6+6=4×6=24，按列6×4=24；4+6=10把组数与每组量误作两物体部分，没数全各组。组数/每组物体数互换，物体总数不变，不是袋数与每袋量原封不动。U实际2+4+7=13；3×4=12，三组并不都4个。Z1为0×6=0，没有组；Z2为4×0=0，有4个空框。两个0不唯一识别两个因数，不能把6当已存在的一组。'
      : 'E是5组各7个，7+7+7+7+7=5×7=35，按列7×5=35；5+7=12把组数和每组量当成两物体部分，没有数全各组。同总量但行列/装袋角色变。不等组3+5+9=17，3×5=15不能替代实际数量。Z1为0×7=0，没有组；Z2为5×0=0，5个空框。零总量不能唯一决定分组，不能因为有“每组7”就创造一组。',
    first
      ? 'E: 6+6+6+6=4×6=24 objects; column counting gives 6×4=24. Adding 4+6=10 fails to count repeated groups: these are not two object parts. Group count and amount per group exchange roles while object total stays fixed; packing roles need not stay identical. U: 2+4+7=13, whereas 3×4=12; the three amounts are NOT equal. Z1: 0×6=0 with no groups. Z2: 4×0=0 with four empty outlines. The same zero total does not identify both factors; planned size six does not create an existing group.'
      : 'E: 7+7+7+7+7=5×7=35 objects; column counting gives 7×5=35. Adding 5+7=12 fails to count repeated groups: these are not two object parts. Same total does not preserve grouping roles. U: 3+5+9=17, whereas 3×5=15; there is no common amount five. Z1: 0×7=0 with no groups. Z2: 5×0=0 with five empty outlines. Zero total does not identify the grouping; “seven per group” does not imply a group exists.',
    '先检每组是否真相同，再把每行和每列的数量角色分别写出。',
    'Check whether group amounts really match, then label row and column roles separately.',
  );
  q2.contextTable = {
    caption: t(
      'E、U、Z1、Z2互相独立；U1–U3属于同一个不等组故事。仅列原始数量，不列所求总数。',
      'E, U, Z1 and Z2 are separate; U1–U3 belong to ONE unequal-group story. Only source counts are given, not requested totals.',
    ),
    columns: [
      t('场景', 'Case'),
      t('组数', 'Groups'),
      t('每组物体数', 'Objects per group'),
    ],
    rows: [
      ['E', String(g), String(size)],
      ['U1', '1', String(unequal[0])],
      ['U2', '1', String(unequal[1])],
      ['U3', '1', String(unequal[2])],
      ['Z1', '0', String(size)],
      ['Z2', String(g), '0'],
    ].map((r) => r.map((s) => t(s, s))),
  };
  const q3 = mk(
    3,
    'sharing-grouping',
    '本题卡片不可拆，箱子每箱最多' +
      d +
      '张，不要求使用空箱。对表中每个总量，分别处理两个独立任务：①平均分给' +
      d +
      '人，先给每人尽可能多的完整卡，余卡另放；②按每满箱' +
      d +
      '张包装，求满箱数、余卡数，以及装下全部卡最少需要多少箱（可用0箱）。先说商与除数各在数什么，画两种图、保留箱外余量，再写“总量=除数×整数商+余数”。何时加一个未满箱，整除和零总量为何不能一律加1？另独立把' +
      n +
      ' L可分液体平均分给' +
      d +
      '人，最终每人多少L，乘回如何恢复总量？为什么不能把完整卡商当该普通除法的精确值？分给0人和总量0是一回事吗？',
    'Cards are INDIVISIBLE. Each box holds at most ' +
      d +
      ' cards and no empty box is required. For EACH total in the table, solve TWO SEPARATE tasks: (1) share among ' +
      d +
      ' people, giving the maximum equal WHOLE cards each and setting leftovers aside; (2) pack ' +
      d +
      ' per FULL box, finding full boxes, leftovers and the MINIMUM boxes holding ALL cards (zero boxes allowed). Name what divisor and quotient count, draw both models and retain outside leftovers; write total=divisor×whole quotient+remainder. When is a partly filled box added, and why not always add one for exact divisibility or zero total? SEPARATELY share ' +
      n +
      ' L of divisible liquid among ' +
      d +
      ' people: give exact litres each and multiply back. Why is the whole-card quotient not the exact ordinary numerical quotient? Are zero people and zero total the same condition?',
    first
      ? '29=6×4+5：分享为每人4张、6人、余5张；包装为4满箱、余5张，装全部最少5箱。30=6×5+0：每人5张或5满箱，全部最少5箱，不另加；0=6×0+0，每人0张、0满箱、最少0箱。余数须0≤r<6；r>0才加1箱，因r<6一箱够，r=0无需。独立液体每人29/6 L，6×(29/6)=29 L；4只是完整卡份量，不是29÷6的精确数值。0÷6=0有效，除数0不定义每人量。'
      : '38=7×5+3：每人5张、7人、余3张；5满箱、余3张，全部最少6箱。35=7×5+0：每人5张或5满箱，全部最少5箱。0=7×0+0，每人0张、0满箱、最少0箱。余数0≤r<7，r>0才加1箱，余量小于箱容量保证一箱足够；整除不多加。液体每人38/7 L，7×(38/7)=38 L；5不是38÷7的精确数值。总量0除以7有效，分给0人的除法不定义。',
    first
      ? '29=6×4+5: sharing gives FOUR cards per person with five aside; grouping gives FOUR full boxes with five aside and minimum FIVE boxes for all. 30=6×5+0: five each or five full boxes, minimum FIVE boxes. 0=6×0+0: zero each, zero full boxes, minimum ZERO boxes. Require 0≤r<6. Add one iff r>0; r<6 proves one extra box suffices. Divisible liquid gives 29/6 L each, checked by 6×(29/6)=29 L. Four is not the exact value of 29÷6. Zero total 0÷6=0 is valid; zero recipients do not define a per-person division.'
      : '38=7×5+3: sharing gives FIVE cards per person with three aside; grouping gives FIVE full boxes with three aside and minimum SIX boxes for all. 35=7×5+0: five each or five full boxes, minimum FIVE boxes. 0=7×0+0: zero each, zero full boxes, minimum ZERO boxes. Require 0≤r<7. Add one iff r>0; r<7 makes one extra box sufficient. Divisible liquid gives 38/7 L each, checked by 7×(38/7)=38 L. Five is not the exact value of 38÷7. Zero total divided by seven is valid; zero recipients do not define a per-person division.',
    '先分别标“人数”与“每箱张数”；需要放下全部时还要核箱外余量，不能直接四舍五入。',
    'Label recipients versus cards per box. To hold ALL cards, inspect outside leftovers rather than round to nearest.',
  );
  q3.contextTable = {
    caption: t(
      '三个独立卡片总量；每种总量都分别做分享与包装。液体是另外的可分情景。',
      'Three independent card totals, EACH used for sharing and packing separately. Liquid is a separate divisible-quantity scenario.',
    ),
    columns: [
      t('情景', 'Case'),
      t('卡片总量/张', 'Total cards'),
      t('人数或每箱张数', 'Recipients or cards per full box'),
    ],
    rows: [
      ['R', String(n), String(d)],
      ['D', String(exact), String(d)],
      ['Z', '0', String(d)],
    ].map((r) => r.map((s) => t(s, s))),
  };
  const q4 = mk(
    4,
    'inverse-multiplication',
    '逐行以表中“组数、每组量”求总量，并写两条乘法及所有有意义的反向除法；每条的商计什么、除数为何非零？等因数行的两条除法字面相同，还能有两种数量角色吗，必须硬凑四条不同式吗？零组、零每组、两者都零时，分别指出哪些反向式可用。用两个不同非负整数填“0×□=0”，解释为何不能从乘回结果定0÷0的唯一值；“0×□=5”能满足吗？把组数直接从总量减去为何没恢复每组量？',
    'For EACH row, use the given group count and amount per group to generate total, TWO products and ALL meaningful inverse divisions. Name each quotient’s role and why its divisor is nonzero. When equal factors give identical written division expressions, can their quantity roles still differ, and must four DISTINCT expressions be invented? Audit zero groups, zero per group and BOTH zero separately. Put TWO DIFFERENT nonnegative integers into 0×□=0 to explain why multiplying back does not identify a unique value for 0÷0. Can 0×□=5 be satisfied? Why does subtracting group count from total fail to recover amount per group?',
    first
      ? 'N：3×7=7×3=21；21÷3=7个/组，21÷7=3组。E：3×3=9，两除法同写9÷3=3，但可分别问每组量与组数，不需凑字面四式。Z1：0×6=0，仅0÷6=0组有非零除数；Z2：6×0=0，仅0÷6=0个/组合法；ZZ两因数0无合法反向除法。0×0=0、0×1=0说明不唯一，0×□=5无解，所以0÷0与5÷0都不由乘回定义。21−3=18是在减3个，不是在把21平均分3组。'
      : 'N：4×8=8×4=32；32÷4=8个/组，32÷8=4组。E：5×5=25，两反向字面式同为25÷5=5，组数与每组量仍有不同角色。Z1：0×7=0，仅0÷7=0组有效；Z2：7×0=0，仅0÷7=0个/组有效；ZZ两因数0没有合法除法。0×0与0×2都0，不能唯一反推，0×□=5无解；不能凭任意乘回结果允许除零。32−4=28是减物体，不表示4等组。',
    first
      ? 'N: 3×7=7×3=21; 21÷3=7 objects per group and 21÷7=3 groups. E: 3×3=9; both inverses are written 9÷3=3, but can ask amount per group or group count. Four DISTINCT forms are unnecessary. Z1: 0×6=0; only 0÷6=0 groups has a nonzero divisor. Z2: 6×0=0; only 0÷6=0 objects per group is valid. ZZ has no valid inverse division. Witnesses 0×0=0 and 0×1=0 show nonuniqueness, whereas 0×□=5 has no solution; neither 0÷0 nor 5÷0 is defined by multiplying back. Subtracting 21−3=18 removes three objects rather than shares twenty-one among three groups.'
      : 'N: 4×8=8×4=32; 32÷4=8 objects per group and 32÷8=4 groups. E: 5×5=25; identical written inverses 25÷5=5 can describe different quantity roles. Z1: 0×7=0; only 0÷7=0 groups is valid. Z2: 7×0=0; only 0÷7=0 objects per group is valid. ZZ has no valid inverse division. Witnesses 0×0=0 and 0×2=0 show nonuniqueness; 0×□=5 has no solution. Multiplication checks do not authorise zero divisors. Subtracting 32−4=28 removes objects rather than forms four equal groups.',
    '恢复哪个因数，就用总量除以另一个非零因数；零总量不等于零除数。',
    'Recover a factor by dividing total by the OTHER NONZERO factor. A zero total differs from a zero divisor.',
  );
  q4.contextTable = {
    caption: t(
      '五个独立组数/每组量给定；所求总量及反向式未列出。',
      'Five independent group-count/per-group givens. Requested totals and inverse expressions are not supplied.',
    ),
    columns: [
      t('案例', 'Case'),
      t('组数', 'Groups'),
      t('每组物体数', 'Objects per group'),
    ],
    rows: [
      ['N', String(fg), String(fs)],
      ['E', String(square), String(square)],
      ['Z1', '0', String(d)],
      ['Z2', String(d), '0'],
      ['ZZ', '0', '0'],
    ].map((r) => r.map((s) => t(s, s))),
  };
  const q5 = mk(
    5,
    'operation-relationship',
    'A–D是独立虚构文具卡。对每张先圈未知量，再写原数量关系、所需运算、结果单位与反向检查；A/B都有“每”，为什么不能都选乘法？C给的是每类已算总价，能把两种总价相乘吗？D能把件数直接从元数减吗？另做纸上挑战：' +
      (first
        ? '预算NZ$30，甲每件2元买4件，乙每件5元原拟买5件。'
        : '预算NZ$40，甲每件3元买6件，乙每件4元原拟买7件。') +
      '先估再算原成本与超额；固定单价及甲件数，构造一个至少买1件乙、数量为整数且预算够用的新方案，画等组并核总成本+余额=预算。允许多个有效方案；不真的购买。',
    'A–D are INDEPENDENT fictional stationery cards. Circle the unknown, then state original quantity relationship, required operation, result UNIT and inverse check. A/B both say “each”: why not multiply in both? C gives EACH category’s ALREADY-CALCULATED total cost: may those totals be multiplied? May an item count be subtracted directly from dollars in D? SEPARATE paper challenge: ' +
      (first
        ? 'budget NZ$30; item X costs two dollars, buy four; item Y costs five dollars, originally plan five.'
        : 'budget NZ$40; item X costs three dollars, buy six; item Y costs four dollars, originally plan seven.') +
      ' Estimate then calculate original cost and excess. Hold prices/X count fixed; construct an INTEGER Y count of AT LEAST ONE fitting the budget. Draw groups and check cost+balance=budget. Multiple valid plans are allowed; make no actual purchase.',
    first
      ? 'A：3×4=NZ$12，12÷4=3元/本。B：30÷5=6本，6×5=30元；“每本5”这次给每组量、求组数。C：8+7=NZ$15，15−7=8；D：25−9=NZ$16，9+16=25，单位均元。先把甲成本8约成10、保留乙25，粗估10+25≈35元，再用精确成本决定。纸上原方案成本2×4+5×5=33元，超预算3元；如乙改4件，总成本8+20=28元，余2，28+2=30。固定甲/价钱时乙整数1–4都可行，乙3件等其他方案也应核后接纳；不得把件数直接加减到元数。'
      : 'A：4×6=NZ$24，24÷6=4元/本。B：35÷7=5本，5×7=35元。C：11+6=NZ$17，17−6=11；D：40−13=NZ$27，13+27=40。先将两类成本18约20、28约30，粗估20+30≈50元；最终用精确成本决定。原纸上方案3×6+4×7=46元，超预算6元；如乙改5件，总成本18+20=38元，余2，38+2=40。固定甲和单价，乙整数1–5都预算内，其他符合全部条件的方案同样可核；元/件、件、元须区分。',
    first
      ? 'A: 3×4=NZ$12; 12÷4=3 dollars per book. B: 30÷5=6 books; 6×5=30 dollars. The same “each” describes a known group size while group count is now unknown. C: 8+7=NZ$15, checked by 15−7=8. D: 25−9=NZ$16, checked by 9+16=25. Estimate: 10+25≈35 dollars, rounding X cost eight to ten and retaining Y cost twenty-five; decide with exact costs. Challenge: 2×4+5×5=33 dollars, exceeding thirty by THREE. One repair is Y=4: 8+20=28, balance TWO, 28+2=30. ANY integer Y=1..4 is feasible with fixed X/prices; accept other fully checked valid plans, not just this example. Item counts cannot be directly added to or subtracted from dollars.'
      : 'A: 4×6=NZ$24; 24÷6=4 dollars per book. B: 35÷7=5 books; 5×7=35 dollars. C: 11+6=NZ$17, checked by 17−6=11. D: 40−13=NZ$27, checked by 13+27=40. Estimate: 20+30≈50 dollars, rounding costs eighteen and twenty-eight to tens; decide with exact costs. Challenge: 3×6+4×7=46 dollars, exceeding forty by SIX. One repair is Y=5: 18+20=38, balance TWO, 38+2=40. ANY integer Y=1..5 is feasible with fixed X/prices; accept other fully checked valid plans. Distinguish dollars per item, item count and total dollars.',
    '给定“每”仍需确定未知是总价还是本数；预算用已算成本，不用件数直接扣元数。',
    'Even with “each”, determine whether total price or item count is unknown. Budget subtraction uses computed cost, not item count.',
  );
  q5.contextTable = {
    caption: t(
      '四张独立假想文具卡；金额NZD，已给总价不再当单价。',
      'Four separate hypothetical cards; money is NZD. Given total costs are not unit prices.',
    ),
    columns: [
      t('卡', 'Card'),
      t('完整给定', 'Complete givens'),
      t('所求', 'Requested'),
    ],
    rows: [
      [
        t('A', 'A'),
        t(
          first ? '每本3元，买4本' : '每本4元，买6本',
          first
            ? 'Three dollars EACH, buy four books'
            : 'Four dollars EACH, buy six books',
        ),
        t('总价/元', 'Total dollars'),
      ],
      [
        t('B', 'B'),
        t(
          first ? '总价30元，每本5元' : '总价35元，每本7元',
          first
            ? 'Total thirty dollars, five dollars EACH'
            : 'Total thirty-five dollars, seven dollars EACH',
        ),
        t('本数', 'Book count'),
      ],
      [
        t('C', 'C'),
        t(
          first ? '两类各自总价8元与7元' : '两类各自总价11元与6元',
          first
            ? 'Category total costs eight and seven dollars'
            : 'Category total costs eleven and six dollars',
        ),
        t('合计/元', 'Combined dollars'),
      ],
      [
        t('D', 'D'),
        t(
          first ? '预算25元，已算总成本9元' : '预算40元，已算总成本13元',
          first
            ? 'Budget twenty-five, computed total cost nine dollars'
            : 'Budget forty, computed total cost thirteen dollars',
        ),
        t('余额/元', 'Balance dollars'),
      ],
    ],
  };
  return {
    id: unit + '-MAINT-OPERATIONS',
    unit,
    title: t(
      first ? '换故事，保留运算的数量关系' : '换到新采购与包装，再解释运算',
      first
        ? 'Change the story, preserve quantity relationships'
        : 'Explain operations in changed buying and packing tasks',
    ),
    bridge: 'B02-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5].map((i) => [id(i), 'B02-L0' + i]),
    ),
    intro: t(
      '五题可分多次，一次一题或一个小问，不计时。先在纸上画图，写出数量角色、算式与单位，再核；每题全部小问核齐后家长才确认。可用熟悉语言，英文读题协助与数学提示分开。记录与价钱均虚构；这是纸上练习，不需要购买。',
      'Split five tasks across sittings, one task or subpart at a time, without a timer. Draw diagrams and write quantity roles, equations and units before checking; a parent confirms only after EVERY subpart is reviewed. Use a familiar language and distinguish English reading assistance from mathematical hints. All records and prices are fictional; this is a paper activity with no purchase.',
    ),
    questions: [q1, q2, q3, q4, q5],
  };
};
export const operationMeaningRetrieval = {
  B06_OPERATIONS: makeSet('B06'),
  P51_OPERATIONS: makeSet('P51'),
};
