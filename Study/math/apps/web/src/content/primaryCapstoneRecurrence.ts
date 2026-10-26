import { t } from '../model';
const pair = (n: number) =>
  ['J91', 'J92'].map((u) => `${u}-MAINT-PRIMARY-Q${n}`);
const e = (
  skill: string,
  z: string,
  en: string,
  l: string,
  targets: string[],
  rz: string,
  re: string,
) => ({
  skill,
  focus: t(z, en),
  sourceLesson: l,
  sourceTask: `${l}-Q6`,
  targets,
  rationale: t(rz, re),
});
const originalPrimaryCapstoneRecurrence = [
  e(
    'circle-centre-radius-diameter',
    '圆心、半径、直径与弦',
    'Circle centre, radius, diameter and chord',
    'P66-L01',
    pair(1),
    'J91以半径5、弦6与直径10区分端点和过圆心；J92用半径13、弦10、直径26换构型。两处须画图解释任意半弦不是半径、旋转保定义，并有合法坐标构型供核对。',
    'J91 distinguishes endpoints and centre incidence using radius five, chord six and diameter ten; J92 changes to radius thirteen, chord ten and diameter twenty-six. Both require a drawing, explain why half an arbitrary chord is not a radius and retain definitions under rotation, with valid coordinate witnesses.',
  ),
  e(
    'pi-measurement-ratio',
    '理想圆周率与有限测量',
    'Ideal pi and finite measurements',
    'P66-L02',
    pair(2),
    'J91生成31.4/10=3.14与62.9/20=3.145，J92生成18.9/6=3.15与25.1/8=3.1375。均解释C/d而非C/r、同单位、误差与近似，区分模拟和实测，有限表不证明π的精确值或无理性。',
    'J91 generates ratios 3.14 and 3.145 from the given readings; J92 generates 3.15 and 3.1375. Both explain C/d rather than C/r, matching units, errors and approximations, distinguish simulation from measurement and reject exact-value or irrationality claims from a finite table.',
  ),
  e(
    'circle-circumference',
    '周长、直径与精确π',
    'Circumference, diameter and exact pi',
    'P66-L03',
    pair(3),
    'J91由半径3/2cm求直径3及精确3πcm，再按3.14近似9.42cm；J92由直径7/2m求半径7/4及精确7π/2m、近似10.99m。都解释漏2或多2错误、边界长度与等号/约等号。',
    'J91 goes from radius 3/2cm to diameter three and exact 3πcm, approximating 9.42cm. J92 goes from diameter 7/2m to radius 7/4 and exact 7π/2m, approximating 10.99m. Both explain missing/doubled factors, boundary-length units and equality versus approximation.',
  ),
  e(
    'circle-area-rearrangement',
    '扇形重排的守恒与极限',
    'Sector rearrangement, conservation and limits',
    'P66-L04',
    pair(4),
    'J91画r3的12片，J92画r5的8片，均须保留真实弧边及每片面积，解释内弦虚线不等于全部材料，有限图非精确矩形；细分时底趋半周πr、高趋r，给9πcm²或25πm²。不是仅代πr²便认作拼接解释。',
    'J91 sketches twelve sectors at radius three and J92 eight at radius five. Both retain curved pieces, distinguish inner chord guides from all material and explain why finite rearrangements are not exact rectangles. Refinement gives limiting base πr and height r, leading to 9πcm² or 25πm²; formula substitution alone is insufficient.',
  ),
  e(
    'cylinder-faces-volume',
    '圆柱展开、材料与空间',
    'Cylinder nets, material and space',
    'P66-L05',
    pair(5),
    'J91以r3h8画侧面、底，求无盖57πcm²、封闭66πcm²、体积72πcm³；J92以r2h6求28πm²、32πm²、24πm³，并解释侧面积同系数24π不等体积。两处核实际面数、内部尺寸、无底不能直接盛水与薄板假设。',
    'J91 draws side and base for r3,h8, obtaining open area 57πcm², closed 66πcm² and volume 72πcm³. J92 uses r2,h6 for 28πm²,32πm² and 24πm³, explaining why lateral-area coefficient 24π does not equate area and volume. Both check face counts, internal dimensions, the need for a base to hold water and thin-board assumptions.',
  ),
  e(
    'median-and-all-modes',
    '中位位置与完整众数',
    'Median position and all modes',
    'P67-L01',
    pair(6),
    'J91保留2,2,4,6,6,10求中位5、众数2与6；J92保留0,0,3,5,5,11求中位4、众数0与5，改尾值后重算。均须平均中间两条、不去重、全报并列，并区分无众数与众数为0。',
    'J91 retains 2,2,4,6,6,10 for median five and modes two and six. J92 retains 0,0,3,5,5,11 for median four and modes zero and five, then recomputes after a tail change. Both average the middle pair, retain duplicates, report every tied mode and distinguish no mode from mode zero.',
  ),
  e(
    'summary-purpose',
    '按问题选择统计摘要',
    'Choosing a summary for its purpose',
    'P67-L02',
    [...pair(6), 'J76-L03-Q6'],
    'J91核尾10改40后均值5变10、中位仍5；J92尾11改41后均值4变9、中位仍4。两处分别解释均分总量、中间位置和常见值，核实异常保留并限制样本结论；J76另给尾改0导致中位也改变的边界。',
    'J91 changes the tail from ten to forty, moving mean five to ten while median stays five. J92 changes eleven to forty-one, moving mean four to nine while median stays four. Both explain equal sharing, middle position and frequency, retain verified extremes and limit sample conclusions. J76 also changes a tail to zero, showing that the median can change.',
  ),
  e(
    'likelihood-assumptions',
    '等可能须有机制依据',
    'Equiprobability needs mechanism assumptions',
    'P67-L03',
    ['J76-L04-Q6', 'J76-L05-Q6', 'J97-L01-Q6', 'J97-L03-Q6', 'H24-L04-Q6'],
    'J76须列公平独立硬币/骰子的基本路径，解释合并事件不等可能及零分支；J97须按编号有序对权重比较颜色类别并区分完整模型与有限样本；H24按16等可能串重算恰2正6/16，否定五类正面数等权。机会来自基本机制，不来自类别名称数量或样本巧合。',
    'J76 lists fair independent coin/die paths, distinguishing unequally weighted grouped events and zero branches. J97 weights colour categories by numbered ordered pairs and distinguishes a full model from a finite sample. H24 recomputes exactly two heads as six of sixteen equiprobable strings, rejecting equal weights for five head-count categories. Mechanisms, not category names or sample coincidence, justify chance.',
  ),
  e(
    'finite-event-probability',
    '有限事件的分子、分母与条件',
    'Finite-event numerator, denominator and conditions',
    'P67-L04',
    ['J76-L04-Q6', 'J76-L05-Q6', 'J97-L02-Q6', 'J97-L03-Q6', 'H24-L06-Q6'],
    'J76重建和2的1/36与和7的1/6、两红一蓝放回/不放回概率；J97列3红2蓝不放回20编号有序对，颜色RR/RB/BR/BB权重6/6/6/2。都保等可能非空基本空间及零分支；H24将P(A)=0事件仍有无条件概率与不能以A作普通条件分母区分，强化零事件不等于可除0。',
    'J76 reconstructs probabilities 1/36 for sum two and 1/6 for sum seven and compares replacement conditions for two red and one blue. J97 counts twenty numbered ordered pairs with colour weights 6,6,6,2. Both retain nonempty equiprobable basic spaces and zero branches. H24 distinguishes a zero-probability event from an invalid ordinary conditional denominator, reinforcing that a zero event does not permit division by zero.',
  ),
  e(
    'frequency-versus-probability',
    '记录频率与理论机会',
    'Recorded frequency versus theoretical chance',
    'P67-L05',
    [
      'J93-MAINT-REASONS-Q9',
      'J94-MAINT-REASONS-Q9',
      'J97-L05-Q4',
      'J97-L05-Q5',
      'J97-L05-Q6',
      'H33-L05-Q6',
    ],
    'J93由10轮8异色重算4/5，再异色9/11离理论3/5更远；J94由9轮4RR得4/9，再RR得1/2离理论1/3更远，都核完整两抽轮为分母、零轮未定义、独立模型无补偿及来源。J97另生成29/50与追加后61/110，不改成理论或平均批率；H33区分已舍入正态理论68.27%与有限频率。已有较近后续单元的主动反例，不只依靠高中迁移。',
    'J93 recomputes 4/5 from eight different-colour rounds in ten, then 9/11 farther from theoretical 3/5. J94 recomputes 4/9 then 1/2 farther from theoretical 1/3. Both use complete two-draw rounds as denominators, retain undefined zero-round frequency, independent no-compensation and source conditions. J97 adds 29/50 and 61/110 without replacing records by theory or averaging batch rates; H33 distinguishes rounded normal-theory 68.27% from finite frequencies. Earlier later-unit tasks supply active counterexamples alongside advanced transfer.',
  ),
  e(
    'journey-time-scope',
    '速度平均的时间范围',
    'Time scope for average speed',
    'P68-L01',
    pair(7),
    'J91去程4km移动40停20，分别6与4km/h，往返8km/80min得6；J92去程6km移动45停15，分别8与6，往返12km/90min得8。均逐个写同范围分子分母、换小时、乘回并否定不同用时的速度直接平均。',
    'J91 separates moving and elapsed averages six and four for four kilometres with forty moving and twenty stopped minutes, then averages eight kilometres over eighty minutes for six. J92 similarly gives eight and six, then eight for twelve kilometres over ninety minutes. Both state matched scopes, convert hours, multiply back and reject arithmetic means over unequal durations.',
  ),
  e(
    'constant-work-rates',
    '同一任务的恒定工作速率',
    'Constant work rates for the same job',
    'P68-L02',
    pair(8),
    'J91由同一60L任务的20/30min得3+2L/min、12min，改总恒流4后15min；J92由同一72L的24/18min得3+4L/min、72/7min，改总恒流5后72/5min。均须核各泵供量、精确时间与无干扰条件，不能把用时相加或默认合作就除2。',
    'J91 derives 3+2L/min and twelve minutes from a sixty-litre job taking twenty/thirty alone, changing to fifteen under a specified total constant rate four. J92 derives 3+4L/min and 72/7min for seventy-two litres, changing to 72/5min under total rate five. Both check individual contributions, exact time and no-interference assumptions rather than adding durations or automatically halving.',
  ),
  e(
    'budget-reference-whole',
    '预算、预留与折扣参照',
    'Budget, reserve and discount base',
    'P68-L03',
    pair(10),
    'J91先从120预留12得可用108，只把花园原门票48乘0.75，再加整组往返与午餐；J92从150预留30得可用120，同样辨票价基数与原预算。都逐项核费用、可用不等式与整组/每人，不把预留当打折费用或账户有余额就算满足要求。',
    'J91 reserves twelve from 120 for spendable 108, discounts only original garden tickets forty-eight by 0.75 and adds group return travel and lunch. J92 reserves thirty from 150 for spendable 120 and distinguishes ticket bases from budget. Both check each cost, spendable inequality and per-group/per-person roles rather than discounting the reserve or treating any account balance as compliance.',
  ),
  e(
    'chart-multistep-evidence',
    '图表记录、多步费用与未知',
    'Chart records, multi-step costs and unknowns',
    'P68-L04',
    pair(9),
    'J91由12/缺测/18/0重求3/4/0包及已知三日费51，J92由7/0/缺测/13重求2/0/4包及已知费30。都亲画图、换轴而不换原量、逐日买足整包加固定费、区分人次/不同个体/缺测，并拒绝补零、完整总量与因果外推。',
    'J91 uses 12/missing/18/0 visits to obtain three/four/zero packs and known-day cost fifty-one. J92 uses 7/0/missing/13 for two/zero/four packs and cost thirty. Both draw charts, rescale without changing data, buy enough whole packs daily, add fixed costs and distinguish visits, people and missing values, rejecting imputed zeros, full totals and causal extrapolation.',
  ),
  e(
    'trip-joint-constraints',
    '旅行计划的联合限制与取舍',
    'Joint trip constraints and tradeoffs',
    'P68-L05',
    pair(10),
    '两组均要求列两路线×两活动四方案的完整整组价与总时长，含午餐、机动、往返及折扣。J91只有A花园108/200和A展馆104/240满足108元/240min；J92只有A花园108/180和A展馆102/210满足120元/210min。须任选可行并说明钱/时间取舍，不以最低价单目标替代联合可行性。',
    'Both require a four-plan table for two routes and two activities, including lunch, buffer, return travel and discounts. J91 admits only A/garden 108/200 and A/museum 104/240 under 108 dollars/240min. J92 admits A/garden 108/180 and A/museum 102/210 under 120 dollars/210min. Each requires a feasible choice and a money/time tradeoff rather than cheapest-price selection alone.',
  ),
];

