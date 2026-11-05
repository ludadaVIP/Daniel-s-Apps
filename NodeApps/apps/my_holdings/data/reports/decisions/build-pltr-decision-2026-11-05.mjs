import fs from "node:fs/promises";
import { validateDecisionReport, decisionEntryPlan, scenarioReturn } from "../../../src/decision-reports.js";

const e=JSON.parse(await fs.readFile(new URL("./pltr-evidence-model-2026-11-05.json",import.meta.url),"utf8"));
const notes=JSON.parse(await fs.readFile(new URL("./pltr-debate-notes-2026-11-05.json",import.meta.url),"utf8"));
if(e.audit.status!=="passed_with_explicit_model_limitations")throw Error("PLTR evidence audit must pass before delivery.");
const f=e.facts,m=e.model,q=e.quote,ids=["bear","base","bull"];
const n=(v,d=2)=>Number(v).toLocaleString("en-US",{minimumFractionDigits:d,maximumFractionDigits:d});
const pct=v=>`${n(v*100,1)}%`,usd=v=>`$${n(v)}`;
const S=id=>{const i=e.sources.findIndex(s=>s.id===id);if(i<0)throw Error(`Missing source ${id}`);return `[S${i+1}]`;};
const near=(a,b,label)=>{if(!Number.isFinite(a)||!Number.isFinite(b)||Math.abs(a-b)>1e-7)throw Error(`PLTR independent reconstruction: ${label} ${a}/${b}`);};

// Reconstruct every annual FCFF, terminal value, cash bridge and future value
// directly from raw scenario assumptions; do not reuse the research calculator.
function reconstruct(a,price=q.price,shareCount=m.startingSharesB){
  let revenue=m.revenueBaseB;
  const flows=a.growth.map((g,i)=>{const prior=revenue;revenue*=1+g;const tax=m.normalTaxPath[i],ebit=revenue*a.ebitMargin[i],nopat=ebit*(1-tax),investment=(revenue-prior)/a.salesToCapital;return {year:2027+i,revenue,ebit,nopat,investment,fcff:nopat-investment};});
  const terminal=flows.at(-1).revenue*(1+a.terminalGrowth)*a.ebitMargin.at(-1)*.77*(1-a.terminalGrowth/a.terminalROIC)/(a.wacc-a.terminalGrowth);
  const pvFlows=flows.reduce((sum,row,i)=>sum+row.fcff/(1+a.wacc)**(i+1),0);
  const terminalPV=terminal/(1+a.wacc)**10;
  const cash=(f.balanceSeptember2026.cashPlusMarketableM-f.balanceSeptember2026.minorityEquityM)/1000-m.operatingReserveB;
  const futureCash=cash+flows.slice(0,5).reduce((sum,row)=>sum+row.fcff,0);
  const futureEV=flows.slice(5).reduce((sum,row,i)=>sum+row.fcff/(1+a.wacc)**(i+1),0)+terminal/(1+a.wacc)**5;
  const today=(pvFlows+terminalPV+cash)/shareCount,price2031=(futureEV+futureCash)/shareCount;
  const multiple2031=(flows[4].nopat*a.pe2031+futureCash)/shareCount;
  return {flows,terminal,terminalPV,ev:pvFlows+terminalPV,cash,futureCash,futureEV,today,price2031,multiple2031,crossToday:multiple2031/1.15**5,terminalShare:terminalPV/(pvFlows+terminalPV),cagr:scenarioReturn(price2031,price)};
}
const computed=Object.fromEntries(ids.map(id=>[id,reconstruct(m.scenarioAssumptions[id])]));
for(const id of ids){const c=computed[id],s=m.scenarios[id];
  c.flows.forEach((row,i)=>{near(row.fcff,s.rows[i].fcffB,`${id}/${row.year}/FCFF`);near(row.revenue,s.rows[i].revenueB,`${id}/${row.year}/revenue`);});
  for(const [k,v] of Object.entries({todayDCF:c.today,price2031DCF:c.price2031,price2031NormalizedProfitMultiple:c.multiple2031,crossValueTodayAt15pct:c.crossToday,netCash2031B:c.futureCash,enterpriseValueB:c.ev}))near(v,s[k],`${id}/${k}`);
}
const base=computed.base,ba=m.scenarioAssumptions.base;
const caps={observation:Math.min(base.price2031/1.15**5,base.today*.8),safety:Math.min(base.price2031/1.18**5,base.today*.65),discount:Math.min(base.price2031/1.20**5,base.today*.5)};
const high=[Math.floor(caps.observation),Math.floor(caps.safety),Math.floor(caps.discount)];
const ranges=[{low:high[1]+.01,high:high[0]},{low:high[2]+.01,high:high[1]},{low:Math.ceil(base.today*.35),high:high[2]}];
if(ranges.some(x=>x.high<x.low))throw Error("Invalid price ranges");
const sensitivity=[.085,.105,.125].flatMap(wacc=>[.025,.035,.045].map(terminalGrowth=>({wacc,g:terminalGrowth,value:reconstruct({...ba,wacc,terminalGrowth}).today})));
const capitalSensitivity=[3,6,10,Infinity].map(salesToCapital=>({salesToCapital:Number.isFinite(salesToCapital)?salesToCapital:"no incremental net operating capital",value:reconstruct({...ba,salesToCapital}).today}));
const roicSensitivity=[.3,.6,1].map(terminalROIC=>({terminalROIC,value:reconstruct({...ba,terminalROIC}).today}));
const basicShares=f.sharesAndGovernance.october26BasicSharesB;
const sharesSensitivity=[basicShares,2.59,2.59*1.01**10].map(shares=>({shares,value:reconstruct(ba,q.price,shares).today}));
// A counterfactual SBC dilution stress is separate from the cash-cost main case.
// It is not presented as a second charge in the core forecast.
function reverseGrowth(){let lo=0,hi=1;for(let i=0;i<100;i++){const mid=(lo+hi)/2,v=reconstruct({...ba,growth:Array(10).fill(mid)}).today;if(v<q.price)lo=mid;else hi=mid;}const growth=(lo+hi)/2,c=reconstruct({...ba,growth:Array(10).fill(growth)});return {growth,revenue2036:c.flows.at(-1).revenue,value:c.today};}
const reverse=reverseGrowth();
const scenarios=ids.map((id,i)=>{const c=computed[id],a=m.scenarioAssumptions[id];return {id,label:["悲观：增长正常化","基准：持续强增长","乐观：全球AI操作层"][i],todayValue:c.today,year5Price:c.price2031,assumptions:`2027/2031/2036收入${n(c.flows[0].revenue)}/${n(c.flows[4].revenue)}/${n(c.flows[9].revenue)}十亿美元；2027→2031→2036含SBC营业率${pct(a.ebitMargin[0])}→${pct(a.ebitMargin[4])}→${pct(a.ebitMargin[9])}；WACC${pct(a.wacc)}，终值g${pct(a.terminalGrowth)}、ROIC${pct(a.terminalROIC)}，增量销售/资本${a.salesToCapital}；股数25.9亿。`};});

