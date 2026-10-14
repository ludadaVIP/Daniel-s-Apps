# 数学探索实验室 / Math Explorer Lab

> **课程与内容总规划 · `plan.md` · v1.0 · 2026-10-14**  
> **对象 / Learner:** 11 岁、新西兰 Year 6；家长陪学；实际知识起点未知，需要诊断。  
> **范围 / Scope:** 小学高年级基础补桥 → 小学五六年级核心 → 初中 → 高中；中英双语。  
> **技术环境 / Delivery:** Node.js + React + Markdown（已有工程）。本文件规划课程和教学体验，不负责实现应用代码。  
> **不做 / Out of scope:** 注册、社交、排行、商业化、推广、复杂后台运营。  
> **设计原则 / North star:** 先理解，再计算；先具象，再抽象；短课、小成功、持久学习。

---

## 1. 首先做对的事 / Start at the right level

**关键结论：不要按“在新西兰读 Year 6 = 中国几年级”强行定位。** 不同课程的内容顺序不同。让孩子用低压力诊断展示*会什么、不牢固什么、还不会什么*，再按技能树学习。分级名只是课程组织用，不是对孩子能力的评价。

新西兰教育部公布的 Year 6 数学涵盖：大数读写、估算和四则计算；小数到千分位；分数/小数/百分数的联系；角、面积与图形；统计图、平均数与极差；简单概率等。因此，可以将它作为学校内容的**交叉参考**，同时按孩子实际掌握情况补桥。完整课程还应顾及新西兰的 Statistics & Probability（统计与概率），避免只学计算和代数。

**学习主路径：** `诊断 D00 → B00 按需补桥 → P05 → P06 → J07 → J08 → J09 → H10 → H11 → H12`。

- **小学段 P05/P06**：借鉴中国五、六年级知识层次，但不是逐页照抄教材；分数、小数、比、百分数、基本方程最优先。
- **初中段 J07–J09**：借鉴七至九年级数学的概念顺序，并单列数据与概率。
- **高中段 H10–H12**：覆盖通用主干的函数、代数、三角、解析几何、统计概率、数列、向量及微积分入门；拓展内容可选。
- **与新西兰学校同步**：每个知识点保留 `nzYearHints` 和 `cnGradeHints` 作为辅助标签，不当作学习门槛。新西兰高年级课程与资格体系持续调整，未来按当时官方文件维护考试映射，不将当前目录等同于 NCEA/NZCE 备考保证。

### 1.1 诊断 / Diagnostic D00

把诊断做成 **4 组 × 6 题 = 24 题**，每组可分开完成，不显示令人紧张的“考试成绩”。不依赖一次测试决定终生路径，家长可手动调整。

| 题组 / Group | 检查目标 / Targets | 推荐题型 / Types |
|---|---|---|
| D01 数感与四则 / Number sense | 位值、估算、乘除、运算顺序、整数应用题 | 填空、计算、应用 |
| D02 分数、小数 / Fractions & decimals | 等份、大小比较、分数图、十分位、分数与小数 | 图选、拖拽、填空 |
| D03 图形与测量 / Geometry | 周长、面积、单位、角、基本图表 | 可视化单选、数值 |
| D04 关系与推理 / Reasoning | 两步问题、规律、未知数、解释理由 | 应用、选择、简答 |

**诊断实施细节 / Rules:**

1. 每组前 2 题为保底基础，后 4 题逐渐涉及小学高年级；不搞“快速做题”竞赛。
2. 给出“不确定 / I'm not sure”和“先跳过 / Skip for now”，错题后不立刻批评。
3. 某技能近似规则：`2/3 以上独立正确且能解释` → 暂认为掌握；连续失误或不会解释 → 推荐对应补桥；**此阈值是产品起始启发式，不是经过验证的教育测量标准。**
4. 分数、小数、乘除等关键能力分别判断，不能一个总分把孩子锁定为某个年级。
5. 结果显示“建议从 B03 计算基本功 + B04 分数”这样的**技能建议**，允许跳过已经会的内容、调整起点、随时回头复习。
6. 不以速度或一次失误判断数学能力；有些孩子能正确推理，但阅读英文题目需要协助。

**诊断样题锚点（完整中英双语） / Anchor examples:**

- 计算 `408 − 179 = ?` / Calculate `408 − 179 = ?`（229）
- 计算 `24 × 6 = ?` / Calculate `24 × 6 = ?`（144）
- 计算 `936 ÷ 12 = ?` / Calculate `936 ÷ 12 = ?`（78）
- 选择最大：`0.8, 0.75, 0.805` / Choose the greatest（0.805）
- 一张披萨切成 8 等份，吃了 3 份，吃了几分之几？ / A pizza has 8 equal slices; 3 are eaten. What fraction was eaten?（3/8）
- 长方形长 8 cm、宽 5 cm，面积是多少？ / A rectangle is 8 cm by 5 cm. Find its area.（40 cm²）
- 计算 `1/2 + 1/4` / Calculate `1/2 + 1/4`（3/4）
- 解 `x + 17 = 42` / Solve `x + 17 = 42`（25）

注意：上面是**示例锚题**，不是完整的 24 题题库；第一次开发时需编写、检查并保留完整版本。

---

## 2. 一节微课的标准 / Anatomy of a micro-lesson

**推荐时长 12–20 分钟（可拆成两次），通常每次只学一个主要概念。** 习题不求多，每课初始 5–8 题，教师/家长可增减；复杂概念可拆成两课。不要为了赶进度而拖长时间。

| 顺序 / Step | 设计 / Design | 参考时长 |
|---|---|---|
| ① 情境钩子 / Hook | 生活中的一个问题、猜测或反直觉小实验；简短即可 | 1–2 分钟 |
| ② 操作观察 / Explore | 数轴、分数条、几何拖拽、图表模拟等，孩子先预测再拖动验证 | 2–4 分钟 |
| ③ 核心讲解 / Explain | 一条核心定义、一个清晰图示、一至两个逐步例题 | 3–5 分钟 |
| ④ 我们一起做 / Guided | 1–2 道带提示的题，孩子说思路，家长适时提问 | 2–3 分钟 |
| ⑤ 我来做 / Practice | 5–8 道多题型、难度渐进题（可自适应缩短/增加） | 4–7 分钟 |
| ⑥ 收尾 / Exit ticket | 一道新情境迁移题 + 一句自己的解释；决定复习还是进阶 | 1–2 分钟 |

**可视化教学链：实物/图像 → 操作/语言 → 数学符号 → 迁移应用。** 每节只选*对概念有帮助*的可视化，不要为了炫目加入无关动画。数学结构越清楚越好。

**默认练习组合（不是强制）：** 1 个概念判断 + 2 个计算或填空 + 1 个图形交互 + 1 个应用问题 + 1 个解释/纠错 + 1 个出口题。题型依教学目标调整：证明类课程必须允许书写理由，不能全部变成选择题。

### 2.1 题型库 / Exercise types

| `type` | 中文 / English | 答案/检查要求 |
|---|---|---|
| `single_choice` | 单项选择 / Single choice | 正确选项 + 对每个干扰项的错误解释 |
| `multi_choice` | 多项选择 / Multiple choice | 完整选项集合，允许“尚未选全” |
| `fill_blank` | 填空 / Fill in the blank | 文本、数值、分数，容许合理等价形式 |
| `numeric` | 计算 / Numeric calculation | 带符号、小数、单位、精度规则 |
| `fraction` | 分数输入 / Fraction entry | 等值分数判对，约分要求可另设 |
| `step_by_step` | 分步计算 / Step-by-step | 检查关键步骤而不只看终值 |
| `visual_select` | 看图选择 / Visual selection | 数轴点、分数模型、面积块等 |
| `drag_drop` | 拖拽与排序 / Drag, drop, order | 数轴排序、图形匹配、等值分类 |
| `interactive_graph` | 作图 / Interactive graph | 检查点、线、区间、函数曲线特征 |
| `geometry_construct` | 几何构造 / Construct geometry | 检查几何约束，可提示人工核对 |
| `true_false_reason` | 判断并说明 / True/false with reasons | 必须提供理由；解释可家长核对 |
| `word_problem` | 应用题 / Word problem | 列式、结果、单位、语境解释 |
| `error_spotting` | 找错纠错 / Spot and fix the error | 说明错因与正确方法 |
| `open_response` | 思考与证明 / Explain or prove | 不要仅用字符串相等自动评分；家长审阅 |
| `mini_project` | 小项目 / Mini project | 过程、图表、结论；家长指导 |

**题量与反馈 / Feedback:**

