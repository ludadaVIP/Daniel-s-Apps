import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BOOKS, BOOK_BY_ID } from '../../bible/server/books.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const bibleDataDirectory = path.resolve(here, '../../bible/data/cuv_data');
const recallDirectory = path.resolve(here, '../recall-data');
const recallFile = path.join(recallDirectory, 'hidden-verses.json');
const allowedBookIds = new Set(['Psalms', 'Proverbs', 'Ecclesiastes', ...BOOKS.slice(39).map((book) => book.id)]);
const BOOKS_FOR_RECALL = BOOKS.filter((book) => allowedBookIds.has(book.id));

function badRequest(message) { const error = new Error(message); error.status = 400; return error; }
function parsePositiveInteger(value) { const number = Number(value); return Number.isSafeInteger(number) && number > 0 ? number : null; }
function cleanChineseSpacing(text) {
  return String(text)
    .replace(/([\u3400-\u9fff])\s+(?=[\u3400-\u9fff，。；：！？、】【（）《》〈〉])/gu, '$1')
    .replace(/([，。；：！？、】【（）《》〈〉])\s+(?=[\u3400-\u9fff])/gu, '$1')
    .replace(/[\t ]{2,}/g, ' ')
    .trim();
}
function stableNumbers(values) { return [...new Set(values)].sort((left, right) => left - right); }

function validateTarget(params) {
  const book = BOOK_BY_ID.get(params.book);
  const chapter = parsePositiveInteger(params.chapter);
  if (!book || !allowedBookIds.has(book.id)) throw badRequest('此应用未开放该经卷。');
  if (!chapter || chapter > book.chapters) throw badRequest('无效的章节号。');
  return { book, chapter };
}

async function readJson(file, fallback) {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch (error) { if (error.code === 'ENOENT') return fallback; throw error; }
}

async function readRecallData() {
  const loaded = await readJson(recallFile, { version: 1, verses: {} });
  return { version: 1, verses: loaded?.verses && typeof loaded.verses === 'object' ? loaded.verses : {} };
}

async function writeRecallData(data) {
  await fs.mkdir(recallDirectory, { recursive: true });
  await fs.writeFile(recallFile, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function chapterState(data, bookId, chapter) {
  return data.verses?.[bookId]?.[chapter] ?? {};
}

function hiddenVersesFor(state) {
  return stableNumbers(Array.isArray(state) ? state : state.hiddenVerses ?? []);
}

function recallCountsForBook(data, bookId) {
  return Object.fromEntries(Object.entries(data.verses?.[bookId] ?? {})
      .map(([chapter, state]) => [chapter, Array.isArray(state) ? state : state?.hiddenVerses])
      .filter(([, verses]) => Array.isArray(verses) && verses.length)
      .map(([chapter, verses]) => [chapter, stableNumbers(verses).length]));
}

async function loadChapter(book, chapter) {
  const source = await readJson(path.join(bibleDataDirectory, `${book.sources.cuv}.json`), null);
  if (!Array.isArray(source)) throw new Error('无法读取 CUV 经文数据。');
  const verses = source.filter((item) => item.chapter === chapter).map((item) => ({ number: item.verse, text: cleanChineseSpacing(item.text) }));
  if (!verses.length) throw badRequest('该章节没有可用经文。');
  return verses;
}

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '128kb' }));

app.get('/api/config', (_request, response) => {
  response.json({ translation: { id: 'cuv', name: '和合本（中文）' }, books: BOOKS_FOR_RECALL });
});

app.get('/api/chapters/:book/:chapter', async (request, response, next) => {
  try { const { book, chapter } = validateTarget(request.params); response.json({ book: { id: book.id, name: book.name }, chapter, translation: 'cuv', verses: await loadChapter(book, chapter) }); } catch (error) { next(error); }
});

app.get('/api/recall-summary/:book', async (request, response, next) => {
  try {
    const book = BOOK_BY_ID.get(request.params.book);
    if (!book || !allowedBookIds.has(book.id)) throw badRequest('此应用未开放该经卷。');
    response.json({ book: book.id, chapters: recallCountsForBook(await readRecallData(), book.id) });
  } catch (error) { next(error); }
});

app.get('/api/recall/:book/:chapter', async (request, response, next) => {
  try {
    const { book, chapter } = validateTarget(request.params);
    const state = chapterState(await readRecallData(), book.id, chapter);
    response.json({ book: book.id, chapter, hiddenVerses: hiddenVersesFor(state), paintedVerses: stableNumbers(state.paintedVerses ?? []) });
  } catch (error) { next(error); }
});

app.put('/api/recall/:book/:chapter', async (request, response, next) => {
  try {
    const { book, chapter } = validateTarget(request.params);
    if (!Array.isArray(request.body?.hiddenVerses) || !Array.isArray(request.body?.paintedVerses)) throw badRequest('hiddenVerses 和 paintedVerses 必须是经节号数组。');
    const availableVerses = new Set((await loadChapter(book, chapter)).map((verse) => verse.number));
    const hiddenVerses = stableNumbers(request.body.hiddenVerses);
    const paintedVerses = stableNumbers(request.body.paintedVerses);
    if (!hiddenVerses.every((verse) => Number.isSafeInteger(verse) && availableVerses.has(verse))) throw badRequest('包含无效的经节号。');
    if (!paintedVerses.every((verse) => hiddenVerses.includes(verse))) throw badRequest('蓝色重点标记必须属于已隐藏经节。');
    const recallData = await readRecallData();
    const bookData = recallData.verses[book.id] ?? (recallData.verses[book.id] = {});
    if (hiddenVerses.length) bookData[chapter] = { hiddenVerses, paintedVerses };
    else delete bookData[chapter];
    if (!Object.keys(bookData).length) delete recallData.verses[book.id];
    await writeRecallData(recallData);
    response.json({ book: book.id, chapter, hiddenVerses, paintedVerses, chapters: recallCountsForBook(recallData, book.id) });
  } catch (error) { next(error); }
});

app.use((error, _request, response, _next) => { const status = error.status || 500; if (status >= 500) console.error(error); response.status(status).json({ error: status === 500 ? '服务器发生错误。' : error.message }); });

export async function initializeRecallVerses() {}

export { app };
