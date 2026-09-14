import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const here = path.dirname(fileURLToPath(import.meta.url));
const questionsFile = path.join(here, '..', 'Questions.md');
const answersDirectory = path.join(here, '..', 'answers');
const LAYER_DEFINITIONS = [
  ['brief', 'AI 的简单回答'],
  ['personal', '我的回答'],
  ['detailed', 'AI 的复杂回答'],
  ['explore', '更深层次的探讨'],
];
const BRIEF_ANSWER_MAX_LENGTH = 2000;

function badRequest(message) { const error = new Error(message); error.status = 400; return error; }
function slug(index, number) { return `section-${String(index).padStart(2, '0')}-question-${String(number).padStart(3, '0')}`; }
function cleanTitle(title) { return title.replace(/^关于/, '').replace(/[“”]/g, '').trim() || title; }
function blankLayers() { return Object.fromEntries(LAYER_DEFINITIONS.map(([id]) => [id, ''])); }

async function readQuestions() {
  const source = await fs.readFile(questionsFile, 'utf8');
  const categories = [];
  const questions = [];
  let category = null;
  for (const raw of source.split(/\r?\n/)) {
    const categoryMatch = raw.match(/^##\s+(.+)\s*$/);
    if (categoryMatch) {
      const title = categoryMatch[1].trim();
      category = { id: `section-${String(categories.length + 1).padStart(2, '0')}`, title, shortTitle: cleanTitle(title), count: 0 };
      categories.push(category);
      continue;
    }
    const questionMatch = raw.match(/^\s*(\d+)\.\s+(.+?)\s*$/);
    if (questionMatch && category) {
      const number = Number(questionMatch[1]);
      const id = slug(categories.length, number);
      questions.push({ id, globalIndex: questions.length + 1, number, categoryId: category.id, category: category.title, text: questionMatch[2] });
      category.count += 1;
    }
  }
  return { categories, questions };
}

function parseAnswer(source) {
  const parsed = matter(source);
  const layers = blankLayers();
  const pattern = /^##\s+(AI 的简单回答|我的回答|AI 的复杂回答|更深层次的探讨)\s*$/gm;
  const marks = [...parsed.content.matchAll(pattern)];
  for (let index = 0; index < marks.length; index += 1) {
    const [, title] = marks[index];
    const start = marks[index].index + marks[index][0].length;
    const end = index + 1 < marks.length ? marks[index + 1].index : parsed.content.length;
    const id = LAYER_DEFINITIONS.find(([, label]) => label === title)?.[0];
    if (id) layers[id] = parsed.content.slice(start, end).trim();
  }
  return { layers, updatedAt: parsed.data.updatedAt || null };
}

async function answerFor(question) {
  const file = path.join(answersDirectory, `${question.id}.md`);
  try { return parseAnswer(await fs.readFile(file, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return { layers: blankLayers(), updatedAt: null }; throw error; }
}

function safeLayers(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw badRequest('回答内容格式不正确。');
  const output = blankLayers();
  for (const [id] of LAYER_DEFINITIONS) {
    const text = value[id] ?? '';
    if (typeof text !== 'string') throw badRequest('每个回答层级都必须是 Markdown 文本。');
    if (text.length > 60000) throw badRequest('单个回答层级不能超过 60,000 个字符。');
    output[id] = text.trim();
  }
  if (output.brief.length > BRIEF_ANSWER_MAX_LENGTH) {
    throw badRequest(`AI 的简单回答不能超过 ${BRIEF_ANSWER_MAX_LENGTH} 个字符。`);
  }
  return output;
}

function answerMarkdown(question, layers, updatedAt) {
  const frontmatter = matter.stringify('', { questionId: question.id, question: question.text, category: question.category, updatedAt });
  return `${frontmatter.trimEnd()}\n\n${LAYER_DEFINITIONS.map(([id, label]) => `## ${label}\n\n${layers[id] || ''}`).join('\n\n')}\n`;
}

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '512kb' }));

app.get('/api/questions', async (_request, response, next) => {
  try { response.json(await readQuestions()); } catch (error) { next(error); }
});

app.get('/api/questions/:id/answer', async (request, response, next) => {
  try {
    const library = await readQuestions();
    const question = library.questions.find((item) => item.id === request.params.id);
    if (!question) throw badRequest('未找到这道题。');
    response.json(await answerFor(question));
  } catch (error) { next(error); }
});

app.put('/api/questions/:id/answer', async (request, response, next) => {
  try {
    const library = await readQuestions();
    const question = library.questions.find((item) => item.id === request.params.id);
    if (!question) throw badRequest('未找到这道题。');
    const layers = safeLayers(request.body?.layers);
    const updatedAt = new Date().toISOString();
    await fs.mkdir(answersDirectory, { recursive: true });
    await fs.writeFile(path.join(answersDirectory, `${question.id}.md`), answerMarkdown(question, layers, updatedAt), 'utf8');
    response.json({ layers, updatedAt });
  } catch (error) { next(error); }
});

app.use((error, _request, response, _next) => {
  if (!error.status) console.error('[BeliefQ&A]', error);
  response.status(error.status || 500).json({ error: error.status ? error.message : '题库资料暂时无法读取。' });
});

export async function initializeBeliefQA() { await fs.access(questionsFile); }
export { app };
