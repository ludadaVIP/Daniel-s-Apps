# BeliefQ&A

一个用于预备信仰对话的本地网页应用。题库只从 `Questions.md` 读取；应用不会改写该文件。

每道题有四个独立 Markdown 回答层级：

1. AI 的简单回答
2. 我的回答
3. AI 的复杂回答
4. 更深层次的探讨

首次保存某道题时，会在 `answers/` 中创建以题目 ID 命名的 Markdown 文件。这个目录可直接由 Git 追踪、审阅和备份。

## 使用

在 NodeApps 根目录执行 `npm run dev`，随后从 NodeApps 工作台打开 **BeliefQ&A**。
