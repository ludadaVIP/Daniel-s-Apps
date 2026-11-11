import { frameNames, plantObservations, storyEvidence, storyModelValue, storyNames, type StoryCase, type StoryTopic } from './storyProject';
import { t } from './schema';
import { disturbanceComparison } from './evolutionCycleModel';

export const storyNotes = {
  plant: [
    t('原创虚构幼苗，两个独立组，每组3株。第0天各0.20 g；7天后收获并烘干测干质量。光指数20组：0.28/0.30/0.32 g；60组：0.44/0.46/0.48 g。起始与终点为匹配的破坏性取样组，不是同株反复烘干。其他条件设为相同；没有误差区间，不能推断真实物种。', 'Original fictional seedlings, two independent groups of three. Initial matched destructive samples: 0.20 g each. Harvested and dried at day 7: light index 20, 0.28/0.30/0.32 g; index 60, 0.44/0.46/0.48 g. Initial and final samples are matched cohorts, not repeatedly dried living plants. Other conditions are stipulated equal; no confidence interval or real-species prediction.'),
    t('CO₂的碳经光合作用进入糖，糖可供应细胞分裂与生长材料，也参与呼吸。水、矿质营养和叶面积会影响净积累。此机制是可能解释，干质量数据本身没有直接测定光合作用或证明全部因果。', 'Photosynthesis incorporates CO₂ carbon into sugars supporting division and growth materials; sugars also enter respiration. Water, minerals and leaf area affect net accumulation. This is a possible explanation; dry-mass observations did not directly measure photosynthesis or establish all causes.'),
    t('另一独立模型：CO₂指数60、25°C、水充足、固定叶面积；光指数20→60时相对光合速率40→100。最小容量规则与25°C最适都是虚构选择。光合速率不是7天干质量，模型不把速率换算成生长。', 'Separate model: CO₂ index 60, 25°C, adequate water and fixed leaf area; light index 20→60 gives relative photosynthesis rate 40→100. The minimum-capacity rule and 25°C optimum are invented. Rate is not seven-day dry mass; this model does not convert rate into growth.'),
    t('提案：随机分组，改变光条件；匹配样本在第0/7天测干质量，至少3个独立重复；控制种类、初始大小、土壤、水、CO₂与温度。增加光后未增加干质量会挑战“本条件下光限制净积累”的主张；还须查呼吸、叶面积等。', 'Proposal: random groups with changed light; measure dry mass of matched samples at day 0/7 with at least three independent replicates. Hold species, initial size, soil, water, CO₂ and temperature. No increase in dry mass challenges the claim that light limits net accumulation here; examine respiration and leaf area too.'),
  ],
  enzyme: [
    t('虚构酶E：5°C冷却测定约16.8；复温40°C后80.0相对初速单位。冷却史设定不破坏结构。所有曲线点是模型输出，非实测值，不代表所有酶的最适温度。', 'Fictional enzyme E: about 16.8 relative initial-rate units at 5°C, then 80.0 on rewarming to 40°C. Cooling is stipulated not to damage structure. All values are model outputs, not measurements or universal enzyme optima.'),
    t('酶的空间结构使活性部位与合适底物结合，促进反应而不在每次反应中消耗。低温可降低反应速率；热处理的结构损伤是另一机制，不能从慢就断言变性。', 'Enzyme structure enables an active site to bind suitable substrate and catalyse reactions without being consumed each cycle. Cold can slow rate; heat damage is a different mechanism. A slow rate alone does not establish denaturation.'),
    t('共同40°C、pH7、底物指数8、酶量1：完整酶80.0；先75°C处理10分钟、再冷却至40°C的酶6.4。模型明确假定仅8%仍活性；这个比例不是通用实验事实。酶量增加时速率可超过100。', 'Same assay at 40°C, pH7, substrate index 8 and enzyme amount 1: intact enzyme 80.0; after 75°C for 10 min then cooling to 40°C, 6.4. The model stipulates 8% remains active; this fraction is not a universal experimental fact. Rate may exceed 100 with more enzyme.'),
    t('提案：同批酶分组改变预处理温度；全部复温同一测定温度后测单位时间产物初速，固定pH/底物/酶量/处理时间，至少3次独立重复。热处理组恢复到对照水平，会挑战本例的不可逆损伤假设。', 'Proposal: vary pretreatment temperature within one enzyme batch; assay all groups at the same temperature and measure initial product rate. Hold pH, substrate, enzyme amount and treatment duration, with at least three independent replicates. Recovery to the intact control challenges the assumed irreversible damage here.'),
  ],
  ecology: [
    t('原创虚构落叶分解功能指数：各组扰动前100，记录第1与30天。干旱下A四种不同耐湿性：70→90；B四种相似敏感性：40→65；C一种耐旱分解者：65→88。曲线不是物种数或实测种群预测。切换洪水可比较不同排序。', 'Original fictional litter-decomposition function index: baseline 100, measured model days 1 and 30. Drought: A four differing tolerances 70→90; B four similar sensitivities 40→65; C one drought-tolerant decomposer 65→88. Curves are not richness or empirical population forecasts. Switch to flooding to compare rankings.'),
    t('分解者释放酶，分解落叶有机物；部分碳经呼吸回到CO₂，部分进入分解者或残留有机物；矿质元素可再次利用。干湿条件影响酶作用与分解者存活，幸存的不同功能者可能补偿。碳循环不等于能量循环。', 'Decomposers release enzymes that break down litter organics; some carbon returns as CO₂ by respiration, some enters decomposers or remains in organic matter. Mineral elements can be reused. Moisture affects enzyme activity and survival; differing survivors may compensate. Carbon cycling is not energy cycling.'),
    t('A与B同为4种，功能反应仍不同；C一种在干旱下比B恢复更多。起始分解功能和落叶输入相同，耐湿性与幸存者是预先设定的解释。30天内恢复损失比例=(第30天−第1天)/(100−第1天)，不是普遍恢复速率，也不凭曲线证明机制。', 'A and B both have four species yet differ; single-species C recovers more than B after drought. Starting function and litter input are equal; moisture traits and survivors are prescribed explanations. Fraction of lost function regained in 30 days=(day30−day1)/(100−day1), not a universal recovery rate or proof of mechanism.'),
    t('提案：改变土壤水分并设未扰动对照，测固定天数后单位落叶质量损失，控制落叶种类、起始质量、温度与分解者初始功能；至少3个独立微环境重复。若不同耐湿性群落不比共同敏感群落保持更多分解功能，应修正补偿解释。', 'Proposal: vary soil moisture with an undisturbed control; measure litter mass loss over fixed days. Hold litter type, starting mass, temperature and initial decomposer function, with at least three independent microcosms. If differing tolerances retain no more function than shared sensitivities, revise the compensation explanation.'),
  ],
};
export const xmlEscape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!);
const text = (x: number, y: number, s: string, size = 13) => `<text x="${x}" y="${y}" font-size="${size}">${xmlEscape(s)}</text>`;
const arrow = (x: number, y: number, w = 65) => `<path d="M${x} ${y}h${w}m-8-5 8 5-8 5" stroke="#487c70" stroke-width="3" fill="none"/>`;
const box = (x: number, y: number, title: string, color = '#dfead3') => `<rect x="${x}" y="${y}" width="115" height="54" rx="16" fill="${color}" stroke="#6a876a"/>${text(x + 8,y + 24,title)}`;
const bars = (rows: { label: string; value: number }[], max = 100) => rows.map((r,i) => `${text(15, 38 + i * 48, r.label, 12)}<rect x="154" y="${20+i*48}" width="${r.value/max*225}" height="25" rx="4" fill="${i%2 ? '#b3895d' : '#709c7e'}"/>${text(160+r.value/max*225,38+i*48,r.value.toFixed(2),12)}`).join('');
/** Original diagrams contain only authored labels and bounded model values. */
export function storySceneSvg(topic: StoryTopic, frame: number, input: number) {
  let body = '';
  if (topic === 'plant') {
    if (frame === 0) {
      body = bars([{label:'20 light · day 7 g',value:0.30},{label:'60 light · day 7 g',value:0.46}],0.6);
      body += text(15,140,'Day 0: 0.20 / 0.20 / 0.20 g in each matched cohort',12);
      body += text(15,164,'20: 0.28 / 0.30 / 0.32 g · 60: 0.44 / 0.46 / 0.48 g',12);
      body += text(15,192,'虚构干质量观测 / Fictional dry-mass observations',14);
    } else if (frame === 1) {
      body = `<ellipse cx="218" cy="101" rx="96" ry="63" fill="#d5e8c6" stroke="#5b805a" stroke-width="3"/><ellipse cx="217" cy="98" rx="48" ry="29" fill="#92b471"/><path d="M186 90h62m-62 12h62" stroke="#547d47" stroke-width="5"/>${text(180,144,'叶绿体 / Chloroplast',12)}${text(16,55,'CO₂ + H₂O')}${arrow(24,79,90)}${text(165,24,'光 / Light energy')}${arrow(220,32,0)}${arrow(320,100,52)}${text(340,80,'糖 / Sugar')}${text(180,182,'→ 生长材料 / Growth material')}${text(180,206,'→ 呼吸 / Respiration → CO₂ + heat')}`;
    } else if (frame === 2) {
      body = bars([{label:'20 light · model rate',value:40},{label:'60 light · model rate',value:100}],120)+text(15,140,`Selected light ${input}: rate ${storyModelValue(topic,input).toFixed(0)}`,15)+text(15,168,'CO₂ 60 · 25°C · adequate water · fixed leaf area',12)+text(15,197,'速率 ≠ 生长干质量 / Rate ≠ growth dry mass',15);
    } else {
      body = `${box(15,40,'光20 / Light20')}${arrow(133,68,42)}${box(182,40,'光60 / Light60')}${text(18,132,'Day 0 → Day 7 · dry mass (g) · n ≥ 3')}${text(18,160,'Same species / water / soil / CO₂ / temperature',12)}<path d="M60 181h300m-150 0v35m-46 0h92" stroke="#88724f" stroke-width="3"/>${text(58,205,'0.20 g → ?')}${text(255,205,'0.20 g → ?')}`;
    }
  } else if (topic === 'enzyme') {
    if (frame === 0) body = bars([{label:'5°C cooled',value:storyModelValue(topic,5)},{label:'40°C rewarmed',value:80}],100)+text(15,145,'相对初速 / Relative initial rate',15)+text(15,176,'虚构酶E模型输出 / Fictional enzyme E model',13)+text(15,204,`Selected assay ${input}°C: ${storyModelValue(topic,input).toFixed(1)}`,15);
    else if (frame === 1) body = `<path d="M60 60h110v35h-35v30h35v45H60Z" fill="#9fb9cf" stroke="#5c7998" stroke-width="3"/><path d="M210 92h-60v31h60Z" fill="#d4ad77" stroke="#94713c" stroke-width="3"/>${arrow(230,105,48)}<path d="M310 60l95 25-18 50-70 35 10-60Z" fill="#bba0ae" stroke="#8d6b7a" stroke-width="3"/>${text(45,202,'匹配的活性部位 / Matching active site',13)}${text(298,202,'结构受损 / Damaged',13)}${text(20,28,'底物 → 产物；酶不被逐次消耗 / Substrate → product',13)}`;
    else if (frame === 2) body = bars([{label:'Intact · 40°C assay',value:80},{label:'75°C ×10 min →40°C',value:6.4}],100)+text(15,147,'Same pH7 · substrate 8 · enzyme amount 1',12)+text(15,177,'先前热史不同，测定温度相同 / Same assay temperature',13)+text(15,204,'假定剩余8%活性 / Assumed 8% remains active',13);
    else body = `${box(10,35,'低温 / Cold')}${box(165,35,'对照 / Control')}${box(320,35,'热史 / Heated','#ead8df')}${arrow(65,108,0)}${text(30,130,'全部同温测初速 / Assay at the same temperature',15)}${[0,1,2].map((i)=>`<path d="M${85+i*140} 155v52h40v-52m-45 0h50" fill="#dbe6ed" stroke="#6c8f9b" stroke-width="3"/>`).join('')}${text(18,233,'固定pH、酶量、底物与时间 / Hold pH, enzyme, substrate, time',12)}`;
  } else {
    const disturbance = input === 0 ? 'drought' : 'flood';
    if (frame === 0) {
      body = `<path d="M55 25v160h355" fill="none" stroke="#63715a"/>${text(10,22,'Index',12)}${text(40,203,'0')}${text(165,203,'1')}${text(369,203,'30 days')}`;
      (['diverse','redundant','single'] as const).forEach((community,i)=>{ const rows=disturbanceComparison({community,disturbance}).records; const xs=[55,170,385], colors=['#4a846e','#b57b52','#7c70a7']; body+=`<polyline points="${rows.map((r,j)=>`${xs[j]},${185-r.function*1.5}`).join(' ')}" fill="none" stroke="${colors[i]}" stroke-width="3"/>`+rows.map((r,j)=>`<circle cx="${xs[j]}" cy="${185-r.function*1.5}" r="4" fill="${colors[i]}"/>${text(xs[j]!-10,178-r.function*1.5,r.function.toString(),11)}`).join(''); body+=`<rect x="${60+i*120}" y="223" width="12" height="8" fill="${colors[i]}"/>${text(77+i*120,232,['A · 4 spp','B · 4 spp','C · 1 sp'][i]!,12)}`; });
    } else if (frame === 1) body = `${box(8,40,'落叶 / Litter')}${arrow(130,66,40)}${box(178,40,'酶 / Enzymes')}${arrow(300,66,30)}${box(338,40,'小分子 / Small')}${text(22,135,'分解者 / Decomposers → 呼吸 / Respiration → CO₂',14)}${text(22,170,'部分碳 → 生物体或残留有机物 / Carbon retained',13)}${text(22,205,'矿质可再用；能量散热 / Minerals reused; energy → heat',13)}`;
    else if (frame === 2) body = bars((['diverse','redundant','single'] as const).map((community,i)=>({label:['A · 4 spp · day30','B · 4 spp · day30','C · 1 sp · day30'][i]!, value:disturbanceComparison({community,disturbance}).records[2]!.function})),110)+text(15,192,'功能差异 + 扰动类型 / Functional traits + disturbance',13)+text(15,220,`A regained loss in 30 days: ${(storyModelValue(topic,input)*100).toFixed(1)}%`,13);
    else body = `${box(10,35,'未扰动 / Control')}${box(165,35,'较干 / Drier')}${box(320,35,'较湿 / Wetter')}${[0,1,2].map((i)=>`<path d="M${25+i*155} 130h90v65h-90Z" fill="#d9c5a2" stroke="#947a4c"/><path d="M${40+i*155} 151l35 16 22-22" fill="none" stroke="#67805b" stroke-width="6"/>`).join('')}${text(15,222,'固定落叶质量与时间 / Same starting litter mass and time',13)}${text(15,243,'独立重复 n ≥ 3 · 测质量损失 / Independent replicates; mass loss',12)}`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 465 260" role="img"><title>${xmlEscape(`${storyNames[topic].zh} / ${storyNames[topic].en} — ${frameNames[frame]!.zh} / ${frameNames[frame]!.en}`)}</title><rect width="465" height="260" rx="15" fill="#f1f3e9"/><g font-family="system-ui, sans-serif" fill="#344a3b">${body}</g></svg>`;
}
function wrap(s: string, width = 90) {
  const lines: string[]=[];
  for(const paragraph of s.split('\n')) { let line='', count=0; for(const char of Array.from(paragraph)){ const w=/[\u2e80-\uffff]/.test(char)?2:1; if(count+w>width){ lines.push(line); line=''; count=0; } line+=char; count+=w; } lines.push(line); }
  return lines;
}
/** Dynamic height retains every caption, numeric source record and test-plan field. No foreignObject or executable content. */
export function storySvg(topic: StoryTopic, d: StoryCase) {
  let y=40, body='';
  const block=(heading:string, value:string)=>{ body+=text(30,y,heading,18); y+=28; for(const line of wrap(value)){ body+=text(30,y,line,15); y+=23; } y+=20; };
  block('解释一个看得见的现象 / Explain a visible phenomenon',`${storyNames[topic].zh} / ${storyNames[topic].en} · 学生作品 / Learner storyboard`);
  for(let i=0;i<4;i++){
    block(`${frameNames[i]!.zh} / ${frameNames[i]!.en}`,'');
    body+=`<svg x="30" y="${y}" width="720" height="403" viewBox="0 0 465 260">${storySceneSvg(topic,i,d.input).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</svg>`; y+=425;
    block('我的说明 / My caption',`${d.frames[i]!.zh}\n${d.frames[i]!.en}`);
    block('科学线索与边界 / Scientific clues and limits',`${storyNotes[topic][i]!.zh}\n${storyNotes[topic][i]!.en}`);
  }
  block('全部数值记录 / All numeric records',storyEvidence(topic,d.input).map((r)=>`${r.id}: ${r.label.zh} / ${r.label.en}`).join('\n'));
  if(topic==='plant')block('原始重复记录 / Raw replicates',plantObservations.map((r)=>`light ${r.light}; baseline cohort ${r.baselineCohort}, day0 ${r.initial.join(', ')} g; separate endpoint cohort ${r.endpointCohort}, day7 ${r.final.join(', ')} g`).join('\n'));
  const names={observation:'观察 / Observation',assumptions:'模型假设 / Model assumptions',chain:'解释链 / Mechanism chain',variable:'改变变量 / Changed variable',measured:'测量结果 / Measured outcome',controls:'保持条件 / Held controls',challenge:'反驳结果 / Challenging result',zh:'中文总结 / Chinese summary',en:'英文总结 / English summary'};
  block('我引用的记录 / My cited records',d.citations.join('\n'));
  for(const key of Object.keys(names) as (keyof typeof names)[])block(names[key],d[key]);
  block('独立重复 / Independent replicates',String(d.repeats));
  block('核对说明 / Check note','填写完整只代表结构齐备，不自动证明解释或英语正确。 / Structural completeness does not verify scientific truth or English quality. Original fictional teaching data; Study Biology.');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="780" height="${y+20}" viewBox="0 0 780 ${y+20}" role="img"><title>${xmlEscape(storyNames[topic].zh)} / ${xmlEscape(storyNames[topic].en)} storyboard</title><rect width="780" height="${y+20}" fill="#fffdf7"/><g font-family="system-ui, sans-serif" fill="#344a3b">${body}</g></svg>`;
}

