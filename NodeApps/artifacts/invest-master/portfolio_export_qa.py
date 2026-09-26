"""Check the graduation export without changing the user's learning database."""

from pathlib import Path
import os

from playwright.sync_api import sync_playwright


ROOT = os.environ.get('IM_ROOT', 'http://127.0.0.1:5788/#/app/invest-master/')
NOTE = '独立草稿：逐项核对原始披露、现金流估值、债券顺位和客户付款。'


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(accept_downloads=True)

    def state_route(route):
        data = route.fetch().json()
        data['notes'] = [{'id': 'integrated-research-capstone', 'body': NOTE, 'updatedAt': '2026-09-25T00:00:00.000Z'}]
        route.fulfill(json=data)

    page.route('**/invest-master/api/state', state_route)
    page.goto(ROOT + 'portfolio', wait_until='domcontentloaded')
    button = page.get_by_role('button', name='导出全部草稿')
    button.wait_for(timeout=20000)
    with page.expect_download() as event:
        button.click()
    download = event.value
    exported = Path(download.path()).read_text(encoding='utf-8')
    assert NOTE in exported
    assert '独立审读记录（由审读者填写）' in exported
    assert '三表、现金流及估值勾稽' in exported
    assert '两家不同行业企业各有独立股票报告' in exported
    assert '未审读草稿或选择题完成记录不构成能力认证' in exported
    browser.close()
    print('Graduation Markdown export includes saved draft and independent review sheet.')
