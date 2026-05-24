import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  BookMarked,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Edit3,
  FileText,
  FolderOpen,
  FolderPlus,
  Heart,
  Loader2,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  Square,
  Trash2,
  Wand2,
} from "lucide-react";

import { isTtsCancelled, useTts } from "../../shared/useTts";
import "./styles.css";
import {
  createBook,
  createShelf,
  deleteBook,
  deleteShelf,
  fetchBook,
  fetchLibrary,
  fetchMaterials,
  requestTts,
  updateBook,
  updateShelf,
} from "./services/api";

const TABS = [
  { id: "oneLiner", label: "一句话", hint: "一句话讲清楚这本书最核心的观点。" },
  { id: "synopsis", label: "概要", hint: "三段：背景 / 主张 / 适合谁读。" },
  { id: "points", label: "要点", hint: "5–10 条核心论点（用 - 列表）。" },
  { id: "mindmap", label: "思维导图", hint: "缩进式 Markdown，会渲染成可读的树。" },
  { id: "quotes", label: "金句", hint: "摘抄值得反复看的句子。" },
  { id: "notes", label: "我的笔记", hint: "自己的感想、和其他书的对比。" },
  { id: "narration", label: "朗读稿", hint: "为 TTS 准备的一段连贯讲解，点 Read 整段听。" },
];

const PROMPT_TEMPLATES = [
  {
    id: "fullDigest",
    label: "一键 7 段精讲",
    prompt:
      "请阅读《{{title}}》（作者：{{author}}，语言：{{language}}），输出 7 段内容，每段之间用 `---` 分隔，按顺序：\n" +
      "1. 一句话总结整本书的核心观点\n" +
      "2. 3 段概要（背景 / 主张 / 适合谁读）\n" +
      "3. 5-10 条要点（Markdown 列表）\n" +
      "4. 思维导图（缩进式 Markdown，至少 3 层）\n" +
      "5. 10 条值得记的金句\n" +
      "6. 给读者的 3 条反思问题\n" +
      "7. 10 分钟左右的连贯讲解稿（口语化，便于朗读）",
  },
  {
    id: "oneLiner",
    label: "一句话",
    prompt: "请用一句话讲清楚《{{title}}》的核心论点。",
  },
  {
    id: "synopsis",
    label: "3 段概要",
    prompt:
      "为《{{title}}》写 3 段概要：\n" +
      "第 1 段：作者写作的背景与动机；\n" +
      "第 2 段：核心主张与论证脉络；\n" +
      "第 3 段：适合什么样的读者，读完能得到什么。",
  },
  {
    id: "points",
    label: "5-10 条要点",
    prompt: "列出《{{title}}》最关键的 7 条要点，每条 1-2 句话，使用 Markdown 列表。",
  },
  {
    id: "mindmap",
    label: "思维导图",
    prompt:
      "为《{{title}}》输出一份缩进式 Markdown 大纲思维导图，至少 3 层，使用 `- ` 前缀，缩进 2 空格。先列出书的整体结构，再展开各章/各部分的关键概念。",
  },
  {
    id: "quotes",
    label: "10 句金句",
    prompt: "从《{{title}}》中挑出 10 句最值得记的话，附上简短的语境说明（若不确定出处可省略）。",
  },
  {
    id: "narration",
    label: "10 分钟朗读稿",
    prompt:
      "为《{{title}}》写一段约 10 分钟的连贯讲解稿（中文，口语化），结构：\n" +
      "- 开头：用一个钩子句点题；\n" +
      "- 中间：依次展开 5-7 个要点，每个要点配一个例子或类比；\n" +
      "- 结尾：用一段话收束，给读者留一个可以行动的建议。\n" +
      "不要写章节标题或编号，只要顺滑的散文，适合直接朗读。",
  },
  {
    id: "comparison",
    label: "和其他书的对比",
    prompt: "把《{{title}}》和领域内 2-3 本经典做对比，说明它的独特价值与不足。",
  },
];