- 单选题不能超过整课的一半；需要**主动生成答案**（计算、解释、应用）。
- 第一次答错：提示“想一想整体被分成几份”，而不是马上暴露答案；第二次可以给图示；再不会给完整分步讲解。
- 错因至少区分 `concept / calculation / reading / representation / carelessness / unknown`，其中粗心应谨慎标注，不可默认把没学会叫“粗心”。
- 关键前置能力可以安排 `立即 → 下一次学习 → 数日后 → 一两周后` 的错题重现；这是可调整的默认节奏，不是硬性间隔算法。
- 不因高难度题没做出而剥夺正常进度；概念理解比连续打卡更重要。

### 2.2 趣味设计 / Engagement without noise

以 **“发现 → 猜想 → 操作 → 算出来 → 解释为什么”** 作为主要乐趣，而非大量虚拟金币。每个单元至少配备一个微实验：

- **数与运算 / Numbers**：可拖动十进制积木、可展开的竖式、面积阵列、估算滑杆。
- **分数与百分数 / Fractions**：分数条、披萨/巧克力等分图、百格板、双数轴。
- **比与代数 / Ratios & Algebra**：配方混合器、双向天平、价格关系图、函数机器。
- **几何 / Geometry**：格点拼图、角度拖动、折叠与展开、可变化的三角形。
- **函数 / Functions**：参数滑块改变图像；同一情境的表格、表达式、图像联动。
- **概率统计 / Statistics**：投掷转盘模拟、收集真实数据、箱线图和散点图。
- **高中 / Senior maths**：切线逼近、曲线下累积面积、概率分布模拟。

游戏应让孩子*操纵数学对象*、观察结构，而不是替数学练习套一个分心的皮肤。每单元末尾安排一次“家庭挑战 / Family challenge”，使用 New Zealand 日常语境（NZD、超市、公交、天气、体育、地图、烘焙），不过度依赖具体品牌与外部网络服务。

---

## 3. 课程设计规范 / Curriculum design contract

- 每个 `lesson` 有稳定编号、**一个主要学习目标**、前置课程编号、至多 3 个关键词、1 个核心解释、1 个可视化、1–2 个示例、5–8 个初始练习、1 个出口题、家长辅导提示、错因与复习标签。
- 正文 **中文和英文并列**，不是“全中文配几个英文术语”。题干、按钮、提示、反馈、例题步骤都要双语；可以切换 `中文优先 / English-first / Side-by-side` 显示。
- 英文使用新西兰常用习惯（如 `maths`, `metres`, `litres`），数值例子适用 NZD、km、°C；切勿把英语读题困难误判成不会数学。
- 每个技能在后续至少跨单元复现两次；保留必要的口算与笔算基本功，但不把机械重复当作理解。
- 并非所有模块都是前一模块的严格前置依赖：几何、数据可以与数与代数交替学习，形成“一个数与代数单元 + 一个几何/统计小单元”的节奏。
- 小学生可用纸笔书写步骤。电脑端不适合长篇手写证明的场景允许家长观察、给出反馈；高中也支持计算器在指定活动里使用，不等于用计算器代替概念理解。

### 3.1 学习完成状态 / Mastery states

- `not_started` 未开始；`exploring` 探索中；`practice_needed` 需要巩固；`ready_to_progress` 可以前进；`review_due` 需要复习。
- 进入下一课建议：核心练习中的代表性题型能独立完成，**出口题独立成功并能简要解释理由**。初始参考：通常达到约 80% 正确、关键题型不过度依赖提示；标准可由家长调节。
- 若连续两次卡住 → 提供更具体的图示与 B00 先修路径；若掌握得快 → 可选挑战题（不强制加速整套课程）。
- 每个单元末有 `Unit check` 6–10 题，回顾多个知识点；结课之后继续穿插维护，不单靠一次测验判定“永久掌握”。

---


**课程规模 / Planned scale: 9 阶段、67 单元、358 节微课（不包括诊断、单元测验、复习课和可扩展题库）。**

## 4. 课程全景 / Full curriculum map

**编排说明：** 下列 `Uxx` 是单元、`Lxx` 是微课；课程名称逐条中英双语。内容覆盖计划不等于已经有题库。实现时要为每一微课填充标准 lesson 模板、插图与经过人工核查的练习。

### B00 · 基础诊断与补桥 / Foundation Check & Bridge

**教学定位 / Focus：** 实际起点决定是否学习；不按年龄贴标签。  
**阶段完成能力 / Exit capability：** 能够解释位值、熟练基础四则、理解基础分数并解决一步至两步应用题。

#### B01 · 数字、位值与数轴 / Numbers, Place Value & Number Lines

- `B01-L01` 万以内及更大数的读写 / Reading and writing larger numbers
- `B01-L02` 位值与展开式 / Place value and expanded form
- `B01-L03` 比较、排序与数轴定位 / Comparing, ordering and locating numbers
- `B01-L04` 四舍五入与合理估算 / Rounding and reasonable estimation
- `B01-L05` 用图画解释数的大小 / Explaining number size with diagrams

#### B02 · 加减乘除的意义 / Meaning of the Four Operations

- `B02-L01` 加减的多种模型 / Models of addition and subtraction
- `B02-L02` 乘法是等组与阵列 / Multiplication as equal groups and arrays
- `B02-L03` 除法是平均分与包含 / Division as sharing and grouping
- `B02-L04` 乘除法的互逆 / Inverse relationship of multiplication and division
- `B02-L05` 判断该用哪一种运算 / Choosing the operation in word problems

#### B03 · 计算基本功 / Computational Fluency

- `B03-L01` 进位加法与退位减法 / Regrouping in addition and subtraction
- `B03-L02` 乘法事实与拆分策略 / Multiplication facts and decomposition
- `B03-L03` 两位数乘法的面积模型 / Area models for two-digit multiplication
- `B03-L04` 长除法的步骤与意义 / Long division with understanding
- `B03-L05` 估算检查计算结果 / Checking calculations with estimation

#### B04 · 初识分数和小数 / First Fractions & Decimals

- `B04-L01` 整体与等份 / Wholes and equal parts
- `B04-L02` 一半、三分之一与四分之一 / Halves, thirds and quarters
- `B04-L03` 分数放在数轴上 / Fractions on a number line
- `B04-L04` 十分位与百分位 / Tenths and hundredths
- `B04-L05` 钱币中的小数 / Decimals in money

#### B05 · 图形、测量与读图 / Shapes, Measurement & Charts

- `B05-L01` 长度和常见单位 / Lengths and common units
- `B05-L02` 周长是围一圈 / Perimeter as distance around
- `B05-L03` 面积是铺满多少格 / Area as covering units
- `B05-L04` 角度与常见图形 / Angles and common shapes
- `B05-L05` 读条形图与简易表格 / Reading bar charts and tables

#### B06 · 解决问题的基本方法 / Word-Problem Habits

- `B06-L01` 找出已知、未知和单位 / Identifying knowns, unknowns and units
- `B06-L02` 画条形图表达数量关系 / Representing relationships with bar models
- `B06-L03` 分两步解决问题 / Solving two-step problems
- `B06-L04` 识别不需要的数据 / Spotting irrelevant information
- `B06-L05` 用自己的话解释答案 / Explaining an answer in your own words

### P05 · 小学核心一：相当于五年级的知识带 / Upper Primary I — Grade 5 Concepts

**教学定位 / Focus：** 从具象模型过渡到有把握的符号运算。  
**阶段完成能力 / Exit capability：** 整数、小数、分数的关键联系清楚；可独立完成小学高年级多步问题。

#### P51 · 整数与运算策略 / Whole Numbers & Strategies

- `P51-L01` 大数的四则混合运算 / Mixed operations with whole numbers
- `P51-L02` 括号与运算顺序 / Brackets and order of operations
- `P51-L03` 倍数与因数 / Multiples and factors
- `P51-L04` 质数与合数 / Prime and composite numbers
- `P51-L05` 最大公因数与最小公倍数初步 / Intro to GCF and LCM

#### P52 · 小数的意义与运算 / Decimals: Meaning & Operations

- `P52-L01` 小数位值到千分位 / Decimal place value to thousandths
- `P52-L02` 小数比较与估算 / Comparing and estimating decimals
- `P52-L03` 小数加法与减法 / Adding and subtracting decimals
- `P52-L04` 小数乘整数 / Multiplying decimals by whole numbers
- `P52-L05` 小数除整数 / Dividing decimals by whole numbers
- `P52-L06` 小数应用题：长度与价格 / Decimal problems with lengths and prices

#### P53 · 分数的形象理解 / Fractions Made Visual

- `P53-L01` 单位分数与整体 / Unit fractions and the whole
- `P53-L02` 真分数与假分数 / Proper and improper fractions
- `P53-L03` 带分数与假分数互化 / Mixed numbers and improper fractions
- `P53-L04` 等值分数与分数条 / Equivalent fractions with strips
- `P53-L05` 约分与最简分数 / Simplifying fractions
- `P53-L06` 通分与比较大小 / Common denominators and comparison

