import { useCallback, useEffect, useState } from "react";

export const PAGES = [
  { id: "home", label: "Home", href: "#/home" },
  { id: "about", label: "About", href: "#/about" },
  { id: "projects", label: "Projects", href: "#/projects" },
  { id: "skills", label: "Skills", href: "#/skills" },
  { id: "process", label: "Process", href: "#/process" },
  { id: "education", label: "Education", href: "#/education" },
  { id: "contact", label: "Contact", href: "#/contact" },
] as const;

export type PageId = (typeof PAGES)[number]["id"];

const IDS = PAGES.map((p) => p.id);

function readHash(): PageId {
  const raw = window.location.hash.replace(/^#\/?/, "").split("?")[0];
  return (IDS as string[]).includes(raw) ? (raw as PageId) : "home";
}

/** Hash router — works on GitHub Pages with relative links, no server config. */
export function useRoute(): PageId {
  const [route, setRoute] = useState<PageId>(readHash);

  useEffect(() => {
    const onChange = () => setRoute(readHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}

export function useNavigate() {
  return useCallback((id: string) => {
    window.location.hash = `/${id}`;
  }, []);
}

/** Scrolls back to the top of a page (used when a menu link is clicked). */
export function scrollToTop() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}

/** Old bookmarks used `#about`, `#projects`… — send them to the matching page. */
const LEGACY_ANCHORS: Record<string, string> = {
  about: "about",
  projects: "projects",
  skills: "skills",
  education: "education",
  contact: "contact",
  process: "process",
  main: "home",
  top: "home",
};

export function redirectLegacyAnchors() {
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw || raw.startsWith("/")) return;
  const target = LEGACY_ANCHORS[raw.split("?")[0]];
  if (target) window.location.replace(`#/${target}`);
}
