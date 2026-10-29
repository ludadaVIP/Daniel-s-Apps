import { t, type Question } from '../model';
import { reasoning } from './builders';

const makeSet = (unit: 'H05' | 'H06') => {
  const near = unit === 'H05',
    id = (n: number) => `${unit}-MAINT-CONGRUENCE-MEANING-Q${n}`;
  const card = (
    n: number,
    skill: string,
    z: string,
    en: string,
    rz: string,
    re: string,
  ) =>
    reasoning(id(n), t(z, en), skill, t(rz.trim(), re.trim()), [
      t(
        '先画自己的图、标原始已知和目标；区分字母身份、数值和构造。每句推论写具体依据，不用像素近似或待证结论补条件。',
        'Draw your own figure with original givens and target. Separate letter identities, values and constructions. Give a reason for each deduction rather than adding premises from pixels or the target.',
      ),
      t(
        '每次一个编号或独立案例，可分次、不计时；允许口述或熟悉语言。读题帮助与数学提示分开；先生成再逐项人审。',
        'One numbered part or independent case per untimed sitting; oral or familiar-language work is welcome. Separate reading help from mathematical hints. Generate before reviewing each part.',
      ),
    ]);
  const table = (
    q: Question,
    rows: [string, string, string, string, string][],
  ) => {
    q.contextTable = {
      caption: t(
        '原条件：各编号案例独立，三角形须非退化；四边形简单、非退化且按周界命名。纸上虚构图不是实际家庭观察。',
        'Original conditions: labelled cases are independent; triangles must be nondegenerate. Quadrilaterals are simple, nondegenerate and named around their boundaries. Fictional paper figures are not household observations.',
      ),
      columns: [
        t('编号', 'ID'),
        t('对象', 'Object'),
        t('原条件', 'Original conditions'),
      ],
      rows: rows.map(([k, z, en, v, ve]) => [t(k, k), t(z, en), t(v, ve)]),
    };
  };
  const code = near ? 'EFD' : 'FDE',
    a = near ? 35 : 40,
    b = near ? 75 : 85,
    side = near ? 4 : 6;
  const orders = ['ABC', 'ACB', 'BAC', 'BCA', 'CAB', 'CBA'];
  const mapped = orders
    .map(
      (order) =>
        `${order}↔${[...order].map((v) => code['ABC'.indexOf(v)]).join('')}`,
    )
    .join('; ');
  const q1 = card(
    1,
    'reordered-correspondence-and-angle-domain',
    '① 按M画两三角形并写全部顶点、边、角对应。把源三角形按ABC、ACB、BAC、BCA、CAB、CBA六种顺序重写，每行生成同一对应下的目标顺序。边AB写BA为何可用，目标三字母为何不能独自随便交换？反射旋转后保点名，六行会变吗？② 独立P与Q各画图，核两给定角及第三角均合法，求第三角，列对应证据并给直接ASA/AAS；若改用另一角边判据，先明确补哪一角及内角和依据。③ 独立坏角对(0°,70°)、(80°,100°)、(100°,90°)各能成非退化三角形吗？分别解释，不因有一条正边便使用ASA/AAS。给两个角的一般合法范围。',
    '① Draw M and list ALL corresponding vertices, sides and angles. Rewrite the source as ABC,ACB,BAC,BCA,CAB,CBA, generating the target order for the SAME correspondence on every row. Why may edge AB be written BA, while the target triangle letters cannot be arbitrarily swapped alone? Do reflection/rotation with retained names change those six rows? ② Draw SEPARATE P and Q. Check positivity of both given angles and the third, calculate the third, list matching evidence and give direct ASA/AAS. To use the other angle-side criterion, explicitly derive the missing angle by the angle sum first. ③ Can independent angle pairs (0°,70°),(80°,100°),(100°,90°) each form a nondegenerate triangle? Explain each failure; one positive side does not validate ASA/AAS. State the general admissible range for two angles.',
    `M由ABC≅${code}逐位置匹配：A↔${code[0]}、B↔${code[1]}、C↔${code[2]}，AB↔${code.slice(0, 2)}、BC↔${code.slice(1)}、CA↔${code[2]}${code[0]}，三组角按同一顶点对应；六行${mapped}。边无向，AB/BA同一线段，目标边端点也可倒；三角有序，改变源次序须同步改变目标，不因图反射或旋转重新按左右命名。P第三角C=${180 - a - b}°，AB夹A/B，直接ASA；补C及目标对应角后可AAS。Q第三角B=${180 - a - b}°，AB不夹A/C，直接AAS；补B后用A/B及AB为ASA。两案各自两角及第三角正；一般α>0、β>0、α+β<180°。坏对依次含零角、第三角0°退化、第三角−10°不可能；正边长度不能修复这些角条件。`,
    `Match positions in ABC≅${code}: A↔${code[0]},B↔${code[1]},C↔${code[2]}, sides AB↔${code.slice(0, 2)},BC↔${code.slice(1)},CA↔${code[2]}${code[0]}, and the three matching vertex angles. All six rows are ${mapped}. An edge is undirected, so AB/BA denote one segment and its matching edge may reverse. Triangle correspondence is ordered: changing source order requires the matching target order. Reflection/rotation do not rename by screen position. P has C=${180 - a - b}°, with AB included between A/B:direct ASA, or AAS after deriving C and its counterpart. Q has B=${180 - a - b}°; AB is not between A/C:direct AAS, or ASA after deriving B. In each separate case all three angles are positive. Generally require α>0,β>0,α+β<180°. The bad pairs respectively contain a zero angle, yield a zero third angle (degenerate), and yield −10° (impossible). A positive side cannot repair invalid angles.`,
  );
  table(q1, [
    [
      'M',
      '同一有序对应',
      'One ordered correspondence',
      `△ABC≅△${code}`,
      `△ABC≅△${code}`,
    ],
    [
      'P',
      '独立夹边案例',
      'Separate included-side case',
      `A↔D、B↔E、C↔F；∠A=∠D=${a}°、∠B=∠E=${b}°、AB=DE=${side}cm`,
      `A↔D,B↔E,C↔F; ∠A=∠D=${a}°, ∠B=∠E=${b}°, AB=DE=${side}cm`,
    ],
    [
      'Q',
      '独立非夹边案例',
      'Separate nonincluded-side case',
      `A↔D、B↔E、C↔F；∠A=∠D=${a}°、∠C=∠F=${b}°、AB=DE=${side}cm`,
      `A↔D,B↔E,C↔F; ∠A=∠D=${a}°, ∠C=∠F=${b}°, AB=DE=${side}cm`,
    ],
  ]);
  const base = near ? 35 : 55,
    apex = 180 - 2 * base;
  const q2 = card(
    2,
    'inverse-isosceles-and-changed-leg-identity',
    '① I先标腰、底、顶角和两底角，求顶角；再由求得顶角正向算回两个底角。为什么逆算不把剩余的单个顶角再除2？② 独立J换了相等边，重新找顶角，求其余两角。不能照抄I的顶角字母；把∠A另改成100°还能成形吗？③ 自选一个0°<β<90°的底角，亲画AB=AC的虚构三角形，算顶角并核三角和，再换为AB=BC且∠A=β，重新标角计算。说明底角90°、0°以及顶角180°、0°为何都不能用于非退化图；滑块的20°–140°是不是数学的全部顶角范围？',
    '① In I mark legs, base, apex and base angles. Find the apex, then calculate both bases back from it. Why is the remaining SINGLE apex not divided by two? ② Independent J changes the equal sides: identify its apex afresh and find both remaining angles. Do not copy I’s apex letter. Would changing ∠A to 100° still allow a triangle? ③ CHOOSE a base angle 0°<β<90°, draw fictional AB=AC, calculate its apex and check the sum. Then change to AB=BC with ∠A=β, relabel roles and calculate again. Explain failures at base 90°/0° and apex 180°/0°. Does the slider’s 20°–140° define the whole mathematical apex domain?',
    `I的顶角A=180−2×${base}=${apex}°，B=C=${base}°；反算(180−${apex})/2=${base}。J腰AB/BC交于B，底AC，故A=C=${base}°、B=${apex}°；若∠A=100°则∠C=100°，∠B=−20°，不能成形。任意0<β<90均可自选，顶角180−2β严格在0到180之间；例如β=${near ? 40 : 50}给顶角${near ? 100 : 80}，AB=AC时顶角A，AB=BC时顶角B。底角90使顶角0，底角0使顶角180，边界均退化/不成三角；合法顶角为0<α<180，不限于UI范围。此处图只标条件，已知腰等的性质与由等角反推腰等的证明仍分别核，不能偷用待证条件。`,
    `I has apex A=180−2×${base}=${apex}°, with B=C=${base}°; checking back gives (180−${apex})/2=${base}. In J, equal AB/BC meet at apex B and AC is the base, so A=C=${base}°,B=${apex}°. A=100 would force C=100,B=−20, impossible. ANY 0<β<90 is permitted, giving 0<180−2β<180; for example β=${near ? 40 : 50} gives apex ${near ? 100 : 80}. That apex is A under AB=AC and B under AB=BC. Base 90 gives apex zero; base zero gives apex 180. Endpoints are degenerate/impossible. The full apex domain is 0<α<180, beyond the UI range. Drawings mark givens; forward equal-leg properties and the converse proof from equal angles still require their different premises.`,
  );
  table(q2, [
    [
      'I',
      '逆求原顶角',
      'Recover original apex',
      `AB=AC；∠B=∠C=${base}°`,
      `AB=AC; ∠B=∠C=${base}°`,
    ],
    [
      'J',
      '独立换腰身份',
      'Separate changed equal legs',
      `AB=BC；∠A=${base}°`,
      `AB=BC; ∠A=${base}°`,
    ],
  ]);
  const pa = near ? 65 : 115,
    ao = near ? 3 : 5,
    bo = near ? 4 : 6;
  const q3 = card(
    3,
    'parallelogram-numerical-properties-and-diagonal-proof',
    '① P已知是平行四边形，求B/C/D各角，区分相邻与相对并说明平行线依据；四角和核360°。② 独立D也已知是平行四边形，求OC、OD、整条AC和BD，标cm。互相平分是否意味着AC=BD？用本案实值反驳；一条的一半不要当另一条的一半。③ 另仅从两组对边平行的定义出发，自画ABCD与内部对角线交点O：先用AC证明ABC≅CDA取得AB=CD，再列AOB与COD的两个对应角及夹边，证明AO=OC且BO=OD。不能把正在证明的互平分先作已知。只画对角线新增了什么、没有自动新增什么？',
    '① P is GIVEN to be a parallelogram. Find B,C,D, distinguish adjacent/opposite positions and justify from parallel lines. Check total 360°. ② SEPARATE D is also a given parallelogram: find OC,OD and WHOLE AC,BD in cm. Does mutual bisection imply equal diagonals? Refute using these actual values; half of one diagonal is not half of the other. ③ Starting SEPARATELY only from the definition (both opposite pairs parallel), draw ABCD and internal diagonal intersection O. First use AC to prove ABC≅CDA and obtain AB=CD. Then list two corresponding angles and their included side for AOB and COD, proving BOTH AO=OC and BO=OD without assuming bisection. What does drawing diagonals add, and what equalities does it not automatically add?',
    `P有A=C=${pa}°、B=D=${180 - pa}°；邻角因平行同旁内角互补，对角由相邻补角或全等，合360。独立D给OC=${ao}、OD=${bo}、AC=${2 * ao}、BD=${2 * bo}cm，AC≠BD仍两条各被平分，不混P与D。证明：AB∥CD、BC∥AD给BAC=DCA、BCA=DAC，AC公共，ASA得ABC≅CDA，取AB=CD。再AB∥CD与O在AC/BD上给OAB=OCD、OBA=ODC；夹边AB=CD已证，ASA得AOB≅COD，故AO=CO、BO=DO。可用已说明的第三角改有效判据。连接与交点只提供共线/相交等构造关系，不自动给等分、垂直或等长；每步依赖先建立。`,
    `P has A=C=${pa}°,B=D=${180 - pa}°; parallel lines give supplementary neighbours and equal opposite angles follow from supplements or congruence. Total is 360. SEPARATE D has OC=${ao},OD=${bo},AC=${2 * ao},BD=${2 * bo} cm. Unequal diagonals can each be bisected; do not merge P/D. For the proof, opposite parallels give BAC=DCA,BCA=DAC. Common AC gives ABC≅CDA by ASA, hence AB=CD. Now AB∥CD and O on AC/BD give OAB=OCD,OBA=ODC, with already-proved included AB=CD. ASA gives AOB≅COD, so AO=CO,BO=DO. A justified third-angle conversion is valid. Drawing diagonals/intersection supplies incidence, not automatic bisection, perpendicularity or equal lengths. Establish each dependency first.`,
  );
  table(q3, [
    [
      'P',
      '独立已知平行四边形',
      'Separate given parallelogram',
      `ABCD；∠A=${pa}°`,
      `ABCD; ∠A=${pa}°`,
    ],
    [
      'D',
      '另一已知平行四边形',
      'Another given parallelogram',
      `对角线内部交O；AO=${ao}cm、BO=${bo}cm`,
      `Diagonals meet internally at O; AO=${ao}cm, BO=${bo}cm`,
    ],
  ]);
  const q4 = card(
    4,
    'complete-converse-proofs-and-independent-proof-repair',
    `① T1/T2/T3是三个独立四边形，分别只给表内条件。各自连必要辅助线，写全等对应、完整边角依据、判据、角到平行的理由，推两组对边平行。每次重新列已知，不搬用别案结论；T3须两条都平分；本次T2必须连${near ? 'AC' : 'BD'}。再从T3撤掉BO=OD，只保留AO=OC，能否仍保证平行四边形？亲给合法坐标反例，核原条件并说明另一条未平分与两组不平行。② 纸上自创虚构花坛三角形和简单四边形，标实际已知与目标，选其中一图写完整短证明（可用以上任一链，但要用自己标的字母和条件）。亲写一条借目标证明自身的错误句，指出循环，并在保留原已知下修复为非循环链。③ 自主画一个不足条件的反例，选AAA不同大小或一组平行/不同组等边的梯形；亲选合法数值，证明原条件满足而结论失败。不能用画得不准或屏幕近似冒充反例。一次一案例，不以卡片排对、作者例子或人审按钮代替自己的图与理由。`,
    `① T1,T2,T3 are SEPARATE quadrilaterals with ONLY their table givens. For each draw a useful auxiliary line, state ordered congruence, complete matching side/angle evidence and criterion, then justify angle-to-parallel deductions establishing BOTH opposite parallel pairs. Restart the givens each time; T3 needs BOTH bisected diagonals. This time T2 MUST use ${near ? 'AC' : 'BD'}. Now REMOVE BO=OD from T3, retaining only AO=OC. Is a parallelogram still guaranteed? Design a valid coordinate counterexample, verifying the retained premise, the other diagonal not bisected and both opposite pairs nonparallel. ② Invent fictional garden triangles and a simple quadrilateral on paper, marking actual givens and targets. Choose one to give a complete short proof (a preceding chain is welcome with your OWN labelled letters and conditions). Write an erroneous sentence assuming its own target, identify the cycle, then repair it under the SAME original givens. ③ Design a counterexample to insufficient premises: choose AAA with different sizes, or a trapezoid with one parallel pair/different equal opposite pair. CHOOSE legal values and prove both that premises hold and the conclusion fails. An inaccurate sketch or approximate pixels are not a counterexample. One case per sitting; card order, author examples and review buttons do not replace your own diagram/reasons.`,
    `T1连AC：AB=CD、BC=DA、AC=CA，SSS得ABC≅CDA；BAC=DCA与BCA=DAC分别逆推AB∥CD、BC∥AD。${near ? 'T2连AC：AB∥CD给BAC=DCA，AB=CD已知、AC公共，SAS得ABC≅CDA，再用BCA=DAC得BC∥AD，连原AB∥CD成定义。' : 'T2连BD：AB∥CD给ABD=CDB，AB=CD已知、BD公共，SAS得ABD≅CDB，再用ADB=CBD得AD∥BC，连原AB∥CD成定义。'}T3：AO=CO、BO=DO与AOB=COD对顶角，SAS得AOB≅COD；OAB=OCD逆推AB∥CD。另AO=CO、DO=BO与AOD=COB对顶角，SAS得AOD≅COB；OAD=OCB逆推AD∥BC。O内部保证所用射线和内错位置。若只平分一条，缺另一边不能用该SAS；反例可取A(−2,0)、C(2,0)、B(0,1)、D(0,−3)，O(0,0)内部，AO=OC=2，但BO=1、OD=3，二者不等；AB/CD斜率1/2与3/2，BC/AD为−1/2与−3/2，两组均不平行。接受任何合条件自选反例。自创任何合法图/短证明/保原已知的循环修复均可：如自名PQR中PQ=PR，作顶角平分线PS，原目标QS=SR；不能先称S中点，改用腰等、半角等、PS公共的SAS，再取QS=SR。反例例三角形3/4/5与6/8/10同角不同长；或A(−3,0),B(3,0),C(2,2),D(−2,2)，AB∥CD，AD=BC=√5而AB=6、CD=4，二者不等，AD/BC方向不同，非平行四边形。接受其他自选合条件例，不限照抄；须实证满足前提与失败结论。`,
    `T1:draw AC. AB=CD,BC=DA,AC=CA give ABC≅CDA by SSS. Corresponding BAC=DCA and BCA=DAC establish AB∥CD and BC∥AD by alternate-angle converses. ${near ? 'T2:AB∥CD gives BAC=DCA; given AB=CD and common AC give ABC≅CDA by SAS. Then BCA=DAC gives BC∥AD, completing the definition with the original parallel pair.' : 'T2:AB∥CD gives ABD=CDB; given AB=CD and common BD give ABD≅CDB by SAS. Then ADB=CBD gives AD∥BC, completing the definition with the original parallel pair.'} T3:AO=CO,BO=DO and vertical AOB=COD give AOB≅COD by SAS; OAB=OCD establishes AB∥CD. Separately AO=CO,DO=BO and vertical AOD=COB give AOD≅COB by SAS; OAD=OCB establishes AD∥BC. An internal O supplies the required ray/alternate-angle positions. Bisecting only one diagonal lacks the other side premise. For example A(−2,0),C(2,0),B(0,1),D(0,−3),O(0,0) form a simple quadrilateral with internal O,AO=OC=2 but BO=1≠OD=3. Slopes AB/CD are 1/2 and 3/2; BC/AD are −1/2 and −3/2, so neither opposite pair is parallel. Any independently chosen valid counterexample counts. Accept ANY valid independent drawing, short proof and repair retaining original givens:for example own-labelled PQR with PQ=PR and apex bisector PS targeting QS=SR. Do not first declare S a midpoint; use equal legs, equal apex halves and common PS for SAS, then corresponding segments. Example counterexamples:3/4/5 and 6/8/10 have equal angles but different lengths; or A(−3,0),B(3,0),C(2,2),D(−2,2) has AB∥CD,AD=BC=√5, but bases six/four and nonparallel legs. Other self-chosen legal examples count equally; explicitly establish premises and failure of the conclusion. `,
  );
  table(q4, [
    [
      'T1',
      '独立两组对边相等',
      'Separate both opposite pairs equal',
      'AB=CD；BC=DA',
      'AB=CD; BC=DA',
    ],
    [
      'T2',
      '独立同一组平行且等长',
      'Separate same pair parallel and equal',
      'AB∥CD；AB=CD',
      'AB∥CD; AB=CD',
    ],
    [
      'T3',
      '独立两对角线互平分',
      'Separate mutual diagonal bisection',
      '内部交点O；AO=OC且BO=OD',
      'Internal intersection O; AO=OC AND BO=OD',
    ],
  ]);
  return {
    id: `${unit}-MAINT-CONGRUENCE-MEANING`,
    unit,
    title: t(
      '重排对应、逆算与完整几何证明',
      'Reordered correspondence, inverse angles and complete geometric proofs',
    ),
    intro: t(
      '四张纸笔卡，每次一个编号/独立案例，可分次、不计时。先画图标条件、生成数值和理由，再逐项人审；可口述/熟悉语言，读题帮助与数学提示分开。虚构几何无需实测或购买，作者例子不是唯一方案。',
      'Four paper cards, one numbered part/independent case per untimed sitting. Draw and label givens, generate values/reasons, then review each part. Oral/familiar-language work is welcome; distinguish reading help from mathematical hints. Fictional geometry needs no measurements or purchases; author examples are not unique designs.',
    ),
    bridge: 'J86-L01',
    bridgeByQuestion: Object.fromEntries(
      [3, 4, 5, 6].map((l, i) => [id(i + 1), `J86-L0${l}`]),
    ),
    questions: [q1, q2, q3, q4],
  };
};
export const congruenceMeaningRetrieval = {
  H05_CONGRUENCE_MEANING: makeSet('H05'),
  H06_CONGRUENCE_MEANING: makeSet('H06'),
};
