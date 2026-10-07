"""Browser check for Save MD category dialogs, using mocked APIs only."""

import copy
from urllib.parse import unquote, urlparse

from playwright.sync_api import sync_playwright


categories = [
    {"id": "english", "name": "English", "documents": []},
    {"id": "spanish", "name": "Spanish", "documents": []},
]


def route_request(route):
    request = route.request
    path = unquote(urlparse(request.url).path)
    if path.endswith("/library"):
        route.fulfill(json={"categories": copy.deepcopy(categories), "totalDocuments": 0})
    elif path.endswith("/categories") and request.method == "POST":
        name = request.post_data_json["name"]
        category = {"id": "test-category", "name": name, "documents": []}
        categories.append(category)
        route.fulfill(status=201, json=category)
    elif path.endswith("/categories/test-category") and request.method == "PATCH":
        categories[-1]["name"] = request.post_data_json["name"]
        route.fulfill(json=copy.deepcopy(categories[-1]))
    elif path.endswith("/categories/test-category") and request.method == "DELETE":
        categories.pop()
        route.fulfill(json={"deletedId": "test-category"})
    else:
        route.fulfill(status=404, json={"error": "Unexpected test request"})


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    native_dialogs = []
    page.on("dialog", lambda dialog: (native_dialogs.append(dialog.type), dialog.dismiss()))
    page.route("**/api/save-md/**", route_request)
    page.goto("http://127.0.0.1:5175/save-md")
    page.wait_for_load_state("networkidle")

    page.get_by_role("button", name="Category", exact=True).click()
    modal = page.get_by_role("dialog")
    assert modal.is_visible()
    modal.get_by_role("textbox", name="分类名称").fill("Test category")
    modal.get_by_role("button", name="创建分类").click()
    page.get_by_role("button", name="Test category 0").wait_for()

    section = page.locator(".smd-category").filter(has_text="Test category")
    section.get_by_role("button", name="Rename").click()
    modal.get_by_role("textbox", name="分类名称").fill("Renamed category")
    modal.get_by_role("button", name="保存名称").click()
    page.get_by_role("button", name="Renamed category 0").wait_for()

    section = page.locator(".smd-category").filter(has_text="Renamed category")
    section.get_by_role("button", name="Delete").click()
    assert "Renamed category" in modal.inner_text()
    modal.get_by_role("button", name="删除分类").click()
    page.get_by_role("button", name="Renamed category 0").wait_for(state="detached")
    page.reload()
    page.wait_for_load_state("networkidle")
    assert page.get_by_role("button", name="Renamed category 0").count() == 0
    assert native_dialogs == [], native_dialogs
    browser.close()
