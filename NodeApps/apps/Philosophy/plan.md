# Philosophy — Project Goal & Codex Execution Plan

> File purpose: This is the long-running project specification for Codex.
>
> Project name: **Philosophy**
>
> Stack: **Node.js + React + Markdown**
>
> Initial audience: **one personal user**
>
> Product principle: **Build a usable philosophy-learning app first. Do not over-engineer V1.**
>
> Long-term ambition: Create a structured learning experience that approximates the intellectual progression of a strong undergraduate philosophy degree.

---

# 1. Project Vision

Build a personal web app called **Philosophy**.

The app should not be a collection of disconnected encyclopedia articles about philosophers.

It should behave more like a well-designed university philosophy program:

1. Begin with foundational skills.
2. Teach students how philosophical arguments work.
3. Move through the history of philosophy in a coherent sequence.
4. Teach the major branches of philosophy.
5. Revisit important problems from multiple philosophical traditions.
6. Require active thinking, not only passive reading.
7. Add 3–5 questions after each lesson.
8. Track progress through the curriculum.
9. Eventually culminate in advanced seminars and a capstone-style philosophical essay/project.

The intended feeling is:

> “I am gradually completing a serious philosophy degree by studying one carefully organized lesson at a time.”

This is **not an accredited degree**. It is a structured self-learning system inspired by the breadth, progression, reading, argumentation, and writing expected in strong undergraduate philosophy programs.

---

# 2. V1 Product Philosophy

V1 is for **one user only**.

Do not build unnecessary SaaS infrastructure.

For V1:

- no public registration
- no social features
- no payment system
- no subscriptions
- no admin dashboard unless truly necessary
- no complex permissions
- no multi-tenant database
- no recommendation algorithm
- no native mobile app
- no gamification economy
- no AI tutor dependency
- no elaborate CMS

The goal of V1 is to answer one question:

> **Can this app become an excellent personal system for learning philosophy over several years?**

Optimize for:

- excellent curriculum structure
- excellent reading experience
- clear progress
- high-quality lessons
- active recall
- philosophical reasoning
- maintainability
- easy creation of new Markdown lessons

Content quality is more important than feature quantity.

---

# 3. Core Learning Model

The learning loop should be simple:

**Curriculum → Course → Module → Lesson → Questions → Reflection → Progress**

A user should be able to:

1. Open the app.
2. See the philosophy curriculum.
3. See where they currently are.
4. Continue the next lesson.
5. Read a well-formatted Markdown lesson.
6. answer 3–5 questions.
7. reveal/check model answers or guidance.
8. mark the lesson complete.
9. automatically advance progress.
10. return later and continue from the same place.

---

# 4. Educational Philosophy

The app should teach philosophy as a discipline, not merely philosophy as information.

Every major course should develop at least some of these skills:

- reconstructing an argument
- identifying premises and conclusions
- distinguishing validity from truth
- identifying hidden assumptions
- defining concepts precisely
- constructing objections
- responding to objections
- comparing competing theories
- reading primary philosophical texts
- evaluating thought experiments
- writing clear philosophical prose
- separating rhetoric from argument
- recognizing ambiguity
- reasoning from principles to cases
- reasoning from cases back to principles
- intellectual charity
- philosophical skepticism
- conceptual analysis
- synthesis across traditions

The student should gradually move from:

> “What did Plato say?”

to:

> “What is Plato’s argument, why might it be persuasive, where can it be challenged, how does Aristotle respond, and what position can I defend?”

---

# 5. Curriculum Architecture

The curriculum should resemble a **four-stage undergraduate philosophy education**, but the app should remain self-paced.

Do not tie progress to calendar years.

Use four levels:

- **Level 1 — Foundations**
- **Level 2 — History & Core Problems**
- **Level 3 — Major Branches & Traditions**
- **Level 4 — Advanced Seminars & Capstone**

The complete curriculum can eventually contain roughly **100–160 lessons**, but Codex should NOT attempt to write all lessons in one pass.

Build the platform first, then add content progressively.

---

# 6. Proposed Curriculum

## LEVEL 1 — FOUNDATIONS

Goal: Learn what philosophy is and how philosophers think.

### Course 1 — Introduction to Philosophy

Suggested lessons:

1. What Is Philosophy?
2. Why Ask Philosophical Questions?
3. Argument vs Opinion
4. Premises, Conclusions, and Inference
5. Necessary and Sufficient Conditions
6. Thought Experiments
7. Conceptual Analysis
8. Skepticism and Intellectual Humility
9. How to Read a Philosophical Text
10. How to Write a Philosophical Argument

