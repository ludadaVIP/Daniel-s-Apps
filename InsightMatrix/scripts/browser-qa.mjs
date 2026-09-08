import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createApp } from '../server/app.js';

// Set PLAYWRIGHT_MODULE to a locally installed Playwright package if necessary.
// The runner always creates a separate database and never touches personal data.
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'insightmatrix-browser-'));
const artifacts = path.resolve('artifacts');
fs.mkdirSync(artifacts, { recursive: true });
assert.ok(fs.existsSync(path.resolve('dist/index.html')), 'Run npm run build before browser QA');
const app = createApp({ databasePath: path.join(temporary, 'qa.sqlite') });
const server = app.listen(0, '127.0.0.1');
await new Promise((resolve) => server.once('listening', resolve));
const url = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
const errors = [];
const consoleErrors = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
const report = [];
const check = async (label, action) => { await action(); report.push(label); console.log(`PASS ${label}`); };
const state = async () => (await fetch(`${url}/api/state`)).json();
const persist = async (action) => {
  const responsePromise = page.waitForResponse((response) => response.url().endsWith('/api/state') && response.request().method() === 'PATCH');
  await action();
  const response = await responsePromise;
  assert.equal(response.status(), 200, await response.text());
};
const form = async (title, judgement = '目标企业下一财年经营现金流将转正。') => {
  await page.getByRole('textbox', { name: '判断标题' }).fill(title);
  await page.getByRole('textbox', { name: '我的判断', exact: true }).fill(judgement);
  await page.getByRole('textbox', { name: '支持的证据' }).fill('应收账款周转改善，经营回款率达到 95%。');
  await page.getByRole('textbox', { name: '最有力的反对证据' }).fill('客户集中度高，单一客户取消订单可能打断改善。');
  await page.getByRole('textbox', { name: '证伪条件' }).fill('财年披露的经营现金流仍为负，则命题不成立。');
  await page.getByLabel('复盘日期', { exact: true }).fill('2027-12-31');
};
const expectNoOverflow = async () => {
  const dimensions = await page.evaluate(() => ({ viewport: window.innerWidth, width: document.documentElement.scrollWidth }));
  assert.ok(dimensions.width <= dimensions.viewport, `Horizontal overflow: ${JSON.stringify(dimensions)}`);
};

