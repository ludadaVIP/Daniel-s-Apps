import json
import sys
import urllib.request
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

sys.stdout.reconfigure(encoding="utf-8")
OUT = Path(__file__).parent
URL = "http://127.0.0.1:5888/#/app/my-holdings"
BASE = "http://127.0.0.1:5888/my-holdings/api"
state = json.load(urllib.request.urlopen(BASE + "/state"))
errors = []

def open_holdings(page):
    page.set_default_timeout(10000)
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(URL, wait_until="networkidle")
    page.wait_for_selector(".mh-sidebar")
    if page.locator(".mh-overlay").count():
        page.keyboard.press("Escape")
    page.get_by_role("button", name="我的持仓", exact=True).click()
    page.wait_for_selector(".mh-exposure-table")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1840, "height": 1200}, permissions=["clipboard-read", "clipboard-write"])
    page = context.new_page()
    open_holdings(page)
    widths = page.locator(".mh-positions-table").evaluate_all("ts => ts.map(t => [...t.querySelectorAll('thead th')].map(c => Math.round(c.getBoundingClientRect().width)))")
    assert len(widths) == 2 and widths[0] == widths[1], widths
    assert page.locator(".mh-holding-price").count() == 7
    assert page.locator(".mh-holding-price a").count() == 7
    assert page.locator(".mh-positions-table thead th").filter(has_text="持有数量 / 股").count() == 2
    assert page.locator(".mh-exposure-table > tbody > tr").count() == 10
    expect(page.locator(".mh-lookthrough-summary")).to_contain_text("$110,007.79")
    expect(page.locator(".mh-exposure-table tbody tr").first).to_contain_text("$9,267.11")
    page.locator(".mh-account-stack").screenshot(path=str(OUT / "accounts-desktop.png"))
    page.locator(".mh-lookthrough").screenshot(path=str(OUT / "lookthrough-desktop.png"))
    page.locator(".mh-exposure-toggle").first.click()
    expect(page.locator(".mh-exposure-detail")).to_contain_text("$6,786.72")
    expect(page.locator(".mh-exposure-detail")).to_contain_text("$2,137.14")
    assert page.locator(".mh-exposure-toggle").first.get_attribute("aria-expanded") == "true"
    page.locator(".mh-exposure-toggle").first.click()
    page.get_by_label("穿透账户").select_option("a1")
    expect(page.locator(".mh-lookthrough-summary")).to_contain_text("$53,264.89")
    page.get_by_label("穿透账户").select_option("a2")
    expect(page.locator(".mh-lookthrough-summary")).to_contain_text("$56,742.90")
    page.get_by_label("穿透账户").select_option("all")
    page.get_by_label("搜索持仓").fill("IBKR")
    expect(page.locator(".mh-lookthrough-summary")).to_contain_text("$110,007.79")
    assert page.locator(".mh-positions-table tbody tr").count() == 1
    page.get_by_label("搜索持仓").fill("")
    page.get_by_role("button", name="复制复核任务", exact=True).click()
    assert "fund-holdings.json" in page.evaluate("navigator.clipboard.readText()")
    page.locator(".mh-lookthrough-method summary").click()
    assert page.locator(".mh-lookthrough-sources > div").count() == 5
    expect(page.locator(".mh-lookthrough-sources")).to_contain_text("2026-09-30")
    page.get_by_role("button", name="切换为深色模式", exact=True).click()
    page.wait_for_function("document.documentElement.dataset.theme === 'dark'")
    page.locator(".mh-lookthrough").screenshot(path=str(OUT / "lookthrough-dark.png"))
    context.close()

    mobile = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, device_scale_factor=1)
    page = mobile.new_page()
    open_holdings(page)
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
    assert page.locator(".mh-exposure-table").evaluate("e => e.scrollWidth <= e.clientWidth")
    page.locator(".mh-lookthrough").screenshot(path=str(OUT / "lookthrough-mobile.png"))
    page.locator(".mh-exposure-toggle").first.click()
    expect(page.locator(".mh-exposure-detail")).to_contain_text("$6,786.72")
    mobile.close()

    simulated = json.loads(json.dumps(state))
    simulated["holdings"].append({"id": "ui-only-vgt", "symbol": "VGT", "name": "Vanguard Information Technology ETF", "currency": "USD", "accountId": "a1", "quantity": 10, "price": 100, "marketValue": 1000, "cost": 1000, "averagePrice": 100, "sector": "指数基金"})
    simulated["revision"] += 100000
    mock = browser.new_context(viewport={"width": 1840, "height": 1200})
    def intercept(route):
        if route.request.url.split("?")[0].endswith("/api/state") and route.request.method == "GET":
            route.fulfill(json=simulated)
        elif route.request.method != "GET":
            # This scenario is entirely in-browser and cannot write to the real account.
            route.fulfill(json={"state": simulated})
        else:
            route.continue_()
    mock.route("**/my-holdings/api/**", intercept)
    page = mock.new_page()
    open_holdings(page)
    expect(page.locator(".mh-lookthrough-summary")).to_contain_text("$111,007.79")
    expect(page.locator(".mh-exposure-table tbody tr").first).to_contain_text("$9,442.90")
    page.locator(".mh-exposure-toggle").first.click()
    expect(page.locator(".mh-exposure-detail")).to_contain_text("VGT")
    expect(page.locator(".mh-exposure-detail")).to_contain_text("$175.79")
    mock.close()
    browser.close()

assert not errors, errors
report = {"columnWidths": widths, "desktop": "passed", "mobile390": "passed", "darkMode": "passed", "accountScope": "passed", "searchDoesNotTruncateExposure": "passed", "clipboardReview": "passed", "simulatedVGTWithoutRealWrites": "passed", "pageErrors": errors}
(OUT / "ui-verification.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
print(json.dumps(report, ensure_ascii=False))
