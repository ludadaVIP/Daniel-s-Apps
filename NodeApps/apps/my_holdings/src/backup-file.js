export const MAX_BACKUP_BYTES = 7_000_000;

// Stream both formats with a limit on decoded bytes; a compressed file needs no
// manual extraction and cannot bypass the restore size limit by expanding later.
export async function readBackupText(file, maxBytes = MAX_BACKUP_BYTES) {
  if (file.size > maxBytes) throw new Error("备份文件过大");
  const signature = new Uint8Array(await file.slice(0, 2).arrayBuffer());
  const compressed = signature[0] === 0x1f && signature[1] === 0x8b;
  if (compressed && typeof DecompressionStream === "undefined")
    throw new Error("当前浏览器不支持 gzip，请先解压为 JSON 再选择");
  const stream = compressed ? file.stream().pipeThrough(new DecompressionStream("gzip")) : file.stream();
  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  const parts = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) throw new Error("备份解压后的数据过大");
      parts.push(decoder.decode(value, { stream: true }));
    }
    parts.push(decoder.decode());
    return parts.join("");
  } catch (e) {
    await reader.cancel().catch(() => {});
    if (/过大/.test(e.message)) throw e;
    throw new Error("无法读取备份，请检查 JSON / gzip 文件是否完整");
  } finally {
    reader.releaseLock();
  }
}