#### P54 · 分数的加减 / Adding & Subtracting Fractions

- `P54-L01` 同分母分数相加 / Adding like-denominator fractions
- `P54-L02` 同分母分数相减 / Subtracting like-denominator fractions
- `P54-L03` 异分母分数相加 / Adding unlike-denominator fractions
- `P54-L04` 异分母分数相减 / Subtracting unlike-denominator fractions
- `P54-L05` 分数加减应用题 / Fraction word problems

#### P55 · 数量关系与初步方程 / Relationships & Early Equations

- `P55-L01` 用方框表示未知数 / Using boxes for unknowns
- `P55-L02` 等号意味着两边相等 / The equal sign means balance
- `P55-L03` 从图形规律写算式 / Writing expressions for patterns
- `P55-L04` 一步方程初步 / One-step equations
- `P55-L05` 等量关系的应用题 / Balance-model word problems

#### P56 · 测量、面积与体积 / Measurement, Area & Volume

- `P56-L01` 单位换算的含义 / Meaningful unit conversion
- `P56-L02` 长方形与正方形面积 / Area of rectangles and squares
- `P56-L03` 三角形面积的拼接证明 / Area of triangles by rearrangement
- `P56-L04` 平行四边形与梯形面积 / Area of parallelograms and trapezoids
- `P56-L05` 长方体与正方体体积 / Volume of rectangular prisms and cubes
- `P56-L06` 表面积与包装盒 / Surface area and packaging

#### P57 · 数据与数学探险 / Data & Maths Investigations

- `P57-L01` 数据收集与频数表 / Collecting data and frequency tables
- `P57-L02` 平均数的意义 / Meaning of the mean
- `P57-L03` 折线图看变化 / Line charts and change over time
- `P57-L04` 读图时不能被误导 / Avoiding misleading charts
- `P57-L05` 购物与食谱综合任务 / Shopping and recipe challenge

### P06 · 小学核心二：相当于六年级的知识带 / Upper Primary II — Grade 6 Concepts

**教学定位 / Focus：** 分数、百分数、比例与数感的关键衔接。  
**阶段完成能力 / Exit capability：** 能解释分数乘除、百分数、比的含义；掌握小学至代数的桥梁。

#### P61 · 分数的乘除 / Fraction Multiplication & Division

- `P61-L01` 整数乘分数的图示 / Whole number times a fraction visually
- `P61-L02` 分数乘分数的面积模型 / Fraction times fraction using area
- `P61-L03` 求一个量的几分之几 / Finding a fraction of an amount
- `P61-L04` 分数除整数 / Dividing fractions by whole numbers
- `P61-L05` 整数除以分数 / Dividing whole numbers by fractions
- `P61-L06` 分数除分数及倒数 / Fraction division and reciprocals

#### P62 · 小数、分数、百分数 / Decimals, Fractions & Percentages

- `P62-L01` 百分数就是每一百份 / Percentage means per hundred
- `P62-L02` 小数变百分数 / Converting decimals to percentages
- `P62-L03` 分数变百分数 / Converting fractions to percentages
- `P62-L04` 求一个数的百分之几 / Finding a percentage of an amount
- `P62-L05` 已知部分求整体 / Finding the whole from a percentage
- `P62-L06` 折扣、涨价与百分比变化 / Discounts, increases and percentage change

#### P63 · 比与比例的起点 / Ratios & Proportion

- `P63-L01` 比是两种量的比较 / Ratio as comparison of quantities
- `P63-L02` 最简整数比 / Simplifying ratios
- `P63-L03` 按比分配 / Sharing in a given ratio
- `P63-L04` 相同关系的比值表 / Equivalent ratio tables
- `P63-L05` 比例尺与地图 / Map scales
- `P63-L06` 正比例的初步图像 / Introduction to direct proportion graphs

#### P64 · 负数与整数扩展 / Negative Numbers & Integers

- `P64-L01` 温度中的负数 / Negative numbers in temperatures
- `P64-L02` 零的两边：整数数轴 / Integers on both sides of zero
- `P64-L03` 负数的大小比较 / Comparing negative numbers
- `P64-L04` 跨过零的加减 / Adding and subtracting across zero
- `P64-L05` 数的绝对值初识 / Introduction to absolute value

#### P65 · 字母和数量关系 / Letters & Mathematical Relationships

- `P65-L01` 用字母代表数 / Letters stand for numbers
- `P65-L02` 根据规则求第n项 / Finding the nth term from a pattern
- `P65-L03` 列简单代数式 / Writing simple expressions
- `P65-L04` 方程与天平模型 / Equations and balance models
- `P65-L05` 有括号的一步至两步方程 / One- and two-step equations

#### P66 · 圆与立体测量 / Circles & Spatial Measurement

- `P66-L01` 圆心、半径与直径 / Centre, radius and diameter
- `P66-L02` 圆周率的实验探索 / Investigating pi
- `P66-L03` 圆的周长 / Circumference of a circle
- `P66-L04` 圆的面积与重排 / Area of a circle by rearranging
- `P66-L05` 圆柱的表面积和体积 / Surface area and volume of cylinders

#### P67 · 初级统计与概率 / Early Statistics & Probability

- `P67-L01` 中位数与众数 / Median and mode
- `P67-L02` 平均数、众数与中位数的选择 / Choosing mean, mode or median
- `P67-L03` 可能、不可能和等可能 / Impossible, certain and equally likely
- `P67-L04` 简单事件的概率 / Probability of simple events
- `P67-L05` 转盘模拟与实验频率 / Spinners and experimental frequency

#### P68 · 应用问题实验室 / Applied Problem Laboratory

- `P68-L01` 速度、时间和路程 / Speed, time and distance
- `P68-L02` 工作量的直观理解 / Work-rate intuition
- `P68-L03` 百分比与预算 / Percentages and budgets
- `P68-L04` 图表中的多步推理 / Multi-step reasoning with charts
- `P68-L05` 综合项目：规划一次短途旅行 / Capstone: plan a short trip

### J07 · 初中一：代数语言与几何理由 / Lower Secondary I — Algebra & Geometry

**教学定位 / Focus：** 从计算答案走向解释关系和给出理由。  
**阶段完成能力 / Exit capability：** 有理数运算与一次方程独立完成；学会几何事实与推理区别。

#### J71 · 有理数系统 / Rational Number System

- `J71-L01` 正负数与相反数 / Positive, negative and opposite numbers
- `J71-L02` 绝对值与距离 / Absolute value as distance
- `J71-L03` 有理数加法 / Adding rational numbers
- `J71-L04` 有理数减法 / Subtracting rational numbers
- `J71-L05` 有理数乘除法 / Multiplying and dividing rational numbers
- `J71-L06` 有理数混合运算 / Mixed operations with rational numbers

#### J72 · 整式与代数基础 / Expressions & Algebra

- `J72-L01` 代数式与代入 / Expressions and substitution
- `J72-L02` 合并同类项 / Combining like terms
- `J72-L03` 乘法分配律与去括号 / Distributive law and expanding brackets
- `J72-L04` 整式加减 / Adding and subtracting expressions
- `J72-L05` 从文字题建立代数式 / Modelling word problems with expressions

#### J73 · 一元一次方程 / Linear Equations in One Variable

- `J73-L01` 方程的解与检验 / Solutions and checking
- `J73-L02` 移项的本质是等式变形 / Equation balance rather than magic transposition
- `J73-L03` 含括号的一元一次方程 / Equations with brackets
- `J73-L04` 含分数的一元一次方程 / Linear equations involving fractions
- `J73-L05` 方程应用：年龄与数量 / Age and quantity word problems
- `J73-L06` 不合理答案的识别 / Spotting impossible solutions

#### J74 · 平面几何基础 / Foundations of Geometry

- `J74-L01` 点、线、射线、角 / Points, lines, rays and angles
- `J74-L02` 相交线与对顶角 / Intersecting lines and vertically opposite angles
- `J74-L03` 平行线与角度关系 / Parallel lines and angle relationships
- `J74-L04` 三角形内角和 / Triangle angle sum
- `J74-L05` 三角形分类与边的关系 / Classifying triangles and side relationships
- `J74-L06` 写清楚为什么 / Writing geometrical reasons

#### J75 · 坐标、图像与规律 / Coordinates, Graphs & Patterns

- `J75-L01` 直角坐标系 / The Cartesian plane
- `J75-L02` 坐标描点与读点 / Plotting and reading coordinates
- `J75-L03` 从表格到图像 / From tables to graphs
- `J75-L04` 简单线性规律 / Simple linear relationships
- `J75-L05` 变量变化的现实解释 / Interpreting variables in context

