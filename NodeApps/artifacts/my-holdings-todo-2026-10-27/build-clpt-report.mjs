import fs from "node:fs";
import path from "node:path";
import { validateResearch } from "../../apps/my_holdings/server/ai.js";

const basename = "apps/my_holdings/data/reports/research/my-holdings-research-clpt-2026-10-27";
if (fs.existsSync(basename + ".html") && !process.argv.includes("--revise")) throw new Error("报告已存在，请明确修订");
const css = fs.readFileSync("C:/Users/Administrator/.codex/skills/investment-analysis/assets/report.css", "utf8");
const sources = [
  { label: "S1 · SEC 10-Q，2026-08-03提交，2026-06-30财务与7/27股数", url: "https://www.sec.gov/Archives/edgar/data/1285550/000119312526330842/clpt-20260630.htm" },
  { label: "S2 · FY2025 Form 10-K，2026-03-17，财务、收购、借款与风险", url: "https://ir.clearpointneuro.com/sec-filings/all-sec-filings/content/0001193125-26-111231/clpt-20251231.htm" },
  { label: "S3 · 公司Q2 2026业绩公告，2026-08-03，业务及修订指引", url: "https://ir.clearpointneuro.com/news-events/press-releases/detail/1156/clearpoint-neuro-reports-second-quarter-2026-results" },
  { label: "S4 · 公司投资者演示，2026-08-03，历史收入与产品战略", url: "https://ir.clearpointneuro.com/sec-filings/all-sec-filings/content/0001193125-26-330541/clpt-ex99_2.htm" },
  { label: "S5 · 公司Q3披露日期公告，2026-10-14", url: "https://ir.clearpointneuro.com/news-events/press-releases/detail/1157/clearpoint-neuro-to-announce-third-quarter-2026-results" },
  { label: "S6 · uniQure原始AMT-130数据公告，2026-09-29，合作方主张", url: "https://uniqure.gcs-web.com/news-releases/news-release-details/uniqure-announces-additional-data-ongoing-phase-iii-studies" },
  { label: "S7 · FDA KEBILIDI监管审评依据，2024-11-13，第8页兼容递送器械", url: "https://www.fda.gov/media/184353/download?attachment=" },
  { label: "S8 · StockAnalysis / Tiingo历史日线，2026-10-23，检索10/26 UTC", url: "https://stockanalysis.com/stocks/clpt/history/" },
  { label: "S9 · ChartExchange历史日线交叉核验，2026-10-23", url: "https://chartexchange.com/symbol/nasdaq-clpt/historical/" },
  { label: "S10 · 公司FY2025业绩公告，2026-03-17，原2026收入指引", url: "https://ir.clearpointneuro.com/news-events/press-releases/detail/1147/clearpoint-neuro-reports-fourth-quarter-and-full-year-2025" },
  { label: "S11 · 公司SEC申报目录，检索2026-10-26 UTC，确认Q3尚未披露", url: "https://ir.clearpointneuro.com/sec-filings/all-sec-filings" },
];
const facts = {
  price: 9.14, priceDate: "2026-10-23", shares: 30.504227,
  revenueHistory: [[2018,7.4],[2019,11.2],[2020,12.8],[2021,16.3],[2022,20.6],[2023,24.0],[2024,31.390],[2025,36.971]],
  financial: [
    {period:"FY2024",revenue:31.390,grossProfit:19.122,ebit:-19.734,net:-18.914,cfo:-8.950,capex:.275,sbc:6.907,cash:20.104},
    {period:"FY2025",revenue:36.971,grossProfit:22.692,ebit:-24.164,net:-25.540,cfo:-23.925,capex:.522,sbc:8.180,cash:45.923},
    {period:"H1 2026",revenue:23.008,grossProfit:14.466,ebit:-18.722,net:-20.889,cfo:-14.982,capex:.859,sbc:4.489,cash:29.363},
  ],
  q2:{revenue:10.880,biologics:4.031,navigation:5.552,capital:1.297,ebit:-10.244,net:-11.337},
  debtBook:50.232,cash:29.363,priorH1Revenue:17.700,
};
facts.ttmRevenue=36.971+facts.financial[2].revenue-facts.priorH1Revenue;
facts.marketCap=facts.price*facts.shares;
facts.netDebt=facts.debtBook-facts.cash;
facts.evBookApprox=facts.marketCap+facts.netDebt;
const assumptions=[
 {name:"熊",revenue:[55,60,66,72,80,88,96,104,112,120],margin:[-.40,-.32,-.24,-.15,-.05,0,.04,.08,.10,.12],sc:1,r:.18,g:.02,roic:.10,debt:40,shares:42},
 {name:"基准",revenue:[65,85,110,140,175,210,245,280,315,350],margin:[-.20,-.10,0,.08,.15,.20,.22,.24,.25,.25],sc:1.5,r:.14,g:.03,roic:.15,debt:31,shares:35},
 {name:"牛",revenue:[75,110,155,210,280,350,420,490,560,630],margin:[-.08,0,.10,.18,.24,.28,.30,.30,.30,.30],sc:2,r:.12,g:.035,roic:.20,debt:25,shares:33},
];
function calculate(s,r=s.r,g=s.g) {
  let prior=50,cumulative=0,minimum=0;
  const rows=s.revenue.map((revenue,i)=>{
    const ebit=revenue*s.margin[i],tax=ebit>0?ebit*.25:0,nopat=ebit-tax,reinvestment=(revenue-prior)/s.sc,fcff=nopat-reinvestment;
    prior=revenue;cumulative+=fcff;minimum=Math.min(minimum,cumulative);
    return {year:2027+i,revenue,margin:s.margin[i],ebit,tax,nopat,reinvestment,fcff,pv:fcff/(1+r)**(i+1)};
  });
  const terminalFCFF=rows.at(-1).nopat*(1+g)*(1-g/s.roic);
  const terminal=terminalFCFF/(r-g),terminalPV=terminal/(1+r)**10;
  const ev=rows.reduce((sum,row)=>sum+row.pv,0)+terminalPV;
  const equity=ev-s.debt;
  return {rows,terminalFCFF,terminal,terminalPV,ev,equity,value:Math.max(0,equity/s.shares),terminalPct:ev>0?terminalPV/ev:null,fundingGap:Math.max(0,-minimum-(facts.cash-10))};
}
const models=assumptions.map(s=>({...s,...calculate(s)}));
const base=models[1];
const multiple={revenue2031:175,multiples:[3,4,5],debt2031:50,shares2031:40,requiredReturn:.14};
multiple.outcomes=multiple.multiples.map(m=>{const endPrice=(multiple.revenue2031*m-multiple.debt2031)/multiple.shares2031;return {multiple:m,endPrice,present:endPrice/1.14**5,cagr:(endPrice/facts.price)**.2-1};});
const reversePrice=facts.price*1.12**5;
const reverseRevenue=(reversePrice*40+50)/4;
const f=(v,d=1)=>Number(v).toFixed(d);
const dollar=v=>"$"+f(v,2);

