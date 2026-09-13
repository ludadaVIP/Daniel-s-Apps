import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, readFile, realpath, rm, writeFile, mkdir, rename, symlink } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createHtmlLibraryApp } from './index.js';

async function withTemporaryLibrary(run) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'html-library-'));
  const libraryDirectory = path.join(root, 'library');
  const catalogPath = path.join(root, 'catalog.json');
  await mkdir(path.join(libraryDirectory, 'nested'), { recursive: true });
  try { await run({ root, libraryDirectory, catalogPath }); }
  finally { await rm(root, { recursive: true, force: true }); }
}

async function request(app, pathname, options = {}) {
  const server = createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const address = server.address();
    return await fetch(`http://127.0.0.1:${address.port}${pathname}`, options);
  } finally { await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())); }
}

test('扫描 HTML、提取回退内容与安全特征', async () => {
  await withTemporaryLibrary(async ({ libraryDirectory, catalogPath }) => {
    await writeFile(path.join(libraryDirectory, 'fallback-file.html'), '<html><body><h1>回退标题</h1><p>这里是用于简介回退的第一段有意义内容。</p></body></html>');
    await writeFile(path.join(libraryDirectory, 'nested', 'complete.html'), '<html><head><title>完整标题</title><meta name="description" content="完整简介"></head><body><script>window.ready=true</script><button>开始</button><img src="https://example.com/cover.png"></body></html>');
    const response = await request(createHtmlLibraryApp({ libraryDirectory, catalogPath }), '/api/documents?refresh=1');
    assert.equal(response.status, 200);
    const payload = await response.json();
    assert.equal(payload.summary.total, 2);
    const fallback = payload.items.find((item) => item.relativePath === 'fallback-file.html');
    const complete = payload.items.find((item) => item.relativePath === 'nested/complete.html');
    assert.equal(fallback.title, '回退标题');
    assert.match(fallback.summary, /第一段有意义内容/);
    assert.equal(complete.title, '完整标题');
    assert.equal(complete.summary, '完整简介');
    assert.equal(complete.containsScripts, true);
    assert.equal(complete.hasRemoteAssets, true);
    assert.equal(complete.hasInteractiveContent, true);
    assert.ok(payload.facets.folders.some((folder) => folder.name === 'nested' && folder.count === 1));
  });
});

test('无效或越界标识无法读取 API 或阅读页', async () => {
  await withTemporaryLibrary(async ({ libraryDirectory, catalogPath }) => {
    await writeFile(path.join(libraryDirectory, 'safe.html'), '<title>Safe</title>');
    const app = createHtmlLibraryApp({ libraryDirectory, catalogPath });
    await request(app, '/api/documents?refresh=1');
    const traversalId = Buffer.from('../private.html').toString('base64url');
    for (const endpoint of [`/api/documents/${traversalId}`, `/document/${traversalId}`, '/api/documents/%25%25%25']) {
      const response = await request(app, endpoint);
      assert.ok([400, 404].includes(response.status));
      assert.doesNotMatch(await response.text(), /private\.html/i);
    }
  });
});

test('打开文件夹只会请求已验证的书库根目录', async () => {
  await withTemporaryLibrary(async ({ libraryDirectory, catalogPath }) => {
    let openedDirectory = null;
    const app = createHtmlLibraryApp({
      libraryDirectory,
      catalogPath,
      openLibraryDirectory: async (directory) => { openedDirectory = directory; },
    });
    const response = await request(app, '/api/library/open', { method: 'POST' });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { opened: true });
    assert.equal(openedDirectory, await realpath(libraryDirectory));
  });
});

