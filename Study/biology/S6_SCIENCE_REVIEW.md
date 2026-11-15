# S6 独立科学与教学审阅

审阅及修后复核日期：2026-11-15。范围：U31–U36、L121–L144、96题、184条课内术语（重复术语按课计）、6个单元任务、3个纯模型文件及24课 World 的全部科学条件分支；后续同日新增完整S06-P01毕业项目科学审阅，见末节。

**最终科学结论：24课及6任务通过本轮独立科学复核；初审1项P1、3项P2均经修后实读/核算/必要截图检查关闭，当前无未关科学P1/P2。S06-P01也通过下述独立科学审阅。** 这是内容、证据与模型审阅，不是外部专家认证、儿童试学或正式发布签字。作者测试通过不替代本审阅；问题均经实读后才关闭。

## 初审问题与修后关闭证据

### S6-SCI-01 · P1 · PCR抑制被错误表示为原有目标DNA消失

- Owner：biotechnologyResearch（BR作者）。状态：**CLOSED · 2026-11-15独立复核**。
- 位置：`apps/web/src/biotechnologyResearchModel.ts:26`及`:28`的`scenario === 'inhibited' ? 0`；`BiotechnologyResearchWorld.tsx:748`明确称输出为target copies、无检测阈值；`:767`表头为Sample target copies。另涉及L137正文及U35 media中的相同模型描述。
- 可重现：`pcrEvidence(2, 0, 1, 'inhibited')`返回sample=0、positive=0。起始已经有2份DNA，尚未循环，抑制不能令模板消失。任意后续循环中，没有有效扩增也不等于没有原有拷贝。当前把“没有可解释扩增/对照信号”与“0目标份数”混成一个量。
- 最小修正：把目标拷贝账本与扩增有效性/概念对照读数明确分开。若以完全抑制为e=0，则sample保留N0、positive保留2；另用扩增失败标记判定本次比较不可解释。也可另列明确定义的概念信号，但不得在标为目标份数、无阈值的列内用0代替无信号。同步调整模型、表头/反馈、MD137、media和相关断言，不靠附加免责声明掩盖数值矛盾。
- 必须复核：0轮与4轮、N0=0/2、e=.5/1、clean/contaminated/inhibited；抑制时已有模板不归零，普通阳性成功仍不能排除样本特异抑制；Apply的真实“阳性失败/未检出”情境仍保持正确。
- 修后实读：Model以effectiveEfficiency=0保留已有sample N0、positive初始2，另算positiveAdded、positiveAmplified与controlsValid；0轮或e0不认证扩增，blank>0不通过。World分别列sample/blank/positive目标份数、阳性新增和对照状态，静态替代列抑制2/2/2/2/2；MD137、media、q4反馈/revisit同步。Apply已明确现实仪器信号a.u.并非copies。独立遍历2轮数×2起始量×3效率(e0/.5/1)×3情境=36组合，每项份数、新增和控制判据均通过，无模板消失。

### S6-SCI-02 · P2 · 不敏感酶分支仍显示抑制符号

- Owner：molecularEnergy（ME作者）。状态：**CLOSED · 2026-11-15独立复核**。
- 位置：`apps/web/src/MolecularEnergyWorld.tsx:722`的FeedbackArt，`:774`无条件绘制红色抑制横杠`M240 150h30`；不敏感分支只是把返回路径变成蓝色虚线，路径仍抵达E1。
- 影响：选择不敏感对照时，数值正确保持9，但图仍出现作用于E1的标准抑制线，削弱“只对敏感酶起作用”的对照逻辑。
- 最小修正：仅在敏感分支绘制返回抑制线及横杠，或在不敏感状态明确断开/标无作用，保证图与9不变的数值一致。保持E1在反应箭头上，不把酶变成反应物。
- 必须复核：S=6，P=0/4/12，敏感9/4.5/2.25、不敏感均9，切换后图符号与条件相符。
- 修后实读：sensitive分支才包含红色返回线和抑制cap；inactive分支的蓝虚线终止于x360，不抵达E1(x218–293)，并明确No E1 connection: no inhibition。重新直接计算所列六个通量数值均正确。独立查看最新L128双语操纵图左右两张，未见inactive红cap或连至E1；截图S12/P16不敏感通量10.29也与12×12/14一致。

### S6-SCI-03 · P2 · L121–L128缺失中文Explain最后一段的英文对应

