import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { renderReadyMarkdown } from './markdown.js';
import { ArrowDownRight, ArrowLeft, ArrowRight, BookOpen, Bookmark, Check, CheckCircle2, ChevronDown, ChevronRight, CircleHelp, Compass, Download, FileText, GraduationCap, Layers3, LibraryBig, ListChecks, Menu, NotebookPen, PanelLeftClose, RotateCcw, Search, Sparkles, X } from 'lucide-react';

const base = '/invest-master/api';
const emptyState = { completed: [], bookmarks: [], notes: [], answers: [], reviews: [], framework: [], caseAttempts: [] };
const nav = [
  ['home','研习首页',Compass],['path','学习路径',GraduationCap],['masters','投资大师',Layers3],
  ['concepts','概念词典',BookOpen],['cases','案例研究',FileText],['compare','思想对照',ListChecks],
  ['review','记忆复习',RotateCcw],['portfolio','毕业作品',FileText],['notebook','我的笔记',NotebookPen],['framework','我的投资体系',Sparkles],
];
const unitDefinitions = [
  ['基础地基','证券是什么、金融市场怎样运作'],
  ['定量方法','复利、折现、收益与风险的语言'],
  ['财报与会计','把三张报表连成企业的经济现实'],
  ['企业财务','资本成本、投资回报与资本去向'],
  ['股票估值','从现金流、回报率与预期理解价格'],
  ['债券与利率','现金流、收益率、久期与利率风险'],
  ['信用与债务','偿债能力、违约损失与信用利差'],
  ['组合与风险','目标、分散、仓位与再平衡'],
  ['经济与市场','通胀、政策、周期与交易机制'],
  ['衍生品与另类','看懂合约支付结构和风险边界'],
  ['研究伦理','证据、冲突、偏差与真实回报'],
  ['格雷厄姆路线','建立估值与安全边际的纪律'],
  ['巴菲特路线','找到能长期创造现金的企业'],
  ['芒格路线','用多元模型排查错误'],
  ['林奇路线','从生活线索走向严谨研究'],
  ['马克斯路线','理解价格中的预期与风险'],
  ['索罗斯路线','识别认知和现实的反馈'],
  ['博格尔路线','用成本、分散和纪律检验主动投资'],
  ['达摩达兰路线','把经营叙事转成可审计的估值假设'],
  ['费雪路线','从客户、竞争与研发验证长期成长'],
  ['达里奥路线','理解债务周期与跨环境组合风险'],
  ['斯文森路线','从长期配置走向流动性与管理人选择'],
  ['毕业研究','股票、债券与投资政策的综合作品'],
];
const units = unitDefinitions.map(([name]) => name);
const unitSubtitle = (name) => unitDefinitions.find(([unit]) => unit === name)?.[1] || '';
const frameworkSections = [
  ['objective','投资目标','我希望投资为生活解决什么问题？怎样定义成功？'],
  ['horizon','时间期限','资金何时需要使用？能承受多长时间的低迷？'],
  ['circle','能力圈','哪些生意我能解释清楚？哪些一律跳过？'],
  ['quality','企业质量','怎样判断竞争优势、现金创造和管理层？'],
  ['valuation','估值纪律','用什么情景估值？需要多大的安全边际？'],
  ['risk','风险定义','哪些情况可能造成永久资本损失？'],
  ['sizing','仓位与配置','单项风险、相关性与现金比例如何控制？'],
  ['sell','卖出规则','哪些证据变化会让我退出或修订判断？'],
  ['behavior','行为准则','大涨、大跌、观点被质疑时我怎样行动？'],
];

async function request(path, options) {
  const response = await fetch(`${base}${path}`, options);
  const value = await response.json();
  if (!response.ok) throw new Error(value.error || `请求失败 (${response.status})`);
  return value;
}
function routeFromHash() {
  const hash = location.hash.replace(/^#\/?/, '');
  const route = hash.startsWith('app/invest-master/') ? hash.slice('app/invest-master/'.length) : hash === 'app/invest-master' ? '' : hash;
  const [page, id] = route.split('/');
  return { page: page || 'home', id };
}
function navigate(page, id) { location.hash = `#/app/invest-master/${page}${id ? `/${id}` : ''}`; }
const byOrder = (a,b) => (a.order || 0) - (b.order || 0);
function IconButton({ children, label, onClick, className='' }) { return <button className={`im-icon-button ${className}`} type="button" aria-label={label} title={label} onClick={onClick}>{children}</button>; }
function Markdown({ body }) { return <div className="im-prose"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: ({href,children}) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>, h2: ({node,children}) => <h2 id={`im-section-${node.position.start.line}`}>{children}</h2> }}>{renderReadyMarkdown(body)}</ReactMarkdown></div>; }
function ProgressBar({ value }) { return <div className="im-progress-track"><span style={{width:`${Math.max(0,Math.min(100,value))}%`}} /></div>; }
function Empty({ icon: Icon=BookOpen, title, text, action, onAction }) { return <div className="im-empty"><Icon size={28} strokeWidth={1.5}/><h3>{title}</h3><p>{text}</p>{action&&<button className="im-button ghost" onClick={onAction}>{action}<ArrowRight size={16}/></button>}</div>; }
function SourceLinks({ sources, sourceUrl }) {
  const entries = sources?.length ? sources : sourceUrl ? [{label:'查看主要来源',url:sourceUrl}] : [];
  if (!entries.length) return null;
  return <section className="im-sources"><span className="im-overline">ORIGINAL SOURCES · 原始资料</span><p>正文是研习笔记；涉及历史事实时请对照原文核查。</p><div>{entries.map((item)=><a href={item.url} target="_blank" rel="noopener noreferrer" key={item.url}>{item.label}<ArrowDownRight size={15}/></a>)}</div></section>;
}
function ChapterLinks({ sections }) { return sections.map(section=><button key={section.line} type="button" onClick={()=>document.getElementById(`im-section-${section.line}`)?.scrollIntoView({behavior:'auto',block:'start'})}>{section.title}</button>); }

