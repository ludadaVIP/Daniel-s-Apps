import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Edit3,
  FileText,
  FolderPlus,
  Loader2,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Save,
  Search,
  Square,
  Trash2,
} from "lucide-react";

import { isTtsCancelled, useTts } from "../../shared/useTts";
import "./styles.css";
import {
  createCategory,
  createDocument,
  deleteCategory,
  deleteDocument,
  fetchDocument,
  fetchLibrary,
  requestTts,
  updateCategory,
  updateDocument,
} from "./services/api";

const CATEGORY_LANGUAGE = {
  english: "en",
  spanish: "es",
  french: "fr",
  devotion: "zh",
  thoughts: "zh",
};

function classes(...parts) {
  return parts.filter(Boolean).join(" ");
}

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

function markdownToPlainText(markdown) {
  return (markdown || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[#>*\-\d.|\s]+/gm, " ")
    .replace(/[*_~\\]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitForTts(markdown, categoryId) {
  const plain = markdownToPlainText(markdown);
  const baseLanguage = CATEGORY_LANGUAGE[categoryId] || "en";
  const pieces = plain
    .split(/(?<=[。！？.!?])\s+|\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
  const chunks = [];
  let current = "";
  for (const piece of pieces.length ? pieces : [plain]) {
    if ((current + " " + piece).length > 650 && current) {
      chunks.push(current);
      current = piece;
    } else {
      current = current ? `${current} ${piece}` : piece;
    }
  }
  if (current) chunks.push(current);
  return chunks.slice(0, 40).map((text, index) => ({
    key: `doc-${index}`,
    text,
    language: /[\u4e00-\u9fff]/.test(text) ? "zh" : baseLanguage,
  }));
}

function renderInline(text) {
  const parts = [];
  const rx = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match;
  while ((match = rx.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${match.index}-${token}`;
    if (token.startsWith("`")) {
      parts.push(<code key={key}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith("**")) {
      parts.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*")) {
      parts.push(<em key={key}>{token.slice(1, -1)}</em>);
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      parts.push(
        <a key={key} href={link?.[2] || "#"} target="_blank" rel="noreferrer">
          {link?.[1] || token}
        </a>,
      );
    }
    last = rx.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function isTableRow(line) {
  const trimmed = (line || "").trim();
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.slice(1, -1).includes("|");
}

function isTableSeparator(line) {
  const trimmed = (line || "").trim();
  if (!isTableRow(trimmed)) return false;
  const cells = trimmed.slice(1, -1).split("|").map((cell) => cell.trim());
  return cells.length > 1 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function MarkdownView({ markdown }) {
  const blocks = useMemo(() => {
    const lines = (markdown || "").replace(/\r\n/g, "\n").split("\n");
    const out = [];
    let i = 0;
    let safety = 0;

    const nextParagraph = () => {
      const parts = [];
      while (i < lines.length && lines[i].trim()) {
        if (isTableRow(lines[i]) && isTableSeparator(lines[i + 1] || "")) break;
        if (/^(#{1,4})\s+/.test(lines[i]) || /^```/.test(lines[i]) || /^[-*]\s+/.test(lines[i]) || /^\d+\.\s+/.test(lines[i]) || /^>\s?/.test(lines[i])) break;
        parts.push(lines[i]);
        i += 1;
      }
      if (parts.length) out.push(<p key={`p-${i}`}>{renderInline(parts.join(" "))}</p>);
      else if (i < lines.length) {
        out.push(<p key={`p-${i}`}>{renderInline(lines[i])}</p>);
        i += 1;
      }
    };

    while (i < lines.length) {
      safety += 1;
      if (safety > lines.length + 100) {
        out.push(
          <p key="parser-stopped" className="smd-muted">
            Preview stopped because this Markdown contains an unusual structure.
          </p>,
        );
        break;
      }
      const line = lines[i];
      const trimmed = line.trim();
      if (!trimmed) {
        i += 1;
        continue;
      }
      if (/^```/.test(trimmed)) {
        const language = trimmed.replace(/^```/, "").trim();
        i += 1;
        const code = [];
        while (i < lines.length && !/^```/.test(lines[i].trim())) {
          code.push(lines[i]);
          i += 1;
        }
        i += 1;
        out.push(
          <figure className="smd-code-block" key={`code-${i}`}>
            {language && <figcaption>{language}</figcaption>}
            <pre><code>{code.join("\n")}</code></pre>
          </figure>,
        );
        continue;
      }
      const heading = trimmed.match(/^(#{1,4})\s+(.+)$/);
      if (heading) {
        const level = Math.min(heading[1].length, 4);
        const Tag = `h${level}`;
        out.push(<Tag key={`h-${i}`}>{renderInline(heading[2])}</Tag>);
        i += 1;
        continue;
      }
      if (/^---+$/.test(trimmed)) {
        out.push(<hr key={`hr-${i}`} />);
        i += 1;
        continue;
      }
      if (/^>\s?/.test(trimmed)) {
        const quote = [];
        while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
          quote.push(lines[i].replace(/^>\s?/, ""));
          i += 1;
        }
        out.push(<blockquote key={`q-${i}`}>{quote.map((item, idx) => <p key={idx}>{renderInline(item)}</p>)}</blockquote>);
        continue;
      }
      if (/^[-*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
        const ordered = /^\d+\.\s+/.test(trimmed);
        const items = [];
        const itemRx = ordered ? /^\d+\.\s+/ : /^[-*]\s+/;
        while (i < lines.length && itemRx.test(lines[i].trim())) {
          items.push(lines[i].trim().replace(itemRx, ""));
          i += 1;
        }
        const Tag = ordered ? "ol" : "ul";
        out.push(<Tag key={`list-${i}`}>{items.map((item, idx) => <li key={idx}>{renderInline(item)}</li>)}</Tag>);
        continue;
      }
      if (isTableRow(trimmed) && isTableSeparator(lines[i + 1] || "")) {
        const rows = [];
        while (i < lines.length && isTableRow(lines[i])) {
          rows.push(lines[i].trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()));
          i += 1;
        }
        const [head, , ...body] = rows;
        out.push(
          <div className="smd-table-wrap" key={`table-${i}`}>
            <table>
              <thead><tr>{head.map((cell, idx) => <th key={idx}>{renderInline(cell)}</th>)}</tr></thead>
              <tbody>{body.map((row, ridx) => <tr key={ridx}>{row.map((cell, cidx) => <td key={cidx}>{renderInline(cell)}</td>)}</tr>)}</tbody>
            </table>
          </div>,
        );
        continue;
      }
      nextParagraph();
    }
    return out.length ? out : [<p key="empty" className="smd-muted">No content yet.</p>];
  }, [markdown]);

  return <article className="smd-markdown">{blocks}</article>;
}

function Sidebar({
  categories,
  activeCategoryId,
  activeDocId,
  openCategories,
  query,
  collapsed,
  onToggleCategory,
  onSelectDoc,
  onNewDoc,
  onNewCategory,
  onRenameCategory,
  onDeleteCategory,
  onQuery,
  onToggleCollapsed,
}) {
  const normalQuery = query.trim().toLowerCase();
  return (
    <aside className={classes("smd-sidebar", collapsed && "is-collapsed")}>
      <div className="smd-brand">
        <div className="smd-brand-icon"><BookOpen size={20} /></div>
        {!collapsed && (
          <div>
            <p>Save MD</p>
            <span>{categories.reduce((sum, cat) => sum + cat.documents.length, 0)} documents</span>
          </div>
        )}
        <button type="button" className="smd-icon-button" onClick={onToggleCollapsed} title="折叠左栏">
          <ChevronRight size={16} className={collapsed ? "" : "is-rotated"} />
        </button>
      </div>

      {!collapsed && (
        <>
          <div className="smd-sidebar-actions">
            <button type="button" onClick={onNewDoc}><Plus size={15} /> New MD</button>
            <button type="button" onClick={onNewCategory}><FolderPlus size={15} /> Category</button>
          </div>
          <label className="smd-search">
            <Search size={14} />
            <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Search saved answers" />
          </label>
        </>
      )}

      <nav className="smd-tree" aria-label="Markdown categories">
        {categories.map((category) => {
          const docs = category.documents.filter((doc) => {
            if (!normalQuery) return true;
            return `${doc.title} ${doc.excerpt}`.toLowerCase().includes(normalQuery);
          });
          const open = openCategories.has(category.id);
          return (
            <section key={category.id} className="smd-category">
              <button
                type="button"
                className={classes("smd-category-head", activeCategoryId === category.id && "is-active")}
                onClick={() => onToggleCategory(category.id)}
                title={category.name}
              >
                {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                {!collapsed && <span>{category.name}</span>}
                {!collapsed && <small>{docs.length}</small>}
              </button>
              {open && !collapsed && (
                <div className="smd-doc-list">
                  {docs.map((doc) => (
                    <button
                      type="button"
                      key={`${category.id}/${doc.id}`}
                      className={classes("smd-doc-item", activeCategoryId === category.id && activeDocId === doc.id && "is-active")}
                      onClick={() => onSelectDoc(category.id, doc.id)}
                    >
                      <FileText size={14} />
                      <span>{doc.title}</span>
                    </button>
                  ))}
                  <div className="smd-category-tools">
                    <button type="button" onClick={() => onRenameCategory(category)}>Rename</button>
                    <button type="button" onClick={() => onDeleteCategory(category)}>Delete</button>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </nav>
    </aside>
  );
}

export default function SaveMdApp() {
  const [library, setLibrary] = useState({ categories: [], totalDocuments: 0 });
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [activeDocId, setActiveDocId] = useState("");
  const [openCategories, setOpenCategories] = useState(() => new Set(["english", "spanish", "french", "devotion", "thoughts"]));
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [docMeta, setDocMeta] = useState(null);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("split");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const stopQueueRef = useRef(false);
  const { play, stop, pause, resume, paused, speakingKey, loadingKey, error: ttsError } = useTts();

  const loadLibrary = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchLibrary();
      setLibrary(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  useEffect(() => {
    if (!activeCategoryId || !activeDocId) return;
    setError("");
    setStatus("");
    setDocMeta(null);
    setTitle("");
    setContent("");
    fetchDocument(activeCategoryId, activeDocId)
      .then((data) => {
        setDocMeta(data.document);
        setTitle(data.document.title);
        setContent(data.content);
        setDirty(false);
      })
      .catch((err) => setError(err.message));
  }, [activeCategoryId, activeDocId]);

  useEffect(() => {
    if (!status) return undefined;
    const timer = window.setTimeout(() => setStatus(""), 2400);
    return () => window.clearTimeout(timer);
  }, [status]);

  const activeCategory = library.categories.find((category) => category.id === activeCategoryId);
  const hasOpenDocument = Boolean(activeCategoryId && activeDocId && docMeta);

  const handleSelectDoc = (categoryId, docId) => {
    if (dirty && !window.confirm("当前文档还没保存，要离开吗？")) return;
    setStatus("");
    setError("");
    setActiveCategoryId(categoryId);
    setActiveDocId(docId);
  };

  const handleSave = async () => {
    if (!activeCategoryId || !activeDocId) return;
    setSaving(true);
    setError("");
    try {
      const data = await updateDocument(activeCategoryId, activeDocId, { title, content });
      setDocMeta(data.document);
      setTitle(data.document.title);
      setActiveDocId(data.document.id);
      setDirty(false);
      setStatus(`Saved ${data.document.filename}`);
      await loadLibrary();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleNewDoc = async () => {
    const categoryId = activeCategoryId || library.categories[0]?.id;
    if (!categoryId) return;
    const name = window.prompt("New Markdown title:", `AI Answer ${new Date().toISOString().slice(0, 10)}`);
    if (!name) return;
    const data = await createDocument(categoryId, {
      title: name,
      content: `# ${name}\n\nPaste the AI answer here.\n`,
    });
    await loadLibrary();
    setActiveCategoryId(categoryId);
    setActiveDocId(data.document.id);
  };

  const handleDeleteDoc = async () => {
    if (!activeCategoryId || !activeDocId || !docMeta) return;
    if (!window.confirm(`Delete "${docMeta.title}"? This removes the .md file.`)) return;
    const deletedCategoryId = activeCategoryId;
    const deletedDocId = activeDocId;
    setSaving(true);
    setError("");
    try {
      await deleteDocument(deletedCategoryId, deletedDocId);
      const nextLibrary = await loadLibrary();
      const category = nextLibrary?.categories.find((item) => item.id === deletedCategoryId);
      const nextDoc = category?.documents.find((item) => item.id !== deletedDocId) || category?.documents[0];
      setActiveCategoryId(deletedCategoryId);
      setActiveDocId(nextDoc?.id || "");
      if (!nextDoc) {
        setTitle("");
        setContent("");
        setDocMeta(null);
      }
      setStatus(`Deleted ${docMeta.filename || docMeta.title}`);
    } catch (err) {
      setError(err.message || "Delete failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleNewCategory = async () => {
    const name = window.prompt("New category name:");
    if (!name) return;
    const category = await createCategory({ name });
    setOpenCategories((current) => new Set([...current, category.id]));
    setActiveCategoryId(category.id);
    setActiveDocId("");
    setDocMeta(null);
    setTitle("");
    setContent("");
    await loadLibrary();
  };

  const handleRenameCategory = async (category) => {
    const name = window.prompt("Rename category:", category.name);
    if (!name || name === category.name) return;
    await updateCategory(category.id, { name });
    await loadLibrary();
  };

  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`Delete category "${category.name}" and all its Markdown files?`)) return;
    await deleteCategory(category.id);
    if (activeCategoryId === category.id) {
      setActiveCategoryId("");
      setActiveDocId("");
      setDocMeta(null);
      setContent("");
      setTitle("");
    }
    await loadLibrary();
  };

  const handleRead = async () => {
    const chunks = splitForTts(content, activeCategoryId);
    if (!chunks.length) return;
    stopQueueRef.current = false;
    for (const chunk of chunks) {
      if (stopQueueRef.current) break;
      try {
        await play({
          key: chunk.key,
          waitForEnd: true,
          getUrl: async () => {
            const data = await requestTts({ text: chunk.text, language: chunk.language });
            return { url: data.audio_url };
          },
        });
      } catch (err) {
        if (isTtsCancelled(err)) break;
        setError(err.message);
        break;
      }
    }
  };

  const handleStop = () => {
    stopQueueRef.current = true;
    stop();
  };

  return (
    <div className={classes("smd-shell", sidebarCollapsed && "is-sidebar-collapsed")}>
      <Sidebar
        categories={library.categories}
        activeCategoryId={activeCategoryId}
        activeDocId={activeDocId}
        openCategories={openCategories}
        query={query}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((value) => !value)}
        onToggleCategory={(categoryId) => setOpenCategories((current) => {
          const next = new Set(current);
          if (next.has(categoryId)) next.delete(categoryId);
          else next.add(categoryId);
          return next;
        })}
        onSelectDoc={handleSelectDoc}
        onNewDoc={handleNewDoc}
        onNewCategory={handleNewCategory}
        onRenameCategory={handleRenameCategory}
        onDeleteCategory={handleDeleteCategory}
        onQuery={setQuery}
      />

      <main className="smd-main">
        <header className="smd-topbar">
          <div className="smd-title-zone">
            <input
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setDirty(true);
              }}
              placeholder={hasOpenDocument ? "Untitled" : "Save MD Library"}
              className="smd-title-input"
            />
            <div className="smd-meta-row">
              <span>{hasOpenDocument ? activeCategory?.name || "No category" : `${library.totalDocuments} documents`}</span>
              {docMeta && <span>Added {formatDate(docMeta.createdAt)}</span>}
            {docMeta && <span>{docMeta.wordCount} words</span>}
            {docMeta && <span>{docMeta.charCount} chars</span>}
            {dirty && <span className="smd-dirty">Unsaved</span>}
          </div>
          </div>
          <div className="smd-toolbar">
            <div className="smd-mode-switch" role="tablist" aria-label="View mode">
              {["read", "split", "edit"].map((item) => (
                <button type="button" key={item} className={mode === item ? "is-active" : ""} onClick={() => setMode(item)}>
                  {item}
                </button>
              ))}
            </div>
            <button type="button" onClick={handleRead} disabled={!content || !!loadingKey}><Play size={16} /> Read</button>
            {speakingKey && !paused && <button type="button" onClick={pause}><Pause size={16} /> Pause</button>}
            {speakingKey && paused && <button type="button" onClick={resume}><Play size={16} /> Resume</button>}
            {speakingKey && <button type="button" onClick={handleStop}><Square size={15} /> Stop</button>}
            <button type="button" onClick={handleSave} disabled={!activeDocId || saving}><Save size={16} /> {saving ? "Saving" : "Save"}</button>
            <button type="button" onClick={loadLibrary} title="Refresh library"><RefreshCw size={16} /></button>
            <button type="button" className="smd-danger" onClick={handleDeleteDoc} disabled={!activeDocId}><Trash2 size={16} /></button>
          </div>
        </header>

        {(error || ttsError || status) && (
          <div className={classes("smd-message", error || ttsError ? "is-error" : "is-ok")}>
            {error || ttsError || status}
          </div>
        )}

        {loading ? (
          <div className="smd-loading"><Loader2 className="smd-spin" size={20} /> Loading library...</div>
        ) : !hasOpenDocument ? (
          <section className="smd-welcome">
            <div>
              <BookOpen size={34} />
              <h2>Choose a Markdown document</h2>
              <p>
                The library is ready. Startup only scans folders and filenames; document content is loaded after you click a file.
              </p>
              <button type="button" onClick={handleNewDoc}>
                <Plus size={16} /> New MD
              </button>
            </div>
          </section>
        ) : (
          <section className={classes("smd-workspace", `mode-${mode}`)}>
            {mode !== "edit" && (
              <div className="smd-reader">
                <MarkdownView markdown={content} />
              </div>
            )}
            {mode !== "read" && (
              <div className="smd-editor-pane">
                <div className="smd-editor-head">
                  <Edit3 size={15} />
                  <span>Markdown source</span>
                </div>
                <textarea
                  value={content}
                  onChange={(event) => {
                    setContent(event.target.value);
                    setDirty(true);
                  }}
                  spellCheck={false}
                  placeholder="Paste an AI answer here. Markdown tables, code fences, quotes, lists, and headings will render in the reading pane."
                />
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
