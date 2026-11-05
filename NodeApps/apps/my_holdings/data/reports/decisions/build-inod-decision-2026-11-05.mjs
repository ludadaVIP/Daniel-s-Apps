import fs from "node:fs/promises";
import {validateDecisionReport,decisionEntryPlan,scenarioReturn} from "../../../src/decision-reports.js";

const e=JSON.parse(await fs.readFile(new URL("./inod-evidence-model-2026-11-05.json",import.meta.url),"utf8"));
if(e.status!=="verified-frozen")throw Error("Frozen, independently audited INOD evidence required.");
const notes=JSON.parse(await fs.readFile(new URL("./inod-debate-notes-2026-11-05.json",import.meta.url),"utf8"));
const f=e.facts,k=e.capital,q=e.market,ids=["bear","base","bull"],sources=[...new Map(e.sources.map(s=>[s.id,s])).values()];
const n=(v,d=2)=>Number(v).toLocaleString("en-US",{minimumFractionDigits:d,maximumFractionDigits:d});
const pct=v=>`${n(v*100,1)}%`,usd=v=>`$${n(v)}`;
const S=id=>{const i=sources.findIndex(s=>s.id===id);if(i<0)throw Error(`Missing INOD source ${id}`);return `[S${i+1}]`;};
const near=(a,b,label)=>{if(!Number.isFinite(a)||!Number.isFinite(b)||Math.abs(a-b)>1e-7)throw Error(`INOD independent reconstruction ${label}: ${a}/${b}`);};
const baseShares=k.commonShares+k.rsuShares+k.performanceRsuShares;

