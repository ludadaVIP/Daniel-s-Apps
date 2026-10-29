import { t, type Question } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'H28' | 'H38') => {
  const near = unit === 'H28',
    id = (n: number) => `${unit}-MAINT-INTEGRATION-MEANING-Q${n}`;
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
        '先亲画并保原量身份、同单位与正长度域；一般关系用分块或完整推导，一次数值只核实例。筛选全部条件后才回答原目标，精确比较先于显示舍入。',
        'Draw with original quantity identities, common units and positive-length domains. Use partitions or full reasoning for general relationships; a substitution checks one instance. Audit every condition and return to the actual target, comparing exactly before display rounding.',
      ),
      t(
        '一次一个编号/独立案例，可分次不计时，允许口述或熟悉语言。读题协助与数学提示分开；自主方案接受不同合法结果，完整理由人审。全部虚构纸图，费率/限额是题设，无需建造、实测、购买、上传或代填家庭草稿。',
        'One numbered part/separate case per untimed sitting. Oral or familiar-language work is welcome; separate reading assistance from mathematical hints. Accept different valid own designs after human review. These are fictional paper models with stipulated rates/limits, requiring no building, measurements, purchases, uploads or substituted household drafts.',
      ),
    ]);
  type Row = [string, string, string, string, string];
  const table = (q: Question, z: string, en: string, rows: Row[]) => {
    q.contextTable = {
      caption: t(z, en),
      columns: [
        t('编号', 'ID'),
        t('案例', 'Case'),
        t('原条件', 'Original conditions'),
      ],
      rows: rows.map(([k, z, en, v, ve]) => [t(k, k), t(z, en), t(v, ve)]),
    };
  };
  const q1 = card(
    1,
    'integration-structure-domain-and-premise-audit',
    '① R亲画边x与x+d的长方形，用不叠不漏的正方形/长条推面积乘积及展开合并式；另由四条外边推周长一般式。分别按表中x求当前两数值、保单位；乘积虽等值为何未完成“展开合并”要求，单个面积数又为何不能答一般关系？把d改0还可有正方形吗，长条怎样？② 候选G=2x在原x恰给正确面积。另选表中测试x实算反例，再说明正确关系为何对全部允许x成立。代数恒等对x=0/负数仍成立，能把它们当本图正长度吗？只改显示缩放与真改单位都不能混作真改尺寸。③ 从原R分别出发：U把所有长度乘2（含d），V只把x乘2而保d。写两种新边、面积/周长与原比，解释固定d的一般式保留和全长倍率不同。④ P给定直角及两腿，先核前提/边身份、求正斜边与平方回验。撤直角而只给同两边，亲画表给另一合法三角形，核严格三角不等式与不同第三边；此时原斜边预测是必假还是未唯一？“所有这种三角形第三边都如此”的全称主张又怎样？每一步标条件→关系→结果→长度域→原目标，范围看似合理不能替前提与完整核验。原O2面积反求周长/去返依赖链继续用，不重做成唯一卡片顺序。',
    '① DRAW R’s rectangle with sides x,x+d. Derive its product and expanded/collected area by nonoverlapping exhaustive square/strip pieces; separately derive perimeter from FOUR outer sides. Evaluate both at the supplied x with units. Why is an equivalent product unfinished when expansion is requested, while one area number does not answer the general relationship? With d=0 is a positive square still possible, and what happens to the strip? ② G=2x matches area at the original x. Calculate a counterexample at the test x, then justify the correct rule for EVERY permitted x. Does an algebraic identity at zero/negative x make those positive lengths in this drawing? Separate display zoom, actual measurement-unit conversion and changed dimensions. ③ Restart from ORIGINAL R: U doubles ALL lengths, including d; V doubles ONLY x, retaining d. Give new sides, area/perimeter and their ratios to the original. Explain why a fixed-d rule is distinct from uniform scaling. ④ For P, check the GIVEN right angle/leg identities, find positive hypotenuse and verify squares. Remove the right-angle premise, retaining just the two side lengths. DRAW the supplied alternative triangle, check strict existence inequalities and its different third side. Is the original prediction necessarily false or merely not unique? What about the UNIVERSAL claim that every such triangle has that third side? Label conditions→relation→result→length domain→actual target. Plausible ranges do not replace premises or a full audit. Retain old O2’s area-to-perimeter and journey dependencies without prescribing one card sequence.',
    `R分块x²+dx=x(x+d)，四边给P=4x+2d；x>0、d=${near ? '1/2' : '3/4'}m。当前边${near ? '3/2和2' : '5/4和2'}m，面积${near ? '3' : '5/2'}m²、周长${near ? '7' : '13/2'}m。指定展开需交x²+${near ? 'x/2' : '3x/4'}，不是数值或未展开积。d=0时条面积0、图成x边正方形，A=x²、P=4x。G=2x在原x=${near ? '3/2' : '5/4'}处吻合，但x=1/2时G=1而真A=${near ? '1/2' : '5/8'}；单例不能证恒等，完整分配/无叠缺覆盖给一般理由。零/负x可满足代数恒等，但不是这个正长度模型。只缩放画面不改真实量；把m换cm数值长度乘100、面积乘10000，而物体不变。U新边${near ? '3和4' : '5/2和4'}m，A=${near ? '12' : '10'}m²，P=${near ? '14' : '13'}m，比分别4与2。V新边${near ? '3和7/2' : '5/2和13/4'}m，A=${near ? '21/2' : '65/8'}m²，P=${near ? '13' : '23/2'}m，面积比${near ? '7/2' : '13/4'}、周长比${near ? '13/7' : '23/13'}，非全长2倍。P直角腿${near ? '3/2、2' : '5/2、6'}，平方和${near ? '25/4' : '169/4'}，正斜边${near ? '5/2' : '13/2'}m，必须比各腿大。另三边${near ? '3/2、2、2' : '5/2、6、6'}均正且满足严格三角不等式，第三边${near ? '2' : '6'}不同；撤直角后原值可能（原直角图）但不唯一，是证据不足，不能说原值必假。全称“每个都该值”被合法另一图反驳；不要把无直角直接称不能存在。`,
    `R has area x²+dx=x(x+d) and perimeter4x+2d for x>0,d=${near ? '1/2' : '3/4'}m. Original sides ${near ? '3/2 and2' : '5/4 and2'}m give area${near ? '3' : '5/2'}m² and perimeter${near ? '7' : '13/2'}m. An expansion request needs x²+${near ? 'x/2' : '3x/4'}, not one number or an unexpanded product. At d=0 the strip has zero area and the positive x-square remains, with x² and4x. G=2x matches at original x=${near ? '3/2' : '5/4'} but at x=1/2 gives1 versus true area${near ? '1/2' : '5/8'}. A match is not an identity proof; exhaustive nonoverlapping partition/distributivity supplies the general reason. Zero/negative algebraic inputs do not become positive lengths. Display zoom changes no real quantities. Converting m to cm scales numerical lengths by100 and areas by10000 without changing the object. U has sides${near ? '3,4' : '5/2,4'}m, area${near ? '12' : '10'}m², perimeter${near ? '14' : '13'}m, with ratios4 and2. V has sides${near ? '3,7/2' : '5/2,13/4'}m, area${near ? '21/2' : '65/8'}m², perimeter${near ? '13' : '23/2'}m, ratios${near ? '7/2 and13/7' : '13/4 and23/13'}, not uniform doubling. Given right-angle legs${near ? '3/2,2' : '5/2,6'}, squared hypotenuse=${near ? '25/4' : '169/4'} and positive length=${near ? '5/2' : '13/2'}m, greater than either leg. Alternative sides${near ? '3/2,2,2' : '5/2,6,6'}are positive and meet strict triangle inequalities, with third side${near ? '2' : '6'}. Without the right angle the original prediction remains possible but not unique: insufficient evidence, not proof it is false. The universal every-triangle claim IS refuted by the legal alternative. Missing a right-angle premise does not mean no triangle exists.`,
  );
  table(
    q1,
    'R/U/V按各自尺寸核；P为另一个三角形案例。纸上分数d不受源工作台整数滑块范围限制，补桥回源时按源自己的条件。',
    'R/U/V use their respective dimensions; P is a separate triangle case. Fractional paper d is not limited by the source lab’s integer slider. On revisiting the source, use that lab’s own conditions.',
    [
      [
        'R',
        '原矩形',
        'Original rectangle',
        `x=${near ? '3/2' : '5/4'}m;d=${near ? '1/2' : '3/4'}m;x>0;当前长x+d`,
        `x=${near ? '3/2' : '5/4'}m;d=${near ? '1/2' : '3/4'}m;x>0;other side x+d`,
      ],
      [
        'G',
        '独立猜式审计',
        'Separate proposed-identity audit',
        'G=2x；测试x=1/2，保原d',
        'G=2x; test x=1/2, retaining original d',
      ],
      [
        'U/V',
        '各从R重启',
        'Each restarts from R',
        'U:全长×2，含d；V:只x×2、d固定',
        'U:ALL lengths×2,including d; V:only x×2,d fixed',
      ],
      [
        'P',
        '直角前提与撤去',
        'Right-angle premise and its removal',
        `两给定边a=${near ? '3/2' : '5/2'}m,b=${near ? '2' : '6'}m；另合法三角形三边a,b,b`,
        `Given sides a=${near ? '3/2' : '5/2'}m,b=${near ? '2' : '6'}m; alternative triangle has sides a,b,b`,
      ],
    ],
  );
  const h = near ? '3/4' : '1/2',
    run = near ? '3' : '2',
    w = near ? '4/5' : '6/5',
    rate = near ? 50 : 70,
    budget = near ? 124 : 174,
    display = near ? '123.69' : '173.17';
  const q2 = card(
    2,
    'integration-exact-joint-constraints-and-own-report',
    '① B是独立纸上坡道，直角侧面与垂直宽度给定，只计一块长方形坡面。先从三条侧面限制推出h、r是否其实唯一，不能为了另出侧面而悄改原限制。列s²=h²+r²、正s、坡度/角度、A=sw与模型C=pA，保单位，最后才显示费用到分。坡面不是底面rw。② 把原B逐条核高度、水平、坡度、面积、预算，面积与费用均用正量的精确平方比较；平方保序需什么前提，负量时能照搬吗？只把预算改成T中与舍入费用同数的限额，显示相等就过吗？给精确差/有理平方比较。这里预算比较未舍入模型C，显示到分不是另设收费规则。③ W只改宽，侧面/斜长/坡度哪些保留，面积过关能推出预算也过关吗？亲算并逐项判断，不用单个合格指标覆盖全部。另用旧O10继续核统一全长缩放，不重做原强证据。④ 自主另选正宽与纸上预算，在B原侧面/面积限制和同费率下给一份满足方案与一份近似但不满足方案；可改宽或预算，不能冒称h/r还有自由。报告给两份原参数、精确/最终近似、全部约束表、另一表示回验与模型局限。允许任何合法方案，不只照抄作者数值。保存/导出只是带走文字，不等于家长审核；可纸笔，不要求把作者例子填入真实项目草稿。',
    '① B is a SEPARATE fictional paper ramp with a GIVEN right-triangle side and perpendicular width; count ONE rectangular incline only. Derive whether the THREE side restrictions force unique h,r, without silently changing limits to invent another side. Give s²=h²+r², positive s, grade/angle, A=sw and model cost C=pA with units, rounding only the final cost display. Inclined area is not base area rw. ② Audit EVERY height/run/grade/area/budget constraint for original B. Use exact squared comparisons for POSITIVE area/cost: what premise preserves inequality, and may signed values use it blindly? Replace the budget by T’s limit equal to the rounded cost display. Does displayed equality pass? Supply an exact difference or rational squared comparison. Here the budget constrains UNROUNDED model C; displaying cents is not a new charging policy. ③ W changes width ONLY: what happens to side/incline/grade? Does passing area imply passing budget? Calculate and audit each limit. Retain old O10 for uniform whole-length scaling rather than repeating it. ④ CHOOSE another positive width and paper budget under B’s ORIGINAL side/area limits and rate. Give one feasible design and one near-miss, changing width or budget without claiming free h/r. Report BOTH parameter sets, exact/final approximate quantities, EVERY constraint, an alternate check and model limits. Accept ANY valid design, not only author values. Saving/exporting transports text rather than granting parent review. Paper work is sufficient; do not enter author examples into real project drafts.',
    `侧面限制0<h、0<r，h≥${h}、r≤${run}、h/r≤1/4，所以${h}≤h≤r/4≤${h}，等号迫h=${h}m、r=${run}m。s=${near ? '3√17/4' : '√17/2'}m，坡度1/4=25%、角约14.0°；B宽${w}m，A=3√17/5m²，非rw，A²=153/25≤25/4。C=${near ? '30' : '42'}√17NZD，C²=${near ? 15300 : 29988}≤${budget ** 2}，B全满足；最后费用≈${display}。T预算${display}，平方${near ? '152992161/10000' : '299878489/10000'}小于C²，原模型费用实际上超限，不能用显示相等造通过。因A、C及限额均正，平方比较等价；一般负数不保同方向，不能机械套。W宽${near ? '161/200' : '121/100'}m，A=${near ? '483√17/800' : '121√17/200'}，A²=${near ? '3965913/640000' : '248897/40000'}仍≤25/4；C=${near ? '483√17/16' : '847√17/20'}，C²=${near ? '3965913/256' : '12195953/400'}大于${budget ** 2}，只预算失败，h/r/s/角不变。自主例可先选w=${near ? '1/2' : '1'}m、预算${budget}，正面积与费用均更小而全部满足；单改预算0虽失败但不算近失，应自创一个近失（如用T限额）并明确失败约束。接受不同正宽/非负限额方案，核精确正量、全部条件与同单位。模型只算给定直角单块坡面，排除支撑、厚度、浪费和现实费率/场地；报告存取不授予课程掌握。`,
    `Positive h,r satisfy h≥${h},r≤${run},h/r≤1/4, so ${h}≤h≤r/4≤${h}. Equality forces h=${h}m,r=${run}m. Then s=${near ? '3√17/4' : '√17/2'}m,grade1/4=25%,angle≈14.0°. At B width${w}m,A=3√17/5m²,not rw; A²=153/25≤25/4. Model C=${near ? '30' : '42'}√17NZD has C²=${near ? 15300 : 29988}≤${budget ** 2},so B meets ALL limits and finally displays${display}. T budget${display} has square${near ? '152992161/10000' : '299878489/10000'} BELOW C²: unrounded cost fails despite displayed equality. Squaring is equivalent because quantities and limits are positive; it is not an unrestricted signed comparison. W width${near ? '161/200' : '121/100'}m gives A=${near ? '483√17/800' : '121√17/200'},A²=${near ? '3965913/640000' : '248897/40000'}≤25/4; C=${near ? '483√17/16' : '847√17/20'},C²=${near ? '3965913/256' : '12195953/400'}>${budget ** 2}. ONLY budget fails while h,r,s,grade/angle stay fixed. An own feasible example may use width${near ? '1/2' : '1'}m,budget${budget},with smaller positive area/cost. Merely setting budget zero is a failure but not a close alternative; construct a near-miss such as T and identify its failed limit. Accept different positive widths/nonnegative budgets after exact ALL-constraint checks with common units. The given right-angle single-surface model excludes supports,thickness,waste and real prices/sites. Report storage does not award mastery.`,
  );
  table(
    q2,
    '独立纸上条件与源工作台默认条件不同，不把本表参数直接当源项目已通过。预算比较未舍入的模型费用，近似仅作显示。',
    'Separate paper limits differ from the source lab defaults; these parameters are not a passed source project. Budgets constrain unrounded model cost; approximations are display only.',
    [
      [
        'B',
        '原全条件方案',
        'Original all-constraint design',
        `h≥${h}m;r≤${run}m;h/r≤1/4;A≤5/2m²;p=${rate}NZD/m²;w=${w}m;预算${budget}NZD`,
        `h≥${h}m;r≤${run}m;h/r≤1/4;A≤5/2m²;p=${rate}NZD/m²;w=${w}m;budget=${budget}NZD`,
      ],
      [
        'T',
        '仅改精确限额',
        'Only change exact budget',
        `沿用B；预算=${display}NZD，其余保留`,
        `Retain B; budget=${display}NZD; all else unchanged`,
      ],
      [
        'W',
        '仅改坡面宽度',
        'Only change incline width',
        `沿用B；w=${near ? '161/200' : '121/100'}m；原预算不变`,
        `Retain B; w=${near ? '161/200' : '121/100'}m; original budget unchanged`,
      ],
    ],
  );
  return {
    id: `${unit}-MAINT-INTEGRATION-MEANING`,
    unit,
    bridge: 'J98-L01',
    bridgeByQuestion: Object.fromEntries(
      [1, 5].map((l, i) => [id(i + 1), `J98-L0${l}`]),
    ),
    title: t(
      '综合之后，再核结构、前提与精确边界',
      'After integration, recheck structure, premises and exact limits',
    ),
    intro: t(
      '两张独立纸笔卡，每次只核一个编号，可分次不计时/口述。保原强证明/策略题，复用后续函数和精度任务；新卡只补实际缺口，全部理由人审，作者示例不作家庭学习证据。',
      'Two independent paper cards, one numbered part per untimed sitting; oral work is welcome. Retain old proofs/strategy tasks and reuse later function/precision work. Supplements address actual gaps, with all reasoning human-reviewed; author examples are not household learning evidence.',
    ),
    questions: [q1, q2],
  };
};
export const integrationMeaningRetrieval = {
  H28_INTEGRATION_MEANING: makeSet('H28'),
  H38_INTEGRATION_MEANING: makeSet('H38'),
};
