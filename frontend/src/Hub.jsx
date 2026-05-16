import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Brain, Flag, GraduationCap, Headphones, Languages, MessageSquare, Music, ScrollText, Sparkles } from "lucide-react";

const HUB_ORDER_KEY = "daniels-apps:hub-order";

const APPS = [
  {
    id: "french",
    title: "French Sprint",
    subtitle: "法语：字母 → 现在时 → 复杂表达",
    description: "Pronunciation, core verbs, and step-by-step lessons with Edge TTS audio.",
    accent: "#7c3aed",
    Icon: BookOpen,
    to: "/french",
  },
  {
    id: "quiz",
    title: "English Adventure Quiz",
    subtitle: "英语综合练习：选择 / 排序 / 填空",
    description: "Ten themed quizzes covering grammar, vocabulary, and reading.",
    accent: "#f97316",
    Icon: Sparkles,
    to: "/quiz",
  },
  {
    id: "live-spanish",
    title: "Live Spanish",
    subtitle: "西/英/法/德：场景化短句练习 + 朗读",
    description: "Rich quiz authoring with per-question Edge TTS audio and progress tracking.",
    accent: "#0ea5e9",
    Icon: MessageSquare,
    to: "/live-spanish",
  },
  {
    id: "lab",
    title: "Language Output Lab",
    subtitle: "四语言 × 口语/写作 × 全 CEFR 级别",
    description: "Speaking and writing prompts across 4 languages with CEFR-tiered model answers.",
    accent: "#10b981",
    Icon: Brain,
    to: "/lab",
  },
  {
    id: "bible",
    title: "Recall Bible",
    subtitle: "圣经背诵：CUV / ESV / NVI 三语切换",
    description: "Random verse drills in two modes — recall the text from a reference, or guess the reference from the text.",
    accent: "#8a3a2e",
    Icon: ScrollText,
    to: "/bible",
  },
  {
    id: "translator",
    title: "Translator Trio",
    subtitle: "中文 → 英语 + 西语：翻译练习 + Edge TTS",
    description: "AI-generated sentence decks for Chinese → English + Spanish translation practice with read-aloud and prompt generator.",
    accent: "#5662f6",
    Icon: Languages,
    to: "/translator",
  },
  {
    id: "ai-practice",
    title: "AI Practice",
    subtitle: "AI 定制英语练习：选择 / 填空 + 记笔记",
    description: "Personalised English quizzes (A1–GRE) with skill map, per-question takeaways, and Edge TTS read-aloud. Import AI-generated JSON packs.",
    accent: "#2563eb",
    Icon: GraduationCap,
    to: "/ai-practice",
  },
  {
    id: "german",
    title: "German Sprint",
    subtitle: "Deutsch von 0 bis B2 — alphabet, grammar, real sentences",
    description: "A 0→B2 German roadmap: pronunciation, articles, cases, modal verbs, perfect tense, Konjunktiv. Every block has Edge TTS audio. Explanations in English + Spanish, no Chinese.",
    accent: "#854d0e",
    Icon: Flag,
    to: "/german",
  },
  {
    id: "spanish",
    title: "Español Sprint",
    subtitle: "Español de 0 a B2 — alfabeto, ser/estar, pretérito, subjuntivo",
    description: "A 0→B2 Spanish roadmap built for English + French speakers. Targets the real pain points: ser vs estar, por vs para, preterite vs imperfect, and the subjunctive. Edge TTS audio on every block.",
    accent: "#be185d",
    Icon: Music,
    to: "/spanish",
  },
  {
    id: "spanish-900",
    title: "Spanish 900",
    subtitle: "900 Spanish speaking sentences with English translations",
    description: "Nine progressive 100-sentence groups for survival, daily life, university, academic discussion, and study abroad. Edge TTS supports Spanish-only or bilingual playback.",
    accent: "#0f766e",
    Icon: Headphones,
    to: "/spanish-900",
  },
  {
    id: "english-900",
    title: "English 900",
    subtitle: "900 英语口语句子 · 英中对照 · 分组朗读",
    description: "Nine progressive 100-sentence groups for daily life, services, social conversation, university, academic discussion, and study abroad. Edge TTS supports English-only or bilingual playback.",
    accent: "#2563eb",
    Icon: Headphones,
    to: "/english-900",
  },
  {
    id: "french-900",
    title: "French 900",
    subtitle: "900 phrases de français parlé · français-espagnol",
    description: "Neuf groupes progressifs de cent phrases : survie, vie quotidienne, vie sociale, démarches, voyage, université, travail, débats, discussion académique. Edge TTS lit le français seul ou enchaîne le français puis la traduction espagnole.",
    accent: "#2b3b8a",
    Icon: Headphones,
    to: "/french-900",
  },
];

