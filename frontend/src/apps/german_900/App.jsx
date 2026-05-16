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

const STORAGE_KEY = "german-900:last-group";
const QUEUE_PAUSE_MS = 320;
const DATA_TOOL_CONFIG = {
  appName: "German 900",
  fields: ["german", "french", "spanish"],
  example: {
    german: "Ich würde gern wissen, ob der Kurs noch Plätze frei hat.",
    french: "J'aimerais savoir s'il reste des places dans ce cours.",
    spanish: "Me gustaría saber si todavía quedan plazas en este curso.",
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
      className={`g900-audio-button ${mode === "all" ? "is-mode-all" : "is-mode-de"} ${active ? "is-active" : ""}`}
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={title}
      title={title}
    >
      {loading ? <Loader2 className="g900-spin" size={18} /> : iconForMode(mode)}
    </button>
  );
}

function Sidebar({ activeGroupId, groups, loading, onSelect, totalSentences }) {
  return (
    <aside className="g900-sidebar">
      <div className="g900-brand">
        <div className="g900-brand-mark">900</div>
        <div>
          <p>German 900</p>
          <span>Deutsch sprechen · DE / FR / ES</span>
        </div>
      </div>

      <div className="g900-sidebar-panel">
        <div className="g900-stat">
          <strong>{totalSentences || 900}</strong>
          <span>Sätze</span>
        </div>
        <div className="g900-stat">
          <strong>{groups.length || 9}</strong>
          <span>Gruppen</span>
        </div>
      </div>

      <nav className="g900-group-nav" aria-label="German 900 Gruppen">
        {loading && (
          <div className="g900-loading-nav">
            <Loader2 className="g900-spin" size={18} />
            <span>Gruppen werden geladen</span>
          </div>
        )}
        {groups.map((group, index) => (
          <button
            className={`g900-group-button ${group.id === activeGroupId ? "is-selected" : ""}`}
            key={group.id}
            type="button"
            onClick={() => onSelect(group.id)}
          >
            <span className="g900-group-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="g900-group-copy">
              <strong>{group.title}</strong>
              <small>{group.level} · {group.count} Sätze</small>
            </span>
            <ChevronRight size={16} />
          </button>
        ))}
      </nav>

      <div className="g900-sidebar-foot">
        <p>Sorgfältig erstellt, um ein Studium und das Alltagsleben in Deutschland vorzubereiten.</p>
      </div>
    </aside>
  );
}

function SentenceRow({
  active,
  disabled,
  loadingKey,
  onPlayAll,
  onPlayGerman,
  rowRef,
  sentence,
  speakingKey,
}) {
  const germanKey = `${sentence.id}:de`;
  const allKey = `${sentence.id}:all`;
  const frenchKey = `${sentence.id}:fr`;
  const spanishKey = `${sentence.id}:es`;
  const isGermanActive = speakingKey === germanKey;
  const isAllActive =
    speakingKey === allKey || speakingKey === frenchKey || speakingKey === spanishKey;

  return (
    <article
      className={`g900-sentence ${active ? "is-current" : ""}`}
      ref={rowRef}
    >
      <div className="g900-sentence-index">
        <span>{String(sentence.number || sentence.groupNumber).padStart(3, "0")}</span>
        <small>{sentence.tag}</small>
      </div>
      <div className="g900-sentence-copy">
        <p className="g900-german" lang="de">{sentence.german}</p>
        <p className="g900-french" lang="fr">{sentence.french}</p>
        <p className="g900-spanish" lang="es">{sentence.spanish}</p>
      </div>
      <div className="g900-sentence-actions">
        <AudioButton
          active={isGermanActive}
          disabled={disabled}
          loading={loadingKey === germanKey}
          mode="german"
          onClick={() => onPlayGerman(sentence)}
          title="Deutsch anhören"
        />
        <AudioButton
          active={isAllActive}
          disabled={disabled}
          loading={
            loadingKey === allKey ||
            loadingKey === frenchKey ||
            loadingKey === spanishKey
          }
          mode="all"
          onClick={() => onPlayAll(sentence)}
          title="Deutsch, dann Französisch und Spanisch anhören"
        />
      </div>
    </article>
  );
}