test('PATCH 仅持久化目录元数据，重建应用后仍保留', async () => {
  await withTemporaryLibrary(async ({ libraryDirectory, catalogPath }) => {
    await writeFile(path.join(libraryDirectory, 'article.html'), '<title>原始标题</title><p>原始正文</p>');
    const app = createHtmlLibraryApp({ libraryDirectory, catalogPath });
    const before = await (await request(app, '/api/documents?refresh=1')).json();
    const id = before.items[0].id;
    const update = await request(app, `/api/documents/${id}/metadata`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title: '人工标题', summary: '人工简介', tags: ['研究', '重点'], favorite: true, readingStatus: 'reading', coverTone: 'jade', lastOpenedAt: '2026-09-13T10:30:00.000Z' }) });
    assert.equal(update.status, 200);
    assert.equal((await update.json()).title, '人工标题');
    const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
    assert.equal(catalog.documents['article.html'].title, '人工标题');
    const freshApp = createHtmlLibraryApp({ libraryDirectory, catalogPath });
    const after = await (await request(freshApp, '/api/documents?refresh=1')).json();
    assert.deepEqual(after.items[0].tags, ['研究', '重点']);
    assert.equal(after.items[0].readingStatus, 'reading');
    assert.equal(after.items[0].favorite, true);
    assert.equal(after.items[0].lastOpenedAt, '2026-09-13T10:30:00.000Z');
    const invalidTime = await request(freshApp, `/api/documents/${id}/metadata`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ lastOpenedAt: 'not-a-time' }) });
    assert.equal(invalidTime.status, 400);
    // A rejected queued task must not keep later metadata writes waiting forever.
    const recovery = await request(freshApp, `/api/documents/${id}/metadata`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ favorite: false }) });
    assert.equal(recovery.status, 200);
    assert.equal((await recovery.json()).favorite, false);
  });
});

test('并发 PATCH 不会丢失不同文档的目录资料', async () => {
  await withTemporaryLibrary(async ({ libraryDirectory, catalogPath }) => {
    await writeFile(path.join(libraryDirectory, 'first.html'), '<title>第一篇</title>');
    await writeFile(path.join(libraryDirectory, 'second.html'), '<title>第二篇</title>');
    const app = createHtmlLibraryApp({ libraryDirectory, catalogPath });
    const listing = await (await request(app, '/api/documents?refresh=1')).json();
    const first = listing.items.find((item) => item.relativePath === 'first.html');
    const second = listing.items.find((item) => item.relativePath === 'second.html');

    const [firstUpdate, secondUpdate] = await Promise.all([
      request(app, `/api/documents/${first.id}/metadata`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title: '第一篇人工标题', tags: ['并发', '甲'], favorite: true }) }),
      request(app, `/api/documents/${second.id}/metadata`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ summary: '第二篇人工简介', readingStatus: 'finished', coverTone: 'violet' }) }),
    ]);
    assert.equal(firstUpdate.status, 200);
    assert.equal(secondUpdate.status, 200);

    const rebuilt = createHtmlLibraryApp({ libraryDirectory, catalogPath });
    const after = await (await request(rebuilt, '/api/documents?refresh=1')).json();
    const storedFirst = after.items.find((item) => item.relativePath === 'first.html');
    const storedSecond = after.items.find((item) => item.relativePath === 'second.html');
    assert.equal(storedFirst.title, '第一篇人工标题');
    assert.deepEqual(storedFirst.tags, ['并发', '甲']);
    assert.equal(storedFirst.favorite, true);
    assert.equal(storedSecond.summary, '第二篇人工简介');
    assert.equal(storedSecond.readingStatus, 'finished');
    assert.equal(storedSecond.coverTone, 'violet');
  });
});

test('阅读页不会隐式写入目录资料；显式打开事件与 PATCH 并发时会合并', async () => {
  await withTemporaryLibrary(async ({ libraryDirectory, catalogPath }) => {
    await writeFile(path.join(libraryDirectory, 'reader.html'), '<title>并发阅读</title><p>正文</p>');
    const app = createHtmlLibraryApp({ libraryDirectory, catalogPath });
    const listing = await (await request(app, '/api/documents?refresh=1')).json();
    const item = listing.items[0];

    const catalogBeforeReading = await readFile(catalogPath, 'utf8');
    const reading = await request(app, `/document/${item.id}`);
    assert.equal(reading.status, 200);
    assert.equal(await readFile(catalogPath, 'utf8'), catalogBeforeReading);

    const opened = await request(app, `/api/documents/${item.id}/open`, { method: 'POST' });
    assert.equal(opened.status, 200);
    assert.ok((await opened.json()).lastOpenedAt);

    const [opening, update] = await Promise.all([
      request(app, `/api/documents/${item.id}/open`, { method: 'POST' }),
      request(app, `/api/documents/${item.id}/metadata`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title: '阅读后人工标题', tags: ['阅读'], readingStatus: 'reading' }) }),
    ]);
    assert.equal(opening.status, 200);
    assert.equal(update.status, 200);

    const rebuilt = createHtmlLibraryApp({ libraryDirectory, catalogPath });
    const after = await (await request(rebuilt, '/api/documents?refresh=1')).json();
    assert.equal(after.items[0].title, '阅读后人工标题');
    assert.deepEqual(after.items[0].tags, ['阅读']);
    assert.equal(after.items[0].readingStatus, 'reading');
    assert.ok(after.items[0].lastOpenedAt);
  });
});

