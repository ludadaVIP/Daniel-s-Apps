import fs from "node:fs/promises";
import { validateDecisionReport, decisionEntryPlan, scenarioReturn } from "../../../src/decision-reports.js";

const e = JSON.parse(await fs.readFile(new URL("./lunr-evidence-model-2026-11-05.json", import.meta.url), "utf8"));
const notes = JSON.parse(await fs.readFile(new URL("./lunr-debate-notes-2026-11-04.json", import.meta.url), "utf8"));
if (e.audit.status !== "facts-model-and-independent-audit-complete") throw Error("An audited LUNR model is required.");
const f=e.facts, m=e.model, ids=["bear","base","bull"], base=m.scenarios.base, q=e.quote;
const n=(v,d=2)=>v.toLocaleString("en-US",{minimumFractionDigits:d,maximumFractionDigits:d});
const pct=(v)=>`${n(v*100,1)}%`;
const usd=(v)=>`$${n(v)}`;
const S=(id)=>{const i=e.sources.findIndex((s)=>s.id===id);if(i<0)throw Error(`Missing source ${id}`);return `[S${i+1}]`;};
const near=(a,b,label)=>{if(Math.abs(a-b)>1e-8)throw Error(`Independent LUNR reconstruction failed: ${label}`);};

// Reconstruct operating cash flows, legacy receivable runoff, capital routes,
// preferred stress claims and the separate segment valuation.
for (const id of ids) {
  const s=m.scenarios[id], a=s.assumptions, converted=a.conversion==="shares";
  let nd=m.assumptions.netDebtStart-(converted?.345:0), prev=.95;
  let ev=0, receivablePV=0;
  const flows=[], runoff=[];
  for(let i=0;i<10;i++){
    const year=2027+i,r=a.revenue[i],ebit=r*a.margin[i];
    const cf=ebit-Math.max(ebit,0)*.25+r*(.05-i*.01/9)-r*(.03+.05-i*.03/9)-.14*(r-prev);
    const scheduled=year<=2030?f.orbitalReceivables.contractualCashflowM[String(year)]:year<=2035?f.orbitalReceivables.contractualCashflowM.thereafter/5:0;
    const collection=scheduled/1000*(1-a.orbitalHaircut);
    const finance=nd>0?nd*.065*.75:nd*.025;
    const coupon=converted&&i<4?.345*.025*.75:0;
    nd+=finance+coupon-cf-collection;
    near(cf,s.rows[i].fcff,`${id}/${year}/FCFF`);
    near(nd,s.rows[i].netDebtEnd,`${id}/${year}/netDebt`);
    flows.push(cf);runoff.push(collection);
    ev+=cf/(1+a.wacc)**(i+1);receivablePV+=collection/(1+a.wacc)**(i+1);prev=r;
  }
  const tv=a.revenue.at(-1)*(1+a.g)*a.margin.at(-1)*.75*(1-a.g/a.roic)/(a.wacc-a.g);
  ev+=tv/(1+a.wacc)**10;
  const couponPV=converted?[1,2,3,4].reduce((sum,t)=>sum+.345*.025*.75/(1+a.wacc)**t,0):0;
  let shares=.24+(converted?.02631077:0);
  let equity=ev+receivablePV-m.assumptions.netDebtStart+(converted?.345:0)-couponPV;
  if(!converted&&equity/shares<3){equity-=.006945;shares-=.002315;}
  near(Math.max(0,equity/shares),s.result.valueToday,`${id}/today`);
  const futureEV=flows.slice(5).reduce((sum,cf,i)=>sum+(cf+runoff[i+5])/(1+a.wacc)**(i+1),0)+tv/(1+a.wacc)**5;
  near(Math.max(0,(futureEV-s.rows[4].netDebtEnd)/shares),s.result.price2031,`${id}/2031`);
  const c=m.independentCrossCheck.assumedComponents[id].components;
  const segmentEV=["Lanteris","lunarDeliveryEngineering","connectGroundNavigation"].reduce((sum,k)=>sum+Math.max(0,c[k].revenue2028*c[k].EBITmargin)*c[k].EV_EBIT,0)-c.centralAnnualCost2028*c.centralCostCapitalizationMultiple;
  const crossEquity=segmentEV/(1+a.wacc)**2+flows[0]/(1+a.wacc)+flows[1]/(1+a.wacc)**2+receivablePV-m.assumptions.netDebtStart+(converted?.345:0)-couponPV;
  near(Math.max(0,crossEquity/shares),m.independentCrossCheck.assumedComponents[id].valueToday,`${id}/SOTP`);
}

