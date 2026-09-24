import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './apps/ai_practice/App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>,
);
