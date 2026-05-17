async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
  return data;
}

export function createNineHundredApi(base) {
  return {
    async fetchGroups() {
      return parseResponse(await fetch(`${base}/groups`));
    },

    async fetchGroup(groupId) {
      return parseResponse(await fetch(`${base}/groups/${encodeURIComponent(groupId)}`));
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

    async importGroup(content) {
      return parseResponse(
        await fetch(`${base}/groups/import`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        }),
      );
    },

    async deleteGroup(groupId) {
      return parseResponse(
        await fetch(`${base}/groups/${encodeURIComponent(groupId)}`, {
          method: "DELETE",
        }),
      );
    },
  };
}