#### J76 · 数据与概率推理 / Data & Probabilistic Reasoning

- `J76-L01` 样本与总体初识 / Population and sample basics
- `J76-L02` 统计图中的分布 / Distribution in charts
- `J76-L03` 平均数与异常值 / Means and outliers
- `J76-L04` 列举概率的样本空间 / Listing sample spaces
- `J76-L05` 两步随机实验的树状图 / Tree diagrams for two-step experiments

### J08 · 初中二：函数、方程与证明 / Lower Secondary II — Functions & Proof

**教学定位 / Focus：** 强化代数转换、坐标思维和几何推理。  
**阶段完成能力 / Exit capability：** 掌握二元一次方程组、一次函数与基础证明。

#### J81 · 整式乘法与恒等式 / Polynomial Multiplication & Identities

- `J81-L01` 单项式乘单项式 / Multiplying monomials
- `J81-L02` 单项式乘多项式 / Monomial times polynomial
- `J81-L03` 多项式乘多项式 / Multiplying polynomials
- `J81-L04` 完全平方公式 / Perfect-square identities
- `J81-L05` 平方差公式 / Difference of squares

#### J82 · 因式分解 / Factorisation

- `J82-L01` 提公因式 / Taking out common factors
- `J82-L02` 平方差分解 / Factoring a difference of squares
- `J82-L03` 完全平方分解 / Factoring perfect squares
- `J82-L04` 简单二次三项式分解 / Factoring simple quadratics
- `J82-L05` 分解与展开互相检查 / Checking factorisation by expansion

#### J83 · 二元一次方程组 / Systems of Linear Equations

- `J83-L01` 两个未知数的关系 / Relationships with two unknowns
- `J83-L02` 代入消元法 / Substitution method
- `J83-L03` 加减消元法 / Elimination method
- `J83-L04` 坐标图解方程组 / Solving systems graphically
- `J83-L05` 实际情境建模 / Modelling a real-world system

#### J84 · 不等式与数轴 / Inequalities & Number Lines

- `J84-L01` 不等号和解集 / Inequality signs and solution sets
- `J84-L02` 一步不等式 / One-step inequalities
- `J84-L03` 负数相乘为何改变不等号 / Why inequality signs reverse
- `J84-L04` 一元一次不等式 / Linear inequalities
- `J84-L05` 简单不等式组 / Simple systems of inequalities

#### J85 · 一次函数 / Linear Functions

- `J85-L01` 关系式y=mx+b / The form y=mx+b
- `J85-L02` 斜率代表变化速度 / Slope as rate of change
- `J85-L03` 截距代表初值 / Intercept as starting value
- `J85-L04` 由两点求直线 / Finding a line from two points
- `J85-L05` 正比例与一次函数对比 / Direct proportion vs linear functions
- `J85-L06` 生活中的线性模型 / Linear models in real contexts

#### J86 · 全等与几何证明 / Congruence & Geometrical Proof

- `J86-L01` 全等的含义 / Meaning of congruence
- `J86-L02` SSS与SAS判定 / SSS and SAS congruence
- `J86-L03` ASA与AAS判定 / ASA and AAS congruence
- `J86-L04` 等腰三角形性质 / Properties of isosceles triangles
- `J86-L05` 平行四边形的性质与判定 / Parallelogram properties and tests
- `J86-L06` 组织两三步几何证明 / Structuring short geometric proofs

#### J87 · 几何变换与勾股定理 / Transformations & Pythagoras

- `J87-L01` 平移与反射 / Translation and reflection
- `J87-L02` 旋转与中心对称 / Rotation and point symmetry
- `J87-L03` 勾股定理的拼图证明 / Visual proof of Pythagoras
- `J87-L04` 勾股定理应用 / Using Pythagoras
- `J87-L05` 勾股逆定理 / Converse of Pythagoras

#### J88 · 初中数据研究 / Secondary Data Investigations

- `J88-L01` 四分位数和箱线图 / Quartiles and box plots
- `J88-L02` 波动与离散程度 / Variability and spread
- `J88-L03` 双变量散点图 / Bivariate scatter plots
- `J88-L04` 相关不等于因果 / Correlation is not causation
- `J88-L05` 小型数据调查 / Mini data investigation

### J09 · 初中三：二次关系与三角思维 / Lower Secondary III — Quadratics & Trigonometry

**教学定位 / Focus：** 完成初中数学主体，为高中函数打底。  
**阶段完成能力 / Exit capability：** 掌握二次函数、相似、直角三角函数和基础统计概率。

#### J91 · 二次根式与实数 / Radicals & Real Numbers

- `J91-L01` 平方根与算术平方根 / Square roots and principal roots
- `J91-L02` 无理数与实数轴 / Irrational numbers and the real line
- `J91-L03` 根式的化简 / Simplifying radicals
- `J91-L04` 根式加减乘除 / Operations with radicals
- `J91-L05` 估算根式的值 / Estimating radical values

#### J92 · 一元二次方程 / Quadratic Equations

- `J92-L01` 二次方程与零点 / Quadratic equations and zeros
- `J92-L02` 因式分解法 / Solving by factorisation
- `J92-L03` 配方法的面积解释 / Completing the square visually
- `J92-L04` 求根公式的来源与使用 / Deriving and using the quadratic formula
- `J92-L05` 判别式与根的个数 / Discriminant and number of roots
- `J92-L06` 二次模型应用 / Quadratic modelling problems

#### J93 · 二次函数 / Quadratic Functions

- `J93-L01` 抛物线与开口方向 / Parabolas and opening direction
- `J93-L02` 顶点与对称轴 / Vertex and axis of symmetry
- `J93-L03` 一般式、顶点式与因式形式 / Standard, vertex and factored forms
- `J93-L04` 用图像解二次方程 / Solving quadratics graphically
- `J93-L05` 最值和实际应用 / Maximum and minimum problems

#### J94 · 相似图形 / Similar Figures

- `J94-L01` 相似的意义与比例 / Meaning of similarity and scaling
- `J94-L02` 三角形相似判定 / Triangle similarity tests
- `J94-L03` 相似三角形的边长计算 / Finding sides in similar triangles
- `J94-L04` 面积比与长度比 / Area ratio versus length ratio
- `J94-L05` 地图和摄影中的相似 / Similarity in maps and images

#### J95 · 圆的性质 / Circle Geometry

- `J95-L01` 弦、切线、圆心角 / Chords, tangents and central angles
- `J95-L02` 圆周角与圆心角关系 / Inscribed angles and central angles
- `J95-L03` 切线性质 / Tangent properties
- `J95-L04` 弧长与扇形面积 / Arc length and sector area
- `J95-L05` 圆中的综合推理 / Combined circle reasoning

#### J96 · 直角三角函数 / Right-Triangle Trigonometry

- `J96-L01` 正弦是对边比斜边 / Sine as opposite over hypotenuse
- `J96-L02` 余弦与正切 / Cosine and tangent
- `J96-L03` 角度与比值的变化 / How trig ratios vary with angle
- `J96-L04` 已知边求角 / Finding angles from sides
- `J96-L05` 测量树高与坡度 / Measuring heights and gradients

#### J97 · 概率、抽样与模拟 / Probability, Sampling & Simulation

- `J97-L01` 独立事件的直观意义 / Independence of events
- `J97-L02` 乘法法则与树状图 / Multiplication rule and trees
- `J97-L03` 不放回抽取 / Sampling without replacement
- `J97-L04` 样本偏差 / Sampling bias
- `J97-L05` 模拟核对理论概率 / Testing theoretical probability by simulation

#### J98 · 初中知识联结 / Secondary Integration

- `J98-L01` 代数与几何互相表达 / Linking algebra and geometry
- `J98-L02` 根据图像建立模型 / Building models from graphs
- `J98-L03` 混合题的策略选择 / Choosing strategies for mixed problems
- `J98-L04` 错误答案的合理性判断 / Judging whether answers make sense
- `J98-L05` 综合项目：设计一个滑板坡道 / Capstone: design a ramp

### H10 · 高中一：函数、逻辑与基础模型 / Senior I — Functions, Logic & Models

**教学定位 / Focus：** 高中不等于刷难题；先建立抽象思想。  
**阶段完成能力 / Exit capability：** 熟悉函数语言、幂指数对数、三角函数和向量入门。

#### H01 · 集合、逻辑与不等式 / Sets, Logic & Inequalities

- `H01-L01` 集合与元素 / Sets and elements
- `H01-L02` 交集、并集和补集 / Intersection, union and complement
- `H01-L03` 命题与反例 / Statements and counterexamples
- `H01-L04` 充分条件与必要条件 / Sufficient and necessary conditions
- `H01-L05` 绝对值不等式 / Absolute-value inequalities

