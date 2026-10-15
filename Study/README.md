# Study

Study is a hub for six learning apps: Physics, Chemistry, Biology, Pinyin Detective, Geography Explorer, and Math Explorer Lab. Chemistry is the first app. Its product plan is [chemistry/Plan.md](chemistry/Plan.md).

## Current milestone

The bilingual Study hub has separate entries for Physics, Chemistry, Biology, Pinyin Detective, Geography Explorer, and Math Explorer Lab. Maths now offers 106 complete bilingual B01/B02/B03/B04/B05/B06/P51/P52/P53/P54/P55/P56/P57/P61/P62/P63/P64/P65/P66/P67 lessons with a seven-question B01 review, eight-question B02/B03/B05/B06/P51/P52/P53/P54/P55/P56/P57/P61/P62/P63/P64/P65/P66/P67 reviews and family challenges, a 24-question starting-point check, fraction strips, number lines, a hundred grid, real-denomination money models, word-problem bars, two-step plans, relevance checks, equivalent arithmetic steps, factor arrays and GCF/LCM lists, exact fraction addition/subtraction with genuine partitions and two-step water models, algebra balances, constructed growing patterns and exact one-step equations, area-preserving geometry dissections and full cube layers, box nets and bounding-sheet comparisons, frequency records with missing responses, exact fair-share means, proportional time-series charts with explicit gaps, chart-evidence checks and whole-pack recipe budgets, fixed-reference fraction products and labelled equal sharing, equal-piece fraction division with exact group counts and reciprocal reasoning, proportional hundred grids with partial cells and exact recurring percentages, direct/inverse percentage quantities and changing-base price models, ordered and simplest-ratio checks, conserved fractional allocations, recipe ratio tables, zoom-consistent fictional map scales and evidence-based direct-proportion graphs, signed Celsius scales and equal-unit integer lines, staged cross-zero addition/subtraction with inverse checks, zero-distance and reflected-point models, consistent letter substitution, constructed nth terms, exact equivalent-expression checks and reversible bracket-equation investigations, centre-based circle segments, labelled simulated pi readings, exact pi quantities, area-preserving curved-sector rearrangements and common-scale cylinder nets, ordered medians and complete mode sets, purpose-based summary comparisons, conditional event probabilities and reproducible spinner frequency records, exact equivalent-answer checks, local progress and review, parent reasoning review and export. Its roadmap retains 358 lesson IDs across nine stages; 252 are planned. See [math/README.md](math/README.md) for trial steps. Geography now includes forty complete bilingual lessons (GEO-001–040), real local Earth and South Island imagery with source and reuse records, world-map label placement, view comparison, rotating direction/route models, scale-bar zoom, coordinate exploration, dated city clocks and controlled tilt/daylight models, landform sections, consistent contour/profile views, connected drainage tasks and a source-traceable 1991–2020 NOAA air-temperature map, land-use photo comparisons, a New Zealand feature map, evidence detective cases, an exportable S1 personal atlas, Earth-layer assembly, plate-motion models, historical USGS earthquake observations, three volcanic settings, mountain-building and surface-height budgets, a branching rock-process network, real historical river-image comparison, conditional river-journey sorting, opposite-bank meander and floodplain investigations, glacier flow versus terminus movement, reversible coastal drift and sediment budgets, soil-profile assembly and shared water/air pores, branching water-cycle journeys, source-traceable NOAA monthly SST comparisons, selected GeoNet quake layers, an exportable S2 landscape report, historical daily precipitation versus 30-year climatology, atmospheric layers and conserved radiative budgets, pressure-gradient/hemisphere comparisons, wet/dry cloud-base investigations, reversible windward/lee rainfall models, latitude/season sunlight comparisons, South Asian monsoon evidence, hot/cold desert investigations with source-traceable GPCP precipitation, local learning records, recall, and an exportable discovery notebook with family feedback. Its six-stage roadmap retains all 96 lesson IDs; the remaining 56 lessons are planned. See [geograph/README.md](geograph/README.md) for acceptance steps. Physics now has a working foundation release: 235 bilingual discovery lessons, 234 interactive labs, local progress, a review queue, a discovery notebook, and seven field projects (Physics Detective, Walking Investigation, Mystery Materials, Stair Power, Two-cup Insulation, Periscope and Lifting Design) with saved drafts and bilingual reports. Its nine-stage curriculum roadmap follows `Physics/Plan.md`; later courses are marked as planned. See [Physics/README.md](Physics/README.md) for implementation and content-extension notes. Chemistry retains its existing courses and experiments; Biology now offers a forty-lesson bilingual pilot across “What is life?”, “Into the microscopic world”, “Plants and their secrets”, “Animals and our bodies”, “An ecosystem at your doorstep”, “Be a young scientist”, “An adventure inside cells”, “How cells exchange substances”, “Life needs energy” and “Body systems cooperate”, interactive life, scale, microscopy, cell, plant, body, ecology, inquiry, cell-organisation, substance-exchange, energy/matter and body-system relay models, local progress and recall, and a discovery notebook plus the Life Detective field project. Its six-stage roadmap retains 144 planned lesson IDs; the first forty are available. See [biology/README.md](biology/README.md) for trial steps. Pinyin Detective now includes a six-week roadmap, four complete Markdown lessons, seven exercise types, local review scheduling, a real IME keyboard lab, and parent reports. See [pinyin/README.md](pinyin/README.md) for acceptance steps and content maintenance.

## Run locally

Requires Node.js 20.19+. Double-click `start.bat` on Windows or `start.command` on macOS. The launcher checks dependencies, installs them when needed, starts Study, and opens the default browser at `http://localhost:3456`. Keep its terminal window open while using the app; press Ctrl+C to stop it (confirm `Y` if Windows asks to terminate the batch job).

The same app can be started manually with pnpm 10:

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3456` for the hub, or `http://localhost:3456/chemistry` for Chemistry, or `http://localhost:3456/physics` for Physics, or `http://localhost:3456/biology` for Biology, or `http://localhost:3456/pinyin` for Pinyin Detective, or `http://localhost:3456/geography` for Geography Explorer, or `http://localhost:3456/math` for Math Explorer Lab. The browser port is fixed. The API health endpoint is `http://localhost:3001/health` (also proxied as `/api/health` from the hub).

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
geograph/apps/web     Geography Explorer (standalone port 3461)
geograph/content      Four complete Markdown lessons and the 96-lesson roadmap
geograph/Plan.md      Geography curriculum plan (folder spelling retained)
math/apps/web        Math Explorer Lab (standalone port 3462)
math/content         106 B01/B02/B03/B04/B05/B06/P51/P52/P53/P54/P55/P56/P57/P61/P62/P63/P64/P65/P66/P67 Markdown lessons and the 358-lesson roadmap
math/plan.md         Maths curriculum plan
```

The shared packages contain only mechanisms that can serve multiple learning apps. In Phase 1, a common content package should own validated bilingual content loading and safe Markdown rendering. Reusable diagram primitives can go in a shared visuals package once chemistry has a concrete use case; chemistry-specific particle, atom, and periodic-table interactions stay in Chemistry. This keeps each app independent without duplicating the learning infrastructure.

The app does not currently use a database, accounts, cloud sync, or AI services.
