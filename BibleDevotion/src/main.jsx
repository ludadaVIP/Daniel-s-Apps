import { StrictMode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getChapter, getConfig, getNote, putNote } from './services/api.js';
import './styles.css';

const BOOK_SECTIONS = [
  { id: 'old', label: '旧约', start: 0, end: 22 },
  { id: 'prophets', label: '先知', start: 22, end: 39 },
  { id: 'gospels', label: '福音', start: 39, end: 43 },
  { id: 'new', label: '新约', start: 43 },
];
const DEFAULT_SECTION_ID = 'gospels';
const DEFAULT_BOOK_ID = 'John';
const MODES = [
  ['read', '阅读'],
  ['edit', '编辑'],
  ['split', '对照'],
];
const RAIL_PREFERENCE_KEY = 'bible-devotion:directory-collapsed';

function readRailPreference() {
  try {
    return window.localStorage.getItem(RAIL_PREFERENCE_KEY) === 'true';
  } catch {
    return false;
  }
}

function targetKey(target) {
  return `${target.bookId}:${target.chapter}:${target.verse ?? 'chapter'}`;
}

function labelForTarget(target, bookName) {
  return `${bookName}${target.chapter}章${target.verse ? `${target.verse}节` : ''}`;
}

function copyIndex(index) {
  return {
    version: 1,
    chapters: Object.fromEntries(Object.entries(index?.chapters ?? {}).map(([book, chapters]) => [book, [...chapters]])),
    verses: Object.fromEntries(Object.entries(index?.verses ?? {}).map(([book, chapters]) => [book, Object.fromEntries(Object.entries(chapters).map(([chapter, verses]) => [chapter, [...verses]]))])),
  };
}

function updateMarker(index, target, exists) {
  const next = copyIndex(index);
  if (target.verse) {
    const book = next.verses[target.bookId] ?? (next.verses[target.bookId] = {});
    const verses = new Set(book[target.chapter] ?? []);
    exists ? verses.add(target.verse) : verses.delete(target.verse);
    if (verses.size) book[target.chapter] = [...verses].sort((a, b) => a - b);
    else delete book[target.chapter];
    if (!Object.keys(book).length) delete next.verses[target.bookId];
  } else {
    const chapters = new Set(next.chapters[target.bookId] ?? []);
    exists ? chapters.add(target.chapter) : chapters.delete(target.chapter);
    if (chapters.size) next.chapters[target.bookId] = [...chapters].sort((a, b) => a - b);
    else delete next.chapters[target.bookId];
  }
  return next;
}

function hasChapterNote(index, bookId, chapter) {
  return Boolean(index.chapters?.[bookId]?.includes(chapter));
}

function hasVerseNote(index, bookId, chapter, verse) {
  return Boolean(index.verses?.[bookId]?.[chapter]?.includes(verse));
}

function bookHasNote(index, bookId) {
  return Boolean(index.chapters?.[bookId]?.length || Object.keys(index.verses?.[bookId] ?? {}).length);
}

