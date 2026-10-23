import { t } from '../model';
import { reasoning } from './builders';
const makeSet = (u: 'H22' | 'H23') => {
  const first = u === 'H22',
    qid = (i: number) => `${u}-MAINT-SIM-CIRCLE-TRIG-Q${i}`;
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
        '在纸图上标出已知、对应、角与单位；推论不能反过来当作原始已知，模型还要核允许范围。',
        'Mark givens, correspondence, angles and units on your drawing. Do not borrow a conclusion as an original premise, and check model domains.',
      ),
    ]);
  return {
    id: `${u}-MAINT-SIM-CIRCLE-TRIG`,
    unit: u,
    bridge: 'J94-L01',
    bridgeByQuestion: Object.fromEntries(
      [
        'J94-L01',
        'J94-L03',
        'J95-L01',
        'J95-L02',
        'J95-L03',
        'J95-L04',
        'J95-L05',
        'J96-L02',
        'J96-L04',
        'J96-L05',
      ].map((l, i) => [qid(i + 1), l]),
    ),
    title: t(
      '解析与向量之后，再核几何模型前提',
      'After analytic and vector work, recheck geometric premises',
    ),
    intro: t(
      '十题分次每次一题，先自己画图标条件，再算或写证明。长题可拆两次；H23之后仍先处理纸面平面图，不混投影长度和真实长度。情境均为虚构题设，全部人工核验，不计时。',
      'Choose one of ten tasks per sitting. Draw and label your own figure before calculating or proving; longer tasks can span two sittings. Even after H23, these begin with plane paper figures, without confusing projected and actual lengths. Contexts are fictional givens and all arguments are human-reviewed without a timer.',
    ),
    questions: [
      task(
        1,
        'similarity-correspondence',
        `非退化△ABC与△DFE满足∠A=∠D、∠C=∠E=90°；AB=${first ? 5 : 13}、BC=${first ? 3 : 5}、CA=${first ? 4 : 12} cm，DF=${first ? '15/2' : '26'} cm。由角依据证明相似，按顺序列全部边比并求FE、ED。倍率方向反过来怎样？若目标图反射旋转，能按屏幕位置换对应吗？k=1能相似吗？`,
        `Nondegenerate △ABC and △DFE have A=D and C=E=90°. Given AB=${first ? 5 : 13},BC=${first ? 3 : 5},CA=${first ? 4 : 12} cm and DF=${first ? '15/2' : '26'} cm, prove similarity from angle premises, list every corresponding ratio and find FE,ED. Reverse the scale direction. May reflection/rotation change correspondence by screen position? Is k=1 allowed?`,
        `两对已知角相等，AA得△ABC∼△DFE，A↔D、B↔F、C↔E，第三角由180°减两角也相等。目标/原图DF/AB=FE/BC=ED/CA=${first ? '3/2' : '2'}，得FE=${first ? '9/2' : '10'}、ED=${first ? 6 : 24} cm，倍率正且无单位。反向全部为${first ? '2/3' : '1/2'}，不能混一个正向一个反向。反射转动保角及对应点身份，标签随点而非屏幕位置；k1允许相似并在三角形对应下为全等。AA是角条件充分，任意SSA不能仅靠“三条”保证，需另外审具体证据。`,
        `Two given angle pairs yield AA similarity △ABC∼△DFE with A↔D,B↔F,C↔E; the third follows from 180° minus the other two. Target/original ratios DF/AB=FE/BC=ED/CA=${first ? '3/2' : 'two'} give FE=${first ? '9/2' : 'ten'},ED=${first ? 'six' : 'twenty-four'} cm. The scale is positive and unitless. Reversing direction gives ${first ? '2/3' : '1/2'} for ALL ratios, not a mixture. Reflection/rotation preserves angles and point identity rather than screen position. k=1 is allowed and yields congruence under correspondence. AA is sufficient; arbitrary SSA cannot be certified merely by counting three facts and needs its own evidence audit.`,
        '先按已知两对角确定相似顺序，再用一条已知对应边求目标/原图比。',
        'Establish ordered similarity from the two angle pairs before using a known corresponding side for target/original scale.',
      ),
      task(
        2,
        'similarity-side-proportion',
        `D在AB上、E在AC上且DE∥BC，AD=${first ? 3 : 4}、AB=${first ? 5 : 7}、BC=${first ? 10 : 14} cm。写角依据→相似次序→完整比例求DE；若ABC面积为S，推ADE面积倍率为何是平方，不能只背公式。另一个独立印图比例1:${first ? 25000 : 40000}，路线${first ? 4 : 3}cm，求km；屏幕${first ? '放大2倍' : '放大3/2倍'}且比例条同步时怎样读？横纵分别放大2和3的矩形面积乘6能保证相似吗？斜拍照片仅一处尺能保证全局尺度吗？`,
        `D lies on AB,E on AC and DE∥BC, with AD=${first ? 3 : 4},AB=${first ? 5 : 7},BC=${first ? 10 : 14} cm. Give angle reasons, ordered similarity and the full ratio for DE. If ABC has area S, derive ADE’s squared area scale. In a separate printed map at 1:${first ? 25000 : 40000}, a route is ${first ? 4 : 3} cm: convert to km. How should a screen zoom of ${first ? 'two' : '3/2'} with a matching scale bar be read? Does area scale six under horizontal/vertical factors two/three guarantee rectangle similarity? Does one ruler in an oblique photograph give a global scale?`,
        `A角共用，DE∥BC给ADE=ABC，AA得ADE∼ABC，AD/AB=AE/AC=DE/BC=${first ? '3/5' : '4/7'}，DE=${first ? 6 : 8}cm。对应底和高都乘k（作对应垂高，保角），面积(k底)(k高)/2=k²原面积，故ADE面积${first ? '9S/25' : '16S/49'}，不是只乘k。印图统一cm得${first ? '100000cm=1' : '120000cm=6/5'}km；屏幕路线${first ? 8 : '9/2'}cm仍同一实长，须用同步比例条，不能套原印图尺再算成${first ? '2' : '9/5'}km。矩形横2纵3给面积6倍但不自动保证相似或一个统一对应倍率；统一k的前提不可删。斜拍透视与单处标定不足以保证各处各向同一尺度。`,
        `The common A angle and ADE=ABC from parallel DE/BC give AA, ordered ADE∼ABC. Thus AD/AB=AE/AC=DE/BC=${first ? '3/5' : '4/7'} and DE=${first ? 'six' : 'eight'} cm. Corresponding base and perpendicular height both scale by k; (k base)(k height)/2 gives k² times area, hence ${first ? '9S/25' : '16S/49'}, not kS. Convert printed units to ${first ? '100000 cm=one' : '120000 cm=6/5'} km. The screen route becomes ${first ? 'eight' : '9/2'} cm but represents the same real distance: use the synchronous bar, not the original ruler scale yielding ${first ? 'two' : '9/5'} km. Horizontal/vertical rectangle factors two/three give area factor six without automatically guaranteeing similarity or one common corresponding scale. An oblique photo with one local ruler does not establish a uniform global scale.`,
        '比例先写同向对应量；面积同时追踪底和高，地图把印图与屏幕两种长度分开。',
        'Keep every ratio in the same correspondence direction. Track both base and height for area, and separate printed from screen lengths.',
      ),
      task(
        3,
        'circle-chord-contact',
        `圆半径r=${first ? 5 : 13}cm，弦AB=${first ? 6 : 10}cm。M为圆心O到AB的垂足，先用直角三角形全等证明AM=MB，再求OM。若弦为直径、OM=0，能仍画两非退化直角三角形吗？另用任意直线到圆心的最短距离d，解释d>r、d=r、d<r对应无/一/两交点，不能只看屏幕。`,
        `A circle has radius r=${first ? 5 : 13} cm and chord AB=${first ? 6 : 10} cm. Let M be the perpendicular foot from centre O. Prove AM=MB by right-triangle congruence before finding OM. If the chord is a diameter with OM=0, are there still two nondegenerate right triangles? For an arbitrary line with shortest centre distance d, explain zero/one/two intersections for d>r,d=r,d<r without relying on a display.`,
        `非直径时OMA、OMB直角，OA=OB=r是斜边、OM公共直角边，HL全等给AM=MB=${first ? 3 : 5}cm，OM²=${first ? '25−9=16' : '169−25=144'}，取正${first ? 4 : 12}cm。直径情形O=M且O为两半径端点中点，直接给半弦r；OM0时三点退化，不能套非退化HL图。一般直线上X有OX²=d²+MX²，最小距离d：d>r无长度能达r；d=r仅X=M一接触；d<r给沿线有向坐标s=±√(r²−d²)两个位置，距离MX=|s|取非负。d0为直径另述，有限视窗不改交点数。`,
        `For a nondiameter chord, OMA/OMB are right triangles with equal radius hypotenuses OA=OB and common leg OM. HL gives AM=MB=${first ? 'three' : 'five'} cm. OM²=${first ? '25−9=16' : '169−25=144'}, hence positive OM=${first ? 'four' : 'twelve'} cm. For a diameter, O=M is already the midpoint of radius endpoints, so the half-chord is r; OM=0 makes those triangles degenerate. Generally a line point X satisfies OX²=d²+MX². If d>r no point reaches radius r; if d=r only X=M does; if d<r two signed positions ±√(r²−d²) occur, while distance is nonnegative. Handle d=0 as a diameter. A finite view does not alter intersection counts.`,
        '全等需要哪条斜边、哪条公共直角边？零垂距单独处理，再用距离平方看整条线。',
        'Identify the hypotenuses and common leg. Separate zero perpendicular distance, then use squared distance along the whole line.',
      ),
      task(
        4,
        'circle-intercepted-arc',
        `圆上不同点A、B的小弧为${first ? 100 : 140}°；P、R在大弧内部且不同，Q在小弧内部，均非端点。画弦AB并标各顶点不含自己的被截弧，求APB、ARB、AQB。为什么同弦同侧相等、异侧互补？把图旋转或改P位置会改变角吗？若顶点不在圆上能照套吗？`,
        `Distinct circle points A,B bound a minor arc of ${first ? 100 : 140}°. Distinct P,R lie inside the major arc and Q inside the minor arc, none at endpoints. Draw chord AB, label the intercepted arc excluding each vertex and find APB,ARB,AQB. Explain same-side equality and opposite-side supplementary angles. Does rotating the diagram or moving P within its arc change them? May an off-circle vertex use the same rule?`,
        `大弧为${first ? 260 : 220}°。P/R都截不含自己的小弧${first ? 100 : 140}，圆周角为其一半，APB=ARB=${first ? 50 : 70}°；Q截大弧，AQB=${first ? 130 : 110}°。同弦同侧顶点截同一不含顶点的弧，所以等角；异侧两弧合360，半角合180。只旋转不改点名、侧别或弧身份；在同一弧内移P仍同角，跨到另一侧就需换被截弧。顶点须在圆上且不与A/B重合；中心角截弧同度但不是再按圆周角一半，任意外点不直接套。`,
        `The major arc is ${first ? 260 : 220}°. P/R intercept the same minor arc excluding themselves, so APB=ARB=${first ? 50 : 70}°. Q intercepts the major arc, giving AQB=${first ? 130 : 110}°. Same-side vertices intercept the same arc; opposite-side arcs total 360°, so their half-angle sum is 180°. Rotation changes neither labels nor arc/side identity; moving within one arc preserves the angle, while crossing the chord changes the intercepted arc. Vertices must be on the circle and distinct from endpoints. A central angle equals its arc measure rather than half, and an arbitrary external vertex cannot use this rule.`,
        '先为每个顶点圈出“不含这个顶点”的A到B弧，再除2。',
        'For each vertex, circle the A-to-B arc that excludes it before halving.',
      ),
      task(
        5,
        'circle-tangent-premises',
        `同一圆心O半径${first ? 6 : 8}cm，外点P满足OP=${first ? 10 : 17}cm，PT/PS是已知同圆切线且T/S为不同切点。写自由证明PT=PS并求长度，列每个直角、相等半径与公共斜边来源。若只看图像“像切线”、换成不同圆/外点或P在圆上，还能直接套吗？比较的是无限直线还是线段？`,
        `A circle centred at O has radius ${first ? 6 : 8} cm and an external point P with OP=${first ? 10 : 17} cm. PT,PS are GIVEN tangents to this same circle at distinct T,S. Prove equal tangent segments and find their lengths, citing right angles, equal radii and common hypotenuse. Can appearance, different circles/external points or P on the circle justify the same conclusion? Are infinite lines or segments being compared?`,
        `已知相切给OT⊥PT、OS⊥PS；OTP/OSP为非退化直角三角形，OP公共斜边、OT=OS为同圆半径。HL得OTP≅OSP，故PT=PS；PT²=OP²−OT²=${first ? '100−36=64' : '289−64=225'}，取正${first ? 8 : 15}cm，核原平方关系。结论比较从同外点到切点的线段，不给无限直线“长度”。若未给相切、不同圆或不同外点，原条件缺失；P在圆上仅一条切线而不是两条不同切线段，不能照搬此非退化HL证。P在圆内也无此两切线。`,
        `Given tangency yields OT⊥PT and OS⊥PS. The nondegenerate right triangles OTP/OSP have common hypotenuse OP and equal same-circle radii OT=OS. HL congruence gives PT=PS. Their square is ${first ? '100−36=64' : '289−64=225'}, hence positive length ${first ? 'eight' : 'fifteen'} cm, checked in the original square relation. These are segments from one external point, not lengths of infinite lines. Missing tangency, different circles or different external points remove premises. A point on the circle has one tangent, not two distinct tangent segments for this nondegenerate proof; an inside point has no such pair.`,
        '相切先给半径与切线垂直，OP才是两个直角三角形的共同斜边。',
        'Tangency gives radius-perpendicular-to-tangent first; OP is then the common hypotenuse.',
      ),
      task(
        6,
        'circle-sector-fraction',
        `半径${first ? 6 : 10}cm、圆心角${first ? 150 : 72}°的扇形，亲画半径、弧与弦，按整圆份额推弧长、扇形面积和完整周长，保π精确式与单位。弓形是否同扇形？若角改360°，还能周长加两半径吗？为什么公式l+2r要先写0<θ<360？`,
        `For a sector of radius ${first ? 6 : 10} cm and central angle ${first ? 150 : 72}°, draw radii, arc and chord. Derive arc length, sector area and full perimeter by fractions of a whole circle, retaining exact π and units. Is a circular segment the sector? If the angle is 360°, should two radii still be added to perimeter? Why state 0<θ<360 before using l+2r?`,
        `份额θ/360=${first ? '5/12' : '1/5'}；弧长乘整圆周长2πr得${first ? '5π' : '4π'}cm，面积乘πr²得${first ? '15π' : '20π'}cm²。0<θ<360时边界一弧加两条不同半径，周长${first ? '5π+12' : '4π+20'}cm。弦是AB直线段，弧是曲线；弓形由弦与弧围，扇形由两半径与弧围，面积不自动同。θ360为整圆，外周仅${first ? '12π' : '20π'}cm，两半径为内部接缝不加；θ0也退化，不能把一般边界公式不加条件照套。`,
        `The fraction θ/360=${first ? '5/12' : '1/5'} multiplies circumference 2πr for arc length ${first ? '5π' : '4π'} cm and area πr² for sector area ${first ? '15π' : '20π'} cm². For 0<θ<360 the boundary has one arc and two distinct radii, giving ${first ? '5π+12' : '4π+20'} cm. A chord is a straight segment; an arc is curved. A circular segment is bounded by chord/arc, unlike the radius/radius/arc sector. At 360° the full-circle outer perimeter is only ${first ? '12π' : '20π'} cm; radii are internal seams. Zero angle also degenerates, so the ordinary boundary formula needs its stated range.`,
        '份额同一个，但周长、面积乘的整圆量和单位不同；先描外边界再加长度。',
        'Use the same fraction with different whole-circle quantities and units. Trace the actual outer boundary before adding lengths.',
      ),
      task(
        7,
        'circle-proof-dependency',
        `BC为圆直径，A在圆上且非B/C，AB=${first ? 6 : 5}、AC=${first ? 8 : 12}cm。作AD⊥BC，D在BC上。写完整自由证明求BC、BD、DC、AD，逐个给直角来源、AA对应、比例、正长度和单位。若卡片说“任取E也与A/B/C共圆”，可为得到想要结论加入吗？卡片顺序合法与完成证明有什么区别？`,
        `BC is a circle diameter and A is on the circle, distinct from B,C. Given AB=${first ? 6 : 5},AC=${first ? 8 : 12} cm, construct AD⊥BC with D on BC. Write a full free proof for BC,BD,DC,AD, citing right angles, AA correspondence, proportions, positive lengths and units. May a card add “an arbitrary E is concyclic with A/B/C” merely to obtain a desired conclusion? How does legal card order differ from a complete proof?`,
        `直径所对圆周角BAC=90°，勾股得BC=${first ? 10 : 13}cm，非只读像素。AD由构造垂直，ADB=90°=BAC；D在BC给ABD=CBA，AA得△ABD∼△CBA，对应A↔C、B↔B、D↔A。AB/CB=BD/BA=AD/CA，所以BD=AB²/BC=${first ? '18/5' : '25/13'}cm，AD=AB·AC/BC=${first ? '24/5' : '60/13'}cm；DC=BC−BD=${first ? '32/5' : '144/13'}cm。各量正，BD+DC回BC，AD²=BD·DC亦核。任意E无共圆依据，不得加前提；合法卡依赖只查先后，不自动提供这些点角身份、比例及数值核验，自己的自由书写仍人审。`,
        `The angle BAC subtended by a diameter is 90°, so Pythagoras gives BC=${first ? 'ten' : 'thirteen'} cm. Construction gives ADB=90°=BAC; D on BC gives ABD=CBA. Thus △ABD∼△CBA by AA, with A↔C,B↔B,D↔A. Ratios AB/CB=BD/BA=AD/CA yield BD=AB²/BC=${first ? '18/5' : '25/13'} cm and AD=AB·AC/BC=${first ? '24/5' : '60/13'} cm. Subtract for DC=${first ? '32/5' : '144/13'} cm. All are positive, BD+DC=BC and AD²=BD·DC check back. An arbitrary E has no given concyclicity and cannot be added to force a goal. Card dependencies check order only; point/angle identity, proportions and numerical verification still require a human-reviewed free proof.`,
        '先从直径取得原大三角形直角，再从辅助构造取得小三角形直角，写AA顺序后才列比。',
        'Get the large right angle from the diameter and the small one from construction. State ordered AA similarity before ratios.',
      ),
      task(
        8,
        'trig-cosine-tangent-sides',
        `△ABC在C为直角，AB=${first ? 13 : 17}、BC=${first ? 5 : 8}、AC=${first ? 12 : 15}cm。先以A为参照标O/A/H并求sin/cos/tan，再换B，说明哪些边换身份、斜边为何不换。另一个直角三角形有相同锐角，用AA和正倍率k证明比值不变而非只试一例。若同角对边改${first ? 6 : 10}cm，由原sin式反求斜边，能一律“乘sin”吗？没有直角前提时可照套吗？`,
        `△ABC is right at C with AB=${first ? 13 : 17},BC=${first ? 5 : 8},AC=${first ? 12 : 15} cm. Label opposite/adjacent-leg/hypotenuse for reference A and find sin/cos/tan, then switch to B and explain changing side roles. Use AA and positive scale k to prove the ratios unchanged in another right triangle with the same acute angle. If its opposite side becomes ${first ? 6 : 10} cm, solve the original sine relation for the hypotenuse. Is multiplying by sine always correct? May these right-triangle formulas be used without a right-angle premise?`,
        `A参照时O=BC、邻直角边=AC、H=AB，sinA=${first ? '5/13' : '8/17'}、cosA=${first ? '12/13' : '15/17'}、tanA=${first ? '5/12' : '8/15'}；换B为${first ? '12/13、5/13、12/5' : '15/17、8/17、15/8'}，O与邻腿互换、H仍对直角C，不能把邻到顶点的斜边叫邻直角边。两直角及同锐角给AA，所有对应边乘同正k，kO/kH=O/H、kA/kH=A/H、kO/kA=O/A，故商只由所参照角决定。新对边/H=${first ? '5/13' : '8/17'}，H=${first ? '6÷(5/13)=78/5' : '10÷(8/17)=85/4'}cm，不是对边乘sin；解未知在分母先按原关系反求。所有长度须同单位、分母正，缺直角不能直接借本课OAH公式。`,
        `For A, opposite=BC,adjacent LEG=AC,hypotenuse=AB, so sinA=${first ? '5/13' : '8/17'},cosA=${first ? '12/13' : '15/17'},tanA=${first ? '5/12' : '8/15'}. For B these become ${first ? '12/13,5/13,12/5' : '15/17,8/17,15/8'}: opposite/adjacent legs swap while AB remains opposite right angle C. Do not call the touching hypotenuse the adjacent leg. Two right angles and one equal acute angle give AA; positive k scales all corresponding sides, cancelling in kO/kH,kA/kH,kO/kA. Thus the reference angle determines the ratios. For the new triangle, opposite/H=${first ? '5/13' : '8/17'} gives H=${first ? '6÷(5/13)=78/5' : '10÷(8/17)=85/4'} cm, not opposite times sine. Solve the original relation when the unknown is in a denominator. Use common units and positive denominators; absent a right-angle premise, these OAH formulas cannot simply be applied.`,
        '先固定参照角和直角，H永远对直角；把待求边保留在原比例式里再解。',
        'Fix the reference and right angles first. The hypotenuse always opposes the right angle. Solve for the unknown in the original ratio.',
      ),
      task(
        9,
        'trig-inverse-degree-precision',
        `本题限锐角0°<θ<90°。用固定斜边的投影说明sin/cos/tan随角变化；tan能大于1吗，90°能用大数代替吗？再给直角三角形对边${first ? '9cm' : '50cm'}、邻直角边${first ? '120mm' : '1.2m'}，统一单位选比求θ到0.1°，写DEG、反函数非倒数和最后才舍入。sinθ=1.2、cosθ=0在本题是否允许？H04的一般角定义能否删掉本题锐角条件？`,
        `Restrict this task to acute 0°<θ<90°. Use projections with fixed hypotenuse to explain how sin/cos/tan vary. Can tangent exceed one, and can a large number replace tan90°? Given opposite ${first ? 'nine cm' : 'fifty cm'} and adjacent leg ${first ? '120 mm' : '1.2 m'}, unify units, choose a ratio and find θ to 0.1°. State DEG mode, inverse function versus reciprocal and rounding only at the end. Are sinθ=1.2 and cosθ=0 admissible here? May H04 general-angle definitions erase this task’s acute restriction?`,
        `固定正H，角增时对边投影O增、邻边A减，所以sin增、cos减；均严格在0和1间。对0<θ1<θ2<90有O2>O1>0、0<A2<A1，则O2/A2>O1/A2>O1/A1，tan增且可>1，如tan60°=√3。90°邻边0，tan未定义而非有限大数；图窗不能钳平台。单位化为${first ? '9cm与12cm' : '0.5m与1.2m'}，tanθ=${first ? '3/4' : '5/12'}，θ=arctan(${first ? '3/4' : '5/12'})≈${first ? '36.86989765' : '22.61986495'}°，最后舍为${first ? '36.9' : '22.6'}°。DEG输出角度，反函数求角不是倒数${first ? '4/3' : '12/5'}。sinθ=1.2超界，cosθ=0对应90°不在严格锐角域；应查数据/模型不硬按。H04可另讨论一般角，但不改变本题直角三角形允许条件，像素曲线和有限表不替一般投影理由。`,
        `With fixed positive H, increasing acute angle increases opposite projection O and decreases adjacent A, so sine increases and cosine decreases, both strictly between zero and one. For θ1<θ2, O2>O1>0 and 0<A2<A1 imply O2/A2>O1/A2>O1/A1, proving tangent increases. It can exceed one, as tan60°=√3. At 90° the adjacent denominator is zero: undefined, not a large finite value or a clipped plateau. Convert to ${first ? 'nine cm and twelve cm' : '0.5 m and 1.2 m'}, giving tanθ=${first ? '3/4' : '5/12'} and θ=arctan(${first ? '3/4' : '5/12'})≈${first ? '36.86989765' : '22.61986495'}°, finally ${first ? '36.9' : '22.6'}°. DEG expresses degrees; inverse tangent finds an angle, unlike reciprocal ${first ? '4/3' : '12/5'}. A sine ratio of 1.2 exceeds one; cosθ=0 corresponds to excluded 90°, so audit data/model. H04 general-angle definitions do not change this task’s acute right-triangle premises, and finite curves/tables do not replace the projection argument.`,
        '已知对边和邻直角边先选tan，先统一单位，再让反函数输出角；中间不要截断比值。',
        'Known opposite and adjacent legs suggest tangent. Unify units, then invert to an angle without truncating the intermediate ratio.',
      ),
      task(
        10,
        'trig-height-gradient-premises',
        `虚构坡道竖升h=${first ? 3 : 5}m、水平r=${first ? 4 : 12}m、宽w=2m，面积单价${first ? 12 : 10} NZD/m²，限h≤${first ? 4 : 6}m、r≤${first ? 6 : 15}m。求坡度%、坡角到0.1°、坡面斜长、面积与费。只改宽到${first ? 3 : 4}m与所有长度同乘${first ? 2 : '3/2'}分别怎样，约束会保留吗？另独立测高：仪器高${first ? '1.2' : '1.5'}m、到竖直目标脚的水平距${first ? 4 : 12}m，题设精确tanθ=${first ? '3/4' : '5/12'}且两脚同水平，求目标高；若给的是斜视线长、基面不同高或r=0还能照用吗？`,
        `A fictional ramp rises h=${first ? 3 : 5} m over horizontal run r=${first ? 4 : 12} m, width w=two m, with given rate ${first ? 12 : 10} NZD/m² and limits h≤${first ? 4 : 6} m,r≤${first ? 6 : 15} m. Find gradient %,angle to 0.1°,slope length,surface area and cost. Compare changing ONLY width to ${first ? 'three' : 'four'} m with scaling ALL lengths by ${first ? 'two' : '3/2'}; are constraints preserved? In a SEPARATE height task, instrument height is ${first ? '1.2' : '1.5'} m, horizontal distance to the vertical target’s foot is ${first ? 'four' : 'twelve'} m, exact tanθ=${first ? '3/4' : '5/12'} and both feet share a level base. Find target height. What if distance is slanted, bases differ or r=0?`,
        first
          ? '坡度=h/r×100%=75%，角≈36.9°，斜长√(9+16)=5m，面积sw=10m²、费用120NZD，三者75%、36.9°与5m不能互换。只宽3m，侧面h/r/s不变，面积15m²费180；全部长乘2，h6、r8、s10、w4，坡度仍75%，面积40m²费480（四倍），但高6>4、水平8>6违反原约束。独立测高给rise=4×3/4=3m，加仪器高得4.2m，前提目标竖直、水平距、同基面；斜视线不能当r、基面差还需另计。r0梯度分母0未定义，不能给有限百分数，200%也可能合法如h2/r1，百分数并非角度。'
          : '坡度=5/12×100%=125/3%即约41.7%，角≈22.6°，斜长13m，面积26m²、费用260NZD。只宽4m，h/r/s不变，面积52m²费520；全长乘3/2，h15/2、r18、s39/2、w3，坡度仍125/3%，面积117/2m²费585（9/4倍），但高15/2>6、水平18>15，约束失效。另测高rise=12×5/12=5m，加仪器1.5得6.5m；此为独立目标非坡道高度，依赖竖直目标、同水平基面和真正水平距。若距离为视线斜长或脚点有高差须改关系，不能硬加；r0无有限梯度，h2/r1可200%，不能以超过100%当无效或把百分数当坡角。',
        first
          ? 'Gradient is h/r×100%=75%,angle ≈36.9°,slope length √(9+16)=five m,surface sw=ten m² and cost 120 NZD. Percentage,angle and length are different quantities. Width alone at three m preserves h/r/s but gives fifteen m² and 180 NZD. Scaling every length by two gives h6,r8,s10,w4,unchanged 75% gradient and forty m²/480 NZD, fourfold area/cost; height six exceeds four and run eight exceeds six, violating constraints. The separate target has rise four×3/4=three m plus instrument 1.2 for 4.2 m, requiring a vertical target,horizontal run and common level base. Slanted sight distance is not r and base-level differences need adjustment. At r=0 gradient is undefined, not a finite percent. A rise two/run one can legitimately give 200%; percent is not angle.'
          : 'Gradient is (5/12)×100%=125/3%,approximately 41.7%; angle ≈22.6°,slope thirteen m,surface twenty-six m²,cost 260 NZD. Width alone at four m preserves h/r/s while giving fifty-two m²/520 NZD. Scaling every length by 3/2 gives h15/2,r18,s39/2,w3,unchanged gradient and surface 117/2 m²/cost 585 NZD,a 9/4 factor. Height 15/2 exceeds six and run eighteen exceeds fifteen,so limits fail. Separately, target rise twelve×5/12=five m plus instrument 1.5 gives 6.5 m; this is another target,not the ramp height,and requires verticality,common level base and horizontal distance. Slanted distance or unequal base levels require another relation. At r=0 no finite gradient exists; rise two/run one can give 200%,so percentages exceeding one hundred are not automatically invalid or angles.',
        '先分清竖升、水平距、斜长、宽，单位各归其量；只改宽和统一改长要分开算，再逐条核限制。',
        'Separate rise,horizontal run,slope length and width with their units. Calculate width-only and uniform scaling separately,then audit every limit.',
      ),
    ],
  };
};
export const similarityCircleTrigRetrieval = {
  H22: makeSet('H22'),
  H23: makeSet('H23'),
};
