import type { Virtualizer } from "@tanstack/virtual-core";

/**
 * Default TanStack Virtual rect observer can report 0×0 for overflow containers
 * (happy-dom, hydration). Fall back to the configured viewport height so rows mount.
 */
export function observeScrollElementRect<T extends Element>(
  instance: Virtualizer<T, Element>,
  cb: (rect: { width: number; height: number }) => void,
  fallbackHeight: number,
): void | (() => void) {
  const el = instance.scrollElement;
  if (!el) return;

  const measure = () => {
    const rect = el.getBoundingClientRect();
    cb({
      width: el.clientWidth || rect.width || 0,
      height: el.clientHeight || rect.height || fallbackHeight,
    });
  };

  measure();

  if (typeof ResizeObserver === "undefined") {
    return;
  }

  const observer = new ResizeObserver(measure);
  observer.observe(el);
  return () => observer.disconnect();
}
