# Physics Lab · 物理探索室

A local bilingual physics learning app for ages 10–15, integrated into Study. The current version has a compact interface, twenty complete bilingual lessons, nineteen exploration stations and a Physics Detective field project. The nine-stage roadmap follows [Plan.md](Plan.md); future stages are clearly marked as planned.

## Use

Double-click Study's `start.command` (macOS) or `start.bat` (Windows), then choose Physics. The existing launcher installs the pinned workspace dependencies when needed.

- Study entry: http://localhost:3456/physics
- Independent development: `corepack pnpm --filter @study/physics-web dev` → http://localhost:3458/physics
- The app needs no API, account, or database. Chemistry's API remains part of the existing Study launcher.

## Available courses

The foundation path follows Appendix A of the plan:

1. Physics is everywhere / 物理无处不在
2. Ask like a physicist / 像物理学家一样提问
3. Observation or explanation? / 观察，还是解释？
4. What can we measure? / 什么可以测量？
5. Different numbers, same string? / 数字换了，绳子变了吗？
6. A ruler for the world / 给世界一把尺
7. Time one swing or ten? / 测一次，还是十次？
8. Which object has more mass? / 大块头一定更重吗？
9. Is colder to touch really colder? / 摸起来更冷，温度就更低吗？
10. Keep every reading / 让每次读数都有位置
11. Read a walking story / 用一条线讲走路的故事
12. Two changes: can we identify the cause? / 改了两件事，能找到原因吗？
13. How much of an iceberg is hidden? / 冰山藏起了多少？
14. Can the same clay become a boat? / 同一团泥，能变成船吗？
15. How does the ball come back up? / 球怎么又回来了？
16. How far does an echo travel? / 声音走了多远才回来？
17. Is another you really behind the mirror? / 镜子后面真有另一个你吗？
18. Why does a balloon approach a neutral wall? / 墙没带电，气球怎么还靠过来？
19. Why does your body keep moving when the car stops? / 车停了，身体为什么还想向前？
20. Who is faster? / 谁跑得更快？ (the first motion lesson)

Each lesson includes a non-scored prediction, interactive exploration, explanation and misconceptions, a worked example, two or three practice questions, a takeaway, an exit question, and a home experiment. Predictions can be wrong; finishing requires exploration and correct practice/exit answers, with feedback and retries. Lessons are grouped by stage and unit. Counts and next-lesson links follow the content list; stable IDs preserve earlier progress when courses are inserted.

The mini lab offers rolling resistance, tool matching, equivalent length units, ruler measurement, repeated swing timing, a balance, a temperature mystery, data records, a walking graph, an iceberg tank, a clay-boat challenge, a first-bounce station, an echo explorer, robot races, falling-ball observation, a fair-test bench, mirror ray construction, wall polarization, and an inertia toy vehicle. No additional runtime library is needed for these SVG interactions.

Models and playback speed are labelled. Rolling uses constant deceleration (`s = v₀t − ½at²`, clamped at rest); races use constant speed; falling uses `s = ½gt²` with air resistance omitted. The timing model has a 2 s full cycle and a configurable stop-button delay, played at 10× speed. The balance is an ideal equal-arm balance with preset object masses. The temperature model assumes room-temperature equilibrium and warmer skin. Data examples are explicitly preset teaching readings, not measurements or live-model results. Walking graphs show forward travel; a horizontal distance segment represents a pause, not a flat road.

Floating compares object mass with displaced water mass. The clay boat excludes 300 cm³ while dry; after flooding, only its solid clay and steel cargo displace water. Bounce height follows the square of the preset restitution ratio; playback stops after one rebound. Echo time uses the full outward-and-return path at 343 m/s in dry air near 20°C. All four mysteries label their assumptions, approximations and animation speeds.

The fair-test bench keeps launch speed fixed to compare stopping distances. Plane-mirror construction uses equal object/image distances and equal ray angles; dashed extensions represent the virtual image. The balloon station conserves neutral wall charge and shows qualitative polarization, without predicting real clinging. The seat-belt toy uses a stated ground frame and stops before modeling collision forces.

The Physics Detective project (`/physics/project/detective`) offers ten bilingual prompts for observations, questions, predictions, a fair plan, results and an evidence-based explanation. Drafts save locally and export as bilingual Markdown. Planning/completion badges indicate filled records, not scientific correctness or proven understanding; inconclusive outcomes are welcome.

For completed content, plan mapping, and remaining work, see [CONTENT_PROGRESS.md](CONTENT_PROGRESS.md).

## Shared infrastructure

Reuses Chemistry's existing React 19, React Router, TypeScript, Vite and Vitest versions. Uses `@study/shared` for bilingual types and `@study/ui` for the language preference/switcher and bilingual text rendering. No new third-party libraries were added. Physics has its own package, content, styles, progress key and simulations; Chemistry-specific lessons and progress are separate. Physics is lazy-loaded from the Study hub.

## Local data

`study-physics-progress-v1` stores course position, prediction, exploration, answers, completion/review times, up to 100 notebook entries, and the Physics Detective draft. `study-language` is the shared language preference. Storage is validated on loading, and unavailable storage produces a visible message. Data stays in the browser profile; clearing site data removes it, and it does not sync to another device/browser. Wrong answers remain in the review queue until reviewed; completed lessons become due 24 hours after completion or the last review.

## Extend

- `apps/web/src/content/schema.ts`: typed bilingual lesson and assessment schema.
- `apps/web/src/content/lessons.ts`: ordered lessons, unit labels and nine-stage roadmap.
- `apps/web/src/content/measurement.ts`: measurement and data lesson content.
- `apps/web/src/content/mysteries.ts`: everyday floating, boats, bounce and echo lessons.
- `apps/web/src/content/discoveries.ts`: fair comparison, mirror, polarization and inertia lessons.
- `apps/web/src/ProjectPage.tsx` and `projects.ts`: field-project interface, validation and export.
- `apps/web/src/content/experiments.ts`: exploration-station catalog.
- `apps/web/src/interactive/`: physical models and interactive SVG labs.
- `apps/web/src/progress.ts`: validated persistence and review scheduling.
- `apps/web/src/LessonPage.tsx`: common five-step lesson template.
- `apps/web/src/App.tsx`: dashboard, path, lab, notebook and review.
- `apps/web/src/styles.css`: scoped visual system and responsive layouts.

Add content using the same schema and reuse the common lesson template. Avoid duplicating the interface per course. V1 uses plain text for simple formulas; introduce a shared math renderer when later courses need complex notation.

## Checks

From Study:

```sh
corepack pnpm -r --if-present typecheck
corepack pnpm -r --if-present test
corepack pnpm -r --if-present build
npm run lint
npm run format:check
```

Physics tests cover corrupted storage, mastery gates, review timing, model calculations, equivalent units, repeated timing, consistent graph/table/track data, course ordering, preserved V1 completions, and bilingual content integrity. The interface also supports reduced motion and keyboard controls.
