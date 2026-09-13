const WORKSPACE_PREFIX = '#/app/insight';

function workspaceRoute() {
  const hash = location.hash;
  if (hash === WORKSPACE_PREFIX) return '';
  if (hash.startsWith(WORKSPACE_PREFIX + '/')) return hash.slice(WORKSPACE_PREFIX.length + 1);
  return null;
}

export function getInsightRoute() {
  const raw = workspaceRoute() ?? location.hash.slice(1);
  try {
    return decodeURIComponent(raw);
  } catch {
    return '';
  }
}

export function insightHash(route = '') {
  const workspace = workspaceRoute() !== null;
  const encoded = encodeURIComponent(route).replace(/%2F/g, '/');
  return workspace ? `${WORKSPACE_PREFIX}/${encoded}` : `#${encoded}`;
}

export function navigateInsight(route = '') {
  location.hash = insightHash(route).slice(1);
}