- Owner：molecularEnergy（ME作者）。状态：**CLOSED · 2026-11-15独立复核**。
- 范围：八个MD的Explain中文均有第五段，英文止于第四段。缺失的内容有实际证据策略，不能视为无关修辞。
- L121缺密度实验如何排除保留/分散替代模型；L122缺用互补/端点反证和反向展示须同时反排字母；L123缺插入、替换、3nt插入与移码的分别比较；L124缺采样窗口、每细胞/整样品及相对标尺控制；L125缺自由能与原子守恒、完整反应物产物；L126缺直接阻断部位与下游间接效应；L127缺剩余ATP的预算检验；L128缺底物、温度、酶量及测量干扰的混杂控制。
- 最小修正：在相应英文Explain补充语义等价段，不删中文，不为字数参考范围删掉科学边界；复核两种语言仍使用相同数据、条件及否定范围。
- 修后逐段核读：L121密度证据/替代模型、L122反排端点与字母、L123插入/替换/移码、L124采样窗口与相对标尺、L125完整反应守恒、L126直接干预与后续效应、L127剩余资源、L128混杂与测量干扰均已有完整英文。每段数值与科学否定范围和中文相符。Explain正文真源是MD，未要求不存在的Lesson.Explain字段。

### S6-SCI-04 · P2 · L127双语图底部预算与反应式重叠

- Owner：molecularEnergy（ME作者）。状态：**CLOSED · 2026-11-15最新截图独立复核**。course_browser先实屏发现，初审时本审阅者已独立打开其原始PNG确认。
- 位置：`MolecularEnergyWorld.tsx` PhotoArt底部两个Label，基线y370/400；第一个英文tspan位于391，下一中文400，行间不足。图里“Budget supports 2.00 μmol net G3P”与“3 CO2+9 ATP+6 NADPH…”中文反应式相互压住。
- 初审证据原图已归档至`biology-s6/run-history/before-source-repairs/`；最新同名final图是修后版本。初审时1366宽视口、双语、ATP36/NADPH24，模型预算输出2.00 μmol正确，文字重叠影响科学读图。
- 最小修正：给两个双语文字块足够垂直间距，例如把第一预算块上移，或扩高viewBox并重排；不能仅增加横向滚动。需重新实屏核对三语言、默认与操纵设置，确保全部结果和计量关系可读。
- 修后源码预算块baseline350，公式仍400。独立打开最新`final-1366-L127-bi-initial.png`和`final-1366-L127-bi-manipulated-final.png`：预算中英两行与反应式中英两行均分离、内容完整。三语言/双宽完整布局矩阵由course_browser另验，此关闭不冒称本审阅者逐开全部截图。

## 已读内容与96题答案记录

逐课实读中英Explain、Depth、Misconception、Apply及其自查；实读全部terms的word/meaning、3目标与3预测、每题prompt/全部options/correct/feedback/revisit。下表答案按界面A/B/C（索引0/1/2）排列，顺序均q1–q4。四题正确索引经科学判断复核后，再用脚本核验全部中英题干、选项、反馈、revisit和术语释义均存在对应MD镜像，零差异；这项镜像检查不替代科学阅读。

