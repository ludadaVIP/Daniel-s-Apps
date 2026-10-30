import { useState } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { WATCH_UNCLASSIFIED_ID } from "./watch-categories.js";

const cleanName = (value) => value.trim().replace(/\s+/g, " ");

export function WatchCategoryManager({ categories, counts, busy, onAdd, onRename, onDelete }) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [destinationId, setDestinationId] = useState("");

  const isDuplicate = (name, exceptId) => categories.some((category) =>
    category.id !== exceptId && category.name.toLocaleLowerCase() === cleanName(name).toLocaleLowerCase(),
  );

  const add = async (event) => {
    event.preventDefault();
    const name = cleanName(newName);
    if (!name || name.length > 24 || isDuplicate(name)) return;
    if (await onAdd(name)) setNewName("");
  };

  const saveRename = async (event, category) => {
    event.preventDefault();
    const name = cleanName(editingName);
    if (!name || name.length > 24 || isDuplicate(name, category.id)) return;
    if (await onRename(category.id, name)) setEditingId(null);
  };

  const beginDelete = (category) => {
    setDeletingId(category.id);
    setDestinationId(categories.find((item) => item.id !== category.id)?.id || "");
  };

  const finishDelete = async (category) => {
    if ((counts[category.id] || 0) > 0 && !destinationId) return;
    if (await onDelete(category.id, destinationId)) setDeletingId(null);
  };

  return (
    <div className="mh-watch-category-manager">
      <p className="mh-watch-category-manager-intro">股票分类会同时用于近期关注和决策日志。把分类改名、删除或移动股票，不会改动研究、价格或行动计划。</p>
      <form className="mh-watch-category-add" onSubmit={add}>
        <label>
          <span>新分类</span>
          <input value={newName} maxLength={24} placeholder="例如：长期观察" onChange={(event) => setNewName(event.target.value)} />
        </label>
        <button className="mh-primary" type="submit" disabled={busy || !cleanName(newName) || isDuplicate(newName)}><Plus size={15} />添加分类</button>
      </form>
      {newName && cleanName(newName).length > 24 && <p className="mh-watch-category-error" role="alert">分类名称最多 24 个字。</p>}
      {newName && isDuplicate(newName) && <p className="mh-watch-category-error" role="alert">已有同名分类。</p>}
      <div className="mh-watch-category-manager-list">
        {categories.map((category, index) => {
          const count = counts[category.id] || 0;
          const protectedCategory = category.id === WATCH_UNCLASSIFIED_ID;
          const duplicateEdit = editingId === category.id && isDuplicate(editingName, category.id);
          return (
            <section className="mh-watch-category-manager-row" key={category.id} data-tone={index % 4}>
              <span className="mh-watch-category-manager-mark" aria-hidden="true" />
              {editingId === category.id ? (
                <form className="mh-watch-category-rename" onSubmit={(event) => saveRename(event, category)}>
                  <input autoFocus value={editingName} maxLength={24} aria-label={`重命名 ${category.name}`} onChange={(event) => setEditingName(event.target.value)} />
                  <button className="mh-icon" type="submit" aria-label="保存分类名称" disabled={busy || !cleanName(editingName) || duplicateEdit}><Check size={15} /></button>
                  <button className="mh-icon" type="button" aria-label="取消重命名" onClick={() => setEditingId(null)}><X size={15} /></button>
                  {duplicateEdit && <small role="alert">已有同名分类</small>}
                </form>
              ) : (
                <div className="mh-watch-category-manager-name"><strong>{category.name}</strong><span>{count} 只股票</span></div>
              )}
              {protectedCategory
                ? <span className="mh-watch-category-system">系统兜底</span>
                : <div className="mh-watch-category-manager-actions">
                    <button className="mh-icon" type="button" aria-label={`重命名 ${category.name}`} title="重命名" disabled={busy} onClick={() => { setEditingId(category.id); setEditingName(category.name); setDeletingId(null); }}><Pencil size={14} /></button>
                    <button className="mh-icon" type="button" aria-label={`删除 ${category.name}`} title="删除分类" disabled={busy} onClick={() => beginDelete(category)}><Trash2 size={14} /></button>
                  </div>}
              {deletingId === category.id && (
                <div className="mh-watch-category-delete">
                  <span>{count ? `删除后将 ${count} 只股票移至` : "确认删除这个空分类？"}</span>
                  {count > 0 && <select aria-label="移入分类" value={destinationId} onChange={(event) => setDestinationId(event.target.value)}>
                    {categories.filter((item) => item.id !== category.id).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>}
                  <button className="mh-button" type="button" disabled={busy || (count > 0 && !destinationId)} onClick={() => finishDelete(category)}>删除</button>
                  <button className="mh-text-button" type="button" onClick={() => setDeletingId(null)}>取消</button>
                </div>
              )}
            </section>
          );
        })}
      </div>
      <p className="mh-watch-category-manager-footnote">指数和 ETF 保持单独分组；“未分类”用于尚未归类的新股票，移空后仍会保留。</p>
    </div>
  );
}
