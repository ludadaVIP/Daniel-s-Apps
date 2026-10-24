import { t } from '../model';
import { reasoning } from './builders';
const makeSet = (u: 'H03' | 'H04') => {
  const first = u === 'H03',
    qid = (i: number) => `${u}-MAINT-ROOT-QUAD-Q${i}`;
  const task = (
    i: number,
    skill: string,
    z: string,
    en: string,
    rz: string,
    re: string,
    hz: string,
    he: string,
  ) =>
    reasoning(qid(i), t(z, en), skill, t(rz, re), [
      t(hz, he),
      t(
        '保留允许数域、原式与全部分支；有限代值、像素或视窗不能代替一般理由。',
        'Retain the allowed number domain, original relation and every branch. Finite trials, pixels and a display window cannot replace general reasons.',
      ),
    ]);
  const prime = first ? 2 : 3,
    square = first ? 16 : 25,
    root = first ? 4 : 5;
  return {
    id: `${u}-MAINT-ROOT-QUAD`,
    unit: u,
    bridge: 'J91-L01',
    bridgeByQuestion: Object.fromEntries(
      [
        'J91-L01',
        'J91-L04',
        'J91-L05',
        'J92-L02',
        'J92-L04',
        'J92-L06',
        'J93-L02',
        'J93-L03',
        'J93-L04',
        'J93-L05',
      ].map((l, i) => [qid(i + 1), l]),
    ),
    title: t(
      '新函数之后，再核根式与二次结构',
      'After new functions, recheck roots and quadratic structure',
    ),
    intro: t(
      '十题分次选做，每次一题；推导较长的一题可先画模型、下次再写代数。可用纸笔，全部由家长人工核验，不计时。实数范围与图形的正长度条件分别标清。',
      'Choose one of ten tasks per sitting. For a longer derivation, draw a model first and write the algebra next time. Paper is welcome and all work is parent-reviewed without a timer. Label the real-number domain separately from positive-length picture bounds.',
    ),
    questions: [
      task(
        1,
        'square-root-versus-principal',
        `在实数域分别列x²=${square}、x²=0、x²=−${square}的完整解，比较√${square}与−√${square}。用a=−${root}解释√(a²)。再判√9、√(1/4)、${first ? '0.(3)' : '0.(6)'}与√${prime}的有理性：用最简分数反证√${prime}无理，并说明有限小数屏显为何不够证明。用直角三角形把正√${prime}构作到数轴，像素位置是精确值吗？`,
        `Over the reals, list all solutions to x²=${square},x²=0,x²=−${square}. Compare √${square} with −√${square}, and use a=−${root} to explain √(a²). Classify √9,√(1/4),${first ? '0.(3)' : '0.(6)'} and √${prime} as rational/irrational. Prove √${prime} irrational by a reduced-fraction contradiction and explain why a finite decimal display is insufficient. Construct positive √${prime} on a number line using a right triangle. Is its pixel position the exact value?`,
        `正数${square}有两根{−${root},${root}}，0仅{0}，负数−${square}无实根；√${square}是非负主根${root}，外负号−√${square}=−${root}。√(a²)=|a|，a=−${root}给${root}不是a。√9=3、√(1/4)=1/2、循环小数=${first ? '1/3' : '2/3'}均为整数比；有限小数也有理，屏幕再长的有限前缀不证无限不循环。若√${prime}=p/q为最简、q≠0，则p²=${prime}q²，${first ? '偶平方对应偶整数，p偶后令p=2r又得q偶' : '整数非3倍数时平方余1，故p为3倍数，令p=3r又得q为3倍数'}，与最简矛盾，故无理。数轴可构直角边${first ? '1与1' : '1与√2'}的斜边√${prime}再用圆规移到正轴；画图是精确构作的模型，像素只近似显示，不改精确数。√(−${prime})在实数轴无点，不能称0或悄改复数域。`,
        `Positive ${square} has two roots {−${root},${root}}, zero only {0}, and negative −${square} no real roots. √${square} denotes the nonnegative principal root ${root}; an external minus gives −${root}. Since √(a²)=|a|, a=−${root} gives ${root}, not a. √9=3,√(1/4)=1/2 and the recurring decimal ${first ? '1/3' : '2/3'} are integer ratios. Finite decimals are rational; even a long finite display cannot prove an infinite nonrecurring expansion. Suppose √${prime}=p/q in lowest terms with q≠0. Then p²=${prime}q². ${first ? 'An even square has an even integer root, so p=2r and substitution forces q even too.' : 'An integer not divisible by three has square remainder one, so p=3r; substitution forces q divisible by three too.'} Both contradict lowest terms, proving irrationality. Construct a right triangle with legs ${first ? 'one and one' : 'one and √2'} and transfer its hypotenuse √${prime} to the positive axis with a compass. Exact construction is represented by approximate pixels; the exact number is unchanged. √(−${prime}) has no real-axis point and is neither zero nor silently a complex value.`,
        '先分清“所有平方根”和根号符号的主根，再让最简分数的分子分母同时被整除产生矛盾。',
        'Separate all square roots from the principal-root symbol, then force a common divisor of a supposedly reduced numerator and denominator.',
      ),
      task(
        2,
        'radical-operation-domain',
        `化简${first ? '√72−√8与−√75' : '√108−√12与−√50'}，用${first ? '四块面积3排2×2' : '九块面积2排3×3'}的正方形解释提出平方因子；写√(a²b)的实数条件并核a=${first ? -2 : -3}、b=${first ? 3 : 2}。有理化${first ? '1/(√3+√2)' : '1/(√5−2)'}并核乘因子非零。用反例审查根式加法与√(−1)√(−1)强合并，写实数乘、除根式的条件。`,
        `Simplify ${first ? '√72−√8 and −√75' : '√108−√12 and −√50'}. Explain square-factor extraction by arranging ${first ? 'four squares of area three in a 2×2 block' : 'nine squares of area two in a 3×3 block'}. State real conditions for √(a²b) and check a=${first ? -2 : -3},b=${first ? 3 : 2}. Rationalise ${first ? '1/(√3+√2)' : '1/(√5−2)'} while checking the multiplier is nonzero. Refute addition under one root and forcing √(−1)√(−1) into one root; state real product/quotient conditions.`,
        first
          ? '√72−√8=6√2−2√2=4√2；−√75=−5√3，外负号保留。四块面积3各边√3，2×2外边2√3、面积12，边不是12。b≥0时√(a²b)=|a|√b，a−2、b3得2√3非−2√3。有理化上下同乘√3−√2，因3>2所以该因子正非零，分母3−2=1，得√3−√2，乘回原分母为1。实数乘根需两个被开方数都≥0；商分子≥0且分母被开方数>0。√1+√1=2不等√2，异类根不能直接合；√(−1)本就无实值，不能先合成√1规避。零分母或零有理化因子均不可。'
          : '√108−√12=6√3−2√3=4√3；−√50=−5√2，外负号不丢。九块面积2各边√2，3×3外边3√2、面积18。b≥0时√(a²b)=|a|√b，a−3、b2给3√2非−3√2。有理化上下同乘√5+2，该因子正非零，原分母√5−2也因5>4非零；分母5−4=1，得√5+2，乘回核1。实数乘根每个被开方数≥0；商分母被开方数严格正、分子≥0。√1+√1=2≠√2；√(−1)在实数未定义，不能先合积改成√1绕条件。任何同乘因子必须非零且上下同做。',
        first
          ? '√72−√8=6√2−2√2=4√2, while −√75=−5√3 retains its external sign. Four area-three squares have side √3; their 2×2 block has side 2√3 and area twelve, not side twelve. For b≥0, √(a²b)=|a|√b; a=−2,b=3 gives 2√3, not its negative. Multiply numerator/denominator by √3−√2, positive and nonzero since 3>2, obtaining denominator 3−2=1 and result √3−√2. Multiplication back gives one. A real root product requires both radicands nonnegative; a quotient requires a nonnegative numerator radicand and strictly positive denominator radicand. √1+√1=2≠√2. √(−1) is undefined over the reals, so merging first into √1 cannot bypass the domain. Neither zero denominators nor zero rationalising factors are allowed.'
          : '√108−√12=6√3−2√3=4√3; −√50=−5√2 retains its external sign. Nine area-two squares of side √2 form a 3×3 block of side 3√2 and area eighteen. For b≥0, √(a²b)=|a|√b; a=−3,b=2 gives 3√2, not its negative. Multiply both numerator and denominator by positive nonzero √5+2; the original √5−2 is also nonzero since 5>4. Denominator 5−4=1 yields √5+2, verified by multiplying back. Real products need each radicand ≥0; quotients need the denominator radicand >0 and numerator ≥0. √1+√1=2≠√2. Undefined real √(−1) factors cannot be merged first into √1. Every rationalising factor must be nonzero and applied above and below.',
        '先拆平方因子，再只合相同根式；根号下与分母的允许条件要分别核。',
        'Extract square factors before collecting like radicals. Check radicands and denominators separately.',
      ),
      task(
        3,
        'root-bounds-and-rounding',
        `用整数平方证明${first ? '1.41<√2<1.42' : '1.73<√3<1.74'}，再平方中点决定两位小数舍入。另把${first ? '√50' : '√15'}保留一位小数，比较截断与四舍五入；√1指定两位小数怎样写？√(25/16)=1.25是精确还是近似，√${prime}能用屏幕小数写精确等号吗？`,
        `Use integer squares to prove ${first ? '1.41<√2<1.42' : '1.73<√3<1.74'}, then square the midpoint to round to two decimal places. Round ${first ? '√50' : '√15'} to one place and compare truncation. Write √1 to two places. Is √(25/16)=1.25 exact or approximate? May a screen decimal equal √${prime} exactly?`,
        first
          ? '141²=19881<20000<20164=142²，因两端非负且平方保序得所述界。中点1.415，平方2.002225>2，所以√2在中点下，舍入1.41；不是先截屏再猜。√50在7.0与7.1之间，中点7.05平方49.7025<50，故取7.1，截断却7.0。√1按两位写1.00保尾零；√(25/16)=5/4=1.25精确，√2只可≈1.41，保√2才精确。一般两位舍入误差≤0.005，区间能再给具体误差界，平方比较需非负范围。'
          : '173²=29929<30000<30276=174²，两非负端点平方保序得界。中点1.735平方3.010225>3，√3在中点下，舍入1.73。√15在3.8与3.9之间，中点3.85平方14.8225<15，故取3.9而截断3.8。√1指定两位写1.00；√(25/16)=5/4=1.25可精确等号，√3≈1.73不可写精确等号。两位舍入误差≤0.005，夹界可细化；非负范围是平方保序依据，不凭已截断显示断舍入。',
        first
          ? '141²=19881<20000<20164=142² gives the bounds because squaring preserves order for nonnegative values. Midpoint 1.415 has square 2.002225>2, so √2 lies below it and rounds to 1.41. Do not guess from a truncated display. √50 lies between 7.0 and 7.1; midpoint 7.05 squares to 49.7025<50, giving 7.1 rather than truncated 7.0. Write 1.00 for √1 at two places. √(25/16)=5/4=1.25 is exact, while √2≈1.41; retain √2 for exactness. Two-place rounding has error at most 0.005, with bounds permitting refinements; square comparisons require the nonnegative domain.'
          : '173²=29929<30000<30276=174² gives the bounds by nonnegative order preservation. Midpoint 1.735 squares to 3.010225>3, so √3 rounds down to 1.73. √15 lies between 3.8 and 3.9; midpoint 3.85 squares to 14.8225<15, hence rounding gives 3.9 while truncation gives 3.8. Write 1.00 for √1 at two places. √(25/16)=5/4=1.25 is exact; √3≈1.73 is not an exact equality. Two-place rounding has error at most 0.005 and brackets can refine it. Nonnegative squaring, not a truncated display, justifies the decisions.',
        '把小数界同乘100再比较整数平方；舍入比较半格中点，不只看下端。',
        'Scale hundredth bounds by one hundred for integer-square checks. Round by the half-step midpoint, not just the lower bound.',
      ),
      task(
        4,
        'quadratic-zero-product',
        `把一般方程左=右改为f(x)=左−右=0，逐个实x说明为何等价，零点是哪个坐标？再判${first ? 'x²+3=x²' : 'x²−4=x²'}和${first ? 'x²+3=x²+3' : 'x²−4=x²−4'}整理后实际次数与解集。最后纠正“${first ? 'x(x−5)=0，除以x只得5' : 'x(x+4)=0，除以x只得−4'}”，列完整集合、代回，并解释分支为何穷尽。`,
        `Explain pointwise why left=right is equivalent to f(x)=left−right=0. Which coordinate is a zero? Classify ${first ? 'x²+3=x²' : 'x²−4=x²'} and ${first ? 'x²+3=x²+3' : 'x²−4=x²−4'} after collection, including actual degree and solutions. Correct “${first ? 'x(x−5)=0, divide by x for only five' : 'x(x+4)=0, divide by x for only negative four'}”. Give the complete set, check back and justify exhaustive branches.`,
        `每个原域实数的左右相等当且仅当差为0，零点是横坐标x，不是整个点(x,0)或纵坐标0。前式合成${first ? '3=0' : '−4=0'}矛盾无解，后式0=0对全实数，前者为非零常数项次数0，后者零多项式无最高非零项，均非二次方程，表面x²可相消。零乘积在实数中必至少一因子0，因此x=0或${first ? 'x−5=0' : 'x+4=0'}，完整${first ? '{0,5}' : '{−4,0}'}，两数各代原乘积0。直接除x需先限定x≠0，漏x0；若要除须另检0再解非零分支。给出几个成立数还需零乘积的穷尽理由。`,
        `For every real input in the original domain, equal sides are equivalent to zero difference. A zero is the input x, not the whole point (x,0) or the output zero. The first equation reduces to ${first ? '3=0' : '−4=0'}, impossible; the second to 0=0 for all reals. The nonzero constant has degree zero, while the zero polynomial has no highest nonzero term. Neither is quadratic after cancellation of apparent x² terms. Over the reals, a zero product has at least one zero factor: x=0 or ${first ? 'x−5=0' : 'x+4=0'}, giving complete set ${first ? '{0,5}' : '{−4,0}'}. Both values make the original product zero. Division by x assumes x≠0 and loses zero; if used, check the zero branch separately. Successful substitutions alone do not prove completeness; zero-product branching does.`,
        '先整理左减右确认最高非零次项，再把可能为0的每个因子分支保留。',
        'Collect left minus right before identifying its highest nonzero term, then retain every zero-factor branch.',
      ),
      task(
        5,
        'quadratic-formula-derivation',
        `先配方解${first ? 'x²+8x=9' : 'x²−6x=7'}，画正长度面积模型并解释图外的负解是否丢弃。再从ax²+bx+c=0、a≠0逐步配方推求根式，处理√(4a²)；用${first ? '−2x²+4x+6=0' : '−3x²−6x+9=0'}核a负时分母2a与2|a|的两分支集合为何相同，而不是声称|a|=a。`,
        `Complete the square to solve ${first ? 'x²+8x=9' : 'x²−6x=7'}, drawing a positive-length area model and deciding whether a negative root outside it must be lost. Then derive the formula from ax²+bx+c=0 with a≠0 by completing the square. Handle √(4a²), using ${first ? '−2x²+4x+6=0' : '−3x²−6x+9=0'} to explain why denominators 2a and 2|a| give the same two-branch set when a<0, without claiming |a|=a.`,
        `${first ? '同加16得(x+4)²=25，x+4=±5，得{−9,1}，−9代回81−72=9。图x>0可拼x²、两块4x及16角，但正长图不限制原实数方程' : '同加9得(x−3)²=16，x−3=±4，得{−1,7}，−1代回1+6=7。图x>3用两条3宽带减后补9角，负解在图域外但原代数有效'}。一般先除非零a、移常数、两边同加(b/(2a))²，得(x+b/(2a))²=Δ/(4a²)，Δ=b²−4ac。Δ≥0时√(4a²)=2|a|，所以x=−b/(2a)±√Δ/(2|a|)；a<0只把±的对应交换，完整集也写(−b±√Δ)/(2a)，非|a|=a。例式根${first ? '{−1,3}' : '{−3,1}'}均代回0；Δ=0两分支同值，Δ<0无实根，a0不允许该推导。`,
        `${first ? 'Adding sixteen gives (x+4)²=25, hence x+4=±5 and roots {−9,1}; negative nine checks 81−72=9. For x>0 an area model uses x², two 4x strips and a sixteen corner, but its positive lengths do not restrict the original real equation' : 'Adding nine gives (x−3)²=16, hence x−3=±4 and roots {−1,7}; negative one checks 1+6=7. For x>3 an area model removes two width-three strips and restores the nine-unit corner, but the negative root remains algebraically valid outside that picture'}. Generally divide by nonzero a, move the constant and add (b/(2a))² to both sides, giving (x+b/(2a))²=Δ/(4a²),Δ=b²−4ac. For Δ≥0, √(4a²)=2|a|, so x=−b/(2a)±√Δ/(2|a|). Negative a exchanges the ± branches; the complete set is also (−b±√Δ)/(2a), without |a|=a. The example has roots ${first ? '{−1,3}' : '{−3,1}'}, both checking zero. At Δ=0 branches coincide, at Δ<0 no real root exists, and a=0 invalidates the derivation.`,
        '配方加数来自带符号半系数的平方；开平方分±，图的正边界不添进原方程。',
        'The added square uses the signed half-coefficient. Take both ± branches without importing picture bounds into the original equation.',
      ),
      task(
        6,
        'quadratic-model-domain',
        `先按Δ解释${first ? '(x−9)(x−11)=0、x²−6x+9=0、x²+4=0' : '(x+7)(x+10)=0、x²+8x+16=0、x²+9=0'}的不同实根数，视窗[−4,4]无交点能证明无根吗？a=0时分别审${first ? '2x−6=0' : '−3x+6=0'}、0=0、5=0为何不能套Δ。另用${first ? 2 : 3}个x×x整卡方阵共${first ? 7 : 8}张建模，保留原来源数量等式及输入域；列全部实根后判可行卡阵，四舍五入到1或2能修复吗？`,
        `Use Δ to explain distinct real-root counts for ${first ? '(x−9)(x−11)=0,x²−6x+9=0,x²+4=0' : '(x+7)(x+10)=0,x²+8x+16=0,x²+9=0'}. Does no visible crossing in [−4,4] prove no roots? With a=0, classify ${first ? '2x−6=0' : '−3x+6=0'},0=0,5=0 instead of using Δ. Then model ${first ? 2 : 3} square x×x arrays of whole cards totalling ${first ? 7 : 8} cards. Retain original source quantities and input domain. List real roots before judging feasible arrays. Can rounding to one or two repair them?`,
        `a≠0时Δ正/零/负对应两不同/一不同/无实根。首式根${first ? '9、11' : '−7、−10'}、Δ=${first ? 4 : 9}正，均窗外；次式Δ0仅${first ? 3 : -4}；末式Δ=${first ? -16 : -36}负无实根。a0使实际降次，${first ? '2x−6' : '−3x+6'}唯一${first ? 3 : 2}，0=0全实数，5=0为空，不能凭b²正推两根。方阵设边x为非负整数，原${first ? '2x²=7' : '3x²=8'}分别表示${first ? '两阵卡数与总7张' : '三阵卡数与总8张'}，须画来源而不只交零式。实数候选${first ? '±√14/2' : '±2√6/3'}，正根也非整数，所以有实根却无允许卡阵，不是Δ<0。x分别取1和2时张数分别${first ? '2与8' : '3与12'}，都不等目标${first ? 7 : 8}，舍入不修复；所有候选须交原域并核原数量及单位。`,
        `For a≠0, positive/zero/negative Δ gives two distinct/one distinct/no real roots. The first roots ${first ? 'nine and eleven' : 'negative seven and negative ten'} have positive Δ=${first ? 4 : 9} but lie outside the window. The second has Δ=0 and sole root ${first ? 3 : -4}; the third has Δ=${first ? -16 : -36} and none. When a=0, ${first ? '2x−6' : '−3x+6'} is linear with sole root ${first ? 3 : 2}, while 0=0 admits all reals and 5=0 none; positive b² cannot certify two roots. For cards, let x be a nonnegative integer. Original ${first ? '2x²=7' : '3x²=8'} represents ${first ? 'two array counts versus seven total cards' : 'three array counts versus eight total cards'}, shown by a drawing rather than only a shifted zero expression. Real candidates ${first ? '±√14/2' : '±2√6/3'} include no integer, so real roots exist but no feasible card array does. This is not negative Δ. Inputs one/two give counts ${first ? 'two/eight' : 'three/twelve'}, neither equal to ${first ? 7 : 8}; rounding cannot repair it. Intersect candidates with the original domain and recheck quantities and units.`,
        '先问是否真二次，再数实根；方阵还要另外交非负整数域，保留每阵与总数来源。',
        'Check genuine quadratic degree before counting real roots. Arrays additionally require nonnegative integer inputs and explicit array/total source quantities.',
      ),
      task(
        7,
        'parabola-vertex-and-symmetry',
        `对f(x)=${first ? '2(x−3)²−2' : '−3(x+2)²+5'}，由平方非负推开口、顶点、轴与全实数范围。用h−d和h+d直接代数证对称，解释括号符号的左右方向。算从顶点横坐标到右一格、右两格的两段变化，a是固定斜率吗？若改a=0，哪些结论失效？`,
        `For f(x)=${first ? '2(x−3)²−2' : '−3(x+2)²+5'}, use nonnegative squares to derive opening, vertex, axis and range over all real inputs. Prove symmetry by substituting h−d,h+d and explain the bracket sign’s left/right meaning. Calculate successive changes from the vertex input to one and two units right. Is a a constant slope? What fails if a becomes zero?`,
        first
          ? '平方≥0且a2正，f≥−2，x3取到−2，故开口向上、唯一顶点(3,−2)、轴x=3，值域[−2,∞)。x−3在x3为0，所以向右3非向左。一般a(h±d−h)²+k=ad²+k相同，证明两侧对称。f3=−2、f4=0、f5=6，单位变化2与6不同，a不是恒定斜率。a0时为常函数−2，虽仍有这些代数相等却非二次、无唯一顶点或唯一对称轴，值域退单点。'
          : '平方≥0而a−3负，f≤5，x−2取到5，开口向下、唯一顶点(−2,5)、轴x=−2，值域(−∞,5]。x+2在x−2为0，所以向左2；一般在h±d代入均ad²+k而非只凭图。f(−2)=5、f(−1)=2、f0=−7，两段变化−3、−9不同，a不是固定斜率。改a0为常函数5，不再二次，不能沿用唯一顶点/唯一轴结论，值域仅{5}。',
        first
          ? 'A square is nonnegative and a=2 is positive, so f≥−2, attained at x=3. The parabola opens up with unique vertex (3,−2), axis x=3 and range [−2,∞). The bracket x−3 vanishes at positive three, a right shift. Generally a(h±d−h)²+k=ad²+k on both sides, proving symmetry. Outputs at 3,4,5 are −2,0,6, with unequal unit changes two and six; a is not a constant slope. At a=0 the rule is constant −2, no longer quadratic, without a unique vertex or symmetry axis and with singleton range.'
          : 'A square is nonnegative and a=−3 is negative, so f≤5, attained at x=−2. It opens down with unique vertex (−2,5), axis x=−2 and range (−∞,5]. The bracket x+2 vanishes at negative two, a left shift. Substituting h±d generally gives ad²+k in both cases. Outputs at −2,−1,0 are 5,2,−7, with unequal changes −3,−9, so a is not constant slope. At a=0 it becomes constant five, no longer quadratic, with no unique vertex/axis and range {5}.',
        '先找平方恰为0的输入，再比较a的符号；对称推导要允许任意d。',
        'Locate the input making the square zero before using the sign of a. Prove symmetry for arbitrary d.',
      ),
      task(
        8,
        'quadratic-function-forms',
        `把${first ? 'x²−6x+8、(x−3)²−1、(x−2)(x−4)' : '2x²+4x−6、2(x+1)²−8、2(x+3)(x−1)'}逐项展开核为同一函数，分别读y截距、顶点/轴、零点，说明哪种形式便于什么。把整个函数乘2后仍同根，是否还是原函数？只代几个点或只比根够吗？`,
        `Expand ${first ? 'x²−6x+8,(x−3)²−1,(x−2)(x−4)' : '2x²+4x−6,2(x+1)²−8,2(x+3)(x−1)'} term by term to verify one function. Read the y-intercept, vertex/axis and zeros and explain each form’s use. Doubling the whole function keeps its roots; is it still the original function? Are a few substitutions or root lists enough?`,
        first
          ? '顶点式展开x²−6x+9−1，一般系数(1,−6,8)；因式四对x²、−4x、−2x、8同系数，故对所有x恒等。一般式读y截距(0,8)，顶点式读(3,−1)及轴x3，因式读零点2、4。乘2变2x²−12x+16，根仍2与4但x0输出16非8，不是同函数；非零外系数要保留。一般完整展开证恒等，有限吻合不足，反例可否定。'
          : '顶点式展开2(x²+2x+1)−8=2x²+4x−6；因式先x²+2x−3再乘2，系数均(2,4,−6)，所以全域同函数。一般式读y截距(0,−6)，顶点式读(−1,−8)、轴x−1，因式读零点−3、1。全函数乘2成4x²+8x−12，根相同但x0输出−12非−6，不是原函数。因式形式外2不可丢；全系数或完整展开证恒等，只比根或有限代值不够。',
        first
          ? 'The vertex form expands to x²−6x+9−1, coefficients (1,−6,8). All four factor products give x²,−4x,−2x,eight, the same coefficients, proving equality for every x. General form reads y-intercept (0,8); vertex form gives (3,−1) and axis x=3; factors give zeros two/four. Doubling gives 2x²−12x+16, with the same zeros but output sixteen rather than eight at zero, so it is another function. Retain nonzero outside scale. Full expansion proves identity; finite matches do not, though one counterexample can refute it.'
          : 'The vertex form expands to 2(x²+2x+1)−8=2x²+4x−6. Factors first give x²+2x−3 then multiply by two, matching coefficients (2,4,−6) for every input. General form reads y-intercept (0,−6); vertex form gives (−1,−8),axis x=−1; factors give zeros negative three and one. Doubling gives 4x²+8x−12 with the same roots but output −12 instead of −6 at zero, so it is not the original. Do not lose the outside two. Full coefficients/expansion, rather than roots or finitely many inputs, establish identity.',
        '一般式看常数项，顶点式看平方为0处，因式看哪个因子能0；最后把三式全展开。',
        'Read the constant, zero-square input and zero factors in their respective forms, then fully expand all three.',
      ),
      task(
        9,
        'horizontal-intersection-equivalence',
        `画原图y=${first ? 'x²' : '2x²'}与y=${first ? 3 : 5}的所有交点，另画差图g(x)=${first ? 'x²−3' : '2x²−5'}的全部零点。列精确有序点并解释横坐标为何相同、纵坐标为何不同；核${first ? '1.73' : '1.58'}为何只是近似。为什么还要列负根，怎样说明无遗漏？`,
        `Draw all intersections of y=${first ? 'x²' : '2x²'} and y=${first ? 3 : 5}, and separately all zeros of difference graph g(x)=${first ? 'x²−3' : '2x²−5'}. Give exact ordered points and explain equal inputs but different outputs. Check why ${first ? '1.73' : '1.58'} is only approximate. Why retain the negative root and how is completeness established?`,
        first
          ? '原等式x²=3有x=±√3，原交点(−√3,3)、(√3,3)；差函数减3，零点横坐标同而点为(−√3,0)、(√3,0)。1.73²=2.9929≠3，所以1.73仅近似，不能精确等号。平方为正3给非负主根后必须分±，实数平方单调于两半轴，各仅一个；或(x−√3)(x+√3)=0保证两分支穷尽。图轴单位/视窗不改变原式，不能丢负根或混图的纵坐标。'
          : '原式2x²=5，x²=5/2，实根±√10/2；原交点(−√10/2,5)、(√10/2,5)，差图点为(−√10/2,0)、(√10/2,0)。2×1.58²=4.9928≠5，1.58仅近似。√10/2平方=5/2恰好，两符号均代原式；2(x−√10/2)(x+√10/2)=0的零乘积分支保证无遗漏，不凭只看见几个交点。原图纵坐标5，差图零点纵坐标0，横坐标关系等价不等于两个图是同一条。',
        first
          ? 'The original equation x²=3 gives x=±√3 and intersection points (−√3,3),(√3,3). Subtracting three gives difference-graph points (−√3,0),(√3,0), equal inputs but different outputs. Since 1.73²=2.9929≠3, 1.73 is approximate. Both signs are required; squaring is strictly monotone on each half-axis, or the identity (x−√3)(x+√3)=0 gives exhaustive branches. Axis units and window do not change the equation, remove a negative root or merge the graphs’ output coordinates.'
          : 'The original 2x²=5 gives x²=5/2, hence roots ±√10/2. Original intersections are (−√10/2,5),(√10/2,5), while difference-graph points are (−√10/2,0),(√10/2,0). Because 2×1.58²=4.9928≠5, 1.58 is approximate. The exact squared root is 5/2 and both signs satisfy the original. Zero-product branches in 2(x−√10/2)(x+√10/2)=0 prove completeness rather than a finite visual count. Equal input solutions do not make original and difference graphs identical.',
        '分别标明画的是原函数还是差函数，每一个点都写两个坐标。',
        'Label the original and difference graphs separately, and write both coordinates for every point.',
      ),
      task(
        10,
        'quadratic-domain-optimum',
        `矩形周长${first ? 24 : 28}cm，设宽x cm，推长与面积函数、原正长度域。配方证明全域最大面积并核取到；再额外限制${first ? '1≤x≤5' : '2≤x≤6'}，新最大在哪、为何不能照用原顶点？用平方距离证明所有允许值都受此上界，而不只试几个数。`,
        `A rectangle has perimeter ${first ? 24 : 28} cm. Let width be x cm and derive length, area and the original positive-length domain. Complete the square to prove and attain the global maximum. Add restriction ${first ? '1≤x≤5' : '2≤x≤6'}: locate the new maximum and explain why the old vertex no longer applies. Bound every allowed input by square distance rather than checking a few samples.`,
        `2(x+长)=${first ? 24 : 28}，长=${first ? 12 : 14}−x，正边给0<x<${first ? 12 : 14}。A=x(${first ? 12 : 14}−x)=${first ? 36 : 49}−(x−${first ? 6 : 7})² cm²，平方≥0得A≤${first ? 36 : 49}，x=${first ? 6 : 7}在原域且取等，尺寸${first ? '6×6' : '7×7'}。加限制后顶点${first ? 6 : 7}不在域；所有x≤${first ? 5 : 6}故距${first ? 6 : 7}至少1，平方≥1，A≤${first ? 35 : 48}，在右端x=${first ? 5 : 6}达到，长${first ? 7 : 8}，最大${first ? 35 : 48}cm²。端点被新闭区间允许、原正边也保留。给一般距离不等式覆盖全允许域，几次试算只核例，不能以“顶点总最大”跳过域。`,
        `From 2(x+length)=${first ? 24 : 28}, length=${first ? 12 : 14}−x and positive sides require 0<x<${first ? 12 : 14}. Area A=x(${first ? 12 : 14}−x)=${first ? 36 : 49}−(x−${first ? 6 : 7})² cm². Nonnegative squares give A≤${first ? 36 : 49}, attained at x=${first ? 6 : 7} within the original domain for ${first ? '6×6' : '7×7'} dimensions. The new interval excludes that vertex. Every allowed x≤${first ? 5 : 6} is at least one unit from ${first ? 6 : 7}, so its square distance is at least one and A≤${first ? 35 : 48}. Equality occurs at allowed right endpoint x=${first ? 5 : 6}, length ${first ? 7 : 8}, maximum ${first ? 35 : 48} cm². The closed new interval and original positive sides both hold. This bound covers every input; trials only check examples and the vertex cannot override the domain.`,
        '先从原周长保留两条正边，再用顶点式比较允许x到中心的最近距离。',
        'Derive both positive sides from the perimeter before comparing allowed inputs’ nearest distance to the vertex.',
      ),
    ],
  };
};
export const rootQuadraticRetrieval = {
  H03: makeSet('H03'),
  H04: makeSet('H04'),
};
