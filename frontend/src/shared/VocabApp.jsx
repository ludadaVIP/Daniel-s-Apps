import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  ChevronRight,
  Headphones,
  Layers,
  Loader2,
  Pause,
  Play,
  Search,
  Sparkles,
  Square,
  Volume2,
} from "lucide-react";

import { useActiveItemScroll } from "./useActiveItemScroll";
import { isTtsCancelled, useTts } from "./useTts";

const QUEUE_PAUSE_MS = 260;

const DEFAULT_TEXT = {
  brandSubtitle: "Vocabulary trainer",
  loadingLevels: "Loading levels…",
  loadingGroup: "Loading words…",
  ready: "Ready to study",
  preparingAudio: "Preparing audio…",
  audioPlaying: "Audio playing…",
  searchPlaceholder: "Search lemma, translation, tag…",
  shownLabel: "shown",
  primaryButton: "Play group (target only)",
  allButton: "Play group (target + English)",
  stopTitle: "Stop playback",
  primarySentenceTitle: "Speak the word",
  allSentenceTitle: "Speak word + translation + example",
  playSectionTarget: "Play this section",
  playSectionAll: "Play this section with English",
  groupLabel: "Group",
  groupOf: "of",
  groupsUnit: "groups",
  wordsUnit: "words",
  noWords: "No words yet — drop more JSON files in the data folder to fill this group.",
  fallbackDescription: "Pick a level, then a group, then practice each word with sound.",
  groupTitleFallback: "Group",
  posLabel: {
    noun: "Nouns",
    verb: "Verbs",
    adj: "Adjectives",
    adv: "Adverbs",
    phrase: "Phrases",
    other: "Other",
  },
  posPlural: {
    noun: "nouns",
    verb: "verbs",
    adj: "adjectives",
    adv: "adverbs",
    phrase: "phrases",
    other: "items",
  },
  examplePrefix: "ej.",
  playbackError: "Playback failed.",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mergeText(...layers) {
  const out = { ...DEFAULT_TEXT };
  for (const layer of layers) {
    if (!layer) continue;
    for (const [k, v] of Object.entries(layer)) {
      if (v && typeof v === "object" && !Array.isArray(v)) {
        out[k] = { ...(out[k] || {}), ...v };
      } else if (v !== undefined) {
        out[k] = v;
      }
    }
  }
  return out;
}

function classes(...parts) {
  return parts.filter(Boolean).join(" ");
}

function AudioButton({ prefix, active, disabled, loading, mode, onClick, title, size = 38 }) {
  const Icon = mode === "all" ? Headphones : Volume2;
  return (
    <button
      className={classes(
        `${prefix}-audio-button`,
        mode === "all" ? "is-mode-all" : "is-mode-primary",
        active && "is-active",
      )}
      style={{ width: size, height: size }}
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={title}
      title={title}
    >
      {loading ? <Loader2 className={`${prefix}-spin`} size={Math.round(size * 0.45)} /> : <Icon size={Math.round(size * 0.45)} />}
    </button>
  );
}

function Sidebar({
  prefix,
  brandTitle,
  brandSubtitle,
  levels,
  loading,
  activeLevelId,
  activeGroupId,
  expandedLevelId,
  onLevelToggle,
  onSelectGroup,
  text,
}) {
  return (
    <aside className={`${prefix}-sidebar`}>
      <div className={`${prefix}-brand`}>
        <div className={`${prefix}-brand-mark`}>A→C</div>
        <div>
          <p>{brandTitle}</p>
          <span>{brandSubtitle}</span>
        </div>
      </div>

      <nav className={`${prefix}-level-nav`} aria-label={brandTitle}>
        {loading && (
          <div className={`${prefix}-loading-nav`}>
            <Loader2 className={`${prefix}-spin`} size={16} />
            <span>{text.loadingLevels}</span>
          </div>
        )}
        {levels.map((level) => {
          const open = expandedLevelId === level.id;
          const isActiveLevel = activeLevelId === level.id;
          return (
            <div key={level.id} className={`${prefix}-level-block ${isActiveLevel ? "is-active" : ""}`}>
              <button
                className={`${prefix}-level-button`}
                type="button"
                onClick={() => onLevelToggle(level.id)}
              >
                <span className={`${prefix}-level-chip`}>{(level.id || "?").toUpperCase()}</span>
                <span className={`${prefix}-level-copy`}>
                  <strong>{level.title}</strong>
                  <small>
                    {level.groupCount || 0} {text.groupsUnit} · {level.wordCount || 0} {text.wordsUnit}
                    {level.placeholder ? " · (来填充)" : ""}
                  </small>
                </span>
                <ChevronRight
                  size={16}
                  className={open ? "is-open" : ""}
                />
              </button>
              {open && (
                <div className={`${prefix}-group-list`}>
                  {(level.groups || []).length === 0 && (
                    <div className={`${prefix}-group-empty`}>
                      还没有词组，往 levels/{level.id} 文件夹里加 group-N.json 就行。
                    </div>
                  )}
                  {(level.groups || []).map((group, gi) => (
                    <button
                      key={group.id}
                      type="button"
                      className={classes(
                        `${prefix}-group-button`,
                        isActiveLevel && activeGroupId === group.id && "is-selected",
                      )}
                      onClick={() => onSelectGroup(level.id, group.id)}
                    >
                      <span className={`${prefix}-group-number`}>{String(gi + 1).padStart(2, "0")}</span>
                      <span className={`${prefix}-group-copy`}>
                        <strong>{group.title}</strong>
                        <small>{group.count || 0} {text.wordsUnit}</small>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function WordCard({
  prefix,
  word,
  active,
  rowRef,
  loadingKey,
  speakingKey,
  onPlayPrimary,
  onPlayAll,
  text,
  config,
}) {
  const primaryKey = `${word.id}:primary`;
  const allKey = `${word.id}:all`;
  const translationKey = `${word.id}:translation`;
  const exampleKey = `${word.id}:example`;

  const primaryActive = speakingKey === primaryKey;
  const allActive =
    speakingKey === allKey ||
    speakingKey === translationKey ||
    speakingKey === exampleKey;

  return (
    <article
      className={classes(`${prefix}-word-card`, active && "is-current")}
      ref={rowRef}
    >
      <div className={`${prefix}-word-main`}>
        <div className={`${prefix}-word-head`}>
          <h3 className={`${prefix}-word-lemma`} lang={config.targetLang}>{word.lemma}</h3>
          {word.gender && <span className={`${prefix}-word-gender`}>{word.gender}</span>}
          {word.ipa && <span className={`${prefix}-word-ipa`}>/{word.ipa}/</span>}
          {word.tag && <span className={`${prefix}-word-tag`}>{word.tag}</span>}
        </div>
        <p className={`${prefix}-word-translation`} lang="en">{word.translation_en}</p>
        {word.example && (
          <p className={`${prefix}-word-example`}>
            <span className={`${prefix}-word-example-prefix`}>{text.examplePrefix}</span>
            <span className={`${prefix}-word-example-target`} lang={config.targetLang}>{word.example}</span>
            {word.example_en && (
              <span className={`${prefix}-word-example-en`} lang="en">— {word.example_en}</span>
            )}
          </p>
        )}
      </div>
      <div className={`${prefix}-word-actions`}>
        <AudioButton
          prefix={prefix}
          active={primaryActive}
          loading={loadingKey === primaryKey}
          mode="primary"
          onClick={() => onPlayPrimary(word)}
          title={text.primarySentenceTitle}
        />
        <AudioButton
          prefix={prefix}
          active={allActive}
          loading={
            loadingKey === allKey ||
            loadingKey === translationKey ||
            loadingKey === exampleKey
          }
          mode="all"
          onClick={() => onPlayAll(word)}
          title={text.allSentenceTitle}
        />
      </div>
    </article>
  );
}

function Section({
  prefix,
  section,
  text,
  config,
  loadingKey,
  speakingKey,
  activeWordId,
  setWordRef,
  onPlayPrimary,
  onPlayAll,
  onPlaySectionPrimary,
  onPlaySectionAll,
}) {
  const label = text.posLabel[section.pos] || section.pos;
  const plural = text.posPlural[section.pos] || section.pos;
  return (
    <section className={`${prefix}-section`} data-pos={section.pos}>
      <header className={`${prefix}-section-head`}>
        <div className={`${prefix}-section-title`}>
          <Layers size={16} />
          <h2>{label}</h2>
          <span>{section.count} {plural}</span>
        </div>
        <div className={`${prefix}-section-actions`}>
          <button
            type="button"
            className={`${prefix}-section-button is-mode-primary`}
            onClick={() => onPlaySectionPrimary(section)}
          >
            <Play size={14} />
            <span>{text.playSectionTarget}</span>
          </button>
          <button
            type="button"
            className={`${prefix}-section-button is-mode-all`}
            onClick={() => onPlaySectionAll(section)}
          >
            <Headphones size={14} />
            <span>{text.playSectionAll}</span>
          </button>
        </div>
      </header>

      <div className={`${prefix}-section-cards`}>
        {section.words.map((word) => (
          <WordCard
            key={word.id}
            prefix={prefix}
            word={word}
            active={activeWordId === word.id}
            rowRef={(node) => setWordRef(word.id, node)}
            loadingKey={loadingKey}
            speakingKey={speakingKey}
            onPlayPrimary={onPlayPrimary}
            onPlayAll={onPlayAll}
            text={text}
            config={config}
          />
        ))}
      </div>
    </section>
  );
}

export function VocabApp({ api, config }) {
  const prefix = config.prefix;
  const text = useMemo(() => mergeText(config.text), [config.text]);
  const storageKey = config.storageKey;

  const [course, setCourse] = useState(null);
  const [levelsError, setLevelsError] = useState("");
  const [loadingCourse, setLoadingCourse] = useState(true);

  const [activeLevelId, setActiveLevelId] = useState("");
  const [activeGroupId, setActiveGroupId] = useState("");
  const [expandedLevelId, setExpandedLevelId] = useState("");

  const [group, setGroup] = useState(null);
  const [loadingGroup, setLoadingGroup] = useState(false);
  const [groupError, setGroupError] = useState("");
  const [query, setQuery] = useState("");

  const [queueState, setQueueState] = useState({ running: false, label: "" });
  const [activeWordId, setActiveWordId] = useState("");
  const queueRunRef = useRef(0);

  const setWordRef = useActiveItemScroll(activeWordId);
  const { play, stop, speakingKey, loadingKey, error: ttsError } = useTts();

  // Restore last-visited level/group from localStorage.
  useEffect(() => {
    let alive = true;
    setLoadingCourse(true);
    api
      .fetchLevels()
      .then((data) => {
        if (!alive) return;
        setCourse(data);
        let restored = { levelId: "", groupId: "" };
        try {
          const raw = localStorage.getItem(storageKey);
          if (raw) restored = JSON.parse(raw);
        } catch {
          /* ignore */
        }
        const levels = data.levels || [];
        const pick =
          levels.find((l) => l.id === restored.levelId) ||
          levels.find((l) => (l.groups || []).length > 0) ||
          levels[0];
        if (!pick) return;
        setActiveLevelId(pick.id);
        setExpandedLevelId(pick.id);
        const groups = pick.groups || [];
        const groupPick =
          groups.find((g) => g.id === restored.groupId) || groups[0];
        if (groupPick) setActiveGroupId(groupPick.id);
      })
      .catch((err) => alive && setLevelsError(err.message))
      .finally(() => alive && setLoadingCourse(false));
    return () => {
      alive = false;
    };
  }, [api, storageKey]);

  // Load the active group whenever the selection changes.
  useEffect(() => {
    if (!activeLevelId || !activeGroupId) {
      setGroup(null);
      return;
    }
    let alive = true;
    queueRunRef.current += 1;
    stop();
    setQueueState({ running: false, label: "" });
    setActiveWordId("");
    setLoadingGroup(true);
    setGroupError("");
    api
      .fetchGroup(activeLevelId, activeGroupId)
      .then((data) => {
        if (!alive) return;
        setGroup(data);
        try {
          localStorage.setItem(
            storageKey,
            JSON.stringify({ levelId: activeLevelId, groupId: activeGroupId }),
          );
        } catch {
          /* ignore */
        }
      })
      .catch((err) => alive && setGroupError(err.message))
      .finally(() => alive && setLoadingGroup(false));
    return () => {
      alive = false;
    };
  }, [api, activeLevelId, activeGroupId, stop, storageKey]);

  const sections = useMemo(() => group?.sections || [], [group]);

  const filteredSections = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return sections;
    return sections
      .map((section) => ({
        ...section,
        words: section.words.filter((word) => {
          return (
            (word.lemma || "").toLowerCase().includes(needle) ||
            (word.translation_en || "").toLowerCase().includes(needle) ||
            (word.tag || "").toLowerCase().includes(needle) ||
            (word.example || "").toLowerCase().includes(needle)
          );
        }),
      }))
      .filter((section) => section.words.length > 0);
  }, [sections, query]);

  const visibleWordCount = useMemo(
    () => filteredSections.reduce((sum, s) => sum + s.words.length, 0),
    [filteredSections],
  );

  const stopQueue = useCallback(() => {
    queueRunRef.current += 1;
    stop();
    setQueueState({ running: false, label: "" });
    setActiveWordId("");
  }, [stop]);

  const playClip = useCallback(
    async ({ key, language, sentenceId, text: clipText }) => {
      if (!clipText) return;
      setActiveWordId(sentenceId);
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
    async ({ label, mode, words }) => {
      const runId = queueRunRef.current + 1;
      queueRunRef.current = runId;
      setGroupError("");
      setQueueState({ running: true, label });

      try {
        for (const word of words) {
          if (queueRunRef.current !== runId) throw new Error("cancelled");

          if (mode === "primary") {
            await playClip({
              key: `${word.id}:primary`,
              language: config.targetLang,
              sentenceId: word.id,
              text: word.lemma,
            });
            if (word.example) {
              if (queueRunRef.current !== runId) throw new Error("cancelled");
              await sleep(QUEUE_PAUSE_MS);
              await playClip({
                key: `${word.id}:example`,
                language: config.targetLang,
                sentenceId: word.id,
                text: word.example,
              });
            }
          } else {
            // "all": lemma → translation → example
            await playClip({
              key: `${word.id}:all`,
              language: config.targetLang,
              sentenceId: word.id,
              text: word.lemma,
            });
            if (word.translation_en) {
              if (queueRunRef.current !== runId) throw new Error("cancelled");
              await sleep(QUEUE_PAUSE_MS);
              await playClip({
                key: `${word.id}:translation`,
                language: "en",
                sentenceId: word.id,
                text: word.translation_en,
              });
            }
            if (word.example) {
              if (queueRunRef.current !== runId) throw new Error("cancelled");
              await sleep(QUEUE_PAUSE_MS);
              await playClip({
                key: `${word.id}:example`,
                language: config.targetLang,
                sentenceId: word.id,
                text: word.example,
              });
            }
          }

          if (queueRunRef.current !== runId) throw new Error("cancelled");
          await sleep(QUEUE_PAUSE_MS);
        }
      } catch (err) {
        if (!isTtsCancelled(err) && err.message !== "cancelled") {
          setGroupError(err.message || text.playbackError);
        }
      } finally {
        if (queueRunRef.current === runId) {
          setQueueState({ running: false, label: "" });
          setActiveWordId("");
        }
      }
    },
    [playClip, config.targetLang, text.playbackError],
  );

  const playWordPrimary = useCallback(
    (word) => runQueue({ label: text.primaryButton, mode: "primary", words: [word] }),
    [runQueue, text.primaryButton],
  );
  const playWordAll = useCallback(
    (word) => runQueue({ label: text.allButton, mode: "all", words: [word] }),
    [runQueue, text.allButton],
  );
  const playSectionPrimary = useCallback(
    (section) =>
      runQueue({
        label: `${text.playSectionTarget} · ${text.posLabel[section.pos] || section.pos}`,
        mode: "primary",
        words: section.words,
      }),
    [runQueue, text.playSectionTarget, text.posLabel],
  );
  const playSectionAll = useCallback(
    (section) =>
      runQueue({
        label: `${text.playSectionAll} · ${text.posLabel[section.pos] || section.pos}`,
        mode: "all",
        words: section.words,
      }),
    [runQueue, text.playSectionAll, text.posLabel],
  );
  const playGroupPrimary = useCallback(() => {
    const words = filteredSections.flatMap((s) => s.words);
    if (words.length) runQueue({ label: text.primaryButton, mode: "primary", words });
  }, [filteredSections, runQueue, text.primaryButton]);
  const playGroupAll = useCallback(() => {
    const words = filteredSections.flatMap((s) => s.words);
    if (words.length) runQueue({ label: text.allButton, mode: "all", words });
  }, [filteredSections, runQueue, text.allButton]);

  const levels = course?.levels || [];
  const currentLevel = levels.find((l) => l.id === activeLevelId);
  const currentGroupSummary = (currentLevel?.groups || []).find((g) => g.id === activeGroupId);
  const totalGroupsInLevel = (currentLevel?.groups || []).length;
  const currentGroupIndex = (currentLevel?.groups || []).findIndex((g) => g.id === activeGroupId);
  const busy = queueState.running;

  return (
    <div className={`${prefix}-shell`}>
      <Sidebar
        prefix={prefix}
        brandTitle={config.appName}
        brandSubtitle={config.brandSubtitle || text.brandSubtitle}
        levels={levels}
        loading={loadingCourse}
        activeLevelId={activeLevelId}
        activeGroupId={activeGroupId}
        expandedLevelId={expandedLevelId}
        onLevelToggle={(id) => setExpandedLevelId((prev) => (prev === id ? "" : id))}
        onSelectGroup={(levelId, groupId) => {
          setActiveLevelId(levelId);
          setActiveGroupId(groupId);
          setExpandedLevelId(levelId);
        }}
        text={text}
      />

      <main className={`${prefix}-content`}>
        <section className={`${prefix}-hero`}>
          <div className={`${prefix}-hero-main`}>
            <div className={`${prefix}-kicker`}>
              <Sparkles size={16} />
              <span>{config.heroKicker || "Listen, repeat, internalise."}</span>
            </div>
            <h1>{group?.title || currentGroupSummary?.title || config.appName}</h1>
            <p>
              {group?.focus ||
                currentGroupSummary?.focus ||
                currentLevel?.subtitle ||
                text.fallbackDescription}
            </p>
            <div className={`${prefix}-meta-row`}>
              <span><BookOpen size={14} /> {currentLevel?.title || "—"}</span>
              <span><Layers size={14} /> {text.groupLabel} {currentGroupIndex >= 0 ? currentGroupIndex + 1 : "—"} {text.groupOf} {totalGroupsInLevel || 0}</span>
              <span><Headphones size={14} /> {visibleWordCount} {text.wordsUnit}</span>
            </div>
          </div>

          <div className={`${prefix}-player`}>
            <div className={`${prefix}-player-status`}>
              <span className={busy ? "is-live" : ""}>{busy ? queueState.label : text.ready}</span>
              {(loadingKey || speakingKey) && (
                <small>{loadingKey ? text.preparingAudio : text.audioPlaying}</small>
              )}
            </div>
            <div className={`${prefix}-player-actions`}>
              <button
                className={`${prefix}-primary-button`}
                type="button"
                onClick={playGroupPrimary}
                disabled={loadingGroup || !visibleWordCount}
              >
                <Play size={16} />
                <span>{text.primaryButton}</span>
              </button>
              <button
                className={`${prefix}-secondary-button`}
                type="button"
                onClick={playGroupAll}
                disabled={loadingGroup || !visibleWordCount}
              >
                <Headphones size={16} />
                <span>{text.allButton}</span>
              </button>
              <button
                className={`${prefix}-stop-button`}
                type="button"
                onClick={stopQueue}
                disabled={!busy && !speakingKey && !loadingKey}
                title={text.stopTitle}
              >
                {busy ? <Square size={15} /> : <Pause size={15} />}
              </button>
            </div>
          </div>
        </section>

        {(levelsError || groupError || ttsError) && (
          <div className={`${prefix}-error`} role="alert">
            {levelsError || groupError || ttsError}
          </div>
        )}

        <section className={`${prefix}-toolbar`}>
          <label className={`${prefix}-search`}>
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={text.searchPlaceholder}
            />
          </label>
          <span>{visibleWordCount} {text.shownLabel}</span>
        </section>

        <section className={`${prefix}-sections`}>
          {loadingGroup ? (
            <div className={`${prefix}-loading-state`}>
              <Loader2 className={`${prefix}-spin`} size={20} />
              <span>{text.loadingGroup}</span>
            </div>
          ) : sections.length === 0 ? (
            <div className={`${prefix}-loading-state`}>
              <span>{text.noWords}</span>
            </div>
          ) : (
            filteredSections.map((section) => (
              <Section
                key={section.pos}
                prefix={prefix}
                section={section}
                text={text}
                config={config}
                loadingKey={loadingKey}
                speakingKey={speakingKey}
                activeWordId={activeWordId}
                setWordRef={setWordRef}
                onPlayPrimary={playWordPrimary}
                onPlayAll={playWordAll}
                onPlaySectionPrimary={playSectionPrimary}
                onPlaySectionAll={playSectionAll}
              />
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default VocabApp;