#### H02 · 函数语言与图像 / Function Language & Graphs

- `H02-L01` 定义域、值域和对应 / Domain, range and mapping
- `H02-L02` 函数的多种表示 / Multiple representations of functions
- `H02-L03` 单调性与奇偶性 / Monotonicity and parity
- `H02-L04` 函数图像变换 / Graph translations and stretches
- `H02-L05` 反函数的概念 / Introduction to inverse functions
- `H02-L06` 分段函数与实际规则 / Piecewise functions in context

#### H03 · 指数与对数 / Exponents & Logarithms

- `H03-L01` 指数定律与负指数 / Exponent laws and negative powers
- `H03-L02` 有理指数与根式 / Rational exponents and radicals
- `H03-L03` 指数函数的增长 / Exponential growth
- `H03-L04` 对数是指数的逆运算 / Logarithms as inverse exponents
- `H03-L05` 对数运算法则 / Logarithm laws
- `H03-L06` 指数与对数模型 / Exponential and logarithmic models

#### H04 · 三角函数扩展 / Trigonometric Functions

- `H04-L01` 角度与弧度 / Degrees and radians
- `H04-L02` 单位圆与三角函数 / Unit circle trigonometry
- `H04-L03` 正弦和余弦图像 / Graphs of sine and cosine
- `H04-L04` 振幅、周期与相位 / Amplitude, period and phase
- `H04-L05` 简单三角恒等式 / Basic trigonometric identities
- `H04-L06` 解简单三角方程 / Solving basic trig equations

#### H05 · 平面向量 / Vectors in Two Dimensions

- `H05-L01` 向量有大小和方向 / Vectors have magnitude and direction
- `H05-L02` 向量的加减 / Vector addition and subtraction
- `H05-L03` 数乘向量 / Scalar multiplication
- `H05-L04` 坐标形式的向量 / Coordinate vectors
- `H05-L05` 数量积与夹角 / Dot products and angles
- `H05-L06` 向量解决几何问题 / Vectors in geometry

#### H06 · 立体几何入门 / Solid Geometry Foundations

- `H06-L01` 空间中的点线面 / Points, lines and planes in space
- `H06-L02` 棱柱、棱锥与球 / Prisms, pyramids and spheres
- `H06-L03` 截面与展开图 / Cross-sections and nets
- `H06-L04` 空间距离与角 / Spatial distances and angles
- `H06-L05` 体积与表面积综合 / Combined volumes and surface areas

#### H07 · 数列 / Sequences & Series

- `H07-L01` 序列、递推与通项 / Sequences, recurrence and nth term
- `H07-L02` 等差数列 / Arithmetic sequences
- `H07-L03` 等差数列求和 / Sums of arithmetic series
- `H07-L04` 等比数列 / Geometric sequences
- `H07-L05` 等比数列求和 / Sums of geometric series
- `H07-L06` 储蓄增长与数列模型 / Sequences in savings growth

#### H08 · 数据建模 / Data Modelling

- `H08-L01` 变量类型与数据清理 / Variable types and data cleaning
- `H08-L02` 分布的形状和偏态 / Shape and skewness
- `H08-L03` 标准差的意义 / Meaning of standard deviation
- `H08-L04` 标准分数与比较 / Z-scores and comparisons
- `H08-L05` 线性回归的直观理解 / Intuition of linear regression

### H11 · 高中二：解析几何与变化率 / Senior II — Analytic Geometry & Rates

**教学定位 / Focus：** 加强跨章节建模；引入微积分的直觉。  
**阶段完成能力 / Exit capability：** 能处理解析几何、组合概率、函数变化率与复杂建模。

#### H21 · 复数入门 / Complex Numbers

- `H21-L01` 为什么需要虚数单位i / Why the imaginary unit i exists
- `H21-L02` 复数的实部与虚部 / Real and imaginary parts
- `H21-L03` 复数加减乘 / Complex addition, subtraction and multiplication
- `H21-L04` 共轭复数与模 / Conjugate and modulus
- `H21-L05` 复平面中的几何意义 / Complex numbers on the plane

#### H22 · 直线、圆与圆锥曲线 / Lines, Circles & Conics

- `H22-L01` 直线方程的多种形式 / Forms of a line equation
- `H22-L02` 点到直线的距离 / Distance from a point to a line
- `H22-L03` 圆的标准方程 / Standard equation of a circle
- `H22-L04` 抛物线的焦点与准线 / Parabola focus and directrix
- `H22-L05` 椭圆的几何定义 / Geometric definition of ellipses
- `H22-L06` 双曲线的几何定义 / Geometric definition of hyperbolas

#### H23 · 空间向量与几何 / 3D Vectors & Geometry

- `H23-L01` 三维坐标与向量 / 3D coordinates and vectors
- `H23-L02` 空间向量的线性运算 / Operations on 3D vectors
- `H23-L03` 空间数量积与夹角 / Dot products and spatial angles
- `H23-L04` 直线与平面的关系 / Relationships between lines and planes
- `H23-L05` 空间距离的向量方法 / Vector methods for spatial distance

#### H24 · 排列组合与概率 / Counting & Probability

- `H24-L01` 分类计数与分步计数 / Addition and multiplication counting principles
- `H24-L02` 排列与阶乘 / Permutations and factorials
- `H24-L03` 组合的意义 / Combinations
- `H24-L04` 二项式系数与杨辉三角 / Binomial coefficients and Pascal's triangle
- `H24-L05` 条件概率 / Conditional probability
- `H24-L06` 独立性与贝叶斯直觉 / Independence and Bayes intuition

#### H25 · 导数概念 / Understanding Derivatives

- `H25-L01` 平均变化率 / Average rate of change
- `H25-L02` 割线逼近切线 / Secants approaching tangents
- `H25-L03` 极限的直觉 / Intuition of limits
- `H25-L04` 导数作为瞬时变化率 / Derivative as instantaneous rate
- `H25-L05` 基本函数的求导规则 / Derivative rules for basic functions
- `H25-L06` 切线方程 / Equation of a tangent line

#### H26 · 函数分析 / Analysing Functions

- `H26-L01` 导数的正负与增减 / Derivative sign and monotonicity
- `H26-L02` 驻点与极值 / Stationary points and extrema
- `H26-L03` 基本乘法求导法则 / Product rule
- `H26-L04` 复合函数求导法则 / Chain rule
- `H26-L05` 变化率应用题 / Applied rates of change

#### H27 · 统计与回归 / Statistics & Regression

- `H27-L01` 相关系数 / Correlation coefficient
- `H27-L02` 最小二乘直线的直觉 / Least-squares regression intuition
- `H27-L03` 残差与模型检验 / Residuals and model checking
- `H27-L04` 模拟抽样变异 / Simulating sampling variability
- `H27-L05` 数据结论的局限性 / Limits of data conclusions

#### H28 · 综合问题解题法 / Integrated Problem-Solving

- `H28-L01` 分解复杂问题 / Breaking down complex problems
- `H28-L02` 换一种表示方式 / Switching representations
- `H28-L03` 验证极端情况 / Checking extreme cases
- `H28-L04` 构造反例 / Constructing counterexamples
- `H28-L05` 解释假设与结果 / Communicating assumptions and results

### H12 · 高中三：微积分、概率与综合应用 / Senior III — Calculus, Probability & Applications

**教学定位 / Focus：** 提供完整通用高中数学路径，选修深度按目标调整。  
**阶段完成能力 / Exit capability：** 在核心函数与概率概念上形成更成熟的推理和建模能力。

#### H31 · 导数与优化 / Derivatives & Optimisation

- `H31-L01` 多项式与指数函数求导复习 / Derivative review: polynomials and exponentials
- `H31-L02` 三角函数的导数 / Derivatives of trig functions
- `H31-L03` 隐函数求导入门 / Introduction to implicit differentiation
- `H31-L04` 局部与全局最值 / Local and global extrema
- `H31-L05` 约束条件下的优化 / Optimisation under constraints
- `H31-L06` 运动中的速度与加速度 / Velocity and acceleration

#### H32 · 积分基础 / Introduction to Integration

- `H32-L01` 面积累积的思想 / Accumulation and area
- `H32-L02` 黎曼和的直观表示 / Visual Riemann sums
- `H32-L03` 不定积分与原函数 / Antiderivatives and indefinite integrals
- `H32-L04` 定积分的几何意义 / Geometric meaning of definite integrals
- `H32-L05` 微积分基本定理的直觉 / Intuition of the Fundamental Theorem
- `H32-L06` 曲线下方面积应用 / Areas under curves

