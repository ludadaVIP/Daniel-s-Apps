---
title: 古德哈特定律 Goodhart's Law — 指标变成目标就不再是好指标
slug: goodharts-law
pillar: foundations
origin_field: 经济学 (Charles Goodhart 1975)
tags: [goodhart, kpi, 衡量, 目标, perverse-incentive]
created: 2026-05-30
source: Charles Goodhart 1975 论文 / Marilyn Strathern 1997 简化版 / Donella Meadows《Thinking in Systems》/ 现代 KPI 研究综述
---

## 一句话

英国经济学家 Charles Goodhart 1975 年提出：**"当一个指标变成目标，它就不再是好指标"** —— 因为人会**优化指标本身**而不是它代表的真实目标；这是 Cobra Effect 的孪生概念，**也是为什么 Munger 反复警告"小心 KPI"、为什么季度 EPS-driven CEO 会摧毁长期价值、为什么"AAA 评级"在 2008 前完全失效**。

## Goodhart 的原始定理（1975）

Charles Goodhart（伦敦政经学院 / 英格兰银行经济学家）1975 年发表关于**货币政策**的论文，里面有句话被后人简化成"Goodhart's Law"。

**Goodhart 的原句**（关于英格兰银行用某个货币供应指标）：

> "**Any observed statistical regularity will tend to collapse once pressure is placed upon it for control purposes.**"

—— **任何观察到的统计规律，一旦被用作控制目的，就会崩溃**。

**1997 年 Marilyn Strathern**（人类学家）把它简化成更流行的版本：

> "**When a measure becomes a target, it ceases to be a good measure.**"

—— **当一个指标变成目标，它就不再是好指标**。

这就是今天广泛流传的 Goodhart's Law。

## 为什么这条定律成立

3 个机制：

### 1. 人会"游戏" the metric

一旦某指标决定奖惩，**人会找最便宜的方式提升该指标**——即使损害真目标。

[[cobra-effect]] 的具体表现：
- 衡量蛇数量 → 养蛇
- 衡量钉子重量 → 做大钉子
- 衡量代码行数 → 写冗余代码

### 2. 真实信号被噪音掩盖

衡量某事的指标**本来反映**真实情况——但一旦被瞄准，**人会专门优化该指标的"表面值"**而非真实情况。

例：学生考试分数本来反映学习——但**考试导向教学**让学生学会"考试技巧"而非真知识。

### 3. 系统适应

复杂系统会**适应**任何强加的指标——找到最小阻力路径绕过。

[[reflexivity]] 视角：指标改变行为，行为改变系统，系统改变指标含义。

## 经典样本

### 1. AAA 评级（2008 前）

[[2008-lehman-multidimensional]] 的核心机制：

**原始目的**：信用评级让投资者快速识别低风险债券。

**评级机构激励**：
- 给 AAA → 业务继续
- 给 BBB → 客户流失

**结果**：
- 80%+ 次贷 MBS 被评 AAA
- AAA 标签**不再代表真实低风险**
- 评级"指标"被瞄准 → 失去信号价值

**这是 Goodhart's Law 在金融业的极端样本**。

### 2. 季度 EPS 增长

美股大量 CEO 把"季度 EPS 增长"作为最重要 KPI：

**结果**：
- 股票回购 inflated EPS（不增长真实利润）
- 削减 R&D（短期 EPS 上涨）
- 推迟必要 capex（短期 EPS 上涨）
- 会计游戏（一次性损益分类）

**Buffett 反复警告**："**EPS 是观点，现金流是事实**"——他在拒绝 EPS 这个**已经被瞄准而失效**的指标。

### 3. 学校测试分数

美国 "**No Child Left Behind**" 政策（2001）让学校根据**学生测试分数**获得拨款：

**结果**：
- 教师"教考试"（不教真知识）
- 学校开除可能拉低分数的学生
- 部分学校**伪造成绩**
- 测试分数**不再反映**真实教育质量

**学生离开学校后在工作中暴露**——但太晚了。

### 4. SaaS 公司的 ARR

很多 SaaS 公司把 "**ARR (Annual Recurring Revenue) 增长**" 作为核心指标：

**结果**：
- 大幅折扣换取签约 → ARR 高但 LTV 低
- 强行包装"长期合同"（实际客户随时取消）
- 包含一次性服务费当作"recurring"

**ARR 指标被瞄准 → 不再反映真实长期收入**。

[[2019-wework-narrative-collapse]] 的"Community-Adjusted EBITDA" 是极端样本。

### 5. 加密项目的 TVL

DeFi 项目用 "Total Value Locked" 衡量成功：

**结果**：
- 项目方"挖矿激励"短期推高 TVL
- 真实经济用户少
- TVL 高但**几乎所有都是"套利者"**——激励消失后 TVL 暴跌

[[2022-luna-terra-collapse]] 的 Anchor 是极端：**$17B TVL 80% 是套利者**——LUNA 崩盘时全部撤离。

## Goodhart's Law 在投资判断的应用

### 1. 警觉"被瞄准的指标"

任何**被广泛用作 KPI** 的指标都可能失效：
- EPS
- ROIC（部分公司游戏化）
- 营收增长（可能用回扣换取）
- 用户数（可能造假）

**Buffett 看公司用 "Owner Earnings"（[[dcf-owner-earnings]]）部分原因是这是个**未被瞄准**的指标——CEO 不能直接操纵。

### 2. 寻找"不被瞄准"的真实指标

