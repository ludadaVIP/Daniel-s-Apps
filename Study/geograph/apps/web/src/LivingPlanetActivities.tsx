import type { LanguageMode, LocalizedText } from '@study/shared';
import type { ActivityState } from './progress';
import { t, words } from './content';
import { Text } from './ui';
import { LivingPlanetVisual } from './LivingPlanetVisuals';
import {
  livingPlanetEvidence,
  livingPlanetFinished,
} from './livingPlanetModels';

type Option = [string, string, string];
type Decisions = Record<string, string>;

const evidenceLabels: Record<string, [string, string]> = {
  'rainforest-layers': ['比较雨林的四个层次', 'Compare four rainforest layers'],
  'rainforest-light': ['比较资源组合', 'Compare resource combinations'],
  'rainforest-web': ['查看相互关系网', 'Inspect the relationship web'],
  'biome-wet-warm': ['匹配温暖潮湿案例', 'Match warm/wet case'],
  'biome-dry-warm': ['匹配温暖较干案例', 'Match warm/drier case'],
  'biome-cold-case': ['匹配寒冷案例', 'Match cold case'],
  'extreme-polar': ['比较极地条件', 'Compare polar conditions'],
  'extreme-alpine': ['比较高山条件', 'Compare alpine conditions'],
  'extreme-tradeoff': ['查看适应的取舍', 'Inspect adaptation trade-offs'],
  'storm-energy': ['追踪能量链', 'Trace energy chain'],
  'storm-structure': ['查看多个强度条件', 'Inspect multiple intensity conditions'],
  'storm-risk-view': ['分开风险的三个部分', 'Separate three parts of risk'],
};

function Choices({
  mode,
  prompt,
  value,
  options,
  onChoose,
}: {
  mode: LanguageMode;
  prompt: LocalizedText;
  value: string;
  options: Option[];
  onChoose: (value: string) => void;
}) {
  return (
    <div className="geo-choices" role="group" aria-label={words(mode, prompt.zh, prompt.en)}>
      {options.map(([value, zh, en]) => (
        <button key={value} aria-pressed={value === value} onClick={() => onChoose(value)}>
          <Text mode={mode} text={t(zh, en)} />
        </button>
      ))}
    </div>
  );
}

function Question({
  mode,
  d,
  patch,
  id,
  prompt,
  answer,
  options,
  why,
  hint,
}: {
  mode: LanguageMode;
  d: Decisions;
  patch: (values: Decisions) => void;
  id: string;
  prompt: LocalizedText;
  answer: string;
  options: Option[];
  why: LocalizedText;
  hint: LocalizedText;
}) {
  return (
    <section className="geo-terrain-question">
      <h4><Text mode={mode} text={prompt} /></h4>
      <div className="geo-choices" role="group" aria-label={words(mode, prompt.zh, prompt.en)}>
        {options.map(([value, zh, en]) => (
          <button key={value} aria-pressed={d[id] === value} onClick={() => patch({ [id]: value })}>
            <Text mode={mode} text={t(zh, en)} />
          </button>
        ))}
      </div>
      {d[id] && <p role="status" className={`geo-feedback ${d[id] === answer ? 'success' : ''}`}><Text mode={mode} text={d[id] === answer ? why : hint} /></p>}
    </section>
  );
}

