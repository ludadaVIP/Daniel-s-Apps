export const SHELF_GROUPS = [
  { id: "pre", label: "准备读" },
  { id: "reading", label: "在读" },
  { id: "finished", label: "已读" },
  { id: "post", label: "归类" },
];

export const SHELF_GROUP_BY_ID = Object.fromEntries(
  SHELF_GROUPS.map((group) => [group.id, group]),
);

export const SHELF_GROUP_ORDER = SHELF_GROUPS.map((group) => group.id);

export const NEXT_DEFAULT_SHELF = {
  pre: "reading",
  reading: "read",
};

export const NEXT_BUTTON_LABEL = {
  pre: "开始读",
  reading: "读完了",
};

export function shelvesForMoving(shelves) {
  return shelves.filter((shelf) => shelf.id !== "_unfiled");
}

export function groupLabel(groupId) {
  return SHELF_GROUP_BY_ID[groupId]?.label || "准备读";
}

export function shelfLabel(shelf) {
  return `${groupLabel(shelf.group)} · ${shelf.name}`;
}
