import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { loadContent } from './content.js';
import { createStore } from './store.js';

const root = fileURLToPath(new URL('../', import.meta.url));
export function createApp({ contentDirectory = path.join(root, 'content'), databasePath = process.env.INVEST_MASTER_DB || path.join(root, 'data', 'invest-master.sqlite'), distDirectory = path.join(root, 'dist') } = {}) {
  const content = loadContent(contentDirectory);
  const ids = new Set(content.map((item) => item.id));
  const lessons = new Map(content.filter((item) => item.type === 'lessons').map((item) => [item.id, item]));
  const sealedCases = new Map(content.filter((item) => item.type === 'cases' && item.brief).map((item) => [item.id, item]));
  const store = createStore(databasePath);
  const app = express();
  app.disable('x-powered-by');
  app.locals.close = store.close;
  app.use(express.json({ limit: '256kb' }));
  app.use('/api', (request, response, next) => {
    response.set('Cache-Control', 'no-store');
    if (request.get('sec-fetch-site') === 'cross-site') return response.status(403).json({ error: '不接受跨站请求' });
    next();
  });
  app.get('/api/health', (_request, response) => response.json({ ok: true, content: content.length }));
  app.get('/api/content', (_request, response) => response.json({ items: content.map((item) => sealedCases.has(item.id) ? { ...item, body: '' } : item) }));
  app.get('/api/state', (_request, response) => response.json(store.get()));
  app.get('/api/case-analysis/:id', (request, response) => {
    const item = sealedCases.get(request.params.id);
    if (!item) return response.status(404).json({ error: '封题案例不存在' });
    if (!store.hasCaseAttempt(item.id)) return response.status(403).json({ error: '先封存首次答卷，才能查看参考推导' });
    response.json({ body: item.body });
  });
  app.patch('/api/state', (request, response) => {
    const { kind, id, value } = request.body || {};
    if (!['complete', 'bookmark', 'note', 'framework', 'answer', 'review', 'caseAttempt'].includes(kind) || typeof id !== 'string') return response.status(400).json({ error: '操作无效' });
    if (kind === 'framework' && !['objective', 'horizon', 'circle', 'quality', 'valuation', 'risk', 'sizing', 'sell', 'behavior'].includes(id)) return response.status(400).json({ error: '框架章节无效' });
    if (kind !== 'framework' && !ids.has(id)) return response.status(404).json({ error: '内容不存在' });
    if (['note', 'framework'].includes(kind) && (typeof value !== 'string' || value.length > 20000)) return response.status(400).json({ error: '文字长度无效' });
    if (kind === 'caseAttempt') {
      if (!sealedCases.has(id)) return response.status(400).json({ error: '此内容不是封题案例' });
      if (typeof value !== 'string' || value.trim().length < 120 || value.length > 20000) return response.status(400).json({ error: '首次答卷至少需要 120 字，最多 20000 字' });
      if (store.hasCaseAttempt(id)) return response.status(409).json({ error: '首次答卷已封存；可以在决策卡中继续修订笔记' });
    }
    if (['complete', 'bookmark'].includes(kind) && typeof value !== 'boolean') return response.status(400).json({ error: '状态无效' });
    if (kind === 'review' && (!['again', 'hard', 'good', 'easy'].includes(value) || !content.find((item) => item.id === id && item.type === 'concepts'))) return response.status(400).json({ error: '复习评分无效' });
    if (kind === 'answer') {
      const quiz = lessons.get(id)?.quiz || [];
      const question = quiz.find((entry) => entry.id === value?.questionId);
      if (!question || !Number.isInteger(value.choice) || value.choice < 0 || value.choice >= question.options.length) return response.status(400).json({ error: '答案无效' });
      value.correct = value.choice === question.answer;
    }
    if (kind === 'complete' && value === true && lessons.has(id)) {
      const current = store.get();
      const lesson = lessons.get(id);
      const quiz = lesson.quiz || [];
      const passed = quiz.length > 0 && quiz.every((question) => current.answers.some((answer) => answer.lessonId === id && answer.questionId === question.id && answer.correct));
      const note = current.notes.find((entry) => entry.id === id)?.body || '';
      const minimumNoteChars = Number.isInteger(lesson.minimumNoteChars) ? lesson.minimumNoteChars : 20;
      if (!passed || note.trim().length < minimumNoteChars) return response.status(400).json({ error: `请先答对 ${quiz.length} 道题，并保存至少 ${minimumNoteChars} 字的应用笔记` });
    }
    response.json(store.update({ kind, id, value }));
  });
  app.use('/api', (_request, response) => response.status(404).json({ error: 'API 不存在' }));
  if (fs.existsSync(path.join(distDirectory, 'index.html'))) {
    app.use(express.static(distDirectory, { index: false }));
    app.get('/{*splat}', (request, response, next) => request.accepts('html') ? response.sendFile(path.join(distDirectory, 'index.html')) : next());
  }
  app.use((error, _request, response, _next) => {
    console.error('[InvestMaster]', error);
    response.status(error.status || 500).json({ error: '保存或读取失败，请查看服务端日志' });
  });
  return app;
}
