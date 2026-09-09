---
title: ROIC vs ROE vs ROA — 资本效率三大指标的真正含义与陷阱
slug: roic-roe-roa-deep
pillar: foundations
tags: [roic, roe, roa, 资本效率, dupont, buffett, 估值]
created: 2026-05-30
source: McKinsey《Valuation》第 7 版 / Damodaran《The Little Book of Valuation》/ Berkshire 致股东信反复引用 / Pat Dorsey《The Five Rules for Successful Stock Investing》
---

## 一句话

ROIC（投入资本回报率）是评估**管理层资本配置能力**的最强单一指标——它告诉你"**每投入 $1 资本，公司每年能产出多少 $**"；ROE 因为杠杆扭曲、ROA 因为现金/商誉扭曲，**都不如 ROIC 干净**；理解这三个指标的差异 + 知道它们怎么被操纵，是从"看财报新手"到"懂生意的人"的分水岭。

## 三个指标的精确定义

### ROA (Return on Assets)

```
ROA = Net Income / Total Assets
```

- 分子：净利润（含财务费用、税）
- 分母：总资产（所有资产，含现金、商誉、杠杆形成的资产）

**衡量**：每 $1 资产创造多少 $1 利润。

**优点**：简单，包含所有资产。
**缺点**：把"利息支出后的净利润"和"未扣息的总资产"对比，**有杠杆扭曲**。

### ROE (Return on Equity)

```
ROE = Net Income / Shareholders' Equity
```

- 分子：净利润
- 分母：股东权益（资产 − 负债）

**衡量**：每 $1 股东资本创造多少 $1 利润。

**优点**：直接反映股东视角。
**致命缺点**：**可以通过加杠杆人为提高**。

**数学证明**：

```
ROE = ROA × Equity Multiplier
    = ROA × (Total Assets / Equity)
    = ROA × (1 + Debt/Equity)
```

如果 ROA = 5%、负债权益比 = 3：→ ROE = 5% × 4 = **20%**（看起来很好）。

**但这 20% 是借来的杠杆制造的**——风险大幅增加。

### ROIC (Return on Invested Capital)

```
ROIC = NOPAT / Invested Capital
     = EBIT × (1 - 税率) / (债务 + 股东权益 - 现金)
```

- 分子：**NOPAT**（税后经营利润，剔除财务费用、一次性损益）
- 分母：**投入资本**（债 + 股，减去未投入运营的现金）

**衡量**：每 $1 真正投入运营的资本（不管是股东出的还是借的）创造多少 $1 经营利润。

**优点**：
- 剔除杠杆扭曲（分子用 NOPAT 不扣利息，分母含债）
- 剔除超额现金扭曲（剔除非经营现金）
- 直接反映"**管理层把资本投到哪里、做得多好**"

**这是 Buffett、Munger、McKinsey 估值教科书共同推崇的"资本效率金本位"**。

## 三个指标的对比例子

某公司：
- 总资产 $100M
- 现金（非经营） $20M
- 负债 $40M
- 股东权益 $40M
- 净利润 $8M
- EBIT $13M
- 税率 25% → NOPAT = $9.75M

计算：

| 指标 | 公式 | 计算 | 结果 |
| --- | --- | --- | --- |
| ROA | 8 / 100 | | **8%** |
| ROE | 8 / 40 | | **20%** |
| ROIC | 9.75 / (40 + 40 - 20) | 9.75 / 60 | **16.3%** |

**三个数字看起来差异大**——但反映的是不同视角：
- ROA 包含闲置现金 → 偏低
- ROE 用杠杆放大 → 看起来美
- **ROIC 是中性最真实的资本效率**

## 为什么 ROIC > ROE > ROA

**长期投资判断**只用 ROIC（McKinsey 推荐）。

### 1. ROIC 不被杠杆愚弄

经典反例：2008 前的雷曼兄弟

- 杠杆 30:1
- ROE 长期 20-25%（看起来 Buffett 级）
- 实际 ROIC 仅 1-2%（金融业平均）
- **ROE 高仅因为大量杠杆**——杠杆一断（[[2008-lehman-multidimensional]]）→ 破产

**如果只看 ROE → 投错**。如果看 ROIC → 一眼看出**杠杆驱动的虚假高回报**。

### 2. ROIC 不被超额现金愚弄

Apple 2020 持有 $200B+ 现金：

- 这些现金"占用"ROA 分母 → ROA 看起来低
- 但这些现金没有投入运营
- **ROIC 把它剔除** → 真实反映运营资本的效率

Apple 真实 ROIC 60%+，而 ROA 只有 12-15%——**ROIC 才是真相**。

### 3. ROIC 鼓励正确的资本配置

CEO 应该想：**新投入的 $1 能创造多少 $？**

- 如果新项目 ROIC > WACC（资本成本）→ 创造价值
- 如果 ROIC < WACC → 摧毁价值（应该返还股东）

**ROIC 是 capital allocation 的标尺**。ROE 鼓励加杠杆，ROA 不区分运营 vs 闲置——都是错的工具。

