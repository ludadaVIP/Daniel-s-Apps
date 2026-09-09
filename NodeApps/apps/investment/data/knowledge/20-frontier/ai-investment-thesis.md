---
title: AI 投资 thesis 2026 — 价值在哪里流动、3 层栈、和 3 种押法
slug: ai-investment-thesis
pillar: frontier
tags: [ai, llm, nvidia, openai, anthropic, foundation-models, picks-and-shovels]
created: 2026-05-30
source: NVIDIA / Microsoft / Google / Meta 2024-2026 财报 / a16z + Sequoia AI 报告 / Anthropic / OpenAI 公开信息
---

## 一句话

AI 是 2024-2026 最大的资本配置主题——但**绝大多数"AI 投资"散户买的不会赚钱**；理解 AI 价值在哪里流动需要先看清**3 层栈**（算力 → 模型 → 应用）+ **3 种押法**（picks-and-shovels / foundation models / vertical AI）+ **谁是 lemons** (Akerlof, [[asymmetric-information]] 视角)；本文用 2026 年的视角给你**完整 thesis 框架**——**不是结论**，是判断 framework。

## AI 价值链的 3 层栈

理解 AI 投资的第一步：**清楚价值在哪一层创造和流向**。

```
┌─────────────────────────────────────┐
│ Layer 3: 应用层 (Apps)              │
│ - Vertical AI (医疗/法律/金融)      │
│ - Consumer Apps (ChatGPT, Claude)   │
│ - Enterprise AI (Salesforce Einstein)│
└─────────────────────────────────────┘
              ↓ 调用
┌─────────────────────────────────────┐
│ Layer 2: 模型层 (Foundation Models) │
│ - OpenAI / Anthropic / Google       │
│ - Open-source (Llama / Mistral)     │
│ - 中国: Qwen / DeepSeek / GLM       │
└─────────────────────────────────────┘
              ↓ 训练 + 推理
┌─────────────────────────────────────┐
│ Layer 1: 算力层 (Compute)           │
│ - GPU: NVIDIA / AMD                 │
│ - Cloud: AWS / Azure / GCP          │
│ - Power: 核电 / 天然气 / 电网        │
└─────────────────────────────────────┘
```

**关键洞察**：**2024-2026 利润主要在 Layer 1**（算力层）—— **大多数"AI 投资"散户买的应用层公司还在亏损**。

## Layer 1：算力层 (Compute) —— 当前赢家

### NVIDIA 的统治地位

2024-2026 数据：
- NVIDIA 数据中心营收：2023 Q1 $42 亿 → 2025 Q1 ~$226 亿（5 倍）
- 数据中心毛利率：75%
- 数据中心 ROIC：~150%
- 市值从 $4000 亿（2023）→ $4 万亿（2026 high）

**为什么 NVIDIA 赢**：
- CUDA 生态（[[network-effects]] + 转换成本）
- 持续创新（H100 → B100 → 下一代）
- TSMC 7nm/5nm 独占产能 (cornered resource)
- 客户被锁定

**但**：估值已极度反映 → 安全边际薄。

### Hyperscalers 的 capex

2024-2026 全球 AI capex：
- Microsoft：$1500 亿（2024-2026）
- Google：$1200 亿
- Meta：$900 亿
- Amazon：$1100 亿
- **合计 $5000 亿+**

**这是历史上最大的 capex cycle**——比 1990s 电信泡沫、2000s 互联网泡沫更大。

**关键问题**：这些 capex **能产生足够回报**吗？

### 算力的下游受益方

**直接受益**：
- TSMC（半导体代工独占）
- 美光 / 三星 / SK 海力士（HBM 内存）
- 应用材料 / Lam Research（半导体设备）

**间接受益**：
- 电力公司（核电、天然气）—— 见 [[energy-transition]]
- 数据中心 REIT（Digital Realty、Equinix）
- 冷却技术公司

## Layer 2：模型层 (Foundation Models) —— 战场惨烈

### 4 家头部玩家

| 玩家 | 估值 (2026) | 营收 | 备注 |
| --- | --- | --- | --- |
| OpenAI | $300B+ | $5B ARR | 闭源、Microsoft 大股东 |
| Anthropic | $80-100B | $1-2B | Claude、Amazon + Google 投资 |
| Google DeepMind | (Google 内部) | — | Gemini，研究最深 |
| xAI (Musk) | $50B+ | < $1B | Grok |

### 开源派挑战

- Meta Llama（免费）
- Mistral（法国，开源）
- DeepSeek（中国，效率突破）
- Qwen（阿里）

