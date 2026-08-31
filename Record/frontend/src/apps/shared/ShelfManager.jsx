import { useEffect, useMemo, useState } from "react";
import { FolderPlus, Save, Trash2 } from "lucide-react";

import { SHELF_GROUPS, shelfLabel, shelvesForMoving } from "./shelfModel";
import "./shelfManager.css";

function initialDrafts(shelves) {
  return Object.fromEntries(
    shelvesForMoving(shelves).map((shelf) => [shelf.id, {
      name: shelf.name,
      group: shelf.group || "pre",
      moveTo: shelvesForMoving(shelves).find((other) => other.id !== shelf.id)?.id || "",
    }]),
  );
}

export default function ShelfManager({ shelves, onCreate, onUpdate, onDelete }) {
  const editableShelves = useMemo(() => shelvesForMoving(shelves), [shelves]);
  const [newName, setNewName] = useState("");
  const [newGroup, setNewGroup] = useState("pre");
  const [drafts, setDrafts] = useState(() => initialDrafts(shelves));
  const [savingId, setSavingId] = useState("");

  useEffect(() => setDrafts(initialDrafts(shelves)), [shelves]);

  const changeDraft = (shelfId, patch) => {
    setDrafts((current) => ({
      ...current,
      [shelfId]: { ...current[shelfId], ...patch },
    }));
  };

  const submitNew = async (event) => {
    event.preventDefault();
    if (!newName.trim()) return;
    setSavingId("new");
    try {
      await onCreate({ name: newName.trim(), group: newGroup });
      setNewName("");
      setNewGroup("pre");
    } finally {
      setSavingId("");
    }
  };

  const saveShelf = async (shelf) => {
    const draft = drafts[shelf.id];
    if (!draft || !draft.name.trim()) return;
    setSavingId(shelf.id);
    try {
      await onUpdate(shelf, { name: draft.name.trim(), group: draft.group });
    } finally {
      setSavingId("");
    }
  };

  const removeShelf = async (shelf) => {
    const draft = drafts[shelf.id];
    if (!draft?.moveTo) return;
    const destination = editableShelves.find((item) => item.id === draft.moveTo);
    if (!destination) return;
    if (!window.confirm(`删除书架「${shelf.name}」？其中的书会移到「${destination.name}」。`)) return;
    setSavingId(shelf.id);
    try {
      await onDelete(shelf, destination.id);
    } finally {
      setSavingId("");
    }
  };

  return (
    <div className="shelf-manager">
      <p className="shelf-manager-intro">
        阅读流程只是快捷方式；每本书都可随时移动到任意书架。书架可改名、调整所属阶段或删除。
      </p>

      <form className="shelf-manager-create" onSubmit={submitNew}>
        <input
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          placeholder="新书架名称"
          aria-label="新书架名称"
        />
        <select value={newGroup} onChange={(event) => setNewGroup(event.target.value)} aria-label="新书架所属阶段">
          {SHELF_GROUPS.map((group) => <option key={group.id} value={group.id}>{group.label}</option>)}
        </select>
        <button type="submit" disabled={!newName.trim() || savingId === "new"}>
          <FolderPlus size={15} /> 新建
        </button>
      </form>

      <div className="shelf-manager-list">
        {editableShelves.map((shelf) => {
          const draft = drafts[shelf.id] || {};
          const isOnlyShelf = editableShelves.length <= 1;
          const changed = draft.name?.trim() !== shelf.name || draft.group !== (shelf.group || "pre");
          return (
            <section className="shelf-manager-row" key={shelf.id}>
              <div className="shelf-manager-fields">
                <input
                  value={draft.name || ""}
                  onChange={(event) => changeDraft(shelf.id, { name: event.target.value })}
                  aria-label={`${shelf.name} 的名称`}
                />
                <select
                  value={draft.group || "pre"}
                  onChange={(event) => changeDraft(shelf.id, { group: event.target.value })}
                  aria-label={`${shelf.name} 的所属阶段`}
                >
                  {SHELF_GROUPS.map((group) => <option key={group.id} value={group.id}>{group.label}</option>)}
                </select>
                <button type="button" onClick={() => saveShelf(shelf)} disabled={!changed || !draft.name?.trim() || savingId === shelf.id}>
                  <Save size={14} /> 保存
                </button>
              </div>
              <div className="shelf-manager-delete">
                <span>删除后移到</span>
                <select
                  value={draft.moveTo || ""}
                  onChange={(event) => changeDraft(shelf.id, { moveTo: event.target.value })}
                  disabled={isOnlyShelf}
                  aria-label={`删除 ${shelf.name} 后的迁移目标`}
                >
                  {editableShelves.filter((item) => item.id !== shelf.id).map((item) => (
                    <option key={item.id} value={item.id}>{shelfLabel(item)}</option>
                  ))}
                </select>
                <button type="button" className="shelf-manager-remove" onClick={() => removeShelf(shelf)} disabled={isOnlyShelf || !draft.moveTo || savingId === shelf.id}>
                  <Trash2 size={14} /> 删除
                </button>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export function ShelfManagerDialog({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="shelf-manager-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="shelf-manager-modal" role="dialog" aria-modal="true" aria-label="管理书架" onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <div>
            <h3>管理书架</h3>
            <p>统一管理所有书架与书籍去向</p>
          </div>
          <button type="button" className="shelf-manager-modal-close" onClick={onClose} aria-label="关闭">×</button>
        </header>
        {children}
      </section>
    </div>
  );
}
