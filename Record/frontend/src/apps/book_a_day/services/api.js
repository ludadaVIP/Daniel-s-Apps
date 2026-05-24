const BASE = "/api/book-a-day";

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

export async function createShelf(payload) {
  return parseResponse(
    await fetch(`${BASE}/shelves`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function updateShelf(shelfId, payload) {
  return parseResponse(
    await fetch(`${BASE}/shelves/${encodeURIComponent(shelfId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function deleteShelf(shelfId) {
  return parseResponse(
    await fetch(`${BASE}/shelves/${encodeURIComponent(shelfId)}`, {
      method: "DELETE",
    }),
  );
}

export async function createBook(payload) {
  return parseResponse(
    await fetch(`${BASE}/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function fetchBook(bookId) {
  return parseResponse(
    await fetch(`${BASE}/books/${encodeURIComponent(bookId)}`),
  );
}

export async function updateBook(bookId, payload) {
  return parseResponse(
    await fetch(`${BASE}/books/${encodeURIComponent(bookId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function deleteBook(bookId) {
  return parseResponse(
    await fetch(`${BASE}/books/${encodeURIComponent(bookId)}`, {
      method: "DELETE",
    }),
  );
}

export async function fetchMaterials(bookId) {
  return parseResponse(
    await fetch(`${BASE}/books/${encodeURIComponent(bookId)}/materials`),
  );
}

export async function requestTts({ text, language, voice }) {
  return parseResponse(
    await fetch(`${BASE}/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language, voice }),
    }),
  );
}
