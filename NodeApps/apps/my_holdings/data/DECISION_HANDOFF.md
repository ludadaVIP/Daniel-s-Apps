# My Holdings 决策报告系列交接

交接日期：2026-11-05。本机按用户要求完成 CRDO 后交接，不在本机启动 HOOD。

## 当前进度与权威文件

原目标共 **66 支股票，已完成 10 支，剩余 56 支**。下一支 **HOOD（Robinhood）**，此后按 `DECISION_GOAL.json` 原顺序推进。整个系列尚未完成；目标服务最后观察到 `usageLimited`，不能把本次交接当成全目标完成。新聊天用文末 `/goal` 提示词恢复长任务。

- `DECISION_GOAL.json`：原始 66 支清单、顺序、40 万美元资本和五年期限。
- `state.json`：实时用户数据、任务状态和当前报告引用，是实际执行的权威来源。
- `DECISION_HANDOFF_STATE.json`：迁移检查点，记录哈希、已完成报告及全部待办 ID。
- `DECISION_PROGRESS.md`：可读进度索引；不是覆盖实时状态的依据。
- `DECISION_REPORTS.md`：报告 JSON 契约和保存规则，开始下一支前必须阅读。
- `CONTINUE_PROMPT.txt`：可直接复制到下一台电脑的完整提示词。

交接时 `state.json` revision **3406**，SHA256：

`b3a6763ac1690ae61f2bf459f035ce902d0ea9a4f9404bf8015b5dff4cc7c81d`

HOOD watchId：`5d0a5d34-3866-417c-a996-c1b5991daebb`；已有等待任务 ID：`2d05108c-6bc0-42b2-b9b2-b785b6647fbc`。读取新机器实际状态后再使用，不重新批量创建 66 个任务。

已完成顺序：**RKLB、OUST、TMDX、LUNR、PLTR、AEHR、ENVX、INOD、ASTS、CRDO**。各支当前 JSON/HTML 路径见 `DECISION_HANDOFF_STATE.json` 的 `completed` 数组和进度文件；历史报告及研究原始资料均保留在 `data/reports/`。

## CRDO 完成结果

独立报告：`reports/decisions/crdo-2026-11-05-229ea45c-b26e-40eb-a23b-e78fd7c688f0.html`，同名 `.json` 是结构化版本。任务 `229ea45c-b26e-40eb-a23b-e78fd7c688f0` 已 done，保存时间 `2026-11-05T03:50:40.512Z`。

**当前新增 0%。** 高速互连需求已经兑现为利润与现金，但客户集中、收购、股份报酬、产能押金、税负和光铜竞争使每股价值分歧很大。基准十年 DCF 今日价值 **$89.48**，独立盈利资本化折回今日 **$144.79**；2031 年两法分别 **$147.62 / $249.53**。报告夜盘参照 $133.00 时，五年年化约 **2.1% / 13.4%**，较高方法不作为保证收益。

| 入场档位 | 条件价格区间 | 剩余目标资金占比 | 参考资金 | 按区间上沿股数 |
| --- | --- | --- | --- | --- |
| 小仓观察 | $58.17–67.10 | 25% | $1,490.10 | 22 |
| 安全边际 | $49.22–58.16 | 35% | $2,086.14 | 35 |
| 折价 | $31.32–49.21 | 40% | $2,384.16 | 48 |

资本基准 $400,000，条件目标 **1.5% = $6,000**，上限 **2.5% = $10,000**。没有直接 CRDO 或本地待成交买单；已核 SOXX 穿透约 **$39.5952**，故剩余目标资金 **$5,960.4048**。这是条件成立后的单只目标分档，当前行动仍为不新增。低于第三档下沿应重审基本面。未替用户下单，也未覆盖原手填目标价 $120。

报价：Yahoo 夜盘 **$133.00，2026-11-04 22:39:29 EST / 2026-11-05 03:39:29 UTC**，抓取 `03:42:39.258Z`。正式收盘 **$136.50，11 月 4 日 16:00:01 EST**。Moomoo 较早 20:02 ET 的 $133.94 是另一时点；报告已分开说明。上述均为交接历史快照，新研究须按实际执行时间重新核验。

最新官方财报为 FY2027 Q1（截至 2026-08-01，9 月 2 日申报），不是尚未公布实际值的 Q2。FY2026 收入 $1,335.116m、EBIT $445.005m；Q1 收入 $479.003m、EBIT $120.700m；TTM 收入 $1,591.045m。现金与短投 $764.258m 是 8 月 1 日账面数。直接买方 A/B 和最终用户 C/D/E/F 是不同层次，不能相加或猜测客户名称。

报告完整处理了 DustPhotonics / Hyperlume / CoMira 收购、RSU/PSU/期权/可交换股、现金与股权 earnout、已经用完的 ATM、供应和押金义务、现金流桥、未来股份报酬经济成本、税率、营运资本、终值与现金留存。未来五年价和今日价值分开；不把收购已付现金再扣一遍，不把授予总数与其子集重复相加。

