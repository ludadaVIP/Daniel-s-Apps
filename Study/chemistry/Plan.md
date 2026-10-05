# Chemistry Path — Product & Development Plan
## 家庭版初高中化学学习 App 产品与开发规划

> **Document purpose / 文档用途**  
> This file is the master plan for building the first version of a family-use chemistry learning application.  
> 本文档用于指导 Codex 分阶段开发一个面向家庭使用的化学学习 App。第一阶段不追求“功能多”，而追求“真正有效地帮助孩子从零开始学懂化学，并逐步覆盖初中到高中化学”。

---

# 0. Executive Summary / 项目概要

## 0.1 Product Vision / 产品愿景

Build a simple, structured, highly effective chemistry learning app for a child who is about to enter middle school.

建立一个简单、结构清晰、真正有效的化学学习 App，让一个即将进入初中的孩子能够：

- 从最基础的化学概念开始；
- 按照知识依赖关系逐步学习；
- 不靠死记硬背，而是建立真正的化学模型；
- 通过互动、练习和重复复习确认“是否真的掌握”；
- 最终逐步覆盖初中与高中化学核心知识。

The first version is **for family use only**.  
第一版只服务家庭内部使用。

Do **not** optimize for scale, monetization, social features, account systems, or complex infrastructure.

第一阶段不要考虑：

- 商业化
- 用户增长
- 多租户
- 社交
- 排行榜
- 复杂数据库
- 多角色权限
- 大型后台管理系统
- 微服务
- 复杂 AI agent 架构

The core question is:

> Can this app help one child learn chemistry substantially better?

核心判断标准只有一个：

> 这个 App 是否能够真正帮助一个孩子把化学学懂？

---

# 1. Core Product Principle / 核心产品原则

## 1.1 This is not an e-book / 它不是电子课本

This app should not merely display textbook content.

它不是把课本搬到网页里。

Instead, it should provide a guided learning loop:

```text
Why this matters
    ↓
Intuitive explanation
    ↓
Core concept
    ↓
Visual / interactive model
    ↓
Worked example
    ↓
Student attempt
    ↓
Immediate feedback
    ↓
Alternative explanation
    ↓
Mastery check
    ↓
Scheduled review
```

中文：

```text
为什么要学
    ↓
直观理解
    ↓
核心概念
    ↓
视觉 / 互动模型
    ↓
例题
    ↓
孩子自己做
    ↓
即时反馈
    ↓
换一种方式再解释
    ↓
掌握度测试
    ↓
定期复习
```

The app should optimize for **understanding + retention**, not content consumption.

目标不是“看完”，而是：

> **理解 + 能解释 + 能应用 + 能长期记住。**

---

# 2. Primary User / 主要用户

## 2.1 Learner / 学习者

Initial target:

- Age: about 11–14
- Starting level: little or no formal chemistry knowledge
- Device: desktop/laptop first, responsive enough for tablet
- Language: bilingual Chinese + English support
- Learning mode: independent study with occasional parent supervision

初期目标用户：

- 即将进入或刚进入初中的孩子
- 可能几乎没有正式学过化学
- 主要在电脑或平板上学习
- 中英双语环境
- 希望逐步建立到高中化学水平

## 2.2 Parent / 家长

Parent should be able to see:

- what the child studied;
- what has been mastered;
- what concepts are weak;
- what needs review;
- approximate weekly effort;
- quiz accuracy;
- recent difficulties.

家长需要知道：

- 最近学了什么
- 哪些已经掌握
- 哪些还不会
- 哪些需要复习
- 一周学了多久
- 题目正确率
- 哪些知识点反复出错

---

# 3. Product Scope / 产品范围

## 3.1 V0.1 Scope / 第一版范围

V0.1 should include:

- Dashboard
- Learning Path
- Lesson Viewer
- Quiz Engine
- Review Engine
- Mastery System
- Parent View
- Local progress persistence
- Progress export/import
- 20–30 chemistry lessons
- about 150–250 questions
- 3–5 interactive chemistry widgets
- bilingual UI
- bilingual lesson content where practical

第一版包括：

- 首页 Dashboard
- 学习路径 Learning Path
- 课程页面 Lesson Viewer
- 做题系统 Quiz Engine
- 复习系统 Review Engine
- 掌握度 Mastery System
- 家长查看页面 Parent View
- 本地保存学习进度
- 导入 / 导出进度
- 20–30 节化学课程
- 约 150–250 道题
- 3–5 个互动组件
- 中英双语 UI
- 尽量中英对照课程内容

## 3.2 Explicitly Out of Scope / 第一版明确不做

Do not build:

- authentication
- cloud database
- user registration
- payment
- subscriptions
- forums
- chat rooms
- social feeds
- leaderboard
- badges-heavy gamification
- mobile app
- native iOS/Android
- complex admin CMS
- real-time sync
- microservices
- message queues
- WebSockets
- Docker orchestration unless needed later
- LLM tutor in V0.1

中文：

暂时不要做：

- 登录注册
- 云数据库
- 付费
- 订阅
- 论坛
- 社交
- 排行榜
- 过度游戏化
- 原生手机 App
- 复杂后台
- 多端实时同步
- 微服务
- 消息队列
- WebSocket
- 大型 DevOps
- 第一版 AI Tutor

