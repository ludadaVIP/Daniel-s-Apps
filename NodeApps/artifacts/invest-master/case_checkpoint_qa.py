"""Exercise the case decision card with an isolated in-browser learning state."""

import os
from playwright.sync_api import sync_playwright


ROOT = os.environ.get('INVEST_MASTER_BASE', 'http://127.0.0.1:5788') + '/#/app/invest-master/'
ANSWER = '事前判断：证券比例约 56.7%；先核查存款集中度、可立即融资额和受限制资产。'
BLIND_ANSWER = '我的独立判断：先把营业利润、税、利息和营运资本变化接到现金流，再按合同到期日检查可实际动用的现金。受限现金不能用于还债；估值要按同一时点折现，终值和债务桥要分别核查。客户确定付款与最低现金储备优先于新增风险仓位。若原始文件没有证实融资或套保，我会把它列为待核实条件，不能默认管理层能完成。'

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    for label, width, height in [('desktop', 1440, 900), ('mobile', 390, 844)]:
        page = browser.new_page(viewport={'width': width, 'height': height})
        page.emulate_media(reduced_motion='reduce')
        def unlock_case():
            if page.get_by_role('button', name='封存首次答卷并解锁解析').count():
                page.locator('.im-case-checkpoint textarea').fill(BLIND_ANSWER)
                page.get_by_role('button', name='封存首次答卷并解锁解析').click()
                page.get_by_role('button', name='查看参考推导').wait_for(timeout=10000)

        page.goto(ROOT + 'cases', wait_until='domcontentloaded')
        page.locator('.im-catalog-card').first.wait_for(timeout=20000)
        assert page.locator('.im-catalog-card').count() == 19
        page.goto(ROOT + 'read/svb-2023-deposit-duration', wait_until='domcontentloaded')
        card = page.locator('.im-case-checkpoint')
        card.wait_for(timeout=20000)
        assert card.locator('li').count() == 2
        assert 'SEC Form 10-K' in page.locator('.im-prose').inner_text()
        card.locator('textarea').fill(ANSWER)
        card.get_by_role('button', name='保存决策卡').click()
        page.get_by_text('笔记已保存', exact=True).wait_for(timeout=10000)
        page.reload(wait_until='domcontentloaded')
        card.wait_for(timeout=20000)
        assert card.locator('textarea').input_value() == ANSWER
        assert not page.evaluate('document.querySelector(".im-main").scrollWidth > document.querySelector(".im-main").clientWidth')
        page.screenshot(path=f'artifacts/invest-master/case-checkpoint-{label}.png')

        page.goto(ROOT + 'read/uk-ldi-2022-liquidity-spiral', wait_until='domcontentloaded')
        card = page.locator('.im-case-checkpoint')
        card.wait_for(timeout=20000)
        assert card.locator('li').count() == 2
        assert '18−8=10' in page.locator('.im-prose').inner_text()
        page.goto(ROOT + 'read/netflix-2011-retention-cash', wait_until='domcontentloaded')
        card = page.locator('.im-case-checkpoint')
        card.wait_for(timeout=20000)
        assert card.locator('li').count() == 2
        assert '2459.4+471.4−551.9=2378.9' in page.locator('.im-prose').inner_text()
        page.goto(ROOT + 'read/qinglan-three-statement-valuation-audit', wait_until='domcontentloaded')
        card = page.locator('.im-case-checkpoint')
        card.wait_for(timeout=20000)
        assert card.locator('li').count() == 3
        assert '2025 年收入 1000' in card.locator('.im-case-brief').inner_text()
        assert page.get_by_text('FCFF=160×(1−25%)', exact=False).count() == 0
        page.screenshot(path=f'artifacts/invest-master/qinglan-brief-{label}.png')
        unlock_case()
        page.get_by_role('button', name='查看参考推导').click()
        page.get_by_text('FCFF=160×(1−25%)', exact=False).wait_for(timeout=10000)
        assert not page.evaluate('document.querySelector(".im-main").scrollWidth > document.querySelector(".im-main").clientWidth')
        page.goto(ROOT + 'read/shanling-bond-liquidity-waterfall', wait_until='domcontentloaded')
        card = page.locator('.im-case-checkpoint')
        card.wait_for(timeout=20000)
        assert card.locator('li').count() == 3
        assert '子公司有担保银行债本金' in card.locator('.im-case-brief').inner_text()
        assert page.get_by_text('P=6/1.08+106/1.08²', exact=False).count() == 0
        unlock_case()
        page.get_by_role('button', name='查看参考推导').click()
        page.get_by_text('P=6/1.08+106/1.08²', exact=False).wait_for(timeout=10000)
        assert not page.evaluate('document.querySelector(".im-main").scrollWidth > document.querySelector(".im-main").clientWidth')
        page.goto(ROOT + 'read/yuanshan-client-ips-liquidity', wait_until='domcontentloaded')
        card = page.locator('.im-case-checkpoint')
        card.wait_for(timeout=20000)
        assert card.locator('li').count() == 3
        assert '股票 900、债券 500' in card.locator('.im-case-brief').inner_text()
        assert page.get_by_text('900−400=500', exact=False).count() == 0
        unlock_case()
        page.get_by_role('button', name='查看参考推导').click()
        page.get_by_text('900−400=500', exact=False).wait_for(timeout=10000)
        assert not page.evaluate('document.querySelector(".im-main").scrollWidth > document.querySelector(".im-main").clientWidth')
        page.goto(ROOT + 'read/hanqiao-prepayments-buyback-exam', wait_until='domcontentloaded')
        card = page.locator('.im-case-checkpoint')
        card.wait_for(timeout=20000)
        assert card.locator('li').count() == 3
        assert '限时 100 分钟' in card.locator('.im-case-brief').inner_text()
        assert page.get_by_text('CFO=净利润58.5', exact=False).count() == 0
        page.screenshot(path=f'artifacts/invest-master/hanqiao-brief-{label}.png', full_page=True)
        unlock_case()
        page.get_by_role('button', name='查看参考推导').click()
        page.get_by_text('CFO=净利润58.5', exact=False).wait_for(timeout=10000)
        assert not page.evaluate('document.querySelector(".im-main").scrollWidth > document.querySelector(".im-main").clientWidth')
        page.goto(ROOT + 'read/swensen-endowment-liquidity-committee', wait_until='domcontentloaded')
        card = page.locator('.im-case-checkpoint')
        card.wait_for(timeout=20000)
        assert card.locator('li').count() == 3
        assert '限时 90 分钟' in card.locator('.im-case-brief').inner_text()
        assert page.get_by_text('300−100−98=102', exact=False).count() == 0
        page.screenshot(path=f'artifacts/invest-master/swensen-case-brief-{label}.png', full_page=True)
        unlock_case()
        page.get_by_role('button', name='查看参考推导').click()
        page.get_by_text('300−100−98=102', exact=False).wait_for(timeout=10000)
        assert not page.evaluate('document.querySelector(".im-main").scrollWidth > document.querySelector(".im-main").clientWidth')
        page.goto(ROOT + 'read/accounting-quality', wait_until='domcontentloaded')
        page.locator('.im-aside-link').filter(has_text='Costco 2022').click()
        page.wait_for_url('**/read/costco-2022-filing-cash-blind', timeout=10000)
        page.locator('h1').filter(has_text='Costco 2022').wait_for(timeout=10000)
        card = page.locator('.im-case-checkpoint')
        card.wait_for(timeout=20000)
        assert card.locator('li').count() == 4
        assert '2022 年 10 月 5 日' in card.locator('.im-case-brief').inner_text()
        assert '222,730' in card.locator('.im-case-brief').inner_text()
        assert page.get_by_text('增加 2,122', exact=False).count() == 0
        page.screenshot(path=f'artifacts/invest-master/costco-brief-{label}.png', full_page=True)
        unlock_case()
        page.get_by_role('button', name='查看参考推导').click()
        page.get_by_text('增加 2,122', exact=False).wait_for(timeout=10000)
        assert '2023 年 10 月' in page.locator('.im-case-analysis').inner_text()
        assert not page.evaluate('document.querySelector(".im-main").scrollWidth > document.querySelector(".im-main").clientWidth')
        page.goto(ROOT + 'read/buybacks-dilution-per-share-value', wait_until='domcontentloaded')
        page.locator('.im-aside-link').filter(has_text='Adobe 2022').click()
        page.wait_for_url('**/read/adobe-2022-filing-sbc-blind', timeout=10000)
        page.locator('h1').filter(has_text='Adobe 2022').wait_for(timeout=10000)
        card = page.locator('.im-case-checkpoint')
        card.wait_for(timeout=20000)
        assert card.locator('li').count() == 4
        assert '2023 年 1 月 17 日' in card.locator('.im-case-brief').inner_text()
        assert '15,190' in card.locator('.im-case-brief').inner_text()
        assert '9,776' not in card.locator('.im-case-brief').inner_text()
        assert page.locator('.im-case-analysis .im-prose').count() == 0
        page.screenshot(path=f'artifacts/invest-master/adobe-brief-{label}.png', full_page=True)
        unlock_case()
        page.get_by_role('button', name='查看参考推导').click()
        page.get_by_text('多 9,776', exact=False).wait_for(timeout=10000)
        assert '2024 年 1 月 17 日' in page.locator('.im-case-analysis').inner_text()
        assert not page.evaluate('document.querySelector(".im-main").scrollWidth > document.querySelector(".im-main").clientWidth')
        page.goto(ROOT + 'read/haichen-exporter-fx-client-exam', wait_until='domcontentloaded')
        card = page.locator('.im-case-checkpoint')
        card.wait_for(timeout=20000)
        assert card.locator('li').count() == 4
        assert '限时 110 分钟' in card.locator('.im-case-brief').inner_text()
        assert page.get_by_text('CFO = 90', exact=False).count() == 0
        if label == 'desktop':
            assert page.get_by_role('button', name='封存首次答卷并解锁解析').is_disabled()
        page.screenshot(path=f'artifacts/invest-master/haichen-brief-{label}.png', full_page=True)
        unlock_case()
        page.get_by_role('button', name='查看参考推导').click()
        page.get_by_text('CFO = 90', exact=False).wait_for(timeout=10000)
        assert '首次答卷已封存' in card.inner_text()
        assert not page.evaluate('document.querySelector(".im-main").scrollWidth > document.querySelector(".im-main").clientWidth')
        page.close()
        print(label, 'case checkpoint, isolated note persistence, and width OK')
    browser.close()
