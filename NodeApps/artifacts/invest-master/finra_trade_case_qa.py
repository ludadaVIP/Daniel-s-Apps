"""Check the historical bond trade exercise on desktop and mobile."""

import os
from playwright.sync_api import sync_playwright


BASE = os.environ.get('INVEST_MASTER_BASE', 'http://127.0.0.1:5788')
CASE_ID = 'finra-korth-2009-bond-markup-audit-blind'

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    for name, width, height in [('desktop', 1440, 900), ('mobile', 390, 844)]:
        page = browser.new_page(viewport={'width': width, 'height': height})
        response = page.request.get(f'{BASE}/invest-master/api/content')
        assert response.ok
        case = next(item for item in response.json()['items'] if item['id'] == CASE_ID)
        assert case['body'] == '', 'The audit answer leaked in the catalog API'
        assert len(case['brief']) >= 500
        page.goto(f'{BASE}/#/app/invest-master/path', wait_until='domcontentloaded')
        page.locator('.im-practice-card').get_by_role('button', name='同券六分钟成交').click()
        page.locator('h1').filter(has_text='同券六分钟成交').wait_for(timeout=20000)
        assert page.locator('.im-case-brief table').count() == 1
        assert '3.8933%' not in page.locator('.im-main').inner_text()
        assert not page.evaluate('document.querySelector(".im-main").scrollWidth > document.querySelector(".im-main").clientWidth')
        print(name, 'historical prices visible; audit answer sealed; no page overflow')
        page.close()
    browser.close()