#### H33 · 随机变量与分布 / Random Variables & Distributions

- `H33-L01` 随机变量与概率分布表 / Random variables and distribution tables
- `H33-L02` 期望值的意义 / Meaning of expected value
- `H33-L03` 方差与标准差 / Variance and standard deviation
- `H33-L04` 二项分布 / Binomial distribution
- `H33-L05` 正态分布 / Normal distribution
- `H33-L06` 标准正态与z分数 / Standard normal and z-scores

#### H34 · 统计推断入门 / Introduction to Inference

- `H34-L01` 总体、样本与抽样误差 / Population, sample and sampling error
- `H34-L02` 抽样分布模拟 / Simulating sampling distributions
- `H34-L03` 置信区间的直觉 / Intuition of confidence intervals
- `H34-L04` 假设检验的基本逻辑 / Logic of hypothesis testing
- `H34-L05` 统计显著与实际重要 / Statistical vs practical significance

#### H35 · 高级函数与方程 / Advanced Functions & Equations

- `H35-L01` 复合函数与逆函数深化 / Composition and inverses revisited
- `H35-L02` 指数方程与对数方程 / Exponential and logarithmic equations
- `H35-L03` 三角恒等变形 / Trigonometric identities
- `H35-L04` 参数对函数图像的影响 / Effects of parameters on graphs
- `H35-L05` 多解与定义域检查 / Checking multiple solutions and domains

#### H36 · 解析几何深化 / Advanced Analytic Geometry

- `H36-L01` 直线与圆锥曲线交点 / Line–conic intersections
- `H36-L02` 轨迹方程 / Locus equations
- `H36-L03` 解析几何中的参数法 / Parametric methods in geometry
- `H36-L04` 向量与解析方法互证 / Connecting vector and analytic proofs
- `H36-L05` 圆锥曲线综合建模 / Conic modelling problems

#### H37 · 拓展选学 / Optional Extensions

- `H37-L01` 数学归纳法 / Mathematical induction
- `H37-L02` 简单递推关系 / Simple recurrence relations
- `H37-L03` 图论与最短路径 / Graphs and shortest paths
- `H37-L04` 矩阵的直观意义 / Intuition of matrices
- `H37-L05` 数值方法与近似 / Numerical methods and approximation

#### H38 · 最终项目与数学表达 / Final Projects & Communication

- `H38-L01` 建立现实问题的数学模型 / Building a real-world mathematical model
- `H38-L02` 用图表检验假设 / Testing assumptions with graphs
- `H38-L03` 比较不同解法的效率 / Comparing solution methods
- `H38-L04` 向他人解释完整推理 / Presenting a complete argument
- `H38-L05` 终章项目：从问题到模型 / Final capstone: from question to model

---

## 5. 一节完整示范课 / Fully worked sample lesson

> **课程 ID：`P53-L04` · 等值分数与分数条 / Equivalent fractions with strips**  
> 推荐前置 / Prerequisites: `B04-L01`, `B04-L02`, `P53-L01`  
> 单一目标 / Objective: 能用模型解释为什么 `1/2 = 2/4 = 3/6`，并写出等值分数。  
> 关键术语 / Vocabulary: 等值分数 (equivalent fractions)，分子 (numerator)，分母 (denominator)。

### A. 引入 / Hook

**中文：** 两块形状相同的巧克力：一块切成两半，我拿走一块；另一块切成四份，我拿走两块。谁拿得更多？  
**English:** Two equal chocolate bars: I take 1 out of 2 equal pieces from one, and 2 out of 4 equal pieces from the other. Who gets more?

孩子先猜 → 点击“比较 / Compare” → 重合两条等长度色条。**要求“整体相同且切分相等”**，防止图片暗示不同大小的整体也能直接比较。

### B. 动手探索 / Explore

屏幕显示长度相同的三条交互色条：

```text
Whole  [████████████]
1/2    [██████|      ]
2/4    [███|███|   |   ]
3/6    [██|██|██|  |  |  ]
```

上面是**文字示意**；正式产品中每条必须有相同的精确宽度、等宽分割线、清楚的着色面积。滑杆从“2 等份”到“4 等份”，让孩子看见**切得更细，总面积不变**。

**中文解释：** 分子和分母同时乘同一个非零整数，分数代表的大小不变。例如 `1/2 = (1×2)/(2×2) = 2/4`。  
**English:** Multiplying the numerator and denominator by the same non-zero integer keeps a fraction's value unchanged: `1/2 = 2/4`.

**易错提醒 / Misconception:** `1/2` 不等于 `1/4`。不能只把分母翻倍、分子不变。等值分数不是“两组数字碰巧相似”。

### C. 两个示例 / Worked examples

**例 1 / Example 1 — 用图理解 / Use a picture**  
`2/3 = ?/6`。把每一份再平分为 2 份：三等份变六等份，原来涂色的 2 份变成 4 份，因此答案 `4/6`。  
*Split each third into two equal parts. The two shaded thirds become four sixths.*

**例 2 / Example 2 — 用数解释 / Use multiplication**  
`3/5 = ?/20`。因为 `5 × 4 = 20`，所以分子也乘 4：`3 × 4 = 12`，因此 `12/20`。  
*Multiply both numerator and denominator by four, giving `12/20`.*

### D. 练习示范 / Sample practice set

| ID / Type | 题目（中 / EN） | 正确答案 / Accepted | 关键提示 / Hint |
|---|---|---|---|
| Q1 单选 | `1/2` 等于哪一个？ / Which equals `1/2`? A. `1/4` B. `2/4` C. `2/3` | B | 比较着色总面积 / Compare shaded areas |
| Q2 填空 | `2/3 = __/12` / Fill the blank | 8 | `3 × ? = 12` |
| Q3 计算 | `3/4 = 9/__` / Find the denominator | 12 | 分子乘 3，分母呢？ / Numerator ×3; denominator? |
| Q4 图形 | 选出与 `2/5` 一样大的色条 / Select the strip equal to `2/5` | 精确涂色 `4/10` 的图 | 先比较同一个整体 / Same whole first |
| Q5 判断解释 | `3/6 = 1/2`，对吗？为什么？ / True or false? Explain. | 对，分子分母同除以 3 / True, divide both by 3 | 用分数条检查 / Use strips |
| Q6 找错 | 小明说 `2/3 = 2/6`，哪里错了？ / Find the error in `2/3 = 2/6`. | 只扩大分母，没同时改变分子 / Only denominator changed | 同时改变两个数 / Change both |
| Q7 应用 | 相同大小的两杯果汁，一杯喝了 `1/2`，另一杯喝了 `3/6`，谁喝得多？ / Two equal cups: `1/2` vs `3/6` consumed. Which is more? | 一样多 / Equal amount | 注意杯子一样大 / Cups are equal |

**出口题 / Exit ticket：** 不看提示，解释 `4/6` 和 `2/3` 为什么相等，并写出另一个等值分数。  
*Without hints, explain why `4/6` equals `2/3`, and give another equivalent fraction.*

**家长提示 / Parent prompt:** 不要先说“分子分母同时乘二”。先问：“这个整体有没有变？每一份是不是变小了？一共涂了多少？” 用孩子自己的解释连接到规则。

**通过 / Success:** 能正确做出至少 5 道代表性题，并能用图或语言解释等值关系；若只会机械填数却解释不清，标记 `practice_needed` 而非直接全通。

**复习 / Retrieval:** 后续在 `P53-L05` 约分、`P54-L03` 异分母加法、`P62-L03` 分数转百分数中有意识调用这个概念。

---

## 6. 内容目录与文件组织建议 / Content files (not application code)

Codex 可以参考以下逻辑结构，不必拘泥于文件名。**Markdown 承载讲解；结构化元数据承载依赖、题型、答案与复习规则。** 不要把整个题库塞成一份难以维护的巨型 Markdown。

```text
math-course/
  plan.md                      # 本文：课程总规划
  curriculum/
    index.json                 # 阶段、单元、课程顺序、依赖与标签
    diagnostics/
      D00.json                 # 诊断题、答案、目标技能映射
    stages/
      B00.json ... H12.json    # 阶段/单元信息
  lessons/
    P05/P53/P53-L04.md        # 双语讲解、步骤示例、家长建议
    ...
  exercises/
    P05/P53/P53-L04.json      # 题干、答案、解析、错误选项说明
    ...
  media/
    fractions/                 # SVG 分数条/百格板等
    geometry/                  # 图形或交互演示所需素材
    functions/                 # 坐标轴、函数图示
  rubrics/
    open-response.md           # 解释题/证明题由家长判读标准
  glossary/
    zh-en.json                 # 中英术语库，含术语使用语境
  qa/
    content-checklist.md       # 数学正确性、双语和无障碍检查
```

