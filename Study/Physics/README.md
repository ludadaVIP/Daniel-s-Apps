# Physics Lab · 物理探索室

A local bilingual physics learning app for ages 10–15, integrated into Study. The current version has a compact interface, fifty-nine complete bilingual lessons, fifty-eight exploration stations and four field projects: Physics Detective, Walking Investigation, Mystery Materials and Stair Power. The nine-stage roadmap follows [Plan.md](Plan.md); future stages are clearly marked as planned.

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
20. No straight edges: how big is the stone? / 石头没有直边，怎么量大小？
21. Always the same: always correct? / 每次都一样，就一定量对了吗？
22. Three different readings: which counts? / 三次不一样，哪个才算数？
23. Too thin? Let a hundred sheets help. / 一张纸太薄？让一百张帮忙。
24. Not walking, yet moving? / 你没走，为什么也在移动？
25. Back at the start: no walking? / 回到原点，真的没走路吗？
26. Who is faster? / 谁跑得更快？
27. Fast out, slow back: what is the average? / 去得快，回来慢，平均怎么算？
28. A line slopes down: walking underground? / 线往下走，是人往地下走吗？
29. What does a push actually change? / 推一下，究竟改变了什么？
30. Pulled equally: must the cart be still? / 两边都在拉，车一定停着吗？
31. Pushed but still: what is friction doing? / 推了却没动，摩擦在做什么？
32. Same paper: why does crumpling change its fall? / 同一张纸，揉一下就落得更快？
33. One backpack: do 1 kg and 10 N mean the same thing? / 背包的1 kg，和10 N说的是一回事吗？
34. On the Moon, does your backpack contain less? / 去月球，背包真的“变少”了吗？
35. More gravity on the heavy ball: why no head start? / 重球的重力更大，为什么没先到？
36. Same size: why do they feel different? / 一样大，为什么拿起来不一样？
37. How does a 54 g block become a material clue? / 54 g的积木，怎样变成一个材料线索？
38. An irregular shape: can you still find its material clue? / 形状不规则，材料线索还能量出来吗？
39. Same solid: new water, new outcome? / 同一块材料，换水就不沉了？
40. The lamp lights up. Where does battery energy go? / 灯亮起来，电池里的能量去哪了？
41. Look for changes, then follow an energy ledger. / 从变化找能量，从账本找去向。
42. Double the cart’s speed. Only double its energy? / 小车速度翻倍，动能也只翻倍吗？
43. Hold one quantity fixed; compare mass and speed. / 保持一个量不变，比较质量与速率。
44. A book rests on a shelf. Where is its energy clue? / 书在架子上没动，为什么也有能量线索？
45. Look at the object–Earth pair, height changes and the chosen zero. / 看物体与地球，看高度差和约定的零点。

46. Holding a bag is tiring. Does the lifting force do work on it? / 提着书包很累，提力一定对它做功了吗？
47. Double the force or extend the distance: how does work change? / 推力翻倍，还是距离加长：功怎样比较？
48. Two hoists do the same work. Which has greater power? / 两台升降机做同样的功，谁的功率更大？
49. How can you estimate your mechanical power on stairs? / 上楼的你，怎样估算机械功率？
50. A ramp needs less force. Does it also need less work? / 斜坡让搬货省力，也会省功吗？

51. Both at 20°C: must a larger gas sample have the same internal energy? / 同样20℃，大盒气体的内能一定和小盒一样吗？
52. Same energy: why does the smaller water sample warm more? / 同样的能量，为什么小杯水升温更多？
53. Can you warm without touching the heat source? / 没有碰到热源，也能变暖吗？
54. Does an insulated cup create warmth or slow change? / 保温杯会制造温暖，还是减慢变化？
55. Without boiling, why can a wet cloth cool? / 水没有沸腾，湿布为什么也会变凉？

56. The ice is melting. Why is its temperature not rising? / 冰在融化，温度怎么没升？
57. The water is boiling. What does more heating change? / 水已经沸腾，再供热会发生什么？
58. The cup is not leaking. Where do outside droplets come from? / 杯子没漏，外壁水珠从哪里来？
59. Does a flat heating curve mean energy input has paused? / 加热曲线的平段，能量暂停了吗？

Each lesson includes a non-scored prediction, interactive exploration, explanation and misconceptions, a worked example, two or three practice questions, a takeaway, an exit question, and a home experiment. Predictions can be wrong; finishing requires exploration and correct practice/exit answers, with feedback and retries. Lessons are grouped by stage and unit. Counts and next-lesson links follow the content list; stable IDs preserve earlier progress when courses are inserted.