// Independently solve the in-the-money existing option claims and proceeds.
// Prospective plan authorization is never treated as issued stock.
function claimPrice(equity){
  const options=[...k.options].sort((a,b)=>a.strike-b.strike);
  for(let count=0;count<=options.length;count++){
    const included=options.slice(0,count),shares=baseShares+included.reduce((sum,o)=>sum+o.shares,0),cash=included.reduce((sum,o)=>sum+o.shares*o.strike,0),price=(equity+cash)/shares;
    if(included.every(o=>price>=o.strike-1e-10)&&options.slice(count).every(o=>price<=o.strike+1e-10))return {price,shares,cash};
  }
  throw Error("No consistent INOD option-claim solution");
}
function reconstruct(a){
  let previous=a.startRevenue2026;
  const rows=Array.from({length:10},(_,i)=>{const revenue=i===0?a.revenue2027:previous*(1+a.growth[i]),ebit=revenue*a.margins[i],tax=Math.max(0,ebit)*a.tax,nopat=ebit-tax,da=revenue*.025,capex=da+revenue*a.netCapexRatio,nwc=(revenue-previous)*a.nwcRatio,fcff=nopat+da-capex-nwc;previous=revenue;return {year:2027+i,revenue,ebit,nopat,tax,da,capex,nwc,fcff};});
  const tv=rows.at(-1).revenue*(1+a.g)*a.terminalMargin*(1-a.tax)*(1-a.g/a.terminalRoic)/(a.wacc-a.g),tvPV=tv/(1+a.wacc)**10;
  const ev=rows.reduce((sum,row,i)=>sum+row.fcff/(1+a.wacc)**(i+1),0)+tvPV;
  const netAssets=k.cashAfterFloat-k.requiredOperatingCashReserve-k.pensionDeficitDeducted-k.vendorLicenseObligationDeducted-k.otherPossibleLegalClaimReserveDeducted;
  const today=claimPrice(ev+netAssets);
  const retained=rows.slice(0,5).reduce((sum,row)=>sum+row.fcff,0),futureCash=netAssets+retained;
  const futureEv=rows.slice(5).reduce((sum,row,i)=>sum+row.fcff/(1+a.wacc)**(i+1),0)+tv/(1+a.wacc)**5;
  const future=claimPrice(futureEv+futureCash),cross=claimPrice(rows[4].ebit*a.exitEbitMultiple+futureCash);
  let cash=netAssets+k.requiredOperatingCashReserve;const liquidity=rows.map(row=>{cash+=row.fcff;return {year:row.year,cash};});
  if(liquidity.some(row=>row.cash<k.requiredOperatingCashReserve))throw Error("INOD future financing must be modeled explicitly.");
  return {rows,tv,ev,netAssets,today,futureEv,futureCash,retained,future,cross,crossToday:cross.price/(1+a.ke)**5,tvShare:tvPV/ev,liquidity};
}
const results=Object.fromEntries(e.scenarios.map(s=>[s.id,reconstruct(s.assumptions)]));
for(const s of [...e.scenarios,e.stress]){
  const c=s.id==="major-program-shock"?reconstruct(s.assumptions):results[s.id];
  c.rows.forEach((row,i)=>{for(const [key,v] of Object.entries({revenue:row.revenue,ebit:row.ebit,nopat:row.nopat,da:row.da,capex:row.capex,deltaNwc:row.nwc,fcff:row.fcff}))near(v,s.rows[i][key],`${s.id}/${row.year}/${key}`);});
  near(c.today.price,s.valuation.today,`${s.id}/today`);near(c.today.shares,s.valuation.dilutedClaimsShares,`${s.id}/claims`);near(c.today.cash,s.valuation.optionExerciseProceeds,`${s.id}/option proceeds`);
  near(c.future.price,s.fiveYear.price,`${s.id}/2031`);near(c.cross.price,s.crossCheck.price2031,`${s.id}/cross2031`);near(c.crossToday,s.crossCheck.today,`${s.id}/cross PV`);
  near(scenarioReturn(c.future.price,q.price),s.fiveYear.cagr,`${s.id}/refreshed CAGR`);
  c.liquidity.forEach((v,i)=>near(v.cash,s.liquidity[i].endingCashBeforeOptionalDistributions,`${s.id}/${v.year}/liquidity`));
}
const base=results.base,ba=e.scenarios.find(s=>s.id==="base").assumptions,stress=reconstruct(e.stress.assumptions);
const reference=Math.min(base.today.price,base.crossToday),futureReference=Math.min(base.future.price,base.cross.price),margins=[.25,.35,.45];
const caps=margins.map(m=>Math.min(futureReference/1.15**5,reference*(1-m))),floorCent=x=>Math.floor((x+1e-10)*100)/100,high=caps.map(floorCent);
const ranges=[{low:floorCent(high[1]+.01),high:high[0]},{low:floorCent(high[2]+.01),high:high[1]},{low:Math.ceil(reference*.35*100)/100,high:high[2]}];
function reverse(margin){let lo=-.1,hi=.8;for(let i=0;i<100;i++){const g=(lo+hi)/2,c=reconstruct({...ba,revenue2027:450,growth:[ba.growth[0],...Array(9).fill(g)],margins:Array(10).fill(margin),terminalMargin:margin});if(c.today.price<q.price)lo=g;else hi=g;}const g=(lo+hi)/2,c=reconstruct({...ba,revenue2027:450,growth:[ba.growth[0],...Array(9).fill(g)],margins:Array(10).fill(margin),terminalMargin:margin});return {margin,g,revenue2031:c.rows[4].revenue,revenue2036:c.rows[9].revenue,value:c.today.price};}
const reverses=[.18,.22,.26].map(reverse);reverses.forEach((v,i)=>{near(v.value,e.reverse.results[i].impliedCurrentValue,`reverse/${v.margin}`);near(v.g,e.reverse.results[i].constant2028to2036Growth,`reverse growth/${v.margin}`);});
const portfolio=JSON.parse(await fs.readFile(new URL("./inod-portfolio-context-2026-11-05.json",import.meta.url),"utf8"));
const exposure=portfolio.company.value,pending=portfolio.pendingKnownLimitBuyUsd;
const api="http://127.0.0.1:5889/my-holdings/api",state=await(await fetch(api+"/state")).json(),watch=state.watchlist.find(w=>w.symbol==="INOD");
const position={currentAdditionalPct:0,targetPct:1,maxPct:1.5,existingExposureUsd:exposure,pendingBuyUsd:pending,
  rationale:`当前新增0%。若新财报、项目/客户和价格同时通过，研究条件目标总敞口1%=$4,000，上限1.5%=$6,000。已有公司敞口${usd(exposure)}，本地待成交买单${usd(pending)}已预留，因此目标剩余${usd(Math.max(0,4000-exposure-pending))}、上限剩余${usd(Math.max(0,6000-exposure-pending))}。仅将目标剩余按25%/35%/40%分到三档，不把原买单再加一次。大项目压力可损失大部分本金，极端全损下1%/1.5%仓位分别影响40万美元1%/1.5%，相关资产共同下跌另计。`,
  portfolioFit:`保存的直接持仓及QQQM、VOO、SMH、SOXX历史成分未记录INOD敞口；但已记working限价买入30股×36美元=1,080美元。这是本地记录，非券商实时成交/冻结证明。36美元高于本轮首档上沿${usd(ranges[0].high)}，应先按新财报和项目证据复核其适用性；本报告保留订单，未自动修改或执行。客户AI预算与组合已有大科技/半导体敞口相关，单股客户集中也更高。外部账户、税务、流动性和回撤约束未知，适配未完成，66支目标不能同时买满。`};
