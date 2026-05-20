import FreeLanguageApp from "../../shared/FreeLanguageApp";
import * as api from "./services/api";

const config = {
  accent: "#b45309",
  brandMark: "FS",
  brandTitle: "Free Spanish",
  brandSubtitle: "free path, speakable",
  kicker: "Spanish / English",
  targetLanguage: { key: "es", label: "Spanish" },
  supportLanguages: [{ key: "en", label: "English" }],
  defaultExpandedLevelIds: ["foundation"],
  emptyLessonSection: {
    id: "notes",
    title: "Notes",
    kind: "cards",
    items: [{ es: "Hola.", en: "Hello." }],
  },
};

export default function FreeSpanishApp() {
  return <FreeLanguageApp api={api} config={config} />;
}
