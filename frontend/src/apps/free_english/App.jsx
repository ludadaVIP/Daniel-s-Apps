import FreeLanguageApp from "../../shared/FreeLanguageApp";
import * as api from "./services/api";

const config = {
  accent: "#1d4ed8",
  brandMark: "FE",
  brandTitle: "Free English",
  brandSubtitle: "用中文自由学英语",
  kicker: "English / 中文",
  targetLanguage: { key: "en", label: "English" },
  supportLanguages: [{ key: "zh", label: "Chinese" }],
  defaultExpandedLevelIds: ["foundation"],
  emptyLessonSection: {
    id: "notes",
    title: "Notes",
    kind: "cards",
    items: [{ en: "Hello.", zh: "你好。" }],
  },
};

export default function FreeEnglishApp() {
  return <FreeLanguageApp api={api} config={config} />;
}