export default function App() {
  const [items,setItems] = useState([]), [state,setState] = useState(emptyState), [route,setRoute] = useState(routeFromHash);
  const [loading,setLoading] = useState(true),[error,setError] = useState(''),[saveError,setSaveError] = useState(''),[saving,setSaving] = useState(false);
  const [searchOpen,setSearchOpen] = useState(false),[query,setQuery] = useState(''),[mobileOpen,setMobileOpen] = useState(false),[toast,setToast] = useState('');
  const queue=useRef(Promise.resolve()),toastTimer=useRef();
  const load=useCallback(async()=>{setLoading(true);setError('');try{const [content,userState]=await Promise.all([request('/content'),request('/state')]);setItems(content.items);setState(userState);}catch(e){setError(`无法打开研习室：${e.message}`);}finally{setLoading(false);}},[]);
  useEffect(()=>{load();const sync=()=>{setRoute(routeFromHash());setMobileOpen(false);document.querySelector('.im-main')?.scrollTo(0,0);};addEventListener('hashchange',sync);const key=(event)=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();setSearchOpen(true);}if(event.key==='Escape')setSearchOpen(false);};addEventListener('keydown',key);return()=>{removeEventListener('hashchange',sync);removeEventListener('keydown',key);clearTimeout(toastTimer.current);};},[load]);
  const notify=(message)=>{setToast(message);clearTimeout(toastTimer.current);toastTimer.current=setTimeout(()=>setToast(''),2800);};
  const persist=(kind,id,value)=>{setSaving(true);const task=queue.current.catch(()=>{}).then(async()=>{try{const next=await request('/state',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({kind,id,value})});setState(next);setSaveError('');return true;}catch(e){setSaveError(`保存失败：${e.message}。请重试。`);return false;}finally{setSaving(false);}});queue.current=task;return task;};
  const grouped=useMemo(()=>Object.fromEntries(['masters','concepts','cases','lessons'].map(type=>[type,items.filter(item=>item.type===type).sort(type==='lessons'?(a,b)=>units.indexOf(a.unit)-units.indexOf(b.unit)||byOrder(a,b):byOrder)])),[items]);
  const completed=useMemo(()=>new Set(state.completed.filter(row=>{
    const lesson=items.find(item=>item.id===row.id&&item.type==='lessons');
    if(!lesson)return false;
    const answered=(lesson.quiz||[]).every(question=>state.answers.some(answer=>answer.lessonId===lesson.id&&answer.questionId===question.id&&answer.correct));
    const note=state.notes.find(entry=>entry.id===lesson.id)?.body||'';
    return answered&&note.trim().length>=(Number.isInteger(lesson.minimumNoteChars)?lesson.minimumNoteChars:20);
  }).map(row=>row.id)),[items,state.completed,state.answers,state.notes]);
  const due=useMemo(()=>{const learned=new Set(grouped.lessons.filter(item=>completed.has(item.id)).flatMap(item=>item.concepts||[]));return grouped.concepts.filter(item=>learned.has(item.id)&&(!state.reviews.find(row=>row.id===item.id)||new Date(state.reviews.find(row=>row.id===item.id).dueAt)<=new Date()));},[grouped,state.reviews,state.completed]);
  const go=(page,id)=>{navigate(page,id);setMobileOpen(false);};
  const item=items.find(entry=>entry.id===route.id);
  const bookmarked=(id)=>state.bookmarks.includes(id);
  const toggleBookmark=async(id)=>{const next=!bookmarked(id);if(await persist('bookmark',id,next))notify(next?'已加入收藏':'已移出收藏');};
  return <div className="im-shell">
    {mobileOpen&&<button className="im-backdrop" aria-label="关闭菜单" onClick={()=>setMobileOpen(false)}/>}
    <aside className={`im-sidebar ${mobileOpen?'open':''}`}>
      <button className="im-brand" onClick={()=>go('home')}><span className="im-brand-mark"><span>IM</span></span><span><strong>Invest Master</strong><small>投资大师研习室</small></span></button>
      <div className="im-sidebar-caption">你的个人研习空间</div>
      <nav aria-label="主导航">{nav.map(([id,label,Icon])=><button key={id} className={`im-nav ${route.page===id||(route.page==='read'&&((id==='path'&&item?.type==='lessons')||(id===item?.type))?'active':'')}`} onClick={()=>go(id)}><Icon size={18} strokeWidth={1.8}/><span>{label}</span>{id==='review'&&due.length>0&&<em>{due.length}</em>}</button>)}</nav>
      <div className="im-sidebar-bottom"><div className="im-sidebar-quote"><span>研习方法</span><p>读懂一个判断，<br/>再练习自己作判断。</p></div><div className="im-local"><span className="im-live-dot"/>{saving?'正在保存':saveError?'保存需重试':'学习记录保存在本机'}</div></div>
    </aside>
    <main className="im-main"><header className="im-topbar"><div className="im-breadcrumb"><IconButton className="im-mobile-menu" label="打开导航" onClick={()=>setMobileOpen(true)}><Menu size={20}/></IconButton><button onClick={()=>go('home')}>Invest Master</button><ChevronRight size={14}/><strong>{route.page==='read'?item?.title||'阅读':nav.find(n=>n[0]===route.page)?.[1]||'研习首页'}</strong></div><div className="im-top-actions"><span className="im-edition">LEARNING EDITION · 01</span><button className="im-search-trigger" onClick={()=>setSearchOpen(true)}><Search size={16}/><span>搜索大师、概念、案例</span><kbd>Ctrl K</kbd></button></div></header>
      <div className="im-content">{saveError&&<div className="im-alert" role="alert">{saveError}<button onClick={()=>setSaveError('')}>关闭</button></div>}
        {loading?<div className="im-loading"><div className="im-loading-mark">IM</div><p>正在整理研习资料…</p></div>:error?<Empty title="研习室暂时无法打开" text={error} action="重新加载" onAction={load}/>:<>
          {route.page==='home'&&<Home grouped={grouped} completed={completed} due={due} go={go}/>} 
          {route.page==='path'&&<PathPage lessons={grouped.lessons} completed={completed} go={go}/>} 
          {route.page==='masters'&&<MastersPage masters={grouped.masters} completed={completed} go={go}/>} 
          {route.page==='concepts'&&<CatalogPage type="concepts" items={grouped.concepts} masters={grouped.masters} go={go}/>} 
          {route.page==='cases'&&<CatalogPage type="cases" items={grouped.cases} masters={grouped.masters} go={go}/>} 
          {route.page==='compare'&&<ComparePage masters={grouped.masters} go={go}/>} 
          {route.page==='review'&&<ReviewPage due={due} state={state} persist={persist} go={go} notify={notify}/>} 
          {route.page==='portfolio'&&<PortfolioPage lessons={grouped.lessons.filter(lesson=>lesson.unit==='毕业研究')} state={state} go={go} notify={notify}/>} 
          {route.page==='notebook'&&<NotebookPage items={items} state={state} go={go}/>} 
          {route.page==='framework'&&<FrameworkPage state={state} persist={persist} notify={notify}/>} 
          {route.page==='read'&&(item?<Reader key={item.id} item={item} grouped={grouped} state={state} completed={completed} go={go} persist={persist} toggleBookmark={toggleBookmark} bookmarked={bookmarked} notify={notify}/>:<Empty title="内容未找到" text="返回学习路径，选择一节课程继续。" action="查看学习路径" onAction={()=>go('path')}/>)}
          <footer className="im-footer"><span>INVEST MASTER <i>✳</i> 投资大师研习室</span><span>研究思想，训练判断。内容用于学习，不替你作投资决定。</span></footer>
        </>}</div>
    </main>
    {searchOpen&&<SearchDialog items={items} query={query} setQuery={setQuery} onClose={()=>setSearchOpen(false)} go={(page,id)=>{setSearchOpen(false);setQuery('');go(page,id);}}/>}
    {toast&&<div className="im-toast" role="status"><CheckCircle2 size={17}/>{toast}</div>}
  </div>;
}

