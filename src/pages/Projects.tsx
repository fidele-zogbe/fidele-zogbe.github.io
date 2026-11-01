import { PROJECTS, PLANNED } from "@/js/script";
import { repoSourceLabel, useGitHub } from "@/lib/github";
import { usePageMeta } from "@/lib/pageMeta";
import { useLang } from "@/lib/i18n";
import { IconArrow, IconGithub } from "@/components/Icons";
import { Page, SectionTop, StatusPill } from "@/components/ui";

export default function Projects() {
  const lang = useLang();
  /* 2026-10-29 -> "29 Oct 2026" / "29 oct. 2026" */
  const fmtDate = (iso: string) => {
    const d = new Date(`${iso}T00:00:00`);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
  };
  usePageMeta(
    "Projects — Fidèle Togbédji ZOGBE",
    "Data science and software projects by Fidèle Togbédji ZOGBE: mobile network coverage gaps in Benin, telecom churn prediction, football club financial analysis and Python games.",
    "projects"
  );

  const gh = useGitHub();
  const completed = PROJECTS.filter((p) => p.status === "Completed");
  const inProgress = PROJECTS.filter((p) => p.status === "In progress");

  /* repos that are not part of my own project list */
  const projectNames = new Set(PROJECTS.map((p) => p.title.toLowerCase()));
  const others = gh.repos.filter((r) => {
    const n = r.name.toLowerCase();
    if (r.fork) return false; /* forks of other people's work are not my projects */
    if (n.includes("introduction-to-github")) return false; /* GitHub tutorial clones */
    if (n === "fidele-zogbe.github.io") return false;
    if (n === "fidele-zogbe") return false; /* the GitHub profile README repo */
    if (projectNames.has(n)) return false;
    if (["space-shooter", "vampire-survivor", "advanced_calculator", "club_financial"].includes(n)) return false;
    return true;
  });

  return (
    <Page>
      <SectionTop label="Projects" action={{ text: "GitHub profile", href: "https://github.com/fidele-zogbe" }} />

      <h1 className="reveal font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.04] font-bold tracking-tight">
        Things I have built,
        <br />
        <span className="text-sage-500">and what I am building now.</span>
      </h1>

      {/* COMPLETED */}
      <section aria-labelledby="completed" className="mt-12">
        <div className="mb-6 flex items-center gap-3">
          <h2 id="completed" className="font-display text-[15px] font-semibold">
            Completed
          </h2>
          <span className="label-xs rounded-full bg-sage-100 px-2.5 py-1 text-sage-700 dark:bg-sage-500/20 dark:text-sage-300">
            {completed.length}
          </span>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {completed.map((p, i) => (
            <article
              key={p.title}
              className="reveal surface flex flex-col rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_-40px_rgba(0,0,0,.6)]"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="label-xs text-sage-600 dark:text-sage-400">{p.group}</p>
                <StatusPill status={p.status} />
              </div>
              <h3 className="mt-3 font-display text-[15.5px] leading-snug font-semibold">{p.title}</h3>
              <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-ink-600 dark:text-ink-400">
                {p.description}
              </p>
              <p className="mt-4 rounded-xl bg-black/[0.03] px-4 py-3 text-[12.5px] leading-relaxed text-ink-600 dark:bg-white/[0.04] dark:text-ink-400">
                <span className="label-xs text-ink-400">Result: </span>
                {p.result}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.tools.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-black/10 px-2.5 py-1 text-[10px] tracking-wide text-ink-600 dark:border-white/15 dark:text-ink-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="group mt-5 flex items-center justify-between gap-2 rounded-full border border-black/10 px-4 py-2.5 transition-colors hover:border-sage-400 hover:text-sage-600 dark:border-white/10"
              >
                <span className="label-xs">View on GitHub</span>
                <IconGithub className="h-4 w-4 text-ink-400 transition-transform group-hover:-rotate-12" />
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* IN PROGRESS */}
      <section aria-labelledby="inprogress" className="mt-14">
        <div className="mb-6 flex items-center gap-3">
          <h2 id="inprogress" className="font-display text-[15px] font-semibold">
            In progress
          </h2>
          <span className="label-xs rounded-full bg-amber-100 px-2.5 py-1 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">
            {inProgress.length}
          </span>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {inProgress.map((p, i) => (
            <article
              key={p.title}
              className="reveal surface flex flex-col rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_-40px_rgba(0,0,0,.6)]"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="label-xs text-sage-600 dark:text-sage-400">{p.group}</p>
                <StatusPill status={p.status} />
              </div>
              <h3 className="mt-3 font-display text-[15.5px] leading-snug font-semibold">{p.title}</h3>
              <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-ink-600 dark:text-ink-400">
                {p.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.tools.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-black/10 px-2.5 py-1 text-[10px] tracking-wide text-ink-600 dark:border-white/15 dark:text-ink-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="group mt-5 flex items-center justify-between gap-2 rounded-full border border-black/10 px-4 py-2.5 transition-colors hover:border-sage-400 hover:text-sage-600 dark:border-white/10"
              >
                <span className="label-xs">Follow on GitHub</span>
                <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* PLANNED */}
      <section aria-labelledby="planned" className="mt-14">
        <h2 id="planned" className="mb-6 font-display text-[15px] font-semibold">
          Planned next
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {PLANNED.map((p, i) => (
            <div
              key={p.title}
              className="reveal rounded-2xl border border-dashed border-black/15 p-5 dark:border-white/15"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <p className="label-xs text-ink-400">Idea</p>
              <h3 className="mt-2 font-display text-[14px] font-semibold">{p.title}</h3>
              <p className="mt-1 text-[13px] text-ink-600 dark:text-ink-400">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OTHER REPOSITORIES (live) */}
      {others.length > 0 && (
      <section aria-labelledby="repos" className="mt-14">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4 dark:border-white/10">
          <h2 id="repos" className="font-display text-[15px] font-semibold">
            My other repositories
          </h2>
          <span className="label-xs text-ink-400">{repoSourceLabel(gh.source)}</span>
        </div>
        <ul className="grid gap-3 md:grid-cols-2">
          {others.map((r, i) => (
            <li
              key={r.name}
              className="reveal surface flex items-start gap-4 rounded-2xl p-5"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sage-100 text-sage-600 dark:bg-sage-500/15 dark:text-sage-300">
                <IconGithub className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-display text-[13.5px] font-semibold hover:text-sage-600"
                  >
                    {r.name}
                  </a>
                  {r.fork && (
                    <span className="label-xs rounded-full border border-black/10 px-2 py-0.5 text-ink-400 dark:border-white/15">
                      Fork
                    </span>
                  )}
                  {r.language && (
                    <span className="text-[11px] text-ink-400">{r.language}</span>
                  )}
                </div>
                {r.description && (
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-600 dark:text-ink-400">
                    {r.description}
                  </p>
                )}
                <p className="mt-2 text-[11px] text-ink-400">Last push: {fmtDate(r.pushed)}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      )}
    </Page>
  );
}
