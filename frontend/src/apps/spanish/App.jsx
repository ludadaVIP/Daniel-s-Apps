import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  ChevronRight,
  Headphones,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Play,
  Square,
  Volume2,
} from "lucide-react";

import "./styles.css";
import {
  fetchRoadmap,
  fetchProgress,
  fetchLesson,
  saveProgress,
  requestTts,
} from "./services/api";
import { useActiveItemScroll } from "../../shared/useActiveItemScroll";
import {
  buildBlockAudioItems,
  buildSectionAudioItems,
  getBlockMainAudioText,
  wait,
} from "../../shared/sprintAudio";
import { useTts, isTtsCancelled } from "../../shared/useTts";

const DEFAULT_LESSON_ID = "alphabet";

const TYPE_LABELS = {
  letter: "Letter",
  rule: "Rule",
  chunk: "Sound",
  category: "Category",
  word: "Word",
  verb: "Verb",
  phrase: "Phrase",
  sentence: "Sentence",
  pattern: "Pattern",
};

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function countExamples(blocks) {
  return blocks.reduce((total, block) => {
    const examples = block.examples || (block.example ? [block.example] : []);
    return total + examples.length;
  }, 0);
}

function getSectionAnchorId(sectionId) {
  return `es-section-${sectionId}`;
}

function AudioButton({ active, icon = "speaker", label = "Play Spanish audio", loading, onClick }) {
  return (
    <button
      className={`audio-button ${active ? "is-speaking" : ""}`}
      type="button"
      onClick={onClick}
      disabled={loading}
      aria-label={label}
      title={label}
    >
      {loading ? (
        <Loader2 className="spin" size={18} strokeWidth={2.2} />
      ) : icon === "card" ? (
        <Headphones size={18} strokeWidth={2.2} />
      ) : (
        <Volume2 size={18} strokeWidth={2.2} />
      )}
    </button>
  );
}

function getSpanishConjugationRows(conjugation) {
  if (!conjugation) return [];

  // Spanish has 6 forms: yo / tú / él·ella·usted / nosotros / vosotros / ellos·ellas·ustedes.
  // Lesson JSON uses keys: yo, tu, el, nosotros, vosotros, ellos.
  return [
    ["yo", conjugation.yo, "yo"],
    ["tú", conjugation.tu, "tu"],
    ["él / ella / usted", conjugation.el, "el"],
    ["nosotros / nosotras", conjugation.nosotros, "nosotros"],
    ["vosotros / vosotras", conjugation.vosotros, "vosotros"],
    ["ellos / ellas / ustedes", conjugation.ellos, "ellos"],
  ].filter(([, form]) => Boolean(form));
}

function spanishConjugationAudioText(label, form) {
  if (label === "él / ella / usted") return `Él ${form}. Ella ${form}.`;
  if (label === "nosotros / nosotras") return `Nosotros ${form}.`;
  if (label === "vosotros / vosotras") return `Vosotros ${form}.`;
  if (label === "ellos / ellas / ustedes") return `Ellos ${form}. Ellas ${form}.`;
  return `${label} ${form}`;
}

function getSpanishConjugationItems(block) {
  return getSpanishConjugationRows(block?.conjugation).map(([label, form, key]) => ({
    key,
    text: spanishConjugationAudioText(label, form),
  }));
}