const api="http://127.0.0.1:5889/my-holdings/api";
const state=await(await fetch(api+"/state")).json();
const watch=state.watchlist.find(w=>w.symbol==="PLTR");
if(!watch)throw Error("PLTR is missing from the app.");
// The read-only portfolio helper is run separately immediately before this build.
const portfolio=JSON.parse(await fs.readFile(new URL("./pltr-portfolio-context-2026-11-05.json",import.meta.url),"utf8"));
const exposure=portfolio.company.value,pending=portfolio.pendingKnownLimitBuyUsd;
const position={currentAdditionalPct:0,targetPct:2,maxPct:3,existingExposureUsd:exposure,pendingBuyUsd:pending,
  rationale:`现价不新增。若经营证据与价格条件同时通过，研究目标为公司总敞口2%=$8,000，上限3%=$12,000；当前已穿透${usd(exposure)}、本地待成交买单${usd(pending)}，目标剩余${usd(Math.max(0,8000-exposure-pending))}。三档只分配剩余资金25%/35%/40%，不是另加到原有敞口上。压力下若跌70%，2%/3%仓位对组合影响约1.4%/2.1%；极端全损为2%/3%，共同下跌会使组合风险更大。这是条件研究预算，不是已获完整个人适配验证的最终配置。`,
  portfolioFit:`当前无直接PLTR持仓；已有QQQM及VOO穿透合计${usd(exposure)}，约占40万美元${pct(exposure/400000)}，因此不是完全错过该公司。持仓/报价/基金成分均为应用已保存快照，基金成分有日期滞后，实际权重会变；外部账户、流动性、税务与可承受回撤未知。宽基、科技ETF及其他AI/成长股的相关性高，单只2%不能简单当作全组合安全。卡片手填目标价${watch.targetPrice}美元、保存行情${watch.price}及原有研究保留，旧目标价不是本模型的买入依据。所有66支的上限不能同时买满。`};
