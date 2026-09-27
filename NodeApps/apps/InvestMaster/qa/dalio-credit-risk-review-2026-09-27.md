# 达里奥路线收尾复核 · 2026-09-27

## 范围与修订

完整阅读人物页与四课：信用支付链、去杠杆政策、风险平衡、原著债务资产负债桥。保持 121 课、910 题、30 案例。

- 人物页的 DSCR 明确使用尚未支付本息、已经扣除必要经营投入的可偿债现金；不能再从已经付息的 CFO 重复扣利息。
- 信用课明确教学现金与 BIS 宏观收入口径不同。清除“可用现金已扣经营成本、下一段却再扣工资原料税”的矛盾。对应偿付率题升级为 `q2-v2`，旧记录保留，修订题重新作答。
- 全年压力 CFO 80 的年度缺口是 120；若本金第二季度末到期且现金均匀产生，到期日缺口为 130。尚未取得的下半年现金不能用于上半年付款。
- 汇率报价 5 本币/美元升至 6，美元债务的本币成本上升 20%，本币美元价值下跌约 16.67%。本币美元价值确实下降 20% 时，报价为 6.25、债务本币成本上升 25%。原著课原来 30→36 的“贬值20%”例改为 30→37.5；36 仅适用于本币/外币报价上涨20%。
- 去杠杆四杠杆的财政例子标明是教学场景，原著转移涵盖更广的资金与信用转移。减记表述改为借款人本金减免、债权人资产减值，避免误写先前经济损失发生在借款人账上再转给银行。

## 原始资料核对

本轮读取以下指定段落，未据此宣称整本书或全部历史事实已审计：

1. [Bridgewater · Principles for Navigating Big Debt Crises](https://www.bridgewater.com/big-debt-crises/principles-for-navigating-big-debt-crises-by-ray-dalio.pdf)：下载 PDF、读取文件第12页四种杠杆及分配影响段落；支持课程框架分类，不证明具体模拟数字或当前政策预测。
2. [BIS · How much income is used for debt payments?](https://www.bis.org/publications/qr-201509/how-much-income-used-debt-payments-new-database-debt-service-ratios)：定义与数据输入段落，GDI 已扣利息所以加回，非金融企业另加可调整股息；总体还本负担的估计与单个企业合同不同。本文没有把所有宏观统计收入等同 CFO。
3. [Bank of England · Money creation in the modern economy](https://www.bankofengland.co.uk/-/media/boe/files/quarterly-bulletin/2014/money-creation-in-the-modern-economy.pdf)：摘要与文件第7页贷款偿还、存款变化段落，以及文件第6页跨行准备金与资本、流动性限制的相关文字。支持银行支付链及放贷约束；银行贷款不是凭空创造借款人净财富。
4. [Bridgewater · The All Weather Story](https://www.bridgewater.com/research-and-insights/the-all-weather-story)：2012年文中 Balancing and Risk-adjusting Assets、Balancing Growth and Inflation 相关段落。支持资金与风险权重不同、增长和通胀意外的组织框架。文章中的策略宣传、收益确定性及四情景等概率表述没有被作为课程保证。

经济机器视频未观看，不把页面存在记为完成视频核验；Fed 与 CFA 的一般入口也不当作具体算例证明。教学数值由下述独立复算支持。

## 验证结果

- `verify-dalio-credit-risk-2026-09-27.py`：89 项独立检查通过。采用有理数复算现金日期、倒数汇率、方差贡献、银行准备与核销、抵押贷款限制和付款储备；波动率用 Decimal 平方根再按显示精度核对。
- 协方差检验涵盖零、正、负相关及贡献配平；负贡献不是债券没有价格风险。杠杆压力净资产73，无外部现金须卖债12而非6；额外出售折让2%的独立反例须卖12.5，该反例只用于复算边界，不新增课程篇幅。
- 应用12项测试全部通过；加载仍为121课、910题、30案例，修订题选项完整且答案索引有效。
- 本轮只修改 Markdown 和 QA，未改交互代码、未操作真实学习数据库；即时点选、移动阅读与导出沿用此前实际界面验收记录。本轮没有重复运行界面测试或生产构建。

## 交付判断

达里奥路线本次指定算例与表述已收好。真实历史危机的全部事实、其他人物的全部原文支持以及读者未见资料上的独立研究表现，仍按第一阶段验收矩阵分别记录。算术通过、课程数量和作者模拟答卷均不能证明学习者已达到优秀本科能力。
