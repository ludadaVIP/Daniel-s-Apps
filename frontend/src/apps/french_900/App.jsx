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

const STORAGE_KEY = "french-900:last-group";
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
      className={`f900-audio-button ${mode === "all" ? "is-mode-all" : "is-mode-fr"} ${active ? "is-active" : ""}`}
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={title}
      title={title}
    >
      {loading ? <Loader2 className="f900-spin" size={18} /> : iconForMode(mode)}
    </button>
  );
}

function Sidebar({ activeGroupId, groups, loading, onSelect }) {
  return (
    <aside className="f900-sidebar">
      <div className="f900-brand">
        <div className="f900-brand-mark">900</div>
        <div>
          <p>French 900</p>
          <span>Français parlé · français-espagnol</span>
        </div>
      </div>

      <div className="f900-sidebar-panel">
        <div className="f900-stat">
          <strong>900</strong>
          <span>phrases</span>
        </div>
        <div className="f900-stat">
          <strong>9</strong>
          <span>groupes</span>
        </div>
      </div>

      <nav className="f900-group-nav" aria-label="Groupes French 900">
        {loading && (
          <div className="f900-loading-nav">
            <Loader2 className="f900-spin" size={18} />
            <span>Chargement des groupes</span>
          </div>
        )}
        {groups.map((group, index) => (
          <button
            className={`f900-group-button ${group.id === activeGroupId ? "is-selected" : ""}`}
            key={group.id}
            type="button"
            onClick={() => onSelect(group.id)}
          >
            <span className="f900-group-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="f900-group-copy">
              <strong>{group.title}</strong>
              <small>{group.level} · {group.count} phrases</small>
            </span>
            <ChevronRight size={16} />
          </button>
        ))}
      </nav>

      <div className="f900-sidebar-foot">
        <p>Édité avec soin pour préparer un séjour d'études et la vie quotidienne en France.</p>
      </div>
    </aside>
  );
}

function SentenceRow({
  active,
  disabled,
  loadingKey,
  onPlayAll,
  onPlayFrench,
  sentence,
  speakingKey,
}) {
  const frenchKey = `${sentence.id}:fr`;
  const allKey = `${sentence.id}:all`;
  const spanishKey = `${sentence.id}:es`;
  const isFrenchActive = speakingKey === frenchKey;
  const isAllActive = speakingKey === allKey || speakingKey === spanishKey;

  return (
    <article className={`f900-sentence ${active ? "is-current" : ""}`}>
      <div className="f900-sentence-index">
        <span>{String(sentence.number || sentence.groupNumber).padStart(3, "0")}</span>
        <small>{sentence.tag}</small>
      </div>
      <div className="f900-sentence-copy">
        <p className="f900-french" lang="fr">{sentence.french}</p>
        <p className="f900-spanish" lang="es">{sentence.spanish}</p>
      </div>
      <div className="f900-sentence-actions">
        <AudioButton
          active={isFrenchActive}
          disabled={disabled}
          loading={loadingKey === frenchKey}
          mode="french"
          onClick={() => onPlayFrench(sentence)}
          title="Écouter le français"
        />
        <AudioButton
          active={isAllActive}
          disabled={disabled}
          loading={loadingKey === allKey || loadingKey === spanishKey}
          mode="all"
          onClick={() => onPlayAll(sentence)}
          title="Écouter français puis espagnol"
        />
      </div>
    </article>
  );
}

export default function French900App() {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        (sentence.french || "").toLowerCase().includes(needle) ||
        (sentence.spanish || "").toLowerCase().includes(needle) ||
        (sentence.tag || "").toLowerCase().includes(needle)
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

          if (mode === "french") {
            await playClip({
              key: `${sentence.id}:fr`,
              language: "fr",
              sentenceId: sentence.id,
              text: sentence.french,
            });
          } else {
            await playClip({
              key: `${sentence.id}:all`,
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
          setError(err.message || "La lecture a échoué.");
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
        label: mode === "french" ? "Lecture du français" : "Lecture français puis espagnol",
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
          mode === "french"
            ? "Lecture du groupe en français"
            : "Lecture bilingue du groupe complet",
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
    <div className="f900-shell">
      <Sidebar
        activeGroupId={activeGroupId}
        groups={course?.groups || []}
        loading={loadingCourse}
        onSelect={setActiveGroupId}
      />

      <main className="f900-content">
        <section className="f900-hero">
          <div className="f900-hero-main">
            <div className="f900-kicker">
              <Sparkles size={16} />
              <span>Apprentissage progressif · écoute mains libres</span>
            </div>
            <h1>{group?.title || "French 900"}</h1>
            <p>
              {group?.focus ||
                course?.description ||
                "900 phrases utiles pour vivre, étudier et débattre en français."}
            </p>
            <div className="f900-meta-row">
              <span>
                <BookOpen size={16} /> Niveau {group?.level || "A1–C1"}
              </span>
              <span>
                <Radio size={16} /> Groupe {currentGroupIndex + 1 || 1} sur 9
              </span>
              <span>
                <Headphones size={16} /> {groupCount} phrases
              </span>
            </div>
          </div>

          <div className="f900-player">
            <div className="f900-player-status">
              <span className={busy ? "is-live" : ""}>
                {busy ? queueState.label : "Prêt à pratiquer"}
              </span>
              {(loadingKey || speakingKey) && (
                <small>
                  {loadingKey ? "Préparation de l'audio…" : "Lecture en cours…"}
                </small>
              )}
            </div>
            <div className="f900-player-actions">
              <button
                className="f900-primary-button"
                type="button"
                onClick={() => playGroup("french")}
                disabled={loadingGroup || !groupCount}
              >
                <Play size={18} />
                <span>Écouter le groupe</span>
              </button>
              <button
                className="f900-secondary-button"
                type="button"
                onClick={() => playGroup("all")}
                disabled={loadingGroup || !groupCount}
              >
                <Headphones size={18} />
                <span>Tout écouter</span>
              </button>
              <button
                className="f900-stop-button"
                type="button"
                onClick={stopQueue}
                disabled={!busy && !speakingKey && !loadingKey}
                title="Arrêter la lecture"
              >
                {busy ? <Square size={17} /> : <Pause size={17} />}
              </button>
            </div>
          </div>
        </section>

        {(error || ttsError) && (
          <div className="f900-error" role="alert">
            {error || ttsError}
          </div>
        )}

        <section className="f900-toolbar">
          <label className="f900-search">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher en français, en espagnol ou par thème"
            />
          </label>
          <span>{visibleCount} affichées</span>
        </section>

        <section className="f900-list" aria-label="Phrases du groupe">
          {loadingGroup ? (
            <div className="f900-loading-state">
              <Loader2 className="f900-spin" size={24} />
              <span>Chargement des phrases…</span>
            </div>
          ) : (
            filteredSentences.map((sentence) => (
              <SentenceRow
                active={activeSentenceId === sentence.id}
                disabled={false}
                key={sentence.id}
                loadingKey={loadingKey}
                onPlayAll={(item) => playSentence(item, "all")}
                onPlayFrench={(item) => playSentence(item, "french")}
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
