import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Award,
  BarChart3,
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
  FileJson,
  Filter,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  RefreshCcw,
  Send,
  Target,
  X
} from 'lucide-react';
import { fetchQuiz, fetchQuizzes, gradeQuestion } from './services/api.js';
import {
  appendAttempt,
  loadHistory,
  loadQuizState,
  resetQuizState,
  saveQuizState
} from './services/storage.js';

import './styles.css';

const RESTART_CODE = '12580';
const INTRO_ANIMALS = [
  { icon: '🦉', label: 'Focus' },
  { icon: '🦊', label: 'Clever' },
  { icon: '🐼', label: 'Brave' },
  { icon: '🐢', label: 'Steady' },
  { icon: '🐶', label: 'Cheer' }
];

function cx(...args) {
  return args.filter(Boolean).join(' ');
}

function scrollExerciseTop() {
  setTimeout(() => {
    document.querySelector('.exercise-panel')?.scrollTo({ top: 0, behavior: 'smooth' });
  }, 0);
}

export default function QuizApp() {
  const [quizzes, setQuizzes] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [activeQuizId, setActiveQuizId] = useState('');
  const [quizState, setQuizStateRaw] = useState(() => loadQuizState('pending'));
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [wrongOnly, setWrongOnly] = useState(false);
  const [finalMode, setFinalMode] = useState(false);
  const [chosenTokens, setChosenTokens] = useState([]);
  const [fillAnswer, setFillAnswer] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [insightsCollapsed, setInsightsCollapsed] = useState(false);
  const [skillMapExpanded, setSkillMapExpanded] = useState(false);
  const [restartModalOpen, setRestartModalOpen] = useState(false);
  const [restartCode, setRestartCode] = useState('');

  const toastTimerRef = useRef(null);

  const setQuizState = useCallback(
    (updater, options = {}) => {
      setQuizStateRaw((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        if (options.persistAs) {
          saveQuizState(options.persistAs, next);
        } else if (activeQuizId) {
          saveQuizState(activeQuizId, next);
        }
        return next;
      });
    },
    [activeQuizId]
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

  const bestAttempt = useMemo(
    () =>
      history.reduce(
        (best, attempt) =>
          !best || attempt.scorePercent > best.scorePercent ? attempt : best,
        null
      ),
    [history]
  );
  const latestAttempt = history[0] || null;

  const skillRows = useMemo(() => {
    const rows = new Map();
    questions.forEach((question) => {
      const key = question.category || 'General';
      if (!rows.has(key)) {
        rows.set(key, {
          name: key, total: 0, answered: 0, correct: 0, wrong: 0,
          historyWrong: 0, historyAnswered: 0
        });
      }
      rows.get(key).total += 1;
    });
    questions.forEach((question) => {
      const answer = answers[question.id];
      if (!answer) return;
      const row = rows.get(question.category || 'General');
      row.answered += 1;
      if (answer.correct) row.correct += 1; else row.wrong += 1;
    });
    history.forEach((attempt) => {
      Object.entries(attempt.skillStats || {}).forEach(([name, stats]) => {
        if (!rows.has(name)) {
          rows.set(name, {
            name, total: 0, answered: 0, correct: 0, wrong: 0,
            historyWrong: 0, historyAnswered: 0
          });
        }
        rows.get(name).historyWrong += stats.wrong || 0;
        rows.get(name).historyAnswered += stats.answered || 0;
      });
    });
    return Array.from(rows.values()).sort((a, b) => {
      const aWeight = a.wrong * 4 + a.historyWrong;
      const bWeight = b.wrong * 4 + b.historyWrong;
      return bWeight - aWeight || b.wrong - a.wrong || a.name.localeCompare(b.name);
    });
  }, [questions, answers, history]);

  const visibleSkillRows = skillMapExpanded ? skillRows.slice(0, 8) : skillRows.slice(0, 3);
  const focusRows = useMemo(
    () => skillRows.filter((row) => row.wrong || row.historyWrong).slice(0, 6),
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
    if (wrongOnly) return 'Next mistake';
    if (isComplete && currentIndex === totalQuestions - 1) return 'Finish';
    return 'Next';
  })();

  const quizNavStatus = useMemo(
    () =>
      quizzes.reduce((map, item) => {
        const state = item.id === activeQuizId ? quizState : loadQuizState(item.id);
        const answerValues = Object.values(state.answers || {});
        const answered = answerValues.length;
        const correct = answerValues.filter((answer) => answer.correct).length;
        const complete =
          item.questionCount > 0 && (Boolean(state.finishedAt) || answered >= item.questionCount);
        map[item.id] = {
          answered, correct, complete,
          score: item.questionCount ? Math.round((correct / item.questionCount) * 100) : 0
        };
        return map;
      }, {}),
    [quizzes, activeQuizId, quizState]
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
    const question = currentQuestion;
    if (question?.type === 'wordorder' && currentAnswer?.answerTokens) {
      setChosenTokens([...currentAnswer.answerTokens]);
    } else {
      setChosenTokens([]);
    }
    if (question?.type === 'fill') {
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

  const selectQuiz = useCallback(
    async (quizId) => {
      if (!quizId || quizId === activeQuizId) return;
      setLoadingQuiz(true);
      setError('');
      try {
        setActiveQuizId(quizId);
        const payload = await fetchQuiz(quizId);
        setQuiz(payload);
        const loaded = loadQuizState(quizId);
        if ((loaded.currentIndex ?? -1) >= payload.questions.length) {
          loaded.currentIndex = Math.max(payload.questions.length - 1, 0);
        }
        if ((loaded.currentIndex ?? -1) < -1) loaded.currentIndex = -1;
        if (
          (loaded.currentIndex ?? -1) === 0 &&
          Object.keys(loaded.answers || {}).length === 0 &&
          !loaded.finishedAt
        ) {
          loaded.currentIndex = -1;
        }
        setQuizState(loaded, { persistAs: quizId });
        setHistory(loadHistory(quizId));
        setWrongOnly(false);
        setFinalMode(Boolean(loaded.finishedAt));
      } catch (err) {
        setError(err.message || 'Could not load this quiz.');
      } finally {
        setLoadingQuiz(false);
      }
    },
    [activeQuizId, setQuizState]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const payload = await fetchQuizzes();
        if (cancelled) return;
        const list = payload.quizzes || [];
        setQuizzes(list);
        if (list.length) {
          await selectQuiz(list[0].id);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load quizzes.');
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
    return quizNavStatus[item.id] || { answered: 0, correct: 0, complete: false, score: 0 };
  }

  function navMeta(item) {
    const status = navStatus(item);
    if (status.complete) return `Done · ${status.score}% · ${item.level}`;
    if (status.answered) return `${status.answered}/${item.questionCount} done · ${item.level}`;
    return `${item.questionCount} questions · ${item.level}`;
  }

  function jumpTo(index) {
    if (wrongOnly && !wrongQuestionIndices.includes(index)) return;
    setFinalMode(false);
    setQuizState((prev) => ({ ...prev, currentIndex: index }));
    scrollExerciseTop();
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
    if (currentIndex === -1) { startQuizFromIntro(); return; }
    if (wrongOnly) {
      const visible = visibleIndices;
      const position = visible.indexOf(currentIndex);
      if (position >= 0 && position < visible.length - 1) jumpTo(visible[position + 1]);
      return;
    }
    if (isComplete && currentIndex === totalQuestions - 1) { finishAttempt(); return; }
    if (currentIndex < totalQuestions - 1) { jumpTo(currentIndex + 1); return; }
    const firstUnanswered = questions.findIndex((q) => !answers[q.id]);
    if (firstUnanswered >= 0) {
      showToast(`Question ${firstUnanswered + 1} is still waiting.`);
      jumpTo(firstUnanswered);
    }
  }

  function toggleWrongOnly() {
    if (!wrongOnly && wrongQuestionIndices.length === 0) {
      showToast('No mistakes to review yet.');
      return;
    }
    const next = !wrongOnly;
    setWrongOnly(next);
    setFinalMode(false);
    if (next && !wrongQuestionIndices.includes(currentIndex)) {
      jumpTo(wrongQuestionIndices[0]);
    }
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
          options: question.options || null,
          words: question.words || null
        }
      }
    }));
    if (result.correct) showToast('Checked: correct.');
  }

  async function answerMultipleChoice(index) {
    const question = currentQuestion;
    if (!question || currentAnswer || submitting) return;
    setSubmitting(true);
    try {
      const result = await gradeQuestion(activeQuizId, {
        questionId: question.id, answerIndex: index
      });
      saveAnswer(question, result);
    } catch (err) {
      showToast(err.message || 'Could not check that answer.');
    } finally { setSubmitting(false); }
  }

  async function checkWordOrder() {
    const question = currentQuestion;
    if (!question || currentAnswer || submitting) return;
    if (chosenTokens.length !== question.words.length) {
      showToast('Use every word first.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await gradeQuestion(activeQuizId, {
        questionId: question.id,
        answerTokens: chosenTokens,
        answerWords: chosenTokens.map((token) => question.words[token])
      });
      saveAnswer(question, result);
    } catch (err) {
      showToast(err.message || 'Could not check that answer.');
    } finally { setSubmitting(false); }
  }

  async function checkFillAnswer() {
    const question = currentQuestion;
    if (!question || currentAnswer || submitting) return;
    const answerText = fillAnswer.trim();
    if (!answerText) { showToast('Type your answer first.'); return; }
    setSubmitting(true);
    try {
      const result = await gradeQuestion(activeQuizId, {
        questionId: question.id, answerText
      });
      saveAnswer(question, result);
    } catch (err) {
      showToast(err.message || 'Could not check that answer.');
    } finally { setSubmitting(false); }
  }

  function resetCurrentWordOrder() { if (!currentAnswer) setChosenTokens([]); }
  function resetFillAnswer() { if (!currentAnswer) setFillAnswer(''); }
  function chooseWord(tokenIndex) {
    if (currentAnswer || chosenTokens.includes(tokenIndex)) return;
    setChosenTokens((prev) => [...prev, tokenIndex]);
  }
  function removeChosenWord(position) {
    if (currentAnswer) return;
    setChosenTokens((prev) => prev.filter((_, index) => index !== position));
  }
  function isTokenChosen(index) { return chosenTokens.includes(index); }

  function optionClasses(index) {
    const answer = currentAnswer;
    if (!answer) return '';
    if (index === answer.correctIndex) return 'is-correct';
    if (index === answer.answerIndex && !answer.correct) return 'is-wrong';
    if (index === answer.answerIndex) return 'is-selected';
    return 'is-dimmed';
  }

  function openRestartModal() { setRestartCode(''); setRestartModalOpen(true); }
  function closeRestartModal() { setRestartModalOpen(false); setRestartCode(''); }

  function confirmRestartQuiz() {
    if (restartCode !== RESTART_CODE) { showToast('Parent code is required.'); return; }
    const fresh = resetQuizState(activeQuizId);
    setQuizState(fresh);
    setWrongOnly(false); setFinalMode(false); setChosenTokens([]);
    closeRestartModal();
    showToast('Current quiz restarted.');
  }

  function buildAttempt(id, sourceState) {
    const skillStats = {};
    const stateAnswers = (sourceState || quizState).answers || {};
    questions.forEach((question) => {
      const answer = stateAnswers[question.id];
      const key = question.category || 'General';
      if (!skillStats[key]) skillStats[key] = { answered: 0, correct: 0, wrong: 0 };
      if (!answer) return;
      skillStats[key].answered += 1;
      if (answer.correct) skillStats[key].correct += 1; else skillStats[key].wrong += 1;
    });
    const source = sourceState || quizState;
    return {
      id, quizId: activeQuizId,
      quizTitle: quiz?.title || activeQuizId,
      startedAt: source.startedAt, finishedAt: source.finishedAt,
      totalQuestions, correctCount, wrongCount, scorePercent, skillStats
    };
  }

  function finishAttempt() {
    if (!isComplete) {
      const index = firstUnansweredIndex();
      showToast(`Question ${index + 1} needs an answer.`);
      jumpTo(index);
      return;
    }
    const attemptId = quizState.savedAttemptId || `${activeQuizId}-${Date.now()}`;
    const finishedAt = quizState.finishedAt || new Date().toISOString();
    const nextState = { ...quizState, finishedAt, savedAttemptId: attemptId };
    setQuizState(nextState);
    const attempt = buildAttempt(attemptId, nextState);
    setHistory(appendAttempt(activeQuizId, attempt));
    setFinalMode(true); setWrongOnly(false);
    scrollExerciseTop();
  }

  function buildMistakePack() {
    return {
      quizId: activeQuizId, quizTitle: quiz?.title,
      generatedAt: new Date().toISOString(),
      score: { correct: correctCount, wrong: wrongCount, total: totalQuestions, percent: scorePercent },
      weakSkills: focusRows.map((row) => ({
        skill: row.name, currentWrong: row.wrong,
        historicalWrong: row.historyWrong, answeredThisAttempt: row.answered
      })),
      mistakes: mistakeItems.map(({ question, index, answer }) => ({
        questionNumber: index + 1, category: question.category,
        type: question.type, question: question.question,
        reading: question.reading || null, options: question.options || null,
        words: question.words || null,
        studentAnswer: answer.answerText, correctAnswer: answer.correctText,
        explanation: answer.explanation
      })),
      aiPrompt:
        'Create a short adaptive English practice set for an 11-year-old learner. Focus on the weak skills and mistakes in this JSON. Do not reveal answers before the learner tries each question.'
    };
  }

  function buildFullAttemptExport() {
    return {
      ...buildAttempt(quizState.savedAttemptId || `${activeQuizId}-draft`),
      answers: questions.map((question, index) => {
        const answer = answers[question.id];
        return {
          questionNumber: index + 1, category: question.category,
          type: question.type, question: question.question,
          reading: question.reading || null,
          studentAnswer: answer?.answerText || null,
          correctAnswer: answer?.correctText || null,
          isCorrect: answer?.correct ?? null,
          explanation: answer?.explanation || null
        };
      })
    };
  }

  function exportMistakes(kind) {
    if (!mistakeItems.length) { showToast('No wrong answers to export.'); return; }
    const pack = buildMistakePack();
    if (kind === 'copy') { copyText(JSON.stringify(pack, null, 2), 'Mistake JSON copied.'); return; }
    if (kind === 'prompt') {
      copyText(`${pack.aiPrompt}\n\n${JSON.stringify(pack, null, 2)}`, 'AI practice prompt copied.');
      return;
    }
    downloadText(
      `${activeQuizId}-mistakes.json`,
      JSON.stringify(pack, null, 2),
      'application/json'
    );
  }

  function exportFullAttempt() {
    if (!isComplete) {
      showToast('Finish the quiz before exporting the full answer key.');
      return;
    }
    downloadText(
      `${activeQuizId}-completed-attempt.json`,
      JSON.stringify(buildFullAttemptExport(), null, 2),
      'application/json'
    );
  }

  function copyText(text, successMessage) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(
        () => showToast(successMessage),
        () => fallbackCopy(text, successMessage)
      );
    } else fallbackCopy(text, successMessage);
  }

  function fallbackCopy(text, successMessage) {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed'; area.style.left = '-9999px';
    document.body.appendChild(area);
    area.select(); document.execCommand('copy');
    document.body.removeChild(area);
    showToast(successMessage);
  }

  function downloadText(filename, text, type) {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('File downloaded.');
  }

  function formatDate(value) {
    if (!value) return '';
    return new Intl.DateTimeFormat(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(new Date(value));
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

  function homeDotClassName() {
    return cx(
      'question-dot', 'is-home',
      !finalMode && currentIndex === -1 && 'is-current',
      wrongOnly && 'is-muted'
    );
  }

  return (
    <div className={cx('quiz-shell', sidebarCollapsed && 'sidebar-is-collapsed')}>
      <aside className={cx('sidebar', sidebarCollapsed && 'is-collapsed')}>
        <div className="sidebar-top">
          {!sidebarCollapsed && (
            <div className="brand-block">
              <div className="brand-mark"><BookOpen size={26} /></div>
              <div>
                <p className="eyebrow">English Adventure</p>
                <h1>Daily Quiz</h1>
              </div>
            </div>
          )}
          <button
            className="sidebar-toggle" type="button"
            onClick={() => setSidebarCollapsed((value) => !value)}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
          </button>
        </div>

        <div className="quiz-nav">
          {quizzes.map((item, index) => {
            const status = navStatus(item);
            return (
              <button
                key={item.id}
                className={cx(
                  'quiz-tab',
                  item.id === activeQuizId && 'is-active',
                  status.complete && 'is-complete'
                )}
                title={item.title} type="button"
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
            );
          })}
        </div>

        <div className="sidebar-note">
          <Target size={18} />
          <span>
            {quizzes.length} quiz file{quizzes.length === 1 ? '' : 's'} ready
          </span>
        </div>
      </aside>

      <main className="main-stage">
        {loading ? (
          <div className="loading-state">
            <Loader2 className="spin" size={30} />
            <span>Loading quiz files</span>
          </div>
        ) : error ? (
          <div className="empty-state">
            <X size={34} />
            <h2>{error}</h2>
          </div>
        ) : quiz ? (
          <>
            <header className="top-strip">
              <div className="quiz-identity">
                <span className="mini-meta">
                  {quiz.level} · {quiz.questionCount} questions
                </span>
                <strong className="top-title">{quiz.title}</strong>
                <span className="top-subtitle">{quiz.subtitle}</span>
              </div>
              <div className="top-actions">
                <button
                  className={cx('tool-button', wrongOnly && 'is-on')}
                  disabled={wrongQuestionIndices.length === 0}
                  type="button" onClick={toggleWrongOnly}
                >
                  <Filter size={18} />
                  <span>Wrong only</span>
                </button>
                <button className="tool-button" type="button" onClick={openRestartModal}>
                  <RefreshCcw size={18} />
                  <span>Restart</span>
                </button>
              </div>
            </header>

            <div
              className={cx(
                'workspace', loadingQuiz && 'is-loading',
                insightsCollapsed && 'insights-is-collapsed'
              )}
            >
              <section className="exercise-panel">
                <div className="progress-card">
                  <div className="progress-head">
                    <div className="progress-line">
                      <span className="progress-label">
                        {finalMode
                          ? 'Finished'
                          : `Question ${currentIndex + 1} of ${totalQuestions}`}
                      </span>
                      <span className="result-chip is-good">{correctCount} correct</span>
                      <span className="result-chip is-bad">{wrongCount} incorrect</span>
                    </div>
                    <span className="score-pill">{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <div className="question-dots">
                    <button
                      className={homeDotClassName()}
                      disabled={wrongOnly} type="button"
                      onClick={() => jumpTo(-1)}
                    >0</button>
                    {questions.map((question, index) => (
                      <button
                        key={question.id}
                        className={dotClassName(question, index)}
                        disabled={wrongOnly && answers[question.id]?.correct !== false}
                        type="button" onClick={() => jumpTo(index)}
                      >{index + 1}</button>
                    ))}
                  </div>
                </div>

                {finalMode ? (
                  <section className="final-card">
                    <div className="final-hero">
                      <Award size={54} />
                      <div>
                        <p className="eyebrow">Completed attempt</p>
                        <h2>{correctCount} / {totalQuestions}</h2>
                        <p>{scorePercent}% correct</p>
                      </div>
                    </div>
                    <div className="summary-grid">
                      <div><span>Correct</span><strong>{correctCount}</strong></div>
                      <div><span>Wrong</span><strong>{wrongCount}</strong></div>
                      <div><span>Focus skills</span><strong>{focusRows.length}</strong></div>
                    </div>
                    <div className="final-actions">
                      <button className="primary-button" type="button" onClick={() => exportMistakes('prompt')}>
                        <Send size={18} /><span>Copy AI practice prompt</span>
                      </button>
                      <button className="secondary-button" type="button" onClick={() => exportMistakes('json')}>
                        <FileJson size={18} /><span>Export wrong answers</span>
                      </button>
                      <button className="secondary-button" type="button" onClick={exportFullAttempt}>
                        <Download size={18} /><span>Export full attempt</span>
                      </button>
                    </div>
                  </section>
                ) : currentIndex === -1 ? (
                  <section className="intro-card">
                    <div className="animal-sky">
                      {INTRO_ANIMALS.map((buddy) => (
                        <div key={buddy.label} className="animal-buddy">
                          <span>{buddy.icon}</span>
                          <strong>{buddy.label}</strong>
                        </div>
                      ))}
                    </div>
                    <div className="intro-copy">
                      <p className="eyebrow">Question 0</p>
                      <h2>{quiz.title} Adventure</h2>
                      <p>{quiz.subtitle} · {totalQuestions} questions</p>
                    </div>
                    <div className="intro-stats">
                      <div><span>Done</span><strong>{answeredCount}</strong></div>
                      <div><span>Stars</span><strong>{correctCount}</strong></div>
                      <div><span>Level</span><strong>{quiz.level}</strong></div>
                    </div>
                    <button className="intro-go-button" type="button" onClick={startQuizFromIntro}>
                      <span>Let's Go</span>
                      <ChevronRight size={22} />
                    </button>
                  </section>
                ) : currentQuestion ? (
                  <article className="question-card">
                    {currentQuestion.reading && (
                      <div className="reading-box">{currentQuestion.reading}</div>
                    )}
                    <h3 className="question-text">{currentQuestion.question}</h3>

                    {currentQuestion.type === 'mc' ? (
                      <div className={cx('answer-options', optionGridClass)}>
                        {currentQuestion.options.map((option, index) => (
                          <button
                            key={`${index}-${option}`}
                            className={cx('answer-option', optionClasses(index))}
                            disabled={Boolean(currentAnswer) || submitting}
                            type="button" onClick={() => answerMultipleChoice(index)}
                          >
                            <span className="answer-marker">{String.fromCharCode(65 + index)}</span>
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
                            currentAnswer ? (currentAnswer.correct ? 'is-correct' : 'is-wrong') : ''
                          )}
                          disabled={Boolean(currentAnswer) || submitting}
                          autoComplete="off" autoCapitalize="off" spellCheck="false"
                          placeholder="Type your answer here" type="text"
                          onKeyUp={(e) => { if (e.key === 'Enter') checkFillAnswer(); }}
                        />
                        <div className="inline-actions">
                          <button
                            className="primary-button"
                            disabled={Boolean(currentAnswer) || submitting}
                            type="button" onClick={checkFillAnswer}
                          ><Check size={18} /><span>Check</span></button>
                          <button
                            className="secondary-button"
                            disabled={Boolean(currentAnswer)}
                            type="button" onClick={resetFillAnswer}
                          ><RefreshCcw size={18} /><span>Clear</span></button>
                        </div>
                      </div>
                    ) : (
                      <div className="word-order">
                        <div className={cx('builder', chosenTokens.length === 0 && 'is-empty')}>
                          {chosenTokens.map((token, position) => (
                            <button
                              key={`${token}-${position}`}
                              className="word-chip is-chosen"
                              disabled={Boolean(currentAnswer)}
                              type="button" onClick={() => removeChosenWord(position)}
                            >{currentQuestion.words[token]}</button>
                          ))}
                        </div>
                        <div className="word-bank">
                          {currentQuestion.words.map((word, tokenIndex) => (
                            <button
                              key={`${word}-${tokenIndex}`}
                              className={cx('word-chip', isTokenChosen(tokenIndex) && 'is-used')}
                              disabled={Boolean(currentAnswer) || isTokenChosen(tokenIndex)}
                              type="button" onClick={() => chooseWord(tokenIndex)}
                            >{word}</button>
                          ))}
                        </div>
                        <div className="inline-actions">
                          <button
                            className="primary-button"
                            disabled={Boolean(currentAnswer) || submitting}
                            type="button" onClick={checkWordOrder}
                          ><Check size={18} /><span>Check</span></button>
                          <button
                            className="secondary-button"
                            disabled={Boolean(currentAnswer)}
                            type="button" onClick={resetCurrentWordOrder}
                          ><RefreshCcw size={18} /><span>Clear</span></button>
                        </div>
                      </div>
                    )}

                    {currentAnswer && (
                      <div className={cx('feedback-box', currentAnswer.correct ? 'is-good' : 'is-bad')}>
                        <div className="feedback-icon">
                          {currentAnswer.correct ? <Check size={22} /> : <X size={22} />}
                        </div>
                        <div>
                          <strong>{currentAnswer.correct ? 'Nice work' : 'Good try'}</strong>
                          <p>{currentAnswer.explanation}</p>
                          {!currentAnswer.correct && (
                            <p className="correct-line">
                              Correct answer: <span>{currentAnswer.correctText}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="sticky-nav">
                      <button
                        className="secondary-button"
                        disabled={visibleIndices.indexOf(currentIndex) <= 0}
                        type="button" onClick={goPrevious}
                      ><ChevronLeft size={18} /><span>Previous</span></button>
                      <div className="nav-category">
                        <span className="category-pill">
                          <span className="category-icon">{currentQuestion.icon}</span>
                          {currentQuestion.category}
                        </span>
                        <span className="question-number">#{currentIndex + 1}</span>
                      </div>
                      <button
                        className="primary-button"
                        disabled={wrongOnly && visibleIndices.indexOf(currentIndex) === visibleIndices.length - 1}
                        type="button" onClick={goNext}
                      ><span>{nextButtonText}</span><ChevronRight size={18} /></button>
                    </div>
                  </article>
                ) : null}
              </section>

              <aside className={cx('insight-panel', insightsCollapsed && 'is-collapsed')}>
                <button
                  className="insight-toggle" type="button"
                  onClick={() => setInsightsCollapsed((v) => !v)}
                >
                  {insightsCollapsed ? <PanelRightOpen size={19} /> : <PanelRightClose size={19} />}
                </button>

                {!insightsCollapsed && (
                  <>
                    <section className="insight-card achievement-card">
                      <div className="panel-title">
                        <Award size={20} />
                        <h3>Achievements</h3>
                      </div>
                      <div className="achievement-grid">
                        <div>
                          <span>Best</span>
                          <strong>{bestAttempt ? `${bestAttempt.scorePercent}%` : `${scorePercent}%`}</strong>
                        </div>
                        <div>
                          <span>Attempts</span>
                          <strong>{history.length}</strong>
                        </div>
                      </div>
                      {latestAttempt && (
                        <div className="latest-badge">
                          <span>Last run</span>
                          <strong>{latestAttempt.correctCount}/{latestAttempt.totalQuestions}</strong>
                        </div>
                      )}
                      {history.length ? (
                        <div className="attempt-list">
                          {history.slice(0, 4).map((attempt) => (
                            <div key={attempt.id} className="attempt-row">
                              <span>{formatDate(attempt.finishedAt)}</span>
                              <strong>{attempt.correctCount}/{attempt.totalQuestions}</strong>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="quiet-line">First badge waiting.</p>
                      )}
                    </section>

                    <section className="insight-card">
                      <div className="panel-title">
                        <BarChart3 size={20} />
                        <h3>Parent tools</h3>
                      </div>
                      <div className="tool-stack">
                        <button
                          className="secondary-button" type="button"
                          disabled={mistakeItems.length === 0}
                          onClick={() => exportMistakes('copy')}
                        ><Copy size={18} /><span>Copy wrong JSON</span></button>
                        <button
                          className="secondary-button" type="button"
                          disabled={mistakeItems.length === 0}
                          onClick={() => exportMistakes('prompt')}
                        ><Clipboard size={18} /><span>Copy AI prompt</span></button>
                        <button
                          className="secondary-button" type="button"
                          disabled={!isComplete} onClick={exportFullAttempt}
                        ><Download size={18} /><span>Full export</span></button>
                      </div>
                    </section>

                    <section className={cx('insight-card', 'skill-card', skillMapExpanded && 'is-expanded')}>
                      <div className="panel-title">
                        <Brain size={20} />
                        <h3>Skill map</h3>
                        <button
                          className="mini-toggle" type="button"
                          onClick={() => setSkillMapExpanded((v) => !v)}
                        >
                          {skillMapExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          <span>{skillMapExpanded ? 'Less' : 'More'}</span>
                        </button>
                      </div>
                      <div className="skill-list">
                        {visibleSkillRows.map((row) => (
                          <div key={row.name} className="skill-row">
                            <div>
                              <strong>{row.name}</strong>
                              <span>
                                {row.answered}/{row.total} this attempt · {row.historyWrong} past misses
                              </span>
                            </div>
                            <span className={cx('skill-score', (row.wrong || row.historyWrong) && 'needs-work')}>
                              {row.wrong}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>
                  </>
                )}
              </aside>
            </div>
          </>
        ) : null}
      </main>

      {restartModalOpen && (
        <div className="modal-backdrop" onClick={closeRestartModal}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon"><RefreshCcw size={24} /></div>
            <h2>Restart current quiz?</h2>
            <p>
              This clears only the current quiz attempt. Other quizzes and completed records stay saved.
            </p>
            <label className="code-field">
              <span>Parent code</span>
              <input
                value={restartCode}
                onChange={(e) => setRestartCode(e.target.value)}
                inputMode="numeric" autoComplete="off"
                placeholder="Enter code" type="password"
                onKeyUp={(e) => { if (e.key === 'Enter') confirmRestartQuiz(); }}
              />
            </label>
            <div className="modal-actions">
              <button className="secondary-button" type="button" onClick={closeRestartModal}>
                Cancel
              </button>
              <button
                className="primary-button danger-button"
                disabled={restartCode !== RESTART_CODE}
                type="button" onClick={confirmRestartQuiz}
              ><RefreshCcw size={18} /><span>Restart quiz</span></button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && <div className="toast">{toastMessage}</div>}
    </div>
  );
}
