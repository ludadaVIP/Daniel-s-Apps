import { useEffect, useRef, useState } from "react";
import { AlertTriangle, FilePlus2, FolderPlus, Pencil, Trash2, X } from "lucide-react";

const DETAILS = {
  "new-category": { eyebrow: "CATEGORY", title: "新建分类", label: "分类名称", action: "创建分类", Icon: FolderPlus },
  "rename-category": { eyebrow: "CATEGORY", title: "重命名分类", label: "分类名称", action: "保存名称", Icon: Pencil },
  "delete-category": { eyebrow: "DELETE CATEGORY", title: "删除分类？", action: "删除分类", Icon: Trash2, danger: true },
  "new-doc": { eyebrow: "MARKDOWN", title: "新建 Markdown", label: "文档标题", action: "创建文档", Icon: FilePlus2 },
  "delete-doc": { eyebrow: "DELETE DOCUMENT", title: "删除文档？", action: "删除文档", Icon: Trash2, danger: true },
  discard: { eyebrow: "UNSAVED CHANGES", title: "离开当前文档？", action: "放弃修改并离开", Icon: AlertTriangle, danger: true },
};

export default function ActionDialog({ dialog, pending, error, onCancel, onSubmit }) {
  const elementRef = useRef(null);
  const inputRef = useRef(null);
  const [name, setName] = useState(dialog.name || "");
  const details = DETAILS[dialog.kind];
  const isNameDialog = Boolean(details.label);

  useEffect(() => {
    const element = elementRef.current;
    element.showModal();
    if (isNameDialog) inputRef.current?.focus();
    return () => element.close();
  }, [isNameDialog]);

  let description = "";
  if (dialog.kind === "delete-category") {
    const count = dialog.category.documents.length;
    description = `“${dialog.category.name}”中的 ${count} 个 Markdown 文件也会永久删除。`;
  } else if (dialog.kind === "delete-doc") {
    description = `“${dialog.document.title}”对应的 .md 文件会永久删除。`;
  } else if (dialog.kind === "discard") {
    description = "当前文档有未保存的修改。离开后，这些修改会丢失。";
  } else if (dialog.kind === "new-doc") {
    description = `文档将保存在“${dialog.categoryName}”分类中。`;
  } else if (dialog.kind === "rename-category") {
    description = "分类中的 Markdown 文件会保留。";
  } else {
    description = "为 Markdown 文件创建一个新的收纳位置。";
  }

  return (
    <dialog
      ref={elementRef}
      className="smd-dialog"
      aria-labelledby="smd-dialog-title"
      aria-describedby="smd-dialog-description"
      onCancel={(event) => { event.preventDefault(); if (!pending) onCancel(); }}
      onClick={(event) => { if (event.target === event.currentTarget && !pending) onCancel(); }}
    >
      <form onSubmit={(event) => { event.preventDefault(); onSubmit(isNameDialog ? name.trim() : ""); }}>
        <div className="smd-dialog-top">
          <span className={details.danger ? "smd-dialog-mark is-danger" : "smd-dialog-mark"}><details.Icon size={20} /></span>
          <button type="button" className="smd-dialog-close" onClick={onCancel} disabled={pending} aria-label="关闭弹窗"><X size={17} /></button>
        </div>
        <p className="smd-dialog-eyebrow">SAVE MD / {details.eyebrow}</p>
        <h2 id="smd-dialog-title">{details.title}</h2>
        <p id="smd-dialog-description" className="smd-dialog-description">{description}</p>
        {isNameDialog && (
          <label className="smd-dialog-field">
            <span>{details.label}</span>
            <input ref={inputRef} value={name} onChange={(event) => setName(event.target.value)} maxLength={80} required disabled={pending} placeholder={details.label} />
          </label>
        )}
        {error && <p className="smd-dialog-error" role="alert">{error}</p>}
        <div className="smd-dialog-actions">
          <button type="button" className="smd-dialog-secondary" onClick={onCancel} disabled={pending}>取消</button>
          <button type="submit" className={details.danger ? "smd-dialog-primary is-danger" : "smd-dialog-primary"} disabled={pending || (isNameDialog && !name.trim())}>
            {pending ? "处理中…" : details.action}
          </button>
        </div>
      </form>
    </dialog>
  );
}
