const API_ROOT = '/api';

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

export function getConfig(signal) {
  return request('/config', { signal });
}

export function getChapter(bookId, chapter, signal, translation = 'cuv') {
  const path = translation === 'cuv'
    ? `/chapters/${pathPart(bookId)}/${chapter}`
    : `/translations/${pathPart(translation)}/chapters/${pathPart(bookId)}/${chapter}`;
  return request(path, { signal });
}

export function getNote(target, signal) {
  const versePart = target.verse ? `/${target.verse}` : '';
  return request(`/notes/${pathPart(target.bookId)}/${target.chapter}${versePart}`, { signal });
}

export function putNote(target, content) {
  const versePart = target.verse ? `/${target.verse}` : '';
  return request(`/notes/${pathPart(target.bookId)}/${target.chapter}${versePart}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  });
}

export function getNoteIndex(bookId, chapter, signal) {
  const chapterPart = chapter ? `?chapter=${chapter}` : '';
  return request(`/note-index/${pathPart(bookId)}${chapterPart}`, { signal });
}

export function getQuestions(bookId, chapter, signal) {
  return request(`/questions/${pathPart(bookId)}/${chapter}`, { signal });
}

export function putQuestions(bookId, chapter, content) {
  return request(`/questions/${pathPart(bookId)}/${chapter}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  });
}
