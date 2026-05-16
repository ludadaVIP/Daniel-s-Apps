import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  ChevronRight,
  Headphones,
  Loader2,
  Pause,
  Play,
  Radio,
  Search,
  Sparkles,
  Square,
  Volume2,
} from "lucide-react";

import "./styles.css";
import { fetchGroup, fetchGroups, importGroup, requestTts } from "./services/api";
import { NineHundredDataTools } from "../../shared/NineHundredDataTools";
import { NineHundredProgressDock } from "../../shared/NineHundredProgressDock";
import { useActiveItemScroll } from "../../shared/useActiveItemScroll";
import { isTtsCancelled, useTts } from "../../shared/useTts";

const STORAGE_KEY = "spanish-900:last-group";
const QUEUE_PAUSE_MS = 320;
const DATA_TOOL_CONFIG = {
  appName: "Spanish 900",
  fields: ["spanish", "english"],
  example: {
    spanish: "No sabía que la biblioteca cerraba tan temprano.",
    english: "I didn't know the library closed so early.",
  },
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function iconForMode(mode) {
  return mode === "all" ? <Headphones size={18} /> : <Volume2 size={18} />;
}

function AudioButton({ active, disabled, loading, mode, onClick, title }) {
  return (
    <button
      className={`s900-audio-button ${active ? "is-active" : ""}`}
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={title}
      title={title}
    >
      {loading ? <Loader2 className="s900-spin" size={18} /> : iconForMode(mode)}
    </button>
  );
}

function Sidebar({ activeGroupId, groups, loading, onSelect, totalSentences }) {
  return (
    <aside className="s900-sidebar">
      <div className="s900-brand">
        <div className="s900-brand-mark">900</div>
        <div>
          <p>Spanish 900</p>
          <span>Speaking course</span>
        </div>
      </div>

      <div className="s900-sidebar-panel">
        <div className="s900-stat">
          <strong>{totalSentences || 900}</strong>
          <span>sentences</span>
        </div>
        <div className="s900-stat">
          <strong>{groups.length || 9}</strong>
          <span>groups</span>
        </div>
      </div>

      <nav className="s900-group-nav" aria-label="Spanish 900 groups">
        {loading && (
          <div className="s900-loading-nav">
            <Loader2 className="s900-spin" size={18} />
            <span>Loading groups</span>
          </div>
        )}
        {groups.map((group, index) => (
          <button
            className={`s900-group-button ${group.id === activeGroupId ? "is-selected" : ""}`}
            key={group.id}
            type="button"
            onClick={() => onSelect(group.id)}
          >
            <span className="s900-group-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="s900-group-copy">
              <strong>{group.title}</strong>
              <small>{group.level} · {group.count} sentences</small>
            </span>
            <ChevronRight size={16} />
          </button>
        ))}
      </nav>
    </aside>
  );
}

function SentenceRow({
  active,
  disabled,
  loadingKey,
  onPlayAll,
  onPlaySpanish,
  rowRef,
  sentence,
  speakingKey,
}) {
  const spanishKey = `${sentence.id}:es`;
  const allKey = `${sentence.id}:all`;
  const englishKey = `${sentence.id}:en`;
  const isSpanishActive = speakingKey === spanishKey;
  const isAllActive = speakingKey === allKey || speakingKey === englishKey;

  return (
    <article
      className={`s900-sentence ${active ? "is-current" : ""}`}
      ref={rowRef}
    >
      <div className="s900-sentence-index">
        <span>{sentence.groupNumber}</span>
        <small>{sentence.tag}</small>
      </div>
      <div className="s900-sentence-copy">
        <p className="s900-spanish">{sentence.spanish}</p>
        <p className="s900-english">{sentence.english}</p>
      </div>
      <div className="s900-sentence-actions">
        <AudioButton
          active={isSpanishActive}
          disabled={disabled}
          loading={loadingKey === spanishKey}
          mode="spanish"
          onClick={() => onPlaySpanish(sentence)}
          title="Play Spanish"
        />
        <AudioButton
          active={isAllActive}
          disabled={disabled}
          loading={loadingKey === allKey || loadingKey === englishKey}
          mode="all"
          onClick={() => onPlayAll(sentence)}
          title="Play Spanish and English"
        />
      </div>
    </article>
  );
}

export default function Spanish900App() {
  const [course, setCourse] = useState(null);
  const [activeGroupId, setActiveGroupId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "group-1";
    } catch {
      return "group-1";
    }
  });
  const [group, setGroup] = useState(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [queueState, setQueueState] = useState({
    running: false,
    label: "",
    mode: "",
    sentences: [],
    currentIndex: 0,
  });
  const [activeSentenceId, setActiveSentenceId] = useState("");
  const queueRunRef = useRef(0);
  const setSentenceRef = useActiveItemScroll(activeSentenceId);

  const {
    play,
    stop,
    pause,
    resume,
    paused,
    speakingKey,
    loadingKey,
    error: ttsError,
  } = useTts();

  useEffect(() => {
    let alive = true;
    setLoadingCourse(true);
    fetchGroups()
      .then((data) => {
        if (!alive) return;
        setCourse(data);
        if (!data.groups.some((item) => item.id === activeGroupId)) {
          setActiveGroupId(data.groups[0]?.id || "group-1");
        }
      })
      .catch((err) => alive && setError(err.message))
      .finally(() => alive && setLoadingCourse(false));
    return () => {
      alive = false;
    };
  }, [activeGroupId]);

  useEffect(() => {
    let alive = true;
    queueRunRef.current += 1;
    stop();
    setQueueState({ running: false, label: "", mode: "", sentences: [], currentIndex: 0 });
    setActiveSentenceId("");
    setLoadingGroup(true);
    fetchGroup(activeGroupId)
      .then((data) => {
        if (!alive) return;
        setGroup(data);
        try {
          localStorage.setItem(STORAGE_KEY, activeGroupId);
        } catch {
          /* ignore */
        }
      })
      .catch((err) => alive && setError(err.message))
      .finally(() => alive && setLoadingGroup(false));
    return () => {
      alive = false;
    };
  }, [activeGroupId, stop]);

  const filteredSentences = useMemo(() => {
    const sentences = group?.sentences || [];
    const needle = query.trim().toLowerCase();
    if (!needle) return sentences;
    return sentences.filter((sentence) => {
      return (
        sentence.spanish.toLowerCase().includes(needle) ||
        sentence.english.toLowerCase().includes(needle) ||
        sentence.tag.toLowerCase().includes(needle)
      );
    });
  }, [group, query]);

  const stopQueue = useCallback(() => {
    queueRunRef.current += 1;
    stop();
    setQueueState({ running: false, label: "", mode: "", sentences: [], currentIndex: 0 });
    setActiveSentenceId("");
  }, [stop]);

  const handleImportGroup = useCallback(async (content) => {
    const result = await importGroup(content);
    const nextCourse = await fetchGroups();
    setCourse(nextCourse);
    setActiveGroupId(result.group.id);
    return result;
  }, []);

  const playClip = useCallback(
    async ({ key, language, sentenceId, text }) => {
      setActiveSentenceId(sentenceId);
      await play({
        key,
        waitForEnd: true,
        getUrl: async () => {
          const data = await requestTts({ text, language });
          return { url: data.audio_url };
        },
      });
    },
    [play],
  );

  const runQueue = useCallback(
    async ({ label, mode, sentences, startIndex = 0 }) => {
      const runId = queueRunRef.current + 1;
      queueRunRef.current = runId;
      stop();
      setError("");
      setQueueState({ running: true, label, mode, sentences, currentIndex: startIndex });

      try {
        for (let index = startIndex; index < sentences.length; index += 1) {
          const sentence = sentences[index];
          if (queueRunRef.current !== runId) throw new Error("cancelled");
          setQueueState((current) => ({ ...current, currentIndex: index }));

          if (mode === "spanish") {
            await playClip({
              key: `${sentence.id}:es`,
              language: "es",
              sentenceId: sentence.id,
              text: sentence.spanish,
            });
          } else {
            await playClip({
              key: `${sentence.id}:all`,
              language: "es",
              sentenceId: sentence.id,
              text: sentence.spanish,
            });
            if (queueRunRef.current !== runId) throw new Error("cancelled");
            await sleep(QUEUE_PAUSE_MS);
            await playClip({
              key: `${sentence.id}:en`,
              language: "en",
              sentenceId: sentence.id,
              text: sentence.english,
            });
          }

          if (queueRunRef.current !== runId) throw new Error("cancelled");
          await sleep(QUEUE_PAUSE_MS);
        }
      } catch (err) {
        if (!isTtsCancelled(err) && err.message !== "cancelled") {
          setError(err.message || "Playback failed.");
        }
      } finally {
        if (queueRunRef.current === runId) {
          setQueueState({ running: false, label: "", mode: "", sentences: [], currentIndex: 0 });
          setActiveSentenceId("");
        }
      }
    },
    [playClip, stop],
  );

  const seekQueue = useCallback(
    (index) => {
      const sentences = queueState.sentences.length ? queueState.sentences : group?.sentences || [];
      if (!sentences.length) return;
      runQueue({
        label: queueState.label || "Playing queue",
        mode: queueState.mode || "spanish",
        sentences,
        startIndex: index,
      });
    },
    [group, queueState, runQueue],
  );

  const playSentence = useCallback(
    (sentence, mode) => {
      runQueue({
        label: mode === "spanish" ? "Playing Spanish" : "Playing Spanish + English",
        mode,
        sentences: [sentence],
      });
    },
    [runQueue],
  );

  const playGroup = useCallback(
    (mode) => {
      const sentences = group?.sentences || [];
      if (!sentences.length) return;
      runQueue({
        label: mode === "spanish" ? "Playing group in Spanish" : "Playing full bilingual group",
        mode,
        sentences,
      });
    },
    [group, runQueue],
  );

  const currentGroupIndex = (course?.groups || []).findIndex((item) => item.id === activeGroupId);
  const groupCount = group?.sentences?.length || 0;
  const visibleCount = filteredSentences.length;
  const busy = queueState.running;

  return (
    <div className="s900-shell">
      <Sidebar
        activeGroupId={activeGroupId}
        groups={course?.groups || []}
        loading={loadingCourse}
        onSelect={setActiveGroupId}
        totalSentences={course?.totalSentences}
      />

      <main className="s900-content">
        <section className="s900-hero">
          <div className="s900-hero-main">
            <div className="s900-kicker">
              <Sparkles size={16} />
              <span>Progressive speaking and listening</span>
            </div>
            <h1>{group?.title || "Spanish 900"}</h1>
            <p>{group?.focus || course?.description || "900 practical sentences for real life and study abroad."}</p>
            <div className="s900-meta-row">
              <span><BookOpen size={16} /> {group?.level || "A1-B2"}</span>
              <span><Radio size={16} /> Group {currentGroupIndex + 1 || 1} of {course?.groups?.length || 9}</span>
              <span><Headphones size={16} /> {groupCount} sentences</span>
            </div>
          </div>

          <div className="s900-player">
            <div className="s900-player-status">
              <span className={busy ? "is-live" : ""}>{busy ? queueState.label : "Ready to practice"}</span>
              {(loadingKey || speakingKey) && <small>{loadingKey ? "Preparing audio" : "Audio playing"}</small>}
            </div>
            <div className="s900-player-actions">
              <button
                className="s900-primary-button"
                type="button"
                onClick={() => playGroup("spanish")}
                disabled={loadingGroup || !groupCount}
              >
                <Play size={18} />
                <span>Play Spanish</span>
              </button>
              <button
                className="s900-secondary-button"
                type="button"
                onClick={() => playGroup("all")}
                disabled={loadingGroup || !groupCount}
              >
                <Headphones size={18} />
                <span>Play All</span>
              </button>
              <button
                className="s900-stop-button"
                type="button"
                onClick={stopQueue}
                disabled={!busy && !speakingKey && !loadingKey}
                title="Stop audio"
              >
                {busy ? <Square size={17} /> : <Pause size={17} />}
              </button>
            </div>
          </div>
        </section>

        {(error || ttsError) && (
          <div className="s900-error" role="alert">
            {error || ttsError}
          </div>
        )}

        <section className="s900-toolbar">
          <label className="s900-search">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Spanish, English, or tag"
            />
          </label>
          <NineHundredDataTools config={DATA_TOOL_CONFIG} onImport={handleImportGroup} />
          <span>{visibleCount} shown</span>
        </section>

        <section className="s900-list" aria-label="Spanish 900 sentences">
          {loadingGroup ? (
            <div className="s900-loading-state">
              <Loader2 className="s900-spin" size={24} />
              <span>Loading sentences</span>
            </div>
          ) : (
            filteredSentences.map((sentence) => (
              <SentenceRow
                active={activeSentenceId === sentence.id}
                disabled={false}
                key={sentence.id}
                loadingKey={loadingKey}
                onPlayAll={(item) => playSentence(item, "all")}
                onPlaySpanish={(item) => playSentence(item, "spanish")}
                rowRef={(node) => setSentenceRef(sentence.id, node)}
                sentence={sentence}
                speakingKey={speakingKey}
              />
            ))
          )}
        </section>
      </main>
      <NineHundredProgressDock
        currentIndex={queueState.currentIndex}
        label={queueState.label}
        onPause={pause}
        onResume={resume}
        onSeek={seekQueue}
        onStop={stopQueue}
        paused={paused}
        total={queueState.sentences.length}
        visible={queueState.running}
      />
    </div>
  );
}
