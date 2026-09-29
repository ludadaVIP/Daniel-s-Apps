# Philosophy · 哲学研习室

NodeApps 内的个人哲学学习 APP。课程和课次以 Markdown 保存，阅读答案、完成状态与稍后回顾保存在当前浏览器的 `localStorage`。不需要账户或外部服务。

## 启动

在 NodeApps 根目录运行 `npm run dev`，打开 `http://127.0.0.1:5888`，点击 **Philosophy**。生产模式可运行 `npm run desktop`。

## 当前版本

- 课程目录、课程页、Markdown 阅读页、上一课/下一课导航。
- 每节课有 3–5 个开放式问题；输入自动保存在本机，可展开参考思路。
- 完成标记、稍后回顾、课程进度和继续学习。
- 四阶段、25 门课程、160 节课全部可阅读：四门基础课程、六门历史课程、十门核心领域课程、四门专题研讨与毕业研究。
- 完成标记记录学习进度，不代表已掌握知识；每门课要求提交独立作品，完整标准见 [CURRICULUM.md](CURRICULUM.md)。答案与阶段作品保存在浏览器本机，可从首页导出或恢复 JSON 学习档案。

## 添加内容

课程路线图位于 `server/syllabus.js`，实际开放的内容位于 `content/`。每门开放课程有 `course.md`，课次是同目录下的其他 `.md` 文件。Frontmatter 的稳定 `id` 用于保存学习记录，发布后不要随意更改。发布时，课程与课次的 ID、标题、顺序必须与路线图一致；仅列在路线图中的课次不会显示为可学习内容。

课程必填：`id`、`title`、`level`、`order`、`description`。课次必填：`id`、`course`（对应课程 ID）、`title`、`order`、`estimatedMinutes`。可添加 `subtitle`、`tags`、`questions`；每道问题需 `id`、`prompt`、`guidance`。正文使用普通 Markdown。课程顺序由 `level` 和 `order` 决定，课次顺序由 `order` 决定。

修改后运行：

```bash
npm run validate:philosophy
npm test
npm run build
```

课程标准和依据见 [CURRICULUM.md](CURRICULUM.md)，原始产品规划见 [plan.md](plan.md)，工作进度见 [docs/PROGRESS.md](docs/PROGRESS.md)。