// Reading workflow: 想读 → 在读 → 已读 (→ ★ 收藏)
const WORKFLOW_STEPS = [
  { id: "wantToRead", label: "想读", nextLabel: "开始读" },
  { id: "reading", label: "在读", nextLabel: "读完了" },
  { id: "read", label: "已读", nextLabel: null },
];
const SYSTEM_SHELF_IDS = new Set(["wantToRead", "reading", "read", "collection"]);

const SECTION_PLACEHOLDERS = {
  oneLiner: "在这一行写下这本书最核心的那句话…",
  synopsis: "## 背景\n\n## 主张\n\n## 适合谁读\n",
  points: "- 第一个要点\n- 第二个要点\n- 第三个要点\n",
  mindmap:
    "- 全书结构\n  - 第一部分\n    - 核心概念 A\n    - 核心概念 B\n  - 第二部分\n    - 论点 1\n    - 论点 2\n",
  quotes: '> "把那句让你震动的话抄在这里。" — 第 xx 页\n',
  notes: "今天读到这本书，让我想到的是…\n",
  narration:
    "（这一段是朗读稿，写成连贯的散文，TTS 朗读起来才自然。）\n\n这本书要讲的，其实是一件很简单的事…\n",
};

function classes(...parts) {
  return parts.filter(Boolean).join(" ");
}

function fillPromptTemplate(template, book) {
  const title = book?.title || "（书名）";
  const author = book?.author || "未知";
  const language = book?.language || "zh";
  return template
    .replaceAll("{{title}}", title)
    .replaceAll("{{author}}", author)
    .replaceAll("{{language}}", language);
}

// --------- Markdown rendering (lightweight, same approach as Save MD) ---------

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

