# Study

Study is a hub for three independent learning apps: Physics, Chemistry, and Biology. Chemistry is the first app. Its product plan is [chemistry/Plan.md](chemistry/Plan.md).

## Current milestone

The bilingual Study hub has separate entries for Physics, Chemistry, and Biology. Physics now has a working V1: twenty bilingual discovery lessons, nineteen interactive labs, local progress, a review queue, a discovery notebook, and a Physics Detective project with saved drafts and bilingual report export. Its nine-stage curriculum roadmap follows `Physics/Plan.md`; later courses are marked as planned. See [Physics/README.md](Physics/README.md) for implementation and content-extension notes. Chemistry retains its existing courses and experiments; Biology remains a preview.

## Run locally

Requires Node.js 20.19+. Double-click `start.bat` on Windows or `start.command` on macOS. The launcher checks dependencies, installs them when needed, starts Study, and opens the default browser at `http://localhost:3456`. Keep its terminal window open while using the app; press Ctrl+C to stop it (confirm `Y` if Windows asks to terminate the batch job).

The same app can be started manually with pnpm 10:

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3456` for the hub, or `http://localhost:3456/chemistry` for Chemistry, or `http://localhost:3456/physics` for Physics. The browser port is fixed. The API health endpoint is `http://localhost:3001/health` (also proxied as `/api/health` from the hub).

Quality checks:

```bash
corepack pnpm -r --if-present typecheck
npm run lint
corepack pnpm -r --if-present test
corepack pnpm -r --if-present build
npm run format:check
```

## Workspace boundaries

```text
packages/shared       Subject-neutral types and language helpers
packages/ui           Subject-neutral interface components
apps/hub              Study hub and subject navigation (port 3456)
chemistry/apps/web    Chemistry learner interface
chemistry/apps/server Chemistry API
chemistry/Plan.md     Chemistry product and curriculum plan
Physics/apps/web     Physics learner app (also independent on port 3458)
Physics/Plan.md       Physics curriculum plan
biology/              Future independent biology app
```

The shared packages contain only mechanisms that can serve all three subjects. In Phase 1, a common content package should own validated bilingual content loading and safe Markdown rendering. Reusable diagram primitives can go in a shared visuals package once chemistry has a concrete use case; chemistry-specific particle, atom, and periodic-table interactions stay in Chemistry. This keeps each app independent without duplicating the learning infrastructure.

The app does not currently use a database, accounts, cloud sync, or AI services.
