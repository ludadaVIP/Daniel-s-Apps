# Free Spanish App Design

Free Spanish is a flexible Spanish-learning app for English speakers. The teaching rhythm is small and practical: one or two ideas per lesson, immediate example sentences, and audio for shadowing.

## Path

Recommended long-term course size:

Current status: A1, A2, B1, and B2 are complete with 440 lessons: Foundation 1-60, A1 Core 61-100, A2 Bridge 101-150, A2 Core 151-200, B1 Bridge 201-260, B1 Core 261-320, B2 Bridge 321-380, and B2 Core 381-440.

- Foundation / A1 from zero: 60 lessons
- A1 Core and A1 Output: 40 lessons
- A2 Bridge and A2 Core: 100 lessons
- B1 Bridge and B1 Core: 120 lessons
- B2 Bridge and B2 Core: 120 lessons

That is about 440 lessons from zero to strong B2. It sounds large, but each lesson is intentionally small. The strength comes from steady speaking, listening, reading, and output practice rather than overloaded grammar pages.

## Structure

- Frontend route: /free-spanish
- Backend API: /api/free-spanish
- Data folder: backend/data/FreeSpanish/
- Library index: library.json
- Lesson files: lessons/*.json
- MD inbox: MD/
- Audio cache: audio/edge-tts/lessons/<lesson-id>/

The app uses the shared FreeLanguage frontend and shared FreeLanguage backend factory, so future Free German can share the same mechanics while keeping its own data, languages, and voices.

## Lesson Rules

- Teach only 1-2 points per lesson.
- Put English beside every Spanish sentence.
- End lessons with speakable practice lines or a short dialogue.
- Prefer natural everyday Spanish over grammar-only examples.
- Keep Chinese out of lesson content unless the learner asks for it.
