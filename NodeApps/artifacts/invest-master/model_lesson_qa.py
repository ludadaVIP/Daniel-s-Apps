"""Check recently deepened lessons on desktop and mobile."""

import os

from playwright.sync_api import sync_playwright


BASE = os.environ.get('INVEST_MASTER_BASE', 'http://127.0.0.1:5788')
LESSONS = (
    ('damodaran-growth-reinvestment', '增长、再投资与 ROIC', '120.1392', 1, 5),
    ('damodaran-valuation-audit', '达摩达兰：估值审计、终值与每股价值桥', '1,333.33', 1, 7),
    ('damodaran-original-young-firm-survival', '达摩达兰原著精读：初创估值、生存与稀释', '1.4286', 2, 7),
    ('growth-and-price', '林奇：成长与估值一起看', '265.73', 1, 7),
    ('equity-cash-flow-value', '股票估值：从企业现金流到每股价值', 'FCFE = FCFF', 1, 7),
    ('reverse-valuation-multiples', '反向估值', '16.60%', 1, 5),
    ('credit-underwriting', '给债券做信用研究', '不得再减一次利息', 0, 5),
    ('risk-cycle', '周期中的风险预算', '至少 65', 0, 5),
    ('safety-margin', '安全边际的边界', '45.45%', 1, 5),
    ('derivatives-payoffs', '看懂远期、期货和期权', '9,500', 1, 6),
    ('hedging-basis-margin', '对冲不是消除风险', '70,000', 1, 6),
    ('option-parity-no-arbitrage', '期权平价与无套利', '10.1658', 1, 6),
    ('sampling-confidence-intervals', '抽样、置信区间与预测误差', '−1.05', 1, 6),
    ('capm-factor-skepticism', 'Beta、CAPM 与因子模型', '0.775', 1, 6),
    ('factor-risk-decomposition', '因子风险分解', '−27.6%', 1, 6),
    ('fisher-scuttlebutt-method', '费雪：把企业访谈变成可检验的证据链', '12.925', 2, 6),
    ('from-store-to-stock', '林奇：生活发现只是起点', '63.5', 1, 7),
    ('fisher-growth-quality', '费雪：成长质量、研发效率与增量回报', '30.33/1.1²', 1, 7),
    ('fisher-original-fifteen-points-evidence', '费雪原著精读：十五点的证据交叉验证', '≈8.66', 1, 6),
    ('second-level-lesson', '马克斯：价格已经知道什么', '46.7%', 1, 7),
    ('incentives-lesson', '芒格：激励与机会成本', '80−70−8−5=−3', 1, 6),
    ('bogle-investor-return', '博格尔：投资者真实收益与可坚持的政策', '先跌 20% 后涨 20%', 0, 6),
    ('bogle-index-construction', '博格尔：指数是什么，不是什么', '109.4806', 1, 6),
    ('bogle-original-cost-matters', '博格尔原著精读：费用算术与长期财富差', '92.78', 1, 6),
    ('inflation-linked-bonds', '通胀保值债券：实际收益与名义现金流', '1101.20', 1, 6),
    ('alternatives-liquidity', '另类资产：结构、估值与流动性', 'DPI=25/90', 2, 6),
    ('dalio-credit-mechanics', '达里奥：从交易、信用到债务支付链', '110', 2, 6),
    ('dalio-deleveraging-policy', '达里奥：去杠杆的四条路径与政策边界', '80/40=200%', 1, 6),
    ('dalio-original-debt-balance-sheets', '达里奥原著精读：债务周期的资产负债桥', '净贷款＋现金 20', 1, 6),
    ('price-and-value', '格雷厄姆：投资与投机', '40/33.33−1', 1, 6),
    ('capital-allocation-return', '资本配置：增长、并购、还债与回购', '10.44', 1, 6),
    ('acquisition-synergy-bid-ceiling', '并购协同与出价上限：好公司也可能买得太贵', '423.55', 1, 6),
    ('spot-curve-bootstrapping', '即期曲线自举：从市场债价拆出各期贴现率', '0.837653', 1, 6),
    ('floating-rate-reset-margin', '浮息债与重定价：利率风险变小，信用风险仍在', '96.42', 1, 6),
    ('debt-maturity-financing-fit', '债务期限与融资选择：让负债现金流匹配资产', '25.28', 2, 6),
)

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    for label, width, height in [('desktop', 1440, 900), ('mobile', 390, 844)]:
        page = browser.new_page(viewport={'width': width, 'height': height})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        for lesson_id, title, calculation, minimum_tables, question_count in LESSONS:
            page.goto(f'{BASE}/#/app/invest-master/read/{lesson_id}', wait_until='domcontentloaded')
            page.locator('h1').filter(has_text=title).wait_for(timeout=20000)
            prose = page.locator('.im-prose').first
            assert calculation in prose.inner_text(), lesson_id
            assert prose.locator('table').count() >= minimum_tables, lesson_id
            assert page.locator('.im-quiz-question').count() == question_count, lesson_id
            assert not page.evaluate('document.querySelector(".im-main").scrollWidth > document.querySelector(".im-main").clientWidth'), lesson_id
        page.goto(f'{BASE}/#/app/invest-master/read/fisher-scuttlebutt-method', wait_until='domcontentloaded')
        first_question = page.locator('.im-quiz-question').first
        first_question.locator('.im-quiz-options button').first.click()
        first_question.locator('.im-quiz-feedback').wait_for(timeout=5000)
        assert page.locator('.im-quiz button').filter(has_text='提交答案').count() == 0
        assert not errors, errors
        print(label, 'deepened lessons, arithmetic text, instant quiz feedback and width OK')
        page.close()
    browser.close()