const sections=[
 {id:"decision",title:"结论与决策摘要",paragraphs:[
  "研究状态：观察。ClearPoint Neuro, Inc.普通股，NASDAQ Capital Market: CLPT，币种USD。其脑部精准递送器械、导航及临床支持具有真实应用基础，但公司仍亏损、依赖外部融资，部分未来增量取决于合作方药物的临床与监管结果。当前没有足以确认安全边际的证据。",
  "报告生成日为2026-10-27（Pacific/Auckland）；实际资料检索发生于2026-10-26 UTC，最新财务期2026-06-30。执行时为美东10月26日盘前，采用10月23日正式收盘9.14美元。ChartExchange页头最后盘中成交9.13与日线Close 9.14不同，本报告采用两源一致的日线Close，未采用盘前/盘后价。[S8][S9]",
  "近期核验点是10月28日盘后Q3财报与16:30 EDT电话会，即新西兰10月29日09:30 NZDT。Q3尚未披露，不提前当作已实现结果，也不把财报日期当作上涨理由。[S5][S11]",
 ]},
 {id:"business",title:"我买的是什么：器械、耗材与服务",paragraphs:[
  "医院和神经外科团队使用ClearPoint导航系统、SmartFlow递送耗材、Prism激光治疗及IRRAflow神经重症产品；生物制药企业购买递送器械、研发咨询与临床前/临床支持。经济引擎是设备安装后重复耗材和服务收入，而非直接取得合作方药物全部销售额。临床支持人员和科研设施也带来固定成本，收入增长必须超过服务扩张所需成本。",
  "Q2收入10.880M美元：生物制剂与药物递送4.031M（同比下降15%）、神经外科导航与治疗5.552M（增长62%）、设备与软件1.297M（增长24%）。IRRAS于2025年11月并入，部分增长来自收购并表；不能将总增速全部视为内生增长。H1收入23.008M、同比约30%，但Q2收入低于Q1，项目订单与临床进度造成波动。[S1][S3]",
  "竞争来自Medtronic、Brainlab等导航生态、其他递送工具和医院既有流程；药企也有议价与改换路径的能力。专业训练、精度、临床流程整合和监管经验可能带来转换成本，但尚未证明长期定价权或高资本回报。设备采购、手术量、报销和研发预算共同决定需求，不能把合作伙伴数量直接乘以假设药品销售额。[S2]",
  "FDA审评文件确认KEBILIDI与SmartFlow Neuro Cannula的兼容递送使用，属于已实现的监管与应用证据；这不代表所有合作方药物均获批，也不保证大规模商业手术量。研发中的机器人、聚焦超声与Harmony软件应按开发项目评估，不能提前视为成熟收入。[S7][S3]",
 ]},
 {id:"quality",title:"财务质量：毛利有基础，现金仍在流出",paragraphs:[
  "公司演示列出2018–2025收入从7.4M增至37.0M美元；该长序列使用公司四舍五入口径，最近两年财务表使用10-K精确口径。FY2025收入36.971M、毛利22.692M、营业亏损24.164M、净亏25.540M；FY2024对应31.390M、19.122M、19.734M营业亏损和18.914M净亏。高毛利尚未覆盖研发、销售及支持组织成本。[S4][S2]",
  "H1 2026营业亏损18.722M、净亏20.889M，经营现金流-14.982M、设备资本开支0.859M，因此CFO−CapEx=-15.841M美元。这是半年值，不能误称单季或全年；它包含财务利息及营运资本影响，也不自动等于用于企业估值的FCFF。Q2毛利率约62%，并不等于营业利润率。[S1]",
  "SBC为FY2024 6.907M、FY2025 8.180M、H1 2026 4.489M美元，约占各期收入22.0%、22.1%、19.5%。非现金费用也会转为股东稀释。2025年末普通股29.369M，7月27日已发行30.504M；当前完全稀释股数仍需Q3及新授予情况核验。亏损期披露的稀释EPS分母不能替代潜在稀释估值。[S2][S1]",
  "账面盈利与现金的差异还涉及存货、应收、预付款及递延收入。需要跟踪订单是否转成可收款收入、设备配置是否提升重复耗材、CAL服务是否覆盖新增成本。持续亏损使历史ROIC、ROE和利息覆盖缺乏成熟企业式解释力，本报告不生成虚假精确的质量评分。",
 ]},
 {id:"financing",title:"生存、借款与资本配置",paragraphs:[
  "6月底现金29.363M美元，长期票据账面净额50.232M，历史账面净债务约20.869M。现金从2025年末45.923M下降；2025年现金增加主要靠融资，不能当作经营造血。管理层称当时现金可支持自财报发行起至少12个月，这是按当时预测作出的判断，不是无限融资保障。[S1][S2]",
  "票据融资总框架上限105M不等于全部可随时到账：已完成两笔融资净收约48.1M，其余取决于合同条件。票息为SOFR与4.30%较高者加3.95%，下限8.25%、上限9.50%；早期部分利息以PIK计入本金。借款还涉及2027年起的收入参与及提前赎回回报条款，真实债权价值不能直接等同票据账面额。合同没有财务契约，但有其他行为限制，并以几乎全部资产含知识产权担保；不能虚构最低营收财务契约。[S1]",
  "公司设有50M美元ATM授权，截至6月30日未销售；授权不是已募集现金，也不保证可在理想股价融资。董事会和管理层应以IRRAS整合、CAL投入、单位手术贡献及每股现金效率来接受检验。SBC、融资与开发项目并行时，收入增长可以与每股价值下降同时发生。[S1][S2]",
  "简单压力参照：若H1每月约2.50M经营现金消耗保持不变，6月底现金约相当于11.8个月经营消耗；未含新增资本开支、赎回、未来借款或业务改善，因此不作为破产日期预测。CAL建设、研发和支持扩张可能改变消耗速度，10月底余额不能用这个静态推算冒充真实披露。",
 ]},
 {id:"events",title:"合作方事件：不把统计风险写成监管结论",paragraphs:[
  "uniQure于9月29日披露AMT-130更新：48个月12名高剂量患者的cUHDRS相对外部对照减缓44%，p=0.144，未达统计显著；TFC结果及更新36个月数据另有积极信号。外部对照缺失数据、存活者偏差和事后分析限制需要连同主结果阅读，数据是合作方披露，不能单凭标题判定治疗有效或无效。[S6]",
  "这些结果增加对长期证据与商业递送时间的判断难度，但本次核实没有证据可将其写成FDA已拒绝产品。经济传导是合作方试验/监管进度影响递送器械需求与服务收入；具体商业采购量、CLPT分成及单次收入未得到完整公开验证，故不把假设药物峰值销售直接计入CLPT估值。",
 ]},
 {id:"valuation",title:"估值：可复算的条件试算，可信度低",paragraphs:[
  `以7月27日已发行30.504227M股乘收盘9.14美元，基础市值约${f(facts.marketCap,1)}M；加6月底账面净债务20.869M得到粗略EV ${f(facts.evBookApprox,1)}M美元。TTM收入=36.971+23.008−17.700=${f(facts.ttmRevenue,3)}M，约${f(facts.evBookApprox/facts.ttmRevenue,1)}倍EV/TTM收入、${f(facts.evBookApprox/50,1)}倍FY26收入指引中点。日期错配、稀释、赎回回报和后续现金消耗限制该近似的精度。[S1][S2][S8]`,
  "方法一为十年显式FCFF模型：2027–2036收入与EBIT率逐年列示，2026建模基数50M。NOPAT=EBIT−现金税，盈利时税率25%、亏损不计即时税益；净再投资=收入增量÷销售/增量资本，包含净资本开支与营运资金；FCFF=NOPAT−净再投资。稳定期再投资率=g/ROIC。租金计入营业成本，不再重复扣除全部租赁债务。",
  "期初净债务桥接与估值股数均为假设：熊40M/42M股、基准31M/35M股、牛25M/33M股，用于反映H2现金消耗、债权调整和潜在稀释，未宣称是已核实的当前金额。未来持续股权薪酬成本纳入正常化EBIT率；模型股数为既有潜在授予/融资缓冲近似，不再机械叠加同一SBC的年稀释。实际再融资价格、稀释及债权退出成本仍可能更差。",
  ...models.map(m=>`${m.name}情景：2027–36收入（M美元）${m.revenue.join('/')}；EBIT率${m.margin.map(v=>f(v*100,0)+'%').join('/')}；销售/资本${m.sc}、WACC ${f(m.r*100,0)}%、g ${f(m.g*100,1)}%、稳定ROIC ${f(m.roic*100,0)}%。条件每股现值${dollar(m.value)}；${m.equity<=0?'该继续扩张路径的经营净现值不足以覆盖债权，普通股模型归零，不代表公司今天已破产。':`终值现值占EV约${f(m.terminalPct*100,0)}%。`}`),
  `基准情景在2032年前持续需要净再投资；若先为H2 2026预留10M现金，模型累计负FCFF超过剩余现金约${f(base.fundingGap,1)}M美元。这只是粗略项目资金压力，尚未包含融资利息、债权偿付等完整资金需求，更不能将额度全算可用现金。未来资金尚未落实时，每股值仅能作反例压力试算，不能用低单点宣称股票必然只值该价。`,
  "方法二为2031正常化收入倍数：假设收入175M美元、EV/Sales 3–5倍、当年净债务50M和40M股，期末条件价格11.88–20.63美元；按14%折现五年为6.17–10.71美元。以9.14买入的五年税费前潜在年化约5.4%–17.7%，中间情景约12.2%。倍数和资本结构均是研究假设，没有把它们冒充已核验同业估值；它对融资成本和估值维持较敏感。",
  `固定2031股数40M、净债务50M、收入倍数4倍，如果现价买入要求五年12%回报，则所需2031股价${dollar(reversePrice)}、收入约${f(reverseRevenue,1)}M美元，相当于从FY26中点50M增长至约3.5倍。它是固定参数反推，不代表市场唯一共识或保证能达到。`,
  "两种方法给出的区间差异大：收入倍数法可能低估达到该规模之前的现金投入，而DCF的远期利润率、终值及融资假设也十分脆弱。独立可比估值与完整债权/稀释交叉核验未完成；不认证可交易的内在价值区间。估值以2026年末为近似锚，未精确处理报告日至年末的短期折现与现金时点。",
 ]},
 {id:"perspectives",title:"六位投资者视角与最强反方",paragraphs:[
  "Buffett：耗材、临床工作流与获批组合器械有转换成本的证据，但亏损和现金消耗尚不支持耐久高回报结论；用重复使用和单位资本效率检验护城河。Munger：反向路径是合作方延期、支持团队成本先发生、融资稀释再跟上；多个必要成功条件应同时压力测试。",
  "Peter Lynch：属于商业化早期成长叠加项目波动，不是成熟盈利型医械；总增速须剔除并表，关注每股现金流。Howard Marks：大跌不能自动产生安全边际，市场仍可能低估资金需求与事件尾部；既要看估值也要看生存资本。",
  "Soros：高股价促进融资、扩产与生态建设，低股价反而可能迫使更高稀释；融资能力与增长叙事存在反馈。Dalio：利率影响票息和远期价值，生物科技融资周期、医保预算及监管节奏共同影响客户需求。以上为研究框架应用，不代表这些投资者持仓或本人观点。",
  "最强反方：CLPT可能成为专业但规模受限的供应商，成功药物数量和每次手术收入小于市场想象，药企与医院保留议价能力；CAL和临床支持固定成本增长早于稳定订单，收购和研发持续消耗融资。即使技术有用，普通股仍可能因资金、稀释和估值压缩而损失。最强乐观反驳是多款疗法相继商业化、耗材标准化和较高毛利形成运营杠杆，但目前缺少足够规模的现金实证。",
  "市场分歧：真实监管应用基础支持长期可选性，但未发现可核实的单位经济优势足以建立独立分析优势。本报告不为未知药物成功概率机械赋值，不把管理层市场容量目标当作收入承诺。[S4][S7]",
 ]},
 {id:"action",title:"风险、执行条件与未来两季复查",paragraphs:[
  "观察区：当前9.14美元保持研究观察；首次介入、进一步加仓价格及目标仓位均待核验，当前不启用机械分批投入。基准压力DCF打30%折扣虽约1.74美元，但资金与债权资料不足，因此它不构成买入指令；便宜筛选不能替代生存性审查。",
  "未来两季优先核验五项：①Q3/Q4现金、每月经营消耗、CAL资本开支与已落实融资；②BDD增长是否恢复、手术/重复耗材与一次订单分开；③IRRAS增长的内生部分、整合费用与毛利；④普通股、未归属授予、ATM实际出售与票据PIK；⑤合作方监管/试验进展是否转成真实采购与回款。",
  "研究警戒线（主观规则，不是公司契约）：连续两季BDD同比下降且无可核实订单修复；年度化经营现金消耗超过可动用现金且没有明确资金来源；毛利率连续两季低于55%；新股稀释超过当期模型且每股收入未改善；关键伙伴项目终止或递送路径更换。触发后暂停旧价格表，重新估计资金与价值。",
  "主要风险按影响排序：临床/监管延期和商业量不达预期（概率难量化、影响高）；现金消耗与再融资稀释（概率中高、影响高）；医院采用/医保报销和客户采购波动（概率中、影响高）；竞争、产品责任、质量召回及供应链中断（概率难量化、尾部影响极高）；小盘流动性和估值下修（波动概率高）。阈值和风险等级是本报告判断。",
  "组合适配未完成：本次虽可读取已有持仓记录，仍缺个人流动性、投资期限、可承受回撤及完整资产约束；不据此给个性化仓位。与高波动成长股及生物科技研发融资因子可能相关，机会成本应与宽基指数及有正现金流的替代标的一并比较。",
 ]},
 {id:"limits",title:"资料限制与结论边界",paragraphs:[
  "最新完整财报为Q2，6月底现金和7月股数不等于10月底余额；Q3于10月28日盘后发布。未核验所有药企项目的专属合同、单次递送收入、当前完全稀释股数及票据赎回经济价值，未完成同业可比与最新代理声明的全量治理审计。历史收入有八年序列，但详细现金流表只列最近两年及最新半年度，不能冒称完成十年逐项审计。",
  "两种估值都是税费前USD假设试算，不含本位币汇率、交易成本和个人税务；结果高度依赖商业化节奏、再投资效率和融资条件。研究完成表示已有可复核的报告和限制说明，不表示企业价值已被精确确定。报告行情仅为历史快照；JSON不提交quote字段，应用报价由独立价格待办维护。",
 ]},
];

