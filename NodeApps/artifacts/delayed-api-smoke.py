import sys

from playwright.sync_api import sync_playwright


sys.stdout.reconfigure(encoding="utf-8")

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://127.0.0.1:5988', wait_until='networkidle')
    page.get_by_role('button', name='InsightMatrix', exact=False).click()
    page.wait_for_timeout(1_500)

    body = page.locator('body').inner_text()
    assert '正在打开 InsightMatrix' in body, body
    assert '暂时无法打开工作台' not in body, body
    print('GATE_OK', flush=True)

    page.get_by_text('THINK DEEPER. SEE FURTHER.').wait_for(timeout=30_000)
    body = page.locator('body').inner_text()
    assert '暂时无法打开工作台' not in body, body
    print('AUTO_RECOVERY_OK', flush=True)
    browser.close()
