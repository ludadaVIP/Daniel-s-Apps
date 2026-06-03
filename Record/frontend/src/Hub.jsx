import { BookOpen, BookMarked, ClipboardList, FileText, NotebookPen, TrendingUp } from "lucide-react";
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

export default function Hub() {
  return (
    <div className="hub-root">
      <header className="hub-header">
        <div className="hub-heading">
          <p className="hub-eyebrow">Road2elite</p>
          <h1 className="hub-title">Road2elite</h1>
          <p className="hub-subtitle">几个独立保留的本地工具，点击卡片进入。</p>
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
        <span>本地数据 · 多工具工作台</span>
      </footer>
    </div>
  );
}
