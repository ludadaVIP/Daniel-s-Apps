import express from 'express';
import fs from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultLibraryDirectory = path.resolve(__dirname, '..', 'data', 'library');
const defaultCatalogPath = path.resolve(__dirname, '..', 'data', 'catalog.json');
const COVER_TONES = new Set(['azure', 'coral', 'jade', 'violet', 'amber', 'slate']);
const READING_STATUSES = new Set(['unread', 'reading', 'finished']);
const INDEX_PREVIEW_BYTES = 48 * 1024;
const FINGERPRINT_BUFFER_BYTES = 64 * 1024;
const SCAN_CONCURRENCY = 6;
const FINGERPRINT_PATTERN = /^[a-f0-9]{64}$/;
const WINDOWS_1252_LABELS = new Set(['windows-1252', 'cp1252', 'x-cp1252', 'iso-8859-1', 'latin1', 'latin-1']);
const UTF_8_LABELS = new Set(['utf-8', 'utf8']);

function openLocalLibraryDirectory(directory) {
  if (process.platform !== 'win32') throw new HtmlLibraryError('当前系统暂不支持从书库直接打开文件管理器。', 501);
  return new Promise((resolve, reject) => {
    const explorer = spawn('explorer.exe', [directory], { detached: true, stdio: 'ignore', windowsHide: false });
    explorer.once('error', reject);
    explorer.once('spawn', () => {
      explorer.unref();
      resolve();
    });
  });
}

class HtmlLibraryError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

class UnsafeLibrarySourceError extends Error {}

const own = (value, key) => Object.prototype.hasOwnProperty.call(value || {}, key);
const normalizeSpace = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
const documentId = (relativePath) => Buffer.from(relativePath, 'utf8').toString('base64url');

function safeRelativePath(value) {
  const normalized = String(value || '').replace(/\\/g, '/').replace(/^\/+/, '');
  if (!normalized || normalized.includes('\0') || !normalized.toLowerCase().endsWith('.html')) return null;
  const parts = normalized.split('/');
  if (parts.some((part) => !part || part === '.' || part === '..' || part.startsWith('.'))) return null;
  return parts.join('/');
}

function safeDirectoryPath(value) {
  if (!value) return '';
  const normalized = String(value).replace(/\\/g, '/').replace(/^\/+/, '');
  const parts = normalized.split('/');
  if (parts.some((part) => !part || part === '.' || part === '..' || part.startsWith('.'))) return null;
  return parts.join('/');
}

function decodedDocumentId(value) {
  const id = String(value || '');
  if (!/^[A-Za-z0-9_-]{2,}$/.test(id)) return null;
  try {
    const decoded = Buffer.from(id, 'base64url').toString('utf8');
    const relativePath = safeRelativePath(decoded);
    return relativePath && documentId(relativePath) === id ? relativePath : null;
  } catch { return null; }
}

function validCodePoint(code) {
  return Number.isSafeInteger(code) && code >= 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff);
}

function decodeNumericEntity(match, code, radix) {
  const value = Number.parseInt(code, radix);
  return validCodePoint(value) ? String.fromCodePoint(value) : match;
}

