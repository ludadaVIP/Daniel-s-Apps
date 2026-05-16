import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Hub from "./Hub.jsx";
import AppShell from "./shared/AppShell.jsx";

// Lazy load each sub-app so the hub stays light and an error in one app
// doesn't block the others.
const FrenchApp = lazy(() => import("./apps/french/App.jsx"));
const QuizApp = lazy(() => import("./apps/quiz/App.jsx"));
const LiveSpanishApp = lazy(() => import("./apps/live_spanish/App.jsx"));
const LanguageLabApp = lazy(() => import("./apps/language_lab/App.jsx"));
const BibleApp = lazy(() => import("./apps/bible/App.jsx"));
const TranslatorApp = lazy(() => import("./apps/translator/App.jsx"));
const AIPracticeApp = lazy(() => import("./apps/ai_practice/App.jsx"));
const GermanApp = lazy(() => import("./apps/german/App.jsx"));
const SpanishApp = lazy(() => import("./apps/spanish/App.jsx"));
const Spanish900App = lazy(() => import("./apps/spanish_900/App.jsx"));
const English900App = lazy(() => import("./apps/english_900/App.jsx"));

function LoadingScreen({ label }) {
  return (
    <div className="hub-loading">
      <div className="hub-loading-spinner" />
      <span>Loading {label}…</span>
    </div>
  );
}

function withShell(label, accent, Component) {
  return (
    <AppShell label={label} accent={accent}>
      <Suspense fallback={<LoadingScreen label={label} />}>
        <Component />
      </Suspense>
    </AppShell>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Hub />} />
      <Route path="/french" element={withShell("French Sprint", "#7c3aed", FrenchApp)} />
      <Route path="/quiz" element={withShell("English Adventure Quiz", "#f97316", QuizApp)} />
      <Route
        path="/live-spanish"
        element={withShell("Live Spanish", "#0ea5e9", LiveSpanishApp)}
      />
      <Route
        path="/lab"
        element={withShell("Language Output Lab", "#10b981", LanguageLabApp)}
      />
      <Route
        path="/bible"
        element={withShell("Recall Bible", "#8a3a2e", BibleApp)}
      />
      <Route
        path="/translator"
        element={withShell("Translator Trio", "#5662f6", TranslatorApp)}
      />
      <Route
        path="/ai-practice"
        element={withShell("AI Practice", "#2563eb", AIPracticeApp)}
      />
      <Route
        path="/german"
        element={withShell("German Sprint", "#854d0e", GermanApp)}
      />
      <Route
        path="/spanish"
        element={withShell("Español Sprint", "#be185d", SpanishApp)}
      />
      <Route
        path="/spanish-900"
        element={withShell("Spanish 900", "#0f766e", Spanish900App)}
      />
      <Route
        path="/english-900"
        element={withShell("English 900", "#2563eb", English900App)}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
