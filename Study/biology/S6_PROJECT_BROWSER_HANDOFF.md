# S06毕业项目独立浏览器验收交接（2026-11-15历史操作说明）

路由：`http://127.0.0.1:3460/biology/project/S06`（复用课程browser server；勿另抢3460）。源码：`apps/web/src/GraduationWorkbench.tsx`、`graduationProject.ts`、`graduationReport.ts`、`graduationProject.css`、`progress.ts`。本文件保留验收前操作指引；2026-11-16最终通过范围及限制见[S6_DELIVERY.md](S6_DELIVERY.md)和独立ACCEPTANCE记录。

## 操作定位

- 根容器`.bio-graduation`，题材导航`.bio-graduation-cases button`，official在前、observation在后。每按钮`aria-pressed`表达当前路径。
- 官方两个select依次为scope（all/Northern Range/Interior）与graph（counts/shares）。更改scope应清空当前case引用及savedAt。
- 官方十行原表始终可见；当前scope摘要单独计算。表下details显示原表53/31/84的交叉校验，不能将汇总行再次相加。
- 自录路径的日期input为`input[type=date]`；第一个select为activePlant。录入fieldset的三个文本input依次plant/day/height，缺失checkbox另选。使用`Add record`/`添加记录`；同株同日重复、非法数字、负值和超过100行应反馈并拒绝。每行有Edit/Delete。
- 两次数值input是第二section中的两个input（官方32.08、20.24；自录依据实际first/last）。缺失或首值0时NA允许，仅相对变化未定义；真实0不能删除。
- 引用fieldset：每条是含recordID文字的label和checkbox。至少两条有效不同ID；不同记录不是独立来源。
- 研究正文为`.bio-graduation-field textarea`共19个，顺序与`researchFields`导出一致。最后`secondLanguage`可选，其余18个只检非空，不要求英文。每字段label完整可用getByLabel；部分字段有可选英文starter details。
- 五段讲稿是含`input[type=number]`的五个fieldset，每个包含计划秒数、必填自己notes textarea与可选另一语言textarea。默认每段45秒（合计225秒），notes默认空；不能只靠默认秒数保存。总和180–300秒。
- 四个手动rubric checkbox位于第五section；其他checkbox为数据missing或citations，可按label文字定位。
- `Save this case as a complete report`/`保存此题材为完整报告`真实按钮会列出未完成项。无需答对综合题才能保存。编辑只撤当前case savedAt，切换case不撤已保存另一case。
- 下载真实anchor：`.bio-graduation a[download]`，`download`名为`S06-official-research.html`或`S06-observation-research.html`。href为完整text/html dataURL，独立HTML包含inline原创SVG；应真实点击下载、打开离线文件并检查，不只匹配字符串。
- 六综合题在第六section，使用共享CheckCard，选项A/B/C→View explanation→Think again订正。正确索引依次0/1/2/0/1/2，回课L123/L127/L131/L134/L138/L143。导出区分学生真实选择、answered、correct和解释。
- 需要每次真实UI事件完成后等React更新，再做下一次输入/checkbox；不要在同一evaluate同步连发所有事件模拟不存在的人类同时输入。

## 明确标记测试fixture，产品默认仍空

`apps/web/src/graduationProject.fixtures.ts`导出`researchFixture('official'|'observation')`；**TEST FIXTURE ONLY**，产品UI没有import。可用其作极端布局、严格解码、旧存储和stage gate测试。完整流程仍需实际UI走完，不以注入fixture冒充UI验收。

官方fixture：全园counts，引用W-N-8M与W-N-RC，计算32.08/20.24；18必填研究字段标TEST ONLY、五段各45秒notes、四rubric true。自录fixture：start2026-10-01，active TEST-PLANT-A；Ptest0(day0,10cm)、Ptest3(day3,12cm)、Ptest5(day5,NA)、Ptest10(day10,15cm)，另株Ptest-other(day0,90cm)。有效3次、差5cm、相对50%，仅第一株图，缺失断线，另一株排除；引用Ptest0与Ptest10。测试数据不能称为真正科研实测。

