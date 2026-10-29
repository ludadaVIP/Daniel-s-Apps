import { t } from '../model';
const pair = (i: number) =>
  ['H22', 'H23'].map((u) => `${u}-MAINT-SIM-CIRCLE-TRIG-Q${i}`);
const supplements: Record<string, number[]> = {
  'J94-L01': [1, 3],
  'J94-L02': [2],
  'J94-L03': [1],
  'J94-L04': [3],
  'J94-L05': [4],
  'J95-L01': [1],
  'J95-L02': [2],
  'J95-L03': [3],
  'J95-L04': [4],
  'J95-L05': [2, 4],
  'J96-L01': [1],
  'J96-L02': [1],
  'J96-L03': [2],
  'J96-L04': [2],
  'J96-L05': [3],
};
const extra: Record<string, ReturnType<typeof t>> = {
  'J96-L01': t(
    ' 新N1由等边垂高与等腰直角实际推30/45/60度全部精确比、有理化与小数平方区别，再以互余和换腿说明sin/cos互换、tan互为正倒数；原一般AA继续用。',
    ' New N1 derives all exact 30/45/60-degree ratios from an equilateral altitude and isosceles right triangle, checks rationalisation versus decimal squares, and explains complementary sine/cosine swapping and reciprocal positive tangents. Original general AA remains.',
  ),
  'J96-L02': t(
    ' 共享N1独立cos给斜边求邻腿、tan给对腿反求分母，分数三边完整乘回；两案例不拼接，原O8的全部比与反求斜边保留。',
    ' Shared N1 independently recovers the adjacent leg from cosine/hypotenuse or tangent/opposite, gives complete fractional side triples and checks back without merging cases. Original O8 ratios and hypotenuse inverses remain.',
  ),
  'J96-L03': t(
    ' 共享N2实算精确1/2/1与指定0.5000/1.0000，给sin或cos倍角非倍值反例；tan85/80窗外数值与仅扩纵窗分开，严格端点和tan=1/6/5合法逐核。',
    ' Shared N2 distinguishes exact 1/2 or 1 from required four-place forms, gives actual sine/cosine nonlinear-doubling counterexamples, separates off-window tan85/80 from a display-window change, and audits strict endpoints plus valid tangent ratios 1 and 6/5.',
  ),
  'J96-L04': t(
    ' 新N2混m/cm以sin反求，再独立同数cos角和互余核验；实际RAD近似显示乘180/π、反函数与倒数、严格单调唯一性及三个函数0/1/6/5/负比完整审查，不把sin/cos上界套tan。',
    ' New N2 converts mixed m/cm for inverse sine, independently inverts the same number as cosine and checks complementarity, converts actual approximate RAD displays, and audits inverse/reciprocal, acute uniqueness and ratios 0/1/6/5/negative for all three functions without transferring sine/cosine bounds to tangent.',
  ),
  'J96-L05': t(
    ' 新N3实算同数水平/视线两模型的水平、升高、顶高与含基面树高，保根式至最后舍入；提前tan30取0.6改变答案，撤基面亲画同观测双正高，自主不同测量卡/坡图/失败例；旧约束强题保留。',
    ' New N3 computes horizontal/rise/top/full-height quantities for equal-number horizontal/sight models with base corrections, retaining radicals until final rounding. Premature tan30 rounding changes the answer. It draws two positive heights with identical observations after removing the base premise, and requires own measurement/slope cards and a failure example; original constraint work remains.',
  ),
  'J95-L01': t(
    ' 新圆几何N1统一分数半径与mm垂距求半/全弦，亲画圆定义与直径包含，实际同斜长半径却有两交点反驳斜距/有限线段误判；分数圆心角求底角及反求、180退化另审。',
    ' New circle-geometry N1 unifies fractional radius/mm distance for half/full chords, draws the definition and diameter inclusion, and gives actual equal-radius sloping segments on a secant to refute nonperpendicular-distance/finite-segment shortcuts. Fractional central/base-angle inverses and the 180° degeneration are audited separately.',
  ),
  'J95-L02': t(
    ' 新N2用同圆位置分别求等腰底角，以相加/相减两布局推同角；选定大扫角两侧换弧及共圆截弧证明、撤共圆凸菱形反例。直接复用H37/H38解析Q4实际直径角轨迹、内外点及零向量端点，主桥H36-L04不改。',
    ' New N2 derives the same inscribed angle by equal-radii addition/subtraction layouts, audits major sweeps and proves cyclic supplementation with a convex-rhombus counterexample after removing concyclicity. Reused H37/H38 analytic Q4 requires the diameter-angle locus, actual inside/outside points and zero-vector endpoints; its H36-L04 bridge remains.',
  ),
  'J95-L03': t(
    ' 新N3混mm/cm和分数OP求精确正根、亲核小数平方差；两切点直角推分数P角；三条实际垂线区分切点逆判与错位置割/离线；撤相切保坐标得不同长度，不偷加直角。',
    ' New N3 converts mm/cm with fractional OP for exact positive roots and decimal-square residuals, derives fractional tangent angles from both contacts, distinguishes three actual perpendicular lines for the contact converse, and computes a different length from retained coordinates after tangency is removed.',
  ),
  'J95-L04': t(
    ' 新N4由精确弧逆求大扫角、面积和互补部分合整圆，独立由面积逆求正半径；同时变半径a和角b推ab/a²b并实算，自主设计纸上圆区而不只抄固定数值。',
    ' New N4 recovers major sweep from exact arc, computes area/complement checks, independently recovers a positive radius from area, derives and calculates ab/a²b for joint radius/sweep changes, and requires an own paper design rather than copying fixed numbers.',
  ),
  'J95-L05': t(
    ' 共享N2给共圆对角弧证明与撤前提凸菱形；共享N4自主选圆区/切线与直径内垂足合法尺寸，写角依据→AA全对应→比例的自由报告及失败例。原O7完整相似链不重创。',
    ' Shared N2 proves cyclic opposite-angle supplementation and draws a premise-removed convex rhombus. Shared N4 requires own circular-region/tangent/diameter-altitude data with a complete angle→ordered AA→proportion report and failure example. The original O7 full similarity proof remains.',
  ),
  'J94-L01': t(
    ' 新N1在FDE/EFD对应下统一mm/cm，算2/3或3/4缩小比及全反向、正求/反求边再乘回，分开k1/0/负长度比；共享N3实算非均匀矩形并核两种长宽配对，旧旋转反射与全对应继续用。',
    ' New N1 converts mm/cm under FDE/EFD matching,computes reduction factors2/3 or3/4 and all inverses,then solves forward/reverse sides and multiplies back. It separates1/zero/negative proposed length factors. Shared N3 computes nonuniform rectangles and audits both side matchings,while original rigid-pose/full-correspondence arguments remain.',
  ),
  'J94-L02': t(
    ' 新N2在非直角两角例主动求第三角/倍率，明确AAA不定大小；实际两边同向比例与夹角SAS、三比SSS、只改第三边的不同倍率逐核，不把判据名称或两条方便比当证明。原两分支SSA继续复用。',
    ' New N2 computes third angles/scales from nonright AA cases,then audits actual proportional-side/included-angle SAS,all-three-ratio SSS and a changed third ratio. Criterion names or two convenient ratios are insufficient. Original two-branch SSA proofs remain reused.',
  ),
  'J94-L03': t(
    ' 共享N1先由AD+DB补整AB，分数小/大及全反向求AE/DE/EC，比较AD/DB；另撤相似后亲画两目标保同已知却未知边不同，数值不足不假成比例。原平行AA强证明保留。',
    ' Shared N1 reconstructs whole AB from AD+DB before fractional small/large and inverse ratios for AE,DE,EC. It draws two nondegenerate targets with identical insufficient givens but different unknown sides. The original parallel-AA proof remains.',
  ),
  'J94-L04': t(
    ' 新N3实际数1cm²小格和原面积块，分别算周长/面积/两种倍率；已知相似的分数面积比反求正长度及尺寸，根式小数精确平方审查；非均匀周长另算、自创同面积不同形并核两种矩形配对。',
    ' New N3 counts unit cells versus original-area blocks and separates perimeters,areas and both factors. It reverses fractional area ratios under similarity,checks radical decimal squares,computes nonuniform perimeter ratios and designs an equal-area nonsimilar rectangle with both matchings audited.',
  ),
  'J94-L05': t(
    ' 新N4自主纸图/逆求图cm与同步像素条，直线/折线路程分开；原框等比/拉伸/裁留三操作算尺寸面积，同一最终框却圆/椭圆不同；混cm/m影长先AA后算高，撤共光亲画同影异高反例，汇成虚构报告。旧单处透视标定证明继续用。',
    ' New N4 draws a map,recovers map cm and rescales pixel bars,separates straight/bent-route length,and calculates uniform/stretch/crop dimensions and areas. Equal final frames can contain circular versus elliptical retained motifs. Mixed-unit shadows require AA;after removing common light,it draws equal-shadow/different-height counterexamples and reports fictional sources. Original perspective-calibration arguments remain.',
  ),
};
const e = (
  skill: string,
  l: string,
  targets: string[],
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
    ...targets,
    ...['H22', 'H23'].flatMap((u) =>
      (supplements[l] ?? []).map(
        (n) =>
          `${u}-MAINT-${l.startsWith('J96-') ? 'TRIG' : l.startsWith('J95-') ? 'CIRCLE-GEOMETRY' : 'SIMILARITY'}-MEANING-Q${n}`,
      ),
    ),
    ...(l === 'J95-L02'
      ? ['H37-MAINT-ANALYTIC-GEOMETRY-Q4', 'H38-MAINT-ANALYTIC-GEOMETRY-Q4']
      : []),
  ],
  rationale: t(rz + (extra[l]?.zh ?? ''), re + (extra[l]?.en ?? '')),
});
export const similarityCircleTrigRecurrence = [
  e(
    'similarity-correspondence',
    'J94-L01',
    pair(1),
    '同向对应与正倍率',
    'Consistent correspondence and positive scale',
    '两组ABC∼DFE按A/D、B/F、C/E给目标/原图倍率3/2或2，算对应边9/2与6或10与24，再反向全部2/3或1/2。反射旋转不按屏幕重命名，k1允许，比例无单位且不混方向。',
    'Both order ABC∼DFE by A/D,B/F,C/E and target/original scale 3/2 or two, deriving sides 9/2,six or ten,twenty-four. Reversing every ratio gives 2/3 or 1/2. Rigid poses do not rename points, k=1 is allowed and scale is unitless with consistent direction.',
  ),
  e(
    'similarity-evidence',
    'J94-L02',
    [...pair(1), 'H05-MAINT-CONG-MOTION-Q2', 'H06-MAINT-CONG-MOTION-Q2'],
    'AA充分与SSA一般不足',
    'AA sufficiency and general SSA insufficiency',
    'H22/H23由已知A=D、C=E直角明确AA得相似及第三角；另复用H05/H06的两SSA非退化分支AC=3√3±√7或5√3±√11。固定两边同长却第三边不同，若相似比只能1便矛盾，否定任意SSA充分，不否定另有特殊前提。',
    'H22/H23 explicitly derive AA from given A=D and right C/E, then the third angle. H05/H06 supply two nondegenerate SSA alternatives AC=3√3±√7 or 5√3±√11. Equal fixed side pairs would force similarity scale one, contradicting unequal third sides. This refutes general SSA sufficiency without denying extra-premise special cases.',
  ),
  e(
    'similarity-side-proportion',
    'J94-L03',
    pair(2),
    '嵌套图角依据与完整比例',
    'Nested angle premises and full proportions',
    '两处D∈AB、E∈AC且DE∥BC，A共角与对应角给ADE∼ABC，完整AD/AB=AE/AC=DE/BC为3/5或4/7，算DE6/8cm并保同向对应，不从外观跳相似。',
    'Both use D on AB,E on AC and DE∥BC, citing common A and corresponding angles for ADE∼ABC. Full AD/AB=AE/AC=DE/BC ratios 3/5 or 4/7 give DE six/eight cm, retaining direction and angle evidence rather than appearance.',
  ),
  e(
    'similarity-area-square',
    'J94-L04',
    pair(2),
    '对应底高平方倍率与非均匀反例',
    'Squared base-height scale and nonuniform caution',
    '两组亲作对应垂高，底与高均乘k，面积变9S/25或16S/49；另横2纵3矩形面积6倍不自动保证相似或统一对应比，保前提而不把面积比当长度比。',
    'Both construct corresponding perpendicular heights, scaling base and height by k for areas 9S/25 or 16S/49. A rectangle with horizontal/vertical factors two/three has sixfold area without automatically guaranteeing similarity or one corresponding scale. Area and length ratios remain distinct.',
  ),
  e(
    'similarity-model-premises',
    'J94-L05',
    pair(2),
    '印图单位、同步比例条与局部标定',
    'Printed units, synchronous bars and local calibration',
    'H22印图1:25000路线4cm转1km，H23的1:40000路线3cm转6/5km；屏幕放2或3/2倍仍同实长，须同步比例条。若套印图尺错成2或9/5km，斜拍单处尺也不能保证全局各向倍率，说明模型假设而非只套比例。',
    'H22 converts four cm at 1:25000 to one km; H23 converts three cm at 1:40000 to 6/5 km. Screen zoom two or 3/2 retains real length and requires the synchronous bar. Reusing the printed ruler wrongly gives two or 9/5 km, and one local ruler in perspective cannot certify global directional scale.',
  ),
  e(
    'circle-chord-contact',
    'J95-L01',
    pair(3),
    '垂弦全等、直径退化与整线距离',
    'Chord congruence, diameter degeneration and whole-line distance',
    'H22半径5弦6、H23半径13弦10，以公共OM和同圆半径斜边HL证半弦3/5，再求OM4/12。OM0直径直接中点不套退化HL；任意线点OX²=d²+MX²说明d与r比较的0/1/2交点，有向位置和非负距离分开，不依有限图窗。',
    'H22 uses radius five/chord six and H23 radius thirteen/chord ten. HL from common OM and radius hypotenuses proves half-chords three/five, then OM four/twelve. At OM=0 use the diameter midpoint, not degenerate HL. OX²=d²+MX² gives zero/one/two line intersections from d versus r, separating signed positions from nonnegative distances and finite windows.',
  ),
  e(
    'circle-intercepted-arc',
    'J95-L02',
    pair(4),
    '不含顶点的弧与同异侧',
    'Vertex-excluding arcs and same/opposite sides',
    '两组小弧100/140、大弧260/220，P/R在大弧得圆周角50/70，Q在小弧得130/110，均先标不含顶点的弧。同侧同弧等角、异侧总180，旋转保身份，顶点离圆或与端点重合不能直接套。',
    'Minor/major arcs 100/260 or 140/220 give P/R angles fifty/seventy and opposite Q angles 130/110 after labelling arcs excluding vertices. Same-side equality and opposite-side 180° follow from the arcs; rotation preserves identity, while off-circle or endpoint vertices cannot use the rule.',
  ),
  e(
    'circle-tangent-premises',
    'J95-L03',
    pair(5),
    '同外点同圆切线段的HL证明',
    'HL proof for same-point same-circle tangent segments',
    '两处同外点P、同圆不同切点T/S先由相切得两直角，共OP斜边、半径相等HL证明PT=PS；r6/OP10得8，r8/OP17得15。缺相切、换圆/外点或P在圆上不保此非退化证明，比较有限线段而非无限直线。',
    'Both use given same-circle tangency at T/S from one external P for right angles, common OP hypotenuse and equal radii, proving PT=PS by HL. Radius/OP six/ten yields eight; eight/seventeen yields fifteen. Missing tangency, another circle/point or on-circle P removes premises. The comparison concerns segments, not infinite lines.',
  ),
  e(
    'circle-sector-fraction',
    'J95-L04',
    pair(6),
    '整圆份额、外边界及图形身份',
    'Whole-circle fractions, outer boundary and figure identity',
    'r6θ150给弧5πcm、面积15πcm²、周长5π+12；r10θ72给4π、20π、4π+20。由θ/360分别乘整圆周长/面积，区分弧弦、扇形弓形；360时半径为内缝不加，0亦退化，l+2r限定0<θ<360。',
    'Radius six/angle150 gives arc5π cm,area15π cm²,perimeter5π+12; ten/72 gives4π,20π,4π+20. The θ/360 fraction multiplies whole circumference/area separately. Both distinguish arc/chord and sector/segment, omit internal radii for a full circle and restrict l+2r to 0<θ<360, with zero also degenerate.',
  ),
  e(
    'circle-proof-dependency',
    'J95-L05',
    pair(7),
    '直径角、辅助高与自由理由链',
    'Diameter angles, constructed altitude and free proof chain',
    '两组BC直径且A在圆上先得A直角，AB/AC6/8或5/12求BC10/13；构造AD垂直、D在BC给AA的ABD∼CBA，再列比求BD、AD、DC及核正量单位。任意E不能无依据加共圆，卡片合法先后不等于完整自由证明。',
    'Both use diameter BC and on-circle A for the large right angle, then legs six/eight or five/twelve for BC ten/thirteen. Constructed AD and D on BC give ordered AA ABD∼CBA, deriving BD,AD,DC with positive quantities and units. Arbitrary E gains no concyclicity premise; valid card order does not replace a complete free proof.',
  ),
  e(
    'trig-sine-correspondence',
    'J96-L01',
    pair(8),
    '同锐角AA与换参照边身份',
    'Same-acute-angle AA and changing reference roles',
    '两直角三角形同锐角给AA，对应O/A/H同乘正k，三商消k。H22以5/12/13、H23以8/15/17分别换A/B参照，O邻腿互换而H仍对直角，缺直角不能直接套本课边比。',
    'Two right triangles sharing an acute angle give AA; positive k multiplies O/A/H and cancels from ratios. H22 uses5/12/13 and H23 uses8/15/17 to switch A/B references, swapping opposite/adjacent legs while the hypotenuse remains opposite the right angle. Absent that premise, these side formulas do not apply directly.',
  ),
  e(
    'trig-cosine-tangent-sides',
    'J96-L02',
    pair(8),
    '三边比及未知分母反求',
    'Three ratios and solving an unknown denominator',
    'H22生成A的5/13、12/13、5/12和B互换，H23生成8/17、15/17、8/15和互换；邻直角边不包括斜边。新同角对边6/10由sin反求H78/5或85/4，不能固定“乘sin”，保原比例及单位。',
    'H22 generates sine/cosine/tangent5/13,12/13,5/12 and switched B ratios; H23 uses8/17,15/17,8/15 and switches. Adjacent leg excludes the hypotenuse. New opposite lengths six/ten give hypotenuse78/5 or85/4 by solving the sine denominator, not blindly multiplying, with original ratios and units retained.',
  ),
  e(
    'trig-acute-domain-variation',
    'J96-L03',
    pair(9),
    '锐角投影单调与正分母边界',
    'Acute projection monotonicity and denominator boundaries',
    '两处固定H以O增/A减说明sin增cos减，并用O2/A2>O1/A2>O1/A1证tan增；tan60=√3>1，90邻边0未定义不钳大数。明确0<θ<90与sin/cos严格0..1，本题锐角域不被H04一般角定义取消，曲线有限采样非一般证明。',
    'Both use fixed H with increasing O/decreasing A for sine/cosine variation and O2/A2>O1/A2>O1/A1 for increasing tangent. tan60=√3 exceeds one; at90 the adjacent denominator vanishes rather than becoming a large clipped value. Acute restrictions and strict sine/cosine bounds remain despite H04 general-angle definitions; finite curves do not prove the general claim.',
  ),
  e(
    'trig-inverse-degree-precision',
    'J96-L04',
    pair(9),
    '统一单位、锐角反函数与最终舍入',
    'Unified units, acute inverse functions and final rounding',
    'H22对9cm/邻120mm化9/12得tan3/4，H23的50cm/1.2m化0.5/1.2得5/12；DEG反函数角36.9/22.6到0.1°，中途不截断，反函数非倒数。sinθ1.2超界、cosθ0为被排90需审数据，不硬用计算器。',
    'H22 converts opposite9cm/adjacent120mm to9/12 for tangent3/4; H23 converts50cm/1.2m to0.5/1.2 for5/12. DEG inverse tangent gives36.9/22.6° to0.1° without intermediate truncation, not reciprocal values. A sine ratio1.2 or cosine0 at excluded90° requires a model/data audit.',
  ),
  e(
    'trig-height-gradient-premises',
    'J96-L05',
    pair(10),
    '坡度角度斜长与测高基面',
    'Gradient, angle, slope length and height datum',
    '两坡3/4/5与5/12/13分别给75%/36.9°/5m、125/3%/22.6°/13m，类别单位分开。另同水平仪器1.2/1.5、水平距4/12及精确tan3/4或5/12求目标4.2/6.5m，独立于坡高；斜距/基面差要改关系，零水平距未定义、200%可为锐坡。',
    'Ramps3/4/5 and5/12/13 yield75%/36.9°/5m or125/3%/22.6°/13m, keeping quantity types and units separate. Independent level-base height tasks add instruments1.2/1.5 to rises from horizontal4/12 and exact tangents3/4 or5/12 for targets4.2/6.5m. Slanted distance/base differences change the relation; zero run is undefined and200% can be acute.',
  ),
  e(
    'integration-geometry-algebra',
    'J98-L01',
    ['H05-MAINT-CONG-MOTION-Q8', 'H06-MAINT-CONG-MOTION-Q8'],
    '面积结构的一般依据与数值核例',
    'General area structure before numerical checks',
    '复用H05/H06的四同块两种重排：先证明同(a+b)外框、同四块无叠缺及中央角，推出一般c²=a²+b²，再代5/12和8/15核例，并明确几次数值不证明一般式。须把几何块与代数项对应，不只是代入某x碰巧相等。',
    'H05/H06 reuse four-piece rearrangements: equal(a+b)frames,matching nonoverlapping pieces and central angles establish general c²=a²+b² before5/12 or8/15 numerical checks. Both explicitly reject finite trials as general proof and require geometric pieces to match algebraic terms rather than coincidental substitution.',
  ),
  e(
    'integration-ramp-constraints',
    'J98-L05',
    pair(10),
    '改宽与全长缩放后的逐项约束',
    'Width-only versus all-length scaling with every constraint checked',
    'H22原坡面积10费120，仅宽3得15/180，全长2倍得40/480但h6>4、r8>6；H23原26/260，仅宽4得52/520，全长3/2倍得117/2与585但h15/2>6、r18>15。两处逐项核侧面长度、坡度、面积k²、定单价费及原高度/水平约束，不由坡度不变推一切合规。',
    'H22 starts area10/cost120,width-only three gives15/180,all lengths×2 gives40/480 but violates h6>4,r8>6. H23 starts26/260,width-only four gives52/520,all×3/2 gives117/2 and585 but violates h15/2>6,r18>15. Both track side lengths,unchanged gradient,k² area,area-rate cost and original height/run limits rather than treating unchanged slope as complete feasibility.',
  ),
];

