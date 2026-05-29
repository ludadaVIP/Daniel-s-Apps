# Investment — 个人投资学习与决策工作台

> 这是 Investment App 的总设计文档。和 `Vocab.md` 同级，是和未来的"我"或 AI 协作时的第一入口。
> 实现层面参考 `ADDING_A_NEW_APP.md` 与现有 4 个 App 的代码结构（`backend/apps/<name>/routes.py` + `frontend/src/apps/<name>/`）。

---

## 一、产品理念：三个偶像，三类能力，三大支柱

| 偶像 | 我羡慕的能力 | App 中的支柱 |
| --- | --- | --- |
| 孙宇晨 / 李笑来 | 提前 5–10 年看见新范式（BTC/区块链） | **Frontier 趋势识别** —— 加密 + 新兴科技/能源/AI/生物 |
| 巴菲特 / 芒格 | 厚积薄发；价值投资；复利；多元思维模型 | **Value 价值投资** —— 财报、估值、护城河、复利数学 |
| 纳瓦尔 | 看懂商业世界；长期主义；杠杆（代码、媒体、资本） | **Wisdom 商业认知** —— 商业模式、第一性原理、个人杠杆 |

> 这三类能力之间不是孤立的，而是同一套底层操作系统的不同应用场景——**「读懂世界 → 形成观点 → 下注 → 复盘」** 的循环。App 的所有模块都服务于这个循环。

---

## 二、模块全景（6 个模块，按静态 ↔ 动态划分）

```
┌──────────── 慢更新 / 静态 ────────────┐  ┌──────────── 动态 / 周更日更 ────────────┐
│ 1. 知识库 Knowledge                    │  │ 4. 市场简报 Brief                       │
│    - 经济学/金融学复习                 │  │    - 每日宏观速读 (US/CN/EU + 加密)     │
│    - 投资原则 (Buffett/Munger/Naval)   │  │    - 每周行业聚焦                       │
│    - 估值方法 (DCF/PE/PB/PEG…)         │  │    - 每周观点对撞 (Bull vs Bear)        │
│    - 财务报表三张表 + 关键比率         │  │                                         │
│    - 行为金融与心理偏差                │  │ 5. 训练 Training                        │
│                                        │  │    - 每日金句 / 思维体操                │
│ 2. 思维模型库 Mental Models            │  │    - 案例题 (读一份 10-K 写 thesis)     │
│    - Munger 100+ models 中文整理       │  │    - 历史复盘 (2008/2020/2022 crypto)   │
│    - 一句话 + 经典案例 + 适用边界      │  │    - 偏差识别小测                       │
│    - 互相 [[link]]                     │  │                                         │
│                                        │  └─────────────────────────────────────────┘
│ 3. 案例库 Cases                        │
│    - See's Candies / Coca-Cola / Apple │  ┌──────────── 自维护工作台 ──────────────┐
│    - BTC 2013 / ETH ICO / DeFi Summer  │  │ 6. 工作台 Workbench                     │
│    - 失败案例（Long-Term Capital…）    │  │    - 关注清单 Watchlist                 │
│                                        │  │    - 决策日志 Decision Journal          │
└────────────────────────────────────────┘  │    - 估值草稿 Valuation Sandbox         │
                                            │    - 思维模型检查清单                   │
                                            └─────────────────────────────────────────┘
```

### 模块说明（每个模块的核心数据 + 用户路径）

#### 1. Knowledge 知识库（静态，markdown 文件 + 树状目录）
- 数据：`backend/data/Investment/knowledge/**/*.md`，前置 YAML（pillar/level/tags）。
- 路径：左侧三栏目录（Frontier / Value / Wisdom），右侧 markdown 阅读器，支持 TTS（复用 `shared/tts.py`）。
- 增长方式：AI 按章节大纲一篇一篇写，写完更新 `knowledge/INDEX.md`。

#### 2. Mental Models 思维模型库（静态，结构化条目）
- 数据：`backend/data/Investment/models/*.md`，每个 model 一个文件，结构：`name / one_line / origin_field / how_it_works / when_to_use / when_not / example_in_finance / linked_models`。
- 路径：网格/卡片浏览 + 详情页 + 全文搜索；可以从决策日志反向 link 到 model。