function SectionHead({ kicker,title,description,aside }) { return <div className="im-section-head"><div><span className="im-overline">{kicker}</span><h2>{title}</h2>{description&&<p>{description}</p>}</div>{aside}</div>; }
function Home({grouped,completed,due,go}) {
  const lessons=grouped.lessons,done=lessons.filter(item=>completed.has(item.id));
  const next=lessons.find(item=>!completed.has(item.id))||lessons[0];
  return <div className="im-page im-home"><div className="im-home-hero"><div className="im-hero-copy"><span className="im-overline light">THE INVESTOR'S WORKSHOP / 研习室</span><h1>从大师的方法，<br/><em>练出自己的判断。</em></h1><p>{grouped.masters.length} 种投资视角，一条循序渐进的学习路径。读原理、拆案例、回答问题，再写下你可能错在哪里。</p><div className="im-hero-actions"><button className="im-button bright" onClick={()=>go('read',next?.id)}>继续学习 <ArrowRight size={17}/></button><button className="im-text-link light" onClick={()=>go('path')}>查看全部课程 <ChevronRight size={17}/></button></div></div><div className="im-hero-visual" aria-hidden="true"><div className="im-orbit orbit-a"/><div className="im-orbit orbit-b"/><div className="im-orbit-center">判断<br/><small>JUDGMENT</small></div>{['价格','企业','成长','风险','预期','心理'].map((label,index)=><span key={label} className={`im-orbit-tag tag-${index}`}>{label}</span>)}</div></div>
    <div className="im-dashboard-strip"><div><span className="im-stat-number">{done.length}<small> / {lessons.length}</small></span><span>已完成课程</span></div><div><span className="im-stat-number">{due.length}</span><span>待复习概念</span></div><div><span className="im-stat-number">{String(grouped.masters.length).padStart(2,'0')}</span><span>大师视角</span></div><div className="im-strip-action"><span>今日的下一步</span><button onClick={()=>go('read',next?.id)}>{next?.title}<ArrowRight size={16}/></button></div></div>
    <SectionHead kicker="YOUR LEARNING PATH" title="先筑地基，再认识大师" description="逐章理解、计算、质疑与应用；完成记录代表学习过程，不代表具备独立投资资格。" aside={<button className="im-text-link" onClick={()=>go('path')}>完整路径 <ArrowRight size={16}/></button>}/>
    <div className="im-unit-grid">{units.filter(unit=>lessons.some(item=>item.unit===unit)).map((unit,index,activeUnits)=>{const group=lessons.filter(item=>item.unit===unit),finished=group.filter(item=>completed.has(item.id)).length;return <button className="im-unit-card" key={unit} onClick={()=>go('read',group.find(item=>!completed.has(item.id))?.id||group[0]?.id)}><span className="im-unit-count">{String(index).padStart(2,'0')} / {String(activeUnits.length-1).padStart(2,'0')}</span><h3>{unit}</h3><p>{unitSubtitle(unit)}</p><div className="im-unit-footer"><ProgressBar value={group.length?finished/group.length*100:0}/><span>{finished}/{group.length} 节</span></div></button>})}</div>
    <SectionHead kicker="WAYS OF SEEING" title={`${grouped.masters.length} 位思想者，不同的观察方法`} description="每一种方法都有能力范围，也都有局限。点开人物，先理解他们试图解决的问题。"/>
    <div className="im-master-row">{grouped.masters.map(master=><button className="im-master-mini" key={master.id} onClick={()=>go('read',master.id)} style={{'--master-accent':master.accent}}><span>{master.initials}</span><strong>{master.title}</strong><small>{master.school}</small><ArrowRight size={16}/></button>)}</div>
    <div className="im-method-note"><span className="im-method-icon"><CircleHelp size={24}/></span><div><strong>学透的标准，不是记住答案</strong><p>你能说出一个框架适用于什么、不适用于什么，并在新公司上独立使用它，才算真正开始掌握。</p></div><button onClick={()=>go('framework')}>建立我的体系 <ArrowRight size={16}/></button></div>
  </div>;
}