const circleDetails = [
  [
    '新J91/J92-Q1由直径5/7反求半径2.5/3.5，并以另圆直径2/3反驳跨圆比较，区分弦/直径合类、重合与显示点状不等零。',
    'New J91/J92 Q1s invert diameters five/seven to radii 2.5/3.5 and refute cross-circle comparisons with separate diameters two/three, retaining chord/diameter inclusion, coincident labels and appearance versus zero.',
  ],
  [
    '新两组Q2由cm/mm原读数双向统一单位、算错误半径商和未换单位小十倍，核零/负长度及半周/拉伸条件。',
    'New Q2s match cm/mm readings in both common units, reconstruct erroneous radius quotients and tenfold unmatched-unit errors, and check zero/negative lengths and incomplete/stretched wraps.',
  ],
  [
    '新两组Q3反求同3.14约定的21.98/28.26周长，算无滑动多整周并亲描半圆弧与含直径整边框，保混合精确式。',
    'New Q3s invert calculated circumferences 21.98/28.26 under the same 3.14 convention, compute multiple no-slip turns and distinguish semicircular arcs from complete borders with a diameter, retaining mixed exact expressions.',
  ],
  [
    '新两组Q4由直径6/10求面积、比较实际放大与显示放大，并以8/64原片跟踪保面积和有限辅助界。',
    'New Q4s derive areas from diameters six/ten, compare actual with display scaling, and track conserved pieces through eight/64 sectors with finite guide limits.',
  ],
  [
    '新两组Q5分开理想薄壁面片与另厚壁容器，量化内外尺寸误差、只加倍高的非二倍封闭面积及cm³/mL，保无底和纸张尺寸限制。',
    'New Q5s separate ideal thin-wall faces from a thick-walled container, quantify inner/outer errors, height-only changes to closed area, and cm³/mL, retaining baseless and sheet-dimension restrictions.',
  ],
];
const chanceDetails = [
  [
    '新J93/J94-Q1保五个ID排序求奇数中位与完整众数，实算两端平均/去重后的错误13/2，并亲造偶数未观察中位例。',
    'New J93/J94 Q1s order five original IDs for odd medians/all modes, calculate erroneous extremes/deduplicated medians 13/2 and construct an even-count unobserved-median example.',
  ],
  [
    '新两组Q2从无序类别频数求名称众数，反驳任意编码的数值平均；另以0/1/3或0/2/3等待生成精确4/3或5/3均分，保零与不同问题。',
    'New Q2s report nominal-category modes and reject arbitrary-code numerical means, then reconstruct exact 4/3 or 5/3 equal-share waits from 0/1/3 or 0/2/3, retaining zero and distinct purposes.',
  ],
  [
    '新两组Q4从均匀角度的半圆/三等分条件先重求A/B理论机会，再与完整假想记录分开，零次/零命中和下次不补偿均检查。',
    'New Q4s first derive A/B theory from uniform-angle half-circle/equal-third assumptions, then separate full fictional records, no trials, zero hits and unchanged next-trial chances.',
  ],
  [
    '新两组Q3按原ID合并A或B与B或C，实查重叠导致5/4或7/5错误，重数交集、非空零事件、空袋与移走一枚A后的条件。',
    'New Q3s form ID unions of A-or-B and B-or-C, expose overlap sums 5/4 or 7/5, recount intersections, nonempty zero events, empty bags and the bag after one A is removed.',
  ],
  [
    '新两组Q4从十/十二条原记录重数A/B，保末八条累计号3/5不替全批，画前三点与追加变远反例，区分零命中/零次及给定/程序/实测。',
    'New Q4s recount A/B over ten/twelve records, retain latest-eight starting indices three/five without replacing the full batch, plot initial points and an added-trial counterexample, distinguishing zero hits/no trials and given/software/observed sources.',
  ],
];
export const primaryCapstoneRecurrence = originalPrimaryCapstoneRecurrence.map(
  (entry) => {
    if (entry.sourceLesson.startsWith('P68-')) {
      const i = Number(entry.sourceLesson.slice(-2)) - 1;
      const question = [1, 2, 4, 3, 4][i]!;
      const detail = [
        [
          '新两组Q1亲画累计路程图，逆求停留35/60min及9/2km，重算往返15/2或56/9km/h，核等时特例、零及净位置不等路程。',
          'New Q1s construct cumulative-distance plots, invert stops 35/60min and distance 9/2km, recount return-trip averages 15/2 or 56/9km/h, and check equal-time exceptions, zero and displacement versus distance.',
        ],
        [
          '新两组Q2由原率算已装35、剩25/37及追加/总时间，核一泵零、双泵零、零时刻、满后自动停与真实条件改变。',
          'New Q2s compute 35 filled, 25/37 remaining and additional versus total time from original rates, checking one/both pumps off, time zero, automatic shutoff and changed real conditions.',
        ],
        [
          '复用J75/J76百分数Q6亲算连续同率不同基数；新两组Q4列账户/可用余额，独立核0/100%折扣、零预留与不足一分需舍入约定。',
          'Existing J75/J76 percent Q6s reconstruct sequential changes on different bases. New Q4s distinguish account balance/headroom and independently check 0/100% discounts, zero reserve and the need for a sub-cent rounding rule.',
        ],
        [
          '新两组Q3保缺测/零、截轴与原值，求原基数增长1/2、撤固定费反求人数、逐日必收费及恰整包/多一人边界。',
          'New Q3s retain missing/zero, truncated axes and records, derive original-base growth 1/2, undo fixed charges to recover visits and check daily fees plus exact-pack/one-extra boundaries.',
        ],
        [
          '新两组Q4亲画09:00至13:00逐段时刻，缩210min与加一人分支重算，另生成直达步道230min方案，不以单目标或唯一解代两条约束。',
          'New Q4s construct segment times from 09:00 to 13:00, recheck independent 210min/one-extra-person changes and generate a 230min direct-trail alternative without replacing joint constraints with one goal or a unique-answer claim.',
        ],
      ][i]!;
      return {
        ...entry,
        targets: [
          ...entry.targets,
          ...['J91', 'J92'].map(
            (u) => `${u}-MAINT-APPLIED-MEANING-Q${question}`,
          ),
          ...(i === 2 ? ['J75-MAINT-PERCENT-Q6', 'J76-MAINT-PERCENT-Q6'] : []),
        ],
        rationale: t(
          `${entry.rationale.zh} ${detail[0]}`,
          `${entry.rationale.en} ${detail[1]}`,
        ),
      };
    }
    if (entry.sourceLesson.startsWith('P67-')) {
      const i = Number(entry.sourceLesson.slice(-2)) - 1;
      const question = [1, 2, 4, 3, 4][i]!;
      return {
        ...entry,
        targets: [
          ...entry.targets,
          ...['J93', 'J94'].map(
            (u) => `${u}-MAINT-CHANCE-MEANING-Q${question}`,
          ),
        ],
        rationale: t(
          `${entry.rationale.zh} ${chanceDetails[i]![0]}`,
          `${entry.rationale.en} ${chanceDetails[i]![1]}`,
        ),
      };
    }
    if (!entry.sourceLesson.startsWith('P66-')) return entry;
    const i = Number(entry.sourceLesson.slice(-2)) - 1;
    return {
      ...entry,
      targets: [
        ...entry.targets,
        ...['J91', 'J92'].map((u) => `${u}-MAINT-CIRCLE-MEANING-Q${i + 1}`),
      ],
      rationale: t(
        `${entry.rationale.zh} ${circleDetails[i]![0]}`,
        `${entry.rationale.en} ${circleDetails[i]![1]}`,
      ),
    };
  },
);
