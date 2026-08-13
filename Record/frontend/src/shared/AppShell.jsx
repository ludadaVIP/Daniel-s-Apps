import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, Home } from "lucide-react";

const SCROLL_THRESHOLD = 180;

/**
 * Thin top-bar wrapper shown above every sub-app. Provides a consistent
 * "back to hub" affordance so the user can always escape to the launcher.
 *
 * Sub-app components stay completely unaware of routing — they only need
 * to render their own UI inside the children slot.
 */
export default function AppShell({ label, accent = "#6366f1", children }) {
  const shellRef = useRef(null);
  const lastScrollTargetRef = useRef(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  function handleContentScroll(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement) || target.scrollHeight <= target.clientHeight) return;

    lastScrollTargetRef.current = target;
    setShowBackToTop(target.scrollTop > SCROLL_THRESHOLD);
  }

  useEffect(() => {
    function handleWindowScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      lastScrollTargetRef.current = window;
      setShowBackToTop(scrollTop > SCROLL_THRESHOLD);
    }

    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, []);

  function handleBackToTop() {
    const target = lastScrollTargetRef.current;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";

    if (target instanceof HTMLElement && shellRef.current?.contains(target)) {
      target.scrollTo({ top: 0, behavior });
      return;
    }

    window.scrollTo({ top: 0, behavior });
  }

  return (
    <div
      ref={shellRef}
      className="dh-shell"
      style={{ "--shell-accent": accent }}
      onScrollCapture={handleContentScroll}
    >
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
      <button
        type="button"
        className={`dh-back-to-top${showBackToTop ? " is-visible" : ""}`}
        onClick={handleBackToTop}
        aria-label="回到页面顶部"
        title="回到顶部"
      >
        <ArrowUp size={20} strokeWidth={2.25} />
      </button>
    </div>
  );
}
