# Study

Study is a hub for three independent learning apps: Physics, Chemistry, and Biology. Chemistry is the first app. Its product plan is [chemistry/Plan.md](chemistry/Plan.md).

## Current milestone

The bilingual Study hub has separate entries for Physics, Chemistry, and Biology. Chemistry currently has a home screen and path preview; Physics and Biology have preview pages while their independent apps are planned. The chemistry lessons, quizzes, mastery, and review will be added in the later phases defined in `Plan.md`. The chemistry path page is a preview, not an interactive course yet.

## Run locally

Requires Node.js 20.19+. Double-click `start.bat` on Windows or `start.command` on macOS. The launcher checks dependencies, installs them when needed, starts Study, and opens the default browser at `http://localhost:3456`. Keep its terminal window open while using the app; press Ctrl+C to stop it (confirm `Y` if Windows asks to terminate the batch job).

The same app can be started manually with pnpm 10:

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3456` for the hub, or `http://localhost:3456/chemistry` for Chemistry. The browser port is fixed. The API health endpoint is `http://localhost:3001/health` (also proxied as `/api/health` from the hub).

Quality checks:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm format:check
```

## Workspace boundaries

```text
packages/shared       Subject-neutral types and language helpers
packages/ui           Subject-neutral interface components
apps/hub              Study hub and subject navigation (port 3456)
chemistry/apps/web    Chemistry learner interface
chemistry/apps/server Chemistry API
chemistry/Plan.md     Chemistry product and curriculum plan
physics/              Future independent physics app
biology/              Future independent biology app
```

The shared packages contain only mechanisms that can serve all three subjects. In Phase 1, a common content package should own validated bilingual content loading and safe Markdown rendering. Reusable diagram primitives can go in a shared visuals package once chemistry has a concrete use case; chemistry-specific particle, atom, and periodic-table interactions stay in Chemistry. This keeps each app independent without duplicating the learning infrastructure.

The app does not currently use a database, accounts, cloud sync, or AI services.
