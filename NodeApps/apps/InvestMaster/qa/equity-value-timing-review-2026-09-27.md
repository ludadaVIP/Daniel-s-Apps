# 股票估值单元：现金时点、再投资与每股桥复核

日期：2026-09-27。第一版收束前修订，不增加课程或题数。

## 阅读与数值覆盖

八节正文和题目完整阅读。独立脚本 `verify-equity-value-2026-09-27.py` 用 Fraction 计算、Decimal 统一舍入，60 项检查通过；未调用应用公式或个人数据库。

| 章节 ID | 本轮选定数值检查 |
| --- | --- |
| equity-cash-flow-value | NI/CFO/FCFF/FCFE 双路径、偿债缺口、稀释、非控制权益及三年 DCF |
| reverse-valuation-multiples | 永续反推、转轨再投资、报价隐含新增 ROIC |
| three-stage-dcf-terminal-value | WACC 与增长九格联动；R 等于资本成本时的增长价值抵消 |
| industry-structure-competitive-advantage | 有限期现金与经济利润现值勾稽、期末资本回收压力 |
| customer-unit-economics-retention | 单客几何现值、首两笔现值、周年分群回款、付款前资金低点 |
| financial-institution-equity-valuation | 清洁盈余分红模型、资本与现金约束同时满足的分配上限 |
| comparable-company-multiple-audit | 经营价值到普通股权桥、非控制权益及现金流倍数排序 |
| probability-valuation-terminal-stress | 三路径完整 DCF、每股桥、概率加权与报价打平阈值 |

## 修订

1. 客户分群原先把“第 0 年初获客”的首笔回款写为“第 1 年末”，与单客一年后回款模型不一致。改为 t=0、t=1、t=2 周年检查点，每批一年后首次回款；同一检查点先付新群 CAC、随后收旧群贡献。累计净流出 53.6、付款时低点 76、可用 60 时缺口 16 保留，并明确付款顺序。首笔贡献 80 是给定输入；80% 条件续存从首笔之后开始，流失后不重新激活。
2. 反向估值：第 2 年末投资为第 3 年的 3% 增长提供资本，第 2 年利润仍增长 8%。股数单位统一为 100 百万股。
3. 情景价值相对买价的 44.44% 和 17.30% 改为今日模型价值压力差额。只有实际按对应价格出售，才可计算该笔出售亏损；继续持有的现金回报需另列分配、卖价及日期。
4. 三年 DCF 总值应为 799.291617→799.29，原 799.28 是先舍入分项再相加；终值现值 663.303639→663.30，原 663.31 亦修正。计算用未舍入数据，展示再舍入。

客户时点两题和情景压力一题改为 `q6-v2`、`q7-v2`、`q4-v2`，要求重新作答；不删除旧答案或笔记，不改变答案索引或题数。

## 一手来源定向核对

- [CFA Institute 2026 Free Cash Flow Valuation](https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/free-cash-flow-valuation)：公开 Summary 的 FCFF/FCFE、CFO/EBIT 桥、资本成本匹配、多阶段现金及非经营资产分别估值公式段落。
- [NYU Fundamental Determinants of Growth](https://pages.stern.nyu.edu/adamodar/New_Home_Page/valquestions/growth.htm)：经营利润增长、稳定回报及平均/边际回报段落，核对增长与再投资的假设关系。
- [NYU Excess Returns and Terminal Value](https://pages.stern.nyu.edu/~adamodar/New_Home_Page/valquestions/termvalueexreturns.htm)：稳定期投入随增长改变。网页一处文字把零增值条件误写为资本回报等于增长率；其后推导设的是资本回报等于资本成本。本章与九格复算采用后者，不照抄该句。

分群日历与价值路径是课程自设模拟，不是来源中的实证数据。核对限于上述段落与选定算例，未声称每项现实业务判断均完成外部原文认证。

## 应用验证与交付边界

最终应用测试 12/12、生产构建通过；加载保持 121 课、910 题、30 案例。即时点击解析代码未修改。本轮只改 Markdown，未重复浏览器操作；先前桌面、390px 阅读、即时解析、持久化及作品下载记录保留于相关 QA。

第一版按用户要求收束，学习顺序及四阶段关口见 `content/STUDY_GUIDE.md`。五项毕业作品检验学习效果；课程交付、来源复核范围与学习者实际能力分别记录。
