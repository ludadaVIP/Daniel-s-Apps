# 生命探索 · Biology Explorer

面向 10–16 岁的本地双语试学版，沿用 Study 的 React、Vite、路由、`@study/shared` 类型和 `@study/ui` 语言组件。无需账户或新的服务器。

2026-11-14：S01–S05共120/144课、30个单元任务与5个阶段项目已实现，全部为家庭试学稿；S06仍有24课规划中，下一单元为U31（L121–L124）。S5实现与验证进度见 [S5_DELIVERY.md](./S5_DELIVERY.md)，S4历史说明见 [S4_DELIVERY.md](./S4_DELIVERY.md)，S3历史交付见 [S3_DELIVERY.md](./S3_DELIVERY.md)，逐单元记录见 [CONTENT_PROGRESS.md](./CONTENT_PROGRESS.md)。

## 试用

照常启动 Study，打开 `http://localhost:3463/biology`。独立开发：`pnpm --filter @study/biology-web dev`，端口 3460。

目前开放U01–U30共120课：S01生命侦探、S02细胞与身体、S03生命的联系、S04看见机制、S05中学生物核心。S04连接细胞分裂、酶、光合与呼吸、遗传、进化、生态循环；24课均有分层机制解释、原创图解、可操作交互、静态说明、术语和4道反馈题。过程模型提供暂停、逐步和重播；静态条件比较使用真实有效的选择操作。每课按「先猜→发现→挑战→带走」组织，S01/S02建议15–20分钟，S03约25–30分钟，S04约30分钟，S05约30–40分钟。三种语言模式共享进度，“再想深一点”提供高中衔接。

探索地图保留六阶段、36单元、144课的标题和编号。其余24课（S06）标为规划中，没有空课件入口。课程制作数量为83.3%，不代表教学质量或学习效果验收率；当前仍处于家庭试学阶段，完整目标尚未完成。

第一阶段作品已开放：`http://localhost:3463/biology/project/S01`。在真实观察或原创虚拟后院中记录5种生物，写下证据、环境和疑问，再用中英文各总结一句；5道综合题可订正。24课、6个单元任务、保存作品与综合检查至少4/5共同构成阶段探索。

第三阶段作品：`http://localhost:3463/biology/project/S03`。比较随机/手选样方与路边方案，查看逐格计数，计算样本密度和全场估计，写主张、两条证据、推理、待补数据和双语摘要；可下载完整纯文本报告。数据为原创虚拟草地，不是实际野外调查。综合题可订正，完成需本阶段24课、6任务、保存作品和五题全答至少4/5。

第四阶段作品：`http://localhost:3463/biology/project/S04`。《解释一个看得见的现象》可选植物生长、酶活性或生态变化，各有四幅原创科学分镜、数值记录、独立草稿和完整SVG导出。学生引用两条证据，区分观察与模型，连接微观机制并设计可反驳检验；可用任一语言完成。S04独立要求24课、6任务、至少一个完整已保存题材和六题全答至少5/6。填写完整只确认结构，不自动判定科学文字或英语质量。

第五阶段作品：`http://localhost:3463/biology/project/S05`。《生物学证据报告》提供四个块茎、20条初终配对的原创虚构记录与五组汇总；学生计算百分比、修复浓度–质量变化图、选择两条有效引用，写出主张、机制、局限、替代解释和进一步实验。图标题英文、图注双语，科学说明可用任一语言，英语弱不锁进度。完整SVG保留实际图、全部数据、假设、长说明与检验字段；编辑会撤销作品保存标记。S05独立要求24课、6任务、有效已保存报告和六题全答至少5/6。四块茎不等于20个独立生物样本；约0.3002154 mol/L只估计给定条件零净质量变化，非精确胞内浓度或平衡证明；min–max不是CI。自动检查结构、计算和图设置，不判断科学说明真伪。

S05新增72目标、168课内术语条目（非全局去重词汇）、24预测、96反馈题，各课含机制解释、数据例题、迁移自查与Depth。内部科学/教学与代码审查、最终24文件165测试、两应用类型/构建、课程24活动/384布局/6完整流程及项目/六任务/实际SVG技术验收已通过；证据、源码变化历史、复跑命令与包体warning见[S5_DELIVERY.md](./S5_DELIVERY.md)及[QA_CHECKLIST.md](./QA_CHECKLIST.md)。外部专家审稿、儿童试用和学习效果仍未验证，全部课程保持`pilot`。

