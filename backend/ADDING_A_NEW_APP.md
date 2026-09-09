# Adding a New App to Daniel's Apps

> **Read this entire document before writing any code.** The patterns described here are battle-tested. Deviating breaks something subtle: CSS leaks across apps, page-level scrolling that pulls sidebars off-screen, broken `grid-template-rows: 1fr`, duplicated TTS state, etc. Every "gotcha" in this doc cost real debugging time.

This doc is the contract a new sub-app must follow to integrate cleanly with the existing 7 apps without affecting any of them.

---

## 1. What "Daniel's Apps" is

A single Flask backend (port 8000) + single Vite/React frontend (port 5173) hosting N independent learning apps under one hub. Each app:

- Mounts at `/<slug>` on the frontend, `/api/<slug>/*` on the backend.
- Owns its data in `backend/data/<Name>/`.
- Owns its CSS — never leaks selectors or variables to other apps.
- Is modifiable in isolation: editing one app cannot affect another.

Existing apps (as of writing): `french`, `quiz`, `live_spanish` (`/live-spanish`), `language_lab` (`/lab`), `bible`, `translator`, `ai_practice` (`/ai-practice`).

---

## 2. TL;DR — files an AI must create/edit

For a hypothetical new app `my-new-app` (Python folder name: `my_new_app`):

**Create:**
- `backend/apps/my_new_app/__init__.py` (empty)
- `backend/apps/my_new_app/routes.py` (Flask Blueprint, see template §4.2)
- `backend/data/MyNewApp/` (data directory, even if empty)
- `frontend/src/apps/my_new_app/App.jsx` (React component, default export)
- `frontend/src/apps/my_new_app/styles.css` (scoped to `.mna-shell` or similar)
- `frontend/src/apps/my_new_app/services/api.js` (all HTTP calls)

**Edit:**
- `backend/app.py` — import + register the blueprint, add slug to health endpoint
- `frontend/src/App.jsx` — lazy import + route
- `frontend/src/Hub.jsx` — add to `APPS` array, bump "N合一" title

That's it. Eight files touched. No edits to `shared/`, no edits to any other app.

---

## 3. The architecture (read this carefully)

```
<div class="dh-shell">                       ← height: 100vh; flex column
├─ <header class="dh-shell-bar">             ← sticky top bar "主页 / <App>"
└─ <main class="dh-shell-content">           ← flex: 1; min-height: 0; overflow-y: auto
   └─ <YourAppRoot class=".your-shell">      ← YOUR component, must use flex: 1; min-height: 0
```

Critical layout invariants — these enable everything else to work:

- `dh-shell` is **`height: 100vh`** (a *definite* height, not `min-height`). This is what lets descendants use `grid-template-rows: 1fr` or percentage heights correctly. Do not change this.
- `dh-shell-content` has `overflow-y: auto`. Apps with long scrollable content (Bible, AI Practice) let this scroll. Apps with fixed-height internal layouts (French, Translator) consume the height fully and scroll internally — `dh-shell-content` never needs to scroll for them.
- Your app's root must use `flex: 1; min-height: 0` (Layout B) or `min-height: calc(100vh - 50px)` (Layout A) — see §6. Do NOT use `min-height: 100vh` on your app root (see Gotcha G1).

---

## 4. Backend

### 4.1 File layout

```
backend/apps/<my_new_app>/
├─ __init__.py          (empty file)
└─ routes.py            (Flask Blueprint)

backend/data/<MyNewApp>/
└─ ...                  (your app's data files)
```

Use `snake_case` for the Python package, `PascalCase` for the data folder. Match casing exactly — `Path(...).resolve()` is case-sensitive on Linux even if Windows tolerates it.

### 4.2 `routes.py` minimal template

