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
      "7. 朗读稿：直接输出完整正文（不要再外挂大纲、内容结构、写作思路之类的元信息块——骨架应该让读者在读正文时自然感受到）。用 `## 章节标题` 划分 5-8 个章节作为隐性骨架的外显。正文必须 ≥ 4000 个中文字符，理想区间 4000–5500 字，上限 6500 字。一次性写完，不允许「先写短稿再补字」；不足 4000 → 删掉重写。客观复述原书的论点、定义、例子、案例（占 80%），少量必要背景（15%）和诚实局限说明（5%）；严禁「愿你...」式励志结尾、严禁「我打算落地的小动作」式个人化收尾、严禁替作者加观点。",
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
    label: "4000+ 朗读稿",
    prompt:
      "为《{{title}}》写一份中文朗读稿/精炼稿。\n\n" +
      "【角色】你是顶尖书籍提炼专家——不是博主、不是讲书人、不是励志作者。你做的事只有一件：客观、准确地复述这本书的精华，让读者在一次通勤的时间里读懂这本书。\n\n" +
      "【内容比例】~80% 客观复述原书的核心论点链 / 关键概念定义（用作者自己的话）/ 作者书中的例子和案例；~15% 必要背景（作者、写作时代、思想史位置——只为理解原书内容服务）；~5% 诚实的局限说明（学界批评 / 过时的数据 / 不严密之处）。\n\n" +
      "【骨架】先在脑子里把这本书挖透（作者、结构、核心命题、关键概念、最反复强调的观点、最尖锐的批评——至少 20 个信息点）；再做极致取舍——只保留 6–8 个最核心的观点（不讲这条就不能理解这本书命题的那种），每个观点配作者书中的具体例子。\n\n" +
      "【输出格式】直接输出完整正文。**不要外挂「朗读大纲」「内容结构」「写作思路」之类的元信息块**——骨架应该让读者读正文时自然感受到，就像看一个人,你看到的是这个人本身,而不是先看一遍他的骨架、再看一遍他的器官、最后再看完整的他。用 `## 章节标题` 划分 5–8 个章节（好的章节标题 = 隐性骨架的外显 = 前端 TOC）。开场直接进书（用一个具体场景 / 问题 / 反直觉事实切入，不要写「博主开场白」），不要在最前面 `# 书名`。\n\n" +
      "【字数】正文 ≥ 4000 中文字符，理想 4000–5500，上限 6500。一次性写完，不允许「先写短稿再补字」；写完后不足 4000 → 删掉正文重新写（绝不允许靠加感悟尾巴凑数）。\n\n" +
      "【TTS 友好】句子 ≤ 40 字最佳，超过 60 字断句；段落自然换行；避免表格、emoji、长串英文术语。\n\n" +
      "【严禁】❌「愿你...」「希望你...」式励志收尾；❌「我打算落地的小动作」「行动指南」「7 步法」式个人化 / 实用化收尾（除非书本身就是实用书）；❌ 把「我」放进稿子里下指令；❌ 替作者建立他没建立的跨书联想；❌ 编造作者没说的话。\n\n" +
      "【收尾】最后一段把整本书的论证收束成一句可记忆的命题——「这本书在说 X」，钉死它，而不是「愿你...」。",
  },
  {
    id: "comparison",
    label: "和其他书的对比",
    prompt: "把《{{title}}》和领域内 2-3 本经典做对比，说明它的独特价值与不足。",
  },
];

// Shelves are grouped by reading life-cycle. Each book is at one of 4 stages:
//   pre       — 想读 / 属灵 / 文化 / 投资
//   reading   — 在读
//   finished  — 已读 (not yet classified)
//   post      — 收藏 / 回看 / 存档 / 浅显 / 深奥 / 月读
// The sidebar renders these groups with visual headers; the workflow stepper
// shows them as 3 progress dots (pre → reading → finished/post).
const SHELF_GROUP_META = {
  pre: { label: "准备读", order: 0 },
  reading: { label: "在读", order: 1 },
  finished: { label: "已读", order: 2 },
  post: { label: "归类", order: 3 },
};
const SHELF_GROUP_ORDER = ["pre", "reading", "finished", "post"];

