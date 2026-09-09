---
title: 凯利公式 — Buffett、Munger、Soros、Thorp 私下都用的仓位数学
slug: kelly-criterion
pillar: foundations
tags: [仓位管理, kelly, thorp, position-sizing, 复利最大化]
created: 2026-05-30
source: John Kelly 1956 Bell Labs 论文 / Edward Thorp《A Man for All Markets》/ William Poundstone《Fortune's Formula》/ Buffett 2008 听证会
---

## 一句话

你每次下注应该投资本的多少？**1956 年贝尔实验室的 John Kelly 给出了数学最优解**——长期最大化复利增长率的最优仓位 = (赔率 × 胜率 − 失败率) / 赔率；这是 Buffett、Munger、Thorp、Soros 私下都在用的仓位数学，**也是散户最该学但最少学的工具**。

## 历史起点：1956 年的贝尔实验室

John L. Kelly Jr. 1956 年在贝尔实验室研究信息论时发现一个数学问题：

**问题**：一个赌徒有内幕信息（电报里传的赛马结果），但信道有噪音——内幕不是 100% 可信。**他每次应该押注本金的多少**？

Kelly 的答案不是直觉的"全押"或"小心一点"——是一个精确数学公式：

```
f* = (b × p − q) / b
```

其中：
- **f*** = 最优下注比例（占总资本）
- **b** = 净赔率（赢能拿到的倍数）
- **p** = 胜率
- **q** = 失败率 = 1 − p

**关键证明**：长期最大化**几何均值**（也就是复利增长率）的下注比例**唯一**就是这个 f*。

- 押得少 → 复利速度慢
- 押得多 → 波动太大 → 破产概率上升 → 长期复利反而下降
- 押 f* → **数学上证明最优**

## 一个具体例子

抛硬币游戏：
- 正面赢 2 元（赔率 2:1）
- 反面输 1 元
- 你认为正面概率 60%（你有信息优势）

Kelly 公式：
- b = 2, p = 0.6, q = 0.4
- f* = (2 × 0.6 − 0.4) / 2 = 0.8 / 2 = **40%**

**最优下注 = 40% 本金**。这听起来很激进——确实是。

实战中常用"半凯利"或"四分之一凯利"（即 20% 或 10%），因为：
- 概率估计有误差（你以为 60% 实际可能 55%）
- 心理上承受不了全凯利的波动
- "半凯利" 仍能获得 75% 的全凯利复利速度，但波动小很多

## Edward Thorp：第一个把凯利搬上市场

Thorp 是 MIT 教授（21 点 / 算牌的发明者），1969 年创立 Princeton-Newport Partners 对冲基金。

**Thorp 是凯利公式的真实战实战代言人**：
- 1969-2002 33 年年化 **19.1%**（费后净）
- **从未有过亏损年**
- 同期 S&P 500 年化 ~10%

他的核心方法：**对每一笔套利机会用凯利公式严格仓位管理**。这就是他几十年从未爆仓的根本。

> "**Most investors take on too much risk and too little risk in the wrong ways.**" — Thorp

## Buffett 在 2008 听证会上的暗示

LTCM 救助听证会上 Buffett 公开作证（[[1998-ltcm-collapse]]）：

> "You ought to have a list of 20 things in your lifetime where you should have used the maximum amount of capital you had at that time and you should make a list of 20 of those mistakes if you didn't act on them. **I might add this to that list**—we ought to use big punches when we have big edges."

—— 翻译："**有 edge 时下大注，没 edge 时不下注**。"

这就是 Kelly 公式的哲学翻译版。Buffett 历史上几次大仓位：
- See's Candies 1972: ~30% Berkshire 总资产
- Coca-Cola 1988-1994: ~26%
- Apple 2018-2022 巅峰: ~40%

**这些仓位规模对应高 confidence（高胜率 + 高赔率）**——典型的"凯利时刻"。

## 散户最该学的 4 个 Kelly 应用

### 1. 单一标的仓位上限

公式：
```
最大仓位 = min(凯利公式结果, 集中度上限)
```

实操：
- 即使最高 confidence 标的，单一持仓 ≤ 20%
- 中等 confidence ≤ 5-10%
- 低 confidence 或圈外 ≤ 1-2%

### 2. BTC 等高波动资产的仓位

[[bitcoin-as-hard-money]] 的 Kelly 思考：
- 你认为 BTC 5 年 +200% 概率 60%
- 你认为 BTC 5 年 −50% 概率 40%
- 全凯利 = (2 × 0.6 − 0.4) / 2 = 40% **（疯狂）**
- 半凯利 = 20%
- 四分之一凯利 = **10%**（合理）
- 实际建议 1-5%（更保守，承认概率估计不准）