| 课 | 4题答案 | 实读并核对的关键点 / Apply自查 |
|---|---|---|
| L121 | B B B B | 两新链均5′→3′、模板读取3′→5′、领导/后随相对给定叉；三轮8双链/2原始链/14新链。2起始双链两轮为8双链，原始链4/16=25%。半保留非保留半套基因。缺英文段见03。 |
| L122 | A B B A | 编码5′-ATG GCT TTT GGA TAA-3′、模板3′-TAC CGA AAA CCT ATT-5′、RNA5′-AUG GCU UUU GGA UAA-3′；GCT→GCC对应CGA→CGG与GCU→GCC。新模板CAA TTT给GUU AAA，不能推出整蛋白。DNA不变成RNA；核加工条件限定真核。见03。 |
| L123 | A B A B | 15nt/5密码子/4残基Met–Ala–Phe–Gly；UAA释放因子终止、无stop tRNA/stop AA；GCU反密码子3′-CGA-5′。同义不保证全部表达功能相同；Apply AUG GCC UUC UAG为3残基。见03。 |
| L124 | A B A A | R/P分开相对标尺、生成与移除、旧R时间步；a2/k.5/5min为R3.875/P4.453125，k.1为P.890625。低翻译与高蛋白降解都可解释同RNA低蛋白，需独立测合成/消失。见03。 |
| L125 | B B B B | 断键需能、整个水解净ΔG依条件；共享过程且负总和才符合教学驱动条件，负ΔG非速率。Apply +40−35=+5，酶不把正ΔG改负。见03。 |
| L126 | A B B A | glycolysis细胞质；丙酮酸氧化/TCA基质；ETC/ATP合酶内膜。6C/6CO2与12电子对、6O2分别记账；2+2+26≈30是选定例。乳酸分支2×3C、净2ATP、再生NAD+，不泛化全部无氧细胞。质子漏先降氧化ATP、CO2不必立即0。见03。 |
| L127 | A A B B | 光反应类囊体、Calvin基质；O2来自水，碳来自CO2；净G3P有限μmol预算min(C/3,A/9,N/6)，非速率/直接葡萄糖。6/18/6得1，9/18/18得2、补ATP27可到3；非黑夜专属。见03/04。 |
| L128 | A B A A | S/P浓度与v通量分开；S6/P0,4,12时敏感9,4.5,2.25，不敏感均9；可逆活性调控非酶量减半/物质变酶。S2→6且P4时3→4.5，反驳加底物完全无效但不普遍化。见02/03。 |
| L129 | A B C A | 接收、传导、响应分层；受体+下游均需要，配体不必穿膜。80/78结合、60/5响应差55个百分点，非某蛋白已确证；新情境50个藻细胞比较需中间步骤与活性对照。 |
| L130 | B C A B | 两轨迹−70→+30mV，同100mV幅度；100ms的2/5峰=20/50Hz；膜电活动沿轴突再生，递质仅化学突触，通道快速峰/泵维持梯度；整合不保证新峰。200ms的8/4峰=40/20Hz。 |
| L131 | A B C A | 负反馈抵消原偏差，非全量下降；ADH水重吸收/胰岛素信号闭环。10→7→4.9；预历史也10，k.6/d1为10→4→−2→−4.4。负偏差非负激素浓度；Apply8→6→4.5。 |
| L132 | B C A B | 选定T-dependent抗体响应，不宣称全部B反应依赖帮助；已有activated CD8开关单独控制。APC/T帮助/B→浆细胞→抗体与CD8杀感染宿主细胞分工；80→78而60/100→5/100非人群感染风险。Apply90→12、杀伤均50/100可分开变化。 |
| L133 | C A B C | A=2AA+Aa，分母2N；20/40/40为N100、80/200=.4；N0未定义，非A消失。HWE有假设，p+q恒等式不等于实测比例强制p²/2pq/q²。12/16/12为p.5、AA比例.3、期望10/20/10不自动证明选择。 |
| L134 | A B C A | 二倍体加性fitness1+s/1+s/2/1，经HWE起点加权归一，.4→.441379；再按(Np+Mps)/(N+M)迁入，再可选2N拷贝漂变，子代N固定。20/.4+10/.8=.533333；80/.25+20/.75=.35。无mutation/迁入不能创造缺失A；大N仍漂变。 |
| L135 | B C A B | root旋转保持AB/CD/ABCD；无枝长标度不读年代，上下非进步阶梯。G/G/T/T和形态字符只是有限证据，需外群、多独立证据、考虑趋同。新树((E,(F,G)),H)中FG是clade，排G的EF不是。 |
| L136 | C A B C | 2品系×2环境，每格3独立植物、day21/cm；连线接处理均值，非同株处两环境。平行10→16/14→20，交互10→20/14→16，响应+10/+2。遗传率非个人命运/因果基因数；Apply8→12与10→14均+4、差2。 |
| L137 | A B B C | N0整数；理想2×2^4=32，e.5为10.125期望份，非半分子；无起始目标不能创造目标。NTC污染、共有抑制/样本特异抑制、低拷贝与0轮非真实检测已成功都已讨论；抑制拷贝账本修后保留模板且对照独立判定，见01关闭记录。Apply阳性失败不能断阴性正确。 |
| L138 | A B B C | DNA负电向正，小常远限定线性DNA/凝胶；marker对数比非线性bp距离，400/450为175/167.778，差7.222示意单位，非真实分辨率。ATCG/AGCT等长不同序列；800bp同带不确定品种/来源/身份。 |
| L139 | A B B B | PCR增拷贝、工程/转基因/编辑概念范围；切/修复/检测分层，不所有editor双链切割。12+5+3=20已测、80未知，60%非全100已知成功/无脱靶。6/6 of30仍非30/30或无其他改变。 |
| L140 | A B B C | facts/unknown/values分开；12/20非60%安全或道德分数。继续封闭/暂缓扩大都可辩护，监督/停止/重审/最强反方，HHS仅人类研究伦理借鉴非植物许可法条。无外源DNA非零风险。 |
| L141 | A B B C | 描述/比较有效，不强迫操控；鸟练习虚构与官方/真实观察分开；完整同努力日期1/3/10各B−A2。17/53≈32.1%是年末幼狼组成非全年繁殖率/地区原因。 |
| L142 | A B B C | 两地点重复访问，3日期配对非3独立生境；A day7 NA/0min与day10真0/5min区别；B day7 8/10min排除且保留理由；按时间除不自动校正detectability。两盆×3×7=42读数仍仅2株。 |
| L143 | A B B C | A有效2/4/0均2；NA补0错为1.5、删除真0错为3。B全表均5混努力，等努力均4；三对差2；两range4非CI/显著。day1/3/7/10差2/4/3；新植物day1/2/8的2与1cm/day正确。 |
| L144 | A B B C | 正确摘要含问题/方法/2与4/3配对/5min/范围；中英图注同义、非只翻标题；420词/105=4min、/140=3min不含停顿，需实际排练，非自动科学评分。next=S06-P01，无L145。 |

