const BASE = "/api/nz-invest";

async function parse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
  return data;
}

export async function fetchLibrary() {
  return parse(await fetch(`${BASE}/library`));
}

export async function fetchDocument(path) {
  return parse(await fetch(`${BASE}/doc?path=${encodeURIComponent(path)}`));
}

