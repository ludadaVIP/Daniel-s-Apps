import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { validateDecisionReport, decisionEntryPlan } from '../../../src/decision-reports.js';
import { decisionReportHtml } from '../../../server/decision-report.js';

const dir=new URL('./',import.meta.url);
const read=async n=>JSON.parse((await fs.readFile(new URL(n,dir),'utf8')).replace(/^\uFEFF/,''));
const m=await read('hood-fcfe-evidence-model-2026-11-05.json');
const f=await read('hood-financial-evidence-2026-11-05.json');
const p=await read('hood-portfolio-context-2026-11-05.json');
const q=await read('hood-quote-evidence-2026-11-05.json');
const b=m.paths.base, F=n=>Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const pct=n=>(n*100).toFixed(1)+'%';
const quote=q.finalOvernight||q.overnight;
const sourceUrls=[
 ['最新2026Q3 10-Q：报表、资本、贷款、融资、稀释与风险','https://www.sec.gov/Archives/edgar/data/1783879/000178387926000167/hood-20260930.htm','2026-10-28申报；2026-09-30报告期'],
 ['Q3修订业绩稿：采用修订后的非GAAP税务桥','https://robinhood.gcs-web.com/static-files/097e3ef5-f1a9-4981-b224-c58d9da67159','2026-10-27原发布；10-28修订申报'],
 ['Q3业绩演示：产品、收入构成和指标定义','https://investors.robinhood.com/static-files/fd90f575-5b4c-4cde-a16d-d114c920fb6a','2026-10-27'],
 ['Q3官方电话会：Chain净收入、事件市场与产品执行','https://investors.robinhood.com/static-files/4e6e17d2-915a-4cb4-b617-d0127c487075','2026-10-27；管理层陈述'],
 ['2026股东委托书：控制权、报酬与激励','https://www.sec.gov/Archives/edgar/data/1783879/000178387926000053/hood-20260422.htm','2026-04-22'],
 ['美国财政部：BNY与Robinhood在Trump账户的职责','https://home.treasury.gov/news/press-releases/sb0433','2026-04-06'],
 ['CFTC：预测市场联邦管辖权诉讼','https://www.cftc.gov/PressRoom/PressReleases/9220-26','2026-04-28'],
 ['密歇根监管机构：暂停体育合约安排','https://content.govdelivery.com/accounts/MIGCB/bulletins/4293a85','2026-09-09'],
 ['事件合约费率、州限制及产品条款','https://robinhood.com/us/en/support/articles/event-contracts-overview/','限制更新2026-11-02；访问2026-11-05'],
 ['SEC代币化股票创新豁免：适用条件','https://www.sec.gov/newsroom/press-releases/2026-90-sec-issues-innovation-exemption-facilitate-trading-tokenized-nms-stock-request-comment','2026-09-17'],
 ['SEC Rule 605 FAQ：执行质量披露','https://www.sec.gov/rules-regulations/staff-guidance/trading-markets-frequently-asked-questions/frequently-asked-questions-rule-605-regulation-nms','2026-04-01；2026-08-01起适用'],
 ['Nasdaq UTP2026-18：tick-size实施延后','https://www.nasdaqtrader.com/TraderNews.aspx?id=UTP2026-18','2026-06-17'],
 ['MIAX监管申报：保留Rothera E&C权益','https://www.sec.gov/Archives/edgar/data/1438472/000162828026068667/R14.htm','2026Q3；访问2026-11-05'],
 ['美国司法部：员工个人被控事项，非公司有罪结论','https://www.justice.gov/usao-sdny/pr/two-robinhood-employees-charged-fraud','2026-09-15'],
 ['Schwab官方价格表：佣金与期权费','https://www.schwab.com/pricing','访问2026-11-05'],
 ['IBKR官方股票佣金：Lite与Pro不同口径','https://brokerage.ibkr.com/en/pricing/commissions-stocks.php','访问2026-11-05'],
 ['Fidelity官方价格表','https://www.fidelity.com/trading/commissions','访问2026-11-05'],
 ['Coinbase费用及价差披露','https://help.coinbase.com/en/coinbase/trading-and-funding/pricing-and-fees/fees','访问2026-11-05'],
 ['Robinhood保证金利率表','https://robinhood.com/us/en/support/articles/margin-rates/','2026-09-17利率；访问2026-11-05'],
 ['Rothera公司介绍：交易所与清算业务','https://www.rothera.io/company','访问2026-11-05'],
 ['ArbitrumDAO：Robinhood Chain主网上线材料','https://forum.arbitrum.foundation/t/arbitrumdao-factsheet-robinhood-chain-mainnet-launch/31041','2026-07-06'],
 ['Q2官方电话会：与Q3的业务进度比较','https://investors.robinhood.com/static-files/f44ea493-9c52-4744-9671-7720e1ac7b2f','2026-07-29'],
 ['FY2025 10-K/A：审计财务与历史比较','https://investors.robinhood.com/static-files/36353485-5cd1-4eb2-9eb4-6d266f75374b','2026-02-20；仅修正原10-K表格格式'],
 ['FY2023 10-K：2021–2023原始财务','https://www.sec.gov/Archives/edgar/data/1783879/000178387924000054/hood-20231231.htm','2024-02-27'],
 ['SEC修订Exhibit99.1：542m调整后归母净利','https://www.sec.gov/Archives/edgar/data/1783879/000178387926000170/q32026robinhoodamendedex991.htm','2026-10-28'],
 ['8-K/A：修订仅涉及非GAAP税务呈现，GAAP未变','https://www.sec.gov/Archives/edgar/data/1783879/000178387926000170/hood-20261027.htm','2026-10-28'],
 ['TradingView BOATS实际页面：夜盘市场开放与报价','https://www.tradingview.com/chart/?symbol=BOATS%3AHOOD',quote.observedUtcClock],
 ['Moomoo实际页面：正式收盘与较早盘后交叉核对','https://www.moomoo.com/hans/stock/HOOD-US','2026-11-04 16:00/19:59 EST；读取2026-11-05 UTC']
];
const sources=sourceUrls.map(([label,url,date],i)=>({label:`[S${i+1}] ${label}`,url,date:date+'；访问2026-11-05'}));
const remaining=Math.max(0,4000-p.company.value-p.pendingKnownLimitBuyUsd);
const tiers=['小仓观察','安全边际','折价'];
const entries=m.purchase.entries.map((e,i)=>({...e,condition:
 `${tiers[i]}上沿=min(基准FCFE今日${F(m.purchase.referenceToday)}×${[75,65,55][i]}%，基准2031价${F(m.purchase.referenceYear5)}/1.15^5)，向下取美分。要求${[25,35,45][i]}%模型折让与15%研究年回报；不是股价预测或保证安全的底价。先核事件合约州限制、资金真实留存、信用卡vintage损失、清算及贷款所需资本、税后每股盈利。资本效率假设未验证或出现融资缺口时停用原价表。${i===2?`低于${F(e.low)}须重做尽调，不机械补仓。`:''}`}));
