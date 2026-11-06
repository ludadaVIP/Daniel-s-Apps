import fs from 'node:fs/promises';
import {validateDecisionReport} from '../../../src/decision-reports.js';
import {decisionReportHtml} from '../../../server/decision-report.js';
const dir=new URL('./',import.meta.url);
const r=JSON.parse(await fs.readFile(new URL('hood-analysis-input-2026-11-05.json',dir),'utf8'));
const m=r.model,b=m.paths.base;
delete r.model;
const money=x=>x.toFixed(2), annual=x=>((x/87.07)**.2*100-100).toFixed(1);
r.quote.price=87.07;r.quote.date='2026-11-05';
r.quote.note='实际TradingView BOATS页面：87.07美元，Market open，页面时钟2026-11-05 08:45:59 UTC（03:45:59 EST）。这是观察时间，不冒充最后成交时间。正式收盘87.41美元为11月4日16:00 EST，Moomoo交叉核对。报告报价独立，不更新用户持仓行情。[S27][S28]';
r.dataAsOf='2026-11-05 Asia/Shanghai；最新实绩2026Q3止9月30日，10月27日发布、28日申报；夜盘核验08:45:59 UTC。';
r.verdict={...r.verdict,
 stance:'观察，当前不新增',
 summary:'盈利平台已经形成，但87.07美元仍要求较长时间的高增长。交易周期、信用卡和预测市场监管叠加，当前不新增；等待估值与经营条件共同改善。',
 conclusion:`HOOD值得跟踪，当前不追买。Gold、资金流入与新产品证明成长潜力，但客户交易强度、贷款资本和州监管仍是关键风险。基准今日价值约24.24–54.97美元，两种方法分歧大，不能视作精确合理价；五年期末43.69／99.06美元，相对87.07美元年化约${annual(43.687212933277436)}%／${annual(99.06487995726472)}%。较高方法也不足15%研究回报门槛。`,
 confidence:'事实中高；估值中低，主要取决于资本效率与高增长持续期。',
 limitations:'七种公开理论的模拟，非大师本人观点。经济资本、未来利润率和倍数均是假设；母公司可分配现金未知，估值分歧大。未计税费、汇率，个人风险与流动性适配不完整。详细假设、融资压力与计算保留在独立底稿。'};