### Course 2 — Critical Thinking & Informal Logic

Suggested lessons:

1. Anatomy of an Argument
2. Deductive vs Inductive Reasoning
3. Validity and Soundness
4. Hidden Premises
5. Counterexamples
6. Common Informal Fallacies
7. Principle of Charity
8. Argument Maps
9. Evaluating Evidence
10. Building and Revising an Argument

### Course 3 — Introduction to Formal Logic

Suggested lessons:

1. Statements and Logical Form
2. Negation
3. Conjunction and Disjunction
4. Conditional Statements
5. Truth Tables
6. Valid Argument Forms
7. Propositional Logic
8. Quantifiers
9. Predicate Logic — Introduction
10. Limits of Formalization

### Course 4 — Philosophical Writing

Suggested lessons:

1. What Makes Philosophical Writing Different?
2. Writing a Clear Thesis
3. Reconstructing an Opponent’s Argument
4. Giving an Objection
5. Answering an Objection
6. Using Examples and Counterexamples
7. Structuring a Philosophy Essay
8. Editing for Precision
9. Avoiding Empty Abstraction
10. Short Final Essay

---

## LEVEL 2 — HISTORY & CORE PROBLEMS

Goal: Build historical depth while introducing enduring philosophical problems.

### Course 5 — Ancient Greek Philosophy

Suggested sequence:

- Presocratics
- Socrates
- Plato: knowledge
- Plato: Forms
- Plato: justice
- Aristotle: logic
- Aristotle: metaphysics
- Aristotle: ethics
- Epicureanism
- Stoicism
- Skepticism

### Course 6 — Medieval Philosophy

Suggested topics:

- Augustine
- Faith and reason
- Universals
- Anselm
- Avicenna
- Averroes
- Aquinas
- Natural law
- Problem of evil
- Medieval debates about knowledge and being

Treat Christian, Islamic, and Jewish philosophical traditions seriously and historically.

Do not present theology as a substitute for philosophical argument. Where faith commitments enter an argument, identify them clearly.

### Course 7 — Early Modern Philosophy

Suggested sequence:

- Scientific Revolution and the philosophical crisis
- Descartes
- Mind/body dualism
- Rationalism
- Spinoza
- Leibniz
- Locke
- Berkeley
- Hume
- Personal identity
- Causation
- Skepticism

### Course 8 — Kant and the Enlightenment

Suggested topics:

- The Enlightenment
- Kant’s philosophical project
- Synthetic a priori knowledge
- Phenomena and noumena
- Categories
- Freedom
- The categorical imperative
- Autonomy
- Enlightenment and reason
- Critiques of Kant

### Course 9 — Nineteenth-Century Philosophy

Suggested thinkers/topics:

- Hegel
- Dialectic
- Marx
- Kierkegaard
- Schopenhauer
- Nietzsche
- Utilitarianism: Bentham
- Mill
- Pragmatist beginnings

### Course 10 — Twentieth-Century Traditions

Introduce major movements without pretending they form one single tradition.

Suggested topics:

- Frege and the analytic turn
- Russell
- Logical positivism
- Wittgenstein I
- Wittgenstein II
- Ordinary language philosophy
- Phenomenology
- Husserl
- Heidegger
- Existentialism
- Sartre
- Beauvoir
- Hermeneutics
- Critical theory
- Structuralism and post-structuralism — introduction

---

## LEVEL 3 — MAJOR BRANCHES & TRADITIONS

Goal: Study central philosophical fields systematically.

### Course 11 — Epistemology

Suggested topics:

- What is knowledge?
- Justified true belief
- Gettier problems
- Skepticism
- Foundationalism
- Coherentism
- Reliabilism
- Internalism vs externalism
- Testimony
- Social epistemology
- Epistemic injustice
- Rational disagreement

### Course 12 — Metaphysics

Suggested topics:

- What is metaphysics?
- Identity
- Persistence through time
- Universals
- Possible worlds
- Necessity and possibility
- Causation
- Time
- Free will
- Determinism
- Personal identity
- Composition
- Reality and appearance

### Course 13 — Ethics

Suggested topics:

- What makes an action right?
- Moral realism
- Moral relativism
- Egoism
- Consequentialism
- Utilitarianism
- Deontology
- Kantian ethics
- Virtue ethics
- Care ethics
- Contractualism
- Moral luck
- Doing vs allowing harm
- Demandingness
- Applied case analysis

### Course 14 — Political Philosophy

Suggested topics:

