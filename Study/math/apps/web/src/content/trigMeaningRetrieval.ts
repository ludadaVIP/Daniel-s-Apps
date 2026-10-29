import { t, type Question } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'H22' | 'H23') => {
  const near = unit === 'H22',
    id = (n: number) => `${unit}-MAINT-TRIG-MEANING-Q${n}`;
  const card = (
    n: number,
    skill: string,
    z: string,
    en: string,
    rz: string,
    re: string,
  ) =>
    reasoning(id(n), t(z, en), skill, t(rz, re), [
      t(
        '先亲画、标给定直角与参照角，再写原比例和单位。精确值、近似数与指定表示分开；不从外观补前提，反例保留全部原已知。',
        'Draw and label the given right angle and reference before writing the original ratio and units. Separate exact values, approximations and required representations. Appearance supplies no premise; counterexamples retain every original given.',
      ),
      t(
        '每次一个编号或独立案例，可分次不计时、口述/熟悉语言。读题协助不算数学提示；自己的设计接受不同合法答案，逐项人审。全部虚构纸图，无需实测、购买、出行或上传。',
        'One numbered part or independent case per untimed sitting. Oral/familiar-language work is welcome. Separate reading assistance from mathematical hints. Accept different valid own designs after reviewing their reasoning. All are fictional paper models, requiring no measurements, purchases, travel or uploads.',
      ),
    ]);
  type Row = [string, string, string, string, string];
  const table = (q: Question, rows: Row[]) => {
    q.contextTable = {
      caption: t(
        '各编号独立，普通三角形均需给定直角与0°<θ<90°。原长度保单位，边比无单位；纸图显示不增加条件。',
        'Cases are independent. Ordinary triangles require a given right angle and 0°<θ<90°. Retain original length units; side ratios are dimensionless. A paper display adds no premise.',
      ),
      columns: [
        t('编号', 'ID'),
        t('对象', 'Object'),
        t('原条件', 'Original conditions'),
      ],
      rows: rows.map(([k, z, en, v, ve]) => [t(k, k), t(z, en), t(v, ve)]),
    };
  };
  const q1 = card(
    1,
    'trig-special-angle-derivation-and-side-inverses',
    '① E亲画给定等边三角形，作一顶点到底边的垂高，用SAS/HL等适用依据证明分半，标30°/60°与直角，再由勾股求高；分别以30°和60°为参照生成全部sin/cos/tan精确值，不能只背表。I独立画等腰直角三角形，由两腿和勾股生成45°三个精确比，说明1/√2与√2/2为何等值而0.71非精确。② C独立已知cos与斜边，按原定义求邻腿；T独立已知tan与对腿，反求邻腿，逐项乘回，写两条相应非退化直角三角形的边长，别把两个案例拼成一个。③ 另画同一三角形两个锐角，利用互余与换腿解释sinA=cosB、cosA=sinB，tan的关系是什么？旋转反射保字母身份，屏幕缩放和全边同乘正数都不改同角比。原O8的一般AA证明和换角数值继续用，不重证一次就当所有情境都懂。',
    '① DRAW E’s equilateral triangle and an altitude from a vertex to its opposite side. Justify the bisection using an applicable congruence argument, label 30°/60° and the right angle, and find the altitude by Pythagoras. Generate ALL exact sine/cosine/tangent values for 30° and 60° from side roles, not a memorised table. Independently DRAW I’s isosceles right triangle and derive all three 45° ratios. Explain 1/√2=√2/2 and why 0.71 is not exact. ② Separate C supplies cosine and hypotenuse: recover the adjacent leg from the definition. Separate T supplies tangent and opposite: solve for the adjacent denominator. Check back and give the three sides of EACH nondegenerate right triangle, without merging the cases. ③ DRAW the two acute references in one triangle. Use complementary angles and swapped legs for sinA=cosB and cosA=sinB; what relates their tangents? Rotation/reflection preserve letters. Display zoom and multiplying every length by one positive factor preserve same-angle ratios. Retain O8’s general AA argument and original reference-switch calculations.',
    near
      ? 'E等边边长2cm，连顶点与底边中点，两底半长1、公共中线及两等边由SSS得两小三角形全等；邻补且相等的底中点角均90°，顶角60°被分成30°。高²=4−1=3，高√3cm。30°给sin1/2、cos√3/2、tan1/√3=√3/3；60°给sin√3/2、cos1/2、tan√3。I两腿1cm，斜边√2，sin45=cos45=1/√2=√2/2、tan45=1；有理化乘√2/√2，0.71²=0.5041≠1/2。C有AC/AB=3/5、AB=15/2cm，AC=9/2cm，另一腿6cm，(9/2)²+6²=(15/2)²。T有BC/AC=5/12、BC=5/2cm，AC=(5/2)÷(5/12)=6cm、AB=13/2cm，代回(5/2)/6=5/12；不能乘成25/24。互余角交换对/邻腿，sinA=cosB、cosA=sinB且tanA·tanB=1，分母均正。'
      : 'E等边边长4cm，连顶点到底中点，底半2、公共中线及等边由SSS得两小图全等，邻补的相等角均90°，顶角平分成30°。高²=16−4=12，高2√3cm，30°比为1/2、√3/2、√3/3，60°比为√3/2、1/2、√3。I两腿3/2cm，斜边3√2/2，sin45=cos45=1/√2=√2/2、tan45=1，统一倍率约去；0.71²0.5041非1/2。C有AC/AB=5/13、AB=13/2cm，AC=5/2cm、另一腿6cm，平方和回核。T有BC/AC=8/15、BC=4cm，AC=4÷(8/15)=15/2cm、AB=17/2cm，代回4/(15/2)=8/15，不能乘成32/15。两锐角互余而腿交换，sinA=cosB、cosA=sinB，tanA与tanB为正倒数，积1，不是换参照后继续用原tan。',
    near
      ? 'E has equilateral side 2 cm. Join the vertex to the base midpoint: halves 1, equal sides and common median give SSS congruence. Equal supplementary midpoint angles are 90°, and the 60° apex is bisected into 30°. Altitude squared is 4−1=3. For 30°, sin=1/2, cos=√3/2, tan=1/√3=√3/3; for 60°, sin=√3/2, cos=1/2, tan=√3. I has legs 1 and hypotenuse √2: sin45=cos45=1/√2=√2/2 and tan45=1. Rationalisation multiplies by √2/√2; 0.71²=0.5041≠1/2. C has AC/AB=3/5 and AB=15/2, giving AC=9/2 and other leg 6 cm; their squares sum to (15/2)². T has BC/AC=5/12 and BC=5/2: AC=6, AB=13/2 cm. Substitution (5/2)/6=5/12 checks it; multiplying would wrongly give 25/24. Complementary references swap opposite/adjacent legs: sinA=cosB, cosA=sinB and tanA·tanB=1 with positive denominators.'
      : 'E has equilateral side 4 cm. Joining the vertex to the base midpoint gives halves 2 and two SSS-congruent triangles. Their equal supplementary angles are right angles; the apex splits into 30°. Altitude squared is 16−4=12, giving 2√3 cm. The 30° ratios are 1/2,√3/2,√3/3 and the 60° ratios √3/2,1/2,√3. I has legs 3/2 and hypotenuse 3√2/2 cm: common scale cancels to sin45=cos45=√2/2 and tan45=1. Decimal 0.71 squares to 0.5041 rather than 1/2. C has AC/AB=5/13 with AB=13/2: AC=5/2 and other leg 6 cm, checked by squares. T has BC/AC=8/15 and BC=4: AC=15/2, AB=17/2 cm; 4/(15/2)=8/15 checks back. Multiplication would wrongly give 32/15. Complementary references swap the legs, giving sinA=cosB, cosA=sinB and positive reciprocal tangents with product 1.',
  );
  table(q1, [
    [
      'E',
      '独立等边→垂高',
      'Separate equilateral→altitude',
      `等边边长${near ? 2 : 4}cm；亲作到底边的垂高`,
      `Equilateral side ${near ? 2 : 4}cm; construct its altitude`,
    ],
    [
      'I',
      '独立等腰直角',
      'Separate isosceles right triangle',
      `两直角边均${near ? '1' : '3/2'}cm`,
      `Both legs ${near ? '1' : '3/2'}cm`,
    ],
    [
      'C',
      '独立cos正向求邻腿',
      'Separate cosine: find adjacent',
      `∠C=90°;cosA=${near ? '3/5' : '5/13'};AB=${near ? '15/2' : '13/2'}cm`,
      `C=90°;cosA=${near ? '3/5' : '5/13'};AB=${near ? '15/2' : '13/2'}cm`,
    ],
    [
      'T',
      '独立tan反求邻腿',
      'Separate tangent: recover adjacent',
      `∠C=90°;tanA=${near ? '5/12' : '8/15'};BC=${near ? '5/2' : '4'}cm`,
      `C=90°;tanA=${near ? '5/12' : '8/15'};BC=${near ? '5/2' : '4'}cm`,
    ],
  ]);
  const q2 = card(
    2,
    'trig-representation-window-and-inverse-domain',
    '① F先写精确值，再按表内四位小数要求表示，解释分数/整数与带尾零形式的数量和任务完成状态是否同一回事。N独立算θ与2θ的给定函数值，给实际反例说明角倍增不保证比倍增；不以有限成功例证明线性。② G用DEG求正切到四位小数，亲画纵窗[0,4]时应怎样表示所选点，再只扩图窗，原角、值与存在性会变吗？分开窗外合法锐角值、θ趋90°与恰90°零分母。③ V先统一单位由对边/斜边求sin的比，反求锐角到0.1°；另一个独立直角三角形把同一数作cos比，反求并用互余核验。把给定RAD显示转换为约度数，不只换符号；它是舍入显示，不宣称精确角。解释反函数非倒数与锐角唯一性。④ 逐项审sin/cos/tan的比0、1、6/5、−1：哪些能来自本课锐角，特别tan=1与tan>1呢？不能把sin/cos端点说法泛套所有函数。原O9一般投影单调与正分母证明继续用。',
    '① For F, give exact values, then the required four-place decimals. Distinguish numerical equality from completing a representation request, including trailing zeros. For separate N, compute the specified function at θ and 2θ and give an actual counterexample to “doubling angle doubles ratio”. Finite successful samples do not prove linearity. ② Use DEG for G’s tangent to four places. DRAW how a [0,4] vertical window treats the selected point; then expand ONLY the window. Do the angle, value or existence change? Separate a valid off-window acute value, approaching 90°, and the exact zero-denominator endpoint. ③ For V, unify units for opposite/hypotenuse and recover the sine angle to 0.1°. In a SEPARATE right triangle use the SAME numerical ratio as cosine; invert and check complementarity. Convert the supplied rounded RAD display to approximate degrees rather than changing its symbol or calling it exact. Explain inverse versus reciprocal and acute-angle uniqueness. ④ Audit ratios 0,1,6/5,−1 for EACH of sine, cosine and tangent. Which can come from this acute model, especially tan=1 and tan>1? Do not extend sine/cosine endpoint restrictions to every function. Retain O9’s general projection and positive-denominator arguments.',
    near
      ? 'F的sin30=1/2→0.5000，tan45=1→1.0000；1/2与0.5000同量，但只写1/2未完成本题指定小数表示，并非数学值错。N的sin30=1/2，sin60=√3/2≠1=2sin30，不能称线性。G的tan85≈11.4301>4，点在窗外但存在；扩到[0,12]可显示，不改值，不能钳到4。θ趋90时tan无界增大，恰90分母零未定义。V中3m/500cm=3/5，arcsin(3/5)≈36.86989765°→36.9°；独立arccos(3/5)≈53.13010235°→53.1°，两精确角互余。显示0.643501rad乘180/π约36.8699°，可给同一0.1°结果但不是精确原角；5/3是无单位倒数不是角。sin/cos严格0<比<1，所以0和1是被排端点、6/5超界、−1非法；tan只需正比，1给45.0°，6/5给约50.2°，0和−1不在严格锐角域。各函数在锐角域严格单调，所以合法比各唯一；别把cos的减趋势说成角不存在。'
      : 'F的cos60=1/2→0.5000，tan45=1→1.0000；值相等不等于所有表示都完成四位要求。N的cos30=√3/2，cos60=1/2≠√3=2cos30，倍角非倍值。G的tan80≈5.6713>4，窗外值仍存在，纵窗扩到[0,6]即可画，不把值改4；恰90仍未定义。V统一50cm/1.3m=5/13，arcsin(5/13)≈22.61986495°→22.6°，另独立arccos(5/13)≈67.38013505°→67.4°，未舍入两角和90。0.394791rad乘180/π约22.6198°，仅显示近似而不是精确角；13/5为倒数不是反函数角。sin/cos的0、1是被排端点，6/5超1、−1非法；tan=1给合法45.0°、tan=6/5约50.2°也合法，0与−1不在本课锐角域。严格单调给每种合法比唯一锐角，不能把一个函数的端点范围借给另一个。',
    near
      ? 'F gives sin30=1/2→0.5000 and tan45=1→1.0000. Equal quantities can have different task representations: 1/2 is mathematically correct but does not complete a four-place decimal request. N gives sin60=√3/2≠1=2sin30, refuting linear doubling. G has tan85≈11.4301>4: it exists outside [0,4] and becomes visible in [0,12] without changing the value. Do not clamp to 4. Tangent grows without bound approaching 90°; at 90° division by zero is undefined. V converts 3m/500cm=3/5. arcsin(3/5)≈36.86989765°→36.9°; separate arccos(3/5)≈53.13010235°→53.1°. The unrounded angles are complementary. Rounded display 0.643501rad×180/π≈36.8699° gives the same tenth-degree result but is not the exact original angle. Reciprocal 5/3 is dimensionless, not an angle. Acute sine/cosine require 0<ratio<1: 0 and 1 are excluded endpoints; 6/5 and −1 are inadmissible. Tangent requires a positive ratio: 1 gives 45.0°, 6/5 gives about 50.2°, while 0 and −1 are excluded. Strict monotonicity on the acute domain gives uniqueness for each valid function/ratio.'
      : 'F gives cos60=1/2→0.5000 and tan45=1→1.0000: numerical equality does not make every representation satisfy four places. N gives cos60=1/2≠√3=2cos30, an actual nonlinear-doubling counterexample. G gives tan80≈5.6713>4, still defined off-window; [0,6] displays it without replacing it by 4. At 90° tangent remains undefined. V converts 50cm/1.3m=5/13: arcsin≈22.61986495°→22.6° and separate arccos≈67.38013505°→67.4°. Before rounding their sum is 90°. Rounded display 0.394791rad×180/π≈22.6198° is approximate, not the exact angle. Reciprocal 13/5 does not recover an angle. For acute sine/cosine, 0 and 1 are excluded endpoints; 6/5 and −1 are invalid. Tangent has valid positive ratios 1→45.0° and 6/5→about50.2°; 0 and −1 are outside the acute model. Strict monotonicity gives each admissible function/ratio one acute angle. Do not borrow one function’s range for another.',
  );
  table(q2, [
    [
      'F',
      '独立精确值与四位小数',
      'Separate exact/four-place forms',
      `${near ? 'sin30°' : 'cos60°'};tan45°；两者均要求四位小数`,
      `${near ? 'sin30°' : 'cos60°'};tan45°; require four decimal places for both`,
    ],
    [
      'N',
      '独立角倍增',
      'Separate angle doubling',
      `${near ? 'sin' : 'cos'}θ；θ=30°,2θ=60°`,
      `${near ? 'sin' : 'cos'}θ;θ=30°,2θ=60°`,
    ],
    [
      'G',
      '独立合法值与图窗',
      'Separate valid value/window',
      `tan${near ? 85 : 80}°;纵窗[0,4]→[0,${near ? 12 : 6}]`,
      `tan${near ? 85 : 80}°;vertical window[0,4]→[0,${near ? 12 : 6}]`,
    ],
    [
      'V',
      '独立两函数与单位',
      'Separate inverses/units',
      near
        ? '对边3m、斜边500cm；另一独立cos取同一比。sin角RAD显示0.643501rad'
        : '对边50cm、斜边1.3m；另一独立cos取同一比。sin角RAD显示0.394791rad',
      near
        ? 'opposite3m,hypotenuse500cm; separate cosine uses the same ratio. Sine-angle RAD display0.643501rad'
        : 'opposite50cm,hypotenuse1.3m; separate cosine uses the same ratio. Sine-angle RAD display0.394791rad',
    ],
  ]);
  const q3 = card(
    3,
    'trig-distance-kind-base-counterexample-and-own-model',
    '① H中e是仪器离观测地面的高度，b是目标基部相对同一观测地面的高程。先统一cm/m，画仪器水平辅助线与直立目标，按表中已知基面高程先求树顶相对观测地面的高程，再求完整树高；保根式直到最后一位小数。② L独立把相同写出的距离改成视线长度，其他给定不变，求水平距/竖直高差/树高，比较H。为何同一个数不能不看量名就直接套tan？若把tan30提前改0.6，H的最终一位答案怎样错？③ U独立撤目标基面高程，只保原水平距/角/仪器高，亲画两个不同基面、相同树顶的合法模型，给两树高证明不唯一，不把缺测当零。④ 自己另选合法参数，画一张水平/视线两种卡和一幅坡面；报告角、比、精确量与最终近似及精度，标仪器/基面修正。坡面仍分别求百分数、角、斜长，不用斜长当水平距；另给一个撤前提或零水平距失败例。原O10的坡道与逐条约束计算继续用。虚构纸上模型无需真实测量。一次一个编号。',
    '① For H, e is instrument height above observer ground; b is the target-base elevation above that SAME datum. Unify cm/m and DRAW the instrument’s horizontal auxiliary and vertical target. Using the given base elevation, first find treetop elevation above observer ground, then full tree height. Keep radicals until the final one-decimal report. ② L independently changes the SAME written distance to a sight length, retaining the other givens. Find horizontal distance, rise and height, and compare H. Why cannot a bare number choose tangent? If tan30 is prematurely changed to 0.6, how does H’s final tenth-metre answer change? ③ U independently removes target-base elevation, retaining original horizontal distance, angle and instrument height. DRAW two legal bases sharing the SAME treetop; calculate two heights to prove nonuniqueness rather than treating an unknown as zero. ④ Choose DIFFERENT valid parameters for your own horizontal/sight cards and a slope drawing. Report angle, ratio, exact quantities and final approximations/precision, labelling instrument/base corrections. For the slope calculate grade, angle and inclined length separately, and give a premise-removed or zero-run failure example. Retain O10’s original ramp and constraint calculations. These are fictional paper models, not measurements. One numbered part per sitting.',
    near
      ? 'H的D=450cm=9/2m、e=3/4m、基面b=1/4m。rise=Dtan30=3√3/2m，树顶z=3√3/2+3/4，树高h=z−b=3√3/2+1/2≈3.098076→3.1m。L的斜边9/2m给水平9√3/4、rise=9/4，z=3，h=11/4=2.75→2.8m，不等H。提前tan30≈0.6会给H的h=(9/2)×0.6+1/2=3.2m，改变最终答案。U只保原D/e/30，树顶仍3√3/2+3/4；b=0与b=1/4给h≈3.348076与3.098076，即3.3与3.1m，均正且原观测不变。自己的不同例可选D=4m、θ=45°、e=1m、b=1/2m：水平卡h=9/2=4.5m；视线卡h=2√2+1/2≈3.3m。自选坡升1/2m、水平3/2m给grade100/3%≈33.3%、角arctan(1/3)≈18.4°、斜长√10/2≈1.6m。其他合法设计同样接受；run=0无有限百分数，未知b不能默设0。'
      : 'H的D=750cm=15/2m、e=5/4m、基面b=3/4m。rise=5√3/2m，树顶z=5√3/2+5/4，树高h=5√3/2+1/2≈4.830127→4.8m。L把15/2m改视线，水平15√3/4、rise=15/4，z=5，h=17/4=4.25→4.3m。提前tan30≈0.6会给H的h=(15/2)×0.6+1/2=5.0m，非4.8m。U仍保原水平D/e/30，z不变；基面b=0与b=3/4分别给h≈5.580127与4.830127，即5.6与4.8m，均正且同树顶，故条件不足。自主不同例可取D=6m、θ=45°、e=3/2m、b=1/2m：水平卡h=7.0m；视线卡h=3√2+1≈5.2m。另坡升3/4m、水平1/2m给grade150.0%、角arctan(3/2)≈56.3°、斜长√13/4≈0.9m。其他合法设计可用，超过100%仍可锐角；run=0无有限坡度，缺基面不能补零。',
    near
      ? 'H converts D=450cm=9/2m, with e=3/4m and base b=1/4m. Rise=Dtan30=3√3/2m; top z=3√3/2+3/4 and height h=z−b=3√3/2+1/2≈3.098076→3.1m. L instead uses sight9/2m: horizontal9√3/4,rise9/4,z=3,h=11/4=2.75→2.8m. Premature tan30≈0.6 gives H height (9/2)×0.6+1/2=3.2m, changing the final result. U retains horizontal D,e,30° and the same top. Bases 0 and1/4 give heights≈3.348076 and3.098076, reported3.3 and3.1m: positive, with identical observations. One DIFFERENT own example is D=4m,45°,e=1m,b=1/2m: horizontal height4.5m, sight height2√2+1/2≈3.3m. An own slope with rise1/2m,run3/2m gives grade100/3%≈33.3%, angle arctan(1/3)≈18.4°, inclined length√10/2≈1.6m. Accept other valid designs. Zero run gives no finite grade; an unknown base cannot silently become zero.'
      : 'H converts D=750cm=15/2m,e=5/4m,b=3/4m. Rise=5√3/2m; top z=5√3/2+5/4 and height h=5√3/2+1/2≈4.830127→4.8m. L uses sight15/2m instead: horizontal15√3/4,rise15/4,z=5,h=17/4=4.25→4.3m. Rounding tan30 to0.6 early gives (15/2)×0.6+1/2=5.0m, not4.8m. U retains original horizontal D,e,30° and the top; bases0 and3/4 give positive heights≈5.580127 and4.830127, reported5.6 and4.8m. Thus identical observations do not determine height without the base. A DIFFERENT own example D=6m,45°,e=3/2m,b=1/2m gives horizontal height7.0m or sight height3√2+1≈5.2m. An own slope rise3/4m,run1/2m gives grade150.0%, angle arctan(3/2)≈56.3° and inclined length√13/4≈0.9m. Accept other valid designs. Grade above100% may be acute; zero run is undefined and a missing base cannot be assumed zero.',
  );
  table(q3, [
    [
      'H',
      '独立水平距与已知基面',
      'Separate horizontal distance/known base',
      `D=${near ? 450 : 750}cm(水平),θ=30°,e=${near ? '3/4' : '5/4'}m,b=${near ? '1/4' : '3/4'}m；目标直立`,
      `D=${near ? 450 : 750}cm(horizontal),θ=30°,e=${near ? '3/4' : '5/4'}m,b=${near ? '1/4' : '3/4'}m; vertical target`,
    ],
    [
      'L',
      '独立同数视线距',
      'Separate same-number sight length',
      `L=${near ? 450 : 750}cm(视线)；θ/e/b与H相同`,
      `L=${near ? 450 : 750}cm(sight); same θ/e/b as H`,
    ],
    [
      'U',
      '独立撤基面条件',
      'Separate base premise removed',
      `保H的水平D/θ/e，未给b；不沿用H的b`,
      `Retain H’s horizontal D/θ/e; b is unknown and is NOT imported from H`,
    ],
  ]);
  return {
    id: `${unit}-MAINT-TRIG-MEANING`,
    unit,
    bridge: 'J96-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 4, 5].map((n, i) => [id(i + 1), `J96-L0${n}`]),
    ),
    title: t(
      '三角比的推导、表示与测高前提',
      'Trig derivations, representations and height premises',
    ),
    intro: t(
      '三张独立纸笔卡，每次一编号/案例，可分次不计时、口述或熟悉语言。亲画、推导、逆求和构造反例后逐项人审；读题帮助与数学提示分开。原十题和记录保留；虚构资料无需实测、购买、出行或上传。',
      'Three independent paper cards, one numbered part/case per untimed sitting. Oral/familiar-language work is welcome. Draw, derive, invert and construct counterexamples before human review. Separate reading help from mathematical hints. Original ten tasks and records remain; fictional data need no measurement, purchase, travel or upload.',
    ),
    questions: [q1, q2, q3],
  };
};
export const trigMeaningRetrieval = {
  H22_TRIG_MEANING: makeSet('H22'),
  H23_TRIG_MEANING: makeSet('H23'),
};