The mini lab offers rolling resistance, tool matching, equivalent length units, ruler measurement, repeated swing timing, a balance, a temperature mystery, data records, a walking graph, an iceberg tank, a clay-boat challenge, a first-bounce station, an echo explorer, robot races, falling-ball observation, a fair-test bench, mirror ray construction, wall polarization, and an inertia toy vehicle. The junior measurement stations add water displacement, ruler calibration, repeated-reading evidence, and indirect paper-thickness measurement. No additional runtime library is needed for these SVG interactions.

Models and playback speed are labelled. Rolling uses constant deceleration (`s = v₀t − ½at²`, clamped at rest); races use constant speed; falling uses `s = ½gt²` with air resistance omitted. The timing model has a 2 s full cycle and a configurable stop-button delay, played at 10× speed. The balance is an ideal equal-arm balance with preset object masses. The temperature model assumes room-temperature equilibrium and warmer skin. Data examples are explicitly preset teaching readings, not measurements or live-model results. Walking graphs show forward travel; a horizontal distance segment represents a pause, not a flat road.

Floating compares object mass with displaced water mass. The clay boat excludes 300 cm³ while dry; after flooding, only its solid clay and steel cargo displace water. Bounce height follows the square of the preset restitution ratio; playback stops after one rebound. Echo time uses the full outward-and-return path at 343 m/s in dry air near 20°C. All four mysteries label their assumptions, approximations and animation speeds.

The fair-test bench keeps launch speed fixed to compare stopping distances. Plane-mirror construction uses equal object/image distances and equal ray angles; dashed extensions represent the virtual image. The balloon station conserves neutral wall charge and shows qualitative polarization, without predicting real clinging. The seat-belt toy uses a stated ground frame and stops before modeling collision forces.

The Physics Detective project (`/physics/project/detective`) offers ten bilingual prompts for observations, questions, predictions, a fair plan, results and an evidence-based explanation. Drafts save locally and export as bilingual Markdown. Planning/completion badges indicate filled records, not scientific correctness or proven understanding; inconclusive outcomes are welcome.

Walking Investigation (`/physics/project/walking`) follows Stage 1 Unit 1.2: compare 5, 10 and 20 m walks, with three timed trials at each distance. The child records a fair plan, every raw reading, procedure notes, a separate 10 m journey's elapsed checkpoint times, and an evidence-based explanation. Additional trials retain originals, up to twelve per distance. An exclusion requires a reason and is reversible; incomplete reasons leave readings in the summary. Each group needs at least three used readings for its record badge. Mean time, range and pooled speed are derived from the entered readings, with raw means also retained. The range is not treated as full measurement uncertainty, nor are rounded displays claims of instrument precision.

Walking graphs separate unconnected independent-trial dots from one journey's elapsed-time checkpoints. Dashed checkpoint connections are approximations, not proof of constant speed or the location of pauses. Constructed example data are read-only and do not populate the child's draft. Bilingual Markdown reports retain every reading, exclusions and derived results; a report preview is available on the page. This project is a record tool, not an automatic verification of measurements or explanations.

Junior measurement labels preset data and instrument limits. Volume requires full immersion and compares cylinder change with block geometry. Calibration distinguishes resolution, repeatability and bias. The evidence board retains every original reading even after flagging a confirmed procedure problem. The paper model divides a stack reading and fixed endpoint error by sheet count, without claiming that stacking eliminates compression or gaps.

The four new motion stations compare train/ground reference frames, distance versus displacement, whole-trip average speed with a pause, and position–time versus accumulated-distance–time graphs. Coordinates, units and the positive direction are labelled. The train moves at 2 m/s; walking is ±1 m/s relative to its carriage. The average-speed trip uses unequal segment speeds, while the graph trip explicitly uses 2 m/s in both directions with a 2 s pause. These prescribed models idealize starts, stops and reversal; they are not the child's real walking measurements. Average speed includes pause time; zero displacement does not imply zero distance or speed.

