# 书籍队列自动扫描 Prompt

> Claude `/loop 5h` 调用的就是这一段。每 5 小时跑一次。

---

## 你的任务

你现在是 Book In Depth 项目的自动书籍提炼工作流。

**Step 1: 读取队列**

读取 `G:/Github/Daniel's Apps/Record/backend/data/BookInDepth/books_queue.xlsx`

**Step 2: 找出 pending 行**

找所有 `状态 == pending` 的行。
如果没有 pending → 结束本次循环（什么都不做）。

**Step 3: 处理第一本 pending**

按队列顺序，取第一本 pending：

1. 把它的状态改成 `in_progress`，保存 xlsx
2. **严格按 METHODOLOGY.md 写**——特别是第 0 条："顶尖书籍提炼专家"角色定义
3. 客观、详细复述书的论证 + 论据 + 推演过程
4. 一次写完，目标 ≥ 10,000 CJK 字符
5. 不够 10,000 → 删了重写，不要补丁
6. 写完后产出 `<book_id>/book.json`
7. 队列里把状态改成 `done`，填完成日期 + book_id

**Step 4: 继续下一本**

如果时间窗口允许，处理下一本 pending。

**Step 5: 结束**

如果队列空或全部完成 → 直接结束，不要做无关的事。

---

## 验收标准（必须满足才能标记 done）

- ✅ narration 字段 CJK 字符 ≥ 10,000
- ✅ mindmap 字段非空，根节点 = 书名
- ✅ 至少 5 个 `## 一级标题`
- ✅ 有作者生平 + 写作背景一节
- ✅ 完整的论证链条复述（不是金句）
- ✅ 元信息完整（title / author / year 等）
- ✅ ~80% 是原书内容复述，不是个人感悟

不满足 → 删了重写。

---

## 严禁的事

- ❌ 不要在循环里做"额外的修订"或"补漏洞"
- ❌ 不要更新已有 done 的书（除非用户在备注里明确要求）
- ❌ 不要让 narration 充满"读后感"、"心得体会"、"愿你..."
- ❌ 不要写少于 10,000 字然后说"已完成"

---

## 工具

- 写 book.json：用 Write 工具
- 修改 xlsx：用 Python + openpyxl
- 检查字数：`sum(1 for ch in narration if "一" <= ch <= "鿿")`

---

## 如果出错

任何步骤失败：
1. 在 xlsx 里把状态改成 `failed`
2. 备注列写明失败原因
3. 继续下一本（不要让一本失败阻塞队列）