function MarkdownView({ markdown }) {
  const blocks = useMemo(() => {
    const lines = (markdown || "").replace(/\r\n/g, "\n").split("\n");
    const out = [];
    let i = 0;

    while (i < lines.length) {
      const trimmed = lines[i].trim();
      if (!trimmed) {
        i += 1;
        continue;
      }
      const heading = trimmed.match(/^(#{1,4})\s+(.+)$/);
      if (heading) {
        const Tag = `h${Math.min(heading[1].length, 4)}`;
        out.push(<Tag key={`h-${i}`}>{renderInline(heading[2])}</Tag>);
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
      // paragraph
      const parts = [];
      while (i < lines.length && lines[i].trim()) {
        if (/^(#{1,4})\s+/.test(lines[i]) || /^[-*]\s+/.test(lines[i]) || /^>\s?/.test(lines[i]) || /^\d+\.\s+/.test(lines[i])) break;
        parts.push(lines[i]);
        i += 1;
      }
      if (parts.length) out.push(<p key={`p-${i}`}>{renderInline(parts.join(" "))}</p>);
    }
    return out.length ? out : [<p key="empty" className="bad-muted">还没填内容。</p>];
  }, [markdown]);

  return <article className="bad-markdown">{blocks}</article>;
}

// --------- Mind map view: parse indented "- " lines into a tree ---------

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
    <li className={`bad-mm-node depth-${Math.min(depth, 4)}`}>
      <span className="bad-mm-bullet" />
      <span className="bad-mm-text">{renderInline(node.text)}</span>
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
    return <p className="bad-muted">还没有内容。在编辑栏写 `- 节点` 缩进 2 空格表示子节点。</p>;
  }
  return (
    <ul className="bad-mindmap">
      {tree.map((node, idx) => <MindMapNode key={idx} node={node} depth={0} />)}
    </ul>
  );
}

// --------- TTS chunking ---------

function plainText(markdown) {
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

function splitForTts(text, baseLanguage) {
  const plain = plainText(text);
  if (!plain) return [];
  const pieces = plain.split(/(?<=[。！？.!?])\s+|\n{2,}/).map((part) => part.trim()).filter(Boolean);
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
  return chunks.slice(0, 40).map((chunkText, index) => ({
    key: `chunk-${index}`,
    text: chunkText,
    language: /[一-鿿]/.test(chunkText) ? "zh" : baseLanguage,
  }));
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
    <aside className={classes("bad-sidebar", collapsed && "is-collapsed")}>
      <div className="bad-brand">
        <div className="bad-brand-icon"><BookOpen size={20} /></div>
        {!collapsed && (
          <div>
            <p>A Book a Day</p>
            <span>{totalBooks} 本</span>
          </div>
        )}
        <button type="button" className="bad-icon-button" onClick={onToggleCollapsed} title="折叠左栏">
          <ChevronRight size={16} className={collapsed ? "" : "is-rotated"} />
        </button>
      </div>

      {!collapsed && (
        <>
          <div className="bad-sidebar-actions">
            <button type="button" onClick={onNewBook}><Plus size={15} /> 新书</button>
            <button type="button" onClick={onNewShelf}><FolderPlus size={15} /> 书架</button>
          </div>
          <label className="bad-search">
            <Search size={14} />
            <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="搜索书名 / 作者 / 标签" />
          </label>
        </>
      )}

      <nav className="bad-tree" aria-label="Shelves">
        {shelves.map((shelf) => {
          const filtered = shelf.books.filter((book) => {
            if (!normalQuery) return true;
            const haystack = `${book.title} ${book.author} ${(book.tags || []).join(" ")} ${book.excerpt || ""}`.toLowerCase();
            return haystack.includes(normalQuery);
          });
          const open = openShelves.has(shelf.id);
          return (
            <section key={shelf.id} className={classes("bad-shelf", `bad-shelf-${shelf.id}`)}>
              <button
                type="button"
                className="bad-shelf-head"
                onClick={() => onToggleShelf(shelf.id)}
                title={shelf.name}
              >
                {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                {!collapsed && <span>{shelf.name}</span>}
                {!collapsed && <small>{filtered.length}</small>}
              </button>
              {open && !collapsed && (
                <div className="bad-book-list">
                  {filtered.length === 0 && (
                    <p className="bad-empty">{normalQuery ? "没匹配的书。" : "这个书架还没书。"}</p>
                  )}
                  {filtered.map((book) => (
                    <button
                      type="button"
                      key={book.id}
                      className={classes("bad-book-item", activeBookId === book.id && "is-active")}
                      onClick={() => onSelectBook(book.id)}
                      title={`${book.title}${book.author ? "  ·  " + book.author : ""}`}
                    >
                      <BookMarked size={14} />
                      <div className="bad-book-item-text">
                        <strong>{book.title}</strong>
                        {book.author && <span>{book.author}</span>}
                      </div>
                    </button>
                  ))}
                  {shelf.id !== "_unfiled" && !SYSTEM_SHELF_IDS.has(shelf.id) && (
                    <div className="bad-shelf-tools">
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
  // Treat 收藏 as "finished" — the third stage is reached
  const currentIndex = isFavorite
    ? 2
    : Math.max(0, WORKFLOW_STEPS.findIndex((s) => s.id === book.shelfId));
  const currentStep = WORKFLOW_STEPS[currentIndex];
  const nextStep = WORKFLOW_STEPS[currentIndex + 1];

  const moveTo = (shelfId) => onPatch({ shelfId });

  return (
    <section className="bad-workflow">
      <ol className="bad-workflow-steps">
        {WORKFLOW_STEPS.map((step, idx) => {
          const state =
            idx < currentIndex ? "done" : idx === currentIndex ? "current" : "todo";
          return (
            <li key={step.id} className={`is-${state}`}>
              <span className="bad-workflow-dot">
                {state === "done" ? <Check size={13} /> : idx + 1}
              </span>
              <span className="bad-workflow-label">{step.label}</span>
              {idx < WORKFLOW_STEPS.length - 1 && (
                <span className="bad-workflow-arrow" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
      <div className="bad-workflow-actions">
        {nextStep && currentStep.nextLabel && !isFavorite && (
          <button
            type="button"
            className="bad-workflow-next"
            onClick={() => moveTo(nextStep.id)}
            title={`移到「${nextStep.label}」`}
          >
            {currentStep.nextLabel} <ChevronRight size={14} />
          </button>
        )}
        <button
          type="button"
          className={classes("bad-workflow-fav", isFavorite && "is-on")}
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
    <section className="bad-info-card">
      <div className="bad-info-line">
        <label className="bad-info-field">
          <span>作者：</span>
          <input
            value={book.author}
            onChange={(e) => onPatch({ author: e.target.value })}
            placeholder="作者"
          />
        </label>
        <label className="bad-info-field">
          <span>原名：</span>
          <input
            value={book.originalTitle}
            onChange={(e) => onPatch({ originalTitle: e.target.value })}
            placeholder="原文书名（可空）"
          />
        </label>
      </div>
      <label className="bad-info-field bad-info-take">
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

// --------- Materials panel ---------

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`;
}

function MaterialsPanel({ materials, loading, onRefresh }) {
  return (
    <section className="bad-materials">
      <header>
        <div>
          <FolderOpen size={15} />
          <strong>资料</strong>
          <span className="bad-muted">{materials?.items?.length || 0} 个文件</span>
        </div>
        <button type="button" onClick={onRefresh} title="刷新"><RefreshCw size={14} /></button>
      </header>
      {materials?.path && (
        <p className="bad-materials-path" title={materials.path}>
          把 PDF / 音频 / 思维导图等文件放到这本书的文件夹里，刷新就能看到：<br />
          <code>{materials.path}</code>
        </p>
      )}
      {loading ? (
        <p className="bad-muted"><Loader2 className="bad-spin" size={14} /> 读取中…</p>
      ) : materials?.items?.length ? (
        <ul className="bad-material-list">
          {materials.items.map((item) => (
            <li key={item.name} className={`kind-${item.kind}`}>
              {item.isDir ? (
                <span><FolderOpen size={14} /> {item.name}/</span>
              ) : (
                <a href={item.url} target="_blank" rel="noreferrer">
                  <FileText size={14} /> {item.name}
                </a>
              )}
              <small>{item.kind}{item.size ? ` · ${formatBytes(item.size)}` : ""}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p className="bad-muted">还没文件。把资料放到上面的文件夹后点刷新。</p>
      )}
    </section>
  );
}

// --------- Prompt panel ---------

function PromptPanel({ book, onCopy }) {
  return (
    <section className="bad-prompts">
      <header>
        <Sparkles size={15} />
        <strong>AI 整理模板</strong>
        <span className="bad-muted">复制后扔给 ChatGPT/Claude，回答粘回对应 Tab</span>
      </header>
      <div className="bad-prompt-grid">
        {PROMPT_TEMPLATES.map((tpl) => (
          <button
            type="button"
            key={tpl.id}
            className="bad-prompt-card"
            onClick={() => onCopy(tpl, fillPromptTemplate(tpl.prompt, book))}
            title={fillPromptTemplate(tpl.prompt, book)}
          >
            <div>
              <Wand2 size={14} />
              <strong>{tpl.label}</strong>
            </div>
            <p>{fillPromptTemplate(tpl.prompt, book).slice(0, 90)}…</p>
            <span className="bad-prompt-copy"><Clipboard size={12} /> 复制</span>
          </button>
        ))}
      </div>
    </section>
  );
}

// --------- Right sidebar (materials + AI prompts) ---------

function RightSidebar({
  book,
  materials,
  materialsLoading,
  collapsed,
  onToggleCollapsed,
  onRefreshMaterials,
  onCopyPrompt,
}) {
  return (
    <aside className={classes("bad-right-sidebar", collapsed && "is-collapsed")}>
      <div className="bad-right-head">
        <button
          type="button"
          className="bad-icon-button"
          onClick={onToggleCollapsed}
          title={collapsed ? "展开右栏" : "折叠右栏"}
        >
          {collapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
        {!collapsed && (
          <div className="bad-right-title">
            <Sparkles size={15} />
            <span>资料 & AI 模板</span>
          </div>
        )}
      </div>
      {!collapsed && (
        <div className="bad-right-body">
          {book ? (
            <>
              <MaterialsPanel
                materials={materials}
                loading={materialsLoading}
                onRefresh={onRefreshMaterials}
              />
              <PromptPanel book={book} onCopy={onCopyPrompt} />
            </>
          ) : (
            <p className="bad-muted bad-right-empty">
              先从左栏选一本书，这里会出现这本书的资料文件夹和 AI 整理模板。
            </p>
          )}
        </div>
      )}
    </aside>
  );
}

// --------- Main app ---------

export default function BookADayApp() {
  const [library, setLibrary] = useState({ shelves: [], totalBooks: 0 });
  const [activeBookId, setActiveBookId] = useState("");
  const [book, setBook] = useState(null);
  const [materials, setMaterials] = useState(null);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("oneLiner");
  const [tabDraft, setTabDraft] = useState("");
  const [mode, setMode] = useState("split");
  const [openShelves, setOpenShelves] = useState(() => new Set(["wantToRead", "reading", "read", "collection"]));
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const stopQueueRef = useRef(false);
  const textareaRef = useRef(null);
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

  const loadMaterials = useCallback(async (bookId) => {
    if (!bookId) return;
    setMaterialsLoading(true);
    try {
      const data = await fetchMaterials(bookId);
      setMaterials(data);
    } catch (err) {
      // Materials are non-critical; show inline only.
      setMaterials({ items: [], path: "" });
    } finally {
      setMaterialsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  useEffect(() => {
    if (!activeBookId) {
      setBook(null);
      setMaterials(null);
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
    loadMaterials(activeBookId);
  }, [activeBookId, loadMaterials]);

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

  // Auto-grow the editor textarea so the whole workspace scrolls as one piece
  // (no scrollbar inside the editor / reader cards).
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
    setActiveTab("oneLiner");
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
    if (!window.confirm(`删除《${book.title}》？这会移除整个文件夹（包括 materials/）。`)) return;
    await deleteBook(book.id);
    setActiveBookId("");
    setBook(null);
    setMaterials(null);
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

  const handleCopyPrompt = async (tpl, prompt) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setStatus(`已复制：${tpl.label}`);
    } catch {
      setError("复制失败，请手动选中文本。");
    }
  };

  const handleReadCurrent = async () => {
    const language = book?.language || "zh";
    const chunks = splitForTts(tabDraft, language);
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

  const handleReadWholeBook = async () => {
    if (!book) return;
    const sections = book.sections || {};
    // Prefer the dedicated narration if it exists; otherwise stitch the highlights.
    let text;
    if ((sections.narration || "").trim()) {
      text = sections.narration;
    } else {
      text = ["oneLiner", "synopsis", "points", "quotes", "notes"]
        .map((key) => sections[key])
        .filter((s) => (s || "").trim())
        .join("\n\n");
    }
    if (!text.trim()) {
      setError("没有可朗读的内容。先写朗读稿或概要/要点。");
      return;
    }
    const chunks = splitForTts(text, book.language || "zh");
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

  const totalBooks = library.totalBooks || library.shelves.reduce((sum, s) => sum + s.books.length, 0);

  return (
    <div
      className={classes(
        "bad-shell",
        sidebarCollapsed && "is-sidebar-collapsed",
        rightSidebarCollapsed && "is-right-collapsed",
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

      <main className="bad-main">
        <header className="bad-topbar">
          <div className="bad-title-zone">
            <input
              value={book?.title || ""}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder={book ? "未命名书籍" : "A Book a Day"}
              className="bad-title-input"
              onBlur={() => {
                if (book && dirty) {
                  handlePatchMeta({ title: book.title });
                }
              }}
            />
            {(!book || dirty) && (
              <div className="bad-meta-row">
                {book ? (
                  dirty && <span className="bad-dirty">本 Tab 未保存</span>
                ) : (
                  <span>{totalBooks} 本书 · 从左栏选一本，或按 “新书” 开始记录</span>
                )}
              </div>
            )}
          </div>
          <div className="bad-toolbar">
            <div className="bad-mode-switch" role="tablist" aria-label="View mode">
              {["read", "split", "edit"].map((m) => (
                <button type="button" key={m} className={mode === m ? "is-active" : ""} onClick={() => setMode(m)}>
                  {m}
                </button>
              ))}
            </div>
            <button type="button" onClick={handleReadCurrent} disabled={!tabDraft || !!loadingKey} title="朗读当前 Tab">
              <Play size={16} /> 朗读本 Tab
            </button>
            <button type="button" onClick={handleReadWholeBook} disabled={!book || !!loadingKey} title="一口气听整本（优先朗读稿）">
              <BookOpen size={16} /> 听整本
            </button>
            {speakingKey && !paused && <button type="button" onClick={pause}><Pause size={16} /> 暂停</button>}
            {speakingKey && paused && <button type="button" onClick={resume}><Play size={16} /> 继续</button>}
            {speakingKey && <button type="button" onClick={handleStop}><Square size={15} /> 停</button>}
            <button type="button" onClick={handleSaveTab} disabled={!book || saving}>
              <Save size={16} /> {saving ? "保存中" : "保存本 Tab"}
            </button>
            <button type="button" onClick={loadLibrary} title="刷新整个书库"><RefreshCw size={16} /></button>
            <button type="button" className="bad-danger" onClick={handleDeleteBook} disabled={!book}>
              <Trash2 size={16} />
            </button>
          </div>
        </header>

        {(error || ttsError || status) && (
          <div className={classes("bad-message", error || ttsError ? "is-error" : "is-ok")}>
            {error || ttsError || status}
          </div>
        )}

        {loading ? (
          <div className="bad-loading"><Loader2 className="bad-spin" size={20} /> 加载书库…</div>
        ) : !book ? (
          <section className="bad-welcome">
            <BookOpen size={42} />
            <h2>每天读一本（或一点）</h2>
            <p>
              这里是你的读书工作台。左栏按 想读 → 在读 → 已读（→ ⭐ 收藏）的进度管理你的书；
              中间每本书都有 7 个 Tab；右栏（可折叠）是这本书的资料文件夹和一键复制的 AI 整理模板。<br />
              先从「新书」开始，或点左栏的一本书。
            </p>
            <button type="button" onClick={handleNewBook}><Plus size={16} /> 新书</button>
          </section>
        ) : (
          <section className="bad-workspace">
            <WorkflowStepper book={book} onPatch={handlePatchMeta} />
            <InfoCard book={book} onPatch={handlePatchMeta} />

            <div className="bad-tabs">
              {TABS.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  className={classes("bad-tab", activeTab === tab.id && "is-active")}
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

            <p className="bad-tab-hint">{TABS.find((t) => t.id === activeTab)?.hint}</p>

            <section className={classes("bad-tab-pane", `mode-${mode}`)}>
              {mode !== "edit" && (
                <div className="bad-reader">
                  {activeTab === "mindmap" ? (
                    <MindMapView markdown={tabDraft} />
                  ) : (
                    <MarkdownView markdown={tabDraft} />
                  )}
                </div>
              )}
              {mode !== "read" && (
                <div className="bad-editor-pane">
                  <div className="bad-editor-head">
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

      <RightSidebar
        book={book}
        materials={materials}
        materialsLoading={materialsLoading}
        collapsed={rightSidebarCollapsed}
        onToggleCollapsed={() => setRightSidebarCollapsed((v) => !v)}
        onRefreshMaterials={() => book && loadMaterials(book.id)}
        onCopyPrompt={handleCopyPrompt}
      />
    </div>
  );
}