答案数量96/96。术语ME64+SE56+BR64=184课内条目，符合每课6–10；并非184个去重词汇。每课均3目标、3预测、4题。未把错误预测/干扰项当成正文主张。

## 模型、SVG及静态替代核对

逐函数阅读三个Model，而非只计数：ME的nonnegative、dnaComplement、transcribe、translate受限密码子/给定阅读框、anticodon终止返回null、replication轮数/旧链、新链、expression旧R更新、coupling机制与符号、respiration两路径、carbonBudget、feedbackFlux；SE的finite/fraction/count、signalFrames、spikeTrain、feedbackFrames预历史、immuneFrames、alleleCounts、hardyWeinberg、selectedFrequency、migrate、seededRandom、evolutionFrames、tips/rotateTree/clades、mean与traitData；BR的pcrCopies/pcrEvidence、gelPosition、editingEvidence、researchObservations、summarise、eligibleObservations、pairedDifferences和talkMinutes。输入范围与UI可到条件逐项对应；PCR修后额外36组合复核见01。

以ES2022转译后独立直接调用模型核算，未调用作者测试来替代结论：

- expression(2,.5)第5步RNA3.875/P4.453125；k.1时P.890625。首步蛋白0与旧R规则一致。
- coupling(20,−30,true)=-10/true；相同值断开=false；35−30=+5/false。
- carbonBudget(6,18,6)为G3P1、固定碳3、剩ATP9/NADPH0；(9,18,18)为2/6/0/6。资源是μmol连续等价量，不向下取整成分子。
- feedbackFlux固定S6时P0/4/12分别9/4.5/2.25，不敏感均9；四种receiver/relay组合仅全true最终响应。
- feedbackFrames(.3,0)10/7/4.9/3.43；(.6,1)10/4/−2/−4.4。UI只选d0或d1，两者均在图轴−5..10范围内，不把纯函数支持但UI不选的d2算实屏分支。
- selectedFrequency(.4,.4)=.4413793103；migrate(.4,20,.8,10)=.5333333333；仅选择10代末.7761311257。漂变N20/seed17与29末都.35，但完整路径不同；N200分别.42/.4375。终点相同不等于模型未换种子；不能只凭一条轨迹断因。
- tree root旋转前后canonical clades都是AB/ABCD/CD；trait四格重复与均值/交互差均一致。
- PCR2份4轮32/10.125；初审复现抑制0轮错误，修后36组合验证不再复现，抑制始终保留N0/阳性2且新增0；gel400=175、450=167.7781874；editingEvidence=.6已测比例/.2已检查比例。
- 原鸟表8行保持A第7天null/min0、day10真0；等努力A/B分别均2/4、n3、range4，未筛B均5/range6；三个配对差各2。eligible筛去A的未访行后其missing=0只是所选集合统计，UI另明确原表缺失1，不误称原始数据无缺失。

逐24个Drawing/Art分支看过实际SVG元素、端点/箭头、数据计算、标签/单位、条件布尔与帧映射、完整静态文本/表格，并读三份CSS的局部横向滚动/最小图宽规则。没有发现非法hex颜色、错误的DNA端点、突触递质沿轴突箭头、酶作为被消耗底物、反向凝胶迁移、伪CI或无计算显著星号。ME128不敏感横杠除外。L126的`electronPairs=0`目前仅内部返回且未展示，不能解释为发酵没有氧化还原；若未来展示应命名为送往ETC电子对。图中12 e− pairs表示电子账本，没有画“NADH分子直接穿越内膜”的路线，不增加超出本课必要范围的穿梭细节。