```python
"""<My New App> blueprint.

Mounted at ``/api/my-new-app`` in the unified backend.
Data lives in ``backend/data/MyNewApp/``.
"""

from __future__ import annotations

import json
from pathlib import Path
from flask import Blueprint, jsonify, request

DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "MyNewApp"
DATA_DIR.mkdir(parents=True, exist_ok=True)

bp = Blueprint("my_new_app", __name__)


class MyAppError(ValueError):
    def __init__(self, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code


@bp.errorhandler(MyAppError)
def handle_error(error: MyAppError):
    return jsonify({"error": str(error)}), error.status_code


# Every route should include OPTIONS for the global CORS preflight handler.
@bp.route("/hello", methods=["GET", "OPTIONS"])
def hello():
    if request.method == "OPTIONS":
        return ("", 204)
    return jsonify({"greeting": "Hello from my-new-app"})
```

### 4.3 Registering in `backend/app.py`

Three small edits:

```python
# Import (group with the other app imports)
from apps.my_new_app.routes import bp as my_new_app_bp

# Inside create_app(), after the other register_blueprint calls:
app.register_blueprint(my_new_app_bp, url_prefix="/api/my-new-app")

# Inside the /api/health handler, add your slug:
return jsonify({"ok": True, "apps": [..., "my-new-app"]})
```

### 4.4 Edge TTS

If your app needs text-to-speech, use the shared module — don't duplicate:

```python
from shared.tts import synthesize_audio  # or whatever helper exists
from shared.voices import pick_voice
```

Check what's actually exported in `backend/shared/tts.py` and `backend/shared/voices.py` before importing. If the helper you need isn't there yet, ADD it to `shared/` (and use it from multiple apps), don't copy it into `apps/my_new_app/`.

### 4.5 CORS / OPTIONS

CORS headers are added globally by an `after_request` hook in `app.py`. You don't add CORS headers manually. You DO need to handle `OPTIONS` in each route's `methods=` list and return `("", 204)` for OPTIONS — see the template above.

### 4.6 Audio file serving (only if your app writes audio to disk)

If your app caches Edge TTS audio on disk (like French/Live Spanish/Language Lab do), add an audio-serving route in `backend/app.py`:

```python
from apps.my_new_app.routes import AUDIO_DIR as MY_APP_AUDIO_DIR

@app.get("/audio/my-new-app/<path:filename>")
def serve_my_app_audio(filename: str):
    return send_from_directory(MY_APP_AUDIO_DIR, filename, max_age=31536000)
```

If your app streams audio in-memory (like Translator/AI Practice do), you don't need this — the audio is served from a regular `/api/my-new-app/tts` endpoint.

---

## 5. Frontend wiring (hub + router)

### 5.1 `frontend/src/App.jsx`

Lazy-import (top of file) and add a route:

```jsx
const MyNewApp = lazy(() => import("./apps/my_new_app/App.jsx"));

// Inside <Routes>:
<Route path="/my-new-app" element={withShell("My New App", "#hex-color", MyNewApp)} />
```

`withShell` wraps your component in `<AppShell>` + `<Suspense>`. The label appears in the top bar; the accent color tints the "主页" button and styling cues.

### 5.2 `frontend/src/Hub.jsx`

Add to the `APPS` array:

```jsx
{
  id: "my-new-app",
  title: "My New App",
  subtitle: "中文副标题",
  description: "One-line English description.",
  accent: "#hex-color",        // MUST match the router's accent color
  Icon: SomeLucideIcon,         // import from lucide-react above
  to: "/my-new-app",
},
```

Import the icon: `import { ..., SomeLucideIcon } from "lucide-react";`

Bump the title count (e.g., `"七合一..."` → `"八合一..."`).

---

## 6. Sub-app frontend

### 6.1 File layout

```
frontend/src/apps/<my_new_app>/
├─ App.jsx              (default export = React component)
├─ styles.css           (scoped CSS — see §6.4)
└─ services/
   └─ api.js            (every fetch call in here, none inline)
```

**Do not** create:
- `apps/<my_new_app>/api.js` at the root — it goes in `services/`
- Top-level `tts.js` or `audio.js` — use `shared/useTts` instead
- Any `.css` file outside this directory

### 6.2 `services/api.js` pattern

Every HTTP call lives here. Don't write `fetch("/api/...")` in `App.jsx`.

```js
const BASE = "/api/my-new-app";

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
  return data;
}

export async function fetchHello() {
  return parseResponse(await fetch(`${BASE}/hello`));
}

export async function saveSomething(payload) {
  return parseResponse(
    await fetch(`${BASE}/something`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );
}
```

