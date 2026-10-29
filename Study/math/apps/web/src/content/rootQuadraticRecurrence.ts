import { t } from '../model';
const pair = (i: number) =>
  ['H03', 'H04'].map((u) => `${u}-MAINT-ROOT-QUAD-Q${i}`);
const supplements: Record<string, number[]> = {
  'J91-L01': [1],
  'J91-L02': [1],
  'J91-L03': [2],
  'J91-L04': [2],
  'J91-L05': [2, 3],
};
const quadraticSupplements: Record<string, number[]> = {
  'J92-L01': [1],
  'J92-L02': [1],
  'J92-L03': [2],
  'J92-L04': [2],
  'J92-L05': [1, 3],
  'J92-L06': [3],
};
const parabolaSupplements: Record<string, number[]> = {
  'J93-L01': [1],
  'J93-L02': [1, 2],
  'J93-L03': [2],
  'J93-L04': [3],
  'J93-L05': [4],
};
const extra: Record<string, ReturnType<typeof t>> = {
  'J93-L01': t(
    ' 新N1在共同标尺亲列分数外系数三曲线及高度差倍率，保非零距离前提与平移后的反射水平线；实际抵消成一次/常数，分别核竖轴不存在/不唯一，不把外观当系数。',
    ' New N1 tabulates three fractional-scale curves on common axes,computes displacement ratios for nonzero distance and locates the translated reflection line. Actual linear/constant cancellation distinguishes absent/nonunique vertical axes without inferring coefficients from appearance.',
  ),
  'J93-L02': t(
    ' 共享N1区分a/h/k改函数与d/图窗只观察；N2从非首一正负系数亲配方得分数顶点，算截距并推c=ah²+k及非零a下相等恰h0，核外倍补偿错误的一般差和具体反例。',
    ' Shared N1 separates a/h/k function changes from illustrative d/window. N2 completes signed nonmonic functions for fractional vertices,computes intercepts and derives c=ah²+k with equality iff h=0 for nonzero a,then refutes wrong outside compensation generally and numerically.',
  ),
  'J93-L03': t(
    ' 新N2自主生成三形式而非只核给定三式，保分数补偿与同函数/未完成指定形式；零根/重复因子完整保留，亲展开无理实因子，对全实数严格同号函数证无实因子，区别语法限制。',
    ' New N2 generates all three forms rather than only checking supplied triples,retaining fractional compensation and equivalent-but-unfinished distinctions. It preserves zero/repeated factors,expands irrational real factors and proves no real factors for an always-strict-sign function,separately from field syntax.',
  ),
  'J93-L04': t(
    ' 新N3对平移正/负a函数分别亲求两点/相切/无交的三个水平目标，列原图/差图全部精确有序点及代回；宽窗仍可能漏−9，不把点夹边界，游标/窗口不改问题。原O9无理根和精确小数余差继续用。',
    ' New N3 solves three horizontal targets for shifted positive/negative-a functions,two/tangent/no intersections,with every exact original/difference ordered point and substitution. A wide window can still hide−9;never clamp to a border. Cursor/window preserve the problem. Original O9 retains irrational roots and exact decimal residuals.',
  ),
  'J93-L05': t(
    ' 新N4由原周长画图/生三形式，双闭区间同时给最大/最小及所有达到尺寸、原目标/自选目标面积双核，自创不同整数得分并给全部并列最高/最低。直接复用H35/H38原OPTIMISATION-Q4的三边围栏整数并列最优与开端点仅下确界，原H31-L05桥保留，不重造其证明。',
    ' New N4 draws/model-generates from perimeter,finds BOTH extrema/every attaining dimension on two closed intervals,audits given/own target areas,and designs a different integer score with all tied maxima/minima. Existing H35/H38 OPTIMISATION-Q4 supplies integer fence ties and an open-endpoint infimum without attainment,keeping its H31-L05 bridge and proof.',
  ),
  'J91-L01': t(
    ' 新N1分数方程/主根/外负/先后次序逐式代回，区分几何边长；两半轴精确标根与零。',
    ' New N1 substitutes fractional equation/principal/outside-minus/operation-order cases,distinguishes geometric length,and labels exact roots and zero on both half-axes.',
  ),
  'J91-L02': t(
    ' 新N1实际分类负无理/无实值/有限字面、由100x−x生成循环比，自造同前缀有理/无理延续并证明界限和类别，亲画负根。',
    ' New N1 classifies negative irrational/undefined real/finite literals,derives recurring ratios by 100x−x,constructs rational/irrational continuations of one prefix with proofs,and plots negative roots.',
  ),
  'J91-L03': t(
    ' 新N2比较分数根四等价形式的完成要求、平方同但负号不等、零/一与自主面积阵列；复用H05/H06旧PYTHAGOREAN-MEANING-Q3的分数腿、三等值根式与精确小数平方差，主桥不改。',
    ' New N2 audits four equivalent fractional forms,opposite-sign equal squares,zero/one and an own area array. Existing H05/H06 PYTHAGOREAN-MEANING-Q3 supplies fractional legs,three equivalent radicals and exact decimal square discrepancies with unchanged bridges.',
  ),
  'J91-L04': t(
    ' 新N2主动算分数差/异类和/商并乘回，零分子可定义而原化简成零的分母不可救，不能混成同一规则。',
    ' New N2 computes fractional differences,unlike sums and quotients with multiplication back,contrasting a valid zero numerator with an originally zero denominator that cannot be rescued.',
  ),
  'J91-L05': t(
    ' 新N3实际半格相等、跨整数尾零、完全平方/零、截断误差0.009与最近0.001，自己构造同界跨中点两根和负数保序反例；共享N2自主纸上标牌阵列保家庭挑战数学要求，不冒真实家庭试用。',
    ' New N3 computes exact ties,integer carries,perfect squares/zero,truncation error0.009 versus nearest error0.001,and designs two roots with shared bounds/opposite midpoint sides plus a negative-order counterexample. Shared N2 adds the fictional sign array promised by the family challenge without claiming a household trial.',
  ),
  'J92-L01': t(
    ' 新N1实际抵消为一次并核原左右，判三次不能套二次公式；复用原Q9亲画非零原图交点与差图零点，保精确两根/两图不同纵坐标，原J93-L04主桥不改。',
    ' New N1 collects to a linear equation and audits original sides,then identifies a cubic outside the quadratic formula. Existing Q9 supplies actual original intersections/difference zeros,exact opposite roots and different ordinates with unchanged J93-L04 bridge.',
  ),
  'J92-L02': t(
    ' 新N1非零原乘积先验错误候选再移项分解，非首一分数两根与重复因子/常数因子分别核；穷尽整数积对后仍有无理实根，分解形式不当根集。',
    ' New N1 audits tempting candidates for a nonzero product before collection,then computes nonmonic fractional roots and repeated/constant-factor cases. Exhausted integer pairs coexist with irrational real roots; a factor product is not a root set.',
  ),
  'J92-L03': t(
    ' 新N2实际归一非首一式、带符号分数p及p²，逐步同加取正/零/负平方目标；正图例亲画分数宽长条/角且不删原负根，负p不画负宽正面积。',
    ' New N2 normalises nonmonic equations,computes signed fractional p/p² and positive/zero/negative square targets,and draws fractional strips/corner without discarding a negative root or fabricating a negative-width positive-area tile.',
  ),
  'J92-L04': t(
    ' 新N2配方/公式双解无理根，审错误整分子括号候选的精确余差，再对原式两边乘−2重算原系数/Δ并匹配反向±支；原一般推导继续复用。',
    ' New N2 solves irrational roots by completing/formula,audits a wrongly grouped numerator by its exact residual,and recomputes coefficients/Δ after multiplying both sides by −2 to match exchanged branches. The original general derivation remains.',
  ),
  'J92-L05': t(
    ' 新N1实际Δ49但两根均非整数；新N3逐原式算Δ/不同实根数，再与正宽/闭时间域接受数对照，根数不冒可行数。',
    ' New N1 computes Δ49 yet two noninteger roots. N3 calculates each original discriminant/distinct count before positive-width/closed-time filtering,distinguishing equation count from feasible count.',
  ),
  'J92-L06': t(
    ' 新N3保原矩形面积两数量、两方法全部根/逐根双核与单位，亲画两时间零点图/端点通过与失败；自创矩形及有实根无整数卡阵，不舍入或伪造实测。',
    ' New N3 retains rectangle area sources,two solution methods,all roots and separate substitution/domain checks with units. It plots two time-zero cases with passing/failing endpoints and designs a rectangle plus real-root/no-integer card model,without rounding or fictional measurements.',
  ),
};
const e = (
  skill: string,
  l: string,
  i: number,
  z: string,
  en: string,
  rz: string,
  re: string,
) => ({
  skill,
  focus: t(z, en),
  sourceLesson: l,
  sourceTask: `${l}-Q6`,
  targets: [
    ...pair(i),
    ...['H03', 'H04'].flatMap((u) =>
      (supplements[l] ?? []).map((n) => `${u}-MAINT-RADICAL-MEANING-Q${n}`),
    ),
    ...(l === 'J91-L03'
      ? ['H05', 'H06'].map((u) => `${u}-MAINT-PYTHAGOREAN-MEANING-Q3`)
      : []),
    ...['H03', 'H04'].flatMap((u) =>
      (quadraticSupplements[l] ?? []).map(
        (n) => `${u}-MAINT-QUADRATIC-MEANING-Q${n}`,
      ),
    ),
    ...(l === 'J92-L01' ? pair(9) : []),
    ...['H03', 'H04'].flatMap((u) =>
      (parabolaSupplements[l] ?? []).map(
        (n) => `${u}-MAINT-PARABOLA-MEANING-Q${n}`,
      ),
    ),
    ...(l === 'J93-L05'
      ? ['H35', 'H38'].map((u) => `${u}-MAINT-OPTIMISATION-Q4`)
      : []),
  ],
  rationale: t(rz + (extra[l]?.zh ?? ''), re + (extra[l]?.en ?? '')),
});
export const rootQuadraticRecurrence = [
  e(
    'square-root-versus-principal',
    'J91-L01',
    1,
    '所有平方根与非负主根',
    'All square roots versus principal root',
    '两组分别列16/25、0、负16/25的实数根集，区分√a与外负号；a−4/−5具体给√(a²)=|a|，无实值不当0也不悄改数域。',
    'Both list real roots for sixteen/twenty-five, zero and the negative value, separating the principal-root symbol from an external minus. Inputs −4/−5 demonstrate √(a²)=|a|. No real value is neither zero nor a silent change of number domain.',
  ),
  e(
    'irrational-and-real-line',
    'J91-L02',
    1,
    '有理反例、无理证明与数轴',
    'Rational counterexamples, irrational proof and real line',
    '两处把√9、√(1/4)、循环小数写整数比，再用最简分数同整除反证√2/√3无理；亲用直角斜边构数轴点，区分精确数与像素，有限小数前缀不证无理。',
    'Both express √9,√(1/4) and a recurring decimal as integer ratios, then prove √2/√3 irrational by forced common divisors of a reduced fraction. Right-triangle construction locates the positive real point while distinguishing exact values from pixels and finite displays from irrationality proofs.',
  ),
  e(
    'square-factor-simplification',
    'J91-L03',
    2,
    '平方块、绝对值与外负号',
    'Square pieces, absolute value and external minus',
    'H03化√72−√8为4√2、−√75为−5√3，以四块3面积解释2√3；H04化√108−√12为4√3、−√50为−5√2，以九块2面积解释3√2。均用负a核|a|√b并保持外负号与面积/边长区别，完成共轭有理化。',
    'H03 simplifies √72−√8 to 4√2 and −√75 to −5√3, using four area-three pieces for 2√3. H04 uses √108−√12=4√3 and −√50=−5√2, with nine area-two pieces for 3√2. Both check negative a in |a|√b, retain external signs, separate area from length and complete conjugate rationalisation.',
  ),
  e(
    'radical-operation-domain',
    'J91-L04',
    2,
    '每个根式及非零分母条件',
    'Each radical’s domain and nonzero denominators',
    '两组根式乘需各被开方数非负，商分母严格正；√1+√1反例否定直接合加，√(−1)不可先合积绕实数域。分别有理化1/(√3+√2)与1/(√5−2)，说明上下同乘及因子、原分母非零并乘回1。',
    'Both require nonnegative radicands for products and a strictly positive denominator radicand for quotients, refute merged addition with √1+√1 and reject bypassing undefined real √(−1). They rationalise 1/(√3+√2) or 1/(√5−2), checking shared multiplication, nonzero factors/original denominator and product back to one.',
  ),
  e(
    'root-bounds-and-rounding',
    'J91-L05',
    3,
    '平方夹界、中点舍入与精确性',
    'Squared brackets, midpoint rounding and exactness',
    'H03以整数平方夹√2于1.41/1.42，H04夹√3于1.73/1.74，再平方中点决定两位。另√50/√15一位舍入7.1/3.9不同截断7.0/3.8；保1.00格式尾零，√(25/16)=1.25精确与无理近似分开，给误差界及非负前提。',
    'H03 brackets √2 by 1.41/1.42 and H04 √3 by 1.73/1.74 using integer squares, then squares midpoints to round. Additional √50/√15 rounds to 7.1/3.9 rather than truncated 7.0/3.8. Both retain 1.00 precision, distinguish exact √(25/16)=1.25 from irrational approximations and state error bounds/nonnegative premises.',
  ),
  e(
    'equation-zero-and-degree',
    'J92-L01',
    4,
    '左减右零点与实际次数',
    'Left-minus-right zeros and actual degree',
    '两组逐实数说明左=右等价差0、零点为输入，合并表面二次项后3=0/−4=0无解、0=0全实数，区别非零常数次数0和零多项式无最高非零项，不凭出现x²判二次。',
    'Both explain pointwise equivalence of equal sides and zero difference, with zeros as inputs. Apparent square terms cancel to impossible 3=0/−4=0 or all-real 0=0. Nonzero constants have degree zero; the zero polynomial has no highest nonzero term. An x² appearance does not determine degree.',
  ),
  e(
    'quadratic-zero-product',
    'J92-L02',
    4,
    '零因子完整分支与非零除法',
    'Complete zero-factor branches and nonzero division',
    'H03纠正x(x−5)=0除x漏0，完整{0,5}；H04纠正x(x+4)=0，完整{−4,0}。各代原式并用零乘积说明穷尽，若相除须先单列x0分支，非只列几次代入吻合。',
    'H03 corrects division by x in x(x−5)=0 for complete set {0,5}; H04 uses x(x+4)=0 for {−4,0}. Both check originals and justify exhaustive zero-product branches; division requires a separate zero case rather than relying on finite successful trials.',
  ),
  e(
    'completing-square-equivalence',
    'J92-L03',
    5,
    '带符号配方与图外代数解',
    'Signed completing squares and roots outside pictures',
    'H03解x²+8x=9同加16得{−9,1}，H04解x²−6x=7同加9得{−1,7}。画正长度面积块但明确不添原实数域限制，负解代回；以带符号半系数平方补齐，不画负宽正面积。',
    'H03 adds sixteen to x²+8x=9 for roots {−9,1}; H04 adds nine to x²−6x=7 for {−1,7}. Both draw positive-length area pieces without importing picture restrictions into the real equation, check negative roots and use the signed half-coefficient square rather than negative geometric widths.',
  ),
  e(
    'quadratic-formula-derivation',
    'J92-L04',
    5,
    '配方推公式与负a分支交换',
    'Formula derivation and negative-a branch exchange',
    '两处从非零a逐步除a、移常数、同加(b/2a)²得到Δ/(4a²)，√(4a²)=2|a|后解释负a只交换±完整集，核−2x²+4x+6或−3x²−6x+9两根；不声称|a|=a，保Δ负/零与a0限制。',
    'Both derive the formula through division by nonzero a, moving the constant and adding (b/2a)². After √(4a²)=2|a|, negative a only exchanges the complete ± branches, checked with −2x²+4x+6 or −3x²−6x+9. They do not assert |a|=a and retain negative/zero Δ and a=0 restrictions.',
  ),
  e(
    'discriminant-distinct-roots',
    'J92-L05',
    6,
    '不同实根数、窗外与降次',
    'Distinct real-root counts, off-window roots and degree loss',
    'H03用9/11窗外两根、重根3、无实根x²+4，H04用−7/−10、重根−4、x²+9，按Δ正/零/负解释不同根数。a0时改审一次/恒等/矛盾，不凭b²正推两根，视窗[−4,4]不能定全实域。',
    'H03 uses off-window roots nine/eleven, repeated three and x²+4 with none; H04 uses −7/−10, repeated −4 and x²+9. Both connect distinct counts to Δ signs and separately classify a=0 as linear/identity/impossible, without treating positive b² or a [−4,4] window as a full-domain root count.',
  ),
  e(
    'quadratic-model-domain',
    'J92-L06',
    6,
    '原卡数来源与实根后的整数域',
    'Original card quantities and integer feasibility after real roots',
    '两组分别画两/三方阵与总7/8张，保2x²=7或3x²=8原数量等式，解±√14/2或±2√6/3再交非负整数，无可行方案却非无实根。输入取1和2时数量分别为2与8或3与12均不合，舍入不能修复原模型。',
    'Both draw two/three square arrays and totals seven/eight, retaining 2x²=7 or 3x²=8 as original quantity equations. Candidates ±√14/2 or ±2√6/3 intersect no nonnegative integers: infeasible arrays despite real roots. Inputs one/two give counts two/eight or three/twelve, so rounding cannot repair the model.',
  ),
  e(
    'parabola-opening-and-scale',
    'J93-L01',
    7,
    '平方非负、开口与非恒斜率',
    'Nonnegative squares, opening and nonconstant rate',
    '两处2(x−3)²−2与−3(x+2)²+5用平方≥0推开口和值域，单位输入变化2/6或−3/−9证明a不是固定斜率；a0退常数，不能保唯一顶点或二次身份。',
    'Both use nonnegative squares in 2(x−3)²−2 and −3(x+2)²+5 for opening/range. Unit-input changes two/six or −3/−9 refute a constant slope. At a=0 the rule is constant, losing quadratic identity and a unique vertex.',
  ),
  e(
    'parabola-vertex-and-symmetry',
    'J93-L02',
    7,
    '平方为零的顶点与任意对称距离',
    'Zero-square vertex and arbitrary symmetric offsets',
    '两组亲解平方0得顶点(3,−2)/(−2,5)与轴x3/x−2，纠括号符号左右误读；一般代h±d均ad²+k说明任意距离对称，a0时不能宣称唯一轴/顶点。',
    'Both set the square to zero for vertices (3,−2)/(−2,5) and axes x=3/x=−2, correcting bracket-sign shift errors. Substituting h±d yields ad²+k for arbitrary symmetric offsets. At a=0 neither a unique axis nor vertex may be asserted.',
  ),
  e(
    'quadratic-function-forms',
    'J93-L03',
    8,
    '三式全展开、外系数与可读特征',
    'Full expansion of three forms, scale and readable features',
    '两组三式分别统一系数(1,−6,8)/(2,4,−6)，读截距、顶点轴与根，完整展开证所有输入同。另乘2保根但改零输入输出16/−12，说明同根不代表同函数、外系数不能丢。',
    'The form triples expand to coefficients (1,−6,8)/(2,4,−6), reading intercepts, vertex/axis and roots while proving identity for all inputs. Doubling preserves roots but changes zero-input outputs to sixteen/−12, showing equal roots do not imply equal functions and outside scale must remain.',
  ),
  e(
    'horizontal-intersection-equivalence',
    'J93-L04',
    9,
    '原交点与差图零点的纵坐标',
    'Original intersections versus difference-graph outputs',
    'H03原x²=3交点纵3而差图纵0，根±√3，1.73平方非3；H04原2x²=5纵5而差图纵0，根±√10/2，1.58给4.9928。均列精确有序点及负根，用零乘积分支证完整，不混两图或凭视窗。',
    'H03 original x²=3 intersections have output three while the difference graph has zero, roots ±√3, and 1.73 fails exact squaring. H04 uses 2x²=5 with outputs five/zero, roots ±√10/2 and approximation 1.58 giving 4.9928. Both list exact ordered points and negative roots with exhaustive zero-product branches, not mixed graphs or window evidence.',
  ),
  e(
    'quadratic-domain-optimum',
    'J93-L05',
    10,
    '原正边域与受限最优证明',
    'Original positive-side domain and constrained optimum proof',
    '两组从周长24/28推x(12−x)/x(14−x)，保正边0<x<12/14，配方全域最大36/49。再限1≤x≤5或2≤x≤6，顶点不可用；任意允许x距中心至少1，故最大35/48在右端，核长7/8及cm²，非只试样点。',
    'Both derive x(12−x) or x(14−x) from perimeter twenty-four/twenty-eight and positive-side domains, then prove global maxima thirty-six/forty-nine. Restrictions [1,5]/[2,6] exclude the vertex; every input is at least one from the centre, proving maxima thirty-five/forty-eight at the right endpoint, with lengths seven/eight and cm², rather than sample trials.',
  ),
];
