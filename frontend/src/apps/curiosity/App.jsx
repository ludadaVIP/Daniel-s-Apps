import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  ChevronRight,
  FlaskConical,
  Headphones,
  Languages,
  Loader2,
  Pause,
  Play,
  Search,
  Sparkles,
  Square,
  Volume2,
} from "lucide-react";

import "./styles.css";
import { fetchCategories, fetchSubcategory, requestTts } from "./services/api";
import { useActiveItemScroll } from "../../shared/useActiveItemScroll";
import { isTtsCancelled, useTts } from "../../shared/useTts";

const QUEUE_GAP_MS = 300;

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function storyText(story, language) {
  if (language === "en") {
    return `${story.title_en}. ${story.answer_en}`;
  }
  return `${story.title_zh}。${story.answer_zh}${story.fun ? ` 小发现：${story.fun}` : ""}`;
}

function storyMatches(story, query) {
  if (!query) return true;
  const haystack = [
    story.title_zh,
    story.title_en,
    story.answer_zh,
    story.answer_en,
    story.fun,
    story.fun_en,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function AudioIcon({ loading, mode }) {
  if (loading) return <Loader2 className="cs-spin" size={17} />;
  if (mode === "both") return <Headphones size={17} />;
  if (mode === "en") return <Languages size={17} />;
  return <Volume2 size={17} />;
}

function StoryAudioButton({ active, disabled, loading, mode, onClick, title }) {
  return (
    <button
      className={`cs-audio-button ${mode === "both" ? "is-both" : ""} ${active ? "is-active" : ""}`}
      type="button"
      disabled={disabled || loading}
      onClick={onClick}
      title={title}
      aria-label={title}
    >
      <AudioIcon loading={loading} mode={mode} />
    </button>
  );
}

function StoryCard({
  active,
  loadingKey,
  onPlay,
  rowRef,
  speakingKey,
  story,
}) {
  const zhKey = `${story.id}:zh`;
  const enKey = `${story.id}:en`;
  const bothKeys = [`${story.id}:both-zh`, `${story.id}:both-en`];

  return (
    <article className={`cs-story-card ${active ? "is-current" : ""}`} ref={rowRef}>
      <div className="cs-story-top">
        <div className="cs-story-number">
          <span>{String(story.number || 1).padStart(2, "0")}</span>
          <small>why</small>
        </div>
        <div className="cs-story-actions">
          <StoryAudioButton
            active={speakingKey === zhKey}
            loading={loadingKey === zhKey}
            mode="zh"
            onClick={() => onPlay(story, "zh")}
            title="Play Chinese"
          />
          <StoryAudioButton
            active={speakingKey === enKey}
            loading={loadingKey === enKey}
            mode="en"
            onClick={() => onPlay(story, "en")}
            title="Play English"
          />
          <StoryAudioButton
            active={bothKeys.includes(speakingKey)}
            loading={bothKeys.includes(loadingKey)}
            mode="both"
            onClick={() => onPlay(story, "both")}
            title="Play Chinese and English"
          />
        </div>
      </div>

      <div className="cs-translation-grid">
        <section className="cs-language-panel cs-zh-panel">
          <span>中文</span>
          <h3>{story.title_zh}</h3>
          <p>{story.answer_zh}</p>
        </section>
        <section className="cs-language-panel cs-en-panel">
          <span>English</span>
          <h3>{story.title_en}</h3>
          <p>{story.answer_en}</p>
        </section>
      </div>

      {story.fun && (
        <div className="cs-fun-note">
          <Sparkles size={16} />
          <p>{story.fun}</p>
        </div>
      )}
    </article>
  );
}

export default function CuriosityApp() {
  const [course, setCourse] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [activeSubId, setActiveSubId] = useState("");
  const [detail, setDetail] = useState(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingSubcategory, setLoadingSubcategory] = useState(false);
  const [queueState, setQueueState] = useState({ running: false, label: "", currentIndex: 0, total: 0 });
  const [activeStoryId, setActiveStoryId] = useState("");
  const queueRef = useRef(0);
  const setStoryRef = useActiveItemScroll(activeStoryId);
  const { play, stop, speakingKey, loadingKey, error: ttsError } = useTts();

  useEffect(() => {
    let alive = true;
    setLoadingCourse(true);
    fetchCategories()
      .then((payload) => {
        if (!alive) return;
        setCourse(payload);
        const firstCategory = payload.categories?.[0];
        const firstSub = firstCategory?.subcategories?.[0];
        setActiveCategoryId(firstCategory?.id || "");
        setActiveSubId(firstSub?.id || "");
      })
      .catch((err) => alive && setError(err.message))
      .finally(() => alive && setLoadingCourse(false));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!activeSubId) return;
    let alive = true;
    queueRef.current += 1;
    stop();
    setActiveStoryId("");
    setQueueState({ running: false, label: "", currentIndex: 0, total: 0 });
    setLoadingSubcategory(true);
    fetchSubcategory(activeSubId)
      .then((payload) => alive && setDetail(payload))
      .catch((err) => alive && setError(err.message))
      .finally(() => alive && setLoadingSubcategory(false));
    return () => {
      alive = false;
    };
  }, [activeSubId, stop]);

  const activeCategory = useMemo(
    () => course?.categories?.find((category) => category.id === activeCategoryId) || course?.categories?.[0],
    [activeCategoryId, course],
  );

  const filteredStories = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (detail?.subcategory?.stories || []).filter((story) => storyMatches(story, needle));
  }, [detail, query]);

  const stopQueue = useCallback(() => {
    queueRef.current += 1;
    stop();
    setActiveStoryId("");
    setQueueState({ running: false, label: "", currentIndex: 0, total: 0 });
  }, [stop]);

  const playClip = useCallback(
    async ({ key, language, storyId, text }) => {
      setActiveStoryId(storyId);
      await play({
        key,
        waitForEnd: true,
        getUrl: async () => {
          const payload = await requestTts({ text, language });
          return { url: payload.audio_url };
        },
      });
    },
    [play],
  );

  const playStory = useCallback(
    async (story, mode) => {
      const runId = queueRef.current + 1;
      queueRef.current = runId;
      stop();
      setQueueState({ running: true, label: mode === "both" ? "Playing bilingual story" : "Playing one story", currentIndex: 0, total: 1 });
      try {
        if (mode === "zh" || mode === "both") {
          await playClip({ key: `${story.id}:${mode === "both" ? "both-zh" : "zh"}`, language: "zh", storyId: story.id, text: storyText(story, "zh") });
        }
        if (queueRef.current !== runId) throw new Error("cancelled");
        if (mode === "both") await sleep(QUEUE_GAP_MS);
        if (mode === "en" || mode === "both") {
          await playClip({ key: `${story.id}:${mode === "both" ? "both-en" : "en"}`, language: "en", storyId: story.id, text: storyText(story, "en") });
        }
      } catch (err) {
        if (!isTtsCancelled(err) && err.message !== "cancelled") setError(err.message || "Playback failed.");
      } finally {
        if (queueRef.current === runId) {
          setQueueState({ running: false, label: "", currentIndex: 0, total: 0 });
          setActiveStoryId("");
        }
      }
    },
    [playClip, stop],
  );

  const playSubcategory = useCallback(
    async (mode) => {
      const stories = filteredStories.length ? filteredStories : detail?.subcategory?.stories || [];
      if (!stories.length) return;
      const runId = queueRef.current + 1;
      queueRef.current = runId;
      stop();
      setQueueState({
        running: true,
        label: mode === "both" ? "Playing this part in Chinese and English" : mode === "en" ? "Playing English" : "Playing Chinese",
        currentIndex: 0,
        total: stories.length,
      });

      try {
        for (let index = 0; index < stories.length; index += 1) {
          const story = stories[index];
          if (queueRef.current !== runId) throw new Error("cancelled");
          setQueueState((current) => ({ ...current, currentIndex: index }));
          if (mode === "zh" || mode === "both") {
            await playClip({ key: `${story.id}:${mode === "both" ? "both-zh" : "zh"}`, language: "zh", storyId: story.id, text: storyText(story, "zh") });
          }
          if (queueRef.current !== runId) throw new Error("cancelled");
          if (mode === "both") await sleep(QUEUE_GAP_MS);
          if (mode === "en" || mode === "both") {
            await playClip({ key: `${story.id}:${mode === "both" ? "both-en" : "en"}`, language: "en", storyId: story.id, text: storyText(story, "en") });
          }
          if (queueRef.current !== runId) throw new Error("cancelled");
          await sleep(QUEUE_GAP_MS);
        }
      } catch (err) {
        if (!isTtsCancelled(err) && err.message !== "cancelled") setError(err.message || "Playback failed.");
      } finally {
        if (queueRef.current === runId) {
          setQueueState({ running: false, label: "", currentIndex: 0, total: 0 });
          setActiveStoryId("");
        }
      }
    },
    [detail, filteredStories, playClip, stop],
  );

  const selectCategory = (category) => {
    setActiveCategoryId(category.id);
    setActiveSubId(category.subcategories?.[0]?.id || "");
  };

  return (
    <div className="cs-shell">
      <aside className="cs-sidebar">
        <div className="cs-brand">
          <div className="cs-brand-mark"><FlaskConical size={24} /></div>
          <div>
            <p>好奇心科学</p>
            <span>Science for a curious 10-year-old</span>
          </div>
        </div>

        <div className="cs-sidebar-stat">
          <strong>{course?.totalStories || 500}</strong>
          <span>science stories</span>
        </div>

        <nav className="cs-category-nav" aria-label="Science categories">
          {loadingCourse && (
            <div className="cs-loading-nav">
              <Loader2 className="cs-spin" size={18} />
              <span>Loading curiosity</span>
            </div>
          )}
          {course?.categories?.map((category) => (
            <button
              className={`cs-category-button ${category.id === activeCategory?.id ? "is-selected" : ""}`}
              key={category.id}
              type="button"
              onClick={() => selectCategory(category)}
            >
              <span>{category.emoji}</span>
              <strong>{category.title}</strong>
              <small>{category.count} stories</small>
              <ChevronRight size={15} />
            </button>
          ))}
        </nav>
      </aside>

      <main className="cs-content">
        <section className="cs-hero">
          <div>
            <div className="cs-kicker">
              <Sparkles size={16} />
              <span>真实生活里的科学问题</span>
            </div>
            <h1>{activeCategory?.title || "好奇心科学"}</h1>
            <p>{activeCategory?.subtitle || course?.description}</p>
          </div>
          <div className="cs-hero-card">
            <BookOpen size={20} />
            <strong>{detail?.subcategory?.title || "Pick a part"}</strong>
            <span>{filteredStories.length} shown</span>
          </div>
        </section>

        <section className="cs-subnav" aria-label="Subcategories">
          {activeCategory?.subcategories?.map((sub) => (
            <button
              className={sub.id === activeSubId ? "is-selected" : ""}
              key={sub.id}
              type="button"
              onClick={() => setActiveSubId(sub.id)}
            >
              <span>{sub.emoji}</span>
              <strong>{sub.title}</strong>
              <small>{sub.count}</small>
            </button>
          ))}
        </section>

        {(error || ttsError) && <div className="cs-error" role="alert">{error || ttsError}</div>}

        <section className="cs-toolbar">
          <label className="cs-search">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search questions, ideas, Chinese or English"
            />
          </label>
          <div className="cs-playbar">
            <button type="button" onClick={() => playSubcategory("zh")} disabled={loadingSubcategory || !filteredStories.length}>
              <Play size={17} />
              Play Chinese
            </button>
            <button type="button" onClick={() => playSubcategory("en")} disabled={loadingSubcategory || !filteredStories.length}>
              <Languages size={17} />
              Play English
            </button>
            <button type="button" onClick={() => playSubcategory("both")} disabled={loadingSubcategory || !filteredStories.length}>
              <Headphones size={17} />
              Play All
            </button>
            <button className="cs-stop-button" type="button" onClick={stopQueue} disabled={!queueState.running && !speakingKey && !loadingKey}>
              {queueState.running ? <Square size={16} /> : <Pause size={16} />}
            </button>
          </div>
        </section>

        {queueState.running && (
          <aside className="cs-progress-dock" aria-label="Playback progress">
            <strong>{queueState.label}</strong>
            <span>{queueState.currentIndex + 1} / {queueState.total}</span>
            <button type="button" onClick={stopQueue}>
              <Square size={15} />
              Stop
            </button>
          </aside>
        )}

        <section className="cs-story-list" aria-label="Curiosity science stories">
          {loadingSubcategory ? (
            <div className="cs-loading-state">
              <Loader2 className="cs-spin" size={24} />
              <span>Loading stories</span>
            </div>
          ) : (
            filteredStories.map((story) => (
              <StoryCard
                active={activeStoryId === story.id}
                key={story.id}
                loadingKey={loadingKey}
                onPlay={playStory}
                rowRef={(node) => setStoryRef(story.id, node)}
                speakingKey={speakingKey}
                story={story}
              />
            ))
          )}
        </section>
      </main>
    </div>
  );
}
