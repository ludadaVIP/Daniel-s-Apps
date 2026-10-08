import { lessonCatalog } from './catalog';
import { catalogEntry, type LessonPack } from './catalogEntry';
import { lessonPacks } from './packs';
import type { Lesson } from './schema';

type PackLoaders = Record<LessonPack, () => Promise<Lesson[]>>;

// A failed request is not cached: the learner can retry without losing a draft.
export function createLessonLoader(loaders: PackLoaders = lessonPacks) {
  const requests = new Map<LessonPack, Promise<Lesson[]>>();
  const loaded = new Map<string, Lesson>();
  async function load(id: string): Promise<Lesson | undefined> {
    const entry = lessonCatalog.find((lesson) => lesson.id === id);
    if (!entry) return undefined;
    if (loaded.has(id)) return loaded.get(id);
    let request = requests.get(entry.pack);
    if (!request) {
      request = loaders[entry.pack]().then((lessons) => {
        const expected = lessonCatalog.filter((l) => l.pack === entry.pack);
        if (
          lessons.length !== expected.length ||
          new Set(lessons.map((lesson) => lesson.id)).size !== lessons.length
        )
          throw new Error('Lesson pack does not match its catalog');
        for (const summary of expected) {
          const lesson = lessons.find((l) => l.id === summary.id);
          if (
            !lesson ||
            JSON.stringify(catalogEntry(lesson, entry.pack)) !==
              JSON.stringify(summary)
          ) {
            throw new Error('Lesson content does not match its catalog');
          }
        }
        // Commit only after the entire pack passes; a bad sibling is not cached.
        for (const lesson of lessons) loaded.set(lesson.id, lesson);
        return lessons;
      });
      requests.set(entry.pack, request);
      request.catch(() => {
        if (requests.get(entry.pack) === request) requests.delete(entry.pack);
      });
    }
    await request;
    return loaded.get(id);
  }
  return { load, getLoaded: (id: string) => loaded.get(id) };
}

export const lessonContent = createLessonLoader();
