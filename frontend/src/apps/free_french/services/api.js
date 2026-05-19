const BASE = "/api/free-french";

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
  return data;
}

export async function fetchLibrary() {
  return parseResponse(await fetch(`${BASE}/library`));
}

export async function fetchLesson(lessonId) {
  return parseResponse(await fetch(`${BASE}/lessons/${encodeURIComponent(lessonId)}`));
}

export async function createLevel(payload) {
  return parseResponse(
    await fetch(`${BASE}/levels`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function updateLevel(levelId, payload) {
  return parseResponse(
    await fetch(`${BASE}/levels/${encodeURIComponent(levelId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function deleteLevel(levelId) {
  return parseResponse(
    await fetch(`${BASE}/levels/${encodeURIComponent(levelId)}`, {
      method: "DELETE",
    }),
  );
}

export async function createLesson(levelId, payload) {
  return parseResponse(
    await fetch(`${BASE}/levels/${encodeURIComponent(levelId)}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function updateLesson(lessonId, payload) {
  return parseResponse(
    await fetch(`${BASE}/lessons/${encodeURIComponent(lessonId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function deleteLesson(lessonId) {
  return parseResponse(
    await fetch(`${BASE}/lessons/${encodeURIComponent(lessonId)}`, {
      method: "DELETE",
    }),
  );
}

export async function requestTts({ text, language = "fr" }) {
  return parseResponse(
    await fetch(`${BASE}/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language }),
    }),
  );
}
