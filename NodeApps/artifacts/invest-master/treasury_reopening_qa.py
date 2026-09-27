"""Verify the Treasury reopening case keeps the second auction sealed."""

import os

from playwright.sync_api import sync_playwright


BASE = os.environ.get('INVEST_MASTER_BASE', 'http://127.0.0.1:5788')
CASE_ID = 'treasury-2022-reopening-clean-dirty-cash-blind'

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    for name, width, height in [('desktop', 1440, 900), ('mobile', 390, 844)]:
        page = browser.new_page(viewport={'width': width, 'height': height})
        response = page.request.get(f'{BASE}/invest-master/api/content')
        assert response.ok
        case = next(item for item in response.json()['items'] if item['id'] == CASE_ID)
        assert case['body'] == '', 'October auction leaked through catalog API'
        assert len(case['brief']) > 500
        page.goto(f'{BASE}/#/app/invest-master/path', wait_until='domcontentloaded')
        page.locator('.im-practice-card').get_by_role('button', name='同一国债两次续发').click()
        page.locator('h1').filter(has_text='同一国债两次续发').wait_for(timeout=20000)
        assert page.locator('.im-case-brief table').count() == 1
        assert '90.449122' not in page.locator('.im-main').inner_text()
        assert '44,443.66' not in page.locator('.im-main').inner_text()
        assert not page.evaluate('document.querySelector(".im-main").scrollWidth > document.querySelector(".im-main").clientWidth')
        print(name, 'September source data readable; October data sealed')

        if name == 'desktop':
            page.locator('.im-case-checkpoint textarea').fill(
                '我先固定九月十二日的官方拍卖结果，区分九月十五日交割与十月二十日客户付款。'
                '每一百面值价格需要乘以一万，每一千面值应计利息需要乘以一千，合计才是交割现金。'
                '收益率到期回报不保证提前卖出回报。客户付款日在债券到期日之前，'
                '因此我会先保留足额按时可用的现金，再核对券商同日可执行买价、应计利息、费用和结算时间。'
                '后来拍卖价格即使属于同一CUSIP，也只是参照，不能当成实际卖券成交。'
            )
            page.locator('.im-case-analysis button').click()
            page.locator('.im-case-analysis button').filter(has_text='查看参考推导').wait_for(timeout=10000)
            page.locator('.im-case-analysis button').click()
            analysis = page.locator('.im-case-analysis')
            analysis.get_by_text('44,443.66', exact=False).first.wait_for(timeout=10000)
            assert '953,642.76' in analysis.inner_text()
            assert '4.70788' in analysis.inner_text()
            print('first draft sealed; settlement and conditional cash gap unlocked')
        page.close()
    browser.close()