- Political authority
- State of nature
- Hobbes
- Locke
- Rousseau
- Liberty
- Equality
- Justice
- Rawls
- Nozick
- Property
- Rights
- Democracy
- Civil disobedience
- Power and domination
- Contemporary debates

Keep this course analytical and multi-perspectival. Present arguments and objections rather than telling the learner which political position to adopt.

### Course 15 — Philosophy of Mind

Suggested topics:

- The mind-body problem
- Dualism
- Physicalism
- Behaviorism
- Functionalism
- Consciousness
- Qualia
- Intentionality
- Other minds
- Personal identity
- Extended mind
- Embodied cognition
- Artificial intelligence and mind

### Course 16 — Philosophy of Science

Suggested topics:

- What distinguishes science?
- Induction
- Hume’s problem of induction
- Falsification
- Popper
- Kuhn
- Paradigms
- Scientific realism
- Anti-realism
- Explanation
- Laws of nature
- Probability
- Models
- Values in science
- Scientific progress

### Course 17 — Philosophy of Language

Suggested topics:

- Meaning
- Reference
- Frege
- Russell
- Descriptions
- Wittgenstein
- Speech acts
- Grice
- Private language
- Metaphor
- Context
- Language and reality

### Course 18 — Philosophy of Religion

Suggested topics:

- What is philosophy of religion?
- Reason and religious belief
- Cosmological arguments
- Ontological arguments
- Teleological arguments
- Fine-tuning arguments
- Problem of evil
- Divine hiddenness
- Miracles
- Religious experience
- Faith and reason
- Free will and divine foreknowledge
- Religious pluralism
- Meaning of religious language

Present theistic, atheistic, agnostic, and other philosophical positions fairly.

### Course 19 — Aesthetics

Suggested topics:

- What is art?
- Beauty
- Taste
- Representation
- Expression
- Interpretation
- Authorial intention
- Art and morality
- Fiction and emotion
- Aesthetic experience

### Course 20 — Non-Western & Comparative Philosophy

This course is essential.

Suggested areas:

- Confucius
- Mencius
- Xunzi
- Daoism
- Zhuangzi
- Mohism
- Buddhist philosophy
- Madhyamaka
- Indian epistemological traditions
- African philosophy
- Ubuntu
- Comparative concepts of self
- Comparative ethics
- Comparative metaphysics

Avoid treating non-Western traditions as an appendix to “real philosophy.”

Integrate comparative references elsewhere in the curriculum when intellectually appropriate.

---

## LEVEL 4 — ADVANCED SEMINARS & CAPSTONE

Goal: Move from textbook-level familiarity to sustained philosophical inquiry.

### Course 21 — Free Will Seminar

Topics may include:

- determinism
- incompatibilism
- compatibilism
- libertarianism
- moral responsibility
- manipulation arguments
- luck
- neuroscience and agency

### Course 22 — Consciousness Seminar

Topics may include:

- hard problem of consciousness
- qualia
- philosophical zombies
- knowledge argument
- illusionism
- higher-order theories
- panpsychism
- AI consciousness

### Course 23 — Meaning of Life Seminar

Topics may include:

- objective vs subjective meaning
- absurdism
- existentialism
- mortality
- achievement
- relationships
- suffering
- religion
- secular accounts of meaning

### Course 24 — Technology, AI & Human Nature

Topics may include:

- intelligence
- agency
- personhood
- machine consciousness
- moral status
- responsibility
- technological mediation
- human enhancement
- automation
- knowledge in the age of AI
- authenticity
- future of education and work

### Course 25 — Philosophy of Death

Topics may include:

- what death is
- whether death can be bad for the person who dies
- Epicurus
- deprivation account
- identity over time
- mortality and meaning
- immortality thought experiments

Keep treatment intellectually serious and non-graphic.

### Course 26 — Capstone

The student should choose a major philosophical problem and develop a substantial argument.

Possible process:

1. Choose a question.
2. Define the problem.
3. Map major positions.
4. Read primary and secondary sources.
5. Write an argument map.
6. State a provisional thesis.
7. Produce strongest objection.
8. Revise thesis.
9. Write 2,000–4,000 word essay.
10. Produce final reflection: “How has my position changed?”

V1 only needs infrastructure for this later. Do not build an elaborate capstone system immediately.

---

# 7. Lesson Design Standard

Every lesson should be a Markdown file.

Each lesson should feel like a strong university lecture + guided reading, but remain readable by an intelligent self-learner.

Target lesson length for most lessons:

**1,500–3,500 words**

Short foundational lessons may be shorter.

Advanced lessons may be longer.