// Default "next" target when the user clicks the workflow forward button.
const NEXT_DEFAULT_SHELF = {
  pre: "reading",
  reading: "read",
  finished: null, // 已读 → 归类菜单
};
const NEXT_BUTTON_LABEL = {
  pre: "开始读",
  reading: "读完了",
};

// All built-in shelves. The user can still create custom shelves; only
// these are protected from delete / rename in the sidebar.
const SYSTEM_SHELF_IDS = new Set([
  "wantToRead", "spirit", "culture", "investment",
  "reading", "read",
  "collection", "revisit", "archive", "shallow", "deep", "monthly",
]);
const DEFAULT_POST_SHELF = "collection";

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
        {SHELF_GROUP_ORDER.map((groupKey) => {
          // A shelf belongs to a group when its ``group`` field matches; the
          // synthetic "_unfiled" bucket from the backend has no group and
          // gets pinned to the bottom of the "post" section.
          const shelvesInGroup = shelves.filter((shelf) => {
            if (shelf.id === "_unfiled") return groupKey === "post";
            return (shelf.group || "pre") === groupKey;
          });
          if (shelvesInGroup.length === 0) return null;
          const meta = SHELF_GROUP_META[groupKey];
          return (
            <div key={groupKey} className={classes("bad-shelf-group", `bad-shelf-group-${groupKey}`)}>
              {!collapsed && (
                <div className="bad-shelf-group-head" aria-hidden="true">
                  <span>{meta.label}</span>
                </div>
              )}
              {shelvesInGroup.map((shelf) => {
                const filtered = shelf.books.filter((book) => {
                  if (!normalQuery) return true;
                  const haystack = `${book.title} ${book.author} ${(book.tags || []).join(" ")} ${book.excerpt || ""}`.toLowerCase();
                  return haystack.includes(normalQuery);
                });
                const open = openShelves.has(shelf.id);
                return (
                  <section key={shelf.id} className={classes("bad-shelf", `bad-shelf-${shelf.id}`, `bad-shelf-g-${groupKey}`)}>
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
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

// --------- Workflow stepper + slim info card ---------

// Find the shelf metadata (group, name) for the book's current shelfId.
// Falls back to a "pre"-style entry if the shelf was deleted while the
// book pointed to it (or for the synthetic "_unfiled" bucket).
function findShelf(shelves, shelfId) {
  for (const shelf of shelves) {
    if (shelf.id === shelfId) return shelf;
  }
  return null;
}

function WorkflowStepper({ book, shelves, onPatch }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the "归类" dropdown when the user clicks outside.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDocClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", onDocClick);
    return () => window.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  if (!book) return null;

  const currentShelf = findShelf(shelves, book.shelfId);
  const currentGroup = currentShelf?.group || "pre";
  const currentStageIndex = Math.min(
    SHELF_GROUP_ORDER.indexOf(currentGroup),
    SHELF_GROUP_ORDER.length - 1,
  );
  // "post" and "finished" both light the third dot — they're both "已经读完
  // 了" from the user's perspective; the difference is whether they've also
  // been classified yet.
  const displayDotIndex = currentGroup === "post" ? 2 : currentStageIndex;
  const nextDefaultShelf = NEXT_DEFAULT_SHELF[currentGroup];
  const nextButtonLabel = NEXT_BUTTON_LABEL[currentGroup];

  // 3 fixed dots: 准备读 / 在读 / 已读. The "post" stage is shown as a
  // sub-label under the third dot rather than as a separate dot, so the
  // bar stays compact and reads left-to-right as a clear progression.
  const DOTS = [
    { key: "pre", label: "准备读" },
    { key: "reading", label: "在读" },
    { key: "finished", label: "已读" },
  ];

  const moveTo = (shelfId) => {
    setMenuOpen(false);
    onPatch({ shelfId });
  };

  // Post-reading shelves available in the "归类" dropdown.
  const postShelves = shelves.filter((s) => s.group === "post" && s.id !== "_unfiled");
  const isFavorite = book.shelfId === "collection";
  const canClassify = currentGroup === "finished" || currentGroup === "post";

  return (
    <section className="bad-workflow">
      <ol className="bad-workflow-steps">
        {DOTS.map((dot, idx) => {
          const state =
            idx < displayDotIndex ? "done" : idx === displayDotIndex ? "current" : "todo";
          // Show the user's actual shelf name under the active dot so they
          // know exactly where the book lives right now (e.g. dot says
          // "准备读" but sub-label says "属灵").
          const sublabel =
            state === "current" && currentShelf && currentShelf.name !== dot.label
              ? currentShelf.name
              : null;
          return (
            <li key={dot.key} className={`is-${state}`}>
              <span className="bad-workflow-dot">
                {state === "done" ? <Check size={13} /> : idx + 1}
              </span>
              <span className="bad-workflow-label">
                {dot.label}
                {sublabel && <em className="bad-workflow-sub">· {sublabel}</em>}
              </span>
              {idx < DOTS.length - 1 && (
                <span className="bad-workflow-arrow" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
      <div className="bad-workflow-actions">
        {nextDefaultShelf && nextButtonLabel && (
          <button
            type="button"
            className="bad-workflow-next"
            onClick={() => moveTo(nextDefaultShelf)}
            title={`移到「${nextButtonLabel === "开始读" ? "在读" : "已读"}」`}
          >
            {nextButtonLabel} <ChevronRight size={14} />
          </button>
        )}
        {canClassify && (
          <div className="bad-workflow-menu" ref={menuRef}>
            <button
              type="button"
              className={classes("bad-workflow-classify", currentGroup === "post" && "is-classified")}
              onClick={() => setMenuOpen((v) => !v)}
              title="把这本书归到一个收藏类"
            >
              <FolderOpen size={14} />
              {currentGroup === "post" && currentShelf ? currentShelf.name : "归类…"}
              <ChevronDown size={13} />
            </button>
            {menuOpen && (
              <div className="bad-workflow-menu-pop" role="menu">
                {currentGroup === "post" && (
                  <button
                    type="button"
                    className="bad-workflow-menu-item is-revert"
                    onClick={() => moveTo("read")}
                  >
                    ← 移回「已读」
                  </button>
                )}
                {postShelves.map((shelf) => (
                  <button
                    type="button"
                    key={shelf.id}
                    className={classes(
                      "bad-workflow-menu-item",
                      shelf.id === book.shelfId && "is-active",
                    )}
                    onClick={() => moveTo(shelf.id)}
                  >
                    {shelf.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <button
          type="button"
          className={classes("bad-workflow-fav", isFavorite && "is-on")}
          onClick={() => moveTo(isFavorite ? "read" : DEFAULT_POST_SHELF)}
          title={isFavorite ? "从「收藏」移回「已读」" : "一键加入「收藏」"}
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
  const [openShelves, setOpenShelves] = useState(() => new Set(["reading"]));
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
    // Ask which life-cycle group it belongs to so it lands in the right
    // place in the sidebar. Default = 准备读 (the safest catch-all).
    const groupAnswer = window.prompt(
      "属于哪个阶段？\n  1 - 准备读（同「想读」级别）\n  2 - 在读\n  3 - 已读\n  4 - 归类（同「收藏」级别）\n输入数字（默认 1）：",
      "1",
    );
    if (groupAnswer === null) return; // user pressed Cancel
    const group = { 1: "pre", 2: "reading", 3: "finished", 4: "post" }[groupAnswer.trim()] || "pre";
    const shelf = await createShelf({ name, group });
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
              这里是你的读书工作台。左栏按 准备读（想读 / 属灵 / 文化 / 投资）→ 在读 → 已读 → 归类（收藏 / 回看 / 存档 / 浅显 / 深奥 / 月读）的进度管理你的书；
              中间每本书都有 7 个 Tab；右栏（可折叠）是这本书的资料文件夹和一键复制的 AI 整理模板。<br />
              先从「新书」开始，或点左栏的一本书。
            </p>
            <button type="button" onClick={handleNewBook}><Plus size={16} /> 新书</button>
          </section>
        ) : (
          <section className="bad-workspace">
            <WorkflowStepper book={book} shelves={library.shelves} onPatch={handlePatchMeta} />
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