开发服务器下可在页面evaluate中`import('/src/graduationProject.fixtures.ts')`及`import('/src/progress.ts')`读取同一正式decoder/fixture（如服务器root不同，先从实际模块网络地址核对）。持久化key为`study-biology-v1`；顶层version仍1。研究draft在`projects.S06`，有active、cases.official、cases.observation和answers。

Legacy/gate自动测试位置：`graduationProject.test.ts`的“restores old version-one records directly”与`s6Content.test.ts`的“round-trips legacy S01–S05 deep records”。完整S06 gate需要24个`L121..L144`session.completedAt、6个`U31..U36`mission.savedAt、至少一个case有效savedAt和全部6题answered且≥5correct；只注入144个课程制作清单不能毕业。切到空observation时，只要official保存且其他条件成立，S06仍应完成。

## 一份可用的官方UI研究文字（人工质检练习）

可在对应字段用中文，验证英语不是hardgate：

- question：2025年末北部和内部的幼狼份额如何不同？
- method：阅读NPS物理第5页十条分类行，分别求幼狼与全部狼的和，再相除，不平均狼群比例。
- conditions：观察日期2025-12-31，范围全园两地区；不是时间序列。
- source：US National Park Service，Yellowstone Wolf, Cougar, and Elk Project Annual Report 2025，第5页，2026-11-15查阅。
- claim：此年末表中北部幼狼份额高于内部，但不能据此证明地区导致差异。
- reasoning：W-N-8M为7/16，W-N-RC为4/16；全部北部合计17/53=32.08%，内部0/31=0%，全园17/84=20.24%。
- mechanism：食物、疾病或迁移可能影响构成，但此表没测这些变量。
- limitation：是年末分类汇总，不是幼狼逐只生存记录或独立实验；零年末幼狼不说明没有出生。
- alternative：迁出、群体边界和可检测性差异可能影响数量，需要跟踪记录区分。
- nextQuestion：下一年度持续监测时幼狼进入、离开与年末组成是否一致？
- variable：观察比较不同地区和月份；不主动干扰野生动物。
- measured：按月记录已识别群体中的幼狼与全部狼，单位只，并记录观测努力。
- controls：记录季节、观测努力、群体迁移及食物背景等潜在混杂。
- sampling：群体为记录单位，月份是重复测量；需要多个独立群体与多个年度，不能把十行当十次独立实验。
- challenge：若更多核验记录使两地区份额相近，将挑战对区域差异的描述。
- references：填写上述NPS报告及官方Wolf Ecology页面，说明后者是背景而非本表原因证据。
- revisionWhat：把“出生率”改为“年末幼狼份额”。
- revisionWhy：原表没有全年出生与生存数据，分母应为所选范围全部狼。
- 五段notes：分别自行解释问题边界、来源十行、17/53和17/84、局限与替代、进一步月度观察；每段内容不能只有自动标题。

自录路径完整UI请使用上述明确标记的虚构测试数据，写“TEST ONLY验收虚构数据，非真实测量”，并保留产品默认空白证据。可额外录day0=0，验证相对变化NA；然后删除/修改引用行确认清理。

## 压力验收与未证实事项

1366与390宽、EN与bilingual；长中英文/WW/URL/`<script>&`/非法XML字符；100条含NA、真实0、多plant；图表SVG字号14px固定820px宽，局部named focusable horizontal scroll；表数据nowrap但必须只局部滚动。实际导出离线HTML需全文自然wrap、保留全部19字段及五段notes、引用、全部原始/排除数据、保存/草稿状态与真实检查选择，打印无截字。不得过滤真实console/network错误。任何缺陷请报root和integration作者，独立报告只写实际观察。
