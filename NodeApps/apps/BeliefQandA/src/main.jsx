import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';
import {
  Bot, ChevronLeft, ChevronRight, CircleAlert,
  MessageCircleQuestion, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, PenLine,
  Search, Sparkles, Telescope, Trash2, X,
} from 'lucide-react';
import { deleteAnswer, getAnswer, getQuestions, saveAnswer } from './api.js';

const DEFAULT_LAYERS = [
  { id: 'personal', number: '01', label: '我的回答', description: '留下你自己的理解、经历与表达方式。', Icon: PenLine, tone: 'amber' },
  { id: 'brief', number: '02', label: 'AI 的简单回答', description: '先抓住核心，适合一两分钟的真诚回应。', Icon: Bot, tone: 'violet' },
  { id: 'detailed', number: '03', label: 'AI 的复杂回答', description: '补足逻辑、背景、经文与常见追问。', Icon: Sparkles, tone: 'blue' },
  { id: 'explore', number: '04', label: '更深层次的探讨', description: '继续进入张力与值得共同思考的地方。', Icon: Telescope, tone: 'rose' },
];
const MARKDOWN_REMARK_PLUGINS = [remarkGfm, remarkBreaks, remarkMath];
const MARKDOWN_REHYPE_PLUGINS = [rehypeRaw, rehypeSanitize, [rehypeHighlight, { detect: true }], rehypeKatex];
const DEFAULT_CONFIG = {
  route: 'belief-qa',
  name: 'Belief Q&A',
  bootMessage: '正在展开问题地图…',
  loadingAnswerMessage: '正在读取这道题的准备稿…',
  footer: '不是为了赢一场辩论，而是为了更从容、更认真地倾听与回应。',
  BrandIcon: MessageCircleQuestion,
  layers: DEFAULT_LAYERS,
  briefLength: { min: 1500, max: 2000 },
};
const DEFAULT_API = { deleteAnswer, getAnswer, getQuestions, saveAnswer };