Do not inflate lessons just to hit word count.

---

# 8. Standard Lesson Structure

Each lesson should normally contain:

```md
---
id: ancient-socrates
course: ancient-philosophy
module: socrates
lesson: 2
title: "Socrates: The Examined Life"
subtitle: "Why questioning may matter more than possessing answers"
level: 2
estimatedMinutes: 35
prerequisites:
  - intro-philosophy
tags:
  - socrates
  - ancient-philosophy
  - ethics
  - knowledge
---

# Socrates: The Examined Life

## Why This Lesson Matters

...

## Learning Objectives

By the end of this lesson, you should be able to:

- ...
- ...
- ...

## 1. Historical Context

...

## 2. The Central Problem

...

## 3. The Argument

...

## 4. A Concrete Example

...

## 5. Strongest Objection

...

## 6. Possible Response

...

## 7. Comparison With Another Thinker

...

## 8. What You Should Remember

...

## Key Terms

- **Term** — definition
- **Term** — definition

## Primary Text

Short public-domain excerpt or a reference to a primary source.

## Further Reading

Optional.

## Questions

### 1. Understanding
...

### 2. Argument Reconstruction
...

### 3. Objection
...

### 4. Application
...

### 5. Reflection
...
```

Answers should NOT appear immediately below each question.

Store model answers separately in frontmatter, a companion JSON/Markdown section, or another clean mechanism so the UI can reveal them only when requested.

---

# 9. Question Design

Every normal lesson should contain **3–5 questions**.

Do not use only multiple-choice questions.

Prefer a mixture:

1. **Comprehension**
   - What does the philosopher claim?

2. **Argument reconstruction**
   - What are the premises and conclusion?

3. **Objection**
   - What is one serious objection?

4. **Application**
   - How would the theory handle a new case?

5. **Reflection / position**
   - Which part is most convincing or vulnerable, and why?

The learner should have to think.

For V1, answers do not need automatic grading.

The best simple interaction:

- user types an answer
- answer is saved locally
- user clicks **Show Guidance / Model Answer**
- model answer appears
- user optionally marks:
  - “I understand this”
  - “Review later”

Do NOT build AI grading in V1.

---

# 10. Primary Texts and Copyright

Use public-domain philosophical texts when full excerpts are included.

For copyrighted modern works:

- use short legally appropriate quotations only
- otherwise summarize arguments in original language
- provide bibliographic references
- do not copy large passages

Content written specifically for the app should be original.

---

# 11. Language

Initial interface language: **Chinese (Simplified Chinese)**.

Philosophical terminology should often show Chinese + English on first important use.

Example:

- 认识论（Epistemology）
- 形而上学（Metaphysics）
- 义务论（Deontology）
- 功利主义（Utilitarianism）
- 德性伦理学（Virtue Ethics）
- 充分条件（Sufficient Condition）

For philosopher names, use both forms where helpful:

> 伊曼努尔·康德（Immanuel Kant）

Avoid awkward literal translation.

The long-term architecture should not prevent adding English later, but **do not build a full i18n system in V1 unless it is very easy**.

---

# 12. V1 Feature Set

Build only the following core features first.

## 12.1 Home / Dashboard

Show:

- app title
- current overall progress
- “Continue Learning” card
- current course
- current lesson
- recently completed lessons
- curriculum progress summary

The dashboard should make the next action obvious.

---

## 12.2 Curriculum Page

Display the complete curriculum hierarchy:

```text
Level
  Course
    Module
      Lesson
```

Each lesson should show status:

- Not Started
- In Progress
- Completed
- Review

Provide progress bars for courses and levels.

---

## 12.3 Course Page

Show:

- course title
- course description
- what the learner will understand
- prerequisites
- lessons
- progress
- estimated total study time

---

## 12.4 Lesson Reader

This is the most important screen.

Requirements:

- excellent typography
- comfortable long-form reading width
- responsive layout
- Markdown rendering
- headings
- lists
- blockquotes
- tables
- footnotes if practical
- code blocks if ever required
- mathematical notation later if needed
- previous lesson / next lesson controls
- reading progress indicator
- table of contents on desktop if simple to implement
- mark lesson complete
- “Review later”
- questions at bottom

The design should feel closer to a high-quality digital textbook than a generic admin dashboard.

---

## 12.5 Lesson Questions

At the end of the lesson:

- text area for answer
- auto-save locally
- “Show guidance”
- guidance/model answer
- optional self-assessment

Possible simple self-assessment:

- Not yet
- Partly understand
- Understand well

