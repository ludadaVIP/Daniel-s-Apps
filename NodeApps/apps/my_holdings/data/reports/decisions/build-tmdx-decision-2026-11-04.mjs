import fs from "node:fs/promises";
import { validateDecisionReport, decisionEntryPlan, scenarioReturn } from "../../../src/decision-reports.js";

const evidence = JSON.parse(await fs.readFile(new URL("./tmdx-evidence-model-2026-11-04.json", import.meta.url), "utf8"));
const notes = JSON.parse(await fs.readFile(new URL("./tmdx-debate-notes-2026-11-04.json", import.meta.url), "utf8"));
if (evidence.status !== "evidence-model-and-independent-audit-complete") throw Error("Wait for the audited model.");
const f = evidence.facts, m = evidence.model, base = m.scenarios.find((s) => s.id === "base");
const n = (v, decimals = 2) => v.toLocaleString("en-US", { maximumFractionDigits: decimals, minimumFractionDigits: decimals });
const pct = (v) => `${n(100 * v, 1)}%`;
const dollars = (v) => `$${n(v)}`;
const close = (a, b, label) => { if (Math.abs(a - b) > 1e-8) throw Error(`Independent reconstruction failed: ${label}`); };

// Reconstruct FCFF, financing costs, conversion, debt and both valuation methods.
for (const s of m.scenarios) {
  const converted = s.capitalRoute === "full_conversion";
  const netStart = m.assumptions.startingDebtB - m.assumptions.startingCashB - (converted ? .459996 : 0);
  let netDebt = netStart, previousRevenue = .747;
  const coupon = .459996 * .015 * .75;
  const flows = s.revenue.map((revenue, i) => {
    const da = revenue * (.06 - .01 * i / 9);
    const capex = revenue * (.03 + .06 - .03 * i / 9);
    const delta = .12 * (revenue - previousRevenue);
    const fcff = revenue * s.margin[i] * .75 + da - capex - delta;
    const finance = (netDebt > 0 ? netDebt * (i < 2 ? .045 : .065) * .75 : netDebt * .025) + (converted && i < 2 ? coupon : 0);
    netDebt += finance - fcff;
    close(fcff, s.result.rows[i].FCFF, `${s.id} FCFF/${2027 + i}`);
    close(netDebt, s.result.rows[i].netDebtEnd, `${s.id} debt/${2027 + i}`);
    previousRevenue = revenue;
    return fcff;
  });
  const tv = s.revenue.at(-1) * (1 + s.g) * s.margin.at(-1) * .75 * (1 - s.g / s.terminalROIC) / (s.wacc - s.g);
  const ev = flows.reduce((sum, cf, i) => sum + cf / (1 + s.wacc) ** (i + 1), 0) + tv / (1 + s.wacc) ** 10;
  const couponPv = converted ? coupon / (1 + s.wacc) + coupon / (1 + s.wacc) ** 2 : 0;
  close((ev - netStart - couponPv) / s.result.sharesB, s.result.todayValue, `${s.id} today`);
  const ev2031 = flows.slice(5).reduce((sum, cf, i) => sum + cf / (1 + s.wacc) ** (i + 1), 0) + tv / (1 + s.wacc) ** 5;
  close((ev2031 - s.result.rows[4].netDebtEnd) / s.result.sharesB, s.result.year5Price, `${s.id} 2031`);
  const multipleEV = s.revenue[1] * s.margin[1] * s.ebitMultiple2028 / (1 + s.wacc) ** 2 + flows[0] / (1 + s.wacc) + flows[1] / (1 + s.wacc) ** 2;
  close((multipleEV - netStart - couponPv) / s.result.sharesB, s.result.independentEbitComparison.todayPrice, `${s.id} independent EV/EBIT`);
}

const ranges = m.entryFormula.suggestedRanges;
const scenarios = m.scenarios.map((s, i) => ({ id: s.id, label: ["悲观", "基准", "乐观"][i], todayValue: s.result.todayValue, year5Price: s.result.year5Price,
  assumptions: [
    "2027收入8.0亿→2031年9.6亿→2036年11.4亿美元；GAAP营业率9%→12%→15%，WACC14%、终值g2.5%、ROIC10%；可转债按现金本金偿还、37百万股。增长/利润失速且净融资负担保留。",
    "2027收入8.6亿→2031年14.01亿→2036年19.84亿美元；GAAP营业率14%→25%→28%，WACC11.5%、g3.5%、ROIC18%；可转债现金偿付、37百万股，并假设必要时可再融资。",
    "2027收入9.2亿→2031年19.384亿→2036年31.441亿美元；GAAP营业率16%→32%→35%，WACC10%、g4%、ROIC25%；可转债全转股、41.893805百万股，不再扣本金，保留转股前票息。"
  ][i] }));
