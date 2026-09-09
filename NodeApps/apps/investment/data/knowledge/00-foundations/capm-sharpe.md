---
title: CAPM + Sharpe Ratio — 现代投资组合理论的核心，以及它的根本缺陷
slug: capm-sharpe
pillar: foundations
tags: [capm, sharpe, beta, 现代投资组合理论, 风险调整回报, markowitz]
created: 2026-05-30
source: William Sharpe 1964 / Harry Markowitz 1952 / Eugene Fama 1970 / Buffett 1984 Columbia 演讲 / Howard Marks 论"风险"
---

## 一句话

CAPM（资本资产定价模型）+ Sharpe Ratio 是**学术金融学的核心**——前者告诉你"理论上一只股票该给多少回报"，后者告诉你"考虑风险后的真实表现"；它们**统治了 60 年的机构投资 + MBA 课程**，但 Buffett、Munger、Marks 都激烈反对其核心假设（"波动 = 风险"）；**理解它们 + 知道它们的根本缺陷**，是分辨"会算公式" vs "懂投资"的关键。

## 历史起点：Markowitz 1952

Harry Markowitz（芝加哥大学博士生，1990 年诺贝尔奖）1952 年发表论文 **"Portfolio Selection"** —— **现代投资组合理论 (Modern Portfolio Theory, MPT) 的诞生**。

**核心 insight**：

> "**Risk is not just about individual stocks—it's about how they interact in a portfolio. Diversification can reduce risk without reducing expected return.**"

**翻译**：风险不只在单一股票——在于**它们如何在组合里互动**。**分散可以降风险而不降回报**。

**数学化**：
- 每只股票有期望回报和方差（波动）
- 两只股票有相关性
- **组合的方差 < 单一股票方差的加权平均**（如果相关性 < 1）
- 存在"**有效前沿**"（efficient frontier）—— 给定回报下最低风险的组合

这是**第一次**有数学框架描述"分散投资"的价值。

## William Sharpe 1964：CAPM

Sharpe 在 Markowitz 基础上 1964 年发表 CAPM（同样 1990 年诺贝尔奖）：

```
E(Ri) = Rf + βi × (E(Rm) - Rf)
```

- **E(Ri)** = 股票 i 的期望回报
- **Rf** = 无风险利率（通常 10 年国债）
- **βi** = 股票 i 相对市场的 Beta
- **E(Rm)** = 市场期望回报

**解读**：股票该给的回报 = 无风险利率 + Beta × 市场风险溢价。

**关键假设**：
- 投资者理性
- 信息完全
- 可以无限借贷
- 没有交易成本 / 税

**这些假设全部不成立** —— 但模型仍主导学术界 60 年。

## Beta 的精确含义

```
β = Cov(Ri, Rm) / Var(Rm)
```

**直观解读**：
- **β = 1**：股票和市场同步（涨 1% 股票涨 1%）
- **β > 1**：股票比市场更剧烈（涨 1% 股票涨 1.5%）→ "高 beta"
- **β < 1**：股票比市场温和
- **β < 0**：股票反向（罕见，黄金有时呈现）

**真实公司 beta**（历史 5 年）：
- 高 beta：Tesla 1.8、ARKK 1.6、Bitcoin proxies 2.0+
- 中 beta：SPY 1.0（定义）、AAPL 1.2、MSFT 1.1
- 低 beta：JNJ 0.6、KO 0.55（消费品）、公用事业 0.5
- 防御：黄金 ETF 0.1-0.3、TIPS 0.0

## Sharpe Ratio：风险调整回报

Sharpe 后来提出更实用的 **Sharpe Ratio**：

```
Sharpe Ratio = (Ra - Rf) / σa
```

- **Ra** = 策略 / 投资人的年化回报
- **Rf** = 无风险利率
- **σa** = 策略的标准差（波动）

**解读**：**每承担 1 单位波动获得多少超额回报**。

