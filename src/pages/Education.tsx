import { EDUCATION } from "@/js/script";
import { usePageMeta } from "@/lib/pageMeta";
import { Page, SectionTop } from "@/components/ui";

export default function Education() {
  usePageMeta(
    "Education — Fidèle Togbédji ZOGBE",
    "Engineering degree in Génie Informatique et Télécommunications at EPAC, baccalauréat at CEG 4 Bohicon, DataCamp Associate Data Scientist track and Mandarin learning.",
    "education"
  );

  return (
    <Page>
      <SectionTop label="Education" action={{ text: "Back to About", href: "#/about" }} />

      <div className="grid gap-10 lg:grid-cols-[0.8fr_2.2fr]">
        <h1 className="reveal font-display text-[clamp(1.8rem,3.6vw,2.5rem)] leading-[1.06] font-bold tracking-tight">
          Engineering school,
          <br />
          <span className="text-sage-500">and a lot of self-study.</span>
        </h1>

        <ol className="relative border-l border-black/10 pl-8 dark:border-white/10">
          {EDUCATION.map((e, i) => (
            <li
              key={e.title}
              className="reveal relative pb-10 last:pb-0"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="absolute top-1.5 -left-[37px] grid h-4 w-4 place-items-center rounded-full border-2 border-sage-500 bg-white dark:bg-ink-950" />
              <p className="label-xs text-sage-600 dark:text-sage-400">{e.period}</p>
              <h2 className="mt-2 font-display text-[15.5px] font-semibold">{e.title}</h2>
              <p className="mt-1 text-[13px] text-ink-400">{e.place}</p>
              <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-ink-600 dark:text-ink-400">
                {e.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Page>
  );
}
