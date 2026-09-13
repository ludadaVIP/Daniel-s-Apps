from __future__ import annotations

import json
from pathlib import Path

from playwright.sync_api import sync_playwright


BASE_URL = "http://127.0.0.1:5888"
OUTPUT = Path("artifacts/html-library")
OUTPUT.mkdir(parents=True, exist_ok=True)


def safe_text(locator):
    try:
        return locator.inner_text(timeout=1500).strip()
    except Exception:
        return ""


def main():
    report = {"console_errors": [], "page_errors": [], "runs": {}}

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 950}, device_scale_factor=1)
        page.on("console", lambda message: report["console_errors"].append(message.text) if message.type == "error" else None)
        page.on("pageerror", lambda error: report["page_errors"].append(str(error)))

        page.goto(BASE_URL, wait_until="networkidle")
        page.screenshot(path=str(OUTPUT / "desktop-01-launcher.png"), full_page=True)
        report["runs"]["launcher"] = {
            "title": page.title(),
            "visible_text": page.locator("body").inner_text()[:1000],
            "buttons": page.locator("button").all_inner_texts(),
            "links": page.locator("a").all_inner_texts(),
        }

        page.get_by_text("VisualShelf", exact=True).first.click()
        page.wait_for_load_state("networkidle")
        page.get_by_role("heading", name="VisualShelf").wait_for(timeout=10000)
        page.screenshot(path=str(OUTPUT / "desktop-02-library-grid.png"), full_page=True)

        report["runs"]["library_initial"] = {
            "buttons": page.locator("button").all_inner_texts(),
            "inputs": page.locator("input").count(),
            "iframes": page.locator("iframe").count(),
        }

        # Search then clear to verify live filtering.
        search = page.locator("input").first
        search.fill("nonexistent-qa-query")
        page.wait_for_timeout(250)
        report["runs"]["search_empty_count"] = page.locator("main").inner_text().count("nonexistent-qa-query")
        page.screenshot(path=str(OUTPUT / "desktop-03-search-empty.png"), full_page=True)
        search.fill("")
        page.wait_for_timeout(250)

        # Open the first document card via its visible read button or card-like article.
        cards_before = page.locator("article").count()
        card = page.locator("article").first
        card.click()
        page.wait_for_timeout(300)
        page.screenshot(path=str(OUTPUT / "desktop-04-selected.png"), full_page=True)

        # Look for the preview action after selecting a card. Record the actual button labels.
        labels_after_select = page.locator("button").all_inner_texts()
        preview_candidates = [label for label in labels_after_select if "预览" in label]
        if preview_candidates:
            page.get_by_role("button", name=preview_candidates[0], exact=True).click()
            page.wait_for_timeout(500)
        else:
            # The visual app may expose an icon-only preview button; use the first button title containing preview.
            titled = page.locator('button[title*="预览"]')
            if titled.count():
                titled.first.click()
                page.wait_for_timeout(500)

        iframe_count = page.locator("iframe").count()
        page.screenshot(path=str(OUTPUT / "desktop-05-preview.png"), full_page=True)
        page.keyboard.press("Escape")
        page.wait_for_timeout(250)
        iframe_count_after_escape = page.locator("iframe").count()

        # Switch to compact/list mode if the control is available by text or title.
        view_control = page.locator('button[title*="列表"], button[aria-label*="列表"]')
        if view_control.count():
            view_control.first.click()
            page.wait_for_timeout(250)
        page.screenshot(path=str(OUTPUT / "desktop-06-list-or-grid-toggle.png"), full_page=True)

        overflow_desktop = page.evaluate("""() => ({
            document: document.documentElement.scrollWidth > window.innerWidth,
            body: document.body.scrollWidth > window.innerWidth,
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth
        })""")
        report["runs"]["desktop"] = {
            "cards_before": cards_before,
            "buttons_after_select": labels_after_select,
            "preview_candidates": preview_candidates,
            "iframes_after_preview": iframe_count,
            "iframes_after_escape": iframe_count_after_escape,
            "overflow": overflow_desktop,
        }

        # Mobile pass: launcher -> shelf and check layout width / main interactions.
        mobile = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1)
        mobile.on("console", lambda message: report["console_errors"].append(message.text) if message.type == "error" else None)
        mobile.on("pageerror", lambda error: report["page_errors"].append(str(error)))
        mobile.goto(BASE_URL, wait_until="networkidle")
        mobile.get_by_text("VisualShelf", exact=True).first.click()
        mobile.wait_for_load_state("networkidle")
        mobile.get_by_role("heading", name="VisualShelf").wait_for(timeout=10000)
        mobile.screenshot(path=str(OUTPUT / "mobile-01-library-grid.png"), full_page=True)
        mobile.locator("article").first.click()
        mobile.wait_for_timeout(250)
        mobile.screenshot(path=str(OUTPUT / "mobile-02-selected.png"), full_page=True)
        overflow_mobile = mobile.evaluate("""() => ({
            document: document.documentElement.scrollWidth > window.innerWidth,
            body: document.body.scrollWidth > window.innerWidth,
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth
        })""")
        report["runs"]["mobile"] = {
            "cards": mobile.locator("article").count(),
            "overflow": overflow_mobile,
            "buttons": mobile.locator("button").all_inner_texts(),
        }
        browser.close()

    (OUTPUT / "browser-qa-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