No scoring system is required in the first version.

---

## 12.6 Progress Tracking

Track:

- lesson opened
- lesson completed
- lesson marked for review
- question answer text
- question self-assessment
- last visited lesson
- course progress
- overall progress

For V1, browser `localStorage` is acceptable and preferred for simplicity.

Create a clean data abstraction so storage can later move to SQLite/PostgreSQL without rewriting the UI.

---

## 12.7 Search

Simple search across:

- lesson title
- philosopher
- tags
- lesson text if reasonably easy

If full-text content search complicates V1 significantly, begin with title/tag search.

---

# 13. Suggested Technical Architecture

Keep the architecture simple.

## Frontend

- React
- Vite
- React Router
- JavaScript or TypeScript

Preference:

> Use **TypeScript** if it does not materially slow implementation. Otherwise use JavaScript consistently.

Suggested packages:

- `react-router-dom`
- `react-markdown`
- `remark-gfm`
- `gray-matter` or equivalent frontmatter parser

Optional only when needed:

- `rehype-slug`
- `rehype-autolink-headings`
- KaTeX for logic/math notation

Do not add large UI frameworks unless they clearly improve the product.

A small CSS system or CSS modules is enough.

---

## Backend

Use:

- Node.js
- Express

Backend responsibilities in V1:

- read curriculum metadata
- read Markdown lesson files
- expose lesson/course API endpoints
- optionally build a search index

Do NOT put lesson content in a database in V1.

Markdown files are the content database.

---

# 14. Content Storage

Recommended structure:

```text
/content
  /level-1-foundations
    /01-introduction-to-philosophy
      course.md
      01-what-is-philosophy.md
      02-philosophical-questions.md
      03-argument-vs-opinion.md

    /02-critical-thinking
      course.md
      ...

  /level-2-history
    /05-ancient-philosophy
      course.md
      ...

  /level-3-core-fields
    ...

  /level-4-seminars
    ...
```

Each `course.md` can contain course-level metadata:

```md
---
id: introduction-to-philosophy
title: 哲学导论
titleEn: Introduction to Philosophy
level: 1
order: 1
description: ...
estimatedHours: 8
---
```

Lesson ordering should come from metadata, not filename parsing alone.

---

# 15. Suggested App Structure

Example only; adapt if implementation needs it.

```text
philosophy/
├─ client/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ pages/
│  │  ├─ hooks/
│  │  ├─ services/
│  │  ├─ storage/
│  │  ├─ styles/
│  │  ├─ App.tsx
│  │  └─ main.tsx
│  └─ ...
│
├─ server/
│  ├─ src/
│  │  ├─ routes/
│  │  ├─ services/
│  │  ├─ content/
│  │  └─ index.ts
│  └─ ...
│
├─ content/
│  ├─ level-1-foundations/
│  ├─ level-2-history/
│  ├─ level-3-core-fields/
│  └─ level-4-seminars/
│
├─ scripts/
├─ plan.md
├─ README.md
└─ package.json
```

A monorepo-style root command should ideally start both frontend and backend.

Example desired developer workflow:

```bash
npm install
npm run dev
```

Do not make local setup unnecessarily complicated.

---

# 16. Suggested API

Keep API small.

Possible endpoints:

```text
GET /api/curriculum
GET /api/courses
GET /api/courses/:courseId
GET /api/lessons/:lessonId
GET /api/search?q=...
```

Progress can remain frontend/localStorage in V1.

---

# 17. Progress Data Model

Example:

```ts
type LessonProgress = {
  lessonId: string;
  status: "not-started" | "in-progress" | "completed" | "review";
  firstOpenedAt?: string;
  lastOpenedAt?: string;
  completedAt?: string;
  answers: Record<string, {
    text: string;
    selfAssessment?: "not-yet" | "partial" | "good";
    guidanceRevealed?: boolean;
  }>;
};
```

Keep the storage layer behind simple functions:

```ts
getProgress()
getLessonProgress(lessonId)
saveLessonProgress(...)
markLessonComplete(...)
markLessonForReview(...)
```

This makes later migration easier.

---

# 18. Visual Design Direction

The app should look serious, calm, intellectual, and modern.

Avoid:

- childish gamification
- excessive gradients
- dashboard clutter
- flashy animation
- neon cyberpunk design
- dense enterprise UI

Preferred visual feeling:

- university reading room
- modern academic journal
- premium long-form reading app
- restrained typography
- generous whitespace
- clear hierarchy

Suggested palette:

- warm off-white or neutral light background
- charcoal text
- subtle muted accent
- dark mode may be added if easy

