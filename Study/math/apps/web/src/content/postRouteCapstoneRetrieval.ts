import { t, type Question } from '../model';
import { reasoning } from './builders';
const makeSet = (unit: 'R01' | 'R02') => {
  const first = unit === 'R01',
    id = (i: number) => `${unit}-MAINT-PROJECT-Q${i}`;
  const area = first ? 12 : 15,
    eta = first ? '1/2' : '2/3',
    q = first ? 18 : 20,
    rain = first ? [12, 0, 0, 12, 0] : [9, 0, 0, 9, 0],
    factor = first ? 6 : 10;
  const setup = t(
    `独立虚构五日模型：A=${area} m²、η=${eta}、初始0 L、名义日需${q} L，雨量见完整日表。先收后供，容量C为非负整数升；无蒸发或备用，溢流离开系统，只供实际可供量。`,
    `SEPARATE fictional five-day model:A=${area} m²,η=${eta}, initial 0 L, nominal demand ${q} L/day, with rainfall in the COMPLETE daily table. Collect BEFORE supplying; C is a nonnegative integer in litres. No evaporation/reserve; overflow leaves the system and only available water is served.`,
  );
  const rainTable = {
    caption: t(
      '虚构名义情景完整五日雨量；时序不能重新排列',
      'COMPLETE fictional nominal rainfall; do not reorder time',
    ),
    columns: [t('日', 'Day'), t('雨量/mm', 'Rain/mm')],
    rows: rain.map((r, i) => [
      t(String(i + 1), String(i + 1)),
      t(String(r), String(r)),
    ]),
  };
  const captureRows = first
    ? [
        ['A1', 'A', '0', '0'],
        ['A2', 'A', '2', '12'],
        ['A3', 'A', '4', '24'],
        ['B1', 'B', '10', '48'],
        ['B2', 'B', '12', '46'],
        ['C1', 'C', '8', '47'],
        ['C2', 'C', '11', '49'],
      ]
    : [
        ['A1', 'A', '0', '0'],
        ['A2', 'A', '1', '10'],
        ['A3', 'A', '3', '30'],
        ['B1', 'B', '7', '60'],
        ['B2', 'B', '9', '57'],
        ['C1', 'C', '6', '62'],
        ['C2', 'C', '8', '56'],
      ];
  const captureTable = {
    caption: t(
      '假想分批观测：A校准，见B后改模，冻结候选后才另收C。V为入箱前采集L，不是箱内存量。',
      'HYPOTHETICAL batches:A calibrates; B prompts revision; C is newly obtained AFTER candidate freeze. V is collected litres BEFORE tank entry, not stored volume.',
    ),
    columns: [
      t('编号', 'ID'),
      t('批次', 'Batch'),
      t('雨量/mm', 'Rain/mm'),
      t('采集V/L', 'Collected V/L'),
    ],
    rows: captureRows.map((r) => r.map((s) => t(s, s))),
  };
  const make = (
    i: number,
    z: string,
    en: string,
    rz: string,
    re: string,
    h1z: string,
    h1e: string,
    h2z: string,
    h2e: string,
  ) =>
    reasoning(
      id(i),
      t(setup.zh + ' ' + z, setup.en + ' ' + en),
      'capstone-' + i,
      t(rz, re),
      [t(h1z, h1e), t(h2z, h2e)],
    );
  const questions: Question[] = [
    make(
      1,
      `容量C=${first ? 36 : 40}。从1mm·1m²的单位换算推每日日进水，列“期初水量/进水/截断后水量/溢流/实际供水/缺口/期末水量”五日账本，检查总水量平衡。总进水比总需求多，仍能第三日缺水吗，后来雨或首日溢水能补吗？为什么不能缺水时仍扣满需求而让存量为负？`,
      `Set C=${first ? 36 : 40}. Derive inflows from 1mm·1m², then write all five rows:opening/inflow/capped amount/overflow/served/deficit/closing. Check TOTAL water balance. Can day three fail even when total inflow exceeds total demand? Can later rain or earlier overflow repair that past deficit? Why not subtract full demand when water is unavailable?`,
      `${first ? 'I=6r，进水72,0,0,72,0 L。按所列七列，五日为(0,72,36,36,18,0,18)、(18,0,18,0,18,0,0)、(0,0,0,0,0,18,0)、(0,72,36,36,18,0,18)、(18,0,18,0,18,0,0)。总进144、需90、实供72、缺18、溢72、末0，0+144−72−72=0。' : 'I=10r，进水90,0,0,90,0 L。五日七列为(0,90,40,50,20,0,20)、(20,0,20,0,20,0,0)、(0,0,0,0,0,20,0)、(0,90,40,50,20,0,20)、(20,0,20,0,20,0,0)。总进180、需100、实供80、缺20、溢100、末0，0+180−100−80=0。'} 1mm=0.001m，乘1m²为0.001m³=1L，故I=Aηr而非另乘1000。一般b=min(C, s+I)，溢s+I−b，供=min(q, b)，末b−供，缺q−供，均非负。每日先后与容量限制不能由总和取代；未来水不倒流，离开的溢水不能再结转。输入是虚构固定数据，计算不验证实际收集率或所有天气。`,
      `${first ? 'I=6r gives inflows 72,0,0,72,0 L. In the stated SEVEN-column order, rows are(0,72,36,36,18,0,18);(18,0,18,0,18,0,0);(0,0,0,0,0,18,0);(0,72,36,36,18,0,18);(18,0,18,0,18,0,0). Total inflow 144, demand 90, served 72, deficit 18, overflow 72, closing 0:0+144−72−72=0.' : 'I=10r gives inflows 90,0,0,90,0 L. Seven-column rows are(0,90,40,50,20,0,20);(20,0,20,0,20,0,0);(0,0,0,0,0,20,0);(0,90,40,50,20,0,20);(20,0,20,0,20,0,0). Totals:inflow 180, demand 100, served 80, deficit 20, overflow 100, closing 0:0+180−100−80=0.'} One mm is 0.001 m; times 1 m² is 0.001 m³=one litre, so I=Aηr, without another factor 1000. In general b=min(C, s+I), overflow=s+I−b, served=min(q, b), closing=b−served, deficit=q−served, all nonnegative. Daily order/capacity cannot be replaced by totals. Future water cannot travel back and spilled water is no longer stored. These fictional inputs do not validate real capture efficiency or all weather.`,
      '先统一L单位，再严格按先收、截断、实际供水顺序。',
      'Convert to litres, then collect, cap and serve AVAILABLE water in that order.',
      '期末不可负；用初始+进−溢−实供=末作独立检查。',
      'Closing cannot be negative; check initial+inflow −overflow −served=closing independently.',
    ),
    reasoning(
      id(2),
      t(
        `另一个独立假想采集实验，线性候选V=${factor}r（r/mm、V/L），完整三批数据与使用先后见表。以|残差|≤${first ? 2 : 3} L为预定规则，逐点算线性预测和V实测−V预测；A全吻合证明全域吗？看B后改为min(${factor}r,${first ? 48 : 60})，再核B与冻结后新C。哪些能算独立验证，${first ? 'C都通过能保证什么' : 'C出现失败时应怎样报告'}？能用B或残差证明箱内溢流这个因果吗？再改模后能继续称C独立留出吗？`,
        `A SEPARATE hypothetical capture study proposes V=${factor}r, r in mm, V in L. All batches and their use order are in the table. Under the PRESPECIFIED inclusive rule|residual|≤${first ? 2 : 3} L, compute each linear prediction and observed −predicted residual. Does perfect A fit prove the full domain? AFTER seeing B, revise to min(${factor}r,${first ? 48 : 60}), recheck B and the NEW C obtained after freeze. Which are independent validation data,${first ? 'and what do all C passes guarantee' : 'and how should a C failure be reported'}? Can B/residuals establish tank overflow as the cause? If revised again, does C remain independent holdout?`,
      ),
      'capstone-2',
      t(
        `${first ? '线性A预测0,12,24，残差0；B预测60,72，残差−12,−26都超2。上限48模型在B预测48,48，残差0,−2，按≤2两点通过；但B已参与改模，是开发数据。冻结后C预测48,48，残差−1,+1均通过新验证。' : '线性A预测0,10,30，残差0；B预测70,90，残差−10,−33超3。上限60模型在B预测60,60，残差0,−3按≤3通过，但B已参与改模。冻结后C预测60,60，残差+2,−4，后者超3，须如实报告当前独立验证失败，不删点改阈值来造通过。'} C未用于选该冻结模型，才可检验它；若再用C改模型，C也成为开发数据，需另收独立数据。有限通过仅在给定点、范围、单位、容差和误差假设下未显示过大偏差，不证明全域真或所有原因。V在入箱前观测，箱内饱和不是从这些残差自动可识别的机制；还需测量质量、覆盖范围和生成过程证据。表为教学假想，不是已进行的真实实验。`,
        `${first ? 'Linear A predictions 0,12,24 have zero residuals. Linear B predicts 60,72, residuals −12,−26, both beyond two. The capped 48 model predicts 48,48 for B, residuals 0,−2, so BOTH pass the INCLUSIVE rule, but B helped choose the model and is development data. Frozen-model predictions for NEW C are 48,48, residuals −1,+1, both passing independent validation.' : 'Linear A predictions 0,10,30 have zero residuals. Linear B predicts 70,90, residuals −10,−33, beyond three. The capped 60 model predicts 60,60 for B, residuals 0,−3, passing the INCLUSIVE rule, but B was used in development. Frozen-model C predicts 60,60, residuals+2,−4:the second fails. Report the current independent validation failure rather than deleting it or moving the tolerance.'} Only C unused in choosing this frozen model tests it independently; if C prompts another revision, it too becomes development data and NEW independent observations are needed. Finite passes concern these points/ranges/units/tolerance/error assumptions, not universal truth or every causal mechanism. V was observed BEFORE tank entry; in-tank saturation is not identified automatically by these residuals. Check measurement quality, coverage and generating process. The table is a teaching construction, not an actual completed experiment.`,
      ),
      [
        t(
          '残差固定为实测−预测，逐点比较绝对值，等号可通过。',
          'Residual means observed −predicted; compare ABSOLUTE values pointwise, including equality.',
        ),
        t(
          '先按时间标明数据如何用过，不能改模后复用成未见留出。',
          'Track how data were used in time; model-development data do not become unseen holdout afterward.',
        ),
      ],
    ),
    make(
      3,
      `把每次完整五日账本当一次相同成本的供水判据F(C)调用，候选整数0…${first ? 100 : 127}。两算法都先检查上界U一次并缓存；若U失败就按单调性报无解。扫描从0递增、遇缓存不重算；二分lo 0, hi=U，mid=floor((lo+hi)/2)，通过改hi=mid，否则lo=mid+1，到lo=hi停止。求实际搜索轨迹、含预检的调用次数与最坏次数，证明F单调，别把调用数当秒数。另加价格${first ? '20+2C' : '30+3C'}筹码和预算${first ? 140 : 225}，联合判据还能套这段二分吗？`,
      `Treat a COMPLETE five-day ledger as one equal-cost supply predicate F(C) call over integers 0…${first ? 100 : 127}. BOTH algorithms first test upper U ONCE and cache it; if it fails, report none by monotonicity. Scanning increases from zero, reusing cached calls. Bisection starts lo 0, hi=U, tests floor((lo+hi)/2), sets hi=mid on success or lo=mid+1 otherwise, and stops at lo=hi. Derive actual traces, call counts INCLUDING precheck, and worst-case counts. Prove F monotone; calls are not seconds. Now add fictional price ${first ? '20+2C' : '30+3C'} tokens and budget ${first ? 140 : 225}:does the JOINT predicate still support that bisection?`,
      `${first ? '最小供水容量54。两法先调F(100)为真；扫描0…54共55次新调，加预检共56。二分后续试50,75,63,57,54,52,53，共7次新调，加预检共8。101候选扫描最坏101（上界缓存，不再重复），二分最坏1+7=8。预算给C≤60，联合仅54…60；C=54真而C=61假，U=100联合失败却中间有可行值，盲用预检甚至误报空集。' : '最小供水容量60。先调F(127)真，扫描0…60共61新调，加预检62。二分后续63,31,47,55,59,61,60，共7新调，加预检8。128候选扫描最坏128，二分最坏1+7=8。预算给C≤65，联合仅60…65；C=60真而C=66假，最大值联合失败不代表中间无解。'} 大容量与同初始、雨量、需求下，若期初大箱水不小，b=min(C, s+I)也不小，期末max(0, b−q)不小、缺口max(0, q−b)不大，归纳得供水可行性随C单调。上界供水失败才可推以下全失败。价格约束逆向收缩可行域，交集是窗口而非向上闭集，必须分开求供水阈值与预算，或完整枚举目录。统计清楚含预检/缓存、整数域与完整五日调用；不能把未计预检的7与含预检的扫描比较，也不声称这些次数就是实际运行时间。`,
      `${first ? 'The minimum supply capacity is 54. BOTH first call F(100), true. Scan 0…54 makes 55 NEW calls plus precheck=56. Bisection subsequently tests 50,75,63,57,54,52,53:seven new calls plus precheck=8. For 101 candidates, worst scan 101 with cached upper, worst binary 1+7=8. Budget restricts C≤60, so the joint set is 54…60:C=54 true, C=61 false. Joint U=100 fails despite feasible middle values; blind precheck would falsely report empty.' : 'The supply minimum is 60. BOTH first call F(127), true. Scan 0…60 makes 61 NEW calls plus precheck=62. Binary subsequently tests 63,31,47,55,59,61,60:seven new calls plus precheck=8. For 128 candidates, worst scan 128, worst binary 1+7=8. Budget gives C≤65, the joint set 60…65:C=60 true, C=66 false. Joint failure at the largest value does not rule out middle solutions.'} With identical initial state, rain and demand, larger capacity and no-smaller opening storage imply no-smaller b=min(C, s+I), no-smaller closing max(0, b−q) and no-larger deficit max(0, q−b). Induction proves supply feasibility is upward monotone. Only a failed U under THAT predicate rules out lower capacities. Price truncates the other way; the intersection is a window, not upward closed. Find the supply threshold then check budget separately, or enumerate a full catalogue. State precheck/cache rules, integer domain and COMPLETE ledger cost. Comparing a seven-call count omitting precheck to a scan including it is unfair, and call counts are not elapsed seconds.`,
      '先证明判据正确且单调，再按明确的上下界和缓存规则数调用。',
      'Prove predicate correctness/monotonicity before counting calls under the stated bounds/cache rules.',
      '预算不是供水条件的一部分；联合可行可能只是中间窗口。',
      'Budget is a separate constraint; JOINT feasibility may be only a middle window.',
    ),
    make(
      4,
      `在全部非负整数容量内最小化C。给一份没看过前题也能检查的报告：完整变量、单位、时序与雨量；证明任何更小容量不可能，验证最小候选五日账本，并检查小1升边界。C=${first ? 64 : 70}可行能直接说最优吗？目录或预算未给时是否可偷偷用前题预算？结论可保证现实所有天气吗？`,
      `Minimise C over ALL nonnegative integer capacities. Write a report checkable WITHOUT earlier tasks:givens, units, order/rain, an impossibility bound for EVERY smaller capacity, a five-day ledger at the minimum, and the one-litre-smaller boundary. Does feasibility at C=${first ? 64 : 70} prove optimality? May a catalogue or earlier task’s budget be silently assumed here? Does the result guarantee real weather?`,
      `${first ? '首三日只在首日进72 L，三次各18共54 L；收后储量≤C，因此C≥54必要。C=54五日期末36,18,0,36,18 L，每日实供18、无缺口，溢18,0,0,18,0，证明充分。C=53第三日缺1 L。C=64虽可行，却有54更小，故非最小。' : '首三日只首日进90 L，三次各20共60 L，收后储量≤C，故C≥60必要。C=60期末40,20,0,40,20，每日实供20、无缺口，溢30,0,0,30,0，故充分。C=59第三日缺1。C=70可行但不最小，60更小。'} 报告重述本题A、η、初始0、雨表、先收后供、无备用蒸发，给I=Aηr L和实际供水账本；必要性覆盖全部较小整数，充分性是这一个候选确实可行，两者共同证明最优。边界验证是交叉检查，不以只试两个数替代一般下界。当前目标仅容量，不含目录或预算，不能偷偷改变比较域/目标。虚构固定气候和效率下的模型结论不承诺实际所有天气，仍需测量与独立验证。`,
      `${first ? 'Only the FIRST day supplies 72 L before the first THREE demands of 18 L, total 54. Post-collection storage is at most C, so C≥54 is NECESSARY. At C=54, closing levels 36,18,0,36,18 L, served 18 every day, overflow 18,0,0,18,0 and zero deficits prove SUFFICIENCY. C=53 misses one litre on day three. C=64 is feasible but not minimal because 54 is smaller.' : 'Only day one brings 90 L before the first THREE demands of 20 L, total 60. Storage after collection is at most C, so C≥60 is NECESSARY. At C=60, closing 40,20,0,40,20, served 20 daily, overflow 30,0,0,30,0 and no deficits prove SUFFICIENCY. C=59 misses one litre on day three. C=70 is feasible but not minimal; sixty is smaller.'} Restate this task’s A,η, initial zero, rain table, collect-before-use/no reserve/no evaporation, with I=Aηr L and actual served quantities. Necessity covers ALL smaller integers; sufficiency verifies THIS candidate. Together they prove the optimum. The boundary run is a cross-check, not a replacement for the general lower bound. This objective is capacity alone; do not silently import a catalogue/budget or change the domain. Fictional fixed-weather/efficiency calculations promise no real all-weather guarantee; measurement and independent validation remain necessary.`,
      '找前面一段尚无补给的总需求，形成所有容量都必须满足的下界。',
      'Use a demand prefix with no replenishment to bound EVERY feasible capacity.',
      '最优需要下界加可行账本；单个较大候选通过不够。',
      'An optimum needs a lower bound AND a feasible ledger; one larger passing candidate is insufficient.',
    ),
    make(
      5,
      `目录C∈${first ? '{0,15,30,45,60,75,90}' : '{0,20,40,60,80,100,120}'}，价格${first ? '20+2C' : '30+3C'}筹码。完整枚举：①名义情景、预算${first ? 140 : 270}；②名义和日需${first ? 24 : 30} L高用量均无缺口、同预算；③同两情景、预算${first ? 170 : 330}。列全部可行目录、最便宜方案及账本依据。再加入名义日需但雨量改为${first ? '[9,0,0,0,12]' : '[6,0,0,0,9]'}的长干期，任意大空箱能补吗？给前缀不可能性证明。压力情景改变结论说明原算错了吗？报告假设、校准/独立验证和范围，不能只报一个漂亮容量。`,
      `Catalogue C∈${first ? '{0,15,30,45,60,75,90}' : '{0,20,40,60,80,100,120}'}, fictional price ${first ? '20+2C' : '30+3C'} tokens. Enumerate ALL feasible catalogue values and cheapest choices for(1)nominal, budget ${first ? 140 : 270};(2)BOTH nominal and high daily demand ${first ? 24 : 30} L, that same budget;(3)both scenarios, budget ${first ? 170 : 330}. Supply ledger evidence. Now add a nominal-demand long dry scenario with rain ${first ? '[9,0,0,0,12]' : '[6,0,0,0,9]'}:can ANY larger initially empty tank fix it? Give a prefix impossibility proof. Does changed stress-scenario feasibility prove the old arithmetic wrong? Report assumptions, calibration/independent validation and scope, not just one attractive capacity.`,
      `${first ? '名义阈值54，高用量需前三日72，首日进72可满足，阈值72。预算140给C≤60，①全可行{60}，最便宜60价140；②∅。预算170给C≤75，③全可行{75}、价170。名义选60期末42,24,6,42,24，高用量选75期末48,24,0,48,24，均每日无缺口。长干期前四日仅入54却需72，至少缺18，不论箱多大；晚到的第5日水不补过去。' : '名义阈值60，高用量前三日需90且首日进90，阈值90。预算270给C≤80，①全部{60,80}，最便宜60价210；②∅。预算330给C≤100，③全部{100}，价330。名义选60期末40,20,0,40,20，高用量选100期末60,30,0,60,30，均无缺口。长干期前四日只入60却需80，至少缺20，任何大空箱都不能凭空添水。'} 完整目录和成本、情景交集同时决定可行集，不能把连续/整数阈值自动当目录尺寸。长干期本身无解，加入联合要求后仍空集，提高预算也不修时间前缀缺水。原结论是名义情景内的条件命题，换需求/雨量改变输入和成功条件，不必然说明原运算错；若真实新证据挑战假设则重建并用新独立数据验证。说明所有给定是虚构；现实降雨、效率、蒸发、需求及维护均需证据，不能推广为所有天气的保证。`,
      `${first ? 'Nominal threshold 54. High use needs 72 L across the first three days and the first inflow is 72, so its threshold is 72. Budget 140 permits C≤60:(1)ALL feasible{60}, cheapest 60, cost 140;(2)empty. Budget 170 permits C≤75:(3)ALL feasible{75}, cost 170. At nominal C=60, closing 42,24,6,42,24; at high-use C=75, closing 48,24,0,48,24, both with no daily deficits. The dry prefix brings only 54 L before four demands totalling 72, a deficit of at least 18 for ANY capacity; day-five water cannot pay past demand.' : 'Nominal threshold 60. High use needs 90 L before replenishment and first inflow 90, so threshold 90. Budget 270 permits C≤80:(1)ALL feasible{60,80}, cheapest 60, cost 210;(2)empty. Budget 330 permits C≤100:(3)ALL feasible{100}, cost 330. At nominal C=60, closing 40,20,0,40,20; at high-use C=100, closing 60,30,0,60,30, both with no deficits. The dry prefix brings only 60 L before four demands totalling 80, a deficit of at least 20 for ANY capacity; an empty large tank creates no water.'} Catalogue, cost and the intersection of required scenarios jointly define feasibility; an integer/continuous threshold is not automatically a catalogue size. Dry conditions alone are impossible, so adding them to the joint requirement stays empty, and extra budget does not repair a timing deficit. The original conclusion was CONDITIONAL on nominal inputs; changing demand/rain changes assumptions/success criteria rather than automatically falsifying old arithmetic. If real new evidence challenges premises, rebuild and validate on NEW independent data. All givens are fictional; rain, efficiency, evaporation, demand and maintenance need real evidence before any all-weather claim.`,
      '先求各情景阈值/不可能性，再把目录、预算一起筛，不漏更便宜者。',
      'Find each scenario’s threshold/impossibility, then filter the ENTIRE catalogue with budget, including cheaper entries.',
      '长干期先看未来补水前的前缀总量；大容量不制造水。',
      'Check the dry PREFIX before future replenishment; larger capacity creates no water.',
    ),
  ];
  questions[0]!.contextTable = rainTable;
  questions[1]!.contextTable = captureTable;
  questions[2]!.contextTable = rainTable;
  questions[3]!.contextTable = rainTable;
  questions[4]!.contextTable = rainTable;
  return {
    id: `${unit}-MAINT-PROJECT`,
    unit,
    title: t(
      first ? '用新账本重建模型与验证' : '在新情景中质疑模型结论',
      first
        ? 'Rebuild modelling and validation with a new ledger'
        : 'Challenge model conclusions in changed scenarios',
    ),
    bridge: 'H38-L01',
    bridgeByQuestion: Object.fromEntries(
      questions.map((q, i) => [q.id, `H38-L0${i + 1}`]),
    ),
    intro: t(
      '本组承接H38，在另一次学习时段做新情境；可一次只核一个小问，全部核齐后确认。每题完整给定，不能借上一题未声明的预算或结论。雨量、观测和筹码均虚构，不当用户试用或真实工程建议。',
      'Revisit H38 in a different sitting with new contexts, one subpart at a time; confirm only after EVERY part is reviewed. Each task is self-contained:do not import an unstated budget/result from another task. Rainfall, observations and tokens are fictional, not user trials or actual engineering recommendations.',
    ),
    questions,
  };
};
export const postRouteCapstoneRetrieval = {
  R01_PROJECT: makeSet('R01'),
  R02_PROJECT: makeSet('R02'),
};