## ROIC vs WACC：价值创造的核心公式

```
价值创造率 = (ROIC - WACC) × 投入资本
```

- ROIC > WACC：**正经济利润**，公司创造价值
- ROIC = WACC：**0 经济利润**，仅维持
- ROIC < WACC：**负经济利润**，摧毁价值

**WACC** 一般 8-12%（取决行业 + 利率）。

**优秀公司**：ROIC > 15%，持续 10 年+。
**伟大公司**：ROIC > 25%，持续 20 年+。

**全球公司分布**：
- ROIC > 20% 持续 10 年：< 5% 的公司
- ROIC > 30% 持续 10 年：< 1%（"super compounders"）

## DuPont 分解：理解 ROE 的来源

DuPont 公司 1920s 发明的分解：

```
ROE = Net Margin × Asset Turnover × Equity Multiplier
    = (Net Income / Sales) × (Sales / Assets) × (Assets / Equity)
```

3 个驱动：
1. **Net Margin**（利润率）：每 $1 销售赚多少
2. **Asset Turnover**（资产周转）：每 $1 资产创造多少销售
3. **Equity Multiplier**（杠杆）：每 $1 股东资本撬动多少资产

**用 DuPont 看 3 家公司有同样 ROE 15%**：

| 公司 | 利润率 | 资产周转 | 杠杆 | ROE |
| --- | --- | --- | --- | --- |
| **奢侈品**（如 LVMH） | 20% | 0.6 | 1.25 | 15% |
| **零售**（如 Walmart） | 3% | 2.5 | 2.0 | 15% |
| **银行** | 1% | 0.1 | 15 | 15% |

**虽然 ROE 一样，公司本质完全不同**：
- 奢侈品：高利润率（品牌定价权）
- 零售：高周转（薄利多销）
- 银行：高杠杆（金融业本质）

**DuPont 分解告诉你"15% ROE 从哪里来"——这比 ROE 本身重要**。

## 高 ROIC 持续的稀有性（[[regression-to-the-mean]] 视角）

经济学规律：**高回报吸引竞争 → 竞争压低回报**。

McKinsey 2020 年版《Valuation》给出的实证：

| 1995 年 ROIC | 10 年后（2005） | 20 年后（2015） |
| --- | --- | --- |
| ROIC > 30% | 35% 仍然 > 30% | 18% |
| ROIC 20-30% | 28% 仍然 > 20% | 12% |
| ROIC < 5% | 仅 8% 变成 > 15% | 仅 3% |

**只有少数公司能"长期保持高 ROIC"**——这就是 Buffett 找的"稀有物种"。

**ROIC 抗回归 = 真护城河**。

## 5 种真实高 ROIC 公司样本

### 1. See's Candies（[[1972-sees-candies]]）

- 1971 年净有形资产 $800 万
- 1971 年税前利润 $420 万
- **ROIC = 53%**

到 2007 年累计：
- 净有形资产从 $800 万到 $4000 万
- 累计税前利润 $13.5 亿
- **平均 ROIC ~150%**（不需要重新投资就能扩大）

这是**ROIC 极致**的样本。

### 2. Coca-Cola（[[1988-coca-cola-buffett]]）

- 长期 ROIC 25-35%
- 部分得益于装瓶商分离（轻资产化）
- 品牌护城河 + 全球分销 = 持续高 ROIC

### 3. Apple（[[2016-apple-buffett-pivot]]）

- ROIC 2015-2024 持续 25-45%
- 部分因为高利润率（30%+）
- 部分因为大量股票回购（减少 invested capital）

### 4. Visa / Mastercard

- ROIC 40%+
- 网络效应 + 极低 capex
- 这是支付行业为什么 Buffett 后期重仓 V/MA

### 5. 中国茅台

- 长期 ROIC 30-40%
- 品牌 + 定价权 + 极低 capex
- 中国版的 See's Candies

## 3 种 ROIC 操纵手法

### 1. 大规模股票回购（人为提高 ROE）

不增加经营效率——只是减少分母（股东权益）。

例：某公司 ROE 从 15% → 20%，**全靠回购**：
- 回购前：净利润 $100M / 股东权益 $667M = 15%
- 回购 $167M：净利润 $100M / 股东权益 $500M = 20%

**ROIC 不变**（运营没改善）。**但 ROE 看起来跃升**。

**反 Goodhart 视角**（[[goodharts-law]]）：CEO 被 ROE 奖励 → 优化 ROE → 大规模回购。

### 2. 表外项目隐藏资本

部分公司用：
- 经营租赁（vs 融资租赁）
- 合资企业（不并表）
- SPV（特殊目的实体）

**藏起一部分投入资本** → ROIC 看起来高。

经典案例：Enron 2001 用 SPE 把巨额负债搬到表外（[[three-financial-statements]] 详细讲过）。

### 3. 商誉的扭曲

并购溢价记为商誉。

**做法 A**：商誉计入分母 → ROIC 准确反映**真实**资本回报
**做法 B**：剔除商誉 → ROIC 看起来高得多（管理层喜欢）

