import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock3,
  Command,
  Files,
  FolderOpen,
  Hash,
  LayoutGrid,
  Link2,
  List,
  NotebookPen,
  PencilLine,
  Plus,
  Search,
  Settings2,
  Sparkles,
  TextCursorInput,
  Trash2,
  X,
} from "lucide-react";

const SAMPLE_NOTE = "笔记/欢迎来到 Notebook.md";
const viewOptions = [
  { id: "split", label: "对照", icon: LayoutGrid },
  { id: "read", label: "阅读", icon: BookOpen },
  { id: "write", label: "源码", icon: TextCursorInput },
];
const PREFERENCES_KEY = "notebook:desktop-preferences";
const RECENT_KEY = "notebook:recent-note-ids";

const cleanTitle = (id = "") =>
  id.split("/").pop()?.replace(/\.md$/i, "").replace(/[-_]/g, " ") ||
  "未命名笔记";
const dateKey = (value = "") => String(value).slice(0, 10);
const localDateId = (value = new Date()) =>
  `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
const dateLabel = (value) =>
  new Intl.DateTimeFormat("zh-CN", { month: "short", day: "numeric" }).format(
    new Date(value),
  );
const noteTitleFromRaw = (raw, fallback) =>
  raw.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1] ||
  raw.match(/^#\s+(.+)$/m)?.[1] ||
  fallback;
const toAnchor = (value) =>
  String(Array.isArray(value) ? value.join("") : value)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "") || "section";
const noteUrl = (id) =>
  `/api/notes/${id.split("/").map(encodeURIComponent).join("/")}`;

function readPreferences() {
  try {
    return JSON.parse(localStorage.getItem(PREFERENCES_KEY) || "{}");
  } catch {
    return {};
  }
}

function readRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function fromFrontmatter(raw) {
  return raw.replace(/^---[\s\S]*?---\s*/m, "");
}
function markdownWithLinks(raw) {
  return fromFrontmatter(raw).replace(
    /\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g,
    (_all, target, alias) =>
      `[${alias || target}](#note/${encodeURIComponent(target.trim())})`,
  );
}
function extractHeadings(raw) {
  return [...fromFrontmatter(raw).matchAll(/^(#{1,3})\s+(.+)$/gm)].map(
    (match) => ({
      level: match[1].length,
      title: match[2].replace(/[*_`]/g, ""),
      id: toAnchor(match[2].replace(/[*_`]/g, "")),
    }),
  );
}
function cardAccent(id) {
  const colors = ["sun", "rose", "blue", "ink", "lavender", "mint"];
  return colors[
    [...id].reduce((total, char) => total + char.charCodeAt(0), 0) %
      colors.length
  ];
}
function tilePreview(title = "") {
  const characters = [...title];
  return characters.length > 5
    ? `${characters.slice(0, 5).join("")}…`
    : characters.join("");
}
function normalizeTag(value) {
  return String(value || "")
    .replace(/^#/, "")
    .trim()
    .replace(/[\[\],\n]/g, "");
}

function hasMeaningfulDraft(raw) {
  const content = fromFrontmatter(raw);
  const title = noteTitleFromRaw(raw, "未命名笔记").trim();
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim() || "";
  const body = content.replace(/^#\s+.*$/m, "").trim();
  return Boolean(
    body ||
      title !== "未命名笔记" ||
      (heading && heading !== "未命名笔记"),
  );
}

function replaceTags(raw, tags) {
  const uniqueTags = [...new Set(tags.map(normalizeTag).filter(Boolean))];
  const tagLine = `tags: [${uniqueTags.map((tag) => JSON.stringify(tag)).join(", ")}]`;
  if (!raw.startsWith("---\n")) return `---\n${tagLine}\n---\n\n${raw}`;
  const closeAt = raw.indexOf("\n---", 3);
  if (closeAt < 0) return raw;
  const frontmatter = raw.slice(0, closeAt + 4);
  const body = raw.slice(closeAt + 4);
  const nextFrontmatter = /^tags:.*$/m.test(frontmatter)
    ? frontmatter.replace(/^tags:.*$/m, tagLine)
    : `${frontmatter.slice(0, -3)}${tagLine}\n---`;
  return `${nextFrontmatter}${body}`;
}

function App() {
  const savedPreferences = readPreferences();
  const [notes, setNotes] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [raw, setRaw] = useState("");
  const [view, setView] = useState(savedPreferences.view || "read");
  const [displayMode, setDisplayMode] = useState(
    savedPreferences.displayMode || "list",
  );
  const [deckOpen, setDeckOpen] = useState(savedPreferences.deckOpen ?? false);
  const [deckExpanded, setDeckExpanded] = useState(
    savedPreferences.deckExpanded ?? false,
  );
  const [panels, setPanels] = useState(
    savedPreferences.panels || {
      sidebar: false,
      library: false,
      details: false,
    },
  );
  const [collectionView, setCollectionView] = useState("notes");
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [calendarCursor, setCalendarCursor] = useState(new Date());
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isTagManagerOpen, setTagManagerOpen] = useState(false);
  const [wikiQuery, setWikiQuery] = useState("");
  const [isWikiSuggestOpen, setWikiSuggestOpen] = useState(false);
  const [wikiSuggestionIndex, setWikiSuggestionIndex] = useState(0);
  const [tagInput, setTagInput] = useState("");
  const [draftId, setDraftId] = useState("");
  const [recentIds, setRecentIds] = useState(readRecent);
  const [isSaving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [isLoadingNote, setLoadingNote] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const scrollRef = useRef(null);
  const editorRef = useRef(null);
  const saveTimer = useRef(null);
  const loadRequest = useRef(0);
  const activeIdRef = useRef("");
  const rawRef = useRef("");
  const draftIdRef = useRef("");

  useEffect(() => {
    localStorage.setItem(
      PREFERENCES_KEY,
      JSON.stringify({ view, displayMode, deckOpen, deckExpanded, panels }),
    );
  }, [view, displayMode, deckOpen, deckExpanded, panels]);
  useEffect(() => {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recentIds));
  }, [recentIds]);
  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(""), 2600);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    activeIdRef.current = activeId;
    rawRef.current = raw;
  }, [activeId, raw]);

  const refreshNotes = useCallback(async (force = false) => {
    const response = await fetch(`/api/notes${force ? "?refresh=1" : ""}`);
    if (!response.ok) throw new Error("无法读取你的 Markdown 笔记");
    const nextNotes = await response.json();
    setNotes(nextNotes);
    return nextNotes;
  }, []);
  const remember = useCallback(
    (id) =>
      setRecentIds((previous) =>
        [id, ...previous.filter((item) => item !== id)].slice(0, 3),
      ),
    [],
  );
  const loadNote = useCallback(
    async (id) => {
      if (!id) return;
      const previousDraftId = draftIdRef.current;
      if (previousDraftId && previousDraftId === activeIdRef.current) {
        clearTimeout(saveTimer.current);
        if (hasMeaningfulDraft(rawRef.current)) {
          void save(rawRef.current, previousDraftId);
        }
        draftIdRef.current = "";
        setDraftId("");
      }
      const request = ++loadRequest.current;
      setActiveId(id);
      setRaw("");
      activeIdRef.current = id;
      rawRef.current = "";
      setLoadingNote(true);
      try {
        const response = await fetch(noteUrl(id));
        if (!response.ok) throw new Error("笔记不存在或已被移动");
        const note = await response.json();
        if (request !== loadRequest.current) return;
        setRaw(note.raw);
        rawRef.current = note.raw;
        setSavedAt(null);
        setError("");
        remember(id);
      } catch (loadError) {
        if (request === loadRequest.current) setError(loadError.message);
      } finally {
        if (request === loadRequest.current) setLoadingNote(false);
      }
    },
    [remember],
  );

  useEffect(() => {
    refreshNotes()
      .then((loaded) =>
        loadNote(
          loaded.find((note) => note.id === SAMPLE_NOTE)?.id || loaded[0]?.id,
        ),
      )
      .catch((loadError) => setError(loadError.message));
  }, [loadNote, refreshNotes]);
  const save = useCallback(
    async (nextRaw = raw, noteId = activeId) => {
      if (!noteId) return;
      setSaving(true);
      try {
        const response = await fetch(noteUrl(noteId), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ raw: nextRaw }),
        });
        if (!response.ok) throw new Error("保存失败，请检查 vault 文件夹权限");
        const updated = await response.json();
        setNotes((previous) => [
          updated,
          ...previous.filter((note) => note.id !== noteId),
        ]);
        if (draftIdRef.current === noteId) {
          draftIdRef.current = "";
          setDraftId("");
          remember(noteId);
        }
        setSavedAt(new Date());
        setError("");
      } catch (saveError) {
        setError(saveError.message);
      } finally {
        setSaving(false);
      }
    },
    [activeId, raw, remember],
  );
  const onEdit = (value) => {
    setRaw(value);
    rawRef.current = value;
    setSavedAt(null);
    clearTimeout(saveTimer.current);
    if (draftIdRef.current === activeId && !hasMeaningfulDraft(value)) return;
    const noteId = activeId;
    saveTimer.current = setTimeout(() => save(value, noteId), 700);
  };

  useEffect(() => () => clearTimeout(saveTimer.current), []);
  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        clearTimeout(saveTimer.current);
        save();
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "n") {
        event.preventDefault();
        makeNote();
      }
      if (
        (event.metaKey || event.ctrlKey) &&
        event.shiftKey &&
        event.key.toLowerCase() === "f"
      ) {
        event.preventDefault();
        setDeckOpen((open) => !open);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setTagManagerOpen(false);
        setWikiSuggestOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const activeNote = notes.find((note) => note.id === activeId) || {
    id: activeId,
    title: cleanTitle(activeId),
    tags: [],
  };
  const allTags = useMemo(
    () =>
      [...new Set(notes.flatMap((note) => note.tags || []))].sort((a, b) =>
        a.localeCompare(b, "zh-CN"),
      ),
    [notes],
  );
  const notesByDate = useMemo(
    () =>
      notes.reduce((map, note) => {
        const key = dateKey(note.date);
        map.set(key, [...(map.get(key) || []), note]);
        return map;
      }, new Map()),
    [notes],
  );
  const filteredNotes = useMemo(
    () =>
      notes.filter((note) => {
        const haystack =
          `${note.title} ${note.excerpt} ${note.tags.join(" ")}`.toLowerCase();
        return (
          (!selectedTag || note.tags.includes(selectedTag)) &&
          (!selectedDate || dateKey(note.date) === selectedDate) &&
          (!query || haystack.includes(query.toLowerCase()))
        );
      }),
    [notes, query, selectedTag, selectedDate],
  );
  const headings = useMemo(() => extractHeadings(raw), [raw]);
  const outgoing = useMemo(
    () =>
      [...fromFrontmatter(raw).matchAll(/\[\[([^\]|#]+)/g)].map((match) =>
        match[1].trim(),
      ),
    [raw],
  );
  const linkedNotes = useMemo(
    () =>
      notes.filter((note) =>
        outgoing.some(
          (title) => title === note.title || title === cleanTitle(note.id),
        ),
      ),
    [notes, outgoing],
  );
  const backlinks = useMemo(
    () =>
      notes.filter(
        (note) =>
          note.id !== activeId &&
          note.links?.some(
            (title) =>
              title === activeNote.title || title === cleanTitle(activeId),
          ),
      ),
    [notes, activeId, activeNote.title],
  );
  const words = fromFrontmatter(raw).trim()
    ? fromFrontmatter(raw).trim().split(/\s+/).length
    : 0;
  const recentNotes = recentIds
    .map((id) => notes.find((note) => note.id === id))
    .filter(Boolean);
  const wikiSuggestions = useMemo(
    () =>
      notes
        .filter((note) => note.title.toLowerCase().includes(wikiQuery.toLowerCase()))
        .sort((a, b) => {
          const startsA = a.title.toLowerCase().startsWith(wikiQuery.toLowerCase());
          const startsB = b.title.toLowerCase().startsWith(wikiQuery.toLowerCase());
          return Number(startsB) - Number(startsA) || a.title.localeCompare(b.title, "zh-CN");
        })
        .slice(0, 7),
    [notes, wikiQuery],
  );

  async function makeNote(daily = false) {
    const previousDraftId = draftIdRef.current;
    if (previousDraftId && previousDraftId === activeIdRef.current) {
      clearTimeout(saveTimer.current);
      if (hasMeaningfulDraft(rawRef.current)) {
        void save(rawRef.current, previousDraftId);
      }
      draftIdRef.current = "";
      setDraftId("");
    }
    const today = localDateId();
    let title = daily ? today : "未命名笔记";
    let id = daily ? `日记/${today}.md` : `笔记/${title}.md`;
    if (daily && notes.some((note) => note.id === id)) return loadNote(id);
    if (!daily) {
      let count = 2;
      while (notes.some((note) => note.id === id)) {
        title = `未命名笔记 ${count++}`;
        id = `笔记/${title}.md`;
      }
    }
    const initial = `---\ntitle: ${title}\ndate: ${today}\ntags: [${daily ? "日记" : ""}]\n---\n\n# ${title}\n\n`;
    setActiveId(id);
    setRaw(initial);
    activeIdRef.current = id;
    rawRef.current = initial;
    setView("split");
    if (daily) {
      await save(initial, id);
      remember(id);
    } else {
      draftIdRef.current = id;
      setDraftId(id);
      setNotice("空白草稿将在输入内容后才保存");
    }
  }
  function updatePanels(panel) {
    setPanels((previous) => ({ ...previous, [panel]: !previous[panel] }));
  }
  function openCalendar() {
    setCollectionView("calendar");
    setQuery("");
  }
  function showNotes(options = {}) {
    setCollectionView("notes");
    if (options.clearDate) setSelectedDate("");
  }
  function selectDay(day) {
    setSelectedDate(day);
  }
  function resolveWikiLink(href) {
    const target = decodeURIComponent(href.replace("#note/", ""));
    const match = notes.find(
      (note) => note.title === target || cleanTitle(note.id) === target,
    );
    if (match) loadNote(match.id);
    else setNotice(`“${target}” 还不是一篇已存在的笔记`);
  }
  function browse(direction) {
    if (!filteredNotes.length) return;
    const index = Math.max(
      0,
      filteredNotes.findIndex((note) => note.id === activeId),
    );
    loadNote(
      filteredNotes[
        (index + direction + filteredNotes.length) % filteredNotes.length
      ].id,
    );
    scrollRef.current?.scrollBy({ left: direction * 250, behavior: "smooth" });
  }
  function updateWikiSuggestions(value, cursor) {
    const match = value.slice(0, cursor).match(/\[\[([^\]|#\]]*)$/);
    setWikiSuggestOpen(Boolean(match));
    setWikiQuery(match ? match[1].trim() : "");
    setWikiSuggestionIndex(0);
  }
  function handleEditorChange(event) {
    onEdit(event.target.value);
    updateWikiSuggestions(event.target.value, event.target.selectionStart);
  }
  function chooseWikiSuggestion(title) {
    const editor = editorRef.current;
    const cursor = editor?.selectionStart ?? raw.length;
    const match = raw.slice(0, cursor).match(/\[\[([^\]|#\]]*)$/);
    if (!match) return;
    const start = cursor - match[0].length;
    const nextRaw = `${raw.slice(0, start)}[[${title}]]${raw.slice(cursor)}`;
    const nextCursor = start + title.length + 4;
    onEdit(nextRaw);
    setWikiSuggestOpen(false);
    requestAnimationFrame(() => {
      editor?.focus();
      editor?.setSelectionRange(nextCursor, nextCursor);
    });
  }
  function handleEditorKeyDown(event) {
    if (!isWikiSuggestOpen) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!wikiSuggestions.length) return;
      setWikiSuggestionIndex((index) =>
        event.key === "ArrowDown"
          ? (index + 1) % wikiSuggestions.length
          : (index - 1 + wikiSuggestions.length) % wikiSuggestions.length,
      );
    }
    if ((event.key === "Enter" || event.key === "Tab") && wikiSuggestions[wikiSuggestionIndex]) {
      event.preventDefault();
      chooseWikiSuggestion(wikiSuggestions[wikiSuggestionIndex].title);
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setWikiSuggestOpen(false);
    }
  }
  async function saveActiveTags(nextTags) {
    if (!activeId || !raw) return;
    const nextRaw = replaceTags(raw, nextTags);
    clearTimeout(saveTimer.current);
    setRaw(nextRaw);
    await save(nextRaw, activeId);
  }
  async function addTag() {
    const tag = normalizeTag(tagInput);
    if (!tag) return;
    if (activeNote.tags.includes(tag)) {
      setTagInput("");
      return;
    }
    setTagInput("");
    await saveActiveTags([...activeNote.tags, tag]);
  }
  async function mutateTag(endpoint, body, successMessage) {
    clearTimeout(saveTimer.current);
    if (activeId && raw) await save(raw, activeId);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      setError("标签更新失败");
      return;
    }
    const result = await response.json();
    setNotes(result.notes);
    if (body.from && selectedTag === body.from) setSelectedTag(body.to);
    if (body.tag && selectedTag === body.tag) setSelectedTag("");
    if (activeId) await loadNote(activeId);
    setNotice(`${successMessage} · 更新了 ${result.changed} 篇笔记`);
  }
  async function deleteTag(tag) {
    if (!window.confirm(`确定从所有笔记移除标签“${tag}”吗？`)) return;
    await mutateTag("/api/tags/delete", { tag }, `已删除 #${tag}`);
  }
  async function deleteActiveNote() {
    if (!activeId) return;
    clearTimeout(saveTimer.current);
    const remaining = notes.filter((note) => note.id !== activeId);
    if (draftId === activeId) {
      draftIdRef.current = "";
      setDraftId("");
      setNotice("已丢弃空白草稿");
    } else {
      const title = noteTitleFromRaw(raw, activeNote.title);
      if (!window.confirm(`确定永久删除“${title}”吗？`)) return;
      const response = await fetch(noteUrl(activeId), { method: "DELETE" });
      if (!response.ok) {
        setError("删除笔记失败");
        return;
      }
      setNotes(remaining);
      setRecentIds((previous) => previous.filter((id) => id !== activeId));
      setNotice(`已删除“${title}”`);
    }
    const nextNote = remaining[0];
    if (nextNote) {
      await loadNote(nextNote.id);
    } else {
      setActiveId("");
      setRaw("");
      activeIdRef.current = "";
      rawRef.current = "";
    }
  }

  return (
    <main
      className={`app-shell ${panels.sidebar ? "sidebar-collapsed" : ""} ${panels.library ? "library-collapsed" : ""} ${panels.details ? "details-collapsed" : ""}`}
    >
      <aside className="sidebar">
        <button
          className="panel-toggle sidebar-toggle"
          onClick={() => updatePanels("sidebar")}
          title={panels.sidebar ? "展开导航栏" : "折叠导航栏"}
        >
          {panels.sidebar ? (
            <ChevronRight size={17} />
          ) : (
            <ChevronLeft size={17} />
          )}
        </button>
        <button
          className="compact-rail"
          onClick={() => updatePanels("sidebar")}
          title="展开导航"
        >
          <NotebookPen size={19} />
        </button>
        <div className="sidebar-content">
          <div className="brand">
            <span className="brand-mark">
              <NotebookPen size={19} />
            </span>
            <span>Notebook</span>
          </div>
          <button className="new-note" onClick={() => makeNote()}>
            <Plus size={17} /> 新建笔记 <kbd>⌘ N</kbd>
          </button>
          <button
            className="search-trigger"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={16} />
            <span>搜索</span>
            <kbd>⌘ K</kbd>
          </button>
          <nav className="side-nav" aria-label="主要导航">
            <button
              className={`nav-item ${collectionView === "notes" && !selectedTag && !selectedDate ? "active" : ""}`}
              onClick={() => {
                setSelectedTag("");
                showNotes({ clearDate: true });
              }}
            >
              <Files size={17} /> 全部笔记 <span>{notes.length}</span>
            </button>
            <button className="nav-item" onClick={() => makeNote(true)}>
              <Clock3 size={17} /> 今日日记
            </button>
            <button
              className={`nav-item ${collectionView === "calendar" ? "active" : ""}`}
              onClick={openCalendar}
            >
              <CalendarDays size={17} /> 日历
            </button>
          </nav>
          {recentNotes.length > 0 && (
            <div className="recent-section">
              <div className="section-label">
                <span>最近打开</span>
                <Clock3 size={14} />
              </div>
              {recentNotes.slice(0, 3).map((note) => (
                <button
                  key={note.id}
                  className="recent-note"
                  onClick={() => loadNote(note.id)}
                >
                  {note.title}
                </button>
              ))}
            </div>
          )}
          <div className="sidebar-section">
            <div className="section-label">
              <span>标签</span>
              <button
                className="tiny-icon"
                onClick={() => setTagManagerOpen(true)}
                title="管理标签"
              >
                <Settings2 size={13} />
              </button>
            </div>
            <button
              className={`tag-filter ${!selectedTag ? "chosen" : ""}`}
              onClick={() => {
                setSelectedTag("");
                showNotes();
              }}
            >
              全部主题 <span>{notes.length}</span>
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`tag-filter ${selectedTag === tag ? "chosen" : ""}`}
                onClick={() => {
                  setSelectedTag(tag);
                  showNotes();
                }}
              >
                <span>
                  <i />
                  {tag}
                </span>
                <span>
                  {notes.filter((note) => note.tags.includes(tag)).length}
                </span>
              </button>
            ))}
          </div>
          <div className="vault-footer">
            <span className="vault-dot" /> 本地 Vault <strong>已连接</strong>
          </div>
        </div>
      </aside>

      <section className="library-panel">
        {panels.library && (
          <button
            className="panel-toggle library-toggle"
            onClick={() => updatePanels("library")}
            title="展开笔记栏"
          >
            <ChevronRight size={17} />
          </button>
        )}
        {panels.library ? (
          <button
            className="compact-rail light"
            onClick={() => updatePanels("library")}
            title="展开笔记栏"
          >
            <Files size={18} />
          </button>
        ) : (
          <>
            <header className="library-header">
              <div>
                <p className="eyebrow">个人知识库</p>
                <h1>
                  {collectionView === "calendar"
                    ? "日历"
                    : selectedTag
                      ? `# ${selectedTag}`
                      : selectedDate
                        ? selectedDate
                        : "全部笔记"}
                </h1>
              </div>
              <div className="library-actions">
                <button
                  className={`display-button ${displayMode === "list" ? "selected" : ""}`}
                  onClick={() => setDisplayMode("list")}
                  title="列表视图"
                >
                  <List size={17} />
                </button>
                <button
                  className={`display-button ${displayMode === "gallery" ? "selected" : ""}`}
                  onClick={() => setDisplayMode("gallery")}
                  title="小图视图"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  className="icon-button"
                  onClick={() => updatePanels("library")}
                  title="折叠笔记栏"
                >
                  <ChevronLeft size={17} />
                </button>
              </div>
            </header>
            {collectionView === "calendar" ? (
              <CalendarPane
                notesByDate={notesByDate}
                cursor={calendarCursor}
                setCursor={setCalendarCursor}
                selectedDate={selectedDate}
                onSelectDay={selectDay}
                onShowNotes={() => showNotes()}
                onPick={loadNote}
              />
            ) : (
              <>
                <div className="list-filter">
                  <Search size={15} />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="筛选标题、标签或摘要"
                  />
                  <button onClick={() => setQuery("")} aria-label="清空搜索">
                    {query && <X size={14} />}
                  </button>
                </div>
                {selectedDate && (
                  <button
                    className="date-filter-chip"
                    onClick={() => setSelectedDate("")}
                  >
                    <CalendarDays size={13} />
                    {selectedDate}
                    <X size={13} />
                  </button>
                )}
                <NoteCollection
                  notes={filteredNotes}
                  activeId={activeId}
                  displayMode={displayMode}
                  onPick={loadNote}
                />
              </>
            )}
          </>
        )}
      </section>

      <section className="workspace">
        <header className="workspace-header">
          <div className="crumbs">
            <FolderOpen size={15} />
            <span>
              {activeId.split("/").slice(0, -1).join(" / ") || "Notebook"}
            </span>
            <ChevronDown size={14} />
          </div>
          <div className="workspace-actions">
            <span className={`save-status ${isSaving ? "saving" : ""}`}>
              {isSaving ? (
                "保存中…"
              ) : isLoadingNote ? (
                "读取中…"
              ) : savedAt ? (
                <>
                  <Check size={14} /> 已保存
                </>
              ) : (
                "按需读取"
              )}
            </span>
            <button
              className={`deck-button ${deckOpen ? "selected" : ""}`}
              onClick={() => setDeckOpen((open) => !open)}
              title={deckOpen ? "收起翻书模式 ⌘⇧F" : "展开翻书模式 ⌘⇧F"}
            >
              <BookOpen size={16} />
            </button>
            {viewOptions.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`view-button ${view === id ? "selected" : ""}`}
                onClick={() => setView(id)}
                title={label}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
            <button
              className="icon-button destructive"
              onClick={deleteActiveNote}
              title="删除当前笔记"
              aria-label="删除当前笔记"
            >
              <Trash2 size={17} />
            </button>
          </div>
        </header>
        <div className={`document-view ${view}`}>
          {isLoadingNote ? (
            <div className="loading-note">
              <span /> 正在打开 Markdown…
            </div>
          ) : (
            <>
              {view !== "write" && (
                <article className="reader markdown-body">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ href, children, ...props }) =>
                        href?.startsWith("#note/") ? (
                          <a
                            href={href}
                            className="wiki-link"
                            onClick={(event) => {
                              event.preventDefault();
                              resolveWikiLink(href);
                            }}
                          >
                            <Link2 size={13} />
                            {children}
                          </a>
                        ) : (
                          <a
                            {...props}
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {children}
                          </a>
                        ),
                      h1: ({ children }) => (
                        <h1 id={toAnchor(children)}>{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 id={toAnchor(children)}>{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 id={toAnchor(children)}>{children}</h3>
                      ),
                    }}
                  >
                    {markdownWithLinks(raw)}
                  </ReactMarkdown>
                </article>
              )}
              {view !== "read" && (
                <div className="editor-pane">
                  <div className="editor-label">
                    <PencilLine size={14} /> Markdown 源码{" "}
                    <span>{words} 字</span>
                  </div>
                  <textarea
                    ref={editorRef}
                    aria-label="Markdown 编辑器"
                    value={raw}
                    onChange={handleEditorChange}
                    onSelect={(event) => updateWikiSuggestions(event.currentTarget.value, event.currentTarget.selectionStart)}
                    onKeyDown={handleEditorKeyDown}
                    spellCheck="false"
                  />
                  {isWikiSuggestOpen && (
                    <div className="wiki-suggest" role="listbox" aria-label="笔记链接联想">
                      <div className="wiki-suggest-title"><Link2 size={13} /> 链接到笔记 <kbd>↑↓</kbd><kbd>↵</kbd></div>
                      {wikiSuggestions.map((note, index) => (
                        <button
                          key={note.id}
                          className={index === wikiSuggestionIndex ? "selected" : ""}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => chooseWikiSuggestion(note.title)}
                          role="option"
                          aria-selected={index === wikiSuggestionIndex}
                        >
                          <span className={`link-dot ${cardAccent(note.id)}`} />
                          <span><strong>{note.title}</strong><small>{note.id}</small></span>
                        </button>
                      ))}
                      {!wikiSuggestions.length && <p>没有匹配的笔记；可继续输入后再新建。</p>}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        <footer
          className={`card-browser ${deckOpen ? "" : "minimized"} ${deckOpen && deckExpanded ? "expanded" : ""}`}
        >
          <div className="browser-head">
            <div>
              <span className="eyebrow">翻阅模式</span>
              <strong>
                {deckOpen
                  ? "像翻书一样浏览，不止上一页 / 下一页"
                  : "翻书模式已收起"}
              </strong>
            </div>
            <div className="browser-controls">
              <button
                onClick={() => setDeckOpen((open) => !open)}
                aria-label={deckOpen ? "收起翻书模式" : "展开翻书模式"}
              >
                {deckOpen ? <ChevronDown size={17} /> : <ChevronUp size={17} />}
              </button>
              {deckOpen && (
                <>
                  <button
                    className={deckExpanded ? "selected" : ""}
                    onClick={() => setDeckExpanded((expanded) => !expanded)}
                    aria-label={deckExpanded ? "收起多行缩略图" : "显示三行缩略图"}
                    title={deckExpanded ? "收起多行缩略图" : "显示三行缩略图"}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button onClick={() => browse(-1)} aria-label="向前浏览">
                    <ArrowLeft size={17} />
                  </button>
                  <button onClick={() => browse(1)} aria-label="向后浏览">
                    <ArrowRight size={17} />
                  </button>
                </>
              )}
            </div>
          </div>
          {deckOpen && (
            <div className="card-track" ref={scrollRef}>
              {filteredNotes.map((note, index) => (
                <button
                  key={note.id}
                  className={`page-card ${note.id === activeId ? "active" : ""} ${cardAccent(note.id)}`}
                  onClick={() => loadNote(note.id)}
                >
                  <span className="page-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p>{dateLabel(note.date)}</p>
                    <strong>{note.title}</strong>
                    <span>{note.excerpt || "点击开始记录"}</span>
                  </div>
                  <i>{note.tags[0] ? `#${note.tags[0]}` : "笔记"}</i>
                </button>
              ))}
            </div>
          )}
        </footer>
      </section>

      <aside className="details-panel">
        {panels.details ? (
          <button
            className="compact-rail light"
            onClick={() => updatePanels("details")}
            title="展开信息栏"
          >
            <ChevronLeft size={19} />
          </button>
        ) : (
          <div className="details-content">
            <div className="details-top">
              <p className="eyebrow">笔记信息</p>
              <button
                className="icon-button"
                onClick={() => updatePanels("details")}
                title="折叠信息栏"
              >
                <ChevronRight size={19} />
              </button>
            </div>
            <div className="note-identity">
              <h2>{noteTitleFromRaw(raw, activeNote.title)}</h2>
              <p>{activeNote.id || "本地 Markdown 文件"}</p>
            </div>
            <div className="info-grid">
              <div>
                <span>更新</span>
                <strong>
                  {activeNote.updatedAt
                    ? dateLabel(activeNote.updatedAt)
                    : "刚刚"}
                </strong>
              </div>
              <div>
                <span>字数</span>
                <strong>{words}</strong>
              </div>
            </div>
            <InfoSection
              icon={Hash}
              title="标签"
              action={
                <button
                  className="tiny-icon"
                  onClick={() => setTagManagerOpen(true)}
                  title="管理全部标签"
                >
                  <Settings2 size={13} />
                </button>
              }
            >
              <div className="tag-cloud">
                {(activeNote.tags || []).map((tag) => (
                  <span className="editable-tag" key={tag}>
                    <button
                      onClick={() => {
                        setSelectedTag(tag);
                        showNotes();
                      }}
                    >
                      #{tag}
                    </button>
                    <button
                      className="remove-tag"
                      onClick={() =>
                        saveActiveTags(
                          activeNote.tags.filter((value) => value !== tag),
                        )
                      }
                      aria-label={`移除标签 ${tag}`}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
                {!activeNote.tags?.length && (
                  <span className="muted">还没有标签</span>
                )}
              </div>
              <div className="tag-adder">
                <input
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && addTag()}
                  placeholder="添加标签"
                />
                <button onClick={addTag} aria-label="添加标签">
                  <Plus size={14} />
                </button>
              </div>
            </InfoSection>
            <InfoSection icon={List} title="页面大纲">
              <div className="outline">
                {headings.map((heading) => (
                  <button
                    key={heading.id}
                    style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                    onClick={() =>
                      document
                        .getElementById(heading.id)
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    {heading.title}
                  </button>
                ))}
                {!headings.length && <span className="muted">没有标题</span>}
              </div>
            </InfoSection>
            <InfoSection icon={Link2} title={`连接 · ${linkedNotes.length}`}>
              <LinkList
                notes={linkedNotes}
                onPick={loadNote}
                empty="输入 [[笔记标题]] 建立连接"
              />
            </InfoSection>
            <InfoSection
              icon={Sparkles}
              title={`反向链接 · ${backlinks.length}`}
            >
              <LinkList
                notes={backlinks}
                onPick={loadNote}
                empty="还没有笔记链接到这里"
              />
            </InfoSection>
          </div>
        )}
      </aside>
      {isSearchOpen && (
        <SearchPalette
          notes={notes}
          onClose={() => setSearchOpen(false)}
          onPick={(id) => {
            loadNote(id);
            setSearchOpen(false);
          }}
        />
      )}
      {isTagManagerOpen && (
        <TagManager
          tags={allTags}
          notes={notes}
          onClose={() => setTagManagerOpen(false)}
          onRename={(from, to) =>
            mutateTag("/api/tags/rename", { from, to }, `已重命名 #${from}`)
          }
          onDelete={deleteTag}
        />
      )}
      {notice && (
        <div className="toast notice">
          <Check size={16} />
          {notice}
        </div>
      )}
      {error && (
        <div className="toast">
          <X size={16} />
          {error}
          <button onClick={() => setError("")}>关闭</button>
        </div>
      )}
    </main>
  );
}

function NoteCollection({ notes, activeId, displayMode, onPick }) {
  if (!notes.length) return <div className="empty-list">没有找到笔记</div>;
  return (
    <div
      className={`note-list ${displayMode === "gallery" ? "gallery-list" : ""}`}
    >
      {notes.map((note) =>
        displayMode === "gallery" ? (
          <button
            key={note.id}
            className={`note-tile ${note.id === activeId ? "selected" : ""}`}
            onClick={() => onPick(note.id)}
          >
            <div className={`tile-cover ${cardAccent(note.id)}`}>
              <span>{tilePreview(note.title)}</span>
              <i>{dateLabel(note.date)}</i>
            </div>
            <strong>{note.title}</strong>
            <p>{note.excerpt || "空白笔记"}</p>
            <small>
              {note.tags
                .slice(0, 2)
                .map((tag) => `#${tag}`)
                .join(" ") || "无标签"}
            </small>
          </button>
        ) : (
          <button
            key={note.id}
            className={`note-row ${note.id === activeId ? "selected" : ""}`}
            onClick={() => onPick(note.id)}
          >
            <div className={`mini-cover ${cardAccent(note.id)}`}>
              <span>{note.title.slice(0, 1)}</span>
            </div>
            <div className="note-row-body">
              <div className="note-row-title">{note.title}</div>
              <p>{note.excerpt || "空白笔记"}</p>
              <div className="note-row-meta">
                <span>{dateLabel(note.date)}</span>
                {note.tags.slice(0, 2).map((tag) => (
                  <em key={tag}>#{tag}</em>
                ))}
              </div>
            </div>
          </button>
        ),
      )}
    </div>
  );
}

function CalendarPane({
  notesByDate,
  cursor,
  setCursor,
  selectedDate,
  onSelectDay,
  onShowNotes,
  onPick,
}) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const cells = Array.from(
    { length: 42 },
    (_, index) => new Date(year, month, index - firstOffset + 1),
  );
  const selectedNotes = selectedDate ? notesByDate.get(selectedDate) || [] : [];
  return (
    <div className="calendar-pane">
      <div className="calendar-toolbar">
        <button
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          aria-label="上个月"
        >
          <ChevronLeft size={17} />
        </button>
        <strong>
          {year} 年 {month + 1} 月
        </strong>
        <button
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          aria-label="下个月"
        >
          <ChevronRight size={17} />
        </button>
      </div>
      <div className="weekdays">
        {["一", "二", "三", "四", "五", "六", "日"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="calendar-grid">
        {cells.map((day) => {
          const key = localDateId(day);
          const count = notesByDate.get(key)?.length || 0;
          return (
            <button
              key={key}
              className={`${day.getMonth() !== month ? "outside" : ""} ${key === selectedDate ? "selected" : ""} ${key === localDateId() ? "today" : ""}`}
              onClick={() => onSelectDay(key)}
            >
              <span>{day.getDate()}</span>
              {count > 0 && <i>{count}</i>}
            </button>
          );
        })}
      </div>
      <div className="calendar-results">
        <div>
          <span>
            {selectedDate
              ? `${selectedDate} · ${selectedNotes.length} 篇`
              : "选择日期快速浏览"}
          </span>
          {selectedDate && (
            <span>
              <button onClick={onShowNotes}>筛选列表</button>
              <button onClick={() => onSelectDay("")}>清除</button>
            </span>
          )}
        </div>
        {selectedNotes.map((note) => (
          <button key={note.id} onClick={() => onPick(note.id)}>
            <span className={`link-dot ${cardAccent(note.id)}`} />
            {note.title}
            <ArrowRight size={13} />
          </button>
        ))}
        {selectedDate && !selectedNotes.length && <p>这一天还没有记录。</p>}
      </div>
    </div>
  );
}

function InfoSection({ icon: Icon, title, action, children }) {
  return (
    <section className="info-section">
      <h3>
        <Icon size={15} />
        {title}
        {action && <span>{action}</span>}
      </h3>
      {children}
    </section>
  );
}
function LinkList({ notes, onPick, empty }) {
  return (
    <div className="linked-list">
      {notes.map((note) => (
        <button key={note.id} onClick={() => onPick(note.id)}>
          <span className={`link-dot ${cardAccent(note.id)}`} />
          {note.title}
          <ArrowRight size={13} />
        </button>
      ))}
      {!notes.length && <span className="muted">{empty}</span>}
    </div>
  );
}

function SearchPalette({ notes, onClose, onPick }) {
  const [term, setTerm] = useState("");
  const results = notes
    .filter((note) =>
      `${note.title} ${note.excerpt} ${note.tags.join(" ")}`
        .toLowerCase()
        .includes(term.toLowerCase()),
    )
    .slice(0, 8);
  return (
    <div className="command-overlay" onMouseDown={onClose}>
      <div
        className="command-palette"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="command-input">
          <Search size={19} />
          <input
            autoFocus
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="搜索标题、标签或已索引摘要…"
          />
          <kbd>ESC</kbd>
        </div>
        <div className="command-results">
          {results.map((note) => (
            <button key={note.id} onClick={() => onPick(note.id)}>
              <span className={`mini-cover ${cardAccent(note.id)}`}>
                {note.title.slice(0, 1)}
              </span>
              <span>
                <strong>{note.title}</strong>
                <small>{note.excerpt || note.id}</small>
              </span>
              <em>{note.tags[0] && `#${note.tags[0]}`}</em>
            </button>
          ))}
          {!results.length && <p>没有匹配的笔记</p>}
        </div>
        <footer>
          <Command size={14} /> 笔记正文会在选中时才载入
        </footer>
      </div>
    </div>
  );
}

function TagManager({ tags, notes, onClose, onRename, onDelete }) {
  const [drafts, setDrafts] = useState({});
  return (
    <div className="command-overlay" onMouseDown={onClose}>
      <div
        className="tag-manager"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <p className="eyebrow">Vault 标签</p>
            <h2>管理标签</h2>
          </div>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <p className="manager-hint">
          重命名和删除会同步修改所有使用该标签的 Markdown 文件。
        </p>
        <div className="tag-manager-list">
          {tags.map((tag) => {
            const draft = drafts[tag] ?? tag;
            return (
              <div key={tag}>
                <span>#{tag}</span>
                <small>
                  {notes.filter((note) => note.tags.includes(tag)).length} 篇
                </small>
                <input
                  value={draft}
                  onChange={(event) =>
                    setDrafts((previous) => ({
                      ...previous,
                      [tag]: event.target.value,
                    }))
                  }
                  onKeyDown={(event) =>
                    event.key === "Enter" &&
                    normalizeTag(draft) !== tag &&
                    onRename(tag, draft)
                  }
                />
                <button
                  className="rename-tag"
                  disabled={normalizeTag(draft) === tag}
                  onClick={() => onRename(tag, draft)}
                >
                  保存
                </button>
                <button
                  className="delete-tag"
                  onClick={() => onDelete(tag)}
                  title={`删除 #${tag}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
          {!tags.length && <p>还没有标签。可在当前笔记右栏直接添加。</p>}
        </div>
        <footer>
          添加标签请使用右侧“笔记信息 →
          标签”，这样不会产生没有关联笔记的空标签。
        </footer>
      </div>
    </div>
  );
}

export default App;