## 保存与复习

- `localStorage` 的 `study-biology-v1` 保存预测、步骤、已探索状态、回答、第一次回答、完成时间、发现笔记、单元 CER（主张、证据、推理）任务与阶段作品草稿/综合题。U01沿用原任务字段，后续单元任务独立保存，旧版记录无需重置。共享语言偏好使用 `study-language`。
- 数据只在当前浏览器和当前站点地址保存；3463 与 3460 的记录相互独立。没有云同步。
- 每轮最多4题，错题优先。错题即刻进入复习；已完成课程的题目在约1、7、30天后进入回忆队列。再次答错仍保留，下次进入复习再次出现。
- 生物理解、推理与证据、英语词汇分别记录。概念题达到80%且推理题正确时显示理解已掌握；“已探索”表示完成流程，英语不会锁住下一课。
- 无法保存时显示警告并允许继续；无法解析旧记录时尽可能备份到 `study-biology-v1-backup`，不将坏记录当作学习成绩。

## 内容维护

`curriculum/index.json` 保存完整课程路线；`curriculum/s01/u01/l001.md` 至 `l004.md` 以及 s01/u02/l005.md 至 l008.md、s01/u03/l009.md 至 l012.md、s01/u04/l013.md 至 l016.md、s01/u05/l017.md 至 l020.md、s01/u06/l021.md 至 l024.md、s02/u07/l025.md 至 l028.md、s02/u08/l029.md 至 l032.md、s02/u09/l033.md 至 l036.md 是双语讲解、误区与进阶说明的真源，UI 使用固定区块读取。`apps/web/src/content.ts` 保存教学元数据、统一词卡、预测和题目反馈；U02、U03、U04、U05、U06、U07、U08、U09 元数据独立放在 src/content/micro.ts、plants.ts、body.ts、ecology.ts、inquiry.ts 、cells.ts 、exchange.ts 和 energy.ts。`Explore.tsx` 、MicroWorld.tsx、PlantWorld.tsx、BodyWorld.tsx、EcoWorld.tsx、InquiryWorld.tsx 、CellWorld.tsx 、ExchangeWorld.tsx 和 EnergyWorld.tsx 保存原创SVG与交互组件；LabPlayback.tsx 共用播放、暂停与逐步控制，`models.ts` 、`cellModel.ts` 、`exchangeModel.ts` 与 `energyModel.ts` 保存可测试的简化规则。稳定资源ID为 `Lxxx-D01` 和 `Lxxx-I01`；来源记录在同单元的 `media.json`。`project.ts` 和 `FieldProject.tsx` 保存阶段项目内容与界面，项目说明位于 `curriculum/s01/project/field-notebook.md`。幼苗数据全部为虚拟数据；公平比较组件只检查方案，不预测实验结果。U07三种代表细胞可按90°转动二维示意，区分叶肉与典型地下洋葱鳞叶表皮；昼夜模型假定细胞活着且有氧、已有养分等条件，只给定性作用，不预测真实代谢速率。

新增课程须编写完整 Markdown、题目、双语图示和交互，先核对内容再加入可学习列表；不要仅将路线表的状态改为可用。所有现有内容标为 `pilot`，用于家庭试学；儿童实际试用和外部科学审阅尚未完成。

S03正文位于 `curriculum/s03/u13/`–`u18/`；元数据位于 `content/connections.ts`、`regulation.ts`、`populations.ts`；三组 `*World.tsx` 经 `s3Visuals.tsx` 按需加载。新模型及测试独立保存；`EcoResearch.tsx`、`ecoProject.ts`、`ecoReport.ts` 实现阶段项目和完整报告导出。`progress.ts` 为S03新增独立草稿形状与完成计数，保持旧存储版本和S01/S02兼容。

S04正文位于 `curriculum/s04/u19/`–`u24/`；元数据为`content/divisionEnzymes.ts`、`energyGenes.ts`、`evolutionCycles.ts`，三组视觉经`s4Visuals.tsx`按需加载。`divisionEnzymeModel.ts`、`energyGeneModel.ts`、`evolutionCycleModel.ts`保存规则与原创数据；`StoryboardProject.tsx`、`storyProject.ts`、`storySvg.ts`实现三题材作品。项目科学合同和版权来源在`curriculum/s04/project.md`与`project-media.json`。存储版本仍为1，S01–S03记录兼容，阶段计数分别检查。

