from playwright.sync_api import sync_playwright

MARKDOWN = '''# 粘贴测试

> 这是引用内容。

- [x] 已完成
- [ ] 待完成

| 经文 | 主题 |
| --- | --- |
| 罗马书 5:8 | 恩典 |

行内公式 $E=mc^2$，以及：

$$x^2 + y^2 = z^2$$

```javascript
const grace = true;
```
'''
BRIEF = '## 保留的 AI 简答\n\n这一层不应随“我的回答”一同删除。'

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 960})
    errors = []
    page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
    page.goto("http://127.0.0.1:5888/#/app/belief-qa?question=section-01-question-001")
    page.wait_for_load_state("networkidle")
    page.wait_for_selector(".bqa-layer-picker button")

    layers = page.locator(".bqa-layer-picker button")
    assert "我的回答" in layers.nth(0).inner_text()
    assert "AI 的简单回答" in layers.nth(1).inner_text()
    assert page.locator(".bqa-answer-context p").inner_text().startswith("01 · 我的回答")
    assert page.get_by_role("button", name="删除当前层回答").is_disabled()

    page.get_by_role("button", name="编辑").click()
    page.locator("#bqa-markdown").evaluate("""(node, text) => {
        const clipboard = new DataTransfer();
        clipboard.setData('text/plain', text.replace('- [x]', '• [x]'));
        node.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: clipboard }));
    }""", MARKDOWN)
    assert page.locator("#bqa-markdown").input_value().startswith("# 粘贴测试")
    assert "- [x] 已完成" in page.locator("#bqa-markdown").input_value()
    page.wait_for_timeout(1200)
    preview = page.locator(".bqa-live-preview")
    assert preview.locator("table").count() == 1
    assert preview.locator("input[type=checkbox]").count() == 2
    assert preview.locator(".katex").count() >= 1
    assert preview.locator("pre code").count() == 1
    page.screenshot(path="artifacts/belief-qa-markdown-preview.png", full_page=True)

    page.get_by_role("button", name="阅读").click()
    page.wait_for_selector(".bqa-markdown table")

    layers.nth(1).click()
    page.get_by_role("button", name="编辑").click()
    page.locator("#bqa-markdown").fill(BRIEF)
    page.wait_for_timeout(1200)
    page.get_by_role("button", name="阅读").click()
    assert "保留的 AI 简答" in page.locator(".bqa-answer-panel").inner_text()

    layers.nth(0).click()
    page.on("dialog", lambda dialog: dialog.accept())
    page.get_by_role("button", name="删除当前层回答").click()
    page.wait_for_timeout(400)
    assert "这里还没有内容。" in page.locator(".bqa-answer-panel").inner_text()
    layers.nth(1).click()
    assert "保留的 AI 简答" in page.locator(".bqa-answer-panel").inner_text()
    page.get_by_role("button", name="删除当前层回答").click()
    page.wait_for_timeout(400)
    assert "这里还没有内容。" in page.locator(".bqa-answer-panel").inner_text()
    assert not errors, errors
    browser.close()

print("BeliefQ&A browser check passed: default layer, GFM, math, code, autosave, and deletion.")
