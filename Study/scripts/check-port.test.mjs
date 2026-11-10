import assert from 'node:assert/strict';
import { createServer } from 'node:net';
import test from 'node:test';
import { assertPortAvailable } from './check-port.mjs';

test('reports an occupied port without stopping the other service', async (t) => {
  const service = createServer();
  await new Promise((resolve) => service.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => service.close(resolve)));
  const { port } = service.address();

  await assert.rejects(assertPortAvailable(port, '127.0.0.1'), {
    message: `Study cannot start: port ${port} is already in use by another service. Close that service and restart Study.`,
  });
  assert.equal(service.listening, true);
});

test('releases an available port so the app can start', async () => {
  const service = createServer();
  await new Promise((resolve) => service.listen(0, '127.0.0.1', resolve));
  const { port } = service.address();
  await new Promise((resolve) => service.close(resolve));

  await assertPortAvailable(port, '127.0.0.1');
  await new Promise((resolve, reject) => {
    service.once('error', reject);
    service.listen(port, '127.0.0.1', resolve);
  });
  await new Promise((resolve) => service.close(resolve));
});