### 3. 集中持仓 vs 分散

凯利公式回答"集中度"问题：
- 你真的有 edge 的标的：集中
- 你没有 edge 的标的：不投
- 中间状态：分散到指数基金

这就是 Buffett "**diversification is protection against ignorance**" 的数学背景。

### 4. 杠杆使用

Kelly 公式也告诉你**什么时候用杠杆 = 全凯利 > 100%**：
- 极少见
- 即使出现也建议用半凯利 = 50% 仓位（不用杠杆）
- LTCM ([[1998-ltcm-collapse]]) 用 30 倍杠杆 = 远超凯利极限 → 必然爆仓

## 反面 / 边界（凯利的 5 个陷阱）

### 1. 概率必须已知

Kelly 假设 p 和 b 是已知的。**投资里它们都是估计**。
- 估计错 5% → 凯利结果错 30%+
- 因此实战中必须用 **保守凯利**（半或四分之一）

### 2. 连续下注假设

Kelly 数学要求"无限次相同概率分布的下注"。**投资里你可能只下注几次**。
- 单次下注不一定遵循凯利
- 但**多次下注的累积**接近凯利预测

### 3. 不对称分布

Kelly 假设清晰的"赢/输"二元结果。**实际投资是连续分布**——你可能赚 50%、赔 30%、不动等。

需要广义 Kelly：
```
f* ≈ 期望收益 / 方差
```

这就是 Sharpe Ratio 思维的雏形。

### 4. 心理承受能力

全凯利的波动是数学最优，但**人类心理承受不了**。Thorp 自己用 "fractional Kelly"——他承认即使是数学天才也无法承受全凯利。

### 5. 黑天鹅 / fat tails

Kelly 假设概率分布稳定。**在 fat tails 世界（金融市场）**，极端事件比正态分布预测的频繁——Kelly 仓位会被极端事件击穿。

[[1998-ltcm-collapse]] 是 Kelly 公式无法预测的反例——他们的"概率"基于历史数据，但俄罗斯违约把分布尾部移动了。

## 一个 Bill Gross 的"全军覆没"反例

Bill Gross（PIMCO 前债券王）2015 年从 PIMCO 离开后到 Janus，**没有严格用 Kelly**，重仓押注利率走向。

- 2018 大幅押注 Bunds 利率上升 → 错
- 单一头寸损失 $2 亿
- 个人资产折损 ~30%

**这告诉我们**：即使顶级专家，违反 Kelly 仓位纪律也会被惩罚。**Kelly 不是为了"赚多少"，是为了"不爆仓"**。

## Munger 的话

Munger 多次在 Berkshire 年会上说：

> "**If you have a clearly identified edge, you should bet heavily. Otherwise, you should not bet at all.**"

这就是 Kelly 哲学的非数学版本。

## 给投资者的启示（5 条）

1. **理解凯利数学，实战用半凯利或四分之一**——全凯利在人类心理下不可执行。

2. **没有 edge 就不下注 = Kelly 的核心**。不要因为"有钱在账户里"就乱投——闲置现金的机会成本 < 错误下注的实际损失（[[opportunity-cost]]）。

3. **集中度反映 confidence**——Apple 占 Berkshire 40% 是 Buffett 对 Apple confidence 极高的体现，不是冒险。

4. **杠杆几乎永远超过凯利极限**——这就是 [[1998-ltcm-collapse]] 教训。**任何用 5 倍以上杠杆的策略都已经在凯利之外**。

5. **凯利公式 + 反演 = 最强组合**——用 [[inversion]] 检查"全凯利 50% 仓位时，亏损 50% 我能接受吗"——如果不能就该用半凯利。

## 相关

- [[margin-of-safety]] — Kelly 是仓位的安全边际数学
- [[opportunity-cost]] — 不下注 vs 下注的选择
- [[power-of-compounding]] — Kelly 最大化的是几何均值（复利速度）
- [[loss-aversion]] — Kelly 公式不考虑损失厌恶心理
- [[circle-of-competence]] — 圈外没有 edge → Kelly 公式 = 0
- [[inversion]] — 反演检查 Kelly 仓位的最坏情况
- [[base-rates]] — Kelly 的 p 输入需要基础概率
- [[1998-ltcm-collapse]] — 远超凯利极限的样本
- [[1972-sees-candies]] — Buffett 高 confidence 时的高仓位
- [[2016-apple-buffett-pivot]] — 现代 Kelly 时刻
