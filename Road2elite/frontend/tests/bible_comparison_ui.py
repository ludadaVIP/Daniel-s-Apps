"""Browser smoke test for parallel Bible passages."""

import os
import tempfile

from playwright.sync_api import sync_playwright


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto(os.environ.get("BIBLE_TEST_BASE_URL", "http://127.0.0.1:8005") + "/bible")
        page.wait_for_load_state("networkidle")
        page.get_by_role("button", name="Pag 1st").click()
        page.get_by_role("button", name="Pick a random verse").click()
        page.locator(".bible-card").wait_for()
        page.get_by_role("button", name="ESV", exact=True).last.click()
        page.locator(".bible-comparison-column").nth(1).get_by_text("ESV", exact=True).wait_for()
        page.locator(".bible-comparison-column").nth(1).get_by_text("(text hidden", exact=False).wait_for()
        assert page.locator(".bible-comparison-column").count() == 2
        assert page.locator(".bible-comparison-revealed").count() == 0
        page.get_by_role("button", name="Hint (+5)").click()
        page.locator(".bible-comparison-revealed").nth(1).wait_for()
        page.get_by_role("button", name="NVI", exact=True).last.click()
        assert page.locator(".bible-comparison-column").count() == 3
        page.locator(".bible-comparison-revealed").nth(2).wait_for()
        hinted = [item.inner_text() for item in page.locator(".bible-comparison-revealed").all()]
        assert all(hinted)
        partial_after_first = page.get_by_role("button", name="Show", exact=True).count() > 0
        hinted_twice = None
        if page.get_by_role("button", name="Hint (+5)").is_enabled():
            page.get_by_role("button", name="Hint (+5)").click()
            hinted_twice = [item.inner_text() for item in page.locator(".bible-comparison-revealed").all()]
            assert all(later.startswith(earlier) for earlier, later in zip(hinted, hinted_twice))
        partial_after_second = page.get_by_role("button", name="Show", exact=True).count() > 0
        if partial_after_second:
            page.get_by_role("button", name="Show", exact=True).click()
        full = [item.inner_text() for item in page.locator(".bible-comparison-revealed").all()]
        for index in (1, 2):
            assert hinted[index].split() == (full[index].split()[:5] if partial_after_first else full[index].split())
            if hinted_twice:
                assert hinted_twice[index].split() == (full[index].split()[:10] if partial_after_second else full[index].split())
        page.get_by_role("button", name="Hide", exact=True).click()
        assert page.locator(".bible-comparison-revealed").count() == 0
        page.get_by_role("button", name="Show", exact=True).click()
        assert [item.inner_text() for item in page.locator(".bible-comparison-revealed").all()] == full
        page.get_by_role("button", name="See Paragraph").click()
        page.locator(".bible-comparison-column.has-paragraph").first.wait_for()
        assert page.locator(".bible-comparison-paragraph").count() == 3
        assert all(page.locator(".bible-comparison-paragraph").nth(index).locator(".bible-paragraph-text").inner_text() for index in range(3))
        page.screenshot(path=os.path.join(tempfile.gettempdir(), "bible-comparison-desktop.png"))
        page.set_viewport_size({"width": 390, "height": 844})
        assert page.locator(".bible-comparison-grid").evaluate("element => element.scrollWidth > element.clientWidth")
        page.screenshot(path=os.path.join(tempfile.gettempdir(), "bible-comparison-mobile.png"))
        page.get_by_role("button", name="ESV", exact=True).last.click()
        assert page.locator(".bible-comparison-column").count() == 2
        page.get_by_role("button", name="NVI", exact=True).last.click()
        assert page.locator(".bible-comparison-column").count() == 0
        page.locator(".bible-version-chip").filter(has_text="NVI").click()
        page.wait_for_function("document.querySelector('.bible-filter-toggle')?.textContent?.includes('21 books')")
        page.get_by_role("button", name="Pick a random verse").click()
        page.locator(".bible-card").wait_for()
        page.get_by_role("button", name="ESV", exact=True).last.click()
        page.wait_for_function("document.querySelector('.bible-comparison-column[lang=zh] .bible-comparison-verse')?.textContent?.includes('Loading translation') === false")
        assert page.locator(".bible-comparison-column[lang=zh]").count() == 1
        assert not errors, errors
        browser.close()


if __name__ == "__main__":
    main()
