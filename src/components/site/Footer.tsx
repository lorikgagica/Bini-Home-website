import { Link } from "@tanstack/react-router";
import { useT } from "@/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Address, ContactMethods, MapLink } from "./ContactDetails";

export function Footer() {
  const { lang, t } = useT();
  const year = new Date().getFullYear();
  const links = [
    { to: "/$lang", label: t.nav.home },
    { to: "/$lang/products", label: t.nav.products },
    { to: "/$lang/custom", label: t.nav.custom },
    { to: "/$lang/about", label: t.nav.about },
    { to: "/$lang/contact", label: t.nav.contact },
    { to: "/$lang/privacy", label: t.footer.privacy },
  ] as const;
  return (
    <footer className="mt-24 border-t bg-stone/60">
      <div className="container-site grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="font-serif text-3xl">Bini <span className="italic">Home</span></p>
          <p className="mt-3 max-w-xs text-muted-foreground">{t.footer.tagline}</p>
        </div>
        <nav aria-label={t.footer.navigation} className="md:col-span-3">
          <p className="eyebrow mb-3">{t.footer.navigation}</p>
          <ul className="space-y-1.5">
            {links.map((l) => (
              <li key={l.to}><Link to={l.to} params={{ lang }} className="link-u">{l.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-3">
          <p className="eyebrow mb-3">{t.footer.contact}</p>
          <Address />
          <div className="mt-2"><MapLink /></div>
          <div className="mt-4 text-[0.95rem]"><ContactMethods /></div>
        </div>
        <div className="md:col-span-2">
          <p className="eyebrow mb-2">{t.footer.languages}</p>
          <LanguageSwitcher className="-ml-2" />
        </div>
      </div>
      <div className="container-site border-t py-5 text-sm text-muted-foreground">
        © {year} Bini Home. {t.footer.rights}
      </div>
    </footer>
  );
}