r.position.rationale='当前新增0%。经营与价格过关后，条件目标1%=$4,000，上限1.5%=$6,000。扣VOO间接敞口109.61美元、无已记录买单，剩余3,890.39美元按25%/35%/40%分档。极端全损对应目标仓位使组合损失约1%，不是风险上限保证。';
r.position.portfolioFit='无直接HOOD持股；VOO穿透109.61美元为保存快照。已有IBKR与指数中的金融/科技风险，HOOD并非对冲。66支上限不能同时买满；原手填68美元等待价及所有订单、持仓、行情保留。';
r.entries.forEach((e,i)=>e.condition=`上沿取基准今日24.2433美元的${[75,65,55][i]}%与五年43.6872/1.15^5之较低值；这是条件买价，不是预测会跌到这里。须核信用损失、监管与资本需求。${i===2?'低于8.49先重估，禁止机械补仓。':''}`);
const lens=[
 ['graham','格雷厄姆 · 安全边际','有盈利和净资产，不等于现价便宜。','归母权益100.01亿美元，集团现金并非全可分配。[S1]','现金加盈利是否足够支持高价？','现金、债务已在权益内，不能重复加减；保守价值仍需留折让。'],
 ['buffett','巴菲特 · 护城河','账户体验和跨产品黏性有价值，零佣金本身不是护城河。','Gold约520万、平台资产约3,960亿美元。[S1][S3]','会不会成为年轻人的默认金融入口？','有可能，乐观路径保留；需用客户留存、净利润和资本回报证实。'],
 ['munger','芒格 · 反向思考','最危险的是增长奖励掩盖信用与合规成本。','信用卡贷款扩大，奖励指标可调整计划外信用拨备；创始人控制投票。[S1][S5]','长期控制也有助于产品执行？','是，但仍须看GAAP损失、净稀释和客户资产安全，不能仅信增长指标。'],
 ['lynch','彼得·林奇 · 成长质量','成长平台与周期券商特征同时存在。','期权收入+31%，但用户-11%、每客合约+66%；crypto收入-55%。[S1]','新业务能否摆脱周期？','观察重复付费与资产留存，不能将更高周转率当更宽客户基础。'],
 ['dalio','达利欧 · 宏观传导','降息利好风险偏好，也会压缩利息收入。','官方静态100bp变化对应约3.66亿美元税前影响，不含全部客户行为。[S1]','交易量能抵消吗？','可能，但衰退时信用损失与抵押品下跌可同时发生，不能当天然对冲。'],
 ['soros','索罗斯 · 反身性','资产上涨、交易与获客可以互相强化，也会反转。','2029年可转债须现金偿还22亿美元本金，股价高不代表融资免费。[S1]','现金和融资渠道是否已足够？','当前主情景无需新增股本，但资本、调拨或信用恶化须联动重估。'],
 ['marks','马克斯 · 价格与回报','公司成功不保证当前股价回报好。',`较高基准五年价99.06，按87.07买入年化仅${annual(99.06487995726472)}%。`,'赢家可能长期享受高倍数？','承认错过上涨的代价，但不能把乐观情景当基准；本轮等待更好补偿。']
];
r.masters=lens.map(([id,name,judgment,evidence,challenge,response])=>({id,name,judgment,evidence,challenge,response}));
r.debate=[
 {question:'平台成长，还是交易周期？',bull:'Gold、退休资金、财富服务和全球产品扩大客户钱包份额。',bear:'交易仍占Q3收入约61%；老客交易更频繁，并不代表收入已稳定。',resolution:'成长值得认可，基准已给2031约109亿美元收入；更持久的高速成长留在乐观情景，不提前全额买单。'},
 {question:'预测市场能否成为稳定利润引擎？',bull:'自有交易所与CFTC支持联邦管辖，可能改善产品和单位经济性。',bear:'州限制仍有实际影响；体育合约与诉讼结果未确定。',resolution:'联邦支持不等于终局胜诉；跟踪可服务州、路由和净抽成，不能把173百万事件收入再加一遍Rothera的28百万。[S7][S8]'},
 {question:'为什么两种估值差这么多？',bull:'24倍正常化盈利可以为2031年后的平台增长留出空间。',bear:'现金流法扣增长资本并让增速衰减，高倍数可能透支持续期。',resolution:'24.24与54.97不是相互印证的窄区间。行动取较保守现金路径并留折让；基本面改善时重估，不固守旧低价。'}
];
r.sections=[
 {title:'1分钟看清公司',body:'业务：交易费用/返佣、净利息、Gold与平台服务。竞争优势在体验、品牌和跨产品整合，挑战是低价竞争、执行质量、信用与监管。\nQ3净收入14.24亿美元，同比增长12%；归母净利4.68亿美元、稀释EPS0.51。TTM净收入50.82亿美元、归母净利19.84亿美元。2023/2024/2025净收入18.65/29.51/44.73亿美元；2024税收收益、2025低税率不能永久外推。[S1][S23][S24]'},
 {title:'看增长，也看容易误读的数字',body:'Trump政府账户资金不等于公司收入或普通付费用户；Rothera已包含在事件收入中；Chain约5,000万美元毛链费、HOOD净归属约2,500万美元，不再另加到crypto收入。[S1][S3][S4]\nQ3信用卡净利息5,000万美元、拨备6,100万美元，缺其他收入和费用才能判断完整业务利润。9个月CFO39.83亿美元受客户资金与证券借贷影响，不能当股东自由现金。[S1]'},
 {title:'价值与五年潜力：两条可复算路线',body:`基准假设：首研究年净收入60亿美元，2031约109.43亿美元；25%正常税、含新员工报酬与信用成本，2031归母经济盈利34.82亿美元。\n①股东现金流法：盈利减新增必要权益资本。基准资本预算为收入1.5倍且不低于现有100.01亿美元；Ke12.5%、终值增长3%。前五年现金零息留存，今日24.24、2031为43.69美元。\n②盈利资本化：2031盈利×24倍，加单列留存现金，今日54.97、2031为99.06美元。两法同一权益分母约912.97百万份，现金/债务不重复计；权证采用固定87.33美元参照的净股储备近似。\n两法的高增长持续期不同，第二法不是确定目标。达到15%回报需基准2031盈利约44倍退出估值。终值约占现金流法今日价值58%，所需资本及长期利润仍不确定。详细年度输入、敏感性和稀释计算在模型附件，正文不重复铺陈。`},
 {title:'三档买价的含义与暂停条件',body:'买价由保守今日价值折让25%/35%/45%，并同时要求基准五年年化至少15%推导，不是股价预测。若信用损失、监管或必要资本恶化，价格表立即失效；低于第三档下沿须重新尽调。\n资本系数升到收入2倍的压力路径已有约3.82亿美元未融资需求；更严重信用/运营冲击可能需要融资或缩表，不能把融资前低估值当捡漏机会。'},
 {title:'接下来只看四件事',body:'未来两季：①剔除政府与并购口径后的净流入、Gold与客户留存；②期权交易用户与单位收入，而不只看名义量；③信用卡同批次拖欠和拨备、贷款与清算资本；④事件合约州限制、诉讼与净抽成。\n最可能的上行是客户资金持续迁入并形成高资本回报；主要下行是交易降温、信用/合规成本同时上升。2029现金偿债来源须提前核对，当前母公司可分配现金仍未知。'}
];
r.scenarios.forEach(s=>{const x=m.paths[s.id];s.assumptions=`2031收入${(x.rows[4].revenue/1000).toFixed(1)}十亿美元、经济归母盈利${(x.rows[4].parentEconomicEarnings/1000).toFixed(2)}十亿美元；Ke${(x.parameters.ke*100).toFixed(1)}%、g${(x.parameters.g*100).toFixed(1)}%。盈利法2031另为$${money(x.earningsMultiple.year5Price)}。均为条件情景，无概率或保证。`;});
r.invalidation=['客户留存、信用质量、监管可服务市场或资本需求明显恶化：停用旧买价，重新估值。','母公司现金调拨、2029偿债或额外股本融资出现实质问题：先核资金与稀释，不机械加仓。'];
r.reviewTriggers=['下两季复核净流入/Gold、交易客户与单位收入、卡贷款拖欠及资本需求、事件市场监管四项。','任何新增重大融资、净稀释或监管限制均触发提前复核；尚未设置自动监控。'];
r.figures=[r.figures[1]];
const selected=[1,2,3,4,5,7,8,23,24,27,28];
const map=new Map(selected.map((old,i)=>[old,i+1]));
r.sources=selected.map(old=>r.sources[old-1]);
function remap(v){if(typeof v==='string')return v.replace(/\[S(\d+)\]/g,(_,n)=>map.has(+n)?`[S${map.get(+n)}]`:'');if(Array.isArray(v))return v.map(remap);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,remap(x)]));return v;}
const portfolio=JSON.parse((await fs.readFile(new URL('hood-portfolio-context-2026-11-05.json',dir),'utf8')).replace(/^\uFEFF/,''));
r.position.existingExposureUsd=portfolio.company.value;r.position.pendingBuyUsd=portfolio.pendingKnownLimitBuyUsd;
const remaining=4000-portfolio.company.value-portfolio.pendingKnownLimitBuyUsd;
const final=JSON.parse(JSON.stringify(remap(r)).replaceAll('109.61',portfolio.company.value.toFixed(2)).replaceAll('3,890.39',remaining.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})));
validateDecisionReport(final,{symbol:'HOOD'});
await fs.writeFile(new URL('hood-concise-input-2026-11-05.json',dir),JSON.stringify(final,null,2)+'\n');
const css=await fs.readFile(new URL('../../../server/decision-report.css',dir),'utf8');
await fs.writeFile(new URL('hood-concise-preview-2026-11-05.html',dir),decisionReportHtml(final,css));
console.log(JSON.stringify({summary:final.verdict.conclusion,masters:7,debates:3,sections:5,sources:11,approxChineseChars:JSON.stringify(final).match(/[\u4e00-\u9fff]/g).length}));
