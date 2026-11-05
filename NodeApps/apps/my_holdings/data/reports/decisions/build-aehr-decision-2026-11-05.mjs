import fs from "node:fs/promises";
import {validateDecisionReport,decisionEntryPlan,scenarioReturn} from "../../../src/decision-reports.js";

const e=JSON.parse(await fs.readFile(new URL("./aehr-evidence-model-2026-11-05.json",import.meta.url),"utf8"));
if(!/^passed/.test(e.audit.status))throw Error("AEHR evidence/model audit must pass before delivery.");
const notes=JSON.parse(await fs.readFile(new URL("./aehr-debate-notes-2026-11-05.json",import.meta.url),"utf8"));
const f=e.facts,sh=e.shared,b=sh.bridge,q=e.quote,ids=["bear","base","bull"];
const n=(v,d=2)=>Number(v).toLocaleString("en-US",{minimumFractionDigits:d,maximumFractionDigits:d});
const pct=v=>`${n(v*100,1)}%`,usd=v=>`$${n(v)}`;
const sources=[...e.sources,
  {id:"sonoma6",title:"同一客户第二代AI处理器：Sonoma约600万美元追加订单",date:"2026-10-07",period:"计划六个月交付、2027年量产爬坡",url:"https://www.aehr.com/2026/10/aehr-receives-follow-on-sonoma-production-orders-for-lead-hyperscale-customer-s-next-generation-ai-processor/"},
  {id:"sonoma41",title:"Sonoma四千一百万美元订单与累计bookings",date:"2026-04-16",period:"当期累计H2订单包含本次订单，不可重复相加",url:"https://www.aehr.com/2026/04/aehr-receives-record-41-million-production-order-from-lead-hyperscale-ai-customer-second-half-bookings-exceed-92-million/"}
];
const S=id=>{const i=sources.findIndex(s=>s.id===id);if(i<0)throw Error(`Missing AEHR source ${id}`);return `[S${i+1}]`;};
const near=(a,c,label)=>{if(!Number.isFinite(a)||!Number.isFinite(c)||Math.abs(a-c)>1e-7)throw Error(`AEHR reconstruction ${label}: ${a}/${c}`);};

