const BASE = "/api/live-spanish";

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
  return data;
}

function jsonRequest(path, options = {}) {
  return fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
}

export async function fetchQuizzes() {
  return parseResponse(await jsonRequest(`${BASE}/quizzes`));
}

export async function fetchQuiz(quizId) {
  return parseResponse(await jsonRequest(`${BASE}/quizzes/${encodeURIComponent(quizId)}`));
}

export async function fetchQuizProgress(quizId) {
  return parseResponse(
    await jsonRequest(`${BASE}/quizzes/${encodeURIComponent(quizId)}/progress`)
  );
}

export async function gradeQuestion(quizId, payload) {
  return parseResponse(
    await jsonRequest(`${BASE}/quizzes/${encodeURIComponent(quizId)}/grade`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  );
}

export async function resetCurrentProgress(quizId) {
  return parseResponse(
    await jsonRequest(`${BASE}/quizzes/${encodeURIComponent(quizId)}/progress/current`, {
      method: "DELETE",
    })
  );
}

export async function requestQuestionAudio(quizId, questionId, { gender }) {
  return parseResponse(
    await jsonRequest(
      `${BASE}/quizzes/${encodeURIComponent(quizId)}/questions/${encodeURIComponent(questionId)}/audio`,
      { method: "POST", body: JSON.stringify({ gender }) }
    )
  );
}

export async function deleteQuestion(quizId, questionId) {
  return parseResponse(
    await jsonRequest(
      `${BASE}/quizzes/${encodeURIComponent(quizId)}/questions/${encodeURIComponent(questionId)}`,
      { method: "DELETE" }
    )
  );
}

export async function deleteQuiz(quizId) {
  return parseResponse(
    await jsonRequest(`${BASE}/quizzes/${encodeURIComponent(quizId)}`, { method: "DELETE" })
  );
}

export async function renameQuiz(quizId, title) {
  return parseResponse(
    await jsonRequest(`${BASE}/quizzes/${encodeURIComponent(quizId)}/rename`, {
      method: "POST",
      body: JSON.stringify({ title }),
    })
  );
}

export async function importQuiz(rawText) {
  return parseResponse(
    await jsonRequest(`${BASE}/quizzes/import`, {
      method: "POST",
      body: JSON.stringify({ rawText }),
    })
  );
}

export async function saveQuestionTakeaway(quizId, questionId, draft) {
  return parseResponse(
    await jsonRequest(
      `${BASE}/quizzes/${encodeURIComponent(quizId)}/questions/${encodeURIComponent(questionId)}/takeaway`,
      { method: "PATCH", body: JSON.stringify(draft) }
    )
  );
}
