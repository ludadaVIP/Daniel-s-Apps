import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const fields = ['bookmarks', 'completed', 'answers', 'theses', 'activity'];
const initialState = () => ({ bookmarks: [], completed: [], answers: {}, theses: [], activity: [] });
const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

export class ValidationError extends Error {}

export function validatePatch(patch, articleIds) {
  const fail = (message) => { throw new ValidationError(message); };
  const text = (value, label, max = 20000) => {
    if (typeof value !== 'string' || value.length > max) fail(`${label} 必须为文字，且不超过 ${max} 字符`);
  };
  const identifier = (value, label) => {
    text(value, label, 200);
    if (!value.trim() || ['__proto__', 'constructor', 'prototype'].includes(value)) fail(`${label} 无效`);
  };
  const shape = (value, required, optional, label) => {
    if (!isObject(value) || required.some((key) => !(key in value)) || Object.keys(value).some((key) => !required.includes(key) && !optional.includes(key))) fail(`${label} 字段格式无效`);
  };
  const day = (value, label) => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value) fail(`${label} 必须为有效日期`);
  };
  const timestamp = (value, label) => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value) || Number.isNaN(Date.parse(value))) fail(`${label} 必须为有效 ISO 时间`);
    day(value.slice(0, 10), label);
  };
  const thesisFields = ['title', 'judgement', 'evidence', 'counterEvidence', 'falsification', 'probability', 'deadline'];
  const thesisSnapshot = (item, label) => {
    for (const key of thesisFields.filter((field) => !['probability', 'deadline'].includes(field))) text(item[key], `${label}.${key}`, key === 'title' ? 500 : 20000);
    if (!item.title.trim()) fail(`${label} 标题不能为空`);
    if (typeof item.probability !== 'number' || !Number.isFinite(item.probability) || item.probability < 1 || item.probability > 99) fail('判断概率必须在 1–99 之间');
    day(item.deadline, `${label}.deadline`);
  };
  if (!isObject(patch) || !Object.keys(patch).length) fail('请提供非空状态对象');
  for (const key of Object.keys(patch)) if (!fields.includes(key)) fail(`不支持的状态字段: ${key}`);
  if (Buffer.byteLength(JSON.stringify(patch), 'utf8') > 1_000_000) fail('状态内容超过 1 MB 上限');
  for (const key of ['bookmarks', 'completed']) {
    if (!(key in patch)) continue;
    if (!Array.isArray(patch[key]) || patch[key].length > 10_000 || patch[key].some((id) => typeof id !== 'string' || !articleIds.has(id))) fail(`${key} 必须为有效文章 ID 数组`);
    if (new Set(patch[key]).size !== patch[key].length) fail(`${key} 不允许重复 ID`);
  }
  if ('answers' in patch) {
    if (!isObject(patch.answers) || Object.keys(patch.answers).length > 5000) fail('answers 必须为有效对象');
    for (const [id, answer] of Object.entries(patch.answers)) {
      identifier(id, '回答 ID');
      if (!id.startsWith('daily-')) fail('回答 ID 必须使用 daily-日期 格式');
      day(id.slice(6), '回答日期');
      shape(answer, ['text', 'question', 'savedAt'], [], '回答');
      text(answer.text, '回答文字');
      text(answer.question, '练习问题', 2000);
      timestamp(answer.savedAt, '回答时间');
      if (JSON.stringify(answer).length > 20_000) fail('单条回答过长');
    }
  }
  for (const key of ['theses', 'activity']) {
    if (!(key in patch)) continue;
    if (!Array.isArray(patch[key]) || patch[key].length > 5000) fail(`${key} 必须为数组，最多 5000 条`);
    const ids = new Set();
    for (const item of patch[key]) {
      if (key === 'theses') {
        shape(item, ['id', ...thesisFields, 'createdAt', 'updatedAt'], ['sourceId', 'original', 'reviews'], '判断');
        identifier(item.id, '判断 ID');
        if (ids.has(item.id)) fail('每条判断需要唯一且有效的 id');
        ids.add(item.id);
        thesisSnapshot(item, '判断');
        timestamp(item.createdAt, '创建时间');
        timestamp(item.updatedAt, '更新时间');
        if ('sourceId' in item) text(item.sourceId, '关联文章 ID', 200);
        if ('original' in item) {
          shape(item.original, thesisFields, [], '原始判断');
          thesisSnapshot(item.original, '原始判断');
        }
        if ('reviews' in item) {
          if (!Array.isArray(item.reviews) || item.reviews.length > 1000) fail('复盘必须为数组，最多 1000 条');
          const reviewIds = new Set();
          for (const review of item.reviews) {
            shape(review, ['id', 'date', 'outcome', 'reflection'], [], '复盘');
            identifier(review.id, '复盘 ID');
            if (reviewIds.has(review.id)) fail('复盘 ID 不能重复');
            reviewIds.add(review.id);
            timestamp(review.date, '复盘时间');
            if (!['pending', 'true', 'false', 'unclear'].includes(review.outcome)) fail('复盘结果无效');
            text(review.reflection, '复盘文字');
          }
        }
      } else {
        shape(item, ['id', 'type', 'date', 'day'], ['articleId'], '活动记录');
        identifier(item.id, '活动 ID');
        if (ids.has(item.id)) fail('活动 ID 不能重复');
        ids.add(item.id);
        if (!['learn', 'challenge', 'thesis', 'review'].includes(item.type)) fail('活动类型无效');
        timestamp(item.date, '活动时间');
        day(item.day, '活动日期');
        if ('articleId' in item) text(item.articleId, '活动文章 ID', 200);
      }
      if (JSON.stringify(item).length > 30_000) fail(`${key} 单条记录过长`);
    }
  }
}

