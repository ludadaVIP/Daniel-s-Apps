import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  Square,
  Volume2,
} from "lucide-react";

import { useTts, isTtsCancelled } from "./useTts.js";
import {
  fetchConfig,
  fetchChapter,
  requestTtsAudio,
} from "./bibleLangApi.js";

/**
 * Shared component that powers every Bible-and-<language> sub-app.
 *
 * Each per-language app folder (bible_and_eng, bible_and_esp, bible_and_fr,
 * bible_and_ge) just renders <BibleLangApp lang="en" />. The component
 * pulls its book list, voices, copy, and verse text from the unified
 * /api/bible-lang backend, keyed by `lang`.
 *
 * Layout: sidebar (book → chapter, collapsible) + content (chapter title,
 * read-whole-chapter button, per-verse two-column rows).
 */

const COMING_SOON_COPY = {
  en: { title: "Coming soon", body: "English content is being prepared." },
  es: { title: "Próximamente", body: "Estamos preparando el contenido en español." },
  fr: { title: "Bientôt disponible", body: "Le contenu en français est en préparation." },
  de: { title: "Demnächst verfügbar", body: "Deutsche Inhalte werden vorbereitet." },
};

// Per-language UI strings — keeps every visible label in the target
// language family. The English app uses Chinese for an English-speaking
// Chinese audience; the Spanish app uses English for an English-speaking
// audience learning Spanish; etc.
const UI_STRINGS = {
  en: {
    vocabHeading: "重点词汇",
    grammarHeading: "语法 / 句型",
    expressionHeading: "表达 / 背景",
    emptyNotes: "（暂未填充注释，稍后再回来。）",
    readChapter: "Read this chapter",
    stopChapter: "Stop chapter",
    pickBook: "Pick a book to begin",
    loading: "Loading verses…",
    verseLabel: "Verse",
    chapterAbbr: "ch",
    noChapterContent: (book, ch) =>
      `选了 ${book} ${ch} —— 但本章暂无内容。可能这章的注释还没有写。`,
  },
  es: {
    vocabHeading: "Key vocabulary",
    grammarHeading: "Grammar / sentence pattern",
    expressionHeading: "Expression / background",
    emptyNotes: "(Notes for this verse are not filled in yet.)",
    readChapter: "Read this chapter",
    stopChapter: "Stop chapter",
    pickBook: "Pick a book to begin",
    loading: "Loading verses…",
    verseLabel: "Verse",
    chapterAbbr: "ch",
    noChapterContent: (book, ch) =>
      `Selected ${book} ${ch} — but this chapter has no content yet.`,
  },
  fr: {
    vocabHeading: "Vocabulaire clé",
    grammarHeading: "Grammaire / structure",
    expressionHeading: "Expression / contexte",
    emptyNotes: "(Notes pour ce verset à venir.)",
    readChapter: "Lire ce chapitre",
    stopChapter: "Arrêter",
    pickBook: "Choisis un livre pour commencer",
    loading: "Chargement…",
    verseLabel: "Verset",
    chapterAbbr: "ch",
    noChapterContent: (book, ch) =>
      `${book} ${ch} sélectionné — ce chapitre n'a pas encore de contenu.`,
  },
  de: {
    vocabHeading: "Wichtige Vokabeln",
    grammarHeading: "Grammatik / Satzbau",
    expressionHeading: "Ausdruck / Hintergrund",
    emptyNotes: "(Notizen zu diesem Vers folgen noch.)",
    readChapter: "Kapitel vorlesen",
    stopChapter: "Stopp",
    pickBook: "Wähle ein Buch",
    loading: "Lädt…",
    verseLabel: "Vers",
    chapterAbbr: "Kap",
    noChapterContent: (book, ch) =>
      `${book} ${ch} ausgewählt — dieses Kapitel hat noch keinen Inhalt.`,
  },
};

