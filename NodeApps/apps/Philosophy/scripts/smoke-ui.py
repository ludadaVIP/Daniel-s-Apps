"""Run against the NodeApps dev server with Playwright installed."""

import os

from playwright.sync_api import expect, sync_playwright


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto("http://127.0.0.1:5888/#/app/philosophy")
    page.locator(".ph-hero-copy h1").wait_for(timeout=30000)
    curriculum_response = page.request.get("http://127.0.0.1:5888/philosophy/api/curriculum")
    assert curriculum_response.ok
    curriculum = curriculum_response.json()
    assert "body" not in curriculum["courses"][0]["lessons"][0]
    assert len(curriculum["roadmap"]) == 4
    assert sum(len(course["lessons"]) for level in curriculum["roadmap"] for course in level["courses"]) == 160
    assert sum(len(course["lessons"]) for course in curriculum["courses"]) == 160
    formal_lesson = page.request.get("http://127.0.0.1:5888/philosophy/api/lessons/truth-tables")
    assert formal_lesson.ok and "语义蕴涵" in formal_lesson.json()["title"]
    comparative_lesson = page.request.get("http://127.0.0.1:5888/philosophy/api/lessons/cross-tradition-self")
    assert comparative_lesson.ok and "比较哲学" in comparative_lesson.json()["body"]
    medieval_lesson = page.request.get("http://127.0.0.1:5888/philosophy/api/lessons/faith-and-reason-medieval")
    assert medieval_lesson.ok and "公开论辩" in medieval_lesson.json()["body"]
    modern_lesson = page.request.get("http://127.0.0.1:5888/philosophy/api/lessons/hume-self")
    assert modern_lesson.ok and "知觉之束" in modern_lesson.json()["subtitle"]
    nineteenth_lesson = page.request.get("http://127.0.0.1:5888/philosophy/api/lessons/nietzsche-genealogy")
    assert nineteenth_lesson.ok and "谱系研究价值的生成" in nineteenth_lesson.json()["body"]
    twentieth_lesson = page.request.get("http://127.0.0.1:5888/philosophy/api/lessons/poststructuralism-dialogue")
    assert twentieth_lesson.ok and "共享问题" in twentieth_lesson.json()["body"]
    epistemology_lesson = page.request.get("http://127.0.0.1:5888/philosophy/api/lessons/knowledge-gettier")
    assert epistemology_lesson.ok and "得到工作的人口袋里有十枚硬币" in epistemology_lesson.json()["body"]
    metaphysics_lesson = page.request.get("http://127.0.0.1:5888/philosophy/api/lessons/identity-and-persistence")
    assert metaphysics_lesson.ok and "忒修斯之船" in metaphysics_lesson.json()["body"]
    ethics_lesson = page.request.get("http://127.0.0.1:5888/philosophy/api/lessons/moral-luck-case")
    assert ethics_lesson.ok and "道德运气" in ethics_lesson.json()["body"]
    political_lesson = page.request.get("http://127.0.0.1:5888/philosophy/api/lessons/domination-and-global-justice")
    assert political_lesson.ok and "跨界防洪协定" in political_lesson.json()["body"]
    mind_lesson = page.request.get("http://127.0.0.1:5888/philosophy/api/lessons/embodied-mind")
    assert mind_lesson.ok and "奥托" in mind_lesson.json()["body"]
    science_lesson = page.request.get("http://127.0.0.1:5888/philosophy/api/lessons/values-in-science")
    assert science_lesson.ok and "归纳风险" in science_lesson.json()["body"]
    language_lesson = page.request.get("http://127.0.0.1:5888/philosophy/api/lessons/private-language")
    assert language_lesson.ok and "私人语言" in language_lesson.json()["body"]
    religion_lesson = page.request.get("http://127.0.0.1:5888/philosophy/api/lessons/religious-pluralism")
    assert religion_lesson.ok and "宗教多元" in religion_lesson.json()["body"]
    aesthetics_lesson = page.request.get("http://127.0.0.1:5888/philosophy/api/lessons/aesthetic-experience")
    assert aesthetics_lesson.ok and "书画" in aesthetics_lesson.json()["body"]
    social_lesson = page.request.get("http://127.0.0.1:5888/philosophy/api/lessons/comparative-synthesis")
    assert social_lesson.ok and "翻译附录" in social_lesson.json()["body"]
    seminar_lesson = page.request.get("http://127.0.0.1:5888/philosophy/api/lessons/free-will-paper")
    assert seminar_lesson.ok and "答辩" in seminar_lesson.json()["body"]
    consciousness_lesson = page.request.get("http://127.0.0.1:5888/philosophy/api/lessons/consciousness-paper")
    assert consciousness_lesson.ok and "论证图" in consciousness_lesson.json()["body"]
    meaning_lesson = page.request.get("http://127.0.0.1:5888/philosophy/api/lessons/meaning-paper")
    assert meaning_lesson.ok and "立场变化" in meaning_lesson.json()["body"]
    ai_lesson = page.request.get("http://127.0.0.1:5888/philosophy/api/lessons/ai-knowledge-and-agency")
    assert ai_lesson.ok and "公共论文" in ai_lesson.json()["body"]
    capstone_lesson = page.request.get("http://127.0.0.1:5888/philosophy/api/lessons/defense-and-reflection")
    assert capstone_lesson.ok and "外部读者" in capstone_lesson.json()["body"]
    assert page.request.get("http://127.0.0.1:5888/philosophy/api/lessons/no-such-lesson").status == 404
    if os.getenv("PHILOSOPHY_SCREENSHOT_DIR"):
        page.screenshot(path=os.path.join(os.environ["PHILOSOPHY_SCREENSHOT_DIR"], "philosophy-home.png"), full_page=True)
    page.get_by_role("button", name="开始第一课").click()
    page.locator(".ph-prose h2").first.wait_for()
    assert page.locator(".ph-prose").get_by_text("一个不需要大词的例子").is_visible()
    if os.getenv("PHILOSOPHY_SCREENSHOT_DIR"):
        page.screenshot(path=os.path.join(os.environ["PHILOSOPHY_SCREENSHOT_DIR"], "philosophy-reader.png"))
    page.locator("#ph-answer-classify").fill("事实调查和规范判断需要分开。")
    page.reload()
    page.locator("#ph-answer-classify").wait_for()
    assert "规范判断" in page.locator("#ph-answer-classify").input_value()
    page.get_by_role("button", name="查看参考思路").first.click()
    assert page.locator(".ph-guidance").first.is_visible()
    page.get_by_role("button", name="稍后回顾").click()
    page.get_by_role("button", name="标记完成").click()
    page.get_by_role("button", name="回顾", exact=True).click()
    assert "上次研习" in page.locator(".ph-lesson-name small").first.inner_text()
    page.get_by_role("button", name="Philosophy 首页").click()
    page.locator(".ph-current-card").wait_for()
    assert page.locator(".ph-current-card").get_by_text("观点与论证").is_visible()
    page.get_by_role("button", name="课程", exact=True).click()
    expect(page.locator(".ph-roadmap-course")).to_have_count(25)
    if os.getenv("PHILOSOPHY_SCREENSHOT_DIR"):
        page.screenshot(path=os.path.join(os.environ["PHILOSOPHY_SCREENSHOT_DIR"], "philosophy-roadmap.png"))
    page.get_by_placeholder("搜索课次、主题或关键词").fill("有效性与健全性")
    expect(page.locator(".ph-lesson-row")).to_have_count(1)
    page.get_by_placeholder("搜索课次、主题或关键词").fill("认识运气")
    assert page.locator(".ph-lesson-row").get_by_text("知识与盖梯尔问题").is_visible()
    page.goto("http://127.0.0.1:5888/#/app/philosophy/course/capstone")
    page.locator(".ph-artifact-review summary").click()
    assert page.get_by_text("课程导读").is_visible()
    page.get_by_placeholder("例如：论文标题、文件位置、版本日期").fill("毕业论文初稿 v1")
    page.get_by_placeholder("列出证明、原典段落、论文页码或作品中的关键证据").fill("核心论证见第 3 节")
    page.locator(".ph-artifact-rubric select").first.select_option("2")
    page.reload()
    page.locator(".ph-artifact-review summary").click()
    assert page.get_by_placeholder("例如：论文标题、文件位置、版本日期").input_value() == "毕业论文初稿 v1"
    assert page.get_by_placeholder("列出证明、原典段落、论文页码或作品中的关键证据").input_value() == "核心论证见第 3 节"
    assert page.locator(".ph-artifact-rubric select").first.input_value() == "2"
    page.get_by_role("button", name="Philosophy 首页").click()
    with page.expect_download() as backup_download:
        page.get_by_role("button", name="导出档案").click()
    backup_path = backup_download.value.path()
    page.evaluate("localStorage.removeItem('nodeapps.philosophy.progress.v1')")
    page.reload()
    page.locator(".ph-backup input[type=file]").set_input_files(str(backup_path))
    assert page.get_by_text("学习档案已恢复，原有本机记录已替换。").is_visible()
    page.locator(".ph-backup input[type=file]").set_input_files({"name": "other.json", "mimeType": "application/json", "buffer": b'{"version":1,"lessons":{}}'})
    assert page.get_by_text("这不是可识别的 Philosophy 学习档案。").is_visible()
    page.goto("http://127.0.0.1:5888/#/app/philosophy/course/capstone")
    page.locator(".ph-artifact-review summary").click()
    assert page.get_by_placeholder("例如：论文标题、文件位置、版本日期").input_value() == "毕业论文初稿 v1"
    page.get_by_role("button", name="课程", exact=True).click()
    page.set_viewport_size({"width": 390, "height": 844})
    page.get_by_placeholder("搜索课次、主题或关键词").fill("")
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    if os.getenv("PHILOSOPHY_SCREENSHOT_DIR"):
        page.screenshot(path=os.path.join(os.environ["PHILOSOPHY_SCREENSHOT_DIR"], "philosophy-mobile.png"), full_page=True)
    assert not errors, errors
    print("Philosophy UI smoke passed: navigation, Markdown, autosave, artifact review, backup restore, search, mobile width.")
    browser.close()
