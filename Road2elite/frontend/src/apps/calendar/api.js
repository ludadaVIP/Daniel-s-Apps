const BASE = "/api/calendar";

async function parse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "操作没有完成。")
  return data;
}

export function fetchNotes() {
  return fetch(`${BASE}/notes`).then(parse);
}

export function createNote(payload) {
  return fetch(`${BASE}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(parse);
}

export function updateNote(id, payload) {
  return fetch(`${BASE}/notes/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(parse);
}

export function deleteNote(id) {
  return fetch(`${BASE}/notes/${encodeURIComponent(id)}`, { method: "DELETE" }).then(parse);
}

export function searchNotes(query) {
  return fetch(`${BASE}/search?q=${encodeURIComponent(query)}`).then(parse);
}
