"""Verify the real credit case stays sealed and readable on both layouts."""

import os

from playwright.sync_api import sync_playwright


BASE = os.environ.get('INVEST_MASTER_BASE', 'http://127.0.0.1:5788')
CASE_ID = 'bbby-2022-unsecured-credit-blind'

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    pages = []
    for name, width, height in [('desktop', 1440, 900), ('mobile', 390, 844)]:
        page = browser.new_page(viewport={'width': width, 'height': height})
        response = page.request.get(f'{BASE}/invest-master/api/content')
        assert response.ok
        case = next(item for item in response.json()['items'] if item['id'] == CASE_ID)
        assert case['body'] == '', 'reference analysis leaked through catalog API'
        assert len(case['brief']) > 500
        page.goto(f'{BASE}/#/app/invest-master/path', wait_until='domcontentloaded')
        page.locator('.im-practice-card').first.wait_for(timeout=20000)
        assert page.locator('.im-practice-card').count() == 4
        assert not page.evaluate('document.querySelector(".im-main").scrollWidth > document.querySelector(".im-main").clientWidth')
        page.locator('.im-practice-card').get_by_role('button', name='Bed Bath & Beyond').click()
        assert page.url.endswith(f'/read/{CASE_ID}')
        page.locator('h1').filter(has_text='折价无担保债').wait_for(timeout=20000)
        assert page.locator('.im-case-brief table').count() == 1
        assert '2023 年 4 月 23 日' not in page.locator('.im-main').inner_text()
        assert page.locator('.im-case-analysis button').inner_text().startswith('封存首次答卷')
        assert not page.evaluate('document.querySelector(".im-main").scrollWidth > document.querySelector(".im-main").clientWidth')
        pages.append(page)
        print(name, 'sealed case, source table and width OK')

    page = pages[0]
    page.locator('.im-case-checkpoint textarea').fill(
        '我先把资料时点固定在二零二二年九月底，区分受限现金与可动用现金，再把上半年经营现金流和资本支出配平。'
        '借款额度的日期和条件必须核对，三档无担保债的合计公允价值不能当成任何单券报价。'
        '我还需要原始票据合同、抵押和借款基数证书、每只债券同日可成交价及客户的全损预算，才可能提出仓位。'
    )
    page.locator('.im-case-analysis button').click()
    page.locator('.im-case-analysis button').filter(has_text='查看参考推导').wait_for(timeout=10000)
    page.locator('.im-case-analysis button').click()
    page.locator('.im-case-analysis').get_by_text('2023 年 4 月 23 日', exact=False).wait_for(timeout=10000)
    assert '135.270+31.446=166.716' in page.locator('.im-case-analysis').inner_text()
    page.goto(f'{BASE}/#/app/invest-master/path', wait_until='domcontentloaded')
    credit_stop = page.locator('.im-practice-card').filter(has_text='债券与信用')
    credit_stop.get_by_role('button', name='Bed Bath & Beyond').get_by_text('首次答卷已封存').wait_for(timeout=10000)
    print('first answer sealed, reference analysis unlocked and arithmetic visible')
    browser.close()
