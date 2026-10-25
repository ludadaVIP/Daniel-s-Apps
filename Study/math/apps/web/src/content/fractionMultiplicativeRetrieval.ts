import { t, type Question } from '../model';
import { reasoning } from './builders';

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const f = (n: number, d: number) => {
  const g = gcd(n, d);
  return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`;
};
const makeSet = (unit: 'P63' | 'P67') => {
  const near = unit === 'P63';
  const id = (n: number) => `${unit}-MAINT-FRACTION-MULTIPLICATIVE-Q${n}`;
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
        '可分多次，一次只做一个编号小问。先画图、列式并写自己的理由，再请家长核全部小问；读题帮助与数学提示分开。',
        'Split this across sittings, doing ONE numbered part at a time. Draw, model and explain independently before a parent reviews EVERY part. Separate reading support from mathematical hints.',
      ),
    ]);
  const table = (q: Question, rows: [string, string, string, string][]) => {
    q.contextTable = {
      caption: t(
        '各编号给出本卡条件；另题或修改分支按题干区分。在纸上保留原整体与单位，不预填待求结果。',
        'IDs give this card’s conditions; distinguish separate questions or modified branches as the prompt specifies. Retain reference wholes and units on your own paper; requested results are not supplied.',
      ),
      columns: [t('编号', 'ID'), t('条件', 'Condition'), t('给定值', 'Given')],
      rows: rows.map(([key, z, e, v]) => [t(key, key), t(z, e), t(v, v)]),
    };
  };
  const count = near ? 3 : 4,
    rn = near ? 5 : 7,
    rd = near ? 4 : 5;
  const q1 = task(
    1,
    'repeat-fraction',
    '① R每组本身超过一个单位。先估总量落在哪两个相邻整数米之间，再画每组的固定1m框，保留每个小份大小，用重复相加求精确总长。有人把组数同时乘进分子分母，得到的是什么量？用估量和逐组相加反驳。② 保留R组数，改成每组零米；再比较零组与一组原长，分别画图并说明。③ 把数值交换写成“每组长=原组数米，取原分数个组”，乘积数值可相同，它还是整数个相同模型的制作情境吗？说明整数组数与每组长度的角色，不能只用交换律替代解释。',
    '① Each R group already exceeds one unit. FIRST estimate between adjacent whole metres, then DRAW fixed 1m frames for EACH group and add equal small pieces for the exact total. What quantity results from multiplying BOTH numerator and denominator by the group count? Refute it through estimation and repeated addition. ② Keep R’s count but use zero metres per group; separately draw zero and one group of the ORIGINAL length. Explain each. ③ Swapping numerical factors gives the original whole-number count in metres per group and a fractional group count. The product may agree: is this still production of a WHOLE NUMBER of identical models? Distinguish count from length rather than citing commutativity alone.',
    `R为${count}组各${rn}/${rd}m，合${count * rn}个1/${rd}m，精确${f(count * rn, rd)}m，在${Math.floor((count * rn) / rd)}与${Math.floor((count * rn) / rd) + 1}m之间。各组跨一米仍每米${rd}小份。错误${count * rn}/${count * rd}=${rn}/${rd}m只等值改写一组，未合并${count}组。${count}组各0得0m，零组原长也0m，一组${rn}/${rd}m；前者有${count}个零长贡献、后者无贡献，图/角色不同。交换后是每组${count}m、${rn}/${rd}组，数值仍${f(count * rn, rd)}m，但分数组不再满足整数个完整模型的条件，须另作可分量解释。`,
    `R: ${count} groups of ${rn}/${rd}m make ${count * rn} pieces of 1/${rd}m, total ${f(count * rn, rd)}m, between ${Math.floor((count * rn) / rd)} and ${Math.floor((count * rn) / rd) + 1}m. Each metre retains ${rd} equal parts even beyond one metre. Wrong ${count * rn}/${count * rd}=${rn}/${rd}m only rewrites ONE group. ${count} zero-length contributions give 0m; zero original groups also give 0m but have no contributions; one original group gives ${rn}/${rd}m. Swapping produces ${count}m per group and ${rn}/${rd} groups, numerically the same ${f(count * rn, rd)}m but outside the WHOLE-model-count condition unless a divisible-amount interpretation is supplied.`,
    '先画每组的一米标尺，再数原单位小份；总量相同不代表组数角色相同。',
    'Draw one-metre references for each group and count original pieces. Equal numerical totals do not identify the same count role.',
  );
  table(q1, [
    ['R_N', '完整模型个数', 'Whole model count', String(count)],
    ['R_L', '每个模型用带/m', 'Tape per model/m', `${rn}/${rd}`],
  ]);

  const an = near ? 5 : 7,
    ad = near ? 3 : 4,
    bn = near ? 4 : 6,
    bd = near ? 3 : 5;
  const cn = near ? 3 : 5,
    cd = near ? 4 : 6,
    dd = near ? 5 : 7;
  const q2 = task(
    2,
    'fraction-area-product',
    '① A、B均为无单位的原单位框比例。画两个方向的等分与交叠，两个因子都超过一时，原一框每格多大、总重叠多少格、跨几框，乘积是多少个原整体？空白和整个扩展画布都不能重新当一；格子必须等面积，必须是正方形吗？② 另画2×2，说明为何得四个原整体而不是一；保A并把B依次换为0和1，正A乘大于一、介于零与一、等于一或零时怎样变化？若原量为零，乘大于一还会严格增大吗？③ C×D先写完整分子/分母乘积再约分，解释交叉约去的相同因子。只有面积比例而未给米制边长时，能把答案直接称m²吗？',
    '① A and B are DIMENSIONLESS ratios to the original unit frame. DRAW both partitions and overlaps with BOTH factors above one. Label cell area per original frame, overlap count, frames spanned and product in original wholes. Neither blanks nor the expanded canvas redefine one. Must equal-area cells be squares? ② Separately draw 2×2: why FOUR original wholes? Keep A and replace B with 0 then 1. Explain effects of factors above one, strictly between zero and one, one and zero on positive A. Does multiplying ZERO by a factor above one strictly increase it? ③ Write the full numerator/denominator product for C×D BEFORE cancelling and identify the common factor removed. Without physical side lengths in metres, is m² justified?',
    `A×B=${an}/${ad}×${bn}/${bd}=${an * bn}/${ad * bd}=${f(an * bn, ad * bd)}个原整体；每原框${ad * bd}等面积格、重叠${an * bn}格，横跨2框纵跨2框的画布不重定义整体。等面积矩形即可不必正方。2×2有四个1框，结果4；正A乘0为0、乘1为A，乘大于1增、介于0和1减。0乘任意合法因子仍0，不能严格增。C×D=${cn}/${cd}×${cd}/${dd}=${cn * cd}/${cd * dd}，整体分子分母同除非零${cd}得${cn}/${dd}，不是改小份后又改整体。这里只有原整体比例，无米制边长不能宣称m²。`,
    `A×B=${an}/${ad}×${bn}/${bd}=${an * bn}/${ad * bd}=${f(an * bn, ad * bd)} original wholes. Each original frame has ${ad * bd} equal-area cells and ${an * bn} cells overlap. A two-by-two-frame CANVAS retains four separate original wholes. Equal-area rectangles need not be squares. 2×2 covers four unit frames. Positive A times 0 gives 0, times 1 gives A, times above one increases and times strictly between zero and one decreases; zero remains zero, not a strict increase. C×D=${cn}/${cd}×${cd}/${dd}=${cn * cd}/${cd * dd}; divide the WHOLE numerator and denominator by nonzero ${cd} to get ${cn}/${dd}. These are dimensionless area ratios, not m² without metric side lengths.`,
    '在扩展画布内标出每一个原1框；约分同时作用于完整乘积的分子和分母。',
    'Mark every original unit frame within the canvas. Cancellation divides the complete product numerator and denominator by the same factor.',
  );
  table(q2, [
    ['A', '第一比例', 'First ratio', `${an}/${ad}`],
    ['B', '第二比例', 'Second ratio', `${bn}/${bd}`],
    ['C', '简算第一因子', 'Cancellation first factor', `${cn}/${cd}`],
    ['D', '简算第二因子', 'Cancellation second factor', `${cd}/${dd}`],
  ]);

  const whole = near ? 7 : 11,
    pn = near ? 2 : 3,
    pd = near ? 3 : 7;
  const q3 = task(
    3,
    'fraction-of-amount',
    '① W连续水量取F，先自画“整条代表W升”的条，不把整条当一升。标每份升数、选出量、剩量，精确分数相加核回总量。若把所选量约为两位小数，仍能声称这是精确结果吗？② 两个独立修改：总水加倍而F不变；或原W不变、只把F分子减一。分别重画/重求，说明改变的是整体还是选份数。再核F=0、F=1和总水为0。③ 把原W升改为W张不可分的完整卡，仍要求恰取F：算式的分数值能说明可以剪卡或四舍五入吗？解释连续水量与本题整卡约束的不同。相同数字若单位换克，结果应写什么单位？',
    '① Take fraction F of continuous water W. DRAW a bar whose whole is W L, not 1 L. Label litres per share, selected litres and remainder, and restore W EXACTLY. Is a two-decimal approximation still exact? ② Consider SEPARATE changes: double W while retaining F; OR retain original W and reduce ONLY F’s numerator by one. Redraw/recalculate and explain which changes the reference amount versus selected share count. Check F=0, F=1 and zero water. ③ Replace W litres by W INDIVISIBLE whole cards and still demand EXACTLY F. Does the fractional calculation authorise cutting or rounding? Explain the different constraints. If the original unit were grams, what unit would the selected amount have?',
    `W=${whole}L，每份${whole}/${pd}L，取${pn}份为${f(whole * pn, pd)}L，剩${f(whole * (pd - pn), pd)}L，和${whole}L。约${((whole * pn) / pd).toFixed(2)}L不是精确${f(whole * pn, pd)}L。水加倍每份${2 * whole}/${pd}L，取${f(2 * whole * pn, pd)}L；只减分子则每份仍${whole}/${pd}L、选${pn - 1}份得${f(whole * (pn - 1), pd)}L，两类变化不同。F=0取0L，F=1取全部${whole}L；0L的合法分数仍0L。${whole}张整卡的F算值${f(whole * pn, pd)}张非整数，本题不允许剪卡，不能恰实现；四舍五入改变比例，不能据此宣布满足题意。连续水可细分，克量结果随单位为g，比例F本身不带L或g。`,
    `W=${whole}L: one share=${whole}/${pd}L; selected=${f(whole * pn, pd)}L; remainder=${f(whole * (pd - pn), pd)}L; their exact sum is ${whole}L. Approximate ${((whole * pn) / pd).toFixed(2)}L is not exact ${f(whole * pn, pd)}L. Doubling W changes each share to ${2 * whole}/${pd}L and selection to ${f(2 * whole * pn, pd)}L. Reducing only the numerator keeps each original share ${whole}/${pd}L and selects ${pn - 1} shares=${f(whole * (pn - 1), pd)}L. F=0 selects 0L; F=1 selects ${whole}L; zero water gives zero. For ${whole} INDIVISIBLE cards, ${f(whole * pn, pd)} is nonintegral, so the exact demand is infeasible under the no-cutting condition; rounding changes the proportion. Water can be subdivided. With grams the result is g; F itself has no L or g unit.`,
    '先注明整条的实际量，每份=整体÷分母；不可分物件的情境条件必须另核。',
    'Label the actual whole first: each share is whole divided by denominator. Separately check indivisibility constraints.',
  );
  table(q3, [
    [
      'W',
      '原总水/L，或另一分支整卡数',
      'Original total/L, or whole cards in separate branch',
      String(whole),
    ],
    ['F', '原选择比例', 'Original selection ratio', `${pn}/${pd}`],
  ]);

  const sn = near ? 7 : 11,
    sd = near ? 4 : 6,
    people = near ? 3 : 4;
  const q4 = task(
    4,
    'fraction-sharing',
    '① S总彩带超过一米，平均给K人。画固定1m框，先把每个原小份继续等分K份，标新小份米数、全部小份数和每人同色小份数，再求每人精确长度并乘回。分子不能先整除K，能否据此拒绝均分连续彩带？② 分子分母都乘K只是等值改写还是每人长度？若错给每人这个量，实际需要多少总带？③ 另核一人取全、零总带给正K人和零人。每段只保留两位小数再合起来能保证原量精确不丢吗？保留分数表达。',
    '① S exceeds one metre and is shared equally among K people. DRAW fixed 1m frames, subdivide EACH old part into K pieces and label new piece length, total pieces and equal same-colour pieces per person. Find each EXACT share and multiply back. If the numerator is not divisible by K, is sharing continuous ribbon impossible? ② Does multiplying BOTH numerator and denominator by K give an equivalent total or each share? How much total ribbon would that WRONG allocation require? ③ Check one person, zero ribbon with positive K and zero people separately. Does rounding every length to two decimals guarantee exact reconstruction? Retain fractions.',
    `原小份1/${sd}m细分为1/${sd * people}m，${sn}个原份共有${sn * people}个新份；${people}人各${sn}个，得${sn}/${sd * people}=${f(sn, sd * people)}m。核${people}×${f(sn, sd * people)}=${sn}/${sd}m。无需先用${sn}整除${people}，可细分连续长度。${sn * people}/${sd * people}=${sn}/${sd}m仅是总量等值改写，若每人给它需${f(sn * people, sd)}m，为原量${people}倍。1人得全部${sn}/${sd}m；零总带给${people}人每人0m；0人不满足正整数份数、不可定义本题均分。近似${(sn / (sd * people)).toFixed(2)}m乘${people}不等精确原量，不能用舍入长度承诺精确守恒。`,
    `An old 1/${sd}m part becomes K pieces of 1/${sd * people}m. The ${sn} old parts yield ${sn * people} new pieces, ${sn} per person; each gets ${sn}/${sd * people}=${f(sn, sd * people)}m. Multiply ${people}×${f(sn, sd * people)}=${sn}/${sd}m. Subdivision avoids requiring ${sn} to divide by ${people} as a whole number. Equivalent ${sn * people}/${sd * people}=${sn}/${sd}m is still the TOTAL, not each share; giving it to every person requires ${f(sn * people, sd)}m, ${people} times the supply. One person gets ${sn}/${sd}m; zero total with positive K gives 0m each; zero people violates the positive-count condition. Approximate ${(sn / (sd * people)).toFixed(2)}m times ${people} does not restore the exact original length.`,
    '细分没有增加带长；给每人量必须把所有人的量合回原总量。',
    'Subdivision adds no length. Combine all people’s shares to check the original total.',
  );
  table(q4, [
    ['S', '总带长/m', 'Total ribbon/m', `${sn}/${sd}`],
    ['K', '人数（正整数）', 'People (positive whole count)', String(people)],
  ]);

  const total = near ? 2 : 3,
    gn = near ? 1 : 3,
    gd = near ? 3 : 4;
  const exact = (total * gd) / gn;
  const q5 = task(
    5,
    'fraction-measurement-division',
    '① T升水按每份G升量取，亲画共同小份，分别求精确标准份数、满份数、余升和余量占标准份的比例。恰好量尽时，“还剩一个零份”是必须新增的容器吗？写乘回与“满份×每份+余量”两条核查。② 总量保T，标准改1L，再把总量改0而标准保原G，分别核三类结果；另回到原非零T，每份量改0为何不能报告无限个份？③ 与另题“T升平均分给D人”比较。分别标已知的是人数还是每份升数、所求单位与精确结果；D取G的分母，不得把两个不同未知量都称为升。',
    '① Measure T L using G L per standard group. DRAW common small pieces; report exact groups, FULL groups, remaining L and remainder as a fraction of a STANDARD group. If the total is exactly exhausted, does a zero remainder require one extra container? Write quotient×standard and full×standard+remainder checks. ② Keep T and change the standard to 1L; separately use zero total with the ORIGINAL positive G. Report exact groups/full groups/remainder. Return to the ORIGINAL positive T: why does standard size zero NOT give an infinite group count? ③ Compare the SEPARATE question “share T L among D people”, where D is G’s denominator. Identify which gives a count versus litres per group, and retain the requested unit and exact result.',
    `T=${total}L，G=${gn}/${gd}L；每小份1/${gd}L，总${total * gd}小份、每标准${gn}小份，精确${exact}份、满${exact}份、余0L=0标准份，不需额外空容器。${exact}×${gn}/${gd}=${total}L，${exact}×${gn}/${gd}+0=${total}L。每份1L时${total}份、满${total}份、余0L；零总量且原G正则0份、满0份、余0L。每份0没有可逆乘法关系，q×0不能恢复非零${total}L，不给无限值。另题${total}L平均给${gd}人，求每人${f(total, gd)}L，核${gd}×${f(total, gd)}=${total}L；测量题已知每份升数求份数，分享题已知人数求每人升数。`,
    `T=${total}L and G=${gn}/${gd}L. With 1/${gd}L pieces, ${total * gd} are available and ${gn} form each group. Exact groups=${exact}, full groups=${exact}, remainder=0L=0 standard groups; NO extra empty container is required. ${exact}×${gn}/${gd}=${total}L and ${exact}×${gn}/${gd}+0=${total}L. Standard 1L gives ${total} exact/full groups and 0L left; zero total with original positive G gives zero exact/full groups and 0L left. A zero standard would require q×0=${total}, impossible, not infinity. SEPARATE sharing: ${total}L among ${gd} people gives ${f(total, gd)}L EACH and ${gd}×${f(total, gd)}=${total}L. Measurement gives size and seeks count; sharing gives count and seeks size.`,
    '先写商的对象：标准份数还是每人升数？余量零无需添一份。',
    'Identify the quotient: standard groups or litres per person? Zero remainder needs no extra group.',
  );
  table(q5, [
    ['T', '已有水/L', 'Available water/L', String(total)],
    ['G', '标准每份/L', 'Standard group/L', `${gn}/${gd}`],
    [
      'D',
      '另题平均分享人数',
      'People in separate sharing question',
      String(gd),
    ],
  ]);

  const un = near ? 7 : 5,
    ud = near ? 8 : 6,
    vn = near ? 2 : 3,
    vd = near ? 3 : 4;
  const common = (ud * vd) / gcd(ud, vd),
    available = (un * common) / ud,
    per = (vn * common) / vd;
  const remainder = available % per;
  const q6 = task(
    6,
    'reciprocal-reasoning',
    '① U升按每份V升量取。先亲画共同小份，写每小份单位、已有几个和一份需要几个，推出精确商；再把每个小份一分二，数值为何不变？共同分母必须最小吗？报满份数、余升及余量占标准份的比例并乘回。② 从q×V=U说明该乘谁的倒数，写它与V乘积为一，再核q。倒数与相反数的检验关系相同吗？③ 推广a/b÷c/d：先以1/(bd)为共同小份，分别数已有ad个与每份bc个，再连接到a/b×d/c。指出b、d、c条件；零被除数、非零量除零与0÷0分别怎样，不用“反正都翻一下”作理由。',
    '① Measure U L in groups of V L. FIRST DRAW a common partition and label piece size, pieces available and pieces per group to derive the exact quotient. Split EACH piece in two: why is the quotient unchanged, and must the common denominator be least? Report full groups, remainder L and fraction of a standard, then multiply back. ② From q×V=U, identify WHICH reciprocal to use, show its product with V is one and verify q. Do reciprocals and additive opposites have the same test? ③ Generalise a/b÷c/d using 1/(bd) pieces: ad available versus bc per group, then connect with a/b×d/c. State conditions on b,d,c. Distinguish zero dividend, nonzero dividend over zero and 0÷0 without an unconditional flipping rule.',
    `用1/${common}L，已有${available}份、每标准${per}份，q=${available}/${per}=${f(available, per)}份；细分1/${2 * common}L后${2 * available}/${2 * per}同商，不必最小。满${Math.floor(available / per)}份，余${f(remainder, common)}L，占标准${f(remainder, per)}；q×${vn}/${vd}=${un}/${ud}L。V倒数${vd}/${vn}与V乘1，故q=${un}/${ud}×${vd}/${vn}，保原U不翻；相反数−${vn}/${vd}是与V相加为0，不是乘1。一般b,d为正整数，c非零（此非负量模型c>0），小份1/(bd)，已有ad个、每份bc个，商ad/(bc)=a/b×d/c。a=0且c非零给q=0；非零量除0要求q×0非零，无解；0÷0任意q乘0皆0，不唯一，两种均不能定义除零。`,
    `Use 1/${common}L pieces: ${available} available and ${per} per standard, so q=${available}/${per}=${f(available, per)} groups. Halving pieces gives 1/${2 * common}L and ${2 * available}/${2 * per}, the SAME quotient; least denominators are unnecessary. Full groups=${Math.floor(available / per)}, remainder=${f(remainder, common)}L, or ${f(remainder, per)} of a standard. q×${vn}/${vd}=${un}/${ud}L. V’s reciprocal ${vd}/${vn} multiplies V to ONE, hence q=${un}/${ud}×${vd}/${vn}; keep U. Additive opposite −${vn}/${vd} instead adds to ZERO. Generally b,d are positive whole numbers and c is nonzero (c>0 in this nonnegative model). With 1/(bd) pieces, ad are available and bc form a group: ad/(bc)=a/b×d/c. Zero dividend with nonzero divisor gives q=0. A nonzero dividend over zero has no q×0 solution; 0÷0 has MANY, not a unique quotient. Neither defines division by zero.`,
    '先比较相同小份的个数；细分使已有和每份的个数同倍变化，倒数只消去原除数。',
    'Compare counts of IDENTICAL pieces first. Subdivision scales both counts equally; the reciprocal cancels the original divisor.',
  );
  table(q6, [
    ['U', '已有量/L', 'Available amount/L', `${un}/${ud}`],
    ['V', '标准每份/L', 'Standard group/L', `${vn}/${vd}`],
  ]);

  return {
    id: `${unit}-MAINT-FRACTION-MULTIPLICATIVE`,
    unit,
    title: t(
      '原整体、小份与分数乘除的角色',
      'Reference wholes, equal pieces and fraction operation roles',
    ),
    bridge: 'P61-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5, 6].map((n) => [id(n), `P61-L0${n}`]),
    ),
    intro: t(
      '六张纸笔过程卡可分多次，一次只做一个编号小问。重画原整体、小份与数量关系；家长逐项看理由，不凭关键词自动通过。均为纸上假想，可口述或用熟悉语言；读题帮助与数学提示分开，无需实际裁剪、倒水或采购。',
      'Six paper-and-pencil reasoning cards can span several sittings. Do ONE numbered part at a time; reconstruct original wholes, small pieces and quantity roles. A parent reviews each argument; keywords do not grant credit. All contexts are fictional paper models, with oral or familiar-language explanations welcome. Separate reading help from mathematical hints; no actual cutting, pouring or purchase is required.',
    ),
    questions: [q1, q2, q3, q4, q5, q6],
  };
};
export const fractionMultiplicativeRetrieval = {
  P63_FRACTION_MULTIPLICATIVE: makeSet('P63'),
  P67_FRACTION_MULTIPLICATIVE: makeSet('P67'),
};
