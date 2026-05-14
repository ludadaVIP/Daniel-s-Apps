/**
 * Build a namespaced API URL.
 *
 *   apiUrl('french', '/lessons/alphabet')
 *     -> '/api/french/lessons/alphabet'
 *
 * Every sub-app uses its own prefix so route collisions across the four
 * merged apps are impossible.
 */
export function apiUrl(app, path) {
  if (!path) return `/api/${app}`;
  return `/api/${app}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Slim fetch wrapper that returns parsed JSON and throws on non-2xx
 * responses, mirroring the bespoke parseResponse helpers each sub-app
 * previously had. Sub-apps that want their original behaviour can keep
 * calling fetch() directly.
 */
export async function callApi(url, options = {}) {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload.error || `Request failed with ${response.status}`;
    throw new Error(message);
  }
  return payload;
}
