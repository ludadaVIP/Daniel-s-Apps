import net from 'node:net';

const RETRY_DELAY_MS = 200;
const MAX_WAIT_MS = 30_000;

function isListening(endpoint) {
  return new Promise((resolve) => {
    const socket = net.connect({ host: endpoint.hostname, port: Number(endpoint.port) || 80 });
    socket.setTimeout(1_000);
    socket.once('connect', () => { socket.destroy(); resolve(true); });
    socket.once('error', () => resolve(false));
    socket.once('timeout', () => { socket.destroy(); resolve(false); });
  });
}

function pause(ms, signal) {
  return new Promise((resolve) => {
    if (signal.aborted) return resolve();
    const finish = () => { clearTimeout(timer); signal.removeEventListener('abort', finish); resolve(); };
    const timer = setTimeout(finish, ms);
    signal.addEventListener('abort', finish, { once: true });
  });
}

// Vite starts independently of the API, and `node --watch` briefly closes the
// API socket on every restart. Hold proxy requests until it listens again.
export function waitForDevApi(proxyConfig) {
  const routes = Object.entries(proxyConfig).map(([prefix, value]) => ({
    prefix,
    endpoint: new URL(typeof value === 'string' ? value : value.target),
  }));
  return async (request, response, next) => {
    const pathname = request.url?.split(/[?#]/, 1)[0] || '';
    const route = routes.find(({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`));
    if (!route) return next();

    const controller = new AbortController();
    response.once('close', () => controller.abort());
    const deadline = Date.now() + MAX_WAIT_MS;
    while (!controller.signal.aborted) {
      if (await isListening(route.endpoint)) {
        if (!controller.signal.aborted) next();
        return;
      }
      if (Date.now() >= deadline) {
        if (!controller.signal.aborted) response.writeHead(503).end('NodeApps API is still starting.');
        return;
      }
      await pause(RETRY_DELAY_MS, controller.signal);
    }
  };
}
