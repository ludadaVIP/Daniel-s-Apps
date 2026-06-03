import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  BookMarked,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Edit3,
  Heart,
  Loader2,
  Plus,
  FolderPlus,
  RefreshCw,
  Save,
  Search,
  Trash2,
} from "lucide-react";

import "./styles.css";
import {
  createBook,
  createShelf,
  deleteBook,
  deleteShelf,
  fetchBook,
  fetchLibrary,
  updateBook,
  updateShelf,
} from "./services/api";

// Only two writable sections — no oneLiner / synopsis / points / quotes / notes.
const TABS = [
  { id: "mindmap", label: "思维导图", hint: "缩进式 Markdown — 整本书的骨架。在这里建立结构感。" },
  { id: "narration", label: "朗读稿", hint: "深度精读稿（目标 ~10000 字）— 沿着思维导图，把每个分支讲透。" },
];

const SECTION_PLACEHOLDERS = {
  mindmap:
    "- 全书结构\n  - 第一部分\n    - 核心概念 A\n    - 核心概念 B\n  - 第二部分\n    - 论点 1\n    - 论点 2\n",
  narration:
    "# 引言\n\n（深度精读稿写在这里。目标 ~10000 字。建议用 `## 一级标题` 分章，左侧会自动生成可跳转的目录。）\n\n## 第一章 …\n\n…\n",
};

const WORKFLOW_STEPS = [
  { id: "wantToRead", label: "想读", nextLabel: "开始读" },
  { id: "reading", label: "在读", nextLabel: "读完了" },
  { id: "read", label: "已读", nextLabel: null },
];
const SYSTEM_SHELF_IDS = new Set(["wantToRead", "reading", "read", "collection"]);

function classes(...parts) {
  return parts.filter(Boolean).join(" ");
}

// --------- Markdown rendering (lightweight) ---------

