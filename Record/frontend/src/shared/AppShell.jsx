import { Link } from "react-router-dom";
import { Home } from "lucide-react";

/**
 * Thin top-bar wrapper shown above every sub-app. Provides a consistent
 * "back to hub" affordance so the user can always escape to the launcher.
 *
 * Sub-app components stay completely unaware of routing — they only need
 * to render their own UI inside the children slot.
 */
export default function AppShell({ label, accent = "#6366f1", children }) {
  return (
    <div className="dh-shell" style={{ "--shell-accent": accent }}>
      <header className="dh-shell-bar">
        <Link to="/" className="dh-shell-home" title="回到主页">
          <Home size={16} strokeWidth={2} />
          <span>主页</span>
        </Link>
        <span className="dh-shell-divider">/</span>
        <span className="dh-shell-label" style={{ color: accent }}>
          {label}
        </span>
      </header>
      <main className="dh-shell-content">{children}</main>
    </div>
  );
}
