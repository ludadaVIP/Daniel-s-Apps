# Investment 数据仓库 — AI 协作说明书

> 给未来的 AI（也给未来的我）。打开这个 App 的内容目录第一件事：读这份 README，再读 `INDEX.md`。
> 总设计见根目录 `Investment.md`。这里只讲**怎么往里加内容**。

---

## 0. 三条不可违反的原则

1. **先盘点，再写**：动手前读 `INDEX.md` 确认主题未被覆盖；如果只是补充，直接编辑老文件，不要新建。
2. **写完必更新 INDEX**：在 `INDEX.md` 对应小节加一行 `- [slug](相对路径) — 一句话简介`。
3. **schema 演化要先改 README**：如果要加新字段或新目录，先在这份 README 里加说明 + 在 INDEX 里登记，再写数据。

---

## 1. 目录速查

```
.
├── README.md              ← 当前文件
├── INDEX.md               ← 全量盘点（必须保持最新）
├── knowledge/             ← 静态：长期不变的知识
├── models/                ← 静态：思维模型条目
├── cases/                 ← 半静态：投资案例
├── daily/                 ← 动态：每日宏观速读
├── weekly/                ← 动态：每周深度
├── training/              ← 混合：金句/题/偏差
└── workbench/             ← 用户自维护（AI 一般不写）
```

---

## 2. 通用前置 YAML（所有 .md 文件第一段都必须有）

```yaml
---
title: 显示用标题
slug: 文件名同名的 kebab-case 唯一 id
pillar: frontier | value | wisdom | foundations | psychology
tags: [按需, 关键词]
created: YYYY-MM-DD
source: 一句话来源（书名 / 链接 / 原创）
---
```

正文用 GFM markdown。内部交叉引用用 `[[slug]]`（前端会解析）。

---

## 3. 各目录写作约定

### 3.1 `knowledge/` — 知识库

**目录结构（不要随意新建顶层目录）**：
- `00-foundations/` — 经济学/金融学/统计学/三张报表的复习。难度从浅到深排序文件名（`01-...`, `02-...`）。
- `10-value/` — 价值投资：Buffett 12 原则、Munger 多元思维、护城河、估值方法、复利数学、好生意 vs 好公司。
- `20-frontier/` — 加密 + 新兴趋势：区块链基础、比特币、以太坊、稳定币、L2、Tokenomics、AI、能源转型、合成生物。
- `30-wisdom/` — 商业认知与长期主义：Naval 原则、商业模式分类、护城河类型、网络效应、规模经济、个人杠杆（代码/媒体/资本）。
- `40-psychology/` — 行为金融与认知偏差：Kahneman 系统 1/2、Munger 25 偏差、过度自信、锚定、损失厌恶。

**单篇结构模板**：
```markdown
---
title: 复利的力量
slug: power-of-compounding
pillar: value
tags: [复利, 数学, buffett]
created: 2026-05-30
source: 巴菲特致股东信 1965-2023 / 原创整理
---

## 一句话
为什么 7% 年化 30 年是 7.6 倍，而不是 3.1 倍？

## 核心要点
- ...

## 经典例子
- ...

## 我的提问 / 反例
- ...

## 相关
- [[margin-of-safety]]
- [[buffett-12-principles]]
```

**写新条目前自问 3 个问题**：
1. 这个主题 `INDEX.md` 里有没有近义条目？有 → 编辑老文件。
2. 这个 pillar 选得对吗？跨 pillar 主题归到最核心那个，其它 pillar 在末尾 `## 相关` link 过去。
3. 这条能不能 link 到至少 1 个其它条目？不能 → 说明孤岛，要么不写，要么补 link。

### 3.2 `models/` — 思维模型库

每个 model 一个文件，文件名 = slug。模板：
```markdown
---
title: 反演 / Inversion
slug: inversion
pillar: wisdom
origin_field: 数学 / 哲学（Jacobi）
tags: [munger, problem-solving]
created: 2026-05-30
source: Poor Charlie's Almanack
---

## 一句话
"反过来想，总是反过来想。"

## 它怎么工作
不直接问"怎么成功"，而问"怎么必然失败"，列出失败模式，逐一避免。

## 投资里怎么用
- 不问"这只股能涨多少"，问"什么情况下会归零"。
- 不问"这个 thesis 怎么对"，问"什么证据会证伪它"。

## 适用边界
- 适合：高风险、不可逆决策。
- 不适合：纯探索性 brainstorming 早期。

## 经典案例
- Munger 用反演避开 Long-Term Capital Management 的崩盘逻辑。

## 相关模型
- [[pre-mortem]] · [[falsifiability]] · [[margin-of-safety]]
```

