import fs from "node:fs/promises";
import {validateDecisionReport,decisionEntryPlan,scenarioReturn} from "../../../src/decision-reports.js";

const e=JSON.parse(await fs.readFile(new URL("./envx-evidence-model-2026-11-05.json",import.meta.url),"utf8"));
if(e.audit.status!=="passed_with_material_explicit_limitations")throw Error("ENVX audited model required");
const notes=JSON.parse(await fs.readFile(new URL("./envx-debate-notes-2026-11-05.json",import.meta.url),"utf8"));
const f=e.facts,m=e.model,a=m.assumptions,q=e.quote,ids=["bear","base","bull"];
const n=(v,d=2)=>Number(v).toLocaleString("en-US",{minimumFractionDigits:d,maximumFractionDigits:d});
const pct=v=>`${n(v*100,1)}%`,usd=v=>`$${n(v)}`;
const sources=[...new Map(e.sources.map(s=>[s.id,s])).values(),{id:"quote",url:q.source,date:q.timestamp.slice(0,10),type:"Moomoo实际Chrome盘中页面"}];
const S=id=>{const i=sources.findIndex(s=>s.id===id);if(i<0)throw Error(`Missing ENVX source ${id}`);return `[S${i+1}]`;};
const near=(x,y,label)=>{if(!Number.isFinite(x)||!Number.isFinite(y)||Math.abs(x-y)>1e-7)throw Error(`ENVX independent reconstruction ${label}: ${x}/${y}`);};
function irr(flows){let lo=-.9999,hi=10;for(let i=0;i<160;i++){const r=(lo+hi)/2,pv=flows.reduce((sum,c,t)=>sum+c/(1+r)**t,0);if(pv>0)lo=r;else hi=r;}return(lo+hi)/2;}

