import { t } from '../model';

const pair = (i: number) =>
  ['P61', 'P65'].map((unit) => `${unit}-MAINT-P53-Q${i}`);
const structurePair = (n: number) =>
  ['P61', 'P65'].map((unit) => `${unit}-MAINT-FRACTION-STRUCTURE-Q${n}`);
const additivePair = (n: number) =>
  ['P55', 'P61'].map((unit) => `${unit}-MAINT-FRACTION-ADDITIVE-Q${n}`);
export const fractionRecurrence = [
  {
    skill: 'proper-improper',
    focus: t(
      '真分数、假分数与一的边界',
      'Proper and improper fractions at the one-whole boundary',
    ),
    sourceLesson: 'P53-L02',
    sourceTask: 'P53-L02-Q6',
    targets: [...pair(1), ...structurePair(2)],
    rationale: t(
      'P61按固定1L画3/4、4/4、5/4，P65按固定1m画2/3、3/3、7/3；都须分类并数完整整体及剩余。两处主动解释分子等于分母也属假分数，“假”不代表量不存在，不能为容纳超过一而换整体。新Q2逐行生成完整升、余份与最少轮廓数，区分零量的空参考框，并计算只加倍分母导致量减半。',
      'P61 draws 3/4,4/4,5/4 against one litre; P65 draws 2/3,3/3,7/3 against one metre. Both classify and count complete wholes and leftovers, explicitly including equality as improper without redefining the whole or calling the quantity unreal. New Q2s generate filled litres, remaining shares and minimum outlines for every row, separating a zero-amount guide from a filled whole and calculating the halving caused by changing only a denominator.',
    ),
  },
  {
    skill: 'mixed-fraction',
    focus: t(
      '带分数与假分数双向互化',
      'Converting mixed and improper fractions both ways',
    ),
    sourceLesson: 'P53-L03',
    sourceTask: 'P53-L03-Q6',
    targets: [...pair(2), ...structurePair(3)],
    rationale: t(
      'P61在17/5与3 2/5、2 3/7与17/7之间双向核验；P65在10/3与3 1/3、4 1/5与21/5之间核验。两处都画固定单位，说明整数部分须换成分母个小份，不能只把整数加进分子。新Q3另生成整除、不足一、零及非最简真余数，修复值等价而余数≥1的候选，区分原分母余数、乘法误读和指定分母形式。',
      'P61 checks 17/5 against 3 2/5 and 2 3/7 against 17/7 in both directions. P65 checks 10/3 against 3 1/3 and 4 1/5 against 21/5. Fixed-unit drawings explain how whole parts become denominator-sized collections of shares, rather than adding the whole count directly to the numerator. New Q3s generate exact-integer, below-one, zero and unsimplified proper remainders, repair an equal-valued form whose remainder exceeds one, and distinguish remainder units, multiplication misreading and a required denominator.',
    ),
  },
  {
    skill: 'simplest-fraction',
    focus: t(
      '等值不一定已经最简',
      'Equivalent does not necessarily mean simplest',
    ),
    sourceLesson: 'P53-L05',
    sourceTask: 'P53-L05-Q6',
    targets: [...pair(3), ...structurePair(5)],
    rationale: t(
      'P61须把18/24L写3/4L，P65把等值候选21/35m写3/5m并乘回原式。两处实际要求最简分数；6/8、6/10等未约尽形式虽等值仍不满足形式要求，小数也不能冒充本题所要求的分数。新Q5以两种实际分组路径约尽，核非相邻互质与奇数仍可约的反例、同减不等值、整数与零的最简形式；保持升单位。',
      'P61 must reduce 18/24L to 3/4L; P65 reduces candidate 21/35m to 3/5m and checks the original equation. Both explicitly require simplest fraction form. Equivalent 6/8 or 6/10 is unfinished, and a decimal does not meet the requested fraction representation. New Q5s use two grouping paths, check non-adjacent coprime and reducible odd cases, refute equal subtraction and generate integer/zero simplest forms while retaining litres.',
    ),
  },
  {
    skill: 'fraction-comparison',
    focus: t(
      '通分比较与整体条件',
      'Common-share comparison and reference conditions',
    ),
    sourceLesson: 'P53-L06',
    sourceTask: 'P53-L06-Q6',
    targets: [...pair(4), ...structurePair(6)],
    rationale: t(
      'P61通分比较7/12与5/8，用24分之一；P65比较5/9与7/12，用36分之一。两处再改整体，实际量排序反转而分数数值排序不变；必须说清共同单位、分子分母共同缩放和参考整体。新Q6列全正倍数核最小共同分母，检验乘积非最小与分母和无效，补单位分数及泛化反例、等值比较；只改右整体并亲造未知整体三种结果，保km/m。',
      'P61 compares 7/12 and 5/8 using twenty-fourths; P65 compares 5/9 and 7/12 using thirty-sixths. Both then change wholes, reversing actual-amount order while fraction-number order remains fixed. Explanations must name the common unit, rescale both numerator and denominator and retain reference wholes. New Q6s generate complete positive-multiple lists, distinguish a working nonleast product from an invalid sum, test unit/general fraction claims and equality, change only the right whole and construct all three orderings for unknown wholes, retaining km/metre units.',
    ),
  },
  {
    skill: 'add-like-fractions',
    focus: t('同大小分数份相加', 'Adding counts of like fraction shares'),
    sourceLesson: 'P54-L01',
    sourceTask: 'P54-L01-G',
    targets: ['P61-L01-Q6', 'P63-L03-Q6', ...additivePair(1)],
    rationale: t(
      'P61说明三组各三个四分之一是九个四分之一、9/4L，不是9/12；P63须用14/5L+21/5L=35/5L=7L核总量。两处都以同大小份数合并、保留份单位，结果可超过一整体，不能相加或相乘分母改变每份大小。新Q1另亲画零加数、两整升与超过三升的和，核完整数/轮廓数及不同容量半壶的实际L，保原分母并逐项减回。',
      'P61 explains that three groups of three quarters give nine quarters, or 9/4L, not 9/12. P63 checks total volume using 14/5L+21/5L=35/5L=7L. Both combine counts of like shares while preserving share size, including totals above one whole; changing the denominator changes the amount. New Q1s draw zero addition, an integer two-litre sum and a sum above three litres, check filled/minimum outlines and actual half-jugs of unequal capacity, retain denominators and subtract back.',
    ),
  },
  {
    skill: 'subtract-like-fractions',
    focus: t('同单位减份数并加回', 'Subtracting like shares and adding back'),
    sourceLesson: 'P54-L02',
    sourceTask: 'P54-L02-G',
    targets: ['P55-L04-Q5', 'J71-L02-Q6', ...additivePair(2)],
    rationale: t(
      'P55从x+1/4=1反求x=3/4，把整体看作四个四分之一后去一份，并代回；J71同侧点距离由5/4−1/4=4/4=1，避免重叠部分重复计。两处都先保留同单位，再减份数；负点情境不把非负距离误写成有向差。新Q2另核零差、整数换份、原量超过一、减零不变和实物不足，划去不重切；不足不能调换或截成零。',
      'P55 recovers x=3/4 from x+1/4=1 by viewing the whole as four quarters and removing one, then checks the equation. J71 obtains same-side distance from 5/4−1/4=1 without double-counting overlap. Both retain a common unit and subtract share counts, distinguishing distance from directed change. New Q2s generate zero differences, integer exchanges, originals above one and unchanged subtraction by zero, and refuse impossible removal without reversing or truncating. Crosses remove rather than resize pieces.',
    ),
  },
  {
    skill: 'add-unlike-fractions',
    focus: t('不同分数单位先通分再加', 'Unify fraction units before addition'),
    sourceLesson: 'P54-L03',
    sourceTask: 'P54-L03-Q6',
    targets: ['P65-L05-Q6', 'J71-L03-Q6', ...additivePair(3)],
    rationale: t(
      'P65代回精确解时须算−1/3+2=−1/3+6/3=5/3，再乘3为5；J71以四分之一为共同单位算−3/4+1/2=−1/4并解释数轴。两个后续单元把原正分数通分结构延伸到有向量，仍须将整数或二分之一换成相同小份，不直接相加分子分母。新Q3以两个有效分母分别缩放两量，核指定分母与最简差别，亲画132份并计算混合km/m；已修正源Q1中文提示的整除方向。',
      'P65 checks an exact solution using −1/3+2=−1/3+6/3=5/3 before multiplying by three. J71 unifies quarters in −3/4+1/2=−1/4 and explains the number line. Both extend the original positive-fraction structure to signed quantities, converting the integer or half into common shares rather than adding unlike numerators or denominators. New Q3s independently rescale both amounts using two valid denominators, distinguish required-denominator and simplest forms, generate 132-part counts and convert mixed kilometre/metre quantities. The source Q1 Chinese hint now states the correct divisibility direction.',
    ),
  },
  {
    skill: 'subtract-unlike-fractions',
    focus: t(
      '不同分母减法与逆向核查',
      'Unlike-denominator subtraction and inverse checks',
    ),
    sourceLesson: 'P54-L04',
    sourceTask: 'P54-L04-Q6',
    targets: ['P65-L05-Q6', 'J71-L04-Q6', ...additivePair(4)],
    rationale: t(
      'P65在x+2=5/3中求5/3−2=−1/3，并代回恢复5/3；J71比较−3/4−(−1/2)与−3/4+(−1/2)，通分后分别−1/4与−5/4，再加回原减数。两处保留原被减数、共同分母与原式核查，扩展负号但不改变单位。新Q4保原先后与两量，另做零差、整数原量、减零、正差超过一及不足量，使用两种共同分母和逐项加回。',
      'P65 subtracts two from 5/3 to obtain −1/3 and adds back for verification. J71 contrasts −3/4−(−1/2) with −3/4+(−1/2), giving −1/4 and −5/4 after common-unit conversion, then adds back the original subtrahend. Both preserve the minuend, common unit and original check while extending signs. New Q4s retain operand order and amounts while generating zero differences, integer originals, subtraction by zero, a positive result above one and an insufficient-material case, using two common denominators and add-back checks.',
    ),
  },
  {
    skill: 'fraction-story-relationship',
    focus: t(
      '分数比例、实际量与加减关系',
      'Fraction proportions, measured amounts and additive relationships',
    ),
    sourceLesson: 'P54-L05',
    sourceTask: 'P54-L05-Q6',
    targets: ['P61-L05-Q6', 'P63-L03-Q6', ...additivePair(5)],
    rationale: t(
      'P61必须区分剩余1/2L与它占标准3/4L一份的2/3，且用2×3/4L+1/2L=2L恢复整体；P63的五个权重份每份是7/5L，按14/5L+21/5L核总量，不能把1/5总量误当1/5L。两处先确定比例的参照及实际单位，再形成部分合整体或整体减部分的关系，回应原课“全程比例与km不能直接混加”的子目标。新Q5以两步合并后使用、两次使用的两种计划、全程翻倍与实际km/比例、假想钱数及自编十二格活动，实际重建中间量和逆查。',
      'P61 distinguishes 1/2L remaining from its ratio 2/3 of a standard 3/4L portion and reconstructs the whole using 2×3/4L+1/2L=2L. In P63 each of five weight shares is 7/5L, and 14/5L+21/5L checks the total; one fifth of the total is not 1/5L. Both establish ratio reference and measured units before combining parts or subtracting from a whole, retrieving the source lesson’s warning against mixing a route proportion with kilometres. New Q5s reconstruct intermediates and inverse checks for combining then using, two plans for two uses, a doubled route with actual kilometres and route fractions, fictional money and a generated twelve-cell activity.',
    ),
  },
];