const refs=[["q2-release","q2-10q"],["fy25-10k","q2-release"],["q2-10q","q2-release"],["q2-release","layoff-report"],["fy25-10k","q2-10q"],["q2-release","atm-aug"],["q2-10q","q3-date","layoff-report"]];
const scenarios=ids.map((id,i)=>{const c=results[id],a=e.scenarios.find(s=>s.id===id).assumptions;return {id,label:["悲观：增长明显放缓","基准：持续成长与复用改善","乐观：多客户研究平台放量"][i],todayValue:c.today.price,year5Price:c.future.price,assumptions:`2027/2031/2036收入${n(c.rows[0].revenue,0)}/${n(c.rows[4].revenue,0)}/${n(c.rows[9].revenue,0)}百万美元；扣未来经济报酬后EBIT率${pct(a.margins[0])}→${pct(a.margins[4])}；税${pct(a.tax)}、WACC/Ke${pct(a.wacc)}、g${pct(a.g)}、成熟ROIC${pct(a.terminalRoic)}。现有期权按情景价内法计股数和行权资本，未假定ATM已发行；更严厉项目压力另列。`};});
const annual=f.annual.map(y=>`${y.year}：收入${n(y.revenue,3)}；毛利率${pct(y.grossMargin)}；经营EBIT${n(y.ebit,3)}；归母净利${n(y.netIncome,3)}；CFO${n(y.cfo,3)}；总现金CapEx${n(y.capex,3)}；报告FCF${n(y.reportedFcf,3)}；SBC${n(y.sbc,3)}百万。`).join("\n");
const r={version:1,symbol:"INOD",name:"Innodata Inc.",exchange:"NASDAQ Global Market · 普通股",currency:"USD",capitalUsd:400000,horizonYears:5,analysisDate:"2026-11-05",
  financialPeriod:"FY2021–25、2026Q2/H1、TTM至2026-06-30",
  dataAsOf:"2026-11-05 NZDT（美东仍11月4日）；最新实绩为6月30日止Q2/H1，含后续CEO/ATM/研发实验室及待核项目报道。Q3计划11月5日收市后发布，尚未视作实绩。",
  quote:{price:q.price,date:q.quoteDate,asOf:q.timestampUtc,type:`${q.status.includes("after-hours")?"盘后":q.status.includes("close")?"收盘":"盘中"}报价快照 · Q3发布前`,source:"Moomoo实际Chrome页面",sourceUrl:sources.find(s=>s.id===q.sourceId).url,note:`页面${q.timestampText}，原始报价${n(q.price,3)}美元，供应商时点${q.timestampUtc}（分钟精度）、实际读取${q.capturedAt}。正式收盘${usd(q.regularClose.price)}（16:00 EST），Yahoo交叉确认；其盘后页面较旧17:17 EST仍为${usd(q.alternateProviderObservation.price)}，与较新的Moomoo tick不同，收益统一用后者。公开数据可能延迟，均非可执行买卖价。应用保存行情和手工计划未被覆盖。${S(q.sourceId)}`},
  verdict:{stance:"经营改善，安全边际不足；先核验新财报与项目",summary:`基准今日约${usd(base.today.price)}–${usd(base.crossToday)}，当前${usd(q.price)}缺少本轮所需折让。Q3及项目缩减报道待核，当前新增0%。已有$36买单需复核，三档资金已扣其$1,080。`,confidence:"中低：公开盈利和现金可核实，客户项目持续期、浮存资金分拆、ATM和近期事件仍不确定",valueLow:Math.min(base.today.price,base.crossToday),valueHigh:Math.max(base.today.price,base.crossToday),
    conclusion:`INOD的增长、盈利、可复用数据资产和高难交付是真进展，不应简单视为普通低附加值外包。Q2收入92.142百万、经营EBIT15.860百万、归母净利14.412百万；但两客户约71%收入，巨额报告CFO主要受客户/供应商资金时点影响，不能全额永续。基准今日DCF${usd(base.today.price)}、2031经营盈利倍数校验${usd(base.crossToday)}；2031两法${usd(base.future.price)} / ${usd(base.cross.price)}，当前${usd(q.price)}五年代理年化约${pct(scenarioReturn(base.future.price,q.price))} / ${pct(scenarioReturn(base.cross.price,q.price))}。较高方法不能当保证回报，行动采用保守端与15%门槛。更严厉项目缩减压力今日${usd(stress.today.price)}、2031${usd(stress.future.price)}，无主观概率。当前新增0%；条件三档${ranges.map(v=>`${n(v.low)}–${n(v.high)}`).join(" / ")}。目标1%=$4,000、上限1.5%=$6,000，先扣已有30股×36美元的1,080美元买单；36高于新首档上沿，需按明日Q3/项目证据复核，未自动改动。`,
    limitations:"公开理论的方法模拟，不是七位投资者的本人观点。最新实绩仍为Q2，Q3/指引/ATM实际发行量及7月后股数未知。客户预付相关116.371百万是按管理层约134百万净现金反推的余额口径，不能当精确期间CFO调整，相关负债/供应商预付定义未完全拆清。可复用数据、工具、服务及重复收入占比未量化，2026单一分部限制细分利润验证。未来报酬按新服务现金成本5%收入、既授奖励按当前索偿，属于正常化经济模型，不是逐笔GAAP预测；假设RSU/PSU全归属，期权内在法不精确反映时间/归属/税。经营EBIT历史统一剔除利息/PPP，非所有原报表行名。长期利润、增量资本、税和终值均为假设，十个标准年度及2031是五期近似，非精确日期stub。倍数法未完成同日同行实证。裁员人数、客户身份和收入影响未获公司确认；不把旧监管资料缺失当已结案或仍在调查。旧菲律宾判决及利息未全部扣入基准，另列索偿压力；完整法律结果无法预测。压力情景不等于最坏结果，投资者税费、汇率和全账户风险约束未齐。"},
  position,entries:ranges.map((v,i)=>({tier:["observation","safety","discount"][i],...v,budgetSharePct:[25,35,40][i],condition:`上沿=min(基准保守2031价${n(futureReference,5)}/1.15^5，保守今日${n(reference,5)}×${pct(1-margins[i])})，向下到美分为${n(v.high)}；要求至少15%五年研究回报与${pct(margins[i])}折让。先核验11月5日Q3、客户/项目与裁员报道、合同持续性、预付款及ATM实际股数，不能只因到价买入。${i===2?`低于${n(v.low)}（约35%基准价值向上取分）先重做尽调，不是保本底价。`:"更低价若伴随项目流失或利润/现金恶化，应重建价值后再判断。"}`})),scenarios,
  masters:notes.masters.map((v,i)=>({...v,evidence:`${v.evidence} ${refs[i].map(S).join("")}`})),debate:notes.debate,
  sections:[
    {title:"业务与护城河：可复用资产、高难服务和工具分别看",body:`INOD为AI模型开发与应用提供数据工程、训练/后训练数据、评估、质量保证及相关技术服务，也有历史上的信息/医疗数据和媒体软件业务。收费包括工时、单位交付、固定费用/里程碑及订阅等，不同经济性应分开。从2026Q1起公司统一为单一报告分部，不能把DDS/Synodex/Agility旧三分部当当前正式利润披露。${S("fy25-10k")}${S("q2-10q")}\nFY2025旧分部收入DDS220.825、Synodex7.322、Agility23.516百万，EBIT分别39.402/0.626/−0.155，能说明历史规模，不能据此替2026拆利润。Q2管理层称现成自有数据集能跨客户重复变现，高价值预训练/评估和研究驱动项目也改善毛利。这比仅增加工时更有吸引力，但尚无可验证的细分收入、重复收入比例或独立产品ROIC。${S("q2-release")}\n客户通常拥有自己的数据、模型和定制交付，公司保留既有/通用IP、方法和工具，另有自己可授权的数据资产。不能把所有客户数据当自由共享的网络效应。质量、保密、专家资源和嵌入工作流形成转换成本，云/数据公司、Scale AI、TELUS Digital、Appen及新专家网络等竞争者、客户自建和多供应商采购又限制议价。\nAI自动化既能减少低难度工时单价，也会增加复杂评估、专家反馈、强化学习环境和多模态数据需求；生产率提高的收益由谁保留，要用价格、交付、毛利和复购验证，不能只看AI总市场规模。`},
    {title:"Q2实绩：盈利与经营杠杆强，费用和客户也要拆",body:`单位百万美元。Q2收入92.142、同比约57.8%；GAAP毛利42.460、毛利率46.1%，调整毛利45.383、49.3%。调整毛利加回D&A2.242及该成本中的SBC0.681；不能把49%当GAAP。经营EBIT15.860、17.2%，净利14.412还含净利息1.695，调整EBITDA25.355又加回税、利息、D&A及总SBC7.196，不是自由现金。${S("q2-10q")}${S("q2-release")}\nQ2销售管理费用同比约+88.5%、增加12.488百万，约11百万与薪酬相关；收入增长与经营杠杆是真实的，人才、研发与股票激励成本也没有消失。未来模型经济利润须持续承担新服务报酬。\n公司重申FY2026收入至少+40%，以FY25 251.663推算下限352.328百万，是指引不是实绩。H1已182.238，达到该下限需H2至少170.090百万；这不能证明新项目必到，也不能把尚未确定范围/时点的潜在项目额外当作已锁订单。\n基准2027收入450百万来自研究选择，不是管理层2027指引。最新Q3将于11月5日收市后公布、17:00 EST电话会，新西兰11月6日11:00 NZDT；本报告没有提前使用未发布财报。${S("q3-date")}`},
    {title:"集中度与合同：少了一点单客依赖，仍有两客依赖",body:`Q1最大/第二客户约56%/17%，Q2约37%/34%，Q2前二仍71%；H1约46%/26%，前二72%，应收66%来自两客户。FY2025最大客户58%，FY2024约48%。最大客户权重下降和新客户扩张是进步，但Q2最大客户绝对收入较Q1下降也显示项目预算会变，不把分散口号当合同保护。${S("q2-10q")}${S("q2-release")}\n公司以MSA配SOW/订单开展合作，通常没有未来最低量承诺，许多安排可30–90天取消，部分项目更短；长期伙伴关系不等于多年保证采购。匿名客户不猜名字，不借知名AI公司的声誉保证INOD现金流。\nH1按客户所在地美国收入159.079百万、约87.3%，不是交付员工所在地。全球交付、人力配置和成本可变性会影响失单后的恢复速度，不能把全部薪酬都当随收入同步消失，也不能假定永远固定。大客户信用质量与预算/供应商选择是不同风险，项目缩减不等于客户违约。`},
    {title:"最新事件与治理：报道、实验室和真正订单分清",body:`10月28日Business Today/India Today原创报道提到印度及菲律宾项目人员调整，记者称查看过一封涉及业务任务缩减的通知；约550名受影响人数未获公司公开确认，具体客户与收入影响也未确认。本文不把人数、匿名客户猜测或永久订单流失当事实；它是必须由Q3/指引解释的经营信号。${S("layoff-report")}\n9月30日公司宣布新泽西motion-capture AI实验室及Vicon合作，说明物理AI能力投入，但未披露对应合同额或已确认收入，不能拿它定量抵销尚未核实的项目风险。劳动力重配也可能反映项目组合/技术效率变化，需与客户需求和利润一起检验。${S("motion-lab")}\nRahul Singhal于9月30日成为CEO、Jack Abuhoff转执行主席，Jayant Chauhan任CFO；相关8-K/A及10月S-8签字确认角色。治理评价看新管理层执行、激励和披露，不因交接自动判好坏。S-8额外600,000计划授权不等于已发行股票。${S("ceo-8ka")}${S("s8-oct")}`},
    {title:"五年财务与TTM：经营EBIT和一次项不能混",body:`完整FY2021–25，单位百万。经营EBIT统一剔除非经营利息/PPP，历史原表的行名和展示方式不同，不能把下列每个EBIT都说成原文相同行名GAAP operating income；净利为归母口径，早期少数权益也会影响桥接。\n${annual}\n2021按69.755收入−43.494直接成本−27.912SG&A得到经营EBIT−1.651，PPP豁免约0.580与利息排除；2022原展示也含少额利息，统一剔除。2024所得税为收益4.190百万，其中约6百万估值备抵释放，不把28.660净利原样当常态税后盈利；模型税24%–26%。FY24CFO用最新比较口径34.864而非原版35.015，避免混报。${S("fy22-10k")}${S("fy25-10k")}${S("sec-companyfacts")}\nH1收入182.238、EBIT32.760、净利29.310、SBC13.104、CFO164.441、总现金CapEx5.309、报告FCF159.132。TTM=FY2025+H126−H125：收入317.164、EBIT55.450、归母净利46.485、CFO196.203、CapEx12.355、报告FCF183.848，现金数字包含客户资金时点，不能用它们算未经正常化的高FCF收益率。${S("q2-10q")}`},
    {title:"现金桥与软件资本：250百万不是全部自由资产",body:`6月末现金及短投250.371百万，管理层披露净掉与代垫成本有关客户预付款后约134百万；两者差116.371是按管理层圆整净现金反推的余额口径，非一条经审计的‘客户预收’科目。B/S advances from customers66.962百万、应付53.039、其他应计36.346、供应商预付14.049等也变化，不能将116.371直接当精确期间CFO流入。${S("q2-10q")}${S("q2-release")}\nH1净利29.310+SBC13.104+D&A4.475−递延税1.175+养老金非现金0.818+经营营运资本变化117.909=报告CFO164.441。将CFO或FCF粗略减116.371只是一项诊断，不能称重述后的精确现金流或FCFF。客户支付和供应商结算有对应义务，模型扣掉这部分现金后也不再假设同一笔预付重复提供增长融资。\nH1现金CapEx5.309已经同时包含设备与资本化内部软件，不能再额外扣软件新增一遍；软件净值14.175、H1摊销约2.3百万，未来12个月总CapEx计划13.1百万。模型总CapEx=2.5%收入的D&A+1.5%（基准）净资本支出，2027总18百万，含全部软件设备；研发/维护已费用化部分不重复资本化扣减。\n股权桥采用134−运营储备20−养老金缺口9.534−供应商许可义务1.665−其他索偿储备0.650=${n(k.netNonoperatingAssets,3)}百万，均是清楚列出的研究约定；不是250百万全加。租赁租金留在成本，不再减3.832百万租赁负债；利息不在经营EBIT资本化，避免现金与利息双加。`},
    {title:"当前索偿、未来报酬和ATM：增股也要看收到什么",body:`最后验证的7月31日普通股34.382651百万；现有RSU0.666188、绩效RSU0.470172百万按全归属计，另期权0.851771百万@1.63、0.347880百万@26.51。按场景内在价值是否价内，增加对应股份并加一次行权资本；不是只用旧加权EPS股数。基本股数与现有奖励可能存在小额交叉，期权时间/归属/税不做假精度。${S("q2-10q")}\n模型以Q2经营利润加回旧SBC的约25%作为利润能力参照，对未来新服务报酬再保留5%收入现金替代成本，基准起步经济EBIT20%，到2031 22%。既授奖励的索偿已在分母，旧未摊费用约46.5百万不再扣成同一笔新报酬；这是一种正常化经济模型，不能把20%称未来GAAP指引，也不假设员工薪酬免费。未来没有再同时机械增股同笔报酬。\n8月6日300百万ATM是可用授权，佣金最高2%，未取得Q3实际使用量；不把全部注册额当到账现金，也不只加股份不给匹配现金。10月计划授权600,000股也不是已发行。新财报将更新真实股份、奖励和融资用途，再判断每股结果。${S("atm-aug")}${S("s8-oct")}`},
    {title:"十年FCFF：基准已经包含持续增长和利润改善",body:`十个年度2027–2036，2031为第5期约定，未精确切11月估值日stub。FCFF=经济EBIT−正利润正常税+D&A−设备/软件总CapEx−12%（基准）增量营运资本；收入减少时释放普通营运资本是情景假设，不把坏账自动收回。现金按零利息留存，未加分红/回购收益率。\n${ids.map(id=>{const s=e.scenarios.find(s=>s.id===id),a=s.assumptions,c=results[id];return `${id}：2026参照${n(a.startRevenue2026,0)}、2027收入${n(a.revenue2027,0)}，之后增速${a.growth.slice(1).map(pct).join("/")}；经济EBIT率${a.margins.map(pct).join("/")}；税${pct(a.tax)}、净CapEx${pct(a.netCapexRatio)}收入、增量NWC${pct(a.nwcRatio)}；WACC${pct(a.wacc)}、g${pct(a.g)}、终值ROIC${pct(a.terminalRoic)}。今日${usd(c.today.price)}，2031${usd(c.future.price)}。`;}).join("\n")}\n终值NOPAT2037×(1−g/ROIC)/(WACC−g)，增长需要资本，不把未来收入全当现金。第5期剩余EV只含第6–10期及终值，前五期FCFF另作为保留现金加一次；各时点期权行权资本只加一次。\n基准复算（收入/EBIT/总CapEx/增量NWC/FCFF，百万）：\n${base.rows.map(v=>`${v.year}：${n(v.revenue,3)} / ${n(v.ebit,3)} / ${n(v.capex,3)} / ${n(v.nwc,3)} / ${n(v.fcff,3)}`).join("\n")}\n基准现金滚存扣已知索偿和储备后始终高于最低运营储备，没有预测必需的新增股本融资；严厉项目压力也未要求融资。这不等于公司不会用ATM或收购，只说明本模型不靠未知融资来维持生存。`},
    {title:"独立经营盈利倍数、目标与现价隐含要求",body:`第二种机制用2031经济EBIT×悲观10/基准16/乐观20倍EV，再加该时点保留净资产和一次行权资本，除匹配股数后用Ke折回。它与DCF共享经营路径、退出定价机制不同；倍数是研究假设，不是即时同行或分析师共识。\n${ids.map(id=>{const c=results[id],a=e.scenarios.find(s=>s.id===id).assumptions;return `${id}：2031EBIT${n(c.rows[4].ebit,3)}×${a.exitEbitMultiple}，期末每股${usd(c.cross.price)}、今日折现${usd(c.crossToday)}；DCF期末${usd(c.future.price)}、今日${usd(c.today.price)}。`;}).join("\n")}\n基准DCF2031${usd(base.future.price)}与16倍EBIT法${usd(base.cross.price)}分歧较大，因为后者给予不同的成熟持续期/定价。不能平均成‘确定目标’，行动参考较低的今日${usd(reference)}与期末${usd(futureReference)}。当前${usd(q.price)}对应基准两法五年年化${pct(scenarioReturn(base.future.price,q.price))} / ${pct(scenarioReturn(base.cross.price,q.price))}，高方法不是保证。\n反推固定首年研究收入450百万、其他基准参数，2028–2036恒定增长：\n${reverses.map(v=>`经济EBIT率${pct(v.margin)}，需约${pct(v.g)}增长，2031收入${n(v.revenue2031)}、2036${n(v.revenue2036)}百万。`).join("\n")}\n它是一组条件解，不是市场唯一预测；450百万本身尚未被指引或实绩证明。模型不把已报告近期收入也同比放大去凑现价。`},
    {title:"压力、敏感性与法律/交付边界",body:`基准WACC×g敏感性（美元/股）：\n${[.10,.12,.14].map(w=>`WACC${pct(w)}：`+e.sensitivity.filter(v=>v.wacc===w&&[.02,.03,.04].includes(v.terminalGrowth)).map(v=>`g${pct(v.terminalGrowth)}=${n(v.value)}`).join("；")).join("\n")}\n基准终值PV占业务EV约${pct(base.tvShare)}；高增长、22%经济利润率和客户持续性主导结果。2027收入比基准少20%且长期margin18%，今日约${usd(e.riskSensitivity.clientPrograms[1].value)}；净CapEx2.5%与增量NWC20%约${usd(e.riskSensitivity.capitalIntensity[1].value)}。\n更严厉项目压力：2027收入230百万（比450基准低约49%），前两年EBIT率−10%/−5%，随后恢复，亏损不即时退税；今日${usd(stress.today.price)}，2031${usd(stress.future.price)}。最低模型现金约${usd(Math.min(...stress.liquidity.map(v=>v.cash)))}百万，未要求融资；普通营运资本释放不保证发生，也不是最坏结果。该压力不是对裁员人数或失单收入的预测，无概率，已扣的客户浮存不再重复扣116百万。\n公司数据/交付涉及HIPAA/HITECH、GDPR/UK GDPR与跨境保密义务；客户所在地与人员/工资所在地不同，PHP/INR/LKR/ILS工资和汇率会影响利润，期末远期合约不代表消除了全部风险。数据权利、隐私、安全或质量事故可能破坏客户信任。${S("fy25-10k")}${S("q2-10q")}\nQ2披露证券集体诉讼于6月10日获终局驳回（dismissed with prejudice）；不要重复旧指控作为已证事实。旧菲律宾劳动判决本金约5.3百万并有利息，US执行禁令与最终法律风险仍需分别理解，基准未全额扣此旧案；额外10百万无资金匹配索偿敏感性约${usd(e.riskSensitivity.claims[0].value)}，非法律赔偿预测。旧SEC/陪审团资料的当前状态未能建立，既不宣称结案，也不据缺失推断仍在调查或造假。`},
    {title:"三档与已有36美元买单：先留预算，再核验",body:`普通股、USD、无杠杆；至少15%五年研究回报，今日参考25%/35%/45%折让，同时过关再向下到美分。收益上限=${n(futureReference,5)}/1.15^5=${n(futureReference/1.15**5,5)}；折让上限${caps.map(v=>n(v,5)).join(" / ")}；最终三档${ranges.map(v=>`${n(v.low)}–${n(v.high)}`).join(" / ")}。低于${n(ranges[2].low)}须重做尽调，不是永久底线。\n在各档上沿若保守基准兑现，五年年化${ranges.map(v=>pct(scenarioReturn(futureReference,v.high))).join(" / ")}；其他路径仍可能重亏。财报、合同/客户与回款证据不通过，即使到价也继续不新增。\n${position.rationale}\n${position.portfolioFit}\n原手工观察价${watch.targetPrice==null?"未填":usd(watch.targetPrice)}及旧三档仍保留。本研究未把原36美元买单当作当前推荐；它高于新首档上沿，应在新信息前复核，旧订单不应绕过经营条件。报告不会自动下单、取消或改价。\n下一步先读11月5日Q3的新客户/项目、预付结算、实际股数和指引，区分研究投入、新合同与已确认收入，再重估。没有必要为66张卡都在当前价格配置资金。`}
  ],
  figures:[
    {title:"五年收入与AI扩张",unit:"百万美元；完整FY",note:`${S("fy22-10k")}${S("fy25-10k")}。历史收入是事实，未来40%指引不放进实绩柱。`,rows:f.annual.map(y=>({label:`FY${y.year}`,value:y.revenue}))},
    {title:"Q2客户结构：两客仍占71%",unit:"收入百分比；Q2管理层圆整口径",note:`${S("q2-release")}。Q2和H1不能混；匿名客户身份未猜测。`,rows:[{label:"最大客户",value:37},{label:"第二客户",value:34},{label:"其他客户",value:29}]},
    {title:"现金质量：总额与扣客户资金后口径",unit:"百万美元；不同口径不可全部相加",note:`${S("q2-release")}。134为管理层圆整净额，116.371是反推余额，不是精确期间CFO或一条GAAP负债。`,rows:[{label:"现金及短投",value:250.371},{label:"扣客户相关款后约",value:134},{label:"客户相关余额差额",value:116.371}]}
  ],
  invalidation:[
    "Q3/指引确认核心客户项目持续缩减、新客户不能补足，或可取消合同安排无法支持研究成长路径：暂停新增并重建客户、收入与成本，不能仅因价格跌而加仓。",
    "可复用数据集/IP贡献未能持续、价格竞争或自建使经济毛利/利润显著下降，或大量前期研发/软件资本无法产生回报：降低持续期、margin和ROIC。",
    "客户预付款/代垫成本无法按披露对应、回款和真实现金质量恶化，或发生重大客户违约/数据安全事件：先核实信任和义务，不把总现金当保护。",
    "ATM、奖励或收购新增股份/现金与原假设不同，或SBC经济成本/净股数增长显著侵蚀每股成果：重算全部索偿，不把授权当已发行或已得款。",
    "重大未解治理、数据合规、劳工/诉讼或交付质量问题破坏可理解性，或整体AI预算相关风险超出组合限额：暂停按旧表执行。"
  ],
  reviewTriggers:[
    "11月5日收市后Q3/17:00 EST电话会（NZ11月6日11:00）：核对至少40%全年收入增长指引、核心项目变化和近期裁员报道，公司未确认人数/客户时不猜。",
    "分季度追踪最大、第二客户收入及项目/合同期限、取消权与新增客户复购，Q2 37%/34%、H1 46%/26%及AR66%两客按同口径比较。",
    "核验250.371总现金、约134净客户相关款后口径、供应商预付/应付/应计与预收的结算；不要把重复浮存当永续FCF。",
    "更新7月后实际股数、300百万ATM实际成交及用途、600k计划授权、奖励和期权归属，检查新经济报酬成本与每股回报。",
    "核验现成数据集/研究驱动项目的可重复收入、软件资本化与总CapEx、成本/汇率及新实验室实际产出；能力公告未披露订单额时不自填营收。"
  ],
  sources:sources.map((s,i)=>({label:`[S${i+1}] ${s.title||s.id}`,url:s.url,date:`${s.date}；${s.period||""}；核验日2026-11-05 NZDT`})),
  evidenceFacts:f,model:{capital:k,methodology:e.methodology,scenarios:e.scenarios,stress:e.stress,sensitivity:e.sensitivity,riskSensitivity:e.riskSensitivity,reverse:e.reverse,parentAudit:{status:"FCFF-option-claims-proceeds-cross-value-liquidity-stress-and-reverse-independently-reconstructed",caps,ranges,reverses}},evidenceStatus:e.status,portfolioSnapshot:portfolio
};
validateDecisionReport(r,watch);
await fs.writeFile(new URL("./inod-analysis-input-2026-11-05.json",import.meta.url),JSON.stringify(r,null,2)+"\n");
console.log(JSON.stringify({symbol:r.symbol,quote:r.quote,values:scenarios.map(s=>({id:s.id,today:s.todayValue,year5:s.year5Price})),entries:decisionEntryPlan(r).map(({tier,low,high,dollars,shares})=>({tier,low,high,dollars,shares})),pending,stress:{today:stress.today.price,year5:stress.future.price},audit:r.model.parentAudit.status},null,2));
