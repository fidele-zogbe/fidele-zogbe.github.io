import robot from "@/assets/robot.jpg";
import { PROCESS_STEPS } from "@/js/script";
import { usePageMeta } from "@/lib/pageMeta";
import { IconArrow } from "@/components/Icons";
import { Page, SectionTop } from "@/components/ui";

export default function Process() {
  usePageMeta(
    "Process — Fidèle Togbédji ZOGBE",
    "How I approach a data project: exploratory data analysis, feature engineering, comparing several classification models, then publishing a documented project on GitHub.",
    "process"
  );

  return (
    <Page>
      <SectionTop label="Process" action={{ text: "See the projects", href: "#/projects" }} />

      <div className="grid gap-10 lg:grid-cols-[2.2fr_0.8fr]">
        <div>
          <h1 className="reveal font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.04] font-bold tracking-tight">
            How I work on a
            <br />
            <span className="text-sage-500">data project.</span>
          </h1>
          <p className="reveal mt-5 max-w-xl text-[15px] leading-relaxed text-ink-600 dark:text-ink-400">
            These are the steps I am following on my telecom customer churn project
            (still in progress), and the ones I plan to reuse on every dataset:
            start from the question, understand the data, compare several models
            honestly, then publish a project someone else can actually run.
          </p>

          <ol className="relative mt-12 border-l border-black/10 pl-8 dark:border-white/10">
            {PROCESS_STEPS.map((s, i) => (
              <li
                key={s.n}
                className="reveal relative pb-12 last:pb-0"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="absolute top-0 -left-[41px] grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white font-display text-[11px] font-bold text-sage-600 dark:border-white/15 dark:bg-ink-900">
                  {s.n}
                </span>
                <h2 className="font-display text-[16px] font-semibold">{s.title}</h2>
                <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-ink-600 dark:text-ink-400">
                  {s.body}
                </p>
                <p className="mt-3 inline-block rounded-lg bg-black/[0.04] px-3 py-2 text-[12.5px] text-ink-600 dark:bg-white/[0.05] dark:text-ink-400">
                  {s.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* side column */}
        <div className="space-y-4">
          <div className="reveal relative overflow-hidden rounded-2xl bg-sage-100 dark:bg-sage-500/10">
            <img
              src={robot}
              alt="Illustration of machine learning and automation"
              loading="lazy"
              className="animate-floaty w-full rounded-2xl object-cover mix-blend-multiply dark:mix-blend-normal dark:opacity-80"
            />
          </div>

          <div className="reveal surface rounded-2xl p-6">
            <p className="label-xs text-ink-400">The dataset</p>
            <p className="mt-3 font-display text-2xl font-bold">3,333</p>
            <p className="text-[12.5px] text-ink-600 dark:text-ink-400">customers</p>
            <p className="mt-4 font-display text-2xl font-bold">20</p>
            <p className="text-[12.5px] text-ink-600 dark:text-ink-400">features</p>
            <p className="mt-4 border-t border-black/10 pt-4 text-[12.5px] leading-relaxed text-ink-600 dark:border-white/10 dark:text-ink-400">
              The BigML telecom churn dataset: the goal is to predict which
              customers are likely to leave an operator.
            </p>
          </div>

          <div className="reveal surface rounded-2xl p-6">
            <p className="label-xs text-ink-400">The three models I compare</p>
            <ul className="mt-4 space-y-3">
              {[
                ["Logistic regression", "the simple baseline to beat"],
                ["Random forest", "robust, little tuning needed"],
                ["Gradient boosting", "usually the strongest on tabular data"],
              ].map(([m, why]) => (
                <li key={m} className="rounded-xl border border-black/10 px-4 py-3 dark:border-white/10">
                  <p className="font-display text-[13px] font-semibold">{m}</p>
                  <p className="mt-1 text-[12px] text-ink-600 dark:text-ink-400">{why}</p>
                </li>
              ))}
            </ul>
          </div>

          <a
            href="#/projects"
            className="reveal group flex items-center justify-between gap-3 rounded-2xl bg-ink-900 px-6 py-5 text-white transition-colors hover:bg-sage-600 dark:bg-sage-400 dark:text-ink-950 dark:hover:bg-sage-300"
          >
            <span className="label-xs">See the projects</span>
            <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </Page>
  );
}
