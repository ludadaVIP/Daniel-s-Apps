const BASE = "/api/german-900";

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
  return data;
}

export async function fetchGroups() {
  return parseResponse(await fetch(`${BASE}/groups`));
}

export async function fetchGroup(groupId) {
  return parseResponse(
    await fetch(`${BASE}/groups/${encodeURIComponent(groupId)}`)
  );
}

export async function requestTts({ text, language }) {
  return parseResponse(
    await fetch(`${BASE}/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language }),
    })
  );
}

export async function importGroup(content) {
  return parseResponse(
    await fetch(`${BASE}/groups/import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })
  );
}
