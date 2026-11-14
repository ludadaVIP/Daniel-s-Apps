# S5 科学与教学内部复核

复核日期：2026-11-14。独立审阅人：s5_science_review（与三组内容作者分离）。本记录是内部复核，不是外部专家审稿或儿童试用；尚未做儿童理解度试用、外部审稿或成绩效果研究。

**当前结论：S5内部科学与教学内容复核通过，可进入最终技术验收。** 24课正文、96道单课题、24个SVG分支、六个单元任务及阶段项目合同/数据/六题/导出已实读；七项已报告问题均已落实并逐项源码复核。浏览器截图视觉验收由技术验收另行记录，本审阅未把尚未收到的截图算作通过证据。此结论不代替儿童试用或外部审稿。

## 范围与方法

- 读取父目录AGENTS.md，biology/plan.md S5、每课DoD和内容合同。
- 逐份实读U25–U30、L097–L120全部中英Explain、Depth、Apply自查、误区、术语及96题的题干、所有选项、正确项和反馈。另读三份content元数据，并逐题核对correct index。
- 逐分支阅读TransportPhysiologyWorld、PlantInformationWorld、ImmunityEvidenceWorld的24个SVG、控件分支、播放检查点、数据表和静态替代；逐函数复算三份Model的规则、数量、单位和限定假设。未以grep/计数替代科学审阅。
- 补充结构验证：加载真实TS元数据，逐题逐语言比较题干、全部选项、feedback和所有术语释义与Markdown，24课/96题全部相符。此项只证明同步，不替代人工科学判断。
- 2026-11-14 15:21本地运行三份Model定向测试：3文件23项通过。该结果不能发现所有SVG科学错误。
- 修复后独立重跑：15:23 Plant 8项（含8课×3语言模式SSR颜色/根class/两曲线）；15:25 Transport 10项（含贴壁几何SSR）通过。15:23重新核全部96稳定题ID与1488个中英题干/选项/反馈/revisit/术语字段，全部与Markdown一致。
- 21:44重新读取定稿项目合同`project.md`、`project-media.json`与对应domain/UI/SVG，独立运行`evidenceProject.test.ts`：7项通过，覆盖配对百分比、4块/20处理单位、保存/编辑失效、六题、阶段隔离、实际图/草稿图注与完整长文SVG导出。
- 使用web-access技能；父流程已确认CDP未连接，本次只用公开静态一手资料，无登录交互。以下资料均实际打开读取；不复制其题目或长文。

## 逐课核对清单

答案串按题1–4列A/B/C，均已同时核对元数据的0-based correct index。每课均实读双语机制、迁移、误区、Depth和静态替代。