export default function German900App() {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        (sentence.german || "").toLowerCase().includes(needle) ||
        (sentence.french || "").toLowerCase().includes(needle) ||
        (sentence.spanish || "").toLowerCase().includes(needle) ||
        (sentence.tag || "").toLowerCase().includes(needle)
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

          if (mode === "german") {
            await playClip({
              key: `${sentence.id}:de`,
              language: "de",
              sentenceId: sentence.id,
              text: sentence.german,
            });
          } else {
            // Mode "all": German → French → Spanish
            await playClip({
              key: `${sentence.id}:all`,
              language: "de",
              sentenceId: sentence.id,
              text: sentence.german,
            });
            if (queueRunRef.current !== runId) throw new Error("cancelled");
            await sleep(QUEUE_PAUSE_MS);
            await playClip({
              key: `${sentence.id}:fr`,
              language: "fr",
              sentenceId: sentence.id,
              text: sentence.french,
            });
            if (queueRunRef.current !== runId) throw new Error("cancelled");
            await sleep(QUEUE_PAUSE_MS);
            await playClip({
              key: `${sentence.id}:es`,
              language: "es",
              sentenceId: sentence.id,
              text: sentence.spanish,
            });
          }

          if (queueRunRef.current !== runId) throw new Error("cancelled");
          await sleep(QUEUE_PAUSE_MS);
        }
      } catch (err) {
        if (!isTtsCancelled(err) && err.message !== "cancelled") {
          setError(err.message || "Wiedergabe fehlgeschlagen.");
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
        label: queueState.label || "Wiedergabe läuft",
        mode: queueState.mode || "german",
        sentences,
        startIndex: index,
      });
    },
    [group, queueState, runQueue],
  );

  const playSentence = useCallback(
    (sentence, mode) => {
      runQueue({
        label:
          mode === "german"
            ? "Deutsch wird gelesen"
            : "Deutsch, dann Französisch und Spanisch",
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
        label:
          mode === "german"
            ? "Ganze Gruppe auf Deutsch"
            : "Dreisprachige Gruppe wird gelesen",
        mode,
        sentences,
      });
    },
    [group, runQueue],
  );

  const currentGroupIndex = (course?.groups || []).findIndex(
    (item) => item.id === activeGroupId,
  );
  const groupCount = group?.sentences?.length || 0;
  const visibleCount = filteredSentences.length;
  const busy = queueState.running;

  return (
    <div className="g900-shell">
      <Sidebar
        activeGroupId={activeGroupId}
        groups={course?.groups || []}
        loading={loadingCourse}
        onSelect={setActiveGroupId}
        totalSentences={course?.totalSentences}
      />

      <main className="g900-content">
        <section className="g900-hero">
          <div className="g900-hero-main">
            <div className="g900-kicker">
              <Sparkles size={16} />
              <span>Progressives Lernen · freihändiges Zuhören</span>
            </div>
            <h1>{group?.title || "German 900"}</h1>
            <p>
              {group?.focus ||
                course?.description ||
                "900 nützliche Sätze, um in Deutschland zu leben, zu studieren und zu diskutieren."}
            </p>
            <div className="g900-meta-row">
              <span>
                <BookOpen size={16} /> Niveau {group?.level || "A1–C1"}
              </span>
              <span>
                <Radio size={16} /> Gruppe {currentGroupIndex + 1 || 1} von {course?.groups?.length || 9}
              </span>
              <span>
                <Headphones size={16} /> {groupCount} Sätze
              </span>
            </div>
          </div>

          <div className="g900-player">
            <div className="g900-player-status">
              <span className={busy ? "is-live" : ""}>
                {busy ? queueState.label : "Bereit zum Üben"}
              </span>
              {(loadingKey || speakingKey) && (
                <small>
                  {loadingKey ? "Audio wird vorbereitet …" : "Wiedergabe läuft …"}
                </small>
              )}
            </div>
            <div className="g900-player-actions">
              <button
                className="g900-primary-button"
                type="button"
                onClick={() => playGroup("german")}
                disabled={loadingGroup || !groupCount}
              >
                <Play size={18} />
                <span>Gruppe anhören</span>
              </button>
              <button
                className="g900-secondary-button"
                type="button"
                onClick={() => playGroup("all")}
                disabled={loadingGroup || !groupCount}
              >
                <Headphones size={18} />
                <span>Alles anhören</span>
              </button>
              <button
                className="g900-stop-button"
                type="button"
                onClick={stopQueue}
                disabled={!busy && !speakingKey && !loadingKey}
                title="Wiedergabe stoppen"
              >
                {busy ? <Square size={17} /> : <Pause size={17} />}
              </button>
            </div>
          </div>
        </section>

        {(error || ttsError) && (
          <div className="g900-error" role="alert">
            {error || ttsError}
          </div>
        )}

        <section className="g900-toolbar">
          <label className="g900-search">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Suchen auf Deutsch, Französisch, Spanisch oder nach Thema"
            />
          </label>
          <NineHundredDataTools config={DATA_TOOL_CONFIG} onImport={handleImportGroup} />
          <span>{visibleCount} angezeigt</span>
        </section>

        <section className="g900-list" aria-label="Sätze der Gruppe">
          {loadingGroup ? (
            <div className="g900-loading-state">
              <Loader2 className="g900-spin" size={24} />
              <span>Sätze werden geladen …</span>
            </div>
          ) : (
            filteredSentences.map((sentence) => (
              <SentenceRow
                active={activeSentenceId === sentence.id}
                disabled={false}
                key={sentence.id}
                loadingKey={loadingKey}
                onPlayAll={(item) => playSentence(item, "all")}
                onPlayGerman={(item) => playSentence(item, "german")}
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