### 6.1 每课元数据必填字段 / Minimum lesson fields

```yaml
id: P53-L04
stage: P05
unit: P53
order: 4
title:
  zh: 等值分数与分数条
  en: Equivalent fractions with strips
objective:
  zh: 用模型解释并产生等值分数
  en: Explain and generate equivalent fractions with visual models
prerequisites: [B04-L01, B04-L02, P53-L01]
skillTags: [fraction, equivalent-fraction, visual-model]
nzYearHints: [5, 6]
cnGradeHints: [5]
difficulty: foundation
estimatedMinutes: 15
visualizations: [fraction-strips]
exerciseBankRef: exercises/P05/P53/P53-L04.json
parentReviewRecommended: true
```

上面是**可供 Codex 转成实际规范的内容示例**；并非已经存在的文件。`prerequisites`、`skillTags` 必须在课程树中能解析；跨阶段先修不要求已经顺序完成，只要技能确实掌握即可。

### 6.2 题库标准 / Question bank requirements

每道题至少包含：

`id, lessonId, type, difficulty, stem.zh, stem.en, answerSpec, solutionSteps.zh, solutionSteps.en, hints.zh[], hints.en[], misconceptionTags[], skills[], visualRef(optional)`。

- 答案保存为**可验证的结构**：整数、精确分数 `(numerator, denominator)`、十进制数（带精度和舍入规则）、允许范围的近似值、集合、表达式或人工评分 rubrics。
- 不以浮点字符串直接比较分数；例如 `1/2`、`2/4` 可等值判对。除非题目明确要求最简形式，勿错判未约分结果。
- 有单位的题明确单位策略：如数值 40 + 单位 cm²，不接受纯 `40 cm`；小数允许合理的前导零和等值写法。
- 多选题每一个错误选项都对应**有诊断价值的错误思路**；不能只是随意随机数字。
- 随机题按**模板 + 约束 + 确定性答案计算 + 数学一致性测试**生成，避免零作除数、不合理语境、歧义、图形与数值不匹配。
- 高中代数等价、含根式的精确答案、含参解集、图形构造与长证明**不能仅靠简单字符串对比评分**；使用明确支持的数学判定策略或交给家长核查。
- 错误原因判断要温和、具体。例如“你把分母乘 3，但分子没变”；不要显示“太简单了你还不会”。
- 题目必须经数学正确性验证；AI 批量产题的答案和解析要自动单测加人工抽查，尤其检查无穷多个等价形式与边界值。

### 6.3 中英双语界面 / Bilingual display

默认屏幕示例：

```text
等值分数
Equivalent Fractions

2/3 = ?/9

你可以把每一份再分成几份？
Into how many equal parts can each third be divided?

[显示提示 / Show hint]   [检查答案 / Check answer]
```

- 优先 **中文大字 + 英文下一行**，可切到英文优先或只显示一种语言；数学符号居中清晰。
- 高中长题可用“中文/English”切换减少拥挤，但题干语义保持完全对应。
- 术语坚持标准用语，如 `equation 方程`, `expression 代数式`, `volume 体积`, `range 极差`；同一个词若在不同上下文含义不同，要在词库里区分。
- 数学排版支持分式、上/下标、根式、角度、集合与坐标；避免将 `1/2` 在教学图形里排成不清晰的普通字符。
- 提供读题朗读（可后置）、对比度、键盘操作、清楚的焦点状态；颜色不是表达对错的唯一方式。

---

## 7. 家长陪学模式 / Parent-guided learning

每节家长卡片只需显示四块：**这节真正要懂什么；最容易误解什么；建议问哪两个问题；不会时退回哪里。** 不要给家长一个长篇“标准教学讲稿”。

**有效的家长提问 / Helpful prompts:**

1. “你先猜一下，为什么？” / *Make a prediction. Why do you think so?*
2. “能不能画出来？” / *Can you draw it?*
3. “换一个数字，还成立吗？” / *Does it still work with another number?*
4. “你怎样知道这个答案合理？” / *How do you know the answer is reasonable?*
5. “可以用另一种方法吗？” / *Can you find another method?*

**不建议 / Avoid:** 连续催促“快点”，只问对错、提前报公式、做错就立刻讲解全部、用弟妹/同学或年级比较。若出现明显疲劳，优先停在一个已理解的点上，下次继续。

**每周节奏示例（可变） / Flexible weekly rhythm:**

| 日程 / Session | 内容 / Activities |
|---|---|
| A（15–20 分钟） | 新概念微课 1 + 解释题 / New lesson + explanation |
| B（15–20 分钟） | 微课 2 + 图形操作 / New lesson + manipulative |
| C（10–15 分钟） | 错题复习 + 口算基础 / Retrieval and fluency |
| D（15–20 分钟） | 微课 3 或小项目 / New lesson or a small project |
| 家庭生活中 / In real life | 5 分钟数学观察，不记分 / Short informal maths observation |

**要点：** 以孩子当下专注程度调整频率；不把“一天必须多少题”当作主要目标。数学能力的发展通常需要长期积累，进度不必与年级标签赛跑。

---

## 8. 复习、自适应与进度追踪 / Review & adaptive learning

1. **微课级记忆 / Lesson status**：什么时候学的、独立正确与否、请求几次提示、出口题是否会解释。
2. **技能级掌握 / Skill mastery**：同一技能可能出现在多个微课，不用某次出错抹掉过去所有进步。
3. **错因归类 / Misconceptions**：比“错了 8 题”更重要的是“异分母相加没通分”。
4. **自适应补桥 / Remediation**：如在 `J73` 方程题频繁出错，检查 `P55` 的等量关系或 `J71` 的负数，而非无脑刷更难方程。
5. **复习队列 / Review queue**：含前一次学过的题型，但使用新的数字/情境；让孩子回想，而非只认熟题。
6. **家长面板 / Parent dashboard**：展示本周学懂的 3 个点、需要解释的 2 个点、下一次建议 1 个点；不展示与他人比较的榜单。
7. **可跳关 / Skip-ahead**：若诊断证明已掌握某技能，可以不做整套简单题；学习中也随时允许回看图示。

### 8.1 常见错误路由表 / Misconception routing

| 观察到的行为 / Error | 优先帮助 / Intervention |
|---|---|
| `1/3 + 1/4 = 2/7` | 先复习分数条、同一整体与通分，而非背口诀 |
| `0.5 < 0.45`（误认为位数越多越大） | 比较百格板和小数数轴 |
| `(-3) × (-4) = -12` | 数轴规律与乘法符号规律的解释 |
| `3(x+2) = 3x+2` | 用面积阵列演示分配律 |
| 认为 `y = 2x + 3` 中的 3 是斜率 | 用函数图像拖动 `m` 和 `b` |
| 混淆面积单位与长度单位 | 用覆盖方格和围栏比较 |
| 图像有相关趋势就断定因果 | 展示混杂因素的小数据实验 |

---

## 9. 内容品质验收 / Lesson quality checklist

每一批微课交付给孩子使用前，至少满足：

- [ ] **一个主目标**：讲解与练习不偏题，先修课存在。
- [ ] **完整双语**：标题、问题、提示、解析、按钮及家长建议都中英通顺。
- [ ] **概念正确**：数学定义、定理适用范围与符号正确；绝不出现“看图差不多相等”冒充严格相等。
- [ ] **图文一致**：图形标尺、份数、长度、角度、坐标轴、单位准确。
- [ ] **练习有层次**：理解、运算、迁移、纠错至少涵盖两类；题目无重复刷量。
- [ ] **答案可判**：所有可自动判断题测试含标准答案、等价值、常见错答、边界值。
- [ ] **解释可用**：答错后有具体提示；不会只显示叉号。
- [ ] **难度合适**：课程起点足够低，但没有故意幼稚化十一岁孩子的语言。
- [ ] **键盘可用**：答题可鼠标/键盘操作；图形要有文本替代说明。
- [ ] **家长知道做什么**：至少有 2 个可提问问题和补桥路径。
- [ ] **版权合规**：素材优先自绘 SVG/原创；使用第三方图形、题目必须检查许可并记录来源。
- [ ] **人工试用**：家长先看一遍，再观察孩子做题是否在真正思考而非猜 UI。

### 9.1 数学内容测试 / Maths QA examples

- `1/2`, `2/4`, `50%`, `0.5`：在相应允许的情形中要识别等值。
- `(-2)^2 = 4`，但 `-2^2 = -4`（按通常的算符优先约定）；括号不能丢。
- `x^2 = 9` 有 `x = ±3`，不能漏负根。
- 除法必须检查分母/除数不为零；根式与对数要检查定义域。
- `40 cm²` 与 `40 cm` 不能当作同单位答案。
- 某个图形“看着像正方形”不能代替题目给出的或可证明的条件。
- 概率模拟必须区分理论概率、观察频率与随机波动。