**关键问题**：foundation models 是否会**商品化**（commoditize）？

**支持商品化论点**：
- 训练技术扩散
- 算力越来越便宜（10x/2 年）
- 开源接近闭源性能
- 转换成本低（API 一改即可）

**反对商品化论点**：
- 顶级模型仍需 $1B+ 训练成本
- 客户黏性建立（Claude 用户 ≠ ChatGPT 用户）
- 多模态 / 长上下文 / agent 能力差异化
- 品牌效应

**目前未盖棺论定**——这是 foundation model 投资的最大不确定。

### 模型层利润难

**2026 现状**：
- OpenAI 估算亏损 $50-100 亿/年
- Anthropic 类似
- Google / Meta 把 AI 当成本中心（不指望 AI 业务直接盈利）

**为什么亏**：
- 训练成本巨大
- 推理成本高（每次问答 $0.001-0.10）
- 客户对**价格敏感**（[[asymmetric-information]] 视角）

**对投资人意义**：
- 直接投 OpenAI / Anthropic（私募）= 高风险
- 投 Google / Microsoft = 间接押注（但 AI 只是其业务一部分）
- 投开源派 = 投 Meta（最大支持者）

## Layer 3：应用层 (Apps) —— 大多数会失败

### 主要应用类型

**消费类**：
- ChatGPT（OpenAI）—— 4 亿月活
- Claude（Anthropic）
- Gemini（Google）
- Character.AI、Perplexity、Glean 等

**企业类**：
- Microsoft Copilot
- Salesforce Einstein
- GitHub Copilot
- Notion AI、Linear AI、等

**垂直 AI**：
- 医疗（Tempus、Hippocratic）
- 法律（Harvey、CoCounsel）
- 金融（Bloomberg GPT、Hebbia）
- 设计（Midjourney、Stability）
- 视频（Runway、Pika、Sora）

### 应用层的核心挑战

**1. 难以建立护城河**

应用层公司**容易被复制**：
- LLM API 是商品
- 任何创业者都能调用
- 真正差异化是**数据 + 工作流 + 销售**

**2. 单位经济不健康**

很多 AI 应用 LTV/CAC < 1（亏损获客）。
[[unit-economics]] 视角：长期看会大量倒闭。

**3. Foundation Model 公司向上吞噬**

OpenAI 越来越多发布"自家应用"（ChatGPT、Sora、Operator）—— **直接和应用层公司竞争**。

例：很多 "GPT wrapper" 公司在 OpenAI 发布同类功能后估值暴跌。

### 应用层的赢家逻辑

**少数会赢的应用层公司有 3 个共同点**：

1. **专有数据**（OpenAI 没法复制）
2. **深度工作流嵌入**（高转换成本）
3. **强分销 / 客户关系**（不只是技术）

**例**：
- 医疗 AI：客户数据 + FDA 监管 + 医院关系
- 法律 AI：律所工作流 + 隐私要求
- 金融 AI：交易数据 + 合规

**这些"垂直 + 深度集成"AI 公司可能是真赢家**——但目前估值已经被广泛追捧。

## 3 种投资 AI 的方式

### 方式 1：Picks-and-Shovels（卖铲子）

**逻辑**：1849 加州淘金热——**真正赚钱的是卖铲子的 Levi Strauss**，不是淘金客。

**现代 picks-and-shovels**：
- NVIDIA（铲子之王）
- TSMC（铲子工厂）
- ASML（造铲子机器）
- AWS / Azure / GCP（铲子分销）
- 电力公司

**优点**：
- 不管哪个模型 / 应用赢，算力都赚
- 利润已经兑现（NVDA 70%+ 毛利）

**缺点**：
- 已经被广泛认知 → 估值高
- 安全边际薄

**Buffett 没买 NVIDIA**——可能因为估值 + 圈外。

### 方式 2：Foundation Models 直接

**逻辑**：押一个或几个会赢的 LLM 公司。

**问题**：
- 大部分是私募（OpenAI、Anthropic）
- 公开市场代理：Microsoft（OpenAI 大股东）、Google（自己开发）、Meta（开源）
- 仓位**不纯**（这些公司 AI 只是一部分）

**最纯的公开市场押法**：
- xAI 未来 IPO
- 部分中国 LLM（百度、阿里）—— 但治理/监管风险

### 方式 3：Vertical AI 应用

**逻辑**：押注**特定垂直**的 AI 应用赢家。

