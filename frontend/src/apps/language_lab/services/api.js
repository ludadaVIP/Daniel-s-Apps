const BASE = "/api/lab";

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
  return data;
}

async function parseTextResponse(response) {
  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { error: text || "Request failed." };
  }
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
  return data;
}

export async function fetchConfig() {
  return parseResponse(await fetch(`${BASE}/config`));
}

export async function fetchTopics({ language, skill }) {
  const params = new URLSearchParams({ language, skill });
  return parseResponse(await fetch(`${BASE}/topics?${params.toString()}`));
}

export async function requestTts({ text, language, skill, topicId, gender }) {
  return parseResponse(
    await fetch(`${BASE}/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language, skill, topicId, gender }),
    })
  );
}

export async function importTopics({ language, skill, rawText }) {
  const params = new URLSearchParams({ language, skill });
  return parseTextResponse(
    await fetch(`${BASE}/topics/import?${params.toString()}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: rawText,
    })
  );
}

export async function deleteTopic({ language, skill, topicId }) {
  return parseResponse(
    await fetch(`${BASE}/topics/${language}/${skill}/${encodeURIComponent(topicId)}`, {
      method: "DELETE",
    })
  );
}

export async function saveCoreTakeaway({ language, skill, topicId, coreTakeaway }) {
  return parseResponse(
    await fetch(`${BASE}/topics/${language}/${skill}/${encodeURIComponent(topicId)}/core-takeaway`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coreTakeaway }),
    })
  );
}
