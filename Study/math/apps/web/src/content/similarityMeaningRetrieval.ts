import { t, type Question } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'H22' | 'H23') => {
  const near = unit === 'H22',
    id = (n: number) => `${unit}-MAINT-SIMILARITY-MEANING-Q${n}`;
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
        '先标相似的依据和顶点对应，统一单位与倍率方向；整边、剩余段、周长、实际面积与面积比是不同量。条件不足时画满足原已知的两个反例，不从图中偷加相似。',
        'Mark similarity premises and vertex correspondence,then unify units and scale direction. Whole sides,leftovers,perimeter,actual area and area ratio are different quantities. For insufficient evidence,draw two models satisfying the original givens rather than importing similarity from appearance.',
      ),
      t(
        '一次一个编号或独立案例，可分次不计时、口述/熟悉语言。先亲画/求值/解释，再逐项人审；读题帮助与数学提示分开，自主设计不要求抄作者。全部为虚构纸上资料，不需购买、实测、出行或上传。',
        'One numbered part or independent case per untimed sitting. Oral/familiar-language reasoning is welcome. Draw,calculate and explain before human review. Separate reading help from mathematical hints;own designs need not copy the author. All data are fictional paper conditions,requiring no purchases,measurements,travel or uploads.',
      ),
    ]);
  type Row = [string, string, string, string, string];
  const table = (q: Question, rows: Row[]) => {
    q.contextTable = {
      caption: t(
        '各编号独立；图均为非退化平面模型，长度/面积单位分别保留。只用明确给定条件；图的朝向、缩放、未标外观不补数学前提。',
        'Labelled cases are independent nondegenerate plane models. Retain length/area units separately. Use only explicit givens;orientation,zoom and unmarked appearance supply no extra premises.',
      ),
      columns: [
        t('编号', 'ID'),
        t('对象', 'Object'),
        t('原条件', 'Original conditions'),
      ],
      rows: rows.map(([k, z, en, v, ve]) => [t(k, k), t(z, en), t(v, ve)]),
    };
  };
  const order = near ? 'FDE' : 'EFD',
    sourceAB = near ? '6' : '8',
    targetMM = near ? '40' : '60',
    sourceBC = near ? '15/2' : '10/3',
    targetCA = near ? '7/3' : '5',
    ad = near ? '3/2' : '5/2',
    db = near ? '1' : '3/2',
    ac = near ? '10/3' : '24/5',
    bc = near ? '25/6' : '32/3';
  const q1 = card(
    1,
    'similarity-reduction-reverse-and-whole-sides',
    '① T先按给定三角形次序列全部顶点/边/角对应，统一mm与cm，再求目标/原图及反向倍率，求目标中对应BC的边和原CA，逐项乘回。反求原边为何不是再乘一次？旋转反射不改点名；单一边对只能给候选倍率，不能独自证明相似。另将倍率设为1、0、负数，哪些属于本课正长度相似，负数能否直接作长度比？② N由共角和平行线给AA及次序，先由AD、DB补整AB，再给小/大与大/小全部比例、AE、DE和EC，核长度单位与大小方向。AD/DB为何不是小/大？③ I独立撤去相似和角条件，保表内三条长度。画两个满足全部已知而目标未知边不同的非退化三角形，说明条件不足，不仅写一个名称。旧两题的一般角依据与完整比继续使用。',
    '① For T,list EVERY vertex/side/angle correspondence in the stated order. Convert mm/cm,find target/source AND reverse scale,and compute the target side matching BC plus original CA. Multiply back. Why divide rather than multiply again for a source side? Rotation/reflection retain names;one side pair gives a candidate scale without proving similarity. Audit factors1,0 and negative values under this lesson’s positive-length similarity. ② For N,use the common angle and parallel lines for AA/order. Recover WHOLE AB from AD,DB before writing all small/large and inverse ratios. Find AE,DE,EC,checking units and enlargement/reduction direction. Why is AD/DB not the triangle scale? ③ I independently removes similarity/angle premises but keeps its three lengths. DRAW two nondegenerate targets meeting ALL givens with different unknown sides,proving insufficiency rather than just naming it. Keep the original tasks’ general angle and proportion arguments.',
    near
      ? 'T为A↔F,B↔D,C↔E，AB↔FD、BC↔DE、CA↔EF，角同对应。40mm=4cm，目标/原图FD/AB=DE/BC=EF/CA=2/3，反向全3/2。DE=(15/2)(2/3)=5cm，CA=(7/3)/(2/3)=7/2cm，乘回EF=7/3，不能再乘成14/9。k1相似且全等，k=0压成点，不属本课非退化相似，负号不能直接作正长度之比；反射本身不需负长度比。N整AB=3/2+1=5/2，共角A、DE∥BC给∠ADE=∠ABC，AA得ADE∼ABC。AD/AB=AE/AC=DE/BC=3/5，反向全5/3，AE=2、DE=5/2、EC=10/3−2=4/3cm。AD/DB=3/2比的是小段/余段，不是整边。I只知AB6、BC15/2、FD4，目标可取F(0,0),D(4,0),E(4,3)或E(4,6)，DE分别为3cm、6cm，都保FD4且非退化，故不能由4/6推出唯一DE5。源图可取A(0,0),B(6,0),C(6,15/2)，满足仅给的两边；I不沿用T的相似或其他边。'
      : 'T为A↔E,B↔F,C↔D，AB↔EF、BC↔FD、CA↔DE，角同对应。60mm=6cm，EF/AB=FD/BC=DE/CA=3/4，反向全4/3。FD=(10/3)(3/4)=5/2cm，CA=5/(3/4)=20/3cm，乘回DE5，不能再乘成15/4。k1相似且全等，0退化、负数非本课正长度比，反射不靠负长度。N整AB=5/2+3/2=4，共角及平行线给AA、ADE∼ABC。小/大各5/8，反向各8/5，AE=(24/5)(5/8)=3、DE=(32/3)(5/8)=20/3、EC=24/5−3=9/5cm。AD/DB=5/3不是小整边/大整边。I只知AB8、BC10/3、EF6，可取E(0,0),F(6,0),D(6,2)或D(6,4)，FD分别为2cm、4cm，数值不同，均保EF6和非退化，不能强推FD5/2。源A(0,0),B(8,0),C(8,10/3)符合仅给两边；I不借T相似或其他边。',
    near
      ? 'T matches A/F,B/D,C/E;AB/FD,BC/DE,CA/EF and the corresponding angles. Convert40mm=4cm. FD/AB=DE/BC=EF/CA=2/3;EVERY reverse ratio is3/2. DE=(15/2)(2/3)=5cm;CA=(7/3)/(2/3)=7/2cm,which scales back to EF7/3. Multiplying again would wrongly give14/9. Factor1 gives similarity/congruence;zero collapses the triangle,and negative numbers are not these positive length ratios. Reflection needs no negative lengths. In N,AB=3/2+1=5/2. Common A and corresponding angles from DE∥BC give AA,ADE∼ABC. All small/large ratios are3/5,all inverses5/3. AE2,DE5/2,EC4/3cm. AD/DB=3/2 compares a part to a leftover,not whole corresponding sides. I supplies ONLY AB6,BC15/2,FD4. Targets F(0,0),D(4,0),E(4,3) or E(4,6) retain FD4 but give DE3 or6cm. Source A(0,0),B(6,0),C(6,15/2) meets its two givens. Both targets are nondegenerate;I cannot import T’s similarity/other side lengths,so DE is not uniquely5.'
      : 'T matches A/E,B/F,C/D,with AB/EF,BC/FD,CA/DE and matching angles. Convert60mm=6cm. All target/source ratios are3/4;all inverses4/3. FD=(10/3)(3/4)=5/2cm;CA=5/(3/4)=20/3cm,scaling back to DE5. Multiplying again wrongly gives15/4. Factor1 is similar/congruent;zero is degenerate,and negative numbers are not positive length ratios. Reflection does not require negative lengths. In N,AB=5/2+3/2=4. Common A and parallel-line angles give AA,ADE∼ABC. Small/large ratios5/8,inverses8/5 give AE3,DE20/3,EC9/5cm. AD/DB=5/3 is not a whole-side ratio. I supplies ONLY AB8,BC10/3,EF6. Targets E(0,0),F(6,0),D(6,2) or D(6,4) retain EF6 but give FD2 or4cm. Source A(0,0),B(8,0),C(8,10/3) meets its two givens. The nondegenerate alternatives prove insufficiency without importing T’s similarity/other sides.',
  );
  table(q1, [
    [
      'T',
      '已给相似，混合单位',
      'Given similarity,mixed units',
      `△ABC∼△${order}; AB=${sourceAB}cm,${order.slice(0, 2)}=${targetMM}mm,BC=${sourceBC}cm,${order[0]}${order[2]}=${targetCA}cm`,
      `△ABC∼△${order}; AB=${sourceAB}cm,${order.slice(0, 2)}=${targetMM}mm,BC=${sourceBC}cm,${order[0]}${order[2]}=${targetCA}cm`,
    ],
    [
      'N',
      '独立嵌套',
      'Separate nested case',
      `D∈AB,E∈AC,DE∥BC;AD=${ad},DB=${db},AC=${ac},BC=${bc}cm`,
      `D∈AB,E∈AC,DE∥BC;AD=${ad},DB=${db},AC=${ac},BC=${bc}cm`,
    ],
    [
      'I',
      '独立条件不足',
      'Separate insufficient case',
      `只知AB=${sourceAB}cm,BC=${sourceBC}cm,${order.slice(0, 2)}=${targetMM}mm；未给相似或角条件`,
      `ONLY AB=${sourceAB}cm,BC=${sourceBC}cm,${order.slice(0, 2)}=${targetMM}mm;no similarity/angle premises`,
    ],
  ]);
  const a = near ? '4' : '6',
    b = near ? '6' : '9',
    ta = near ? '6' : '4',
    tb = near ? '9' : '6',
    angle = near ? '60' : '50';
  const q2 = card(
    2,
    'proportional-triangle-criteria-and-scope',
    '① A只有两对给定角，先求第三角并指出AA依据；AAA为何足够相似却不固定大小？所给两条边是用来求倍率还是AA所必需？② S列两对同向边比，亲指两已比边所夹的两个顶点角，写SAS充分链。若只保两边比而把相等角改成B/E，能仍叫夹角吗？说明未满足这条一般判据与已经证明不相似不同；特殊前提能否另作证明须单独审查。一般SSA的实际两分支反例继续用旧题，不重复发明。③ P逐算三对同向正比，用SSS，不把比例误作边长相等。独立U只改第三目标边；核三对比，能挑前两对就套SSS吗？这只否定所列对应／证据时，整体图形结论还需什么核验？④ 名称不是证明，不能从未标示意补角；所有三角形须满足非退化前提。',
    '① A supplies two angle pairs. Calculate the third and cite AA. Why does AAA establish similarity without fixing size? Are the supplied side lengths required for AA,or for finding scale afterward? ② For S,calculate the two directed side ratios and identify the EXACT included vertices between those sides. Give the SAS argument. If equal angles instead become B/E with only those side ratios retained,is the angle still included? Distinguish failure of THIS criterion from proved nonsimilarity;any special-premise argument needs its own proof. Reuse the existing actual two-branch SSA counterexample rather than inventing another. ③ For P,calculate ALL three positive ratios for SSS,not equal side lengths. Independent U changes ONLY the third target side. Audit every ratio:may two convenient pairs replace SSS? If this rejects the listed matching/evidence,what further audit is required for an entire-figure claim? ④ A criterion name is not a proof;unmarked appearance supplies no angle. Retain nondegenerate-triangle premises.',
    near
      ? 'A两角40°、65°，第三75°，AA充分；AB=4、DE=6给第二/第一DE/AB=3/2，但两角本身不固定倍率，可换底边尺寸仍同角，AAA非全等。S为DE/AB=6/4=3/2,DF/AC=9/6=3/2；边AB与AC的夹角为A，边DE与DF的夹角为D，两夹角60°给SAS。改B/E是这两边的非夹角，不能直接用SAS；此处只核SAS结构，是否能由具体特别前提另作充分证明须另审，不宣称所有配置都不相似。P三比6/4=(15/2)/5=9/6=3/2，SSS。U第三比10/6=5/3，与前两3/2不同，所列对应不统一，不能挑两对套SSS；若要整体结论须另核其他对应，未标外观不添已知。'
      : 'A两角35°、80°，第三65°，AA充分；AB=5、DE=4给第二/第一DE/AB=4/5，角条件本身不定大小，AAA不保全等。S的DE/AB=4/6=2/3,DF/AC=6/9=2/3；夹角A与D均为50°，按SAS充分。若只给B/E等角，不是AB/AC与DE/DF的夹角，不能套SAS；一般SSA不足不等所有可能都不相似。P三比4/6=(16/3)/8=(20/3)/10=2/3，SSS。U第三比7/10，与前两2/3不同，该对应不统一，不能省第三对；整体相似与否还需其他对应的完整核验，不能只看图。',
    near
      ? 'A has40°/65°,hence third75°. AA suffices;AB=4 and DE=6 then give target/source DE/AB=3/2,but the angle facts alone leave size free,so AAA is not congruence. S has DE/AB=6/4=3/2 and DF/AC=9/6=3/2. Sides AB and AC include angle A;sides DE and DF include D. Equal60° gives SAS. B/E would be nonincluded for THESE side pairs,so direct SAS is unjustified. This audits the SAS structure only;any proof from specific special premises must be considered separately. It does not declare every configuration nonsimilar. P gives6/4=(15/2)/5=9/6=3/2,SSS. U changes the third to10/6=5/3,unlike the first two3/2:the listed matching is not uniform. Do not omit it or infer a whole-figure claim without auditing other matchings.'
      : 'A has35°/80°,third65°. AA suffices;AB=5 and DE=4 then give target/source DE/AB=4/5. Angles alone leave scale free,so AAA is not congruence. S has4/6=6/9=2/3 for DE/AB,DF/AC and equal included A/D=50°,giving SAS. B/E would not be included between THESE sides;general SSA is insufficient rather than a proof that every configuration is nonsimilar. P gives4/6=(16/3)/8=(20/3)/10=2/3,SSS. U changes the third to7/10,unlike the first two2/3. That matching is nonuniform;two convenient ratios cannot replace the third. An entire-figure conclusion requires other possible matchings to be audited,not appearance.',
  );
  table(q2, [
    [
      'A',
      '固定ABC↔DEF的两角',
      'Two angles,fixed ABC↔DEF',
      near ? 'A=D=40°,B=E=65°;AB=4,DE=6cm' : 'A=D=35°,B=E=80°;AB=5,DE=4cm',
      near ? 'A=D=40°,B=E=65°;AB=4,DE=6cm' : 'A=D=35°,B=E=80°;AB=5,DE=4cm',
    ],
    [
      'S',
      '独立两边夹角',
      'Separate included-angle case',
      `AB=${a},AC=${b},DE=${ta},DF=${tb}cm;A=D=${angle}°`,
      `AB=${a},AC=${b},DE=${ta},DF=${tb}cm;A=D=${angle}°`,
    ],
    [
      'P',
      '独立三边',
      'Separate three-side case',
      near
        ? 'AB=4,BC=5,CA=6;DE=6,EF=15/2,FD=9cm'
        : 'AB=6,BC=8,CA=10;DE=4,EF=16/3,FD=20/3cm',
      near
        ? 'AB=4,BC=5,CA=6;DE=6,EF=15/2,FD=9cm'
        : 'AB=6,BC=8,CA=10;DE=4,EF=16/3,FD=20/3cm',
    ],
    [
      'U',
      'P只改第三像边',
      'P with only third target side changed',
      near ? 'FD=10cm，其余同P' : 'FD=7cm，其余同P',
      near
        ? 'FD=10cm;all other P givens retained'
        : 'FD=7cm;all other P givens retained',
    ],
  ]);
  const w = near ? 3 : 4,
    h = near ? 2 : 3,
    scale = near ? 2 : 3,
    inv = near ? '9/16' : '4/9',
    irr = near ? 2 : 3;
  const q3 = card(
    3,
    'similarity-area-units-inversion-and-counterdesign',
    '① G亲画同单位格图，分别数目标的1cm²小格与“原矩形面积块”，标原/目标宽高、周长、面积、长度比和面积比，不能把块数、面积数值或周长倍率混成一项。用两方向或对应底高证明平方律，旧三角形一般证明保留。② F已知相似且给面积目标/原图比，求正长度倍率、目标两边/面积/周长并核回，缩小也适用吗？独立V的面积比给非平方整数，写精确正倍率；核候选小数平方、负根及前提，不用显示小数冒精确解。③ T是独立横纵不同倍率，实际求两边、面积比与周长比；能直接把面积比开方叫相似比吗？用完整长宽比检查本例，明确固定对应和整体形状。④ 自己构造一个与G原框同面积却不相似的新矩形，必须不同于G及T，允许正分数边；给面积等式及两方向配对都失败的理由。若已知相似且同面积，为什么结论反而是全等？',
    '① DRAW G on common unit cells. Count target1cm² cells SEPARATELY from original-rectangle AREA BLOCKS. Label both sizes,perimeters,areas,length/area ratios. Counts,actual area and perimeter factor are distinct. Prove the square rule with two directions or corresponding base/altitude,keeping the old general triangle proof. ② F is KNOWN similar with target/source AREA ratio. Recover positive length scale,target sides/area/perimeter and check back. Does reduction obey the same rule? Separate V has a nonsquare integer area ratio:give its EXACT positive scale,audit the proposed decimal by squaring,and reject a negative length ratio. ③ Independent T has different directional factors. Calculate sizes,area AND perimeter ratios. May the area-ratio square root automatically be called a similarity factor? Check complete aspect ratios in both orientations. ④ DESIGN a new rectangle with G’s original area but a nonsimilar shape,different from G and T;positive fractional sides are allowed. Prove area equality and failure of both side matchings. Why would KNOWN similarity plus equal area instead imply congruence?',
    near
      ? 'G原3×2面积6、周长10；k2后6×4面积24、周长20，长度/周长倍率2，面积倍率4。目标有24个1cm²格、4块各6cm²的原面积块，不能把24当倍率或把4当cm²面积。F面积比9/16，正k3/4，两边9/4与3/2cm，面积27/8cm²，周长15/2cm；面积除原6得9/16，周长除10得3/4。V正k√2，1.41²=1.9881≠2，负根不作长度比。T横2纵3/2，目标6×3，面积18、比3，周长18、比9/5；原3/2、新2或倒数1/2均不匹配，不相似，√3不是已建立的相似比。自主例9/2×4/3面积6，长宽比27/8及倒数8/27都非3/2，非G/T且不相似；其他有效设计同样接受。若先知相似且面积比1，则k>0且k²=1给k=1、对应边角相同，才全等。'
      : 'G原4×3面积12、周长14；k3后12×9面积108、周长42，长度/周长倍率3、面积倍率9。目标108个1cm²格、9块各12cm²的原面积块，数值单位分开。F面积比4/9，正k2/3，两边8/3与2cm，面积16/3cm²，周长28/3cm；分别回除原面积12与原周长14，给4/9及2/3。V正k√3，1.73²=2.9929≠3，负根不是正长度比。T横2纵3，目标8×9，面积72、比6，周长34、比17/7；原长宽比4/3，新8/9或倒数9/8均不等，不相似，不凭面积比叫√6相似比。自主例8×3/2面积12，长宽比16/3及倒数3/16不等4/3，非G/T且不相似；接受其他正确设计。先给相似再有面积比1，k>0且k²=1才得k=1与全等。',
    near
      ? 'G starts3×2cm,area6cm²,perimeter10cm. Factor2 gives6×4,area24,perimeter20,length/perimeter factor2 and area factor4. Count24 unit cells versus FOUR original-area blocks of6cm² each. F’s area ratio9/16 gives positive k3/4,sides9/4,3/2cm,area27/8cm²,perimeter15/2cm. Dividing by originals6/10 restores area ratio9/16 and perimeter ratio3/4. V gives exact positive√2;1.41²=1.9881≠2,and the negative root is not a length factor. T gives6×3,area18,ratio3,perimeter18,ratio9/5. Aspect ratios2 or1/2 do not match original3/2,so√3 is not an established similarity factor. One original design is9/2×4/3,area6,aspect ratios27/8 or8/27 unlike3/2,different from G/T. Accept every valid own design. With similarity ALREADY known,equal area instead gives k²=1,k>0,hence k=1 and congruence.'
      : 'G starts4×3cm,area12cm²,perimeter14cm. Factor3 gives12×9,area108,perimeter42,length/perimeter factor3 and area factor9. Count108 unit cells versus NINE original-area blocks of12cm². F’s area ratio4/9 gives positive k2/3,sides8/3,2cm,area16/3cm²,perimeter28/3cm. Dividing by originals restores4/9 and2/3. V gives exact positive√3;1.73²=2.9929≠3,and negative scale is not a length ratio. T gives8×9,area72,ratio6,perimeter34,ratio17/7. Aspect ratios8/9 or9/8 both differ from original4/3,so√6 is not an established similarity factor. One own design8×3/2 has area12 and aspect ratios16/3 or3/16 unlike4/3,different from G/T. Accept other valid designs. If similarity is ALREADY established,equal area gives k²=1 and positive k=1,hence congruence.',
  );
  table(q3, [
    [
      'G',
      '统一格图',
      'Uniform unit-cell diagram',
      `${w}×${h}cm; k=${scale};每小格1cm²`,
      `${w}×${h}cm;k=${scale};each unit cell1cm²`,
    ],
    [
      'F',
      'G原框的独立相似像',
      'Separate similar image of G’s source',
      `已知相似，面积目标/原图=${inv}`,
      `Known similar;target/source AREA ratio=${inv}`,
    ],
    [
      'V',
      '另一独立相似像',
      'Another independent similar image',
      `已知相似，面积比${irr}；待审正倍率${near ? '1.41' : '1.73'}`,
      `Known similar;AREA ratio${irr};proposed positive scale${near ? '1.41' : '1.73'}`,
    ],
    [
      'T',
      '独立非均匀矩形',
      'Separate directional rectangle',
      `${w}×${h}cm，横倍率2、纵倍率${near ? '3/2' : '3'}`,
      `${w}×${h}cm;horizontal2,vertical${near ? '3/2' : '3'}`,
    ],
  ]);
  const print = near ? 20000 : 60000,
    ab = near ? '15/2' : '5/2',
    ground = near ? '3/4' : '9/10',
    pw = near ? 6 : 8,
    ph = near ? 4 : 6,
    kept = near ? 3 : 4,
    newWidth = near ? 9 : 12,
    newCrop = near ? '9/2' : '6';
  const q4 = card(
    4,
    'similarity-map-photo-shadow-and-own-report',
    '① M亲画虚构纸图，标原印图数值比例尺、直线AB、1km图示条及单位。求AB实际cm/m/km，再由另一实际距离CD反求原图cm并乘回。按给定显示像素和缩放，重算AB与条长之比及实际距离；不能用屏幕物理厘米套原印比，直线距离不冒道路路程。自己给AB另画一个有折点路线，为什么不能直接复用AB直线长度？② P亲画原框与保留区、在保留区内画一个圆，分别做完整等比、强制拉伸、先裁切再等比；算各框尺寸、面积、倍率。拉伸与裁切最后框尺寸相同，保留内容的形状是否同？比较完整原框、裁后框与相应保留部分，不能把删去内容说成仍完整对应。③ S统一cm/m，列同时同地、平行光、水平地面、直立这套前提的AA链，求目标高度。独立撤掉共同光线前提，画同一给定影长但两种不同高度的模型，说明条件不足；不能伪画已证明共角。透视单处标定的限制继续用旧题。④ 把自己的纸图、三种图像和影长条件写成一份可单独核查的虚构报告，列来源/单位/对应/适用前提与一个失败例；无需真实测量或出行。一次一独立模型。',
    '① DRAW M as a fictional paper map,label its numerical print scale,straight AB,1km graphic bar and units. Find AB’s ground cm/m/km;recover original-map cm for separate ground CD and multiply back. Using the supplied display pixels/zoom,recompute AB/bar ratio and real distance. Screen physical centimetres cannot use the original print ratio;straight distance is not road travel. DESIGN a bent AB route:why cannot its distance simply reuse the straight AB length? ② DRAW P’s original/retained frames and a circle wholly within the retained part. Apply complete uniform resizing,forced stretch,and crop-then-uniform resizing. Calculate sizes,areas and factors. Stretch/crop produce the SAME final frame size:are their retained motifs shaped the same? Distinguish full original frame,cropped frame and corresponding retained content. ③ For S,unify cm/m and derive AA from simultaneous common parallel light,level ground and upright objects before finding height. Independently remove common light and DRAW two heights with the SAME given target shadow,proving insufficiency without inventing an established equal angle. Keep the existing perspective/local-calibration argument. ④ Write a self-contained fictional report from YOUR map,three image operations and shadow premises,with sources,units,correspondence,scope and a failed-model example. No measurements or travel. One independent model per sitting.',
    near
      ? 'M的7.5cm×20000=150000cm=1500m=3/2km；1km条为100000/20000=5原cm。CD3/4km=75000cm，原图15/4cm，乘20000回75000。屏幕150/100=3/2；放3/2后225/150仍3/2，实际1.5km不改。自行画折点C使两段和大于直线AB，用段长求路线而非冒原直线距离；图示条与地图同步。P原6×4面积24，统一宽9给k3/2、高6、面积54、面积比9/4；完整拉成9×9/2的宽/高倍率3/2与9/8，面积81/2、比27/16。裁前留6×3面积18，再k3/2到9×9/2面积81/2，保留部分面积比9/4；与完整原框面积比27/16不能反推统一相似。拉伸/裁后同框2:1但原框3:2不同，保留区内原半径1圆，拉伸直径3与9/4为椭圆，裁后等比直径3与3仍圆。S杆150cm=3/2m、影1m，高/影3/2；目标影3/2m，高9/4m。前提给两直角和同光线夹角AA。撤共同光线后，同目标影3/2可取高3/2或3m，对应不同光线斜度且都可直立在平地，不能沿用唯一9/4m。报告所有模型为虚构，透视一处尺不足保证各处同尺度。'
      : 'M的2.5cm×60000=150000cm=1500m=3/2km；1km条为5/3原cm。CD9/10km=90000cm，原图3/2cm，乘60000回90000。屏幕180/120=3/2；缩2/3后120/80仍3/2，实际1.5km不变。自己的折点路线按两段原图长求总路程，不能把直线AB直接当路线；显示与标尺同步。P原8×6面积48，统一宽12给k3/2、高9、面积108、面积比9/4。完整拉成12×6的横/纵倍率3/2与1，面积72、比3/2。裁留8×4面积32，再k3/2到12×6面积72，保留部分面积比9/4，而相对完整原框比3/2不保证相似。两最终框同2:1但原4:3不同；保留区内半径1圆在拉伸后直径3与2为椭圆，裁后等比直径3与3仍圆。S杆180cm=9/5m、影3/2m，高/影6/5；目标影5/2m，高3m。共光、水平直立给直角和另一等角，AA支持。撤共同光线后，同目标影5/2可取高5/2或5m，光线角不同而都非退化，不能从缺前提仍定高3m。报告模型虚构；透视单处标定不足保证全图同倍率。',
    near
      ? 'M:7.5cm×20000=150000cm=1500m=3/2km. The1km bar is5 original cm. Ground CD3/4km=75000cm gives15/4 map cm,scaling back correctly. Display150/100=3/2;zoom3/2 gives225/150=3/2 and unchanged1.5km. An independently drawn off-line bend has a longer two-leg route;use its segment lengths rather than calling straight AB the road distance. P starts6×4,area24. Uniform width9 gives k3/2,height6,area54,area ratio9/4. Stretching to9×9/2 uses factors3/2,9/8,area81/2,ratio27/16. Cropping to6×3,area18,then scaling3/2 gives the SAME9×9/2 frame,area81/2,retained-part area ratio9/4. The full-original ratio27/16 does not establish similarity. Both final aspect ratios2 differ from original3/2. A retained radius-one circle stretches to diameters3,9/4,an ellipse;crop/uniform gives diameters3,3,a circle. S converts150cm to3/2m,so height/shadow3/2 and target shadow3/2m yield height9/4m. Right angles and a common light angle establish AA. Without common light,the same target shadow3/2 permits heights3/2 or3m with different light slopes,still upright on level ground. Thus9/4 is not uniquely justified. The report is fictional;one local perspective ruler does not establish global scale.'
      : 'M:2.5cm×60000=150000cm=1500m=3/2km. Its1km bar is5/3 original cm. Ground CD9/10km=90000cm gives3/2 map cm and scales back. Display180/120=3/2;zoom2/3 gives120/80=3/2,unchanged1.5km. Calculate your independently drawn bent route from its two lengths,not the original straight AB. P starts8×6,area48. Uniform width12 gives k3/2,height9,area108,ratio9/4. Stretch12×6 uses factors3/2,one,area72,full-original ratio3/2. Crop to8×4,area32,then scale3/2 to the SAME12×6,area72,but retained-part area ratio9/4. Both final aspect ratios2 differ from original4/3. A retained radius-one circle stretches to diameters3,two,an ellipse;crop/uniform keeps a circle with diameters3,3. S converts180cm=9/5m;rod shadow3/2m gives height/shadow6/5. Target shadow5/2m gives height3m under the stated AA premises. Without common light,the same target shadow5/2 permits heights5/2 or5m under different light angles,still nondegenerate upright models. Missing premises do not justify a unique three metres. All report designs are fictional;local perspective calibration does not prove a global scale.',
  );
  table(q4, [
    [
      'M',
      '独立原印图与显示',
      'Separate original print/display',
      `1:${print};AB直线${ab}cm;CD实际${ground}km；屏幕AB/1km条=${near ? '150/100px，放3/2' : '180/120px，缩2/3'}`,
      `1:${print};straight AB${ab}cm;ground CD${ground}km;display AB/1km-bar=${near ? '150/100px,zoom3/2' : '180/120px,zoom2/3'}`,
    ],
    [
      'P',
      '独立图像三操作',
      'Separate three image operations',
      `原框${pw}×${ph}cm，目标宽${newWidth}cm；拉伸框${newWidth}×${newCrop}cm；裁切保留${pw}×${kept}cm再等比`,
      `Original${pw}×${ph}cm,target width${newWidth}cm;stretch frame${newWidth}×${newCrop}cm;crop retains${pw}×${kept}cm then uniform resize`,
    ],
    [
      'S',
      '独立影长及前提',
      'Separate shadows/premises',
      near
        ? '杆150cm、影1m；目标影3/2m；同时同地平行光、水平地面、物体直立'
        : '杆180cm、影3/2m；目标影5/2m；同时同地平行光、水平地面、物体直立',
      near
        ? 'Rod150cm,shadow1m;target shadow3/2m;simultaneous common parallel light,level ground,upright objects'
        : 'Rod180cm,shadow3/2m;target shadow5/2m;simultaneous common parallel light,level ground,upright objects',
    ],
  ]);
  return {
    id: `${unit}-MAINT-SIMILARITY-MEANING`,
    unit,
    bridge: 'J94-L03',
    bridgeByQuestion: Object.fromEntries(
      [3, 2, 4, 5].map((n, i) => [id(i + 1), `J94-L0${n}`]),
    ),
    title: t(
      '相似的对应、计数单位与应用前提',
      'Similarity correspondence,area units and application premises',
    ),
    intro: t(
      '四张独立纸笔卡，每次一编号/案例，可分次不计时、口述或熟悉语言。亲画、逆求、构造反例后人审，读题帮助与数学提示分开。原十题/旧SSA证明和记录保留；全部虚构，不需实测、购买、出行或上传。',
      'Four independent paper cards,one numbered part/case per untimed sitting. Oral/familiar-language work is welcome. Draw,reverse-calculate and construct counterexamples before human review;separate reading help from mathematical hints. Original ten tasks/SSA proofs and records remain. Fictional work needs no measurements,purchases,travel or uploads.',
    ),
    questions: [q1, q2, q3, q4],
  };
};
export const similarityMeaningRetrieval = {
  H22_SIMILARITY_MEANING: makeSet('H22'),
  H23_SIMILARITY_MEANING: makeSet('H23'),
};
