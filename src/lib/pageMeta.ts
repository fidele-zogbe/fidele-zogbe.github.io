import { useEffect } from "react";
import { trL, useLang } from "@/lib/i18n";

function upsertMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Gives every page its own title, description and link-preview metadata. */
export function usePageMeta(titleEn: string, descriptionEn: string, path: string) {
  const lang = useLang();
  const title = trL(titleEn, lang);
  const description = trL(descriptionEn, lang);
  useEffect(() => {
    document.title = title;
    upsertMeta('meta[name="description"]', "name", "description", description);
    upsertMeta('meta[property="og:title"]', "property", "og:title", title);
    upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    upsertMeta('meta[property="og:url"]', "property", "og:url", path ? `https://fidele-zogbe.github.io/#/${path}` : "https://fidele-zogbe.github.io/");
    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
  }, [title, description, path]);
}
