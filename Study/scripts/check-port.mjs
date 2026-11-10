import { createServer } from 'node:net';

export function assertPortAvailable(port, host) {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once('error', (error) => {
      reject(
        new Error(
          error.code === 'EADDRINUSE'
            ? `Study cannot start: port ${port} is already in use by another service. Close that service and restart Study.`
            : `Study cannot bind to ${host}:${port}: ${error.message}`,
          { cause: error },
        ),
      );
    });
    probe.listen({ port, host, exclusive: true }, () => {
      probe.close((error) => (error ? reject(error) : resolve()));
    });
  });
}
