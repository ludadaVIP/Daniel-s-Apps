import { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, ChevronDown, Eye, EyeOff, Leaf, Paintbrush, Save } from 'lucide-react';
import { getChapter, getConfig, getRecallState, getRecallSummary, saveRecallState } from './api.js';

const GROUPS = [
  { id: 'wisdom', label: '旧约 · 诗歌智慧书', bookIds: ['Psalms', 'Proverbs', 'Ecclesiastes'] },
  { id: 'gospels', label: '新约 · 福音书', bookIds: ['Matthew', 'Mark', 'Luke', 'John'] },
  { id: 'history', label: '新约 · 历史', bookIds: ['Acts'] },
  { id: 'letters', label: '新约 · 书信', bookIds: ['Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude'] },
  { id: 'revelation', label: '新约 · 启示', bookIds: ['Revelation'] },
];

function cleanText(text) {
  return String(text)
    .replace(/([\u3400-\u9fff])\s+(?=[\u3400-\u9fff，。；：！？、】【（）《》〈〉])/gu, '$1')
    .replace(/([，。；：！？、】【（）《》〈〉])\s+(?=[\u3400-\u9fff])/gu, '$1')
    .replace(/[\t ]{2,}/g, ' ')
    .trim();
}

export default function RecallVerses() {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState('');
  const [selection, setSelection] = useState(null);
  const [expanded, setExpanded] = useState(new Set(['letters']));
  const [recallSummaries, setRecallSummaries] = useState({});
  const [chapter, setChapter] = useState({ status: 'idle', data: null });
  const [savedHidden, setSavedHidden] = useState([]);
  const [draftHidden, setDraftHidden] = useState([]);
  const [savedPainted, setSavedPainted] = useState([]);
  const [draftPainted, setDraftPainted] = useState([]);
  const [stateStatus, setStateStatus] = useState('idle');
  const [saveStatus, setSaveStatus] = useState('idle');
  const chapterRequest = useRef(null);
  const stateRequest = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    getConfig(controller.signal).then((data) => {
      setConfig(data);
      const defaultBook = data.books.find((book) => book.id === 'Romans') ?? data.books[0];
      if (defaultBook) {
        setSelection({ bookId: defaultBook.id, chapter: 8 });
        setExpanded((current) => new Set([...current, defaultBook.id]));
      }
    }).catch((requestError) => {
      if (requestError.name !== 'AbortError') setError(requestError.message);
    });
    return () => controller.abort();
  }, []);

  const booksById = useMemo(() => new Map((config?.books ?? []).map((book) => [book.id, book])), [config]);
  const activeBook = selection ? booksById.get(selection.bookId) : null;
  const isDirty = JSON.stringify({ hidden: [...draftHidden].sort((a, b) => a - b), painted: [...draftPainted].sort((a, b) => a - b) }) !== JSON.stringify({ hidden: [...savedHidden].sort((a, b) => a - b), painted: [...savedPainted].sort((a, b) => a - b) });

  useEffect(() => {
    if (!selection) return undefined;
    chapterRequest.current?.abort();
    stateRequest.current?.abort();
    const chapterController = new AbortController();
    const recallController = new AbortController();
    chapterRequest.current = chapterController;
    stateRequest.current = recallController;
    setChapter({ status: 'loading', data: null });
    setStateStatus('loading');
    setSaveStatus('idle');
    Promise.all([getChapter(selection.bookId, selection.chapter, chapterController.signal), getRecallState(selection.bookId, selection.chapter, recallController.signal)])
      .then(([chapterData, stateData]) => {
        if (chapterController.signal.aborted) return;
        const values = stateData.hiddenVerses ?? [];
        const paintedValues = stateData.paintedVerses ?? [];
        setChapter({ status: 'ready', data: chapterData });
        setSavedHidden(values);
        setDraftHidden(values);
        setSavedPainted(paintedValues);
        setDraftPainted(paintedValues);
        setStateStatus('ready');
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setChapter({ status: 'error', data: null });
          setStateStatus('error');
          setError(requestError.message);
        }
      });
    return () => { chapterController.abort(); recallController.abort(); };
  }, [selection?.bookId, selection?.chapter]);

  useEffect(() => {
    const bookIds = [...expanded].filter((bookId) => booksById.has(bookId) && !recallSummaries[bookId]);
    if (!bookIds.length) return undefined;
    const controller = new AbortController();
    Promise.all(bookIds.map((bookId) => getRecallSummary(bookId, controller.signal)))
      .then((summaries) => {
        if (!controller.signal.aborted) setRecallSummaries((current) => ({ ...current, ...Object.fromEntries(summaries.map((summary) => [summary.book, summary.chapters])) }));
      })
      .catch((requestError) => { if (requestError.name !== 'AbortError') setError(requestError.message); });
    return () => controller.abort();
  }, [booksById, expanded, recallSummaries]);

  const toggleGroup = (groupId) => setExpanded((current) => {
    const next = new Set(current);
    next.has(groupId) ? next.delete(groupId) : next.add(groupId);
    return next;
  });
  const selectChapter = (bookId, chapterNumber) => {
    setExpanded((current) => new Set([...current, bookId]));
    setSelection({ bookId, chapter: chapterNumber });
  };
  const toggleBook = (bookId) => setExpanded((current) => {
    const next = new Set(current);
    next.has(bookId) ? next.delete(bookId) : next.add(bookId);
    return next;
  });
  const toggleVerse = (number) => {
    setDraftHidden((current) => current.includes(number) ? current.filter((item) => item !== number) : [...current, number].sort((a, b) => a - b));
    setDraftPainted((current) => current.filter((item) => item !== number));
  };
  const togglePaint = (number) => {
    setDraftHidden((current) => current.includes(number) ? current : [...current, number].sort((a, b) => a - b));
    setDraftPainted((current) => current.includes(number) ? current.filter((item) => item !== number) : [...current, number].sort((a, b) => a - b));
  };
  const revealAll = () => { setDraftHidden([]); setDraftPainted([]); };
  const hideAll = () => { setDraftHidden(chapter.data?.verses.map((verse) => verse.number) ?? []); setDraftPainted([]); };

  async function save() {
    if (!selection || !isDirty) return;
    setSaveStatus('saving');
    try {
      const saved = await saveRecallState(selection.bookId, selection.chapter, draftHidden, draftPainted);
      setSavedHidden(saved.hiddenVerses);
      setSavedPainted(saved.paintedVerses);
      setRecallSummaries((current) => ({ ...current, [selection.bookId]: saved.chapters }));
      setSaveStatus('saved');
      window.setTimeout(() => setSaveStatus('idle'), 1600);
    } catch (requestError) {
      setError(requestError.message);
      setSaveStatus('error');
    }
  }

  if (error && !config) return <main className="recall-boot"><strong>无法打开 Recall Verses</strong><span>{error}</span><button onClick={() => location.reload()}>重试</button></main>;
  if (!config || !selection || !activeBook) return <main className="recall-boot"><Leaf size={28} /><strong>正在预备经文…</strong></main>;

  return <main className="recall-app">
    <aside className="recall-directory" aria-label="经卷与章节">
      <header className="recall-brand"><span className="recall-brand-mark"><Leaf size={18} /></span><h1>Recall Verses</h1></header>
      <nav className="recall-book-list">
        {GROUPS.map((group) => {
          const books = group.bookIds.map((id) => booksById.get(id)).filter(Boolean);
          const isOpen = expanded.has(group.id);
          return <section className="recall-group" key={group.id}>
            <button className="recall-group-title" onClick={() => toggleGroup(group.id)} aria-expanded={isOpen}><span>{group.label}</span><ChevronDown size={15} className={isOpen ? 'is-open' : ''} /></button>
            {isOpen && books.map((book) => {
              const bookOpen = expanded.has(book.id);
              return <div className="recall-book" key={book.id}>
                <button className={`recall-book-title ${book.id === selection.bookId ? 'is-active' : ''}`} onClick={() => toggleBook(book.id)} aria-expanded={bookOpen}>{book.name}</button>
                {bookOpen && <div className="recall-chapters" aria-label={`${book.name}章节`}>
                  {Array.from({ length: book.chapters }, (_, index) => index + 1).map((chapterNumber) => {
                    const selected = book.id === selection.bookId && chapterNumber === selection.chapter;
                    const hidden = recallSummaries[book.id]?.[chapterNumber] ?? 0;
                    return <button key={chapterNumber} onClick={() => selectChapter(book.id, chapterNumber)} className={`recall-chapter ${selected ? 'is-selected' : ''} ${hidden ? 'has-hidden' : ''}`} title={`${book.name}${chapterNumber}章${hidden ? `：${hidden} 节待回想` : ''}`}>
                      <span>{chapterNumber}</span>{hidden > 0 && <i>{hidden}</i>}
                    </button>;
                  })}
                </div>}
              </div>;
            })}
          </section>;
        })}
      </nav>
    </aside>

    <section className="recall-scripture" aria-label="经文回想">
      <header className="recall-header">
        <h2>{activeBook.name}<span>{selection.chapter} 章</span></h2>
        <div className="recall-header-actions">
          <div className="recall-chapter-tools"><span><EyeOff size={15} />本章 <strong>{draftHidden.length}</strong> 节待回想</span><div><button onClick={hideAll} disabled={!chapter.data?.verses.length}>全部隐藏</button><button onClick={revealAll} disabled={!draftHidden.length}>全部显示</button></div></div>
          <div className="recall-save-tools"><span className={`recall-save-state ${isDirty ? 'is-dirty' : ''}`}>{saveStatus === 'saving' ? '正在保存…' : saveStatus === 'saved' ? '已保存' : saveStatus === 'error' ? '保存失败' : isDirty ? '尚未保存' : '已同步'}</span><button className="recall-save" onClick={save} disabled={!isDirty || saveStatus === 'saving'}><Save size={15} />保存</button></div>
        </div>
      </header>
      <div className="recall-reading">
        {chapter.status === 'loading' && <div className="recall-state">正在载入经文…</div>}
        {chapter.status === 'error' && <div className="recall-state is-error">{error}<button onClick={() => setSelection({ ...selection })}>重试</button></div>}
        {chapter.status === 'ready' && <div className="recall-verses" role="list">
          {chapter.data.verses.map((verse) => {
            const hidden = draftHidden.includes(verse.number);
            const painted = hidden && draftPainted.includes(verse.number);
            return <article className={`recall-verse ${hidden ? 'is-hidden' : ''} ${painted ? 'is-painted' : ''}`} key={verse.number} role="listitem">
              <button className="recall-verse-main" onClick={() => toggleVerse(verse.number)} aria-pressed={hidden} aria-label={`${hidden ? '显示' : '隐藏'}第 ${verse.number} 节`}>
                <span className="recall-verse-number">{verse.number}</span>
                {hidden ? <span className="recall-blank"><EyeOff size={17} /></span> : <span className="recall-verse-text">{cleanText(verse.text)}</span>}
              </button>
              <div className="recall-verse-actions"><button className="recall-paint" onClick={() => togglePaint(verse.number)} title={painted ? '取消蓝色重点标记' : '标记为蓝色重点回想'} aria-label={painted ? '取消蓝色重点标记' : '标记为蓝色重点回想'}><Paintbrush size={15} /></button><button className="recall-visibility" onClick={() => toggleVerse(verse.number)} title={hidden ? '显示本节' : '隐藏本节'} aria-label={hidden ? '显示本节' : '隐藏本节'}>{hidden ? <Eye size={16} /> : <EyeOff size={16} />}</button></div>
            </article>;
          })}
        </div>}
      </div>
      <footer className="recall-footer"><BookOpen size={15} />惟喜爱耶和华律法，昼夜思想，这人便为有福！</footer>
    </section>
  </main>;
}
