import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  FileText,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Plus,
  Trash2,
  Volume2,
} from "lucide-react";

import "./styles.css";
import {
  createLesson,
  createLevel,
  deleteLesson,
  deleteLevel,
  fetchLesson,
  fetchLibrary,
  requestTts,
  updateLesson,
  updateLevel,
} from "./services/api";
import { isTtsCancelled, useTts } from "../../shared/useTts";

function AudioButton({ active, loading, onClick, title = "Play" }) {
  return (
    <button
      aria-label={title}
      className={`ff-audio-button ${active ? "is-active" : ""}`}
      disabled={loading}
      onClick={onClick}
      title={title}
      type="button"
    >
      {loading ? <Loader2 className="ff-spin" size={14} /> : <Volume2 size={14} />}
    </button>
  );
}

function speakable(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(". ");
  return String(value || "").trim();
}

function columnLanguage(column = "") {
  const value = column.toLowerCase();
  if (value.includes("english")) return "en";
  if (value.includes("spanish")) return "es";
  return "fr";
}

function lessonFrenchText(lesson) {
  return (lesson?.sections || [])
    .flatMap((section) => {
      if (section.kind === "verbs") {
        return section.verbs?.flatMap((verb) => [verb.fr, ...(verb.forms || []), verb.example]) || [];
      }
      if (section.kind === "vocabulary") {
        return section.items?.flatMap((item) => [item.fr, item.example]) || [];
      }
      if (section.kind === "cards") {
        return section.items?.map((item) => item.fr) || [];
      }
      if (section.kind === "dialogue") {
        return section.lines?.map((line) => line.fr) || [];
      }
      if (section.kind === "table") {
        return section.rows?.map((row) => row[0]) || [];
      }
      return [];
    })
    .filter(Boolean)
    .join(". ");
}

function sectionFrenchText(section) {
  if (section.kind === "verbs") {
    return (section.verbs || []).flatMap((verb) => [verb.fr, ...(verb.forms || []), verb.example]).join(". ");
  }
  if (section.kind === "vocabulary") {
    return (section.items || []).flatMap((item) => [item.fr, item.example]).join(". ");
  }
  if (section.kind === "cards") return (section.items || []).map((item) => item.fr).join(". ");
  if (section.kind === "dialogue") return (section.lines || []).map((line) => line.fr).join(". ");
  if (section.kind === "table") return (section.rows || []).map((row) => row[0]).join(". ");
  return "";
}

