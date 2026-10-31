import CvMenu from "@/components/CvMenu";
import { useEffect, useRef, useState } from "react";
import contactImg from "@/assets/contact.jpg";
import { PROFILE } from "@/js/script";
import { usePageMeta } from "@/lib/pageMeta";
import { IconArrow, IconCheck, IconCopy, IconMail } from "@/components/Icons";
import { Page, SectionTop } from "@/components/ui";
import { cn } from "@/utils/cn";

/* FormSubmit forwards the message to my inbox — no server to maintain.
   If it is not activated yet, the form falls back to the visitor's mail app. */
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${PROFILE.email}`;

type Status = "idle" | "sending" | "sent" | "error";

const inputBase =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[13.5px] outline-none transition-colors placeholder:text-ink-400 focus:border-sage-500 dark:border-white/15 dark:bg-ink-950";

const fields = [
  { name: "name", label: "Your name", type: "text", placeholder: "Awa Mensah", autoComplete: "name" },
  { name: "email", label: "Your email", type: "email", placeholder: "you@example.com", autoComplete: "email" },
  { name: "company", label: "Company or school (optional)", type: "text", placeholder: "Where you work or study", autoComplete: "organization" },
] as const;

export default function Contact() {
  usePageMeta(
    "Contact — Fidèle Togbédji ZOGBE",
    "Get in touch with Fidèle Togbédji ZOGBE: send a message, or find me on GitHub, Kaggle, LinkedIn and YouTube. Open to internships, collaborations and conversations about data science.",
    "contact"
  );

  const [form, setForm] = useState({ name: "", email: "", company: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (status === "error") setStatus("idle");
    };

  const copyEmail = async () => {
    const address = PROFILE.email;
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = address;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 2400);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    /* a person never sees the spam-trap field; a bot fills it — pretend it worked */
    const trap = e.currentTarget.elements.namedItem("_honey") as HTMLInputElement | null;
    if (trap && trap.value) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company || "—",
          _subject: form.subject || `New message from ${form.name} — portfolio`,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      /* FormSubmit answers 200 even when the form is not activated yet —
         only treat the message as sent when it says so */
      const data = await res.json().catch(() => null);
      if (data && (data.success === false || data.success === "false")) {
        throw new Error("form not activated");
      }
      setStatus("sent");
      setForm({ name: "", email: "", company: "", subject: "", message: "" });
    } catch {
      /* the form service is unreachable or not activated yet — show a message,
         then hand the visitor over to their mail app with everything filled in */
      setStatus("error");
      const subject = encodeURIComponent(form.subject || "Hello Fidèle");
      const body = encodeURIComponent(
        `${form.message}\n\n— ${form.name}\n${form.email}${form.company ? `\n${form.company}` : ""}`
      );
      const url = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
      window.setTimeout(() => {
        window.location.href = url;
      }, 1200);
    }
  };

  return (
    <Page>
      <SectionTop label="Contact" action={{ text: "Send an email", href: `mailto:${PROFILE.email}` }} />

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        {/* ---------------------------------------------------------------- form */}
        <div>
          <h1 className="reveal font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.04] font-bold tracking-tight">
            Let's build something
            <br />
            <span className="text-sage-500">with data.</span>
          </h1>
          <p className="reveal mt-5 max-w-lg text-[15px] leading-relaxed text-ink-600 dark:text-ink-400">
            I am open to internships, collaborations and conversations about data
            science. Fill in the form and your message reaches me directly.
          </p>

          {status === "sent" ? (
            <div
              className="reveal surface mt-8 rounded-2xl p-8 text-center"
              role="status"
              aria-live="polite"
            >
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-sage-500 text-white">
                <IconCheck className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-[17px] font-semibold">Message sent</h2>
              <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-ink-600 dark:text-ink-400">
                Thank you for writing. I read every message and I usually reply
                within two working days.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="label-xs mt-6 rounded-full border border-black/15 px-5 py-3 transition-colors hover:border-sage-500 hover:text-sage-600 dark:border-white/20"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="reveal mt-8 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {fields.map((f) => (
                  <div key={f.name}>
                    <label htmlFor={f.name} className="label-xs block text-ink-400">
                      {f.label}
                    </label>
                    <input
                      id={f.name}
                      name={f.name}
                      type={f.type}
                      required={f.name !== "company"}
                      autoComplete={f.autoComplete}
                      placeholder={f.placeholder}
                      value={form[f.name]}
                      onChange={set(f.name)}
                      className={cn(inputBase, "mt-2")}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label htmlFor="subject" className="label-xs block text-ink-400">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Internship, collaboration, a question about a project…"
                  value={form.subject}
                  onChange={set("subject")}
                  className={cn(inputBase, "mt-2")}
                />
              </div>

              <div>
                <label htmlFor="message" className="label-xs block text-ink-400">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Tell me what you are working on, or just say hello."
                  value={form.message}
                  onChange={set("message")}
                  className={cn(inputBase, "mt-2 resize-y")}
                />
              </div>

              {/* spam trap — hidden from people, visible to bots */}
              <input
                type="text"
                name="_honey"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
              />

              {status === "error" && (
                <p
                  role="alert"
                  className="rounded-xl bg-amber-50 px-4 py-3 text-[12.5px] leading-relaxed text-amber-800 dark:bg-amber-400/10 dark:text-amber-200"
                >
                  The message could not be sent from the page, so your mail app has
                  opened with everything already filled in — just press send. You
                  can also use the email button next to the form.
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group flex items-center gap-2 rounded-full bg-sage-500 px-6 py-3.5 text-white transition-colors hover:bg-sage-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="label-xs">
                    {status === "sending" ? "Sending…" : "Send message"}
                  </span>
                  {status !== "sending" && (
                    <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </button>
                <p className="text-[12px] text-ink-400">
                  Or use the email buttons next to the form.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* -------------------------------------------------------------- details */}
        <div className="space-y-4">
          <img
            src={contactImg}
            alt="A workspace with a laptop showing Python code and charts"
            loading="lazy"
            className="reveal w-full rounded-2xl object-cover"
          />

          <div className="reveal surface rounded-2xl p-6">
            <p className="label-xs text-ink-400">Email</p>
            <p className="mt-2 font-display text-[15px] font-semibold">
              Write to me directly
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={`mailto:${PROFILE.email}`}
                className="group flex items-center gap-2 rounded-full bg-ink-900 px-5 py-3 text-white transition-colors hover:bg-sage-600 dark:bg-sage-400 dark:text-ink-950 dark:hover:bg-sage-300"
              >
                <IconMail className="h-4 w-4" />
                <span className="label-xs">Open my mail app</span>
              </a>
              <button
                type="button"
                onClick={copyEmail}
                aria-label="Copy my email address"
                className={cn(
                  "flex items-center gap-2 rounded-full border px-5 py-3 transition-colors",
                  copied
                    ? "border-sage-500 bg-sage-100 text-sage-700 dark:bg-sage-500/20 dark:text-sage-300"
                    : "border-black/15 hover:border-sage-500 hover:text-sage-600 dark:border-white/20"
                )}
              >
                <IconCopy className="h-4 w-4" />
                <span className="label-xs" role="status" aria-live="polite">
                  {copied ? "Copied" : "Copy address"}
                </span>
              </button>
              <CvMenu label="Download CV (PDF)" className="rounded-full border border-black/15 px-5 py-3 transition-colors hover:border-sage-500 hover:text-sage-600 dark:border-white/20" />
            </div>
          </div>

          <div className="reveal surface rounded-2xl p-6">
            <p className="label-xs text-ink-400">Available for</p>
            <p className="mt-2 font-display text-[14px] font-semibold">
              Internships and remote collaborations
            </p>
            <div className="mt-5 space-y-4 border-t border-black/10 pt-5 dark:border-white/10">
              {[
                ["Location", PROFILE.location],
                ["Programme", PROFILE.programme],
                ["University", PROFILE.university],
                ["Expected graduation", PROFILE.graduation],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="label-xs text-ink-400">{k}</p>
                  <p className="mt-1 font-display text-[13px] font-medium">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
