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