### 3.3 `cases/` — 案例库

文件名：`<era>-<short-name>.md`，例如 `2013-btc-early-believers.md`、`1972-sees-candies.md`。

模板：
```markdown
---
title: See's Candies — 巴菲特最重要的一次买入
slug: 1972-sees-candies
era: 1972
winner_or_loser: winner
pillar: value
tags: [buffett, moat, pricing-power]
created: 2026-05-30
source: 巴菲特致股东信 1972-1995
---

## 背景
- 时间 / 地点 / 人物 / 行业大环境

## 关键事实
- 价格、估值、财务数据（PE/PB/ROE）、市场背景

## 关键决策点
- 当时多数人怎么看？
- 巴菲特/芒格的不同看法是什么？
- 用了什么思维模型？（link 到 `models/`）

## 后续与结果
- 数字结果 + 时间跨度

## 给我的启示
- 3 条以内
```

### 3.4 `daily/` — 每日宏观速读

文件名：`YYYY-MM-DD.md`。每天一份，AI 生成时填模板：

```markdown
---
title: 2026-05-30 日报
slug: 2026-05-30
date: 2026-05-30
generated_by: ai
---

## TL;DR
- 三条以内一句话总结

## 美股 / 美元 / 美债
- ...

## 中国 / 港股 / 人民币
- ...

## 欧洲 / 日本
- ...

## 加密
- BTC dominance / ETH/BTC / 主流叙事 / 链上指标
- ...

## 一条值得追踪的新闻
- 标题 + 一句话点评 + 为什么重要（用第一性原理拆，不是复述）

## 不重要的噪音（写出来才能忽略）
- ...
```

### 3.5 `weekly/` — 每周深度

文件名：`YYYY-Www.md`（ISO 周编号，如 `2026-W22.md`）。模板：

```markdown
---
title: 2026-W22 周报 — 本周聚焦：xxx
slug: 2026-W22
week_start: 2026-05-25
week_end: 2026-05-31
focus_industry: 电力 / AI 算力 / 稳定币 / ...
generated_by: ai
---

## 本周聚焦行业：xxx
### 行业现状
### 关键公司 / 项目
### 上行驱动 vs 下行风险
### 三种估值视角

## Bull vs Bear 观点对撞
| 议题 | Bull 观点 | Bear 观点 | 我的判断 |

## 本周值得记住的 1 张图
（用文字描述，让我能找原图）

## 本周值得追踪的 3 个数据点
```

### 3.6 `training/` — 训练

- `quotes.json`：数组，元素 `{id, text, author, source, pillar}`。首页轮播一句。
- `biases.json`：数组，元素 `{id, name, one_line, example, antidote}`。
- `exercises/*.md`：每题一文件，前置 YAML `difficulty (1-5) / kind (10K阅读/估值练习/历史复盘/...) / answer_visible (false)`，正文上半是题，下半 `<details>` 包答案。

### 3.7 `workbench/` — 用户工作台

**AI 默认不写这里**（这是用户自己的私人数据）。只有用户明确说"帮我整理我的 watchlist"时才动。

数据 schema：

```jsonc
// watchlist.json
{
  "items": [
    {
      "id": "wl-xxxxxx",
      "ticker": "BRK.B",
      "name": "Berkshire Hathaway",
      "pillar": "value",
      "thesis": "1-3 句核心论点",
      "catalyst": "什么会让 thesis 兑现",
      "risk": "什么会让 thesis 破产",
      "entry_zone": "价格 / 估值区间",
      "exit_zone": "退出条件",
      "position_size": "% 占总仓位",
      "opened_at": "YYYY-MM-DD",
      "linked_models": ["margin-of-safety"],
      "linked_cases": ["1972-sees-candies"],
      "notes": "随手笔记"
    }
  ],
  "updated_at": "YYYY-MM-DDTHH:MM:SSZ"
}
```

```jsonc
// journal.json — 决策日志（学 Buffett/Munger 的写法）
{
  "entries": [
    {
      "id": "j-xxxxxx",
      "date": "2026-05-30",
      "asset": "BTC",
      "direction": "buy | hold | trim | sell | avoid",
      "thesis": "为什么这个决策",
      "pre_mortem": "如果一年后这个决策失败了，最可能的原因是什么",
      "cognitive_check": [
        "我是不是在锚定最近的价格？",
        "我是不是在追热点？",
        "如果别人不知道这是我做的，我还会不会做？"
      ],
      "size": "仓位 / 金额",
      "outcome": "",       // 事后填
      "lesson": "",        // 事后填
      "updated_at": "..."
    }
  ]
}
```

