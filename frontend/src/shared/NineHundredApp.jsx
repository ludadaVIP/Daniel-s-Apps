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
  Square,
  Volume2,
} from "lucide-react";

import { NineHundredDataTools } from "./NineHundredDataTools";
import { NineHundredProgressDock } from "./NineHundredProgressDock";
import { useActiveItemScroll } from "./useActiveItemScroll";
import { isTtsCancelled, useTts } from "./useTts";

const QUEUE_PAUSE_MS = 320;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function iconForMode(modeId, allModeId) {
  return modeId === allModeId ? <Headphones size={18} /> : <Volume2 size={18} />;
}

function modeButtonClass(config, modeId, active) {
  const classes = [`${config.prefix}-audio-button`];
  const modeClass = config.modeButtonClasses?.[modeId];
  if (modeClass) classes.push(modeClass);
  if (active) classes.push("is-active");
  return classes.join(" ");
}

function clipKey(sentenceId, step) {
  return `${sentenceId}:${step.keySuffix || step.language}`;
}

function AudioButton({ active, config, disabled, loading, mode, onClick, title }) {
  return (
    <button
      className={modeButtonClass(config, mode.id, active)}
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={title}
      title={title}
    >
      {loading ? (
        <Loader2 className={`${config.prefix}-spin`} size={18} />
      ) : (
        iconForMode(mode.id, config.allMode.id)
      )}
    </button>
  );
}

function Sidebar({ activeGroupId, config, groups, loading, onSelect, totalSentences }) {
  const p = config.prefix;
  const text = config.text;

  return (
    <aside className={`${p}-sidebar`}>
      <div className={`${p}-brand`}>
        <div className={`${p}-brand-mark`}>900</div>
        <div>
          <p>{config.appName}</p>
          <span>{config.brandSubtitle}</span>
        </div>
      </div>

      <div className={`${p}-sidebar-panel`}>
        <div className={`${p}-stat`}>
          <strong>{totalSentences || 900}</strong>
          <span>{text.sentenceUnitPlural}</span>
        </div>
        <div className={`${p}-stat`}>
          <strong>{groups.length || 9}</strong>
          <span>{text.groupUnitPlural}</span>
        </div>
      </div>

      <nav className={`${p}-group-nav`} aria-label={text.groupNavLabel}>
        {loading && (
          <div className={`${p}-loading-nav`}>
            <Loader2 className={`${p}-spin`} size={18} />
            <span>{text.loadingGroups}</span>
          </div>
        )}
        {groups.map((group, index) => (
          <button
            className={`${p}-group-button ${group.id === activeGroupId ? "is-selected" : ""}`}
            key={group.id}
            type="button"
            onClick={() => onSelect(group.id)}
          >
            <span className={`${p}-group-number`}>{String(index + 1).padStart(2, "0")}</span>
            <span className={`${p}-group-copy`}>
              <strong>{group.title}</strong>
              <small>
                {group.level} · {group.count} {text.sentenceUnitPlural}
              </small>
            </span>
            <ChevronRight size={16} />
          </button>
        ))}
      </nav>

      {config.sidebarFoot && (
        <div className={`${p}-sidebar-foot`}>
          <p>{config.sidebarFoot}</p>
        </div>
      )}
    </aside>
  );
}

function SentenceRow({
  active,
  config,
  disabled,
  loadingKey,
  onPlayAll,
  onPlayPrimary,
  rowRef,
  sentence,
  speakingKey,
}) {
  const p = config.prefix;
  const primaryStep = config.primaryMode.steps[0];
  const primaryKey = clipKey(sentence.id, primaryStep);
  const allKeys = config.allMode.steps.map((step) => clipKey(sentence.id, step));
  const isPrimaryActive = speakingKey === primaryKey;
  const isAllActive = allKeys.includes(speakingKey);
  const isAllLoading = allKeys.includes(loadingKey);
  const number = sentence.number || sentence.groupNumber;
  const displayNumber = config.sentenceNumberPad
    ? String(number).padStart(config.sentenceNumberPad, "0")
    : number;

  return (
    <article className={`${p}-sentence ${active ? "is-current" : ""}`} ref={rowRef}>
      <div className={`${p}-sentence-index`}>
        <span>{displayNumber}</span>
        <small>{sentence.tag}</small>
      </div>
      <div className={`${p}-sentence-copy`}>
        {config.sentenceFields.map((field) => (
          <p className={field.className} lang={field.lang} key={field.key}>
            {sentence[field.key]}
          </p>
        ))}
      </div>
      <div className={`${p}-sentence-actions`}>
        <AudioButton
          active={isPrimaryActive}
          config={config}
          disabled={disabled}
          loading={loadingKey === primaryKey}
          mode={config.primaryMode}
          onClick={() => onPlayPrimary(sentence)}
          title={config.text.primarySentenceTitle}
        />
        <AudioButton
          active={isAllActive}
          config={config}
          disabled={disabled}
          loading={isAllLoading}
          mode={config.allMode}
          onClick={() => onPlayAll(sentence)}
          title={config.text.allSentenceTitle}
        />
      </div>
    </article>
  );
}

