import { t } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'H32' | 'H36') => {
  const first = unit === 'H32',
    id = (i: number) => `${unit}-MAINT-CIRCULAR-Q${i}`;
  const task = (
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
        '写角度单位、原定义域与所有分支；画图帮助解释，再用一般依据和精确代入核查。',
        'State angle units, original domains and every branch. Draw to explain, then check with a general argument and exact substitution.',
      ),
    ]);
  return {
    id: `${unit}-MAINT-CIRCULAR`,
    unit,
    bridge: 'H04-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4, 5, 6].map((i) => [id(i), `H04-L0${i}`]),
    ),
    title: t(
      '累积与解析几何之后，再看圆周与波形',
      'After accumulation and analytic geometry, revisit circles and waves',
    ),
    intro: t(
      '六题分次，每次一题；图和理由可拆两次。使用纸笔画单位圆、波形或区间，全部人工核验，不计时。',
      'Choose one of six tasks per sitting; split drawing and explanation across sittings if useful. Use paper for a unit circle, wave or interval. Every argument is human-reviewed without a timer.',
    ),
    questions: [
      task(
        1,
        'radian-arc-ratio',
        `半径${first ? 3 : 4}cm的圆，从正横轴连续${first ? '顺' : '逆'}时针转${first ? 750 : 1110}°。用θ=s/r写完整有向弧度、带符号累计弧长和总走过的长度；再给一个同终边角。只写${first ? '−π/6' : 'π/6'}能回答完整转角吗？若半径加倍、完整转角不变，这些量怎样变？解释1rad与1°。`,
        `On a circle of radius${first ? 3 : 4}cm, rotate continuously ${first ? 'clockwise through750' : 'counterclockwise through1110'} degrees from the positive horizontal axis. Using θ=s/r, give the full directed angle in radians, signed accumulated arc and total distance travelled, then a coterminal angle. Does writing only${first ? '−π/6' : 'π/6'} answer the full rotation? What changes if radius doubles but rotation stays fixed? Distinguish one radian from one degree.`,
        first
          ? '完整θ=−750π/180=−25π/6 rad，不能抹掉两整周；有向s=rθ=−25π/2cm，总长度25π/2cm。加4π得同终边−π/6，只保终点而不保绕行次数。θ=s/r是有向比；半径加倍使有向弧和路程均倍增，角度不变。1rad对应有向弧长等于半径，π rad=180°，故1rad不是1°。'
          : '完整θ=1110π/180=37π/6 rad，有向s=4θ=74π/3cm，总长度同为74π/3cm。减6π得同终边π/6，但删了三整周，不能替代完整角。半径倍增、θ不变时有向弧和路程倍增，s/r不变。1rad是弧长等于半径的转角；πrad精确等于180°，不是把1rad当1°。',
        first
          ? 'The full θ is−750π/180=−25π/6 rad. Signed arc s=rθ=−25π/2cm and total distance25π/2cm retain the winding. Adding4π gives coterminal−π/6, which preserves the endpoint but loses two full turns. Doubling radius at fixed θ doubles signed arc and distance, leaving their ratio θ unchanged. One radian corresponds to directed arc equal to radius; πrad=180°, so one radian is not one degree.'
          : 'The full θ is1110π/180=37π/6 rad. Signed arc s=4θ=74π/3cm and total distance74π/3cm retain all turns. Subtracting6π gives coterminalπ/6 but loses three full turns. Doubling radius at fixed angle doubles signed arc and distance, leaving s/r unchanged. One radian corresponds to arc equal to radius; πrad is exactly180°, not one degree.',
        '先保方向与完整圈数，再换弧度；同终边只回答终点。',
        'Keep direction and complete winding before converting. Coterminal angles describe the endpoint.',
      ),
      task(
        2,
        'unit-circle-signed-coordinates',
        `画单位圆，标角${first ? '−5π/6' : '5π/3'}的终点，精确写(cosθ,sinθ)及tanθ，并解释各符号。再对π/2和3π/2说明正切为何无定义。能把锐角三角形的正边长比原样当任意角三角函数都非负的理由吗？`,
        `Draw the unit circle and endpoint for${first ? '−5π/6' : '5π/3'}. Give exact(cosθ,sinθ), tanθ and their signs. Explain undefined tangent atπ/2 and3π/2. Can positive side-length ratios from an acute right triangle justify nonnegative trigonometric functions at arbitrary angles?`,
        first
          ? '−5π/6同终边7π/6，在第三象限，点(−√3/2,−1/2)，tan=sin/cos=√3/3为正。横纵坐标都负而非边长为负，锐角参考角π/6的长度只给绝对值。π/2与3π/2横坐标0、纵±1，商需除0所以tan无定义，不能写无穷作为实值。任意角定义是带符号坐标，锐角边长模型是其中一部分。'
          : '5π/3在第四象限，点(1/2,−√3/2)，tan=−√3；正横坐标、负纵坐标来自圆上位置，不是边长负。π/2、3π/2横坐标0，tan作为sin/cos不能除0，没有本课实数值。锐角长度比只覆盖第一象限参考情形，不能据此断言任意角函数非负。',
        first
          ? 'Angle−5π/6 is coterminal with7π/6 in quadrant three: the point is(−√3/2,−1/2), and tan=sin/cos=√3/3. Negative coordinates are not negative side lengths; the reference triangle supplies magnitudes only. Atπ/2 and3π/2 the horizontal coordinate is zero and vertical coordinate±1, so division by zero leaves tangent undefined, not an infinite real value. Signed circle coordinates extend the acute-triangle model.'
          : 'Angle5π/3 lies in quadrant four, with point(1/2,−√3/2) and tan=−√3. Coordinate signs come from circle position, not negative lengths. Atπ/2 and3π/2,cos is zero, so tangent as sin/cos has no real value. Positive acute-triangle side ratios cannot justify nonnegative values for every angle.',
        '先看终点象限；正切是纵坐标除横坐标，先核分母。',
        'Locate the quadrant first. Tangent divides vertical coordinate by horizontal coordinate, so check the denominator.',
      ),
      task(
        3,
        'circular-coordinate-to-wave',
        first
          ? '沿单位圆转一周，把θ=0,π/2,π,3π/2,2π的纵坐标搬到y=sinθ图上，画波形。相邻零点相距π，为什么这不证周期π？给精确反例，再用任意角整周复位及最高点位置证明最小正周期2π，不能只试几个点。'
          : '沿单位圆转一周，把θ=0,π/2,π,3π/2,2π的横坐标搬到y=cosθ图上，画波形。相邻零点相距π，为什么这不证周期π？给精确反例，再用任意角整周复位及最高点位置证明最小正周期2π，不能只试几个点。',
        first
          ? 'Transfer unit-circle vertical coordinates at0,π/2,π,3π/2,2π to a graph of y=sinθ. Adjacent zeros areπ apart: why does that not establish periodπ? Give an exact counterexample, then prove the least positive period2π using full-turn recovery for every angle and the locations of maxima, not a finite sample.'
          : 'Transfer unit-circle horizontal coordinates at0,π/2,π,3π/2,2π to y=cosθ. Adjacent zeros areπ apart: why does that not establish periodπ? Give an exact counterexample, then prove the least positive period2π using full-turn recovery for every angle and the locations of maxima, not a finite sample.',
        first
          ? '五个纵坐标0,1,0,−1,0。π/2的1平移π到3π/2变−1，故π不是周期；周期要求所有实θ的值都恢复。任意圆点转2π回同点，故2π确为周期。若T>0为周期，最高点θ=π/2的1也须在π/2+T出现；单位圆纵坐标1只在顶点，角为π/2+2kπ，所以T=2kπ，正者至少2π。这同时给存在与最小，不从零点间隔猜。'
          : '五个横坐标1,0,−1,0,1。0的1平移π到π变−1，故π不是周期。任意圆点转2π回同点，所有实θ值恢复，2π是周期。若正T为周期，cos0=1要求cosT=1；单位圆横坐标1只在最右点，角2kπ，所以正T至少2π，已知2π可用，故最小。零点反复不等于整条函数恢复。',
        first
          ? 'The five heights are0,1,0,−1,0. A shiftπ takes value one atπ/2 to negative one at3π/2, soπ fails. A period must preserve every real input value. A full2π turn recovers any circle point, proving periodicity. If T>0 is a period, the maximum atπ/2 must recur atπ/2+T. Height one occurs only at the circle top, at anglesπ/2+2kπ, so T=2kπ and any positive T is at least2π. Existence and minimality both follow.'
          : 'The five horizontal coordinates are1,0,−1,0,1. Shifting zero byπ changes one to negative one, soπ fails. A full2π turn recovers every circle point, proving a period for all inputs. Any positive period T must take cos0=1 to cosT=1. Horizontal coordinate one occurs only at the rightmost circle point, at angles2kπ, so any positive T is at least2π;2π already works. Repeated zeros alone do not restore a whole function.',
        '把零点重复和所有输入的值重复分开；最小性可从必须保持的最高点推出。',
        'Separate repeated zeros from preserved values at every input. Minimality follows by requiring a maximum to recur.',
      ),
      task(
        4,
        'circular-inner-angle-transform',
        `给g(x)=${first ? '−3sin(2(x−π/6))+1' : '2cos(−3(x+π/9))−1'}，x为任意实数弧度。求振幅、中线、像集、最小正周期；从内角u反解x，搬u=0,π/2,π,3π/2,2π五点并画一周。说明负外/内系数与横倍率。若只改外系数A=0，或只改内系数B=0，分别还有最小正周期吗，能从常数图反求原相位吗？`,
        `For g(x)=${first ? '−3sin(2(x−π/6))+1' : '2cos(−3(x+π/9))−1'}, x ranges over all real radians. Find amplitude, midline, image and least positive period. Solve the inner-angle equation for x and transfer u=0,π/2,π,3π/2,2π to draw one cycle. Explain signed outer/inner multipliers and horizontal scale. If only A becomes zero, or only B becomes zero, does a least positive period remain? Can the original phase be recovered from the constant graph?`,
        first
          ? '振幅3非−3；中线1、像[−2,4]、最小正周期π。u=2(x−π/6)给x=π/6+u/2，五点x依次π/6,5π/12,2π/3,11π/12,7π/6，对应y1,−2,1,4,1。A−3把正弦竖直反射伸3倍，B2横缩1/2后平移π/6，再上移1。只A0变恒1；只B0也因sin0=0变恒1。常数所有正平移量都保持，所以有正周期但无最小正周期；不能套2π/|B|或由图唯一识别h/B。'
          : '振幅2、中线−1、像[−3,1]、最小正周期2π/3。u=−3(x+π/9)给x=−π/9−u/3，五点x为−π/9,−5π/18,−4π/9,−11π/18,−7π/9，y为1,−1,−3,−1,1；随着u增，新x反向，横反射缩1/3，竖伸2再下移1。余弦偶性使此负内系数也可用等价正系数表示。只A0恒−1；只B0因cos0=1恒1。两种常数都有每个正平移为周期、无最小正周期，不能由常数图唯一反求原h/B或在B0除它。',
        first
          ? 'Amplitude is three, not−3; midline one, image[−2,4], least positive periodπ. Solving u=2(x−π/6) gives x=π/6+u/2. The five x values areπ/6,5π/12,2π/3,11π/12,7π/6 with y values1,−2,1,4,1. Negative A reflects vertically and stretches by three; B2 compresses horizontally by1/2 before shifts. Setting only A=0 makes constant one; setting only B=0 also makes one since sin0=0. Every positive shift is a period of a constant, so there is no LEAST positive period. Neither2π/|B| nor unique phase recovery applies.'
          : 'Amplitude two, midline−1, image[−3,1], least positive period2π/3. Solving u=−3(x+π/9) gives x=−π/9−u/3. Five x values−π/9,−5π/18,−4π/9,−11π/18,−7π/9 give y values1,−1,−3,−1,1. Increasing u reverses x: horizontal reflection and scale1/3, vertical stretch two then down one. Cosine evenness also permits an equivalent positive inner multiplier. A=0 alone gives constant−1; B=0 alone gives constant one because cos0=1. Every positive shift preserves each constant, so neither has a least positive period or identifies the original phase uniquely; do not divide by zero B.',
        '点对应先解内角；幅度取非负，常数情形回定义查“最小”。',
        'Solve the inner angle for point correspondence. Amplitude is nonnegative; check least periodicity from the definition for constants.',
      ),
      task(
        5,
        'circular-identity-with-domain',
        `由任意单位圆点证明sin²θ+cos²θ=1，再推${first ? '(1−cos²θ)/sinθ=sinθ' : '(1−sin²θ)/cosθ=cosθ'}并写完整原域。${first ? 'θ=0' : 'θ=π/2'}处右式有值，能据此给左式补定义吗？用θ=π/4反驳sinθ+cosθ=1；有限成功代入能证明恒等式吗？`,
        `Prove sin²θ+cos²θ=1 from an arbitrary unit-circle point, then derive${first ? '(1−cos²θ)/sinθ=sinθ' : '(1−sin²θ)/cosθ=cosθ'} with its full original domain. At${first ? 'θ=0' : 'θ=π/2'} the right side is defined: may that silently define the left side? Refute sinθ+cosθ=1 atπ/4. Can finitely many successful substitutions prove an identity?`,
        first
          ? '任意θ点(cosθ,sinθ)在单位圆，坐标平方和1，覆盖所有实角。分子变sin²θ，只在sinθ≠0可约去，原域θ≠kπ，k∈Z；该域内等于sinθ。θ0左式0/0未定义，右式0不能自动扩原域；若另定义连续延拓须明确是新函数。π/4给sin+cos=√2≠1，一个域内反例足以反驳；若多个样点成功也不覆盖所有θ，一般单位圆论证才支撑恒等式。'
          : '任意θ的(cosθ,sinθ)满足圆方程，故平方和1是全实角结论。分子变cos²θ，仅cosθ≠0时可约，原域θ≠π/2+kπ，k∈Z；在此域左式等于cosθ。π/2原分母0、分子0，右式0不授权给原式补值；延拓须另声明函数。π/4时和√2非1反驳错误全称；有限成功例不证恒等，任意点的一般论证与单例反驳角色不同。',
        first
          ? 'For arbitrary θ, the point(cosθ,sinθ) lies on the unit circle, so its squared coordinates sum to one. The numerator becomes sin²θ, but cancellation requires sinθ≠0: the original domain excludes θ=kπ for every integer k. There it equals sinθ. At zero the original is0/0, undefined; the right-side zero cannot silently extend it. An explicitly declared extension would be a new function. Atπ/4 the sum is√2, not one, refuting the false universal with a single admissible witness. Finite successes do not prove an identity.'
          : 'An arbitrary point(cosθ,sinθ) satisfies the unit-circle equation for every real θ. The numerator becomes cos²θ, but cancellation requires cosθ≠0, excluding θ=π/2+kπ for every integer k. On that original domain it equals cosθ. Atπ/2 the original is0/0; the right-side zero does not authorise adding an input without declaring a new extended function. Atπ/4 the sum√2 differs from one. One admissible counterexample refutes a universal, while finite successful samples do not establish an identity.',
        '约分前先留分母非零条件；同一公式值与同一个定义域必须同时核。',
        'Retain the nonzero denominator condition before cancelling. Check both values and the domain.',
      ),
      task(
        6,
        'circular-complete-finite-roots',
        `解${first ? 'sin(2(x−π/6))=1/2' : 'cos(−3(x+π/9))=1/2'}，先给全部实根的两个分支，再在${first ? '[−5π/12,19π/12)' : '[−2π/3,2π/3)'}筛完整有限集合。写每支允许整数k、核两端开闭与原式。一个反三角主值为何不足？若只把右侧改2，解集怎样？`,
        `Solve${first ? 'sin(2(x−π/6))=1/2' : 'cos(−3(x+π/9))=1/2'}. First give both branches of ALL real roots, then filter the complete finite set on${first ? '[−5π/12,19π/12)' : '[−2π/3,2π/3)'}. State allowed integer k values on each branch and check endpoint ownership and the original equation. Why is one principal inverse-trig value insufficient? What if only the target changes to two?`,
        first
          ? '令u=2(x−π/6)。sin u=1/2给u=π/6+2kπ或5π/6+2kπ，故x=π/4+kπ或7π/12+kπ，k∈Z。区间筛第一支k0,1，第二支k−1,0，合{−5π/12,π/4,7π/12,5π/4}。左端−5π/12确为根且含；右端19π/12也是根但开端排除，不能只用近似数比较。两支内角逐个回到同两终点；arcsin主值只给π/6，漏另一终点和整周。右侧2超sin像[−1,1]，全实域及此区间都空。'
          : '令u=−3(x+π/9)，cos u=1/2给u=±π/3+2kπ。反解并重编号整数得x=−2π/9+2kπ/3或2kπ/3。区间第一支k0,1，第二支k−1,0，合{−2π/3,−2π/9,0,4π/9}。左端−2π/3为根且含，右端2π/3为根但不含；用精确角和原式核。单个arccos主值π/3漏负分支与整周；负内系数还需反解，不能只把主值当x。改右侧2超cos像[−1,1]，完整集空。',
        first
          ? 'Let u=2(x−π/6). Both branches are u=π/6+2kπ or5π/6+2kπ, hence x=π/4+kπ or7π/12+kπ for integer k. The interval admits k=0,1 on the first and k=−1,0 on the second, giving{−5π/12,π/4,7π/12,5π/4}. The left endpoint is a root and included; the right19π/12 is also a root but excluded. Verify exact inner angles in the original equation. Principal arcsin returns onlyπ/6, losing the other circle point and full turns. Target two is outside[−1,1], so both the real and restricted solution sets are empty.'
          : 'Let u=−3(x+π/9). All roots have u=±π/3+2kπ. Solving and reindexing integers gives x=−2π/9+2kπ/3 or2kπ/3. The interval admits k=0,1 on the first and k=−1,0 on the second, giving{−2π/3,−2π/9,0,4π/9}. The left endpoint is a root and included; the right2π/3 is a root but excluded. Check exact angles in the original equation. A principal arccos value alone loses the negative branch and full turns, and the inner equation must still be solved for x. Target two is outside[−1,1], so the complete set is empty.',
        '先找圆上所有终点并加整周，再反解x、逐支筛整数；端点也可能恰为根。',
        'Find every circle endpoint and add full turns, then solve for x and filter integers on each branch. Endpoints may themselves be roots.',
      ),
    ],
  };
};
export const circularRecurrenceRetrieval = {
  H32: makeSet('H32'),
  H36: makeSet('H36'),
};
