/* English / French support.
   Every sentence on the site is written in English in the code. When the visitor
   picks French, the text on screen is swapped for the matching line of
   src/lib/fr.ts. To translate something new, add a line to that file. */
import { useSyncExternalStore } from "react";
import { FR } from "@/lib/fr";

export type Lang = "en" | "fr";
const KEY = "fz-lang";
const clean = (s: string) => s.replace(/\s+/g, " ").trim();

function initial(): Lang {
  try {
    const s = localStorage.getItem(KEY);
    if (s === "fr" || s === "en") return s;
  } catch {
    /* storage blocked */
  }
  return (navigator.language || "").toLowerCase().startsWith("fr") ? "fr" : "en";
}

let lang: Lang = initial();
const subs = new Set<() => void>();

export const getLang = () => lang;
export const trL = (s: string, l: Lang) => (l === "fr" ? FR[clean(s)] ?? s : s);
export const tr = (s: string) => trL(s, lang);

export function useLang(): Lang {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => lang
  );
}

export function setLang(next: Lang) {
  lang = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* ignore */
  }
  document.documentElement.lang = next;
  translateTree(document.body);
  subs.forEach((f) => f());
}

/* ---- swapping the text already on screen -------------------------------- */
const ATTRS = ["aria-label", "placeholder", "title", "alt"];
const textState = new WeakMap<Text, { orig: string; shown: string }>();
const attrState = new WeakMap<Element, Record<string, { orig: string; shown: string }>>();

const skip = (el: Element | null) =>
  !el || ["SCRIPT", "STYLE", "TEXTAREA"].includes(el.tagName) || !!el.closest("[data-no-translate]");
/* a textarea's typed text is never touched, but its placeholder is translated */
const skipAttrs = (el: Element) => !!el.closest("[data-no-translate]");

function doText(n: Text) {
  if (skip(n.parentElement)) return;
  const st = textState.get(n);
  let orig = n.nodeValue ?? "";
  if (st && orig === st.shown) orig = st.orig; /* we wrote this one: keep the English original */
  const key = clean(orig);
  if (!key) return;
  const fr = lang === "fr" ? FR[key] : undefined;
  const shown = fr ? (/^\s*/.exec(orig)![0] + fr + /\s*$/.exec(orig)![0]) : orig;
  if (shown !== n.nodeValue) n.nodeValue = shown;
  textState.set(n, { orig, shown });
}

function doAttrs(el: Element) {
  if (skipAttrs(el)) return;
  const all = attrState.get(el) ?? {};
  for (const a of ATTRS) {
    const cur = el.getAttribute(a);
    if (cur === null) continue;
    const st = all[a];
    const orig = st && cur === st.shown ? st.orig : cur;
    const fr = lang === "fr" ? FR[clean(orig)] : undefined;
    const shown = fr ?? orig;
    if (shown !== cur) el.setAttribute(a, shown);
    all[a] = { orig, shown };
  }
  attrState.set(el, all);
}

export function translateTree(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) return doText(root as Text);
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  const el = root as Element;
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let n: Node | null;
  while ((n = w.nextNode())) doText(n as Text);
  if (el.matches("[aria-label],[placeholder],[title],[alt]")) doAttrs(el);
  el.querySelectorAll("[aria-label],[placeholder],[title],[alt]").forEach(doAttrs);
}

export function initI18n() {
  document.documentElement.lang = lang;
  translateTree(document.body);
  new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === "childList") m.addedNodes.forEach(translateTree);
      else if (m.type === "characterData") doText(m.target as Text);
      else if (m.type === "attributes") doAttrs(m.target as Element);
    }
  }).observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ATTRS,
  });
}
