# Daniel's Apps — unified practice hub

Five standalone Flask + React apps merged into one project. A single
Flask backend (port 8000) + a single Vite dev server (port 5173) host all of
them, so there are no more port collisions when you want to switch between
them.

The five sub-apps are:

| App                  | Route             | Backend prefix          | Source folder                       |
| -------------------- | ----------------- | ----------------------- | ----------------------------------- |
| French Sprint        | `/french`         | `/api/french/*`         | `backend/data/French/`              |
| English Quiz         | `/quiz`           | `/api/quiz/*`           | `backend/data/Quiz/`                |
| Live Spanish         | `/live-spanish`   | `/api/live-spanish/*`   | `backend/data/Live-Spanish/`        |
| Language Output Lab  | `/lab`            | `/api/lab/*`            | `backend/data/Lab/`                 |
| Recall Bible         | `/bible`          | `/api/bible/*`          | `backend/data/Bible/`               |

The hub page (`/`) just renders five buttons — pick one to launch the
corresponding app. The "Home" button in the per-app shell brings you back
to the hub. **Only one process per port** runs at any time, regardless of
how many apps you bounce between.

## Versions (unified across all four apps)

- Flask **3.0.3** + edge-tts **7.2.8** (`backend/requirements.txt`)
- React **19.2** + react-dom **19.2** + react-router-dom **7**
- Vite **7.1** + @vitejs/plugin-react **5**
- TipTap **3.22** (needed by Live Spanish's rich takeaway editor)
- lucide-react **0.468** (icon set used by all four apps)

## Folder layout

```
Daniel's Apps/
├── start.py                   # cross-platform launcher (real logic)
├── start.bat                  # Windows wrapper — calls start.py
├── start.sh                   # macOS / Linux wrapper — calls start.py
├── .gitignore                 # venv, node_modules, audio cache, OS junk
├── .gitattributes             # consistent line endings across Win/Mac
├── README.md
├── backend/
│   ├── requirements.txt
│   ├── app.py                 # entry; registers four blueprints
│   ├── data/                  # all five apps' JSON + audio (committed)
│   │   ├── French/
│   │   ├── Quiz/
│   │   ├── Live-Spanish/
│   │   ├── Lab/
│   │   └── Bible/             # cuv_data / esv_data / nvi_data
│   ├── shared/                # reusable "skills" extracted from sub-apps
│   │   ├── voices.py          # Edge TTS voice catalog (en/es/fr/de)
│   │   ├── tts.py             # async TTS generation + file-size guard
│   │   └── io.py              # JSON read/write helpers
│   └── apps/
│       ├── french/routes.py
│       ├── quiz/routes.py
│       ├── live_spanish/routes.py
│       ├── language_lab/routes.py
│       └── bible/routes.py
└── frontend/
    ├── package.json
    ├── vite.config.js         # proxies /api and /audio to Flask on :8000
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx            # React Router — top-level routes
        ├── Hub.jsx            # 4-button landing page
        ├── shared/
        │   ├── AppShell.jsx   # back-to-hub header (used by every sub-app)
        │   ├── api.js         # apiUrl() helper + fetch wrapper
        │   └── styles.css     # hub + shell CSS variables
        └── apps/
            ├── french/        # App.jsx + scoped styles.css
            ├── quiz/          # App.jsx + services/* + scoped styles.css
            ├── live_spanish/  # App.jsx + scoped styles.css
            ├── language_lab/  # App.jsx + scoped styles.css
            └── bible/         # App.jsx + scoped styles.css
```

### What was extracted as "skills"

These were the parts duplicated across two or more sub-apps; the merged
project keeps **one** implementation each:

- **Edge TTS** — was implemented three times in slightly different ways
  (`French/backend/app.py`, `Live-Spanish/app.py`, `Language-Output-LAB/app.py`).
  Now lives in `backend/shared/tts.py` + `backend/shared/voices.py`.
- **Voice catalog (en/es/fr/de)** — was duplicated between Live Spanish and
  Language Lab; merged into `backend/shared/voices.py`.
- **JSON read/write helpers** — every sub-app rolled its own; now
  `backend/shared/io.py`.
- **Layout / "back to hub" header** — `frontend/src/shared/AppShell.jsx`
  wraps every sub-app, so they all look like they belong in the same hub.
- **API URL helper** — `frontend/src/shared/api.js` adds the per-app
  namespace prefix.

### What stays per-app

The four `App.jsx` files were kept mostly intact (only the fetch URLs were
re-pointed to the namespaced backend). Each sub-app's stylesheet is wrapped
in a CSS `@scope` block (`.french-shell`, `.quiz-shell`, `.ls-shell`,
`.lab-shell`) so generic class names like `.sidebar` or `.primary-button` in
one app never bleed into another.

## Run on a new machine — quickest path

Prerequisites: **Python 3.10+**, **Node 18+**, **Git**. Install once per
machine if missing:

- Python: <https://www.python.org/downloads/> (on Windows, tick *"Add
  Python to PATH"* during install)
- Node: <https://nodejs.org/> (LTS is fine)
- Git: <https://git-scm.com/downloads>

### Step 1 — Clone the repo

```bash
git clone <your-repo-url> daniels-apps
cd daniels-apps
```

### Step 2 — Run the launcher

**Windows (cmd or PowerShell):**

```cmd
start.bat
```

or just double-click `start.bat` in Explorer.

**macOS / Linux (Terminal):**

```bash
chmod +x start.sh         # only the very first time
./start.sh
```

(or equivalently `python3 start.py`)

### Step 3 — Open the app

The launcher prints when it's ready, then open
<http://127.0.0.1:5173> in your browser and click any of the four
buttons. Ctrl+C in the terminal stops both Flask and Vite.

**What the launcher does on first run:** creates `backend/.venv/`,
installs `backend/requirements.txt`, runs `npm install` in `frontend/`,
then starts Flask :8000 and Vite :5173. Subsequent runs skip the install
steps and start in a couple of seconds.

### Initialise as a Git repo (one-time, if you haven't cloned)

If you've been editing locally and want to push to a new remote:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

`.gitignore` and `.gitattributes` are already set up to keep `venv/`,
`node_modules/`, build output, generated `*.mp3` audio caches, and OS junk
(`.DS_Store`, `Thumbs.db`) out of the repo, and to normalize line endings
so the `.sh` launcher works after cloning on either OS.

### Manual / advanced

If you'd rather run the two pieces separately (e.g., to see Flask debug
output in its own terminal):