The force stations compare cart motion and spring deformation, opposing collinear pulls on one cart, static/sliding friction, and equal-mass paper drops with/without air. Cart and block mass is 2 kg; events span 2 s at 2× playback. Static friction adjusts up to 3 N; sliding friction is 2 N, with motion reassessed at stopping rather than continuing backwards under friction alone. The spring uses a static linear model, natural length 20 cm and stiffness 40 N/m. Paper drops use the same 5 g mass and 20 m virtual height, with g≈10 m/s² and prescribed linear drag coefficients; real flutter is not modeled. Playback ends at first contact, omitting impact. The height is for screen comparison; home investigations use a low release. Zero net force preserves motion and is not confused with zero velocity.

The gravity stations cover the six introductory topics in Unit 1.4 through three connected investigations. Compare an equal-arm balance with a stationary hanging force meter; move matching backpacks between Earth and Moon; compare 0.1/1 kg balls in ideal no-air falls. Local g is prescribed as 10 N/kg on Earth and 1.6 N/kg on the Moon (equivalently m/s² for free-fall acceleration). A separate example Earth-calibrated spring scale converts force using Earth g, clearly separating its labelled kg reading from actual mass. Falling is from 5 m at rest, with 1× playback ending at first contact; a time slider does not count as completing a release. Ball sizes are schematic; collision and support forces after landing are omitted. Home observations use low heights and are not vacuum experiments.

The four density stations compare equal-volume materials, calculate regular-block density in two unit systems, preserve displacement readings under valid and invalid conditions, and compare solid/liquid densities. Prescribed samples use wood 0.6, aluminium 2.7 and steel 7.8 g/cm³. Regular volume reuses the three-edge geometry model; irregular volume reuses water displacement. A 54 g specimen has full volume 20 cm³, with partial immersion displacing only 12 mL and an attached bubble adding 4 mL. Apparent density is distinguished from a valid specimen measurement. The floating model reuses static displacement balance for 20 cm³ solids in fresh water 1.00 and salt water 1.05 g/cm³. Equal density permits full neutral immersion at an illustrative depth. The one-second animation shows a transition to the final state, not a prediction of fluid motion. Mystery Materials now connects these comparisons to the learner’s own measurements.

Mystery Materials (`/physics/project/materials`) follows Unit 1.5 through four compact steps: prepare, readings, clues and explanation. Up to four specimens each retain two to six mass/volume trials. Volume comes from three edges or water-level change using the existing geometry/displacement models. Changing method keeps old fields but requires checking volume conditions again. Only checked, unexcluded paired readings enter the used summary; reasoned exclusions retain originals. Summary density is mean mass / mean volume, not the mean of trial densities. Each specimen needs a name, at least two usable readings, observations, a judgment and uncertainty; shared planning is also required for the whole-project record badge.

Four prescribed teaching samples provide comparison densities, not natural-material ranges or an automatic identity result. Relative differences have no identification-success threshold. The learner may conclude that identity remains uncertain. Read-only examples never populate drafts. Bilingual report exports and previews retain all raw fields, procedure checks, exclusions and explanations; report UI is shared with Walking Investigation. Native file delivery remains unverified in the in-app browser, while the report payload and preview have been checked.

The six energy stations connect battery transfers, kinetic energy, gravitational reference height, elastic release, ideal conservation and dissipation/efficiency. Bars use a fixed shared joule scale. Battery values track a prescribed 12 J portion, including cumulative light carried out rather than light stored in the lamp. Mass/speed comparisons use Ek=½mv². Book–Earth values use g=10 N/kg and Eg=mg(h−h₀), allowing negative reference labels while keeping descent differences unchanged. Spring release uses a 0.5 kg cart and linear spring, stopping inspection at the first natural-length crossing with nonzero velocity; playback is 10× slower than model time. Full lamp observations and spring releases are required; slider seeking does not count.

Track circles are position probes, and inspection scans are not predictions of travel time. A nonrotating 1 kg slider starts from 1 m with 10 J. Ideal mechanical energy remains 10 J. The prescribed rough teaching ledger adds 4u J to internal energy along position index u and reaches its first return at u=0.9, height 0.64 m: 6.4 J mechanical plus 3.6 J internal-energy increase. It does not infer a real friction coefficient. Efficiency is 64% for the explicitly defined task of raising the cart again; warming can be useful for other tasks. Conditions are available in each lab, with a visible teaching-model label.

The five work/power stations start with tired arms, pushing boxes, hoists, stairs and ramps. Named constant forces and ground-frame displacement distinguish positive, zero and negative work. The constant-force rectangle uses displacement rather than time; an explicitly prescribed balancing sliding resistance keeps the steady box’s net work zero. Two hoists share an observation clock but each task’s average mechanical power uses its own duration, including when the faster hoist subsequently waits. Seeking on the clock does not count as a complete observation.

