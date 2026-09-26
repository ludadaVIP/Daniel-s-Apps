import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

export function createStore(filename) {
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  const db = new DatabaseSync(filename);
  db.exec(`PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS progress (content_id TEXT PRIMARY KEY, completed_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS bookmarks (content_id TEXT PRIMARY KEY, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS notes (content_id TEXT PRIMARY KEY, body TEXT NOT NULL, updated_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS answers (lesson_id TEXT NOT NULL, question_id TEXT NOT NULL, choice INTEGER NOT NULL, correct INTEGER NOT NULL, answered_at TEXT NOT NULL, PRIMARY KEY (lesson_id, question_id));
    CREATE TABLE IF NOT EXISTS reviews (content_id TEXT PRIMARY KEY, due_at TEXT NOT NULL, interval_days INTEGER NOT NULL, repetitions INTEGER NOT NULL, last_rating TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS framework (section_id TEXT PRIMARY KEY, body TEXT NOT NULL, updated_at TEXT NOT NULL);`);
  const get = () => ({
    completed: db.prepare('SELECT content_id AS id, completed_at AS at FROM progress').all(),
    bookmarks: db.prepare('SELECT content_id AS id FROM bookmarks').all().map((row) => row.id),
    notes: db.prepare('SELECT content_id AS id, body, updated_at AS updatedAt FROM notes').all(),
    answers: db.prepare('SELECT lesson_id AS lessonId, question_id AS questionId, choice, correct, answered_at AS answeredAt FROM answers').all(),
    reviews: db.prepare('SELECT content_id AS id, due_at AS dueAt, interval_days AS intervalDays, repetitions, last_rating AS lastRating FROM reviews').all(),
    framework: db.prepare('SELECT section_id AS id, body, updated_at AS updatedAt FROM framework').all(),
  });
  const now = () => new Date().toISOString();
  const update = ({ kind, id, value }) => {
    const timestamp = now();
    if (kind === 'complete') {
      if (value) db.prepare('INSERT OR REPLACE INTO progress VALUES (?, ?)').run(id, timestamp);
      else db.prepare('DELETE FROM progress WHERE content_id = ?').run(id);
    } else if (kind === 'bookmark') {
      if (value) db.prepare('INSERT OR REPLACE INTO bookmarks VALUES (?, ?)').run(id, timestamp);
      else db.prepare('DELETE FROM bookmarks WHERE content_id = ?').run(id);
    } else if (kind === 'note') db.prepare('INSERT OR REPLACE INTO notes VALUES (?, ?, ?)').run(id, value, timestamp);
    else if (kind === 'framework') db.prepare('INSERT OR REPLACE INTO framework VALUES (?, ?, ?)').run(id, value, timestamp);
    else if (kind === 'answer') db.prepare('INSERT OR REPLACE INTO answers VALUES (?, ?, ?, ?, ?)').run(id, value.questionId, value.choice, Number(value.correct), timestamp);
    else if (kind === 'review') {
      const previous = db.prepare('SELECT interval_days AS intervalDays, repetitions FROM reviews WHERE content_id = ?').get(id);
      const repetitions = value === 'again' ? 0 : (previous?.repetitions || 0) + 1;
      const intervalDays = value === 'again' ? 0 : value === 'hard' ? Math.max(1, Math.round((previous?.intervalDays || 1) * 1.2)) : value === 'easy' ? Math.max(4, Math.round((previous?.intervalDays || 1) * 2.5)) : Math.max(1, Math.round((previous?.intervalDays || 1) * 2));
      const dueAt = new Date(Date.now() + (value === 'again' ? 10 / 1440 : intervalDays) * 86400000).toISOString();
      db.prepare('INSERT OR REPLACE INTO reviews VALUES (?, ?, ?, ?, ?)').run(id, dueAt, intervalDays, repetitions, value);
    }
    return get();
  };
  return { get, update, close: () => db.close() };
}
