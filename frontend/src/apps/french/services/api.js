const BASE = "/api/french";

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
  return data;
}

export async function fetchRoadmap() {
  return parseResponse(await fetch(`${BASE}/roadmap`));
}

export async function fetchProgress() {
  return parseResponse(await fetch(`${BASE}/progress`));
}

export async function fetchLesson(lessonId) {
  return parseResponse(
    await fetch(`${BASE}/lessons/${encodeURIComponent(lessonId)}`)
  );
}

export async function saveProgress(progress) {
  return parseResponse(
    await fetch(`${BASE}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(progress),
    })
  );
}

export async function requestTts({ key, lessonId, text }) {
  const response = await fetch(`${BASE}/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, lessonId, text }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "法语音频生成失败。");
  }
  return data;
}