for (const entry of similarityCircleTrigRecurrence) {
  if (entry.sourceLesson === 'J98-L01' || entry.sourceLesson === 'J98-L05') {
    const n = entry.sourceLesson === 'J98-L01' ? 1 : 2;
    entry.targets.push(
      ...['H28', 'H38'].map((u) => `${u}-MAINT-INTEGRATION-MEANING-Q${n}`),
    );
    if (n === 1)
      entry.targets.push(
        ...['H28', 'H38'].map((u) => `${u}-MAINT-INTEGRATION-AUDIT-Q2`),
      );
    entry.rationale = t(
      entry.rationale.zh +
        (n === 1
          ? ' 新N1主动分数矩形自身平方/长条与四外边、展开指定形式/当前值、d0/代数与正长度域、单次吻合的反例及固定d只改x与全长度倍率实算。'
          : ' 新N2独立坡道三限制先证明侧面被迫唯一，正面积/费用平方精确比较；显示到分恰等限额仍可能真超限，只改宽仍面积合格但预算失败，自主完整满足/近失两报告与模型范围，存取不当审核。'),
      entry.rationale.en +
        (n === 1
          ? ' New N1 generates the fractional rectangle’s own square/strip and four-side rules, requested expansion versus current values, d0 and algebraic/positive-length domains, a counterexample to one-match identity, and actual fixed-d versus whole-length scaling.'
          : ' New N2 first proves side uniqueness from three restrictions, then compares positive exact squared areas/costs. A cent display equal to budget can hide exact excess; width-only change can pass area but fail budget. Own feasible/near-miss reports retain every constraint and scope; storage is not review.'),
    );
  }
}
