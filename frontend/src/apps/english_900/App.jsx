import "./styles.css";

import { createNineHundredApp } from "../../shared/createNineHundredApp";

export default createNineHundredApp({
  appName: "English 900",
  prefix: "e900",
  apiBase: "/api/english-900",
  uiLocale: "en",
  brandSubtitle: "英中口语训练",
  defaultLevel: "A1-B2",
  primary: { field: "english", lang: "en", name: "English" },
  secondary: [{ field: "chinese", lang: "zh", name: "Chinese" }],
  example: {
    english: "I was wondering whether I could join your study group.",
    chinese: "我想问一下我能不能加入你们的学习小组。",
  },
});