Prioritize typography.

The lesson reading area should usually be approximately **700–850px** wide on large displays.

The user may use a large desktop display, so do not stretch paragraphs across the full screen.

---

# 19. Navigation

Recommended top-level navigation:

```text
Home
Curriculum
Review
Search
About
```

Inside a course:

```text
Course Overview
Lessons
Progress
```

Inside a lesson:

```text
← Previous
Course Name
Next →
```

Desktop may include a collapsible curriculum sidebar.

Mobile can use a simpler drawer.

---

# 20. Review Page

V1 review page can be simple.

Show lessons manually marked:

> Review later

For each review item show:

- title
- course
- last studied date
- link to lesson

Do NOT implement spaced repetition in V1.

That can be a future feature.

---

# 21. Content Quality Rules

When creating philosophy lessons:

1. Explain ideas accurately.
2. Distinguish philosopher’s actual position from later interpretations.
3. Do not turn biography into the lesson.
4. Center arguments and concepts.
5. Give historical context only when it clarifies the philosophy.
6. Present strong objections, not straw men.
7. Use concrete examples.
8. Compare related philosophers when useful.
9. Identify contested interpretations.
10. Avoid pretending difficult scholarly disputes have one obvious answer.
11. Define technical terms before relying on them.
12. Do not oversimplify into motivational slogans.
13. End with a compact “What You Should Remember” section.
14. Questions must require thought rather than copying a sentence from the lesson.
15. Primary texts should be clearly distinguished from explanatory prose.

---

# 22. Philosophical Neutrality

The app should help the learner reason rather than tell the learner what to believe.

For contested philosophical, religious, moral, and political questions:

- present major arguments
- present serious objections
- distinguish fact from interpretation
- expose assumptions
- explain tradeoffs
- allow the learner to reach a reasoned conclusion

The app can state when an argument is logically invalid or when a claim conflicts with well-established facts, but it should not manufacture false balance.

---

# 23. V1 Seed Content

Do NOT create the entire curriculum before validating the app.

Initial seed content should be enough to test the complete experience.

Create:

## Course 1 — Introduction to Philosophy

At minimum:

1. What Is Philosophy?
2. Argument vs Opinion
3. Premises and Conclusions
4. Thought Experiments
5. How to Read a Philosophical Text

## Course 2 — Critical Thinking & Informal Logic

At minimum:

1. Anatomy of an Argument
2. Deductive vs Inductive Reasoning
3. Validity and Soundness

That is enough for the first usable version.

Once the platform works well, expand the curriculum course by course.

---

# 24. Development Milestones

Codex should work milestone by milestone.

Do not try to finish the whole vision in one generation.

---

## MILESTONE 0 — Repository Audit / Initialization

If repository is empty:

- initialize project
- create frontend
- create backend
- create content directory
- create scripts
- create README
- configure dev commands

If repository already contains work:

- inspect it first
- preserve working code
- continue from current state
- do not rewrite functioning architecture without a reason

Success criteria:

```bash
npm install
npm run dev
```

starts the project successfully.

---

## MILESTONE 1 — Markdown Content Engine

Build the content model.

Requirements:

- scan `/content`
- parse Markdown frontmatter
- build curriculum hierarchy
- validate required metadata
- expose curriculum API
- expose lesson API
- render Markdown in React

Create several sample lessons.

Success criteria:

- a lesson Markdown file appears correctly in the browser
- course and lesson metadata are available
- navigation does not require hard-coded lesson arrays

---

## MILESTONE 2 — Core UI

Build:

- Home
- Curriculum
- Course
- Lesson Reader

Success criteria:

- learner can navigate from curriculum to course to lesson
- lesson typography is polished
- previous/next lesson works

---

## MILESTONE 3 — Questions

Build lesson question experience.

Requirements:

- 3–5 questions supported
- answer text areas
- local auto-save
- reveal guidance/model answer
- self-assessment

Success criteria:

- refresh browser
- typed answers remain available

---

## MILESTONE 4 — Progress

Build:

- lesson statuses
- completion
- review later
- course progress
- level progress
- overall progress
- continue learning

Success criteria:

- complete lesson
- dashboard updates immediately
- state survives browser refresh

---

## MILESTONE 5 — Review & Search

Build:

- review page
- title/tag search
- philosopher/tag filtering if simple

Success criteria:

- marked lessons appear in Review
- search returns expected lessons

---

## MILESTONE 6 — Seed Curriculum Content

Create high-quality seed lessons.

Do not auto-generate dozens of low-quality articles.