function PathPage({lessons,completed,go}) { const activeUnits=units.filter(unit=>lessons.some(item=>item.unit===unit));return <div className="im-page"><div className="im-page-intro"><span className="im-overline">STRUCTURED LEARNING · {activeUnits.length} 个已开放单元</span><h1>把知识，练成能力。</h1><p>先学证券、数学、报表、股票和债券，再研究大师方法。课程持续扩写；页面上的完成比例仅表示已开放内容的进度。</p></div><div className="im-roadmap">{activeUnits.map((unit,index)=>{const group=lessons.filter(item=>item.unit===unit);return <section className="im-roadmap-unit" key={unit}><div className="im-roadmap-index">{String(index).padStart(2,'0')}</div><div className="im-roadmap-content"><div className="im-roadmap-heading"><div><span className="im-overline">MODULE {String(index).padStart(2,'0')}</span><h2>{unit}</h2><p>{unitSubtitle(unit)}</p></div><span>{group.filter(item=>completed.has(item.id)).length} / {group.length} 完成</span></div><div className="im-lesson-list">{group.map((lesson,i)=><button key={lesson.id} className="im-lesson-row" onClick={()=>go('read',lesson.id)}><span className={`im-lesson-index ${completed.has(lesson.id)?'done':''}`}>{completed.has(lesson.id)?<Check size={16}/>:String(i+1).padStart(2,'0')}</span><span className="im-lesson-info"><strong>{lesson.title}</strong><small>{lesson.level} · {lesson.minutes} 分钟 · {lesson.concepts?.length||0} 个相关概念</small></span><ArrowRight size={17}/></button>)}</div></div></section>})}</div></div>; }
function MastersPage({masters,go}) { return <div className="im-page"><div className="im-page-intro"><span className="im-overline">THE THINKERS · 大师群像</span><h1>跟人学习，超越人的答案。</h1><p>他们在不同问题上给出不同方法。理解背景、思想演变和局限，才能把方法迁移到自己的研究。</p></div><div className="im-master-grid">{masters.map((master,index)=><button className="im-master-card" key={master.id} onClick={()=>go('read',master.id)} style={{'--master-accent':master.accent}}><div className="im-master-card-top"><span>{String(index+1).padStart(2,'0')} / {String(masters.length).padStart(2,'0')}</span><ArrowRight size={18}/></div><div className="im-master-monogram">{master.initials}</div><span className="im-overline">{master.school}</span><h2>{master.title}</h2><small>{master.english} · {master.era}</small><p>{master.keyIdea}</p><div className="im-master-card-foot">进入研习 <ArrowRight size={16}/></div></button>)}</div></div>; }
function CatalogPage({type,items,masters,go}) { const [filter,setFilter]=useState('all');const filtered=items.filter(item=>filter==='all'||(type==='cases'?item.outcome===filter:item.masters?.includes(filter)));const filters=type==='cases'?['all',...new Set(items.map(item=>item.outcome))]:['all',...masters.map(item=>item.id)];return <div className="im-page"><div className="im-page-intro"><span className="im-overline">{type==='cases'?'THE CASE FILES':'THE FIELD GUIDE'}</span><h1>{type==='cases'?'在已发生的事里练习。':'把概念变成工具。'}</h1><p>{type==='cases'?'成功、失败与模拟训练分开阅读。先站回当时，再审视后来。':'每个词条从一句话出发，接着看适用边界、案例和误用方式。'}</p></div><div className="im-filter-bar">{filters.map(key=><button key={key} className={filter===key?'selected':''} onClick={()=>setFilter(key)}>{key==='all'?'全部':type==='cases'?key:masters.find(m=>m.id===key)?.title}</button>)}</div><div className="im-catalog-list">{filtered.map((item,index)=><button key={item.id} className="im-catalog-card" onClick={()=>go('read',item.id)}><span className="im-catalog-number">{String(index+1).padStart(2,'0')}</span><span className="im-catalog-body"><small>{type==='cases'?`${item.outcome} · ${item.year}`:item.masters?.map(id=>masters.find(m=>m.id===id)?.title).join(' / ')}</small><strong>{item.title}</strong><span>{type==='cases'?item.question:item.oneLine}</span></span><ArrowRight size={18}/></button>)}</div>{filtered.length===0&&<Empty title="这里还没有内容" text="换一个筛选条件试试。"/>}</div>; }
function ComparePage({masters,go}) {const [left,setLeft]=useState('graham'),[right,setRight]=useState('buffett');const a=masters.find(x=>x.id===left),b=masters.find(x=>x.id===right);const rows=[['核心问题','keyIdea'],['最擅长','strength'],['使用边界','blindSpot']];return <div className="im-page"><div className="im-page-intro"><span className="im-overline">COMPARE THE LENSES</span><h1>同一家公司，不同的问题。</h1><p>选两位大师，对照他们会重点检查什么。这里总结的是公开思想框架，并不假装大师本人给出今日意见。</p></div><div className="im-compare-pickers"><label>视角 A<select value={left} onChange={e=>setLeft(e.target.value)}>{masters.map(m=><option value={m.id} key={m.id}>{m.title}</option>)}</select></label><span>VS</span><label>视角 B<select value={right} onChange={e=>setRight(e.target.value)}>{masters.map(m=><option value={m.id} key={m.id}>{m.title}</option>)}</select></label></div><div className="im-compare-grid"><div className="im-compare-name" style={{'--master-accent':a?.accent}}><span>{a?.initials}</span><h2>{a?.title}</h2><small>{a?.school}</small></div><div className="im-compare-name" style={{'--master-accent':b?.accent}}><span>{b?.initials}</span><h2>{b?.title}</h2><small>{b?.school}</small></div>{rows.map(([label,key])=><div className="im-compare-row" key={key}><strong>{label}</strong><div>{a?.[key]}</div><div>{b?.[key]}</div></div>)}</div><div className="im-method-note"><span className="im-method-icon"><Layers3 size={22}/></span><div><strong>将两种视角一起使用</strong><p>选择一家企业，分别回答两位大师最关心的问题。若答案冲突，明确究竟是事实不同、假设不同，还是投资期限不同。</p></div><button onClick={()=>go('framework')}>写入我的体系 <ArrowRight size={16}/></button></div></div>;}

