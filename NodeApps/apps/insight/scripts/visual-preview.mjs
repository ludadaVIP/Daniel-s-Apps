// Intermediate layout preview while the Markdown library is still being written.
// Uses a temporary copy of the real content, removing dangling references only.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import matter from 'gray-matter';
import { createApp } from '../server/app.js';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'insightmatrix-preview-'));
const markdown = fs.readdirSync('content', { recursive: true }).filter((file) => file.endsWith('.md') && !file.endsWith('README.md')).map((file) => matter(fs.readFileSync(path.join('content', file), 'utf8')));
const ids = new Set(markdown.map(({ data }) => data.id));
const copy = path.join(temporary, 'content');
fs.mkdirSync(copy);
for (const { data, content } of markdown) fs.writeFileSync(path.join(copy, `${data.id}.md`), matter.stringify(content, { ...data, related: data.related.filter((id) => ids.has(id)) }));
const app = createApp({ contentDirectory: copy, databasePath: path.join(temporary, 'preview.sqlite') });
const server = app.listen(0, '127.0.0.1');
await new Promise((resolve) => server.once('listening', resolve));
let browser;
try {
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'artifacts/desktop-preview.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'artifacts/mobile-preview.png', fullPage: true });
  console.log(`Visual-only preview created from ${markdown.length} current articles. Screenshots: artifacts/desktop-preview.png, artifacts/mobile-preview.png`);
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
  app.locals.close();
  if (!path.resolve(temporary).startsWith(path.resolve(os.tmpdir()) + path.sep + 'insightmatrix-preview-')) throw new Error('Unexpected cleanup path');
  fs.rmSync(temporary, { recursive: true, force: true });
}
