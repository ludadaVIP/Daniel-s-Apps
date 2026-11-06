import fs from 'node:fs/promises';
import {validateDecisionReport,decisionEntryPlan} from '../../../src/decision-reports.js';
const dir=new URL('./',import.meta.url),read=async n=>JSON.parse((await fs.readFile(new URL(n,dir),'utf8')).replace(/^\uFEFF/,''));
const m=await read('spgi-model-2026-11-05.json'),p=await read('spgi-portfolio-context-2026-11-05.json'),b=m.scenarios.base;
const F=x=>x.toFixed(2),P=x=>(x*100).toFixed(1)+'%',remaining=10000-p.company.value-p.pendingKnownLimitBuyUsd;
const names=['小仓观察','安全边际','折价'];
const lens=[
 ['graham','格雷厄姆 · 购买价','现金盈利扎实，价格仍须留容错。','9月债务130.62亿美元，商誉与无形资产395.31亿美元，账面不构成清算底价。[S1]','好生意是否值得高价？','可以付质量溢价，但不能把债务和商誉忽略；条件入场仍取保守端。'],
 ['buffett','巴菲特 · 护城河','评级信誉、指数标准及嵌入工作流的数据是强资产。','前三季评级/指数外部收入37.73/15.97亿美元，订阅收入占集团45%。[S1]','AI是否使数据免费？','标准、版权与数据准确性仍有价值，但终端席位和分发方式须重新验证，不能全公司一概而论。'],
 ['munger','芒格 · 反向思考','最大的错是把分拆与处置收益当持续增长。','Mobility已分拆；Q3能源业务处置带来税前2亿美元收益。[S1][S2]','精简组合也能提升价值？','是，但出售价格、税费和剩余协同尚未知，先不虚构交易收益。'],
 ['lynch','彼得·林奇 · 成长来源','属于高质量稳健成长，兼具发债周期。','Q3收入+7%、调整EPS+9%；GAAP持续经营EPS+26%有处置及股数因素。[S2]','回购能否带来更快每股增长？','能，但须由现金和价格支持；本模型不额外叠加未来回购收益。'],
 ['dalio','达利欧 · 周期与利率','利率通过发债、资产估值与再融资影响业务。','评级发行收入、指数资产挂钩费与订阅的周期敏感度不同；短债24.48亿美元。[S1]','降息是不是全利好？','通常帮助发债和估值，衰退也会压需求；需合并看发行量、资产价格及信用利差。'],
 ['soros','索罗斯 · 反身性','市场上涨推动指数收费和评级需求，反馈也会反转。','Q3资产挂钩收费3.75亿美元，同比增长24%。[S1]','这种规模效应不值得长期高倍数吗？','值得研究，但不能把强市场季度永久化；战略审查也不能直接当高价收购要约。'],
 ['marks','马克斯 · 风险补偿','质量明显强于普通数据商，但现价并不保证好回报。',`基准盈利法含股息五年IRR约${P(b.earningsIrr)}，未达12%研究门槛。`,'会不会因等便宜而错过复利？','可能；本轮接受机会成本，未来现金兑现若更强就重估，而不是追随目标价。']
];
const r={version:1,symbol:'SPGI',name:'S&P Global Inc. · 标普全球',exchange:'NYSE · 普通股',currency:'USD',capitalUsd:400000,horizonYears:5,
 analysisDate:'2026-11-05',analysisTimeZone:'Asia/Shanghai',financialPeriod:'2026Q3及9M持续经营（止2026-09-30）；Mobility已列停业业务',
 dataAsOf:'2026-11-05 Asia/Shanghai；Q3于10月27日发布及10-Q签署；Moomoo盘前报价11月5日04:32 EST，读取09:34 UTC附近。',
 quote:{price:485,date:'2026-11-05',type:'盘前页面快照',source:'Moomoo实际页面；官方IR交叉核对前日收盘',sourceUrl:'https://www.moomoo.com/hans/stock/SPGI-US',note:'Moomoo实际页面显示485.000美元、盘前04:32美东（09:32 UTC），读取09:34 UTC附近。正式收盘481.69为11月4日16:00 EST，官方IR历史表一致；不是把收盘当实时。盘前流动性/价差可能不同，不覆盖应用保存行情。[S4][S5]'},
 verdict:{stance:'优质公司，当前观察不新增',summary:'评级和指数护城河强，但485美元已计入持续增长。Mobility分拆与Capital IQ战略审查需要区分口径。当前不新增；等待价格或现金兑现改善。',
 conclusion:`SPGI适合长期跟踪，但当前不追买。基准今日现金流法$${F(b.todayValue)}、盈利法$${F(b.earningsToday)}；2031两法$${F(b.year5Price)}／$${F(b.earningsYear5)}，含模型股息五年IRR约${P(b.irr)}／${P(b.earningsIrr)}。差距反映资本回报和增长持续期，不是精确合理价。当前新增0%，三档为条件复核区间，不预测股价必跌到那里。`,
 confidence:'经营质量中高；估值中等，AI分发与战略审查结果仍不确定。',valueLow:b.todayValue,valueHigh:b.earningsToday,
 limitations:'七种公开理论模拟，非本人观点。资本审查尚无确定交易，未计出售所得。现金流年度化、正常利润、倍数和未来分配均是假设；母公司现金调拨与少数股东赎回可能改变资本需求。未计税费汇率，个人回撤与流动性适配不完整。'},
 position:{targetPct:2.5,maxPct:4,currentAdditionalPct:0,existingExposureUsd:p.company.value,pendingBuyUsd:p.pendingKnownLimitBuyUsd,
 rationale:`条件目标2.5%=$10,000，上限4%=$16,000；当前新增0%。扣现有公司敞口$${F(p.company.value)}和买单$${F(p.pendingKnownLimitBuyUsd)}，剩余$${F(remaining)}分25%/35%/40%。稳定现金与较强护城河支持较高于投机成长股的研究预算，但4%全损仍会损失组合4%，并非低风险保证。`,
 portfolioFit:'无直接SPGI持股，已有VOO穿透，成分止2026-09-30；金额为保存快照。指数/大科技资产价格与发债周期有共同风险，不能将全部66支上限同时买满。保留用户手填400美元等待价、持仓、委托、日志与旧研究。'},
 entries:m.entries.map((e,i)=>({...e,low:+F(e.low),condition:`上沿=min(保守今日${F(m.reference)}×${[85,75,65][i]}%，基准五年价格及逐年股息按12%折现的买价上限${F(m.maxByReturn)})。先核订阅留存、评级发行、AI收入和战略审查。${i===2?'低于152.41美元须重做尽调，禁止机械补仓。':'经营恶化时旧价格表失效。'}`})),
 scenarios:['bear','base','bull'].map((id,i)=>{const x=m.scenarios[id];return {id,label:['悲观：周期与数据压力','基准：稳健增长','乐观：指数与数据扩张'][i],todayValue:x.todayValue,year5Price:x.year5Price,assumptions:`首年股东经济现金${x.parameters.cash1/1000}十亿美元，Ke${P(x.parameters.ke)}、终值g${P(x.parameters.g)}；首年正常EPS${x.parameters.eps1}，盈利法2031另为$${F(x.earningsYear5)}。含股息IRR分别${P(x.irr)}／${P(x.earningsIrr)}；上方自动价格年化未含股息。`};}),
 masters:lens.map(([id,name,judgment,evidence,challenge,response])=>({id,name,judgment,evidence,challenge,response})),
 debate:[
 {question:'AI会侵蚀数据护城河，还是扩大授权收入？',bull:'客户仍需准确、有版权的数据，AI可以扩大使用量与分发渠道。',bear:'搜索和分析界面可能被替代，席位定价与客户预算受压。',resolution:'评级标准、指数许可和数据终端分开估。认可订阅增长，不预设所有AI使用都转成更高净收入。'},
 {question:'分拆和战略审查一定释放价值吗？',bull:'聚焦评级、指数等核心业务可改善投入效率与定价。',bear:'剥离也会失去现金与协同，交易税费、条款和价格未定。',resolution:'Mobility自7月起已停业列报，不再加回其利润；Capital IQ尚无确定交易，估值不先计虚构出售所得。[S1][S2]'},
 {question:'应该为优质复利股付多少？',bull:'稳定现金、少数竞争者和指数规模效应可支持高倍数。',bear:'当前约27倍全年调整EPS，回购价高、现金增长放缓时回报可能落后公司增长。',resolution:'两法并列，基准较高方法含股息仍约8.4%年化；按12%研究门槛与安全边际设置条件价，不把公司好等同于现在就买。'}
 ],
 sections:[
 {title:'先看懂现在：四种业务，不是买指数本身',body:'SPGI靠信用评级、指数许可、能源/商品基准和金融数据工作流收费。品牌标准、监管认可、数据版权与客户集成带来壁垒；评级与Moody’s/Fitch竞争，数据与Bloomberg/LSEG等竞争，指数与MSCI/FTSE Russell竞争。它收入受市场影响，并非持有S&P500成分股的基金。\n前三季外部收入：评级37.73、指数15.97、能源19.92、Market Intelligence37.12亿美元；集团订阅占45%。9月后公司只剩分拆后的口径，不能拿旧汽车业务收入一起估值。[S1][S3]'},
 {title:'财务质量：盈利与现金都强，也有调整项',body:'Q3收入36.78亿美元、+7%；持续经营归母净利12.98亿美元、EPS4.45，含能源处置收益；若含停业业务，当季归母总净利为12.40亿美元，不能混用。调整EPS4.58、+9%，公司全年持续经营指引17.70–17.95并非已实现利润。[S2]\n前三季持续经营CFO36.61−CapEx0.93−少数股东现金2.69=公司FCF32.99亿美元；费用化SBC1.27亿美元仍是经济成本。简单年度化扣SBC代理约42.29亿美元，不当全年指引。债务130.62、现金24.41亿美元，约24.48亿美元一年内到期；回购4.1十亿美元不能只看股数下降、不看资金来源。[S1]'},
 {title:'估值与未来五年：约2分钟的计算解释',body:`现金流法以首年股东经济现金40/46/50亿美元起步，已扣利息、维护/增长净投入、少数归属与SBC经济成本；基准随后增长9%/9%/8%/8%，之后逐步降至4%。首年46亿比扣SBC的年度化代理约高9%，是预测。用292百万份固定权益缓冲而非289.9百万基本股，未来不再叠加回购收益或免费股权薪酬。债务假设按大致不变成本再融资，不能再全额减一次债务。[S1]\n基准Ke9.5%、终值g3%；前五年模型股息每年以现有3.88美元年率增长7%，剩余现金零息留存一次计入2031价格；经营资本与初始现金不额外加值。2031现金流价${F(b.year5Price)}，逐年股息加期末价折现得今日${F(b.todayValue)}美元，终值现值约占59%。\n独立盈利法用首年正常EPS18.5、后四年每股增长8%，2031 EPS${F(b.eps5)}×25倍，加不产生收益的同一留存现金，得${F(b.earningsYear5)}美元，今日${F(b.earningsToday)}。25倍是研究倍数，不冒充同日同行实测。\n以485买入，含逐年股息IRR约−0.4%／8.4%，不是把价格涨幅除以5。悲观至乐观见情景表；两法分歧大，不平均成确定目标。完整逐年现金、股息、敏感性保留模型附件。`},
 {title:'风险、反推与三档依据',body:`保持基准增长、利润与资本成本，要由现金流法支持485美元，首年经济股东现金须约${(m.reverseOwnerCash1/1000).toFixed(2)}十亿美元，明显高于46亿基准；这是固定路线的单变量反推，并非市场唯一预测。基准Ke8.5%/9.5%/10.5%、g固定3%时今日约${m.sensitivity.map(x=>F(x.values[1].value)).join('/')}美元。\n观察/安全/折价上限同时要求保守今日价值折让15%/25%/35%及含股息12%研究回报，三档互不重叠，目标资金仅在单股预算内分配。不是承诺会跌到这些价，原400美元手填计划保留。\n若评级发行与指数资产挂钩费同时回落、数据续费/AI授权变差，或借款再融资/少数股东赎回导致资金不足，先下调价值，禁止只因跌价买入。27%指数合资少数权益带赎回权，53.48亿美元赎回权益不是免费资本；公司现金流已扣少数分配，也不重复全额减它。[S1]`},
 {title:'未来只盯四个信号',body:'①评级发行量与非交易收入，识别周期高点；②订阅增长、续费和AI数据授权单价；③指数资产挂钩/许可收费和少数权益；④Capital IQ审查范围、税费与真实出售条款。公司尚未保证任何审查结果。管理层组合调整能力要以持续每股现金衡量，不以出售公告或调整EPS单独打分。\n上行来自评级与指数长期扩张、数据权利变现和合理回购；下行来自AI削弱定价、发债周期反转、诉讼监管及高价回购。公司可很好，股票仍可能因购买价太高而回报一般。'}
 ],
 invalidation:['AI/数据续费、评级发行或指数经济性显著弱于模型，暂停旧价表并重估。','再融资、资本配置或少数权益赎回产生资金缺口，先联动现金与股数，不拿融资前价格作买点。'],
 reviewTriggers:['未来两季核持续经营收入与现金、订阅/AI授权、评级发行和指数收费；不得混回Mobility。','Capital IQ任何实质交易条款、重大并购、债务或少数权益赎回发生时立即复核；未设置自动监控。'],
 figures:[{title:'前三季外部收入：四个不同的盈利引擎',unit:'百万美元',note:'止2026-09-30，剔除内部收入及Mobility停业业务；不是各分部利润。[S1]',rows:[{label:'评级',value:3773},{label:'指数',value:1597},{label:'能源',value:1992},{label:'金融信息',value:3712}]}],
 sources:[
 {label:'[S1] 2026Q3 10-Q：持续经营、现金、债务和权益',url:'https://www.sec.gov/Archives/edgar/data/64040/000006404026000058/spgi-20260930.htm',date:'报告期2026-09-30；签署2026-10-27；访问11-05'},
 {label:'[S2] 官方Q3业绩稿与全年指引',url:'https://www.sec.gov/Archives/edgar/data/64040/000006404026000053/spgi3q2026-earningsrelease.htm',date:'2026-10-27；访问11-05'},
 {label:'[S3] FY2025 10-K：业务、风险、治理及历史口径',url:'https://www.sec.gov/Archives/edgar/data/64040/000006404026000013/spgi-20251231.htm',date:'FY2025；2026-02申报；访问11-05'},
 {label:'[S4] Moomoo实际盘前页面',url:'https://www.moomoo.com/hans/stock/SPGI-US',date:'2026-11-05 04:32 EST报价，09:34 UTC附近读取'},
 {label:'[S5] 公司IR历史收盘交叉核对',url:'https://investor.spglobal.com/stock-dividends/stock-quote/default.aspx',date:'11月4日收盘481.69；访问11-05'}],
 modelEvidence:{file:'spgi-model-2026-11-05.json',script:'spgi-build-model-2026-11-05.mjs',assumptions:'正文为精华，逐年输入与计算单独留档。'}
};
r.sections[2].body=`现金流法：首年股东经济现金40/46/50亿美元（含利息、净再投资、少数分配与SBC成本）。基准46亿较扣SBC年度化代理高约9%；后增9%/9%/8%/8%，再衰减至4%。Ke9.5%、终值g3%，终值约占59%。\n固定292百万份作稀释缓冲，不再叠加回购收益。债务按大致不变成本再融资，不二次减债；公司真实分配可能不同。前五年股息从现有年率3.88美元按7%增长，剩余现金零息留存，2031加一次，不额外加初始现金。\n盈利法：首年正常EPS18.5、后增8%，2031 EPS${F(b.eps5)}×25倍，加同一留存现金。25倍为研究倍数，非同日同行实测。较高方法仍需更长成长持续期，两法不平均作确定价值。含股息回报用逐年现金求IRR，不把累计涨幅除以5。完整年度数与分红假设保留附件。`;
validateDecisionReport(r,{symbol:'SPGI'});
await fs.writeFile(new URL('spgi-analysis-input-2026-11-05.json',dir),JSON.stringify(r,null,2)+'\n');
console.log(JSON.stringify({conclusion:r.verdict.conclusion,plan:decisionEntryPlan(r),chineseChars:JSON.stringify(r).match(/[\u4e00-\u9fff]/g).length},null,2));