const ranges=m.entry.ranges, price=q.price;
if(price!==m.reverse.price)throw Error("The quote and reverse valuation reference must match.");
const sourceNames={Q2:"2026Q2 Form 10-Q",FY25:"2025 Form 10-K",Q2release:"Q2实绩与全年指引",Q3date:"Q3公布日期",Goonhilly8K:"Goonhilly/COMSAT收购8-K",presentation:"Q2官方演示材料",NASAcontract:"NASA：NSNS累计上限及任务单",NASAphases:"NASA：服务商验证与运行阶段",FALCON:"FALCON卫星平台获选",AMDT3:"L3Harris卫星平台项目",commercialATP:"商业卫星项目授权推进",SXM11:"SXM-11交接与运行",quote:"Moomoo实际浏览器报价",filingsCheck:"SEC最新提交索引"};
const scenarios=ids.map((id,i)=>({id,label:["悲观/压力","基准","乐观"][i],todayValue:m.scenarios[id].result.valueToday,year5Price:m.scenarios[id].result.price2031,
  assumptions:[
    "2027收入8.5亿→2031年10.5亿→2036年13.4亿美元，GAAP营业率-8%→4%→8%，WACC17%、g2%、ROIC10%；旧轨道应收回收折让30%，可转债现金偿付，优先股在压力下按至少当前赎回索偿处理，普通股价值被吞噬。",
    "2027收入11亿→2031年20.6亿→2036年32.2亿美元，GAAP营业率-2%→11%→15%，WACC14%、g3%、ROIC15%；旧轨道应收折让10%，240百万经济股数，345百万可转债按现金本金偿付。",
    "2027收入12.5亿→2031年29.24亿→2036年51.45亿美元，GAAP营业率2%→17%→22%，WACC12%、g3.5%、ROIC20%；旧轨道应收无额外折让，可转债全转股至266.31077百万股并另扣转股前票息。"
  ][i]}));