`App.jsx` consumes named imports:

```jsx
import { fetchHello, saveSomething } from "./services/api";
```

### 6.3 `App.jsx` skeleton

```jsx
import { useState, useEffect } from "react";
import "./styles.css";
import { fetchHello } from "./services/api";

export default function MyNewApp() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHello()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div className="mna-shell">{error}</div>;
  }

  return (
    <div className="mna-shell">
      {/* your UI */}
    </div>
  );
}
```

The root `<div>` MUST have a unique class. Convention: `.<short-prefix>-shell` or `.<short-prefix>-root`. All CSS in `styles.css` must be scoped under this class.

### 6.4 `styles.css` — three valid scoping patterns

**Pick ONE and stick with it for the whole file. Never mix.**

#### Pattern A: `@scope` (recommended for new apps)

Modern native CSS scoping. Used by `quiz`, `bible`, `live_spanish`, `language_lab`, `ai_practice`. Every selector inside the block is automatically constrained to descendants of `.mna-shell`.

```css
@scope (.mna-shell) {
  :scope {
    /* Variables live on the scope root — never reach :root */
    --bg: #f6f8fb;
    --accent: #2563eb;

    /* root styles for .mna-shell itself — ALWAYS use :scope, NEVER .mna-shell */
    min-height: calc(100vh - 50px);   /* Layout A — see §6.5 */
    background: var(--bg);
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  }

  :scope.collapsed { /* root modifier classes use :scope.<modifier> */ }

  /* All these only match inside .mna-shell — they cannot leak */
  .panel { padding: 16px; border-radius: 8px; }
  button { font: inherit; cursor: pointer; }
  .card-title { font-weight: 700; }
}
```

**⚠️ Inside `@scope (.mna-shell) { ... }`, never write `.mna-shell { ... }` to style the root element.** A bare class selector is implicitly prefixed with a descendant combinator (so `.mna-shell` becomes "a `.mna-shell` descendant of `.mna-shell`") — it does NOT match the scope root itself. See Gotcha G10.

#### Pattern B: Manual class-prefix on every selector (used by `french`)

Every selector starts with the root class. More verbose but works in browsers that don't fully support `@scope` (rare in 2024+).

```css
.mna-shell {
  --bg: #f6f8fb;
  min-height: calc(100vh - 50px);
}
.mna-shell .panel { padding: 16px; }
.mna-shell button { font: inherit; }
```

#### Pattern C: Variables on the root class + prefixed class names (used by `translator`, `ai_practice`)

If you can't use `@scope` but don't want to prefix every selector, prefix all variable names AND class names instead.

```css
.mna-shell {
  --mna-bg: #f6f8fb;          /* prefix var names so they can't collide */
  --mna-accent: #2563eb;
  background: var(--mna-bg);
}
.mna-panel { padding: 16px; }   /* prefix class names instead of scoping */
.mna-card-title { font-weight: 700; }
```

### 6.5 Layout — Layout A vs Layout B

#### Layout A: scrollable single-page (Bible, AI Practice, Quiz)

Your content is variable-length; the user scrolls naturally. `dh-shell-content` becomes the scroll container.

```css
.mna-shell {
  min-height: calc(100vh - 50px);   /* fill the content area at minimum */
  padding: 32px;                     /* your layout */
}
```

The `50px` is a rough upper bound for `dh-shell-bar`. Precision doesn't matter — `min-height` is a floor, your content can be taller and the parent scrolls.

#### Layout B: fixed-height columns with independent scrolling (French, Translator)

Each column scrolls independently; the app consumes the viewport height exactly.

```css
.mna-shell {
  flex: 1;                          /* fills dh-shell-content */
  min-height: 0;                    /* lets it actually shrink-fit */
  overflow: hidden;                 /* no app-level scrollbar */
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr) 400px;
  grid-template-rows: 1fr;          /* CRITICAL — see Gotcha G3 */
}

.mna-shell .left-rail,
.mna-shell .center,
.mna-shell .right-rail {
  overflow-y: auto;                 /* each column scrolls itself */
  min-width: 0;                     /* prevents grid blowout from long text */
}
```