| 课   | 已核核心科学/教学点                                              | 答案串 | 复核状态                               |
| ---- | ---------------------------------------------------------------- | ------ | -------------------------------------- |
| L097 | 双层方向、疏水性/电荷、蛋白不等于主动运输、锚定例外              | ABCB   | 已核；F02路径修复已复核                |
| L098 | 等容密闭双向1/4交换，16/4→13/7→11.5/8.5；净3→1.5，总20；动态平衡 | BACA   | 已核                                   |
| L099 | 总Ψ而非仅溶质；−0.5>−0.8；轻失水不必质壁分离；−4%公式            | BACB   | 已核；F03贴壁/膨压趋势修复已复核       |
| L100 | AΔC/d相对容量3/6/12；面积不能替代逆梯度供能；间接供能            | BCAB   | 已核                                   |
| L101 | 右心→肺→左心→体；动静脉按方向；瓣膜被动，压力与流量不同          | BACA   | 已核                                   |
| L102 | 淀粉酶不一步产全葡萄糖；乳化非水解；多数长链脂肪先淋巴           | BAAC   | 已核；F04腔/上皮/输出修复已复核        |
| L103 | 超滤由压力/屏障驱动；回收与尿分开；ADH调透水性、水被动渗透       | CABA   | 已核；100=90+10=98+2，尿量少80%        |
| L104 | 神经/内分泌协同；受体和下游条件；0.05/5s比100非普遍律            | BABC   | 已核                                   |
| L105 | 木质/韧皮独立通道；不同筛管可相反；源库可变；压力流              | BCAB   | F01/F07修复源码已复核                  |
| L106 | 蒸发再扩散；环境×气孔；吸水计测吸水、不是精确蒸腾；5→2降60%      | ABCB   | F01修复源码已复核                      |
| L107 | 平台斜率不等于速率零；CO₂高光40→70增75%；低光不套用              | BABC   | F01曲线stroke修复源码已复核            |
| L108 | 授粉≠受精；胚珠→种子；N/Mg功能非糖碳源；14/6不是每花一子         | BACA   | F05正文/术语/静态修复已复核            |
| L109 | A–T/G–C、反平行、反向互补；100核苷酸=50bp；单双链统计范围        | CABC   | F01修复源码已复核；80bp/G18→A=T62正确  |
| L110 | DNA→RNA→蛋白信息层级；功能RNA例外；表达与基因存在分开            | BABC   | F01修复源码已复核                      |
| L111 | 2n/条数/姐妹/C区分；减I n/2C、减II n/1C；总4C守恒                | BACB   | F01修复源码已复核                      |
| L112 | 三独立位点toy，1/6/15/20/15/6/1合64；Y=10+2G+3E+GE               | CABC   | F01修复源码已复核；非人类/遗传率模型   |
| L113 | 先天共有模式识别与适应性协同；浆细胞/抗体/T作用；85/100是事件    | ABCA   | 已核                                   |
| L114 | 匹配抗原记忆；首次/再次六点任意指数；差13非天数/保护率           | BCAB   | 已核；不匹配分支按首次规则并明示假设   |
| L115 | 选择已有变异非定向学习；R数2→2→8，比例10→100%；0/0未定义         | CBAC   | 已核；无个人用药指令                   |
| L116 | 风险分母、5个百分点与50%；失访完整病例10/170，极端5–20%          | BACB   | 已核；随机不保证平衡，观察研究有价值   |
| L117 | 假设/预测/操作性定义；4/8h、7d、cm；12/9支持不证明               | CABC   | 已核                                   |
| L118 | 生物单位vs读数；处理单位可能是盆；块内随机、差3非跨块差5         | BACB   | 已核                                   |
| L119 | mean9/12、range2；28使mean13.5/range20；范围非±全范围/CI         | ABCB   | 已核；异常点需证据，不能因不合预测删除 |
| L120 | 相对均值增量33.3%非最终高度/每株/产量；机制未测；局限→下一步     | BACB   | 已核                                   |

## 发现与修复复核

初报行号记录发现时的位置；修改后以标识符/表达式复查。P1/P2未关闭前不签通过。