export function LivingPlanetExplorer({
  id,
  mode,
  state,
  onChange,
  mission = false,
  mystery = false,
  panel = 0,
}: {
  id: string;
  mode: LanguageMode;
  state: ActivityState;
  onChange: (next: ActivityState) => void;
  mission?: boolean;
  mystery?: boolean;
  panel?: number;
}) {
  const d = state.decisions;
  const patch = (values: Decisions) => onChange({ ...state, decisions: { ...d, ...values } });
  const mark = (key: string) => patch({ [key]: 'yes' });
  if (mystery) return <LivingPlanetVisual id={id} panel={0} mode={mode} />;
  if (!mission) return <LivingPlanetVisual id={id} panel={panel} mode={mode} />;
  const status = (
    <>
      <ul className="geo-weather-checklist">
        {livingPlanetEvidence[id]!.map((key) => <li key={key}>{d[key] === 'yes' ? '✓' : '○'} <Text mode={mode} text={t(...evidenceLabels[key]!)} /></li>)}
      </ul>
      <p className={`geo-feedback ${livingPlanetFinished(id, d) ? 'success' : ''}`} role="status"><Text mode={mode} text={livingPlanetFinished(id, d) ? t('✓ 任务证据齐全。把一个关系和一个局限说给家长听。', '✓ Mission evidence complete. Tell a parent one relationship and one limit.') : t('完成每一个观察和推理；答错可以重试。', 'Complete each observation and reasoning step; incorrect ideas can be retried.')} /></p>
    </>
  );
  if (id === 'GEO-041') return <>
    <LivingPlanetVisual id={id} panel={d['rainforest-view'] === 'web' ? 2 : d['rainforest-view'] === 'resources' ? 1 : 0} mode={mode} />
    <h3>{words(mode, '在图解中找证据', 'Find evidence in the diagrams')}</h3>
    <div className="geo-choices"><button onClick={() => patch({ 'rainforest-view': 'layers', 'rainforest-layers': 'yes' })}>{words(mode, '层次', 'Layers')}</button><button onClick={() => patch({ 'rainforest-view': 'resources', 'rainforest-light': 'yes' })}>{words(mode, '资源组合', 'Resource combinations')}</button><button onClick={() => patch({ 'rainforest-view': 'web', 'rainforest-web': 'yes' })}>{words(mode, '关系网', 'Relationship web')}</button></div>
    <Question mode={mode} d={d} patch={patch} id="rainforest-layer" prompt={t('接住最多阳光、形成连续树冠的一层通常是什么？', 'Which layer usually catches much sunlight and forms a continuous tree roof?')} answer="canopy" options={[["canopy",'林冠层 / canopy','Canopy'],['floor','林地表面 / floor','Forest floor'],['bedrock','基岩 / bedrock','Bedrock']]} why={t('林冠层是连续的树冠；并非每棵树高度相同。', 'The canopy is the continuous tree roof; not every tree has the same height.')} hint={t('看中间较密的一层，而不是最暗的地表。', 'Look at the dense middle layer, not the darkest floor.')} />
    <Question mode={mode} d={d} patch={patch} id="rainforest-diversity" prompt={t('为什么温暖潮湿再加上多层结构，常能支持更多不同生活方式？', 'Why can warmth, moisture and layered structure often support more different ways of living?')} answer="many-niches" options={[["many-niches",'资源与位置有多种组合','Resources and places have many combinations'],['same','每处资源完全相同','Every resource is identical'],['magic','雨林有魔法规则','Rainforests have a magic rule']]} why={t('多种资源和微环境可能形成更多生态位，但不保证每处都相同。', 'Many resources and micro-environments can create more niches, without guaranteeing sameness everywhere.')} hint={t('把“机会多”与“每处完全一样”分开。', 'Separate many opportunities from every place being identical.')} />
    <Question mode={mode} d={d} patch={patch} id="rainforest-limit" prompt={t('看到一张绿树照片，能直接数出该地全部物种吗？', 'Can one green-tree photo directly count every species at a site?')} answer="not-guarantee" options={[["not-guarantee",'不能；还需要系统观察或调查','No; systematic observation/survey is still needed'],['guarantee','能；绿色就代表全部','Yes; green shows everything'],['weather','能；只要当天晴朗','Yes; if the day is sunny']]} why={t('照片提供线索，不是完整名录或长期数据。', 'A photo provides clues, not a full inventory or long-term data.')} hint={t('问：这张图实际记录了什么？', 'Ask: what does this image actually record?')} />
    {status}
  </>;
  if (id === 'GEO-042') return <>
    <LivingPlanetVisual id={id} panel={d['biome-view'] === 'limits' ? 2 : d['biome-view'] === 'factors' ? 1 : 0} mode={mode} />
    <div className="geo-choices"><button onClick={() => patch({ 'biome-view': 'axes', 'biome-wet-warm': 'yes' })}>{words(mode, '温暖＋潮湿', 'Warm + wet')}</button><button onClick={() => patch({ 'biome-view': 'factors', 'biome-dry-warm': 'yes' })}>{words(mode, '温暖＋较干', 'Warm + drier')}</button><button onClick={() => patch({ 'biome-view': 'limits', 'biome-cold-case': 'yes' })}>{words(mode, '寒冷案例', 'Cold case')}</button></div>
    <Question mode={mode} d={d} patch={patch} id="biome-warm-wet" prompt={t('在这个入门概念图中，长期温暖而水分充足最接近哪种大类？', 'In this introductory concept graph, which broad type is closest to long-term warmth and plentiful water?')} answer="forest" options={[["forest",'森林','Forest'],['tundra','苔原','Tundra'],['ice','海冰','Sea ice']]} why={t('温暖和稳定水分常支持森林，但仍需看土壤、季节和扰动。', 'Warmth and steady water often support forest, while soil, season and disturbance still matter.')} hint={t('沿横轴向更湿的一侧找。', 'Follow the horizontal axis toward wetter conditions.')} />
    <Question mode={mode} d={d} patch={patch} id="biome-warm-dry" prompt={t('温暖但水分较少时，概念图中的哪类开阔植被更接近？', 'With warmth but less water, which more open vegetation type is closer in the concept graph?')} answer="grassland" options={[["grassland",'草原 / grassland','Grassland'],['forest','雨林 / rainforest','Rainforest'],['reef','珊瑚礁 / reef','Coral reef']]} why={t('草原是概念图中的一个可能结果，不是所有干暖地点的固定答案。', 'Grassland is one possible result in the model, not a fixed answer for every warm/dry place.')} hint={t('注意水分比温暖潮湿情境少。', 'Notice there is less water than in the warm/wet setting.')} />
    <Question mode={mode} d={d} patch={patch} id="biome-cold" prompt={t('寒冷且生长季短的陆地环境在概念图中最接近？', 'Which is closest in the concept graph to a cold land environment with a short growing season?')} answer="tundra" options={[["tundra",'苔原','Tundra'],['rainforest','热带雨林','Tropical rainforest'],['mangrove','红树林','Mangrove']]} why={t('苔原概念强调寒冷和短生长季；真实地点还受海拔、土壤等影响。', 'Tundra emphasizes cold and a short growing season; real places also depend on altitude, soils and more.')} hint={t('不要只找“雨少”；同时看温度。', 'Do not only look for low water; also read temperature.')} />
    <Question mode={mode} d={d} patch={patch} id="biome-limit" prompt={t('气候图能替代实地植被调查吗？', 'Can a climate graph replace field observation of vegetation?')} answer="not-label" options={[["not-label",'不能；它提供假设，仍要看当地证据','No; it suggests a hypothesis, local evidence is still needed'],['label','能；每格只有一种植被','Yes; every grid has one vegetation'],['ignore','不需要天气或水分','Weather and water do not matter']]} why={t('生物群系是解释框架，不是给每块土地贴永久标签。', 'Biomes are an explanatory framework, not permanent labels for every patch of land.')} hint={t('回到“同一气候≠一个保证景观”。', 'Return to “same climate ≠ one guaranteed landscape”.')} />
    {status}
  </>;
  if (id === 'GEO-043') return <>
    <LivingPlanetVisual id={id} panel={d['extreme-view'] === 'tradeoff' ? 2 : d['extreme-view'] === 'traits' ? 1 : 0} mode={mode} />
    <div className="geo-choices"><button onClick={() => patch({ 'extreme-view': 'compare', 'extreme-polar': 'yes' })}>{words(mode, '极地条件', 'Polar conditions')}</button><button onClick={() => patch({ 'extreme-view': 'traits', 'extreme-alpine': 'yes' })}>{words(mode, '高山条件', 'Alpine conditions')}</button><button onClick={() => patch({ 'extreme-view': 'tradeoff', 'extreme-tradeoff': 'yes' })}>{words(mode, '取舍', 'Trade-offs')}</button></div>
    <Question mode={mode} d={d} patch={patch} id="extreme-cold" prompt={t('厚毛、脂肪层或躲避寒风等特征在寒冷中最直接可能有什么作用？', 'What can thick fur, fat layers or shelter from wind most directly do in cold conditions?')} answer="reduce-heat-loss" options={[["reduce-heat-loss",'减少散热','Reduce heat loss'],['make-summer','制造夏天','Make summer'],['predict','预测天气','Predict weather']]} why={t('它们可减少热量散失；不同生物的方法和代价不同。', 'They can reduce heat loss; organisms use different methods with different costs.')} hint={t('这是身体与环境之间的热量关系。', 'This is a heat relationship between body and environment.')} />
    <Question mode={mode} d={d} patch={patch} id="extreme-high" prompt={t('高海拔除低温外还应把哪种条件纳入解释？', 'Besides cold, which condition should be included at high altitude?')} answer="oxygen-light" options={[["oxygen-light",'空气较稀薄、辐射可能更强','Thinner air and potentially stronger radiation'],['same','条件一定完全相同','Conditions are exactly identical'],['ocean','永远在海平面','Always at sea level']]} why={t('高山和极地可都冷，但不能当成同一种环境。', 'Alpine and polar places can both be cold, but are not the same environment.')} hint={t('看高山图中与高度有关、而非只与纬度有关的线索。', 'Look for height-related clues, not only latitude.')} />
    <Question mode={mode} d={d} patch={patch} id="extreme-limit" prompt={t('一个适应特征是否在任何环境都一定最好？', 'Is one adaptive trait automatically best in every environment?')} answer="context" options={[["context",'不是；要看条件、好处和代价','No; consider conditions, benefits and costs'],['always','是；适应就是无代价','Yes; adaptation has no costs'],['species','是；同种生物永不变化','Yes; a species never changes']]} why={t('适应是特定条件下的相对优势，不是“超级能力”。', 'Adaptation is a relative advantage in particular conditions, not a superpower.')} hint={t('回看“benefit → limit / trade-off”。', 'Revisit “benefit → limit / trade-off”.')} />
    {status}
  </>;
  return <>
    <LivingPlanetVisual id={id} panel={d['storm-view'] === 'risk' ? 2 : d['storm-view'] === 'structure' ? 1 : 0} mode={mode} />
    <div className="geo-choices"><button onClick={() => patch({ 'storm-view': 'energy', 'storm-energy': 'yes' })}>{words(mode, '能量链', 'Energy chain')}</button><button onClick={() => patch({ 'storm-view': 'structure', 'storm-structure': 'yes' })}>{words(mode, '多个条件', 'Multiple conditions')}</button><button onClick={() => patch({ 'storm-view': 'risk', 'storm-risk-view': 'yes' })}>{words(mode, '风险三部分', 'Three parts of risk')}</button></div>
    <Question mode={mode} d={d} patch={patch} id="storm-fuel" prompt={t('热带气旋的能量链中，暖海面最直接提供什么？', 'In the tropical-cyclone energy chain, what does a warm ocean most directly provide?')} answer="warm-ocean" options={[["warm-ocean",'蒸发用的热和水汽来源','Heat and moisture source for evaporation'],['earthquake','地震预测','Earthquake prediction'],['mountain','更高山峰','Taller mountains']]} why={t('暖水和湿空气是支持条件之一，不代表必然形成风暴。', 'Warm water and moist air are supporting conditions, not a guarantee of a storm.')} hint={t('追踪海面到上升湿空气的箭头。', 'Trace the arrow from sea surface to rising moist air.')} />
    <Question mode={mode} d={d} patch={patch} id="storm-weakens" prompt={t('哪一组情况可能削弱热带气旋？', 'Which set of conditions can weaken a tropical cyclone?')} answer="cool-or-shear" options={[["cool-or-shear",'较冷水、干空气、强风切变或陆地','Cooler water, dry air, strong shear or land'],['hot','任何更热都无条件增强','Any extra heat always strengthens it'],['name','改一个风暴名字','Rename the storm']]} why={t('强度受多个条件共同影响，不用一个条件解释全部。', 'Intensity depends on multiple conditions; one factor does not explain everything.')} hint={t('看图中围绕中心的四个支持条件。', 'Inspect the four supporting conditions around the centre.')} />
    <Question mode={mode} d={d} patch={patch} id="storm-risk" prompt={t('同样的强风为什么在不同地方可能造成不同后果？', 'Why can the same strong wind have different consequences in different places?')} answer="hazard-exposure-vulnerability" options={[["hazard-exposure-vulnerability",'危险性、暴露度和脆弱性共同影响风险','Hazard, exposure and vulnerability jointly shape risk'],['wind-only','只看风速就足够','Wind speed alone is enough'],['blame','总是某个人的错','It is always one person’s fault']]} why={t('风险不是天气强度的同义词；准备、住房、警报与所处位置都重要。', 'Risk is not a synonym for weather strength; preparedness, housing, warnings and location matter.')} hint={t('将“风暴本身”与“谁在何处、能否应对”分开。', 'Separate the storm itself from who is where and able to cope.')} />
    <Question mode={mode} d={d} patch={patch} id="storm-limit" prompt={t('这张概念图能预测某地明天何时有风暴吗？', 'Can this concept diagram predict exactly when a place will have a storm tomorrow?')} answer="not-predict" options={[["not-predict",'不能；它解释条件，不是本地预报','No; it explains conditions, not a local forecast'],['predict','能；图上的箭头就是预报','Yes; arrows are a forecast'],['ignore','所以完全不需气象预报','So forecasts are never needed']]} why={t('真实预警应使用当地权威气象服务；课程不代替安全建议。', 'Use local official weather services for real warnings; this lesson does not replace safety advice.')} hint={t('模型是否有日期、地点和观测输入？', 'Does the model have date, place and observation inputs?')} />
    {status}
  </>;
}