---

# 4. Technology Stack / 技术栈

## 4.1 Frontend / 前端

Use:

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Markdown renderer
- lightweight state management only if necessary

Recommended:

```text
React
TypeScript
Vite
Tailwind CSS
React Router
remark / react-markdown
zod
```

Avoid adding heavy dependencies without a clear reason.

不要随意增加大型库。

## 4.2 Backend / 后端

Use:

- Node.js
- TypeScript
- Express

Responsibilities:

- serve API if needed;
- future AI integration point;
- future content services;
- file-based content access if useful;
- keep API keys off the client.

第一版后端功能可以非常轻：

- 提供 API
- 提供课程内容
- 未来作为 AI 接口
- 防止 API Key 暴露在前端

## 4.3 Storage / 存储

No database in V0.1.

Use:

- JSON
- Markdown
- SVG
- images
- localStorage

Optional later:

- IndexedDB
- SQLite
- Postgres
- cloud sync

---

# 5. Suggested Repository Structure / 推荐项目目录

```text
chemistry-path/
│
├── README.md
├── Plan.md
├── package.json
├── pnpm-workspace.yaml
│
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── features/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   ├── styles/
│   │   │   └── types/
│   │   └── ...
│   │
│   └── server/
│       ├── src/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── lib/
│       │   └── index.ts
│       └── ...
│
├── content/
│   ├── curriculum.json
│   ├── levels/
│   │   ├── level-01/
│   │   ├── level-02/
│   │   ├── level-03/
│   │   └── level-04/
│   ├── questions/
│   ├── assets/
│   │   ├── svg/
│   │   ├── images/
│   │   └── diagrams/
│   └── glossary/
│
├── packages/
│   ├── shared-types/
│   ├── learning-engine/
│   └── content-schema/
│
└── docs/
    ├── curriculum-design.md
    ├── ux-principles.md
    ├── question-writing-guide.md
    └── content-style-guide.md
```

For V0.1, simplify if necessary.  
如果 monorepo 让开发变复杂，可以先减少层级。

The guiding rule:

> Prefer clarity over architecture elegance.

原则：

> **清晰优先，架构炫技靠后。**

---

# 6. Curriculum Philosophy / 课程设计哲学

## 6.1 Organize by dependency, not school year / 按知识依赖，而不是年级

Do not primarily structure the course as:

```text
Grade 7
Grade 8
Grade 9
Grade 10
```

Instead:

```text
Matter
↓
Particles
↓
Atoms
↓
Elements
↓
Periodic Table
↓
Ions
↓
Bonding
↓
Formulae
↓
Reactions
↓
Equations
↓
Moles
↓
Stoichiometry
```

中文：

不要首先按：

```text
初一
初二
初三
高一
高二
高三
```

来设计底层逻辑。

底层应该按照：

> **这个知识点需要先理解什么？**

来组织。

Later, school curriculum mappings can be added.

以后可以增加：

- NZ Curriculum
- NCEA
- Cambridge
- IGCSE
- 中国初中化学
- 中国高中化学
- IB Chemistry

---

# 7. Full Chemistry Learning Map / 完整化学学习地图

The long-term curriculum may include:

| Level | English | 中文 | Stage |
|---|---|---|---|
| 0 | Scientific Thinking & Lab Basics | 科学思维与实验基础 | Intro |
| 1 | Matter & Particles | 物质与粒子 | Middle |
| 2 | Elements, Compounds & Mixtures | 元素、化合物、混合物 | Middle |
| 3 | Atomic Structure | 原子结构 | Middle |
| 4 | Periodic Table | 元素周期表 | Middle |
| 5 | Ions & Chemical Bonding | 离子与化学键 | Middle → High |
| 6 | Chemical Formulae & Naming | 化学式与命名 | Middle → High |
| 7 | Chemical Reactions & Equations | 化学反应与方程式 | Middle |
| 8 | Acids, Bases & Salts | 酸、碱、盐 | Middle → High |
| 9 | Metals & Redox | 金属与氧化还原 | Middle → High |
| 10 | Mole Concept & Stoichiometry | 摩尔与化学计量 | High |
| 11 | Solutions & Concentration | 溶液与浓度 | High |
| 12 | Gases | 气体 | High |
| 13 | Energetics / Thermochemistry | 能量与热化学 | High |
| 14 | Reaction Rates | 反应速率 | High |
| 15 | Chemical Equilibrium | 化学平衡 | High |
| 16 | Electrochemistry | 电化学 | High |
| 17 | Organic Chemistry | 有机化学 | High |
| 18 | Intro Analytical Chemistry | 分析化学基础 | High |
| 19 | Integrated Problem Solving | 综合问题解决 | High |

Do **not** implement all of this now.

这只是长期地图，不是第一版开发任务。

---

# 8. First Curriculum Release / 第一阶段课程内容

Initial content target: 25 lessons.

## Level 1–4 Suggested Lessons