---

## 4. INDEX.md 怎么维护

`INDEX.md` 是全量盘点单。每次新增/删除/重命名文件后，必须同步。

格式（每节一段）：

```markdown
## knowledge/10-value
- [复利的力量](knowledge/10-value/power-of-compounding.md) — 7% 30 年为何是 7.6 倍
- [安全边际](knowledge/10-value/margin-of-safety.md) — Graham 的核心思想

## models
- [反演](models/inversion.md) — 反过来想，总是反过来想
```

> AI 每次工作前 `Read` 一次这个文件 + 当前要写的目录下已有的 1-3 篇做风格对齐。

---

## 5. 产出规则（给 AI 看）—— 宁缺毋滥

**最高指令：质量 >> 数量。** 用户可以读 100 篇 AI 流水账，但不会因此变成投资人；
读 5 篇真正讲透的，会。所以**门槛 > 上限**。下面是规则：

### 5.1 质量门槛（每篇必须过这道关）

写完一篇问自己 6 个问题，**任何一个答 "勉强" 或 "不行"，就别提交**：

1. **一句话能说清核心吗？** — 第一段第一句必须是"一句话核心"。说不清就别写。
2. **有具体到能复述的例子吗？** — 至少 1 个真实例子（数字、人名、时间、地点）。
   "比如苹果公司"不算；"巴菲特 2016 年开始买 AAPL，到 2023 年浮盈 1000 亿+"算。
3. **有反面 / 边界吗？** — 这条规则什么时候不适用？谁反对？为什么有人反对也能赚到钱？
   没有反面的内容 = 鸡汤。
4. **能 link 到至少 1 个已有条目吗？** — 在 `## 相关` 段落 link `[[slug]]`。
   不能 link = 这条是孤岛 = 这个体系还没真正长出来 = 暂时别写。
5. **是不是和已有条目重复？** — 重复就编辑老的，不要新建。
6. **如果 5 年后回来看，还有价值吗？** — "本周大盘观点"放 `weekly/`，不放 `knowledge/`。
   `knowledge/` 是知识，不是新闻。

### 5.2 建议的批量产出（不是上限，是节奏）

只要每篇都过质量门槛，**一次给我多写一些**。参考节奏：

| 内容类型 | 单次建议产出 | 备注 |
| --- | --- | --- |
| `knowledge/` | 5–10 篇 | 围绕同一主题成组写，便于交叉 link |
| `models/` | 8–15 个 | 模型短小，一次多写几个反而能突出对比 |
| `cases/` | 2–4 个 | 案例长，但要成组（如"价值投资三大胜利" 或 "三大失败"） |
| `daily/` | 1 份 | 当天的，写多了没意义 |
| `weekly/` | 1 份 | 同上 |

**如果某次写不到下限**，说明 AI 在硬凑，**主动减少**比硬补好。

### 5.3 反面清单（这些是 slop，绝不要写）

- ❌ 教科书定义的搬运（"PE 是市盈率，等于价格除以每股收益"）
- ❌ 没有具体数字 / 名字 / 时间的"通常来说"段落
- ❌ 5 个段落都在说"很重要"但没说"为什么"
- ❌ 同一篇里 3 次出现"长期主义"但没解释长期是几年、对谁长
- ❌ 抄维基 / 财经媒体 / 公众号的腔调
- ❌ "投资有风险" 这种万能免责声明（系统级风险声明只在首页一次就够）

### 5.4 每次产出后的收尾

1. 更新 `INDEX.md` 加新行。
2. 给用户一段**回顾**：这一批写了什么、为什么这样选、和已有内容怎么衔接。
3. 提**2-3 个具体的下一步选项**，不要开放式问"接下来想看什么"。
   ✅ "下一步建议三选一：①补完 Munger 25 偏差（还差 13 个）②写 2 个失败案例（LTCM/2022 加密寒冬）③开始 Phase 4 市场简报"
   ❌ "你想接下来学什么？"

---

## 6. 当前状态

→ 见 `INDEX.md`。如果 `INDEX.md` 还不存在，说明这个 App 刚 init，请创建一个空骨架（按目录列段落，每段写 `_(暂无)_`）。
