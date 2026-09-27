"""Verify the SVB filing exercise stays sealed and works on both layouts."""

import os

from playwright.sync_api import sync_playwright


BASE = os.environ.get('INVEST_MASTER_BASE', 'http://127.0.0.1:5788')
CASE_ID = 'svb-2023-deposit-duration'

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    for name, width, height in [('desktop', 1440, 900), ('mobile', 390, 844)]:
        page = browser.new_page(viewport={'width': width, 'height': height})
        response = page.request.get(f'{BASE}/invest-master/api/content')
        assert response.ok
        item = next(entry for entry in response.json()['items'] if entry['id'] == CASE_ID)
        assert item['body'] == '', 'post-event analysis leaked through catalog API'
        assert len(item['brief']) > 500
        page.goto(f'{BASE}/#/app/invest-master/path', wait_until='domcontentloaded')
        page.locator('.im-practice-card').get_by_role('button', name='硅谷银行 2023').click()
        page.locator('h1').filter(has_text='硅谷银行 2023').wait_for(timeout=20000)
        assert page.locator('.im-case-brief table').count() == 1
        assert '3.40525' not in page.locator('.im-main').inner_text()
        assert '3 月 9 日提款' not in page.locator('.im-main').inner_text()
        assert not page.evaluate('document.querySelector(".im-main").scrollWidth > document.querySelector(".im-main").clientWidth')
        print(name, 'filing table visible, retrospective sealed, width OK')

        if name == 'desktop':
            page.locator('.im-case-checkpoint textarea').fill(
                '我先固定二零二三年二月二十四日的披露。可供出售证券已经在资产负债表按公允价值列示，'
                '不能把成本与公允价值差再从股东权益扣一遍。持有到期证券的公允价值差虽重要，'
                '也不是当天全额实现的现金损失。模拟存款外流时应先用可动用现金逐日匹配，'
                '然后核查证券出售及抵押融资的到账时点、折扣和重复占用，不能把名义额度简单相加。'
                '我还需要客户集中度、保证金和融资操作准备的证据，再作阶段判断。'
            )
            page.locator('.im-case-analysis button').click()
            page.locator('.im-case-analysis button').filter(has_text='查看参考推导').wait_for(timeout=10000)
            page.locator('.im-case-analysis button').click()
            analysis = page.locator('.im-case-analysis')
            analysis.get_by_text('3.40525', exact=False).first.wait_for(timeout=10000)
            assert '29.3716' in analysis.inner_text()
            assert '17.685' in analysis.inner_text()
            print('first answer sealed, accounting and liquidity bridges unlocked')
        page.close()
    browser.close()
