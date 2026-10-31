import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Projects from "@/pages/Projects";
import Skills from "@/pages/Skills";
import Process from "@/pages/Process";
import Education from "@/pages/Education";
import Contact from "@/pages/Contact";
import { useRoute, redirectLegacyAnchors } from "@/lib/router";
import { useDarkMode, useReveal } from "@/hooks/useReveal";

export default function App() {
  const route = useRoute();
  /* index.html already put the right class on <html> before React mounted */
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  /* old bookmarks (#about, #projects…) jump to the matching page */
  useEffect(() => {
    redirectLegacyAnchors();
  }, []);

  /* thin reading-progress bar at the very top of the window */
  useEffect(() => {
    const bar = document.getElementById("scroll-progress");
    if (!bar) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty("--p", String(max > 0 ? Math.min(1, window.scrollY / max) : 0));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [route]);

  useDarkMode(dark);
  useReveal(route);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    try {
      localStorage.setItem("fz-theme", next ? "dark" : "light");
    } catch {
      /* storage blocked (private mode) — the theme still changes for this visit */
    }
  };

  /* "#main" is not a page, so the skip link must not touch the hash router */
  const skipToContent = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const main = document.getElementById("main");
    main?.focus({ preventScroll: true });
    main?.scrollIntoView({ block: "start" });
  };

  /* a new page starts at the top, like a real multi-page site */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [route]);

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        onClick={skipToContent}
        className="label-xs sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-ink-900 focus:px-4 focus:py-3 focus:text-white"
      >
        Skip to content
      </a>

      <div id="scroll-progress" className="scroll-progress" aria-hidden="true" />
      <Header dark={dark} onToggleDark={toggle} />

      <main id="main" tabIndex={-1} className="outline-none">
        {route === "home" && <Home />}
        {route === "about" && <About />}
        {route === "projects" && <Projects />}
        {route === "skills" && <Skills />}
        {route === "process" && <Process />}
        {route === "education" && <Education />}
        {route === "contact" && <Contact />}
      </main>

      <Footer />
    </div>
  );
}
