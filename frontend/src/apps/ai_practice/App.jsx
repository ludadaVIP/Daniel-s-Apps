import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Award,
  BarChart3,
  Bold,
  BookOpen,
  Brain,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clipboard,
  Copy,
  Download,
  Eraser,
  FileJson,
  Filter,
  Headphones,
  Loader2,
  Map as MapIcon,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Pencil,
  PlayCircle,
  RefreshCcw,
  Save,
  Square,
  Sparkles,
  StickyNote,
  Target,
  Trash2,
  Upload,
  Volume2,
  X
} from 'lucide-react';
import {
  deleteQuestion,
  deleteQuiz,
  fetchQuiz,
  fetchQuizProgress,
  fetchQuizzes,
  fetchSettings,
  fetchProgressSummary,
  fetchTakeaway,
  gradeQuestion,
  importQuiz,
  clearTtsAudioCache,
  renameQuiz,
  resetQuizProgress,
  saveQuizProgress,
  saveTakeaway
} from './services/api';
import {
  blankQuizState,
  mergeQuizState,
  removeAnswerFromState
} from './services/storage';
import {
  completeSentenceForAnswer,
  isTtsCancelled,
  speechForCurrentQuestion,
  useTts
} from './services/tts';
import './styles.css';
import wechatQr from './wechat.jpg';

const RESTART_CODE = '12580';
const DELETE_CODE = '12580';

const PROMPT_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'unknown'];
// Show both Chinese gloss and CEFR — Chinese learners usually don't think in CEFR.
const LEVEL_LABELS = {
  A1: '入门 (A1)',
  A2: '初级 (A2)',
  B1: '中级 (B1)',
  B2: '中高级 (B2)',
  C1: '高级 (C1)',
  C2: '精通 (C2)',
  unknown: '我不确定，让 AI 自行判断'
};
const PROMPT_DEFAULT_TYPES = ['mc', 'fill'];
const TYPE_NAMES_EN = { mc: 'Multiple choice', fill: 'Fill the blank' };
const TYPE_LABELS = { mc: '选择题', fill: '填空题' };

// Audience presets — each carries a list of grade choices that make sense for it
// and an English phrase used in the AI prompt.
const AUDIENCE_PRESETS = [
  {
    value: 'elementary',
    label: '小学生',
    englishLabel: 'Chinese elementary school student',
    grades: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级']
  },
  {
    value: 'middle',
    label: '初中生',
    englishLabel: 'Chinese middle school student',
    grades: ['初一', '初二', '初三']
  },
  {
    value: 'high',
    label: '高中生',
    englishLabel: 'Chinese high school student',
    grades: ['高一', '高二', '高三']
  },
  {
    value: 'university',
    label: '大学生',
    englishLabel: 'Chinese university student',
    grades: ['大一', '大二', '大三', '大四']
  },
  {
    value: 'adult',
    label: '成人',
    englishLabel: 'Chinese adult learner',
    grades: ['考研', '托福', '雅思', 'GRE', 'PTE']
  }
];

// Suggested CEFR level by grade — used to auto-fill 学生水平 when the user picks
// a grade. The user can always override.
const GRADE_LEVEL_HINTS = {
  一年级: 'A1',
  二年级: 'A1',
  三年级: 'A1',
  四年级: 'A2',
  五年级: 'A2',
  六年级: 'A2',
  初一: 'A2',
  初二: 'A2',
  初三: 'B1',
  高一: 'B1',
  高二: 'B1',
  高三: 'B2',
  大一: 'B1',
  大二: 'B2',
  大三: 'B2',
  大四: 'C1',
  考研: 'C1',
  托福: 'B2',
  雅思: 'B2',
  GRE: 'C1',
  PTE: 'B2'
};

function audiencePresetByValue(value) {
  return AUDIENCE_PRESETS.find((option) => option.value === value) || AUDIENCE_PRESETS[0];
}

function cx(...args) {
  return args.filter(Boolean).join(' ');
}

function scrollExerciseTop() {
  setTimeout(() => {
    document.querySelector('.exercise-panel')?.scrollTo({ top: 0, behavior: 'smooth' });
  }, 0);
}

function slugifyQuizName(value) {
  return (value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '');
}

/**
 * Pull the first complete top-level JSON object out of a chunk of text.
 *
 * AI responses come in all sorts of shapes:
 *   - ```json\n{...}\n```
 *   - ```{...}```
 *   - prose before the brace, prose after the brace
 *   - just the raw { ... }
 *
 * We walk character-by-character to find a balanced { ... } pair, respecting
 * string literals so a "{" inside a quote doesn't mess up the counter.
 * Returns the JSON substring, or null if no balanced object exists.
 */
function extractJsonObject(text) {
  if (typeof text !== 'string') return null;
  const start = text.indexOf('{');
  if (start < 0) return null;

  let depth = 0;
  let inString = false;
  let escape = false;
  let stringChar = '';

  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    if (inString) {
      if (escape) {
        escape = false;
      } else if (ch === '\\') {
        escape = true;
      } else if (ch === stringChar) {
        inString = false;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      inString = true;
      stringChar = ch;
      continue;
    }
    if (ch === '{') {
      depth += 1;
    } else if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
  }
  return null;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Broad domains the skill map groups by. AI is asked to label each question
// with one of these, and old quizzes (which only have a granular "category")
// fall through inferDomain() — so the pie never explodes into 50 tiny slices.
const DOMAINS = ['语法', '词汇', '阅读', '听力', '写作', '口语', '综合'];

const DOMAIN_KEYWORDS = [
  {
    domain: '语法',
    match:
      /tense|perfect|simple|continuous|progressive|conditional|modal|gerund|infinitive|preposition|article|pronoun|adjective|adverb|comparative|superlative|passive|active|reported|relative|clause|grammar|negation|question form|subjunctive|verb form|word order|tag question|时态|语法|从句|被动|条件句|情态|过去式|进行时|完成时|介词|代词|形容词|副词/i
  },
  {
    domain: '词汇',
    match:
      /vocab|vocabulary|word formation|phrasal|idiom|collocation|synonym|antonym|family|food|animal|color|number|emotion|weather|body|clothing|sports|hobbies|jobs|profession|noun|词汇|短语|动词搭配|名词|词义/i
  },
  { domain: '阅读', match: /reading|comprehension|passage|阅读|理解/i },
  { domain: '听力', match: /listening|listen|hear|听力/i },
  { domain: '写作', match: /writing|essay|paragraph|composition|写作/i },
  { domain: '口语', match: /speaking|pronunciation|dialogue|conversation|口语|发音|对话/i }
];

function inferDomain(category) {
  if (!category) return '综合';
  for (const rule of DOMAIN_KEYWORDS) {
    if (rule.match.test(category)) return rule.domain;
  }
  return '综合';
}

function questionDomain(question) {
  if (!question) return '综合';
  if (question.domain && DOMAINS.includes(question.domain)) return question.domain;
  return inferDomain(question.category || question.skill);
}

function polarPoint(cx, cy, r, angle) {
  // 0 rad points up (12 o'clock); progress clockwise.
  return { x: cx + r * Math.sin(angle), y: cy - r * Math.cos(angle) };
}

function describeSlice(cx, cy, r, startAngle, endAngle) {
  const start = polarPoint(cx, cy, r, startAngle);
  const end = polarPoint(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

// Green → amber → red, by error rate. Unanswered → muted grey.
function sliceColor(answered, wrong) {
  if (!answered) return '#cbd5e1';
  const t = Math.min(1, wrong / answered);
  if (t < 0.5) {
    // green to amber
    const k = t / 0.5;
    const r = Math.round(37 + (244 - 37) * k);
    const g = Math.round(164 + (185 - 164) * k);
    const b = Math.round(106 + (66 - 106) * k);
    return `rgb(${r}, ${g}, ${b})`;
  }
  const k = (t - 0.5) / 0.5;
  const r = Math.round(244 + (217 - 244) * k);
  const g = Math.round(185 + (75 - 185) * k);
  const b = Math.round(66 + (84 - 66) * k);
  return `rgb(${r}, ${g}, ${b})`;
}

function defaultTakeawayHtml(question, answer) {
  // The takeaway text is delivered via the grading response, so we only have
  // it once the student has actually answered the question.
  if (!question || !answer) return '';
  const text =
    answer.coreTakeaway ||
    answer.explanationEn ||
    answer.explanation ||
    'Focus on the key grammar or vocabulary point in this question.';
  // AIs often hand us "English | 中文" or "English\n\n中文" in coreTakeaway.
  // Split on those separators so the editor shows them as two paragraphs
  // with a blank line between, instead of a long inline run.
  const segments = String(text)
    .split(/\s*\|\s*|\n\s*\n+/)
    .map((piece) => piece.trim())
    .filter(Boolean);
  if (segments.length === 0) return '';
  return segments.map((piece) => `<p>${escapeHtml(piece)}</p>`).join('');
}

// JSON schema example shared by every prompt builder so the downstream AI
// always knows what shape to return.
const SCHEMA_EXAMPLE = JSON.stringify(
  {
    id: 'quiz-custom',
    title: 'Targeted Practice',
    subtitle: 'Focused on weak points',
    level: 'B1',
    audience: 'Chinese middle school student',
    estimatedMinutes: 18,
    questions: [
      {
        id: 1,
        domain: '语法',
        category: 'Past Simple',
        skill: 'Past Simple',
        icon: '✨',
        type: 'mc',
        question: 'Yesterday I ___ to school by bus.',
        explanation: 'Past simple of "go" is "went".',
        explanationZh: 'go 的过去式是 went，与 yesterday 相配。',
        coreTakeaway: "Past simple uses 'went' for the verb 'go'.",
        options: ['go', 'went', 'gone', 'going'],
        correctIndex: 1
      },
      {
        id: 2,
        domain: '词汇',
        type: 'fill',
        category: 'Family Vocabulary',
        skill: 'Family Vocabulary',
        icon: '🔤',
        question: 'My father’s sister is my _____.',
        explanation: "Father's or mother's sister = aunt.",
        explanationZh: '爸爸或妈妈的姐妹都叫 aunt。',
        coreTakeaway: "Parent's sister is your aunt.",
        answer: 'aunt',
        acceptable: ['aunt', 'auntie']
      }
    ]
  },
  null,
  2
);

function buildSingleMistakePrompt({ question, answer, audience, grade, level }) {
  const audiencePreset = audiencePresetByValue(audience);
  const audienceText = grade
    ? `${audiencePreset.englishLabel}, grade: ${grade}`
    : audiencePreset.englishLabel;
  const levelLabel =
    !level || level === 'unknown'
      ? 'match the audience above (auto)'
      : `${level} (CEFR)`;
  const optionsText =
    Array.isArray(question.options) && question.options.length
      ? `\nOptions: ${question.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`).join(' | ')}`
      : '';
  const correctText = answer?.correctText || '';
  const studentText = answer?.answerText || '';
  return [
    'You are creating a 5-question targeted practice set for the AI Practice app.',
    'The student just got the question below WRONG — generate 5 similar questions that drill the same underlying point.',
    '',
    `Audience: ${audienceText}.`,
    `Target level: ${levelLabel}.`,
    `Category / skill: ${question.category || 'General'}.`,
    '',
    'Original mistake:',
    `- Question: ${question.question || ''}` + optionsText,
    `- Type: ${question.type || 'mc'}`,
    `- Student answer: ${studentText || '(blank)'}`,
    `- Correct answer: ${correctText}`,
    answer?.explanationEn ? `- Explanation: ${answer.explanationEn}` : '',
    '',
    'Rules:',
    '- Return ONLY a single JSON object — no prose, no markdown fences.',
    '- Generate exactly 5 questions; keep the original type (mc/fill).',
    '- Drill the SAME underlying grammar / vocabulary point.',
    '- Avoid copying the original sentence; vary contexts and vocabulary.',
    `- Every question must include id (1..5), domain (one of: ${DOMAINS.join(' / ')}), category, skill, icon (one emoji), type, question, explanation, explanationZh, coreTakeaway.`,
    '- For "mc" include options (3-4) and correctIndex (0-based int).',
    '- For "fill" use _____ (five underscores) for the blank, plus answer and acceptable list.',
    '- For "coreTakeaway" must be both English and Chinese: identifies the key test points and difficulties in a direct, high-value format suitable for student review and memorization.',
    '- Constraint: To prevent JSON syntax errors, do not use standard double quotes (") inside any string values. Instead, use single quotes or Chinese full-width quotes (“”) for emphasis or definitions within the text.',
    '',
    'Schema (follow exactly):',
    SCHEMA_EXAMPLE,
    '',
    'Now generate the 5-question practice JSON.'
  ]
    .filter(Boolean)
    .join('\n');
}

function buildFullDrillPrompt({ slimMistakes, weakSkills, audience, grade, level, count = 50 }) {
  const audiencePreset = audiencePresetByValue(audience);
  const audienceText = grade
    ? `${audiencePreset.englishLabel}, grade: ${grade}`
    : audiencePreset.englishLabel;
  const levelLabel =
    !level || level === 'unknown'
      ? 'match the audience above (auto)'
      : `${level} (CEFR)`;
  const weakSkillList = weakSkills.length
    ? weakSkills.map((s) => `${s.skill} (×${s.wrong})`).join(', ')
    : '(no specific skills flagged yet)';
  const errorBlock = JSON.stringify(
    {
      weakSkills: weakSkills.map((s) => ({ skill: s.skill, wrong: s.wrong })),
      mistakes: slimMistakes
    },
    null,
    2
  );
  return [
    'You are creating a deliberate-practice quiz for the AI Practice app.',
    `Goal: build exactly ${count} new questions that target the student's weak spots from the previous quiz.`,
    '',
    `Audience: ${audienceText}.`,
    `Target level: ${levelLabel}.`,
    `Weak skills (most frequent first): ${weakSkillList}.`,
    '',
    'Student errors from the previous quiz (read carefully — these drive the practice):',
    errorBlock,
    '',
    'Rules:',
    '- Return ONLY a single JSON object — no prose, no markdown fences.',
    `- Generate exactly ${count} fresh questions, weighted by the weak-skill frequencies above.`,
    '- Mix question types: roughly 70% "mc" and 30% "fill".',
    '- Do NOT copy the original mistake sentences — write new contexts that drill the same points.',
    `- Every question must include id (1..N), domain (one of: ${DOMAINS.join(' / ')}), category, skill, icon (one emoji), type, question, explanation, explanationZh, coreTakeaway.`,
    '- For "mc" include options (3-4) and correctIndex (0-based int).',
    '- For "fill" use _____ for the blank, plus answer and acceptable list.',
    '- For "coreTakeaway" must be both English and Chinese: identifies the key test points and difficulties in a direct, high-value format suitable for student review and memorization.',
    '- Constraint: To prevent JSON syntax errors, do not use standard double quotes (") inside any string values. Instead, use single quotes or Chinese full-width quotes (“”) for emphasis or definitions within the text.',
    '',
    'Schema (follow exactly):',
    SCHEMA_EXAMPLE,
    '',
    `Now generate the ${count}-question deliberate-practice JSON.`
  ].join('\n');
}

