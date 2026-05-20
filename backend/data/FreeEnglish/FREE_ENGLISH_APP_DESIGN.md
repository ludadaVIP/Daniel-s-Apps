# Free English App Design

Free English is a flexible English-learning app for Chinese speakers. The teaching rhythm follows Free French and Free Spanish: one or two ideas per lesson, immediate example sentences, Chinese beside every English sentence, and English TTS for shadowing.

## Path

Current status: Foundation 30, A1 Core 60, A2 Bridge 60, and A2 Core 70 are complete with 220 lessons: Foundation 1-30, A1 Core 31-90, A2 Bridge 91-150, and A2 Core 151-220. B1 Bridge, B1 Core, B2 Bridge, and B2 Core are ready as empty levels for future expansion.

Recommended long-term path:

- Foundation: 30-60 lessons
- A1 Core: 60 lessons
- A2 Bridge: 60 lessons
- A2 Core: 70 lessons
- B1 Bridge and B1 Core: 120 lessons
- B2 Bridge and B2 Core: 120 lessons

The goal is not to overload each lesson. The goal is steady speaking, listening, reading, writing, and real output practice.

## Structure

- Frontend route: /free-english
- Backend API: /api/free-english
- Data folder: backend/data/FreeEnglish/
- Library index: library.json
- Lesson files: lessons/*.json
- MD inbox: MD/
- Audio cache: audio/edge-tts/lessons/<lesson-id>/

The app uses the shared FreeLanguage frontend and shared FreeLanguage backend factory. Future free-language apps, such as Japanese, Korean, or Arabic, should reuse the same pattern and only replace data, route config, and language settings.

## Lesson Rules

- Teach only 1-2 points per lesson.
- Put Chinese beside every English sentence.
- Make every English line speakable and useful.
- Prefer natural everyday English over grammar-only examples.
- End lessons with shadowing or a short dialogue.
- Keep the UI familiar and simple across Free Language apps.
