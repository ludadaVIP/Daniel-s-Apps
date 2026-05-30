const BASE = "/api/investment";

async function parse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
  return data;
}

export async function fetchMeta() {
  return parse(await fetch(`${BASE}/meta`));
}

// ---------- watchlist ----------

export async function fetchWatchlist() {
  return parse(await fetch(`${BASE}/workbench/watchlist`));
}

export async function createWatchlistItem(payload) {
  return parse(
    await fetch(`${BASE}/workbench/watchlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function updateWatchlistItem(id, payload) {
  return parse(
    await fetch(`${BASE}/workbench/watchlist/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function deleteWatchlistItem(id) {
  return parse(
    await fetch(`${BASE}/workbench/watchlist/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
  );
}

// ---------- decision journal ----------

export async function fetchJournal() {
  return parse(await fetch(`${BASE}/workbench/journal`));
}

export async function createJournalEntry(payload) {
  return parse(
    await fetch(`${BASE}/workbench/journal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function updateJournalEntry(id, payload) {
  return parse(
    await fetch(`${BASE}/workbench/journal/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function deleteJournalEntry(id) {
  return parse(
    await fetch(`${BASE}/workbench/journal/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
  );
}

// ---------- knowledge ----------

export async function fetchKnowledgeTree() {
  return parse(await fetch(`${BASE}/knowledge/tree`));
}

export async function fetchKnowledgeDoc(path) {
  const url = `${BASE}/knowledge/doc?path=${encodeURIComponent(path)}`;
  return parse(await fetch(url));
}

// ---------- models ----------

export async function fetchModels() {
  return parse(await fetch(`${BASE}/models`));
}

export async function fetchModel(slug) {
  return parse(await fetch(`${BASE}/models/${encodeURIComponent(slug)}`));
}

// ---------- brief ----------

export async function fetchBriefList() {
  return parse(await fetch(`${BASE}/brief/list`));
}

export async function fetchBriefDoc(path) {
  return parse(await fetch(`${BASE}/brief/doc?path=${encodeURIComponent(path)}`));
}

// ---------- search ----------

export async function searchContent(query) {
  const url = `${BASE}/search?q=${encodeURIComponent(query)}`;
  return parse(await fetch(url));
}
