---
title: 单位经济 Unit Economics — LTV/CAC，SaaS 投资真本领
slug: unit-economics
pillar: wisdom
tags: [unit-economics, ltv, cac, saas, payback, churn, gross-margin]
created: 2026-05-30
source: David Skok《SaaS Metrics 2.0》/ a16z / OpenView Partners SaaS Benchmarks / Bessemer Cloud Index
---

## 一句话

"单位经济" = 每单位（客户 / 订单 / 用户）**最终能赚多少钱**——SaaS / 订阅 / 消费类生意能否长期赚钱不取决于"营收增长"，**完全取决于单位经济**；理解 LTV、CAC、Payback Period、Gross Margin、Churn 这 5 个指标 + 它们的健康基准，是评估任何**现代订阅制公司**的核心能力，**也是为什么很多看起来"高速增长"的 SaaS 公司最终破产**。

## 为什么单位经济是核心

**传统财务指标**（EPS / 净利润 / FCF）对**早期高速增长公司**经常误导：

- Amazon 1997-2010 长期亏损 → 净利润视角 = 烂公司
- 但单位经济视角 = 健康（每个客户长期赚钱）

**对早期 SaaS / 订阅公司**，**单位经济决定一切**：

```
公司长期价值 = (单位 LTV - 单位 CAC) × 客户数 × 增长持续性
```

如果 LTV / CAC < 1 → **公司本质上亏损扩张** → 长期破产。
如果 LTV / CAC > 3 → **每个客户都赚钱** → 增长 = 价值创造。

**理解这个 = 区分"真好 SaaS"和"假好 SaaS"**。

## 5 个核心指标

### 1. CAC (Customer Acquisition Cost) 客户获取成本

```
CAC = 销售 + 市场费用 / 新客户数
```

**计算细节**：
- 通常按季度或年度计算
- 包含销售员工资 + 广告 + 营销活动 + CRM 工具等

**SaaS 行业基准**（按客户类型）：
- 自助式 SaaS（每月 $20-200）：CAC $50-500
- 中小企业 SaaS（每月 $200-2000）：CAC $1000-5000
- 企业 SaaS（每月 $5K+）：CAC $50K-500K

**警示**：CAC 持续增长 = 获客越来越难。

### 2. LTV (Lifetime Value) 客户终身价值

**最简公式**：
```
LTV = 月 ARPU × 毛利率 / 月流失率
```

- ARPU = Average Revenue Per User
- 毛利率 = 服务客户的毛利率
- 月流失率 = monthly churn

**示例**：
- ARPU $100/月
- 毛利率 80%
- 月流失率 2%（年化 ~21%）
- LTV = 100 × 0.8 / 0.02 = **$4,000**

**关键**：LTV 不是"客户付总额" —— 是"客户付的减去服务成本"。

### 3. LTV / CAC 比率

**最核心的单一指标**。

**基准**：
- **> 3**：健康（每 $1 获客投入产出 $3+ 终身价值）
- **1-3**：勉强
- **< 1**：**亏损扩张**——长期会破产

**警示**：很多"超高增长"SaaS 公司 LTV / CAC < 1 —— 它们靠不断融资生存。

### 4. CAC Payback Period 回收期

```
Payback = CAC / (月 ARPU × 毛利率)
```

**直观**：投入的 CAC 多少个月能从客户回收？

**基准**：
- **< 12 月**：优秀
- **12-18 月**：好
- **18-24 月**：勉强
- **> 24 月**：差

**经典样本**：
- Salesforce 早期：~18 月
- Zoom：~5 月（极快）
- 部分企业 SaaS：30+ 月（差）

### 5. Net Dollar Retention (NDR) 净留存率

```
NDR = (老客户当期 ARR) / (老客户去年 ARR)
```

包括：
- + Upsell（涨价 / 扩充）
- − Churn（流失）
- − Downgrade（降级）

**基准**：
- **> 130%**：极强（Snowflake、Datadog）
- **110-130%**：强
- **100-110%**：好
- **90-100%**：勉强
- **< 90%**：危险

**关键洞察**：**NDR > 100% = 即使不获新客户，公司也增长**。

NDR > 130% 的 SaaS 公司**复合增长能力极强**——这是 Bessemer 等顶级云投资人最看重的指标。

