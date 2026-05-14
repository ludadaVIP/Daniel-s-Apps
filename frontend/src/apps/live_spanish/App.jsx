import {
  Bold,
  BarChart3,
  Check,
  ChevronRight,
  Copy,
  FilePlus2,
  Languages,
  Lightbulb,
  Pencil,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  RotateCcw,
  Save,
  Trash2,
  Volume2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

import "./styles.css";

// All Live-Spanish endpoints live under /api/live-spanish/* in the unified
// backend. The original app served them directly under /api/quizzes/*.
const API_BASE = "/api/live-spanish";

const progressKey = (quizId) => `spanish-activation-progress:${quizId}`;

const LANGUAGE_OPTIONS = [
  { code: "en", label: "English", promptName: "English" },
  { code: "es", label: "Spanish", promptName: "Spanish" },
  { code: "fr", label: "French", promptName: "French" },
  { code: "de", label: "German", promptName: "German" },
];

const LEVEL_OPTIONS = ["A1", "A2", "A2-B1", "B1", "B1-B2", "B2", "C1", "C2"];

const QUIZ_KIND_OPTIONS = [
  { id: "fill", label: "Fill" },
  { id: "choice", label: "Choice" },
];

const languageByCode = (code) =>
  LANGUAGE_OPTIONS.find((language) => language.code === code) || LANGUAGE_OPTIONS[1];

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
  return data;
}

function readLocalProgress(quizId) {
  try {
    return JSON.parse(localStorage.getItem(progressKey(quizId)) || "{}");
  } catch {
    return {};
  }
}

function writeLocalProgress(quizId, progress) {
  localStorage.setItem(progressKey(quizId), JSON.stringify(progress));
}

function blankValues(count, existing = []) {
  return Array.from({ length: count }, (_, index) => existing[index] || "");
}

function statusFor(progress, questionId) {
  const state = progress[questionId];
  if (!state) return "unanswered";
  return state.status || "done";
}

function getQuestionKind(question) {
  const kind = String(
    question?.kind || question?.questionKind || question?.questionType || question?.question_type || question?.type || ""
  ).toLowerCase();
  if (["choice", "multiple-choice", "multiple_choice", "multiple choice", "mcq", "select"].includes(kind)) return "choice";
  if (question?.choices?.length) return "choice";
  return "fill";
}

function getQuizKind(quiz) {
  const kind = String(quiz?.kind || quiz?.quizType || "").toLowerCase();
  if (["choice", "multiple-choice", "multiple_choice", "mcq"].includes(kind)) return "choice";
  return "fill";
}

function quizKindLabel(kind) {
  return kind === "choice" ? "Choice" : "Fill";
}

function normaliseChoices(question) {
  return (question?.choices || []).map((choice, index) => {
    if (typeof choice === "string") {
      return { id: String.fromCharCode(65 + index), text: choice };
    }
    return {
      id: String(choice.id || choice.value || String.fromCharCode(65 + index)),
      text: String(choice.text || choice.label || choice.value || choice.id || ""),
    };
  });
}

