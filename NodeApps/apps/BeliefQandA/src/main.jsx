import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Bot, ChevronLeft, ChevronRight, CircleAlert,
  MessageCircleQuestion, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, PenLine,
  Search, Sparkles, Telescope, X,
} from 'lucide-react';
import { getAnswer, getQuestions, saveAnswer } from './api.js';

const LAYERS = [
  { id: 'brief', number: '01', label: 'AI 的简单回答', description: '先抓住核心，适合一两分钟的真诚回应。', Icon: Bot, tone: 'violet' },
  { id: 'personal', number: '02', label: '我的回答', description: '留下你自己的理解、经历与表达方式。', Icon: PenLine, tone: 'amber' },
  { id: 'detailed', number: '03', label: 'AI 的复杂回答', description: '补足逻辑、背景、经文与常见追问。', Icon: Sparkles, tone: 'blue' },
  { id: 'explore', number: '04', label: '更深层次的探讨', description: '继续进入张力与值得共同思考的地方。', Icon: Telescope, tone: 'rose' },
];

function currentQuestionId() {
  const match = location.hash.match(/question=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

function updateQuestionHash(id) {
  const route = `#/app/belief-qa?question=${encodeURIComponent(id)}`;
  if (location.hash !== route) location.hash = route;
}

function normalizedLayers(layers = {}) {
  return Object.fromEntries(LAYERS.map(({ id }) => [id, layers[id] || '']));
}

function EmptyAnswer({ layer }) {
  return <div className="bqa-empty-answer"><span><layer.Icon size={18} /></span><p>这里还没有内容。</p><small>{layer.description}</small></div>;
}

export default function BeliefQA() {
  const [library, setLibrary] = useState(null);
  const [selectedId, setSelectedId] = useState(currentQuestionId());
  const [query, setQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightbarOpen, setRightbarOpen] = useState(true);
  const [activeLayer, setActiveLayer] = useState('brief');
  const [mode, setMode] = useState('read');
  const [answer, setAnswer] = useState({ status: 'idle', layers: normalizedLayers(), updatedAt: null });
  const selectedIdRef = useRef(selectedId);

  useEffect(() => {
    let cancelled = false;
    getQuestions().then((data) => {
      if (cancelled) return;
      setLibrary(data);
      const wanted = currentQuestionId();
      const initial = data.questions.find((item) => item.id === wanted)?.id || data.questions[0]?.id || '';
      setSelectedId(initial);
      const initialQuestion = data.questions.find((item) => item.id === initial);
      if (initialQuestion) setExpandedCategory(initialQuestion.categoryId);
      if (initial && !wanted) updateQuestionHash(initial);
    }).catch((error) => !cancelled && setLibrary({ error: error.message, questions: [], categories: [] }));
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const onHashChange = () => setSelectedId(currentQuestionId());
    addEventListener('hashchange', onHashChange);
    return () => removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    setAnswer({ status: 'loading', layers: normalizedLayers(), updatedAt: null });
    getAnswer(selectedId).then((data) => {
      if (!cancelled) setAnswer({ status: 'ready', layers: normalizedLayers(data.layers), updatedAt: data.updatedAt });
    }).catch((error) => !cancelled && setAnswer({ status: 'error', layers: normalizedLayers(), error: error.message, updatedAt: null }));
    return () => { cancelled = true; };
  }, [selectedId]);

  const selected = useMemo(() => library?.questions.find((item) => item.id === selectedId) || null, [library, selectedId]);
  const searchedQuestions = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('zh-CN');
    return needle ? (library?.questions || []).filter((item) => `${item.text} ${item.category}`.toLocaleLowerCase('zh-CN').includes(needle)) : [];
  }, [library, query]);
  const layer = LAYERS.find((item) => item.id === activeLayer) || LAYERS[0];
  const isDirty = answer.status === 'ready' && Boolean(answer.dirty);
  const allQuestions = library?.questions || [];
  const selectedIndex = allQuestions.findIndex((item) => item.id === selectedId);
  const previousQuestion = selectedIndex > 0 ? allQuestions[selectedIndex - 1] : null;
  const nextQuestion = selectedIndex >= 0 && selectedIndex < allQuestions.length - 1 ? allQuestions[selectedIndex + 1] : null;

  function selectQuestion(id) {
    setMode('read');
    updateQuestionHash(id);
    setSelectedId(id);
    const question = allQuestions.find((item) => item.id === id);
    if (question) setExpandedCategory(question.categoryId);
    if (innerWidth < 960) setSidebarOpen(false);
  }

  function toggleCategory(id) {
    setExpandedCategory((current) => current === id ? '' : id);
    setQuery('');
  }

  function editLayer(value) {
    setAnswer((current) => ({ ...current, layers: { ...current.layers, [activeLayer]: value }, dirty: true }));
  }

  useEffect(() => {
    if (!selectedId || !answer.dirty || answer.status === 'loading' || answer.status === 'saving') return undefined;
    const layers = answer.layers;
    const questionId = selectedId;
    const timer = setTimeout(async () => {
      setAnswer((current) => current.layers === layers ? { ...current, status: 'saving' } : current);
      try {
        const saved = await saveAnswer(questionId, layers);
        if (selectedIdRef.current === questionId) {
          setAnswer((current) => current.layers === layers
            ? { status: 'ready', layers: normalizedLayers(saved.layers), updatedAt: saved.updatedAt, dirty: false }
            : current);
        }
      } catch (error) {
        if (selectedIdRef.current === questionId) setAnswer((current) => current.layers === layers ? { ...current, status: 'ready', error: error.message } : current);
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [answer.dirty, answer.layers, answer.status, selectedId]);

  if (!library) return <main className="bqa-boot"><MessageCircleQuestion size={30} /><strong>正在展开问题地图…</strong></main>;
  if (library.error) return <main className="bqa-boot bqa-boot-error"><CircleAlert size={30} /><strong>无法打开题库</strong><span>{library.error}</span></main>;

  return <main className={`bqa-app ${sidebarOpen ? '' : 'bqa-sidebar-collapsed'} ${rightbarOpen ? '' : 'bqa-rightbar-collapsed'}`}>
    <aside className="bqa-sidebar" aria-label="问题目录">
      <header className="bqa-brand">
        <span className="bqa-brand-mark"><MessageCircleQuestion size={20} /></span>
        <h1>Belief Q&A</h1>
        <button className="bqa-sidebar-toggle" onClick={() => setSidebarOpen((current) => !current)} aria-label={sidebarOpen ? '收窄题库' : '展开题库'}>{sidebarOpen ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}</button>
      </header>
      <label className="bqa-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索问题…" />{query && <button onClick={() => setQuery('')} aria-label="清除搜索"><X size={13} /></button>}</label>
      <nav className="bqa-categories">
        <button className={`bqa-category ${expandedCategory === 'all' ? 'is-active' : ''}`} onClick={() => toggleCategory('all')}><span>全部问题</span><small>{library.questions.length}</small></button>
        {expandedCategory === 'all' && !query && <QuestionList questions={allQuestions} selectedId={selectedId} onSelect={selectQuestion} />}
        {library.categories.map((category) => <div key={category.id}><button className={`bqa-category ${expandedCategory === category.id ? 'is-active' : ''}`} onClick={() => toggleCategory(category.id)}><span>{category.shortTitle}</span><small>{category.count}</small></button>{expandedCategory === category.id && !query && <QuestionList questions={allQuestions.filter((item) => item.categoryId === category.id)} selectedId={selectedId} onSelect={selectQuestion} />}</div>)}
        {query && <QuestionList questions={searchedQuestions} selectedId={selectedId} onSelect={selectQuestion} search />}
      </nav>
    </aside>

    <section className="bqa-workspace">
      {selected && <div className="bqa-content">
        <section className="bqa-question-header">
          <div className="bqa-question-number"><span>{String(selected.globalIndex).padStart(2, '0')}</span><i /></div>
          <div><p>{selected.category}</p><h2>{selected.text}</h2></div>
        </section>

        <section className={`bqa-answer-panel is-${layer.tone}`}>
          <header className="bqa-answer-context"><span><layer.Icon size={17} /></span><p>{layer.number} · {layer.label}</p></header>
          {answer.error && <div className="bqa-inline-error"><CircleAlert size={15} />{answer.error}</div>}
          {answer.status === 'loading' ? <div className="bqa-answer-loading"><span /><p>正在读取这道题的准备稿…</p></div>
            : mode === 'edit' ? <div className="bqa-editor"><section><label htmlFor="bqa-markdown">Markdown</label><textarea id="bqa-markdown" value={answer.layers[activeLayer]} onChange={(event) => editLayer(event.target.value)} placeholder={`在这里开始写「${layer.label}」…\n\n支持标题、列表、引用和强调。`} /></section><section className="bqa-live-preview"><label>实时预览</label>{answer.layers[activeLayer] ? <article className="bqa-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{answer.layers[activeLayer]}</ReactMarkdown></article> : <EmptyAnswer layer={layer} />}</section></div>
              : answer.layers[activeLayer] ? <article className="bqa-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{answer.layers[activeLayer]}</ReactMarkdown></article> : <EmptyAnswer layer={layer} />}
        </section>

        <footer className="bqa-footer"><span>BeliefQ&A</span><i /> <p>不是为了赢一场辩论，而是为了更从容、更认真地倾听与回应。</p></footer>
      </div>}
      {!selected && <div className="bqa-no-results"><Search size={27} /><h2>没有匹配的问题</h2><p>试试清除搜索，或选择另一个问题分类。</p><button onClick={() => { setQuery(''); setExpandedCategory('all'); }}>查看全部问题</button></div>}
    </section>
    <aside className={`bqa-rightbar ${rightbarOpen ? '' : 'is-collapsed'}`} aria-label="回答与题目工具">
      <header className="bqa-rightbar-header"><span>工具</span><button onClick={() => setRightbarOpen((current) => !current)} aria-label={rightbarOpen ? '收窄工具栏' : '展开工具栏'}>{rightbarOpen ? <PanelRightClose size={17} /> : <PanelRightOpen size={17} />}</button></header>
      <section className="bqa-right-section">
        <p className="bqa-right-label">回答层级</p>
        <div className="bqa-layer-picker">
          {LAYERS.map((item) => <button key={item.id} className={`${item.tone} ${activeLayer === item.id ? 'is-active' : ''}`} onClick={() => { setActiveLayer(item.id); setMode('read'); }}><span>{item.number}</span><item.Icon size={16} /><strong>{item.label}</strong><small>{answer.layers[item.id] ? '已有内容' : '待准备'}</small></button>)}
        </div>
      </section>
      <section className="bqa-right-section bqa-question-tools">
        <p className="bqa-right-label">题目导航</p>
        <div><button onClick={() => previousQuestion && selectQuestion(previousQuestion.id)} disabled={!previousQuestion} aria-label="上一题"><ChevronLeft size={17} /></button><span>{selected ? `${selected.globalIndex} / ${library.questions.length}` : ''}</span><button onClick={() => nextQuestion && selectQuestion(nextQuestion.id)} disabled={!nextQuestion} aria-label="下一题"><ChevronRight size={17} /></button></div>
      </section>
      <section className="bqa-right-section bqa-writing-tools">
        <p className="bqa-right-label">当前回答</p>
        <p className="bqa-writing-description">{layer.description}</p>
        <div className="bqa-mode-switch"><button className={mode === 'read' ? 'is-active' : ''} onClick={() => setMode('read')}>阅读</button><button className={mode === 'edit' ? 'is-active' : ''} onClick={() => setMode('edit')}>编辑</button></div>
        <span className={`bqa-save-state ${isDirty ? 'is-dirty' : ''}`}>{answer.status === 'saving' ? '正在保存…' : isDirty ? '正在整理草稿…' : answer.updatedAt ? '已自动保存' : '开始输入后自动保存'}</span>
      </section>
    </aside>
  </main>;
}

function QuestionList({ questions, selectedId, onSelect, search = false }) {
  if (!questions.length) return <p className="bqa-no-questions">没有匹配的问题</p>;
  return <div className={`bqa-question-list ${search ? 'is-search-results' : ''}`} aria-label="问题列表">{search && <p>搜索结果 · {questions.length}</p>}{questions.map((question) => <button key={question.id} className={question.id === selectedId ? 'is-current' : ''} onClick={() => onSelect(question.id)}><span>{question.globalIndex}</span><strong>{question.text.replaceAll('**', '')}</strong></button>)}</div>;
}
