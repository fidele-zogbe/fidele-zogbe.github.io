import community from "@/assets/community.jpg";
import interests from "@/assets/interests.jpg";
import { PROFILE, SKILLS, CURRENTLY_LEARNING } from "@/js/script";
import { usePageMeta } from "@/lib/pageMeta";
import { ICONS } from "@/components/Icons";
import { Page, SectionTop } from "@/components/ui";

export default function About() {
  usePageMeta(
    "About — Fidèle Togbédji ZOGBE",
    "Who I am: a data science and machine learning student at EPAC in Abomey-Calavi, Benin, working with Python on telecom and infrastructure data.",
    "about"
  );

  return (
    <Page>
      <SectionTop label="About" action={{ text: "My GitHub profile", href: "https://github.com/fidele-zogbe" }} />

      <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <h1 className="reveal font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.04] font-bold tracking-tight">
            I learn by building things
            <br />
            <span className="text-sage-500">with real data.</span>
          </h1>

          <div className="reveal mt-7 max-w-2xl space-y-4 text-[15px] leading-relaxed text-ink-600 dark:text-ink-400">
            <p>
              I am {PROFILE.name}, a third-year student in {PROFILE.programme} at{" "}
              {PROFILE.university}. My coursework covers cybersecurity, software
              engineering and telecommunications, but the part I keep coming back to
              is data: cleaning it, questioning it, and building a model that answers
              a question someone actually has.
            </p>
            <p>
              I study data science independently, through the DataCamp Associate
              Data Scientist track and personal projects published on GitHub. My
              main project looks at mobile network coverage in Benin, combining
              cell-tower data from OpenCellID with population data to find the
              areas that are still underserved. I am also working on a telecom
              customer churn model.
            </p>
            <p>
              Before data, I wrote games in Python — Space Shooter and Vampire
              Survivor. They taught me how to structure a project, how to debug
              stubborn code, and how satisfying it is to watch something run.
            </p>
          </div>

          {/* where I am based */}
          <div className="reveal mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Based in", value: PROFILE.location },
              { label: "Originally from", value: PROFILE.origin },
              { label: "Studying at", value: "EPAC, Abomey-Calavi" },
            ].map((f) => (
              <div key={f.label} className="surface rounded-2xl p-5">
                <p className="label-xs text-ink-400">{f.label}</p>
                <p className="mt-2 font-display text-[14px] font-semibold">{f.value}</p>
              </div>
            ))}
          </div>

          {/* community and teaching */}
          <div className="reveal mt-10">
            <h2 className="font-display text-[15px] font-semibold">Community and teaching</h2>
            <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-600 dark:text-ink-400">
              I work in groups at EPAC, and I presented a Linux topic to my
              classmates as part of our coursework. Teaching a subject is where I
              noticed my own gaps: a project only really makes sense to me once I
              can explain it to someone else, step by step.
            </p>
            <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-ink-600 dark:text-ink-400">
              That is also why every project I publish on GitHub comes with a
              written README and a documented notebook — so another student can
              rerun it, question it and build on it.
            </p>
          </div>

          {/* interests */}
          <div className="reveal mt-10">
            <h2 className="font-display text-[15px] font-semibold">Interests</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                "Telecommunications and network infrastructure",
                "Machine learning for classification and forecasting",
                "Open data that answers local questions",
                "Python game development as a way to learn",
                "Web scraping and data collection",
                "Languages: French, English, Mandarin (HSK 1)",
              ].map((i) => (
                <li key={i} className="flex items-start gap-3 text-[13.5px] text-ink-600 dark:text-ink-400">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-400" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* side column */}
        <div className="space-y-4">
          <img
            src={community}
            alt="Students working together on a laptop during a group presentation"
            loading="lazy"
            className="reveal w-full rounded-2xl object-cover"
          />
          <div className="reveal surface rounded-2xl p-6">
            <p className="label-xs text-ink-400">At a glance</p>
            <dl className="mt-4 space-y-3">
              {[
                ["Programme", PROFILE.programme],
                ["University", PROFILE.university],
                ["Year", "Third year"],
                ["Expected graduation", PROFILE.graduation],
                ["Focus", "Data science & ML"],
                ["Learning", CURRENTLY_LEARNING.join(", ")],
              ].map(([k, v]) => (
                <div key={k} className="border-b border-black/5 pb-3 last:border-0 last:pb-0 dark:border-white/5">
                  <dt className="label-xs text-ink-400">{k}</dt>
                  <dd className="mt-1 font-display text-[13px] font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <img
            src={interests}
            alt="Desk with a laptop showing Python code, a notebook and a plant"
            loading="lazy"
            className="reveal w-full rounded-2xl object-cover"
          />
          <div className="reveal grid gap-px overflow-hidden rounded-2xl bg-black/10 dark:bg-white/10">
            {SKILLS.map((s) => {
              const Icon = ICONS[s.icon];
              return (
                <div key={s.title} className="bg-white p-5 dark:bg-ink-900">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-sage-100 text-sage-600 dark:bg-sage-500/15 dark:text-sage-300">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="mt-4 font-display text-[13.5px] font-semibold">{s.title}</h3>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-ink-600 dark:text-ink-400">
                    {s.lead}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Page>
  );
}
