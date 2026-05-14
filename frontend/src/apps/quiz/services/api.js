// Quiz endpoints live under /api/quiz/* in the unified backend (the original
// app served /api/quizzes directly).

const API_BASE = '/api/quiz';

async function parseResponse(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Request failed with ${response.status}`);
  }
  return payload;
}

export async function fetchQuizzes() {
  return parseResponse(await fetch(`${API_BASE}/quizzes`));
}

export async function fetchQuiz(quizId) {
  return parseResponse(await fetch(`${API_BASE}/quizzes/${encodeURIComponent(quizId)}`));
}

export async function gradeQuestion(quizId, payload) {
  return parseResponse(
    await fetch(`${API_BASE}/quizzes/${encodeURIComponent(quizId)}/grade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  );
}
