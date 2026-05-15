import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ClipboardCopy,
  Eye,
  EyeOff,
  FileJson,
  Headphones,
  Languages,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  RefreshCcw,
  Sparkles,
  Square,
  Trash2,
  Upload,
  Volume2,
  Wand2,
  X
} from 'lucide-react';
import { deleteQuiz, fetchQuiz, fetchQuizzes, importQuiz, ttsUrl } from './services/api';
import { useTts, isTtsCancelled } from '../../shared/useTts';
import './styles.css';

const DRAFT_KEY = 'translator-drafts-v1';
const PROGRESS_KEY = 'translator-progress-v1';

function cx(...args) {
  return args.filter(Boolean).join(' ');
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
}

function buildPrompt({ level, topic, count, quizId }) {
  const safeTopic = topic.trim() || 'mixed everyday topics';
  const safeCount = Math.max(1, Math.min(200, Number(count) || 50));
  const safeId = (quizId || `quiz-custom-${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '-');
  return `You are helping me build a Chinese → English + Spanish translation practice deck.
Write exactly ${safeCount} original ${level} level sentences about ${safeTopic}.

Rules:
- Each item is a single sentence in everyday, natural language.
- Translations must be accurate, idiomatic, and at the same ${level} register.
- Avoid duplicates with previous decks.
- Punctuation in Chinese uses full-width marks (,。?!).

Return ONLY valid JSON with this exact shape — no markdown, no commentary:

{
  "id": "${safeId}",
  "title": "Custom ${level} Set",
  "level": "${level}",
  "subtitle": "${safeTopic}",
  "sentences": [
    { "zh": "...", "en": "...", "es": "..." }
  ]
}`;
}

export default function App() {
  const [quizzes, setQuizzes] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [activeQuizId, setActiveQuizId] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drafts, setDrafts] = useState(() => loadJson(DRAFT_KEY, {}));
  const [progress, setProgress] = useState(() => loadJson(PROGRESS_KEY, {}));
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [insightsCollapsed, setInsightsCollapsed] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importBusy, setImportBusy] = useState(false);
  const [importOverwrite, setImportOverwrite] = useState(false);

  const [promptLevel, setPromptLevel] = useState('B1');
  const [promptTopic, setPromptTopic] = useState('daily life and small talk');
  const [promptCount, setPromptCount] = useState(50);
  const [promptId, setPromptId] = useState('quiz-custom');

  const toastTimer = useRef(null);
  const fileInputRef = useRef(null);
  const playModeRef = useRef('');
  const internalNavRef = useRef(false);
  const [playMode, setPlayMode] = useState('');
  const [spokenLang, setSpokenLang] = useState('');
  const { play: playTts, stop: stopTts } = useTts();

  const showToast = useCallback((message) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 1800);
  }, []);

  const stopPlayback = useCallback(() => {
    stopTts();
    playModeRef.current = '';
    setPlayMode('');
    setSpokenLang('');
  }, [stopTts]);

  useEffect(
    () => () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    },
    []
  );

  const playQueue = useCallback(
    (items, mode) => {
      if (!items || !items.length) return;
      if (playModeRef.current === mode) {
        stopPlayback();
        return;
      }
      stopPlayback();
      playModeRef.current = mode;
      setPlayMode(mode);

      (async () => {
        for (let i = 0; i < items.length; i++) {
          if (playModeRef.current !== mode) return;
          const item = items[i];
          if (item.index !== undefined && item.index !== null) {
            internalNavRef.current = true;
            setCurrentIndex(item.index);
          }
          setSpokenLang(item.lang);
          try {
            await playTts({
              key: `${mode}:${i}`,
              waitForEnd: true,
              getUrl: async () => {
                const response = await fetch(ttsUrl(item.text, item.lang));
                if (!response.ok) {
                  let detail = '';
                  try {
                    const body = await response.json();
                    detail = body?.error || '';
                  } catch {
                    /* ignore */
                  }
                  throw new Error(detail || `TTS HTTP ${response.status}`);
                }
                const blob = await response.blob();
                return { url: URL.createObjectURL(blob), revokeOnEnd: true };
              },
            });
          } catch (err) {
            if (isTtsCancelled(err)) return;
            if (playModeRef.current === mode) {
              showToast(err?.message || 'Read-aloud failed.');
              stopPlayback();
            }
            return;
          }
        }
        if (playModeRef.current === mode) {
          playModeRef.current = '';
          setPlayMode('');
          setSpokenLang('');
        }
      })();
    },
    [playTts, stopPlayback, showToast]
  );

  function speakCurrent(lang) {
    if (!current) return;
    const text = current[lang];
    if (!text) return;
    playQueue([{ text, lang }], lang);
  }

  function listenAll(lang) {
    if (!sentences.length) return;
    const items = sentences
      .map((s, index) => ({ text: s[lang], lang, index }))
      .filter((it) => it.text);
    if (!items.length) return;
    setRevealed(true);
    playQueue(items, lang === 'en' ? 'all-en' : 'all-es');
  }

  function listenBoth() {
    if (!current) return;
    const items = [];
    if (current.en) items.push({ text: current.en, lang: 'en' });
    if (current.es) items.push({ text: current.es, lang: 'es' });
    if (!items.length) return;
    setRevealed(true);
    playQueue(items, 'both');
  }

  const sentences = useMemo(() => quiz?.sentences || [], [quiz]);
  const total = sentences.length;
  const current = sentences[currentIndex] || null;
  const draftKey = current ? `${activeQuizId}#${currentIndex}` : '';
  const draftValue = drafts[draftKey] || '';

  const reloadQuizzes = useCallback(async () => {
    const payload = await fetchQuizzes();
    setQuizzes(payload.quizzes || []);
    return payload.quizzes || [];
  }, []);

  const openQuiz = useCallback(
    async (quizId, { force = false } = {}) => {
      if (!quizId || (!force && quizId === activeQuizId)) return;
      setLoadingQuiz(true);
      setError('');
      try {
        setActiveQuizId(quizId);
        const payload = await fetchQuiz(quizId);
        setQuiz(payload);
        const savedIndex = progress[quizId];
        const safeIndex =
          Number.isFinite(savedIndex) && savedIndex < (payload.sentences?.length || 0)
            ? Math.max(0, savedIndex)
            : 0;
        setCurrentIndex(safeIndex);
        setRevealed(false);
      } catch (err) {
        setError(err.message || 'Could not load this set.');
      } finally {
        setLoadingQuiz(false);
      }
    },
    [activeQuizId, progress]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const list = await reloadQuizzes();
        if (cancelled) return;
        if (list.length) await openQuiz(list[0].id);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load quizzes.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activeQuizId) return;
    setProgress((prev) => {
      const next = { ...prev, [activeQuizId]: currentIndex };
      saveJson(PROGRESS_KEY, next);
      return next;
    });
    if (internalNavRef.current) {
      internalNavRef.current = false;
      return;
    }
    setRevealed(false);
    stopPlayback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuizId, currentIndex]);

  function updateDraft(text) {
    if (!current) return;
    setDrafts((prev) => {
      const next = { ...prev, [draftKey]: text };
      saveJson(DRAFT_KEY, next);
      return next;
    });
  }

  function clearDraft() {
    if (!current) return;
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[draftKey];
      saveJson(DRAFT_KEY, next);
      return next;
    });
  }

  function goPrevious() { setCurrentIndex((i) => Math.max(0, i - 1)); }
  function goNext() { setCurrentIndex((i) => Math.min(total - 1, i + 1)); }
  function jumpTo(index) { setCurrentIndex(index); }

  function copyText(text, successMessage) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(
        () => showToast(successMessage),
        () => fallbackCopy(text, successMessage)
      );
    } else {
      fallbackCopy(text, successMessage);
    }
  }

  function fallbackCopy(text, successMessage) {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.left = '-9999px';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    document.body.removeChild(area);
    showToast(successMessage);
  }

  function generatedPrompt() {
    return buildPrompt({ level: promptLevel, topic: promptTopic, count: promptCount, quizId: promptId });
  }

  function copyPrompt() {
    copyText(generatedPrompt(), 'Prompt copied. Paste it to your AI of choice.');
  }

  async function handleImport() {
    if (!importText.trim()) { showToast('Paste JSON first.'); return; }
    let parsed;
    try {
      parsed = JSON.parse(importText);
    } catch (err) {
      showToast(`Invalid JSON: ${err.message}`);
      return;
    }
    setImportBusy(true);
    try {
      const response = await importQuiz(parsed, { overwrite: importOverwrite });
      await reloadQuizzes();
      showToast(`Imported ${response.quiz.id}.`);
      setImportOpen(false);
      setImportText('');
      setImportOverwrite(false);
      openQuiz(response.quiz.id, { force: true });
    } catch (err) {
      showToast(err.message || 'Import failed.');
    } finally {
      setImportBusy(false);
    }
  }

  function pickFile() { fileInputRef.current?.click(); }

  function onFileChosen(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImportText(String(reader.result || ''));
      setImportOpen(true);
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  async function handleDelete(quizId) {
    if (!quizId) return;
    const target = quizzes.find((q) => q.id === quizId);
    const label = target ? `${target.title} (${target.count} sentences)` : quizId;
    if (!window.confirm(`Delete ${label}?\n\nThis permanently removes the quiz file.`)) return;
    try {
      stopPlayback();
      await deleteQuiz(quizId);
      const list = await reloadQuizzes();
      showToast(`${quizId} removed.`);
      if (quizId === activeQuizId) {
        if (list[0]) {
          openQuiz(list[0].id, { force: true });
        } else {
          setQuiz(null);
          setActiveQuizId('');
        }
      }
    } catch (err) {
      showToast(err.message || 'Could not delete.');
    }
  }

  return (
    <div className={cx('translator-app', sidebarCollapsed && 'sidebar-is-collapsed')}>
      <aside className={cx('tr-sidebar', sidebarCollapsed && 'is-collapsed')}>
        <div className="tr-sidebar-top">
          {!sidebarCollapsed && (
            <div className="tr-brand-block">
              <div className="tr-brand-mark">
                <Languages size={26} />
              </div>
              <div>
                <p className="tr-eyebrow">Translator Trio</p>
                <h1>中 · EN · ES</h1>
              </div>
            </div>
          )}
          <button
            className="tr-sidebar-toggle"
            type="button"
            onClick={() => setSidebarCollapsed((v) => !v)}
            title={sidebarCollapsed ? 'Expand' : 'Collapse'}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
          </button>
        </div>

        <div className="tr-quiz-nav">
          {quizzes.map((item, index) => (
            <button
              key={item.id}
              className={cx('tr-quiz-tab', item.id === activeQuizId && 'is-active')}
              title={`${item.title} · ${item.level || 'set'}`}
              type="button"
              onClick={() => openQuiz(item.id)}
            >
              {sidebarCollapsed ? (
                <span className="tr-quiz-tab-number">{index + 1}</span>
              ) : (
                <>
                  <span className="tr-quiz-tab-title-row">
                    <span className="tr-quiz-tab-title">{item.title}</span>
                    {item.level && <span className="tr-level-chip">{item.level}</span>}
                  </span>
                  <span className="tr-quiz-tab-meta">
                    {item.count} sentences{item.subtitle ? ` · ${item.subtitle}` : ''}
                  </span>
                </>
              )}
            </button>
          ))}
        </div>

        {!sidebarCollapsed && (
          <div className="tr-sidebar-actions">
            <button className="tr-ghost-button" type="button" onClick={() => setImportOpen(true)}>
              <Upload size={16} />
              <span>Import set</span>
            </button>
            <button className="tr-ghost-button" type="button" onClick={pickFile}>
              <FileJson size={16} />
              <span>From file</span>
            </button>
            <input ref={fileInputRef} type="file" accept="application/json,.json" hidden onChange={onFileChosen} />
          </div>
        )}
      </aside>

      <main className="tr-main-stage">
        {loading ? (
          <div className="tr-loading-state">
            <Loader2 className="tr-spin" size={30} />
            <span>Loading translation sets…</span>
          </div>
        ) : error ? (
          <div className="tr-empty-state">
            <X size={34} />
            <h2>{error}</h2>
          </div>
        ) : quiz ? (
          <div className={cx('tr-workspace', loadingQuiz && 'is-loading', insightsCollapsed && 'insights-is-collapsed')}>
            <section className="tr-exercise-panel">
              <header className="tr-top-strip">
                <div className="tr-quiz-identity">
                  <span className="tr-mini-meta">{quiz.level || 'Custom'}</span>
                  <span className="tr-dot-sep" aria-hidden>·</span>
                  <strong className="tr-top-title">{quiz.title}</strong>
                  {quiz.subtitle && (
                    <>
                      <span className="tr-dot-sep" aria-hidden>·</span>
                      <span className="tr-top-subtitle">{quiz.subtitle}</span>
                    </>
                  )}
                  <span className="tr-dot-sep" aria-hidden>·</span>
                  <span className="tr-mini-meta soft">{total} sentences</span>
                </div>
                <div className="tr-top-actions">
                  <button
                    className={cx('tr-tool-button', playMode === 'all-en' && 'is-on')}
                    type="button"
                    onClick={() => listenAll('en')}
                    disabled={!total}
                    title="Play every English sentence in order"
                  >
                    {playMode === 'all-en' ? <Square size={16} /> : <Headphones size={18} />}
                    <span>Listen all · EN</span>
                  </button>
                  <button
                    className={cx('tr-tool-button', playMode === 'all-es' && 'is-on')}
                    type="button"
                    onClick={() => listenAll('es')}
                    disabled={!total}
                    title="Play every Spanish sentence in order"
                  >
                    {playMode === 'all-es' ? <Square size={16} /> : <Headphones size={18} />}
                    <span>Listen all · ES</span>
                  </button>
                  <button
                    className="tr-tool-button danger"
                    type="button"
                    onClick={() => handleDelete(activeQuizId)}
                    title="Delete this entire quiz"
                  >
                    <Trash2 size={18} />
                    <span>Delete quiz</span>
                  </button>
                </div>
              </header>

              <div className="tr-progress-card">
                <div className="tr-progress-head">
                  <span className="tr-progress-label">Sentence {currentIndex + 1} of {total}</span>
                  <span className="tr-score-pill">
                    {total ? Math.round(((currentIndex + 1) / total) * 100) : 0}%
                  </span>
                </div>
                <div className="tr-progress-track">
                  <div
                    className="tr-progress-fill"
                    style={{ width: `${total ? ((currentIndex + 1) / total) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {current ? (
                <article className="tr-question-card">
                  <div className="tr-zh-hero">
                    <div className="tr-zh-eyebrow">
                      <Sparkles size={14} />
                      <span>Translate the Chinese</span>
                      <button
                        className={cx('tr-hero-speak', spokenLang === 'zh' && 'is-on')}
                        type="button"
                        title="Read aloud (Edge TTS)"
                        onClick={() => speakCurrent('zh')}
                      >
                        {spokenLang === 'zh' ? <Square size={13} /> : <Volume2 size={13} />}
                      </button>
                    </div>
                    <p className="tr-zh-sentence">{current.zh}</p>
                  </div>

                  <label className="tr-draft-label" htmlFor="tr-draft-input">
                    Your translation (English or Spanish — both welcome)
                  </label>
                  <textarea
                    id="tr-draft-input"
                    className="tr-draft-input"
                    value={draftValue}
                    onChange={(e) => updateDraft(e.target.value)}
                    placeholder="Type freely. Nothing here is graded — this space is for active thinking."
                    rows={5}
                    spellCheck={false}
                  />

                  <div className="tr-inline-actions">
                    <button className="tr-primary-button" type="button" onClick={() => setRevealed((v) => !v)}>
                      {revealed ? <EyeOff size={18} /> : <Eye size={18} />}
                      <span>{revealed ? 'Hide translation' : 'Show translation'}</span>
                    </button>
                    <button className="tr-secondary-button" type="button" onClick={clearDraft} disabled={!draftValue}>
                      <RefreshCcw size={18} />
                      <span>Clear draft</span>
                    </button>
                    <button
                      className={cx('tr-secondary-button', playMode === 'both' && 'is-on')}
                      type="button"
                      onClick={listenBoth}
                      title="Read English then Spanish for this sentence"
                    >
                      {playMode === 'both' ? <Square size={18} /> : <Headphones size={18} />}
                      <span>{playMode === 'both' ? 'Stop' : 'Listen'}</span>
                    </button>
                  </div>

                  {revealed && (
                    <div className="tr-reveal-grid">
                      <div className="tr-reveal-card en">
                        <div className="tr-reveal-title">
                          <span className="tr-flag">EN</span>
                          <span>English</span>
                          <div className="tr-reveal-tools">
                            <button
                              className={cx('tr-icon-button', spokenLang === 'en' && 'is-on')}
                              type="button"
                              onClick={() => speakCurrent('en')}
                              title="Read aloud (Edge TTS)"
                            >
                              {spokenLang === 'en' ? <Square size={14} /> : <Volume2 size={15} />}
                            </button>
                            <button
                              className="tr-icon-button"
                              type="button"
                              onClick={() => copyText(current.en, 'English copied.')}
                              title="Copy English"
                            >
                              <ClipboardCopy size={15} />
                            </button>
                          </div>
                        </div>
                        <p>{current.en}</p>
                      </div>
                      <div className="tr-reveal-card es">
                        <div className="tr-reveal-title">
                          <span className="tr-flag">ES</span>
                          <span>Español</span>
                          <div className="tr-reveal-tools">
                            <button
                              className={cx('tr-icon-button', spokenLang === 'es' && 'is-on')}
                              type="button"
                              onClick={() => speakCurrent('es')}
                              title="Read aloud (Edge TTS)"
                            >
                              {spokenLang === 'es' ? <Square size={14} /> : <Volume2 size={15} />}
                            </button>
                            <button
                              className="tr-icon-button"
                              type="button"
                              onClick={() => copyText(current.es, 'Spanish copied.')}
                              title="Copy Spanish"
                            >
                              <ClipboardCopy size={15} />
                            </button>
                          </div>
                        </div>
                        <p>{current.es}</p>
                      </div>
                    </div>
                  )}

                  <div className="tr-sticky-nav">
                    <button className="tr-secondary-button" disabled={currentIndex <= 0} type="button" onClick={goPrevious}>
                      <ChevronLeft size={18} />
                      <span>Previous</span>
                    </button>
                    <span className="tr-nav-counter">#{currentIndex + 1} / {total}</span>
                    <button className="tr-primary-button" disabled={currentIndex >= total - 1} type="button" onClick={goNext}>
                      <span>Next</span>
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </article>
              ) : (
                <div className="tr-empty-state">
                  <BookOpen size={32} />
                  <h2>This set is empty.</h2>
                </div>
              )}
            </section>

            <aside className={cx('tr-insight-panel', insightsCollapsed && 'is-collapsed')}>
              <button
                className="tr-insight-toggle"
                type="button"
                onClick={() => setInsightsCollapsed((v) => !v)}
                title={insightsCollapsed ? 'Open prompt panel' : 'Close panel'}
              >
                {insightsCollapsed ? <PanelRightOpen size={19} /> : <PanelRightClose size={19} />}
              </button>

              {!insightsCollapsed && (
                <>
                  <section className="tr-insight-card tr-nav-card">
                    <div className="tr-panel-title">
                      <BookOpen size={18} />
                      <h3>Questions</h3>
                      <span className="tr-nav-counter-chip">{currentIndex + 1} / {total}</span>
                    </div>
                    <div className="tr-question-dots">
                      {sentences.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          className={cx(
                            'tr-question-dot',
                            index === currentIndex && 'is-current',
                            drafts[`${activeQuizId}#${index}`] && 'has-draft'
                          )}
                          onClick={() => jumpTo(index)}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="tr-insight-card tr-prompt-card">
                    <div className="tr-panel-title">
                      <Wand2 size={20} />
                      <h3>Prompt generator</h3>
                    </div>
                    <p className="tr-panel-blurb">
                      Build a ready-to-send prompt for any AI. Paste the AI's JSON
                      response into <strong>Import set</strong> and it slots right in.
                    </p>

                    <div className="tr-prompt-grid">
                      <label>
                        <span>Level</span>
                        <div className="tr-seg">
                          {['A2', 'B1', 'B2'].map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              className={cx('tr-seg-btn', promptLevel === lvl && 'is-on')}
                              onClick={() => setPromptLevel(lvl)}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </label>
                      <label>
                        <span>Count</span>
                        <input
                          type="number"
                          min={1}
                          max={200}
                          value={promptCount}
                          onChange={(e) => setPromptCount(e.target.value)}
                        />
                      </label>
                      <label className="full">
                        <span>Topic / vocabulary focus</span>
                        <input
                          value={promptTopic}
                          onChange={(e) => setPromptTopic(e.target.value)}
                          placeholder="e.g. travel, business, classroom verbs"
                        />
                      </label>
                      <label className="full">
                        <span>Quiz id (filename)</span>
                        <input
                          value={promptId}
                          onChange={(e) => setPromptId(e.target.value)}
                          placeholder="quiz-custom"
                        />
                      </label>
                    </div>

                    <textarea
                      className="tr-prompt-preview"
                      value={generatedPrompt()}
                      readOnly
                      spellCheck={false}
                    />

                    <div className="tr-prompt-actions">
                      <button className="tr-primary-button" type="button" onClick={copyPrompt}>
                        <ClipboardCopy size={18} />
                        <span>Copy prompt</span>
                      </button>
                      <button className="tr-secondary-button" type="button" onClick={() => setImportOpen(true)}>
                        <Upload size={18} />
                        <span>Import JSON</span>
                      </button>
                    </div>
                  </section>
                </>
              )}
            </aside>
          </div>
        ) : (
          <div className="tr-empty-state">
            <BookOpen size={32} />
            <h2>No translation sets yet.</h2>
            <p>Use the prompt generator → ask an AI → import the JSON.</p>
            <button className="tr-primary-button" type="button" onClick={() => setImportOpen(true)}>
              <Upload size={18} />
              <span>Import a set</span>
            </button>
          </div>
        )}
      </main>

      {importOpen && (
        <div className="tr-modal-backdrop" onClick={() => !importBusy && setImportOpen(false)}>
          <div className="tr-confirm-modal tr-import-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tr-modal-icon">
              <Upload size={22} />
            </div>
            <h2>Import translation set</h2>
            <p>
              Paste a JSON object that matches the prompt schema (id, title, level,
              sentences[]). Each sentence needs <code>zh</code>, <code>en</code>, and{' '}
              <code>es</code>.
            </p>
            <textarea
              className="tr-import-area"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='{ "id": "quiz-custom-1", "title": "...", "level": "B1", "sentences": [ { "zh": "...", "en": "...", "es": "..." } ] }'
              spellCheck={false}
            />
            <label className="tr-overwrite-line">
              <input
                type="checkbox"
                checked={importOverwrite}
                onChange={(e) => setImportOverwrite(e.target.checked)}
              />
              Overwrite if a quiz with the same id already exists
            </label>
            <div className="tr-modal-actions">
              <button
                className="tr-secondary-button"
                type="button"
                onClick={() => { setImportOpen(false); setImportText(''); setImportOverwrite(false); }}
                disabled={importBusy}
              >
                Cancel
              </button>
              <button
                className="tr-primary-button"
                type="button"
                onClick={handleImport}
                disabled={importBusy}
              >
                {importBusy ? <Loader2 className="tr-spin" size={18} /> : <Upload size={18} />}
                <span>Import</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="tr-toast">{toast}</div>}
    </div>
  );
}
