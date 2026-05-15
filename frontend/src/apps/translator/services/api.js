const BASE = "/api/translator";

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

export async function fetchQuiz(quizId) {
  return parseResponse(
    await fetch(`${BASE}/quizzes/${encodeURIComponent(quizId)}`)
  );
}

export async function importQuiz(payload, { overwrite = false } = {}) {
  const qs = overwrite ? "?overwrite=1" : "";
  return parseResponse(
    await fetch(`${BASE}/quizzes/import${qs}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );
}

export async function deleteQuiz(quizId) {
  return parseResponse(
    await fetch(`${BASE}/quizzes/${encodeURIComponent(quizId)}`, {
      method: "DELETE",
    })
  );
}

export function ttsUrl(text, lang) {
  const params = new URLSearchParams({ text, lang });
  return `${BASE}/tts?${params.toString()}`;
}