// Independent parent reconstruction: operating cash, coupons, principal,
// financing shares and warrant payment methods must reconcile simultaneously.
function reconstruct(p){
  let cash=a.openingCashM,shares=a.openingCommonSharesM+a.existingAwardSharesM,d28=f.capitalStructure.notes2028.principalM,d30=f.capitalStructure.notes2030.remainingPrincipalM,other=a.openingOtherDebtM,raised=0,previous=a.initialRevenueM,failed=false,failureYear=null;
  const rows=[];
  for(let i=0;i<10;i++){
    const eye=p.eyeUnitsM[i]*p.eyeAsp[i],phone=p.phoneUnitsM[i]*p.phoneAsp[i],revenue=p.korea[i]+eye+phone;
    const gp=p.korea[i]*p.koreaGm[i]+eye*p.eyeGm[i]+phone*p.phoneGm[i],ebit=gp-p.opex[i],nopat=ebit-Math.max(0,ebit)*a.taxRate,fcff=nopat+p.da[i]-p.capex[i]-(revenue-previous)*p.nwcRatio;
    const interest=d28*.03+d30*.0475+other*.05;
    let principal=0,warrantCash=0,debtRetired=0,newWarrantShares=0,converted=0;
    if(i===0&&p.warrantMode!=="none"){
      newWarrantShares=f.capitalStructure.warrantDividend2026.estimatedCountUsingLatestActualSharesM;shares+=newWarrantShares;
      if(p.warrantMode==="notes"){debtRetired=Math.min(d28,newWarrantShares*1000/333);d28-=debtRetired;warrantCash=(newWarrantShares-debtRetired*333/1000)*3;}
      else warrantCash=newWarrantShares*3;
    }
    if(i===0){principal+=other;other=0;}
    if(i===1){principal+=d28;d28=0;}
    if(i===3){if(p.convert2030){converted=d30*.089216;shares+=converted;d30=0;}else{principal+=d30;d30=0;}}
    cash+=fcff-interest-principal+warrantCash;
    let gross=0,net=0,newShares=0;
    if(cash<a.minimumCashM){const needed=a.minimumCashM-cash,requested=needed/(1-a.financingFee);if(raised+requested>p.maxFinanceM){failed=true;failureYear??=2027+i;}else{gross=requested;net=needed;newShares=gross/p.issuePrice[i];raised+=gross;cash+=net;shares+=newShares;}}
    rows.push({year:2027+i,revenue,gp,ebit,nopat,fcff,interest,principal,warrantCash,debtRetired,newWarrantShares,converted,gross,net,newShares,cash,debt:d28+d30+other,shares,failed});previous=revenue;
    if(failed)break;
  }
  if(failed)return {failed,failureYear,rows,today:0,p2031:0,crossToday:0,cross2031:0,packageToday:0,packageIrr:-1};
  const tv=Math.max(0,rows.at(-1).nopat)*(1+p.g)*(1-p.g/p.terminalRoic)/(p.wacc-p.g),tvPV=tv/(1+p.wacc)**5;
  const ev5=rows.slice(5).reduce((sum,row,i)=>sum+row.fcff/(1+p.wacc)**(i+1),0)+tvPV;
  const fifth=rows[4],bridge=Math.max(0,fifth.cash-a.minimumCashM)-fifth.debt-a.minorityClaimM;
  const operatingPerShare=rows.slice(5).reduce((sum,row,i)=>sum+(row.fcff+row.net)/row.shares/(1+p.wacc)**(i+1),0)+tv/rows.at(-1).shares/(1+p.wacc)**5;
  const p2031=Math.max(0,operatingPerShare+bridge/fifth.shares),today=p2031/(1+p.ke)**5;
  const cross2031=Math.max(0,(Math.max(0,fifth.nopat)*p.exitNopatMultiple+bridge)/fifth.shares),crossToday=cross2031/(1+p.ke)**5;
  const exercised=p.warrantMode!=="none",packageToday=exercised?Math.max(0,1.25*today-.75/(1+p.ke)):today;
  const packageIrr=exercised?irr([-q.price,-.75,0,0,0,1.25*p2031]):scenarioReturn(p2031,q.price);
  return {failed:false,rows,tv,ev5,operatingPerShare,tvShare:tvPV/ev5,p2031,today,cross2031,crossToday,packageToday,packageIrr};
}
const c=Object.fromEntries(ids.map(id=>[id,reconstruct(m.scenarios[id].inputs)]));
for(const id of ids){const s=m.scenarios[id],v=c[id],r=s.results;
  v.rows.forEach((row,i)=>{const original=s.annual[i];for(const [field,value] of Object.entries({revenueM:row.revenue,economicEbitM:row.ebit,fcffM:row.fcff,interestCashM:row.interest,principalCashM:row.principal,warrantCashM:row.warrantCash,warrantDebtRetiredM:row.debtRetired,financeNetM:row.net,financeSharesM:row.newShares,endCashM:row.cash,endSharesM:row.shares}))near(value,original[field],`${id}/${row.year}/${field}`);});
  near(v.today,r.todayExDistributionCommonValue,`${id}/today`);near(v.p2031,r.year5CommonPrice,`${id}/2031`);near(v.crossToday,r.independentTodayExCommonValue,`${id}/cross`);near(v.packageToday,r.todayPreRecordPackageValue,`${id}/rights package`);
  if(!v.failed){near(v.ev5,r.year5ContinuationEvM,`${id}/unlevered EV`);near(v.operatingPerShare*v.rows[4].shares,r.year5ContinuationClaimEvM,`${id}/future ownership-adjusted EV`);}
  near(v.packageIrr,r.originalSharePackageIrrAtQuote,`${id}/refreshed rights IRR`);
}
const base=c.base,bull=c.bull,br=m.scenarios.base.results,bu=m.scenarios.bull.results,ba=m.scenarios.base.inputs;
const ref=Math.min(base.today,base.crossToday),futureRef=Math.min(base.p2031,base.cross2031),margins=[.35,.45,.55];
const caps=margins.map(margin=>Math.min(futureRef/1.15**5,ref*(1-margin))),floorCent=x=>Math.floor((x+1e-10)*100)/100,highs=caps.map(floorCent);
const ranges=[{low:floorCent(highs[1]+.01),high:highs[0]},{low:floorCent(highs[2]+.01),high:highs[1]},{low:Math.ceil(ref*.3*100)/100,high:highs[2]}];
const reverse=reconstruct(m.reverseDcf.inputs);near(reverse.packageToday,q.price,"rights-consistent reverse valuation");
const portfolio=JSON.parse(await fs.readFile(new URL("./envx-portfolio-context-2026-11-05.json",import.meta.url),"utf8"));
const exposure=portfolio.company.value,pending=portfolio.pendingKnownLimitBuyUsd;
const api="http://127.0.0.1:5889/my-holdings/api",state=await(await fetch(api+"/state")).json(),watch=state.watchlist.find(w=>w.symbol==="ENVX");
const position={currentAdditionalPct:0,targetPct:.5,maxPct:1,existingExposureUsd:exposure,pendingBuyUsd:pending,
  rationale:`当前新增0%。在完整财报、量产经济性、融资路径及权证权益核验后，研究条件目标总敞口0.5%=$2,000，上限1%=$4,000；不是现在必须部署的预算。扣当前穿透${usd(exposure)}、已记限价买单${usd(pending)}后，目标剩余${usd(Math.max(0,2000-exposure-pending))}按25%/35%/40%分配。若公司失败可全损，目标/上限对应40万美元组合0.5%/1%损失；与其他成长/融资资产共同下跌另计，不能保证最大回撤。`,
  portfolioFit:"应用保存的直接持仓与QQQM、VOO、SMH、SOXX历史成分中未记录ENVX敞口，未记该股待成交限价买单。外部账户、流动性、税务与回撤约束未齐，最终适配尚未完成。新电池、设备、太空与AI硬件虽然产品不同，仍共同暴露于融资、成长估值和资本开支风险，不能将66只的上限同时买满。"};