export function createStateStore(filename, articleIds) {
  if (filename !== ':memory:') fs.mkdirSync(path.dirname(filename), { recursive: true });
  const database = new DatabaseSync(filename);
  try {
    database.exec('PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000; CREATE TABLE IF NOT EXISTS app_state (id INTEGER PRIMARY KEY CHECK (id = 1), value TEXT NOT NULL, updated_at TEXT NOT NULL)');
    const read = database.prepare('SELECT value FROM app_state WHERE id = 1');
    const write = database.prepare('INSERT INTO app_state (id, value, updated_at) VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at');
    if (!read.get()) write.run(JSON.stringify(initialState()), new Date().toISOString());
    const get = () => {
      const state = JSON.parse(read.get().value);
      // Removed Markdown articles should not make all personal records inaccessible.
      const validationIds = new Set([...articleIds, ...(Array.isArray(state.bookmarks) ? state.bookmarks : []), ...(Array.isArray(state.completed) ? state.completed : [])]);
      validatePatch(state, validationIds);
      for (const key of fields) if (!(key in state)) throw new Error(`数据库状态缺少 ${key}`);
      return state;
    };
    get(); // Detect corruption before serving requests; never silently overwrite user data.
    return {
      get,
      patch(patch) {
        database.exec('BEGIN IMMEDIATE');
        try {
          const current = get();
          // Keep historical records usable when a Markdown article is removed.
          // Only existing orphan IDs may be retained; new unknown IDs still fail.
          const retainedIds = new Set([...articleIds, ...current.bookmarks, ...current.completed]);
          validatePatch(patch, retainedIds);
          const state = { ...current, ...patch };
          if (Buffer.byteLength(JSON.stringify(state), 'utf8') > 1_000_000) throw new ValidationError('总状态超过 1 MB 上限，请导出归档后精简记录');
          write.run(JSON.stringify(state), new Date().toISOString());
          database.exec('COMMIT');
          return state;
        } catch (error) {
          database.exec('ROLLBACK');
          throw error;
        }
      },
      close() { database.close(); },
    };
  } catch (error) { database.close(); throw error; }
}