**评判基准**：
- **< 0.5**：差
- **0.5 - 1.0**：一般
- **1.0 - 2.0**：好
- **> 2.0**：很好
- **> 3.0**：异常（值得怀疑可能数据有误）

**真实样本**：
- S&P 500 长期 Sharpe ≈ 0.4-0.5
- Buffett 1965-2024 Sharpe ≈ 0.76（仅"好"水平，但绝对回报巨大）
- **Renaissance Medallion** 1988-2018 Sharpe ≈ **7+**（异常，史上最强量化基金）
- 多数对冲基金长期 Sharpe < 1

**为什么 Renaissance 这么高**？因为它本质是**高频统计套利** —— 大量小赢、极少大亏。

## Buffett 对 CAPM 的根本反对

Buffett 在 1984 哥伦比亚大学演讲 **"The Superinvestors of Graham-and-Doddsville"** 系统反驳了 CAPM 和"有效市场假说"。

他的核心论点：

> "**Volatility is not risk. Risk is the permanent loss of capital.**"

—— **波动不是风险。风险是永久性资本损失**。

**例子**：1973 年华盛顿邮报：
- 内在价值约 $400M
- 市场价 $80M（跌了 75%，"高波动"）
- CAPM 视角：**风险大，避开**
- Buffett 视角：**便宜，买入**——结果 16 年回报 50 倍

**CAPM 把"高波动 + 便宜价格"叫"风险大"——但 Buffett 视角它是低风险**（[[margin-of-safety]] 大）。

## Howard Marks 的更深批评

Howard Marks 在《The Most Important Thing》第 5 章：

> "**Risk cannot be measured. Future risk can only be observed in hindsight when it does or doesn't materialize.**"

—— **风险无法测量**。未来风险**只能事后观察**。

**Marks 的论点**：
- CAPM 用**过去波动**估算**未来风险**
- 但 [[1998-ltcm-collapse]] 证明：**没出现过的尾部事件**才是真风险
- **测量过去 = 错过未来**

## CAPM 的 5 个致命缺陷

### 1. 波动 ≠ 风险

如 Buffett / Marks 所说。**好股票被打折扣 = 高波动 = CAPM 说"高风险"** —— 反向真相。

### 2. Beta 是历史的，未来可能不同

某股票过去 5 年 beta 1.2 → 未来 5 年呢？没人知道。

[[1998-ltcm-collapse]] 用历史 beta + 相关性建模 → 俄罗斯违约让所有相关性跳到 1 → 模型完全失效。

### 3. 假设投资者理性

CAPM 假设所有人都是理性最大化者。
**实际**：[[loss-aversion]] / [[narrative-fallacy]] / [[social-proof]] 主导大多数决策。

### 4. 假设市场有效

[[mr-market]] 视角：市场**长期接近有效但短期严重失效**。
CAPM 假设"任何时点 = 有效"——错。

### 5. 忽略尾部风险

Sharpe Ratio 用标准差衡量波动 —— 假设**正态分布**。
**实际**：股市回报是 **fat tail**（[[power-law]] 视角）—— 极端事件远比正态分布预测频繁。

Taleb 2007《Black Swan》系统批评这一点：**Sharpe Ratio 在尾部事件出现前完美 → 然后基金归零**。

## Sortino Ratio：改进版

为对抗"波动 = 风险"的批评，Sortino 提出改进：

```
Sortino Ratio = (Ra - Rf) / σ_downside
```

只用**下行波动**——上行波动不算"风险"。

**这更接近 Buffett 视角**——他不在意"涨太多"，只在意"跌太多"。

但 Sortino 仍有 fat tail 问题。

## 实战应用：3 种使用方式

### 1. 比较基金经理

**Sharpe Ratio 是评估基金的标准工具**。

但要警觉：
- 短期高 Sharpe 可能是运气（LTCM 1996-1997 Sharpe 4+，然后 1998 归零）
- **20+ 年 Sharpe > 1** 才是真技能
- 比对**净费用后**（管理费 + 业绩费）