**Why `grid-template-rows: 1fr` is critical**: without it, the implicit grid row sizes to its tallest content (the center). All three columns stretch to that height, so their `overflow-y: auto` has nothing to scroll inside. With `1fr`, the row equals the grid's height exactly, and columns activate their own scrollbars.

**Why `flex: 1; min-height: 0` is critical**: this gives your app root a *definite* height (= the remaining space in `dh-shell-content`). `grid-template-rows: 1fr` requires a definite parent height to work.

---

## 7. Shared infrastructure

### 7.1 TTS playback — `shared/useTts`

If your app plays audio, use the shared hook. **Do not reinvent.**

```jsx
import { useTts, isTtsCancelled } from "../../shared/useTts";

function MyApp() {
  const { play, stop, speakingKey, loadingKey, error } = useTts();

  async function speak(text, key) {
    try {
      await play({
        key,                        // string used for UI highlight
        waitForEnd: false,           // true if you need to await full playback
        getUrl: async () => {
          const data = await fetch(...).then((r) => r.json());
          return { url: data.audio_url };
          // OR for blob: { url: URL.createObjectURL(blob), revokeOnEnd: true }
        },
      });
    } catch (err) {
      if (!isTtsCancelled(err)) {
        // hook already populated `error` state — usually nothing more to do
      }
    }
  }

  // Use in JSX:
  // <button onClick={() => speak(text, "btn-1")} disabled={!!loadingKey}>
  //   {speakingKey === "btn-1" ? "playing" : "play"}
  // </button>
}
```

Hook guarantees:
- Only ONE `<audio>` plays at a time across the whole app.
- Starting a new `play()` cancels any in-flight previous one (the awaiting caller receives `TtsCancelled`).
- Object URLs auto-revoked when you pass `revokeOnEnd: true`.
- Unmount cleanup is automatic.

State returned:
- `speakingKey` — currently-playing key (`""` when idle).
- `loadingKey` — key being fetched (between request start and `audio.play()`).
- `error` — last error message, cleared on next `play()`.
- `setError(msg)` — lets you push a custom error into the same state.

For sequential playback (queue of clips), call `play({ waitForEnd: true })` inside a `for` loop. Look at `live_spanish` (per-question audio with cache hit) or `translator` (queue playback with blob URLs) for examples.

**Exception: `ai_practice` has its own `useTts` in `services/tts.js`.** That predates the shared hook and uses a `{kind, key}` tuple API. Don't touch it. New apps use `shared/useTts`.

### 7.2 Other shared utilities

- `backend/shared/tts.py`, `backend/shared/voices.py` — Edge TTS helpers
- `backend/shared/io.py` — JSON file read/write utilities
- `frontend/src/shared/styles.css` — hub UI, AppShell, design tokens (font, base color vars). **Don't add app-specific rules here.**

---

## 8. Gotchas (hard-won lessons)

### G1 — Don't use `min-height: 100vh` on your app root

`min-height: 100vh` is a floor, not a definite height. CSS Grid `1fr` rows and percentage heights silently fall back to `auto` (content-based) inside an indefinite-height container. If you use it on your app root:

- The app is at LEAST 100vh tall, but content can push it taller.
- The page body scrolls (not just internal content).
- Sticky positioning relative to the viewport breaks because the bar overlaps.

Use `min-height: calc(100vh - 50px)` (Layout A) or `flex: 1; min-height: 0` (Layout B).

### G2 — Sticky sidebars with `top: 0` cause a 40-50px jump

If you put `position: sticky; top: 0` on a sidebar, it tries to stick to the viewport top — but `dh-shell-bar` is already there. As the user scrolls, the sidebar slides from its initial position (below the bar) to `top: 0` (under the bar). Visually that's a 40-50px "jump" that feels broken.

Better: don't use sticky for sidebars in this codebase. Use Layout B (fixed-height grid with `grid-template-rows: 1fr`) — sidebars stay in place because the grid itself is fixed-height, not because of sticky.

### G3 — CSS Grid `1fr` rows need a definite container height