test('冷启动阅读页不会为缺少 fingerprint 的既有目录资料写入 catalog', async () => {
  await withTemporaryLibrary(async ({ libraryDirectory, catalogPath }) => {
    const relativePath = 'cold-reader.html';
    const source = '<!doctype html><title>冷启动阅读</title><p>原始页面内容</p>';
    await writeFile(path.join(libraryDirectory, relativePath), source);
    await writeFile(catalogPath, `${JSON.stringify({
      version: 2,
      documents: {
        [relativePath]: { title: '人工冷启动标题', tags: ['既有资料'], favorite: true },
      },
    }, null, 2)}\n`);
    const catalogBefore = await readFile(catalogPath);
    const id = Buffer.from(relativePath, 'utf8').toString('base64url');
    const app = createHtmlLibraryApp({ libraryDirectory, catalogPath });

    const detail = await request(app, `/api/documents/${id}`);
    assert.equal(detail.status, 200);
    assert.equal((await detail.json()).title, '人工冷启动标题');

    const reading = await request(app, `/document/${id}`);
    assert.equal(reading.status, 200);
    assert.equal(await reading.text(), source);
    assert.deepEqual(await readFile(catalogPath), catalogBefore);

    // A deliberate opening event remains a mutation and can reconcile this
    // legacy record before persisting its timestamp.
    const opened = await request(app, `/api/documents/${id}/open`, { method: 'POST' });
    assert.equal(opened.status, 200);
    assert.ok((await opened.json()).lastOpenedAt);
    assert.notDeepEqual(await readFile(catalogPath), catalogBefore);
  });
});

test('目录写入失败不会泄漏缓存，恢复后队列可继续且失败资料不会重新出现', async () => {
  await withTemporaryLibrary(async ({ libraryDirectory, catalogPath }) => {
    await writeFile(path.join(libraryDirectory, 'transaction.html'), '<title>事务资料</title><p>正文</p>');
    const app = createHtmlLibraryApp({ libraryDirectory, catalogPath });
    const initial = await (await request(app, '/api/documents?refresh=1')).json();
    const item = initial.items[0];

    // Force the real atomic rename to fail after the catalog and index caches
    // have already been populated. This exercises the same failure mode users
    // see if another process temporarily turns catalog.json into a directory.
    await rm(catalogPath);
    await mkdir(catalogPath);
    const failed = await request(app, `/api/documents/${item.id}/metadata`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: '绝不能泄漏的标题', favorite: true }),
    });
    assert.equal(failed.status, 500);

    const cachedAfterFailure = await (await request(app, '/api/documents')).json();
    assert.equal(cachedAfterFailure.items[0].title, '事务资料');
    assert.equal(cachedAfterFailure.items[0].favorite, false);

    await rm(catalogPath, { recursive: true, force: true });
    const recovered = await request(app, `/api/documents/${item.id}/metadata`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ readingStatus: 'reading' }),
    });
    assert.equal(recovered.status, 200);
    assert.equal((await recovered.json()).readingStatus, 'reading');

    const persisted = JSON.parse(await readFile(catalogPath, 'utf8'));
    assert.equal(persisted.documents['transaction.html'].title, undefined);
    assert.equal(persisted.documents['transaction.html'].favorite, undefined);
    assert.equal(persisted.documents['transaction.html'].readingStatus, 'reading');

    const rebuilt = createHtmlLibraryApp({ libraryDirectory, catalogPath });
    const afterRestart = await (await request(rebuilt, '/api/documents?refresh=1')).json();
    assert.equal(afterRestart.items[0].title, '事务资料');
    assert.equal(afterRestart.items[0].favorite, false);
    assert.equal(afterRestart.items[0].readingStatus, 'reading');
  });
});

