# My Holdings 决策报告执行约定

任务 `kind=decision-report` 与普通公司研究、报价任务独立。用户本次目标是依次完成决策日志中的全部个股；每支完成后先在当前聊天说明结论，再继续下一支。刷新按钮只入队，后续 Codex 实际执行时才联网研究。以 `state.json` 为实时队列来源，勿直接覆盖它。

1. `GET /my-holdings/api/state` 读取最新关注、持仓、ETF与委托敞口；只处理目标个股的等待任务。保留用户手填计划。
2. 按 investment-analysis / web-access 技能核实最新官方资料。每个数字写清日期、单位、会计口径和来源；没有新财报则说明最近报告期。价格按实际执行时段核验，无法核验实时成交时明确最近正式收盘参照，不将旧快照称实时。SEC companyfacts 的 `fy` 是申报文件财年，不能替代指标的 `start/end`；历史序列须核对原始财务表，分清合并净利与归母净利、停业/出售业务及旧标签。未单列成本不等于零成本，不能据此编造100%毛利率。
3. 用代码复算情景估值、稀释与回报。两种独立估值交叉核验；今天折现价值与五年期末价格分开。三档价格由模型和风险推出，严格不重叠，低于第三档下沿应重新核查，不能机械补仓。无数据用null，不填伪价格。
4. 七种理论各有判断、证据、质疑与回应，再做真正的交叉辩论与裁决；不伪造大师本人观点。资本基准USD400000，五年，现货无杠杆。仓位是条件示例，扣已有公司敞口；同时解释ETF、主题及未成交买单重叠，不能把所有目标上限同时买满。
5. `POST /my-holdings/api/jobs/{id}/complete` 提交 `{"decision":报告对象}`。服务端验证后自动写入 `data/reports/decisions/` 的独立JSON与自包含HTML，更新右栏引用与档案，历史版本保留。JSON与HTML由同一份数据生成。不要提交普通research代替decision；不修改独立行情、研究或用户手工限价/仓位。
6. 失败时 `POST /my-holdings/api/jobs/{id}/fail`，内容 `{"reason":"具体限制"}`；保留旧报告，不把失败当成研究完成。

结构契约（所有文本为中文，字段名固定；范围/收益必须可复算）：

```json
{
  "version": 1,
  "symbol": "RKLB",
  "name": "公司名称",
  "exchange": "NASDAQ",
  "currency": "USD",
  "capitalUsd": 400000,
  "horizonYears": 5,
  "analysisDate": "YYYY-MM-DD",
  "dataAsOf": "核验的实际UTC/当地时间，及财报、事件、市场资料截至时点",
  "financialPeriod": "最近已发布报告期",
  "quote": {"price": 100, "date": "YYYY-MM-DD", "type": "正式收盘/盘中/盘后/夜盘/延迟", "note": "真实时段、时间戳、限制，报告报价独立于持仓报价", "source": "名称", "sourceUrl": "https://具体报价页"},
  "verdict": {"stance": "观察/条件试探/暂不投资等", "conclusion": "质量、价格、最大风险与当前行动的明确裁决", "confidence": "置信度及理由", "valueLow": 60, "valueHigh": 80, "limitations": "关键缺口；未获风险偏好、流动性和税务信息时明确组合适配仍不完整"},
  "position": {"targetPct": 1, "maxPct": 2, "existingExposureUsd": 0, "rationale": "组合风险预算、压力亏损与仓位依据", "portfolioFit": "已有直接持股、ETF和主题重叠、待成交买单、40万总预算约束"},
  "entries": [
    {"tier": "observation", "low": 71, "high": 80, "budgetSharePct": 25, "condition": "观察试仓的经营前提、估值依据；并非安全价"},
    {"tier": "safety", "low": 61, "high": 70, "budgetSharePct": 35, "condition": "安全边际相对哪个价值及回报门槛、经营前提"},
    {"tier": "discount", "low": 50, "high": 60, "budgetSharePct": 40, "condition": "折价依据、暂停条件、低于下沿须重审"}
  ],
  "scenarios": [
    {"id": "bear", "label": "悲观", "assumptions": "经营、现金流、股数、融资与终值路径", "todayValue": 30, "year5Price": 40},
    {"id": "base", "label": "基准", "assumptions": "经营路径", "todayValue": 70, "year5Price": 120},
    {"id": "bull", "label": "乐观", "assumptions": "经营路径", "todayValue": 110, "year5Price": 200}
  ],
  "masters": [
    {"id": "graham", "name": "格雷厄姆 · 安全边际", "judgment": "判断", "evidence": "带日期与来源ID的证据", "challenge": "最强反方质疑", "response": "正面回应与行动含义"}
  ],
  "debate": [{"question": "有实质分歧的问题", "bull": "支持及证据", "bear": "反驳及证据", "resolution": "为何采纳一方、条件和不确定性"}],
  "sections": [{"title": "业务/财务/治理/估值/敏感性/反推/组合等独立章节", "body": "完整分析，纯文本可换行；关键计算、方法、假设、公式及来源ID都需呈现，不依赖隐藏模型"}],
  "invalidation": ["基本面或估值失效条件及行动"],
  "reviewTriggers": ["未来两季至一年需核验的具体指标、阈值、事件与日期"],
  "sources": [{"label": "[S1] 来源与用途", "url": "https://具体一手文件", "date": "发布日期、报告期、访问日期"}]
}
```

上例数字仅为契约示例，不能用于任何真实投资。`masters` 必须完整包含且仅包含七个不同ID：`graham/buffett/munger/lynch/dalio/soros/marks`。三档 `budgetSharePct` 合计100，是扣已有公司敞口后的剩余目标资金分配，目标仓位0%时所有新增金额为0。`valueLow/valueHigh` 或某档 `low/high` 可同时为null。HTML同时提供情景总回报和五年年化；若分红重要须在正文额外计算含分红IRR。模型原始数据可放JSON额外字段及独立模型文件，正文仍需完整可读。

首屏用 `verdict.summary` 可选字段提供约100字的简明结论，完整 `conclusion` 仍保留。`position.currentAdditionalPct` 可明确当前新增比例（例如0），`targetPct` 是条件成立后的目标；`existingExposureUsd` 为直接与已核验ETF间接敞口合计，正文说明拆分与时点。

无法可靠估值时，`scenarios` 的 `todayValue/year5Price` 可为null；报价完全未核验时 `quote.price=null`、`date=""`、`sourceUrl=null`，并在note说明原因。不使用0代替未知；0只用于明确建模的全损情景。此时可判为暂不行动，目标新增0%，不得为了填满表格编造买价或回报。

独立HTML自动生成三种估值/资金图；完整研究还应提供真实数据图 `figures`（最多8个），每项含 `title/unit/note/rows`，rows为`[{"label":"2025收入","value":123.45}]`，数值须非负且有正文数据来源。负现金流用正文表格或另外编制正确含零轴的图，不塞进只支持非负柱形的figures。四张以上有判断价值的图为通常目标；资料不足时明确缺口，不凑图。

可运行只读组合助手 `node apps/my_holdings/scripts/decision-portfolio-context.mjs 代码` 核对穿透与本地买单。`position.pendingBuyUsd` 填已记录待成交限价买单金额，三档会先扣除这部分；市场单金额无法固定时说明缺口。最终JSON可用 `node apps/my_holdings/scripts/save-decision-report.mjs 路径` 提交当前股票的等待任务；该脚本不研究、不自动排队。完成后运行 `node apps/my_holdings/scripts/decision-report-progress.mjs` 更新进度索引。