Start with the V1 seed content defined above.

Ensure each lesson follows the lesson design standard.

---

## MILESTONE 7 — Polish

Improve:

- responsive layout
- loading states
- error states
- empty states
- accessibility
- keyboard navigation
- typography
- content navigation
- README

Run tests and linting.

---

# 25. Testing Strategy

V1 does not need enormous test coverage.

Prioritize tests for important logic:

- Markdown/frontmatter parser
- curriculum ordering
- course completion calculation
- lesson completion calculation
- local progress storage
- migration/default handling when progress schema changes

Also manually test:

- page refresh
- direct lesson URL
- invalid lesson ID
- missing Markdown file
- malformed frontmatter
- very long lesson
- mobile width
- desktop width

---

# 26. Content Validation

Create a small validation script.

Example:

```bash
npm run validate-content
```

It should detect:

- duplicate IDs
- missing title
- missing course ID
- duplicate order numbers where problematic
- broken prerequisites
- missing lesson files
- malformed frontmatter
- invalid question IDs

This is important because Markdown content will grow substantially over time.

---

# 27. Accessibility

V1 should already follow basic accessibility practices:

- semantic headings
- good contrast
- keyboard-accessible controls
- visible focus states
- real buttons instead of clickable `div`s
- labels for text areas
- reasonable font size
- no essential information encoded only by color

---

# 28. Performance

V1 will be small.

Do not prematurely optimize.

Still:

- avoid loading every full lesson body on initial page load
- curriculum API should return metadata, not necessarily all lesson text
- lazy-load lesson content when opened

---

# 29. Security

Because V1 is local/personal:

- keep security simple
- validate file paths
- prevent arbitrary filesystem traversal
- do not expose server filesystem
- sanitize/handle Markdown safely
- do not execute arbitrary HTML from lesson files by default

No auth is necessary for V1 if it runs locally.

---

# 30. Future Features — DO NOT BUILD YET

Keep architecture compatible with these ideas, but do not implement them unless V1 is stable.

Possible future additions:

- user accounts
- cloud progress sync
- PostgreSQL
- AI Socratic tutor
- AI feedback on written arguments
- flashcards
- spaced repetition
- bookmarks
- highlights
- personal notes
- philosopher timeline
- concept graph
- prerequisite graph
- full-text search
- primary text reader
- bibliography manager
- citations
- downloadable notes
- essay workspace
- discussion/community
- instructor mode
- multiple curriculum tracks
- English UI
- mobile app
- PWA/offline mode
- public hosting
- subscriptions
- course certificates

Every future feature must justify the added complexity.

---

# 31. Possible Future AI Tutor

Not part of V1.

Later, each lesson could have a “Socratic Tutor” mode.

The tutor should NOT immediately answer everything.

It should:

- ask the learner to state a position
- probe assumptions
- request argument reconstruction
- generate counterexamples
- raise objections
- ask for replies
- distinguish misunderstanding from disagreement
- help improve the learner’s argument

This could eventually become one of the product’s strongest features.

But do not let AI distract from building the core learning system.

---

# 32. Definition of a Good V1

V1 is successful when I can genuinely use it for several weeks.

A successful session should look like this:

1. I open Philosophy.
2. Dashboard shows exactly where I left off.
3. I click Continue.
4. I read a clear, serious lesson.
5. I answer several questions.
6. I compare my answer with guidance.
7. I mark the lesson complete.
8. Course progress increases.
9. The next lesson becomes obvious.
10. I come back days later and everything is still there.

If this feels good, the product is working.

---

# 33. Definition of Done for Initial Release

The initial release is complete when:

- app starts with one command
- curriculum is data-driven from Markdown
- at least 2 courses exist
- at least 8 substantial lessons exist
- lesson frontmatter works
- course pages work
- lesson pages work
- Markdown is well rendered
- questions work
- answers auto-save
- model guidance can be revealed
- lesson completion works
- review later works
- dashboard progress works
- curriculum progress works
- continue learning works
- search works at least by title/tag
- desktop and mobile layouts are usable
- content validation works
- README explains how to add a course/lesson
- no major console errors
- no obvious broken routes
- no unnecessary V1 infrastructure

---

# 34. Codex Working Rules

These rules are important because the project may be developed over many Codex quota windows.

## Rule 1 — Treat this file as the source of truth

At the beginning of each work session:

1. Read `plan.md`.
2. Read `README.md`.
3. Inspect repository state.
4. Inspect git diff/status if git exists.
5. Identify the current milestone.
6. Continue from existing work.