function Reader({item,grouped,state,completed,go,persist,toggleBookmark,bookmarked,notify}) {
  const [note,setNote]=useState(state.notes.find(row=>row.id===item.id)?.body||'');
  const [caseAnalysisOpen,setCaseAnalysisOpen]=useState(false);
  const [caseAnalysisBody,setCaseAnalysisBody]=useState('');
  const [caseAnalysisLoading,setCaseAnalysisLoading]=useState(false);
  const sealedCase=item.type==='cases'&&Boolean(item.brief);
  const caseAttempt=state.caseAttempts?.find(row=>row.id===item.id);
  const sections=useMemo(()=>!sealedCase&&item.body.length>1200?item.body.split('\n').flatMap((line,index)=>line.startsWith('## ')?[{title:line.slice(3),line:index+1}]:[]):[],[item.body,sealedCase]);
  const quizPassed=item.type==='lessons'&&(item.quiz||[]).every(question=>state.answers.some(row=>row.lessonId===item.id&&row.questionId===question.id&&row.correct));
  const minimumNoteChars=Number.isInteger(item.minimumNoteChars)?item.minimumNoteChars:20;
  const noteSaved=(state.notes.find(row=>row.id===item.id)?.body||'').trim().length>=minimumNoteChars;
  const canComplete=quizPassed&&noteSaved;
  const saveNote=async()=>{if(await persist('note',item.id,note))notify('笔记已保存');};
  const sealCaseAttempt=async()=>{if(note.trim().length<120){notify('请先写至少 120 字的独立判断');return;}if(await persist('caseAttempt',item.id,note))notify('首次答卷已封存，可以查看参考推导');};
  const toggleCaseAnalysis=async()=>{if(caseAnalysisOpen){setCaseAnalysisOpen(false);return;}if(!caseAttempt)return;if(!caseAnalysisBody){setCaseAnalysisLoading(true);try{const result=await request(`/case-analysis/${item.id}`);setCaseAnalysisBody(result.body);}catch(error){notify(error.message);return;}finally{setCaseAnalysisLoading(false);}}setCaseAnalysisOpen(true);};
  const complete=async()=>{if(!canComplete&&!completed.has(item.id)){notify(`请先答对 ${item.quiz?.length||0} 道题，并保存至少 ${minimumNoteChars} 字的应用笔记`);return;}const next=!completed.has(item.id);if(await persist('complete',item.id,next))notify(next?'本章练习已记录，相关概念已加入复习':'已取消完成标记');};
  const related=(item.concepts||[]).map(id=>grouped.concepts.find(x=>x.id===id)).filter(Boolean);
  const cases=(item.cases||[]).map(id=>grouped.cases.find(x=>x.id===id)).filter(Boolean);
  const master=item.master&&grouped.masters.find(x=>x.id===item.master);
  const lessons=item.type==='masters'?grouped.lessons.filter(x=>x.master===item.id):[];
  const linkedLessons=item.type==='concepts'?grouped.lessons.filter(x=>x.concepts?.includes(item.id)):item.type==='cases'?grouped.lessons.filter(x=>x.cases?.includes(item.id)):[];
  const nextLesson=item.type==='lessons'?grouped.lessons[grouped.lessons.findIndex(x=>x.id===item.id)+1]:null;
  return <article className="im-page im-reader"><button className="im-back-link" onClick={()=>go(item.type==='lessons'?'path':item.type)}><ArrowLeft size={16}/> 返回{item.type==='lessons'?'学习路径':item.type==='masters'?'大师群像':item.type==='cases'?'案例研究':'概念词典'}</button><div className="im-reader-head"><div><span className="im-overline">{item.type==='lessons'?`${item.unit} · ${item.minutes} 分钟`:item.type==='masters'?`${item.school} · MASTER STUDY`:item.type==='cases'?`${item.outcome} · ${item.year}`:'CONCEPT FIELD GUIDE'}</span><h1>{item.title}</h1><p>{item.type==='masters'?item.keyIdea:item.type==='concepts'?item.oneLine:item.type==='cases'?item.question:item.practice}</p></div><button className={`im-bookmark ${bookmarked(item.id)?'saved':''}`} onClick={()=>toggleBookmark(item.id)} title={bookmarked(item.id)?'取消收藏':'收藏内容'}><Bookmark size={18} fill={bookmarked(item.id)?'currentColor':'none'}/>{bookmarked(item.id)?'已收藏':'收藏'}</button></div>
    {item.type==='masters'&&<div className="im-master-profile" style={{'--master-accent':item.accent}}><span className="im-profile-monogram">{item.initials}</span><div><small>{item.english} · {item.era}</small><strong>{item.subtitle}</strong><span>擅长：{item.strength}</span></div></div>}
    <div className="im-reader-layout"><div className="im-article-main">{item.type==='cases'&&item.checkpoints?.length>0&&<section className="im-case-checkpoint im-reflection"><span className="im-overline">FREEZE THE DATE · 先独立判断</span><h2>{sealedCase?"先用数据作答，再看推导":"先停在当时，再读事后结果"}</h2><p>{sealedCase?"下方是完整的教学数据。写下计算、判断和未知条件；首次答卷封存后才能看参考推导。":"只用当时可得的资料回答；教学算例与真实事件要分开。下面正文含参考计算与事后复盘。"}</p>{sealedCase&&<div className="im-case-brief"><Markdown body={item.brief}/></div>}<ol>{item.checkpoints.map((prompt,index)=><li key={index}>{prompt}</li>)}</ol><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="先写计算、证据和暂时未知的条件…" rows={6}/><div className="im-note-actions"><span>本机保存；以后可回来对照原判断</span><button className="im-button ghost" onClick={saveNote}>保存决策卡 <Check size={16}/></button></div>{sealedCase&&(caseAttempt?<details className="im-case-first-attempt"><summary>首次答卷已封存 · {new Date(caseAttempt.submittedAt).toLocaleString('zh-CN')} · 点击对照</summary><pre>{caseAttempt.body}</pre></details>:<p className="im-case-seal-hint">写满 120 字后，封存首次答卷即可解锁解析。后续仍可修订上方决策卡。</p>)}</section>}{sections.length>0&&<details className="im-mobile-toc"><summary>本章目录 · {sections.length} 节</summary><ChapterLinks sections={sections}/></details>}{sealedCase?<div className="im-case-analysis">{!caseAttempt?<button className="im-button primary" onClick={sealCaseAttempt} disabled={note.trim().length<120}>封存首次答卷并解锁解析 <Check size={16}/></button>:<button className="im-button primary" onClick={toggleCaseAnalysis} disabled={caseAnalysisLoading} aria-expanded={caseAnalysisOpen}>{caseAnalysisLoading?'正在读取解析':caseAnalysisOpen?'收起参考推导':'查看参考推导'} <ChevronDown size={16}/></button>}{caseAnalysisOpen&&<Markdown body={caseAnalysisBody}/>}</div>:<Markdown body={item.body}/>}
      {item.type==='masters'&&<div className="im-master-lessons"><SectionHead kicker="STUDY THIS THINKER" title="继续深入" description="从人物思想走向实际方法。"/><div>{lessons.map((lesson,index)=><button key={lesson.id} onClick={()=>go('read',lesson.id)}><span>0{index+1}</span><strong>{lesson.title}</strong><ArrowRight size={16}/></button>)}</div></div>}
      {linkedLessons.length>0&&<div className="im-master-lessons"><SectionHead kicker="KEEP LEARNING" title="继续深入" description={item.type==='concepts'?'在完整章节中计算、验证并应用这个概念。':'先用课程学方法，再回到这个案例独立判断。'}/><div>{linkedLessons.map((lesson,index)=><button key={lesson.id} onClick={()=>go('read',lesson.id)}><span>{String(index+1).padStart(2,'0')}</span><strong>{lesson.title}</strong><ArrowRight size={16}/></button>)}</div></div>}
      {item.type==='lessons'&&<><div className="im-quiz"><span className="im-overline">CHECK YOUR UNDERSTANDING · 自测</span><h2>点击选项，立即看解析</h2>{item.quiz.map((question,index)=><QuizQuestion key={`${item.id}-${question.id}`} lessonId={item.id} question={question} index={index} total={item.quiz.length} previous={state.answers.find(row=>row.lessonId===item.id&&row.questionId===question.id)} persist={persist}/>)}</div>
        <div className="im-reflection"><span className="im-overline">TRANSFER THE SKILL · 迁移练习</span><h2>用自己的案例写下来</h2><p>{item.practice}</p><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="写下你的证据、反证和仍需核查的资料…" rows={7}/><div className="im-note-actions"><span>至少 {minimumNoteChars} 字；记录证据、反证或待核查资料</span><button className="im-button ghost" onClick={saveNote}>保存练习笔记 <Check size={16}/></button></div></div><div className="im-completion"><div><strong>{completed.has(item.id)?'本章练习已完成':'完成本章练习'}</strong><p>{quizPassed?`✓ ${item.quiz.length} 道题已答对`:`○ 答对 ${item.quiz.length} 道自测题`}　{noteSaved?'✓ 应用笔记已保存':`○ 保存至少 ${minimumNoteChars} 字的应用笔记`}</p></div><button className="im-button primary" onClick={complete} disabled={!canComplete&&!completed.has(item.id)}>{completed.has(item.id)?'取消完成':'完成本章练习'} <Check size={16}/></button></div></>}
      {item.type!=='lessons'&&!(item.type==='cases'&&item.checkpoints?.length>0)&&<div className="im-reflection compact"><span className="im-overline">YOUR NOTEBOOK</span><h2>把你的疑问留下来</h2><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="你会怎样使用这个框架？它可能在哪些地方失效？" rows={6}/><div className="im-note-actions"><span>Markdown 格式可直接输入</span><button className="im-button ghost" onClick={saveNote}>保存笔记 <Check size={16}/></button></div></div>}
      <SourceLinks sources={item.sources} sourceUrl={item.sourceUrl}/>
      {nextLesson&&<button className="im-next-lesson" onClick={()=>go('read',nextLesson.id)}><span><small>下一节课程</small><strong>{nextLesson.title}</strong></span><ArrowRight size={20}/></button>}
    </div><aside className="im-article-aside">{sections.length>0&&<div className="im-toc"><span className="im-overline">CHAPTER MAP · 本章目录</span>{sections.map(section=><button key={section.line} onClick={()=>document.getElementById(`im-section-${section.line}`)?.scrollIntoView({behavior:'smooth',block:'start'})}>{section.title}</button>)}</div>}<div className="im-aside-block"><span className="im-overline">IN THIS STUDY</span><strong>学习连接</strong><p>不要孤立地记结论。把概念、案例和提出问题的人连起来。</p></div>{master&&<button className="im-aside-link" onClick={()=>go('read',master.id)}><span>大师视角</span><strong>{master.title}</strong><ChevronRight size={16}/></button>}{related.map(concept=><button className="im-aside-link" key={concept.id} onClick={()=>go('read',concept.id)}><span>相关概念</span><strong>{concept.title}</strong><ChevronRight size={16}/></button>)}{cases.map(entry=><button className="im-aside-link" key={entry.id} onClick={()=>go('read',entry.id)}><span>案例研究</span><strong>{entry.title}</strong><ChevronRight size={16}/></button>)}{item.type==='masters'&&<div className="im-boundary"><span className="im-overline">A NECESSARY CAVEAT</span><strong>方法的边界</strong><p>{item.blindSpot}</p></div>}</aside></div>
  </article>;
}

