import fs from 'node:fs/promises';
import {validateDecisionReport,decisionEntryPlan} from '../../../src/decision-reports.js';
const dir=new URL('./',import.meta.url),read=async n=>JSON.parse((await fs.readFile(new URL(n,dir),'utf8')).replace(/^\uFEFF/,''));
const m=await read('vst-model-2026-11-05.json'),p=await read('vst-portfolio-context-2026-11-05.json'),b=m.scenarios.base;
const F=x=>x.toFixed(2),P=x=>(100*x).toFixed(1)+'%';
const lenses=[
 ['graham','格雷厄姆 · 安全边际','跌幅不是安全边际。','6月债务195.95亿美元，现金4.35亿，不能用账面资产当清算底价。[S1]','现金盈利增长足以消化杠杆吗？','可能，但须买价和流动性一起留余地。'],
 ['buffett','巴菲特 · 稀缺资产','现有核电、并网与零售客户构成壁垒。','Meta签20年购电协议，涉及2176MW现有电力及433MW增容。[S3]','电厂是否等于定价权？','不等于；竞争电价、监管与燃料成本限制定价，不能套纯公用事业稳定倍数。'],
 ['munger','芒格 · 反向思考','避免把贷款、回购与调整现金同时当收益。','DOE42亿美元仅为附条件贷款；Helix初始承诺5亿、另5亿附条件。[S1][S7]','这些投入会创造价值吗？','会有机会，但只有增量每股现金超过资本成本才算，不能先把全部承诺变利润。'],
 ['lynch','彼得·林奇 · 成长核验','需求增长真实，兑现有时间差。','Q2持续业务调整EBITDA17.67亿美元、增长超过30%；核电增容预计2031才部分交付。[S2][S3]','是否会错过重估？','可以错过一段涨幅；先核收购每股增厚与真实资本开支。'],
 ['dalio','达利欧 · 周期','电价、天气和利率能同时打击杠杆。','8月口径2027/2028预计发电量约94%/72%已对冲。[S2]','对冲是否消除风险？','锁定部分价格，也限制近期上涨收益；停机、保证金及到期后重定价仍在。'],
 ['soros','索罗斯 · 反身性','AI供电叙事有真合同，也有估值反馈。','Cogentrix已交割，资金投入与新增股份先发生；新增需求不等于即期盈利。[S4][S5]','恐慌下跌是否就是机会？','需要合同兑现与现金支持。市场情绪不能替代发电、输电和审批进度。'],
 ['marks','马克斯 · 风险补偿','要求回报应高于稳定消费股。',`120.39美元下基准含股息IRR约${P(b.irr)}／${P(b.evIrr)}，悲观现金流法2031仅85.34美元。`,'高方法接近15%是否可买？','低方法未通过且明日财报临近，当前不新增，预算留给有余地的价格。']
];
const r={version:1,symbol:'VST',name:'Vistra Corp. · 维斯特拉',exchange:'NYSE · 普通股',currency:'USD',capitalUsd:400000,horizonYears:5,analysisDate:'2026-11-05',analysisTimeZone:'Asia/Shanghai',financialPeriod:'2026Q2/6M，止2026-06-30；8月7日发布；Q3尚未公布',dataAsOf:'核验截至2026-11-05约09:55 UTC；已纳入10月30日收购完成、10月优先股赎回及DOE条件承诺。',
 quote:{price:120.39,date:'2026-11-05',type:'盘前页面快照',source:'Moomoo实际页面',sourceUrl:'https://www.moomoo.com/hans/stock/VST-US',note:'页面盘前120.390美元，11月5日04:50 EST=09:50 UTC附近读取；前日16:00 EST收盘120.29，跌13.83%。盘前价差与流动性不同，不覆盖用户行情。[S9]'},
 verdict:{stance:'有潜力，当前等待财报与安全边际',summary:'现有核电、天然气和长期购电合同提供真实增长，但杠杆、资本开支与政策会放大损失。120.39美元并非明显便宜；当前新增0%，明日财报后重新核对再考虑条件价。',conclusion:`基准今日DCF$${F(b.dcf0)}、企业倍数法$${F(b.ev0)}；2031分别$${F(b.dcf5)}／$${F(b.ev5)}，含模型股息五年年化${P(b.irr)}／${P(b.evIrr)}。价格已明显回落，但两法分歧与交割后负债缺口使其仍不适合抢跑。条件目标1.5%，当前新增0%；所有档位须先复核11月6日财报。`,confidence:'中等偏低：长期供电逻辑较清楚，交割后完整资产负债表与新增资本投入尚缺。',valueLow:b.dcf0,valueHigh:b.ev0,limitations:'按七种公开理论模拟，非大师本人意见。股价可能继续下跌；未来现金、倍数、资金桥均为假设。Q3未公布、交割真值待核，个人回撤容忍和税务适配不完整；无保证收益。'},
 position:{targetPct:1.5,maxPct:2.5,currentAdditionalPct:0,existingExposureUsd:p.company.value,pendingBuyUsd:p.pendingKnownLimitBuyUsd,rationale:`条件目标1.5%=$6,000，上限2.5%=$10,000。扣VOO穿透$${F(p.company.value)}及本地买单$${F(p.pendingKnownLimitBuyUsd)}，剩余$${F(6000-p.company.value-p.pendingKnownLimitBuyUsd)}分25%/35%/40%。若目标仓位股价下跌50%，约损失组合0.75%；极端全损1.5%，不是风险上限保证。`,portfolioFit:'无直接VST或本地待成交买单；VOO成分止9月30日，穿透为保存快照。已有科技/半导体资产与AI数据中心需求同向，电力股并非完全分散。66支目标不能同时买满；保留手填115美元计划。'},
 entries:m.entries.map((e,i)=>({...e,condition:`上沿取保守今日价值×${[85,75,65][i]}%与含模型股息15%回报买价上限$${F(m.maxReturn)}中较低者。11月6日财报后确认收购负债、现金转化与增长支出。${i===2?`低于${F(m.entries[2].low)}美元重新尽调，不自动加仓。`:'若现金或监管恶化，旧价表失效。'}`})),
 scenarios:['bear','base','bull'].map((id,i)=>{const x=m.scenarios[id];return {id,label:['悲观：电价与投入压力','基准：收购及合同稳步兑现','乐观：电力稀缺持续'][i],todayValue:x.dcf0,year5Price:x.dcf5,assumptions:`首年普通股经济现金${x.parameters.cash1/1000}十亿美元，Ke${P(x.parameters.ke)}、终值g${P(x.parameters.g)}，固定350百万股；企业倍数法今日$${F(x.ev0)}、2031$${F(x.ev5)}；两法含股息IRR${P(x.irr)}／${P(x.evIrr)}。自动价格回报图不含股息。`};}),
 masters:lenses.map(([id,name,judgment,evidence,challenge,response])=>({id,name,judgment,evidence,challenge,response})),
 debate:[
 {question:'AI核电需求值得付多少溢价？',bull:'巴菲特/林奇：已有机组与并网稀缺，长期PPA降低需求不确定性。',bear:'格雷厄姆/马克斯：新增MW要先投钱，监管和工期可能延后，不能用2034完整收益算2027。',resolution:'认可合同，基准不单独叠加Meta全部增厚；433MW预计2031起部分交付、2034全部交付，纳入净现金增长而非提前一次兑现。[S3]'},
 {question:'收购和回购会不会让每股价值加速？',bull:'林奇：Cogentrix扩大高需求地区供电，管理层预期增厚每股现金。',bear:'芒格：23亿现金、约15亿承接债和500万新股都要付；7亿税收好处不是交割现金。',resolution:'分别处理现金、债与股份；固定350百万权益，不再叠加未来回购收益，先看实际交割桥与资本回报。[S4][S5]'},
 {question:'暴跌后该不该提前押明日财报？',bull:'索罗斯：情绪反转可能很快，较高估值法显示潜力。',bear:'达利欧/马克斯：对冲、债务与新资本支出会使好消息未必转成可分配现金。',resolution:'当前新增0%。用两法保守端及15%研究门槛设置价格；财报改变现金或股数时，先重估再挂条件单。'}],
 sections:[
 {title:'公司靠什么赚钱，壁垒在哪里',body:'Vistra用核电、天然气、煤电等发电资产与零售电力客户组合赚钱；是竞争性电力商，利润受电价、燃料价差、容量市场和天气影响。护城河在已建成机组、并网、运营与客户规模；对手有Constellation、NRG、Talen及其他供电资源，储能/新增供给也会改变稀缺性。\nCogentrix10月30日完成，约5500MW使总组合接近50000MW。规模有利于供电，却不保证高回报；未来关键是可持续每股现金，而不是AI合作公告数量。[S4]'},
 {title:'财务：不要把调整现金当普通股现金',body:'Q2收入40.17亿美元，归母净利3.05亿、扣优先股后普通股2.58亿；净利含4.72亿未实现对冲损失，不应简单年化。半年CFO22.22亿−包含核燃料等CapEx15.72亿=6.50亿，尚未扣优先分红、经济SBC等。[S1]\n公司全年持续业务调整EBITDA指引68–76亿，增长前FCF39.25–47.25亿。后者排除增长投入、营运资本/保证金变化等，不能全部当股东可拿走的钱；Helix承诺及Moss Landing事故/退役义务也需资金。[S1][S2]'},
 {title:'两种估值：今日价值与2031价格分开',body:`DCF首年普通股经济现金29.3亿美元：研究EBITDA81.5亿−利息14−税3−维护/核燃料21.5−增长投入8−Helix2−关闭等1−优先分红1.2−经济SBC1.5，单位均为亿美元。81.5亿由原2027机会中点76亿+Cogentrix约5.5亿组成；机会值不是公司正式指引，整座现金桥是预测。[S2][S5]\n固定350百万股：约336百万现股+500万收购股+约900万缓冲；不免费叠加回购。基准现金后增7%/7%/6%/5%，再衰减至3%；Ke11%、终值g2.5%。前五年股息从年率0.924按5%增长，剩余现金零息留存、2031加一次，终值现值占约50%。\n独立EV法：2027 EBITDA81.5亿×10倍，减融资净索取权248.11亿及剩余优先股14.76亿，再除350百万股，得今日${F(b.ev0)}美元；2031 EBITDA按4.5%增四年、用9.5倍，加同一留存现金一次，得${F(b.ev5)}。倍数是研究假设，非同行同日实测。DCF已扣利息和优先分红，不再减一次债。`},
 {title:'融资缺口、反推与买价依据',body:`248.11亿是保守资金代理，并非11月实报：6月债195.95亿+应收融资3亿+关联保证金融资4.38亿+剩余收购付款6.13亿−现金4.35亿，再加Cogentrix现金23亿和承债15亿、新次级债15亿，减已赎回A优先股10亿。没有把7亿税益加成现金；Q3经营现金、回购、交割调整尚待核，会改变桥。[S1][S5][S6]\nDOE42亿美元仅有条件贷款，未计免费资产或已提款债务。剩余B/C优先股约14.76亿美元另计；核退役信托不能当自由现金。[S7]\n支持120.39美元，固定基准增长/资本成本须首年经济现金约${F(m.reverseCash1/1000)}十亿美元；Ke10%/11%/12%、g2.5%时今日约${m.sensitivity.map(x=>F(x.values[1].value)).join('/')}美元。三档上沿兼顾保守价值折让15%/25%/35%及15%回报要求；观察上沿因回报约束降至${F(m.entries[0].high)}。`},
 {title:'最可能亏钱的路径与复核',body:'主要风险：①电价/容量收费或AI用电需求不及预期；②核电停机、燃料、极端天气及Moss Landing责任；③利率、保证金和短期付款挤压流动性；④并购与增容超支、审批延迟；⑤监管限制电价/并网、社区对数据中心负担的反对。对冲降低部分短期波动，也会延迟高电价收益。\n明日11月6日业绩会先核现金、收购融资和2027口径，再核Meta交付、Helix资金调用与维护/增长支出。若首年普通股经济现金降至22亿美元附近，悲观DCF今日仅50.04、2031为85.34；不能只因跌进档位就继续买。[S8]'}],
 invalidation:['财报显示普通股经济现金接近22亿美元悲观档，或融资/保证金出现缺口，暂停三档、联动下调价值与仓位。','核电/PPA工期或监管明显改变、重大事故责任增加，重做现金桥；低于折价下沿不机械补仓。'],reviewTriggers:['11月6日2026Q3财报及电话会（10:00 ET）；核实际现金、资本开支、2027指引与已交割负债。','后续核Meta现有电量2027年底全交付、增容2031/2034节奏及DOE融资条件；此报告不等于已设置自动监控。'],
 figures:[{title:'2026全年公司指引：非普通股可分配现金',unit:'百万美元',note:'8月7日重申，非已实现；增长前FCF排除项见正文。[S2]',rows:[{label:'调整EBITDA下沿',value:6800},{label:'调整EBITDA上沿',value:7600},{label:'增长前FCF下沿',value:3925},{label:'增长前FCF上沿',value:4725}]}],
 sources:[
 {label:'[S1] Q2 10-Q：财务、风险、股份、资金义务',url:'https://www.sec.gov/Archives/edgar/data/1692819/000169281926000019/vistra-20260630.htm',date:'止6月30日；2026-08-07申报；11-05访问'},
 {label:'[S2] 官方Q2业绩、指引与对冲',url:'https://www.sec.gov/Archives/edgar/data/1692819/000169281926000017/vistra-20260630xearningsre.htm',date:'2026-08-07；11-05访问'},
 {label:'[S3] Meta PPA监管披露：时间及资本支出',url:'https://www.sec.gov/Archives/edgar/data/1692819/000119312526008508/d20785d8k.htm',date:'2026-01-09；11-05访问'},
 {label:'[S4] Cogentrix完成交割',url:'https://investor.vistracorp.com/2026-10-30-Vistra-Completes-Acquisition-of-Cogentrix-Energy,-Expanding-Diverse-Generation-Fleet',date:'2026-10-30；11-05访问'},
 {label:'[S5] Cogentrix原始对价与税收好处',url:'https://investor.vistracorp.com/2026-01-05-Vistra-Adds-to-its-Industry-Leading-Generation-Portfolio-with-Acquisition-of-Cogentrix',date:'2026-01-05；交割调整待核；11-05访问'},
 {label:'[S6] 新15亿美元次级债及优先股再融资',url:'https://investor.vistracorp.com/2026-09-10-Vistra-Prices-Registered-Offering-of-1-5-Billion-of-Junior-Subordinated-Notes',date:'2026-09-10定价；11-05访问'},
 {label:'[S6a] A优先股10亿美元赎回',url:'https://investor.vistracorp.com/2026-10-15-Vistra-Announces-Redemption-of-All-Outstanding-Series-A-Preferred-Stock',date:'2026-10-15；11-05访问'},
 {label:'[S7] DOE有条件贷款承诺及提款条件',url:'https://www.energy.gov/articles/energy-department-announces-42-billion-investment-boost-nuclear-power-and-help-lower',date:'2026-10-05；11-05访问'},
 {label:'[S8] Q3发布时间官方公告',url:'https://investor.vistracorp.com/2026-09-29-Vistra-to-Report-Third-Quarter-Results-on-Nov-6,-2026',date:'9月29日公告；财报11月6日；11-05访问'},
 {label:'[S9] Moomoo实际报价页',url:'https://www.moomoo.com/hans/stock/VST-US',date:'11-05盘前04:50 EST快照，读取约09:50 UTC'},
 {label:'[S10] 公司IR：10月29日股息0.231美元',url:'https://investor.vistracorp.com/',date:'11-05访问首页最新公告摘要'}],
 modelEvidence:{file:'vst-model-2026-11-05.json',script:'vst-build-model-2026-11-05.mjs',note:'原始数据及逐年情景单独保存；所有交易桥均标注估算，未冒充交割实报。'}
};
validateDecisionReport(r,{symbol:'VST'});
await fs.writeFile(new URL('vst-analysis-input-2026-11-05.json',dir),JSON.stringify(r,null,2)+'\n');
console.log(JSON.stringify({conclusion:r.verdict.conclusion,plan:decisionEntryPlan(r),chineseChars:JSON.stringify(r).match(/[\u4e00-\u9fff]/g).length},null,2));