const crossBase=m.independentCrossCheck.assumedComponents.base.valueToday;
const masterRefs=[["Q2","NASAcontract"],["Q2","NASAphases","SXM11"],["Q2","commercialATP"],["Q2"],["Q2","NASAcontract","NASAphases"],["Q2","Goonhilly8K"],["Q2","Q3date"]];
const r={
  version:1,symbol:"LUNR",name:"Intuitive Machines, Inc.",exchange:"NASDAQ",currency:"USD",capitalUsd:400000,horizonYears:5,
  analysisDate:"2026-11-05",financialPeriod:"2026 Q2 / H1；Q3未发布",
  dataAsOf:"资料核验日为2026-11-05新西兰时间（美东仍为11月4日）；实际财务截至2026-06-30，经济股数截至8月6日；包含11月3日FALCON公告。报价为11月4日05:55 EST的供应商盘前快照，Q3将于11月12日盘前公布。",
  quote:{price,date:q.timestamp.slice(0,10),asOf:q.timestamp,type:"盘前报价快照",source:"Moomoo实际浏览器页面",sourceUrl:q.source,
    note:`页面显示${q.providerLabel}、${usd(price)}；首次直接核验于${q.observedAtUtc}，后续读取时供应商时点仍为05:55，不能称为报告生成瞬间的最新逐笔成交。正式收盘为11月3日16:00 EST的10.48美元。行情供应商可能延迟，本版保留报价时点；应用已存10.475快照未被报告覆盖。${S("quote")}`},
  verdict:{stance:"当前不新增；等待现金、订单质量与价格同时过关",summary:`${usd(price)}盘前快照缺少安全边际。并购放大了营收，集团同口径成长与现金转换偏弱；基准今日约$4.03–5.55，先等Q3与资金/合同证据，再讨论三档条件价。`,confidence:"低至中低：股数与财务口径可复算，任务、整合、融资、回收及长期服务兑现不确定性高",valueLow:4.03,valueHigh:5.55,
    conclusion:`Lanteris带来了有实际盈利与交付履历的制造业务，但公司并非已经证明高速有机成长的月球公用事业。Q2表面四倍营收主要来自并购，同主体收入仅约+1.3%；固定价任务亏损、应收回收和资金消耗仍重要。基准今日DCF${usd(base.result.valueToday)}、较快分部利润恢复校验${usd(crossBase)}，均低于${usd(price)}报价；基准2031期末${usd(base.result.price2031)}，年化约${pct(scenarioReturn(base.result.price2031,price))}。当前新增0%。乐观路径有上行，悲观路径普通股可归零；不编造概率平均。三档条件价${ranges[0].low}–${ranges[0].high} / ${ranges[1].low}–${ranges[1].high} / ${ranges[2].low}–${ranges[2].high}美元，必须先核验Q3、至少18个月流动性、任务合同与实际股数；不是股价预测。`,
    limitations:"最新实绩仍为Q2，Q3在11月12日公布；6月现金、8月股数与后续ATM/并购调整可能已变化。Goonhilly汇率1.32、5百万调整储备、H2净耗现75百万、运营储备50百万均是自建假设，不是已报告余额或交易最终价。轨道应收回收时间与折让不确定，未审阅完整债务人后续法院记录；Q2披露不能保证今天回收结果。净债务滚存不证明逐笔总现金、借款或兑付可用。SOTP为更快分部利润恢复的校验，不能说两种方法都独立证明了同一经营路径。现金税、SBC、资本强度、TRA及转换条款存在近似；当前模型未给未获授合同/任务选择权任意加价，也可能低估长期成功。历史只展示并购前2024–25与最新2026实绩/同主体对照，不声称十年历史审计。用户全部账户、回撤、税务与流动性约束未齐，组合适配仍不完整。"},
  position:{currentAdditionalPct:0,targetPct:.5,maxPct:1,existingExposureUsd:0,pendingBuyUsd:0,
    rationale:"当前不新增。经营与价格条件同时成立后，研究目标0.5%=2,000美元，上限1%=4,000美元；存在任务/项目、信用和融资共同恶化的路径，单只全损会使组合损失0.5%或1%，且其他太空/成长资产可能同步下跌，不是最大回撤保证。三档500/700/800美元为同一目标仓位内新增资金；满足更低价格并不意味着必须买满。",
    portfolioFit:"保存持仓与已持QQQM、VOO、SMH、SOXX完整历史成分中未记录LUNR公司敞口；本地未成交买单为0。成分日期为9月末/10月23日等，报价为保存快照，非券商实时资产。已有RKLB等航天/高波动成长关注与条件计划，不能把每支上限同时买满。旧卡片8.5美元观察价、7.5–8.5安全区间和1%手填仓位仍为手工记录，本报告独立给出新判断；应以共享40万美元预算和最新组合风险筛选机会。"},
  entries:ranges.map((v,i)=>({tier:["observation","safety","discount"][i],low:v.low,high:v.high,budgetSharePct:[25,35,40][i],condition:[
    `高不确定性学习仓。采用20%五年研究回报门槛，上限=min(${n(base.result.price2031,4)}/1.20^5，${n(base.result.valueToday,4)})=${n(m.entry.returnCap,4)}，向下到分取${n(v.high)}。先核实Q3现金/股数、NSNS具体服务与任务单、商业ATP及项目成本；要求可信18个月总流动性，不能把ATM容量或已暂停Stifel额度当现金。`,
    `基准价值至少30%折让，上限${n(base.result.valueToday,4)}×0.70=${n(m.entry.caps.safety,4)}，向下到分取${n(v.high)}；同时满足20%回报门槛。前提是亏损项目、轨道应收与融资风险没有破坏基准，不能只因报价更低而加仓。`,
    `基准价值至少50%折让，上限${n(base.result.valueToday,4)}×0.50=${n(m.entry.caps.discount,4)}，向下到分取${n(v.high)}。低于${n(v.low)}为重新尽调边界；若任务、合同/信用或融资恶化，暂停原条件，不将折价当作风险消失。`
  ][i]})),
  scenarios,
  masters:notes.masters.map((v,i)=>({...v,evidence:`${v.evidence} ${masterRefs[i].map(S).join("")}`})),
  debate:notes.debate,
  sections:[
    {title:"公司边界：制造、任务与网络分别赚什么钱",body:`LUNR挂牌证券为Intuitive Machines的Class A普通股、USD；评估范围是100%合并经营与全部LLC经济索偿。业务已从单次月球交付扩展到卫星制造、月面/深空工程、地面与通信导航网络。Lanteris原属Maxar Space Systems，2026年1月并表；KinetX与Goonhilly/COMSAT也增加能力。不能拿新范围的营收与旧公司直接同比，就认作有机增长。${S("Q2")}${S("FY25")}${S("Goonhilly8K")}\n制造项目按设计、制造和履约赚取合同利润，固定价任务还承担成本超支；通信网络要先投入资产、部署、验证与取得实际使用，才可能形成较长期服务收入。‘Build-Connect-Operate’是有合理产业逻辑的战略，但不是已经验证成熟的公用事业现金流。\n正面证据也应保留：9月15日公司原文宣布SXM-11完成在轨测试并向SiriusXM交接，体现制造与客户履约能力。11月3日FALCON获选与L3Harris相关卫星平台项目提供管线，但已读公告未披露LUNR具体价格，不为它们编造合同金额、毛利或短期收入。${S("SXM11")}${S("FALCON")}${S("AMDT3")}`},
    {title:"增长口径：四倍营收、同主体收入与集团利润",body:`单位百万美元。Q2收入206.168，其中产品166.735、服务36.677、补助2.756；Lanteris贡献收入约166.7、经营利润约24.5，制造能力具有真实经济价值。旧期报告收入50.313与新合并范围不可比；同主体pro forma去年Q2为203.433，计算仅约+1.34%。服务收入36.677对比50.313，下降约27.1%。${S("Q2")}\nH1已报告收入392.898；假设Lanteris自年初完整并表的pro forma为406.014，对比去年同主体421.589，约−3.69%。406.014不是已报告收入，不能混成392.898。Lanteris H1经营利润约24.7，而集团Q2营业亏47.136、H1亏86.337；某一制造季度盈利不等于集团已跨过盈亏平衡，也不应把粗略差额冒充正式分部利润。\n全年900–1,000百万收入与调整EBITDA为正是管理层指引，非实绩或FCF保证；从H1已报告392.898出发，H2需507.102–607.102，相比H1约增长29%–55%。新订单、交付与整合兑现要求仍高，不能将未来指引填进历史表。${S("Q2release")}`},
    {title:"历史财务与现金：增长不能由融资余额代替",body:`并购前2024：收入228.000，营业亏57.396，净亏346.922，CFO−57.587，现金CapEx10.111，FCF−67.698，SBC8.798百万。2025：收入210.059，营业亏87.231，净亏106.846，CFO−14.318，现金CapEx41.634，FCF−55.952，SBC8.609百万。2025尚无Lanteris全年并表，KinetX只从10月起进入范围，不能与2026简单连成同口径成长曲线。${S("FY25")}\n2026H1：收入392.898，成本（不含D&A）326.925，D&A27.975，营业亏86.337，净亏115.369，CFO−111.878，现金CapEx33.941，FCF=−145.819，SBC19.333百万。收购净现金流出447.062百万，融资净流入386.564百万；现金不是经营赚来的自由现金流。Q2演示材料给CFO约−59.8、CapEx24.1、FCF−83.9百万，是四舍五入单季口径，不冒充10-Q精确累计数相减。${S("Q2")}${S("presentation")}\n管理层将部分Q2现金消耗与收购整合、库存/基础设施加速和发射里程碑付款关联；这些可能解释时点，但不保证全部是可永远加回的一次项。报告FCF=CFO−现金CapEx，含融资资产、客户预收、收购与会计估计影响，不直接等于FCFF。亏损、衍生索偿重估及非控股权益也使传统P/E缺乏清晰经济含义。`},
    {title:"合同六层：上限、任务单、backlog、RPO、收入与现金",body:`NASA官方说明NSNS所有相关合同的累计最大潜在值为48.2亿美元，含多供应商/任务单安排；不是LUNR单独保证收入，不能在卫星项目旁再作为无风险‘额外市值’相加。NASA还要求提供方验证、转入运行、正式运营三个阶段，长期需求不等于今天可收款。${S("NASAcontract")}${S("NASAphases")}\n6月末管理层backlog为1,761.950百万，而固定价剩余履约义务RPO为814.7百万。差额约947.25百万，涉及预计商业项目、已获资助但不属RPO定义的时间材料/成本加成合同、受限制可变对价等，不能把全部差额叫未获资助或虚假订单。定义较宽意味着估值应分层处理，不能全部当同等确定性现金。${S("Q2")}\n商业多卫星项目预计总值超过600百万，初始authority-to-proceed约45百万；公司将更大预计项目金额计入backlog，说明完整长期项目的确定性与初始授权不同。8月17日公告可能是同一项目，不在没有证据时重复加600百万。${S("commercialATP")}\nRPO预计约30%–35%在2026剩余半年确认、35%–40%在2027确认，其余以后；确认收入仍不同于收现金。政府合同普遍存在便利终止权，拨款、验收、成本与付款条件需要追踪。`},
    {title:"任务与固定价经济性：技术完成不等于项目赚钱",body:`Q2披露IM-3与IM-4均处亏损合同状态。IM-3固定价预计收入约91.3百万，另有受限制9.7百万，约91%履约完成，剩余亏损准备约4.2百万；IM-4约124.5百万、受限制16.2百万、约45%完成，剩余亏损准备约9.7百万。H1额外预计合同损失分别约6.3及16.2百万。预计完工成本变化是经营风险的重要信号，但本身不证明造假。${S("Q2")}\nIM-3披露履约期延至2027年3月，不把它直接写成保证在Q1发射。任务工程、发射、轨道位置、月面工作与客户里程碑要分别核验；一次着陆也不能概括成所有商业目标均完成。部署与服务利用率尚未证明是稳定成熟的重复收入。\n已投入NSNS相关在建资产约86.2百万是历史投入，未来估值不再整笔重复扣；后续建造、发射与替换仍需资本预算。某项目成本已经发生，不意味着继续投入必然有正回报，避免沉没成本驱动加仓。`},
    {title:"应收与信用：轨道分期款不是现金等价物",body:`6月末贸易应收79.550、轨道应收现/非流动38.484/209.833、合同资产50.992、存货59.941、供应商预付款32.558百万；合同负债现/非流动215.518/4.065百万。预收帮助融资，却也代表交付义务；不能全部称作多余股东现金。${S("Q2")}\n轨道应收账面248.317百万，未来收取取决于客户信用及在轨持续表现。合同现金流表2027–2030约48.991/38.390/33.545/30.174百万，此后104.979百万；模型将‘此后’假设分摊2031–2035，悲观/基准/乐观回收折让30%/10%/0，再按相应WACC折现。它不是全部账面数当日可花现金，折让也不是公司已确认减值率。2026预计收款放在H2净现金桥，不再重复加。\nQ2披露EchoStar相关债务人/关联公司6月30日、8月2日进入Chapter11，对应贸易应收约10.1与轨道应收41.4百万；管理层截至8月13日未增列减值，回收与合同处理仍待后续证据。不能立即全额判损，也不能无风险加回；本版未核验全部后来法院记录，Q3须更新。仍在建的某非债务人关联合同与已经入程序的债务人须区分。\n49.395百万应收证券化负债从资本索偿扣一次；旧轨道收款单独计入，新增轨道应收资金占用留在增量NWC，避免既给全账面现金又在未来CFO收一次。若客户预付减少或延迟更久，14%增量营运资本假设可能偏低。`},
    {title:"收购、现金与真实经济股数",body:`Lanteris最初公告价800百万，不等于最终购买会计金额。Q2披露对价853.264百万=现金405.622+交易奖金43.689+股份公允价值403.953；发行22.991028百万A股、估值日价格17.57。现金流表收购净支出447.062又是扣收购现金后的口径，不能混用或在六月现金里扣第二次。H1整合费用约26.4百万，未来是否仍需投入要核验。${S("Q2")}\nGoonhilly/COMSAT在8月3日交割：英国现金18.5百万英镑、960,649股，COMSAT现金10百万美元，另有营运资本/现金债务等调整。模型用USD/GBP1.32及额外5百万调整储备，估计现金39.42百万；汇率与储备是研究假设，不是交易最终价。股份已在8月6日A股里，不再加一次。${S("Goonhilly8K")}\n8月6日A股173.231343百万，加Class C配对LLC经济单位55.692725百万=228.924068百万经济单位。Class C投票权与配对LLC权益不能再各算一次。以100%合并现金流估值，要配全部经济单位；若只用A股会高估每股价值。模型加入已知净激励、低行权价认股与优先股转换等，向上取240百万股；已发行限制股1.518163百万从追加预算剔除，避免重复。\n账面可赎回NCI1,194.653百万对应已在分母的LLC权益，不再当债务扣一次；认股负债81.438百万与相关权益索偿也不机械双扣。SBC作为GAAP利润内真实经济成本，不加回；未来假设其费用可抵消新增净稀释，不是回购承诺。后续ATM所得不能无条件加现金而不增股；500百万额度不是现存现金。`},
    {title:"融资与税务：本金、转换、养老及TRA统一口径",body:`6月末非受限现金367.354百万，受限现金另11.668百万。模型减Goon现金39.42、假设H2净耗现75、运营储备50，得到规范化多余现金202.934百万；不是已报告年底余额。资本索偿为可转债本金345、证券化49.395、养老缺口50.6、融资租赁0.046、普通非控股0.567，合计445.608百万，起始净债务242.674百万。经营租金已在利润/现金中，93.402百万经营租赁负债不再全扣；7月重估总ROU约109.1百万不是额外新增同额债务。${S("Q2")}\n345百万可转债2030年10月1日到期、票息2.5%、初始转股价13.1125，对应26.310770百万股。悲观/基准按现金本金与原股数，乐观移除本金、增26.310770百万股并扣2027–2030四年税后票息现值。基准2030模型价约7.34、乐观约25.03，与各自资本路线匹配；高股价时不能只付本金现金就忽略转换索偿。历史36.8百万capped-call成本已在现金中，不重复扣；未来对冲收益未加，乐观最有利满上限现值约0.494美元/股只是条件敏感性。\n压力情景优先股按至少当前6.945百万赎回索偿处理、分母减相应转换份额；10%PIK与2028 put可能增加现金压力，普通股归零情景不构成正的价值底。低价认股权、激励与可能的make-whole仍需Q3更新，模型不是完整期权定价。\nStifel40百万循环额度在1月12日豁免中已暂停借款等安排，不当作随时可用后备资金。净债务以6.5%税前净融资率（盈利税盾按25%）或净现金2.5%税后收益滚存，只是近似，不是贷款承诺或逐日流动性证明。\nTRA要求向相关持有人支付85%实际/视同税节省。模型全额正常25%现金税、无额外税盾资产，因而不再扣同一假想税盾负债；但控制权变化、早终止或违约可能按假定未来收益加速付款，是未纳入精确概率的尾部风险。${S("FY25")}`},
    {title:"估值一：十年FCFF、旧应收与五年期末价",body:`单位：金额十亿美元、股数十亿股。2026收入0.95为管理层900–1,000百万指引中点，非实绩。2027–2036十年显性期，以2026末附近年度近似估值，不声称逐日精度。\nFCFF=EBIT−max(EBIT,0)×25%+D&A−CapEx−ΔNWC。GAAP利润率含SBC；D&A从收入5%降至4%，维持CapEx3%、成长CapEx从5%降至2%，合计8%降至5%；ΔNWC为增量收入14%，含新轨道应收净客户预收的资金需要。全部是研究假设，非公司维持/成长拆分。\n终值NOPAT=2036收入×(1+g)×营业率×75%；终值FCFF=NOPAT×(1−g/ROIC)，TV=FCFF/(WACC−g)，为长期成长保留再投资。旧轨道应收2027以后折现单列，不在终值再留永久余额。\n${ids.map((id)=>{const a=m.scenarios[id].assumptions;return `${id} 2027–2036收入：${a.revenue.join("/")}；GAAP营业率：${a.margin.map(v=>n(v*100,1)).join("/")}%；WACC${pct(a.wacc)}、g${pct(a.g)}、终值ROIC${pct(a.roic)}。`;}).join("\n")}\n股权=经营EV+旧应收收款PV−路线一致净债务−需单列的票息PV；除路线一致经济股数。悲观/基准/乐观今天${scenarios.map(s=>usd(s.todayValue)).join(" / ")}，2031期末${scenarios.map(s=>usd(s.year5Price)).join(" / ")}。\n2031重新折现2032以后经营FCFF/终值及剩余旧应收，再减当时净债务；当时已收旧应收进入现金滚存，不再加一次。今天4.03不能当五年卖价；无分红时年化=(P2031/入场价)^(1/5)−1。\n悲观的原始普通股经济价值为负，有限责任价格显示0；这不是公司当前已破产、法律资不抵债或明天股价为0的断言，也不是清算资产审计。它说明本路径中持续消耗与优先索偿会吞噬普通股价值。没有为各情景编造概率，不能简单平均成预期收益。`},
    {title:"估值二：分部正常化EBIT校验与总部成本",body:`独立SOTP以2028末正常化分部价值作交叉检验，并折现至今天。三个框架是制造Lanteris、月球交付/工程、连接/地面/导航；它们是研究划分，不冒充公司已披露的正式经营分部。\n${ids.map((id)=>{const c=m.independentCrossCheck.assumedComponents[id].components;return `${id}：`+["Lanteris","lunarDeliveryEngineering","connectGroundNavigation"].map(k=>`${k}收入${c[k].revenue2028}×营业率${pct(c[k].EBITmargin)}×EV/EBIT ${c[k].EV_EBIT}`).join("；")+`；另扣年度总部成本${n(c.centralAnnualCost2028*1000)}百万×${c.centralCostCapitalizationMultiple}倍。`;}).join("\n")}\n亏损项目不给负P/E套正价值，按0估其分部EV仍可能对持续亏损过于宽松。总部成本按年度金额资本化明确扣除，不能只减一笔很小一次数。折现两年分部EV，加保守2027/28 FCFF与旧应收PV，扣同一资本索偿，所得约${ids.map(id=>usd(m.independentCrossCheck.assumedComponents[id].valueToday)).join(" / ")}。所有利润率、倍数与总部成本是研究假设，未伪造同业行情。\n基准SOTP假设Lanteris2028收入950百万、营业率13%，月球/工程200百万×4%，连接170百万×20%，再减总部50百万，正常化合计EBIT约115.5百万；这比DCF基准2028约26.4百万恢复得快。因而5.55是较快恢复路径的校验，不能称两种方法独立证明完全相同的现金流。早期现金仍按保守DCF处理，属于有明示近似的交叉检验。\nLanterisQ2实际约14.7%营业率支持‘制造可以盈利’的反方论证，但H1经营利润只有24.7百万、集团其他项目与成本仍吞噬回报。收购最终对价853.264百万提供交易规模参照，不是制造资产可保证卖回的清算底价。基准今天4.03–5.55只是本轮两个框架参考，全部经营情景范围更宽。`},
    {title:"市场隐含、敏感性与最强模型反驳",body:`以10.73美元反推，固定基准利润率、WACC14%、g3%、ROIC15%、资本与营运资本，再假设2027–2036恒定营收增长，全转股一致路线需约${pct(m.reverse.routes.shares.requiredConstantRevenueCAGR2027_36)}CAGR，2036收入约${n(m.reverse.routes.shares.revenue2036AtSolution)}十亿美元。该解2030股价约${usd(m.reverse.routes.shares.price2030)}高于13.1125转换价，因此移除本金、增加26.310770百万股、另扣四年票息PV约18.848百万；不使用只扣本金的价内现金假解。它是一组条件解，不是市场真实唯一预测。\n基准WACC×终值g敏感性（美元/股）：\n${[.12,.14,.16].map(w=>`WACC${pct(w)}：`+m.sensitivity.wacc_g.filter(v=>v.wacc===w).map(v=>`g${pct(v.g)}=${n(v.valueToday)}`).join("；")).join("\n")}\n基准终值PV占业务EV约${pct(base.result.terminalPVFraction)}，乐观约${pct(m.scenarios.bull.result.terminalPVFraction)}；远期利润与资本回报主导。额外显性期CapEx占收入1%/2%时，基准今天约${m.sensitivity.capex.slice(1).map(v=>n(v.valueToday)).join(" / ")}；若资本强度永久更高，还要降低终值ROIC，不能只改显性期。额外20/40百万股约${m.sensitivity.shares.slice(1).map(v=>n(v.valueToday)).join(" / ")}。完全不给旧轨道应收价值约${n(m.sensitivity.noLegacyOrbitalCredit)}，不能把它当无风险现金。\n[可能低估] 制造利润恢复、国防/商业卫星放量、网络服务验证后更高重复收入、未来更多任务及产业选择权，可以形成比基准强得多的经营结果。乐观已给2036收入51.45亿美元与22%营业率，不把未获授合同上限再额外加一遍。\n[可能高估] 总部/任务成本未下去、新轨道应收资金占用超过14%、卫星/地面与发射维护资本更高、信用回收更差或增发压低每股价值，都可打破模型。把所有年份营业率加3个百分点仍仅约${n(m.sensitivity.marginShift.find(v=>v.extraEBITMarginAllYears===.03).valueToday)}美元，说明不能只用单季制造高毛利覆盖集团风险。`},
    {title:"三档入场与40万美元组合执行条件",body:`本轮五年、现货、无杠杆。因任务、信用、整合和融资不确定性高，采用20%研究回报门槛，高于基础五年翻倍约15%的目标；这是风险补偿假设，不是用户必须达到或能够保证的收益。\nP_return=${n(base.result.price2031,5)}/1.20^5=${n(m.entry.returnCap,5)}；P_margin参考基准今天${n(base.result.valueToday,5)}，安全30%折让${n(m.entry.caps.safety,5)}、折价50%折让${n(m.entry.caps.discount,5)}，取较低上限并向下到分。三档${ranges.map(v=>`${n(v.low)}–${n(v.high)}`).join(" / ")}连续、不重叠；低于1.41需重审，不是无限补仓区。\n在${usd(price)}快照下，五年悲观/基准/乐观总涨幅${scenarios.map(s=>pct(s.year5Price/price-1)).join(" / ")}，年化${scenarios.map(s=>pct(scenarioReturn(s.year5Price,price))).join(" / ")}。全损情景的−100%只表达该路径普通股归零，不是发生概率。各档上沿若基准兑现，年化约${ranges.map(v=>pct(scenarioReturn(base.result.price2031,v.high))).join(" / ")}，仍可能在其他路径损失大部分或全部本金。\n目标2,000美元、已持/买单0，三档500/700/800美元，在各档上沿最多147/248/398股，合计最大名义金额1,997.67美元，余款保留，未计税费/汇率。不是已经提交的委托。\n行动前必须读取11月12日Q3的新现金、股数、订单和成本，核验至少18个月总流动性而非只看净债务；不能把未承诺ATM容量、暂停的Stifel额度或未来潜在转股当现成资金。没有达到这些条件，即使价格到区间也可继续不行动。`},
    {title:"治理、监控与机会成本",body:`Q2管理层认定6月末披露控制有效；收购整合与新系统仍需持续检验，不把复杂股权直接等同会计失信。主要客户集中度较高，Q2前四个客户约35%/28%/11%/10%，H1也集中；国家安全收入占比上升不消除下游政府拨款依赖。${S("Q2")}\n下一次Q3于美东11月12日盘前公布、08:30 EST电话会，对应新西兰11月13日02:30 NZDT；未公布数据不能写成实绩。未来两季追踪项目EAC、亏损准备、RPO转收入、回款、轨道应收、NASA服务验证、实际任务节奏和各项融资索偿。${S("Q3date")}\n任务与发射事故、预算/便利终止、商业客户信用、整合执行和资本市场关闭可能共同发生。任一项重大证据破坏可理解性、流动性或核心价值，应先暂停新增并重估，不以回到成本价或旧高点为锚。\n公司有可贵的制造和通信能力，但投资必须与价格、每股现金和组合机会成本一起判断。维持现金、低成本宽基或选择证据更成熟的企业，都是可比较的路径；没有必要为66张卡强行各下一个买单。`}
  ],
  figures:[
    {title:"Q2合并同主体营收对照",unit:"百万美元；pro forma口径",note:`${S("Q2")}。203.433为去年同主体pro forma，206.168为本季，计算成长约1.34%；不能用并购前50.313作有机成长分母。`,rows:[{label:"2025Q2同主体",value:203.433},{label:"2026Q2",value:206.168}]},
    {title:"Q2收入构成",unit:"百万美元；GAAP",note:`${S("Q2")}。产品主要来自Lanteris，服务与补助性质不同，不把出货、补助或并购营收都当重复网络收入。`,rows:[{label:"产品",value:166.735},{label:"服务",value:36.677},{label:"补助",value:2.756}]},
    {title:"Backlog与RPO：确定性与定义不同",unit:"百万美元；截至2026-06-30",note:`${S("Q2")}。backlog是更宽管理口径，差额也含不属RPO的已获资助合同等，不能将它们等同现金或一概称未资助。`,rows:[{label:"管理层backlog",value:1761.95},{label:"固定价RPO",value:814.7}]}
  ],
  invalidation:[
    "项目预计完工成本继续恶化、IM-3/IM-4追加重大亏损、交付/验证延期或实际任务结果破坏服务经济性：停止新增，重建利润与资金路径。",
    "商业ATP未转为可信完整合同、RPO/backlog减少或无法按预期回款，客户信用/轨道应收出现重大新损失：重估现金，不因价格更低自动加仓。",
    "18个月总流动性无法证明、再融资条件恶化或需要大量低价新股：更新全部经济单位与资本索偿，不能把预计ATM/转股当现金。",
    "Lanteris利润不能持续、总部成本与整合费用持续吞噬回报、网络资本强度高于假设：降低长期营业率/ROIC与价值。",
    "正式披露出现重大未解的治理、关联交易、TRA加速或证券索偿问题，或总体太空/高久期风险超出40万美元组合预算：先审查风险与可理解性。"
  ],
  reviewTriggers:[
    "11月12日美东盘前Q3/08:30 EST电话会（新西兰11月13日02:30）：核对900–1,000百万全年收入指引所需H2兑现，不提前填入未发布实绩。",
    "更新6月后现金、ATM实际发行、优先/可转/warrant与LLC转换；坚持100%经营与全部经济索偿配对，不能只用挂牌A股。",
    "逐季拆制造、原服务与集团成本的正常化利润及CFO−现金CapEx，分辨整合一次项与持续成本；核验是否真实接近现金盈利。",
    "核对商业ATP/完整合同、RPO、成本估计与亏损准备、NASA服务验证及实际使用；获选公告未披露价格时不自填订单额。",
    "跟踪EchoStar相关实际回收/合同处理、旧轨道收款表与新增应收融资；确认Goonhilly最终对价、业务贡献及整合后现金。"
  ],
  sources:e.sources.map((s,i)=>({label:`[S${i+1}] ${sourceNames[s.id]||s.id}`,url:s.url,date:`${s.date}；报告核验日2026-11-05 NZDT`})),
  model:m,evidenceFacts:f,modelAudit:e.audit
};
const api="http://127.0.0.1:5889/my-holdings/api";
const response=await fetch(api+"/state");if(!response.ok)throw Error("Application API is unavailable.");
const state=await response.json();const watch=state.watchlist.find(w=>w.symbol==="LUNR");
validateDecisionReport(r,watch);
await fs.writeFile(new URL("./lunr-analysis-input-2026-11-05.json",import.meta.url),JSON.stringify(r,null,2)+"\n");
console.log(JSON.stringify({symbol:r.symbol,date:r.analysisDate,quote:r.quote,entries:decisionEntryPlan(r).map(({tier,low,high,dollars,shares})=>({tier,low,high,dollars,shares})),audit:"FCFF, capital, receivables, SOTP independently reconstructed"},null,2));
