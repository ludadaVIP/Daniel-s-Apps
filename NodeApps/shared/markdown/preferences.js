export const FONT_OPTIONS = [
  { id: 'system', label: '系统默认', family: null },
  { id: 'yahei', label: '微软雅黑', family: '"Microsoft YaHei", "微软雅黑", sans-serif' },
  { id: 'arial', label: 'Arial', family: 'Arial, sans-serif' },
  { id: 'calibri', label: 'Calibri', family: 'Calibri, "Microsoft YaHei", sans-serif' },
  { id: 'times', label: 'Times New Roman', family: '"Times New Roman", "Songti SC", serif' },
  { id: 'kaiti', label: '楷体', family: 'KaiTi, "楷体", STKaiti, serif' },
];

export const PREFERENCE_KEY = 'nodeapps.markdown.reader.v1';
export const PREFERENCE_EVENT = 'nodeapps:markdown-reader-preference';
export const DEFAULT_PREFERENCES = Object.freeze({ font: 'system', size: 100 });

export function normalizePreferences(value) {
  const font = FONT_OPTIONS.some((option) => option.id === value?.font) ? value.font : DEFAULT_PREFERENCES.font;
  const size = Number(value?.size);
  return {
    font,
    size: Number.isFinite(size) ? Math.min(160, Math.max(80, Math.round(size / 10) * 10)) : DEFAULT_PREFERENCES.size,
  };
}

export function readPreferences() {
  try {
    return normalizePreferences(JSON.parse(window.localStorage.getItem(PREFERENCE_KEY)));
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export function writePreferences(value) {
  const next = normalizePreferences(value);
  try { window.localStorage.setItem(PREFERENCE_KEY, JSON.stringify(next)); } catch { /* Reading still works without storage. */ }
  window.dispatchEvent(new CustomEvent(PREFERENCE_EVENT, { detail: next }));
  return next;
}
