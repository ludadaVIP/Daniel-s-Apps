import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export const categories = ['human-nature', 'psychology', 'society', 'economics', 'industries', 'investing'];

function markdownFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(filename);
    return entry.isFile() && /\.md$/i.test(entry.name) && !/^readme\.md$/i.test(entry.name) ? [filename] : [];
  });
}

export function loadContent(directory) {
  const ids = new Set();
  const articles = markdownFiles(directory).sort().map((filename) => {
    let parsed;
    try { parsed = matter(fs.readFileSync(filename, 'utf8')); }
    catch (error) { throw new Error(`Markdown 格式错误 ${path.basename(filename)}: ${error.message}`); }
    const { data, content } = parsed;
    const id = data.id ?? path.basename(filename, '.md');
    const fail = (field) => { throw new Error(`内容 ${path.basename(filename)} 的 ${field} 无效`); };
    if (typeof id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || ids.has(id)) fail('id（需唯一 kebab-case）');
    ids.add(id);
    if (typeof data.title !== 'string' || !data.title.trim()) fail('title');
    if (!categories.includes(data.category)) fail('category');
    if (!['concept', 'case'].includes(data.type)) fail('type');
    if (typeof data.summary !== 'string' || !data.summary.trim()) fail('summary');
    const minutes = Number(data.minutes ?? data.readingTime ?? data.readTime);
    if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 120) fail('minutes');
    const difficulty = data.difficulty ?? 'intermediate';
    if (typeof difficulty !== 'string' || !difficulty.trim()) fail('difficulty');
    for (const field of ['tags', 'related']) {
      if (!Array.isArray(data[field]) || data[field].some((value) => typeof value !== 'string' || !value.trim())) fail(field);
    }
    if (content.trim().length < 100) fail('正文（至少 100 字符）');
    return { id, title: data.title.trim(), category: data.category, type: data.type, summary: data.summary.trim(), minutes,
      difficulty, tags: data.tags, related: data.related, body: content.trim(),
      ...(data.type === 'case' ? { eventKey: data.eventKey, learningObjective: data.learningObjective, sources: data.sources } : {}) };
  });
  for (const article of articles) {
    for (const related of article.related) {
      if (!ids.has(related)) throw new Error(`内容 ${article.id} 关联了不存在的文章 ${related}`);
    }
  }
  if (!articles.length) throw new Error('content 目录至少需要一篇有效 Markdown 文章');
  return articles;
}