const baseComparison = base.result.independentEbitComparison.todayPrice;
const report = {
  version: 1, symbol: "TMDX", name: "TransMedics Group, Inc.", exchange: "NASDAQ Global Select Market", currency: "USD", capitalUsd: 400000, horizonYears: 5,
  analysisDate: "2026-11-04", financialPeriod: "2026 Q2 / H1；Q3尚未发布",
  dataAsOf: "2026-11-04核验；财务实际截至2026-06-30，全年指引于2026-09-10重申；Q3定于美东11月5日盘后公布。报告报价为11月3日历史盘后参照，非实时成交。",
  quote: { price: 68, date: "2026-11-03", type: "已核验盘后历史参照", source: "Moomoo实际报价页面", sourceUrl: "https://www.moomoo.com/stock/TMDX-US",
    note: "Moomoo页面标Post 20:02 ET、68.00美元，对应2026-11-04 01:02 UTC；已过数小时，不是20分钟内核验的新鲜成交。正式收盘67.34美元为11月3日16:00 EST。BOATS指示价约67.29、页面有open/realtime标记，但无独立最新成交时间戳，仅作背景。应用67.305快照保留。[S10][S14]" },
  verdict: { stance: "观察；财报前不新增，等价格与资金安排改善", summary: "OCS有临床与网络价值，但低PE含一次税收收益，2027–28资金义务需核实。基准今日约57–71美元，68美元参照价缺少足够安全边际；Q3后再重核三档及旧55美元买单。", confidence: "中低：商业价值可解释，资金期限、临床投入回报、利润恢复和即将发布财报仍影响很大", valueLow: 57, valueHigh: 71,
    conclusion: `TransMedics不是简单的低PE便宜医疗股，也不是没有商业壁垒的运输商。OCS、临床流程与NOP物流有价值，但Q2收入增长而营业利润下滑，2025净利润又含一次税收收益，必须按正常化现金与全部融资索偿估值。基准两法今天约${dollars(base.result.todayValue)}–${dollars(baseComparison)}，68美元盘后参照处在这一区间上部；基准2031期末${dollars(base.result.year5Price)}，五年年化约${pct(scenarioReturn(base.result.year5Price, 68))}，不足本轮约15%门槛。当前不再新增。条件观察${ranges.observation.join("–")}、安全${ranges.safety.join("–")}、折价${ranges.discount.join("–")}美元，全部须等11月5日Q3披露后重核。已有20股×55美元本地买单高于本轮观察上限，不因它已存在就视为已通过研究。`,
    limitations: "当前最新实际财报仍为Q2，Q3将在11月5日盘后提供新信息；本版不是跨越财报事件仍自动有效的GTC建议。6月现金、7月股数与PAD投资实际成本/股权比例均需最新文件更新。37百万与全转股41.893805百万是情景估值股数，不等于当日流通股；预测假设利润含SBC、未来费用抵消净稀释，仍可能低估股数增长。净债务滚存不是实际逐笔付款表，不能证明2027购楼或2028偿债一定安全，也未核验已承诺再融资。临床、报销、竞争和内控风险不能可靠给出概率。历史表展示2023–2025完整年度及最新H1/TTM，未声称十年历史审计。用户全部资产、可承受回撤、税务与流动性需求未知，组合适配仍不完整。" },
  position: { currentAdditionalPct: 0, targetPct: 1, maxPct: 2, existingExposureUsd: 0, pendingBuyUsd: 1100,
    rationale: "财报前不再新增。条件成立后，公司总敞口目标1%=4,000美元，上限2%=8,000美元；即使有较好的临床/网络经济性，经营、内控与到期融资风险叠加也不适合直接做核心大仓。假设单股压力损失80%，1%仓位会损失组合约0.8%，2%约1.6%；极端全损更大且与其他成长资产可能同时下跌，这不是最大回撤保证。先扣已排1,100美元潜在订单，剩余条件预算2,900美元，按25%/35%/40%分配，不因为财报跳空或价格下跌就补满。",
    portfolioFit: "保存持仓和已持QQQM/VOO/SMH/SOXX完整历史成分中，未记录TMDX直接或间接敞口；基金披露日期为9月末/10月23日等，非实时成分。已排working本地限价买单20股×55美元=1,100美元，未视作已成交，但已从可新增预算预留。原卡片62美元观察价、2%手填仓位和55–62/45–55区间属于旧手工计划，本报告独立给出新条件，不自动把旧计划当成价值证据。所有个股及买单共享40万美元预算；先核验现有订单与总主题风险，再决定新增。" },
  entries: [
    { tier: "observation", low: ranges.observation[0], high: ranges.observation[1], budgetSharePct: 25, condition: `仅在Q3后复核增长、营业率、现金流与融资安排仍支持基准后讨论。上限=min(${n(base.result.year5Price, 4)}/1.15^5，${n(base.result.todayValue, 4)})=${n(m.entryFormula.returnPriceCap, 4)}，向下取${ranges.observation[1]}。已有55美元买单高于本上限，须按新财报重新判断。` },
    { tier: "safety", low: ranges.safety[0], high: ranges.safety[1], budgetSharePct: 35, condition: `基准今日价值25%折让=${n(base.result.todayValue, 4)}×0.75=${n(m.entryFormula.caps.safety, 4)}，向下取43.0；同时满足约15%回报买价上限。需要临床/服务单位经济性、回款和2027–28资金桥得到更清晰证据。` },
    { tier: "discount", low: ranges.discount[0], high: ranges.discount[1], budgetSharePct: 40, condition: `基准今日价值40%折让=${n(base.result.todayValue, 4)}×0.60=${n(m.entryFormula.caps.discount, 4)}，向下取34.4。价格大跌若来自临床/监管、客户、内控或再融资失效，先停下重建模型；28美元是本轮重审边界，不是底价保证。` }
  ],
  scenarios,
  masters: notes.masters.map((view, i) => ({ ...view, evidence: `${view.evidence} ${["[S1][S2]", "[S1][S3][S7][S8]", "[S1]", "[S1][S3]", "[S1][S2]", "[S1][S5][S7]", "[S1][S2][S4]"][i]}` })),
  debate: notes.debate,
  sections: [
    { title: "买的是什么：产品、临床服务与物流系统", body: "公司开发OCS器官灌注与评估系统、配套一次性耗材，并通过NOP提供器官获取/灌注相关临床服务与航空、地面协调等物流。客户为移植中心与OPO等；收入不是单纯出售一台机器，更不是只赚飞机运费。OCS试图提高可用器官利用、支持评估和完成复杂时效流程；临床采用、训练、可靠服务和网络密度可形成转换摩擦。[S1][S2][S3]\nQ2产品收入111.158百万美元、成本25.566百万，计算产品毛利约77.0%；服务收入78.790百万、成本51.184百万，服务毛利约35.0%。服务占当季收入约41.5%，其中包括多种临床/物流服务，不能把它全部叫航空收入。产品与服务组合变化会影响合并毛利，服务带来的客户价值也不能只看单一毛利率。\n2025美国按器官归属OCS收入584.697百万，肝459.415百万约占78.6%、心111.839百万、肺13.443百万；这一分部不是全球全部营收，不强行归一化。肝业务既是核心优势，也带来增长集中；心、肺、国际和新适应范围的潜力需独立验证，不能把研究项目当已经商业化收入。[S2]" },
    { title: "成长空间与竞争：有系统优势，也有强对手", body: "增长驱动来自更多中心采用、器官利用、肝/心任务量、NOP覆盖、国际扩张及新一代产品/临床研究。Gen3、Kidney、CHOPS等项目各自有临床、监管、商业化与资本投入门槛；没有可靠概率时不把它们强行概率加权成确定市值。[S1][S7]\nTerumo已完成OrganOx收购，并继续推进灌注相关合作；竞争不再只是资源有限的新创。静态冷保存、低温/其他灌注方案及医院自身流程也是替代，差异要通过适应范围、临床证据、工作流与总成本验证，而不是只比设备技术词汇。[S8][S9]\n公司护城河的最强论点是临床使用、耗材与服务协同、可靠物流和规模密度；最强反方是对手资金与产品改善、报销/医院预算压力，以及航空/制造固定成本需要持续高利用率。Q2及H1没有单一客户占收入超过10%，应收也未见单客户超过10%，降低了直接大客户集中风险；但支付与监管制度依赖仍可影响全行业。部分组件、分组件和灭菌依赖有限/单一供应商，未披露的集中比例不猜测。[S1]" },
    { title: "历史财务：收入成长与利润、现金必须一起看", body: `单位为百万美元，GAAP及报告现金流口径。[S1][S2]\n2023：收入241.623，毛利154.093（${pct(154.093/241.623)}），营业亏损28.727，净亏25.028，CFO−13.028，现金CapEx151.847，FCF−164.875。\n2024：收入441.540，毛利262.081（${pct(262.081/441.540)}），营业利润37.496，净利35.464，CFO48.803，现金CapEx129.744，FCF−80.941。\n2025：收入605.494，毛利362.806（${pct(362.806/605.494)}），营业利润108.583，税前107.522，净利190.291；CFO192.840，现金CapEx59.251，FCF133.589。现金CapEx下降与营运资本时点使单年FCF不能无条件外推。\n2026H1：收入363.881，毛利214.359，营业利润37.033，税前27.890，净利21.997；CFO41.842，现金CapEx43.749，FCF=41.842−43.749=−1.907。去年H1 CFO88.754、现金CapEx36.113，现金转换明显弱化。\n2026Q2：收入189.948，约同比+21%；营业利润23.736，去年36.567，约下降35%；营业率12.5%对比23.2%。研发/临床费用31.632对比15.934百万，投入接近翻倍，是利润分化的重要线索，不自动等于无效投入。Q2净利14.682、GAAP摊薄EPS0.41。\nH1 SBC18.558百万，D&A现金流列示22.106百万；应收与存货增长分别耗现约19.948和10.246百万。报告FCF=CFO−现金CapEx，不自动等于可用WACC折现的FCFF。当前TTM收入668.468、CFO145.928、现金CapEx66.887、报告FCF79.041百万；估值模型从GAAP EBIT、正常现金税和再投资重新建模。` },
    { title: "低PE的陷阱：一次税收收益与正常化利润", body: "2025净利190.291百万高于税前利润107.522百万，是因为全年所得税净收益82.769百万；其中递延税资产估值准备转回的毛额约103.3百万，与全年净税收收益不是同一数字。[S2]\n截至2026Q2的TTM税前利润=107.522+27.890−62.858=72.554百万。简单按正常税25%估算税后54.4155百万，是研究筛查口径，不是公司已报告净利润；TTM已报告净利151.699百万仍被税务一次项抬高。不能据行情中约17–18倍TTM P/E就认定便宜，也不把已报告GAAP数字改写成‘错误’。\n2025曾评估Section382，历史所有权变化使gross美国递延税资产减少约44.7百万并与估值准备相抵；不把全部历史亏损面值当现金资产。本模型所有预测按25%正常现金税，不另外加整份递延税资产现金价值。若税盾后来被证明可用，可以按真实使用时点补入，而不是既降低未来税又加税资产重复计值。[S1][S2]" },
    { title: "资本配置：总部融资租赁不是飞机现金CapEx", body: "6月末现金472.675百万，受限现金另有18.438百万；不要从已排除受限现金的472.675里重复扣一次。飞机总成本约295.563百万，H1相较去年末295.527百万基本不变，不能把全部43.749百万现金CapEx都说成买新飞机。公司飞机折旧寿命10年、残值按原值50%估计；实际维护、发动机大修、替换和二手残值未必等于账面折旧假设。[S1][S2]\n2026年1月签署Somerville约498,286平方英尺总部/研发/实验/制造等大楼融资租赁，合同到2044年；若不购买，基本租金2028年起约23.9百万/年并递增。但公司会计认定较可能行使购买权，披露的付款表列2027年374.590百万、2028后为0。不能同时把这份付款表与2044年前全部租金当两项必须支付的义务。\nH1新确认非现金融资ROU/负债约340.040百万，期末融资负债347.660百万；另有地产购买应付款3.986百万。这是总部相关融资索偿，不是当期飞机现金CapEx。已完成邻接地块约30百万支出已在历史现金/资产里，估值日后不再当新项目扣一次。\n本报告采用融资口径：GAAP EBIT含总部/飞机等折旧，D&A加回，融资租赁负债进入净债务；2027购楼作为清偿该既有融资索偿，不在FCFF又全额扣374.590，也不再扣全期同一租金。未来装修、维护、飞机与OCS资本需要仍单独列入预测。这个统一处理避免重复扣减，但不意味着到期付款没有流动性风险。" },
    { title: "2027–2028资金期限、PAD与可转债路线", body: `原始期限对照：总部按会计假定2027付款374.590百万，CIBC六月本金60百万、到期2027年7月（2026年7月起月供），2028年6月1日可转债本金459.996百万。按六月本金快照合计894.586百万，并非同一天到期，也不是全部未变化的最终付款额；对照最后披露非受限现金472.675百万，未来CFO、资本需求和融资安排必须核验。[S1]\nCIBC六月利率6.2%，担保涉及公司大部分资产含IP，另有最低流动性/收入约束。公司所说至少未来12个月资金足够，不能自动推及全部2027末与2028义务；未核验到已承诺的全部再融资，不把预测融资写成现成额度。\nPAD投资7月1日交割、7月6日公告；德国运营商有九架Phenom300飞机和40多名飞行员等资源，但已读公告/期后注释未量化购买成本与持股比例。本模型不单独加PAD整块利润/资产，暂留25百万的投资/流动性储备纯属研究假设，不是已披露交易价；欧洲增长已在经营路径里，不再另外加选择权重复计值。[S5]\n现金桥：472.675−运营储备30−PAD等示例储备25=417.675百万。融资索偿=459.996+60+347.660+3.986=871.642百万；基准净债务453.967百万。六月至估值日的真实现金、月供和PAD实际付款需Q3替换，年度近似误差不能隐藏。\n可转债票息1.5%、初始转换价约94美元，对应4.893805百万股。悲观/基准按现金本金偿付、保留债务且用37百万股；乐观按全转股、去掉459.996百万负债且用41.893805百万股，并扣转股前两年税后票息现值。不能全扣本金又加转换股数，也不能假设股票大涨后只以本金现金买断全部转换价值。已付52.1百万capped-call成本已在历史现金中，不再扣一次；未来对冲收益保守未计。[S1][S2]\n乐观模型移除可转债后的‘净现金’只是权益估值资本桥，不是2027实际可用现金。净债务滚存也不是逐笔付款日历；总部付款、贷款和PAD资金仍需真实总现金、到期计划和银行额度证明。基准2031净现金约${n(-base.result.netDebt2031*1000)}百万不能反过来证明2027–2028不会出现融资缺口。` },
    { title: "治理与临床风险：精确描述已知与未知", body: "Q2管理层认定披露控制无效，重大弱点涉及制造网络库存流转的季度记录控制；年末存在性/准确性已有相关控制，新期中盘点、系统、监控与复核措施虽于Q2实施，但尚未运行/测试足够时间来确认整改。管理层称经额外程序后本10-Q报表仍公允反映。这是明确披露的治理风险，不是财务造假的判定。[S1]\n9月更换CFO、同时重申指引；人事变化可能帮助控制与国际资本配置，也不能仅凭履历认定问题已经解决。应追踪正式整改结论、库存与收入/现金核对、关联交易和资本承诺披露。[S6]\n临床、监管、器官利用、产品可靠性、报销与FAA/EASA运输许可都能影响业务。投资评估使用正式许可、临床资料、监管行动和原始披露；不从做空指控或公司反驳直接跳到临床因果结论。FDA明确提醒MAUDE不良事件报告不能单独估计发生率、比较产品安全性或确定因果；本次不把搜索摘要或报告数量当成已证实的事故率，也没有据未检索到某文件就断言不存在监管风险。[S13]\n关键反证不是‘网络上有负面声音’，而是可核实的监管限制、临床适用范围/结果变化、客户行为、产品可靠性或披露信任受损。若影响到生意能否理解和继续经营，应先暂停投入，不靠更低价格补偿无法量化的风险。" },
    { title: "估值一：十年FCFF与真正的五年期末价", body: `单位：十亿美元、十亿股。2026收入起点0.747，为737–757百万指引中点，不是实绩，且当时指引排除PAD。采用2026年末附近年度近似，显性期2027–2036。[S3][S6]\nFCFF=GAAP EBIT×0.75+D&A−维持/替换CapEx−成长CapEx−ΔNWC。GAAP利润含SBC，不将其加回；D&A从收入6%降至5%，包含总部和飞机/OCS等折旧；维持/替换CapEx为收入3%，成长CapEx从6%降至3%，总CapEx从9%降至6%，均为自建假设，不是公司披露的维持/成长拆分。ΔNWC=收入增量12%。\n终值NOPAT=2036收入×(1+g)×终值营业率×0.75；终值FCFF=NOPAT×(1−g/ROIC)，TV=FCFF/(WACC−g)，为永续增长保留再投资。未来总部购买作为已有融资索偿的结算，不在FCFF重复扣；其他维护/扩张已在资本预算。\n输入序列逐项对应2027–2036：\n${m.scenarios.map((s) => `${s.id}收入：${s.revenue.join("/")}；GAAP营业率：${s.margin.map((v)=>n(v*100,1)).join("/")}%；WACC${pct(s.wacc)}、g${pct(s.g)}、终值ROIC${pct(s.terminalROIC)}。`).join("\n")}\n股权=EV−路线一致的起始净债务−需要单列的转股前票息PV，再除路线一致股数。37百万是从最新实股34.675145百万加权益激励索偿向上取的保守估值代理；不能直接拿Q2 GAAP摊薄加权40.709227百万再全扣可转债本金。未来SBC假设其费用抵消新增稀释的经济成本，并非公司回购承诺；股数敏感性另列。\n结果悲观/基准/乐观今日${m.scenarios.map((s)=>dollars(s.result.todayValue)).join(" / ")}；2031期末分别${m.scenarios.map((s)=>dollars(s.result.year5Price)).join(" / ")}。2031价格用当时剩余2032–2036 FCFF/终值减净债务，不能把今天${n(base.result.todayValue)}当第五年卖价。无股息假设下年化=(2031价格/入场价)^(1/5)−1。\n净债务End=前期净债务+税后净融资成本−FCFF；2027/28税前净融资率4.5%、以后6.5%，正净债务再乘0.75；净现金2.5%为已税后收益。乐观另外付转股前两年税后票息。该净额桥只用于分析，现金偿付基准假定必要时能再融资，不是已承诺融资；失败可迫使增发或大幅破坏价值。悲观仍不是最坏情况，永久损失可以更大。` },
    { title: "估值二：2028正常化EBIT的独立倍数校验", body: `采用不同逻辑的2028营业利润校验，而非调DCF参数冒充第二种方法。悲观/基准/乐观2028收入×GAAP营业率得到EBIT ${m.scenarios.map((s)=>n(s.revenue[1]*s.margin[1]*1000)).join(" / ")}百万美元，分别给16/22/28倍EV/EBIT，折现两年至今天，并加回2027/28可分配FCFF现值，再扣同一资本索偿、除同一股数。结果约${m.scenarios.map((s)=>dollars(s.result.independentEbitComparison.todayPrice)).join(" / ")}。\n16/22/28倍是研究假设。外部市场参照截至11月3日，Stryker SYK EV/TTM EBIT约20.69倍、Edwards EW约28.01倍；两者规模、分散度、产品组合与资产强度均不同，也可能自身高估，不能直接把成熟医疗器械倍数贴到器官产品+物流企业。[S11][S12]\n基准DCF${n(base.result.todayValue)}与EBIT校验${n(baseComparison)}构成本轮约57–71美元今天交叉参考，不是确定上下界。悲观DCF约${n(m.scenarios[0].result.todayValue)}说明增长放缓、利润率承压与融资索偿可以使股东价值被强烈压缩，不能仅凭医疗需求稳定就忽略杠杆。乐观则体现更高临床/国际兑现和利润率的真实上行路径。` },
    { title: "逆向预期、敏感性与最强反方", body: `逆向DCF固定2026指引中点747百万、基准GAAP营业率14%→28%、正常税25%、资本与营运资本假设、WACC11.5%、g3.5%、ROIC18%、现金偿债37百万股。若2027–2036按恒定增长，要支持68美元，收入需约${pct(m.reverseDcf.requiredRevenueCagr)} CAGR，2031约${n(m.reverseDcf.revenue2031*1000)}百万、2036约${n(m.reverseDcf.revenue2036*1000)}百万。这只是一组条件解，不是市场真正预测；更早恢复利润或更低风险可以替代增长。\n基准WACC×终值g敏感性（美元/股）：\n${[.10,.115,.13].map((w)=>`WACC${pct(w)}：`+m.sensitivity.filter((v)=>v.wacc===w).map((v)=>`g${pct(v.g)}=${n(v.todayValue)}`).join("；")).join("\n")}\n基准终值现值占业务EV约${pct(base.result.terminalPVShare)}，乐观约${pct(m.scenarios[2].result.terminalPVShare)}，远期利润和资本回报仍影响很大。每年额外CapEx增加收入1%/2%时，基准今天约${m.extraCapexSensitivity.slice(1).map((v)=>n(v.baseTodayValue)).join(" / ")}美元；额外净增2/4百万股约${m.shareSensitivity.slice(1).map((v)=>n(v.baseTodayValue)).join(" / ")}。\n资本路线敏感性不能被当作任意挑高估值：低股价时强制全转股未必符合持有人权利；高股价时现金结算转换索偿不能只付本金。乐观已用更大股数和移除本金的匹配路线，未来capped-call收益未加。\n[模型可能低估] R&D/临床投入扩大适应范围、NOP任务密度改善、国际网络复制与产品升级可能让增长和利润恢复高于基准。\n[模型可能高估] 基准长期28%营业率、18%终值ROIC、飞机/设施维护替换预算、能获得再融资、未来激励费用可抵消稀释，都可能过宽。新项目失败、报销或竞争压力、残值偏低、PAD投入超储备会降低价值。没有独立证据时，不为贴现价同步抬高多个参数，也不把临床选择权全部定为零。` },
    { title: "三档价格、限价预算与可能收益", body: `本轮采用五年、现货、无杠杆，约15%税费前年回报作为研究门槛，接近用户已存五年翻倍目标；不是收益承诺。三年翻倍需约26%年化，门槛更高。\n回报买价上限=${n(base.result.year5Price,4)}/1.15^5=${n(m.entryFormula.returnPriceCap,4)}；安全边际参考为今天基准${n(base.result.todayValue,4)}，25%折让${n(m.entryFormula.caps.safety,4)}、40%折让${n(m.entryFormula.caps.discount,4)}。向下取整形成${ranges.observation.join("–")}、${ranges.safety.join("–")}、${ranges.discount.join("–")}三个不重叠区间。区间带宽是计划边界，不是统计置信带；低于28美元需重新调查，不能机械补仓。\n68美元参照价下，五年悲观/基准/乐观总涨幅约${scenarios.map((s)=>pct(s.year5Price/68-1)).join(" / ")}，年化约${scenarios.map((s)=>pct(scenarioReturn(s.year5Price,68))).join(" / ")}。模型不分配概率，不平均成‘预期收益’。\n在各档上沿买入、基准2031兑现时，年化约${[ranges.observation[1],ranges.safety[1],ranges.discount[1]].map((p)=>pct(scenarioReturn(base.result.year5Price,p))).join(" / ")}；若悲观兑现仍可能大幅亏损。折价不能替代临床、治理与生存性审查。\n目标4,000美元，先扣0已持敞口与1,100美元已排买单，剩余2,900按25%/35%/40%分725/1,015/1,160美元；股数按区间上沿向下取整。已有55美元买单比本轮51.2观察上限高，限价仅控制成交价格，不能控制财报后价值下修。Q3后先重核收入/营业率/CFO、购楼与2028资金安排、PAD成本和内控整改，再决定采用哪些限价条件。` },
    { title: "失效、催化与机会成本", body: "最重要的近期催化是11月5日美东盘后Q3结果及16:30 EST电话会，即新西兰11月6日10:30 NZDT。[S4] 催化提供新信息，不保证股价上涨；不能将尚未公布的Q3写成实绩。\n经营风险看产品/服务组合、NOP任务量、单位贡献、利用率和回款；研发/临床投入要对应可核验里程碑。财务风险看实际总现金、到期本金、融资承诺与资本开支，而不只是2031净债务。治理看库存控制是否正式整改完成，不能把实施措施当成已有效。\n新临床/监管限制、正式召回或适应范围变更、报销变化、客户实质流失和资金链困难都可能使旧买价失效；没有概率依据时不捏造‘低风险’评分。假设破坏后即使价更低也应暂停投入。\n机会成本包括财报前保持不动、等待信息和更好的价格，以及与低成本宽基或其他可理解企业比较。公司有价值不意味着每个时间都值得加仓；也没有必要为66支股票都安排一笔订单。" }
  ],
  figures: [
    { title: "完整财年实际收入", unit: "百万美元；GAAP", note: "[S2]。2023–2025收入成长显著；现金回报仍需结合资本投入与税收口径。", rows: [2023,2024,2025].map((y)=>({label:String(y),value:f[y].revenueM})) },
    { title: "2025利润的不同口径", unit: "百万美元；实绩与研究正常化分开", note: "[S2]。前两项为已报告数，第三项=税前107.522×75%，仅作正常税研究示例；不把税收一次项当经营增长。", rows: [{label:"GAAP净利润",value:190.291},{label:"报告税前利润",value:107.522},{label:"25%税示例",value:107.522*.75}] },
    { title: "2025美国OCS收入按器官归属", unit: "百万美元；非全球全部收入", note: "[S2]。肝约占美国本口径78.6%，既是核心优势，也代表成长来源集中。", rows: [{label:"肝",value:459.415},{label:"心",value:111.839},{label:"肺",value:13.443}] }
  ],
  invalidation: [
    "Q3或后续财报显示收入/任务增长、GAAP营业率和现金转换不支持基准，或临床投入缺少可信里程碑：停止新增并重估，不单靠旧PE或价格下跌加仓。",
    "2027总部/贷款与2028可转债资金安排不清晰、现金不足、融资条件明显恶化或需要大量低价增发：更新股数、成本与生存情景，暂停原限价条件。",
    "新增临床/监管、产品可靠性或报销证据实质削弱OCS/NOP经济性，或竞争导致价格/份额/单位利润显著受损：重估护城河与终值。",
    "库存控制重大弱点长期未整改或出现更严重会计/治理疑点：先核验信任与可理解性，不把价格折扣当充分补偿。",
    "PAD、飞机/大楼维护更新或其他资本承诺超出假设，或净股数显著高于37百万/转股路线：重建FCFF与每股价值，检查总组合和已排买单预算。"
  ],
  reviewTriggers: [
    "11月5日美东盘后Q3/16:30 EST电话会（新西兰11月6日10:30）：先核对实际财务与737–757百万全年收入指引，不引用未发布数据。[S4]",
    "Q3文件更新7月后现金、CIBC月供、总部购买安排、地产应付款与2028notes融资计划；要求实际总现金/付款表/已承诺额度，净债务模型本身不足。[S1]",
    "查PAD实际成本、持股比例、是否并表及收入/利润贡献；25百万仅为本轮示例储备，新信息需替换而非继续机械使用。[S5]",
    "未来两季核验研发/临床投入、产品/服务毛利、NOP资产利用和CFO−现金CapEx改善，并区分一次税务与日常盈利。",
    "追踪正式库存控制整改结论、净股数/SBC与临床项目原始披露；每次重大变化后刷新模型，尤其更新已有55美元订单的价格依据。[S1][S7]"
  ],
  sources: evidence.sources.map((s,i)=>({...s,label:`[S${i+1}] ${s.label}`,date:`${s.date}；2026-11-04核验`})),
  model: m, evidenceFacts: f,
};
report.sources.push({label:"[S13] FDA：MAUDE报告的用途与限制",url:"https://www.fda.gov/medical-devices/mandatory-reporting-requirements-manufacturers-importers-and-device-user-facilities/about-manufacturer-and-user-facility-device-experience-maude-database",date:"2026-11-04直接读取；仅用于解释证据限制"});
report.sources.push({label:"[S14] TradingView BOATS TMDX夜盘指示与限制",url:"https://www.tradingview.com/chart/?symbol=BOATS%3ATMDX",date:"2026-11-04核验；没有独立最新成交时间戳"});
if (evidence.quote.latestVerification) {
  const q = evidence.quote.latestVerification;
  if (q.price !== 68) throw Error("Recompute the reverse valuation and return prose for a changed reference price.");
  report.quote = { ...q, note: `${q.note} 应用已存67.305快照保留。[S10]` };
  report.dataAsOf = "2026-11-04核验；实际财务截至2026-06-30，全年指引9月10日重申。报价截至11月4日05:40 EST（10:40 UTC），于10:45:15 UTC直接核验；Q3将在11月5日盘后公布。";
  report.verdict.conclusion = report.verdict.conclusion.replace("68美元盘后参照", "68美元盘前快照");
  report.sources[9].date = "2026-11-04 05:40 EST盘前报价；10:45:15 UTC直接核验";
}
const state = await (await fetch("http://127.0.0.1:5889/my-holdings/api/state")).json();
validateDecisionReport(report,state.watchlist.find((w)=>w.symbol==="TMDX"));
await fs.writeFile(new URL("./tmdx-analysis-input-2026-11-04.json",import.meta.url),JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({symbol:report.symbol,capital:report.position,entries:decisionEntryPlan(report).map(({tier,low,high,dollars,shares})=>({tier,low,high,dollars,shares})),modelAudit:"independently reconstructed"},null,2));