什么指标**难以游戏化**？
- **自由现金流**（很难造假，需要真实现金）
- **客户留存率**（长期信号）
- **NPS 净推荐值**（独立调查）
- **员工留存率**（CEO 难以操纵）
- **复购频率**（真实满意度）

**这些指标因为没被普遍 KPI 化所以仍然有信号价值**。

### 3. CEO 薪酬包警示

如果 CEO 薪酬挂钩**单一指标** → 警觉 Goodhart's Law：
- 挂钩股价 → 短期操纵
- 挂钩 EPS → 财务工程
- 挂钩营收 → 客户质量妥协

**Berkshire 的子公司 CEO 薪酬不挂钩单一指标**——综合判断 + 个性化。这是反 Goodhart 设计。

### 4. 评估指标"年龄"

**新指标信号最强**——还没被瞄准。
**老指标信号最弱**——已被普遍游戏化。

例：
- 1980s "ROE > 15%" 强信号
- 2024 "ROE > 15%" 弱信号（被普遍优化，包括杠杆游戏）

**好投资人不断寻找新的、还没被瞄准的指标**。

## 反 Goodhart 的设计原则

如何设计**不被游戏化**的指标系统？

### 1. 多指标平衡

不依赖单一指标——**5-10 个互相约束**的指标。

例：
- EPS 增长（短期）
- 自由现金流（中期）
- ROIC（资本效率）
- 客户留存（长期质量）
- 员工流失率（文化健康）

游戏化任一项都会**伤害其他项** → 自我约束。

### 2. 定性 + 定量结合

加入**人为判断**——不能完全机械化。

**Berkshire 模式**：Buffett 个人判断 + 客观数据 = 反 Goodhart。

### 3. 频繁更换指标

如果某指标显示被游戏化迹象 → **换新指标**。

**问题**：员工抵抗 + 缺乏稳定性。

### 4. 隐藏指标

某些情况下**不公开**实际衡量标准——让人无法定向优化。

风险：缺乏透明性。

### 5. 衡量"过程"而非"结果"

某些情况下**过程指标**比结果指标更难游戏化：
- "决策日志质量" > "投资回报"
- "代码 review 严格度" > "bug 数量"
- "客户深度沟通时间" > "客户满意度评分"

## 投资者个人的 Goodhart 风险

**你自己也可能 Goodhart 化**：

### 1. "年回报 20%"目标

- 你设定该目标
- 接近年底如果回报低 → 你**承担过度风险**追赶
- 反向 cobra effect

**对策**：目标用"决策质量"（[[decision-vs-outcome]]）—— 过程指标。

### 2. "每月发现 1 个机会"

- 你强迫自己找机会
- 强行投资低质量标的
- 结果：长期跑输

**对策**：接受**长期无所事事**——Buffett 经常一年不投资。

### 3. "胜率 70%"

- 你追求高胜率
- 选择"小赚高频"标的
- 但**大亏单次**抹平多次小赚

**对策**：用 [[kelly-criterion]] 视角——关注**期望值 + 仓位**，不是胜率。

## 反面 / 边界

### 1. 没有指标也不行

完全不用指标 = 无法管理。

**对策**：用指标 + 警觉 Goodhart。

### 2. 短期指标有时有用

季度 EPS 不全错——它确实**部分**反映经营状况。

**对策**：把多个指标结合看，不依赖单一。

### 3. 真实目标难衡量

很多真实目标（如"客户幸福"、"长期价值"）**很难量化** → 必须用代理指标。

**对策**：用**多个**代理指标 + 接受测量不完美。

### 4. 不同时间维度

短期 vs 长期指标可能冲突。Goodhart 对长期更严重。

**对策**：清楚区分时间维度，长期指标更需要反 Goodhart 设计。

### 5. 部分 Goodhart 可接受

某些 Goodhart effect 影响小 → 可以接受。

**对策**：评估 cost-benefit——不要追求完美。

## 给投资者的启示（5 条）

1. **警觉"被瞄准的指标"** —— EPS / ARR / TVL 都已被广泛游戏化，信号价值有限。

2. **寻找"不被瞄准"的指标** —— 自由现金流 / 留存率 / 员工流失率仍有信号。

3. **CEO 薪酬挂钩单一 KPI → 警示** —— Berkshire 不这样做有道理。

4. **自己投资目标用过程指标** —— 不是"年回报 20%"，是"每个决策有 thesis + pre-mortem"。

5. **指标年龄越老信号越弱** —— 持续寻找新的、还未被普遍优化的指标。

## 相关

- [[cobra-effect]] — Goodhart 的孪生概念
- [[incentives]] — KPI 是激励的具体化
- [[hanlons-razor]] — KPI 失效是蠢 + 激励错位，不是恶意
- [[second-order-thinking]] — 反 Goodhart 需要二阶以上
- [[reflexivity]] — 指标被瞄准后通过反身性失效
- [[dcf-owner-earnings]] — Owner Earnings 是反 Goodhart 指标
- [[base-rates]] — 用基础概率检验指标信号
- [[lollapalooza]] — 多指标系统对抗 Goodhart
- [[decision-vs-outcome]] — 个人投资的反 Goodhart 设计
- [[asymmetric-information]] — Goodhart 加剧信息不对称
- [[2008-lehman-multidimensional]] — AAA 评级的 Goodhart 失败
- [[2019-wework-narrative-collapse]] — Community-Adjusted EBITDA 的 Goodhart
- [[2022-luna-terra-collapse]] — TVL 的 Goodhart
