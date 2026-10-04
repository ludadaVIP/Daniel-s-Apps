import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Filter,
  Lightbulb,
  Loader2,
  RefreshCcw,
  Shuffle,
  Sparkles,
  X,
} from "lucide-react";

import "./styles.css";
import { fetchVersions, fetchBooks, fetchRandomVerse, fetchParagraph, fetchComparison } from "./services/api";

const HINT_STEP = 5;
const DEFAULT_BOOKS_STORAGE_KEY = "road2elite.recall-bible.default-books.v1";
const MODES = [
  { id: "memorize", label: "Memorize", description: "See the reference, recall the text." },
  { id: "guess", label: "Guess Reference", description: "Read the text, recall the reference." },
];
function charCount(text) {
  return (text || "").replace(/\s+/g, "").length;
}

function firstWords(text, count) {
  if (!text || count <= 0) return "";
  const words = [...text.matchAll(/\S+/gu)];
  if (words.length <= count) return text;
  const last = words[count - 1];
  return text.slice(0, last.index + last[0].length);
}

function readSavedDefaultBooks(version, availableBooks, fallback) {
  try {
    const stored = JSON.parse(window.localStorage.getItem(DEFAULT_BOOKS_STORAGE_KEY) || "{}");
    const saved = Array.isArray(stored?.[version]) ? stored[version] : [];
    const validSaved = availableBooks.filter((book) => saved.includes(book));
    return validSaved.length ? validSaved : fallback;
  } catch {
    return fallback;
  }
}

function persistDefaultBooks(version, books) {
  try {
    const stored = JSON.parse(window.localStorage.getItem(DEFAULT_BOOKS_STORAGE_KEY) || "{}");
    window.localStorage.setItem(
      DEFAULT_BOOKS_STORAGE_KEY,
      JSON.stringify({ ...(stored && typeof stored === "object" ? stored : {}), [version]: books })
    );
  } catch {
    // Local storage can be unavailable in private or restricted browser contexts.
  }
}

function sameBooks(first, second) {
  return first.length === second.length && first.every((book) => second.includes(book));
}

