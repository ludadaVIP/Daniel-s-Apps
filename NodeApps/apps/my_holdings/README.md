# My Holdings · 持仓室

在 NodeApps 首页选择 **My Holdings**，或打开 http://127.0.0.1:5888/#/app/my-holdings 。沿用工作区的 `npm run dev` / `start.command` / `start.bat`，不需要新装依赖、数据库或额外端口。

## 日常使用

- **我的持仓**：两个账户可改名，持仓可增删改。保留截图股数、成本、市值、均价及报价；按代码和币种合并配置。更新股价后可手动重算市值，避免静默覆盖截图原值。截图没有报价日期，不当作实时行情。
- **近期关注**：只填公司名或代码，保存后自动启动本机 Codex 研究。简要卡片用 More 展开详细研究、风险、催化因素、待核实项与来源。允许编辑关注条件、复制资料包给外部 AI、导入 JSON 回填卡片。
- **组合分析**：根据实际保存数据计算集中度、数据缺口与统一跌幅压力情景，并支持 AI 分析。压力测试不是预测或 VaR，不推算没有来源的 ETF 穿透权重。
- **弹药与目标**：多币种收入 / 支出流水、应急预留、目标资产、期限、回撤承受范围、集中度提醒线。汇率手工录入，每 1 单位外币兑换的 USD；未知汇率不折算。资金池独立于券商现金余额。买入后应更新持仓，同时记一笔投资拨款，避免重复计入资产。
- **行情与档案**：复用 VisualShelf 索引、安全读取和隔离预览。支持 HTML 文件导入、粘贴源码、文件夹子目录扫描、分类和搜索。文件放入 `data/reports/` 后点击刷新。
- **AI 工作台**：一键复制完整背景给 ChatGPT、Claude、Gemini、Codex 等 AI；复制只写剪贴板，不自动向网站发送。AI 返回独立 HTML 后导回本应用。也可以直接让本机 Codex 生成结构化研究，由应用转换成独立 HTML 并保存。
- **决策日志**：记录行动、理由、反证与复盘，后续 AI 资料包自动带上。
- 左右栏独立折叠，窄屏默认收起右栏。明暗模式复用 NodeApps，布局偏好保存在浏览器。

## Codex 研究

需要本机已安装并登录 Codex CLI（`codex login`）。服务端自动从 PATH 或 macOS 应用目录发现；也可设置环境变量 `HOLDINGS_CODEX_BIN` 为 CLI 路径。Windows 支持 PATH 中的 codex.cmd / codex.exe。沿用本机已配置的模型与登录，不在本应用保存 API key。

点击生成会将持仓、资金、目标、关注和日志发送给本机 Codex 所连接的服务。CLI 运行在临时目录、只读沙箱，关闭 shell 工具，使用联网研究与结构化 JSON 输出；JSON 校验后才回填，HTML 由应用转义渲染。超时 4 分钟；任务进行时可继续编辑，完成时合并最新数据。失败显示错误且不会伪造结果；重启时未完成任务标记中断，可重试。

Codex 安装检测与登录不保证模型/网络可用。未连接时，完整资料复制与研究导入仍可使用。CLI 接口参考：[OpenAI 官方非交互执行文档](https://developers.openai.com/codex/noninteractive)。

## 数据与迁移

- `account1.jpg`、`account2.jpg`：原始截图。
- `holdings-transcription.md`：逐字段文字档和口径说明。
- `data/initial-state.json`：仅首次启动使用的原始持仓种子。
- `data/state.json`：日常数据；原子写入，revision 防止多窗口静默覆盖。
- `data/backups/`：最近 30 次修改前的完整 JSON。可通过「账户与数据 → 恢复 JSON」恢复。
- `data/reports/market/`：市场 / 行情 HTML。
- `data/reports/portfolio/`：持仓分析 HTML。
- `data/reports/research/`：关注公司研究 HTML。
- `data/report-catalog.json`：VisualShelf 的目录元数据。

迁移时复制整个 `apps/my_holdings` 文件夹；应用内 JSON 导出包含结构化资料和研究文字，HTML 原文件与图片需另行一起备份。不提供自动下单，不自动获取或伪造实时行情。

## 校验

```sh
node --test apps/my_holdings/server/index.test.js apps/my_holdings/src/model.test.js
npm run build
```

覆盖截图金额、跨账户合并、缺失汇率、预留、数据校验、保存/编辑/删除/恢复、版本冲突、AI 任务并发合并与失败、HTML 原文保存和隔离预览。