Stair power estimates use prescribed total mass, vertical rise and same-ascent time at g=10 N/kg. Mechanical output is not bodily chemical-energy consumption, health or fitness scoring. The separate Stair Power field project records the learner’s own measurements. Ramp comparisons use a nonrotating 2 kg load rising 1 m: direct, short and long ideal paths all require 20 J. Prescribed 2 N friction over 4 m changes input to 28 J, useful rise to 20 J, internal increase to 8 J and defined-task efficiency to 71.4%. Animation illustrates paths, not task duration; readouts explicitly describe complete tasks. Energy and work labs share the same joule-bar rendering without adding libraries.

Stair Power (`/physics/project/power`) follows Unit 2.2 through four steps: prepare, rise/mass, ascent times, and explanation/report. Count vertical risers, retain at least two height readings at different positions on an approximately equal-riser flight, enter the same total mass in kg and record at least three checked ascent times. The project uses g≈10 N/kg and h≈count×mean riser cm/100. Ordinary walking with a helper provides evidence without a fastest-time competition. Unequal flights require a different measurement procedure; the app does not silently treat a sloping path as vertical height.

Up to twelve height and twelve time records retain notes, checked conditions and reversible exclusions. Pending reasons leave valid checked readings in the summary but prevent the complete-record badge. Raw numeric means include unchecked and excluded values; used means do not. Summary mechanical power is summed mgh for identical tasks / summed used times, equal to mgh / mean used time, not an arithmetic mean of individual powers. Changing mass, riser count or height readings resets ascent confirmations without erasing original times; changing route or timing procedure also requests reconfirmation. Independent-ascent bars keep excluded/unchecked values visible and do not imply one continuous journey. Reports and previews retain all originals, reasons, means and model limitations. This estimates gravitational mechanical output, not chemical-energy consumption, fitness or health. The record badge indicates completed fields, not verified measurements or mastery.

Five thermal stations introduce Unit 2.3 through gas particles, water heating, transfer paths, insulated cups and a wet cloth. The same ideal monatomic gas compares temperature and quantity using absolute temperature; doubling Celsius does not double kinetic energy. Gas dots depict relative particle number and thermal motion, with animation time explicitly schematic. Water uses c≈4200 J/(kg·°C), starts at 20°C and remains liquid; input is energy absorbed by water, not plug electricity. Q and the water’s internal-energy increase describe the same transfer here and must not be added.

Conduction, convection and radiation diagrams explain different mechanisms without claiming quantitative heating rates. Convection markers represent moving fluid parcels; radiation includes emission and absorption in both directions with net transfer from hotter to cooler. Real situations can combine pathways. The cup model uses the same water heat capacity of 420 J/°C, prescribed conductances 0.70/0.14 W/°C, a constant-temperature room and a shared 0–10 min clock. Only the elapsed parts of curves appear; seeking does not count as a complete comparison. Insulation slows both cooling and warming. The 2.5-second animation represents ten model minutes, not a real warming time.

The wet-surface model prescribes net rates 0/0.10/0.20 g/min for five minutes, with 2 g starting water, 20°C room, fixed effective heat capacity 200 J/°C, conductance 0.5 W/°C and approximate vaporisation energy 2400 J/g. It tracks remaining water, surface temperature, cumulative evaporation energy and signed internal-energy change. Room input equals evaporation energy plus the signed surface change. Rates are not predictions of wind/humidity; real air movement can also change convection. The model ends while wet and is not a bodily cooling or drying-time model. Melting, boiling and phase-change curves are extended by the four stations below. All five courses include three practice questions, a transfer exit and a home observation.

Four phase-change stations extend Unit 2.3. The fusion ledger compares 50/100 g ice absorbing 16.70 kJ and 50/100 g water releasing it, all at 0°C. Pure water, near normal atmospheric pressure and uniform equilibrium are prescribed; supercooling, impurities, container storage and small volume work are omitted. L≈334 J/g gives 50 g changed in each case. The strip depicts mass fractions rather than volumes. Signed transfer is distinguished from an exact internal-energy change.