function QuizQuestion({lessonId,question,index,total,previous,persist}) {
  const [selected,setSelected]=useState(previous?.choice ?? null),[submitting,setSubmitting]=useState(false);
  const answerShown=selected!==null;
  const offset=(index+lessonId.length)%question.options.length;
  const options=question.options.map((option,choice)=>({option,choice}));
  const shownOptions=[...options.slice(offset),...options.slice(0,offset)];
  const choose=async(choice)=>{
    if(submitting)return;
    setSelected(choice);
    setSubmitting(true);
    if(!await persist('answer',lessonId,{questionId:question.id,choice})){
      setSelected(previous?.choice ?? null);
    }
    setSubmitting(false);
  };
  return <div className="im-quiz-question"><span>问题 {index+1} / {total}</span><p>{question.question}</p><div className="im-quiz-options">{shownOptions.map(({option,choice},i)=><button key={choice} type="button" disabled={submitting} aria-pressed={selected===choice} className={`${selected===choice?'selected':''} ${answerShown&&choice===question.answer?'correct':''} ${answerShown&&selected===choice&&choice!==question.answer?'incorrect':''}`} onClick={()=>choose(choice)}><span>{String.fromCharCode(65+i)}</span>{option}</button>)}</div>{answerShown&&<div className={`im-quiz-feedback ${selected===question.answer?'yes':'no'}`} aria-live="polite"><strong>{selected===question.answer?'答对了':'答错了，再看一遍关键区别'}</strong><p>{question.explanation}</p></div>}</div>;
}