function decodeEntities(value) {
  return String(value || '')
    .replace(/&#x([0-9a-f]+);?/gi, (match, code) => decodeNumericEntity(match, code, 16))
    .replace(/&#(\d+);?/g, (match, code) => decodeNumericEntity(match, code, 10))
    .replace(/&(nbsp|amp|quot|apos|lt|gt);/gi, (_match, entity) => ({
      nbsp: ' ', amp: '&', quot: '"', apos: "'", lt: '<', gt: '>',
    })[entity.toLowerCase()]);
}

function textFromHtml(value) {
  return normalizeSpace(decodeEntities(String(value || '')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|noscript|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')));
}

function firstTagText(raw, tagName) {
  const match = String(raw).match(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\/${tagName}\\s*>`, 'i'));
  return match ? textFromHtml(match[1]) : '';
}

function attribute(tag, name) {
  const match = String(tag).match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return match ? decodeEntities(match[1] ?? match[2] ?? match[3] ?? '') : '';
}

function metaDescription(raw) {
  const metas = String(raw).match(/<meta\b[^>]*>/gi) || [];
  for (const tag of metas) {
    const name = attribute(tag, 'name').toLowerCase();
    const property = attribute(tag, 'property').toLowerCase();
    if (name === 'description' || property === 'og:description') {
      const content = normalizeSpace(attribute(tag, 'content'));
      if (content) return content;
    }
  }
  return '';
}

function contentSummary(raw) {
  const body = String(raw).match(/<body\b[^>]*>([\s\S]*?)<\/body\s*>/i)?.[1] || raw;
  return textFromHtml(body).slice(0, 360);
}

function defaultTitle(relativePath) {
  return path.basename(relativePath, '.html').replace(/[-_]+/g, ' ').trim() || '未命名文档';
}

function htmlCharsetFromPreview(bytes) {
  // Character-encoding declarations are ASCII by definition, so Latin-1 is a
  // lossless, byte-for-byte view suitable for finding them before decoding.
  const raw = Buffer.from(bytes).toString('latin1');
  const metas = raw.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of metas) {
    const direct = attribute(tag, 'charset').toLowerCase().replace(/["']/g, '').trim();
    if (direct) return direct;
    const content = attribute(tag, 'content');
    const declared = content.match(/\bcharset\s*=\s*([^\s;"']+)/i)?.[1]?.toLowerCase();
    if (declared) return declared;
  }
  return '';
}

function decodeWindows1252(bytes) {
  // TextDecoder is built into Node and implements the browser-compatible
  // Windows-1252 mapping, including the 0x80–0x9f code points.
  return new TextDecoder('windows-1252').decode(bytes);
}

function decodeUtf8Preview(bytes) {
  try {
    // A streaming decode accepts a multi-byte character cut by the 48KB
    // preview boundary without fabricating U+FFFD; malformed bytes elsewhere
    // still throw and trigger the Windows-1252 fallback below.
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes, { stream: true });
  } catch {
    return null;
  }
}

function decodePreview(bytes) {
  const declared = htmlCharsetFromPreview(bytes);
  if (WINDOWS_1252_LABELS.has(declared)) return decodeWindows1252(bytes);
  if (UTF_8_LABELS.has(declared)) return decodeUtf8Preview(bytes) ?? decodeWindows1252(bytes);
  return decodeUtf8Preview(bytes) ?? decodeWindows1252(bytes);
}

function isWhitespace(character) {
  return character === ' ' || character === '\n' || character === '\r' || character === '\t' || character === '\f';
}

function isHtmlNameCharacter(character) {
  return /[a-z0-9:_-]/i.test(character);
}

class HtmlFeatureScanner {
  constructor() {
    this.flags = { containsScripts: false, hasRemoteAssets: false, hasInteractiveContent: false };
    this.tagState = 'outside';
    this.tagName = '';
    this.attributeName = '';
    this.currentAttributeIsRemote = false;
    this.valuePrefix = '';
    this.valueQuote = '';
    this.cssState = 'none';
    this.cssValuePrefix = '';
    this.cssQuote = '';
  }

  process(chunk) {
    // Attribute and tag syntax is ASCII. Latin-1 gives a lossless byte view,
    // so this remains correct regardless of the document's text encoding.
    const text = Buffer.from(chunk).toString('latin1');
    for (const character of text) {
      this.processCssUrl(character);
      this.processHtml(character);
    }
  }

  processCssUrl(character) {
    if (this.flags.hasRemoteAssets) return;
    const lower = character.toLowerCase();
    if (this.cssState === 'none') {
      this.cssState = lower === 'u' ? 'u' : 'none';
    } else if (this.cssState === 'u') {
      this.cssState = lower === 'r' ? 'ur' : lower === 'u' ? 'u' : 'none';
    } else if (this.cssState === 'ur') {
      this.cssState = lower === 'l' ? 'url' : lower === 'u' ? 'u' : 'none';
    } else if (this.cssState === 'url') {
      this.cssState = isWhitespace(character) ? 'url-space' : character === '(' ? 'url-value-start' : lower === 'u' ? 'u' : 'none';
    } else if (this.cssState === 'url-space') {
      if (isWhitespace(character)) return;
      this.cssState = character === '(' ? 'url-value-start' : lower === 'u' ? 'u' : 'none';
    } else if (this.cssState === 'url-value-start') {
      if (isWhitespace(character)) return;
      if (character === '"' || character === "'") {
        this.cssQuote = character;
        this.cssValuePrefix = '';
        this.cssState = 'url-value-quoted';
      } else if (character === ')') {
        this.cssState = 'none';
      } else {
        this.cssValuePrefix = '';
        this.cssState = 'url-value-unquoted';
        this.addCssValueCharacter(character);
      }
    } else if (this.cssState === 'url-value-quoted') {
      if (character === this.cssQuote) this.cssState = 'url-close';
      else this.addCssValueCharacter(character);
    } else if (this.cssState === 'url-value-unquoted') {
      if (character === ')') this.cssState = 'none';
      else this.addCssValueCharacter(character);
    } else if (this.cssState === 'url-close') {
      this.cssState = character === ')' ? 'none' : 'url-close';
    }
  }

  addCssValueCharacter(character) {
    if (this.cssValuePrefix.length >= 8) return;
    this.cssValuePrefix += character.toLowerCase();
    if (this.isRemotePrefix(this.cssValuePrefix)) this.flags.hasRemoteAssets = true;
  }

  processHtml(character) {
    switch (this.tagState) {
      case 'outside':
        if (character === '<') this.tagState = 'after-open';
        return;
      case 'after-open':
        if (isWhitespace(character)) return;
        if (/[a-z]/i.test(character)) {
          this.tagName = character.toLowerCase();
          this.tagState = 'tag-name';
        } else {
          this.tagState = 'outside';
        }
        return;
      case 'tag-name':
        if (isHtmlNameCharacter(character)) {
          if (this.tagName.length < 64) this.tagName += character.toLowerCase();
        } else if (isWhitespace(character) || character === '/' || character === '>') {
          this.registerTag();
          this.tagState = character === '>' ? 'outside' : 'attribute-start';
        } else {
          this.tagState = 'outside';
        }
        return;
      case 'attribute-start':
        if (character === '>') {
          this.tagState = 'outside';
        } else if (!isWhitespace(character) && character !== '/') {
          this.attributeName = character.toLowerCase();
          this.tagState = 'attribute-name';
        }
        return;
      case 'attribute-name':
        if (isHtmlNameCharacter(character)) {
          if (this.attributeName.length < 128) this.attributeName += character.toLowerCase();
        } else if (character === '=') {
          this.currentAttributeIsRemote = ['src', 'href', 'poster', 'action'].includes(this.attributeName);
          this.valuePrefix = '';
          this.tagState = 'attribute-value-start';
        } else if (isWhitespace(character)) {
          this.tagState = 'after-attribute-name';
        } else if (character === '>') {
          this.tagState = 'outside';
        } else {
          this.tagState = 'attribute-start';
        }
        return;
      case 'after-attribute-name':
        if (character === '=') {
          this.currentAttributeIsRemote = ['src', 'href', 'poster', 'action'].includes(this.attributeName);
          this.valuePrefix = '';
          this.tagState = 'attribute-value-start';
        } else if (character === '>') {
          this.tagState = 'outside';
        } else if (!isWhitespace(character)) {
          this.attributeName = character.toLowerCase();
          this.tagState = 'attribute-name';
        }
        return;
      case 'attribute-value-start':
        if (isWhitespace(character)) return;
        if (character === '"' || character === "'") {
          this.valueQuote = character;
          this.tagState = 'attribute-value-quoted';
        } else if (character === '>') {
          this.tagState = 'outside';
        } else {
          this.tagState = 'attribute-value-unquoted';
          this.addAttributeValueCharacter(character);
        }
        return;
      case 'attribute-value-quoted':
        if (character === this.valueQuote) this.tagState = 'attribute-start';
        else this.addAttributeValueCharacter(character);
        return;
      case 'attribute-value-unquoted':
        if (character === '>') this.tagState = 'outside';
        else if (isWhitespace(character)) this.tagState = 'attribute-start';
        else this.addAttributeValueCharacter(character);
        return;
      default:
        this.tagState = 'outside';
    }
  }

  registerTag() {
    if (this.tagName === 'script') this.flags.containsScripts = true;
    if (['form', 'input', 'select', 'textarea', 'button', 'details', 'dialog', 'canvas', 'video', 'audio'].includes(this.tagName)) this.flags.hasInteractiveContent = true;
  }

  addAttributeValueCharacter(character) {
    if (!this.currentAttributeIsRemote || this.valuePrefix.length >= 8) return;
    this.valuePrefix += character.toLowerCase();
    if (this.isRemotePrefix(this.valuePrefix)) this.flags.hasRemoteAssets = true;
  }

  isRemotePrefix(prefix) {
    return prefix === '//' || prefix === 'http://' || prefix === 'https://';
  }
}

function normalizeTimestamp(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const timestamp = new Date(value);
  return Number.isNaN(timestamp.getTime()) ? null : timestamp.toISOString();
}

function sanitizedCatalogRecord(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const output = {};
  if (typeof value.title === 'string') output.title = normalizeSpace(value.title).slice(0, 160);
  if (typeof value.summary === 'string') output.summary = normalizeSpace(value.summary).slice(0, 500);
  if (Array.isArray(value.tags)) output.tags = [...new Set(value.tags.map((tag) => normalizeSpace(tag).replace(/^#/, '')).filter(Boolean))].slice(0, 12).map((tag) => tag.slice(0, 36));
  if (typeof value.favorite === 'boolean') output.favorite = value.favorite;
  if (READING_STATUSES.has(value.readingStatus)) output.readingStatus = value.readingStatus;
  if (COVER_TONES.has(value.coverTone)) output.coverTone = value.coverTone;
  const lastOpenedAt = normalizeTimestamp(value.lastOpenedAt);
  if (lastOpenedAt) output.lastOpenedAt = lastOpenedAt;
  if (typeof value.fingerprint === 'string' && FINGERPRINT_PATTERN.test(value.fingerprint)) output.fingerprint = value.fingerprint;
  return output;
}

async function readCatalog(catalogPath) {
  try {
    const loaded = JSON.parse(await fs.readFile(catalogPath, 'utf8'));
    const documents = loaded?.documents && typeof loaded.documents === 'object' && !Array.isArray(loaded.documents) ? loaded.documents : {};
    return { version: 2, documents: Object.fromEntries(Object.entries(documents).map(([key, value]) => [key, sanitizedCatalogRecord(value)])) };
  } catch (error) {
    if (error.code === 'ENOENT') return { version: 2, documents: {} };
    if (error instanceof SyntaxError) throw new HtmlLibraryError('目录资料文件格式无效，请修复 catalog.json。', 500);
    throw error;
  }
}

async function writeCatalog(catalogPath, catalog) {
  await fs.mkdir(path.dirname(catalogPath), { recursive: true });
  const temporary = `${catalogPath}.${process.pid}.${crypto.randomUUID()}.tmp`;
  try {
    await fs.writeFile(temporary, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
    await fs.rename(temporary, catalogPath);
  } catch (error) {
    // A failed replacement must not leave temporary catalog files beside the
    // library. More importantly, callers publish their proposed cache only
    // after this function succeeds.
    await fs.rm(temporary, { force: true }).catch(() => {});
    throw error;
  }
}

function pathIsInside(root, target) {
  const relative = path.relative(path.resolve(root), path.resolve(target));
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function sameFileIdentity(left, right) {
  return Boolean(left && right && left.dev === right.dev && left.ino === right.ino);
}

function sameFileVersion(left, right) {
  return sameFileIdentity(left, right)
    && left.size === right.size
    && Math.floor(left.mtimeMs) === Math.floor(right.mtimeMs)
    && Math.floor(left.ctimeMs) === Math.floor(right.ctimeMs);
}

function sourceVersion(stat) {
  return {
    dev: stat.dev,
    ino: stat.ino,
    size: stat.size,
    mtimeMs: stat.mtimeMs,
    ctimeMs: stat.ctimeMs,
  };
}

function filePathFor(context, relativePath) {
  const safePath = safeRelativePath(relativePath);
  if (!safePath) throw new UnsafeLibrarySourceError('Invalid library relative path.');
  const target = path.resolve(context.root, ...safePath.split('/'));
  if (!pathIsInside(context.root, target)) throw new UnsafeLibrarySourceError('Library path escaped its root.');
  return target;
}

function directoryPathFor(context, relativePath) {
  const safePath = safeDirectoryPath(relativePath);
  if (safePath === null) throw new UnsafeLibrarySourceError('Invalid library directory path.');
  const target = safePath ? path.resolve(context.root, ...safePath.split('/')) : context.root;
  if (!pathIsInside(context.root, target)) throw new UnsafeLibrarySourceError('Library directory escaped its root.');
  return target;
}

async function resolveLibraryContext(libraryDirectory) {
  const configuredRoot = path.resolve(libraryDirectory);
  let initial;
  try { initial = await fs.lstat(configuredRoot); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
  if (initial.isSymbolicLink() || !initial.isDirectory()) throw new UnsafeLibrarySourceError('Library root is not a real directory.');
  // On Windows, realpath can expand an 8.3 segment (ADMINI~1 -> Administrator),
  // so equivalent roots cannot be compared by string containment. Verify the
  // filesystem object instead, then use only the canonical spelling below.
  const realRoot = await fs.realpath(configuredRoot);
  const resolvedRoot = await fs.stat(realRoot);
  if (!resolvedRoot.isDirectory() || !sameFileIdentity(initial, resolvedRoot)) throw new UnsafeLibrarySourceError('Library root changed while resolving.');
  const finalRoot = await fs.lstat(configuredRoot);
  if (finalRoot.isSymbolicLink() || !finalRoot.isDirectory() || !sameFileIdentity(initial, finalRoot)) throw new UnsafeLibrarySourceError('Library root changed while being verified.');
  return { root: realRoot, realRoot };
}

async function verifiedDirectory(context, relativePath = '') {
  const target = directoryPathFor(context, relativePath);
  const before = await fs.lstat(target);
  if (before.isSymbolicLink() || !before.isDirectory()) throw new UnsafeLibrarySourceError('Library directory is not safe.');
  const realTarget = await fs.realpath(target);
  if (!pathIsInside(context.realRoot, realTarget)) throw new UnsafeLibrarySourceError('Library directory resolves outside root.');
  const after = await fs.lstat(target);
  if (after.isSymbolicLink() || !after.isDirectory() || !sameFileIdentity(before, after)) throw new UnsafeLibrarySourceError('Library directory changed while being verified.');
  return target;
}

async function openReadOnlyNoFollow(target) {
  const flags = fsConstants.O_RDONLY | (fsConstants.O_NOFOLLOW || 0);
  try { return await fs.open(target, flags); }
  catch (error) {
    // Windows does not implement O_NOFOLLOW. The fallback remains protected by
    // lstat/realpath/fstat identity checks before a single byte is consumed.
    if (fsConstants.O_NOFOLLOW && ['EINVAL', 'ENOTSUP', 'EOPNOTSUPP', 'ENOSYS'].includes(error.code)) return fs.open(target, fsConstants.O_RDONLY);
    throw error;
  }
}

async function openVerifiedHtmlFile(context, relativePath) {
  const target = filePathFor(context, relativePath);
  const before = await fs.lstat(target);
  if (before.isSymbolicLink() || !before.isFile()) throw new UnsafeLibrarySourceError('Library file is not safe.');
  const realBefore = await fs.realpath(target);
  if (!pathIsInside(context.realRoot, realBefore)) throw new UnsafeLibrarySourceError('Library file resolves outside root.');

  let handle;
  try {
    handle = await openReadOnlyNoFollow(target);
    const opened = await handle.stat();
    if (!opened.isFile() || !sameFileIdentity(before, opened)) throw new UnsafeLibrarySourceError('Library file changed before opening.');
    const after = await fs.lstat(target);
    if (after.isSymbolicLink() || !after.isFile() || !sameFileIdentity(opened, after)) throw new UnsafeLibrarySourceError('Library file changed while opening.');
    const realAfter = await fs.realpath(target);
    if (!pathIsInside(context.realRoot, realAfter)) throw new UnsafeLibrarySourceError('Library file resolves outside root.');
    const followed = await fs.stat(target);
    if (!sameFileIdentity(opened, followed)) throw new UnsafeLibrarySourceError('Library file changed after opening.');
    return { handle, stat: opened };
  } catch (error) {
    await handle?.close().catch(() => {});
    throw error;
  }
}

async function listHtmlFiles(context) {
  const paths = [];
  let warningCount = 0;
  const visit = async (relativeDirectory = '') => {
    let directory;
    try { directory = await verifiedDirectory(context, relativeDirectory); }
    catch (_error) { warningCount += 1; return; }
    let entries;
    try { entries = await fs.readdir(directory, { withFileTypes: true }); }
    catch (_error) { warningCount += 1; return; }
    try { await verifiedDirectory(context, relativeDirectory); }
    catch (_error) { warningCount += 1; return; }
    for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
      if (entry.name.startsWith('.')) continue;
      const relativePath = relativeDirectory ? `${relativeDirectory}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        await visit(relativePath);
      } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.html') {
        paths.push(relativePath);
      } else if (entry.isSymbolicLink()) {
        // Count rejected links without reporting their name or target.
        warningCount += 1;
      }
    }
  };
  await visit();
  return { paths, warningCount };
}

async function readPreviewAndFingerprint(handle, initialStat) {
  const previewChunks = [];
  let previewBytes = 0;
  const hash = crypto.createHash('sha256');
  const featureScanner = new HtmlFeatureScanner();
  const buffer = Buffer.alloc(FINGERPRINT_BUFFER_BYTES);
  let position = 0;
  while (true) {
    const chunk = await handle.read(buffer, 0, buffer.length, position);
    if (!chunk.bytesRead) break;
    const bytes = buffer.subarray(0, chunk.bytesRead);
    hash.update(bytes);
    featureScanner.process(bytes);
    if (previewBytes < INDEX_PREVIEW_BYTES) {
      const end = Math.min(bytes.length, INDEX_PREVIEW_BYTES - previewBytes);
      previewChunks.push(Buffer.from(bytes.subarray(0, end)));
      previewBytes += end;
    }
    position += chunk.bytesRead;
  }
  const finalStat = await handle.stat();
  if (!sameFileVersion(initialStat, finalStat)) throw new UnsafeLibrarySourceError('Library file changed while scanning.');
  return {
    preview: decodePreview(Buffer.concat(previewChunks, previewBytes)),
    fingerprint: hash.digest('hex'),
    featureFlags: featureScanner.flags,
  };
}

async function scanSource(context, relativePath) {
  const { handle, stat } = await openVerifiedHtmlFile(context, relativePath);
  try {
    const { preview, fingerprint, featureFlags } = await readPreviewAndFingerprint(handle, stat);
    return {
      relativePath,
      bytes: stat.size,
      updatedAt: stat.mtime.toISOString(),
      sourceVersion: sourceVersion(stat),
      fingerprint,
      preview,
      featureFlags,
    };
  } finally { await handle.close(); }
}

async function mapWithConcurrency(values, mapper, concurrency = SCAN_CONCURRENCY) {
  const results = new Array(values.length);
  let next = 0;
  const worker = async () => {
    while (true) {
      const current = next;
      next += 1;
      if (current >= values.length) return;
      try { results[current] = { value: await mapper(values[current]) }; }
      catch (error) { results[current] = { error }; }
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, worker));
  return results;
}

function reconcileCatalog(catalog, sources) {
  const before = JSON.stringify(catalog.documents);
  const sourcePaths = new Set(sources.map((source) => source.relativePath));
  const sourcesByFingerprint = new Map();
  const oldByFingerprint = new Map();
  for (const source of sources) {
    const matches = sourcesByFingerprint.get(source.fingerprint) || [];
    matches.push(source);
    sourcesByFingerprint.set(source.fingerprint, matches);
  }
  for (const [relativePath, record] of Object.entries(catalog.documents)) {
    if (sourcePaths.has(relativePath) || !FINGERPRINT_PATTERN.test(record.fingerprint || '')) continue;
    const matches = oldByFingerprint.get(record.fingerprint) || [];
    matches.push(relativePath);
    oldByFingerprint.set(record.fingerprint, matches);
  }
  for (const [fingerprint, oldPaths] of oldByFingerprint) {
    const candidates = sourcesByFingerprint.get(fingerprint) || [];
    // No guesswork when a user has duplicate files or duplicate stale records.
    if (oldPaths.length !== 1 || candidates.length !== 1) continue;
    const oldPath = oldPaths[0];
    const candidate = candidates[0];
    if (own(catalog.documents, candidate.relativePath)) continue;
    catalog.documents[candidate.relativePath] = { ...sanitizedCatalogRecord(catalog.documents[oldPath]), fingerprint };
    delete catalog.documents[oldPath];
  }
  for (const source of sources) {
    const current = sanitizedCatalogRecord(catalog.documents[source.relativePath]);
    // A file can be deliberately replaced in place. A persisted fingerprint is
    // the identity proof for the metadata at this path, so retaining it when
    // the bytes change would silently give a different document the previous
    // document's title, tags, reading state, and history. Records created
    // before fingerprints existed are intentionally migrated in place: they
    // have no identity proof to contradict the source at their established
    // path. Unique fingerprint path moves have already been handled above.
    const hasPriorFingerprint = FINGERPRINT_PATTERN.test(current.fingerprint || '');
    catalog.documents[source.relativePath] = hasPriorFingerprint && current.fingerprint !== source.fingerprint
      ? { fingerprint: source.fingerprint }
      : { ...current, fingerprint: source.fingerprint };
  }
  catalog.version = 2;
  return before !== JSON.stringify(catalog.documents);
}

async function scanLibrary(libraryDirectory, catalog, { reconcile = true } = {}) {
  const context = await resolveLibraryContext(libraryDirectory);
  if (!context) return { items: [], warningCount: 0, catalogChanged: false };
  const discovered = await listHtmlFiles(context);
  const results = await mapWithConcurrency(discovered.paths, (relativePath) => scanSource(context, relativePath));
  const sources = results.flatMap((result) => result.value ? [result.value] : []);
  const warningCount = discovered.warningCount + results.filter((result) => result.error).length;
  // The reader may need to construct an initial index before the normal list
  // endpoint has ever run. In that path, use the catalog only as existing
  // metadata: discovering a document must not add fingerprints, repair
  // renamed paths, or cause a catalog write as a side effect of opening it.
  const catalogChanged = reconcile ? reconcileCatalog(catalog, sources) : false;
  const items = sources.map((source) => {
    const stored = sanitizedCatalogRecord(catalog.documents[source.relativePath]);
    const inferredTitle = firstTagText(source.preview, 'title') || firstTagText(source.preview, 'h1') || defaultTitle(source.relativePath);
    const inferredSummary = metaDescription(source.preview) || contentSummary(source.preview) || inferredTitle;
    return {
      id: documentId(source.relativePath),
      relativePath: source.relativePath,
      folder: path.posix.dirname(source.relativePath) === '.' ? '' : path.posix.dirname(source.relativePath),
      // These internal fields make a metadata-only transaction independent of
      // a full scan, while keeping the public response free of source internals.
      inferredTitle,
      inferredSummary,
      title: stored.title || inferredTitle,
      summary: stored.summary || inferredSummary,
      tags: stored.tags || [],
      bytes: source.bytes,
      updatedAt: source.updatedAt,
      ...source.featureFlags,
      favorite: stored.favorite || false,
      readingStatus: stored.readingStatus || 'unread',
      coverTone: stored.coverTone || 'azure',
      lastOpenedAt: stored.lastOpenedAt || null,
      fingerprint: source.fingerprint,
      sourceVersion: source.sourceVersion,
    };
  });
  return { items: items.sort((left, right) => left.title.localeCompare(right.title, 'zh-Hans-CN')), warningCount, catalogChanged };
}

function publicItem(item) {
  const {
    fingerprint,
    inferredTitle,
    inferredSummary,
    sourceVersion: _sourceVersion,
    ...document
  } = item;
  return document;
}

function copyCatalog(catalog) {
  return {
    version: 2,
    documents: Object.fromEntries(Object.entries(catalog.documents || {}).map(([relativePath, record]) => [
      relativePath,
      { ...sanitizedCatalogRecord(record) },
    ])),
  };
}

function itemWithCatalogMetadata(item, record) {
  const stored = sanitizedCatalogRecord(record);
  return {
    ...item,
    title: stored.title || item.inferredTitle || item.title,
    summary: stored.summary || item.inferredSummary || item.summary,
    tags: stored.tags || [],
    favorite: stored.favorite || false,
    readingStatus: stored.readingStatus || 'unread',
    coverTone: stored.coverTone || 'azure',
    lastOpenedAt: stored.lastOpenedAt || null,
    fingerprint: stored.fingerprint || item.fingerprint,
  };
}

function indexWithUpdatedItem(index, updatedItem) {
  return {
    ...index,
    items: index.items
      .map((item) => item.id === updatedItem.id ? updatedItem : item)
      .sort((left, right) => left.title.localeCompare(right.title, 'zh-Hans-CN')),
  };
}

function envelope(index) {
  const { items, warningCount } = index;
  const folders = new Map(); const tags = new Map();
  const summary = { total: items.length, favorites: 0, unread: 0, reading: 0, finished: 0, containsScripts: 0, hasRemoteAssets: 0, hasInteractiveContent: 0, warningCount };
  for (const item of items) {
    const folder = item.folder || '根目录'; folders.set(folder, (folders.get(folder) || 0) + 1);
    for (const tag of item.tags) tags.set(tag, (tags.get(tag) || 0) + 1);
    if (item.favorite) summary.favorites += 1;
    summary[item.readingStatus] += 1;
    if (item.containsScripts) summary.containsScripts += 1;
    if (item.hasRemoteAssets) summary.hasRemoteAssets += 1;
    if (item.hasInteractiveContent) summary.hasInteractiveContent += 1;
  }
  const values = (map) => [...map.entries()].map(([name, count]) => ({ name, count })).sort((left, right) => left.name.localeCompare(right.name, 'zh-Hans-CN'));
  return { items: items.map(publicItem), facets: { folders: values(folders), tags: values(tags) }, summary };
}

function metadataPatch(payload, current) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new HtmlLibraryError('元数据必须是 JSON 对象。');
  const keys = ['title', 'summary', 'tags', 'favorite', 'readingStatus', 'coverTone', 'lastOpenedAt'];
  if (!keys.some((key) => own(payload, key))) throw new HtmlLibraryError('请至少提供一项可更新的元数据。');
  const output = { ...current };
  if (own(payload, 'title')) {
    if (typeof payload.title !== 'string' || normalizeSpace(payload.title).length > 160) throw new HtmlLibraryError('标题必须是不超过 160 个字符的文本。');
    output.title = normalizeSpace(payload.title);
  }
  if (own(payload, 'summary')) {
    if (typeof payload.summary !== 'string' || normalizeSpace(payload.summary).length > 500) throw new HtmlLibraryError('简介必须是不超过 500 个字符的文本。');
    output.summary = normalizeSpace(payload.summary);
  }
  if (own(payload, 'tags')) {
    if (!Array.isArray(payload.tags) || payload.tags.length > 12 || payload.tags.some((tag) => typeof tag !== 'string' || normalizeSpace(tag).length < 1 || normalizeSpace(tag).length > 36)) throw new HtmlLibraryError('标签最多 12 个，且每个标签不能超过 36 个字符。');
    output.tags = [...new Set(payload.tags.map((tag) => normalizeSpace(tag).replace(/^#/, '')).filter(Boolean))];
  }
  if (own(payload, 'favorite')) {
    if (typeof payload.favorite !== 'boolean') throw new HtmlLibraryError('收藏状态必须为 true 或 false。');
    output.favorite = payload.favorite;
  }
  if (own(payload, 'readingStatus')) {
    if (!READING_STATUSES.has(payload.readingStatus)) throw new HtmlLibraryError('阅读状态仅支持 unread、reading 或 finished。');
    output.readingStatus = payload.readingStatus;
  }
  if (own(payload, 'coverTone')) {
    if (!COVER_TONES.has(payload.coverTone)) throw new HtmlLibraryError('封面颜色无效。');
    output.coverTone = payload.coverTone;
  }
  if (own(payload, 'lastOpenedAt')) {
    if (payload.lastOpenedAt !== null && !normalizeTimestamp(payload.lastOpenedAt)) throw new HtmlLibraryError('最近打开时间必须是有效的 ISO 时间。');
    if (payload.lastOpenedAt === null) delete output.lastOpenedAt;
    else output.lastOpenedAt = normalizeTimestamp(payload.lastOpenedAt);
  }
  return sanitizedCatalogRecord(output);
}

async function readFullDocument(libraryDirectory, relativePath) {
  const context = await resolveLibraryContext(libraryDirectory);
  if (!context) throw new HtmlLibraryError('文档不存在。', 404);
  try {
    const { handle, stat } = await openVerifiedHtmlFile(context, relativePath);
    try {
      // Keep the original bytes. HTML may declare a legacy encoding such as
      // Windows-1252, and converting it to a JavaScript string would silently
      // corrupt it before the browser gets a chance to honor that declaration.
      const raw = await handle.readFile();
      const finalStat = await handle.stat();
      if (!sameFileVersion(stat, finalStat)) throw new UnsafeLibrarySourceError('Library file changed while reading.');
      return raw;
    } finally { await handle.close(); }
  } catch (error) {
    if (error instanceof UnsafeLibrarySourceError || error.code === 'ENOENT') throw new HtmlLibraryError('文档不存在。', 404);
    throw error;
  }
}

export function createHtmlLibraryApp({
  libraryDirectory = defaultLibraryDirectory,
  catalogPath = defaultCatalogPath,
  // Production uses the atomic writer above. The optional seam lets the
  // transaction behavior be tested without changing filesystem timing.
  catalogWriter = writeCatalog,
  // A narrow seam for tests; production opens the verified fixed library root.
  openLibraryDirectory = openLocalLibraryDirectory,
} = {}) {
  const library = path.resolve(libraryDirectory);
  const catalogFile = path.resolve(catalogPath);
  const app = express();
  let catalogCache = null;
  let indexCache = null;
  // The desktop server deliberately runs as one root Express process (no
  // cluster/multi-worker mode). This process-scoped queue serializes its own
  // catalog changes; a multi-process deployment would require external locking.
  // A rejected write must not poison the next task, so only the private tail
  // swallows failures; callers still receive their own rejection.
  let catalogMutationTail = Promise.resolve();
  const enqueueCatalogMutation = (operation) => {
    const task = catalogMutationTail.then(operation, operation);
    catalogMutationTail = task.catch(() => {});
    return task;
  };

  const catalog = async () => {
    if (!catalogCache) catalogCache = await readCatalog(catalogFile);
    return catalogCache;
  };

  const publish = ({ proposedCatalog, proposedIndex, write }) => async () => {
    // Copy-on-write transaction: neither shared cache is changed before the
    // on-disk replacement has succeeded. This prevents a failed PATCH from
    // becoming visible through a later cached or refreshed read.
    if (write) await catalogWriter(catalogFile, proposedCatalog);
    if (write) catalogCache = proposedCatalog;
    indexCache = proposedIndex;
    return proposedIndex;
  };

  const rebuildIndex = async () => {
    const proposedCatalog = copyCatalog(await catalog());
    const proposedIndex = await scanLibrary(library, proposedCatalog);
    return publish({
      proposedCatalog,
      proposedIndex,
      write: proposedIndex.catalogChanged,
    })();
  };
  const index = (refresh = false) => {
    // Cached list/detail reads intentionally bypass the queue. The queue is only
    // for operations which mutate catalog data or replace the shared index cache.
    if (!refresh && indexCache) return Promise.resolve(indexCache);
    return enqueueCatalogMutation(async () => {
      // A prior queued refresh may have filled this cache while this request was
      // waiting, so avoid a redundant scan for ordinary reads.
      if (!refresh && indexCache) return indexCache;
      return rebuildIndex();
    });
  };
  const readOnlyIndex = async () => {
    // Do not populate indexCache here. A reader is intentionally independent
    // from catalog reconciliation so a cold GET /document/:id cannot modify
    // catalog.json merely because older metadata lacks fingerprints.
    return scanLibrary(library, await catalog(), { reconcile: false });
  };
  const itemForId = (index, id, relativePath) => index.items.find((entry) => entry.relativePath === relativePath && entry.id === id);
  const knownDocument = async (id) => {
    const relativePath = decodedDocumentId(id);
    if (!relativePath) throw new HtmlLibraryError('文档标识无效。');
    const item = itemForId(await index(), id, relativePath);
    if (!item) throw new HtmlLibraryError('文档不存在或尚未同步。', 404);
    return item;
  };
  const knownDocumentForRead = async (id) => {
    const relativePath = decodedDocumentId(id);
    if (!relativePath) throw new HtmlLibraryError('文档标识无效。');
    const item = itemForId(indexCache || await readOnlyIndex(), id, relativePath);
    if (!item) throw new HtmlLibraryError('文档不存在或尚未同步。', 404);
    return item;
  };

  const sourceMatchesCachedItem = async (item) => {
    if (!item?.sourceVersion) return false;
    const context = await resolveLibraryContext(library);
    if (!context) return false;
    try {
      const { handle, stat } = await openVerifiedHtmlFile(context, item.relativePath);
      try { return sameFileVersion(item.sourceVersion, stat); }
      finally { await handle.close(); }
    } catch {
      return false;
    }
  };

  const persistMetadata = (item, patch) => enqueueCatalogMutation(async () => {
    // The usual path verifies only this document's immutable source version.
    // A full scan is reserved for an actual source change, so an explicit
    // reading event does not rescan every HTML file in the library.
    let currentIndex = indexCache;
    let currentItem = currentIndex?.items.find((entry) => entry.id === item.id);
    let proposedCatalog = copyCatalog(await catalog());
    if (!currentItem || !await sourceMatchesCachedItem(currentItem)) {
      currentIndex = await scanLibrary(library, proposedCatalog);
      currentItem = currentIndex.items.find((entry) => entry.id === item.id);
    }
    if (!currentItem) throw new HtmlLibraryError('文档不存在或尚未同步。', 404);

    proposedCatalog.documents[currentItem.relativePath] = {
      ...metadataPatch(patch, proposedCatalog.documents[currentItem.relativePath]),
      fingerprint: currentItem.fingerprint,
    };
    proposedCatalog.version = 2;
    const updatedItem = itemWithCatalogMetadata(currentItem, proposedCatalog.documents[currentItem.relativePath]);
    const updatedIndex = indexWithUpdatedItem(currentIndex, updatedItem);
    await publish({ proposedCatalog, proposedIndex: updatedIndex, write: true })();
    return updatedItem;
  });
  const recordOpened = async (item) => persistMetadata(item, { lastOpenedAt: new Date().toISOString() });

  app.disable('x-powered-by');
  app.use(express.json({ limit: '64kb', strict: true }));
  app.get('/api/documents', async (request, response, next) => {
    try { response.json(envelope(await index(request.query.refresh === '1'))); }
    catch (error) { next(error); }
  });
  app.get('/api/documents/:id', async (request, response, next) => {
    try { response.json(publicItem(await knownDocumentForRead(request.params.id))); }
    catch (error) { next(error); }
  });
  app.patch('/api/documents/:id/metadata', async (request, response, next) => {
    try { response.json(publicItem(await persistMetadata(await knownDocument(request.params.id), request.body))); }
    catch (error) { next(error); }
  });
  app.post('/api/documents/:id/open', async (request, response, next) => {
    try { response.json(publicItem(await recordOpened(await knownDocument(request.params.id)))); }
    catch (error) { next(error); }
  });
  app.post('/api/library/open', async (_request, response, next) => {
    try {
      const context = await resolveLibraryContext(library);
      if (!context) throw new HtmlLibraryError('HTML 书库文件夹不存在。', 404);
      await openLibraryDirectory(context.root);
      response.json({ opened: true });
    } catch (error) { next(error); }
  });
  app.get('/document/:id', async (request, response, next) => {
    try {
      const item = await knownDocumentForRead(request.params.id);
      // The scan cache is never an authority for filesystem access. Rechecking
      // this relative path blocks a later symlink swap from escaping the library.
      const raw = await readFullDocument(library, item.relativePath);
      response.set({
        'Content-Length': String(raw.length),
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'same-origin',
        'Content-Security-Policy': "default-src 'self' https: http: data: blob:; script-src 'unsafe-inline' https: http:; style-src 'unsafe-inline' https: http:; img-src https: http: data: blob:; font-src https: data:; connect-src https: http:; frame-src https: http:; form-action 'self' https: http:; base-uri 'none'; sandbox allow-scripts allow-forms allow-modals allow-popups allow-downloads",
      });
      // Express's response.set() and response.send() both normalize text/html
      // to UTF-8. Use the inherited Node primitive for this one header, then
      // end with the Buffer so the document's own charset stays authoritative.
      response.setHeader('Content-Type', 'text/html');
      response.end(raw);
    } catch (error) { next(error); }
  });
  app.use('/api', (_request, response) => response.status(404).json({ error: 'API 不存在。' }));
  app.use((error, _request, response, _next) => {
    if (error.type === 'entity.parse.failed') return response.status(400).json({ error: 'JSON 格式无效。' });
    if (error.type === 'entity.too.large') return response.status(413).json({ error: '请求内容过大。' });
    if (error instanceof HtmlLibraryError) return response.status(error.status).json({ error: error.message });
    if (error?.code === 'ENOENT') return response.status(404).json({ error: '文件不存在。' });
    console.error('[HtmlLibrary]', error);
    return response.status(500).json({ error: 'HTML 书库暂时无法读取，请检查服务端日志。' });
  });
  return app;
}

export async function initializeHtmlLibrary({ libraryDirectory = defaultLibraryDirectory, catalogPath = defaultCatalogPath } = {}) {
  await fs.mkdir(path.resolve(libraryDirectory), { recursive: true });
  const catalog = await readCatalog(path.resolve(catalogPath));
  await writeCatalog(path.resolve(catalogPath), catalog);
}
