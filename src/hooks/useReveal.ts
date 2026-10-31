import { useEffect } from "react";

/** Adds `is-visible` to every `.reveal` element once it scrolls into view.
 *  `key` is the current page id, so animations replay on each new page.
 *
 *  Elements that appear later (the "Message sent" confirmation, the form after
 *  "Send another message", repositories that arrive from the GitHub API) are
 *  picked up by a MutationObserver — otherwise they would stay invisible. */
export function useReveal(key: string) {
  useEffect(() => {
    const showAll = () =>
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => el.classList.add("is-visible"));

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      showAll();
      if (typeof MutationObserver === "undefined") return;
      const mo = new MutationObserver(showAll);
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const watch = (el: HTMLElement) => {
      if (!el.classList.contains("is-visible")) io.observe(el);
    };

    document.querySelectorAll<HTMLElement>(".reveal").forEach(watch);

    const mo = new MutationObserver((records) => {
      records.forEach((r) =>
        r.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.classList.contains("reveal")) watch(node);
          node.querySelectorAll<HTMLElement>(".reveal").forEach(watch);
        })
      );
    });
    mo.observe(document.body, { childList: true, subtree: true });

    /* safety net: whatever is on screen 1.2 s after a page change must be visible */
    const rescue = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) el.classList.add("is-visible");
      });
    }, 1200);

    return () => {
      window.clearTimeout(rescue);
      mo.disconnect();
      io.disconnect();
    };
  }, [key]);
}

export function useDarkMode(dark: boolean) {
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
}
