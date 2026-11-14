# S05 独立代码与完整性审查

审查日期：2026-11-14。审查人：`s5_code_integrity_review`，与内容作者、科学审阅和浏览器验收人员分离。

**结论：本次代码逻辑与注册完整性审查通过；未新增未关闭的 P1/P2 代码问题。** 浏览器人员已另报 L106/L110 双语底部标签边界、L107 图例压线、L113 英文节点文字超框，仍由根流程协调修复和实际截图复测。本结论不关闭这些可见问题，不代表最终技术验收全部通过。

## 实读范围

以下路径均相对 `biology/`；完整文件与定向源码阅读分开列明，未以测试绿代替源码判断。

- 完整阅读：父目录 `../../AGENTS.md`、`S5_DELIVERY.md`、`S5_SCIENCE_REVIEW.md`；`plan.md` 的 S5、双语要求与每课 DoD。
- 完整阅读：`apps/web/src/evidenceProject.ts`、`progress.ts`、`EvidenceReport.tsx`、`evidenceSvg.ts`、`s5Visuals.tsx`、`StageCheck.tsx`、`LabPlayback.tsx`。
- 完整阅读：三份 `transportPhysiologyModel.ts`、`plantInformationModel.ts`、`immunityEvidenceModel.ts`；三份对应 `*Model.test.ts`、`evidenceProject.test.ts`、`s5Content.test.ts`；`apps/web/package.json`。
- 完整阅读：三份 `transportPhysiologyUnits.ts`、`plantInformationUnits.ts`、`immunityEvidenceUnits.ts`；三份同组 CSS 与 `evidenceProject.css`；`curriculum/s05/project.md`、`project-media.json`。
- 定向实读：`content.ts` 的课程汇总、真实 Markdown 加载与 section 解析；`units.ts` 的六任务汇总；`Explore.tsx` 的 Diagram/Explore 分派；`App.tsx` 的 S05 首页卡、Hook、L120 引导、六任务代表模型/其他课程链接、任务编辑保存与 S05 路由。
- 定向实读：`TransportPhysiologyWorld.tsx` 公共 SVG/表格/控件、全部交互状态与分支注册，以及 L097 通路、L099 贴壁几何、L102 腔/上皮/输出修复；`PlantInformationWorld.tsx` 公共/分支注册、参数与播放控制、运输路线、L107 曲线、L108 繁殖、L110 信息路径、L111 计数几何；`ImmunityEvidenceWorld.tsx` 各活动的状态/事件/反馈/原始表及公共注册。未重复全部科学课文或逐一重新科学审阅全部 SVG。
- 文件与结构检查：`curriculum/index.json` 全阶段状态计数；`curriculum/s05/` 实际文件清单；L108 双语授粉修复段落/术语和 `content/plantInformation.ts` 对应术语/32 个稳定题 ID。24 篇正文及六份 media 的全面内容科学审阅归属 `S5_SCIENCE_REVIEW.md`；本次通过真实异步路由与正文/media 合同测试独立核其接入。

## 检查结论

| 检查面           | 实际核查结果                                                                                                                                                                                                                                                                                         |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 可用数量与资源   | 索引 S01–S05 各 24 available，S06 为 24 planned；当前 120/144。S05 有实际 24 篇课文、6 份 mission、6 份 media 和项目双文件；不是把 S06 标题算成已开放课程。                                                                                                                                          |
| 视觉注册         | `isS5Lesson` 严格限定四字符 L097–L120；三组 lazy 模块来自真实 exports，公共分派可达。Diagram/Hook/Explore 的实际子组件均以课程 ID 为 key，切课重建局部状态，切语言不换 key。                                                                                                                         |
| 六任务与项目入口 | U25–U30 各四课且各有任务；Notebook 映射 L099/L101/L106/L110/L116/L119 并链接本单元全部课程。首页 U30、U30 手帐和 L120 均有 S05 项目入口。                                                                                                                                                            |
| 存储与旧阶段     | 保持 `study-biology-v1` 和 version 1；S05 独立 projects 字段保留其他项目，decode 使用既有深层解码器。阶段统计只数自身 24 课和 U25–U30 六任务；S01–S04 不能代填。                                                                                                                                     |
| 完成条件         | S05 同时要求自身 24/6、结构有效报告、有效保存时间、六题全答且至少五对。`savedAt` 单独存在不能绕过 `evidenceReady`。每个 UI 编辑（含理解题/可选语言）通过 `editEvidence` 撤销保存标记；保存函数再次检查有效结构。                                                                                     |
| 数据与解码       | 数组严格两个字符串、图选择整数 0/1、必填字符串与布尔值、答案整数和范围均检查；只恢复已知题 ID。错误结构拒绝或不恢复保存标记，非有限/超 Date 范围时间不能获得有效报告状态。                                                                                                                           |
| 数学与原始数据   | 20 个唯一条 ID、四块茎各五浓度、每组 n=4；先按每条初质量算百分比再均值，保留负号。零交点由正负相邻均值内插；原始质量差草稿的点、均值与轴刻度一致。范围按 min/max，不作均值之比或置信区间。                                                                                                           |
| 报告与反馈       | 两计算有分母/符号反馈，三设置改变实际图及实际草稿图注；两引用须不同且来自真实 ID。十项科学解释可任一语言；可选语言字段不在 gate。固定英文图题和真正双语图注有支架。六题经 CheckCard 可订正，各自链接覆盖六单元。结构校验与人工文字质量复核边界明确。                                                 |
| SVG 导出         | 所有学生字段先 XML 字符过滤再实体转义，学生文本不能作为 HTML/SVG 节点执行。导出有实际图/设置、20 原始/5 汇总、两计算、引用、十解释字段、可选语言、六题反馈、自核和末字段。逐字保守换行/动态高度，非法 XML 控制字符与孤立代理已处理，时间转换有有效范围 guard。实际字体边界与下载仍以浏览器验收为准。 |
| 交互与样式       | 三组 CSS 以 `.bio-s5-lab.tp-lab/.pi-lab/.ie-lab` 限域；无本次跨组宽泛 selector。11 个过程活动有真实帧/几何或曲线状态，13 个参数/分类活动无无效播放条；事件触发 onExplore，定时器卸载清理，回调不藏在 state updater 内。                                                                              |