const details=sections.map(s=>"## "+s.title+"\n"+s.paragraphs.join("\n\n")).join("\n\n");
const summary="研究状态：观察。CLPT已核实为ClearPoint Neuro（NASDAQ Capital Market）普通股，10/23正式收盘9.14美元。脑部递送器械已有真实监管应用，但H1 2026 CFO−CapEx为-15.84M美元，6月底现金29.36M低于票据账面50.23M；临床伙伴与融资风险仍显著。Q3将在10/28美东盘后公布，当前不认证精确入场价。";
const research={identity:{name:"ClearPoint Neuro, Inc. Common Stock",symbol:"CLPT",exchange:"NASDAQ Capital Market",currency:"USD",sector:"神经外科导航、脑部药物递送及神经重症器械"},title:"ClearPoint Neuro（CLPT）｜递送平台价值与现金约束",summary,details,risks:["持续亏损和现金消耗，未来股权/票据融资条件及稀释未落实。","合作方临床、监管和商业手术量决定部分增量，试验积极标题不等于获批。","IRRAS整合、CAL和支持人员投入先于可重复收入。","借款PIK、收入参与、赎回回报与资产抵押，账面净债务不能代表全部债权经济性。","小盘流动性、供应链、器械质量与报销/竞争风险。"],catalysts:["2026-10-28美东盘后Q3结果；16:30 EDT电话会对应新西兰10/29 09:30。","BDD订单/重复耗材增长、CAL服务投入与现金回款能否改善。","合作方临床与监管节点、IRRAS内生增长及完全稀释股数。"],sources,uncertainty:"最新财务期Q2 2026；当前现金/完全稀释股数、实际融资与债权退出成本、单位递送经济性未完整核验。DCF与收入倍数均为明示条件试算，独立可比交叉核验未完成。初始建仓价及组合适配待核验，不将收盘历史快照当实时行情。"};
validateResearch(research);
const esc=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const cite=x=>esc(x).replace(/\[S(\d+)\]/g,(_,n)=>`<a href="${sources[Number(n)-1].url}">[S${n}]</a>`);
const table=(heads,rows)=>`<div class="table-wrap"><table><thead><tr>${heads.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(v=>`<td>${v}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
function bars(title,rows,unit,max,caption){
  return `<figure><h3>${esc(title)}</h3><svg viewBox="0 0 840 ${rows.length*48+34}" role="img"><title>${esc(title+"，"+unit)}</title>${rows.map(([label,value],i)=>`<text x="0" y="${30+i*48}" font-size="16" fill="#182c30">${esc(label)}</text><rect x="210" y="${12+i*48}" width="${Math.abs(value)/max*470}" height="25" fill="${value<0?'#a53b35':'#17634f'}"/><text x="${220+Math.abs(value)/max*470}" y="${30+i*48}" font-size="16" fill="#182c30">${f(value,2)}</text>`).join("")}</svg><figcaption>${esc(unit+"；从零起，负数以负号及红色标识。"+caption)}</figcaption></figure>`;
}
const financialTable=table(["财务指标（M USD）",...facts.financial.map(v=>v.period)],
 [["收入","revenue"],["毛利","grossProfit"],["营业利润 / 亏损","ebit"],["GAAP净利润 / 亏损","net"],["经营现金流","cfo"],["设备资本开支","capex"],["CFO−CapEx","fcf"],["股权薪酬","sbc"],["期末现金","cash"]].map(([label,key])=>[label,...facts.financial.map(v=>f(key==='fcf'?v.cfo-v.capex:v[key],3))]));