export function NineHundredApp({ api, config }) {
  const p = config.prefix;
  const text = config.text;
  const [course, setCourse] = useState(null);
  const [activeGroupId, setActiveGroupId] = useState(() => {
    try {
      return localStorage.getItem(config.storageKey) || "group-1";
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
    api.fetchGroups()
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
  }, [api, activeGroupId]);

  useEffect(() => {
    let alive = true;
    queueRunRef.current += 1;
    stop();
    setQueueState({ running: false, label: "", mode: "", sentences: [], currentIndex: 0 });
    setActiveSentenceId("");
    setLoadingGroup(true);
    api.fetchGroup(activeGroupId)
      .then((data) => {
        if (!alive) return;
        setGroup(data);
        try {
          localStorage.setItem(config.storageKey, activeGroupId);
        } catch {
          /* ignore */
        }
      })
      .catch((err) => alive && setError(err.message))
      .finally(() => alive && setLoadingGroup(false));
    return () => {
      alive = false;
    };
  }, [api, activeGroupId, config.storageKey, stop]);

  const searchableFields = useMemo(
    () => config.searchFields || config.sentenceFields.map((field) => field.key),
    [config.searchFields, config.sentenceFields],
  );
  const filteredSentences = useMemo(() => {
    const sentences = group?.sentences || [];
    const needle = query.trim().toLowerCase();
    if (!needle) return sentences;
    return sentences.filter((sentence) =>
      [...searchableFields, "tag"].some((field) =>
        String(sentence[field] || "").toLowerCase().includes(needle),
      ),
    );
  }, [group, query, searchableFields]);

  const stopQueue = useCallback(() => {
    queueRunRef.current += 1;
    stop();
    setQueueState({ running: false, label: "", mode: "", sentences: [], currentIndex: 0 });
    setActiveSentenceId("");
  }, [stop]);

  const handleImportGroup = useCallback(
    async (content) => {
      const result = await api.importGroup(content);
      const nextCourse = await api.fetchGroups();
      setCourse(nextCourse);
      setActiveGroupId(result.group.id);
      return result;
    },
    [api],
  );

  const handleDeleteGroup = useCallback(async () => {
    const currentGroups = course?.groups || [];
    const currentIndex = currentGroups.findIndex((item) => item.id === activeGroupId);
    const fallbackGroup =
      currentGroups[currentIndex + 1] || currentGroups[currentIndex - 1] || currentGroups[0];
    stopQueue();
    const result = await api.deleteGroup(activeGroupId);
    const nextCourse = await api.fetchGroups();
    setCourse(nextCourse);
    const nextGroupId =
      nextCourse.groups.find((item) => item.id === fallbackGroup?.id)?.id ||
      nextCourse.groups[0]?.id ||
      "";
    if (nextGroupId) setActiveGroupId(nextGroupId);
    return result;
  }, [activeGroupId, api, course?.groups, stopQueue]);

  const playClip = useCallback(
    async ({ key, language, sentenceId, text: clipText }) => {
      setActiveSentenceId(sentenceId);
      await play({
        key,
        waitForEnd: true,
        getUrl: async () => {
          const data = await api.requestTts({ text: clipText, language });
          return { url: data.audio_url };
        },
      });
    },
    [api, play],
  );

  const runQueue = useCallback(
    async ({ label, mode, sentences, startIndex = 0 }) => {
      const playbackMode = mode === config.allMode.id ? config.allMode : config.primaryMode;
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

          for (const step of playbackMode.steps) {
            if (queueRunRef.current !== runId) throw new Error("cancelled");
            await playClip({
              key: clipKey(sentence.id, step),
              language: step.language,
              sentenceId: sentence.id,
              text: sentence[step.field],
            });
            if (queueRunRef.current !== runId) throw new Error("cancelled");
            await sleep(QUEUE_PAUSE_MS);
          }
        }
      } catch (err) {
        if (!isTtsCancelled(err) && err.message !== "cancelled") {
          setError(err.message || text.playbackError);
        }
      } finally {
        if (queueRunRef.current === runId) {
          setQueueState({ running: false, label: "", mode: "", sentences: [], currentIndex: 0 });
          setActiveSentenceId("");
        }
      }
    },
    [config.allMode, config.primaryMode, playClip, stop, text.playbackError],
  );

  const seekQueue = useCallback(
    (index) => {
      const sentences = queueState.sentences.length ? queueState.sentences : group?.sentences || [];
      if (!sentences.length) return;
      runQueue({
        label: queueState.label || text.playingQueue,
        mode: queueState.mode || config.primaryMode.id,
        sentences,
        startIndex: index,
      });
    },
    [config.primaryMode.id, group, queueState, runQueue, text.playingQueue],
  );

  const playSentence = useCallback(
    (sentence, mode) => {
      runQueue({
        label: mode === config.primaryMode.id ? text.playingPrimary : text.playingAll,
        mode,
        sentences: [sentence],
      });
    },
    [config.primaryMode.id, runQueue, text.playingAll, text.playingPrimary],
  );

  const playGroup = useCallback(
    (mode) => {
      const sentences = group?.sentences || [];
      if (!sentences.length) return;
      runQueue({
        label: mode === config.primaryMode.id ? text.playingGroupPrimary : text.playingGroupAll,
        mode,
        sentences,
      });
    },
    [config.primaryMode.id, group, runQueue, text.playingGroupAll, text.playingGroupPrimary],
  );

  const currentGroupIndex = (course?.groups || []).findIndex((item) => item.id === activeGroupId);
  const groupCount = group?.sentences?.length || 0;
  const visibleCount = filteredSentences.length;
  const busy = queueState.running;

  return (
    <div className={`${p}-shell`}>
      <Sidebar
        activeGroupId={activeGroupId}
        config={config}
        groups={course?.groups || []}
        loading={loadingCourse}
        onSelect={setActiveGroupId}
        totalSentences={course?.totalSentences}
      />

      <main className={`${p}-content`}>
        <section className={`${p}-hero is-compact`} style={{ marginBottom: "10px", gap: "12px" }}>
          <div className={`${p}-hero-main`} style={{ padding: "10px 14px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "10px",
                flexWrap: "wrap",
                rowGap: "4px",
              }}
            >
              <h1 style={{ margin: 0, fontSize: "17px", fontWeight: 800, lineHeight: 1.2 }}>
                {group?.title || config.appName}
              </h1>
              <div
                className={`${p}-meta-row`}
                style={{
                  display: "inline-flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  margin: 0,
                  fontSize: "11px",
                }}
              >
                <span style={{ minHeight: 0, padding: "2px 8px", fontSize: "11px" }}>
                  <BookOpen size={12} /> {text.levelPrefix || ""}
                  {group?.level || config.defaultLevel}
                </span>
                <span style={{ minHeight: 0, padding: "2px 8px", fontSize: "11px" }}>
                  <Radio size={12} /> {text.groupLabel} {currentGroupIndex + 1 || 1}{" "}
                  {text.groupOf} {course?.groups?.length || 9}
                </span>
                <span style={{ minHeight: 0, padding: "2px 8px", fontSize: "11px" }}>
                  <Headphones size={12} /> {groupCount} {text.sentenceUnitPlural}
                </span>
              </div>
            </div>
            {(group?.focus || course?.description) && (
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "12px",
                  lineHeight: 1.4,
                  maxWidth: "100%",
                }}
              >
                {group?.focus || course?.description}
              </p>
            )}
          </div>

          <div className={`${p}-player`} style={{ padding: "10px 14px", gap: "8px" }}>
            <div className={`${p}-player-status`}>
              <span className={busy ? "is-live" : ""}>{busy ? queueState.label : text.ready}</span>
              {(loadingKey || speakingKey) && (
                <small>{loadingKey ? text.preparingAudio : text.audioPlaying}</small>
              )}
            </div>
            <div className={`${p}-player-actions`}>
              <button
                className={`${p}-primary-button`}
                type="button"
                onClick={() => playGroup(config.primaryMode.id)}
                disabled={loadingGroup || !groupCount}
              >
                <Play size={18} />
                <span>{text.primaryButton}</span>
              </button>
              <button
                className={`${p}-secondary-button`}
                type="button"
                onClick={() => playGroup(config.allMode.id)}
                disabled={loadingGroup || !groupCount}
              >
                <Headphones size={18} />
                <span>{text.allButton}</span>
              </button>
              <button
                className={`${p}-stop-button`}
                type="button"
                onClick={stopQueue}
                disabled={!busy && !speakingKey && !loadingKey}
                title={text.stopTitle}
              >
                {busy ? <Square size={17} /> : <Pause size={17} />}
              </button>
            </div>
          </div>
        </section>

        {(error || ttsError) && (
          <div className={`${p}-error`} role="alert">
            {error || ttsError}
          </div>
        )}

        <section className={`${p}-toolbar`}>
          <label className={`${p}-search`}>
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={text.searchPlaceholder}
            />
          </label>
          <NineHundredDataTools
            config={config.dataTools}
            currentGroupTitle={group?.title}
            deleteDisabled={(course?.groups || []).length <= 1}
            onDelete={handleDeleteGroup}
            onImport={handleImportGroup}
          />
          <span>
            {visibleCount} {text.shownLabel}
          </span>
        </section>

        <section className={`${p}-list`} aria-label={text.listLabel}>
          {loadingGroup ? (
            <div className={`${p}-loading-state`}>
              <Loader2 className={`${p}-spin`} size={24} />
              <span>{text.loadingSentences}</span>
            </div>
          ) : (
            filteredSentences.map((sentence) => (
              <SentenceRow
                active={activeSentenceId === sentence.id}
                config={config}
                disabled={false}
                key={sentence.id}
                loadingKey={loadingKey}
                onPlayAll={(item) => playSentence(item, config.allMode.id)}
                onPlayPrimary={(item) => playSentence(item, config.primaryMode.id)}
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
