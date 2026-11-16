# S6《高中生物桥梁》交付记录

交付日期：**2026-11-16（Pacific/Auckland）**。S01–S06共144/144课、36单元任务与6阶段项目已有完整软件实现，全部保持available/pilot；这表示可试学，不表示正式published、课程认证或学生已毕业。科学资料和官方数据的核验日期保留真实的2026-11-15。

## 实现与科学边界

- S06覆盖U31–U36、L121–L144三家族24课：十一段双语Markdown、目标、预测、词汇、96道反馈题、原创图解/开场图/交互与六单元任务。24个活动包括12过程模型与12静态条件/证据比较。
- `s6Visuals.tsx`只接受严格L121–L144，按128/136分家族lazy加载；子组件以lesson ID重置跨课状态，语言切换不改变key。Notebook代表为U31/L123、U32/L127、U33/L131、U34/L134、U35/L138、U36/L143，并链接本单元全部四课。
- U36后项目卡、`/biology/project/S06`与L144→S06-P01均为真实入口，不生成L145空课。
- 《我的生命科学研究》有两条独立路径：真实NPS官方生态表；**默认空白**的学生安全家庭植物观察。每题材独立草稿与savedAt；编辑只撤该题材，改记录/范围/植株/起始日期清理失效引用，切题材不清空另一份作品。
- 报告包含实际范围原创图、全部原始数据/缺失/排除原因、计算摘要、两次数值练习、引用、双语辅助研究摘要与图注、自己的研究正文、五段有标题讲稿、自核和what/why修订。学生正文任选语言，英语不是生物进度门槛；另一语言练习和英文starter可选。辅助摘要不冒充自由文字翻译，自动检查不判断文字的科学质量。
- 讲稿每段要有学生自己的notes和整数秒预算，合计180–300秒；计划时间不是实际讲完的认证。导出为完整离线HTML，含内嵌原创SVG和真实学生选择，answered/correct分开，错误答案不会被改写成标准答案。
- 毕业完成要求学生**自己的**S06 24课、6任务、至少一个有效已保存题材，且六题全答、至少5/6正确。六题分别对应L123翻译/同义替换、L127净G3P限制预算、L131延迟反馈偏差、L134加权基因流、L138片段大小证据边界、L143缺失/真实零/独立重复。保存报告和理解检查分开。`study-biology-v1`及S01–S05合法旧记录、独立阶段counts均保留。

### 官方生态数据

