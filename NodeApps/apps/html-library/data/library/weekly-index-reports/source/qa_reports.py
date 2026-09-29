"""Independent checks of rendered reports and their visible weekly tables."""

from __future__ import annotations

import re
from datetime import date
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"


def numeric(s: str) -> float:
    return float(s.replace(",", "").replace("%", "").replace("+", ""))


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path=CHROME)
    page = browser.new_page(viewport={"width": 2560, "height": 1440}, device_scale_factor=1)
    errors = []
    page.on("pageerror", lambda err: errors.append(str(err)))
    for code in ["sp500", "nasdaq100"]:
        for year in range(2021, 2026):
            path = ROOT / f"{code}_{year}.html"
            page.goto(path.as_uri())
            assert page.title().startswith(str(year)), path
            visible = page.locator("#weekly-table tbody tr")
            count = visible.count()
            assert count in (52, 53), (path, count)
            assert len(page.locator(".yearnav a").all()) == 10
            assert page.locator(".chart").count() == 5
            assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), f"horizontal overflow {path}"
            previous = None
            for i in range(count):
                cells = [s.strip() for s in visible.nth(i).locator("th,td").all_text_contents()]
                assert re.fullmatch(r"W\d\d", cells[0])
                prior_date, close_date = date.fromisoformat(cells[2]), date.fromisoformat(cells[4])
                prior, close = numeric(cells[3]), numeric(cells[5])
                change, ret = numeric(cells[6]), numeric(cells[7])
                assert close_date.year == year
                assert prior_date < close_date
                assert abs(change - (close-prior)) < .011, (path, i, cells)
                assert abs(ret - ((close/prior-1)*100)) < .0051, (path, i, cells)
                if previous is not None:
                    assert abs(prior-previous) < .001, (path, i)
                previous = close
            page.locator("#filter").fill("W03")
            assert page.locator("#weekly-table tbody tr:visible").count() == 1
            page.locator("#filter").fill("")
            assert page.locator("#weekly-table tbody tr:visible").count() == count
            for link in page.locator(".yearnav a").all():
                assert (ROOT / link.get_attribute("href")).exists()
            print(f"PASS {path.name}: {count} weeks")
    assert not errors, errors
    browser.close()
