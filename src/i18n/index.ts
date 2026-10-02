import { useParams } from "@tanstack/react-router";
import sq, { type Dict } from "./locales/sq";
import en from "./locales/en";
import fr from "./locales/fr";
import de from "./locales/de";
import { site } from "@/config/business";

export const LANGS = ["sq", "en", "fr", "de"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "sq";
export const LANG_STORAGE_KEY = "bini-lang";

const dicts: Record<Lang, Dict> = { sq, en, fr, de };

export const isLang = (v: unknown): v is Lang => LANGS.includes(v as Lang);
export const getDict = (lang: Lang): Dict => dicts[lang];

export const intlLocale: Record<Lang, string> = { sq: "sq-XK", en: "en-GB", fr: "fr-FR", de: "de-DE" };
export const ogLocale: Record<Lang, string> = { sq: "sq_XK", en: "en_GB", fr: "fr_FR", de: "de_DE" };

export function fmt(str: string, vars: Record<string, string | number>) {
  return str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

export function formatEUR(amount: number, lang: Lang) {
  return new Intl.NumberFormat(intlLocale[lang], { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount);
}

export function useLang(): Lang {
  const p = useParams({ strict: false }) as { lang?: string };
  return isLang(p.lang) ? p.lang : DEFAULT_LANG;
}

export function useT() {
  const lang = useLang();
  return { lang, t: getDict(lang) };
}

export function rememberLang(lang: Lang) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    document.cookie = `${LANG_STORAGE_KEY}=${lang}; path=/; max-age=31536000; samesite=lax`;
  } catch {
    /* storage unavailable */
  }
}

/** Builds head() metadata with canonical + reciprocal hreflang links. */
export function seo(lang: Lang, path: string, title: string, description: string, extra?: { image?: string; type?: string }) {
  const url = (l: Lang) => `${site.url}/${l}${path}`;
  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: extra?.type ?? "website" },
    { property: "og:url", content: url(lang) },
    { property: "og:locale", content: ogLocale[lang] },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
  if (site.demoMode) meta.push({ name: "robots", content: "noindex, nofollow" });
  const links = [
    { rel: "canonical", href: url(lang) },
    ...LANGS.map((l) => ({ rel: "alternate", hrefLang: l, href: url(l) })),
    { rel: "alternate", hrefLang: "x-default", href: url(DEFAULT_LANG) },
  ];
  return { meta, links };
}
