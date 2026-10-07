# Physics Lab · 物理探索室

A local bilingual physics learning app for ages 10–15, integrated into Study. V1 focuses on a readable, compact interface and five complete discovery lessons. The nine-stage roadmap follows [Plan.md](Plan.md); future stages are clearly marked as planned.

## Use

Double-click Study's `start.command` (macOS) or `start.bat` (Windows), then choose Physics. The existing launcher installs the pinned workspace dependencies when needed.

- Study entry: http://localhost:3456/physics
- Independent development: `corepack pnpm --filter @study/physics-web dev` → http://localhost:3458/physics
- The app needs no API, account, or database. Chemistry's API remains part of the existing Study launcher.

## V1

1. Physics is everywhere / 物理无处不在
2. Ask like a physicist / 像物理学家一样提问
3. Observation or explanation? / 观察，还是解释？
4. A ruler for the world / 给世界一把尺
5. Who is faster? / 谁跑得更快？ (an early preview of the motion unit)

Every lesson includes a non-scored prediction, an interactive exploration, explanation and misconceptions, worked example, two practice questions, a takeaway, an exit question, and a home experiment. Predictions can be wrong; finishing requires exploration and correct practice/exit answers, with feedback and retries.

The mini lab offers rolling resistance, measurement, robot races, and falling-ball observation. Models and playback speed are labelled. Rolling distances use constant deceleration (`s = v₀t − ½at²`, clamped at rest); races use constant speed; falling uses `s = ½gt²` with air resistance omitted. These are teaching models, not measurements of actual surfaces.

## Shared infrastructure

Reuses Chemistry's existing React 19, React Router, TypeScript, Vite and Vitest versions. Uses `@study/shared` for bilingual types and `@study/ui` for the language preference/switcher and bilingual text rendering. No new third-party libraries were added. Physics has its own package, content, styles, progress key and simulations; Chemistry-specific lessons and progress are separate. Physics is lazy-loaded from the Study hub.

## Local data

`study-physics-progress-v1` stores course position, prediction, exploration, answers, completion/review times, and up to 100 notebook entries. `study-language` is the shared language preference. Storage is validated on loading, and unavailable storage produces a visible message. Data stays in the browser profile; clearing site data removes it, and it does not sync to another device/browser. Wrong answers remain in the review queue until reviewed; completed lessons become due 24 hours after completion or the last review.

## Extend

- `apps/web/src/content/lessons.ts`: typed bilingual lesson schema, five lessons and nine-stage roadmap.
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

Physics tests cover corrupted storage, mastery gates, review timing, model calculations, and bilingual content integrity. The interface also supports reduced motion and keyboard controls.
