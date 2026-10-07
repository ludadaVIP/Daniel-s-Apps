import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { App } from './App';
import './styles.css';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/physics/*" element={<App />} />
        <Route path="*" element={<Navigate to="/physics" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
