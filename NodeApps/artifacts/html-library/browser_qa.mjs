import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import playwright from 'file:///C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js';

const { chromium } = playwright;

const baseUrl = 'http://127.0.0.1:5888';
const output = path.resolve('artifacts/html-library');
await mkdir(output, { recursive: true });

const report = { console_errors: [], page_errors: [], runs: {} };
const attachDiagnostics = (page) => {
  page.on('console', (message) => {
    if (message.type() === 'error') report.console_errors.push(message.text());
  });
  page.on('pageerror', (error) => report.page_errors.push(String(error)));
};

const measureOverflow = (page) => page.evaluate(() => ({
  document: document.documentElement.scrollWidth > window.innerWidth,
  body: document.body.scrollWidth > window.innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
}));

const clickFirst = async (locator) => {
  if (await locator.count()) {
    await locator.first().click();
    return true;
  }
  return false;
};

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 }, deviceScaleFactor: 1 });
  attachDiagnostics(page);
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(output, 'desktop-01-launcher.png'), fullPage: true });
  report.runs.launcher = {
    title: await page.title(),
    visible_text: (await page.locator('body').innerText()).slice(0, 1000),
    buttons: await page.locator('button').allInnerTexts(),
    links: await page.locator('a').allInnerTexts(),
  };

  await page.getByText('VisualShelf', { exact: true }).first().click();
  await page.waitForLoadState('networkidle');
  await page.getByRole('heading', { name: 'VisualShelf' }).waitFor({ timeout: 10000 });
  await page.screenshot({ path: path.join(output, 'desktop-02-library-grid.png'), fullPage: true });
  report.runs.library_initial = {
    buttons: await page.locator('button').allInnerTexts(),
    inputs: await page.locator('input').count(),
    iframes: await page.locator('iframe').count(),
    articles: await page.locator('article').count(),
  };

  const search = page.locator('input').first();
  await search.fill('nonexistent-qa-query');
  await page.waitForTimeout(250);
  const textAfterSearch = await page.locator('body').innerText();
  await page.screenshot({ path: path.join(output, 'desktop-03-search-empty.png'), fullPage: true });
  await search.fill('');
  await page.waitForTimeout(250);

  const cards = page.locator('article');
  const cardsBefore = await cards.count();
  await cards.first().click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(output, 'desktop-04-selected.png'), fullPage: true });
  const labelsAfterSelect = await page.locator('button').allInnerTexts();
  const previewCandidate = page.getByRole('button', { name: /预览/ });
  let previewClicked = await clickFirst(previewCandidate);
  if (!previewClicked) previewClicked = await clickFirst(page.locator('button[title*="预览"], button[aria-label*="预览"]'));
  if (previewClicked) await page.waitForTimeout(600);
  const iframesAfterPreview = await page.locator('iframe').count();
  await page.screenshot({ path: path.join(output, 'desktop-05-preview.png'), fullPage: true });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  const iframesAfterEscape = await page.locator('iframe').count();

  const listToggle = page.locator('button[title*="列表"], button[aria-label*="列表"]');
  const listToggleClicked = await clickFirst(listToggle);
  if (listToggleClicked) await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(output, 'desktop-06-list-or-grid-toggle.png'), fullPage: true });
  report.runs.desktop = {
    cards_before: cardsBefore,
    search_hides_query: !textAfterSearch.includes('nonexistent-qa-query'),
    buttons_after_select: labelsAfterSelect,
    preview_clicked: previewClicked,
    iframes_after_preview: iframesAfterPreview,
    iframes_after_escape: iframesAfterEscape,
    list_toggle_clicked: listToggleClicked,
    overflow: await measureOverflow(page),
  };

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  attachDiagnostics(mobile);
  await mobile.goto(baseUrl, { waitUntil: 'networkidle' });
  await mobile.getByText('VisualShelf', { exact: true }).first().click();
  await mobile.waitForLoadState('networkidle');
  await mobile.getByRole('heading', { name: 'VisualShelf' }).waitFor({ timeout: 10000 });
  await mobile.screenshot({ path: path.join(output, 'mobile-01-library-grid.png'), fullPage: false });
  await mobile.locator('article').first().click();
  await mobile.waitForTimeout(250);
  await mobile.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await mobile.waitForTimeout(250);
  await mobile.screenshot({ path: path.join(output, 'mobile-02-selected.png'), fullPage: false });
  report.runs.mobile = {
    cards: await mobile.locator('article').count(),
    buttons: await mobile.locator('button').allInnerTexts(),
    overflow: await measureOverflow(mobile),
  };
} finally {
  await browser.close();
}

await writeFile(path.join(output, 'browser-qa-report.json'), JSON.stringify(report, null, 2), 'utf8');
console.log(JSON.stringify(report, null, 2));