| # | English | 中文 |
|---:|---|---|
| 1 | What Is Matter? | 什么是物质？ |
| 2 | Everything Is Made of Particles | 一切由粒子构成 |
| 3 | Solids, Liquids and Gases | 固体、液体和气体 |
| 4 | Changes of State | 状态变化 |
| 5 | Physical vs Chemical Change | 物理变化与化学变化 |
| 6 | Pure Substances and Mixtures | 纯净物与混合物 |
| 7 | What Is an Element? | 什么是元素？ |
| 8 | What Is a Compound? | 什么是化合物？ |
| 9 | Elements vs Compounds | 元素与化合物 |
| 10 | What Is an Atom? | 什么是原子？ |
| 11 | Protons | 质子 |
| 12 | Neutrons | 中子 |
| 13 | Electrons | 电子 |
| 14 | Atomic Number | 原子序数 |
| 15 | Mass Number | 质量数 |
| 16 | Isotopes | 同位素 |
| 17 | What Is an Ion? | 什么是离子？ |
| 18 | The Periodic Table | 元素周期表 |
| 19 | Groups | 族 |
| 20 | Periods | 周期 |
| 21 | Metals | 金属 |
| 22 | Non-metals | 非金属 |
| 23 | Group 1 | 第一族 |
| 24 | Group 17 | 第十七族 |
| 25 | Group 18 | 第十八族 |

Initial implementation does not require every lesson to be equally complex.

第一批可以先做到：

- 10 节完全打磨好的课程
- 15 节结构完整但视觉较简单的课程

然后不断迭代。

---

# 9. Standard Lesson Structure / 标准课程结构

Every lesson should follow a predictable learning rhythm.

每一课尽量遵循固定节奏。

## 9.1 Lesson Sections / 课程模块

### A. Hook / 引入

Start with a question, observation, everyday phenomenon, or puzzle.

例如：

> If you keep cutting a piece of gold into smaller and smaller pieces, can you keep going forever?

中文：

> 如果你不断把一块金子切成更小的一半，可以永远切下去吗？

Purpose:

- create curiosity;
- activate prior knowledge;
- give a reason to learn.

### B. Big Idea / 核心思想

One sentence.

Example:

> An atom is the smallest unit of an element that still keeps the chemical identity of that element.

中文：

> 原子是保持某种元素化学性质的最小基本单位。

### C. Visual Explanation / 视觉解释

Use:

- SVG diagrams
- particle models
- arrows
- animation
- labelled diagrams
- before/after comparison

### D. Step-by-Step Explanation / 分步解释

Short paragraphs.

Avoid textbook walls of text.

每段尽量短。

### E. Interactive Model / 互动模型

When appropriate, include a small interactive activity.

### F. Worked Example / 例题

Show:

- question
- reasoning
- answer
- why

### G. Quick Check / 即时检查

1–3 questions.

### H. Common Misconception / 常见误区

Example:

> Electrons do not orbit the nucleus exactly like planets orbit the Sun.

### I. Explain Another Way / 换一种解释

Provide:

- simpler wording;
- analogy;
- visual;
- alternate example.

### J. Mastery Check / 掌握测试

5–8 questions.

---

# 10. Bilingual Content Strategy / 中英双语策略

The app should support Chinese + English from the beginning.

建议第一版采用：

## 10.1 UI / 界面

Option A:

```text
Atomic Structure
原子结构
```

Option B:

User language toggle:

```text
中文 | English | Bilingual
```

Recommended:

> Implement three display modes:
>
> - Chinese
> - English
> - Bilingual

推荐：

```text
中文
English
中英对照
```

## 10.2 Lesson Content / 课程

Important terminology should always support both languages.

Example:

```text
Proton
质子
```

```text
Atomic Number
原子序数
```

For explanations, content schema should support:

```json
{
  "en": "The number of protons determines the element.",
  "zh": "质子的数量决定了元素的种类。"
}
```

This allows:

- Chinese mode
- English mode
- bilingual mode

## 10.3 Vocabulary Benefit / 术语学习

A bilingual science vocabulary panel is valuable because the child may later encounter chemistry in English.

Example:

| English | 中文 |
|---|---|
| atom | 原子 |
| proton | 质子 |
| neutron | 中子 |
| electron | 电子 |
| element | 元素 |
| compound | 化合物 |

---

# 11. Content Data Model / 内容数据模型

## 11.1 Curriculum JSON

Example:

```json
{
  "id": "chemistry-core",
  "title": {
    "en": "Chemistry Path",
    "zh": "化学学习路径"
  },
  "levels": [
    {
      "id": "level-03",
      "title": {
        "en": "Atomic Structure",
        "zh": "原子结构"
      },
      "lessons": [
        "what-is-an-atom",
        "protons",
        "neutrons",
        "electrons",
        "atomic-number",
        "mass-number",
        "isotopes"
      ]
    }
  ]
}
```

## 11.2 Lesson Metadata

Recommended front matter:

```yaml
---
id: what-is-an-atom
title:
  en: What Is an Atom?
  zh: 什么是原子？
level: level-03
order: 1
estimatedMinutes: 15
difficulty: beginner
prerequisites:
  - what-is-an-element
tags:
  - atom
  - atomic-structure
masteryThreshold: 0.8
---
```

## 11.3 Question Schema

Example:

