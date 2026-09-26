import os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

out = Path(__file__).parent
base = os.environ.get("INVEST_MASTER_BASE", "http://127.0.0.1:5788")
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(f"{base}/#/app/invest-master/home")
    page.wait_for_load_state("networkidle")
    expect(page.locator(".im-home-hero h1")).to_be_visible()
    assert "10 种投资视角" in page.locator(".im-home").inner_text()
    page.screenshot(path=str(out / "desktop-home.png"), full_page=True)
    page.locator(".im-home-hero .im-button.bright").click()
    page.wait_for_load_state("networkidle")
    assert "你买到的究竟是什么" in page.locator(".im-reader-head").inner_text()
    lesson_id = page.url.rsplit("/", 1)[-1]
    content = page.request.get(f"{base}/invest-master/api/content").json()["items"]
    lesson = next(item for item in content if item["id"] == lesson_id)
    for index, item in enumerate(lesson["quiz"]):
        question = page.locator(".im-quiz-question").nth(index)
        options = question.locator(".im-quiz-options button").all()
        correct = str(item["options"][item["answer"]])
        matches = [button for button in options if button.evaluate("el => el.textContent.slice(1).trim()") == correct]
        assert len(matches) == 1, (lesson_id, item["id"], correct)
        matches[0].click()
        expect(question.locator(".im-quiz-feedback.yes p")).to_have_text(item["explanation"])
    assert page.get_by_role("button", name="提交答案").count() == 0
    page.locator(".im-reflection textarea").fill("这家公司靠订阅收费；仍需核查续费率和现金流，以及股东与债权人之间的权利顺序。" * 8)
    page.get_by_role("button", name="保存练习笔记").click()
    page.get_by_role("button", name="完成本章练习").click()
    expect(page.get_by_text("本章练习已完成")).to_be_visible()
    page.screenshot(path=str(out / "desktop-lesson.png"), full_page=True)
    page.get_by_role("button", name="记忆复习").click()
    page.wait_for_load_state("networkidle")
    expect(page.locator(".im-review-card")).to_be_visible()
    page.get_by_role("button", name="显示参考解释").click()
    page.get_by_role("button", name="记得").click()
    page.get_by_role("button", name="我的笔记").click()
    assert "续费率" in page.locator(".im-notebook-list").inner_text()
    page.get_by_role("button", name="思想对照").click()
    expect(page.locator(".im-compare-grid")).to_be_visible()
    page.get_by_role("button", name="搜索大师、概念、案例").click()
    page.locator(".im-search-input input").fill("安全边际")
    expect(page.locator(".im-search-results button").first).to_be_visible()
    page.keyboard.press("Escape")
    page.set_viewport_size({"width": 390, "height": 844})
    page.reload()
    page.wait_for_load_state("networkidle")
    page.screenshot(path=str(out / "mobile-compare.png"), full_page=True)
    page.get_by_role("button", name="打开导航").click()
    expect(page.locator(".im-sidebar.open")).to_be_visible()
    assert not errors, errors
    print("Browser QA passed: home, lesson, quiz, note, progress, review, compare, search, mobile menu.\nScreenshots:", out)
    browser.close()
