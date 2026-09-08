# 内容写作规范

每篇文章是 UTF-8 Markdown。概念存放于对应领域目录：`human-nature`、`psychology`、`society`、`economics`、`industries`、`investing`；历史案例存放于 `cases/`，通过 `category` 归类。`README.md` 不会被当成文章加载。

```yaml
---
id: example-concept
title: 可证伪的判断
category: psychology
type: concept
summary: 写出什么证据会让你改变观点，才能把叙事变成可检验的判断。
minutes: 6
difficulty: intermediate
tags: [证据, 决策, 认知偏差]
related: []
---
```

字段约定：

- `id`：全库唯一，只用小写字母、数字和单个连字符；建议与文件名一致。用户收藏和阅读记录使用这个 ID，请保持稳定。
- `category`：六个目录名之一。
- `type`：概念用 `concept`，案例用 `case`。
- `summary`：一句描述文章要解决的问题，避免营销式口号。
- `minutes`：实际阅读时间估计，1–120 分钟。
- `difficulty`：建议 `beginner`、`intermediate`、`advanced`。
- `tags`：字符串数组。
- `related`：已有文章 ID 的数组，链接必须存在；不需要关联时填 `[]`。

概念正文建议依次包括：核心定义、因果机制、具体场景、投资应用、常见误区与反例、可操作的自查、思考练习、参考资料。正文不能只重述定义，应明确这个框架在什么条件下有效、什么时候会失效。

案例须采用六个固定二级标题：`事件与当时的信息`、`决策与因果机制`、`结果与证据`、`反事实与适用边界`、`判断练习`、`来源与核验`。区分当时已知信息和事后才知道的信息；优先链接原始论文、监管机构、央行、调查报告或公司披露。不要用未核验的精确数字充当证据，也不要从单一历史案例直接推导今天的交易结论。

历史案例额外必需字段：

```yaml
eventKey: canonical-event-name
learningObjective: 说明读者读完后能执行的具体判断方法，以及它解决的信息盲点。
sources:
  - title: 原始报告名称
    url: https://example.org/report
    claim: 此文件支持的具体历史事实；不是笼统地写“参考资料”。
  - title: 另一份资料名称
    url: https://example.org/another-report
    claim: 第二份资料支持的事实或用于制衡第一种解释的证据。
```

`eventKey` 是事件的规范标识，禁止靠换标题、换分类重复收录同一个研究对象。研究同一时代的不同对象时，必须明确不同问题，例如互联网行业的融资反馈与亚马逊本身的现金跑道。重复背景应简短交代，核心论证和练习必须不同。

## 发布前检查

1. 先检查全库目录，写下新案例的学习目标、对应机制，以及与已有案例的区别。
2. 阅读来源原文，记录“哪项事实由哪份资料支持”。区分执法指控、认定事实、后续结果和作者解释；打不开的来源不能写成已经核验。
3. 完成正文后运行 `node scripts/check-content.mjs --draft`。草稿检查不等于编辑验收。
4. 另一轮编辑逐篇审读，并在 `docs/reviews/*-editorial.json` 记录具体认知价值、边界、区别和来源核验结果。审读者必须阅读正文，不能根据脚本字数自动盖章。只有确认后才使用 `contentHash(article)` 记录当前版本哈希。
5. 运行 `npm run check:content` 和 `npm test`。`npm run build` 会自动执行发布检查；没有有效审读记录的内容不能通过构建。

程序会检查六类各至少 10 篇、事件标识和标题重复、相同长段落、正文近似重复、来源与正文引用是否齐全，以及六个章节是否有实质内容。来源应来自两份不同文件；同一论文的两个镜像不能当作两份资料，更不能声称是独立重复证据。程序可识别同名资料的镜像候选，编辑还需核对文件实质。正文至少 750 个汉字、五个实质章节各至少 90 个汉字只是最低防线，不能用套话凑数。两篇文章共同使用多份来源或相似度较高，会列为待审读候选；这不等于已经证实重复。

编辑记录格式如下（示意字段不可直接作为真实审读记录）：

```json
{
  "id": "case-id",
  "hash": "调用 contentHash(article) 获得的当前版本摘要",
  "decision": "approved",
  "reviewer": "本轮审读者",
  "checkedAt": "YYYY-MM-DD",
  "cognitiveValue": "读者获得哪一种新的可操作判断方法",
  "limitations": "因果证据的限制、反例、不能直接迁移的条件",
  "distinctness": "与哪篇邻近案例有什么实质区别",
  "sourceVerification": "核对过的原文及其支持程度，未核实部分如何处理"
}
```

关键元数据或正文改变后，哈希会失配，必须重新审读。报告输出到 `artifacts/content-audit.json`。自动规则不能验证历史因果、测量读者学习效果，也无法发现所有语义改写式重复，最终仍需要编辑判断和实际训练反馈。

支持标准 Markdown、表格、列表、引用与普通链接。正文原始 HTML 不执行。建议用 Markdown 标题组织长文，避免把整篇内容写成表格。

新增或修改后运行：

```sh
npm test
```

测试与启动过程会检查必填字段、唯一 ID、正文长度和关联是否存在。内容在启动时读入，因此修改 Markdown 后需要重启 Node 服务。
