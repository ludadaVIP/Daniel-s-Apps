import { BookOpen } from "lucide-react";

import {
  SHELF_GROUP_BY_ID,
  SHELF_GROUP_ORDER,
} from "./shelfModel";
import "./bookLibraryHome.css";

function shelvesByGroup(shelves) {
  return SHELF_GROUP_ORDER.map((groupId) => {
    const groupedShelves = shelves.filter((shelf) => {
      if (shelf.id === "_unfiled") return groupId === "post";
      return (shelf.group || "pre") === groupId;
    }).filter((shelf) => shelf.books?.length);

    return { groupId, shelves: groupedShelves };
  }).filter((group) => group.shelves.length);
}

/** A compact, browse-first landing page shared by both reading apps. */
export default function BookLibraryHome({
  shelves,
  totalBooks,
  activeBookId,
  appName,
  onSelectBook,
  onCreateBook,
}) {
  const groups = shelvesByGroup(shelves);
  const shelfEntries = groups.flatMap(({ groupId, shelves: groupedShelves }) => (
    groupedShelves.map((shelf) => ({ ...shelf, groupId }))
  ));

  if (!totalBooks) {
    return (
      <section className="book-library-home book-library-empty">
        <BookOpen size={40} aria-hidden="true" />
        <h2>书架还是空的</h2>
        <p>新建第一本书后，它会自动出现在这里。</p>
        <button type="button" onClick={onCreateBook}>添加第一本书</button>
      </section>
    );
  }

  return (
    <section className="book-library-home" aria-label={`${appName} 全部书目`}>
      <div className="book-library-groups">
        {shelfEntries.map((shelf) => (
          <section className={`book-library-shelf is-${shelf.groupId}`} key={shelf.id}>
            <h3>
              <span className="book-library-stage">{SHELF_GROUP_BY_ID[shelf.groupId]?.label || "书架"}</span>
              {shelf.name}<span className="book-library-count">{shelf.books.length}</span>
            </h3>
            <div className="book-library-list">
              {shelf.books.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={activeBookId === item.id ? "is-active" : ""}
                  onClick={() => onSelectBook(item.id)}
                  title={`打开《${item.title}》`}
                >
                  <span className="book-library-book-text">
                    <strong>{item.title}</strong>
                    <small>{item.author || "作者未填写"}</small>
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
