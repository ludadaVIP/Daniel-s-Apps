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

  const ready = async () => {
    if (target) return target;
    loading ??= load();
    try {
      target = await loading;
      return target;
    } catch (error) {
      loading = undefined;
      throw error;
    }
  };

  return {
    ready,
    handler: async (request, response, next) => {
      try {
        return (await ready())(request, response, next);
      } catch (error) {
        next(error);
      }
    },
  };
}

app.get('/api/health', (_request, response) => response.json({ ok: true, service: 'NodeApps' }));

const appMounts = {
  'belief-qa': lazyMount(async () => {
    const module = await import('../apps/BeliefQandA/server/index.js');
    await module.initializeBeliefQA();
    return module.app;
  }),

  'world-qa': lazyMount(async () => {
    const module = await import('../apps/WorldQandA/server/index.js');
    await module.initializeWorldQA();
    return module.app;
  }),

  insight: lazyMount(async () => {
    const { createApp } = await import('../apps/insight/server/app.js');
    return createApp({
      contentDirectory: path.join(root, 'apps', 'insight', 'content'),
      databasePath: path.join(root, 'apps', 'insight', 'data', 'insightmatrix.sqlite'),
    });
  }),

  notebook: lazyMount(async () => {
    const module = await import('../apps/notebook/server/index.js');
    await module.initializeNotebook();
    return module.app;
  }),

  'html-library': lazyMount(async () => {
    const module = await import('../apps/html-library/server/index.js');
    await module.initializeHtmlLibrary();
    return module.createHtmlLibraryApp();
  }),

  bible: lazyMount(async () => {
    const module = await import('../apps/bible/server/index.js');
    await module.initializeBibleDevotion();
    return module.app;
  }),

  'bible-parallel': lazyMount(async () => {
    const module = await import('../apps/bible-parallel/server/index.js');
    return module.app;
  }),

  'recall-verses': lazyMount(async () => {
    const module = await import('../apps/recall-verses/server/index.js');
    await module.initializeRecallVerses();
    return module.app;
  }),

  investment: lazyMount(async () => {
    const module = await import('../apps/investment/server/index.js');
    await module.initializeInvestment();
    return module.createInvestmentApp();
  }),
};

app.get('/api/apps/:appId/health', async (request, response, next) => {
  const mount = appMounts[request.params.appId];
  if (!mount) return response.status(404).json({ error: '未知的子应用。' });
  try {
    await mount.ready();
    response.json({ ok: true, app: request.params.appId });
  } catch (error) {
    next(error);
  }
});

for (const [appId, mount] of Object.entries(appMounts)) {
  app.use(`/${appId}`, mount.handler);
}

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