### 2. 仓位调整工具

**Risk Parity** 策略（桥水 All Weather 的核心）：
- 资产配置不按金额比例
- 按**风险贡献**比例
- 高 beta 资产配少
- 低 beta 资产配多 + 加杠杆

**让组合各资产风险贡献相等** —— 反 CAPM 但用 CAPM 工具实现。

### 3. 个股 beta 用于宏观对冲

如果你想 hedge 利率风险：
- 持有高 duration（高 beta）成长股
- 加上低 beta 防御资产 / 国债
- 让组合 beta 接近 1.0 或更低

**这是 [[antifragility]] 的 CAPM 实现**。

## 反面 / 边界

### 1. 学术工具 vs 实战工具

CAPM 是**学术语言** —— 在 MBA / quant 圈通用。
**实战投资人很少直接用** —— 但需要懂以**和机构对话 / 评估对手**。

### 2. Buffett 不用 CAPM ≠ CAPM 没用

Buffett 是**集中价值投资**——他的方法不需要 CAPM。
**机构组合管理**（养老金 / 主权基金）需要 CAPM 类工具做大规模分散。

不同场景用不同工具。

### 3. Beta 在重大事件可能反转

低 beta 股票"通常"防御 —— 但 2020 COVID 期间**所有股票 beta 跳到 1.5+**（流动性危机）。

**对策**：beta 是平时工具，危机时全失效。

### 4. Sharpe Ratio 对 fat tail 不敏感

任何 long-tail 风险策略：
- 短期 Sharpe 高
- 突发尾部 → 巨亏
- **历史 Sharpe 误导未来风险**

[[antifragility]] 的策略反过来：**短期 Sharpe 差，长期保护**。

### 5. 现代版 CAPM

学术界后续扩展：
- **Fama-French 3 因子模型**（市场 + 规模 + 价值）
- **Fama-French 5 因子模型**（加质量 + 投资）
- **Carhart 4 因子**（加动量）

**这些是 CAPM 的演化** —— 仍然有局限，但比纯 CAPM 更接近实际。

## 给投资者的启示（5 条）

1. **理解 CAPM / Sharpe 是 MBA 通用语言** —— 即使你不用也要懂以评估机构 / 对手。

2. **波动 ≠ 风险**（Buffett / Marks 论点）—— Sharpe Ratio 是工具不是真理。

3. **Beta 在危机时失效** —— 平时分散有效，恐慌时所有相关性跳到 1（[[2008-lehman-multidimensional]] / [[1998-ltcm-collapse]]）。

4. **Sortino Ratio > Sharpe** 因为只关注下行 —— 更接近 Buffett 视角。

5. **20+ 年 Sharpe > 1 才是真技能** —— 短期高 Sharpe 多是运气 + 隐藏的尾部风险。

## 相关

- [[margin-of-safety]] — Buffett 的"风险"定义和 CAPM 完全不同
- [[antifragility]] — Taleb 系统反 Sharpe 思维
- [[kelly-criterion]] — 仓位管理的另一套数学
- [[power-law]] — Fat tail 让 Sharpe 失效
- [[regression-to-the-mean]] — 高 Sharpe 大概率均值回归
- [[base-rates]] — 长期 Sharpe > 1 的基础概率
- [[mr-market]] — 市场短期失效 → CAPM 假设破裂
- [[loss-aversion]] — CAPM 假设理性 → 现实不符
- [[opportunity-cost]] — Sharpe Ratio 包含 Rf 是机会成本视角
- [[dalio-debt-cycles]] — 周期变化让 beta 失效
- [[1998-ltcm-collapse]] — Sharpe 4+ 然后归零的教科书
- [[2008-lehman-multidimensional]] — Beta + 相关性同时失效
- [[2003-amazon-buffett-miss]] — Beta 不告诉你长期价值