```json
{
  "id": "atom-001",
  "lessonId": "what-is-an-atom",
  "type": "multiple-choice",
  "difficulty": 1,
  "prompt": {
    "en": "What determines the identity of an element?",
    "zh": "什么决定了一种元素的身份？"
  },
  "options": [
    {
      "en": "Number of electrons",
      "zh": "电子数量"
    },
    {
      "en": "Number of protons",
      "zh": "质子数量"
    },
    {
      "en": "Number of neutrons",
      "zh": "中子数量"
    }
  ],
  "answer": 1,
  "explanation": {
    "en": "The number of protons determines which element an atom is.",
    "zh": "质子的数量决定了一个原子属于哪一种元素。"
  },
  "conceptIds": [
    "proton-count",
    "element-identity"
  ]
}
```

---

# 12. Question Types / 题目类型

Start simple.

V0.1 types:

1. Multiple choice
2. True / False
3. Multiple select
4. Fill in the blank
5. Numeric answer
6. Match pairs
7. Sort/order
8. Drag-and-drop classification

Later:

- diagram labelling
- equation balancing
- formula construction
- atom builder questions
- graph interpretation
- multi-step calculations

Do not build every type before launch.

第一版优先：

- 单选
- 判断
- 填空
- 数字回答
- 拖拽分类

---

# 13. Mastery System / 掌握度系统

Completion is not mastery.

“看完”不等于“掌握”。

Each concept should have a mastery state:

```text
Not Started
Learning
Practicing
Mastered
Review Due
```

中文：

```text
未开始
学习中
练习中
已掌握
需要复习
```

## 13.1 Suggested State Rules / 简化规则

### Not Started

No lesson activity.

### Learning

Lesson opened or partially completed.

### Practicing

Lesson completed but mastery score below threshold.

### Mastered

Requirements:

- lesson completed;
- mastery quiz score >= 80%;
- at least one reasoning/application question correct.

### Review Due

Mastered lesson reaches scheduled review date.

---

# 14. Progress Model / 学习进度格式

Example:

```json
{
  "version": 1,
  "student": {
    "displayName": "Student"
  },
  "lessons": {
    "what-is-an-atom": {
      "status": "mastered",
      "lessonProgress": 1,
      "bestScore": 0.92,
      "attempts": 2,
      "lastStudiedAt": "2026-10-05T08:30:00.000Z",
      "masteredAt": "2026-10-05T08:42:00.000Z",
      "nextReviewAt": "2026-10-06T08:00:00.000Z"
    }
  },
  "concepts": {
    "element-identity": {
      "strength": 0.88,
      "attempts": 6,
      "correct": 5
    }
  }
}
```

Store in localStorage.

Add:

- Export JSON
- Import JSON
- Reset progress with confirmation

---

# 15. Review System / 复习系统

V0.1 uses a simple fixed spaced-review schedule.

Recommended intervals:

```text
Day 0   Learn
Day 1   Review
Day 3   Review
Day 7   Review
Day 14  Review
Day 30  Review
```

中文：

```text
当天学习
第 1 天复习
第 3 天复习
第 7 天复习
第 14 天复习
第 30 天复习
```

Review sessions should be short.

Recommended:

- 3–8 questions
- mixed old concepts
- prioritize weak concepts
- show progress at end

Future improvement:

Use adaptive spaced repetition.

Not needed in V0.1.

---

# 16. Daily Experience / 每日学习体验

The learner should never have to decide what to do next.

首页直接给出：

```text
Today

Continue Learning
Atomic Number
12 min

Quick Review
3 questions
4 min
```

A typical session:

```text
2–5 min review
10–15 min new lesson
5–10 min practice
```

Total:

```text
15–25 minutes
```

The app should feel achievable.

不要让孩子一打开就觉得：

> 今天要学一个小时。

---

# 17. Main Pages / 核心页面

## 17.1 Dashboard / 首页

Show:

- greeting
- current level
- today’s lesson
- review due
- progress bar
- current streak optional
- recent achievements

Avoid clutter.

Example:

```text
Good afternoon.
下午好。

Chemistry
化学

Level 3 · Atomic Structure
第 3 阶段 · 原子结构

TODAY / 今天

Continue Learning
继续学习

Atomic Number
原子序数

12 min

[ Continue / 继续 ]

Quick Review / 快速复习

3 questions
约 4 分钟
```

## 17.2 Learning Path / 学习路径

Show levels vertically.

Example:

```text
Level 1 Matter & Particles        100%
Level 2 Elements & Compounds      100%
Level 3 Atomic Structure           63%
Level 4 Periodic Table              0%
```

Each lesson node displays mastery status.

## 17.3 Lesson Page / 课程页

Requirements:

- readable width
- short sections
- progress indicator
- bilingual display option
- diagrams
- inline check questions
- interactive widgets
- “I don't get it / 我没理解” action
- next section button

## 17.4 Practice / 练习页

Requirements:

- one question at a time
- clear feedback
- explanation after answer
- optional retry
- do not reveal all answers before attempt
- show concept being tested when helpful

## 17.5 Review / 复习页

Requirements:

- mixed concepts
- short session
- progress indicator
- result summary
- weak concept suggestions

## 17.6 Parent View / 家长页面

Show:

```text
This Week / 本周

Study time        1h 42m
Lessons completed 7
Questions         63
Accuracy          84%

Needs Attention / 需要关注

Atomic Number     62%
Ions              69%

Strong / 掌握良好

Elements          96%
Atoms             94%
```