S05正文位于`curriculum/s05/u25/`–`u30/`；元数据为`content/transportPhysiology.ts`、`plantInformation.ts`、`immunityEvidence.ts`，三组视觉经`s5Visuals.tsx`按需加载。`EvidenceReport.tsx`导出项目组件，`evidenceProject.ts`与`evidenceSvg.ts`实现域层校验与完整安全SVG；科学合同见`curriculum/s05/project.md`及`project-media.json`。存储版本保持1，S01–S04兼容且各阶段计数独立。

## 验收

```bash
pnpm --filter @study/biology-web test
pnpm --filter @study/biology-web typecheck
pnpm --filter @study/biology-web build
pnpm --filter @study/hub build
```

浏览器试用：选一课 → 提交不评分预测 → 点图上数字查看结构 → 操作证据卡/模型 → 阅读解释 → 做4题 → 记录发现 → 完成本课。刷新确认恢复，切换三种语言确认内容和进度一致。故意答错后打开复习，检查解释与回看提示。在发现笔记填写主张/证据/推理，确认刷新后保留。

给孩子试用时只观察：能否独立走完一课、是否愿意继续、能否用自己的话解释。后续按完整单元推进课程，并根据实际反馈调整难度和篇幅，保持操作简单。

U08扩散模型是独立点的有种子随机走，七帧可重复，事件次数包含往返；相邻数量变化严格对应两方向事件之差。渗透仅示意相同起始压力/温度下水的净趋势，不计算最终状态；几何采用同体积8u³、全部六个外露面及中心最近距离，不将动画速度当真实交换速率。

U09的光合作用沿用共有条件规则，不将光档位算成速率。碳示踪保留原子身份；呼吸保留昼夜与叶绿体的区别，缺氧只关闭示范有氧路线。食物链1000E为假设植物有机物能量，5/10/20%是比较情境；每层保留枯落物、热与下一层三种去向，不能外推真实效率、数量或个人指标。

U10用早餐与拿书情境连接消化、吸收、肺泡交换、血液运输与细胞反应。`content/systems.ts`和`s02/u10/l037.md`至`l040.md`保存双语课程，`SystemsWorld.tsx`保存原创模型，`systemsModel.ts`保存可检验规则。八个半径减半球模型同总体积而表面加倍；不套作真实肺泡面积或气体速率。虚构分压p只判断净方向。血液路线包括门静脉与肝，CO₂碳以变化形式运输；隐藏单连接只影响所选新完整递送，不删除已有养分或储备。

U11的 `content/vascular.ts` 与 `s02/u11/l041.md` 至 `l044.md` 保存双语正文。`VascularWorld.tsx` 使用原创可逐步SVG，`vascularModel.ts` 保存总水势方向、独立源库、叶片条件与传粉发育规则。根毛只改变接触表面；气孔情境固定光/温度/风，开度由按钮设定，两种外界湿度都低于叶内水蒸气条件。不计算通量或健康。花粉粒留在柱头，精细胞沿管递送，成功分支明确假设适宜发育；不相容分支不产生种子。

U12的 `content/diversity.ts` 与 `s02/u12/l045.md` 至 `l048.md` 保存双语正文。`DiversityWorld.tsx` 使用六个原创SVG样本与逐步模型；`diversityModel.ts` 保存检索、证据层次与条件性资源关系。只对六幅已标定图给出检索结果，未知可暂停；互利不等于所有共生。花粉条件只支持潜在传粉帮助，不保证结实；栖息地焦点不提供完整分布、数量或未评估影响。S02的6个单元与阶段项目已开放。

第二阶段作品：`http://localhost:3463/biology/project/S02`，位于首页U12之后，也可从U12手帐进入。四张路线卡区分水/CO₂物质、光能与糖的物质/储存化学能；中英总结、标签提示、五题综合理解和SVG下载。`LeafJourney.tsx` 沿用Study语言与布局，`StageCheck.tsx` 为两阶段共用题卡；`leafProject.ts` 定义内容、记录与校验，`leafDiagram.ts` 生成原创图解及转义后的独立导出。现有记录版本保持兼容；两个阶段的作品形状与完成条件分开。输入只自动保存草稿，修改文字/标签后需再保存作品；词句不自动评分。