const sensitivity=table(["基准WACC / g","2%","3%","4%"],[.12,.14,.16].map(r=>[f(r*100,0)+"%",...[.02,.03,.04].map(g=>dollar(calculate(assumptions[1],r,g).value))]));
const scenarioTable=table(["情景","2027 / 2031 / 2036收入，M","终期EBIT率","WACC / g","模型股数，M","条件现值/股"],models.map(m=>[m.name,[m.revenue[0],m.revenue[4],m.revenue[9]].join(" / "),f(m.margin[9]*100,0)+"%",f(m.r*100,0)+"% / "+f(m.g*100,1)+"%",m.shares,dollar(m.value)]));
const html=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${esc(summary)}"><title>${esc(research.title)}</title><style>${css}p{overflow-wrap:anywhere}.table-wrap table{min-width:600px}.sources{overflow-wrap:anywhere}</style></head><body><main><header class="hero"><p class="eyebrow">MY HOLDINGS / FIRST RESEARCH / 27 OCT 2026 NZDT</p><h1>ClearPoint Neuro<br>递送平台价值与现金约束</h1><p class="meta">NASDAQ Capital Market: CLPT · 普通股 · USD · 资料检索截至2026-10-26 UTC / 新西兰10月27日 · 最新财报Q2 2026 · 五年持有视角</p><span class="badge">研究状态：观察</span><p class="lead">${esc(summary)}</p><div class="metrics"><div class="metric"><span class="label">最近正式收盘 · 2026-10-23</span><strong class="value">$9.14</strong><small>历史日线，非实时行情 <a href="${sources[7].url}">[S8]</a></small></div><div class="metric"><span class="label">现金与债务 · 2026-06-30</span><strong class="value">$29.4M / $50.2M</strong><small>现金 / 账面票据；赎回经济性另计</small></div><div class="metric"><span class="label">首次介入 / 加仓价格</span><strong class="value">待核验</strong><small>财务、融资和独立估值仍有缺口</small></div></div></header><nav>${sections.map(s=>`<a href="#${s.id}">${esc(s.title.split("：")[0])}</a>`).join("")}<a href="#sources">来源</a></nav><aside class="callout">事实、管理层展望和研究假设分别标示。报告不把药物试验统计风险写成监管否决，也不把合作方药物销售视为CLPT收入；当前结论为等待证据。</aside><section id="charts"><h2>四张图看清增长、结构、现金与价格</h2>${bars("01 / 收入增长历史",facts.revenueHistory.map(([year,v])=>[String(year),v]),"百万美元，FY2018–FY2025",42,"S4公司演示，早年为四舍五入值；最近两年按S2精确值。并购年份不能完全视为内生增长。")}${bars("02 / Q2 2026收入结构",[["生物制剂与递送",facts.q2.biologics],["导航与治疗",facts.q2.navigation],["设备与软件",facts.q2.capital]],"百万美元，2026年第二季度",6.5,"S1；三项合计10.880M。器械/服务收入不是药物销售额。")}${bars("03 / 经营现金流减资本开支",facts.financial.map(v=>[v.period,v.cfo-v.capex]),"百万美元；FY为全年，H1为半年",28,"S1/S2，计算值。不同期间不可直接比较为同比；现金消耗仍持续。")}${bars("04 / 条件DCF与市场价",[["熊：模型股权归零",models[0].value],["基准条件现值",models[1].value],["牛条件现值",models[2].value],["10/23收盘",facts.price]],"美元/股，研究假设与历史报价分列",20,"模型跨度很大，属于压力试算；不认证精确合理价值或自动买价。")}</section><section id="financial-table"><h2>财务核验表</h2>${financialTable}<p class="note">S1/S2；负数为亏损或现金流出；金额M USD。H1 2026未年化；CFO−CapEx为计算口径。</p></section>${sections.map(s=>`<section id="${s.id}"><h2>${esc(s.title)}</h2>${s.paragraphs.map(p=>`<p>${cite(p)}</p>`).join("")}${s.id==='valuation'?`${scenarioTable}<h3>基准逐年FCFF（M USD，全为假设）</h3>${table(["年度","收入","EBIT率","NOPAT","净再投资","FCFF"],base.rows.map(row=>[row.year,f(row.revenue,1),f(row.margin*100,0)+"%",f(row.nopat,2),f(row.reinvestment,2),f(row.fcff,2)]))}<p>全部情景的逐年收入与利润率、税率及公式保存在配套模型JSON。终值=末期NOPAT×(1+g)×(1−g/ROIC)÷(WACC−g)；净债务桥接为研究假设。基准终值占EV超过100%，因为早期现金流为负。</p><h3>基准敏感性（美元/股，条件试算）</h3>${sensitivity}<p class="note">固定35M模型股数、31M净债务桥接、稳定ROIC15%；本表不是统计置信区间。</p><h3>2031收入倍数交叉试算</h3>${table(["EV/Sales假设","2031条件价","14%折现现值","现价买入五年年化"],multiple.outcomes.map(o=>[o.multiple+"×",dollar(o.endPrice),dollar(o.present),f(o.cagr*100,1)+"%"]))}`:''}</section>`).join("")}<section id="sources"><h2>主要来源与资料用途</h2><p class="note">访问日为2026-10-26 UTC，即新西兰2026-10-27。S1/S2/S4为申报材料，S3/S5/S10为公司原始公告，S6为合作方原始公告，S7为FDA监管资料，S8/S9为二手行情；管理层及合作方前瞻不当作实绩。</p><ul class="sources">${sources.map(s=>`<li><a href="${s.url}" rel="noopener noreferrer">${esc(s.label)}</a></li>`).join("")}</ul></section><footer>研究支持，非保证收益。所有模型为条件判断，不构成交易指令。原始财务、报价时点与研究假设必须连同结论阅读；HTML离线可读，无外部脚本或在线字体。</footer></main></body></html>`;
fs.writeFileSync(basename+".json",JSON.stringify(research,null,2)+"\n");
fs.writeFileSync(basename+"-model.json",JSON.stringify({facts,assumptions,models,multiple,reversePrice,reverseRevenue},null,2)+"\n");
fs.writeFileSync(basename+".html",html);
console.log(JSON.stringify({html:path.resolve(basename+".html"),detailsLength:details.length,marketCap:facts.marketCap,ev:facts.evBookApprox,models:models.map(m=>({scenario:m.name,value:m.value,fundingGap:m.fundingGap})),multiple:multiple.outcomes}));
