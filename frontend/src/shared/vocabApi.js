async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
  return data;
}

/**
 * Factory for the per-app vocab API client. Mirrors the shape of
 * `createNineHundredApi` so we stay consistent across apps.
 *
 *   const api = createVocabApi("/api/esp-vocab");
 *   api.fetchLevels();
 *   api.fetchLevel("a1");
 *   api.fetchGroup("a1", "group-1");
 *   api.requestTts({ text, language });
 */
export function createVocabApi(base) {
  return {
    async fetchLevels() {
      return parseResponse(await fetch(`${base}/levels`));
    },

    async fetchLevel(levelId) {
      return parseResponse(
        await fetch(`${base}/levels/${encodeURIComponent(levelId)}`),
      );
    },

    async fetchGroup(levelId, groupId) {
      return parseResponse(
        await fetch(
          `${base}/levels/${encodeURIComponent(levelId)}/groups/${encodeURIComponent(groupId)}`,
        ),
      );
    },

    async requestTts({ text, language }) {
      return parseResponse(
        await fetch(`${base}/tts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, language }),
        }),
      );
    },
  };
}
