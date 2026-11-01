import { SKILLS, CURRENTLY_LEARNING } from "@/js/script";
import { usePageMeta } from "@/lib/pageMeta";
import { ICONS } from "@/components/Icons";
import { Page, SectionTop } from "@/components/ui";

export default function Skills() {
  usePageMeta(
    "Skills — Fidèle Togbédji ZOGBE",
    "Data and AI, development and languages: Python, pandas, NumPy, scikit-learn, C, C++, web scraping, game development, Git, Linux, French, English, Mandarin.",
    "skills"
  );

  return (
    <Page>
      <SectionTop label="Skills" action={{ text: "See them in action", href: "#/projects" }} />

      <h1 className="reveal font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.04] font-bold tracking-tight">
        What I work with,
        <br />
        <span className="text-sage-500">and how I keep learning.</span>
      </h1>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {SKILLS.map((group, i) => {
          const Icon = ICONS[group.icon];
          return (
            <section
              key={group.title}
              className="reveal surface rounded-2xl p-7"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-sage-100 text-sage-600 dark:bg-sage-500/15 dark:text-sage-300">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-5 font-display text-[16px] font-semibold">{group.title}</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-600 dark:text-ink-400">
                {group.lead}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-black/10 px-3 py-1.5 font-display text-[12px] text-ink-600 transition-colors hover:border-sage-400 hover:text-sage-600 dark:border-white/15 dark:text-ink-200"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {/* learning now */}
      <div className="reveal mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl bg-sage-400 p-7 text-sage-900 dark:bg-sage-500/90 dark:text-ink-950">
          <p className="label-xs opacity-70">Currently learning</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {CURRENTLY_LEARNING.map((c) => (
              <span key={c} className="rounded-full bg-white/40 px-3 py-1.5 font-display text-[12px]">
                {c}
              </span>
            ))}
          </div>
          <p className="mt-5 text-[13.5px] leading-relaxed opacity-90">
            I learn by building: a project in Python first, then the same idea in
            SQL or JavaScript to see the difference in how each language thinks.
          </p>
        </div>
        <div className="surface rounded-2xl p-7">
          <p className="label-xs text-ink-400">How I use them</p>
          <ul className="mt-4 space-y-3">
            {[
              ["pandas", "Cleaning, joining and reshaping datasets"],
              ["scikit-learn", "Classification models and model comparison"],
              ["Matplotlib and seaborn", "Making the pattern in the data visible"],
              ["Git and GitHub", "Every project, documented and public"],
              ["Linux", "Daily environment and the command line"],
            ].map(([tool, use]) => (
              <li key={tool} className="flex items-baseline gap-3 text-[13.5px]">
                <span className="font-display text-[13px] font-semibold text-sage-600 dark:text-sage-400">
                  {tool}
                </span>
                <span className="text-ink-600 dark:text-ink-400">— {use}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Page>
  );
}
