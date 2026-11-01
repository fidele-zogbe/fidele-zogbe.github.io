import { useEffect, useRef, useState } from "react";
import { reply, CHIPS, WELCOME, type Answer, type Ctx } from "@/lib/chatbot";
import { useLang } from "@/lib/i18n";
import { scrollToTop } from "@/lib/router";

/* A bot message keeps the question and the context it was asked in, not the finished text,
   so it can be written again in the current language when the visitor switches. */
type Msg = { from: "me"; text: string } | { from: "bot"; q: string; ctx: Ctx };

export default function ChatBot() {
  const lang = useLang();
  const fr = lang === "fr";
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const ctx = useRef<Ctx>({});
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const timer = useRef<number>(0);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [msgs, typing, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else if (wasOpen.current) launcherRef.current?.focus(); /* keyboard users land back on the button */
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const ask = (q: string) => {
    const text = q.trim();
    if (!text || typing) return;
    setMsgs((m) => [...m, { from: "me", text }]);
    setDraft("");
    setTyping(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const before = ctx.current;
      const r = reply(text, before, lang);
      ctx.current = r.ctx;
      setMsgs((m) => [...m, { from: "bot", q: text, ctx: before }]);
      setTyping(false);
    }, 350);
  };

  /* every bot message is written in the language the page is in right now */
  const shown: { from: "bot" | "me"; answer: Answer }[] = [
    { from: "bot", answer: WELCOME(lang) },
    ...msgs.map((m) =>
      m.from === "me" ? { from: "me" as const, answer: { text: m.text } } : { from: "bot" as const, answer: reply(m.q, m.ctx, lang, true).answer }
    ),
  ];
  const last = msgs.length ? shown[shown.length - 1] : undefined;

  return (
    <div data-no-translate className="fixed right-4 bottom-4 z-[60] flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open && (
        <section
          role="dialog"
          aria-label={fr ? "Assistant du portfolio" : "Portfolio assistant"}
          className="flex h-[min(560px,calc(100dvh-7rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-ink-200 bg-white text-ink-900 shadow-2xl sm:w-[380px] dark:border-ink-600 dark:bg-ink-800 dark:text-ink-100"
        >
          <header className="flex items-center justify-between bg-sage-700 px-4 py-3 text-white">
            <div>
              <p className="font-display text-sm font-semibold">{fr ? "Posez vos questions sur Fidèle" : "Ask about Fidèle"}</p>
              <p className="text-xs text-sage-100">{fr ? "Les réponses viennent de ce portfolio" : "Answers come from this portfolio"}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={fr ? "Fermer le chat" : "Close chat"}
              className="rounded-full p-2 hover:bg-white/15"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm" aria-live="polite">
            {shown.map((m, i) => (
              <div key={i} className={m.from === "me" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    m.from === "me"
                      ? "max-w-[85%] rounded-2xl rounded-br-md bg-sage-600 px-3.5 py-2.5 text-white"
                      : "max-w-[90%] rounded-2xl rounded-bl-md bg-ink-100 px-3.5 py-2.5 dark:bg-ink-900"
                  }
                >
                  <p className="whitespace-pre-line leading-relaxed">{m.answer.text}</p>
                  {m.answer.links && m.answer.links.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {m.answer.links.map((l) => (
                        <a
                          key={l.label + l.href}
                          href={l.href}
                          {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : { onClick: () => { scrollToTop(); setOpen(false); } })}
                          className="rounded-full border border-sage-500 px-3 py-1 text-xs font-medium text-sage-800 hover:bg-sage-100 dark:text-sage-200 dark:hover:bg-ink-800"
                        >
                          {l.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-ink-100 px-3.5 py-2.5 text-ink-400 dark:bg-ink-900">{fr ? "Écriture…" : "Typing…"}</div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="flex gap-2 overflow-x-auto px-4 pb-2">
            {(last?.from === "bot" && last.answer.chips?.length ? last.answer.chips : CHIPS(lang)).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => ask(s)}
                className="shrink-0 rounded-full bg-sage-100 px-3 py-1.5 text-xs font-medium text-sage-900 hover:bg-sage-200 dark:bg-ink-900 dark:text-sage-200 dark:hover:bg-ink-600"
              >
                {s}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(draft);
            }}
            className="flex gap-2 border-t border-ink-200 p-3 dark:border-ink-600"
          >
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={200}
              placeholder={fr ? "Écrivez votre question…" : "Type your question…"}
              aria-label={fr ? "Votre question" : "Your question"}
              className="min-w-0 flex-1 rounded-full border border-ink-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-sage-500 dark:border-ink-600"
            />
            <button
              type="submit"
              aria-label={fr ? "Envoyer" : "Send"}
              className="rounded-full bg-sage-600 px-4 text-sm font-medium text-white hover:bg-sage-700"
            >
              {fr ? "Envoyer" : "Send"}
            </button>
          </form>
        </section>
      )}

      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? (fr ? "Fermer l'assistant" : "Close assistant") : (fr ? "Ouvrir l'assistant" : "Open assistant")}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-700 text-white shadow-xl hover:bg-sage-600"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
        </svg>
      </button>
    </div>
  );
}
