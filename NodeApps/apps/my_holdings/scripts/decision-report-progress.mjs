import fs from "node:fs/promises";

const api = "http://127.0.0.1:5889/my-holdings/api";
const data = new URL("../data/", import.meta.url);
const getState = async () => {
  const response = await fetch(`${api}/state`);
  if (!response.ok) throw new Error(`State HTTP ${response.status}`);
  return response.json();
};
let state = await getState();
let manifest;
try { manifest = JSON.parse(await fs.readFile(new URL("DECISION_GOAL.json", data), "utf8")); }
catch (error) {
  if (error.code !== "ENOENT") throw error;
  manifest = { startedAt: new Date().toISOString(), capitalUsd: 400000, horizonYears: 5,
    instruction: "逐支细致完成七种投资思想决策报告；每完成一支先在当前聊天说明结论再继续；保留用户手填计划与独立行情。",
    targets: state.watchlist.filter((w) => !/etf|指数|index/i.test([w.assetType, w.type, w.category, w.name, w.symbol].filter(Boolean).join(" "))).map((w) => ({ watchId: w.id, symbol: w.symbol })) };
  await fs.writeFile(new URL("DECISION_GOAL.json", data), JSON.stringify(manifest, null, 2) + "\n");
}
let created = 0;
if (process.argv.includes("--queue")) {
  for (const target of manifest.targets) {
    const watch = state.watchlist.find((w) => w.id === target.watchId);
    if (!watch || watch.decisionReport || state.jobs.some((j) => j.kind === "decision-report" && j.watchId === watch.id && ["waiting", "running"].includes(j.status))) continue;
    const response = await fetch(`${api}/jobs`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "decision-report", watchId: watch.id }) });
    const result = await response.json();
    if (!response.ok) throw new Error(`${target.symbol}: ${JSON.stringify(result)}`);
    state = result.state;
    created++;
  }
}
const rows = manifest.targets.map((target) => {
  const watch = state.watchlist.find((w) => w.id === target.watchId);
  return { ...target, watch, job: state.jobs.findLast((j) => j.kind === "decision-report" && j.watchId === target.watchId) };
});
const done = rows.filter((r) => r.watch?.decisionReport).length;
const remaining = rows.filter((r) => !r.watch?.decisionReport);
await fs.writeFile(new URL("DECISION_PROGRESS.md", data), [
  "# 决策报告目标进度", "", `已完成 ${done}/${rows.length}；资本基准40万美元，五年视角。`, "",
  "以state.json和DECISION_GOAL.json为准；此表仅为进度索引。已有报告不代表后续刷新任务已完成。",
  "下一步：按下表顺序研究尚未完成的标的；每支先报告结论，再继续。详细JSON契约见DECISION_REPORTS.md。", "",
  ...rows.map((r) => `- [${r.watch?.decisionReport ? "x" : " "}] ${r.symbol} · ${r.watch?.decisionReport ? `已保存 ${r.watch.decisionReport.report}` : !r.watch ? "关注记录已移除，执行前复核" : `${r.job?.status || "未排队"} · ${r.job?.id || "无任务ID"}`}`), ""
].join("\n"));
console.log(JSON.stringify({ done, total: rows.length, created, next: remaining[0]?.symbol, waiting: remaining.filter((r) => r.job?.status === "waiting").length }));
