# 研究纪律与受托边界复核

日期：2026-09-27。五课正文和题目完整阅读，保持第一版范围。

## 选定计算

独立脚本 `verify-research-ethics-2026-09-27.py` 使用精确分数与最终舍入，不导入应用公式或个人数据，52 项检查通过。

| 章节 | 检查范围 |
| --- | --- |
| research-ethics-bias | 独立全无效试验的家族错误率、被选规则条件真假、两种费用基数 |
| entrusted-capital-mandate | 六个月和全年现金门槛、按期付款滚动、股票跌价及短债提前出售缺口 |
| conflicts-personal-trading-allocation | 返佣、订单比例、逐档价格分配、数量及总成本守恒、客户间120成本转移 |
| research-evidence-record-correction | CFO/FCF、维持资本开支遗漏、永续价值、每股及报价相对修正价值的溢价 |
| performance-presentation-survivorship | 两账户毛/费后、主动收益、复合收益、相同端点下Dietz近似与两种精确TWR |

金额、概率、付款、费率和交易均为课内模拟，不是实际客户安排。算术通过不证明合规、授权或能力。

## 修订

- **全无效试验的条件概率。**原文正确区分64.2%的家族错误率与后验，却漏说题目已经明确所有规则无效。因此一旦选出规则，其为假的条件概率是100%；现实真假未知时才需要先验、检验能力与筛选过程。补清正文和答案，题目改为 `q7-v2`，使其需重新作答，保留旧答案及笔记。
- **费率基数。**正文的6.92%例子明确年末扣期末资产1%，与现有练习条件一致；若按期初资产扣1%，单期则为7%，不能混用。
- **GIPS合规与验证。**删去将外部验证写成合规必备条件的概括，说明必须满足全部适用要求，而独立验证受鼓励、并非必需，也不保证某个具体组合或报告的准确性。采用现行手册支持，未将归档问答当现行规则。
- **终止账户的期间。**补清GIPS 3.A.9的最后完整计量期间及裁量权条件，保留本课年末结束账户的算例，不把简化全年例子直接套给中途关闭账户。

## 实际核对的官方段落

- [GIPS现行机构手册](https://www.gipsstandards.org/standards/gips-standards-for-firms/gips-standards-handbook-for-firms/)：3.A.9的终止账户、1.A.39及4.C.1相关讨论的验证选择与范围，以及未独立验证机构的合规声明示例。只核指定段落，未执行完整GIPS检查。
- [GIPS验证机构标准概述](https://www.gipsstandards.org/standards/gips-standards-for-verifiers/)：独立验证的目的、机构范围与推荐地位。问答4915为2013–2019归档材料，仅用于定位，未作为本轮现行规则证据。
- [CFA III(D)](https://www.cfainstitute.org/standards/professionals/code-ethics-standards/standards-of-practice-iii-d)：公平、准确、完整，以及终止账户、模拟业绩和毛/净口径的披露。
- [CFA VI(A)](https://www.cfainstitute.org/standards/professionals/code-ethics-standards/standards-of-practice-vi-a)及[VI(B)](https://www.cfainstitute.org/standards/professionals/code-ethics-standards/standards-of-practice-vi-b)：具体冲突、显著易懂的披露、客户交易优先、家庭客户账户应公平对待。
- [CFA III(C)](https://www.cfainstitute.org/standards/professionals/code-ethics-standards/standards-of-practice-iii-c)：投资政策、期限、流动性、税与法律约束；区分顾问关系与仅执行指示等角色。
- [CFA V(C)](https://www.cfainstitute.org/standards/professionals/code-ethics-standards/standards-of-practice-v-c)：研究和决策记录；无监管或机构政策时建议至少七年。本课程继续要求实际期限按适用规则核查。
- [CFA V(B)](https://www.cfainstitute.org/standards/professionals/code-ethics-standards/standards-of-practice-v-b)：事实与意见分开，费用、风险及模型局限的沟通。该来源不单独规定课程所有更正场景的法定通知程序。
- [SEC客户资产托管公告](https://www.sec.gov/files/investor/alerts/bulletincustody.htm)：其定义的SEC注册顾问、资产控制、合格托管及客户直接对账。公告为2013年的历史说明，不作为全部现行规则或其他司法辖区的结论。

## 验证结果与范围

应用测试12/12通过；加载121课、910题、30案例。测试包括通用的修订题重新作答和旧记录保留，另通过实际内容加载确认本题 `q7-v2`、三个完整选项及正确解释。

本轮只改Markdown和QA，没有重复构建或浏览器测试。所在地法律、具体合同、完整现行监管变更、真实客户运营以及未见作品仍需按课程实作关口核查。本记录只证明上列阅读、计算和来源段落的范围。