Do not overcomplicate analytics.

---

# 18. “I Don’t Get It” System / “我没理解”系统

Each major concept should support:

```text
I don't get it
我没理解
```

On click, present options:

- Explain more simply
- Explain with an analogy
- Show a diagram
- Give another example
- Show step by step

中文：

- 说得更简单一点
- 用类比解释
- 给我看图
- 再举一个例子
- 一步一步解释

In V0.1, these can be prewritten.

Later, AI can dynamically generate them.

---

# 19. Interactive Chemistry Widgets / 化学互动组件

V0.1 target: 3–5.

Recommended priority:

## 19.1 Particle State Simulator / 粒子状态模拟器

Show:

- solid
- liquid
- gas

Learner can change temperature.

Visualize:

- particle spacing
- movement
- state change

## 19.2 Atom Builder / 原子构造器

Learner can add/remove:

- protons
- neutrons
- electrons

Display:

- element name
- atomic number
- mass number
- charge

## 19.3 Periodic Table Explorer / 周期表探索器

Click an element to see:

- symbol
- atomic number
- category
- basic properties
- shell/electron illustration
- bilingual terminology

## 19.4 Ion Builder / 离子构造器

Add or remove electrons.

Show:

```text
Na → Na⁺
Cl → Cl⁻
```

## 19.5 Matter Classifier / 物质分类器

Drag examples into:

- element
- compound
- mixture

---

# 20. Visual Design Principles / 视觉设计原则

The app should feel:

- calm
- modern
- clean
- intelligent
- child-friendly without looking childish

不要：

- 卡通化过度
- 满屏彩色徽章
- 复杂动画
- 刺眼渐变
- 过多游戏 UI

Use:

- generous whitespace
- large readable typography
- soft surfaces
- strong visual hierarchy
- clear diagrams
- restrained color usage

## 20.1 Suggested Typography

Prefer:

- Inter
- system sans-serif
- Noto Sans SC for Chinese if needed

Do not bundle font files unnecessarily.

## 20.2 Layout

Desktop first:

- sidebar optional
- max lesson reading width around 760–900 px
- responsive
- tablet friendly

---

# 21. SVG-First Science Graphics / 优先使用 SVG

Prefer SVG for:

- atoms
- electron shells
- particle models
- molecules
- arrows
- reaction diagrams
- periodic table
- bonding diagrams
- lab equipment schematics

Advantages:

- crisp
- small
- scalable
- interactive
- easy to animate with React/CSS

Use photos for:

- real materials
- lab scenes
- everyday chemistry
- industrial chemistry
- real-world examples

---

# 22. Content Writing Rules / 课程内容写作规范

## 22.1 One idea at a time / 一次讲一个概念

Avoid dense paragraphs.

## 22.2 Start concrete, then abstract / 先具体，再抽象

Example:

```text
ice → water → steam
```

before:

```text
particle kinetic energy
```

## 22.3 Use questions often / 多提问题

Example:

> If two atoms have different numbers of protons, can they still be the same element?

## 22.4 Explain “why” / 不只告诉结论

Bad:

> Sodium forms Na⁺.

Better:

> Sodium has one outer electron. Losing that electron gives it a more stable electron arrangement, so sodium commonly forms Na⁺.

## 22.5 Avoid unnecessary jargon / 控制术语密度

Introduce terminology only when useful.

## 22.6 Always address misconceptions / 主动处理误区

---

# 23. Question Writing Principles / 出题原则

Questions should measure understanding, not memorization only.

Each important concept should include:

1. recognition
2. explanation
3. application
4. comparison
5. error diagnosis

Example for atomic number:

### Recognition

> What is atomic number?

### Application

> An atom has 8 protons. What is its atomic number?

### Reasoning

> Why does changing the number of protons change the element?

### Error diagnosis

> A student says, “Atomic number is the number of electrons.” Explain when this is true and why it is not the definition.

---

# 24. Difficulty Model / 难度模型

Use 1–5.

```text
1 = direct recall
2 = simple understanding
3 = application
4 = multi-step reasoning
5 = challenge / transfer
```

For middle-school introduction, most questions should be:

```text
1–3
```

Mastery tests should include at least one Level 3 reasoning question.

---

# 25. Navigation Rules / 导航规则

The learner should always know:

- where they are;
- what comes next;
- what remains;
- whether they mastered it.

Every lesson should show:

```text
Level 3 / Atomic Structure
Lesson 4 of 7
```

Bottom actions:

```text
Previous
Back to Path
Continue
```

---

# 26. Unlocking Rules / 解锁规则

V0.1:

A lesson unlocks when prerequisites are completed.

Recommended:

- allow the learner to preview locked lessons;
- clearly show prerequisite;
- do not make the system feel punitive.

Example:

```text
Locked
Complete “What Is an Atom?” first.
```

中文：

```text
尚未解锁
请先完成《什么是原子？》
```

Optional parent setting later:

- strict sequence
- free exploration

---

# 27. Analytics / 学习分析

V0.1 metrics:

- lessons started
- lessons completed
- mastery rate
- questions answered
- accuracy
- time spent
- weak concepts
- review completion

Do not collect excessive behavioral data.

No analytics vendor required for family version.

---

# 28. Accessibility / 可访问性

