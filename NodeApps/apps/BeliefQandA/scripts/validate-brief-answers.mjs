import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const questionsFile = path.join(root, 'Questions.md');
const answersDirectory = path.join(root, 'answers');
const maxLength = 2000;
const briefHeading = /^## AI 的简单回答\s*$/m;
const nextHeading = /^## (?:我的回答|AI 的复杂回答|更深层次的探讨)\s*$/m;
const requiredHeadings = ['AI 的简单回答', '我的回答', 'AI 的复杂回答', '更深层次的探讨'];
const errors = [];

function questionsFrom(source) {
  const questions = [];
  let section = 0;
  for (const line of source.split(/\r?\n/)) {
    if (/^##\s+/.test(line)) { section += 1; continue; }
    const match = line.match(/^\s*(\d+)\.\s+(.+?)\s*$/);
    if (match && section) {
      questions.push({
        id: `section-${String(section).padStart(2, '0')}-question-${String(match[1]).padStart(3, '0')}`,
        text: match[2],
      });
    }
  }
  return questions;
}

function briefFrom(content) {
  const heading = briefHeading.exec(content);
  if (!heading) return null;
  const afterHeading = content.slice(heading.index + heading[0].length);
  const following = nextHeading.exec(afterHeading);
  return (following ? afterHeading.slice(0, following.index) : afterHeading).trim();
}

const questions = questionsFrom(await fs.readFile(questionsFile, 'utf8'));
let entries = [];
try { entries = await fs.readdir(answersDirectory); }
catch (error) { if (error.code !== 'ENOENT') throw error; }

const known = new Map(questions.map((question) => [question.id, question]));
let checked = 0;
for (const name of entries.filter((entry) => entry.endsWith('.md'))) {
  const id = name.slice(0, -3);
  const question = known.get(id);
  if (!question) { errors.push(`${name}: 题号不在 Questions.md 中。`); continue; }
  const parsed = matter(await fs.readFile(path.join(answersDirectory, name), 'utf8'));
  if (parsed.data.questionId !== id) errors.push(`${name}: questionId 与文件名不一致。`);
  if (parsed.data.question !== question.text) errors.push(`${name}: frontmatter 中的问题与题库不一致。`);
  const headings = [...parsed.content.matchAll(/^##\s+(.+?)\s*$/gm)].map((match) => match[1]);
  if (headings.length !== requiredHeadings.length || !requiredHeadings.every((heading, index) => headings[index] === heading)) {
    errors.push(`${name}: 四个回答层标题缺失、拼写错误或顺序不正确。`);
  }
  const brief = briefFrom(parsed.content);
  if (brief === null) errors.push(`${name}: 缺少“AI 的简单回答”标题。`);
  else if (!brief) errors.push(`${name}: 第一层回答不能为空。`);
  else if (brief.length > maxLength) errors.push(`${name}: 第一层回答为 ${brief.length} 字符，超过 ${maxLength}。`);
  else checked += 1;
}

if (errors.length) {
  console.error(`BeliefQ&A 校验失败（${errors.length} 项）：\n- ${errors.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`BeliefQ&A 校验通过：${checked} 个已填写的第一层回答，均不超过 ${maxLength} 字符。`);
}