test('恶意或无效的数字实体不会中断整个扫描', async () => {
  await withTemporaryLibrary(async ({ libraryDirectory, catalogPath }) => {
    await writeFile(path.join(libraryDirectory, 'malformed.html'), '<title>安全 &#x110000; &#55296;</title><meta name="description" content="&#xD800; 仍可读取"><p>正文</p>');
    const response = await request(createHtmlLibraryApp({ libraryDirectory, catalogPath }), '/api/documents?refresh=1');
    assert.equal(response.status, 200);
    const payload = await response.json();
    assert.equal(payload.summary.total, 1);
    assert.match(payload.items[0].title, /&#x110000;/);
    assert.match(payload.items[0].summary, /&#xD800;/);
  });
});

test('扫描后的 symlink 替换无法借缓存读取书库外内容', async (t) => {
  await withTemporaryLibrary(async ({ root, libraryDirectory, catalogPath }) => {
    const source = path.join(libraryDirectory, 'safe.html');
    const secret = path.join(root, 'secret.html');
    await writeFile(source, '<title>Safe</title><p>公开内容</p>');
    await writeFile(secret, '<title>TOP SECRET</title><p>库外内容</p>');
    const app = createHtmlLibraryApp({ libraryDirectory, catalogPath });
    const initial = await (await request(app, '/api/documents?refresh=1')).json();
    const id = initial.items[0].id;
    await rm(source);
    try {
      await symlink(secret, source, 'file');
    } catch (error) {
      if (['EPERM', 'EACCES', 'ENOTSUP', 'UNKNOWN'].includes(error.code)) {
        t.skip(`当前环境不允许创建文件 symlink (${error.code})`);
        return;
      }
      throw error;
    }
    const reading = await request(app, `/document/${id}`);
    assert.equal(reading.status, 404);
    assert.doesNotMatch(await reading.text(), /TOP SECRET|库外内容/);
    const refreshed = await (await request(app, '/api/documents?refresh=1')).json();
    assert.equal(refreshed.summary.total, 0);
    assert.ok(refreshed.summary.warningCount >= 1);
  });
});

test('唯一 fingerprint 的改名会迁移人工资料，重复副本不会猜测迁移', async () => {
  await withTemporaryLibrary(async ({ libraryDirectory, catalogPath }) => {
    const original = path.join(libraryDirectory, 'original.html');
    const document = '<title>原始资料</title><p>可迁移的稳定内容</p>';
    await writeFile(original, document);
    const app = createHtmlLibraryApp({ libraryDirectory, catalogPath });
    const first = await (await request(app, '/api/documents?refresh=1')).json();
    const originalId = first.items[0].id;
    const updated = await request(app, `/api/documents/${originalId}/metadata`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title: '人工标题', tags: ['保留'], favorite: true, lastOpenedAt: '2026-09-13T11:00:00.000Z' }) });
    assert.equal(updated.status, 200);

    await rename(original, path.join(libraryDirectory, 'renamed.html'));
    const afterRename = await (await request(app, '/api/documents?refresh=1')).json();
    assert.equal(afterRename.items[0].relativePath, 'renamed.html');
    assert.equal(afterRename.items[0].title, '人工标题');
    assert.deepEqual(afterRename.items[0].tags, ['保留']);
    assert.equal(afterRename.items[0].lastOpenedAt, '2026-09-13T11:00:00.000Z');
    const migratedCatalog = JSON.parse(await readFile(catalogPath, 'utf8'));
    assert.ok(migratedCatalog.documents['renamed.html'].fingerprint);
    assert.equal(migratedCatalog.documents['original.html'], undefined);

    await rename(path.join(libraryDirectory, 'renamed.html'), path.join(libraryDirectory, 'copy-a.html'));
    await writeFile(path.join(libraryDirectory, 'copy-b.html'), document);
    const duplicates = await (await request(app, '/api/documents?refresh=1')).json();
    assert.equal(duplicates.items.length, 2);
    assert.ok(duplicates.items.every((item) => item.title !== '人工标题'));
    const duplicateCatalog = JSON.parse(await readFile(catalogPath, 'utf8'));
    assert.ok(duplicateCatalog.documents['renamed.html']);
    assert.equal(duplicateCatalog.documents['copy-a.html'].title, undefined);
    assert.equal(duplicateCatalog.documents['copy-b.html'].title, undefined);
  });
});