**风险高**：
- 大多数会失败
- 难以提前识别赢家
- 估值已经被广泛追捧

**适合**：早期 VC、专业 AI 投资人。**散户不推荐**。

## 历史类比：1999 dotcom

AI 2024-2026 经常被类比 1999 dotcom 泡沫。**类比的有效部分**：

- 巨大 capex（dotcom: 电信基础设施；AI: 算力）
- 普遍狂热
- 大量应用层公司难以变现
- 估值高

**但有重要差异**：

- 2026 头部公司**真有利润**（NVIDIA、Microsoft）——不像 1999 大量空壳
- 真实生产力提升已经显现
- 全球 hyperscaler 由**真现金流**支撑 capex

**Howard Marks 2024 致客户信**：

> "**This time is not different in every way. But it's not exactly the same either. The capex is real, the demand is real, but valuations leave little room for error.**"

—— 不是完全不同，也不是完全一样。**估值留给错误的空间很小**。

## 5 个判断 AI 公司的具体问题

任何 AI 投资前问：

### Q1：这家公司在 3 层栈的哪一层？

如果说不清 → 你不懂。

### Q2：它的护城河类型是什么？

参考 [[5-types-of-moats]] / [[helmer-7-powers]]。

- "我们用 GPT-4" = 没护城河
- "我们有专有医疗数据 + FDA 批准" = 有护城河

### Q3：单位经济如何？

[[unit-economics]] 视角：
- LTV / CAC > 3 = 健康
- LTV / CAC < 1 = 亏损获客

### Q4：foundation model 价格下降对它是好还是坏？

- 如果是好（应用层用更便宜模型）→ 押模型商品化
- 如果是坏（公司本身是模型）→ 押模型差异化

### Q5：如果 AI 进展放缓 1-2 年怎样？

[[pre-mortem]] 视角：
- 客户取消？
- 烧光现金？
- 还能活吗？

## 反面 / 边界

### 1. AI 真生产力提升尚未充分显现

很多调查显示 AI 实际生产力提升 5-15%——不是预期的 50%+。
如果生产力提升慢 → AI capex ROI 难兑现 → 估值修正。

### 2. 监管 / 安全 / 伦理风险

- EU AI Act 2024 生效
- 美国可能加强监管
- 中国数据出境限制

**这些都是 AI 行业潜在打击**。

### 3. 能源限制

[[energy-transition]] 视角：电力供应可能限制 AI 增长。

### 4. 模型架构突变

如果出现新架构让 transformer 过时（如 Mamba 等）——已建立的 LLM 公司可能被颠覆。

### 5. 中国 AI 路径不同

DeepSeek 2025 年用 1/10 成本做出接近 GPT-4 性能——**冲击美国 AI 估值假设**。

如果中国持续以低成本追赶 → **整个 AI 估值需要重新评估**。

## 给投资者的启示（5 条）

1. **理解 3 层栈** —— 算力层利润已兑现，模型层战场惨烈，应用层大多会失败。

2. **Picks-and-shovels 是最稳路径** —— NVIDIA / TSMC / 电力公司，但估值已高。

3. **公开市场代理多数不纯** —— Microsoft 押 OpenAI、Google 押 DeepMind、Meta 押开源，但都不是纯 AI。

4. **5 个问题筛选 AI 公司** —— 3 层栈位置 / 护城河 / 单位经济 / 模型价格影响 / 1-2 年放缓应对。

5. **类比 1999 dotcom 但不完全相同** —— 利润和需求是真的，但估值留给错误空间小。**留余地**。

## 相关

- [[helmer-7-powers]] — 评估 AI 公司护城河
- [[5-types-of-moats]] — Dorsey 框架应用
- [[pricing-power]] — AI 公司定价权评估
- [[unit-economics]] — AI 应用层单位经济
- [[asymmetric-information]] — AI 应用的 lemons 问题
- [[network-effects]] — CUDA / 数据网络效应
- [[christensen-innovators-dilemma]] — 谁颠覆谁？
- [[energy-transition]] — AI 电力需求
- [[base-rates]] — 历史科技泡沫的基础概率
- [[narrative-fallacy]] — "AI 改变一切"叙事的陷阱
- [[time-arbitrage]] — AI 长期 vs 短期视角
- [[circle-of-competence]] — 大多数散户在 AI 圈外
- [[2003-amazon-buffett-miss]] — Buffett 错过 Amazon 的教训对 AI 适用
- [[2014-ethereum-ico-mania]] — 加密赛道经验适用 AI（90% 应用层会失败）
