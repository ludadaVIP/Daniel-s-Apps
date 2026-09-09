import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { createApp } from './app.js';
import { loadContent } from './content.js';

const fixtureMarkdown = `---
id: test-concept
title: 测试认知
category: psychology
type: concept
summary: 用反证检查自己的判断。
minutes: 5
difficulty: beginner
tags: [判断]
related: []
---
## 核心机制
${'提出一个可以证伪的判断，然后检查证据与反证。'.repeat(10)}
`;

async function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'insightmatrix-test-'));
  const options = { contentDirectory: path.join(directory, 'content'), databasePath: path.join(directory, 'data.sqlite'), distDirectory: path.join(directory, 'dist') };
  fs.mkdirSync(options.contentDirectory);
  fs.mkdirSync(options.distDirectory);
  fs.writeFileSync(path.join(options.contentDirectory, 'test-concept.md'), fixtureMarkdown);
  fs.writeFileSync(path.join(options.contentDirectory, 'README.md'), '# Not an article');
  fs.writeFileSync(path.join(options.distDirectory, 'index.html'), '<!doctype html><title>InsightMatrix</title>');
  const instances = [];
  const launch = async () => {
    const app = createApp(options);
    const server = app.listen(0, '127.0.0.1');
    await new Promise((resolve) => server.once('listening', resolve));
    const instance = { app, server, url: `http://127.0.0.1:${server.address().port}`, closed: false };
    instances.push(instance);
    instance.close = async () => {
      if (instance.closed) return;
      await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
      app.locals.close();
      instance.closed = true;
    };
    return instance;
  };
  t.after(async () => {
    for (const instance of instances) await instance.close();
    fs.rmSync(directory, { recursive: true, force: true });
  });
  return { ...(await launch()), launch, options };
}

const patch = (url, body, headers = {}) => fetch(`${url}/api/state`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
const timestamp = '2026-09-08T00:00:00.000Z';
const validAnswer = { text: '我的判断', question: '什么证据会改变你的判断？', savedAt: timestamp };
const validThesis = { id: 'one', title: '可证伪判断', judgement: '用户增长会达到 10%', evidence: '当前留存率稳定', counterEvidence: '市场竞争加剧', falsification: '下季收入低于目标', probability: 65, deadline: '2026-12-31', createdAt: timestamp, updatedAt: timestamp };
const originalSnapshot = (({ title, judgement, evidence, counterEvidence, falsification, probability, deadline }) => ({ title, judgement, evidence, counterEvidence, falsification, probability, deadline }))(validThesis);

test('content metadata, body, health and article routing', async (t) => {
  const { url } = await fixture(t);
  const response = await fetch(`${url}/api/content`);
  assert.equal(response.status, 200);
  const { articles } = await response.json();
  assert.equal(articles.length, 1);
  assert.equal(articles[0].category, 'psychology');
  assert.equal(articles[0].minutes, 5);
  assert.ok(articles[0].body.startsWith('## 核心机制'));
  assert.equal((await (await fetch(`${url}/api/content/test-concept`)).json()).id, 'test-concept');
  assert.equal((await fetch(`${url}/api/content/unknown`)).status, 404);
  assert.equal((await (await fetch(`${url}/api/health`)).json()).articles, 1);
});

test('state survives server restart; patches preserve unrelated state', async (t) => {
  const context = await fixture(t);
  const original = await (await fetch(`${context.url}/api/state`)).json();
  assert.deepEqual(original, { bookmarks: [], completed: [], answers: {}, theses: [], activity: [] });
  const first = await patch(context.url, { bookmarks: ['test-concept'], answers: { 'daily-2026-09-08': validAnswer }, theses: [{ ...validThesis, original: originalSnapshot, reviews: [{ id: 'review-one', date: timestamp, outcome: 'true', reflection: '目标实现，但原因是提价。' }] }], activity: [{ id: 'activity-one', type: 'thesis', date: timestamp, day: '2026-09-08' }] });
  assert.equal(first.status, 200);
  const next = await (await patch(context.url, { completed: ['test-concept'] })).json();
  assert.deepEqual(next.bookmarks, ['test-concept']);
  assert.equal(next.theses[0].probability, 65);
  await context.close();
  const restarted = await context.launch();
  assert.deepEqual(await (await fetch(`${restarted.url}/api/state`)).json(), next);
});

test('invalid writes are rejected atomically and cross-site requests are blocked', async (t) => {
  const { url } = await fixture(t);
  const valid = await (await patch(url, { bookmarks: ['test-concept'] })).json();
  for (const invalid of [
    { bookmarks: ['unknown'], completed: ['test-concept'] },
    { completed: 'test-concept' }, { bookmarks: ['test-concept', 'test-concept'] },
    { answers: [] }, { answers: { key: 7 } }, { answers: { key: 'a'.repeat(20001) } },
    { theses: [{ ...validThesis, probability: 101 }] }, { theses: [validThesis, validThesis] },
    { activity: [null] }, { secret: true }, {}, [],
  ]) assert.equal((await patch(url, invalid)).status, 400, JSON.stringify(invalid).slice(0, 100));
  assert.equal((await patch(url, { bookmarks: [] }, { Origin: 'https://evil.example' })).status, 403);
  assert.equal((await patch(url, { answers: {} }, { Origin: 'http://127.0.0.1:5757' })).status, 200);
  assert.equal((await fetch(`${url}/api/state`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: '{ broken' })).status, 400);
  assert.equal((await fetch(`${url}/api/state`, { method: 'PATCH', headers: { 'Content-Type': 'text/plain' }, body: '{}' })).status, 415);
  assert.equal((await patch(url, { answers: { huge: 'a'.repeat(1_100_000) } })).status, 413);
  assert.deepEqual(await (await fetch(`${url}/api/state`)).json(), valid);
});

