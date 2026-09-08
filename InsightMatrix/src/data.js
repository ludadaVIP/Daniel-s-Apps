import { Users, Brain, Globe2, TrendingUp, Factory, Target, LayoutDashboard, Compass, History, Network, BookOpen } from 'lucide-react';
export const categories = [
 {id:'human-nature',label:'人性',icon:Users,color:'#ae774a',description:'看见激励与动机'},
 {id:'psychology',label:'心理',icon:Brain,color:'#8c79a8',description:'识别思维的偏差'},
 {id:'society',label:'社会',icon:Globe2,color:'#6386a2',description:'理解制度与群体'},
 {id:'economics',label:'经济',icon:TrendingUp,color:'#558774',description:'穿透周期与价格'},
 {id:'industries',label:'产业',icon:Factory,color:'#a58d4e',description:'拆解商业与竞争'},
 {id:'investing',label:'投资',icon:Target,color:'#517e8a',description:'形成独立的判断'},
];
export const categoryOf=id=>categories.find(c=>c.id===id)||categories[0];
export const nav=[{id:'today',label:'今日认知',icon:LayoutDashboard},{id:'explore',label:'知识探索',icon:Compass},{id:'cases',label:'历史案例',icon:History},{id:'graph',label:'认知图谱',icon:Network},{id:'theses',label:'我的判断',icon:Target},{id:'profile',label:'学习档案',icon:BookOpen}];
export const dayKey=(date=new Date())=>[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
export const dayNumber=day=>Math.floor(Date.parse(day+'T00:00:00Z')/86400000);
export const questions=[
 {title:'所有人都看好时，风险藏在哪里？',context:'一家热门公司的收入持续增长，估值达到过去五年高位。朋友都说：“这次不一样。”你会如何区分一个好公司和一笔好投资？',hint:'从预期差、基本概率和价格三个角度，写下你的判断。',tags:['逆向思考','安全边际','群体行为'],reflection:['当前价格已经包含了怎样的增长预期？把好公司与好价格分开。','列出一个最有力的反对理由，再寻找能推翻它的证据。','如果增长不及预期，你的损失空间有多大？']},
 {title:'利润在增长，为什么现金变少了？',context:'一家企业的利润增长 30%，但经营现金流连续两年为负。管理层解释，这是为未来增长提前投入。你会先检查哪些数据？',hint:'把会计利润、营运资本与资本开支分开。',tags:['现金流','商业模式','财务质量'],reflection:['区分经营现金流与自由现金流，资本开支不直接进入经营现金流。','应收账款和存货的变化，是否与收入增长匹配？','哪项指标应该在什么时候改善？把解释转化为可验证的预测。']},
 {title:'降息了，资产价格就一定上涨吗？',context:'央行宣布降息，但企业盈利预期正在下调。你看到“流动性牛市即将到来”的讨论，这个判断需要哪些前提？',hint:'把折现率、盈利预期与市场已经计入的预期放在一起看。',tags:['利率','预期差','经济周期'],reflection:['先问降息的原因：通胀回落，还是需求恶化？','利率下降与现金流下修可能方向相反。','区分事件发生与事件超出预期。']},
 {title:'一次正确的结果，等于一次好决策吗？',context:'你没有研究就买入一只股票，一个月后上涨 40%。这是能力，还是运气？下次你会重复同样的决策吗？',hint:'把决策前能够获得的信息，与事后的结果分开。',tags:['结果偏差','概率思维','决策复盘'],reflection:['只用决策当时可知的信息评价过程。','记录原始概率，观察多次判断的校准程度。','一次结果不足以区分运气与能力，寻找可重复的过程。']},
 {title:'如果激励变了，人的行为会怎么变？',context:'一家公司把销售奖金完全绑定于签约金额。一年后收入快速增长，坏账和退款率也在上升。问题出在哪里？',hint:'从指标、行为变化与被忽略的成本，画出因果链。',tags:['激励机制','代理问题','二阶效应'],reflection:['衡量的指标是否等同于真正想要的结果？','沿着激励寻找行为变化，不只归因于个人品质。','加入回款与长期客户价值约束，并检查新的副作用。']},
 {title:'一个好故事，需要什么证据才能成立？',context:'某项新技术吸引了大量投资，几乎每家公司都声称自己会受益。你如何判断谁能把技术进步转化为持续利润？',hint:'区分市场规模、价值创造与价值捕获。',tags:['技术周期','竞争优势','价值捕获'],reflection:['增长的市场未必产生好的股东回报，检查竞争与供给扩张。','产业链中哪些环节稀缺且不可轻易替代？','提出可证伪指标，例如单位经济、留存率与议价能力。']},
 {title:'亏损之后，你是在等待还是不愿认错？',context:'持仓下跌 25%，你决定“等回本再卖”。如果现在没有这只股票，你还会以今天的价格买入吗？',hint:'忽略买入价格，重新评估未来收益、风险与机会成本。',tags:['损失厌恶','沉没成本','机会成本'],reflection:['成本价影响盈亏，却不决定资产未来的价值。','比较继续持有与其他选择的前瞻收益和风险。','回看买入前的证伪条件，事实是否已经改变？']}
];
export const emptyState={bookmarks:[],completed:[],answers:{},theses:[],activity:[]};
