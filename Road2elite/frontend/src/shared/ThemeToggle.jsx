import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme.jsx";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === "dark" ? "浅色" : "深色";
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`切换到${nextTheme}模式`}
      title={`切换到${nextTheme}模式`}
    >
      {theme === "dark" ? <Sun size={17} strokeWidth={2} aria-hidden="true" /> : <Moon size={17} strokeWidth={2} aria-hidden="true" />}
      <span>{nextTheme}</span>
    </button>
  );
}