function ReviewPage({due,state,persist,go,notify}) {const [index,setIndex]=useState(0),[revealed,setRevealed]=useState(false);const current=due[index];useEffect(()=>{if(index>=due.length)setIndex(0);},[due.length,index]);const grade=async(rating)=>{if(await persist('review',current.id,rating)){setRevealed(false);setIndex(0);notify(rating==='again'?'10 分钟后再看一次':'已安排下一次复习');}};return <div className="im-page"><div className="im-page-intro"><span className="im-overline">ACTIVE RECALL · 主动回想</span><h1>记住，不等于能用。</h1><p>先自己回答，再展开解释。复习卡来自已完成课程关联的概念；评分会决定下次出现的时间。</p></div><div className="im-review-summary"><div><strong>{due.length}</strong><span>现在待复习</span></div><div><strong>{state.reviews.length}</strong><span>已安排复习</span></div><p>给“想不起来”的概念打「重来」，约十分钟后再次出现。</p></div>{!current?<Empty icon={CheckCircle2} title="当前没有待复习内容" text="继续学习一节课程，新的概念就会进入复习队列。" action="继续学习" onAction={()=>go('path')}/>:<div className="im-review-card"><span className="im-overline">RECALL CARD · {index+1} / {due.length}</span><h2>{current.title}</h2><p className="im-review-question">{current.reviewQuestion}</p>{revealed?<><div className="im-review-answer"><span>参考解释</span><p>{current.reviewAnswer}</p></div><div className="im-grade-buttons"><button onClick={()=>grade('again')}>重来<small>10 分钟</small></button><button onClick={()=>grade('hard')}>困难<small>约 1 天</small></button><button onClick={()=>grade('good')}>记得<small>间隔延长</small></button><button onClick={()=>grade('easy')}>熟练<small>更久后</small></button></div></>:<button className="im-button primary" onClick={()=>setRevealed(true)}>显示参考解释 <ChevronDown size={16}/></button>}<button className="im-review-source" onClick={()=>go('read',current.id)}>打开完整概念 <ArrowRight size={15}/></button></div>}</div>;}
function PortfolioPage({lessons,state,go,notify}) {
  const drafted=lessons.filter(lesson=>(state.notes.find(note=>note.id===lesson.id)?.body||'').trim().length>0);
  const exportDrafts=()=>{
    if(!drafted.length)return;
    const reviewSheet=['## 独立审读记录（由审读者填写）','','研究截止日：____　审读日期：____　资料版本：____','审读者先独立复算，再阅读作者结论；看不到原始文件、公式或合同的项目记为「未核实」。','','| 维度 | 0–4 分 | 对应证据、页码或公式 | 需要修订之处 |','| --- | ---: | --- | --- |',...['来源与公开时点','三表、现金流及估值勾稽','情景、反证与敏感性','债券条款、到期及回收顺位','客户现金义务与组合适配','利益冲突、费用与表达'].map(label=>`| ${label} | 待审 | 待填 | 待填 |`),'','必须逐项核查：','- [ ] 两家不同行业企业各有独立股票报告；三项关键原始数字的发布日期、单位和位置均可找到，没有把后来的资料放回事前。','- [ ] 另一人能从输入重算 CFO、FCFF、企业价值到每股价值；未解释差额已单列。','- [ ] 债券发行实体、保证、到期与回收顺位来自文件；无法确认处明确写「未核实」。','- [ ] 悲观情景会改变模型和仓位；客户确定付款有独立、可按时动用的资金来源。','- [ ] 作者列出最强反方意见、修订触发条件、费用和利益冲突。','','审读者发现的最重要错误：____','作者 v2 如何修改公式、结论或行动：____','仍待取得的资料与再次审读日期：____','','评分仅定位需要重做的环节；未审读草稿或选择题完成记录不构成能力认证。'];
    const body=['# Invest Master · 毕业作品草稿','',`导出日期：${new Date().toLocaleDateString('zh-CN')}`,'','以下是本机保存的学习草稿；请选择独立审读者核对原始资料、计算与反方意见。','',...drafted.flatMap(lesson=>{const note=state.notes.find(entry=>entry.id===lesson.id);return [`## ${lesson.title}`,'',`课题要求：${lesson.practice}`,'',note.body.trim(),''];}),...reviewSheet].join('\n');
    const url=URL.createObjectURL(new Blob([body],{type:'text/markdown;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download='InvestMaster-毕业作品草稿.md';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('已导出本机保存的 Markdown 草稿');
  };
  return <div className="im-page im-portfolio"><div className="im-page-intro"><span className="im-overline">RESEARCH PORTFOLIO · 毕业作品</span><h1>用作品证明理解。</h1><p>按五项实作完成两份跨行业股票、债券与客户投资政策研究。这里保存学习草稿并帮助导出给独立审读者；完成记录不等于能力认证。</p></div><div className="im-portfolio-overview"><div><strong>{drafted.length} / {lessons.length}</strong><span>已有本机草稿</span></div><p>先完成原始资料、公式、反证与客户约束，再请他人复算。导出包含已保存草稿和供他人填写的审读表，不会上传资料。</p><button className="im-button primary" onClick={exportDrafts} disabled={!drafted.length}><Download size={16}/> 导出全部草稿</button></div><div className="im-portfolio-list">{lessons.map((lesson,index)=>{const draft=state.notes.find(note=>note.id===lesson.id);const chars=draft?.body.trim().length||0;const answered=(lesson.quiz||[]).filter(question=>state.answers.some(answer=>answer.lessonId===lesson.id&&answer.questionId===question.id&&answer.correct)).length;return <section className="im-portfolio-card" key={lesson.id}><span className="im-portfolio-index">{String(index+1).padStart(2,'0')}</span><div><span className="im-overline">{lesson.level} · {lesson.minutes} 分钟</span><h2>{lesson.title}</h2><p>{lesson.practice}</p><div className="im-portfolio-meta"><span>{answered}/{lesson.quiz.length} 道知识检查</span><span>{chars?`草稿 ${chars} 字`:'尚无草稿'}</span></div></div><button className="im-button ghost" onClick={()=>go('read',lesson.id)}>打开课题 <ArrowRight size={16}/></button></section>})}</div><div className="im-method-note"><span className="im-method-icon"><CircleHelp size={24}/></span><div><strong>审读是毕业实作的一部分</strong><p>让另一位读者从原始披露重建数字，记录疑问、修正及下一次披露后的复盘。</p></div></div></div>;
}
function NotebookPage({items,state,go}) {const notes=state.notes.filter(row=>row.body.trim()).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));return <div className="im-page"><div className="im-page-intro"><span className="im-overline">YOUR THINKING, PRESERVED</span><h1>你的研习笔记。</h1><p>每一次疑问、反证和判断都会回到相应课程或概念旁边。这里汇总你的全部记录。</p></div>{notes.length?<div className="im-notebook-list">{notes.map(row=>{const item=items.find(x=>x.id===row.id);return <button key={row.id} onClick={()=>go('read',row.id)}><span className="im-overline">{item?.type==='lessons'?'课程':item?.type==='masters'?'大师':item?.type==='cases'?'案例':'概念'} · {new Date(row.updatedAt).toLocaleDateString('zh-CN')}</span><strong>{item?.title||row.id}</strong><p>{row.body.slice(0,180)}</p><span>继续编辑 <ArrowRight size={15}/></span></button>;})}</div>:<Empty icon={NotebookPen} title="第一条笔记，从一个疑问开始" text="读一节课程，在迁移练习里写下证据、反证，以及还需要核查的资料。" action="浏览学习路径" onAction={()=>go('path')}/>}</div>;}
function FrameworkPage({state,persist,notify}) {const [drafts,setDrafts]=useState(()=>Object.fromEntries(state.framework.map(row=>[row.id,row.body])));const [active,setActive]=useState('objective');const save=async(id)=>{if(await persist('framework',id,drafts[id]||''))notify('个人体系已保存');};const written=frameworkSections.filter(([id])=>(drafts[id]||'').trim()).length;return <div className="im-page"><div className="im-page-intro"><span className="im-overline">YOUR INVESTMENT PHILOSOPHY</span><h1>最后要形成的，<br/>是你的方法。</h1><p>把大师的思想变成你愿意遵守、也愿意随证据修订的原则。每一栏都从一个实际问题开始。</p></div><div className="im-framework-progress"><span>{String(written).padStart(2,'0')} / 09</span><ProgressBar value={written/9*100}/><small>已写下原则</small></div><div className="im-framework-layout"><div className="im-framework-tabs">{frameworkSections.map(([id,title],index)=><button className={active===id?'active':''} onClick={()=>setActive(id)} key={id}><span>{String(index+1).padStart(2,'0')}</span>{title}{drafts[id]?.trim()&&<Check size={14}/>}</button>)}</div><div className="im-framework-editor">{frameworkSections.filter(([id])=>id===active).map(([id,title,prompt])=><div key={id}><span className="im-overline">PERSONAL PRINCIPLE</span><h2>{title}</h2><p>{prompt}</p><textarea rows={12} value={drafts[id]||''} onChange={e=>setDrafts({...drafts,[id]:e.target.value})} placeholder="先写当前版本。可以从课堂笔记里提炼，也可以写下尚未解决的问题。"/><div className="im-note-actions"><span>原则可以随学习和证据修订</span><button className="im-button primary" onClick={()=>save(id)}>保存这条原则 <Check size={16}/></button></div></div>)}</div></div></div>;}
function SearchDialog({items,query,setQuery,onClose,go}) {const ref=useRef();useEffect(()=>ref.current?.focus(),[]);const term=query.trim().toLowerCase();const results=term.length<2?[]:items.map(item=>({item,score:(item.title.toLowerCase().includes(term)?5:0)+(item.english?.toLowerCase().includes(term)?4:0)+(item.oneLine?.toLowerCase().includes(term)?2:0)+(item.body.toLowerCase().includes(term)?1:0)})).filter(row=>row.score).sort((a,b)=>b.score-a.score).slice(0,30);return <div className="im-search-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><div className="im-search-modal" role="dialog" aria-modal="true" aria-label="全局搜索"><div className="im-search-input"><Search size={21}/><input ref={ref} value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索思想、人物、案例或一句话…"/><IconButton label="关闭搜索" onClick={onClose}><X size={19}/></IconButton></div><div className="im-search-results">{term.length<2?<div className="im-search-hint">输入至少两个字。试试「安全边际」「护城河」「风险」或大师姓名。</div>:results.length?results.map(({item})=><button key={item.id} onClick={()=>go('read',item.id)}><span>{item.type==='masters'?'大师':item.type==='lessons'?'课程':item.type==='cases'?'案例':'概念'}</span><strong>{item.title}</strong><small>{item.oneLine||item.keyIdea||item.question||item.unit}</small><ArrowRight size={16}/></button>):<div className="im-search-hint">没有找到匹配内容。换一个概念或人物名称试试。</div>}</div><div className="im-search-bottom">ESC 关闭 <span>{results.length} 个结果</span></div></div></div>;}