| ID  | 级别、初报位置                                                                                                  | 科学/教学原因与最小修正                                                                                                                                                         | 实际复核状态                                                                                                                                         |
| --- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| F01 | P1 `apps/web/src/PlantInformationWorld.tsx:42,569,1004,1184,1422`；`content/plantInformation.ts:118`等          | 数字排版正则把hex改成含空格字符串，L107两条曲线fill=none且stroke无效；L110信息流/L111染色体线也消失。根class变bio-s 5-lab，32个题ID变q 1。应恢复全部颜色/class/稳定ID并防回归。 | 已关闭：实际重读修复源码，曲线#a15e40/#347c65、根bio-s5-lab、32题ID恢复；独立跑SSR回归8课×3模式与parity通过。                                        |
| F02 | P2 `TransportPhysiologyWorld.tsx:286–287`                                                                       | 通过箭头始终x390，位于蛋白x280–360之外，开启离子/葡萄糖蛋白仍画成穿脂质，违背选择通路机制。最小改为氧气走脂质，其他允许通过时走匹配蛋白。                                       | 已关闭：重读membranePassage.route及SVG passageX，氧气lipid/x390、离子或葡萄糖protein/x320、无匹配blocked；10项定向测试通过。                         |
| F03 | P2 `TransportPhysiologyWorld.tsx:379–426`                                                                       | 植物膜初始150、进水180、失水112，壁220：所有状态均有可见脱壁，暗示平衡/进水也质壁分离。应让初始/平衡/进水膜贴壁，轻失水以膨压下降表达；若画脱壁必须另设足够失水条件。           | 已关闭：重读所有植物帧恒宽206、x217/y107，膜stroke覆盖壁内缘；失水文案为膨压可下降/未示质壁分离。对应media和SSR贴壁回归通过。                        |
| F04 | P2 `TransportPhysiologyWorld.tsx:606–607`                                                                       | 消化路线frame0追踪点已在绒毛内，但此时阶段仍为未消化淀粉/蛋白/脂肪，易暗示大分子先入组织。最小让消化帧留腔侧，跨膜帧到上皮，再到正确血/淋巴输出。                               | 已关闭：实际读locations与位置/身份分支；淀粉/蛋白前3帧腔x80再进血x230，脂肪腔→上皮x145→乳糜x320；大分子/小产物/包装脂肪区分，跨上皮箭头与media一致。 |
| F05 | P2 `curriculum/s05/u27/l108.md:102,144,154`、`content/plantInformation.ts:792`、`PlantInformationWorld.tsx:651` | 把compatible stigma放入授粉定义，排除了“已授粉但相容性阻断后续”的情形。定义应为花药→柱头转移，把相容性作为后续条件。                                                            | 已实际重读双语正文、元数据术语、flowerSteps和media checkpoint，修复一致。                                                                            |
| F06 | P2 `apps/web/src/evidenceProject.ts:44`                                                                         | 阶段Q4为激素受体却回L110，造成错误复习定位且U28检索名实不符。最小换真正基因表达/功能RNA题，保持六题覆盖。                                                                       | 已关闭：实际重读改后Q4双语题干/全部选项/feedback，正确B为转录→RNA→核糖体翻译，功能RNA边界明确，映射L110正确。                                        |
| F07 | P2（模型一致性）`plantInformationModel.ts:14`                                                                   | store-source第二筛管leaf→root与实际World B管两情景leaf→shoot不同。该函数未接UI，但模型应与可见路线一致。                                                                        | 已实际读修复函数：store→shoot与leaf→shoot；通过。                                                                                                    |

## 阶段项目复核

已初读`evidenceProject.ts`、`evidenceSvg.ts`。4块茎×5浓度，20条/20杯处理单位、每浓度4条、4生物块、前后配对定义合理；不能称20独立块茎或40样本。各条百分比先算再均值，0.2/0.4间零变化插值约0.3 mol/L，明确非精确胞内浓度且不证明60min已平衡。图的min–max未当CI；虚构数据、损伤/擦干/溶质移动假设与替代解释明确。

已读完整最新`EvidenceReport.tsx`（导出组件EvidenceProject，避开Windows大小写文件冲突）、`evidenceProject.ts`和`evidenceSvg.ts`。初质量3.0/3.1/2.9/3.0g，0.01g记录经舍入后重新算每条百分比。独立用100×(after/before−1)复算20条与五组摘要：均值12.00973、4.01085、−3.99360、−12.00973、−18.00751%；零交点0.3002154mol/L，与源码公式相符。原始质量差和百分比的轴缩放一致；错误轴/means-only草稿有derived实际双语图注。英文固定图题、20条配对记录、5组摘要、两条不同引用、CER/替代解释/后续变量—测量—时间—控制—重复—挑战结果与人工rubric齐备，结构检查不冒充科学判分。导出含数据、图注、全部必填文字和假设。六题全读，答案BACBAC，L099/L101/L106/L110/L116/L119映射内容现已一致。

定稿`curriculum/s05/project.md`及`project-media.json`已完整重读，与实际工作台的22°C/60min/50mL/尺寸/0.01g、四块茎/每浓度4条、配对计算、图设置、双语图注、结构保存与六题条件一致。项目定向测试7项独立通过。定稿合同保持pilot、外部审稿/儿童试用待办，未声称完整考纲覆盖或替代真实实验。阶段项目的科学与教学合同复核通过；浏览器交互/排版/下载实际呈现由最终技术验收另记。

## 一手核验资料

以下是概念核验，不是复制的课文、数据或图源。所有原创教学数据均需保留自身假设，不能声称来源测得这些toy数字。

