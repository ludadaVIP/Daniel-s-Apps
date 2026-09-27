# 组合管理收尾复核 · 2026-09-27

## 范围

完整阅读组合与风险单元八课的正文、练习与解析：portfolio-policy-risk、portfolio-math-performance、capm-factor-skepticism、client-ips-loss-budget、factor-risk-decomposition、portfolio-tail-stress-loss、portfolio-performance-attribution-benchmark、tax-aware-rebalancing-liquidity。以下证据支持列明的算例和来源段落，不代表所有投资事实、历史案例或真实交易已完成审计。

## 修订

- 单项仓位预算改为“其他持仓不变”的情景条件；损失乘法不需要统计独立假设。
- IPS 的股票上限用精确 50/3 万，最低减持用 70/3 万。显示 23.33 万不能直接作为最低成交额，否则仍超损失预算 20 美元。忽略税费且可精确到美分时，最低减持为 233,333.34 美元；整股等执行约束仍须另算。q9-v2 明确询问显示约数，q7 解析补清精确边界。
- 压力卖债补现金的计算保留 50/0.95 万完整精度。实际只卖显示数 52.63 万会少筹 15 美元；美分口径最低市值为 526,315.79 美元。正文和 q6-v2 区分完整账本与显示舍入。
- 绩效 q5-v2 指定同币种、同期间基准以及相对基准新增费用，才使用 0.3−0.8 的简化超额计算。
- 现金流处理引用改为现行 GIPS 手册；4886 问答标为 Archived，生效范围为 2013–2019，不能将该历史问答作为现行规则的唯一依据。

修订题使用新 ID，旧学习答案及笔记保留。选中选项即时判题的交互保持现有实现。

## 独立复算

`verify-portfolio-management-2026-09-27.py` 不导入应用计算代码，使用 Fraction 与 40 位 Decimal，96 项检查通过：

- 再平衡与取款顺序、组合方差、几何收益、TWR/MWR 和 Modified Dietz 日期权重；
- 零债务 beta 条件下的去杠杆/加杠杆，以及四点回归、残差和 df=2 置信区间；
- IPS 付款、共同损失、同一交易满足多条约束，以及美分边界两侧反例；
- Euler 分量、负风险贡献和有限权重变更；因子方差及额外联合冲击；
- 压力后的折价变现、付款账本、离散 ES 与三个约束的共同可行上限；
- Brinson 单期归因、两种累计链接的精确加总和几何相对收益；
- 税费后资产分母与精确再平衡交易额。

此前 `euler-risk-contribution-review-2026-09-27.md` 的有限差分检查和 `tail-risk-review-2026-09-27.md` 的两种离散 ES 算法属于先前证据，本次未将其重复计入 96 项。

## 原始来源核查

- [GIPS 官方现行手册](https://www.gipsstandards.org/standards/gips-standards-for-firms/gips-standards-handbook-for-firms/)：已读外部现金流处理、Modified Dietz 的日初/日末权重、近似局限及大额现金流分段估值与几何链接相关段落。遵从涉及完整要求，教学算例不能证明 GIPS 遵从。
- [GIPS 4886 历史问答](https://www.gipsstandards.org/qadatabase/4886/)：已读归档日期及现金流估值回答，用于识别版本，正文已替换引用。
- [NYU Bottom-up Betas 问答](https://pages.stern.nyu.edu/~adamodar/New_Home_Page/TenQs/TenQsBottomupBetas.htm)：已读问题 8 的 D/E、税率及债务 beta 条件，核对本课使用简化公式的边界。
- [CFA 2026 真实约束资产配置公开摘要](https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/asset-allocation-with-real-world-constraints)：已读税款、分配、税费再平衡及复核触发条件的公开段落；未声称读取受限全文。
- [CFA Performance Attribution 文献综述](https://rpc.cfainstitute.org/sites/default/files/-/media/documents/book/rf-lit-review/2019/rflr-performance-attribution.pdf)：检索到 Brinson 相关段落，公式图形的文本解析并不完整，因此本次累计链接证据采用独立代数恒等式复算，未将 PDF 文本提取视为逐公式审读证明。

## 应用与交付

最终加载维持 121 课、910 题、30 案例。12 项应用测试通过，生产构建通过。本轮只修改教材文字与题目条件，没有重新执行界面测试；即时答题、持久化、移动阅读及作品导出已有先前 QA 的实际界面证据。真实账户的税费、最小交易单位、成交量、结算和授权仍需用实际账户资料核验。
