import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Hub from "./Hub.jsx";
import AppShell from "./shared/AppShell.jsx";

const RecordMeditationApp = lazy(() => import("./apps/record_meditation/App.jsx"));
const SaveMdApp = lazy(() => import("./apps/save_md/App.jsx"));
const BookADayApp = lazy(() => import("./apps/book_a_day/App.jsx"));

function LoadingScreen({ label }) {
  return (
    <div className="hub-loading">
      <div className="hub-loading-spinner" />
      <span>Loading {label}...</span>
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
      <Route
        path="/record-meditation"
        element={withShell("Record & Meditation", "#6a3f86", RecordMeditationApp)}
      />
      <Route
        path="/save-md"
        element={withShell("Save MD", "#178a58", SaveMdApp)}
      />
      <Route
        path="/book-a-day"
        element={withShell("A Book a Day", "#b25b00", BookADayApp)}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