The boiling station starts at 100°C and uses L≈2260 J/g: 20 g receiving 11.30/22.60 kJ vaporises 5/10 g; 40 g receiving 22.60 kJ vaporises 10 g. Remaining liquid plus escaped vapour retains the original mass. Bubbles represent vapour, not air; dots symbolise invisible gas, not white mist droplets. Pressure-dependent boiling conditions, evaporation below boiling, and state change without molecular decomposition are explained. Home work uses sketches and screen comparisons without boiling water.

The sealed-cup station prescribes 25°C air and compares surface/dew-point pairs 8/15, 8/5 and 22/15°C. Only the first supports new net condensation. Dew point is an input, not calculated humidity; initially dry surfaces remain above freezing. Droplet count, animation time and vapour dots are schematic. No amount or condensation time is predicted, and pre-existing droplets are distinguished from new condensation.

Heating curves follow pure ice at −10°C through a 0°C melting plateau to water at 20°C. The 20 g/50 W, 20 g/100 W and 40 g/50 W cases share fixed 0–360 s and −10–20°C axes. Only elapsed curve vertices are drawn; seeking does not replace complete playback. Net absorbed power is prescribed and each model duration is compressed into 2.5 seconds. Three separate energy uses retain a shared 0–17.56 kJ bar scale. Ice/water heat capacities are 2.1/4.2 J/(g·°C). Same-mass doubled power halves all stage times without changing 8.78 kJ total; doubled mass needs 17.56 kJ. These are ideal sample times, not appliance or thawing predictions. A temperature–time area is not treated as energy. All four courses include three practice questions, a transfer exit and a home activity. The learner-entered insulation investigation remains the next field project.

Lesson bodies and assessments load in thirteen content groups only when opening a course or review card. Home, path and progress use a generated lightweight catalog with titles, order and assessment bounds/answer keys, without importing the bilingual bodies. Completed records are validated before any body loads. Content is cached by group, concurrent readers share a request, and mismatched catalog/content is rejected. Loading/failure states retain saved work; the retry button reopens the current page, allowing browser module failures to recover. Tests enforce catalog/body parity and existing progress invariants.

The standalone initial JavaScript is about 428 kB (previously 581 kB), and the Study Physics entry about 166 kB (previously 318 kB). Body groups are about 18–36 kB. These are minified build output sizes, not measured device loading times. Physics no longer triggers the standalone 500 kB warning; Chemistry’s existing warning remains.

Interactive station groups and the field projects also load on demand; the hub separately lazy-loads Physics. Bilingual preparation states appear while content is loading.

For completed content, plan mapping, and remaining work, see [CONTENT_PROGRESS.md](CONTENT_PROGRESS.md).

## Shared infrastructure

Reuses Chemistry's existing React 19, React Router, TypeScript, Vite and Vitest versions. Uses `@study/shared` for bilingual types and `@study/ui` for the language preference/switcher and bilingual text rendering. No new third-party libraries were added. Physics has its own package, content, styles, progress key and simulations; Chemistry-specific lessons and progress are separate. Physics is lazy-loaded from the Study hub.

## Local data

`study-physics-progress-v1` stores course position, prediction, exploration, answers, completion/review times, up to 100 notebook entries, the Physics Detective draft, the bounded Walking Investigation draft, the bounded Mystery Materials draft, and the bounded Stair Power draft. `study-language` is the shared language preference. Storage is validated on loading, and unavailable storage produces a visible message. Data stays in the browser profile; clearing site data removes it, and it does not sync to another device/browser. Wrong answers remain in the review queue until reviewed; completed lessons become due 24 hours after completion or the last review.

## Extend