// Parent independently reconstructs FCFF, retained cash, continuation value and
// the distinct operating-earnings multiple method from the raw assumptions.
function reconstruct(a,shares=b.sharesM){
  const rows=a.revenueM.map((revenue,i)=>{const prior=i===0?sh.openingRevenueRunRateM:a.revenueM[i-1],ebit=revenue*a.ebitMargins[i],nopat=ebit*(1-a.tax),investment=Math.max(0,revenue-prior)/a.salesToIncrementalCapital;return {year:2027+i,revenue,ebit,nopat,investment,fcff:nopat-investment};});
  const tv=rows.at(-1).nopat*(1+a.g)*(1-a.g/a.terminalRoic)/(a.wacc-a.g);
  const tvPV=tv/(1+a.wacc)**10;
  const ev=rows.reduce((sum,row,i)=>sum+row.fcff/(1+a.wacc)**(i+1),0)+tvPV;
  const cash=b.netNonOperatingAssetsM+rows.slice(0,5).reduce((sum,row)=>sum+row.fcff,0);
  const futureEV=rows.slice(5).reduce((sum,row,i)=>sum+row.fcff/(1+a.wacc)**(i+1),0)+tv/(1+a.wacc)**5;
  const today=(ev+b.netNonOperatingAssetsM)/shares,p2031=(futureEV+cash)/shares;
  const multiple2031=(rows[4].nopat*a.exitNopatMultiple+cash)/shares;
  return {rows,tv,tvPV,ev,cash,futureEV,today,p2031,multiple2031,crossToday:multiple2031/(1+a.wacc)**5,terminalShare:tvPV/ev};
}
const computed=Object.fromEntries(ids.map(id=>[id,reconstruct(e.scenarioAssumptions[id])]));
for(const id of ids){const c=computed[id],s=e.scenarios[id];c.rows.forEach((row,i)=>{near(row.fcff,s.rows[i].fcffM,`${id}/${row.year}/FCFF`);near(row.investment,s.rows[i].investmentM,`${id}/${row.year}/capital`);});
  for(const [k,v] of Object.entries({todayValue:c.today,value2031:c.p2031,enterpriseValueM:c.ev,continuationEv2031M:c.futureEV}))near(v,s[k],`${id}/${k}`);
  near(c.multiple2031,s.normalizedProfitMultiple.value2031,`${id}/profit multiple`);near(c.crossToday,s.normalizedProfitMultiple.todayValue,`${id}/multiple PV`);
  near(c.p2031/q.price-1,s.totalReturn,`${id}/refreshed quote return`);near(scenarioReturn(c.p2031,q.price),s.cagr,`${id}/refreshed quote CAGR`);
}
const base=computed.base,ba=e.scenarioAssumptions.base,reference=Math.min(base.today,base.crossToday);
const floorCent=v=>Math.floor((v+1e-10)*100)/100;
const hurdles=[.15,.18,.22],discounts=[.25,.40,.55];
const caps=hurdles.map((r,i)=>Math.min(base.p2031/(1+r)**5,reference*(1-discounts[i])));
const highs=caps.map(floorCent);
const ranges=[{low:floorCent(highs[1]+.01),high:highs[0]},{low:floorCent(highs[2]+.01),high:highs[1]},{low:Math.ceil(reference*.30*100)/100,high:highs[2]}];
function reverseGrowth(target=q.price,holdingReturn=false){let lo=0,hi=2;for(let i=0;i<100;i++){const growth=(lo+hi)/2,a={...ba,revenueM:Array.from({length:10},(_,j)=>150*(1+growth)**j)},c=reconstruct(a),value=holdingReturn?c.p2031:c.today;if(value<target)lo=growth;else hi=growth;}const growth=(lo+hi)/2,a={...ba,revenueM:Array.from({length:10},(_,j)=>150*(1+growth)**j)},c=reconstruct(a);return {growth,revenue2031:a.revenueM[4],revenue2036:a.revenueM[9],today:c.today,p2031:c.p2031};}
const reverse=reverseGrowth(),reverseForReturn=reverseGrowth(q.price*1.15**5,true);
const zeroCapital=reconstruct({...ba,salesToIncrementalCapital:Infinity}).today;
const normalTax15=reconstruct({...ba,tax:.15}).today;
const scenarios=ids.map((id,i)=>{const c=computed[id],a=e.scenarioAssumptions[id];return {id,label:["悲观：客户暂停扩产","基准：AI量产与逐步分散","乐观：多客户多代放量"][i],todayValue:c.today,year5Price:c.p2031,assumptions:`2027/2031/2036模型年度收入${n(a.revenueM[0],0)}/${n(a.revenueM[4],0)}/${n(a.revenueM[9],0)}百万美元；含经济SBC营业率${pct(a.ebitMargins[0])}→${pct(a.ebitMargins[4])}→${pct(a.ebitMargins[9])}；税25%，WACC${pct(a.wacc)}、终值g${pct(a.g)}、ROIC${pct(a.terminalRoic)}；增量销售/资本${a.salesToIncrementalCapital}，33.8百万经济股数。`};});
const portfolio=JSON.parse(await fs.readFile(new URL("./aehr-portfolio-context-2026-11-05.json",import.meta.url),"utf8"));
const exposure=portfolio.company.value,pending=portfolio.pendingKnownLimitBuyUsd;
const api="http://127.0.0.1:5889/my-holdings/api",state=await(await fetch(api+"/state")).json(),watch=state.watchlist.find(w=>w.symbol==="AEHR");
if(!watch)throw Error("AEHR missing from app");
const position={currentAdditionalPct:0,targetPct:1,maxPct:1.5,existingExposureUsd:exposure,pendingBuyUsd:pending,
  rationale:`当前新增0%。若财务/量产证据和价格条件同时通过，研究目标总敞口1%=$4,000，上限1.5%=$6,000；不把上限当必须买满的任务。现有公司穿透${usd(exposure)}、本地待成交限价买单${usd(pending)}，目标剩余${usd(Math.max(0,4000-exposure-pending))}按25%/35%/40%分配，初档约0.25%组合用于学习。以70%个股压力损失示例，1%/1.5%仓位影响组合约0.7%/1.05%；极端全损影响1%/1.5%，共同下跌另计，不能保证最大回撤。`,
  portfolioFit:"应用已记录直接持仓与QQQM、VOO、SMH、SOXX历史完整成分中，AEHR公司敞口为零，本地未成交限价买单为零；这是保存快照，不是券商实时资产。已有半导体ETF及宽基中的AI/半导体公司，共同资本开支与估值风险仍高，无直接重叠不等于低相关。外部账户、税务、流动性和可承受回撤未齐，最终适配尚未完成。所有66支的目标和上限不能同时买满。"};