test('同一路径被不同 HTML 替换时会重置人工目录资料', async () => {
  await withTemporaryLibrary(async ({ libraryDirectory, catalogPath }) => {
    const sourcePath = path.join(libraryDirectory, 'replaced.html');
    await writeFile(sourcePath, '<title>旧资料</title><p>旧内容</p>');
    const app = createHtmlLibraryApp({ libraryDirectory, catalogPath });
    const initial = await (await request(app, '/api/documents?refresh=1')).json();
    const id = initial.items[0].id;
    const saved = await request(app, `/api/documents/${id}/metadata`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: '不能继承的人工标题',
        summary: '不能继承的人工简介',
        tags: ['旧资料', '人工'],
        favorite: true,
        readingStatus: 'finished',
        coverTone: 'violet',
        lastOpenedAt: '2026-09-13T12:00:00.000Z',
      }),
    });
    assert.equal(saved.status, 200);

    await writeFile(sourcePath, '<title>全新资料</title><meta name="description" content="新的原始简介"><p>全新内容</p>');
    const afterReplacement = await (await request(app, '/api/documents?refresh=1')).json();
    const replacement = afterReplacement.items[0];
    assert.equal(replacement.title, '全新资料');
    assert.equal(replacement.summary, '新的原始简介');
    assert.deepEqual(replacement.tags, []);
    assert.equal(replacement.favorite, false);
    assert.equal(replacement.readingStatus, 'unread');
    assert.equal(replacement.coverTone, 'azure');
    assert.equal(replacement.lastOpenedAt, null);

    const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
    assert.deepEqual(catalog.documents['replaced.html'], { fingerprint: catalog.documents['replaced.html'].fingerprint });
    assert.match(catalog.documents['replaced.html'].fingerprint, /^[a-f0-9]{64}$/);
  });
});

test('阅读页仅服务已扫描 HTML，并使用隔离安全头', async () => {
  await withTemporaryLibrary(async ({ libraryDirectory, catalogPath }) => {
    await writeFile(path.join(libraryDirectory, 'reader.html'), '<!doctype html><h1>安全阅读</h1><script>window.test=true</script>');
    const app = createHtmlLibraryApp({ libraryDirectory, catalogPath });
    const documents = await (await request(app, '/api/documents?refresh=1')).json();
    const response = await request(app, `/document/${documents.items[0].id}`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /^text\/html(?:\s*;|$)/i);
    assert.doesNotMatch(response.headers.get('content-type'), /charset=/i);
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(response.headers.get('referrer-policy'), 'same-origin');
    const csp = response.headers.get('content-security-policy');
    assert.match(csp, /sandbox/);
    assert.match(csp, /allow-scripts/);
    assert.doesNotMatch(csp, /allow-same-origin/);
    assert.match(await response.text(), /安全阅读/);
  });
});

test('Windows-1252 索引和阅读页保留原始字节与正确标题', async () => {
  await withTemporaryLibrary(async ({ libraryDirectory, catalogPath }) => {
    const source = Buffer.from('<!doctype html><html><head><meta charset="windows-1252"><title>caf\xe9 guide</title><meta name="description" content="Cr\xe8me br\xfbl\xe9e"></head><body>caf\xe9</body></html>', 'latin1');
    await writeFile(path.join(libraryDirectory, 'legacy.html'), source);
    const app = createHtmlLibraryApp({ libraryDirectory, catalogPath });
    const index = await (await request(app, '/api/documents?refresh=1')).json();
    assert.equal(index.items[0].title, 'café guide');
    assert.equal(index.items[0].summary, 'Crème brûlée');
    assert.doesNotMatch(index.items[0].title, /�/);
    assert.doesNotMatch(index.items[0].summary, /�/);

    const reading = await request(app, `/document/${index.items[0].id}`);
    assert.equal(reading.status, 200);
    assert.match(reading.headers.get('content-type'), /^text\/html(?:\s*;|$)/i);
    assert.doesNotMatch(reading.headers.get('content-type'), /charset=/i);
    assert.deepEqual(Buffer.from(await reading.arrayBuffer()), source);
  });
});

test('完整流式扫描会识别 48KB 预览边界之后的特征', async () => {
  await withTemporaryLibrary(async ({ libraryDirectory, catalogPath }) => {
    const filler = 'x'.repeat(49 * 1024);
    await writeFile(path.join(libraryDirectory, 'large.html'), `<html><head><title>Large document</title></head><body>${filler}<script>window.late = true;</script><img src="https://example.com/late.png"><canvas id="late-chart"></canvas></body></html>`);
    const response = await request(createHtmlLibraryApp({ libraryDirectory, catalogPath }), '/api/documents?refresh=1');
    assert.equal(response.status, 200);
    const item = (await response.json()).items[0];
    assert.equal(item.containsScripts, true);
    assert.equal(item.hasRemoteAssets, true);
    assert.equal(item.hasInteractiveContent, true);
  });
});