- [OpenStax Biology 2e §5.2 Passive Transport](https://openstax.org/books/biology-2e/pages/5-2-passive-transport)：脂质通透性、双向扩散和质壁分离。
- [OpenStax Biology 2e §30.5 Water and Solute Transport](https://openstax.org/books/biology-2e/pages/30-5-transport-of-water-and-solutes-in-plants)：总水势各项、蒸腾、木质/韧皮压力流。
- [Science & Plants for Schools: Potometer](https://www.saps.org.uk/teaching-resources/resources/1263/investigating-transpiration-with-a-potometer/)：本模型所画移动气泡式仪器追踪吸水。该机构也区分质量式仪器，故此处结论限定于课中装置，而非一切叫potometer的仪器。
- [OpenStax Biology 2e §32.2 Pollination and Fertilization](https://openstax.org/books/biology-2e/pages/32-2-pollination-and-fertilization)：授粉定义与相容性后续阻断，支持F05。
- [OpenStax A&P 2e §19.1 Heart Anatomy](https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy)：双循环、相对氧合、左右输出与壁厚。
- [OpenStax A&P 2e §23.7 Digestion and Absorption](https://openstax.org/books/anatomy-and-physiology-2e/pages/23-7-chemical-digestion-and-absorption-a-closer-look)：淀粉酶产物、脂肪酶、消化与吸收分层。
- [OpenStax A&P 2e §25.4 Kidney Microanatomy](https://openstax.org/books/anatomy-and-physiology-2e/pages/25-4-microscopic-anatomy-of-the-kidney)及[§25.8 Endocrine Regulation](https://openstax.org/books/anatomy-and-physiology-2e/pages/25-8-endocrine-regulation-of-kidney-function)：过滤屏障/压力与ADH透水通道、渗透。
- [OpenStax Biology 2e §14.2 DNA Structure](https://openstax.org/books/biology-2e/pages/14-2-dna-structure-and-sequencing)、[§11.1 Meiosis](https://openstax.org/books/biology-2e/pages/11-1-the-process-of-meiosis)、[§16.1 Expression Regulation](https://openstax.org/books/biology-2e/pages/16-1-regulation-of-gene-expression)：反平行、一次复制两分裂、表达分层。仅使用这些概念，不照搬其所有简化断言。
- [OpenStax Biology 2e §42.2 Adaptive Response](https://openstax.org/books/biology-2e/pages/42-2-adaptive-immune-response)：B/T、浆细胞和协作；[CDC Principles of Vaccination](https://www.cdc.gov/pinkbook/hcp/table-of-contents/chapter-1-principles-of-vaccination.html)：记忆与抗原，未使用具体疫苗时程建议。
- [CDC About Antimicrobial Resistance](https://www.cdc.gov/antimicrobial-resistance/about/)：耐药主体是微生物，非人体；不引入服药建议。
- [NC3Rs Experimental Unit](https://eda.nc3rs.org.uk/experimental-design-unit)：独立接受处理的单位、重复读数与分块。
- [AQA Practical Assessment](https://www.aqa.org.uk/subjects/science/gcse/science-8465/specification/practical-assessment)：实际读取其可检验问题、变量控制、数据分析/解释/评价、科学量与单位等公开技能要求，仅作技能参照，不据此声称完整考纲覆盖。
- [NIST Randomized Block Designs](https://www.itl.nist.gov/div898/handbook/pri/section3/pri332.htm)、[Measures of Scale](https://www.itl.nist.gov/div898/handbook/eda/section3/eda356.htm)、[Outliers](https://www.itl.nist.gov/div898/handbook/eda/section3/eda35h.htm)、[Confidence Intervals](https://www.itl.nist.gov/div898/handbook/prc/section1/prc14.htm)：分块/随机、range=max−min、先查异常记录、范围与CI不同。

## 最终签署与未覆盖项

2026-11-14内部科学内容签署：通过。F01–F07均有实际文件修复和逐项独立复核，没有未关闭的已报告P1/P2科学问题。24课/96题、六任务和项目数学/题目/合同均已复核；这不是仅发送反馈后的默认通过。

技术边界：本文件记录了SVG实际源码分支及SSR几何/图线证据，尚未收到最终浏览器截图，不宣称已独立完成浏览器视觉/交互全验收。该项由`S5_DELIVERY.md`的技术验收证据接续；如果截图暴露科学图文矛盾，应重新打开本复核。

仍未完成：儿童试用、外部独立专家审稿、真实实验验证、学习效果或考试成绩研究。保持pilot身份，不把内部检查写成外部认证、儿童验证或考试成绩保证。
