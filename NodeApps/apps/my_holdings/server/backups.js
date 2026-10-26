import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { promisify } from "node:util";
import { gzip, gunzip } from "node:zlib";

const compress = promisify(gzip);
const decompress = promisify(gunzip);
const PREFIX = "my-holdings-state-backup-";
const NAME = /^my-holdings-state-backup-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}Z)-rev-(\d+)(-before-restore)?\.json(\.gz)?$/;
const MAX_BYTES = 8 * 1024 * 1024;
export const BACKUP_INTERVAL_MS = 5 * 60_000;
export const BACKUP_RETENTION = { recent: 6, daily: 7, weekly: 4 };

// Flush the complete temporary file before atomically replacing its destination.
export async function atomicWriteFile(filename, data) {
  const temporary = `${filename}.${randomUUID()}.tmp`;
  try {
    const handle = await fs.open(temporary, "wx");
    try {
      await handle.writeFile(data);
      await handle.sync();
    } finally {
      await handle.close();
    }
    await fs.rename(temporary, filename);
  } finally {
    await fs.rm(temporary, { force: true });
  }
}

function content(state, ignoreRanking = false) {
  const { revision, updatedAt, ...data } = state;
  if (ignoreRanking) delete data.watchRankHistory;
  return data;
}

export const sameStateContent = (a, b) => isDeepStrictEqual(content(a), content(b));

function criticalChange(previous, next) {
  if (["accounts", "holdings", "cash", "goals", "holdingTrades"].some(
    (key) => !isDeepStrictEqual(previous[key], next[key]),
  )) return true;
  // Deleting a watch or journal record deserves its own recovery point.
  return ["watchlist", "journal"].some((key) => {
    const ids = new Set((next[key] || []).map((item) => item.id));
    return (previous[key] || []).some((item) => !ids.has(item.id));
  });
}

function weekKey(timestamp) {
  const day = new Date(timestamp);
  day.setUTCHours(0, 0, 0, 0);
  day.setUTCDate(day.getUTCDate() - (day.getUTCDay() + 6) % 7);
  return day.toISOString().slice(0, 10);
}

// Keep nearby undo points plus the first available point of recent UTC days/weeks.
// All are independent snapshots: restoring never depends on a chain of patches.
export function retainedBackupNames(entries) {
  const ordered = [...entries].sort((a, b) => a.time - b.time || a.revision - b.revision || a.name.localeCompare(b.name));
  const keep = new Set(ordered.slice(-BACKUP_RETENTION.recent).map((entry) => entry.name));
  for (const [bucket, count] of [
    [(entry) => new Date(entry.time).toISOString().slice(0, 10), BACKUP_RETENTION.daily],
    [(entry) => weekKey(entry.time), BACKUP_RETENTION.weekly],
  ]) {
    const groups = new Map();
    for (const entry of ordered) if (!groups.has(bucket(entry))) groups.set(bucket(entry), entry);
    for (const entry of [...groups.values()].slice(-count)) keep.add(entry.name);
  }
  return keep;
}

export function createBackupStore(directory, { now = () => new Date(), warn = console.warn } = {}) {
  let lastBackupAt = null;

  async function inspect(name) {
    const match = NAME.exec(name);
    if (!match) return null;
    const stored = await fs.readFile(path.join(directory, name));
    const bytes = match[4] ? await decompress(stored, { maxOutputLength: MAX_BYTES }) : stored;
    if (bytes.length > MAX_BYTES) throw new Error("备份超过支持的大小");
    const state = JSON.parse(bytes.toString("utf8"));
    if (state.version !== 1 || state.revision !== Number(match[2])) throw new Error("备份版本与文件名不符");
    const iso = match[1].replace(/T(\d{2})-(\d{2})-(\d{2})Z$/, "T$1:$2:$3Z");
    const time = Date.parse(iso);
    if (!Number.isFinite(time)) throw new Error("备份时间无效");
    return { name, time, revision: state.revision, bytes };
  }

  async function verifiedEntries() {
    const entries = [];
    for (const name of await fs.readdir(directory)) {
      if (!NAME.test(name)) continue;
      try {
        const entry = await inspect(name);
        entries.push({ name: entry.name, time: entry.time, revision: entry.revision });
      } catch (e) {
        // Never delete an unreadable or unknown file during automatic maintenance.
        warn(`My Holdings: 保留未能校验的备份 ${name}: ${e.message}`);
      }
    }
    return entries;
  }

  async function snapshot(raw, state, beforeRestore = false) {
    const time = state.updatedAt || now().toISOString();
    const stamp = new Date(time).toISOString().replace(/\.\d{3}Z$/, "Z").replaceAll(":", "-");
    const name = `${PREFIX}${stamp}-rev-${String(state.revision || 0).padStart(4, "0")}${beforeRestore ? "-before-restore" : ""}.json.gz`;
    const bytes = Buffer.from(raw);
    try {
      const existing = await inspect(name);
      if (!existing.bytes.equals(bytes)) throw new Error(`备份文件名冲突：${name}`);
      return name;
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }
    const packed = await compress(bytes);
    await atomicWriteFile(path.join(directory, name), packed);
    const verified = await inspect(name);
    if (!verified.bytes.equals(bytes)) throw new Error("压缩备份校验失败，原数据保留");
    return name;
  }

  async function prune() {
    const entries = (await verifiedEntries()).filter((entry) => entry.name.endsWith(".json.gz"));
    const keep = retainedBackupNames(entries);
    for (const entry of entries) if (!keep.has(entry.name)) await fs.unlink(path.join(directory, entry.name));
  }

  return {
    async initialize(raw) {
      await fs.mkdir(directory, { recursive: true });
      const names = await fs.readdir(directory);
      const legacy = names.filter((name) => NAME.test(name) && name.endsWith(".json"));
      if (legacy.length) {
        // Preserve today's live state too before compacting the old recovery history.
        await snapshot(raw, JSON.parse(raw));
        for (const name of legacy) {
          try {
            const entry = await inspect(name);
            const state = JSON.parse(entry.bytes.toString("utf8"));
            await snapshot(entry.bytes, state, name.includes("-before-restore"));
            // Check disk bytes, not just the in-memory compression result, before removal.
            await fs.unlink(path.join(directory, name));
          } catch (e) {
            warn(`My Holdings: 旧备份未转换，已保留 ${name}: ${e.message}`);
          }
        }
      }
      await prune();
      const entries = await verifiedEntries();
      if (entries.length) lastBackupAt = Math.max(...entries.map((entry) => entry.time));
    },
    async beforeWrite(raw, previous, next, { force = false } = {}) {
      if (!force && isDeepStrictEqual(content(previous, true), content(next, true))) return false;
      const timestamp = now().getTime();
      if (!force && !criticalChange(previous, next) && lastBackupAt !== null &&
          timestamp >= lastBackupAt && timestamp - lastBackupAt < BACKUP_INTERVAL_MS) return false;
      await snapshot(raw, previous, force);
      lastBackupAt = timestamp;
      return true;
    },
    prune,
  };
}