function buildPromptText({ topic, level, count, types, audience, grade }) {
  const requestedTypes = types.length ? types : PROMPT_DEFAULT_TYPES;
  const typeList = requestedTypes.map((t) => `"${t}" (${TYPE_NAMES_EN[t]})`).join(', ');
  const audiencePreset = audiencePresetByValue(audience);
  const audienceText = grade
    ? `${audiencePreset.englishLabel}, grade: ${grade}`
    : audiencePreset.englishLabel;
  const levelLabel =
    level === 'unknown' || !level
      ? 'let the AI choose an appropriate CEFR level for the audience and grade above'
      : `${level} (CEFR)`;
  const example = JSON.stringify(
    {
      id: 'quiz-custom',
      title: 'My Custom Quiz',
      subtitle: `${level || 'B1'} ${topic || 'general English'} practice`,
      level: level || 'B1',
      audience: audience || '11-year-old English learner',
      estimatedMinutes: Math.max(10, Math.round((count || 50) * 0.6)),
      questions: [
        {
          id: 1,
          domain: '语法',
          category: 'Present Perfect',
          skill: 'Present Perfect',
          icon: '✨',
          type: 'mc',
          question: 'I ___ never been to Paris before.',
          explanation: "Present perfect uses 'have/has + past participle'.",
          explanationZh: '现在完成时使用 have/has + 过去分词，表示到现在为止的经历或结果。',
          coreTakeaway: "Use 'have/has + past participle' to talk about life experiences before now.",
          options: ['am', 'have', 'has', 'had'],
          correctIndex: 1
        },
        {
          id: 2,
          domain: '词汇',
          type: 'fill',
          category: 'Family Vocabulary',
          skill: 'Family Vocabulary',
          icon: '🔤',
          question: 'My father’s sister is my _____.',
          explanation: 'Father’s or mother’s sister = aunt.',
          explanationZh: '爸爸或妈妈的姐妹都叫 aunt。',
          coreTakeaway: "Family vocabulary: your parent's sister is your aunt.",
          answer: 'aunt',
          acceptable: ['aunt', 'auntie']
        }
      ]
    },
    null,
    2
  );

  return [
    `You are creating a JSON practice quiz for the AI Practice app.`,
    ``,
    `Audience: ${audienceText}.`,
    `Topic / focus: ${topic || 'general English review'}.`,
    `Target level: ${levelLabel}.`,
    `Learning content language: English.`,
    `Number of questions: exactly ${count || 30}.`,
    `Allowed question types: ${typeList}.`,
    ``,
    `Rules:`,
    `- Return ONLY a single JSON object. No prose, no markdown fences, no commentary.`,
    `- Every question MUST have id (1..N), domain, category, skill, icon (one emoji), type, question, explanation, explanationZh, coreTakeaway.`,
    `- "domain" MUST be one of: ${DOMAINS.join(' / ')}. Group related questions under the same domain so the skill map stays meaningful.`,
    `- "category" is a granular tag inside a domain (e.g. domain "语法" → category "Past Simple" or "Modals"). Keep it short.`,
    `- "mc" questions: include "options" (3-4 strings) and "correctIndex" (0-based int).`,
    `- "fill" questions: use _____ (five underscores) inside "question" to mark the blank, plus "answer" and an "acceptable" list of alternatives.`,
    `- "explanation" must be clear English sentences aimed at the audience above.`,
    `- "explanationZh" must be an informative Chinese explanation of the key points of this question`,
    `- "coreTakeaway" must be both English and Chinese: identifies the key test points and difficulties in a direct, high-value format suitable for student review and memorization.`,
    `- Do NOT include the answer text inside the "question" string for "fill"/"mc" types.`,
    `- Constraint: To prevent JSON syntax errors, do not use standard double quotes (") inside any string values. Instead, use single quotes (') or Chinese full-width quotes (“”) for emphasis or definitions within the text.`,
    ``,
    `Schema (follow exactly):`,
    example,
    ``,
    `Now generate the quiz JSON.`
  ].join('\n');
}

