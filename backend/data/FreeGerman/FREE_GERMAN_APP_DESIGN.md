# Free German App Design

Free German is a flexible German-learning app for learners who want Spanish and French support. It follows the shared Free Language pattern used by Free French, Free Spanish, and Free English: one or two ideas per lesson, immediate examples, translations beside every German sentence, and German Edge TTS for shadowing.

## Path

Current status: Foundation 30, A1 Core 90, A2 Bridge 70, A2 Core 100, B1 Bridge 70, B1 Core 120, B2 Bridge 70, B2 Med 100, B2 Hi 100, C1 Bridge 70, C1 Med 100, and C1 Hi 100 are complete with 1020 lessons: Foundation 1-30, A1 Core 31-120, A2 Bridge 121-190, A2 Core 191-290, B1 Bridge 291-360, B1 Core 361-480, B2 Bridge 481-550, B2 Med 551-650, B2 Hi 651-750, C1 Bridge 751-820, C1 Med 821-920, and C1 Hi 921-1020. The main zero-to-C1 Free German path is complete; future expansion can add C2, exam tracks, theme packs, or learner-created MD imports.

Recommended long-term path:

- Foundation: 30 lessons
- A1 Core: 90 lessons
- A2 Bridge: 70 lessons
- A2 Core: 100 lessons
- B1 Bridge: 70 lessons
- B1 Core: 120 lessons
- B2 Bridge: 70 lessons
- B2 Med: 100 lessons
- B2 Hi: 100 lessons
- C1 Bridge: 70 lessons
- C1 Med: 100 lessons
- C1 Hi: 100 lessons
- Optional C2 / specialty tracks: future expansion

The goal is not to overload each lesson. The goal is steady pronunciation, grammar, listening, reading, speaking, and real output practice.

## Structure

- Frontend route: /free-german
- Backend API: /api/free-german
- Data folder: backend/data/FreeGerman/
- Library index: library.json
- Lesson files: lessons/*.json
- MD inbox: MD/
- Audio cache: audio/edge-tts/lessons/<lesson-id>/

The app uses the shared FreeLanguage frontend and shared FreeLanguage backend factory. Future expansions should only add levels and lesson files unless a genuinely new learning interaction is needed.

## Lesson Schema

Each lesson is a standalone JSON file referenced by library.json. German is stored in the de field. Spanish support is stored in es. French support is stored in fr. The shared frontend speaks the target German text and displays the Spanish/French meaning beside it.

## Teaching Style

Each lesson should teach one or two things, then make the learner use them immediately. German articles should usually be learned with nouns. Grammar is introduced through short, speakable sentences before abstract explanation.
