import { Link } from "react-router-dom";
import { Home } from "lucide-react";

/**
 * Shared wrapper for every sub-app. Keeps a consistent, unobtrusive
 * "back to hub" affordance available without reserving a header row.
 *
 * Sub-app components stay completely unaware of routing — they only need
 * to render their own UI inside the children slot.
 */
export default function AppShell({ accent = "#6366f1", children }) {
  return (
    <div className="dh-shell" style={{ "--shell-accent": accent }}>
      <main className="dh-shell-content">{children}</main>
      <Link to="/" className="dh-return-to-hub" title="返回工作台">
        <Home size={16} strokeWidth={2.2} aria-hidden="true" />
        <span>返回工作台</span>
      </Link>
    </div>
  );
}
