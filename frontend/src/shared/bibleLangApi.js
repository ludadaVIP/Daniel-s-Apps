// Shared HTTP layer for the Bible-and-<language> family. Every call takes a
// `lang` so the same backend blueprint (/api/bible-lang) can serve Eng,
// Esp, FR, GE — keeping the frontend reusable across the four sibling apps.

const BASE = "/api/bible-lang";

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
  return data;
}

// Study notes can be added while the development app remains open.  Never
// reuse a previously cached chapter response: otherwise a browser can keep
// showing the old “not filled in yet” state for its full cache lifetime.
const FRESH_REQUEST = { cache: "no-store" };

export async function fetchConfig(lang) {
  return parseResponse(
    await fetch(`${BASE}/config?lang=${encodeURIComponent(lang)}`, FRESH_REQUEST)
  );
}

export async function fetchChapter({ lang, book, chapter }) {
  const params = new URLSearchParams({
    lang,
    book,
    chapter: String(chapter),
  });
  return parseResponse(
    await fetch(`${BASE}/chapter?${params.toString()}`, FRESH_REQUEST)
  );
}

export async function requestTtsAudio({ lang, text, voice }) {
  const payload = { lang, text };
  if (voice) payload.voice = voice;
  return parseResponse(
    await fetch(`${BASE}/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );
}
