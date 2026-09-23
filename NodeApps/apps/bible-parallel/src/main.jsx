import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BookOpenText, ChevronDown, ChevronLeft, ChevronRight, Columns2, Columns3, Minus, Plus, RotateCcw } from 'lucide-react';

const API_ROOT = '/bible-parallel/api';
const SECTIONS = [
  { id: 'old', label: '旧约', start: 0, end: 22 },
  { id: 'prophets', label: '先知', start: 22, end: 39 },
  { id: 'gospels', label: '福音', start: 39, end: 43 },
  { id: 'new', label: '新约', start: 43 },
];
const DEFAULT_BOOK = 'John';
const MIN_WIDTH = 264;
const DIVIDER_WIDTH = 1;

async function request(path, options = {}) {
  const response = await fetch(`${API_ROOT}${path}`, { signal: options.signal });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || '无法读取经文。');
  return body;
}

function formatReference(book, chapter) {
  return `${book?.name ?? ''}${chapter}章`;
}

function buildRows(chapter) {
  const maps = Object.fromEntries(Object.entries(chapter?.translations ?? {}).map(([id, verses]) => [id, new Map(verses.map((verse) => [verse.number, verse.text]))]));
  const verseNumbers = [...new Set(Object.values(maps).flatMap((map) => [...map.keys()]))].sort((a, b) => a - b);
  return verseNumbers.map((number) => ({ number, translations: Object.fromEntries(Object.entries(maps).map(([id, map]) => [id, map.get(number) ?? ''])) }));
}

function useStoredNumber(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const stored = Number(localStorage.getItem(key));
      return Number.isFinite(stored) && stored >= 16 && stored <= 30 ? stored : initial;
    } catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, String(value)); } catch { /* Browser storage is optional. */ }
  }, [key, value]);
  return [value, setValue];
}

