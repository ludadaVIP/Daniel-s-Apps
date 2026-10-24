import { t } from '../model';
import { reasoning } from './builders';

const makeSet = (unit: 'H31' | 'H35') => {
  const first = unit === 'H31',
    id = (i: number) => `${unit}-MAINT-EXP-LOG-Q${i}`;
  const task = (
    i: number,
    skill: string,
    zh: string,
    en: string,
    sz: string,
    se: string,
    hz: string,
    he: string,
  ) =>
    reasoning(id(i), t(zh, en), skill, t(sz, se), [
      t(hz, he),
      t(
        '先写定义域和所用定律的前提，再核精确结果；样点、反例与一般推导的作用不同。',
        'State the domain and premises of each law before checking exact results. Samples, counterexamples and general derivations serve different purposes.',
      ),
    ]);
  return {
    id: `${unit}-MAINT-EXP-LOG`,
    unit,
    bridge: 'H03-L01',
    bridgeByQuestion: Object.fromEntries(
      ['H03-L01', 'H03-L02', 'H03-L06', 'H03-L04', 'H03-L05'].map((l, i) => [
        id(i + 1),
        l,
      ]),
    ),
    title: t(
      '求导与方程之后，再核指数和对数',
      'After derivatives and equations, recheck powers and logarithms',
    ),
    intro: t(
      '五题分次，每次一题，可用纸笔；全部理由由家长核验，不计时。模型数值为虚构题设，不是实际测量结论。',
      'Choose one of five tasks per sitting, using paper if helpful. Every argument is human-reviewed without a timer. Model values are fictional givens, not claims from real measurements.',
    ),
    questions: [
      task(
        1,
        'exponent-laws-reciprocal',
        first
          ? '计算3⁻²×3⁵、3²+3³、(−2)⁴与−2⁴。说明哪一步可以加指数、括号为何改变符号；从aⁿa⁻ⁿ=1解释倒数与a≠0。有人把0⁻²写成0，用乘回检验纠错。'
          : '计算5³÷5⁵、5²+5³、(−3)²与−3²。说明哪一步可以减指数、括号为何改变符号；从aⁿa⁻ⁿ=1解释倒数与a≠0。有人把0⁻³写成0，用乘回检验纠错。',
        first
          ? 'Calculate 3⁻²×3⁵, 3²+3³, (−2)⁴ and −2⁴. Explain which operation adds exponents and why parentheses affect the sign. Derive the reciprocal and a≠0 from aⁿa⁻ⁿ=1. Audit the claim 0⁻²=0 by multiplying back.'
          : 'Calculate 5³÷5⁵, 5²+5³, (−3)² and −3². Explain which operation subtracts exponents and why parentheses affect the sign. Derive the reciprocal and a≠0 from aⁿa⁻ⁿ=1. Audit the claim 0⁻³=0 by multiplying back.',
        first
          ? '同底相乘才加指数：3³=27；加法为9+27=36，不是3⁵。括号把−2整体作底，四次乘得16；−2⁴表示先2⁴再取负，为−16。n为正整数、a≠0时aⁿ非零，从aⁿa⁻ⁿ=1唯一得a⁻ⁿ=1/aⁿ；若a=0，0ⁿ乘任何实数都0，不可能等于1，故0负指数无定义。'
          : '同底相除且底非零才减指数：5⁻²=1/25；加法25+125=150，不是5⁵。括号的负底平方得9，−3²先平方再取负得−9。n为正整数、a≠0时aⁿa⁻ⁿ=1给a⁻ⁿ=1/aⁿ；a=0会要求0乘一个实数等于1，不可能，故0⁻³无定义。',
        first
          ? 'Multiplication of equal nonzero bases adds exponents: 3³=27. Addition instead gives 9+27=36, not 3⁵. Parentheses make negative two the whole base, giving sixteen; −2⁴ means the negative of 2⁴, giving −16. For positive integer n and a≠0, aⁿ is nonzero and aⁿa⁻ⁿ=1 uniquely gives a⁻ⁿ=1/aⁿ. If a=0, zero times any real number is zero, never one; a negative power of zero is undefined.'
          : 'Division of equal nonzero bases subtracts exponents: 5⁻²=1/25. Addition gives 25+125=150, not 5⁵. Squaring the parenthesised negative base gives nine; −3² is the negative of 3², hence −9. For positive integer n and a≠0, aⁿa⁻ⁿ=1 gives a⁻ⁿ=1/aⁿ. With a=0 it would require zero times a real number to equal one, which is impossible, so 0⁻³ is undefined.',
        '先标底数、指数和运算，再用“乘什么才回到1”查负指数。',
        'Mark each base, exponent and operation, then ask what factor makes the product one.',
      ),
      task(
        2,
        'exponent-rational-root',
        `在正底数约定下，用先求正四次根再取倒数三次方解释${first ? '16' : '81'}^(−3/4)，同时验证四次根和最终值。再审负底数${first ? '(−27)^(2/6)' : '(−32)^(2/10)'}：先平方再偶次根与先约分再取奇次根为何给相反符号？能把正底数定律原样用于此处吗？`,
        `Under the positive-base convention, explain ${first ? '16' : '81'}^(−3/4) by taking its positive fourth root and then the reciprocal cube. Verify both root and result. Audit negative-base ${first ? '(−27)^(2/6)' : '(−32)^(2/10)'}: why do squaring before an even root and reducing before an odd root give opposite signs? May the positive-base laws be transferred unchanged?`,
        first
          ? '正四次根2，因为2⁴=16；16^(−3/4)=2⁻³=1/8，倒数来自非零正根。正a、整数m和正整数n下，以唯一正n次根r定义a^(m/n)=rᵐ，与等值分数一致。负底例先平方得729，正六次根3；但2/6=1/3取实立方根为−3。不能同时把两流程当同一普遍定律；正底前提被破坏。若另给约分后奇分母的实根定义，须明确采用该约定，而不能借未约分偶根随意重排。'
          : '正四次根3，因为3⁴=81；81^(−3/4)=3⁻³=1/27。对正a，用唯一正n次根定义有理指数，负指数还用非零根的倒数。负底例先平方得1024，正十次根2；2/10=1/5的实五次根却为−2。相反号说明不能丢正底前提后还无条件交换步骤。另定约分后奇分母的实根可以，但必须保该定义，不能混用未约分偶根来宣称两值相等。',
        first
          ? 'The positive fourth root is two because 2⁴=16, hence 16^(−3/4)=2⁻³=1/8. For positive a, integer m and positive integer n, define a^(m/n)=rᵐ using the unique positive nth root r; equivalent fractions agree. In the negative-base example, squaring gives729 with positive sixth root three, while reducing2/6 to1/3 gives real cube root−3. These cannot both be an unrestricted identity: the positive-base premise failed. A separately declared reduced odd-denominator convention may define real roots, but cannot justify freely reordering an unreduced even-root procedure.'
          : 'The positive fourth root is three since3⁴=81, so81^(−3/4)=3⁻³=1/27. Positive-base rational powers use a unique positive nth root, with reciprocals for negative exponents. For the negative base, squaring gives1024 with positive tenth root two; reducing2/10 to1/5 gives real fifth root−2. Opposite signs expose the lost positive-base premise. A separate reduced odd-denominator convention is possible, but must not be mixed with an unreduced even-root procedure to claim the two values are equal.',
        '先确认底数范围；负底反例比较的是两套流程，不是同一个数既等于正又等于负。',
        'Check the base domain first. The negative-base example compares incompatible procedures, not a single number equal to both signs.',
      ),
      task(
        3,
        'exponential-model-threshold',
        first
          ? '虚构储量按模型M(t)=3×2ᵗ，t为从0起的实数小时，M单位为L。另给仅两次观测(0,3),(1,6)：这些点单独能确定模型吗？求模型内M至少20L的完整实数时间集；若只在整数小时检查，首个允许时刻是多少？给精确阈值并用相邻整数原式核验。把时间改成天d，写M与一天倍率，说明适用范围。'
          : '虚构余量按模型M(t)=80×(1/2)ᵗ，t为从0起的实数天，单位为g。另给仅两次观测(0,80),(1,40)：这些点单独能确定模型吗？求模型内M至多12g的完整实数时间集；若只在整数天检查，首个允许时刻是多少？给精确阈值并用相邻整数原式核验。把时间改成小时h，写M与每小时倍率，说明适用范围。',
        first
          ? 'A fictional model gives M(t)=3×2ᵗ litres for real hours t≥0. Separately, only two observations (0,3),(1,6) are available: do they alone identify this model? Find the complete real time set where the model gives at least20L, and the first qualifying integer hour if checks occur only then. Give an exact threshold and verify adjacent integers in the original rule. Rewrite in days d, state the one-day multiplier and discuss the scope.'
          : 'A fictional model gives M(t)=80×(1/2)ᵗ grams for real days t≥0. Separately, only observations (0,80),(1,40) are available: do they alone identify the model? Find the complete real time set giving at most12g and the first qualifying integer day if checks occur only then. Give the exact threshold and verify adjacent integers in the original rule. Rewrite in hours h, state the hourly multiplier and discuss the scope.',
        first
          ? '两点不足：3(1+t)也过两点而t2给9L，指数模型给12L。须额外承诺相等时间恒定倍率2及允许连续时间，不能由整数记录擅加半小时。给定模型严格增，3×2ᵗ≥20等价t≥log₂(20/3)，故实域解[log₂(20/3),∞)小时。t2得12<20、t3得24≥20，首个整数3；不是把小数四舍五入。t=24d，M=3×(2²⁴)ᵈ，每日倍率2²⁴，不是2。所有结论依给定模型与单位，有限吻合不能保证现实永远按此翻倍。'
          : '两点不足：80/(t+1)在t≥0也过两点，t2给80/3而指数给20g。连续域与等时倍率1/2须作为额外模型假设。因0<1/2<1，函数递减，(1/2)ᵗ≤3/20等价t≥log_(1/2)(3/20)，方向反转；实域解从该正阈值起到∞。t2得20>12、t3得10≤12，首个整数日3，不靠四舍五入。t=h/24，M=80×((1/2)^(1/24))ʰ，每小时倍率为(1/2)^(1/24)，不是1/2。结论是模型内的，记录吻合不保证长期机制不变。',
        first
          ? 'Two points are insufficient:3(1+t) also matches them but gives nine at t2 instead of the exponential twelve. Constant multiplier two over equal intervals and continuous-time extension are additional assumptions; integer records alone do not authorise half-hour queries. The stipulated model increases, so3×2ᵗ≥20 iff t≥log₂(20/3). The complete real set is[log₂(20/3),∞) hours. At2 it gives12<20; at3,24≥20,so the first integer is three, not a rounded decimal threshold. With t=24d, M=3×(2²⁴)ᵈ and the daily multiplier is2²⁴. These are conditional model conclusions, not proof of perpetual real doubling.'
          : 'Two points are insufficient:80/(t+1) also matches them for t≥0 but gives80/3 at t2 instead of twenty. Continuous time and equal-interval multiplier1/2 are additional assumptions. Because the base lies between zero and one,the model decreases: (1/2)ᵗ≤3/20 iff t≥log_(1/2)(3/20), reversing the comparison. The complete real set runs from this positive threshold to infinity. At2,the original model gives20>12; at3,10≤12,so the first integer day is three without rounding. With t=h/24, M=80×((1/2)^(1/24))ʰ, giving hourly multiplier(1/2)^(1/24), not1/2. Matching records do not guarantee an unchanged long-term mechanism.',
        '分别标出“题设指定模型”和“只有两次观测”；先查增减方向，再选实数或整数域，并换算单位。',
        'Separate a stipulated model from just two observations. Check increasing/decreasing direction, real versus integer time, and unit conversion.',
      ),
      task(
        4,
        'log-inverse-domain',
        `把log_${first ? 4 : 9}(${first ? '1/8' : '1/27'})=y改写为指数式，求精确y并乘回核验。另分别解释log₂(−1)、log₁1为何无本课实数对数：哪个无解、哪个不唯一？0<b<1是否也能有唯一逆？说明合法底数与真数的完整条件。`,
        `Rewrite log_${first ? 4 : 9}(${first ? '1/8' : '1/27'})=y as an exponential equation and find y exactly, checking it back. Explain why log₂(−1) and log₁1 are undefined as real logarithms in this course: which has no solution and which lacks uniqueness? Can0<b<1 also give a unique inverse? State all base and argument conditions.`,
        `${first ? '4ʸ=1/8，把4写2²得2^(2y)=2⁻³' : '9ʸ=1/27，把9写3²得3^(2y)=3⁻³'}，合法底严格单调故2y=−3，y=−3/2；${first ? '4^(−3/2)=1/(√4)³=1/8' : '9^(−3/2)=1/(√9)³=1/27'}。2ʸ始终正，负真数无实解；1ʸ恒1，有所有实y解却不能唯一反求。合法b>0、b≠1、真数u>0；0<b<1严格递减仍覆盖正数且一一，所以也有唯一逆，只是不等式方向随递减反转。底0或负底不属于任意实指数的此模型。`,
        `${first ? '4ʸ=1/8 becomes2^(2y)=2⁻³' : '9ʸ=1/27 becomes3^(2y)=3⁻³'}. Strict monotonicity for the valid base gives2y=−3, so y=−3/2. Substitution gives${first ? '1/(√4)³=1/8' : '1/(√9)³=1/27'}. Since2ʸ is always positive,the negative argument has no real exponent solution. Since1ʸ is always one,every real exponent solves1ʸ=1,so uniqueness fails. Real logarithms require b>0,b≠1 and argument u>0. A base between zero and one is strictly decreasing but still one-to-one onto positive values,so it has a unique inverse; inequality comparisons reverse. Zero or negative bases are outside this arbitrary-real-exponent model.`,
        '对数是“唯一反求指数”，必须同时有解且唯一；下降函数也可能一一对应。',
        'A logarithm recovers a unique exponent: both existence and uniqueness matter. A decreasing function can still be one-to-one.',
      ),
      task(
        5,
        'log-laws-domain',
        `写a>0、a≠1、u,v>0，用u=aᵖ、v=aᑫ推导乘积和商的对数律。用${first ? 'log₂(8+8)' : 'log₃(9+9)'}反驳和式拆对数。再解${first ? 'log₂(x−2)+log₂(x+2)=5' : 'log₃(x−1)+log₃(x+1)=2'}，写原定义域、全部代数候选和完整实解集；乘积为正为何不能代替两真数分别为正？`,
        `With a>0,a≠1,u,v>0,derive the product and quotient logarithm laws from u=aᵖ,v=aᑫ. Refute splitting a sum using${first ? 'log₂(8+8)' : 'log₃(9+9)'}. Solve${first ? 'log₂(x−2)+log₂(x+2)=5' : 'log₃(x−1)+log₃(x+1)=2'}, giving the original domain, all algebraic candidates and the complete real solution set. Why cannot a positive product replace separate positivity of both arguments?`,
        first
          ? 'uv=a^(p+q)、u/v=a^(p−q)，由唯一逆得logₐ(uv)=p+q、logₐ(u/v)=p−q，先保正真数及合法底。和式log₂16=4，而log₂8+log₂8=6，故拆和错误。原方程需x−2>0且x+2>0，交x>2；此域合并为log₂(x²−4)=5，得x²−4=32，候选±6。−6使两真数均负，虽乘积32仍不允许；6给log₂4+log₂8=2+3=5，完整集{6}。'
          : 'uv=a^(p+q)、u/v=a^(p−q)，合法底和正真数下唯一逆给乘积/商对数分别为p+q/p−q。log₃18≠4，因为3⁴=81≠18，而log₃9+log₃9=4，故不能拆和。原方程需x>1；合并后x²−1=9，候选±√10。负根使两真数负，虽积9仍原式无定义；正根>1且两正真数积9，和对数为2，完整集{√10}。不能从合并式的定义域反向扩张原式。',
        first
          ? 'Since uv=a^(p+q) and u/v=a^(p−q),unique inverse exponents give logₐ(uv)=p+q and logₐ(u/v)=p−q under the stated premises. A sum does not split:log₂16=4,while log₂8+log₂8=6. The original equation needs x−2>0 AND x+2>0,so x>2. Only there may it merge to log₂(x²−4)=5,giving x²−4=32 and candidates±6. Negative six makes both arguments negative despite product32. Positive six checks as log₂4+log₂8=2+3=5,so the complete set is{6}.'
          : 'Since uv=a^(p+q) and u/v=a^(p−q),the unique inverse gives the product and quotient laws under valid-base and positive-argument premises. log₃18 is not four because3⁴=81≠18,while log₃9+log₃9=4,refuting sum splitting. The original equation requires x>1. Merging within that domain gives x²−1=9 and candidates±√10. The negative root makes both arguments negative despite their positive product. The positive root exceeds one and its positive arguments multiply to nine,so their logarithms sum to two. The complete set is{√10}; do not enlarge the original domain from the merged expression.',
        '先写两个真数各自的条件；代数方程找候选，原式和原域决定保留谁。',
        'Write each argument condition separately. Algebra produces candidates; the original expression and domain determine which survive.',
      ),
    ],
  };
};
export const exponentialLogRetrieval = {
  H31: makeSet('H31'),
  H35: makeSet('H35'),
};
