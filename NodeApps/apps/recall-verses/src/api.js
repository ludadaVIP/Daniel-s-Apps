const API_ROOT = '/recall-verses/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_ROOT}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
    ...options,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || '请求未完成。');
  return body;
}

const pathPart = (value) => encodeURIComponent(value);

export const getConfig = (signal) => request('/config', { signal });
export const getChapter = (bookId, chapter, signal) => request(`/chapters/${pathPart(bookId)}/${chapter}`, { signal });
export const getRecallState = (bookId, chapter, signal) => request(`/recall/${pathPart(bookId)}/${chapter}`, { signal });
export const getRecallSummary = (bookId, signal) => request(`/recall-summary/${pathPart(bookId)}`, { signal });
export const saveRecallState = (bookId, chapter, hiddenVerses, paintedVerses) => request(`/recall/${pathPart(bookId)}/${chapter}`, {
  method: 'PUT',
  body: JSON.stringify({ hiddenVerses, paintedVerses }),
});