const Q3D=e.sources.some(s=>s.id==="Q3Q")?"Q3Q":e.sources.some(s=>s.id==="Q3TENQ")?"Q3TENQ":"Q3_10Q";
const refs=[["Q3",Q3D],["Q3P",Q3D],[Q3D,"FY25"],["Q3","Q3P",Q3D],["ARMY",Q3D],["Q3",Q3D],["Q3",Q3D]];
const annualLines=f.annual.map(a=>`${a.year}：收入${n(a.revenueM,3)}；毛利率${pct(a.grossMargin??a.grossProfitM/a.revenueM)}；营业利润${n(a.ebitM,3)}；归母净利${n(a.netIncomeCommonM,3)}；CFO${n(a.cfoM,3)}；现金CapEx${n(a.capexM,3)}；FCF${n(a.reportedFcfM??a.cfoM-a.capexM,3)}；SBC${n(a.sbcM,3)}；稀释加权股数${n(a.dilutedWeightedSharesM,3)}百万。`).join("\n");
const r={version:1,symbol:"PLTR",name:"Palantir Technologies Inc.",exchange:"NASDAQ · Class A",currency:"USD",capitalUsd:400000,horizonYears:5,analysisDate:"2026-11-05",
  dataAsOf:"2026-11-05 NZDT（美国仍为11月4日）；最新实绩为9月30日止Q3/9M，11月2日发布、11月3日提交10-Q；报价见独立时点，全年2026数字为指引而非实绩。",
  financialPeriod:"FY2021–2025、2026Q3/9M、TTM至2026-09-30",
  quote:{price:q.price,date:q.timestamp.slice(0,10),asOf:q.timestamp,type:"盘前报价快照",source:"Moomoo实际浏览器页面",sourceUrl:q.source,note:`页面${q.providerLabel}：${usd(q.price)}，供应商时点${q.timestamp}，直接读取于${q.observedAtUtc}；正式11月3日收盘${usd(q.formalClose)}。这是有时点的供应商盘前快照，不能称生成瞬间实时成交。应用已存报价未被覆盖。${S("QUOTE")}`},
  verdict:{stance:"经营优秀，现价不新增；等待有回报余地的买价",summary:`AI增长与GAAP盈利很强，但${usd(q.price)}盘前价仍透支较多成功。基准今日约${usd(base.today)}–${usd(base.crossToday)}；先看三档条件价与已有ETF敞口，当前新增0%。`,confidence:"企业质量中高；长期估值中低，成长持续期、竞争与终值主导结果",valueLow:Math.min(base.today,base.crossToday),valueHigh:Math.max(base.today,base.crossToday),
    conclusion:`PLTR已证明高速增长、强利润与现金生成可以并存，不能再用‘只有故事、没有利润’解释它。美国商业+148%、政府+96%和NDR165%支持产品真实价值；同时62%调整营业率不能替代47%GAAP利润，合同上限也不是确定收入。基准模型已给2031收入${n(base.flows[4].revenue)}十亿美元、含SBC营业率45%，今日DCF${usd(base.today)}，独立2031正常化经营盈利倍数校验的15%门槛折现值${usd(base.crossToday)}。基准2031续存DCF期末${usd(base.price2031)}，相对${usd(q.price)}年化${pct(base.cagr)}；更高倍数校验期末${usd(base.multiple2031)}，两方法差距反映远期估值不确定性。当前新增0%；条件三档${ranges.map(x=>`${n(x.low)}–${n(x.high)}`).join(" / ")}美元，目标总敞口2%、上限3%，先扣已有ETF穿透。乐观成功有上行，不能保证五年翻倍。`,
    limitations:"这是公开资料与明示假设的研究，不是七位大师本人的观点或持仓背书。10年成长、利润与终值资本回报没有确定性；基础模型已是很强增长路径。每股25.9亿为当前授予股权近似，不是精确未来股数；库藏股法随价变，已授股权与以后GAAP报酬可能保守重叠，另给仅基本股数敏感性。未来SBC采用现金成本/抵消稀释的经济约定，不同时加回并增股；不保证公司实际回购。税率15%→20%→23%、增量资本、运营现金储备与少数权益账面扣减为研究约定。未来现金不计利息且全部留存，不假设分红。采用2026指引中点作年度t0、2027–2036十期，未精确计两个月stub；2031是年度约定。独立倍数为有理由的情景假设，未完成统一时点同行市场倍数实证；不能声称同行给出共识目标。部分国际、客户与战略投资风险无法从汇总数据完整拆解。组合覆盖保存快照、外部资产和个人风险约束未齐。"},
  position,
  entries:ranges.map((v,i)=>({tier:["observation","safety","discount"][i],...v,budgetSharePct:[25,35,40][i],condition:[
    `上沿=floor(min(2031基准价${n(base.price2031,4)}/1.15^5，今日DCF${n(base.today,4)}×80%))=${v.high}；至少15%五年研究年化与20%估值折让两关。先复核最新两个季度商业留存、利润、RPO/签约与现金，未见重大核心恶化才讨论学习仓。`,
    `上沿=floor(min(${n(base.price2031,4)}/1.18^5，${n(base.today,4)}×65%))=${v.high}；门槛18%年化并至少35%折让。更低报价不能替代经营证明，须确认增长正常化没有低于重估后的基准、SBC及客户信用可控。`,
    `上沿=floor(min(${n(base.price2031,4)}/1.20^5，${n(base.today,4)}×50%))=${v.high}；门槛20%年化并至少50%折让。${v.low}为约35%基准价值向上取整的尽调边界，不是价值底线；低于此处先重建模型，绝不无限自动加仓。`
  ][i]})),scenarios,
  masters:notes.masters.map((v,i)=>({...v,evidence:`${v.evidence} ${refs[i].map(S).join("")}`})),debate:notes.debate,
  sections:[
    {title:"我拥有的是什么：企业AI操作层，而非单一模型",body:`标的是NASDAQ Class A普通股。Gotham支持政府/国防分析与运营；Foundry把商业客户的数据、权限、业务对象和流程连接起来；Apollo负责跨云、现场与受限环境的软件部署管理；AIP把AI与这些工作流结合。主要收入来自平台订阅、部署及相关服务，政府与商业为两个披露分部。${S("FY25")}${S(Q3D)}\n真正的客户价值在于把分散数据变成可执行决策，并满足权限、审计与可靠性要求。复杂组织长期集成后，迁移成本、流程依赖、部署经验与安全资质可能形成护城河；客户数据仍属客户，不把它说成公司可任意出售或共享的全网网络效应。基础模型商品化既可能压低应用壁垒，也可能降低Palantir调用模型成本、扩大客户ROI，方向取决于产品层价值。\nPorter五力：企业预算与政府采购有议价权；云平台、数据平台、企业应用和客户自建都构成替代；人才、云算力与模型供应有成本，客户可多供应商部署。资质、流程集成和长期可信交付限制新进入者，但没有证据证明永久垄断。重点看同客户扩张、利润与交付成本，不能仅凭演示或名气认定护城河。`},
    {title:"最新Q3：强劲增长是真的，地区差异也是真的",body:`Q3收入2,313.411百万美元，对比1,181.092百万约+95.9%；美国收入约1,937百万、商业984百万（+148%）、政府953百万（+96%），美国商业首次超过美国政府。美国占比约${pct(1937/2313.411)}；国际约376.4百万，不将美国商业增速套到全球全部业务。商业客户904、总客户1,090，NDR165%，显示老客户扩张很强，但NDR是历史群体收入指标，不是每个客户必然增加65%。${S("Q3")}${S("Q3P")}\nQ3毛利1,930.125百万、毛利率约83.4%；GAAP营业利润1,084.845百万、营业率46.9%，调整营业利润1,426.840百万、61.7%。SBC318.889百万与相关雇主税23.106百万解释主要差额；高速增长伴随GAAP利润提升是强反证，不能偷换成‘仍未盈利’。归母净利1,128.012百万含利息及其他非经营项，不能直接当纯经营盈利。\nFY2026收入8,530–8,534百万、调整营业利润5,245–5,249百万、调整FCF4,800–5,000百万是11月2日上调的管理层指引，非全年实绩；2027以后均为本报告假设。Q4收入指引2,649–2,653百万仍需兑现。${S("Q3")}`},
    {title:"五年财务趋势：从亏损到强盈利，逐项看现金",body:`单位百万美元，FY为完整年度，FCF统一为CFO−现金CapEx，不等于FCFF。\n${annualLines}\n年度原始报表显示盈利能力显著跃升，也显示股份报酬长期重要。2024年SBC691.638百万，超过2023；2025年虽降至684.033百万，占收入比也降低，但不等于此后不再稀释。各年加权稀释股数为EPS分母，不能直接当今天实际股数。${S("FY25")}${e.sources.some(s=>s.id==="FY23")?S("FY23"):""}\n2026前九月：收入5,881.458、营业利润2,750.847、归母净利3,060.429、CFO3,319.902、现金CapEx29.969、FCF3,289.933、SBC785.690百万。TTM按FY2025+9M2026−9M2025重建：收入${n(f.TTM.revenueM,3)}、营业利润${n(f.TTM.ebitM,3)}、归母净利${n(f.TTM.netIncomeCommonM,3)}、CFO${n(f.TTM.cfoM,3)}、CapEx${n(f.TTM.capexM,3)}、FCF${n(f.TTM.reportedFcfM,3)}、SBC${n(f.TTM.sbcM,3)}百万。不能把9M当单季，也不把Q3年化当已实现TTM。${S("Q3")}${S(Q3D)}`},
    {title:"CFO、FCF、SBC和税：四个数字不能混成一个",body:`Q3CFO1,204.570百万，减现金CapEx8.014=普通报告FCF1,196.556百万；调整FCF1,216.077百万额外加回激励相关雇主工资税等19.521百万。调整营业利润的相关税23.106与现金流的19.521口径不同，不强行当相同现金流。CFO含SBC非现金加回、营运资本变化及非经营现金项目，不能直接用WACC资本化后再加全部证券与忽略股份。${S("Q3")}${S(Q3D)}\n9M净利含利息232.835百万及其他收益134.265百万，所得税仅41.142百万，有税损、股份税项与递延税估计影响；Q3税率很低并不是可永久外推的竞争优势。调整EPS按23%长期税等调整，与GAAP EPS恰好同为0.44不代表SBC成本消失。模型从不含利息与投资公允价值收益的GAAP式EBIT出发，保留SBC及其相关成本，现金税15%前两年、20%第3–4年、23%此后；税率仍属假设。\nSBC处理约定：未来报酬在利润中保留经济成本，不再加回、同时核心股数保持不变，等价于现金替代/抵消净稀释的经济估值，不是假设公司已经承诺回购。当前授予期权/RSU/SAR另估现存索偿；未来GAAP费用可能仍含这些既有奖励摊销，存在保守重叠，故列仅基本股数的价值上限敏感性，不宣称逐笔奖励公允价值精确计量。激励推动产品发展有价值，员工获得股份仍由股东承担成本。`},
    {title:"现金、应收、少数权益与资本回报",body:`9月末现金3,619.414百万、流动有价证券6,942.117百万，合计10,561.531百万；其中包含股票证券，不能把全额都叫无风险国债现金。披露现金+美国国债约10.4十亿美元与上述口径略有差异，并不矛盾。无有息债务；租赁租金已留在营业成本，模型不另重复扣租赁债。少数权益117.119百万按账面保守扣减是近似，非已核验退出公允价。${S(Q3D)}\n从10.561531十亿美元扣运营储备0.8532（2026收入指引中点10%，研究假设）及少数权益0.117119，非经营净现金桥为${n(base.cash,6)}十亿美元。EBIT没有资本化利息/投资收益，证券现金在桥中只加一次；私人战略投资不另任意赋价。未来FCFF全留存但不计现金利息；若未来回购，只在价值及股数中体现，不能再加一个回购收益率。\n应收1,883.498百万，9M应收变化消耗843.438百万，合同负债变化贡献396.996百万，现金转换需与收入、账期和客户信用一起看；高速增长会占用应收，不可直接判成虚增收入。客户存款和递延收入也对应未来履约，不是无义务白得的现金。\n软件研发及人才多在当期费用化，账面净资产ROE/ROIC受大量现金与历史亏损影响；本报告不拿未经研发资本化调整的账面ROIC冒充真实新增资本回报。模型的终值ROIC是成熟期经济假设，另做高回报敏感性。`},
    {title:"合同六层：签约、期权、RPO、采购上限、收入与现金",body:`Q3TCV2,918百万同比+6%，美国商业TCV1,463百万+11%；美国商业RDV6,517百万同比+79%、环比+4%。TCV是当期所签合同潜在全生命周期金额，RDV是剩余潜在价值，两者通常假设客户行使全部期权且无终止。大多数合同含终止条款，包括便利终止；战略商业合同还会按客户信用与收款能力调整。TCV不等于一年新增经常性收入，也不是公司收到的现金。${S("Q3")}${S(Q3D)}\n9月末不可撤销RPO4.9十亿美元，约44%在未来12个月、37%在13–36个月确认，其余更后；原始期限12个月以内采用豁免不披露，可撤销合同及客户存款不在该RPO定义内。RPO比RDV窄，也不能拿两个不同范围简单相减后宣布差额虚假。与6月末4.9十亿美元大体持平值得追踪，但确认收入与新签约会同时改变余额。\n收入加速而TCV同比较慢，可能有去年大单高基数、合同期限与签约时点、老客户扩张等解释；NDR165%是反方必须承认的强证据。单季不足以裁定需求拐点。连续两季需要核对ACV、期限、RPO/RDV、客户数、收入与回款，避免只挑最漂亮的指标。\n陆军2025年企业协议整合75份相关合同，十年最高100亿美元。陆军原文明确这不是具体采购义务或承诺；其中包含已有项目整合，不是无条件新增100亿美元。不能把整个上限加进估值、再加同一项目的TCV和收入。${S("ARMY")}`},
    {title:"增长反证与固定承诺：把对多方有利的事实保留",body:`去年Q3总TCV2,760百万、当时同比+151%；美国商业TCV1,310百万、当时+342%，是很高的比较基数。最新Q3 billings2,454.396百万对比1,225.548百万约+100.3%，NDR从上季157%升至165%，这些是反驳‘TCV+6%说明需求已崩塌’的真实证据。已取得材料没有可统一量化的ACV/合同期限，不能编一个期限调整后增速。${S("Q325")}${S(Q3D)}${S("Q3P")}\n全部商业客户904，其中美国商业686；两个口径不要混写。全球政府收入1,145.540百万、商业1,167.871百万，产品AIP未单独披露完整收入，不把全部美国商业984百万直接叫AIP收入，也不把每个客户都算成新增AI客户。\n本季及9M无单个客户超过总收入10%，说明不是某一客户支撑全部增长；但前二十客户TTM平均约146百万，推算合计约2.92十亿美元、占TTM约40%，该平均金额四舍五入，不能当精确集中度。Customer I占应收27%，上年末25%；收入分散不等于收款完全分散，更不能在没有资料时猜客户身份。${S(Q3D)}\n2026年3月修订云服务协议，十年最低投入5.6十亿美元，年度最低268–979百万，延至2036年2月29日。它是未来经营成本承诺，不把全额再减成金融债；但若需求低于预期，最低支出会压利润，熊情景也不是最大损失上限。未提款500百万授信不是已在账现金。\n9月末美国及英国递延税资产仍保留全额估值备抵，不编造‘本季已释放备抵’的一次性利得；公司提示未来可能释放，届时GAAP净利可能获一次性支持，却不是同额经常现金。模型归一化税率后再评价盈利。`},
    {title:"治理与每股权益：投票权不等于经济权",body:`Class A一股一票、Class B通常十票；Class F与创始人安排在满足条件时可维持接近49.999999%的投票控制，经济权利与超额投票权要分开。优点可能是长期战略稳定，代价是少数股东对激励与资本配置影响有限；不能因为公司增长强就忽略治理成本。${S("FY25")}${S(Q3D)}\n10月26日基本总经济股数约2.409497474十亿，须把A/B/F统一，不能只用自由流通A股；9月末期权146.841百万、加权行权10.16美元，RSU35.503百万、P-RSU0.140百万、SAR18.511百万及其条款均有潜在索偿。核心采用2.59十亿股，与Q3加权稀释2.573926十亿是不同口径，后者只作合理性校验。库藏股法随价格变化，行权现金、税扣和归属条件未逐笔估值，所以不以分母的小数制造确定感。\n2025回购约74.985百万、2026前九月约1.5百万，都远小于SBC规模，不能把授权或小额回购当作净稀释已经消除。应检查每股经营成果、净发行、现金使用及管理层兑现。内幕交易计划或高管出售需要结合完整申报与税务/计划背景，不能单凭出售就推断经营即将失败，也不为控制权安排提供名人背书。`},
    {title:"方法一：十年FCFF，基准已经很强",body:`单位十亿美元。t0收入使用FY2026指引中点8.532，2027–2036十个年度，含SBC营业利润×(1−税)−净再投资=FCFF。净再投资=当年新增收入/增量销售资本比，代表新增净经营资本（净CapEx与营运资本等），不再把已经费用化的研发、FDE销售/交付或人才报酬重复扣成资本支出。D&A与CapEx/营运资本合并为净资本约定，未伪装成精确逐项预算。\n${ids.map(id=>{const a=m.scenarioAssumptions[id],c=computed[id];return `${id}：逐年增长${a.growth.map(v=>pct(v)).join("/")}；逐年EBIT率${a.ebitMargin.map(v=>pct(v)).join("/")}；销售/资本${a.salesToCapital}，WACC${pct(a.wacc)}，终值g${pct(a.terminalGrowth)}、ROIC${pct(a.terminalROIC)}。今日${usd(c.today)}；2031期末${usd(c.price2031)}。`;}).join("\n")}\n终值FCFF=2037收入×成熟EBIT率×77%×(1−g/ROIC)，再除WACC−g；增长不是无资本、无税的免费永续。EV加非经营现金桥后除2.59十亿股。核心并未把96%成长保持十年；基准2027仍+50%，2031收入34.164十亿美元约为2026的四倍，2036约57.904十亿美元，已经要求很成功的执行。\n基准年度复算（收入/EBIT/净再投资/FCFF）：\n${base.flows.map(v=>`${v.year}：${n(v.revenue,3)} / ${n(v.ebit,3)} / ${n(v.investment,3)} / ${n(v.fcff,3)}`).join("\n")}\n2031期末价值是第6–10年剩余FCFF与终值在2031的EV，加前五年已赚取且留存的FCFF现金；没有把前五年现金既留在EV又加一次。未计分红、税费、NZD汇率；五年年化不是承诺收益。`},
    {title:"方法二：2031正常化经营盈利倍数，差异不能藏起来",body:`独立校验采用2031税后经营利润（排除现金利息）×经营盈利倍数，再加该时点非经营现金，除股数。悲观22倍、基准30倍、乐观38倍是研究情景，代表不同的成长、竞争与回报持续期，未声称已经查得某个同行的即时P/E。它与DCF共享经营假设，终值定价机制不同；并非完全独立的事实预测。\n${ids.map(id=>{const a=m.scenarioAssumptions[id],c=computed[id];return `${id}：2031 NOPAT${n(c.flows[4].nopat,3)}×${a.pe2031} +现金${n(c.futureCash,3)}，期末${usd(c.multiple2031)}；按15%研究门槛折五年为${usd(c.crossToday)}。`;}).join("\n")}\n15%是买方回报门槛，不等同于DCF基准10.5%WACC；本项今日折现数是门槛校验参考，不能伪装成统一折现率的‘客观真值’。基准期末${usd(base.multiple2031)}高于续存DCF${usd(base.price2031)}，因为30倍正常化利润给予更高的长期特许权价格。不能把两者平均来掩盖终值分歧。\n行动使用更保守的基准DCF与其2031期末值，不采用较高倍数作为追价许可。今日基准参考约${usd(base.today)}–${usd(base.crossToday)}，全部经营情景远宽于此；未完成统一时点、同税率/SBC/股数口径的同行市场倍数实证，是交叉核验的限制。`},
    {title:"市场反推、敏感性与最强反方",body:`用盘前${usd(q.price)}、2.59十亿经济股数，股权规模约${n(q.price*2.59)}十亿美元；除2026收入指引8.532，市销约${n(q.price*2.59/8.532)}倍，扣非经营现金后EV/Sales约${n((q.price*2.59-base.cash)/8.532)}倍。这不是说销售额可分配给股东，而是量化当前要求。\n反向DCF固定基准利润率、税、WACC10.5%、g3.5%、ROIC30%、销售/资本${ba.salesToCapital}与现金/股数，令未来十年营收恒定增长，需约${pct(reverse.growth)}CAGR，2036收入约${n(reverse.revenue2036)}十亿美元。它是一组条件解，并非市场唯一预测；利润率更高、增长衰减更慢或资本回报更强都能替代部分要求。\n基准WACC×g敏感性（美元/股）：\n${[.085,.105,.125].map(w=>`WACC${pct(w)}：`+sensitivity.filter(x=>x.wacc===w).map(x=>`g${pct(x.g)}=${n(x.value)}`).join("；")).join("\n")}\n基准终值PV占业务EV${pct(base.terminalShare)}，乐观${pct(computed.bull.terminalShare)}，远期持续期主导结果。增量销售/资本3、6、10、无需额外净资本的乐观上限，今日值依次${capitalSensitivity.map(x=>usd(x.value)).join(" / ")}；终值ROIC30%/60%/100%为${roicSensitivity.map(x=>usd(x.value)).join(" / ")}。这些不是把研发再扣一遍，也不改变已经承担的经营费用。仅基本股数估值约${usd(sharesSensitivity[0].value)}，对25.9亿股约${usd(sharesSensitivity[1].value)}；未来新增稀释压力须另看，不能在同一SBC补偿机制下重扣。\n最强多方：AIP变成企业核心操作层，持续高于基准增长、利润与现金资本效率，乐观DCF${usd(computed.bull.today)}、2031${usd(computed.bull.price2031)}，倍数校验2031${usd(computed.bull.multiple2031)}，模型确有低估超级赢家的风险。最强空方：业务继续成长却未达到当前高预期，估值压缩让股东亏损；不需要财务危机就可出现。基准本来就很强，不把谨慎模型说成‘只要正常经营就一定兑现’。`},
    {title:"三档入场与40万美元：价格、回报、仓位一起过关",body:`本轮五年、USD、普通股、无杠杆。基础观察门槛15%年化（约五年翻倍），安全与折价分别提高到18%/20%；同时要求今日基准价值20%/35%/50%的折让，取两种限制的较低值，再向下取整到美元。完整公式保存在每档条件中，区间不是走势预测。\n三档${ranges.map(x=>`${x.low}–${x.high}`).join(" / ")}美元。在各档上沿若基准2031兑现，年化${ranges.map(x=>pct(scenarioReturn(base.price2031,x.high))).join(" / ")}；若悲观兑现，仍可亏损，尤其首档并非本金保护。当前${usd(q.price)}对应悲观/基准/乐观五年价格总变化${scenarios.map(x=>pct(x.year5Price/q.price-1)).join(" / ")}、年化${scenarios.map(x=>pct(scenarioReturn(x.year5Price,q.price))).join(" / ")}。更乐观的倍数卖价也不是保证能成交的目标。\n${position.rationale}\n${position.portfolioFit}\n到价只是复核信号，必须同时更新新财报、实际股数、合同与风险；如果因为经营恶化下跌，旧区间立即失效。不会因报告生成或刷新按钮而产生券商委托。`},
    {title:"风险、催化、组合机会成本",body:`最可能的失望路径是增长从异常高水平正常化、市场不再愿付同样倍数；竞争降价、复杂实施成本或客户预算收缩会放大它。政府便利终止与拨款不确定、数据安全事故、AI错误决策、隐私/执法争议、出口及跨境规则、人员激励和创始人控制都可能影响现金、品牌与客户接受度。政府与商业分部降低单一任务风险，却不能抵消美国约84%收入的区域集中。${S(Q3D)}\n利率上升会压低长久期价值，即使公司现金余额受益于利息；本模型不依赖某次降息预测。国家安全重要性也不能把股票变成避险资产。与QQQM、VOO及AI/半导体成长敞口共同下跌时，要从组合整体预算审视，不能逐卡买满。\n未来催化是客户扩张、实际生产部署、签约转化、持续GAAP利润与每股现金成果；一次大合同标题和下季beat本身不是长期thesis。更新官方下一次财报日期后再加入事件表，本版不捏造未公告的Q4时间。\n市场共识可能更看重平台极大长期市场，本报告没有声称掌握独家订单或持续超额信息优势。差异化判断仅是把SBC、税、资本和当前价格完整算进去；如乐观路径成为更可信的基准，应重建模型，不能为了守住旧低价拒绝新事实。维持现金或低成本宽基是明确机会成本选项，没有必要为了66张卡都给出当前买入。`}
  ],
  figures:[
    {title:"五年收入增长与规模",unit:"百万美元；FY完整年度",note:`${S("FY25")}${e.sources.some(s=>s.id==="FY23")?S("FY23"):""}。2026指引不放进实绩柱。`,rows:f.annual.map(a=>({label:`FY${a.year}`,value:a.revenueM}))},
    {title:"Q3收入地域与客户类型",unit:"百万美元；美国为演示材料四舍五入",note:`${S("Q3")}${S("Q3P")}。国际为集团精确收入减四舍五入美国收入，仅近似，不称精确分部报表。`,rows:[{label:"美国商业",value:984},{label:"美国政府",value:953},{label:"国际合计约",value:2313.411-1937}]},
    {title:"Q3利润与现金口径",unit:"百万美元；各项不可相加",note:`${S("Q3")}。调整利润、GAAP利润和现金不是同义；SBC不等于即时现金流出，仍有经济成本。`,rows:[{label:"GAAP营业利润",value:1084.845},{label:"调整营业利润",value:1426.840},{label:"SBC",value:318.889},{label:"CFO−现金CapEx",value:1196.556}]}
  ],
  invalidation:[
    "连续两季美国商业增速/客户扩张大幅低于重建基准，NDR降至130%以下且新客/ACV不能补足：下调成长持续期与价值，停止沿旧区间加仓。130%是研究预警线，不是公司指引或破产阈值。",
    "GAAP营业率持续跌破35%，且无法用可信投入/时点解释；SBC占收入重新持续高于20%或净股数增长显著快于每股经营成果：重新估值，不靠调整数字维持原判断。",
    "RPO/RDV/TCV与期限、回款出现持续背离，重大客户终止、预算缩减或信用恶化：逐合同核验；单季TCV同比低本身不足以判定失效。",
    "重大安全、隐私或AI可靠性事件，治理/关联交易/披露质量出现无法解决的可信度问题：暂停新增，先解决可理解性和长期客户信任。",
    "价格达到区间但未来成长、税率、资本强度或股数已恶化，或AI/科技共同风险突破总预算：原价格表失效，先重建模型。"
  ],
  reviewTriggers:[
    "下一次正式Q4/FY2026披露：核验收入8.530–8.534十亿美元及Q4 2.649–2.653十亿美元指引，区分实绩、更新指引与本模型2027以后假设；日期待官方公告。",
    "逐季跟踪NDR165%的持续性、新老客户收入、商业客户904与总客户1090、美国/国际及政府/商业增速，不把客户数直接当收入权重。",
    "连续两季对照TCV/ACV、合同期限、RDV、RPO4.9十亿美元的转化和预收回款；RPO44%未来12月、37%13–36月只是预计节奏。",
    "更新全部A/B/F实际股数、期权/RSU/SAR与净回购，核对SBC及雇主税、正常化税率和每股现金经济性，避免当前奖励与未来报酬重复或遗漏。",
    "追踪GAAP营业利润、CFO与应收/合同负债、净经营资本和证券风险；重新评估竞争、隐私/安全、政府采购及已有ETF穿透和组合科技集中度。"
  ],
  sources:e.sources.map((s,i)=>({label:`[S${i+1}] ${s.title||s.id}`,url:s.url,date:`${s.published||s.date}；${s.id==="QUOTE"?q.providerLabel:s.period||""}；核验日2026-11-05 NZDT`})),
  model:{...m,parentAudit:{status:"all-scenario-FCFF-cash-future-value-and-multiple-reconstructed",caps,ranges,sensitivity,capitalSensitivity,roicSensitivity,sharesSensitivity,reverse}},evidenceFacts:f,modelAudit:e.audit,
  portfolioSnapshot:portfolio
};
validateDecisionReport(r,watch);
await fs.writeFile(new URL("./pltr-analysis-input-2026-11-05.json",import.meta.url),JSON.stringify(r,null,2)+"\n");
console.log(JSON.stringify({symbol:r.symbol,quote:r.quote,values:scenarios.map(s=>({id:s.id,today:s.todayValue,year5:s.year5Price})),entries:decisionEntryPlan(r).map(({tier,low,high,dollars,shares})=>({tier,low,high,dollars,shares})),exposure,reverse,audit:r.model.parentAudit.status},null,2));
