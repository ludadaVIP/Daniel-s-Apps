import FreeLanguageApp from "../../shared/FreeLanguageApp";
import * as api from "./services/api";

const config = {
  accent: "#7a4f16",
  brandMark: "FG",
  brandTitle: "Free German",
  brandSubtitle: "Deutsch frei lernen · Español / Français",
  kicker: "German / Español / Français",
  targetLanguage: { key: "de", label: "German" },
  supportLanguages: [
    { key: "es", label: "Spanish" },
    { key: "fr", label: "French" },
  ],
  defaultExpandedLevelIds: ["foundation"],
  emptyLessonSection: {
    id: "notes",
    title: "Notes",
    kind: "cards",
    items: [{ de: "Hallo.", es: "Hola.", fr: "Bonjour." }],
  },
};

export default function FreeGermanApp() {
  return <FreeLanguageApp api={api} config={config} />;
}
