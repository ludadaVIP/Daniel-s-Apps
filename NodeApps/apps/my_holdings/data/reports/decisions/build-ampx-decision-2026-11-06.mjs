import fs from 'node:fs/promises';
import {validateDecisionReport,decisionEntryPlan} from '../../../src/decision-reports.js';
const dir=new URL('./',import.meta.url),read=async n=>JSON.parse((await fs.readFile(new URL(n,dir),'utf8')).replace(/^\uFEFF/,''));
const m=await read('ampx-model-2026-11-05.json'),p=await read('ampx-portfolio-context-2026-11-05.json'),b=m.scenarios.base,F=x=>x.toFixed(2),P=x=>(100*x).toFixed(1)+'%';
const lenses=[
 ['graham','格雷厄姆 · 安全边际','现价缺乏资产和现金流保护。','6月权益1.256亿美元、股数1.461亿，账面约0.86美元/股。[S1]','技术无形资产不能只看账面？','同意，所以用成长现金流；但不能用技术口号代替足够折价。'],
 ['buffett','巴菲特 · 持久优势','续航需求有价值，定价权尚未证明。','Q2毛利率27%，代工策略减少自建投入。[S2]','优秀电池是否自然成为好生意？','取决于良率、可靠性、客户黏性和利润归属；供应商也可能分走技术收益。'],
 ['munger','芒格 · 逆向与治理','先排除资助与产能幻觉。','7500万美元资助多数尚未落实拨款，1200万颗年产能只是项目目标。[S3]','国防需求能否确保回款？','不能；里程碑验收、拨款和客户付款是三件不同的事。'],
 ['lynch','彼得·林奇 · 经营兑现','从小基数走向商业化，增长真实但不能外推。','Q2收入3403万美元、同比126%，新欧洲客户订单2400万美元。[S2]','小公司翻倍不正是机会？','是候选机会；要看订单交付和每股盈利，不能把多年机会都当确定积压订单。'],
 ['dalio','达利欧 · 资金周期','无金融借款降低风险，营运资本仍吞现金。','半年CFO−4013万美元，含2000万一次性退租付款；应收4065万。[S1]','剔除退租后是不是已安全？','仍约−2013万，尚未扣设备购买；增长越快可能越需垫资。'],
 ['soros','索罗斯 · 融资反馈','上涨有助融资，下跌会加重稀释。','10月自动货架注册不是已募集现金；旧ATM已于2025年底用尽终止。[S1][S5]','权证行权可否解决资金？','现价低于11.50/12.50美元行权价；基准不预收这笔现金。'],
 ['marks','霍华德·马克斯 · 损失预算','当前不买，条件预算应极小。',`基准五年年化${P(b.dcf.cagr)}至${P(b.sales.cagr)}，悲观可能接近全损。`,'乐观32美元是否值得抢跑？','上行存在，但不能把乐观当必然；先要求价格和现金兑现共同改善。']
];
const r={version:1,symbol:'AMPX',name:'Amprius Technologies · 安普瑞斯',exchange:'NYSE · 普通股',currency:'USD',capitalUsd:400000,horizonYears:5,analysisDate:'2026-11-06',analysisTimeZone:'Asia/Shanghai',financialPeriod:'2026Q2及半年，止6月30日；8月4日发布、8月6日申报；Q3尚未发布',dataAsOf:'北京时间2026-11-06约03:42；美国11月5日14:41 EST盘中页面报价。官方新闻核至10月21日、SEC货架注册10月9日；不把Q3当已知。',
 quote:{price:7.475,date:'2026-11-05',type:'盘中页面快照',source:'Moomoo实际页面',sourceUrl:'https://www.moomoo.com/hans/stock/AMPX-US',note:'11月5日14:41 EST页面7.475美元，跌11.75%；约19:42 UTC读取。网页快照并非券商逐笔保证，不改用户行情。[S7]'},
 verdict:{stance:'技术成长值得跟踪，现价暂不新增',summary:'收入翻倍、毛利改善，但回款和商业化仍未过关。7.475美元高于基准今日价值4.50–5.63美元，当前新增0；保留0.5%的条件预算，先等财报和资金条件，再考虑三档。',conclusion:`基准今日价值$${F(b.dcf.today)}–$${F(b.sales.today)}，2031期末$${F(b.dcf.price5)}–$${F(b.sales.price5)}；参照7.475美元，五年总涨幅约38%–72%、年化${P(b.dcf.cagr)}–${P(b.sales.cagr)}，不足补偿早期量产风险。乐观约32美元，悲观0.09–1.08美元且融资失败可归零。当前新增0%，条件目标0.5%=$2,000，上限0.75%=$3,000。`,confidence:'偏低至中等：财报可信，未来良率、回款、政府拨款、代工经济性及稀释高度不确定。',valueLow:b.dcf.today,valueHigh:b.sales.today,limitations:'七种公开理论的方法模拟，非本人观点。情景不是概率或保证；资助兑现、伙伴分担、2026年底现金和未来股份均有估计。个人流动性及税务适配不完整。'},
 position:{targetPct:.5,maxPct:.75,currentAdditionalPct:0,existingExposureUsd:p.company.value,pendingBuyUsd:p.pendingKnownLimitBuyUsd,rationale:'当前新增0，条件目标2000美元、最高3000美元；目标按25%/35%/40%分配，约500/700/800美元。现有直接、可核ETF及待成交买单均为0，保存前复核。目标全损影响40万组合约0.5%，上限全损约0.75%；上限是重估后的风险限额，不是额外一档。',portfolioFit:'与ENVX同属电池商业化风险，与无人机/国防成长股受相同情绪和预算影响；不能以不同代码当充分分散。所有个股不能同时买满上限，现货无杠杆，不代下单，保留原用户计划。'},
 entries:m.entries.map((e,i)=>({...e,condition:`上沿=min(较低基准今日价值×${[80,65,50][i]}%，较低2031目标按25%年回报折现$${F(m.returnLimit)})。先核11月11日财报、回款/库存和未来12个月资金；资助资金缺口无方案则暂停。${i===2?'低于1.35美元重新尽调，禁止机械补仓。':'价跌伴随客户/良率恶化时不启用。'}`})),
 scenarios:['bear','base','bull'].map((id,i)=>{const x=m.scenarios[id],c=x.parameters;return {id,label:['悲观：增长失速、稀释融资','基准：订单与代工逐步兑现','乐观：高密度电池大规模采用'][i],todayValue:x.dcf.today,year5Price:x.dcf.price5,assumptions:`2031收入${c.rev.at(-1)}百万美元、毛利率${P(c.gm.at(-1))}、经营费用${c.opex.at(-1)}百万；普通股折现${P(c.ke)}。DCF/收入退出法今日${F(x.dcf.today)}/${F(x.sales.today)}，2031为${F(x.dcf.price5)}/${F(x.sales.price5)}，年化${P(x.dcf.cagr)}/${P(x.sales.cagr)}；期末${F(x.shares)}百万股。${id==='bear'?'现金底线20百万，需新股净筹132百万；无法融资则全损。':id==='bull'?'假设2027权证到期前全部现金行权，新增约120百万现金和10.475百万股。':'不依赖权证或额外增发。'}`};}),
 masters:lenses.map(([id,name,judgment,evidence,challenge,response])=>({id,name,judgment,evidence,challenge,response})),
 debate:[
 {question:'500Wh/kg是否足以形成长期护城河？',bull:'林奇/巴菲特：更轻、更长续航对无人航空有明确经济价值，已有订单。',bear:'芒格：SiCore500是1C持续放电指标，不能同时代表快充、循环寿命、安全和量产良率领先。[S4]',resolution:'承认技术价值，等待规模交付、复购与利润；不把低倍率航空产品估成已攻占乘用车。'},
 {question:'7500万美元资助是否消除融资风险？',bull:'索罗斯：本土生产与国防需求可能改善客户和资金信心。',bear:'达利欧/格雷厄姆：多数资助尚待拨款，项目约1亿美元且含伙伴实物投入；不是母公司可自由使用现金。[S3]',resolution:'不计入期初现金；基准仅以母公司净投入2500万美元做代理，另做延迟/额外投入压力，实际分担披露后重算。'},
 {question:'当天大跌是否已给出买点？',bull:'林奇：成长兑现后2031乐观可超32美元。',bear:'马克斯：7.475仍要求基准增长持续，估值不能跟着盘中涨跌改变假设。',resolution:'维持当前不买，观察上沿3.37美元还须先过经营门槛；不把跌幅当安全边际。'}],
 sections:[
 {title:'业务、财务与最重要的区别',body:'公司做硅负极锂电池，Fremont研发/试产加外部代工，服务无人航空、国防和移动设备。优势是能量密度和适配，竞争包括传统锂电与其他硅负极厂商；供应商依赖、替代技术和客户议价限制利润。[S1][S2]\nQ2收入3403万美元、毛利928万、营业亏430万、净亏315万；普通股亏508万另含192万非现金权证修改，不能混同。2026指引收入≥1.4亿美元、毛利率≥28%、调整EBITDA≥400万美元，不等于自由现金流转正。[S2]\n半年收入6257万，应收4065万、库存1151万；两客户合计占应收54%，不是已证实占收入54%。现金7452万、无金融借款；半年CFO−4013万，退租一次性2000万，另购设备约280万。剔除一次性后仍有现金消耗。[S1]'},
 {title:'技术、订单和治理要怎样看',body:'2400万美元欧洲客户订单是商业证据；Stark Future从2027年起多年合作的“超过1亿美元机会”不全等于不可取消订单。SiCore500宣称1C下500Wh/kg、预计2026Q4可商用；尚须验证交期、良率、质保和复购。[S2][S4]\n7500万资助用于韩国伙伴运营的美国现有产线改造，拟2028年初完成、目标每年1200万颗；多数资金尚未拨付，按里程碑验收。产能不等于销量，资助不等于现金收入。[S3]\n依赖Berzelius等供应/代工；前CEO、现董事Kang Sun同时在相关供应方任董事，核关联交易与供应连续性。现CEO是Tom Stepien，不沿用旧管理层信息。[S1][S2]'},
 {title:'两法估值：假设透明、价值与目标分开',body:`全部为研究假设：2026年底现金悲观/基准/乐观4500/6000/7000万美元，非已公布数字；2031收入2.8/7.6/12.5亿美元。基准2027–2031收入2.1/3.1/4.4/5.9/7.6亿，毛利率30%升至35%，经营费用6100万升至1.45亿，2031营业利润1.21亿。\n营运资本设收入20%，起点4000万；净资本投入=收入1%（资本开支3%减折旧2%），正营业利润按21%税，无税盾收益。未来股酬作现金等价费用不加回；既有期权/RSU全额计股、不预收行权款，起点157.494百万股。权证仅乐观在2027到期前行权，不把已交换注销的旧权证再加一次。[S1]\nDCF：2031后十年增长20%逐步降到4%，营业率收敛18%，WACC14%、永续增长3%，加滚存现金约1.30亿，除股数得2031约${F(b.dcf.price5)}。独立收入退出法用2.5倍×7.6亿，加现金除股数得${F(b.sales.price5)}；对应约15.7倍2031营业利润，倍数是判断非同行实时报价。两法再按普通股Ke18%折五年，今日${F(b.dcf.today)}/${F(b.sales.today)}。未假设分红，未来现金仅在期末加一次。`},
 {title:'反推、敏感性及怎样避免永久损失',body:`按2.5倍收入退出、基准股数/现金，要让7.475美元获得18%年回报，2031收入需约${F(m.reverse2031Revenue/1000)}亿美元，约为2026指引下限的7.3倍。基准DCF WACC12%/14%/16%时今日价值${m.sensitivity.map(x=>F(x.today)).join('/')}美元，终值假设影响很大。\n悲观增长放缓而费用刚性，现金底线2000万下仍需净筹1.32亿美元，按每股2美元、5%发行摩擦会显著稀释；两个估值给0.09/1.08美元并非清算保底，融不到钱可归零。乐观高毛利及代工成功也可能达到32美元，但没有依据赋予确定胜率。\n买前核：毛利是否达到28%指引、应收增速是否长期高于收入、客户是否按时付现、现金是否覆盖12个月计划，以及资助是否实际拨付。估值低于三档下沿、订单流失、良率/安全事故或资金缺口扩大均暂停，重算而非补仓。`}],
 invalidation:['关键客户流失、量产安全/良率恶化、应收无法回收，暂停三档并重估。','资助延迟及项目分担使12个月资金不足，先确定融资和稀释；低于1.35美元重新尽调。'],reviewTriggers:['11月11日08:30 ET（北京时间21:30）Q3电话会前发布财报，核收入、毛利、现金、应收及最新股份。[S6]','未来两季核SiCore500真实商业交付、2400万订单回款；2027年9月权证到期及2028年初产线节点随实际披露复核，未设自动监控。'],
 figures:[{title:'Q2收入和毛利：增长与经济性同时看',unit:'百万美元',note:'2025Q2/2026Q2；2025毛利由已报告表取值或比例近似，图仅列精确已核收入及2026毛利。[S2]',rows:[{label:'2025Q2收入',value:15.067},{label:'2026Q2收入',value:34.032},{label:'2026Q2毛利',value:9.280}]}],
 sources:[
 {label:'[S1] Q2 10-Q：现金、股数、稀释、退租及供应关系',url:'https://www.sec.gov/Archives/edgar/data/1899287/000189928726000059/ampx-20260630.htm',date:'止2026-06-30；8月6日申报；11月5日访问'},
 {label:'[S2] 官方Q2业绩、全年指引和客户进展',url:'https://ir.amprius.com/news-events/press-releases/detail/172/amprius-technologies-reports-second-quarter-2026-financial-results-and-recent-business-highlights',date:'2026-08-04；11月5日访问'},
 {label:'[S3] 7500万美元资助：拨款、里程碑及产线',url:'https://ir.amprius.com/news-events/press-releases/detail/175/amprius-secures-75-million-grant-for-american-high-energy-density-battery-production',date:'2026-09-28；11月5日访问'},
 {label:'[S4] SiCore500规格与预期商业时间',url:'https://ir.amprius.com/news-events/press-releases/detail/174/amprius-introduces-sicore500-high-energy-density-cells-for-unmanned-aviation',date:'2026-09-02；11月5日访问'},
 {label:'[S5] S-3ASR自动货架注册，不代表已募资',url:'https://ir.amprius.com/sec-filings/all-sec-filings/content/0001104659-26-115105/tm2626736d1_s3asr.htm',date:'2026-10-09；11月5日访问'},
 {label:'[S6] 官方Q3业绩发布时间',url:'https://ir.amprius.com/news-events/press-releases/detail/176/amprius-technologies-announces-date-for-third-quarter-2026-results-and-business-updates',date:'2026-10-21；北京时间11月6日复核新闻索引'},
 {label:'[S7] Moomoo盘中实际页面',url:'https://www.moomoo.com/hans/stock/AMPX-US',date:'美东11月5日14:41；北京时间11月6日约03:42读取'}],
 modelEvidence:{file:'ampx-model-2026-11-05.json',script:'ampx-build-model-2026-11-05.mjs',note:'建模始于11月5日，北京时间11月6日更新报价后提交；现金/资助/营运资本/增发/权证桥单独留存。'}
};
validateDecisionReport(r,{symbol:'AMPX'});await fs.writeFile(new URL('ampx-analysis-input-2026-11-06.json',dir),JSON.stringify(r,null,2)+'\n');console.log(JSON.stringify({conclusion:r.verdict.conclusion,plan:decisionEntryPlan(r),chineseChars:JSON.stringify(r).match(/[\u4e00-\u9fff]/g).length},null,2));
