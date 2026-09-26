from playwright.sync_api import sync_playwright, expect

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1365, "height": 820})
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto("http://127.0.0.1:5888/")
    page.wait_for_load_state("networkidle")
    card = page.locator('[data-app-id="invest-master"]')
    expect(card).to_be_visible()
    card.locator(".launcher-hub-card-launch").click()
    expect(page.locator(".im-home-hero h1")).to_be_visible(timeout=15000)
    page.get_by_role("button", name="投资大师", exact=True).click()
    expect(page.locator(".im-master-grid .im-master-card")).to_have_count(6)
    assert not errors, errors
    print("NodeApps launcher integration passed.")
    browser.close()
