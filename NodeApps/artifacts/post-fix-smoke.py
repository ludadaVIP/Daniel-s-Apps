import sys

from playwright.sync_api import sync_playwright


sys.stdout.reconfigure(encoding="utf-8")

apps = [
    "World Q&A",
    "BeliefQ&A",
    "Investment",
    "Industry with coms",
    "InsightMatrix",
    "Notebook",
    "VisualShelf",
    "BibleDevotion",
    "Recall Verses",
]

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    for name in apps:
        context = browser.new_context()
        page = context.new_page()
        page.goto('http://127.0.0.1:5999', wait_until='networkidle')
        page.get_by_role('button', name=name, exact=False).click()
        page.locator('.app-loading').wait_for(state='hidden', timeout=30_000)
        page.wait_for_timeout(1_000)
        body = page.locator('body').inner_text()
        assert '暂时无法打开' not in body, f'{name}: {body[:500]}'
        assert '无法打开' not in body, f'{name}: {body[:500]}'
        assert '加载失败' not in body, f'{name}: {body[:500]}'
        print(f'PASS {name}', flush=True)
        context.close()
    browser.close()
