#!/usr/bin/env node
/**
 * One-shot tweak: apply the same hero/player/IPA compaction rules to all
 * vocab-app stylesheets so Esp / Eng / French (and a future German Vocab)
 * stay visually consistent. Per-app theme colors stay intact — only the
 * shared layout numbers change.
 *
 * Run from repo root:
 *   node frontend/scripts/compact_vocab_hero.js
 */

const fs = require("fs");
const path = require("path");

const apps = [
  { prefix: "esv", file: "frontend/src/apps/esp_vocab/styles.css" },
  { prefix: "env", file: "frontend/src/apps/eng_vocab/styles.css" },
  { prefix: "frv", file: "frontend/src/apps/french_vocab/styles.css" },
];

const root = path.resolve(__dirname, "..", "..");

function patch(text, prefix) {
  const p = prefix;
  let out = text;

  // 1. Hero grid: 50/50 instead of flexible left + fixed right.
  out = out.replace(
    new RegExp(
      `\\.${p}-hero \\{\\s*display: grid;\\s*grid-template-columns: minmax\\(0, 1fr\\) minmax\\(280px, 360px\\);\\s*gap: 20px;\\s*margin-bottom: 18px;\\s*\\}`,
      "m",
    ),
    `.${p}-hero {\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n    gap: 16px;\n    margin-bottom: 14px;\n  }`,
  );

  // 2. Hero-main: flex column + tighter padding.
  out = out.replace(
    new RegExp(
      `\\.${p}-hero-main \\{\\s*padding: 24px 26px;\\s*position: relative;\\s*overflow: hidden;\\s*\\}`,
      "m",
    ),
    `.${p}-hero-main {\n    display: flex;\n    flex-direction: column;\n    padding: 14px 20px;\n    position: relative;\n    overflow: hidden;\n  }`,
  );

  // 3. Shrink the decorative glow so it doesn't overshadow the small hero.
  out = out.replace(
    /width: 220px; height: 220px;/,
    `width: 140px; height: 140px;`,
  );

  // 4. Hero h1: smaller, no top margin (meta chips sit above now).
  out = out.replace(
    new RegExp(
      `\\.${p}-hero h1 \\{\\s*margin: 10px 0 8px;\\s*color: var\\(--ink\\);\\s*font-size: 30px;\\s*line-height: 1\\.1;\\s*font-weight: 900;\\s*font-family: ([^;]+);\\s*\\}`,
      "m",
    ),
    (_, family) =>
      `.${p}-hero h1 {\n    margin: 0;\n    color: var(--ink);\n    font-size: 22px;\n    line-height: 1.2;\n    font-weight: 900;\n    font-family: ${family};\n  }`,
  );

  // 5. Meta row: lives at the top now, small bottom margin, no top margin.
  out = out.replace(
    new RegExp(
      `\\.${p}-meta-row \\{ display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; \\}`,
    ),
    `.${p}-meta-row { display: flex; flex-wrap: wrap; gap: 6px; margin: 0 0 10px; }`,
  );
  out = out.replace(
    new RegExp(
      `\\.${p}-meta-row span \\{\\s*display: inline-flex; align-items: center; gap: 6px;\\s*min-height: 28px;\\s*padding: 0 10px;`,
    ),
    `.${p}-meta-row span {\n    display: inline-flex; align-items: center; gap: 5px;\n    min-height: 24px;\n    padding: 0 9px;`,
  );

  // 6. Player container: tighter padding + gap.
  out = out.replace(
    new RegExp(
      `\\.${p}-player \\{\\s*display: flex;\\s*flex-direction: column;\\s*justify-content: space-between;\\s*gap: 18px;\\s*padding: 18px;\\s*\\}`,
      "m",
    ),
    `.${p}-player {\n    display: flex;\n    flex-direction: column;\n    justify-content: space-between;\n    gap: 10px;\n    padding: 12px 16px;\n  }`,
  );

  // 7. Player status: secondary info, much smaller than before.
  out = out.replace(
    new RegExp(
      `\\.${p}-player-status \\{ display: grid; gap: 4px; \\}\\s*\\.${p}-player-status span \\{ color: var\\(--ink\\); font-size: 16px; font-weight: 850; \\}`,
    ),
    `.${p}-player-status { display: grid; gap: 2px; }\n  .${p}-player-status span { color: var(--muted); font-size: 11.5px; font-weight: 700; letter-spacing: 0.2px; }`,
  );
  out = out.replace(
    new RegExp(
      `\\.${p}-player-status small \\{ color: var\\(--muted\\); font-size: 12\\.5px; \\}`,
    ),
    `.${p}-player-status small { color: var(--muted-2); font-size: 10.5px; }`,
  );

  // 8. Player buttons: shorter, slightly smaller font/gap.
  out = out.replace(
    new RegExp(
      `\\.${p}-player-actions \\{\\s*display: grid;\\s*grid-template-columns: minmax\\(0, 1fr\\) minmax\\(0, 1fr\\) 44px;\\s*grid-template-rows: repeat\\(2, minmax\\(42px, auto\\)\\);\\s*gap: 10px;\\s*\\}`,
      "m",
    ),
    `.${p}-player-actions {\n    display: grid;\n    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 38px;\n    grid-template-rows: repeat(2, minmax(34px, auto));\n    gap: 8px;\n  }`,
  );
  out = out.replace(
    new RegExp(
      `\\.${p}-lemma-button, \\.${p}-primary-button, \\.${p}-secondary-button, \\.${p}-stop-button \\{\\s*display: inline-flex; align-items: center; justify-content: center; gap: 6px;\\s*min-width: 0;\\s*min-height: 40px;\\s*border-radius: 9px;\\s*font-size: 13px;\\s*font-weight: 800;`,
    ),
    `.${p}-lemma-button, .${p}-primary-button, .${p}-secondary-button, .${p}-stop-button {\n    display: inline-flex; align-items: center; justify-content: center; gap: 5px;\n    min-width: 0;\n    min-height: 32px;\n    border-radius: 8px;\n    font-size: 12px;\n    font-weight: 800;`,
  );

  // 9. IPA: bigger and pushed away from the lemma.
  out = out.replace(
    new RegExp(
      `\\.${p}-word-ipa \\{\\s*color: var\\(--muted-2\\);\\s*font-size: 13px;\\s*font-style: italic;\\s*\\}`,
      "m",
    ),
    `.${p}-word-ipa {\n    margin-left: 14px;\n    color: var(--muted-2);\n    font-size: 18px;\n    font-weight: 600;\n    font-style: italic;\n    letter-spacing: 0.2px;\n  }`,
  );

  return out;
}

let allOk = true;
for (const app of apps) {
  const full = path.join(root, app.file);
  const original = fs.readFileSync(full, "utf8");
  const patched = patch(original, app.prefix);
  if (patched === original) {
    console.warn(`! no changes applied to ${app.file} (already patched?)`);
    allOk = false;
    continue;
  }
  fs.writeFileSync(full, patched, "utf8");
  console.log(`wrote ${app.file}`);
}

process.exit(allOk ? 0 : 0);