export default function BibleLangApp({ lang = "en" }) {
  const [config, setConfig] = useState(null);
  const [configError, setConfigError] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [openBook, setOpenBook] = useState("");
  const [currentBook, setCurrentBook] = useState("");
  const [currentChapter, setCurrentChapter] = useState(0);
  const [chapterData, setChapterData] = useState(null);
  const [chapterLoading, setChapterLoading] = useState(false);
  const [chapterError, setChapterError] = useState("");

  const tts = useTts();
  const chapterPlaybackRef = useRef(null);

  // Per-verse DOM refs so we can scroll the playing verse into view as
  // chapter playback advances. Keyed by verse.verse number.
  const verseRefs = useRef(new Map());
  const setVerseRef = useCallback((verseNum, node) => {
    const map = verseRefs.current;
    if (node) map.set(verseNum, node);
    else map.delete(verseNum);
  }, []);

  // 1) Bootstrap: load this language's config (book list, voices, copy).
  useEffect(() => {
    let cancelled = false;
    setConfig(null);
    setConfigError("");
    (async () => {
      try {
        const payload = await fetchConfig(lang);
        if (cancelled) return;
        setConfig(payload);
        // Auto-open the first book that has *study notes seeded* (so the
        // right pane shows real content on first visit). If none have
        // notes yet, fall back to the first book with verse text.
        const books = payload.books || [];
        const firstWithNotes = books.find(
          (b) => b.hasText && b.chapters > 0 && b.hasNotes
        );
        const fallback = books.find((b) => b.hasText && b.chapters > 0);
        const auto = firstWithNotes || fallback;
        if (auto) {
          setOpenBook(auto.book);
          setCurrentBook(auto.book);
          // Pick the first seeded chapter when available, else chapter 1.
          const firstCh = auto.seededChapters?.[0] || 1;
          setCurrentChapter(firstCh);
        }
      } catch (err) {
        if (!cancelled) setConfigError(err.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  // 2) When (book, chapter) changes, fetch its verses + notes.
  useEffect(() => {
    if (!config || !currentBook || !currentChapter) {
      setChapterData(null);
      return;
    }
    let cancelled = false;
    setChapterLoading(true);
    setChapterError("");
    (async () => {
      try {
        const payload = await fetchChapter({
          lang,
          book: currentBook,
          chapter: currentChapter,
        });
        if (!cancelled) setChapterData(payload);
      } catch (err) {
        if (!cancelled) setChapterError(err.message);
      } finally {
        if (!cancelled) setChapterLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lang, config, currentBook, currentChapter]);

  // Switching chapters cancels any chapter-wide playback in progress.
  useEffect(() => {
    chapterPlaybackRef.current = null;
  }, [currentBook, currentChapter, lang]);

  const verses = chapterData?.verses || [];
  const chapterReady = !chapterLoading && !chapterError && verses.length > 0;
  const isPlayingChapter = tts.speakingKey.startsWith("chapter:");
  const ui = UI_STRINGS[lang] || UI_STRINGS.en;

  // Parse the currently-playing verse number out of speakingKey so we can
  // both (a) scroll it into view and (b) render a progress bar.
  // speakingKey shape: "chapter:<book>:<chapter>:<verseNum>"
  //               or:  "verse:<book>:<chapter>:<verseNum>"
  const playingVerseNum = useMemo(() => {
    const key = tts.speakingKey || tts.loadingKey;
    if (!key) return 0;
    const parts = key.split(":");
    if (parts.length !== 4) return 0;
    const num = parseInt(parts[3], 10);
    return Number.isFinite(num) ? num : 0;
  }, [tts.speakingKey, tts.loadingKey]);

  // Auto-scroll the currently-playing verse into view during chapter
  // playback. Uses a small offset so the sticky header + progress bar
  // don't cover the verse.
  useEffect(() => {
    if (!isPlayingChapter || !playingVerseNum) return;
    const node = verseRefs.current.get(playingVerseNum);
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [isPlayingChapter, playingVerseNum]);

  // Progress: how many verses are done in the current chapter playback.
  const chapterProgress = useMemo(() => {
    if (!isPlayingChapter || !verses.length) {
      return { current: 0, total: verses.length, percent: 0 };
    }
    const idx = verses.findIndex((v) => v.verse === playingVerseNum);
    const current = idx >= 0 ? idx + 1 : 0;
    return {
      current,
      total: verses.length,
      percent: verses.length ? Math.round((current / verses.length) * 100) : 0,
    };
  }, [isPlayingChapter, verses, playingVerseNum]);

  // -------------------------------------------------- TTS handlers ----

  const playVerse = useCallback(
    async (verse) => {
      if (!verse?.text) return;
      const key = `verse:${currentBook}:${currentChapter}:${verse.verse}`;
      try {
        await tts.play({
          key,
          waitForEnd: false,
          getUrl: async () => {
            const result = await requestTtsAudio({ lang, text: verse.text });
            return { url: result.audio_url };
          },
        });
      } catch (err) {
        if (!isTtsCancelled(err)) {
          // useTts already surfaces the message in `tts.error`.
        }
      }
    },
    [tts, lang, currentBook, currentChapter]
  );

  const playChapter = useCallback(async () => {
    if (!verses.length) return;
    if (isPlayingChapter) {
      tts.stop();
      chapterPlaybackRef.current = null;
      return;
    }
    const sessionToken = Symbol(`chapter:${currentBook}:${currentChapter}`);
    chapterPlaybackRef.current = sessionToken;
    try {
      for (let i = 0; i < verses.length; i++) {
        if (chapterPlaybackRef.current !== sessionToken) break;
        const verse = verses[i];
        if (!verse.text) continue;
        const key = `chapter:${currentBook}:${currentChapter}:${verse.verse}`;
        await tts.play({
          key,
          waitForEnd: true,
          getUrl: async () => {
            const result = await requestTtsAudio({ lang, text: verse.text });
            return { url: result.audio_url };
          },
        });
      }
    } catch (err) {
      if (!isTtsCancelled(err)) {
        /* error already surfaced */
      }
    } finally {
      if (chapterPlaybackRef.current === sessionToken) {
        chapterPlaybackRef.current = null;
      }
    }
  }, [verses, isPlayingChapter, tts, currentBook, currentChapter, lang]);

  // ----------------------------------------------------- Rendering ----

  const comingSoon = config && !config.ready;
  const copy = COMING_SOON_COPY[lang] || COMING_SOON_COPY.en;

  const shellClass = useMemo(
    () => `bae-shell${collapsed ? " sidebar-collapsed" : ""}`,
    [collapsed]
  );

  if (configError) {
    return (
      <div className="bae-shell">
        <aside className="bae-sidebar" />
        <main className="bae-content">
          <div className="bae-error">Failed to load configuration: {configError}</div>
        </main>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="bae-shell">
        <aside className="bae-sidebar" />
        <main className="bae-content">
          <div className="bae-loading">
            <Loader2 className="spin" size={18} /> Loading…
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={shellClass}>
      <aside className="bae-sidebar">
        <div className="bae-sidebar-header">
          <h2 className="bae-sidebar-title">{config.label}</h2>
          <button
            type="button"
            className="bae-sidebar-toggle"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((value) => !value)}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        {!collapsed ? (
          <div className="bae-sidebar-body">
            {(config.books || []).map((entry) => {
              const isOpen = openBook === entry.book;
              const isActiveBook = currentBook === entry.book;
              const hasContent = entry.hasText && entry.chapters > 0;
              const seeded = new Set(entry.seededChapters || []);
              return (
                <div key={entry.book} className="bae-book-section">
                  <button
                    type="button"
                    className={`bae-book-toggle${isActiveBook ? " active" : ""}${
                      !hasContent ? " unavailable" : ""
                    }${entry.hasNotes ? " has-notes" : ""}`}
                    onClick={() => {
                      if (!hasContent) return;
                      setOpenBook(isOpen ? "" : entry.book);
                    }}
                    disabled={!hasContent}
                    title={
                      hasContent
                        ? entry.hasNotes
                          ? `${entry.book} — study notes available`
                          : `${entry.book} — verse text only, no notes yet`
                        : `${entry.book} (no text yet)`
                    }
                  >
                    <span className="bae-book-toggle-name">
                      {entry.hasNotes ? (
                        <span className="bae-book-dot" aria-hidden="true">●</span>
                      ) : null}
                      <span>{entry.book}</span>
                      <span className="bae-book-toggle-meta">
                        {hasContent ? `${entry.chapters} ${ui.chapterAbbr}` : "—"}
                      </span>
                    </span>
                    {hasContent ? (
                      isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    ) : null}
                  </button>

                  {isOpen && hasContent ? (
                    <ul className="bae-chapter-list">
                      {Array.from({ length: entry.chapters }, (_, i) => i + 1).map((ch) => {
                        const isSeeded = seeded.has(ch);
                        return (
                          <li key={ch}>
                            <button
                              type="button"
                              className={`bae-chapter-button${
                                isActiveBook && currentChapter === ch ? " active" : ""
                              }${isSeeded ? " seeded" : ""}`}
                              onClick={() => {
                                setCurrentBook(entry.book);
                                setCurrentChapter(ch);
                              }}
                              title={
                                isSeeded
                                  ? `Chapter ${ch} — notes available`
                                  : `Chapter ${ch} — verse text only`
                              }
                            >
                              {ch}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              );
            })}

            {/* Coming-soon panel is now shown only in the main content area
                when there are no books to read — keeps the sidebar clean. */}
          </div>
        ) : null}
      </aside>

      <main className="bae-content">
        <header className="bae-content-header">
          <div className="bae-content-titleline">
            <h1 className="bae-content-title">
              {currentBook
                ? `${currentBook} ${currentChapter || ""}`.trim()
                : ui.pickBook}
            </h1>
            <span className="bae-content-sub">
              {config.label}
              <span className="bae-dot">·</span>
              {config.primaryVersionLabel} + {config.parallelVersionLabel}
              <span className="bae-dot">·</span>
              {config.subtitle}
            </span>
          </div>

          {chapterReady ? (
            <div className="bae-chapter-actions">
              {tts.error ? (
                <span className="bae-content-sub" style={{ color: "#a23a3a" }}>
                  {tts.error}
                </span>
              ) : null}
              <button
                type="button"
                className="bae-button"
                onClick={playChapter}
                disabled={!verses.length}
              >
                {isPlayingChapter ? (
                  <>
                    <Square size={16} />
                    <span>{ui.stopChapter}</span>
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    <span>{ui.readChapter}</span>
                  </>
                )}
              </button>
            </div>
          ) : null}
        </header>

        {isPlayingChapter && chapterProgress.total > 0 ? (
          <div className="bae-progress" role="status" aria-live="polite">
            <span className="bae-progress-label">
              ▶ {ui.verseLabel} {chapterProgress.current || "—"} / {chapterProgress.total}
            </span>
            <span className="bae-progress-track">
              <span
                className="bae-progress-fill"
                style={{ width: `${chapterProgress.percent}%` }}
              />
            </span>
            <span className="bae-progress-meta">{chapterProgress.percent}%</span>
          </div>
        ) : null}

        {/* Show Coming-soon ONLY when the language is genuinely empty — i.e.
            no books have content yet. Otherwise verses render normally. */}
        {comingSoon && !chapterReady && !chapterLoading && !currentBook ? (
          <div className="bae-coming-soon">
            <h2>{copy.title}</h2>
            <p>{copy.body}</p>
          </div>
        ) : null}

        {chapterError ? <div className="bae-error">{chapterError}</div> : null}

        {chapterLoading ? (
          <div className="bae-loading">
            <Loader2 className="spin" size={18} /> {ui.loading}
          </div>
        ) : null}

        {chapterReady ? (
          <section className="bae-verses">
            {verses.map((verse) => {
              const verseKey = `verse:${currentBook}:${currentChapter}:${verse.verse}`;
              const chapterKey = `chapter:${currentBook}:${currentChapter}:${verse.verse}`;
              const isPlaying =
                tts.speakingKey === verseKey || tts.speakingKey === chapterKey;
              const isLoading = tts.loadingKey === verseKey || tts.loadingKey === chapterKey;
              const isQueued =
                isPlayingChapter && !isPlaying && verse.verse > playingVerseNum;
              const rowClass = [
                "bae-verse-row",
                isPlaying ? "playing" : "",
                isQueued ? "queued" : "",
              ].filter(Boolean).join(" ");
              return (
                <article
                  key={verse.verse}
                  ref={(node) => setVerseRef(verse.verse, node)}
                  className={rowClass}
                >
                  <div className="bae-verse-text-pane">
                    <div className="bae-verse-header">
                      <span className="bae-verse-number">{verse.verse}</span>
                      <button
                        type="button"
                        className={`bae-verse-play${isPlaying ? " playing" : ""}`}
                        onClick={() =>
                          isPlaying ? tts.stop() : playVerse(verse)
                        }
                        title={isPlaying ? "Stop" : "Play this verse"}
                        disabled={!verse.text}
                      >
                        {isLoading ? (
                          <Loader2 className="spin" size={14} />
                        ) : isPlaying ? (
                          <Square size={14} />
                        ) : (
                          <Volume2 size={14} />
                        )}
                      </button>
                    </div>
                    <p className="bae-verse-primary">{verse.text}</p>
                    {verse.parallelText ? (
                      <p className="bae-verse-parallel">
                        <span className="bae-verse-parallel-label">
                          {config.parallelVersionLabel}
                        </span>
                        {verse.parallelText}
                      </p>
                    ) : null}
                  </div>

                  <div className="bae-verse-notes-pane">
                    <NoteBlock kind="vocab" heading={ui.vocabHeading} items={verse.vocab} />
                    <NoteBlock kind="grammar" heading={ui.grammarHeading} items={verse.grammar} />
                    <NoteBlock
                      kind="expression"
                      heading={ui.expressionHeading}
                      items={verse.expression}
                    />
                    {(!verse.vocab?.length &&
                      !verse.grammar?.length &&
                      !verse.expression?.length) ? (
                      <p className="bae-notes-empty">{ui.emptyNotes}</p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </section>
        ) : null}

        {!chapterLoading && !chapterError && verses.length === 0 && currentBook ? (
          <div className="bae-empty">
            {ui.noChapterContent(currentBook, currentChapter)}
          </div>
        ) : null}
      </main>
    </div>
  );
}

function NoteBlock({ kind, heading, items }) {
  if (!items?.length) return null;
  return (
    <div className={`bae-notes-block ${kind}`}>
      <span className="bae-notes-heading">{heading}</span>
      {kind === "vocab" ? (
        <ul className="bae-vocab-list">
          {items.map((item, idx) => (
            <li key={idx} className="bae-vocab-item">
              <span className="bae-vocab-word">{item.word}</span>
              <span className="bae-vocab-ipa">{item.ipa || ""}</span>
              <span className="bae-vocab-pos">{item.pos || ""}</span>
              <span className="bae-vocab-meaning">{item.meaning || ""}</span>
            </li>
          ))}
        </ul>
      ) : kind === "grammar" ? (
        <ul className="bae-grammar-list">
          {items.map((item, idx) => (
            <li key={idx} className="bae-grammar-item">
              <span className="bae-grammar-title">{item.title}</span>
              <span className="bae-grammar-detail">{item.detail}</span>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="bae-expression-list">
          {items.map((item, idx) => (
            <li key={idx} className="bae-expression-item">
              <span className="bae-expression-phrase">{item.phrase}</span>
              <span className="bae-expression-note">{item.note}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
