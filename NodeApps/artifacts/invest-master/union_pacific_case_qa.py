"""Verify the rail case is readable and its later disclosure remains sealed."""

import os
from playwright.sync_api import sync_playwright


BASE = os.environ.get('INVEST_MASTER_BASE', 'http://127.0.0.1:5788')
CASE_ID = 'union-pacific-2022-rail-capital-allocation-blind'

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    for name, width, height in [('desktop', 1440, 900), ('mobile', 390, 844)]:
        page = browser.new_page(viewport={'width': width, 'height': height})
        response = page.request.get(f'{BASE}/invest-master/api/content')
        assert response.ok
        case = next(item for item in response.json()['items'] if item['id'] == CASE_ID)
        assert case['body'] == '', 'The 2023 answer leaked in the content API'
        assert case['brief'].count('2022') > 0
        page.goto(f'{BASE}/#/app/invest-master/path', wait_until='domcontentloaded')
        page.locator('.im-practice-card').get_by_role('button', name='Union Pacific 2022').click()
        page.locator('h1').filter(has_text='Union Pacific 2022').wait_for(timeout=20000)
        assert page.locator('.im-case-brief table').count() == 1
        shown = page.locator('.im-main').inner_text()
        assert '2,732' not in shown and '8,379' not in shown
        assert not page.evaluate('document.querySelector(".im-main").scrollWidth > document.querySelector(".im-main").clientWidth')
        print(name, '2022 brief visible; 2023 review sealed; no page overflow')
        page.close()
    browser.close()
