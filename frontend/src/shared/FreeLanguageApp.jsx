import { useCallback, useEffect, useMemo, useState } from "react";
import {
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

import "./freeLanguage.css";
import { isTtsCancelled, useTts } from "./useTts";

function AudioButton({ active, loading, onClick, title = "Play" }) {
  return (
    <button
      aria-label={title}
      className={`fl-audio-button ${active ? "is-active" : ""}`}
      disabled={loading}
      onClick={onClick}
      title={title}
      type="button"
    >
      {loading ? <Loader2 className="fl-spin" size={14} /> : <Volume2 size={14} />}
    </button>
  );
}

function speakable(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(". ");
  return String(value || "").trim();
}

function valueFor(item, key) {
  return item?.[key] || "";
}

function sectionTargetText(section, targetKey) {
  if (section.kind === "verbs") {
    return (section.verbs || [])
      .flatMap((verb) => [valueFor(verb, targetKey), ...(verb.forms || []), verb.example])
      .filter(Boolean)
      .join(". ");
  }
  if (section.kind === "vocabulary") {
    return (section.items || [])
      .flatMap((item) => [valueFor(item, targetKey), item.example])
      .filter(Boolean)
      .join(". ");
  }
  if (section.kind === "cards") {
    return (section.items || []).map((item) => valueFor(item, targetKey)).filter(Boolean).join(". ");
  }
  if (section.kind === "dialogue") {
    return (section.lines || []).map((line) => valueFor(line, targetKey)).filter(Boolean).join(". ");
  }
  if (section.kind === "table") {
    return (section.rows || []).map((row) => row[0]).filter(Boolean).join(". ");
  }
  return "";
}

function lessonTargetText(lesson, targetKey) {
  return (lesson?.sections || [])
    .map((section) => sectionTargetText(section, targetKey))
    .filter(Boolean)
    .join(". ");
}

function languageForColumn(column = "", config) {
  const value = column.toLowerCase();
  const allLanguages = [config.targetLanguage, ...(config.supportLanguages || [])];
  const match = allLanguages.find((language) => value.includes(language.label.toLowerCase()) || value === language.key);
  return match?.key || config.targetLanguage.key;
}

function Sidebar({
  activeLessonId,
  collapsed,
  config,
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
  const lessonNumberById = new Map();
  let nextLessonNumber = 1;
  for (const level of library?.levels || []) {
    for (const lesson of level.lessons || []) {
      lessonNumberById.set(lesson.id, nextLessonNumber);
      nextLessonNumber += 1;
    }
  }

  return (
    <aside className="fl-sidebar">
      <div className="fl-sidebar-top">
        <div className="fl-brand" title={config.brandTitle}>
          <div className="fl-brand-mark">{config.brandMark}</div>
          {!collapsed && (
            <div>
              <strong>{config.brandTitle}</strong>
              <span>{config.brandSubtitle}</span>
            </div>
          )}
        </div>
        <button className="fl-icon-button" onClick={onToggle} title="Collapse sidebar" type="button">
          {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
        </button>
      </div>

      {!collapsed && (
        <button className="fl-add-level" onClick={onAddLevel} type="button">
          <Plus size={15} />
          Level
        </button>
      )}

      <nav className="fl-level-list" aria-label={`${config.brandTitle} lessons`}>
        {(library?.levels || []).map((level) => {
          const isOpen = expandedLevelIds.includes(level.id);
          return (
            <section className="fl-level" key={level.id}>
              <div className="fl-level-row">
                <button
                  className="fl-level-toggle"
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
                  <div className="fl-row-actions">
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
                <div className="fl-lesson-list">
                  {(level.lessons || []).map((lesson) => (
                    <button
                      className={`fl-lesson-link ${activeLessonId === lesson.id ? "is-active" : ""}`}
                      key={lesson.id}
                      onClick={() => onSelectLesson(lesson.id)}
                      type="button"
                    >
                      <span className="fl-lesson-number">{lessonNumberById.get(lesson.id)}</span>
                      <span>
                        <strong>{lesson.title}</strong>
                        <small>{lesson.subtitle}</small>
                      </span>
                      <span className="fl-lesson-actions">
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
    <span className="fl-speak-cell">
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

function TranslationLine({ item, languages }) {
  const parts = languages.map((language) => valueFor(item, language.key)).filter(Boolean);
  if (!parts.length && !item.note) return null;
  return <small>{[...parts, item.note].filter(Boolean).join(" · ")}</small>;
}

function CardsSection({ config, loadingKey, onSpeak, section, speakingKey }) {
  return (
    <div className="fl-card-grid">
      {(section.items || []).map((item, index) => (
        <article className="fl-triad" key={`${section.id}-${index}`}>
          <SpeakCell
            itemKey={`${section.id}:card:${index}:${config.targetLanguage.key}`}
            language={config.targetLanguage.key}
            loadingKey={loadingKey}
            onSpeak={onSpeak}
            speakingKey={speakingKey}
          >
            {valueFor(item, config.targetLanguage.key)}
          </SpeakCell>
          <TranslationLine item={item} languages={config.supportLanguages} />
        </article>
      ))}
    </div>
  );
}

function DialogueSection({ config, loadingKey, onSpeak, section, speakingKey }) {
  return (
    <div className="fl-dialogue">
      {(section.lines || []).map((line, index) => (
        <div className="fl-dialogue-line" key={`${section.id}-${index}`}>
          <b>{line.speaker}</b>
          <SpeakCell
            itemKey={`${section.id}:line:${index}:${config.targetLanguage.key}`}
            language={config.targetLanguage.key}
            loadingKey={loadingKey}
            onSpeak={onSpeak}
            speakingKey={speakingKey}
          >
            {valueFor(line, config.targetLanguage.key)}
          </SpeakCell>
          <TranslationLine item={line} languages={config.supportLanguages} />
        </div>
      ))}
    </div>
  );
}

function TableSection({ config, loadingKey, onSpeak, section, speakingKey }) {
  return (
    <div className="fl-table-wrap">
      <table className="fl-table">
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
                    language={languageForColumn(section.columns?.[cellIndex], config)}
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

function VocabularySection({ config, loadingKey, onSpeak, section, speakingKey }) {
  return (
    <div className="fl-vocab-grid">
      {(section.items || []).map((item) => (
        <article className="fl-vocab-row" key={valueFor(item, config.targetLanguage.key)}>
          <div className="fl-vocab-main">
            <SpeakCell
              itemKey={`${section.id}:word:${valueFor(item, config.targetLanguage.key)}`}
              language={config.targetLanguage.key}
              loadingKey={loadingKey}
              onSpeak={onSpeak}
              speakingKey={speakingKey}
            >
              {valueFor(item, config.targetLanguage.key)}
            </SpeakCell>
            <TranslationLine item={item} languages={config.supportLanguages} />
          </div>
          <div className="fl-vocab-example">
            <SpeakCell
              itemKey={`${section.id}:word-example:${valueFor(item, config.targetLanguage.key)}`}
              language={config.targetLanguage.key}
              loadingKey={loadingKey}
              onSpeak={onSpeak}
              speakingKey={speakingKey}
            >
              {item.example}
            </SpeakCell>
            {item.exampleEn && <small>{item.exampleEn}</small>}
          </div>
        </article>
      ))}
    </div>
  );
}

function VerbsSection({ config, loadingKey, onSpeak, section, speakingKey }) {
  return (
    <div className="fl-verb-list">
      {(section.verbs || []).map((verb) => (
        <article className="fl-verb-row" key={valueFor(verb, config.targetLanguage.key)}>
          <div className="fl-verb-head">
            <SpeakCell
              itemKey={`${section.id}:verb:${valueFor(verb, config.targetLanguage.key)}`}
              language={config.targetLanguage.key}
              loadingKey={loadingKey}
              onSpeak={onSpeak}
              speakingKey={speakingKey}
            >
              {valueFor(verb, config.targetLanguage.key)}
            </SpeakCell>
            <TranslationLine item={verb} languages={config.supportLanguages} />
          </div>
          <div className="fl-form-grid">
            {(verb.forms || []).map((form) => (
              <button
                className={`fl-form-chip ${speakingKey === `${section.id}:form:${form}` ? "is-active" : ""}`}
                key={form}
                onClick={() => onSpeak(form, `${section.id}:form:${form}`, config.targetLanguage.key)}
                type="button"
              >
                {loadingKey === `${section.id}:form:${form}` && <Loader2 className="fl-spin" size={12} />}
                {form}
              </button>
            ))}
          </div>
          <div className="fl-example-line">
            <SpeakCell
              itemKey={`${section.id}:example:${valueFor(verb, config.targetLanguage.key)}`}
              language={config.targetLanguage.key}
              loadingKey={loadingKey}
              onSpeak={onSpeak}
              speakingKey={speakingKey}
            >
              {verb.example}
            </SpeakCell>
            {verb.exampleEn && <small>{verb.exampleEn}</small>}
          </div>
        </article>
      ))}
    </div>
  );
}

function LessonSection({ config, loadingKey, onSpeak, section, speakingKey }) {
  const sectionText = sectionTargetText(section, config.targetLanguage.key);
  return (
    <section className="fl-section">
      <header className="fl-section-header">
        <h2>{section.title}</h2>
        {sectionText && (
          <AudioButton
            active={speakingKey === `section:${section.id}`}
            loading={loadingKey === `section:${section.id}`}
            onClick={() => onSpeak(sectionText, `section:${section.id}`, config.targetLanguage.key)}
            title={`Play this section in ${config.targetLanguage.label}`}
          />
        )}
      </header>
      {section.kind === "table" && <TableSection config={config} loadingKey={loadingKey} onSpeak={onSpeak} section={section} speakingKey={speakingKey} />}
      {section.kind === "cards" && <CardsSection config={config} loadingKey={loadingKey} onSpeak={onSpeak} section={section} speakingKey={speakingKey} />}
      {section.kind === "dialogue" && <DialogueSection config={config} loadingKey={loadingKey} onSpeak={onSpeak} section={section} speakingKey={speakingKey} />}
      {section.kind === "vocabulary" && <VocabularySection config={config} loadingKey={loadingKey} onSpeak={onSpeak} section={section} speakingKey={speakingKey} />}
      {section.kind === "verbs" && <VerbsSection config={config} loadingKey={loadingKey} onSpeak={onSpeak} section={section} speakingKey={speakingKey} />}
    </section>
  );
}

export default function FreeLanguageApp({ api, config }) {
  const [library, setLibrary] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [expandedLevelIds, setExpandedLevelIds] = useState(config.defaultExpandedLevelIds || []);
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
    const data = await api.fetchLibrary();
    setLibrary(data);
    setSelectedLessonId((current) => current || data.levels?.[0]?.lessons?.[0]?.id || "");
    setExpandedLevelIds((current) => {
      const known = new Set(data.levels?.map((level) => level.id));
      const kept = current.filter((id) => known.has(id));
      return kept.length ? kept : [data.levels?.[0]?.id].filter(Boolean);
    });
    return data;
  }, [api]);

  useEffect(() => {
    loadLibrary().catch((err) => setError(err.message));
  }, [loadLibrary]);

  useEffect(() => {
    const lessonId = selectedLessonId || firstLessonId;
    if (!lessonId) return;
    api.fetchLesson(lessonId)
      .then(setLesson)
      .catch((err) => setError(err.message));
  }, [api, firstLessonId, selectedLessonId]);

  const speak = useCallback(
    async (text, key, language = config.targetLanguage.key) => {
      try {
        await play({
          key,
          waitForEnd: false,
          getUrl: async () => {
            const data = await api.requestTts({ lessonId: selectedLessonId, text, language });
            return { url: data.audio_url };
          },
        });
      } catch (err) {
        if (!isTtsCancelled(err)) setError(err.message);
      }
    },
    [api, config.targetLanguage.key, play, selectedLessonId],
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
    refreshAfter(() => api.createLevel({ title, subtitle: "Custom path" }));
  };

  const handleEditLevel = (level) => {
    const title = window.prompt("Level name", level.title);
    if (!title) return;
    refreshAfter(() => api.updateLevel(level.id, { title }));
  };

  const handleDeleteLevel = (level) => {
    if (!window.confirm(`Delete level "${level.title}"? Empty levels only.`)) return;
    refreshAfter(() => api.deleteLevel(level.id));
  };

  const handleAddLesson = async (levelId) => {
    const title = window.prompt("Lesson title", "New speakable note");
    if (!title) return;
    const next = await refreshAfter(() =>
      api.createLesson(levelId, {
        title,
        subtitle: "Draft lesson",
        overview: [`Add ${config.targetLanguage.label} and translation notes here later.`],
        sections: [config.emptyLessonSection],
      }),
    );
    const created = next?.levels?.find((level) => level.id === levelId)?.lessons?.at(-1);
    if (created?.id) setSelectedLessonId(created.id);
  };

  const handleEditLesson = async (item) => {
    const title = window.prompt("Lesson title", item.title);
    if (!title) return;
    try {
      const updated = await api.updateLesson(item.id, { title });
      setLesson((current) => (current?.id === updated.id ? updated : current));
      await loadLibrary();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteLesson = async (item) => {
    if (!window.confirm(`Delete lesson "${item.title}"?`)) return;
    const next = await refreshAfter(() => api.deleteLesson(item.id));
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
    return <div className="fl-shell"><div className="fl-empty">{error}</div></div>;
  }

  const fullLessonText = lessonTargetText(lesson, config.targetLanguage.key);

  return (
    <div className={`fl-shell ${collapsed ? "is-collapsed" : ""}`} style={{ "--fl-accent": config.accent }}>
      <Sidebar
        activeLessonId={selectedLessonId}
        collapsed={collapsed}
        config={config}
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

      <main className="fl-main">
        <header className="fl-lesson-header">
          <div>
            <p className="fl-kicker">{config.kicker}</p>
            <h1>{lesson?.title || config.brandTitle}</h1>
            <p>{lesson?.subtitle || "Loading..."}</p>
          </div>
          <div className="fl-header-actions">
            {fullLessonText && (
              <button className="fl-primary-button" onClick={() => speak(fullLessonText, "lesson:all", config.targetLanguage.key)} type="button">
                {loadingKey === "lesson:all" ? <Loader2 className="fl-spin" size={16} /> : <Volume2 size={16} />}
                {config.targetLanguage.label}
              </button>
            )}
            <span className="fl-md-pill" title="Markdown inbox">
              <FileText size={15} />
              {library?.mdInbox?.length || 0} MD
            </span>
          </div>
        </header>

        {(error || ttsError) && <div className="fl-error">{error || ttsError}</div>}

        {lesson ? (
          <div className="fl-content">
            <section className="fl-brief">
              <div>
                <h2>Focus</h2>
                <ul>
                  {(lesson.overview || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>

            {(lesson.sections || []).map((section) => (
              <LessonSection
                config={config}
                key={section.id}
                loadingKey={loadingKey}
                onSpeak={speak}
                section={section}
                speakingKey={speakingKey}
              />
            ))}
          </div>
        ) : (
          <div className="fl-empty">Choose a lesson from the left.</div>
        )}
      </main>
    </div>
  );
}
