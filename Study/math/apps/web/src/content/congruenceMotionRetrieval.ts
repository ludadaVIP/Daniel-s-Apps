import { t } from '../model';
import { reasoning } from './builders';

const bridges = (u: string) =>
  Object.fromEntries(
    [
      'J86-L01',
      'J86-L02',
      'J86-L04',
      'J86-L05',
      'J86-L06',
      'J87-L01',
      'J87-L02',
      'J87-L03',
      'J87-L04',
      'J87-L05',
    ].map((l, i) => [`${u}-MAINT-CONG-MOTION-Q${i + 1}`, l]),
  );
const makeSet = (u: 'H05' | 'H06') => {
  const first = u === 'H05';
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
    reasoning(`${u}-MAINT-CONG-MOTION-Q${i}`, t(z, en), skill, t(rz, re), [
      t(hz, he),
      t(
        '在自己的图上标清已知、构造、对应和理由；不能把待证结论先作依据。',
        'Mark givens, constructions, correspondence and reasons on your own drawing. Do not use the target conclusion as a premise.',
      ),
    ]);
  const a = first ? 6 : 10,
    b = first ? 4 : 6,
    h = a / 2,
    radical = first ? 7 : 11;
  const apex = first ? 40 : 70,
    base = (180 - apex) / 2;
  return {
    id: `${u}-MAINT-CONG-MOTION`,
    unit: u,
    bridge: 'J86-L01',
    bridgeByQuestion: bridges(u),
    title: t(
      first
        ? '向量之后，回到全等与运动的依据'
        : '空间图形之后，重建平面几何依据',
      first
        ? 'After vectors, revisit congruence and motion reasons'
        : 'After solids, rebuild plane-geometry reasons',
    ),
    intro: t(
      '十题分次每次选一两题，均在纸上作平面图、标注、重排或证明。H06中的卡片仍是平面图形，不把折叠后的空间距离当原平面距离。家长人工核验，不计时。',
      'Choose one or two of ten tasks per sitting, drawing, labelling, rearranging or proving in a plane on paper. Cards used after H06 are still plane figures; do not replace their plane distances with folded-space distances. A parent reviews every argument without a timer.',
    ),
    questions: [
      task(
        1,
        'ordered-congruence-correspondence',
        `已知△ABC≅△DFE，AB=${first ? 3 : 5}、BC=${first ? 4 : 12}、CA=${first ? 5 : 13} cm。把目标图反射再旋转，仍保留点名：列全部对应顶点、边与角，求DF、FE、ED。说明反射是否破坏全等、倍率${first ? '3/2' : '2'}放大是否仍全等；能按图上左右位置重命名吗？`,
        `Given △ABC≅△DFE with AB=${first ? 3 : 5},BC=${first ? 4 : 12},CA=${first ? 5 : 13} cm, reflect and rotate the target figure while retaining names. List all corresponding vertices, sides and angles and find DF,FE,ED. Does reflection break congruence? Does scaling by ${first ? '3/2' : 'two'} preserve it? May labels be reassigned by left/right screen position?`,
        `按顺序A↔D、B↔F、C↔E；AB↔DF、BC↔FE、CA↔ED，三对角为∠A↔∠D、∠B↔∠F、∠C↔∠E，故DF=${first ? 3 : 5}、FE=${first ? 4 : 12}、ED=${first ? 5 : 13} cm。反射反转朝向、旋转保持朝向，都保对应长度与角，所以保全等；非一倍放大改长度只保相似。本题长度可实际核倍率，标签随点移动，不按屏幕位置猜。单独一边相等不够全等。`,
        `Order gives A↔D,B↔F,C↔E; sides AB↔DF,BC↔FE,CA↔ED and angles A↔D,B↔F,C↔E. Thus DF=${first ? 3 : 5},FE=${first ? 4 : 12},ED=${first ? 5 : 13} cm. Reflection reverses orientation and rotation preserves it, but both preserve corresponding lengths and angles and hence congruence. Nonunit scaling changes lengths and preserves similarity only. Check the stated lengths; names travel with points rather than screen position. One equal side alone is insufficient.`,
        '先按书写顺序配三个顶点，再从两个端点导出边对应。',
        'Pair vertices by written order before deriving sides from endpoints.',
      ),
      task(
        2,
        'sss-sas-sufficient-conditions',
        `为两非退化三角形写SSS、SAS、ASA、AAS各一份充分证据清单，标对应而非只数三条。AB与BC的夹角在哪？两对应角为何给第三角，AAA为何不定大小？再画A=(0,0)、B=(${h}√3,${h})、C=(s,0)、s>0，AB=${a}、BC=${b}、∠A=30°，由距离式找两个s，审查SSA是否一般充分。`,
        `For two nondegenerate triangles, write sufficient evidence lists for SSS,SAS,ASA,AAS with correspondence, not just three facts. Locate the included angle of AB and BC. Why do two angles determine the third while AAA does not fix size? Draw A=(0,0),B=(${h}√3,${h}),C=(s,0),s>0, with AB=${a},BC=${b},∠A=30°. Use distance to find two s values and audit whether SSA is generally sufficient.`,
        `SSS需三组对应边；SAS需两对应边及其夹角，AB/BC交于B，故夹角B而非A。ASA的一边夹在两已知角间，AAS为非夹边；两角定第三角180°减前两角，补角后可互换有效证据。AAA放大保角却改长，不定全等。反例BC²=(s−${h}√3)²+${h * h}=${b * b}，所以s=${h}√3±√${radical}，两值正、不同且B不在AC直线上，均有AB${a}、BC${b}、A30°而AC不同。因此任意SSA不保证全等，不能说所有特殊SSA都绝不成立；直角等附加前提须另审。`,
        `SSS requires three corresponding side pairs; SAS requires two pairs and their included angle, which is B for AB/BC, not A. ASA places the side between the stated angles; AAS uses a nonincluded side. Two angles determine the third by subtraction from 180°, permitting another valid angle-side list. AAA survives enlargement, so it does not fix congruence. Here BC²=(s−${h}√3)²+${h * h}=${b * b}, giving s=${h}√3±√${radical}. Both are positive and different; B is off line AC, so both triangles are nondegenerate with AB=${a},BC=${b},A=30° but different AC. General SSA is therefore insufficient; this does not deny special cases with extra premises such as a right angle.`,
        '充分条件必须匹配同一组顶点；SSA例中固定B到横轴的高度再求水平距离。',
        'Use one consistent vertex correspondence. In the SSA example, fix B’s height above the axis before finding horizontal distances.',
      ),
      task(
        3,
        'isosceles-properties-and-converse',
        `△ABC中AB=AC，∠A=${apex}°，AD为顶角平分线且D在BC上。写已知→判据→对应结论证明B=C及BD=DC，并求底角。反向只已知B=C时，如何用同样构造证明AB=AC？指出一种循环论证。`,
        `In △ABC, AB=AC and A=${apex}°. AD bisects the apex with D on BC. Give a givens→criterion→corresponding-conclusion proof that B=C and BD=DC, and find the base angles. Conversely, starting only with B=C, prove AB=AC using the same construction. Identify a circular argument.`,
        `正向AB=AC已知、BAD=CAD由构造、AD=AD公共，按SAS得ABD≅ACD，再取B=C与BD=DC；底角各(180−${apex})/2=${base}°。反向已知B=C，加构造半角及公共AD，用AAS（AD非两所列角夹边）得同样全等，再取AB=AC，不能先用待证等腰性质说半底边相等。把BD=DC或AB=AC先假设来证明自身是循环；直角或对称不能只靠图看出。`,
        `Forward: AB=AC is given, BAD=CAD is constructed and AD=AD is common, so SAS yields ABD≅ACD. Corresponding parts give B=C and BD=DC; each base angle is (180−${apex})/2=${base}°. Conversely use given B=C, constructed half-apex angles and common AD for AAS, since AD is not between the two listed angles. Congruence then gives AB=AC. Do not assume equal half-bases or equal legs in advance to prove themselves; neither perpendicularity nor symmetry is justified by appearance alone.`,
        '正向可用两边夹角，反向则用两角和公共边，已知清单不同。',
        'The forward direction uses sides and included angle; the converse uses two angles and the common side. Their premise lists differ.',
      ),
      task(
        4,
        'parallelogram-properties-and-tests',
        `对简单非退化四边形，区分平行四边形定义、性质与逆向判定。分别核“两组对边相等”“同一组对边平行且相等”“两对角线在内部交点互相平分”。只给AB∥CD且AD=BC够吗？用A=(${first ? -3 : -4},0)、B=(${first ? 3 : 4},0)、C=(2,${first ? 2 : 3})、D=(−2,${first ? 2 : 3})计算反例。`,
        `For a simple nondegenerate quadrilateral, separate the parallelogram definition, properties and converse tests. Audit both opposite-side pairs equal, one SAME opposite pair parallel and equal, and diagonals bisecting EACH OTHER at an interior intersection. Is AB∥CD with AD=BC enough? Calculate using A=(${first ? -3 : -4},0),B=(${first ? 3 : 4},0),C=(2,${first ? 2 : 3}),D=(−2,${first ? 2 : 3}).`,
        `定义两组对边分别平行；推出对边相等、对角相等、邻角互补及对角线互相平分。列出的三个完整逆向条件各可判定，不能只取其中一半；平行且相等须同一组边。坐标例AB=${first ? 6 : 8}、CD=4，AD²=BC²=${first ? 5 : 13}，AB∥CD却另一组边不平行，是等腰梯形而非平行四边形。性质证明应由定义及平行角/全等导出，不把性质预设作已知。`,
        `The definition requires both opposite pairs parallel. Properties include opposite sides/angles equal, adjacent angles supplementary and diagonals mutually bisecting. Each complete converse test stated is sufficient; taking half a condition is not. The parallel-and-equal test must use the same pair. The coordinates give AB=${first ? 6 : 8},CD=4 and AD²=BC²=${first ? 5 : 13}. The bases are parallel but the legs are not, so this is an isosceles trapezium, not a parallelogram. Prove properties from the definition using parallel angles and congruence rather than assuming them.`,
        '把每个判定的两部分圈出，再核反例的一组平行与另一组相等是否混在一起。',
        'Circle both parts of each test and check whether the counterexample mixes one parallel pair with another equal pair.',
      ),
      task(
        5,
        'short-proof-dependency-chain',
        '仅给简单非退化四边形ABCD的AB∥CD、BC∥AD，画AC。写一份自由证明AB=CD，逐行列已知、角依据、公共边、全等顺序及对应结论。再解释为何“AB=CD所以SSS全等所以AB=CD”不能证明目标；合法卡片顺序是否等于已会写证明？',
        'Given only AB∥CD and BC∥AD in a simple nondegenerate quadrilateral ABCD, draw AC and write a free proof of AB=CD. Label givens, angle reasons, common side, ordered congruence and conclusion. Why does “AB=CD, hence SSS congruence, hence AB=CD” fail? Does valid card order itself prove an ability to write the argument?',
        'AC为辅助线；AB∥CD给BAC=DCA，BC∥AD给BCA=DAC，均由截线AC内错角。AC=CA公共，夹在所列两角间；ASA得△ABC≅△CDA，A↔C、B↔D、C↔A，再取AB=CD。没有先用待证边，也未从外观认角。所给SSS句先借目标且还缺其他边证据，循环而不完整。要在自己的图上自由生成理由链，排序工具只能核依赖的一部分，不能替代人工检查。',
        'Construct AC. Parallel AB/CD gives BAC=DCA; parallel BC/AD gives BCA=DAC, both by alternate interior angles with transversal AC. AC=CA is the common included side. ASA gives △ABC≅△CDA with A↔C,B↔D,C↔A, hence AB=CD by corresponding parts. No target side or visual angle guess was used. The proposed SSS sentence borrows the target and lacks other side evidence: it is circular and incomplete. Generate the proof on your own drawing; card ordering checks only part of dependency and cannot replace human review.',
        '两组平行分别给哪一对角？AC在各三角形中的端点对应怎样交换？',
        'Which angle pair comes from each parallel pair, and how do AC endpoints swap under correspondence?',
      ),
      task(
        6,
        'translation-reflection-reference',
        first
          ? '在同一平面坐标系取P=(4,−1)、Q=(2,3)、R=(1,0)。先把三角形同平移(−3,2)，再另从原图反射到轴x=1。分别写三点新坐标、PQ差向量与长度，说明两种运动的朝向和角度。轴上点怎样？为何不能直接用x→−x？'
          : '在同一平面坐标系取P=(3,1)、Q=(−1,−1)、R=(0,−2)。先把三角形同平移(2,−3)，再另从原图反射到轴y=−2。分别写三点新坐标、PQ差向量与长度，说明两种运动的朝向和角度。轴上点怎样？为何不能直接用y→−y？',
        first
          ? 'In one plane coordinate system take P=(4,−1),Q=(2,3),R=(1,0). Translate the triangle by (−3,2); separately reflect the ORIGINAL in x=1. Give each set of coordinates, the PQ displacement and its length. Explain orientation and angles for both motions, fixed axis points and why x→−x is wrong.'
          : 'In one plane coordinate system take P=(3,1),Q=(−1,−1),R=(0,−2). Translate by (2,−3); separately reflect the ORIGINAL in y=−2. Give each set of coordinates, the PQ displacement and its length. Explain orientation and angles for both motions, fixed axis points and why y→−y is wrong.',
        first
          ? '平移得P(1,1)、Q(−1,5)、R(−2,2)，差仍Q−P=(−2,4)，长√20。反射x′=2−x、y′=y，得P(−2,−1)、Q(0,3)、R(1,0)，差(2,4)，长仍√20；点与像中点在x1、垂直距相等，R在轴上不动。原PQ/PR有向叉积10，平移仍10、反射−10，故前者保朝向后者反转；两者都保长度和角，角不会反成补角。任意轴不能套原点轴−x。'
          : '平移得P(5,−2)、Q(1,−4)、R(2,−5)，差仍(−4,−2)，长√20。反射x′=x、y′=−4−y，得P(3,−5)、Q(−1,−3)、R(0,−2)，差(−4,2)，长仍√20；点与像中点在y−2、垂直距相等，R固定。原PQ/PR有向叉积6，平移仍6、反射−6；平移保朝向、反射反朝向，都保长度和角而非角变补角。关于y−2反射不是关于原点横轴的−y。',
        first
          ? 'Translation gives P(1,1),Q(−1,5),R(−2,2), retaining displacement (−2,4) and length √20. Reflection uses x′=2−x,y′=y, giving P(−2,−1),Q(0,3),R(1,0), displacement (2,4) and the same length. Each point-image midpoint lies on x=1 with equal perpendicular distances; R is fixed. The oriented PQ/PR determinant is ten originally and after translation but negative ten after reflection. Thus translation preserves orientation while reflection reverses it; both preserve lengths and angles, not supplementary angles. The origin-axis rule −x is wrong for this axis.'
          : 'Translation gives P(5,−2),Q(1,−4),R(2,−5), retaining displacement (−4,−2) and length √20. Reflection uses x′=x,y′=−4−y, giving P(3,−5),Q(−1,−3),R(0,−2), displacement (−4,2) and the same length. Point-image midpoints lie on y=−2 with equal perpendicular distances; R is fixed. The PQ/PR determinant is six originally and after translation but negative six after reflection. Translation preserves orientation and reflection reverses it, while both preserve lengths and angles. Reflection in y=−2 is not the origin-axis rule −y.',
        '平移每点同加向量；反射先找点与像的中点必须在哪条轴上。',
        'Add the same translation vector to every point. For reflection, locate the required point-image midpoint axis first.',
      ),
      task(
        7,
        'rotation-centre-and-direction',
        first
          ? '中心O=(1,2)、P=(4,3)。画OP，求绕O逆时针90°的像；另从原P作同中心半转，再半转一次。逐步写减中心、转位移、加中心，并核到O的距离。旋转90°会给图形内角再加90°吗？'
          : '中心O=(−2,1)、P=(1,3)。画OP，求绕O顺时针90°的像；另从原P作同中心半转，再半转一次。逐步写减中心、转位移、加中心，并核到O的距离。旋转90°会给图形内角再加90°吗？',
        first
          ? 'For O=(1,2),P=(4,3), draw OP and find the image under a 90° anticlockwise turn about O. Separately half-turn the original P twice about O. Show subtract-centre, rotate-displacement, add-centre steps and check the distance to O. Does turning 90° add 90° to a figure’s interior angles?'
          : 'For O=(−2,1),P=(1,3), draw OP and find the image under a 90° clockwise turn about O. Separately half-turn the original P twice about O. Show subtract-centre, rotate-displacement, add-centre steps and check the distance to O. Does turning 90° add 90° to interior angles?',
        first
          ? 'P−O=(3,1)，逆时针90°位移变(−1,3)，加O得P′=(0,5)，到O距离前后√10。半转位移取负，P半=2O−P=(−2,1)，再半转2O−(−2,1)=(4,3)回原位置P；O为P与半转像中点。不能直接改P坐标号，只有中心原点才可。旋转把全图刚性一起转，保长度、角和朝向；90°是运动角，不是给每个内角增加90°。'
          : 'P−O=(3,2)，顺时针90°变(2,−3)，加O得P′=(0,−2)，到O距离前后√13。半转像2O−P=(−5,−1)，再半转2O−(−5,−1)=(1,3)回P，O是对应中点。非原点中心必须先减后加，不能直接改P两号。旋转全图保长度、角、朝向；运动转角不加到图形内角。',
        first
          ? 'P−O=(3,1); anticlockwise 90° gives displacement (−1,3), then add O for P′=(0,5). Both distances to O are √10. A half-turn negates displacement: 2O−P=(−2,1); another gives (4,3), the original P. O is the midpoint of P and its half-turn image. Direct coordinate negation works only about the origin. A rigid rotation preserves lengths, angles and orientation; 90° describes the motion, not an addition to each interior angle.'
          : 'P−O=(3,2); clockwise 90° gives (2,−3), then add O for P′=(0,−2). Both distances to O are √13. A half-turn gives 2O−P=(−5,−1), and a second gives (1,3), the original P, with O the corresponding midpoint. A nonorigin centre requires subtracting then adding it. A rotation preserves lengths, angles and orientation; its turn angle is not added to interior angles.',
        '先画从O指向P的相对箭头；逆时针(u,v)→(−v,u)，顺时针(u,v)→(v,−u)。',
        'Draw the displacement from O to P. Anticlockwise maps (u,v) to (−v,u); clockwise maps it to (v,−u).',
      ),
      task(
        8,
        'pythagorean-area-dissection',
        `剪四块同样直角三角形，直角边一般为正a、b，斜边c。画两个外边a+b的正方形重排：一图留c²，一图留a²与b²，标为什么中央确为正方形、没有重叠缺块。由面积推一般式再代a=${first ? 5 : 8}、b=${first ? 12 : 15}核数值，区分c²与c。几次数值吻合是否证明一般结论？`,
        `Cut four congruent right triangles with arbitrary positive legs a,b and hypotenuse c. Draw two rearrangements inside squares of side a+b, leaving c² in one and a²,b² in the other. Explain central right angles, no gaps and no overlaps. Derive the general relation before checking a=${first ? 5 : 8},b=${first ? 12 : 15}. Distinguish c² from c. Do a few numerical matches prove the general result?`,
        `两外面积均(a+b)²；四同样三角形各ab/2，总2ab，平移旋转不伸缩。第一空白四边同c，相邻两锐角和90°使空白角180−90=90°，故为正方形c²；第二重排空白正方形a²和b²。等外面积减同四块得c²=a²+b²，亦(a+b)²−2ab。代值得外面积${first ? 289 : 529}减三角形总${first ? 120 : 240}，余${first ? 169 : 289}；所以c=${first ? 13 : 17}，不是${first ? 169 : 289}，长度取正根。原推导对任意正数a、b成立，数值仅核例，图须实际覆盖无叠缺。`,
        `Both outer areas are (a+b)². Four congruent triangles of area ab/2 total 2ab and move without stretching. In the first layout the gap has four sides c; adjacent acute angles sum to 90°, leaving each gap corner 180−90=90°, so its area is c². The second layout leaves squares a² and b². Subtracting the same four pieces proves c²=a²+b², also (a+b)²−2ab. Here outer area ${first ? 289 : 529} minus triangle total ${first ? 120 : 240} leaves ${first ? 169 : 289}, so c=${first ? 13 : 17}, not ${first ? 169 : 289}. Length uses the positive root. The general argument covers arbitrary positive a,b; numerical checks alone do not prove it, and actual drawings must have no gaps or overlaps.`,
        '先标每块同样的边与角，再比较“同外框减同四块”的剩余面积。',
        'Label matching piece lengths and angles before comparing equal outer areas minus the same four pieces.',
      ),
      task(
        9,
        'right-triangle-exact-length',
        `矩形两边${first ? '3 cm与50 mm' : '40 mm与7 cm'}，求对角线精确长度，说明直角依据和单位平方/开方。另一个已知直角三角形斜边${first ? 13 : 17} cm、一腿${first ? 5 : 8} cm，求另一腿。为何不能斜边减腿、为何不取负根、为何不能凭斜着画的图补直角？`,
        `A rectangle has sides ${first ? '3 cm and 50 mm' : '40 mm and 7 cm'}. Find its exact diagonal, explaining the right-angle premise and squared/root units. Another GIVEN right triangle has hypotenuse ${first ? 13 : 17} cm and one leg ${first ? 5 : 8} cm; find the other leg. Why not subtract lengths, take a negative root or infer a right angle from appearance?`,
        `先统一为${first ? '3和5' : '4和7'} cm，矩形定义给直角，对角斜边平方${first ? '9+25=34' : '16+49=65'} cm²，长√${first ? 34 : 65} cm为精确，显示小数只能近似。另一腿平方=${first ? 169 : 289}−${first ? 25 : 64}=${first ? 144 : 225} cm²，腿${first ? 12 : 15} cm，代平方和核回；不能用${first ? 13 : 17}−${first ? 5 : 8}。距离非负且此腿正，负根非长度，平方量是面积单位开方回长度。若没有矩形/直角等已知，图外观不足以直接用勾股。`,
        `First convert to ${first ? 'three and five' : 'four and seven'} cm. The rectangle definition supplies a right angle, so diagonal squared is ${first ? '9+25=34' : '16+49=65'} cm² and exact length is √${first ? 34 : 65} cm; a displayed decimal is only approximate. The other triangle’s missing leg squared is ${first ? 169 : 289}−${first ? 25 : 64}=${first ? 144 : 225} cm², giving positive length ${first ? 12 : 15} cm, checked by the square sum. Do not subtract ${first ? 13 : 17}−${first ? 5 : 8}. Distances are nonnegative and this leg is positive; a negative root is not a length. Squaring gives area units and rooting returns length units. Without a stated right-angle premise, appearance alone cannot justify Pythagoras.`,
        '先统一长度单位，再圈出已知斜边；未知斜边加平方，未知腿减平方。',
        'Unify length units first and identify the hypotenuse. Add squares for an unknown hypotenuse; subtract for an unknown leg.',
      ),
      task(
        10,
        'pythagorean-converse-validity',
        `给四组无序边长：${first ? '(13,5,12)、(1,2,3)、(4,5,6)、(2,3,4)' : '(17,8,15)、(2,3,5)、(5,6,7)、(3,4,6)'}，同为cm。先验三角形存在，再取最长边核平方关系。用另构直角三角形及SSS解释逆定理；若平方不等，能仅凭“不是等号”就分锐钝吗？说明还需哪条比较性质。`,
        `Consider unordered side triples ${first ? '(13,5,12),(1,2,3),(4,5,6),(2,3,4)' : '(17,8,15),(2,3,5),(5,6,7),(3,4,6)'} in cm. Check triangle existence before choosing the longest side and comparing squares. Explain the converse using a constructed right triangle and SSS. If squares differ, does “not equal” alone determine acute versus obtuse? State the additional comparison property.`,
        `须正长且两短边和严格大于最长。第一组有效，${first ? '5²+12²=13²' : '8²+15²=17²'}，另构两短边为直角边的三角形，正向勾股给同斜边，SSS全等把直角传回，故最长对角90°。第二组两短边和等最长，退化不是三角形。第三组最长平方${first ? 36 : 49}小于短边平方和${first ? 41 : 61}，第四组${first ? 16 : 36}大于${first ? 13 : 25}；不等本身只直接否定直角，结合固定两边时夹角越大对边越长的比较性质，第三最大角锐（故全锐），第四最大角钝。非正边也先排除；不能对不存在形状谈锐钝或靠近似凑等号。`,
        `Require positive sides and a strict short-side sum greater than the longest. The first triple exists and satisfies ${first ? '5²+12²=13²' : '8²+15²=17²'}. Construct a right triangle on the shorter legs; forward Pythagoras gives the same hypotenuse, and SSS transfers the right angle to the original. The second triple has equality in the triangle inequality and is degenerate, not a triangle. For the third, longest-side square ${first ? 36 : 49} is below the other square sum ${first ? 41 : 61}; the fourth has ${first ? 16 : 36} above ${first ? 13 : 25}. Inequality alone directly excludes a right angle. Add the property that, for two fixed sides, larger included angle gives a longer opposite side: the third has an acute largest angle and is fully acute; the fourth is obtuse. Reject nonpositive lengths first; nonexistent shapes cannot be called acute/obtuse, and approximate matches do not establish equality.`,
        '顺序是存在→最长→精确平方→有依据的角分类，不能颠倒。',
        'Use existence→longest side→exact squares→justified angle classification, in that order.',
      ),
    ],
  };
};
export const congruenceMotionRetrieval = {
  H05: makeSet('H05'),
  H06: makeSet('H06'),
};
