import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultDataDirectory = path.resolve(__dirname, '..', 'data');
const PILLARS = new Set(['frontier', 'value', 'wisdom', 'foundations', 'psychology', 'other']);
const DIRECTIONS = new Set(['buy', 'hold', 'trim', 'sell', 'avoid', 'watch']);
const categoryLabels = {
  '00-foundations': '00 · 基础 Foundations',
  '10-value': '10 · 价值投资 Value',
  '20-frontier': '20 · 前沿 Frontier',
  '30-wisdom': '30 · 商业认知 Wisdom',
  '40-psychology': '40 · 心理与偏差 Psychology',
};
const cacheHours = 24;
const cacheSchema = 2;
const oaktreeIndexUrl = 'https://www.oaktreecapital.com/insights/memos';
const oaktreeBaseUrl = 'https://www.oaktreecapital.com';

class InvestmentError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

const now = () => new Date().toISOString().replace(/\.\d{3}Z$/, '+00:00');
const today = () => new Date().toISOString().slice(0, 10);
const scalar = (value, fallback = '') => value == null ? fallback : String(value);
const cleanText = (value, fallback = '', limit = 240) => scalar(value).replace(/\s+/g, ' ').trim().slice(0, limit) || fallback;
const cleanBlock = (value, limit = 5000) => scalar(value).trim().slice(0, limit);
const id = (prefix) => `${prefix}-${crypto.randomBytes(4).toString('hex')}`;
const asList = (value, itemLimit = 60, maxItems = 32) => {
  const input = value == null ? [] : Array.isArray(value) ? value : String(value).split(',');
  const seen = new Set();
  return input.reduce((result, item) => {
    const text = cleanText(item, '', itemLimit);
    const key = text.toLowerCase();
    if (text && !seen.has(key) && result.length < maxItems) { seen.add(key); result.push(text); }
    return result;
  }, []);
};
const validateDate = (value, allowEmpty = false) => {
  const text = cleanText(value, '', 10);
  if (!text && allowEmpty) return '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text) || Number.isNaN(new Date(`${text}T00:00:00Z`).getTime())) {
    throw new InvestmentError('Date must look like YYYY-MM-DD.');
  }
  const [year, month, day] = text.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) {
    throw new InvestmentError('Invalid calendar date.');
  }
  return text;
};

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object || {}, key);
const metaValue = (meta, key, fallback = '') => meta && meta[key] != null ? meta[key] : fallback;
const tags = (meta) => asList(metaValue(meta, 'tags', []));
const oneLine = (body, limit = 120) => {
  const match = body.match(/^##\s*一句话\s*$/m);
  const source = match ? body.slice(match.index + match[0].length) : body;
  for (const line of source.split(/\r?\n/)) {
    const text = line.trim();
    if (match && text.startsWith('#')) break;
    if (text && !/^(#|>|-)/.test(text)) return text.slice(0, limit);
  }
  return '';
};
const snippet = (content, query) => {
  const lower = content.toLowerCase();
  const index = lower.indexOf(query.toLowerCase());
  const start = Math.max(0, index < 0 ? 0 : index - 40);
  const end = Math.min(content.length, (index < 0 ? 0 : index) + 120);
  return `${start ? '… ' : ''}${content.slice(start, end).replace(/\s+/g, ' ').trim()}${end < content.length ? ' …' : ''}`;
};
const decodeHtml = (value) => String(value || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
const relativePosix = (root, target) => path.relative(root, target).split(path.sep).join('/');
const safeSlug = (value) => cleanText(value, '', 80).replace(/[^a-zA-Z0-9_-]/g, '');

// Investment's existing Markdown is intentionally permissive frontmatter: some
// source fields contain unquoted colons, which strict YAML rejects. Preserve the
// legacy reader's small, predictable schema instead of silently dropping docs.
function splitFlowList(value) {
  const items = []; let buffer = ''; let quote = '';
  for (const character of value) {
    if (quote) { buffer += character; if (character === quote) quote = ''; continue; }
    if (character === '"' || character === "'") { quote = character; buffer += character; continue; }
    if (character === ',') { if (buffer.trim()) items.push(buffer.trim()); buffer = ''; continue; }
    buffer += character;
  }
  if (buffer.trim()) items.push(buffer.trim());
  return items;
}
function stripQuote(value) {
  const text = String(value || '').trim();
  return text.length >= 2 && ['"', "'"].includes(text[0]) && text[0] === text.at(-1) ? text.slice(1, -1) : text;
}
function parseFrontmatter(raw) {
  if (!raw.startsWith('---')) return { meta: {}, body: raw };
  const lines = raw.split(/\r?\n/);
  if (lines[0].trim() !== '---') return { meta: {}, body: raw };
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === '---');
  if (end < 0) return { meta: {}, body: raw };
  const meta = {}; let listKey = ''; let list = [];
  const commitList = () => { if (listKey) meta[listKey] = list; listKey = ''; list = []; };
  for (const rawLine of lines.slice(1, end)) {
    const line = rawLine.replace(/\s+$/, ''); const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    if (listKey && trimmed.startsWith('- ')) { list.push(stripQuote(trimmed.slice(2))); continue; }
    commitList();
    const colon = line.indexOf(':');
    if (colon < 0) continue;
    const key = line.slice(0, colon).trim(); const value = line.slice(colon + 1).trim();
    if (!key) continue;
    if (!value) { listKey = key; list = []; continue; }
    meta[key] = value.startsWith('[') && value.endsWith(']') ? splitFlowList(value.slice(1, -1)).map(stripQuote) : stripQuote(value);
  }
  commitList();
  return { meta, body: lines.slice(end + 1).join('\n').replace(/^\n+/, '') };
}

async function readJson(filename, fallback) {
  try { return JSON.parse(await fs.readFile(filename, 'utf8')); } catch (error) { if (error.code === 'ENOENT') return fallback; throw error; }
}
async function writeJson(filename, value) {
  await fs.mkdir(path.dirname(filename), { recursive: true });
  const temporary = `${filename}.${process.pid}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await fs.rename(temporary, filename);
}
async function markdown(filename) {
  const raw = await fs.readFile(filename, 'utf8');
  const parsed = parseFrontmatter(raw);
  return { meta: parsed.meta, body: parsed.body, raw };
}
async function markdownFiles(directory, recursive = false) {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const groups = await Promise.all(entries.sort((a, b) => a.name.localeCompare(b.name)).map(async (entry) => {
      const target = path.join(directory, entry.name);
      if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) return [target];
      return recursive && entry.isDirectory() ? markdownFiles(target, true) : [];
    }));
    return groups.flat();
  } catch (error) { if (error.code === 'ENOENT') return []; throw error; }
}
function inside(root, target) {
  const relative = path.relative(root, target);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}
function safePath(root, requestPath) {
  const raw = String(requestPath || '').trim().replace(/\\/g, '/');
  if (!raw || raw.includes('\0')) throw new InvestmentError('Path is required.');
  const parts = raw.split('/').filter(Boolean);
  if (!parts.length || parts.some((part) => part === '.' || part === '..' || part.startsWith('.'))) throw new InvestmentError('Invalid path.');
  const target = path.resolve(root, ...parts);
  if (!inside(root, target)) throw new InvestmentError('Invalid path.');
  return target;
}
async function existingMarkdown(target, notFound) {
  try { const stat = await fs.stat(target); if (!stat.isFile() || path.extname(target).toLowerCase() !== '.md') throw new Error(); }
  catch { throw new InvestmentError(notFound, 404); }
  return markdown(target);
}

export function createInvestmentApp({ dataDirectory = defaultDataDirectory } = {}) {
  const data = path.resolve(dataDirectory);
  const workbench = path.join(data, 'workbench');
  const files = {
    watchlist: path.join(workbench, 'watchlist.json'),
    journal: path.join(workbench, 'journal.json'),
    cache: path.join(data, 'reading-library-cache.json'),
  };
  const directories = Object.fromEntries(['knowledge', 'models', 'cases', 'masters', 'daily', 'weekly'].map((name) => [name, path.join(data, name)]));
  const router = express.Router();
  router.use(express.json({ limit: '2mb' }));

  const loadStore = async (key, listKey) => {
    const loaded = await readJson(files[key], null);
    return { [listKey]: Array.isArray(loaded?.[listKey]) ? loaded[listKey] : [], updated_at: loaded?.updated_at || now() };
  };
  const saveStore = async (key, store) => { store.updated_at = now(); await writeJson(files[key], store); };
  const watchlistPayload = (payload, existing = {}) => {
    const output = { ...existing };
    if (hasOwn(payload, 'ticker') || !output.ticker) output.ticker = cleanText(payload.ticker ?? output.ticker, '', 24);
    if (hasOwn(payload, 'name') || !output.name) output.name = cleanText(payload.name ?? output.name, '未命名标的', 120);
    if (hasOwn(payload, 'pillar') || !output.pillar) { const pillar = cleanText(payload.pillar ?? output.pillar).toLowerCase(); output.pillar = PILLARS.has(pillar) ? pillar : 'other'; }
    for (const [key, limit] of [['thesis', 4000], ['catalyst', 1200], ['risk', 1200], ['notes', 4000]]) if (hasOwn(payload, key) || !hasOwn(output, key)) output[key] = cleanBlock(payload[key] ?? output[key], limit);
    for (const key of ['entry_zone', 'exit_zone']) if (hasOwn(payload, key) || !hasOwn(output, key)) output[key] = cleanText(payload[key] ?? output[key], '', 120);
    if (hasOwn(payload, 'position_size') || !hasOwn(output, 'position_size')) output.position_size = cleanText(payload.position_size ?? output.position_size, '', 60);
    if (hasOwn(payload, 'opened_at') || !output.opened_at) output.opened_at = validateDate(payload.opened_at || output.opened_at || today());
    for (const key of ['linked_models', 'linked_cases', 'tags']) if (hasOwn(payload, key) || !hasOwn(output, key)) output[key] = asList(payload[key] ?? output[key]);
    if (hasOwn(payload, 'status') || !output.status) { const status = cleanText(payload.status ?? output.status ?? 'active').toLowerCase(); output.status = ['active', 'paused', 'closed'].includes(status) ? status : 'active'; }
    return output;
  };
  const journalPayload = (payload, existing = {}) => {
    const output = { ...existing };
    if (hasOwn(payload, 'date') || !output.date) output.date = validateDate(payload.date || output.date || today());
    if (hasOwn(payload, 'asset') || !output.asset) output.asset = cleanText(payload.asset ?? output.asset, '未命名标的', 120);
    if (hasOwn(payload, 'direction') || !output.direction) { const direction = cleanText(payload.direction ?? output.direction).toLowerCase(); output.direction = DIRECTIONS.has(direction) ? direction : 'watch'; }
    for (const [key, limit] of [['thesis', 6000], ['pre_mortem', 3000], ['outcome', 3000], ['lesson', 3000]]) if (hasOwn(payload, key) || !hasOwn(output, key)) output[key] = cleanBlock(payload[key] ?? output[key], limit);
    if (hasOwn(payload, 'cognitive_check') || !hasOwn(output, 'cognitive_check')) output.cognitive_check = asList(payload.cognitive_check ?? output.cognitive_check, 200, 24);
    if (hasOwn(payload, 'size') || !hasOwn(output, 'size')) output.size = cleanText(payload.size ?? output.size, '', 60);
    for (const key of ['linked_models', 'linked_watchlist', 'tags']) if (hasOwn(payload, key) || !hasOwn(output, key)) output[key] = asList(payload[key] ?? output[key]);
    return output;
  };
  const detail = async (directory, slug, label) => {
    const safe = safeSlug(slug);
    if (!safe) throw new InvestmentError(`Invalid ${label} slug.`);
    const doc = await existingMarkdown(path.join(directory, `${safe}.md`), `${label} not found.`);
    return { slug: safe, meta: doc.meta, body: doc.body };
  };
  const documentSummary = async (filename, kind) => {
    const doc = await markdown(filename);
    const base = { slug: scalar(metaValue(doc.meta, 'slug', path.basename(filename, '.md'))), title: scalar(metaValue(doc.meta, 'title', path.basename(filename, '.md'))), one_line: oneLine(doc.body) };
    if (kind === 'knowledge') return { ...base, path: relativePosix(data, filename), category: path.basename(path.dirname(filename)), pillar: scalar(metaValue(doc.meta, 'pillar')), tags: tags(doc.meta), created: scalar(metaValue(doc.meta, 'created')), source: scalar(metaValue(doc.meta, 'source')) };
    if (kind === 'models') return { ...base, pillar: scalar(metaValue(doc.meta, 'pillar', 'other')), origin_field: scalar(metaValue(doc.meta, 'origin_field')), tags: tags(doc.meta), source: scalar(metaValue(doc.meta, 'source')) };
    if (kind === 'cases') return { ...base, pillar: scalar(metaValue(doc.meta, 'pillar', 'other')), era: scalar(metaValue(doc.meta, 'era')), winner_or_loser: scalar(metaValue(doc.meta, 'winner_or_loser', 'mixed')).toLowerCase(), tags: tags(doc.meta), source: scalar(metaValue(doc.meta, 'source')) };
    return { ...base, role: scalar(metaValue(doc.meta, 'role')), country: scalar(metaValue(doc.meta, 'country')), era: scalar(metaValue(doc.meta, 'era')), status: scalar(metaValue(doc.meta, 'status', 'active')), key_companies: asList(metaValue(doc.meta, 'key_companies', [])), tags: tags(doc.meta), source: scalar(metaValue(doc.meta, 'source')) };
  };

  router.route('/workbench/watchlist').get(async (_req, res, next) => { try { const store = await loadStore('watchlist', 'items'); res.json({ ...store, items: [...store.items].sort((a, b) => `${b.opened_at || ''}${b.updatedAt || ''}`.localeCompare(`${a.opened_at || ''}${a.updatedAt || ''}`)) }); } catch (error) { next(error); } }).post(async (req, res, next) => { try { const store = await loadStore('watchlist', 'items'); const timestamp = now(); const item = { ...watchlistPayload(req.body || {}), id: id('wl'), createdAt: timestamp, updatedAt: timestamp }; store.items.push(item); await saveStore('watchlist', store); res.status(201).json(item); } catch (error) { next(error); } });
  router.route('/workbench/watchlist/:itemId').patch(async (req, res, next) => { try { const store = await loadStore('watchlist', 'items'); const index = store.items.findIndex((item) => item?.id === req.params.itemId); if (index < 0) throw new InvestmentError('Watchlist item not found.', 404); const item = { ...watchlistPayload(req.body || {}, store.items[index]), id: req.params.itemId, createdAt: store.items[index].createdAt || now(), updatedAt: now() }; store.items[index] = item; await saveStore('watchlist', store); res.json(item); } catch (error) { next(error); } }).delete(async (req, res, next) => { try { const store = await loadStore('watchlist', 'items'); const index = store.items.findIndex((item) => item?.id === req.params.itemId); if (index < 0) throw new InvestmentError('Watchlist item not found.', 404); store.items.splice(index, 1); await saveStore('watchlist', store); res.json({ deletedId: req.params.itemId }); } catch (error) { next(error); } });
  router.route('/workbench/journal').get(async (_req, res, next) => { try { const store = await loadStore('journal', 'entries'); res.json({ ...store, entries: [...store.entries].sort((a, b) => `${b.date || ''}${b.createdAt || ''}`.localeCompare(`${a.date || ''}${a.createdAt || ''}`)) }); } catch (error) { next(error); } }).post(async (req, res, next) => { try { const store = await loadStore('journal', 'entries'); const timestamp = now(); const entry = { ...journalPayload(req.body || {}), id: id('j'), createdAt: timestamp, updatedAt: timestamp }; store.entries.push(entry); await saveStore('journal', store); res.status(201).json(entry); } catch (error) { next(error); } });
  router.route('/workbench/journal/:entryId').patch(async (req, res, next) => { try { const store = await loadStore('journal', 'entries'); const index = store.entries.findIndex((entry) => entry?.id === req.params.entryId); if (index < 0) throw new InvestmentError('Journal entry not found.', 404); const entry = { ...journalPayload(req.body || {}, store.entries[index]), id: req.params.entryId, createdAt: store.entries[index].createdAt || now(), updatedAt: now() }; store.entries[index] = entry; await saveStore('journal', store); res.json(entry); } catch (error) { next(error); } }).delete(async (req, res, next) => { try { const store = await loadStore('journal', 'entries'); const index = store.entries.findIndex((entry) => entry?.id === req.params.entryId); if (index < 0) throw new InvestmentError('Journal entry not found.', 404); store.entries.splice(index, 1); await saveStore('journal', store); res.json({ deletedId: req.params.entryId }); } catch (error) { next(error); } });

  router.get('/knowledge/tree', async (_req, res, next) => { try { const categories = []; for (const entry of await fs.readdir(directories.knowledge, { withFileTypes: true }).catch(() => [])) { if (!entry.isDirectory() || entry.name.startsWith('.')) continue; const docs = await Promise.all((await markdownFiles(path.join(directories.knowledge, entry.name))).map((file) => documentSummary(file, 'knowledge'))); if (docs.length) categories.push({ key: entry.name, label: categoryLabels[entry.name] || entry.name, count: docs.length, docs }); } res.json({ categories, total: categories.reduce((sum, category) => sum + category.count, 0) }); } catch (error) { next(error); } });
  router.get('/knowledge/doc', async (req, res, next) => { try { const target = safePath(data, req.query.path); if (!inside(directories.knowledge, target)) throw new InvestmentError('Path must live under knowledge/.'); const doc = await existingMarkdown(target, 'Knowledge doc not found.'); res.json({ path: relativePosix(data, target), category: path.basename(path.dirname(target)), meta: doc.meta, body: doc.body }); } catch (error) { next(error); } });
  for (const [route, directory, label, kind] of [['models', directories.models, 'Model', 'models'], ['cases', directories.cases, 'Case', 'cases'], ['masters', directories.masters, 'Master', 'masters']]) {
    router.get(`/${route}`, async (_req, res, next) => { try { const items = await Promise.all((await markdownFiles(directory)).map((file) => documentSummary(file, kind))); const counts = {}; const secondary = {}; for (const item of items) { const primary = kind === 'masters' ? item.role : item.pillar; if (primary) counts[primary] = (counts[primary] || 0) + 1; const second = kind === 'cases' ? item.winner_or_loser : kind === 'masters' ? item.country : ''; if (second) secondary[second] = (secondary[second] || 0) + 1; } if (kind === 'cases') items.sort((a, b) => (b.era || '0000').localeCompare(a.era || '0000')); if (kind === 'masters') items.sort((a, b) => (b.era || '0000').localeCompare(a.era || '0000')); res.json(kind === 'cases' ? { items, pillars: counts, outcomes: secondary } : kind === 'masters' ? { items, roles: counts, countries: secondary } : { items, pillars: counts }); } catch (error) { next(error); } });
    router.get(`/${route}/:slug`, async (req, res, next) => { try { res.json(await detail(directory, req.params.slug, label)); } catch (error) { next(error); } });
  }

  const cache = async () => { const value = await readJson(files.cache, {}); return value && typeof value === 'object' ? value : {}; };
  const fresh = (value) => { const date = new Date(value); return !Number.isNaN(date.getTime()) && Date.now() - date.getTime() < cacheHours * 60 * 60 * 1000; };
  const fetchSource = async (url) => { try { const response = await fetch(url, { headers: { 'User-Agent': 'InvestmentLearningLibrary/1.0 (personal research index)', Accept: 'text/html,application/xhtml+xml' }, signal: AbortSignal.timeout(20000) }); if (!response.ok) throw new Error(`${response.status}`); return response.text(); } catch (error) { throw new InvestmentError(`暂时无法读取官方资料目录：${error.message}`, 503); } };
  const parseMemos = (html) => {
    const pattern = /<time\b[^>]*\bdatetime="[^\d]*(\d{4}-\d{2}-\d{2})[^\"]*"[^>]*>[\s\S]*?<\/time>\s*<a\b(?=[^>]*\bclass="[^"]*\boc-title-link\b[^"]*")[^>]*\bhref="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    const entries = []; const seen = new Set(); let match;
    while ((match = pattern.exec(html))) { const [_, date, rawHref, rawTitle] = match; const href = decodeHtml(rawHref); let sourceUrl = ''; const pdf = href.match(/'(https:\/\/www\.oaktreecapital\.com\/[^']+)'/); if (href.startsWith('javascript:openPDF')) sourceUrl = decodeHtml(pdf?.[1] || ''); else if (href.startsWith('/')) sourceUrl = `${oaktreeBaseUrl}${href}`; else if (href.startsWith(`${oaktreeBaseUrl}/`)) sourceUrl = href; const title = decodeHtml(rawTitle.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim(); const cleanUrl = sourceUrl.split('?')[0].toLowerCase(); if (!sourceUrl || !title || cleanUrl.endsWith('/the-complete-collection.pdf') || cleanUrl.endsWith('/the-best-of.pdf')) continue; const memoId = `${date}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`; if (seen.has(memoId)) continue; seen.add(memoId); entries.push({ id: memoId, date, year: date.slice(0, 4), title, source_url: sourceUrl, source_type: /\.pdf/i.test(sourceUrl) ? 'pdf' : 'page' }); }
    return entries.sort((a, b) => b.date.localeCompare(a.date));
  };
  const memos = async () => { const saved = await cache(); const cached = Array.isArray(saved.memos) ? saved.memos : []; if (cached.length && saved.memos_schema === cacheSchema && fresh(saved.memos_fetched_at)) return { entries: cached, stale: false, fetchedAt: saved.memos_fetched_at }; try { const entries = parseMemos(await fetchSource(oaktreeIndexUrl)); if (!entries.length) throw new InvestmentError('官方目录返回为空。', 503); await writeJson(files.cache, { ...saved, memos: entries, memos_fetched_at: now(), memos_schema: cacheSchema }); return { entries, stale: false, fetchedAt: now() }; } catch (error) { if (cached.length) return { entries: cached, stale: true, fetchedAt: saved.memos_fetched_at || '' }; throw error; } };
  router.get('/readings/buffett-letters', (_req, res) => { const items = Array.from({ length: 48 }, (_, offset) => 2024 - offset).map((year) => { const suffix = year >= 2007 ? `${year}ltr.pdf` : `${year}.html`; return { id: String(year), year: String(year), date: `${year}-02-01`, title: `${year} 年致股东信`, title_en: `Chairman’s Letter · ${year}`, source_url: `https://www.berkshirehathaway.com/letters/${suffix}`, source_type: suffix.endsWith('.pdf') ? 'pdf' : 'page' }; }); res.json({ items, official_index_url: 'https://www.berkshirehathaway.com/letters/letters.html', source_name: 'Berkshire Hathaway · Shareholder Letters', language_note: '英文为 Berkshire 官方原文；中文按钮使用即时机器翻译，便于学习时对照。', first_year: items.at(-1).year, last_year: items[0].year }); });
  router.get('/readings/oaktree-memos', async (_req, res, next) => { try { const value = await memos(); const { entries } = value; res.json({ items: entries, official_index_url: oaktreeIndexUrl, source_name: 'Oaktree Capital · Memos from Howard Marks', language_note: '英文为 Oaktree 官方原文；如 Oaktree 为该篇发布官方简体中文 PDF，中文按钮会直接打开该版本。', first_year: entries.at(-1)?.year || '', last_year: entries[0]?.year || '', fetched_at: value.fetchedAt, is_stale: value.stale }); } catch (error) { next(error); } });
  router.get('/readings/oaktree-memos/:itemId', async (req, res, next) => { try { const memoId = cleanText(req.params.itemId, '', 220).toLowerCase().replace(/[^a-z0-9-]/g, ''); if (!memoId) throw new InvestmentError('Invalid memo id.'); const value = await memos(); const entry = value.entries.find((item) => item.id === memoId); if (!entry) throw new InvestmentError('Memo not found.', 404); let officialChineseUrl = ''; if (entry.source_url.startsWith(`${oaktreeBaseUrl}/insights/memo/`)) { try { const source = await fetchSource(entry.source_url); officialChineseUrl = decodeHtml(source.match(/(https:\/\/www\.oaktreecapital\.com\/[^'"\s]*(?:translated-memos|translated_memos)[^'"\s]*_sc\.pdf[^'"\s]*)/i)?.[1] || ''); } catch { /* The English source remains usable. */ } } res.json({ ...entry, official_chinese_url: officialChineseUrl, is_stale: value.stale }); } catch (error) { next(error); } });

  router.get('/brief/list', async (_req, res, next) => { try { const summary = async (filename, kind) => { const doc = await markdown(filename); const result = { slug: scalar(metaValue(doc.meta, 'slug', path.basename(filename, '.md'))), title: scalar(metaValue(doc.meta, 'title', path.basename(filename, '.md'))), path: relativePosix(data, filename), kind, one_line: oneLine(doc.body), sample: ['true', 'yes', '1'].includes(scalar(metaValue(doc.meta, 'sample')).toLowerCase()), generated_by: scalar(metaValue(doc.meta, 'generated_by')) }; return kind === 'daily' ? { ...result, date: scalar(metaValue(doc.meta, 'date', path.basename(filename, '.md'))), weekday: scalar(metaValue(doc.meta, 'weekday')) } : { ...result, week_start: scalar(metaValue(doc.meta, 'week_start')), week_end: scalar(metaValue(doc.meta, 'week_end')), focus_industry: scalar(metaValue(doc.meta, 'focus_industry')) }; }; const [daily, weekly] = await Promise.all([markdownFiles(directories.daily), markdownFiles(directories.weekly)]); res.json({ daily: await Promise.all(daily.reverse().map((file) => summary(file, 'daily'))), weekly: await Promise.all(weekly.reverse().map((file) => summary(file, 'weekly'))) }); } catch (error) { next(error); } });
  router.get('/brief/doc', async (req, res, next) => { try { const target = safePath(data, req.query.path); if (!inside(directories.daily, target) && !inside(directories.weekly, target)) throw new InvestmentError('Path must live under daily/ or weekly/.'); const doc = await existingMarkdown(target, 'Brief not found.'); res.json({ path: relativePosix(data, target), kind: inside(directories.daily, target) ? 'daily' : 'weekly', meta: doc.meta, body: doc.body }); } catch (error) { next(error); } });
  router.get('/search', async (req, res, next) => { try { const query = cleanText(req.query.q, '', 240); if (query.length < 2) return res.json({ results: [], query }); const results = []; for (const [kind, directory] of Object.entries(directories)) { for (const filename of await markdownFiles(directory, true)) { const raw = await fs.readFile(filename, 'utf8'); if (!raw.toLowerCase().includes(query.toLowerCase()) && !path.basename(filename).toLowerCase().includes(query.toLowerCase())) continue; const doc = parseFrontmatter(raw); results.push({ kind, slug: scalar(metaValue(doc.meta, 'slug', path.basename(filename, '.md'))), title: scalar(metaValue(doc.meta, 'title', path.basename(filename, '.md'))), pillar: scalar(metaValue(doc.meta, 'pillar')), path: relativePosix(data, filename), snippet: snippet(doc.body || raw, query) }); if (results.length >= 60) break; } if (results.length >= 60) break; } res.json({ results, query }); } catch (error) { next(error); } });
  router.get('/meta', async (_req, res, next) => { try { const [watchlist, journal, knowledge, models, cases, masters, daily, weekly] = await Promise.all([loadStore('watchlist', 'items'), loadStore('journal', 'entries'), ...Object.values(directories).map((directory) => markdownFiles(directory, true))]); const pillars = {}; for (const item of watchlist.items) { const key = item?.pillar || 'other'; pillars[key] = (pillars[key] || 0) + 1; } res.json({ ok: true, phase: '1+2+3+3b+4 (scaffold + workbench + knowledge/models + cases + brief)', counts: { watchlist: watchlist.items.length, journal: journal.entries.length, journal_pending_review: journal.entries.filter((entry) => !cleanBlock(entry?.outcome) || !cleanBlock(entry?.lesson)).length, knowledge: knowledge.length, models: models.length, cases: cases.length, masters: masters.length, daily: daily.length, weekly: weekly.length }, watchlist_pillars: pillars, data_dir: data }); } catch (error) { next(error); } });
  router.use((error, _req, res, _next) => { console.error('[Investment]', error); res.status(error.status || 500).json({ error: error.status ? error.message : 'Investment 本地数据无法读取，请检查终端日志。' }); });
  return router;
}

export async function initializeInvestment({ dataDirectory = defaultDataDirectory } = {}) {
  await fs.mkdir(path.join(dataDirectory, 'workbench'), { recursive: true });
}