#### 3. Cases 案例库（半静态，可持续追加）
- 数据：`backend/data/Investment/cases/*.md`，前置 YAML 标注 `winner/loser/era/pillar`。
- 路径：时间轴 + 标签筛选；每个案例都用同一个模板写（背景 → 关键事实 → 关键决策点 → 复盘启示）。

#### 4. Brief 市场简报（动态，每日 + 每周）
- 数据：
  - `backend/data/Investment/daily/YYYY-MM-DD.md`（每日宏观速读）
  - `backend/data/Investment/weekly/YYYY-Www.md`（每周深度）
- 路径：左侧日历 / 周历，右侧阅读器；最新一篇置顶。
- 增长方式：AI 用固定模板生成（模板见数据 README）。

#### 5. Training 训练（混合）
- 数据：
  - `backend/data/Investment/training/quotes.json`（每日金句轮播）
  - `backend/data/Investment/training/exercises/*.md`（练习题，含标准答案）
  - `backend/data/Investment/training/biases.json`（偏差词典 + 小测）
- 路径：首页"今日一题"卡片 + 训练页全量列表。

#### 6. Workbench 工作台（用户自维护，纯动态）
- 数据：
  - `backend/data/Investment/workbench/watchlist.json`
  - `backend/data/Investment/workbench/journal.json`
  - `backend/data/Investment/workbench/valuations/*.json`
- 路径：表格 / 卡片视图，所有 CRUD 走 REST。
- 关键字段：
  - **watchlist**: `ticker / name / pillar / thesis / catalyst / risk / entry_zone / exit_zone / position_size / opened_at / linked_models[] / linked_cases[]`
  - **journal**: `date / direction (buy/hold/trim/sell/avoid) / asset / thesis / pre_mortem / cognitive_check[] / outcome (空，事后填) / lesson (事后填)`

---

## 三、首页（Investment Home）

进入 App 第一屏不是空白，而是一个**"今日仪表盘"**：

```
┌────────────────────────────────────────────────────────────┐
│  今天是 2026-05-30 · 距离你开始学习投资 第 1 天             │
├────────────────────────────────────────────────────────────┤
│  📰 今日简报 (一句话)        🧠 今日思维模型 (一卡)        │
│  📈 关注清单 异动 (3 个)     📝 决策日志待复盘 (1 个)      │
│  🧩 今日一题                 📚 知识库进度条                │
└────────────────────────────────────────────────────────────┘
```

每张卡片都是入口。这是让 App"好用"的关键 —— 让人**每天有理由打开**。

---

## 四、技术架构（贴现有规范）

| 层 | 路径 | 复用 |
| --- | --- | --- |
| Flask 蓝图 | `backend/apps/investment/routes.py` | 仿 `daily_todo/routes.py` |
| 数据目录 | `backend/data/Investment/` | 仿 `DailyTodo/` |
| 路由前缀 | `/api/investment` | `app.py` 里注册 |
| 前端入口 | `frontend/src/apps/investment/App.jsx` | 仿 `daily_todo/App.jsx` |
| 前端 API | `frontend/src/apps/investment/services/api.js` | 同模式 |
| 路由 | `App.jsx` 新增 `/investment` 路由 + Hub 卡片 | 同模式 |
| Markdown 渲染 | 前端引入 `react-markdown` + `remark-gfm`（Phase 3 加） | 新增依赖 |

> 不做 TTS。这个 App 专门用来"仔细看、慢慢看"。

### 数据目录最终形态

```
backend/data/Investment/
├── README.md                    # ← AI 续写说明书（见下）
├── INDEX.md                     # ← 系统盘点单（每次新增内容更新）
├── knowledge/
│   ├── 00-foundations/          # 经济学/财务三表/统计学复习
│   ├── 10-value/                # 价值投资
│   ├── 20-frontier/             # 加密/新兴趋势
│   ├── 30-wisdom/               # 商业认知/纳瓦尔
│   └── 40-psychology/           # 行为金融
├── models/                      # 思维模型，每条一个 .md
├── cases/                       # 案例库
├── daily/                       # 每日简报 YYYY-MM-DD.md
├── weekly/                      # 每周深度 YYYY-Www.md
├── training/
│   ├── quotes.json
│   ├── biases.json
│   └── exercises/
└── workbench/
    ├── watchlist.json
    ├── journal.json
    └── valuations/
```

### 后端 API 草图

