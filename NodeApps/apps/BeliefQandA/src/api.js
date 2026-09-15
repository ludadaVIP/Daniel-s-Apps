const API_ROOT = '/belief-qa/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_ROOT}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || '无法读取 BeliefQ&A 的本地资料。');
  return payload;
}

export const getQuestions = () => request('/questions');
export const getAnswer = (id) => request(`/questions/${encodeURIComponent(id)}/answer`);
export const saveAnswer = (id, layers) => request(`/questions/${encodeURIComponent(id)}/answer`, {
  method: 'PUT', body: JSON.stringify({ layers }),
});
export const deleteAnswer = (id, layerId) => request(`/questions/${encodeURIComponent(id)}/answer/${encodeURIComponent(layerId)}`, { method: 'DELETE' });