---

## 10. 给 Codex 的逐步实施目标 / Content-first milestones

**原则：先做 20 节好课，再扩展到几百节。** 先验证孩子是否喜欢、是否理解，避免上来批量生成全套内容，最后发现教学体验不对。

| 里程碑 / Milestone | 第一阶段最小范围 | 完成判据 / Done when |
|---|---|---|
| M0 课程骨架 | `index`, 阶段/单元/课程元数据、编号和依赖 | 能浏览完整目录；所有课程有唯一 ID、双语标题 |
| M1 诊断 | 24 道经核验的诊断题，四组结果与补桥建议 | 测出分数薄弱不影响几何判断，家长可覆盖建议 |
| M2 试点 20 课 | `B00` 中 10 课 + `P05` 中 10 课（优先整数/小数/分数） | 每课有双语内容、图示、题目、解析、错因、出口题 |
| M3 可视化原型 | 数轴、十进制积木、分数条、百格板、基础几何网格 | 每个交互严格匹配其数学表示与数值 |
| M4 学习闭环 | 练习判分、提示、错题队列、家长反馈、进度 | 复习可追踪具体技能；不会无理由锁关 |
| M5 小学完整内容 | `B00 + P05 + P06` 全部微课 | 完整交叉审查、家长实测与单元测验 |
| M6 初中内容 | `J07 + J08 + J09` | 方程/作图/几何证明等特殊题型具备合理检查方式 |
| M7 高中内容 | `H10 + H11 + H12` | 函数工具、概率模拟、微积分图示可用；高级题人工复核 |
| M8 持续改进 | 根据孩子的实际错因重排技能、改善题目 | 先修改具体体验问题，而不是只增加题量 |

### 10.1 Codex 应优先处理的第一批课程 / First 20 lessons

**B00（10 节）：** `B01-L01..L05`（全部），`B04-L01..L05`（全部）。  
**P05（10 节）：** `P52-L01..L04`（小数前四课），`P53-L01..L06`（分数整单元）。

这 20 节能最快检验：双语讲解、数感可视化、分数理解、电子练习、家长陪学与知识依赖设计。诊断若表明孩子在乘除法困难，可把 `B02/B03` 排在此批次之前。

### 10.2 建议让 Codex 遵守的内容生成指令 / Content generation brief

> 以 `plan.md` 为唯一课程规划基准。每次只生成**一个单元**的课程内容与题库；全部使用稳定编号及中英双语。每课只设一个主要概念，有可观察的教学目标、贴合数学概念的图示或操作、1–2 个完整例题、5–8 个初始练习（含至少一个需要主动生成答案的题）、分步提示、标准答案与错误解释、出口题和家长指导。生成完成后进行数学答案验证、双语一致性审查、先修技能检查、无障碍审查；不要因课程规模大而复制粘贴空洞模板。未经核验的课程标记为 `draft`，不可自动视作 `ready`。

---

## 11. 课程插图及交互的优先级 / Visual asset priorities

| 重要程度 | 交互模型 / Model | 首先服务于 / First uses |
|---|---|---|
| P0 | 数轴 / Number line | B01, B04, P64, J71, J84 |
| P0 | 十进制位值与积木 / Place-value blocks | B01, B03, P52 |
| P0 | 分数条与分数圆 / Fraction strips & circles | B04, P53, P54, P61 |
| P0 | 百格板与双数轴 / Hundred grid & double number line | P62, P63 |
| P0 | 网格面积、图形拖动 / Area grid & shapes | B05, P56, P66, J74 |
| P1 | 函数机器与坐标图 / Function machine & coordinate plane | P65, J75, J85, J93, H02 |
| P1 | 代数天平 / Algebra balance | P55, J73 |
| P1 | 几何变换画布 / Transformation canvas | J87, J94, J95 |
| P1 | 转盘、骰子与统计图 / Probability spinner & charts | P67, J76, J88, J97 |
| P2 | 三角函数单位圆 / Unit circle | J96, H04 |
| P2 | 向量箭头与空间模型 / Vectors & 3D models | H05, H06, H23 |
| P2 | 切线与积分累积器 / Tangent & integral explorer | H25, H31, H32 |
| P2 | 概率分布模拟 / Distribution simulator | H24, H33, H34 |

`P0/P1/P2` 为制作优先级，并非学习难度。SVG/Canvas 原生绘制优先于泛用装饰图片；高中函数曲线应由可靠数值函数绘制，而非静态不精确的 AI 插画。

---

## 12. 需要避免的失败模式 / Anti-patterns

1. **“题海 APP”**：只有刷题统计，没有数的意义、图形模型和讲解。
2. **“动画很多但数学很少”**：动效不揭示关系，孩子玩得热闹却不会解释。
3. **“一节课十多个知识点”**：微课名称写一项、正文讲一堆、考试混着考。
4. **“英文只是直译中文”**：英语题目过长、术语不自然、语义改变。
5. **“只知道正确率”**：忽略错因、提示次数、知识前置与口头解释。
6. **“只会判标准字符串”**：把数学等价答案误判为错误。
7. **“一年开发完才给孩子用”**：应先做一个小而完整、能反复验证的闭环。
8. **“按年级强制锁课”**：已有技能重复刷、不懂的先修概念被跳过。
9. **“全部自动判题”**：几何证明、解释题、开放项目必须允许家长审核。
10. **“AI 生成内容直接上线”**：错误图像、错误答案、歧义应用题尤其伤害学习。

---

## 13. 参考资料与维护 / References & maintenance

以下是用于核对教学目标和方法的**参考资料**，不是对某一教材的复制；本计划的课程细分、微课结构及先修设计是原创规划。

1. **新西兰教育部 / NZ Ministry of Education** — *Mathematics and Statistics in Year 6*：https://www.education.govt.nz/parents-and-caregivers/schools-year-0-13/parent-portal/guide-for-the-new-zealand-curriculum-years-0-to-8/year-6-new-zealand-curriculum/mathematics-and-statistics-in-year-6
2. **Tāhūrangi / New Zealand Curriculum** — *Mathematics and Statistics, Years 0–10*（2026 年生效）：https://newzealandcurriculum.tahurangi.education.govt.nz/new-zealand-curriculum-online/new-zealand-curriculum/current-curriculum-documents/nzc---mathematics-and-statistics-years-0-8/5637289330.p
3. **新西兰教育部** — *Mathematics and Statistics in Year 8*：https://www.education.govt.nz/parents-and-caregivers/schools-year-0-13/parent-portal/guide-for-the-new-zealand-curriculum-years-0-to-8/year-8-new-zealand-curriculum/maths-and-statistics-in-year-8
4. **新西兰教育部** — *Phase 4 (Years 9–10)*：https://tewhariki.tahurangi.education.govt.nz/new-zealand-curriculum-online/nzc---mathematics-and-statistics-phase-4-years-9-10/5637291579.p?domain=newzealandcurriculum.tahurangi.education.govt.nz
5. **Education Endowment Foundation** — *Use manipulatives and representations to develop understanding*：https://educationendowmentfoundation.org.uk/early-years/maths/use-manipulatives-and-representations-to-develop-understanding
6. **Education Endowment Foundation** — *Improving mathematics in Key Stages 2 and 3*（手工操作材料必须指向结构理解，并逐步脱离脚手架）：https://educationendowmentfoundation.org.uk/newsletter/improving-mathematics-in-key-stages-2-and-3-email-course-2
7. **新西兰教育部** — *Curriculum implementation timeline*：https://www.education.govt.nz/news/new-timeframe-years-0-8-final-national-curriculum

**维护提示：** 每年核对新西兰现行学校教学要求与高中资格变化。2026 年规划的高中主线是通用学科路线，不声称与将来具体升学考试的题纲逐项一致。

---

## 14. 最终验收定义 / Definition of success

这套 APP 成功，不是“孩子刷完所有页面”，而是孩子能逐步做到：

1. **看见一个问题，愿意猜、愿意试。** / *Willing to explore a maths problem.*
2. **说清一个方法为什么有效。** / *Explain why a method works.*
3. **把图像、语言和数学符号联系起来。** / *Connect pictures, words and symbols.*
4. **能够独立计算，并检查结果是否合理。** / *Calculate independently and check reasonableness.*
5. **遇到新题，不慌张地选择合适的工具。** / *Choose useful strategies for unfamiliar problems.*
6. **随着年龄和理解增长，自然走向抽象推理。** / *Develop increasingly abstract mathematical reasoning.*

**先把 20 节做得真正好用，再去逐步完成全课程。这是整个项目最重要的实现策略。**