- `apps/web/src/content/schema.ts`: typed bilingual lesson and assessment schema.
- `apps/web/src/content/lessons.ts`: full ordered collection for catalog generation and content tests; runtime pages must not import it.
- `apps/web/src/content/foundations.ts`: original five course bodies with stable IDs.
- `apps/web/src/content/catalog.ts` and `catalogEntry.ts`: generated lightweight catalog and assessment metadata schema.
- `apps/web/src/content/curriculum.ts`: unit labels and nine-stage roadmap.
- `apps/web/src/content/packs.ts` and `loadLesson.ts`: on-demand group imports, shared request cache and catalog/content checks.
- `apps/web/src/LessonContentGate.tsx`: loading/failure/recovery interface for lessons and review cards.
- `apps/web/scripts/update-catalog.mjs`: deterministic catalog generation from full source content.
- `apps/web/src/content/measurement.ts`: measurement and data lesson content.
- `apps/web/src/content/measurementSkills.ts`: Stage 1 volume, accuracy, repeats and indirect measurement.
- `apps/web/src/content/motion.ts`: reference frames, distance/displacement, average speed and motion graphs.
- `apps/web/src/content/forces.ts`: force effects, balanced/unbalanced forces, friction and air resistance.
- `apps/web/src/content/gravity.ts`: mass/weight, Earth/Moon gravity, instrument calibration and free-fall intuition.
- `apps/web/src/content/energy.ts`: Stage 2 energy stores/transfers, kinetic/gravitational/elastic energy, conservation, dissipation and task-specific efficiency.
- `apps/web/src/interactive/EnergyLabs.tsx`, `EnergyArt.tsx` and `energyModels.ts`: six SVG stations, course art and validated energy calculations.
- `apps/web/src/content/work.ts`: Stage 2 work, constant-force displacement area, task-average power, stair estimates and ramp force–distance trade-offs.
- `apps/web/src/interactive/WorkLabs.tsx`, `WorkArt.tsx` and `workModels.ts`: five SVG stations, course art and validated work/power calculations.
- `apps/web/src/content/thermal.ts`: Stage 2 temperature, internal energy, heating, transfer paths, insulation and evaporation.
- `apps/web/src/interactive/ThermalLabs.tsx`, `ThermalArt.tsx` and `thermalModels.ts`: five SVG stations, card art and validated thermal calculations.
- `apps/web/src/content/phase.ts`: melting/freezing, boiling, condensation and complete heating curves.
- `apps/web/src/interactive/PhaseLabs.tsx`, `PhaseArt.tsx` and `phaseModels.ts`: four phase-change stations, distinct card art, latent-transfer calculations and exact elapsed curve vertices.
- `apps/web/src/interactive/EnergyBars.tsx`: common fixed-scale joule bars for energy, work and water heating.
- `apps/web/src/content/density.ts`: equal-volume comparisons, m/V with consistent units, displacement conditions and solid/liquid density.
- `apps/web/src/interactive/LabControls.tsx`: shared comparison controls, readouts and observation gates for force/gravity/density labs.
- `apps/web/src/content/mysteries.ts`: everyday floating, boats, bounce and echo lessons.
- `apps/web/src/content/discoveries.ts`: fair comparison, mirror, polarization and inertia lessons.
- `apps/web/src/ProjectPage.tsx` and `projects.ts`: field-project interface, validation and export.
- `apps/web/src/WalkingProject.tsx`, `WalkingCard.tsx` and `walking.ts`: walking records, summaries, checkpoint graphs, validation and bilingual reports.
- `apps/web/src/MaterialsProject.tsx`, `MaterialsCard.tsx` and `materials.ts`: specimen records, paired mass/volume summaries, condition checks, validation and bilingual reports.
- `apps/web/src/PowerProject.tsx`, `PowerCard.tsx` and `power.ts`: own stair rise/mass/time records, raw/used summaries, bounded persistence, independent-ascent bars and bilingual reports.
- `apps/web/src/ProjectReport.tsx`: shared local Markdown report link and read-only preview.
- `apps/web/src/content/experiments.ts`: exploration-station catalog.
- `apps/web/src/interactive/`: physical models and interactive SVG labs.
- `apps/web/src/progress.ts`: validated persistence and review scheduling.
- `apps/web/src/LessonPage.tsx`: common five-step lesson template.
- `apps/web/src/App.tsx`: dashboard, path, lab, notebook and review.
- `apps/web/src/styles.css`: scoped visual system and responsive layouts.

Add content using the same schema and reuse the common lesson template. Register a new content group in `LessonPack`, `lessonPacks` and `lessonCollections`, add its courses to the ordered collection, then run `corepack pnpm --filter @study/physics-web catalog:update` from Study. Catalog generation formats the file automatically. Edit lesson source rather than hand-editing the generated catalog; the integrity test rejects stale titles, order, bounds and answer keys. Avoid duplicating the interface per course. V1 uses plain text for simple formulas; introduce a shared math renderer when later courses need complex notation.

## Checks

From Study:

```sh
corepack pnpm -r --if-present typecheck
corepack pnpm exec vitest run
corepack pnpm -r --if-present build
npm run lint
npm run format:check
```

Physics tests cover corrupted storage, mastery gates, review timing, model calculations, equivalent units, repeated timing, consistent graph/table/track data, course ordering, preserved V1 completions, and bilingual content integrity. The interface also supports reduced motion and keyboard controls.