这不是本审阅者逐开全部浏览器布局的记录。course_browser已另报24互动、384布局、6流程和5 SPA检查通过；本审阅者独立打开最新L127默认/操纵、L128操纵左右及L140双语左右/英文操纵图，确认127底行分开、128不敏感无抑制cap、140标题和圆形内容不再遮挡。未自行启动server，不把源码坐标或他人的批量截图统计冒充自己的实屏逐项检查。

## 六个Mission可完成性

| 任务 | 实际可用证据与CER推导 | 结论 |
|---|---|---|
| U31 有序表达证据链 | 模板→RNA→核糖体→4残基，核内转录/加工后输出、UAA终止；复制非每次表达前提。用同RNA3.875但P4.453/.891支持翻译层可解释，不能排除真实细胞降解等。 | 数据足够、单位/条件可引用；ME英文补齐已关。 |
| U32 代谢匹配 | 部位地图、碳/电子分账，+20−30=-10且需连接；6/18/6 μmol限G3P1；S6/P0→4通量9→4.5。至少两组证据可把机制与限制连接，不要求背全中间物。 | 可完成；不敏感酶图及127布局已关。 |
| U33 反馈图修复 | 胰岛素或ADH真实机制+虚构10→7→4.9与10→4→−2；逐箭头解释负反馈和延迟，另连接神经/免疫分支边界。未把模型步当人体分钟。 | 可完成。 |
| U34 双情景鉴别 | p.4、N20、10代、选择fitness1.4/1.2/1与漂变seed17/29/N200；上述数值可实算，迁入.533有分母。论证选择权重和随机抽样不同，单一路径不判因。 | 可完成；两seed终点巧合同为.35，可用完整表说明，不承诺必异终点。 |
| U35 DNA听证会 | 400bp仅大小、等长不同窗口、controls限制；12/20=60%、80未知、不证无脱靶；两种政策的facts/unknown/values/CER可成立。 | 任务推理成立；L137的P1已修后独立复核关闭。 |
| U36 问题/设计/数据/双语报告 | 虚构鸟表练习→官方或安全真实观察，保留原表/努力/NA/零/不等时间、等努力均2/4和三对差2、n非独立地点；摘要/图注/3–5min分镜支架均可做。 | 任务可完成；最终S06-P01已追加完整科学审阅，见末节。 |

15–16岁桥梁适配：核心路径/机制、可重算小模型、有限推断和迁移均足够，不依赖记忆大量中间物/细胞因子/算法。HWE、控制方程、基因树差异等均作为可选Depth或明确模型，未要求研究生细节。英语另练，不把英语流利度当生物理解门槛。无实际PCR、电泳、编辑、微生物培养或体液采集任务。

## 一手资料独立实读记录

以下链接均在2026-11-15实际打开并读取相应科学段落，状态为本审阅者verified，指概念核验，不表示转载图片、商业题库或整章。正文/习题/数列/SVG是原创教学内容。课程media中其他作者标记的verified不自动计成本审阅已读。

