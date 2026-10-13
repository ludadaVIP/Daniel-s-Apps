# Study

Study is a hub for four learning apps: Physics, Chemistry, Biology, and Pinyin Detective. Chemistry is the first app. Its product plan is [chemistry/Plan.md](chemistry/Plan.md).

## Current milestone

The bilingual Study hub has separate entries for Physics, Chemistry, Biology, and Pinyin Detective. Physics now has a working foundation release: 235 bilingual discovery lessons, 234 interactive labs, local progress, a review queue, a discovery notebook, and seven field projects (Physics Detective, Walking Investigation, Mystery Materials, Stair Power, Two-cup Insulation, Periscope and Lifting Design) with saved drafts and bilingual reports. Its nine-stage curriculum roadmap follows `Physics/Plan.md`; later courses are marked as planned. See [Physics/README.md](Physics/README.md) for implementation and content-extension notes. Chemistry retains its existing courses and experiments; Biology now offers a forty-lesson bilingual pilot across “What is life?”, “Into the microscopic world”, “Plants and their secrets”, “Animals and our bodies”, “An ecosystem at your doorstep”, “Be a young scientist”, “An adventure inside cells”, “How cells exchange substances”, “Life needs energy” and “Body systems cooperate”, interactive life, scale, microscopy, cell, plant, body, ecology, inquiry, cell-organisation, substance-exchange, energy/matter and body-system relay models, local progress and recall, and a discovery notebook plus the Life Detective field project. Its six-stage roadmap retains 144 planned lesson IDs; the first forty are available. See [biology/README.md](biology/README.md) for trial steps. Pinyin Detective now includes a six-week roadmap, four complete Markdown lessons, seven exercise types, local review scheduling, a real IME keyboard lab, and parent reports. See [pinyin/README.md](pinyin/README.md) for acceptance steps and content maintenance.

## Run locally

Requires Node.js 20.19+. Double-click `start.bat` on Windows or `start.command` on macOS. The launcher checks dependencies, installs them when needed, starts Study, and opens the default browser at `http://localhost:3456`. Keep its terminal window open while using the app; press Ctrl+C to stop it (confirm `Y` if Windows asks to terminate the batch job).

The same app can be started manually with pnpm 10:

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3456` for the hub, or `http://localhost:3456/chemistry` for Chemistry, or `http://localhost:3456/physics` for Physics, or `http://localhost:3456/biology` for Biology, or `http://localhost:3456/pinyin` for Pinyin Detective. The browser port is fixed. The API health endpoint is `http://localhost:3001/health` (also proxied as `/api/health` from the hub).

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
biology/apps/web      Biology Explorer (standalone port 3460)
biology/curriculum    Twenty-eight pilot Markdown lessons and the six-stage roadmap
biology/plan.md       Biology curriculum plan
pinyin/apps/web       Pinyin Detective learner app (standalone port 3459)
pinyin/curriculum     Markdown lessons, JSON exercises and reviewed vocabulary
pinyin/plan.md        Pinyin curriculum plan
```

The shared packages contain only mechanisms that can serve multiple learning apps. In Phase 1, a common content package should own validated bilingual content loading and safe Markdown rendering. Reusable diagram primitives can go in a shared visuals package once chemistry has a concrete use case; chemistry-specific particle, atom, and periodic-table interactions stay in Chemistry. This keeps each app independent without duplicating the learning infrastructure.

The app does not currently use a database, accounts, cloud sync, or AI services.
