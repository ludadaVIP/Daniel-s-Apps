import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const root = fileURLToPath(new URL('../', import.meta.url));
const allowedTypes = ['masters', 'concepts', 'cases', 'lessons'];

export function loadContent(directory = path.join(root, 'content')) {
  const items = [];
  for (const type of allowedTypes) {
    const folder = path.join(directory, type);
    if (!fs.existsSync(folder)) continue;
    for (const filename of fs.readdirSync(folder).filter((name) => name.endsWith('.md')).sort()) {
      const parsed = matter(fs.readFileSync(path.join(folder, filename), 'utf8'));
      const id = String(parsed.data.id || path.basename(filename, '.md'));
      if (!/^[a-z0-9-]+$/.test(id)) throw new Error(`无效内容 ID: ${filename}`);
      if (!parsed.data.title || !parsed.content.trim()) throw new Error(`内容缺少标题或正文: ${filename}`);
      const quiz = type === 'lessons' && Array.isArray(parsed.data.quiz)
        ? parsed.data.quiz.map((question) => ({ ...question, options: question.options.map((option) => String(option)) }))
        : parsed.data.quiz;
      items.push({ ...parsed.data, quiz, id, type, body: parsed.content.trim() });
    }
  }
  const ids = new Set();
  for (const item of items) {
    if (ids.has(item.id)) throw new Error(`重复内容 ID: ${item.id}`);
    ids.add(item.id);
  }
  return items;
}
