const BASE = '/api/ai-practice';

async function parseResponse(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Request failed with ${response.status}`);
  }
  return payload;
}

export async function fetchQuizzes() {
  return parseResponse(await fetch(`${BASE}/quizzes`));
}

export async function fetchProgressSummary() {
  return parseResponse(await fetch(`${BASE}/progress-summary`));
}

export async function fetchQuiz(quizId) {
  return parseResponse(await fetch(`${BASE}/quizzes/${encodeURIComponent(quizId)}`));
}

export async function gradeQuestion(quizId, payload) {
  return parseResponse(
    await fetch(`${BASE}/quizzes/${encodeURIComponent(quizId)}/grade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  );
}

export async function deleteQuiz(quizId) {
  return parseResponse(
    await fetch(`${BASE}/quizzes/${encodeURIComponent(quizId)}`, { method: 'DELETE' })
  );
}

export async function renameQuiz(quizId, payload) {
  return parseResponse(
    await fetch(`${BASE}/quizzes/${encodeURIComponent(quizId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  );
}

export async function deleteQuestion(quizId, questionId) {
  return parseResponse(
    await fetch(
      `${BASE}/quizzes/${encodeURIComponent(quizId)}/questions/${encodeURIComponent(questionId)}`,
      { method: 'DELETE' }
    )
  );
}

export async function fetchQuizProgress(quizId) {
  return parseResponse(await fetch(`${BASE}/quizzes/${encodeURIComponent(quizId)}/progress`));
}

export async function saveQuizProgress(quizId, state) {
  return parseResponse(
    await fetch(`${BASE}/quizzes/${encodeURIComponent(quizId)}/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state })
    })
  );
}

export async function resetQuizProgress(quizId) {
  return parseResponse(
    await fetch(`${BASE}/quizzes/${encodeURIComponent(quizId)}/progress`, { method: 'DELETE' })
  );
}

export async function fetchTakeaway(quizId) {
  return parseResponse(await fetch(`${BASE}/quizzes/${encodeURIComponent(quizId)}/takeaway`));
}

export async function saveTakeaway(quizId, questionId, html) {
  return parseResponse(
    await fetch(`${BASE}/quizzes/${encodeURIComponent(quizId)}/takeaway`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, html })
    })
  );
}

export async function importQuiz(payload) {
  return parseResponse(
    await fetch(`${BASE}/quizzes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  );
}

export async function fetchSettings() {
  return parseResponse(await fetch(`${BASE}/settings`));
}

const audioCache = new Map();

function audioCacheKey(quizId, text) {
  return `${quizId || '__'}::${text}`;
}

async function requestTtsBlob(text, quizId) {
  const response = await fetch(`${BASE}/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, quizId: quizId || '' })
  });
  if (!response.ok) {
    let message = `TTS request failed (${response.status})`;
    try {
      const payload = await response.json();
      if (payload?.error) message = payload.error;
    } catch (_) {
      /* swallow */
    }
    throw new Error(message);
  }
  return await response.blob();
}

export async function getTtsAudioUrl(text, { quizId } = {}) {
  const key = audioCacheKey(quizId, text);
  if (audioCache.has(key)) return audioCache.get(key);
  const blob = await requestTtsBlob(text, quizId);
  const url = URL.createObjectURL(blob);
  audioCache.set(key, url);
  return url;
}

export function clearTtsAudioCache() {
  for (const url of audioCache.values()) {
    try {
      URL.revokeObjectURL(url);
    } catch (_) {
      /* ignore */
    }
  }
  audioCache.clear();
}
