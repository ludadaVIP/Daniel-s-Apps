export function createQuestionApi(apiRoot, fallbackError = '无法读取本地题库资料。') {
  async function request(path, options = {}) {
    const response = await fetch(`${apiRoot}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || fallbackError);
    return payload;
  }
  return {
    getQuestions: () => request('/questions'),
    getAnswer: (id) => request(`/questions/${encodeURIComponent(id)}/answer`),
    saveAnswer: (id, layers) => request(`/questions/${encodeURIComponent(id)}/answer`, { method: 'PUT', body: JSON.stringify({ layers }) }),
    deleteAnswer: (id, layerId) => request(`/questions/${encodeURIComponent(id)}/answer/${encodeURIComponent(layerId)}`, { method: 'DELETE' }),
  };
}

export const { getQuestions, getAnswer, saveAnswer, deleteAnswer } = createQuestionApi('/belief-qa/api', '无法读取 BeliefQ&A 的本地资料。');
