# Free German App Design

Free German is a flexible German-learning app for learners who want Spanish and French support. It follows the shared Free Language pattern used by Free French, Free Spanish, and Free English: one or two ideas per lesson, immediate examples, translations beside every German sentence, and German Edge TTS for shadowing.

## Path

Current status: Foundation 30 is complete with lessons 1-30. The long-term path is from zero to C1, built gradually through A1, A2, B1, B2, and C1 levels.

Recommended long-term path:

- Foundation: 30 lessons
- A1 Core: 70-100 lessons
- A2 Bridge: 60 lessons
- A2 Core: 80-100 lessons
- B1 Bridge: 60 lessons
- B1 Core: 100-120 lessons
- B2 Bridge: 60 lessons
- B2 Core: 100-140 lessons
- C1 Bridge: 60 lessons
- C1 Core: 100-140 lessons

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