function currentQuestionId() {
  const match = location.hash.match(/question=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

function updateQuestionHash(id, appRoute) {
  const route = `#/app/${appRoute}?question=${encodeURIComponent(id)}`;
  if (location.hash !== route) location.hash = route;
}

function normalizedLayers(layers = {}, layerDefinitions) {
  return Object.fromEntries(layerDefinitions.map(({ id }) => [id, layers[id] || '']));
}

function normalizePastedMarkdown(markdown) {
  return markdown
    .replace(/\r\n?/g, '\n')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\u00A0/g, ' ')
    .replace(/^([ \t]*)[•◦●▪]\s+/gm, '$1- ')
    .replace(/^([ \t]*)[–—]\s+/gm, '$1- ')
    .replace(/^([ \t]*)(\d+)[、．]\s*/gm, '$1$2. ')
    .trim();
}

function MarkdownArticle({ children, preview = false }) {
  return <article className={`bqa-markdown ${preview ? 'is-preview' : ''}`}>
    <ReactMarkdown
      remarkPlugins={MARKDOWN_REMARK_PLUGINS}
      rehypePlugins={MARKDOWN_REHYPE_PLUGINS}
      components={{
        table: ({ node: _node, ...props }) => <div className="bqa-table-scroll"><table {...props} /></div>,
        a: ({ node: _node, ...props }) => <a {...props} target="_blank" rel="noreferrer" />,
      }}
    >{children}</ReactMarkdown>
  </article>;
}

function EmptyAnswer({ layer }) {
  return <div className="bqa-empty-answer"><span><layer.Icon size={18} /></span><p>这里还没有内容。</p><small>{layer.description}</small></div>;
}

export default function QuestionWorkbench({ config: appConfig = DEFAULT_CONFIG, api = DEFAULT_API }) {
  const config = { ...DEFAULT_CONFIG, ...appConfig };
  const { layers: layerDefinitions, briefLength: briefConstraints } = config;
  const BrandIcon = config.BrandIcon;
  const [library, setLibrary] = useState(null);
  const [selectedId, setSelectedId] = useState(currentQuestionId());
  const [query, setQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightbarOpen, setRightbarOpen] = useState(true);
  const [activeLayer, setActiveLayer] = useState('personal');
  const [mode, setMode] = useState('read');
  const [answer, setAnswer] = useState({ status: 'idle', layers: normalizedLayers({}, layerDefinitions), updatedAt: null });
  const selectedIdRef = useRef(selectedId);

  useEffect(() => {
    let cancelled = false;
    api.getQuestions().then((data) => {
      if (cancelled) return;
      setLibrary(data);
      const wanted = currentQuestionId();
      const initial = data.questions.find((item) => item.id === wanted)?.id || data.questions[0]?.id || '';
      setSelectedId(initial);
      const initialQuestion = data.questions.find((item) => item.id === initial);
      if (initialQuestion) setExpandedCategory(initialQuestion.categoryId);
      if (initial && !wanted) updateQuestionHash(initial, config.route);
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
    setActiveLayer('personal');
    setAnswer({ status: 'loading', layers: normalizedLayers({}, layerDefinitions), updatedAt: null });
    api.getAnswer(selectedId).then((data) => {
      if (!cancelled) setAnswer({ status: 'ready', layers: normalizedLayers(data.layers, layerDefinitions), updatedAt: data.updatedAt });
    }).catch((error) => !cancelled && setAnswer({ status: 'error', layers: normalizedLayers({}, layerDefinitions), error: error.message, updatedAt: null }));
    return () => { cancelled = true; };
  }, [selectedId]);

  const selected = useMemo(() => library?.questions.find((item) => item.id === selectedId) || null, [library, selectedId]);
  const searchedQuestions = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('zh-CN');
    return needle ? (library?.questions || []).filter((item) => `${item.text} ${item.category}`.toLocaleLowerCase('zh-CN').includes(needle)) : [];
  }, [library, query]);
  const layer = layerDefinitions.find((item) => item.id === activeLayer) || layerDefinitions[0];
  const isDirty = answer.status === 'ready' && Boolean(answer.dirty);
  const hasCurrentAnswer = Boolean(answer.layers[activeLayer]);
  const isBriefLayer = activeLayer === 'brief';
  const briefLength = answer.layers.brief.length;
  const briefDraftIncomplete = Boolean(briefConstraints) && isBriefLayer && briefLength > 0 && briefLength < briefConstraints.min;
  const briefDraftTooLong = Boolean(briefConstraints) && isBriefLayer && briefLength > briefConstraints.max;
  const allQuestions = library?.questions || [];
  const selectedIndex = allQuestions.findIndex((item) => item.id === selectedId);
  const previousQuestion = selectedIndex > 0 ? allQuestions[selectedIndex - 1] : null;
  const nextQuestion = selectedIndex >= 0 && selectedIndex < allQuestions.length - 1 ? allQuestions[selectedIndex + 1] : null;

  function selectQuestion(id) {
    setMode('read');
    setActiveLayer('personal');
    updateQuestionHash(id, config.route);
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

  function pasteMarkdown(event) {
    const pasted = event.clipboardData?.getData('text/plain');
    if (!pasted) return;
    const normalized = normalizePastedMarkdown(pasted);
    if (normalized === pasted) return;
    event.preventDefault();
    const field = event.currentTarget;
    editLayer(`${field.value.slice(0, field.selectionStart)}${normalized}${field.value.slice(field.selectionEnd)}`);
  }

  async function removeCurrentAnswer() {
    if (!selectedId || !hasCurrentAnswer || isDirty || answer.status !== 'ready') return;
    if (!window.confirm(`删除当前「${layer.label}」？其余回答层会保留。`)) return;
    const questionId = selectedId;
    setAnswer((current) => ({ ...current, status: 'deleting', error: undefined }));
    try {
      const deleted = await api.deleteAnswer(questionId, activeLayer);
      if (selectedIdRef.current === questionId) setAnswer({ status: 'ready', layers: normalizedLayers(deleted.layers, layerDefinitions), updatedAt: null, dirty: false });
    } catch (error) {
      if (selectedIdRef.current === questionId) setAnswer((current) => ({ ...current, status: 'ready', error: error.message }));
    }
  }

  useEffect(() => {
    if (!selectedId || !answer.dirty || answer.status === 'loading' || answer.status === 'saving' || briefDraftIncomplete || briefDraftTooLong) return undefined;
    const layers = answer.layers;
    const questionId = selectedId;
    const timer = setTimeout(async () => {
      setAnswer((current) => current.layers === layers ? { ...current, status: 'saving' } : current);
      try {
        const saved = await api.saveAnswer(questionId, layers);
        if (selectedIdRef.current === questionId) {
          setAnswer((current) => current.layers === layers
            ? { status: 'ready', layers: normalizedLayers(saved.layers, layerDefinitions), updatedAt: saved.updatedAt, dirty: false }
            : current);
        }
      } catch (error) {
        if (selectedIdRef.current === questionId) setAnswer((current) => current.layers === layers ? { ...current, status: 'ready', error: error.message } : current);
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [answer.dirty, answer.layers, answer.status, briefDraftIncomplete, briefDraftTooLong, selectedId]);

  if (!library) return <main className="bqa-boot"><BrandIcon size={30} /><strong>{config.bootMessage}</strong></main>;
  if (library.error) return <main className="bqa-boot bqa-boot-error"><CircleAlert size={30} /><strong>无法打开题库</strong><span>{library.error}</span></main>;

  return <main className={`bqa-app ${sidebarOpen ? '' : 'bqa-sidebar-collapsed'} ${rightbarOpen ? '' : 'bqa-rightbar-collapsed'}`}>
    <aside className="bqa-sidebar" aria-label="问题目录">
      <header className="bqa-brand">
        <span className="bqa-brand-mark"><BrandIcon size={20} /></span>
        <h1>{config.name}</h1>
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
          {answer.status === 'loading' || answer.status === 'deleting' ? <div className="bqa-answer-loading"><span /><p>{answer.status === 'deleting' ? '正在删除这篇回答…' : config.loadingAnswerMessage}</p></div>
            : mode === 'edit' ? <div className="bqa-editor"><section><label htmlFor="bqa-markdown">Markdown</label><textarea id="bqa-markdown" value={answer.layers[activeLayer]} onChange={(event) => editLayer(event.target.value)} onPaste={pasteMarkdown} placeholder={`在这里开始写「${layer.label}」…\n\n可直接粘贴 ChatGPT 的 Markdown；支持标题、表格、任务清单、代码、公式、引用和强调。`} /><p>粘贴时会自动统一项目符号、编号、空格与换行；复杂内容请看右侧实时预览。</p></section><section className="bqa-live-preview"><label>实时预览</label>{answer.layers[activeLayer] ? <MarkdownArticle preview>{answer.layers[activeLayer]}</MarkdownArticle> : <EmptyAnswer layer={layer} />}</section></div>
              : answer.layers[activeLayer] ? <MarkdownArticle>{answer.layers[activeLayer]}</MarkdownArticle> : <EmptyAnswer layer={layer} />}
        </section>

        <footer className="bqa-footer"><span>{config.name.replace(' ', '')}</span><i /> <p>{config.footer}</p></footer>
      </div>}
      {!selected && <div className="bqa-no-results"><Search size={27} /><h2>没有匹配的问题</h2><p>试试清除搜索，或选择另一个问题分类。</p><button onClick={() => { setQuery(''); setExpandedCategory('all'); }}>查看全部问题</button></div>}
    </section>
    <aside className={`bqa-rightbar ${rightbarOpen ? '' : 'is-collapsed'}`} aria-label="回答与题目工具">
      <header className="bqa-rightbar-header"><span>工具</span><button onClick={() => setRightbarOpen((current) => !current)} aria-label={rightbarOpen ? '收窄工具栏' : '展开工具栏'}>{rightbarOpen ? <PanelRightClose size={17} /> : <PanelRightOpen size={17} />}</button></header>
      <section className="bqa-right-section">
        <p className="bqa-right-label">回答层级</p>
        <div className="bqa-layer-picker">
          {layerDefinitions.map((item) => <button key={item.id} className={`${item.tone} ${activeLayer === item.id ? 'is-active' : ''}`} onClick={() => { setActiveLayer(item.id); setMode('read'); }}><span>{item.number}</span><item.Icon size={16} /><strong>{item.label}</strong><small>{answer.layers[item.id] ? '已有内容' : '待准备'}</small></button>)}
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
        {isBriefLayer && config.briefLength && <div className={`bqa-word-count ${briefDraftIncomplete || briefDraftTooLong ? 'is-outside-range' : ''}`}><span>字数</span><strong>{briefLength}</strong><small>/ {config.briefLength.min}–{config.briefLength.max}</small></div>}
        <span className={`bqa-save-state ${isDirty ? 'is-dirty' : ''}`}>{briefDraftTooLong ? `超出 ${config.briefLength.max} 字，暂不保存` : briefDraftIncomplete ? `还差 ${config.briefLength.min - briefLength} 字，达到下限后自动保存` : answer.status === 'saving' ? '正在保存…' : isDirty ? '正在整理草稿…' : answer.updatedAt ? '已自动保存' : '开始输入后自动保存'}</span>
        <button className="bqa-delete-answer" onClick={removeCurrentAnswer} disabled={!hasCurrentAnswer || isDirty || answer.status !== 'ready'}><Trash2 size={14} />删除当前层回答</button>
        <small className="bqa-delete-hint">只删除当前显示的层级；其余层会保留。请先等待自动保存完成。</small>
      </section>
    </aside>
  </main>;
}

function QuestionList({ questions, selectedId, onSelect, search = false }) {
  if (!questions.length) return <p className="bqa-no-questions">没有匹配的问题</p>;
  return <div className={`bqa-question-list ${search ? 'is-search-results' : ''}`} aria-label="问题列表">{search && <p>搜索结果 · {questions.length}</p>}{questions.map((question) => <button key={question.id} className={question.id === selectedId ? 'is-current' : ''} onClick={() => onSelect(question.id)}><span>{question.globalIndex}</span><strong>{question.text.replaceAll('**', '')}</strong></button>)}</div>;
}