```css
.parent {
  display: grid;
  grid-template-rows: 1fr;     /* requires .parent to have a definite height */
}
```

If `.parent` has `min-height: 100vh` (indefinite), `1fr` falls back to `auto` and your row sizes to content, not to the grid. To make `1fr` work, the chain must be: `definite container → flex: 1 child → flex: 1 child → ...`. The setup in this codebase already does this:

```
dh-shell        height: 100vh                       (DEFINITE)
└─ dh-shell-content   flex: 1; min-height: 0         (definite — gets full available height)
   └─ your app         flex: 1; min-height: 0        (definite)
      grid              grid-template-rows: 1fr      (WORKS NOW)
```

If you break any link in this chain, downstream grids and percentages stop working.

### G4 — Don't bake the bar height into your CSS

You may see `calc(100vh - 50px)` in older apps. The `50px` is an estimate of `dh-shell-bar`'s height. It's not precise (actual is closer to ~41px depending on font rendering). For Layout B you don't need to know it at all — `flex: 1` figures it out.

If you need to estimate for Layout A: use `calc(100vh - 50px)` as a rough floor. Don't try to be more precise.

### G5 — Never edit `shared/styles.css` for app-specific rules

`shared/styles.css` contains:
- Hub UI (`.hub-root`, `.hub-card`, ...)
- AppShell (`.dh-shell`, `.dh-shell-bar`, `.dh-shell-content`)
- Global design tokens on `:root` (font, base colors)

Do NOT add app-specific selectors or variables there. If you want a "shared pattern" between apps, copy it. Sharing CSS across apps was the original problem this architecture solves.

### G6 — Use `services/api.js`, not inline `fetch()`

Every `/api/<your-app>/*` call goes through a named export from `services/api.js`. App.jsx imports them. Reasons:
- Backend path changes are a one-line edit.
- Adding retry / auth / interceptors is a one-place edit.
- App.jsx stays focused on UI.
- Other AI assistants reading the code don't have to scan App.jsx for endpoint URLs.

### G7 — Don't import another app's code

Apps are siblings. If you find yourself wanting `import { foo } from "../another_app/..."`, the thing belongs in `frontend/src/shared/` or `backend/shared/`. Cross-app imports create coupling that breaks the isolation guarantee.

### G8 — Don't put `:root { --var: ... }` at the top of your CSS

`:root` is global. Variables defined there are visible to every app on the page. Even with prefixed names (`--mna-bg`), it pollutes browser DevTools and signals bad isolation. Move them inside `@scope (...) { :scope { ... } }` (Pattern A) or onto the root class (Pattern C). This was a real bug we fixed in `ai_practice`'s and `translator`'s CSS.

### G9 — Don't add global `*` or `button` rules

These reset/normalize rules used to be at the top of CSS files. They leak to every other app. Wrap them inside `@scope (.your-shell) { * { ... } }` or just delete them — most apps don't need them.

### G10 — Inside `@scope (.X)`, use `:scope` for the root, not `.X`

This is a CSS-spec subtlety that has bitten us once and will bite you again:

```css
/* WRONG — does NOT style the .mna-shell root */
@scope (.mna-shell) {
  .mna-shell {
    display: grid;
    grid-template-columns: 280px 1fr;
  }
}
```

Inside `@scope (X)`, a bare selector is implicitly relative-scoped — the engine prepends `:scope <descendant>` to it. So `.mna-shell` becomes "a `.mna-shell` descendant of the scope root", which matches nothing in a flat tree. The grid declaration silently doesn't apply, and your layout collapses (sidebar drops to full-width block, looks like the left column disappeared).

```css
/* RIGHT — :scope explicitly references the scope root */
@scope (.mna-shell) {
  :scope {
    display: grid;
    grid-template-columns: 280px 1fr;
  }
  :scope.sidebar-collapsed {
    grid-template-columns: 60px 1fr;
  }
}
```

Rule of thumb inside `@scope (.X)`:
- **Root element styling** → `:scope { ... }`
- **Root element with modifier class** → `:scope.modifier { ... }`
- **Descendants** → `.descendant { ... }` (works normally)

