import { useEffect, useState } from "react";
import { BookOpen, BookMarked, ClipboardList, FileText, GripVertical, NotebookPen, Save, ScrollText, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const APPS = [
  {
    id: "record-meditation",
    title: "Record & Meditation",
    subtitle: "日记 · 读书笔记 · AI 对话感想 · 讲座回顾",
    description: "按年 / 月 / 日组织的轻量日志，支持富文本编辑、标签搜索和 JSON / CSV / ZIP 导出。",
    accent: "#6a3f86",
    Icon: NotebookPen,
    to: "/record-meditation",
    kind: "Journal",
  },
  {
    id: "save-md",
    title: "Save MD",
    subtitle: "保存 AI 回答 · Markdown 文件库 · 阅读/编辑/朗读",
    description: "把值得复习的回答保存成真实 .md 文件，支持分类、阅读、编辑、元数据和 Edge TTS 朗读。",
    accent: "#178a58",
    Icon: FileText,
    to: "/save-md",
    kind: "MD",
  },
  {
    id: "bible",
    title: "Recall Bible",
    subtitle: "圣经背诵 · CUV / ESV / NVI 三语切换",
    description: "随机经文练习：看经文出处回忆正文，或看正文回忆出处；可按书卷筛选。",
    accent: "#8a3a2e",
    Icon: ScrollText,
    to: "/bible",
    kind: "Bible",
  },
  {
    id: "book-a-day",
    title: "A Book a Day",
    subtitle: "读书记录 · 书架管理 · AI 整理模板 · 整本朗读",
    description: "每本书一个文件夹（PDF/音频/思维导图随手放），7 个 Tab 拼出 5 分钟搞懂一本书，一键复制 AI 整理 prompt，整本听完。",
    accent: "#b25b00",
    Icon: BookOpen,
    to: "/book-a-day",
    kind: "Books",
  },
  {
    id: "book-in-depth",
    title: "Book In Depth",
    subtitle: "深度精读 · 思维导图 + 万字朗读稿 · 一本书读到底",
    description: "A Book a Day 的兄弟工具，只留两栏：思维导图 + 万字精读稿（~10000 字 / 本）。无 TTS、无右栏，专心看。",
    accent: "#6d4322",
    Icon: BookMarked,
    to: "/book-in-depth",
    kind: "Deep",
  },
  {
    id: "daily-todo",
    title: "Daily Todo",
    subtitle: "每日计划 · 年月日导航 · 优先级 · 时间块 · 复盘",
    description: "左栏按年 / 月 / 日管理计划日期，右侧维护当天 todos，支持状态、优先级、分类、时间、标签、备注、复制和快速添加。",
    accent: "#237489",
    Icon: ClipboardList,
    to: "/daily-todo",
    kind: "Todo",
  },
  {
    id: "investment",
    title: "Investment",
    subtitle: "投资学习 · 关注清单 · 决策日志 · 思维模型 · 案例库",
    description: "把自己从普通人训练成投资人。三支柱（价值/前沿/认知）+ 静态知识库 + 动态市场简报 + 自维护工作台。AI 协作长期生长。",
    accent: "#1e3a5f",
    Icon: TrendingUp,
    to: "/investment",
    kind: "Invest",
  },
];

function orderApps(order) {
  const appsById = new Map(APPS.map((app) => [app.id, app]));
  const seen = new Set();
  const savedApps = (Array.isArray(order) ? order : []).flatMap((id) => {
    const app = appsById.get(id);
    if (!app || seen.has(id)) return [];
    seen.add(id);
    return [app];
  });

  return [...savedApps, ...APPS.filter((app) => !seen.has(app.id))];
}

export default function Hub() {
  const [apps, setApps] = useState(APPS);
  const [savedOrder, setSavedOrder] = useState(() => APPS.map((app) => app.id));
  const [isArranging, setIsArranging] = useState(false);
  const [draggedId, setDraggedId] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [layoutMessage, setLayoutMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetch("/api/hub/layout")
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("Unable to load layout."))))
      .then((layout) => {
        if (cancelled) return;
        const orderedApps = orderApps(layout.order);
        setApps(orderedApps);
        setSavedOrder(orderedApps.map((app) => app.id));
      })
      .catch(() => {
        // A missing backend should not stop the launcher from opening.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const moveApp = (sourceId, targetId) => {
    if (!sourceId || sourceId === targetId) return;
    setApps((currentApps) => {
      const fromIndex = currentApps.findIndex((app) => app.id === sourceId);
      const toIndex = currentApps.findIndex((app) => app.id === targetId);
      if (fromIndex < 0 || toIndex < 0) return currentApps;
      const nextApps = [...currentApps];
      const [movedApp] = nextApps.splice(fromIndex, 1);
      nextApps.splice(toIndex, 0, movedApp);
      return nextApps;
    });
    setIsDirty(true);
    setLayoutMessage("卡片已重新排列，点击“保存排列”生效。");
  };

  const saveLayout = async () => {
    setIsSaving(true);
    setLayoutMessage("");
    try {
      const order = apps.map((app) => app.id);
      const response = await fetch("/api/hub/layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order }),
      });
      if (!response.ok) throw new Error("Unable to save layout.");
      const result = await response.json();
      const confirmedApps = orderApps(result.order);
      setApps(confirmedApps);
      setSavedOrder(confirmedApps.map((app) => app.id));
      setIsDirty(false);
      setIsArranging(false);
      setLayoutMessage("排列已保存。");
    } catch {
      setLayoutMessage("保存失败，请确认本地服务正在运行后重试。");
    } finally {
      setIsSaving(false);
    }
  };

  const cancelArranging = () => {
    setApps(orderApps(savedOrder));
    setIsDirty(false);
    setDraggedId(null);
    setIsArranging(false);
    setLayoutMessage("");
  };

  return (
    <div className="hub-root">
      <header className="hub-header">
        <div className="hub-heading">
          <p className="hub-eyebrow">Road2elite</p>
          <h1 className="hub-title">Road2elite</h1>
          <p className="hub-subtitle">几个独立保留的本地工具，点击卡片进入。</p>
        </div>
        <div className="hub-actions">
          {isArranging ? (
            <>
              <button type="button" className="hub-action-button hub-action-button-secondary" onClick={cancelArranging}>
                取消
              </button>
              <button type="button" className="hub-action-button" onClick={saveLayout} disabled={!isDirty || isSaving}>
                <Save size={15} strokeWidth={2} />
                {isSaving ? "保存中…" : "保存排列"}
              </button>
            </>
          ) : (
            <button
              type="button"
              className="hub-action-button hub-action-button-secondary"
              onClick={() => {
                setIsArranging(true);
                setLayoutMessage("拖动卡片调整顺序，完成后点击“保存排列”。");
              }}
            >
              <GripVertical size={16} strokeWidth={2} />
              整理卡片
            </button>
          )}
          <span className="hub-count">{APPS.length} apps</span>
        </div>
      </header>

      {layoutMessage && <p className="hub-layout-message" role="status">{layoutMessage}</p>}

      <section className={`hub-grid${isArranging ? " is-arranging" : ""}`} aria-label="Sons app launcher">
        {apps.map((app) => (
          <Link
            key={app.id}
            to={app.to}
            className={`hub-card${draggedId === app.id ? " is-dragging" : ""}`}
            style={{ "--card-accent": app.accent }}
            title={`${app.subtitle}\n${app.description}`}
            draggable={isArranging}
            onClick={(event) => {
              if (isArranging) event.preventDefault();
            }}
            onDragStart={(event) => {
              if (!isArranging) return;
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", app.id);
              setDraggedId(app.id);
            }}
            onDragOver={(event) => {
              if (!isArranging) return;
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
            }}
            onDrop={(event) => {
              if (!isArranging) return;
              event.preventDefault();
              moveApp(draggedId || event.dataTransfer.getData("text/plain"), app.id);
              setDraggedId(null);
            }}
            onDragEnd={() => setDraggedId(null)}
          >
            <div className="hub-card-top">
              <div className="hub-card-icon">
                <app.Icon size={20} strokeWidth={1.9} />
              </div>
              {isArranging && <GripVertical className="hub-card-drag-handle" size={20} strokeWidth={2} aria-hidden="true" />}
              <span className="hub-card-kind">{app.kind}</span>
            </div>
            <div className="hub-card-body">
              <h2>{app.title}</h2>
              <p className="hub-card-subtitle">{app.subtitle}</p>
            </div>
            <span className="hub-card-cta" aria-hidden="true">-&gt;</span>
          </Link>
        ))}
      </section>

      <footer className="hub-footer">
        <code>Flask · React · Vite</code>
        <span>·</span>
        <span>本地数据 · 多工具工作台</span>
      </footer>
    </div>
  );
}
