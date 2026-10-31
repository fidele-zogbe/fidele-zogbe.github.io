import { useEffect, useState } from "react";
import { PAGES, scrollToTop } from "@/lib/router";
import { PROFILE, SOCIALS, TOOLS } from "@/js/script";
import { SOCIAL_ICONS, IconArrow, IconMail } from "./Icons";
import { RouteLink } from "./ui";
import CvMenu from "./CvMenu";

/** Local time in Benin (WAT), refreshed every 30 s — a small "someone is really here" detail. */
function useBeninTime() {
  const format = () => {
    try {
      return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Africa/Porto-Novo",
      }).format(new Date());
    } catch {
      return "";
    }
  };
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = window.setInterval(() => setTime(format()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export default function Footer() {
  const year = new Date().getFullYear();
  const time = useBeninTime();

  return (
    <footer className="px-3 py-4 sm:px-5">
      <div className="mx-auto max-w-[1240px]">
        <div className="relative isolate overflow-hidden rounded-[28px] ring-1 ring-(color:--f-line) footer-theme">
          {/* soft light and grid behind everything */}
          <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10 opacity-70" />
          <div
            aria-hidden="true"
            className="absolute -top-40 left-1/2 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-(color:--f-glow) blur-[110px]"
          />

          {/* ---------------------------------------------------------- call to action */}
          <div className="px-6 pt-14 pb-12 sm:px-10 lg:px-14 lg:pt-20">
            <p className="label-xs inline-flex items-center gap-2.5 rounded-full bg-(color:--f-soft) px-4 py-2 text-(color:--f-accent-text) ring-1 ring-(color:--f-ring)">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage-500 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sage-500" />
              </span>
              Open to internships &amp; remote collaborations
            </p>

            <h2 className="mt-7 max-w-3xl font-display text-[clamp(2rem,5.4vw,4rem)] leading-[1.02] font-bold tracking-tight text-(color:--f-strong)">
              Got a dataset, an internship
              <br className="hidden sm:block" /> or an idea?{" "}
              <span className="text-(color:--f-accent-text)">Let's talk.</span>
            </h2>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${PROFILE.email}`}
                className="group wobble-hover flex items-center gap-2.5 rounded-full bg-(color:--f-accent) px-7 py-4 text-(color:--f-on-accent) transition-colors hover:bg-(color:--f-accent-hover)"
              >
                <IconMail className="h-4 w-4" />
                <span className="label-xs">Send me an email</span>
                <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <CvMenu label="Download my CV" className="rounded-full px-7 py-4 text-(color:--f-strong) ring-1 ring-(color:--f-ring) transition-colors hover:bg-(color:--f-soft)" />
            </div>
          </div>

          {/* ---------------------------------------------------------- tools ribbon */}
          <div className="relative overflow-hidden border-y border-(color:--f-line) bg-(color:--f-soft) py-4" aria-hidden="true">
            <div className="animate-marquee flex w-max">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 items-center gap-10 pr-10">
                  {TOOLS.map((t) => (
                    <span key={`${copy}-${t}`} className="label-xs flex items-center gap-10 whitespace-nowrap text-(color:--f-mute)">
                      {t} <span className="text-(color:--f-accent-text)">✦</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ---------------------------------------------------------- link columns */}
          <div className="grid gap-12 px-6 pt-14 sm:px-10 lg:grid-cols-[1.3fr_0.6fr_1fr] lg:px-14">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sage-400 font-display text-sm font-bold text-ink-950">
                  {PROFILE.initials}
                </span>
                <span>
                  <span className="block font-display text-sm font-semibold tracking-[0.18em] text-(color:--f-strong) uppercase">
                    {PROFILE.shortName}
                  </span>
                  <span className="label-xs mt-1 block text-(color:--f-mute)">{PROFILE.headline}</span>
                </span>
              </div>
              <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-(color:--f-body)">
                {PROFILE.programme}, {PROFILE.university}. Building data science and machine
                learning projects on telecom and infrastructure problems in Benin and West Africa.
              </p>
              <p className="label-xs mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-(color:--f-mute)">
                <span>{PROFILE.location}</span>
                {time && (
                  <>
                    <span className="opacity-40">·</span>
                    <span className="tabular-nums">{time} local time</span>
                  </>
                )}
              </p>
            </div>

            <nav aria-label="Footer">
              <p className="label-xs text-(color:--f-mute)">Explore</p>
              <ul className="mt-5 space-y-3">
                {PAGES.map((p) => (
                  <li key={p.id}>
                    <RouteLink
                      to={p.href}
                      className="group inline-flex items-center text-[14px] text-(color:--f-body) transition-colors hover:text-(color:--f-accent-text)"
                    >
                      <span className="mr-0 h-px w-0 bg-sage-500 transition-all duration-300 group-hover:mr-2 group-hover:w-4" />
                      {p.label}
                    </RouteLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="label-xs text-(color:--f-mute)">Find me online</p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {SOCIALS.map((s) => {
                  const Icon = SOCIAL_ICONS[s.icon];
                  return (
                    <li key={s.label}>
                      <a
                        href={s.url ?? undefined}
                        target="_blank"
                        rel="noreferrer"
                        className="group wobble-hover flex items-center gap-3 rounded-2xl bg-(color:--f-soft) p-3 ring-1 ring-(color:--f-ring) transition-colors hover:bg-sage-400 hover:text-ink-950 hover:ring-sage-400"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-(color:--f-icon-bg) text-(color:--f-strong) transition-colors group-hover:bg-ink-950/10 group-hover:text-ink-950">
                          {Icon && <Icon className="h-4 w-4" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-[13px] font-semibold text-(color:--f-strong) group-hover:text-ink-950">
                            {s.label}
                          </span>
                          <span className="block truncate text-[11px] text-(color:--f-mute) group-hover:text-ink-950/70">
                            {s.handle}
                          </span>
                        </span>
                        <IconArrow className="h-3.5 w-3.5 shrink-0 -rotate-45 text-(color:--f-mute) transition-transform group-hover:rotate-0 group-hover:text-ink-950" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* ---------------------------------------------------------- giant wordmark */}
          <div
            aria-hidden="true"
            className="pointer-events-none mt-10 select-none overflow-hidden px-4 text-center leading-[0.8]"
          >
            <span className="footer-wordmark font-display font-bold tracking-tighter">ZOGBE</span>
          </div>

          {/* ---------------------------------------------------------- bottom bar */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-(color:--f-line) px-6 py-6 sm:flex-row sm:px-10 lg:px-14">
            <p className="text-[12px] text-(color:--f-mute)">
              © {year} {PROFILE.name}. Built with React and Tailwind CSS.
            </p>
            <button
              type="button"
              onClick={scrollToTop}
              className="group label-xs flex items-center gap-3 text-(color:--f-body) transition-colors hover:text-(color:--f-accent-text)"
            >
              Back to top
              <span className="grid h-9 w-9 place-items-center rounded-full border border-(color:--f-ring) transition-all group-hover:-translate-y-1 group-hover:border-sage-400 group-hover:bg-sage-400 group-hover:text-ink-950">
                <IconArrow className="h-4 w-4 -rotate-90" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
