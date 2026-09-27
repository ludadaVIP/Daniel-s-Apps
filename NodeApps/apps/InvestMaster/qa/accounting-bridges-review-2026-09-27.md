# 财报与会计单元：现金、税款和权益桥复核

日期：2026-09-27。保持第一版范围，不新增章节或测验。

## 阅读与计算覆盖

八课正文及题目完整阅读。独立脚本 `verify-accounting-bridges-2026-09-27.py` 用精确分数复算、统一舍入；91 项断言通过。不导入应用公式、不使用个人笔记或真实账户数据。

| 章节 | 选定计算覆盖 |
| --- | --- |
| accounting-quality | 报告 CFO160、时点敏感性95、维持支出后55 |
| working-capital-accounting | 两年 NWC90→115→130、CFO85/75、预收压力、周转及应收原值/准备/净额 |
| balance-sheet-adjustments | 两期租赁负债、利息、折旧及现金总额；收购 NPV |
| deferred-tax-economic-value | 税亏到期、资产消耗与现金税、节税现值、暂时差异回转及税率重估 |
| consolidation-minority-interest | 合并资产配平、内部利润两路消除、上下游利润归属、归母经济权益桥 |
| revenue-recognition-contracts | 折价分配、六个月履约、合同负债、净利润及直接/间接现金双路径 |
| pensions-share-compensation | 义务、计划资产、净负债、损益、OCI、公司缴款及旧负担估值双路径 |
| three-statement-forecast-reconciliation | 直接收付款与间接法、资本/债务/权益滚动、派息后资产负债平衡 |

## 修订及理由

1. **DPO 分母。**原课程统一用销售成本，未充分解释采购额代理条件。保留88.72天的既有算例和正确选项，但明确“销售成本代理采购额”。另给严格条件下的纯商品贸易反例：赊购380，采购口径DPO55.23、CCC91.78，实际供应商付款365；制造成本、现金采购和非现金库存变动需另调。
2. **应收原值与净额。**新增同一赊销100、收款20、信用损失10的小账本。净利润90＋损失10−原值增加80，或净利润90−净额增加70，都得CFO20；混搭会虚报30。解释真实核销与并购等条件不能省略。
3. **递延税确认位置。**题干新增“全部计入损益”条件。若10的负债增加中4进入OCI，损益递延税只为6，不能仍直接加10。该题改为 `q6-v2`，保留旧答案及笔记，需要重新作答。
4. **收入与应收。**修正“确认收入但没收款就形成应收”的概括，明确无条件收款权与尚依赖履约的权利不同，后续既有合同算例保持原金额。
5. **准则版本。**三表课补IFRS18采用日期、间接法起点及分类需要随适用版本核对。IAS12/IAS19原链接本轮跳转登录或读取失败，替换为能公开读取的官方2021版，来源明确标历史版；保留官网当前准则入口。
6. **舍入。**第二年租赁折旧加利息的完整精度为9.77324263，四位显示应为9.7732，原9.7733来自已舍入分项相加。第一年10.2268，两年20。
7. 财报质量课修正一句重复措辞为“把结构性问题说成暂时性的”。

## 来源实际核对范围

- [IAS7 官方概述](https://www.ifrs.org/issued-standards/list-of-standards/ias-7-statement-of-cash-flows/)：经营/投资/融资、直接与间接法、非现金调整及IFRS18对现金流列报的修订。
- [IFRS18 官方概述](https://www.ifrs.org/issued-standards/list-of-standards/ifrs-18-presentation-and-disclosure-in-financial-statements/)：2027年1月1日或以后开始的年度期间、允许提前采用、取代IAS1。
- [IAS12 2021官方原文](https://www.ifrs.org/content/dam/ifrs/publications/pdf-standards/english/2021/issued/part-a/ias-12-income-taxes.pdf)：34–36（PDF17–18页）、53（25页）及58/61A（26–27页），核对税亏证据、不折现及损益外确认。这不是完整现行准则核查。
- [IAS19 2021官方原文](https://www.ifrs.org/content/dam/ifrs/publications/pdf-standards/english/2021/issued/part-a/ias-19-employee-benefits.pdf)：120–130（35–37页），核对服务/净利息/重新计量分类及实际回报与净利息部分的差额。
- [IFRS10 2021官方原文](https://www.ifrs.org/content/dam/ifrs/publications/pdf-standards/english/2021/issued/part-a/ifrs-10-consolidated-financial-statements.pdf)：B86（47页），核对内部交易和未实现利润全额消除；[当前概述](https://www.ifrs.org/issued-standards/list-of-standards/ifrs-10-consolidated-financial-statements/)核对控制及单一经济实体。
- [IFRS15 官方概述](https://www.ifrs.org/issued-standards/list-of-standards/ifrs-15-revenue-from-contracts-with-customers/)：五步法、相对独立售价及控制权；[2021官方原文](https://www.ifrs.org/content/dam/ifrs/publications/pdf-standards/english/2021/issued/part-a/ifrs-15-revenue-from-contracts-with-customers.pdf)107（29页），核对无条件收款权。网页解析两次失败后，用Python读取官方PDF指定页确认，不把读取失败误判为主张错误。
- [IFRS2](https://www.ifrs.org/issued-standards/list-of-standards/ifrs-2-share-based-payment/)与[IFRS3](https://www.ifrs.org/issued-standards/list-of-standards/ifrs-3-business-combinations/)官方概述：股份支付的报表影响、收购确认和商誉分配。

采购/准备的小账本及全部新数值均为原创模拟；上述来源不提供这些数据或证明真实公司的收款质量。该复核不替代特殊合同、所有现行准则变更及真实跨行业三表实作。

## 验证记录

应用测试12/12通过；最终内容加载仍121课、910题、30案例。正文与题干修订未修改UI；本轮未重复构建或浏览器测试，先前记录另见相关QA。学习者须按学习指南完成未见公司研究及独立审读，不能由91项算术断言推定已掌握。
