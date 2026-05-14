const STATE_PREFIX = 'english-quiz-state:';
const HISTORY_PREFIX = 'english-quiz-history:';

function blankState() {
  return {
    currentIndex: -1,
    answers: {},
    startedAt: new Date().toISOString(),
    finishedAt: null,
    savedAttemptId: null
  };
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function loadQuizState(quizId) {
  return { ...blankState(), ...readJson(`${STATE_PREFIX}${quizId}`, {}) };
}

export function saveQuizState(quizId, state) {
  writeJson(`${STATE_PREFIX}${quizId}`, state);
}

export function resetQuizState(quizId) {
  const state = blankState();
  saveQuizState(quizId, state);
  return state;
}

export function loadHistory(quizId) {
  return readJson(`${HISTORY_PREFIX}${quizId}`, []);
}

export function appendAttempt(quizId, attempt) {
  const history = loadHistory(quizId);
  const next = [attempt, ...history.filter((item) => item.id !== attempt.id)].slice(0, 30);
  writeJson(`${HISTORY_PREFIX}${quizId}`, next);
  return next;
}
