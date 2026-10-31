import { useEffect, useRef, useState } from "react";
import { PAGES, useRoute } from "@/lib/router";
import { PROFILE } from "@/js/script";
import { IconArrow } from "./Icons";
import { RouteLink } from "./ui";
import { cn } from "@/utils/cn";

type Props = { dark: boolean; onToggleDark: () => void };

export default function Header({ dark, onToggleDark }: Props) {
  const route = useRoute();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  /* header background after scrolling */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close the mobile menu: Escape, a tap outside, or a link tap */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!open) return;
      const target = e.target as Element;
      /* the hamburger button toggles the menu itself — never treat it as "outside" */
      if (target.closest?.("[data-menu-button]")) return;
      if (panelRef.current && !panelRef.current.contains(target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  /* a route change always closes the menu */
  useEffect(() => setOpen(false), [route]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
      <div
        className={cn(
          "mx-auto flex max-w-[1240px] items-center justify-between gap-4 rounded-2xl px-4 py-3 transition-all duration-500 sm:px-5",
          scrolled || open
            ? "border border-black/10 bg-white/85 shadow-[0_18px_50px_-32px_rgba(0,0,0,.6)] backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/85"
            : "border border-transparent bg-transparent"
        )}
      >
        <RouteLink to="home" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink-900 font-display text-[13px] font-bold tracking-tight text-white dark:bg-sage-400 dark:text-ink-950">
            {PROFILE.initials}
          </span>
          <span className="font-display text-sm font-semibold tracking-[0.18em] uppercase">
            Fidèle <span className="text-ink-400">Zogbe</span>
          </span>
        </RouteLink>

        <nav aria-label="Main menu" className="hidden items-center gap-1 lg:flex">
          {PAGES.map((p) => (
            <RouteLink
              key={p.id}
              to={p.href}
              aria-current={route === p.id ? "page" : undefined}
              className={cn(
                "label-xs rounded-full px-3.5 py-2 transition-colors",
                route === p.id
                  ? "bg-sage-100 text-sage-700 dark:bg-sage-500/15 dark:text-sage-300"
                  : "text-ink-600 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white"
              )}
            >
              {p.label}
            </RouteLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <RouteLink
            to="contact"
            className="group hidden items-center gap-2 rounded-full bg-ink-900 px-4 py-2.5 text-white transition-colors hover:bg-sage-600 sm:flex dark:bg-sage-400 dark:text-ink-950 dark:hover:bg-sage-300"
          >
            <span className="label-xs">Let's talk</span>
            <IconArrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </RouteLink>
          <button
            onClick={onToggleDark}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            aria-pressed={dark}
            className="grid h-9 w-9 place-items-center rounded-full border border-black/10 text-ink-600 transition-colors hover:border-sage-400 hover:text-sage-600 dark:border-white/15 dark:text-ink-200"
          >
            {dark ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            data-menu-button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="grid h-9 w-9 place-items-center rounded-full border border-black/10 lg:hidden dark:border-white/15"
          >
            <span className="space-y-1">
              <span className={cn("block h-px w-4 bg-current transition-transform", open && "translate-y-[3px] rotate-45")} />
              <span className={cn("block h-px w-4 bg-current transition-transform", open && "-translate-y-[3px] -rotate-45")} />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          className="mx-auto mt-2 max-w-[1240px] rounded-2xl border border-black/10 bg-white p-3 shadow-xl lg:hidden dark:border-white/10 dark:bg-ink-900"
        >
          <nav aria-label="Mobile menu">
            {PAGES.map((p) => (
              <RouteLink
                key={p.id}
                to={p.href}
                aria-current={route === p.id ? "page" : undefined}
                className={cn(
                  "label-xs block rounded-xl px-4 py-3 transition-colors",
                  route === p.id
                    ? "bg-sage-50 text-sage-700 dark:bg-white/5 dark:text-sage-300"
                    : "text-ink-600 hover:bg-sage-50 hover:text-sage-700 dark:text-ink-200 dark:hover:bg-white/5"
                )}
              >
                {p.label}
              </RouteLink>
            ))}
          </nav>
          <a
            href={`mailto:${PROFILE.email}`}
            className="label-xs mt-1 block rounded-xl bg-ink-900 px-4 py-3 text-center text-white dark:bg-sage-400 dark:text-ink-950"
          >
            Send me an email
          </a>
        </div>
      )}
    </header>
  );
}