export default function App() {
  const [quizzes, setQuizzes] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [activeQuizId, setActiveQuizId] = useState('');
  const [quizState, setQuizStateRaw] = useState(() => blankQuizState());
  const [progressByQuiz, setProgressByQuiz] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [wrongOnly, setWrongOnly] = useState(false);
  const [finalMode, setFinalMode] = useState(false);
  const [fillAnswer, setFillAnswer] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [insightsCollapsed, setInsightsCollapsed] = useState(false);
  const [skillMapExpanded, setSkillMapExpanded] = useState(false);
  const [restartModalOpen, setRestartModalOpen] = useState(false);
  const [restartCode, setRestartCode] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteCode, setDeleteCode] = useState('');
  const [settings, setSettings] = useState({ voiceGender: 'female' });
  const [readAllProgress, setReadAllProgress] = useState({ active: false, index: 0, total: 0 });
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importBusy, setImportBusy] = useState(false);
  const [promptForm, setPromptForm] = useState(() => {
    const defaultAudience = AUDIENCE_PRESETS[0];
    const defaultGrade = defaultAudience.grades[0];
    return {
      topic: '',
      level: GRADE_LEVEL_HINTS[defaultGrade] || 'B1',
      count: 30,
      types: [...PROMPT_DEFAULT_TYPES],
      audience: defaultAudience.value,
      grade: defaultGrade,
      language: 'English'
    };
  });
  const [renameModal, setRenameModal] = useState({ open: false, oldId: '', id: '', title: '' });
  const [renameBusy, setRenameBusy] = useState(false);
  const [questionDeleteConfirm, setQuestionDeleteConfirm] = useState(null);
  const [questionDeleteBusy, setQuestionDeleteBusy] = useState(false);
  const [takeawayHtml, setTakeawayHtml] = useState('');
  const [takeawayByQuestion, setTakeawayByQuestion] = useState({});
  const [takeawayStatus, setTakeawayStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const [questionMapExpanded, setQuestionMapExpanded] = useState(true);
  const [contactCardOpen, setContactCardOpen] = useState(true);
  const [rightTab, setRightTab] = useState('notes'); // 'notes' | 'ai'

  const toastTimerRef = useRef(null);
  const readAllCancelRef = useRef(false);
  const takeawayRef = useRef(null);
  const takeawayTimerRef = useRef(null);
  const takeawayLoadedForRef = useRef('');
  // Refs on each right-column section so the collapsed rail can scroll to them.
  const sectionMapRef = useRef(null);
  const sectionTakeawayRef = useRef(null);
  const sectionSkillRef = useRef(null);
  const sectionAiRef = useRef(null);
  const sectionDeliberateRef = useRef(null);

  const tts = useTts();

  const rememberProgress = useCallback((quizId, state) => {
    if (!quizId) return;
    const mergedState = mergeQuizState(state);
    setProgressByQuiz((prev) => ({
      ...prev,
      [quizId]: {
        state: mergedState
      }
    }));
  }, []);

  const setQuizState = useCallback(
    (updater, options = {}) => {
      setQuizStateRaw((prev) => {
        const next = mergeQuizState(typeof updater === 'function' ? updater(prev) : updater);
        const targetId = options.persistAs || activeQuizId;
        if (targetId) {
          rememberProgress(targetId, next);
          saveQuizProgress(targetId, next).catch(() => {
            showToast('进度保存失败。');
          });
        }
        return next;
      });
    },
    [activeQuizId, rememberProgress]
  );

  const questions = useMemo(() => quiz?.questions || [], [quiz]);
  const totalQuestions = questions.length;
  const answers = quizState.answers || {};
  const answeredCount = Object.keys(answers).length;
  const correctCount = useMemo(
    () => Object.values(answers).filter((answer) => answer.correct).length,
    [answers]
  );
  const wrongCount = useMemo(
    () => Object.values(answers).filter((answer) => answer.correct === false).length,
    [answers]
  );
  const progressPercent = totalQuestions ? (answeredCount / totalQuestions) * 100 : 0;
  const scorePercent = totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const isComplete = totalQuestions > 0 && answeredCount === totalQuestions;
  const voiceReady = Boolean(settings.voiceGender);

  const allIndices = useMemo(
    () => [-1, ...questions.map((_, index) => index)],
    [questions]
  );
  const wrongQuestionIndices = useMemo(
    () =>
      questions
        .map((question, index) => (answers[question.id]?.correct === false ? index : -1))
        .filter((index) => index >= 0),
    [questions, answers]
  );
  const visibleIndices = wrongOnly ? wrongQuestionIndices : allIndices;

  const currentIndex = useMemo(() => {
    const savedIndex = Number.isFinite(quizState.currentIndex) ? quizState.currentIndex : -1;
    if (!totalQuestions) return -1;
    return Math.max(-1, Math.min(savedIndex, totalQuestions - 1));
  }, [quizState.currentIndex, totalQuestions]);

  const currentQuestion = questions[currentIndex] || null;
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;

  function isQuizStateComplete(state, questionCount) {
    const answerCount = Object.keys(state?.answers || {}).length;
    return questionCount > 0 && (Boolean(state?.finishedAt) || answerCount >= questionCount);
  }

  // Skill map is grouped by broad domain (语法 / 词汇 / 阅读 ...). Each row also
  // keeps a small breakdown of its top granular categories so the legend can
  // tell us *which* part of grammar is weakest, not just "grammar in general".
  const skillRows = useMemo(() => {
    const rows = new Map();
    questions.forEach((question) => {
      const domain = questionDomain(question);
      if (!rows.has(domain)) {
        rows.set(domain, {
          name: domain,
          total: 0,
          answered: 0,
          correct: 0,
          wrong: 0,
          categories: new Map()
        });
      }
      const row = rows.get(domain);
      row.total += 1;
      const categoryName = question.category || question.skill || 'General';
      if (!row.categories.has(categoryName)) {
        row.categories.set(categoryName, { name: categoryName, total: 0, wrong: 0, answered: 0 });
      }
      row.categories.get(categoryName).total += 1;
    });

    questions.forEach((question) => {
      const answer = answers[question.id];
      if (!answer) return;
      const domain = questionDomain(question);
      const row = rows.get(domain);
      if (!row) return;
      row.answered += 1;
      if (answer.correct) row.correct += 1;
      else row.wrong += 1;
      const categoryName = question.category || question.skill || 'General';
      const catRow = row.categories.get(categoryName);
      if (catRow) {
        catRow.answered += 1;
        if (!answer.correct) catRow.wrong += 1;
      }
    });

    // Sort categories inside each row by wrong-count, then collapse the Map to
    // a plain array sorted by overall pain (wrong + answered).
    return Array.from(rows.values())
      .map((row) => ({
        ...row,
        categories: Array.from(row.categories.values()).sort(
          (a, b) => b.wrong - a.wrong || b.total - a.total
        )
      }))
      .sort((a, b) => b.wrong - a.wrong || b.total - a.total || a.name.localeCompare(b.name));
  }, [questions, answers]);

  const focusRows = useMemo(
    () => skillRows.filter((row) => row.wrong).slice(0, 6),
    [skillRows]
  );
  const mistakeItems = useMemo(
    () =>
      questions
        .map((question, index) => ({ question, index, answer: answers[question.id] }))
        .filter((item) => item.answer?.correct === false),
    [questions, answers]
  );

  const nextButtonText = (() => {
    if (wrongOnly) return '下一道错题';
    if (isComplete && currentIndex === totalQuestions - 1) return '完成';
    return '下一题';
  })();

  const quizNavStatus = useMemo(
    () =>
      quizzes.reduce((map, item) => {
        const state = item.id === activeQuizId
          ? quizState
          : mergeQuizState(progressByQuiz[item.id]?.state);
        const answerValues = Object.values(state.answers || {});
        const answered = answerValues.length;
        const correct = answerValues.filter((answer) => answer.correct).length;
        const complete =
          item.questionCount > 0 && (Boolean(state.finishedAt) || answered >= item.questionCount);
        map[item.id] = {
          answered,
          correct,
          complete,
          score: item.questionCount ? Math.round((correct / item.questionCount) * 100) : 0
        };
        return map;
      }, {}),
    [quizzes, activeQuizId, quizState, progressByQuiz]
  );

  const optionGridClass = (() => {
    const question = currentQuestion;
    if (!question || question.type !== 'mc') return '';
    const compact =
      question.options?.length === 4 &&
      question.options.every((option) => option.length <= 38);
    return compact ? 'is-compact' : '';
  })();

  useEffect(() => {
    if (currentQuestion?.type === 'fill') {
      setFillAnswer(currentAnswer?.answerText || '');
    } else {
      setFillAnswer('');
    }
  }, [currentQuestion, currentAnswer]);

  const showToast = useCallback((message) => {
    setToastMessage(message);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage('');
    }, 1800);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Load voice settings once on mount. If it fails, we keep the default ("female"),
  // which still lets the user click speak buttons (the server falls back too).
  useEffect(() => {
    let cancelled = false;
    fetchSettings()
      .then((data) => {
        if (cancelled) return;
        if (data?.voiceGender) setSettings({ voiceGender: data.voiceGender });
      })
      .catch(() => {
        /* settings stay at default */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectQuiz = useCallback(
    async (quizId) => {
      if (!quizId) return;
      if (quizId === activeQuizId) {
        const complete = isQuizStateComplete(quizState, totalQuestions);
        setWrongOnly(false);
        if (complete) {
          setFinalMode(true);
          scrollExerciseTop();
          return;
        }
        setFinalMode(false);
        if (Object.keys(quizState.answers || {}).length === 0 && currentIndex !== -1) {
          setCurrentQuestionIndex(-1);
        } else {
          scrollExerciseTop();
        }
        return;
      }
      setLoadingQuiz(true);
      setError('');
      tts.stop();
      readAllCancelRef.current = true;
      setReadAllProgress({ active: false, index: 0, total: 0 });
      try {
        setActiveQuizId(quizId);
        const [payload, progress] = await Promise.all([
          fetchQuiz(quizId),
          fetchQuizProgress(quizId)
        ]);
        setQuiz(payload);
        const loaded = mergeQuizState(progress?.state);
        if ((loaded.currentIndex ?? -1) >= payload.questions.length) {
          loaded.currentIndex = Math.max(payload.questions.length - 1, 0);
        }
        if ((loaded.currentIndex ?? -1) < -1) {
          loaded.currentIndex = -1;
        }
        const loadedAnswerCount = Object.keys(loaded.answers || {}).length;
        if (loadedAnswerCount === 0 && !loaded.finishedAt) {
          loaded.currentIndex = -1;
        }
        const loadedComplete = isQuizStateComplete(loaded, payload.questions.length);
        setQuizStateRaw(loaded);
        rememberProgress(quizId, loaded);
        setWrongOnly(false);
        setFinalMode(loadedComplete);
      } catch (err) {
        setError(err.message || '无法加载这套题。');
      } finally {
        setLoadingQuiz(false);
      }
    },
    [activeQuizId, currentIndex, quizState, rememberProgress, totalQuestions, tts]
  );

  const refreshQuizList = useCallback(
    async ({ preferId } = {}) => {
      const [payload, progressPayload] = await Promise.all([
        fetchQuizzes(),
        fetchProgressSummary()
      ]);
      const list = payload.quizzes || [];
      setQuizzes(list);
      setProgressByQuiz(progressPayload.progress || {});
      if (list.length === 0) {
        setQuiz(null);
        setActiveQuizId('');
        return null;
      }
      const target = list.find((item) => item.id === preferId)?.id || list[0].id;
      if (target !== activeQuizId) {
        setActiveQuizId('');
        await selectQuiz(target);
      }
      return target;
    },
    [activeQuizId, selectQuiz]
  );

  // Initial load.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [payload, progressPayload] = await Promise.all([
          fetchQuizzes(),
          fetchProgressSummary()
        ]);
        if (cancelled) return;
        const list = payload.quizzes || [];
        setQuizzes(list);
        setProgressByQuiz(progressPayload.progress || {});
        if (list.length) {
          await selectQuiz(list[0].id);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || '无法加载题库。');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function navStatus(item) {
    return (
      quizNavStatus[item.id] || { answered: 0, correct: 0, complete: false, score: 0 }
    );
  }

  function navMeta(item) {
    const status = navStatus(item);
    if (status.complete) return `已完成 · ${status.score}% · ${item.level}`;
    if (status.answered) return `${status.answered}/${item.questionCount} 已做 · ${item.level}`;
    return `${item.questionCount} 题 · ${item.level}`;
  }

  function jumpTo(index) {
    if (wrongOnly && !wrongQuestionIndices.includes(index)) return;
    setCurrentQuestionIndex(index);
  }

  function jumpToInsightSection(target) {
    // target: 'map' | 'takeaway' | 'skill' | 'ai-prompt' | 'ai-drill'
    const aiTargets = new Set(['ai-prompt', 'ai-drill']);
    setInsightsCollapsed(false);
    setRightTab(aiTargets.has(target) ? 'ai' : 'notes');
    // Let React commit the tab + expansion first, then scroll the section into view.
    setTimeout(() => {
      const refs = {
        map: sectionMapRef,
        takeaway: sectionTakeawayRef,
        skill: sectionSkillRef,
        'ai-prompt': sectionAiRef,
        'ai-drill': sectionDeliberateRef
      };
      const node = refs[target]?.current;
      if (node && typeof node.scrollIntoView === 'function') {
        node.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  }

  async function goHome() {
    // Logo click — back to the very first quiz on its intro page.
    tts.stop();
    readAllCancelRef.current = true;
    setReadAllProgress({ active: false, index: 0, total: 0 });
    setWrongOnly(false);
    setFinalMode(false);
    if (!quizzes.length) return;
    const firstId = quizzes[0].id;
    if (firstId === activeQuizId) {
      jumpTo(-1);
      return;
    }
    setActiveQuizId('');
    await selectQuiz(firstId);
    jumpTo(-1);
  }

  function firstUnansweredIndex() {
    return questions.findIndex((question) => !answers[question.id]);
  }

  function startQuizFromIntro() {
    const firstUnanswered = firstUnansweredIndex();
    jumpTo(firstUnanswered >= 0 ? firstUnanswered : 0);
  }

  function goPrevious() {
    const visible = visibleIndices;
    const position = visible.indexOf(currentIndex);
    if (position > 0) jumpTo(visible[position - 1]);
  }

  function goNext() {
    if (currentIndex === -1) {
      startQuizFromIntro();
      return;
    }
    if (wrongOnly) {
      const visible = visibleIndices;
      const position = visible.indexOf(currentIndex);
      if (position >= 0 && position < visible.length - 1) jumpTo(visible[position + 1]);
      return;
    }
    if (isComplete && currentIndex === totalQuestions - 1) {
      finishAttempt();
      return;
    }
    if (currentIndex < totalQuestions - 1) {
      jumpTo(currentIndex + 1);
      return;
    }
    const firstUnanswered = questions.findIndex((question) => !answers[question.id]);
    if (firstUnanswered >= 0) {
      showToast(`第 ${firstUnanswered + 1} 题还没有完成。`);
      jumpTo(firstUnanswered);
    }
  }

  function toggleWrongOnly() {
    if (!wrongOnly && wrongQuestionIndices.length === 0) {
      showToast('目前还没有错题。');
      return;
    }
    const next = !wrongOnly;
    setWrongOnly(next);
    setFinalMode(false);
    if (next && !wrongQuestionIndices.includes(currentIndex)) {
      jumpTo(wrongQuestionIndices[0]);
    }
  }

  function setCurrentQuestionIndex(index, { persist = true } = {}) {
    setFinalMode(false);
    const nextState = { ...quizState, currentIndex: index };
    setQuizStateRaw(nextState);
    if (persist && activeQuizId) {
      rememberProgress(activeQuizId, nextState);
      saveQuizProgress(activeQuizId, nextState).catch(() => {
        showToast('进度保存失败。');
      });
    }
    scrollExerciseTop();
  }

  function saveAnswer(question, result) {
    setQuizState((prev) => ({
      ...prev,
      answers: {
        ...(prev.answers || {}),
        [question.id]: {
          ...result,
          questionId: question.id,
          questionNumber: currentIndex + 1,
          question: question.question,
          reading: question.reading || null,
          options: question.options || null
        }
      }
    }));
    if (result.correct) showToast('检查完成：回答正确。');
  }

  async function answerMultipleChoice(index) {
    const question = currentQuestion;
    if (!question || currentAnswer || submitting) return;
    setSubmitting(true);
    try {
      const result = await gradeQuestion(activeQuizId, {
        questionId: question.id,
        answerIndex: index
      });
      saveAnswer(question, result);
    } catch (err) {
      showToast(err.message || '无法检查答案。');
    } finally {
      setSubmitting(false);
    }
  }

  async function checkFillAnswer() {
    const question = currentQuestion;
    if (!question || currentAnswer || submitting) return;
    const answerText = fillAnswer.trim();
    if (!answerText) {
      showToast('请先输入答案。');
      return;
    }
    setSubmitting(true);
    try {
      const result = await gradeQuestion(activeQuizId, {
        questionId: question.id,
        answerText
      });
      saveAnswer(question, result);
    } catch (err) {
      showToast(err.message || '无法检查答案。');
    } finally {
      setSubmitting(false);
    }
  }

  function resetFillAnswer() {
    if (currentAnswer) return;
    setFillAnswer('');
  }

  function optionClasses(index) {
    const answer = currentAnswer;
    if (!answer) return '';
    if (index === answer.correctIndex) return 'is-correct';
    if (index === answer.answerIndex && !answer.correct) return 'is-wrong';
    if (index === answer.answerIndex) return 'is-selected';
    return 'is-dimmed';
  }

  function openRestartModal() {
    setRestartCode('');
    setRestartModalOpen(true);
  }

  function closeRestartModal() {
    setRestartModalOpen(false);
    setRestartCode('');
  }

  async function confirmRestartQuiz() {
    if (restartCode !== RESTART_CODE) {
      showToast('请输入家长密码。');
      return;
    }
    try {
      const record = await resetQuizProgress(activeQuizId);
      const fresh = mergeQuizState(record?.state);
      setQuizStateRaw(fresh);
      rememberProgress(activeQuizId, fresh);
      setWrongOnly(false);
      setFinalMode(false);
      closeRestartModal();
      showToast('当前题库已重置。');
    } catch (err) {
      showToast(err?.message || '无法重置这套题。');
    }
  }

  function openDeleteModal() {
    setDeleteCode('');
    setDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setDeleteModalOpen(false);
    setDeleteCode('');
  }

  async function confirmDeleteQuiz() {
    if (deleteCode !== DELETE_CODE) {
      showToast('请输入家长密码。');
      return;
    }
    if (!activeQuizId) return;
    const removingId = activeQuizId;
    try {
      stopReadAll();
      tts.stop();
      await deleteQuiz(removingId);
      clearTtsAudioCache();
      setProgressByQuiz((prev) => {
        const next = { ...prev };
        delete next[removingId];
        return next;
      });
      closeDeleteModal();
      const payload = await fetchQuizzes();
      const list = payload.quizzes || [];
      setQuizzes(list);
      if (list.length === 0) {
        setQuiz(null);
        setActiveQuizId('');
      } else {
        setActiveQuizId('');
        await selectQuiz(list[0].id);
      }
      showToast('题库已删除。');
    } catch (err) {
      showToast(err.message || '无法删除这套题。');
    }
  }

  // ----- Quiz rename -----

  function openRenameModal() {
    if (!quiz) return;
    setRenameModal({
      open: true,
      oldId: activeQuizId,
      id: activeQuizId,
      title: quiz.title || ''
    });
  }

  function closeRenameModal() {
    setRenameModal({ open: false, oldId: '', id: '', title: '' });
  }

  async function confirmRenameQuiz() {
    if (!renameModal.oldId) return;
    const trimmedTitle = (renameModal.title || '').trim();
    const trimmedId = slugifyQuizName(trimmedTitle) || renameModal.oldId;
    if (!trimmedTitle) {
      showToast('题库名称不能为空。');
      return;
    }
    setRenameBusy(true);
    try {
      tts.stop();
      const result = await renameQuiz(renameModal.oldId, {
        id: trimmedId,
        title: trimmedTitle
      });
      if (result.renamed && result.id !== renameModal.oldId) {
        setProgressByQuiz((prev) => {
          const next = { ...prev, [result.id]: prev[renameModal.oldId] };
          delete next[renameModal.oldId];
          return next;
        });
      }
      closeRenameModal();
      const payload = await fetchQuizzes();
      setQuizzes(payload.quizzes || []);
      // Reload the active quiz under its (possibly new) id.
      setActiveQuizId('');
      await selectQuiz(result.id);
      showToast('题库已重命名。');
    } catch (err) {
      showToast(err?.message || '无法重命名题库。');
    } finally {
      setRenameBusy(false);
    }
  }

  // ----- Per-question delete -----

  function askDeleteQuestion(question, index) {
    if (!question) return;
    setQuestionDeleteConfirm({
      questionId: question.id,
      questionNumber: index + 1,
      preview: (question.question || '').slice(0, 140)
    });
  }

  function cancelDeleteQuestion() {
    setQuestionDeleteConfirm(null);
  }

  async function confirmDeleteQuestion() {
    if (!questionDeleteConfirm || !activeQuizId) return;
    setQuestionDeleteBusy(true);
    try {
      await deleteQuestion(activeQuizId, questionDeleteConfirm.questionId);
      // Remove the locally-saved answer for this question id.
      const nextState = removeAnswerFromState(quizState, questionDeleteConfirm.questionId);
      setQuizStateRaw(nextState);
      rememberProgress(activeQuizId, nextState);
      saveQuizProgress(activeQuizId, nextState).catch(() => {
        showToast('进度保存失败。');
      });
      // Refetch the quiz so order, counts, and current index are correct.
      const payload = await fetchQuiz(activeQuizId);
      setQuiz(payload);
      // Try to land on the same slot the user was looking at, or last question.
      const targetIndex = Math.min(
        Math.max(nextState.currentIndex ?? 0, 0),
        Math.max(payload.questions.length - 1, 0)
      );
      setQuizState({ ...nextState, currentIndex: targetIndex });
      // Refresh the sidebar count metadata.
      const list = await fetchQuizzes();
      setQuizzes(list.quizzes || []);
      setQuestionDeleteConfirm(null);
      showToast('题目已删除。');
    } catch (err) {
      showToast(err?.message || '无法删除这道题。');
    } finally {
      setQuestionDeleteBusy(false);
    }
  }

  // ----- Core Takeaway editor -----

  function applyTakeawayCommand(command, value) {
    const node = takeawayRef.current;
    if (!node || !currentQuestion) return;
    node.focus();
    try {
      document.execCommand(command, false, value);
    } catch (_) {
      /* execCommand is deprecated but still works in Chromium/Electron */
    }
    // Sync state after execCommand mutated the DOM.
    setTakeawayHtml(node.innerHTML);
    scheduleTakeawaySave(node.innerHTML);
  }

  function handleTakeawayInput(event) {
    if (!currentQuestion) return;
    const html = event.currentTarget.innerHTML;
    setTakeawayHtml(html);
    scheduleTakeawaySave(html);
  }

  function scheduleTakeawaySave(html) {
    if (!activeQuizId || !currentQuestion) return;
    const questionId = currentQuestion.id;
    setTakeawayStatus('saving');
    if (takeawayTimerRef.current) window.clearTimeout(takeawayTimerRef.current);
    takeawayTimerRef.current = window.setTimeout(() => {
      saveTakeaway(activeQuizId, questionId, html)
        .then((record) => {
          setTakeawayByQuestion(record?.perQuestion || {});
          setTakeawayStatus('saved');
        })
        .catch(() => setTakeawayStatus('error'));
    }, 600);
  }

  function exportTakeaway() {
    if (!quiz) return;
    if (!isComplete) {
      showToast('完成全部题目后才能导出笔记合集。');
      return;
    }
    if (Object.keys(takeawayByQuestion).length === 0) {
      showToast('还没有可导出的笔记。');
      return;
    }
    // Notes-only export: just the takeaway HTML per question, with a tiny
    // "第 N 题 · 分类" header for navigation. No question text — the user
    // explicitly wants this to be just 大浪淘沙 after 大浪淘沙 of notes.
    const sections = questions
      .map((question, index) => {
        const html = takeawayByQuestion[question.id];
        if (!html) return '';
        const label = `第 ${index + 1} 题 · ${escapeHtml(question.category || question.skill || '')}`;
        return `<section><h2>${label}</h2>${html}</section>`;
      })
      .filter(Boolean)
      .join('\n');
    const doc = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" />
<title>${escapeHtml(quiz.title || activeQuizId)} · 核心笔记</title>
<style>
  body { font: 15px/1.65 -apple-system, system-ui, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif; max-width: 720px; margin: 28px auto; color: #222; padding: 0 18px; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  .meta { color: #687386; font-size: 12px; margin-bottom: 22px; }
  section { padding: 12px 0; border-top: 1px solid #e3e8ee; }
  section:first-of-type { border-top: 0; padding-top: 0; }
  section h2 { font-size: 12.5px; color: #687386; margin: 0 0 6px; font-weight: 700; letter-spacing: 0.02em; }
  p { margin: 4px 0; }
</style></head>
<body>
<h1>${escapeHtml(quiz.title || activeQuizId)} · 核心笔记</h1>
<p class="meta">${Object.keys(takeawayByQuestion).length} 条笔记 · 导出于 ${new Date().toLocaleString()}</p>
${sections}
</body></html>`;
    downloadText(`${activeQuizId}-takeaways.html`, doc, 'text/html');
  }

  function flushTakeawaySave() {
    if (!activeQuizId || !currentQuestion) return Promise.resolve();
    if (takeawayTimerRef.current) {
      window.clearTimeout(takeawayTimerRef.current);
      takeawayTimerRef.current = null;
    }
    const node = takeawayRef.current;
    const html = node ? node.innerHTML : takeawayHtml;
    const questionId = currentQuestion.id;
    setTakeawayStatus('saving');
    return saveTakeaway(activeQuizId, questionId, html)
      .then((record) => {
        setTakeawayByQuestion(record?.perQuestion || {});
        setTakeawayStatus('saved');
      })
      .catch(() => setTakeawayStatus('error'));
  }

  // Load takeaway whenever the active quiz changes.
  useEffect(() => {
    if (!activeQuizId) return;
    if (takeawayLoadedForRef.current === activeQuizId) return;
    takeawayLoadedForRef.current = activeQuizId;
    setTakeawayStatus('idle');
    fetchTakeaway(activeQuizId)
      .then((data) => {
        setTakeawayByQuestion(data?.perQuestion || {});
      })
      .catch(() => {
        setTakeawayByQuestion({});
      });
  }, [activeQuizId]);

  useEffect(() => {
    // Only render takeaway content once the question has been answered;
    // before that the editor stays empty and locked.
    const html =
      currentQuestion && currentAnswer
        ? takeawayByQuestion[currentQuestion.id] ||
        defaultTakeawayHtml(currentQuestion, currentAnswer)
        : '';
    setTakeawayHtml(html);
    if (takeawayRef.current && takeawayRef.current.innerHTML !== html) {
      takeawayRef.current.innerHTML = html;
    }
    setTakeawayStatus('idle');
    // rightTab is in deps so the editor re-fills when we switch back to 笔记;
    // the contentEditable div is unmounted while the AI tab is showing.
  }, [currentQuestion, currentAnswer, takeawayByQuestion, rightTab]);

  useEffect(() => {
    return () => {
      if (takeawayTimerRef.current) window.clearTimeout(takeawayTimerRef.current);
    };
  }, []);

  // ----- Speak helpers (per-question + per-explanation) -----

  function speakQuestion() {
    if (!currentQuestion) return;
    if (!voiceReady) {
      showToast('语音还在加载，请稍后再试。');
      return;
    }
    if (!currentAnswer) {
      // Speak is only allowed once the student has answered — then we read
      // the reading passage (if any) plus the full sentence with the correct
      // answer plugged in, so the audio matches what the eye sees.
      showToast('先完成作答后才能朗读。');
      return;
    }
    const key = `q-${currentQuestion.id}`;
    if (tts.playing.kind === 'question' && tts.playing.key === key) {
      tts.stop();
      return;
    }
    const text = speechForCurrentQuestion(currentQuestion, currentAnswer);
    if (!text) return;
    tts
      .playText({ text, quizId: activeQuizId, kind: 'question', key })
      .catch((err) => {
        if (isTtsCancelled(err)) return;
        showToast(err?.message || '朗读失败。');
      });
  }

  function speakExplanation() {
    if (!currentAnswer?.explanation) return;
    if (!voiceReady) {
      showToast('语音还在加载，请稍后再试。');
      return;
    }
    const key = `e-${currentQuestion?.id}`;
    if (tts.playing.kind === 'explanation' && tts.playing.key === key) {
      tts.stop();
      return;
    }
    tts
      .playText({
        text: currentAnswer.explanation,
        quizId: activeQuizId,
        kind: 'explanation',
        key
      })
      .catch((err) => {
        if (isTtsCancelled(err)) return;
        showToast(err?.message || '朗读失败。');
      });
  }

  // ----- Read-All (1..N complete sentences with correct answers) -----

  async function startReadAll() {
    if (!isComplete) {
      showToast('完成全部题目后才能全部朗读。');
      return;
    }
    if (!voiceReady) {
      showToast('语音还在加载，请稍后再试。');
      return;
    }
    if (readAllProgress.active) {
      stopReadAll();
      return;
    }
    readAllCancelRef.current = false;
    const total = questions.length;
    setWrongOnly(false);
    setFinalMode(false);
    setReadAllProgress({ active: true, index: 0, total });
    let previousReading = '';
    for (let i = 0; i < total; i += 1) {
      if (readAllCancelRef.current) break;
      setCurrentQuestionIndex(i, { persist: false });
      const question = questions[i];
      const answer = answers[question.id];
      const baseSentence = completeSentenceForAnswer(question, answer);
      if (!baseSentence) continue;
      const reading = (question.reading || '').trim();
      // Read the passage only when it changes from the previous question so we
      // don't re-read the same passage 5 times in a reading-block.
      const sentence =
        reading && reading !== previousReading
          ? `${reading}. ... ${baseSentence}`.replace(/\s{2,}/g, ' ').trim()
          : baseSentence;
      previousReading = reading;
      setReadAllProgress({ active: true, index: i + 1, total });
      try {
        await tts.playText({
          text: sentence,
          quizId: activeQuizId,
          kind: 'readAll',
          key: `r-${question.id}`
        });
      } catch (err) {
        if (readAllCancelRef.current || isTtsCancelled(err)) break;
        showToast(err?.message || '全部朗读已暂停。');
        break;
      }
      // Tiny breath between sentences.
      await new Promise((resolve) => setTimeout(resolve, 220));
    }
    setReadAllProgress({ active: false, index: 0, total: 0 });
  }

  function stopReadAll() {
    readAllCancelRef.current = true;
    tts.stop();
    setReadAllProgress({ active: false, index: 0, total: 0 });
  }

  // ----- Prompt generator + import -----

  function togglePromptType(type) {
    setPromptForm((prev) => {
      const has = prev.types.includes(type);
      const next = has
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type];
      return { ...prev, types: next.length ? next : prev.types };
    });
  }

  function copyPromptToClipboard() {
    const text = buildPromptText(promptForm);
    copyText(text, '提示词已复制，可粘贴到 AI 中生成 JSON。');
  }

  function copySingleMistakePrompt() {
    if (!currentQuestion || !currentAnswer || currentAnswer.correct) {
      showToast('当前题不是错题，无法生成专项练习。');
      return;
    }
    const text = buildSingleMistakePrompt({
      question: currentQuestion,
      answer: currentAnswer,
      audience: promptForm.audience,
      grade: promptForm.grade,
      level: promptForm.level
    });
    copyText(text, '本题专项练习提示词已复制，粘贴给 AI 即可生成 5 道类似题。');
  }

  function copyFullDrillPrompt() {
    if (!isComplete) {
      showToast('完成全部题目后才能生成错题刻意练习。');
      return;
    }
    if (!mistakeItems.length) {
      showToast('本套题目没有错题，无需刻意练习。');
      return;
    }
    const slimMistakes = mistakeItems.map(({ question, index, answer }) =>
      slimRecord(question, index, answer)
    );
    const text = buildFullDrillPrompt({
      slimMistakes,
      weakSkills: focusRows.map((row) => ({ skill: row.name, wrong: row.wrong })),
      audience: promptForm.audience,
      grade: promptForm.grade,
      level: promptForm.level,
      count: 50
    });
    copyText(text, '50 题刻意练习提示词已复制（含错题数据），粘贴给 AI 即可生成专项强化题。');
  }

  function copyCurrentItemAsJson() {
    if (!currentQuestion) {
      showToast('当前没有题目。');
      return;
    }
    if (!currentAnswer) {
      showToast('先作答后才能复制本题数据。');
      return;
    }
    const pack = buildSlimPack([slimRecord(currentQuestion, currentIndex, currentAnswer)], 'single');
    copyText(JSON.stringify(pack, null, 2), '本题数据已复制（精简版）。');
  }

  function copyAllMistakesAsJson() {
    if (!isComplete) {
      showToast('完成全部题目后才能复制所有错题。');
      return;
    }
    if (!mistakeItems.length) {
      showToast('本套题目没有错题。');
      return;
    }
    copyText(JSON.stringify(buildMistakePack(), null, 2), '所有错题已复制（精简版）。');
  }

  function copyAllQuestionsAsJson() {
    if (!isComplete) {
      showToast('完成全部题目后才能复制全部题目。');
      return;
    }
    copyText(JSON.stringify(buildAllQuestionsPack(), null, 2), '全套题目已复制（精简版）。');
  }

  function openImport() {
    setImportText('');
    setImportOpen(true);
  }

  function closeImport() {
    setImportText('');
    setImportOpen(false);
  }

  async function submitImport() {
    if (!importText.trim()) {
      showToast('请先粘贴 AI 生成的 JSON。');
      return;
    }
    const extracted = extractJsonObject(importText);
    if (!extracted) {
      showToast('没找到完整的 JSON 对象，请检查粘贴的内容是否包含 { ... }。');
      return;
    }
    let parsed;
    try {
      parsed = JSON.parse(extracted);
    } catch (err) {
      showToast(`JSON 解析失败：${err?.message || '请检查格式'}。`);
      return;
    }
    setImportBusy(true);
    try {
      const result = await importQuiz(parsed);
      showToast(`已导入“${result.title}” — ${result.questionCount} 题。`);
      setImportOpen(false);
      setImportText('');
      await refreshQuizList({ preferId: result.id });
    } catch (err) {
      showToast(err?.message || '导入失败。');
    } finally {
      setImportBusy(false);
    }
  }

  function finishAttempt() {
    if (!isComplete) {
      const index = firstUnansweredIndex();
      showToast(`第 ${index + 1} 题还需要作答。`);
      jumpTo(index);
      return;
    }

    const attemptId =
      quizState.savedAttemptId || `${activeQuizId}-${Date.now()}`;
    const finishedAt = quizState.finishedAt || new Date().toISOString();
    const nextState = {
      ...quizState,
      finishedAt,
      savedAttemptId: attemptId
    };
    setQuizState(nextState);

    setFinalMode(true);
    setWrongOnly(false);
    scrollExerciseTop();
  }

  // Minimal per-question record we hand to the user / paste into AI.
  // Only the four things the user asked for: 题干、正确答案、学生答案、题型/分类.
  function slimRecord(question, index, answer) {
    return {
      n: index + 1,
      domain: questionDomain(question),
      category: question.category || question.skill || 'General',
      type: question.type,
      question: question.question,
      correctAnswer: answer?.correctText ?? null,
      studentAnswer: answer?.answerText ?? null,
      isCorrect: answer ? Boolean(answer.correct) : null
    };
  }

  function buildSlimPack(items, label) {
    return {
      quizId: activeQuizId,
      quizTitle: quiz?.title,
      kind: label,
      generatedAt: new Date().toISOString(),
      weakSkills: focusRows.map((row) => ({ skill: row.name, wrong: row.wrong })),
      items
    };
  }

  function buildMistakePack() {
    // Slim version used by the deliberate-practice prompt + "复制所有错题".
    return buildSlimPack(
      mistakeItems.map(({ question, index, answer }) => slimRecord(question, index, answer)),
      'mistakes'
    );
  }

  function buildAllQuestionsPack() {
    return buildSlimPack(
      questions.map((question, index) =>
        slimRecord(question, index, answers[question.id])
      ),
      'all-questions'
    );
  }

  function exportMistakes(kind) {
    if (!mistakeItems.length) {
      showToast('没有可导出的错题。');
      return;
    }
    const pack = buildMistakePack();
    if (kind === 'copy') {
      copyText(JSON.stringify(pack, null, 2), '错题 JSON 已复制。');
      return;
    }
    downloadText(
      `${activeQuizId}-mistakes.json`,
      JSON.stringify(pack, null, 2),
      'application/json'
    );
  }

  function copyText(text, successMessage) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(
        () => showToast(successMessage),
        () => fallbackCopy(text, successMessage)
      );
    } else {
      fallbackCopy(text, successMessage);
    }
  }

  function fallbackCopy(text, successMessage) {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.left = '-9999px';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    document.body.removeChild(area);
    showToast(successMessage);
  }

  function downloadText(filename, text, type) {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('文件已下载。');
  }

  function dotClassName(question, index) {
    const answer = answers[question.id];
    return cx(
      'question-dot',
      !finalMode && index === currentIndex && 'is-current',
      answer?.correct === true && 'is-correct',
      answer?.correct === false && 'is-wrong',
      wrongOnly && answer?.correct !== false && 'is-muted'
    );
  }

  // Renders the inline speak buttons used inside the question card.
  function SpeakButton({ kind, busyKey, ariaLabel, onClick, disabled, label, title }) {
    const isActive = tts.playing.kind === kind && tts.playing.key === busyKey;
    const isLoading = tts.loading.kind === kind && tts.loading.key === busyKey;
    return (
      <button
        className={cx('speak-button', isActive && 'is-active')}
        type="button"
        aria-label={ariaLabel}
        title={title}
        disabled={disabled || !voiceReady}
        onClick={onClick}
      >
        {isLoading ? (
          <Loader2 className="spin" size={16} />
        ) : isActive ? (
          <Square size={16} />
        ) : (
          <Volume2 size={16} />
        )}
        {label && <span>{label}</span>}
      </button>
    );
  }

  return (
    <div
      className={cx(
        'aip-root',
        sidebarCollapsed && 'sidebar-is-collapsed',
        contactCardOpen && !sidebarCollapsed && 'contact-card-is-open'
      )}
    >
      <aside className={cx('sidebar', sidebarCollapsed && 'is-collapsed')}>
        <div className="sidebar-top">
          {!sidebarCollapsed && (
            <button
              type="button"
              className="brand-block"
              title="回到首页"
              aria-label="回到首页"
              onClick={goHome}
            >
              <div className="brand-mark">
                <BookOpen size={26} />
              </div>
              <div className="brand-text">
                <p className="eyebrow">留学大佬出品</p>
                <h2>AI Practice</h2>
              </div>
            </button>
          )}
          <button
            className="sidebar-toggle"
            type="button"
            onClick={() => setSidebarCollapsed((value) => !value)}
            title={sidebarCollapsed ? '展开左侧导航' : '收起左侧导航'}
            aria-label={sidebarCollapsed ? '展开左侧导航' : '收起左侧导航'}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
          </button>
        </div>

        <div className="sidebar-note">
          <Target size={18} />
          <span>
            已加载 {quizzes.length} 套题
          </span>
        </div>

        <div className="quiz-nav">
          {quizzes.map((item, index) => {
            const status = navStatus(item);
            return (
              <div key={item.id} className="quiz-tab-wrap">
                <button
                  className={cx(
                    'quiz-tab',
                    item.id === activeQuizId && 'is-active',
                    status.complete && 'is-complete',
                    !status.complete && status.answered > 0 && 'is-in-progress'
                  )}
                  title={item.title}
                  type="button"
                  onClick={() => selectQuiz(item.id)}
                >
                  {sidebarCollapsed ? (
                    <span className="quiz-tab-number">
                      {index + 1}
                      {status.complete && (
                        <Check className="quiz-tab-check" size={13} strokeWidth={3} />
                      )}
                    </span>
                  ) : (
                    <>
                      <span className="quiz-tab-title-row">
                        <span className="quiz-tab-title">{item.title}</span>
                        {status.complete && (
                          <span className="quiz-tab-status">
                            <Check size={13} strokeWidth={3} />
                            {status.score}%
                          </span>
                        )}
                      </span>
                      <span className="quiz-tab-meta">{navMeta(item)}</span>
                    </>
                  )}
                </button>
                {!sidebarCollapsed && (
                  <button
                    className="quiz-tab-edit"
                    type="button"
                    title="重命名题库"
                    aria-label="重命名题库"
                    onClick={(event) => {
                      event.stopPropagation();
                      if (item.id !== activeQuizId) {
                        selectQuiz(item.id).then(() => {
                          setRenameModal({
                            open: true,
                            oldId: item.id,
                            id: item.id,
                            title: item.title
                          });
                        });
                      } else {
                        openRenameModal();
                      }
                    }}
                  >
                    <Pencil size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {!sidebarCollapsed && contactCardOpen && (
        <aside className="wechat-card" aria-label="联系作者微信二维码">
          <button
            className="wechat-close"
            type="button"
            aria-label="关闭微信二维码"
            title="关闭"
            onClick={() => setContactCardOpen(false)}
          >
            <X size={15} />
          </button>
          <div>
            <strong>联系作者: 留学大佬</strong>
          </div>
          <img src={wechatQr} alt="联系作者的微信二维码" />
        </aside>
      )}

      <main className="main-stage">
        {loading ? (
          <div className="loading-state">
            <Loader2 className="spin" size={30} />
            <span>正在加载题库</span>
          </div>
        ) : error ? (
          <div className="empty-state">
            <X size={34} />
            <h2>{error}</h2>
          </div>
        ) : quiz ? (
          <>
            <div
              className={cx(
                'workspace',
                loadingQuiz && 'is-loading',
                insightsCollapsed && 'insights-is-collapsed'
              )}
            >
              <section className="exercise-panel">
                <header className="top-strip">
                  <div className="quiz-identity">
                    <span className="mini-meta">
                      {quiz.level} · {quiz.questionCount} 题
                    </span>
                    <strong className="top-title">{quiz.title}</strong>
                    <span className="top-subtitle">{quiz.subtitle}</span>
                  </div>
                  <div className="top-actions">
                    <button
                      className={cx('tool-button', wrongOnly && 'is-on')}
                      disabled={wrongQuestionIndices.length === 0}
                      type="button"
                      onClick={toggleWrongOnly}
                      title={wrongOnly ? '退出错题模式' : '只看错题进行复习'}
                    >
                      <Filter size={18} />
                      <span>只看错题</span>
                    </button>
                    <button
                      className={cx('tool-button', readAllProgress.active && 'is-on')}
                      type="button"
                      disabled={!isComplete || !voiceReady}
                      onClick={startReadAll}
                      title={
                        isComplete
                          ? '逐题朗读题目和正确答案'
                          : '完成题库后解锁全部朗读'
                      }
                    >
                      {readAllProgress.active ? <Square size={18} /> : <Headphones size={18} />}
                      <span>
                        {readAllProgress.active
                          ? `停止 (${readAllProgress.index}/${readAllProgress.total})`
                          : '全部朗读'}
                      </span>
                    </button>
                  </div>
                </header>
                <div className="progress-card">
                  <div className="progress-head">
                    <div className="progress-line">
                      <span className="progress-label">
                        {finalMode
                          ? '已完成'
                          : currentIndex === -1
                            ? '开始'
                            : `第 ${currentIndex + 1} / ${totalQuestions} 题`}
                      </span>
                      <span className="result-chip is-good" title="本次正确题数">
                        正确 {correctCount}
                      </span>
                      <span className="result-chip is-bad" title="本次错误题数">
                        错误 {wrongCount}
                      </span>
                    </div>
                    <span className="score-pill" title="题目完成进度">
                      完成进度 {Math.round(progressPercent)}%
                    </span>
                  </div>
                  {(() => {
                    const sliderPct =
                      totalQuestions > 0
                        ? Math.max(0, Math.min(100, ((currentIndex + 1) / totalQuestions) * 100))
                        : 0;
                    const atIntro = currentIndex === -1;
                    const atLast = totalQuestions > 0 && currentIndex === totalQuestions - 1;
                    // Hide the floating bubble when it would overlap one of the
                    // end-pills — otherwise we get an ugly "0 0" / "50 50".
                    const showThumb = !atIntro && !atLast && totalQuestions > 0;
                    const thumbLabel = `${currentIndex + 1}`;
                    return (
                      <div
                        className="merged-slider"
                        style={{
                          '--cs-slider-pct': `${sliderPct}%`,
                          '--cs-progress-pct': `${progressPercent}%`
                        }}
                      >
                        <button
                          className={cx('slider-end', atIntro && 'is-on')}
                          type="button"
                          onClick={() => jumpTo(-1)}
                          title="回到开始页"
                          aria-label="跳到开始页"
                        >
                          0
                        </button>
                        <div className="merged-track">
                          <input
                            className="question-slider"
                            type="range"
                            min={-1}
                            max={Math.max(totalQuestions - 1, 0)}
                            step={1}
                            value={currentIndex}
                            onChange={(e) => jumpTo(Number(e.target.value))}
                            disabled={totalQuestions === 0}
                            aria-label="拖动滑块切换题目"
                            title="拖动定位到指定题目"
                          />
                          {showThumb && (
                            <span
                              className="merged-thumb-bubble"
                              aria-hidden="true"
                              style={{ left: `${sliderPct}%` }}
                            >
                              {thumbLabel}
                            </span>
                          )}
                        </div>
                        <button
                          className={cx('slider-end', atLast && 'is-on')}
                          type="button"
                          onClick={() => jumpTo(Math.max(totalQuestions - 1, 0))}
                          title="跳到最后一题"
                          aria-label="跳到最后一题"
                          disabled={totalQuestions === 0}
                        >
                          {totalQuestions}
                        </button>
                      </div>
                    );
                  })()}
                </div>

                {finalMode ? (
                  (() => {
                    // Tiered feedback so the celebration feels earned.
                    const tier =
                      scorePercent >= 90
                        ? {
                            emoji: '🏆',
                            badge: '满分级表现',
                            headline: '太厉害了！',
                            message:
                              '基础非常扎实，错题极少。可以挑战更高难度的题目，或换个新主题继续拓展。',
                            tone: 'is-gold'
                          }
                        : scorePercent >= 70
                          ? {
                              emoji: '🎉',
                              badge: '表现优秀',
                              headline: '做得很好！',
                              message:
                                '大部分知识点已经掌握，把剩下的错题再过一遍，并对薄弱环节做一组刻意练习，就能稳步提升到精通水平。',
                              tone: 'is-green'
                            }
                          : scorePercent >= 50
                            ? {
                                emoji: '💪',
                                badge: '稳步进步中',
                                headline: '有进步空间！',
                                message:
                                  '基础已经搭起来了，但错题里集中着关键考点。建议先用「本题强化练习」逐题攻克，再做一次 50 题刻意练习巩固。',
                                tone: 'is-blue'
                              }
                            : {
                                emoji: '🌱',
                                badge: '别气馁',
                                headline: '继续努力！',
                                message:
                                  '错题里就藏着进步空间。可以先把笔记里的考点过一遍，再用 AI 刻意练习对薄弱环节针对性强化，效果立竿见影。',
                                tone: 'is-warm'
                              };
                    return (
                      <section className={cx('final-card', 'is-celebrate', tier.tone)}>
                        <div className="final-celebrate">
                          <span className="final-emoji" aria-hidden="true">
                            {tier.emoji}
                          </span>
                          <div className="final-celebrate-text">
                            <p className="eyebrow">{tier.badge}</p>
                            <h2>{tier.headline}</h2>
                            <p className="final-score-line">
                              <strong>{correctCount}</strong>
                              <span> / {totalQuestions} 正确 ·</span>
                              <strong> {scorePercent}%</strong>
                            </p>
                          </div>
                          <Award size={48} className="final-trophy" />
                        </div>

                        <p className="final-message">{tier.message}</p>

                        <div className="summary-grid">
                          <div>
                            <span>正确</span>
                            <strong>{correctCount}</strong>
                          </div>
                          <div>
                            <span>错误</span>
                            <strong>{wrongCount}</strong>
                          </div>
                          <div>
                            <span>正确率</span>
                            <strong>{scorePercent}%</strong>
                          </div>
                          <div>
                            <span>薄弱领域</span>
                            <strong>{focusRows.length}</strong>
                          </div>
                        </div>

                        {focusRows.length > 0 && (
                          <div className="final-focus">
                            <p className="final-focus-title">
                              <Brain size={16} />
                              <span>需要加强的方向</span>
                            </p>
                            <ul>
                              {focusRows.slice(0, 5).map((row) => (
                                <li key={row.name}>
                                  <strong>{row.name}</strong>
                                  <span>错 {row.wrong} 题</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="final-next">
                          <p className="final-next-title">接下来可以做的：</p>
                          <div className="final-next-grid">
                            <button
                              className="final-next-action"
                              type="button"
                              disabled={!voiceReady}
                              onClick={startReadAll}
                              title="逐题朗读题目和正确答案"
                            >
                              <Headphones size={18} />
                              <div>
                                <strong>全部朗读</strong>
                                <span>把 {totalQuestions} 道题连同正确答案再听一遍</span>
                              </div>
                            </button>
                            <button
                              className="final-next-action"
                              type="button"
                              disabled={mistakeItems.length === 0}
                              onClick={() => {
                                setRightTab('ai');
                                setInsightsCollapsed(false);
                                copyFullDrillPrompt();
                              }}
                              title="复制提示词，让 AI 出 50 道针对错题的刻意练习"
                            >
                              <Brain size={18} />
                              <div>
                                <strong>错题刻意练习</strong>
                                <span>
                                  {mistakeItems.length
                                    ? `基于 ${mistakeItems.length} 道错题生成 50 题新练习`
                                    : '本套题没有错题'}
                                </span>
                              </div>
                            </button>
                            <button
                              className="final-next-action"
                              type="button"
                              disabled={Object.keys(takeawayByQuestion).length === 0}
                              onClick={exportTakeaway}
                              title="导出本套题的全部核心笔记"
                            >
                              <StickyNote size={18} />
                              <div>
                                <strong>导出笔记</strong>
                                <span>
                                  把 {Object.keys(takeawayByQuestion).length} 条笔记打包成 HTML
                                </span>
                              </div>
                            </button>
                            <button
                              className="final-next-action"
                              type="button"
                              disabled={!mistakeItems.length}
                              onClick={() => exportMistakes('json')}
                              title="把错题导出为 JSON 文件"
                            >
                              <FileJson size={18} />
                              <div>
                                <strong>导出错题</strong>
                                <span>
                                  {mistakeItems.length
                                    ? `${mistakeItems.length} 道错题精简数据`
                                    : '本套题没有错题'}
                                </span>
                              </div>
                            </button>
                            <button
                              className="final-next-action"
                              type="button"
                              onClick={() => jumpTo(0)}
                              title="回到第一题，逐题复盘"
                            >
                              <ChevronLeft size={18} />
                              <div>
                                <strong>逐题复盘</strong>
                                <span>从第 1 题开始，逐题查看解析与笔记</span>
                              </div>
                            </button>
                            <button
                              className="final-next-action"
                              type="button"
                              onClick={openRestartModal}
                              title="清空进度重做这套题（需家长密码）"
                            >
                              <RefreshCcw size={18} />
                              <div>
                                <strong>重做这套题</strong>
                                <span>清空进度，重新挑战一次</span>
                              </div>
                            </button>
                          </div>
                        </div>
                      </section>
                    );
                  })()
                ) : currentIndex === -1 ? (
                  <section className="intro-card">
                    <div className="intro-hero">
                      <div className="intro-kicker">
                        <span>AI POWERED PRACTICE</span>
                        <span>{quiz.level}</span>
                      </div>
                      <h2>{quiz.title}</h2>
                      <p>{quiz.subtitle}</p>
                      <div className="intro-actions">
                        <button
                          className="intro-go-button"
                          type="button"
                          onClick={startQuizFromIntro}
                          title="开始这套题（从第一道未做题开始）"
                        >
                          <span>开始练习</span>
                          <ChevronRight size={22} />
                        </button>
                      </div>
                    </div>

                    <div className="intro-stats">
                      <div>
                        <span>已做</span>
                        <strong>{answeredCount}</strong>
                      </div>
                      <div>
                        <span>正确</span>
                        <strong>{correctCount}</strong>
                      </div>
                      <div>
                        <span>级别</span>
                        <strong>{quiz.level}</strong>
                      </div>
                    </div>
                  </section>
                ) : currentQuestion ? (
                  <article className="question-card">
                    {currentQuestion.reading && (
                      <div className="reading-box">{currentQuestion.reading}</div>
                    )}

                    <div className="question-text-row">
                      <h3 className="question-text">{currentQuestion.question}</h3>
                      <div className="question-text-actions">
                        <SpeakButton
                          kind="question"
                          busyKey={`q-${currentQuestion.id}`}
                          ariaLabel={
                            currentAnswer
                              ? '朗读含正确答案的完整句子'
                              : '作答后解锁朗读'
                          }
                          onClick={speakQuestion}
                          disabled={!currentAnswer}
                          title={
                            currentAnswer
                              ? '朗读完整句子（含阅读材料）'
                              : '作答后解锁朗读'
                          }
                        />
                        <button
                          className="question-delete-button"
                          type="button"
                          aria-label="删除这道题"
                          title="删除这道题"
                          onClick={() => askDeleteQuestion(currentQuestion, currentIndex)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {currentQuestion.type === 'mc' ? (
                      <div className={cx('answer-options', optionGridClass)}>
                        {currentQuestion.options.map((option, index) => (
                          <button
                            key={`${index}-${option}`}
                            className={cx('answer-option', optionClasses(index))}
                            disabled={Boolean(currentAnswer) || submitting}
                            type="button"
                            onClick={() => answerMultipleChoice(index)}
                          >
                            <span className="answer-marker">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span>{option}</span>
                          </button>
                        ))}
                      </div>
                    ) : currentQuestion.type === 'fill' ? (
                      <div className="fill-answer">
                        <input
                          value={fillAnswer}
                          onChange={(e) => setFillAnswer(e.target.value)}
                          className={cx(
                            'fill-input',
                            currentAnswer
                              ? currentAnswer.correct
                                ? 'is-correct'
                                : 'is-wrong'
                              : ''
                          )}
                          disabled={Boolean(currentAnswer) || submitting}
                          autoComplete="off"
                          autoCapitalize="off"
                          spellCheck="false"
                          placeholder="在这里输入答案"
                          type="text"
                          onKeyUp={(e) => {
                            if (e.key === 'Enter') checkFillAnswer();
                          }}
                        />
                        <div className="inline-actions">
                          <button
                            className="primary-button"
                            disabled={Boolean(currentAnswer) || submitting}
                            type="button"
                            onClick={checkFillAnswer}
                            title="提交答案进行检查（也可按 Enter）"
                          >
                            <Check size={18} />
                            <span>检查</span>
                          </button>
                          <button
                            className="secondary-button"
                            disabled={Boolean(currentAnswer)}
                            type="button"
                            onClick={resetFillAnswer}
                            title="清空当前输入"
                          >
                            <RefreshCcw size={18} />
                            <span>清空</span>
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {currentAnswer && (
                      <div
                        className={cx(
                          'feedback-box',
                          currentAnswer.correct ? 'is-good' : 'is-bad'
                        )}
                      >
                        <div className="feedback-icon">
                          {currentAnswer.correct ? <Check size={22} /> : <X size={22} />}
                        </div>
                        <div className="feedback-body">
                          <div className="feedback-head">
                            <strong>
                              {currentAnswer.correct ? '回答正确' : '继续加油'}
                            </strong>
                            <SpeakButton
                              kind="explanation"
                              busyKey={`e-${currentQuestion.id}`}
                              ariaLabel="朗读解析"
                              onClick={speakExplanation}
                              label="朗读"
                              title="朗读这道题的解析"
                            />
                          </div>
                          <p>{currentAnswer.explanation}</p>
                          {!currentAnswer.correct && (
                            <p className="correct-line">
                              正确答案：<span>{currentAnswer.correctText}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="sticky-nav">
                      <button
                        className="secondary-button"
                        disabled={visibleIndices.indexOf(currentIndex) <= 0}
                        type="button"
                        onClick={goPrevious}
                        title="返回上一道题目"
                      >
                        <ChevronLeft size={18} />
                        <span>上一题</span>
                      </button>
                      <div className="nav-category">
                        <span className="category-pill">
                          <span className="category-icon">{currentQuestion.icon}</span>
                          {currentQuestion.category}
                        </span>
                      </div>
                      <button
                        className="primary-button"
                        disabled={
                          wrongOnly &&
                          visibleIndices.indexOf(currentIndex) === visibleIndices.length - 1
                        }
                        type="button"
                        onClick={goNext}
                        title="跳到下一道题目"
                      >
                        <span>{nextButtonText}</span>
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </article>
                ) : null}
              </section>

              <aside className={cx('insight-panel', insightsCollapsed && 'is-collapsed')}>
                <div className="insight-topbar">
                  <button
                    className="insight-toggle"
                    type="button"
                    onClick={() => setInsightsCollapsed((v) => !v)}
                    title={insightsCollapsed ? '展开右侧面板' : '收起右侧面板'}
                    aria-label={insightsCollapsed ? '展开右侧面板' : '收起右侧面板'}
                  >
                    {insightsCollapsed ? (
                      <PanelRightOpen size={19} />
                    ) : (
                      <PanelRightClose size={19} />
                    )}
                  </button>
                  {!insightsCollapsed && (
                    <div className="insight-actions">
                      <button
                        className={cx('tool-button', 'danger-tool')}
                        type="button"
                        onClick={openDeleteModal}
                        title="删除这套题和语音缓存"
                      >
                        <Trash2 size={18} />
                        <span>删除</span>
                      </button>
                      <button
                        className="tool-button"
                        type="button"
                        onClick={openRestartModal}
                        title="清空当前题库的进度（需家长密码）"
                      >
                        <RefreshCcw size={18} />
                        <span>重做</span>
                      </button>
                    </div>
                  )}
                </div>

                {insightsCollapsed && (
                  <div className="insight-rail" aria-label="右侧快捷入口">
                    <button
                      className="insight-rail-button"
                      type="button"
                      title="题目导航"
                      aria-label="打开题目导航"
                      onClick={() => jumpToInsightSection('map')}
                    >
                      <MapIcon size={18} />
                    </button>
                    <button
                      className="insight-rail-button"
                      type="button"
                      title="笔记"
                      aria-label="打开笔记"
                      onClick={() => jumpToInsightSection('takeaway')}
                    >
                      <StickyNote size={18} />
                    </button>
                    <button
                      className="insight-rail-button"
                      type="button"
                      title="技能地图"
                      aria-label="打开技能地图"
                      onClick={() => jumpToInsightSection('skill')}
                    >
                      <Brain size={18} />
                    </button>
                    <button
                      className="insight-rail-button"
                      type="button"
                      title="AI 智能练习"
                      aria-label="打开 AI 智能练习"
                      onClick={() => jumpToInsightSection('ai-prompt')}
                    >
                      <Sparkles size={18} />
                    </button>
                  </div>
                )}

                {!insightsCollapsed && (
                  <div className="insight-tabs" role="tablist" aria-label="右侧面板切换">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={rightTab === 'notes'}
                      className={cx('insight-tab', rightTab === 'notes' && 'is-active')}
                      onClick={() => setRightTab('notes')}
                      title="题目导航、核心笔记、技能分布"
                    >
                      <StickyNote size={15} />
                      <span>笔记</span>
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={rightTab === 'ai'}
                      className={cx('insight-tab', rightTab === 'ai' && 'is-active')}
                      onClick={() => setRightTab('ai')}
                      title="AI 定制练习 + AI 刻意练习"
                    >
                      <Sparkles size={15} />
                      <span>AI 智能练习</span>
                    </button>
                  </div>
                )}

                {!insightsCollapsed && rightTab === 'notes' && (
                  <div className="insight-scroll">
                    <section
                      ref={sectionMapRef}
                      className={cx('insight-card', 'question-map-card', questionMapExpanded && 'is-expanded')}
                    >
                      <div className="panel-title">
                        <MapIcon size={20} />
                        <h3>题目导航</h3>
                        <button
                          className="mini-toggle"
                          type="button"
                          onClick={() => setQuestionMapExpanded((v) => !v)}
                          title={questionMapExpanded ? '收起题目导航网格' : '展开题目导航网格'}
                        >
                          {questionMapExpanded ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                          <span>{questionMapExpanded ? '收起' : '展开'}</span>
                        </button>
                      </div>
                      {questionMapExpanded && (
                        <div className="question-dots">
                          {questions.map((question, index) => (
                            <button
                              key={question.id}
                              className={dotClassName(question, index)}
                              disabled={wrongOnly && answers[question.id]?.correct !== false}
                              type="button"
                              onClick={() => jumpTo(index)}
                            >
                              {index + 1}
                            </button>
                          ))}
                        </div>
                      )}
                    </section>

                    <section ref={sectionTakeawayRef} className="insight-card takeaway-card">
                      <div className="panel-title">
                        <StickyNote size={20} />
                        <h3>笔记（本题重难点）</h3>
                        <span className={cx('takeaway-status', `is-${takeawayStatus}`)}>
                          {takeawayStatus === 'saving'
                            ? '保存中…'
                            : takeawayStatus === 'saved'
                              ? '已保存'
                              : takeawayStatus === 'error'
                                ? '保存失败'
                                : ''}
                        </span>
                        <button
                          className="mini-toggle"
                          type="button"
                          onClick={exportTakeaway}
                          disabled={!isComplete || Object.keys(takeawayByQuestion).length === 0}
                          title={
                            isComplete
                              ? '导出本套题全部核心笔记（HTML，可打印 PDF）'
                              : '完成全部题目后才能导出笔记合集'
                          }
                          aria-label="导出全部核心笔记"
                        >
                          <Download size={14} />
                          <span>导出</span>
                        </button>
                      </div>
                      {currentAnswer ? (
                        <>
                          <div className="takeaway-toolbar">
                            <button
                              type="button"
                              className="takeaway-tool"
                              title="加粗选中文字"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => applyTakeawayCommand('bold')}
                            >
                              <Bold size={15} />
                            </button>
                            <span className="takeaway-divider" />
                            <button
                              type="button"
                              className="takeaway-tool color-swatch color-red"
                              title="红色"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => applyTakeawayCommand('foreColor', '#d94b54')}
                            >
                              <span />
                            </button>
                            <button
                              type="button"
                              className="takeaway-tool color-swatch color-blue"
                              title="蓝色"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => applyTakeawayCommand('foreColor', '#2f80d8')}
                            >
                              <span />
                            </button>
                            <button
                              type="button"
                              className="takeaway-tool color-swatch color-green"
                              title="绿色"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => applyTakeawayCommand('foreColor', '#25a46a')}
                            >
                              <span />
                            </button>
                            <button
                              type="button"
                              className="takeaway-tool color-swatch color-purple"
                              title="紫色"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => applyTakeawayCommand('foreColor', '#7b3fe4')}
                            >
                              <span />
                            </button>
                            <span className="takeaway-divider" />
                            <button
                              type="button"
                              className="takeaway-tool has-label"
                              title="清除格式"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => applyTakeawayCommand('removeFormat')}
                            >
                              <Eraser size={15} />
                              <span>清除</span>
                            </button>
                            <button
                              type="button"
                              className="takeaway-tool has-label"
                              title="立即保存当前笔记"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={flushTakeawaySave}
                              disabled={!currentQuestion}
                            >
                              <Save size={15} />
                              <span>保存</span>
                            </button>
                          </div>
                          <div
                            ref={takeawayRef}
                            className="takeaway-editor"
                            contentEditable
                            suppressContentEditableWarning
                            spellCheck="false"
                            onInput={handleTakeawayInput}
                            onBlur={flushTakeawaySave}
                            data-placeholder="作答后显示英文核心笔记，可按需修改。"
                          />
                        </>
                      ) : (
                        <div className="takeaway-locked">
                          <p>作答后才显示本题的笔记（考点）。</p>
                        </div>
                      )}
                    </section>

                    <section
                      ref={sectionSkillRef}
                      className={cx('insight-card', 'skill-card', skillMapExpanded && 'is-expanded')}
                    >
                      <div className="panel-title">
                        <Brain size={20} />
                        <h3>技能地图</h3>
                        <button
                          className="mini-toggle"
                          type="button"
                          onClick={() => setSkillMapExpanded((v) => !v)}
                          title={skillMapExpanded ? '只看主要项目' : '查看全部技能分布'}
                        >
                          {skillMapExpanded ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                          <span>{skillMapExpanded ? '收起' : '更多'}</span>
                        </button>
                      </div>
                      {(() => {
                        const totalSlices = skillRows.reduce((s, r) => s + r.total, 0);
                        if (!skillRows.length || !totalSlices) {
                          return (
                            <p className="quiet-line">还没有数据，开始作答后会自动统计。</p>
                          );
                        }
                        let startAngle = 0;
                        const slices = skillRows.map((row) => {
                          const portion = row.total / totalSlices;
                          const endAngle = startAngle + portion * 2 * Math.PI;
                          // Single-slice case: use a full circle path instead of an arc.
                          const path =
                            skillRows.length === 1
                              ? null
                              : describeSlice(110, 110, 96, startAngle, endAngle);
                          const slice = {
                            name: row.name,
                            total: row.total,
                            answered: row.answered,
                            wrong: row.wrong,
                            color: sliceColor(row.answered, row.wrong),
                            path,
                            portion
                          };
                          startAngle = endAngle;
                          return slice;
                        });
                        return (
                          <div className="skill-pie">
                            <svg
                              className="skill-pie-svg"
                              viewBox="0 0 220 220"
                              role="img"
                              aria-label="技能分布饼图"
                            >
                              {slices.length === 1 ? (
                                <circle
                                  cx="110"
                                  cy="110"
                                  r="96"
                                  fill={slices[0].color}
                                  stroke="white"
                                  strokeWidth="2"
                                >
                                  <title>
                                    {`${slices[0].name} · 已做 ${slices[0].answered}/${slices[0].total} · 错 ${slices[0].wrong}`}
                                  </title>
                                </circle>
                              ) : (
                                slices.map((slice) => (
                                  <path
                                    key={slice.name}
                                    d={slice.path}
                                    fill={slice.color}
                                    stroke="white"
                                    strokeWidth="2"
                                  >
                                    <title>
                                      {`${slice.name} · 已做 ${slice.answered}/${slice.total} · 错 ${slice.wrong}`}
                                    </title>
                                  </path>
                                ))
                              )}
                              <circle cx="110" cy="110" r="46" fill="white" />
                              <text
                                x="110"
                                y="106"
                                textAnchor="middle"
                                className="skill-pie-total"
                              >
                                {totalSlices}
                              </text>
                              <text
                                x="110"
                                y="124"
                                textAnchor="middle"
                                className="skill-pie-sub"
                              >
                                题
                              </text>
                            </svg>
                            <ul className="skill-legend">
                              {slices.map((slice) => {
                                const cats =
                                  slice.categories || [];
                                const visibleCats = skillMapExpanded
                                  ? cats
                                  : cats.slice(0, 2);
                                const hiddenCount = cats.length - visibleCats.length;
                                return (
                                  <li key={slice.name}>
                                    <span
                                      className="skill-legend-dot"
                                      style={{ background: slice.color }}
                                    />
                                    <div className="skill-legend-text">
                                      <strong>{slice.name}</strong>
                                      <span>
                                        已做 {slice.answered}/{slice.total} · 错 {slice.wrong}
                                      </span>
                                      {cats.length > 0 && (
                                        <ul className="skill-legend-cats">
                                          {visibleCats.map((cat) => (
                                            <li key={cat.name}>
                                              <span className="skill-legend-cat-name">
                                                {cat.name}
                                              </span>
                                              <span className="skill-legend-cat-meta">
                                                {cat.total} 题 · 错 {cat.wrong}
                                              </span>
                                            </li>
                                          ))}
                                          {hiddenCount > 0 && (
                                            <li className="skill-legend-cat-more">
                                              还有 {hiddenCount} 个子项 — 点击「更多」展开
                                            </li>
                                          )}
                                        </ul>
                                      )}
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        );
                      })()}
                    </section>
                  </div>
                )}

                {!insightsCollapsed && rightTab === 'ai' && (
                  <div className="insight-scroll">
                    <section ref={sectionAiRef} className="insight-card prompt-card">
                      <div className="panel-title">
                        <Sparkles size={20} />
                        <h3>AI 定制练习</h3>
                      </div>
                      <p className="quiet-line">
                        按对象、年级和主题，让 AI 帮你定制一套新题：复制提示词 → 粘到任意 AI → 把返回的 JSON 导回来即可练。
                      </p>
                      <div className="prompt-row">
                        <label className="prompt-field">
                          <span>对象</span>
                          <select
                            value={promptForm.audience}
                            onChange={(e) => {
                              const nextAudience = e.target.value;
                              const preset = audiencePresetByValue(nextAudience);
                              const nextGrade = preset.grades[0];
                              setPromptForm((prev) => ({
                                ...prev,
                                audience: nextAudience,
                                grade: nextGrade,
                                level: GRADE_LEVEL_HINTS[nextGrade] || prev.level
                              }));
                            }}
                            title="按学习阶段选择对象"
                          >
                            {AUDIENCE_PRESETS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="prompt-field">
                          <span>年级 / 阶段</span>
                          <select
                            value={promptForm.grade}
                            onChange={(e) => {
                              const nextGrade = e.target.value;
                              setPromptForm((prev) => ({
                                ...prev,
                                grade: nextGrade,
                                level: GRADE_LEVEL_HINTS[nextGrade] || prev.level
                              }));
                            }}
                            title="选择年级；会自动推荐合适的难度，可手动改"
                          >
                            {audiencePresetByValue(promptForm.audience).grades.map((grade) => (
                              <option key={grade} value={grade}>
                                {grade}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <div className="prompt-row">
                        <label className="prompt-field">
                          <span>难度（按年级自动推荐）</span>
                          <select
                            value={promptForm.level}
                            onChange={(e) =>
                              setPromptForm((prev) => ({ ...prev, level: e.target.value }))
                            }
                            title="按年级自动推荐，可改；不确定就选最后一项让 AI 自行判断"
                          >
                            {PROMPT_LEVELS.map((level) => (
                              <option key={level} value={level}>
                                {LEVEL_LABELS[level] || level}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="prompt-field">
                          <span>题数</span>
                          <input
                            type="number"
                            min={1}
                            max={100}
                            value={promptForm.count}
                            onChange={(e) =>
                              setPromptForm((prev) => ({
                                ...prev,
                                count: Math.max(1, Math.min(100, Number(e.target.value) || 30))
                              }))
                            }
                            title="生成多少道题（1-100）"
                          />
                        </label>

                      </div>
                      <label className="prompt-field">
                        <span>主题 / 重点</span>
                        <input
                          type="text"
                          value={promptForm.topic}
                          placeholder="如：过去时、食物词汇、IELTS 阅读"
                          onChange={(e) =>
                            setPromptForm((prev) => ({ ...prev, topic: e.target.value }))
                          }
                          title="想练习的主题或重点（可留空）"
                        />
                      </label>
                      <div className="prompt-types">
                        <span className="prompt-types-label">题型：</span>
                        {PROMPT_DEFAULT_TYPES.map((type) => (
                          <label
                            key={type}
                            className={cx(
                              'prompt-type',
                              promptForm.types.includes(type) && 'is-on'
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={promptForm.types.includes(type)}
                              onChange={() => togglePromptType(type)}
                            />
                            <span>{TYPE_LABELS[type]}</span>
                          </label>
                        ))}
                      </div>
                      <div className="tool-stack">
                        <button
                          className="primary-button"
                          type="button"
                          onClick={copyPromptToClipboard}
                          title="复制提示词到剪贴板，粘贴给任意 AI"
                        >
                          <Clipboard size={18} />
                          <span>复制提示词</span>
                        </button>
                        <button
                          className="secondary-button"
                          type="button"
                          onClick={openImport}
                          title="导入 AI 返回的 JSON 题库"
                        >
                          <Upload size={18} />
                          <span>导入AI生成的题库</span>
                        </button>
                      </div>
                    </section>

                    <section ref={sectionDeliberateRef} className="insight-card">
                      <div className="panel-title">
                        <BarChart3 size={20} />
                        <h3>AI 刻意练习</h3>
                      </div>
                      <p className="quiet-line">
                        把错题变成新题：单题专项 5 题，或整套刻意练习 50 题，复制 → 给 AI → 导回来再练。
                      </p>
                      <div className="tool-stack" style={{ marginTop: '8px' }}>
                        <button
                          className="primary-button"
                          type="button"
                          disabled={!currentAnswer || currentAnswer?.correct !== false}
                          onClick={copySingleMistakePrompt}
                          title={
                            currentAnswer?.correct === false
                              ? '复制提示词：让 AI 出 5 道针对这道错题的类似题'
                              : '只有当前题做错时才能使用'
                          }
                        >
                          <Sparkles size={18} />
                          <span>本题强化练习 (5 题)</span>
                        </button>
                        <button
                          className="secondary-button"
                          type="button"
                          disabled={!isComplete || mistakeItems.length === 0}
                          onClick={copyFullDrillPrompt}
                          title={
                            !isComplete
                              ? '完成全部题目后才会启用'
                              : mistakeItems.length
                                ? '复制提示词：让 AI 按本套错题生成 50 道强化练习'
                                : '本套题目没有错题，无需刻意练习'
                          }
                        >
                          <Brain size={18} />
                          <span>错题刻意练习 (50 题)</span>
                        </button>
                        <button
                          className="secondary-button"
                          type="button"
                          disabled={!currentAnswer}
                          onClick={copyCurrentItemAsJson}
                          title={
                            currentAnswer
                              ? '复制当前这道题的精简数据（题干 / 正确答案 / 你的答案 / 题型）'
                              : '先作答后才能复制本题数据'
                          }
                        >
                          <Copy size={18} />
                          <span>复制本题</span>
                        </button>
                        <button
                          className="secondary-button"
                          type="button"
                          disabled={!isComplete || mistakeItems.length === 0}
                          onClick={copyAllMistakesAsJson}
                          title={
                            !isComplete
                              ? '完成全部题目后才会启用'
                              : mistakeItems.length
                                ? '复制全部错题（精简版），发给 AI 让它分析弱点'
                                : '本套题没有错题'
                          }
                        >
                          <Copy size={18} />
                          <span>复制所有错题</span>
                        </button>
                        <button
                          className="secondary-button"
                          type="button"
                          disabled={!isComplete}
                          onClick={copyAllQuestionsAsJson}
                          title={
                            isComplete
                              ? '复制整套题目（精简版），便于整体回顾或归档'
                              : '完成全部题目后才会启用'
                          }
                        >
                          <Copy size={18} />
                          <span>复制所有题目</span>
                        </button>
                      </div>
                    </section>

                  </div>
                )}
              </aside>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <FileJson size={34} />
            <h2>还没有题库</h2>
            <p>用右侧「AI 定制练习」复制提示词，让 AI 帮你生成第一套题。</p>
          </div>
        )}
      </main>

      {restartModalOpen && (
        <div className="modal-backdrop" onClick={closeRestartModal}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <RefreshCcw size={24} />
            </div>
            <h2>重做当前题库？</h2>
            <p>
              这只会清空当前题库的作答进度，其他题库不会受影响。
            </p>
            <label className="code-field">
              <span>家长密码</span>
              <input
                value={restartCode}
                onChange={(e) => setRestartCode(e.target.value)}
                inputMode="numeric"
                autoComplete="off"
                placeholder="输入密码"
                type="password"
                onKeyUp={(e) => {
                  if (e.key === 'Enter') confirmRestartQuiz();
                }}
              />
            </label>
            <div className="modal-actions">
              <button className="secondary-button" type="button" onClick={closeRestartModal}>
                取消
              </button>
              <button
                className="primary-button danger-button"
                disabled={restartCode !== RESTART_CODE}
                type="button"
                onClick={confirmRestartQuiz}
              >
                <RefreshCcw size={18} />
                <span>重做题库</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="modal-backdrop" onClick={closeDeleteModal}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon danger">
              <Trash2 size={24} />
            </div>
            <h2>删除这套题？</h2>
            <p>
              这会删除题库文件、学习进度、核心笔记和语音缓存，无法撤销。
            </p>
            <label className="code-field">
              <span>家长密码</span>
              <input
                value={deleteCode}
                onChange={(e) => setDeleteCode(e.target.value)}
                inputMode="numeric"
                autoComplete="off"
                placeholder="输入密码"
                type="password"
                onKeyUp={(e) => {
                  if (e.key === 'Enter') confirmDeleteQuiz();
                }}
              />
            </label>
            <div className="modal-actions">
              <button className="secondary-button" type="button" onClick={closeDeleteModal}>
                取消
              </button>
              <button
                className="primary-button danger-button"
                disabled={deleteCode !== DELETE_CODE}
                type="button"
                onClick={confirmDeleteQuiz}
              >
                <Trash2 size={18} />
                <span>删除题库</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {importOpen && (
        <div className="modal-backdrop" onClick={closeImport}>
          <div className="confirm-modal is-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <Upload size={24} />
            </div>
            <h2>导入题库 JSON</h2>
            <p>
              粘贴 AI 返回的 JSON。系统会保存为新题库并显示在左侧。
            </p>
            <textarea
              className="import-textarea"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='{ "title": "...", "questions": [ ... ] }'
              rows={14}
            />
            <div className="modal-actions">
              <button className="secondary-button" type="button" onClick={closeImport}>
                取消
              </button>
              <button
                className="primary-button"
                type="button"
                disabled={importBusy || !importText.trim()}
                onClick={submitImport}
              >
                {importBusy ? <Loader2 className="spin" size={18} /> : <PlayCircle size={18} />}
                <span>{importBusy ? '导入中…' : '导入题库'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {renameModal.open && (
        <div className="modal-backdrop" onClick={closeRenameModal}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <Pencil size={24} />
            </div>
            <h2>重命名题库</h2>
            <p>
              修改题库名称后，JSON 文件、核心笔记、进度和语音索引会自动同步。
            </p>
            <label className="code-field">
              <span>题库名称</span>
              <input
                value={renameModal.title}
                onChange={(e) =>
                  setRenameModal((prev) => ({ ...prev, title: e.target.value }))
                }
                autoComplete="off"
                placeholder="My Quiz Name"
                type="text"
                autoFocus
                onKeyUp={(e) => {
                  if (e.key === 'Enter') confirmRenameQuiz();
                }}
              />
            </label>
            <div className="modal-actions">
              <button className="secondary-button" type="button" onClick={closeRenameModal}>
                取消
              </button>
              <button
                className="primary-button"
                type="button"
                disabled={renameBusy || !renameModal.title.trim()}
                onClick={confirmRenameQuiz}
              >
                {renameBusy ? <Loader2 className="spin" size={18} /> : <Pencil size={18} />}
                <span>{renameBusy ? '保存中…' : '保存'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {questionDeleteConfirm && (
        <div className="modal-backdrop" onClick={cancelDeleteQuestion}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon danger">
              <Trash2 size={24} />
            </div>
            <h2>删除第 {questionDeleteConfirm.questionNumber} 题？</h2>
            <p>
              这会从题库文件中删除该题，其他题目会保留。
            </p>
            <p className="quiet-line question-preview">“{questionDeleteConfirm.preview}…”</p>
            <div className="modal-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={cancelDeleteQuestion}
                disabled={questionDeleteBusy}
              >
                取消
              </button>
              <button
                className="primary-button danger-button"
                type="button"
                onClick={confirmDeleteQuestion}
                disabled={questionDeleteBusy}
              >
                {questionDeleteBusy ? (
                  <Loader2 className="spin" size={18} />
                ) : (
                  <Trash2 size={18} />
                )}
                <span>{questionDeleteBusy ? '删除中…' : '删除题目'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && <div className="toast">{toastMessage}</div>}
    </div>
  );
}
