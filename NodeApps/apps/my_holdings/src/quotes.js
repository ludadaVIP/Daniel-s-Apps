export const PRICE_REFRESH_QUESTION = "更新全部持仓价格：以待办实际执行时间判断，美股常规交易时段取当时可核验的最新盘中价，其余时间取最近已完成交易日收盘价，并记录报价类型、时间与来源。";
export const hasCompleteResearch = (watch) => Boolean(watch?.research?.details?.trim() && watch?.report?.trim());
export const watchQuoteQuestion = (watch) => `仅刷新关注价格 ${watch.name} ${watch.symbol}：按实际执行时刻的 quote-policy 取盘中价或最近已完成交易日收盘价，保存报价类型、实际时间、币种与来源。保留已有研究、HTML 报告和研究日期，不生成研究。`;
export const watchResearchQuestion = (watch, refresh = false) => `${refresh ? "用户明确请求更新完整研究" : "仅在完整研究缺失时补充首次研究"}：${watch.name} ${watch.symbol}。核实证券身份、财报、业务展望、主要风险与来源，保存独立中文 HTML 并回写 research。价格由独立的 watch-quotes 待办刷新，不要用报告中的历史价格覆盖已保存的新报价。${refresh ? "" : "执行前重新检查，若已有完整研究则通过 complete 回写跳过说明，保留已有报告。"}`;
export function undoableWatchRefreshIds(state, trackedIds = []) {
  if (!state) return [];
  const waiting = state.jobs.filter((job) => ["watch", "watch-quotes"].includes(job.kind) && job.status === "waiting" && !job.quotePolicy);
  if (trackedIds.length) return [...new Set(trackedIds)].filter((id) => waiting.some((job) => job.id === id));
  const lastBatch = state.jobs.findLast((job) => job.origin === "watch-refresh" && job.batchId);
  return lastBatch ? waiting.filter((job) => job.batchId === lastBatch.batchId).map((job) => job.id) : [];
}

export function quoteTaskGuidance(apiBase = "/my-holdings") {
  return `价格更新任务（kind=quotes 为全部持仓；kind=watch-quotes 为单个关注标的）：开始实际取价时，先 POST ${apiBase}/api/jobs/{任务ID}/quote-policy（空 JSON），服务端按执行时刻返回并保存 policy（executedAt、type、date、sessionOpenAt、sessionCloseAt）与目标。不要使用点击按钮或任务创建时间判断。type=intraday 时联网核实该交易日最新常规盘中价，必须提供来源的实际 UTC 报价时间 asOf，允许来源延迟最多 20 分钟；type=close 时核实 policy.date 的正式收盘价（收市后包含当天；盘前、周末和假期回溯最近交易日），不得用盘前盘后价或复权收盘价。按 policy.market 和 policy.timeZone 处理夏令时、休市和提前收市；美股采用 America/New_York，已确认 LSE 上市的关注标的采用 Europe/London，正式日线收盘价需在收盘竞价结束后核实；取价前核对交易所日历及临时休市公告，若与 policy 不符则调用 fail。每个目标代码都要有 price、date、type、source 和 HTTPS sourceUrl；盘中报价还必须有 asOf，收盘价的 asOf 可省略。关注报价还必须提供 currency；核实代码、交易所与币种，名称未解析时先核实身份，不得猜代码或把不同币种报价混用。完成时 POST ${apiBase}/api/jobs/{任务ID}/complete，提交 {"executedAt":"原样使用 policy.executedAt","quotes":[{"symbol":"目标代码","price":123.45,"date":"使用 policy.date","type":"使用 policy.type","currency":"USD","asOf":"来源实际报价 UTC 时间；收盘价可省略","source":"来源名称","sourceUrl":"https://来源页面"}],"summary":"更新说明"}。未取得全部可核验报价就调用 fail 并保留原价格，不要用旧收盘价冒充盘中价。无需 HTML，不改平均成本或总成本；关注价格任务不得提交 research 或 report，不得重新生成或改写研究。各关注标的独立完成，单个失败不影响其他标的。重试取价须重新调用 quote-policy，并使用新返回的 executedAt。`;
}
