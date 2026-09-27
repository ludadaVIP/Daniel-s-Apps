"""Verify the LDI case hides its timeline answer until the first draft."""

import os

from playwright.sync_api import sync_playwright


BASE = os.environ.get('INVEST_MASTER_BASE', 'http://127.0.0.1:5788')
CASE_ID = 'uk-ldi-2022-liquidity-spiral'

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    for name, width, height in [('desktop', 1440, 900), ('mobile', 390, 844)]:
        page = browser.new_page(viewport={'width': width, 'height': height})
        response = page.request.get(f'{BASE}/invest-master/api/content')
        assert response.ok
        case = next(item for item in response.json()['items'] if item['id'] == CASE_ID)
        assert case['body'] == '', 'reference analysis leaked through catalog API'
        assert len(case['brief']) > 500
        page.goto(f'{BASE}/#/app/invest-master/path', wait_until='domcontentloaded')
        page.locator('.im-practice-card').get_by_role('button', name='英国 LDI 2022').click()
        page.locator('h1').filter(has_text='英国 LDI 2022').wait_for(timeout=20000)
        assert page.locator('.im-case-brief table').count() == 1
        assert '−5.4' not in page.locator('.im-main').inner_text()
        assert '£19.3 billion' not in page.locator('.im-main').inner_text()
        assert not page.evaluate('document.querySelector(".im-main").scrollWidth > document.querySelector(".im-main").clientWidth')
        print(name, 'cash timeline readable, reference answer sealed')

        if name == 'desktop':
            page.locator('.im-case-checkpoint textarea').fill(
                '我把资料固定在九月二十八日公告，收益率上升一百三十基点只是本题压力假设。'
                '首先用修正久期估算长债的一阶价格变化，再把养老金长期负债估值与当天可用现金分开。'
                '第零日需在十四时前提款并在十六时前交保证金；合格抵押品经折扣才产生回购现金。'
                '第二日新增追保必须用中午前可用金额，晚间资产销售款和两周后的客户出资不能提前入账。'
                '我会检查融资合同、抵押品是否重复使用、交割和客户授权。'
            )
            page.locator('.im-case-analysis button').click()
            page.locator('.im-case-analysis button').filter(has_text='查看参考推导').wait_for(timeout=10000)
            page.locator('.im-case-analysis button').click()
            analysis = page.locator('.im-case-analysis')
            analysis.get_by_text('5.4', exact=False).first.wait_for(timeout=10000)
            assert '19.6' in analysis.inner_text()
            assert '4.4' in analysis.inner_text()
            print('first draft sealed; sequential cash and fallback answers unlocked')
        page.close()
    browser.close()