| 覆盖 | 实读一手页面及核验点 |
|---|---|
| L121 | [OpenStax 14.4 DNA Replication](https://openstax.org/books/biology-2e/pages/14-4-dna-replication-in-prokaryotes)：3′端延长、反平行与leading；[14.3 Basics](https://openstax.org/books/biology-2e/pages/14-3-basics-of-dna-replication)：半保留及两轮密度证据。 |
| L122 | [OpenStax 15.3 Eukaryotic Transcription](https://openstax.org/books/biology-2e/pages/15-3-eukaryotic-transcription)：启动子/转录因子、核内RNA与加工/输出。 |
| L123 | [OpenStax 15.1 Genetic Code](https://openstax.org/books/biology-2e/pages/15-1-the-genetic-code)：triplet、degeneracy及移码；[15.5 Protein Synthesis](https://openstax.org/books/biology-2e/pages/15-5-ribosomes-and-protein-synthesis)：RNA5′→3′、tRNA、终止和氨基酸装配。 |
| L124 | [OpenStax 16.1 Regulation](https://openstax.org/books/biology-2e/pages/16-1-regulation-of-gene-expression)：转录/转录后/翻译/翻译后多层；离散数值模型另独立计算。 |
| L125 | [OpenStax 6.4 ATP](https://openstax.org/books/biology-2e/pages/6-4-atp-adenosine-triphosphate)：净水解条件值与泵磷酸化偶联；教材“断键放能”的简写未照抄入课，课文正确比较完整反应。 |
| L126 | [OpenStax 7.2 Glycolysis](https://openstax.org/books/biology-2e/pages/7-2-glycolysis)、[7.4 Oxidative Phosphorylation](https://openstax.org/books/biology-2e/pages/7-4-oxidative-phosphorylation)、[7.5 Without Oxygen](https://openstax.org/books/biology-2e/pages/7-5-metabolism-without-oxygen)：部位、电子/质子、氧受体、乳酸/NAD+。 |
| L127 | [OpenStax 8.2 Light Reactions](https://openstax.org/books/biology-2e/pages/8-2-the-light-dependent-reactions-of-photosynthesis)、[8.3 Carbon Fixation](https://openstax.org/books/biology-2e/pages/8-3-using-light-energy-to-make-organic-molecules)：水供电子/O2、类囊体→ATP/NADPH、基质循环与非黑夜专属。 |
| L128 | [OpenStax 6.5 Enzymes](https://openstax.org/books/biology-2e/pages/6-5-enzymes)：活化能/ΔG区别及调控；虚构通量公式另算，不声称真实拟合。 |
| L129 | [OpenStax 9.1 Receptors](https://openstax.org/books/biology-2e/pages/9-1-signaling-molecules-and-cellular-receptors)：表面/胞内受体与传导条件。 |
| L130 | [OpenStax 35.2 Neurons](https://openstax.org/books/biology-2e/pages/35-2-how-neurons-communicate)：通道、离子梯度、动作电位再生、突触；波形特定值非普适常数。 |
| L131 | [OpenStax 37.3 Hormones](https://openstax.org/books/biology-2e/pages/37-3-regulation-of-body-processes)：渗透浓度、ADH与肾水重吸收负反馈。 |
| L132 | [OpenStax 42.2 Adaptive Immunity](https://openstax.org/books/biology-2e/pages/42-2-adaptive-immune-response)：APC、helper、B/抗体与细胞毒性T分工。 |
| L133–134 | [OpenStax 19.1 Population Evolution](https://openstax.org/books/biology-2e/pages/19-1-population-evolution)：拷贝频率、漂变/选择、HWE假设。19.2此次取回失败，未列独立verified；加性选择/迁入/二项抽样的原创公式已逐函数及数值核算。 |
| L135 | [OpenStax 20.2 Relationships](https://openstax.org/books/biology-2e/pages/20-2-determining-evolutionary-relationships)：同源/趋同、分子证据、clade全部后代。 |
| L136 | [NHGRI Polygenic Trait](https://www.genome.gov/genetics-glossary/Polygenic-Trait)：多基因及环境；[NLM/MedlinePlus Heritability](https://medlineplus.gov/genetics/understanding/inheritance/heritability/)：特定群体环境、非个人百分比、非不可改变。 |
| L137 | [NHGRI PCR Fact Sheet](https://www.genome.gov/about-genomics/fact-sheets/Polymerase-Chain-Reaction-Fact-Sheet)：选段扩增与模板重复使用；P1是模型量纲/物质账本矛盾，不能由一般PCR原理免责声明消除。 |
| L138 | [NHGRI Electrophoresis](https://www.genome.gov/genetics-glossary/Electrophoresis)：大小/电荷、凝胶筛分、标准比较。 |
| L139 | [NHGRI Genome Editing](https://www.genome.gov/about-genomics/policy-issues/Genome-Editing/How-genome-editing-works)：靶向、改变与脱靶问题；不从历史方法例推所有editor均同流程。 |
| L140 | [HHS Belmont Report](https://www.hhs.gov/ohrp/regulations-and-policy/belmont-report/read-the-belmont-report/index.html)：human subjects范围、respect/beneficence/justice与分析框架，非植物研究法定许可。 |
| L141–144 | [DOC Five-minute Bird Counts](https://www.doc.govt.nz/our-work/five-minute-bird-counts/)：5min/见闻鸟记录是index、与密度关系受条件影响；[UC Berkeley Stark: Experiments](https://www.stat.berkeley.edu/~stark/SticiGui/Text/experiments.htm)：比较、分配与混杂；[NIST Location](https://www.itl.nist.gov/div898/handbook/eda/section3/eda351.htm)：均值；[NIST Outliers](https://www.itl.nist.gov/div898/handbook/eda/section3/eda35h.htm)：先核查异常、不因不合意就删除。 |
| U36官方桥接例 | [NPS 2025 annual report](https://home.nps.gov/yell/learn/upload/2025-YELL-Wolf-Cougar-Elk-Project-Annual-Report-508.pdf)实际读取物理第5页完整相关表和上下文：2025-12-31，Northern36 adults+17 pups=53，Interior31+0=31，总84；8个pack/group（7 packs+1 group）另2个0 loner类别，17/53≈32.1%。表是年末组成，非全年出生率/存活率，0并不证明从未出生。初审web截图工具未返回可见位图，当时仅核原表文本；同日毕业项目追加审阅已实际打开本地原始页PNG并核hash，见末节。 |

网络方式：已读web-access技能并运行CDP检查，结果无浏览器调试连接；任务只需静态公开一手资料，遂按技能静态方式读取，未要求用户开浏览器。NPS为PDF，另读PDF技能并尝试页面截图；未产生本地PDF成品。失败的19.2响应及试探性不匹配链接均未作为核验依据，成功打开的42.2与NHGRI glossary才计入上表。

## S06-P01毕业项目独立科学审阅（同日追加）

**结论：通过本轮科学内容/定量/图示证据审阅，未发现新的科学P1/P2。** 完整实读`graduationProject.ts`、`GraduationWorkbench.tsx`、`graduationReport.ts`、`curriculum/s06/project.md`、`project-media.json`、`yellowstone-2025.json`；同时查阅对应fixture与test以区分测试虚构材料和产品默认数据。未使用测试绿灯替代下列独立核算。

### 官方来源与数据边界

本轮已实际打开本地`biology-s6/sources/nps-page-5.png`，完整查看原报告物理第5页的十个来源行、表题日期与上下文；不再仅依赖上轮web文本。PDF的SHA256独立算得`02B4C2EE9FA76DFBEF115586C61D29144BA13355E43234A4B8A2CAE57BC216D9`，与JSON及project-media一致。

- 十行逐一吻合：北部8 Mile 9/7/16、Rescue Creek12/4/16、Bliss Pass6/0/6、Junction Butte9/6/15、loners0/0/0；内部Cougar Creek4/0/4、Mollie's7/0/7、Wapiti Lake18/0/18、1470F group2/0/2、loners0/0/0。计数顺序为成年/幼狼/总计。
- 原表确为7 pack+1 group+2个零类别，并非10次独立实验或84条个体记录。原表汇总仅cross-check；wolfSummary只对十行一次求和，不再次加入总计。
- 独立计算北36+17=53、内31+0=31、总67+17=84；北17/53×100=32.0754717%、全园17/84×100=20.2380952%、差11.8373765个百分点；反馈32.08/20.24/11.84正确。北部四非零pack比例等权平均27.1875%并非正确合并比例，产品按总数加权。
- 两loner行0/0返回null并显示NA，不改成0%；Interior的0/31正常0%。counts为类别条形图，shares为地区合并比例且轴0–100%，未连类别成时间趋势、未添加伪CI/显著标记、未数字化历史柱图。
- 日期限定2025-12-31、访问2026-11-15，不冒称2026当前数量。快照不是出生率、存活率或密度，年末零幼狼不意味着全年零出生；疾病、迁移等未由该表测得，需额外证据。原报告上文也有出生但年末未存活的描述，支持此边界。
- 另实际打开并读取[NPS Wolf Ecology](https://www.nps.gov/yell/learn/nature/wolf.htm)中群体、监测和多因素背景，verified 2026-11-15；产品只把它作为背景入口，不用该页面倒推本表未测的地区因果。

### 安全自录、分析及图线

emptyGraduationProject的自录记录为空；fixture的TEST-PLANT及所有虚构文字仅用于测试，产品UI不导入fixture。日0是用户输入的真实起始日期，day为整数实际经过日；同株/同日唯一，NA/null独立于数值0。保留多株全部原表，但selected、valid、差值、相对变化、引用及图一次仅取activePlant；排除表说明其他株或缺失。单株多时点为纵向n=1，记录数不是独立植株数。项目仅观察现有熟悉室内植物、维持正常照料，不要求干预、采样或健康测量。

独立构造未写入产品的审阅用数据：A株day0=0、day2=4、day6=NA、day10=10 cm，B株day2=99 cm，startDate2026-10-01。得A有效3条、差10cm、相对变化NA；日期依次10-01/03/07/11，B不混入。SVG有效点x=100/224/720，符合0/2/10的实际间隔；只有day0→2一段线，不跨day6缺失连至day10。真实0点在基线保留。把首值改2，差8cm、相对(10−2)/2×100=400%，两个计算反馈分别接受8和400；首值0时相对反馈仅接受NA。空表差值/相对均null，未生成伪测量。

plot按所选株的实际最小/最大经过日定x轴，五个均匀数值刻度不是把不等间隔记录等距排列；y轴cm从0开始，非CI。源码缺失重置previous，所有原始行和未纳入理由随HTML保留，不把连线冒称每时刻连续实测。首/末是首次/末次有效高度，不把早期NA填0。

### 双语摘要、图注及报告

structuredAbstract官方三范围×两图形分支逐次生成并实读：中英均有相同范围、NPS日期、来源行数、成年/幼狼/总数、合并百分比和快照推断边界。植物两语均写自录、有效次数/cm、首末差值与相对百分比、纵向n=1、未经外部核验及非照料因果。actualGraduationCaption两语在counts/shares、快照非时间线、0/0 NA或植物单株/实际日/cm/缺失断线方面同义。

这些是从实际数据生成的辅助结构化支架；UI与HTML都明确不是自由文字自动翻译、不替代学生主张。正文可任选语言，可选英文句型仍需学生补实质内容。不同记录ID不等于不同独立来源或重复；改变范围、日期、植株及引用行数值会清理失效引用并撤销当前case的saved标记，另一case保留。两个官方定量核对明确是北部与全园，不假装随scope改变题意。

HTML实读含实际SVG、全原表/排除理由、数据范围/合并摘要、来源机构/页码/日期/URL/hash、结构摘要、中英图注、学生各字段/引用/修订、五段口头稿、自核和真实学生综合题选择。未答保留未答，错误学生选择不变为标准答案。动态文字经escapeHtml，图/表保留横向滚动及打印CSS；本审阅者检查结构和科学含义，不宣称逐页打印视觉验证。

### 六道高级综合题逐项复核

六题所有中英prompt、全部三个options、correct、feedback、revisit已实读；答案为**A B C A B C（0/1/2/0/1/2）**，非仅检查数目。

| 题 | 独立推理及反馈边界 |
|---|---|
| S06-Q1 | AUG–GCC–UAA得到Met–Ala两残基，UAA终止非AA；GCC→GCU仍Ala，但不保证一切生物学后果相同。 |
| S06-Q2 | min(6/3,18/9,6/6)=1 μmol净G3P，NADPH限制，只加ATP无助；没有时间信息不得称μmol/s。 |
| S06-Q3 | 10/4/−2是相对目标偏差；−2为越目标2单位，不是负激素浓度，不诊断疾病或证明无限发散。 |
| S06-Q4 | 二倍体同倍性加权(20×.4+10×.8)/30=16/30=.533333，混合效应是基因流不证明选择/适应。 |
| S06-Q5 | 合格controls+同一位点约400bp仅支持片段大小相似；单碱基替换可保留400bp，不读取序列或确认唯一身份/全基因组。 |
| S06-Q6 | 单株2/4/NA/0的有效算术均(2+4+0)/3=2cm，3读数但1株；NA不0、真0不删。反馈特别区分不等间隔的记录算术均与时间加权均值。 |

### 口头稿、自核及完成状态边界

五个明确标题段均要求自己的笔记（任一语言）、整数秒1–300且总180–300秒；默认45×5=225只是计划，未填笔记/未完成自核仍不能保存。独立把一段设0及计划总超300，caseProblems均标出时间问题。四项manualRubric涵盖来源/单位/缺失、主张与测量/假设区分、替代解释/独立重复/挑战证据、排练修订。结构保存不判断任意自由文字的科学质量，UI和导出也如实声明；“已排练”是学生手动自述，不是软件自动认证实际时长。

另读graduationStageOutcome：仅当前学生自己的S06 24课、6任务、至少一个saved且结构仍有效的case、六题全答且≥5/6才complete；报告保存与综合题分开。课程144课available不是学生完成，也不是published。科学审阅通过不意味着已有孩子真实完成该项目。

## 最终验收边界

四个初审问题均关闭；课程与毕业项目各自科学内容/模型/证据审阅均通过。此报告明确区分本审阅者实读和独立计算、本人实际打开的修后PNG及原始PDF页图，以及course_browser另行报告的批量交互/布局检查。毕业项目真实浏览器完整流程、离线HTML视觉/打印QA与root代码验收由对应验收记录承担；没有外部学科专家审签、没有儿童试学，不宣称这些已完成。没有提交或推送Git，没有修改生产课件。
