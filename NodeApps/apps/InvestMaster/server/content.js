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
      const questionIds = new Set();
      const quiz = type === 'lessons' && Array.isArray(parsed.data.quiz)
        ? parsed.data.quiz.map((question) => {
          if (!question || typeof question.id !== 'string' || !question.id || questionIds.has(question.id)) {
            throw new Error(`${filename}: 题目 ID 缺失或重复`);
          }
          questionIds.add(question.id);
          if (!Array.isArray(question.options) || question.options.length !== 3) {
            throw new Error(`${filename} / ${question.id}: 每题须有 3 个选项；金额或公式含英文逗号时，请用引号包住完整选项`);
          }
          const options = question.options.map((option) => {
            if (!['string', 'number'].includes(typeof option) || (typeof option === 'number' && !Number.isFinite(option)) || !String(option).trim()) {
              throw new Error(`${filename} / ${question.id}: 选项须为非空文字或有限数字`);
            }
            return String(option);
          });
          if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer >= options.length) {
            throw new Error(`${filename} / ${question.id}: 正确答案索引无效`);
          }
          return { ...question, options };
        })
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