校验与证据（均在 `reports/decisions/`）：

- `crdo-evidence-model-2026-11-05.json`：冻结模型，SHA256 `baac433d32bbe6f8066d588bac161e9774b2ade6f148321f8a75eaf79a0eaaaf`。
- `crdo-build-model-2026-11-05.py`：建模脚本；`crdo-parent-audit-2026-11-05.mjs`：独立 JavaScript 重建估值，**1,398 项校验通过**，审计不导入或执行 Python 作者模型。证据为 `crdo-audit-evidence-2026-11-05.json` 和原始财务锚点文件。
- `build-crdo-decision-2026-11-05.mjs`、`crdo-analysis-input-2026-11-05.json`：报告生成及最终提交输入。
- `crdo-save-audit-2026-11-05.json`：证明保存前后用户持仓、订单、现金、日志、手填计划、普通研究和行情等保持不变，仅完成本报告及相关引用/任务。
- `crdo-ui-audit-2026-11-05.json`：右栏选择、刷新可用、独立 HTML、7 位思想、4 轮辩论、7 张图、26 个来源和 390px 手机布局均通过，页面无运行错误。

保存时 HTTP 响应曾 ECONNRESET，但磁盘已成功写入。已读取权威状态确认 job done、报告存在和指针正确，**没有重复提交**。以后遇到此类错误，先查 `/state` 及磁盘，再决定是否重试。不要把响应断开等同于写入失败。

## 界面和功能已实现

本地入口：`http://127.0.0.1:5888/#/app/my-holdings`，API：`http://127.0.0.1:5889/my-holdings/api`。

用户目前将股票卡片页命名为 **“价格卡片”**；**“决策日志”现在是交易/复盘日志**。不要依据旧聊天把菜单改回去。在价格卡片点击股票名或卡片非交互区，右栏显示该股报告；结论、三档入场价格和仓位在上方，详细辩论/分析在下方。刷新按钮只创建或复用等待任务，实际新研究由后续 Codex 执行；旧报告保持可读。

主要代码位于 `apps/my_holdings/` 下：`src/decision-reports.js`（契约与金额）、`src/DecisionReport.jsx`（报告右栏）、`src/App.jsx`、`src/styles.css`、`server/index.js`，以及 `scripts/save-decision-report.mjs`、`decision-report-progress.mjs`、`decision-portfolio-context.mjs`。NodeApps 根目录的 `server/`、`src/`、`shared/` 和 Vite/包配置负责集成。

API（以下路径都加 API 前缀）：

- `GET /state`：每支开始和提交前读最新数据。
- `GET /decision-reports/:watchId`：读取该股当前报告。
- `POST /jobs`，`{kind:"decision-report",watchId}`：刷新入队，并对等待任务去重。
- `POST /jobs/:id/complete`，`{decision:完整报告对象}`：服务端验证并保存版本化 JSON/HTML、当前指针和档案。
- `POST /jobs/:id/fail`，`{reason:"具体限制"}`：不能完成时记录原因，保留旧报告。

## 将资料迁移到下一台电脑

迁移包：`NodeApps/artifacts/decision-handoff-2026-11-05/my-holdings-decision-handoff-2026-11-05.zip`，同目录提供 `.zip.sha256` 和打包校验结果。ZIP 内 `HANDOFF_FILE_MANIFEST.json` 为逐文件 SHA256 与大小清单。

**只做 git pull 不足以迁移。** 当前 CRDO 报告、部分数据和交接文件尚未提交；本次没有 commit/push。部分 `data/` 文件本身受 Git 跟踪，也有新建未跟踪文件。不要用旧 Git 状态覆盖最新用户状态。

1. 将 ZIP 和 `.sha256` 一起复制到新电脑，先校验 ZIP 哈希。取得完整的 `Daniel's Apps` 仓库；本机打包时 Git 基线为 `43c0856ac3e726551816aeb30a08967266f9f460`。迁移包是当前 My Holdings 及根集成代码的覆盖包，**不是全部其他 Apps 的独立发行版**，所以先要完整仓库。
2. 解压到临时目录，将其中 `NodeApps/` 的内容合并至目标仓库的 **NodeApps 根目录**，保留其余 App；不要多套成 `NodeApps/NodeApps/`。若目标电脑已有更新的用户数据，先比较 revision/时间并保留较新版本，不能盲目覆盖。
3. 包含整个 `apps/my_holdings/`：状态、待办、目标清单、所有研究/决策报告、模型、原始证据、备份、ETF 穿透和所需源码。还包含根集成文件、研究技能资源和 CRDO 界面截图。保留备份；无需复制旧浏览器登录、Codex 认证或 node_modules。
4. 在目标 NodeApps 工作目录运行下面的只读验证。预期 revision 3406，10/66，waiting 56，next HOOD，checkpointMatches true。若新电脑后续已发生合法更新，严格哈希会不同；核对较新数据后可运行不带 `--strict-checkpoint` 的结构检查。

