import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { gzipSync, gunzipSync } from "node:zlib";
import { createBackupStore, retainedBackupNames, sameStateContent, atomicWriteFile } from "./backups.js";

const state = (revision = 1, updatedAt = "2026-10-26T01:00:00.000Z") => ({
  version: 1, revision, updatedAt, accounts: [{ id: "a" }], holdings: [{ id: "h", quantity: 2 }],
  cash: [], goals: {}, holdingTrades: [], watchlist: [{ id: "w", targetPrice: 10 }],
  journal: [{ id: "j", body: "计划" }], jobs: [], analyses: [], watchRankHistory: [],
});
const raw = (s) => JSON.stringify(s, null, 2) + "\n";
const name = (s) => `my-holdings-state-backup-${s.updatedAt.replace(/\.\d{3}Z$/, "Z").replaceAll(":", "-")}-rev-${String(s.revision).padStart(4, "0")}.json`;
async function directory(t) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "holdings-backups-"));
  t.after(async () => {
    assert.equal(path.dirname(path.resolve(dir)), path.resolve(os.tmpdir()));
    await fs.rm(dir, { recursive: true, force: true });
  });
  return dir;
}

test("legacy snapshots are compressed losslessly before retention, live state stays intact", async (t) => {
  const dir = await directory(t);
  const expected = new Map();
  for (let revision = 1; revision <= 30; revision++) {
    const s = state(revision, `2026-10-26T01:${String(revision).padStart(2, "0")}:00.000Z`);
    expected.set(name(s) + ".gz", raw(s));
    await fs.writeFile(path.join(dir, name(s)), raw(s));
  }
  const current = state(31, "2026-10-26T01:31:00.000Z");
  expected.set(name(current) + ".gz", raw(current));
  await fs.writeFile(path.join(dir, "keep-me.txt"), "unrelated");
  const store = createBackupStore(dir);
  await store.initialize(raw(current));
  const files = await fs.readdir(dir);
  const backups = files.filter((file) => file.endsWith(".gz"));
  assert.equal(backups.length, 7); // latest six + start of this day/week
  assert(backups.includes(name(state(1, "2026-10-26T01:01:00.000Z")) + ".gz"));
  assert(backups.includes(name(current) + ".gz"));
  assert(!files.some((file) => file.endsWith(".json")));
  for (const file of backups) assert.equal(gunzipSync(await fs.readFile(path.join(dir, file))).toString(), expected.get(file));
  assert.equal(await fs.readFile(path.join(dir, "keep-me.txt"), "utf8"), "unrelated");
  await store.initialize(raw(current));
  assert.deepEqual((await fs.readdir(dir)).sort(), files.sort());
});

test("corrupt and unknown backups are preserved, including legacy files with conflicting compressed copies", async (t) => {
  const dir = await directory(t);
  const old = state();
  await fs.writeFile(path.join(dir, name(old)), raw(old));
  await fs.writeFile(path.join(dir, name(old) + ".gz"), "corrupt gzip");
  const unknown = "other-backup.json";
  await fs.writeFile(path.join(dir, unknown), "keep");
  const warnings = [];
  const store = createBackupStore(dir, { warn: (warning) => warnings.push(warning) });
  await store.initialize(raw(state(2)));
  assert.equal(await fs.readFile(path.join(dir, name(old)), "utf8"), raw(old));
  assert.equal(await fs.readFile(path.join(dir, name(old) + ".gz"), "utf8"), "corrupt gzip");
  assert.equal(await fs.readFile(path.join(dir, unknown), "utf8"), "keep");
  assert(warnings.length >= 1);
});

test("ordinary updates coalesce, rankings create no snapshots, critical changes and restore do", async (t) => {
  const dir = await directory(t);
  let clock = new Date("2026-10-26T01:00:01Z");
  const store = createBackupStore(dir, { now: () => clock });
  let previous = state();
  await store.initialize(raw(previous));
  let next = structuredClone(previous);
  next.watchRankHistory = [{ date: "2026-10-26", watchIds: ["w"] }];
  assert.equal(await store.beforeWrite(raw(previous), previous, next), false);
  next.watchlist[0].targetPrice = 11;
  assert.equal(await store.beforeWrite(raw(previous), previous, next), true);
  previous = { ...next, revision: 2, updatedAt: clock.toISOString() };
  next = structuredClone(previous);
  next.watchlist[0].targetPrice = 12;
  assert.equal(await store.beforeWrite(raw(previous), previous, next), false);
  clock = new Date("2026-10-26T01:05:01Z");
  assert.equal(await store.beforeWrite(raw(previous), previous, next), true);
  previous = { ...next, revision: 3, updatedAt: clock.toISOString() };
  for (const edit of [
    (s) => s.holdings[0].quantity++,
    (s) => s.cash.push({ id: "c", amount: 5 }),
    (s) => { s.watchlist = []; },
    (s) => { s.journal = []; },
  ]) {
    next = structuredClone(previous);
    edit(next);
    assert.equal(await store.beforeWrite(raw(previous), previous, next), true);
    previous = { ...next, revision: previous.revision + 1, updatedAt: clock.toISOString() };
  }
  assert.equal(await store.beforeWrite(raw(previous), previous, previous, { force: true }), true);
  assert((await fs.readdir(dir)).some((file) => file.includes("before-restore")));
});

test("time tiers retain recovery across months instead of only a burst of revisions", () => {
  const entries = [];
  for (let i = 0; i < 90; i++) {
    const day = Date.UTC(2026, 7, 1 + i);
    for (let j = 0; j < 8; j++) entries.push({ name: `${i}-${j}`, time: day + j * 60_000, revision: i * 8 + j });
  }
  const keep = retainedBackupNames(entries);
  assert(keep.size <= 17);
  for (const entry of entries.slice(-6)) assert(keep.has(entry.name));
  assert(keep.has("89-0"));
  assert(keep.has("83-0"));
  assert([...keep].some((file) => Number(file.split("-")[0]) < 80));
  assert.deepEqual(retainedBackupNames([...entries].reverse()), keep);
});

test("no-op comparison ignores metadata only, atomic replace leaves no temporary files", async (t) => {
  const dir = await directory(t);
  const s = state();
  assert(sameStateContent(s, { ...s, revision: 100, updatedAt: "later" }));
  assert(!sameStateContent(s, { ...s, watchRankHistory: [{ date: "2026-10-26", watchIds: [] }] }));
  const file = path.join(dir, "state.json");
  await atomicWriteFile(file, raw(s));
  await atomicWriteFile(file, raw(state(2)));
  assert.equal(JSON.parse(await fs.readFile(file)).revision, 2);
  assert.deepEqual(await fs.readdir(dir), ["state.json"]);
});
