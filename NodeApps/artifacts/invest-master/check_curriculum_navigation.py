import os
from playwright.sync_api import sync_playwright

ROOT = os.environ.get('IM_ROOT', 'http://127.0.0.1:5788/#/app/invest-master/')

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    for label, width, height in [('desktop', 1440, 900), ('mobile', 390, 844)]:
        page = browser.new_page(viewport={'width': width, 'height': height})
        page.emulate_media(reduced_motion='reduce')
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(ROOT + 'path', wait_until='domcontentloaded')
        page.locator('.im-roadmap').wait_for(timeout=20000)
        lesson_count = page.locator('.im-lesson-row').count()
        assert lesson_count == 120, f'{label}: expected 120, got {lesson_count}; body={page.locator("body").inner_text()[:300]}'
        units = page.locator('.im-roadmap-heading h2').all_inner_texts()
        assert units.index('毕业研究') > units.index('斯文森路线')
        page.goto(ROOT + 'read/berkshire-textile')
        page.locator('.im-prose').wait_for(timeout=20000)
        assert page.locator('h1').inner_text().startswith('Berkshire 纺织')
        assert page.locator('.im-prose').inner_text().__contains__('163,122')
        toc = page.locator('.im-toc button') if label == 'desktop' else page.locator('.im-mobile-toc button')
        assert toc.count() >= 5
        assert page.locator('.im-master-lessons button').count() >= 1
        page.goto(ROOT + 'read/intrinsic-value')
        page.locator('.im-prose').wait_for(timeout=20000)
        assert page.locator('.im-master-lessons button').count() >= 1
        page.goto(ROOT + 'read/integrated-research-capstone')
        page.locator('.im-prose').wait_for(timeout=20000)
        assert page.locator('.im-quiz-question').count() == 8
        assert '1500' in page.locator('.im-note-actions').inner_text().replace(',', '')
        page.goto(ROOT + 'read/monte-carlo-scenario-decisions')
        page.locator('.im-prose').wait_for(timeout=20000)
        assert 'seed = 20260925' in page.locator('.im-prose').inner_text()
        assert page.locator('.im-quiz-question').count() == 5
        page.goto(ROOT + 'read/securitization-cash-flow-waterfall')
        page.locator('.im-prose').wait_for(timeout=20000)
        assert '本金损失怎样穿透' in page.locator('.im-prose').inner_text()
        assert page.locator('.im-quiz-question').count() == 5
        page.goto(ROOT + 'read/portfolio-tail-stress-loss')
        page.locator('.im-prose').wait_for(timeout=20000)
        assert '逆向压力测试' in page.locator('.im-prose').inner_text()
        assert page.locator('.im-quiz-question').count() == 5
        page.goto(ROOT + 'read/portfolio-performance-attribution-benchmark')
        page.locator('.im-prose').wait_for(timeout=20000)
        assert 'Brinson' in page.locator('.im-prose').inner_text()
        assert page.locator('.im-quiz-question').count() == 5
        page.goto(ROOT + 'read/three-statement-forecast-reconciliation')
        page.locator('.im-prose').wait_for(timeout=20000)
        assert '资产=负债+权益' in page.locator('.im-prose').inner_text()
        assert page.locator('.im-quiz-question').count() == 5
        page.goto(ROOT + 'read/financial-institution-equity-valuation')
        page.locator('.im-prose').wait_for(timeout=20000)
        assert '监管资本' in page.locator('.im-prose').inner_text()
        assert page.locator('.im-quiz-question').count() == 5
        page.goto(ROOT + 'read/swaps-clearing-counterparty-risk')
        page.locator('.im-prose').wait_for(timeout=20000)
        assert '初始保证金' in page.locator('.im-prose').inner_text()
        assert page.locator('.im-quiz-question').count() == 5
        page.goto(ROOT + 'read/performance-presentation-survivorship')
        page.locator('.im-prose').wait_for(timeout=20000)
        assert '幸存者' in page.locator('.im-prose').inner_text()
        assert page.locator('.im-quiz-question').count() == 5
        for lesson_id, marker, quiz_count in [
            ('three-stage-dcf-terminal-value', '一张真正的三阶段现金流表', 8),
            ('capital-structure-wacc', '债务金额已排期时，用 APV 单列融资影响', 8),
            ('balance-sheet-adjustments', '将租赁负债逐年滚动到零', 7),
            ('market-orders-costs', '逐档成交：屏幕上的 101 并非你的均价', 7),
        ]:
            page.goto(ROOT + 'read/' + lesson_id)
            page.locator('.im-prose').wait_for(timeout=20000)
            assert marker in page.locator('.im-prose').inner_text()
            assert page.locator('.im-quiz-question').count() == quiz_count
            assert not page.evaluate('document.querySelector(".im-main").scrollWidth > document.querySelector(".im-main").clientWidth')
        page.goto(ROOT + 'portfolio')
        page.locator('.im-portfolio-card').first.wait_for(timeout=20000)
        assert page.locator('.im-portfolio-card').count() == 5
        assert page.locator('.im-portfolio-overview').inner_text().__contains__('本机草稿')
        assert not page.evaluate('document.querySelector(".im-main").scrollWidth > document.querySelector(".im-main").clientWidth')
        page.screenshot(path=f'artifacts/invest-master/portfolio-{label}.png')
        page.locator('.im-portfolio-card .im-button').nth(2).click()
        page.locator('.im-prose').wait_for(timeout=20000)
        assert page.locator('h1').inner_text().startswith('毕业实作二：债券价格')
        assert not page.evaluate('document.querySelector(".im-main").scrollWidth > document.querySelector(".im-main").clientWidth')
        assert not errors, errors
        page.goto(ROOT + 'masters')
        page.locator('.im-master-card').first.wait_for(timeout=20000)
        assert page.locator('.im-master-card').count() == 11
        page.goto(ROOT + 'read/swensen-original-2009-review')
        page.locator('.im-prose').wait_for(timeout=20000)
        assert '−24.6%' in page.locator('.im-prose').inner_text()
        assert page.locator('.im-quiz-question').count() == 7
        assert not page.evaluate('document.querySelector(".im-main").scrollWidth > document.querySelector(".im-main").clientWidth')
        page.screenshot(path=f'artifacts/invest-master/swensen-lesson-{label}.png')
        print(label, '120 lessons, 11 thinkers, capstone order, case TOC, concept links, capstone and width OK')
        page.close()
    browser.close()


