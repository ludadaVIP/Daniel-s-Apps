# Free English App Design

Free English is a flexible English-learning app for Chinese speakers. The teaching rhythm follows Free French and Free Spanish: one or two ideas per lesson, immediate example sentences, Chinese beside every English sentence, and English TTS for shadowing.

## Path

Current status: Foundation 30, A1 Core 60, A2 Bridge 60, A2 Core 70, B1 Bridge 60, B1 Core 80, B2 Bridge 60, B2 Med 70, B2 Hi 70, C1 Bridge 60, and C1 Med 70 are complete with 690 lessons: Foundation 1-30, A1 Core 31-90, A2 Bridge 91-150, A2 Core 151-220, B1 Bridge 221-280, B1 Core 281-360, B2 Bridge 361-420, B2 Med 421-490, B2 Hi 491-560, C1 Bridge 561-620, and C1 Med 621-690. The next natural expansion is C1 Hi.

Recommended long-term path:

- Foundation: 30-60 lessons
- A1 Core: 60 lessons
- A2 Bridge: 60 lessons
- A2 Core: 70 lessons
- B1 Bridge: 60 lessons
- B1 Core: 80 lessons
- B2 Bridge: 60 lessons
- B2 Med: 70 lessons
- B2 Hi: 70 lessons
- C1 Bridge: 60 lessons
- C1 Med: 70 lessons

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
