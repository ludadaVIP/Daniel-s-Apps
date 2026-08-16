import express from 'express';
import { access, mkdir, readdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { BOOKS, BOOK_BY_ID } from './books.js';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const translationDirectories = {
  cuv: path.join(rootDir, 'data', 'cuv_data'),
  esv: path.join(rootDir, 'data', 'esv_data'),
};
const devotionDir = path.join(rootDir, 'devotion-data');
const notesDir = path.join(devotionDir, 'notes');
const indexFile = path.join(devotionDir, 'note-index.json');
const distDir = path.join(rootDir, 'dist');
let writeQueue = Promise.resolve();

const emptyIndex = () => ({ version: 1, chapters: {}, verses: {} });

function cleanChineseSpacing(text) {
  return String(text)
    .replace(/([\u3400-\u9fff])\s+(?=[\u3400-\u9fff，。；：！？、】【（）《》〈〉])/gu, '$1')
    .replace(/([，。；：！？、】【（）《》〈〉])\s+(?=[\u3400-\u9fff])/gu, '$1')
    .replace(/[\t ]{2,}/g, ' ')
    .trim();
}

function cleanEnglishText(text) {
  return String(text)
    .replace(/<[^>]*>/gu, '')
    .replace(/\s+/gu, ' ')
    .trim();
}

function parsePositiveInteger(value) {
  return typeof value === 'string' && /^[1-9]\d*$/.test(value) ? Number(value) : null;
}

function badRequest(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function getBook(bookId) {
  const book = BOOK_BY_ID.get(bookId);
  if (!book) throw badRequest('未知的圣经卷名。');
  return book;
}

function getTranslation(translationId) {
  if (!Object.hasOwn(translationDirectories, translationId)) throw badRequest('未知的圣经译本。');
  return translationId;
}

async function loadChapter(translationId, book, chapter) {
  const translation = getTranslation(translationId);
  const sourceFileName = book.sources?.[translation];
  if (!sourceFileName || path.basename(sourceFileName) !== sourceFileName) throw badRequest('该译本没有此卷数据。');
  const filePath = path.join(translationDirectories[translation], `${sourceFileName}.json`);
  const source = JSON.parse(await readFile(filePath, 'utf8'));
  if (!Array.isArray(source)) throw new Error(`圣经数据格式无效：${translation}/${book.id}`);
  return source.filter((item) => item.chapter === chapter);
}

async function validateTarget(params, needsVerse) {
  const book = getBook(params.book);
  const chapter = parsePositiveInteger(params.chapter);
  if (!chapter || chapter > book.chapters) throw badRequest('无效的章节号。');
  if (!needsVerse) return { book, chapter };

  const verse = parsePositiveInteger(params.verse);
  if (!verse) throw badRequest('无效的节号。');
  const source = await loadChapter('cuv', book, chapter);
  if (!source.some((item) => item.verse === verse)) {
    throw badRequest('该章节中不存在此节。');
  }
  return { book, chapter, verse };
}

function notePath({ book, chapter, verse }) {
  if (verse) return path.join(notesDir, 'verses', book.id, String(chapter), `${verse}.md`);
  return path.join(notesDir, 'chapters', book.id, `${chapter}.md`);
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readNote(target) {
  const filePath = notePath(target);
  try {
    return { exists: true, content: await readFile(filePath, 'utf8') };
  } catch (error) {
    if (error.code === 'ENOENT') return { exists: false, content: '' };
    throw error;
  }
}

function normalizeIndex(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return emptyIndex();
  const chapters = {};
  const verses = {};
  const rawChapters = value.chapters && typeof value.chapters === 'object' && !Array.isArray(value.chapters) ? value.chapters : {};
  const rawVerses = value.verses && typeof value.verses === 'object' && !Array.isArray(value.verses) ? value.verses : {};

  for (const [bookId, items] of Object.entries(rawChapters)) {
    const book = BOOK_BY_ID.get(bookId);
    if (!book || !Array.isArray(items)) continue;
    const valid = [...new Set(items.filter((chapter) => Number.isInteger(chapter) && chapter >= 1 && chapter <= book.chapters))].sort((a, b) => a - b);
    if (valid.length) chapters[bookId] = valid;
  }
  for (const [bookId, chapterEntries] of Object.entries(rawVerses)) {
    const book = BOOK_BY_ID.get(bookId);
    if (!book || !chapterEntries || typeof chapterEntries !== 'object' || Array.isArray(chapterEntries)) continue;
    const validChapters = {};
    for (const [chapter, items] of Object.entries(chapterEntries)) {
      const chapterNumber = parsePositiveInteger(chapter);
      if (!chapterNumber || chapterNumber > book.chapters || !Array.isArray(items)) continue;
      const validVerses = [...new Set(items.filter((verse) => Number.isInteger(verse) && verse >= 1))].sort((a, b) => a - b);
      if (validVerses.length) validChapters[chapterNumber] = validVerses;
    }
    if (Object.keys(validChapters).length) verses[bookId] = validChapters;
  }
  return { version: 1, chapters, verses };
}

async function readIndex() {
  try {
    return normalizeIndex(JSON.parse(await readFile(indexFile, 'utf8')));
  } catch (error) {
    if (error.code === 'ENOENT') return emptyIndex();
    if (error instanceof SyntaxError) return emptyIndex();
    throw error;
  }
}

async function directoryEntries(directory) {
  try {
    return await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function isMeaningfulMarkdown(filePath) {
  try {
    return Boolean((await readFile(filePath, 'utf8')).trim());
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

async function rebuildIndexFromNotes() {
  const rebuilt = emptyIndex();
  const chapterRoot = path.join(notesDir, 'chapters');
  const verseRoot = path.join(notesDir, 'verses');

  for (const bookEntry of await directoryEntries(chapterRoot)) {
    if (!bookEntry.isDirectory()) continue;
    const book = BOOK_BY_ID.get(bookEntry.name);
    if (!book) continue;
    const bookDirectory = path.join(chapterRoot, book.id);
    for (const fileEntry of await directoryEntries(bookDirectory)) {
      const match = fileEntry.isFile() && /^([1-9]\d*)\.md$/u.exec(fileEntry.name);
      if (!match) continue;
      const chapter = Number(match[1]);
      if (chapter > book.chapters) continue;
      if (await isMeaningfulMarkdown(path.join(bookDirectory, fileEntry.name))) addIndexMarker(rebuilt, { book, chapter });
    }
  }

  for (const bookEntry of await directoryEntries(verseRoot)) {
    if (!bookEntry.isDirectory()) continue;
    const book = BOOK_BY_ID.get(bookEntry.name);
    if (!book) continue;
    const bookDirectory = path.join(verseRoot, book.id);
    for (const chapterEntry of await directoryEntries(bookDirectory)) {
      if (!chapterEntry.isDirectory()) continue;
      const chapter = parsePositiveInteger(chapterEntry.name);
      if (!chapter || chapter > book.chapters) continue;
      const chapterDirectory = path.join(bookDirectory, chapterEntry.name);
      for (const fileEntry of await directoryEntries(chapterDirectory)) {
        const match = fileEntry.isFile() && /^([1-9]\d*)\.md$/u.exec(fileEntry.name);
        if (!match) continue;
        const verse = Number(match[1]);
        if (await isMeaningfulMarkdown(path.join(chapterDirectory, fileEntry.name))) addIndexMarker(rebuilt, { book, chapter, verse });
      }
    }
  }
  return rebuilt;
}

async function reconcileNoteIndex() {
  await mkdir(notesDir, { recursive: true });
  let current = emptyIndex();
  let needsRepair = false;
  try {
    const rawIndex = await readFile(indexFile, 'utf8');
    current = normalizeIndex(JSON.parse(rawIndex));
    // Keep the on-disk index canonical as well as semantically correct.  This
    // catches malformed nested values that normalize to an otherwise empty
    // index, and makes later writes predictable.
    needsRepair = rawIndex !== serializeIndex(current);
  } catch (error) {
    if (error.code === 'ENOENT' || error instanceof SyntaxError) needsRepair = true;
    else throw error;
  }
  const rebuilt = await rebuildIndexFromNotes();
  if (needsRepair || serializeIndex(current) !== serializeIndex(rebuilt) || !(await fileExists(indexFile))) {
    await atomicWrite(indexFile, serializeIndex(rebuilt));
    console.log('Bible Devotion note index reconciled.');
  }
}

async function atomicWrite(filePath, content) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = path.join(path.dirname(filePath), `.${path.basename(filePath)}.${randomUUID()}.tmp`);
  await writeFile(tempPath, content, 'utf8');
  await rename(tempPath, filePath);
}

function addIndexMarker(index, target) {
  const id = target.book.id;
  if (!target.verse) {
    const chapters = new Set(Array.isArray(index.chapters[id]) ? index.chapters[id] : []);
    chapters.add(target.chapter);
    index.chapters[id] = [...chapters].sort((a, b) => a - b);
    return;
  }
  index.verses[id] ??= {};
  const verses = new Set(Array.isArray(index.verses[id][target.chapter]) ? index.verses[id][target.chapter] : []);
  verses.add(target.verse);
  index.verses[id][target.chapter] = [...verses].sort((a, b) => a - b);
}

function removeIndexMarker(index, target) {
  const id = target.book.id;
  if (!target.verse) {
    const chapters = (index.chapters[id] ?? []).filter((chapter) => chapter !== target.chapter);
    if (chapters.length) index.chapters[id] = chapters;
    else delete index.chapters[id];
    return;
  }
  const bookVerses = index.verses[id];
  if (!bookVerses) return;
  const verses = (bookVerses[target.chapter] ?? []).filter((verse) => verse !== target.verse);
  if (verses.length) bookVerses[target.chapter] = verses;
  else delete bookVerses[target.chapter];
  if (!Object.keys(bookVerses).length) delete index.verses[id];
}

function serializeIndex(index) {
  return `${JSON.stringify(index, null, 2)}\n`;
}

function enqueueWrite(operation) {
  const result = writeQueue.then(operation, operation);
  writeQueue = result.catch(() => {});
  return result;
}

async function saveNote(target, content) {
  return enqueueWrite(async () => {
    const trimmed = content.trim();
    const filePath = notePath(target);
    const index = await readIndex();
    if (trimmed) {
      await atomicWrite(filePath, content);
      addIndexMarker(index, target);
    } else {
      await rm(filePath, { force: true });
      removeIndexMarker(index, target);
    }
    await atomicWrite(indexFile, serializeIndex(index));
    return { exists: Boolean(trimmed), content: trimmed ? content : '' };
  });
}

function targetResponse(target, note) {
  return {
    scope: target.verse ? 'verse' : 'chapter',
    book: { id: target.book.id, name: target.book.name },
    chapter: target.chapter,
    ...(target.verse ? { verse: target.verse } : {}),
    ...note,
  };
}

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/config', async (_req, res, next) => {
  try {
    const noteIndex = await readIndex();
    res.json({
      translation: { id: 'cuv', name: '和合本（中文）' },
      books: BOOKS,
      noteIndex,
    });
  } catch (error) { next(error); }
});

async function sendChapter(req, res, next, translationId) {
  try {
    const target = await validateTarget(req.params, false);
    const source = await loadChapter(translationId, target.book, target.chapter);
    const verses = source
      .map((item) => ({
        number: item.verse,
        text: translationId === 'cuv' ? cleanChineseSpacing(item.text) : cleanEnglishText(item.text),
      }));
    if (!verses.length) throw badRequest('该章节没有可用经文。');
    res.json({
      book: { id: target.book.id, name: target.book.name },
      chapter: target.chapter,
      translation: translationId,
      verses,
    });
  } catch (error) { next(error); }
}

app.get('/api/chapters/:book/:chapter', async (req, res, next) => {
  await sendChapter(req, res, next, 'cuv');
});

app.get('/api/translations/:translation/chapters/:book/:chapter', async (req, res, next) => {
  try {
    const translation = getTranslation(req.params.translation);
    await sendChapter(req, res, next, translation);
  } catch (error) { next(error); }
});

app.get(['/api/notes/:book/:chapter', '/api/notes/:book/:chapter/:verse'], async (req, res, next) => {
  try {
    const target = await validateTarget(req.params, Boolean(req.params.verse));
    res.json(targetResponse(target, await readNote(target)));
  } catch (error) { next(error); }
});

app.put(['/api/notes/:book/:chapter', '/api/notes/:book/:chapter/:verse'], async (req, res, next) => {
  try {
    if (!req.body || typeof req.body.content !== 'string') throw badRequest('请求体必须包含字符串 content。');
    const target = await validateTarget(req.params, Boolean(req.params.verse));
    const note = await saveNote(target, req.body.content);
    res.json(targetResponse(target, note));
  } catch (error) { next(error); }
});

app.use('/api', (_req, res) => res.status(404).json({ error: '未找到 API 路由。' }));
app.use(express.static(distDir));
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  res.sendFile(path.join(distDir, 'index.html'), (error) => {
    if (error) next(error);
  });
});

app.use((error, _req, res, _next) => {
  const status = error.status && error.status >= 400 && error.status < 600 ? error.status : 500;
  if (status >= 500) console.error(error);
  res.status(status).json({ error: status === 500 ? '服务器发生错误。' : error.message });
});

const port = Number(process.env.PORT) || 3000;
await reconcileNoteIndex();
app.listen(port, () => console.log(`Bible Devotion API listening on http://localhost:${port}`));

export { app, cleanChineseSpacing, cleanEnglishText };
