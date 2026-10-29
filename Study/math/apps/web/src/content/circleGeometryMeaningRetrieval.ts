import { t, type Question } from '../model';
import { reasoning } from './builders';

const makeSet = (unit: 'H22' | 'H23') => {
  const near = unit === 'H22';
  const id = (n: number) => `${unit}-MAINT-CIRCLE-GEOMETRY-MEANING-Q${n}`;
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
        '先亲画并标同圆、顶点、所取弧、垂足或切点；每个直角和比例都给依据。各编号独立，不能借另一案例的条件。反例须满足保留的全部已知。',
        'Draw and label the common circle, vertices, selected arc, foot or contact. Justify every right angle and proportion. Cases are independent: do not import another case’s premises. Counterexamples must meet every retained given.',
      ),
      t(
        '一次一个编号或案例，可分次不计时、口述或熟悉语言；读题协助不当数学提示。自己的设计可有不同合法答案，逐项人审，不要求抄作者。全部是虚构纸图，无需测量、购买、出行或上传。',
        'One numbered part or case per untimed sitting; oral or familiar-language work is welcome. Separate reading assistance from mathematical hints. Own designs may have different valid answers: review their reasoning rather than copying the author. These are fictional paper models, requiring no measurement, purchase, travel or upload.',
      ),
    ]);
  type Row = [string, string, string, string, string];
  const table = (q: Question, rows: Row[]) => {
    q.contextTable = {
      caption: t(
        '编号分开使用；角度为度，长度与面积各保单位。圆半径为正，圆上角顶点不同于弧端点；未标外观不补前提。',
        'Use labelled cases separately. Angles use degrees; retain length and area units. Circle radii are positive and inscribed vertices differ from arc endpoints. Unmarked appearance adds no premise.',
      ),
      columns: [
        t('编号', 'ID'),
        t('对象', 'Object'),
        t('原条件', 'Original conditions'),
      ],
      rows: rows.map(([k, z, en, v, ve]) => [t(k, k), t(z, en), t(v, ve)]),
    };
  };
  const radius = near ? '5/2' : '13/2';
  const distanceMM = near ? '15' : '25';
  const q1 = card(
    1,
    'circle-definition-distance-and-central-structure',
    '① C用“到固定O的距离为同一正r”画圆，标两条半径、经过O的弦和不经过O的弦。给直径与弦的包含方向，求直径；r=0或负数为何不是本课圆？统一mm/cm，先写HL与勾股依据，再求半弦和整弦。零垂距沿用旧题单独处理。② S独立保同圆与直线，算垂距OM和斜连线OQ，求整直线的全部交点。若只画M到Q的线段，看到一个交点能说整线相切吗？用实际数值反驳“任意O到线上点的距离都可当圆心距”。③ A是小圆心角，先由等半径给等腰再求两个底角；B反过来由给定底角求圆心角。为什么不是把圆心角直接除二？另核θ=180°布局。旋转或显示缩放保哪些量与点身份？',
    '① For C, DRAW the circle as points at the same positive distance r from fixed O. Label two radii, a chord through O and a chord missing O. State the diameter/chord inclusion direction and find the diameter. Why are zero/negative radii outside this lesson? Convert mm/cm; cite HL and Pythagoras before finding HALF and WHOLE chord lengths. Retain the existing separate zero-distance argument. ② S independently keeps its circle and line. Calculate perpendicular OM and sloping OQ, then ALL infinite-line intersections. If only segment MQ shows one crossing, is the whole line tangent? Use the actual numbers to refute replacing perpendicular centre distance by any O-to-line-point length. ③ A gives a minor central angle: use equal radii and the triangle sum for BOTH base angles. B reverses from a base angle to the central angle. Why not simply halve the central angle? Audit θ=180° separately. What quantities and point identities survive display rotation/zoom?',
    near
      ? 'C中r=5/2cm，直径5cm；每个直径是弦，不是每条弦都过O。r>0，零使点集退化成一个点，负距离无点。d=15mm=3/2cm，HL给两半相等，半弦²=25/4−9/4=4，半弦2、整弦4cm。S为O(0,0)、直线y=3/2，M(0,3/2)、Q(2,3/2)。OM=3/2<5/2而OQ=√(4+9/4)=5/2；整线交点(−2,3/2)、(2,3/2)，非切线。有限MQ只留Q一个交点，不能代整线定义。A的θ=125/2°，每底角(180−125/2)/2=235/4°；直接折半125/4°错误。B底角135/4°给θ=180−2×135/4=225/2°。θ=180°三点共线，不是两个零底角的非退化三角形。显示变化不改数值、垂直关系或点身份。'
      : 'C中r=13/2cm，直径13cm，直径属于弦而反向不成立。r=0退化为点，负距离无点，本课取正半径。d=25mm=5/2cm，HL给半弦相等，半弦²=169/4−25/4=36，半弦6、整弦12cm。S为O(0,0)、y=5/2，M(0,5/2)、Q(6,5/2)。OM=5/2<13/2，OQ=√(36+25/4)=13/2，整线两交点(−6,5/2)、(6,5/2)，不是切线。有限MQ只显示Q，斜连线恰等半径不能替最短垂距。A的θ=255/2°，每底角(180−255/2)/2=105/4°，不是θ/2=255/4°。B底角75/4°给θ=180−2×75/4=285/2°。θ=180°三点共线，不把退化布局叫三角形。旋转/显示缩放保长度、垂直及点身份。',
    near
      ? 'C has r=5/2 cm and diameter 5 cm. Every diameter is a chord, but an off-centre chord is not a diameter. Positive r is required: zero collapses to one point and a negative distance gives no points. Convert d=15 mm=3/2 cm. HL bisects the chord; half-chord squared is 25/4−9/4=4, giving half 2 and whole 4 cm. For S, O(0,0), line y=3/2, M(0,3/2), Q(2,3/2) give OM=3/2<5/2 but OQ=√(4+9/4)=5/2. ALL intersections are (−2,3/2),(2,3/2): secant, not tangent. MQ contains only Q, demonstrating why a finite segment is insufficient. A gives each base angle (180−125/2)/2=235/4°, not 125/4°. B gives central angle 180−2×135/4=225/2°. At 180° the three points are collinear, not a nondegenerate triangle with zero base angles. Display changes preserve values, perpendicularity and point identity.'
      : 'C has r=13/2 cm and diameter 13 cm. Diameters are chords; the converse fails. Zero radius collapses to a point and negative distance has no points; this lesson requires r>0. Convert d=25 mm=5/2 cm. HL gives equal halves; half-chord squared is 169/4−25/4=36, giving half 6 and whole 12 cm. S has O(0,0), line y=5/2, M(0,5/2), Q(6,5/2). OM=5/2<13/2 while OQ=√(36+25/4)=13/2. Intersections (−6,5/2),(6,5/2) show a secant; MQ alone shows only Q. Sloping OQ equalling r does not replace perpendicular distance. A gives each base angle (180−255/2)/2=105/4°, not 255/4°. B gives θ=180−2×75/4=285/2°. At 180° the points are collinear. Rotation/display zoom preserve lengths, perpendicularity and point identities.',
  );
  table(q1, [
    [
      'C',
      '独立圆与垂弦',
      'Separate circle/chord',
      `r=${radius}cm;d=${distanceMM}mm`,
      `r=${radius}cm;d=${distanceMM}mm`,
    ],
    [
      'S',
      '独立整线与有限线段',
      'Separate line/segment',
      near
        ? 'O(0,0),r=5/2cm;y=3/2;M(0,3/2),Q(2,3/2)'
        : 'O(0,0),r=13/2cm;y=5/2;M(0,5/2),Q(6,5/2)',
      near
        ? 'O(0,0),r=5/2cm;y=3/2;M(0,3/2),Q(2,3/2)'
        : 'O(0,0),r=13/2cm;y=5/2;M(0,5/2),Q(6,5/2)',
    ],
    [
      'A',
      '独立小圆心角',
      'Separate minor central angle',
      `θ=${near ? '125/2' : '255/2'}°;OA=OB=r>0`,
      `θ=${near ? '125/2' : '255/2'}°;OA=OB=r>0`,
    ],
    [
      'B',
      '独立底角逆求',
      'Separate inverse base angle',
      `OA=OB;∠OAB=${near ? '135/4' : '75/4'}°`,
      `OA=OB;∠OAB=${near ? '135/4' : '75/4'}°`,
    ],
  ]);
  const sweep = near ? 70 : 110;
  const q2 = card(
    2,
    'circle-isosceles-arc-proof-and-cyclic-counterexample',
    '① E所有位置角均从同一圆的正横轴逆时针计。分别亲画P与R两个布局，连OP/OR，从小圆心角及等半径求顶点处两底角，说明一次相加、一次相减为何都给同一圆周角；不只引用“弧除二”。一般同异侧理由沿用旧题。② U独立给大扫角，分别把顶点放在选定弧内部和另一弧内部，先标不含顶点的弧再求两角。直径两侧与顶点离圆/重合的实际审查直接使用解析几何旧题。③ K四点依次共圆，由两截弧合成整圆证明对角互补再求C；另撤共圆只保A角，自画同A角的凸菱形，求C，给出合法反例。旋转不增共圆前提；卡片能排顺序仍需自由证明。',
    '① E uses counterclockwise position angles from the positive horizontal axis of ONE circle. DRAW separate P and R layouts, join OP/OR and derive the two vertex base angles from minor central angles and equal radii. Explain why ADDITION in one layout and SUBTRACTION in the other give the same inscribed angle; do more than cite half the arc. Retain the existing general same/opposite-side argument. ② U independently supplies a major sweep. Place a vertex inside the selected arc and then inside the other arc; label each arc excluding it before calculating both angles. Reuse the analytic-geometry task for the diameter, off-circle and endpoint audit. ③ For cyclic K, prove opposite-angle supplementation by partitioning the full turn, then find C. Remove concyclicity while retaining A: DRAW a convex rhombus with that A angle and find C as a valid counterexample. Rotation supplies no concyclicity; legal card order still needs a free proof.',
    near
      ? 'E中A=0°、B=70°、P=215°：小AOP=BOP=145°，P处两底角各35/2°，OP在角内部，相加35°。R=300°时小∠AOR=60°、∠BOR=130°，R处底角60°与25°，OR在∠ARB外侧，作差60−25=35°，不是85°。两者所截不含顶点弧均70°。U选定250°大弧：顶点在其中截另一110°弧，角55°；顶点在另一弧则截250°，角125°，和180°。K的∠A=65°、C截弧与A所截弧合360，各半故C=115°。撤共圆可画∠A=65°的非退化凸菱形，对角C=65°≠115°，四角65、115、65、115和360；满足保留A而反驳保证。不把这菱形再假称共圆。'
      : 'E中A=0°、B=110°、P=235°：小AOP=BOP=125°，P处两底角各55/2°，OP内分角，相加55°。R=320°时小∠AOR=40°、∠BOR=150°，R处底角70°与15°，OR在∠ARB外，作差70−15=55°，不是85°。不含顶点的弧均110°。U选定290°大弧：顶点在选定弧时截70°弧，角35°；在另一弧时截290°，角145°，和180°。K共圆且∠A=75°，两截弧合360，故C=105°。撤共圆只保∠A=75°，画凸菱形给∠C=75°≠105°，四角75、105、75、105和360，非退化而合法，不能补共圆来凑结论。',
    near
      ? 'E: A=0°,B=70°,P=215° give minor AOP=BOP=145°. Equal radii give two base angles at P of 35/2°; OP is inside APB, so their sum is 35°. For R=300°, minor AOR=60° and BOR=130° give vertex base angles 60° and 25°. OR lies outside ARB: their DIFFERENCE is 35°, not sum 85°. Both intercepted arcs excluding the vertex are 70°. U selects a 250° major arc: a vertex inside it intercepts 110°, giving 55°; a vertex on the other arc intercepts 250°, giving 125°. For K, opposite intercepted arcs partition 360°, so half-angles total 180° and C=115°. Without concyclicity, a convex rhombus with A=65° has C=65°, not 115°. Its angles 65,115,65,115 total 360° and retain the given A. Do not falsely add concyclicity to the rhombus.'
      : 'E: A=0°,B=110°,P=235° give minor AOP=BOP=125° and two base angles 55/2° at P. OP is inside APB: add for 55°. R=320° gives minor AOR=40° and BOR=150°, hence base angles 70° and 15° at R. OR lies outside ARB: subtract for 55°, not sum 85°. Both intercepted arcs excluding their vertices are 110°. U selects 290°: a vertex inside it intercepts 70°, giving 35°; a vertex on the other arc intercepts 290°, giving 145°. In cyclic K, the two intercepted arcs partition 360°, so C=180−75=105°. Removing concyclicity while keeping A=75° permits a convex rhombus with opposite C=75°, not 105°. Its angles 75,105,75,105 total 360°. This is a nondegenerate counterexample, not a cyclic quadrilateral.',
  );
  table(q2, [
    [
      'E',
      '同圆位置，P/R分别画',
      'Circle positions; draw P/R separately',
      `A=0°,B=${sweep}°,P=${near ? 215 : 235}°,R=${near ? 300 : 320}°`,
      `A=0°,B=${sweep}°,P=${near ? 215 : 235}°,R=${near ? 300 : 320}°`,
    ],
    [
      'U',
      '独立选定逆时针大弧',
      'Separate selected counterclockwise major arc',
      `A→B=${near ? 250 : 290}°；顶点均非端点`,
      `A→B=${near ? 250 : 290}°; vertices are not endpoints`,
    ],
    [
      'K',
      '独立共圆及撤前提分支',
      'Separate cyclic/premise-removed cases',
      `A,B,C,D依次同圆；∠A=${near ? 65 : 75}°。独立撤共圆只保A角`,
      `A,B,C,D in cyclic order; ∠A=${near ? 65 : 75}°. Independently remove concyclicity, retaining A only`,
    ],
  ]);
  const q3 = card(
    3,
    'circle-contact-converse-fractional-tangent-and-angle',
    '① T先统一单位，指切点直角和斜边，求PT精确正长度并乘回原平方关系；核表内小数是否精确，不把负根当长度。同外点两切线的完整HL证明继续用旧题。② A两条已知同圆切线从同外点引出，按OTPS四内角推∠TPS，为什么不能把小圆心角折半？③ V亲画圆及三条给定直线，说明都垂直OT所在直线，为何仅在圆上端点T处垂直的线相切。逐条求圆心垂距/交点，给逆判完整前提与错误位置的实际反例。④ W独立撤PT相切，只保O、P、T坐标和圆；算PT并核为何原平方差不可直接用。不要从草图补右角。',
    '① For T, unify units, identify the contact right angle and hypotenuse, and find the exact POSITIVE tangent length. Check the original squared relation. Is the supplied decimal exact? Negative roots are not lengths. Retain the existing full HL proof for two tangents. ② In A, two GIVEN tangents to one circle meet at one external point. Use the four interior angles of OTPS to derive TPS. Why not halve the minor central angle? ③ DRAW V’s circle and three lines. All are perpendicular to the line containing OT: why is only the one perpendicular AT on-circle endpoint T tangent? Calculate centre distances/intersections for each, giving the complete converse and actual wrong-location counterexamples. ④ W independently removes tangency, retaining only its coordinates and circle. Calculate PT and explain why the original squared difference cannot be imported. Do not add a right angle from appearance.',
    near
      ? 'T的OT=25mm=5/2cm、OP=7/2cm为斜边，PT²=49/4−25/4=6，PT=√6cm；6+25/4=49/4。2.45²=2401/400=6.0025≠6，故2.45只是近似，负√6非长度。A中T/S各90°，∠TPS=180−250/3=290/3°，不是125/3°。V半径2，T(2,0)，x=2到O垂距2，唯一(2,0)为切点；x=0过O，交点(0,±2)，是割线；x=3垂距3>2无交点。三线都与OT所在横轴垂直，仅第一条经过半径圆上端点。W的O(0,0)、P(7/2,0)、T(5/2,0)给PT=1cm，T仍在r=5/2的圆上且P外，但OT和TP共线不垂直，1²+25/4≠49/4，不能套切线平方差。'
      : 'T的OT=35mm=7/2cm、OP=9/2cm，PT²=81/4−49/4=8，PT=√8=2√2cm；8+49/4=81/4。2.83²=80089/10000=8.0089≠8，负2√2非长度。A两切点各90°，P角180−350/3=190/3°，不是175/3°。V半径3、T(3,0)，x=3垂距3，唯一(3,0)是切点；x=0交圆于(0,±3)，是割线；x=4垂距4>3无交点。都垂直OT所在横轴，不等于都在圆上端点处垂直。W有P(9/2,0)、T(7/2,0)、O(0,0)，PT=1cm，T在r=7/2的圆上且P外，OT与TP共线，1²+49/4≠81/4，未给相切不能拿√8当PT。',
    near
      ? 'T converts OT=25 mm=5/2 cm; OP=7/2 cm is the hypotenuse. PT²=49/4−25/4=6, hence PT=√6 cm and 6+25/4=49/4 checks back. Decimal 2.45 squares to 2401/400=6.0025, not 6: approximate only. Negative √6 is not a length. A has two 90° contact angles; TPS=180−250/3=290/3°, not 125/3°. V has radius 2 and T(2,0): line x=2 has distance 2 and sole contact (2,0); x=0 meets (0,±2), a secant; x=3 has distance 3>2 and no intersections. All are perpendicular to the horizontal radius line; only x=2 passes through its on-circle endpoint. W has O(0,0),P(7/2,0),T(5/2,0): PT=1 cm, with T on radius-5/2 circle and P external. OT and TP are collinear, not perpendicular; 1²+25/4≠49/4, so the tangent formula is unavailable.'
      : 'T converts OT=35 mm=7/2 cm and OP=9/2 cm. PT²=81/4−49/4=8, hence PT=√8=2√2 cm; 8+49/4=81/4 checks back. Decimal 2.83 squares to 80089/10000=8.0089, not 8; negative 2√2 is not a length. A has two right contact angles, so TPS=180−350/3=190/3°, not 175/3°. V has radius 3 and T(3,0). Line x=3 has distance 3 and sole contact (3,0); x=0 meets (0,±3); x=4 has distance 4>3 and no intersections. Each is perpendicular to the horizontal radius line, but only the first at the on-circle endpoint. W gives O(0,0),P(9/2,0),T(7/2,0), so PT=1 cm. T remains on the radius-7/2 circle and P external, but OT/TP are collinear. Since 1²+49/4≠81/4, do not assign √8 without tangency.',
  );
  table(q3, [
    [
      'T',
      '独立已知相切',
      'Separate given tangency',
      `PT在T相切；OT=${near ? 25 : 35}mm,OP=${near ? '7/2' : '9/2'}cm；候选小数${near ? '2.45' : '2.83'}cm`,
      `PT tangent at T;OT=${near ? 25 : 35}mm,OP=${near ? '7/2' : '9/2'}cm; decimal candidate ${near ? '2.45' : '2.83'}cm`,
    ],
    [
      'A',
      '独立两切线夹角',
      'Separate two-tangent angle',
      `PT/PS同圆同外点切线；小∠TOS=${near ? '250/3' : '350/3'}°`,
      `PT/PS tangent to one circle from one external P; minor TOS=${near ? '250/3' : '350/3'}°`,
    ],
    [
      'V',
      '独立逆判三直线',
      'Separate converse: three lines',
      `O(0,0),r=${near ? 2 : 3},T(${near ? 2 : 3},0);x=${near ? 2 : 3},x=0,x=${near ? 3 : 4}`,
      `O(0,0),r=${near ? 2 : 3},T(${near ? 2 : 3},0);x=${near ? 2 : 3},x=0,x=${near ? 3 : 4}`,
    ],
    [
      'W',
      '独立撤相切',
      'Separate tangency removed',
      `O(0,0),r=${near ? '5/2' : '7/2'}cm;P(${near ? '7/2' : '9/2'},0),T(${near ? '5/2' : '7/2'},0)；未给相切`,
      `O(0,0),r=${near ? '5/2' : '7/2'}cm;P(${near ? '7/2' : '9/2'},0),T(${near ? '5/2' : '7/2'},0); no tangency given`,
    ],
  ]);
  const q4 = card(
    4,
    'circle-inverse-sector-joint-change-and-own-proof-report',
    '① I由精确弧长先求整圆份额与所选扫角，再求该扇形面积、完整周长和互补小部分的弧/面积，逐项合回整圆；不先代3.14。② R独立由所给面积与扫角反求正半径并代回，不把负根当半径。③ J独立从I出发同时改半径和扫角，先推一般弧长倍率ab、面积倍率a²b，再求新角、新r、新弧长与面积并核所取范围；能只用半径平方倍率吗？整圆边界与弧/弦/弓形继续用旧题。④ 自选一个不同于表中参数的虚构纸上圆形区域，明示正半径与大扫角、算精确弧/面积和两部分边界；给自己选的外点距离与已知切线计算，写切点垂直依据。再亲画直径及内垂足，自己给合法长度，用直径角→AA→全部对应→比例写完整证明并回代。报告条件/单位/所取弧与一个撤前提失败例；纸图不是施工图，无需实测。一次只做一个编号。',
    '① From I’s exact arc length, recover the full-turn fraction and SELECTED sweep; then find sector area, complete perimeter and the complementary minor arc/area. Add each pair back to the whole circle without substituting 3.14. ② R independently gives area/sweep: recover the POSITIVE radius and substitute back. ③ J independently starts from I and changes BOTH radius and sweep. First derive general arc factor ab and area factor a²b, then calculate the new radius, sweep, arc and area with allowed ranges. Is radius-squared scaling alone sufficient? Retain the existing full-circle boundary and arc/chord/segment arguments. ④ DESIGN a different fictional circular region on paper: choose positive radius and a major sweep, calculate exact arcs/areas and both boundaries. Choose an external-point distance and GIVEN tangency for a length calculation, citing the contact perpendicular. DRAW a diameter and interior altitude foot, supply your own valid lengths, and write a full diameter-angle→AA→all correspondences→proportion proof, checking back. Report units, premises, selected arcs and a premise-removed failure example. This is a maths drawing, not construction guidance or a measurement task. One numbered part per sitting.',
    near
      ? 'I的整周9πcm，弧15π/2占5/6，θ=300°；面积(5/6)×81π/4=135π/8cm²，完整周长9+15π/2cm。余60°给弧3π/2、面积27π/8，分别合9π与81π/4。R有r²=(27/4)/(120/360)=81/4，r=9/2cm，代回面积27π/4。J的a=2,b=1/2，弧倍率1、面积倍率2；新r=9、θ=150°，弧仍15π/2cm、面积135π/4cm²，不能只乘4。自主报告接受其他合法参数；例可自选r=3cm、θ=240°，弧4π、面积6π、边界6+4π，余弧2π/面积3π/边界6+2π；选OP=5cm及同圆已知切点给PT=4cm。另直径AC=6、AD=2、B在圆上、BD⊥AC且D内：AA得ADB∼ABC，AD/AB=AB/AC给AB²=12、AB=2√3；DC=4，BD²=8、BD=2√2，正值和单位回核。须解释角来源与顺序，不把例子的数值强加孩子设计。可用N2撤共圆菱形或N3错误垂线作失败例。'
      : 'I整周15πcm，弧10π占2/3，θ=240°；面积(2/3)×225π/4=75π/2cm²，完整周长15+10πcm。余120°给弧5π、面积75π/4，分别合15π、225π/4。R有r²=(75/4)/(120/360)=225/4，正r=15/2cm，代回面积75π/4。J的a=3/2,b=2/3，弧倍率1、面积倍率3/2；新r=45/4、θ=160°，弧仍10π、面积225π/4cm²，不是只乘9/4。自主例可另取r=4cm、θ270°，弧6π、面积12π、边界8+6π，余弧2π/面积4π/边界8+2π；取OP=5cm及同圆已知切点，PT=3cm。另直径AC=8、AD=2、B在圆上、BD⊥AC且D内：AA得ADB∼ABC，AD/AB=AB/AC给AB²=16、AB=4；DC=6，BD²=12、BD=2√3，核正值、长度单位与全部对应。其他不同合法设计同样接受，不能只抄数值代解释；N2菱形或N3错误垂线可作撤前提失败例。',
    near
      ? 'I has circumference 9π cm. Arc 15π/2 is 5/6 of it, so the selected sweep is 300°. Sector area is (5/6)(81π/4)=135π/8 cm² and full perimeter 9+15π/2 cm. The complementary 60° gives arc 3π/2 and area 27π/8; sums recover 9π and 81π/4. R gives r²=(27/4)/(120/360)=81/4, hence positive r=9/2 cm; substitution restores 27π/4. J has a=2,b=1/2: arc factor 1, area factor 2. New r=9,θ=150° give unchanged arc 15π/2 and area 135π/4, not fourfold area. Accept other valid own designs. One example is r3,θ=240°: arc4π,area6π,perimeter6+4π; complementary arc2π,area3π,perimeter6+2π. With external OP=5 and GIVEN tangency, PT=4. For separate diameter AC=6,AD=2,on-circle B and interior perpendicular BD, AA gives ADB∼ABC and AD/AB=AB/AC, hence AB²=12,AB=2√3. DC=4 gives BD²=8,BD=2√2; check positive lengths/units and explain every angle and matching. Do not impose this example on the learner’s own design. N2’s rhombus or N3’s wrong-location perpendicular can provide a premise-removed failure example.'
      : 'I has circumference 15π cm; arc10π is 2/3, giving selected sweep240°. Sector area is (2/3)(225π/4)=75π/2 cm² and perimeter15+10π cm. The complementary120° gives arc5π and area75π/4; pairs sum to15π and225π/4. R gives r²=(75/4)/(120/360)=225/4, positive r=15/2 cm, restoring area75π/4. J has a=3/2,b=2/3, hence arc factor1 and area factor3/2. New r=45/4,θ=160° give arc10π and area225π/4, not a radius-only factor9/4. One different own example is r=4,θ=270°: arc6π,area12π,perimeter8+6π; complement arc2π,area4π,perimeter8+2π. External OP=5 with GIVEN tangency gives PT=3. For separate diameter AC=8,AD=2,on-circle B and interior perpendicular BD, AA gives ADB∼ABC; AD/AB=AB/AC yields AB²=16,AB=4. DC=6 gives BD²=12,BD=2√3. State all correspondences, angle premises, positive lengths and units. Other valid own designs are accepted; copied numbers alone are insufficient. N2’s rhombus or N3’s wrong-location perpendicular supplies a premise-removed failure example.',
  );
  table(q4, [
    [
      'I',
      '独立由弧逆求',
      'Separate arc inverse',
      `r=${near ? '9/2' : '15/2'}cm;所选弧l=${near ? '15π/2' : '10π'}cm`,
      `r=${near ? '9/2' : '15/2'}cm; selected arc l=${near ? '15π/2' : '10π'}cm`,
    ],
    [
      'R',
      '独立由面积逆求半径',
      'Separate radius from area',
      `θ=120°;S=${near ? '27π/4' : '75π/4'}cm²`,
      `θ=120°;S=${near ? '27π/4' : '75π/4'}cm²`,
    ],
    [
      'J',
      '独立从I同时改变',
      'Separate joint change from I',
      `半径倍率a=${near ? '2' : '3/2'}；扫角倍率b=${near ? '1/2' : '2/3'}`,
      `radius factor a=${near ? '2' : '3/2'}; sweep factor b=${near ? '1/2' : '2/3'}`,
    ],
  ]);
  return {
    id: `${unit}-MAINT-CIRCLE-GEOMETRY-MEANING`,
    unit,
    bridge: 'J95-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 2, 3, 4].map((n, i) => [id(i + 1), `J95-L0${n}`]),
    ),
    title: t(
      '圆的距离、截弧推导与逆向模型',
      'Circle distances, arc derivations and inverse models',
    ),
    intro: t(
      '四张独立纸笔卡，每次一编号或案例，可分次、不计时、口述或熟悉语言。亲画、逆求与给反例后人工核验，读题帮助与数学提示分开。原十题与解析几何旧题及记录保留；全部虚构，无需购买、实测、出行或上传。',
      'Four independent paper cards, one numbered part or case per untimed sitting. Oral/familiar-language work is welcome. Draw, reverse-calculate and construct counterexamples before human review; separate reading help from mathematical hints. Original ten tasks, analytic-geometry tasks and records remain. Fictional work needs no purchase, measurement, travel or upload.',
    ),
    questions: [q1, q2, q3, q4],
  };
};
export const circleGeometryMeaningRetrieval = {
  H22_CIRCLE_GEOMETRY_MEANING: makeSet('H22'),
  H23_CIRCLE_GEOMETRY_MEANING: makeSet('H23'),
};
