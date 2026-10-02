import { useRouter, useRouterState } from "@tanstack/react-router";
import { LANGS, getDict, rememberLang, useT, type Lang } from "@/i18n";
import { cn } from "@/lib/utils";

export function swapLangInHref(href: string, lang: Lang) {
  return href.replace(/^\/(sq|en|fr|de)(?=\/|$|\?)/, `/${lang}`);
}

export function LanguageSwitcher({ className, onSwitch }: { className?: string; onSwitch?: () => void }) {
  const { lang, t } = useT();
  const router = useRouter();
  const href = useRouterState({ select: (s) => s.location.href });

  return (
    <nav aria-label={t.nav.language} className={cn("flex items-center", className)}>
      <ul className="flex flex-wrap items-center gap-1">
        {LANGS.map((l) => {
          const target = swapLangInHref(href, l);
          const active = l === lang;
          return (
            <li key={l}>
              <a
                href={target}
                hrefLang={l}
                lang={l}
                aria-current={active ? "true" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  rememberLang(l);
                  onSwitch?.();
                  router.navigate({ href: target, resetScroll: false });
                }}
                className={cn(
                  "inline-flex min-h-10 items-center rounded-sm px-2 text-sm transition-colors",
                  active ? "font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-[6px]" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {getDict(l).langName}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
