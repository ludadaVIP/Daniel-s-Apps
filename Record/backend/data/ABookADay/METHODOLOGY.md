# A Book a Day 新增书籍规则

新增一本书时，每本书放在独立目录 `<book-id>/book.json`，并保持字段完整、内容原创、可朗读。

## 必填字段

- `id` 必须与目录名一致，使用英文小写、数字和短横线。
- `shelfId` 使用现有书架：`wantToRead`、`reading`、`read`、`collection`。
- `title`、`author`、`originalTitle`、`year`、`language`、`tags`、`myTake` 要尽量准确。
- `sections` 必须包含：`oneLiner`、`synopsis`、`points`、`mindmap`、`quotes`、`notes`、`narration`。

## 内容质量

- 内容必须是原创整理和讲解，不要大段摘抄原书。
- `quotes` 若不能确认原文，应写成“可记句 / 非原文摘抄”，避免伪造引用。
- `synopsis` 固定三段：背景、主张、适合谁读。
- `points` 写 7-12 条，每条包含观点和实际意义。
- `mindmap` 使用缩进式 Markdown，至少 3 层。
- `notes` 要包含个人化应用、跨书对照或反思问题。

## 朗读稿硬规则

- `narration` 必须先写 `## 朗读大纲`，再写 `## 内容结构`，最后写 `## 完整朗读正文`。
- 正文要一次性成稿，不允许写短后补。
- 完整朗读正文必须超过 3000 个中文字符；如果校验不足 3000，删除并重写。
- 超过 3000 字没有上限，优先保证思想密度、结构完整、例子清楚和口语可听。
- 朗读稿要适合 TTS：句子不要过长，段落之间自然转场，避免表格和复杂符号。

## 校验

新增或修改后至少检查：

- `book.json` 是合法 JSON。
- 目录名和 `id` 一致。
- 所有 `sections` 字段都存在且非空。
- `narration` 包含三段结构标题。
- `完整朗读正文` 字数超过 3000。
