import portrait from "@/assets/portrait.jpg";
import coverage from "@/assets/proj-coverage.jpg";
import churn from "@/assets/proj-churn.jpg";
import football from "@/assets/proj-football.jpg";
import game from "@/assets/proj-game.jpg";
import survivor from "@/assets/proj-survivor.jpg";
import { PROFILE, PROJECTS, FEATURED } from "@/js/script";
import { repoSourceLabel, useGitHub } from "@/lib/github";
import { usePageMeta } from "@/lib/pageMeta";
import { IconArrow, IconGithub, IconMail } from "@/components/Icons";
import { Page } from "@/components/ui";
import CvMenu from "@/components/CvMenu";
import { cn } from "@/utils/cn";

const IMAGES: Record<string, string> = {
  "Football Club Financial Analysis": football,
  "Space Shooter": game,
  "Vampire Survivor": survivor,
  "Predicting Mobile Network Coverage Gaps in Benin": coverage,
  "Telecom Customer Churn Prediction": churn,
  "Advanced Calculator": game,
};

export default function Home() {
  usePageMeta(
    "Fidèle Togbédji ZOGBE | Data Science & Machine Learning",
    "Portfolio of Fidèle Togbédji ZOGBE, data science and machine learning student at EPAC, Benin. Python, pandas, scikit-learn, telecom data projects.",
    ""
  );

  const gh = useGitHub();
  const featured = FEATURED.map((title) =>
    PROJECTS.find((p) => p.title === title)
  ).filter(Boolean);

  return (
    <Page className="grid-lines px-5 sm:px-8 lg:px-12">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 xl:px-10">
        {/* intro */}
        <div className="reveal">
          <p className="font-display text-sm text-ink-400">Hello, I'm</p>
          <h1 className="mt-2 font-display text-[clamp(2.5rem,7.6vw,5rem)] leading-[0.94] font-bold tracking-tight">
            FIDÈLE
            <br />
            <span className="text-sage-500">ZOGBE</span>
          </h1>
          <p className="label-xs mt-4 text-ink-600 dark:text-ink-400">{PROFILE.headline}</p>

          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-600 dark:text-ink-400">
            {PROFILE.welcome}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#/projects"
              className="group flex items-center gap-2 rounded-full bg-sage-500 px-6 py-3.5 text-white transition-colors hover:bg-sage-600"
            >
              <span className="label-xs">View projects</span>
              <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#/contact"
              className="group flex items-center gap-2 rounded-full border border-black/15 px-6 py-3.5 transition-colors hover:border-sage-500 hover:text-sage-600 dark:border-white/20"
            >
              <span className="label-xs">Contact me</span>
              <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <CvMenu className="rounded-full px-3 py-3.5 text-ink-600 transition-colors hover:text-sage-600 dark:text-ink-200" />
          </div>

          {/* live GitHub numbers */}
          <div className="surface mt-9 max-w-md rounded-2xl p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="label-xs text-ink-400">Live from GitHub</p>
              <span className="label-xs flex items-center gap-1.5 text-sage-600 dark:text-sage-400">
                <span className="h-1.5 w-1.5 rounded-full bg-sage-500" />
                {repoSourceLabel(gh.source)}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="font-display text-3xl font-bold tabular-nums">
                  {gh.user?.followers ?? "—"}
                </p>
                <p className="mt-1 text-[12px] text-ink-400">Followers</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold tabular-nums">
                  {gh.user?.publicRepos ?? "—"}
                </p>
                <p className="mt-1 text-[12px] text-ink-400">Public repositories</p>
              </div>
            </div>
            <a
              href={`https://github.com/${PROFILE.githubUser}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center justify-between gap-2 rounded-xl border border-black/10 px-4 py-2.5 transition-colors hover:border-sage-400 dark:border-white/10"
            >
              <span className="label-xs">@{PROFILE.githubUser}</span>
              <IconGithub className="h-4 w-4 text-ink-400" />
            </a>
          </div>
        </div>

        {/* portrait */}
        <div className="reveal relative mx-auto w-full max-w-[440px]">
          <div className="absolute inset-0 -z-10 grid place-items-center">
            <div className="animate-spin-slow h-[86%] w-[86%] rounded-full border border-dashed border-sage-400/40" />
          </div>
          <div className="absolute inset-0 -z-10 grid place-items-center">
            <div className="h-[70%] w-[70%] rounded-full bg-sage-200/50 blur-2xl dark:bg-sage-500/10" />
          </div>
          <img
            src={portrait}
            alt={`Portrait of ${PROFILE.name}`}
            width={912}
            height={1136}
            decoding="async"
            fetchPriority="high"
            className="relative z-10 h-auto w-full rounded-[22px] object-cover"
          />

          <div className="surface animate-floaty absolute top-6 -right-2 z-20 w-[150px] rounded-2xl px-3.5 py-3 shadow-[0_20px_40px_-28px_rgba(0,0,0,.5)] sm:right-0">
            <p className="label-xs text-ink-400">Based in</p>
            <p className="mt-1 font-display text-[12px] leading-snug font-semibold">
              {PROFILE.location}
            </p>
          </div>
          <div className="surface animate-floaty absolute bottom-24 -left-2 z-20 w-[168px] rounded-2xl px-3.5 py-3 shadow-[0_20px_40px_-28px_rgba(0,0,0,.5)] sm:left-0">
            <p className="label-xs text-ink-400">Studying</p>
            <p className="mt-1 font-display text-[12px] leading-snug font-semibold">
              EPAC — 3rd year, GIT
            </p>
          </div>
          <div className="surface absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sage-500" />
            </span>
            <span className="label-xs">Open to internships</span>
          </div>
        </div>
      </div>

      {/* featured completed projects */}
      <div className="mt-14">
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-black/10 pb-4 dark:border-white/10">
          <p className="label-xs text-ink-400">Featured completed projects</p>
          <a
            href="#/projects"
            className="label-xs group flex items-center gap-2 text-ink-600 transition-colors hover:text-sage-600 dark:text-ink-200"
          >
            All projects
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {featured.map((p, i) => (
            <a
              key={p!.title}
              href={p!.link}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "reveal group surface flex flex-col overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-36px_rgba(0,0,0,.65)]"
              )}
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="relative overflow-hidden">
                {IMAGES[p!.title] ? (
                  <img
                    src={IMAGES[p!.title]}
                    alt={`${p!.title} — project visual`}
                    loading="lazy"
                    className="h-40 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  /* no screenshot yet: a plain cover, so no two cards share a picture */
                  <div
                    aria-hidden="true"
                    className="grid h-40 w-full place-items-center bg-gradient-to-br from-sage-100 to-sage-300 transition-transform duration-700 group-hover:scale-105 dark:from-sage-800 dark:to-sage-600"
                  >
                    <span className="font-display text-4xl font-bold tracking-tight text-sage-700/70 dark:text-sage-100/70">
                      {p!.title
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  </div>
                )}
                <span className="label-xs absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-ink-900 backdrop-blur">
                  {p!.status}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-[15px] leading-snug font-semibold">{p!.title}</h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-ink-600 dark:text-ink-400">
                  {p!.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p!.tools.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-black/10 px-2.5 py-1 text-[10px] tracking-wide text-ink-600 dark:border-white/15 dark:text-ink-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* quick links */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Read my story", sub: "About me", href: "#/about" },
          { label: "See how I work", sub: "Process", href: "#/process" },
          { label: "Get in touch", sub: "Contact", href: "#/contact" },
        ].map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            className="reveal group flex items-center justify-between gap-4 rounded-2xl border border-black/10 px-5 py-5 transition-colors hover:border-sage-400 hover:bg-sage-50 dark:border-white/10 dark:hover:bg-sage-500/10"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <span>
              <span className="label-xs block text-ink-400">{l.sub}</span>
              <span className="mt-1.5 block font-display text-[14px] font-semibold">{l.label}</span>
            </span>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-current text-ink-400 transition-all group-hover:border-sage-500 group-hover:text-sage-600">
              <IconArrow className="h-4 w-4" />
            </span>
          </a>
        ))}
      </div>

      <a
        href={`mailto:${PROFILE.email}`}
        className="group mt-10 inline-flex items-center gap-2 text-[12.5px] text-ink-400 transition-colors hover:text-sage-600"
      >
        <IconMail className="h-4 w-4" />
        Prefer email? Open your mail app
        <IconArrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </a>
    </Page>
  );
}
