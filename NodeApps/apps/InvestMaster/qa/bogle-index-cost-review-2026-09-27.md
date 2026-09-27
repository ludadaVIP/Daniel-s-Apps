# 博格尔路线收尾复核 · 2026-09-27

## 已阅读及修订

完整阅读博格尔四课及人物页。修订人物页及三课，不增加课程或题目。

- 人物页 100 万、近似净年回报 6.9%/5.9%、20 年的终值应为约 379.8/314.7 万，差约 65.1 万；原低费终值 380.4 与差额 65.7 不正确，已修正。
- 市场算术课明确按期初本金扣除年度成本影响的教学简化口径，不能误称精确按年末余额计费。
- 市场算术及原著课将跟踪误差从可直接扣减的费用清单分离。指数课解释跟踪差异与跟踪误差，增加原有课程中的三年度观测反例：固定落后可以零标准差，均值为零的偏离仍可波动。累计差额须复利，不能用年度差均值代替。
- 指数课将“保证什么”改为“直接投资目标”，ETF 成交回报例题明确无现金分红；原著课把总体算术的同一市场、穿透及避免重复计数条件写入题干。三道修订题为 `q2-v2`、`q6-v2`、`q1-v2`，旧答卷和笔记保留，新题须重答。
- 博格尔人物页漏列第四课；顺查其他人物发现九份同类关联元数据不完整，已补齐现有课程 ID。十一人物的 `lessons` 集合现与全部 `lesson.master` 反向关联一致。`App.jsx` 原本按 `master` 字段自动展示完整路线，因此此次是元数据修复，不宣称此前界面隐藏课程。

## 本次实际读取的原始支持

| 资料 | 阅读位置 | 支持范围 |
| --- | --- | --- |
| [Bogle，The Relentless Rules of Humble Arithmetic](https://boglecenter.net/wp-content/uploads/FAJ-Relentless-Rules-11-05.pdf) | PDF 第 1–4 页；2005 年文章 | 总体费用算术、复利和基金/投资者收益口径。本文是由会议演讲发展而来的文章，教材算例为另设模拟，未复核原文所有历史表格 |
| [Vanguard，About indexing](https://corporate.vanguard.com/content/corporatesite/us/en/corp/about-indexing.html) | 指数基金定义、规则、载体与风险部分 | 跟踪是目标；ETF 成交可能偏离净值；指数与投资工具区别。未把页面现行营销数据当作历史证据 |
| [Vanguard，Index tracking](https://www.vanguard.ca/en/tools-and-resources/etf-fundamentals/management/index-tracking) | Tracking difference / Tracking error 与影响因素部分 | 同期收益差、年化标准差及费用影响。本文的三年度样本是独立教学反例，不使用页面示例的正态覆盖率推断 |
| [Vanguard，Principles for Investing Success](https://corporate.vanguard.com/content/dam/corp/research/pdf/vanguards_principles_for_investing_success.pdf) | PDF 第 18、22–23 页纪律与再平衡部分 | 目标复核、维持配置与支出计划。未将其建议阈值当作所有客户适用规则 |

页码按 PDF 文件页序。指定 CFA 学习大纲链接仅是主题入口；本次不以它证明全课程度。人物生卒年和全部历史背景未作新增逐项审计。

## 独立核算与应用检查

`verify-bogle-index-cost-2026-09-27.py` 独立使用有理数及高精度小数，不读取应用公式或个人账户，**51 项检查通过**：市场子组配平、费用与存续者偏差、20/30 年复利、年金逐笔求和、指数权重与集中度、成交价回报、跟踪差标准差、年化 IRR/TWR、提款路径与支付准备。

12 项应用测试通过。当前加载 121 课、910 题、30 案例；十一人物的关联元数据完整。此轮仅修改教材及元数据，沿用前轮已通过构建及实际界面测试，无新增界面验证声明。

上述证据不证明全部大师思想、全部历史事实与学习者能力均已验收。真实未见研究、模型文件和独立审读仍是达到优秀本科能力目标的证据。
