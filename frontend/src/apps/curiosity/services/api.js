const BASE = "/api/curiosity";

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
  return data;
}

export async function fetchCategories() {
  return parseResponse(await fetch(`${BASE}/categories`));
}

export async function fetchSubcategory(subcategoryId) {
  return parseResponse(await fetch(`${BASE}/subcategory/${encodeURIComponent(subcategoryId)}`));
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