function escapeHtml(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function takeawayBodyToHtml(body = "") {
  if (/<\/?[a-z][\s\S]*>/i.test(body)) return body;

  const lines = body.split(/\n{2,}/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return "<p></p>";

  return lines
    .map((line) => `<p>${escapeHtml(line).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function highlightQuotedTakeaway(body = "") {
  return takeawayBodyToHtml(body)
    .split(/(<[^>]+>)/g)
    .map((part) => {
      if (part.startsWith("<")) return part;
      return part.replace(
        /(&quot;[\s\S]*?&quot;|&#34;[\s\S]*?&#34;|&#x22;[\s\S]*?&#x22;|"[^"]+"|“[^”]+”|«[^»]+»)/g,
        '<strong class="quotedTakeaway">$1</strong>'
      );
    })
    .join("");
}

function buildQuizGenerationPrompt({ languageCode, level, quizKind, topic }) {
  const language = languageByCode(languageCode);
  const topicLine = topic.trim()
    ? `Topic preference: ${topic.trim()}`
    : "Topic preference: no special topic; use varied realistic everyday, study, work, travel, and social contexts.";
  const levelGuidance = {
    A1: "A1: very short practical sentences, survival phrases, present tense, basic questions, numbers, time, family, food, routines, and high-frequency verbs. Avoid complex grammar.",
    A2: "A2: everyday situations, past/future basics, common connectors, requests, opinions, travel, shopping, appointments, habits, and useful collocations.",
    "A2-B1": "A2-B1: bridge from controlled everyday language into independent communication. Use A2 grammar and vocabulary with slightly more B1-style contexts, short explanations, opinions, plans, problems, and polite requests.",
    B1: "B1: realistic communication across work, study, travel, plans, opinions, complaints, explanations, polite requests, short stories, and natural spoken chunks.",
    "B1-B2": "B1-B2: bridge from independent communication into more nuanced expression. Use B1 clarity with B2-style collocations, connectors, register control, reformulation, and practical workplace/university situations.",
    B2: "B2: nuanced collocations, register shifts, concise reformulations, connectors, workplace/university situations, idioms that are common, and natural expression production.",
    C1: "C1: advanced, precise language with register control, idiomatic but useful phrasing, academic/professional nuance, complex connectors, diplomacy, argumentation, and subtle meaning contrasts. Keep it natural, not obscure.",
    C2: "C2: near-native precision with subtle collocations, high-level register shifts, concise reformulation, rhetorical nuance, idiomatic expression, discourse control, and rare-but-useful distinctions. Avoid trivia and archaic language."
  };
  const kindLabel = quizKind === "choice" ? "multiple-choice" : "fill-in-the-blank activation";
  const quizId = `${language.code}-${level.toLowerCase()}-${quizKind}-50`;
  const title = `${language.label} ${level} ${quizKind === "choice" ? "Choice" : "Activation"} Quiz`;

  const sharedRules = `Create one complete ${language.promptName} ${kindLabel} quiz as JSON only.

Target language: ${language.promptName}
Target level: ${level}
${levelGuidance[level]}
${topicLine}

This JSON will be pasted into a Flask + React learning app. Follow the schema exactly.

Quiz requirements:
- Exactly 50 questions.
- Return the direct quiz JSON object. Do not wrap it in "quizData", "data", "result", prose, or markdown.
- The learner is practicing ${language.promptName}; all target sentences, prompts, choices, and answers must be in ${language.promptName}.
- Situations and explanations can be in English, but examples inside them should remain in ${language.promptName}.
- Use ids 1 through 50.
- Keep explanations concise but useful.
- "takeaway.body" should be short. Put the reusable chunk, word, or rule in quotation marks so the app can highlight it.
- Do not include audio_path, audio_text, audio_hash, audio_voice, or any file paths.
- Do not add extra top-level keys outside the schema. The importer accepts the top-level object shown below.
- All strings must be JSON strings with properly escaped quotation marks. Do not use trailing commas.
- Before responding, mentally validate that the output can be parsed by JSON.parse and pasted directly into the app's "Import quiz JSON" box.
- If you use quotation marks inside an HTML string, escape them as \\\".
- Output valid JSON only. No markdown fence, no comments, no surrounding explanation.

Use this exact top-level shape:
{
  "id": "${quizId}",
  "kind": "${quizKind}",
  "language": "${language.code}",
  "languageName": "${language.label}",
  "title": "${title}",
  "subtitle": "50 ${level} ${language.label} ${quizKind === "choice" ? "choice" : "activation"} questions",
  "level": "${level}",
  "description": "${language.label} ${level} practice generated from a custom prompt.",
  "questions": []
}`;

  if (quizKind === "choice") {
    return `${sharedRules}

Generate ONLY "choice" questions.

Choice question rules:
- Each question has exactly 4 choices.
- Make distractors plausible. Avoid silly or obviously impossible choices.
- "correctChoiceId" must match one choice id.
- Do not include valid, best, or hints.
- Each question must include "feedback" with "natural", "alternatives", and "chunk" strings.
- Each question must include "takeaway" with "title" and "body" strings.
- Focus on grammar, vocabulary, collocations, connectors, register, natural phrasing, and meaning differences appropriate for ${level}.

Question object schema:
{
  "id": 1,
  "kind": "choice",
  "icon": "🧭",
  "category": "Connectors",
  "typeBadge": "multiple-choice",
  "situation": "A short English context explaining when the learner would use this.",
  "prompt": "A ${language.label} sentence with ___ for the missing expression.",
  "choices": [
    { "id": "A", "text": "Option A in ${language.label}" },
    { "id": "B", "text": "Option B in ${language.label}" },
    { "id": "C", "text": "Option C in ${language.label}" },
    { "id": "D", "text": "Option D in ${language.label}" }
  ],
  "correctChoiceId": "A",
  "feedback": {
    "natural": "<strong>\\\"Correct option\\\"</strong> is natural because...",
    "alternatives": "Explain briefly why the other options do not fit.",
    "chunk": "<em>\\\"Reusable ${language.label} chunk\\\"</em> can be reused in similar contexts."
  },
  "takeaway": {
    "title": "Short takeaway title",
    "body": "\\"Reusable ${language.label} chunk\\" is the pattern to remember."
  }
}`;
  }

  return `${sharedRules}

Generate ONLY "fill" questions. The goal is active recall, not passive recognition.

Fill question rules:
- Use sentence blanks as {0}, {1}, etc.
- "valid" must have one array per blank.
- "best" must contain the canonical display answer for each blank.
- "hints" must have one array per blank, exactly 4 strings per blank. Include the best answer plus 3 plausible distractors.
- Make blanks meaningful: useful chunks, collocations, connectors, verb patterns, register choices, or common grammar forms.
- Top-level "kind" must be "fill"; every question "kind" must be "fill".
- Each question must include "feedback" with "natural", "alternatives", and "chunk" strings.
- Each question must include "takeaway" with "title" and "body" strings.

Question object schema:
{
  "id": 1,
  "kind": "fill",
  "icon": "✉️",
  "category": "Everyday Communication",
  "typeBadge": "fill-in-blank",
  "situation": "A short English context explaining when the learner would use this.",
  "sentence": "A ${language.label} sentence with {0} as the blank.",
  "valid": [["accepted answer 1", "accepted answer 2"]],
  "best": ["canonical answer"],
  "hints": [["canonical answer", "plausible distractor", "plausible distractor", "plausible distractor"]],
  "feedback": {
    "natural": "<strong>\\\"Canonical answer\\\"</strong> is natural because...",
    "alternatives": "Explain briefly why the distractors are weaker or wrong.",
    "chunk": "<em>\\\"Reusable ${language.label} chunk\\\"</em> can be reused in similar contexts."
  },
  "takeaway": {
    "title": "Short takeaway title",
    "body": "\\"Reusable ${language.label} chunk\\" is the pattern to remember."
  }
}`;
}

function fallbackCopyText(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-1000px";
  textarea.style.left = "-1000px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!copied) {
    throw new Error("Copy failed. Please allow clipboard access and try again.");
  }
}

async function copyText(text) {
  try {
    fallbackCopyText(text);
  } catch (fallbackErr) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      throw fallbackErr;
    }
  }
}

function questionPromptForReport(question) {
  if (getQuestionKind(question) === "choice") {
    return question.prompt || question.question || question.sentence || "";
  }
  return question.sentence || "";
}

function userAnswerForReport(question, entry) {
  if (getQuestionKind(question) === "choice") {
    return entry?.choiceText || entry?.choiceId || "(no answer)";
  }
  return (entry?.answers || []).filter(Boolean).join(" / ") || "(no answer)";
}

function buildStudyReport({ quiz, progress, stats }) {
  if (!quiz) return "";
  const entries = quiz.questions
    .map((question) => ({ question, entry: progress[question.id] }))
    .filter(({ entry }) => entry?.grade);
  const wrongEntries = entries.filter(({ entry }) => entry.status === "wrong");
  const categoryCounts = wrongEntries.reduce((counts, { question }) => {
    const category = question.category || "Uncategorized";
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {});
  const weakCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => `${category} (${count})`)
    .join(", ") || "No clear weak category yet.";
  const mistakes = wrongEntries
    .slice(0, 25)
    .map(({ question, entry }, index) => {
      const best = entry.grade?.best?.join(" / ") || "(not available)";
      const chunk = entry.grade?.feedback?.chunk?.replace(/<[^>]+>/g, "") || "";
      return `${index + 1}. Q${question.id} · ${question.category || "Practice"}
Prompt: ${questionPromptForReport(question)}
My answer: ${userAnswerForReport(question, entry)}
Best answer: ${best}
Takeaway: ${question.takeaway?.body?.replace(/<[^>]+>/g, "") || chunk}`;
    })
    .join("\n\n");
  const mistakeBlock = mistakes || "No mistakes in the recorded current attempt.";

  return `Please analyze my language-learning quiz results and give me a short, practical study plan.

Quiz: ${quiz.title}
Language: ${quiz.languageName || languageByCode(quiz.language).label}
Level: ${quiz.level}
Score: ${stats.correct}/${stats.answered} correct, ${stats.wrong} wrong, ${stats.total - stats.answered} unanswered.
Weak categories: ${weakCategories}

Mistakes:
${mistakeBlock}

Please keep the analysis concise. Focus on my weak patterns, likely blind spots, and 5 concrete next practice directions.`;
}

function importFailureText(message) {
  const text = message || "Import failed.";
  if (/parse json|json/i.test(text)) {
    return `${text} Try copying only the question data, not Gemini's explanation. The importer now accepts normal JSON, Python-style True/False, and loose list fragments, but every question still needs usable text and choices.`;
  }
  if (/questions array/i.test(text)) {
    return `${text} The top-level object can contain "questions": [...], or you can paste a raw list of question objects. If the model wrapped it in "quizData", paste the whole object or the inner quiz object.`;
  }
  if (/correct answer|correctChoiceId|correctIndex/i.test(text)) {
    return `${text} For choice questions, each item needs choices/options/answerOptions and one answer marker: "correctChoiceId", "correctAnswer", "correctIndex", or exactly one option with "isCorrect": true.`;
  }
  if (/valid answer|per blank|no blank|fill question/i.test(text)) {
    return `${text} For fill questions, use blanks like {0}; then provide "valid": [["answer"]] and "best": ["answer"].`;
  }
  if (/unsupported level/i.test(text)) {
    return `${text} Use A1, A2, A2-B1, B1, B1-B2, B2, C1, or C2.`;
  }
  return text;
}

export default function LiveSpanishApp() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [progress, setProgress] = useState({});
  const [values, setValues] = useState([]);
  const [selectedChoiceId, setSelectedChoiceId] = useState("");
  const [grade, setGrade] = useState(null);
  const [showHints, setShowHints] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [audioLoadingKey, setAudioLoadingKey] = useState("");
  const [audioError, setAudioError] = useState("");
  const [error, setError] = useState("");
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const audioRef = useRef(null);

  const currentQuestion = quiz?.questions?.[questionIndex] || null;

  useEffect(() => {
    let mounted = true;

    api(`${API_BASE}/quizzes`)
      .then((data) => {
        if (!mounted) return;
        setQuizzes(data.quizzes || []);
        const first = data.quizzes?.[0]?.id || "";
        setSelectedQuizId(first);
      })
      .catch((err) => setError(err.message))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedQuizId) return;

    setLoading(true);
    setError("");

    Promise.all([
      api(`${API_BASE}/quizzes/${selectedQuizId}`),
      api(`${API_BASE}/quizzes/${selectedQuizId}/progress`).catch(() => ({ current: {} })),
    ])
      .then(([data, savedProgress]) => {
        const serverProgress = savedProgress.current || {};
        const localProgress = readLocalProgress(data.id);
        const nextProgress = Object.keys(serverProgress).length ? serverProgress : localProgress;
        setQuiz(data);
        setQuestionIndex(0);
        setProgress(nextProgress);
      })
      .catch((err) => {
        setQuiz(null);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [selectedQuizId]);

  useEffect(() => {
    if (!currentQuestion) {
      setValues([]);
      setSelectedChoiceId("");
      setGrade(null);
      return;
    }

    const saved = progress[currentQuestion.id];
    setValues(blankValues(currentQuestion.blankCount, saved?.answers));
    setSelectedChoiceId(saved?.choiceId || "");
    setGrade(saved?.grade || null);
    setShowHints(false);
    setAudioError("");
    setError("");
  }, [currentQuestion?.id, currentQuestion?.blankCount, progress]);

  const stats = useMemo(() => {
    if (!quiz) return { answered: 0, correct: 0, wrong: 0, total: 0 };
    const states = quiz.questions.map((question) => statusFor(progress, question.id));
    return {
      answered: states.filter((status) => status !== "unanswered").length,
      correct: states.filter((status) => status === "correct").length,
      wrong: states.filter((status) => status === "wrong").length,
      total: quiz.questions.length,
    };
  }, [progress, quiz]);

  const submitted = Boolean(grade);

  function changeValue(index, value) {
    setValues((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)));
  }

  async function submitAnswer(choiceIdOverride = "") {
    if (!quiz || !currentQuestion || submitting) return;
    const isChoice = getQuestionKind(currentQuestion) === "choice";
    const choiceId = choiceIdOverride || selectedChoiceId;

    if (!isChoice && !values.some((value) => value.trim())) {
      setError("先填一个答案，再检查。");
      return;
    }

    if (isChoice && !choiceId) {
      setError("先选择一个答案，再检查。");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const result = await api(`${API_BASE}/quizzes/${quiz.id}/grade`, {
        method: "POST",
        body: JSON.stringify(
          isChoice
            ? { questionId: currentQuestion.id, choiceId, record: true }
            : { questionId: currentQuestion.id, answers: values, record: true }
        ),
      });

      const nextProgress = {
        ...progress,
        [currentQuestion.id]: {
          ...(isChoice ? { choiceId } : { answers: values }),
          grade: result,
          status: result.correct ? "correct" : "wrong",
          updatedAt: new Date().toISOString(),
        },
      };

      setGrade(result);
      setProgress(nextProgress);
      writeLocalProgress(quiz.id, nextProgress);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function submitChoice(choiceId) {
    if (submitted || submitting) return;
    setSelectedChoiceId(choiceId);
    submitAnswer(choiceId);
  }

  function goNext() {
    if (!quiz) return;
    setQuestionIndex((index) => Math.min(index + 1, quiz.questions.length - 1));
  }

  async function resetQuizProgress() {
    if (!quiz) return;
    const ok = window.confirm(
      `Reset current progress for "${quiz.title}"?\n\nThis clears the visible answers for this run. Saved attempt history stays in data/progress.`
    );
    if (!ok) return;
    try {
      await api(`${API_BASE}/quizzes/${quiz.id}/progress/current`, { method: "DELETE" });
      localStorage.removeItem(progressKey(quiz.id));
      setProgress({});
    } catch (err) {
      setError(err.message);
    }
  }

  function updateQuestionTakeaway(takeaway) {
    if (!quiz || !currentQuestion) return;
    setQuiz({
      ...quiz,
      questions: quiz.questions.map((question) =>
        question.id === currentQuestion.id ? { ...question, takeaway } : question
      ),
    });
  }

  function updateQuestion(questionId, patch) {
    if (!quiz) return;
    setQuiz({
      ...quiz,
      questions: quiz.questions.map((question) =>
        question.id === questionId ? { ...question, ...patch } : question
      ),
    });
  }

  async function playQuestionAudio(gender) {
    if (!quiz || !currentQuestion || !submitted || audioLoadingKey) return;

    setAudioError("");
    const loadingKey = `${currentQuestion.id}-${gender}`;
    setAudioLoadingKey(loadingKey);

    try {
      const cachedAudio = currentQuestion.audio_cache?.[gender];
      let audioPath = cachedAudio?.audio_path;
      let audioUrl = cachedAudio?.audio_url || cachedAudio?.audio_path;

      if (!audioPath) {
        const data = await api(`${API_BASE}/quizzes/${quiz.id}/questions/${currentQuestion.id}/audio`, {
          method: "POST",
          body: JSON.stringify({ gender }),
        });
        audioPath = data.audio_path;
        audioUrl = data.audio_url || data.audio_path;
        updateQuestion(currentQuestion.id, {
          audio_cache: {
            ...(currentQuestion.audio_cache || {}),
            [gender]: {
              audio_path: data.audio_path,
              audio_url: data.audio_url || data.audio_path,
              audio_text: data.audio_text,
              audio_voice: data.voice,
              audio_language: data.language,
              cached: data.cached,
            },
          },
        });
      }

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const player = new Audio(audioUrl);
      audioRef.current = player;
      await player.play();
    } catch (err) {
      setAudioError(err.message);
    } finally {
      setAudioLoadingKey("");
    }
  }

  async function deleteCurrentQuestion() {
    if (!quiz || !currentQuestion) return;
    const ok = window.confirm(`Delete this question and its cached audio?\n\n${currentQuestion.situation}`);
    if (!ok) return;

    try {
      const deletedQuestionId = currentQuestion.id;
      const data = await api(`${API_BASE}/quizzes/${quiz.id}/questions/${deletedQuestionId}`, {
        method: "DELETE",
      });
      const nextProgress = { ...progress };
      delete nextProgress[deletedQuestionId];
      writeLocalProgress(quiz.id, nextProgress);
      setProgress(nextProgress);
      setQuiz(data);
      setQuizzes((current) =>
        current.map((item) =>
          item.id === quiz.id ? { ...item, questionCount: data.questionCount } : item
        )
      );
      setQuestionIndex((index) => Math.min(index, Math.max(data.questions.length - 1, 0)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteSelectedQuiz() {
    if (!quiz) return;
    const ok = window.confirm(`Delete "${quiz.title}" and all of its questions/audio?`);
    if (!ok) return;

    try {
      const data = await api(`${API_BASE}/quizzes/${quiz.id}`, { method: "DELETE" });
      localStorage.removeItem(progressKey(quiz.id));
      setQuizzes(data.quizzes || []);
      const nextQuizId = data.quizzes?.[0]?.id || "";
      setSelectedQuizId(nextQuizId);
      if (!nextQuizId) {
        setQuiz(null);
        setQuestionIndex(0);
        setProgress({});
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function renameQuiz(quizToRename) {
    const nextTitle = window.prompt("Rename quiz", quizToRename.title);
    if (nextTitle === null) return;
    const title = nextTitle.trim();
    if (!title || title === quizToRename.title) return;

    try {
      const data = await api(`${API_BASE}/quizzes/${quizToRename.id}/rename`, {
        method: "POST",
        body: JSON.stringify({ title }),
      });
      const oldId = data.oldId || quizToRename.id;
      const renamedQuiz = data.quiz;
      const newId = renamedQuiz?.id || oldId;

      if (newId !== oldId) {
        const savedProgress = readLocalProgress(oldId);
        if (Object.keys(savedProgress).length) {
          writeLocalProgress(newId, savedProgress);
        }
        localStorage.removeItem(progressKey(oldId));
      }

      setQuizzes(data.quizzes || []);
      if (selectedQuizId === oldId) {
        setSelectedQuizId(newId);
        setQuiz(renamedQuiz || null);
      } else if (quiz?.id === oldId && renamedQuiz) {
        setQuiz(renamedQuiz);
      }
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  function handleQuizImported(data) {
    setQuizzes(data.quizzes || []);
    if (data.quiz?.id) {
      setSelectedQuizId(data.quiz.id);
    }
  }

  return (
    <div className={`ls-shell appShell ${leftCollapsed ? "leftCollapsed" : ""} ${rightCollapsed ? "rightCollapsed" : ""}`}>
      <Sidebar
        quizzes={quizzes}
        selectedQuizId={selectedQuizId}
        onSelect={setSelectedQuizId}
        onRename={renameQuiz}
        collapsed={leftCollapsed}
        onToggle={() => setLeftCollapsed((collapsed) => !collapsed)}
      />

      <main className="mainColumn">
        {error && <div className="appError">{error}</div>}

        {loading && <div className="loadingPanel">Loading quiz...</div>}

        {!loading && quiz && (
            <QuizHeader
              quiz={quiz}
              questionIndex={questionIndex}
              onSelectQuestion={setQuestionIndex}
              onReset={resetQuizProgress}
              onDeleteQuiz={deleteSelectedQuiz}
            />
        )}

        {!loading && quiz && quiz.questions.length === 0 && (
          <EmptyQuiz quiz={quiz} />
        )}

        {!loading && quiz && currentQuestion && (
          <>

            <section className="questionPanel" aria-label="Question">
              <div className="questionPanelTools">
                <button
                  className="iconButton dangerIconButton"
                  type="button"
                  onClick={deleteCurrentQuestion}
                  title="Delete question"
                  aria-label="Delete question"
                >
                  <Trash2 size={17} />
                </button>
              </div>
              <div className="situationBlock">
                <div className="eyebrow">Situation</div>
                <p>{currentQuestion.situation}</p>
              </div>

              <div className="answerBlock">
                {getQuestionKind(currentQuestion) === "choice" ? (
                  <ChoiceQuestion
                    question={currentQuestion}
                    selectedChoiceId={selectedChoiceId}
                    onSelect={submitChoice}
                    submitted={submitted}
                    grade={grade}
                  />
                ) : (
                  <>
                    <div className="eyebrow">Complete</div>
                    <SentenceInput
                      question={currentQuestion}
                      values={values}
                      onChange={changeValue}
                      submitted={submitted}
                      blankResults={grade?.blankResults || []}
                      onEnter={submitAnswer}
                    />
                  </>
                )}
              </div>

              {getQuestionKind(currentQuestion) === "fill" && (
                <div className="assistRow">
                  <HintPanel
                    question={currentQuestion}
                    values={values}
                    onPick={changeValue}
                    visible={showHints}
                    onToggle={() => setShowHints((showing) => !showing)}
                    disabled={submitted}
                  />
                </div>
              )}

              <div className="actionRow">
                {getQuestionKind(currentQuestion) === "fill" && (
                  <button
                    className="primaryButton"
                    type="button"
                    disabled={submitting || submitted}
                    onClick={() => submitAnswer()}
                  >
                    {submitting ? "Checking..." : submitted ? "Checked" : "Check answer"}
                  </button>
                )}
                {getQuestionKind(currentQuestion) === "choice" && (
                  <div className="choiceAutoStatus">
                    {submitting ? "Checking..." : submitted ? "Checked" : "Pick an option"}
                  </div>
                )}
                <AudioButton
                  gender="female"
                  disabled={!submitted}
                  loading={audioLoadingKey === `${currentQuestion.id}-female`}
                  cached={Boolean(currentQuestion.audio_cache?.female)}
                  onClick={() => playQuestionAudio("female")}
                />
                <AudioButton
                  gender="male"
                  disabled={!submitted}
                  loading={audioLoadingKey === `${currentQuestion.id}-male`}
                  cached={Boolean(currentQuestion.audio_cache?.male)}
                  onClick={() => playQuestionAudio("male")}
                />
                <button
                  className="ghostButton"
                  type="button"
                  disabled={questionIndex >= quiz.questions.length - 1}
                  onClick={goNext}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
              {audioError && <p className="audioError">{audioError}</p>}
            </section>

            <Feedback grade={grade} />
          </>
        )}
      </main>

      <RightRail
        quiz={quiz}
        question={currentQuestion}
        questionIndex={questionIndex}
        progress={progress}
        stats={stats}
        collapsed={rightCollapsed}
        onToggle={() => setRightCollapsed((collapsed) => !collapsed)}
        onSelectQuestion={setQuestionIndex}
        onTakeawaySaved={updateQuestionTakeaway}
        onQuizImported={handleQuizImported}
      />
    </div>
  );
}

function Sidebar({ quizzes, selectedQuizId, onSelect, onRename, collapsed, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="brandBlock">
        <div className="brandMark">LA</div>
        {!collapsed && <div>
          <h1>Language Activo</h1>
          <p>Multilingual activation</p>
        </div>}
        <button
          className="iconButton collapseButton"
          type="button"
          onClick={onToggle}
          title={collapsed ? "Expand left column" : "Collapse left column"}
          aria-label={collapsed ? "Expand left column" : "Collapse left column"}
        >
          {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
        </button>
      </div>

      <nav className="quizList" aria-label="Quizzes">
        {quizzes.map((quiz, index) => (
          <div
            key={quiz.id}
            className={`quizTabRow ${quiz.id === selectedQuizId ? "active" : ""}`}
          >
            <button
              type="button"
              className={`quizTab kind-${getQuizKind(quiz)} ${quiz.id === selectedQuizId ? "active" : ""}`}
              onClick={() => onSelect(quiz.id)}
              title={quiz.title}
            >
              <span className="quizTabMain">{collapsed ? index + 1 : quiz.title}</span>
              {!collapsed && (
                <span className="quizTabSub">
                  {quiz.languageName || languageByCode(quiz.language).label} · {quizKindLabel(getQuizKind(quiz))} · {quiz.questionCount} questions · {quiz.status}
                </span>
              )}
            </button>
            {!collapsed && (
              <button
                className="quizRenameButton"
                type="button"
                onClick={() => onRename(quiz)}
                title={`Rename ${quiz.title}`}
                aria-label={`Rename ${quiz.title}`}
              >
                <Pencil size={14} />
              </button>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

function QuizHeader({ quiz, questionIndex, onSelectQuestion, onReset, onDeleteQuiz }) {
  return (
    <header className="quizHeader">
      <div className="quizHeaderLine">
        <span className="levelBadge">{quiz.languageName || languageByCode(quiz.language).label} · {quiz.level}</span>
        <h2>{quiz.title}</h2>
      </div>

      <div className="headerActions">
        <button className="iconButton" type="button" onClick={onReset} title="Reset progress" aria-label="Reset progress">
          <RotateCcw size={17} />
        </button>
        <button
          className="iconButton dangerIconButton"
          type="button"
          onClick={onDeleteQuiz}
          title="Delete quiz"
          aria-label="Delete quiz"
        >
          <Trash2 size={17} />
        </button>
      </div>

      <QuestionSlider
        total={quiz.questions?.length || quiz.questionCount || 0}
        value={questionIndex + 1}
        onChange={(questionNumber) => onSelectQuestion(questionNumber - 1)}
      />
    </header>
  );
}

function QuestionSlider({ total, value, onChange }) {
  if (!total) return null;
  const safeValue = Math.min(Math.max(value, 1), total);
  const progressPct = total > 1 ? ((safeValue - 1) / (total - 1)) * 100 : 0;
  const handleChange = (event) => onChange(Number(event.target.value));

  return (
    <div
      className="questionSlider"
      style={{ "--slider-progress": `${progressPct}%` }}
      aria-label={`Question ${safeValue} of ${total}`}
    >
      <div className="questionSliderBubble" aria-hidden="true">
        {safeValue}
      </div>
      <input
        type="range"
        min="1"
        max={total}
        step="1"
        value={safeValue}
        onInput={handleChange}
        onChange={handleChange}
        aria-label="Jump to question"
      />
    </div>
  );
}

function EmptyQuiz({ quiz }) {
  return (
    <section className="emptyPanel">
      <div className="eyebrow">{quiz.level}</div>
      <h2>{quiz.title}</h2>
      <p>{quiz.description}</p>
    </section>
  );
}

function QuestionTypeBadge({ question }) {
  const kind = getQuestionKind(question);
  return (
    <div className={`questionTypeBadge kind-${kind}`} aria-label={`${question.category}, ${question.typeBadge}`}>
      <span aria-hidden="true">
        {question.icon}
      </span>
      <strong>{question.category}</strong>
      <em>{question.typeBadge}</em>
    </div>
  );
}

function SentenceInput({ question, values, onChange, submitted, blankResults, onEnter }) {
  const refs = useRef([]);
  const parts = question.sentence.split(/\{(\d+)\}/g);

  return (
    <div className="sentenceLine">
      {parts.map((part, index) => {
        if (index % 2 === 0) {
          return <span key={`${index}-${part}`}>{part}</span>;
        }

        const blankIndex = Number(part);
        const stateClass = submitted
          ? blankResults[blankIndex]
            ? "correct"
            : "wrong"
          : "";

        return (
          <span className="blankWrap" key={`blank-${blankIndex}`}>
            {question.blankCount > 1 && <span className="blankNumber">{blankIndex + 1}</span>}
            <input
              ref={(element) => {
                refs.current[blankIndex] = element;
              }}
              className={`blankInput ${stateClass}`}
              value={values[blankIndex] || ""}
              disabled={submitted}
              onChange={(event) => onChange(blankIndex, event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") onEnter();
              }}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              aria-label={`Blank ${blankIndex + 1}`}
            />
          </span>
        );
      })}
    </div>
  );
}

function ChoiceQuestion({ question, selectedChoiceId, onSelect, submitted, grade }) {
  const choices = normaliseChoices(question);
  const compactChoices = choices.every((choice) => choice.text.length <= 34);
  const rationaleByChoice = Object.fromEntries(
    (grade?.choiceRationales || []).map((item) => [item.id, item.rationale])
  );

  return (
    <div className="choiceQuestion">
      <div className="eyebrow">Choose the best answer</div>
      <div className="choicePrompt">{question.prompt || question.question || question.sentence}</div>
      <div className={`choiceOptions ${compactChoices ? "compact" : "stacked"}`}>
        {choices.map((choice) => {
          const selected = selectedChoiceId === choice.id;
          const isCorrect = submitted && grade?.correctChoiceId === choice.id;
          const isWrongSelection = submitted && selected && !grade?.correct;
          const rationale = submitted ? rationaleByChoice[choice.id] : "";
          return (
            <div className="choiceOptionWrap" key={choice.id}>
              <button
                type="button"
                className={`choiceOption ${selected ? "selected" : ""} ${isCorrect ? "correct" : ""} ${isWrongSelection ? "wrong" : ""}`}
                disabled={submitted}
                onClick={() => onSelect(choice.id)}
              >
                <span>{choice.id}</span>
                <strong>{choice.text}</strong>
              </button>
              {rationale && (
                <p className={`choiceRationale ${isCorrect ? "correct" : ""} ${isWrongSelection ? "wrong" : ""}`}>
                  {rationale}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HintPanel({ question, values, onPick, visible, onToggle, disabled }) {
  const hasHints = question.hints?.some((group) => group.length);
  if (!hasHints) return null;

  return (
    <div className="hintPanel">
      <button className="hintButton" type="button" onClick={onToggle} disabled={disabled}>
        <Lightbulb size={16} />
        {visible ? "Hide hint" : "Hint"}
      </button>

      {visible && (
        <div className="hintChoices">
          {question.hints.map((group, groupIndex) => (
            <div className="hintGroup" key={`hint-${groupIndex}`}>
              {question.hints.length > 1 && <span className="hintLabel">Blank {groupIndex + 1}</span>}
              <div className="choiceRow">
                {group.map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    className={`choiceChip ${values[groupIndex] === choice ? "selected" : ""}`}
                    onClick={() => onPick(groupIndex, choice)}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AudioButton({ gender, disabled, loading, cached, onClick }) {
  const label = gender === "male" ? "Male" : "Female";
  return (
    <button
      className={`audioButton ${cached ? "cached" : ""} ${gender}`}
      type="button"
      disabled={disabled || loading}
      onClick={onClick}
      title={disabled ? "Check the answer first" : cached ? `Play cached ${label.toLowerCase()} audio` : `Generate and play ${label.toLowerCase()} audio`}
      aria-label={`Listen with ${label} voice`}
    >
      <Volume2 size={16} />
      {loading ? "Generating..." : label}
    </button>
  );
}

function Feedback({ grade }) {
  if (!grade) return null;

  return (
    <section className="feedbackPanel" aria-label="Feedback">
      <div className={`resultBanner ${grade.correct ? "isCorrect" : "isWrong"}`}>
        <span>{grade.correct ? <Check size={18} /> : <X size={18} />}</span>
        <p>
          {grade.correct ? "Correct." : "Not quite."} Best answer:{" "}
          <strong>{grade.best.join(" / ")}</strong>
        </p>
      </div>

      <FeedbackBlock title="Why it sounds natural" html={grade.feedback.natural} />
      <FeedbackBlock title="Why alternatives fall short" html={grade.feedback.alternatives} />
      <FeedbackBlock title="Reusable expression / chunk" html={grade.feedback.chunk} highlight />
    </section>
  );
}

function FeedbackBlock({ title, html, highlight = false }) {
  return (
    <div className={`feedbackBlock ${highlight ? "highlight" : ""}`}>
      <div className="eyebrow">{title}</div>
      <p dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

function RightRail({
  quiz,
  question,
  questionIndex,
  progress,
  stats,
  collapsed,
  onToggle,
  onSelectQuestion,
  onTakeawaySaved,
  onQuizImported,
}) {
  if (collapsed) {
    return (
      <aside className="rightRail collapsed">
        <button
          className="iconButton railExpandButton"
          type="button"
          onClick={onToggle}
          title="Expand right column"
          aria-label="Expand right column"
        >
          <PanelRightOpen size={17} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="rightRail">
      <div className="rightRailTop">
        <button
          className="iconButton"
          type="button"
          onClick={onToggle}
          title="Collapse right column"
          aria-label="Collapse right column"
        >
          <PanelRightClose size={17} />
        </button>
        {question && <QuestionTypeBadge question={question} />}
      </div>

      <TakeawayEditor quiz={quiz} question={question} onSaved={onTakeawaySaved} />

      <StatsPanel stats={stats} />

      <section className="navigatorPanel">
        <div className="railHeader">
          <div className="mapHeaderLine">
            <div className="eyebrow">Question map</div>
            <span className="mapCount">{quiz?.questionCount || 0} items</span>
          </div>
        </div>

        <div className="questionGrid">
          {quiz?.questions?.map((item, index) => {
            const status = statusFor(progress, item.id);
            return (
              <button
                key={item.id}
                type="button"
                className={`questionDot ${status} ${index === questionIndex ? "current" : ""}`}
                onClick={() => onSelectQuestion(index)}
                title={`Question ${index + 1}: ${status}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        <div className="legend">
          <span><i className="legendBox unanswered" />New</span>
          <span><i className="legendBox correct" />Correct</span>
          <span><i className="legendBox wrong" />Wrong</span>
        </div>
      </section>

      <StudyReportPanel quiz={quiz} progress={progress} stats={stats} />

      <QuizImportPanel onQuizImported={onQuizImported} />

      <PromptCopyPanel />
    </aside>
  );
}

function StudyReportPanel({ quiz, progress, stats }) {
  const [copiedKey, setCopiedKey] = useState("");
  const [copyError, setCopyError] = useState("");

  async function copyReport() {
    if (!quiz) return;
    setCopyError("");
    try {
      await copyText(buildStudyReport({ quiz, progress, stats }));
      setCopiedKey("report");
      window.setTimeout(() => setCopiedKey(""), 1800);
    } catch (err) {
      setCopyError(err.message);
    }
  }

  return (
    <section className="studyReportPanel">
      <div className="railHeader compactRailHeader">
        <div>
          <div className="eyebrow">Study report</div>
          <h3>{stats.correct}/{stats.answered || 0} correct</h3>
        </div>
        <button
          className="iconTextButton"
          type="button"
          onClick={copyReport}
          disabled={!quiz || stats.answered === 0}
        >
          <BarChart3 size={16} />
          {copiedKey === "report" ? "Copied" : "Copy"}
        </button>
      </div>
      {copyError && <p className="copyError">{copyError}</p>}
    </section>
  );
}

function QuizImportPanel({ onQuizImported }) {
  const [rawText, setRawText] = useState("");
  const [message, setMessage] = useState("");
  const [importing, setImporting] = useState(false);

  async function importQuiz() {
    if (!rawText.trim() || importing) return;
    setImporting(true);
    setMessage("");
    try {
      const data = await api(`${API_BASE}/quizzes/import`, {
        method: "POST",
        body: JSON.stringify({ rawText }),
      });
      onQuizImported(data);
      setRawText("");
      setMessage(`Imported ${data.quiz.title}`);
    } catch (err) {
      setMessage(importFailureText(err.message));
    } finally {
      setImporting(false);
    }
  }

  return (
    <section className="importPanel">
      <div className="railHeader compactRailHeader">
        <div>
          <div className="eyebrow">Import quiz JSON</div>
          <h3>New quiz</h3>
        </div>
        <button
          className="iconTextButton"
          type="button"
          disabled={!rawText.trim() || importing}
          onClick={importQuiz}
        >
          <FilePlus2 size={16} />
          {importing ? "Importing" : "Import"}
        </button>
      </div>
      <textarea
        className="jsonImportBox"
        value={rawText}
        onChange={(event) => setRawText(event.target.value)}
        placeholder="Paste quiz data here"
        aria-label="Paste quiz JSON"
      />
      {message && <p className={message.startsWith("Imported") ? "saveMessage" : "copyError"}>{message}</p>}
      {!message && (
        <p className="importHint">
          Accepts raw JSON, markdown-wrapped JSON, Gemini-style answerOptions, and loose list fragments.
        </p>
      )}
    </section>
  );
}

function PromptCopyPanel() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const [manualPrompt, setManualPrompt] = useState("");
  const [config, setConfig] = useState({
    languageCode: "es",
    level: "A1",
    quizKind: "fill",
    topic: "",
  });

  const prompt = useMemo(() => buildQuizGenerationPrompt(config), [config]);

  async function copyPrompt() {
    setCopyError("");
    setManualPrompt("");
    try {
      await copyText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      setManualPrompt(prompt);
      setCopyError(`${err.message} The prompt is shown below for manual copy.`);
    }
  }

  return (
    <section className="promptPanel">
      <div className="railHeader compactRailHeader">
        <div>
          <div className="eyebrow">Prompt generator</div>
          <h3>Claude JSON</h3>
        </div>
        <button className="iconTextButton" type="button" onClick={copyPrompt}>
          <Copy size={16} />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <label className="fieldLabel">
        <span><Languages size={14} /> Language</span>
        <select
          value={config.languageCode}
          onChange={(event) => setConfig({ ...config, languageCode: event.target.value })}
        >
          {LANGUAGE_OPTIONS.map((language) => (
            <option key={language.code} value={language.code}>{language.label}</option>
          ))}
        </select>
      </label>

      <div className="fieldLabel">
        <span>Level</span>
        <div className="segmentedControl levelControl">
          {LEVEL_OPTIONS.map((level) => (
            <button
              key={level}
              type="button"
              className={config.level === level ? "active" : ""}
              onClick={() => setConfig({ ...config, level })}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="fieldLabel">
        <span>Question type</span>
        <div className="segmentedControl">
          {QUIZ_KIND_OPTIONS.map((kind) => (
            <button
              key={kind.id}
              type="button"
              className={config.quizKind === kind.id ? "active" : ""}
              onClick={() => setConfig({ ...config, quizKind: kind.id })}
            >
              {kind.label}
            </button>
          ))}
        </div>
      </div>

      <label className="fieldLabel">
        <span>Topic preference</span>
        <textarea
          className="topicBox"
          value={config.topic}
          onChange={(event) => setConfig({ ...config, topic: event.target.value })}
          placeholder="travel, workplace email, restaurant, exam prep..."
        />
      </label>

      {copyError && <p className="copyError">{copyError}</p>}
      {manualPrompt && (
        <textarea
          className="manualPrompt"
          value={manualPrompt}
          readOnly
          aria-label="Manual prompt copy"
          onFocus={(event) => event.target.select()}
        />
      )}
    </section>
  );
}

function StatsPanel({ stats }) {
  const accuracy = stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 0;

  return (
    <section className="statsPanel">
      <div className="eyebrow">Progress</div>
      <div className="statsGrid">
        <div className="wideStat">
          <span>Done</span>
          <strong>
            {stats.answered}<small>/{stats.total}</small>
          </strong>
        </div>
        <div>
          <span>Correct</span>
          <strong>{stats.correct}</strong>
        </div>
        <div>
          <span>Wrong</span>
          <strong>{stats.wrong}</strong>
        </div>
        <div>
          <span>Accuracy</span>
          <strong>{accuracy}%</strong>
        </div>
      </div>
    </section>
  );
}

function TakeawayEditor({ quiz, question, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ title: "", body: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setDraft({
      title: question?.takeaway?.title || "",
      body: question?.takeaway?.body || "",
    });
    setEditing(false);
    setMessage("");
  }, [question?.id]);

  if (!quiz || !question) {
    return (
      <section className="takeawayPanel">
        <div className="eyebrow">Core takeaway</div>
        <p className="muted">No question selected.</p>
      </section>
    );
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const data = await api(`${API_BASE}/quizzes/${quiz.id}/questions/${question.id}/takeaway`, {
        method: "PATCH",
        body: JSON.stringify(draft),
      });
      onSaved(data.takeaway);
      setEditing(false);
      setMessage("Saved");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="takeawayPanel">
      <div className="railHeader">
        <div>
          <div className="eyebrow">Core takeaway</div>
          <h3>Question {question.id}</h3>
        </div>
        <div className="editActions">
          {editing ? (
            <>
              <button className="iconButton" type="button" onClick={save} disabled={saving} title="Save" aria-label="Save">
                <Save size={17} />
              </button>
              <button
                className="iconButton"
                type="button"
                onClick={() => {
                  setDraft(question.takeaway || { title: "", body: "" });
                  setEditing(false);
                }}
                title="Cancel"
                aria-label="Cancel"
              >
                <X size={17} />
              </button>
            </>
          ) : (
            <button className="iconButton" type="button" onClick={() => setEditing(true)} title="Edit" aria-label="Edit">
              <Pencil size={17} />
            </button>
          )}
        </div>
      </div>

      {editing ? (
        <div className="takeawayForm">
          <input
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            maxLength={120}
            aria-label="Takeaway title"
          />
          <RichTextEditor
            content={draft.body}
            onChange={(body) => setDraft((current) => ({ ...current, body }))}
          />
        </div>
      ) : (
        <div className="takeawayText">
          <h4>{question.takeaway.title}</h4>
          <div
            className="richContent"
            dangerouslySetInnerHTML={{ __html: highlightQuotedTakeaway(question.takeaway.body) }}
          />
        </div>
      )}

      {message && <p className="saveMessage">{message}</p>}
    </section>
  );
}

function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color],
    content: takeawayBodyToHtml(content),
    editorProps: {
      attributes: {
        class: "richEditorSurface",
        "aria-label": "Takeaway rich text",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const nextContent = takeawayBodyToHtml(content);
    if (editor.getHTML() !== nextContent) {
      editor.commands.setContent(nextContent);
    }
  }, [content, editor]);

  if (!editor) return <div className="richEditorShell" />;

  const colors = ["#17211d", "#106b61", "#315f9f", "#b87420", "#c45445"];

  return (
    <div className="richEditorShell">
      <div className="richToolbar" aria-label="Takeaway formatting">
        <button
          type="button"
          className={editor.isActive("bold") ? "active" : ""}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
          aria-label="Bold"
        >
          <Bold size={16} />
        </button>
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            className="colorSwatch"
            style={{ "--swatch": color }}
            onClick={() => editor.chain().focus().setColor(color).run()}
            title={`Text color ${color}`}
            aria-label={`Text color ${color}`}
          />
        ))}
        <button
          type="button"
          className="plainToolbarButton"
          onClick={() => editor.chain().focus().unsetColor().run()}
        >
          Auto
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
