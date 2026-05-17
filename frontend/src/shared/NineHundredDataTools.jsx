import { useMemo, useState } from "react";
import { Clipboard, FileJson, Plus, Trash2, X } from "lucide-react";

const DIFFICULTIES = ["A1-A2", "B1", "B2", "C1", "Mixed A2-B2"];

function buildPrompt(config, difficulty, focus) {
  const fields = config.fields.map((field) => `"${field}"`).join(", ");
  const exampleFields = config.fields
    .map((field) => `      "${field}": "${config.example?.[field] || `${field} text`}"`)
    .join(",\n");
  const focusLine = focus.trim() || "general real-world speaking for life, study, and school";

  return `Generate exactly 100 high-quality speaking practice sentences for ${config.appName}.

Difficulty: ${difficulty}
Focus: ${focusLine}

Return STRICT JSON ONLY. Do not wrap the JSON in markdown. Do not include comments or explanations.

Required top-level shape:
{
  "title": "Short title for this 100-sentence group",
  "level": "${difficulty}",
  "focus": "One practical sentence describing the focus",
  "sentences": [
    {
      "tag": "Short topic label",
${exampleFields}
    }
  ]
}

Hard requirements:
- The "sentences" array must contain exactly 100 objects.
- Every sentence object must include: "tag", ${fields}.
- Use valid JSON double quotes for every key and string.
- Escape inner double quotes as \\" when needed.
- Do not use single quotes for JSON strings.
- Do not use trailing commas.
- Do not number the sentences outside JSON.
- Keep each practice sentence natural, specific, and useful in real conversation.
- Avoid repetitive templates. Vary grammar, vocabulary, social situations, emotions, questions, follow-ups, academic life, errands, travel, housing, health, plans, disagreement, and problem-solving.
- Keep translations meaning-faithful but natural, not word-by-word robotic.
- Do not include extra fields unless they are useful and still valid JSON.`;
}

export function NineHundredDataTools({
  config,
  currentGroupTitle,
  deleteDisabled,
  onDelete,
  onImport,
}) {
  const [promptOpen, setPromptOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [difficulty, setDifficulty] = useState("B1");
  const [focus, setFocus] = useState("");
  const [importText, setImportText] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const prompt = useMemo(
    () => buildPrompt(config, difficulty, focus),
    [config, difficulty, focus],
  );

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    setStatus("Prompt copied.");
  };

  const submitImport = async () => {
    setBusy(true);
    setStatus("");
    try {
      const result = await onImport(importText);
      setStatus(`Imported ${result?.group?.count || 0} sentences.`);
      setImportText("");
      setImportOpen(false);
    } catch (err) {
      setStatus(err.message || "Import failed.");
    } finally {
      setBusy(false);
    }
  };

  const submitDelete = async () => {
    if (!onDelete) return;
    setBusy(true);
    setStatus("");
    try {
      const result = await onDelete();
      const deleted = result?.deletedGroupId ? `Deleted ${result.deletedGroupId}.` : "Group deleted.";
      const audio = result?.audioFilesDeleted ? ` Removed ${result.audioFilesDeleted} audio files.` : "";
      setStatus(`${deleted}${audio}`);
      setDeleteOpen(false);
    } catch (err) {
      setStatus(err.message || "Delete failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="nh-tools">
      <button className="nh-tool-button" type="button" onClick={() => setPromptOpen(true)}>
        <Plus size={16} />
        Add new 100
      </button>
      <button className="nh-tool-button" type="button" onClick={() => setImportOpen(true)}>
        <FileJson size={16} />
        Import
      </button>
      <button
        className="nh-tool-button nh-delete-button"
        type="button"
        onClick={() => setDeleteOpen(true)}
        disabled={deleteDisabled}
      >
        <Trash2 size={16} />
        Delete
      </button>
      {status && <span className="nh-tool-status">{status}</span>}

      {promptOpen && (
        <div className="nh-modal-backdrop" role="presentation">
          <section className="nh-modal" role="dialog" aria-modal="true" aria-label="Create prompt">
            <div className="nh-modal-header">
              <h2>Create a new 100-sentence prompt</h2>
              <button type="button" onClick={() => setPromptOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <label className="nh-field">
              <span>Difficulty</span>
              <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
                {DIFFICULTIES.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="nh-field">
              <span>Optional focus</span>
              <textarea
                value={focus}
                onChange={(event) => setFocus(event.target.value)}
                placeholder="Study abroad, dorm life, seminars, errands, relationships..."
              />
            </label>
            <textarea className="nh-prompt-box" readOnly value={prompt} />
            <button className="nh-primary-action" type="button" onClick={copyPrompt}>
              <Clipboard size={17} />
              Copy prompt
            </button>
          </section>
        </div>
      )}

      {importOpen && (
        <div className="nh-modal-backdrop" role="presentation">
          <section className="nh-modal" role="dialog" aria-modal="true" aria-label="Import JSON">
            <div className="nh-modal-header">
              <h2>Import JSON</h2>
              <button type="button" onClick={() => setImportOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <p className="nh-modal-note">
              Paste the JSON object or array generated from the prompt. Markdown fences are okay.
            </p>
            <textarea
              className="nh-import-box"
              value={importText}
              onChange={(event) => setImportText(event.target.value)}
              placeholder='{"title":"...","level":"B1","focus":"...","sentences":[...]}'
            />
            <button
              className="nh-primary-action"
              type="button"
              onClick={submitImport}
              disabled={busy || !importText.trim()}
            >
              <FileJson size={17} />
              {busy ? "Importing..." : "Import group"}
            </button>
          </section>
        </div>
      )}

      {deleteOpen && (
        <div className="nh-modal-backdrop" role="presentation">
          <section className="nh-modal nh-confirm-modal" role="dialog" aria-modal="true" aria-label="Delete group">
            <div className="nh-modal-header">
              <h2>Delete current 100-sentence group?</h2>
              <button type="button" onClick={() => setDeleteOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <p className="nh-modal-note">
              This will delete "{currentGroupTitle || "the current group"}", remove its JSON file, and clean up matching cached audio. This cannot be undone.
            </p>
            <div className="nh-confirm-actions">
              <button className="nh-tool-button" type="button" onClick={() => setDeleteOpen(false)}>
                Cancel
              </button>
              <button
                className="nh-primary-action nh-danger-action"
                type="button"
                onClick={submitDelete}
                disabled={busy}
              >
                <Trash2 size={17} />
                {busy ? "Deleting..." : "Delete group"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
