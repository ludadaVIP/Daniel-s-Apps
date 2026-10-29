export const WATCH_UNCLASSIFIED_ID = "uncategorized";

export const DEFAULT_WATCH_CATEGORIES = [
  { id: "potential", name: "潜力股" },
  { id: "veteran", name: "老登股" },
  { id: "observe-only", name: "只看不买股" },
  { id: WATCH_UNCLASSIFIED_ID, name: "未分类" },
];

export function cloneDefaultWatchCategories() {
  return DEFAULT_WATCH_CATEGORIES.map((category) => ({ ...category }));
}

export function watchCategoryId(watch, categories = DEFAULT_WATCH_CATEGORIES) {
  const savedId = watch?.watchCategoryId;
  return categories.some((category) => category.id === savedId)
    ? savedId
    : WATCH_UNCLASSIFIED_ID;
}
