import { FileText, NotebookPen } from "lucide-react";
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
];

export default function Hub() {
  return (
    <div className="hub-root">
      <header className="hub-header">
        <div className="hub-heading">
          <p className="hub-eyebrow">Sons Apps</p>
          <h1 className="hub-title">Record & Meditation / Save MD</h1>
          <p className="hub-subtitle">两个独立保留的工具，点击卡片进入。</p>
        </div>
        <span className="hub-count">{APPS.length} apps</span>
      </header>

      <section className="hub-grid" aria-label="Sons app launcher">
        {APPS.map((app) => (
          <Link
            key={app.id}
            to={app.to}
            className="hub-card"
            style={{ "--card-accent": app.accent }}
            title={`${app.subtitle}\n${app.description}`}
          >
            <div className="hub-card-top">
              <div className="hub-card-icon">
                <app.Icon size={20} strokeWidth={1.9} />
              </div>
              <span className="hub-card-kind">{app.kind}</span>
            </div>
            <div className="hub-card-body">
              <h2>{app.title}</h2>
              <p className="hub-card-subtitle">{app.subtitle}</p>
              <p className="hub-card-description">{app.description}</p>
            </div>
            <span className="hub-card-cta" aria-hidden="true">-&gt;</span>
          </Link>
        ))}
      </section>

      <footer className="hub-footer">
        <code>Flask · React · Vite</code>
        <span>·</span>
        <span>仅保留 Record & Meditation 和 Save MD</span>
      </footer>
    </div>
  );
}
