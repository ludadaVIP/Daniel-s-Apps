# Free French App Design

Free French is a free-form, speakable language-learning app. It is built for a learner who wants to study one small idea at a time, add new topics whenever needed, and hear every useful French sentence aloud.

The app should feel compact but not crowded: the left sidebar is for navigation and course management, while the right pane is for dense, readable lesson content with audio controls close to every speakable item.

## Current Structure

- Frontend route: `/free-french`
- Frontend app: `frontend/src/apps/free_french/`
- Frontend shared API factory: `frontend/src/shared/freeLanguageApi.js`
- Backend blueprint: `backend/apps/free_french/routes.py`
- Backend API prefix: `/api/free-french`
- Data folder: `backend/data/FreeFrench/`
- Library index: `backend/data/FreeFrench/library.json`
- Lesson files: `backend/data/FreeFrench/lessons/*.json`
- Markdown inbox: `backend/data/FreeFrench/MD/`
- Audio cache: `backend/data/FreeFrench/audio/edge-tts/lessons/<lesson-id>/`

`library.json` stays intentionally small. It stores level metadata and lesson summaries only. Full lesson content lives in one JSON file per lesson, so the app can load the library first and then fetch only the selected lesson.

## Data Model

Each level has:

- `id`: stable slug used by the app and API.
- `title`: visible level name, such as `Foundation`, `A2 Hi`, or `Growth`.
- `subtitle`: short learner-facing description.
- `description`: optional longer note.

Each lesson file has:

- `id`: stable lesson slug and JSON filename.
- `levelId`: level ownership.
- `title`: visible lesson title.
- `subtitle`: one-line promise of the lesson.
- `tags`: optional search/grouping hints.
- `overview`: short focus bullets shown at the top of the lesson.
- `sections`: ordered teach-and-practice blocks.

The old `duolingoBridge` field may remain in data for compatibility, but it is not shown in the UI. Future lessons should put useful alignment notes into `overview` or normal sections instead.

## Section Types

Supported lesson section kinds:

- `table`: compact grammar or pattern grids.
- `cards`: short target-language items with translations.
- `dialogue`: speaker-based conversation lines.
- `vocabulary`: word plus example sentence.
- `verbs`: verb entry, forms, and example sentence.

Every target-language sentence should have an English or Spanish translation nearby. The strongest pattern for Free French is:

- French first, because it is the learning target.
- English and Spanish beside or below it, because meaning must stay visible.
- Audio controls on French sentences and on translations when useful.

## Course Design

The course is built as small lessons with one or two ideas each. A good lesson teaches a pattern, gives a few model phrases, then ends with practical sentences or dialogue that the learner can shadow aloud.

Current path:

- Foundation: A1 base.
- Intensive: A2 bridge.
- A2 Med: middle A2.
- A2 Hi: high A2 to B1 bridge.
- Intermediate: A2 to B1 bridge.
- B1 Med: native-style B1 practice.
- B1 Hi: advanced B1 native-style practice.
- B1 Output: spoken and written B1 production.
- Growth: B1 to B2 bridge.

Future levels should keep the same rhythm: small concept, clear examples, immediate practice, and speakable review lines.

## UI Principles

- The sidebar is collapsible and level-based.
- Level rows use a chevron, title, subtitle, and CRUD actions.
- Lesson rows use global sequence numbers instead of book icons.
- The right pane should be compact but breathable.
- Avoid large explanatory panels that do not teach or practice.
- Keep audio buttons close to the exact text they play.
- Avoid Chinese in lesson content unless the learner explicitly asks for it.

## CRUD And Cleanup

The app supports creating, renaming, and deleting levels and lessons.

When a lesson is deleted:

- Its lesson JSON file is removed.
- Its per-lesson audio cache is removed.
- Its library summary is removed.

This keeps the data folder clean as lessons are added, revised, and deleted.

## Shared App Direction

Free French, Free Spanish, and Free German should share the same high-level architecture:

- Shared frontend API factory: `createFreeLanguageApi(baseUrl)`.
- Shared lesson renderer pattern: levels, lesson summaries, one fetched lesson, section blocks, TTS controls.
- Shared backend behavior: library index, lesson files, Markdown inbox, per-lesson audio cache, CRUD routes, TTS route.
- Independent data folders, API prefixes, language defaults, voice choices, and course content.

Recommended future app setup:

- Free Spanish:
  - Frontend route: `/free-spanish`
  - API prefix: `/api/free-spanish`
  - Data folder: `backend/data/FreeSpanish/`
  - Target language: `es`
  - Support language: mainly `en`

- Free German:
  - Frontend route: `/free-german`
  - API prefix: `/api/free-german`
  - Data folder: `backend/data/FreeGerman/`
  - Target language: `de`
  - Support languages: `es` and `fr`

The next clean abstraction is a configurable `FreeLanguageApp` component. It should accept:

- `brandTitle`
- `brandMark`
- `routeBase`
- `api`
- `targetLanguage`
- `supportLanguages`
- `defaultExpandedLevelIds`
- `emptyLessonTemplate`

The backend can later use a shared `create_free_language_blueprint` factory with:

- blueprint name
- data directory
- API/audio prefix
- default target language
- cache key namespace

This keeps app behavior unified while letting the actual course data and translation languages stay independent.

## Extension Workflow

To add content safely:

1. Add or update a level in `library.json`.
2. Add one lesson summary to `library.json`.
3. Create one matching file in `lessons/<lesson-id>.json`.
4. Keep each lesson focused on one or two teachable points.
5. Put translations beside all French example sentences.
6. Test that the lesson loads and the French audio buttons work.

For copied notes from another AI or teacher, place the raw material in `MD/` first. Later, rewrite it into the structured lesson format, keeping only the parts that are clear, useful, and speakable.
