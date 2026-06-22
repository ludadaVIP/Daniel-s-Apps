import { useCallback, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  FileText,
  Loader2,
  RefreshCcw,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

import "./styles.css";
import { fetchDocument, fetchLibrary } from "./services/api";

function classes(...parts) {
  return parts.filter(Boolean).join(" ");
}

export default function NzInvestApp() {
  const [library, setLibrary] = useState({ sections: [], total: 0 });
  const [activePath, setActivePath] = useState("");
  const [doc, setDoc] = useState(null);
  const [query, setQuery] = useState("");
  const [openSections, setOpenSections] = useState({});
  const [loadingLibrary, setLoadingLibrary] = useState(true);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [error, setError] = useState("");

  const loadLibrary = useCallback(async () => {
    setLoadingLibrary(true);
    setError("");
    try {
      const data = await fetchLibrary();
      setLibrary(data);
      setOpenSections((current) => {
        const next = { ...current };
        for (const section of data.sections || []) {
          if (next[section.id] === undefined) next[section.id] = true;
        }
        return next;
      });
      if (!activePath) {
        const first = data.sections?.[0]?.docs?.[0];
        if (first) setActivePath(first.path);
      }
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoadingLibrary(false);
    }
  }, [activePath]);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  useEffect(() => {
    if (!activePath) {
      setDoc(null);
      return;
    }
    let alive = true;
    setLoadingDoc(true);
    setError("");
    fetchDocument(activePath)
      .then((data) => {
        if (alive) setDoc(data);
      })
      .catch((err) => {
        if (alive) setError(err.message || String(err));
      })
      .finally(() => {
        if (alive) setLoadingDoc(false);
      });
    return () => {
      alive = false;
    };
  }, [activePath]);

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return library.sections || [];
    return (library.sections || [])
      .map((section) => ({
        ...section,
        docs: section.docs.filter((item) => {
          const hay = `${item.title} ${item.slug} ${item.level} ${(item.tags || []).join(" ")} ${item.one_line || ""}`.toLowerCase();
          return hay.includes(q);
        }),
      }))
      .filter((section) => section.docs.length > 0);
  }, [library.sections, query]);

  const activeSummary = useMemo(() => {
    for (const section of library.sections || []) {
      const hit = section.docs.find((item) => item.path === activePath);
      if (hit) return hit;
    }
    return null;
  }, [library.sections, activePath]);

  return (
    <div className="nzi-shell">
      <aside className="nzi-sidebar">
        <header className="nzi-brand">
          <div className="nzi-mark">
            <ShieldCheck size={21} strokeWidth={2.2} />
          </div>
          <div>
            <p>NZ Invest</p>
            <span>{library.total || 0} lessons · Markdown course</span>
          </div>
        </header>

        <label className="nzi-search">
          <Search size={14} strokeWidth={2} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索术语、税务、平台"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} title="清空搜索">
              <X size={13} />
            </button>
          )}
        </label>

        <nav className="nzi-tree" aria-label="NZ Invest lessons">
          {loadingLibrary ? (
            <div className="nzi-side-state">
              <Loader2 className="nzi-spin" size={16} />
              <span>读取课程...</span>
            </div>
          ) : filteredSections.length === 0 ? (
            <div className="nzi-side-state">没有匹配的课程。</div>
          ) : (
            filteredSections.map((section) => {
              const open = openSections[section.id] ?? true;
              return (
                <section className="nzi-section" key={section.id}>
                  <button
                    type="button"
                    className="nzi-section-head"
                    onClick={() => setOpenSections((current) => ({ ...current, [section.id]: !open }))}
                  >
                    {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <span>{section.title}</span>
                    <small>{section.docs.length}</small>
                  </button>
                  {open && (
                    <div className="nzi-doc-list">
                      {section.docs.map((item) => (
                        <button
                          type="button"
                          key={item.path}
                          className={classes("nzi-doc-item", activePath === item.path && "is-active")}
                          onClick={() => setActivePath(item.path)}
                          title={item.one_line || item.title}
                        >
                          <FileText size={14} />
                          <span>{item.title}</span>
                          {item.level && <em>{item.level}</em>}
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              );
            })
          )}
        </nav>

        <button type="button" className="nzi-refresh" onClick={loadLibrary}>
          <RefreshCcw size={14} />
          <span>刷新课程</span>
        </button>
      </aside>

      <main className="nzi-main">
        <header className="nzi-topbar">
          <div>
            <p className="nzi-eyebrow">New Zealand investor curriculum</p>
            <h1>{doc?.meta?.title || activeSummary?.title || "NZ Invest"}</h1>
            <div className="nzi-meta">
              {activeSummary?.level && <span>{activeSummary.level}</span>}
              {activeSummary?.section && <span>{activeSummary.section}</span>}
              {activeSummary?.tags?.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </div>
        </header>

        {error && (
          <div className="nzi-message">
            {error}
          </div>
        )}

        <section className="nzi-reader">
          {loadingDoc ? (
            <div className="nzi-loading">
              <Loader2 className="nzi-spin" size={20} />
              <span>载入文档...</span>
            </div>
          ) : doc ? (
            <article className="nzi-doc">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {doc.body}
              </ReactMarkdown>
            </article>
          ) : (
            <div className="nzi-empty">
              <BookOpen size={34} />
              <h2>选择左侧课程开始</h2>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

const markdownComponents = {
  a: ({ href, children, ...props }) => (
    <a href={href} target="_blank" rel="noreferrer noopener" {...props}>
      {children}
    </a>
  ),
};