Basic requirements:

- keyboard usable
- proper labels
- sufficient contrast
- scalable text
- buttons large enough
- avoid meaning through color alone
- diagrams should include accessible text where practical

---

# 29. Error Handling / 错误处理

The app should handle:

- malformed lesson JSON
- missing Markdown
- missing image
- corrupt progress file
- incompatible progress version
- empty review queue

Never crash the entire app because one content file is broken.

---

# 30. Validation / 内容校验

Create Zod schemas for:

- curriculum
- lesson metadata
- questions
- progress files

At development startup or build time:

- validate all JSON;
- show helpful errors;
- fail fast in development.

Example:

```text
Question atom-004:
missing explanation.zh
```

---

# 31. Testing Strategy / 测试策略

V0.1 should include:

## Unit tests

For:

- mastery calculation
- review scheduling
- unlock logic
- progress serialization
- import/export
- language selection

## Component tests

For:

- question rendering
- answer feedback
- progress status
- lesson navigation

## E2E tests

Minimum flows:

1. open app
2. start lesson
3. complete lesson
4. take mastery quiz
5. become mastered
6. review becomes scheduled
7. export progress
8. import progress

---

# 32. Performance / 性能

Targets:

- initial load fast on normal home internet
- avoid large image bundles
- lazy-load lesson assets
- split interactive widgets
- keep animation lightweight

No premature optimization.

---

# 33. Security / 安全

For V0.1:

- no secrets in client
- no external API keys in browser
- sanitize Markdown if raw HTML is supported
- validate imported JSON
- do not execute arbitrary imported content

If AI is added later:

```text
Browser
   ↓
Node API
   ↓
LLM Provider
```

Never:

```text
Browser → API Key → LLM
```

---

# 34. Future AI Tutor / 未来 AI Tutor

Do not build in V0.1.

Potential V0.2+ features:

- Explain My Mistake
- Make It Easier
- Give Me Another Example
- Ask Me a Similar Question
- Challenge Me
- Socratic Hint Mode
- Parent Summary

AI should augment the structured curriculum, not replace it.

原则：

> AI 是教练，不是课程结构本身。

---

# 35. Development Phases / 开发阶段

## Phase 0 — Foundation / 项目骨架

Goal:

The project runs locally.

Deliver:

- React + TypeScript + Vite
- Tailwind
- Node + Express
- routing
- shared types
- basic folder structure
- linting
- formatting
- test setup

Acceptance:

```text
pnpm install
pnpm dev
```

starts frontend + backend successfully.

---

## Phase 1 — Content Engine / 内容引擎

Goal:

Lessons and questions load from local files.

Deliver:

- curriculum loader
- lesson loader
- Markdown rendering
- JSON question loading
- Zod validation
- bilingual content structure

Acceptance:

A sample lesson can be opened in all three language modes:

```text
Chinese
English
Bilingual
```

---

## Phase 2 — Core UI / 核心界面

Deliver:

- Dashboard
- Learning Path
- Lesson page
- Practice page
- Review page
- Parent view

Use placeholder lesson content initially.

Acceptance:

Navigation works end to end.

---

## Phase 3 — Progress Engine / 学习进度

Deliver:

- localStorage
- lesson status
- concept mastery
- quiz history
- timestamps
- export/import
- reset progress

Acceptance:

Refreshing the page keeps progress.

---

## Phase 4 — Quiz Engine / 做题系统

Deliver:

- multiple choice
- true/false
- fill blank
- numeric
- feedback
- explanation
- retry
- quiz summary

Acceptance:

A mastery quiz can update lesson status.

---

## Phase 5 — Review Engine / 复习系统

Deliver:

- fixed spaced repetition
- review queue
- due review indicator
- mixed review session

Acceptance:

A mastered lesson schedules Day 1 / 3 / 7 / 14 / 30 reviews.

---

## Phase 6 — Interactive Widgets / 互动组件

Implement:

1. Particle State Simulator
2. Atom Builder
3. Periodic Table Explorer

Optional:

4. Ion Builder
5. Matter Classifier

Acceptance:

Widgets work inside lessons.

---

## Phase 7 — First Real Curriculum / 第一批真实课程

Goal:

Create first 10 polished lessons.

Suggested:

1. What Is Matter?
2. Particles
3. Solids, Liquids and Gases
4. Changes of State
5. Physical vs Chemical Change
6. Pure Substances and Mixtures
7. Elements
8. Compounds
9. Elements vs Compounds
10. What Is an Atom?

Each should have:

- bilingual content
- examples
- visuals
- quick checks
- mastery quiz

---

## Phase 8 — Curriculum Expansion / 扩展到 25 课

Add lessons 11–25.

Add about 150–250 total questions.

---

## Phase 9 — Family Testing / 家庭测试

Actual child uses app.

Record:

- confusing lessons
- boring sections
- too much text
- too little explanation
- bad questions
- unclear feedback
- broken review timing
- unnecessary features

This phase is more important than adding new code.

---

# 36. Success Criteria / 成功标准

The project is successful if after 30 days:

The learner can explain, not merely recognize:

- what matter is;
- particle model;
- physical vs chemical change;
- element vs compound;
- what an atom is;
- proton / neutron / electron;
- atomic number;
- mass number;
- isotope;
- basic periodic table structure.