## "Rule of 40" — SaaS 估值的简化公式

```
Rule of 40 = 营收增长率 + EBITDA 利润率
```

**判断**：
- **> 40**：健康（可投资）
- **30-40**：勉强
- **< 30**：警示

**例子**：
- Snowflake：营收增 30% + 利润率 -10% = 20 → 警示（但因为长期增长强可能合理）
- Salesforce：营收增 15% + 利润率 25% = 40 → 健康
- 早期 Zoom：营收增 100%+ + 利润率 0% = 100+ → 异常优秀

**Rule of 40 = 早期增长 vs 利润的平衡测试**。

## 单位经济的 3 个深层洞察

### 洞察 1：增长不等于价值

**反直觉的真相**：**亏损增长可能摧毁价值**。

例：公司每年增长 50%，但每个客户 LTV < CAC：
- 客户越多亏得越多
- 增长越快烧钱越快
- 最终破产

**SoftBank Vision Fund 大量投资就是这种陷阱**（[[2019-wework-narrative-collapse]] 是极端样本）。

**好增长 = LTV/CAC > 3 + 高 NDR + 合理 Payback**。

### 洞察 2：Cohort 分析揭示真相

不要看**整体**指标——看 **cohort**（同期客户群）。

例：2020 Q1 获客的客户：
- 第 1 年留存 80%
- 第 2 年 65%
- 第 3 年 55%
- 第 4 年 50%

**cohort retention** 揭示**真实长期 churn**——比整体 churn 更准。

**a16z 反复强调**：cohort 分析是 SaaS 投资的灵魂。

### 3. 大客户 vs 小客户经济不同

**典型 SaaS**：
- 大客户：LTV $100K+、CAC $30K、payback 18 月
- 小客户：LTV $5K、CAC $500、payback 3 月

**不同客户群的单位经济不同**——评估时**分层分析**。

## 案例：Zoom 2019-2022 vs Peloton

### Zoom（健康单位经济）

2019 年 IPO 时：
- LTV / CAC ~7（极优）
- Payback ~5 月
- NDR 140%+
- Rule of 40 ~50

**疫情爆发 → 病毒式增长 + 已经健康单位经济**：
- 2020 营收增 4 倍
- 利润率从 0 升到 25%
- 股价从 $60 涨到 $560（9 倍）

**单位经济健康 → 增长 = 价值创造**。

### Peloton（不健康单位经济）

2019 年 IPO 时：
- 高获客（疫情红利）
- 但 CAC 持续上升
- 客户大量流失（订阅每月 $40，价格敏感）
- 硬件销售低毛利

**疫情结束后**：
- 客户大量流失
- CAC 越来越贵
- 公司爆亏
- 股价从 $170 跌到 $5（-97%）

**单位经济不健康 → 增长 = 价值摧毁**。

**两家公司同期增长爆发 → 5 年后命运完全相反——根因是单位经济**。

## 不同行业的单位经济基准

### 企业 SaaS

- LTV / CAC：5-10（优秀）
- Payback：12-18 月
- NDR：110-140%
- Gross Margin：75-85%

### 中小企业 SaaS

- LTV / CAC：3-5
- Payback：18-24 月
- NDR：100-115%
- Gross Margin：70-80%

### 消费订阅（Netflix, Spotify）

- LTV / CAC：1.5-3（较低但量大）
- Payback：12-18 月
- NDR：100-105%
- Gross Margin：50-70%

### 消费产品（Peloton, Allbirds）

- 没有"recurring"模型
- LTV 接近一次销售
- 单位经济通常较差

### Marketplace（Airbnb, Etsy）

- 不同 economics（take rate × volume）
- Network effects 让 CAC 随时间下降

## 警示信号：单位经济恶化的 5 个标志

### 1. CAC 持续增长

季度 CAC 比同期 +20% → 警示。
可能原因：竞争加剧、获客渠道饱和、产品差异化下降。

### 2. NDR 持续下降

NDR 从 130% 降到 110% 再降到 100% → 严重警示。
表示客户开始流失 / 不愿涨价。

### 3. Payback Period 延长

从 12 月延到 18 月再延到 24 月 → 商业模式恶化。

### 4. "Adjusted" 指标盛行

