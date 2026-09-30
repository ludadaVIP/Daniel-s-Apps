"""Browser regression for the three editors, with mocked APIs and no user data writes."""

import copy
import sys
from urllib.parse import unquote, urlparse

from playwright.sync_api import sync_playwright


BASE = "http://127.0.0.1:5175"


def check_book(page, slug, prefix):
    book = {
        "id": "test-book", "shelfId": "reading", "title": "Test Book",
        "author": "", "originalTitle": "", "myTake": "", "year": "",
        "language": "zh", "pages": "", "isbn": "", "tags": [], "rating": 0,
        "startedAt": "", "finishedAt": "", "sections": {"narration": "", "oneLiner": ""},
    }
    patches = []

    def route(request_route):
        request = request_route.request
        path = urlparse(request.url).path
        if path.endswith("/library"):
            body = {"shelves": [{"id": "reading", "name": "在读", "group": "reading", "books": [copy.deepcopy(book)]}], "totalBooks": 1}
        elif request.method == "PATCH":
            patch = request.post_data_json
            patches.append(patch)
            book.update({key: value for key, value in patch.items() if key != "sections"})
            book["sections"].update(patch.get("sections", {}))
            body = {"book": copy.deepcopy(book)}
        else:
            body = {"book": copy.deepcopy(book)}
        request_route.fulfill(json=body)

    page.route(f"**/api/{slug}/**", route)
    page.goto(f"{BASE}/{slug}")
    page.wait_for_load_state("networkidle")
    page.locator(f".{prefix}-book-item").first.click()
    author = page.locator(f".{prefix}-info-card input").first
    author.press_sequentially("Ada Lovelace", delay=15)
    assert author.input_value() == "Ada Lovelace"
    assert author.evaluate("el => document.activeElement === el")
    page.wait_for_timeout(2400)
    assert len(patches) == 0, f"{slug} saved before 3 seconds"
    page.wait_for_timeout(1100)
    assert len(patches) == 1, f"{slug} did not autosave"
    assert patches[0]["author"] == "Ada Lovelace"
    assert "shelfId" not in patches[0], "saving metadata should not rewrite unrelated fields"
    assert author.evaluate("el => document.activeElement === el"), f"{slug} lost focus after save"
    author.fill("Ada Lovelace Byron")
    page.wait_for_timeout(3200)
    assert patches[-1]["author"] == "Ada Lovelace Byron"
    assert author.evaluate("el => document.activeElement === el")
    original_title = page.locator(f".{prefix}-info-card input").nth(1)
    take = page.locator(f".{prefix}-info-card input").nth(2)
    original_title.fill("Original title")
    take.fill("A one sentence review")
    page.wait_for_timeout(3200)
    assert patches[-1]["originalTitle"] == "Original title"
    assert patches[-1]["myTake"] == "A one sentence review"
    assert take.evaluate("el => document.activeElement === el")
    page.unroute(f"**/api/{slug}/**", route)


def check_save_md(page):
    doc = {"id": "test-doc", "filename": "test-doc.md", "title": "test-doc", "categoryId": "general", "createdAt": "2026-01-01", "charCount": 0, "wordCount": 0}
    content = ""
    patches = []
    gets = []

    def route(request_route):
        nonlocal content
        request = request_route.request
        path = unquote(urlparse(request.url).path)
        if path.endswith("/library"):
            body = {"categories": [{"id": "general", "name": "General", "documents": [copy.deepcopy(doc)]}], "totalDocuments": 1}
        elif request.method == "PATCH":
            patch = request.post_data_json
            patches.append(patch)
            doc["title"] = patch["title"]
            doc["id"] = patch["title"]
            doc["filename"] = patch["title"] + ".md"
            content = patch["content"]
            body = {"document": copy.deepcopy(doc), "content": content}
        else:
            gets.append(path)
            body = {"document": copy.deepcopy(doc), "content": content}
        request_route.fulfill(json=body)

    page.route("**/api/save-md/**", route)
    page.goto(f"{BASE}/save-md")
    page.wait_for_load_state("networkidle")
    page.locator(".smd-category-head").first.click()
    page.locator(".smd-doc-item").first.click()
    page.locator(".smd-workspace").wait_for()
    title = page.locator(".smd-title-input")
    title.fill("")
    title.press_sequentially("New document title", delay=15)
    assert title.evaluate("el => document.activeElement === el")
    page.wait_for_timeout(2400)
    assert len(patches) == 0
    page.wait_for_timeout(1100)
    assert len(patches) == 1, f"Save MD patches: {patches}; status: {page.locator('.smd-message').all_text_contents()}"
    assert patches[0]["title"] == "New document title"
    assert title.evaluate("el => document.activeElement === el"), "Save MD lost title focus after rename"
    assert len(gets) == 1, "Save MD fetched the renamed document and reset the editor"
    page.get_by_role("button", name="edit", exact=True).click()
    editor = page.locator(".smd-editor-pane textarea")
    editor.fill("A complete Markdown paragraph.")
    page.wait_for_timeout(3200)
    assert patches[-1]["content"] == "A complete Markdown paragraph."
    assert editor.evaluate("el => document.activeElement === el")
    page.unroute("**/api/save-md/**", route)


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    if "--save-md-only" not in sys.argv:
        check_book(page, "book-in-depth", "bid")
        check_book(page, "book-a-day", "bad")
    check_save_md(page)
    browser.close()
    print("Save MD passed." if "--save-md-only" in sys.argv else "All three editors kept focus and autosaved after 3 seconds.")
