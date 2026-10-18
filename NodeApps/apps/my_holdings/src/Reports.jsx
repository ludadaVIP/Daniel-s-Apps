import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  FileCode2,
  FolderOpen,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { BASE, request, localDate } from "./api.js";
import { Modal, Field } from "./Forms.jsx";
export function ReportPreview({ report, onClose }) {
  const docId =
    report.id ||
    btoa(unescape(encodeURIComponent(report.path)))
      .replaceAll("+", "-")
      .replaceAll("/", "_")
      .replaceAll("=", "");
  const url = `${BASE}/library/document/${encodeURIComponent(docId)}`;
  return (
    <div
      className="mh-reader"
      role="dialog"
      aria-modal="true"
      aria-label="HTML 报告阅读"
    >
      <header>
        <FileCode2 size={19} />
        <strong>{report.title || report.path}</strong>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mh-button"
        >
          新窗口 <ArrowUpRight size={15} />
        </a>
        <button className="mh-icon" aria-label="关闭报告" onClick={onClose}>
          <X size={20} />
        </button>
      </header>
      <iframe
        title={report.title || "研究报告"}
        src={url}
        sandbox="allow-scripts allow-forms allow-modals allow-popups allow-downloads"
      />
      <footer>独立 HTML · 复用 VisualShelf 阅读引擎 · 文件保存在本机</footer>
    </div>
  );
}
export function Reports({ notify, onOpen, revision }) {
  const [items, set] = useState([]),
    [query, setQuery] = useState(""),
    [folder, setFolder] = useState("all"),
    [loading, setLoading] = useState(true),
    [importing, setImport] = useState(false),
    [html, setHtml] = useState(""),
    [name, setName] = useState(`${localDate()}-research.html`),
    [category, setCategory] = useState("market"),
    [busy, setBusy] = useState(false);
  const load = async () => {
    setLoading(true);
    try {
      const r = await request("/library/api/documents?refresh=1");
      set(r.items);
    } catch (e) {
      notify(e.message, true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [revision]);
  const importReport = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await request("/api/reports/import", { html, name, folder: category });
      setImport(false);
      setHtml("");
      notify("报告已保存到 HTML 文件夹");
      await load();
    } catch (e) {
      notify(e.message, true);
    } finally {
      setBusy(false);
    }
  };
  const choose = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 6000000) {
      notify("HTML 文件请小于 6 MB", true);
      return;
    }
    setHtml(await file.text());
    setName(file.name);
  };
  const visible = items
    .filter(
      (r) =>
        (folder === "all" || r.folder.startsWith(folder)) &&
        `${r.title} ${r.summary} ${r.relativePath}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return (
    <>
      <div className="mh-page-heading">
        <div>
          <span className="mh-eyebrow">A LIBRARY OF PERSPECTIVES</span>
          <h1>行情与研究档案</h1>
          <p>让每一次分析，都成为下一次决策的底稿。</p>
        </div>
        <button className="mh-primary" onClick={() => setImport(true)}>
          <Plus size={17} /> 导入 HTML
        </button>
      </div>
      <div className="mh-banner">
        <FolderOpen size={22} />
        <div>
          <strong>你的投资 VisualShelf</strong>
          <p>
            把独立 HTML 放入 <code>apps/my_holdings/data/reports/</code>
            ，点击刷新即可阅读。支持子文件夹。
          </p>
        </div>
        <button
          className="mh-button"
          onClick={async () => {
            try {
              await request("/library/api/library/open", {});
            } catch (e) {
              notify(e.message, true);
            }
          }}
        >
          打开文件夹
        </button>
      </div>
      <div className="mh-toolbar">
        <div className="mh-tabs">
          {[
            ["all", "全部"],
            ["market", "行情分析"],
            ["portfolio", "持仓分析"],
            ["research", "公司研究"],
          ].map(([key, label]) => (
            <button
              className={folder === key ? "active" : ""}
              key={key}
              onClick={() => setFolder(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="mh-search">
          <Search size={16} />
          <input
            aria-label="搜索研究报告"
            placeholder="搜索研究…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <button
          className="mh-icon"
          aria-label="刷新报告文件夹"
          disabled={loading}
          onClick={load}
        >
          <RefreshCw size={17} className={loading ? "mh-spin" : ""} />
        </button>
      </div>
      <div className="mh-report-grid">
        {visible.map((r, i) => (
          <button
            className="mh-report-card"
            key={r.id}
            onClick={() => onOpen(r)}
          >
            <div className={`mh-report-cover tone-${i % 3}`}>
              <span>
                {r.folder === "market"
                  ? "MARKET OUTLOOK"
                  : r.folder === "portfolio"
                    ? "PORTFOLIO REVIEW"
                    : "RESEARCH NOTE"}
              </span>
              <FileCode2 size={46} strokeWidth={1} />
              <small>MY HOLDINGS / RESEARCH</small>
            </div>
            <div>
              <small>
                {r.folder || "研究"} ·{" "}
                {new Date(r.updatedAt).toLocaleDateString("zh-CN")}
              </small>
              <h3>{r.title}</h3>
              <p>{r.summary.slice(0, 115)}</p>
              <span className="mh-text-button">
                阅读报告 <ArrowUpRight size={14} />
              </span>
            </div>
          </button>
        ))}
      </div>
      {!loading && !visible.length && (
        <div className="mh-empty">
          <FileCode2 size={32} />
          <h3>为下一个好判断，留一个位置</h3>
          <p>导入其他 AI 返回的 HTML，或在「AI 工作台」生成第一份研究。</p>
          <button className="mh-button" onClick={() => setImport(true)}>
            导入第一份报告
          </button>
        </div>
      )}
      {importing && (
        <Modal title="保存一份 HTML 报告" onClose={() => setImport(false)} wide>
          <form onSubmit={importReport}>
            <div className="mh-form-grid">
              <Field label="分类">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="market">行情分析</option>
                  <option value="portfolio">持仓分析</option>
                  <option value="research">公司研究</option>
                </select>
              </Field>
              <Field label="文件名">
                <input
                  required
                  maxLength={160}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
            </div>
            <Field label="选择 HTML 文件">
              <input
                type="file"
                accept=".html,.htm,text/html"
                onChange={choose}
              />
            </Field>
            <Field label="或粘贴完整 HTML 源码">
              <textarea
                required
                className="mh-code"
                rows={12}
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                placeholder="<!doctype html>…"
              />
            </Field>
            <p className="mh-help">
              请使用独立 HTML，样式内嵌；同名文件不会被覆盖。
            </p>
            <footer className="mh-form-footer">
              <span>保留原始 HTML 内容</span>
              <button className="mh-primary" disabled={busy || !html}>
                {busy ? "保存中…" : "保存并加入书库"}
              </button>
            </footer>
          </form>
        </Modal>
      )}
    </>
  );
}
