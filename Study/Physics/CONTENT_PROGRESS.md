# Physics content progress

## Current release · 2026-10-08

20 usable lessons: 19 in Stage 0, plus the first speed lesson in Stage 1. This is a growing foundation release, not the completed junior/high school curriculum. 19 interactive stations and a saved/exportable Physics Detective field project are available. Each lesson retains the predict → explore → explain → practice → takeaway sequence, bilingual feedback, a home experiment and an exit question.

## Plan mapping

| Plan reference                            | Available content                                                         | Interactive evidence                                                                              |
| ----------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Stage 0 Unit 0.1; Appendix A 1–3          | Physics everywhere, asking testable questions, observation vs explanation | Controlled rolling comparison; falling-ball observation                                           |
| Appendix A 4                              | What can we measure?                                                      | Match pencil, song and bag to ruler, timer and balance                                            |
| Stage 0 Unit 0.2; Appendix A 5–9          | Units, length, time, mass and temperature                                 | Same string in three units; nonzero ruler start; repeated timing; balance; touch vs temperature   |
| Stage 0 Unit 0.3; Appendix A 10–11        | Tables/data and simple graphs                                             | Six retained example readings; graph, time slider and track linked to the same data               |
| Stage 0 Unit 0.4, metal/wood mystery      | Covered within the temperature lesson                                     | Both objects measure 20°C under stated equilibrium conditions                                     |
| Stage 1 Unit 1.2; Appendix A 20           | What is speed?                                                            | Equal-distance robot race                                                                         |
| Stage 0 Unit 0.4; Appendix A 12–15        | Ice, ships, bounce and echoes                                             | Density-dependent immersion; dry/flooded clay hull; first rebound; round-trip sound path          |
| Stage 0 Unit 0.3, comparison              | Embedded in units, ruler, mass, temperature and graph lessons             | Comparable units, conditions and graphical data; no separate duplicate course                     |
| Stage 0 Unit 0.3, causality               | Fair tests; correlation and common causes                                 | Smooth/rough surfaces at matched or unmatched starting speeds; retained data                      |
| Stage 0 Unit 0.4, mirror/static/seat belt | Virtual images, polarization and inertia                                  | Mirror ray construction; three charge observations; restrained/unrestrained toy vehicle           |
| Stage 0 Physics Detective project         | Observation, prediction, fair plan, evidence and explanation              | Ten bilingual prompts; local draft; Markdown export; no automated claim of scientific correctness |

Stage 0 core topics are represented, with comparison skills embedded across lessons and the cold-metal mystery in temperature. This does not imply the child has mastered them; the field project is intentionally open-ended.

## This update

Previous batch added seven full courses: quantities, units, time, mass, temperature, tables/data and graphs. Added seven SVG exploration stations and distinct lesson-card art. Introduced stage/unit grouping, dynamic course counts and a compact experiment picker. Original five lesson IDs and the local progress key are retained.

Content is grounded in bags, pencils, songs, furniture fitting through doors, swings, kitchen scales, room-temperature objects and walking. Calculations follow observed differences. Numeric model assumptions and preset data are visible to the learner; home investigations ask for their own observations.

The previous mystery batch added four full bilingual mysteries and four distinct SVG stations: iceberg volume, clay-hull loading/flooding, first rebound, and echo travel. Each adds three practice questions, an exit question, misconceptions, a worked example and a safe home investigation. Volume and cm³ are explained within the lesson rather than assumed. The boat course requires observing four designs/loads before its exploration gate opens. Model assumptions remain explicit: static displacement; open-hull flooding; one passive collision; one reflected sound path.

The latest batch adds cause/effect, mirror, balloon polarization and seat-belt lessons, plus four distinct labs. Fair-test records expose confounded comparisons; mirror rays satisfy the reflection geometry; neutral-wall charge is conserved; inertia animation ends before collision physics. The Physics Detective project saves each field as it is edited and exports a bilingual report. Inconclusive results and revisions are valid, and a complete-record badge does not certify the explanation.

## Verified

- Workspace type checks, lint, production builds and 99 automated tests passed.
- Browser QA: a new lesson from prediction through exit/mastery, deliberate wrong-answer retry, next-lesson order, tool matching, equivalent units, balance readings, 1/10-cycle timing, paired temperature readings, complete data recording, and synchronized walking graph.
- Browser QA of this batch: completed boat course through all four design/load comparisons and exit mastery; ice/rock release; equal-height rubber/clay rebound records; 5/50 m echo records (0.029/0.292 s).
- Responsive QA at 1280, 390 and 320 px: no horizontal page overflow in the new table, balance or graph stations.
- New-station responsive QA: 390 px echo readouts/table; 320 px ice, boat and bounce controls/readouts; 1280 px boat/sidebar. No horizontal page overflow; dry hull visually excludes water.
- New-model tests cover floating balance, sinking buoyancy, water density, clay mass invariance, loss of empty-hull displacement after flooding, the rim limit, rebound height/energy and full echo travel.
- Latest browser QA: balloon lesson completed through all exploration cases, three practice questions and exit check; next lesson correctly points to seat belts. Mirror distance changed 40→60 cm with image separation 80→120 cm. Both restraint animations finished; fair-test records were 4.00, 2.25 and 1.00 m for the specified conditions.
- Detective project QA: draft survived reload; plan-ready and record-complete badges appeared only after required fields; actual downloaded bilingual Markdown preserved the entered evidence. All synthetic records stayed on the separate development origin.
- Latest responsive QA: all four new labs and the project had no horizontal page overflow at 320 px; project English mode also fit at 390 px; desktop ray construction and project columns visually checked.
- New tests cover equal mirror distances/angles, charge conservation, passenger motion before contact, contact timing on both sides of vehicle stopping, fair-test data, project draft validation/clipping, completion requirements and bilingual export.
- Earlier V1 completion data survives course insertion (automated regression coverage).

## Next content priorities

1. Complete Stage 1 measurement skills (precision, error, repeated measurements), then motion: reference frame, position, distance vs displacement, speed formula, average speed, graphs and a walking/running project.
2. Add force, gravity and density using predictive interactions and practical projects.
3. Continue Stages 2–3: energy/work/power, heat, sound/light, pressure/buoyancy, machines, electricity and magnetism.
4. Build Stage 4 mathematics/problem-solving bridge before Stages 5–8: mechanics, waves/optics/thermal physics, electromagnetism, then modern physics.

Further product work includes staged 1/7/30-day review and richer feedback on investigations; current review is a simple 24-hour queue. Each batch needs physical-model checks, content integrity checks, browser interaction QA and a clear record of what is still planned. Later roadmap stages remain visibly planned until their courses actually exist. Child engagement and explanations in their own words are still the key real-world validation; automated checks cannot establish learning effectiveness.
