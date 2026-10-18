# My Holdings · 持仓室

NodeApps 中的个人投资记录工具。运行 NodeApps 的 `npm run dev` / `start.command` / `start.bat`，在首页选择 **My Holdings**。

## 设计与功能

- **持仓**：两个账户同时展示并用不同颜色区分；可新增、编辑、删除。编辑只保留账户、代码、名称、数量、成本均价等核心字段。成本均价来自截图里的 IBKR 平均价格，总成本保留截图值。
- **收盘价**：点击「刷新收盘价」后，服务端读取 Yahoo Finance 日线，选取最近一个已完成的美国交易日收盘价。刷新成功时按收盘价 × 股数更新市值；成本均价和总成本不变。每笔报价保留日期与来源。行情端点并非 Yahoo 官方公开 API，偶尔可能限流或不可用；失败的代码会保留原报价并显示错误。
- **近期关注**：输入公司名或代码即可保存。应用只把研究请求写进 waiting 队列，不会启动 Codex CLI、自动联网或占用额度；More 展示已有完整研究，也能复制资料给其他 AI。
- **组合分析 / 行情研究**：点击请求后加入待办，界面显示等待、完成或未完成。选择「复制待办给 Codex」后，把提示粘贴给 Codex；Codex 可读取队列、联网研究、生成 HTML 并回写结果。
- **弹药与目标**：资金流水只使用 USD；目标用一段自由文本记录。资金是个人手工台账，不等于券商实时余额。
- **行情与档案**：把独立 HTML 保存到 `data/reports/market/`、`portfolio/` 或 `research/`。点击档案卡片会在新的浏览器标签页打开 HTML 原件，不在应用中预览。
- **其他**：组合集中度和压力情景本地计算、跨 AI 复制背景、导入 AI 研究 JSON/HTML、决策日志、左右侧栏独立折叠。

## 数据与 GitHub 同步

所有业务数据都保存在本目录文件里，不存在浏览器 `localStorage`：

- `data/state.json`：持仓、关注、资金、目标、Codex 待办和研究摘要。保存时创建 revision 并原子写入。
- `data/CODEX_TODO.md`：由应用维护的待办说明，适合 Codex 读取，也会随 Git 同步。
- `data/backups/`：最近 30 次修改前的 JSON 备份。
- `data/reports/`：HTML 研究报告原件和 VisualShelf 目录。
- `data/initial-state.json`：首次启动的种子数据，不覆盖日常状态。
- `account1.jpg`、`account2.jpg` 与 `holdings-transcription.md`：原始截图和逐字段转录。

这些文件在 NodeApps 仓库中跟踪，正常 Git 提交与 GitHub 同步即可在不同电脑间迁移。切换电脑前先同步提交，另一台先拉取再打开应用；避免两台电脑同时修改同一个 `state.json`，以免产生 Git 文件冲突。浏览器只记住左右栏展开偏好，不存持仓等业务数据。

## Codex 待办的执行方式

关注或分析请求会记录在 `state.json` 的 `jobs` 中，状态为 `waiting`；`data/CODEX_TODO.md` 也列出等待任务。应用不会自动调用 Codex。需要时在 Codex 中粘贴应用复制的待办指令；Codex 完成后将 HTML 放进对应报告目录，并调用 `/my-holdings/api/jobs/{id}/complete` 回写完成状态；无法完成则回写 `fail`。若本地应用没运行，Codex 应更新 `state.json` 并说明无法自动刷新页面。

## 校验

```sh
node --test apps/my_holdings/server/index.test.js apps/my_holdings/src/model.test.js
npm run build
```
