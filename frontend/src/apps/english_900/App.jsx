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
import { fetchGroup, fetchGroups, requestTts } from "./services/api";
import { isTtsCancelled, useTts } from "../../shared/useTts";

const STORAGE_KEY = "english-900:last-group";
const QUEUE_PAUSE_MS = 320;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function iconForMode(mode) {
  return mode === "all" ? <Headphones size={18} /> : <Volume2 size={18} />;
}

function AudioButton({ active, disabled, loading, mode, onClick, title }) {
  return (
    <button
      className={`e900-audio-button ${active ? "is-active" : ""}`}
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={title}
      title={title}
    >
      {loading ? <Loader2 className="e900-spin" size={18} /> : iconForMode(mode)}
    </button>
  );
}

function Sidebar({ activeGroupId, groups, loading, onSelect }) {
  return (
    <aside className="e900-sidebar">
      <div className="e900-brand">
        <div className="e900-brand-mark">900</div>
        <div>
          <p>English 900</p>
          <span>英中口语训练</span>
        </div>
      </div>

      <div className="e900-sidebar-panel">
        <div className="e900-stat">
          <strong>900</strong>
          <span>sentences</span>
        </div>
        <div className="e900-stat">
          <strong>9</strong>
          <span>groups</span>
        </div>
      </div>

      <nav className="e900-group-nav" aria-label="English 900 groups">
        {loading && (
          <div className="e900-loading-nav">
            <Loader2 className="e900-spin" size={18} />
            <span>Loading groups</span>
          </div>
        )}
        {groups.map((group, index) => (
          <button
            className={`e900-group-button ${group.id === activeGroupId ? "is-selected" : ""}`}
            key={group.id}
            type="button"
            onClick={() => onSelect(group.id)}
          >
            <span className="e900-group-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="e900-group-copy">
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
  onPlayEnglish,
  sentence,
  speakingKey,
}) {
  const englishKey = `${sentence.id}:en`;
  const allKey = `${sentence.id}:all`;
  const chineseKey = `${sentence.id}:zh`;
  const isEnglishActive = speakingKey === englishKey;
  const isAllActive = speakingKey === allKey || speakingKey === chineseKey;

  return (
    <article className={`e900-sentence ${active ? "is-current" : ""}`}>
      <div className="e900-sentence-index">
        <span>{sentence.groupNumber}</span>
        <small>{sentence.tag}</small>
      </div>
      <div className="e900-sentence-copy">
        <p className="e900-english">{sentence.english}</p>
        <p className="e900-chinese">{sentence.chinese}</p>
      </div>
      <div className="e900-sentence-actions">
        <AudioButton
          active={isEnglishActive}
          disabled={disabled}
          loading={loadingKey === englishKey}
          mode="english"
          onClick={() => onPlayEnglish(sentence)}
          title="Play English"
        />
        <AudioButton
          active={isAllActive}
          disabled={disabled}
          loading={loadingKey === allKey || loadingKey === chineseKey}
          mode="all"
          onClick={() => onPlayAll(sentence)}
          title="Play English and Chinese"
        />
      </div>
    </article>
  );
}

export default function English900App() {
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
  const [queueState, setQueueState] = useState({ running: false, label: "" });
  const [activeSentenceId, setActiveSentenceId] = useState("");
  const queueRunRef = useRef(0);

  const { play, stop, speakingKey, loadingKey, error: ttsError } = useTts();

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
    setQueueState({ running: false, label: "" });
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
        sentence.english.toLowerCase().includes(needle) ||
        sentence.chinese.includes(query.trim()) ||
        sentence.tag.toLowerCase().includes(needle)
      );
    });
  }, [group, query]);

  const stopQueue = useCallback(() => {
    queueRunRef.current += 1;
    stop();
    setQueueState({ running: false, label: "" });
    setActiveSentenceId("");
  }, [stop]);

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
    async ({ label, mode, sentences }) => {
      const runId = queueRunRef.current + 1;
      queueRunRef.current = runId;
      setError("");
      setQueueState({ running: true, label });

      try {
        for (const sentence of sentences) {
          if (queueRunRef.current !== runId) throw new Error("cancelled");

          if (mode === "english") {
            await playClip({
              key: `${sentence.id}:en`,
              language: "en",
              sentenceId: sentence.id,
              text: sentence.english,
            });
          } else {
            await playClip({
              key: `${sentence.id}:all`,
              language: "en",
              sentenceId: sentence.id,
              text: sentence.english,
            });
            if (queueRunRef.current !== runId) throw new Error("cancelled");
            await sleep(QUEUE_PAUSE_MS);
            await playClip({
              key: `${sentence.id}:zh`,
              language: "zh",
              sentenceId: sentence.id,
              text: sentence.chinese,
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
          setQueueState({ running: false, label: "" });
          setActiveSentenceId("");
        }
      }
    },
    [playClip],
  );

  const playSentence = useCallback(
    (sentence, mode) => {
      runQueue({
        label: mode === "english" ? "Playing English" : "Playing English + Chinese",
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
        label: mode === "english" ? "Playing group in English" : "Playing full bilingual group",
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
    <div className="e900-shell">
      <Sidebar
        activeGroupId={activeGroupId}
        groups={course?.groups || []}
        loading={loadingCourse}
        onSelect={setActiveGroupId}
      />

      <main className="e900-content">
        <section className="e900-hero">
          <div className="e900-hero-main">
            <div className="e900-kicker">
              <Sparkles size={16} />
              <span>Progressive speaking and listening</span>
            </div>
            <h1>{group?.title || "English 900"}</h1>
            <p>{group?.focus || course?.description || "900 practical English sentences with Chinese translations."}</p>
            <div className="e900-meta-row">
              <span><BookOpen size={16} /> {group?.level || "A1-B2"}</span>
              <span><Radio size={16} /> Group {currentGroupIndex + 1 || 1} of 9</span>
              <span><Headphones size={16} /> {groupCount} sentences</span>
            </div>
          </div>

          <div className="e900-player">
            <div className="e900-player-status">
              <span className={busy ? "is-live" : ""}>{busy ? queueState.label : "Ready to practice"}</span>
              {(loadingKey || speakingKey) && <small>{loadingKey ? "Preparing audio" : "Audio playing"}</small>}
            </div>
            <div className="e900-player-actions">
              <button
                className="e900-primary-button"
                type="button"
                onClick={() => playGroup("english")}
                disabled={loadingGroup || !groupCount}
              >
                <Play size={18} />
                <span>Play English</span>
              </button>
              <button
                className="e900-secondary-button"
                type="button"
                onClick={() => playGroup("all")}
                disabled={loadingGroup || !groupCount}
              >
                <Headphones size={18} />
                <span>Play All</span>
              </button>
              <button
                className="e900-stop-button"
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
          <div className="e900-error" role="alert">
            {error || ttsError}
          </div>
        )}

        <section className="e900-toolbar">
          <label className="e900-search">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search English, Chinese, or tag"
            />
          </label>
          <span>{visibleCount} shown</span>
        </section>

        <section className="e900-list" aria-label="English 900 sentences">
          {loadingGroup ? (
            <div className="e900-loading-state">
              <Loader2 className="e900-spin" size={24} />
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
                onPlayEnglish={(item) => playSentence(item, "english")}
                sentence={sentence}
                speakingKey={speakingKey}
              />
            ))
          )}
        </section>
      </main>
    </div>
  );
}
