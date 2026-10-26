# My Holdings · Codex 待办

> 这是本地排队文件，会随 `state.json` 一起通过 GitHub 同步。应用不会启动 Codex CLI 或后台任务。
> 用户明确交代 Codex 执行待办后，再读取此文件和 `state.json`；研究任务保存 HTML，价格任务按执行时刻取盘中价或最近收盘价，换算任务回写同步配对观测。

最近同步：2026-10-26T07:16:59.298Z

## 关注价格更新 · CLPT
- 状态：等待 Codex · 任务 ID：144a9c14-7f39-48fd-b515-2d0d83053cbe
- 创建时间：2026-10-26T07:16:59.284Z
- 关注记录 ID：bcdb53f1-c038-4c1d-93f9-77489dddee7b
- 本次请求：仅刷新关注价格 CLPT CLPT：按实际执行时刻的 quote-policy 取盘中价或最近已完成交易日收盘价，保存报价类型、实际时间、币种与来源。保留已有研究、HTML 报告和研究日期，不生成研究。

- 价格更新任务（kind=quotes 为全部持仓；kind=watch-quotes 为单个关注标的）：开始实际取价时，先 POST /my-holdings/api/jobs/{任务ID}/quote-policy（空 JSON），服务端按执行时刻返回并保存 policy（executedAt、type、date、sessionOpenAt、sessionCloseAt）与目标。不要使用点击按钮或任务创建时间判断。type=intraday 时联网核实该交易日最新常规盘中价，必须提供来源的实际 UTC 报价时间 asOf，允许来源延迟最多 20 分钟；type=close 时核实 policy.date 的正式收盘价（收市后包含当天；盘前、周末和假期回溯最近交易日），不得用盘前盘后价或复权收盘价。按 policy.market 和 policy.timeZone 处理夏令时、休市和提前收市；美股采用 America/New_York，已确认 LSE 上市的关注标的采用 Europe/London，正式日线收盘价需在收盘竞价结束后核实；取价前核对交易所日历及临时休市公告，若与 policy 不符则调用 fail。每个目标代码都要有 price、date、type、source 和 HTTPS sourceUrl；盘中报价还必须有 asOf，收盘价的 asOf 可省略。关注报价还必须提供 currency；核实代码、交易所与币种，名称未解析时先核实身份，不得猜代码或把不同币种报价混用。完成时 POST /my-holdings/api/jobs/{任务ID}/complete，提交 {"executedAt":"原样使用 policy.executedAt","quotes":[{"symbol":"目标代码","price":123.45,"date":"使用 policy.date","type":"使用 policy.type","currency":"USD","asOf":"来源实际报价 UTC 时间；收盘价可省略","source":"来源名称","sourceUrl":"https://来源页面"}],"summary":"更新说明"}。未取得全部可核验报价就调用 fail 并保留原价格，不要用旧收盘价冒充盘中价。无需 HTML，不改平均成本或总成本；关注价格任务不得提交 research 或 report，不得重新生成或改写研究。各关注标的独立完成，单个失败不影响其他标的。重试取价须重新调用 quote-policy，并使用新返回的 executedAt。

## 标的研究 · CLPT
- 状态：等待 Codex · 任务 ID：b7fd022c-5b5e-41e7-8542-ef57306db06d
- 创建时间：2026-10-26T07:16:59.284Z
- 关注记录 ID：bcdb53f1-c038-4c1d-93f9-77489dddee7b
- 本次请求：仅在完整研究缺失时补充首次研究：CLPT CLPT。核实证券身份、财报、业务展望、主要风险与来源，保存独立中文 HTML 并回写 research。价格由独立的 watch-quotes 待办刷新，不要用报告中的历史价格覆盖已保存的新报价。执行前重新检查，若已有完整研究则通过 complete 回写跳过说明，保留已有报告。

- 仅在完整研究缺失时补充首次研究：CLPT CLPT。核实证券身份、财报、业务展望、主要风险与来源，保存独立中文 HTML 并回写 research。价格由独立的 watch-quotes 待办刷新，不要用报告中的历史价格覆盖已保存的新报价。执行前重新检查，若已有完整研究则通过 complete 回写跳过说明，保留已有报告。
