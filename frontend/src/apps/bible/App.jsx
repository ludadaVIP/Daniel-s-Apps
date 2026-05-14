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

// All Bible endpoints are namespaced under /api/bible/* in the unified
// backend. The standalone Flask + MySQL app used /get_verse and
// /get_random_verse_content — we collapsed both into /random and let
// the UI decide what to hide.
const API_BASE = "/api/bible";

const HINT_STEP = 5;
const MODES = [
  { id: "memorize", label: "Memorize", description: "See the reference, recall the text." },
  { id: "guess", label: "Guess Reference", description: "Read the text, recall the reference." },
];

async function api(path) {
  const response = await fetch(path);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
  return data;
}

function charCount(text) {
  return (text || "").replace(/\s+/g, "").length;
}

export default function BibleApp() {
  const [versions, setVersions] = useState([]);
  const [version, setVersion] = useState("");
  const [availableBooks, setAvailableBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [defaultBooks, setDefaultBooks] = useState([]);
  const [mode, setMode] = useState("memorize");
  const [verse, setVerse] = useState(null);
  const [revealedLength, setRevealedLength] = useState(0);
  const [referenceShown, setReferenceShown] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Bootstrap: list versions, pick a default, fetch its book catalog.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const versionsPayload = await api(`${API_BASE}/versions`);
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
        const payload = await api(`${API_BASE}/books?version=${encodeURIComponent(version)}`);
        if (cancelled) return;
        setAvailableBooks(payload.books || []);
        const initialDefault = payload.defaultBooks?.length ? payload.defaultBooks : payload.books || [];
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
    setRevealedLength(0);
    setReferenceShown(false);
    try {
      const params = new URLSearchParams({ version });
      if (selectedBooks.length && selectedBooks.length !== availableBooks.length) {
        params.set("books", selectedBooks.join(","));
      }
      const payload = await api(`${API_BASE}/random?${params.toString()}`);
      setVerse(payload);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [version, selectedBooks, availableBooks]);

  function toggleBook(book) {
    setSelectedBooks((current) =>
      current.includes(book) ? current.filter((item) => item !== book) : [...current, book]
    );
  }

  function selectAllBooks() {
    setSelectedBooks(availableBooks);
  }

  function clearAllBooks() {
    setSelectedBooks([]);
  }

  function restoreDefaultBooks() {
    setSelectedBooks(defaultBooks);
  }

  function revealMoreText() {
    if (!verse) return;
    setRevealedLength((current) => Math.min(current + HINT_STEP, verse.text.length));
  }

  function showFullText() {
    if (!verse) return;
    setRevealedLength(verse.text.length);
  }

  function hideText() {
    setRevealedLength(0);
  }

  function toggleReference() {
    setReferenceShown((current) => !current);
  }

  function switchMode(nextMode) {
    if (nextMode === mode) return;
    setMode(nextMode);
    setVerse(null);
    setRevealedLength(0);
    setReferenceShown(false);
    setError("");
  }

  const totalChars = charCount(verse?.text);
  const displayedText = useMemo(() => {
    if (!verse) return "";
    if (mode === "guess") return verse.text;
    if (revealedLength >= verse.text.length) return verse.text;
    return verse.text.slice(0, revealedLength);
  }, [verse, mode, revealedLength]);

  return (
    <div className="bible-shell">
      <header className="bible-topbar">
        <div className="bible-brand">
          <div className="bible-brand-mark"><BookOpen size={22} /></div>
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
              onClick={() => setVersion(item.code)}
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
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={mode === item.id}
              className={`bible-mode-tab ${mode === item.id ? "active" : ""}`}
              onClick={() => switchMode(item.id)}
            >
              <strong>{item.label}</strong>
              <small>{item.description}</small>
            </button>
          ))}
        </div>

        <div className="bible-action-row">
          <button
            type="button"
            className="bible-primary"
            disabled={loading || !version}
            onClick={fetchVerse}
          >
            {loading ? <Loader2 className="spin" size={18} /> : <Shuffle size={18} />}
            <span>{verse ? "New verse" : "Start"}</span>
          </button>

          <button
            type="button"
            className={`bible-filter-toggle ${filterOpen ? "open" : ""}`}
            onClick={() => setFilterOpen((value) => !value)}
            aria-expanded={filterOpen}
          >
            <Filter size={16} />
            <span>Books: {filterSummary}</span>
            {filterOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {filterOpen ? (
          <div className="bible-filter-panel">
            <div className="bible-filter-actions">
              <button type="button" onClick={selectAllBooks}><Check size={14} />All</button>
              <button type="button" onClick={clearAllBooks}><X size={14} />None</button>
              <button type="button" onClick={restoreDefaultBooks}>
                <Sparkles size={14} />Default ({defaultBooks.length})
              </button>
              <span className="bible-filter-meta">
                {selectedBooks.length}/{availableBooks.length} selected
              </span>
            </div>
            <div className="bible-book-grid">
              {availableBooks.map((book) => {
                const active = selectedBooks.includes(book);
                return (
                  <button
                    key={book}
                    type="button"
                    className={`bible-book-chip ${active ? "active" : ""}`}
                    onClick={() => toggleBook(book)}
                  >
                    {book}
                  </button>
                );
              })}
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
            <div className="bible-card-meta">
              <span className="bible-tag">{versionMeta?.shortLabel || verse.version.toUpperCase()}</span>
              <span className="bible-tag muted">{mode === "memorize" ? "Recall the text" : "Recall the reference"}</span>
            </div>

            {mode === "memorize" ? (
              <>
                <div className="bible-reference">{verse.reference}</div>
                <div className="bible-meta-line">
                  <span>{totalChars} characters to recall</span>
                  {revealedLength > 0 && revealedLength < verse.text.length ? (
                    <span>{revealedLength} / {verse.text.length} revealed</span>
                  ) : null}
                </div>

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

                <div className="bible-verse-actions">
                  <button type="button" className="bible-secondary" onClick={revealMoreText} disabled={revealedLength >= verse.text.length}>
                    <Lightbulb size={16} /><span>Hint (+{HINT_STEP})</span>
                  </button>
                  <button type="button" className="bible-secondary" onClick={showFullText} disabled={revealedLength >= verse.text.length}>
                    <Eye size={16} /><span>Show all</span>
                  </button>
                  <button type="button" className="bible-ghost" onClick={hideText} disabled={revealedLength === 0}>
                    <EyeOff size={16} /><span>Hide</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="bible-verse-body">
                  <span className="bible-verse-revealed">{verse.text}</span>
                </div>
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
            </footer>
          </article>
        ) : null}
      </main>
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
