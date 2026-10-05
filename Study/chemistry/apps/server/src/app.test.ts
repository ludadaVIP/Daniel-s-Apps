import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Server } from 'node:http';
import { app } from './app';

describe('GET /health', () => {
  let server: Server;
  let url: string;

  beforeAll(async () => {
    server = app.listen(0);
    const address = server.address();
    if (!address || typeof address === 'string')
      throw new Error('No test port');
    url = `http://127.0.0.1:${address.port}/health`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('returns a healthy chemistry response', async () => {
    const response = await fetch(url);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: 'ok',
      subject: 'chemistry',
    });
  });
});