test('malformed nested imports cannot replace healthy personal records', async (t) => {
  const { url } = await fixture(t);
  const valid = await (await patch(url, { answers: { 'daily-2026-09-08': validAnswer }, theses: [{ ...validThesis, original: originalSnapshot, reviews: [] }] })).json();
  const invalidTheses = [
    { ...validThesis, title: { dangerous: 'object rendered as text' } },
    { ...validThesis, evidence: ['unexpected array'] },
    { ...validThesis, probability: '65' },
    { ...validThesis, probability: 0 },
    { ...validThesis, deadline: '2026-02-30' },
    { ...validThesis, createdAt: '2026-02-30T00:00:00.000Z' },
    { ...validThesis, original: { ...originalSnapshot, probability: null } },
    { ...validThesis, original: null },
    { ...validThesis, reviews: {} },
    { ...validThesis, reviews: [null] },
    { ...validThesis, reviews: [{ id: 'r', date: timestamp, outcome: 'false', reflection: {} }] },
    { ...validThesis, reviews: [{ id: 'r', date: timestamp, outcome: 'maybe', reflection: '' }] },
  ];
  for (const item of invalidTheses) assert.equal((await patch(url, { theses: [item], bookmarks: ['test-concept'] })).status, 400, JSON.stringify(item));
  for (const answers of [
    { 'daily--1': validAnswer },
    { 'daily-2026-02-30': validAnswer },
    { 'daily-2026-09-08': { ...validAnswer, text: {} } },
    { 'daily-2026-09-08': { ...validAnswer, savedAt: 'yesterday' } },
    { 'daily-2026-09-08': { ...validAnswer, question: 999999 } },
    { 'daily-2026-09-08': { text: 'incomplete' } },
  ]) assert.equal((await patch(url, { answers })).status, 400);
  for (const activity of [
    [{ id: 'a', type: 'invented', date: timestamp, day: '2026-09-08' }],
    [{ id: 'a', type: 'review', date: timestamp, day: '2026-02-30' }],
    [{ id: 'a', type: 'review', date: timestamp, day: '2026-09-08', articleId: {} }],
  ]) assert.equal((await patch(url, { activity })).status, 400);
  assert.deepEqual(await (await fetch(`${url}/api/state`)).json(), valid);
});