If your CSS has `.X` selectors inside `@scope (.X) { ... }`, replace them with `:scope`.

---

## 9. Verification checklist

Before marking a new app "done", run through this list. **Each item is a real failure mode we've seen.**

### Backend

- [ ] `GET /api/health` lists your app slug in the `apps` array
- [ ] `GET /api/<your-app>/<some-endpoint>` returns expected JSON
- [ ] No new files in `backend/data/` outside your own `<YourApp>/` folder
- [ ] No new entries in `backend/shared/` unless they're genuinely shared

### Frontend — routing

- [ ] Hub `/` shows your app card with correct icon, title, accent
- [ ] Clicking the card navigates to `/<your-app>`
- [ ] Top bar shows "主页 / <Your App>" with your accent color
- [ ] "主页" link returns to `/`
- [ ] Direct URL access to `/<your-app>` works (lazy import resolves)

### Frontend — CSS isolation

- [ ] DevTools → inspect `<html>` on the hub `/`. Your app's `--vars` should NOT appear on `:root`.
- [ ] Switch to your app, then back to another app. The other app's UI is pixel-identical to before — no resized buttons, no shifted colors.
- [ ] `grep -n "^\(\*\|button\|body\|html\|:root\)" frontend/src/apps/<your-app>/styles.css` returns either no matches, or only matches inside `@scope { ... }` blocks.
- [ ] If using Pattern A (`@scope`): no `.<your-shell-class>` selectors inside the `@scope` body — only `:scope`. (`.X` inside `@scope (.X)` does NOT match the root; see Gotcha G10.)

### Frontend — layout

- [ ] At ≥ 1280px viewport: no horizontal scrollbar on `<body>`
- [ ] At Layout B: scrolling the center column does NOT move the sidebars
- [ ] At Layout A: scrolling works smoothly, no overlap with `dh-shell-bar`
- [ ] No console errors about React keys, hydration, or missing imports

### Frontend — code structure

- [ ] `grep -n "fetch(\`/api/" frontend/src/apps/<your-app>/App.jsx` returns nothing — all fetches are in `services/api.js`.
- [ ] `grep -n "const API_BASE" frontend/src/apps/<your-app>/App.jsx` returns nothing.
- [ ] If using TTS: `grep -n "new Audio(" frontend/src/apps/<your-app>/App.jsx` returns nothing — `useTts` owns the audio element.
- [ ] No imports from sibling apps (`from "../other_app/..."`)

---

## 10. When in doubt — reference the closest existing app

Copy structure, not code. Each existing app is well-isolated, so copying its patterns is safe:

| If your app is... | Look at | Why |
|---|---|---|
| Scrollable single-page, dense content | `bible/` | Simple, clean Pattern A scoping |
| Scrollable with rich editor | `ai_practice/` | TipTap-style editor, complex state |
| 3-column with sticky-feel sidebar + content | `french/` | Most refined Layout B implementation |
| 3-column with rich sidebar | `language_lab/` | Pattern A with three rails |
| 2-column quiz/study tool | `translator/`, `ai_practice/` | Layout B with sidebar + main |
| Multi-question quiz with per-Q audio | `live_spanish/` | TTS with caching, full Pattern A |
| Sequence-based learning (questions/blocks) | `quiz/` | Clean Pattern A, progress tracking |

Don't copy multiple at once — pick the closest match and adapt.

---

## 11. If you (the AI) think you need to deviate from this doc

Stop. Explain the deviation in your response to the user before writing code. The patterns here were tuned over multiple debugging sessions; deviations usually mean a misunderstanding of why something exists, not a real new requirement.

Common bad deviations:
- "I'll just put a `:root` variable for convenience" → no, use Pattern A or C
- "I'll use `position: sticky; top: 0` on the sidebar" → no, use Layout B
- "I'll inline the fetch since it's just one call" → no, use `services/api.js`
- "I'll add a global CSS reset since this app needs it" → no, scope it under `@scope`
- "I'll copy the TTS code from french into my app" → no, use `shared/useTts`

If after reading this doc you genuinely believe a new pattern is needed, propose it to the user before implementing.
