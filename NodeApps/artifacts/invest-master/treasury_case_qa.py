"""Check the Treasury auction case stays sealed until an independent draft."""

import os

from playwright.sync_api import sync_playwright


BASE = os.environ.get('INVEST_MASTER_BASE', 'http://127.0.0.1:5788')
CASE_ID = 'treasury-2022-two-year-auction-price-blind'

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    pages = []
    for name, width, height in [('desktop', 1440, 900), ('mobile', 390, 844)]:
        page = browser.new_page(viewport={'width': width, 'height': height})
        response = page.request.get(f'{BASE}/invest-master/api/content')
        assert response.ok
        item = next(entry for entry in response.json()['items'] if entry['id'] == CASE_ID)
        assert item['body'] == '', 'analysis leaked through catalog API'
        assert len(item['brief']) > 500
        page.goto(f'{BASE}/#/app/invest-master/path', wait_until='domcontentloaded')
        page.locator('.im-practice-card').get_by_role('button', name='美国国债 2022').click()
        page.locator('h1').filter(has_text='美国国债 2022').wait_for(timeout=20000)
        assert page.locator('.im-case-brief table').count() == 1
        assert '21,586.89' not in page.locator('.im-main').inner_text()
        assert not page.evaluate('document.querySelector(".im-main").scrollWidth > document.querySelector(".im-main").clientWidth')
        pages.append(page)
        print(name, 'auction source table and sealed analysis readable')

    page = pages[0]
    page.locator('.im-case-checkpoint textarea').fill(
        '我先锁定一月二十四日拍卖公布的条款，区分一月三十一日发行与客户下一年付款。'
        '每一百万面值半年票息四千三百七十五，四次现金流按最高接受收益率的半年度利率贴现。'
        '票面利率并非拍卖收益率；发行面值也不是结算支出。第二年若需提前卖出，我要用剩余两笔现金流按新收益率估价，'
        '并把已经收到且尚未花掉的票息单独列出。模拟收益率不是历史报价；还需核实该券实际可成交价和到账时间。'
    )
    page.locator('.im-case-analysis button').click()
    page.locator('.im-case-analysis button').filter(has_text='查看参考推导').wait_for(timeout=10000)
    page.locator('.im-case-analysis button').click()
    analysis = page.locator('.im-case-analysis')
    analysis.get_by_text('21,586.89', exact=False).first.wait_for(timeout=10000)
    assert '99.7728183' in analysis.inner_text()
    assert '96.966311' in analysis.inner_text()
    print('first draft saved, auction-price and cash-gap reconstruction unlocked')
    browser.close()
