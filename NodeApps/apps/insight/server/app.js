import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { loadContent } from './content.js';
import { createStateStore, ValidationError } from './state.js';

const root = fileURLToPath(new URL('../', import.meta.url));

export function createApp({ contentDirectory = path.join(root, 'content'), databasePath = process.env.DATABASE_PATH || path.join(root, 'data', 'insightmatrix.sqlite'), distDirectory = path.join(root, 'dist') } = {}) {
  const articles = loadContent(contentDirectory);
  const store = createStateStore(databasePath, new Set(articles.map((article) => article.id)));
  // In development the Vite UI (5757) proxies API calls to the Node process (5758).
  // Keep the allow-list exact so the proxy works without opening the API to other sites.
  const developmentOrigins = new Set(['http://127.0.0.1:5757', 'http://localhost:5757', 'http://127.0.0.1:5888', 'http://localhost:5888']);
  const app = express();
  app.disable('x-powered-by');
  app.locals.close = () => store.close();
  app.use((_request, response, next) => {
    response.set('X-Content-Type-Options', 'nosniff');
    response.set('Referrer-Policy', 'same-origin');
    next();
  });
  app.use('/api', (request, response, next) => {
    response.set('Cache-Control', 'no-store');
    // Browsers must use the same origin (Vite proxies /api during development).
    if (request.get('sec-fetch-site') === 'cross-site') return response.status(403).json({ error: '不接受跨站请求' });
    const origin = request.get('origin');
    if (origin) {
      try {
        const parsed = new URL(origin);
        if (parsed.host !== request.get('host') && !developmentOrigins.has(origin)) return response.status(403).json({ error: '不接受跨站请求' });
      } catch { return response.status(403).json({ error: '无效的请求来源' }); }
    }
    next();
  });
  app.use(express.json({ limit: '1mb', strict: true }));
  app.get('/api/health', (_request, response) => response.json({ status: 'ok', articles: articles.length }));
  app.get('/api/content', (_request, response) => response.json({ articles }));
  app.get('/api/content/:id', (request, response) => {
    const article = articles.find((entry) => entry.id === request.params.id);
    if (!article) return response.status(404).json({ error: '文章不存在' });
    response.json(article);
  });
  app.get('/api/state', (_request, response) => response.json(store.get()));
  app.patch('/api/state', (request, response) => {
    if (!request.is('application/json')) return response.status(415).json({ error: '请使用 application/json' });
    response.json(store.patch(request.body));
  });
  app.use('/api', (_request, response) => response.status(404).json({ error: 'API 不存在' }));
  if (fs.existsSync(path.join(distDirectory, 'index.html'))) {
    app.use(express.static(distDirectory, { index: false }));
    app.use((request, response, next) => {
      if (request.method === 'GET' && request.accepts('html') && !path.extname(request.path)) return response.sendFile(path.join(distDirectory, 'index.html'));
      next();
    });
  }
  app.use((_request, response) => response.status(404).json({ error: '页面不存在；开发环境请访问 Vite 地址，生产环境请先 npm run build' }));
  app.use((error, _request, response, _next) => {
    if (error instanceof ValidationError) return response.status(400).json({ error: error.message });
    if (error.type === 'entity.parse.failed') return response.status(400).json({ error: 'JSON 格式无效' });
    if (error.type === 'entity.too.large') return response.status(413).json({ error: '请求内容过大' });
    console.error('[InsightMatrix]', error);
    response.status(500).json({ error: '保存或读取失败，请检查服务端日志；已有数据未被重置' });
  });
  return app;
}