如果公司大量使用"adjusted CAC""adjusted LTV""community-adjusted"——
**红旗**（[[2019-wework-narrative-collapse]] 警示）。

### 5. 客户集中度上升

如果新增 ARR 大部分来自少数大客户——脆弱。
分散客户基础才健康。

## 评估 SaaS 公司的 5 步框架

### 步骤 1：找指标

- 公司投资者关系页面
- 季度报告（Q1/Q2/Q3/Q4）
- 公司"投资者日"演讲
- 第三方分析（Bessemer Cloud Index）

### 步骤 2：计算核心比率

- LTV / CAC
- Payback Period
- NDR
- Rule of 40

### 步骤 3：看 3 年趋势

任何**单一时点**不够——看**趋势**：
- 改善 → 好
- 恶化 → 警示
- 稳定 → 中性

### 步骤 4：和同行对比

不同 SaaS 行业有不同基准——和**同类**公司对比。

### 步骤 5：用 Cohort 验证

如果公司公布 cohort 数据 → 验证整体指标。
如果不公布 → 警示（可能想隐藏）。

## AI 时代的单位经济变化

LLM / AI 正在改变 SaaS 单位经济：

### 改善方向

- **CAC 下降**：AI 营销让获客更精准
- **Churn 下降**：AI 改善产品 → 客户更黏
- **Upsell 上升**：AI 让上销售更容易

### 恶化方向

- **替代品出现**：OpenAI 直接发布产品挤压 SaaS 应用
- **客户预算重新分配**：客户钱去 AI 工具，可能削减传统 SaaS
- **价格压力**：客户对 SaaS 价格更敏感

**评估任何 SaaS 公司时问**：AI 让它的单位经济**变好还是变坏**？

## 反面 / 边界

### 1. 早期阶段指标不可靠

公司 < 100 客户时单位经济波动巨大——不要从 1 个季度数据下结论。

### 2. 不同商业模式不可直接比

企业 SaaS vs 消费订阅 vs marketplace 完全不同结构——用对的基准。

### 3. 短期可以"buy growth"

公司可以**短期亏损扩张**——只要单位经济长期健康，最终会盈利。

Amazon 是经典样本（[[2003-amazon-buffett-miss]]）。

### 4. 创始人粉饰指标

公司可以**改变定义**让指标好看：
- 包含 / 排除 SBC 影响 CAC
- 不同的 churn 定义
- "调整后"指标

**对策**：读 footnotes + 怀疑 - 不要相信任何"调整后"指标。

### 5. 单位经济好 ≠ 投资回报好

**估值仍然重要**。一家 LTV/CAC 5 的优秀 SaaS 如果 PS 30 倍——可能未来跑输。

[[margin-of-safety]] 仍然适用。

## 给投资者的启示（5 条）

1. **SaaS 投资必看 5 个指标**：LTV/CAC、Payback、NDR、Rule of 40、Gross Margin。

2. **NDR > 130% = 强力指标** —— Snowflake / Datadog 这类公司值得溢价。

3. **Cohort 分析揭示真相** —— 整体指标可能误导。

4. **"调整后"指标是红旗** —— [[goodharts-law]] 视角，被瞄准的指标都会被游戏化。

5. **单位经济好 + 合理估值 + 长期视角 = 真投资机会** —— 三者缺一不可。

## 相关

- [[free-cash-flow-deep]] — 单位经济决定长期 FCF
- [[roic-roe-roa-deep]] — 健康单位经济 → 长期高 ROIC
- [[pricing-power]] — NDR 是定价权的现代指标
- [[helmer-7-powers]] — 单位经济反映 power 强度
- [[5-types-of-moats]] — 转换成本 = 高 NDR
- [[network-effects]] — 网络效应让 CAC 随时间下降
- [[goodharts-law]] — "Adjusted" 指标被广泛游戏化
- [[base-rates]] — SaaS 行业基准对比
- [[ai-investment-thesis]] — AI 改变单位经济
- [[time-arbitrage]] — 长期单位经济视角
- [[circle-of-competence]] — 不懂 SaaS 模型就别投
- [[2003-amazon-buffett-miss]] — Amazon 长期亏损但单位经济健康
- [[2019-wework-narrative-collapse]] — WeWork 单位经济灾难
- [[2014-ethereum-ico-mania]] — 大多数 Web3 应用单位经济不可持续
