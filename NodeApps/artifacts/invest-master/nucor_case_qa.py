"""Verify the Nucor case is readable and its reference analysis stays sealed."""

import os

from playwright.sync_api import sync_playwright


BASE = os.environ.get('INVEST_MASTER_BASE', 'http://127.0.0.1:5788')
CASE_ID = 'nucor-2022-steel-cycle-cash-blind'

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    for name, width, height in [('desktop', 1440, 900), ('mobile', 390, 844)]:
        page = browser.new_page(viewport={'width': width, 'height': height})
        response = page.request.get(f'{BASE}/invest-master/api/content')
        assert response.ok
        item = next(entry for entry in response.json()['items'] if entry['id'] == CASE_ID)
        assert item['body'] == '', 'analysis leaked through catalog API'
        assert len(item['brief']) > 500
        page.goto(f'{BASE}/#/app/invest-master/path', wait_until='domcontentloaded')
        page.locator('.im-practice-card').get_by_role('button', name='Nucor 2022').click()
        page.locator('h1').filter(has_text='Nucor 2022').wait_for(timeout=20000)
        assert page.locator('.im-case-brief table').count() == 1
        assert '4,283.407' not in page.locator('.im-main').inner_text()
        assert not page.evaluate('document.querySelector(".im-main").scrollWidth > document.querySelector(".im-main").clientWidth')
        print(name, 'source table and sealed analysis readable')

        if name == 'desktop':
            page.locator('.im-case-checkpoint textarea').fill(
                '我把资料时点定在二零二三年三月一日，先从原始十K核对销量和吨价。'
                '二零二二收入增加却对外吨数下降，因此不把收入增幅外推为长期销量增长。'
                '经营现金流增加时，库存和应收的现金释放需要单独列出；收购现金不在购置厂房设备支出里面。'
                '我会重算两年毛利、现金余量和归母利润，再以钢价与废钢成本不同变化作压力。'
                '缺少当日股价、客户付款日和资本成本，我不会从题面断言买价或仓位。'
            )
            page.locator('.im-case-analysis button').click()
            page.locator('.im-case-analysis button').filter(has_text='查看参考推导').wait_for(timeout=10000)
            page.locator('.im-case-analysis button').click()
            analysis = page.locator('.im-case-analysis')
            analysis.get_by_text('4,283.407', exact=False).first.wait_for(timeout=10000)
            assert '4,897.774' in analysis.inner_text()
            print('first draft saved and 2023 retrospective unlocked')
        page.close()
    browser.close()
