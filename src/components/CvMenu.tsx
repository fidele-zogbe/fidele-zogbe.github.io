import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/js/script";
import { IconDownload } from "./Icons";
import { cn } from "@/utils/cn";

const OPTIONS = [
  { code: "EN", label: "English", file: PROFILE.cv },
  { code: "FR", label: "Français", file: PROFILE.cvFr },
];

/**
 * "Download CV" button that lets the visitor choose the English or the French PDF.
 * `className` styles the trigger button; `up` opens the menu upwards (used in the footer).
 */
export default function CvMenu({
  className,
  label = "Download CV",
  up = false,
  dark = false,
}: {
  className?: string;
  label?: string;
  up?: boolean;
  dark?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={box} className="relative inline-block">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn("group flex items-center gap-2", className)}
      >
        <IconDownload className="h-4 w-4" />
        <span className="label-xs">{label}</span>
        <svg
          viewBox="0 0 12 12"
          aria-hidden="true"
          className={cn("h-2.5 w-2.5 transition-transform", open && "rotate-180")}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.5 4.5L6 8l3.5-3.5" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute left-0 z-40 w-56 overflow-hidden rounded-2xl p-1.5 shadow-[0_24px_50px_-20px_rgba(0,0,0,.55)]",
            up ? "bottom-full mb-2" : "top-full mt-2",
            dark
              ? "bg-ink-800 text-white ring-1 ring-white/15"
              : "bg-white text-ink-900 ring-1 ring-black/10 dark:bg-ink-800 dark:text-white dark:ring-white/15"
          )}
        >
          {OPTIONS.map((o) => (
            <a
              key={o.code}
              role="menuitem"
              href={o.file}
              download
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 transition-colors hover:bg-sage-400 hover:text-ink-950"
            >
              <span className="flex items-center gap-3">
                <span className="label-xs grid h-7 w-9 place-items-center rounded-md bg-black/5 dark:bg-white/10">
                  {o.code}
                </span>
                <span className="text-[13px] font-medium">{o.label}</span>
              </span>
              <span className="label-xs opacity-60">PDF</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