很多上市公司用做法 B 给投资者展示——**实际是误导**。

**正确做法**：ROIC 必须包含商誉（你为收购付的真实成本不能凭空消失）。

## 怎么读 10-K 算 ROIC（实战 5 步）

### 步骤 1：在 10-K 找 NOPAT 的输入

利润表：
- 找 Operating Income (EBIT)
- 找税率（Effective Tax Rate）
- NOPAT = EBIT × (1 − 税率)

### 步骤 2：找 Invested Capital

资产负债表：
- 找 Short-term Debt + Long-term Debt
- 找 Total Equity
- 找 Cash and Equivalents（剔除）
- Invested Capital = Debt + Equity − Excess Cash

**"Excess Cash"** 是关键判断——通常指超过运营所需的现金（保守估计：留 5% 营收作为运营现金）。

### 步骤 3：计算 ROIC

```
ROIC = NOPAT / Invested Capital
```

用**期初 + 期末平均**的 Invested Capital，更精确。

### 步骤 4：分析趋势

- 最近 5 年 ROIC 趋势：上升？下降？稳定？
- 同行业对比（不同行业 ROIC 基准不同）

### 步骤 5：判断质量

- ROIC > 20% 持续 5 年：高质量
- ROIC > 15% 持续 5 年：好
- ROIC = WACC：仅维持
- ROIC < WACC：摧毁价值

## 不同行业的 ROIC 基准

| 行业 | 优秀 ROIC | 平均 ROIC |
| --- | --- | --- |
| 软件 / SaaS | 30%+ | 15% |
| 消费品（强品牌） | 25%+ | 12% |
| 制药 | 20%+ | 12% |
| 半导体 | 25%+ | 15% |
| 电信 | 15%+ | 8% |
| 公用事业 | 12%+ | 8% |
| 银行 | 12%+ (ROE 视角) | 8% |
| 重资产周期股 | 15%+ 全周期 | 5-7% |
| 航空 | 5%+ | 2-3% |

**用错基准 = 错过好公司 + 投资烂公司**。比如把"科技股 25%"标准应用到航空 → 全行业都不及格。

## 反面 / 边界

### 1. ROIC 不适用于早期公司

亚马逊 1997-2010 长期低 ROIC——但**有意为之**（[[2003-amazon-buffett-miss]]）。

**早期公司**：用单位经济（LTV/CAC）替代 ROIC。

### 2. ROIC 不适用于金融业

银行的"资本"概念不同（监管资本、风险加权资本）。
**用 ROE 或 ROTE（return on tangible equity）替代**。

### 3. 一次性 ROIC 可能误导

某年突然高 ROIC 可能因为：
- 一次性资产出售
- 税务优惠
- 偶发订单

**至少看 5 年趋势**。

### 4. ROIC 不反映"再投资能力"

某公司 ROIC 30% 但**无法扩大规模** → 现金堆积不能复投。
**真正强公司是 ROIC 30% + 长期高再投资率**——这是 [[power-of-compounding]] 的真正引擎。

### 5. ROIC 不衡量管理层"打分"

ROIC 是结果指标——**取决于行业、资本结构、历史选择**。

不能用 ROIC 直接评判 CEO 好坏（继承的优势 vs CEO 创造的）。

## 给投资者的启示（5 条）

1. **任何公司分析的第一指标是 ROIC** —— 不是 PE 不是营收增长不是 ROE。

2. **ROE 高 → 用 DuPont 分解**：来自利润率 / 周转 / 杠杆 哪个？**杠杆驱动的 ROE 是假信号**。

3. **判断行业基准** —— 用对了基准才能识别好公司（航空 ROIC 5% 已是优秀）。

4. **看 ROIC 持续性** —— 1 年高不是技能，10 年高 = 真护城河（[[helmer-7-powers]]）。

5. **ROIC > WACC 才创造价值** —— 这是 capital allocation 判断的金本位。

## 相关

- [[dcf-owner-earnings]] — ROIC 是 DCF 的核心输入之一
- [[free-cash-flow-deep]] — FCF + ROIC = 完整资本效率
- [[three-financial-statements]] — 三表是 ROIC 计算来源
- [[buffett-12-principles]] — 第 9 原则 "不看 EPS，看 ROE/ROIC"
- [[power-of-compounding]] — 高 ROIC + 长持有 = 复利奇迹
- [[helmer-7-powers]] — Power 持久 = ROIC 抗回归
- [[regression-to-the-mean]] — 高 ROIC 抗回归是真护城河
- [[goodharts-law]] — ROE 被广泛瞄准 → 易被回购游戏化
- [[circle-of-competence]] — 看不懂业务就算不准 ROIC
- [[1972-sees-candies]] — ROIC 150%+ 极致样本
- [[1988-coca-cola-buffett]] — 25-35% ROIC 持续
- [[2016-apple-buffett-pivot]] — 25-45% ROIC + 大量回购
- [[2008-lehman-multidimensional]] — 高 ROE 低 ROIC 的杠杆陷阱