function ConjugationTable({ blockId, conjugation, loadingAudioKey, onSpeak, speakingKey }) {
  if (!conjugation) return null;

  const rows = getSpanishConjugationRows(conjugation);

  return (
    <div className="conjugation-table" aria-label="Conjugation">
      <div className="conjugation-title">Conjugación</div>
      <div className="conjugation-grid">
        {rows.map(([label, form, key]) => (
          <div className="conjugation-cell" key={key}>
            <div>
              <span>{label}</span>
              <strong>{form}</strong>
            </div>
            <AudioButton
              active={speakingKey === `${blockId}:conjugation:${key}`}
              label="Play this conjugation"
              loading={loadingAudioKey === `${blockId}:conjugation:${key}`}
              onClick={() =>
                onSpeak(
                  spanishConjugationAudioText(label, form),
                  `${blockId}:conjugation:${key}`,
                  blockId,
                )
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function LessonBlock({
  active,
  block,
  heard,
  loadingAudioKey,
  onPlayCard,
  onSpeak,
  rowRef,
  speakingKey,
}) {
  const isSentence = block.type === "sentence" || block.type === "pattern";
  const isLetter = block.type === "letter";
  const displayText = block.text || block.pattern;
  const audioText = getBlockMainAudioText(block);
  const examples = block.examples || (block.example ? [block.example] : []);
  const textClass = isLetter ? "letter-text" : isSentence ? "sentence-text" : "pattern-text";
  const cardAudioActive = active && speakingKey !== block.id;

  return (
    <article
      ref={rowRef}
      className={`learning-card ${heard ? "heard" : ""} ${active ? "playing" : ""}`}
    >
      <div className="card-topline">
        <span className="block-type">{TYPE_LABELS[block.type] || "Content"}</span>
        {heard && <span className="status-pill">heard</span>}
      </div>

      <div className={isSentence ? "sentence-row" : "letter-row"}>
        <div>
          <div className={textClass}>{displayText}</div>
          {block.ipa && <div className="ipa">{block.ipa}</div>}
        </div>
        <div className="main-audio-actions">
          <AudioButton
            active={speakingKey === block.id}
            label="Play keyword"
            loading={loadingAudioKey === block.id}
            onClick={() => onSpeak(audioText, block.id, block.id)}
          />
          <AudioButton
            active={cardAudioActive}
            icon="card"
            label="Play full card"
            loading={cardAudioActive && Boolean(loadingAudioKey)}
            onClick={() => onPlayCard(block)}
          />
        </div>
      </div>

      {block.translation && <p className="translation">{block.translation}</p>}
      {block.rule && <p className="rule-text">{block.rule}</p>}
      {block.hint && <p className="hint">{block.hint}</p>}
      <ConjugationTable
        blockId={block.id}
        conjugation={block.conjugation}
        loadingAudioKey={loadingAudioKey}
        onSpeak={onSpeak}
        speakingKey={speakingKey}
      />

      {examples.length > 0 && (
        <div className="example-list">
          {examples.map((example, index) => {
            const exampleKey = `${block.id}:example:${index}`;
            return (
              <div className="example-line" key={exampleKey}>
                <span>{example.text}</span>
                <AudioButton
                  active={speakingKey === exampleKey}
                  loading={loadingAudioKey === exampleKey}
                  label="Play example"
                  onClick={() => onSpeak(example.audioText || example.text, exampleKey, block.id)}
                />
                <small>
                  {example.ipa && <span className="example-ipa">{example.ipa}</span>}
                  {example.translation}
                </small>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}

function Sidebar({ activeLessonId, isOpen, onSelectLesson, onToggle, roadmap, visitedLessonIds }) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <div className="sidebar-top">
        <div className="brand">
          <div className="brand-mark">ES</div>
          {isOpen && (
            <div>
              <div className="brand-title">Español Sprint</div>
              <div className="brand-sub">0 → B2 en castellano</div>
            </div>
          )}
        </div>
        <button
          className="panel-icon-button dark"
          type="button"
          onClick={onToggle}
          aria-label={isOpen ? "Collapse roadmap" : "Expand roadmap"}
          title={isOpen ? "Collapse" : "Expand"}
        >
          {isOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>
      </div>

      {isOpen ? (
        <nav className="roadmap" aria-label="Learning roadmap">
          {roadmap?.phases?.map((phase) => (
            <section className="phase" key={phase.id}>
              <h2>{phase.title}</h2>
              <p>{phase.description}</p>
              <div className="lesson-list">
                {phase.lessons.map((lesson) => {
                  const active = lesson.id === activeLessonId;
                  const visited = visitedLessonIds.includes(lesson.id);
                  return (
                    <button
                      className={`lesson-nav-item ${active ? "active" : ""} ${
                        visited ? "visited" : ""
                      }`}
                      key={lesson.id}
                      type="button"
                      onClick={() => onSelectLesson(lesson.id)}
                      title={lesson.goal}
                    >
                      <span>{lesson.title}</span>
                      <ChevronRight size={15} />
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </nav>
      ) : (
        <div className="side-rail-label">Camino</div>
      )}
    </aside>
  );
}

function LessonNavigator({ activeSectionId, onJumpToSection, onJumpToTop, sections }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const visibleBlocks = sections.reduce((total, section) => total + section.blocks.length, 0);
  const visibleExamples = sections.reduce(
    (total, section) => total + countExamples(section.blocks),
    0,
  );
  const activeSection = sections.find((section) => section.id === activeSectionId);

  const jumpToSection = (sectionId) => {
    onJumpToSection(sectionId);
    setIsExpanded(false);
  };

  return (
    <section
      className={`lesson-control-panel ${isExpanded ? "expanded" : "collapsed"}`}
      aria-label="Lesson outline"
    >
      <div className="lesson-map">
        <div className="lesson-map-heading">
          <div>
            <div className="map-label">Lesson outline</div>
            <div className="map-summary">
              {isExpanded
                ? `${sections.length} sections · ${visibleBlocks} blocks · ${visibleExamples} examples`
                : activeSection?.title || `${sections.length} sections`}
            </div>
          </div>
          <div className="map-actions">
            <button className="mini-button" type="button" onClick={onJumpToTop}>
              Top
            </button>
            <button
              className="mini-button"
              type="button"
              onClick={() => setIsExpanded((value) => !value)}
            >
              {isExpanded ? "Collapse" : "Expand"}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="section-jump-list">
            {sections.map((section, index) => (
              <button
                className={`section-jump-button ${
                  activeSectionId === section.id ? "active" : ""
                }`}
                key={section.id}
                type="button"
                onClick={() => jumpToSection(section.id)}
                title={section.note}
              >
                <span>
                  {index + 1}. {section.title}
                </span>
                <small>{section.blocks.length}</small>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function RightPanel({
  activeSectionId,
  audioError,
  isOpen,
  lesson,
  lessonSections,
  nextLesson,
  onJumpToSection,
  onJumpToTop,
  onSelectLesson,
  onToggle,
  previousLesson,
}) {
  if (!isOpen) {
    return (
      <aside className="right-panel collapsed" aria-label="Lesson toolbar">
        <button
          className="panel-icon-button"
          type="button"
          onClick={onToggle}
          aria-label="Expand the lesson panel"
          title="Expand lesson panel"
        >
          <PanelRightOpen size={18} />
        </button>
        <div className="side-rail-label light">Lección</div>
      </aside>
    );
  }

  return (
    <aside className="right-panel open" aria-label="Lesson panel">
      <div className="right-panel-header">
        <div>
          <div className="map-label">Lesson panel</div>
          <div className="map-summary">Overview & quick jump</div>
        </div>
        <button
          className="panel-icon-button"
          type="button"
          onClick={onToggle}
          aria-label="Collapse the lesson panel"
          title="Collapse lesson panel"
        >
          <PanelRightClose size={18} />
        </button>
      </div>

      <section className="right-card lesson-overview" aria-label="Lesson overview">
        <div className="lesson-overview-stripe" aria-hidden="true" />
        <div className="eyebrow">
          <BookOpen size={16} />
          {lesson.phase} · {lesson.level}
        </div>
        <h1>{lesson.title}</h1>
        <p>{lesson.objective}</p>
        <div className="lesson-actions">
          {previousLesson && (
            <button
              className="ghost-button"
              type="button"
              onClick={() => onSelectLesson(previousLesson.id)}
            >
              Previous
            </button>
          )}
          {nextLesson && (
            <button
              className="primary-button"
              type="button"
              onClick={() => onSelectLesson(nextLesson.id)}
            >
              Next lesson
              <ChevronRight size={17} />
            </button>
          )}
        </div>
        {audioError && <div className="audio-error">{audioError}</div>}
      </section>

      <LessonNavigator
        activeSectionId={activeSectionId}
        onJumpToSection={onJumpToSection}
        onJumpToTop={onJumpToTop}
        sections={lessonSections}
      />
    </aside>
  );
}

export default function SpanishApp() {
  const [roadmap, setRoadmap] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [progress, setProgress] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(DEFAULT_LESSON_ID);
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState("");
  const [activeBlockId, setActiveBlockId] = useState("");
  const [activeSectionPlaybackId, setActiveSectionPlaybackId] = useState("");
  const [isQueuePlaybackActive, setIsQueuePlaybackActive] = useState(false);
  const [error, setError] = useState("");
  const {
    play: playTts,
    stop: stopTts,
    speakingKey,
    loadingKey: loadingAudioKey,
    error: audioError,
  } = useTts();
  const progressRef = useRef(null);
  const sectionPlayRunRef = useRef(0);
  const setBlockRef = useActiveItemScroll(activeBlockId);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    if (!speakingKey && !loadingAudioKey && !isQueuePlaybackActive) {
      setActiveBlockId("");
    }
  }, [isQueuePlaybackActive, loadingAudioKey, speakingKey]);

  useEffect(() => {
    Promise.all([fetchRoadmap(), fetchProgress()])
      .then(([roadmapData, progressData]) => {
        setRoadmap(roadmapData);
        setProgress(progressData);
        progressRef.current = progressData;
        setSelectedLessonId(progressData.currentLessonId || DEFAULT_LESSON_ID);
      })
      .catch(() => {
        setError("The backend did not respond. Start the Flask server first.");
      });
  }, []);

  useEffect(() => {
    if (!roadmap) return;
    setLesson(null);
    fetchLesson(selectedLessonId)
      .then((lessonData) => {
        setLesson(lessonData);
        recordLessonVisit(lessonData.id);
      })
      .catch(() => {
        setError("This lesson is not ready yet.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLessonId, roadmap]);

  const lessonSummaries = useMemo(() => {
    return roadmap?.phases?.flatMap((phase) => phase.lessons) || [];
  }, [roadmap]);

  const currentLessonIndex = lessonSummaries.findIndex(
    (item) => item.id === selectedLessonId,
  );
  const previousLesson = currentLessonIndex > 0 ? lessonSummaries[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex >= 0 && currentLessonIndex + 1 < lessonSummaries.length
      ? lessonSummaries[currentLessonIndex + 1]
      : null;

  const lessonSections = useMemo(() => lesson?.sections || [], [lesson]);

  const visitedLessonIds = useMemo(
    () => unique(progress?.visitedLessons || []),
    [progress?.visitedLessons],
  );
  const heardBlocks = progress?.heardBlocks || {};

  useEffect(() => {
    if (!lessonSections.length) {
      setActiveSectionId("");
      return;
    }
    setActiveSectionId(lessonSections[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length) {
          const top = visible[0];
          const sectionId = top.target.getAttribute("data-section-id");
          if (sectionId) setActiveSectionId(sectionId);
        }
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0.1, 0.4, 0.7] },
    );

    lessonSections.forEach((section) => {
      const element = document.getElementById(getSectionAnchorId(section.id));
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [lessonSections]);

  const persistProgress = (nextProgress) => {
    progressRef.current = nextProgress;
    setProgress(nextProgress);

    saveProgress(nextProgress)
      .then((saved) => {
        progressRef.current = saved;
        setProgress(saved);
      })
      .catch(() => {
        setError("Could not save progress, but you can keep learning.");
      });
  };

  const recordLessonVisit = (lessonId) => {
    const current = progressRef.current || {};
    const nextProgress = {
      ...current,
      currentLessonId: lessonId,
      visitedLessons: unique([...(current.visitedLessons || []), lessonId]),
      heardBlocks: current.heardBlocks || {},
    };
    if (
      current.currentLessonId === nextProgress.currentLessonId &&
      (current.visitedLessons || []).includes(lessonId)
    ) {
      return;
    }
    persistProgress(nextProgress);
  };

  const recordAudioPlay = useCallback(
    (key, text, audioMeta = {}) => {
      const current = progressRef.current || {};
      persistProgress({
        ...current,
        currentLessonId: selectedLessonId,
        visitedLessons: unique([...(current.visitedLessons || []), selectedLessonId]),
        heardBlocks: {
          ...(current.heardBlocks || {}),
          [key]: { at: new Date().toISOString(), text, ...audioMeta },
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedLessonId],
  );

  const playEdgeTts = async (text, key, { blockId = "", waitForEnd = false } = {}) => {
    const cleanText = String(text || "").trim();
    if (!cleanText) return;
    if (blockId) setActiveBlockId(blockId);

    try {
      await playTts({
        key,
        waitForEnd,
        getUrl: async () => {
          const data = await requestTts({ text: cleanText });
          recordAudioPlay(key, cleanText, {
            audioPath: data.audio_path,
            cached: data.cached,
            engine: data.engine,
            voice: data.voice,
          });
          return { url: data.audio_url || data.audio_path };
        },
      });
    } catch (err) {
      if (!isTtsCancelled(err)) {
        // hook already populated audioError
      }
      throw err;
    }
  };

  const stopPlayback = useCallback(() => {
    sectionPlayRunRef.current += 1;
    stopTts();
    setIsQueuePlaybackActive(false);
    setActiveSectionPlaybackId("");
    setActiveBlockId("");
  }, [stopTts]);

  const speakSpanish = (text, key, blockId = "") => {
    sectionPlayRunRef.current += 1;
    setIsQueuePlaybackActive(false);
    setActiveSectionPlaybackId("");
    playEdgeTts(text, key, { blockId }).catch((err) => {
      if (!isTtsCancelled(err)) {
        // already reflected in audioError
      }
    });
  };

  const playAudioItems = async (items, { sectionId = "" } = {}) => {
    const runId = sectionPlayRunRef.current + 1;
    sectionPlayRunRef.current = runId;
    stopTts();
    setActiveSectionPlaybackId(sectionId);
    setIsQueuePlaybackActive(true);

    try {
      for (const item of items) {
        if (sectionPlayRunRef.current !== runId) return;
        try {
          await playEdgeTts(item.text, item.key, {
            blockId: item.blockId,
            waitForEnd: true,
          });
          if (sectionPlayRunRef.current === runId) await wait();
        } catch (err) {
          if (isTtsCancelled(err)) return;
          return;
        }
      }
    } finally {
      if (sectionPlayRunRef.current === runId) {
        setIsQueuePlaybackActive(false);
        setActiveSectionPlaybackId("");
        setActiveBlockId("");
      }
    }
  };

  const playCard = (block) => {
    playAudioItems(buildBlockAudioItems(block, getSpanishConjugationItems));
  };

  const playSection = (section) => {
    playAudioItems(buildSectionAudioItems(section, getSpanishConjugationItems), {
      sectionId: section.id,
    });
  };

  const selectLesson = (lessonId) => {
    stopPlayback();
    setError("");
    setSelectedLessonId(lessonId);
  };

  const jumpToSection = (sectionId) => {
    const element = document.getElementById(getSectionAnchorId(sectionId));
    if (!element) return;
    setActiveSectionId(sectionId);
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const jumpToTop = () => {
    document
      .getElementById("es-lesson-top")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (error && !roadmap) {
    return (
      <main className="boot-state">
        <div className="boot-panel">
          <h1>Español Sprint</h1>
          <p>{error}</p>
          <code>cd backend && python app.py</code>
        </div>
      </main>
    );
  }

  if (!lesson || !roadmap || !progress) {
    return (
      <main className="boot-state">
        <Loader2 className="spin" size={28} />
      </main>
    );
  }

  return (
    <div
      className={`es-shell ${isLeftOpen ? "left-open" : "left-collapsed"} ${
        isRightOpen ? "right-open" : "right-collapsed"
      }`}
    >
      <Sidebar
        activeLessonId={selectedLessonId}
        isOpen={isLeftOpen}
        onSelectLesson={selectLesson}
        onToggle={() => setIsLeftOpen((value) => !value)}
        roadmap={roadmap}
        visitedLessonIds={visitedLessonIds}
      />

      <main className="main-content" id="es-lesson-top">
        <div className="lesson-sections">
          {lessonSections.map((section) => (
            <section
              className="lesson-section"
              data-section-id={section.id}
              id={getSectionAnchorId(section.id)}
              key={section.id}
            >
              <div className="section-heading">
                <div>
                  <h2>{section.title}</h2>
                  {section.note && <p>{section.note}</p>}
                </div>
                <div className="section-audio-actions">
                  <button
                    className={`section-play-button ${
                      activeSectionPlaybackId === section.id ? "is-playing" : ""
                    }`}
                    type="button"
                    onClick={() => playSection(section)}
                  >
                    <Play size={16} />
                    Play section
                  </button>
                  <button
                    className="section-stop-button"
                    disabled={activeSectionPlaybackId !== section.id}
                    type="button"
                    onClick={stopPlayback}
                  >
                    <Square size={15} />
                    Stop
                  </button>
                </div>
              </div>
              <div
                className={
                  section.layout === "compact" || section.id === "alphabet-core"
                    ? "letter-grid"
                    : "content-grid"
                }
              >
                {section.blocks.map((block) => {
                  const heard = Boolean(heardBlocks[block.id]);
                  return (
                    <LessonBlock
                      block={block}
                      heard={heard}
                      key={block.id}
                      active={activeBlockId === block.id}
                      loadingAudioKey={loadingAudioKey}
                      onPlayCard={playCard}
                      onSpeak={speakSpanish}
                      rowRef={(node) => setBlockRef(block.id, node)}
                      speakingKey={speakingKey}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      <RightPanel
        activeSectionId={activeSectionId}
        audioError={audioError}
        isOpen={isRightOpen}
        lesson={lesson}
        lessonSections={lessonSections}
        nextLesson={nextLesson}
        onJumpToSection={jumpToSection}
        onJumpToTop={jumpToTop}
        onSelectLesson={selectLesson}
        onToggle={() => setIsRightOpen((value) => !value)}
        previousLesson={previousLesson}
      />
    </div>
  );
}