A strong test:

The child should be able to answer:

> Why does changing the number of protons change the element?

and explain the reasoning in their own words.

---

# 37. Codex Working Rules / 给 Codex 的工作规则

Codex should follow these rules throughout development.

## Rule 1 — Read before changing

Before making changes:

1. Read `Plan.md`
2. Read relevant existing files
3. Understand current architecture
4. Avoid unnecessary rewrites

## Rule 2 — Work incrementally

Do not implement the entire app in one giant change.

Prefer small milestones.

## Rule 3 — Keep the app runnable

After each significant change:

- run typecheck
- run tests
- run lint
- fix errors

## Rule 4 — Avoid overengineering

Do not introduce:

- Redux unless clearly necessary
- database
- authentication
- GraphQL
- microservices
- complex dependency injection
- large UI framework
- unnecessary abstraction layers

## Rule 5 — Preserve bilingual support

All new learner-facing text should be designed for:

```text
zh
en
```

## Rule 6 — Content is data

Do not hardcode lesson content inside React components unless it is UI copy.

Lessons belong in content files.

## Rule 7 — Separate learning logic

Mastery and review algorithms should live outside components.

## Rule 8 — Type everything

Use TypeScript types and Zod validation.

## Rule 9 — Prefer reusable science components

Examples:

```text
BilingualText
ConceptCard
QuestionCard
MasteryBadge
LessonProgress
PeriodicTable
AtomDiagram
ParticleDiagram
```

## Rule 10 — Document major decisions

If architecture changes significantly, update:

```text
Plan.md
README.md
docs/
```

---

# 38. Codex Task Execution Pattern / Codex 每次任务执行方式

For each development task:

## Step 1

State briefly what will be changed.

## Step 2

Inspect relevant files.

## Step 3

Implement the smallest complete solution.

## Step 4

Run:

```text
typecheck
lint
tests
```

## Step 5

Fix failures.

## Step 6

Summarize:

- files changed
- behavior added
- known limitations
- suggested next task

---

# 39. Recommended Initial Codex Prompt / 推荐第一条 Codex 指令

Use this after placing `Plan.md` in the repository:

```text
Read Plan.md carefully and treat it as the source of truth for this project.

We are building a family-use bilingual chemistry learning application for a child who is about to enter middle school.

Do not try to build the entire product at once.

For this first task, implement Phase 0 only:

1. Create the project structure.
2. Use React + TypeScript + Vite for the frontend.
3. Use Tailwind CSS.
4. Use Node.js + Express + TypeScript for the backend.
5. Prefer a simple pnpm workspace.
6. Add shared TypeScript types if useful.
7. Add linting, formatting, and a basic test setup.
8. Create a minimal bilingual home screen that proves the frontend works.
9. Create a /health backend endpoint.
10. Add a README with exact local development commands.

Do not add a database, authentication, AI integration, Redux, GraphQL, Docker, or unnecessary infrastructure.

After implementation:
- run typecheck
- run lint
- run tests
- fix all errors
- summarize the files created and the next recommended step

Do not proceed to Phase 1 until Phase 0 is stable.
```

中文理解：

> 先只做 Phase 0。不要一次做完整项目。

---

# 40. Second Codex Prompt / 第二阶段 Codex 指令

After Phase 0 is stable:

```text
Read Plan.md and the existing codebase.

Implement Phase 1: Content Engine.

Requirements:

1. Add a content folder for curriculum, lessons, questions, and assets.
2. Define TypeScript + Zod schemas for:
   - curriculum
   - lesson metadata
   - bilingual text
   - questions
3. Support zh/en bilingual content.
4. Support three display modes:
   - Chinese
   - English
   - Bilingual
5. Add one sample lesson:
   "What Is Matter? / 什么是物质？"
6. Add at least five sample questions.
7. Render the lesson from content files rather than hardcoded JSX.
8. Add useful validation errors for malformed content.
9. Add tests for the schemas and content loader.

Keep the implementation simple.

Do not build the full quiz engine yet.

Run all checks and summarize the result.
```

---

# 41. Product Decisions That Should Not Be Changed Casually / 不要轻易改变的产品决策

Unless there is a strong reason, preserve these decisions:

1. Family-use first
2. No DB in V0.1
3. Bilingual from the start
4. Content-driven architecture
5. Knowledge dependency learning path
6. Mastery, not completion
7. Spaced review
8. Small daily sessions
9. SVG-first science diagrams
10. AI later
11. Child learning effectiveness > feature count
12. Real family testing before expansion

---

# 42. Future Expansion / 未来扩展方向

Only after V0.1 proves useful.

Possible future additions:

## Product

- account login
- multiple children
- parent accounts
- school mode
- teacher mode
- cloud sync
- mobile app

## Learning

- adaptive difficulty
- adaptive review
- diagnostic test
- personalized learning path
- exam mode
- chapter tests
- mock exams

## AI

- AI tutor
- AI mistake explanation
- AI generated practice
- AI oral questioning
- parent weekly summaries

## Subjects

Architecture should eventually support:

```text
Chemistry
Physics
Biology
```

Potential future structure:

```text
Science Path

Chemistry
Physics
Biology
```

But do not generalize prematurely.