function normalizeAppOrder(order) {
  const appIds = new Set(APPS.map((app) => app.id));
  const saved = Array.isArray(order) ? order.filter((id) => appIds.has(id)) : [];
  const missing = APPS.map((app) => app.id).filter((id) => !saved.includes(id));
  return [...saved, ...missing];
}

function readSavedOrder() {
  try {
    return normalizeAppOrder(JSON.parse(localStorage.getItem(HUB_ORDER_KEY) || "[]"));
  } catch {
    return normalizeAppOrder([]);
  }
}

function saveOrder(order) {
  try {
    localStorage.setItem(HUB_ORDER_KEY, JSON.stringify(order));
  } catch {
    /* ignore */
  }
}

function moveApp(order, draggedId, targetId) {
  if (!draggedId || !targetId || draggedId === targetId) return order;
  const next = [...order];
  const from = next.indexOf(draggedId);
  const to = next.indexOf(targetId);
  if (from < 0 || to < 0) return order;
  next.splice(from, 1);
  next.splice(to, 0, draggedId);
  return next;
}

export default function Hub() {
  const [appOrder, setAppOrder] = useState(readSavedOrder);
  const [draggingId, setDraggingId] = useState("");
  const [targetId, setTargetId] = useState("");
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);

  const orderedApps = useMemo(() => {
    const appById = new Map(APPS.map((app) => [app.id, app]));
    return normalizeAppOrder(appOrder).map((id) => appById.get(id)).filter(Boolean);
  }, [appOrder]);

  const startDrag = (event, appId) => {
    if (event.button != null && event.button !== 0) return;
    dragRef.current = {
      appId,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      active: false,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const updateDrag = (event) => {
    const drag = dragRef.current;
    if (!drag) return;

    const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
    if (!drag.active && distance < 8) return;

    drag.active = true;
    suppressClickRef.current = true;
    setDraggingId(drag.appId);
    event.preventDefault();

    const card = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-hub-card-id]");
    const nextTargetId = card?.getAttribute("data-hub-card-id") || "";
    setTargetId(nextTargetId);

    if (nextTargetId && nextTargetId !== drag.appId) {
      setAppOrder((current) => {
        const normalized = normalizeAppOrder(current);
        const next = moveApp(normalized, drag.appId, nextTargetId);
        if (next === normalized || next.join("|") === normalized.join("|")) return current;
        saveOrder(next);
        return next;
      });
    }
  };

  const endDrag = (event) => {
    const drag = dragRef.current;
    if (drag) {
      event.currentTarget.releasePointerCapture?.(drag.pointerId);
    }
    dragRef.current = null;
    setDraggingId("");
    setTargetId("");
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  };

  const resetOrder = () => {
    const next = normalizeAppOrder([]);
    setAppOrder(next);
    saveOrder(next);
  };

  return (
    <div className="hub-root">
      <header className="hub-header">
        <p className="hub-eyebrow">Daniel's Apps</p>
        <h1 className="hub-title">十二合一语言 + 圣经练习中心</h1>
        <p className="hub-subtitle">
          挑一个开始练吧。按住卡片拖动，就能像手机图标一样调整顺序。
        </p>
        <button className="hub-reset-order" type="button" onClick={resetOrder}>
          恢复默认顺序
        </button>
      </header>
      <section className={`hub-grid ${draggingId ? "is-reordering" : ""}`}>
        {orderedApps.map((app) => (
          <Link
            key={app.id}
            to={app.to}
            className={`hub-card ${draggingId === app.id ? "is-dragging" : ""} ${targetId === app.id && draggingId !== app.id ? "is-drop-target" : ""}`}
            data-hub-card-id={app.id}
            style={{ "--card-accent": app.accent }}
            onClick={(event) => {
              if (!suppressClickRef.current) return;
              event.preventDefault();
              event.stopPropagation();
            }}
            onPointerCancel={endDrag}
            onPointerDown={(event) => startDrag(event, app.id)}
            onPointerMove={updateDrag}
            onPointerUp={endDrag}
          >
            <div className="hub-card-icon">
              <app.Icon size={26} strokeWidth={1.8} />
            </div>
            <div className="hub-card-body">
              <h2>{app.title}</h2>
              <p className="hub-card-subtitle">{app.subtitle}</p>
              <p className="hub-card-description">{app.description}</p>
            </div>
            <span className="hub-card-cta">打开 →</span>
          </Link>
        ))}
      </section>
      <footer className="hub-footer">
        <code>Flask 3.0.3 · React 19.2 · Vite 7</code>
        <span>·</span>
        <span>同时只跑一个 Flask 端口（8000）+ Vite 端口（5173），不再冲突</span>
      </footer>
    </div>
  );
}