test('removed articles do not block later saves but new unknown IDs remain invalid', async (t) => {
  const context = await fixture(t);
  const before = await (await patch(context.url, { bookmarks: ['test-concept'], completed: ['test-concept'] })).json();
  await context.close();
  fs.unlinkSync(path.join(context.options.contentDirectory, 'test-concept.md'));
  fs.writeFileSync(path.join(context.options.contentDirectory, 'remaining-concept.md'), fixtureMarkdown.replace('id: test-concept', 'id: remaining-concept'));
  const restarted = await context.launch();
  assert.deepEqual(await (await fetch(`${restarted.url}/api/state`)).json(), before);
  const updated = { ...before, answers: { 'daily-2026-09-08': validAnswer } };
  assert.equal((await patch(restarted.url, updated)).status, 200);
  assert.deepEqual(await (await fetch(`${restarted.url}/api/state`)).json(), updated);
  assert.equal((await patch(restarted.url, { bookmarks: ['test-concept', 'never-existed'] })).status, 400);
  assert.deepEqual(await (await fetch(`${restarted.url}/api/state`)).json(), updated);
});

test('SPA paths render; unknown APIs and missing assets never return the app shell', async (t) => {
  const { url } = await fixture(t);
  const page = await fetch(`${url}/knowledge/psychology`, { headers: { Accept: 'text/html' } });
  assert.equal(page.status, 200);
  assert.match(await page.text(), /InsightMatrix/);
  const api = await fetch(`${url}/api/not-real`, { headers: { Accept: 'text/html' } });
  assert.equal(api.status, 404);
  assert.match(api.headers.get('content-type'), /application\/json/);
  assert.equal((await fetch(`${url}/assets/missing.js`)).status, 404);
});

test('malformed or dangling content fails explicitly instead of disappearing silently', async (t) => {
  const { options } = await fixture(t);
  const filename = path.join(options.contentDirectory, 'test-concept.md');
  fs.writeFileSync(filename, fixtureMarkdown.replace('related: []', 'related: [missing-concept]'));
  assert.throws(() => loadContent(options.contentDirectory), /不存在的文章/);
  fs.writeFileSync(filename, fixtureMarkdown.replace('minutes: 5', 'minutes: invalid'));
  assert.throws(() => loadContent(options.contentDirectory), /minutes/);
  fs.writeFileSync(filename, fixtureMarkdown);
  fs.writeFileSync(path.join(options.contentDirectory, 'duplicate.md'), fixtureMarkdown);
  assert.throws(() => loadContent(options.contentDirectory), /唯一/);
});

test('missing production build reports clearly and corrupt database is never reset', async (t) => {
  const context = await fixture(t);
  await context.close();
  fs.unlinkSync(path.join(context.options.distDirectory, 'index.html'));
  const restarted = await context.launch();
  const response = await fetch(restarted.url);
  assert.equal(response.status, 404);
  assert.match((await response.json()).error, /npm run build/);
  await restarted.close();
  const database = new DatabaseSync(context.options.databasePath);
  database.prepare('UPDATE app_state SET value = ? WHERE id = 1').run('malformed');
  database.close();
  assert.throws(() => createApp(context.options), /JSON/);
  const preserved = new DatabaseSync(context.options.databasePath);
  assert.equal(preserved.prepare('SELECT value FROM app_state WHERE id = 1').get().value, 'malformed');
  preserved.close();
});

test('repository content has valid metadata and relations', () => {
  const articles = loadContent(path.resolve('content'));
  assert.ok(articles.length >= 96, '应包含至少 36 篇概念与 60 篇案例');
  assert.ok(articles.filter((article) => article.type === 'concept').length >= 36);
  assert.ok(articles.filter((article) => article.type === 'case').length >= 60);
  for (const category of ['human-nature', 'psychology', 'society', 'economics', 'industries', 'investing']) {
    assert.equal(articles.filter((article) => article.category === category && article.type === 'concept').length, 6, `${category} needs six concepts`);
    assert.ok(articles.filter((article) => article.category === category && article.type === 'case').length >= 10, `${category} needs at least ten historical cases`);
  }
});
