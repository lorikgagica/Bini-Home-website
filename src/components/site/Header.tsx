import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useT } from "@/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { site } from "@/config/business";

export function Wordmark() {
  const { lang } = useT();
  return (
    <Link to="/$lang" params={{ lang }} className="font-serif text-[1.6rem] leading-none tracking-tight">
      Bini <span className="italic">Home</span>
    </Link>
  );
}

export function Header() {
  const { lang, t } = useT();
  const [open, setOpen] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const navItems = [
    { to: "/$lang/products", label: t.nav.products },
    { to: "/$lang/custom", label: t.nav.custom },
    { to: "/$lang/about", label: t.nav.about },
    { to: "/$lang/contact", label: t.nav.contact },
  ] as const;

  useEffect(() => {
    if (!open) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:bg-card focus:px-4 focus:py-2">
        {t.nav.skip}
      </a>
      {site.demoMode && (
        <div className="bg-ink px-5 py-2 text-center text-[0.8rem] leading-snug text-ink-foreground">{t.demo.banner}</div>
      )}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
        <div className="container-site flex h-16 items-center gap-6 lg:h-20">
          <Wordmark />
          <nav aria-label={t.nav.mainNav} className="ml-6 hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems.map((n) => (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    params={{ lang }}
                    className="rounded-sm px-3 py-2 text-[0.95rem] text-foreground/80 transition-colors hover:text-foreground"
                    activeProps={{ className: "text-foreground font-medium underline decoration-primary decoration-2 underline-offset-[10px]" }}
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto hidden items-center gap-5 lg:flex">
            <LanguageSwitcher />
            <Link to="/$lang/custom" params={{ lang }} hash="enquiry" className="btn-primary">
              {t.nav.quote}
            </Link>
          </div>
          <button
            type="button"
            className="btn-ghost ml-auto lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" aria-hidden />
            <span>{t.nav.menu}</span>
          </button>
        </div>
      </header>

      {open && (
        <div id="mobile-menu" role="dialog" aria-modal="true" aria-label={t.nav.menu} className="fixed inset-0 z-50 flex flex-col bg-background animate-in fade-in duration-200 lg:hidden">
          <div className="container-site flex h-16 items-center border-b">
            <Wordmark />
            <button ref={closeBtn} type="button" className="btn-ghost ml-auto" onClick={() => setOpen(false)}>
              <X className="size-5" aria-hidden />
              <span>{t.nav.closeMenu}</span>
            </button>
          </div>
          <nav aria-label={t.nav.mainNav} className="container-site flex-1 overflow-y-auto py-6">
            <ul className="divide-y border-y">
              {[{ to: "/$lang", label: t.nav.home } as const, ...navItems].map((n) => (
                <li key={n.to}>
                  <Link to={n.to} params={{ lang }} onClick={() => setOpen(false)} className="block py-4 font-serif text-2xl" activeOptions={{ exact: n.to === "/$lang" }} activeProps={{ className: "text-primary" }}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <p className="eyebrow mb-2">{t.nav.language}</p>
              <LanguageSwitcher onSwitch={() => setOpen(false)} />
            </div>
            <Link to="/$lang/custom" params={{ lang }} hash="enquiry" onClick={() => setOpen(false)} className="btn-primary mt-8 w-full">
              {t.nav.quote}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
