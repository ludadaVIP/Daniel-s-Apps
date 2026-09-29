import assert from 'node:assert/strict';
import { createServer as createHttpServer } from 'node:http';
import { test } from 'node:test';
import { createServer as createViteServer } from 'vite';

function listen(server, port = 0) {
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server.address().port)));
}

function close(server) {
  server.closeAllConnections();
  return new Promise((resolve) => server.close(resolve));
}

test('Vite holds app requests across API startup and restart', async () => {
  const api = createHttpServer((_request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ items: [{ id: 'ready' }] }));
  });
  const apiPort = await listen(api);
  await close(api);

  const vite = await createViteServer({
    server: {
      host: '127.0.0.1',
      port: 0,
      strictPort: false,
      proxy: { '/html-library': `http://127.0.0.1:${apiPort}` },
    },
  });
  await vite.listen();
  const base = `http://127.0.0.1:${vite.httpServer.address().port}`;
  const url = `${base}/html-library/api/documents?refresh=1`;
  try {
    const first = fetch(url);
    await new Promise((resolve) => setTimeout(resolve, 400));
    assert.equal(await Promise.race([first.then(() => 'returned'), new Promise((resolve) => setTimeout(() => resolve('waiting'), 100))]), 'waiting');
    assert.equal((await fetch(base)).status, 200);

    await listen(api, apiPort);
    const firstResponse = await first;
    assert.equal(firstResponse.status, 200);
    assert.deepEqual((await firstResponse.json()).items, [{ id: 'ready' }]);

    await close(api);
    const second = fetch(url);
    await new Promise((resolve) => setTimeout(resolve, 400));
    assert.equal(await Promise.race([second.then(() => 'returned'), new Promise((resolve) => setTimeout(() => resolve('waiting'), 100))]), 'waiting');

    await listen(api, apiPort);
    assert.equal((await second).status, 200);
  } finally {
    await vite.close();
    if (api.listening) await close(api);
  }
});