const refs=[["Q3pre","WarrantPR"],["Q2Q","Q3pre"],["Q2IR","Q3pre"],["Q3pre","K2025"],["Q3pre","Q2Q"],["WarrantPR","S3"],["Q2Q","WarrantPR"]];
const scenarios=ids.map((id,i)=>({id,label:["悲观：融资失败","基准：有条件规模化","乐观：多平台成功"][i],todayValue:c[id].today,year5Price:c[id].p2031,assumptions:i===0?"模型中2029年资金不足且无法融资，普通股归零。之后表格诊断不是持续经营现金或实际偿债预测；这不是发生概率。":`分配后普通股口径；${i===1?"2031收入588百万、手机25百万单位×13美元、眼镜6百万×5.5美元、韩国230百万；未来股本融资约649百万、约505百万股，权证不行权，旧债现金偿付。":"2031收入1,248百万、手机60百万单位×13美元、眼镜16百万×5.5美元、韩国380百万；权证全现金行权、2030债转股，另筹股本约270百万，约358百万股。"} 表中对当前拟含权报价的CAGR仅普通股价格代理，完整权益包与未来行权支出IRR见下文。`}));
const sourceNames={Q3pre:"Q3初步业绩与管理层重组",Q2Q:"2026Q2完整10-Q",K2025:"2025年10-K与三年财务",Oct28:"10月28日8-K",K2022:"2022年10-K与早期财务",Q1Q:"2026Q1完整10-Q与Honor身份",Q2IR:"Q2官方业务与测试进展",Oct22:"纠正未授权营收估计",S3:"11月2日货架注册",WarrantPR:"新权证、债务回购与条款摘要",K2023:"2023年10-K与实际股数",quote:"Moomoo实际Chrome盘中报价"};
const annual=f.annual.map(y=>`${y.year}：收入${n(y.revenueM,3)}；毛利${n(y.grossProfitM,3)}；营业损益${n(y.ebitM,3)}；净损益${n(y.netIncomeM,3)}；CFO${n(y.cfoM,3)}；现金CapEx${n(y.capexM,3)}；FCF${n(y.reportedFcfM,3)}；SBC${n(y.sbcM,3)}百万。`).join("\n");
const r={version:1,symbol:"ENVX",name:"Enovix Corporation",exchange:"NASDAQ · 普通股",currency:"USD",capitalUsd:400000,horizonYears:5,analysisDate:"2026-11-05",
  financialPeriod:"FY2021–25、2026Q2/H1完整财务、Q3初步数字",
  dataAsOf:"2026-11-05 NZDT（美国仍11月4日）；完整财务截至7月5日，10月4日止Q3仅初步披露；含10月28日债务回购/拟权证及11月2日S-3，完整Q3计划11月12日发布。",
  quote:{price:q.price,date:q.timestamp.slice(0,10),asOf:q.timestamp,type:"盘中报价快照 · 拟含权普通股",source:"Moomoo实际Chrome页面",sourceUrl:q.source,note:`${q.providerLabel}，${usd(q.price)}；供应商时点${q.timestamp}、直接读取${q.observedAtUtc}。公开报价可能延迟，非保证可成交。公司拟11月13日记录、约11月18日分配新权证，实际资格/除权以最终协议、交易所及券商安排为准；不可把未来分配后普通股表价直接套到今天。${S("quote")}${S("WarrantPR")}`},
  verdict:{stance:"暂不新增；先核验量产、完整财报与融资",summary:`有真实防务订单，但量产与融资后的每股回报仍未证明。基准普通股约${usd(base.crossToday)}–${usd(base.today)}，未计权证市场时间价值。当前新增0%；三档仅供未来分配后复核，不作为现在挂单。`,confidence:"低：量产、资金和条款互相影响；关键收入、成本与融资均为条件假设",valueLow:Math.min(base.today,base.crossToday),valueHigh:Math.max(base.today,base.crossToday),
    conclusion:`韩国防务业务与新电池性能有真实进展，但不能把2.16亿美元pipeline、客户样品和手机测试直接当已锁定利润。基准已假设2031手机25百万单位、眼镜6百万单位及韩国收入230百万，总收入588百万；即使如此，前五期仍需约${n(br.externalFinanceThrough2031M)}百万未来股本融资，期末约${n(br.year5SharesM)}百万股。分配后普通股今日DCF${usd(base.today)}、独立经营盈利倍数法${usd(base.crossToday)}；2031相应${usd(base.p2031)} / ${usd(base.cross2031)}。这些融资并未落实，价格更低但融资条件变坏时价值也会下调。当前拟含权报价${usd(q.price)}，基准两法的普通股价格代理年化约${pct(scenarioReturn(base.cross2031,q.price))}至${pct(scenarioReturn(base.p2031,q.price))}，并非完整权证收益。乐观和归零路径都保留，不编概率。当前新增0%；条件目标0.5%=$2,000、上限1%=$4,000。三档${ranges.map(v=>`${n(v.low)}–${n(v.high)}`).join(" / ")}仅为未来分配后普通股且证据通过的复核范围，须先更新11月12日完整财报及权证协议。`,
    limitations:"不是七位投资者本人的观点。Q3尚为初步数字，现金范围/完整三表/实际股数/成本削减等待11月12日；8月7日实际股数与16百万现有奖励代理不是11月4日精确完全稀释股数。当前证券拟含新权证权益，报价与分配后普通股不同；未建立可验证的权证时间价值/波动率模型，不将不行权情景说成权证必无价值。现金、交债与转换路线均是假设，最终协议及capped-call结算不全；行权并非保证。模型未来融资价格不是市场出清证明，500百万货架不是现金，基准所需筹资更大且需未来额外安排。新工厂完整UPH/可售能力/单位成本不足以独立验证预测产量，产量、ASP、利润、CapEx、税、最低现金与权益折现均为研究假设。十个标准年度、到期债务和行权采用年度近似，未精确切每个票息和日期。完整2026财年53周、H1为27周，未伪造严格52周TTM。独立退出倍数非同日同行实证；无概率加权，失败可全损。完整用户组合与个人约束未知。"},
  position,entries:ranges.map((v,i)=>({tier:["observation","safety","discount"][i],...v,budgetSharePct:[25,35,40][i],condition:`仅适用于未来权证分配后的普通股，须先核对最终条款、除权及新财报，不作为现在的委托价。上沿=min(${n(futureRef,5)}/1.15^5，${n(ref,5)}×${pct(1-margins[i])})，向下到美分为${n(v.high)}；要求至少15%研究年回报与${pct(margins[i])}折让。必须验证最终手机/系统可靠性、持续可售良率和单位成本、至少两项重复商业采购、韩国扩产和可信资金跑道。低价若伴随融资价格/可得性恶化，先重建全部股数和价值；低于${n(ranges[2].low)}重新尽调，不自动补仓。`})),scenarios,
  masters:notes.masters.map((v,i)=>({...v,evidence:`${v.evidence} ${refs[i].map(S).join("")}`})),debate:notes.debate,
  sections:[
    {title:"业务三层：韩国收入、新架构和集团成本",body:`Enovix销售锂电芯、电池包及相关产品。Routejade于2023年并入，2025年又取得韩国SETK相关资产；韩国现有常规/硅混合产品、涂布与防务工业能力贡献当前主要收入。Malaysia Fab2的新100%活性硅负极约束/堆叠架构、手机和眼镜商业化是另一条路径。不要拿韩国当前交付来证明Fab2已实现同样成本与良率。公司只有一个报告分部，本文业务拆解是研究模型，不是正式分部利润。${S("Q2Q")}${S("K2025")}\n优点是电池对续航、空间、安全和系统可靠性很关键，客户验证形成迁移成本，非中国防务供应能力也可能有溢价。竞争包括既有锂电池厂、其他硅增强方案、终端厂自研/第二供应源；客户可以用价格、规格、测试协议和采购量议价。技术优势要经过可售产出、实际订单和现金回报才能形成经济护城河。\n核心问题是韩国业务能赚多少毛利、Fab2还要多少资本、集团研发和费用能降多少。即使韩国规模翻倍，也不自动覆盖全集团成本；增长来自自有产品、并购范围、样品和批量交付的部分须分别看。`},
    {title:"最新Q3与11月12日：初步成绩不是完整报表",body:`10月12日披露的Q3初步收入11.0百万、同比约+38%，GAAP营业亏39.294百万、净亏41.618百万、现金CapEx约3百万、10月4日现金标题约512百万，均未完成最终审阅，不能补造Q3CFO。约70%营收来自无人机/防务。CapEx低于先前8–12百万指引，可能涉及时点和项目安排，不能直接当永久资本效率改善。${S("Q3pre")}\nRyan Benton为临时CEO，T.J. Rodgers为执行主席，Steve Bakos任新CRO/总经理，147人R&D团队改由COO领导；管理层强调把机会转订单并缩减费用。这是战略调整，效果须用后续利润、支出和交付检验，不能因知名主席就假设执行无误。\n10月22日8-K明确否认媒体提到约100百万2027收入是授权指引；17,000生产样品来自眼镜客户50,000-pack订单，不是手机订单。模型2027的55.6百万也只是研究假设。完整Q3与降本更新计划11月12日，13:00 ET视频会对应新西兰11月13日07:00 NZDT，未发布数据不提前填成实绩。${S("Oct22")}${S("WarrantPR")}`},
    {title:"客户证据：测试、design win、采购、交付分别核验",body:`Q1完整10-Q公开点名Honor为lead手机OEM；Q2称lead客户，不据此猜测换客。其他未公开OEM、眼镜及无人机客户不凭媒体猜身份。超过1,000循环的0.2C代理/混合测试，是特定协议下的进展；最终加速资格与系统级实地测试还需完成，不等于最终产品已大批采购。${S("Q1Q")}${S("Q2IR")}\nQ2眼镜实际约2,100个AI-1电池并有初始收入，客户订单覆盖50,000电池包，预期Q3交19,000包。后来17,000生产样品YTD的对象/定义不同，不能简单相减宣布全部完成或精确未达标；须等完整Q3按同口径核验。UN38.3、UL2054、KC62133-2及客户可靠性测试有意义，但安全认证不是采购保证。\n无人机新增100,000个电池的初始PO，计划2027上半年交付；公司未披露ASP/金额，不能自定该单收入。H2追加订单是展望。216百万pipeline指韩国识别机会的峰值年度生产价值；design win指获选但未量产，两者均不是订单、backlog、承诺收入或预测。不能把同一机会在pipeline、PO和确认收入阶段反复相加。${S("WarrantPR")}${S("Q3pre")}`},
    {title:"工厂与单位经济性：局部良率不是整线良率",body:`Fab2通过设备/场地验收，不代表持续高良率、低成本的可售批量产出。Q2 Zone1 dicing步骤良率约84%（Q1约80%），其他步骤多接近/超过95%；这些是步骤口径，不能把84%或95%直接当整线良率。全流程可售产出还受返工、设备利用、停机、产品规格和瓶颈影响。${S("Q2Q")}${S("Q2IR")}\n已核材料未给可审计的完整最新UPH和合格年产能力，本文不把电话会提问或设备额定数当产能指引。激光/机械切割转变及部分机械步骤预计年底上线仍是计划。Fab2现租期延至2027年7月31日、约0.2百万/月，续租、购置或其他安排仍需核验；预测资本预算必须容纳工厂安排。\n韩国约19百万扩产拟于2027年中提升能力，是有现有工厂基础的路径，但不能等同公司收入必翻倍。AI-2能量密度提升、2027 MX-2目标及小电芯快充展示均需按电芯容量/测试条件理解，不冒充已认证手机电池包性能。电池安全、寿命、循环速度、能量和制造成本需同时成立。`},
    {title:"五年财务与现金：融资和公允价值不能当运营收益",body:`完整FY2021–25，单位百万美元，FCF=CFO−现金CapEx；2021收入确为0，毛利率不适用，不用0%假装有可比利润率。\n${annual}\n早期与并购后范围差异很大。2022净亏51.622明显小于营业亏131.979，包含约75.180百万权证公允价值收益；2025也有21.832百万权证公允价值收益及4.761百万收购便宜购买收益，不应当经常利润。2025虽毛利6.105百万，营业亏仍177.254、FCF−113.514。2025融资权证约232.106百万总收入及360百万债发行，不等于自我造血；同时有约58.385百万股票回购和capped-call支出，需要审视资本配置。${S("K2022")}${S("K2025")}\n2026Q2收入9.024、毛利1.302（14.4%）、营业亏43.296、净亏43.077；单季CFO由H1−Q1得到−21.781，CapEx9.624，FCF−31.405。H1收入16.624、营业亏87.191、净亏81.335、CFO−54.853、CapEx12.844、FCF−67.697、SBC24.799百万，不能把累计CFO当单季。2026财年53周、H1为27周对去年26周，因此FY25+H126−H125是53周，不伪装成严格52周TTM。${S("Q2Q")}\nH1净利到CFO桥含D&A+19.406、SBC+24.799、权证公允价值−6.578及营运资本等，CFO并非FCFF。模型未来经济报酬按现金替代成本保留，不同时加回SBC和增长同笔未来奖励股数；这是假设股东经济负担，不是实际现金付款预测。`},
    {title:"现金与债务：退债、利息和少数权益一起算",body:`Q2现金、短/长期投资及受限现金合计约552.1百万，绝大部分不是活期现金；细表相加与标题差约0.010百万，保留口径差异。Q3标题512百万的详细范围等待正式表，已含Q3股票回购6.2百万，不能再扣一次。${S("Q2Q")}${S("Q3pre")}\n10月28日已用约63.1百万现金注销2030债100百万本金，净现金减债改善约36.9百万；会计收益不是营业run-rate。剩余2028债172.5百万、票息3%、2028年5月1日到期；2030债260百万、4.75%、2030年9月15日到期，另有韩国等其他借款。不能只减债不减回购现金。${S("WarrantPR")}\n模型开局现金${n(a.openingCashM,3)}=512−63.1−15研究stub耗现−1.853受限现金代理，是保守研究桥，不是已报告11月4日余额。其他债约${n(a.openingOtherDebtM,3)}、少数权益代理3百万、最低运营现金50百万；未加商誉、未来货架、capped-call或税损为额外可花现金。租金已留在经营成本，不重复扣租赁债。\n票息和本金在现金滚存中扣：基准2028/2030按现金偿付，乐观2030转股则增加约23.196百万股并去除相同本金。年度时点把部分票息算得偏保守，不能称逐日精确。capped-call到期/分段安排不完全匹配2030债，不假设它永远抵掉所有稀释；待Q3实际结算更新。`},
    {title:"新权证：免费获权不等于免费取得新股",body:`拟11月13日记录、约18日分配，每四普通股获一份新权证，行权3美元；2028及2030债持有人也按穿透方式获权。根据最后可核实际普通股和剩余债，模型约${n(f.capitalStructure.warrantDividend2026.estimatedCountUsingLatestActualSharesM,3)}百万份，不是已发行最终数量。旧2025股息权证已行权或到期，私募权证也已到期，不重复算成新索偿。${S("WarrantPR")}${S("Q2Q")}\n现金行权带来现金并增股；交付2028债按面值行权则退债而没有同额现金。2030债不能用于此行权。每1,000美元2028面值对应333份的固定约定及零股/调整以最终协议为准，不能同时加最大现金又减同一债。\n原定到期2028年4月28日17:00纽约；若日VWAP达到3.30美元且30个交易日中20日满足，可触发极短的下一工作日提前到期（公司可指定较后日期）。不能把它当保证长期存续的期权。完整协议、注册/上市及实际资格尚需核验，记录日不自动等于所有交易的除权日。\n本版三档是未来分配后普通股的复核范围。当前拟含权投资者在乐观全现金行权路线，持有每原股1.25股但第1期须再付0.75美元；用IRR正确计时，不从期末收益简单减0.75再冒充CAGR。权证市场时间价值未定价，不行权情景也不是对其市场价值作零估计。`},
    {title:"十年经营模型与前五期融资：把股数做出来",body:`2027–2036标准年度，2027研究收入55.6百万非指引；2027前stub以开局15百万现金折让近似。每年收入=韩国销售+眼镜单位×ASP+手机单位×ASP；毛利按各线假设减经济OPEX，EBIT扣正利润20%税，再加D&A、减现金CapEx及10%收入增量营运资本，得经营FCFF。研发及报酬已在费用里，不再次资本化扣减。\n最后实际股数为2026年8月7日219.448535百万；Q3加权219.623989不是11月4日真实流通股。模型加16百万既授奖励代理起步，未来再按实际假设筹资增股；这是经济索偿近似，不假装期权/归属精确。账面净资产ROIC受费用化研发、亏损、现金和新厂影响，不制造精确历史ROIC。\n基准2031：韩国230百万，眼镜6百万单位×5.5=33，手机25百万×13=325，总588；韩国/眼镜/手机毛利率35%/40%/32%，经济OPEX120，EBIT77.7、NOPAT62.16，CapEx180。它已要求手机商业化、明显降本和远超当前的合格产出，不是自动能兑现的保守经营事实。\n前五期基准复算（收入/EBIT/FCFF/外部股本总额/期末股数，百万）：\n${base.rows.slice(0,5).map(v=>`${v.year}：${n(v.revenue,3)} / ${n(v.ebit,3)} / ${n(v.fcff,3)} / ${n(v.gross,3)} / ${n(v.shares,3)}`).join("\n")}\n现金低于50百万时，以给定发行价1.5/1.5/2/2.5/3美元等、5%费用补足；前五期总筹资${n(br.externalFinanceThrough2031M,3)}百万、期末${n(br.year5SharesM,3)}百万股。这些资金并未承诺，超过500百万货架，未来需额外安排。发行价是假设而非市场出清证明；股价低时可能筹不到或稀释更多。若无可得资本，悲观路线2029失败，普通股归零，失败后诊断不是仍可偿债的账本。${S("S3")}`},
    {title:"两种定价、权益包与五年收益",body:`方法一：第6–10期逐年将FCFF与同期新增融资净现金合并、除当年实际股数并按WACC折回2031，终值NOPAT×(1−g/ROIC)/(WACC−g)按2036实际股数分摊；再加2031超最低现金、减剩余债及少数权益的每股桥。融资净现金用于补当期缺口，新股份同时摊薄后续每期与终值，不能把融资当经营收益。基准2032还需约0.796百万总股本、增加约0.199百万股，已计入未来索偿；2031每股再用Ke折五期得今日普通股。不能把初始净现金再加一次，也不能将已还本金从期末股权重复扣。\n基准WACC15%、g3%、终值ROIC15%、Ke18%；乐观WACC13%、g3.5%、ROIC20%、Ke16%。基准普通股今日${usd(base.today)}、2031${usd(base.p2031)}；乐观${usd(bull.today)} / ${usd(bull.p2031)}。乐观2031总收入1,248百万、手机60百万单位、眼镜16百万、韩国380百万，经济EBIT318，仍需前五期外部股本约${n(bu.externalFinanceThrough2031M)}百万，并假设权证全现金行权和2030债转股；不是没有融资的纯技术成功。\n方法二：2031经济NOPAT×基准20/乐观25倍，再按相同现金/索偿/股数及Ke折现。基准今日${usd(base.crossToday)}、期末${usd(base.cross2031)}，乐观${usd(bull.crossToday)} / ${usd(bull.cross2031)}；倍数是研究假设，未完成同日同行实证。基准2031仍大量再投资，不能把NOPAT当全部可分配现金；差异反映终值持续期，不平均两法来掩盖不确定性。\n当前拟含权原股投资者：基准不行权，模型权益包值与普通股相同，但未包含可售权证时间价值；乐观权益包今日${usd(bull.packageToday)}，现金流为现在付${usd(q.price)}、第1期再付0.75、第5期收1.25×${usd(bull.p2031)}，IRR约${pct(bull.packageIrr)}。上方表仅普通股价格代理年化，完整权益不能无条件照抄。模型内乐观2030转换的价格代理${usd(bull.p2031/(1+ m.scenarios.bull.inputs.ke))}高于初始约11.21转换价，但实际市场/反稀释条款仍需届时核验。`},
    {title:"敏感性、反推要求与最强反方",body:`基准2031剩余经营EV的终值占比约${pct(base.tvShare)}，乐观${pct(bull.tvShare)}，远期假设主导。WACC×g（今日普通股美元/股）：\n${[.13,.15,.17].map(w=>`WACC${pct(w)}：`+m.sensitivity.filter(x=>x.wacc===w).map(x=>`g${pct(x.g)}=${n(x.todayExCommon)}`).join("；")).join("\n")}\n未来发行价格减半时，基准股数约${n(m.variants.financingPriceHalved.year5SharesM)}百万、今日DCF${usd(m.variants.financingPriceHalved.todayExDistributionCommonValue)}，盈利倍数法${usd(m.variants.financingPriceHalved.independentTodayExCommonValue)}；无融资则0。CapEx+25%今日DCF${usd(m.variants.capexPlus25.todayExDistributionCommonValue)}，初始现金再少50百万约${usd(m.variants.openingCashMinus50.todayExDistributionCommonValue)}。将可售产出相对80%假设改为70%/90%的机械量敏感性，约${usd(m.variants.integralYield70insteadOf80.todayExDistributionCommonValue)} / ${usd(m.variants.integralYield90insteadOf80.todayExDistributionCommonValue)}；这不是公司已公布的整线良率，模型未完整重建每一步报废成本。\n基准若权证全现金行权，今日普通股约${usd(m.variants.warrantCash.todayExDistributionCommonValue)}；若2028交债路线约${usd(m.variants.warrant2028Notes.todayExDistributionCommonValue)}。这些是资金/股份条件敏感性，不表示持有人会行权或公司会同时取得所有现金。\n反向估值正确匹配当前拟含权包：首年研究55.6百万固定，2028后收入和扩产CapEx同步放大约${n(m.reverseDcf.scaleAfterFirstYear,3)}倍，同时假设全现金权证及每原股0.75未来资本。需2031收入${n(m.reverseDcf.implied2031RevenueM)}百万、手机约${n(m.reverseDcf.implied2031PhoneUnitsM)}百万单位、眼镜${n(m.reverseDcf.implied2031EyewearUnitsM)}百万、CapEx${n(m.reverseDcf.implied2031CapexM)}百万、另外股本筹资${n(m.reverseDcf.impliedFinancingThrough2031M)}百万。它是一组条件解，不是市场唯一预测，更不是把已知近期收入扩大来证明合理。\n最强多方是新架构成为多终端平台、资本和工艺迅速改善，乐观模型可能仍低估技术选择权；最强反方是融资、良率、客户和时点同时不达标，价值被债务与新增股数吞噬。低价、现金标题或单个测试结果都不能单独裁决。`},
    {title:"三档条件价、资金与复核顺序",body:`本轮至少15%五年研究年回报、普通股无杠杆。参考取两法较低的今日${n(ref,5)}和2031${n(futureRef,5)}，收益上限${n(futureRef/1.15**5,5)}，再分别要求35%/45%/55%折让并向下取分。三档${ranges.map(v=>`${n(v.low)}–${n(v.high)}`).join(" / ")}美元，只适用于未来分配后普通股且全部条件过关；并不是今天拟含权股票的可直接委托价。低于${n(ranges[2].low)}为重做尽调边界，不是保证底价。\n先读11月12日完整财报和新权证协议，更新现金、股数、债务/capped-call、订单、单位成本、产出与融资；若未来发行价格/资本可得性与原假设不同，先重建价值，不能只因到价下单。这个顺序比保留旧低价更重要。\n${position.rationale}\n${position.portfolioFit}\n当前保存行情${watch.price==null?"未填":usd(watch.price)}、手填观察价${watch.targetPrice==null?"未填":usd(watch.targetPrice)}和原手工三档保留。本报告独立判断，不覆盖计划，不下任何券商委托。`}
  ],
  figures:[
    {title:"五年收入：并购与商业化阶段须分清",unit:"百万美元；完整FY",note:`${S("K2022")}${S("K2025")}。2021收入确为0；Routejade于2023年并入，序列不是全程同口径有机增长。`,rows:f.annual.map(v=>({label:`FY${v.year}`,value:v.revenueM}))},
    {title:"Q2收入、毛利与经营亏损规模",unit:"百万美元；亏损柱显示绝对金额",note:`${S("Q2Q")}。43.296为营业亏损的绝对规模，非正利润；各柱不可相加。`,rows:[{label:"收入",value:9.024},{label:"毛利",value:1.302},{label:"营业亏损绝对额",value:43.296},{label:"SBC",value:13.034}]},
    {title:"剩余债务本金：回购后研究桥",unit:"百万美元；非市场公允价值",note:`${S("Q2Q")}${S("WarrantPR")}。2030已减已注销100百万；2028可交债权证未假定必行权，其他借款另列。`,rows:[{label:"2028可转本金",value:172.5},{label:"2030剩余本金",value:260},{label:"其他借款代理",value:a.openingOtherDebtM}]}
  ],
  invalidation:[
    "完整Q3显示现金、股数、成本或商业化显著偏离，资金不足覆盖可信爬坡及到期债务：暂停新增，重建融资、现金和每股模型。",
    "手机最终资格/系统现场可靠性未通过或持续延期，可售产量/成本未达到可解释经济性；不能只用某一步良率或小电芯展示维持原thesis。",
    "韩国100,000单位PO被延后/削减、客户机会未转重复订单，或供应链资质不适用具体采购要求：下调可兑现收入，不能用pipeline补缺口。",
    "融资价格低于假设、资本无法取得、转换/权证与capped-call实际条款改变股权索偿：旧三档失效，不把货架或未行权现金当已落实资金。",
    "安全、产品责任、客户信任、披露/关联交易或经营控制出现重大未解问题，或成长融资风险超出组合预算：先解决可理解性，不因低绝对股价自动下注。"
  ],
  reviewTriggers:[
    "11月12日完整Q3及13:00 ET视频会（新西兰11月13日07:00）：核对初步11百万营收、39.294百万营业亏、512百万现金范围与降本实际效果。",
    "最终权证协议、分配/除权与资格、3美元现金或2028交债机制、3.30提前到期条件、note-pass-through及实际股数；这些会改变证券权益，需刷新报告后再谈限价。",
    "2028年5月1日与2030年9月15日债务路线、实际回购/行权/capped-call结算和现金使用；分清一次债务收益、股本融资和营业回款。",
    "Honor及其他客户的测试协议、最终资格、系统验证、订单交付/回款，眼镜样品与pack数量口径、韩国PO/扩产、Fab2完整可售良率/UPH/单位成本与2027租期安排。",
    "每季更新净经营现金、净资本、经济SBC/股数和资金跑道；连续亏损与未来筹资不能靠某次融资公告永久解决，评估与其他成长股共同风险。"
  ],
  sources:sources.map((s,i)=>({label:`[S${i+1}] ${sourceNames[s.id]||s.type||s.id}`,url:s.url,date:`${s.date}；${s.id==="quote"?q.providerLabel:s.type||""}；核验日2026-11-05 NZDT`})),
  evidenceFacts:f,model:{...m,parentAudit:{status:"annual-FCFF-cash-principal-financing-shares-rights-IRR-and-reverse-independently-reconstructed",caps,ranges}},modelAudit:e.audit,portfolioSnapshot:portfolio
};
validateDecisionReport(r,watch);
await fs.writeFile(new URL("./envx-analysis-input-2026-11-05.json",import.meta.url),JSON.stringify(r,null,2)+"\n");
console.log(JSON.stringify({symbol:r.symbol,quote:r.quote,values:scenarios.map(s=>({id:s.id,today:s.todayValue,year5:s.year5Price})),entries:decisionEntryPlan(r).map(({tier,low,high,dollars,shares})=>({tier,low,high,dollars,shares})),baseFinance:br.externalFinanceThrough2031M,baseShares:br.year5SharesM,bullRightsIrr:bull.packageIrr,audit:r.model.parentAudit.status},null,2));
