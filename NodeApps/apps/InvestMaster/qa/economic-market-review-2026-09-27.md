# 经济与市场六课：报价方向、时点与现金桥复核

日期：2026-09-27。六课正文及题目完整阅读。范围为本单元，不代替所有大师宏观课、真实案例或全领域数据审计。

## 独立计算

脚本 `verify-economic-market-2026-09-27.py` 使用精确分数及最终舍入，不导入应用公式或读取个人学习数据，146 项检查通过。

| 章节 | 选定计算 |
| --- | --- |
| macro-transmission | 通胀购买力、久期、无风险与利差的净效应、股权现金/折现率的顺序分解 |
| market-orders-costs | 逐档买卖、均价及现金损失、部分成交、债券净价/应计/费用、同基准净超额 |
| fx-real-return | 币种转换、实际回报、企业收入成本、无套利远期、违约回收不足后的固定交付 |
| supply-demand-industry-equilibrium | 出清和税楔、弹性、明确非负低产量边际成本后的福利、贡献份额、统一定价最优和价量识别反例 |
| balance-of-payments-exchange-rate | CA/FA、IIP存量、互为倒数的汇率涨跌、统计差异符号 |
| monetary-policy-bank-credit-transmission | 半年与全年重定价、净息差/利润/现金/资产负债、CET1与RWA、增资后的贷款和分红联立约束 |

模型中的税率、资本和现金底线、供需曲线、汇率与成交簿均为教学条件，不是现实预测或监管标准。

## 修订

1. **本币贬值百分比。**每美元报价1.50→1.65上涨10%，但本币按美元计价下降 `1.50/1.65−1≈9.09%`。原题正确选项写“本币按该报价贬值10%”容易混淆，改为明确的两种报价，并改题号 `q4-v2`。宏观现金练习也明确“每单位外币的本币报价上涨10%”，保留净外币流入30对应增加3的原算例。
2. **国际收支版本。**现有BPM7链接是白皮预编辑版，标签如实说明；正文沿用BPM6常见名称以读历史表，新增与earned income、transfer income、statistical discrepancy的版本对应。新手册发布不代表各国已同步采用。
3. **统计差异。**明示 `SD=FA−(CA+KA)`，新增CA−30、KA0、FA−28时SD+2的小桥；不能把差异填入出口或储备来假装配平，也不能称为额外现金。
4. **重定价时段。**500贷款/1000存款的独立银行例子补清60%贷款从年初起全年适用新利率。否则仅知道“本年重定价”不足以算收入增加6；正文已有的半年例子继续区分实际发生与下一年运行速率。
5. **超额与总收益。**交易课原题将“策略收益1%”直接称“毛优势”，改为相对同风险基准的毛超额及新增成本口径，题号 `q5-v2`。1%−1.5%=−0.5%只在题设简化与匹配口径下成立。

两题保持正确选项位置，但需要重新作答；旧答案和笔记保留，点选即时解析方式保留。

## 来源实际核对范围

- [IMF BPM7白皮预编辑版](https://data.imf.org/-/media/iData/External-Storage/Documents/5B776E0E552E4881AF24042EAE7D049B/en/1-BPM7-White-Cover.pdf)：2.25–2.28（PDF58–59页）的统计差异及存量桥；8.3–8.6（346页）的金融账户净借贷及资产/负债；12.8（463页）与13.1–13.3（510页）的收入名称；9.7（363页）的估值变化。页数以PDF第一页为1，不是印刷页码。只查这些段落，未阅读1076页全文。
- [CFA汇率课程公开说明](https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/currency-exchange-rates-understanding-equilibrium-value)：报价、国际平价与全额套保的理想条件、预测限制。未访问完整付费课程。
- [联储货币政策传导说明](https://www.federalreserve.gov/faqs/money_12856.htm)：融资成本、总体金融条件与就业/通胀的间接且有时滞关系。它不能证明单家公司或长债的确定方向。
- [SEC订单类型说明](https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders)：市价不锁价、限价的边界、止损触发转市价。课内静态盘口不来自真实订单。
- [OpenStax 9.2](https://openstax.org/books/principles-microeconomics-3e/pages/9-2-how-a-profit-maximizing-monopoly-chooses-output-and-price)与[3.2](https://openstax.org/books/principles-microeconomics-3e/pages/3-2-shifts-in-demand-and-supply-for-goods-and-services)：边际收益/成本与需求移位和沿曲线移动的区别。所有线性曲线、福利补充条件及现金数字由教材独立构造。
- [FDIC收益审查5.1](https://www.fdic.gov/system/files/2024-06/section5-1.pdf)：PDF第2页的净息差平均生息资产分母与税收等价口径；网页解析报内部错误后，用Python读取官方PDF该页确认，没有把读取错误当来源失效。

IMF发布实施页面本轮返回403，不能作为已核对的实施时间证据。本轮不重验BLS盲题公告、真实宏观时序或其他未列来源；不把链接可读当全部主张已有原文支持。

## 验证与学习关口

146 项独立检查、12/12应用测试通过；加载仍121课、910题、30案例。实际内容加载确认两道v2题的完整选项、正确索引与解释，通用旧记录保留测试通过。

本轮仅修改Markdown和QA，没有重复生产构建或浏览器测试。相关真实资料、事前预期、执行价格与未见实作仍按学习指南验收，算术正确不证明具有可靠宏观预测能力。
