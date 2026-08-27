import { StrictMode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { getChapter, getConfig, getNote, getNoteIndex, getQuestions, putNote, putQuestions } from './services/api.js';
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
const WORKSPACES = [
  ['index', '索引'],
  ['questions', '问题'],
  ['comments', '笔记'],
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

function verseReference(bookName, chapter, verse) {
  return `（${bookName}${chapter}:${verse}）`;
}

function splitNoteContent(content) {
  const match = String(content).match(/^\s*#\s+(.+?)\s*\n(?:\s*\n)?/);
  return match ? { title: match[1].replace(/\s+#+\s*$/, '').trim(), body: content.slice(match[0].length), prefix: match[0] } : { title: '', body: content, prefix: '' };
}

function composeNoteContent(title, body, originalPrefix = '') {
  const cleanTitle = title.trim();
  if (!cleanTitle) return body;
  const originalTitle = originalPrefix.match(/^\s*#\s+(.+?)\s*\n/)?.[1]?.replace(/\s+#+\s*$/, '').trim();
  if (originalTitle === cleanTitle) return `${originalPrefix}${body}`;
  const cleanBody = body.replace(/^\n+/, '');
  return `# ${cleanTitle}${cleanBody ? `\n\n${cleanBody}` : ''}`;
}

async function writeToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Local HTTP development can occasionally lack the modern Clipboard API.
  // Keep copying available with the browser's legacy, user-gesture fallback.
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (!copied) throw new Error('浏览器未允许写入剪贴板。');
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
  const [englishChapter, setEnglishChapter] = useState({ status: 'idle', data: null, error: '' });
  const [scriptureMode, setScriptureMode] = useState('cuv');
  const [note, setNote] = useState({ key: '', status: 'idle', exists: false, error: '' });
  const [draft, setDraft] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteTitlePrefix, setNoteTitlePrefix] = useState('');
  const [mode, setMode] = useState('split');
  const [workspace, setWorkspace] = useState('comments');
  const [indexScope, setIndexScope] = useState('book');
  const [noteIndex, setNoteIndex] = useState({ status: 'idle', entries: [], error: '' });
  const [questions, setQuestions] = useState({ key: '', status: 'idle', exists: false, error: '' });
  const [questionDraft, setQuestionDraft] = useState('');
  const [railCollapsed, setRailCollapsed] = useState(readRailPreference);
  const [copyStatus, setCopyStatus] = useState({ key: '', state: 'idle' });
  const noteController = useRef(null);
  const indexController = useRef(null);
  const questionController = useRef(null);
  const chapterController = useRef(null);
  const englishChapterController = useRef(null);
  const noteWorkspaceRef = useRef(null);
  const synced = useRef(new Map());
  const saveVersions = useRef(new Map());
  const latestSelection = useRef(null);
  const latestNote = useRef(null);
  const latestDraft = useRef('');
  const latestTitle = useRef('');
  const latestTitlePrefix = useRef('');
  const questionSynced = useRef(new Map());
  const questionSaveVersions = useRef(new Map());
  const latestQuestionDraft = useRef('');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getConfig(controller.signal)
      .then((data) => {
        setConfig(data);
        const defaultBook = data.books.find((book) => book.id === DEFAULT_BOOK_ID) ?? data.books[0];
        if (defaultBook) {
          setSelection({ bookId: defaultBook.id, chapter: 1 });
          // The four Gospels form the app's default reading desk.  Opening
          // them costs no Bible-text request; only a selected chapter is read.
          setExpanded(new Set(data.books.slice(39, 43).map((book) => book.id)));
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
  latestTitle.current = noteTitle;
  latestTitlePrefix.current = noteTitlePrefix;
  latestQuestionDraft.current = questionDraft;

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
    englishChapterController.current?.abort();
    if (scriptureMode !== 'bilingual' || !selection) {
      setEnglishChapter({ status: 'idle', data: null, error: '' });
      return undefined;
    }
    const controller = new AbortController();
    englishChapterController.current = controller;
    setEnglishChapter({ status: 'loading', data: null, error: '' });
    getChapter(selection.bookId, selection.chapter, controller.signal, 'esv')
      .then((data) => {
        if (!controller.signal.aborted) setEnglishChapter({ status: 'ready', data, error: '' });
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setEnglishChapter({ status: 'error', data: null, error: error.message });
      });
    return () => controller.abort();
  }, [scriptureMode, selection?.bookId, selection?.chapter]);

  useEffect(() => {
    const workspace = noteWorkspaceRef.current;
    if (!workspace) return undefined;
    // A textarea owns its own scrolling; listening only on its wrapping
    // label leaves the back-to-top button invisible in Edit and Split modes.
    const scrollPanes = [...workspace.querySelectorAll('.editor-pane textarea, .markdown-pane')];
    const updateBackToTopVisibility = () => setShowBackToTop(scrollPanes.some((pane) => pane.scrollTop > 160));
    scrollPanes.forEach((pane) => pane.addEventListener('scroll', updateBackToTopVisibility, { passive: true }));
    updateBackToTopVisibility();
    return () => scrollPanes.forEach((pane) => pane.removeEventListener('scroll', updateBackToTopVisibility));
  }, [mode, note.key, note.status]);

  useEffect(() => {
    if (!activeTarget) return undefined;
    noteController.current?.abort();
    const controller = new AbortController();
    noteController.current = controller;
    setNote({ key: activeKey, status: 'loading', exists: false, error: '' });
    setDraft('');
    setNoteTitle('');
    setNoteTitlePrefix('');
    getNote(activeTarget, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        synced.current.set(activeKey, data.content);
        const parsed = splitNoteContent(data.content);
        setNoteTitle(parsed.title);
        setDraft(parsed.body);
        setNoteTitlePrefix(parsed.prefix);
        setNote({ key: activeKey, status: 'ready', exists: data.exists, error: '' });
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setNote({ key: activeKey, status: 'error', exists: false, error: error.message });
      });
    return () => controller.abort();
  }, [activeKey]);

  useEffect(() => {
    if (!selection) return undefined;
    questionController.current?.abort();
    const controller = new AbortController();
    questionController.current = controller;
    const key = `${selection.bookId}:${selection.chapter}`;
    setQuestions({ key, status: 'loading', exists: false, error: '' });
    setQuestionDraft('');
    getQuestions(selection.bookId, selection.chapter, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        questionSynced.current.set(key, data.content);
        setQuestionDraft(data.content);
        setQuestions({ key, status: 'ready', exists: data.exists, error: '' });
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setQuestions({ key, status: 'error', exists: false, error: error.message });
      });
    return () => controller.abort();
  }, [selection?.bookId, selection?.chapter]);

  useEffect(() => {
    if (workspace !== 'index' || !selection) return undefined;
    indexController.current?.abort();
    const controller = new AbortController();
    indexController.current = controller;
    setNoteIndex({ status: 'loading', entries: [], error: '' });
    getNoteIndex(selection.bookId, indexScope === 'chapter' ? selection.chapter : null, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setNoteIndex({ status: 'ready', entries: data.entries, error: '' });
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setNoteIndex({ status: 'error', entries: [], error: error.message });
      });
    return () => controller.abort();
  }, [workspace, indexScope, selection?.bookId, selection?.chapter]);

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

  const saveQuestionSet = useCallback(async (bookId, chapter, content) => {
    const key = `${bookId}:${chapter}`;
    const version = (questionSaveVersions.current.get(key) ?? 0) + 1;
    questionSaveVersions.current.set(key, version);
    if (latestSelection.current?.bookId === bookId && latestSelection.current?.chapter === chapter) {
      setQuestions((current) => current.key === key ? { ...current, status: 'saving', error: '' } : current);
    }
    try {
      const saved = await putQuestions(bookId, chapter, content);
      if (questionSaveVersions.current.get(key) !== version) return;
      questionSynced.current.set(key, saved.content);
      if (latestSelection.current?.bookId === bookId && latestSelection.current?.chapter === chapter) {
        setQuestions({ key, status: 'saved', exists: saved.exists, error: '' });
        window.setTimeout(() => setQuestions((current) => current.key === key && current.status === 'saved' ? { ...current, status: 'ready' } : current), 1400);
      }
    } catch (error) {
      if (questionSaveVersions.current.get(key) !== version) return;
      if (latestSelection.current?.bookId === bookId && latestSelection.current?.chapter === chapter) {
        setQuestions((current) => current.key === key ? { ...current, status: latestQuestionDraft.current !== content ? 'ready' : 'error', error: latestQuestionDraft.current !== content ? '' : error.message } : current);
      }
    }
  }, []);

  const flushCurrent = useCallback(() => {
    const currentTarget = latestSelection.current;
    const currentNote = latestNote.current;
    if (!currentTarget || currentNote?.key !== targetKey(currentTarget) || currentNote.status === 'loading') return;
    const currentContent = composeNoteContent(latestTitle.current, latestDraft.current, latestTitlePrefix.current);
    if (synced.current.get(targetKey(currentTarget)) !== currentContent) saveTarget(currentTarget, currentContent);
  }, [saveTarget]);

  const flushQuestions = useCallback(() => {
    const currentTarget = latestSelection.current;
    if (!currentTarget) return;
    const key = `${currentTarget.bookId}:${currentTarget.chapter}`;
    const content = latestQuestionDraft.current;
    if (questionSynced.current.get(key) !== content) saveQuestionSet(currentTarget.bookId, currentTarget.chapter, content);
  }, [saveQuestionSet]);

  useEffect(() => {
    if (!activeTarget || note.key !== activeKey || !['ready', 'saved'].includes(note.status)) return undefined;
    const content = composeNoteContent(noteTitle, draft, noteTitlePrefix);
    if (synced.current.get(activeKey) === content) return undefined;
    const timer = window.setTimeout(() => saveTarget(activeTarget, content), 800);
    return () => window.clearTimeout(timer);
  }, [activeKey, draft, noteTitle, noteTitlePrefix, note.key, note.status, saveTarget]);

  useEffect(() => {
    if (!selection || questions.status !== 'ready' || questions.key !== `${selection.bookId}:${selection.chapter}`) return undefined;
    if (questionSynced.current.get(questions.key) === questionDraft) return undefined;
    const timer = window.setTimeout(() => saveQuestionSet(selection.bookId, selection.chapter, questionDraft), 800);
    return () => window.clearTimeout(timer);
  }, [questionDraft, questions.key, questions.status, saveQuestionSet, selection?.bookId, selection?.chapter]);

  useEffect(() => {
    const flushBeforeLeaving = () => { flushCurrent(); flushQuestions(); };
    const flushWhenHidden = () => {
      if (document.visibilityState === 'hidden') { flushCurrent(); flushQuestions(); }
    };
    window.addEventListener('pagehide', flushBeforeLeaving);
    document.addEventListener('visibilitychange', flushWhenHidden);
    return () => {
      window.removeEventListener('pagehide', flushBeforeLeaving);
      document.removeEventListener('visibilitychange', flushWhenHidden);
    };
  }, [flushCurrent, flushQuestions]);

  useEffect(() => {
    const saveShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        if (workspace === 'questions' && selection) saveQuestionSet(selection.bookId, selection.chapter, latestQuestionDraft.current);
        else flushCurrent();
        return;
      }
      if (event.key === 'Escape' && !event.defaultPrevented) setRailCollapsed(true);
    };
    window.addEventListener('keydown', saveShortcut);
    return () => window.removeEventListener('keydown', saveShortcut);
  }, [flushCurrent, saveQuestionSet, selection, workspace]);

  useEffect(() => {
    try {
      window.localStorage.setItem(RAIL_PREFERENCE_KEY, String(railCollapsed));
    } catch {
      // A blocked browser storage setting should not make the directory unusable.
    }
  }, [railCollapsed]);

  const selectChapter = (bookId, chapter) => {
    flushCurrent();
    flushQuestions();
    setSelection({ bookId, chapter });
    setExpanded((current) => new Set(current).add(bookId));
    setIndexScope('chapter');
    setWorkspace('index');
  };

  const selectBookIndex = (bookId) => {
    flushCurrent();
    flushQuestions();
    const chapter = selection?.bookId === bookId ? selection.chapter : 1;
    setSelection({ bookId, chapter });
    setExpanded((current) => new Set(current).add(bookId));
    setWorkspace('index');
    setIndexScope('book');
  };

  const selectVerse = (verse) => {
    if (!selection) return;
    flushCurrent();
    flushQuestions();
    setSelection({ ...selection, verse });
    setWorkspace('comments');
  };

  const clearVerse = () => {
    if (!selection?.verse) return;
    flushCurrent();
    flushQuestions();
    setSelection({ bookId: selection.bookId, chapter: selection.chapter });
    setWorkspace('comments');
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

  const updateNoteTitle = (event) => {
    const nextTitle = event.target.value.replace(/[\r\n]/g, '');
    setNoteTitle(nextTitle);
    setNote((current) => current.key === activeKey && current.status === 'error' ? { ...current, status: 'ready', error: '' } : current);
  };

  const updateQuestionDraft = (event) => {
    const nextDraft = event.target.value;
    setQuestionDraft(nextDraft);
    setQuestions((current) => current.status === 'error' ? { ...current, status: 'ready', error: '' } : current);
  };

  const openIndexedNote = (entry) => {
    flushCurrent();
    flushQuestions();
    const section = BOOK_SECTIONS.find((item) => {
      const bookIndex = config.books.findIndex((book) => book.id === selection.bookId);
      return bookIndex >= item.start && (item.end === undefined || bookIndex < item.end);
    });
    if (section) setActiveSection(section.id);
    setExpanded((current) => new Set(current).add(selection.bookId));
    setSelection({ bookId: selection.bookId, chapter: entry.chapter, ...(entry.verse ? { verse: entry.verse } : {}) });
    setWorkspace('comments');
    setMode('read');
  };

  const scrollNoteToTop = () => {
    noteWorkspaceRef.current?.querySelectorAll('.editor-pane textarea, .markdown-pane').forEach((pane) => {
      pane.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const copyVerse = async (event, verse) => {
    event.stopPropagation();
    const key = `${selection.bookId}:${selection.chapter}:${verse.number}`;
    const referenceText = verseReference(activeBook.name, selection.chapter, verse.number);
    const chineseText = verse.cuv?.text;
    const englishText = verse.esv?.text;
    const content = scriptureMode === 'bilingual'
      ? [
        referenceText,
        chineseText ?? '和合本未收录此节号',
        '',
        `(${selection.bookId} ${selection.chapter}:${verse.number}, ESV)`,
        englishText ?? 'ESV 未收录此节号',
      ].join('\n')
      : [referenceText, chineseText ?? '和合本未收录此节号'].join('\n');

    try {
      await writeToClipboard(content);
      setCopyStatus({ key, state: 'copied' });
      window.setTimeout(() => {
        setCopyStatus((current) => current.key === key ? { key: '', state: 'idle' } : current);
      }, 1600);
    } catch {
      setCopyStatus({ key, state: 'error' });
    }
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
  const questionKey = `${selection.bookId}:${selection.chapter}`;
  const questionStatus = questions.key === questionKey ? questions.status : 'loading';
  const noteContent = composeNoteContent(noteTitle, draft, noteTitlePrefix);
  const statusText = noteStatus === 'loading' ? '正在读取…' : noteStatus === 'saving' ? '正在保存…' : noteStatus === 'saved' ? '已保存' : noteStatus === 'error' ? '保存失败' : noteContent !== (synced.current.get(activeKey) ?? '') ? '尚未保存' : '已同步';
  const questionStatusText = questionStatus === 'loading' ? '正在读取…' : questionStatus === 'saving' ? '正在保存…' : questionStatus === 'saved' ? '已保存' : questionStatus === 'error' ? '保存失败' : questionDraft !== (questionSynced.current.get(questionKey) ?? '') ? '尚未保存' : '已同步';
  const renderedVerses = (() => {
    const cuvVerses = chapterData.data?.verses ?? [];
    if (scriptureMode !== 'bilingual' || englishChapter.status !== 'ready') {
      return cuvVerses.map((cuv) => ({ number: cuv.number, cuv, esv: null }));
    }

    // Keep the ESV lookup explicit: translations occasionally number a
    // chapter differently.  The union means neither translation vanishes.
    const esvMap = new Map((englishChapter.data?.verses ?? []).map((esv) => [esv.number, esv]));
    const cuvMap = new Map(cuvVerses.map((cuv) => [cuv.number, cuv]));
    return [...new Set([...cuvMap.keys(), ...esvMap.keys()])]
      .sort((left, right) => left - right)
      .map((number) => ({ number, cuv: cuvMap.get(number) ?? null, esv: esvMap.get(number) ?? null }));
  })();
  const hasTranslationVariance = scriptureMode === 'bilingual'
    && englishChapter.status === 'ready'
    && renderedVerses.some((verse) => !verse.cuv || !verse.esv);
  const indexedChapterGroups = noteIndex.entries.reduce((groups, entry) => {
    const group = groups.find((item) => item.chapter === entry.chapter);
    if (group) group.entries.push(entry);
    else groups.push({ chapter: entry.chapter, entries: [entry] });
    return groups;
  }, []);

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
                  <button key="book-index" className={`chapter-square book-index-square ${workspace === 'index' && indexScope === 'book' && book.id === selection.bookId ? 'is-selected' : ''}`} onClick={() => selectBookIndex(book.id)} aria-label={`${book.name}0章，全卷灵修索引`} title={`查看${book.name}全卷灵修索引`}>0</button>
                  {Array.from({ length: book.chapters }, (_, index) => index + 1).map((chapter) => {
                    const selected = book.id === selection.bookId && chapter === selection.chapter && !selection.verse;
                    const chapterNote = hasChapterNote(config.noteIndex, book.id, chapter);
                    const verseNotes = config.noteIndex.verses?.[book.id]?.[chapter]?.length ?? 0;
                    const noted = chapterNote || verseNotes;
                    return <button key={chapter} className={`chapter-square ${selected ? 'is-selected' : ''} ${noted ? 'has-note' : ''} ${!chapterNote && verseNotes ? 'has-verse-notes' : ''}`} onClick={() => selectChapter(book.id, chapter)} aria-label={`${book.name}${chapter}章${chapterNote ? '，有章节笔记' : verseNotes ? `，有${verseNotes}则经节笔记` : ''}`}>{chapter}{verseNotes > 0 && <span className="chapter-note-count">{verseNotes}</span>}</button>;
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
            <div className="eyebrow">{scriptureMode === 'bilingual' ? '和合本（中文） · ESV（英文）' : '和合本（中文）'}</div>
            <h2>{activeBook.name}<span>{selection.chapter}章</span></h2>
          </div>
          <div className="scripture-actions">
            <div className="translation-switcher" aria-label="经文显示语言">
              <button type="button" className={scriptureMode === 'cuv' ? 'is-active' : ''} onClick={() => setScriptureMode('cuv')} aria-pressed={scriptureMode === 'cuv'}>中</button>
              <span className="translation-divider" aria-hidden="true">/</span>
              <button type="button" className={scriptureMode === 'bilingual' ? 'is-active' : ''} onClick={() => setScriptureMode('bilingual')} aria-pressed={scriptureMode === 'bilingual'}>中英</button>
            </div>
            {isVerse && <button className="chapter-context-button" onClick={clearVerse}>查看全章笔记</button>}
          </div>
        </header>
        <div className="scripture-scroll">
          {chapterData.status === 'loading' && <div className="panel-state">正在载入经文…</div>}
          {chapterData.status === 'error' && <div className="panel-state error-state">{chapterData.error}<button onClick={() => selectChapter(selection.bookId, selection.chapter)}>重试</button></div>}
          {chapterData.status === 'ready' && scriptureMode === 'bilingual' && englishChapter.status === 'loading' && <div className="translation-loading" role="status">正在载入本章 ESV 对照…</div>}
          {chapterData.status === 'ready' && scriptureMode === 'bilingual' && englishChapter.status === 'error' && <div className="translation-error" role="alert">英文对照暂时无法显示：{englishChapter.error}<button onClick={() => setScriptureMode('cuv')}>返回中文</button></div>}
          {chapterData.status === 'ready' && hasTranslationVariance && <div className="translation-variance" role="status">本章两译本节号略有差异，已依节号顺序完整显示。</div>}
          {chapterData.status === 'ready' && <div className="verses" role="list">
            {renderedVerses.map(({ number, cuv, esv }) => {
              const selected = selection.verse === number;
              const hasNote = hasVerseNote(config.noteIndex, selection.bookId, selection.chapter, number);
              const copyKey = `${selection.bookId}:${selection.chapter}:${number}`;
              const copyState = copyStatus.key === copyKey ? copyStatus.state : 'idle';
              return <div className={`verse-row ${selected ? 'is-selected' : ''} ${!cuv ? 'is-esv-only' : ''}`} key={number} role="listitem">
                <button type="button" className="verse-select" onClick={() => selectVerse(number)} aria-pressed={selected} aria-label={`选择${activeBook.name}${selection.chapter}:${number}`}>
                  <span className="verse-number">{number}</span>
                  <span className="verse-copy">
                    {cuv ? <span className="verse-text">{cuv.text}</span> : <span className="translation-gap">和合本未收录此节号</span>}
                    {scriptureMode === 'bilingual' && (esv ? <span className="verse-english">{esv.text}</span> : <span className="translation-gap">ESV 未收录此节号</span>)}
                  </span>
                  {hasNote && <span className="verse-note-mark" title="此节有灵修笔记" aria-label="此节有灵修笔记">◆</span>}
                </button>
                {selected && <button
                  type="button"
                  className={`copy-verse-button ${copyState === 'error' ? 'is-error' : ''}`}
                  onClick={(event) => copyVerse(event, { number, cuv, esv })}
                  aria-label={`复制${activeBook.name}${selection.chapter}:${number}`}
                  title={copyState === 'error' ? '复制失败，请再试一次' : '复制这节经文'}
                >
                  {copyState === 'copied'
                    ? <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8.25 3.05 3.05L13.25 4" /></svg>
                    : <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5.25" y="2.25" width="7.25" height="8.5" rx="1.15" /><path d="M10.5 5.25H4.65A1.15 1.15 0 0 0 3.5 6.4v6.1c0 .64.51 1.15 1.15 1.15h5.1c.64 0 1.15-.51 1.15-1.15v-1.25" /></svg>}
                  <span className="sr-only">{copyState === 'copied' ? '已复制' : copyState === 'error' ? '重试复制' : '复制这节经文'}</span>
                </button>}
              </div>;
            })}
          </div>}
        </div>
      </section>

      <aside className={`note-rail workspace-${workspace}`} aria-label={workspace === 'index' ? '灵修索引' : workspace === 'questions' ? '讨论问题' : '灵修笔记'}>
        <header className="note-header">
          <div className="note-context">
            <div className="eyebrow">{workspace === 'index' ? 'DEVOTION INDEX' : workspace === 'questions' ? 'SMALL GROUP' : isVerse ? '经节默想' : '全章总览'}</div>
            <h2>{workspace === 'index' ? `${activeBook.name}${indexScope === 'book' ? '' : `${selection.chapter}章`}` : workspace === 'questions' ? `${activeBook.name}${selection.chapter}章` : reference}</h2>
          </div>
          {workspace === 'comments' && <label className="note-title-field"><span className="sr-only">笔记标题</span><input value={noteTitle} onChange={updateNoteTitle} disabled={noteStatus === 'loading'} placeholder="为这篇灵修写一个标题" /></label>}
          <div className={`save-status ${workspace === 'questions' ? questionStatus : noteStatus}`}>{workspace === 'index' ? `${indexScope === 'book' ? '本卷' : '本章'}记录` : workspace === 'questions' ? questionStatusText : statusText}</div>
        </header>
        <div className="note-toolbar">
          <div className="mode-switcher workspace-switcher" role="tablist" aria-label="灵修工作区">
            {WORKSPACES.map(([value, label]) => <button key={value} type="button" role="tab" className={workspace === value ? 'is-active' : ''} aria-selected={workspace === value} onClick={() => { if (value === 'index') setIndexScope('chapter'); setWorkspace(value); }}>{label}</button>)}
          </div>
          {workspace !== 'index' && <>
            <div className="mode-switcher">
              {MODES.map(([value, label]) => <button key={value} className={mode === value ? 'is-active' : ''} onClick={() => setMode(value)} aria-pressed={mode === value}>{label}</button>)}
            </div>
            <button className="save-button" onClick={workspace === 'questions' ? flushQuestions : flushCurrent} disabled={(workspace === 'questions' ? questionStatus : noteStatus) === 'loading' || (workspace === 'questions' ? questionStatus : noteStatus) === 'saving'}>保存 <kbd>⌘/Ctrl S</kbd></button>
          </>}
        </div>
        {workspace === 'index' && <div className="index-workspace">
          {noteIndex.status === 'loading' && <div className="panel-state">正在整理灵修索引…</div>}
          {noteIndex.status === 'error' && <div className="panel-state error-state">{noteIndex.error}<button onClick={() => setWorkspace('comments')}>返回笔记</button></div>}
          {noteIndex.status === 'ready' && (noteIndex.entries.length ? <Box className="index-list">
            <Paper className="index-summary" elevation={0}><Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}><Box><Typography className="index-summary-kicker">{indexScope === 'book' ? '全卷记录' : '本章记录'}</Typography><Typography className="index-summary-title">{activeBook.name}{indexScope === 'book' ? '·灵修笔记索引' : `${selection.chapter}章`}</Typography></Box><Chip className="index-total-chip" label={`${noteIndex.entries.length} 则记录`} size="small" /></Stack><Typography className="index-summary-copy">点击任意卡片，回到经文与对应的灵修笔记。</Typography></Paper>
            {indexedChapterGroups.map((group) => <section className="index-chapter-group" key={group.chapter}><div className="index-chapter-heading"><span>{activeBook.name}{group.chapter}章</span><i>{group.entries.length}</i></div><Stack spacing={1}>{group.entries.map((entry) => <Paper className={`index-entry index-entry-${entry.scope}`} elevation={0} key={`${entry.scope}:${entry.chapter}:${entry.verse ?? ''}`}><ButtonBase className="index-entry-action" onClick={() => openIndexedNote(entry)}><Stack className="index-entry-content" spacing={.7}><Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}><Chip className="index-reference-chip" label={entry.verse ? `${activeBook.name}${entry.chapter}:${entry.verse}` : '全章默想'} size="small" /><Typography component="strong" className="index-entry-title">{entry.title}</Typography></Stack>{entry.scripture && <Typography className="index-scripture">“{entry.scripture}”</Typography>}{entry.excerpt && <Typography className="index-entry-excerpt">{entry.excerpt}</Typography>}</Stack><span className="index-entry-arrow" aria-hidden="true">→</span></ButtonBase></Paper>)}</Stack></section>)}
          </Box> : <div className="empty-note"><span>⌁</span><strong>这里还没有灵修笔记</strong><p>{indexScope === 'book' ? `从 ${activeBook.name} 的一章或一节开始记录，它会自动出现在这里。` : '这章还没有笔记。可切换到“笔记”写下第一则默想。'}</p><button onClick={() => setWorkspace('comments')}>写笔记</button></div>)}
        </div>}
        {workspace === 'questions' && <>
          {questionStatus === 'error' && <div className="note-error" role="alert">{questions.error} <button onClick={flushQuestions}>重试保存</button></div>}
          <div className={`note-workspace mode-${mode}`}>
            {(mode === 'edit' || mode === 'split') && <label className="editor-pane"><span className="sr-only">编辑 {activeBook.name}{selection.chapter}章的讨论问题</span><textarea value={questionDraft} onChange={updateQuestionDraft} disabled={questionStatus === 'loading'} placeholder={`为 ${activeBook.name}${selection.chapter}章准备小组讨论问题…\n\n例如：\n1. 哪一句经文最触动你？为什么？\n2. 这章如何改变你本周的生活？`} spellCheck="true" /></label>}
            {(mode === 'read' || mode === 'split') && <article className="markdown-pane" aria-label="讨论问题预览">{questionStatus === 'loading' ? <div className="panel-state">正在读取问题…</div> : questionDraft.trim() ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{questionDraft}</ReactMarkdown> : <div className="empty-note"><span>?</span><strong>为同行者预备空间</strong><p>把观察、问题与实践应用写在这里；它只属于这一章。</p>{mode === 'read' && <button onClick={() => setMode('edit')}>添加问题</button>}</div>}</article>}
          </div>
        </>}
        {workspace === 'comments' && <>
          {noteStatus === 'error' && <div className="note-error" role="alert">{note.error} <button onClick={flushCurrent}>重试保存</button></div>}
          <div ref={noteWorkspaceRef} className={`note-workspace mode-${mode}`}>
            {(mode === 'edit' || mode === 'split') && <label className="editor-pane"><span className="sr-only">编辑 {reference} 的 Markdown 笔记</span><textarea value={draft} onChange={updateDraft} disabled={noteStatus === 'loading'} placeholder={`在这里写下 ${reference} 的灵修感动…\n\n支持 Markdown：清单、引用、粗体。标题请填写在上方。`} spellCheck="true" /></label>}
            {(mode === 'read' || mode === 'split') && <article className="markdown-pane" aria-label="Markdown 预览">{noteStatus === 'loading' ? <div className="panel-state">正在读取笔记…</div> : noteContent.trim() ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{noteContent}</ReactMarkdown> : <div className="empty-note"><span>✦</span><strong>给此处留下一盏灯</strong><p>记录今天从经文中领受的一句话、一个问题，或一段祷告。</p>{mode === 'read' && <button onClick={() => setMode('edit')}>开始记录</button>}</div>}</article>}
          </div>
          {showBackToTop && <button type="button" className="back-to-top" onClick={scrollNoteToTop} aria-label="回到灵修笔记顶部" title="回到顶部">↑</button>}
        </>}
      </aside>
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