function renderInline(text) {
  const parts = [];
  const rx = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match;
  while ((match = rx.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${match.index}-${token}`;
    if (token.startsWith("`")) parts.push(<code key={key}>{token.slice(1, -1)}</code>);
    else if (token.startsWith("**")) parts.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    else if (token.startsWith("*")) parts.push(<em key={key}>{token.slice(1, -1)}</em>);
    else {
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

function slugify(text, index) {
  const base = String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿]+/g, "-")
    .replace(/^-|-$/g, "");
  return `bid-h-${index}-${base.slice(0, 40) || "x"}`;
}

function MarkdownView({ markdown, withAnchors = false }) {
  const blocks = useMemo(() => {
    const lines = (markdown || "").replace(/\r\n/g, "\n").split("\n");
    const out = [];
    let i = 0;
    let headingIndex = 0;

    while (i < lines.length) {
      const trimmed = lines[i].trim();
      if (!trimmed) {
        i += 1;
        continue;
      }
      const heading = trimmed.match(/^(#{1,4})\s+(.+)$/);
      if (heading) {
        const level = Math.min(heading[1].length, 4);
        const Tag = `h${level}`;
        const idAttr = withAnchors ? slugify(heading[2], headingIndex) : undefined;
        out.push(<Tag key={`h-${i}`} id={idAttr}>{renderInline(heading[2])}</Tag>);
        headingIndex += 1;
        i += 1;
        continue;
      }
      if (/^>\s?/.test(trimmed)) {
        const quote = [];
        while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
          quote.push(lines[i].replace(/^>\s?/, ""));
          i += 1;
        }
        out.push(
          <blockquote key={`q-${i}`}>
            {quote.map((item, idx) => <p key={idx}>{renderInline(item)}</p>)}
          </blockquote>,
        );
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
        out.push(
          <Tag key={`list-${i}`}>
            {items.map((item, idx) => <li key={idx}>{renderInline(item)}</li>)}
          </Tag>,
        );
        continue;
      }
      const parts = [];
      while (i < lines.length && lines[i].trim()) {
        if (/^(#{1,4})\s+/.test(lines[i]) || /^[-*]\s+/.test(lines[i]) || /^>\s?/.test(lines[i]) || /^\d+\.\s+/.test(lines[i])) break;
        parts.push(lines[i]);
        i += 1;
      }
      if (parts.length) out.push(<p key={`p-${i}`}>{renderInline(parts.join(" "))}</p>);
    }
    return out.length ? out : [<p key="empty" className="bid-muted">还没填内容。</p>];
  }, [markdown, withAnchors]);

  return <article className="bid-markdown">{blocks}</article>;
}

// --------- Mind map view (parses indented "- " into a tree) ---------

function parseMindmap(markdown) {
  const lines = (markdown || "").replace(/\r\n/g, "\n").split("\n");
  const stack = [{ depth: -1, children: [] }];
  for (const raw of lines) {
    const match = raw.match(/^(\s*)[-*]\s+(.+)$/);
    if (!match) continue;
    const depth = Math.floor(match[1].replace(/\t/g, "  ").length / 2);
    const node = { text: match[2], children: [] };
    while (stack.length && stack[stack.length - 1].depth >= depth) stack.pop();
    stack[stack.length - 1].children.push(node);
    stack.push({ depth, children: node.children });
  }
  return stack[0].children;
}

function MindMapNode({ node, depth }) {
  return (
    <li className={`bid-mm-node depth-${Math.min(depth, 4)}`}>
      <span className="bid-mm-bullet" />
      <span className="bid-mm-text">{renderInline(node.text)}</span>
      {node.children.length > 0 && (
        <ul>
          {node.children.map((child, idx) => (
            <MindMapNode key={idx} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

function MindMapView({ markdown }) {
  const tree = useMemo(() => parseMindmap(markdown), [markdown]);
  if (!tree.length) {
    return <p className="bid-muted">还没有内容。在编辑栏写 `- 节点` 缩进 2 空格表示子节点。</p>;
  }
  return (
    <ul className="bid-mindmap">
      {tree.map((node, idx) => <MindMapNode key={idx} node={node} depth={0} />)}
    </ul>
  );
}

// --------- Narration TOC (auto-extracted from `##` headings) ---------

function extractToc(markdown) {
  const lines = (markdown || "").replace(/\r\n/g, "\n").split("\n");
  const items = [];
  let headingIndex = 0;
  for (const line of lines) {
    const match = line.trim().match(/^(#{1,4})\s+(.+)$/);
    if (!match) continue;
    const level = match[1].length;
    items.push({
      level,
      text: match[2],
      id: slugify(match[2], headingIndex),
    });
    headingIndex += 1;
  }
  return items;
}

function countCharacters(text) {
  if (!text) return 0;
  const cjk = (text.match(/[一-鿿]/g) || []).length;
  const latin = (text.match(/[A-Za-z]+/g) || []).length;
  return cjk + latin;
}

// --------- Sidebar ---------

function Sidebar({
  shelves,
  activeBookId,
  openShelves,
  query,
  collapsed,
  onToggleShelf,
  onSelectBook,
  onNewBook,
  onNewShelf,
  onRenameShelf,
  onDeleteShelf,
  onQuery,
  onToggleCollapsed,
  totalBooks,
}) {
  const normalQuery = query.trim().toLowerCase();
  return (
    <aside className={classes("bid-sidebar", collapsed && "is-collapsed")}>
      <div className="bid-brand">
        <div className="bid-brand-icon"><BookOpen size={20} /></div>
        {!collapsed && (
          <div>
            <p>Book In Depth</p>
            <span>{totalBooks} 本</span>
          </div>
        )}
        <button type="button" className="bid-icon-button" onClick={onToggleCollapsed} title="折叠左栏">
          <ChevronRight size={16} className={collapsed ? "" : "is-rotated"} />
        </button>
      </div>

      {!collapsed && (
        <>
          <div className="bid-sidebar-actions">
            <button type="button" onClick={onNewBook}><Plus size={15} /> 新书</button>
            <button type="button" onClick={onNewShelf}><FolderPlus size={15} /> 书架</button>
          </div>
          <label className="bid-search">
            <Search size={14} />
            <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="搜索书名 / 作者 / 标签" />
          </label>
        </>
      )}

      <nav className="bid-tree" aria-label="Shelves">
        {shelves.map((shelf) => {
          const filtered = shelf.books.filter((book) => {
            if (!normalQuery) return true;
            const haystack = `${book.title} ${book.author} ${(book.tags || []).join(" ")} ${book.excerpt || ""}`.toLowerCase();
            return haystack.includes(normalQuery);
          });
          const open = openShelves.has(shelf.id);
          return (
            <section key={shelf.id} className={classes("bid-shelf", `bid-shelf-${shelf.id}`)}>
              <button
                type="button"
                className="bid-shelf-head"
                onClick={() => onToggleShelf(shelf.id)}
                title={shelf.name}
              >
                {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                {!collapsed && <span>{shelf.name}</span>}
                {!collapsed && <small>{filtered.length}</small>}
              </button>
              {open && !collapsed && (
                <div className="bid-book-list">
                  {filtered.length === 0 && (
                    <p className="bid-empty">{normalQuery ? "没匹配的书。" : "这个书架还没书。"}</p>
                  )}
                  {filtered.map((book) => (
                    <button
                      type="button"
                      key={book.id}
                      className={classes("bid-book-item", activeBookId === book.id && "is-active")}
                      onClick={() => onSelectBook(book.id)}
                      title={`${book.title}${book.author ? "  ·  " + book.author : ""}${book.narrationLength ? `  ·  ${book.narrationLength} 字` : ""}`}
                    >
                      <BookMarked size={14} />
                      <div className="bid-book-item-text">
                        <strong>{book.title}</strong>
                        {book.author && <span>{book.author}</span>}
                      </div>
                      {book.narrationLength > 0 && (
                        <small className="bid-book-len">{Math.round(book.narrationLength / 1000)}k</small>
                      )}
                    </button>
                  ))}
                  {shelf.id !== "_unfiled" && !SYSTEM_SHELF_IDS.has(shelf.id) && (
                    <div className="bid-shelf-tools">
                      <button type="button" onClick={() => onRenameShelf(shelf)}>重命名</button>
                      <button type="button" onClick={() => onDeleteShelf(shelf)}>删除</button>
                    </div>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </nav>
    </aside>
  );
}

// --------- Workflow stepper + slim info card ---------

function WorkflowStepper({ book, onPatch }) {
  if (!book) return null;
  const isFavorite = book.shelfId === "collection";
  const currentIndex = isFavorite
    ? 2
    : Math.max(0, WORKFLOW_STEPS.findIndex((s) => s.id === book.shelfId));
  const currentStep = WORKFLOW_STEPS[currentIndex];
  const nextStep = WORKFLOW_STEPS[currentIndex + 1];

  const moveTo = (shelfId) => onPatch({ shelfId });

  return (
    <section className="bid-workflow">
      <ol className="bid-workflow-steps">
        {WORKFLOW_STEPS.map((step, idx) => {
          const state =
            idx < currentIndex ? "done" : idx === currentIndex ? "current" : "todo";
          return (
            <li key={step.id} className={`is-${state}`}>
              <span className="bid-workflow-dot">
                {state === "done" ? <Check size={13} /> : idx + 1}
              </span>
              <span className="bid-workflow-label">{step.label}</span>
              {idx < WORKFLOW_STEPS.length - 1 && (
                <span className="bid-workflow-arrow" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
      <div className="bid-workflow-actions">
        {nextStep && currentStep.nextLabel && !isFavorite && (
          <button
            type="button"
            className="bid-workflow-next"
            onClick={() => moveTo(nextStep.id)}
            title={`移到「${nextStep.label}」`}
          >
            {currentStep.nextLabel} <ChevronRight size={14} />
          </button>
        )}
        <button
          type="button"
          className={classes("bid-workflow-fav", isFavorite && "is-on")}
          onClick={() => moveTo(isFavorite ? "read" : "collection")}
          title={isFavorite ? "从「收藏」移回「已读」" : "标记为珍藏 — 想反复读"}
        >
          <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
          {isFavorite ? "已收藏" : "加入收藏"}
        </button>
      </div>
    </section>
  );
}

function InfoCard({ book, onPatch }) {
  if (!book) return null;
  return (
    <section className="bid-info-card">
      <div className="bid-info-line">
        <label className="bid-info-field">
          <span>作者：</span>
          <input
            value={book.author}
            onChange={(e) => onPatch({ author: e.target.value })}
            placeholder="作者"
          />
        </label>
        <label className="bid-info-field">
          <span>原名：</span>
          <input
            value={book.originalTitle}
            onChange={(e) => onPatch({ originalTitle: e.target.value })}
            placeholder="原文书名（可空）"
          />
        </label>
      </div>
      <label className="bid-info-field bid-info-take">
        <span>一句话评价：</span>
        <input
          value={book.myTake}
          onChange={(e) => onPatch({ myTake: e.target.value })}
          placeholder="读完最大的感受…"
        />
      </label>
    </section>
  );
}

// --------- TOC sidebar for narration (only shown on narration tab) ---------

function NarrationTOC({ items, onJump }) {
  if (!items.length) return null;
  return (
    <aside className="bid-toc">
      <header>目录</header>
      <ol>
        {items.map((item) => (
          <li key={item.id} className={`level-${item.level}`}>
            <button type="button" onClick={() => onJump(item.id)}>
              {item.text}
            </button>
          </li>
        ))}
      </ol>
    </aside>
  );
}

// --------- Main app ---------

export default function BookInDepthApp() {
  const [library, setLibrary] = useState({ shelves: [], totalBooks: 0 });
  const [activeBookId, setActiveBookId] = useState("");
  const [book, setBook] = useState(null);
  const [activeTab, setActiveTab] = useState("narration");
  const [tabDraft, setTabDraft] = useState("");
  const [mode, setMode] = useState("read");
  const [openShelves, setOpenShelves] = useState(() => new Set(["reading"]));
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const textareaRef = useRef(null);
  const readerRef = useRef(null);

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
    if (!activeBookId) {
      setBook(null);
      return;
    }
    setError("");
    setStatus("");
    fetchBook(activeBookId)
      .then((data) => {
        setBook(data.book);
        setTabDraft(data.book.sections?.[activeTab] || "");
        setDirty(false);
      })
      .catch((err) => setError(err.message));
  }, [activeBookId]);

  useEffect(() => {
    if (!book) return;
    setTabDraft(book.sections?.[activeTab] || "");
    setDirty(false);
  }, [activeTab, book?.id]);

  useEffect(() => {
    if (!status) return undefined;
    const timer = window.setTimeout(() => setStatus(""), 2400);
    return () => window.clearTimeout(timer);
  }, [status]);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 320)}px`;
  }, [tabDraft, mode, activeTab, book?.id]);

  const handleSelectBook = (bookId) => {
    if (dirty && !window.confirm("当前 Tab 还没保存，要切走吗？")) return;
    setActiveBookId(bookId);
  };

  const handleNewBook = async () => {
    const title = window.prompt("新书的书名：");
    if (!title) return;
    const author = window.prompt("作者（可空）：") || "";
    const firstShelf = library.shelves.find((s) => s.id !== "_unfiled");
    const data = await createBook({
      title,
      author,
      shelfId: firstShelf?.id || "wantToRead",
    });
    await loadLibrary();
    setActiveBookId(data.book.id);
    setActiveTab("narration");
    setStatus(`新建《${data.book.title}》`);
  };

  const handleNewShelf = async () => {
    const name = window.prompt("新书架的名字：");
    if (!name) return;
    const shelf = await createShelf({ name });
    setOpenShelves((current) => new Set([...current, shelf.id]));
    await loadLibrary();
    setStatus(`新建书架「${shelf.name}」`);
  };

  const handleRenameShelf = async (shelf) => {
    const name = window.prompt("重命名书架：", shelf.name);
    if (!name || name === shelf.name) return;
    await updateShelf(shelf.id, { name });
    await loadLibrary();
  };

  const handleDeleteShelf = async (shelf) => {
    if (!window.confirm(`删除书架「${shelf.name}」？里面的书会被移到第一个书架，不会丢。`)) return;
    await deleteShelf(shelf.id);
    await loadLibrary();
  };

  const handleDeleteBook = async () => {
    if (!book) return;
    if (!window.confirm(`删除《${book.title}》？整个文件夹会被移除。`)) return;
    await deleteBook(book.id);
    setActiveBookId("");
    setBook(null);
    await loadLibrary();
  };

  const handlePatchMeta = async (patch) => {
    if (!book) return;
    const next = { ...book, ...patch };
    setBook(next);
    try {
      const data = await updateBook(book.id, patch);
      setBook(data.book);
      await loadLibrary();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTitleChange = (title) => {
    if (!book) return;
    setBook({ ...book, title });
    setDirty(true);
  };

  const handleSaveTab = async () => {
    if (!book) return;
    setSaving(true);
    setError("");
    try {
      const data = await updateBook(book.id, {
        title: book.title,
        sections: { [activeTab]: tabDraft },
      });
      setBook(data.book);
      setDirty(false);
      setStatus("已保存");
      await loadLibrary();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleJumpToHeading = (id) => {
    const el = readerRef.current?.querySelector(`#${CSS.escape(id)}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const tocItems = useMemo(() => {
    if (activeTab !== "narration") return [];
    return extractToc(tabDraft);
  }, [tabDraft, activeTab]);

  const charCount = useMemo(() => countCharacters(tabDraft), [tabDraft]);
  const totalBooks = library.totalBooks || library.shelves.reduce((sum, s) => sum + s.books.length, 0);

  return (
    <div
      className={classes(
        "bid-shell",
        sidebarCollapsed && "is-sidebar-collapsed",
      )}
    >
      <Sidebar
        shelves={library.shelves}
        activeBookId={activeBookId}
        openShelves={openShelves}
        query={query}
        collapsed={sidebarCollapsed}
        totalBooks={totalBooks}
        onToggleCollapsed={() => setSidebarCollapsed((v) => !v)}
        onToggleShelf={(shelfId) => setOpenShelves((current) => {
          const next = new Set(current);
          if (next.has(shelfId)) next.delete(shelfId); else next.add(shelfId);
          return next;
        })}
        onSelectBook={handleSelectBook}
        onNewBook={handleNewBook}
        onNewShelf={handleNewShelf}
        onRenameShelf={handleRenameShelf}
        onDeleteShelf={handleDeleteShelf}
        onQuery={setQuery}
      />

      <main className="bid-main">
        <header className="bid-topbar">
          <div className="bid-title-zone">
            <input
              value={book?.title || ""}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder={book ? "未命名书籍" : "Book In Depth"}
              className="bid-title-input"
              onBlur={() => {
                if (book && dirty) {
                  handlePatchMeta({ title: book.title });
                }
              }}
            />
            {(!book || dirty || charCount > 0) && (
              <div className="bid-meta-row">
                {book ? (
                  <>
                    {dirty && <span className="bid-dirty">本 Tab 未保存</span>}
                    {charCount > 0 && (
                      <span>{TABS.find((t) => t.id === activeTab)?.label}：{charCount} 字</span>
                    )}
                  </>
                ) : (
                  <span>{totalBooks} 本书 · 从左栏选一本，或按 “新书” 开始深读</span>
                )}
              </div>
            )}
          </div>
          <div className="bid-toolbar">
            <div className="bid-mode-switch" role="tablist" aria-label="View mode">
              {["read", "split", "edit"].map((m) => (
                <button type="button" key={m} className={mode === m ? "is-active" : ""} onClick={() => setMode(m)}>
                  {m}
                </button>
              ))}
            </div>
            <button type="button" onClick={handleSaveTab} disabled={!book || saving}>
              <Save size={16} /> {saving ? "保存中" : "保存本 Tab"}
            </button>
            <button type="button" onClick={loadLibrary} title="刷新整个书库"><RefreshCw size={16} /></button>
            <button type="button" className="bid-danger" onClick={handleDeleteBook} disabled={!book}>
              <Trash2 size={16} />
            </button>
          </div>
        </header>

        {(error || status) && (
          <div className={classes("bid-message", error ? "is-error" : "is-ok")}>
            {error || status}
          </div>
        )}

        {loading ? (
          <div className="bid-loading"><Loader2 className="bid-spin" size={20} /> 加载书库…</div>
        ) : !book ? (
          <section className="bid-welcome">
            <BookOpen size={42} />
            <h2>每本书读到底</h2>
            <p>
              这里和「A Book a Day」是兄弟工具——同样的书架管理，但右边极简：
              只有 <strong>思维导图</strong> 和 <strong>朗读稿</strong> 两个 Tab。
              朗读稿目标 ~10000 字——把一本书真正讲透，而不是浓缩到 2000 字看不出味道。
              没有 TTS、没有右栏：这里是用来「看」的，不是用来「听」的。
            </p>
            <button type="button" onClick={handleNewBook}><Plus size={16} /> 新书</button>
          </section>
        ) : (
          <section className="bid-workspace">
            <WorkflowStepper book={book} onPatch={handlePatchMeta} />
            <InfoCard book={book} onPatch={handlePatchMeta} />

            <div className="bid-tabs">
              {TABS.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  className={classes("bid-tab", activeTab === tab.id && "is-active")}
                  onClick={() => {
                    if (dirty && !window.confirm("当前 Tab 还没保存，要切走吗？")) return;
                    setActiveTab(tab.id);
                  }}
                  title={tab.hint}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <p className="bid-tab-hint">{TABS.find((t) => t.id === activeTab)?.hint}</p>

            <section className={classes("bid-tab-pane", `mode-${mode}`, activeTab === "narration" && tocItems.length > 0 && mode === "read" && "with-toc")}>
              {mode !== "edit" && activeTab === "narration" && tocItems.length > 0 && mode === "read" && (
                <NarrationTOC items={tocItems} onJump={handleJumpToHeading} />
              )}
              {mode !== "edit" && (
                <div className="bid-reader" ref={readerRef}>
                  {activeTab === "mindmap" ? (
                    <MindMapView markdown={tabDraft} />
                  ) : (
                    <MarkdownView markdown={tabDraft} withAnchors />
                  )}
                </div>
              )}
              {mode !== "read" && (
                <div className="bid-editor-pane">
                  <div className="bid-editor-head">
                    <Edit3 size={15} />
                    <span>编辑 — {TABS.find((t) => t.id === activeTab)?.label}</span>
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={tabDraft}
                    onChange={(e) => { setTabDraft(e.target.value); setDirty(true); }}
                    spellCheck={false}
                    placeholder={SECTION_PLACEHOLDERS[activeTab] || ""}
                  />
                </div>
              )}
            </section>

          </section>
        )}
      </main>
    </div>
  );
}