## 已报告修复的源码复读

本次没有新增生产源码改动，也没有把“已通知作者”作为修复证据。

- F01：实际读 L107 的两条有效 stroke、L110/L111 有效线色和三组 root 注册，核 32 个题 ID；SSR 回归覆盖八课三语言所有颜色属性。不存在原来的空格 hex/root/qID 污染。
- F02/F03/F04：实际读 `membranePassage.route` 与 `passageX`、植物恒宽 206 贴壁几何、`absorptionRoute.locations` 与 L102 按位置/物质状态绘图；修复已落实。
- F05：实际读 L108 中英文定义/术语及元数据，授粉不要求随后相容或受精成功。
- F06/F07：实际读 S05-Q4 基因表达题与 L110 对应链接，以及 `transportRoutes('store-source')` 的两条路径；已与课程/可见路线一致。
- 后续健壮性修复：实际读 `escapeEvidence` 对非法 XML 字符/孤立代理的替换与 `validEvidenceTimestamp` 对有限数及 Date 上界的校验，相关回归已独立通过。

## 本次独立运行

2026-11-14 21:52 本地：

```text
pnpm --filter @study/biology-web test -- src/evidenceProject.test.ts src/s5Content.test.ts src/transportPhysiologyModel.test.ts src/plantInformationModel.test.ts src/immunityEvidenceModel.test.ts
Test Files: 5 passed
Tests: 37 passed
```

覆盖模型不变量、渲染颜色/根 class/题 ID、真实 lazy 路由、三语言正文/media/单元接入、v1 旧记录、数据/保存 gate、畸形解码、长文安全导出。未为本次文档审查重复全仓测试、typecheck 或 build；完整套件与最终封板构建事实由根流程单独登记。本次不增加只镜像实现的新测试，不操作浏览器 server。

## 签署边界

代码与注册完整性：通过，未新增可行动 P1/P2。已知浏览器布局待项仍待修复及截图复测，不能从本文件推定已关闭；浏览器矩阵、实际下载 XML/文字边界另见最终技术验收记录。内部科学审阅另有独立签署；外部专家审稿、儿童试用、真实实验和长期学习效果验证尚未完成。保持 `pilot`，不作考试成绩或学习效果保证。

## 后续技术证据补记 · 2026-11-14 22:05 NZDT

本节仅追加原审查之后的实际技术验收，不改写上方独立代码审查的范围和当时结论。`biology-s5/verification.json`最终为`passed`，代表图实际查看记录`manual-visual-review.json`确认L106/L110双语底标、L107图例/两条曲线、L113英文节点及L102上皮标签均已修复并复测，无未关闭视觉缺陷。课程全量run中L102标签源变化的非零退出和`sourceUnchangedDuringRun:false`保留；最终用全量24活动/384布局/6完整流程，加稳定源码后L102全部分支/每frame/全部布局补验认证。336张最终截图和16个运输重点状态按清单登记，不宣称人工看完全部截图。

项目`acceptance-combined-summary.json`为`complete:true`：实际报告/六任务205/205、最终源码任务布局49/49、实际SVG重新打开与BBox12/12通过；另有其余四任务手机8状态宽度25/25，scope仅限宽度。`manual-review.json`记录27张逐张实际看图。最终手机任务网格`min-width:0`与L102标签修复之后，`final-build-verification.json`的7项完整检查均exit0，24文件165测试、两应用类型和生产构建通过，1558输入文件hash在检查前后保持一致。`cleanup.json`确认所有自有上下文关闭、原session99496停止且3460无监听；正式3463未动。

因此本文件原先列出的浏览器布局待项已有后续技术关闭证据；此补记不扩张为儿童试用、外部专家审稿或科学文字自动判分。完整范围、记录路径、非阻断包体warning与复跑方式见[S5_DELIVERY.md](./S5_DELIVERY.md)。
