const BASE = "/api/bible";

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
  return data;
}

export async function fetchVersions() {
  return parseResponse(await fetch(`${BASE}/versions`));
}

export async function fetchBooks(version) {
  return parseResponse(
    await fetch(`${BASE}/books?version=${encodeURIComponent(version)}`)
  );
}

export async function fetchRandomVerse({ version, books, verseNumbers = [], paragraphFirst = false }) {
  const params = new URLSearchParams({ version });
  if (books && books.length) {
    params.set("books", books.join(","));
  }
  if (verseNumbers.length) {
    params.set("verses", verseNumbers.join(","));
  }
  if (paragraphFirst) {
    params.set("paragraphFirst", "1");
  }
  return parseResponse(await fetch(`${BASE}/random?${params.toString()}`));
}

export async function fetchParagraph({ version, book, chapter, verse }) {
  const params = new URLSearchParams({
    version,
    book,
    chapter: String(chapter),
    verse: String(verse),
  });
  return parseResponse(await fetch(`${BASE}/paragraph?${params.toString()}`));
}
