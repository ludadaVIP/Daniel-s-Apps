import { useCallback, useEffect, useRef } from "react";

export function useActiveItemScroll(activeId) {
  const itemRefs = useRef(new Map());

  const setItemRef = useCallback((id, node) => {
    if (!id) return;
    if (node) itemRefs.current.set(id, node);
    else itemRefs.current.delete(id);
  }, []);

  useEffect(() => {
    if (!activeId) return;

    const node = itemRefs.current.get(activeId);
    if (!node) return;

    const timer = window.setTimeout(() => {
      const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
      node.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "center",
        inline: "nearest",
      });
    }, 60);

    return () => window.clearTimeout(timer);
  }, [activeId]);

  return setItemRef;
}
