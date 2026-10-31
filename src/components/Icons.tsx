type P = { className?: string };

const base = "h-full w-full";

export function IconChart({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} stroke="currentColor" strokeWidth="1.5">
      <path d="M3 20h18" strokeLinecap="round" />
      <rect x="5" y="11" width="3.5" height="6" rx="1" />
      <rect x="10.25" y="7" width="3.5" height="10" rx="1" />
      <rect x="15.5" y="4" width="3.5" height="13" rx="1" />
    </svg>
  );
}

export function IconBrain({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} stroke="currentColor" strokeWidth="1.5">
      <circle cx="6" cy="7" r="2.2" />
      <circle cx="6" cy="17" r="2.2" />
      <circle cx="18" cy="12" r="2.2" />
      <circle cx="12" cy="5" r="1.6" />
      <path d="M8 8.4l8 2.6M8 15.6l8-2.6M7.4 9v6M7 6.2l3.6-1" strokeLinecap="round" />
    </svg>
  );
}

export function IconCode({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} stroke="currentColor" strokeWidth="1.5">
      <path d="M8.5 7.5L4 12l4.5 4.5M15.5 7.5L20 12l-4.5 4.5M13.5 4.5l-3 15" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconGlobe({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.2-3.6-8.5S9.6 5.8 12 3.5z" />
    </svg>
  );
}

export function IconSignal({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="2" />
      <path d="M7.8 7.8a6 6 0 000 8.4M16.2 7.8a6 6 0 010 8.4M5 5a10 10 0 000 14M19 5a10 10 0 010 14" strokeLinecap="round" />
    </svg>
  );
}

export const ICONS: Record<string, (p: P) => React.ReactElement> = {
  chart: IconChart,
  brain: IconBrain,
  code: IconCode,
  globe: IconGlobe,
  signal: IconSignal,
};

export function IconArrow({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} stroke="currentColor" strokeWidth="1.6">
      <path d="M5 12h13M12.5 5.5L19 12l-6.5 6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconGithub({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? base}>
      <path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85l-.01 2.75c0 .27.18.58.69.48A10 10 0 0012 2z" />
    </svg>
  );
}

export function IconLinkedin({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? base}>
      <path d="M4.98 3.5A2.5 2.5 0 112.5 6 2.49 2.49 0 014.98 3.5zM3 8.98h4v12H3zM9.5 8.98h3.83v1.64h.05a4.2 4.2 0 013.78-2.08c4.04 0 4.79 2.66 4.79 6.12v6.32h-4v-5.6c0-1.34-.02-3.06-1.86-3.06-1.87 0-2.16 1.46-2.16 2.96v5.7h-4z" />
    </svg>
  );
}

export function IconKaggle({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? base}>
      <path d="M7.4 2h2.5v12.1l5.4-5.5h3.1l-5.6 5.5 5.9 7.9h-3l-4.3-6-1.5 1.5V22H7.4z" />
    </svg>
  );
}

export function IconYoutube({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? base}>
      <path d="M21.6 7.2a2.5 2.5 0 00-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 002.4 7.2 26 26 0 002 12a26 26 0 00.4 4.8 2.5 2.5 0 001.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 001.76-1.77A26 26 0 0022 12a26 26 0 00-.4-4.8zM10 15.5v-7l6 3.5z" />
    </svg>
  );
}

export function IconInstagram({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconFacebook({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? base}>
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.87.24-1.46 1.48-1.46H17V4.4A19 19 0 0014.7 4.3c-2.2 0-3.7 1.34-3.7 3.8V10.5H8.4v3h2.6V21z" />
    </svg>
  );
}

export function IconMail({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M4 7.5l8 5 8-5" strokeLinecap="round" />
    </svg>
  );
}

export function IconDownload({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} stroke="currentColor" strokeWidth="1.6">
      <path d="M12 4v11M7.5 11l4.5 4.5 4.5-4.5M5 19h14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCopy({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} stroke="currentColor" strokeWidth="1.6">
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M15 5.5A2.5 2.5 0 0012.5 3H6.5A2.5 2.5 0 004 5.5v6A2.5 2.5 0 006.5 14" strokeLinecap="round" />
    </svg>
  );
}

export function IconCheck({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} stroke="currentColor" strokeWidth="1.8">
      <path d="M5 12.5l4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const SOCIAL_ICONS: Record<string, (p: P) => React.ReactElement> = {
  github: IconGithub,
  linkedin: IconLinkedin,
  kaggle: IconKaggle,
  youtube: IconYoutube,
  instagram: IconInstagram,
  facebook: IconFacebook,
  mail: IconMail,
};
