import { test } from "node:test";
import assert from "node:assert/strict";
import { gzipSync } from "node:zlib";
import { readBackupText } from "./backup-file.js";

test("restore reads both old JSON and compressed backups without changing Chinese text", async () => {
  const text = JSON.stringify({ title: "持仓恢复 🧾", revision: 42 });
  assert.equal(await readBackupText(new File([text], "old.json")), text);
  // Format detection uses the gzip header, not a potentially renamed extension.
  assert.equal(await readBackupText(new File([gzipSync(text)], "backup.json.gz")), text);
  assert.equal(await readBackupText(new File([gzipSync(text)], "renamed.json")), text);
});

test("restore rejects damaged gzip, invalid UTF-8 and excessive decoded size", async () => {
  const compressed = gzipSync("文".repeat(5000));
  await assert.rejects(readBackupText(new File([compressed], "large.gz"), 1000), /解压后的数据过大/);
  await assert.rejects(readBackupText(new File([compressed.subarray(0, 12)], "broken.gz")), /完整/);
  await assert.rejects(readBackupText(new File([new Uint8Array([0xff, 0xfe])], "bad.json")), /完整/);
  await assert.rejects(readBackupText(new File(["x".repeat(1001)], "large.json"), 1000), /文件过大/);
});
