async function parseResponse(responseOrPromise) {
  const response = await responseOrPromise;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
  return data;
}

export function createFreeLanguageApi(baseUrl) {
  const base = String(baseUrl || "").replace(/\/$/, "");

  return {
    fetchLibrary() {
      return parseResponse(fetch(`${base}/library`));
    },

    fetchLesson(lessonId) {
      return parseResponse(fetch(`${base}/lessons/${encodeURIComponent(lessonId)}`));
    },

    createLevel(payload) {
      return parseResponse(
        fetch(`${base}/levels`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      );
    },

    updateLevel(levelId, payload) {
      return parseResponse(
        fetch(`${base}/levels/${encodeURIComponent(levelId)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      );
    },

    deleteLevel(levelId) {
      return parseResponse(
        fetch(`${base}/levels/${encodeURIComponent(levelId)}`, {
          method: "DELETE",
        }),
      );
    },

    createLesson(levelId, payload) {
      return parseResponse(
        fetch(`${base}/levels/${encodeURIComponent(levelId)}/lessons`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      );
    },

    updateLesson(lessonId, payload) {
      return parseResponse(
        fetch(`${base}/lessons/${encodeURIComponent(lessonId)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      );
    },

    deleteLesson(lessonId) {
      return parseResponse(
        fetch(`${base}/lessons/${encodeURIComponent(lessonId)}`, {
          method: "DELETE",
        }),
      );
    },

    requestTts({ lessonId, text, language = "fr", voice }) {
      return parseResponse(
        fetch(`${base}/tts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId, text, language, voice }),
        }),
      );
    },
  };
}
