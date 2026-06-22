---
title: 02 · 税务地图：PIE、PIR、FIF、W-8BEN、遗产税
slug: tax-map
section: 新西兰税务
order: 20
level: 入门到进阶
tags: [PIE, PIR, FIF, W-8BEN, 遗产税]
one_line: NZ 端看 PIE/PIR/FIF，美国端看 W-8BEN、预扣税和 estate tax。
---

# 新西兰投资税务地图

## 一句话

人在新西兰投资海外资产，绕不开两条线：**NZ 端的 PIE/PIR/FIF，美国端的 W-8BEN/预扣税/遗产税**。

## PIE 和 PIR

**PIE** 是新西兰常见投资基金税务结构。**PIR** 是 PIE 用来计算你投资收入税的税率。

根据 IRD 页面，新西兰税务居民个人常见 PIR 为：

- 10.5%
- 17.5%
- 28%

重点：

- 你需要给 PIE 正确 PIR。
- 如果 PIR 给错，可能年底还要补税。
- PIR 不是自己随便选，要按 IRD 规则基于过去两年收入判断。

资料：

- IRD PIE/PIR: https://www.ird.govt.nz/income-tax/income-tax-for-individuals/types-of-individual-income/portfolio-investment-entity-income-for-individuals/nz-residents
- IRD Find your PIR: https://www.ird.govt.nz/income-tax/income-tax-for-individuals/types-of-individual-income/portfolio-investment-entity-income-for-individuals/prescribed-investor-rates/find-my-prescribed-investor-rate

## FIF

**FIF** 是 Foreign Investment Fund。新西兰税务居民持有海外公司、海外基金、海外 ETF 等，可能要按 FIF 规则计算应税收入。

常见情境：

- 你直接通过 IBKR 买 VOO/VTI/VT。
- 你通过平台买美国上市 ETF。
- 你持有非新西兰基金或海外公司股份。

IRD 列出的 FIF 计算方法包括 FDR、CV、cost method、DRR、RAM、AFI 等。入门先知道：

| 方法 | 入门理解 |
| --- | --- |
| FDR | 常见口径是围绕期初市值的 5% 计算 FIF income |
| CV | 更接近年初年末价值变化加分配，但规则要细看 |

资料：

- IRD FIF: https://www.ird.govt.nz/foreign-investment-funds
- IRD FIF exemptions: https://www.ird.govt.nz/income-tax/income-tax-for-businesses-and-organisations/types-of-business-income/foreign-investment-funds-fifs/foreign-investment-fund-rules-exemptions

## FIF 门槛：50,000 与 100,000 的口径

截至 2026-06-22，公开资料存在更新时间差：

- IRD 一些现有页面仍写：个人海外 FIF interests 成本低于 NZ$50,000，可不按 FIF 计算。
- IRD Tax Policy 2026 资料显示：政府将 FIF de minimis threshold 从 NZ$50,000 提高到 NZ$100,000，适用于 2026-27 税年起。

实务处理：

1. 不只看一篇网页。
2. 投入大额资金前，让税务师确认你当前税年适用门槛。
3. 保存买入成本、汇率、日期、持仓报表。

资料：

- IRD Tax Policy 2026 FIF changes: https://www.taxpolicy.ird.govt.nz/-/media/project/ir/tp/publications/2026/is-foreign-investment-fund.pdf

## W-8BEN

**W-8BEN** 是美国 IRS 表格。非美国个人通过券商持有美国证券时，通常需要向券商提交，用于证明你是 foreign person，并在适用时申请税收协定下的预扣税率。

IBKR 的说明里提到 W-8 表格通常要在券商处保持有效，并需每三年更新；如果无有效 W-8，可能按 30% 预扣。

资料：

- IRS W-8BEN: https://www.irs.gov/forms-pubs/about-form-w-8-ben
- IBKR W-8 information: https://www.interactivebrokers.com/en/support/tax-nonus-initial.php

## 美国遗产税

IRS 页面说明，非美国居民且非美国公民，如果死亡时美国 situs assets 超过 US$60,000，executor 可能需要提交 Form 706-NA。IRS FAQ 也列出 U.S. marketable securities 可属于 U.S.-situated gross estate。

对新西兰投资者的含义：

- 直接持有美国股票/美国 ETF，不只涉及股息预扣税，还要考虑死亡后的 estate tax/继承处理。
- 这不代表你一定会交很多税，但代表大额持有前必须问专业人士。
- NZ PIE 基金、爱尔兰 UCITS ETF、美国 ETF 等结构在税务和继承上可能不同，不能只比较管理费。

资料：

- IRS estate tax threshold: https://www.irs.gov/individuals/international-taxpayers/some-nonresidents-with-us-assets-must-file-estate-tax-returns
- IRS estate tax FAQ: https://www.irs.gov/businesses/small-businesses-self-employed/frequently-asked-questions-on-estate-taxes-for-nonresidents-not-citizens-of-the-united-states

## 给税务师的问题

- 我当前是 NZ tax resident 吗？有没有 transitional resident 规则？
- 2026-27 税年，我的 FIF de minimis threshold 按多少执行？
- 我直接持有美国 ETF 和买 NZ PIE 全球基金，税务差异是什么？
- 我的 PIR 应该是多少？
- 我的海外股息预扣税能否抵免？怎么记录？
- 如果我通过 IBKR 直接持有超过 US$60,000 的美国 ETF，estate tax 风险如何处理？

