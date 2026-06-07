# Book In Depth — 自动化工作流

> 这份文件说明的是：**用户怎么加书 + Claude 怎么自动处理**。
> 它和 METHODOLOGY.md（怎么写）+ DESIGN.md（写什么）共同构成 Book In Depth 的完整规范。

---

## 1. 工作流目标

**用户的痛点**：
1. 想读书但没时间一页一页读 → 用 AI 帮读
2. 之前每次都要发书名 + 守在电脑前等 + 多次点 Allow → **浪费时间**
3. 希望"我有新书想读 → 加到列表 → AI 自己看到就做"——异步、解耦

**解决方案**：
1. **队列文件**：`books_queue.xlsx`——用户可以在 Excel 里随时加书
2. **前端展示**：在 Book In Depth 应用里有一个"队列"区，能看到 pending / done
3. **自动循环**：Claude `/loop 5h` 每 5 小时跑一次——发现新 pending → 按 METHODOLOGY.md 写

---

## 2. 队列文件结构

文件路径：`backend/data/BookInDepth/books_queue.xlsx`

列定义：

| 列名 | 类型 | 说明 |
|---|---|---|
| `序号` | 整数 | 自动编号，无业务含义 |
| `中文标题` | 文本 | **必填**——例：「人类简史」 |
| `作者` | 文本 | 例：「尤瓦尔·赫拉利」 |
| `原标题` | 文本 | 例：「Sapiens: A Brief History of Humankind」 |
| `年份` | 文本 | 例：「2011」 |
| `状态` | 文本 | `pending` / `in_progress` / `done` / `skip` |
| `添加日期` | 文本 | YYYY-MM-DD |
| `完成日期` | 文本 | YYYY-MM-DD（done 时填写） |
| `book_id` | 文本 | 完成后填——指向 `BookInDepth/<book_id>/` 文件夹 |
| `备注` | 文本 | 用户给 Claude 的额外说明（特殊要求 / 译本偏好 / 字数下限） |

**用户怎么加书**：
1. 用 Excel 打开 `books_queue.xlsx`
2. 在底部追加一行，至少填**中文标题**
3. 状态写 `pending`
4. 保存关闭

就这样。其他字段会被 Claude 在处理时补全。

---

## 3. Claude 自动循环

**循环配置**：
- 命令：`/loop 5h <book-queue-scan-prompt>`
- 频率：每 5 小时
- 输入：`books_queue.xlsx`
- 比对：现有 `BookInDepth/<book_id>/` 文件夹列表 + 队列中 `status=done` 的行

**每次循环 Claude 做什么**：

```
Step 1: 读取 books_queue.xlsx
Step 2: 找出所有 status=pending 的行
Step 3: 如果没有 pending → 什么都不做，结束
Step 4: 如果有 pending：
   a. 取第一本 pending 书
   b. 把状态改为 in_progress，保存 xlsx
   c. 按 METHODOLOGY.md 完整流程写——一次写完，目标 ≥10,000 CJK
   d. 写入 BookInDepth/<book_id>/book.json
   e. 在 xlsx 把状态改为 done，填完成日期 + book_id
Step 5: 继续下一本 pending（如果时间窗口允许）
Step 6: 完成后结束本次循环
```

---

## 4. 验收标准（严格）

每本书生成后必须满足：

| 检查项 | 标准 |
|---|---|
| **字数** | narration 字段的 CJK 字符 ≥ 10,000 |
| **结构** | 至少 5 个 `## 一级标题`——前端 TOC 才有意义 |
| **思维导图** | mindmap 字段非空——根节点 = 书名 |
| **作者背景** | 必须有一节专讲作者生平 + 写作背景 |
| **核心论点** | 必须有完整的论证链条复述（不是金句堆砌） |
| **客观性** | 80% 是原书内容复述，不是个人感悟 |
| **元信息** | title / author / originalTitle / year / language / tags 完整 |

**自动判定**：
- 字数 < 10,000 → 删除 book.json 整个重新写（不打补丁）
- 字数 ≥ 10,000 且其他项达标 → 标记 done

---

## 5. 队列状态语义

| 状态 | 含义 |
|---|---|
| `pending` | 用户已加，未开始 |
| `in_progress` | Claude 正在写——避免重复处理 |
| `done` | 已生成 book.json，验收通过 |
| `skip` | 用户决定跳过 / 暂不处理 |
| `failed` | Claude 多次尝试未达标——需要人工干预 |

---

## 6. 工作流的开放问题

**6.1 同名书重复加？**
→ Claude 检测中文标题完全一致 + 已有 done 记录 → 跳过，状态改 `skip`，备注"已存在"

**6.2 译本差异？**
→ 备注列写明（例：「徐立妍译本」「商务印书馆 1985 版」），Claude 在元信息里反映

**6.3 字数严重不够，多次重写仍不达标？**
→ 标记 `failed` + 备注原因——通常是知识激活不够厚——下次手动补充信息再启动

**6.4 用户想取消正在处理的书？**
→ 直接把状态改成 `skip`——Claude 下次循环会跳过

---

## 7. 文件位置一览

```
backend/data/BookInDepth/
├── DESIGN.md              # 写什么（定位、格式、质量基线）
├── METHODOLOGY.md         # 怎么写（角色、流程、铁律）
├── WORKFLOW.md            # ★★ 本文件 — 自动化流程
├── books_queue.xlsx       # ★★ 用户编辑的队列
├── shelves.json           # 书架定义
└── <book-id>/
    └── book.json          # 单本书的产出
```

---

## 8. 一句话总结

> **用户加书 → Claude 5 小时一次自动扫 → 发现新书自动写 → 用户随时来看产出。**
>
> 不再需要用户守在电脑前。