export default function BibleParallel() {
  const [config, setConfig] = useState(null);
  const [selection, setSelection] = useState({ bookId: DEFAULT_BOOK, chapter: 1 });
  const [activeSection, setActiveSection] = useState('gospels');
  const [expanded, setExpanded] = useState(() => new Set(['Matthew', 'Mark', 'Luke', 'John']));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [columnCount, setColumnCount] = useState(2);
  const [fractions, setFractions] = useState([1, 1]);
  const [fontSize, setFontSize] = useStoredNumber('bible-parallel:font-size', 20);
  const [chapter, setChapter] = useState({ status: 'loading', data: null, error: '' });
  const readerRef = useRef(null);
  const dragRef = useRef(null);
  const translationIds = columnCount === 3 ? ['cuv', 'esv', 'nvi'] : ['cuv', 'esv'];
  const translationQuery = translationIds.join(',');

  useEffect(() => {
    const controller = new AbortController();
    request('/config', { signal: controller.signal })
      .then(setConfig)
      .catch((error) => { if (error.name !== 'AbortError') setConfig({ error: error.message, books: [] }); });
    return () => controller.abort();
  }, []);

  const loadChapter = useCallback((bookId, chapterNumber, translations) => {
    const controller = new AbortController();
    setChapter({ status: 'loading', data: null, error: '' });
    request(`/chapters/${encodeURIComponent(bookId)}/${chapterNumber}?translations=${encodeURIComponent(translations)}`, { signal: controller.signal })
      .then((data) => setChapter({ status: 'ready', data, error: '' }))
      .catch((error) => { if (error.name !== 'AbortError') setChapter({ status: 'error', data: null, error: error.message }); });
    return () => controller.abort();
  }, []);

  useEffect(() => loadChapter(selection.bookId, selection.chapter, translationQuery), [loadChapter, selection.bookId, selection.chapter, translationQuery]);

  const books = config?.books ?? [];
  const selectedBook = useMemo(() => books.find((book) => book.id === selection.bookId) ?? chapter.data?.book, [books, selection.bookId, chapter.data]);
  const visibleBooks = useMemo(() => {
    const section = SECTIONS.find((item) => item.id === activeSection) ?? SECTIONS[0];
    return books.slice(section.start, section.end);
  }, [activeSection, books]);
  const rows = useMemo(() => buildRows(chapter.data), [chapter.data]);
  const gridTemplate = fractions.map((fraction) => `minmax(${MIN_WIDTH}px, ${fraction}fr)`).join(` ${DIVIDER_WIDTH}px `);

  const selectChapter = (bookId, chapterNumber) => {
    setSelection({ bookId, chapter: chapterNumber });
    const book = books.find((item) => item.id === bookId);
    if (book) setActiveSection(SECTIONS.find((section) => book.order - 1 >= section.start && (section.end === undefined || book.order - 1 < section.end))?.id ?? 'old');
  };

  const changeColumns = (count) => {
    setColumnCount(count);
    setFractions(count === 3 ? [1, 1, 1] : [1, 1]);
  };

  const resetColumnWidths = () => setFractions(columnCount === 3 ? [1, 1, 1] : [1, 1]);

  const changeChapter = (offset) => {
    if (!selectedBook) return;
    const chapterNumber = selection.chapter + offset;
    if (chapterNumber >= 1 && chapterNumber <= selectedBook.chapters) selectChapter(selectedBook.id, chapterNumber);
  };

  const startResize = (event, dividerIndex) => {
    if (!readerRef.current) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const available = readerRef.current.getBoundingClientRect().width - DIVIDER_WIDTH * (columnCount - 1);
    const total = fractions.reduce((sum, value) => sum + value, 0);
    dragRef.current = {
      dividerIndex,
      startX: event.clientX,
      available,
      widths: fractions.map((value) => (value / total) * available),
    };
  };

  const moveResize = (event) => {
    const drag = dragRef.current;
    if (!drag) return;
    const left = drag.widths[drag.dividerIndex];
    const right = drag.widths[drag.dividerIndex + 1];
    const delta = Math.max(MIN_WIDTH - left, Math.min(event.clientX - drag.startX, right - MIN_WIDTH));
    const next = [...drag.widths];
    next[drag.dividerIndex] = left + delta;
    next[drag.dividerIndex + 1] = right - delta;
    setFractions(next.map((width) => width / drag.available));
  };

  const stopResize = (event) => {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current = null;
  };

  const renderGrid = (children, className = '') => <div className={`parallel-grid ${className}`} style={{ gridTemplateColumns: gridTemplate }}>{children}</div>;

  return <main className={`parallel-app ${sidebarCollapsed ? 'sidebar-is-collapsed' : ''}`}>
    <aside className={`parallel-sidebar ${sidebarCollapsed ? 'is-collapsed' : ''}`} aria-label="圣经目录">
      <button className="sidebar-collapse-toggle" type="button" onClick={() => setSidebarCollapsed((collapsed) => !collapsed)} aria-expanded={!sidebarCollapsed} aria-label={sidebarCollapsed ? '展开圣经目录' : '收起圣经目录'} title={sidebarCollapsed ? '展开圣经目录' : '收起圣经目录'}>
        {sidebarCollapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
      </button>
      <div className="parallel-brand">
        <span className="brand-mark"><BookOpenText size={20} strokeWidth={1.8} /></span>
        <div><span>PARALLEL BIBLE</span><h1>对照读经</h1></div>
      </div>
      <div className="testament-tabs" role="tablist" aria-label="圣经分段">
        {SECTIONS.map((section) => <button key={section.id} type="button" role="tab" aria-selected={activeSection === section.id} className={activeSection === section.id ? 'is-active' : ''} onClick={() => setActiveSection(section.id)}>{section.label}</button>)}
      </div>
      <nav className="parallel-book-nav" aria-label="选择经卷与章节">
        {visibleBooks.map((book) => {
          const isOpen = expanded.has(book.id);
          const isCurrent = book.id === selection.bookId;
          return <section className={`parallel-book ${isCurrent ? 'is-current' : ''}`} key={book.id}>
            <button className="parallel-book-button" type="button" aria-expanded={isOpen} onClick={() => setExpanded((current) => {
              const next = new Set(current); isOpen ? next.delete(book.id) : next.add(book.id); return next;
            })}>
              <span>{book.name}</span><ChevronDown size={15} className={isOpen ? 'is-open' : ''} />
            </button>
            {isOpen && <div className="parallel-chapters">
              {Array.from({ length: book.chapters }, (_, index) => index + 1).map((number) => <button key={number} type="button" className={isCurrent && selection.chapter === number ? 'is-selected' : ''} onClick={() => selectChapter(book.id, number)} aria-label={`${book.name}第${number}章`}>{number}</button>)}
            </div>}
          </section>;
        })}
      </nav>
    </aside>

    <section className="parallel-main">
      <header className="parallel-toolbar">
        <div className="chapter-title">
          <h2>{formatReference(selectedBook, selection.chapter)}</h2>
        </div>
        <div className="toolbar-actions">
          <div className="layout-toggle" aria-label="对照栏数">
            <button type="button" className={columnCount === 2 ? 'is-active' : ''} onClick={() => changeColumns(2)} aria-pressed={columnCount === 2} title="中英双栏"><Columns2 size={17} /> <span>中英</span></button>
            <button type="button" className={columnCount === 3 ? 'is-active' : ''} onClick={() => changeColumns(3)} aria-pressed={columnCount === 3} title="中英西三栏"><Columns3 size={17} /> <span>中英西</span></button>
          </div>
          <div className="font-controls" aria-label="文字大小">
            <button type="button" onClick={() => setFontSize((size) => Math.max(16, size - 1))} aria-label="缩小文字"><Minus size={15} /></button>
            <span>{fontSize}px</span>
            <button type="button" onClick={() => setFontSize((size) => Math.min(30, size + 1))} aria-label="放大文字"><Plus size={15} /></button>
          </div>
          <button className="equal-width-button" type="button" onClick={resetColumnWidths} title="将所有阅读栏恢复为等宽" aria-label="恢复等宽"><RotateCcw size={15} /><span>等宽</span></button>
        </div>
      </header>
      <div className="parallel-reader-wrap">
        <div className="parallel-reader" ref={readerRef} style={{ '--reading-font-size': `${fontSize}px` }}>
          {renderGrid(translationIds.flatMap((id, index) => [
            <div className={`translation-heading translation-${id}`} key={`heading-${id}`}>{id === 'cuv' ? '中文和合本 · CUV' : id === 'esv' ? 'English · ESV' : 'Spanish · NVI'}</div>,
            index < translationIds.length - 1 && <div className="column-resizer" key={`resizer-${id}`} role="separator" aria-orientation="vertical" aria-label={`拖动调整${id === 'cuv' ? '中文' : '英文'}栏宽`} title="拖动调整栏宽" onPointerDown={(event) => startResize(event, index)} onPointerMove={moveResize} onPointerUp={stopResize} onPointerCancel={stopResize}><i /><i /><i /></div>,
          ]), 'translation-headings')}
          {chapter.status === 'loading' && <div className="reader-state">正在打开这一章…</div>}
          {chapter.status === 'error' && <div className="reader-state is-error"><strong>经文暂时无法打开</strong><span>{chapter.error}</span><button type="button" onClick={() => loadChapter(selection.bookId, selection.chapter, translationQuery)}>重新载入</button></div>}
          {chapter.status === 'ready' && <div className="verse-list">
            {rows.map((row) => renderGrid(translationIds.flatMap((id, index) => [
              <article className={`parallel-verse translation-${id}`} key={`${row.number}-${id}`}><span className="verse-number">{row.number}</span><p>{row.translations[id] || <em>此译本未收录本节</em>}</p></article>,
              index < translationIds.length - 1 && <div className="verse-resizer" key={`${row.number}-rule-${id}`} title="拖动调整栏宽" onPointerDown={(event) => startResize(event, index)} onPointerMove={moveResize} onPointerUp={stopResize} onPointerCancel={stopResize} />,
            ]), 'parallel-verse-row'))}
          </div>}
        </div>
      </div>
      <footer className="parallel-footer">
        <button type="button" onClick={() => changeChapter(-1)} disabled={selection.chapter === 1}><ChevronLeft size={18} />上一章</button>
        <button type="button" onClick={() => changeChapter(1)} disabled={selection.chapter === selectedBook?.chapters}>下一章<ChevronRight size={18} /></button>
      </footer>
    </section>
  </main>;
}
