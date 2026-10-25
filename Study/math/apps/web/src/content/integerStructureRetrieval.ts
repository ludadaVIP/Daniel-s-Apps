import { t, type Question } from '../model';
import { reasoning } from './builders';

const makeSet = (unit: 'P53' | 'P63') => {
  const first = unit === 'P53',
    id = (n: number) => unit + '-MAINT-INTEGER-STRUCTURE-Q' + n;
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
        '一次只做一个小问；先自己写完整关系、步骤或图，再核查全部小问。正确末值和关键词不能代替理由。',
        'Do ONE subpart at a time. Generate complete relationships, steps or diagrams before checking every part. A final value or keyword does not replace reasoning.',
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
  const mixed = first ? '1800+24×35−720÷8' : '2500+16×45−810÷9',
    sequential = first ? '4800÷12×4+160' : '5400÷9×3+175',
    zero = first ? '0×936+3600÷9' : '0×708+4200÷7',
    budget = first ? 3000 : 4000,
    sets = first ? 12 : 15,
    price = first ? 125 : 160;
  const q1 = task(
    1,
    'whole-mixed-calculation',
    '对表中M/S/Z逐行算：先圈应算的完整部分，每次只替换一处并抄保其余数和符号，直到最终值；说出层级、同级先后与商中零的位值，并以乘回、加回核查。M的乘积另给两种合法拆算策略，说明为何等值。S若先把除数和右侧乘数合并，会变成什么式子，结果仍相同吗？Z另比较0÷其原正除数、该正除数÷0与0÷0，哪些有定义，不能编0继续。独立假想预算NZ$' +
      budget +
      '，买' +
      sets +
      '套每套NZ$' +
      price +
      '，无其他费用：命名总价/余钱并反查，不能从钱数直接减套数。',
    'For M/S/Z, circle a complete next subexpression and replace ONLY that part on each line, retaining all other numbers and signs through the final value. Explain precedence, equal-level order and quotient zero places; check by multiplying or adding back. Give TWO valid decompositions of M’s product and justify equivalence. For S, combine its divisor and right multiplier first: what DIFFERENT expression results, and is its value unchanged? Separately compare zero divided by Z’s positive divisor, that divisor divided by zero, and zero divided by zero: state which are defined, without inventing a zero result. In an independent fictional budget of NZ$' +
      budget +
      ', buy ' +
      sets +
      ' sets at NZ$' +
      price +
      ' each with no other charges: name cost and remaining money and reverse-check; do not subtract set count directly from money.',
    (first
      ? 'M：1800+24×35−720÷8=1800+840−720÷8=1800+840−90=2640−90=2550。24×35=(20+4)×35=700+140=840，也可(25−1)×35=875−35=840；90×8=720，2550+90−840=1800。S：4800÷12×4+160=400×4+160=1600+160=1760，12×400=4800；若改4800÷(12×4)+160，则4800÷48+160=100+160=260，是另一式。Z：0×936+3600÷9=0+3600÷9=0+400=400，400×9=3600；0÷9=0，9÷0与0÷0都无定义。'
      : 'M：2500+16×45−810÷9=2500+720−810÷9=2500+720−90=3220−90=3130。16×45=(10+6)×45=450+270=720，也可(20−4)×45=900−180=720；90×9=810，3130+90−720=2500。S：5400÷9×3+175=600×3+175=1800+175=1975，9×600=5400；若改5400÷(9×3)+175，则5400÷27+175=200+175=375，是另一式。Z：0×708+4200÷7=0+4200÷7=0+600=600，600×7=4200；0÷7=0，7÷0与0÷0都无定义。') +
      ` 每条等号保整式的值，不把未完成乘积与前数先加，也不丢减号或商的零位。接受任何有依据的等值拆算，不强制照范例。预算总价${sets}×${price}=NZ$${sets * price}，余${budget}−${sets * price}=NZ$${budget - sets * price}，核${budget - sets * price}+${sets * price}=${budget}；钱与套数角色不同。零因数、零被除数和零除数是不同条件；本工作台非负整数且整除的范围不代表普通除法可截商或允许除零。`,
    (first
      ? 'M: 1800+24×35−720÷8=1800+840−720÷8=1800+840−90=2640−90=2550. Product strategies: (20+4)×35=700+140=840 and (25−1)×35=875−35=840. Check 90×8=720 and 2550+90−840=1800. S: 4800÷12×4+160=400×4+160=1600+160=1760; 12×400=4800. Changing it to 4800÷(12×4)+160 gives 4800÷48+160=100+160=260, a DIFFERENT expression. Z: 0×936+3600÷9=0+3600÷9=0+400=400; 400×9=3600. Zero division cases: 0÷9=0; 9÷0 and 0÷0 are undefined.'
      : 'M: 2500+16×45−810÷9=2500+720−810÷9=2500+720−90=3220−90=3130. Product strategies: (10+6)×45=450+270=720 and (20−4)×45=900−180=720. Check 90×9=810 and 3130+90−720=2500. S: 5400÷9×3+175=600×3+175=1800+175=1975; 9×600=5400. Changing it to 5400÷(9×3)+175 gives 5400÷27+175=200+175=375, a DIFFERENT expression. Z: 0×708+4200÷7=0+4200÷7=0+600=600; 600×7=4200. Zero division cases: 0÷7=0; 7÷0 and 0÷0 are undefined.') +
      ` Each equality preserves the WHOLE expression. Do not add into an unfinished product, drop a subtraction sign or omit quotient zero places. Accept ANY justified equivalent decomposition. Independent cost ${sets}×${price}=NZ$${sets * price}; remaining ${budget}−${sets * price}=NZ$${budget - sets * price}; check ${budget - sets * price}+${sets * price}=${budget}. Money and set count are different roles. Zero factors, dividends and divisors have different conditions. The workshop’s nonnegative exact-division domain does not authorise truncating ordinary quotients or dividing by zero.`,
    '整行每次只换一段；同级除后乘不能偷偷给右侧两数加括号。',
    'Replace one complete part per whole line; equal-level division then multiplication does not insert brackets around the right factors.',
  );
  table(
    q1,
    '三条独立原式；预算题另给资料，不互相混用。',
    'Three independent original expressions; the budget case has separate givens.',
    [
      ['编号', 'ID'],
      ['原式', 'Original expression'],
    ],
    [
      ['M', mixed],
      ['S', sequential],
      ['Z', zero],
    ],
  );

  const expressions = first
    ? [
        '30+42÷6',
        '(30+42)÷6',
        '36÷6×3',
        '36÷(6×3)',
        '25−8+6',
        '25−(8+6)',
        '3×4+(8+7)',
        '72÷(3×(2+2))',
      ]
    : [
        '36+48÷6',
        '(36+48)÷6',
        '48÷8×2',
        '48÷(8×2)',
        '32−9+5',
        '32−(9+5)',
        '4×5+(9+6)',
        '96÷(4×(1+2))',
      ];
  const q2 = task(
    2,
    'operation-order',
    '表中A/B、C/D、E/F各是一对不同分组。分别亲写全部等值步骤，圈括号作用的整体，比较结果并纠正“乘总先于除、加总先于减”。R先按示范规则处理右括号，再合并独立乘积；N从最内括号向外，每次只换一个完整部分。最后只把C/D的最右乘数改为1，重算这对式子；这一次同值能证明任何数下可任意添删括号吗？用原C/D数值反查并解释为什么不是一般证明。',
    'A/B, C/D and E/F are pairs with DIFFERENT grouping. Generate every equivalent step, mark each bracketed whole and compare results, correcting “multiplication always before division; addition always before subtraction”. For R, follow the demonstration’s right-brackets-first rule before combining its independent product. For N, work from the innermost brackets outward, replacing one complete part at a time. Finally change ONLY the right multiplier in C/D to ONE and recompute that pair. Does this one matching result prove brackets may always be inserted or removed? Use the original C/D values to check and explain why a single match is not a general proof.',
    (first
      ? 'A：30+42÷6=30+7=37；B：(30+42)÷6=72÷6=12。C：36÷6×3=6×3=18；D：36÷(6×3)=36÷18=2。E：25−8+6=17+6=23；F：25−(8+6)=25−14=11。R：3×4+(8+7)=3×4+15=12+15=27。N：72÷(3×(2+2))=72÷(3×4)=72÷12=6。只改乘数1：36÷6×1=6×1=6；36÷(6×1)=36÷6=6，虽同值，原3时18与2不同。'
      : 'A：36+48÷6=36+8=44；B：(36+48)÷6=84÷6=14。C：48÷8×2=6×2=12；D：48÷(8×2)=48÷16=3。E：32−9+5=23+5=28；F：32−(9+5)=32−14=18。R：4×5+(9+6)=4×5+15=20+15=35。N：96÷(4×(1+2))=96÷(4×3)=96÷12=8。只改乘数1：48÷8×1=6×1=6；48÷(8×1)=48÷8=6，原2时12与3仍不同。') +
      ' 括号改变整个和、除数或被减量的范围；括号内也按层级，同级按原式从左向右。示范R的第一替换是右侧和15，不是先展外部乘积；独立部分在明确说明的其他策略中可分别算，但不能声称先括号却显示另一步。同值特例不建立所有输入下的等值，须结构理由或一般论证；原C/D已给反例。',
    (first
      ? 'A: 30+42÷6=30+7=37; B: (30+42)÷6=72÷6=12. C: 36÷6×3=6×3=18; D: 36÷(6×3)=36÷18=2. E: 25−8+6=17+6=23; F: 25−(8+6)=25−14=11. R: 3×4+(8+7)=3×4+15=12+15=27. N: 72÷(3×(2+2))=72÷(3×4)=72÷12=6. Multiplier one: 36÷6×1=6×1=6 and 36÷(6×1)=36÷6=6, but the original multiplier three gave eighteen versus two.'
      : 'A: 36+48÷6=36+8=44; B: (36+48)÷6=84÷6=14. C: 48÷8×2=6×2=12; D: 48÷(8×2)=48÷16=3. E: 32−9+5=23+5=28; F: 32−(9+5)=32−14=18. R: 4×5+(9+6)=4×5+15=20+15=35. N: 96÷(4×(1+2))=96÷(4×3)=96÷12=8. Multiplier one: 48÷8×1=6×1=6 and 48÷(8×1)=48÷8=6, but the original multiplier two gave twelve versus three.') +
      ' Brackets change the scope of a sum, divisor or subtracted quantity. Their interiors obey precedence too, and equal-level operations keep original left-to-right order. R’s demonstration first replaces the right sum by fifteen. Other explicitly justified strategies may work on independent parts, but a demonstration claiming brackets first must show that choice. One coincidentally equal value does not establish equivalence for ALL inputs; a structural argument is needed, and the original C/D already refute unrestricted regrouping.',
    '先圈作用范围，再按最内括号、层级和同级先后写整行，不用碰巧同值代替证明。',
    'Mark scope, then write whole lines using inner brackets, precedence and same-level order; a coincidental match is not a proof.',
  );
  table(
    q2,
    '八条原式；字母只是身份，不提供分类或结果。',
    'Eight original expressions; letters identify rows, not rules or answers.',
    [
      ['编号', 'ID'],
      ['原式', 'Original expression'],
    ],
    expressions.map((e, i) => [
      ['A', 'B', 'C', 'D', 'E', 'F', 'R', 'N'][i]!,
      e,
    ]),
  );

  const n = first ? 48 : 60,
    rows = first ? 6 : 5,
    divisor = first ? 5 : 7,
    base = first ? 6 : 8,
    kth = first ? 9 : 10;
  const q3 = task(
    3,
    'factor-multiple',
    '按表总张数亲画完整相等行阵列，再交换行列并核张数，不把计数格说成cm²。自己列全部因数对与不同正因数，两端都列、反向配对不重计，并说明为什么列表已完整；平方中间因数可用原36的任务再比较。另把同一批按表试装容量装满袋，给满袋数、余张、总量=容量×满袋+余量，判断是否整除；满袋数是否就是普通除法精确商？把余量写回精确商关系。独立按表倍数基数列前8个正倍数并求指定第k个，另显示0时正倍数序号会移位吗？给“n的两倍”说明因数/倍数方向，并解释正因数有限而正倍数能继续。1的正因数是什么？为何不对0照套这个有限表或用0作除数？',
    'DRAW complete equal rows from the total and row count, then swap rows/columns and check every card is retained; counting cells are not cm². Generate ALL factor pairs and distinct positive factors, including both ends without duplicating reversed pairs, and justify completeness. Compare a square’s middle factor with the earlier thirty-six task if useful. Independently pack the same total into full bags of the stated TRIAL capacity: give full bags, remaining cards and total=capacity×full bags+remainder. Does the capacity divide exactly, and is the full-bag count the exact ordinary quotient? Restore the remainder in an exact quotient relationship. Separately list the first EIGHT positive multiples of the supplied base and find its stated kth positive multiple. Does additionally displaying zero shift positive positions? Use twice n to explain factor/multiple direction, and explain finite factors versus continuing positive multiples. Give one’s positive factors and explain why zero cannot use this finite table or serve as a divisor.',
    (first
      ? '48=6×8，交换8行每行6张仍48张。因数对1×48、2×24、3×16、4×12、6×8；不同正因数1,2,3,4,6,8,12,16,24,48，共10个。试装48=5×9+3，满9袋余3张，5不整除48；精确商48÷5=9+3/5，不是9。6的前8正倍数6,12,18,24,30,36,42,48，第9个6×9=54。'
      : '60=5×12，交换12行每行5张仍60张。因数对1×60、2×30、3×20、4×15、5×12、6×10；不同正因数1,2,3,4,5,6,10,12,15,20,30,60，共12个。试装60=7×8+4，满8袋余4张，7不整除60；精确商60÷7=8+4/7，不是8。8的前8正倍数8,16,24,32,40,48,56,64，第10个8×10=80。') +
      ` 每一对乘回${n}。${first ? '较小端只需查1至6：两端都至少7时乘积至少49>48，故无新对。' : '较小端逐查1至7，7不整除60；两端都至少8时乘积至少64>60，故配对无遗漏。'}36的6×6只给一个不同因数6，仍沿用原两处任务的九因数证据。0=${base}×0是零倍，不是第一个正倍数，也不是正因数；另显0不移动正序号。${n}×2=${n * 2}，${n}是${n * 2}的因数，${n * 2}是${n}的倍数，反过来不成立。正因数不超过${n}而有限；正倍数第j个${base}×j后还有${base}×(j+1)，没有末个。1的正因数仅1；本正整数有限表不适用于0，不能把未列说成0没有因数，也不能用除0测试。`,
    (first
      ? 'Array: 48=6×8; swapping to eight rows of six retains 48 cards. Pairs 1×48,2×24,3×16,4×12,6×8 give distinct factors 1,2,3,4,6,8,12,16,24,48: ten. Trial packing 48=5×9+3 gives nine full bags and three cards, not exact divisibility by five. Exact 48÷5=9+3/5, not nine. First eight positive multiples of six: 6,12,18,24,30,36,42,48; the ninth is 6×9=54.'
      : 'Array: 60=5×12; swapping to twelve rows of five retains 60 cards. Pairs 1×60,2×30,3×20,4×15,5×12,6×10 give distinct factors 1,2,3,4,5,6,10,12,15,20,30,60: twelve. Trial packing 60=7×8+4 gives eight full bags and four cards, not exact divisibility by seven. Exact 60÷7=8+4/7, not eight. First eight positive multiples of eight: 8,16,24,32,40,48,56,64; the tenth is 8×10=80.') +
      ` Check both ends of each pair and multiply back to ${n}. ${first ? 'Check smaller entries through six: a pair both at least seven would have product at least49>48.' : 'Check smaller entries through seven, including seven which does not divide60; both entries at least eight would have product at least64>60.'} Reversed pairs add no new factors. The earlier thirty-six tasks still retrieve counting six ONCE in 6×6. Zero equals ${base}×0 but is not a positive multiple or positive factor; adding it to a display does not shift positive positions. ${n}×2=${n * 2}: ${n} is a factor of ${n * 2}, and ${n * 2} is a multiple of ${n}, not conversely. Positive factors cannot exceed ${n}, while multiple j=${base}×j always has a following ${base}×(j+1). One has only positive factor one. Do not apply this finite positive-integer table to zero, claim zero has no factors from an absent list, or test by dividing by zero.`,
    '成对列因数并保留所有计数格；试装时用总数=容量×满袋+余量，再分清正倍数序号。',
    'List paired factors and retain every counter. Use total=capacity×full bags+remainder, then distinguish positive-multiple positions.',
  );
  table(
    q3,
    '阵列、试装与倍数序列是独立小问。',
    'Array, trial packing and multiple sequence are independent subparts.',
    [
      ['编号', 'ID'],
      ['量', 'Quantity'],
      ['给定值', 'Given value'],
    ],
    [
      ['N', t('总张数', 'Total cards'), String(n)],
      ['R', t('阵列行数', 'Array rows'), String(rows)],
      ['D', t('试装每袋张数', 'Trial cards per bag'), String(divisor)],
      ['B', t('倍数基数', 'Multiple base'), String(base)],
      ['K', t('目标正倍数序号', 'Positive-multiple index'), String(kth)],
    ],
  );

  const prime = first ? 47 : 53,
    composite = first ? 49 : 25,
    root = first ? 7 : 5,
    limit = first ? 6 : 7;
  const q4 = task(
    4,
    'prime-composite',
    '逐行按“大于1及不同正因数个数”分类表中数，给定义依据；0不能写空因数表后说没有因数，1与自己不可重计。对P亲自逐个试小因子2到' +
      limit +
      '，列商余关系，解释两因数都超过此界时乘积为何过大，因而正因数表没有漏；不能仅因一次不整除或奇数就称质数。对C先试2，再给一个非平凡乘法见证及完整不同因数表；失败试除与成功找到非平凡因数各证明什么？P除自身余0能证明合数吗？画1×P长方形是否足够？用本表反驳“奇数一定质、偶数一定合”。',
    'Classify EVERY row using greater-than-one and the count of DISTINCT positive factors. Do not label an absent zero list “no factors” or count one and itself twice. For P, independently try EVERY smaller candidate from two through ' +
      limit +
      ', write quotient/remainder relationships, and explain why a pair both beyond this bound would be too large, establishing completeness. Neither one failed trial nor odd parity proves prime. For C, try two, then produce a nontrivial multiplicative witness and ALL distinct positive factors. What does a failed trial establish versus one successful nontrivial factor? Does P dividing itself with remainder zero prove composite, or merely drawing a 1×P rectangle? Use these rows to refute “all odds prime; all evens composite”.',
    `0、1均不大于1，既非质也非合；1仅正因数1，0不套有限表。2的正因数1,2，恰两个，为唯一偶质数；任一大于2的偶数有非平凡因数2。P=${prime}，逐试${Array.from(
      { length: limit - 1 },
      (_, i) => i + 2,
    )
      .map((d) => `${prime}=${d}×${Math.floor(prime / d)}+${prime % d}`)
      .join(
        '；',
      )}，均余非零。若还有非平凡因数对，较小端必≤${limit}，否则两端至少${limit + 1}，乘积至少${(limit + 1) ** 2}>${prime}；故仅1,${prime}，为质数。C=${composite}，${composite}=2×${Math.floor(composite / 2)}+1只排除因数2；${composite}=${root}×${root}且1<${root}<${composite}，证明合数，不同正因数1,${root},${composite}，中间只计一次。${prime}=${prime}×1的因数是自身与1，并非非平凡见证；1×P也是矩形，外观不能证明合数。2反驳所有偶数合，${composite}反驳所有奇数质，分类依定义而非奇偶。`,
    `Zero and one are neither, failing greater-than-one; one has only factor one and zero does not use this finite table. Two has factors 1,2 and is the only even prime, because every larger even integer has nontrivial factor two. P=${prime}: ${Array.from(
      { length: limit - 1 },
      (_, i) => i + 2,
    )
      .map((d) => `${prime}=${d}×${Math.floor(prime / d)}+${prime % d}`)
      .join(
        '; ',
      )}; every remainder is nonzero. Any nontrivial factor pair would have a smaller member at most ${limit}; otherwise both are at least ${limit + 1}, giving product at least ${(limit + 1) ** 2}>${prime}. Therefore factors are only 1,${prime}, so prime. C=${composite}: ${composite}=2×${Math.floor(composite / 2)}+1 rules out ONLY two; ${composite}=${root}×${root}, with 1<${root}<${composite}, proves composite. Distinct factors 1,${root},${composite} count the middle once. ${prime}=${prime}×1 gives only trivial factors, and a 1×P rectangle does not prove composite. Two refutes all-evens-composite and ${composite} refutes all-odds-prime. Use factor definitions rather than parity.`,
    '找到一个非平凡因数足证合数；要证质数则须说明其他因数对为何已经排尽。',
    'One nontrivial factor proves composite; a prime argument must also exclude all remaining possible factor pairs.',
  );
  table(
    q4,
    '独立待分类整数；不提供因数或分类结果。',
    'Independent integers to classify; factors and kinds are not supplied.',
    [
      ['编号', 'ID'],
      ['整数', 'Integer'],
    ],
    [
      ['Z', '0'],
      ['O', '1'],
      ['E', '2'],
      ['P', String(prime)],
      ['C', String(composite)],
    ],
  );

  const a = first ? 20 : 24,
    b = first ? 30 : 40,
    candidate = first ? 5 : 4,
    periodA = first ? 13 : 14,
    periodB = first ? 14 : 15;
  const q5 = task(
    5,
    'common-factors-multiples',
    'G行是两色纸卡张数，平均放进相同数量袋，每袋各色分别相同且两色都不剩：先判断候选' +
      candidate +
      '袋是否可行，再完整列共同正因数求最多袋数、每袋各色与乘回核查，说明可行不等于最大。T行是从0同时开始的两个假想纸上周期，单位分钟：先列各自前8正倍数，未见共同点能说不存在吗？再亲自扩到首个正共同点，保留之前全部值，标各自第几个倍数并证明没有更早正重合；0不是下一次但仍是共同零倍。I/S/C三行只为另外三对正整数，各求GCF与最小正LCM并解释1、相同数、互质数的边界；不能见两数就相乘或把GCF写0。说明为何本活动不直接扩展到含0输入的其他约定。',
    'G gives two colours of paper cards. Divide them among the SAME bags with equal per-colour contents in every bag and neither colour left. First test ' +
      candidate +
      ' bags, then generate ALL common positive factors, the greatest bag count, per-colour contents and multiplication-back checks. Explain feasible versus greatest. T gives two fictional paper periods in MINUTES, starting together at zero: list each first EIGHT positive multiples. Does no overlap here prove nonexistence? Extend both yourself through the FIRST positive common value, retaining every earlier entry, and mark its two multiple positions to establish no earlier overlap. Zero is not next but remains a common zero multiple. I/S/C are THREE independent positive-integer pairs: find GCF and least positive LCM, explaining one, equal inputs and coprime inputs. Do not always multiply the inputs or report GCF zero. State why this activity does not extend its input convention automatically to zero-inclusive cases.',
    (first
      ? 'G：20因数1,2,4,5,10,20；30因数1,2,3,5,6,10,15,30；共同1,2,5,10，最大10袋，每袋2红3蓝，10×2=20、10×3=30。候选5袋也可，每袋4红6蓝，却不是最多。T：13前8倍13,26,39,52,65,78,91,104；14前8倍14,28,42,56,70,84,98,112，没有共同点。延长13列到第14项182，14列到第13项182，首个正共同182min；I(1,8)得GCF1/LCM8，S(6,6)得6/6，C(8,9)得1/72。'
      : 'G：24因数1,2,3,4,6,8,12,24；40因数1,2,4,5,8,10,20,40；共同1,2,4,8，最大8袋，每袋3红5蓝，8×3=24、8×5=40。候选4袋可行，每袋6红10蓝，却不是最大。T：14前8倍14,28,42,56,70,84,98,112；15前8倍15,30,45,60,75,90,105,120，无共同点。延长14列到第15项210，15列到第14项210，首个正共同210min；I(1,15)得GCF1/LCM15，S(7,7)得7/7，C(9,10)得1/90。') +
      ` T完整延长列为${Array.from({ length: periodB }, (_, i) => periodA * (i + 1)).join(',')}与${Array.from({ length: periodA }, (_, i) => periodB * (i + 1)).join(',')}，第一次相同${periodA * periodB}=${periodA}×${periodB}=${periodB}×${periodA}，之前无重合。G袋数须整除两批，T时点须被两个间隔整除，方向不同。共同因数至少1、相同数的两目标都为自身、与1配对GCF1而LCM为另一数；互质时才可用两数乘积求LCM，不能把同数相乘当下次。正整数范围排除0输入；0是共同倍数但非所求最小正时点，不能把此活动约定当其他含零定义的结论。全部纸卡/周期都假想，不实际购买或等待计时。`,
    (first
      ? 'G factors: 20 has 1,2,4,5,10,20; 30 has 1,2,3,5,6,10,15,30. Common 1,2,5,10 gives greatest ten bags, two red/three blue each; 10×2=20 and 10×3=30. Five bags work with four red/six blue each but are not greatest. T first eight: 13,26,39,52,65,78,91,104 and 14,28,42,56,70,84,98,112, with no overlap. Reach 182 at the 14th multiple of 13 and 13th of 14. I(1,8):GCF1/LCM8; S(6,6):6/6; C(8,9):1/72.'
      : 'G factors: 24 has 1,2,3,4,6,8,12,24; 40 has 1,2,4,5,8,10,20,40. Common 1,2,4,8 gives greatest eight bags, three red/five blue each; 8×3=24 and 8×5=40. Four bags work with six red/ten blue each but are not greatest. T first eight: 14,28,42,56,70,84,98,112 and 15,30,45,60,75,90,105,120, with no overlap. Reach 210 at the 15th multiple of 14 and 14th of 15. I(1,15):GCF1/LCM15; S(7,7):7/7; C(9,10):1/90.') +
      ` COMPLETE extended lists: ${Array.from({ length: periodB }, (_, i) => periodA * (i + 1)).join(',')} and ${Array.from({ length: periodA }, (_, i) => periodB * (i + 1)).join(',')}; first match ${periodA * periodB}=${periodA}×${periodB}=${periodB}×${periodA}, with no earlier overlap. Bag count DIVIDES both totals; recurrence time is DIVISIBLE BY both intervals. One is always a common positive factor; equal inputs give that same number for both goals, and pairing with one gives GCF one/LCM the other input. The product shortcut for LCM needs coprimality, not arbitrary inputs. This activity uses positive integer inputs and does not settle other zero-inclusive conventions. Zero is a common multiple but not the requested next positive time. Paper cards and periods are fictional: no purchase, timed waiting or real observations.`,
    '先判断“答案整除两数”还是“两数整除答案”，短列表找不到时延长而不是猜没有。',
    'Decide whether the answer divides both inputs or both inputs divide the answer; extend a short window instead of assuming no match.',
  );
  table(
    q5,
    'G为两色卡数，T为同起点周期；I/S/C是独立整数对。',
    'G gives two card counts, T simultaneous-start periods; I/S/C are independent integer pairs.',
    [
      ['编号', 'ID'],
      ['a', 'a'],
      ['b', 'b'],
    ],
    [
      ['G', String(a), String(b)],
      ['T', String(periodA), String(periodB)],
      ['I', '1', first ? '8' : '15'],
      ['S', first ? '6' : '7', first ? '6' : '7'],
      ['C', first ? '8' : '9', first ? '9' : '10'],
    ],
  );
  return {
    id: unit + '-MAINT-INTEGER-STRUCTURE',
    unit,
    title: t(
      '保住整式，说明整除',
      'Preserve expressions and justify divisibility',
    ),
    bridge: 'P51-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5].map((n) => [id(n), 'P51-L0' + n]),
    ),
    intro: t(
      '五张过程卡分多次，一次一个小问，不计时。先纸上写整行、画阵列或列清单，再逐项核验；全部小问核齐才由家长确认。读题协助与数学提示分开，可用熟悉语言。钱数、纸卡与周期均假想，不是家庭实测，也无需采购或等待。',
      'Split five process cards across sittings, ONE SUBPART at a time without a timer. Generate whole lines, arrays or lists on paper before reviewing; a parent confirms only when EVERY part is checked. Separate reading assistance from maths hints and use a familiar language. Money, cards and rhythms are fictional, not family observations, with no purchase or timed waiting.',
    ),
    questions: [q1, q2, q3, q4, q5],
  };
};
export const integerStructureRetrieval = {
  P53_INTEGER_STRUCTURE: makeSet('P53'),
  P63_INTEGER_STRUCTURE: makeSet('P63'),
};