function Sidebar({
  activeLessonId,
  collapsed,
  expandedLevelIds,
  library,
  onAddLesson,
  onAddLevel,
  onDeleteLesson,
  onDeleteLevel,
  onEditLesson,
  onEditLevel,
  onSelectLesson,
  onToggle,
  onToggleLevel,
}) {
  return (
    <aside className="ff-sidebar">
      <div className="ff-sidebar-top">
        <div className="ff-brand" title="Free French">
          <div className="ff-brand-mark">FF</div>
          {!collapsed && (
            <div>
              <strong>Free French</strong>
              <span>anywhere, speakable</span>
            </div>
          )}
        </div>
        <button className="ff-icon-button" onClick={onToggle} title="Collapse sidebar" type="button">
          {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
        </button>
      </div>

      {!collapsed && (
        <button className="ff-add-level" onClick={onAddLevel} type="button">
          <Plus size={15} />
          Level
        </button>
      )}

      <nav className="ff-level-list" aria-label="Free French lessons">
        {(library?.levels || []).map((level) => {
          const isOpen = expandedLevelIds.includes(level.id);
          return (
            <section className="ff-level" key={level.id}>
              <div className="ff-level-row">
                <button
                  className="ff-level-toggle"
                  onClick={() => onToggleLevel(level.id)}
                  title={level.title}
                  type="button"
                >
                  {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                  {!collapsed && (
                    <span>
                      <strong>{level.title}</strong>
                      <small>{level.subtitle}</small>
                    </span>
                  )}
                </button>
                {!collapsed && (
                  <div className="ff-row-actions">
                    <button onClick={() => onAddLesson(level.id)} title="Add lesson" type="button">
                      <Plus size={13} />
                    </button>
                    <button onClick={() => onEditLevel(level)} title="Rename level" type="button">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => onDeleteLevel(level)} title="Delete level" type="button">
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>

              {isOpen && !collapsed && (
                <div className="ff-lesson-list">
                  {(level.lessons || []).map((lesson) => (
                    <button
                      className={`ff-lesson-link ${activeLessonId === lesson.id ? "is-active" : ""}`}
                      key={lesson.id}
                      onClick={() => onSelectLesson(lesson.id)}
                      type="button"
                    >
                      <BookOpen size={14} />
                      <span>
                        <strong>{lesson.title}</strong>
                        <small>{lesson.subtitle}</small>
                      </span>
                      <span className="ff-lesson-actions">
                        <span
                          onClick={(event) => {
                            event.stopPropagation();
                            onEditLesson(lesson);
                          }}
                          role="button"
                          tabIndex={0}
                          title="Rename lesson"
                        >
                          <Pencil size={12} />
                        </span>
                        <span
                          onClick={(event) => {
                            event.stopPropagation();
                            onDeleteLesson(lesson);
                          }}
                          role="button"
                          tabIndex={0}
                          title="Delete lesson"
                        >
                          <Trash2 size={12} />
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </nav>
    </aside>
  );
}

function SpeakCell({ children, itemKey, language, loadingKey, onSpeak, speakingKey }) {
  const text = speakable(children);
  return (
    <span className="ff-speak-cell">
      <span>{children}</span>
      {text && (
        <AudioButton
          active={speakingKey === itemKey}
          loading={loadingKey === itemKey}
          onClick={() => onSpeak(text, itemKey, language)}
          title={`Play ${language.toUpperCase()}`}
        />
      )}
    </span>
  );
}

function TableSection({ loadingKey, onSpeak, section, speakingKey }) {
  return (
    <div className="ff-table-wrap">
      <table className="ff-table">
        <thead>
          <tr>
            {(section.columns || []).map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(section.rows || []).map((row, rowIndex) => (
            <tr key={`${section.id}-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${section.id}-${rowIndex}-${cellIndex}`}>
                  <SpeakCell
                    itemKey={`${section.id}:cell:${rowIndex}:${cellIndex}`}
                    language={columnLanguage(section.columns?.[cellIndex])}
                    loadingKey={loadingKey}
                    onSpeak={onSpeak}
                    speakingKey={speakingKey}
                  >
                    {cell}
                  </SpeakCell>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VerbsSection({ loadingKey, onSpeak, section, speakingKey }) {
  return (
    <div className="ff-verb-list">
      {(section.verbs || []).map((verb) => (
        <article className="ff-verb-row" key={verb.fr}>
          <div className="ff-verb-head">
            <SpeakCell
              itemKey={`${section.id}:verb:${verb.fr}`}
              language="fr"
              loadingKey={loadingKey}
              onSpeak={onSpeak}
              speakingKey={speakingKey}
            >
              {verb.fr}
            </SpeakCell>
            <small>{verb.en} · {verb.es}</small>
          </div>
          <div className="ff-form-grid">
            {(verb.forms || []).map((form) => (
              <button
                className={`ff-form-chip ${speakingKey === `${section.id}:form:${form}` ? "is-active" : ""}`}
                key={form}
                onClick={() => onSpeak(form, `${section.id}:form:${form}`, "fr")}
                type="button"
              >
                {loadingKey === `${section.id}:form:${form}` && <Loader2 className="ff-spin" size={12} />}
                {form}
              </button>
            ))}
          </div>
          <div className="ff-example-line">
            <SpeakCell
              itemKey={`${section.id}:example:${verb.fr}`}
              language="fr"
              loadingKey={loadingKey}
              onSpeak={onSpeak}
              speakingKey={speakingKey}
            >
              {verb.example}
            </SpeakCell>
            {(verb.exampleEn || verb.exampleEs) && (
              <small className="ff-example-translation">
                {[verb.exampleEn, verb.exampleEs].filter(Boolean).join(" · ")}
              </small>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

function VocabularySection({ loadingKey, onSpeak, section, speakingKey }) {
  return (
    <div className="ff-vocab-grid">
      {(section.items || []).map((item) => (
        <article className="ff-vocab-row" key={item.fr}>
          <div className="ff-vocab-main">
            <SpeakCell
              itemKey={`${section.id}:word:${item.fr}`}
              language="fr"
              loadingKey={loadingKey}
              onSpeak={onSpeak}
              speakingKey={speakingKey}
            >
              {item.fr}
            </SpeakCell>
            <small>{item.en} · {item.es}</small>
          </div>
          <div className="ff-vocab-example">
            <SpeakCell
              itemKey={`${section.id}:word-example:${item.fr}`}
              language="fr"
              loadingKey={loadingKey}
              onSpeak={onSpeak}
              speakingKey={speakingKey}
            >
              {item.example}
            </SpeakCell>
            {(item.exampleEn || item.exampleEs) && (
              <small className="ff-example-translation">
                {[item.exampleEn, item.exampleEs].filter(Boolean).join(" · ")}
              </small>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

function CardsSection({ loadingKey, onSpeak, section, speakingKey }) {
  return (
    <div className="ff-card-grid">
      {(section.items || []).map((item, index) => (
        <article className="ff-triad" key={`${section.id}-${index}`}>
          <SpeakCell itemKey={`${section.id}:card:${index}:fr`} language="fr" loadingKey={loadingKey} onSpeak={onSpeak} speakingKey={speakingKey}>
            {item.fr}
          </SpeakCell>
          <SpeakCell itemKey={`${section.id}:card:${index}:en`} language="en" loadingKey={loadingKey} onSpeak={onSpeak} speakingKey={speakingKey}>
            {item.en}
          </SpeakCell>
          <SpeakCell itemKey={`${section.id}:card:${index}:es`} language="es" loadingKey={loadingKey} onSpeak={onSpeak} speakingKey={speakingKey}>
            {item.es}
          </SpeakCell>
        </article>
      ))}
    </div>
  );
}

function DialogueSection({ loadingKey, onSpeak, section, speakingKey }) {
  return (
    <div className="ff-dialogue">
      {(section.lines || []).map((line, index) => (
        <div className="ff-dialogue-line" key={`${section.id}-${index}`}>
          <b>{line.speaker}</b>
          <SpeakCell itemKey={`${section.id}:line:${index}:fr`} language="fr" loadingKey={loadingKey} onSpeak={onSpeak} speakingKey={speakingKey}>
            {line.fr}
          </SpeakCell>
          <small>{line.en} · {line.es}</small>
        </div>
      ))}
    </div>
  );
}

function LessonSection({ loadingKey, onSpeak, section, speakingKey }) {
  const sectionText = sectionFrenchText(section);
  return (
    <section className="ff-section">
      <header className="ff-section-header">
        <h2>{section.title}</h2>
        {sectionText && (
          <AudioButton
            active={speakingKey === `section:${section.id}`}
            loading={loadingKey === `section:${section.id}`}
            onClick={() => onSpeak(sectionText, `section:${section.id}`, "fr")}
            title="Play this section in French"
          />
        )}
      </header>
      {section.kind === "table" && <TableSection loadingKey={loadingKey} onSpeak={onSpeak} section={section} speakingKey={speakingKey} />}
      {section.kind === "verbs" && <VerbsSection loadingKey={loadingKey} onSpeak={onSpeak} section={section} speakingKey={speakingKey} />}
      {section.kind === "vocabulary" && <VocabularySection loadingKey={loadingKey} onSpeak={onSpeak} section={section} speakingKey={speakingKey} />}
      {section.kind === "cards" && <CardsSection loadingKey={loadingKey} onSpeak={onSpeak} section={section} speakingKey={speakingKey} />}
      {section.kind === "dialogue" && <DialogueSection loadingKey={loadingKey} onSpeak={onSpeak} section={section} speakingKey={speakingKey} />}
    </section>
  );
}

export default function FreeFrenchApp() {
  const [library, setLibrary] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [expandedLevelIds, setExpandedLevelIds] = useState(["foundation"]);
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState("");
  const { error: ttsError, loadingKey, play, speakingKey } = useTts();

  const firstLessonId = useMemo(() => {
    for (const level of library?.levels || []) {
      if (level.lessons?.[0]?.id) return level.lessons[0].id;
    }
    return "";
  }, [library]);

  const loadLibrary = useCallback(async () => {
    const data = await fetchLibrary();
    setLibrary(data);
    setSelectedLessonId((current) => current || data.levels?.[0]?.lessons?.[0]?.id || "");
    setExpandedLevelIds((current) => {
      const known = new Set(data.levels?.map((level) => level.id));
      const kept = current.filter((id) => known.has(id));
      return kept.length ? kept : [data.levels?.[0]?.id].filter(Boolean);
    });
    return data;
  }, []);

  useEffect(() => {
    loadLibrary().catch((err) => setError(err.message));
  }, [loadLibrary]);

  useEffect(() => {
    const lessonId = selectedLessonId || firstLessonId;
    if (!lessonId) return;
    fetchLesson(lessonId)
      .then(setLesson)
      .catch((err) => setError(err.message));
  }, [firstLessonId, selectedLessonId]);

  const speak = useCallback(
    async (text, key, language = "fr") => {
      try {
        await play({
          key,
          waitForEnd: false,
          getUrl: async () => {
            const data = await requestTts({ lessonId: selectedLessonId, text, language });
            return { url: data.audio_url };
          },
        });
      } catch (err) {
        if (!isTtsCancelled(err)) setError(err.message);
      }
    },
    [play, selectedLessonId],
  );

  async function refreshAfter(action) {
    try {
      const next = await action();
      setLibrary(next);
      return next;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }

  const handleAddLevel = () => {
    const title = window.prompt("Level name", "New level");
    if (!title) return;
    refreshAfter(() => createLevel({ title, subtitle: "Custom path" }));
  };

  const handleEditLevel = (level) => {
    const title = window.prompt("Level name", level.title);
    if (!title) return;
    refreshAfter(() => updateLevel(level.id, { title }));
  };

  const handleDeleteLevel = (level) => {
    if (!window.confirm(`Delete level "${level.title}"? Empty levels only.`)) return;
    refreshAfter(() => deleteLevel(level.id));
  };

  const handleAddLesson = async (levelId) => {
    const title = window.prompt("Lesson title", "New speakable note");
    if (!title) return;
    const next = await refreshAfter(() =>
      createLesson(levelId, {
        title,
        subtitle: "Draft lesson",
        overview: ["Add French, English, and Spanish notes here later."],
        sections: [
          {
            id: "notes",
            title: "Notes",
            kind: "cards",
            items: [{ fr: "Bonjour.", en: "Hello.", es: "Hola." }],
          },
        ],
      }),
    );
    const created = next?.levels?.find((level) => level.id === levelId)?.lessons?.at(-1);
    if (created?.id) setSelectedLessonId(created.id);
  };

  const handleEditLesson = async (item) => {
    const title = window.prompt("Lesson title", item.title);
    if (!title) return;
    try {
      const updated = await updateLesson(item.id, { title });
      setLesson((current) => (current?.id === updated.id ? updated : current));
      await loadLibrary();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteLesson = async (item) => {
    if (!window.confirm(`Delete lesson "${item.title}"?`)) return;
    const next = await refreshAfter(() => deleteLesson(item.id));
    if (selectedLessonId === item.id) {
      setSelectedLessonId(next?.levels?.[0]?.lessons?.[0]?.id || "");
    }
  };

  const toggleLevel = (levelId) => {
    setExpandedLevelIds((current) =>
      current.includes(levelId) ? current.filter((id) => id !== levelId) : [...current, levelId],
    );
  };

  if (error && !library) {
    return <div className="ff-shell"><div className="ff-empty">{error}</div></div>;
  }

  const fullLessonText = lessonFrenchText(lesson);

  return (
    <div className={`ff-shell ${collapsed ? "is-collapsed" : ""}`}>
      <Sidebar
        activeLessonId={selectedLessonId}
        collapsed={collapsed}
        expandedLevelIds={expandedLevelIds}
        library={library}
        onAddLesson={handleAddLesson}
        onAddLevel={handleAddLevel}
        onDeleteLesson={handleDeleteLesson}
        onDeleteLevel={handleDeleteLevel}
        onEditLesson={handleEditLesson}
        onEditLevel={handleEditLevel}
        onSelectLesson={setSelectedLessonId}
        onToggle={() => setCollapsed((value) => !value)}
        onToggleLevel={toggleLevel}
      />

      <main className="ff-main">
        <header className="ff-lesson-header">
          <div>
            <p className="ff-kicker">French / English / Spanish</p>
            <h1>{lesson?.title || "Free French"}</h1>
            <p>{lesson?.subtitle || "Loading..."}</p>
          </div>
          <div className="ff-header-actions">
            {fullLessonText && (
              <button className="ff-primary-button" onClick={() => speak(fullLessonText, "lesson:all", "fr")} type="button">
                {loadingKey === "lesson:all" ? <Loader2 className="ff-spin" size={16} /> : <Volume2 size={16} />}
                French
              </button>
            )}
            <span className="ff-md-pill" title="Markdown inbox">
              <FileText size={15} />
              {library?.mdInbox?.length || 0} MD
            </span>
          </div>
        </header>

        {(error || ttsError) && <div className="ff-error">{error || ttsError}</div>}

        {lesson ? (
          <div className="ff-content">
            <section className="ff-brief">
              <div>
                <h2>Focus</h2>
                <ul>
                  {(lesson.overview || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2>Duolingo bridge</h2>
                <p>{lesson.duolingoBridge}</p>
              </div>
            </section>

            {(lesson.sections || []).map((section) => (
              <LessonSection
                key={section.id}
                loadingKey={loadingKey}
                onSpeak={speak}
                section={section}
                speakingKey={speakingKey}
              />
            ))}
          </div>
        ) : (
          <div className="ff-empty">Choose a lesson from the left.</div>
        )}
      </main>
    </div>
  );
}
