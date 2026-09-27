import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContent } from '../server/content.js';

// Read-only public HTTP checks. A successful response does not verify a claim.
const root = fileURLToPath(new URL('../', import.meta.url));
const citations = new Map();
for (const item of loadContent()) {
  const urls = [
    ...(item.sources || []).map((source) => source.url),
    item.sourceUrl,
    ...Array.from((item.body + '\n' + (item.brief || '')).matchAll(/https:\/\/[^\s<>"')]+/g), (match) => match[0]),
  ].filter(Boolean);
  for (const raw of urls) {
    const parsed = new URL(raw);
    parsed.hash = '';
    const url = parsed.href;
    if (!citations.has(url)) citations.set(url, new Set());
    citations.get(url).add(item.id);
  }
}

async function inspect(url) {
  const start = Date.now();
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(12000),
      headers: { 'User-Agent': 'InvestMaster-Educational-Source-Audit/1.0', Accept: 'text/html,application/pdf;q=0.9,*/*;q=0.8' },
    });
    const mime = response.headers.get('content-type') || '';
    let title = '';
    if (mime.includes('text/html') && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let sample = '';
      while (sample.length < 65536) {
        const next = await reader.read();
        if (next.done) break;
        sample += decoder.decode(next.value, { stream: true });
        if (/<\/title>/i.test(sample)) break;
      }
      await reader.cancel();
      title = (sample.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').replace(/\s+/g, ' ').trim().slice(0, 250);
    } else {
      await response.body?.cancel();
    }
    const outcome = [404, 410].includes(response.status) ? 'missing'
      : !response.ok ? 'restricted_or_error'
      : /page not found|404|access denied|just a moment|sign in|log in/i.test(title) ? 'manual_review'
      : 'responded';
    return { url, finalUrl: response.url, status: response.status, mime, title, outcome, milliseconds: Date.now() - start };
  } catch (error) {
    return { url, outcome: 'unverified', error: error.message, milliseconds: Date.now() - start };
  }
}

const jobs = [...citations.keys()];
const results = [];
let next = 0;
await Promise.all(Array.from({ length: 5 }, async () => {
  while (next < jobs.length) {
    const url = jobs[next++];
    const result = await inspect(url);
    results.push({ ...result, items: [...citations.get(url)].sort() });
    if (results.length % 25 === 0) console.log('Checked ' + results.length + '/' + jobs.length);
  }
}));
results.sort((a, b) => a.url.localeCompare(b.url));
const counts = results.reduce((summary, row) => {
  summary[row.outcome] = (summary[row.outcome] || 0) + 1;
  return summary;
}, {});
const report = {
  checkedAt: new Date().toISOString(),
  scope: 'Frontmatter sources, sourceUrl and HTTPS URLs in published content body/brief; excludes blueprint files. HTTP reachability only; no assertion of source authority, claim support or correct PDF contents.',
  counts,
  results,
};
const directory = path.join(root, 'qa');
fs.mkdirSync(directory, { recursive: true });
fs.writeFileSync(path.join(directory, 'source-audit.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ urls: results.length, counts }));
for (const row of results.filter((row) => ['missing', 'manual_review'].includes(row.outcome))) {
  console.log(JSON.stringify({ url: row.url, status: row.status, title: row.title, items: row.items }));
}
