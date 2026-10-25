import { t, type Question } from '../model';
import { reasoning } from './builders';
import { ratio, ratioText, decimalText, percentText } from '../percentModels';

const f = (n: number, d = 1) => ratioText(ratio(n, d));
const dec = (n: number, d = 1) => decimalText(ratio(n, d))!;
const pct = (n: number, d = 1) => percentText(ratio(n, d));
const money = (cents: number) => `NZ$${(cents / 100).toFixed(2)}`;
const makeSet = (unit: 'P65' | 'P68') => {
  const near = unit === 'P65';
  const id = (n: number) => `${unit}-MAINT-PERCENT-MEANING-Q${n}`;
  const task = (
    n: number,
    skill: string,
    zh: string,
    en: string,
    rz: string,
    re: string,
    hz: string,
    he: string,
  ) =>
    reasoning(id(n), t(zh, en), skill, t(rz, re), [
      t(hz, he),
      t(
        '一次只做一个编号小问。先画图、列对应并说自己的理由，再核全部要求后确认。读题协助与数学提示分开。',
        'Do ONE numbered part at a time. Draw, label correspondences and give your own reasons before reviewing EVERY requirement. Separate reading assistance from mathematical hints.',
      ),
    ]);
  const table = (q: Question, rows: [string, string, string, string][]) => {
    q.contextTable = {
      caption: t(
        '编号列给定条件；独立修改与另题按题干区分。待求百分数、量与图须自己生成。',
        'IDs give the conditions. Distinguish independent modifications and separate questions as specified; generate the requested percentages, amounts and diagrams yourself.',
      ),
      columns: [t('编号', 'ID'), t('条件', 'Condition'), t('给定值', 'Given')],
      rows: rows.map(([key, z, e, v]) => [t(key, key), t(z, e), t(v, v)]),
    };
  };
  const total = near ? 80 : 40,
    marked = 3,
    half = total / 2;
  const rareTotal = near ? 200 : 400;
  const coefficient = (marked * 100) / total,
    full = Math.floor(coefficient),
    partial = ratio(marked * 100 - full * total, total);
  const q1 = task(
    1,
    'per-hundred-reference',
    '① A中每张卡同样计数。先写实际标记张数、部分/整体，再亲画标准百格，标完整涂格数与下一格的精确面积。百格上的格数会变成实际张数吗，A一张卡恰好占1%吗？另求D总数中一张的比例，说明单张能否不到1%。② B保持A标记张数而改总数；C总数回到A、标记百分率要与B相同，逆求C标记数并核回。画同长整体条解释A/B同个数不同率、B/C同率不同个数。③ 以A正总数分别核零标记、全标记，再判断零张中的零张能否定义标记率；“子集占本集合125%”与“需求为参考量125%”能都成立吗？说明所比对象。',
    '① Every A card counts equally. Write its ACTUAL marked count and part/whole, then DRAW a standard hundred grid with complete shaded cells and the EXACT area of the next cell. Do standard cells become source cards? Is one A card exactly 1%? Separately find the rate for ONE card in D’s total: can a single card be below 1%? ② B retains A’s marked count but changes the total. C returns to A’s total and must match B’s RATE: recover C’s marked count and check. Draw equal-length whole bars showing equal counts with different rates in A/B and equal rates with different counts in B/C. ③ With A’s positive total, check zero and all marked. Can zero of zero define a marked rate? Compare “a subset is 125% of its own collection” with “a requirement is 125% of a reference amount”, naming both objects.',
    `A实际${marked}张，比例${marked}/${total}=${f(marked, total)}=${pct(marked, total)}；百格涂${full}整格及下一格${f(partial.n, partial.d)}面积，仍仅3张标记。A一张${pct(1, total)}，不是1%；D一张占1/${rareTotal}=${pct(1, rareTotal)}，不到1%。B为${marked}/${half}=${pct(marked, half)}；C需${total}×${marked}/${half}=6张，6/${total}与3/${half}等率，A/B同数不同率、B/C同率不同数。零标记0/${total}=0%，全标记${total}/${total}=100%；0/0未定义，不能叫0%。本集合子集最多100%；需求/另一个正参考量可以125%，并非子集里凭空增加东西。`,
    `A has ${marked} ACTUAL marked cards: ${marked}/${total}=${f(marked, total)}=${pct(marked, total)}. Shade ${full} whole cells and ${f(partial.n, partial.d)} of the next; the source still has THREE marked cards. One A card is ${pct(1, total)}, not 1%; ONE of D’s ${rareTotal} cards is ${pct(1, rareTotal)}, BELOW 1%. B gives ${marked}/${half}=${pct(marked, half)}. C requires ${total}×${marked}/${half}=6 marked cards; 6/${total} and 3/${half} match. A/B have equal counts but different rates; B/C equal rates but different counts. Zero of ${total} gives 0%; all gives 100%; 0/0 is undefined, not a zero rate. A subset cannot exceed its own collection, while a requirement can be 125% of a different positive reference amount.`,
    '分清原卡片与标准图；同率时仍须乘各自实际总数。',
    'Separate source cards from the standard diagram. The same rate still acts on each actual total.',
  );
  table(q1, [
    ['A_N', 'A总卡数', 'A total cards', String(total)],
    [
      'D_N',
      '另一个D集合总卡数（仅一张标记）',
      'Separate D total (only ONE marked card)',
      String(rareTotal),
    ],
    ['A_M', 'A标记数', 'A marked cards', String(marked)],
    [
      'B_N',
      'B总卡数（标记同A）',
      'B total (same marked count as A)',
      String(half),
    ],
    ['C_N', 'C总卡数（标记率同B）', 'C total (same rate as B)', String(total)],
  ]);

  const milli = near ? 6 : 9,
    large = near ? 1400 : 1600,
    digit = near ? 4 : 7;
  const q2 = task(
    2,
    'decimal-percent-equivalence',
    '① 把D与E各写成等值百分数，再按“系数÷100”反查，分别画百格中的不足一格与跨原整体框；不能把扩展画布重新叫100%。② 把P标签改回不带百分号的小数，再比较P系数当普通数时的值；另把D只添百分号会得什么小数？“添百分号总会变小”对0成立吗？③ V三项小数每次缩成十分之一，逐项写百分数与除100核查；解释位值而不只报移点。题目要小数或百分数时，分别保留所要求形式。',
    '① Write D and E as equivalent percentages and CHECK each by coefficient÷100. DRAW the partial cell for D and the original unit frames for E; do not redefine the expanded canvas as 100%. ② Convert P back to a DECIMAL without %. Compare it with P’s coefficient used as an ordinary number. What decimal results from merely appending % to D? Does “appending % always makes a value smaller” hold for zero? ③ V’s three decimals shrink by a factor of ten each time. Give their percentages and divide coefficients by 100 to verify, explaining place value. Retain the requested DECIMAL or PERCENTAGE form.',
    `D=${dec(milli, 1000)}=${pct(milli, 1000)}，系数${dec(milli, 10)}÷100还原；百格仅涂一格的${f(milli, 10)}面积。E=${dec(large, 1000)}=${pct(large, 1000)}，先100格再${large / 10 - 100}格，两个同样原框仍每框100%。P=${dec(milli, 10)}%回小数${dec(milli, 1000)}，普通系数${dec(milli, 10)}大100倍。仅给D添%为${dec(milli, 100000)}，非原D。0=0%，不能严格说变小。V为${dec(digit, 10)},${dec(digit, 100)},${dec(digit, 1000)}，依次${pct(digit, 10)},${pct(digit, 100)},${pct(digit, 1000)}；每项及其百分数系数各缩十倍，百分号除100使量保持。`,
    `D=${dec(milli, 1000)}=${pct(milli, 1000)}; ${dec(milli, 10)}÷100 restores it, with ${f(milli, 10)} of ONE hundred-grid cell shaded. E=${dec(large, 1000)}=${pct(large, 1000)}: 100 cells plus ${large / 10 - 100}, in two equal original frames, each still 100%. P=${dec(milli, 10)}% converts to ${dec(milli, 1000)}; ordinary coefficient ${dec(milli, 10)} is 100 times that value. Appending % to D gives ${dec(milli, 100000)}, not D. Zero stays zero: 0=0%. V gives ${dec(digit, 10)},${dec(digit, 100)},${dec(digit, 1000)} = ${pct(digit, 10)},${pct(digit, 100)},${pct(digit, 1000)} respectively. Both values and coefficients scale by tenths; division by 100 preserves the represented quantity during each conversion.`,
    '把百分号改成除以100，再分别看系数和完整百分数。',
    'Replace % by division by 100, distinguishing the coefficient from the complete percentage.',
  );
  table(q2, [
    ['D', '小比例小数', 'Small decimal', dec(milli, 1000)],
    ['E', '超过一的小数', 'Decimal above one', dec(large, 1000)],
    ['P', '待改回小数的标签', 'Percentage to convert back', pct(milli, 1000)],
    [
      'V',
      '三个独立待互化值',
      'Three values to convert',
      [dec(digit, 10), dec(digit, 100), dec(digit, 1000)].join(', '),
    ],
  ]);

  const tn = near ? 7 : 9,
    td = 8,
    rn = near ? 4 : 5,
    rd = near ? 9 : 6,
    en = near ? 3 : 7,
    ed = 20;
  const rwhole = Math.floor((rn * 100) / rd),
    rpart = ratio(rn * 100 - rwhole * rd, rd);
  const approx = near ? '44.4%' : '83.3%',
    approxN = near ? 444 : 833;
  const q3 = task(
    3,
    'fraction-percent-exact',
    '① T先与50%和100%估比，再写精确百分数；亲画百格并标完整格与部分面积，超过一时保原框。R也亲画，写完整分数系数的精确百分数与一位小数近似，用等号/约等号区分；将题给近似除100再乘原分母，检验能否精确回分子。② E用等值扩分到每百份，写分子与分母同时乘几；只把分母换100为何错？百分号作用于整个带分数系数还是只作用于分数尾部？③ 另画0与2个原整体并写百分数；T若被称为某集合子集，是否符合子集限制？不能把“分数都可写百分数”误当所有情境都允许。',
    '① Estimate T against 50% and 100%, then write its EXACT percentage. DRAW complete and partial hundred-grid cells, retaining unit frames beyond one. DRAW R too and write its FULL exact fractional percent coefficient and one-decimal approximation using = and ≈ correctly. Divide the supplied approximation by 100, multiply by R’s original denominator and test exact recovery of its numerator. ② Convert E per hundred by equivalent scaling, stating the multiplier for BOTH numerator and denominator. Why is changing ONLY the denominator invalid? Does % apply to the WHOLE mixed-number coefficient or only its fractional tail? ③ Separately draw zero and TWO original wholes and give percentages. Is T permissible as a subset of its OWN collection? Numerical representability does not authorise every context.',
    `T=${tn}/8=${pct(tn, 8)}，${near ? '大于50%而小于100%' : '大于100%'}，涂${Math.floor((tn * 100) / 8)}整格及下一格1/2面积；${near ? '一原框' : '两个同样原框'}。R=${rn}/${rd}=${pct(rn, rd)}≈${approx}，涂${rwhole}整格及下一格${f(rpart.n, rpart.d)}面积。近似${approxN}/1000乘${rd}=${dec(approxN * rd, 1000)}≠${rn}，所以不精确。E=${en}/20=${en * 5}/100=${en * 5}%，分子分母同乘5；${en}/100变小五倍。百分号除100作用于整个${f(rn * 100, rd)}系数，不能读成整数部分加分数尾部的百分数。0=0%、2=200%，保两原框；T${near ? '可作子集比例（在0到1内）' : '超过1不能作本集合子集比例，但可比较需求与另一个参考量'}。`,
    `T=${tn}/8=${pct(tn, 8)}, ${near ? 'above 50% but below 100%' : 'above 100%'}, with ${Math.floor((tn * 100) / 8)} full cells and half the next across ${near ? 'one original frame' : 'two unchanged frames'}. R=${rn}/${rd}=${pct(rn, rd)}≈${approx}; shade ${rwhole} cells plus ${f(rpart.n, rpart.d)} of the next. The approximation ${approxN}/1000 times ${rd} is ${dec(approxN * rd, 1000)}, NOT ${rn}. E=${en}/20=${en * 5}/100=${en * 5}%, scaling BOTH by five; ${en}/100 is five times smaller. % divides the ENTIRE coefficient ${f(rn * 100, rd)} by 100, not just the fractional tail. Zero is 0%; two original wholes are 200%, not one enlarged whole. T ${near ? 'can describe a subset proportion in [0,1]' : 'cannot describe a subset of its own collection because it exceeds one, though it may compare a requirement with another reference amount'}.`,
    '百格不足一格时保面积；把完整百分数除100后乘回原分母。',
    'Preserve partial-cell area. Divide the entire percentage by 100 before multiplying back by the original denominator.',
  );
  table(q3, [
    ['T', '第一分数', 'First fraction', `${tn}/${td}`],
    [
      'R',
      '循环结果分数',
      'Fraction with recurring percent coefficient',
      `${rn}/${rd}`,
    ],
    ['R_P', 'R待检一位小数近似', 'Supplied rounded R percentage', approx],
    ['E', '等值扩分分数', 'Fraction for equivalent scaling', `${en}/${ed}`],
  ]);

  const whole = near ? 7 : 11,
    rate = near ? 35 : 15;
  const q4 = task(
    4,
    'percent-of-amount',
    '① W是连续水量，画双数轴：100%↔W升、1%与P%对应量先自求。估量是否低于一半，再求精确所取、剩量，核总量与部分/整体；不能直接把P的系数称升或漏除100。② 独立分支：W加倍而P不变；原W取0%、100%；需求为原W的125%。各给实际量，超过参考量的需求会使原桶自动多水吗？③ 总水改0、P保原值：乘法得0是否允许反用0/0声称占比P？另把原W换为不可分整卡，恰取P%可行吗，取整改变了什么？若单位换克，结果单位怎样跟随？',
    '① W is continuous water. DRAW a double number line with 100%↔W L and independently find the amounts at 1% and P%. Estimate against half, then find the EXACT selected/remainder amounts and check total and part/whole. Neither treat P’s coefficient as litres nor omit division by 100. ② SEPARATE branches: double W at the same P; take 0% and 100% of original W; demand 125% of original W. Give amounts: does a larger requirement create water in the original container? ③ Zero total with original P gives zero by multiplication: may 0/0 then establish that percentage? Replace original W by INDIVISIBLE whole cards: is exactly P% feasible, and what would rounding change? With grams, what unit follows the amount?',
    `1%=${dec(whole, 100)}L；P=${rate}%，所取${f(whole * rate, 100)}=${dec(whole * rate, 100)}L，小于${dec(whole, 2)}L，剩${dec(whole * (100 - rate), 100)}L，和${whole}L；所取÷${whole}=${rate}/100。W加倍所得${dec(2 * whole * rate, 100)}L；0%得0、100%得${whole}L；需求125%=${dec(whole * 125, 100)}L，高于参考并不增加原桶水。零W乘P=0L有意义，但0/0未定义，不能反查占比。${whole}张整卡的P为${f(whole * rate, 100)}张非整数，不能恰取；取整更换实际比例。若原单位g，量为${dec(whole * rate, 100)}g，率仍无量纲。`,
    `1%=${dec(whole, 100)}L. At ${rate}%, selection=${f(whole * rate, 100)}=${dec(whole * rate, 100)}L, below half (${dec(whole, 2)}L); remainder=${dec(whole * (100 - rate), 100)}L and sum=${whole}L. Selection÷${whole}=${rate}/100. Doubling W gives ${dec(2 * whole * rate, 100)}L; 0% gives 0 and 100% gives ${whole}L. A 125% requirement is ${dec(whole * 125, 100)}L but creates no extra supply. Zero×P=0L is valid multiplication; 0/0 cannot define the reverse ratio. For ${whole} indivisible cards, ${f(whole * rate, 100)} cards is nonintegral, so exact selection is infeasible; rounding changes the actual rate. With grams the selected amount is ${dec(whole * rate, 100)}g, while the rate remains dimensionless.`,
    '先定100%实际量；零乘一个率与用零整体定义占比是两种关系。',
    'Identify the amount at 100%. Multiplying a zero amount by a rate differs from defining a ratio with zero as whole.',
  );
  table(q4, [
    [
      'W',
      '参考总水/L；整卡分支的卡数',
      'Reference water/L; card count in separate branch',
      String(whole),
    ],
    ['P', '原所求百分数', 'Original requested percentage', `${rate}%`],
  ]);

  const part = near ? 35 : 45,
    recoverRate = near ? 125 : 150,
    fractionalPart = near ? 9 : 11;
  const q5 = task(
    5,
    'recover-percent-whole',
    '① A已知量对应R%，它是需求相对于一个正参考量，不称本集合子集。先在双数轴标对已知点与100%问号，求1%和参考整体，乘回核查；解释R超过100%时为何整体反而比已知量小。② 独立B中已知B_P升对应40%，精确反求并乘回，为什么不能截整数？另保A已知量而改100%，整体怎样？③ 三个独立零条件：0L对应0%、正A_P升对应0%、0L对应正R%。分别用方程判断资料不足、矛盾或只给零整体但无法定义占比；第一种自举两个不同正整体作证，不除零，不把代数乘法成立冒充合法百分率。',
    '① A’s known amount corresponds to R%. It is a requirement relative to a POSITIVE reference, not a subset of its own collection. DRAW the known point and 100% question mark, recover 1% and the whole, then multiply back. Why is the recovered reference smaller when R exceeds 100%? ② In SEPARATE B, B_P litres corresponds to 40%. Recover exactly and check: why not truncate? Separately retain A’s known amount at 100%. ③ Classify THREE independent zero cases using equations: 0L at 0%; positive A_P at 0%; 0L at positive original R%. Distinguish insufficient information, contradiction and an algebraic zero whole with undefined part/whole percentage. GENERATE two different positive whole witnesses for the first case. Do not divide by zero or treat a valid product as a defined ratio.',
    `A的${part}L↔${recoverRate}%，1%=${f(part, recoverRate)}L，100%=${f(part * 100, recoverRate)}L；乘${recoverRate}/100回${part}L。R>100%，已知需求大于正参考，故反求比${part}L小。B整体${fractionalPart}÷(40/100)=${dec(fractionalPart * 100, 40)}L，乘40%回${fractionalPart}L；截去0.5L会少0.2L，错误。A率100%则整体${part}L。零率零已知：0=0×W，例W=10L与20L都满足，不能唯一；正${part}=0×W无解；正率且已知0要求W=0，但0/0不定义占比，不能给一个合法正整体。三个结论不能都叫“答案0”。`,
    `A: ${part}L↔${recoverRate}%; 1%=${f(part, recoverRate)}L and 100%=${f(part * 100, recoverRate)}L. Multiplying by ${recoverRate}/100 restores ${part}L. With R>100%, the requirement exceeds the positive reference, so the reference is smaller. B gives ${fractionalPart}÷(40/100)=${dec(fractionalPart * 100, 40)}L; multiplication by 40% restores ${fractionalPart}L. Truncating its half-litre loses 0.2L on the inverse check. At 100%, A’s whole is ${part}L. For 0 at 0%, 0=0×W admits, for example, W=10L and 20L: not unique. Positive ${part}=0×W is inconsistent. Zero at positive R forces algebraic W=0, but 0/0 is undefined, not a legitimate positive-whole percentage. These are not three zero answers.`,
    '先按已知百分数放置已知量；零条件保留正整体的定义域。',
    'Place the known amount at its stated rate and preserve the positive-whole domain in zero cases.',
  );
  table(q5, [
    ['A_P', 'A已知需求/L', 'A known requirement/L', String(part)],
    [
      'R',
      'A对应率（正参考）',
      'A rate (positive reference)',
      `${recoverRate}%`,
    ],
    [
      'B_P',
      '独立B已知量/L',
      'Independent B known amount/L',
      String(fractionalPart),
    ],
    ['B_R', '独立B对应率', 'Independent B rate', '40%'],
  ]);

  const cents = near ? 4000 : 10000,
    discount = near ? 20 : 25,
    saved = (cents * discount) / 100,
    first = cents - saved,
    secondChange = (first * discount) / 100,
    last = first + secondChange;
  const recovery = pct(saved, first);
  const q6 = task(
    6,
    'percent-change-base',
    `① 价签标“付原价的${100 - discount}%（${near ? '八折' : '七五折'}）”，无税运费等。自画原价100%与新价的对应，求减少率、节省额和新价；为什么不是减去原价的${100 - discount}%？② 以新价为100%再涨原减少率，求第二次增加额、末价与相对最初变化率。另从第一步新价直接恢复原价，要增加多少金额、按哪一基数求精确涨幅？乘回验证，不把新价/原价的保留率误叫变化率。③ 独立检查0%变化与100%降价后恢复正原价：金额可算0，是否能据此定义以零为基数的相对恢复率？原价和全部价格只用假想整数分；若运算要求非整数分，应标明约定，不能静默舍入。`,
    `① A fictional label says “pay ${100 - discount}% of original”, with no extra fees. DRAW the original 100% and new-price correspondence; find the REDUCTION rate, savings and final price. Why is this not ${100 - discount}% OFF? ② Use the discounted price as the next 100% and increase it by the original REDUCTION rate. Find that increase, final price and net change relative to the original. SEPARATELY restore the original directly from the FIRST discounted price: recover the required money increase and EXACT relative rate using the proper base, then multiply back. Distinguish retained price ratio from change rate. ③ Independently check a zero rate and a 100% discount followed by attempted restoration. Does a zero money result define relative recovery from zero? Use fictional whole cents; state any convention if fractional cents arise, never silently round.`,
    `付${100 - discount}%是降${discount}%，不是降${100 - discount}%。原价${money(cents)}，节省${money(saved)}，新价${money(first)}。第二基数${money(first)}，涨${discount}%加${money(secondChange)}得${money(last)}；相对原价降${dec((cents - last) * 100, cents)}%，保留${dec(last * 100, cents)}%，二者不同。另恢复原价需加${money(saved)}，以${money(first)}为基数涨${recovery}，精确乘回${first}分×(1+${f(saved, first)})=${cents}分。不能照搬${discount}%。0%不改变原价；100%降价到0，0乘有限倍率仍0，恢复正价的相对率因除0未定义。这里各实际金额均整分；恢复率可精确为分数，不把它擅自舍入后承诺恢复。`,
    `Paying ${100 - discount}% means ${discount}% OFF, not ${100 - discount}% off. Original=${money(cents)}, savings=${money(saved)}, discounted=${money(first)}. Second base=${money(first)}; ${discount}% adds ${money(secondChange)} for ${money(last)}. Relative to the original, the decrease is ${dec((cents - last) * 100, cents)}% and retained price is ${dec(last * 100, cents)}%, different questions. SEPARATE restoration needs ${money(saved)} added to base ${money(first)}, a rise of EXACTLY ${recovery}: ${first} cents×(1+${f(saved, first)})=${cents} cents. Reusing ${discount}% fails. Zero rate changes nothing. A 100% discount reaches zero; finite multipliers leave it zero and relative recovery to a positive price is undefined because its base is zero. Actual money results here are whole cents; a fractional recovery RATE remains exact rather than silently rounded.`,
    '先把付出的比例与减少的比例相加核为100%；恢复率以降后的价格为分母。',
    'Check that retained plus removed proportions make 100%. Use the discounted price as the recovery-rate denominator.',
  );
  table(q6, [
    ['C', '原价/新西兰分', 'Original price/NZ cents', String(cents)],
    ['PAY', '需付原价比例', 'Retained price percentage', `${100 - discount}%`],
  ]);
  return {
    id: `${unit}-MAINT-PERCENT-MEANING`,
    unit,
    title: t(
      '每百份、正整体与恢复基数',
      'Per hundred, positive wholes and recovery bases',
    ),
    bridge: 'P62-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5, 6].map((n) => [id(n), `P62-L0${n}`]),
    ),
    intro: t(
      '六张纸笔过程卡可分多次，一次一个编号小问，不计时。先自己画图、列对应、写理由，再逐项人审。可口述或用熟悉语言，读题协助与数学提示分开。卡、需求和价格均假想，无需裁剪、倒水或购买。',
      'Six paper-and-pencil cards can span several sittings, ONE numbered part at a time without a timer. Generate diagrams, correspondences and reasons before human review of every part. Oral or familiar-language explanations are welcome; separate reading assistance from mathematical hints. Cards, requirements and prices are fictional; no cutting, pouring or purchase is needed.',
    ),
    questions: [q1, q2, q3, q4, q5, q6],
  };
};
export const percentMeaningRetrieval = {
  P65_PERCENT_MEANING: makeSet('P65'),
  P68_PERCENT_MEANING: makeSet('P68'),
};
