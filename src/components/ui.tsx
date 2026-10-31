import type { ReactNode } from "react";
import type { AnchorHTMLAttributes } from "react";
import { scrollToTop } from "@/lib/router";
import { cn } from "@/utils/cn";

/** An internal link that also scrolls the new page back to the top. */
export function RouteLink({
  to,
  children,
  className,
  ...rest
}: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={to.startsWith("#") ? to : `#/${to}`}
      className={className}
      onClick={scrollToTop}
      {...rest}
    >
      {children}
    </a>
  );
}

export function Page({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="px-3 pt-24 pb-4 sm:px-5 sm:pt-28">
      <div className="mx-auto max-w-[1240px]">
        <div
          className={cn(
            "shell relative overflow-hidden rounded-[28px] px-4 py-12 sm:px-8 sm:py-16 lg:px-12",
            className
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function SectionTop({
  label,
  action,
}: {
  label: string;
  action?: { text: string; href: string };
}) {
  return (
    <div className="mb-8 flex items-center justify-between gap-4 border-b border-black/10 pb-4 dark:border-white/10">
      <p className="label-xs text-ink-400">{label}</p>
      {action && (
        <a
          href={action.href}
          target={action.href.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          className="label-xs group flex items-center gap-2 text-ink-600 transition-colors hover:text-sage-600 dark:text-ink-200"
        >
          {action.text}
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      )}
    </div>
  );
}

export function Card({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={cn(
        "surface reveal rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_-40px_rgba(0,0,0,.6)]",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-black/10 px-2.5 py-1 text-[10px] tracking-wide text-ink-600 dark:border-white/15 dark:text-ink-400">
      {children}
    </span>
  );
}

export function StatusPill({ status }: { status: string }) {
  const done = status === "Completed";
  return (
    <span
      className={cn(
        "label-xs rounded-full px-2.5 py-1",
        done
          ? "bg-sage-100 text-sage-700 dark:bg-sage-500/20 dark:text-sage-300"
          : "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300"
      )}
    >
      {status}
    </span>
  );
}