try {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  await check('96 substantive articles include ten cases in every category', async () => {
    const { articles } = await (await fetch(`${url}/api/content`)).json();
    assert.ok(articles.length >= 96);
    for (const category of ['human-nature', 'psychology', 'society', 'economics', 'industries', 'investing']) {
      assert.equal(articles.filter((article) => article.category === category && article.type === 'case').length, 10);
    }
    assert.ok(articles.every((article) => article.body.length > 100));
  });
  await check('1600px dashboard has no horizontal overflow', expectNoOverflow);
  await page.screenshot({ path: path.join(artifacts, 'desktop.png'), fullPage: true });
  await page.setViewportSize({ width: 1920, height: 1080 });
  await check('1920px dashboard has no horizontal overflow', expectNoOverflow);
  await page.screenshot({ path: path.join(artifacts, 'desktop-wide.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await check('390px dashboard has no horizontal overflow', expectNoOverflow);
  await page.screenshot({ path: path.join(artifacts, 'mobile.png'), fullPage: true });
  await page.setViewportSize({ width: 1600, height: 1000 });
  fs.writeFileSync(path.join(artifacts, 'qa-dom.txt'), await page.locator('body').innerText());
  console.log(`Screenshots saved in ${artifacts}`);
  await check('library category, full-text search and empty state filters', async () => {
    await page.getByRole('button', { name: '探索全部', exact: true }).click();
    await page.locator('.library-toolbar').waitFor();
    await page.locator('.article-card').first().waitFor();
    assert.equal(await page.locator('.article-card').count(), 36);
    await page.locator('.category-tabs').getByRole('button', { name: '心理', exact: true }).click();
    assert.equal(await page.locator('.article-card').count(), 6);
    await page.getByPlaceholder('搜索标题与正文…').fill('不存在的测试关键词QA987654');
    await page.getByRole('heading', { name: '没有找到匹配的内容' }).waitFor();
    await page.getByRole('button', { name: '清除筛选' }).click();
    await page.getByPlaceholder('搜索标题与正文…').fill('沉没成本');
    await page.getByRole('button', { name: /^阅读：沉没成本/ }).click();
    await page.locator('.markdown-body').waitFor();
    assert.ok((await page.locator('.markdown-body').innerText()).length > 500);
  });
  await check('bookmarks and completed articles survive page reload', async () => {
    await persist(() => page.getByRole('button', { name: '收藏', exact: true }).click());
    await persist(() => page.getByRole('button', { name: '标记为已学完' }).click());
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: '已收藏', exact: true }).waitFor();
    await page.getByRole('button', { name: '取消学完标记' }).waitFor();
    assert.deepEqual((await state()).bookmarks, ['sunk-cost']);
    assert.deepEqual((await state()).completed, ['sunk-cost']);
    await page.screenshot({ path: path.join(artifacts, 'article.png'), fullPage: true });
  });
  await check('daily draft survives reload; submission persists and gives honest preset guidance', async () => {
    await page.locator('.sidebar nav').getByRole('button', { name: '今日认知', exact: true }).click();
    await page.getByRole('button', { name: '开始思考', exact: true }).click();
    await page.getByLabel('我的第一判断').fill('QA 草稿：先检查基准概率与反方证据，再确定价格是否合理。');
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: '开始思考', exact: true }).click();
    assert.match(await page.getByLabel('我的第一判断').inputValue(), /QA 草稿/);
    await persist(() => page.getByRole('button', { name: '保存思考，打开新视角' }).click());
    await page.getByText('以下是预先编写的反思提示，帮助你自查；不是对回答的自动评分。').waitFor();
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: '回看我的思考', exact: true }).click();
    assert.match(await page.getByLabel('我的第一判断').inputValue(), /QA 草稿/);
    await page.getByRole('button', { name: '关闭', exact: true }).click();
    assert.equal(Object.keys((await state()).answers).length, 1);
  });
  await check('thesis creation, editing and reviews preserve the original prediction', async () => {
    await page.locator('.sidebar nav').getByRole('button', { name: /我的判断/ }).click();
    await page.getByRole('button', { name: '记录新判断', exact: true }).click();
    await form('QA：现金流转正的可检验判断');
    await page.getByRole('textbox', { name: '支持的证据' }).fill('长'.repeat(16000));
    const rejectedSave = page.waitForResponse((response) => response.url().endsWith('/api/state') && response.request().method() === 'PATCH');
    await page.getByRole('button', { name: '保存判断', exact: true }).click();
    assert.equal((await rejectedSave).status(), 400);
    assert.equal((await state()).theses.length, 0, 'Rejected form must not leave a phantom thesis');
    await page.getByRole('textbox', { name: '支持的证据' }).fill('应收账款周转改善，经营回款率达到 95%。');
    await persist(() => page.getByRole('button', { name: '保存判断', exact: true }).click());
    await page.locator('.thesis-card').waitFor();
    const first = (await state()).theses[0];
    assert.equal(first.probability, 60);
    assert.equal(first.original.probability, 60);
    await page.getByRole('button', { name: '编辑', exact: true }).click();
    assert.equal(await page.getByRole('slider', { name: '成立的概率' }).isDisabled(), true);
    await page.getByRole('textbox', { name: '我的判断', exact: true }).fill('更新判断：新增一个季度数据支持原始命题。');
    await persist(() => page.getByRole('button', { name: '保存判断', exact: true }).click());
    const edited = (await state()).theses[0];
    assert.deepEqual(edited.original, first.original);
    assert.notEqual(edited.judgement, first.judgement);
    await page.getByRole('button', { name: '记录复盘', exact: true }).click();
    await page.getByRole('combobox').selectOption('true');
    await page.getByRole('textbox', { name: '复盘与新认识' }).fill('财报确认经营现金流转正，原始命题成立。');
    await persist(() => page.getByRole('button', { name: '保存复盘', exact: true }).click());
    await page.locator('.thesis-summary').getByText('0.160', { exact: true }).waitFor();
    await page.reload();
    await page.waitForLoadState('networkidle');
    assert.deepEqual((await state()).theses[0].original, first.original);
    assert.equal((await state()).theses[0].reviews[0].outcome, 'true');
  });
  await check('Brier arithmetic includes true and false outcomes using original probabilities', async () => {
    await page.getByRole('button', { name: '记录新判断', exact: true }).click();
    await form('QA：第二条失败的预测');
    await persist(() => page.getByRole('button', { name: '保存判断', exact: true }).click());
    const card = page.locator('.thesis-card').filter({ has: page.getByRole('heading', { name: 'QA：第二条失败的预测' }) });
    await card.getByRole('button', { name: '记录复盘', exact: true }).click();
    await page.getByRole('combobox').selectOption('false');
    await page.getByRole('textbox', { name: '复盘与新认识' }).fill('经营现金流仍然为负，原始命题不成立。');
    await persist(() => page.getByRole('button', { name: '保存复盘', exact: true }).click());
    await page.locator('.thesis-summary').getByText('0.260', { exact: true }).waitFor();
    await page.getByRole('button', { name: '待验证', exact: true }).click();
    assert.equal(await page.locator('.thesis-card').count(), 0);
    await page.getByRole('button', { name: '已验证', exact: true }).click();
    assert.equal(await page.locator('.thesis-card').count(), 2);
  });
  await check('failed save preserves database and offers a working retry', async () => {
    await page.goto(`${url}/#article/sunk-cost`);
    await page.waitForLoadState('networkidle');
    const before = await state();
    await page.route('**/api/state', (route) => route.request().method() === 'PATCH' ? route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'QA 模拟保存失败' }) }) : route.continue());
    await page.getByRole('button', { name: '已收藏', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: '保存失败' }).waitFor();
    assert.deepEqual(await state(), before);
    assert.equal(await page.getByRole('button', { name: '已收藏', exact: true }).count(), 1);
    await page.unroute('**/api/state');
    await persist(() => page.getByRole('button', { name: '已收藏', exact: true }).click());
    assert.deepEqual((await state()).bookmarks, []);
    await persist(() => page.getByRole('button', { name: '收藏', exact: true }).click());
  });
  await check('nested malformed import is rejected without changing the current archive', async () => {
    await page.locator('.sidebar nav').getByRole('button', { name: '学习档案', exact: true }).click();
    const before = await state();
    const malformed = structuredClone(before);
    malformed.theses[0].reviews = [{}];
    await page.locator('input[type=file]').setInputFiles({ name: 'malformed.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ version: 1, state: malformed })) });
    await page.getByRole('button', { name: '确认替换并导入' }).click();
    await page.getByRole('alert').filter({ hasText: '导入未成功，请检查备份内容；当前档案已保留。' }).waitFor();
    assert.deepEqual(await state(), before);
    await page.getByRole('button', { name: '取消', exact: true }).click();
    await page.getByRole('button', { name: '思考记录', exact: true }).click();
    assert.match(await page.locator('.answer-card').innerText(), /QA 草稿/);
  });
  await check('export contains actual persisted reading, answers, predictions and reviews', async () => {
    const downloaded = page.waitForEvent('download');
    await page.getByRole('button', { name: '导出档案', exact: true }).click();
    const download = await downloaded;
    const filename = path.join(artifacts, 'qa-export.json');
    await download.saveAs(filename);
    const backup = JSON.parse(fs.readFileSync(filename, 'utf8'));
    assert.equal(backup.version, 1);
    assert.deepEqual(backup.state, await state());
    assert.equal(backup.state.theses.length, 2);
    assert.equal(backup.state.completed.length, 1);
  });
  await check('global search and graph links open real Markdown articles', async () => {
    await page.keyboard.press('Control+k');
    await page.getByPlaceholder('搜索一个概念、问题或关键词…').fill('沉没成本');
    await page.locator('.search-results').getByRole('button').filter({ hasText: '沉没成本：别让过去继续向未来收费' }).click();
    await page.locator('.markdown-body').waitFor();
    await page.locator('.sidebar nav').getByRole('button', { name: '认知图谱', exact: true }).click();
    await page.getByRole('button', { name: /^查看关联：/ }).first().click();
    await page.getByRole('button', { name: '深入理解' }).click();
    await page.locator('.markdown-body').waitFor();
  });
  await check('valid restore replaces saved state and does not resurrect stale browser drafts', async () => {
    await page.locator('.sidebar nav').getByRole('button', { name: '学习档案', exact: true }).click();
    const restored = await state();
    const answerId = Object.keys(restored.answers)[0];
    restored.answers[answerId].text = 'QA 恢复后的较新回答：重新审视反方证据。';
    await page.locator('input[type=file]').setInputFiles({ name: 'restored.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ version: 1, state: restored })) });
    await persist(() => page.getByRole('button', { name: '确认替换并导入' }).click());
    assert.deepEqual(await state(), restored);
    await page.locator('.sidebar nav').getByRole('button', { name: '今日认知', exact: true }).click();
    await page.getByRole('button', { name: '回看我的思考', exact: true }).click();
    assert.equal(await page.getByLabel('我的第一判断').inputValue(), restored.answers[answerId].text);
    await page.getByRole('button', { name: '关闭', exact: true }).click();
  });
  await check('390px library, reader, graph, thesis and archive views have no horizontal overflow', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const hash of ['explore', 'article/sunk-cost', 'graph', 'theses', 'profile']) {
      await page.goto(`${url}/#${hash}`);
      await page.waitForLoadState('networkidle');
      await expectNoOverflow();
    }
    await page.getByRole('button', { name: '打开导航' }).click();
    await page.locator('.sidebar nav').getByRole('button', { name: '今日认知', exact: true }).click();
    await page.getByRole('button', { name: '回看我的思考', exact: true }).waitFor();
  });
  await check('floating back-to-top arrow appears after scrolling and returns to the top', async () => {
    await page.goto(`${url}/#article/sunk-cost`);
    await page.waitForLoadState('networkidle');
    const arrow = page.getByRole('button', { name: '回到顶部', exact: true });
    assert.equal(await arrow.count(), 0, 'arrow is hidden and not keyboard-accessible at the top');
    await page.evaluate(() => window.scrollTo(0, 700));
    await arrow.waitFor({ state: 'visible' });
    await page.screenshot({ path: path.join(artifacts, 'back-to-top.png') });
    await arrow.click();
    await page.waitForFunction(() => window.scrollY < 2);
    assert.equal(await arrow.count(), 0);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.evaluate(() => window.scrollTo(0, 700));
    await arrow.waitFor({ state: 'visible' });
    await arrow.click();
    await page.waitForFunction(() => window.scrollY < 2);
  });
  await check('browser has no JavaScript errors', async () => assert.deepEqual(errors, []));
  // 400 and 503 are injected by failure-path checks above. Any unexpected 404 is a real defect.
  assert.deepEqual(consoleErrors.filter((error) => !/status of (400|503)/.test(error)), []);
  fs.writeFileSync(path.join(artifacts, 'qa-report.json'), JSON.stringify({ checkedAt: new Date().toISOString(), report, errors, expectedNetworkErrors: consoleErrors, state: await state() }, null, 2));
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
  app.locals.close();
  fs.rmSync(temporary, { recursive: true, force: true });
}