已实际查看NPS PDF物理第5页渲染PNG，核对十行转录与原表汇总。来源：[Yellowstone Wolf, Cougar, and Elk Project Annual Report 2025](https://home.nps.gov/yell/learn/upload/2025-YELL-Wolf-Cougar-Elk-Project-Annual-Report-508.pdf#page=5)，机构US National Park Service，观察日期2025-12-31、核验2026-11-15，PDF SHA256：`02B4C2EE9FA76DFBEF115586C61D29144BA13355E43234A4B8A2CAE57BC216D9`。

原表7 pack+1 group+2零独居类别；北部36成年/17幼狼/53总只数，内部31/0/31，全园67/17/84。北部合并份额17/53≈32.08%，全园17/84≈20.24%；只加原始行一次，不重复加汇总，不等权平均狼群比例。0/0为NA，0/31为0%。这是年末年龄组成快照，不是出生率、存活率、密度、地区因果或2026当前数量；年末0只幼狼不等于全年没有出生。十行不是十次独立实验，也不是84条逐只观察；没有数字化未核验的历史柱图。[NPS Wolf Ecology](https://www.nps.gov/yell/learn/nature/wolf.htm)仅作背景，不证明本表未测的疾病、迁移等原因。

自录路径保持正常照料，不摘样、不测人体健康；3–100行稳定ID记录，允许不等间隔整数日、NA和真实0，多株原始数据全保留但一次只分析一株。缺失断线、不补0；首值0时相对变化未定义。单株多次记录仍为独立植株n=1。所有观察均标自述未外核；自动验收使用明确TEST FIXTURE ONLY数据，产品不预填假实测。

## 独立审查与修复关闭

[独立科学与教学审阅](./S6_SCIENCE_REVIEW.md)已通过，初审1项P1、3项P2均已关闭：PCR抑制不能抹去原有拷贝、无反馈敏感性时不能画抑制作用、L121–L128中英Explain末段对应、L127双语预算/反应式重叠。审阅覆盖24课关键双语解释/迁移、96题及毕业原始数据、计算、摘要和六道高级综合题；它是内部独立复核，不冒称外部专家认证。

[独立代码与完整性审阅](./S6_CODE_REVIEW.md)已通过，两项P2已关闭：满20000字元后starter绕过上限；日期控件将1899/0001写成严格decoder无法恢复的草稿。现在追加前检查含换行完整长度，超限明确拒绝且保留原文和保存状态；日期仅合法或空才写入，局部pending输入保留错误提示与上次有效值，decoder未放宽。正常编辑/清空仍可用；派生日期跨9999年保留完整扩展ISO。独立code复核有38项真UI/刷新断言，不能与项目202项混算为新案例。初审复现、失败与backup证据保留在原记录。

## 最终自动检查与源码冻结

最终检查完成于2026-11-15T21:11:00Z（NZDT 2026-11-16 10:11）。[final-build-verification.json](C:/Users/Administrator/.codex/visualizations/2026/11/10/01a1c7bf-87b4-7941-9aef-bad203405a02/biology-s6/final-build-verification.json)记录9个命令全部exit0：

- Biology全套**29文件214测试**；毕业domain14项、S6内容接入4项包括实际异步24课×3语言×3公共视觉入口、十一段正文、媒体、旧记录/阶段门槛、计算、引用、严格解码、完整安全报告，以及两项持久化边界修复回归。
- 全部Biology源码与Vite配置ESLint；shared/UI/Biology/Hub四组TypeScript；Biology和Hub两个production build。
- 78路径限定格式检查：新增S06源码/课程、必要共享接入文件和当时当前文档；未批量改旧plan或旧课程。

校验前后158个产品源码与S06内容输入文件逐个SHA256相同；排除README/QA/delivery等记录、tests及fixtures，避免文档循环hash。aggregate：`F15EAD41CA34B8EFC71AAA37F1090939DB1ECE6D7DB1E8808726269E37382284`。两build仍有大于500kB chunk提示；成功构建不代表载入性能已测定。

首轮真实lint失败与验证脚本引用错误root Vite路径的MODULE_NOT_FOUND没有抹除，保留于[preflight-build-verification.json](C:/Users/Administrator/.codex/visualizations/2026/11/10/01a1c7bf-87b4-7941-9aef-bad203405a02/biology-s6/preflight-build-verification.json)及对应`preflight-final-*.log`；修正后才生成最终通过记录。早前全workspace测试在无关Chemistry server health测试遇到本机随机端口`connect EACCES`，未修改Chemistry，也未把该全workspace测试写为通过。

## 课程真实浏览器验收

[课程verification.json](C:/Users/Administrator/.codex/visualizations/2026/11/10/01a1c7bf-87b4-7941-9aef-bad203405a02/biology-s6/verification.json)最终passed：24活动、384个1366/390px EN/双语布局状态、6条完整学习/错答/复习/笔记/Notebook流程、5组SPA切课重置与语言保留、96题ID核验；另有48项Explain末段显示与48项stroke补证。登记504个存在且无重复路径的PNG，**实际人工打开26张代表图**，范围见[manual-visual-review.json](C:/Users/Administrator/.codex/visualizations/2026/11/10/01a1c7bf-87b4-7941-9aef-bad203405a02/biology-s6/manual-visual-review.json)，不声称手看全部截图。控制台/运行时/HTTP失败和最终SVG越界均为0。

最终课程验收后只有毕业域/工作台/报告及其测试四文件发生变化，已由毕业最后专项、独立代码与最终软件检查覆盖；其余课程源hash与课程验收记录一致。初期源变化、工具/selector误报、真实视觉问题和favicon404均归档追溯，最终fresh runs验证修复，不靠过滤错误得到零。

## 毕业项目真实浏览器验收

完整范围见独立[ACCEPTANCE.md](C:/Users/Administrator/.codex/visualizations/2026/11/10/01a1c7bf-87b4-7941-9aef-bad203405a02/biology-s6-project/ACCEPTANCE.md)及[acceptance-manifest.json](C:/Users/Administrator/.codex/visualizations/2026/11/10/01a1c7bf-87b4-7941-9aef-bad203405a02/biology-s6-project/acceptance-manifest.json)：

- canonical完整run：**202检查、58截图登记、3份真实点击下载并离线打开的HTML**。两条路径逐一真实UI填写全部研究字段、计算、引用、五段notes、自核与保存；切换、编辑/删行/失效/重引/刷新、六题错后订正和L144真实结课进入S06-P01均通过。六个Notebook表单真实填写/刷新；stage和legacy使用清楚标记的测试完成fixture，不冒称孩子学完24课。
- 16布局为两路径×1366/390×EN/双语×正常/压力。表与图均局部键盘滚动，无整页横溢；SVG文字边界、NA/真实0、单株实际时间间隔、独立n=1、多株排除、100行/第101行拒绝、长中英文/URL与非法输入均有检查。
- 日期原生键盘补验**7项**单列；最终等价codepoint过滤变更后重新执行报告专项**54项**与同三份真实下载，sourcehash稳定。54是有意重复的报告子集，不能将202+7+54包装为263个独立产品案例。
- 三下载为已保存官方报告（6答/5对且错误选择真实保留）、已保存植物报告（NA/真实0/不等间隔/第二株排除/五段notes）、未保存TEST ONLY的100行长文压力报告；完整字段、末段、引用与状态保留。最终console/pageerror/failed HTTP均0。
- 项目独立reviewer**实际打开6张代表PNG**，精确范围与hash见[项目manual-visual-review.json](C:/Users/Administrator/.codex/visualizations/2026/11/10/01a1c7bf-87b4-7941-9aef-bad203405a02/biology-s6-project/manual-visual-review.json)。打印仅验证桌面宽Chromium **print-media仿真**与无横溢，未生成PDF，不保证纸张分页或实物打印。

## 清理、范围与仍待真实验证

课程/项目浏览器上下文已关闭，仅用隔离3460测试地址，未访问或更改正式3463学习记录。root已通过自有session89204的Ctrl-C关闭共享Vite服务，并只读核验3460无监听；证据见`biology-s6/cleanup.json`。没有停止未知进程，没有git commit或push。

儿童真实试学、外部科学专家审稿、英文表达或科学自由文字质量人工评价、教学收益与长期记忆效果仍未验证。已完成的是计划要求的完整软件实现、内部独立科学/代码复核与明确范围的软件技术验收；这些限制不因214测试或144课制作完成而消失。

## 复跑

需要已安装依赖、Python Playwright/Chromium和自己的隔离3460服务，勿使用正式学习profile：

```powershell
pnpm --filter @study/biology-web test
pnpm --filter @study/biology-web typecheck
pnpm --filter @study/biology-web build
pnpm --filter @study/hub build
python biology/scripts/verify-s6-browser.py all
python biology/scripts/verify-s6-project.py all
python biology/scripts/verify-s6-project.py date-input
python biology/scripts/verify-s6-project.py reports
```

浏览器脚本使用已启动的测试服务，不负责关闭别人的服务器。最终交付文档另做限定格式检查，产品源码冻结后不再修改。