```
GET  /api/investment/home              # 首页仪表盘聚合
GET  /api/investment/knowledge/tree    # 知识库目录
GET  /api/investment/knowledge/doc?path=...   # 单篇内容（解析 frontmatter）
GET  /api/investment/models            # 思维模型列表
GET  /api/investment/models/<slug>
GET  /api/investment/cases
GET  /api/investment/cases/<slug>
GET  /api/investment/brief/daily?date=YYYY-MM-DD
GET  /api/investment/brief/weekly?week=YYYY-Www
GET  /api/investment/brief/latest      # 最近 N 天 / N 周
GET  /api/investment/training/today    # 今日金句 + 今日题
GET  /api/investment/training/exercises
GET  /api/investment/workbench/watchlist
POST/PATCH/DELETE /api/investment/workbench/watchlist[/<id>]
GET  /api/investment/workbench/journal
POST/PATCH/DELETE /api/investment/workbench/journal[/<id>]
GET  /api/investment/search?q=...      # 跨知识库/模型/案例全文搜索
```

---

## 五、实施路线图（每个 phase 一次对话搞定）

| Phase | 内容 | 大概工作量 | 完成后可以做什么 |
| --- | --- | --- | --- |
| **Phase 1：脚手架** | 后端 blueprint 空实现 + 前端空 App + Hub 卡片 + 数据目录 + README/INDEX 初稿 | 0.5 天 | 打开 App 看到框架，路由跑通 |
| **Phase 2：Workbench** | 关注清单 + 决策日志（CRUD） | 1 天 | 立刻开始记录自己的投资想法 |
| **Phase 3：Knowledge + Models** | Markdown 阅读器 + 思维模型卡片 + 全文搜索 | 1–2 天 | AI 可以开始大批量写知识条目 |
| **Phase 4：Brief 简报** | 每日/每周阅读器 + 模板 + 历史归档 | 0.5 天 | 每天/每周让 AI 灌内容 |
| **Phase 5：Training** | 今日金句 + 案例练习题 + 偏差小测 | 0.5–1 天 | 形成日训练习惯 |
| **Phase 6：Home 仪表盘 + 全局搜索 + TTS** | 聚合首页 + 跨模块搜索 + 朗读 | 0.5 天 | 真正"每天打开"的状态 |

> 我的建议：**先做 Phase 1 + Phase 2**。脚手架让 App 跑起来，Workbench 让你**当天就能用**（哪怕没内容，自己记录就有价值）。其它模块跟 AI 协作慢慢长。

---

## 六、AI 协作约定（重要！）

这是 App 长期生长的关键。详细规则见 `backend/data/Investment/README.md`。简版：

1. **每次新增内容前**：先读 `INDEX.md`（盘点已有），再读对应目录下的 README 片段（怎么写）。
2. **每次新增内容后**：必须更新 `INDEX.md`，加一行；如有交叉引用，用 `[[slug]]` 链接。
3. **所有 markdown 内容**：用统一前置 YAML（`title / slug / pillar / tags / created / source`）。
4. **避免重复**：相似主题先合并到已有条目，不要散落多份。
5. **数据 schema 演化**：先改 README，再改代码，再迁移老数据；不要悄悄改。

---

## 七、风险声明（写在 App 内显眼处）

> 本 App 是个人**学习与思考工具**，不是投资建议。所有内容（包括 AI 生成的简报与观点）都可能错。真实下注前请：
> 1. 自己读一手资料（财报、白皮书、招股书）；
> 2. 写决策日志，明确 thesis / pre-mortem / 退出条件；
> 3. 控制仓位，承认无知。

---

## 附：和你最初想法的对应关系

| 你说的 | App 里的体现 |
| --- | --- |
| "羡慕孙宇晨李笑来" | Frontier 知识 + 加密板块的每周简报 + 案例库的 BTC/ETH 故事 |
| "羡慕巴菲特芒格" | Value 知识 + 思维模型库 + 决策日志（学他俩的写法） |
| "羡慕纳瓦尔" | Wisdom 知识 + 商业模式案例 + 长期主义训练 |
| "前期知识储备" | Knowledge + Models（静态） |
| "紧跟世界变化" | Brief 每日/每周（动态） |
| "在做中学" | Workbench 决策日志（自维护） |
| "多角度多学科" | Mental Models 跨学科 + 偏差识别 |
| "AI 帮我一步步" | 数据 README + INDEX 让 AI 知道下一步写什么 |