Do not restart the project from scratch unless the repository is actually broken beyond repair.

---

## Rule 2 — Work incrementally

Complete one coherent slice at a time.

Preferred pattern:

```text
implement
→ run
→ test
→ fix
→ document
→ continue
```

Do not generate a huge amount of untested code.

---

## Rule 3 — Preserve working functionality

Before major refactoring:

- understand why existing code exists
- keep behavior working
- refactor only when the benefit is clear

Avoid “architecture churn.”

---

## Rule 4 — Keep V1 simple

If two implementations are both reasonable, prefer the simpler one.

Prefer:

- Markdown over CMS
- localStorage over database
- small APIs over elaborate service layers
- ordinary CSS over a huge design system
- a few reliable dependencies over many packages

---

## Rule 5 — Never sacrifice content model quality

The app will eventually contain many lessons.

Therefore:

- IDs must be stable
- metadata must be consistent
- curriculum ordering must be deterministic
- content validation must exist
- adding a lesson should be easy

---

## Rule 6 — Maintain a progress log

Create:

```text
docs/PROGRESS.md
```

At the end of meaningful work, update it.

Use this format:

```md
# Development Progress

## Current Milestone
Milestone X — ...

## Completed
- ...
- ...

## In Progress
- ...

## Next
1. ...
2. ...
3. ...

## Known Issues
- ...

## Important Architecture Decisions
- ...

## Last Verified Commands
- `npm run dev`
- `npm test`
- `npm run validate-content`
```

This file is critical for future `continue` sessions.

---

# 35. Codex Continue Protocol

When I later say only:

> **continue**

Codex should NOT ask what to do next unless the repository is genuinely ambiguous.

Instead:

1. read `plan.md`
2. read `docs/PROGRESS.md`
3. inspect the current code
4. inspect unfinished TODOs
5. run relevant tests
6. continue the next highest-priority unfinished item
7. fix encountered regressions
8. update `docs/PROGRESS.md`

If current milestone is complete, move to the next milestone automatically.

If the full V1 is complete, stop adding random features.

Instead:

- run a release audit
- list remaining defects
- polish the weakest part of the core experience
- improve content quality

---

# 36. Handling Codex Quota Interruptions

The project is intentionally designed to survive many separate Codex sessions.

Before a session naturally ends, whenever possible:

- keep repository runnable
- avoid leaving half-migrated architecture
- update `docs/PROGRESS.md`
- record important TODOs
- record failing tests
- record any incomplete files
- record the exact next step

A future session must be able to resume without relying on conversational memory.

**The repository is the memory.**

---

# 37. Coding Quality Expectations

Code should be:

- readable
- boring where boring is good
- modular without over-abstraction
- consistently formatted
- strongly named
- easy to modify
- easy for another Codex session to understand

Avoid:

- giant components
- mysterious utilities
- premature design patterns
- unnecessary dependency injection
- duplicated curriculum logic
- hidden global state
- deeply nested prop drilling when easily avoidable

---

# 38. Product Priority Order

When forced to choose, prioritize in this order:

1. Lesson/content quality
2. Reading experience
3. Curriculum structure
4. Progress continuity
5. Questions / active learning
6. Reliability
7. Search and review
8. Visual polish
9. Advanced features

---

# 39. First Codex Task

Start by inspecting the repository.

If empty, build the foundation for **Milestones 0 and 1**.

Specifically:

1. Initialize the Node.js + React project.
2. Create a simple Express backend.
3. Create React frontend.
4. Make one root dev command.
5. Create `/content`.
6. Implement Markdown + frontmatter parsing.
7. Define curriculum metadata types/schema.
8. Build `GET /api/curriculum`.
9. Build `GET /api/lessons/:lessonId`.
10. Create 2–3 sample Markdown lessons.
11. Render one lesson beautifully in React.
12. Add `docs/PROGRESS.md`.
13. Add a useful README.
14. Run the project and fix errors.
15. Stop only at a clean, runnable checkpoint, then continue with the next milestone if quota remains.

Do not attempt to generate the entire philosophy curriculum during the first task.

---

# 40. Final Product Standard

The final app should not feel like:

> “A website containing AI-generated philosophy summaries.”

It should feel like:

> **“A serious, coherent, multi-year philosophy education built into a beautiful personal learning system.”**

The learner should gradually become better at:

- reading
- reasoning
- questioning
- arguing
- comparing
- writing
- revising beliefs
- recognizing uncertainty
- understanding the intellectual history behind major ideas

The ultimate output of the app is not completion percentage.

The ultimate output is a better-trained mind.
