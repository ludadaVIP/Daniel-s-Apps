from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).resolve().parent
URL = 'http://127.0.0.1:5788/#/app/invest-master/read/profit-vs-cash'

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    errors = []
    for label, width, height in [('desktop', 1440, 900), ('mobile', 390, 844)]:
        page = browser.new_page(viewport={'width': width, 'height': height}, device_scale_factor=1)
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(URL)
        page.wait_for_load_state('networkidle')
        assert page.locator('h1').inner_text() == '利润、现金与再投资'
        assert page.locator('.im-quiz-question').count() == 5
        toc = page.locator('.im-toc button') if label == 'desktop' else page.locator('.im-mobile-toc button')
        assert toc.count() >= 5
        assert page.locator('.im-prose table').count() == 1
        assert page.locator('.im-prose pre').count() == 1
        horizontal = page.evaluate('document.querySelector(".im-main").scrollWidth > document.querySelector(".im-main").clientWidth')
        assert not horizontal, f'{label} reader overflows horizontally'
        page.screenshot(path=str(OUT / f'textbook-{label}.png'))
        if label == 'mobile':
            page.locator('.im-mobile-toc summary').click()
        toc.filter(has_text='完整算例').click()
        page.wait_for_timeout(850)
        position = page.locator('.im-prose h2').filter(has_text='完整算例').evaluate('(element) => Math.round(element.getBoundingClientRect().top)')
        assert -20 <= position <= height, f'{label} table of contents did not navigate: {position}'
        print(label, 'title, 5 questions, table, code block, toc and width OK; section top:', position)
        page.close()
    assert not errors, errors
    browser.close()
