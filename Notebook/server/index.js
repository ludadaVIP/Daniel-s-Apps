import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const vault = path.join(root, 'vault');
const app = express();
const port = process.env.PORT || (process.env.NODE_ENV === 'production' ? 5176 : 4174);
const INDEX_PREVIEW_BYTES = 24 * 1024;
let metadataCache = null;

app.use(express.json({ limit: '2mb' }));

const normalizeId = (value) => {
  const id = String(value || '').replace(/\\/g, '/').replace(/^\/+/, '');
  if (!id || !id.endsWith('.md') || id.split('/').some((part) => !part || part === '.' || part === '..')) {
    return null;
  }
  return id;
};

const notePath = (id) => {
  const safeId = normalizeId(id);
  if (!safeId) return null;
  const target = path.resolve(vault, safeId);
  return target.startsWith(`${vault}${path.sep}`) ? target : null;
};

const walk = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(absolute);
    if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) return [absolute];
    return [];
  }));
  return nested.flat();
};

const description = (content) => content
  .replace(/```[\s\S]*?```/g, '')
  .replace(/[#>*_`\[\]()]/g, '')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, 170);

const readIndexPreview = async (absolute) => {
  const handle = await fs.open(absolute, 'r');
  try {
    const { size } = await handle.stat();
    const buffer = Buffer.alloc(Math.min(size, INDEX_PREVIEW_BYTES));
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
    return buffer.subarray(0, bytesRead).toString('utf8');
  } finally { await handle.close(); }
};

const getMeta = async (absolute) => {
  const [preview, stat] = await Promise.all([readIndexPreview(absolute), fs.stat(absolute)]);
  const { data, content } = matter(preview);
  const id = path.relative(vault, absolute).split(path.sep).join('/');
  const tags = Array.isArray(data.tags) ? data.tags : typeof data.tags === 'string' ? data.tags.split(',').map((tag) => tag.trim()) : [];
  return {
    id,
    title: data.title || path.basename(id, '.md').replace(/[-_]/g, ' '),
    date: data.date || stat.mtime.toISOString().slice(0, 10),
    tags,
    cover: data.cover || null,
    excerpt: description(content),
    links: [...content.matchAll(/\[\[([^\]|#]+)/g)].map((match) => match[1].trim()),
    updatedAt: stat.mtime.toISOString(),
    indexedBytes: Buffer.byteLength(preview),
  };
};

const sortNotes = (notes) => notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

const rebuildIndex = async () => {
  const files = await walk(vault);
  metadataCache = sortNotes(await Promise.all(files.map(getMeta)));
  return metadataCache;
};

const notesIndex = async (refresh = false) => {
  if (refresh || !metadataCache) return rebuildIndex();
  return metadataCache;
};

const updateCachedMeta = (meta) => {
  if (!metadataCache) return;
  metadataCache = sortNotes([meta, ...metadataCache.filter((note) => note.id !== meta.id)]);
};

const normalizeTag = (value) => String(value || '').replace(/^#/, '').trim().replace(/[\[\],\n]/g, '');

const rewriteTags = (raw, tags) => {
  const normalized = [...new Set(tags.map(normalizeTag).filter(Boolean))];
  const tagLine = `tags: [${normalized.map((tag) => JSON.stringify(tag)).join(', ')}]`;
  if (!raw.startsWith('---\n')) return `---\n${tagLine}\n---\n\n${raw}`;
  const closeAt = raw.indexOf('\n---', 3);
  if (closeAt < 0) return raw;
  const frontmatter = raw.slice(0, closeAt + 4);
  const body = raw.slice(closeAt + 4);
  const nextFrontmatter = /^tags:.*$/m.test(frontmatter)
    ? frontmatter.replace(/^tags:.*$/m, tagLine)
    : `${frontmatter.slice(0, -3)}${tagLine}\n---`;
  return `${nextFrontmatter}${body}`;
};

app.get('/api/notes', async (req, res, next) => {
  try {
    res.json(await notesIndex(req.query.refresh === '1'));
  } catch (error) { next(error); }
});

app.get(/^\/api\/notes\/(.+)$/, async (req, res, next) => {
  try {
    const id = req.params[0];
    const target = notePath(id);
    if (!target) return res.status(400).json({ error: 'Invalid note path' });
    const raw = await fs.readFile(target, 'utf8');
    res.json({ id, raw });
  } catch (error) {
    if (error.code === 'ENOENT') return res.status(404).json({ error: 'Note not found' });
    next(error);
  }
});

app.put(/^\/api\/notes\/(.+)$/, async (req, res, next) => {
  try {
    const id = req.params[0];
    const target = notePath(id);
    if (!target || typeof req.body.raw !== 'string') return res.status(400).json({ error: 'Invalid note payload' });
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, req.body.raw.replace(/\r\n/g, '\n'), 'utf8');
    const meta = await getMeta(target);
    updateCachedMeta(meta);
    res.json(meta);
  } catch (error) { next(error); }
});

app.delete(/^\/api\/notes\/(.+)$/, async (req, res, next) => {
  try {
    const target = notePath(req.params[0]);
    if (!target) return res.status(400).json({ error: 'Invalid note path' });
    await fs.unlink(target);
    if (metadataCache) metadataCache = metadataCache.filter((note) => note.id !== req.params[0]);
    res.status(204).end();
  } catch (error) {
    if (error.code === 'ENOENT') return res.status(404).json({ error: 'Note not found' });
    next(error);
  }
});

app.post('/api/tags/rename', async (req, res, next) => {
  try {
    const from = normalizeTag(req.body.from);
    const to = normalizeTag(req.body.to);
    if (!from || !to) return res.status(400).json({ error: '标签名称不能为空' });
    const affected = (await notesIndex()).filter((note) => note.tags.includes(from));
    for (const note of affected) {
      const target = notePath(note.id);
      const raw = await fs.readFile(target, 'utf8');
      await fs.writeFile(target, rewriteTags(raw, note.tags.map((tag) => tag === from ? to : tag)), 'utf8');
      updateCachedMeta(await getMeta(target));
    }
    res.json({ notes: await notesIndex(), changed: affected.length });
  } catch (error) { next(error); }
});

app.post('/api/tags/delete', async (req, res, next) => {
  try {
    const tag = normalizeTag(req.body.tag);
    if (!tag) return res.status(400).json({ error: '标签名称不能为空' });
    const affected = (await notesIndex()).filter((note) => note.tags.includes(tag));
    for (const note of affected) {
      const target = notePath(note.id);
      const raw = await fs.readFile(target, 'utf8');
      await fs.writeFile(target, rewriteTags(raw, note.tags.filter((value) => value !== tag)), 'utf8');
      updateCachedMeta(await getMeta(target));
    }
    res.json({ notes: await notesIndex(), changed: affected.length });
  } catch (error) { next(error); }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(root, 'dist')));
  app.get('/{*splat}', (_req, res) => res.sendFile(path.join(root, 'dist', 'index.html')));
}

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Notebook could not access the vault.' });
});

await fs.mkdir(vault, { recursive: true });
app.listen(port, () => console.log(`Notebook vault available at http://localhost:${port}`));