```powershell
node apps/my_holdings/scripts/verify-decision-handoff.mjs --strict-checkpoint
```

5. 使用 **Node.js >=24.15.0**，在 NodeApps 目录安装并启动；若已经有正确运行的服务，直接核验它，不必重复占用端口。

```powershell
npm ci
npm run dev
```

6. 打开本地入口，点价格卡片 CRDO 核对新报告；确认 56 个等待报告任务存在，再开始 HOOD。`verify-decision-handoff.mjs` 仅校验文件，不联网、不修改用户数据、不创建任务。
7. ZIP 的 `skills/` 附带 `investment-analysis` 和 `web-access` 文档/脚本。如果新电脑缺少这些技能，将相应目录放进用户自己的 `~/.codex/skills/`；如已有更新版本，先阅读比较再决定。浏览器偏好 `config.env`、登录态和浏览器配置未打包，按新机器环境重新连接浏览器。不依赖旧机器 CDP 端口、进程、路径或子代理。原证据代理不可再用，主代理已完成 CRDO。

所有路径均相对目标 NodeApps 根目录；换盘符、用户名或操作系统时不要沿用本机绝对路径。ZIP 解压后先读本文件，完整提示词也在 `CONTINUE_PROMPT.txt`。

## 后续每支股票的执行要求

先读投资研究技能、联网技能和契约，用最新官方财报/监管文件、公司公告与真实报价核验。明确报告期、申报时间、币种、单位、交易时段和时区；不是新财报的资料不得冒充新财报。SEC companyfacts 的 `fy` 不能替代指标实际 `start/end`；历史财务须对原表，区分合并/归母/停业业务。未知用 null，不用 0 伪装资料完整。

七种思想须分别有判断、证据、最强质疑与回应，再交叉辩论并裁决。这是按公开理论模拟分析，不是假造大师本人当下观点。业务、护城河、治理、竞争、风险、催化、价格与价值均需具体。至少两种独立估值，悲观/基准/乐观、今日价值与五年期末价、回报、反推预期和敏感性均可复算；不把终值主导的模型伪装确定性。

三档“小仓观察 / 安全边际 / 折价”严格不重叠，从模型、安全边际和回报要求推导。首屏展示结论、三档和仓位；详细分析在下方。40 万美元是组合总预算，三档资金仅在单只条件目标内分配；扣已有直接持仓、可核 ETF 间接持仓与待成交买单，并讨论主题拥挤，不能将 66 支目标上限同时买满。当前新增可明确为 0。

执行 `node apps/my_holdings/scripts/decision-portfolio-context.mjs HOOD` 读取最新敞口（只读）。研究过程中用户仍可能改持仓：CRDO 最终提交前就重新核过 SOXX，从旧快照约 $19.80 变为 $39.60，不能沿用几小时前快照。

保持资金、融资、股数与估值自洽。例如 ASTS 的压力情景须联动现金缺口、融资与稀释；ENVX 的条款性/条件性买价不能当无条件便宜。新增股权激励若已用未来现金替代，不重复扣同一成本；历史已发/已承诺股份、未来授予、现金补偿和期权资本需明确分层。收购股权/现金支付与其后资产负债表的计入时点必须核对。

将研究输入放 `data/reports/decisions/` 下；完整 JSON 经 `node apps/my_holdings/scripts/save-decision-report.mjs 输入文件` 提交已有等待任务。该脚本只提交，不研究、不自动排队。保存后运行 `node apps/my_holdings/scripts/decision-report-progress.mjs` 更新进度。确认 API/磁盘中的任务与报告指针，检查独立 HTML 和右栏；只做与变更相称的验证。不要重写整个 state，不丢用户手填目标价、仓位、委托、日志、普通研究或报价；保留历史版本。

**每完成一支，先在当前聊天用中文说明结论，再继续下一支。** 未获刷新要求不要重做已完成十支。当前刷新按钮未来可能产生新等待任务，已有报告不等于刷新完成；每次以实时队列为准。全系列结束须核对 66 支报告与功能后才能标记整个目标完成。

## 下一台电脑提示词

复制 `CONTINUE_PROMPT.txt` 全文，或先发送以下简版（交接文件含完整要求）：

```text
/goal 继续 My Holdings 七位投资思想决策报告系列。先阅读 apps/my_holdings/data/DECISION_HANDOFF.md、DECISION_HANDOFF_STATE.json、DECISION_REPORTS.md、DECISION_PROGRESS.md 和 DECISION_GOAL.json，校验迁移状态与应用。当前已完成10/66，CRDO已完成，从HOOD开始，按原顺序完成剩余56支。严格遵守交接中的研究、估值、三档入场、40万美元仓位、保存和数据保护要求；每完成一支先在这里报告结论再继续，不重复已完成股票，不询问是否继续，不把局部完成当作全目标完成。
```
