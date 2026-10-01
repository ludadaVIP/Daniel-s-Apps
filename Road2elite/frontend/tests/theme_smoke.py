"""Check theme switching and persistence across the launcher and all six routes.

Run against the local Vite server: python tests/theme_smoke.py
"""

from playwright.sync_api import sync_playwright


BASE = "http://127.0.0.1:5175"
ROUTES = (
    ("/", ".hub-root"),
    ("/calendar", ".cal-app"),
    ("/record-meditation", ".rec-lock, .rec-shell"),
    ("/save-md", ".smd-shell"),
    ("/bible", ".bible-shell"),
    ("/book-a-day", ".bad-shell"),
    ("/book-in-depth", ".bid-shell"),
)


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto(BASE)
    page.wait_for_load_state("networkidle")
    page.evaluate("localStorage.setItem('road2elite-theme', 'light')")
    page.reload()
    page.get_by_role("button", name="切换到黑夜模式").click()
    assert page.locator("html").get_attribute("data-theme") == "dark"
    assert page.evaluate("localStorage.getItem('road2elite-theme')") == "dark"

    for route, selector in ROUTES:
        page.goto(BASE + route)
        page.locator(selector).first.wait_for()
        assert page.locator("html").get_attribute("data-theme") == "dark", route
        toggle = page.get_by_role("button", name="切换到白天模式")
        assert toggle.is_visible(), route
        print(route, page.locator(selector).first.evaluate("element => getComputedStyle(element).backgroundColor"))

    page.get_by_role("button", name="切换到白天模式").click()
    page.reload()
    assert page.locator("html").get_attribute("data-theme") == "light"
    assert page.get_by_role("button", name="切换到黑夜模式").is_visible()
    browser.close()
