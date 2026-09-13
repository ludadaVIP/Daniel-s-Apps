import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const production = process.env.NODE_ENV === 'production' || process.argv.includes('--production');
const port = Number(process.env.PORT) || (production ? 5888 : 5889);
const app = express();
app.disable('x-powered-by');

function lazyMount(load) {
  let target;
  let loading;
  return async (request, response, next) => {
    try {
      if (!target) {
        loading ??= load();
        target = await loading;
      }
      return target(request, response, next);
    } catch (error) {
      loading = undefined;
      next(error);
    }
  };
}

app.get('/api/health', (_request, response) => response.json({ ok: true, service: 'NodeApps' }));

app.use('/insight', lazyMount(async () => {
  const { createApp } = await import('../apps/insight/server/app.js');
  return createApp({
    contentDirectory: path.join(root, 'apps', 'insight', 'content'),
    databasePath: path.join(root, 'apps', 'insight', 'data', 'insightmatrix.sqlite'),
  });
}));

app.use('/notebook', lazyMount(async () => {
  const module = await import('../apps/notebook/server/index.js');
  await module.initializeNotebook();
  return module.app;
}));

app.use('/html-library', lazyMount(async () => {
  const module = await import('../apps/html-library/server/index.js');
  await module.initializeHtmlLibrary();
  return module.createHtmlLibraryApp();
}));

app.use('/bible', lazyMount(async () => {
  const module = await import('../apps/bible/server/index.js');
  await module.initializeBibleDevotion();
  return module.app;
}));

app.use('/recall-verses', lazyMount(async () => {
  const module = await import('../apps/recall-verses/server/index.js');
  await module.initializeRecallVerses();
  return module.app;
}));

app.use('/investment', lazyMount(async () => {
  const module = await import('../apps/investment/server/index.js');
  await module.initializeInvestment();
  return module.createInvestmentApp();
}));

if (production) {
  const dist = path.join(root, 'dist');
  app.use(express.static(dist, { index: false }));
  app.get('/{*splat}', (_request, response) => response.sendFile(path.join(dist, 'index.html')));
}

app.use((error, _request, response, _next) => {
  console.error('[NodeApps]', error);
  response.status(error.status || 500).json({ error: error.status ? error.message : '本地应用无法启动，请检查终端日志。' });
});

app.listen(port, '127.0.0.1', () => console.log(`NodeApps API: http://127.0.0.1:${port}`));