先把化学做好。

---

# 43. Future Physics & Biology Compatibility / 为物理和生物预留

The app should avoid chemistry-specific assumptions in generic infrastructure.

Generic concepts:

```text
Course
Level
Unit
Lesson
Concept
Question
Progress
Mastery
Review
InteractiveWidget
```

Chemistry-specific widgets belong under chemistry features.

This allows later:

```text
courses/
  chemistry/
  physics/
  biology/
```

without rewriting the learning engine.

---

# 44. Suggested Generic Type Model / 通用类型建议

```ts
type LocalizedText = {
  en: string;
  zh: string;
};

type LessonStatus =
  | "not-started"
  | "learning"
  | "practicing"
  | "mastered"
  | "review-due";

type Difficulty = 1 | 2 | 3 | 4 | 5;

type LessonMeta = {
  id: string;
  title: LocalizedText;
  levelId: string;
  order: number;
  estimatedMinutes: number;
  prerequisites: string[];
  masteryThreshold: number;
  tags: string[];
};

type ConceptProgress = {
  conceptId: string;
  attempts: number;
  correct: number;
  strength: number;
};

type LessonProgress = {
  lessonId: string;
  status: LessonStatus;
  bestScore: number;
  attempts: number;
  lastStudiedAt?: string;
  masteredAt?: string;
  nextReviewAt?: string;
};
```

Codex may improve the types if needed, but should preserve the conceptual model.

---

# 45. Initial Content Quality Standard / 第一批课程质量标准

A lesson should not be considered “finished” merely because text exists.

Each polished lesson should include:

- clear learning objectives
- bilingual title
- bilingual key terms
- hook
- big idea
- 3–6 explanation blocks
- at least one visual
- 2–3 quick checks
- one misconception section
- alternate explanation
- 5–8 mastery questions
- answer explanations
- concept IDs
- estimated duration

---

# 46. Example Learning Objectives / 学习目标示例

For “What Is an Atom?”:

By the end of the lesson, the learner can:

1. define an atom in simple language;
2. explain why atoms matter in chemistry;
3. distinguish atom from element;
4. recognize that atoms contain smaller particles;
5. answer simple reasoning questions about atomic identity.

中文：

完成课程后，孩子应该能够：

1. 用自己的话解释什么是原子；
2. 说明为什么化学要研究原子；
3. 区分“原子”和“元素”；
4. 知道原子内部还有更小的粒子；
5. 回答关于原子身份的基础推理题。

---

# 47. Parent Use Philosophy / 家长使用原则

Parent view should support the child, not pressure the child.

Avoid:

- ranking
- shame
- red warning overload
- excessive productivity metrics

Prefer:

```text
Needs more practice
需要更多练习
```

rather than:

```text
FAILED
失败
```

---

# 48. Feedback Tone / 反馈语气

Correct:

> Correct. The proton number determines the element.

中文：

> 正确。元素的种类由质子数量决定。

Incorrect:

> Not quite. Try thinking about which particle defines the element.

中文：

> 还不完全正确。想一想：究竟是哪一种粒子决定元素的身份？

Then explain.

Avoid:

- “Wrong!”
- “Bad”
- punitive language

---

# 49. Gamification Policy / 游戏化原则

Use only light gamification.

Allowed:

- progress bars
- lesson completion
- small mastery indicators
- optional streak

Avoid turning learning into badge collection.

Success should feel like:

> “I understand this.”

not:

> “I earned 500 coins.”

---

# 50. Definition of Done / 完成标准

A feature is done only if:

- works in browser;
- TypeScript passes;
- lint passes;
- tests pass where relevant;
- bilingual text works;
- no obvious console errors;
- responsive layout is acceptable;
- architecture remains simple;
- README/docs updated if needed.

---

# 51. Final Product Principle / 最终原则

Whenever there is a conflict between:

```text
more features
vs
better learning
```

choose:

```text
better learning
```

Whenever there is a conflict between:

```text
clever architecture
vs
easy maintenance
```

choose:

```text
easy maintenance
```

Whenever there is a conflict between:

```text
finishing more lessons quickly
vs
making fewer lessons genuinely excellent
```

choose:

```text
fewer excellent lessons
```

The long-term goal is not to create “a chemistry website.”

The goal is:

> **Build a system that can take a child from almost zero chemistry knowledge to strong high-school chemistry understanding, one concept at a time.**

长期真正想做的是：

> **把一个几乎没有化学基础的孩子，通过清晰的知识路径、互动理解、练习反馈和重复复习，一步一步带到扎实的高中化学水平。**

---

# 52. Immediate Next Action / 立即下一步

After placing this file in the root folder:

1. Open the project in Codex.
2. Give Codex the **Phase 0 prompt** from Section 39.
3. Let Codex finish Phase 0 only.
4. Review the structure.
5. Fix any setup issues.
6. Then proceed to Phase 1.
7. Build the product incrementally.
8. Do not ask Codex to “finish the whole app” in one pass.

---

**Document status:** V1.0  
**Project:** Chemistry Path  
**Primary mode:** Family-use MVP  
**Architecture:** React + TypeScript + Tailwind + Node.js + Express + Markdown/JSON + localStorage  
**Core principle:** Understanding → Practice → Mastery → Review