function App() {
  const [config, setConfig] = useState(null);
  const [configError, setConfigError] = useState('');
  const [selection, setSelection] = useState(null);
  const [expanded, setExpanded] = useState(() => new Set());
  const [activeSection, setActiveSection] = useState(DEFAULT_SECTION_ID);
  const [chapterData, setChapterData] = useState({ status: 'idle', data: null, error: '' });
  const [note, setNote] = useState({ key: '', status: 'idle', exists: false, error: '' });
  const [draft, setDraft] = useState('');
  const [mode, setMode] = useState('split');
  const [railCollapsed, setRailCollapsed] = useState(readRailPreference);
  const noteController = useRef(null);
  const chapterController = useRef(null);
  const synced = useRef(new Map());
  const saveVersions = useRef(new Map());
  const latestSelection = useRef(null);
  const latestNote = useRef(null);
  const latestDraft = useRef('');

  useEffect(() => {
    const controller = new AbortController();
    getConfig(controller.signal)
      .then((data) => {
        setConfig(data);
        const defaultBook = data.books.find((book) => book.id === DEFAULT_BOOK_ID) ?? data.books[0];
        if (defaultBook) {
          setSelection({ bookId: defaultBook.id, chapter: 1 });
          setExpanded(new Set([defaultBook.id]));
        }
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setConfigError(error.message);
      });
    return () => controller.abort();
  }, []);

  const booksById = useMemo(() => new Map((config?.books ?? []).map((book) => [book.id, book])), [config]);
  const activeTarget = selection && { ...selection };
  const activeKey = activeTarget ? targetKey(activeTarget) : '';
  const activeBook = selection ? booksById.get(selection.bookId) : null;
  const visibleBooks = useMemo(() => {
    const section = BOOK_SECTIONS.find((item) => item.id === activeSection) ?? BOOK_SECTIONS[0];
    return config?.books.slice(section.start, section.end) ?? [];
  }, [activeSection, config]);
  latestSelection.current = activeTarget;
  latestNote.current = note;
  latestDraft.current = draft;

  useEffect(() => {
    if (!selection) return undefined;
    chapterController.current?.abort();
    const controller = new AbortController();
    chapterController.current = controller;
    setChapterData({ status: 'loading', data: null, error: '' });
    getChapter(selection.bookId, selection.chapter, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setChapterData({ status: 'ready', data, error: '' });
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setChapterData({ status: 'error', data: null, error: error.message });
      });
    return () => controller.abort();
  }, [selection?.bookId, selection?.chapter]);

  useEffect(() => {
    if (!activeTarget) return undefined;
    noteController.current?.abort();
    const controller = new AbortController();
    noteController.current = controller;
    setNote({ key: activeKey, status: 'loading', exists: false, error: '' });
    setDraft('');
    getNote(activeTarget, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        synced.current.set(activeKey, data.content);
        setDraft(data.content);
        setNote({ key: activeKey, status: 'ready', exists: data.exists, error: '' });
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setNote({ key: activeKey, status: 'error', exists: false, error: error.message });
      });
    return () => controller.abort();
  }, [activeKey]);

  const saveTarget = useCallback(async (target, content) => {
    const key = targetKey(target);
    const version = (saveVersions.current.get(key) ?? 0) + 1;
    saveVersions.current.set(key, version);
    if (latestSelection.current && targetKey(latestSelection.current) === key) {
      setNote((current) => current.key === key ? { ...current, status: 'saving', error: '' } : current);
    }
    try {
      const saved = await putNote(target, content);
      if (saveVersions.current.get(key) !== version) return;
      synced.current.set(key, saved.content);
      setConfig((current) => current ? { ...current, noteIndex: updateMarker(current.noteIndex, target, saved.exists) } : current);
      if (latestSelection.current && targetKey(latestSelection.current) === key) {
        setNote({ key, status: 'saved', exists: saved.exists, error: '' });
        window.setTimeout(() => {
          if (latestSelection.current && targetKey(latestSelection.current) === key) {
            setNote((current) => current.key === key && current.status === 'saved' ? { ...current, status: 'ready' } : current);
          }
        }, 1400);
      }
    } catch (error) {
      if (saveVersions.current.get(key) !== version) return;
      if (latestSelection.current && targetKey(latestSelection.current) === key) {
        // An edit may have happened while this request was in flight.  Keep
        // that newer draft eligible for autosave instead of stranding it in
        // the failure state.
        const hasNewerDraft = latestDraft.current !== content;
        setNote((current) => current.key === key
          ? { ...current, status: hasNewerDraft ? 'ready' : 'error', error: hasNewerDraft ? '' : error.message }
          : current);
      }
    }
  }, []);

  const flushCurrent = useCallback(() => {
    const currentTarget = latestSelection.current;
    const currentNote = latestNote.current;
    if (!currentTarget || currentNote?.key !== targetKey(currentTarget) || currentNote.status === 'loading') return;
    const currentDraft = latestDraft.current;
    if (synced.current.get(targetKey(currentTarget)) !== currentDraft) saveTarget(currentTarget, currentDraft);
  }, [saveTarget]);

  useEffect(() => {
    if (!activeTarget || note.key !== activeKey || !['ready', 'saved'].includes(note.status)) return undefined;
    if (synced.current.get(activeKey) === draft) return undefined;
    const timer = window.setTimeout(() => saveTarget(activeTarget, draft), 800);
    return () => window.clearTimeout(timer);
  }, [activeKey, draft, note.key, note.status, saveTarget]);

  useEffect(() => {
    const flushBeforeLeaving = () => flushCurrent();
    const flushWhenHidden = () => {
      if (document.visibilityState === 'hidden') flushCurrent();
    };
    window.addEventListener('pagehide', flushBeforeLeaving);
    document.addEventListener('visibilitychange', flushWhenHidden);
    return () => {
      window.removeEventListener('pagehide', flushBeforeLeaving);
      document.removeEventListener('visibilitychange', flushWhenHidden);
    };
  }, [flushCurrent]);

  useEffect(() => {
    const saveShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        flushCurrent();
        return;
      }
      if (event.key === 'Escape' && !event.defaultPrevented) setRailCollapsed(true);
    };
    window.addEventListener('keydown', saveShortcut);
    return () => window.removeEventListener('keydown', saveShortcut);
  }, [flushCurrent]);

  useEffect(() => {
    try {
      window.localStorage.setItem(RAIL_PREFERENCE_KEY, String(railCollapsed));
    } catch {
      // A blocked browser storage setting should not make the directory unusable.
    }
  }, [railCollapsed]);

  const selectChapter = (bookId, chapter) => {
    flushCurrent();
    setSelection({ bookId, chapter });
    setExpanded((current) => new Set(current).add(bookId));
  };

  const selectVerse = (verse) => {
    if (!selection) return;
    flushCurrent();
    setSelection({ ...selection, verse });
  };

  const clearVerse = () => {
    if (!selection?.verse) return;
    flushCurrent();
    setSelection({ bookId: selection.bookId, chapter: selection.chapter });
  };

  const updateDraft = (event) => {
    const nextDraft = event.target.value;
    setDraft(nextDraft);
    // A new keystroke is an explicit retry after a failed save.  Clearing the
    // status here lets the existing debounce schedule the retry without
    // automatically looping requests for an unchanged failed draft.
    setNote((current) => current.key === activeKey && current.status === 'error'
      ? { ...current, status: 'ready', error: '' }
      : current);
  };

  if (configError) {
    return <main className="boot-state"><strong>无法打开灵修记录</strong><span>{configError}</span><button onClick={() => window.location.reload()}>重新加载</button></main>;
  }

  if (!config || !selection || !activeBook) {
    return <main className="boot-state"><div className="cross-mark">✦</div><strong>Bible Devotion</strong><span>正在准备中文和合本与您的灵修笔记…</span></main>;
  }

  const isVerse = Boolean(selection.verse);
  const reference = labelForTarget(selection, activeBook.name);
  const noteStatus = note.key === activeKey ? note.status : 'loading';
  const statusText = noteStatus === 'loading' ? '正在读取…' : noteStatus === 'saving' ? '正在保存…' : noteStatus === 'saved' ? '已保存' : noteStatus === 'error' ? '保存失败' : draft !== (synced.current.get(activeKey) ?? '') ? '尚未保存' : '已同步';

  return (
    <main className={`devotion-app ${railCollapsed ? 'rail-is-collapsed' : ''}`}>
      <aside className={`book-rail ${railCollapsed ? 'is-collapsed' : ''}`} aria-label="圣经目录">
        <button
          className="rail-toggle"
          type="button"
          onClick={() => setRailCollapsed((collapsed) => !collapsed)}
          aria-controls="book-navigation"
          aria-expanded={!railCollapsed}
          aria-label={railCollapsed ? '展开圣经目录' : '收起圣经目录'}
          title={railCollapsed ? '展开圣经目录' : '收起圣经目录'}
        >
          <span aria-hidden="true">{railCollapsed ? '›' : '‹'}</span>
          <span className="sr-only">{railCollapsed ? '展开圣经目录' : '收起圣经目录'}</span>
        </button>
        {!railCollapsed && <>
          <div className="rail-top">
            <header className="rail-header">
              <div className="eyebrow">PERSONAL DEVOTION</div>
              <h1>静读圣言</h1>
            </header>
            <div className="directory-tabs" role="tablist" aria-label="圣经分段">
              {BOOK_SECTIONS.map((section) => <button
                key={section.id}
                type="button"
                role="tab"
                className={activeSection === section.id ? 'is-active' : ''}
                aria-selected={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
              >{section.label}</button>)}
            </div>
          </div>
          <nav id="book-navigation" className="book-navigation" aria-label="选择经卷与章节">
          <section className="testament" aria-label={BOOK_SECTIONS.find((section) => section.id === activeSection)?.label}>
            {visibleBooks.map((book) => {
              const isOpen = expanded.has(book.id);
              const isCurrentBook = book.id === selection.bookId;
              return <div className="book-group" key={book.id}>
                <button className={`book-button ${isCurrentBook ? 'is-current' : ''}`} onClick={() => setExpanded((current) => {
                  const next = new Set(current); isOpen ? next.delete(book.id) : next.add(book.id); return next;
                })} aria-expanded={isOpen}>
                  <span className="book-caret" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                  <span>{book.name}</span>
                  {bookHasNote(config.noteIndex, book.id) && <span className="book-note-dot" title="此卷含有灵修笔记" aria-label="含有灵修笔记" />}
                </button>
                {isOpen && <div className="chapter-grid" aria-label={`${book.name}章节`}>
                  {Array.from({ length: book.chapters }, (_, index) => index + 1).map((chapter) => {
                    const selected = book.id === selection.bookId && chapter === selection.chapter && !selection.verse;
                    const noted = hasChapterNote(config.noteIndex, book.id, chapter);
                    return <button key={chapter} className={`chapter-square ${selected ? 'is-selected' : ''} ${noted ? 'has-note' : ''}`} onClick={() => selectChapter(book.id, chapter)} aria-label={`${book.name}${chapter}章${noted ? '，有章节笔记' : ''}`}>{chapter}</button>;
                  })}
                </div>}
              </div>;
            })}
          </section>
          </nav>
        </>}
      </aside>

      <section className="scripture-panel" aria-label="圣经章节">
        <header className="scripture-header">
          <div>
            <div className="eyebrow">和合本（中文）</div>
            <h2>{activeBook.name}<span>{selection.chapter}章</span></h2>
          </div>
          {isVerse && <button className="chapter-context-button" onClick={clearVerse}>查看全章笔记</button>}
        </header>
        <div className="scripture-scroll">
          {chapterData.status === 'loading' && <div className="panel-state">正在载入经文…</div>}
          {chapterData.status === 'error' && <div className="panel-state error-state">{chapterData.error}<button onClick={() => selectChapter(selection.bookId, selection.chapter)}>重试</button></div>}
          {chapterData.status === 'ready' && <div className="verses" role="list">
            {chapterData.data.verses.map((verse) => {
              const selected = selection.verse === verse.number;
              const hasNote = hasVerseNote(config.noteIndex, selection.bookId, selection.chapter, verse.number);
              return <button type="button" className={`verse-row ${selected ? 'is-selected' : ''}`} key={verse.number} onClick={() => selectVerse(verse.number)} role="listitem" aria-pressed={selected}>
                <span className="verse-number">{verse.number}</span>
                <span className="verse-text">{verse.text}</span>
                {hasNote && <span className="verse-note-mark" title="此节有灵修笔记" aria-label="此节有灵修笔记">◆</span>}
              </button>;
            })}
          </div>}
        </div>
      </section>

      <aside className="note-rail" aria-label="灵修笔记">
        <header className="note-header">
          <div>
            <div className="eyebrow">{isVerse ? '经节默想' : '全章总览'}</div>
            <h2>{reference}</h2>
            {!isVerse && <p>让这一章的话语在心中成形。</p>}
          </div>
          <div className={`save-status ${noteStatus}`}>{statusText}</div>
        </header>
        <div className="note-toolbar" aria-label="笔记显示方式">
          <div className="mode-switcher">
            {MODES.map(([value, label]) => <button key={value} className={mode === value ? 'is-active' : ''} onClick={() => setMode(value)} aria-pressed={mode === value}>{label}</button>)}
          </div>
          <button className="save-button" onClick={flushCurrent} disabled={noteStatus === 'loading' || noteStatus === 'saving'}>保存 <kbd>⌘/Ctrl S</kbd></button>
        </div>
        {noteStatus === 'error' && <div className="note-error" role="alert">{note.error} <button onClick={flushCurrent}>重试保存</button></div>}
        <div className={`note-workspace mode-${mode}`}>
          {(mode === 'edit' || mode === 'split') && <label className="editor-pane"><span className="sr-only">编辑 {reference} 的 Markdown 笔记</span><textarea value={draft} onChange={updateDraft} disabled={noteStatus === 'loading'} placeholder={`在这里写下 ${reference} 的灵修感动…\n\n支持 Markdown：标题、清单、引用、粗体。`} spellCheck="true" /></label>}
          {(mode === 'read' || mode === 'split') && <article className="markdown-pane" aria-label="Markdown 预览">
            {noteStatus === 'loading' ? <div className="panel-state">正在读取笔记…</div> : draft.trim() ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{draft}</ReactMarkdown> : <div className="empty-note"><span>✦</span><strong>给此处留下一盏灯</strong><p>记录今天从经文中领受的一句话、一个问题，或一段祷告。</p>{mode === 'read' && <button onClick={() => setMode('edit')}>开始记录</button>}</div>}
          </article>}
        </div>
      </aside>
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