const financialLines=f.annual.map(x=>`${x.period}：净收入${F(x.net_revenue)}；营业利润${F(x.operating_profit_calculated)}／${pct(x.operating_margin_calculated)}；归母净利${F(x.net_income_parent)}；CFO${F(x.CFO)}；现金CapEx${F(x.cash_capex)}；机械差额${F(x.mechanical_CFO_minus_cash_capex)}；费用化SBC${F(x.SBC_expensed)}；期末基本股${F(x.period_end_shares)}百万。`).join('\n');
const modelLines=b.rows.map(x=>`${x.year}研究期：收入${F(x.revenue)}；新增服务报酬现金等价${F(x.futureNewServiceCashCompensation)}；税前${F(x.pretax)}、正常税${F(x.normalTax)}、少数归属${F(x.nciEarnings)}；归母经济盈利${F(x.parentEconomicEarnings)}；所需资本${F(x.requiredCapitalClosing)}、增量${F(x.capitalIncrease)}；FCFE${F(x.ownerFcfe)}。`).join('\n');
const sensitivity=m.sensitivity.map(x=>`Ke${pct(x.ke)}：`+x.values.map(y=>`g${pct(y.g)}→$${F(y.todayValue)}`).join('；')).join('\n');
const methodLines=Object.entries(m.paths).map(([n,v])=>`${{bear:'悲观',base:'基准',bull:'乐观'}[n]}：FCFE今日$${F(v.primary.todayValue)}／2031 $${F(v.primary.year5Price)}，按本次报价五年年化${pct((v.primary.year5Price/quote.price)**.2-1)}；盈利资本化今日$${F(v.earningsMultiple.todayValue)}／2031 $${F(v.earningsMultiple.year5Price)}，年化${pct((v.earningsMultiple.year5Price/quote.price)**.2-1)}。`).join('\n');
const r={version:1,symbol:'HOOD',name:'Robinhood Markets, Inc.',exchange:'NASDAQ · Class A普通股',currency:'USD',capitalUsd:400000,horizonYears:5,
 analysisDate:'2026-11-05',analysisTimeZone:'Asia/Shanghai',
 dataAsOf:`2026-11-05（Asia/Shanghai）；最新已发布实绩为2026Q3，10月27日公布、10月28日10-Q及修订8-K/A申报。夜盘页面核验${quote.observedUtcClock}，官方资料/监管核验至本次研究时点。`,
 financialPeriod:'FY2021–2025、2026Q3/9M（止2026-09-30）及TTM',
 quote:{price:quote.price,date:quote.localEst.slice(0,10),type:'BOATS夜盘页面快照',source:'TradingView BOATS实际页面；Moomoo核对正式收盘',sourceUrl:sources[26].url,
  note:`实际页面显示$${F(quote.price)}、Market open、Data updates once per second，页面UTC时钟${quote.observedUtcClock}（${quote.localEst}）。该时钟是观察时间，不冒充最后一笔成交的独立时间戳。Moomoo正式收盘$87.41（11月4日16:00 EST），较早盘后$87.40（19:59 EST），与夜盘分开。BOATS涨跌比较基准不等同于Nasdaq收盘；买卖价与流动性可能不同。报告行情独立，不覆盖用户保存报价。[S27][S28]`},
 verdict:{stance:'观察：增长有实证，现价风险补偿不足',
  summary:`当前新增0%。HOOD已形成盈利平台，但贷款资本、交易周期与事件合约监管仍关键。基准FCFE今日$${F(b.primary.todayValue)}、盈利法$${F(b.earningsMultiple.todayValue)}；两法分歧大，不能视为确定价值。等待价格和经营条件同时通过。`,
  conclusion:`Robinhood的资金流入、Gold、期权与新产品增长是真实进展：Q3净收入1,424百万、归母净利468百万；但交易收入约61%，期权增长更多靠老客交易强度，信用卡净利息增长并不等于完整利润。监管支持与州限制同时存在。基准已假设2031净收入${F(b.rows[4].revenue)}百万、归母经济盈利${F(b.rows[4].parentEconomicEarnings)}百万；FCFE今日$${F(b.primary.todayValue)}，较乐观持续期的盈利资本化法$${F(b.earningsMultiple.todayValue)}，两者并未相互印证。2031两法$${F(b.primary.year5Price)}／$${F(b.earningsMultiple.year5Price)}，相对夜盘$${F(quote.price)}年化${pct((b.primary.year5Price/quote.price)**.2-1)}／${pct((b.earningsMultiple.year5Price/quote.price)**.2-1)}。当前新增0%；三档${entries.map(e=>`${F(e.low)}–${F(e.high)}`).join(' / ')}仅在经营、资本与价格共同满足时使用。40万美元条件目标1%=$4,000、上限1.5%=$6,000，先扣VOO间接敞口与买单；原手填$68观察价保留，不据此背书。`,
  confidence:'财务事实中高；估值中低：经济资本、长期增长持续期、监管结果及可分配母公司现金未确定。',
  valueLow:b.primary.todayValue,valueHigh:b.earningsMultiple.todayValue,
  limitations:'这是七种公开理论的方法模拟，非本人观点。现金与资本锚点止9月30日，10月21日基本股数加9月30日奖励可能存在少量时点重叠。母公司即时可自由分配现金未知，监管资本不是可抽走现金；所需资本系数、未来新服务报酬、25%正常税、利润率、少数权益和零息留存均为研究假设。模型分两种增长久期，不是相互验证后的窄置信区间；PE为研究倍数，没有冒充同日同行实测。权证采用固定现价净股交割近似，未计风险中性期权时间价值；可转债超cap、对手方失效、额外授予或融资需重建。无完整个人回撤/税务/流动性约束，组合最终适配未完成，未计税费与汇率。严重信用/运营冲击存在未融资缺口，此类诊断值不能作买价。'},
 position:{targetPct:1,maxPct:1.5,currentAdditionalPct:0,existingExposureUsd:p.company.value,pendingBuyUsd:p.pendingKnownLimitBuyUsd,
  rationale:`当前新增0%。条件目标总敞口1%=$4,000、上限1.5%=$6,000。扣现有$${F(p.company.value)}及已记录买单$${F(p.pendingKnownLimitBuyUsd)}，剩余目标$${F(remaining)}，仅在这笔资金内按25%/35%/40%分档。多产品盈利支持小额试探研究，交易/信用/监管共振限制上限；全损仍可令40万美元组合损失1%或1.5%，压力情景不是最大损失保证。未获完整约束前这不是最终适配或必须买满的指令。`,
  portfolioFit:`本地无HOOD直接持股，无待成交HOOD买单；VOO穿透约$${F(p.company.value)}（保存成分2026-09-30，行情2026-11-04），不是券商实时资产。已有IBKR直接持仓、VOO金融企业与大科技/QQQM风险，HOOD的交易、crypto、保证金信贷与市场风险偏好同向，并非对冲。原手填$68目标价及所有用户计划、普通研究、行情与委托保留。本轮单股目标须放回40万美元总预算与候选机会排序，66支上限不能同时买满。`},
 entries,
 scenarios:['bear','base','bull'].map((id,i)=>{const v=m.paths[id],x=v.rows[4];return {id,label:['悲观：周期与合规压力','基准：扩张与利润正常化','乐观：全球多产品平台'][i],todayValue:v.primary.todayValue,year5Price:v.primary.year5Price,
  assumptions:`首研究年收入${F(v.rows[0].revenue)}，2031 ${F(x.revenue)}百万；经济归母盈利${F(x.parentEconomicEarnings)}百万，含正常税25%、新服务薪酬及信用/融资成本。K=max(10,001,收入×${v.parameters.capitalRevenueRatio})为经济资本假设，Ke${pct(v.parameters.ke)}、g${pct(v.parameters.g)}；前五年FCFE零息留存${F(v.retainedSurplus5)}百万。固定净股储备分母${F(v.primary.shares)}百万，未新增外部股本；本路径资本缺口检测通过。不是公司指引或保证。`};}),
 masters:[
 {id:'graham',name:'格雷厄姆 · 资产保障与购买价',judgment:'盈利与权益已有基础，但账面净值不是无条件清算底价。',
  evidence:'9月归母权益10,001百万；集团现金5,829、监管隔离资产13,443、客户平台资产396,000是不同口径。净贷款、清算与信用承诺会改变可抽取资本。[S1]',
  challenge:'既然有真实盈利和大额现金，为什么不直接按现金加盈利倍数给更高价值？',response:'现金既可能已用于产生净利，也受客户、监管和融资约束；B0已扣债务，不能反复加现金或减债。先列所需经济资本与融资缺口，再要求购买价折让。三档是条件研究范围，价格接近账面也不能替代信用与法律尽调。'},
 {id:'buffett',name:'巴菲特 · 客户价值与护城河',judgment:'产品便利、品牌、Gold与资产整合形成黏性，但零佣金本身已不稀缺。',
  evidence:'Gold约5.2百万、平台资产约396十亿美元、退休资产36.6十亿美元，客户愿意迁入资金；Schwab、Fidelity及IBKR Lite也有零佣金股票服务，执行、利率与跨产品体验才是竞争变量。[S1][S3][S15][S16][S17][S19]',
  challenge:'多产品共用一个账户可能成为下一代默认金融入口，保守估值是否漏掉网络与规模优势？',response:'保留乐观平台路径，但以客户资产净留存、真实付费渗透、单位盈利、执行质量和资本回报验证。Trump自动开户不等于普通付费用户，Chain gross费用不等于净利润；不为尚未证明的永久钱包份额一次付清。'},
 {id:'munger',name:'查理·芒格 · 激励与反向思考',judgment:'最需防范的是产品扩张、交易活跃和信用风险一起上升，而指标看上去仍漂亮。',
  evidence:'2025现金奖金指标偏重收入、调整净利、净流入和Gold；计划外CECL及税率变化可被剔除。信用卡贷款增长、低分客户占比上升、拨备增长使GAAP与调整口径都须看。创始人通过B类股控制表决权。[S1][S5]',
  challenge:'创始人长期控制也能防止短期主义，快速推出产品是不是更重要的优势？',response:'长期控制与执行速度有价值，外部股东制衡较弱同样真实。逐项核风险调整后的每股价值、vintage信用表现、合规投入与净稀释；个人被控事件不等于公司有罪，但内部信息和市场监督不能忽略。[S14]'},
 {id:'lynch',name:'彼得·林奇 · 快速成长与周期辨识',judgment:'这同时是成长平台和周期券商，不能只用一个PEG解释它。',
  evidence:'Q3净收入+12%，期权收入+31%；期权每位交易者合约数+66%，下单用户数却-11%。crypto收入-55%；Funded Customers增长7%弱于Gold增长34%。[S1][S3]',
  challenge:'新增14条年化过亿美元业务线正在分散收入，历史券商周期是否已不适用？',response:'产品多样化值得给信用，但业务线数量不等于独立风险因子。用同口径净收入、下单用户、每客收益和贷款资本需求分开核验；政府服务、交易所与L2收入按净归属计，不能把同一流量重复加总。'},
 {id:'dalio',name:'瑞·达利欧 · 利率、信用与资本',judgment:'降息对交易情绪可能有利，对净利息却有直接压力；信用与抵押品共振不能忽略。',
  evidence:'Q3净利息415百万、同比-9%；margin book约22.1十亿美元、同比+59%。官方静态敏感性：100bp利率变化对应未来12月税前约366百万，且排除Cash Sweep。[S1]',
  challenge:'交易、crypto和贷款量的增长会不会完全抵消降息？',response:'可能部分抵消，静态敏感性不是完整预测。把余额增长、价差、证券借贷和全周期损失分别检验；深度衰退时交易波动收益与信用损失未必同时有利。Ke和资本预算均保留敏感性，不把单一路径称为对冲。'},
 {id:'soros',name:'索罗斯 · 反身性与融资反馈',judgment:'风险偏好、资产价格、交易与产品增长可形成正反馈，也能迅速反转。',
  evidence:'高资产价格提高平台资产和交易量，低价产品吸引资金，股票报酬及回购又影响每股归属。2029现金偿还2,200百万可转债本金是真实义务；capped calls只在条款区间内提供保护。[S1][S3]',
  challenge:'拥有现金和多渠道融资的公司，为什么仍把资本市场反馈当风险？',response:'融资能力不是可自由分配利润。期权价值、监管抵押、贷款融资和现金调拨均可能在压力下变化。当前无需假设高价增发撑主路径；如出现资本缺口，重新联动融资、缩表与股数，而不沿用旧每股价值。'},
 {id:'marks',name:'霍华德·马克斯 · 价格与第二层判断',judgment:'公司可能继续成功，当前股票仍可能只给平庸回报。',
  evidence:`较宽松盈利法基准2031 $${F(b.earningsMultiple.year5Price)}，相对报价年化仍约${pct((b.earningsMultiple.year5Price/quote.price)**.2-1)}；达到15%研究回报需2031约${F(m.reverse.requiredPe5For15pctReturn)}倍本报告经济盈利，而非24倍。[S1][S27]`,
  challenge:'真正的平台赢家经常长期保持高倍数，等待深折价也可能永久错过。',response:'承认乐观路径可以产生高回报，错过上涨也是机会成本。没有独特客户数据、监管先见或更强资本证据时，不把乐观路径当基准。按小额条件预算等待；若经营证据改善，应重估价值，不固守低价锚。'}
 ],
 debate:[
 {question:'多产品平台能否摆脱交易周期，获得长期高倍数？',bull:'Gold、退休资产、Banking、Strategies、政府账户服务与全球业务扩大钱包份额；共同技术和分销可改善边际经济性。',bear:'Q3约61%收入仍来自交易，期权增长依赖更少客户更高周转；crypto下滑和利率压力说明风险因子并未独立。政府账户分母、并购及gross/net口径会夸大有机增长。',resolution:'认可已实现的净收入与盈利，不给每个新产品重复估值。基准允许首年6,000、2031约10,943百万净收入，仍把资本需求和成长衰减算进去；更持久增长进入乐观/高倍数方法，不冒充确定事实。'},
 {question:'联邦监管支持和自有交易所，是否足以消除预测市场风险？',bull:'CFTC主张联邦管辖；Rothera垂直整合、外部FCM和第二交易所安排可以改善产品与经济归属。',bear:'州限制和法院争议仍在，Michigan停办安排是实际商业约束；体育活动占比较高，自有交易所并不拥有所有地方法律的豁免。JV亦非全资，存在治理同意权。',resolution:'同时采用CFTC与州监管一手来源，不把诉讼立场当终局裁决。173百万已含28百万Rothera，不重复加总；对地址限制、路由迁移、净抽成和少数权益逐季复核。[S7][S8][S9][S13]'},
 {question:'3,983百万CFO能否支持高估值及轻资本叙事？',bull:'经营规模、资金迁入与盈利给公司研发、国际扩张和回购提供资源，主要授信尚有未提用空间。',bear:'CFO包括客户应付、证券出借与隔离资产变化；卡应收现金购买列投资流，ABS/仓储融资列融资流。把集团CFO−CapEx当FCFE会把客户/融资资金算给股东。',resolution:'采用正常化归母经济盈利减所需权益资本增量。K系数为不确定研究预算，明确资本效率改善和融资缺口；不额外加全部现金，不二次减已入账可转债本金，流动性调拨另作限制。[S1]'},
 {question:'为什么FCFE与盈利倍数法给出如此不同的价值？',bull:'2031后平台可能仍有较快增长，24倍正常化盈利可以对较长成长期给出合理信用；乐观30倍保留全球平台成功。',bear:'FCFE明确降低增长、扣留增长资本，并以12.5%权益成本与3%终值增长估基准；高倍数方法若无更长久期和资本效率依据，就只是抬高终值。',resolution:'两法并列，不平均为一个可靠目标。基准范围是方法假设区间；条件买价用更保守的资本与现金路径并再留折让。若市场实际相信更快增长或更低资本成本，反推的单变量结论不能证明市场整体不可能。'},
 {question:'回购与股权薪酬是否已经使股东获得持续每股复利？',bull:'公司有真实回购，员工和创始人股权能与长期产品成功绑定。',bear:'9M回购689百万包含可转债配套290百万，基本股数仍约901百万；股份授权、SBC会计成本、净发行及代扣税并非同一件事。',resolution:'历史各项分开列。现有奖励只分配一次，未来新授予服务改现金成本；前五年不再叠加回购收益率。未来净回购若兑现，必须同时减少现金并更新股数，而不能只提高每股盈利。[S1][S5]'}
 ],
 sections:[
 {title:'买到的是什么：账户入口、交易与金融资产服务',body:'Robinhood向零售客户提供股票、期权、crypto、事件合约等交易渠道，也提供Gold、现金/保证金、信用卡、财富与退休账户等服务。交易返佣/费用、净利息、订阅及平台服务是不同收入引擎；平台资产和交易名义金额不是收入。Bitstamp、TradePMR与WonderFi扩大地域和客户范围，也改变同比口径。\nQ3交易收入867百万=期权399+事件173+股票121+crypto120+其他54；净利息415、其他142，总计1,424百万。Q3营业费用739，计算营业利润685；税前625、所得税149、合并净利476，再扣少数权益8得到归母468。不能据未单列传统销售成本声称100%毛利率。[S1][S2][S3]\n竞争不只看佣金：Schwab/Fidelity和IBKR Lite的股票服务也有零佣金；HOOD通过部分期权收费、margin利率、产品体验与Gold竞争。客户迁移方便且常有奖励，抬高持续获客成本；市场做市商与交易所是关键供应方，Citadel约占Q3总净收入17%，体现供应方集中。[S1][S15][S16][S17][S18][S19]'},
 {title:'护城河的方向：资金留存优于业务线数量',body:'品牌、移动端体验、共同账户技术、分销规模和牌照/清算能力构成进入门槛，跨产品使用可能增加转换成本；自由交易低价本身已是行业常态。对既有大券商的客户资金、财富服务、执行质量和复杂账户能力仍需比较。买方可以多平台开户，供应方返佣和规则受监管约束，新进入者可借基础设施快速上线，传统银行/券商亦是替代方案。\nQ3 Funded Customers约28.7百万、Gold约5.2百万、平台资产约396十亿美元，净流入15.7十亿美元；这些是实际进展。净流入不是纯新客户现金，定义包含股息、利息、奖励及特定时期的收购和政府账户资金。期权用户数-11%而人均合约数+66%，说明交易强度比客户广度增长更快。产品多不等于收入因子分散，需用资产净留存、付费客户、风险调整利润和每股现金验证。[S1][S3]'},
 {title:'新引擎的口径：Trump、Rothera、Chain不重复相加',body:'Trump账户Q3服务收入47百万已在收入表；2026年7月起其种子与贡献资金计入Net Deposits和平台资产，账户却不计入Funded Customers。约70百万自动开户儿童及25百万获得250美元的覆盖不是新增普通付费客户，Dell贡献也不是HOOD收入或自由现金。Treasury保留初始App/账户运营控制，BNY为政府financial agent，HOOD承担初始trustee/broker职责。[S1][S3][S6]\n事件合约173百万已含Rothera28百万。Rothera为非全资并表结构，SIG的重要同意权和MIAX保留权益不能省略，不能把穿透45%与JV50%随意互换。Rothera一对Yes/No撮合记量方式不同于Hub合约买卖数。[S1][S3][S13][S20]\nChain首季约50百万gross链费，电话会称与Arbitrum约各分享50%、HOOD净约25百万，已经进入crypto收入，不再加到120百万之外。公司与DAO的分配层级需区分；高DEX名义量不能直接推导稳定利润。Crypto/OG合作初始1%权益、未来条件最高10%也不同于已持有10%。Stock Tokens经济曝险与底层股票所有权不同，SEC创新豁免并非自动批准HOOD每种产品。[S1][S4][S10][S21]'},
 {title:'五年及TTM财务：增长、税与会计可比性',body:`金额百万美元，股数百万；现金CapEx包含PPE/软件购买及内部软件开发的现金资本化。原表按FY2025 10-K/A与FY2023 10-K核对，未把SEC companyfacts的fy当指标期间。\n${financialLines}\nTTM=FY2025−9M2025+9M2026：净收入5,082；营业利润2,320、营业率45.7%；归母净利1,984（合并2,000）；CFO3,046、现金CapEx76，机械差额2,970；费用化SBC353。以同期2025-09-30与2026-09-30归母权益8,567/10,001平均计算TTM ROE约21.37%，不使用客户资产作分母。\nFY2021损失含可转债/权证公允值变化，IPO确认SBC也重要；FY2023 SBC含创始人2021市场条件奖励取消的485百万费用。FY2024净利含347百万税收收益，FY2025有效税率10.7%含SBC税务利益及研发抵免。Q3/9M2026税率约23.84%/20.06%，TTM约16.87%；估值用25%正常税，未永续低税。净利润率与ROE不能未经正常化外推。金融混合平台不用普通工业ROIC或EV/EBITDA当主估值，也不编造维护/增长CapEx拆分。[S1][S23][S24]\n原IR HTML曾写550百万调整净利；10月28日8-K/A仅修非GAAP税务呈现，归母468+2+67+9−4=修订542百万，调整EPS仍0.60，GAAP未变。未沿用旧550，也未把合并476当普通股利润。[S25][S26]`},
 {title:'现金桥、信用与监管资本：不能把客户资金分给股东',body:'9M2026合并净利1,395+DA72+信用损失拨备163+递延税63+费用SBC277−去并表收益107+投资损失46+其他26=1,935；资产负债变化净增2,048，CFO合计3,983。重要变动包括客户应付+6,447、证券出借负债+7,854，以及隔离证券−4,360、客户应收−4,939、借入证券−2,373等。机械CFO−CapEx=3,920不是可分配FCFE。\n信用卡应收购买10,834减收回9,961，净现金占用873列投资流；仓储融资净流入234加ABS500为734，差额139由其他资金支持，139并非法定资本要求。Q3卡净利息50、卡拨备61，仍缺interchange、奖励、网络与运营成本才能算完整卡业务利润；不能简单叫它赚50或亏11。\n9月表内/表外卡贷款1,645/196，总1,841，past-due约102、90天以上33；FICO低于640约5%，年末3%。贷款未完全seasoned，迅速放量需要看vintage与全周期损失。margin book约22.1十亿美元、同比+59%，抵押品/集中度与客户借贷可在下跌时共振。\n集团现金5,829、隔离现金证券13,443及其他受限现金不是同一口径。RHS/RHF/RHD/TradePMR监管超额资本约3,721/329/574/18百万，仍需清算、日内波动与经营储备，不能直接相加当母公司提款。母公司可自由分配现金未单列核实，模型不另加任何初始超额现金。[S1]'},
 {title:'资本配置、股权归属与治理',body:'9月合并权益10,078减NCI77=归母10,001百万，商誉515、无形资产231；简单有形归母权益9,255并非无风险清算价值。9M权益桥：9,140+归母净利1,379−OCI17+期权4+ESPP17−RSU代扣税34−capped-call净权益成本93−回购689+SBC含资本化292+RVI去并表APIC2=10,001。\n10月21日A793.425151+B107.066126=900.491277百万股；季度加权稀释911用于EPS，不能冒充当日股数。9月未归属RSU6、PSU最高0.4百万；TradePMR未归属但已发行约1百万已在基本股，348百万未来授权留额不是已发行。未确认SBC453预计1.04年确认，费用SBC与资本化软件SBC15分开。\n9M回购689包含计划399和可转债配套290，不能只看毛回购证明净缩股。创始人B类股10票、A类1票，约12%经济权对应超过半数表决权；这利于长期产品决策，也削弱外部制衡。2025高管现金奖金177.3%目标，计划外CECL和税率可调整，需防增长指标与风险错配。CEO报酬表约3.005百万与pay-versus-performance约1.021十亿美元的旧股重估不是同一概念，不把后者当年度现金所得。[S1][S5]\nTradePMR最终现金对价169，另100为后续服务报酬；Bitstamp224、WonderFi178及Rothera收购的净归属均应按交割日处理。已付收购现金已经在最新报表内，不在模型再全额扣一遍。RVI/RVII保留权益361/23也已在B0，投资FV波动不当成经常利润。[S1][S23]'},
 {title:'融资与稀释：本金、溢价和股票报酬各计一次',body:`2026年6月发行2,200百万零票息可转债，2029-10-01到期；账面约2,172、剩余发行费用28.1。转换本金强制现金支付，初始转股价174.42；潜在12.6百万股不是今天无条件已发行股，季度约13百万因反稀释被排除。Capped calls成本123.2、strike174.4227、cap237.8475，并非无上限或无对手方风险。模型B0已扣负债，不二次减2,200。假设到期释放原计收益的3.5%融资资产偿本，净权益不减，2030起盈利扣77百万税前失息；不再从单列留存盈余扣同一本金。此资产调配假设不证明母公司实际流动性可用。\n另有ABS账面约488、仓储融资本息839，不能说无债；10月15日新增ABS500是期后事件，不知配套还款便不能全视为净新增自由现金。\n同一现时参照$87.33下，8.74百万股、$26.60权证按允许的净股交割近似储备${F(m.paths.base.primary.netWarrantSharesReserved)}百万股；基本股+旧RSU/PSU+此净股储备合计${F(m.paths.base.primary.shares)}百万，两方法同分母，不加行权现金。按8.74百万全部保留、不计现金信用的更严稀释边界，基准今日$${F(m.grossWarrantReserveSensitivity.baseToday)}，不是另一估值方法。现价近似忽略期权时间价值，9月奖励与10月基本股时点可能重叠；不能自称精确完全摊薄股数。\n旧奖一次归属分配后，未来新增服务薪酬按收入比例以现金承担，不再扣同批旧奖摊销，也不同时假设新奖励继续免费稀释。主情景在2029的内在价代理都低于cap，故未额外加转股溢价或12.6百万股；若未来高于cap、对手方失效或条款改变，必须重建现金、股数与资金缺口，不能沿用未调整值。[S1]`},
 {title:'主估值：金融平台的权益现金流与所需经济资本',body:`以下全部为假设，金额百万美元。2027–2036表示从本次估值日起的十个近似12个月研究期间，2031为五年检查点，不冒充公司FY指引。因报告期锚点较估值日早约五周，未补造期间实际权益/现金。\n首年净收入悲观4,600、基准6,000、乐观6,800；基准后续增速20%/18%/15%/12%/10%/8%/6%/5%/4%。Q3年化5,696与TTM5,082是事实，6,000首年是增长假设。基准扣新服务报酬前税前率49%起、最高52%再降48%；新授服务现金等价8%收入起、后降7%，正常税25%，正利润约2%划少数权益；信用、融资、研发、营销及运营成本已在利润率内，不把调整EBITDA当净利。\nK0=归母权益10,001全部视为必要经营/监管/流动性资本；K_t=max(10,001,c×净收入_t)。悲观/基准/乐观c=2.0/1.5/1.3，均为研究经济资本预算，非法定最低资本。现时B0/TTM净收入约1.968倍，基准与乐观要求资本效率改善；业务收入、贷款与清算敞口未必同比例，故另做+25%资本压力。衰退不释放初始资本是保守约定。\n归母经济盈利=收入×(扣新服务前税前率−新服务报酬率)−发行成本摊销−偿债失息−正常税−少数权益；FCFE=归母经济盈利−ΔK。NI−ΔK近似FCFE隐含维护现金CapEx约等于折旧/摊销、额外净软件和获客投入已由利润或资本预算覆盖；不是把未单列投入当0，也不机械再扣全额CapEx造成双算。若净再投资更大则价值下调。没有可核维护CapEx拆分时，不能把本近似当法定派息能力。\n${modelLines}\n前五年FCFE零息留存${F(b.retainedSurplus5)}，2031所需资本${F(b.rows[4].requiredCapitalClosing)}；留存现金只加一次，K已在经营价值内不另加；这隐含2031盈余可单独变现或被市场按面值认可，届时调拨限制与税负尚未核实，不能保证全额可提取。2032–36 FCFE及终值以Ke12.5%折回2031；稳定FCFE=NI2036×1.03−K2036×3%，再除(12.5%−3%)。终值资本底线亦开始按g增长，所需资本/收入未脱离floor的路径也不假设免费稳定增长。\n基准2031=${F(b.franchiseDcf5)}剩余经营价值+${F(b.retainedSurplus5)}留存盈余，除${F(b.primary.shares)}百万份=$${F(b.primary.year5Price)}；再折五年=$${F(b.primary.todayValue)}。终值经济ROE${pct(b.terminal.roe)}、再投资率${pct(b.terminal.reinvestmentFraction)}，稳定隐含PE约${F(b.terminal.impliedPe)}倍。终值现值占比${pct(b.terminal.pvTerminalShareOfToday)}，不确定性很高。`},
 {title:'第二种估值、资本政策与五年收益',body:`第二法用2031正常化归母经济盈利×悲观16/基准24/乐观30倍，加前五年单列零息留存盈余，除同一权益索取权。NI不含新闲置现金收益，故这笔盈余可加一次；不加全部5,829集团现金或K。基准=(${F(b.rows[4].parentEconomicEarnings)}×24+${F(b.retainedSurplus5)})/${F(b.primary.shares)}=$${F(b.earningsMultiple.year5Price)}，按12.5%折回今日$${F(b.earningsMultiple.todayValue)}。\n16/24/30是对周期/平台/更长增长久期的研究倍数，非同日同行实测。FCFE在2036后用成熟增长与所需再投资；2031的24倍盈利意味着更久的高增长或更低资本成本，两者分歧不能平均为可靠目标。没有独立同业倍数优势，不能以名家名字补证据。\n${methodLines}\n前五年假设不派息、不净回购，故上述年化=(2031价格/本次报价)^(1/5)−1，未再叠加回购收益率；如未来改变分配政策，应联动现金与每股数。第六年后的模型分配是估值假设，不是公司宣布派息。立即可分配FCFE的基准今日总权益${F(b.standardImmediatelyDistributableFcfeToday)}，与零息留存策略差${F(b.zeroYieldRetentionDrag)}百万，是资金闲置时点效应，不是第三种独立估值。\n原RIM原型因任意留存政策与资本需求未闭合已被否决并保留归档，未用于首屏、入场价或本结论。最终FCFE由独立JavaScript重建审计，算术一致不证明经济假设真实。`},
 {title:'反推预期、敏感性与不成立的融资路径',body:`固定基准收入、资本、Ke与g，只提高全期税前利润率，匹配$87.33需各年提高约${pct(m.reverse.requiredUniformPretaxMarginIncrease)}，峰值扣新服务前税前率${pct(m.reverse.peakRequiredPreCompPretaxMargin)}，超过100%，不存在本单变量下可行的经营根。峰值限制在100%时今日仍约$${F(m.reverse.todayValueAt100pctPeakPreCompMargin)}。这是受约束的反推诊断，不证明市场整体错误；市场可能相信更快增长、更长高回报持续期、更低资本强度或更低权益成本。\n固定2031基准盈利与留存现金，现价按Ke12.5%需退出PE约${F(m.reverse.requiredPe5AtKe)}倍；若要求15%五年回报则需约${F(m.reverse.requiredPe5For15pctReturn)}倍，而本报告基准24倍。\nKe×g矩阵，今日美元/股：\n${sensitivity}\n所需资本系数1.0/1.3/1.5/1.7时，其他不变今日约${m.capitalSensitivity.slice(0,4).map(x=>F(x.todayValueBeforeFundingAdjustment)).join(' / ')}。c=2.0与2.2出现未融资缺口${F(m.capitalSensitivity[4].unfundedEquityNeed)}／${F(m.capitalSensitivity[5].unfundedEquityNeed)}百万，其融资前诊断值不能当已分配每股价值。\n联动压力：收入少20%且税前率低5个百分点，今日$${F(m.stresses.revenueMinus20MarginMinus5pp.primary.todayValue)}；未来新服务报酬高3个百分点$${F(m.stresses.futureServiceCompPlus3pp.primary.todayValue)}；正常税高5个百分点$${F(m.stresses.normalTaxPlus5pp.primary.todayValue)}；必要资本多25% $${F(m.stresses.requiredCapitalPlus25pct.primary.todayValue)}。这些路径资本检查通过，不代表最大损失。\n在悲观路径再发生税后现金信用/运营损失2,500百万，未融资权益需求${F(m.stresses.cashCreditOperationalLoss2500.unfundedEquityNeed)}百万。没有融资条款、缩表计划或可靠执行价格时，该压力的可投资每股价值为未知/null；绝不将融资前低价当便宜底线。严重法律、欺诈或流动性事故仍可导致全损。`},
 {title:'监管、利率与尾部风险：催化不等于价值',body:'CFTC支持联邦管辖与州实际限制同时成立。Michigan暂停体育合约安排延续至有关上诉解决，平台支持页还有其他州限制；管理层称Q3约30%事件活动非体育，仍需防主要流量受到州法、诉讼或税制影响。Rothera和第二交易所迁移可能提高净抽成，也增加利益冲突、技术与合规责任。[S1][S4][S7][S8][S9]\nRule605执行质量披露已于2026-08-01开始；tick-size/access-fee-cap实施延至2027年11月，不能写成当前已经生效。PFOF单价、价差、执行质量与做市商集中先影响经济性，全面禁令属于尾部而非已发生事实。[S1][S11][S12]\n官方静态±100bp敏感性约±366百万税前收入/利润/现金流，排除Cash Sweep且不含客户行为反应，不能机械当完整降息预测。抵押品下跌、卡贷款坏账、客户资金外流、隔离/清算要求提高与资产价格下跌可能共振。crypto托管、L2漏洞、token法律权利、宕机和跨境监管也不能用牌照数量抵消。\n正面催化是净入金在剔除政府/并购口径后持续、Gold与退休资产变成每股净利、Rothera路由和Chain净经济兑现、卡损失seasoning可控、监管争议收敛及净回购；负面催化是同一指标反转。11月11日Wolfe活动可留意产品/资本披露，但会议本身不创造价值。'},
 {title:'三档与40万美元：把风险预算落到金额与股数',body:`15%是研究回报门槛，不是用户已确认偏好。保守基准今日${F(m.purchase.referenceToday)}，2031 ${F(m.purchase.referenceYear5)}；回报买价上限=${F(m.purchase.referenceYear5)}/1.15^5=${F(m.purchase.maxByReturn)}。再与25%/35%/45%今日折让上限取低，按美分向下，三档严格不重叠；第三档下沿取保守今日价值约35%，低于该价先重做尽调。\n${entries.map((e,i)=>`${tiers[i]} ${F(e.low)}–${F(e.high)}；目标剩余${e.budgetSharePct}%=$${F(remaining*e.budgetSharePct/100)}；区间上沿最多${Math.floor(remaining*e.budgetSharePct/100/e.high)}股；若保守2031路径兑现，上沿五年年化${pct((m.purchase.referenceYear5/e.high)**.2-1)}。`).join('\n')}\n当前行动仍0新增，不是把这些资金立即投入或下单。各档须核信用vintage、州限制、资本需求和每股归属；不是只要跌价就安全。原手填68美元高于本轮观察上限，留作用户记录，报告不擅改它。未计手续费、税费、汇率和实际价差；整股预算尾款保留现金。`}
 ],
 invalidation:[
 '事件合约受到实质更多州/联邦限制、路由中断或净抽成恶化，不能用此前收入表直接外推；停用旧价表并重估。',
 '净流入主要由政府/并购/奖励而普通客户留存、Gold付费或交易客户恶化；下调有机增长与护城河判断。',
 '信用卡vintage、拖欠或拨备恶化，margin/清算抵押及融资需求高于预算，母公司资本或流动性无法合法调配；先处理生存性和资本缺口，不以融资前每股价加仓。',
 '未来新报酬、净稀释、税率或必要资本显著高于模型；可转债溢价超capped-call区间或对手方失效时重建完整现金/股数。',
 '内控、客户资产安全、清算或网络事故使财报/治理可靠性受损；可能永久亏损，低价不能代替恢复证据。'
 ],
 reviewTriggers:[
 '下两季2026Q4/2027Q1：核官方实际发布日期、净流入按政府/并购口径拆分、Gold付费、Funded Customers与ARPU分母；未公布日期不编造。若正常化流入同比下降且付费增长显著减弱，重估首年6,000百万。',
 '未来每季：期权下单用户继续同比下降超过10%且人均强度不再抵消，或交易单位收入继续受压，不能只用名义量增长确认盈利。',
 '信用卡：跟踪同vintage与90天以上拖欠；若past-due超过约8%、FICO<640超过7%或拨备/卡净利息持续上升，先下调利润并提高资本预算；这些为复核线，非违约预测。',
 '未来两季及2027：跟踪事件合约州限制、上诉终局、Rothera/OG路由迁移、净抽成和NCI；任何重要可服务州或产品减少都触发提前重估。',
 '2027年前后：核现金、隔离资产、贷款融资/ABS、监管资本与未来经济资本/收入；若接近c=2.0并出现资金缺口，当前三档失效，先重建融资或缩表路径。',
 '2027-11市场结构规则执行前及2029-10可转债偿本前：核实施变化、执行质量/PFOF价格和合法现金来源。分析截至时只列复核计划，未设置自动监控。'
 ],
 sources,
 figures:[
 {title:'五年与TTM净收入：收入增长不等于纯有机增长',unit:'百万美元',note:'FY2021–25与止2026-09-30 TTM；并购、政府账户和口径变化见正文。TTM非公司指引。[S1][S23][S24]',rows:[...f.annual.map(x=>({label:x.period,value:x.net_revenue})),{label:'TTM 2026Q3',value:f.ttm.net_revenue}]},
 {title:'Q3净收入构成：交易仍是主要引擎',unit:'百万美元',note:'互斥收入类别合计1,424；事件已含Rothera，crypto已含Chain净归属，不再叠加gross数据。[S1][S3]',rows:[{label:'期权',value:399},{label:'事件合约',value:173},{label:'股票',value:121},{label:'Crypto',value:120},{label:'其他交易',value:54},{label:'净利息',value:415},{label:'其他收入',value:142}]},
 {title:'费用化SBC：每股价值不能只看毛回购',unit:'百万美元',note:'2021含IPO确认，2023含创始人奖励取消485百万；并非全为持续年度新授予成本。资本化SBC另计。[S1][S23][S24]',rows:f.annual.map(x=>({label:x.period,value:x.SBC_expensed}))},
 {title:'Q3信用卡：净利息与拨备都在增长',unit:'百万美元',note:'仅比较两项财务数，不是完整卡业务分部利润；未含interchange、奖励、网络和运营成本，不简单称亏11百万。[S1]',rows:[{label:'卡净利息',value:50},{label:'卡信用损失拨备',value:61}]}
 ],
 modelEvidence:{authoritative:'hood-fcfe-evidence-model-2026-11-05.json',financial:'hood-financial-evidence-2026-11-05.json',business:'hood-business-risk-evidence-2026-11-05.json',
  audit:'hood-independent-fcfe-audit-2026-11-05.json',rejectedPrototype:'hood-prototype-rim-model-2026-11-05.json',
  units:'百万美元、百万股；正文数值按可读精度展示，原模型保留全精度。'},
 model:m
};
validateDecisionReport(r,{symbol:'HOOD'});
const serialized=JSON.stringify(r,null,2)+'\n';
if(serialized.includes('\uFFFD'))throw Error('Replacement character in report');
for(const s of r.sections)for(const match of s.body.matchAll(/\[S(\d+)\]/g))if(Number(match[1])>sources.length)throw Error('Broken source ID');
await fs.writeFile(new URL('hood-analysis-input-2026-11-05.json',dir),serialized);
const css=await fs.readFile(new URL('../../../server/decision-report.css',dir),'utf8');
const html=decisionReportHtml(r,css);
if(!html.includes('（Asia/Shanghai）')||html.includes('（Pacific/Auckland）'))throw Error('Wrong new-report timezone');
await fs.writeFile(new URL('hood-review-preview-2026-11-05.html',dir),html);
console.log(JSON.stringify({symbol:r.symbol,sections:r.sections.length,sources:sources.length,masters:r.masters.length,debates:r.debate.length,
 figures:r.figures.length+3,quote:r.quote,entryPlan:decisionEntryPlan(r),inputSha256:createHash('sha256').update(serialized).digest('hex')},null,2));