```bash
# Terminal 1 — backend
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS / Linux:
source .venv/bin/activate
pip install -r requirements.txt
python app.py                   # serves http://127.0.0.1:8000

# Terminal 2 — frontend
cd frontend
npm install
npm run dev                     # serves http://127.0.0.1:5173
```

## Data locations

The merged backend reads each sub-app's JSON / audio cache from a folder
under `backend/data/`. The defaults (relative to this project root):

- `FRENCH_DATA_DIR` → `backend/data/French/`            (`lessons/`, `audio/`, `progress/`)
- `QUIZ_DATA_DIR` → `backend/data/Quiz/`                (`quizzes/`)
- `LIVE_SPANISH_DATA_DIR` → `backend/data/Live-Spanish/` (`quizzes/`, `progress/`, `audio/`)
- `LANGUAGE_LAB_DATA_DIR` → `backend/data/Lab/`         (`topics/`, `audio/`)
- `BIBLE_DATA_DIR` → `backend/data/Bible/`              (`cuv_data/`, `esv_data/`, `nvi_data/` — drop in `<code>_data/` folders to add more translations)

If you want to point any sub-app at a different location, set the matching
environment variable before launching:

```cmd
set FRENCH_DATA_DIR=D:\language-data\French
backend\.venv\Scripts\python.exe backend\app.py
```

## Notes

- This is a **research-quality merge**: the four App.jsx files were lightly
  edited to add the API prefix and a unique wrapper class. They retain the
  bulk of their original code, so any bug present in the standalone version
  will reproduce here.
- CSS isolation between sub-apps relies on the `@scope` CSS feature, which
  is supported in Chrome 118+, Firefox 128+, and Safari 17.4+. If you need
  to support older browsers, the CSS files can be flattened by replacing
  each `@scope (.foo-shell) { ... }` with a manual prefix.
- The frontend builds via `cd frontend && npm run build` into
  `frontend/dist`, and Flask will serve that build at `/` when no Vite
  server is running — useful for shipping a single-process deployment.

## Troubleshooting

- **"网页无法访问 / Can't reach 127.0.0.1:5173"** right after launch →
  Vite's *first* dev start pre-bundles every npm dependency (React,
  TipTap, lucide-react, etc.) and can take 10-30 seconds before it
  prints `VITE ready in NN ms`. Wait for that line; the page only
  responds once you see it. Subsequent starts are nearly instant
  because the bundle is cached in `frontend/node_modules/.vite/`.
- **"edge-tts is not installed"** when clicking a TTS button → delete
  `backend/.venv/` and re-run `start.bat` / `start.sh`. The launcher will
  rebuild the venv and install dependencies cleanly.
- **A sub-app loads but is empty** → make sure the matching folder exists
  under `backend/data/` (see "Data locations" above). The blueprint that
  can't find its data folder will return empty JSON instead of crashing.
- **Port 8000 or 5173 already in use** → set the `PORT` env var before
  launching (e.g. `set PORT=8001` on Windows, `PORT=8001 ./start.sh` on
  Mac/Linux), and tweak the Vite port in `frontend/vite.config.js` if
  needed.
- **`./start.sh: bad interpreter` after cloning on Mac** → the file was
  saved with CRLF line endings. `.gitattributes` should prevent this, but
  if it slips through run `sed -i '' 's/\r$//' start.sh` once.
- **`python` not found** → on Windows, `start.bat` automatically falls
  back to the `py -3` launcher that ships with the official Python
  installer. On Mac, install Python 3.10+ from python.org or via
  `brew install python`.
