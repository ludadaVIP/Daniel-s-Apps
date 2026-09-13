const BASE = '/html-library';

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || '书库暂时无法响应，请稍后重试。');
  return payload;
}

export function listDocuments({ refresh = false } = {}) {
  return request(`/api/documents${refresh ? '?refresh=1' : ''}`);
}

export function getDocument(id) {
  return request(`/api/documents/${encodeURIComponent(id)}`);
}

export function saveDocumentMetadata(id, metadata) {
  return request(`/api/documents/${encodeURIComponent(id)}/metadata`, {
    method: 'PATCH',
    body: JSON.stringify(metadata),
  });
}

export function recordDocumentOpen(id) {
  return request(`/api/documents/${encodeURIComponent(id)}/open`, { method: 'POST' });
}

export function openLibraryFolder() {
  return request('/api/library/open', { method: 'POST' });
}

export function documentUrl(id) {
  return `${BASE}/document/${encodeURIComponent(id)}`;
}
