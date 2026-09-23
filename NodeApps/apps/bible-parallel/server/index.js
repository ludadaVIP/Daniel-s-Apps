import express from 'express';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { BOOKS, BOOK_BY_ID } from '../../bible/server/books.js';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bibleDataDir = path.resolve(rootDir, '..', 'bible', 'data');
const NVI_FILES = {
  Genesis: 'Génesis', Exodus: 'Éxodo', Leviticus: 'Levítico', Numbers: 'Números', Deuteronomy: 'Deuteronomio', Joshua: 'Josué', Judges: 'Jueces', Ruth: 'Rut',
  '1 Samuel': '1 Samuel', '2 Samuel': '2 Samuel', '1 Kings': '1 Reyes', '2 Kings': '2 Reyes', '1 Chronicles': '1 Crónicas', '2 Chronicles': '2 Crónicas', Ezra: 'Esdras', Nehemiah: 'Nehemías', Esther: 'Ester', Job: 'Job', Psalms: 'Salmo', Proverbs: 'Proverbios', Ecclesiastes: 'Eclesiastés', 'Song of Solomon': 'Cantares', Isaiah: 'Isaías', Jeremiah: 'Jeremías', Lamentations: 'Lamentaciones', Ezekiel: 'Ezequiel', Daniel: 'Daniel', Hosea: 'Oseas', Joel: 'Joel', Amos: 'Amós', Obadiah: 'Abdías', Jonah: 'Jonás', Micah: 'Miqueas', Nahum: 'Nahúm', Habakkuk: 'Habacuc', Zephaniah: 'Sofonías', Haggai: 'Hageo', Zechariah: 'Zacarías', Malachi: 'Malaquías',
  Matthew: 'Mateo', Mark: 'Marcos', Luke: 'Lucas', John: 'Juan', Acts: 'Hechos', Romans: 'Romanos', '1 Corinthians': '1 Corintios', '2 Corinthians': '2 Corintios', Galatians: 'Gálatas', Ephesians: 'Efesios', Philippians: 'Filipenses', Colossians: 'Colosenses', '1 Thessalonians': '1 Tesalonicenses', '2 Thessalonians': '2 Tesalonicenses', '1 Timothy': '1 Timoteo', '2 Timothy': '2 Timoteo', Titus: 'Tito', Philemon: 'Filemón', Hebrews: 'Hebreos', James: 'Santiago', '1 Peter': '1 Pedro', '2 Peter': '2 Pedro', '1 John': '1 Juan', '2 John': '2 Juan', '3 John': '3 Juan', Jude: 'Judas', Revelation: 'Apocalipsis',
};
const SUPPORTED_TRANSLATIONS = new Set(['cuv', 'esv', 'nvi']);

const sourceName = (translation, book) => {
  if (translation === 'cuv') return book.id;
  if (translation === 'esv') return book.id === 'Psalms' ? 'Psalm' : book.id;
  return NVI_FILES[book.id];
};

function cleanText(text, translation) {
  const value = String(text).replace(/<[^>]*>/gu, '').replace(/\s+/gu, ' ').trim();
  return translation === 'cuv'
    ? value.replace(/([\u3400-\u9fff])\s+(?=[\u3400-\u9fff，。；：！？、】【（）《》〈〉])/gu, '$1').replace(/([，。；：！？、】【（）《》〈〉])\s+(?=[\u3400-\u9fff])/gu, '$1')
    : value;
}

async function loadTranslation(translation, book, chapter) {
  const filename = sourceName(translation, book);
  if (!filename) throw new Error(`缺少 ${translation} 的 ${book.name} 数据。`);
  const filePath = path.join(bibleDataDir, `${translation}_data`, `${filename}.json`);
  const contents = JSON.parse(await readFile(filePath, 'utf8'));
  return contents.filter((verse) => verse.chapter === chapter).map((verse) => ({ number: verse.verse, text: cleanText(verse.text, translation) }));
}

function getBookAndChapter(params) {
  const book = BOOK_BY_ID.get(params.book);
  const chapter = Number(params.chapter);
  if (!book) throw Object.assign(new Error('未知的圣经卷名。'), { status: 404 });
  if (!Number.isInteger(chapter) || chapter < 1 || chapter > book.chapters) throw Object.assign(new Error('无效的章节号。'), { status: 400 });
  return { book, chapter };
}

function requestedTranslations(value) {
  const translations = String(value ?? 'cuv,esv').split(',').map((item) => item.trim()).filter(Boolean);
  const unique = [...new Set(translations)];
  if (!unique.length || unique.some((translation) => !SUPPORTED_TRANSLATIONS.has(translation))) {
    throw Object.assign(new Error('请求中包含未知的圣经译本。'), { status: 400 });
  }
  return unique;
}

export const app = express();
app.disable('x-powered-by');
app.get('/api/health', (_request, response) => response.json({ ok: true }));
app.get('/api/config', (_request, response) => response.json({ books: BOOKS.map(({ id, name, chapters, order }) => ({ id, name, chapters, order })), translations: [{ id: 'cuv', name: '和合本 CUV' }, { id: 'esv', name: 'English Standard Version' }, { id: 'nvi', name: 'Nueva Versión Internacional' }] }));
app.get('/api/chapters/:book/:chapter', async (request, response, next) => {
  try {
    const { book, chapter } = getBookAndChapter(request.params);
    const translations = requestedTranslations(request.query.translations);
    const entries = await Promise.all(translations.map(async (translation) => [translation, await loadTranslation(translation, book, chapter)]));
    const chapterTranslations = Object.fromEntries(entries);
    if (!chapterTranslations.cuv?.length) throw Object.assign(new Error('本章没有可用经文。'), { status: 404 });
    response.json({ book: { id: book.id, name: book.name }, chapter, translations: chapterTranslations });
  } catch (error) { next(error); }
});
app.use('/api', (_request, response) => response.status(404).json({ error: '未找到 API 路由。' }));
app.use((error, _request, response, _next) => { console.error('[Bible Parallel]', error); response.status(error.status || 500).json({ error: error.status ? error.message : '读取经文时发生错误。' }); });
