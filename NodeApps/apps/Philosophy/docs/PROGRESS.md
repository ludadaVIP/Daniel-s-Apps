# Development Progress

## Current Milestone

The app and complete curriculum map are in place. All four foundation courses, all six history courses, all ten core-field courses, all four seminars and the capstone are drafted. Academic review remains in progress.

## Completed

- Integrated Philosophy with the NodeApps launcher, API gateway and shared dev/build commands.
- Markdown/frontmatter course and lesson loader with content validation and lazy lesson API.
- Home, searchable four-stage roadmap, course, reader and review screens.
- Browser-local answers, completion, review flags, resume point and progress.
- Course-level artifact notebook with evidence, six-dimension self-review, external feedback and revision record, stored locally.
- JSON export and restore for local answers, lesson progress and course artifacts; import replaces the current browser record.
- Mapped 4 stages, 25 courses and 160 distinct lessons with course competencies and required artifacts.
- Published all 32 foundation lessons: Introduction to Philosophy, Critical Thinking, Formal Logic and Philosophical Reading & Writing.
- Published all 8 Ancient Greek and Hellenistic Philosophy lessons with links to verifiable primary texts.
- Published all 8 Classical Chinese and South Asian Philosophy lessons, ending in a source-based cross-tradition comparison essay.
- Published all 8 Late Antique and Medieval Philosophy lessons, comparing Christian, Islamic and Jewish arguments with primary-text locations and explicit objections.
- Published all 8 Early Modern Philosophy lessons, with primary-text comparisons from Descartes through Hume and a final argumentative essay.
- Published all 8 Kant, Enlightenment and Nineteenth Century lessons, linking knowledge, morality, recognition, utility, existence, alienation and genealogy through original-text argument work.
- Published all 8 Twentieth Century Traditions lessons, comparing analysis, phenomenology, existentialism, pragmatism, critical theory and genealogy with explicit method boundaries.
- Published all 6 Epistemology lessons, from Gettier cases and justification through reliabilism, skepticism, testimony and peer disagreement.
- Published all 6 Metaphysics lessons, covering persistence, properties, modality, causation, time, composition and personal identity.
- Published all 6 Ethics lessons, using a fixed rescue case to compare metaethics, consequentialism, deontology, virtue, care, contractualism and moral luck.
- Published all 6 Political Philosophy lessons, connecting authority, liberty, distributive justice, property, democracy and global justice through a public flood response case.
- Published all 6 Philosophy of Mind lessons, comparing dualism, physicalism, functionalism, consciousness, intentionality, other minds and extended cognition.
- Published all 6 Philosophy of Science lessons, separating induction, explanation, theory change, realism, modeling, uncertainty and values in scientific practice.
- Published all 6 Philosophy of Language lessons, testing theories of reference, use, speech acts, context and private language with a common public-notice case.
- Published all 6 Philosophy of Religion lessons, separating premises and objections concerning God, evil, hiddenness, miracles, faith and religious diversity.
- Published all 6 Aesthetics lessons, testing art definitions, judgment, expression, intention, ethics and cross-cultural experience against concrete works and cases.
- Published all 6 Comparative & Social Philosophy lessons, with source-aware comparisons of relational selves, Ubuntu, epistemic injustice and social categories.
- Published all 4 Free Will Seminar lessons, requiring multi-round objections, a narrowly defended paper and oral defense plan.
- Published all 4 Consciousness Seminar lessons, distinguishing experience, knowledge and conceivability arguments, alternatives and a revised paper.
- Published all 4 Meaning & Death Seminar lessons, connecting Epicurus, deprivation, immortality and meaning theories to a revised paper.
- Published all 4 Technology & AI Seminar lessons, separating machine minds, moral status, institutional responsibility and epistemic agency.
- Published all 4 Independent Research & Capstone lessons, from research question and bibliography through proposal, peer review, defense and revision evidence.
- Added content and browser smoke tests that check the distinction between planned and published lessons.
- Structural audit confirms 160 published lessons, 496 guided questions, 341 external-link occurrences, and no lesson below its stage's minimum body length. These counts do not certify argument accuracy.
- Reviewed the foundation logic examples for validity, quantifier scope and existential witnesses; added visible study guides for critical thinking, formal logic and writing.
- Curriculum search covers course goals and lesson tags; the review list shows course and most recent study date.

## In Progress

- Review the full curriculum for coherence, source accuracy and assignment rigor.
- Review existing lesson arguments, translations and primary-source references for accuracy and depth.

## Next

1. Audit the foundation courses for argument accuracy, source references and exercise guidance before independent review.
2. Arrange outside philosophical review of the mature curriculum and revise weak lessons before making any graduate-equivalence claim.

## Known Limits

- All 160 planned lessons are drafted; content publication alone cannot establish graduate-level proficiency.
- Progress is tied to this browser's local storage; use JSON export for backup or manual transfer. Automatic cross-device sync is outside this personal V1.
- Search covers roadmap course/lesson titles and metadata, not full lesson text.
- The app provides writing prompts and guidance, but does not grade philosophical work.

## Important Architecture Decisions

- Reuse the NodeApps React/Vite/Express runtime.
- Keep the complete planned syllabus separate from published Markdown. The server validates published IDs, titles and order against the syllabus.
- Load curriculum metadata separately from full lesson Markdown.
- Require substantial lesson text before publishing; still rely on editorial review for rigor and accuracy.

## Verification

- `npm run validate:philosophy` — validates the syllabus and every published lesson.
- `npm test` — includes the Philosophy roadmap/content invariants.
- `npm run build` — verifies the production bundle.
- `python C:\Users\Administrator\.codex\skills\webapp-testing\scripts\with_server.py --server "npm run dev" --port 5888 -- python apps/Philosophy/scripts/smoke-ui.py` — browser navigation, answers, progress, search and mobile width.
