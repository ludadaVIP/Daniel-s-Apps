const BASE = "/api/save-md";

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

export async function createCategory(payload) {
  return parseResponse(
    await fetch(`${BASE}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function updateCategory(categoryId, payload) {
  return parseResponse(
    await fetch(`${BASE}/categories/${encodeURIComponent(categoryId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function deleteCategory(categoryId) {
  return parseResponse(
    await fetch(`${BASE}/categories/${encodeURIComponent(categoryId)}`, {
      method: "DELETE",
    }),
  );
}

export async function fetchDocument(categoryId, documentId) {
  return parseResponse(
    await fetch(`${BASE}/categories/${encodeURIComponent(categoryId)}/documents/${encodeURIComponent(documentId)}`),
  );
}

export async function createDocument(categoryId, payload) {
  return parseResponse(
    await fetch(`${BASE}/categories/${encodeURIComponent(categoryId)}/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function updateDocument(categoryId, documentId, payload) {
  return parseResponse(
    await fetch(`${BASE}/categories/${encodeURIComponent(categoryId)}/documents/${encodeURIComponent(documentId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function deleteDocument(categoryId, documentId) {
  return parseResponse(
    await fetch(`${BASE}/categories/${encodeURIComponent(categoryId)}/documents/${encodeURIComponent(documentId)}`, {
      method: "DELETE",
    }),
  );
}

export async function requestTts({ text, language }) {
  return parseResponse(
    await fetch(`${BASE}/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language }),
    }),
  );
}
