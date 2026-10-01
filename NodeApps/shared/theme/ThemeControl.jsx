import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { applyTheme, readThemePreference, THEME_STORAGE_KEY } from './theme.js';

export function useWorkspaceTheme() {
  const [preference, setPreference] = useState(readThemePreference);

  useEffect(() => {
    const syncStorage = (event) => { if (event.key === THEME_STORAGE_KEY) setPreference(readThemePreference()); };
    addEventListener('storage', syncStorage);
    return () => removeEventListener('storage', syncStorage);
  }, []);

  useEffect(() => { applyTheme(preference); }, [preference]);

  const toggleTheme = () => {
    const next = preference === 'light' ? 'dark' : 'light';
    setPreference(next);
    try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch { /* The current page still switches. */ }
  };

  return { preference, toggleTheme };
}

export default function ThemeControl({ preference, onToggle }) {
  const isDark = preference === 'dark';
  const Icon = isDark ? Moon : Sun;
  const nextLabel = isDark ? '浅色' : '深色';

  return <button className="workspace-theme-trigger" type="button" aria-label={`切换为${nextLabel}模式`} title={`切换为${nextLabel}模式`} onClick={onToggle}>
    <Icon size={17} strokeWidth={2} /><span>{isDark ? '深色' : '浅色'}</span>
  </button>;
}