export default function BibleApp() {
  const [versions, setVersions] = useState([]);
  const [version, setVersion] = useState("");
  const [availableBooks, setAvailableBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [defaultBooks, setDefaultBooks] = useState([]);
  const [mode, setMode] = useState("memorize");
  const [verse, setVerse] = useState(null);
  const [hintCount, setHintCount] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [referenceShown, setReferenceShown] = useState(false);
  const [paragraph, setParagraph] = useState(null);
  const [paragraphOpen, setParagraphOpen] = useState(false);
  const [paragraphLoading, setParagraphLoading] = useState(false);
  const [comparisonVersions, setComparisonVersions] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [comparisonError, setComparisonError] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [firstVerseOnly, setFirstVerseOnly] = useState(false);
  const [secondVerseOnly, setSecondVerseOnly] = useState(false);
  const [thirdVerseOnly, setThirdVerseOnly] = useState(false);
  const [paragraphFirstOnly, setParagraphFirstOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [autoPlaying, setAutoPlaying] = useState(false);
  const fetchVerseRef = useRef(null);
  const modeRef = useRef(mode);
  const autoRunRef = useRef(0);

  // Bootstrap: list versions, pick a default, fetch its book catalog.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const versionsPayload = await fetchVersions();
        if (cancelled) return;
        setVersions(versionsPayload.versions || []);
        const defaultVersion = versionsPayload.defaultVersion || versionsPayload.versions?.[0]?.code || "";
        setVersion(defaultVersion);
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // When the version changes, refresh the available books + default set.
  useEffect(() => {
    if (!version) return;
    let cancelled = false;
    (async () => {
      try {
        setError("");
        const payload = await fetchBooks(version);
        if (cancelled) return;
        setAvailableBooks(payload.books || []);
        const serverDefault = payload.defaultBooks?.length ? payload.defaultBooks : payload.books || [];
        const initialDefault = readSavedDefaultBooks(version, payload.books || [], serverDefault);
        setDefaultBooks(initialDefault);
        setSelectedBooks((current) => {
          if (current.length === 0) return initialDefault;
          // Keep books that still exist in the new version; otherwise reset
          // to the default set so we don't end up with an empty filter.
          const filtered = current.filter((book) => (payload.books || []).includes(book));
          return filtered.length ? filtered : initialDefault;
        });
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    })();
    return () => { cancelled = true; };
  }, [version]);

  const versionMeta = useMemo(
    () => versions.find((item) => item.code === version) || null,
    [versions, version]
  );

  const filterSummary = useMemo(() => {
    if (!availableBooks.length) return "no books loaded";
    if (selectedBooks.length === availableBooks.length) return `all ${availableBooks.length} books`;
    if (selectedBooks.length === 0) return "no books selected";
    if (selectedBooks.length === 1) return selectedBooks[0];
    if (selectedBooks.length <= 3) return selectedBooks.join(", ");
    return `${selectedBooks.length} books`;
  }, [selectedBooks, availableBooks]);

  const fetchVerse = useCallback(async () => {
    if (!version) return;
    if (selectedBooks.length === 0) {
      setError("Pick at least one book in the filter first.");
      return;
    }
    setLoading(true);
    setError("");
    setVerse(null);
    setHintCount(0);
    setShowAll(false);
    setReferenceShown(false);
    setParagraph(null);
    setParagraphOpen(false);
    setComparison(null);
    try {
      const filterByBooks =
        selectedBooks.length && selectedBooks.length !== availableBooks.length
          ? selectedBooks
          : null;
      const verseNumbers = paragraphFirstOnly ? [] : [
            ...(firstVerseOnly ? [1] : []),
            ...(secondVerseOnly ? [2] : []),
            ...(thirdVerseOnly ? [3] : []),
          ];
      const payload = await fetchRandomVerse({
        version,
        books: filterByBooks,
        verseNumbers,
        paragraphFirst: paragraphFirstOnly,
      });
      setVerse(payload);
      return payload;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [
    version,
    selectedBooks,
    availableBooks,
    paragraphFirstOnly,
    firstVerseOnly,
    secondVerseOnly,
    thirdVerseOnly,
  ]);

  // Keep the automatic player on the newest callback without restarting its
  // current timed cycle when the component re-renders.
  useEffect(() => {
    fetchVerseRef.current = fetchVerse;
  }, [fetchVerse]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    if (!autoPlaying) return undefined;

    const runId = autoRunRef.current + 1;
    autoRunRef.current = runId;
    let timeoutId;
    let cancelled = false;
    const isRunning = () => !cancelled && autoRunRef.current === runId;
    const wait = (milliseconds) => new Promise((resolve) => {
      timeoutId = window.setTimeout(resolve, milliseconds);
    });

    async function playAutomatically() {
      while (isRunning()) {
        // This is the same action as pressing Start / Next verse.
        const nextVerse = await fetchVerseRef.current?.();
        if (!isRunning()) return;
        if (!nextVerse) {
          setAutoPlaying(false);
          return;
        }

        await wait(15_000);
        if (!isRunning()) return;

        // "Show" means the text in Memorize mode and the reference in Guess mode.
        if (modeRef.current === "memorize") {
          setShowAll(true);
        } else {
          setReferenceShown(true);
        }

        await wait(5_000);
        if (!isRunning()) return;

        // This mirrors See Paragraph. Paragraphs that are unavailable simply
        // leave the panel closed and continue to the next verse on schedule.
        if (nextVerse.paragraphAvailable !== false) {
          setParagraphLoading(true);
          setError("");
          try {
            const paragraphPayload = await fetchParagraph({
              version: nextVerse.version,
              book: nextVerse.book,
              chapter: nextVerse.chapter,
              verse: nextVerse.verse,
            });
            if (isRunning()) {
              setParagraph(paragraphPayload);
              setParagraphOpen(true);
            }
          } catch (err) {
            if (isRunning()) setError(err.message);
          } finally {
            setParagraphLoading(false);
          }
        }

        await wait(30_000);
        if (!isRunning()) return;
      }
    }

    playAutomatically();
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [autoPlaying]);

  const comparisonOn = comparisonVersions.length > 0;
  const verseKey = verse
    ? `${verse.version}:${verse.book}:${verse.chapter}:${(verse.verseNumbers || [verse.verse]).join(",")}`
    : "";

  useEffect(() => {
    if (!verse || !comparisonOn || comparison?.key === verseKey) return undefined;
    let cancelled = false;
    setComparisonLoading(true);
    setComparisonError("");
    fetchComparison(verse)
      .then((payload) => {
        if (!cancelled) setComparison({ key: verseKey, versions: payload.versions });
      })
      .catch((err) => {
        if (!cancelled) setComparisonError(err.message);
      })
      .finally(() => {
        if (!cancelled) setComparisonLoading(false);
      });
    return () => { cancelled = true; };
  }, [verse, comparisonOn, verseKey]);

  function toggleAutoPlay() {
    if (autoPlaying) {
      // Invalidate in-flight requests as well as the current delay immediately.
      autoRunRef.current += 1;
      setAutoPlaying(false);
      return;
    }
    setError("");
    setAutoPlaying(true);
  }

  function toggleVerseMode(setter) {
    setParagraphFirstOnly(false);
    setter((value) => !value);
  }

  function toggleParagraphMode() {
    setParagraphFirstOnly((value) => {
      const nextValue = !value;
      if (nextValue) {
        setFirstVerseOnly(false);
        setSecondVerseOnly(false);
        setThirdVerseOnly(false);
      }
      return nextValue;
    });
  }

  function toggleBook(book) {
    setSelectedBooks((current) =>
      current.includes(book) ? current.filter((item) => item !== book) : [...current, book]
    );
  }

  function selectAllBooks() { setSelectedBooks(availableBooks); }
  function clearAllBooks() { setSelectedBooks([]); }

  function saveDefaultBooks() {
    if (!selectedBooks.length) {
      setError("Choose at least one book before setting a default.");
      return;
    }
    const nextDefault = availableBooks.filter((book) => selectedBooks.includes(book));
    setDefaultBooks(nextDefault);
    persistDefaultBooks(version, nextDefault);
    setError("");
  }

  function revealMoreText() {
    if (!activeText) return;
    setHintCount((current) => current + 1);
  }

  function toggleTextVisibility() {
    if (!activeText) return;
    if (textFullyRevealed) {
      setHintCount(0);
      setShowAll(false);
    } else {
      setShowAll(true);
    }
  }

  function toggleReference() {
    setReferenceShown((current) => !current);
  }

  async function toggleParagraph() {
    if (!verse || paragraphLoading) return;
    if (paragraph) {
      setParagraphOpen((current) => !current);
      return;
    }

    setParagraphLoading(true);
    setError("");
    try {
      const payload = await fetchParagraph({
        version,
        book: verse.book,
        chapter: verse.chapter,
        verse: verse.verse,
      });
      setParagraph(payload);
      setParagraphOpen(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setParagraphLoading(false);
    }
  }

  function switchVersion(nextVersion) {
    if (nextVersion === version) return;
    // A verse belongs to one translation. Clear it immediately so a version
    // change can never show ESV/NVI text beneath another version's label.
    setVersion(nextVersion);
    setVerse(null);
    setHintCount(0);
    setShowAll(false);
    setReferenceShown(false);
    setParagraph(null);
    setParagraphOpen(false);
    setComparison(null);
    setSelectedBooks([]);
    setDefaultBooks([]);
    setError("");
  }

  function switchMode(nextMode) {
    if (nextMode === mode) return;
    setMode(nextMode);
    setVerse(null);
    setHintCount(0);
    setShowAll(false);
    setReferenceShown(false);
    setParagraph(null);
    setParagraphOpen(false);
    setComparison(null);
    setError("");
  }

  const comparisonReady = comparison?.key === verseKey;
  const activeText = comparisonOn
    ? (comparisonReady ? comparison.versions.cuv?.text || "" : "")
    : verse?.text || "";
  const revealedLength = showAll ? activeText.length : Math.min(hintCount * HINT_STEP, activeText.length);
  const totalChars = charCount(activeText);
  const textFullyRevealed = Boolean(activeText && revealedLength >= activeText.length);
  const paragraphAvailable = verse?.paragraphAvailable !== false;
  const defaultHasChanged = !sameBooks(selectedBooks, defaultBooks);
  const displayedText = useMemo(() => {
    if (mode === "guess") return activeText;
    if (revealedLength >= activeText.length) return activeText;
    return activeText.slice(0, revealedLength);
  }, [activeText, mode, revealedLength]);

  function toggleComparison(code) {
    setComparisonVersions((current) =>
      current.includes(code) ? current.filter((item) => item !== code) : [...current, code]
    );
  }

  const comparisonColumns = comparisonOn
    ? ["cuv", ...["esv", "nvi"].filter((code) => comparisonVersions.includes(code))]
    : [];

  return (
    <div className="bible-shell">
      <header className="bible-topbar">
        <div className="bible-brand">
          <div className="bible-brand-mark"><BookOpen size={17} /></div>
          <div>
            <span className="bible-eyebrow">Recall Bible</span>
            <h1>Bible Memorizer</h1>
          </div>
        </div>

        <div className="bible-version-row" role="tablist" aria-label="Bible version">
            {versions.map((item) => (
              <button
                key={item.code}
                type="button"
                role="tab"
                aria-selected={item.code === version}
                className={`bible-version-chip ${item.code === version ? "active" : ""}`}
                onClick={() => switchVersion(item.code)}
                title={item.description}
              >
                <strong>{item.shortLabel}</strong>
                <small>{item.label}</small>
              </button>
            ))}
        </div>
      </header>

      <section className="bible-controls">
        <div className="bible-mode-tabs" role="tablist" aria-label="Practice mode">
          {MODES.map((item) => (
            <button key={item.id} type="button" role="tab" aria-selected={mode === item.id}
              className={`bible-mode-tab ${mode === item.id ? "active" : ""}`}
              onClick={() => switchMode(item.id)} title={item.description}>
              <strong>{item.label}</strong><small>{item.description}</small>
            </button>
          ))}
        </div>
        <div className="bible-action-row">
          <button type="button" className={`bible-filter-toggle ${filterOpen ? "open" : ""}`}
            onClick={() => setFilterOpen((value) => !value)} aria-expanded={filterOpen}>
            <Filter size={16} /><span>Books: {filterSummary}</span>
            {filterOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button type="button" className={`bible-verse-toggle ${firstVerseOnly ? "active" : ""}`}
            onClick={() => toggleVerseMode(setFirstVerseOnly)} aria-pressed={firstVerseOnly}
            title="Only pick verse 1 from a random chapter"><BookOpen size={16} /><span>Verse 1st</span></button>
          <button type="button" className={`bible-verse-toggle ${secondVerseOnly ? "active" : ""}`}
            onClick={() => toggleVerseMode(setSecondVerseOnly)} aria-pressed={secondVerseOnly}
            title="Only pick verse 2 from a random chapter"><BookOpen size={16} /><span>Verse 2nd</span></button>
          <button type="button" className={`bible-verse-toggle ${thirdVerseOnly ? "active" : ""}`}
            onClick={() => toggleVerseMode(setThirdVerseOnly)} aria-pressed={thirdVerseOnly}
            title="Only pick verse 3 from a random chapter"><BookOpen size={16} /><span>Verse 3rd</span></button>
          <button type="button" className={`bible-verse-toggle ${paragraphFirstOnly ? "active" : ""}`}
            onClick={toggleParagraphMode} aria-pressed={paragraphFirstOnly}
            title="Pick the first verse of a random CUV-aligned paragraph"><BookOpen size={16} /><span>Pag 1st</span></button>
          <button type="button" className={`bible-auto-toggle ${autoPlaying ? "active" : ""}`}
            onClick={toggleAutoPlay} aria-pressed={autoPlaying}
            title={autoPlaying ? "Stop automatic practice" : "Start automatic practice"}>
            <span>{autoPlaying ? "Stop" : "Auto"}</span>
          </button>
          <div className="bible-comparison-toggles" role="group" aria-label="Parallel translations">
            {["esv", "nvi"].map((code) => (
              <button key={code} type="button" className={`bible-comparison-toggle ${comparisonVersions.includes(code) ? "active" : ""}`}
                onClick={() => toggleComparison(code)} aria-pressed={comparisonVersions.includes(code)}
                title={`Show ${code.toUpperCase()} alongside Chinese`}>{code.toUpperCase()}</button>
            ))}
          </div>
        </div>
        {filterOpen ? (
          <div className="bible-filter-panel">
            <div className="bible-filter-actions">
              <button type="button" onClick={selectAllBooks}><Check size={14} />All</button>
              <button type="button" onClick={clearAllBooks}><X size={14} />None</button>
              <button type="button" onClick={saveDefaultBooks} disabled={!defaultHasChanged || selectedBooks.length === 0}
                title={defaultHasChanged ? "Save the current selection as this version's default" : "This version's saved default"}>
                <Sparkles size={14} />{defaultHasChanged ? "Set Default" : `Default (${defaultBooks.length})`}
              </button>
              <span className="bible-filter-meta">{selectedBooks.length}/{availableBooks.length} selected</span>
            </div>
            <div className="bible-book-grid">
              {availableBooks.map((book) => (
                <button key={book} type="button" className={`bible-book-chip ${selectedBooks.includes(book) ? "active" : ""}`}
                  onClick={() => toggleBook(book)}>{book}</button>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {error ? <div className="bible-error">{error}</div> : null}

      <main className="bible-stage">
        {!verse && !loading ? (
          <EmptyState versionMeta={versionMeta} mode={mode} onStart={fetchVerse} />
        ) : null}

        {loading && !verse ? (
          <div className="bible-loading">
            <Loader2 className="spin" size={28} />
            <span>Picking a verse for you...</span>
          </div>
        ) : null}

        {verse ? (
          <article className={`bible-card mode-${mode}`}>
            <aside className="bible-sidebar">
              <div className="bible-card-meta">
                <span className="bible-tag">{versionMeta?.shortLabel || verse.version.toUpperCase()}</span>
                <span className="bible-tag muted">
                  {paragraphFirstOnly
                    ? "Paragraph 1st"
                    : mode === "memorize" ? "Recall the text" : "Recall the reference"}
                </span>
              </div>

              {mode === "memorize" ? (
                <>
                  <div className="bible-reference">{verse.reference}</div>
                  <div className="bible-meta-line">
                    <span>{totalChars} characters to recall</span>
                    {activeText && revealedLength > 0 && revealedLength < activeText.length ? (
                      <span>{revealedLength} / {activeText.length} revealed</span>
                    ) : null}
                  </div>

                  <div className="bible-verse-actions">
                    <button type="button" className="bible-secondary" onClick={revealMoreText} disabled={!activeText || revealedLength >= activeText.length}>
                      <Lightbulb size={16} /><span>Hint (+{HINT_STEP})</span>
                    </button>
                    <button type="button" className="bible-secondary" onClick={toggleTextVisibility} disabled={!activeText}>
                      {textFullyRevealed ? <EyeOff size={16} /> : <Eye size={16} />}
                      <span>{textFullyRevealed ? "Hide" : "Show"}</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="bible-meta-line">
                    <span>{totalChars} characters</span>
                  </div>
                  <div className={`bible-reference ${referenceShown ? "" : "is-hidden"}`}>
                    {referenceShown ? verse.reference : "(reference hidden)"}
                  </div>
                  <div className="bible-verse-actions">
                    <button type="button" className="bible-secondary" onClick={toggleReference}>
                      {referenceShown ? <EyeOff size={16} /> : <Eye size={16} />}
                      <span>{referenceShown ? "Hide reference" : "Show reference"}</span>
                    </button>
                  </div>
                </>
              )}

              <footer className="bible-card-footer">
                <button type="button" className="bible-primary" onClick={fetchVerse} disabled={loading}>
                  {loading ? <Loader2 className="spin" size={18} /> : <RefreshCcw size={18} />}
                  <span>Next verse</span>
                </button>
                <button
                  type="button"
                  className="bible-secondary bible-see-paragraph"
                  onClick={toggleParagraph}
                  disabled={paragraphLoading || !paragraphAvailable}
                  title={paragraphAvailable
                    ? "Show the CUV-aligned paragraph containing this verse"
                    : "CUV-aligned paragraphs are currently provided for New Testament books"
                  }
                >
                  {paragraphLoading ? <Loader2 className="spin" size={16} /> : <BookOpen size={16} />}
                  <span>{paragraphOpen ? "Hide Paragraph" : "See Paragraph"}</span>
                </button>
              </footer>
            </aside>

            <section
              className={`bible-reading-pane ${paragraphOpen && paragraph ? "has-paragraph" : ""} ${comparisonOn ? "is-comparison" : ""}`}
              aria-label="Scripture text"
            >
              {comparisonOn ? (
                <div className="bible-comparison-grid" style={{ "--comparison-columns": comparisonColumns.length }}>
                  {comparisonColumns.map((code) => (
                    <ParallelColumn
                      key={code}
                      code={code}
                      passage={comparisonReady ? comparison.versions[code] : null}
                      loading={comparisonLoading || !comparisonReady && !comparisonError}
                      error={comparisonError}
                      mode={mode}
                      displayedText={displayedText}
                      revealedLength={revealedLength}
                      activeText={activeText}
                      hintCount={hintCount}
                      textFullyRevealed={textFullyRevealed}
                      paragraphOpen={paragraphOpen}
                    />
                  ))}
                </div>
              ) : mode === "memorize" ? (
                <div className={`bible-verse-body ${revealedLength === 0 ? "is-hidden" : ""}`}>
                  {revealedLength === 0 ? (
                    <span className="bible-placeholder">(text hidden — recall it, then peek with Hint or Show)</span>
                  ) : (
                    <>
                      <span className="bible-verse-revealed">{displayedText}</span>
                      {revealedLength < verse.text.length ? <span className="bible-verse-cursor">▌</span> : null}
                    </>
                  )}
                </div>
              ) : (
                <div className="bible-verse-body">
                  <span className="bible-verse-revealed">{verse.text}</span>
                </div>
              )}
              {!comparisonOn && paragraphOpen && paragraph ? (
                <section className="bible-paragraph-panel" aria-label="Scripture paragraph">
                  <div className="bible-paragraph-heading">
                    <span>{paragraph.boundaryVersion === "cuv" ? "CUV-aligned paragraph" : "Paragraph"}</span>
                    <strong>{paragraph.reference}</strong>
                  </div>
                  <div className="bible-paragraph-text">{paragraph.text}</div>
                </section>
              ) : null}
            </section>
          </article>
        ) : null}
      </main>
    </div>
  );
}

function ParallelColumn({ code, passage, loading, error, mode, displayedText, revealedLength, activeText, hintCount, textFullyRevealed, paragraphOpen }) {
  const primary = code === "cuv";
  const language = { cuv: "zh", esv: "en", nvi: "es" }[code];
  const visibleText = primary ? displayedText
    : mode === "guess" || textFullyRevealed ? passage?.text || ""
      : firstWords(passage?.text, hintCount * HINT_STEP);
  const verseLength = primary ? activeText.length : passage?.text.length || 0;
  return (
    <div className={`bible-comparison-column ${paragraphOpen ? "has-paragraph" : ""}`} lang={language}>
      <div className="bible-comparison-verse">
        <div className="bible-comparison-label">{code.toUpperCase()}</div>
        {loading ? <span className="bible-placeholder">Loading translation…</span>
          : error ? <span className="bible-placeholder">{error}</span>
          : !passage ? <span className="bible-placeholder">Translation unavailable for this passage.</span>
          : mode === "memorize" && revealedLength === 0
            ? <span className="bible-placeholder">(text hidden — recall it, then peek with Hint or Show)</span>
            : <>
              <span className="bible-comparison-revealed">{visibleText}</span>
              {mode === "memorize" && visibleText.length < verseLength
                ? <span className="bible-verse-cursor">▌</span> : null}
            </>}
      </div>
      {paragraphOpen ? (
        <div className="bible-comparison-paragraph">
          {passage?.paragraph ? (
            <>
              <div className="bible-paragraph-heading">
                <span>Paragraph</span>
                <strong>{passage.paragraph.reference}</strong>
              </div>
              <div className="bible-paragraph-text">{passage.paragraph.text}</div>
            </>
          ) : <span className="bible-placeholder">{loading ? "Loading paragraph…" : "Paragraph unavailable."}</span>}
        </div>
      ) : null}
    </div>
  );
}

function EmptyState({ versionMeta, mode, onStart }) {
  const tip = mode === "memorize"
    ? "Generate a verse — the reference shows up first, recall the text in your head, then peek with Hint or Show."
    : "Generate a verse — the text shows up first, recall where in the Bible it lives, then reveal the reference.";
  return (
    <div className="bible-empty">
      <Sparkles size={28} />
      <h2>Ready when you are</h2>
      <p>{tip}</p>
      {versionMeta ? (
        <p className="bible-empty-version">
          Using <strong>{versionMeta.label}</strong> ({versionMeta.shortLabel}).
        </p>
      ) : null}
      <button type="button" className="bible-primary" onClick={onStart}>
        <Shuffle size={18} />
        <span>Pick a random verse</span>
      </button>
    </div>
  );
}