const refs=[["q1fy27","fy26"],["sonoma6","fy26"],["q1fy27","sonoma6"],["q1fy27","fy26"],["sonoma6","fy26"],["q1fy27","fy26"],["q1fy27","fy26"]];
const annual=f.annual.map(a=>`${a.year}：收入${n(a.revenueM,3)}；毛利率${pct(a.grossMargin)}；EBIT${n(a.ebitM,3)}；净利${n(a.netIncomeM,3)}；CFO${n(a.cfoM,3)}；现金CapEx${n(a.capexM,3)}；FCF${n(a.reportedFcfM,3)}；SBC${n(a.sbcM,3)}；稀释加权股数${n(a.dilutedWeightedSharesM,3)}百万。`).join("\n");
const r={version:1,symbol:"AEHR",name:"Aehr Test Systems",exchange:"NASDAQ Capital Market · 普通股",currency:"USD",capitalUsd:400000,horizonYears:5,analysisDate:"2026-11-05",
  financialPeriod:"FY2022–26、FY27Q1与独立过渡月；未构造TTM",
  dataAsOf:"2026-11-05 NZDT（美东仍11月4日）；最新实绩9月25日止FY27Q1，11月2日SEC 8-K三表；最新完整附注为FY26 10-K，尚未找到新Q1完整10-Q。报价与期末日期分别列示。",
  quote:{price:q.price,date:q.timestamp.slice(0,10),asOf:q.timestamp,type:q.session==="pre-market"?"盘前报价快照":"盘中报价快照",source:"Moomoo实际浏览器页面",sourceUrl:q.source,note:`页面${q.providerLabel}为${usd(q.price)}，供应商时点${q.timestamp}、实际读取${q.observedAtUtc}；正式11月3日收盘${usd(q.formalClose)}。公开行情可能延迟，并非报告生成瞬间逐笔成交或保证可成交价格。应用原行情保留。${S("quote")}`},
  verdict:{stance:"AI转折有证据，现价暂不新增",summary:`AI量产订单真实，新Q1也已盈利，但现金仍被应收和存货占用。${usd(q.price)}报价透支较多成功；基准今日约${usd(base.today)}–${usd(base.crossToday)}，先等三档条件价与回款证明，当前新增0%。`,confidence:"业务转折中等；估值中低，客户项目、周期与终值不确定性较高",valueLow:Math.min(base.today,base.crossToday),valueHigh:Math.max(base.today,base.crossToday),
    conclusion:`AEHR已经从单纯等待SiC复苏走向有真实AI量产订单的多应用测试平台，新Q1收入33.007百万、GAAP营业利润6.047百万、净利7.181百万，不能否认经营转折。但Q1FCF−3.103百万、FY26现金增长主要靠97.395百万ATM，耗材也有周期；新大客户量产验证不等于已锁定多年收入。基准已给2031模型年度收入310百万、含经济SBC营业率24%，今日DCF${usd(base.today)}、正常化盈利倍数校验${usd(base.crossToday)}；基准2031期末DCF${usd(base.p2031)}，相对${usd(q.price)}年化${pct(scenarioReturn(base.p2031,q.price))}。乐观2031DCF${usd(computed.bull.p2031)}、倍数法${usd(computed.bull.multiple2031)}均为有条件路径。当前新增0%；三档${ranges.map(v=>`${n(v.low)}–${n(v.high)}`).join(" / ")}美元，条件目标1%=$4,000、上限1.5%=$6,000。不是预测股价一定会跌到这些价，也不是保证反弹。`,
    limitations:"最新Q1只有已取得的SEC 8-K未经审计三表与业务描述，完整新10-Q尚未找到；客户、奖励、存货与应收的当前详细附注不足，FY26集中度不能冒充Q1。财年更改多出四周过渡期，本版不伪造严格TTM；同比对照季节位置相差一个月。33.8百万为当前经济股数代理，非精确授予期权定价；未来正常化经济报酬与既有奖励分开约定，不能称精确GAAP预测。2027–2036为十个标准年度模型，首年锚定FY27指引，2031为第5期，未精确切分财年stub及11月到五年后日期。净再投资、税25%、运营储备15百万、成熟ROIC及倍数均为假设；不为DTA、未来未获订单或诉讼胜诉单独加价。倍数校验未完成同日同行实证，不冒充市场共识。预测不含投资者税费、汇率或股息，未给可验证概率权重；熊情景不是最坏结果，长期失败仍可能使普通股价值归零。组合与个人约束未完整。"},
  position,entries:ranges.map((v,i)=>({tier:["observation","safety","discount"][i],...v,budgetSharePct:[25,35,40][i],condition:`上沿=floor到美分(min(基准2031期末${n(base.p2031,5)}/(1+${pct(hurdles[i])})^5，保守今日参考${n(reference,5)}×${pct(1-discounts[i])}))=${n(v.high)}；分别要求${pct(hurdles[i])}研究年回报与至少${pct(discounts[i])}价值折让。${[
    "先核实新Q1完整脚注、订单验收与收款、AI量产真实进度，没有重大thesis恶化才讨论小仓。",
    "只有老项目继续执行且新增客户/应用验证、GAAP经济利润和现金转化同步改善，才讨论加仓；不能因价格更低自动投入。",
    `折价不消除客户、库存和技术风险。低于${n(v.low)}为重新尽调边界（约30%基准价值向上取分），不是盈利或资产底线；重大恶化时整张价格表失效。`
  ][i]}`})),scenarios,
  masters:notes.masters.map((v,i)=>({...v,evidence:`${v.evidence} ${refs[i].map(S).join("")}`})),debate:notes.debate,
  sections:[
    {title:"买的是什么：晶圆级与封装级可靠性筛选",body:`AEHR普通股代表测试设备、器件专用接触/载具、服务与工程收入。FOX系列在晶圆级或裸芯片/模块状态完成测试和burn-in；Sonoma等源于Incal的封装级高功率平台，对成品封装器件实施应力筛选。目标是提早发现失效，减少把有问题芯片放进高成本封装/系统的损失，不是晶圆制造厂，也不是销售AI算力或基础模型。${S("fy26")}\n高功率、多芯片封装对独立热区、供电和电测试带来新要求，10月7日原文说明Sonoma支持分区温控及多功能单元测试。这有技术和客户ROI逻辑；但‘可靠性更重要’并不自动等于公司可占全部测试市场。晶圆级与封装级可互补，也可能由客户选择部分替代，不能每条潜在市场全额相加。${S("sonoma6")}\nPorter五力：少数大客户掌握采购议价，工艺认证和迁移验证形成进入门槛；更大测试厂商、探针卡/接触方案与客户自制仍有替代。竞争比较技术、吞吐、总成本、自动化、服务与交货，不是仅凭专利认定垄断。外包制造能扩大产能，也留下供应、质量与爬坡风险。`},
    {title:"最新实绩与指引：转折真实，但不是全部现金盈利",body:`单位百万美元。FY27Q1（6月27日至9月25日）收入33.007，去年披露对照季10.969，约+200.9%；毛利15.663、47.5%，EBIT6.047、18.3%，净利7.181。净利含0.899利息及0.254所得税利益，不能把21.8%净利率原样当成熟经营利润率。非GAAP净利9.357排除SBC1.880和收购调整0.296，不把员工股份成本抹掉。${S("q1fy27")}\nQ1订单46.7、book-to-bill约1.4，季末backlog100.9，11月1日effective backlog109.3。这些支持转折与近期交付可见度，仍需履约和验收回款。FY27收入指引提高到150百万、非GAAP净利率至少20%；它既不是全年实绩，也不是GAAP营业率/自由现金流保证。\n已进入量产的项目与后续潜在客户要区分：当前Sonoma平台为一名客户第一代处理器量产，第二代通过资格并准备2027爬坡；另一潜在大客户FOX-XP拟在2027年初安装并在高量产环境验证，随后才决定更大规模生产。没有披露的客户身份不猜，也不把评估通过当成不可取消的多年大单。`},
    {title:"财年变化：过渡月必须单独列，不能伪造TTM",body:`旧财年为最接近5月31日的周五结束，FY26止于2026年5月29日；新财年改为最接近6月30日的周五，FY27止于2027年6月25日。5月30日–6月26日为独立四周过渡期；新Q1为6月27日–9月25日13周。公司比较的是去年8月29日止季度，季节位置相差约一个月，虽然公司认为有参考意义，不能宣称严格同日同期。${S("q1fy27")}\n过渡月收入0.638、毛利−1.012、EBIT−3.995、净利−2.743、CFO−3.812、CapEx0.004百万，不能把这个月隐藏掉，也不能擅自塞入FY26或FY27Q1。\nFY26完整52周+过渡4周+新Q1 13周−旧Q1 13周=56周，不是过去52周。若省掉过渡月，虽然相加52个报告周，期间却不连续。因此本版列完整年度、新Q1和过渡期，严格TTM标记未构造，不使用假TTM的P/E。下面模型是明示的标准年度假设，不能冒充公司财年精确预测。`},
    {title:"五年财务：旧SiC周期、税益与SBC",body:`完整FY2022–2026，单位百万美元；FCF统一为CFO−现金CapEx，未因SBC为非现金而把它从股东成本中删掉。\n${annual}\n收入在FY24约66.218后降至FY25 58.968、FY26 50.001，毛利率也由约49%降至35%；新Q1的强复苏不能抹掉设备和接触件周期。FY24净利33.156含约21.9百万递延税估值备抵释放，绝不能用该年表面P/E作常态便宜依据。FY26净亏7.126又有4.610税益，营业亏14.149更能显示当年经营。${S("fy24")}${S("fy26")}\nFY26 SBC6.761，占收入13.5%，相对FY24 2.518明显上升；基本期末股数FY25 29.877→FY26 32.480百万，约+8.7%。历史亏损年份加权稀释等于基本股数，常因反稀释规则排除奖励，不能拿来证明不存在潜在索偿。新Q1还需核对完整奖励与股数附注。`},
    {title:"现金桥：融资余额、备货、验收和税款结算",body:`FY26 CFO−3.310、CapEx2.066、FCF−5.376百万，但ATM净筹资97.395百万；期末现金116.358百万主要不是经营利润积累。股票融资为扩产提供缓冲，同时增加每股分母，不能把筹资到账当净利润。${S("fy26")}\n9月末现金及受限现金105.052百万，其中未限制现金104.902、受限0.150；对5月末含受限现金116.508，合计下降11.456。变化包含过渡月−4.050和Q1−7.406，不能把17周总下降全称‘本季度烧钱’。Q1CFO−3.054、CapEx0.049、FCF−3.103；应收变化消耗10.686、存货9.037百万是重要原因，同时也有应付/预收等抵消。需看实际验收与回款，资金占用本身不证明收入虚假。${S("q1fy27")}\nQ1约4.474百万RSU税款代扣相关股份回购/结算是融资现金项目，并非管理层认为股价低估而主动回购，不能额外加一个‘回购收益率’。期末应收26.630、库存53.120、预付款11.225百万，账面资金周转要求明显。\n财务桥只加未限制现金减15百万运营储备=${n(b.netNonOperatingAssetsM,3)}百万，未加DTA25.120、商誉10.719或无形资产9.157为额外现金。利息不进经营EBIT，避免资本化利息后再加现金；租金保留在成本，不再把经营租赁全额重复减债。储备15百万是研究假设，不代表用户或公司承诺。`},
    {title:"订单层级与客户：同一客户两代，不是两名客户",body:`FY26backlog80.6百万，年报定义为收到确认采购单、预计12个月内发货的产品订单，并提醒客户可改交期/取消以及开发/出货可能延期。新Q1季末100.9、11月1日effective109.3包含期后新增，不能把109.3再加100.9，或把时间不同的余额混成一个更大‘总订单’。${S("fy26")}${S("q1fy27")}\n4月16日41百万Sonoma追加订单，已包含在当时H2累计超过92百万bookings中，不相加两遍。10月7日约6百万追加单含系统、BIM、器件专用插座与软件，计划六个月交付，是同一lead客户第二代AI处理器，计划2027年放量；预计最终量超过上一代是客户/管理层展望，不是保底采购。${S("sonoma41")}${S("sonoma6")}\nFY26前五客户约70%收入，FY25 77%、FY24 93%，分散程度改善是真积极信号；FY26前三客户仍约26.3%、14.2%、10.9%。这是FY26，不冒充新Q1集中度；未披露的AI分项收入、具体客户名和项目毛利不能自填。评估客户潜力增加，不等于已经形成多客户收入分散。`},
    {title:"耗材与护城河：有复购，仍有周期",body:`WaferPak/DiePak按器件设计定制，可在FOX系统生命周期内多次购置。年报提到器件/设计生命周期通常2–7年，不把这句当成每件接触器保证使用2–7年或按固定年限更换；也不是每颗芯片消耗一个插座的抽成模式。新器件设计、替换、磨损和扩容驱动后续采购，实际周期及单价须看订单。${S("fy26")}\nFY26整晶圆相关收入约31.5百万，FY25 39.2、FY24 64.6；封装相关18.5、19.8、1.6百万，后者历史受Incal并购范围影响，不是纯有机增长表。FY26 contactor收入同比减少约19.9百万，仅部分由晶圆级系统约增加10.4百万抵消，说明耗材也会受客户库存和扩产影响。按时间确认服务收入约3.181百万，只占FY26总收入约6.4%；不是把其余收入全部证明为经常年费。\n技术、认证、软件与现场服务可提供转换成本，但竞争者和客户自制仍在；晶圆级吞吐提高、burn-in时间缩短、客户更换筛选流程，都会改变设备需求。简化机制为‘需筛选产量×测试时长÷并行能力和利用率’，产量增长不必一比一带来设备增长。Aehr可从更复杂器件受益，也需持续研发来守住位置。`},
    {title:"存货、专利与治理：可验证优势，不靠会计幻觉",body:`FY26审计关键事项为超额/陈旧库存估值，年末库存约41.354百万；公司披露长期交货/需求预测影响备货，若预测不兑现需减值。Q1库存升至53.120百万，既可能为量产准备，也可能在客户延期时变风险。关键审计事项不等于审计师宣布造假；本版也不把未经出售的库存全额当现金安全垫。${S("fy26")}${S("q1fy27")}\n公司FY26只报告一个经营分部，不虚构FOX与Sonoma的分部利润、ROIC。研发费用化、并购商誉和大量现金使简单账面ROIC不适合被机械外推；模型用明示经济资本回报与敏感性，而不是伪造一个精确历史ROIC。管理层资本配置要看股权成本、Incal整合与每股现金兑现，不能只看订单标题。\n年报披露中国Semight相关专利侵权诉讼：部分专利有效性判断有利，不等于侵权已胜诉；一审不利后上诉/继续程序，结果和经济影响仍不确定。本版没有审阅其后完整法院记录，不将潜在赔偿单独加价，也不把专利视为无法绕开的永久垄断。${S("fy26")}`},
    {title:"方法一：十年FCFF、当前资本与全部经济股份",body:`2027–2036十个标准模型年度，2027锚定FY27指引/情景，2031为第5期；它是年度近似，未声称精确对应11月4日后每笔现金日期。起始收入运行率采用新Q1×4=132.028百万，只作为增量资本参照，不把它当实绩TTM；当前已预先投入的净经营资本约72.816百万保留，不再从FY26低基数50.001全额扣一次相同应收/库存。\nFCFF=正常化经济EBIT×75%−新增净经营资本；增量资本=max(0,新增收入/销售资本比)。它把净CapEx（超过折旧部分）和营运资本合并，研发、销售/交付及未来报酬已在利润里，不重复扣成资本支出；收入下降不假设全部库存能原价收回。终值FCFF=2037NOPAT×(1−g/ROIC)，再除WACC−g。\n${ids.map(id=>{const a=e.scenarioAssumptions[id],c=computed[id];return `${id}：收入逐年${a.revenueM.join("/")}百万；经济营业率${a.ebitMargins.map(pct).join("/")}；销售/增量资本${a.salesToIncrementalCapital}、WACC${pct(a.wacc)}、g${pct(a.g)}、成熟ROIC${pct(a.terminalRoic)}。今日${usd(c.today)}，2031期末${usd(c.p2031)}。`;}).join("\n")}\n股数33.8百万为保守经济代理：9月末基本32.663百万、最新Q1加权稀释33.520百万与年末奖励清单共同参照，新Q1完整奖励附注未取得，不能声称精确完全稀释。未来新服务报酬保留经济成本，已授奖励由当前索偿反映，不再把同笔未来摊销额外扣一次，也不同时加回SBC并永久增股。正常化经济利润不同于逐笔GAAP预测，须通过真实每股表现检验。\n基准复算（收入/EBIT/净资本投入/FCFF，百万）：\n${base.rows.map(v=>`${v.year}：${n(v.revenue,3)} / ${n(v.ebit,3)} / ${n(v.investment,3)} / ${n(v.fcff,3)}`).join("\n")}\n2031价格=第6–10期剩余现金及终值在第5期的EV+${n(base.cash,3)}百万期末非经营现金，再除股数；前五期现金只加一次。假设全部留存且不赚利息，无额外分红或回购收益率。税归一化25%，没有在低税利益之外再加DTA资产；这可能低估税盾，但避免把一次性收益永续化。`},
    {title:"方法二：正常化经营盈利倍数，解释而非平均分歧",body:`独立定价机制使用2031税后经营利润×悲观12/基准20/乐观25倍，另加当期非经营现金，再除33.8百万股。倍数反映对周期、增长与竞争持续期的研究判断，不是已查得即时同行P/E或分析师共识；与DCF共享经营路径，但退出定价机制不同。\n${ids.map(id=>{const c=computed[id],a=e.scenarioAssumptions[id];return `${id}：2031NOPAT${n(c.rows[4].nopat,3)}×${a.exitNopatMultiple}+现金${n(c.cash,3)}，期末${usd(c.multiple2031)}；按本情景WACC${pct(a.wacc)}折五期，今日${usd(c.crossToday)}。`;}).join("\n")}\n基准倍数法期末${usd(base.multiple2031)}明显高于续存DCF${usd(base.p2031)}，因为20倍经营盈利给予更高的后续特许权价值。不能平均两个数来掩盖分歧。买价参考取基准今日两法较低端${usd(reference)}，回报也用较保守DCF期末，不把更高倍数当追价理由。\n这种交叉校验没有完成统一同日、同SBC/税率/期间口径的同行倍数实证，因此降低估值确信度。两法都可能低估长期平台，也可能高估当前量产机会；它们不是两份独立证明公司必然值某价的事实。`},
    {title:"反向估值与敏感性：现价要求怎样的成功",body:`以${usd(q.price)}和9月基本32.663百万股，通常基本股权规模约${n(q.price*32.663)}百万；按33.8百万经济代理为${n(q.price*33.8)}百万，两者口径不同。用基本市值减本研究非经营现金后，EV/150百万FY27收入指引约${n((q.price*32.663-b.netNonOperatingAssetsM)/150)}倍；不能拿含税益的旧净利或错误TTM算‘便宜P/E’。\n反向DCF固定首年收入150百万及基准利润、税、资本、WACC13%、g3%、ROIC20%，让此后九年恒定成长，现价要求约${pct(reverse.growth)}CAGR，2031约${n(reverse.revenue2031)}、2036约${n(reverse.revenue2036)}百万收入。若要求现价买入后五期15%年化，需2031价格${usd(q.price*1.15**5)}，对应固定其他假设的增长约${pct(reverseForReturn.growth)}、2036收入${n(reverseForReturn.revenue2036)}百万。这是一组条件解，不是市场唯一预测，不能靠把首年收入也放大到远超指引来凑现价。\nWACC×g敏感性（基准美元/股）：\n${e.sensitivities.waccByG.filter(v=>[.11,.13,.15].includes(v.wacc)).map(row=>`WACC${pct(row.wacc)}：`+row.values.filter(v=>[.02,.03,.04].includes(v.g)).map(v=>`g${pct(v.g)}=${n(v.todayValue)}`).join("；")).join("\n")}\n终值PV占业务EV：悲观${pct(computed.bear.terminalShare)}、基准${pct(base.terminalShare)}、乐观${pct(computed.bull.terminalShare)}。增量销售/资本1.5/3/6时今日约${[1.5,3,6].map(x=>usd(reconstruct({...ba,salesToIncrementalCapital:x}).today)).join(" / ")}，完全不需要额外净资本的乐观上限约${usd(zeroCapital)}；正常现金税若长期仅15%，约${usd(normalTax15)}。只用基本32.663百万股约${usd(reconstruct(ba,32.663).today)}，33.8百万约${usd(base.today)}，小分母差异不能解释整个报价差距。\n最强多方是大客户验证转成多地点量产、更多客户多代芯片、器件价值/复杂度提高让平台规模远超旧SiC周期；乐观已给2036收入1,050百万、30%经济营业率。最强反方是项目延期/暂停、吞吐改进、客户议价、库存减值与估值压缩共同发生，业务不必倒闭就能让高价买家长期失望。`},
    {title:"三档入场、收益与40万美元条件预算",body:`本轮五年、USD普通股、无杠杆。小仓观察用15%研究回报与至少25%今日价值折让；安全边际用18%与40%；折价用22%与55%，均取更低上限并向下到美分。小设备公司客户/周期不确定性较高，较深折让与较小仓位共同补偿，不是用户必须达到或能够保证的回报。\n三档${ranges.map(v=>`${n(v.low)}–${n(v.high)}`).join(" / ")}美元；低于${n(ranges[2].low)}先重新尽调，不是无限补仓。若基准2031兑现，在各档上沿年化${ranges.map(v=>pct(scenarioReturn(base.p2031,v.high))).join(" / ")}；在${usd(q.price)}快照下，悲观/基准/乐观五年总价变${scenarios.map(s=>pct(s.year5Price/q.price-1)).join(" / ")}、年化${scenarios.map(s=>pct(scenarioReturn(s.year5Price,q.price))).join(" / ")}。倍数卖价是另一情景，不保证市场愿意支付。\n${position.rationale}\n${position.portfolioFit}\n旧卡片观察价${watch.targetPrice==null?"未填写":usd(watch.targetPrice)}及保存报价${watch.price==null?"未填写":usd(watch.price)}是用户手工/行情记录，保留原样，不为其背书。报告不下单。到价仍须更新财报、股数、订单与回款；若是thesis恶化导致下跌，旧区间失效。`},
    {title:"风险与催化：把评估变成利润，再把利润变成现金",body:`主要风险为少数客户和芯片项目集中、SiC/AI资本开支波动、客户验收与交期、测试工艺和吞吐变化、替代/自制竞争、库存预测失误、亚洲制造/客户链及出口限制、人才激励与稀释、专利争议和高估值。宏观增长、利率和客户AI投资回报会通过采购与估值共同传导；公司有现金缓冲，不能说股价因此有底。${S("fy26")}\n催化是已安装系统稳定交付、第二代器件真实扩量、FOX-XP新客户完成生产验证并取得可交付订单、耗材/服务复购和回款改善。宣布评估或‘潜力很大’与这些兑现节点不同。下一完整Q1 10-Q将补客户、奖励、存货/应收、现金与治理细节，未取得前不编脚注；下一财报具体日期待正式公告。\n没有独家订单信息或可证明持续分析优势。研究分歧是对当前价格预留的错误余地，而非否认技术价值。维持现金、宽基或证据更成熟的设备企业都是机会成本选项，不为66张卡强行各给一个现价买入。若后续事实使乐观路径更可信，应重建基准，不能为了守旧低价而拒绝新证据。`}
  ],
  figures:[
    {title:"五年收入：旧周期回落与新转折的起点",unit:"百万美元；完整FY",note:`${S("fy24")}${S("fy26")}。新Q1和FY27指引不混进完整年度柱。`,rows:f.annual.map(a=>({label:`FY${a.year}`,value:a.revenueM}))},
    {title:"Q1盈利与营运资金消耗",unit:"百万美元；正柱为金额绝对值，不是同类可相加指标",note:`${S("q1fy27")}。应收/存货为CFO资金消耗，不能与净利相加；本季CFO−3.054、FCF−3.103详见正文。`,rows:[{label:"GAAP净利润",value:7.181},{label:"应收资金消耗",value:10.686},{label:"存货资金消耗",value:9.037},{label:"SBC",value:1.88}]},
    {title:"订单余额：季末与期后口径",unit:"百万美元；余额不可相加",note:`${S("fy26")}${S("q1fy27")}。effective backlog含期后新增；采购单仍有交期/取消风险。`,rows:[{label:"FY26季末backlog",value:80.6},{label:"FY27Q1季末",value:100.9},{label:"11月1日effective",value:109.3}]}
  ],
  invalidation:[
    "主要AI客户取消、显著推迟扩产，或新FOX-XP验证未转量产且现有项目不能支撑基准收入：暂停新增，重建客户/周期路径，不能沿旧价格机械摊低。",
    "连续两季订单/验收和现金转化走弱，库存持续增长快于可交付订单，重大减值或应收回款出现可信恶化：先核实经济性；单季负CFO本身不等于失效。",
    "经济营业率持续低于15%且没有明确短期原因，SBC/净股数增长明显快于每股经营成果，或需要大量新股维持扩张：重估利润、资本和全部索偿。",
    "客户改用更短测试流程、竞争/自制持续压价、关键专利/产品可靠性或出口渠道出现重大不利变化：下调护城河和复购，不把市场需求全部算给AEHR。",
    "完整10-Q出现无法解决的财务、治理或客户集中新问题，或总体半导体/AI风险超出组合预算：停止按旧表执行，即使更便宜也先完成尽调。"
  ],
  reviewTriggers:[
    "取得FY27Q1完整10-Q及财年转换说明：核对13周新Q1、4周过渡月、股数/奖励/税/客户/存货与现金附注，不伪造52周TTM。",
    "下一两季对照FY27收入150百万指引、非GAAP净利率至少20%与实际GAAP/SBC/现金；季度订单、backlog与effective backlog分时点跟踪。",
    "核验Sonoma现有及第二代器件按计划扩量、6百万追加订单交付/验收/回款，FOX-XP新潜在客户安装、验证与后续量产决策；身份未披露不猜。",
    "检查应收26.630、库存53.120百万的周转与减值、客户预付/应付抵消及资金可用；分清真实回款、股票融资和RSU代扣结算。",
    "更新WaferPak/BIM/插座复购、服务与系统收入、客户集中及竞争/测试时长变化；专利诉讼如有正式后续披露再更新，不假定胜诉收益。"
  ],
  sources:sources.map((s,i)=>({label:`[S${i+1}] ${s.title}`,url:s.url,date:`${s.date}；${s.id==="quote"?q.providerLabel:s.period}；核验日2026-11-05 NZDT`})),
  evidenceFacts:f,model:{shared:sh,scenarioAssumptions:e.scenarioAssumptions,scenarios:e.scenarios,sensitivities:e.sensitivities,reverse:e.reverse,parentAudit:{status:"FCFF-current-capital-cash-continuation-and-multiple-independently-reconstructed",caps,ranges,reverse,reverseForReturn,zeroCapital,normalTax15}},modelAudit:e.audit,portfolioSnapshot:portfolio
};
validateDecisionReport(r,watch);
await fs.writeFile(new URL("./aehr-analysis-input-2026-11-05.json",import.meta.url),JSON.stringify(r,null,2)+"\n");
console.log(JSON.stringify({symbol:r.symbol,quote:r.quote,scenarios:scenarios.map(s=>({id:s.id,today:s.todayValue,year5:s.year5Price})),entries:decisionEntryPlan(r).map(({tier,low,high,dollars,shares})=>({tier,low,high,dollars,shares})),reverse,reverseForReturn,audit:r.model.parentAudit.status},null,2));
